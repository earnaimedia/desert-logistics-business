import Link from "next/link";
import { QuoteForm } from "../components/quote-form";
import { TaskHub } from "../components/task-hub";

const simpleFeatures = [
  {
    title: "Same-day courier",
    copy: "Medical, legal, pharmacy, retail, and business delivery.",
  },
  {
    title: "Moving support",
    copy: "Apartment, office, heavy-item, and white-glove jobs.",
  },
  {
    title: "Live tools",
    copy: "Track jobs, check coverage, plan pickups, and price instantly.",
  },
];

export default function HomePage() {
  return (
    <main className="site-shell simple-site-shell">
      <section className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">DS</span>
          <div>
            <strong>Desert Sonic</strong>
            <span>Phoenix courier and moving</span>
          </div>
        </div>
        <div className="nav-actions">
          <a href="#tools" className="ghost-link">Tools</a>
          <a href="#quote" className="primary-button">Get quote</a>
          <Link href="/dashboard" className="ghost-link">Dashboard</Link>
        </div>
      </section>

      <section className="hero-simple">
        <div className="hero-simple-copy">
          <p className="eyebrow">Fast, simple, local</p>
          <h1>Courier and moving services for Phoenix.</h1>
          <p className="section-copy">
            Book deliveries, moving jobs, pickups, and coverage checks from one clean workflow.
          </p>
          <div className="hero-actions">
            <a href="#quote" className="primary-button">Start booking</a>
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
          <div className="hero-image-overlay">
            <span>Desert Sonic</span>
            <strong>Same-day delivery, moving, and white-glove support across Phoenix.</strong>
          </div>
          <img src="/assets/phoenix-courier-hero.svg" alt="Desert Sonic delivery vehicle" />
        </div>
      </section>

      <TaskHub />
      <QuoteForm />
    </main>
  );
}
