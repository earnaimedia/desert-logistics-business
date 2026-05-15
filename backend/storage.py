from __future__ import annotations

import csv
import sqlite3
from pathlib import Path
from typing import List

from .models import LeadRecord, QuoteRequest
from .pricing import build_quote


DB_PATH = Path(__file__).resolve().parent / "data" / "leads.db"
EXPORT_PATH = Path(__file__).resolve().parent / "data" / "lead_export.csv"


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                quote_id TEXT PRIMARY KEY,
                business_name TEXT NOT NULL,
                contact_name TEXT NOT NULL,
                contact_email TEXT NOT NULL,
                contact_phone TEXT NOT NULL,
                service_type TEXT NOT NULL,
                delivery_speed TEXT NOT NULL,
                distance_band TEXT NOT NULL,
                route_frequency TEXT NOT NULL,
                deliveries_per_month INTEGER NOT NULL,
                pickup_city TEXT NOT NULL,
                dropoff_city TEXT NOT NULL,
                notes TEXT NOT NULL,
                cold_chain INTEGER NOT NULL,
                signature_required INTEGER NOT NULL,
                chain_of_custody INTEGER NOT NULL,
                estimated_low INTEGER NOT NULL,
                estimated_high INTEGER NOT NULL,
                estimated_monthly_revenue INTEGER NOT NULL,
                priority_score INTEGER NOT NULL,
                lead_tier TEXT NOT NULL,
                margin_signal TEXT NOT NULL,
                recommended_follow_up TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


def create_lead(request: QuoteRequest) -> LeadRecord:
    quote = build_quote(request)
    record = LeadRecord(**request.model_dump(), **quote.model_dump())

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO leads (
                quote_id, business_name, contact_name, contact_email, contact_phone,
                service_type, delivery_speed, distance_band, route_frequency, deliveries_per_month,
                pickup_city, dropoff_city, notes, cold_chain, signature_required, chain_of_custody,
                estimated_low, estimated_high, estimated_monthly_revenue, priority_score,
                lead_tier, margin_signal, recommended_follow_up, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record.quote_id,
                record.business_name,
                record.contact_name,
                record.contact_email,
                record.contact_phone,
                record.service_type.value,
                record.delivery_speed.value,
                record.distance_band.value,
                record.route_frequency.value,
                record.deliveries_per_month,
                record.pickup_city,
                record.dropoff_city,
                record.notes,
                int(record.cold_chain),
                int(record.signature_required),
                int(record.chain_of_custody),
                record.estimated_low,
                record.estimated_high,
                record.estimated_monthly_revenue,
                record.priority_score,
                record.lead_tier,
                record.margin_signal,
                record.recommended_follow_up,
                record.created_at.isoformat(),
            ),
        )

    return record


def list_leads() -> List[sqlite3.Row]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT *
            FROM leads
            ORDER BY priority_score DESC, estimated_monthly_revenue DESC, created_at DESC
            """
        ).fetchall()
    return rows


def export_leads_csv() -> Path:
    rows = list_leads()
    EXPORT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with EXPORT_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(rows[0].keys() if rows else [
            "quote_id",
            "business_name",
            "contact_name",
            "contact_email",
            "contact_phone",
            "service_type",
            "delivery_speed",
            "distance_band",
            "route_frequency",
            "deliveries_per_month",
            "pickup_city",
            "dropoff_city",
            "notes",
            "cold_chain",
            "signature_required",
            "chain_of_custody",
            "estimated_low",
            "estimated_high",
            "estimated_monthly_revenue",
            "priority_score",
            "lead_tier",
            "margin_signal",
            "recommended_follow_up",
            "created_at",
        ])
        for row in rows:
            writer.writerow(list(row))

    return EXPORT_PATH
