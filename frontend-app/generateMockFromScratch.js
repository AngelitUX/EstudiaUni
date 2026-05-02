const fs = require('fs');

const answersText = `
1B23C45A
2C24C46C
3B25B47*B
4B26D48C
5C27*D49C
6B28A50D
7D29A51C
8B30B52A
9C31A53C
10B32C54D
11A33B55C
12B34*A56B
13C35D57C
14A36*D58B
15B37C59B
16A38*B60B
17C39C61D
18A40B62D
19D41C63C
20C42B64D
21B43C65B
22C44B
`;

// Extract answers into an object
const answersMap = {};
const regex = /(\d+)\*?([A-E])/g;
let match;
while ((match = regex.exec(answersText)) !== null) {
    const qNum = parseInt(match[1]);
    const ans = match[2];
    answersMap[qNum] = ans;
}

const mockData = [];
for (let i = 1; i <= 65; i++) {
    mockData.push({
        id: `m1-2024-q${i}`,
        ensayoId: 'm1',
        order: i,
        subject: 'Matemática',
        text: `Pregunta ${i} (Ver imagen)`,
        imageUrl: null,
        options: {
            "A": "A",
            "B": "B",
            "C": "C",
            "D": "D"
        },
        correctAnswer: answersMap[i] || 'A',
        explanation: `Solución de la pregunta ${i}.`,
        stem: `Pregunta ${i}`
    });
}

const outputData = JSON.stringify(mockData, null, 2);
fs.writeFileSync('src/assets/m1-preguntas-db.json', outputData);
fs.writeFileSync('src/pruebasDemre/m1-preguntas-db.json', outputData);
console.log('Successfully generated JSON with correct answers.');
