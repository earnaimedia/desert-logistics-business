export type ServiceKey = "standard" | "medical" | "auto" | "legal" | "pharmacy";
export type SpeedKey = "sameDay" | "rush" | "stat";
export type DistanceKey = "near" | "mid" | "far";

export type PriceRange = [number, number];

export type ServicePricing = {
  label: string;
  shortLabel: string;
  accent: string;
  description: string;
  speeds: Record<
    SpeedKey,
    {
      label: string;
      window: string;
      near: PriceRange;
      mid: PriceRange;
      far: PriceRange;
    }
  >;
};

export const servicePricing: Record<ServiceKey, ServicePricing> = {
  standard: {
    label: "Standard B2B Delivery",
    shortLabel: "B2B",
    accent: "#256c99",
    description: "Documents, packages, office supplies, and recurring business deliveries.",
    speeds: {
      sameDay: { label: "Same-day", window: "4-6 hours", near: [18, 25], mid: [25, 35], far: [35, 55] },
      rush: { label: "Rush", window: "2 hours", near: [30, 40], mid: [40, 55], far: [55, 75] },
      stat: { label: "STAT", window: "60-90 min", near: [50, 70], mid: [70, 95], far: [95, 130] }
    }
  },
  medical: {
    label: "Medical Courier",
    shortLabel: "Medical",
    accent: "#1f7a5d",
    description: "HIPAA-ready lab specimens, pharmaceuticals, records, and equipment.",
    speeds: {
      sameDay: { label: "Same-day", window: "Same day", near: [30, 45], mid: [45, 65], far: [60, 90] },
      rush: { label: "Rush", window: "2-4 hours", near: [45, 65], mid: [60, 80], far: [80, 110] },
      stat: { label: "STAT", window: "Immediate", near: [75, 110], mid: [100, 140], far: [130, 175] }
    }
  },
  auto: {
    label: "Auto Parts Delivery",
    shortLabel: "Auto",
    accent: "#b85635",
    description: "Dealership-to-shop parts runs, OEM routes, and cargo van handling.",
    speeds: {
      sameDay: { label: "Route stop", window: "Scheduled", near: [15, 25], mid: [15, 25], far: [15, 25] },
      rush: { label: "Rush part", window: "Rush single", near: [35, 60], mid: [35, 60], far: [35, 60] },
      stat: { label: "Daily route", window: "Dedicated", near: [250, 400], mid: [250, 400], far: [250, 400] }
    }
  },
  legal: {
    label: "Legal Document Courier",
    shortLabel: "Legal",
    accent: "#6851a3",
    description: "Court filings, proof of service, certified handling, and title documents.",
    speeds: {
      sameDay: { label: "Same-day", window: "4-6 hours", near: [22, 32], mid: [32, 45], far: [45, 65] },
      rush: { label: "Rush", window: "2 hours", near: [38, 50], mid: [50, 68], far: [68, 88] },
      stat: { label: "STAT", window: "60-90 min", near: [65, 85], mid: [85, 110], far: [110, 150] }
    }
  },
  pharmacy: {
    label: "Pharmacy Delivery",
    shortLabel: "Pharmacy",
    accent: "#c4872e",
    description: "Signature-required prescription and cold-chain pharmaceutical transport.",
    speeds: {
      sameDay: { label: "Same-day", window: "Same day", near: [32, 48], mid: [48, 68], far: [65, 95] },
      rush: { label: "Rush", window: "2-4 hours", near: [50, 70], mid: [70, 90], far: [90, 120] },
      stat: { label: "STAT", window: "Immediate", near: [80, 120], mid: [110, 150], far: [145, 190] }
    }
  }
};

export const distanceBands: Array<{ key: DistanceKey; label: string; helper: string }> = [
  { key: "near", label: "0-10 mi", helper: "Central Phoenix routes" },
  { key: "mid", label: "11-20 mi", helper: "Cross-city runs" },
  { key: "far", label: "21-40 mi", helper: "Metro-wide coverage" }
];

export const volumeTiers = [
  { minimum: 0, label: "Starter", discount: 0, detail: "Best for one-off and trial deliveries." },
  { minimum: 25, label: "Growth", discount: 0.1, detail: "Monthly minimums unlock 10% savings." },
  { minimum: 50, label: "Contract", discount: 0.15, detail: "High-volume clients receive 15% savings." }
];

export const coverageCities = ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", "Glendale", "Peoria", "Gilbert"];

