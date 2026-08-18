/**
 * Auditoría de CONTENIDO de la Ruta de Aprendizaje contra Firestore.
 *
 * SOLO LECTURA. Este script no escribe ni borra nada: únicamente hace .get()
 * sobre las colecciones de contenido de la ruta.
 *
 * Colecciones que lee:  lp_materias, lp_capitulos, secciones (collectionGroup), lp_tests
 * Colecciones que NO toca: users, intentos, bug_reports, manual_payments, flow_*, ai_*
 *
 * Uso:  node tools-audit-firestore.js
 * Requiere FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY en backend/.env
 */
const path = require('path');
const fs = require('fs');

const BACKEND = path.join(__dirname, 'backend');
require(path.join(BACKEND, 'node_modules/dotenv')).config({ path: path.join(BACKEND, '.env') });
const admin = require(path.join(BACKEND, 'node_modules/firebase-admin'));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Faltan credenciales de Firebase en backend/.env');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

const problemas = [];
const add = (sev, tipo, msg) => problemas.push({ sev, tipo, msg });

// Detector de UTF-8 doblemente codificado
const RE_MOJIBAKE = /(Ã[\x80-\xbf]|â[\x80-\x9f]|Â[\x80-\xbf])/;
function buscarMojibake(obj, ruta, vistos = new Set()) {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'string') {
    if (RE_MOJIBAKE.test(obj)) {
      const clave = ruta.split('.')[0];
      if (!vistos.has(clave)) {
        vistos.add(clave);
        add('MEDIA', 'texto-corrupto', `${ruta}: "${obj.slice(0, 70)}"`);
      }
    }
    return;
  }
  if (Array.isArray(obj)) { obj.forEach((v, i) => buscarMojibake(v, `${ruta}[${i}]`, vistos)); return; }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) buscarMojibake(v, `${ruta}.${k}`, vistos);
  }
}

