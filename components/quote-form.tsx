"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { discountForVolume, distanceLabels, pricing, serviceLabels, speedLabels, type DistanceKey, type LeadInput, type ServiceKey, type SpeedKey } from "../lib/pricing";

type QuoteState = {
  estimatedLow: number;
  estimatedHigh: number;
  estimatedMonthlyRevenue: number;
  recommendedFollowUp: string;
  leadTier: string;
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
};

function estimateRange(serviceType: ServiceKey, speed: SpeedKey, distance: DistanceKey, deliveriesPerMonth: number) {
  const [baseLow, baseHigh] = pricing[serviceType][speed][distance];
  const discount = discountForVolume(deliveriesPerMonth);
  return [Math.round(baseLow * (1 - discount)), Math.round(baseHigh * (1 - discount))];
}

export function QuoteForm() {
  const createLead = useMutation(api.leads.createLead);
  const [lead, setLead] = useState(initialLead);
  const [quoteState, setQuoteState] = useState<QuoteState | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedRange = estimateRange(lead.serviceType, lead.deliverySpeed, lead.distanceBand, lead.deliveriesPerMonth);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Saving lead and generating quote...");

    try {
      const created = await createLead(lead);
      setQuoteState({
        estimatedLow: created.estimatedLow,
        estimatedHigh: created.estimatedHigh,
        estimatedMonthlyRevenue: created.estimatedMonthlyRevenue,
        recommendedFollowUp: created.recommendedFollowUp,
        leadTier: created.leadTier,
        quoteId: created.quoteId,
      });
      setStatus(`Lead saved as ${created.quoteId}.`);
    } catch (error) {
      console.error(error);
      setStatus("Convex is not connected yet. Add NEXT_PUBLIC_CONVEX_URL and run `npx convex dev`.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="quote" className="quote-shell">
      <div className="quote-intro">
        <p className="eyebrow">Functional quote capture</p>
        <h2>Quote, score, and store leads from the first visit.</h2>
        <p className="section-copy">
          Every submission produces a price range, a revenue estimate, a follow-up recommendation,
          and a lead priority tier in Convex.
        </p>

        <div className="quote-meter">
          <span>Live estimate</span>
          <strong>
            ${estimatedRange[0]}-${estimatedRange[1]}
          </strong>
          <small>
            {serviceLabels[lead.serviceType]}, {speedLabels[lead.deliverySpeed]}, {distanceLabels[lead.distanceBand]}
          </small>
        </div>

        {quoteState ? (
          <div className="quote-result-card">
            <span className={`tier-badge tier-${quoteState.leadTier}`}>{quoteState.leadTier}</span>
            <strong>{quoteState.quoteId}</strong>
            <p>
              Monthly revenue potential: <b>${quoteState.estimatedMonthlyRevenue}</b>
            </p>
            <small>{quoteState.recommendedFollowUp}</small>
          </div>
        ) : null}
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Business name
            <input value={lead.businessName} onChange={(e) => setLead({ ...lead, businessName: e.target.value })} required />
          </label>
          <label>
            Contact name
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
            Service
            <select value={lead.serviceType} onChange={(e) => setLead({ ...lead, serviceType: e.target.value as ServiceKey })}>
              {Object.entries(serviceLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Speed
            <select value={lead.deliverySpeed} onChange={(e) => setLead({ ...lead, deliverySpeed: e.target.value as SpeedKey })}>
              {Object.entries(speedLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Distance
            <select value={lead.distanceBand} onChange={(e) => setLead({ ...lead, distanceBand: e.target.value as DistanceKey })}>
              {Object.entries(distanceLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Route frequency
            <select value={lead.routeFrequency} onChange={(e) => setLead({ ...lead, routeFrequency: e.target.value as LeadInput["routeFrequency"] })}>
              <option value="one-time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label>
            Deliveries per month
            <input
              type="number"
              min={1}
              max={500}
              value={lead.deliveriesPerMonth}
              onChange={(e) => setLead({ ...lead, deliveriesPerMonth: Number(e.target.value) || 1 })}
            />
          </label>
          <label>
            Pickup city
            <input value={lead.pickupCity} onChange={(e) => setLead({ ...lead, pickupCity: e.target.value })} required />
          </label>
          <label>
            Dropoff city
            <input value={lead.dropoffCity} onChange={(e) => setLead({ ...lead, dropoffCity: e.target.value })} required />
          </label>
          <label className="notes-field">
            Notes
            <textarea rows={5} value={lead.notes} onChange={(e) => setLead({ ...lead, notes: e.target.value })} />
          </label>
        </div>

        <div className="toggle-row">
          <label className="toggle"><input type="checkbox" checked={lead.coldChain} onChange={(e) => setLead({ ...lead, coldChain: e.target.checked })} />Cold chain</label>
          <label className="toggle"><input type="checkbox" checked={lead.signatureRequired} onChange={(e) => setLead({ ...lead, signatureRequired: e.target.checked })} />Signature required</label>
          <label className="toggle"><input type="checkbox" checked={lead.chainOfCustody} onChange={(e) => setLead({ ...lead, chainOfCustody: e.target.checked })} />Chain of custody</label>
        </div>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving lead..." : "Create quote and save lead"}
        </button>
        <p className="form-status">{status}</p>
      </form>
    </section>
  );
}
