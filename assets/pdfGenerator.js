// assets/pdfGenerator.js
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

export function generatePDF(taxResult) {
    if (!taxResult) return alert("No tax data to generate PDF");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Nigeria Tax Filing 2026", 20, 20);
    
    let y = 40;
    for (const [key, value] of Object.entries(taxResult)) {
        doc.setFontSize(12);
        doc.text(`${key}: ${value}`, 20, y);
        y += 10;
    }

    doc.save(`TaxFiling_${taxResult.fullName || "unknown"}.pdf`);
}
