/**
 * Equilibra la distribucion de la letra correcta dentro de cada archivo de
 * contenido, intercambiando alternativas.
 *
 *   node tools/pool-preguntas/rebalance.js            -> aplica a todos los archivos
 *   node tools/pool-preguntas/rebalance.js --check    -> solo informa, no escribe
 *
 * Por que importa: si una letra concentra demasiadas respuestas correctas (o
 * casi ninguna), un estudiante puede mejorar su puntaje adivinando por patron
 * en vez de por contenido. El objetivo es dejar cada tema cerca de 11/11/11/12.
 *
 * ⚠️ Regla de seguridad: NUNCA intercambia alternativas de una pregunta cuyas
 * cuatro opciones forman una secuencia numerica ordenada (por ejemplo
 * "20% / 25% / 80% / 125%" o "Entre 6 y 7 / Entre 7 y 8 / ..."). En esos casos
 * el orden es informacion para el estudiante y romperlo empeora la pregunta.
 */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..', '..');
const DIR = path.join(RAIZ, 'content', 'pool-preguntas');
const LETRAS = ['A', 'B', 'C', 'D'];
const soloCheck = process.argv.includes('--check');

function listarArchivos(dir) {
  const salida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...listarArchivos(p));
    else if (e.name.endsWith('.json')) salida.push(p);
  }
  return salida;
}

/** Extrae el primer numero de un texto, ignorando simbolos de moneda y unidades. */
function numeroDe(texto) {
  const limpio = String(texto).replace(/\./g, '').replace(/,/g, '.');
  const m = limpio.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

/**
 * Una pregunta es "reordenable" si sus alternativas NO forman una secuencia
 * numerica monotona. Si la forman, el orden es deliberado y no debe tocarse.
 */
function esReordenable(q) {
  const valores = LETRAS.map(l => numeroDe(q.alternativas[l]));
  if (valores.some(v => v === null)) return true; // hay texto: el orden es arbitrario
  const asc = valores.every((v, i) => i === 0 || v > valores[i - 1]);
  const desc = valores.every((v, i) => i === 0 || v < valores[i - 1]);
  return !(asc || desc);
}

function contar(preguntas) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  preguntas.forEach(q => c[q.respuesta_correcta]++);
  return c;
}

let totalSwaps = 0;
for (const archivo of listarArchivos(DIR)) {
  const rel = path.relative(RAIZ, archivo);
  const preguntas = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const antes = contar(preguntas);
  let swaps = 0;

  // Cada iteracion mueve UNA respuesta desde la letra mas usada a la menos
  // usada. Se detiene cuando la diferencia baja a 2 o cuando ya no queda
  // ninguna pregunta reordenable disponible.
  for (let intento = 0; intento < 40; intento++) {
    const c = contar(preguntas);
    const orden = [...LETRAS].sort((a, b) => c[b] - c[a]);
    const exceso = orden[0];
    const falta = orden[3];
    if (c[exceso] - c[falta] <= 2) break;

    const candidata = preguntas.find(q =>
      q.respuesta_correcta === exceso &&
      esReordenable(q) &&
      !q.__yaMovida
    );
    if (!candidata) break;

    const tmp = candidata.alternativas[exceso];
    candidata.alternativas[exceso] = candidata.alternativas[falta];
    candidata.alternativas[falta] = tmp;
    candidata.respuesta_correcta = falta;
    candidata.__yaMovida = true;
    swaps++;
  }

  preguntas.forEach(q => { delete q.__yaMovida; });
  const despues = contar(preguntas);

  if (swaps > 0) {
    console.log(`${rel}`);
    console.log(`   antes:   A=${antes.A} B=${antes.B} C=${antes.C} D=${antes.D}`);
    console.log(`   despues: A=${despues.A} B=${despues.B} C=${despues.C} D=${despues.D}   (${swaps} intercambio(s))`);
    if (!soloCheck) fs.writeFileSync(archivo, JSON.stringify(preguntas, null, 2) + '\n', 'utf8');
    totalSwaps += swaps;
  }
}

console.log(`\n${totalSwaps} intercambio(s) en total.${soloCheck ? ' (--check: no se escribio nada)' : ''}`);
