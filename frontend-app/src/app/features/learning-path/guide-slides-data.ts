export interface GuideSlide {
  icon: string;
  title: string;
  bgGradient: string;
  iconBg: string;
  content: string;
  interactive?: boolean;
  quizId?: string;
}

export interface QuizAlt {
  key: string;
  text: string;
  correct: boolean;
  explain: string;
}

export const SLIDE5_QUIZ: QuizAlt[] = [
  { key: 'A', text: 'Porque son los seres más resistentes a condiciones extremas.', correct: false, explain: '❌ Trampa: información real, pero no responde el "por qué" del apodo.' },
  { key: 'B', text: 'Porque miden entre 0,1 y 1,5 milímetros.', correct: false, explain: '❌ Trampa: dato numérico que desvía la atención.' },
  { key: 'C', text: 'Debido a su aspecto físico y su hábitat en zonas de humedad.', correct: true, explain: '✅ Paráfrasis: "aspecto físico" = "apariencia", "zonas de humedad" = "lugares húmedos".' },
];

export const SLIDE_QUIZ2: QuizAlt[] = [
  { key: 'A', text: 'Modificar las moléculas de agua.', correct: false, explain: '❌ El texto no habla de modificar moléculas.' },
  { key: 'B', text: 'Eliminar impurezas y microorganismos para hacerla segura.', correct: true, explain: '✅ Paráfrasis: "contaminantes" = "impurezas", "patógenos" = "microorganismos", "apta para consumo" = "segura".' },
  { key: 'C', text: 'Añadirle minerales esenciales para la salud.', correct: false, explain: '❌ Inventa información que el texto no contiene.' },
];

const P = 'var(--accent-primary)';

// ─── INTERPRETAR: Quiz Data ───
export const INTERP_QUIZ1: QuizAlt[] = [
  { key: 'A', text: 'Que el río es peligroso para los habitantes.', correct: false, explain: '❌ El texto no menciona peligro físico. Es una lectura demasiado literal.' },
  { key: 'B', text: 'Que la contaminación ha destruido la vida natural del río.', correct: true, explain: '✅ Inferencia: "dejó de cantar" = ya no tiene vida (peces, corrientes), y "gris" = contaminado. El texto sugiere sin decirlo explícitamente.' },
  { key: 'C', text: 'Que el río cambió de color por razones climáticas.', correct: false, explain: '❌ El texto no menciona clima. "Gris" es una metáfora de deterioro ambiental.' },
];

export const INTERP_QUIZ2: QuizAlt[] = [
  { key: 'A', text: 'Investigar.', correct: false, explain: '❌ "Dilucidar" no es simplemente investigar, sino llegar a entender algo que estaba confuso.' },
  { key: 'B', text: 'Aclarar o resolver algo confuso.', correct: true, explain: '✅ En contexto, "dilucidar las causas" = aclarar/resolver qué provocó el fenómeno. La clave está en que el texto dice "aún no se comprenden del todo".' },
  { key: 'C', text: 'Eliminar las causas del problema.', correct: false, explain: '❌ "Dilucidar" no significa eliminar. Cuidado con confundir entender algo con solucionarlo.' },
];

// ─── EVALUAR: Quiz Data ───
export const EVALUAR_QUIZ1: QuizAlt[] = [
  { key: 'A', text: 'Un Hecho', correct: false, explain: 'Contiene juicios de valor ("lamentable", "peor")' },
  { key: 'B', text: 'Una Opinión', correct: true, explain: '¡Exacto! El autor califica la decisión de "lamentable" y "la peor", lo que revela su perspectiva subjetiva.' }
];

export const EVALUAR_QUIZ2: QuizAlt[] = [
  { key: 'A', text: 'Informar sobre un proyecto de ley', correct: false, explain: 'El texto no es neutral, tiene una fuerte carga valorativa.' },
  { key: 'B', text: 'Criticar una decisión', correct: true, explain: '¡Correcto! Usa términos como "destrozar" y "terrible" para manifestar su claro rechazo a la medida.' },
  { key: 'C', text: 'Describir la plaza', correct: false, explain: 'Su propósito principal es quejarse de la decisión, no describir el lugar.' }
];

