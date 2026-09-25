import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTableToPDF = (title, columns, data, filename) => {
    const doc = new jsPDF();
    
    // Header/Brand
    doc.setFillColor(29, 29, 31); // Apple Dark Gray
    doc.rect(0, 0, 210, 25, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("COLLAB CRM", 14, 17);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(29, 29, 31);
    doc.text(title, 14, 40);
    
    // Add timestamp & Meta
    doc.setFontSize(9);
    doc.setTextColor(134, 134, 139); // Subtle gray
    doc.setFont("helvetica", "normal");
    const date = new Date().toLocaleString();
    doc.text(`Generated on: ${date}`, 14, 46);
    doc.text(`Classification: Internal Use Only`, 14, 51);
    
    // The default PDF font doesn't support the '₹' symbol, so we convert it to 'Rs. '
    const safeData = data.map(row => 
        row.map(cell => typeof cell === 'string' ? cell.replace(/₹/g, 'Rs. ') : cell)
    );

    // Add the table
    autoTable(doc, {
        startY: 58,
        head: [columns],
        body: safeData,
        theme: 'plain',
        headStyles: { 
            fillColor: [245, 245, 247], // Light gray background
            textColor: [134, 134, 139], // Gray text
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 6,
            lineColor: [229, 229, 234],
            lineWidth: { bottom: 0.5 }
        },
        bodyStyles: { 
            textColor: [29, 29, 31],
            fontSize: 10,
            cellPadding: 6,
            lineColor: [242, 242, 247],
            lineWidth: { bottom: 0.1 }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 252]
        },
        margin: { left: 14, right: 14 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(134, 134, 139);
        doc.text(
            `Collab CRM Platform | Confidential | Page ${i} of ${pageCount}`, 
            doc.internal.pageSize.width / 2, 
            doc.internal.pageSize.height - 10, 
            { align: 'center' }
        );
    }
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
};
