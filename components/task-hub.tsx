"use client";

import { useMemo, useState } from "react";

type HubMode = "track" | "coverage" | "pickup" | "service";

const trackingLookup: Record<string, { status: string; detail: string }> = {
  "DS-FAST24": {
    status: "In transit",
    detail: "Driver is en route to Scottsdale delivery.",
  },
  "DS-MOVE9": {
    status: "Crew assigned",
    detail: "3-person crew and box truck are scheduled.",
  },
  "DS-RET88": {
    status: "Awaiting pickup",
    detail: "Pickup is queued for dispatch.",
  },
};

const zoneLookup: Record<string, { area: string; response: string }> = {
  "85004": { area: "Downtown Phoenix", response: "45-55 minute response" },
  "85034": { area: "Airport corridor", response: "35 minute rush response" },
  "85281": { area: "Tempe", response: "55-65 minute response" },
  "85258": { area: "Scottsdale", response: "40-45 minute response" },
};

const pickupLookup: Record<string, string> = {
  asap: "Priority driver assignment",
  sameDay: "Scheduled in a 2-hour pickup window",
  recurring: "Daily or weekly route planning",
};

const serviceLookup: Record<string, string> = {
  courier: "Same-day courier for medical, retail, legal, and business jobs.",
  moving: "Apartment, office, and heavy-item moving support.",
  whiteGlove: "Two-person delivery, placement, setup, and premium handling.",
  pharmacy: "Prescription and medical chain-of-custody delivery.",
};

export function TaskHub() {
  const [mode, setMode] = useState<HubMode>("track");
  const [trackingCode, setTrackingCode] = useState("DS-FAST24");
  const [zipCode, setZipCode] = useState("85034");
  const [pickupType, setPickupType] = useState("asap");
  const [serviceType, setServiceType] = useState("courier");

  const trackingState = useMemo(
    () => trackingLookup[trackingCode.trim().toUpperCase()] ?? null,
    [trackingCode]
  );
  const zoneState = useMemo(() => zoneLookup[zipCode] ?? null, [zipCode]);

  return (
    <section id="tools" className="task-hub-simple task-hub-fedex-style">
      <div className="task-action-strip">
        <button type="button" className={mode === "track" ? "task-action active" : "task-action"} onClick={() => setMode("track")}>
          <span className="task-icon">#</span>
          <strong>Track</strong>
        </button>
        <button type="button" className={mode === "coverage" ? "task-action active" : "task-action"} onClick={() => setMode("coverage")}>
          <span className="task-icon">+</span>
          <strong>Coverage</strong>
        </button>
        <button type="button" className={mode === "pickup" ? "task-action active" : "task-action"} onClick={() => setMode("pickup")}>
          <span className="task-icon">^</span>
          <strong>Pickup</strong>
        </button>
        <button type="button" className={mode === "service" ? "task-action active" : "task-action"} onClick={() => setMode("service")}>
          <span className="task-icon">*</span>
          <strong>Service</strong>
        </button>
        <div className="task-track-inline">
          <input
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            placeholder="Tracking number"
            aria-label="Tracking number"
          />
          <button type="button" className="track-button" onClick={() => setMode("track")}>
            Track
          </button>
        </div>
      </div>

      <div className="task-hub-simple-panel task-hub-detail-panel">
        <div className="task-hub-head">
          <div>
            <p className="eyebrow">Tools</p>
            <h2>
              {mode === "track" ? "Track a job." : null}
              {mode === "coverage" ? "Check coverage." : null}
              {mode === "pickup" ? "Plan a pickup." : null}
              {mode === "service" ? "Choose a service." : null}
            </h2>
          </div>
          <select value={mode} onChange={(event) => setMode(event.target.value as HubMode)} className="hub-select">
            <option value="track">Track a job</option>
            <option value="coverage">Check coverage</option>
            <option value="pickup">Plan a pickup</option>
            <option value="service">Choose a service</option>
          </select>
        </div>

        {mode === "track" ? (
          <>
            <label>
              Tracking code
              <input value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} />
            </label>
            <div className="task-result">
              <strong>{trackingState ? trackingState.status : "Not found"}</strong>
              <p>{trackingState ? trackingState.detail : "Use DS-FAST24, DS-MOVE9, or DS-RET88."}</p>
            </div>
          </>
        ) : null}

        {mode === "coverage" ? (
          <>
            <label>
              ZIP code
              <input value={zipCode} onChange={(event) => setZipCode(event.target.value)} maxLength={5} />
            </label>
            <div className="task-result">
              <strong>{zoneState ? zoneState.area : "Manual review"}</strong>
              <p>{zoneState ? zoneState.response : "Try 85004, 85034, 85281, or 85258."}</p>
            </div>
          </>
        ) : null}

        {mode === "pickup" ? (
          <>
            <label>
              Pickup type
              <select value={pickupType} onChange={(event) => setPickupType(event.target.value)}>
                <option value="asap">ASAP</option>
                <option value="sameDay">Same-day window</option>
                <option value="recurring">Recurring route</option>
              </select>
            </label>
            <div className="task-result">
              <strong>{pickupLookup[pickupType]}</strong>
              <p>Use the quote form below to capture address, service type, and job details.</p>
            </div>
          </>
        ) : null}

        {mode === "service" ? (
          <>
            <label>
              Service
              <select value={serviceType} onChange={(event) => setServiceType(event.target.value)}>
                <option value="courier">Courier</option>
                <option value="moving">Moving</option>
                <option value="whiteGlove">White-glove</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </label>
            <div className="task-result">
              <strong>{serviceType === "whiteGlove" ? "White-glove" : serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</strong>
              <p>{serviceLookup[serviceType]}</p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
