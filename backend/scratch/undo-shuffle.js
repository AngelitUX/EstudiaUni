const fs = require('fs');
const path = require('path');

const scripts = [
  'generate-algebra-dataset.js',
  'generate-geometria-dataset.js',
  'generate-datos-dataset.js'
];

scripts.forEach(script => {
  const filePath = path.join(__dirname, script);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the injected postProcess function
  const startIdx = content.indexOf('// POST-PROCESSING PARA VARIABILIDAD Y FORMATO CHILENO');
  const endIdx = content.indexOf('function generateQuestions() {');
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
  }
  
  // Remove the injected call
  content = content.replace(/q = postProcess\(q\);\n\s+tests\.push\(shuffleAlternatives\(q\)\);/g, 'tests.push(shuffleAlternatives(q));');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Post-procesamiento eliminado de ${script}`);
});
