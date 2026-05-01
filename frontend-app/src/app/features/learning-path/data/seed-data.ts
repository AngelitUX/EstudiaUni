import { Materia, Capitulo } from '../models/paes.models';

export const MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 4, isActive: false },
];

export const CAPITULOS: Capitulo[] = [
  {
    id: 'cap-1',
    materiaId: 'comp-lectora',
    title: 'Textos No Literarios: Informes y Artículos',
    introduccion: 'Los textos no literarios son fundamentales en la PAES. Aprenderás a localizar, interpretar y evaluar información en informes estadísticos y artículos de opinión.',
    order: 1,
    secciones: [
      {
        id: 'sec-1-1',
        capituloId: 'cap-1',
        materiaId: 'comp-lectora',
        title: '1. Rastrear e Interpretar Datos Demográficos',
        introduccion: '¡Prepárate para tu primer desafío! 🚀 Los informes estadísticos suelen intimidar, pero esconden patrones claros. Tu misión aquí es rastrear información específica e interpretar la relación entre los párrafos.',
        datos_claves: [
          'Identifica las definiciones clave: Cuando un texto presenta un concepto nuevo (como "transición demográfica"), subraya inmediatamente qué significa y cuáles son sus etapas.',
          'Busca los marcadores temporales: Frases como "A mediados del siglo XX" o "En la etapa avanzada" son pistas directas para encontrar respuestas de localización.',
          'Compara perspectivas: Si el texto cita a distintos autores o instituciones (ej: Miró vs. CEPAL), anota mentalmente en qué se diferencian.'
        ],
        order: 1,
        test: {
          id: 'test-1-1',
          seccionId: 'sec-1-1',
          contexto_base: 'Generalmente, el envejecimiento demográfico es visto como una consecuencia inevitable de la transición hacia una población que presenta bajas tasas de crecimiento demográfico... La teoría de la transición demográfica da cuenta de las transformaciones acontecidas en la estructura de la población... En los años posteriores, debido a los importantes cambios... se han planteado nuevos indicadores y etapas para la definición del proceso de transición demográfica. Estos están basados en las tasas de fecundidad y la esperanza de vida de la población... Bajo esta premisa, las cuatro etapas de la transición demográfica se definen como moderada, plena, avanzada y muy avanzada (CEPAL, 2008). A mediados del siglo XX, las mejoras en las condiciones de vida... produjeron descensos importantes en la mortalidad... En situaciones de altas tasas de fecundidad, el descenso de la mortalidad de los más jóvenes implica un acelerado crecimiento de la población. [...] En cuanto la fecundidad y la mortalidad infantil continúan descendiendo paulatinamente, la estructura etaria de la población comienza a envejecer lentamente, entrando a una etapa plena de la transición demográfica... ampliando así el tamaño de la población económicamente activa. Esta situación ha sido denominada como el "bono demográfico"...',
          preguntas: [
            { id: 1, enunciado: 'Con respecto al análisis demográfico, ¿cuál es la relación establecida entre el primer y segundo párrafo?', alternativas: { A: 'El primero presenta el problema del envejecimiento de la población; el segundo muestra formas de medir su alcance.', B: 'El primero explica las tasas de crecimiento poblacional de Europa; el segundo las compara con las de América Latina.', C: 'El primero define la transición demográfica; el segundo plantea los indicadores que permiten observarla en un territorio.', D: 'El primero categoriza los factores de medición demográfica; el segundo explica las razones por las que estos han sido reemplazados.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente deducción! 🧠 El primer párrafo establece el marco teórico (qué es la transición), y el segundo detalla cómo se mide mediante indicadores como la fecundidad y la esperanza de vida.', feedback_error: '¡Ojo con la estructura! 👀 Vuelve a leer el inicio de ambos párrafos. El primero habla de qué es este proceso, mientras que el segundo menciona específicamente que se han planteado "nuevos indicadores y etapas".' },
            { id: 2, enunciado: 'A diferencia de Miró, ¿qué indicador considera la CEPAL al definir las etapas de transición demográfica?', alternativas: { A: 'La estructura por edades.', B: 'La tasa de fecundidad.', C: 'La tasa de mortalidad.', D: 'La esperanza de vida.' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien rastreado! 🎯 El texto es explícito: mientras Miró miraba la disminución de la mortalidad, la CEPAL introdujo los indicadores basados en "las tasas de fecundidad y la esperanza de vida".', feedback_error: '¡Casi! 🕵️‍♂️ Vuelve al segundo párrafo y busca la mención a la CEPAL. Fíjate en qué factores dice que se basan sus nuevos indicadores.' },
            { id: 3, enunciado: '¿Cuál es una de las características de la etapa incipiente de la transición demográfica?', alternativas: { A: 'Alta mortalidad infantil.', B: 'Aumento de la esperanza de vida.', C: 'Acelerado crecimiento de la población.', D: 'Bajo índice de fecundidad.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! 🏆 En el texto se indica literalmente que el descenso de la mortalidad joven junto con altas tasas de fecundidad da como resultado un "acelerado crecimiento de la población".', feedback_error: '¡Cuidado con la línea de tiempo! ⚠️ Lee el tercer párrafo donde se describe la etapa incipiente de mediados del siglo XX.' },
            { id: 4, enunciado: 'A partir de la lectura, ¿qué implica el "bono demográfico" para una sociedad?', alternativas: { A: 'Que aumenta su población en edad laboral.', B: 'Que entrega incentivos para aumentar la natalidad.', C: 'Que impulsa el incremento de la esperanza de vida.', D: 'Que intenta frenar el envejecimiento de la población.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! 💼 El "bono demográfico" es la situación favorable que se da cuando se amplía el "tamaño de la población económicamente activa".', feedback_error: 'Te desviaste un poco. 🧭 Busca el concepto entre comillas ("bono demográfico") en el texto.' },
            { id: 5, enunciado: 'Según la lectura, ¿en cuál de las etapas de transición demográfica la economía se ve beneficiada por el tamaño de la población económicamente activa?', alternativas: { A: 'En la etapa plena.', B: 'En la etapa incipiente.', C: 'En la etapa avanzada.', D: 'En la etapa moderada.' }, respuesta_correcta: 'A', feedback_acierto: '¡Conexión perfecta! ✨ Vinculaste correctamente el aumento de la población activa con la "etapa plena de la transición demográfica".', feedback_error: '¡Un pequeño resbalón! 🧩 Busca dónde se menciona a la "población económicamente activa" y revisa qué nombre se le da a esa etapa.' }
          ]
        }
      },
      {
        id: 'sec-1-2',
        capituloId: 'cap-1',
        materiaId: 'comp-lectora',
        title: '2. Sintetizar y Evaluar Textos Expositivos',
        introduccion: '¡Avanzamos al siguiente nivel! 🧗‍♂️ Ahora que sabes localizar, pondremos a prueba tu capacidad de sintetizar cómo se organiza la información y extraer características clave.',
        datos_claves: [
          'Analiza la estructura global: Fíjate cómo el autor ordena sus ideas. ¿Va de lo general a lo particular? ¿Define primero y luego da ejemplos?',
          'Distingue la etapa: En textos con secuencias o clasificaciones, asegúrate de no mezclar las características de una etapa con las de otra.',
          'Sigue el hilo conductor: Las preguntas de evaluación requieren que entiendas el propósito de cada párrafo en relación con el texto completo.'
        ],
        order: 2,
        test: {
          id: 'test-1-2',
          seccionId: 'sec-1-2',
          contexto_base: 'A medida que las tasas globales de fecundidad continúan reduciéndose... la reducción de los niveles de mortalidad comienza a hacerse extensiva a todos los grupos de edades, lo cual es acompañado por una esperanza de vida que comienza a superar los 75 años, dando paso a la etapa avanzada de la transición demográfica... la proporción de población en edades mayores sobre el total de la población comienza a aumentar, impulsando así el proceso de envejecimiento poblacional... Finalmente, en una etapa muy avanzada de la transición demográfica es posible ubicar aquellos países que bajaron muy tempranamente sus niveles de fecundidad...',
          preguntas: [
            { id: 6, enunciado: 'De acuerdo con la lectura, ¿en qué etapa de transición demográfica la esperanza de vida comienza a superar los 75 años?', alternativas: { A: 'En la etapa muy avanzada.', B: 'En la etapa moderada.', C: 'En la etapa avanzada.', D: 'En la etapa plena.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! 🎯 Localizaste el dato exacto. El texto asocia directamente la esperanza de vida superior a 75 años con la etapa avanzada.', feedback_error: '¡Casi caes en la trampa! 🕵️‍♂️ Vuelve a leer prestando atención al número "75".' },
            { id: 7, enunciado: '¿Cuál es una característica de la etapa avanzada de la transición demográfica?', alternativas: { A: 'El aumento de las tasas de fecundidad.', B: 'El estancamiento de la estructura etaria.', C: 'El incremento del reemplazo generacional.', D: 'El envejecimiento de las cohortes dominantes.' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien interpretado! 🧠 El texto detalla que en esta etapa las cohortes dominantes "comienzan a tener cada vez una mayor cantidad de años".', feedback_error: '¡Ojo! ⚠️ En la etapa avanzada la fecundidad baja, no sube. Busca qué sucede con las "cohortes dominantes".' },
            { id: 8, enunciado: '¿De qué manera se organiza la información respecto de las etapas de transición demográfica?', alternativas: { A: 'Se expone una discusión teórica y luego se ejemplifican estas etapas con la situación de América Latina.', B: 'Se explican los criterios que definen las etapas propuestas por la CEPAL y luego se detallan las características demográficas de dichas etapas.', C: 'Se contrastan distintas definiciones de las etapas y luego se presenta el informe de la CEPAL.', D: 'Se presenta la evolución en la concepción de las etapas y luego se establece la visión actual de la CEPAL.' }, respuesta_correcta: 'B', feedback_acierto: '¡Gran capacidad de síntesis! 📊 Identificaste la estructura global: primero los criterios, luego el desglose etapa por etapa.', feedback_error: '¡Mira el panorama completo! 🦅 ¿El autor contrasta autores o establece reglas para luego explicar cada etapa?' }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-2',
    materiaId: 'comp-lectora',
    title: 'Textos No Literarios: Artículos de Opinión',
    introduccion: 'Los artículos de opinión son uno de los tipos de texto más frecuentes en la PAES. Aprenderás a distinguir la postura del autor, interpretar anécdotas y evaluar el propósito de los ejemplos.',
    order: 2,
    secciones: [
      {
        id: 'sec-2-1',
        capituloId: 'cap-2',
        materiaId: 'comp-lectora',
        title: '1. Localizar e Interpretar Opiniones',
        introduccion: '¡Bienvenido a un nuevo tipo de texto! 📰 Aquí trabajaremos con artículos periodísticos de opinión. Tu desafío no es solo rastrear hechos, sino entender la postura y actitud del autor.',
        datos_claves: [
          'Identifica el tono: Presta atención a los adjetivos y exclamaciones del autor. ¿Está criticando, celebrando, cuestionando o solo informando?',
          'Separa la anécdota del argumento: Los autores suelen usar historias cortas al principio para introducir su idea principal.',
          'Citas de autoridad: Cuando un autor cita a otra persona, usualmente lo hace para validar su propio punto o establecer una comparación.'
        ],
        order: 1,
        test: {
          id: 'test-2-1',
          seccionId: 'sec-2-1',
          contexto_base: 'En una entrevista reciente, Claudio Magris... recordaba la anécdota... de que cuando hace quince años enseñaba en un college de Estados Unidos, "solo cinco o seis estudiantes en una clase de 36 sabían quién fue Stalin". Y añadía que ese tipo de ignorancia... se estaba acentuando... [...] En un momento del curso, estaba explicando algo que involucraba al francés Henri Poincaré... una de las figuras cumbres de la matemática... En opinión de Jean Dieudonné... "Si los descubrimientos de Poincaré en la teoría de números no son iguales a los de Gauss, sus logros en la teoría de funciones son al menos del mismo nivel". [...] Por el contrario, muchos de los grandes nombres del pasado en física o en biología forman parte de su historia... pero en general sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble, Mendel a Watson y Crick...',
          preguntas: [
            { id: 9, enunciado: 'Una estudiante afirma que el artículo ofrece la idea de que el conocimiento es una construcción colectiva. ¿Qué cita permite justificar esta apreciación?', alternativas: { A: '«Poincaré es la figura más importante en la teoría de las ecuaciones diferenciales y es el matemático que, después de Newton, efectuó el trabajo más destacado en mecánica celeste».', B: '«En opinión de Jean Dieudonné, un matemático notable él mismo, "ambos eran matemáticos universales en el sentido supremo..."».', C: '«pero en general sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble...».', D: '«Desde entonces he constatado que hay muchas personas... que no saben quién fue James Clerk Maxwell...».' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente inferencia! 🧱 La cita muestra cómo un científico toma el trabajo de otro para avanzar, evidenciando construcción colectiva.', feedback_error: 'Piénsalo de nuevo. 🤔 "Construcción colectiva" significa que el trabajo de uno sirve de base para el siguiente.' },
            { id: 10, enunciado: '¿Cuál es la actitud del emisor en relación con el problema de la "memoria corta"?', alternativas: { A: 'Crítica, pues considera que los intelectuales incumplen el rol de modelos culturales.', B: 'Controversial, pues cree que hay áreas disciplinares menospreciadas.', C: 'Cuestionadora, pues cree que la educación carece de una perspectiva integradora de los acontecimientos pasados.', D: 'Pesimista, pues considera que el sistema educativo tiene limitaciones para abordar los referentes históricos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien captado! 🕵️‍♀️ El emisor cuestiona cómo la falta de conocimientos desconecta a las generaciones de su pasado cultural.', feedback_error: '¡Cuidado! ⚠️ El autor no culpa a los intelectuales ni es solo pesimismo. Está cuestionando la desconexión cultural.' },
            { id: 11, enunciado: 'Considerando la información del artículo, ¿a quién le podría resultar útil su lectura?', alternativas: { A: 'A una persona que busca mejorar la enseñanza de la ciencia en el sistema educativo.', B: 'A una persona que busca conocer los aportes de los principales exponentes de las ciencias.', C: 'A una persona que busca comprender los hitos más relevantes de la matemática.', D: 'A una persona que busca justificar la importancia del conocimiento histórico de una disciplina.' }, respuesta_correcta: 'D', feedback_acierto: '¡Exacto! 📖 El propósito central del artículo es reflexionar sobre por qué no debemos olvidar la historia detrás de las disciplinas.', feedback_error: 'Enfócate en el mensaje de fondo. 💡 El autor usa nombres de científicos para argumentar por qué es importante recordarlos históricamente.' },
            { id: 12, enunciado: '¿Para qué se menciona la anécdota de Magris en el primer párrafo?', alternativas: { A: 'Para cuestionar la escasa profundización del discurso educativo.', B: 'Para criticar el desinterés intelectual de las nuevas generaciones.', C: 'Para ejemplificar los vacíos académicos del sistema educativo actual.', D: 'Para ilustrar el desconocimiento juvenil de acontecimientos históricos.' }, respuesta_correcta: 'D', feedback_acierto: '¡Perfecto! 🎯 La anécdota de estudiantes que no conocen a Stalin funciona como ilustración de esa "memoria corta".', feedback_error: 'Revisa la función del párrafo. 🔍 Una anécdota casi siempre sirve para ilustrar un punto.' },
            { id: 13, enunciado: 'Según la opinión de Dieudonné, ¿en qué área Gauss supera a Poincaré?', alternativas: { A: 'En las ecuaciones diferenciales.', B: 'En la teoría de las funciones.', C: 'En la teoría de los números.', D: 'En la mecánica celeste.' }, respuesta_correcta: 'C', feedback_acierto: '¡Rastreo impecable! 🔍 Dieudonné indica: "Si los descubrimientos de Poincaré en la teoría de números no son iguales a los de Gauss...".', feedback_error: '¡Es una pregunta literal! 📖 Busca el nombre "Dieudonné" y lee en qué teoría los descubrimientos de Poincaré "no son iguales" a los de Gauss.' }
          ]
        }
      },
      {
        id: 'sec-2-2',
        capituloId: 'cap-2',
        materiaId: 'comp-lectora',
        title: '2. Evaluar Propósitos y Relaciones',
        introduccion: 'Seguimos con el artículo de opinión. Las preguntas se centrarán en tu habilidad para interpretar por qué el autor menciona ciertos ejemplos y evaluar las diferencias entre los campos de la ciencia.',
        datos_claves: [
          'Propósito de las preguntas retóricas: Cuando un autor pregunta algo como "¿Maxwell, quién fue Maxwell?", no busca respuesta literal, sino demostrar un punto.',
          'Comparaciones clave: Si el texto contrasta dos áreas (como matemáticas vs. biología), anota la diferencia principal que el autor establece.'
        ],
        order: 2,
        test: {
          id: 'test-2-2',
          seccionId: 'sec-2-2',
          contexto_base: 'Y esto sucedía en Matemáticas, la disciplina en la que posiblemente perduren más, tengan más presencia, sean de más permanente actualidad grandes nombres del pasado que forjaron problemas... Por el contrario, muchos de los grandes nombres del pasado en física o en biología... sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble... Para comunicarse hace falta una cierta cultura común, que sirva de eslabón entre generaciones...',
          preguntas: [
            { id: 14, enunciado: '¿Con qué finalidad el emisor cuenta la anécdota sobre Poincaré?', alternativas: { A: 'Para criticar el escaso interés de las nuevas generaciones por conocer a quienes marcaron un precedente.', B: 'Para evidenciar las razones por las que es necesario que las nuevas generaciones conozcan a quienes transformaron el mundo.', C: 'Para argumentar que la educación debe reconocer los logros de figuras que han sido olvidadas.', D: 'Para demostrar que existen figuras fundamentales en el desarrollo de las ciencias que resultan desconocidas para las nuevas generaciones.' }, respuesta_correcta: 'D', feedback_acierto: '¡Excelente lectura entre líneas! 🎭 La historia sirve como prueba de la preocupante pérdida de memoria histórica.', feedback_error: '¡Cuidado con sobreinterpretar! 🧠 El autor constata un hecho, no da razones de por qué es importante.' },
            { id: 15, enunciado: '¿Por qué el emisor señala la importancia de reconocer el aporte de matemáticos relevantes?', alternativas: { A: 'Porque sus trabajos permiten la aplicación de enfoques multidisciplinarios.', B: 'Porque sus contribuciones son útiles para abordar problemáticas vigentes.', C: 'Porque sus teorías enriquecen el razonamiento lógico de los estudiantes.', D: 'Porque sus modelos contribuyen al desarrollo de otras áreas científicas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! 🏆 Las conjeturas del pasado "no han perdido contemporaneidad", es decir, siguen vigentes.', feedback_error: '¡Vuelve al texto! 🔍 El autor dice que ellos forjaron problemas que "no han perdido contemporaneidad".' },
            { id: 16, enunciado: 'Según la lectura, ¿quién mejoró los logros de Copérnico?', alternativas: { A: 'Ptolomeo.', B: 'Watson.', C: 'Mendel.', D: 'Hubble.' }, respuesta_correcta: 'D', feedback_acierto: '¡Rastreo perfecto! 🎯 "Ptolomeo a Copérnico y este a Hubble".', feedback_error: 'Sigue la cadena. 🧬 Busca "Ptolomeo a Copérnico y este a...".' },
            { id: 17, enunciado: '¿En qué se diferencian los logros de la matemática de los logros de la biología?', alternativas: { A: 'En que los logros de la matemática son aplicables a otras disciplinas, mientras que los de la biología están restringidos.', B: 'En que los logros de la matemática siguen siendo empleados a pesar del paso de los años, mientras que los de la biología se transforman con el tiempo.', C: 'En que los logros de la matemática son valorados por quienes pertenecen a dicha área, mientras que los de la biología son reconocidos universalmente.', D: 'En que los logros de la matemática permiten comprender contextos abstractos, mientras que los de la biología explican contextos concretos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante comparación! ✨ La matemática tiene "permanente actualidad", mientras que la biología/física cambian.', feedback_error: 'Compara los párrafos. ⚖️ Matemática: "permanente actualidad". Biología/física: "mejorados sustancialmente".' }
          ]
        }
      }
    ]
  }
];
