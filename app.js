const API_BASE_URL = window.DX_API_BASE_URL || "http://127.0.0.1:8000";

const rates = {
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

const serviceLabels = {
  standard: "Same-day business delivery",
  medical: "Medical courier",
  auto: "Auto parts delivery",
  legal: "Legal courier",
  pharmacy: "Pharmacy delivery",
};

const speedLabels = {
  sameDay: "same-day",
  rush: "rush",
  stat: "STAT direct",
};

const distanceLabels = {
  near: "0-10 miles",
  mid: "11-20 miles",
  far: "21-40 miles",
};

const serviceType = document.querySelector("#serviceType");
const deliverySpeed = document.querySelector("#deliverySpeed");
const distanceBand = document.querySelector("#distanceBand");
const estimate = document.querySelector("#estimate");
const estimateNote = document.querySelector("#estimateNote");
const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");

function formatRange([low, high], plus = false) {
  return `$${low}-$${high}${plus ? "+" : ""}`;
}

function currentRange() {
  return rates[serviceType.value][deliverySpeed.value][distanceBand.value];
}

function updateEstimate() {
  const service = serviceType.value;
  const speed = deliverySpeed.value;
  const distance = distanceBand.value;
  const plus = (service === "medical" || service === "pharmacy") && speed === "stat" && distance === "far";

  estimate.textContent = formatRange(currentRange(), plus);
  estimateNote.textContent = `${serviceLabels[service]}, ${speedLabels[speed]}, ${distanceLabels[distance]}.`;
}

function serializeLead() {
  const data = new FormData(leadForm);

  return {
    business_name: (data.get("businessName") || "").trim(),
    contact_name: (data.get("contactName") || "").trim(),
    contact_email: (data.get("contactEmail") || "").trim(),
    contact_phone: (data.get("contactPhone") || "").trim(),
    service_type: serviceType.value,
    delivery_speed: deliverySpeed.value,
    distance_band: distanceBand.value,
    route_frequency: data.get("frequency"),
    deliveries_per_month: Number(data.get("deliveriesPerMonth") || 1),
    pickup_city: (data.get("pickupCity") || "").trim(),
    dropoff_city: (data.get("dropoffCity") || "").trim(),
    notes: (data.get("notes") || "").trim(),
    cold_chain: data.get("coldChain") === "on",
    signature_required: data.get("signatureRequired") === "on",
    chain_of_custody: data.get("chainOfCustody") === "on",
  };
}

function validateLead(payload) {
  const requiredFields = [
    payload.business_name,
    payload.contact_name,
    payload.contact_email,
    payload.contact_phone,
    payload.pickup_city,
    payload.dropoff_city,
  ];

  return requiredFields.every(Boolean);
}

async function createSummary(event) {
  event.preventDefault();
  const payload = serializeLead();

  if (!validateLead(payload)) {
    formStatus.textContent = "Add business, contact, phone, email, pickup city, and dropoff city to save the quote.";
    return;
  }

  formStatus.textContent = "Saving lead and generating revenue-grade quote...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const quote = await response.json();
    estimate.textContent = formatRange([quote.estimated_low, quote.estimated_high]);
    estimateNote.textContent = `${quote.service_label}, ${quote.speed_label}, ${quote.distance_label}.`;

    formStatus.textContent =
      `${quote.quote_id}: ${quote.lead_tier.toUpperCase()} lead for ${payload.business_name}. ` +
      `Projected monthly revenue $${quote.estimated_monthly_revenue}. ` +
      `Follow-up: ${quote.recommended_follow_up}`;
  } catch (error) {
    formStatus.textContent =
      "The Python API is not reachable yet. Start `uvicorn backend.main:app --reload` to save leads for real.";
    console.error(error);
  }
}

[serviceType, deliverySpeed, distanceBand].forEach((field) => {
  field.addEventListener("input", updateEstimate);
});

leadForm.addEventListener("submit", createSummary);
updateEstimate();

const revealTargets = document.querySelectorAll(
  ".section, .logo-strip, .value-grid article, .solution-cards article, .industry-grid article, .pricing-grid article"
);

revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
