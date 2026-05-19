const fs = require('fs');
const path = require('path');

function checkDuplicates() {
  console.log('🔍 [EstudiaUni] Iniciando control de calidad y verificación para M2...\n');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontró capitulos-mock-local.json.');
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const m2Capitulos = capitulos.filter(c => c.materiaId === 'mat2');

  console.log(`📚 Capítulos M2 encontrados: ${m2Capitulos.length}`);
  m2Capitulos.forEach(c => {
    console.log(`   ➜ [${c.id}] ${c.title}`);
  });
  console.log('--------------------------------------------------\n');

  const idMap = new Map();
  const enunciadoMap = new Map();
  let totalM2Questions = 0;
  let hasErrors = false;
  let placeholderCount = 0;

  m2Capitulos.forEach(cap => {
    console.log(`🔹 Analizando Capítulo: ${cap.id} (${cap.title})`);
    let capQuestionsCount = 0;

    cap.secciones.forEach(sec => {
      if (!sec.test) {
        console.warn(`   ⚠️ Advertencia: La sección ${sec.id} no tiene un test asociado.`);
        return;
      }

      const preguntas = sec.test.preguntas || [];
      console.log(`      ➜ Sección ${sec.id}: ${preguntas.length} preguntas.`);

      if (preguntas.length !== 10) {
        console.error(`      ❌ ERROR: La sección ${sec.id} tiene ${preguntas.length} preguntas en vez de 10.`);
        hasErrors = true;
      }

      preguntas.forEach((q, idx) => {
        totalM2Questions++;
        capQuestionsCount++;

        // 1. Verificar duplicados de ID
        if (idMap.has(q.id)) {
          console.error(`      ❌ ID DUPLICADO: El ID "${q.id}" ya está registrado en la sección "${idMap.get(q.id)}".`);
          hasErrors = true;
        } else {
          idMap.set(q.id, sec.id);
        }

        // 2. Verificar duplicados de Enunciado
        // Simplificamos quitando espacios y KaTeX para comparar textos puros
        const cleanEnunciado = q.enunciado.trim().replace(/\s+/g, ' ').toLowerCase();
        if (enunciadoMap.has(cleanEnunciado)) {
          const duplicateInfo = enunciadoMap.get(cleanEnunciado);
          // Si el enunciado es idéntico pero no es un placeholder genérico
          if (!cleanEnunciado.includes('[placeholder]')) {
            console.error(`      ❌ ENUNCIADO DUPLICADO de "${q.id}" con "${duplicateInfo.id}" en la sección "${duplicateInfo.seccion}".`);
            console.error(`         ↳ Enunciado: "${q.enunciado.substring(0, 80)}..."`);
            hasErrors = true;
          }
        } else {
          enunciadoMap.set(cleanEnunciado, { id: q.id, seccion: sec.id });
        }

        // 3. Verificar si es Placeholder
        if (q.enunciado.includes('[Placeholder]') || Object.values(q.alternativas).some(alt => alt.includes('Opción'))) {
          placeholderCount++;
        }
      });
    });

    console.log(`   ➜ Total preguntas en el capítulo ${cap.id}: ${capQuestionsCount}\n`);
  });

  console.log('--------------------------------------------------');
  console.log('📊 RESUMEN DE LA VERIFICACIÓN DE CALIDAD M2:');
  console.log(`   ➜ Total de preguntas M2 analizadas: ${totalM2Questions}`);
  console.log(`   ➜ IDs Únicos registrados: ${idMap.size}`);
  console.log(`   ➜ Enunciados Únicos registrados: ${enunciadoMap.size}`);
  console.log(`   ➜ Preguntas con Placeholders encontradas: ${placeholderCount}`);

  if (placeholderCount > 0) {
    console.warn(`   ⚠️ ALERTA: Aún quedan ${placeholderCount} preguntas con placeholders en los mocks de M2.`);
  }

  if (hasErrors) {
    console.error('\n❌ RESULTADO: Se encontraron ERRORES CRÍTICOS de duplicación o cantidad en M2.');
  } else {
    console.log('\n🎉 RESULTADO: ¡Verificación exitosa! Cero duplicados de IDs y cero duplicados de enunciados en M2.');
  }
}

checkDuplicates();
