export const TAX_RULES = {
    individual: {
        pitRate: 0.07, // Example 7%
        lowIncomeExemption: 800000,
        deductions: { rent: 500000, pension: 0.08, nhf: 0.025, insurance: Infinity, nhis: Infinity }
    },
    sme: {
        citRate: 0.30,
        deductions: { cogs: Infinity, opex: Infinity, assets: Infinity }
    },
    corporate: {
        citRate: 0.30,
        deductions: { cogs: Infinity, opex: Infinity, assets: Infinity }
    }
};
