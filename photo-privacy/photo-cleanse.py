"""
Image privacy API: blur faces and license plates, then turn the image into text.

POST /process   multipart form field "file" (jpg/png/webp)
Returns JSON:   image_base64 (blurred JPEG), faces_blurred, plates_blurred,
                text (visible text), description (one-line summary)

Faces and plates are detected on this server. Only the already blurred image
is sent to Gemini for the text step.

Run locally:    uvicorn photo-cleanse:app --host 0.0.0.0 --port 8000 --env-file .env
"""

import base64
import io
import json
import os
from contextlib import asynccontextmanager
from functools import lru_cache

import requests
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter, ImageOps

# ---------- config (set these as environment variables) ----------
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")                 # from Google AI Studio
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
GEMINI_BASE_URL = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com").rstrip("/")
FACE_MODEL_REPO = os.getenv("FACE_MODEL_REPO", "opencv/face_detection_yunet")
FACE_MODEL_FILE = os.getenv("FACE_MODEL_FILE", "face_detection_yunet_2023mar.onnx")
FACE_THRESHOLD = float(os.getenv("FACE_THRESHOLD", "0.4"))    # lower = catches more faces, blurs more
PLATE_MODEL = os.getenv("PLATE_MODEL", "nickmuchi/detr-resnet50-finetuned-license-plate-detection")
PLATE_THRESHOLD = float(os.getenv("PLATE_THRESHOLD", "0.5"))
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
MAX_UPLOAD_MB = 15

# The face model only finds faces between roughly 10 and 300 pixels wide, so each
# image is scanned at several sizes: enlarged to catch small background faces,
# and shrunk to catch close-ups.
FACE_SCALES = (2560, 960, 480, 240)
FACE_MAX_UPSCALE = float(os.getenv("FACE_MAX_UPSCALE", "2.0"))
FACE_LARGE_PX = 64            # faces at least this wide (in the original image) need the higher score
FACE_LARGE_THRESHOLD = float(os.getenv("FACE_LARGE_THRESHOLD", "0.6"))


@asynccontextmanager
async def lifespan(_app):
    # Load both models at startup so the first request is not slow.
    face_model_path()
    plate_detector()
    yield


app = FastAPI(title="Image privacy API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ---------- helpers ----------
def to_jpeg_bytes(img, max_side=None, quality=90):
    """Encode as JPEG, optionally downscaled. Returns (bytes, scale_used)."""
    scale = 1.0
    if max_side and max(img.size) > max_side:
        scale = max_side / max(img.size)
        img = img.resize((round(img.width * scale), round(img.height * scale)))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality)
    return buf.getvalue(), scale


