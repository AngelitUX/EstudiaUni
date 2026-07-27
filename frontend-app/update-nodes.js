const fs = require('fs');
let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

const replaceNode = (id, newContent) => {
  const regex = new RegExp('\\{\\s*id: \\'' + id + '\\'[\\s\\S]*?test: \\{[\\s\\S]*?\\}\\s*\\}', 'g');
  seedData = seedData.replace(regex, newContent);
}

replaceNode('sec-2-prac-3', {
    id: 'sec-2-prac-3',
    level: 10,
    order: 10,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: [],
    title: 'Vocabulario en Contexto',
    introduccion: 'Práctica rápida de significado contextual.',
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Conecta el Significado',
      description: 'Une cada expresión con el sentido que toma en su contexto.',
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
  });

replaceNode('sec-2-prac-4', {
    id: 'sec-2-prac-4',
    level: 14,
    order: 14,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: [],
    title: 'Tesis vs Detalles',
    introduccion: 'Práctica rápida de jerarquía de ideas.',
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      title: 'Clasifica las Ideas',
      description: 'Basado en un texto hipotético sobre la Inteligencia Artificial, clasifica si la frase es la Tesis Central o un Detalle Accesorio.',
      categories: [
        { id: 'tesis', label: 'Idea Principal (Tesis)' },
        { id: 'detalle', label: 'Idea Accesoria (Detalle)' }
      ],
      items: [
        { id: 1, text: 'La inteligencia artificial ha revolucionado múltiples sectores.', category: 'tesis', hint: 'Es la afirmación global.' },
        { id: 2, text: 'Algoritmos como Watson ayudan a diagnosticar enfermedades.', category: 'detalle', hint: 'Es un ejemplo específico.' },
        { id: 3, text: 'Los drones monitorean los cultivos en la agricultura.', category: 'detalle', hint: 'Es otro ejemplo específico.' },
        { id: 4, text: 'El rápido avance tecnológico plantea desafíos éticos.', category: 'tesis', hint: 'Es una conclusión global derivada de los ejemplos.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-4',
      seccionId: 'sec-2-prac-4',
      contexto_base: null,
      preguntas: []
    }
  });

replaceNode('sec-2-prac-6', {
    id: 'sec-2-prac-6',
    level: 21,
    order: 21,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: [],
    title: 'Identificando el Tono',
    introduccion: 'Práctica rápida de identificación de tonos.',
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Conecta el Tono',
      description: 'Une cada breve fragmento con el tono predominante del emisor.',
      pairs: [
        { id: 1, left: '"¡Qué maravilla que pavimenten la misma calle 3 veces!"', right: 'Irónico', hint: 'Dice algo positivo para criticar.' },
        { id: 2, left: '"Las emisiones de carbono se redujeron un 2% este año."', right: 'Objetivo', hint: 'Solo entrega un dato sin opinión.' },
        { id: 3, left: '"Es alarmante y vergonzosa la actitud de los directivos."', right: 'Crítico', hint: 'Emite un juicio de valor negativo explícito.' },
        { id: 4, left: '"Recordaríamos lo pequeños que somos frente al cosmos."', right: 'Reflexivo', hint: 'Invita a la meditación profunda.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-6',
      seccionId: 'sec-2-prac-6',
      contexto_base: null,
      preguntas: []
    }
  });

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seedData);
console.log('Successfully updated seed data!');
