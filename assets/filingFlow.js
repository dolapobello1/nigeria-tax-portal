import { TAX_RULES } from "./taxConstants.js";

// --- Step Navigation ---
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
    document.querySelectorAll(".form-section").forEach((s, i) => {
        s.classList.toggle("active", i + 1 === step);
    });
    document.querySelectorAll(".step").forEach((indicator, i) => {
        indicator.classList.toggle("step-active", i + 1 === step);
        indicator.classList.toggle("step-completed", i + 1 < step);
    });
    document.getElementById("progressBar").style.width = ((step-1)/(totalSteps-1))*100 + "%";
    currentStep = step;
    saveDraft();
}
window.showStep = showStep;

function nextStep(fromStep=currentStep) {
    if (currentStep < totalSteps) showStep(currentStep + 1);
}
function prevStep(fromStep=currentStep) {
    if (currentStep > 1) showStep(currentStep - 1);
}

window.nextStep = nextStep;
window.prevStep = prevStep;

// --- Stakeholder Toggle ---
function setStakeholder(type) {
    window.__stakeholder = type;
    document.getElementById("individualIncome").style.display = type === "individual" ? "block" : "none";
    document.getElementById("companyIncome").style.display = type === "sme" || type === "mne" ? "block" : "none";
    calculatePreview();
}
window.setStakeholder = setStakeholder;

// --- Calculate Tax ---
function calculatePreview() {
    const stakeholder = window.__stakeholder || "individual";
    let incomeTotal = 0;
    let deductionsTotal = 0;
    let taxableIncome = 0;
    let pit = 0;
    let otherCharges = 0;

    if (stakeholder === "individual") {
        const gross = parseFloat(document.getElementById("grossSalary").value) || 0;
        const bonuses = parseFloat(document.getElementById("bonuses").value) || 0;
        const business = parseFloat(document.getElementById("businessIncome").value) || 0;
        const invest = parseFloat(document.getElementById("investmentIncome").value) || 0;
        const capital = parseFloat(document.getElementById("capitalGains").value) || 0;
        const other = parseFloat(document.getElementById("otherIncome").value) || 0;
        incomeTotal = gross + bonuses + business + invest + capital + other;

        const rent = Math.min((parseFloat(document.getElementById("rentPaid").value) || 0)*TAX_RULES.individual.reliefs.rent.percent, TAX_RULES.individual.reliefs.rent.max);
        const pension = parseFloat(document.getElementById("pension").value) || 0;
        const nhf = parseFloat(document.getElementById("nhf").value) || 0;
        const nhis = parseFloat(document.getElementById("nhis").value) || 0;
        const insurance = parseFloat(document.getElementById("insurance").value) || 0;

        deductionsTotal = rent + pension + nhf + nhis + insurance;
        if (document.getElementById("lowIncome")?.checked && incomeTotal <= TAX_RULES.individual.reliefs.lowIncomeExemption) {
            deductionsTotal = incomeTotal; // full exemption
        }

        taxableIncome = Math.max(0, incomeTotal - deductionsTotal);

        // PIT calculation based on bands
        let remaining = taxableIncome;
        pit = 0;
        for (const band of TAX_RULES.individual.pitBands) {
            let amount = Math.min(remaining, band.upTo);
            pit += amount * band.rate;
            remaining -= amount;
            if (remaining <= 0) break;
        }

        otherCharges = 0; // Can add levies or other charges
    }
    else if (stakeholder === "sme") {
        const profit = parseFloat(document.getElementById("profit").value) || 0;
        incomeTotal = profit;
        deductionsTotal = 0;
        taxableIncome = profit;
        pit = profit * TAX_RULES.sme.flatRate;
        otherCharges = 0;
    }
    else if (stakeholder === "mne") {
        const profit = parseFloat(document.getElementById("profit").value) || 0;
        incomeTotal = profit;
        deductionsTotal = 0;
        taxableIncome = profit;
        pit = profit * TAX_RULES.mne.corporateRate;
        otherCharges = 0;
    }

    window.__taxResult = {
        taxpayer: {
            Name: document.getElementById("fullName")?.value || document.getElementById("companyName")?.value,
            TIN: document.getElementById("tin")?.value,
            Year: document.getElementById("taxYear")?.value,
            State: document.getElementById("filingState")?.value
        },
        income: { TotalIncome: incomeTotal },
        deductions: { TotalDeductions: deductionsTotal },
        calculation: { PIT: pit, OtherCharges: otherCharges, TotalTax: pit+otherCharges }
    };

    document.getElementById("totalIncome")?.innerText = `₦${incomeTotal.toLocaleString()}`;
    document.getElementById("totalDeductions")?.innerText = `₦${deductionsTotal.toLocaleString()}`;
    document.getElementById("review-gross")?.innerText = `₦${incomeTotal.toLocaleString()}`;
    document.getElementById("review-deductions")?.innerText = `₦${deductionsTotal.toLocaleString()}`;
    document.getElementById("review-taxable")?.innerText = `₦${taxableIncome.toLocaleString()}`;
    document.getElementById("review-pit")?.innerText = `₦${pit.toLocaleString()}`;
    document.getElementById("review-other")?.innerText = `₦${otherCharges.toLocaleString()}`;
    document.getElementById("review-total")?.innerText = `₦${(pit+otherCharges).toLocaleString()}`;
    document.getElementById("review-rate")?.innerText = ((pit+otherCharges)/Math.max(1,incomeTotal)*100).toFixed(2) + "%";

    saveDraft();
}
window.calculatePreview = calculatePreview;

// --- Auto-save ---
function saveDraft() {
    const inputs = document.querySelectorAll("input, select");
    const draft = {};
    inputs.forEach(input => draft[input.id] = input.type==="checkbox"?input.checked:input.value);
    localStorage.setItem("taxDraft", JSON.stringify(draft));
}
window.saveDraft = saveDraft;

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem("taxDraft") || "{}");
    for (const [id, value] of Object.entries(draft)) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.type === "checkbox") el.checked = value;
        else el.value = value;
    }
    calculatePreview();
}
window.loadDraft = loadDraft;

// --- Clear Draft ---
function clearDraft() {
    localStorage.removeItem("taxDraft");
    location.reload();
}
window.clearDraft = clearDraft;

// --- Document Upload Simulation ---
function simulateUpload(type) {
    const container = document.getElementById("uploadedDocs");
    const div = document.createElement("div");
    div.className = "document-item";
    div.innerHTML = `<span>${type} document uploaded</span><button onclick="this.parentElement.remove()">Remove</button>`;
    container.appendChild(div);
}
window.simulateUpload = simulateUpload;

// --- Initialize ---
window.addEventListener("DOMContentLoaded", () => {
    loadDraft();
    setStakeholder("individual");
});
