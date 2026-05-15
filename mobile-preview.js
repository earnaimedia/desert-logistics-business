const prices = {
  medical: { label: "Medical", base: [60, 80], note: "Medical rush delivery, 11-20 miles" },
  standard: { label: "B2B", base: [40, 55], note: "Standard rush delivery, 11-20 miles" },
  auto: { label: "Auto", base: [35, 60], note: "Rush auto parts delivery" },
  legal: { label: "Legal", base: [50, 68], note: "Legal document rush delivery, 11-20 miles" }
};

const tabButtons = document.querySelectorAll("[data-tab], [data-go]");
const screens = document.querySelectorAll(".screen");
const serviceButtons = document.querySelectorAll("[data-service]");
const serviceLabel = document.querySelector("#serviceLabel");
const quotePrice = document.querySelector("#quotePrice");
const quoteNote = document.querySelector("#quoteNote");
const volume = document.querySelector("#volume");

let currentService = "medical";

function showScreen(name) {
  document.body.dataset.screen = name;

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.tab === name);
  });
}

function updateQuote() {
  const deliveries = Number.parseInt(volume.value, 10) || 0;
  const discount = deliveries >= 50 ? 0.15 : deliveries >= 25 ? 0.1 : 0;
  const selected = prices[currentService];
  const range = selected.base.map((price) => Math.round(price * (1 - discount)));
  quotePrice.textContent = `$${range[0]}-$${range[1]}`;
  if (quotePrice.animate) {
    quotePrice.animate(
      [
        { transform: "translateY(4px)", opacity: 0.62 },
        { transform: "translateY(0)", opacity: 1 }
      ],
      { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
  }
  quoteNote.textContent = `${selected.note}, with ${Math.round(discount * 100)}% volume discount.`;
  serviceLabel.textContent = selected.label;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.tab || button.dataset.go);
  });
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentService = button.dataset.service;
    serviceButtons.forEach((candidate) => candidate.classList.toggle("selected", candidate === button));
    updateQuote();
  });
});

volume.addEventListener("input", updateQuote);
updateQuote();
