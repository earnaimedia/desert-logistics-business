"use client";

import { useMemo, useState } from "react";

const zipZones: Record<string, { coverage: string; eta: string; mode: string }> = {
  "85004": { coverage: "Downtown Phoenix core", eta: "55 min response window", mode: "Bike courier + cargo van" },
  "85034": { coverage: "Airport and industrial zone", eta: "35 min response window", mode: "Airport recovery + sprinter" },
  "85281": { coverage: "Tempe campus and office routes", eta: "65 min response window", mode: "B2B route + moving support" },
  "85258": { coverage: "Scottsdale medical corridor", eta: "45 min response window", mode: "Medical chain-of-custody" },
};

const launchModules = [
  {
    title: "Instant quote architecture",
    copy: "Adaptive pricing for same-day delivery, white-glove, and moving jobs with service-aware operations plans.",
  },
  {
    title: "Dispatch visibility",
    copy: "Tracking codes, pickup milestones, proof-of-delivery logic, and live customer update states.",
  },
  {
    title: "Route intelligence",
    copy: "Coverage lookup, vehicle assignment, and recurring route planning across Phoenix, Tempe, Scottsdale, and Mesa.",
  },
  {
    title: "Moving workflow",
    copy: "Crew size, truck class, packing, stairs, and heavy-item logic built into one booking experience.",
  },
];

export function OperationsShowcase() {
  const [zipCode, setZipCode] = useState("85004");
  const [activeModule, setActiveModule] = useState(0);
  const coverageState = useMemo(() => zipZones[zipCode] ?? null, [zipCode]);

  return (
    <>
      <section className="launch-grid">
        <div className="launch-copy">
          <p className="eyebrow">Startup surface</p>
          <h2>A logistics website that behaves like a product.</h2>
          <p className="section-copy">
            The experience is designed to help visitors self-qualify, estimate, plan, and trust the operation before
            they ever talk to sales. That is the big difference between a carrier brochure and a startup platform.
          </p>
        </div>

        <div className="launch-stack">
          {launchModules.map((module, index) => (
            <button
              key={module.title}
              type="button"
              className={activeModule === index ? "launch-module active" : "launch-module"}
              onClick={() => setActiveModule(index)}
            >
              <strong>{module.title}</strong>
              <p>{module.copy}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="toolbelt-grid">
        <article className="tool-panel tool-panel-dark">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Coverage finder</p>
              <h3>Check a ZIP and see the operating mode.</h3>
            </div>
          </div>
          <div className="zip-input-row">
            <input value={zipCode} onChange={(event) => setZipCode(event.target.value)} maxLength={5} />
            <button type="button" className="ghost-button ghost-button-dark">Scan</button>
          </div>
          {coverageState ? (
            <div className="tool-output">
              <strong>{coverageState.coverage}</strong>
              <p>{coverageState.mode}</p>
              <small>{coverageState.eta}</small>
            </div>
          ) : (
            <div className="tool-output">
              <strong>Coverage review needed</strong>
              <p>Try 85004, 85034, 85281, or 85258 to preview the network layer.</p>
            </div>
          )}
        </article>

        <article className="tool-panel">
          <p className="eyebrow">Customer promise</p>
          <h3>Everything a buyer expects from a modern logistics startup.</h3>
          <div className="promise-list">
            <div><strong>Self-serve quote</strong><span>Courier, white-glove, and moving jobs</span></div>
            <div><strong>Proof of delivery</strong><span>Signature, photo, and milestone-ready UX</span></div>
            <div><strong>Fleet fit</strong><span>Sedan, cargo van, sprinter, and box truck</span></div>
            <div><strong>Industry fit</strong><span>Medical, retail, legal, auto, pharmacy, office</span></div>
          </div>
        </article>

        <article className="tool-panel">
          <p className="eyebrow">Control layer</p>
          <h3>Book once, then route, move, and retain.</h3>
          <div className="timeline-list">
            <div><span>01</span><p>Instant fit check: urgency, distance, vehicle, crew, and route frequency.</p></div>
            <div><span>02</span><p>Operational quote: price band, workflow label, and service summary.</p></div>
            <div><span>03</span><p>Dispatch handoff: saved lead, revenue potential, priority score, and follow-up guidance.</p></div>
          </div>
        </article>
      </section>
    </>
  );
}
