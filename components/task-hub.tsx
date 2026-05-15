"use client";

import { useMemo, useState } from "react";

type HubMode = "track" | "quote" | "coverage" | "pickup";

const trackingLookup: Record<string, { title: string; status: string; detail: string; nextStep: string }> = {
  "DS-FAST24": {
    title: "Medical courier run",
    status: "In transit",
    detail: "Specimen transfer cleared pickup and is moving to Scottsdale delivery.",
    nextStep: "Proof of delivery expected within 42 minutes.",
  },
  "DS-MOVE9": {
    title: "Residential move",
    status: "Crew assigned",
    detail: "3-person crew and box truck staged with stair kit and wrap supplies.",
    nextStep: "Arrival window locked for 9:30 AM.",
  },
  "DS-RET88": {
    title: "Retail recovery",
    status: "Awaiting pickup",
    detail: "Driver notified and return label verified for reverse logistics handoff.",
    nextStep: "Pickup dispatch scheduled in the next 25 minutes.",
  },
};

const zoneLookup: Record<string, { zone: string; promise: string; bestFit: string }> = {
  "85004": { zone: "Downtown Phoenix core", promise: "45-55 minute response window", bestFit: "Bike courier and cargo van" },
  "85034": { zone: "Airport and industrial corridor", promise: "35 minute rush response", bestFit: "Sprinter van and airport recovery" },
  "85281": { zone: "Tempe route cluster", promise: "55-65 minute standard response", bestFit: "Recurring B2B routes and office moves" },
  "85258": { zone: "Scottsdale medical corridor", promise: "40-45 minute STAT response", bestFit: "Chain-of-custody and pharmacy runs" },
};

const pickupWindows = [
  { label: "ASAP dispatch", detail: "Priority driver assignment with active ETA messaging." },
  { label: "Same-day window", detail: "Scheduled within a selected 2-hour pickup block." },
  { label: "Recurring route", detail: "Daily or weekly pickup with route-optimized planning." },
];

export function TaskHub() {
  const [mode, setMode] = useState<HubMode>("track");
  const [trackingCode, setTrackingCode] = useState("DS-FAST24");
  const [zipCode, setZipCode] = useState("85034");
  const [pickupType, setPickupType] = useState(0);

  const trackingState = useMemo(
    () => trackingLookup[trackingCode.trim().toUpperCase()] ?? null,
    [trackingCode]
  );
  const zoneState = useMemo(() => zoneLookup[zipCode] ?? null, [zipCode]);

  return (
    <section className="task-hub">
      <div className="task-hub-tabs" role="tablist" aria-label="Desert Sonic quick actions">
        <button type="button" className={mode === "track" ? "task-tab active" : "task-tab"} onClick={() => setMode("track")}>Track</button>
        <button type="button" className={mode === "quote" ? "task-tab active" : "task-tab"} onClick={() => setMode("quote")}>Rate & plan</button>
        <button type="button" className={mode === "coverage" ? "task-tab active" : "task-tab"} onClick={() => setMode("coverage")}>Coverage</button>
        <button type="button" className={mode === "pickup" ? "task-tab active" : "task-tab"} onClick={() => setMode("pickup")}>Pickups</button>
      </div>

      {mode === "track" ? (
        <div className="task-hub-panel">
          <div className="task-hub-input-row">
            <input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="Enter a Desert Sonic booking code"
            />
            <button type="button" className="primary-button">Track booking</button>
          </div>
          <div className="task-hub-output">
            {trackingState ? (
              <>
                <strong>{trackingState.title}</strong>
                <div className="task-status-row">
                  <span>{trackingState.status}</span>
                  <small>{trackingState.nextStep}</small>
                </div>
                <p>{trackingState.detail}</p>
              </>
            ) : (
              <>
                <strong>Booking not found</strong>
                <p>Try DS-FAST24, DS-MOVE9, or DS-RET88 to preview Desert Sonic tracking visibility.</p>
              </>
            )}
          </div>
        </div>
      ) : null}

      {mode === "quote" ? (
        <div className="task-hub-panel">
          <div className="task-grid-links">
            <a href="#quote" className="task-link-card">
              <strong>Courier quote</strong>
              <p>Same-day, medical, pharmacy, legal, and retail route pricing.</p>
            </a>
            <a href="#quote" className="task-link-card">
              <strong>Moving estimate</strong>
              <p>Crew size, truck class, stairs, packing, and heavy-item planning.</p>
            </a>
            <a href="#quote" className="task-link-card">
              <strong>White-glove delivery</strong>
              <p>Room-of-choice, setup, placement, and premium final-mile workflows.</p>
            </a>
          </div>
        </div>
      ) : null}

      {mode === "coverage" ? (
        <div className="task-hub-panel">
          <div className="task-hub-input-row">
            <input value={zipCode} onChange={(event) => setZipCode(event.target.value)} maxLength={5} placeholder="Enter ZIP code" />
            <button type="button" className="ghost-button">Check area</button>
          </div>
          <div className="task-hub-output">
            {zoneState ? (
              <>
                <strong>{zoneState.zone}</strong>
                <div className="task-status-row">
                  <span>{zoneState.promise}</span>
                  <small>{zoneState.bestFit}</small>
                </div>
                <p>Desert Sonic can route same-day delivery, specialized courier jobs, and selected moving support in this zone.</p>
              </>
            ) : (
              <>
                <strong>Manual routing review</strong>
                <p>Try 85004, 85034, 85281, or 85258 to preview the service-area tool.</p>
              </>
            )}
          </div>
        </div>
      ) : null}

      {mode === "pickup" ? (
        <div className="task-hub-panel">
          <div className="pickup-card-row">
            {pickupWindows.map((window, index) => (
              <button
                key={window.label}
                type="button"
                className={pickupType === index ? "pickup-mode-card active" : "pickup-mode-card"}
                onClick={() => setPickupType(index)}
              >
                <strong>{window.label}</strong>
                <p>{window.detail}</p>
              </button>
            ))}
          </div>
          <div className="task-hub-output">
            <strong>{pickupWindows[pickupType].label}</strong>
            <div className="task-status-row">
              <span>Pickup planning ready</span>
              <small>{pickupWindows[pickupType].detail}</small>
            </div>
            <p>Use the booking flow below to capture the exact service type, vehicle fit, and handoff requirements.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
