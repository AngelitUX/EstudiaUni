const fs = require('fs');
const path = require('path');

const exams = [
  { id: 'q-2024', name: 'Q-2024-IMAGENES', subject: 'Química' },
  { id: 'q-2025', name: 'Q-2025-IMAGENES', subject: 'Química' },
  { id: 'q-2026', name: 'Q-2026-IMAGENES', subject: 'Química' },
  { id: 'q-invierno-2024', name: 'Q-INVIERNO-2024-IMAGENES', subject: 'Química' },
  { id: 'q-invierno-2025', name: 'Q-INVIERNO-2025-IMAGENES', subject: 'Química' },
  { id: 'q-invierno-2026', name: 'Q-INVIERNO-2026-IMAGENES', subject: 'Química' }
];

exams.forEach(exam => {
  const IMAGES_DIR = path.resolve(__dirname, `assets/images/${exam.name}`);
  const OUTPUT_FILE = path.resolve(__dirname, `assets/${exam.id}-preguntas-db.json`);
  const questions = [];

  for (let i = 1; i <= 80; i++) {
    const imagePath = path.join(IMAGES_DIR, `${i}.png`);
    const imageExists = fs.existsSync(imagePath);
    
    questions.push({
      id: `${exam.id}-q${i}`,
      ensayoId: exam.id,
      order: i,
      subject: exam.subject,
      text: `Pregunta ${i}`,
      imageUrl: imageExists ? `assets/images/${exam.name}/${i}.png` : null,
      options: { A: '', B: '', C: '', D: '', E: '' },
      correctAnswer: null,
      explanation: `Solución de la pregunta ${i}.`,
      stem: `Pregunta ${i}`
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Generated ${exam.id} with ${questions.filter(q => q.imageUrl).length} images.`);
});