(async () => {
  console.log('═══ AUDITORÍA DE CONTENIDO EN FIRESTORE (solo lectura) ═══');
  console.log(`proyecto: ${projectId}\n`);

  const [matSnap, capSnap, secSnap, testSnap] = await Promise.all([
    db.collection('lp_materias').get(),
    db.collection('lp_capitulos').get(),
    db.collectionGroup('secciones').get(),
    db.collection('lp_tests').get(),
  ]);

  const lecturas = matSnap.size + capSnap.size + secSnap.size + testSnap.size;
  console.log(`materias: ${matSnap.size} · capítulos: ${capSnap.size} · secciones: ${secSnap.size} · tests: ${testSnap.size}`);
  console.log(`(${lecturas} documentos leídos)\n`);

  const materias = matSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const capitulos = capSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const tests = new Map(testSnap.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));

  // ── secciones: detectar ids repetidos entre subcolecciones distintas ──
  const secciones = [];
  const secPorId = new Map();
  for (const d of secSnap.docs) {
    const data = { id: d.id, _path: d.ref.path, ...d.data() };
    secciones.push(data);
    if (secPorId.has(d.id)) {
      add('ALTA', 'id-duplicado',
        `Sección "${d.id}" aparece en dos rutas: ${secPorId.get(d.id)._path} y ${data._path}`);
    } else {
      secPorId.set(d.id, data);
    }
  }

  // ── capítulos ──
  const capsPorMateria = new Map();
  const idsCap = new Set();
  for (const c of capitulos) {
    if (idsCap.has(c.id)) add('ALTA', 'id-duplicado', `Capítulo "${c.id}" duplicado`);
    idsCap.add(c.id);
    if (!c.materiaId) { add('ALTA', 'huerfano', `Capítulo "${c.id}" sin materiaId`); continue; }
    if (!materias.some((m) => m.id === c.materiaId)) {
      add('ALTA', 'huerfano', `Capítulo "${c.id}" apunta a materia inexistente "${c.materiaId}"`);
    }
    if (!capsPorMateria.has(c.materiaId)) capsPorMateria.set(c.materiaId, []);
    capsPorMateria.get(c.materiaId).push(c);
    buscarMojibake({ title: c.title, introduccion: c.introduccion }, `capitulo ${c.id}`);
  }

  // ── secciones huérfanas y orders ──
  const secsPorCap = new Map();
  for (const s of secciones) {
    if (!s.capituloId) { add('ALTA', 'huerfano', `Sección "${s.id}" sin capituloId (${s._path})`); continue; }
    if (!idsCap.has(s.capituloId)) {
      add('ALTA', 'huerfano', `Sección "${s.id}" cuelga de capítulo inexistente "${s.capituloId}"`);
    }
    if (!secsPorCap.has(s.capituloId)) secsPorCap.set(s.capituloId, []);
    secsPorCap.get(s.capituloId).push(s);
    buscarMojibake({ title: s.title, introduccion: s.introduccion, guia_contenido: s.guia_contenido }, `seccion ${s.id}`);
  }

  // ── tests ──
  const testsUsados = new Set();
  let totalPreg = 0;
  const enunciados = new Map();

  for (const s of secciones) {
    if (!s.testId) continue;
    testsUsados.add(s.testId);
    const t = tests.get(s.testId);
    if (!t) { add('ALTA', 'referencia-rota', `Sección "${s.id}" apunta a test inexistente "${s.testId}"`); continue; }

    const preguntas = t.preguntas || [];
    if (preguntas.length === 0) {
      if (Array.isArray(t.preguntaIds) && t.preguntaIds.length > 0) {
        add('ALTA', 'test-por-referencia',
          `Test "${t.id}" (sección "${s.id}") define preguntaIds y NO preguntas embebidas: se renderiza VACÍO (el pool no se carga en la ruta)`);
      } else {
        add('ALTA', 'test-vacio', `Test "${t.id}" de la sección "${s.id}" no tiene preguntas`);
      }
      continue;
    }

    const idsPreg = new Set();
    for (const p of preguntas) {
      totalPreg++;
      if (p.id !== undefined) {
        if (idsPreg.has(p.id)) add('ALTA', 'id-duplicado', `Pregunta id=${p.id} repetida en test "${t.id}"`);
        idsPreg.add(p.id);
      }
      const k = (p.enunciado || '').trim().toLowerCase().replace(/\s+/g, ' ');
      if (k) {
        if (!enunciados.has(k)) enunciados.set(k, []);
        enunciados.get(k).push(`${t.id}#${p.id}`);
      } else {
        add('ALTA', 'campo-faltante', `Pregunta ${p.id} de "${t.id}" sin enunciado`);
      }

      const alts = p.alternativas || {};
      const claves = Object.keys(alts).filter((x) => alts[x] !== undefined && alts[x] !== null && alts[x] !== '');
      if (claves.length < 2) add('ALTA', 'alternativas', `Pregunta ${p.id} de "${t.id}" con ${claves.length} alternativa(s)`);
      if (!p.respuesta_correcta) {
        add('ALTA', 'sin-respuesta', `Pregunta ${p.id} de "${t.id}" sin respuesta_correcta`);
      } else if (!claves.includes(p.respuesta_correcta)) {
        add('ALTA', 'respuesta-invalida',
          `Pregunta ${p.id} de "${t.id}": respuesta="${p.respuesta_correcta}" pero alternativas [${claves.join(', ')}]`);
      }
      const vistos = new Map();
      for (const c of claves) {
        const tx = String(alts[c]).trim().toLowerCase();
        if (vistos.has(tx)) add('ALTA', 'alternativas-iguales', `Pregunta ${p.id} de "${t.id}": ${vistos.get(tx)} y ${c} idénticas`);
        vistos.set(tx, c);
      }
      buscarMojibake({ enunciado: p.enunciado, alternativas: p.alternativas }, `pregunta ${t.id}#${p.id}`);
    }
  }

  for (const [k, v] of enunciados) {
    if (v.length > 1) add('ALTA', 'pregunta-duplicada', `(${v.length}x) "${k.slice(0, 60)}..." → ${v.join(', ')}`);
  }

  for (const id of tests.keys()) {
    if (!testsUsados.has(id)) add('BAJA', 'test-huerfano', `Test "${id}" no lo referencia ninguna sección`);
  }

  // ── PRIMER CAPÍTULO POR MATERIA (el que ve gratis el Plan Básico) ──
  console.log('─── Capítulo GRATIS de cada materia (order más bajo) ───');
  const materiasOrdenadas = [...materias].sort((a, b) => (a.order || 0) - (b.order || 0));
  for (const m of materiasOrdenadas) {
    const caps = (capsPorMateria.get(m.id) || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    if (caps.length === 0) {
      console.log(`  ${m.id.padEnd(20)} SIN CAPÍTULOS`);
      add('MEDIA', 'materia-vacia', `Materia "${m.id}" (${m.title}) no tiene capítulos`);
      continue;
    }
    const libre = caps[0];
    const nSec = (secsPorCap.get(libre.id) || []).length;
    console.log(`  ${m.id.padEnd(20)} → ${libre.id} (order ${libre.order}) "${(libre.title || '').slice(0, 42)}" · ${nSec} secciones · ${caps.length - 1} de pago`);
    const empatados = caps.filter((c) => (c.order || 0) === (caps[0].order || 0));
    if (empatados.length > 1) {
      add('ALTA', 'order-ambiguo',
        `Materia "${m.id}": ${empatados.length} capítulos comparten order=${caps[0].order} (${empatados.map((c) => c.id).join(', ')}). El capítulo gratis sería indeterminado.`);
    }
    if (nSec === 0) add('ALTA', 'capitulo-vacio', `El capítulo gratis de "${m.id}" ("${libre.id}") no tiene secciones`);
  }

  console.log(`\npreguntas totales en Firestore: ${totalPreg} · enunciados únicos: ${enunciados.size}\n`);

  // ── informe ──
  const porSev = { ALTA: [], MEDIA: [], BAJA: [] };
  problemas.forEach((p) => porSev[p.sev].push(p));
  for (const sev of ['ALTA', 'MEDIA', 'BAJA']) {
    console.log(`\n───── ${sev}: ${porSev[sev].length} ─────`);
    const porTipo = {};
    porSev[sev].forEach((p) => { (porTipo[p.tipo] = porTipo[p.tipo] || []).push(p.msg); });
    for (const [tipo, msgs] of Object.entries(porTipo)) {
      console.log(`\n  [${tipo}] ${msgs.length}`);
      msgs.slice(0, 10).forEach((m) => console.log('    · ' + m));
      if (msgs.length > 10) console.log(`    ... y ${msgs.length - 10} más`);
    }
  }
  console.log(`\n\nTOTAL: ${problemas.length} hallazgo(s)`);
  process.exit(0);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
