"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function LeadsDashboard() {
  const stats = useQuery(api.leads.dashboardStats);
  const leads = useQuery(api.leads.listLeads);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h1>Lead pipeline in Convex</h1>
          <p className="section-copy">
            Prioritized route requests, monthly revenue potential, and immediate follow-up guidance.
          </p>
        </div>
        <Link href="/" className="ghost-link">Back to website</Link>
      </div>

      <div className="stats-grid">
        <article><span>Total leads</span><strong>{stats?.totalLeads ?? "--"}</strong></article>
        <article><span>Priority leads</span><strong>{stats?.priorityLeads ?? "--"}</strong></article>
        <article><span>Avg priority score</span><strong>{stats?.avgPriorityScore ?? "--"}</strong></article>
        <article><span>Pipeline revenue</span><strong>{stats ? `$${stats.pipelineRevenue}` : "--"}</strong></article>
      </div>

      <div className="lead-table-card">
        <div className="table-head">
          <strong>Recent leads</strong>
          <small>{leads ? `${leads.length} saved` : "Waiting for Convex..."}</small>
        </div>
        <div className="lead-table">
          <div className="lead-row lead-row-head">
            <span>Business</span>
            <span>Service</span>
            <span>Tier</span>
            <span>Monthly revenue</span>
            <span>Follow-up</span>
          </div>
          {leads?.map((lead) => (
            <div className="lead-row" key={lead._id}>
              <span>{lead.businessName}</span>
              <span>{lead.serviceLabel}</span>
              <span className={`tier-badge tier-${lead.leadTier}`}>{lead.leadTier}</span>
              <span>${lead.estimatedMonthlyRevenue}</span>
              <span>{lead.recommendedFollowUp}</span>
            </div>
          )) ?? (
            <div className="empty-state">
              Connect Convex and submit a quote from the homepage to populate this table.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
