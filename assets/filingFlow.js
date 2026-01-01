window.currentStep = 1;
const totalSteps = 4;

function updateProgress() {
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById(`prog${i}`).classList.toggle('active', i <= window.currentStep);
  }
}

window.saveDraft = function() {
  const data = {
    grossIncome: document.getElementById("grossIncome")?.value || "",
    otherIncome: document.getElementById("otherIncome")?.value || "",
    rentPaid: document.getElementById("rentPaid")?.value || "",
    pensionNHF: document.getElementById("pensionNHF")?.value || "",
    otherDeductions: document.getElementById("otherDeductions")?.value || "",
    whtCredit: document.getElementById("whtCredit")?.value || ""
  };
  localStorage.setItem("taxDraft", JSON.stringify(data));
  alert("Draft saved!");
}

window.clearDraft = function() {
  localStorage.removeItem("taxDraft");
  location.reload(); // refresh page
}

window.loadDraft = function() {
  const saved = JSON.parse(localStorage.getItem("taxDraft") || "{}");
  Object.keys(saved).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.value = saved[key];
  });
}

window.showStep = function(step) {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`step${i}`);
    if (!el) continue;
    el.classList.toggle("active", i === step);
  }
  updateProgress();
}

window.nextStep = function() {
  if (window.currentStep < totalSteps) window.currentStep++;
  window.showStep(window.currentStep);
  if (window.currentStep === 4) populateReview();
  saveDraft();
}

window.prevStep = function() {
  if (window.currentStep > 1) window.currentStep--;
  window.showStep(window.currentStep);
  saveDraft();
}

// PIT calculation with all deductions
function calculatePIT(grossIncome, otherIncome, deductions) {
  const totalIncome = grossIncome + otherIncome;
  const totalDeductions = deductions.basicExemption + deductions.rentRelief + deductions.pensionNHF + deductions.other;
  const taxable = Math.max(0, totalIncome - totalDeductions);

  const bands = [
    [2200000, 0.15],
    [9000000, 0.18],
    [13000000,0.21],
    [25000000,0.23],
    [Infinity,0.25]
  ];

  let remaining = taxable;
  let tax = 0;
  for (const [limit, rate] of bands) {
    if (remaining <= 0) break;
    const amount = Math.min(remaining, limit);
    tax += amount * rate;
    remaining -= amount;
  }
  return Math.round(tax);
}

function populateReview() {
  const grossIncome = parseFloat(document.getElementById("grossIncome")?.value) || 0;
  const otherIncome = parseFloat(document.getElementById("otherIncome")?.value) || 0;
  const rentPaid = parseFloat(document.getElementById("rentPaid")?.value) || 0;
  const pensionNHF = parseFloat(document.getElementById("pensionNHF")?.value) || 0;
  const otherDeductions = parseFloat(document.getElementById("otherDeductions")?.value) || 0;
  const whtCredit = parseFloat(document.getElementById("whtCredit")?.value) || 0;

  const deductions = {
    basicExemption: 800000,
    rentRelief: Math.min(rentPaid * 0.2, 500000),
    pensionNHF: pensionNHF,
    other: otherDeductions
  };

  const taxAmount = calculatePIT(grossIncome, otherIncome, deductions);
  const netTaxPayable = Math.max(0, taxAmount - whtCredit);

  window.__taxResult = {
    grossIncome, otherIncome, rentPaid, pensionNHF, otherDeductions, whtCredit,
    deductions, taxAmount, netTaxPayable
  };

  const reviewEl = document.getElementById("review");
  reviewEl.innerHTML = `
    <p><strong>Gross Income:</strong> ₦${grossIncome.toLocaleString()}</p>
    <p><strong>Other Income:</strong> ₦${otherIncome.toLocaleString()}</p>
    <p><strong>Deductions:</strong></p>
    <ul>
      <li>Basic Exemption: ₦${deductions.basicExemption.toLocaleString()}</li>
      <li>Rent Relief: ₦${deductions.rentRelief.toLocaleString()}</li>
      <li>Pension + NHF: ₦${deductions.pensionNHF.toLocaleString()}</li>
      <li>Other Deductions: ₦${deductions.other.toLocaleString()}</li>
    </ul>
    <p><strong>WHT Credit:</strong> ₦${whtCredit.toLocaleString()}</p>
    <p class="mt-2 font-bold text-emerald-400"><strong>Total Tax:</strong> ₦${taxAmount.toLocaleString()}</p>
    <p class="font-bold text-purple-400"><strong>Net Tax Payable:</strong> ₦${netTaxPayable.toLocaleString()}</p>
  `;
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  loadDraft();
  window.showStep(window.currentStep);
});
