const fs = require('fs');
const PDFParser = require('pdf2json');
const path = require('path');

const exams = [
    'L-2026',
    'L-2026-SOLUCION',
    'L-INVIERNO-2024',
    'L-INVIERNO-2024-SOLUCION',
    'L-INVIERNO-2025',
    'L-INVIERNO-2025-SOLUCION',
    'L-INVIERNO-2026',
    'L-INVIERNO-2026-SOLUCION'
];

async function extractText(examName) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        const pdfPath = path.resolve(__dirname, `${examName}.pdf`);
        const outputPath = path.resolve(__dirname, `${examName}-TEXTO.txt`);

        pdfParser.on("pdfParser_dataError", errData => {
            console.error(`Error in ${examName}:`, errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", pdfData => {
            fs.writeFileSync(outputPath, pdfParser.getRawTextContent());
            console.log(`Extracted text to ${outputPath}`);
            resolve();
        });

        if (fs.existsSync(pdfPath)) {
            pdfParser.loadPDF(pdfPath);
        } else {
            console.warn(`File not found: ${pdfPath}`);
            resolve();
        }
    });
}

async function run() {
    for (const exam of exams) {
        await extractText(exam);
    }
}

run();
