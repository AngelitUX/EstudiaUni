const fs = require('fs');

let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// We have 15 missing seccionIds. The error gives line numbers.
// But it's easier to just do a global replace:
// test: {
//   id: 'test-2-protip-1',
//   contexto_base: null,
// =>
// test: {
//   id: 'test-2-protip-1',
//   seccionId: 'sec-2-protip-1',
//   contexto_base: null,

// The IDs are always 'test-2-...' and the seccionId is 'sec-2-...'
// We can just replace: 
// id: 'test-2-([^']+)',
// with
// id: 'test-2-',
// seccionId: 'sec-2-',

seedData = seedData.replace(/id: 'test-2-([^']+)',/g, "id: 'test-2-',\n      seccionId: 'sec-2-',");

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seedData);
console.log('Fixed seccionIds');
