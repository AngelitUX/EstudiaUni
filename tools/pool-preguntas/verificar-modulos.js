/**
 * Comprueba que el banco de preguntas alcanza para los tres modulos que lo
 * consumen, replicando su logica de filtrado tal como esta en el codigo:
 *
 *  · Mini Ensayo   -> MiniEnsayoService.getAvailableTopics / generateSession
 *  · Mente Veloz   -> MenteVelozComponent.normalizeMateriaId / isMateriaSelected
 *  · Modo Infinito -> InfiniteMasteryService.getAllAvailableQuestionsForMateria
 *                     y el emparejamiento por eje (tema + enunciado)
 *
 * Uso: node tools/pool-preguntas/verificar-modulos.js
 * Lee content/pool-preguntas/ (la fuente), no Firestore.
 */
const fs = require('fs');
const path = require('path');
const { TEMAS_POR_MATERIA } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const DIR = path.join(RAIZ, 'content', 'pool-preguntas');

function listar(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listar(p));
    else if (e.name.endsWith('.json')) out.push(p);
  }
  return out;
}
const pool = listar(DIR).flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')));

let fallos = 0;
const fallo = (msg) => { console.log('   ✖ ' + msg); fallos++; };

// ─── 1. MINI ENSAYO ────────────────────────────────────────────────────────
// El maximo que ofrece la UI es 30 preguntas, y el usuario puede seleccionar
// UN SOLO tema. Por lo tanto cada tema debe tener al menos 30 preguntas para
// que la sesion no se recorte (generateSession ajusta questionCount a la baja).
console.log('\n=== MINI ENSAYO (tope de la UI: 30 preguntas) ===');
for (const [materiaId, temas] of Object.entries(TEMAS_POR_MATERIA)) {
  const total = pool.filter(q => q.materiaId === materiaId).length;
  if (total === 0) { console.log(`   ${materiaId}: sin preguntas (materia vacia)`); continue; }
  const detalle = temas.map(t => {
    const n = pool.filter(q => q.materiaId === materiaId && q.tema === t).length;
    if (n < 30) fallo(`${materiaId} / ${t}: solo ${n} preguntas (< 30)`);
    return `${t}=${n}`;
  });
  console.log(`   ${materiaId} (${total}): ${detalle.join(', ')}`);
}

// ─── 2. MENTE VELOZ ────────────────────────────────────────────────────────
// Filtra solo por materia, normalizando ambos lados. Copiado literal de
// mente-veloz.component.ts.
function normalizeMateriaId(id) {
  if (!id) return '';
  const norm = id.toLowerCase().trim();
  if (norm === 'mat1' || norm === 'matematicas-m1' || norm === 'math-m1' || norm === 'm1') return 'mat1';
  if (norm === 'mat2' || norm === 'matematicas-m2' || norm === 'm2') return 'mat2';
  if (norm === 'comp-lectora' || norm === 'competencia-lectora' || norm === 'lectura') return 'comp-lectora';
  if (norm === 'historia' || norm === 'historia y cs. sociales' || norm === 'historia y cs. soc.') return 'historia';
  if (norm === 'ciencias') return 'ciencias';
  return norm;
}
// Ids tal como vienen de lp_materias (los que muestra el selector).
const MATERIAS_RUTA = ['comp-lectora', 'mat1', 'mat2', 'historia', 'ciencias-biologia', 'ciencias-fisica', 'ciencias-quimica'];
console.log('\n=== MENTE VELOZ (filtra solo por materia) ===');
for (const m of MATERIAS_RUTA) {
  const n = pool.filter(q => normalizeMateriaId(q.materiaId) === normalizeMateriaId(m)).length;
  if (n === 0) fallo(`Mente Veloz: la materia "${m}" no encuentra ninguna pregunta (revisar normalizacion de ids)`);
  console.log(`   ${m}: ${n} preguntas`);
}
// El plan gratuito solo habilita mat1 y comp-lectora: deben bastar por si solas.
const gratis = pool.filter(q => ['mat1', 'comp-lectora'].includes(normalizeMateriaId(q.materiaId))).length;
console.log(`   (plan gratuito, solo mat1 + comp-lectora): ${gratis} preguntas`);

