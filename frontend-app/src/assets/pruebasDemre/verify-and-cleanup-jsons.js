const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../assets');
const jsonFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('-preguntas-db.json'));

jsonFiles.forEach(file => {
  const filePath = path.join(assetsDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const originalCount = data.length;

  // Filter out removed questions
  // Criteria: imageUrl is null OR (text is "Pregunta X" and options are empty)
  data = data.filter(q => {
    if (!q.imageUrl) return false;
    
    // Check if options are all empty
    const hasOptions = Object.values(q.options || {}).some(opt => opt && opt.trim().length > 0);
    // In Language, options are often empty because the text is in the image.
    // So we only filter if imageUrl is null AND text is a placeholder.
    if (!q.imageUrl && q.text.startsWith('Pregunta') && !hasOptions) {
        return false;
    }
    
    return true;
  });

  // Verify consistency between order and imageUrl
  data.forEach(q => {
    if (q.imageUrl) {
      const match = q.imageUrl.match(/\/(\d+)\.png$/);
      if (match) {
        const imgNum = parseInt(match[1]);
        if (imgNum !== q.order) {
          console.warn(`[${file}] Mismatch: Question order is ${q.order} but image is ${match[1]}.png. Fixing order to match image.`);
          q.order = imgNum;
        }
      }
    }
  });

  if (data.length !== originalCount) {
    console.log(`[${file}] Removed ${originalCount - data.length} placeholder questions.`);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

console.log('Cleanup complete.');
