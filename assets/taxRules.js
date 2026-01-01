import { CRA, MAX_RENT_RELIEF, PIT_BANDS } from "./constants.js";

export function computeIndividualTax(data) {
  const {
    grossIncome = 0,
    otherIncome = 0,
    rentPaid = 0,
    pensionNHF = 0,
    whtCredit = 0
  } = data;

  const totalIncome = grossIncome + otherIncome;
  const rentRelief = Math.min(rentPaid * 0.2, MAX_RENT_RELIEF);

  const taxableIncome = Math.max(
    0,
    totalIncome - CRA - rentRelief - pensionNHF
  );

  let tax = 0;
  let remaining = taxableIncome;

  for (const [limit, rate] of PIT_BANDS) {
    if (remaining <= 0) break;
    const portion = Math.min(remaining, limit);
    tax += portion * rate;
    remaining -= portion;
  }

  return {
    totalIncome,
    taxableIncome,
    grossTax: tax,
    whtCredit,
    netTaxPayable: Math.max(0, tax - whtCredit),
    effectiveRate: totalIncome ? tax / totalIncome : 0
  };
}
