import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { buildQuote, type LeadInput } from "../lib/pricing";

const leadValidator = {
  businessName: v.string(),
  contactName: v.string(),
  contactEmail: v.string(),
  contactPhone: v.string(),
  serviceType: v.union(
    v.literal("standard"),
    v.literal("medical"),
    v.literal("auto"),
    v.literal("legal"),
    v.literal("pharmacy")
  ),
  deliverySpeed: v.union(v.literal("sameDay"), v.literal("rush"), v.literal("stat")),
  distanceBand: v.union(v.literal("near"), v.literal("mid"), v.literal("far")),
  routeFrequency: v.union(v.literal("one-time"), v.literal("weekly"), v.literal("daily"), v.literal("monthly")),
  deliveriesPerMonth: v.number(),
  pickupCity: v.string(),
  dropoffCity: v.string(),
  notes: v.string(),
  coldChain: v.boolean(),
  signatureRequired: v.boolean(),
  chainOfCustody: v.boolean(),
};

export const createLead = mutation({
  args: leadValidator,
  handler: async (ctx, args) => {
    const quote = buildQuote(args as LeadInput);
    const doc = { ...args, ...quote };
    const id = await ctx.db.insert("leads", doc);
    return { _id: id, ...doc };
  },
});

export const listLeads = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").collect();
    return leads.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      return b.estimatedMonthlyRevenue - a.estimatedMonthlyRevenue;
    });
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    const totalLeads = leads.length;
    const pipelineRevenue = leads.reduce((sum, lead) => sum + lead.estimatedMonthlyRevenue, 0);
    const priorityLeads = leads.filter((lead) => lead.leadTier === "priority").length;
    const avgPriorityScore = totalLeads
      ? Math.round(leads.reduce((sum, lead) => sum + lead.priorityScore, 0) / totalLeads)
      : 0;

    return {
      totalLeads,
      pipelineRevenue,
      priorityLeads,
      avgPriorityScore,
    };
  },
});
