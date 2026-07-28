const fs = require('fs');

let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// The easiest way is to find the object definitions using string splits or just finding indexes.
// Let's modify sec-2-prac-3 (Vocabulario en Contexto -> match-pairs)
// I will write a regex to find id: 'sec-2-prac-3', and replace its practiceType and test.

let data = seedData;

data = data.replace(
  /id: 'sec-2-prac-3'[\s\S]*?test: {[\s\S]*?\} \]/,
  id: 'sec-2-prac-3',
    title: 'Vocabulario en Contexto',
    introduccion: 'Práctica rápida de significado contextual.',
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Conecta el Significado',
      description: 'Une cada expresión coloquial o figurada con el sentido que toma en su contexto.',
      pairs: [
        { id: 1, left: 'Balde de agua fría', right: 'Sorpresa desagradable', hint: 'Apaga el entusiasmo repentinamente.' },
        { id: 2, left: 'Dar en el clavo', right: 'Acertar con precisión', hint: 'Dar exactamente en el punto.' },
        { id: 3, left: 'Echar leña al fuego', right: 'Empeorar la situación', hint: 'Aumentar el conflicto o problema.' },
        { id: 4, left: 'Ahogarse en un vaso de agua', right: 'Exagerar un problema menor', hint: 'Preocuparse demasiado por algo pequeño.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-3',
      seccionId: 'sec-2-prac-3',
      contexto_base: null,
      preguntas: []
    }
  }
);

// Actually, the regex \} \] might match too far or too short. 
// Let's just write a script that evals the file as a string if we can, 
// or precisely match the block by id.
