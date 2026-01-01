import { TAX_RULES } from './taxRules.js';
import { generatePDF } from './pdfGenerator.js';

let currentStep = 0;
let stakeholder = '';
const totalSteps = 4;
let formData = JSON.parse(localStorage.getItem('taxDraft') || '{}');

export function setStakeholder(type){
    stakeholder = type;
    formData.stakeholder = type;
    currentStep = 1;
    renderStep();
}

export function nextStep(){ currentStep=Math.min(currentStep+1,totalSteps); renderStep(); }
export function prevStep(){ currentStep=Math.max(currentStep-1,0); renderStep(); }

function showStep(step){
    document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
}

export function renderStep(){
    showStep(currentStep);
    renderIncomeInputs();
    renderDeductionInputs();
    updateTotals();
    renderReview();
    localStorage.setItem('taxDraft', JSON.stringify(formData));
}

function renderIncomeInputs(){
    const container=document.getElementById('incomeInputs');
    container.innerHTML='';
    if(stakeholder==='individual'){
        container.innerHTML=`
            <input type="number" id="grossSalary" placeholder="Gross Salary" value="${formData.grossSalary||0}" oninput="updateField('grossSalary',this.value)">
            <input type="number" id="bonuses" placeholder="Bonuses / Allowances" value="${formData.bonuses||0}" oninput="updateField('bonuses',this.value)">
            <input type="number" id="otherIncome" placeholder="Other Income" value="${formData.otherIncome||0}" oninput="updateField('otherIncome',this.value)">
        `;
    } else {
        container.innerHTML=`
            <input type="number" id="turnover" placeholder="Annual Turnover" value="${formData.turnover||0}" oninput="updateField('turnover',this.value)">
            <input type="number" id="cogs" placeholder="Cost of Goods Sold" value="${formData.cogs||0}" oninput="updateField('cogs',this.value)">
            <input type="number" id="opex" placeholder="Operating Expenses" value="${formData.opex||0}" oninput="updateField('opex',this.value)">
            <input type="number" id="assets" placeholder="Total Fixed Assets" value="${formData.assets||0}" oninput="updateField('assets',this.value)">
        `;
    }
}

function renderDeductionInputs(){
    const container=document.getElementById('deductionInputs');
    container.innerHTML='';
    if(stakeholder==='individual'){
        container.innerHTML=`
            <input type="number" id="rentPaid" placeholder="Rent Paid" value="${formData.rentPaid||0}" oninput="updateField('rentPaid',this.value)">
            <input type="number" id="pension" placeholder="Pension" value="${formData.pension||0}" oninput="updateField('pension',this.value)">
            <input type="number" id="nhf" placeholder="NHF" value="${formData.nhf||0}" oninput="updateField('nhf',this.value)">
            <input type="number" id="insurance" placeholder="Life Insurance" value="${formData.insurance||0}" oninput="updateField('insurance',this.value)">
            <input type="number" id="nhis" placeholder="NHIS" value="${formData.nhis||0}" oninput="updateField('nhis',this.value)">
        `;
    } else {
        container.innerHTML=`
            <input type="number" id="cogsDeduct" placeholder="COGS" value="${formData.cogsDeduct||0}" oninput="updateField('cogsDeduct',this.value)">
            <input type="number" id="opexDeduct" placeholder="Opex" value="${formData.opexDeduct||0}" oninput="updateField('opexDeduct',this.value)">
        `;
    }
}

window.updateField=function(field,value){
    formData[field]=parseFloat(value)||0;
    updateTotals();
    localStorage.setItem('taxDraft',JSON.stringify(formData));
}

function updateTotals(){
    let totalIncome=0, totalDeductions=0;
    if(stakeholder==='individual'){
        totalIncome=(formData.grossSalary||0)+(formData.bonuses||0)+(formData.otherIncome||0);
        totalDeductions=(formData.rentPaid||0)+(formData.pension||0)+(formData.nhf||0)+(formData.insurance||0)+(formData.nhis||0);
        if(totalIncome<=TAX_RULES.individual.lowIncomeExemption) totalDeductions=totalIncome;
        formData.taxable=totalIncome-totalDeductions;
        formData.taxDue=(formData.taxable||0)*TAX_RULES.individual.pitRate;
    } else {
        totalIncome=(formData.turnover||0);
        totalDeductions=(formData.cogs||0)+(formData.opex||0);
        formData.taxable=totalIncome-totalDeductions;
        formData.taxDue=(formData.taxable||0)*TAX_RULES[stakeholder].citRate;
    }
    document.getElementById('totalIncome').innerText=totalIncome.toLocaleString();
    document.getElementById('totalDeductions').innerText=totalDeductions.toLocaleString();
}

function renderReview(){
    const review=document.getElementById('reviewSection');
    review.innerHTML=`
        <p><strong>Stakeholder:</strong> ${stakeholder}</p>
        <p><strong>Total Income:</strong> ₦${(formData.totalIncome||0).toLocaleString()}</p>
        <p><strong>Total Deductions:</strong> ₦${(formData.totalDeductions||0).toLocaleString()}</p>
        <p><strong>Taxable Income:</strong> ₦${(formData.taxable||0).toLocaleString()}</p>
        <p><strong>Tax Due:</strong> ₦${(formData.taxDue||0).toLocaleString()}</p>
    `;
}

window.clearDraft=function(){
    localStorage.removeItem('taxDraft');
    formData={};
    currentStep=0;
    renderStep();
}

renderStep();
