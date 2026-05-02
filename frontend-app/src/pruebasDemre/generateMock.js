const fs = require('fs');
const path = require('path');

const NUM_QUESTIONS = 65;
const EXAM_ID = 'm1';

// We check which images exist in the images directory
const imagesDir = path.join(__dirname, 'M1-2024-IMAGENES');
let existingImages = [];
try {
  existingImages = fs.readdirSync(imagesDir);
} catch(e) {
  console.log('No se pudo leer la carpeta de imágenes');
}

const questions = [];

for (let i = 1; i <= NUM_QUESTIONS; i++) {
  const imageName = `${i}.png`;
  const hasImage = existingImages.includes(imageName);
  
  questions.push({
    id: `m1-2024-q${i}`,
    ensayoId: EXAM_ID,
    order: i,
    subject: "Matemática",
    text: hasImage ? `Resuelve la pregunta ${i} en base a la siguiente imagen:` : `Esta es la pregunta ${i} de la prueba M1 2024.`,
    imageUrl: hasImage ? `assets/images/M1-2024-IMAGENES/${imageName}` : null,
    options: {
      A: "Alternativa A",
      B: "Alternativa B",
      C: "Alternativa C",
      D: "Alternativa D"
    },
    correctAnswer: "A", // Default to A since we don't have the key parsed yet
    explanation: `Solución de la pregunta ${i}.`
  });
}

const outputPath = path.join(__dirname, 'm1-preguntas-db.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));

console.log(`Generadas ${NUM_QUESTIONS} preguntas. JSON guardado en ${outputPath}`);
