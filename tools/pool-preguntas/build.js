/**
 * Valida el contenido de `content/pool-preguntas/` y genera el mock local que
 * consume la app cuando USE_LOCAL_MOCKS esta activo.
 *
 * Uso:
 *   node tools/pool-preguntas/build.js            -> valida + escribe el mock
 *   node tools/pool-preguntas/build.js --check    -> solo valida (no escribe)
 *
 * Salida: frontend-app/src/assets/mocks/pool-preguntas-mock-local.json
 * (ese nombre cae bajo el patron `*-mock-local.json` del .gitignore raiz, o
 *  sea que el mock NO se versiona: la fuente de verdad versionada es
 *  content/pool-preguntas/**.json)
 */
const fs = require('fs');
const path = require('path');
const { validarPregunta, TEMAS_POR_MATERIA } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const DIR_CONTENIDO = path.join(RAIZ, 'content', 'pool-preguntas');
const SALIDA = path.join(RAIZ, 'frontend-app', 'src', 'assets', 'mocks', 'pool-preguntas-mock-local.json');

const soloCheck = process.argv.includes('--check');

/** Recorre content/pool-preguntas/**.json en orden estable. */
function listarArchivos(dir) {
  const salida = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...listarArchivos(p));
    else if (entrada.name.endsWith('.json')) salida.push(p);
  }
  return salida;
}

function main() {
  if (!fs.existsSync(DIR_CONTENIDO)) {
    console.error(`No existe ${DIR_CONTENIDO}`);
    process.exit(1);
  }

  const archivos = listarArchivos(DIR_CONTENIDO);
  const errores = [];
  const avisos = [];
  const todas = [];
  const idsVistos = new Map();
  const enunciadosVistos = new Map();

  for (const archivo of archivos) {
    const rel = path.relative(RAIZ, archivo);
    let datos;
    try {
      datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    } catch (e) {
      errores.push(`${rel}: JSON invalido — ${e.message}`);
      continue;
    }
    if (!Array.isArray(datos)) {
      errores.push(`${rel}: el archivo debe ser un array de preguntas.`);
      continue;
    }

    datos.forEach((q, i) => {
      const etiqueta = `${rel}[${i}]${q && q.id ? ` id=${q.id}` : ''}`;
      errores.push(...validarPregunta(q, etiqueta));

      if (q && q.id) {
        if (idsVistos.has(q.id)) errores.push(`${etiqueta}: id duplicado (ya usado en ${idsVistos.get(q.id)}).`);
        else idsVistos.set(q.id, etiqueta);
      }
      if (q && typeof q.enunciado === 'string') {
        // El enunciado por si solo no siempre identifica la pregunta: en
        // Competencia Lectora varias preguntas comparten enunciado corto sobre
        // preambulos distintos. Por eso la clave incluye el preambulo.
        const clave = `${(q.preambulo_texto || '').trim()}||${q.enunciado.trim()}`.toLowerCase();
        if (enunciadosVistos.has(clave)) {
          errores.push(`${etiqueta}: enunciado+preambulo duplicado de ${enunciadosVistos.get(clave)}.`);
        } else {
          enunciadosVistos.set(clave, etiqueta);
        }
      }
      todas.push(q);
    });
  }

  if (errores.length) {
    console.error(`\n✖ ${errores.length} error(es) de validacion:\n`);
    errores.slice(0, 60).forEach(e => console.error('  - ' + e));
    if (errores.length > 60) console.error(`  ... y ${errores.length - 60} mas.`);
    process.exit(1);
  }

  // ─── Resumen por materia/tema + chequeos de calidad no bloqueantes ───
  const porMateria = {};
  const respuestasPorTema = {};
  for (const q of todas) {
    porMateria[q.materiaId] = porMateria[q.materiaId] || {};
    porMateria[q.materiaId][q.tema] = (porMateria[q.materiaId][q.tema] || 0) + 1;
    const k = `${q.materiaId} :: ${q.tema}`;
    respuestasPorTema[k] = respuestasPorTema[k] || { A: 0, B: 0, C: 0, D: 0 };
    respuestasPorTema[k][q.respuesta_correcta]++;
  }

  console.log(`\n✔ ${todas.length} preguntas validas en ${archivos.length} archivo(s).\n`);
  for (const materia of Object.keys(porMateria).sort()) {
    const temas = porMateria[materia];
    const total = Object.values(temas).reduce((a, b) => a + b, 0);
    console.log(`  ${materia} (${total})`);
    for (const tema of (TEMAS_POR_MATERIA[materia] || Object.keys(temas))) {
      const n = temas[tema] || 0;
      const marca = n === 0 ? '  (VACIO)' : n < 30 ? '  (< 30: un Mini Ensayo de 30 sobre este tema quedaria corto)' : '';
      console.log(`     ${String(n).padStart(4)}  ${tema}${marca}`);
    }
  }

  // Un tema donde una letra concentra mas del 40% de las respuestas se vuelve
  // adivinable; el alumno aprende el patron, no el contenido.
  console.log('\n  Distribucion de la respuesta correcta por tema:');
  for (const [k, d] of Object.entries(respuestasPorTema)) {
    const total = d.A + d.B + d.C + d.D;
    const pico = Math.max(d.A, d.B, d.C, d.D) / total;
    const marca = pico > 0.4 ? '   ⚠ sesgada' : '';
    console.log(`     ${k}: A=${d.A} B=${d.B} C=${d.C} D=${d.D}${marca}`);
    if (pico > 0.4) avisos.push(`${k}: una alternativa concentra el ${Math.round(pico * 100)}% de las respuestas correctas.`);
  }

  if (avisos.length) {
    console.log(`\n  ⚠ ${avisos.length} aviso(s) de calidad (no bloquean el build).`);
  }

  if (soloCheck) {
    console.log('\n--check: no se escribio ningun archivo.\n');
    return;
  }

  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, JSON.stringify(todas, null, 2), 'utf8');
  const kb = (fs.statSync(SALIDA).size / 1024).toFixed(1);
  console.log(`\n→ Mock escrito: ${path.relative(RAIZ, SALIDA)} (${kb} KB)\n`);
}

main();