export const LOCALIZAR_SLIDES: GuideSlide[] = [

  // ─── 1: QUÉ ES ───
  {
    icon: '🔍', title: '¿Qué significa "Localizar"?',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>Según el DEMRE, <strong>Localizar</strong> consiste en <span class="hl">identificar, reconocer y extraer información</span> que está escrita de forma textual (explícita) en la lectura.</p>
      <p>Tu misión es simple:</p>
      <div class="mini-cards">
        <div class="mc red">🚫 NO adivinar</div>
        <div class="mc red">🚫 NO deducir</div>
        <div class="mc red">🚫 NO opinar</div>
        <div class="mc green">✅ SÍ buscar el dato exacto</div>
      </div>
    `
  },

  // ─── 2: REGLA DE ORO ───
  {
    icon: '💡', title: 'La Regla de Oro',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: `
      <div class="big-rule">
        <p>"Si la respuesta <strong>no está en el texto</strong> — ya sea con las mismas palabras o con sinónimos — entonces es una <span class="hl-red">alternativa incorrecta</span>."</p>
      </div>
      <p>Esto distingue a Localizar de <em>Interpretar</em> (donde sí deduces) y de <em>Evaluar</em> (donde juzgas). Aquí solo <strong>buscas</strong>.</p>
      <div class="callout">📊 Esta habilidad representa el <strong>~30% de las preguntas</strong> de Competencia Lectora. Dominarla = asegurar puntos "fáciles".</div>
    `
  },

  // ─── 3: DOS CARAS – LITERAL ───
  {
    icon: '🟢', title: 'Nivel 1: Coincidencia Literal',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>La forma más <strong>básica</strong> de localización. La pregunta y la respuesta usan <span class="hl">exactamente las mismas palabras</span> que el texto.</p>
      <div class="example-box">
        <div class="ex-label">📄 Texto:</div>
        <p class="ex-text">"Chile fue fundado el <strong>12 de febrero de 1541</strong>."</p>
        <div class="ex-label">❓ Pregunta:</div>
        <p class="ex-text">¿Cuándo fue fundado Chile?</p>
        <div class="ex-label answer">✅ Respuesta:</div>
        <p class="ex-text">"El 12 de febrero de 1541." <em>(mismas palabras)</em></p>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.75rem">⚡ Dificultad: <strong>Baja</strong> — Estas son las preguntas más rápidas de responder.</p>
    `
  },

  // ─── 4: DOS CARAS – PARÁFRASIS ───
  {
    icon: '🟠', title: 'Nivel 2: Sinónimos y Paráfrasis',
    bgGradient: 'linear-gradient(135deg, rgba(255,150,0,0.06), rgba(255,150,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ff9600, #e07800)',
    content: `
      <p>Aquí el DEMRE <strong>cambia las palabras</strong>. La respuesta dice lo mismo que el texto pero con sinónimos o reescrituras.</p>
      <div class="example-box">
        <div class="ex-label">📄 Texto:</div>
        <p class="ex-text">"La <strong>sequía prolongada</strong> afectó los cultivos."</p>
        <div class="ex-label">❓ Pregunta:</div>
        <p class="ex-text">¿Qué perjudicó la producción agrícola?</p>
        <div class="ex-label answer">✅ Respuesta:</div>
        <p class="ex-text">"La falta de lluvias extendida." <em>(paráfrasis)</em></p>
      </div>
      <div class="callout-gold">⚠️ <strong>La mayoría de las preguntas PAES</strong> son de este tipo. Es la "trampa" más frecuente.</div>
    `
  },

  // ─── 5: ANATOMÍA PARÁFRASIS ───
  {
    icon: '🎭', title: 'Anatomía de la Paráfrasis',
    bgGradient: 'linear-gradient(135deg, rgba(255,150,0,0.06), rgba(255,150,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ff9600, #e07800)',
    content: `
      <p>La paráfrasis es <span class="hl">el mismo mensaje con otra estructura</span>. Veamos cómo el DEMRE "disfraza" la información:</p>
      <div class="paes-text">📖 "Las <em>fuertes precipitaciones</em> provocaron el <em>colapso</em> del <em>puente principal</em> el día <em>martes</em>."</div>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">Fuertes precipitaciones</span><span class="arrow-icon">➜</span><span class="arrow-to">Lluvia intensa</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Colapso</span><span class="arrow-icon">➜</span><span class="arrow-to">Destrucción</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Puente principal</span><span class="arrow-icon">➜</span><span class="arrow-to">Principal vía de conexión</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Martes</span><span class="arrow-icon">➜</span><span class="arrow-to">Segundo día de la semana</span></div>
      </div>
    `
  },

  // ─── 6: TIP SINÓNIMOS ───
  {
    icon: '🧠', title: 'Entrena tu cerebro para sinónimos',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Cada vez que leas una palabra clave en un texto, <strong>pregúntate</strong>: ¿de qué otra forma podrían decir esto?</p>
      <div class="synonym-grid">
        <div class="syn-pair"><span class="syn-a">Investigación</span><span class="syn-arrow">↔</span><span class="syn-b">Estudio</span></div>
        <div class="syn-pair"><span class="syn-a">Incremento</span><span class="syn-arrow">↔</span><span class="syn-b">Aumento</span></div>
        <div class="syn-pair"><span class="syn-a">Propósito</span><span class="syn-arrow">↔</span><span class="syn-b">Objetivo</span></div>
        <div class="syn-pair"><span class="syn-a">Escasez</span><span class="syn-arrow">↔</span><span class="syn-b">Falta</span></div>
        <div class="syn-pair"><span class="syn-a">Consecuencia</span><span class="syn-arrow">↔</span><span class="syn-b">Resultado</span></div>
        <div class="syn-pair"><span class="syn-a">Controversia</span><span class="syn-arrow">↔</span><span class="syn-b">Polémica</span></div>
      </div>
      <div class="callout">💡 <strong>Tip PAES:</strong> Mientras más sinónimos domines, más rápido detectarás la alternativa correcta.</div>
    `
  },

  // ─── 7: PASO 1 ───
  {
    icon: '1️⃣', title: 'Paso 1: Identifica la "huella digital"',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>Lee la pregunta y subraya mentalmente los <span class="hl">nombres propios, fechas, cifras o conceptos técnicos</span>.</p>
      <p>Estas palabras son tu <strong>"huella digital"</strong> porque son difíciles de cambiar por sinónimos.</p>
      <div class="example-box">
        <div class="ex-label">❓ Pregunta:</div>
        <p class="ex-text">¿En qué año fue fundada la <span class="hl">Biblioteca Nacional</span> de Chile?</p>
        <div class="ex-label">🔑 Huella digital:</div>
        <p class="ex-text"><strong>"Biblioteca Nacional"</strong> + <strong>"año"</strong> + <strong>"fundada"</strong></p>
      </div>
      <p>Ahora sabes exactamente qué buscar en el texto. No leas todo: busca estas palabras.</p>
    `
  },

  // ─── 8: PASO 2 ───
  {
    icon: '2️⃣', title: 'Paso 2: Haz Scanning (Escaneo)',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p><strong>No leas el texto completo otra vez.</strong> Desliza la vista rápidamente buscando exclusivamente tu "huella digital".</p>
      <div class="scan-demo">
        <p class="scan-line dim">En el centro de Santiago se encuentran diversos edificios históricos...</p>
        <p class="scan-line dim">Entre ellos, museos, teatros y centros culturales que datan...</p>
        <p class="scan-line found">La <span class="hl">Biblioteca Nacional</span> fue <span class="hl">fundada</span> en <span class="hl">1813</span>, siendo una de las...</p>
        <p class="scan-line dim">Actualmente alberga más de 7 millones de documentos...</p>
      </div>
      <div class="callout-gold">👁️ <strong>Tu ojo se detiene solo cuando encuentra la coincidencia.</strong> Así ahorras tiempo valioso para preguntas más difíciles.</div>
    `
  },

  // ─── 9: PASO 3 ───
  {
    icon: '3️⃣', title: 'Paso 3: Lee el contexto local',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>Una vez que encuentres la palabra, <strong>detente</strong>. Lee solo la <span class="hl">oración anterior</span> y la <span class="hl">oración posterior</span> para confirmar.</p>
      <div class="context-visual">
        <div class="ctx-line before">↑ Oración anterior (contexto)</div>
        <div class="ctx-line target">→ <strong>ORACIÓN CON TU DATO</strong> ←</div>
        <div class="ctx-line after">↓ Oración posterior (contexto)</div>
      </div>
      <div class="callout">⏱️ <strong>Resultado:</strong> Con esta técnica de 3 pasos, respondes preguntas de localización en <strong>menos de 1 minuto</strong>.</div>
    `
  },

  // ─── 10: ERRORES COMUNES ───
  {
    icon: '🚨', title: 'Errores comunes (evítalos)',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    content: `
      <div class="error-list">
        <div class="error-item"><span class="err-x">✗</span><div><strong>Elegir info de otro párrafo</strong><p>El DEMRE pone alternativas con datos reales pero de otra parte del texto.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Confundir "parecido" con "correcto"</strong><p>Una alternativa puede usar palabras similares pero cambiar el significado.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Agregar lo que "tú sabes"</strong><p>Si el dato no está en el texto, no es la respuesta. Aunque sea verdadero en la vida real.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Leer todo el texto para cada pregunta</strong><p>Usa scanning. Leer todo de nuevo es una pérdida de tiempo innecesaria.</p></div></div>
      </div>
    `
  },

  // ─── 11: EJEMPLO PAES 1 (interactivo) ───
  {
    icon: '📝', title: 'Ejercicio 1: Texto científico', interactive: true, quizId: 'quiz1',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.04), rgba(239,68,68,0.04))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p><strong>¡Elige tu respuesta!</strong></p>
      <div class="paes-text">📖 "Los <strong>tardígrados</strong> son los seres vivos más resistentes a condiciones extremas. Estos diminutos invertebrados, de entre 0,1 y 1,5 mm, son comúnmente conocidos como <strong>"osos de agua"</strong> por su <em>apariencia</em> y porque <em>viven en lugares húmedos</em> como musgos."</div>
      <p>❓ ¿Por qué a los tardígrados se les conoce como "osos de agua"?</p>
    `
  },

  // ─── 12: EJEMPLO PAES 2 (interactivo) ───
  {
    icon: '📝', title: 'Ejercicio 2: Texto informativo', interactive: true, quizId: 'quiz2',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.04), rgba(88,204,2,0.04))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p><strong>¡Inténtalo de nuevo!</strong></p>
      <div class="paes-text">📖 "La <strong>potabilización</strong> es el proceso mediante el cual se eliminan <em>contaminantes</em> y <em>patógenos</em> del agua, haciéndola <em>apta para el consumo</em> humano. Este proceso incluye etapas de filtración, sedimentación y cloración."</div>
      <p>❓ ¿En qué consiste la potabilización según el texto?</p>
    `
  },

  // ─── 13: CTA FINAL ───
  {
    icon: '🚀', title: '¡Estás listo para el desafío!',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.08), rgba(255,200,0,0.06))',
    iconBg: 'linear-gradient(135deg, #ffc800, #ff9600)',
    content: `
      <div class="cta-inner">
        <span class="big-icon">🏆</span>
        <p>Ya dominas la teoría y la técnica. Ahora entrena en la ruta con textos reales.</p>
        <div class="cta-checklist">
          <div class="cta-check"><span>✓</span> Definición de localizar</div>
          <div class="cta-check"><span>✓</span> Literal vs paráfrasis</div>
          <div class="cta-check"><span>✓</span> Técnica de escaneo en 3 pasos</div>
          <div class="cta-check"><span>✓</span> Errores comunes</div>
          <div class="cta-check"><span>✓</span> 2 ejercicios completados</div>
        </div>
      </div>
    `
  },
];

