export type ServiceKey =
  | "standard"
  | "medical"
  | "auto"
  | "legal"
  | "pharmacy"
  | "whiteGlove"
  | "moving";

export type SpeedKey = "sameDay" | "rush" | "stat" | "scheduled";
export type DistanceKey = "near" | "mid" | "far" | "regional";
export type FrequencyKey = "one-time" | "weekly" | "daily" | "monthly";
export type MoveSizeKey = "studio" | "oneBedroom" | "twoBedroom" | "office" | "specialty";
export type CrewSizeKey = "twoPerson" | "threePerson" | "fourPerson";
export type VehicleClassKey = "sedan" | "cargoVan" | "sprinter" | "boxTruck";

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
  moveSize: MoveSizeKey;
  crewSize: CrewSizeKey;
  vehicleClass: VehicleClassKey;
  stairs: boolean;
  assembly: boolean;
  packing: boolean;
  heavyItems: boolean;
};

export type QuoteOutput = {
  quoteId: string;
  serviceLabel: string;
  speedLabel: string;
  distanceLabel: string;
  vehicleLabel: string;
  workflowLabel: string;
  estimatedLow: number;
  estimatedHigh: number;
  estimatedMonthlyRevenue: number;
  marginSignal: "standard" | "strong" | "premium";
  priorityScore: number;
  leadTier: "standard" | "hot" | "priority";
  recommendedFollowUp: string;
  operationsSummary: string;
  createdAt: number;
};

type PriceRange = [number, number];

export const serviceLabels: Record<ServiceKey, string> = {
  standard: "Same-day business delivery",
  medical: "Medical courier",
  auto: "Auto parts delivery",
  legal: "Legal courier",
  pharmacy: "Pharmacy delivery",
  whiteGlove: "White-glove freight",
  moving: "Local moving",
};

export const speedLabels: Record<SpeedKey, string> = {
  sameDay: "Same-day",
  rush: "Rush",
  stat: "STAT",
  scheduled: "Scheduled",
};

export const distanceLabels: Record<DistanceKey, string> = {
  near: "0-10 mi",
  mid: "11-20 mi",
  far: "21-40 mi",
  regional: "41-80 mi",
};

export const moveSizeLabels: Record<MoveSizeKey, string> = {
  studio: "Studio",
  oneBedroom: "1 bedroom",
  twoBedroom: "2 bedroom",
  office: "Office suite",
  specialty: "Specialty item move",
};

export const crewSizeLabels: Record<CrewSizeKey, string> = {
  twoPerson: "2-person crew",
  threePerson: "3-person crew",
  fourPerson: "4-person crew",
};

export const vehicleLabels: Record<VehicleClassKey, string> = {
  sedan: "Sedan",
  cargoVan: "Cargo van",
  sprinter: "Sprinter van",
  boxTruck: "Box truck",
};

