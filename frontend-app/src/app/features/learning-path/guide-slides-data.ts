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
  { key: 'A', text: 'Porque son los seres mÃ¡s resistentes a condiciones extremas.', correct: false, explain: 'âŒ Trampa: informaciÃ³n real, pero no responde el "por quÃ©" del apodo.' },
  { key: 'B', text: 'Porque miden entre 0,1 y 1,5 milÃ­metros.', correct: false, explain: 'âŒ Trampa: dato numÃ©rico que desvÃ­a la atenciÃ³n.' },
  { key: 'C', text: 'Debido a su aspecto fÃ­sico y su hÃ¡bitat en zonas de humedad.', correct: true, explain: 'âœ… ParÃ¡frasis: "aspecto fÃ­sico" = "apariencia", "zonas de humedad" = "lugares hÃºmedos".' },
];

export const SLIDE_QUIZ2: QuizAlt[] = [
  { key: 'A', text: 'Modificar las molÃ©culas de agua.', correct: false, explain: 'âŒ El texto no habla de modificar molÃ©culas.' },
  { key: 'B', text: 'Eliminar impurezas y microorganismos para hacerla segura.', correct: true, explain: 'âœ… ParÃ¡frasis: "contaminantes" = "impurezas", "patÃ³genos" = "microorganismos", "apta para consumo" = "segura".' },
  { key: 'C', text: 'AÃ±adirle minerales esenciales para la salud.', correct: false, explain: 'âŒ Inventa informaciÃ³n que el texto no contiene.' },
  { key: 'C', text: 'AÃ±adirle minerales esenciales para la salud.', correct: false, explain: 'â Œ Inventa informaciÃ³n que el texto no contiene.' },
];

const P = 'var(--accent-primary)';

export const CAP1_SUMMARY_SLIDES: GuideSlide[] = [
  {
    icon: '🗺️', title: '¡Bienvenido al Capítulo 1!',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.08), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>Estás a punto de comenzar tu entrenamiento en la habilidad de <span class="hl">Localizar</span>. Esta es la base de todo lo que haremos en Competencia Lectora.</p>
      <div class="callout">
        🎯 <strong>Tu misión principal:</strong> Aprender a rastrear y extraer información que está escrita de forma <strong>explícita</strong> en el texto, sin caer en trampas.
      </div>
      <p>Puede sonar fácil, pero el DEMRE es experto en camuflar las respuestas. ¡Aquí aprenderás a desarmar esos trucos!</p>
    `
  },
  {
    icon: '🧠', title: 'Lo que dominarás aquí',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.08), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Durante este capítulo, te guiaremos paso a paso a través de estos pilares:</p>
      <div class="mini-cards">
        <div class="mc blue">1️⃣ <strong>El concepto:</strong> Qué es Localizar y por qué está prohibido deducir.</div>
        <div class="mc green">2️⃣ <strong>Paráfrasis:</strong> Cómo identificar la misma idea escrita con otras palabras.</div>
        <div class="mc red" style="grid-column: 1 / -1;">3️⃣ <strong>Trampas:</strong> Distractores numéricos y palabras absolutas.</div>
        <div class="mc blue">4️⃣ <strong>Técnica ninja:</strong> El arte de la Huella y el Escaneo visual.</div>
      </div>
    `
  },
  {
    icon: '⚡', title: '¿Por qué es tan importante?',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: `
      <p>Las preguntas de Localizar representan <span class="hl">cerca del 30% de la prueba PAES</span>. Son los puntos más rápidos y seguros de obtener si sabes cómo buscar.</p>
      <div class="callout-gold">
        ⚠️ <strong>Atención:</strong> No puedes avanzar a interpretar textos complejos o evaluar actitudes si primero no sabes encontrar los datos duros.
      </div>
      <p>¡Prepárate para entrenar tu ojo de águila y asegurar esos puntos! 🦅</p>
    `
  }
];

