"use client";

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  buildQuote,
  crewSizeLabels,
  distanceLabels,
  moveSizeLabels,
  serviceLabels,
  speedLabels,
  vehicleLabels,
  type CrewSizeKey,
  type DistanceKey,
  type LeadInput,
  type MoveSizeKey,
  type ServiceKey,
  type SpeedKey,
  type VehicleClassKey,
} from "../lib/pricing";

type QuoteState = {
  estimatedLow: number;
  estimatedHigh: number;
  estimatedMonthlyRevenue: number;
  recommendedFollowUp: string;
  leadTier: string;
  workflowLabel: string;
  operationsSummary: string;
  quoteId?: string;
};

const initialLead: LeadInput = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  serviceType: "standard",
  deliverySpeed: "rush",
  distanceBand: "near",
  routeFrequency: "one-time",
  deliveriesPerMonth: 4,
  pickupCity: "Phoenix",
  dropoffCity: "Scottsdale",
  notes: "",
  coldChain: false,
  signatureRequired: true,
  chainOfCustody: false,
  moveSize: "studio",
  crewSize: "twoPerson",
  vehicleClass: "cargoVan",
  stairs: false,
  assembly: false,
  packing: false,
  heavyItems: false,
};

const fastTrackCodes: Record<string, { status: string; detail: string; location: string }> = {
  "DS-FAST24": {
    status: "Driver en route",
    detail: "Final pickup confirmation complete and ETA updated.",
    location: "Phoenix dispatch grid",
  },
  "DS-MOVE9": {
    status: "Crew assigned",
    detail: "3-person crew reserved with box truck and stair kit.",
    location: "Tempe staging hub",
  },
  "DS-LAB11": {
    status: "Chain of custody active",
    detail: "Specimen handoff logged and proof-of-delivery pending.",
    location: "Scottsdale medical corridor",
  },
};

function serviceHint(service: ServiceKey) {
  if (service === "moving") return "Moving quotes add crew, truck, and access-planning logic.";
  if (service === "whiteGlove") return "White-glove quotes optimize for two-person teams, protection, and placement.";
  if (service === "medical" || service === "pharmacy") return "Medical workflows prioritize chain-of-custody and speed.";
  return "Courier workflows stay tuned for same-day, routed, and urgent runs.";
}

function useDraftQuote(lead: LeadInput) {
  return useMemo(() => buildQuote(lead), [lead]);
}

export function QuoteForm() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <DisconnectedQuoteForm />;
  }

  return <ConnectedQuoteForm />;
}

