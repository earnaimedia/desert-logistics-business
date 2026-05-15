from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Tuple
from uuid import uuid4

from .models import DistanceKey, FrequencyKey, QuoteRequest, QuoteResponse, ServiceKey, SpeedKey


PriceRange = Tuple[int, int]


SERVICE_LABELS = {
    ServiceKey.standard: "Standard B2B Delivery",
    ServiceKey.medical: "Medical Courier",
    ServiceKey.auto: "Auto Parts Delivery",
    ServiceKey.legal: "Legal Document Courier",
    ServiceKey.pharmacy: "Pharmacy Delivery",
}

SPEED_LABELS = {
    SpeedKey.same_day: "Same-day",
    SpeedKey.rush: "Rush",
    SpeedKey.stat: "STAT",
}

DISTANCE_LABELS = {
    DistanceKey.near: "0-10 mi",
    DistanceKey.mid: "11-20 mi",
    DistanceKey.far: "21-40 mi",
}

PRICING: Dict[ServiceKey, Dict[SpeedKey, Dict[DistanceKey, PriceRange]]] = {
    ServiceKey.standard: {
        SpeedKey.same_day: {DistanceKey.near: (18, 25), DistanceKey.mid: (25, 35), DistanceKey.far: (35, 55)},
        SpeedKey.rush: {DistanceKey.near: (30, 40), DistanceKey.mid: (40, 55), DistanceKey.far: (55, 75)},
        SpeedKey.stat: {DistanceKey.near: (50, 70), DistanceKey.mid: (70, 95), DistanceKey.far: (95, 130)},
    },
    ServiceKey.medical: {
        SpeedKey.same_day: {DistanceKey.near: (30, 45), DistanceKey.mid: (45, 65), DistanceKey.far: (60, 90)},
        SpeedKey.rush: {DistanceKey.near: (45, 65), DistanceKey.mid: (60, 80), DistanceKey.far: (80, 110)},
        SpeedKey.stat: {DistanceKey.near: (75, 110), DistanceKey.mid: (100, 140), DistanceKey.far: (130, 175)},
    },
    ServiceKey.auto: {
        SpeedKey.same_day: {DistanceKey.near: (15, 25), DistanceKey.mid: (15, 25), DistanceKey.far: (15, 25)},
        SpeedKey.rush: {DistanceKey.near: (35, 60), DistanceKey.mid: (35, 60), DistanceKey.far: (35, 60)},
        SpeedKey.stat: {DistanceKey.near: (250, 400), DistanceKey.mid: (250, 400), DistanceKey.far: (250, 400)},
    },
    ServiceKey.legal: {
        SpeedKey.same_day: {DistanceKey.near: (22, 32), DistanceKey.mid: (32, 45), DistanceKey.far: (45, 65)},
        SpeedKey.rush: {DistanceKey.near: (38, 50), DistanceKey.mid: (50, 68), DistanceKey.far: (68, 88)},
        SpeedKey.stat: {DistanceKey.near: (65, 85), DistanceKey.mid: (85, 110), DistanceKey.far: (110, 150)},
    },
    ServiceKey.pharmacy: {
        SpeedKey.same_day: {DistanceKey.near: (32, 48), DistanceKey.mid: (48, 68), DistanceKey.far: (65, 95)},
        SpeedKey.rush: {DistanceKey.near: (50, 70), DistanceKey.mid: (70, 90), DistanceKey.far: (90, 120)},
        SpeedKey.stat: {DistanceKey.near: (80, 120), DistanceKey.mid: (110, 150), DistanceKey.far: (145, 190)},
    },
}


@dataclass(frozen=True)
class QuoteMetrics:
    low: int
    high: int
    monthly_revenue: int
    priority_score: int
    lead_tier: str
    margin_signal: str
    recommended_follow_up: str


def discount_for_volume(deliveries_per_month: int) -> float:
    if deliveries_per_month >= 50:
        return 0.15
    if deliveries_per_month >= 25:
        return 0.10
    return 0.0


def _frequency_multiplier(frequency: FrequencyKey, deliveries_per_month: int) -> int:
    if frequency == FrequencyKey.daily:
        return max(deliveries_per_month, 20)
    if frequency == FrequencyKey.weekly:
        return max(deliveries_per_month, 4)
    if frequency == FrequencyKey.monthly:
        return max(deliveries_per_month, 1)
    return 1


def _surcharge(request: QuoteRequest) -> float:
    extra = 0.0
    if request.cold_chain:
        extra += 0.12
    if request.signature_required:
        extra += 0.05
    if request.chain_of_custody:
        extra += 0.08
    return extra


def _priority_score(request: QuoteRequest, monthly_revenue: int) -> int:
    score = 20
    if request.route_frequency in {FrequencyKey.daily, FrequencyKey.weekly}:
        score += 25
    if request.service_type in {ServiceKey.medical, ServiceKey.pharmacy}:
        score += 20
    if request.delivery_speed == SpeedKey.stat:
        score += 12
    if request.chain_of_custody or request.cold_chain:
        score += 10
    if monthly_revenue >= 3000:
        score += 20
    elif monthly_revenue >= 1000:
        score += 10
    return min(score, 100)


def _follow_up_message(priority_score: int, request: QuoteRequest) -> str:
    if priority_score >= 80:
        return "Call within 15 minutes and offer a launch contract with dedicated onboarding."
    if priority_score >= 60:
        return "Reply within 1 hour with a custom route proposal and first-order incentive."
    if request.route_frequency != FrequencyKey.one_time:
        return "Send a same-day route estimate and ask for pickup schedule details."
    return "Send a same-day quote by email and invite the customer to book their first run."


def build_quote(request: QuoteRequest) -> QuoteResponse:
    base_low, base_high = PRICING[request.service_type][request.delivery_speed][request.distance_band]
    discount = discount_for_volume(request.deliveries_per_month)
    surcharge_multiplier = 1 + _surcharge(request)
    low = round(base_low * (1 - discount) * surcharge_multiplier)
    high = round(base_high * (1 - discount) * surcharge_multiplier)

    frequency_multiplier = _frequency_multiplier(request.route_frequency, request.deliveries_per_month)
    monthly_revenue = round(((low + high) / 2) * frequency_multiplier)
    priority_score = _priority_score(request, monthly_revenue)

    if high >= 120 or request.service_type in {ServiceKey.medical, ServiceKey.pharmacy}:
        margin_signal = "premium"
    elif high >= 60:
        margin_signal = "strong"
    else:
        margin_signal = "standard"

    if priority_score >= 80:
        lead_tier = "priority"
    elif priority_score >= 60:
        lead_tier = "hot"
    else:
        lead_tier = "standard"

    return QuoteResponse(
        quote_id=f"DX-{uuid4().hex[:8].upper()}",
        service_label=SERVICE_LABELS[request.service_type],
        speed_label=SPEED_LABELS[request.delivery_speed],
        distance_label=DISTANCE_LABELS[request.distance_band],
        estimated_low=low,
        estimated_high=high,
        estimated_monthly_revenue=monthly_revenue,
        margin_signal=margin_signal,
        priority_score=priority_score,
        lead_tier=lead_tier,
        recommended_follow_up=_follow_up_message(priority_score, request),
        created_at=datetime.utcnow(),
    )