export const pricing: Record<ServiceKey, Record<SpeedKey, Record<DistanceKey, PriceRange>>> = {
  standard: {
    sameDay: { near: [18, 25], mid: [25, 35], far: [35, 55], regional: [60, 95] },
    rush: { near: [30, 40], mid: [40, 55], far: [55, 75], regional: [82, 118] },
    stat: { near: [50, 70], mid: [70, 95], far: [95, 130], regional: [140, 185] },
    scheduled: { near: [16, 22], mid: [22, 31], far: [31, 48], regional: [48, 74] },
  },
  medical: {
    sameDay: { near: [30, 45], mid: [45, 65], far: [60, 90], regional: [90, 130] },
    rush: { near: [45, 65], mid: [60, 80], far: [80, 110], regional: [118, 155] },
    stat: { near: [75, 110], mid: [100, 140], far: [130, 175], regional: [188, 245] },
    scheduled: { near: [28, 40], mid: [40, 56], far: [56, 78], regional: [78, 112] },
  },
  auto: {
    sameDay: { near: [20, 32], mid: [28, 42], far: [38, 58], regional: [65, 98] },
    rush: { near: [35, 60], mid: [45, 72], far: [58, 88], regional: [95, 140] },
    stat: { near: [75, 120], mid: [95, 150], far: [125, 185], regional: [190, 265] },
    scheduled: { near: [18, 28], mid: [25, 38], far: [32, 48], regional: [48, 72] },
  },
  legal: {
    sameDay: { near: [22, 32], mid: [32, 45], far: [45, 65], regional: [72, 108] },
    rush: { near: [38, 50], mid: [50, 68], far: [68, 88], regional: [92, 125] },
    stat: { near: [65, 85], mid: [85, 110], far: [110, 150], regional: [158, 210] },
    scheduled: { near: [20, 28], mid: [28, 39], far: [39, 55], regional: [55, 82] },
  },
  pharmacy: {
    sameDay: { near: [32, 48], mid: [48, 68], far: [65, 95], regional: [92, 138] },
    rush: { near: [50, 70], mid: [70, 90], far: [90, 120], regional: [130, 170] },
    stat: { near: [80, 120], mid: [110, 150], far: [145, 190], regional: [205, 270] },
    scheduled: { near: [30, 42], mid: [42, 58], far: [58, 80], regional: [80, 115] },
  },
  whiteGlove: {
    sameDay: { near: [75, 110], mid: [110, 150], far: [150, 210], regional: [225, 320] },
    rush: { near: [95, 135], mid: [135, 185], far: [185, 255], regional: [275, 365] },
    stat: { near: [125, 175], mid: [175, 235], far: [235, 315], regional: [345, 460] },
    scheduled: { near: [68, 98], mid: [98, 135], far: [135, 185], regional: [185, 265] },
  },
  moving: {
    sameDay: { near: [220, 380], mid: [380, 560], far: [560, 780], regional: [780, 1100] },
    rush: { near: [280, 440], mid: [440, 640], far: [640, 880], regional: [900, 1225] },
    stat: { near: [340, 520], mid: [520, 760], far: [760, 1025], regional: [1100, 1480] },
    scheduled: { near: [190, 340], mid: [340, 500], far: [500, 710], regional: [710, 980] },
  },
};

const moveSizeMultipliers: Record<MoveSizeKey, number> = {
  studio: 1,
  oneBedroom: 1.25,
  twoBedroom: 1.55,
  office: 1.9,
  specialty: 1.4,
};

const crewSizeMultipliers: Record<CrewSizeKey, number> = {
  twoPerson: 1,
  threePerson: 1.18,
  fourPerson: 1.34,
};

const vehicleMultipliers: Record<VehicleClassKey, number> = {
  sedan: 1,
  cargoVan: 1.08,
  sprinter: 1.18,
  boxTruck: 1.32,
};

export function discountForVolume(deliveriesPerMonth: number) {
  if (deliveriesPerMonth >= 80) return 0.18;
  if (deliveriesPerMonth >= 50) return 0.15;
  if (deliveriesPerMonth >= 25) return 0.1;
  return 0;
}

function surchargeForLead(lead: LeadInput) {
  let extra = 0;
  if (lead.coldChain) extra += 0.12;
  if (lead.signatureRequired) extra += 0.05;
  if (lead.chainOfCustody) extra += 0.08;
  if (lead.stairs) extra += 0.07;
  if (lead.assembly) extra += 0.08;
  if (lead.packing) extra += 0.12;
  if (lead.heavyItems) extra += 0.1;
  return extra;
}

function frequencyMultiplier(frequency: FrequencyKey, deliveriesPerMonth: number) {
  if (frequency === "daily") return Math.max(deliveriesPerMonth, 20);
  if (frequency === "weekly") return Math.max(deliveriesPerMonth, 4);
  if (frequency === "monthly") return Math.max(deliveriesPerMonth, 1);
  return 1;
}

function operationalComplexity(lead: LeadInput) {
  let factor = 1;
  if (lead.serviceType === "moving") {
    factor *= moveSizeMultipliers[lead.moveSize];
    factor *= crewSizeMultipliers[lead.crewSize];
    factor *= vehicleMultipliers[lead.vehicleClass];
  } else if (lead.serviceType === "whiteGlove") {
    factor *= vehicleMultipliers[lead.vehicleClass];
    if (lead.crewSize !== "twoPerson") factor *= crewSizeMultipliers[lead.crewSize];
  } else {
    factor *= vehicleMultipliers[lead.vehicleClass];
  }
  return factor;
}