function ConnectedQuoteForm() {
  const createLead = useMutation(api.leads.createLead);
  const [lead, setLead] = useState(initialLead);
  const [quoteState, setQuoteState] = useState<QuoteState | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState("DS-FAST24");

  const draftQuote = useDraftQuote(lead);
  const trackingState = fastTrackCodes[trackingCode.trim().toUpperCase()];
  const isMoving = lead.serviceType === "moving";
  const isWhiteGlove = lead.serviceType === "whiteGlove";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Saving lead and generating operating plan...");

    try {
      const created = await createLead(lead);
      setQuoteState({
        estimatedLow: created.estimatedLow,
        estimatedHigh: created.estimatedHigh,
        estimatedMonthlyRevenue: created.estimatedMonthlyRevenue,
        recommendedFollowUp: created.recommendedFollowUp,
        leadTier: created.leadTier,
        workflowLabel: created.workflowLabel,
        operationsSummary: created.operationsSummary,
        quoteId: created.quoteId,
      });
      setStatus(`Lead saved as ${created.quoteId}. Dispatch plan ready.`);
    } catch (error) {
      console.error(error);
      setStatus("Convex is not connected yet. Add NEXT_PUBLIC_CONVEX_URL and run `npx convex dev`.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="quote" className="quote-shell quote-shell-expanded">
      <div className="quote-intro">
        <p className="eyebrow">Booking OS</p>
        <h2>Quote courier runs, white-glove drops, and moving jobs in one flow.</h2>
        <p className="section-copy">
          The booking experience now adapts by service type, shows the operational plan before submission,
          and stores dispatch-ready leads in Convex.
        </p>

        <div className="quote-meter quote-meter-rich">
          <span>Live estimate</span>
          <strong>
            ${draftQuote.estimatedLow}-${draftQuote.estimatedHigh}
          </strong>
          <small>
            {draftQuote.serviceLabel}, {draftQuote.speedLabel}, {draftQuote.distanceLabel}
          </small>
          <div className="quote-meter-meta">
            <div>
              <span>Vehicle</span>
              <strong>{draftQuote.vehicleLabel}</strong>
            </div>
            <div>
              <span>Workflow</span>
              <strong>{draftQuote.workflowLabel}</strong>
            </div>
          </div>
        </div>

        <div className="ops-card-grid">
          <article className="ops-card">
            <span>Service logic</span>
            <strong>{serviceHint(lead.serviceType)}</strong>
          </article>
          <article className="ops-card">
            <span>Operations summary</span>
            <strong>{draftQuote.operationsSummary}</strong>
          </article>
        </div>

        {quoteState ? (
          <div className="quote-result-card quote-result-card-rich">
            <span className={`tier-badge tier-${quoteState.leadTier}`}>{quoteState.leadTier}</span>
            <strong>{quoteState.quoteId}</strong>
            <p>
              Monthly revenue potential: <b>${quoteState.estimatedMonthlyRevenue}</b>
            </p>
            <p>{quoteState.workflowLabel}</p>
            <small>{quoteState.recommendedFollowUp}</small>
          </div>
        ) : null}

        <div className="tracker-card">
          <div className="tracker-head">
            <div>
              <span className="eyebrow">Live visibility demo</span>
              <strong>Track a booking or move</strong>
            </div>
          </div>
          <div className="tracker-input-row">
            <input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="Enter a booking code"
            />
            <button type="button" className="ghost-button">Lookup</button>
          </div>
          <div className="tracker-state">
            {trackingState ? (
              <>
                <strong>{trackingState.status}</strong>
                <p>{trackingState.detail}</p>
                <small>{trackingState.location}</small>
              </>
            ) : (
              <>
                <strong>No live result</strong>
                <p>Use DS-FAST24, DS-MOVE9, or DS-LAB11 to preview the visibility layer.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <form className="lead-form lead-form-rich" onSubmit={handleSubmit}>
        <div className="mode-pills">
          {(["standard", "medical", "auto", "legal", "pharmacy", "whiteGlove", "moving"] as ServiceKey[]).map((value) => (
            <button
              key={value}
              type="button"
              className={lead.serviceType === value ? "mode-pill active" : "mode-pill"}
              onClick={() => setLead({ ...lead, serviceType: value })}
            >
              {serviceLabels[value]}
            </button>
          ))}
        </div>

        <div className="form-grid">
          <label>
            Company or customer name
            <input value={lead.businessName} onChange={(e) => setLead({ ...lead, businessName: e.target.value })} required />
          </label>
          <label>
            Primary contact
            <input value={lead.contactName} onChange={(e) => setLead({ ...lead, contactName: e.target.value })} required />
          </label>
          <label>
            Contact email
            <input type="email" value={lead.contactEmail} onChange={(e) => setLead({ ...lead, contactEmail: e.target.value })} required />
          </label>
          <label>
            Contact phone
            <input value={lead.contactPhone} onChange={(e) => setLead({ ...lead, contactPhone: e.target.value })} required />
          </label>
          <label>
            Service speed
            <select value={lead.deliverySpeed} onChange={(e) => setLead({ ...lead, deliverySpeed: e.target.value as SpeedKey })}>
              {Object.entries(speedLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Distance band
            <select value={lead.distanceBand} onChange={(e) => setLead({ ...lead, distanceBand: e.target.value as DistanceKey })}>
              {Object.entries(distanceLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Frequency
            <select value={lead.routeFrequency} onChange={(e) => setLead({ ...lead, routeFrequency: e.target.value as LeadInput["routeFrequency"] })}>
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label>
            Jobs per month
            <input
              type="number"
              min={1}
              max={500}
              value={lead.deliveriesPerMonth}
              onChange={(e) => setLead({ ...lead, deliveriesPerMonth: Number(e.target.value) || 1 })}
            />
          </label>
          <label>
            Pickup
            <input value={lead.pickupCity} onChange={(e) => setLead({ ...lead, pickupCity: e.target.value })} required />
          </label>
          <label>
            Dropoff
            <input value={lead.dropoffCity} onChange={(e) => setLead({ ...lead, dropoffCity: e.target.value })} required />
          </label>
          <label>
            Vehicle class
            <select value={lead.vehicleClass} onChange={(e) => setLead({ ...lead, vehicleClass: e.target.value as VehicleClassKey })}>
              {Object.entries(vehicleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Crew size
            <select value={lead.crewSize} onChange={(e) => setLead({ ...lead, crewSize: e.target.value as CrewSizeKey })}>
              {Object.entries(crewSizeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          {(isMoving || isWhiteGlove) ? (
            <label>
              Move profile
              <select value={lead.moveSize} onChange={(e) => setLead({ ...lead, moveSize: e.target.value as MoveSizeKey })}>
                {Object.entries(moveSizeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="notes-field">
            Job notes
            <textarea rows={5} value={lead.notes} onChange={(e) => setLead({ ...lead, notes: e.target.value })} />
          </label>
        </div>

        <div className="toggle-row">
          <label className="toggle"><input type="checkbox" checked={lead.coldChain} onChange={(e) => setLead({ ...lead, coldChain: e.target.checked })} />Cold chain</label>
          <label className="toggle"><input type="checkbox" checked={lead.signatureRequired} onChange={(e) => setLead({ ...lead, signatureRequired: e.target.checked })} />Signature required</label>
          <label className="toggle"><input type="checkbox" checked={lead.chainOfCustody} onChange={(e) => setLead({ ...lead, chainOfCustody: e.target.checked })} />Chain of custody</label>
          <label className="toggle"><input type="checkbox" checked={lead.stairs} onChange={(e) => setLead({ ...lead, stairs: e.target.checked })} />Stairs or elevator timing</label>
          <label className="toggle"><input type="checkbox" checked={lead.assembly} onChange={(e) => setLead({ ...lead, assembly: e.target.checked })} />Assembly or room placement</label>
          <label className="toggle"><input type="checkbox" checked={lead.packing} onChange={(e) => setLead({ ...lead, packing: e.target.checked })} />Packing service</label>
          <label className="toggle"><input type="checkbox" checked={lead.heavyItems} onChange={(e) => setLead({ ...lead, heavyItems: e.target.checked })} />Heavy items or equipment</label>
        </div>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving lead..." : "Generate plan and save lead"}
        </button>
        <p className="form-status">{status}</p>
      </form>
    </section>
  );
}

function DisconnectedQuoteForm() {
  const [lead, setLead] = useState(initialLead);
  const draftQuote = useDraftQuote(lead);

  return (
    <section id="quote" className="quote-shell quote-shell-expanded">
      <div className="quote-intro">
        <p className="eyebrow">Booking OS</p>
        <h2>Quote flow ready. Convex connection pending.</h2>
        <p className="section-copy">
          The experience is fully designed, but `NEXT_PUBLIC_CONVEX_URL` still needs to be configured before live leads can be saved.
        </p>
        <div className="quote-meter quote-meter-rich">
          <span>Live estimate</span>
          <strong>
            ${draftQuote.estimatedLow}-${draftQuote.estimatedHigh}
          </strong>
          <small>{draftQuote.serviceLabel}, {draftQuote.speedLabel}, {draftQuote.distanceLabel}</small>
        </div>
      </div>

      <form className="lead-form lead-form-rich">
        <div className="form-grid">
          <label>
            Company or customer name
            <input value={lead.businessName} onChange={(e) => setLead({ ...lead, businessName: e.target.value })} />
          </label>
          <label>
            Primary contact
            <input value={lead.contactName} onChange={(e) => setLead({ ...lead, contactName: e.target.value })} />
          </label>
          <label>
            Contact email
            <input type="email" value={lead.contactEmail} onChange={(e) => setLead({ ...lead, contactEmail: e.target.value })} />
          </label>
          <label>
            Contact phone
            <input value={lead.contactPhone} onChange={(e) => setLead({ ...lead, contactPhone: e.target.value })} />
          </label>
        </div>
        <p className="form-status">
          Connect Convex with `NEXT_PUBLIC_CONVEX_URL` and run `npx convex dev` to activate lead capture and dispatch planning.
        </p>
      </form>
    </section>
  );
}
