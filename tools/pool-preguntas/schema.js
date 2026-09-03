/**
 * Fuente unica de verdad para el formato de `pool_preguntas`, compartida por
 * el validador, el generador del mock local y el uploader a Firestore.
 *
 * ⚠️ TEMAS_POR_MATERIA debe ser un ESPEJO EXACTO de
 * `AdminService.temasPorMateria` en
 * frontend-app/src/app/features/admin/services/admin.service.ts
 * El importador JSON del panel admin valida contra ese mapa; si divergen,
 * contenido que este script da por bueno seria rechazado por el panel.
 */

const MATERIAS_VALIDAS = [
  'competencia-lectora',
  'matematicas-m1',
  'matematicas-m2',
  'ciencias-biologia',
  'ciencias-fisica',
  'ciencias-quimica',
  'ciencias-tp',
  'historia',
];

const TEMAS_POR_MATERIA = {
  'matematicas-m1': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
  'matematicas-m2': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
  'competencia-lectora': ['Rastrear y localizar', 'Relacionar e interpretar', 'Evaluar y reflexionar'],
  'ciencias-biologia': ['Organización, estructura y actividad celular', 'Procesos y funciones biológicas', 'Herencia y evolución', 'Organismo y ambiente'],
  'ciencias-fisica': ['Mecánica', 'Ondas', 'Energía', 'Electricidad y magnetismo'],
  'ciencias-quimica': ['Estructura atómica y enlaces', 'Química orgánica', 'Reacciones químicas y estequiometría'],
  'ciencias-tp': ['Biología TP', 'Física TP', 'Química TP'],
  'historia': ['Mundo, América y Chile', 'Formación Ciudadana', 'Economía y Sociedad'],
};

/** Marca de agua del contenido creado por esta tanda. El uploader SOLO puede
 *  sobrescribir documentos con este `createdBy`; cualquier otro se salta. */
const CREATED_BY = 'pool-seed-2026-08';

/**
 * Valida una pregunta con las MISMAS reglas que `validateAndImport()` del
 * panel admin (admin-panel.component.ts), mas comprobaciones de calidad que
 * el panel no hace (alternativas identicas, campos vacios, latex ilegible).
 * Devuelve un array de mensajes de error; vacio = valida.
 */
function validarPregunta(q, etiqueta) {
  const e = [];
  const pre = etiqueta ? `${etiqueta}: ` : '';

  if (!q.id || typeof q.id !== 'string') e.push(`${pre}"id" requerido (string).`);

  if (!q.materiaId || !MATERIAS_VALIDAS.includes(q.materiaId)) {
    e.push(`${pre}"materiaId" debe ser uno de: ${MATERIAS_VALIDAS.join(', ')}`);
    return e; // sin materia no se puede validar el tema
  }

  const temasValidos = TEMAS_POR_MATERIA[q.materiaId] || [];
  if (!q.tema || typeof q.tema !== 'string' || !temasValidos.includes(q.tema)) {
    e.push(`${pre}"tema" debe ser exactamente uno de: ${temasValidos.join(' | ')} (recibido: ${JSON.stringify(q.tema)})`);
  }

  if (!q.enunciado || typeof q.enunciado !== 'string' || !q.enunciado.trim()) {
    e.push(`${pre}"enunciado" requerido.`);
  }

  if (!q.alternativas || typeof q.alternativas !== 'object') {
    e.push(`${pre}"alternativas" debe ser un objeto con A, B, C y D.`);
    return e;
  }
  const alts = q.alternativas;
  for (const k of ['A', 'B', 'C', 'D']) {
    if (!alts[k] || typeof alts[k] !== 'string' || !alts[k].trim()) {
      e.push(`${pre}falta la alternativa "${k}" (el importador del panel exige las cuatro).`);
    }
  }
  // Calidad: dos alternativas identicas hacen la pregunta irresoluble.
  const vistos = new Map();
  for (const k of ['A', 'B', 'C', 'D']) {
    const v = (alts[k] || '').trim().toLowerCase();
    if (!v) continue;
    if (vistos.has(v)) e.push(`${pre}alternativas ${vistos.get(v)} y ${k} son identicas.`);
    else vistos.set(v, k);
  }

  if (!q.respuesta_correcta || !['A', 'B', 'C', 'D'].includes(q.respuesta_correcta)) {
    e.push(`${pre}"respuesta_correcta" debe ser A, B, C o D.`);
  }
  if (!q.feedback_acierto || typeof q.feedback_acierto !== 'string' || !q.feedback_acierto.trim()) {
    e.push(`${pre}"feedback_acierto" requerido.`);
  }
  if (!q.feedback_error || typeof q.feedback_error !== 'string' || !q.feedback_error.trim()) {
    e.push(`${pre}"feedback_error" requerido.`);
  }
  if (q.tipo_alternativas && !['texto', 'imagen'].includes(q.tipo_alternativas)) {
    e.push(`${pre}"tipo_alternativas" solo acepta 'texto' o 'imagen'.`);
  }

  // Mente Veloz pinta `formula_latex` como texto crudo dentro de un <code>
  // (mente-veloz.component.ts ~344), NO lo pasa por KaTeX como si hacen el
  // runner de Mini Ensayo y el Modo Infinito. Por eso el latex tiene que ser
  // legible tal cual: nada de \frac, \sqrt, \begin...
  if (q.formula_latex) {
    if (typeof q.formula_latex !== 'string') {
      e.push(`${pre}"formula_latex" debe ser string o null.`);
    } else {
      const prohibidos = ['\\frac', '\\sqrt', '\\begin', '\\dfrac', '\\overline', '\\underline'];
      const usado = prohibidos.filter(c => q.formula_latex.includes(c));
      if (usado.length) {
        e.push(`${pre}"formula_latex" usa ${usado.join(', ')} — ilegible en Mente Veloz, que lo muestra sin renderizar. Usa notacion plana (x^2, 3/4, (a+b)/2).`);
      }
    }
  }

  return e;
}

/** Normaliza la pregunta al documento exacto que se guarda en Firestore. */
function aDocumentoFirestore(q, ahoraIso) {
  return {
    materiaId: q.materiaId,
    tema: q.tema,
    preambulo_texto: q.preambulo_texto ?? null,
    preambulo_imagen_url: q.preambulo_imagen_url ?? null,
    enunciado: q.enunciado,
    formula_latex: q.formula_latex ?? null,
    tipo_alternativas: q.tipo_alternativas === 'imagen' ? 'imagen' : 'texto',
    alternativas: {
      A: String(q.alternativas.A),
      B: String(q.alternativas.B),
      C: String(q.alternativas.C),
      D: String(q.alternativas.D),
    },
    respuesta_correcta: q.respuesta_correcta,
    feedback_acierto: q.feedback_acierto.trim(),
    feedback_error: q.feedback_error.trim(),
    createdAt: ahoraIso,
    updatedAt: ahoraIso,
    createdBy: CREATED_BY,
  };
}

module.exports = { MATERIAS_VALIDAS, TEMAS_POR_MATERIA, CREATED_BY, validarPregunta, aDocumentoFirestore };
