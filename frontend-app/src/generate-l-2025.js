const fs = require('fs');
const path = require('path');

const exam = {
  id: 'l-2025',
  name: 'L-2025-IMAGENES',
  subject: 'Lenguaje',
  mappings: [
    { questions: [1, 8], texts: ['t1-1.png', 't1-2.png', 't1-3.png'] },
    { questions: [9, 16], texts: ['t2-1.png', 't2-2.png', 't2-3.png'] },
    { questions: [25, 31], texts: ['t3-1.png', 't3-2.png', 't3-3.png'] },
    { questions: [41, 49], texts: ['t4-1.png', 't4-2.png', 't4-3.png'] },
    { questions: [50, 57], texts: ['t5-1.png', 't5-2.png', 't5-3.png', 't5-4.png', 't5-5.png'] },
    { questions: [58, 65], texts: ['t6-1.png', 't6-2.png', 't6-3.png'] }
  ],
  answers: {
    "1":"B", "2":"A", "3":"D", "4":"B", "5":"A", "6":"D", "7":"C", "8":"D", "9":"D", "10":"C",
    "11":"B", "12":"B", "13":"C", "14":"B", "15":"D", "16":"A", "17":"D", "18":"A", "19":"B", "20":"B",
    "21":"C", "22":"A", "23":"B", "24":"D", "25":"B", "26":"C", "27":"A", "28":"B", "29":"D", "30":"C",
    "31":"B", "32":"C", "33":"D", "34":"A", "35":"B", "36":"C", "37":"B", "38":"C", "39":"A", "40":"C",
    "41":"C", "42":"C", "43":"A", "44":"B", "45":"B", "46":"D", "47":"A", "48":"C", "49":"A", "50":"B",
    "51":"D", "52":"A", "53":"A", "54":"C", "55":"A", "56":"C", "57":"C", "58":"B", "59":"D", "60":"C",
    "61":"B", "62":"A", "63":"C", "64":"D", "65":"D"
  }
};

const IMAGES_DIR = path.resolve(__dirname, `assets/images/${exam.name}`);
const OUTPUT_FILE = path.resolve(__dirname, `assets/${exam.id}-preguntas-db.json`);
const questions = [];

for (let i = 1; i <= 65; i++) {
  const imagePath = path.join(IMAGES_DIR, `${i}.png`);
  const imageExists = fs.existsSync(imagePath);
  
  // Find reading text mapping
  const mapping = exam.mappings.find(m => i >= m.questions[0] && i <= m.questions[1]);
  const readingText = mapping ? mapping.texts.map(t => `assets/images/${exam.name}/${t}`) : null;

  questions.push({
    id: `${exam.id}-q${i}`,
    ensayoId: exam.id,
    order: i,
    subject: exam.subject,
    text: `Pregunta ${i}`,
    imageUrl: imageExists ? `assets/images/${exam.name}/${i}.png` : null,
    readingText: readingText,
    options: {
      A: "",
      B: "",
      C: "",
      D: ""
    },
    correctAnswer: exam.answers[i.toString()] || null,
    explanation: `La respuesta correcta es la ${exam.answers[i.toString()] || 'no disponible'}.`,
    stem: `Pregunta ${i}`
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf-8');
console.log(`Generated ${exam.id} with ${questions.filter(q => q.imageUrl).length} images and ${questions.filter(q => q.readingText).length} text mappings.`);
