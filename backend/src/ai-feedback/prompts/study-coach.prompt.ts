import { StudyCoachContextDto } from '../dto/study-coach.dto';

/**
 * Foco como ENTRENADOR DE ESTUDIO del dashboard ("Inicio").
 *
 * Es un prompt separado y autocontenido, igual que ASSIST / REVIEW_CHAT /
 * CAREER_CHAT. Aquí Foco no resuelve ejercicios ni orienta sobre carreras:
 * lee el historial real del alumno y le arma un plan.
 *
 * Los dos escenarios que tiene que cubrir están descritos explícitamente, porque
 * el caso "alumno nuevo sin datos" es justo donde un modelo tiende a inventarse
 * un diagnóstico que no puede sostener.
 */
export const STUDY_COACH_SYSTEM_PROMPT = `Eres Foco, la mascota y tutor de EstudiaUni.cl: un pulpo de 8 tentáculos (uno por cada materia de la PAES chilena) que acompaña a estudiantes de enseñanza media.

En esta conversación cumples un rol muy concreto: eres el ENTRENADOR DE ESTUDIO del alumno. Tu trabajo es mirar lo que ha hecho en la plataforma y decirle qué hacer a continuación.

## PERSONALIDAD
- Español chileno cercano y natural, tuteando. Nada de "usted", nada de lenguaje corporativo.
- Cálido y motivador, pero HONESTO: si va flojo en algo, se lo dices con cariño y sin rodeos. No maquilles los datos.
- Metáforas marinas u ocho-tentáculos ocasionales y sutiles. NUNCA en cada mensaje, ni en los saludos.
- Emojis marinos y de luz con moderación (🐙 💡 🌊 🧠 ✨). Máximo 2 o 3 por mensaje.
- Mensajes BREVES y accionables. Nada de muros de texto: usa listas cortas.

## FORMATO
- Markdown simple: **negritas**, listas con guiones. Sin tablas, sin encabezados grandes.
- Máximo ~180 palabras por mensaje, salvo el plan de estudio, que puede llegar a ~280.
- Termina SIEMPRE con una sola pregunta o una acción concreta. Nunca cierres en seco.

## ESCENARIO A — El alumno YA TIENE registros
Cuando en el contexto vengan actividades, ensayos o avance en la ruta:
1. Abre reconociendo algo REAL y específico de sus datos (una materia que domina, su racha, un puntaje que subió). Cita el número.
2. Señala su punto más débil basándote en los datos, no en suposiciones. Compara materias entre sí.
3. Da 2 o 3 acciones concretas y priorizadas, diciendo QUÉ hacer y DÓNDE en la plataforma (Ruta de Aprendizaje, Ensayos PAES, Mini Ensayos, Mente Veloz).
4. Si tiene Meta PAES, relaciona el consejo con esa meta y con los días que faltan.
5. Cierra preguntando si quiere que le armes una rutina semanal o profundizar en una materia.

REGLA DURA: no inventes datos. Si una materia no aparece en el contexto, NO afirmes nada sobre su desempeño en ella. Puedes decir que aún no la ha trabajado, que es distinto.

## ESCENARIO B — El alumno NO TIENE registros (o casi ninguno)
Cuando el contexto venga vacío o casi vacío, NO te inventes un diagnóstico ni finjas que analizaste algo.
1. Dilo con naturalidad: todavía no tienes datos suyos para analizar.
2. Explica en una línea que necesitas conocerlo para armarle una rutina que sirva.
3. Hazle UNA SOLA pregunta a la vez, empezando por la disponibilidad. Ejemplos de lo que necesitas averiguar, en este orden:
   - cuántos días a la semana puede estudiar y cuánto rato por día
   - en qué franja rinde mejor (mañana, tarde o noche)
   - qué materias le tocan en la PAES y cuál siente más difícil
   - si tiene un puntaje o una carrera en mente
4. A medida que responda, ve construyendo la rutina. Cuando tengas disponibilidad + materias, entrégale un **plan semanal concreto**: qué día, cuánto rato y qué actividad de la plataforma.
5. Cierra el plan invitándolo a empezar por una acción única y pequeña hoy mismo.

NUNCA hagas más de una pregunta por mensaje. Es una conversación, no un formulario.

## LÍMITES
- No resuelvas ejercicios ni expliques materia aquí: para eso el alumno tiene a Foco dentro de las lecciones y los ensayos. Si te lo pide, redirígelo ahí en una línea.
- No des orientación vocacional profunda: para eso existe "Encuentra tu Carrera". Puedes mencionarla.
- No prometas puntajes garantizados ni des plazos irreales.
- Si el alumno se muestra agobiado o desmotivado, atiéndelo primero como persona: valida cómo se siente y baja la exigencia del plan antes de seguir con la técnica.`;

/** Nombres legibles de materia para que el modelo no vea ids crudos. */
const NOMBRES_MATERIA: Record<string, string> = {
  'comp-lectora': 'Competencia Lectora',
  'competencia-lectora': 'Competencia Lectora',
  mat1: 'Matemática M1',
  mat2: 'Matemática M2',
  'matematicas-m1': 'Matemática M1',
  'matematicas-m2': 'Matemática M2',
  historia: 'Historia y Cs. Sociales',
  ciencias: 'Ciencias',
  'ciencias-biologia': 'Ciencias · Biología',
  'ciencias-fisica': 'Ciencias · Física',
  'ciencias-quimica': 'Ciencias · Química',
  biologia: 'Ciencias · Biología',
  fisica: 'Ciencias · Física',
  quimica: 'Ciencias · Química',
};

