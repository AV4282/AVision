FROM python:3.13-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1 HF_HOME=/app/.hf

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY photo-cleanse.py .
# Bake both detection models into the image so startup needs no download.
RUN python -c "import importlib; m = importlib.import_module('photo-cleanse'); m.face_model_path(); m.plate_detector()"

EXPOSE 8000
CMD ["sh", "-c", "uvicorn photo-cleanse:app --host 0.0.0.0 --port ${PORT:-8000}"]
