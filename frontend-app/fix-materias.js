const fs = require('fs');

// Read existing seed-data.ts
let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// 1. Fix MATERIAS isActive
seed = seed.replace(/isActive: false/g, 'isActive: true');

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('MATERIAS fixed');
