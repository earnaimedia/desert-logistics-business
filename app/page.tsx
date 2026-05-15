import Link from "next/link";
import { OperationsShowcase } from "../components/operations-showcase";
import { QuoteForm } from "../components/quote-form";
import { TaskHub } from "../components/task-hub";

const industries = [
  {
    title: "Healthcare and labs",
    copy: "STAT moves, refrigerated chain-of-custody, recurring specimen sweeps, and pharmacy handoffs built for documented compliance.",
  },
  {
    title: "Retail and white-glove",
    copy: "Oversized deliveries, room-of-choice placement, returns pickup, and post-purchase visibility for premium customer experiences.",
  },
  {
    title: "Moving and relocation",
    copy: "Apartment moves, office relocations, staging support, crew assignment, and truck sizing from the same booking surface.",
  },
  {
    title: "Business operations",
    copy: "Auto parts routes, legal filings, interoffice logistics, and recurring scheduled delivery plans across the metro.",
  },
];

const productStats = [
  { value: "15m", label: "priority lead follow-up target" },
  { value: "4x", label: "service modes in one booking flow" },
  { value: "24/7", label: "booking, tracking, and dispatch surface" },
  { value: "80mi", label: "regional moving and final-mile radius" },
];

export default function HomePage() {
  return (
    <main className="site-shell site-shell-startup">
      <section className="startup-nav">
        <div className="brand-lockup">
          <span className="brand-mark">DS</span>
          <div>
            <strong>Desert Sonic</strong>
            <span>Courier, moving, and final-mile operations</span>
          </div>
        </div>
        <div className="nav-actions">
          <a href="#quote" className="ghost-link">Book a quote</a>
          <Link href="/dashboard" className="primary-button">Operations dashboard</Link>
        </div>
      </section>

      <section className="hero-startup">
        <div className="hero-startup-copy">
          <p className="eyebrow">Built for what logistics should feel like next</p>
          <h1>The startup-grade operating system for courier, white-glove, and moving jobs.</h1>
          <p className="section-copy">
            Desert Sonic is designed like a real product: instant pricing, coverage intelligence, job-type aware
            booking, tracking states, and a lead pipeline that hands dispatch-ready opportunities to the team.
          </p>
          <div className="hero-actions">
            <a href="#quote" className="primary-button">Get instant pricing</a>
            <a href="#platform" className="ghost-link">See the platform</a>
          </div>
          <div className="startup-stats-grid">
            {productStats.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-command-center">
          <div className="hero-command-grid" aria-hidden="true">
            <span className="grid-line line-a" />
            <span className="grid-line line-b" />
            <span className="grid-line line-c" />
            <span className="signal-node node-a" />
            <span className="signal-node node-b" />
            <span className="signal-node node-c" />
          </div>
          <div className="command-card command-card-primary">
            <span>Dispatch board</span>
            <strong>Courier, moving, and white-glove jobs all enter the same operating lane.</strong>
            <p>Route fit, truck fit, crew fit, and proof-of-delivery logic are visible before a lead is saved.</p>
          </div>
          <div className="command-card command-card-float">
            <span>Now routing</span>
            <strong>Phoenix {"->"} Tempe {"->"} Scottsdale</strong>
            <p>Medical specimen sweep, office move assist, and same-day retail recovery running in parallel.</p>
          </div>
          <div className="command-chip-row">
            <span>Same-day</span>
            <span>White-glove</span>
            <span>Moving</span>
            <span>Tracking</span>
          </div>
        </div>
      </section>

      <TaskHub />

      <section id="platform" className="industry-band">
        <div className="industry-band-copy">
          <p className="eyebrow">Industry coverage</p>
          <h2>A single front door for every logistics job your market actually buys.</h2>
        </div>
        <div className="industry-grid">
          {industries.map((industry) => (
            <article className="industry-card" key={industry.title}>
              <strong>{industry.title}</strong>
              <p>{industry.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <OperationsShowcase />
      <QuoteForm />
    </main>
  );
}
