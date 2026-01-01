// assets/filingFlow.js
import { calculateDeductions, calculatePIT, calculateCorporateTax } from './taxRules.js';
import { generatePDF } from './pdfGenerator.js';

let currentStep = 1;

function showStep(step) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    updateProgress(step);
    currentStep = step;
}

function updateProgress(step) {
    const width = ((step - 1) / 4) * 100;
    document.getElementById('progressBar').style.width = width + '%';
}

// Navigation
window.nextStep = function(fromStep) {
    saveDraft();
    showStep(fromStep + 1);
    updateReview();
}

window.prevStep = function(fromStep) {
    showStep(fromStep - 1);
}

// Auto-save
window.saveDraft = function() {
    const data = {};
    document.querySelectorAll('input, select').forEach(i => {
        data[i.id] = i.type === 'checkbox' ? i.checked : i.value;
    });
    localStorage.setItem('taxDraft', JSON.stringify(data));
}

// Load draft
window.loadDraft = function() {
    const draft = JSON.parse(localStorage.getItem('taxDraft') || '{}');
    Object.keys(draft).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = draft[id];
        else el.value = draft[id];
    });
    calculatePreview();
}

// Reset
window.resetFiling = function() {
    localStorage.removeItem('taxDraft');
    location.reload();
}

// Toggle stakeholder type
window.updateStakeholderType = function() {
    const type = document.getElementById('stakeholderType').value;
    document.querySelectorAll('.stakeholder-field').forEach(f => f.style.display='none');
    document.querySelectorAll(`.field-${type}`).forEach(f => f.style.display='block');
    calculatePreview();
}

// Main calculation
window.calculatePreview = function() {
    const stakeholder = document.getElementById('stakeholderType').value;

    // Individual income
    const grossSalary = Number(document.getElementById('grossSalary')?.value || 0);
    const bonuses = Number(document.getElementById('bonuses')?.value || 0);
    const otherIncome = Number(document.getElementById('otherIncome')?.value || 0);
    const income = grossSalary + bonuses + otherIncome;

    // Deductions
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

    // Store results
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
    document.getElementById('review-rate').innerText = `${Math.round((pit + corporateTax) / ((income - deductions.total)||1)*100)}%`;
}

// Auto-load draft
window.addEventListener('DOMContentLoaded', () => loadDraft());
