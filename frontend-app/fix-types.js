const fs = require('fs');
let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
seed = seed.replace(/testId: '([^']+)'/g, "test: { id: '', contexto_base: null, preguntas: [] }");
fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('Fixed testId -> test');