export const LOCALIZAR_SLIDES: GuideSlide[] = [

  // ─── 1: QUÉ ES ───
  {
    icon: '🔍', title: '¿Qué significa "Localizar"?',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>SegÃºn el DEMRE, <strong>Localizar</strong> consiste en <span class="hl">identificar, reconocer y extraer informaciÃ³n</span> que estÃ¡ escrita de forma textual (explÃ­cita) en la lectura.</p>
      <p>Tu misiÃ³n es simple:</p>
      <div class="mini-cards">
        <div class="mc red">ðŸš« NO adivinar</div>
        <div class="mc red">ðŸš« NO deducir</div>
        <div class="mc red">ðŸš« NO opinar</div>
        <div class="mc green">âœ… SÃ buscar el dato exacto</div>
      </div>
    `
  },

  // â”€â”€â”€ 2: REGLA DE ORO â”€â”€â”€
  {
    icon: 'ðŸ’¡', title: 'La Regla de Oro',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: `
      <div class="big-rule">
        <p>"Si la respuesta <strong>no estÃ¡ en el texto</strong> â€” ya sea con las mismas palabras o con sinÃ³nimos â€” entonces es una <span class="hl-red">alternativa incorrecta</span>."</p>
      </div>
      <p>Esto distingue a Localizar de <em>Interpretar</em> (donde sÃ­ deduces) y de <em>Evaluar</em> (donde juzgas). AquÃ­ solo <strong>buscas</strong>.</p>
      <div class="callout">ðŸ“Š Esta habilidad representa el <strong>~30% de las preguntas</strong> de Competencia Lectora. Dominarla = asegurar puntos "fÃ¡ciles".</div>
    `
  },

  // â”€â”€â”€ 3: DOS CARAS â€“ LITERAL â”€â”€â”€
  {
    icon: 'ðŸŸ¢', title: 'Nivel 1: Coincidencia Literal',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>La forma mÃ¡s <strong>bÃ¡sica</strong> de localizaciÃ³n. La pregunta y la respuesta usan <span class="hl">exactamente las mismas palabras</span> que el texto.</p>
      <div class="example-box">
        <div class="ex-label">ðŸ“„ Texto:</div>
        <p class="ex-text">"Chile fue fundado el <strong>12 de febrero de 1541</strong>."</p>
        <div class="ex-label">â“ Pregunta:</div>
        <p class="ex-text">Â¿CuÃ¡ndo fue fundado Chile?</p>
        <div class="ex-label answer">âœ… Respuesta:</div>
        <p class="ex-text">"El 12 de febrero de 1541." <em>(mismas palabras)</em></p>
      </div>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.75rem">âš¡ Dificultad: <strong>Baja</strong> â€” Estas son las preguntas mÃ¡s rÃ¡pidas de responder.</p>
    `
  },

  // â”€â”€â”€ 4: DOS CARAS â€“ PARÃFRASIS â”€â”€â”€
  {
    icon: 'ðŸŸ ', title: 'Nivel 2: SinÃ³nimos y ParÃ¡frasis',
    bgGradient: 'linear-gradient(135deg, rgba(255,150,0,0.06), rgba(255,150,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ff9600, #e07800)',
    content: `
      <p>AquÃ­ el DEMRE <strong>cambia las palabras</strong>. La respuesta dice lo mismo que el texto pero con sinÃ³nimos o reescrituras.</p>
      <div class="example-box">
        <div class="ex-label">ðŸ“„ Texto:</div>
        <p class="ex-text">"La <strong>sequÃ­a prolongada</strong> afectÃ³ los cultivos."</p>
        <div class="ex-label">â“ Pregunta:</div>
        <p class="ex-text">Â¿QuÃ© perjudicÃ³ la producciÃ³n agrÃ­cola?</p>
        <div class="ex-label answer">âœ… Respuesta:</div>
        <p class="ex-text">"La falta de lluvias extendida." <em>(parÃ¡frasis)</em></p>
      </div>
      <div class="callout-gold">âš ï¸ <strong>La mayorÃ­a de las preguntas PAES</strong> son de este tipo. Es la "trampa" mÃ¡s frecuente.</div>
    `
  },

  // â”€â”€â”€ 5: ANATOMÃA PARÃFRASIS â”€â”€â”€
  {
    icon: 'ðŸŽ­', title: 'AnatomÃ­a de la ParÃ¡frasis',
    bgGradient: 'linear-gradient(135deg, rgba(255,150,0,0.06), rgba(255,150,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ff9600, #e07800)',
    content: `
      <p>La parÃ¡frasis es <span class="hl">el mismo mensaje con otra estructura</span>. Veamos cÃ³mo el DEMRE "disfraza" la informaciÃ³n:</p>
      <div class="paes-text">ðŸ“– "Las <em>fuertes precipitaciones</em> provocaron el <em>colapso</em> del <em>puente principal</em> el dÃ­a <em>martes</em>."</div>
      <div class="arrow-map">
        <div class="arrow-row anim-arrow"><span class="arrow-from">Fuertes precipitaciones</span><span class="arrow-icon">âžœ</span><span class="arrow-to">Lluvia intensa</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Colapso</span><span class="arrow-icon">âžœ</span><span class="arrow-to">DestrucciÃ³n</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Puente principal</span><span class="arrow-icon">âžœ</span><span class="arrow-to">Principal vÃ­a de conexiÃ³n</span></div>
        <div class="arrow-row anim-arrow"><span class="arrow-from">Martes</span><span class="arrow-icon">âžœ</span><span class="arrow-to">Segundo dÃ­a de la semana</span></div>
      </div>
    `
  },

  // â”€â”€â”€ 6: TIP SINÃ“NIMOS â”€â”€â”€
  {
    icon: 'ðŸ§ ', title: 'Entrena tu cerebro para sinÃ³nimos',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Cada vez que leas una palabra clave en un texto, <strong>pregÃºntate</strong>: Â¿de quÃ© otra forma podrÃ­an decir esto?</p>
      <div class="synonym-grid">
        <div class="syn-pair"><span class="syn-a">InvestigaciÃ³n</span><span class="syn-arrow">â†”</span><span class="syn-b">Estudio</span></div>
        <div class="syn-pair"><span class="syn-a">Incremento</span><span class="syn-arrow">â†”</span><span class="syn-b">Aumento</span></div>
        <div class="syn-pair"><span class="syn-a">PropÃ³sito</span><span class="syn-arrow">â†”</span><span class="syn-b">Objetivo</span></div>
        <div class="syn-pair"><span class="syn-a">Escasez</span><span class="syn-arrow">â†”</span><span class="syn-b">Falta</span></div>
        <div class="syn-pair"><span class="syn-a">Consecuencia</span><span class="syn-arrow">â†”</span><span class="syn-b">Resultado</span></div>
        <div class="syn-pair"><span class="syn-a">Controversia</span><span class="syn-arrow">â†”</span><span class="syn-b">PolÃ©mica</span></div>
      </div>
      <div class="callout">ðŸ’¡ <strong>Tip PAES:</strong> Mientras mÃ¡s sinÃ³nimos domines, mÃ¡s rÃ¡pido detectarÃ¡s la alternativa correcta.</div>
    `
  },

  // â”€â”€â”€ 7: PASO 1 â”€â”€â”€
  {
    icon: '1ï¸âƒ£', title: 'Paso 1: Identifica la "huella digital"',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p>Lee la pregunta y subraya mentalmente los <span class="hl">nombres propios, fechas, cifras o conceptos tÃ©cnicos</span>.</p>
      <p>Estas palabras son tu <strong>"huella digital"</strong> porque son difÃ­ciles de cambiar por sinÃ³nimos.</p>
      <div class="example-box">
        <div class="ex-label">â“ Pregunta:</div>
        <p class="ex-text">Â¿En quÃ© aÃ±o fue fundada la <span class="hl">Biblioteca Nacional</span> de Chile?</p>
        <div class="ex-label">ðŸ”‘ Huella digital:</div>
        <p class="ex-text"><strong>"Biblioteca Nacional"</strong> + <strong>"aÃ±o"</strong> + <strong>"fundada"</strong></p>
      </div>
      <p>Ahora sabes exactamente quÃ© buscar en el texto. No leas todo: busca estas palabras.</p>
    `
  },

  // â”€â”€â”€ 8: PASO 2 â”€â”€â”€
  {
    icon: '2ï¸âƒ£', title: 'Paso 2: Haz Scanning (Escaneo)',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p><strong>No leas el texto completo otra vez.</strong> Desliza la vista rÃ¡pidamente buscando exclusivamente tu "huella digital".</p>
      <div class="scan-demo">
        <p class="scan-line dim">En el centro de Santiago se encuentran diversos edificios histÃ³ricos...</p>
        <p class="scan-line dim">Entre ellos, museos, teatros y centros culturales que datan...</p>
        <p class="scan-line found">La <span class="hl">Biblioteca Nacional</span> fue <span class="hl">fundada</span> en <span class="hl">1813</span>, siendo una de las...</p>
        <p class="scan-line dim">Actualmente alberga mÃ¡s de 7 millones de documentos...</p>
      </div>
      <div class="callout-gold">ðŸ‘ï¸ <strong>Tu ojo se detiene solo cuando encuentra la coincidencia.</strong> AsÃ­ ahorras tiempo valioso para preguntas mÃ¡s difÃ­ciles.</div>
    `
  },

  // â”€â”€â”€ 9: PASO 3 â”€â”€â”€
  {
    icon: '3ï¸âƒ£', title: 'Paso 3: Lee el contexto local',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: `
      <p>Una vez que encuentres la palabra, <strong>detente</strong>. Lee solo la <span class="hl">oraciÃ³n anterior</span> y la <span class="hl">oraciÃ³n posterior</span> para confirmar.</p>
      <div class="context-visual">
        <div class="ctx-line before">â†‘ OraciÃ³n anterior (contexto)</div>
        <div class="ctx-line target">â†’ <strong>ORACIÃ“N CON TU DATO</strong> â†</div>
        <div class="ctx-line after">â†“ OraciÃ³n posterior (contexto)</div>
      </div>
      <div class="callout">â±ï¸ <strong>Resultado:</strong> Con esta tÃ©cnica de 3 pasos, respondes preguntas de localizaciÃ³n en <strong>menos de 1 minuto</strong>.</div>
    `
  },

  // â”€â”€â”€ 10: ERRORES COMUNES â”€â”€â”€
  {
    icon: 'ðŸš¨', title: 'Errores comunes (evÃ­talos)',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))',
    iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    content: `
      <div class="error-list">
        <div class="error-item"><span class="err-x">âœ—</span><div><strong>Elegir info de otro pÃ¡rrafo</strong><p>El DEMRE pone alternativas con datos reales pero de otra parte del texto.</p></div></div>
        <div class="error-item"><span class="err-x">âœ—</span><div><strong>Confundir "parecido" con "correcto"</strong><p>Una alternativa puede usar palabras similares pero cambiar el significado.</p></div></div>
        <div class="error-item"><span class="err-x">âœ—</span><div><strong>Agregar lo que "tÃº sabes"</strong><p>Si el dato no estÃ¡ en el texto, no es la respuesta. Aunque sea verdadero en la vida real.</p></div></div>
        <div class="error-item"><span class="err-x">âœ—</span><div><strong>Leer todo el texto para cada pregunta</strong><p>Usa scanning. Leer todo de nuevo es una pÃ©rdida de tiempo innecesaria.</p></div></div>
      </div>
    `
  },

  // â”€â”€â”€ 11: EJEMPLO PAES 1 (interactivo) â”€â”€â”€
  {
    icon: 'ðŸ“', title: 'Ejercicio 1: Texto cientÃ­fico', interactive: true, quizId: 'quiz1',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.04), rgba(239,68,68,0.04))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: `
      <p><strong>Â¡Elige tu respuesta!</strong></p>
      <div class="paes-text">ðŸ“– "Los <strong>tardÃ­grados</strong> son los seres vivos mÃ¡s resistentes a condiciones extremas. Estos diminutos invertebrados, de entre 0,1 y 1,5 mm, son comÃºnmente conocidos como <strong>"osos de agua"</strong> por su <em>apariencia</em> y porque <em>viven en lugares hÃºmedos</em> como musgos."</div>
      <p>â“ Â¿Por quÃ© a los tardÃ­grados se les conoce como "osos de agua"?</p>
    `
  },

  // â”€â”€â”€ 12: EJEMPLO PAES 2 (interactivo) â”€â”€â”€
  {
    icon: 'ðŸ“', title: 'Ejercicio 2: Texto informativo', interactive: true, quizId: 'quiz2',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.04), rgba(88,204,2,0.04))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p><strong>Â¡IntÃ©ntalo de nuevo!</strong></p>
      <div class="paes-text">ðŸ“– "La <strong>potabilizaciÃ³n</strong> es el proceso mediante el cual se eliminan <em>contaminantes</em> y <em>patÃ³genos</em> del agua, haciÃ©ndola <em>apta para el consumo</em> humano. Este proceso incluye etapas de filtraciÃ³n, sedimentaciÃ³n y cloraciÃ³n."</div>
      <p>â“ Â¿En quÃ© consiste la potabilizaciÃ³n segÃºn el texto?</p>
    `
  },

  // â”€â”€â”€ 13: CTA FINAL â”€â”€â”€
  {
    icon: 'ðŸš€', title: 'Â¡EstÃ¡s listo para el desafÃ­o!',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.08), rgba(255,200,0,0.06))',
    iconBg: 'linear-gradient(135deg, #ffc800, #ff9600)',
    content: `
      <div class="cta-inner">
        <span class="big-icon">ðŸ†</span>
        <p>Ya dominas la teorÃ­a y la tÃ©cnica. Ahora entrena en la ruta con textos reales.</p>
        <div class="cta-checklist">
          <div class="cta-check"><span>âœ“</span> DefiniciÃ³n de localizar</div>
          <div class="cta-check"><span>âœ“</span> Literal vs parÃ¡frasis</div>
          <div class="cta-check"><span>âœ“</span> TÃ©cnica de escaneo en 3 pasos</div>
          <div class="cta-check"><span>âœ“</span> Errores comunes</div>
          <div class="cta-check"><span>âœ“</span> 2 ejercicios completados</div>
        </div>
      </div>
    `
  },
];
export const GUIA_TIPOS_TEXTO_SLIDES: GuideSlide[] = [
  {
    icon: '👋',
    title: 'Antes de comenzar',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.1), rgba(133,92,214,0.02))',
    iconBg: 'rgba(133,92,214,0.15)',
    content: '<p>Antes de poner en práctica tu habilidad de <strong>rastrear información</strong>, es fundamental que aprendas a distinguir los tres grandes mundos de textos que evaluarás en la PAES.</p><p>Saber a qué tipo de texto te enfrentas te dará la clave para saber <em>qué</em> buscar y <em>dónde</em> encontrarlo.</p>'
  },
  {
    icon: '📰',
    title: 'Textos Informativos',
    bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))',
    iconBg: 'rgba(59,130,246,0.15)',
    content: '<p>Buscan transmitir datos, hechos y conocimientos objetivos. No te cuentan un cuento, te informan de la realidad.</p><p><strong>Ejemplos:</strong> Noticias, artículos científicos, infografías, manuales y reportajes.</p><p><strong>Tu objetivo:</strong> Enfocarte en los datos duros: fechas, nombres, conceptos, cifras y explicaciones objetivas.</p>'
  },
  {
    icon: '📖',
    title: 'Textos Narrativos',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.02))',
    iconBg: 'rgba(236,72,153,0.15)',
    content: '<p>Cuentan una historia (real o ficticia) a través de personajes en un tiempo y espacio determinados. Te sumergen en un relato.</p><p><strong>Ejemplos:</strong> Cuentos, novelas, mitos, leyendas y fábulas.</p><p><strong>Tu objetivo:</strong> Prestar atención a las acciones principales, las motivaciones de los personajes, el conflicto y la secuencia de los hechos (qué pasó primero, qué pasó después).</p>'
  },
  {
    icon: '⚖️',
    title: 'Textos Argumentativos',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
    iconBg: 'rgba(245,158,11,0.15)',
    content: '<p>Su propósito es convencer o persuadir al lector de una idea u opinión, usando argumentos lógicos y razonamientos.</p><p><strong>Ejemplos:</strong> Ensayos, columnas de opinión, críticas de cine y discursos.</p><p><strong>Tu objetivo:</strong> Identificar la tesis (la opinión principal del autor) y los argumentos que utiliza para defenderla. A diferencia de los informativos, aquí importa mucho la subjetividad del autor.</p>'
  },
  {
    icon: '🎯',
    title: '¡Ponte a prueba!',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
    iconBg: 'rgba(16,185,129,0.15)',
    content: '<div class="quiz-context-box" style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);"><p style="margin: 0; font-style: italic;">"Aquel día, el caballero decidió no desenvainar su espada, pues sabía que el dragón solo protegía su nido."</p></div><p>¿A qué tipo de texto corresponde este fragmento?</p>',
    interactive: true,
    quizId: 'quiz_tipos_texto'
  }
];

