const fs = require('fs');
const PDFParser = require('pdf2json');
const path = require('path');

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('src/pruebasDemre/L-2025-TEXTO.txt', pdfParser.getRawTextContent());
    console.log("Extracted text to src/pruebasDemre/L-2025-TEXTO.txt");
});

const pdfPath = path.resolve(__dirname, 'L-2025.pdf');
pdfParser.loadPDF(pdfPath);
