window.currentStep = 1;
const totalSteps = 4;

// Save form to localStorage
function saveDraft() {
  const data = {
    grossIncome: document.getElementById("grossIncome")?.value || "",
    otherIncome: document.getElementById("otherIncome")?.value || "",
    rentPaid: document.getElementById("rentPaid")?.value || "",
    pensionNHF: document.getElementById("pensionNHF")?.value || "",
    whtCredit: document.getElementById("whtCredit")?.value || ""
  };
  localStorage.setItem("taxDraft", JSON.stringify(data));
  alert("Draft saved!");
}

// Load saved draft
function loadDraft() {
  const saved = JSON.parse(localStorage.getItem("taxDraft") || "{}");
  if (!saved) return;
  Object.keys(saved).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.value = saved[key];
  });
}

// Clear draft
window.clearDraft = function() {
  localStorage.removeItem("taxDraft");
  alert("Draft cleared!");
};

// Show active step
window.showStep = function(step) {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`step${i}`);
    if (!el) continue;
    el.classList.toggle("active", i === step);
  }
};

// Next / Prev
window.nextStep = function() {
  if (window.currentStep < totalSteps) {
    window.currentStep++;
    window.showStep(window.currentStep);
    if (window.currentStep === 4) populateReview();
  }
  saveDraft();
};

window.prevStep = function() {
  if (window.currentStep > 1) {
    window.currentStep--;
    window.showStep(window.currentStep);
  }
  saveDraft();
};

// Populate Review
function populateReview() {
  const grossIncome = parseFloat(document.getElementById("grossIncome")?.value) || 0;
  const otherIncome = parseFloat(document.getElementById("otherIncome")?.value) || 0;
  const rentPaid = parseFloat(document.getElementById("rentPaid")?.value) || 0;
  const pensionNHF = parseFloat(document.getElementById("pensionNHF")?.value) || 0;
  const whtCredit = parseFloat(document.getElementById("whtCredit")?.value) || 0;

  window.__taxResult = {
    grossIncome,
    otherIncome,
    rentPaid,
    pensionNHF,
    whtCredit,
    totalIncome: grossIncome + otherIncome,
    totalReliefs: rentPaid + pensionNHF,
    netTaxable: Math.max(0, grossIncome + otherIncome - (rentPaid + pensionNHF) - whtCredit)
  };

  const reviewEl = document.getElementById("review");
  reviewEl.innerHTML = `
    <p><strong>Gross Income:</strong> ₦${grossIncome.toLocaleString()}</p>
    <p><strong>Other Income:</strong> ₦${otherIncome.toLocaleString()}</p>
    <p><strong>Rent Paid:</strong> ₦${rentPaid.toLocaleString()}</p>
    <p><strong>Pension + NHF:</strong> ₦${pensionNHF.toLocaleString()}</p>
    <p><strong>WHT Credit:</strong> ₦${whtCredit.toLocaleString()}</p>
    <p class="mt-2 font-bold"><strong>Net Taxable Income:</strong> ₦${window.__taxResult.netTaxable.toLocaleString()}</p>
  `;
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  loadDraft();
  window.showStep(window.currentStep);
});
