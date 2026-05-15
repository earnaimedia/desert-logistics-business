import Link from "next/link";
import { QuoteForm } from "../components/quote-form";
import { TaskHub } from "../components/task-hub";

const navItems = [
  {
    label: "Shipping",
    href: "#quote",
  },
  {
    label: "Tracking",
    href: "#tools",
  },
  {
    label: "Moving",
    href: "#quote",
  },
  {
    label: "Coverage",
    href: "#tools",
  },
  {
    label: "Support",
    href: "#quote",
  },
];

const simpleFeatures = [
  {
    title: "Courier",
    copy: "Same-day and scheduled routes for medical, retail, legal, and business stops.",
  },
  {
    title: "Moving",
    copy: "Apartment, office, furniture, and heavy-item moves with crew planning.",
  },
  {
    title: "White-glove",
    copy: "Two-person placement, premium handling, setup support, and proof of delivery.",
  },
];

const trustPoints = [
  "Same-day dispatch",
  "Moving crews",
  "Live tracking",
  "Proof of delivery",
];

export default function HomePage() {
  return (
    <main className="site-shell simple-site-shell">
      <section className="topbar topbar-fedex-style">
        <div className="brand-lockup">
          <span className="brand-mark">DS</span>
          <div>
            <strong>Desert Sonic</strong>
            <span>Phoenix courier and moving</span>
          </div>
        </div>

        <nav className="top-nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions nav-actions-tight">
          <Link href="/dashboard" className="ghost-link ghost-link-light">Dashboard</Link>
          <a href="#quote" className="top-login-link">Book now</a>
        </div>
      </section>

      <section className="hero-simple hero-fedex-style">
        <div className="hero-simple-copy">
          <p className="eyebrow">Phoenix logistics made simple</p>
          <h1>Keep deliveries and moves moving.</h1>
          <p className="section-copy">
            From documents and medical runs to apartment moves and white-glove drop-offs, Desert Sonic gives customers one place to book, track, and plan.
          </p>
          <div className="hero-trust-row" aria-label="Key capabilities">
            {trustPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a href="#quote" className="primary-button">Start a quote</a>
            <a href="#tools" className="ghost-link">Open tools</a>
          </div>
          <div className="simple-feature-grid">
            {simpleFeatures.map((feature) => (
              <article key={feature.title}>
                <strong>{feature.title}</strong>
                <span>{feature.copy}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-image-panel">
          <div className="hero-stat-card">
            <span>Average Phoenix response</span>
            <strong>35-55 min</strong>
            <small>Courier, pickup, and moving dispatch windows across the metro.</small>
          </div>
          <div className="hero-image-overlay">
            <span>Desert Sonic</span>
            <strong>Fast booking, live tools, and dispatch-ready planning across Phoenix.</strong>
          </div>
          <img src="/assets/phoenix-courier-hero.svg" alt="Desert Sonic delivery vehicle" />
        </div>
      </section>

      <TaskHub />
      <QuoteForm />
    </main>
  );
}
