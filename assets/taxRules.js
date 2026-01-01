// assets/taxRules.js
import { CRA, MAX_RENT_RELIEF, PIT_BANDS, SME_TAX_RATE, CORPORATE_TAX_RATE } from './constants.js';

// Calculate deductions for individuals
export function calculateDeductions({ rentPaid, pension, nhf, insurance, nhis, lowIncome }) {
    const rentRelief = Math.min(rentPaid * 0.2, MAX_RENT_RELIEF);

    if (lowIncome) return { rentRelief, pension: 0, nhf: 0, insurance: 0, nhis: 0, total: 0 };

    const total = rentRelief + pension + nhf + insurance + nhis;
    return { rentRelief, pension, nhf, insurance, nhis, total };
}

// Calculate Personal Income Tax
export function calculatePIT(income, deductions, lowIncome) {
    if (lowIncome || income <= CRA) return 0;

    let taxable = income - deductions.total - CRA;
    let remaining = taxable;
    let tax = 0;
    let lowerLimit = 0;

    for (const [upperLimit, rate] of PIT_BANDS) {
        const taxableAtBand = Math.min(remaining, upperLimit - lowerLimit);
        tax += taxableAtBand * rate;
        remaining -= taxableAtBand;
        lowerLimit = upperLimit;
        if (remaining <= 0) break;
    }
    return Math.round(tax);
}

// SME / Corporate Tax
export function calculateCorporateTax(profit, stakeholderType) {
    if (stakeholderType === 'sme' || stakeholderType === 'corporate') {
        return Math.round(profit * SME_TAX_RATE);
    }
    return 0;
}
