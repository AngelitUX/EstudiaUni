const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../assets');
const files = [
  'l-2025-preguntas-db.json',
  'l-2026-preguntas-db.json',
  'l-invierno-2024-preguntas-db.json',
  'l-invierno-2025-preguntas-db.json',
  'l-invierno-2026-preguntas-db.json'
];

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${file}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n--- Auditing ${file} ---`);
  
  let errors = 0;
  data.forEach((q, index) => {
    // Check order
    if (q.order === undefined) {
      console.error(`[Error] Item at index ${index} missing 'order'`);
      errors++;
    }

    // Check imageUrl alignment
    if (q.imageUrl) {
      const match = q.imageUrl.match(/(\d+)\.png$/);
      if (match) {
        const imgNum = parseInt(match[1]);
        if (q.order !== imgNum) {
          console.error(`[Error] Order mismatch: order=${q.order}, image=${match[1]}.png`);
          errors++;
        }
      }
    } else {
      console.error(`[Error] Item ${q.id} missing imageUrl`);
      errors++;
    }

    // Check readingText
    if (q.readingText && Array.isArray(q.readingText)) {
      q.readingText.forEach(rt => {
        if (!rt.startsWith('assets/images/')) {
           console.error(`[Error] Invalid readingText path: ${rt}`);
           errors++;
        }
      });
    }
  });

  if (errors === 0) {
    console.log(`Status: OK (${data.length} questions checked)`);
  } else {
    console.log(`Status: FAILED (${errors} errors found)`);
  }
});
