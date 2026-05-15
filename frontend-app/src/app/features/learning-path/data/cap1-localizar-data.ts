import { Capitulo } from '../models/paes.models';
import { NODO4_PARÁFRASIS_NARRATIVO, NODO5_DESAFIO_FINAL } from './cap1-localizar-nodos45';

// ─── CAPÍTULO 1: HABILIDAD DE LOCALIZAR ───
// Según DEMRE: identificar, reconocer y extraer información explícita
// literal o a través de sinónimos y paráfrasis.

export const CAP1_LOCALIZAR: Capitulo = {
  id: 'cap-localizar',
  materiaId: 'comp-lectora',
  title: 'Habilidad de Localizar',
  introduccion: '🔍 Aprende a encontrar información explícita en cualquier texto. Domina el rastreo literal y la identificación de sinónimos y paráfrasis, ¡la base de la PAES de Competencia Lectora!',
  order: 1,
  secciones: [

    // ════════════════════════════════════════════
    // NODO 1 — Rastrear información explícita (Texto informativo)
    // ════════════════════════════════════════════
    {
      id: 'loc-n1',
      capituloId: 'cap-localizar',
      materiaId: 'comp-lectora',
      title: 'Rastrear info en textos informativos',
      introduccion: '🚀 ¡Tu primera misión! Vas a aprender a encontrar datos explícitos en textos informativos. No necesitas interpretar nada: solo buscar lo que el texto dice textualmente.',
      guia_titulo: '❓ ¿Qué es información explícita?',
      guia_contenido: 'Es todo dato que aparece escrito directamente en el texto: nombres, fechas, cifras, definiciones o hechos concretos. Si puedes subrayarlo con el dedo, ¡es explícito!',
      datos_claves: [
        '🔎 **Tip 1:** Antes de leer las alternativas, subraya mentalmente los datos duros del texto: nombres propios, años, porcentajes y definiciones.',
        '⚡ **Tip 2:** Cuando leas la pregunta, identifica la **palabra clave** y haz scanning: recorre el texto buscando solo esa palabra o concepto.'
      ],
      order: 1,
      test: {
        id: 'test-loc-n1',
        seccionId: 'loc-n1',
        contexto_base: 'El desierto de Atacama, ubicado en el norte de Chile, es considerado el más árido del planeta. Con precipitaciones anuales inferiores a 1 milímetro en algunas zonas, alberga condiciones extremas que durante décadas se creyeron incompatibles con la vida. Sin embargo, investigaciones recientes del Centro de Astrobiología de Madrid, realizadas entre 2015 y 2018, descubrieron microorganismos capaces de sobrevivir bajo la superficie rocosa. Estos seres, denominados endolitos, obtienen energía de minerales como el yeso y la halita. El hallazgo fue publicado en la revista Nature en noviembre de 2018 y generó comparaciones inmediatas con las condiciones del planeta Marte. La doctora Jacinta Gómez, líder del equipo chileno colaborador, señaló que "estos organismos representan el límite conocido de la vida en la Tierra". Actualmente, la NASA utiliza Atacama como laboratorio natural para diseñar instrumentos de detección biológica destinados a futuras misiones marcianas.',
        preguntas: [
          {
            id: 1,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: '¿En qué revista se publicó el hallazgo de los microorganismos del desierto de Atacama?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Science',
              B: 'National Geographic',
              C: 'Nature',
              D: 'The Lancet'
            },
            respuesta_correcta: 'C' as const,
            feedback_acierto: '¡Perfecto! 🎯 El texto dice literalmente "publicado en la revista Nature en noviembre de 2018". Rastreo impecable.',
            feedback_error: '¡Ojo! 👀 Vuelve al texto y busca la frase "fue publicado en la revista...". El dato está escrito de forma explícita.'
          },
          {
            id: 2,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: '¿De qué minerales obtienen energía los endolitos según el texto?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Cuarzo y feldespato',
              B: 'Yeso y halita',
              C: 'Calcita y mica',
              D: 'Hierro y magnesio'
            },
            respuesta_correcta: 'B' as const,
            feedback_acierto: '¡Excelente! ⚡ Encontraste el dato textual: "obtienen energía de minerales como el yeso y la halita".',
            feedback_error: 'Busca la oración que menciona "obtienen energía de minerales como...". La respuesta está ahí, literal. 🔍'
          },
          {
            id: 3,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: 'Según el texto, ¿qué institución utiliza actualmente el desierto de Atacama como laboratorio natural?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'El Centro de Astrobiología de Madrid',
              B: 'La Universidad de Chile',
              C: 'La Agencia Espacial Europea',
              D: 'La NASA'
            },
            respuesta_correcta: 'D' as const,
            feedback_acierto: '¡Crack! 🚀 La última oración lo dice claramente: "la NASA utiliza Atacama como laboratorio natural".',
            feedback_error: '⚠️ Cuidado: el Centro de Astrobiología hizo la investigación, pero la pregunta dice "actualmente utiliza como laboratorio". Lee la última oración.'
          }
        ]
      }
    },

    // ════════════════════════════════════════════
    // NODO 2 — Rastrear información explícita (Texto narrativo)
    // ════════════════════════════════════════════
    {
      id: 'loc-n2',
      capituloId: 'cap-localizar',
      materiaId: 'comp-lectora',
      title: 'Rastrear info en textos narrativos',
      introduccion: '📖 Ahora el desafío cambia: trabajarás con relatos y cuentos. Tu misión sigue siendo la misma: encontrar lo que el texto dice, no lo que tú imaginas.',
      guia_titulo: '❓ ¿Cómo busco datos en un cuento?',
      guia_contenido: 'En textos narrativos, la información explícita se esconde en las acciones de los personajes, los lugares físicos, los objetos mencionados y los diálogos. Fíjate en los verbos concretos.',
      datos_claves: [
        '🎭 **Tip 1:** Subraya las **acciones concretas** de los personajes (qué hicieron, dónde fueron, qué dijeron). Eso es información explícita narrativa.',
        '📍 **Tip 2:** Presta atención a las **descripciones de lugar y tiempo**: "al amanecer", "junto al río", "en la cocina". Son pistas literales que el DEMRE pregunta.'
      ],
      order: 2,
      test: {
        id: 'test-loc-n2',
        seccionId: 'loc-n2',
        contexto_base: 'Marta cerró la puerta de la cabaña y caminó hacia el embarcadero con la linterna en la mano. El lago, inmóvil bajo la luna llena, reflejaba las siluetas de los cipreses como un espejo oscuro. Se sentó en el borde del muelle de madera y sacó del bolsillo una carta doblada en cuatro partes. La había recibido esa mañana, traída por el cartero del pueblo vecino, don Reinaldo. Con manos temblorosas, la abrió y leyó en voz baja: "Querida Marta, tu madre ha decidido vender la casa de Valdivia. Tienes hasta el viernes para responder". Guardó la carta en el bolsillo de su chaqueta azul, apagó la linterna y se quedó mirando el reflejo de la luna durante lo que le parecieron horas. Al final, se levantó, recogió una piedra lisa del suelo y la lanzó al agua. Los círculos se expandieron en silencio.',
        preguntas: [
          {
            id: 4,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: '¿Quién le llevó la carta a Marta?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Su madre',
              B: 'Un vecino anónimo',
              C: 'Don Reinaldo, el cartero del pueblo vecino',
              D: 'Un mensajero de Valdivia'
            },
            respuesta_correcta: 'C' as const,
            feedback_acierto: '¡Muy bien! 📬 El texto dice explícitamente: "traída por el cartero del pueblo vecino, don Reinaldo".',
            feedback_error: 'Busca la oración donde se menciona cómo recibió la carta "esa mañana". El nombre del cartero aparece ahí. 🔍'
          },
          {
            id: 5,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: '¿Qué objeto llevaba Marta en la mano al salir de la cabaña?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Una carta',
              B: 'Una linterna',
              C: 'Una piedra',
              D: 'Un paraguas'
            },
            respuesta_correcta: 'B' as const,
            feedback_acierto: '¡Exacto! 🔦 Primera oración: "caminó hacia el embarcadero con la linterna en la mano".',
            feedback_error: 'Cuidado: la carta estaba en el bolsillo, no en la mano. Relee la primera oración. ⚠️'
          },
          {
            id: 6,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: 'Según la carta, ¿qué ha decidido hacer la madre de Marta?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Mudarse al pueblo vecino',
              B: 'Visitar a Marta en la cabaña',
              C: 'Vender la casa de Valdivia',
              D: 'Escribirle una segunda carta'
            },
            respuesta_correcta: 'C' as const,
            feedback_acierto: '¡Perfecto! 🏠 La carta dice textualmente: "tu madre ha decidido vender la casa de Valdivia".',
            feedback_error: 'Lee el contenido de la carta entre comillas. La respuesta está escrita palabra por palabra ahí. 📖'
          }
        ]
      }
    },

    // ════════════════════════════════════════════
    // NODO 3 — Sinónimos y paráfrasis (Texto informativo)
    // ════════════════════════════════════════════
    {
      id: 'loc-n3',
      capituloId: 'cap-localizar',
      materiaId: 'comp-lectora',
      title: 'Paráfrasis en textos informativos',
      introduccion: '🧩 ¡Level up! Ahora la respuesta correcta NO usará las mismas palabras del texto. El DEMRE disfraza la info con sinónimos. Aprende a detectarlos.',
      guia_titulo: '❓ ¿Qué es la paráfrasis en la PAES?',
      guia_contenido: 'Es cuando la alternativa correcta dice lo mismo que el texto, pero con otras palabras. El texto dice "escasez hídrica" y la respuesta dice "falta de agua". ¡Mismo significado, distintas palabras!',
      datos_claves: [
        '🔄 **Tip 1:** Si ninguna alternativa repite las palabras exactas del texto, **no te asustes**. Busca cuál dice lo mismo con sinónimos. Esa es la correcta.',
        '🚫 **Tip 2:** Desconfía de la alternativa que copia textualmente una frase del texto pero **cambia un detalle**. Esa suele ser el distractor más peligroso.'
      ],
      order: 3,
      test: {
        id: 'test-loc-n3',
        seccionId: 'loc-n3',
        contexto_base: 'La migración de las ballenas jorobadas constituye uno de los desplazamientos más extensos del reino animal. Cada otoño, estos cetáceos abandonan las gélidas aguas antárticas, donde se alimentan de krill, y emprenden un viaje de aproximadamente 8.000 kilómetros hacia las costas tropicales de Colombia y Ecuador. Allí, en aguas cálidas y poco profundas, las hembras dan a luz a sus crías entre julio y octubre. Los ballenatos nacen sin la capa de grasa necesaria para soportar el frío polar, por lo que las aguas templadas resultan indispensables para su supervivencia durante las primeras semanas. Investigadores de la Universidad Austral de Chile han documentado que las madres dejan de alimentarse durante todo el período reproductivo, perdiendo hasta un tercio de su peso corporal. Este sacrificio energético garantiza que las crías reciban leche rica en grasas, fundamental para su rápido crecimiento antes del retorno al sur.',
        preguntas: [
          {
            id: 7,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: 'Según el texto, ¿por qué las ballenas jorobadas viajan a aguas tropicales?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Para escapar de sus depredadores naturales en la Antártica.',
              B: 'Para que sus crías nazcan en un ambiente térmicamente adecuado para sobrevivir.',
              C: 'Para buscar nuevas fuentes de krill en zonas ecuatoriales.',
              D: 'Para aparearse con poblaciones de otras regiones del Pacífico.'
            },
            respuesta_correcta: 'B' as const,
            feedback_acierto: '¡Excelente! 🐋 El texto dice que los ballenatos "nacen sin la capa de grasa necesaria" y que "las aguas templadas resultan indispensables para su supervivencia". La alternativa B parafrasea esto como "ambiente térmicamente adecuado".',
            feedback_error: 'Busca por qué las aguas cálidas son importantes para las crías. El texto habla de "indispensables para su supervivencia". ¿Qué alternativa dice lo mismo con otras palabras? 🔄'
          },
          {
            id: 8,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: '¿Qué consecuencia tiene el período reproductivo en las ballenas madre?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Experimentan una reducción significativa de su masa corporal.',
              B: 'Desarrollan una capa de grasa más gruesa para proteger a sus crías.',
              C: 'Aumentan su consumo de krill para producir más leche.',
              D: 'Permanecen inmóviles en las costas tropicales durante meses.'
            },
            respuesta_correcta: 'A' as const,
            feedback_acierto: '🏆 ¡Paráfrasis detectada! El texto dice "perdiendo hasta un tercio de su peso corporal" y la alternativa A lo expresa como "reducción significativa de su masa corporal". Mismo significado, distintas palabras.',
            feedback_error: 'Lee la oración sobre lo que hacen las madres durante el período reproductivo. "Perdiendo un tercio de su peso" = ¿cuál alternativa dice algo equivalente? 🧩'
          },
          {
            id: 9,
            preambulo_texto: null,
            preambulo_imagen_url: null,
            enunciado: 'De acuerdo con el texto, ¿qué caracteriza al alimento que reciben los ballenatos?',
            formula_latex: null,
            tipo_alternativas: 'texto' as const,
            alternativas: {
              A: 'Proviene del krill que las madres almacenan durante el viaje.',
              B: 'Es un líquido con alto contenido lipídico que favorece el desarrollo acelerado.',
              C: 'Se compone de nutrientes vegetales de las aguas tropicales.',
              D: 'Contiene proteínas adaptadas a las bajas temperaturas polares.'
            },
            respuesta_correcta: 'B' as const,
            feedback_acierto: '🎯 ¡Crack! El texto dice "leche rica en grasas, fundamental para su rápido crecimiento". La B lo parafrasea: "alto contenido lipídico" = rica en grasas; "desarrollo acelerado" = rápido crecimiento.',
            feedback_error: 'Busca la última oración. "Leche rica en grasas" → ¿qué alternativa usa sinónimos de "grasas" y "rápido crecimiento"? Piensa: grasas = lípidos. 💡'
          }
        ]
      }
    },

    // Nodo 4 — Sinónimos y paráfrasis (Texto narrativo)
    NODO4_PARÁFRASIS_NARRATIVO,

    // Nodo 5 — Desafío Final
    NODO5_DESAFIO_FINAL,
  ]
};

