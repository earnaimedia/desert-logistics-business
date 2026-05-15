export type ServiceKey = "standard" | "medical" | "auto" | "legal" | "pharmacy";
export type SpeedKey = "sameDay" | "rush" | "stat";
export type DistanceKey = "near" | "mid" | "far";
export type FrequencyKey = "one-time" | "weekly" | "daily" | "monthly";

export type LeadInput = {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  serviceType: ServiceKey;
  deliverySpeed: SpeedKey;
  distanceBand: DistanceKey;
  routeFrequency: FrequencyKey;
  deliveriesPerMonth: number;
  pickupCity: string;
  dropoffCity: string;
  notes: string;
  coldChain: boolean;
  signatureRequired: boolean;
  chainOfCustody: boolean;
};

export type QuoteOutput = {
  quoteId: string;
  serviceLabel: string;
  speedLabel: string;
  distanceLabel: string;
  estimatedLow: number;
  estimatedHigh: number;
  estimatedMonthlyRevenue: number;
  marginSignal: "standard" | "strong" | "premium";
  priorityScore: number;
  leadTier: "standard" | "hot" | "priority";
  recommendedFollowUp: string;
  createdAt: number;
};

type PriceRange = [number, number];

export const serviceLabels: Record<ServiceKey, string> = {
  standard: "Same-day business delivery",
  medical: "Medical courier",
  auto: "Auto parts delivery",
  legal: "Legal courier",
  pharmacy: "Pharmacy delivery",
};

export const speedLabels: Record<SpeedKey, string> = {
  sameDay: "Same-day",
  rush: "Rush",
  stat: "STAT",
};

export const distanceLabels: Record<DistanceKey, string> = {
  near: "0-10 mi",
  mid: "11-20 mi",
  far: "21-40 mi",
};

export const pricing: Record<ServiceKey, Record<SpeedKey, Record<DistanceKey, PriceRange>>> = {
  standard: {
    sameDay: { near: [18, 25], mid: [25, 35], far: [35, 55] },
    rush: { near: [30, 40], mid: [40, 55], far: [55, 75] },
    stat: { near: [50, 70], mid: [70, 95], far: [95, 130] },
  },
  medical: {
    sameDay: { near: [30, 45], mid: [45, 65], far: [60, 90] },
    rush: { near: [45, 65], mid: [60, 80], far: [80, 110] },
    stat: { near: [75, 110], mid: [100, 140], far: [130, 175] },
  },
  auto: {
    sameDay: { near: [15, 25], mid: [15, 25], far: [15, 25] },
    rush: { near: [35, 60], mid: [35, 60], far: [35, 60] },
    stat: { near: [250, 400], mid: [250, 400], far: [250, 400] },
  },
  legal: {
    sameDay: { near: [22, 32], mid: [32, 45], far: [45, 65] },
    rush: { near: [38, 50], mid: [50, 68], far: [68, 88] },
    stat: { near: [65, 85], mid: [85, 110], far: [110, 150] },
  },
  pharmacy: {
    sameDay: { near: [32, 48], mid: [48, 68], far: [65, 95] },
    rush: { near: [50, 70], mid: [70, 90], far: [90, 120] },
    stat: { near: [80, 120], mid: [110, 150], far: [145, 190] },
  },
};

export function discountForVolume(deliveriesPerMonth: number) {
  if (deliveriesPerMonth >= 50) return 0.15;
  if (deliveriesPerMonth >= 25) return 0.1;
  return 0;
}

function surchargeForLead(lead: LeadInput) {
  let extra = 0;
  if (lead.coldChain) extra += 0.12;
  if (lead.signatureRequired) extra += 0.05;
  if (lead.chainOfCustody) extra += 0.08;
  return extra;
}

function frequencyMultiplier(frequency: FrequencyKey, deliveriesPerMonth: number) {
  if (frequency === "daily") return Math.max(deliveriesPerMonth, 20);
  if (frequency === "weekly") return Math.max(deliveriesPerMonth, 4);
  if (frequency === "monthly") return Math.max(deliveriesPerMonth, 1);
  return 1;
}

function priorityScore(lead: LeadInput, monthlyRevenue: number) {
  let score = 20;
  if (lead.routeFrequency === "daily" || lead.routeFrequency === "weekly") score += 25;
  if (lead.serviceType === "medical" || lead.serviceType === "pharmacy") score += 20;
  if (lead.deliverySpeed === "stat") score += 12;
  if (lead.chainOfCustody || lead.coldChain) score += 10;
  if (monthlyRevenue >= 3000) score += 20;
  else if (monthlyRevenue >= 1000) score += 10;
  return Math.min(score, 100);
}

function followUpMessage(priority: number, lead: LeadInput) {
  if (priority >= 80) return "Call within 15 minutes and offer a launch contract with dedicated onboarding.";
  if (priority >= 60) return "Reply within 1 hour with a route proposal and first-order incentive.";
  if (lead.routeFrequency !== "one-time") return "Send a same-day route estimate and confirm pickup schedule details.";
  return "Send a same-day quote by email and invite the customer to book their first run.";
}

export function buildQuote(lead: LeadInput): QuoteOutput {
  const [baseLow, baseHigh] = pricing[lead.serviceType][lead.deliverySpeed][lead.distanceBand];
  const discount = discountForVolume(lead.deliveriesPerMonth);
  const surchargeMultiplier = 1 + surchargeForLead(lead);
  const estimatedLow = Math.round(baseLow * (1 - discount) * surchargeMultiplier);
  const estimatedHigh = Math.round(baseHigh * (1 - discount) * surchargeMultiplier);
  const estimatedMonthlyRevenue = Math.round(
    ((estimatedLow + estimatedHigh) / 2) * frequencyMultiplier(lead.routeFrequency, lead.deliveriesPerMonth)
  );
  const score = priorityScore(lead, estimatedMonthlyRevenue);
  const marginSignal =
    estimatedHigh >= 120 || lead.serviceType === "medical" || lead.serviceType === "pharmacy"
      ? "premium"
      : estimatedHigh >= 60
        ? "strong"
        : "standard";
  const leadTier = score >= 80 ? "priority" : score >= 60 ? "hot" : "standard";

  return {
    quoteId: `DX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    serviceLabel: serviceLabels[lead.serviceType],
    speedLabel: speedLabels[lead.deliverySpeed],
    distanceLabel: distanceLabels[lead.distanceBand],
    estimatedLow,
    estimatedHigh,
    estimatedMonthlyRevenue,
    marginSignal,
    priorityScore: score,
    leadTier,
    recommendedFollowUp: followUpMessage(score, lead),
    createdAt: Date.now(),
  };
}
