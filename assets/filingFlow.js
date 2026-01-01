// Get steps and current step index
const steps = document.querySelectorAll(".form-section");
let currentStep = 0;

// Load draft from localStorage
const draft = JSON.parse(localStorage.getItem("taxDraft") || "{}");
if (draft) populateDraft(draft);

// Step navigation
window.nextStep = (fromStep) => {
    saveDraft();
    if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
        updateStepIndicator();
        calculatePreview();
    }
};

window.prevStep = (fromStep) => {
    if (currentStep > 0) {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
        updateStepIndicator();
    }
};

// Step indicator
function updateStepIndicator() {
    document.querySelectorAll(".step").forEach((el, i) => {
        el.classList.remove("step-active", "step-completed");
        if (i < currentStep) el.classList.add("step-completed");
        else if (i === currentStep) el.classList.add("step-active");
    });
}

// Populate draft if exists
function populateDraft(data) {
    Object.keys(data).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = data[id];
    });
    calculatePreview();
}

// Save draft
function saveDraft() {
    const inputs = document.querySelectorAll("input, select");
    const data = {};
    inputs.forEach(i => data[i.id] = i.value);
    localStorage.setItem("taxDraft", JSON.stringify(data));
}

// Clear draft
window.clearDraft = () => {
    localStorage.removeItem("taxDraft");
    location.reload();
}

// Calculation
window.calculatePreview = () => {
    const grossIncome = parseFloat(document.getElementById("grossIncome").value) || 0;
    const otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
    const rentPaid = parseFloat(document.getElementById("rentPaid").value) || 0;
    const pensionNHF = parseFloat(document.getElementById("pensionNHF").value) || 0;
    const otherDeductions = parseFloat(document.getElementById("otherDeductions")?.value || 0);

    // Totals
    const totalIncome = grossIncome + otherIncome;
    const totalDeductions = rentPaid + pensionNHF + otherDeductions;

    // Taxable income
    const taxableIncome = Math.max(totalIncome - totalDeductions, 0);

    // Simple PIT Example: 7% flat for demo
    const pit = taxableIncome * 0.07;

    // Save result for PDF
    window.__taxResult = {
        grossIncome, otherIncome, rentPaid, pensionNHF, otherDeductions,
        totalIncome, totalDeductions, taxableIncome, pit
    };

    // Update UI
    document.getElementById("totalIncome").textContent = `₦${totalIncome.toLocaleString()}`;
    document.getElementById("totalDeductions").textContent = `₦${totalDeductions.toLocaleString()}`;

    // Populate review
    const reviewEl = document.getElementById("review");
    if (reviewEl) {
        reviewEl.innerHTML = `
            <div><strong>Gross Income:</strong> ₦${totalIncome.toLocaleString()}</div>
            <div><strong>Total Deductions:</strong> ₦${totalDeductions.toLocaleString()}</div>
            <div><strong>Taxable Income:</strong> ₦${taxableIncome.toLocaleString()}</div>
            <div><strong>PIT (7%):</strong> ₦${pit.toLocaleString()}</div>
        `;
    }
}

// Update taxpayer type (show/hide company vs individual fields)
window.updateTaxpayerType = () => {
    const type = document.getElementById("taxpayerType").value;
    if (type === "company") {
        document.getElementById("fullName").placeholder = "Enter company name";
    } else {
        document.getElementById("fullName").placeholder = "Enter full name";
    }
}

// Optional: help popup
window.showHelp = () => alert("Fill out the forms step by step. Click NEXT to proceed.");

// Initial calculation
calculatePreview();
