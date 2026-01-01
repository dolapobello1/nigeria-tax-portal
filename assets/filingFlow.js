// assets/filingFlow.js
import { calculateDeductions, calculatePIT, calculateCorporateTax } from './taxRules.js';
import { generatePDF } from './pdfGenerator.js';

let currentStep = 0;

function showStep(step) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    const stepEl = document.getElementById(`step${step}`);
    if(stepEl) stepEl.classList.add('active');
    currentStep = step;
}

function updateStakeholderFields() {
    const type = document.getElementById('stakeholderType').value;
    document.querySelectorAll('.stakeholder-field').forEach(f => f.style.display = 'none');
    document.querySelectorAll(`.field-${type}`).forEach(f => f.style.display = 'block');
}

window.nextStep = function() {
    saveDraft();
    showStep(currentStep + 1);
    calculatePreview();
}

window.prevStep = function() {
    showStep(currentStep - 1);
}

// Auto-save to localStorage
window.saveDraft = function() {
    const data = {};
    document.querySelectorAll('input, select').forEach(i => {
        if(i.type === 'checkbox') data[i.id] = i.checked;
        else data[i.id] = i.value;
    });
    localStorage.setItem('taxDraft', JSON.stringify(data));
}

// Load draft
window.loadDraft = function() {
    const draft = JSON.parse(localStorage.getItem('taxDraft') || '{}');
    Object.keys(draft).forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        if(el.type === 'checkbox') el.checked = draft[id];
        else el.value = draft[id];
    });
    updateStakeholderFields();
    calculatePreview();
}

// Reset
window.resetFiling = function() {
    localStorage.removeItem('taxDraft');
    location.reload();
}

// Stakeholder change
window.updateStakeholderType = function() {
    updateStakeholderFields();
    calculatePreview();
}

// Main calculation
window.calculatePreview = function() {
    const stakeholder = document.getElementById('stakeholderType').value;

    const grossSalary = Number(document.getElementById('grossSalary')?.value || 0);
    const bonuses = Number(document.getElementById('bonuses')?.value || 0);
    const otherIncome = Number(document.getElementById('otherIncome')?.value || 0);
    const income = grossSalary + bonuses + otherIncome;

    const deductions = calculateDeductions({
        rentPaid: Number(document.getElementById('rentPaid')?.value || 0),
        pension: Number(document.getElementById('pension')?.value || 0),
        nhf: Number(document.getElementById('nhf')?.value || 0),
        insurance: Number(document.getElementById('insurance')?.value || 0),
        nhis: Number(document.getElementById('nhis')?.value || 0),
        lowIncome: document.getElementById('lowIncome')?.checked
    });

    const pit = stakeholder === 'individual' ? calculatePIT(income, deductions, document.getElementById('lowIncome')?.checked) : 0;
    const profit = Number(document.getElementById('profit')?.value || 0);
    const corporateTax = calculateCorporateTax(profit, stakeholder);

    window.__taxResult = {
        stakeholder,
        fullName: document.getElementById('fullName')?.value || document.getElementById('companyName')?.value || "",
        totalIncome: income,
        totalDeductions: deductions.total,
        PIT: pit,
        CorporateTax: corporateTax,
        taxableIncome: income - deductions.total
    };

    // Update UI
    document.getElementById('totalIncome').innerText = `₦${income.toLocaleString()}`;
    document.getElementById('totalDeductions').innerText = `₦${deductions.total.toLocaleString()}`;
    document.getElementById('review-taxable').innerText = `₦${(income - deductions.total).toLocaleString()}`;
    document.getElementById('review-total').innerText = `₦${(pit + corporateTax).toLocaleString()}`;
    document.getElementById('review-rate').innerText = `${Math.round((pit + corporateTax)/((income - deductions.total)||1)*100)}%`;
}

window.addEventListener('DOMContentLoaded', loadDraft);
