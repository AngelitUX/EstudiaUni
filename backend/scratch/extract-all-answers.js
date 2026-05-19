const fs = require('fs');
const path = require('path');

const capitulosFile = path.join(__dirname, '../../frontend-app/src/assets/mocks/capitulos-mock-local.json');
const outputFile = path.join(__dirname, '../../respuestas_mates_m1.txt');

function run() {
  const capitulos = JSON.parse(fs.readFileSync(capitulosFile, 'utf8'));

  let out = '==================================================\n';
  out += '   ESTUDIAUNI.CL - TODAS LAS RESPUESTAS M1\n';
  out += '==================================================\n\n';

  capitulos.forEach(cap => {
    out += `\n📘 CAPÍTULO: ${cap.title} (${cap.id})\n`;
    out += '--------------------------------------------------\n\n';
    
    cap.secciones.forEach((sec, idx) => {
      out += `🔹 Paso ${idx + 1}: ${sec.title}\n   `;
      
      const test = sec.test;
      if (test && test.preguntas && test.preguntas.length > 0) {
        const ans = test.preguntas.map((q, i) => `Pregunta ${i + 1}: [${q.respuesta_correcta}]`);
        out += ans.join('  |  ');
      } else {
        out += 'No hay preguntas';
      }
      out += '\n\n';
    });
  });

  fs.writeFileSync(outputFile, out, 'utf8');
  console.log('✅ Respuestas extraídas y guardadas en respuestas_mates_m1.txt');
}

run();
