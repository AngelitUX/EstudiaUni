const fs = require('fs');
const path = require('path');

// Cargar base de datos local
const officialPath = path.resolve(__dirname, '../../frontend-app/src/assets/mocks/capitulos-mock-local.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(officialPath, 'utf8'));
} catch (e) {
  console.error('Error al cargar capitulos-mock-local.json:', e.message);
  process.exit(1);
}

const physicsCapIds = ['cap-fisica-1-ondas', 'cap-fisica-2-mecanica', 'cap-fisica-3-energia-tierra', 'cap-fisica-4-electricidad'];
const report = [];

physicsCapIds.forEach(id => {
  const cap = data.find(c => c.id === id);
  if (!cap) {
    report.push({ capId: id, status: 'NO ENCONTRADO EN EL MOCK' });
    return;
  }

  const capReport = {
    capId: id,
    title: cap.title,
    sectionsCount: cap.secciones ? cap.secciones.length : 0,
    totalQuestions: 0,
    anomalies: [],
    distribution: {}
  };

  if (cap.secciones) {
    cap.secciones.forEach((sec, sIdx) => {
      capReport.distribution[sec.id] = { A: 0, B: 0, C: 0, D: 0, consecutivePattern: [] };
      const dist = capReport.distribution[sec.id];
      
      if (sec.test && sec.test.preguntas) {
        let lastKey = '';
        let consecutiveCount = 1;

        sec.test.preguntas.forEach((q, qIdx) => {
          capReport.totalQuestions++;
          
          // 1. Validar campos requeridos
          const missingKeys = [];
          ['id', 'enunciado', 'alternativas', 'respuesta_correcta', 'feedback_acierto', 'feedback_error'].forEach(k => {
            if (q[k] === undefined || q[k] === null || q[k] === '') {
              missingKeys.push(k);
            }
          });
          if (missingKeys.length > 0) {
            capReport.anomalies.push(`Pregunta ${q.id || qIdx} (Sección: ${sec.id}): Faltan campos clave: [${missingKeys.join(', ')}]`);
          }

          // 2. Validar alternativas A, B, C, D
          if (q.alternativas) {
            ['A', 'B', 'C', 'D'].forEach(letter => {
              if (!q.alternativas[letter] || q.alternativas[letter] === '') {
                capReport.anomalies.push(`Pregunta ${q.id || qIdx} (Sección: ${sec.id}): Alternativa ${letter} vacía o faltante.`);
              }
            });
          }

          // 3. Validar respuesta correcta válida y calcular distribución
          if (q.respuesta_correcta && !['A', 'B', 'C', 'D'].includes(q.respuesta_correcta)) {
            capReport.anomalies.push(`Pregunta ${q.id || qIdx} (Sección: ${sec.id}): Respuesta correcta '${q.respuesta_correcta}' no es válida.`);
          } else if (q.respuesta_correcta) {
            dist[q.respuesta_correcta]++;
            if (q.respuesta_correcta === lastKey) {
              consecutiveCount++;
              if (consecutiveCount > 2) {
                dist.consecutivePattern.push(`Triple consecutiva de '${q.respuesta_correcta}' en el índice de pregunta ${qIdx}`);
              }
            } else {
              consecutiveCount = 1;
            }
            lastKey = q.respuesta_correcta;
          }

          // 4. Buscar placeholders
          const strQ = JSON.stringify(q);
          if (strQ.toLowerCase().includes('placeholder') || strQ.includes('TODO') || strQ.includes('...')) {
            capReport.anomalies.push(`Pregunta ${q.id || qIdx} (Sección: ${sec.id}): Contiene texto placeholder.`);
          }

          // 5. Validar balance de delimitadores de LaTeX ($)
          const fieldsToCheck = [q.enunciado, q.feedback_acierto, q.feedback_error];
          if (q.alternativas) {
            Object.values(q.alternativas).forEach(v => fieldsToCheck.push(v));
          }
          fieldsToCheck.forEach(text => {
            if (text && typeof text === 'string') {
              // Ignorar los signos de peso escapados (ej: \$) que se usan para texto plano y no disparan el modo matemático de KaTeX
              const cleanText = text.replace(/\\[$]/g, '');
              const dollarCount = (cleanText.match(/\$/g) || []).length;
              if (dollarCount % 2 !== 0) {
                capReport.anomalies.push(`Pregunta ${q.id || qIdx} (Sección: ${sec.id}): Delimitadores de LaTeX '$' impares en: "${text.substring(0, 40)}..."`);
              }
            }
          });
        });
      } else {
        capReport.anomalies.push(`Sección ${sec.id}: No tiene nodo 'test' o 'preguntas'.`);
      }
    });
  } else {
    capReport.anomalies.push('El capítulo no posee secciones.');
  }

  report.push(capReport);
});

// Guardar reporte en archivo de diagnóstico para que esté visible en el proyecto
const reportPath = path.resolve(__dirname, 'diagnose_report_physics.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log('🎉 Diagnóstico de los 4 Capítulos de Física completado exitosamente!');
console.log('Reporte guardado en:', reportPath);
console.log('\n--- RESUMEN RÁPIDO DE HALLAZGOS ---');
report.forEach(r => {
  console.log(`\nCapítulo: ${r.capId} (${r.title})`);
  console.log(` - Secciones: ${r.sectionsCount}`);
  console.log(` - Total de Preguntas: ${r.totalQuestions}`);
  console.log(` - Anomalías Detectadas: ${r.anomalies.length}`);
  if (r.anomalies.length > 0) {
    r.anomalies.forEach((a, i) => {
      if (i < 5) console.log(`   [Anomalía ${i+1}] ${a}`);
    });
    if (r.anomalies.length > 5) console.log(`   ... y ${r.anomalies.length - 5} anomalías más (ver archivo JSON completo).`);
  } else {
    console.log('   ✅ Sin anomalías de formato, LaTeX ni placeholders detectadas.');
  }
});
