# Image privacy API

One endpoint. Send an image, get back the same image with faces and license plates blurred, plus the text found in it.

## Run it

```
pip install -r requirements.txt
cp .env.example .env        # then fill in your keys
uvicorn app:app --host 0.0.0.0 --port 8000 --env-file .env
```

Open http://localhost:8000/docs to upload a test image in the browser.
Tested on Python 3.13. Needs about 2 GB of RAM (it used about 900 MB in testing).

## Settings (.env)

| Setting | What it does | If blank |
|---|---|---|
| FACE_ENDPOINT, FACE_KEY | Azure Face resource for face detection | Uses a weaker local detector |
| AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT | Vision model deployment for image to text | Blurs only, text comes back null |
| ALLOWED_ORIGINS | Your site's address | Any site can call it |
| PLATE_THRESHOLD | Plate detector confidence, default 0.5 | Lower it if plates get missed |

Plate detection runs inside the app and needs no Azure resource.

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

## Put it online (Azure Container Apps)

These commands were not run during testing, so check the flags against `az containerapp up --help`.

```
az containerapp up --name image-privacy-api --resource-group YOUR_RG --location eastus \
  --source . --ingress external --target-port 8000 \
  --env-vars FACE_ENDPOINT=... FACE_KEY=... AZURE_OPENAI_ENDPOINT=... \
             AZURE_OPENAI_KEY=... AZURE_OPENAI_DEPLOYMENT=... ALLOWED_ORIGINS=https://yoursite.com

az containerapp update --name image-privacy-api --resource-group YOUR_RG \
  --cpu 1 --memory 2Gi --min-replicas 1
```

The second command matters: the default size (1 GB) is too small for the plate model.