export const QUIZ_TIPOS_TEXTO: QuizAlt[] = [
  { key: 'A', text: 'Informativo', correct: false, explain: '❌ Trampa: No está entregando datos o hechos reales sobre dragones, está relatando una escena.' },
  { key: 'B', text: 'Narrativo', correct: true, explain: '✅ ¡Excelente! Hay personajes (el caballero, el dragón) que realizan acciones en un relato.' },
  { key: 'C', text: 'Argumentativo', correct: false, explain: '❌ No intenta convencer de una opinión ni expone argumentos lógicos.' },
];

export const GUIA_INTERPRETAR_SLIDES: GuideSlide[] = [
  {
    icon: '🔍',
    title: '¿Qué es Interpretar?',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.1), rgba(133,92,214,0.02))',
    iconBg: 'rgba(133,92,214,0.15)',
    content: '<p>Interpretar va más allá de lo que el texto dice literalmente. Debes comprender qué quiso decir el autor, para qué sirve cada parte del texto y cuál es su postura ante el tema.</p>'
  },
  {
    icon: '⚖️',
    title: 'Localizar vs Interpretar',
    bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))',
    iconBg: 'rgba(59,130,246,0.15)',
    content: '<p><strong>Localizar</strong> = encontrar la información tal como aparece escrita en el texto.</p><p><strong>Interpretar</strong> = comprender el significado implícito, las relaciones entre ideas y la intención del autor. Exige ir un paso más allá.</p>'
  },
  {
    icon: '📈',
    title: '¿Por qué es importante?',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.02))',
    iconBg: 'rgba(236,72,153,0.15)',
    content: '<p>En la PAES, Interpretar representa cerca del <strong>35% de las preguntas</strong> y es la habilidad que más diferencia los puntajes altos de los puntajes medios.</p>'
  },
  {
    icon: '🔑',
    title: 'Textos Informativos vs Narrativos',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
    iconBg: 'rgba(245,158,11,0.15)',
    content: '<ul><li>En <strong>textos informativos</strong>: busca la tesis, los conectores lógicos y la relación entre párrafos.</li><li>En <strong>textos narrativos</strong>: busca las motivaciones de los personajes, la atmósfera y el tema central.</li><li>La respuesta <strong>siempre</strong> debe justificarse con evidencia del propio texto.</li></ul>'
  },
  {
    icon: '🧠',
    title: 'Pon a prueba tu habilidad',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
    iconBg: 'rgba(16,185,129,0.15)',
    content: '<p>Lee la siguiente frase y responde la pregunta a continuación:</p><div class="callout">“El hielo glaciar no miente. Cada capa es un año, y los gases atrapados dentro son la memoria exacta de la atmósfera de ese tiempo.”</div>',
    interactive: true,
    quizId: 'quiz_interpretar'
  }
];

