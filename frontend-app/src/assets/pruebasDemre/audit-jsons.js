const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('-preguntas-db.json'));

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lastQ = data[data.length - 1];
  console.log(`[${file}] Length: ${data.length}, Last Order: ${lastQ ? lastQ.order : 'N/A'}`);
});
