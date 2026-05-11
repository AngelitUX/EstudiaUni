const fs = require('fs');

const rawText = fs.readFileSync('raw-text-invierno.txt', 'utf-8');

const regex = /(\d+)\*?([A-D])/g;
let match;
const answers = [];

while ((match = regex.exec(rawText)) !== null) {
    const qNum = parseInt(match[1]);
    const ans = match[2];
    answers[qNum - 1] = ans; // qNum is 1-indexed
}

// Generate the JSON structure
const questions = [];
for (let i = 0; i < 65; i++) {
    questions.push({
        id: `m1-invierno-2024-q${i + 1}`,
        ensayoId: 'm1-invierno',
        order: i + 1,
        subject: 'Matemática',
        text: `Pregunta ${i + 1} (Ver imagen)`,
        imageUrl: `assets/images/M1-INVIERNO-2024-IMAGENES/${i + 1}.png`,
        options: {
            "A": "",
            "B": "",
            "C": "",
            "D": ""
        },
        correctAnswer: answers[i] || 'A',
        explanation: `Solución de la pregunta ${i + 1}.`,
        stem: `Pregunta ${i + 1} (Ver imagen)`
    });
}

fs.writeFileSync('m1-invierno-preguntas-db.json', JSON.stringify(questions, null, 2));
console.log('JSON generado en m1-invierno-preguntas-db.json con ' + questions.length + ' preguntas.');