// ═══════════════════════════════════════════════════════════
// ─── CAPÍTULO 2: INTERPRETAR ─────────────────────────────
// ═══════════════════════════════════════════════════════════

export const INTERPRETAR_SLIDES: GuideSlide[] = [

  // ─── 1: QUÉ ES ───
  {
    icon: '🔎', title: '¿Qué significa "Interpretar"?',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Según el DEMRE, <strong>Interpretar</strong> consiste en <span class="hl">inferir, deducir y comprender información implícita</span> que NO está escrita literalmente en el texto.</p>
      <p>Tu misión ahora es más compleja:</p>
      <div class="mini-cards">
        <div class="mc red">🚫 NO buscar lo literal</div>
        <div class="mc red">🚫 NO inventar datos</div>
        <div class="mc green">✅ SÍ deducir a partir de pistas</div>
        <div class="mc green">✅ SÍ entender el significado profundo</div>
      </div>
    `
  },

  // ─── 2: REGLA DE ORO ───
  {
    icon: '💡', title: 'La Regla de Oro de Interpretar',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: `
      <div class="big-rule">
        <p>"Si la respuesta <strong>está escrita literalmente</strong> en el texto, probablemente <span class="hl-red">no es la correcta</span> en una pregunta de interpretar. Busca la que <strong>deduce</strong> a partir de lo escrito."</p>
      </div>
      <p>Esto es lo opuesto a <em>Localizar</em>. Aquí <strong>no copias</strong> del texto; <strong>construyes</strong> significado a partir de él.</p>
      <div class="callout">📊 Esta habilidad representa el <strong>~40% de las preguntas</strong> de Competencia Lectora. Es la más evaluada.</div>
    `
  },

  // ─── 3: INFERIR ───
  {
    icon: '🧩', title: 'Nivel 1: Inferir lo implícito',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>El texto <strong>sugiere</strong> algo sin decirlo directamente. Tu trabajo es leer las <span class="hl">marcas textuales</span> que te llevan a la conclusión.</p>
      <div class="example-box">
        <div class="ex-label">📄 Texto:</div>
        <p class="ex-text">"Al llegar a casa, Ana dejó caer su mochila, se desplomó en el sofá y ni siquiera encendió la luz."</p>
        <div class="ex-label">❓ Pregunta:</div>
        <p class="ex-text">¿Qué se puede inferir sobre el estado de Ana?</p>
        <div class="ex-label answer">✅ Respuesta:</div>
        <p class="ex-text">"Está agotada." <em>(no lo dice, pero lo sugiere)</em></p>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.75rem">⚡ Clave: Las acciones de Ana (dejar caer, desplomarse, no encender la luz) son <strong>marcas textuales</strong> de cansancio.</p>
    `
  },

  // ─── 4: VOCABULARIO EN CONTEXTO ───
  {
    icon: '📖', title: 'Nivel 2: Vocabulario en Contexto',
    bgGradient: 'linear-gradient(135deg, rgba(255,150,0,0.06), rgba(255,150,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ff9600, #e07800)',
    content: `
      <p>En la PAES, una pregunta clásica es: <em>"En el contexto del párrafo X, ¿qué significa la palabra Y?"</em></p>
      <p>La misma palabra puede tener <span class="hl">significados completamente distintos</span> según el contexto:</p>
      <div class="example-box">
        <div class="ex-label">📄 Contexto 1:</div>
        <p class="ex-text">"El <strong>banco</strong> cerró a las 14:00." → <em>Institución financiera</em></p>
        <div class="ex-label">📄 Contexto 2:</div>
        <p class="ex-text">"Se sentó en el <strong>banco</strong> del parque." → <em>Asiento</em></p>
      </div>
      <div class="callout-gold">⚠️ <strong>Trampa PAES:</strong> Te ponen el significado más conocido de la palabra como alternativa, pero en ESE contexto significa otra cosa.</div>
    `
  },

  // ─── 5: TÉCNICA DE SUSTITUCIÓN ───
  {
    icon: '🔄', title: 'Técnica de Sustitución',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Para resolver vocabulario en contexto, usa la <span class="hl">técnica de sustitución</span>: reemplaza la palabra por cada alternativa y fíjate cuál <strong>mantiene el sentido</strong> de la oración.</p>
      <div class="example-box">
        <div class="ex-label">📄 Texto:</div>
        <p class="ex-text">"La medida fue <strong>drástica</strong> pero necesaria."</p>
        <div class="ex-label">❓ ¿Qué significa "drástica"?</div>
      </div>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">A) Violenta</span><span class="arrow-icon">➜</span><span class="arrow-to">"...violenta pero necesaria" ❌ no calza</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">B) Radical</span><span class="arrow-icon">➜</span><span class="arrow-to">"...radical pero necesaria" ✅ mantiene el sentido</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">C) Rápida</span><span class="arrow-icon">➜</span><span class="arrow-to">"...rápida pero necesaria" ❌ cambia la idea</span></div>
      </div>
    `
  },

  // ─── 6: FIGURAS RETÓRICAS ───
  {
    icon: '🎭', title: 'Figuras Retóricas Frecuentes',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'rgba(239,68,68,0.15)',
    content: `
      <p>A veces, el autor usa el lenguaje de forma no literal. Las figuras más comunes en la PAES son:</p>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">Metáfora</span><span class="arrow-icon">➜</span><span class="arrow-to">Llamar a algo por otro nombre ("las perlas de tu boca")</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Ironía</span><span class="arrow-icon">➜</span><span class="arrow-to">Decir lo contrario a lo que se piensa</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Hipérbole</span><span class="arrow-icon">➜</span><span class="arrow-to">Exageración ("me muero de hambre")</span></div>
      </div>
    `
  },

  // ─── 7: RELACIONES LÓGICAS ───
  {
    icon: '🔗', title: 'Relaciones Lógicas entre Ideas',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>El DEMRE pregunta frecuentemente: <em>"¿Qué relación existe entre el párrafo X y el Y?"</em></p>
      <p>Aprende a detectar estas <span class="hl">relaciones lógicas</span>:</p>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">Causa → Efecto</span><span class="arrow-icon">🔑</span><span class="arrow-to">"debido a", "por lo tanto", "en consecuencia"</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Problema → Solución</span><span class="arrow-icon">🔑</span><span class="arrow-to">"ante esto", "la medida propuesta", "para resolver"</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Comparación</span><span class="arrow-icon">🔑</span><span class="arrow-to">"a diferencia de", "en contraste", "por el contrario"</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">General → Particular</span><span class="arrow-icon">🔑</span><span class="arrow-to">"por ejemplo", "en particular", "un caso es"</span></div>
      </div>
      <div class="callout">💡 <strong>Tip:</strong> Los conectores son tus mejores aliados para identificar la relación entre párrafos.</div>
    `
  },

  // ─── 8: PASO 1 ───
  {
    icon: '1️⃣', title: 'Paso 1: Lee la pregunta y detecta qué pide',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>Antes de buscar en el texto, <strong>identifica el tipo de pregunta</strong>:</p>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">"¿Qué se puede inferir...?"</span><span class="arrow-icon">➜</span><span class="arrow-to">Busca lo implícito</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">"¿Qué significa X en contexto?"</span><span class="arrow-icon">➜</span><span class="arrow-to">Usa sustitución</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">"¿Qué relación hay entre...?"</span><span class="arrow-icon">➜</span><span class="arrow-to">Busca conectores</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">"¿Cuál es el sentido de la expresión...?"</span><span class="arrow-icon">➜</span><span class="arrow-to">Interpreta lo figurado</span></div>
      </div>
      <div class="callout-gold">👁️ <strong>Saber qué pide la pregunta te ahorra tiempo</strong> porque ya sabes qué técnica aplicar.</div>
    `
  },

  // ─── 9: PASO 2 ───
  {
    icon: '2️⃣', title: 'Paso 2: Busca las marcas textuales',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Las <span class="hl">marcas textuales</span> son las pistas que el autor deja en el texto para que tú <strong>deduzcas</strong> la respuesta.</p>
      <div class="scan-demo">
        <p class="scan-line dim">El proyecto de ley fue presentado con gran ceremonia...</p>
        <p class="scan-line found">Sin embargo, <span class="hl">apenas un tercio</span> de los legisladores asistió a la sesión, y los presentes mostraron <span class="hl">evidente desinterés</span>.</p>
        <p class="scan-line dim">El portavoz destacó el carácter "histórico" de la propuesta.</p>
      </div>
      <p style="margin-top:0.75rem;font-size:0.88rem;color:var(--text-secondary)">🔍 <strong>Marcas:</strong> "apenas un tercio" + "evidente desinterés" = <em>se puede inferir que el proyecto no cuenta con respaldo político real</em>.</p>
    `
  },

  // ─── 10: PASO 3 ───
  {
    icon: '3️⃣', title: 'Paso 3: Descarta lo literal y lo inventado',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>Elimina alternativas usando estos <span class="hl">filtros</span>:</p>
      <div class="error-list">
        <div class="error-item"><span class="err-x">✗</span><div><strong>Demasiado literal</strong><p>Si repite exactamente lo que dice el texto, es de LOCALIZAR, no de interpretar.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Información inventada</strong><p>Si agrega datos que el texto no sugiere ni implica de ninguna forma.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Exageración o reducción</strong><p>Si la alternativa dice "siempre", "nunca" o "todos" y el texto no es tan absoluto.</p></div></div>
      </div>
      <div class="callout">⏱️ <strong>Resultado:</strong> Con estos 3 pasos, respondes preguntas de interpretación en <strong>menos de 2 minutos</strong>.</div>
    `
  },

  // ─── 11: ERRORES COMUNES ───
  {
    icon: '🚨', title: 'Errores comunes (evítalos)',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    content: `
      <div class="error-list">
        <div class="error-item"><span class="err-x">✗</span><div><strong>Confundir "inferir" con "adivinar"</strong><p>Inferir requiere evidencia textual. No estás adivinando, estás deduciendo con pistas.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Elegir la respuesta literal</strong><p>En interpretar, la respuesta casi nunca usa las mismas palabras del texto.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Proyectar tu opinión personal</strong><p>No importa lo que tú pienses. Importa lo que el texto permite deducir.</p></div></div>
        <div class="error-item"><span class="err-x">✗</span><div><strong>Ignorar los conectores</strong><p>"Sin embargo", "por lo tanto", "a pesar de"... son señales cruciales para interpretar relaciones.</p></div></div>
      </div>
    `
  },

  // ─── 12: EJEMPLO PAES 1 (interactivo) ───
  {
    icon: '📝', title: 'Ejercicio 1: Inferencia', interactive: true, quizId: 'interp_quiz1',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.04), rgba(133,92,214,0.04))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p><strong>¡Pon a prueba tu inferencia!</strong></p>
      <div class="paes-text">📖 "El río que antes <em>cantaba</em> entre las piedras ahora arrastra un silencio <em>gris</em>. Los viejos pescadores ya no bajan a la orilla; dicen que el agua <em>olvidó</em> a los peces."</div>
      <p>❓ ¿Qué se puede inferir sobre la situación del río?</p>
    `
  },

  // ─── 13: EJEMPLO PAES 2 (interactivo) ───
  {
    icon: '📝', title: 'Ejercicio 2: Vocabulario en contexto', interactive: true, quizId: 'interp_quiz2',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.04), rgba(255,200,0,0.04))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p><strong>¡Usa la técnica de sustitución!</strong></p>
      <div class="paes-text">📖 "Los científicos buscan <strong>dilucidar</strong> las causas del fenómeno, que aún no se comprenden del todo."</div>
      <p>❓ En el contexto del fragmento, ¿qué significa "dilucidar"?</p>
    `
  },

  // ─── 14: CTA FINAL ───
  {
    icon: '🚀', title: '¡Estás listo para interpretar!',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.08), rgba(88,204,2,0.06))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <div class="cta-inner">
        <span class="big-icon">🏆</span>
        <p>Ya dominas la teoría y las técnicas de interpretación. Ahora entrena con textos reales en la ruta.</p>
        <div class="cta-checklist">
          <div class="cta-check"><span>✓</span> Definición de interpretar</div>
          <div class="cta-check"><span>✓</span> Inferencia vs localización</div>
          <div class="cta-check"><span>✓</span> Vocabulario en contexto</div>
          <div class="cta-check"><span>✓</span> Figuras retóricas</div>
          <div class="cta-check"><span>✓</span> Relaciones lógicas</div>
          <div class="cta-check"><span>✓</span> Método de 3 pasos</div>
          <div class="cta-check"><span>✓</span> 2 ejercicios completados</div>
        </div>
      </div>
    `
  },
];

