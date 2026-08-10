const fs = require('fs');
const p = 'src/app/features/learning-path/data/seed-historia.ts';
let data = fs.readFileSync(p, 'utf8');
data = data.replace(/"testId":\s*"[^"]+",/g, '');
fs.writeFileSync(p, data);
