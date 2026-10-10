"""
Photo storage for tickets.

An uploaded photo is checked, cleaned and saved as a JPEG in UPLOAD_DIR, and the
ticket stores a link to it (tickets.photo_url). Cleaning means the file is decoded
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
