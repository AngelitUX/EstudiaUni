const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.resolve(__dirname, 'assets/images/H-2025-IMAGENES');
const OUTPUT_FILE = path.resolve(__dirname, 'assets/h-2025-preguntas-db.json');

const questions = [];

for (let i = 1; i <= 65; i++) {
  const imagePath = path.join(IMAGES_DIR, `${i}.png`);
  const imageExists = fs.existsSync(imagePath);
  
  questions.push({
    id: `h-2025-q${i}`,
    ensayoId: 'h-2025',
    order: i,
    subject: 'Historia y Ciencias Sociales',
    text: `Pregunta ${i}`,
    imageUrl: imageExists ? `assets/images/H-2025-IMAGENES/${i}.png` : null,
    options: {
      A: '',
      B: '',
      C: '',
      D: '',
      E: ''
    },
    correctAnswer: null,
    explanation: `Solución de la pregunta ${i}.`,
    stem: `Pregunta ${i}`
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf-8');
console.log(`JSON generated successfully with ${questions.filter(q => q.imageUrl).length} images.`);