export const EVALUAR_SLIDES: GuideSlide[] = [
  // ─── 1: QUÉ ES EVALUAR ───
  {
    icon: '⚖️', title: '¿Qué significa "Evaluar"?',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'rgba(239,68,68,0.15)',
    content: `
### El Nivel Más Profundo de Comprensión

**Evaluar** no significa decir si el texto te gustó o no. En la PAES, significa **juzgar críticamente** el texto.

Aquí asumes el rol de un juez o un crítico:
- **Calidad de la información:** ¿Es un dato duro o una simple opinión?
- **El emisor:** ¿Qué tono usa el autor? ¿Qué intención esconde?
- **Forma y recursos:** ¿Por qué incluyó un gráfico? ¿Por qué usó cursivas?

¡Veamos cómo dominar esta habilidad! 🚀
    `
  },
  // ─── 2: HECHOS VS OPINIONES ───
  {
    icon: '🧐', title: 'Hechos vs. Opiniones',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))',
    iconBg: 'rgba(245,158,11,0.15)',
    content: `
### La base de la crítica

Para evaluar la calidad de la información, primero debes diferenciar lo **objetivo** de lo **subjetivo**.

1. **Hechos:** Datos comprobables, eventos que sucedieron, fechas.
   *Ej: "El parque forestal mide 170.000 metros cuadrados".*
2. **Opiniones:** Juicios de valor, creencias, emociones. 
   *Ej: "El parque forestal es el lugar más hermoso de Santiago".*

**🔍 Pista PAES:** Busca marcas de subjetividad como adjetivos valorativos (*lamentable, increíble, terrible*).
    `
  },
  // ─── 3: QUIZ 1 ───
  {
    icon: '🎮', title: 'Minijuego: ¿Hecho u Opinión?',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'rgba(133,92,214,0.15)',
    interactive: true,
    quizId: 'evaluar_quiz1',
    content: `
Lee el siguiente fragmento:

> *"Es una situación lamentable. La decisión de construir la autopista ha sido, sin duda, la peor decisión de la última década."*

¿Este fragmento es principalmente un Hecho o una Opinión?
    `
  },
  // ─── 4: INTENCIÓN Y TONO ───
  {
    icon: '🎭', title: 'Intención y Tono del Autor',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))',
    iconBg: 'rgba(16,185,129,0.15)',
    content: `
### La "Voz" detrás del texto

El **propósito** (intención) responde al **para qué** se escribió el texto: ¿Informar, Persuadir, Entretener, Criticar?

El **tono** es la actitud emocional o intelectual del autor:
- **Objetivo / Neutro:** Solo da información, sin emociones.
- **Irónico:** Dice algo, pero da a entender lo contrario (suele ser burlesco).
- **Crítico:** Juzga negativamente una situación.
- **Pesimista / Optimista:** Visión negativa o positiva del futuro.

*Si el texto usa adjetivos fuertes, el tono NO es objetivo.*
    `
  },
  // ─── 5: QUIZ 2 ───
  {
    icon: '🧠', title: 'Minijuego: Detecta la Intención',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(236,72,153,0.02))',
    iconBg: 'rgba(236,72,153,0.15)',
    interactive: true,
    quizId: 'evaluar_quiz2',
    content: `
Lee el siguiente fragmento:

> *"No entiendo cómo las autoridades aprobaron destrozar la histórica plaza. Es una decisión terrible que atenta contra el patrimonio de nuestra ciudad y debemos detenerla."*

¿Cuál es la intención principal del autor?
    `
  },
  // ─── 6: RECURSOS DEL TEXTO ───
  {
    icon: '📐', title: 'Evaluar Forma y Recursos',
    bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(59,130,246,0.02))',
    iconBg: 'rgba(59,130,246,0.15)',
    content: `
### ¿Por qué lo escribió así?

La PAES te pedirá evaluar la **utilidad** de ciertos recursos formales en el texto:

- **¿Para qué se usan las comillas ("")?** Pueden indicar una cita textual, ironía, o una palabra de otro idioma o jerga.
- **¿Para qué se incluye un gráfico o tabla?** Generalmente para respaldar con evidencia empírica una afirmación hecha en el texto.
- **¿Para qué se usa letra cursiva?** Para destacar un extranjerismo, el título de una obra o darle énfasis a un concepto.

Nunca están ahí "por accidente". Todo recurso tiene un propósito.
    `
  },
  // ─── 7: CONTEXTO ───
  {
    icon: '🌐', title: 'Relacionar con el Contexto',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'rgba(133,92,214,0.15)',
    content: `
### El mundo fuera del papel

Un texto no existe en el vacío. Evaluar también implica relacionar la obra con su **contexto de producción**:
- **Época y lugar:** ¿Cuándo y dónde se escribió?
- **Corriente ideológica:** ¿Cómo pensaba la sociedad de ese momento?

Si lees una novela del siglo XIX, debes evaluar la actitud de los personajes considerando los valores morales de **esa época**, no de la actual.
    `
  },
  // ─── 8: CIERRE ───
  {
    icon: '🏆', title: '¡Misión Cumplida!',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'rgba(239,68,68,0.15)',
    content: `
### ¡Ya eres un experto crítico!

**Has dominado la habilidad de Evaluar.**
Ya sabes diferenciar hechos de opiniones, captar el tono irónico, y juzgar la validez de la información.

Próximo paso: Pon a prueba tu radar crítico en los minijuegos y desafíos de este capítulo.
    `
  }
];
