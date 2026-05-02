const fs = require('fs');
const path = require('path');

const exams = [
  'B-2024',
  'B-INVIERNO-2024',
  'B-2025',
  'B-INVIERNO-2025',
  'B-2026',
  'B-INVIERNO-2026'
];

exams.forEach(exam => {
  const IMAGES_DIR = path.resolve(__dirname, `assets/images/${exam}-IMAGENES`);
  const OUTPUT_FILE = path.resolve(__dirname, `assets/${exam.toLowerCase()}-preguntas-db.json`);
  
  const questions = [];

  for (let i = 1; i <= 80; i++) {
    const imagePath = path.join(IMAGES_DIR, `${i}.png`);
    const imageExists = fs.existsSync(imagePath);
    
    questions.push({
      id: `${exam.toLowerCase()}-q${i}`,
      ensayoId: exam.toLowerCase(),
      order: i,
      subject: 'Biología',
      text: `Pregunta ${i}`,
      imageUrl: imageExists ? `assets/images/${exam}-IMAGENES/${i}.png` : null,
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
  console.log(`JSON generated successfully for ${exam} with ${questions.filter(q => q.imageUrl).length} images.`);
});
