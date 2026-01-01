export const TAX_RULES = {
  individual: {
    pitBands: [
      { upTo: 300000, rate: 0.07 },
      { upTo: 600000, rate: 0.11 },
      { upTo: 1100000, rate: 0.15 },
      { upTo: 1600000, rate: 0.19 },
      { upTo: 3200000, rate: 0.21 },
      { upTo: Infinity, rate: 0.24 },
    ],
    reliefs: {
      rent: { percent: 0.2, max: 500000 },
      pension: 0.08,
      nhf: 0.025,
      nhis: 0.05,
      insurance: 200000,
      lowIncomeExemption: 800000
    }
  },
  sme: {
    flatRate: 0.20 // 20% of assessable profit
  },
  mne: {
    corporateRate: 0.30
  }
};