def _iou(a, b):
    w = min(a[2], b[2]) - max(a[0], b[0])
    h = min(a[3], b[3]) - max(a[1], b[1])
    if w <= 0 or h <= 0:
        return 0.0
    inter = w * h
    return inter / ((a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter)


# ---------- face detection (local, YuNet) ----------
@lru_cache(maxsize=1)
def face_model_path():
    from huggingface_hub import hf_hub_download  # installed with transformers

    return hf_hub_download(FACE_MODEL_REPO, FACE_MODEL_FILE)


def detect_faces(img):
    """Returns a list of (left, top, right, bottom) boxes."""
    import cv2
    import numpy as np

    model = face_model_path()
    scored, seen = [], set()
    for max_side in FACE_SCALES:
        scale = min(FACE_MAX_UPSCALE, max_side / max(img.size))
        size = (max(1, round(img.width * scale)), max(1, round(img.height * scale)))
        if size in seen:
            continue  # small images collapse to the same size at several scales
        seen.add(size)
        small = img if size == img.size else img.resize(size)
        bgr = cv2.cvtColor(np.array(small), cv2.COLOR_RGB2BGR)
        detector = cv2.FaceDetectorYN.create(model, "", size, FACE_THRESHOLD, 0.3, 5000)
        _, faces = detector.detect(bgr)
        if faces is None:
            continue
        for row in faces:
            x, y, w, h = (float(v) / scale for v in row[:4])
            scored.append((float(row[-1]), (x, y, x + w, y + h)))

    # The same face is usually found at more than one scale; keep the best box for each.
    # Small faces are allowed a low score. Bigger ones must score well in at least one
    # pass, which removes large false boxes on things that are not faces.
    boxes = []
    for score, box in sorted(scored, reverse=True):
        if box[2] - box[0] >= FACE_LARGE_PX and score < FACE_LARGE_THRESHOLD:
            continue
        if all(_iou(box, kept) < 0.4 for kept in boxes):
            boxes.append(box)
    return boxes


# ---------- license plate detection (local) ----------
@lru_cache(maxsize=1)
def plate_detector():
    from transformers import pipeline  # heavy import, loaded once

    return pipeline("object-detection", model=PLATE_MODEL)


def detect_plates(img):
    boxes = []
    for det in plate_detector()(img, threshold=PLATE_THRESHOLD):
        label = det["label"].lower()
        if "vehicle" in label or label in ("car", "truck", "bus", "n/a"):
            continue  # skip background and whole-vehicle classes some plate models emit
        b = det["box"]
        boxes.append((b["xmin"], b["ymin"], b["xmax"], b["ymax"]))
    return boxes


# ---------- blur ----------
def blur_regions(img, boxes, pad=0.15):
    out = img.copy()
    for left, top, right, bottom in boxes:
        w, h = right - left, bottom - top
        box = (
            max(0, int(left - w * pad)),
            max(0, int(top - h * pad)),
            min(out.width, int(right + w * pad)),
            min(out.height, int(bottom + h * pad)),
        )
        if box[2] <= box[0] or box[3] <= box[1]:
            continue
        region = out.crop(box)
        radius = max(10, max(region.size) // 3)
        out.paste(region.filter(ImageFilter.GaussianBlur(radius)), box)
    return out


# ---------- image to text (Gemini) ----------
TEXT_PROMPT = (
    "You convert images to text. Reply with a JSON object with two keys: "
    '"text" (every piece of visible text, transcribed exactly, lines separated '
    'by newlines, empty string if none) and "description" (one plain sentence '
    "describing the image). Ignore blurred areas."
)


def extract_text(img):
    """Runs on the already blurred image, so plate numbers and faces never reach Gemini."""
    if not GEMINI_KEY:
        return {"text": None, "description": None}
    data, _ = to_jpeg_bytes(img, max_side=2048)
    resp = requests.post(
        f"{GEMINI_BASE_URL}/v1beta/models/{GEMINI_MODEL}:generateContent",
        headers={"x-goog-api-key": GEMINI_KEY, "Content-Type": "application/json"},
        json={
            "system_instruction": {"parts": [{"text": TEXT_PROMPT}]},
            "contents": [{
                "parts": [{"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(data).decode()}}]
            }],
            "generationConfig": {"response_mime_type": "application/json"},
        },
        timeout=60,
    )
    if not resp.ok:
        raise RuntimeError(f"Gemini returned {resp.status_code}: {resp.text[:300]}")
    body = resp.json()
    candidates = body.get("candidates") or []
    if not candidates:
        raise RuntimeError(f"Gemini returned no answer: {body.get('promptFeedback')}")
    parts = candidates[0].get("content", {}).get("parts", [])
    content = "".join(p.get("text", "") for p in parts if not p.get("thought"))
    if not content:
        raise RuntimeError(f"Gemini returned no text (finish reason: {candidates[0].get('finishReason')})")
    try:
        parsed = json.loads(content)
        return {"text": parsed.get("text", ""), "description": parsed.get("description", "")}
    except (json.JSONDecodeError, AttributeError):
        return {"text": content, "description": None}


# ---------- routes ----------
@app.get("/health")
def health():
    return {
        "ok": True,
        "face_detector": "local",
        "plate_detector": "local",
        "text_extraction": bool(GEMINI_KEY),
        "text_model": GEMINI_MODEL if GEMINI_KEY else None,
    }


@app.post("/process")
def process(file: UploadFile = File(...)):
    raw = file.file.read()
    if len(raw) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"Image is larger than {MAX_UPLOAD_MB} MB")
    try:
        img = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert("RGB")
    except Exception:
        raise HTTPException(400, "Could not read that file as an image")

    # Fail closed: if either detector errors, return an error, never the unblurred image.
    try:
        faces = detect_faces(img)
        plates = detect_plates(img)
    except Exception as exc:
        raise HTTPException(502, f"Detection failed: {exc}")

    # Face boxes are tight (brow to chin), so pad them more than plates.
    blurred = blur_regions(img, faces, pad=0.3)
    blurred = blur_regions(blurred, plates, pad=0.15)

    try:
        extracted = extract_text(blurred)
    except Exception as exc:
        extracted = {"text": None, "description": None, "text_error": str(exc)}

    out_bytes, _ = to_jpeg_bytes(blurred, quality=90)  # re-encoding also drops EXIF/GPS data
    return {
        "image_base64": base64.b64encode(out_bytes).decode(),
        "mime": "image/jpeg",
        "faces_blurred": len(faces),
        "plates_blurred": len(plates),
        **extracted,
    }