function priorityScore(lead: LeadInput, monthlyRevenue: number) {
  let score = 20;
  if (lead.routeFrequency === "daily" || lead.routeFrequency === "weekly") score += 25;
  if (lead.serviceType === "medical" || lead.serviceType === "pharmacy") score += 20;
  if (lead.serviceType === "moving" || lead.serviceType === "whiteGlove") score += 12;
  if (lead.deliverySpeed === "stat") score += 12;
  if (lead.chainOfCustody || lead.coldChain) score += 10;
  if (lead.packing || lead.assembly || lead.heavyItems) score += 8;
  if (monthlyRevenue >= 5000) score += 20;
  else if (monthlyRevenue >= 2000) score += 12;
  return Math.min(score, 100);
}

function followUpMessage(priority: number, lead: LeadInput) {
  if (lead.serviceType === "moving" && priority >= 70) {
    return "Call within 15 minutes, confirm access constraints, and offer a crew and truck reservation hold.";
  }
  if (priority >= 80) return "Call within 15 minutes and offer a launch contract with dedicated onboarding.";
  if (priority >= 60) return "Reply within 1 hour with a route proposal and first-order incentive.";
  if (lead.routeFrequency !== "one-time") return "Send a same-day route estimate and confirm pickup schedule details.";
  return "Send a same-day quote by email and invite the customer to book their first run.";
}

function workflowLabelForLead(lead: LeadInput) {
  if (lead.serviceType === "moving") return "Crew dispatch + move day workflow";
  if (lead.serviceType === "whiteGlove") return "Two-person final-mile workflow";
  if (lead.serviceType === "medical" || lead.serviceType === "pharmacy") return "Chain-of-custody route workflow";
  return "Courier dispatch workflow";
}

function operationsSummaryForLead(lead: LeadInput) {
  if (lead.serviceType === "moving") {
    const extras = [lead.stairs && "stairs", lead.packing && "packing", lead.assembly && "assembly", lead.heavyItems && "heavy items"]
      .filter(Boolean)
      .join(", ");
    return `${moveSizeLabels[lead.moveSize]}, ${crewSizeLabels[lead.crewSize]}, ${vehicleLabels[lead.vehicleClass]}${extras ? `, ${extras}` : ""}`;
  }
  return `${vehicleLabels[lead.vehicleClass]}, ${speedLabels[lead.deliverySpeed]}, ${distanceLabels[lead.distanceBand]}`;
}

export function buildQuote(lead: LeadInput): QuoteOutput {
  const [baseLow, baseHigh] = pricing[lead.serviceType][lead.deliverySpeed][lead.distanceBand];
  const discount = lead.serviceType === "moving" ? 0 : discountForVolume(lead.deliveriesPerMonth);
  const surchargeMultiplier = 1 + surchargeForLead(lead);
  const complexityMultiplier = operationalComplexity(lead);
  const estimatedLow = Math.round(baseLow * (1 - discount) * surchargeMultiplier * complexityMultiplier);
  const estimatedHigh = Math.round(baseHigh * (1 - discount) * surchargeMultiplier * complexityMultiplier);
  const estimatedMonthlyRevenue = Math.round(
    ((estimatedLow + estimatedHigh) / 2) * frequencyMultiplier(lead.routeFrequency, lead.deliveriesPerMonth)
  );
  const score = priorityScore(lead, estimatedMonthlyRevenue);
  const marginSignal =
    estimatedHigh >= 160 || lead.serviceType === "medical" || lead.serviceType === "pharmacy" || lead.serviceType === "moving"
      ? "premium"
      : estimatedHigh >= 75
        ? "strong"
        : "standard";
  const leadTier = score >= 80 ? "priority" : score >= 60 ? "hot" : "standard";

  return {
    quoteId: `DS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    serviceLabel: serviceLabels[lead.serviceType],
    speedLabel: speedLabels[lead.deliverySpeed],
    distanceLabel: distanceLabels[lead.distanceBand],
    vehicleLabel: vehicleLabels[lead.vehicleClass],
    workflowLabel: workflowLabelForLead(lead),
    estimatedLow,
    estimatedHigh,
    estimatedMonthlyRevenue,
    marginSignal,
    priorityScore: score,
    leadTier,
    recommendedFollowUp: followUpMessage(score, lead),
    operationsSummary: operationsSummaryForLead(lead),
    createdAt: Date.now(),
  };
}
