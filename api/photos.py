"""
Photo storage for tickets.

An uploaded photo is checked, cleaned and saved as a JPEG in UPLOAD_DIR, and the
ticket stores its path, e.g. "/uploads/3f2a....jpg" (tickets.photo_url). The web
app turns the path into a link, so the same ticket works on every site. Cleaning means the file is decoded
and written out again, which:
  - proves it really is an image (anything else is refused),
  - drops the hidden details phones add, such as the GPS position and phone model,
  - turns it the right way up and shrinks it to at most 1600 px a side.

Faces and license plates are hidden by the photo privacy service
(photo-privacy/), a separate program, because it needs far more memory than this
API. When PHOTO_PRIVACY_URL points at it, every photo goes through it before it
is stored, so the saved file, the one the public and Gemini see, never shows
them. If the service can't be reached the upload is refused; a photo is never
stored unchecked. Without the setting (a laptop, or a server too small to run
the service) photos are stored as they are, and the upload's answer says so.
"""

import base64
import io
import json
import logging
import os
import re
import shutil
import time
import urllib.request
import uuid
import warnings
from dataclasses import dataclass
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

# The photo privacy service, e.g. "http://127.0.0.1:8001". Empty means it isn't used.
PRIVACY_URL = os.getenv("PHOTO_PRIVACY_URL", "").strip().rstrip("/")
PRIVACY_TIMEOUT_SECONDS = 60  # finding faces and plates takes a few seconds on a small server

# The service is on this machine or a private network, so never send photos via a web proxy.
_direct = urllib.request.build_opener(urllib.request.ProxyHandler({}))

log = logging.getLogger("avision.photos")

# A small file can unpack into a huge picture and eat all the memory. Refuse anything
# over 50 megapixels (the web app shrinks photos before sending, so real ones are far smaller).
Image.MAX_IMAGE_PIXELS = 50_000_000
warnings.simplefilter("error", Image.DecompressionBombWarning)


class BadPhoto(Exception):
    """The upload isn't a photo we can use. The message is safe to show the user."""


class StorageFull(Exception):
    """The disk is nearly full, so no more photos are accepted."""


class PrivacyUnavailable(Exception):
    """The photo couldn't be checked for faces and plates, so it was not stored."""


@dataclass
class Saved:
    """A stored photo. The counts are None when the privacy service isn't in use."""

    name: str  # file name, e.g. "3f2a....jpg"
    faces_hidden: int | None = None
    plates_hidden: int | None = None


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


def save_photo(data: bytes) -> Saved:
    """Clean the image in `data`, hide faces and plates, and save it."""
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

    faces = plates = None
    if PRIVACY_URL:
        photo, faces, plates = _hide_faces_and_plates(photo)

    # A random name, so nobody can guess other photos' links or overwrite one.
    name = f"{uuid.uuid4().hex}.jpg"
    # Write under a temporary name first, so a half-written file is never served.
    temporary = UPLOAD_DIR / f".{name}.part"
    # Saving a fresh copy leaves out the phone's hidden details (position, model, time).
    photo.save(temporary, "JPEG", quality=85, optimize=True, icc_profile=colors)
    temporary.replace(UPLOAD_DIR / name)
    return Saved(name, faces, plates)


def _hide_faces_and_plates(photo: Image.Image) -> tuple[Image.Image, int, int]:
    """Send the photo through the privacy service. Returns the blurred photo and what was hidden.

    Raises PrivacyUnavailable if the service can't be reached or its answer can't
    be used. The caller then stores nothing, so an unchecked photo is never published.
    """
    sending = io.BytesIO()
    photo.save(sending, "JPEG", quality=95)  # high quality: the saved copy is made from what comes back
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="file"; filename="photo.jpg"\r\n'
        "Content-Type: image/jpeg\r\n\r\n"
    ).encode() + sending.getvalue() + f"\r\n--{boundary}--\r\n".encode()
    request = urllib.request.Request(
        PRIVACY_URL + "/process",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    try:
        with _direct.open(request, timeout=PRIVACY_TIMEOUT_SECONDS) as reply:
            answer = json.load(reply)
        with Image.open(io.BytesIO(base64.b64decode(answer["image_base64"]))) as returned:
            blurred = returned.convert("RGB")
        if blurred.size != photo.size:
            raise ValueError(f"the photo came back as {blurred.size}, not {photo.size}")
        return blurred, int(answer["faces_blurred"]), int(answer["plates_blurred"])
    except Exception as problem:  # offline, slow, an error status, or an answer that isn't a photo
        log.warning("Photo privacy service failed: %s: %s", type(problem).__name__, problem)
        raise PrivacyUnavailable from problem


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
