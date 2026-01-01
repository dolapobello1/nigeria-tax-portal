import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

export function generatePDF(data) {
  if (!data) return alert("No tax data found!");

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Nigeria Tax Filing 2026", 20, 20);

  doc.setFontSize(12);
  let y = 40;
  const today = new Date().toLocaleString();
  doc.text(`Generated: ${today}`, 20, y);
  y += 10;

  Object.entries(data).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
    doc.text(`${label}: ₦${Number(value).toLocaleString()}`, 20, y);
    y += 10;
  });

  doc.text(`GitHub Version: v1.0`, 20, y + 10);
  doc.save("Nigeria-Tax-Filing-2026.pdf");
}
