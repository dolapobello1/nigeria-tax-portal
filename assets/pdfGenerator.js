import jsPDF from 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

export function generatePDF(data, stakeholder){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Nigeria Tax Filing 2026', 105, 20, {align:'center'});
    doc.setFontSize(12);
    doc.text(`Stakeholder Type: ${stakeholder}`, 20, 40);

    let y = 50;
    for(const key in data){
        doc.text(`${key}: ₦${(data[key]||0).toLocaleString()}`, 20, y);
        y+=10;
    }

    doc.text('Educational use only. Not legal advice.', 20, y+10);
    doc.save('taxFiling2026.pdf');
}
