# Image privacy

Tickets and their photos are public, so every photo is cleaned before it is stored: GPS and other hidden details are removed, and faces and license plates are blurred. Only the cleaned copy is ever saved, shown or sent to Gemini.

Two pieces do this:

| Piece | Code | Job |
|---|---|---|
| Ticket API | `api/photos.py` | Checks, rotates, shrinks and re-saves every upload; sends it to the privacy service |
| Photo privacy service | `photo-privacy/photo-cleanse.py` | Finds faces and plates and blurs them. A separate program because it needs about 2 GB of memory |

## What happens to an upload

1. **The web app** shrinks the photo and uploads it to `POST /uploads` as soon as it's chosen.
2. **The API checks it.** Only JPEG, PNG and WebP up to 12 MB and 50 megapixels are accepted; anything that doesn't decode as an image is refused.
3. **The API cleans it.** It rotates the photo the way the phone was held, converts it to RGB and shrinks it to at most 1600 px on a side.
4. **The privacy service blurs it** (when `PHOTO_PRIVACY_URL` is set). It finds faces and plates, blurs them, and returns the image with counts.
5. **The API saves a fresh JPEG** under a random name. Writing a new file leaves out the phone's GPS position, model and timestamp.
6. **The web app shows the stored version** and says how many faces and plates were hidden.

**It fails closed.** If the privacy service is set but can't be reached or returns something unusable, the upload is refused with `503` and nothing is stored. Without `PHOTO_PRIVACY_URL` (a laptop, or a server too small to run the service), photos are stored unblurred, and `faces_hidden` and `plates_hidden` come back `null`.

## How blurring works

Detection runs on the server itself, with no outside service:

| | Model | Threshold |
|---|---|---|
| Faces | OpenCV YuNet (`opencv/face_detection_yunet`) | `FACE_THRESHOLD` 0.4; faces 64 px and wider need 0.6 |
| License plates | DETR fine-tuned for plates (`nickmuchi/detr-resnet50-finetuned-license-plate-detection`) | `PLATE_THRESHOLD` 0.5 |

Faces are searched at four image sizes, so both small background faces and close-ups are caught; duplicate boxes are merged. Each box is padded (30% for faces, 15% for plates) and given a strong Gaussian blur scaled to its size. Lower thresholds catch more but blur more things that aren't faces or plates.

**How well it works**, on 40 random photos from the WIDER FACE benchmark (606 labeled faces):

| Face width | Blurred |
|---|---|
| 50 px and up | 66 of 66 |
| 20–50 px | 191 of 197 |
| Under 20 px | 202 of 343 |

Very small background faces are the weak spot.

## The privacy service

**Endpoint:** `POST /process` with multipart field `file` (up to 15 MB). It returns:

```json
{
  "image_base64": "…",        // blurred JPEG
  "mime": "image/jpeg",
  "faces_blurred": 1,
  "plates_blurred": 2,
  "text": "…",                 // visible text, read by Gemini from the blurred image
  "description": "…"           // one-sentence summary
}
```

The `text` and `description` fields come from Gemini, which only ever sees the blurred image. If that step fails, the blurred image still comes back, with `text_error`. If detection fails, the service returns `502` and never the unblurred image. `GET /health` reports what's enabled. The ticket API uses only the image and counts.

**Run it locally** (its own virtual environment; it installs PyTorch):

```powershell
cd photo-privacy
pip install -r requirements.txt
uvicorn photo-cleanse:app --port 8001 --env-file .env
```

Then set `PHOTO_PRIVACY_URL="http://127.0.0.1:8001"` in the root `.env` and restart the API. The first start downloads both models (about 320 MB). Try it at http://localhost:8001/docs.

**Settings** (`photo-privacy/.env`):

| Setting | Default | Does |
|---|---|---|
| `GEMINI_API_KEY` | unset | Text reading; without it, the service only blurs |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Model for text reading |
| `ALLOWED_ORIGINS` | `*` | Sites allowed to call it from a browser |
| `FACE_THRESHOLD`, `PLATE_THRESHOLD` | `0.4`, `0.5` | Detector sensitivity |
| `FACE_MIN_PX` | `10` | Faces narrower than this are left alone, since they're too small to recognize and usually aren't faces. Raise it if photos report faces that aren't there |

**On the live server**, `deploy/deploy.sh` installs it as the `avision-privacy` service and sets `PHOTO_PRIVACY_URL` when the server has at least about 2 GB of memory. The end of each deploy log says whether blurring is on. The `Dockerfile` in `photo-privacy/` runs it on any container host.

## Storage and cleanup

Photos live in `/var/lib/avision/uploads` on the server (`api/uploads/` locally, gitignored), outside the code folder so deploys never touch them. Tickets store only the path (`/uploads/<name>.jpg`). A photo is deleted with its ticket, and any photo no ticket uses is removed once it's an hour old (checked at startup and every 6 hours). The API stops accepting photos when less than 500 MB of disk is free.

In local dev, uploads go to the live server so every ticket's photo is in one place. Set `PHOTO_PROXY_TARGET=local` when starting Vite to keep them on your own API.
