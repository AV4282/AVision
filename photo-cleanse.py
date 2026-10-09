"""
Image privacy API: blur faces and license plates, then turn the image into text.

POST /process   multipart form field "file" (jpg/png/webp)
Returns JSON:   image_base64 (blurred JPEG), faces_blurred, plates_blurred,
                text (visible text), description (one-line summary)

Run locally:    uvicorn app:app --host 0.0.0.0 --port 8000
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
FACE_ENDPOINT = os.getenv("FACE_ENDPOINT", "").rstrip("/")   # https://<name>.cognitiveservices.azure.com
FACE_KEY = os.getenv("FACE_KEY", "")
AOAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")       # https://<name>.openai.azure.com
AOAI_KEY = os.getenv("AZURE_OPENAI_KEY", "")
AOAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "")   # your vision model deployment name
AOAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21")
PLATE_MODEL = os.getenv("PLATE_MODEL", "nickmuchi/detr-resnet50-finetuned-license-plate-detection")
PLATE_THRESHOLD = float(os.getenv("PLATE_THRESHOLD", "0.5"))
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
MAX_UPLOAD_MB = 15

@asynccontextmanager
async def lifespan(_app):
    plate_detector()  # load the plate model at startup so the first request is not slow
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


# ---------- face detection ----------
def detect_faces(img):
    """Returns a list of (left, top, right, bottom) boxes."""
    if FACE_ENDPOINT and FACE_KEY:
        return _detect_faces_azure(img)
    return _detect_faces_opencv(img)  # local fallback when Azure Face is not configured


def _detect_faces_azure(img):
    # Face API caps uploads at 6 MB, so send a downscaled copy and scale boxes back up.
    data, scale = to_jpeg_bytes(img, max_side=1920)
    resp = requests.post(
        f"{FACE_ENDPOINT}/face/v1.0/detect",
        params={
            "detectionModel": "detection_03",
            "returnFaceId": "false",        # rectangles only, no Limited Access needed
            "returnFaceLandmarks": "false",
        },
        headers={
            "Ocp-Apim-Subscription-Key": FACE_KEY,
            "Content-Type": "application/octet-stream",
        },
        data=data,
        timeout=30,
    )
    resp.raise_for_status()
    boxes = []
    for face in resp.json():
        r = face["faceRectangle"]
        boxes.append((
            r["left"] / scale,
            r["top"] / scale,
            (r["left"] + r["width"]) / scale,
            (r["top"] + r["height"]) / scale,
        ))
    return boxes


def _detect_faces_opencv(img):
    import cv2
    import numpy as np

    gray = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    found = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return [(x, y, x + w, y + h) for (x, y, w, h) in found]


# ---------- license plate detection ----------
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


# ---------- image to text ----------
def extract_text(img):
    """Runs on the already blurred image, so plate numbers and faces never reach the model."""
    if not (AOAI_ENDPOINT and AOAI_KEY and AOAI_DEPLOYMENT):
        return {"text": None, "description": None}
    from openai import AzureOpenAI

    client = AzureOpenAI(azure_endpoint=AOAI_ENDPOINT, api_key=AOAI_KEY, api_version=AOAI_API_VERSION)
    data, _ = to_jpeg_bytes(img, max_side=2048)
    url = "data:image/jpeg;base64," + base64.b64encode(data).decode()
    resp = client.chat.completions.create(
        model=AOAI_DEPLOYMENT,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You convert images to text. Reply with a JSON object with two keys: "
                    '"text" (every piece of visible text, transcribed exactly, lines separated '
                    'by newlines, empty string if none) and "description" (one plain sentence '
                    "describing the image). Ignore blurred areas."
                ),
            },
            {"role": "user", "content": [{"type": "image_url", "image_url": {"url": url}}]},
        ],
    )
    content = resp.choices[0].message.content or ""
    try:
        parsed = json.loads(content)
        return {"text": parsed.get("text", ""), "description": parsed.get("description", "")}
    except json.JSONDecodeError:
        return {"text": content, "description": None}


# ---------- routes ----------
@app.get("/health")
def health():
    return {
        "ok": True,
        "face_detector": "azure" if (FACE_ENDPOINT and FACE_KEY) else "opencv-fallback",
        "text_extraction": bool(AOAI_ENDPOINT and AOAI_KEY and AOAI_DEPLOYMENT),
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

    blurred = blur_regions(img, faces + plates)

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
