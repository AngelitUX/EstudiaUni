const fs = require('fs');
const PDFParser = require('pdf2json');

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('raw-text-invierno.txt', pdfParser.getRawTextContent());
    console.log("Extracted text");
});

pdfParser.loadPDF("M1-INVIERNO-2024-SOLUCION.pdf");
