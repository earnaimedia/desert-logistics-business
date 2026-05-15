from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class ServiceKey(str, Enum):
    standard = "standard"
    medical = "medical"
    auto = "auto"
    legal = "legal"
    pharmacy = "pharmacy"


class SpeedKey(str, Enum):
    same_day = "sameDay"
    rush = "rush"
    stat = "stat"


class DistanceKey(str, Enum):
    near = "near"
    mid = "mid"
    far = "far"


class FrequencyKey(str, Enum):
    one_time = "one-time"
    weekly = "weekly"
    daily = "daily"
    monthly = "monthly"


class QuoteRequest(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=120)
    contact_name: str = Field(..., min_length=2, max_length=120)
    contact_email: EmailStr
    contact_phone: str = Field(..., min_length=7, max_length=30)
    service_type: ServiceKey
    delivery_speed: SpeedKey
    distance_band: DistanceKey
    route_frequency: FrequencyKey
    deliveries_per_month: int = Field(default=1, ge=1, le=500)
    pickup_city: str = Field(..., min_length=2, max_length=80)
    dropoff_city: str = Field(..., min_length=2, max_length=80)
    notes: str = Field(default="", max_length=1000)
    cold_chain: bool = False
    signature_required: bool = False
    chain_of_custody: bool = False


class QuoteResponse(BaseModel):
    quote_id: str
    service_label: str
    speed_label: str
    distance_label: str
    estimated_low: int
    estimated_high: int
    estimated_monthly_revenue: int
    margin_signal: Literal["standard", "strong", "premium"]
    priority_score: int
    lead_tier: Literal["standard", "hot", "priority"]
    recommended_follow_up: str
    created_at: datetime


class LeadRecord(QuoteRequest):
    quote_id: str
    estimated_low: int
    estimated_high: int
    estimated_monthly_revenue: int
    priority_score: int
    lead_tier: str
    margin_signal: str
    recommended_follow_up: str
    created_at: datetime
