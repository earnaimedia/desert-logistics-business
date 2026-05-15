from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import QuoteRequest
from .pricing import build_quote
from .storage import create_lead, export_leads_csv, init_db, list_leads


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Desert Express Revenue Engine",
    description="Quote, capture, and prioritize courier leads from day one.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck():
    return {"ok": True}


@app.post("/api/quote")
def quote(request: QuoteRequest):
    return build_quote(request)


@app.post("/api/leads")
def create_lead_record(request: QuoteRequest):
    return create_lead(request)


@app.get("/api/leads")
def get_leads():
    return [dict(row) for row in list_leads()]


@app.post("/api/leads/export")
def export_leads():
    path = export_leads_csv()
    return {"exported": True, "path": str(path)}
