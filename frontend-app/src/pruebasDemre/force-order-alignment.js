const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../assets');
console.log('Searching in:', assetsDir);
if (!fs.existsSync(assetsDir)) {
  console.error('Assets dir not found!');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('-preguntas-db.json'));
console.log('Found files:', files.length);

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  data.forEach(q => {
    if (q.imageUrl) {
      // Look for a number in the filename, e.g., "55.png" or "pregunta-55.png"
      // Updated regex to be more robust
      const match = q.imageUrl.match(/\/(\d+)\.(png|jpg|jpeg)$/i);
      if (match) {
        const imgNum = parseInt(match[1]);
        if (q.order !== imgNum) {
          console.log(`[${file}] Fixed order: ${q.order} -> ${imgNum} (matches ${match[0]})`);
          q.order = imgNum;
          changed = true;
        }
      } else {
        // console.warn(`[${file}] No number match in imageUrl: ${q.imageUrl}`);
      }
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[${file}] Updated.`);
  }
});

console.log('Force alignment complete.');
