import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

export function generatePDF(taxData) {
    if (!taxData) {
        alert("No tax data to generate PDF.");
        return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Nigeria Tax Filing 2026", 105, 20, null, null, "center");

    let y = 35;
    for (const section of ["taxpayer", "income", "deductions", "calculation"]) {
        doc.setFontSize(12);
        doc.text(section.toUpperCase(), 14, y);
        y += 6;
        for (const [key, value] of Object.entries(taxData[section])) {
            doc.text(`${key}: ${value}`, 14, y);
            y += 6;
        }
        y += 4;
    }

    doc.save(`Nigeria_Tax_2026_${taxData.taxpayer.Name || "file"}.pdf`);
    alert("PDF Generated!");
}

window.generatePDF = generatePDF; // Attach to window
