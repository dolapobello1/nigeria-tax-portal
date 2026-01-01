// Track current step
window.currentStep = 1;
const totalSteps = 4;

// Show only active step
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
};

window.prevStep = function() {
  if (window.currentStep > 1) {
    window.currentStep--;
    window.showStep(window.currentStep);
  }
};

// Collect inputs and populate review
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
  window.showStep(window.currentStep);
});
