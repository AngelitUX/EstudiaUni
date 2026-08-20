/**
 * Auditoría de contenido de la Ruta de Aprendizaje.
 * Carga los seeds TypeScript de verdad (no por regex) y busca inconsistencias.
 */
const fs = require('fs');
const path = require('path');
const ts = require(path.join(process.argv[2], 'node_modules/typescript'));

const DATA = path.join(process.argv[2], 'src/app/features/learning-path/data');

function loadSeed(file, exportName) {
  const src = fs.readFileSync(path.join(DATA, file), 'utf8')
    .replace(/^import .*$/gm, ''); // los imports son solo de tipos
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', js)(module.exports, module);
  return module.exports[exportName];
}

const problemas = [];
const add = (sev, tipo, msg) => problemas.push({ sev, tipo, msg });

function auditarCapitulos(capitulos, origen) {
  const idsCap = new Map();
  const idsSec = new Map();
  const idsTest = new Map();
  let totalSec = 0, totalPreg = 0;

  for (const cap of capitulos) {
    // ── IDs de capítulo duplicados ──
    if (idsCap.has(cap.id)) add('ALTA', 'id-duplicado', `Capítulo duplicado "${cap.id}" (${origen})`);
    idsCap.set(cap.id, cap);

    if (!cap.materiaId) add('MEDIA', 'campo-faltante', `Capítulo "${cap.id}" sin materiaId`);
    if (!cap.title) add('MEDIA', 'campo-faltante', `Capítulo "${cap.id}" sin title`);

    const secciones = cap.secciones || [];
    if (secciones.length === 0) add('MEDIA', 'vacio', `Capítulo "${cap.id}" sin secciones`);

    const ordersEnCap = new Map();
    const levelsEnCap = new Map();

    for (const sec of secciones) {
      totalSec++;

      // ── IDs de sección duplicados (global) ──
      if (idsSec.has(sec.id)) {
        add('ALTA', 'id-duplicado',
          `Sección duplicada "${sec.id}": en "${idsSec.get(sec.id)}" y en "${cap.id}"`);
      }
      idsSec.set(sec.id, cap.id);

      // ── coherencia de referencias ──
      if (sec.capituloId && sec.capituloId !== cap.id) {
        add('ALTA', 'referencia-rota',
          `Sección "${sec.id}" declara capituloId="${sec.capituloId}" pero está dentro de "${cap.id}"`);
      }
      if (sec.materiaId && cap.materiaId && sec.materiaId !== cap.materiaId) {
        add('ALTA', 'referencia-rota',
          `Sección "${sec.id}" declara materiaId="${sec.materiaId}" pero su capítulo es de "${cap.materiaId}"`);
      }

      // ── order duplicado dentro del capítulo ──
      if (sec.order !== undefined) {
        if (ordersEnCap.has(sec.order)) {
          add('MEDIA', 'orden-duplicado',
            `Capítulo "${cap.id}": order=${sec.order} repetido en "${ordersEnCap.get(sec.order)}" y "${sec.id}"`);
        }
        ordersEnCap.set(sec.order, sec.id);
      } else {
        add('BAJA', 'campo-faltante', `Sección "${sec.id}" sin order`);
      }

      if (sec.level !== undefined) {
        if (!levelsEnCap.has(sec.level)) levelsEnCap.set(sec.level, []);
        levelsEnCap.get(sec.level).push(sec.id);
      }

      // ── el test ──
      const test = sec.test;
      const esPractica = sec.isPractice || sec.isSlideGuide || sec.isProTip;
      if (!test) {
        if (!esPractica) {
          add('MEDIA', 'sin-test', `Sección "${sec.id}" (${cap.id}) no tiene test y no es práctica/guía/tip`);
        }
        continue;
      }

      if (test.id) {
        if (idsTest.has(test.id)) {
          add('ALTA', 'id-duplicado',
            `Test duplicado "${test.id}": en "${idsTest.get(test.id)}" y en "${sec.id}"`);
        }
        idsTest.set(test.id, sec.id);
      }
      if (test.seccionId && test.seccionId !== sec.id) {
        add('ALTA', 'referencia-rota',
          `Test "${test.id}" declara seccionId="${test.seccionId}" pero cuelga de "${sec.id}"`);
      }

      const preguntas = test.preguntas || [];
      if (preguntas.length === 0) {
        add('ALTA', 'test-vacio', `Test de "${sec.id}" (${cap.id}) NO tiene preguntas`);
        continue;
      }

      const idsPreg = new Map();
      const enunciadosVistos = new Map();

      for (const p of preguntas) {
        totalPreg++;

        if (p.id === undefined) {
          add('MEDIA', 'campo-faltante', `Pregunta sin id en "${sec.id}"`);
        } else if (idsPreg.has(p.id)) {
          add('ALTA', 'id-duplicado', `Pregunta id=${p.id} repetida dentro del test de "${sec.id}"`);
        } else {
          idsPreg.set(p.id, true);
        }

        // ── enunciado duplicado dentro del mismo test ──
        const clave = (p.enunciado || '').trim().toLowerCase();
        if (clave) {
          if (enunciadosVistos.has(clave)) {
            add('ALTA', 'pregunta-duplicada',
              `Enunciado repetido en "${sec.id}" (ids ${enunciadosVistos.get(clave)} y ${p.id}): "${(p.enunciado || '').slice(0, 70)}..."`);
          }
          enunciadosVistos.set(clave, p.id);
        } else {
          add('ALTA', 'campo-faltante', `Pregunta ${p.id} de "${sec.id}" sin enunciado`);
        }

        // ── alternativas y clave de respuesta ──
        const alts = p.alternativas || {};
        const claves = Object.keys(alts).filter((k) => alts[k] !== undefined && alts[k] !== null && alts[k] !== '');
        if (claves.length < 2) {
          add('ALTA', 'alternativas', `Pregunta ${p.id} de "${sec.id}" tiene ${claves.length} alternativa(s)`);
        }
        if (!p.respuesta_correcta) {
          add('ALTA', 'sin-respuesta', `Pregunta ${p.id} de "${sec.id}" sin respuesta_correcta`);
        } else if (!claves.includes(p.respuesta_correcta)) {
          add('ALTA', 'respuesta-invalida',
            `Pregunta ${p.id} de "${sec.id}": respuesta_correcta="${p.respuesta_correcta}" pero las alternativas son [${claves.join(', ')}]`);
        }

        // ── alternativas idénticas entre sí ──
        const textos = new Map();
        for (const k of claves) {
          const t = String(alts[k]).trim().toLowerCase();
          if (textos.has(t)) {
            add('ALTA', 'alternativas-iguales',
              `Pregunta ${p.id} de "${sec.id}": alternativas ${textos.get(t)} y ${k} son idénticas ("${String(alts[k]).slice(0, 45)}")`);
          }
          textos.set(t, k);
        }

        if (!p.feedback_acierto) add('BAJA', 'feedback', `Pregunta ${p.id} de "${sec.id}" sin feedback_acierto`);
        if (!p.feedback_error) add('BAJA', 'feedback', `Pregunta ${p.id} de "${sec.id}" sin feedback_error`);
      }
    }
  }

  return { capitulos: capitulos.length, secciones: totalSec, preguntas: totalPreg, idsSec, idsCap };
}

