# Image privacy API

One endpoint. Send an image, get back the same image with faces and license plates blurred, plus the text found in it.

Faces and plates are found on the server itself. Only the already blurred image goes to Google Gemini, which reads the text.

## Run it

```
pip install -r requirements.txt
cp .env.example .env        # then paste in your Gemini key
uvicorn photo-cleanse:app --host 0.0.0.0 --port 8000 --env-file .env
```

Open http://localhost:8000/docs to upload a test image in the browser.
Tested on Python 3.13. Give it about 2 GB of RAM. The first start downloads two detection models (about 320 MB).

## Settings (.env)

| Setting | What it does | If blank |
|---|---|---|
| GEMINI_API_KEY | Key from Google AI Studio, used for image to text | Blurs only, text comes back null |
| GEMINI_MODEL | Which Gemini model reads the text | gemini-3.8-flash |
| ALLOWED_ORIGINS | Your site's address | Any site can call it |
| FACE_THRESHOLD | Face detector confidence, default 0.4 | Lower it if faces get missed |
| PLATE_THRESHOLD | Plate detector confidence, default 0.5 | Lower it if plates get missed |

Never commit `.env`. It is already listed in `.gitignore`.

## Call it from your site

```js
const API_URL = "https://your-api-address";

async function processImage(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/process`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail);
  return {
    src: `data:${data.mime};base64,${data.image_base64}`, // put this in an <img>
    text: data.text,
    description: data.description,
    faces: data.faces_blurred,
    plates: data.plates_blurred,
  };
}
```

Response fields: `image_base64`, `mime`, `faces_blurred`, `plates_blurred`, `text`, `description`.
If detection fails, the API returns an error and never the unblurred image.
If only the Gemini step fails, you still get the blurred image, with `text_error` explaining why.

## How well it blurs

Checked against 40 random photos from the WIDER FACE benchmark (606 labelled faces):

| Face width in the photo | Blurred |
|---|---|
| 50 px and up | 66 of 66 |
| 20 to 50 px | 191 of 197 |
| under 20 px | 202 of 343 |

Very small background faces are the weak spot. It sometimes blurs things that are not faces or plates.

## Put it online (Google Cloud Run)

This command was not run during testing, so check the flags against `gcloud run deploy --help`.

```
gcloud run deploy photo-cleanse --source . --region us-east1 --allow-unauthenticated \
  --memory 2Gi --cpu 1 --min-instances 1 \
  --set-env-vars GEMINI_API_KEY=...,ALLOWED_ORIGINS=https://yoursite.com
```

The Dockerfile works on any host that runs containers.
