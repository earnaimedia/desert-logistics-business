import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    businessName: v.string(),
    contactName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
    serviceType: v.string(),
    deliverySpeed: v.string(),
    distanceBand: v.string(),
    routeFrequency: v.string(),
    deliveriesPerMonth: v.number(),
    pickupCity: v.string(),
    dropoffCity: v.string(),
    notes: v.string(),
    coldChain: v.boolean(),
    signatureRequired: v.boolean(),
    chainOfCustody: v.boolean(),
    quoteId: v.string(),
    serviceLabel: v.string(),
    speedLabel: v.string(),
    distanceLabel: v.string(),
    estimatedLow: v.number(),
    estimatedHigh: v.number(),
    estimatedMonthlyRevenue: v.number(),
    marginSignal: v.string(),
    priorityScore: v.number(),
    leadTier: v.string(),
    recommendedFollowUp: v.string(),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_priorityScore", ["priorityScore"])
    .index("by_leadTier", ["leadTier"])
    .index("by_serviceType", ["serviceType"]),
});