export const QUIZ_INTERPRETAR: QuizAlt[] = [
  { key: 'A', text: 'Informar sobre el proceso físico de formación del hielo.', correct: false, explain: '❌ Trampa: Se menciona el hielo, pero el tono y las expresiones usadas ("no miente") buscan algo más que informar.' },
  { key: 'B', text: 'Argumentar que el hielo glaciar es una fuente confiable de información histórica.', correct: true, explain: '✅ ¡Correcto! La expresión "el hielo no miente" y la metáfora de "memoria exacta" revelan que el autor busca persuadir sobre la fiabilidad del hielo.' },
  { key: 'C', text: 'Narrar cómo un científico estudia el hielo.', correct: false, explain: '❌ No hay una historia ni personajes.' },
  { key: 'D', text: 'Describir la composición química del hielo.', correct: false, explain: '❌ Menciona "gases atrapados", pero no detalla una composición química exacta.' }
];


export const CAP2_SUMMARY_SLIDES: GuideSlide[] = [
  {
    icon: '🔮', title: '¡Bienvenido al Capítulo 2!',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))',
    iconBg: 'linear-gradient(135deg, #ec4899, #db2777)',
    content: `
      <p>Estás a punto de dar un salto cuántico en tu entrenamiento. Pasaremos de simplemente encontrar información a la habilidad más determinante: <span class="hl">Interpretar</span>.</p>
      <div class="callout">
        👁️‍🗨️ <strong>Tu nueva misión:</strong> Leer entre líneas. Ya no buscarás lo que está escrito literalmente, sino que descubrirás <strong>qué quiso decir realmente el autor</strong> y cuál es la intención oculta detrás de sus palabras.
      </div>
      <p>Aquí es donde la mayoría se equivoca. ¡Pero tú aprenderás a decodificar los textos como un experto!</p>
    `
  },
  {
    icon: '🗺️', title: 'Lo que dominarás aquí',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
    iconBg: 'linear-gradient(135deg, #10b981, #059669)',
    content: `
      <p>Durante este capítulo, tu entrenamiento se dividirá en estos pilares fundamentales:</p>
      <div class="mini-cards">
        <div class="mc blue">1️⃣ <strong>Vocabulario en Contexto:</strong> Cómo descubrir el significado real de una palabra según su entorno.</div>
        <div class="mc green">2️⃣ <strong>Intención del Autor:</strong> Por qué y para qué se escribió el texto (o un párrafo específico).</div>
        <div class="mc red" style="grid-column: 1 / -1;">3️⃣ <strong>Decodificar Metáforas:</strong> Traducir lenguaje figurado a lenguaje literal sin perder el sentido.</div>
        <div class="mc blue">4️⃣ <strong>Tono y Actitud:</strong> Detectar si el autor es objetivo, crítico, sarcástico o pesimista.</div>
      </div>
    `
  },
  {
    icon: '🏆', title: 'La habilidad clave de la PAES',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    content: `
      <p>En la prueba, las preguntas de Interpretar representan cerca del <strong>35% del total</strong>.</p>
      <p>A diferencia de Localizar, donde la respuesta te espera en el texto, aquí tú debes construir la respuesta conectando pistas dispersas.</p>
      <p><em>¿Listo para dejar de ser un lector pasivo y convertirte en un analista activo? ¡Comencemos!</em></p>
    `
  }
];

