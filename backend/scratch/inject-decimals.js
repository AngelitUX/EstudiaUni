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
  
  if (!content.includes('// Fix decimal format (, instead of .)')) {
    const injection = `
      // Fix decimal format (, instead of .)
      const fixDec = (str) => typeof str === 'string' ? str.replace(/(\\d)\\.(\\d)/g, '$1,$2') : str;
      q.enunciado = fixDec(q.enunciado);
      q.alternativas.A = fixDec(q.alternativas.A);
      q.alternativas.B = fixDec(q.alternativas.B);
      q.alternativas.C = fixDec(q.alternativas.C);
      q.alternativas.D = fixDec(q.alternativas.D);
      q.feedback_error = fixDec(q.feedback_error);
      q.feedback_acierto = fixDec(q.feedback_acierto);
      
      tests.push(shuffleAlternatives(q));`;
    
    content = content.replace('tests.push(shuffleAlternatives(q));', injection.trim());
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Formato de decimales inyectado en ${script}`);
  }
});