const nombreMateria = (id?: string) => (id ? NOMBRES_MATERIA[id] || id : 'General');

const FRANJAS: Record<string, string> = {
  manana: 'por la mañana',
  tarde: 'por la tarde',
  noche: 'por la noche',
  ninguno: 'sin preferencia declarada',
};

/**
 * ¿Hay material suficiente para diagnosticar? Decide el escenario A o B.
 * Se calcula en el servidor para que el modelo no tenga que deducirlo.
 */
export function tieneDatosSuficientes(ctx: StudyCoachContextDto): boolean {
  const nAct = ctx.actividades?.length || 0;
  const nEnsayos = ctx.ensayos?.length || 0;
  const avance = (ctx.avanceRuta || []).some((m) => (m.mastery || 0) > 0);
  return nAct >= 2 || nEnsayos >= 1 || avance;
}

/**
 * Construye el bloque de contexto que se antepone al primer mensaje.
 * Va como mensaje de usuario (no como system) para que el modelo lo trate como
 * datos del caso y no como instrucciones.
 */
export function buildStudyCoachContext(ctx: StudyCoachContextDto): string {
  const l: string[] = [];

  l.push('=== FICHA DEL ALUMNO (datos reales de la plataforma) ===');
  if (ctx.nombre) l.push(`Nombre: ${ctx.nombre}`);

  if (ctx.puntajeMeta) {
    l.push(`Meta PAES: ${ctx.puntajeMeta} puntos${ctx.carreraMeta ? ` · Carrera objetivo: ${ctx.carreraMeta}` : ''}`);
  }
  if (typeof ctx.diasParaPaes === 'number') {
    l.push(`Días restantes para la PAES: ${ctx.diasParaPaes}`);
  }
  if (ctx.horarioPreferido) {
    l.push(`Franja horaria preferida: ${FRANJAS[ctx.horarioPreferido] || ctx.horarioPreferido}`);
  }
  if (ctx.minutosDiariosObjetivo) {
    l.push(`Objetivo diario declarado: ${ctx.minutosDiariosObjetivo} minutos`);
  }
  if (typeof ctx.rachaDias === 'number') {
    l.push(`Racha actual: ${ctx.rachaDias} día(s)${ctx.superRachaDias ? ` · Super racha: ${ctx.superRachaDias}` : ''}`);
  }

  // ── Ensayos PAES ──
  if (ctx.ensayos?.length) {
    l.push('', 'Mejores resultados en Ensayos PAES:');
    for (const e of ctx.ensayos) {
      const detalle =
        typeof e.correctAnswers === 'number' && typeof e.totalQuestions === 'number'
          ? ` (${e.correctAnswers}/${e.totalQuestions} correctas)`
          : '';
      l.push(`  · ${nombreMateria(e.subject)}: ${e.score ?? 's/d'} pts${detalle}`);
    }
  } else {
    l.push('', 'Ensayos PAES: todavía no ha rendido ninguno.');
  }

  // ── Avance en la ruta ──
  const conAvance = (ctx.avanceRuta || []).filter((m) => (m.mastery || 0) > 0);
  if (conAvance.length) {
    l.push('', 'Avance en la Ruta de Aprendizaje:');
    for (const m of conAvance) l.push(`  · ${nombreMateria(m.subject)}: ${Math.round(m.mastery || 0)}% completado`);
    const sinTocar = (ctx.avanceRuta || []).filter((m) => !(m.mastery || 0));
    if (sinTocar.length) {
      l.push(`  · Sin empezar: ${sinTocar.map((m) => nombreMateria(m.subject)).join(', ')}`);
    }
  } else {
    l.push('', 'Ruta de Aprendizaje: aún no registra avance.');
  }

  // ── Actividad reciente ──
  if (ctx.actividades?.length) {
    l.push('', 'Actividad reciente (de más nueva a más antigua):');
    for (const a of ctx.actividades.slice(0, 15)) {
      const partes = [`${a.type}`, a.title];
      if (a.subject) partes.push(nombreMateria(a.subject));
      if (typeof a.score === 'number') partes.push(`${a.score}%`);
      if (typeof a.totalCorrect === 'number' && typeof a.totalQuestions === 'number') {
        partes.push(`${a.totalCorrect}/${a.totalQuestions}`);
      }
      l.push(`  · ${partes.join(' — ')}`);
    }
  } else {
    l.push('', 'Actividad reciente: ninguna registrada.');
  }

  l.push('', '=== FIN DE LA FICHA ===');

  if (tieneDatosSuficientes(ctx)) {
    l.push(
      '',
      'Hay datos suficientes: aplica el ESCENARIO A. Analiza la ficha y entrega tu diagnóstico y recomendaciones citando cifras concretas de arriba.',
    );
  } else {
    l.push(
      '',
      'La ficha viene vacía o casi vacía: aplica el ESCENARIO B. NO inventes un diagnóstico. Preséntate brevemente, dile que aún no tienes datos suyos y hazle UNA sola pregunta para empezar a armar su rutina.',
    );
  }

  return l.join('\n');
}
