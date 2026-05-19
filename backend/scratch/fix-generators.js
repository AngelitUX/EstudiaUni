const fs = require('fs');
const path = require('path');

const scripts = [
  { file: 'generate-algebra-dataset.js', id: 'cap-m1-2-algebra', total: 190, name: 'Álgebra', pref: '2' },
  { file: 'generate-geometria-dataset.js', id: 'cap-m1-3-geometria', total: 100, name: 'Geometría', pref: '3' },
  { file: 'generate-datos-dataset.js', id: 'cap-m1-4-datos', total: 90, name: 'Probabilidad y Estadística', pref: '4' }
];

scripts.forEach(s => {
  const filePath = path.join(__dirname, s.file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const endBlock = `
const allQuestions = generateQuestions();

// Read existing local mocks
const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

const capitulos = require(capitulosPath);
const capTarget = capitulos.find(c => c.id === '${s.id}');

if (capTarget) {
  console.log('✅ Injecting ${s.total} questions into ${s.name}...');
  
  capTarget.secciones.forEach((sec, idx) => {
    const step = idx + 1;
    if (typeof guides !== 'undefined' && guides[sec.id]) {
      sec.introduccion = guides[sec.id].introduccion;
      sec.datos_claves = guides[sec.id].datos_claves;
    }
    sec.test = {
      id: \`test-m1-${s.pref}-\${step}\`,
      seccionId: sec.id,
      preguntas: allQuestions.filter(q => q.id.toString().startsWith(\`${s.pref}\${step.toString().padStart(2, '0')}\`))
    };
  });
}

fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2));
console.log('🎉 ${s.name} written to local mock!');
`;

  const cutIdx = content.indexOf('const allQuestions = generateQuestions();');
  if (cutIdx !== -1) {
    content = content.substring(0, cutIdx) + endBlock;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Pipeline arreglado para ${s.file}`);
  }
});
