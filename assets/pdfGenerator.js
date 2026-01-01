import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

export function generatePDF(data) {
  if (!data) return alert("No tax data found!");

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Nigeria Tax Filing 2026", 20, 20);

  let y = 35;
  doc.setFontSize(12);
  const today = new Date().toLocaleString();
  doc.text(`Generated: ${today}`, 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.text("Income Details", 20, y); y += 8;
  doc.setFontSize(12);
  doc.text(`Gross Income: ₦${Number(data.grossIncome).toLocaleString()}`, 20, y); y += 7;
  doc.text(`Other Income: ₦${Number(data.otherIncome).toLocaleString()}`, 20, y); y += 10;

  doc.setFontSize(14);
  doc.text("Deductions", 20, y); y += 8;
  doc.setFontSize(12);
  doc.text(`Basic Exemption: ₦${data.deductions.basicExemption.toLocaleString()}`, 20, y); y += 7;
  doc.text(`Rent Relief: ₦${data.deductions.rentRelief.toLocaleString()}`, 20, y); y += 7;
  doc.text(`Pension + NHF: ₦${data.deductions.pensionNHF.toLocaleString()}`, 20, y); y += 7;
  doc.text(`Other Deductions: ₦${data.deductions.other.toLocaleString()}`, 20, y); y += 10;

  doc.setFontSize(14);
  doc.text("Credits & Taxes", 20, y); y += 8;
  doc.setFontSize(12);
  doc.text(`WHT Credit: ₦${data.whtCredit.toLocaleString()}`, 20, y); y += 7;
  doc.text(`Total Tax (before credits): ₦${data.taxAmount.toLocaleString()}`, 20, y); y += 7;
  doc.text(`Net Tax Payable: ₦${data.netTaxPayable.toLocaleString()}`, 20, y); y += 10;

  doc.setFontSize(10);
  doc.text("Note: Calculations are based on Nigeria 2026 tax regulations.", 20, y); y += 5;
  doc.text("For educational purposes only. Not legal/financial advice.", 20, y);

  doc.save("Nigeria-Tax-Filing-2026.pdf");
}