// ─── Ejecutar ───
const CAPITULOS = loadSeed('seed-data.ts', 'CAPITULOS');
const HISTORIA = loadSeed('seed-historia.ts', 'HISTORIA_CAPITULOS');

console.log('═══ AUDITORÍA DE CONTENIDO — RUTA DE APRENDIZAJE ═══\n');

const r1 = auditarCapitulos(CAPITULOS, 'seed-data.ts');
const r2 = auditarCapitulos(HISTORIA, 'seed-historia.ts');

// ── colisiones entre los dos archivos ──
for (const [id, cap] of r2.idsSec) {
  if (r1.idsSec.has(id)) {
    add('ALTA', 'id-duplicado',
      `Sección "${id}" existe en AMBOS seeds (seed-data:"${r1.idsSec.get(id)}" y seed-historia:"${cap}")`);
  }
}
for (const id of r2.idsCap.keys()) {
  if (r1.idsCap.has(id)) add('ALTA', 'id-duplicado', `Capítulo "${id}" existe en AMBOS seeds`);
}

console.log(`seed-data.ts     : ${r1.capitulos} capítulos, ${r1.secciones} secciones, ${r1.preguntas} preguntas`);
console.log(`seed-historia.ts : ${r2.capitulos} capítulos, ${r2.secciones} secciones, ${r2.preguntas} preguntas`);
console.log(`TOTAL            : ${r1.capitulos + r2.capitulos} capítulos, ${r1.secciones + r2.secciones} secciones, ${r1.preguntas + r2.preguntas} preguntas\n`);

const porSev = { ALTA: [], MEDIA: [], BAJA: [] };
problemas.forEach((p) => porSev[p.sev].push(p));

for (const sev of ['ALTA', 'MEDIA', 'BAJA']) {
  const lista = porSev[sev];
  console.log(`\n───── ${sev}: ${lista.length} hallazgo(s) ─────`);
  const porTipo = {};
  lista.forEach((p) => { (porTipo[p.tipo] = porTipo[p.tipo] || []).push(p.msg); });
  for (const [tipo, msgs] of Object.entries(porTipo)) {
    console.log(`\n  [${tipo}] ${msgs.length}`);
    msgs.slice(0, 12).forEach((m) => console.log('    · ' + m));
    if (msgs.length > 12) console.log(`    ... y ${msgs.length - 12} más`);
  }
}

console.log(`\n\nTOTAL DE HALLAZGOS: ${problemas.length}`);
