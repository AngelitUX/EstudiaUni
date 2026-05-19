const fs = require('fs');
const path = require('path');

// Helper to shuffle alternatives so the correct answer is random (following our other generators)
function shuffleAlternatives(q) {
  const correctText = q.alternativas[q.respuesta_correcta];
  const alts = [q.alternativas.A, q.alternativas.B, q.alternativas.C, q.alternativas.D];
  
  for (let i = alts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alts[i], alts[j]] = [alts[j], alts[i]];
  }
  
  q.alternativas = { A: alts[0], B: alts[1], C: alts[2], D: alts[3] };
  if (alts[0] === correctText) q.respuesta_correcta = 'A';
  else if (alts[1] === correctText) q.respuesta_correcta = 'B';
  else if (alts[2] === correctText) q.respuesta_correcta = 'C';
  else q.respuesta_correcta = 'D';
  
  return q;
}

function run() {
  console.log('🚀 [EstudiaUni] Iniciando generación local de Números (M1 - Capítulo 1)...');

  const srcDir = path.join(__dirname, '../src');
  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  
  const seedTsPath = path.join(srcDir, 'seed-mates-m1-numeros-final.ts');
  const guideDataPath = path.join(srcDir, 'guide-data.json');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');
  const materiasPath = path.join(mocksDir, 'materias-mock-local.json');

  if (!fs.existsSync(seedTsPath) || !fs.existsSync(guideDataPath) || !fs.existsSync(capitulosPath) || !fs.existsSync(materiasPath)) {
    console.error('❌ Error: Faltan archivos requeridos para la generación local.');
    process.exit(1);
  }

  // 1. Extraer TESTS_DATA de seed-mates-m1-numeros-final.ts programáticamente
  console.log('📝 Extrayendo preguntas de seed-mates-m1-numeros-final.ts...');
  const seedTsContent = fs.readFileSync(seedTsPath, 'utf8');
  
  const startKeyword = 'const TESTS_DATA = [';
  const startIndex = seedTsContent.indexOf(startKeyword);
  if (startIndex === -1) {
    console.error('❌ Error: No se encontró la constante TESTS_DATA en el archivo de semillas de Números.');
    process.exit(1);
  }

  // Encontrar el final del array (que termina con ]; y luego la función injectRealTests)
  const endKeyword = '];\n\nasync function injectRealTests()';
  const endIndex = seedTsContent.indexOf(endKeyword);
  if (endIndex === -1) {
    console.error('❌ Error: No se pudo determinar el final del array TESTS_DATA.');
    process.exit(1);
  }

  const arrayString = seedTsContent.substring(startIndex, endIndex + 2); // incluye el ];
  
  // Evaluar el array de forma segura en una función local
  let testsData;
  try {
    const fn = new Function(`${arrayString}\nreturn TESTS_DATA;`);
    testsData = fn();
  } catch (err) {
    console.error('❌ Error evaluando TESTS_DATA extraído:', err);
    process.exit(1);
  }

  console.log(`   ✅ Extraídos ${testsData.length} tests con un total de ${testsData.reduce((acc, t) => acc + t.preguntas.length, 0)} preguntas.`);

  // Normalizar los decimales en las preguntas de Números al formato chileno (coma en vez de punto)
  const fixDec = (str) => typeof str === 'string' ? str.replace(/(\d)\.(\d)/g, '$1,$2') : str;
  for (const test of testsData) {
    for (const q of test.preguntas) {
      q.enunciado = fixDec(q.enunciado);
      q.alternativas.A = fixDec(q.alternativas.A);
      q.alternativas.B = fixDec(q.alternativas.B);
      q.alternativas.C = fixDec(q.alternativas.C);
      q.alternativas.D = fixDec(q.alternativas.D);
      q.feedback_error = fixDec(q.feedback_error);
      q.feedback_acierto = fixDec(q.feedback_acierto);
      
      // Barajar las alternativas para que no siempre sea la misma letra correcta original
      shuffleAlternatives(q);
    }
  }

  // 2. Cargar Guías de guide-data.json
  console.log('📖 Cargando guías de guide-data.json...');
  const guideData = JSON.parse(fs.readFileSync(guideDataPath, 'utf8'));
  const numerosGuide = guideData['cap-m1-1-numeros'];

  if (!numerosGuide) {
    console.error('❌ Error: No se encontró la guía de Números ("cap-m1-1-numeros") en guide-data.json.');
    process.exit(1);
  }

  // 3. Modificar capitulos-mock-local.json
  console.log('💾 Actualizando capitulos-mock-local.json...');
  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const capTarget = capitulos.find(c => c.id === 'cap-m1-1-numeros');

  if (!capTarget) {
    console.error('❌ Error: No se encontró "cap-m1-1-numeros" en el mock local.');
    process.exit(1);
  }

  capTarget.introduccion = numerosGuide.introduccion;
  
  capTarget.secciones.forEach((sec, idx) => {
    const secGuide = numerosGuide.secciones[sec.id];
    if (secGuide) {
      sec.introduccion = secGuide.introduccion;
      sec.datos_claves = secGuide.datos_claves || [];
    } else {
      console.warn(`⚠️ Advertencia: No se encontró guía para la sección ${sec.id}`);
    }

    const testMock = testsData.find(t => t.seccionId === sec.id);
    if (testMock) {
      sec.test = {
        id: testMock.id,
        seccionId: sec.id,
        preguntas: testMock.preguntas
      };
    } else {
      console.warn(`⚠️ Advertencia: No se encontraron preguntas para la sección ${sec.id}`);
    }
  });

  fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2), 'utf8');
  console.log('   ✅ Capítulos y secciones de Números M1 actualizados con éxito.');

  // 4. Modificar materias-mock-local.json (Nombres de las rutas)
  console.log('✏️ Actualizando materias-mock-local.json...');
  const materias = JSON.parse(fs.readFileSync(materiasPath, 'utf8'));
  
  const mat1 = materias.find(m => m.id === 'mat1');
  if (mat1) {
    mat1.title = 'Competencia Matemática 1 (M1)';
    console.log('   ✅ Nombre de M1 cambiado a: "Competencia Matemática 1 (M1)"');
  }

  const mat2 = materias.find(m => m.id === 'mat2');
  if (mat2) {
    mat2.title = 'Competencia Matemática 2 (M2)';
    console.log('   ✅ Nombre de M2 cambiado a: "Competencia Matemática 2 (M2)"');
  }

  fs.writeFileSync(materiasPath, JSON.stringify(materias, null, 2), 'utf8');

  console.log('\n🎉 [EstudiaUni] ¡Generación de Números (M1) y nombres de ruta completados con éxito y 100% locales!');
}

run();
