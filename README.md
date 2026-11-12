# Yelp Sentiment API

A Flask API serving the exported Yelp sentiment model.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API is available at `http://localhost:5000`.

## Deploy

- **Render:** create a Web Service from this repository. Render can use `render.yaml`, or set the build command to `pip install -r requirements.txt` and the start command to `gunicorn app:app`.
- **Vercel:** import this repository as a project. `vercel.json` configures the Python function automatically.

The committed `outputs.zip` contains the model artifacts required at runtime.
