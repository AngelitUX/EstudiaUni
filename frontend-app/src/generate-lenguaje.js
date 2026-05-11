const fs = require('fs');
const path = require('path');

const exams = [
  { 
    id: 'l-2024', 
    name: 'L-2024-IMAGENES', 
    subject: 'Lenguaje',
    mappings: [
      { questions: [1, 7], texts: ['texto1parte1.png', 'texto1parte2.png', 'texto1parte3.png'] },
      { questions: [8, 16], texts: ['texto2parte1.png', 'texto2parte2.png', 'texto2parte3.png', 'texto2parte4.png'] },
      { questions: [17, 24], texts: ['texto3parte1.png', 'texto3parte2.png', 'texto3parte3.png'] },
      { questions: [25, 32], texts: ['texto4parte1.png', 'texto4parte2.png', 'texto4parte3.png'] },
      { questions: [33, 39], texts: ['texto5parte1.png', 'texto5parte2.png', 'texto5parte3.png', 'texto5parte4.png'] },
      { questions: [40, 47], texts: ['texto6parte1.png', 'texto6parte2.png', 'texto6parte3.png'] },
      { questions: [48, 57], texts: ['texto7parte1.png', 'texto7parte2.png', 'texto7parte3.png'] },
      { questions: [58, 65], texts: ['texto8parte1.png', 'texto8parte2.png', 'texto8parte3.png', 'texto8parte4.png'] }
    ]
  }
];

exams.forEach(exam => {
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
      options: { A: '', B: '', C: '', D: '' }, // Language usually has 4 options A-D
      correctAnswer: null,
      explanation: `Solución de la pregunta ${i}.`,
      stem: `Pregunta ${i}`
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Generated ${exam.id} with ${questions.filter(q => q.imageUrl).length} images and ${questions.filter(q => q.readingText).length} text mappings.`);
});