export const CAP3_SUMMARY_SLIDES: GuideSlide[] = [
  {
    icon: '🚀', title: '¡Bienvenido al Capítulo 3!',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
    iconBg: 'linear-gradient(135deg, #10b981, #059669)',
    content: `
      <p>Has superado las etapas de Localizar e Interpretar. Ahora te enfrentas al nivel más alto de comprensión lectora: <span class="hl">Evaluar</span>.</p>
      <div class="callout">
        🧠 <strong>Tu misión final:</strong> Ya no solo encuentras o traduces información, ahora debes <strong>juzgarla</strong>. Evaluar significa tomar una postura crítica frente al texto, analizando su calidad, la intención detrás de él y la pertinencia de sus argumentos.
      </div>
      <p>Es la habilidad que te convierte en un lector inmune a las mentiras y las falacias.</p>
    `
  },
  {
    icon: '🗺️', title: 'Lo que dominarás aquí',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.08), rgba(28,176,246,0.02))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: `
      <p>Durante este capítulo, tu entrenamiento se dividirá en estos pilares fundamentales:</p>
      <div class="mini-cards">
        <div class="mc blue">1️⃣ <strong>Intención y Postura:</strong> Identificar el verdadero propósito del autor y su actitud frente al tema.</div>
        <div class="mc green">2️⃣ <strong>Calidad de la Información:</strong> Detectar falacias, sesgos y juzgar si los argumentos son sólidos.</div>
        <div class="mc red" style="grid-column: 1 / -1;">3️⃣ <strong>Recursos Visuales y Lingüísticos:</strong> Evaluar el uso de ironía, metáforas, comillas e imágenes.</div>
        <div class="mc blue" style="grid-column: 1 / -1;">4️⃣ <strong>Extrapolación:</strong> Aplicar la lógica del autor a contextos totalmente nuevos.</div>
      </div>
    `
  },
  {
    icon: '⚔️', title: 'El desafío final de la PAES',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    content: `
      <p>Las preguntas de Evaluar representan cerca del <strong>35% de la prueba PAES</strong>.</p>
      <p>A diferencia de Localizar e Interpretar, aquí se te pedirá que mires el texto desde afuera, como un juez externo, y evalúes sus formas y su contenido.</p>
      <p><em>¿Listo para convertirte en el maestro definitivo de la lectura? ¡Comencemos!</em></p>
    `
  }
];
