const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', pdfData => {
    const text = pdfParser.getRawTextContent();
    fs.writeFileSync('src/pruebasDemre/M2-2024-SOLUCION.txt', text);
    console.log('Saved to M2-2024-SOLUCION.txt');
});

pdfParser.loadPDF('src/pruebasDemre/M2-2024-SOLUCION.pdf');