// ─── 3. MODO INFINITO ──────────────────────────────────────────────────────
// getDailyAxisQuiz pide 5 preguntas por eje y getDailyBossQuiz 8 en total.
// El emparejamiento busca los topicos del eje dentro de `tema + enunciado`.
const EJES = {
  'mat1': { pool: 'matematicas-m1', ejes: {
    numeros: ['Números', 'Fracciones', 'Porcentajes', 'Potencias', 'Raíces'],
    algebra: ['Álgebra', 'Ecuaciones', 'Sistemas de Ecuaciones', 'Función Lineal', 'Función Cuadrática'],
    geometria: ['Geometría', 'Teorema de Pitágoras', 'Perímetros y Áreas', 'Vectores', 'Transformaciones Isométricas'],
    probabilidad: ['Probabilidad', 'Estadística', 'Medidas de Tendencia Central', 'Regla de Laplace'] } },
  'mat2': { pool: 'matematicas-m2', ejes: {
    reales_logaritmos: ['Reales', 'Logaritmos', 'Matemática Financiera', 'Interés', 'Complejos', 'Conjuntos'],
    trigonometria: ['Trigonometría', 'Razones Trigonométricas', 'Seno', 'Coseno', 'Tangente', 'Triángulos'],
    circunferencia: ['Circunferencia', 'Círculo', 'Geometría 3D', 'Homotecia', 'Esferas', 'Ángulos en la Circunferencia'],
    dispersion_modelos: ['Dispersión', 'Modelos', 'Distribución Normal', 'Probabilidad Condicional', 'Combinatoria', 'Permutaciones', 'Varianza', 'Desviación'] } },
  'comp-lectora': { pool: 'competencia-lectora', ejes: {
    localizar: ['Localizar', 'Información Explícita', 'Rastrear'],
    interpretar: ['Interpretar', 'Inferencia', 'Idea Principal', 'Relación de Párrafos', 'Síntesis'],
    evaluar: ['Evaluar', 'Tono del Emisor', 'Actitud', 'Juicio Crítico', 'Coherencia'] } },
  'historia': { pool: 'historia', ejes: {
    historia_mundo: ['Mundo', 'América', 'Guerra Fría', 'Siglo XX', 'Totalitarismos', 'Imperialismo'],
    historia_chile: ['Chile', 'República', 'Independencia', 'Siglo XIX', 'Democracia en Chile', 'Dictadura'],
    formacion_ciudadana: ['Ciudadanía', 'Democracia', 'Constitución', 'Derechos Humanos', 'Institucionalidad'],
    economia_sociedad: ['Economía', 'Mercado', 'Inflación', 'Comercio', 'Problema Económico'],
    geografia: ['Geografía', 'Territorio', 'Población', 'Medio Ambiente', 'Riesgos Naturales', 'Urbanización'] } },
  'fisica': { pool: 'ciencias-fisica', ejes: {
    ondas: ['Ondas', 'Sonido', 'Luz', 'Óptica', 'Espectro Electromagnético'],
    mecanica: ['Cinemática', 'Dinámica', 'Leyes de Newton', 'Fuerzas', 'Energía Mecánica'],
    energia_calor: ['Calor', 'Temperatura', 'Termodinámica', 'Calorimetría', 'Escalas Térmicas'],
    electricidad: ['Electricidad', 'Circuitos', 'Ley de Ohm', 'Potencia Eléctrica', 'Magnetismo'] } },
  'quimica': { pool: 'ciencias-quimica', ejes: {
    estructura_atomica: ['Átomo', 'Tabla Periódica', 'Enlace Químico', 'Configuración Electrónica'],
    reacciones_estequiometria: ['Estequiometría', 'Mol', 'Reacciones Químicas', 'Leyes Ponderales', 'Balance'],
    soluciones: ['Soluciones', 'Concentración', 'Molaridad', 'Solubilidad', 'Dilución'],
    quimica_organica: ['Orgánica', 'Hidrocarburos', 'Grupos Funcionales', 'Nomenclatura Orgánica'] } },
  'biologia': { pool: 'ciencias-biologia', ejes: {
    organizacion_celular: ['Célula', 'Membrana', 'Transporte Celular', 'Organelos', 'Biomoléculas'],
    herencia_evolucion: ['Genética', 'ADN', 'Mitosis', 'Meiosis', 'Evolución', 'Leyes de Mendel'],
    organismo_ambiente: ['Ecología', 'Cadenas Tróficas', 'Poblaciones', 'Fotosíntesis', 'Ecosistemas'],
    fisiologia_salud: ['Fisiología', 'Hormonas', 'Sistema Nervioso', 'Inmunidad', 'Sexualidad'] } },
};

console.log('\n=== MODO INFINITO (5 preguntas por eje, 8 para el jefe) ===');
console.log('   Nota: si un eje no alcanza 5 coincidencias, el servicio usa como respaldo');
console.log('   todas las preguntas de la materia, asi que el quiz igual se arma.\n');
for (const [materiaRuta, cfg] of Object.entries(EJES)) {
  const deMateria = pool.filter(q => q.materiaId === cfg.pool || q.materiaId === materiaRuta);
  const partes = [];
  for (const [eje, topicos] of Object.entries(cfg.ejes)) {
    const n = deMateria.filter(q => {
      const texto = `${q.tema || ''} ${q.enunciado || ''}`.toLowerCase();
      return topicos.some(t => texto.includes(t.toLowerCase()));
    }).length;
    partes.push(`${eje}=${n}${n < 5 ? ' (usa respaldo)' : ''}`);
  }
  if (deMateria.length < 8) fallo(`Modo Infinito: ${materiaRuta} tiene solo ${deMateria.length} preguntas (el jefe pide 8)`);
  console.log(`   ${materiaRuta} (${deMateria.length} en total): ${partes.join(', ')}`);
}

console.log(fallos === 0
  ? '\n✔ Los tres modulos quedan cubiertos por el banco de preguntas.\n'
  : `\n✖ ${fallos} problema(s) detectado(s).\n`);
process.exit(fallos === 0 ? 0 : 1);
