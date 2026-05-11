const fs = require('fs');
const path = require('path');

const exams = [
  { id: 't-2024', name: 'T-2024-IMAGENES', subject: 'Técnico Profesional' },
  { id: 't-2025', name: 'T-2025-IMAGENES', subject: 'Técnico Profesional' },
  { id: 't-2026', name: 'T-2026-IMAGENES', subject: 'Técnico Profesional' },
  { id: 't-invierno-2024', name: 'T-INVIERNO-2024-IMAGENES', subject: 'Técnico Profesional' },
  { id: 't-invierno-2025', name: 'T-INVIERNO-2025-IMAGENES', subject: 'Técnico Profesional' },
  { id: 't-invierno-2026', name: 'T-INVIERNO-2026-IMAGENES', subject: 'Técnico Profesional' }
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
