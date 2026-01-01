import { calculateIndividualTax, calculateSMETax, calculateCorporateTax } from './taxRules.js';

let currentStep = 1;
let stakeholder = '';
let filingData = JSON.parse(localStorage.getItem('filingData') || '{}');

export function selectStakeholder(type){
    stakeholder = type;
    generateIncomeFields();
    generateDeductionFields();
    saveDraft();
    nextStep();
}

export function nextStep(){
    if(currentStep < 4){
        currentStep++;
        updateStepUI();
    }
}

export function prevStep(){
    if(currentStep > 1){
        currentStep--;
        updateStepUI();
    }
}

function updateStepUI(){
    for(let i=1;i<=4;i++){
        document.getElementById(`step${i}`).classList.remove('active');
        const stepIndicator = document.querySelector(`.step[data-step="${i}"]`);
        stepIndicator.classList.remove('step-active','step-completed');
        if(i<currentStep) stepIndicator.classList.add('step-completed');
        if(i===currentStep) stepIndicator.classList.add('step-active');
    }
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById('statusText').innerText = `Step ${currentStep} of 4`;
    saveDraft();
    if(currentStep===4) showReview();
}

export function resetFiling(){
    localStorage.removeItem('filingData');
    location.reload();
}

function saveDraft(){
    localStorage.setItem('filingData', JSON.stringify(filingData));
}

function generateIncomeFields(){
    const container = document.getElementById('incomeFields');
    container.innerHTML='';
    if(stakeholder==='individual'){
        container.innerHTML=`
        <input type="number" id="salary" placeholder="Gross Salary ₦" oninput="updateData('salary',this.value)">
        <input type="number" id="bonus" placeholder="Bonuses & Allowances ₦" oninput="updateData('bonus',this.value)">
        <input type="number" id="crypto" placeholder="Crypto Gains ₦" oninput="updateData('crypto',this.value)">
        `;
    } else if(stakeholder==='sme' || stakeholder==='corporate'){
        container.innerHTML=`
        <input type="number" id="profit" placeholder="Profit ₦" oninput="updateData('profit',this.value)">
        `;
    }
}

function generateDeductionFields(){
    const container = document.getElementById('deductionFields');
    container.innerHTML='';
    if(stakeholder==='individual'){
        container.innerHTML=`
        <input type="number" id="rent" placeholder="Rent Paid ₦" oninput="updateData('rent',this.value)">
        <input type="number" id="pension" placeholder="Pension ₦" oninput="updateData('pension',this.value)">
        <input type="number" id="nhf" placeholder="NHF ₦" oninput="updateData('nhf',this.value)">
        `;
    } else {
        container.innerHTML=`<p class="text-slate-400">No additional deductions for this stakeholder</p>`;
    }
}

function updateData(key,value){
    filingData[key]=parseFloat(value)||0;
    saveDraft();
    calculateDeductions();
}

function calculateDeductions(){
    if(stakeholder==='individual'){
        const total = (filingData.rent||0)+(filingData.pension||0)+(filingData.nhf||0);
        document.getElementById('totalDeductions').innerText = `₦${total.toLocaleString()}`;
    } else {
        document.getElementById('totalDeductions').innerText = `₦0`;
    }
}

function showReview(){
    const container = document.getElementById('reviewContent');
    container.innerHTML='';
    let html='';
    if(stakeholder==='individual'){
        const income = (filingData.salary||0)+(filingData.bonus||0)+(filingData.crypto||0);
        const deductions = (filingData.rent||0)+(filingData.pension||0)+(filingData.nhf||0);
        const result = calculateIndividualTax(income,deductions,true,filingData.crypto||0);
        html+=`<div class="summary-card">
        <h4 class="font-bold text-emerald-500">Total Income</h4>
        <p>₦${income.toLocaleString()}</p>
        </div>
        <div class="summary-card">
        <h4 class="font-bold text-emerald-500">Total Deductions</h4>
        <p>₦${deductions.toLocaleString()}</p>
        </div>
        <div class="summary-card">
        <h4 class="font-bold text-emerald-500">Taxable Income</h4>
        <p>₦${result.taxable.toLocaleString()}</p>
        </div>
        <div class="summary-card">
        <h4 class="font-bold text-emerald-500">Tax Due</h4>
        <p>₦${result.tax.toLocaleString()}</p>
        </div>`;
    } else if(stakeholder==='sme'){
        const profit = filingData.profit||0;
        const result = calculateSMETax(profit);
        html+=`<div class="summary-card">
        <h4 class="font-bold text-emerald-500">Profit</h4>
        <p>₦${profit.toLocaleString()}</p>
        </div>
        <div class="summary-card">
        <h4 class="font-bold text-emerald-500">Tax Due</h4>
        <p>₦${result.tax.toLocaleString()}</p>
        </div>`;
    } else {
        const profit = filingData.profit||0;
        const result = calculateCorporateTax(profit);
        html+=`<div class="summary-card">
        <h4 class="font-bold text-emerald-500">Profit</h4>
        <p>₦${profit.toLocaleString()}</p>
        </div>
        <div class="summary-card">
        <h4 class="font-bold text-emerald-500">Tax Due</h4>
        <p>₦${result.tax.toLocaleString()}</p>
        </div>`;
    }
    container.innerHTML=html;
    saveDraft();
}

export function downloadPDF(){
    import('./pdfGenerator.js').then(m=>m.generatePDF(filingData,stakeholder));
}