// ─── GUÍA (Flashcards para el botón "Guía" del capítulo) ───
// Estas se muestran en el componente capitulo-detail como tarjetas deslizables.

export const CAP1_GUIA_FLASHCARDS = [
  {
    titulo: '🔍 ¿Qué es Localizar?',
    contenido: 'Localizar significa encontrar información que está **escrita directamente** en el texto. El DEMRE te pide identificar datos explícitos: nombres, fechas, cifras, acciones o definiciones. No inventas, no deduces: solo encuentras. 🎯'
  },
  {
    titulo: '⚡ El Escáner Visual (Scanning)',
    contenido: 'No releas todo el texto. Usa la técnica de **scanning**: identifica la palabra clave de la pregunta y recorre el texto rápidamente buscando SOLO esa palabra o su sinónimo. Es como usar Ctrl+F con tus ojos. 👀'
  },
  {
    titulo: '🎭 La Trampa de la Paráfrasis',
    contenido: 'El DEMRE rara vez copia las palabras exactas del texto en la alternativa correcta. Usa **sinónimos y paráfrasis**: "escasez hídrica" → "falta de agua". ¡Aprende a ver más allá de las palabras! 🧩'
  },
  {
    titulo: '🏆 Regla de Oro: NO Inferir',
    contenido: 'En preguntas de Localizar, **NUNCA** deduzcas ni interpretes. Si la respuesta no está escrita (literal o parafraseada) en el texto, entonces es un distractor. Confía solo en lo que puedes señalar con el dedo. ✋'
  }
];
