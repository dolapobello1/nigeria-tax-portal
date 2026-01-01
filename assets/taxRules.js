import { CRA, MAX_RENT_RELIEF, PIT_BANDS, SME_RATE, CORPORATE_RATE } from './constants.js';

export function calculateIndividualTax(income, deductions, hasCrypto=false, cryptoGains=0) {
    const taxable = Math.max(0, income + (hasCrypto ? cryptoGains : 0) - deductions);
    let tax = 0;
    for (let [limit, rate] of PIT_BANDS) {
        if(taxable <= limit) {
            tax = taxable * rate;
            break;
        }
    }
    return { taxable, tax };
}

export function calculateSMETax(profit) {
    return { taxable: profit, tax: profit * SME_RATE };
}

export function calculateCorporateTax(profit) {
    return { taxable: profit, tax: profit * CORPORATE_RATE };
}
