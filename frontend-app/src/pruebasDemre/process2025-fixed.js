const fs = require('fs');

const rawText = fs.readFileSync('raw-text-2025.txt', 'utf8');

// Buscamos todas las combinaciones Número+Letra (o Número+*+Letra)
// ej: "1C", "23B", "45C", "17*B"
const regex = /(\d{1,2})\*?([A-E])/g;
let match;
const answers = {};

while ((match = regex.exec(rawText)) !== null) {
    const qNum = parseInt(match[1]);
    const ans = match[2];
    if (qNum >= 1 && qNum <= 65) {
        answers[qNum] = ans;
    }
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
