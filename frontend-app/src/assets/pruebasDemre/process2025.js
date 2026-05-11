const fs = require('fs');
const PDFParser = require('pdf2json');

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const rawText = pdfParser.getRawTextContent();
    console.log("Extracted text from M1-2025-SOLUCION.pdf");

    // Match lines like "1 B" or "65 A"
    const regex = /^(\d{1,2})\s+([A-E])$/gm;
    let match;
    const answers = {};
    while ((match = regex.exec(rawText)) !== null) {
        answers[parseInt(match[1])] = match[2];
    }
    
    console.log(`Encontradas ${Object.keys(answers).length} respuestas.`);
    
    // Now fix the JSON
    const jsonFiles = ['m1-2025-preguntas-db.json', '../assets/m1-2025-preguntas-db.json'];
    jsonFiles.forEach(file => {
        if (fs.existsSync(file)) {
            let json = JSON.parse(fs.readFileSync(file, 'utf8'));
            json.forEach(q => {
                // Force correct image URL
                q.imageUrl = 'assets/images/M1-2025-IMAGENES/' + q.order + '.png';
                
                // Inject correct answer if found
                if (answers[q.order]) {
                    q.correctAnswer = answers[q.order];
                }
            });
            fs.writeFileSync(file, JSON.stringify(json, null, 2));
            console.log('Fixed and populated', file);
        }
    });
});

pdfParser.loadPDF("M1-2025-SOLUCION.pdf");
