# Desert Express Revenue Engine

This Python service turns the courier landing page into a revenue tool:

- instant quote calculation
- lead capture into SQLite
- priority scoring for sales follow-up
- recurring-route revenue estimates
- CSV export for outreach and CRM import

## Run

Create or activate a Python 3.10+ virtual environment, then install requirements:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

API base URL: `http://127.0.0.1:8000`

## Endpoints

- `GET /health`
- `POST /api/quote`
- `POST /api/leads`
- `GET /api/leads`
- `POST /api/leads/export`

## Why this can make money immediately

Courier operators, medical couriers, and local dispatch startups often lose business in the first week because inquiries arrive by text, web form, and phone with no system behind them. This service gives them:

- a usable quote engine for their website
- a lightweight lead CRM without paying for larger dispatch software first
- a way to rank high-value recurring routes over low-value one-offs

That makes it a realistic productized service to sell as:

- setup fee for a local courier business
- monthly hosting + support retainer
- white-label quoting backend for niche logistics operators
