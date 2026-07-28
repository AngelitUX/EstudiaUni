const fs = require('fs');
let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// Match everything from secciones: [ inside id: 'cap-interpretar' up to   }, before   { of cap-evaluar
const capStartStr = "    id: 'cap-interpretar',";
const capStartIndex = seed.indexOf(capStartStr);

const capEndStr = "  {";
const capEndIndex = seed.indexOf(capEndStr, seed.indexOf("  },", capStartIndex) + 4);

// To avoid bad slices, let's just use string replacement on a very specific regex for cap-interpretar
let newSeed = seed.replace(/(id: 'cap-interpretar',[\s\S]*?secciones: )\[[\s\S]*?\]\n  \},/g, $1[/* INSERT_HERE */]\n  },);

// Let's create an array of all the base nodes (excluding order and level)
const allNodes = [
  { id: 'sec-2-0-guia', title: 'Interpretar textos', isSlideGuide: true, introduccion: '...', test: { id: 'test-2-0', contexto_base: null, preguntas: [] } } // We need the full objects!
];