export const dashboardMetrics = [
  { label: "Target SLA", value: "98%+", helper: "On-time delivery rate" },
  { label: "Break-even", value: "M5-M6", helper: "Conservative forecast" },
  { label: "Launch", value: "Q3 2026", helper: "Phoenix metro" },
  { label: "Budget", value: "$40K", helper: "Startup plan" }
];

export const activeDeliveries = [
  {
    id: "DX-1042",
    client: "Banner clinic network",
    service: "Medical",
    status: "In transit",
    eta: "11:35 AM",
    pickup: "Phoenix",
    dropoff: "Scottsdale",
    driver: "N. Patel",
    vehicle: "SUV 02",
    distance: "14.2 mi",
    proof: "Temp log pending",
    compliance: ["HIPAA", "Chain of custody", "Cold-chain"],
    steps: ["Booked", "Picked up", "In transit", "Delivered"]
  },
  {
    id: "DX-1043",
    client: "Camelback Auto Group",
    service: "Auto",
    status: "Pickup next",
    eta: "12:10 PM",
    pickup: "Glendale",
    dropoff: "Tempe",
    driver: "A. Lewis",
    vehicle: "Cargo van 01",
    distance: "21.8 mi",
    proof: "Photo POD required",
    compliance: ["Cargo straps", "Damage photo"],
    steps: ["Booked", "Assigned", "Pickup next", "Delivered"]
  },
  {
    id: "DX-1044",
    client: "Maricopa legal office",
    service: "Legal",
    status: "Delivered",
    eta: "Completed 10:28 AM",
    pickup: "Mesa",
    dropoff: "Phoenix",
    driver: "N. Patel",
    vehicle: "SUV 02",
    distance: "18.6 mi",
    proof: "Signature captured",
    compliance: ["Proof of service", "Signature"],
    steps: ["Booked", "Picked up", "Filed", "Delivered"]
  }
];

export const qualityTargets = [
  { label: "On-time delivery", target: "98%+", current: "98.2%" },
  { label: "Damage/loss rate", target: "<0.1%", current: "0.0%" },
  { label: "STAT response", target: "<30 min", current: "24 min" },
  { label: "Customer rating", target: "4.5+", current: "4.8" }
];

export const launchRoadmap = [
  {
    phase: "Foundation",
    range: "Days 1-30",
    actions: [
      "File Arizona LLC, EIN, TPT license, and city business registration.",
      "Secure insurance, acquire the cargo van, and outfit driver supplies.",
      "Set up dispatch software, Google Business Profile, website, and outreach list."
    ],
    milestone: "Operational with first paying customers."
  },
  {
    phase: "Soft launch",
    range: "Days 31-60",
    actions: [
      "Accept 3-5 deliveries per day with owner as primary driver.",
      "Launch Google Ads and continue 10-15 weekly business visits.",
      "Hire first part-time driver and begin medical courier training."
    ],
    milestone: "8-10 daily deliveries and first recurring contracts."
  },
  {
    phase: "Full operations",
    range: "Days 61-90",
    actions: [
      "Acquire the second vehicle and establish recurring daily routes.",
      "Launch medical courier services with HIPAA documentation.",
      "Review pricing and prepare Month 4-6 hiring plan."
    ],
    milestone: "2 vehicles, 12+ daily deliveries, and clear path to break-even."
  }
];

export const targetSegments = [
  { segment: "Healthcare", count: "30+ hospitals", opportunity: "Premium recurring medical routes" },
  { segment: "Automotive", count: "200+ dealers", opportunity: "Daily parts routes and rush jobs" },
  { segment: "Legal", count: "Maricopa County", opportunity: "Court filings and proof of service" },
  { segment: "Industrial", count: "460M+ SF", opportunity: "Warehouses, manufacturing, and 3PL overflow" }
];

export function discountForVolume(deliveriesPerMonth: number) {
  if (deliveriesPerMonth >= 50) {
    return 0.15;
  }

  if (deliveriesPerMonth >= 25) {
    return 0.1;
  }

  return 0;
}

export function quoteRange(service: ServiceKey, speed: SpeedKey, distance: DistanceKey, deliveriesPerMonth: number) {
  const base = servicePricing[service].speeds[speed][distance];
  const discount = discountForVolume(deliveriesPerMonth);

  return base.map((value) => Math.round(value * (1 - discount))) as PriceRange;
}

export function formatRange(range: PriceRange) {
  return `$${range[0]}-$${range[1]}`;
}
