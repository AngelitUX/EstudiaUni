/**
 * Utilidad de autoria: intercambia dos alternativas de una pregunta y ajusta
 * `respuesta_correcta` en consecuencia. Sirve para equilibrar la distribucion
 * de la letra correcta dentro de un tema sin reescribir el contenido a mano.
 *
 *   node tools/pool-preguntas/swap-alt.js <archivo.json> <id>:<X><Y> [<id>:<X><Y> ...]
 *   ej: node tools/pool-preguntas/swap-alt.js content/.../numeros.json pp-m1-num-002:BD
 *
 * OJO: usar solo cuando el orden de las alternativas es arbitrario. Si estan
 * ordenadas a proposito (valores crecientes, intervalos consecutivos), el
 * intercambio rompe esa logica y confunde al estudiante.
 */
const fs = require('fs');

const [, , archivo, ...ordenes] = process.argv;
if (!archivo || !ordenes.length) {
  console.error('Uso: node tools/pool-preguntas/swap-alt.js <archivo.json> <id>:<XY> [...]');
  process.exit(1);
}

const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
const porId = new Map(datos.map(q => [q.id, q]));
let aplicados = 0;

for (const orden of ordenes) {
  const [id, par] = orden.split(':');
  const q = porId.get(id);
  if (!q) { console.error(`  ✖ no existe la pregunta ${id}`); process.exit(1); }
  if (!par || par.length !== 2 || !/^[ABCD]{2}$/.test(par)) {
    console.error(`  ✖ "${par}" no es un par valido de letras (ej. BD)`); process.exit(1);
  }
  const [x, y] = par.split('');
  const tmp = q.alternativas[x];
  q.alternativas[x] = q.alternativas[y];
  q.alternativas[y] = tmp;

  if (q.respuesta_correcta === x) q.respuesta_correcta = y;
  else if (q.respuesta_correcta === y) q.respuesta_correcta = x;

  console.log(`  ✔ ${id}: ${x} <-> ${y}, respuesta correcta ahora ${q.respuesta_correcta}`);
  aplicados++;
}

fs.writeFileSync(archivo, JSON.stringify(datos, null, 2) + '\n', 'utf8');
console.log(`\n${aplicados} intercambio(s) aplicados en ${archivo}`);
