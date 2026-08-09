const fs = require('fs');
let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
seed = seed.replace(/id:\s*'sec-2-9',/g, "id: 'sec-2-9', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 2,");
seed = seed.replace(/id:\s*'sec-2-10-join',/g, "id: 'sec-2-10-join', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 2,");
fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('Fixed sec-2-9 and sec-2-10-join');
