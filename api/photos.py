"""
Photo storage for tickets.

An uploaded photo is checked, cleaned and saved as a JPEG in UPLOAD_DIR, and the
ticket stores its path, e.g. "/uploads/3f2a....jpg" (tickets.photo_url). The web
app turns the path into a link, so the same ticket works on every site. Cleaning means the file is decoded
and written out again, which:
  - proves it really is an image (anything else is refused),
  - drops the hidden details phones add, such as the GPS position and phone model,
  - turns it the right way up and shrinks it to at most 1600 px a side.

Faces and license plates are NOT blurred here. That is the job of the photo
privacy service (photo-privacy/), which is not connected yet.
"""

import io
import os
import re
import shutil
import time
import uuid
import warnings
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

# Where photos are kept. Locally: api/uploads/. On the server: /var/lib/avision/uploads
# (set in deploy/avision-api.service), outside the code folder so deploys never touch it.
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR") or Path(__file__).parent / "uploads")

MAX_BYTES = int(os.getenv("UPLOAD_MAX_MB", "12")) * 1024 * 1024
MAX_SIDE = 1600  # pixels, longest side of the saved photo
MIN_FREE_BYTES = 500 * 1024 * 1024  # stop taking photos before the disk fills up
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
NAME_PATTERN = re.compile(r"^[0-9a-f]{32}\.jpg$")
# What tickets.photo_url holds: the path this API serves a photo at.
PATH_PATTERN = re.compile(r"^/uploads/[0-9a-f]{32}\.jpg$")
# A photo with no ticket is kept this long, so a ticket being posted right after
# its photo upload never loses the photo.
UNUSED_GRACE_SECONDS = 60 * 60

# A small file can unpack into a huge picture and eat all the memory. Refuse anything
# over 50 megapixels (the web app shrinks photos before sending, so real ones are far smaller).
Image.MAX_IMAGE_PIXELS = 50_000_000
warnings.simplefilter("error", Image.DecompressionBombWarning)


class BadPhoto(Exception):
    """The upload isn't a photo we can use. The message is safe to show the user."""


class StorageFull(Exception):
    """The disk is nearly full, so no more photos are accepted."""


def prepare():
    """Create the photo folder and make sure we can write to it. Called at startup."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    # Keeps photos out of git when the folder is inside the repo (local development).
    ignore = UPLOAD_DIR / ".gitignore"
    if not ignore.exists():
        ignore.write_text("*\n")
    probe = UPLOAD_DIR / ".write-test"
    probe.write_bytes(b"")
    probe.unlink()


def save_photo(data: bytes) -> str:
    """Clean the image in `data`, save it, and return its file name (e.g. '3f2a....jpg')."""
    if shutil.disk_usage(UPLOAD_DIR).free < MIN_FREE_BYTES:
        raise StorageFull

    try:
        with Image.open(io.BytesIO(data)) as original:
            if original.format not in ALLOWED_FORMATS:
                raise BadPhoto("Use a JPEG, PNG or WebP photo.")
            colors = original.info.get("icc_profile")  # keeps colors true; holds nothing personal
            photo = ImageOps.exif_transpose(original)  # turn it the way the phone was held
            photo = photo.convert("RGB")
            photo.thumbnail((MAX_SIDE, MAX_SIDE))
    except BadPhoto:
        raise
    except (Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise BadPhoto("That photo is too large. Try a smaller one.") from None
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError):
        # Pillow raises these for files that are damaged or not images at all.
        raise BadPhoto("That file isn't a photo we can read. Use a JPEG, PNG or WebP.") from None

    # A random name, so nobody can guess other photos' links or overwrite one.
    name = f"{uuid.uuid4().hex}.jpg"
    # Write under a temporary name first, so a half-written file is never served.
    temporary = UPLOAD_DIR / f".{name}.part"
    # Saving a fresh copy leaves out the phone's hidden details (position, model, time).
    photo.save(temporary, "JPEG", quality=85, optimize=True, icc_profile=colors)
    temporary.replace(UPLOAD_DIR / name)
    return name


def find(name: str) -> Path | None:
    """The saved photo with this name, or None. Only names we generate are accepted."""
    if not NAME_PATTERN.fullmatch(name):
        return None
    path = UPLOAD_DIR / name
    return path if path.is_file() else None


def name_in(photo_url: str | None) -> str | None:
    """The file name a ticket's photo_url points at, or None.

    Also reads older full links like "https://site/api/uploads/<name>.jpg".
    """
    match = re.search(r"/uploads/([0-9a-f]{32}\.jpg)$", photo_url or "")
    return match.group(1) if match else None


def remove_unused(names_in_use: set[str]) -> int:
    """Delete stored photos that no ticket uses, once past the grace period.

    Covers deleted tickets and uploads whose ticket was never posted. Returns how
    many files were removed. Only our own file names are ever touched.
    """
    cutoff = time.time() - UNUSED_GRACE_SECONDS
    removed = 0
    for path in UPLOAD_DIR.iterdir():
        name = path.name
        if name.startswith(".") and name.endswith(".part"):
            name = name[1:-len(".part")]  # leftover from an upload that crashed midway
        elif name in names_in_use:
            continue
        if not NAME_PATTERN.fullmatch(name) or not path.is_file():
            continue
        try:
            if path.stat().st_mtime < cutoff:
                path.unlink()
                removed += 1
        except FileNotFoundError:
            pass  # already gone
    return removed


def delete(name: str | None) -> bool:
    """Delete one stored photo, e.g. when its ticket is deleted. True if a file was removed.

    A photo stored by another server (in local dev, photos live on the live site)
    isn't here; that server's cleanup removes it once no ticket uses it.
    """
    path = find(name) if name else None
    if path is None:
        return False
    try:
        path.unlink()
        return True
    except FileNotFoundError:
        return False
