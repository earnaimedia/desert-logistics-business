import Link from "next/link";
import { QuoteForm } from "../components/quote-form";

const serviceCards = [
  {
    title: "Medical courier",
    copy: "Specimens, pharmaceuticals, records, and chain-of-custody handoffs with premium pricing and documented delivery.",
  },
  {
    title: "Auto parts routes",
    copy: "Daily dealer-to-shop and warehouse-to-repair routes with scheduled pickups and oversized item handling.",
  },
  {
    title: "Legal and pharmacy",
    copy: "Court filings, signed document delivery, prescription transport, and time-critical professional service runs.",
  },
  {
    title: "Recurring business delivery",
    copy: "Dedicated B2B route coverage for offices, labs, warehouses, and operations teams across Phoenix.",
  },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Desert Express Logistics</p>
          <h1>Phoenix courier operations, quoting, and lead capture in one web app.</h1>
          <p className="section-copy">
            A customer-facing website and an operator-facing pipeline built for same-day delivery, medical courier
            contracts, auto parts routes, and recurring B2B service across the Phoenix metro area.
          </p>
          <div className="hero-actions">
            <a href="#quote" className="primary-button">Start quoting</a>
            <Link href="/dashboard" className="ghost-link">Open dashboard</Link>
          </div>
          <div className="mini-stats">
            <div><strong>98%+</strong><span>on-time target</span></div>
            <div><strong>40 mi</strong><span>service radius</span></div>
            <div><strong>5 tiers</strong><span>service mix</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="route-layer" aria-hidden="true">
            <span className="route stroke-a" />
            <span className="route stroke-b" />
            <span className="route stroke-c" />
            <span className="route-dot dot-a" />
            <span className="route-dot dot-b" />
            <span className="route-dot dot-c" />
          </div>
          <img src="/assets/phoenix-courier-hero.svg" alt="Desert Express van" />
          <div className="hero-float-card">
            <span>Active dispatch intelligence</span>
            <strong>Lead scoring, quote ranges, revenue estimates, and operator follow-up in one flow.</strong>
          </div>
        </div>
      </section>

      <section className="services-grid">
        {serviceCards.map((service) => (
          <article className="service-card" key={service.title}>
            <strong>{service.title}</strong>
            <p>{service.copy}</p>
          </article>
        ))}
      </section>

      <section className="feature-band">
        <div>
          <p className="eyebrow">Functional stack</p>
          <h2>Built to run the business, not just market it.</h2>
        </div>
        <div className="feature-list">
          <article>
            <strong>Convex-backed leads</strong>
            <p>Every quote request is stored with pricing, projected monthly revenue, lead tier, and recommended follow-up.</p>
          </article>
          <article>
            <strong>Operator dashboard</strong>
            <p>Track total leads, pipeline value, and priority opportunities from a dedicated internal page.</p>
          </article>
          <article>
            <strong>Vercel-ready frontend</strong>
            <p>Next.js App Router project structure with a clean path to deploy once Node is upgraded.</p>
          </article>
        </div>
      </section>

      <QuoteForm />
    </main>
  );
}
