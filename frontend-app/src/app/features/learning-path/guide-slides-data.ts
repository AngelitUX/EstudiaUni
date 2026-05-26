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