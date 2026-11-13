# Yelp Sentiment API

A Flask API and web dashboard serving the exported Yelp sentiment model.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API is available at `http://localhost:5000`.
Open the same URL in a browser to use the dashboard. The dashboard calls the
same-origin API, so no frontend URL or CORS configuration is required.

## Deploy

- **Render:** create a Web Service from this repository. Render can use `render.yaml`, or set the build command to `pip install -r requirements.txt` and the start command to `gunicorn app:app`.
- **Vercel:** import this repository as a project. `vercel.json` configures the Python function automatically.

The committed `outputs.zip` contains the model artifacts required at runtime.
If the archive must be extracted (for example, when the deployment bundle does
not include `artifacts/`), the API uses `/tmp/yelp-sentiment-model` because
serverless deployment directories are read-only.

The JSON service description is available at `/api`.
