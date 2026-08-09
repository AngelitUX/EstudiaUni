import { Materia, Capitulo } from '../models/paes.models';

export const MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '🧮', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🔬', order: 4, isActive: false },
];

export const CAPITULOS: Capitulo[] = [
  // ── CAPÍTULO 1 ──
  {
    id: 'cap-1',
    materiaId: 'comp-lectora',
    title: 'Habilidad 1: Localizar',
    introduccion: 'La habilidad de Localizar consiste en identificar y extraer información explícita de un texto. En la PAES, esta habilidad representa cerca del 30% de las preguntas. Aprenderás a rastrear datos exactos, distinguir causas de consecuencias, y reconocer paráfrasis.',
    order: 1,
    secciones: [
         // ── NODO 1: GUÍA INICIAL ──
      {
        id: 'sec-1-0-guia', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 1, order: 1, tags: ['subcapitulo:Introducción'],
        isSlideGuide: true,
        title: 'Textos Informativos vs Narrativos',
        introduccion: 'Antes de comenzar a rastrear información, es fundamental distinguir los dos grandes tipos de textos que evaluarás en la PAES.',
        guia_titulo: '¿Cómo diferenciarlos?',
        guia_contenido: '<p><strong>Textos Informativos:</strong> Buscan transmitir datos, hechos y conocimientos objetivos. Ejemplos: noticias, artículos científicos, manuales y ensayos. Su lenguaje es claro, directo y estructurado.</p><p><strong>Textos Narrativos:</strong> Cuentan una historia, ya sea real o ficticia, a través de personajes en un tiempo y espacio determinados. Ejemplos: cuentos, novelas, mitos y fábulas. Su lenguaje suele ser más descriptivo y emotivo.</p><p>Al identificar el tipo de texto, sabrás de inmediato si debes enfocarte en hechos duros (informativos) o en acciones y motivaciones de personajes (narrativos). ¡Esta es la base visual de nuestras guías para facilitar tu estudio!</p>',
        datos_claves: [
          'Informativos: Transmiten datos y hechos objetivos (ej. noticias, manuales).',
          'Narrativos: Cuentan historias de personajes en un tiempo y espacio (ej. cuentos, mitos).',
          'Identificar el tipo de texto te ayuda a saber qué buscar: hechos vs motivaciones.',
        ],
        test: {
          id: 'test-1-0-guia', seccionId: 'sec-1-0-guia',
          contexto_base: 'Lee el resumen de arriba para responder.',
          preguntas: [
            { id: 99, enunciado: 'Según el texto, ¿cuál de los siguientes es un ejemplo de texto narrativo?', alternativas: { A: 'Un artículo científico.', B: 'Una noticia de periódico.', C: 'Un mito.', D: 'Un manual de instrucciones.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Los mitos cuentan historias con personajes y entran en la categoría narrativa.', feedback_error: 'Revisa la descripción de los Textos Narrativos en la guía. ¿Cuáles son los ejemplos que da?' }
          ]
        }
      },
      // ── NODO 2: PRÁCTICA CATEGORIZAR ──
      {
        id: 'sec-1-1-categorize', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 2, order: 2, tags: ['subcapitulo:Introducción'],
        title: 'Práctica: Categorizar',
        introduccion: 'Clasifica los textos según su tipo.',
        datos_claves: [],
        isPractice: true,
        practiceType: 'categorize',
        practiceData: {
          title: '¿Informativo o Narrativo?',
          description: 'Clasifica los siguientes fragmentos arrastrándolos a la categoría correcta.',
          categories: ['Informativo', 'Narrativo'],
          items: [
            { id: 1, text: 'El calentamiento global ha elevado la temperatura promedio del océano en 1.5 grados.', category: 'Informativo' },
            { id: 2, text: 'Una vez, en un reino muy lejano, existía un dragón que custodiaba un tesoro.', category: 'Narrativo' },
            { id: 3, text: 'La mitosis es el proceso de división celular que resulta en dos células hijas idénticas.', category: 'Informativo' },
            { id: 4, text: 'El anciano miró por la ventana, recordando con nostalgia su juventud perdida en el mar.', category: 'Narrativo' },
            { id: 5, text: 'El Banco Central anunció hoy un recorte en las tasas de interés para estimular la economía.', category: 'Informativo' },
            { id: 6, text: 'Lucía corrió tan rápido como pudo, pero el tren ya había partido hacia la ciudad.', category: 'Narrativo' }
          ]
        }
      },
      // ── NODO 3: RASTREAR INFO I (INFORMATIVOS) ──
      {
        id: 'sec-1-2-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 3, order: 3, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Rastrear info I (Informativos)',
        introduccion: 'Busca el dato exacto en un texto que expone información clara.',
        datos_claves: ['Subraya fechas y nombres', 'Evita leer de corrido; haz un escaneo rápido'],
        test: {
          id: 'test-1-2-inf', seccionId: 'sec-1-2-inf',
          contexto_base: 'El telescopio espacial James Webb (JWST) es un observatorio espacial desarrollado mediante la colaboración de 14 países, siendo construido y operado conjuntamente por la NASA, la Agencia Espacial Europea (ESA) y la Agencia Espacial Canadiense (CSA). Fue lanzado el 25 de diciembre de 2021 a bordo de un cohete Ariane 5 desde el Puerto Espacial de Kourou, en la Guayana Francesa. Su objetivo principal es observar algunos de los eventos y objetos más distantes del universo, como la formación de las primeras galaxias.',
          preguntas: [
            { id: 101, enunciado: 'Según el texto, ¿desde dónde fue lanzado el telescopio espacial James Webb?', alternativas: { A: 'Desde la Agencia Espacial Europea.', B: 'Desde el Puerto Espacial de Kourou.', C: 'Desde la Agencia Espacial Canadiense.', D: 'Desde el centro de la NASA.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Encontraste el dato exacto en el texto.', feedback_error: 'Revisa la segunda oración del texto y busca el lugar desde donde fue lanzado.' },
            { id: 1011, enunciado: '¿Qué agencias construyeron y operan conjuntamente el telescopio?', alternativas: { A: 'Solo la NASA.', B: 'ESA y CSA exclusivamente.', C: 'NASA, ESA y CSA.', D: '14 países independientes.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Son tres agencias las que operan el telescopio.', feedback_error: 'Lee la primera oración y fíjate en las siglas mencionadas.' },
            { id: 1012, enunciado: '¿En qué fecha se realizó el lanzamiento del telescopio?', alternativas: { A: '25 de diciembre de 2021', B: '24 de diciembre de 2021', C: '25 de diciembre de 2022', D: '31 de diciembre de 2021' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien! El scanning funcionó a la perfección.', feedback_error: 'Busca el número "25" o "2021" en el texto.' },
            { id: 1013, enunciado: '¿Cuál es uno de los objetivos principales del JWST?', alternativas: { A: 'Viajar a otras galaxias.', B: 'Observar la formación de las primeras galaxias.', C: 'Llevar astronautas a la Luna.', D: 'Descubrir nuevos planetas habitables.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente rastreo del objetivo final!', feedback_error: 'Busca la palabra "objetivo" en el texto.' }
          ]
        }
      },
      // ── NODO 4: RASTREAR INFO I (NARRATIVOS) ──
      {
        id: 'sec-1-3-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 3, order: 4, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Rastrear info I (Narrativos)',
        introduccion: 'Ubica detalles específicos en cuentos o historias.',
        datos_claves: ['Presta atención a las descripciones físicas', 'Fíjate en dónde ocurre la acción principal'],
        test: {
          id: 'test-1-3-nar', seccionId: 'sec-1-3-nar',
          contexto_base: 'Aquella mañana, el anciano relojero limpió cuidadosamente el cristal del escaparate de su pequeña tienda en la calle de los Olmos. Llevaba puesto su delantal de cuero desgastado, el mismo que le regaló su abuelo hacía cuarenta años. En su mesa de trabajo, un antiguo reloj de bolsillo dorado esperaba ser reparado, marcando las tres en punto con sus manecillas oxidadas.',
          preguntas: [
            { id: 102, enunciado: 'En el relato, ¿dónde se ubica la pequeña tienda del relojero?', alternativas: { A: 'En la calle del Cuero.', B: 'Junto a un escaparate dorado.', C: 'En la calle de los Olmos.', D: 'Frente a su mesa de trabajo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! En la primera línea se menciona directamente la ubicación.', feedback_error: 'Busca el nombre de la calle en la primera oración del texto.' },
            { id: 1021, enunciado: '¿Qué prenda llevaba puesta el anciano?', alternativas: { A: 'Un traje dorado.', B: 'Un delantal de cuero desgastado.', C: 'Un abrigo de invierno.', D: 'Un reloj de bolsillo en la solapa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien hecho! Rastreaste el detalle de la vestimenta.', feedback_error: 'Lee la segunda oración del texto.' },
            { id: 1022, enunciado: '¿Quién le regaló esa prenda al relojero y cuándo?', alternativas: { A: 'Su abuelo, hace cuarenta años.', B: 'Su padre, hace veinte años.', C: 'Su esposa, recientemente.', D: 'Un cliente, hace cuarenta años.' }, respuesta_correcta: 'A', feedback_acierto: '¡Perfecto! El texto menciona que fue su abuelo quien se lo regaló hace cuarenta años.', feedback_error: 'El texto menciona directamente quién se lo regaló en la segunda línea.' },
            { id: 1023, enunciado: '¿Qué objeto esperaba sobre la mesa de trabajo?', alternativas: { A: 'Un cristal roto.', B: 'Un nuevo delantal.', C: 'Un antiguo reloj de bolsillo dorado.', D: 'Herramientas oxidadas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Rastreaste la acción del final del párrafo.', feedback_error: 'Observa la última oración del fragmento.' }
          ]
        }
      },
      // ── NODO 5: PRO TIP 1 ──
      {
        id: 'sec-1-4-tip', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 4, order: 5, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Pro Tip: Escaneo Visual',
        isProTip: true,
        introduccion: '¡No leas todo otra vez! Usa el Scanning.',
        datos_claves: [
          'La técnica del Scanning consiste en buscar una palabra clave específica sin leer el resto del texto.',
          'Si la pregunta dice "¿En qué año...?", tus ojos solo deben buscar números.',
          'Si la pregunta pregunta por "Juan", tus ojos buscan la letra J mayúscula.',
          'Usa el dedo o el lápiz para guiar tus ojos rápidamente por las líneas.'
        ],
        test: {
          id: 'test-1-4-tip', seccionId: 'sec-1-4-tip',
          contexto_base: 'Lee este tip de ninja.',
          preguntas: [
            { id: 1000, enunciado: '¿Qué es el Scanning?', alternativas: { A: 'Leer cada palabra lentamente.', B: 'Buscar visualmente palabras clave o números.', C: 'Memorizar todo el texto.', D: 'Ignorar las preguntas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Eso! Es un superpoder de la PAES.', feedback_error: 'Revisa el primer punto.' }
          ]
        }
      },
      // ── NODO 6: PRÁCTICA RÁPIDA ──
      {
          id: 'sec-1-5-rapid-1', capituloId: 'cap-1', materiaId: 'comp-lectora',
          level: 5, order: 6.1, tags: ['subcapitulo:Rastrear Datos'],
          isPractice: true, practiceType: 'rapid',
          title: 'Modo Ráfaga: Historia',
          introduccion: 'Aplica el Scanning a toda velocidad. Escanea números, fechas, nombres propios y datos específicos sin leer el texto completo.',
          datos_claves: [],
          test: {
            id: 'test-1-5-rapid-1', seccionId: 'sec-1-5-rapid-1',
            contexto_base: 'La Revolución Francesa, iniciada en 1789, marcó un hito en la historia de Europa al poner fin a la monarquía absoluta de Luis XVI. Durante este período, el 14 de julio de 1789, ocurrió la famosa Toma de la Bastilla, una prisión en París que simbolizaba el poder real. Un mes después, el 26 de agosto, se promulgó la Declaración de los Derechos del Hombre y del Ciudadano. Destacan figuras clave como Maximilien Robespierre, líder de los jacobinos durante la época conocida como "El Terror", y Jean-Paul Marat, periodista radical asesinado en 1793. Las revueltas también impulsaron el lema "Libertad, Igualdad, Fraternidad", que se popularizó en 1790. Finalmente, en 1799, Napoleón Bonaparte dio un golpe de Estado que puso fin al Directorio.',
            preguntas: [
              { id: 10301, enunciado: 'Según el texto, ¿en qué fecha exacta ocurrió la Toma de la Bastilla?', alternativas: { A: '14 de julio de 1789', B: '26 de agosto de 1789', C: '14 de junio de 1789', D: '14 de julio de 1790' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien escaneado!', feedback_error: 'Busca las palabras "Toma de la Bastilla" y lee la fecha que le antecede.' },
              { id: 10302, enunciado: '¿Qué día y mes se promulgó la Declaración de los Derechos del Hombre?', alternativas: { A: '14 de julio', B: '26 de agosto', C: '15 de abril', D: '26 de julio' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! El 26 de agosto es la fecha exacta que acompaña la mención de la Declaración.', feedback_error: 'Escanea buscando "Declaración de los Derechos del Hombre".' },
              { id: 10303, enunciado: '¿Cuál era el nombre de pila del periodista radical asesinado?', alternativas: { A: 'Maximilien', B: 'Luis', C: 'Jean-Paul', D: 'Napoleón' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente rastreo!', feedback_error: 'Busca la palabra "periodista" en el texto.' },
              { id: 10304, enunciado: '¿En qué año fue asesinado Jean-Paul Marat?', alternativas: { A: '1789', B: '1790', C: '1793', D: '1799' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Ubica el nombre "Marat" y el año contiguo.' },
              { id: 10305, enunciado: '¿Quién dio un golpe de Estado en el año 1799?', alternativas: { A: 'Maximilien Robespierre', B: 'Napoleón Bonaparte', C: 'Luis XVI', D: 'Jean-Paul Marat' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy rápido!', feedback_error: 'Busca el número "1799" y lee el nombre que lo acompaña.' }
            ]
          }
        },
        // 🚀 NODO 6.2: PRÁCTICA RÁPIDA (CIENCIA) 🚀
        {
          id: 'sec-1-5-rapid-2', capituloId: 'cap-1', materiaId: 'comp-lectora',
          level: 5, order: 6.2, tags: ['subcapitulo:Rastrear Datos'],
          isPractice: true, practiceType: 'rapid',
          title: 'Modo Ráfaga: Ciencias',
          introduccion: 'Segunda ronda. Escanea porcentajes y descubrimientos científicos a toda velocidad.',
          datos_claves: [],
          test: {
            id: 'test-1-5-rapid-2', seccionId: 'sec-1-5-rapid-2',
            contexto_base: 'El hidrógeno es el elemento químico más abundante del universo, constituyendo aproximadamente el 75% de toda la materia bariónica. En nuestro sistema solar, el Sol está compuesto en un 73% de hidrógeno y un 25% de helio. Este elemento fue descubierto formalmente en 1766 por el científico británico Henry Cavendish, quien lo denominó "aire inflamable". Más tarde, en 1783, Antoine Lavoisier le dio el nombre de hidrógeno, que significa "creador de agua" en griego. A nivel atómico, el hidrógeno es el elemento más ligero, con un peso atómico de 1.008 y solo posee un electrón. Actualmente, se investiga su uso como combustible limpio para reducir las emisiones globales de CO2 en un 20% para el año 2040.',
            preguntas: [
              { id: 10306, enunciado: 'Según el texto, ¿qué porcentaje del Sol está compuesto por helio?', alternativas: { A: '75%', B: '73%', C: '25%', D: '20%' }, respuesta_correcta: 'C', feedback_acierto: '¡Eso es scanning nivel experto!', feedback_error: 'Escanea la palabra "helio" y fíjate en el porcentaje a su lado. ¡Cuidado con el 73% que es del hidrógeno!' },
              { id: 10307, enunciado: '¿En qué año fue descubierto formalmente el hidrógeno?', alternativas: { A: '1766', B: '1783', C: '2040', D: '1008' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El texto señala 1766 como el año del descubrimiento del hidrógeno.', feedback_error: 'Busca la palabra "descubierto".' },
              { id: 10308, enunciado: '¿Cómo denominó inicialmente Henry Cavendish a este elemento?', alternativas: { A: 'Creador de agua', B: 'Materia bariónica', C: 'Combustible limpio', D: 'Aire inflamable' }, respuesta_correcta: 'D', feedback_acierto: '¡Genial!', feedback_error: 'Busca el nombre "Cavendish" y lee lo que está entre comillas.' },
              { id: 10309, enunciado: '¿Qué científico le dio el nombre definitivo de hidrógeno?', alternativas: { A: 'Henry Cavendish', B: 'Antoine Lavoisier', C: 'Maximilien Robespierre', D: 'Jean-Paul Marat' }, respuesta_correcta: 'B', feedback_acierto: '¡Rastreado con éxito!', feedback_error: 'Busca el año "1783" o la palabra "nombre".' },
              { id: 10310, enunciado: '¿Cuál es la meta de reducción de emisiones de CO2 para el año 2040?', alternativas: { A: '75%', B: '73%', C: '25%', D: '20%' }, respuesta_correcta: 'D', feedback_acierto: '¡Bien hecho!', feedback_error: 'Busca el año 2040 y ve el porcentaje mencionado.' }
            ]
          }
        },
        // 🚀 NODO 6.3: PRÁCTICA RÁPIDA (COTIDIANO) 🚀
        {
          id: 'sec-1-5-rapid-3', capituloId: 'cap-1', materiaId: 'comp-lectora',
          level: 5, order: 6.3, tags: ['subcapitulo:Rastrear Datos'],
          isPractice: true, practiceType: 'rapid',
          title: 'Modo Ráfaga: Cotidiano',
          introduccion: 'Última ronda. Escanea precios, cantidades y horas en esta historia del día a día.',
          datos_claves: [],
          test: {
            id: 'test-1-5-rapid-3', seccionId: 'sec-1-5-rapid-3',
            contexto_base: 'El sábado por la mañana, María llegó al gran Mercado de San Juan exactamente a las 08:30 a.m. Su primera parada fue el puesto número 42, atendido por Don Pedro, donde compró 3 kilos de manzanas verdes a $1.200 el kilo y 2 kilos de peras a $950 el kilo. Luego, caminó hacia el sector sur del mercado, al puesto "La Alegría", para comprar 5 plátanos y una sandía gigante que pesaba 8 kilos. En total, María gastó $14.500 en todas sus compras. Antes de irse a las 11:15 a.m., pasó por la floristería de Doña Rosa en el pasillo 3 y compró 12 rosas rojas para el cumpleaños de su madre, el cual se celebraría el domingo 15 de abril.',
            preguntas: [
              { id: 10311, enunciado: '¿A qué hora exacta llegó María al mercado de San Juan?', alternativas: { A: '08:30 a.m.', B: '11:15 a.m.', C: '09:00 a.m.', D: '08:00 a.m.' }, respuesta_correcta: 'A', feedback_acierto: '¡Al instante!', feedback_error: 'Escanea la primera oración del texto buscando formato de hora.' },
              { id: 10312, enunciado: '¿Cuál era el número del puesto atendido por Don Pedro?', alternativas: { A: '3', B: '42', C: '12', D: '15' }, respuesta_correcta: 'B', feedback_acierto: '¡Preciso!', feedback_error: 'Escanea la palabra "puesto" cerca de "Pedro".' },
              { id: 10313, enunciado: '¿Cuánto costaba el kilo de peras?', alternativas: { A: '$1.200', B: '$950', C: '$14.500', D: '$15.000' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien escaneado!', feedback_error: 'Busca la palabra "peras" y fíjate en el precio.' },
              { id: 10314, enunciado: '¿Cuánto pesaba la sandía gigante que compró en el sector sur?', alternativas: { A: '2 kilos', B: '3 kilos', C: '5 kilos', D: '8 kilos' }, respuesta_correcta: 'D', feedback_acierto: '¡Perfecto! La sandía gigante que compró en el sector sur pesaba 8 kilos.', feedback_error: 'Busca la palabra "sandía".' },
              { id: 10315, enunciado: '¿Qué día y fecha exactos se celebraría el cumpleaños de la madre?', alternativas: { A: 'Sábado 14 de abril', B: 'Domingo 15 de abril', C: 'Lunes 16 de abril', D: 'Domingo 26 de agosto' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! Has terminado la ráfaga de scanning.', feedback_error: 'Busca la palabra "cumpleaños" al final del texto.' }
            ]
          }
        },
      // ── NODO 7: RASTREAR INFO II (INFORMATIVOS) ──
      {
        id: 'sec-1-6-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 6, order: 7, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Rastrear info II (Informativos)',
        introduccion: 'Aumentamos la dificultad buscando datos secundarios.',
        datos_claves: ['Cuidado con los distractores numéricos'],
        test: {
          id: 'test-1-6-inf', seccionId: 'sec-1-6-inf',
          contexto_base: 'La energía eólica en Chile ha experimentado un crecimiento exponencial. En 2014, el país contaba con apenas 836 MW de capacidad instalada eólica. Diez años después, en 2024, esa cifra más que se quintuplicó, alcanzando los 4.500 MW, lo que representa cerca del 14% de la matriz energética nacional. Gran parte de estos proyectos se concentran en las regiones de Coquimbo y Atacama.',
          preguntas: [
            { id: 106, enunciado: 'De acuerdo con el fragmento, ¿cuál era la capacidad instalada eólica en Chile en el año 2014?', alternativas: { A: '14 MW', B: '836 MW', C: '4.500 MW', D: 'Se quintuplicó.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien rastreado!', feedback_error: 'Vuelve al texto y busca específicamente la cifra que acompaña al año 2014.' },
            { id: 1061, enunciado: '¿En qué año la capacidad instalada alcanzó los 4.500 MW?', alternativas: { A: '2014', B: '2019', C: '2024', D: '2030' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! Escaneaste el año correcto.', feedback_error: 'Busca el año que está junto a la cifra 4.500 MW.' },
            { id: 1062, enunciado: '¿Qué porcentaje de la matriz energética nacional representa esa cifra?', alternativas: { A: '10%', B: '14%', C: '24%', D: '50%' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! El distractor 24% no te engañó.', feedback_error: 'Busca el símbolo % en el texto.' },
            { id: 1063, enunciado: '¿En qué regiones se concentra gran parte de los proyectos?', alternativas: { A: 'Santiago y Valparaíso', B: 'Atacama y Antofagasta', C: 'Coquimbo y Atacama', D: 'Coquimbo y Valparaíso' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Rastreaste el último dato del texto.', feedback_error: 'Lee la última oración del párrafo.' }
          ]
        }
      },
      // ── NODO 8: PRO TIP 2 ──
      {
        id: 'sec-1-7-tip', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 6, order: 8, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Pro Tip: Trampas Numéricas',
        isProTip: true,
        introduccion: 'El DEMRE ama poner todos los números del texto en las alternativas.',
        datos_claves: [
          'En el ejercicio anterior vimos: 2014, 836, 10, 2024, 4500, 14.',
          'Si la pregunta es sobre 2014, debes descartar de inmediato los números asociados a 2024.',
          'Nunca elijas un número solo porque "sale en el texto".',
          'Asegúrate de que el número responda a lo que te preguntan exactamente.'
        ],
        test: {
          id: 'test-1-7-tip', seccionId: 'sec-1-7-tip',
          contexto_base: 'Juan tiene 5 manzanas. Pedro tiene 8. En total hay 13.',
          preguntas: [
            { id: 1001, enunciado: '¿Cuántas manzanas tiene Juan?', alternativas: { A: '5', B: '8', C: '13', D: '3' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! El 8 y el 13 son distractores que están en el texto.', feedback_error: 'Identifica al sujeto de la pregunta: Juan.' }
          ]
        }
      },
      // ── NODO 9: RASTREAR INFO II (NARRATIVOS) ──
      {
        id: 'sec-1-8-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 7, order: 9, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Rastrear info II (Narrativos)',
        introduccion: 'Localiza información sobre los sentimientos y reacciones de los personajes.',
        datos_claves: ['Busca adjetivos que describan la actitud de los personajes'],
        test: {
          id: 'test-1-8-nar', seccionId: 'sec-1-8-nar',
          contexto_base: 'Marta observó la carta cerrada sobre la mesa del comedor. Llevaba el sello lacrado de la universidad. Sus manos temblaban de manera incontrolable, no por frío, sino por una mezcla abrumadora de esperanza y pánico. Si la respuesta era negativa, tendría que volver a trabajar en la panadería de sus tíos, despidiéndose de su sueño de estudiar astronomía.',
          preguntas: [
            { id: 107, enunciado: '¿Qué le generaba a Marta la visión de la carta cerrada?', alternativas: { A: 'Un profundo frío en las manos.', B: 'Mucha nostalgia por la panadería.', C: 'Una mezcla abrumadora de esperanza y pánico.', D: 'Desilusión ante la universidad.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! Rastreaste el sentimiento exacto.', feedback_error: 'Lee con atención por qué le temblaban las manos según el texto.' },
            { id: 1071, enunciado: '¿De dónde provenía la carta?', alternativas: { A: 'De la panadería de sus tíos.', B: 'De la universidad.', C: 'De un observatorio astronómico.', D: 'De un banco.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Detectaste el origen de la carta.', feedback_error: 'Revisa la segunda oración que menciona el sello.' },
            { id: 1072, enunciado: '¿A qué se tendrían que dedicar Marta si la respuesta fuera negativa?', alternativas: { A: 'A trabajar en la universidad.', B: 'A trabajar en la panadería de sus tíos.', C: 'A estudiar astronomía en otro lado.', D: 'A buscar empleo en la ciudad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El final del texto explica que volvería a la panadería de sus tíos si la respuesta fuera negativa.', feedback_error: 'El final del texto explica qué pasaría si fuera rechazada.' },
            { id: 1073, enunciado: '¿Cuál es el sueño de Marta?', alternativas: { A: 'Estudiar astronomía.', B: 'Ser dueña de la panadería.', C: 'Recibir muchas cartas.', D: 'Viajar lejos de sus tíos.' }, respuesta_correcta: 'A', feedback_acierto: '¡Excelente, rastreaste la motivación final!', feedback_error: 'Lee las últimas tres palabras del fragmento.' }
          ]
        }
      },
      // ── NODO 10: MINIJUEGO SINÓNIMOS ──
      {
        id: 'sec-1-9-syn', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 8, order: 10, tags: ['subcapitulo:Vocabulario'],
        title: 'Práctica: Sinónimos en Contexto',
        introduccion: 'Rastrear palabras difíciles es común. ¡Entrena tu vocabulario!',
        datos_claves: [],
        isPractice: true,
        practiceType: 'synonyms',
        practiceData: {
          title: 'Conecta el Sinónimo',
          description: 'Aplica el rastreo y une la palabra con el sinónimo que mejor la reemplace.',
          rounds: [
              {
                pairs: [
                  { id: 1, word: 'Impugnado', synonym: 'Cuestionado', hint: 'Rechazar la validez de una idea o decisión.' },
                  { id: 2, word: 'Ambiguas', synonym: 'Confusas', hint: 'Que puede entenderse de varios modos.' },
                  { id: 3, word: 'Estragos', synonym: 'Daños', hint: 'Ruina, daño o destrucción.' }
                ]
              },
              {
                pairs: [
                  { id: 4, word: 'Abundante', synonym: 'Copioso', hint: 'En gran cantidad.' },
                  { id: 5, word: 'Nostalgia', synonym: 'Añoranza', hint: 'Pena por la ausencia de algo querido.' },
                  { id: 6, word: 'Estimular', synonym: 'Incentivar', hint: 'Impulsar a alguien a hacer algo.' }
                ]
              },
              {
                pairs: [
                  { id: 7, word: 'Erudito', synonym: 'Sabio', hint: 'Instruido en varias ciencias, artes o letras.' },
                  { id: 8, word: 'Afable', synonym: 'Amable', hint: 'Agradable y suave en la conversación y el trato.' },
                  { id: 9, word: 'Intrincado', synonym: 'Complejo', hint: 'Enredado, complicado, confuso.' }
                ]
              },
              {
                pairs: [
                  { id: 10, word: 'Efímero', synonym: 'Pasajero', hint: 'Que tiene poca duración.' },
                  { id: 11, word: 'Lúgubre', synonym: 'Sombrío', hint: 'Triste, funesto y melancólico.' },
                  { id: 12, word: 'Audaz', synonym: 'Valiente', hint: 'Osado, atrevido.' }
                ]
              },
              {
                pairs: [
                  { id: 13, word: 'Inerte', synonym: 'Inmóvil', hint: 'Falto de vida o movilidad.' },
                  { id: 14, word: 'Perspicaz', synonym: 'Agudo', hint: 'Que percibe detalles que a otros se les escapan.' },
                  { id: 15, word: 'Sagaz', synonym: 'Astuto', hint: 'Astuto y prudente, que prevé y previene las cosas.' }
                ]
              },
              {
                pairs: [
                  { id: 16, word: 'Perplejo', synonym: 'Confundido', hint: 'Dudoso, incierto, irresoluto.' },
                  { id: 17, word: 'Tenaz', synonym: 'Perseverante', hint: 'Firme, porfiado y constante en un propósito.' },
                  { id: 18, word: 'Holgazán', synonym: 'Perezoso', hint: 'Vagabundo ocioso que no quiere trabajar.' }
                ]
              },
              {
                pairs: [
                  { id: 19, word: 'Frugal', synonym: 'Económico', hint: 'Parco en comer y beber, ahorrativo.' },
                  { id: 20, word: 'Suntuoso', synonym: 'Lujoso', hint: 'Grande, costoso y espléndido.' },
                  { id: 21, word: 'Opulento', synonym: 'Rico', hint: 'Que tiene gran abundancia o riqueza.' }
                ]
              },
              {
                pairs: [
                  { id: 22, word: 'Inexorable', synonym: 'Implacable', hint: 'Que no se deja vencer con ruegos o lágrimas.' },
                  { id: 23, word: 'Melancólico', synonym: 'Triste', hint: 'Que tiene tristeza profunda y sosegada.' },
                  { id: 24, word: 'Iracundo', synonym: 'Furioso', hint: 'Propenso a la ira o poseído por ella.' }
                ]
              },
              {
                pairs: [
                  { id: 25, word: 'Clandestino', synonym: 'Oculto', hint: 'Secreto, oculto, especialmente hecho en contra de la ley.' },
                  { id: 26, word: 'Furtivo', synonym: 'Secreto', hint: 'Que se hace a escondidas.' },
                  { id: 27, word: 'Evidente', synonym: 'Obvio', hint: 'Cierto, claro, patente y sin la menor duda.' }
                ]
              },
              {
                pairs: [
                  { id: 28, word: 'Magnánimo', synonym: 'Generoso', hint: 'Que tiene grandeza y elevación de ánimo.' },
                  { id: 29, word: 'Mezquino', synonym: 'Tacaño', hint: 'Que escatima en el gasto.' },
                  { id: 30, word: 'Altruista', synonym: 'Solidario', hint: 'Que procura el bien ajeno aun a costa del propio.' }
                ]
              }
            ]
        }
      },
      // ── NODO 11: RASTREAR INFO III (CAUSAS Y CONSECUENCIAS) ──
      {
        id: 'sec-1-10-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 9, order: 11, tags: ['subcapitulo:Causas y Consecuencias'],
        title: 'Rastrear Causas (Informativos)',
        introduccion: 'Localiza causas y consecuencias directas en un texto expositivo.',
        datos_claves: ['Fíjate en conectores como "debido a", "provocó", "como resultado"'],
        test: {
          id: 'test-1-10-inf', seccionId: 'sec-1-10-inf',
          contexto_base: 'El derretimiento del permafrost en el Ártico no solo afecta a las infraestructuras locales, sino que tiene un impacto global. Este fenómeno, causado por el aumento acelerado de las temperaturas, provoca la liberación de enormes cantidades de metano, un gas de efecto invernadero mucho más potente que el dióxido de carbono. Como resultado, se acelera aún más el calentamiento global, creando un ciclo de retroalimentación climática.',
          preguntas: [
            { id: 108, enunciado: 'Según el texto, ¿qué causa el derretimiento del permafrost en el Ártico?', alternativas: { A: 'La liberación de enormes cantidades de metano.', B: 'La debilidad de las infraestructuras locales.', C: 'El ciclo de retroalimentación climática.', D: 'El aumento acelerado de las temperaturas.' }, respuesta_correcta: 'D', feedback_acierto: '¡Exacto! El texto dice "...causado por el aumento acelerado de las temperaturas...".', feedback_error: '¡Cuidado! Te están pidiendo la CAUSA del derretimiento, no la consecuencia.' },
            { id: 1081, enunciado: '¿A qué infraestructuras afecta inicialmente el derretimiento?', alternativas: { A: 'Infraestructuras globales.', B: 'Infraestructuras locales.', C: 'Infraestructuras de transporte.', D: 'Redes eléctricas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Encontraste el dato.', feedback_error: 'Revisa la primera línea del texto.' },
            { id: 1082, enunciado: '¿Qué gas es liberado debido a este fenómeno?', alternativas: { A: 'Dióxido de carbono.', B: 'Oxígeno puro.', C: 'Metano.', D: 'Nitrógeno.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! El texto indica que el metano es el gas liberado por este fenómeno.', feedback_error: 'Busca el nombre del gas liberado en la segunda oración.' },
            { id: 1083, enunciado: '¿Cómo es el metano comparado con el dióxido de carbono?', alternativas: { A: 'Menos potente.', B: 'Igual de potente.', C: 'Inofensivo.', D: 'Mucho más potente.' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien rastreado!', feedback_error: 'Lee cómo se describe el gas de efecto invernadero.' }
          ]
        }
      },
      // ── NODO 13: RASTREAR INFO III (ORDEN TEMPORAL) ──
      {
        id: 'sec-1-12-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 9, order: 12, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Orden Temporal (Narrativos)',
        introduccion: 'Rastrea detalles sutiles en la secuencia de eventos.',
        datos_claves: ['Sigue el orden temporal: qué pasó antes y qué después'],
        test: {
          id: 'test-1-12-nar', seccionId: 'sec-1-12-nar',
          contexto_base: 'Al llegar a la cima de la colina, el viajero se detuvo a tomar aire. Atrás dejaba el espeso bosque de robles y el sonido del río caudaloso. Sin perder tiempo, desempacó su libreta de apuntes, esbozó un rápido mapa del valle que se abría a sus pies y finalmente tomó un sorbo de agua de su cantimplora antes de emprender el descenso hacia el pueblo.',
          preguntas: [
            { id: 109, enunciado: 'Según la narración, ¿qué fue lo primero que hizo el viajero tras desempacar su libreta de apuntes?', alternativas: { A: 'Se detuvo a tomar aire.', B: 'Esbozó un rápido mapa del valle.', C: 'Tomó un sorbo de agua de su cantimplora.', D: 'Emprendió el descenso hacia el pueblo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Encontraste el orden exacto de los eventos.', feedback_error: 'Lee con atención la tercera oración. Fíjate qué acción ocurre inmediatamente después de sacar la libreta.' },
            { id: 1091, enunciado: '¿Qué dejaba atrás el viajero al llegar a la cima?', alternativas: { A: 'El pueblo y la cantimplora.', B: 'El valle y su libreta.', C: 'El espeso bosque de robles y el sonido del río.', D: 'La montaña nevada.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente rastreo de información!', feedback_error: 'Lee la segunda oración del texto.' },
            { id: 1092, enunciado: '¿Qué bebió el viajero antes de descender?', alternativas: { A: 'Jugo de frutas.', B: 'Café frío.', C: 'Agua de su cantimplora.', D: 'Agua del río caudaloso.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! El viajero bebió agua de su cantimplora antes de descender.', feedback_error: 'Revisa qué tomó en la última parte del texto.' },
            { id: 1093, enunciado: '¿Hacia dónde se dirigía al final del relato?', alternativas: { A: 'Hacia el bosque de robles.', B: 'Hacia la cima de la colina.', C: 'Hacia el pueblo.', D: 'Hacia el río caudaloso.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! La última oración del relato indica que se dirigía hacia el pueblo.', feedback_error: 'La última oración indica su próximo destino.' }
          ]
        }
      },
      // ── NODO 12: COMPLETAR ORACIONES (CAUSAS Y CONSECUENCIAS) ──
      {
        id: 'sec-1-11-fill', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 10, order: 13, tags: ['subcapitulo:Causas y Consecuencias'],
        title: 'Práctica: Conectores Lógicos',
        introduccion: 'Identifica la estructura de causa y efecto completando las frases.',
        datos_claves: [],
        isPractice: true,
        practiceType: 'fill-blanks',
        practiceData: {
            title: 'Completa la Oración',
            description: 'Selecciona el conector lógico correcto para completar cada oración. Piensa en la relación (causa, consecuencia, contraste, adición) entre las ideas.',
            items: [
              {
                id: 1,
                textBefore: 'El puente colapsó ',
                textAfter: ' los fuertes vientos huracanados.',
                options: ['a pesar de', 'debido a', 'y por lo tanto', 'sin embargo'],
                correctOption: 'debido a',
                hint: 'La oración expresa la CAUSA directa del colapso.'
              },
              {
                id: 2,
                textBefore: 'Había estudiado toda la semana sin descanso. ',
                textAfter: ', aprobó el examen con la nota máxima.',
                options: ['Por el contrario', 'Sin embargo', 'En consecuencia', 'Aunque'],
                correctOption: 'En consecuencia',
                hint: 'Aprobar es el RESULTADO LÓGICO (consecuencia) de haber estudiado mucho.'
              },
              {
                id: 3,
                textBefore: 'La deforestación masiva del bosque ',
                textAfter: ' la migración forzada de decenas de especies.',
                options: ['evitó', 'fue causada por', 'provocó', 'resolvió'],
                correctOption: 'provocó',
                hint: 'La deforestación es la causa que GENERA (provoca) la migración como consecuencia.'
              },
              {
                id: 4,
                textBefore: 'El equipo jugó su mejor partido de la temporada; ',
                textAfter: ', perdieron por un gol en el último minuto.',
                options: ['por ende', 'ya que', 'sin embargo', 'por lo tanto'],
                correctOption: 'sin embargo',
                hint: 'Jugar el mejor partido y perder es una situación de CONTRASTE.'
              },
              {
                id: 5,
                textBefore: 'Cancelaron el vuelo hacia el sur ',
                textAfter: ' la intensa neblina reducía la visibilidad a cero.',
                options: ['aunque', 'debido a que', 'en resumen', 'pero'],
                correctOption: 'debido a que',
                hint: 'La neblina es el MOTIVO (causa) por el cual cancelaron el vuelo.'
              },
              {
                id: 6,
                textBefore: 'El candidato tenía excelentes propuestas para la ciudad; ',
                textAfter: ', no logró convencer a los votantes indecisos.',
                options: ['por consiguiente', 'ya que', 'no obstante', 'porque'],
                correctOption: 'no obstante',
                hint: 'Tener buenas propuestas y no convencer es una situación de CONTRASTE.'
              },
              {
                id: 7,
                textBefore: 'Las redes sociales han modificado nuestra forma de comunicarnos. ',
                textAfter: ', han transformado por completo la publicidad moderna.',
                options: ['Asimismo', 'Aunque', 'A pesar de', 'Por el contrario'],
                correctOption: 'Asimismo',
                hint: 'Ambas oraciones suman información (comunicación + publicidad), es decir, existe una relación de ADICIÓN.'
              },
              {
                id: 8,
                textBefore: 'El director de la obra decidió posponer el estreno ',
                textAfter: ' la actriz principal se enfermó gravemente.',
                options: ['por lo tanto', 'puesto que', 'sin embargo', 'y además'],
                correctOption: 'puesto que',
                hint: 'La enfermedad de la actriz es el MOTIVO (causa) de la postergación.'
              },
              {
                id: 9,
                textBefore: 'Redujeron los costos de producción y aumentaron las ventas. ',
                textAfter: ', la empresa alcanzó cifras récord de ganancias.',
                options: ['Como resultado', 'Mientras tanto', 'Aunque', 'Debido a'],
                correctOption: 'Como resultado',
                hint: 'Las ganancias récord son el RESULTADO de las acciones anteriores.'
              },
              {
                id: 10,
                textBefore: '',
                textAfter: ' llovía intensamente, decidieron continuar con la excursión a la montaña.',
                options: ['Aun cuando', 'Puesto que', 'En resumen', 'Por lo cual'],
                correctOption: 'Aun cuando',
                hint: 'Realizar una excursión mientras llueve intenso implica superar un obstáculo (CONTRASTE o CONCESIÓN).'
              }
            ]
          }
        },
      // ── NODO 14: PRO TIP 3 ──
      {
        id: 'sec-1-13-tip', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 10, order: 14, tags: ['subcapitulo:Rastrear Datos'],
        title: 'Pro Tip: Cronología',
        isProTip: true,
        introduccion: 'Cuidado con el orden en que se cuentan las cosas.',
        datos_claves: [
          'En los textos narrativos, a veces se cuenta primero el final y luego el inicio (flashbacks).',
          'Identifica marcadores de tiempo: "antes de", "después", "mientras", "luego".',
          'Si la pregunta dice "antes de X", busca X y lee la oración que está justo antes o las palabras previas.'
        ],
        test: {
          id: 'test-1-13-tip', seccionId: 'sec-1-13-tip',
          contexto_base: 'Antes de desayunar, corrí por el parque. Luego de comer, me bañé.',
          preguntas: [
            { id: 1002, enunciado: '¿Qué fue lo primero que ocurrió cronológicamente?', alternativas: { A: 'Desayunar', B: 'Bañarse', C: 'Correr', D: 'Comer' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! El "Antes de" indica que correr fue lo primero.', feedback_error: 'Presta atención a los conectores temporales.' }
          ]
        }
      },
      // ── NODO 15: PARÁFRASIS I (INFORMATIVOS) ──
      {
        id: 'sec-1-14-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 11, order: 15, tags: ['subcapitulo:Paráfrasis'],
        title: 'Paráfrasis I (Informativos)',
        introduccion: 'Aprende a reconocer la misma idea escrita con diferentes palabras.',
        datos_claves: ['El significado original no debe cambiar', 'Cuidado con las alternativas que "dicen casi lo mismo" pero exageran (ej: decir "siempre" en vez de "a veces")'],
        test: {
          id: 'test-1-14-inf', seccionId: 'sec-1-14-inf',
          contexto_base: 'El sedentarismo es uno de los principales factores de riesgo para desarrollar enfermedades cardiovasculares en la edad adulta.',
          preguntas: [
            { id: 110, enunciado: '¿Qué opción expresa la misma idea del texto de manera correcta?', alternativas: { A: 'Las enfermedades cardiovasculares suelen aparecer por diversas causas en los adultos, entre ellas el ejercicio.', B: 'La falta de actividad física aumenta considerablemente la probabilidad de sufrir patologías del corazón en los adultos.', C: 'Solo las personas sedentarias desarrollarán problemas cardiovasculares en el futuro.', D: 'El sedentarismo previene las enfermedades crónicas en la etapa de adultez.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! Has identificado la paráfrasis correcta. "Falta de actividad física" equivale a "sedentarismo".', feedback_error: 'Busca la opción que mantenga el mismo significado sin exagerar ni cambiar la afirmación. La opción C dice "Solo las personas" (es una exageración).' },
            { id: 1101, enunciado: 'Según el fragmento, ¿en qué etapa de la vida hay riesgo de desarrollar la enfermedad?', alternativas: { A: 'En la infancia.', B: 'En la juventud.', C: 'En la edad adulta.', D: 'En la vejez.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien rastreado!', feedback_error: 'El texto especifica en la última parte a qué etapa corresponde.' },
            { id: 1102, enunciado: '¿Qué es el sedentarismo según el contexto de la información entregada?', alternativas: { A: 'Un factor protector.', B: 'Una cura cardiovascular.', C: 'Un riesgo nulo.', D: 'Un factor de riesgo principal.' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! El texto indica claramente que el sedentarismo representa un factor de riesgo principal.', feedback_error: 'El texto indica claramente lo que el sedentarismo representa.' },
            { id: 1103, enunciado: '¿Qué término podría ser un buen sinónimo para "enfermedades cardiovasculares"?', alternativas: { A: 'Patologías pulmonares.', B: 'Afecciones del corazón y vasos sanguíneos.', C: 'Problemas estomacales.', D: 'Trastornos neurológicos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente conexión de vocabulario!', feedback_error: 'Cardiovascular está relacionado con el corazón.' }
          ]
        }
      },
      // ── NODO 16: PARÁFRASIS I (NARRATIVOS) ──
      {
        id: 'sec-1-15-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 11, order: 16, tags: ['subcapitulo:Paráfrasis'],
        title: 'Paráfrasis I (Narrativos)',
        introduccion: 'Reconoce cómo reformular los pensamientos o acciones de un personaje.',
        datos_claves: ['Busca sinónimos de las acciones'],
        test: {
          id: 'test-1-15-nar', seccionId: 'sec-1-15-nar',
          contexto_base: 'Al escuchar la noticia, el rostro de Juan palideció súbitamente y sus rodillas cedieron, dejándolo caer pesadamente sobre la vieja silla de madera.',
          preguntas: [
            { id: 111, enunciado: '¿Qué opción expresa de manera equivalente la reacción de Juan?', alternativas: { A: 'Juan se sentó tranquilamente en la silla tras oír lo que le decían.', B: 'La noticia provocó en Juan un ataque de furia incontrolable.', C: 'Juan perdió el color de su rostro y se desplomó en el asiento debido al impacto de la noticia.', D: 'Juan decidió arrodillarse frente a la vieja silla de madera.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Es una excelente reformulación de lo que le sucede físicamente por la sorpresa.', feedback_error: 'Compara la oración original con las alternativas. Palidecer es perder color, ceder las rodillas es desplomarse.' },
            { id: 1111, enunciado: '¿Qué objeto del mobiliario se describe en el texto?', alternativas: { A: 'Una mesa moderna.', B: 'Un viejo sofá.', C: 'Una vieja silla de madera.', D: 'Un taburete de plástico.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! El adjetivo "vieja" y "de madera" lo confirman.', feedback_error: 'Busca cómo se describe la silla.' },
            { id: 1112, enunciado: '¿Qué le ocurrió al rostro de Juan al escuchar la noticia?', alternativas: { A: 'Se sonrojó levemente.', B: 'Palideció súbitamente.', C: 'Se llenó de lágrimas.', D: 'Mostró una gran sonrisa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! El texto señala que el rostro de Juan palideció súbitamente al escuchar la noticia.', feedback_error: 'El texto señala claramente el verbo que indica lo que le pasa a su rostro.' },
            { id: 1113, enunciado: '¿Por qué cayó Juan pesadamente?', alternativas: { A: 'Porque sus rodillas cedieron.', B: 'Porque la silla estaba rota.', C: 'Porque alguien lo empujó.', D: 'Porque resbaló con agua.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! Esa fue la causa de su caída.', feedback_error: 'Revisa la acción que ocurre justo antes de que caiga.' }
          ]
        }
      },
      // ── NODO 17: PRÁCTICA EMPAREJAR (PARÁFRASIS) ──
      {
        id: 'sec-1-16-match', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 12, order: 17, tags: ['subcapitulo:Paráfrasis'],
        title: 'Práctica: Emparejar Paráfrasis',
        introduccion: 'Conecta cada oración con su paráfrasis correspondiente.',
        datos_claves: [],
        isPractice: true,
        practiceType: 'match-pairs',
        practiceData: {
            title: 'Empareja la Paráfrasis',
            description: 'Selecciona una oración de la izquierda y únea con su paráfrasis exacta de la derecha.',
            rounds: [
              {
                pairs: [
                  { id: 1, left: 'La escasez hídrica es un problema severo.', right: 'La falta de agua representa una dificultad grave.' },
                  { id: 2, left: 'El protagonista sintió pavor extremo.', right: 'El personaje principal experimentó un miedo intenso.' },
                  { id: 3, left: 'Las ventas aumentaron de forma exponencial.', right: 'Los ingresos comerciales crecieron a gran velocidad.' }
                ]
              },
              {
                pairs: [
                  { id: 4, left: 'El calentamiento global amenaza la biodiversidad.', right: 'El cambio climático pone en riesgo a múltiples especies.' },
                  { id: 5, left: 'Su comportamiento fue sumamente errático.', right: 'Su forma de actuar resultó muy impredecible.' },
                  { id: 6, left: 'La empresa implementó medidas austeras.', right: 'La compañía aplicó normas de ahorro estricto.' }
                ]
              },
              {
                pairs: [
                  { id: 7, left: 'El desenlace de la película fue ambiguo.', right: 'El final de la cinta tuvo múltiples interpretaciones.' },
                  { id: 8, left: 'La inflación mermó el poder adquisitivo.', right: 'El alza de precios redujo la capacidad de compra.' },
                  { id: 9, left: 'Ese argumento carece de validez empírica.', right: 'Ese razonamiento no tiene pruebas basadas en la experiencia.' }
                ]
              },
              {
                pairs: [
                  { id: 10, left: 'El atleta mostró una resiliencia admirable.', right: 'El deportista demostró gran capacidad de superar la adversidad.' },
                  { id: 11, left: 'Las negociaciones llegaron a un punto muerto.', right: 'Las conversaciones se estancaron sin alcanzar acuerdos.' },
                  { id: 12, left: 'La arquitectura del edificio es vanguardista.', right: 'El diseño de la construcción resulta muy innovador.' }
                ]
              },
              {
                pairs: [
                  { id: 13, left: 'El testigo corroboró la coartada.', right: 'El declarante confirmó la versión del sospechoso.' },
                  { id: 14, left: 'La lectura asidua fomenta el intelecto.', right: 'Leer con frecuencia estimula la mente.' },
                  { id: 15, left: 'Hubo un consenso unánime.', right: 'Todos los involucrados estuvieron de acuerdo.' }
                ]
              }
            ]
          }
        },
      // ── NODO 18: PARÁFRASIS II (INFORMATIVOS TÉCNICOS) ──
      {
        id: 'sec-1-17-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 13, order: 18, tags: ['subcapitulo:Paráfrasis'],
        title: 'Paráfrasis Técnica',
        introduccion: 'Comprende textos expositivos con vocabulario científico o técnico.',
        datos_claves: ['Traduce mentalmente los términos técnicos a palabras simples (ej: "autótrofo" = fabrica su propio alimento)'],
        test: {
          id: 'test-1-17-inf', seccionId: 'sec-1-17-inf',
          contexto_base: 'La fotosíntesis es un proceso anabólico mediante el cual los organismos autótrofos convierten la energía luminosa en energía química almacenada, sintetizando compuestos orgánicos a partir de sustancias inorgánicas.',
          preguntas: [
            { id: 112, enunciado: '¿Cuál de las siguientes afirmaciones parafrasea correctamente el texto?', alternativas: { A: 'Los seres vivos usan compuestos orgánicos para crear luz mediante la fotosíntesis.', B: 'A través de la fotosíntesis, ciertos organismos fabrican su propio alimento orgánico usando luz y elementos inorgánicos.', C: 'La fotosíntesis destruye sustancias químicas para liberar energía luminosa en el ambiente.', D: 'Solo los organismos autótrofos pueden vivir sin consumir materia inorgánica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Captaste la esencia del proceso sin enredarte en los términos técnicos.', feedback_error: 'Recuerda: convertir energía luminosa en compuestos orgánicos significa usar luz para fabricar alimento.' },
            { id: 1121, enunciado: '¿Qué tipo de proceso es la fotosíntesis según el texto?', alternativas: { A: 'Un proceso destructivo.', B: 'Un proceso catabólico.', C: 'Un proceso inorgánico.', D: 'Un proceso anabólico.' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! Encontraste el término técnico.', feedback_error: 'Busca el adjetivo que acompaña a "proceso" en la primera línea.' },
            { id: 1122, enunciado: '¿Qué tipo de energía se almacena finalmente en este proceso?', alternativas: { A: 'Energía luminosa.', B: 'Energía química.', C: 'Energía solar.', D: 'Energía inorgánica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! Rastreaste el tipo de energía almacenada.', feedback_error: 'Revisa en qué tipo de energía se convierte la luz.' },
            { id: 1123, enunciado: 'A partir de qué tipo de sustancias se sintetizan los compuestos orgánicos?', alternativas: { A: 'De sustancias inorgánicas.', B: 'De compuestos orgánicos previos.', C: 'De energía pura.', D: 'De otros organismos.' }, respuesta_correcta: 'A', feedback_acierto: '¡Perfecto! Los compuestos orgánicos se sintetizan a partir de sustancias inorgánicas, según el texto.', feedback_error: 'La última parte de la oración lo menciona directamente.' }
          ]
        }
      },
      // ── NODO 19: PARÁFRASIS II (METÁFORAS) ──
      {
        id: 'sec-1-18-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 13, order: 19, tags: ['subcapitulo:Paráfrasis'],
        title: 'Paráfrasis de Metáforas',
        introduccion: 'Parafrasea metáforas y expresiones figuradas comunes en narraciones.',
        datos_claves: ['Identifica la intención detrás de la expresión literaria', 'Nunca interpretes las metáforas de manera literal (al pie de la letra)'],
        test: {
          id: 'test-1-18-nar', seccionId: 'sec-1-18-nar',
          contexto_base: 'La noticia cayó sobre la pequeña aldea como un balde de agua helada en pleno invierno, paralizando el habitual bullicio del mercado matutino.',
          preguntas: [
            { id: 113, enunciado: '¿Qué significa la expresión figurada utilizada en el fragmento?', alternativas: { A: 'Que empezó a llover fuertemente y el mercado tuvo que cerrar.', B: 'Que la noticia fue tan impactante y sorpresiva que dejó a todos los habitantes atónitos y en silencio.', C: 'Que los comerciantes reaccionaron con violencia ante el evento inesperado.', D: 'Que alguien derramó agua fría en el centro de la plaza del mercado.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente interpretación! "Balde de agua fría" se refiere a una sorpresa desagradable que paraliza.', feedback_error: 'Es una expresión figurada. No tomarlo de manera literal.' },
            { id: 1131, enunciado: '¿Sobre qué lugar cayó la noticia?', alternativas: { A: 'Sobre un balde de agua.', B: 'Sobre una gran ciudad.', C: 'Sobre la pequeña aldea.', D: 'Sobre el mercado invernal.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El texto menciona que la noticia cayó sobre la pequeña aldea.', feedback_error: 'El texto menciona el lugar exacto en las primeras palabras.' },
            { id: 1132, enunciado: '¿Qué actividad fue paralizada por este evento?', alternativas: { A: 'La lluvia de invierno.', B: 'El tráfico en la ciudad.', C: 'El habitual bullicio del mercado matutino.', D: 'El trabajo de los aldeanos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien rastreado!', feedback_error: 'Revisa la última parte de la oración.' },
            { id: 1133, enunciado: '¿En qué época del año se ambienta la comparación?', alternativas: { A: 'En verano.', B: 'En otoño.', C: 'En invierno.', D: 'En primavera.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! La comparación está ambientada en invierno, la estación mencionada en la metáfora.', feedback_error: 'Busca la estación del año mencionada en la metáfora.' }
          ]
        }
      },
      // ── NODO 20: PRÁCTICA DE EMPAREJAMIENTO DE METÁFORAS ──
      {
        id: 'sec-1-19-match', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 14, order: 20, tags: ['subcapitulo:Paráfrasis'],
        title: 'Práctica: Decodifica la Metáfora',
        introduccion: 'Empareja la frase figurada con su significado literal.',
        datos_claves: [],
        isPractice: true,
        practiceType: 'match-pairs',
        practiceData: {
            title: 'Decodifica la Metáfora',
            description: 'Empareja la frase figurada con su significado literal o paráfrasis correcta.',
            rounds: [
              {
                pairs: [
                  { id: 1, left: 'Tenía un corazón de piedra.', right: 'Era una persona insensible.' },
                  { id: 2, left: 'Estaba en el ojo del huracán.', right: 'Se encontraba en el centro del problema.' },
                  { id: 3, left: 'Se le hizo agua la boca.', right: 'Sintió un gran deseo de comer.' }
                ]
              },
              {
                pairs: [
                  { id: 4, left: 'Tiró la toalla antes de tiempo.', right: 'Se rindió frente a la dificultad.' },
                  { id: 5, left: 'El tiempo vuela cuando te diviertes.', right: 'Las horas pasan muy rápido.' },
                  { id: 6, left: 'Ese niño habla por los codos.', right: 'Es una persona muy conversadora.' }
                ]
              },
              {
                pairs: [
                  { id: 7, left: 'Puso el dedo en la llaga.', right: 'Mencionó el punto más sensible del tema.' },
                  { id: 8, left: 'Se ahogó en un vaso de agua.', right: 'Se preocupó en exceso por un problema mínimo.' },
                  { id: 9, left: 'Le dio en el clavo.', right: 'Acertó de manera completamente precisa.' }
                ]
              },
              {
                pairs: [
                  { id: 10, left: 'Andaba por las nubes.', right: 'Estaba muy distraído o soñando despierto.' },
                  { id: 11, left: 'Le costó un ojo de la cara.', right: 'Pagó un precio extremadamente alto.' },
                  { id: 12, left: 'Se le cruzaron los cables.', right: 'Se confundió o alteró repentinamente.' }
                ]
              },
              {
                pairs: [
                  { id: 13, left: 'Lloró lágrimas de cocodrilo.', right: 'Fingió una tristeza que no sentía.' },
                  { id: 14, left: 'Se durmió en los laureles.', right: 'Se confió tras el éxito y dejó de esforzarse.' },
                  { id: 15, left: 'No le pidas peras al olmo.', right: 'No exijas algo que es claramente imposible.' }
                ]
              }
            ]
          }
        },
      // ── NODO 21: PARÁFRASIS SÍNTESIS ──
      {
        id: 'sec-1-20-inf', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 15, order: 21, tags: ['subcapitulo:Paráfrasis'],
        title: 'Síntesis de Párrafos',
        introduccion: 'Identifica síntesis completas de párrafos largos.',
        datos_claves: ['La paráfrasis correcta no debe omitir el punto principal del párrafo', 'Descarta opciones que solo hablen de un detalle menor'],
        test: {
          id: 'test-1-20-inf', seccionId: 'sec-1-20-inf',
          contexto_base: 'El uso indiscriminado de antibióticos tanto en la medicina humana como en la ganadería ha acelerado la aparición de bacterias multirresistentes. Estas "superbacterias" suponen una grave amenaza para la salud pública mundial, ya que infecciones comunes que antes se curaban fácilmente, ahora requieren tratamientos más largos, costosos y con mayor riesgo de mortalidad.',
          preguntas: [
            { id: 114, enunciado: '¿Cuál de las siguientes opciones resume adecuadamente el fragmento?', alternativas: { A: 'La ganadería es la principal culpable de la aparición de superbacterias que matan a millones de personas anualmente.', B: 'Los antibióticos modernos son ineficaces, por lo que las enfermedades comunes ya no tienen cura.', C: 'El abuso de los antibióticos ha generado bacterias resistentes, convirtiendo enfermedades simples en peligros sanitarios difíciles de tratar.', D: 'Las infecciones comunes pueden tratarse fácilmente si se disminuye el uso de antibióticos en animales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! Captura la causa (abuso) y la consecuencia (bacterias resistentes y dificultad de trato).', feedback_error: 'La opción A exagera. La opción D no resume el problema real, es una suposición.' },
            { id: 1141, enunciado: 'Según el texto, ¿en qué sectores se usan los antibióticos de forma indiscriminada?', alternativas: { A: 'En la agricultura y la minería.', B: 'En la medicina humana y en la ganadería.', C: 'En los hospitales exclusivamente.', D: 'En la industria farmacéutica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El texto señala que se usan de forma indiscriminada en la medicina humana y en la ganadería.', feedback_error: 'Lee la primera oración del párrafo.' },
            { id: 1142, enunciado: '¿Cómo describe el texto a las "superbacterias"?', alternativas: { A: 'Como una leve molestia.', B: 'Como bacterias beneficiosas para la ganadería.', C: 'Como una grave amenaza para la salud pública mundial.', D: 'Como infecciones comunes que se curan fácilmente.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien rastreado!', feedback_error: 'Busca el término "superbacterias" y lee la descripción que le sigue.' },
            { id: 1143, enunciado: '¿Qué consecuencia tienen ahora las infecciones comunes?', alternativas: { A: 'Se curan con mayor facilidad.', B: 'Desaparecen por sí solas.', C: 'Requieren tratamientos más rápidos y baratos.', D: 'Requieren tratamientos más largos, costosos y con mayor riesgo.' }, respuesta_correcta: 'D', feedback_acierto: '¡Excelente comprensión!', feedback_error: 'Revisa la última parte del texto donde se habla de las infecciones comunes hoy en día.' }
          ]
        }
      },
      // ── NODO 22: MOTIVACIONES OCULTAS ──
      {
        id: 'sec-1-21-nar', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 15, order: 22, tags: ['subcapitulo:Paráfrasis'],
        title: 'Sentimientos y Reacciones de Personajes',
        introduccion: 'Identifica lo que siente o hace un personaje a partir de lo explícito en el texto, aunque esté formulado con otras palabras (paráfrasis).',
        datos_claves: ['Busca las palabras y frases que describen directamente lo que siente o hace el personaje, aunque estén dichas con otras palabras.'],
        test: {
          id: 'test-1-21-nar', seccionId: 'sec-1-21-nar',
          contexto_base: 'A pesar de sus constantes quejas sobre el ruido y el tráfico, don Ernesto se negaba rotundamente a vender su casona en el centro para mudarse al campo. En el fondo, el solo pensamiento de despertar sin el bullicio de los vendedores callejeros y sin el eco de los tranvías le provocaba un vacío insoportable en el pecho.',
          preguntas: [
            { id: 115, enunciado: '¿Cuál de las siguientes es la mejor paráfrasis de "el solo pensamiento de despertar sin el bullicio... le provocaba un vacío insoportable en el pecho"?', alternativas: { A: 'Sentía una profunda sensación de vacío ante la sola idea de perder los sonidos de la ciudad.', B: 'Se sentía aliviado de dejar atrás el ruido constante.', C: 'Estaba emocionado por la tranquilidad que encontraría en el campo.', D: 'No le importaba en absoluto el bullicio de la ciudad.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! "Vacío insoportable en el pecho" al pensar en perder el bullicio es exactamente esa sensación de pérdida.', feedback_error: 'Lee la segunda oración del texto. El silencio le provocaba "un vacío insoportable".' },
            { id: 1151, enunciado: '¿De qué se quejaba constantemente don Ernesto?', alternativas: { A: 'Del clima de la ciudad.', B: 'De su vieja casona.', C: 'Del ruido y el tráfico.', D: 'Del campo y la naturaleza.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! Eso era lo que decía superficialmente.', feedback_error: 'Revisa la primera línea de la narración.' },
            { id: 1152, enunciado: '¿Hacia dónde se negaba a mudarse?', alternativas: { A: 'Al extranjero.', B: 'Al campo.', C: 'A otra ciudad más ruidosa.', D: 'A un departamento en el centro.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se negaba a mudarse al campo, según la primera oración del texto.', feedback_error: 'Busca el destino de mudanza mencionado en la primera oración.' },
            { id: 1153, enunciado: '¿Qué le provocaba el pensamiento de despertar sin el bullicio?', alternativas: { A: 'Una gran alegría.', B: 'Mucha paz mental.', C: 'Un vacío insoportable en el pecho.', D: 'Ganas de vender la casona.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Esa es su motivación oculta.', feedback_error: 'Revisa el final de la segunda oración.' }
          ]
        }
      },
      // ── NODO 23: PRO TIP 4 ──
      {
        id: 'sec-1-22-tip', capituloId: 'cap-1', materiaId: 'comp-lectora',
        level: 16, order: 23, tags: ['subcapitulo:Paráfrasis'],
        title: 'Pro Tip: Distractores Absolutos',
        isProTip: true,
        introduccion: 'Palabras que casi siempre hacen que una alternativa sea FALSA.',
        datos_claves: [
          'En las preguntas de Comprensión Lectora, huye de las palabras absolutas: NUNCA, SIEMPRE, TODOS, NINGUNO, ÚNICAMENTE.',
          'Si el texto dice "Muchos mamíferos vuelan", la alternativa "Todos los mamíferos vuelan" es incorrecta.',
          'Prefiere las alternativas que usan matices: ALGUNOS, A VECES, FRECUENTEMENTE, LA MAYORÍA.'
        ],
        test: {
          id: 'test-1-22-tip', seccionId: 'sec-1-22-tip',
          contexto_base: 'La mayoría de los gatos odian el agua, pero algunos disfrutan nadar.',
          preguntas: [
            { id: 1003, enunciado: '¿Cuál afirmación es falsa según el texto?', alternativas: { A: 'Ciertos felinos disfrutan del agua.', B: 'Todos los gatos odian el agua.', C: 'Gran parte de los gatos evitan mojarse.', D: 'Existen gatos que saben nadar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! "Todos" es una palabra absoluta falsa.', feedback_error: 'Busca la palabra que generaliza de manera absoluta.' }
          ]
        }
      },
      // ── NODO 24: BOSS FINAL ──
      {
          id: 'sec-1-23-boss', capituloId: 'cap-1', materiaId: 'comp-lectora',
          level: 17, order: 24, tags: ['subcapitulo:Evaluación Final'],
          isBoss: true,
          title: 'Desafío Final',
          introduccion: '¡Felicidades por llegar al jefe final! Aplica todo lo aprendido: rastreo, paráfrasis y conectores. Lee los textos y responde.',
          datos_claves: ['Aplica el scanning, evita números trampa y palabras absolutas.'],
          test: {
            id: 'test-1-23-boss', seccionId: 'sec-1-23-boss',
            contexto_base: 'TEXTO I: La Primera Vuelta al Mundo\n\nEl 20 de septiembre de 1519, una flota de cinco naves españolas, bajo el mando del explorador portugués Fernando de Magallanes, zarpó del puerto de Sanlúcar de Barrameda con una tripulación de aproximadamente 270 hombres.\n\nEl objetivo primordial de la expedición no era dar la vuelta al mundo, sino descubrir una ruta comercial occidental hacia las Islas de las Especias (actuales Molucas en Indonesia). La flota estaba compuesta por las naves Trinidad, San Antonio, Concepción, Victoria y Santiago.\n\nEl viaje estuvo plagado de dificultades: motines, tormentas implacables, escorbuto y enfrentamientos con los nativos. En abril de 1521, Fernando de Magallanes murió trágicamente en la Batalla de Mactán, en Filipinas, tras un enfrentamiento con el líder local Lapu-Lapu. Debido a este suceso, el mando fue asumido por el marino vasco Juan Sebastián Elcano.\n\nFinalmente, el 6 de septiembre de 1522, casi tres años después de su partida, la nave Victoria (la única superviviente de la flota original) atracó en España con solo 18 hombres a bordo, completando así la primera circunnavegación del globo.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO II: La crisis del microplástico\n\nDesde la invención del plástico a gran escala en la década de 1950, se estima que se han producido más de 8.300 millones de toneladas de este material.\n\nDe esa cantidad astronómica, aproximadamente el 79% se encuentra acumulado en vertederos o directamente en el entorno natural, especialmente en los océanos.\n\nEl principal problema ambiental radica en que el plástico no es un material biodegradable; por consiguiente, no se descompone de forma natural, sino que se fragmenta en pedazos cada vez más pequeños conocidos como microplásticos (partículas menores a 5 milímetros).\n\nLas corrientes oceánicas han agrupado toneladas de estos desechos, formando gigantescas islas de basura, siendo la más conocida la Gran Mancha de Basura del Pacífico, cuya superficie supera los 1.6 millones de kilómetros cuadrados. Los animales marinos a menudo confunden estos microplásticos con alimento, lo que provoca graves obstrucciones intestinales, desnutrición e incluso la muerte.\n\nA pesar de las alarmantes cifras, se proyecta que para el año 2050 habrá más plástico que peces en el océano si no se modifican drásticamente los patrones de consumo global.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO III: La rutina en la Antigua Roma\n\nEn el auge del Imperio Romano (siglo I d.C.), la vida de un ciudadano medio en la capital comenzaba al amanecer. Tras un rápido desayuno frugal, que consistía típicamente en pan, queso y aceitunas, el "pater familias" (cabeza de familia) se dirigía al Foro.\n\nAllí, entre las 08:00 y las 11:00 horas, llevaba a cabo sus negocios, juicios o reuniones políticas. A diferencia de las extenuantes jornadas laborales modernas, la jornada de trabajo de un romano adinerado concluía normalmente al mediodía.\n\nLa tarde estaba dedicada exclusivamente al esparcimiento y la socialización, siendo las Termas el epicentro de la vida social. Los baños públicos no solo servían para el aseo personal, sino que funcionaban como verdaderos centros de reunión donde se cerraban tratos y se intercambiaban chismes de la ciudad.\n\nPor lo tanto, el acceso a las termas era sorprendentemente barato, costando apenas un cuadrante (la moneda de menor valor), para garantizar que casi todos los estratos sociales pudieran disfrutar de este servicio diario antes de la gran cena (la "cenae") que iniciaba al atardecer.',
            preguntas: [
              // Texto 1
              { id: 11601, texto_index: 0, enunciado: '¿En qué fecha exacta zarpó la expedición de Magallanes?', alternativas: { A: '6 de septiembre de 1522', B: '20 de septiembre de 1519', C: 'Abril de 1521', D: '20 de septiembre de 1521' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente escaneo de fechas!', feedback_error: 'Busca el verbo "zarpó" y lee la fecha que aparece al inicio del primer párrafo.' },
              { id: 11602, texto_index: 0, enunciado: 'Según el texto, ¿cuál era el objetivo original de la expedición?', alternativas: { A: 'Dar la primera vuelta al mundo.', B: 'Conquistar las Filipinas.', C: 'Descubrir una ruta comercial hacia las Islas de las Especias.', D: 'Derrotar al líder local Lapu-Lapu.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Evitaste la trampa de "dar la vuelta al mundo".', feedback_error: 'Rastrea las palabras "objetivo primordial" en el segundo párrafo.' },
              { id: 11603, texto_index: 0, enunciado: '¿Qué nave fue la única que logró regresar a España?', alternativas: { A: 'Trinidad', B: 'San Antonio', C: 'Santiago', D: 'Victoria' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien rastreado!', feedback_error: 'Busca la palabra "superviviente" en el texto.' },
              { id: 11604, texto_index: 0, enunciado: '¿Cuál es la mejor paráfrasis para la frase "El viaje estuvo plagado de dificultades"?', alternativas: { A: 'La travesía enfrentó múltiples obstáculos y desgracias.', B: 'El recorrido fue tranquilo y sin contratiempos.', C: 'La flota sufrió una peste muy contagiosa.', D: 'El viaje duró demasiado tiempo debido al clima.' }, respuesta_correcta: 'A', feedback_acierto: '¡Perfecta paráfrasis!', feedback_error: '"Plagado de dificultades" significa que estuvo lleno de problemas u obstáculos.' },
              { id: 11605, texto_index: 0, enunciado: '¿Cuál fue la causa directa de que Juan Sebastián Elcano asumiera el mando de la expedición?', alternativas: { A: 'El inicio de un motín en la nave Victoria.', B: 'La muerte de Fernando de Magallanes en Filipinas.', C: 'La pérdida de la nave Trinidad en una tormenta.', D: 'Una epidemia de escorbuto en la tripulación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Has detectado bien la relación causa-efecto!', feedback_error: 'Ubica el nombre "Juan Sebastián Elcano" y lee la frase que introduce su nombramiento.' },
              // Texto 2
              { id: 11606, texto_index: 1, enunciado: 'Según el texto, ¿qué porcentaje del plástico histórico se encuentra acumulado en vertederos o en la naturaleza?', alternativas: { A: '79%', B: '25%', C: '50%', D: '83%' }, respuesta_correcta: 'A', feedback_acierto: '¡Buen escaneo numérico!', feedback_error: 'Busca el símbolo "%" en el segundo párrafo.' },
              { id: 11607, texto_index: 1, enunciado: '¿Qué tamaño máximo tienen los microplásticos, según el texto?', alternativas: { A: 'Menos de 5 centímetros', B: 'Menos de 5 milímetros', C: 'Menos de 1 milímetro', D: 'Menos de 8.3 milímetros' }, respuesta_correcta: 'B', feedback_acierto: '¡Ojo de águila!', feedback_error: 'Rastrea la palabra "microplásticos" e identifica la medida exacta.' },
              { id: 11608, texto_index: 1, enunciado: '¿Cuál es la causa principal de que el plástico forme microplásticos en lugar de desaparecer?', alternativas: { A: 'Que fue inventado en la década de 1950.', B: 'Que los animales marinos lo confunden con alimento.', C: 'Que se acumula en las corrientes oceánicas.', D: 'Que no es un material biodegradable.' }, respuesta_correcta: 'D', feedback_acierto: 'Excelente, detectaste el conector "por consiguiente" o la estructura causal.', feedback_error: 'Busca la explicación en el tercer párrafo sobre por qué el plástico se fragmenta.' },
              { id: 11609, texto_index: 1, enunciado: '¿Qué opción resume adecuadamente los tres primeros párrafos?', alternativas: { A: 'El plástico es un invento de 1950 que se encuentra en los océanos.', B: 'La inmensa cantidad de plástico producido ha terminado contaminando el medio ambiente debido a que no se biodegrada.', C: 'Los microplásticos son partículas de 5 milímetros que ensucian los mares.', D: 'El 79% del plástico mundial se produce actualmente y no puede reciclarse.' }, respuesta_correcta: 'B', feedback_acierto: '¡Gran capacidad de síntesis!', feedback_error: 'La opción correcta debe incluir la idea principal (producción masiva + acumulación por falta de biodegradación).' },
              { id: 11610, texto_index: 1, enunciado: 'En el texto, se menciona la Gran Mancha de Basura del Pacífico como un ejemplo de:', alternativas: { A: 'Un tipo de microplástico altamente tóxico.', B: 'La acumulación de desechos agrupados por corrientes oceánicas.', C: 'Una zona del océano donde ya no hay peces.', D: 'El lugar donde se originó el plástico en 1950.' }, respuesta_correcta: 'B', feedback_acierto: '¡Localizado correctamente!', feedback_error: 'Ubica "Gran Mancha de Basura" en el cuarto párrafo y lee el contexto.' },
              // Texto 3
              { id: 11611, texto_index: 2, enunciado: 'Según el texto, ¿en qué horario llevaba a cabo sus negocios el ciudadano romano medio?', alternativas: { A: 'Al amanecer.', B: 'Al mediodía.', C: 'Entre las 08:00 y las 11:00 horas.', D: 'Durante la tarde.' }, respuesta_correcta: 'C', feedback_acierto: '¡Respuesta rápida y certera!', feedback_error: 'Busca la palabra "negocios" o rastrea formatos de hora en el segundo párrafo.' },
              { id: 11612, texto_index: 2, enunciado: '¿Qué opción es el sinónimo más adecuado para la palabra "frugal" empleada en el contexto del desayuno romano?', alternativas: { A: 'Suntuoso', B: 'Opulento', C: 'Sencillo o económico', D: 'Extenuante' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Si consistía en pan, queso y aceitunas, era sencillo.', feedback_error: 'Fíjate en qué consistía el desayuno. Pan, queso y aceitunas indican algo moderado o sencillo.' },
              { id: 11613, texto_index: 2, enunciado: '¿Qué función cumplía el conector "Por lo tanto" en el último párrafo?', alternativas: { A: 'Introducir una contradicción sobre el precio de las termas.', B: 'Señalar la consecuencia de que las termas fueran el centro de la vida social.', C: 'Añadir nueva información sobre la gran cena.', D: 'Indicar la causa de la extenuante jornada laboral.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Reconociste el conector de consecuencia.', feedback_error: '"Por lo tanto" es un conector de consecuencia. Lee la oración previa.' },
              { id: 11614, texto_index: 2, enunciado: 'Según el texto, ¿por qué el acceso a las termas era tan barato?', alternativas: { A: 'Porque no requerían agua caliente.', B: 'Porque el gobierno subsidiaba todos los baños públicos.', C: 'Porque solo estaban abiertas durante la tarde.', D: 'Para garantizar que casi todos los estratos sociales pudieran disfrutar de ellas.' }, respuesta_correcta: 'D', feedback_acierto: '¡Excelente! Encontraste la justificación literal.', feedback_error: 'Busca la mención del precio ("un cuadrante") y lee el motivo a continuación.' },
              { id: 11615, texto_index: 2, enunciado: '¿Qué paráfrasis captura mejor la idea de que "las Termas eran el epicentro de la vida social"?', alternativas: { A: 'Las termas eran el lugar más concurrido para relacionarse e interactuar en la ciudad.', B: 'Las termas eran exclusivamente lugares para asearse rápidamente.', C: 'Las termas estaban ubicadas en el centro geográfico de Roma.', D: 'Las termas eran recintos privados para los ciudadanos adinerados.' }, respuesta_correcta: 'A', feedback_acierto: '¡Has completado exitosamente el Desafío Final del Capítulo 1! Eres un maestro del rastreo de datos.', feedback_error: 'Piensa en qué significa "epicentro de la vida social" figuradamente.' }
            ]
          }
        }
      ]
    },

  // ── CAPÍTULO 2 ──
  // ── CAPÍTULO 2 ──
  {
    id: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Habilidad 2: Interpretar',
    introduccion: 'Interpretar significa ir más allá de la información literal del texto: debes comprender qué quiso decir el autor, para qué sirve cada parte del texto y cuál es la actitud o postura del emisor ante su tema.',
    order: 2,
    secciones: [
  {
    id: 'sec-2-0-guia',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 1,
    order: 1,
    tags: [
      'subcapitulo:Introducción'
    ],
    isSlideGuide: true,
    title: '¿Qué es Interpretar?',
    introduccion: 'Interpretar va más allá de lo que el texto dice literalmente. Debes comprender qué quiso decir el autor, para qué sirve cada parte del texto y cuál es su postura ante el tema.',
    guia_titulo: 'Localizar vs Interpretar',
    guia_contenido: '<p><strong>Localizar</strong> = encontrar la información tal como aparece escrita en el texto.</p><p><strong>Interpretar</strong> = comprender el significado implícito, las relaciones entre ideas y la intención del autor. Exige ir un paso más allá.</p><p>En la PAES, Interpretar representa cerca del <strong>35% de las preguntas</strong> y es la habilidad que más diferencia los puntajes altos de los puntajes medios.</p><ul><li>En <strong>textos informativos</strong>: busca la tesis, los conectores lógicos y la relación entre párrafos.</li><li>En <strong>textos narrativos</strong>: busca las motivaciones de los personajes, la atmósfera y el tema central.</li><li>La respuesta <strong>siempre</strong> debe justificarse con evidencia del propio texto.</li></ul>',
    datos_claves: [
      'En textos informativos: busca la tesis, los conectores lógicos y la relación entre párrafos.',
      'En textos narrativos: busca las motivaciones de los personajes, la atmósfera y el tema central.',
      'La respuesta siempre debe justificarse con evidencia del propio texto.'
    ],
    test: {
      id: 'test-2-0-guia',
      seccionId: 'sec-2-0-guia',
      contexto_base: '«El hielo glaciar no miente. Cada capa es un año, y los gases atrapados dentro son la memoria exacta de la atmósfera de ese tiempo.»',
      preguntas: [
        {
          id: 200,
          enunciado: '¿Cuál es el propósito central de este breve fragmento?',
          alternativas: {
            A: 'Informar sobre el proceso físico de formación del hielo.',
            B: 'Argumentar que el hielo glaciar es una fuente confiable de información histórica.',
            C: 'Narrar cómo un científico estudia el hielo.',
            D: 'Describir la composición química del hielo.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! La expresión \'el hielo no miente\' y la metáfora de \'memoria exacta\' revelan que el autor busca persuadir al lector sobre la fiabilidad del hielo como fuente histórica.',
          feedback_error: 'Fíjate en el tono: \'no miente\', \'memoria exacta\'. Estas son expresiones valorativas que revelan la intención del autor.'
        }
      ]
    }
  },
  {
    id: 'sec-2-protip-1',
    title: '¿Inferir o Suponer?',
    introduccion: 'La PAES mide tu capacidad de <b>inferir</b>, no de suponer. Una inferencia es una conclusión lógica y necesaria derivada de pistas textuales. Una suposición es un salto imaginativo basado en tus conocimientos previos. ¡Nunca uses tus conocimientos previos para responder!',
    datos_claves: [
      'Si la alternativa requiere que asumas algo que no dice el texto, <b>descártala</b>.',
      'Busca siempre las huellas o marcas textuales que justifiquen tu inferencia.'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-1',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-1'
    },
    level: 2,
    order: 2,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-1-inf',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 3,
    order: 3,
    tags: [
      'subcapitulo:Textos Informativos'
    ],
    title: 'Inferencias · Informativos',
    introduccion: 'En los textos informativos, muchas ideas no se dicen directamente: se dan a entender. Una inferencia válida se desprende lógicamente del texto sin distorsionar su sentido.',
    datos_claves: [
      'Una inferencia NUNCA inventa información: se basa en lo que el texto SÍ dice.',
      'Descarta las opciones que exageran o agregan datos que el texto no sugiere.',
      'Los conectores como \'por lo tanto\', \'en consecuencia\' y \'sin embargo\' son señales de inferencias fuertes.',
      'Pregúntate: ¿podría deducir esto sin leer el texto? Si la respuesta es sí, probablemente es inválida.'
    ],
    test: {
      id: 'test-2-1-inf',
      seccionId: 'sec-2-1-inf',
      contexto_base: 'El plástico de un solo uso tarda entre 400 y 1.000 años en descomponerse en el medio ambiente. Sin embargo, el 91% de los plásticos generados en el mundo nunca ha sido reciclado. Solo en el año 2021 se produjeron 380 millones de toneladas métricas de plástico a nivel global, cifra que representa más del doble de lo producido en el año 2000. Según un informe de la ONU, si las tendencias actuales continúan, para el año 2050 habrá en los océanos más plástico que peces en términos de peso. Los investigadores advierten que el microplástico ya ha sido detectado en la sangre humana, en el agua potable de la mayoría de los países y en el interior de organismos que habitan a más de 10.000 metros de profundidad en las fosas oceánicas.',
      preguntas: [
        {
          id: 201,
          enunciado: '¿Cuál de las siguientes afirmaciones se puede INFERIR a partir del texto?',
          alternativas: {
            A: 'La producción de plástico disminuyó después del año 2000.',
            B: 'El reciclaje es suficiente para resolver el problema del plástico si se aplica correctamente.',
            C: 'El problema de la contaminación por plástico tiene un alcance global y afecta ecosistemas remotos.',
            D: 'Los océanos ya tienen más plástico que peces en la actualidad.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! El texto menciona plástico en fosas oceánicas a 10.000 metros, en sangre humana y en océanos de todo el mundo, lo que permite inferir un alcance global y remoto.',
          feedback_error: 'La opción D exagera: el texto dice que ESO PODRÍA pasar en 2050 si las tendencias continúan, no que ya ocurrió. La inferencia válida debe respetar lo que el texto dice.'
        },
        {
          id: 202,
          enunciado: '¿Qué se puede concluir sobre la producción de plástico entre 2000 y 2021?',
          alternativas: {
            A: 'Se redujo a la mitad.',
            B: 'Se duplicó con creces.',
            C: 'Se mantuvo estable.',
            D: 'Se triplicó.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Bien! El texto dice que la cifra de 2021 \'representa más del doble de lo producido en el año 2000\'. Eso significa que se duplicó (o superó el doble).',
          feedback_error: 'Busca en el texto la comparación específica entre el año 2000 y 2021. La respuesta está dicha casi literalmente.'
        },
        {
          id: 203,
          enunciado: 'Según el texto, ¿qué implica el hecho de que el microplástico se haya detectado en la sangre humana?',
          alternativas: {
            A: 'Que el plástico ahora forma parte del ciclo sanguíneo de forma natural.',
            B: 'Que la contaminación por plástico ha alcanzado el interior del organismo humano.',
            C: 'Que todos los seres humanos del mundo están enfermos por culpa del plástico.',
            D: 'Que el microplástico es inofensivo para la salud.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente inferencia! La detección en sangre implica que la contaminación ya está dentro del cuerpo humano. El texto no dice que cause enfermedades, solo que fue detectado.',
          feedback_error: 'La clave es no exagerar: el texto dice \'detectado\', no que cause enfermedades. ¿Qué conclusión directa se puede sacar de que algo extraño aparezca en la sangre?'
        },
        {
          id: 204,
          enunciado: '¿Cuál es el propósito principal del texto?',
          alternativas: {
            A: 'Describir el proceso de descomposición del plástico.',
            B: 'Comparar la producción de plástico de distintos países.',
            C: 'Advertir sobre la magnitud y gravedad del problema de la contaminación plástica.',
            D: 'Proponer soluciones para reducir el consumo de plástico.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! El texto no propone soluciones ni compara países: acumula datos alarmantes para transmitir la gravedad del problema. Su propósito es advertir.',
          feedback_error: 'Ningún párrafo propone qué hacer. El texto solo presenta datos. ¿Con qué propósito se acumulan datos alarmantes uno tras otro?'
        }
      ]
    }
  },
  {
    id: 'sec-2-1-nar',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 3,
    order: 3,
    tags: [
      'subcapitulo:Textos Narrativos'
    ],
    title: 'Inferencias · Narrativos',
    introduccion: 'En los textos narrativos, las inferencias revelan lo que el personaje siente, piensa o busca sin que el narrador lo diga directamente. Debes leer entre líneas.',
    datos_claves: [
      'Las acciones y palabras de un personaje revelan su estado emocional sin necesidad de que se declare explícitamente.',
      'Los detalles del ambiente (clima, luz, color) suelen reflejar el estado interno del narrador o personaje.',
      'Una inferencia literaria válida tiene respaldo en el texto, aunque sea indirecto.',
      'El silencio de un personaje o lo que elige no decir también es información significativa.'
    ],
    test: {
      id: 'test-2-1-nar',
      seccionId: 'sec-2-1-nar',
      contexto_base: 'Cuando Irene llegó a casa de su madre, encontró el jardín sin podar por primera vez en veinte años. La puerta estaba entreabierta y una taza con café a medio tomar descansaba sobre la mesa del comedor, fría ya. Llamó en voz alta, pero el silencio le respondió con el mismo peso que una piedra. Recorrió cada habitación sin prisa, como quien no quiere encontrar lo que busca, hasta que se detuvo frente al sillón favorito de su madre, aún hundido por la costumbre de ese cuerpo que ya no estaría.',
      preguntas: [
        {
          id: 205,
          enunciado: '¿Qué se puede inferir sobre la situación de la madre de Irene?',
          alternativas: {
            A: 'Está de viaje y volverá pronto.',
            B: 'Ha fallecido o ha desaparecido de manera abrupta.',
            C: 'Está enojada con Irene y no quiere verla.',
            D: 'Está durmiendo en otra habitación de la casa.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Los indicios se acumulan: jardín sin podar, puerta entreabierta, café frío y especialmente \'ese cuerpo que ya no estaría\' permiten inferir que la madre ya no está, probablemente falleció.',
          feedback_error: 'Lee el último detalle: \'ese cuerpo que ya no estaría\'. Combínalo con el café frío y el jardín abandonado.'
        },
        {
          id: 206,
          enunciado: '¿Cuál es el estado emocional de Irene mientras recorre la casa?',
          alternativas: {
            A: 'Enojo y frustración.',
            B: 'Indiferencia y calma.',
            C: 'Temor y resistencia ante lo que puede encontrar.',
            D: 'Alegría y expectativa.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! La frase \'como quien no quiere encontrar lo que busca\' revela que Irene teme lo que puede descubrir.',
          feedback_error: 'La clave está en la frase \'como quien no quiere encontrar lo que busca\'. ¿Qué emoción describe esa actitud de ir despacio, aplazando el descubrimiento?'
        },
        {
          id: 207,
          enunciado: '¿Para qué sirve el detalle del jardín sin podar en el texto?',
          alternativas: {
            A: 'Para describir el estilo de vida de la madre.',
            B: 'Para mostrar que la madre era descuidada por naturaleza.',
            C: 'Para señalar que algo fuera de lo normal ha ocurrido, ya que la madre siempre lo mantuvo cuidado.',
            D: 'Para indicar que el texto transcurre en invierno.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente análisis! \'Sin podar por primera vez en veinte años\' rompe la rutina establecida, señalando una ruptura abrupta en la vida normal de la madre.',
          feedback_error: 'El texto dice \'por primera vez en veinte años\'. No es descuido habitual, sino una ruptura de la norma. ¿Qué función narrativa tiene esa ruptura?'
        },
        {
          id: 208,
          enunciado: '¿Qué transmite la comparación \'el silencio le respondió con el mismo peso que una piedra\'?',
          alternativas: {
            A: 'Que la casa era muy pequeña y sus paredes eran gruesas.',
            B: 'Que el silencio era agradable y reparador para Irene.',
            C: 'Que la ausencia de respuesta tiene una presencia física y opresiva para Irene.',
            D: 'Que nadie vivía en la casa hacía mucho tiempo.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! La comparación convierte el silencio en algo tangible y pesado. Transmite la sensación opresiva de la ausencia.',
          feedback_error: 'Es una comparación (símil). El silencio \'responde\' y tiene \'peso como una piedra\'. ¿Qué sensación produce algo que aplasta?'
        }
      ]
    }
  },
      {
      id: 'sec-2-prac-1',
      title: 'Rastreo de Pistas',
      introduccion: 'Práctica intensiva de inferencias locales. Encuentra las pistas textuales para deducir la respuesta correcta en estos 10 fragmentos.',
      isPractice: true,
      test: {
        id: 'test-2-prac-1',
        seccionId: 'sec-2-prac-1',
        contexto_base: 'TEXTO 1\nJuan miró el reloj ansiosamente, tomó su maletín de cuero y corrió hacia el andén. Las puertas se estaban cerrando.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa mujer soltó un suspiro prolongado mientras observaba por la ventana cómo el camión de mudanzas se alejaba, dejando la casa vacía y resonante.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nEl cielo se oscureció repentinamente a media tarde. Las aves, que cantaban minutos antes, buscaron refugio en silencio. Una ráfaga fría barrió las hojas del suelo.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nEl profesor acomodó sus gafas, miró la pila de exámenes marcados en rojo y se frotó las sienes con evidente cansancio.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nMarta revisó su cuenta bancaria. Luego miró el folleto de las vacaciones en el Caribe, lo dobló lentamente y lo guardó en el fondo del cajón.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 6\nEl detective notó que el paraguas en la entrada estaba completamente seco, a pesar de que el invitado afirmaba haber caminado bajo la tormenta durante horas.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 7\nLos niños entraron corriendo a la cocina, con las manos sucias de tierra y una sonrisa cómplice. En la mesa, el pastel que su madre acababa de hornear ya no estaba entero.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 8\nEl gerente revisó el informe de ventas, golpeó la mesa con el puño cerrado y llamó inmediatamente a su secretaria para convocar una reunión urgente.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 9\nAna leyó la carta. Sus ojos se abrieron desmesuradamente, dejó caer la taza de café al suelo y se cubrió la boca con ambas manos.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 10\nEl anciano acarició el lomo del perro dormido, sonrió con melancolía y le susurró: "Al menos tú sigues aquí, viejo amigo".',
        preguntas: [
          {
            id: 2001,
            texto_index: 0,
            enunciado: '¿Qué se puede inferir del comportamiento de Juan?',
            alternativas: {
              A: 'Iba a tomar un avión de vacaciones.',
              B: 'Estaba llegando tarde a su tren o metro.',
              C: 'Había olvidado su maletín en la oficina.',
              D: 'Huía desesperadamente de alguien.'
            },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! "Andén" y "puertas cerrando" son pistas textuales de un tren/metro, y "ansiosamente" más "corrió" indican atraso.',
            feedback_error: 'Identifica las pistas clave: "andén", "reloj" y "corrió".'
          },
          {
            id: 2002,
            texto_index: 1,
            enunciado: 'A partir de las pistas del texto 2, se puede deducir que la mujer siente:',
            alternativas: {
              A: 'Alegría por comenzar una nueva vida en otra ciudad.',
              B: 'Indiferencia absoluta frente a lo que sucede.',
              C: 'Nostalgia o tristeza por abandonar un lugar.',
              D: 'Enojo porque el camión se fue sin ella.'
            },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! El "suspiro prolongado" al ver la "casa vacía" sugiere melancolía y nostalgia.',
            feedback_error: 'Un "suspiro prolongado" al ver una "casa vacía" suele reflejar un sentimiento de pérdida o nostalgia.'
          },
          {
            id: 2003,
            texto_index: 2,
            enunciado: '¿Qué evento natural anticipan las pistas del texto 3?',
            alternativas: {
              A: 'Un eclipse solar total.',
              B: 'La inminente llegada de una tormenta.',
              C: 'La caída de la noche.',
              D: 'Un sismo o terremoto.'
            },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Cielo oscuro, aves escondiéndose y ráfaga fría son las pistas clásicas que preceden a una tormenta.',
            feedback_error: 'Si el cielo se oscurece a "media tarde" y hay viento frío, la naturaleza se está preparando para la lluvia o tormenta.'
          },
          {
            id: 2004,
            texto_index: 3,
            enunciado: '¿Qué se puede inferir sobre los resultados de los exámenes en el texto 4?',
            alternativas: {
              A: 'Que la mayoría de los estudiantes aprobó con excelencia.',
              B: 'Que los estudiantes hicieron trampa.',
              C: 'Que el curso tuvo un rendimiento muy deficiente.',
              D: 'Que el profesor no tuvo tiempo de corregirlos todos.'
            },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Las marcas "en rojo" y frotarse las sienes revelan frustración por malas calificaciones.',
            feedback_error: 'Normalmente las marcas en rojo representan errores o reprobados. El cansancio del profesor confirma su decepción.'
          },
          {
            id: 2005,
            texto_index: 4,
            enunciado: '¿Cuál es la conclusión lógica tras el actuar de Marta en el texto 5?',
            alternativas: {
              A: 'Decidió comprar el pasaje de inmediato.',
              B: 'Perdió el folleto por accidente.',
              C: 'Se dio cuenta de que no tenía dinero suficiente para el viaje.',
              D: 'Decidió ir a un destino más frío.'
            },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Revisar el banco y luego guardar el folleto lentamente implica renunciar al deseo por falta de fondos.',
            feedback_error: 'Fíjate en el orden: ve su cuenta y LUEGO guarda el folleto. Eso indica una decepción económica.'
          },
          {
            id: 2006,
            texto_index: 5,
            enunciado: '¿Qué revela la pista del paraguas en el texto 6?',
            alternativas: {
              A: 'Que el paraguas era de excelente calidad e impermeable.',
              B: 'Que el invitado probablemente estaba mintiendo.',
              C: 'Que la tormenta ya había terminado hace horas.',
              D: 'Que el detective no sabe interpretar pistas.'
            },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente deducción! Si caminó bajo la lluvia, el paraguas debería estar mojado. Al estar seco, su coartada es falsa.',
            feedback_error: 'Analiza la contradicción: afirma haber estado bajo la tormenta, pero su paraguas está completamente seco.'
          },
          {
            id: 2007,
            texto_index: 6,
            enunciado: '¿Qué sucedió con el pastel en el texto 7?',
            alternativas: {
              A: 'La madre se lo comió antes de que los niños llegaran.',
              B: 'Un animal entró a la cocina y lo destrozó.',
              C: 'Se quemó en el horno.',
              D: 'Los niños pellizcaron o comieron una parte del pastel en secreto.'
            },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Correcto! Las "manos sucias" y la "sonrisa cómplice" son las pistas de que ellos son los culpables de que el pastel ya no esté entero.',
            feedback_error: 'Relaciona la sonrisa cómplice y sus manos con el hecho de que el pastel está incompleto.'
          },
          {
            id: 2008,
            texto_index: 7,
            enunciado: '¿Qué se puede deducir de los resultados de ventas en el texto 8?',
            alternativas: {
              A: 'Que las ventas superaron las expectativas.',
              B: 'Que las ventas fueron desastrosas o preocupantes.',
              C: 'Que el informe estaba en un idioma incomprensible.',
              D: 'Que las ventas se mantuvieron estables.'
            },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Golpear la mesa y citar una reunión urgente denotan molestia y una crisis por bajos números.',
            feedback_error: 'El golpe en la mesa (enojo/frustración) y la reunión urgente indican un problema grave, no un éxito.'
          },
          {
            id: 2009,
            texto_index: 8,
            enunciado: 'Las acciones físicas de Ana en el texto 9 denotan:',
            alternativas: {
              A: 'Un aburrimiento profundo.',
              B: 'Un ataque de ira incontrolable.',
              C: 'Un shock o sorpresa extrema, posiblemente ante una mala noticia.',
              D: 'Un ataque de risa incontrolable.'
            },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Ojos abiertos, dejar caer objetos y cubrirse la boca son síntomas físicos universales de conmoción o shock.',
            feedback_error: 'Piensa en el lenguaje corporal: si alguien deja caer algo y se tapa la boca, refleja impacto o espanto.'
          },
          {
            id: 2010,
            texto_index: 9,
            enunciado: 'A partir de las palabras del anciano, se puede inferir que él:',
            alternativas: {
              A: 'Ha sufrido la pérdida o partida de otras personas cercanas.',
              B: 'Acaba de adoptar al perro.',
              C: 'Tiene muchos amigos y familiares viviendo con él.',
              D: 'Odia la soledad pero no le agradan los animales.'
            },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Perfecto! Al decir "Al menos TÚ sigues aquí", infiere que otros ya no están (murieron o se marcharon).',
            feedback_error: 'La expresión "Al menos tú sigues aquí" implica contraste: los demás se han ido.'
          }
        ]
      },
      level: 4,
      order: 4,
      capituloId: 'cap-interpretar',
      materiaId: 'comp-lectora',
      datos_claves: []
    },
  {
    id: 'sec-2-2-inf',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 5,
    order: 5,
    tags: [
      'subcapitulo:Textos Informativos'
    ],
    title: 'Relaciones entre Ideas · Informativos',
    introduccion: 'En un texto bien estructurado, cada párrafo cumple una función respecto a los demás: ejemplifica, contrasta, amplía, causa o concluye. Identificar estas relaciones es fundamental para la PAES.',
    datos_claves: [
      'Causa-Efecto: \'por esta razón\', \'en consecuencia\', \'lo que produjo\'.',
      'Contraste: \'sin embargo\', \'a pesar de\', \'por el contrario\', \'aunque\'.',
      'Ejemplificación: \'por ejemplo\', \'como es el caso de\', \'esto se observa en\'.',
      'Generalización-Especificación: de una afirmación general a un caso concreto.',
      'La pregunta clave: ¿qué función lógica tiene este párrafo respecto al anterior?'
    ],
    test: {
      id: 'test-2-2-inf',
      seccionId: 'sec-2-2-inf',
      contexto_base: 'La revolución industrial transformó radicalmente las estructuras económicas y sociales de Europa durante el siglo XIX. Las ciudades crecieron de forma acelerada a medida que los trabajadores rurales migraban en busca de empleo en las fábricas.\n\nSin embargo, este crecimiento no trajo aparejado un aumento equivalente en las condiciones de vida: los barrios obreros se caracterizaban por el hacinamiento, la falta de saneamiento y jornadas laborales de hasta dieciséis horas diarias.\n\nComo consecuencia, comenzaron a surgir los primeros movimientos obreros organizados, que reclamaban mejores salarios, reducción de la jornada laboral y protección para mujeres y niños trabajadores.\n\nEstos movimientos, aunque reprimidos en sus inicios, sentarían las bases de los derechos laborales modernos que hoy damos por sentados.',
      preguntas: [
        {
          id: 209,
          enunciado: '¿Qué relación existe entre el tercer y cuarto párrafo del texto?',
          alternativas: {
            A: 'El cuarto párrafo contradice la información presentada en el tercero.',
            B: 'El cuarto párrafo es la consecuencia de lo descrito en el tercero.',
            C: 'El cuarto párrafo ejemplifica el crecimiento de las ciudades.',
            D: 'El cuarto párrafo presenta una causa del fenómeno descrito en el tercero.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El cuarto párrafo retoma \'estos movimientos\' mencionados en el tercero y describe su legado a largo plazo: sentaron las bases de los derechos laborales modernos, una consecuencia de su formación.',
          feedback_error: 'Observa que el cuarto párrafo retoma \'estos movimientos\' (mencionados en el tercero) y explica qué provocaron a largo plazo. Esa es la relación causa-efecto entre ambos párrafos.'
        },
        {
          id: 210,
          enunciado: '¿Cuál es la función del conector \'Sin embargo\' en el texto?',
          alternativas: {
            A: 'Introduce un ejemplo del crecimiento industrial.',
            B: 'Presenta una conclusión lógica del argumento anterior.',
            C: 'Establece un contraste entre el crecimiento urbano y las condiciones de vida.',
            D: 'Resume la información del párrafo anterior.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! \'Sin embargo\' siempre introduce un contraste. Aquí contrasta el crecimiento de las ciudades con las malas condiciones de vida de los obreros.',
          feedback_error: '\'Sin embargo\' es un conector adversativo: introduce algo que contradice o matiza lo anterior. ¿Qué idea contradice en este contexto?'
        },
        {
          id: 211,
          enunciado: '¿Cuál es la idea principal de todo el texto?',
          alternativas: {
            A: 'La revolución industrial mejoró las condiciones de vida de todos los trabajadores europeos.',
            B: 'La industrialización generó crecimiento urbano, pero también condiciones que dieron origen a los movimientos obreros y los derechos laborales actuales.',
            C: 'Los movimientos obreros surgieron como resultado de la migración del campo a la ciudad.',
            D: 'La falta de saneamiento fue el principal problema de las ciudades industriales del siglo XIX.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! La idea principal integra toda la cadena causal: industrialización → crecimiento urbano → malas condiciones → movimientos obreros → derechos laborales.',
          feedback_error: 'La idea principal debe cubrir TODO el texto. ¿Cuál abarca el argumento completo?'
        },
        {
          id: 212,
          enunciado: '¿Qué función cumple el último párrafo respecto al texto completo?',
          alternativas: {
            A: 'Introduce nuevos datos sobre la situación actual de los derechos laborales.',
            B: 'Presenta una consecuencia a largo plazo de los movimientos obreros, cerrando el arco argumentativo del texto.',
            C: 'Contradice la información presentada en los párrafos anteriores.',
            D: 'Ejemplifica cómo funciona un movimiento obrero moderno.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Brillante! El último párrafo cierra el arco del texto: desde la revolución industrial hasta los derechos que \'hoy damos por sentados\'.',
          feedback_error: 'El último párrafo menciona \'derechos laborales modernos que hoy damos por sentados\'. ¿Eso introduce algo nuevo o concluye algo anterior?'
        }
      ]
    }
  },
  {
    id: 'sec-2-2-nar',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 5,
    order: 5,
    tags: [
      'subcapitulo:Textos Narrativos'
    ],
    title: 'Relaciones entre Ideas · Narrativos',
    introduccion: 'En los textos narrativos, las relaciones entre ideas se expresan a través de la estructura del relato: las acciones tienen causas, el ambiente afecta a los personajes, y los conflictos se encadenan.',
    datos_claves: [
      'En narrativa, la causa de una acción casi siempre está en la historia previa del personaje.',
      'El ambiente (espacio, clima, época) puede ser causa de comportamientos o reflejo del estado emocional.',
      'Un conflicto desencadena otros conflictos: identifica la cadena de causa-efecto en la trama.',
      'La resolución (o falta de ella) también es una consecuencia de todo lo que vino antes.'
    ],
    test: {
      id: 'test-2-2-nar',
      seccionId: 'sec-2-2-nar',
      contexto_base: 'Después de doce años de silencio, Luis escribió una carta. La dejó sobre la mesa de la cocina, con su nombre escrito en el sobre con la letra de siempre, esa que su padre le había enseñado trazando cada letra con una regla. Había pensado en llamar por teléfono, pero la voz lo traicionaría. Había pensado en ir en persona, pero la vergüenza lo detuvo en la puerta tres veces distintas. La carta era lo más honesto que podía dar: palabras elegidas con tiempo, sin la torpeza del momento. No pedía perdón. Solo explicaba por qué se había ido.',
      preguntas: [
        {
          id: 213,
          enunciado: '¿Por qué Luis eligió escribir una carta en lugar de llamar o ir en persona?',
          alternativas: {
            A: 'Porque no tenía el número de teléfono de su padre.',
            B: 'Porque una carta le permitía expresarse con mayor control y honestidad, sin quedar expuesto por su voz o su vergüenza.',
            C: 'Porque le habían prohibido el contacto directo.',
            D: 'Porque quería que el mensaje llegara más rápido.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El texto lo explica directamente: la voz lo traicionaría (llamar), la vergüenza lo detuvo (ir en persona), y la carta eran \'palabras elegidas con tiempo, sin la torpeza del momento\'.',
          feedback_error: 'El texto explica las tres razones claramente. ¿Por qué descartó cada opción y qué ventaja le daba la carta?'
        },
        {
          id: 214,
          enunciado: '¿Qué relación existe entre el detalle de la letra enseñada con regla y el resto del texto?',
          alternativas: {
            A: 'Muestra que Luis fue un niño muy desordenado.',
            B: 'Establece un vínculo afectivo entre Luis y su padre, que contrasta con el distanciamiento actual.',
            C: 'Indica que el padre de Luis era muy estricto y autoritario.',
            D: 'Sirve solo para describir el estilo de escritura de Luis.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente análisis! La letra enseñada por el padre es un recuerdo afectivo que conecta a Luis con él, contraste poderoso con los \'doce años de silencio\'.',
          feedback_error: '¿Por qué el narrador menciona quién le enseñó esa letra? No es un dato casual. Relaciona ese recuerdo con el contexto de la carta.'
        },
        {
          id: 215,
          enunciado: '¿Cuál es el propósito de la carta que escribe Luis?',
          alternativas: {
            A: 'Pedir disculpas por haberse ido.',
            B: 'Anunciar que regresará pronto.',
            C: 'Explicar las razones por las que se alejó, sin pedir perdón.',
            D: 'Reclamarle algo a su padre.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! El texto lo indica explícitamente: \'No pedía perdón. Solo explicaba por qué se había ido.\'',
          feedback_error: 'Las últimas dos oraciones del texto responden directamente esta pregunta.'
        },
        {
          id: 216,
          enunciado: '¿Qué sugieren los \'doce años de silencio\' sobre la relación entre Luis y su destinatario?',
          alternativas: {
            A: 'Que Luis estuvo de viaje por trabajo durante ese tiempo.',
            B: 'Que la relación se interrumpió de manera prolongada y significativa, con una razón importante detrás.',
            C: 'Que el destinatario nunca quiso retomar el contacto.',
            D: 'Que Luis perdió la memoria y no recordaba a su familiar.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Doce años no es un alejamiento casual. Su duración y el hecho de que Luis necesite una carta para \'explicar por qué se fue\' implican una ruptura significativa.',
          feedback_error: '¿Por qué alguien necesita explicar por escrito una ausencia de 12 años? Eso implica que la separación tuvo una razón poderosa.'
        }
      ]
    }
  },
  {
    id: 'sec-2-prac-2',
    title: 'Conclusiones Mayores',
    introduccion: 'Práctica intensiva de inferencias globales. Sintetiza la información, reconoce la intención y extrae la tesis implícita de estos 5 fragmentos.',
    isPractice: true,
    test: {
      id: 'test-2-prac-2',
      contexto_base: 'TEXTO 1\nEl transporte público en las grandes ciudades se ha vuelto insostenible debido al aumento desmesurado del parque automotriz y las emisiones de gases. Las calles están congestionadas y la calidad del aire empeora cada día. Como respuesta a esta crisis, varios municipios han comenzado a implementar redes exclusivas para bicicletas y subsidios para la compra de vehículos eléctricos, buscando no solo descongestionar las vías, sino también reducir drásticamente la huella de carbono urbana.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nDurante siglos, la sal fue uno de los productos más valiosos del mundo, llegando a usarse como moneda de cambio (de ahí la palabra "salario"). Su valor radicaba en su capacidad única para conservar los alimentos antes de la invención de la refrigeración, previniendo la proliferación de bacterias en carnes y pescados. Sin embargo, con la llegada de la tecnología moderna, la sal perdió su estatus de recurso estratégico y se convirtió en un condimento de mesa común y económico.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nLa arquitectura brutalista, surgida a mediados del siglo XX, se caracteriza por el uso de hormigón crudo, formas geométricas masivas y una estética utilitaria. Aunque sus creadores la concibieron como una expresión de honestidad estructural y democratización del espacio, el público general a menudo percibe estos edificios como fríos, opresivos e inhumanos. Hoy en día, muchos de estos gigantes de concreto enfrentan la demolición, atrapados entre el desprecio popular y la defensa apasionada de historiadores del arte.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nEl sueño es un proceso biológico fundamental, tan vital como respirar o comer. Durante las fases de sueño profundo, el cerebro realiza un verdadero "lavado", eliminando toxinas acumuladas durante la vigilia a través del sistema glinfático. Investigadores han observado que la privación crónica de sueño interrumpe este proceso. **Por ejemplo**, estudios recientes vinculan la falta sostenida de sueño profundo con una mayor acumulación de proteínas asociadas a enfermedades neurodegenerativas como el Alzheimer.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nLa migración de las mariposas monarca es uno de los fenómenos más impresionantes de la naturaleza. Cada otoño, millones de estos insectos viajan miles de kilómetros desde Canadá y Estados Unidos hasta los bosques de oyamel en México. **Este viaje no es realizado por un solo individuo, sino que toma varias generaciones completarlo.** El mecanismo de navegación que utilizan sigue siendo en gran parte un misterio, aunque se cree que se orientan por la posición del sol y el campo magnético terrestre.',
      preguntas: [
        {
          id: 25001,
          texto_index: 0,
          enunciado: '¿Cuál es la conclusión principal sobre las medidas adoptadas por los municipios (TEXTO 1)?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Son insuficientes para resolver el problema del parque automotriz.',
            B: 'Buscan dar una solución ecológica y de movilidad al problema de congestión y contaminación.',
            C: 'Tienen como objetivo principal enriquecer a los vendedores de vehículos eléctricos.',
            D: 'Provocarán un aumento en la congestión de las calles debido a las ciclovías.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Las medidas descritas actúan como una solución directa al problema planteado de congestión y contaminación (relación problema-solución).',
          feedback_error: 'Identifica para qué se están implementando las redes y subsidios: buscan solucionar tanto el tráfico como las emisiones.'
        },
        {
          id: 25002,
          texto_index: 1,
          enunciado: '¿Cuál de las siguientes opciones sintetiza mejor el contenido del TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'La sal es un condimento económico que antes se usaba como moneda.',
            B: 'La refrigeración moderna destruyó el valor de la sal en el mercado global.',
            C: 'El valor histórico de la sal derivaba de su uso como conservante, importancia que perdió con la tecnología moderna.',
            D: 'La palabra "salario" proviene del uso antiguo de la sal para prevenir bacterias en la carne.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! La alternativa C logra sintetizar de forma global la idea de la importancia histórica de la sal por su función conservadora y su posterior declive por la tecnología.',
          feedback_error: 'Busca la opción que abarque el antes (conservante valioso) y el después (tecnología redujo su estatus).'
        },
        {
          id: 25003,
          texto_index: 2,
          enunciado: 'Se puede inferir globalmente del TEXTO 3 que la arquitectura brutalista:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Fue diseñada intencionalmente para resultar opresiva a los ciudadanos.',
            B: 'Genera una marcada polarización entre su intención original y la percepción del público.',
            C: 'Es el estilo arquitectónico más exitoso del siglo XX debido a su honestidad estructural.',
            D: 'Será demolida en su totalidad en los próximos años por exigencia popular.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Bien deducido! El texto contrasta la intención de los creadores y la defensa de los historiadores con el rechazo y percepción negativa del público general, evidenciando una fuerte polarización.',
          feedback_error: 'Lee con atención el contraste entre cómo la concibieron sus creadores y cómo la percibe el público general.'
        },
        {
          id: 25004,
          texto_index: 3,
          enunciado: 'En el TEXTO 4, ¿qué función cumple el conector "**Por ejemplo**" en relación con el resto del párrafo?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Introducir un caso concreto que ilustra la consecuencia de interrumpir el "lavado" cerebral.',
            B: 'Refutar la idea de que el sueño elimina toxinas mediante el sistema glinfático.',
            C: 'Cuestionar la importancia del sueño como proceso biológico fundamental.',
            D: 'Presentar una nueva enfermedad que no tiene relación con el sistema glinfático.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! El ejemplo utilizado tiene la función de ilustrar y dar sustento empírico (los estudios) a la afirmación previa sobre el peligro de privarse del sueño.',
          feedback_error: 'Un ejemplo normalmente sirve para ilustrar, clarificar o apoyar una afirmación que se acaba de hacer.'
        },
        {
          id: 25005,
          texto_index: 4,
          enunciado: 'En el TEXTO 5, ¿qué nivel de importancia tiene la oración en negrita dentro de la jerarquía de las ideas del texto?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es la idea principal que engloba todo el fenómeno migratorio.',
            B: 'Es una conclusión que resume el misterio de su mecanismo de navegación.',
            C: 'Es una idea secundaria que aporta un dato específico y sorprendente sobre cómo se realiza el viaje.',
            D: 'Es información accesoria e irrelevante para entender la migración de las mariposas.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Muy bien! La oración en negrita detalla una característica particular del viaje (que toma varias generaciones), subordinada a la idea central del asombroso fenómeno migratorio en sí mismo.',
          feedback_error: 'La oración en negrita no es el tema central (que es la migración en sí), pero tampoco es irrelevante. Es un dato complementario importante.'
        }
      ],
      seccionId: 'sec-2-prac-2'
    },
    level: 6,
    order: 6,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-3-join',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 7,
    order: 7,
    tags: [
      'subcapitulo:Práctica'
    ],
    title: '🧩 Práctica: Conectores Lógicos',
    introduccion: 'Los conectores lógicos son el \'pegamento\' del texto: revelan cómo las ideas se relacionan entre sí. Dominarlos te permite interpretar cualquier tipo de texto con mucha mayor precisión.',
    datos_claves: [
      'CAUSA: porque, ya que, dado que, puesto que, pues.',
      'CONSECUENCIA: por lo tanto, en consecuencia, de modo que, por ende.',
      'CONTRASTE: sin embargo, a pesar de, aunque, no obstante, pero.',
      'ADICIÓN: además, asimismo, también, por otra parte.',
      'EJEMPLIFICACIÓN: por ejemplo, como es el caso de, tal como.',
      'CONCLUSIÓN: en conclusión, en resumen, finalmente, en definitiva.'
    ],
    isPractice: true,
    practiceType: 'fill-blanks',
    practiceData: {
      title: 'Completar Oraciones',
      description: 'Selecciona el conector lógico correcto para completar cada oración. Piensa en la relación (causa, consecuencia, contraste, etc.) entre las dos ideas.',
      items: [
        {
          id: 1,
          textBefore: 'El alumno estudió toda la noche; ',
          textAfter: ', reprobó el examen.',
          options: ['porque', 'por lo tanto', 'además', 'sin embargo'],
          correctOption: 'sin embargo',
          hint: 'Introduce un contraste: esperaríamos que el estudio resultara en aprobación, pero ocurrió lo contrario.'
        },
        {
          id: 2,
          textBefore: 'La deforestación elimina el hábitat de miles de especies; ',
          textAfter: ', muchas están en peligro de extinción.',
          options: ['no obstante', 'por consiguiente', 'aunque', 'por ejemplo'],
          correctOption: 'por consiguiente',
          hint: 'Indica que el peligro de extinción es la consecuencia directa de la deforestación.'
        },
        {
          id: 3,
          textBefore: 'Los pingüinos son aves. ',
          textAfter: ', no pueden volar.',
          options: ['Por ende', 'Sin embargo', 'Además', 'Es decir'],
          correctOption: 'Sin embargo',
          hint: 'Ser ave generalmente implica volar, los pingüinos son una excepción.'
        },
        {
          id: 4,
          textBefore: 'Chile tiene una gran variedad de climas. ',
          textAfter: ', en el norte está el desierto de Atacama y en el sur, la Patagonia.',
          options: ['En consecuencia', 'Por el contrario', 'Por ejemplo', 'Puesto que'],
          correctOption: 'Por ejemplo',
          hint: 'El Atacama y la Patagonia son casos específicos que ilustran la variedad de climas.'
        },
        {
          id: 5,
          textBefore: 'No pudimos iniciar la transmisión del partido, ',
          textAfter: ' se cortó la fibra óptica en el sector.',
          options: ['ya que', 'por consiguiente', 'es decir', 'a pesar de que'],
          correctOption: 'ya que',
          hint: 'La segunda parte de la oración explica la causa o el motivo por el cual no se pudo iniciar la transmisión.'
        },
        {
          id: 6,
          textBefore: 'El nuevo modelo de smartphone cuenta con una mejor cámara. ',
          textAfter: ', su batería dura el doble que la versión anterior.',
          options: ['Sin embargo', 'Asimismo', 'Por lo tanto', 'En resumen'],
          correctOption: 'Asimismo',
          hint: 'Se está sumando o añadiendo otra característica positiva a la ya mencionada.'
        },
        {
          id: 7,
          textBefore: 'Redujimos costos operativos, aumentamos las ventas y mejoramos la satisfacción del cliente. ',
          textAfter: ', fue un año excelente para la empresa.',
          options: ['En definitiva', 'Por el contrario', 'Además', 'Porque'],
          correctOption: 'En definitiva',
          hint: 'Esta frase sintetiza o concluye todo lo enumerado anteriormente.'
        },
        {
          id: 8,
          textBefore: '',
          textAfter: ' la película recibió pésimas críticas por parte de los expertos, rompió récords de taquilla en su primer fin de semana.',
          options: ['Dado que', 'Aunque', 'Por ende', 'Es decir'],
          correctOption: 'Aunque',
          hint: 'Existe un obstáculo (críticas malas) que no impide el éxito (buena taquilla). Es una relación concesiva.'
        },
        {
          id: 9,
          textBefore: 'La demanda por vehículos eléctricos ha crecido exponencialmente en la última década; ',
          textAfter: ', la necesidad de litio para baterías también se ha disparado.',
          options: ['por ende', 'sin embargo', 'puesto que', 'además'],
          correctOption: 'por ende',
          hint: 'El disparo en la necesidad de litio es una consecuencia natural y directa del crecimiento de los vehículos eléctricos.'
        },
        {
          id: 10,
          textBefore: 'El escritor utiliza un lenguaje críptico y lleno de neologismos; ',
          textAfter: ', es muy difícil de entender para el lector promedio.',
          options: ['es decir', 'aunque', 'por ejemplo', 'ya que'],
          correctOption: 'es decir',
          hint: 'La segunda parte aclara o dice con otras palabras lo que significa "críptico y lleno de neologismos".'
        }
      ]
    }
  },
  {
    id: 'sec-2-protip-2',
    title: 'El truco de las palabras raras',
    introduccion: 'En la PAES, a menudo te pedirán interpretar el sentido de una palabra o frase (\'¿En qué sentido se usa X?\'). El truco es <b>nunca</b> responder con el significado de diccionario de la palabra, sino con el significado que toma <b>dentro de ese contexto específico</b>.',
    datos_claves: [
      'Reemplaza mentalmente la palabra por la alternativa y lee la oración completa. ¿Mantiene el sentido?',
      'Cuidado con las palabras de uso múltiple o con sentido connotativo (figurado).'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-2',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-2'
    },
    level: 8,
    order: 8,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-4-inf',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 9,
    order: 9,
    tags: [
      'subcapitulo:Textos Informativos'
    ],
    title: 'Idea Principal y Síntesis · Informativos',
    introduccion: 'Sintetizar consiste en identificar la idea central del texto o de un párrafo, separándola de los detalles de apoyo. Es una de las habilidades más evaluadas en la PAES.',
    datos_claves: [
      'La idea principal NO es el tema. La idea principal es la afirmación más importante del texto.',
      'Las ideas secundarias apoyan, ejemplifican o desarrollan la idea principal, pero no son la respuesta.',
      'Si puedes eliminar una idea sin que el texto pierda su argumento central, es secundaria.',
      'La opción incorrecta más frecuente es una idea que SÍ aparece en el texto pero solo es un detalle de apoyo.'
    ],
    test: {
      id: 'test-2-4-inf',
      seccionId: 'sec-2-4-inf',
      contexto_base: 'La Antártica es el continente más frío, más seco y más ventoso del planeta. Su capa de hielo almacena aproximadamente el 70% del agua dulce del mundo y su grosor promedio supera los 2.000 metros. Sin embargo, más allá de estos datos geográficos, la Antártica ocupa un lugar central en el estudio del cambio climático. Los núcleos de hielo extraídos de sus capas más profundas permiten a los científicos reconstruir el clima terrestre de hasta 800.000 años atrás, incluyendo concentraciones de gases de efecto invernadero, temperaturas y eventos volcánicos. Esta información es invaluable para comprender cómo el clima ha cambiado en el pasado y para construir modelos precisos que proyecten escenarios futuros. En este sentido, la pérdida acelerada de la masa de hielo antártico no es solo una pérdida geográfica: es una amenaza directa para nuestra capacidad de entender y anticipar el cambio climático.',
      preguntas: [
        {
          id: 217,
          enunciado: '¿Cuál es la idea principal del texto?',
          alternativas: {
            A: 'La Antártica es el continente más frío y seco del planeta y alberga el 70% del agua dulce mundial.',
            B: 'Los núcleos de hielo antártico permiten reconstruir el clima de hasta 800.000 años atrás.',
            C: 'La Antártica es fundamental para el estudio del cambio climático y su pérdida de hielo representa una amenaza para dicho conocimiento.',
            D: 'El grosor promedio de la capa de hielo antártico supera los 2.000 metros.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Las opciones A y D son datos de apoyo. La B es un detalle específico. Solo C sintetiza el argumento completo del texto: el valor de la Antártica para el estudio climático y la amenaza de su pérdida.',
          feedback_error: 'La idea principal debe cubrir TODO el texto. Las opciones A, B y D son verdaderas pero solo aparecen en una parte. ¿Cuál cubre el argumento completo?'
        },
        {
          id: 218,
          enunciado: '¿Cuál de las siguientes ideas es SECUNDARIA respecto a la idea principal?',
          alternativas: {
            A: 'La Antártica es clave para entender el cambio climático.',
            B: 'La pérdida del hielo antártico amenaza el conocimiento científico.',
            C: 'El grosor promedio de la capa de hielo es de 2.000 metros.',
            D: 'Los núcleos de hielo revelan datos climáticos del pasado.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! El grosor es un dato geográfico de apoyo del primer párrafo. Si lo elimináramos, el texto conserva su argumento principal intacto.',
          feedback_error: 'Elimina mentalmente cada opción del texto. ¿Cuál puede quitarse sin debilitar el argumento del autor? Esa es la idea secundaria.'
        },
        {
          id: 219,
          enunciado: '¿Qué función cumple el primer párrafo respecto al resto del texto?',
          alternativas: {
            A: 'Presenta la conclusión del texto.',
            B: 'Describe los datos geográficos básicos de la Antártica, contextualizando su importancia antes de introducir el argumento central.',
            C: 'Contrasta la Antártica con otros continentes.',
            D: 'Resume el impacto del cambio climático en la Antártica.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! El primer párrafo presenta datos geográficos generales, pero la frase \'Sin embargo, más allá de estos datos\' señala que lo que sigue es el argumento real. El primer párrafo contextualiza.',
          feedback_error: 'Fíjate en la frase \'Sin embargo, más allá de estos datos geográficos...\'. Ese conector indica que los datos anteriores eran solo el contexto.'
        },
        {
          id: 220,
          enunciado: '¿Qué se puede concluir a partir de la última oración del texto?',
          alternativas: {
            A: 'La pérdida del hielo antártico es el principal causante del calentamiento global actual.',
            B: 'Sin la Antártica, sería imposible vivir en el planeta.',
            C: 'La desaparición del hielo antártico amenaza tanto datos científicos históricos como la capacidad de predecir escenarios climáticos futuros.',
            D: 'Los científicos ya saben todo lo necesario sobre el cambio climático gracias a los núcleos de hielo.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! La última oración dice que perder el hielo es \'una amenaza directa para nuestra capacidad de entender y anticipar el cambio climático\'. Eso implica tanto el conocimiento histórico como la proyección futura.',
          feedback_error: 'La última oración habla de \'entender Y anticipar\'. ¿Cuál opción recoge ambas dimensiones?'
        }
      ]
    }
  },
  {
    id: 'sec-2-4-nar',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 9,
    order: 9,
    tags: [
      'subcapitulo:Textos Narrativos'
    ],
    title: 'Tema e Idea Central · Narrativos',
    introduccion: 'En los textos narrativos, el tema es el asunto del relato (la soledad, la memoria, la injusticia). La idea central es lo que el texto quiere DECIR sobre ese tema. Son cosas distintas.',
    datos_claves: [
      'El TEMA es un sustantivo o frase corta: \'la pérdida\', \'la identidad\', \'la traición\'.',
      'La IDEA CENTRAL es la afirmación que el texto hace sobre ese tema: \'la pérdida puede transformar nuestra forma de entender el mundo\'.',
      'El tema se extrae fácilmente. La idea central requiere interpretar el mensaje completo del texto.',
      'La idea central suele manifestarse en el clímax o en las últimas líneas del relato.'
    ],
    test: {
      id: 'test-2-4-nar',
      seccionId: 'sec-2-4-nar',
      contexto_base: 'El abuelo había guardado silencio toda la vida sobre la guerra. Sus manos, que en algún momento sujetaron un fusil, ahora construían pájaros de madera para sus nietos. Nunca contó nada, pero los pájaros eran cada vez más pequeños, más frágiles, como si cada uno contuviera un pedazo de algo que se estaba acabando. El día que murió, encontraron cientos de ellos en una caja bajo su cama. Cada uno tenía un nombre escrito en la base, con una fecha. Nadie supo nunca qué significaban. Nadie preguntó a tiempo.',
      preguntas: [
        {
          id: 221,
          enunciado: '¿Cuál es el tema central de este relato?',
          alternativas: {
            A: 'La artesanía en madera como tradición familiar.',
            B: 'La guerra y sus consecuencias físicas en los soldados.',
            C: 'La memoria silenciada y lo que se pierde cuando nadie pregunta.',
            D: 'La relación entre abuelos y nietos en tiempos modernos.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! El relato gira en torno al silencio del abuelo sobre su pasado y la imposibilidad de recuperarlo después de su muerte. \'Nadie preguntó a tiempo\' sintetiza la pérdida de la memoria.',
          feedback_error: 'Los pájaros y la guerra son detalles. ¿Qué es lo que el texto lamenta? ¿Qué se perdió cuando el abuelo murió?'
        },
        {
          id: 222,
          enunciado: '¿Qué representan los pájaros de madera en el relato?',
          alternativas: {
            A: 'Son un simple pasatiempo del abuelo en su vejez.',
            B: 'Son metáforas de los recuerdos y las personas que el abuelo cargó en silencio durante toda su vida.',
            C: 'Son juguetes que el abuelo fabricaba para vender.',
            D: 'Representan la libertad que el abuelo nunca tuvo.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Brillante! Cada pájaro tiene nombre y fecha. Son demasiado numerosos y personales para ser un pasatiempo casual. Representan memorias cargadas en silencio.',
          feedback_error: 'Los pájaros tienen nombre y fecha en la base. Hay cientos de ellos. ¿Puede un simple pasatiempo generar algo así?'
        },
        {
          id: 223,
          enunciado: '¿Cuál es la idea central que transmite el relato?',
          alternativas: {
            A: 'La guerra destruye la capacidad de comunicación de los combatientes.',
            B: 'Los recuerdos traumáticos se expresan de forma indirecta y se pierden cuando nadie hace las preguntas correctas a tiempo.',
            C: 'Los abuelos siempre guardan secretos de sus familias.',
            D: 'La artesanía es una forma de superar el trauma de la guerra.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! La idea central combina el trauma expresado de forma indirecta (los pájaros), el silencio (nunca contó nada) y la pérdida irrecuperable (\'Nadie preguntó a tiempo\').',
          feedback_error: 'La idea central debe integrar: el silencio del abuelo, los pájaros como expresión indirecta y la frase final. ¿Qué opción los une a todos?'
        },
        {
          id: 224,
          enunciado: '¿Cuál es el efecto de la última oración \'Nadie preguntó a tiempo\'?',
          alternativas: {
            A: 'Critica directamente a los familiares del abuelo por ser descuidados.',
            B: 'Introduce una moraleja explícita sobre la importancia de hablar con los ancianos.',
            C: 'Genera una sensación de pérdida irreparable y cierra el relato con un lamento implícito.',
            D: 'Sugiere que hay una continuación de la historia en otro texto.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! La última oración no culpa ni moraliza: lamenta. El uso de \'a tiempo\' implica que ya es demasiado tarde, generando una sensación de pérdida definitiva.',
          feedback_error: 'La oración no culpa (\'nadie\' es neutral). Es un cierre. ¿Qué sentimiento provoca saber que algo importante ya no podrá recuperarse?'
        }
      ]
    }
  },
  {
    id: 'sec-2-prac-3',
    title: 'Vocabulario en Contexto',
    introduccion: 'Práctica rápida de significado contextual.',
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Conecta el Significado',
      description: 'Une cada expresión con el sentido que toma en su contexto.',
      rounds: [
        {
          pairs: [
            { id: 1, left: 'Balde de agua fría', right: 'Sorpresa desagradable', hint: 'Apaga el entusiasmo repentinamente.' },
            { id: 2, left: 'Dar en el clavo', right: 'Acertar con precisión', hint: 'Dar exactamente en el punto.' },
            { id: 3, left: 'Echar leña al fuego', right: 'Empeorar la situación', hint: 'Aumentar el conflicto o problema.' },
            { id: 4, left: 'Ahogarse en un vaso de agua', right: 'Exagerar problema menor', hint: 'Preocuparse demasiado por algo pequeño.' }
          ]
        },
        {
          pairs: [
            { id: 5, left: 'Hacer la vista gorda', right: 'Ignorar deliberadamente', hint: 'Fingir que no se ve algo incorrecto.' },
            { id: 6, left: 'Tirar la toalla', right: 'Rendirse', hint: 'Abandonar un esfuerzo o lucha.' },
            { id: 7, left: 'Poner las cartas sobre la mesa', right: 'Hablar con franqueza', hint: 'Revelar las verdaderas intenciones.' },
            { id: 8, left: 'Estar en las nubes', right: 'Estar distraído', hint: 'No prestar atención a la realidad.' }
          ]
        },
        {
          pairs: [
            { id: 9, left: 'Pasar por alto', right: 'Omitir o ignorar', hint: 'No dar importancia a un detalle.' },
            { id: 10, left: 'Hacer hincapié', right: 'Enfatizar', hint: 'Dar especial importancia a algo.' },
            { id: 11, left: 'Punto de inflexión', right: 'Momento de cambio decisivo', hint: 'Instante donde la situación se revierte.' },
            { id: 12, left: 'Arma de doble filo', right: 'Situación con pros y contras', hint: 'Algo que puede beneficiar pero también dañar.' }
          ]
        },
        {
          pairs: [
            { id: 13, left: 'Llover sobre mojado', right: 'Repetirse una desgracia', hint: 'Un problema que ocurre sobre otro ya existente.' },
            { id: 14, left: 'Dar luz verde', right: 'Autorizar', hint: 'Dar permiso para iniciar algo.' },
            { id: 15, left: 'Estar entre la espada y la pared', right: 'Estar en un dilema', hint: 'Tener que decidir entre dos opciones difíciles.' },
            { id: 16, left: 'Dejar mucho que desear', right: 'Ser deficiente', hint: 'No cumplir con las expectativas.' }
          ]
        },
        {
          pairs: [
            { id: 17, left: 'Hilar fino', right: 'Ser muy detallista', hint: 'Analizar las cosas con extremo rigor.' },
            { id: 18, left: 'Echar raíces', right: 'Establecerse', hint: 'Quedarse a vivir de forma permanente en un lugar.' },
            { id: 19, left: 'Romper el hielo', right: 'Iniciar una interacción', hint: 'Acabar con la tensión inicial en una conversación.' },
            { id: 20, left: 'Ir al grano', right: 'Ir directo al asunto', hint: 'Omitir rodeos y decir lo principal.' }
          ]
        },
        {
          pairs: [
            { id: 21, left: 'Gato por liebre', right: 'Engaño o estafa', hint: 'Dar algo de menor calidad de lo prometido.' },
            { id: 22, left: 'Dormirse en los laureles', right: 'Descuidarse tras un éxito', hint: 'Dejar de esforzarse por confianza excesiva.' },
            { id: 23, left: 'Tener la sartén por el mango', right: 'Tener el control', hint: 'Estar en una posición de ventaja.' },
            { id: 24, left: 'A la vuelta de la esquina', right: 'Muy cercano', hint: 'Algo que está a punto de suceder.' }
          ]
        },
        {
          pairs: [
            { id: 25, left: 'Coser y cantar', right: 'Algo muy fácil', hint: 'Que no requiere mayor esfuerzo.' },
            { id: 26, left: 'Estar en el ojo del huracán', right: 'Ser el centro de críticas', hint: 'Estar en medio de la polémica.' },
            { id: 27, left: 'Poner el dedo en la llaga', right: 'Señalar el punto sensible', hint: 'Tocar el tema que más duele o molesta.' },
            { id: 28, left: 'Cortar por lo sano', right: 'Tomar decisión radical', hint: 'Eliminar el problema de raíz, sin dudar.' }
          ]
        },
        {
          pairs: [
            { id: 29, left: 'Dar la espalda', right: 'Abandonar o ignorar', hint: 'Negar ayuda a quien la necesita.' },
            { id: 30, left: 'Tomar al toro por las astas', right: 'Afrontar un problema', hint: 'Enfrentar las dificultades de forma directa.' },
            { id: 31, left: 'Ser pan comido', right: 'Ser muy fácil', hint: 'Algo que no representa dificultad alguna.' },
            { id: 32, left: 'Sacar a la luz', right: 'Revelar algo oculto', hint: 'Hacer público un secreto.' }
          ]
        },
        {
          pairs: [
            { id: 33, left: 'Mantener al margen', right: 'No intervenir', hint: 'Quedarse fuera de un asunto o problema.' },
            { id: 34, left: 'Estar a flor de piel', right: 'Estar muy sensible', hint: 'Tener las emociones a punto de desbordarse.' },
            { id: 35, left: 'Hacer eco', right: 'Repercutir o difundir', hint: 'Repetir o dar a conocer una noticia o idea.' },
            { id: 36, left: 'Dar la talla', right: 'Cumplir con expectativas', hint: 'Estar a la altura de lo que se requiere.' }
          ]
        },
        {
          pairs: [
            { id: 37, left: 'Pasar la página', right: 'Superar un problema', hint: 'Dejar el pasado atrás y avanzar.' },
            { id: 38, left: 'Tirar la casa por la ventana', right: 'Gastar sin medida', hint: 'Hacer un gasto excesivo para celebrar algo.' },
            { id: 39, left: 'Saltar a la vista', right: 'Ser evidente', hint: 'Algo tan claro que no necesita explicación.' },
            { id: 40, left: 'Bajar la guardia', right: 'Descuidar la precaución', hint: 'Relajarse frente a un posible peligro.' }
          ]
        }
      ]
    },
    test: {
      id: 'test-sec-2-prac-3',
      seccionId: 'sec-2-prac-3',
      contexto_base: null,
      preguntas: []
    },
    level: 10,
    order: 10,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-5-join',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 11,
    order: 11,
    tags: [
      'subcapitulo:Práctica'
    ],
    title: '🧩 Práctica: Sinónimos en Contexto',
    introduccion: 'El vocabulario en contexto consiste en determinar el significado de una palabra según cómo se usa en el texto, no su definición de diccionario. Es una de las preguntas más frecuentes en la PAES.',
    datos_claves: [
      'Nunca elijas la definición de diccionario sin antes verificar que tiene sentido EN ESE contexto específico.',
      'Sustituye mentalmente la palabra por cada alternativa y elige la que mantiene el sentido del texto.',
      'Las palabras polisémicas (varios significados) son las más difíciles: \'capital\', \'banco\', \'pata\', \'cabo\'.',
      'El contexto inmediato (la oración) y el contexto amplio (el párrafo) determinan el significado.'
    ],
    isPractice: true,
    practiceType: 'synonyms',
    practiceData: {
      title: 'Conecta el Sinónimo',
      description: 'Haz clic en una palabra de la izquierda y luego en el sinónimo de la derecha que mejor la reemplace según el contexto PAES. ¡Entrena tu vocabulario!',
      rounds: [
        {
          pairs: [
            { id: 1, word: 'Lapidario', synonym: 'Contundente', hint: 'Un discurso lapidario es definitivo y no deja lugar a dudas.' },
            { id: 2, word: 'Implementar', synonym: 'Aplicar', hint: 'Poner en funcionamiento o aplicar métodos.' },
            { id: 3, word: 'Controversia', synonym: 'Polémica', hint: 'Debate o disputa sobre un tema.' },
          ]
        },
        {
          pairs: [
            { id: 4, word: 'Cabo', synonym: 'Extremo', hint: 'El cabo de un hilo es su punta o extremo.' },
            { id: 5, word: 'Relevante', synonym: 'Importante', hint: 'Algo que sobresale por su importancia.' },
            { id: 6, word: 'Escasez', synonym: 'Carencia', hint: 'Falta de lo necesario para subsistir.' },
          ]
        },
        {
          pairs: [
            { id: 7, word: 'Deterioro', synonym: 'Desgaste', hint: 'Empeoramiento del estado o calidad de algo.' },
            { id: 8, word: 'Predominio', synonym: 'Dominio', hint: 'Tener superioridad o ventaja sobre otros.' },
            { id: 9, word: 'Arrojar', synonym: 'Producir', hint: 'Arrojar resultados significa revelarlos o producirlos.' },
          ]
        },
        {
          pairs: [
            { id: 10, word: 'Paradigma', synonym: 'Modelo', hint: 'Ejemplo o modelo que se toma como referencia.' },
            { id: 11, word: 'Efímero', synonym: 'Pasajero', hint: 'Que dura muy poco tiempo.' },
            { id: 12, word: 'Innato', synonym: 'Natural', hint: 'Que no es aprendido y pertenece a la naturaleza de un ser.' },
          ]
        },
        {
          pairs: [
            { id: 13, word: 'Subyacer', synonym: 'Fundamentar', hint: 'Estar en la base de algo, servirle de sustento oculto.' },
            { id: 14, word: 'Erradicar', synonym: 'Eliminar', hint: 'Arrancar de raíz o eliminar completamente.' },
            { id: 15, word: 'Sustancial', synonym: 'Fundamental', hint: 'De gran importancia o valor.' },
          ]
        },
        {
          pairs: [
            { id: 16, word: 'Empírico', synonym: 'Experimental', hint: 'Basado en la experiencia y en la observación.' },
            { id: 17, word: 'Incipiente', synonym: 'Inicial', hint: 'Que está empezando.' },
            { id: 18, word: 'Tangible', synonym: 'Palpable', hint: 'Que se puede tocar o percibir de manera precisa.' },
          ]
        },
        {
          pairs: [
            { id: 19, word: 'Mitigar', synonym: 'Atenuar', hint: 'Suavizar o disminuir la dureza de algo.' },
            { id: 20, word: 'Discrepar', synonym: 'Disentir', hint: 'Estar en desacuerdo con otra persona.' },
            { id: 21, word: 'Auge', synonym: 'Apogeo', hint: 'El momento de mayor intensidad o esplendor.' },
          ]
        },
        {
          pairs: [
            { id: 22, word: 'Plausible', synonym: 'Aceptable', hint: 'Que admite aprobación o justificación.' },
            { id: 23, word: 'Obsoleto', synonym: 'Anticuado', hint: 'Que ha dejado de usarse o está pasado de moda.' },
            { id: 24, word: 'Connotación', synonym: 'Sentido implícito', hint: 'Significado añadido o sugerido de una palabra.' },
          ]
        },
        {
          pairs: [
            { id: 25, word: 'Inherente', synonym: 'Propio', hint: 'Que por su naturaleza está unido a algo.' },
            { id: 26, word: 'Vulnerable', synonym: 'Susceptible', hint: 'Que puede ser herido o recibir daño.' },
            { id: 27, word: 'Analogía', synonym: 'Semejanza', hint: 'Relación de parecido entre cosas distintas.' },
          ]
        },
        {
          pairs: [
            { id: 28, word: 'Ineludible', synonym: 'Inevitable', hint: 'Que no se puede evitar o rehuir.' },
            { id: 29, word: 'Arbitrario', synonym: 'Caprichoso', hint: 'Sujeto al capricho antes que a la razón.' },
            { id: 30, word: 'Dogma', synonym: 'Precepto', hint: 'Principio innegable de una ciencia o religión.' },
          ]
        }
      ]
    }
  },
  {
    id: 'sec-2-protip-3',
    title: 'La Idea Principal',
    introduccion: 'Discriminar la información fundamental (idea principal) de la accesoria (detalles) es vital. La idea principal responde a la pregunta: <b>¿De qué trata principalmente el párrafo o texto?</b>',
    datos_claves: [
      'Un buen truco es imaginar que tienes que resumir el texto en un tweet de una sola línea. Lo que escribas será la idea principal.',
      'Las ideas principales suelen estar al principio o al final de los párrafos. Los ejemplos, fechas y nombres específicos casi siempre son ideas accesorias.'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-3',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-3'
    },
    level: 12,
    order: 12,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-6-inf',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 13,
    order: 13,
    tags: [
      'subcapitulo:Textos Informativos'
    ],
    title: 'Jerarquía de Ideas · Informativos',
    introduccion: 'Identificar la jerarquía de ideas significa distinguir entre la información fundamental (idea principal) y la accesoria (ejemplos, detalles, explicaciones).',
    datos_claves: [
      'Identifica el orden de importancia: tesis > argumentos principales > ejemplos/datos.',
      'Las ideas accesorias pueden eliminarse sin alterar el mensaje fundamental del texto.',
      'Cuidado con las preguntas trampa que presentan una idea secundaria correcta como si fuera la principal.'
    ],
    test: {
      id: 'test-2-6-inf',
      seccionId: 'sec-2-6-inf',
      contexto_base: 'El uso intensivo de pantallas antes de dormir afecta negativamente la calidad del sueño humano. Esto se debe principalmente a que la luz azul emitida por dispositivos como teléfonos móviles, tabletas y computadoras inhibe la secreción de melatonina, la hormona responsable de regular el ciclo circadiano. Por ejemplo, un estudio reciente demostró que leer en un e-reader retroiluminado retrasa el inicio del sueño en un promedio de 20 minutos en comparación con leer un libro impreso. Por consiguiente, los especialistas recomiendan establecer un \'toque de queda digital\' al menos una hora antes de ir a la cama.',
      preguntas: [
        {
          id: 260,
          enunciado: 'En relación con la jerarquía del texto, ¿qué función cumple la mención del estudio sobre los e-readers?',
          alternativas: {
            A: 'Es la idea principal que busca advertir sobre el peligro de los e-readers.',
            B: 'Es una idea accesoria que sirve como ejemplo específico para ilustrar la idea fundamental.',
            C: 'Es la conclusión a la que llega el autor tras analizar la melatonina.',
            D: 'Es una tesis que se busca refutar con el \'toque de queda digital\'.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Los estudios y estadísticas suelen ser ideas accesorias de ejemplificación.',
          feedback_error: 'Identifica si el estudio es el tema de todo el texto, o solo un caso particular para apoyar una idea mayor.'
        },
        {
          id: 261,
          enunciado: '¿Cuál es la idea principal o tesis del fragmento?',
          alternativas: {
            A: 'La luz azul inhibe la secreción de melatonina.',
            B: 'Los libros impresos son mejores que los e-readers.',
            C: 'El uso de pantallas antes de dormir perjudica el sueño humano.',
            D: 'Los especialistas recomiendan no usar el teléfono nunca.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Esta es la idea que engloba y da sentido a todos los demás datos del texto.',
          feedback_error: 'Busca la afirmación más amplia que es respaldada por todas las demás oraciones.'
        },
        {
          id: 2611,
          enunciado: '¿Qué rol cumple la oración sobre la inhibición de la melatonina?',
          alternativas: {
            A: 'Es la idea principal del texto.',
            B: 'Es un argumento o explicación causal que sostiene la tesis.',
            C: 'Es una conclusión derivada del ejemplo de los e-readers.',
            D: 'Es una idea accesoria que podría eliminarse sin perder información.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Bien! Explica científicamente el porqué de la idea principal.',
          feedback_error: 'No es la idea principal, pero tampoco es accesoria. Fíjate en cómo explica el fenómeno.'
        },
        {
          id: 2612,
          enunciado: `¿Cuál es la función del último segmento ("los especialistas recomiendan establecer un 'toque de queda digital'")?`,
          alternativas: {
            A: 'Presentar una consecuencia o aplicación práctica derivada de la tesis.',
            B: 'Cuestionar la idea principal expuesta al inicio.',
            C: 'Dar un nuevo ejemplo de un dispositivo electrónico.',
            D: 'Resumir el estudio de los e-readers.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Se presenta como una solución o recomendación basada en lo expuesto.',
          feedback_error: 'Fíjate en el conector "Por consiguiente" y el verbo "recomiendan".'
        },
        {
          id: 2613,
          enunciado: '¿Qué información podría omitirse del texto sin que este pierda su sentido argumentativo principal?',
          alternativas: {
            A: 'Que las pantallas afectan negativamente el sueño.',
            B: 'Que la luz azul inhibe la melatonina.',
            C: 'La recomendación del toque de queda digital.',
            D: 'La mención específica de "teléfonos móviles, tabletas y computadoras".'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Muy bien! Esa es información accesoria de enumeración, la idea sigue clara sin detallar cada aparato.',
          feedback_error: 'Busca el detalle más minucioso que solo sirve para ejemplificar y no afecta el argumento central.'
        }
      ]
    }
  },
  {
    id: 'sec-2-6-nar',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 13,
    order: 13,
    tags: [
      'subcapitulo:Textos Narrativos'
    ],
    title: 'Jerarquía de Eventos · Narrativos',
    introduccion: 'En narrativa, jerarquizar implica separar los eventos clave (núcleos) que hacen avanzar la trama, de los eventos accesorios (catálisis) que solo sirven para describir, ambientar o retrasar la acción.',
    datos_claves: [
      'Eventos principales (Núcleos): Acciones fundamentales sin las cuales la historia no tiene sentido ni avanza.',
      'Eventos accesorios (Catálisis): Descripciones, pensamientos o acciones secundarias que enriquecen el relato.',
      'Al resumir un cuento, debes enfocarte únicamente en los eventos principales.'
    ],
    test: {
      id: 'test-2-6-nar',
      seccionId: 'sec-2-6-nar',
      contexto_base: 'Lucía abrió la vieja puerta de roble, que chirrió pesadamente, levantando una nube de polvo iluminada por el sol de la tarde. En la pared del fondo, colgaban los tres retratos descoloridos de sus ancestros. Sin embargo, no prestó atención a nada de eso; sus ojos se fijaron de inmediato en la pequeña caja fuerte incrustada bajo el escritorio. Sabía que allí dentro encontraría, por fin, el testamento que probaría la traición de su hermano. Caminó con paso firme, ignorando el crujido de las tablas del suelo, e introdujo la combinación que había memorizado.',
      preguntas: [
        {
          id: 262,
          enunciado: '¿Cuál de los siguientes es un evento accesorio en el relato?',
          alternativas: {
            A: 'Lucía entró a la habitación abriendo la puerta.',
            B: 'La puerta levantó una nube de polvo iluminada por el sol.',
            C: 'Lucía se enfocó en la caja fuerte.',
            D: 'Lucía introdujo la combinación de la caja.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Es una catálisis de ambientación, no afecta a la trama principal.',
          feedback_error: 'Busca la acción que solo describe el entorno y no hace avanzar la historia.'
        },
        {
          id: 263,
          enunciado: '¿Cuál es la acción nuclear (núcleo) más importante de este fragmento?',
          alternativas: {
            A: 'Ignorar los retratos descoloridos.',
            B: 'Recordar el testamento.',
            C: 'Caminar con paso firme.',
            D: 'Introducir la combinación de la caja fuerte.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Perfecto! Es la acción final que permite que la trama avance (abrir la caja).',
          feedback_error: 'Identifica la acción física sin la cual la historia no podría continuar.'
        },
        {
          id: 2631,
          enunciado: '¿Qué función cumple la descripción de los "tres retratos descoloridos de sus ancestros"?',
          alternativas: {
            A: 'Es el evento principal que desencadena la traición del hermano.',
            B: 'Es una acción nuclear para abrir la caja fuerte.',
            C: 'Es una catálisis (accesorio) que aporta contexto y atmósfera de antigüedad.',
            D: 'Es la resolución del conflicto familiar.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Muy bien! Aporta ambientación sin afectar la acción.',
          feedback_error: 'Considera si mirar los retratos cambia en algo lo que Lucía va a hacer.'
        },
        {
          id: 2632,
          enunciado: '¿Cuál es el motor o motivación fundamental que impulsa las acciones de Lucía en este relato?',
          alternativas: {
            A: 'Limpiar la habitación polvorienta.',
            B: 'Comprobar la traición de su hermano mediante el testamento.',
            C: 'Robar las joyas familiares de la caja fuerte.',
            D: 'Admirar los retratos de sus antepasados.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Esa es la razón narrativa que justifica todo el fragmento.',
          feedback_error: 'Relee la oración que menciona el testamento.'
        },
        {
          id: 2633,
          enunciado: 'Si tuvieras que resumir la acción omitiendo todo evento accesorio, ¿qué secuencia es la correcta?',
          alternativas: {
            A: 'Lucía abre la puerta -> el sol ilumina el polvo -> ella ignora los retratos.',
            B: 'Lucía escucha chirriar la puerta -> camina con paso firme -> el suelo cruje.',
            C: 'Lucía abre la puerta -> va hacia la caja fuerte -> introduce la combinación.',
            D: 'Lucía busca un testamento -> ignora el suelo que cruje -> mira los retratos.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Has abstraído perfectamente los tres núcleos de acción puros.',
          feedback_error: 'Asegúrate de eliminar todas las descripciones de polvo, retratos y crujidos.'
        }
      ]
    }
  },
  {
    id: 'sec-2-prac-4',
    title: 'Tesis vs Detalles: IA',
    introduccion: 'Práctica rápida de jerarquía de ideas sobre la Inteligencia Artificial.',
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      title: 'Clasifica las Ideas',
      description: 'Basado en un texto hipotético sobre la Inteligencia Artificial, clasifica si la frase es la Tesis Central o un Detalle Accesorio.',
      categories: [
        { id: 'tesis', label: 'Idea Principal (Tesis)' },
        { id: 'detalle', label: 'Idea Accesoria (Detalle)' }
      ],
      items: [
        { id: 1, text: 'La inteligencia artificial ha revolucionado múltiples sectores.', category: 'tesis', hint: 'Es la afirmación global.' },
        { id: 2, text: 'La automatización transformará el mercado laboral en la próxima década.', category: 'tesis', hint: 'Es una proyección amplia y central.' },
        { id: 3, text: 'El desarrollo de redes neuronales simula el aprendizaje del cerebro humano.', category: 'tesis', hint: 'Define el concepto fundamental subyacente.' },
        { id: 4, text: 'La IA debe ser regulada para garantizar la seguridad de los usuarios.', category: 'tesis', hint: 'Plantea una postura general sobre el tema.' },
        { id: 5, text: 'Algoritmos como Watson ayudan a diagnosticar enfermedades.', category: 'detalle', hint: 'Es un ejemplo específico.' },
        { id: 6, text: 'Los drones monitorean los cultivos en la agricultura.', category: 'detalle', hint: 'Es otro ejemplo específico.' },
        { id: 7, text: 'Un asistente virtual puede programar reuniones por voz.', category: 'detalle', hint: 'Menciona un caso de uso particular.' },
        { id: 8, text: 'El año pasado, una IA logró superar a campeones humanos en ajedrez.', category: 'detalle', hint: 'Es un dato o antecedente puntual.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-4',
      seccionId: 'sec-2-prac-4',
      contexto_base: null,
      preguntas: []
    },
    level: 14,
    order: 14,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-prac-4-2',
    title: 'Tesis vs Detalles: Cambio Climático',
    introduccion: 'Segunda práctica rápida sobre la jerarquía de las ideas.',
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      title: 'Clasifica las Ideas',
      description: 'Basado en un texto hipotético sobre el Cambio Climático, clasifica si la frase es la Tesis Central o un Detalle Accesorio.',
      categories: [
        { id: 'tesis', label: 'Idea Principal (Tesis)' },
        { id: 'detalle', label: 'Idea Accesoria (Detalle)' }
      ],
      items: [
        { id: 1, text: 'El calentamiento global requiere acciones internacionales inmediatas.', category: 'tesis', hint: 'Es la postura principal del texto.' },
        { id: 2, text: 'La transición a energías renovables es vital para reducir emisiones.', category: 'tesis', hint: 'Es un pilar central del argumento.' },
        { id: 3, text: 'Los océanos están absorbiendo cantidades críticas de carbono.', category: 'detalle', hint: 'Es un dato específico citado como evidencia del problema, no la idea central.' },
        { id: 4, text: 'Es fundamental cambiar nuestros patrones de consumo diarios.', category: 'tesis', hint: 'Es un llamado general a la acción.' },
        { id: 5, text: 'Groenlandia perdió 279 mil millones de toneladas de hielo en 2019.', category: 'detalle', hint: 'Dato estadístico específico.' },
        { id: 6, text: 'Ciertas especies de corales en Australia sufren blanqueamiento.', category: 'detalle', hint: 'Es un caso puntual de las consecuencias.' },
        { id: 7, text: 'Una nueva planta solar en Marruecos abastece a miles de familias.', category: 'detalle', hint: 'Ejemplo particular de energía renovable.' },
        { id: 8, text: 'En la cumbre COP26, 100 países prometieron detener la deforestación.', category: 'detalle', hint: 'Hecho o evento anecdótico.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-4-2',
      seccionId: 'sec-2-prac-4-2',
      contexto_base: null,
      preguntas: []
    },
    level: 14,
    order: 14.1,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-prac-4-3',
    title: 'Tesis vs Detalles: Salud Mental y Redes',
    introduccion: 'Tercera práctica rápida sobre la jerarquía de ideas.',
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      title: 'Clasifica las Ideas',
      description: 'Basado en un texto sobre Redes Sociales y Salud Mental, clasifica si la frase es la Tesis Central o un Detalle Accesorio.',
      categories: [
        { id: 'tesis', label: 'Idea Principal (Tesis)' },
        { id: 'detalle', label: 'Idea Accesoria (Detalle)' }
      ],
      items: [
        { id: 1, text: 'El uso excesivo de redes sociales fomenta la ansiedad en los jóvenes.', category: 'tesis', hint: 'Es la idea central a demostrar.' },
        { id: 2, text: 'Las plataformas digitales están diseñadas para crear dependencia.', category: 'tesis', hint: 'Es un argumento principal.' },
        { id: 3, text: 'Fomentar la educación digital es crucial para el bienestar psicológico.', category: 'tesis', hint: 'Postura global sobre la solución.' },
        { id: 4, text: 'La comparación constante en línea distorsiona la autoimagen.', category: 'tesis', hint: 'Es un fenómeno central que se busca explicar.' },
        { id: 5, text: 'Un estudio de 2021 mostró que los likes activan la dopamina.', category: 'detalle', hint: 'Cita de un estudio particular.' },
        { id: 6, text: 'Un adolescente promedio pasa más de 3 horas al día en TikTok.', category: 'detalle', hint: 'Dato estadístico específico.' },
        { id: 7, text: 'Instagram implementó la opción de ocultar el número de me gusta.', category: 'detalle', hint: 'Acción puntual de una empresa.' },
        { id: 8, text: 'La Asociación Americana de Psicología emitió nuevas pautas al respecto.', category: 'detalle', hint: 'Mención de un evento específico.' }
      ]
    },
    test: {
      id: 'test-sec-2-prac-4-3',
      seccionId: 'sec-2-prac-4-3',
      contexto_base: null,
      preguntas: []
    },
    level: 14,
    order: 14.2,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-protip-4',
    title: '¿Para qué sirve esto?',
    introduccion: 'Cuando la prueba pregunta \'¿Con qué propósito el autor menciona X?\', te están evaluando la <b>función</b> de un elemento textual. Los autores no ponen palabras al azar; todo tiene una intención.',
    datos_claves: [
      'Las <b>citas de expertos</b> suelen usarse para dar autoridad o respaldo a una afirmación.',
      'Los <b>ejemplos</b> sirven para clarificar o ilustrar un concepto complejo.',
      'Las <b>preguntas retóricas</b> buscan hacer reflexionar al lector o introducir un tema.'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-4',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-4'
    },
    level: 15,
    order: 15,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-7-inf',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 16,
    order: 16,
    tags: [
      'subcapitulo:Textos Informativos'
    ],
    title: 'Función de Citas y Ejemplos · Informativos',
    introduccion: 'Interpretar implica reconocer POR QUÉ el autor incluye un elemento textual específico. Las citas, ejemplos, cifras o analogías siempre tienen un propósito.',
    datos_claves: [
      'Ejemplos: Sirven para aclarar, concretar o ilustrar una idea abstracta o general.',
      'Citas de expertos: Se usan como argumento de autoridad para dar respaldo y credibilidad a una tesis.',
      'Preguntas frecuentes: ¿Con qué propósito se menciona a X en el párrafo 3? ¿Para qué el autor cita a Y?'
    ],
    test: {
      id: 'test-2-7-inf',
      seccionId: 'sec-2-7-inf',
      contexto_base: 'El trabajo remoto ha demostrado aumentar la productividad en ciertos sectores, pero también genera problemas de desconexión emocional. La Dra. Laura Méndez, socióloga organizacional de la Universidad de Oxford, afirma: \'Cuando perdemos los espacios intersticiales, como la charla casual en el pasillo o el café compartido, perdemos el tejido invisible que sostiene la innovación colaborativa\'. Así, lo que ganamos en eficiencia individual, muchas veces lo sacrificamos en creatividad colectiva.',
      preguntas: [
        {
          id: 264,
          enunciado: '¿Con qué propósito el autor cita a la Dra. Laura Méndez?',
          alternativas: {
            A: 'Para ejemplificar que el trabajo remoto aumenta la productividad.',
            B: 'Para respaldar con una opinión experta (autoridad) la idea de que el trabajo remoto genera problemas de desconexión emocional y afecta la creatividad.',
            C: 'Para demostrar que las universidades están en contra del trabajo remoto.',
            D: 'Para definir qué son los espacios intersticiales en la arquitectura de oficinas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! La cita actúa como un argumento de autoridad. La experta de Oxford avala la tesis del autor sobre la pérdida del tejido social y la creatividad.',
          feedback_error: 'Fíjate en quién es la Dra. Méndez (socióloga organizacional de Oxford). ¿Para qué suele un autor citar a un experto de una universidad prestigiosa?'
        },
        {
          id: 265,
          enunciado: '¿Qué función cumple la mención de \'la charla casual en el pasillo o el café compartido\'?',
          alternativas: {
            A: 'Describir las únicas actividades que se realizaban en las oficinas antiguas.',
            B: 'Ejemplificar de manera concreta a qué se refiere el concepto abstracto de \'espacios intersticiales\'.',
            C: 'Argumentar que los empleados pierden demasiado tiempo tomando café.',
            D: 'Proponer una solución para los problemas del trabajo remoto.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Son ejemplos concretos que ilustran un concepto más académico y abstracto (\'espacios intersticiales\'), haciéndolo comprensible.',
          feedback_error: 'Estos son ejemplos cotidianos puestos inmediatamente después del concepto \'espacios intersticiales\'. ¿Qué hacen los ejemplos frente a un concepto complejo?'
        }
      ,
        {
          id: 2651,
          enunciado: '¿Qué función cumple el conector \'Así\' al inicio de la última oración?',
          alternativas: {
            A: 'Ejemplificar la idea anterior sobre las universidades.',
            B: 'Introducir una conclusión o síntesis derivada de la cita de la experta.',
            C: 'Contradecir lo planteado por la Dra. Méndez.',
            D: 'Explicar por qué la eficiencia individual es más importante que la creatividad.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! \'Así\' funciona como un conector conclusivo que resume el impacto de perder esos espacios (ganamos eficiencia, perdemos creatividad).',
          feedback_error: 'Los conectores como \'Así\' o \'Por lo tanto\' suelen introducir la conclusión o síntesis del argumento previo.'
        },
        {
          id: 2652,
          enunciado: '¿Cuál es el propósito central del texto al contrastar la \'eficiencia individual\' con la \'creatividad colectiva\'?',
          alternativas: {
            A: 'Demostrar que el trabajo remoto es un fracaso absoluto.',
            B: 'Exponer el dilema principal del trabajo remoto: sus beneficios aislados versus su costo en la innovación grupal.',
            C: 'Proponer que la gente debe volver a las oficinas a tomar café.',
            D: 'Criticar a la Dra. Méndez por preferir las charlas de pasillo.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El autor usa el contraste para plantear el matiz y el problema central del modelo de trabajo a distancia.',
          feedback_error: 'El texto no dice que sea un fracaso total, reconoce su \'eficiencia individual\'. Busca equilibrar esa ganancia con una pérdida. ¿Cuál es esa pérdida?'
        },
        {
          id: 2653,
          enunciado: 'En la cita de la experta, ¿qué función cumple la frase \'tejido invisible\'?',
          alternativas: {
            A: 'Nombrar literalmente el material de las oficinas modernas.',
            B: 'Usar una metáfora para referirse a la red de relaciones, confianza y colaboración entre los empleados.',
            C: 'Demostrar que los trabajadores a distancia no se ven entre sí.',
            D: 'Justificar el gasto en infraestructura física de las empresas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Las redes de colaboración humana no son físicas, por lo que la experta usa \'tejido invisible\' para graficarlas.',
          feedback_error: 'La experta usa una figura retórica (metáfora). No habla de telas reales. Piensa en qué es lo que \'sostiene la innovación\'.'
        }]
    }
  },
  {
    id: 'sec-2-7-nar',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 16,
    order: 16,
    tags: [
      'subcapitulo:Textos Narrativos'
    ],
    title: 'Función de Figuras Retóricas · Narrativos',
    introduccion: 'En literatura, las palabras tienen un sentido connotativo (simbólico, figurado). Reconocer la función de metáforas, comparaciones y personificaciones es clave para interpretar el significado profundo del texto.',
    datos_claves: [
      'Metáfora: Traslada el significado de un concepto a otro para destacar una cualidad oculta (ej. \'el invierno de su vida\').',
      'Comparación: Establece un símil explícito usando nexos (como, cual, parece).',
      'Personificación: Atribuir cualidades humanas a objetos o elementos de la naturaleza para enfatizar una atmósfera.'
    ],
    test: {
      id: 'test-2-7-nar',
      seccionId: 'sec-2-7-nar',
      contexto_base: 'La ciudad devoraba a sus habitantes con una lentitud meticulosa. Sus calles, como venas endurecidas, palpitaban de asfalto y humo, mientras los rascacielos vigilaban la miseria desde las alturas con sus cientos de ojos de cristal ciegos.',
      preguntas: [
        {
          id: 266,
          enunciado: '¿Qué función cumple la expresión \'La ciudad devoraba a sus habitantes\'?',
          alternativas: {
            A: 'Indicar literalmente que existía canibalismo en esa urbe.',
            B: 'Personificar a la ciudad como un ente destructivo y hostil que consume la energía o la vida de las personas.',
            C: 'Señalar que en la ciudad había muchos lugares para comer.',
            D: 'Demostrar que la ciudad estaba creciendo geográficamente de manera muy rápida.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Es una metáfora/personificación que otorga a la ciudad características de un monstruo u opresor, creando una atmósfera opresiva.',
          feedback_error: 'Recuerda que en literatura se usa un lenguaje figurado (connotativo). Una ciudad no puede devorar literalmente. ¿Qué sensación transmite esa imagen?'
        },
        {
          id: 267,
          enunciado: '¿Con qué propósito se compara a las calles con \'venas endurecidas\'?',
          alternativas: {
            A: 'Para explicar el sistema de alcantarillado.',
            B: 'Para sugerir que la ciudad es un organismo vivo, pero enfermo, viejo o carente de fluidez vital.',
            C: 'Para indicar que las calles estaban pavimentadas con asfalto rojo.',
            D: 'Para mostrar la buena conectividad vial del lugar.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Al usar \'venas\', refuerza la metáfora de la ciudad como un cuerpo, y al decir \'endurecidas\', sugiere falta de vida, enfermedad o frialdad.',
          feedback_error: 'Una vena sana es flexible y transporta vida. Una vena \'endurecida\' sugiere lo contrario. ¿Qué nos dice eso sobre la ciudad entendida como un organismo?'
        }
      ,
        {
          id: 2671,
          enunciado: '¿Qué función cumple la descripción de los rascacielos con \'cientos de ojos de cristal ciegos\'?',
          alternativas: {
            A: 'Mencionar que se habían roto las ventanas de los edificios.',
            B: 'Reforzar la idea de que la ciudad es indiferente e insensible frente al sufrimiento (miseria) de sus habitantes.',
            C: 'Mostrar que la ciudad era muy luminosa y moderna.',
            D: 'Explicar por qué había tanto asfalto y humo en las calles.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Al decir que son \'ciegos\' ante la \'miseria\', personifica la frialdad e indiferencia del entorno urbano.',
          feedback_error: 'La figura de los \'ojos ciegos\' está vigilando la \'miseria\'. ¿Qué actitud humana está representando esta personificación?'
        },
        {
          id: 2672,
          enunciado: '¿Con qué propósito el narrador menciona que la ciudad \'palpitaba de asfalto y humo\'?',
          alternativas: {
            A: 'Para contrastar un verbo que sugiere vida (palpitar) con elementos artificiales o tóxicos, creando un ambiente enfermizo.',
            B: 'Para describir el sistema de transporte público de manera precisa.',
            C: 'Para demostrar que en esa ciudad hacía mucho calor debido al asfalto.',
            D: 'Para convencer al lector de no mudarse a las grandes urbes.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Combinar algo vital (palpitar) con humo y asfalto genera una imagen poética de algo vivo pero artificial o tóxico.',
          feedback_error: 'Nota la ironía: \'palpitar\' es algo orgánico (del corazón), pero se hace con \'asfalto y humo\' (industrial, inerte). ¿Qué genera esa mezcla?'
        },
        {
          id: 2673,
          enunciado: 'Considerando todo el párrafo, ¿cuál es el propósito general de usar tantas figuras de personificación?',
          alternativas: {
            A: 'Explicar cómo funciona el urbanismo moderno.',
            B: 'Otorgarle a la ciudad el rol de un antagonista vivo, activo y amenazante.',
            C: 'Simplemente adornar el texto para que suene más difícil de leer.',
            D: 'Dar a entender que los verdaderos habitantes eran los edificios, no las personas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! Al devorar, tener venas y vigilar con ojos, la ciudad deja de ser un escenario pasivo y se convierte en un \\\'monstruo\\\' que afecta a los personajes.',
          feedback_error: 'Si la ciudad devora, palpita y vigila... ¿cómo la está posicionando el autor respecto a los seres humanos que viven en ella?'
        }]
    }
  },
  {
    id: 'sec-2-prac-5',
    title: 'Analizando el Propósito',
    introduccion: 'Práctica rápida sobre la función de citas y ejemplos.',
    isPractice: true,
    test: {
      id: 'test-2-prac-5',
      contexto_base: 'TEXTO 1\nEl sueño es fundamental para el aprendizaje. Según el Dr. Walker, profesor de neurociencia en UC Berkeley, \'dormir antes de aprender prepara el cerebro para crear nuevas memorias, como si fuera una esponja seca\'.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa industria del fast fashion es responsable del 10% de las emisiones globales de carbono. Por ejemplo, confeccionar unos simples jeans requiere unos 7500 litros de agua, el equivalente a lo que bebe una persona promedio en siete años.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nLa inteligencia artificial avanza a pasos agigantados. Sin embargo, no debemos confiar ciegamente en sus respuestas, ya que modelos como ChatGPT a menudo sufren de \'alucinaciones\', es decir, inventan datos o citas inexistentes con total seguridad.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nEl viento aullaba entre las ruinas del castillo. Las sombras se alargaban como garras sobre las piedras húmedas, y la niebla se arrastraba, envolviendo el paisaje en un manto de secreto insondable.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nMuchas empresas afirman ser ecológicas, pero sus prácticas demuestran lo contrario. El \'greenwashing\' es una estrategia publicitaria engañosa. Greenpeace advierte que "poner una hoja verde en el logo no borra los vertidos tóxicos en los ríos del sur global".\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 6\nLa meditación no es poner la mente en blanco. Es, más bien, observar los pensamientos pasar como nubes en el cielo, sin aferrarse a ninguno ni juzgarlos.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 7\nEn 1969, la misión Apolo 11 logró lo impensable. Neil Armstrong pisó la luna. Así, Estados Unidos ganó simbólicamente la carrera espacial frente a la Unión Soviética, consolidando su hegemonía tecnológica en plena Guerra Fría.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 8\nEl protagonista miró el reloj por décima vez. Sus manos sudaban y su corazón latía al ritmo descontrolado de un tambor de guerra. "Solo cinco minutos más", pensó, apretando los dientes.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 9\nLas dietas extremas prometen resultados rápidos, pero suelen fracasar a largo plazo. Al restringir severamente las calorías, el metabolismo se ralentiza. Por consiguiente, cuando la persona vuelve a comer normal, recupera el peso perdido e incluso más (el efecto rebote).\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 10\nLa lectura en papel ofrece ventajas sobre las pantallas. Al leer un libro físico, el grosor de las páginas leídas a la izquierda y las por leer a la derecha proporcionan una brújula táctil que ayuda al cerebro a mapear y retener la historia.\n',
      preguntas: [
        {
          id: 200501,
          texto_index: 0,
          enunciado: '¿Con qué propósito el autor incluye la cita del Dr. Walker (TEXTO 1)?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Para explicar cómo funcionan las esponjas marinas.',
            B: 'Para criticar los métodos de enseñanza en la universidad.',
            C: 'Para respaldar con una fuente de autoridad la idea de que el sueño es vital para aprender.',
            D: 'Para demostrar que las universidades investigan sobre el cerebro.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: 'Exacto. Es un argumento de autoridad clásico para darle credibilidad a la tesis del autor.',
          feedback_error: 'Recuerda que las citas de expertos (Dr., Profesor, Universidad) suelen cumplir la función de respaldar o dar autoridad.'
        },
        {
          id: 200502,
          texto_index: 1,
          enunciado: '¿Qué función cumple la mención de los \'7500 litros de agua\' en el TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Demostrar que el ser humano debería beber más agua.',
            B: 'Ejemplificar de manera concreta y cuantificable el enorme impacto ambiental del fast fashion.',
            C: 'Describir el proceso de fabricación de unos jeans.',
            D: 'Argumentar en contra del uso de jeans en la moda moderna.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El dato específico sirve como ejemplo para ilustrar y dimensionar el problema general de las emisiones y el consumo.',
          feedback_error: 'Fíjate en las palabras clave: "Por ejemplo, confeccionar unos simples jeans...". ¿Para qué se da este ejemplo?'
        },
        {
          id: 200503,
          texto_index: 2,
          enunciado: 'En el TEXTO 3, ¿con qué fin el autor utiliza la expresión \'alucinaciones\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Para advertir que las inteligencias artificiales pueden consumir drogas.',
            B: 'Para nombrar de forma figurada el fenómeno en el que la IA inventa información errónea.',
            C: 'Para afirmar que ChatGPT es una aplicación médica.',
            D: 'Para alabar la creatividad y la imaginación literaria de la Inteligencia Artificial.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Se apropia de un término humano (alucinación) para explicar figuradamente cuando la IA crea datos falsos creyéndolos reales.',
          feedback_error: 'Lee la explicación que sigue a la palabra: "es decir, inventan datos o citas inexistentes".'
        },
        {
          id: 200504,
          texto_index: 3,
          enunciado: 'En el TEXTO 4, ¿cuál es el propósito de describir las sombras \'como garras\' y la niebla como un \'manto de secreto\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Crear una atmósfera de misterio, amenaza y suspenso en la narración.',
            B: 'Describir objetivamente el clima en una zona montañosa.',
            C: 'Personificar al viento como un animal salvaje.',
            D: 'Explicar por qué los castillos antiguos están en ruinas.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Las figuras retóricas en los textos narrativos suelen usarse para construir la atmósfera y el tono emocional de la escena.',
          feedback_error: 'Recuerda que en un texto narrativo, los símiles y metáforas buscan generar un efecto o sensación en el lector, no dar reportes meteorológicos.'
        },
        {
          id: 200505,
          texto_index: 4,
          enunciado: 'En el TEXTO 5, ¿qué función cumple la cita de Greenpeace?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ejemplificar cómo se diseña un buen logotipo ecológico.',
            B: 'Promover las donaciones a organizaciones no gubernamentales.',
            C: 'Dar una opinión contraria para equilibrar el texto.',
            D: 'Reforzar la crítica al \'greenwashing\' mediante la voz de una organización experta en el tema.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Excelente! Greenpeace es una autoridad en temas medioambientales, por lo que su cita respalda y refuerza la tesis del autor.',
          feedback_error: 'El texto critica el greenwashing. Luego cita a Greenpeace criticando lo mismo. ¿Qué relación hay entre el texto y la cita?'
        },
        {
          id: 200506,
          texto_index: 5,
          enunciado: 'En el TEXTO 6, ¿cuál es el propósito de comparar los pensamientos con \'nubes en el cielo\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indicar que para meditar hay que estar al aire libre.',
            B: 'Ilustrar de manera sencilla la actitud de observador imparcial y desapegado que requiere la meditación.',
            C: 'Demostrar que los pensamientos son de color blanco y borrosos.',
            D: 'Señalar que la meditación es una práctica exclusiva para personas religiosas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! Usa una analogía o símil fácil de entender (nubes pasando) para explicar un estado mental abstracto (desapego).',
          feedback_error: 'Las nubes simplemente pasan, no te puedes aferrar a ellas. Esa es la actitud que el autor recomienda tener con los pensamientos.'
        },
        {
          id: 200507,
          texto_index: 6,
          enunciado: 'En el TEXTO 7, ¿qué función cumple el conector \'Así\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Introducir una consecuencia política e histórica derivada de la llegada a la luna.',
            B: 'Añadir un ejemplo de las misiones espaciales.',
            C: 'Contradecir la importancia del Apolo 11.',
            D: 'Concluir que la Unión Soviética tenía mejor tecnología.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! \'Así\' funciona como conector de consecuencia: dado que llegaron a la luna (causa), ganaron la carrera espacial (efecto).',
          feedback_error: 'El texto menciona un hecho (pisar la luna) y luego, a través del \'Así\', muestra lo que ese hecho provocó o significó a nivel global.'
        },
        {
          id: 200508,
          texto_index: 7,
          enunciado: 'En el TEXTO 8, ¿cuál es el propósito de usar la expresión \'ritmo descontrolado de un tambor de guerra\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indicar que el personaje es un músico percusionista.',
            B: 'Demostrar que la historia ocurre durante un conflicto bélico.',
            C: 'Acentuar la sensación de ansiedad, tensión y nerviosismo extremo del personaje.',
            D: 'Explicar los problemas cardíacos que sufre el protagonista.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Es una metáfora que sirve para intensificar la descripción emocional y física del nerviosismo.',
          feedback_error: 'Es lenguaje literario, no literal. Los tambores de guerra son intensos, fuertes y anticipan un choque. ¿Qué emoción refleja eso en un personaje que suda y mira el reloj?'
        },
        {
          id: 200509,
          texto_index: 8,
          enunciado: 'En el TEXTO 9, ¿qué función cumple el conector \'Por consiguiente\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Oponerse a la idea de que el metabolismo se ralentiza.',
            B: 'Introducir el efecto o resultado lógico (el rebote) de la ralentización del metabolismo.',
            C: 'Agregar información irrelevante sobre las dietas.',
            D: 'Citar la opinión de un nutricionista.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! \'Por consiguiente\' es un conector de consecuencia. Conecta una causa (metabolismo lento) con su efecto (recuperar peso).',
          feedback_error: 'Este conector significa "como consecuencia de lo anterior". Fíjate qué es lo que pasa debido a que el metabolismo se ralentizó.'
        },
        {
          id: 200510,
          texto_index: 9,
          enunciado: 'En el TEXTO 10, ¿con qué propósito el autor usa la metáfora de la \'brújula táctil\'?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Para enseñar a los lectores cómo ubicarse usando el norte magnético.',
            B: 'Para criticar a los lectores que se pierden fácilmente en las historias.',
            C: 'Para graficar cómo el formato físico ayuda al cerebro a orientarse espacialmente dentro del libro.',
            D: 'Para sugerir que los libros de papel son más pesados que los digitales.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Una brújula sirve para orientarse. El autor usa esta imagen para explicar cómo el tacto ayuda a la orientación y memoria en la lectura física.',
          feedback_error: 'Una brújula sirve para saber dónde estás. En el contexto de leer un libro físico, ¿qué es lo que te ayuda a saber dónde estás dentro de la historia?'
        }
      ],
      seccionId: 'sec-2-prac-5'
    },
    level: 17,
    order: 17,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-8-join',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    level: 18,
    order: 18,
    tags: [
      'subcapitulo:Práctica Mixta'
    ],
    title: '🧩 Práctica: Jerarquía y Funciones',
    isPractice: true,
    introduccion: '¡Pon a prueba tu capacidad de jerarquizar información y reconocer funciones retóricas en un mismo texto mixto!',
    datos_claves: [
      'Aplica todo lo aprendido: diferencia lo principal de lo secundario.',
      'Analiza POR QUÉ el autor usó ciertas palabras figuradas.',
      'Recuerda: la función siempre depende del sentido del texto completo.'
    ],
    test: {
      id: 'test-2-8-join',
      seccionId: 'sec-2-8-join',
      contexto_base: 'TEXTO 1\nLa memoria humana no es un disco duro, sino un archivero desordenado que un empleado perezoso reescribe cada vez que abrimos un cajón. Numerosos estudios cognitivos han demostrado el fenómeno de la "reconsolidación": cada vez que recordamos un evento, el cerebro vuelve a grabarlo, y en ese proceso, es susceptible a cambios. Por ejemplo, en el célebre experimento de Elizabeth Loftus sobre testigos oculares, el simple hecho de cambiar la palabra \'golpear\' por \'estrellar\' en una pregunta, alteró drásticamente el recuerdo de la velocidad de los vehículos. Así, nuestra identidad, sostenida sobre esos recuerdos, es más un cuento en constante edición que una fotografía fiel.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa crisis global de la vivienda no se resolverá construyendo más casas. A primera vista, parece un problema de oferta y demanda matemática básica; sin embargo, en ciudades como Londres, París y Vancouver, el problema real es la "financiarización" de la vivienda. Este fenómeno ocurre cuando los inmuebles dejan de ser lugares para vivir y se convierten en vehículos de inversión globales. Según un informe de la ONU, enormes fondos de capital compran bloques enteros de departamentos solo para mantenerlos vacíos y especular con su valor. Por lo tanto, el mercado no está diseñado para albergar a ciudadanos, sino para proteger el capital de inversionistas extranjeros, convirtiendo a los barrios en zonas fantasmas donde los trabajadores locales no pueden costear una habitación.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nEl auge del true crime (crimen real) en plataformas de streaming revela mucho más sobre nuestra psicología colectiva que sobre los crímenes en sí. Aunque muchos espectadores afirman ver estos documentales para "aprender a protegerse", los sociólogos argumentan que el atractivo principal es la "catarsis segura". Consumir atrocidades reales desde la comodidad del sofá permite a las personas experimentar miedo intenso sin peligro real. A modo de ilustración, el abrumador éxito de la serie sobre Jeffrey Dahmer en Netflix no se debió a un interés forense, sino a la fascinación morbosa por la desviación de la norma social. En última instancia, esta obsesión mediática mercantiliza el dolor de las víctimas reales, transformando la tragedia humana en puro entretenimiento vespertino.\n',
      preguntas: [
        {
          id: 268,
          texto_index: 0,
          enunciado: '¿Cuál es la información de mayor jerarquía (idea principal) del TEXTO 1?',
          alternativas: {
            A: 'El cerebro vuelve a grabar los eventos y es susceptible a cambios.',
            B: 'La memoria humana no funciona como un disco duro de computadora.',
            C: 'La memoria humana es reconstructiva y maleable, por lo que nuestros recuerdos y nuestra identidad están en constante alteración.',
            D: 'El experimento de Elizabeth Loftus demostró que los testigos cambian de opinión.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Brillante! La opción C sintetiza tanto la maleabilidad de la memoria (tesis inicial) como su consecuencia en la identidad (conclusión final).',
          feedback_error: 'Busca la opción que una la tesis inicial (la memoria se reescribe) con la conclusión final (nuestra identidad es un cuento en edición). Las demás son incompletas.'
        },
        {
          id: 269,
          texto_index: 0,
          enunciado: '¿Qué función cumple la mención del experimento de Elizabeth Loftus?',
          alternativas: {
            A: 'Constituye la idea central del texto.',
            B: 'Actúa como un ejemplo concreto que ilustra y comprueba la tesis sobre cómo la memoria cambia al ser recordada.',
            C: 'Tiene el propósito de criticar la fiabilidad de los juicios penales.',
            D: 'Sirve para explicar la diferencia entre \'golpear\' y \'estrellar\'.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Está introducido explícitamente con \'Por ejemplo\', y su función es aportar evidencia empírica a la afirmación abstracta anterior sobre la reconsolidación.',
          feedback_error: 'Observa las palabras que preceden al experimento: \'Por ejemplo...\'. ¿Qué función indica ese conector?'
        },
        {
          id: 270,
          texto_index: 0,
          enunciado: '¿Con qué propósito el emisor usa la expresión \'un archivero desordenado que un empleado perezoso reescribe\'?',
          alternativas: {
            A: 'Para criticar la pereza intelectual de las personas.',
            B: 'Para establecer una metáfora que haga comprensible y gráfica la forma inexacta y reconstructiva en que funciona la memoria.',
            C: 'Para defender el trabajo de los oficinistas y archiveros.',
            D: 'Para comparar la capacidad de memoria del cerebro con un archivo físico de papel.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! Es una figura retórica (metáfora) que ayuda a visualizar un concepto cognitivo complejo de manera cotidiana, enfatizando la falta de precisión del proceso.',
          feedback_error: '¿Por qué un autor científico usaría una imagen tan cotidiana e irreal? Busca la opción que explique cómo una metáfora ayuda a la comprensión.'
        },
        {
          id: 271,
          texto_index: 0,
          enunciado: 'En cuanto a la jerarquía, la oración \'Numerosos estudios cognitivos han demostrado el fenómeno de la reconsolidación\' corresponde a:',
          alternativas: {
            A: 'Una idea principal, porque es el tema del texto.',
            B: 'Un ejemplo específico de un estudio.',
            C: 'Una idea secundaria de soporte que brinda respaldo científico a la tesis de la maleabilidad.',
            D: 'Una conclusión derivada del experimento de Loftus.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Muy bien! Esta frase no es el ejemplo en sí (el ejemplo viene después), sino un argumento de respaldo general para apoyar la tesis central.',
          feedback_error: 'Fíjate que menciona "numerosos estudios" en general para darle fuerza a su afirmación, antes de presentar un ejemplo concreto.'
        },
        {
          id: 272,
          texto_index: 0,
          enunciado: '¿Qué función cumple el conector \'Así\' en la oración final del TEXTO 1?',
          alternativas: {
            A: 'Introducir una objeción al experimento mencionado.',
            B: 'Resumir e introducir la conclusión o reflexión final que se deriva de lo expuesto anteriormente.',
            C: 'Añadir más ejemplos sobre la memoria de los testigos.',
            D: 'Señalar una causa que provoca los errores de la memoria.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! \'Así\' en este contexto es un conector de consecuencia o cierre que da paso a la reflexión que engloba el texto.',
          feedback_error: 'Sustituye \'Así\' por \'Por lo tanto\' o \'En conclusión\'. ¿Mantiene el sentido? Sí, porque introduce una deducción final.'
        },
        {
          id: 273,
          texto_index: 1,
          enunciado: '¿Cuál es la idea de mayor jerarquía (idea principal) del TEXTO 2?',
          alternativas: {
            A: 'Londres, París y Vancouver tienen graves problemas para albergar a sus ciudadanos.',
            B: 'La ONU ha publicado un informe sobre la falta de viviendas.',
            C: 'El problema de la vivienda es matemático: hay poca oferta y mucha demanda.',
            D: 'La crisis de vivienda se debe a la "financiarización", donde las casas son inversiones especulativas y no hogares.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Correcto! El texto refuta que sea oferta/demanda y establece su verdadera tesis: la causa es que las viviendas se tratan como fondos de inversión (financiarización).',
          feedback_error: 'Las ciudades o la ONU son detalles para apoyar el argumento. Busca la idea que el autor quiere que te lleves de fondo.'
        },
        {
          id: 274,
          texto_index: 1,
          enunciado: '¿Qué función cumple la mención al "informe de la ONU" en el TEXTO 2?',
          alternativas: {
            A: 'Criticar las políticas ineficaces de las Naciones Unidas.',
            B: 'Explicar cómo funcionan los fondos de capital extranjero.',
            C: 'Respaldar con una fuente de autoridad internacional la afirmación sobre las compras especulativas masivas.',
            D: 'Demostrar que el problema de la vivienda es un tema político.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Citar a la ONU es un clásico argumento de autoridad que le da peso y credibilidad a los datos del autor.',
          feedback_error: 'Cuando se menciona a una institución importante (ONU, OMS, una universidad), generalmente se busca dar prestigio y veracidad al argumento.'
        },
        {
          id: 275,
          texto_index: 1,
          enunciado: '¿Qué función cumple el conector "sin embargo" en el TEXTO 2?',
          alternativas: {
            A: 'Oponer la creencia aparente (oferta y demanda) a la tesis real del autor (financiarización).',
            B: 'Conectar dos ciudades con problemas similares.',
            C: 'Introducir una consecuencia del problema matemático básico.',
            D: 'Indicar que el autor está de acuerdo con la teoría de oferta y demanda.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! "Sin embargo" marca un contraste: rompe la idea inicial (matemática básica) para revelar la perspectiva crítica del autor.',
          feedback_error: 'Es un conector de contraste u oposición. Fíjate cómo separa "lo que parece a primera vista" de lo que el autor dice que es "el problema real".'
        },
        {
          id: 276,
          texto_index: 1,
          enunciado: 'En la jerarquía del TEXTO 2, la enumeración "Londres, París y Vancouver" corresponde a:',
          alternativas: {
            A: 'La tesis principal del autor.',
            B: 'Una idea secundaria que ejemplifica los lugares específicos donde este fenómeno global es más evidente.',
            C: 'Un contraargumento para invalidar la idea de la "financiarización".',
            D: 'La conclusión del problema de la vivienda.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Son datos específicos, de nivel secundario, usados para aterrizar y ejemplificar un fenómeno mundial.',
          feedback_error: 'Son ejemplos concretos. Los ejemplos siempre ocupan un nivel jerárquico secundario, subordinados a la idea general.'
        },
        {
          id: 277,
          texto_index: 1,
          enunciado: '¿Con qué propósito el emisor concluye afirmando que "el mercado no está diseñado para albergar a ciudadanos"?',
          alternativas: {
            A: 'Para proponer una solución arquitectónica al diseño de las ciudades.',
            B: 'Para sintetizar la tesis y enfatizar la profunda distorsión y el costo social de tratar las casas como capital.',
            C: 'Para atacar a los trabajadores locales que no pueden pagar alquiler.',
            D: 'Para demostrar que los inversionistas extranjeros son ciudadanos honorables.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! Reafirma y sintetiza la idea principal dándole un fuerte cierre reflexivo y crítico sobre el verdadero rol del mercado inmobiliario actual.',
          feedback_error: 'La conclusión reúne todos los argumentos del texto para dar un mensaje final, en este caso, una denuncia sobre la distorsión del mercado.'
        },
        {
          id: 278,
          texto_index: 2,
          enunciado: '¿Cuál es la idea principal del TEXTO 3?',
          alternativas: {
            A: 'La gente ve true crime para aprender a defenderse de los asesinos.',
            B: 'Jeffrey Dahmer fue el criminal más famoso de Netflix.',
            C: 'Las plataformas de streaming mercantilizan el dolor humano y transforman la tragedia en entretenimiento debido a nuestra necesidad de "catarsis segura".',
            D: 'Los crímenes reales son más psicológicos que los crímenes de ficción.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Brillante! Esta opción resume perfectamente tanto la causa psicológica planteada (catarsis segura) como la postura crítica del autor (mercantilización del dolor).',
          feedback_error: 'La opción correcta debe englobar todo: el motivo de la audiencia y la crítica del autor hacia la industria.'
        },
        {
          id: 279,
          texto_index: 2,
          enunciado: '¿Qué función cumple el conector "Aunque" en el TEXTO 3?',
          alternativas: {
            A: 'Señalar una condición para poder ver las series de crímenes.',
            B: 'Conceder parcialmente lo que dice el público (para protegerse), antes de presentar la verdadera explicación (catarsis).',
            C: 'Añadir información a la tesis de los sociólogos.',
            D: 'Indicar que el autor detesta los documentales.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! "Aunque" es un conector concesivo. El autor reconoce una excusa común pero inmediatamente antepone una explicación más profunda.',
          feedback_error: '"Aunque" introduce una idea que se acepta parcialmente pero que no impide lo principal. Aquí opone la excusa de la gente frente a la teoría de los sociólogos.'
        },
        {
          id: 280,
          texto_index: 2,
          enunciado: '¿Con qué propósito se menciona la serie de "Jeffrey Dahmer" en el texto?',
          alternativas: {
            A: 'Para recomendar una buena serie de Netflix a los lectores.',
            B: 'Como un ejemplo concreto que ilustra que el interés del público es la fascinación morbosa y no un afán preventivo o forense.',
            C: 'Para demostrar que Netflix produce las mejores series de crímenes.',
            D: 'Para presentar el tema central del texto.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Es un ejemplo muy claro (idea secundaria) que prueba la tesis de que la audiencia busca el morbo y no el aprendizaje.',
          feedback_error: 'El texto introduce esto explícitamente diciendo "A modo de ilustración...". ¿Para qué sirven las ilustraciones o ejemplos?'
        },
        {
          id: 281,
          texto_index: 2,
          enunciado: 'Jerárquicamente, la afirmación de que el interés es la "catarsis segura" funciona como:',
          alternativas: {
            A: 'Una idea secundaria que aporta la justificación experta (sociólogos) a la tesis de que el true crime revela nuestra psicología.',
            B: 'Un detalle irrelevante que no aporta nada a la lectura.',
            C: 'La conclusión definitiva de todo el texto.',
            D: 'Un contraargumento para defender las series de crímenes.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Exacto! La tesis es que el género revela nuestra psicología, y la explicación de la "catarsis segura" es el argumento (idea secundaria fuerte) que la sustenta.',
          feedback_error: 'No es la conclusión final (esa está al final, sobre la mercantilización), sino un fuerte argumento experto para explicar *por qué* ocurre el fenómeno.'
        },
        {
          id: 282,
          texto_index: 2,
          enunciado: '¿Qué función cumple la expresión "mercantiliza el dolor de las víctimas reales"?',
          alternativas: {
            A: 'Enseñar términos de economía y comercio.',
            B: 'Elogiar la capacidad de generar ganancias a partir de los documentales.',
            C: 'Condensar la postura crítica y de denuncia del autor hacia la industria del entretenimiento en la conclusión del texto.',
            D: 'Sugerir que se debería cobrar menos por las suscripciones de streaming.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Esta fuerte frase resume la visión crítica del autor, mostrando que convertir tragedias en dinero ("mercantilizar") es éticamente cuestionable.',
          feedback_error: 'Mercantilizar significa "convertir algo en mercancía". El autor está criticando cómo el sufrimiento ajeno se convierte en un producto de consumo masivo para las plataformas.'
        }
]
    }
  },
  {
    id: 'sec-2-protip-5',
    title: 'El Tono del Emisor',
    introduccion: 'El tono revela la actitud emocional o intelectual del autor hacia el tema que está tratando. Puede ser irónico, crítico, reflexivo, objetivo, entusiasta, pesimista, etc.',
    datos_claves: [
      'Fíjate en los <b>adjetivos</b> que usa el autor. No es lo mismo decir \'esta política\' que \'esta nefasta política\'.',
      'Identificar el tono te ayuda muchísimo a entender la intención global del texto.'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-5',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-5'
    },
    level: 19,
    order: 19,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-9',
    title: 'Actitud y Tono',
    introduccion: 'Aprenderemos a descifrar la perspectiva subjetiva del autor.',
    guia_titulo: 'Interpretando la Actitud',
    guia_contenido: 'Aunque un texto parezca objetivo, las palabras elegidas (adjetivación) revelan la postura del emisor. Si un autor describe un proyecto como \'ambicioso\', tiene un tono esperanzador; si lo describe como \'desmesurado\', tiene un tono crítico.',
    datos_claves: [
      'Tono Crítico: Enjuicia negativamente.',
      'Tono Irónico: Dice lo contrario de lo que piensa para burlarse.',
      'Tono Objetivo: Ausencia de marcas valorativas (típico en noticias).'
    ],
    tags: [
      'tono',
      'actitud',
      'emisor'
    ],
    test: {
      id: 'test-2-9',
      contexto_base: 'TEXTO 1\nEs francamente \'maravilloso\' ver cómo las autoridades han pavimentado la misma calle tres veces este año, mientras el hospital sigue sin insumos básicos. ¡Qué gran gestión de nuestros recursos!\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa deforestación en la Amazonía ha alcanzado un punto de no retorno. Si no implementamos medidas drásticas e inmediatas para frenar la tala ilegal, las futuras generaciones no conocerán los pulmones del planeta. Estamos caminando ciegamente hacia el abismo ecológico.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nTras analizar las muestras bajo el microscopio electrónico durante 48 horas continuas, se observó que la tasa de mitosis celular disminuyó en un 14,2% en presencia del compuesto X-23. Estos resultados sugieren una correlación preliminar entre el compuesto y la inhibición de la división celular.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nEs verdaderamente un privilegio haber crecido en esta pequeña ciudad. Cada rincón empedrado, cada panadería de la esquina que aún hornea a primera hora, me recuerda una época donde la vida transcurría sin la prisa asfixiante de hoy. Cómo extraño aquellas tardes doradas.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nA pesar de los múltiples contratiempos que hemos enfrentado este semestre, estoy completamente seguro de que este equipo tiene el talento, la resiliencia y la creatividad necesarias para sacar este proyecto adelante y triunfar como nunca antes. ¡El éxito es inminente!\n',
      preguntas: [
        {
          id: 23001,
          texto_index: 0,
          enunciado: '¿Cuál es el tono predominante del emisor en el TEXTO 1?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Elogioso',
            B: 'Objetivo',
            C: 'Irónico',
            D: 'Pesimista'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! El uso de comillas en \'maravilloso\' y el aparente elogio ante un absurdo son marcadores clásicos de ironía o sarcasmo.',
          feedback_error: 'Fíjate en las comillas y en el contraste entre pavimentar una calle 3 veces y la falta de insumos médicos. ¿Realmente lo encuentra maravilloso?'
        },
        {
          id: 23002,
          texto_index: 1,
          enunciado: '¿Cuál es el tono predominante del emisor en el TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Informativo',
            B: 'Alarmista',
            C: 'Nostálgico',
            D: 'Objetivo'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Frases como "punto de no retorno", "medidas drásticas" y "abismo ecológico" evidencian un tono de alerta máxima y urgencia.',
          feedback_error: 'Observa las expresiones utilizadas: "punto de no retorno", "abismo ecológico". No solo informa, sino que intenta asustar o advertir gravemente al lector.'
        },
        {
          id: 23003,
          texto_index: 2,
          enunciado: 'A partir de las marcas textuales, el tono del TEXTO 3 puede clasificarse como:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Subjetivo',
            B: 'Crítico',
            C: 'Objetivo',
            D: 'Inseguro'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Exacto! El autor no emite juicios de valor ni emociones; solo se limita a entregar datos, porcentajes y conclusiones neutras ("se observó", "sugieren").',
          feedback_error: '¿Hay alguna palabra en el texto que revele la opinión personal del autor? Al estar ausentes, el tono se limita a constatar hechos de forma neutral.'
        },
        {
          id: 23004,
          texto_index: 3,
          enunciado: '¿Cuál es el tono predominante del emisor en el TEXTO 4?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Melancólico y nostálgico',
            B: 'Depresivo y pesimista',
            C: 'Alegre y festivo',
            D: 'Irónico y burlesco'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! El uso de expresiones como "época donde la vida transcurría sin la prisa..." y "Cómo extraño aquellas tardes" revelan un profundo sentimiento de añoranza por el pasado.',
          feedback_error: 'Aunque hay cierta tristeza, no llega a ser depresión. El autor valora un pasado hermoso ("tardes doradas") y lamenta su pérdida, lo que define la melancolía/nostalgia.'
        },
        {
          id: 23005,
          texto_index: 4,
          enunciado: 'En el TEXTO 5, la actitud del emisor frente al proyecto se caracteriza por ser:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desafiante',
            B: 'Conformista',
            C: 'Temerosa',
            D: 'Optimista y entusiasta'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Perfecto! Palabras como "completamente seguro", "talento", "triunfar" y "éxito inminente" denotan una energía altísima y una visión sumamente positiva.',
          feedback_error: 'A pesar de los contratiempos mencionados al inicio, el emisor se enfoca totalmente en el talento del equipo y el éxito futuro. Busca la opción que refleje esperanza.'
        }
],
      seccionId: 'sec-2-9'
    },
    level: 20,
    order: 20,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
      id: 'sec-2-prac-6',
      title: 'Práctica: Identificando el Tono',
      introduccion: 'Mide tu capacidad para detectar tonos, posturas y matices sutiles del autor.',
      isPractice: true,
      practiceType: 'match-pairs',
      practiceData: {
        title: 'Conecta el Tono',
        description: 'Une cada fragmento con el tono predominante del emisor.',
        rounds: [
          {
            pairs: [
              { id: 1, left: '"¡Qué maravilla que pavimenten la misma calle 3 veces!"', right: 'Irónico', hint: 'Dice algo positivo para criticar.' },
              { id: 2, left: '"Las emisiones de carbono se redujeron un 2% este año."', right: 'Objetivo', hint: 'Solo entrega un dato sin opinión.' },
              { id: 3, left: '"Es alarmante y vergonzosa la actitud de los directivos."', right: 'Crítico', hint: 'Emite un juicio de valor negativo explícito.' },
              { id: 4, left: '"Recordaríamos lo pequeños que somos frente al cosmos."', right: 'Reflexivo', hint: 'Invita a la meditación profunda.' }
            ]
          },
          {
            pairs: [
              { id: 5, left: '"Aquellos años de infancia, bañados en luz dorada..."', right: 'Nostálgico', hint: 'Evoca el pasado con añoranza.' },
              { id: 6, left: '"Si no hacemos nada ahora, no habrá mañana que salvar."', right: 'Alarmista', hint: 'Busca generar preocupación o urgencia extrema.' },
              { id: 7, left: '"Claro, súper inteligente dejar las llaves dentro del auto."', right: 'Sarcástico', hint: 'Burla hiriente o evidente.' },
              { id: 8, left: '"Confío plenamente en que esta crisis nos fortalecerá."', right: 'Optimista', hint: 'Visión positiva del futuro.' }
            ]
          },
          {
            pairs: [
              { id: 9, left: '"La temperatura de ebullición del agua es de 100°C a nivel del mar."', right: 'Informativo', hint: 'Transmite datos sin valoración alguna.' },
              { id: 10, left: '"Me duele profundamente ver a mi pueblo en estas condiciones."', right: 'Apesadumbrado', hint: 'Transmite tristeza y pesar sincero.' },
              { id: 11, left: '"No cabe duda de que este es el mejor invento del siglo."', right: 'Elogioso', hint: 'Alaba algo con entusiasmo, usando un superlativo.' },
              { id: 12, left: '"Por un lado está la teoría A, y por otro, la teoría B."', right: 'Neutral', hint: 'Muestra ambas caras sin inclinarse por ninguna.' }
            ]
          },
          {
            pairs: [
              { id: 13, left: '"¡No me importa lo que digan, esto se hará a mi manera!"', right: 'Autoritario', hint: 'Impone su visión sin lugar a debate.' },
              { id: 14, left: '"Qué tristeza que todo esfuerzo se evapore tan rápido."', right: 'Melancólico', hint: 'Refleja una tristeza suave y reflexiva.' },
              { id: 15, left: '"Quizás, si prestamos atención, descubramos la verdad."', right: 'Esperanzador', hint: 'Plantea una posibilidad positiva.' },
              { id: 16, left: '"Otra vez llegaron tarde. Ya ni siquiera me sorprende."', right: 'Resignado', hint: 'Acepta una situación negativa sin luchar.' }
            ]
          },
          {
            pairs: [
              { id: 17, left: '"El 50% de la población sufre de esta condición, lo cual es inaceptable."', right: 'Crítico-Denuncia', hint: 'Combina un dato con un fuerte juicio de valor.' },
              { id: 18, left: '"El brillante estadista que quebró tres veces el país..."', right: 'Irónico', hint: 'Usa una alabanza para criticar.' },
              { id: 19, left: '"No hay forma humana de que logremos terminar esto a tiempo."', right: 'Pesimista', hint: 'Visión extremadamente negativa del desenlace.' },
              { id: 20, left: '"Cierra la puerta al salir y no vuelvas a llamar."', right: 'Tajante', hint: 'Directo y cortante, sin dejar opciones.' }
            ]
          },
          {
            pairs: [
              { id: 21, left: '"Si continuamos a este ritmo, los daños serán irreversibles para todos."', right: 'Catastrófico', hint: 'Proyecta un futuro trágico o destructor.' },
              { id: 22, left: '"¡Me complace enormemente informar que superamos las expectativas!"', right: 'Jubiloso', hint: 'Expresa una inmensa alegría y celebración.' },
              { id: 23, left: '"Por supuesto, gran idea olvidar los pasajes del avión en casa."', right: 'Sarcástico', hint: 'Hace un halago falso para resaltar un error.' },
              { id: 24, left: '"Las fluctuaciones del mercado obedecen a tres factores principales."', right: 'Objetivo', hint: 'Se limita a explicar hechos sin involucrarse emocionalmente.' }
            ]
          },
          {
            pairs: [
              { id: 25, left: '"Nada tiene sentido ya; hagamos lo que hagamos, fracasaremos."', right: 'Derrotista', hint: 'Siente que no hay esperanza y asume la pérdida.' },
              { id: 26, left: '"Exijo que se me devuelva mi dinero inmediatamente."', right: 'Indignado', hint: 'Muestra enojo justificado ante una situación.' },
              { id: 27, left: '"¡Vamos equipo! Solo un esfuerzo más y cruzaremos la línea."', right: 'Alentador', hint: 'Busca dar ánimos e inspirar a continuar.' },
              { id: 28, left: '"Recuerdo el aroma a pan recién horneado de las mañanas de domingo."', right: 'Evocador', hint: 'Trae a la memoria imágenes vívidas del pasado.' }
            ]
          },
          {
            pairs: [
              { id: 29, left: '"Resulta fascinante observar la asombrosa arquitectura de estas termitas."', right: 'Maravillado', hint: 'Muestra un profundo asombro y admiración.' },
              { id: 30, left: '"Qué sorpresa tan agradable, otra reunión que pudo ser un correo."', right: 'Irónico', hint: 'Simula agrado frente a algo tedioso.' },
              { id: 31, left: '"La negligencia de las autoridades ha condenado al pueblo a la miseria."', right: 'Acusatorio', hint: 'Culpa directamente a alguien de forma severa.' },
              { id: 32, left: '"Según los registros oficiales, el incidente ocurrió a las 14:30 horas."', right: 'Imparcial', hint: 'Presenta la información sin tomar partido.' }
            ]
          },
          {
            pairs: [
              { id: 33, left: '"En mis tiempos, la música sí transmitía valores, no como ahora."', right: 'Conservador', hint: 'Privilegia el pasado y critica lo moderno.' },
              { id: 34, left: '"Te suplico que consideres nuestra propuesta, dependemos de ello."', right: 'Desesperado', hint: 'Muestra una urgencia angustiante.' },
              { id: 35, left: '"Aunque hoy llueva y esté oscuro, mañana siempre sale el sol."', right: 'Esperanzador', hint: 'Confía en que lo malo pasará pronto.' },
              { id: 36, left: '"El ministro que prometió \'honestidad total\' fue arrestado con maletines de efectivo... qué gran ejemplo de transparencia."', right: 'Burlón', hint: 'Muestra una contradicción ridícula para reírse.' }
            ]
          },
          {
            pairs: [
              { id: 37, left: '"Las conclusiones del estudio se limitan estrictamente a esta muestra poblacional."', right: 'Precavido', hint: 'Actúa con cautela para no generalizar de más.' },
              { id: 38, left: '"O lo haces como yo digo, o te buscas otro lugar donde trabajar."', right: 'Intimidante', hint: 'Usa el miedo o las amenazas para controlar.' },
              { id: 39, left: '"No puedo creer que se haya ido... el vacío que deja es inmenso."', right: 'Afligido', hint: 'Expresa un dolor emocional muy profundo.' },
              { id: 40, left: '"Con trabajo duro y perseverancia, no hay obstáculo que no podamos vencer."', right: 'Inspirador', hint: 'Motiva a alcanzar grandes logros.' }
            ]
          }
        ]
      },
      test: {
        id: 'test-sec-2-prac-6',
        seccionId: 'sec-2-prac-6',
        contexto_base: null,
        preguntas: []
      },
      level: 21,
      order: 21,
      capituloId: 'cap-interpretar',
      materiaId: 'comp-lectora',
      datos_claves: []
    },
  {
    id: 'sec-2-10-join',
    title: 'Práctica: Tono y Perspectiva',
    introduccion: 'Pon a prueba tu habilidad para detectar tonos e intenciones.',
    isPractice: true,
    tags: [
      'practica'
    ],
    test: {
      id: 'test-2-10-join',
      contexto_base: 'TEXTO 1\nEl informe técnico detalla que las emisiones de carbono se redujeron un 2% este trimestre en nuestra planta industrial. Sin embargo, este descenso es insignificante si consideramos que la meta establecida era de un 15%. La complacencia y pasividad de nuestra mesa directiva frente a estos números es francamente alarmante, pues estamos priorizando los dividendos trimestrales por encima de nuestra responsabilidad ética corporativa.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nA mis 75 años, he visto pasar muchas modas pedagógicas. Los jóvenes profesores de hoy llegan con tabletas, aplicaciones interactivas y metodologías de gamificación, convencidos de que están revolucionando el aprendizaje. No niego que la tecnología sea útil, pero me entristece ver cómo se pierde la paciencia necesaria para leer un buen libro en silencio. Al final, los atajos digitales rara vez forjan un carácter profundo.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nEn nuestro último recorrido por las zonas afectadas, el equipo de respuesta rápida constató que los brotes de cólera han aumentado un 40% respecto a la semana pasada debido a la contaminación de los pozos de agua. Solicitamos a los organismos internacionales el envío urgente de 50.000 unidades de rehidratación oral y antibióticos para evitar un desastre de proporciones incalculables en los campamentos.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nEs verdaderamente indignante que, tras pagar nuestros impuestos religiosamente durante décadas, los habitantes de este sector tengamos que rogar por algo tan básico como el alumbrado público. Ayer mi hija tuvo que caminar a oscuras desde la estación de autobuses, arriesgando su seguridad, mientras la municipalidad inaugura fuentes luminosas en los barrios exclusivos. ¡Exigimos obras inmediatas!\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nAl analizar la obra de Goya en su etapa oscura, resulta fascinante cómo la paleta de colores y la deformación de las figuras reflejan no solo su sordera física, sino la profunda sordera moral que percibía en la sociedad de su tiempo. Cada trazo de las \'Pinturas Negras\' es un testimonio invaluable del tormento interior del artista y un espejo ineludible de nuestra propia condición humana.\n',
      preguntas: [
        {
          id: 2021,
          texto_index: 0,
          enunciado: '¿Cómo evoluciona el tono del emisor a lo largo del TEXTO 1?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Pasa de ser meramente informativo a ser fuertemente crítico y de denuncia.',
            B: 'Comienza esperanzado pero termina melancólico.',
            C: 'Mantiene un tono objetivo y neutral de principio a fin.',
            D: 'Inicia en tono sarcástico y culmina en tono triunfalista.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Inicia dando el dato crudo de las emisiones (informativo) y luego usa términos como "insignificante", "complacencia" y "alarmante" (crítico).',
          feedback_error: 'Fíjate en las primeras palabras versus la última oración. Empieza hablando de un "informe técnico" y termina hablando de "responsabilidad ética" y "alarmante".'
        },
        {
          id: 2022,
          texto_index: 0,
          enunciado: 'A partir de las marcas del texto, ¿cuál es la perspectiva más probable desde la que habla el emisor?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un periodista ecológico externo a la empresa.',
            B: 'Un miembro de la propia empresa que está en desacuerdo con la mesa directiva.',
            C: 'Un accionista al que solo le importan los dividendos trimestrales.',
            D: 'Un inspector del gobierno.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! El uso de "nuestra planta", "nuestra mesa directiva" y "estamos priorizando" delata que el emisor pertenece a la organización, pero critica su ética.',
          feedback_error: 'Observa los pronombres posesivos: "nuestra planta", "nuestra mesa directiva", "estamos priorizando". ¿Eso lo diría alguien de afuera?'
        },
        {
          id: 2023,
          texto_index: 1,
          enunciado: '¿Cuál es el tono predominante en las palabras del emisor del TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Entusiasta y tecnológico.',
            B: 'Nostálgico y ligeramente escéptico.',
            C: 'Airado y agresivo.',
            D: 'Objetivo y científico.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! Siente nostalgia por la lectura en silencio ("me entristece ver cómo se pierde...") y escepticismo frente a los jóvenes que creen estar "revolucionando" todo.',
          feedback_error: 'No está enojado (agresivo), sino más bien triste ("me entristece") porque siente que los atajos digitales no forman el carácter, añorando otras épocas.'
        },
        {
          id: 2024,
          texto_index: 1,
          enunciado: '¿Desde qué perspectiva o rol social se enuncia el TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desde la de un estudiante universitario.',
            B: 'Desde la de un vendedor de aplicaciones educativas.',
            C: 'Desde la de un educador veterano y con vasta experiencia.',
            D: 'Desde la de un padre de familia preocupado.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Sus "75 años", el hecho de haber visto "muchas modas pedagógicas" y su contraste con "los jóvenes profesores" definen su perfil.',
          feedback_error: 'Busca las pistas directas sobre su edad e historia laboral: "A mis 75 años, he visto pasar muchas modas pedagógicas".'
        },
        {
          id: 2025,
          texto_index: 2,
          enunciado: '¿Qué tono caracteriza el mensaje del TEXTO 3?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indiferente y resignado.',
            B: 'Reflexivo y poético.',
            C: 'Urgente y profesional.',
            D: 'Irónico y burlesco.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Perfecto! El lenguaje es técnico ("unidades de rehidratación", "antibióticos de amplio espectro") pero transmite una gran urgencia ("envío urgente", "desastre de proporciones incalculables").',
          feedback_error: 'Observa frases como "envío urgente" y "desastre de proporciones incalculables". No pueden ser más apremiantes.'
        },
        {
          id: 2026,
          texto_index: 2,
          enunciado: '¿Quién es el emisor más probable del TEXTO 3?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un representante del gobierno responsable de la contaminación.',
            B: 'Un periodista de espectáculos.',
            C: 'Un refugiado del campamento.',
            D: 'Un médico o trabajador humanitario de ayuda internacional.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Muy bien! Habla a nombre del "equipo de respuesta rápida", constata aumentos médicos y solicita insumos clínicos a organismos internacionales.',
          feedback_error: 'Un refugiado no usaría términos como "unidades de rehidratación oral" ni hablaría de "nuestro último recorrido por las zonas".'
        },
        {
          id: 2027,
          texto_index: 3,
          enunciado: 'El tono del TEXTO 4 es evidentemente:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indignado y de reclamo.',
            B: 'Resignado y apático.',
            C: 'Cauteloso y moderado.',
            D: 'Triunfalista y celebratorio.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Excelente! Empieza diciendo "Es verdaderamente indignante", y termina con una exclamación de exigencia ("¡Exigimos obras inmediatas!").',
          feedback_error: 'Fíjate en las exclamaciones finales y en el contraste entre lo que pagan de impuestos y lo que hace el alcalde. Hay mucha molestia en sus palabras.'
        },
        {
          id: 2028,
          texto_index: 3,
          enunciado: '¿Desde qué perspectiva social se emite el reclamo del TEXTO 4?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desde la posición del alcalde de la ciudad.',
            B: 'Desde la de un vecino contribuyente que se siente marginado.',
            C: 'Desde la de un electricista buscando empleo.',
            D: 'Desde la de la hija que caminó en la oscuridad.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El uso de "los habitantes de este sector", el hecho de pagar "nuestros impuestos" y mencionar a "mi hija" delatan su posición de residente afectado.',
          feedback_error: 'El emisor dice "mi hija tuvo que caminar". Por lo tanto, no es la hija. Tampoco es el alcalde porque lo está criticando.'
        },
        {
          id: 2029,
          texto_index: 4,
          enunciado: '¿Cómo calificarías el tono del autor del TEXTO 5 al referirse a la obra de Goya?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Despectivo y crítico.',
            B: 'Admirativo y analítico.',
            C: 'Alarmista y asustado.',
            D: 'Burlón e irrespetuoso.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Lo califica como "fascinante" e "invaluable", analizando a la vez cómo la pintura refleja el tormento del autor y la sociedad.',
          feedback_error: 'El emisor considera que cada trazo es "un testimonio invaluable". Lejos de criticarlo o asustarse, siente profunda admiración por la profundidad de la obra.'
        },
        {
          id: 2030,
          texto_index: 4,
          enunciado: '¿Cuál es la perspectiva más congruente con el autor del TEXTO 5?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un crítico de arte o investigador cultural.',
            B: 'El médico personal que atendió la sordera de Goya.',
            C: 'Un político de la sociedad española de su tiempo.',
            D: 'Un pintor que odia el arte moderno.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Su capacidad para conectar la "paleta de colores" con el contexto social ("sordera moral") es típica de los ensayistas o críticos de arte.',
          feedback_error: 'Habla de Goya en retrospectiva ("de su tiempo") y analiza los elementos estéticos ("paleta de colores", "trazo"). Esto corresponde a alguien que estudia el arte.'
        }
],
      seccionId: 'sec-2-10-join'
    },
    level: 22,
    order: 22,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
    id: 'sec-2-protip-6',
    title: 'Perspectiva del Autor',
    introduccion: 'Cuando identifiques el tono, pregúntate inmediatamente: ¿Desde qué posición me habla el autor? ¿Es un experto, un ciudadano indignado, un poeta, un científico?',
    datos_claves: [
      'El contexto y el vocabulario te ayudarán a construir el perfil de quién escribe.',
      'Esta perspectiva influye directamente en las conclusiones que quiere que saques del texto.'
    ],
    isProTip: true,
    test: {
      id: 'test-2-protip-6',
      contexto_base: null,
      preguntas: [],
      seccionId: 'sec-2-protip-6'
    },
    level: 23,
    order: 23,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora'
  },
  {
    id: 'sec-2-prac-7',
    title: 'Perspectiva y Subjetividad',
    introduccion: 'Última práctica antes del jefe final.',
    isPractice: true,
    test: {
      id: 'test-2-prac-7',
      contexto_base: 'TEXTO 1\nComo vecinos del sector histórico, exigimos que se detenga la construcción de la nueva torre habitacional. No solo destruirá la estética del barrio, sino que colapsará las alcantarillas.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa adopción de esta nueva política impositiva tendrá un impacto directo en el producto interno bruto. Las simulaciones estocásticas proyectan una reducción del 0,4% en el crecimiento interanual si no se realizan los ajustes correspondientes en el gasto fiscal.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nLlevo más de quince años trabajando en esta sala de urgencias y jamás había visto una saturación tan extrema de las camas UCI. Nos faltan respiradores, insumos básicos y, sobre todo, personal de enfermería de relevo.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 4\nAl evaluar las pinturas encontradas en la cueva, resulta innegable que los pigmentos utilizados provienen de una mezcla de carbón vegetal y ocre rojo, técnica característica de las comunidades nómadas de finales del Paleolítico Superior.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 5\nEs inaceptable que sigan enviándonos a apagar incendios forestales con trajes que ya cumplieron su vida útil hace tres temporadas. No solo arriesgamos nuestras vidas por la comunidad, sino que el Estado nos da la espalda cuando pedimos el equipamiento mínimo.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 6\nLas semillas que hemos sembrado este año no lograron germinar como esperábamos. Las sequías prolongadas y la falta de subsidios agrícolas nos tienen al borde de la quiebra. Si el gobierno no declara emergencia rural, perderemos las tierras de nuestros abuelos.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 7\nEn el análisis microscópico de la muestra de tejido, las células escamosas presentan núcleos agrandados e hipercromáticos. Estos hallazgos histológicos son altamente sugestivos de una displasia severa que requiere confirmación inmediata.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 8\nComo madre, no puedo dormir tranquila sabiendo que la carretera frente al colegio de mis hijos sigue sin semáforos ni señalética. Ya hemos entregado tres cartas al departamento de tránsito y nadie responde. ¿Tienen que ocurrir tragedias para que actúen?\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 9\nTras revisar los estados financieros de la compañía del último semestre, he concluido que debemos declarar la quiebra corporativa. Los pasivos superan con creces los activos líquidos y los acreedores ya han iniciado acciones legales.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 10\nResulta fascinante observar cómo las abejas obreras se comunican a través de danzas vibratorias para indicar la ubicación exacta de las fuentes de néctar. Llevo meses documentando este patrón de comportamiento en las colmenas silvestres de la reserva.\n',
      preguntas: [
        {
          id: 24009,
          texto_index: 0,
          enunciado: '¿Desde qué perspectiva habla el emisor en el TEXTO 1?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desde la de un arquitecto experto',
            B: 'Desde la de un residente afectado',
            C: 'Desde la de un funcionario municipal',
            D: 'Desde la de un historiador objetivo'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El uso explícito de "Como vecinos del sector" y sus preocupaciones diarias (alcantarillas) marcan la perspectiva de un residente.',
          feedback_error: 'Lee la primera frase del texto: "Como vecinos del sector...".'
        },
        {
          id: 24010,
          texto_index: 1,
          enunciado: 'A partir del vocabulario y contenido del TEXTO 2, la postura del emisor corresponde a la de un:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Analista o especialista en economía.',
            B: 'Activista social contra los impuestos.',
            C: 'Estudiante de ciencias políticas.',
            D: 'Político en campaña electoral.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! Utiliza jerga técnica muy específica ("producto interno bruto", "simulaciones estocásticas", "gasto fiscal") propia de un analista o economista.',
          feedback_error: 'Fíjate en las palabras que utiliza: "simulaciones estocásticas", "crecimiento interanual". Es un vocabulario altamente especializado de la disciplina económica.'
        },
        {
          id: 2011,
          texto_index: 2,
          enunciado: '¿Desde qué rol o perspectiva se enuncia el mensaje del TEXTO 3?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un paciente esperando atención.',
            B: 'Un periodista de investigación.',
            C: 'Un médico o enfermero de urgencias.',
            D: 'El director del hospital desde su oficina.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Exacto! Habla desde la primera línea ("trabajando en esta sala", "jamás había visto"), evidenciando que es personal de salud atendiendo la emergencia.',
          feedback_error: 'El emisor dice "Llevo más de quince años trabajando en esta sala" y se queja de la falta de "personal de enfermería de relevo". Es alguien que está trabajando allí en urgencias.'
        },
        {
          id: 2012,
          texto_index: 3,
          enunciado: 'El lenguaje y los hallazgos descritos en el TEXTO 4 evidencian que la perspectiva del emisor es la de un:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Crítico de arte contemporáneo.',
            B: 'Arqueólogo o antropólogo experto.',
            C: 'Turista visitando la cueva.',
            D: 'Pintor buscando inspiración.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Perfecto! Sus conocimientos sobre "pigmentos de ocre rojo" y "comunidades nómadas del Paleolítico Superior" revelan a un especialista en historia antigua.',
          feedback_error: 'El emisor puede identificar componentes de pintura prehistórica y sabe fecharlos ("finales del Paleolítico Superior"). Un turista o un crítico de arte moderno no tendrían este nivel técnico.'
        },
        {
          id: 2013,
          texto_index: 4,
          enunciado: '¿Desde qué postura se emite el reclamo del TEXTO 5?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desde la de un ambientalista.',
            B: 'Desde la de un proveedor de uniformes.',
            C: 'Desde la de un ciudadano preocupado.',
            D: 'Desde la de un bombero forestal.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Muy bien! Se incluye en el grupo ("enviándonos a apagar incendios", "arriesgamos nuestras vidas"), lo que demuestra que es parte del equipo de bomberos afectados.',
          feedback_error: 'Nota que el emisor se incluye en la acción: "enviándonos a apagar incendios". Por lo tanto, él es quien apaga los incendios.'
        },
        {
          id: 2014,
          texto_index: 5,
          enunciado: 'Según la información entregada, el emisor del TEXTO 6 es muy probablemente:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un meteorólogo informando sobre la sequía.',
            B: 'Un trabajador agrícola o campesino afectado.',
            C: 'Un Ministro de Agricultura.',
            D: 'Un activista contra el calentamiento global.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Habla de "las semillas que hemos sembrado" y de perder "las tierras de nuestros abuelos", mostrando un involucramiento personal, económico y familiar directo.',
          feedback_error: 'El emisor afirma que las semillas que "hemos sembrado" no germinaron y que podrían quebrar. Es claramente un productor agrícola sufriendo el problema.'
        },
        {
          id: 2015,
          texto_index: 6,
          enunciado: '¿Qué tipo de especialista está emitiendo el diagnóstico del TEXTO 7?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un cirujano plástico.',
            B: 'Un médico patólogo o histólogo.',
            C: 'Un químico farmacéutico.',
            D: 'Un estudiante de medicina general.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Exacto! El vocabulario ("análisis microscópico", "células escamosas", "hipercromáticos", "displasia") es sumamente técnico y propio del análisis de tejidos (patología).',
          feedback_error: 'El análisis celular bajo microscopio para detectar displasias (anomalías) es el trabajo de un patólogo. El vocabulario es extremadamente técnico.'
        },
        {
          id: 2016,
          texto_index: 7,
          enunciado: '¿Desde qué perspectiva o rol social se expresa el TEXTO 8?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desde el rol de una madre apoderada y preocupada.',
            B: 'Desde el rol del director del colegio.',
            C: 'Desde la perspectiva de una profesora.',
            D: 'Desde la del departamento de tránsito.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Lo dice explícitamente ("Como madre...") y expresa la preocupación genuina por la seguridad de "mis hijos" al ir al colegio.',
          feedback_error: 'Fíjate en las primeras dos palabras del texto: "Como madre...".'
        },
        {
          id: 2017,
          texto_index: 8,
          enunciado: '¿A qué rol profesional corresponde la jerga utilizada en el TEXTO 9?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'A un juez dictando una sentencia.',
            B: 'A un economista estudiando el mercado.',
            C: 'A un auditor financiero o asesor corporativo.',
            D: 'A un empresario emprendedor.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Muy bien! Expresiones como "estados financieros", "pasivos", "activos líquidos" y "acreedores" son terminología clásica de la contabilidad y auditoría de empresas.',
          feedback_error: 'Revisa las palabras clave: pasivos, activos líquidos, acreedores, bancarrota corporativa. Esto lo dice quien analiza los números internos de la compañía.'
        },
        {
          id: 2018,
          texto_index: 9,
          enunciado: 'La perspectiva desde la cual se narra el TEXTO 10 pertenece a:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un apicultor aficionado.',
            B: 'Un cazador furtivo de la reserva.',
            C: 'Un poeta inspirado en la naturaleza.',
            D: 'Un biólogo o investigador de fauna silvestre.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Perfecto! El autor lleva "meses documentando" el patrón de las abejas de manera sistemática ("danzas vibratorias"), lo que denota el trabajo de un científico en terreno.',
          feedback_error: 'Aunque podría parecer un apicultor, la frase "Llevo meses documentando este patrón" indica un trabajo de estudio e investigación formal.'
        }
],
      seccionId: 'sec-2-prac-7'
    },
    level: 24,
    order: 24,
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    datos_claves: []
  },
  {
      id: 'sec-2-boss',
      capituloId: 'cap-interpretar',
      materiaId: 'comp-lectora',
      level: 25,
      order: 25,
      tags: ['subcapitulo:Evaluación Final'],
      isBoss: true,
      title: 'Desafío Final: Interpretar',
      introduccion: '¡Has llegado al Desafío Final del Capítulo 2! Evalúa inferencias, relaciones lógicas, tesis, propósito del emisor y vocabulario en contexto.',
      datos_claves: [
        'Lee todo el texto antes de responder: algunas preguntas abarcan el texto completo.',
        'Para inferencias: deduce solo lo que el texto sugiere, no agregues conocimiento propio.',
        'Reemplaza las palabras de vocabulario en el contexto original para verificar su sentido.',
        'Busca las marcas valorativas (adjetivos) para identificar el tono del emisor.'
      ],
      test: {
        id: 'test-2-boss',
        seccionId: 'sec-2-boss',
        contexto_base: 'TEXTO I: El eco de los pasos\n\nLa casa de los Arcos no había sido habitada desde la muerte del abuelo, pero cuando Laura cruzó el umbral, el olor a cera pulida y lavanda seguía flotando, suspendido en el tiempo. Sobre la mesa del recibidor, una carta cerrada, amarilla por los bordes, parecía aguardar su llegada. Laura dudó. Sabía que abrirla significaría desatar los demonios que su madre había querido enterrar, pero la caligrafía trémula de su abuelo ejercía sobre ella una atracción hipnótica. Un relámpago iluminó el corredor, seguido de un trueno que hizo temblar los cristales de la puerta principal. Sin pensarlo más, rompió el sello de cera roja.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO II: La paradoja de la hiperconexión\n\nVivimos en la era de la información y, paradójicamente, en la era de la desinformación. Nunca antes habíamos tenido acceso a tantas fuentes, tantos datos, tanta ciencia disponible en tiempo real. Y sin embargo, la desconfianza hacia las instituciones científicas ha alcanzado niveles que habrían resultado impensables hace treinta años. La paradoja tiene una explicación que incomoda: no fue el acceso a más información lo que nos hizo más críticos, sino el acceso a información que confirma lo que ya creemos. Cada plataforma digital aprende a mostrarnos lo que queremos ver, reforzando nuestras convicciones en lugar de cuestionarlas. El resultado es una sociedad de burbujas cognitivas, donde la discrepancia se interpreta como amenaza. Pero la historia de la ciencia es precisamente la historia de aquellos que se atrevieron a estar en desacuerdo: Galileo, Darwin, Einstein. La diferencia es que ellos ofrecieron evidencia. Hoy, con demasiada frecuencia, el único argumento es la intensidad del sentimiento.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO III: Inteligencia Artificial en la medicina\n\nEl uso de la Inteligencia Artificial (IA) en diagnósticos médicos ha crecido exponencialmente. Sistemas entrenados con millones de imágenes radiológicas pueden hoy detectar tumores milimétricos que el ojo humano de un médico experto podría pasar por alto. Por ejemplo, en 2022, un algoritmo desarrollado en el MIT logró una precisión del 94% en la detección temprana de cáncer de mama, superando el promedio humano del 88%. No obstante, la implementación clínica de estas herramientas enfrenta un obstáculo ético fundamental: la falta de "explicabilidad". Cuando una red neuronal profunda emite un diagnóstico, a menudo opera como una caja negra; ni siquiera sus creadores pueden detallar el proceso exacto que la llevó a esa conclusión. Esto genera recelo en la comunidad médica, puesto que un facultativo no puede prescribir un tratamiento agresivo basándose únicamente en el veredicto de una máquina cuyo razonamiento no puede ser auditado. En consecuencia, el consenso actual es que la IA debe funcionar como un "copiloto" del médico, no como un sustituto.',
        preguntas: [
          // TEXTO 1 (Narrativo)
          { id: 22001, texto_index: 0, enunciado: '¿Qué se puede INFERIR sobre el estado en el que se mantenía la casa?', alternativas: { A: 'Que había sido saqueada tras la muerte del abuelo.', B: 'Que nadie había limpiado ni entrado en años, estando llena de polvo.', C: 'Que, misteriosamente o por cuidados ocultos, la casa conservaba un ambiente pulcro y familiar.', D: 'Que Laura la visitaba todos los días para limpiar.' }, respuesta_correcta: 'C', feedback_acierto: `¡Correcto! El 'olor a cera pulida y lavanda' indica que, pese a estar deshabitada, mantiene un aura de limpieza y familiaridad preservada en el tiempo.`, feedback_error: `Fíjate en las pistas sensoriales: 'olor a cera pulida y lavanda'. ¿Eso sugiere abandono y suciedad, o preservación?` },
          { id: 22002, texto_index: 0, enunciado: '¿Qué simboliza la carta cerrada en el contexto de la historia?', alternativas: { A: 'Un simple trámite legal sin importancia.', B: 'Una amenaza física directa hacia Laura.', C: 'Un secreto familiar doloroso que ha sido ocultado deliberadamente.', D: 'La fortuna que el abuelo le dejó a Laura.' }, respuesta_correcta: 'C', feedback_acierto: `¡Muy bien! 'Desatar los demonios que su madre había querido enterrar' es una metáfora clara de secretos familiares dolorosos.`, feedback_error: `Lee la metáfora: 'desatar los demonios que su madre había querido enterrar'.` },
          { id: 22003, texto_index: 0, enunciado: '¿Cuál es el significado más adecuado para la palabra "trémula" en el texto?', alternativas: { A: 'Elegante', B: 'Temblorosa', C: 'Antigua', D: 'Ilegible' }, respuesta_correcta: 'B', feedback_acierto: `¡Exacto! 'Trémula' viene de temblor, propio del pulso de una persona mayor (el abuelo).`, feedback_error: 'Piensa en las características físicas de un anciano al escribir.' },
          { id: 22004, texto_index: 0, enunciado: '¿Qué función cumple la mención del trueno y el relámpago en el texto?', alternativas: { A: 'Informar que está ocurriendo un huracán.', B: 'Acentuar la tensión dramática del momento en que Laura toma la decisión.', C: 'Explicar por qué Laura decidió abrir la carta.', D: 'Describir el clima habitual de la zona.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! En literatura, el clima suele ser un recurso para intensificar la atmósfera emocional (falacia patética).', feedback_error: 'Analiza el momento: ella duda, cae un rayo y luego abre la carta de inmediato. Es un recurso para crear tensión climática.' },
          { id: 22005, texto_index: 0, enunciado: 'A partir del actuar de Laura, se infiere que ella es una persona:', alternativas: { A: 'Indiferente y fría.', B: 'Curiosa y decidida a enfrentar la verdad.', C: 'Obediente a los deseos de su madre.', D: 'Supersticiosa y temerosa de los fantasmas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! A pesar de saber que la carta es problemática, su atracción y su decisión final muestran curiosidad y valentía.', feedback_error: `Revisa su decisión final: 'Sin pensarlo más, rompió el sello'. Desobedece el deseo de su madre de dejar los 'demonios' enterrados.` },

          // TEXTO 2 (Ensayo/Opinión)
          { id: 22006, texto_index: 1, enunciado: '¿Cuál es la TESIS principal defendida por el autor del Texto II?', alternativas: { A: 'El acceso excesivo a la información en internet ha hecho que las personas sean más críticas y analíticas.', B: 'La tecnología digital es la única responsable de que hoy en día no existan científicos brillantes como Einstein.', C: 'Vivimos una paradoja donde la abundancia de información ha provocado desinformación, al encerrarnos en burbujas que confirman nuestros sesgos.', D: 'Es necesario prohibir las plataformas digitales para restaurar la confianza en las instituciones científicas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Esa es la idea central que articula y da sentido a todo el párrafo.', feedback_error: `La tesis debe resumir la paradoja central que explica todo el texto. Busca la frase 'La paradoja tiene una explicación...'` },
          { id: 22007, texto_index: 1, enunciado: '¿Cuál es el tono predominante del emisor en el Texto II?', alternativas: { A: 'Entusiasta y esperanzador.', B: 'Crítico y reflexivo.', C: 'Nostálgico y resignado.', D: 'Sarcástico y burlesco.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Analiza críticamente un problema social (burbujas) y reflexiona sobre su contraste con la historia de la ciencia.', feedback_error: `Fíjate en frases como 'explicación que incomoda' y el contraste que hace con los científicos del pasado. No hay burla ni esperanza.` },
          { id: 22008, texto_index: 1, enunciado: '¿Qué relación se establece entre Galileo, Darwin y Einstein con la sociedad actual según el texto?', alternativas: { A: 'Son ejemplos de científicos que sufrieron el mismo tipo de desinformación digital en su época.', B: 'Actúan como un contraste: ellos enfrentaron el desacuerdo con evidencia, mientras que hoy el desacuerdo se basa solo en el sentimiento.', C: 'Fueron los creadores de las bases para las actuales plataformas digitales.', D: 'Son citados como culpables de la actual desconfianza hacia la ciencia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente interpretación de la relación lógica!', feedback_error: `Lee la frase: 'La diferencia es que ellos ofrecieron evidencia. Hoy... el único argumento es el sentimiento'.` },
          { id: 22009, texto_index: 1, enunciado: '¿Cuál es el significado contextual de la frase "burbujas cognitivas"?', alternativas: { A: 'Comunidades científicas que se aíslan para investigar sin distracciones.', B: 'Espacios virtuales donde las personas solo interactúan con información afín a sus propias ideas.', C: 'Errores lógicos producidos por el exceso de estudio.', D: 'Noticias falsas que estallan y desaparecen rápidamente.' }, respuesta_correcta: 'B', feedback_acierto: `¡Correcto! El texto lo explica antes: 'información que confirma lo que ya creemos'.`, feedback_error: `Lee la oración anterior a la mención del término. Ahí se explica qué es lo que genera estas 'burbujas'.` },
          { id: 22010, texto_index: 1, enunciado: 'Según el autor, ¿cuál es el criterio que hoy suele usarse equivocadamente como argumento?', alternativas: { A: 'La evidencia estadística.', B: 'La intensidad del sentimiento.', C: 'Las publicaciones académicas.', D: 'El dinero invertido en plataformas.' }, respuesta_correcta: 'B', feedback_acierto: 'Literal y preciso. ¡Gran rastreo e interpretación final!', feedback_error: `Busca la frase final del texto: 'Hoy, con demasiada frecuencia, el único argumento es...'` },

          // TEXTO 3 (Informativo)
          { id: 22011, texto_index: 2, enunciado: '¿Qué función cumple la mención del estudio del MIT (2022) en el primer párrafo?', alternativas: { A: 'Explicar cómo se fabrica una Inteligencia Artificial.', B: 'Proponer que las máquinas reemplazarán a los médicos en el corto plazo.', C: 'Ejemplificar con datos concretos la superioridad diagnóstica de la IA en ciertas áreas.', D: 'Criticar a los médicos humanos por su baja precisión diagnóstica.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! Los datos estadísticos (94% vs 88%) se usan para respaldar la afirmación anterior de que la IA detecta cosas que el ojo humano omite.', feedback_error: `Fíjate que la frase comienza con 'Por ejemplo...'. ¿Qué es lo que está intentando demostrar ese ejemplo?` },
          { id: 22012, texto_index: 2, enunciado: '¿Cuál es la causa directa del "recelo en la comunidad médica" respecto a la IA?', alternativas: { A: 'Que la IA tiene una tasa de error mucho mayor que los médicos.', B: 'Que los pacientes se niegan a ser evaluados por computadoras.', C: 'La imposibilidad de auditar y entender el proceso de razonamiento exacto de la máquina ("caja negra").', D: 'El alto costo de implementar sistemas de IA en los hospitales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Captaste la relación de causa-efecto explicada en el texto.', feedback_error: `Busca la palabra 'recelo'. ¿Qué se dice inmediatamente antes que provoca ese sentimiento?` },
          { id: 22013, texto_index: 2, enunciado: 'En el texto, ¿qué significa que la red neuronal opere como una "caja negra"?', alternativas: { A: 'Que guarda información de forma segura para evitar hackeos.', B: 'Que emite resultados sin revelar el razonamiento o algoritmo exacto que usó para llegar a ellos.', C: 'Que su color físico en los hospitales suele ser negro para mantener la sobriedad.', D: 'Que solo puede diagnosticar enfermedades irreversibles.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien interpretado el lenguaje figurado!', feedback_error: `El texto dice: 'ni siquiera sus creadores pueden detallar el proceso exacto que la llevó a esa conclusión'.` },
          { id: 22014, texto_index: 2, enunciado: 'El uso del conector "No obstante" introduce:', alternativas: { A: 'Una conclusión lógica derivada del párrafo anterior.', B: 'Un ejemplo adicional de los logros de la IA.', C: 'Una objeción o dificultad que contrasta con los beneficios recién mencionados.', D: 'Una causa que explica por qué el MIT desarrolló el algoritmo.' }, respuesta_correcta: 'C', feedback_acierto: `¡Perfecto! 'No obstante' es un conector adversativo que introduce un obstáculo tras enumerar las ventajas.`, feedback_error: `'No obstante' funciona igual que 'Sin embargo'. ¿Qué relación lógica establece un 'sin embargo'?` },
          { id: 22015, texto_index: 2, enunciado: '¿Qué se puede concluir de la frase "la IA debe funcionar como un \'copiloto\' del médico, no como un sustituto"?', alternativas: { A: 'Que la IA será programada para pilotar ambulancias.', B: 'Que el médico humano debe mantener la autoridad y decisión final, apoyándose en la herramienta.', C: 'Que los médicos deben aprender a programar Inteligencia Artificial.', D: 'Que la IA es inútil y pronto dejará de usarse en la medicina.' }, respuesta_correcta: 'B', feedback_acierto: '¡Has completado exitosamente el Desafío Final del Capítulo 2! Eres un experto interpretando textos complejos.', feedback_error: `Un 'copiloto' ayuda y asiste al capitán, pero el capitán sigue al mando. Aplica esta metáfora al ámbito médico.` }
        ]
      }
    }
  ]
  }, {
    id: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Habilidad: Evaluar',
    introduccion: 'Evaluar es reflexionar y juzgar el texto analizando su forma, la intención del autor, la calidad de sus argumentos y los recursos que usa.',
    order: 3,
    secciones: [
  {
    id: 'sec-3-1',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 1,
    level: 1,
    title: 'Intención y Postura',
    introduccion: 'Aprende a identificar el propósito comunicativo y la actitud del emisor.',
    datos_claves: [
      'La intención es el "para qué" se escribe',
      'La postura es el "desde dónde" se posiciona el autor.'
    ],
    tags: [ 'subcapitulo:Intención y Postura' ],
    isProTip: true,
    guia_titulo: 'Intención y Postura',
    guia_contenido: '<ul><li><strong>🎯 La Intención Comunicativa:</strong> Todo texto se escribe por una razón. Los autores pueden querer **informar**, **persuadir**, **entretener**, **criticar** o **reflexionar**. Identificar esto es el primer paso para evaluar un texto.</li><li><strong>🎭 La Postura del Emisor:</strong> La postura o actitud es cómo se siente el autor frente a lo que escribe. Puede ser **objetivo** (neutral), **crítico** (juzga negativamente), **entusiasta** (apoya fervientemente) o **pesimista**.</li></ul>'
  },
  {
    id: 'sec-3-2',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 2,
    level: 2,
    title: 'ProTip: Marcadores Textuales',
    introduccion: 'Los marcadores textuales te revelan la verdadera actitud del autor.',
    datos_claves: [ 'Busca adjetivos valorativos para detectar la postura.' ],
    isProTip: true,
    guia_titulo: 'El secreto está en los adjetivos',
    guia_contenido: 'Si un autor llama a una medida "el **necesario** ajuste económico", su postura es a favor. Si la llama "el **despiadado** recorte", su postura es en contra. ¡Los adjetivos te gritan la respuesta!'
  },
  {
    id: 'sec-3-3',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 3,
    level: 3,
    title: 'Práctica: Categorizar Tonos',
    introduccion: 'Clasifica las siguientes frases según la actitud o tono que transmiten.',
    datos_claves: [ 'Lee el adjetivo y la emoción detrás de la frase.' ],
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      categories: [ 'Crítico', 'Entusiasta', 'Neutral' ],
      items: [
        { text: 'Es un desastre absoluto e imperdonable.', category: 'Crítico' },
        { text: 'La política implementada es sumamente perjudicial para la economía.', category: 'Crítico' },
        { text: 'Esta medida nefasta destruirá por completo nuestro ecosistema local.', category: 'Crítico' },
        { text: 'La falta de planificación es evidente y lamentable en cada paso del proceso.', category: 'Crítico' },
        { text: '¡Es la mejor noticia que he escuchado en años!', category: 'Entusiasta' },
        { text: 'El avance tecnológico abrirá puertas increíbles para el futuro de todos.', category: 'Entusiasta' },
        { text: 'Estoy verdaderamente maravillado con los excelentes resultados obtenidos.', category: 'Entusiasta' },
        { text: '¡Qué magnífica y brillante oportunidad para nuestro desarrollo!', category: 'Entusiasta' },
        { text: 'El agua hierve a 100 grados Celsius a nivel del mar.', category: 'Neutral' },
        { text: 'El informe oficial detalla los ingresos y egresos del último trimestre.', category: 'Neutral' },
        { text: 'La reunión de directorio se llevó a cabo el martes a las 10:00 AM.', category: 'Neutral' },
        { text: 'La temperatura promedio del mes pasado fue de 15 grados Celsius.', category: 'Neutral' }
      ]
    }
  },
  {
    id: 'sec-3-4',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 4,
    level: 4,
    title: 'Práctica: Empareja el Tono',
    introduccion: 'Une cada concepto de tono con su frase característica.',
    datos_claves: [ 'Piensa en la emoción principal que define cada palabra.' ],
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Tonos y Ejemplos',
      description: 'Une el Tono con la frase que lo representa.',
      rounds: [
        {
          pairs: [
            { id: 1, left: 'Ironía', right: '¡Qué genio, rompiste la ventana!', hint: 'Decir lo opuesto.' },
            { id: 2, left: 'Melancolía', right: 'Extraño esos días felices de mi infancia.', hint: 'Tristeza suave por el pasado.' },
            { id: 3, left: 'Optimismo', right: 'Estoy seguro de que mañana será un gran día.', hint: 'Mirar el lado positivo.' }
          ]
        },
        {
          pairs: [
            { id: 4, left: 'Sarcasmo', right: 'Claro, porque tú eres el experto en equivocarse.', hint: 'Burla mordaz.' },
            { id: 5, left: 'Nostalgia', right: 'Ese aroma me recuerda a las tardes con mi abuela.', hint: 'Anhelo del pasado.' },
            { id: 6, left: 'Pesimismo', right: 'Nada de lo que hagamos cambiará el desastre que viene.', hint: 'Ver el lado negativo.' }
          ]
        },
        {
          pairs: [
            { id: 7, left: 'Indignación', right: 'Es inaceptable que sigan abusando de nuestra paciencia.', hint: 'Enojo por una injusticia.' },
            { id: 8, left: 'Resignación', right: 'Al final, no queda más remedio que aceptarlo.', hint: 'Aceptar algo inevitable.' },
            { id: 9, left: 'Entusiasmo', right: '¡Qué maravilla, por fin logramos el objetivo!', hint: 'Alegría extrema.' }
          ]
        },
        {
          pairs: [
            { id: 10, left: 'Admiración', right: 'Nunca había visto a alguien con tanto talento.', hint: 'Valoración muy positiva.' },
            { id: 11, left: 'Desprecio', right: 'Ni siquiera vale la pena responder a sus mediocridades.', hint: 'Falta de respeto o asco.' },
            { id: 12, left: 'Duda', right: 'No estoy completamente seguro de si es la decisión correcta.', hint: 'Incertidumbre.' }
          ]
        },
        {
          pairs: [
            { id: 13, left: 'Compasión', right: 'Me parte el corazón verlos sufrir de esa manera.', hint: 'Pena por el sufrimiento ajeno.' },
            { id: 14, left: 'Soberbia', right: 'Obviamente, mi solución es la única que funciona.', hint: 'Creerse superior.' },
            { id: 15, left: 'Curiosidad', right: 'Me pregunto qué pasaría si mezclamos estos dos elementos.', hint: 'Deseo de saber.' }
          ]
        },
        {
          pairs: [
            { id: 16, left: 'Aprensión', right: 'Tengo un mal presentimiento sobre este viaje.', hint: 'Miedo a que algo malo pase.' },
            { id: 17, left: 'Gratitud', right: 'No tengo palabras para agradecer todo lo que han hecho.', hint: 'Agradecimiento.' },
            { id: 18, left: 'Apatía', right: 'La verdad es que me da exactamente igual lo que decidan.', hint: 'Falta de interés.' }
          ]
        },
        {
          pairs: [
            { id: 19, left: 'Euforia', right: '¡Ganamos, somos los campeones indiscutidos!', hint: 'Alegría desbordante.' },
            { id: 20, left: 'Frustración', right: '¡Llevo horas intentándolo y nada sale como quiero!', hint: 'Impotencia ante el fracaso.' },
            { id: 21, left: 'Serenidad', right: 'Todo fluye a su propio ritmo, no hay que apresurarse.', hint: 'Tranquilidad y paz.' }
          ]
        },
        {
          pairs: [
            { id: 22, left: 'Incredulidad', right: 'Me estás tomando el pelo, es imposible que eso sea cierto.', hint: 'No poder creer algo.' },
            { id: 23, left: 'Autoridad', right: 'A partir de ahora, las reglas se cumplirán estrictamente.', hint: 'Imponer obediencia.' },
            { id: 24, left: 'Esperanza', right: 'Aún confío en que encontraremos una salida a este problema.', hint: 'Confianza en un buen resultado.' }
          ]
        },
        {
          pairs: [
            { id: 25, left: 'Súplica', right: 'Por favor, te lo ruego, dame una última oportunidad.', hint: 'Rogar por algo.' },
            { id: 26, left: 'Advertencia', right: 'Si continúas por ese camino, las consecuencias serán graves.', hint: 'Aviso de peligro.' },
            { id: 27, left: 'Reflexión', right: 'Quizás debimos haber analizado mejor las alternativas.', hint: 'Pensamiento profundo.' }
          ]
        },
        {
          pairs: [
            { id: 28, left: 'Determinación', right: 'No me detendré hasta alcanzar mis metas, pase lo que pase.', hint: 'Firmeza en una decisión.' },
            { id: 29, left: 'Condescendencia', right: 'Ay, pobrecito, déjame explicarte cómo se hacen las cosas.', hint: 'Trato superior disfrazado de amabilidad.' },
            { id: 30, left: 'Alivio', right: 'Menos mal que todo terminó sin ningún problema grave.', hint: 'Descanso tras una tensión.' }
          ]
        }
      ]
    }
  },
  {
    id: 'sec-3-5',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 5,
    level: 5,
    title: 'Propósitos',
    introduccion: 'Conoce cómo el tipo de texto dicta la intención.',
    datos_claves: [ 'Ensayo = Persuadir', 'Noticia = Informar' ],
    isProTip: true,
    guia_titulo: 'Propósitos',
    guia_contenido: '<ul><li><strong>🗞️ Textos Informativos:</strong> Una noticia o artículo científico busca **Informar** y **Explicar**. Su tono suele ser **Objetivo** (neutral).</li><li><strong>⚖️ Textos Argumentativos:</strong> Columnas de opinión o ensayos buscan **Persuadir** o **Convencer**. Su tono suele ser **Crítico**, **Reflexivo** o **Polémico**.</li></ul>'
  },
  {
    id: 'sec-3-6',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 6,
    level: 6,
    title: 'Práctica: Completa la Idea',
    introduccion: 'Rellena los espacios en blanco sobre la teoría de la intención.',
    datos_claves: [
      'Recuerda la relación entre tipo de texto y su propósito principal.'
    ],
    isPractice: true,
    practiceType: 'fill-blanks',
    practiceData: {
      title: 'Completa la Idea',
      description: 'Selecciona la palabra correcta para completar el sentido de cada oración sobre los propósitos del autor.',
      items: [
        {
          id: 1,
          textBefore: 'En un texto argumentativo, la intención principal del emisor suele ser ',
          textAfter: ' al lector sobre su punto de vista.',
          options: ['persuadir', 'informar', 'entretener', 'describir'],
          correctOption: 'persuadir',
          hint: 'Busca convencer de una idea.'
        },
        {
          id: 2,
          textBefore: 'Para lograr convencer, el autor utilizará un tono ',
          textAfter: ' o valorativo, reflejando su opinión.',
          options: ['subjetivo', 'objetivo', 'neutral', 'imparcial'],
          correctOption: 'subjetivo',
          hint: 'No es neutral, expresa sentimientos o juicios.'
        },
        {
          id: 3,
          textBefore: 'En cambio, en una noticia tradicional, el objetivo central es ',
          textAfter: ' sobre los hechos de manera clara.',
          options: ['informar', 'opinar', 'criticar', 'emocionar'],
          correctOption: 'informar',
          hint: 'Entrega datos sin juicios personales.'
        },
        {
          id: 4,
          textBefore: 'Al informar, el periodista mantiene una postura mayormente ',
          textAfter: ', evitando mostrar sus emociones.',
          options: ['objetiva', 'subjetiva', 'crítica', 'sarcástica'],
          correctOption: 'objetiva',
          hint: 'Se limita a los hechos tal cual son.'
        },
        {
          id: 5,
          textBefore: 'Un texto expositivo tiene el propósito de ',
          textAfter: ' un tema para que el lector lo comprenda.',
          options: ['explicar', 'juzgar', 'persuadir', 'dudar'],
          correctOption: 'explicar',
          hint: 'Hace que un concepto sea más claro.'
        },
        {
          id: 6,
          textBefore: 'Cuando un autor usa un tono sarcástico, su verdadera intención suele ser ',
          textAfter: ' o burlarse de una situación.',
          options: ['criticar', 'alabar', 'informar', 'apoyar'],
          correctOption: 'criticar',
          hint: 'Usa la ironía para atacar algo.'
        },
        {
          id: 7,
          textBefore: 'El ensayo es un género donde predomina la ',
          textAfter: ', ya que el autor reflexiona y defiende una tesis.',
          options: ['argumentación', 'narración', 'descripción', 'poesía'],
          correctOption: 'argumentación',
          hint: 'Se basa en razones para validar una postura.'
        },
        {
          id: 8,
          textBefore: 'Si un texto busca enseñar los pasos para armar un mueble, su intención es ',
          textAfter: ' o instruir.',
          options: ['directiva', 'expresiva', 'argumentativa', 'estética'],
          correctOption: 'directiva',
          hint: 'Da instrucciones u órdenes.'
        },
        {
          id: 9,
          textBefore: 'Los adjetivos ',
          textAfter: ' son la principal pista para descubrir la postura de un autor.',
          options: ['valorativos', 'numerales', 'demostrativos', 'posesivos'],
          correctOption: 'valorativos',
          hint: 'Emiten un juicio, como "terrible" o "excelente".'
        },
        {
          id: 10,
          textBefore: 'Una columna de opinión suele combinar información con la ',
          textAfter: ' personal de quien la escribe.',
          options: ['perspectiva', 'ignorancia', 'objetividad', 'indiferencia'],
          correctOption: 'perspectiva',
          hint: 'El punto de vista del autor.'
        }
      ]
    }
  },
  {
    id: 'sec-3-7',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 7,
    level: 7,
    title: 'Práctica: Detección Rápida',
    introduccion: 'Lee la frase y selecciona el tono correcto lo más rápido posible.',
    datos_claves: [
      'No lo pienses demasiado, guíate por el adjetivo o verbo clave.'
    ],
    isPractice: true,
    practiceType: 'rapid',
    test: {
      id: 'test-3-7',
      seccionId: 'sec-3-7',
      contexto_base: null,
      preguntas: [
        {
          id: 30701,
          enunciado: 'Lee la siguiente frase: "¡Esto es un atropello a nuestros derechos!". ¿Qué tono predomina?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Indignado.', B: 'Neutral.', C: 'Triste.', D: 'Humorístico.' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Hay un reclamo fuerte y evidente indignación.',
          feedback_error: 'Nota que es una exclamación de protesta por un "atropello".'
        },
        {
          id: 30702,
          enunciado: 'Lee la frase: "Quizás, con el tiempo, todo mejore". ¿Cuál es el tono del emisor?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Pesimista.', B: 'Irónico.', C: 'Esperanzado.', D: 'Autoritario.' },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Mira hacia el futuro con positividad ("todo mejore").',
          feedback_error: 'La palabra clave es "mejore". No hay negatividad ni burla.'
        },
        {
          id: 30703,
          enunciado: '¿Qué tono se percibe en: "El 40% de los mamíferos tiene hábitos nocturnos"?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Objetivo.', B: 'Crítico.', C: 'Emocionado.', D: 'Pesimista.' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Solo entrega un dato sin juicios ni emociones.',
          feedback_error: 'El emisor no expresa opiniones ni sentimientos, solo un porcentaje.'
        },
        {
          id: 30704,
          enunciado: 'Identifica el tono en: "Qué brillante tu idea de no traer paraguas a Londres en otoño".',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Entusiasta.', B: 'Irónico.', C: 'Compasivo.', D: 'Informativo.' },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Dice "brillante" para significar exactamente lo contrario.',
          feedback_error: 'Es obvio que llevar un paraguas a Londres es necesario. Llamar "brillante" a no llevarlo es una burla.'
        },
        {
          id: 30705,
          enunciado: '¿Cuál es el tono de esta oración?: "¡Lo logramos, por fin somos los campeones indiscutidos!"',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Melancólico.', B: 'Eufórico.', C: 'Sereno.', D: 'Dudoso.' },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Refleja una alegría extrema y desbordante.',
          feedback_error: 'Las exclamaciones y la frase "por fin" denotan mucha alegría.'
        },
        {
          id: 30706,
          enunciado: 'Lee la frase: "Lamentablemente, ya no queda nada más por hacer para salvar el proyecto". ¿Qué tono predomina?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Esperanzado.', B: 'Resignado.', C: 'Agresivo.', D: 'Optimista.' },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El emisor acepta la derrota y la imposibilidad de cambiar la situación.',
          feedback_error: 'Empieza con "lamentablemente" y asume que "no queda nada más por hacer".'
        },
        {
          id: 30707,
          enunciado: 'Identifica la postura del emisor: "No me parece que la solución propuesta sea la adecuada para este problema".',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Crítica.', B: 'Admirativa.', C: 'Indiferente.', D: 'Eufórica.' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! El emisor evalúa negativamente la solución.',
          feedback_error: 'El emisor está expresando un juicio negativo sobre la idea ("no es adecuada").'
        },
        {
          id: 30708,
          enunciado: '¿Qué tono tiene la frase: "Me parte el alma ver a tantos niños en situación de abandono"?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Sarcástico.', B: 'Compasivo.', C: 'Neutro.', D: 'Incrédulo.' },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Expresa pena y empatía por el sufrimiento de otros.',
          feedback_error: 'La expresión "me parte el alma" indica un profundo dolor empático.'
        },
        {
          id: 30709,
          enunciado: '¿Cuál es el tono predominante en: "A partir de mañana, nadie podrá ingresar a la planta después de las 8:00 AM"?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Dudoso.', B: 'Melancólico.', C: 'Autoritario.', D: 'Esperanzado.' },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Imparte una regla de forma directa y sin lugar a dudas.',
          feedback_error: 'Está dando una orden o regla estricta de manera definitiva.'
        },
        {
          id: 30710,
          enunciado: 'Lee la frase: "Cómo extraño aquellos largos veranos jugando en el patio trasero de la casa de mis abuelos". El tono es:',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Optimista.', B: 'Nostálgico.', C: 'Indignado.', D: 'Irónico.' },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Hay un recuerdo afectuoso y un sentimiento de pérdida del pasado.',
          feedback_error: 'La palabra "extraño" y recordar el pasado con cariño es la definición de este sentimiento.'
        }
      ]
    }
  },
  {
    id: 'sec-3-8',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 8,
    level: 8,
    title: 'Práctica: Intención y Postura',
    introduccion: 'Demuestra lo aprendido con este test de alternativas tipo PAES.',
    datos_claves: [ 'Lee el texto completo antes de decidir la postura.' ],
    isPractice: true,
    test: {
      id: 'test-3-8',
      seccionId: 'sec-3-8',
      contexto_base: null,
      preguntas: [
        {
          id: 3081,
          enunciado: 'Lee el siguiente fragmento: "Las absurdas políticas de esta municipalidad nos llevarán a la ruina en menos de un año". ¿Cuál es la actitud del emisor?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Objetiva.',
            B: 'Crítica y pesimista.',
            C: 'Reflexiva y calmada.',
            D: 'Irónica y burlona.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Los términos "absurdas" y "ruina" denotan crítica profunda y pesimismo.',
          feedback_error: 'Nota las palabras "absurdas" (crítica) y "ruina" (pesimismo).'
        },
        {
          id: 3082,
          enunciado: 'En una carta al director sobre la tala de árboles urbanos, el emisor dice: "Es imperativo detener esta masacre verde". Su propósito es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Informar sobre el número de árboles.',
            B: 'Educar sobre botánica.',
            C: 'Denunciar y exigir acción urgente.',
            D: 'Agradecer a la municipalidad.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! "Imperativo" y "masacre" son llamados a la acción y denuncia.',
          feedback_error: 'La palabra "masacre" indica una denuncia grave.'
        },
        {
          id: 3083,
          enunciado: 'Lee la frase: "Quizás deberíamos considerar otras alternativas antes de tomar una decisión definitiva". ¿Qué actitud demuestra el emisor?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Autoritaria y dominante.',
            B: 'Reflexiva y cautelosa.',
            C: 'Indiferente y apática.',
            D: 'Irónica y burlesca.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Propone pensar antes de actuar de forma calmada.',
          feedback_error: 'El uso del "quizás" y el deseo de "considerar otras alternativas" indican reflexión y cautela.'
        },
        {
          id: 3084,
          enunciado: 'Un texto comienza así: "¡Por fin hemos logrado lo imposible, el esfuerzo ha rendido sus merecidos frutos!". El propósito del autor es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Exigir mayores recompensas.',
            B: 'Criticar a quienes dudaron del proyecto.',
            C: 'Informar objetivamente sobre un suceso.',
            D: 'Expresar júbilo y celebrar un éxito.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Correcto! El tono exclamativo y palabras como "logrado" demuestran un sentimiento de euforia.',
          feedback_error: 'No se mencionan críticas a otros, sino pura celebración del logro obtenido.'
        },
        {
          id: 3085,
          enunciado: '¿Cuál es la intención de un autor que afirma: "Resulta fascinante observar cómo las hormigas estructuran su sociedad de manera tan perfecta"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Generar admiración e interés por un fenómeno natural.',
            B: 'Denunciar el comportamiento humano comparándolo con insectos.',
            C: 'Persuadir para que se proteja a los insectos.',
            D: 'Burlarse de los estudios científicos.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! La palabra "fascinante" busca contagiar ese asombro al lector.',
          feedback_error: 'No hay ninguna queja ni mención sobre humanos o sobre protección, solo admiración.'
        },
        {
          id: 3086,
          enunciado: 'El emisor declara: "Acepto mi derrota, ya no hay esperanza de que este proyecto pueda salvarse". ¿Cuál es su postura?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desafiante.',
            B: 'Esperanzada.',
            C: 'Resignada y derrotista.',
            D: 'Melancólica.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Reconoce abiertamente que no hay más que hacer.',
          feedback_error: 'Asume la pérdida y afirma que "ya no hay esperanza", lo que indica resignación pura.'
        },
        {
          id: 3087,
          enunciado: 'Al leer: "Claro, porque dejar la comida fuera del refrigerador en pleno verano fue tu idea más brillante", la actitud del emisor es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Compasiva y empática.',
            B: 'Sarcástica y crítica.',
            C: 'Objetiva y científica.',
            D: 'Nostálgica.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Usa la palabra "brillante" para referirse a algo evidentemente malo, siendo sarcástico.',
          feedback_error: 'Se está burlando de una mala decisión usando palabras opuestas ("brillante") a la realidad.'
        },
        {
          id: 3088,
          enunciado: '¿Qué propósito cumple esta oración en un manual: "Asegúrese de desconectar el equipo antes de proceder a la limpieza"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Criticar a los usuarios descuidados.',
            B: 'Instruir y prevenir un riesgo de seguridad.',
            C: 'Entretener con una anécdota de reparación.',
            D: 'Informar sobre las características del equipo.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Es una orden o advertencia típica de textos instructivos.',
          feedback_error: 'Los manuales buscan dar instrucciones claras; en este caso, es una advertencia de seguridad.'
        },
        {
          id: 3089,
          enunciado: 'El emisor dice: "Es intolerable que sigamos permitiendo que las grandes empresas contaminen nuestros ríos sin ninguna consecuencia". La postura predominante es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Nostálgica.',
            B: 'Indignada.',
            C: 'Esperanzada.',
            D: 'Indiferente.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Palabras como "intolerable" y el reclamo por la falta de consecuencias expresan un fuerte rechazo.',
          feedback_error: 'La palabra "intolerable" y el reclamo por la impunidad son la marca textual de la indignación.'
        },
        {
          id: 30810,
          enunciado: 'Un político declara: "Si votan por mí, les aseguro que el desempleo bajará a cero en mi primer mes". Su propósito principal es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Exponer un plan económico detallado.',
            B: 'Persuadir a los votantes mediante una promesa grandilocuente.',
            C: 'Informar sobre las estadísticas de empleo.',
            D: 'Denunciar a la oposición.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Intenta convencer a la audiencia prometiendo un resultado (muy probablemente exagerado).',
          feedback_error: 'No hay detalles económicos ni ataques; es puramente una promesa persuasiva para ganar votos.'
        }
      ]
    }
  },
  {
    id: 'sec-3-8b',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 8.5,
    level: 8.5,
    title: 'Intención',
    introduccion: 'Lee el siguiente texto y responde las preguntas evaluando la postura del emisor.',
    datos_claves: [ 'Identifica la tesis y la emoción predominante.' ],
    test: {
      id: 'test-3-8b',
      seccionId: 'sec-3-8b',
      contexto_base: 'Señor Director:\n\nEs incomprensible que, a estas alturas del siglo XXI, nuestra comuna siga sin contar con un sistema de reciclaje eficiente. Mientras las ciudades vecinas han implementado camiones especiales y contenedores clasificados, nosotros seguimos amontonando todo en la misma bolsa negra.\n\nLa pasividad de las autoridades locales frente a esto es alarmante. No solo están ignorando una crisis ecológica global que ya golpea a nuestro país con intensas sequías, sino que están demostrando una falta total de visión de futuro. Hace apenas dos meses, el alcalde prometió en campaña un "municipio verde", pero hasta hoy no se ha instalado ni un solo punto limpio en los barrios periféricos. Esta contradicción entre el discurso y la acción no hace más que decepcionar profundamente a la ciudadanía.\n\nEl problema no es la falta de recursos, como nos quieren hacer creer. Diversos estudios han demostrado que el reciclaje municipal se autofinancia a mediano plazo mediante la venta de materiales reutilizables a empresas procesadoras. Lo que realmente falta es voluntad política y compromiso con las nuevas generaciones. Es hora de exigir un cambio real, organizarnos como vecinos y dejar atrás estas políticas obsoletas que nos anclan al pasado.',
      preguntas: [
        {
          id: 30881,
          enunciado: '¿Cuál es el propósito principal del emisor en esta carta al director?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Informar sobre los nuevos sistemas de reciclaje de las ciudades vecinas.',
            B: 'Explicar cómo funciona la crisis ecológica global.',
            C: 'Criticar la inacción de las autoridades frente al reciclaje y exigir un cambio.',
            D: 'Agradecer a las nuevas generaciones por su compromiso.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! El texto es un claro reclamo ("Es incomprensible", "pasividad alarmante") dirigido a las autoridades.',
          feedback_error: 'Nota las expresiones valorativas negativas ("incomprensible", "pasividad alarmante"). El emisor no está simplemente informando, está reclamando.'
        },
        {
          id: 30882,
          enunciado: '¿Qué postura asume el emisor frente al accionar de su propia comuna?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indignada y crítica.',
            B: 'Melancólica y reflexiva.',
            C: 'Neutral y objetiva.',
            D: 'Esperanzada y paciente.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! Las palabras clave como "alarmante" y "obsoletas" denotan indignación y una fuerte crítica.',
          feedback_error: 'El emisor dice "es hora de exigir un cambio real". No hay paciencia ni neutralidad, hay frustración.'
        },
        {
          id: 30883,
          enunciado: '¿Qué intención tiene el emisor al mencionar la promesa de campaña del alcalde?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Elogiar los esfuerzos medioambientales de la municipalidad.',
            B: 'Evidenciar la contradicción entre el discurso político y las acciones reales.',
            C: 'Informar sobre los resultados de las últimas elecciones locales.',
            D: 'Exigir la renuncia inmediata de las autoridades.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Menciona la promesa incumplida para resaltar la hipocresía o contradicción.',
          feedback_error: 'La frase "Esta contradicción entre el discurso y la acción" te da la clave de su intención.'
        },
        {
          id: 30884,
          enunciado: '¿Cuál es la actitud del emisor al afirmar que "el problema no es la falta de recursos, como nos quieren hacer creer"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Resignada.',
            B: 'Dubitativa y analítica.',
            C: 'Confrontacional y reivindicativa.',
            D: 'Optimista y esperanzada.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Desafía la versión oficial con firmeza, demostrando una postura de confrontación.',
          feedback_error: 'Al decir "como nos quieren hacer creer", está desafiando directamente la versión oficial.'
        },
        {
          id: 30885,
          enunciado: '¿Qué sentimiento busca generar el autor en los vecinos al decir "Es hora de exigir un cambio real, organizarnos como vecinos"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Miedo ante la crisis ecológica.',
            B: 'Motivación para la acción colectiva.',
            C: 'Resignación frente a la ineficacia del alcalde.',
            D: 'Tristeza por el estado de las ciudades vecinas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Busca movilizar y motivar a sus pares.',
          feedback_error: 'Llamar a "exigir" y "organizarnos" es un claro llamado a la acción.'
        },
        {
          id: 30886,
          enunciado: '¿Qué función cumple la mención de las "intensas sequías" en el texto?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Explicar científicamente el cambio climático.',
            B: 'Ejemplificar las consecuencias reales y locales de la crisis ecológica global.',
            C: 'Justificar la falta de recursos del municipio.',
            D: 'Criticar a los vecinos por gastar demasiada agua.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Aterriza un problema global ("crisis ecológica") a una realidad cercana ("sequías").',
          feedback_error: 'Se usa para mostrar cómo la crisis global ya está "golpeando a nuestro país".'
        }
      ]
    }
  },
  {
    id: 'sec-3-9',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 9,
    level: 9,
    title: 'Calidad y Falacias',
    introduccion: 'Evalúa si los argumentos del autor son sólidos o si son trampas lógicas.',
    datos_claves: [
      'Falacia: Argumento que parece válido pero es falso.',
      'Pertinencia: El argumento debe estar relacionado con la tesis.'
    ],
    tags: [ 'subcapitulo:Juzgar la Calidad de la Información' ],
    isProTip: true,
    guia_titulo: 'Calidad y Falacias',
    guia_contenido: '<ul><li><strong>⚖️ Pertinencia:</strong> Un argumento es **pertinente** si va al punto. Si se discute sobre economía, hablar de lo lindo que es el edificio del ministerio es *impertinente*.</li><li><strong>⚠️ Suficiencia y Falacias:</strong> ¿Da pruebas suficientes? Usar una anécdota de un solo vecino para probar una teoría nacional es **Generalización Apresurada** (falacia de suficiencia).</li></ul>'
  },
  {
    id: 'sec-3-10',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 10,
    level: 10,
    title: 'Práctica: ¿Es pertinente?',
    introduccion: 'Determina si el argumento es pertinente (True) o irrelevante (False) a la discusión.',
    datos_claves: [ 'Pregúntate: ¿esto apoya directamente la idea central?' ],
    isPractice: true,
    practiceType: 'true-false',
    practiceData: {
      items: [
        {
          statement: 'Tesis: "Los autos eléctricos son mejores para el medio ambiente." Argumento: "Tienen un diseño más futurista que los autos a combustión."',
          isTrue: false,
          feedback: 'Falso. El diseño estético del vehículo no tiene relación alguna con su impacto medioambiental (como reducir emisiones de CO2).'
        },
        {
          statement: 'Tesis: "Fumar causa daño pulmonar crónico." Argumento: "El alquitrán se acumula en los alveolos y destruye el tejido respiratorio."',
          isTrue: true,
          feedback: 'Verdadero. Apoya directamente la tesis clínica sobre el daño a los pulmones.'
        },
        {
          statement: 'Tesis: "Se debe fomentar el uso de la bicicleta en la ciudad." Argumento: "Las bicicletas estáticas de los gimnasios son muy modernas."',
          isTrue: false,
          feedback: 'Falso. Hablar del equipamiento de los gimnasios es irrelevante para el transporte urbano.'
        },
        {
          statement: 'Tesis: "El reciclaje de plástico reduce la contaminación oceánica." Argumento: "El plástico tarda más de 500 años en degradarse en el agua."',
          isTrue: true,
          feedback: 'Verdadero. La lentitud de la degradación es la razón principal de por qué el plástico contamina tanto tiempo el océano.'
        },
        {
          statement: 'Tesis: "La empresa debe aumentar los sueldos a sus trabajadores." Argumento: "El jefe acaba de comprarse un auto deportivo carísimo."',
          isTrue: false,
          feedback: 'Falso. Es un ataque personal (Ad Hominem) a la riqueza del jefe; no demuestra por qué el trabajo de los empleados vale más.'
        },
        {
          statement: 'Tesis: "Consumir demasiada azúcar provoca obesidad infantil." Argumento: "El azúcar aumenta drásticamente el aporte calórico sin entregar nutrientes esenciales."',
          isTrue: true,
          feedback: 'Verdadero. Es un argumento médico y nutricional pertinente a la tesis.'
        },
        {
          statement: 'Tesis: "Las energías renovables crearán miles de empleos." Argumento: "Los paneles solares son de un color azul muy estético."',
          isTrue: false,
          feedback: 'Falso. La estética de los paneles no tiene ninguna relación lógica con el mercado laboral o la creación de empleos.'
        },
        {
          statement: 'Tesis: "Debe prohibirse el uso de celulares durante las clases." Argumento: "Estudios demuestran que las notificaciones reducen la concentración en un 40%."',
          isTrue: true,
          feedback: 'Verdadero. La pérdida de concentración es un argumento pedagógico totalmente pertinente a la prohibición.'
        },
        {
          statement: 'Tesis: "El transporte público debe ser gratuito." Argumento: "Los buses actuales tienen asientos muy incómodos."',
          isTrue: false,
          feedback: 'Falso. La comodidad de los asientos es un problema de calidad del servicio, no justifica que el servicio deba dejar de cobrarse.'
        },
        {
          statement: 'Tesis: "La lectura temprana mejora el vocabulario de los niños." Argumento: "Los niños expuestos a libros desde los 2 años reconocen un 30% más de palabras al ingresar al colegio."',
          isTrue: true,
          feedback: 'Verdadero. Es un dato estadístico que respalda directamente el efecto de la lectura en el vocabulario.'
        }
      ]
    }
  },
  {
    id: 'sec-3-11',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 11,
    level: 11,
    title: 'ProTip: Detectar Sesgos',
    introduccion: 'Cuidado con los textos que ocultan información.',
    datos_claves: [ 'Un texto sin contraargumentos fuertes suele estar sesgado.' ],
    isProTip: true,
    guia_titulo: 'El Sesgo por Omisión',
    guia_contenido: 'Si un autor defiende una medida polémica pero **no menciona** ninguna desventaja obvia, su calidad informativa es baja por tener "sesgo de omisión". ¡Duda de la perfección absoluta!'
  },
  {
    id: 'sec-3-12',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 12,
    level: 12,
    title: 'Práctica: ¿Falacia o Válido?',
    introduccion: 'Clasifica los siguientes argumentos en Válidos o Falacias.',
    datos_claves: [
      'Las falacias atacan a la persona (ad hominem) o exageran (pendiente resbaladiza).'
    ],
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      categories: [ 'Válido', 'Falacia' ],
      items: [
        {
          text: 'Estudio de Oxford afirma que reducir azúcares baja el riesgo cardíaco.',
          category: 'Válido'
        },
        {
          text: 'Ese político es un ignorante, su ley de presupuesto no sirve.',
          category: 'Falacia'
        },
        {
          text: 'Si legalizan esto, mañana todos seremos criminales y el país arderá.',
          category: 'Falacia'
        },
        {
          text: 'Datos históricos muestran que la inflación afecta más a los pobres.',
          category: 'Válido'
        },
        {
          text: 'Deberíamos prohibir las motocicletas, a mi prima la asaltó uno en moto.',
          category: 'Falacia'
        },
        {
          text: 'Según la OMS, la actividad física diaria previene enfermedades cardiovasculares.',
          category: 'Válido'
        },
        {
          text: 'Nadie ha podido probar que los extraterrestres no existen, por lo tanto, existen.',
          category: 'Falacia'
        },
        {
          text: 'El reporte ministerial indica que la asistencia escolar subió un 12% tras la medida.',
          category: 'Válido'
        },
        {
          text: 'No confíes en lo que dice ese nutricionista sobre dietas, ¡mira lo gordo que está!',
          category: 'Falacia'
        },
        {
          text: 'El calentamiento global es real porque el 97% de los climatólogos lo confirma con evidencia.',
          category: 'Válido'
        }
      ]
    }
  },
  {
    id: 'sec-3-13',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 13,
    level: 13,
    title: 'Práctica: Estructura del Argumento',
    introduccion: 'Ordena los pasos de este argumento real. Empieza desde la afirmación principal hasta la evidencia que la respalda.',
    datos_claves: [ 'La estructura es: Tesis → Base → Garantía → Respaldo.' ],
    isPractice: true,
    practiceType: 'sort',
    practiceData: {
      title: 'Ordena el Argumento',
      description: 'Arrastra cada pieza del argumento al orden correcto, desde la idea general hasta la evidencia específica.',
      items: [
        { id: 1, text: 'Tesis: "Las ciudades deberían prohibir los vehículos de combustión interna en sus centros históricos."' },
        { id: 2, text: 'Base: Porque los motores a gasolina emiten gases que deterioran la calidad del aire urbano.' },
        { id: 3, text: 'Garantía: Se asume que reducir la contaminación del aire mejora la salud pública y la calidad de vida.' },
        { id: 4, text: 'Respaldo: La OMS certifica que el material particulado PM2.5 está vinculado a 7 millones de muertes anuales.' }
      ]
    }
  },
  {
    id: 'sec-3-14',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 14,
    level: 14,
    title: 'Consistencia Interna',
    introduccion: 'Aprende a detectar contradicciones en un texto.',
    datos_claves: [ 'Consistencia: Cuando el autor no se contradice.' ],
    isProTip: true,
    guia_titulo: 'Consistencia Interna',
    guia_contenido: '<ul><li><strong>🔄 La Inconsistencia:</strong> Si el autor defiende la **igualdad total** en el párrafo uno, pero en el último justifica un **privilegio exclusivo** para un grupo, el texto pierde calidad por **inconsistencia**.</li></ul>'
  },
  {
    id: 'sec-3-15',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 15,
    level: 15,
    title: 'Práctica: Detección Rápida',
    introduccion: 'Identifica rápido si es una opinión fundamentada o una falacia.',
    datos_claves: [ 'Fíjate si ataca el problema o a la persona.' ],
    isPractice: true,
    practiceType: 'rapid',
    test: {
      id: 'test-3-15',
      seccionId: 'sec-3-15',
      contexto_base: null,
      preguntas: [
        {
          id: 31501,
          enunciado: 'No le creas a ese doctor, tiene el pelo teñido.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Falacia', B: 'Válido' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Es una falacia Ad Hominem (ataque personal irrelevante).',
          feedback_error: 'Descartar una idea por la apariencia o vida personal es una falacia (Ad Hominem).'
        },
        {
          id: 31502,
          enunciado: 'La baja de ventas se debe a la crisis mundial confirmada por el FMI.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Válido', B: 'Falacia' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Cita una fuente económica reconocida para explicar el hecho.',
          feedback_error: 'Apoyarse en datos oficiales del FMI le da validez al argumento.'
        },
        {
          id: 31503,
          enunciado: 'Si dejamos que los empleados lleguen cinco minutos tarde, pronto todos llegarán cuando quieran y la empresa colapsará.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Falacia', B: 'Válido' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Es una Pendiente Resbaladiza (exagerar consecuencias sin base lógica).',
          feedback_error: 'Encadenar consecuencias extremas sin prueba lógica es una falacia (Pendiente Resbaladiza).'
        },
        {
          id: 31504,
          enunciado: 'Un estudio de la UNICEF muestra que el 60% de los niños sin desayuno rinden peor académicamente.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Válido', B: 'Falacia' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Presenta evidencia cuantitativa verificable de un organismo oficial.',
          feedback_error: 'Los datos estadísticos comprobables sustentan válidamente la afirmación.'
        },
        {
          id: 31505,
          enunciado: 'Mi abuelo fumó toda su vida y vivió hasta los 95, así que fumar no es tan malo.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Falacia', B: 'Válido' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Generalización apresurada a partir de un solo caso anécdotico.',
          feedback_error: 'Un caso aislado no contradice la evidencia médica general (Generalización Apresurada).'
        },
        {
          id: 31506,
          enunciado: 'No puedes opinar sobre crianza si no tienes hijos.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Falacia', B: 'Válido' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Ataca la condición personal de quien opina en vez de evaluar la idea.',
          feedback_error: 'Descalificar la opinión por las características de quien habla es una falacia Ad Hominem.'
        },
        {
          id: 31507,
          enunciado: 'Todos los expertos en nutrición recomiendan reducir el consumo de grasas trans.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Válido', B: 'Falacia' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Se basa en un amplio consenso científico especialista.',
          feedback_error: 'El consenso de la comunidad experta fundamenta adecuadamente la recomendación.'
        },
        {
          id: 31508,
          enunciado: 'Como mi vecino dejó de beber café y adelgazó, el café engorda.',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Falacia', B: 'Válido' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Asume falsa relación de causa-efecto por coincidencia o caso único.',
          feedback_error: 'Una coincidencia individual no demuestra causalidad general.'
        }
      ]
    }
  },
  {
    id: 'sec-3-16',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 16,
    level: 16,
    title: 'Test: Juzgar Información',
    introduccion: 'Test oficial sobre evaluación de calidad y falacias.',
    datos_claves: [ 'Piensa fríamente si la evidencia respalda la conclusión.' ],
    isPractice: true,
    test: {
      id: 'test-3-16',
      seccionId: 'sec-3-16',
      contexto_base: null,
      preguntas: [
        {
          id: 3161,
          enunciado: 'Un autor argumenta: "No debemos escuchar la propuesta del Ministro sobre educación porque él nunca fue a la universidad". ¿Qué error comete?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ninguno, es un buen punto.',
            B: 'Ataca a la persona en lugar de analizar su propuesta educativa.',
            C: 'Da un dato irrelevante sobre las universidades.',
            D: 'Exagera el futuro.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Es una clásica falacia Ad Hominem.',
          feedback_error: 'Descartar una idea atacando la historia personal de quien la dice es una falacia (Ad Hominem).'
        },
        {
          id: 3162,
          enunciado: 'Si un texto exige "tolerancia absoluta para todos", pero luego pide "prohibir la entrada de extranjeros", su argumentación presenta:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Alta solidez lógica.',
            B: 'Excelente uso de recursos retóricos.',
            C: 'Inconsistencia interna (contradicción).',
            D: 'Falta de fuentes bibliográficas.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Hay una clara contradicción entre ambas frases.',
          feedback_error: 'Pedir inclusión total y luego pedir exclusión es contradecirse a sí mismo.'
        },
        {
          id: 3163,
          enunciado: 'Un columnista argumenta que \"hay que bajar los impuestos porque mi contador me cobra demasiado\". ¿Cuál es el problema principal de este argumento?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es pertinente, porque un contador es un experto financiero.',
            B: 'Es insuficiente: extrapola una experiencia personal a una política fiscal nacional.',
            C: 'Es un ataque personal hacia los contadores del país.',
            D: 'No hay problema: es un argumento válido y bien fundamentado.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Un caso individual no justifica una política económica. Es evidencia anecdótica e insuficiente.',
          feedback_error: 'Para apoyar una propuesta fiscal, se necesitan datos macroeconómicos, no experiencias personales.'
        },
        {
          id: 3164,
          enunciado: 'Una empresa farmacéutica publica un estudio que concluye que su propio medicamento es el más efectivo del mercado. ¿Cuál es el principal problema de calidad de esta fuente?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ninguno: las empresas farmacéuticas siempre son objetivas.',
            B: 'El estudio es demasiado largo para leerlo completo.',
            C: 'Presenta un conflicto de interés: el evaluador se beneficia del resultado.',
            D: 'El medicamento no fue probado en suficientes países.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Un estudio financiado por quien se beneficia de sus resultados es una fuente sesgada.',
          feedback_error: 'Si el vendedor evalúa su propio producto, hay un conflicto de interés claro que afecta la objetividad.'
        },
        {
          id: 3165,
          enunciado: 'En un debate sobre el calentamiento global, alguien dice: \"El 97% de los científicos climáticos avalan la evidencia del cambio climático\". ¿Cómo juzgas la calidad de este argumento?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Inválido, porque no cita el nombre de los científicos específicos.',
            B: 'Válido y suficiente: el consenso científico masivo es una forma robusta de evidencia.',
            C: 'Inválido: el 3% restante podría tener la razón.',
            D: 'Solo parcialmente válido si se adjuntan todas las firmas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! El consenso científico abrumador es uno de los más altos estándares de evidencia disponibles.',
          feedback_error: 'Un 97% de consenso en una disciplina científica es una evidencia extraordinariamente sólida.'
        },
        {
          id: 3166,
          enunciado: 'En un texto sobre contaminación del río, el autor afirma: \"La contaminación industrial es el único factor que destruye la vida acuática\". ¿Qué problema presenta esta afirmación?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es completamente falsa, ya que la industria no contamina ríos.',
            B: 'Tiene sesgo de omisión: ignora otros factores reales como la agricultura y las aguas servidas.',
            C: 'No presenta ningún problema; está correctamente afirmada.',
            D: 'El problema es que usa un lenguaje demasiado técnico para el lector promedio.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Decir que algo es el \"único\" factor es una generalización extrema que omite evidencia contraria.',
          feedback_error: 'Las palabras absolutas como \"único\" son señales de alerta. La contaminación agrícola y urbana también destruye ecosistemas.'
        },
        {
          id: 3167,
          enunciado: '¿Cuál de las siguientes opciones es el argumento de mayor calidad para apoyar la tesis \"El ejercicio mejora la salud mental\"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Mi amiga empezó a correr y ahora es más feliz.',
            B: 'Muchos famosos hacen deporte y parecen contentos.',
            C: 'Un meta-análisis de 200 estudios clínicos muestra que el ejercicio reduce síntomas depresivos en un 40%.',
            D: 'Los gimnasios están llenos de gente sonriente.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Un meta-análisis agrupa cientos de estudios y es el nivel más alto de evidencia científica disponible.',
          feedback_error: 'Las observaciones personales y las impresiones visuales son evidencia anecdótica y débil.'
        },
        {
          id: 3168,
          enunciado: 'Lee el siguiente argumento: \"Si el gobierno puede controlar qué comemos, mañana controlará qué pensamos, y pasado mañana habremos perdido toda libertad\". ¿Qué falacia se comete?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Generalización apresurada.',
            B: 'Ad Hominem.',
            C: 'Apelación a la autoridad.',
            D: 'Pendiente resbaladiza.'
          },
          respuesta_correcta: 'D',
          feedback_acierto: '¡Correcto! Es la clásica Pendiente Resbaladiza: asumir que una acción menor llevará inevitablemente a consecuencias extremas.',
          feedback_error: 'La cadena de consecuencias exageradas (controlar comida → controlar pensamientos → perder toda libertad) define la Pendiente Resbaladiza.'
        }
      ]
    }
  },
  {
    id: 'sec-3-16b',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 16.5,
    level: 16.5,
    title: 'Calidad',
    introduccion: 'Evalúa la validez de los argumentos en esta columna de opinión.',
    datos_claves: [ 'Busca generalizaciones apresuradas o ataques personales.' ],
    test: {
      id: 'test-3-16b',
      seccionId: 'sec-3-16b',
      contexto_base: 'He leído con asombro la propuesta de algunos diputados de reducir la jornada laboral a cuatro días semanales. Quienes proponen esto claramente no tienen idea de cómo funciona la economía real, pues la mayoría son políticos de carrera que jamás han administrado una empresa ni han pagado sueldos de su propio bolsillo.\n\nAdemás, si permitimos que la gente trabaje menos, pronto empezarán a exigir trabajar tres días, luego dos, y finalmente nadie querrá trabajar en absoluto, llevando a nuestro país a la más absoluta miseria y quiebra. Es evidente que esta medida es un desastre anunciado. Como prueba indiscutible de ello, mi vecino, que es dueño de una pequeña panadería de barrio, me comentó ayer que si aprueban esta ley tendrá que cerrar su negocio de forma inmediata. Si a él le pasa, es cien por ciento seguro que a todas las empresas del país les ocurrirá exactamente lo mismo.\n\nPor otro lado, los defensores de la ley citan repetidamente un estudio de Islandia donde la productividad aumentó. Sin embargo, todos sabemos que los países nórdicos son fríos, grises y aburridos, por lo que la gente allí no tiene nada mejor que hacer con su tiempo que trabajar duro durante sus cuatro días. Compararnos con ellos es un despropósito absoluto que ofende la inteligencia de los chilenos.',
      preguntas: [
        {
          id: 31661,
          enunciado: 'Al afirmar que quienes proponen la ley "jamás han administrado una empresa", el autor incurre en una falacia porque:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es imposible comprobar el historial laboral de los diputados.',
            B: 'Desvía el debate atacando la experiencia personal de los políticos (Ad Hominem) en lugar de refutar los méritos de la propuesta.',
            C: 'Demuestra que él es un experto en economía.',
            D: 'No entrega datos exactos sobre la cantidad de horas trabajadas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Atacar las credenciales de quien habla, sin rebatir sus ideas, es una falacia Ad Hominem.',
          feedback_error: 'Fíjate que el autor nunca explica por qué la propuesta económica es mala; solo dice que los políticos no saben nada porque no tienen empresas.'
        },
        {
          id: 31662,
          enunciado: 'La afirmación "pronto empezarán a exigir trabajar tres días... y finalmente nadie querrá trabajar" corresponde a un argumento de tipo:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Pendiente resbaladiza (falacia por exageración de consecuencias futuras).',
            B: 'Generalización apresurada (basada en pocos casos).',
            C: 'Deducción lógica y comprobable.',
            D: 'Apelación a la autoridad.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Excelente! Inventar una cadena catastrófica e inevitable a partir de una medida simple es la falacia de Pendiente Resbaladiza.',
          feedback_error: 'El autor lleva una medida (trabajar cuatro días) a un extremo absurdo (nadie trabajará y el país quebrará). Esto es una exageración sin base lógica.'
        },
        {
          id: 31663,
          enunciado: 'Al utilizar el caso de su vecino panadero para concluir que "a todas las empresas del país les ocurrirá exactamente lo mismo", el emisor comete la falacia de:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ad Hominem.',
            B: 'Generalización apresurada.',
            C: 'Falsa analogía.',
            D: 'Apelación a la autoridad.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Tomar un solo caso aislado y aplicarlo a la totalidad de las empresas es una generalización apresurada.',
          feedback_error: 'Tratar de sacar una regla nacional ("todas las empresas del país") basándose en el caso de un solo vecino es generalizar.'
        },
        {
          id: 31664,
          enunciado: '¿Cómo evalúa la pertinencia del argumento de que "los países nórdicos son fríos, grises y aburridos" para refutar el aumento de productividad?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es un argumento muy pertinente, ya que el clima afecta directamente los números económicos.',
            B: 'Es irrelevante e impertinente, ya que no refuta la validez metodológica del estudio citado.',
            C: 'Es el argumento central del texto.',
            D: 'Es una prueba sólida apoyada en datos meteorológicos comprobables.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Atacar el clima de un país no sirve para rebatir un estudio económico sobre productividad.',
          feedback_error: 'El clima o el "aburrimiento" no es un argumento técnico válido para refutar cifras de productividad laboral.'
        },
        {
          id: 31665,
          enunciado: '¿Qué problema de calidad presenta la evidencia de que "mi vecino me comentó ayer que tendrá que cerrar"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es evidencia puramente anecdótica, insuficiente para representar la realidad económica nacional.',
            B: 'Es un dato falso, ya que las panaderías nunca quiebran.',
            C: 'Contradice la postura defendida por el autor en el primer párrafo.',
            D: 'Es una evidencia demasiado técnica y difícil de entender.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Bien evaluado! Las anécdotas personales (evidencia anecdótica) son el nivel más bajo de prueba en argumentación.',
          feedback_error: 'Lo que dice un vecino en una charla informal no constituye un estudio formal o una prueba estadística válida.'
        },
        {
          id: 31666,
          enunciado: 'Si un lector afirma que el texto es "poco objetivo", ¿qué elemento de la lectura respalda mejor esta evaluación?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'El uso de comas y signos de puntuación.',
            B: 'El uso abundante de juicios de valor sin datos duros que los sustenten.',
            C: 'La falta de conocimiento de gramática del autor.',
            D: 'La breve extensión del texto.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Un texto pierde objetividad cuando abusa de opiniones no fundamentadas y adjetivos subjetivos.',
          feedback_error: 'Frases como "ofende la inteligencia", "no tienen idea" o "fríos, grises y aburridos" son juicios de valor sin evidencia dura.'
        }
      ]
    }
  },
  {
    id: 'sec-3-17',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 17,
    level: 17,
    title: 'Forma y Recursos',
    introduccion: 'Evalúa la pertinencia de las decisiones estéticas y retóricas del autor.',
    datos_claves: [
      'Forma: Tipografía, viñetas, colores.',
      'Recursos: Preguntas retóricas, metáforas, ironía.'
    ],
    tags: [ 'subcapitulo:Recursos Visuales y Lingüísticos' ],
    isProTip: true,
    guia_titulo: 'Forma y Recursos',
    guia_contenido: '<ul><li><strong>🎨 Elementos No Lingüísticos:</strong> Imágenes, gráficos de barras o colores no están de adorno. Siempre cumplen una función: **complementar**, **demostrar con datos** o **apelar a la emoción** del lector.</li><li><strong>🎭 Recursos Lingüísticos:</strong> Una metáfora ("es un cáncer social") no se usa porque sí; busca dramatizar e impactar. Una pregunta retórica ("¿hasta cuándo aguantaremos?") busca involucrar y hacer pensar.</li></ul>'
  },
  {
    id: 'sec-3-18',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 18,
    level: 18,
    title: 'Práctica: Une el Recurso',
    introduccion: 'Empareja cada recurso con su función principal en el texto.',
    datos_claves: [ 'Piensa: ¿qué efecto busca causar este recurso en quien lee?' ],
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Recursos y Funciones',
      description: 'Une el recurso con su propósito comunicativo.',
      rounds: [
        {
          pairs: [
            {
              id: 1,
              left: 'Gráfico de Torta',
              right: 'Mostrar porcentajes de un total',
              hint: 'Divide visualmente un todo en porciones.'
            },
            {
              id: 2,
              left: 'Pregunta Retórica',
              right: 'Involucrar emocionalmente al lector',
              hint: 'No espera una respuesta real.'
            },
            {
              id: 3,
              left: 'Negritas',
              right: 'Destacar los conceptos clave',
              hint: 'Resalta visualmente lo más importante.'
            },
            {
              id: 4,
              left: 'Metáfora',
              right: 'Dramatizar e impactar con una comparación',
              hint: 'Compara sin usar "como" o "tal como".'
            }
          ]
        },
        {
          pairs: [
            {
              id: 5,
              left: 'Ironía',
              right: 'Decir lo opuesto para criticar o burlarse',
              hint: 'El significado real es contrario a lo dicho.'
            },
            {
              id: 6,
              left: 'Fotografía emotiva',
              right: 'Conmover al lector apelando a emociones',
              hint: 'Recurso visual de apelación afectiva.'
            },
            {
              id: 7,
              left: 'Cita de autoridad',
              right: 'Otorgar credibilidad al argumento',
              hint: 'Apoyarse en alguien reconocido.'
            },
            {
              id: 8,
              left: 'Gráfico de Barras',
              right: 'Comparar datos entre categorías',
              hint: 'Cada barra representa una categoría diferente.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 9,
              left: 'Hipérbole',
              right: 'Exagerar deliberadamente para dar énfasis',
              hint: '"Te lo dije mil veces" nadie lo toma literal.'
            },
            {
              id: 10,
              left: 'Cursivas',
              right: 'Destacar términos extranjeros o especiales',
              hint: 'Las separa visualmente del resto del texto.'
            },
            {
              id: 11,
              left: 'Gráfico de Líneas',
              right: 'Mostrar la evolución de un dato en el tiempo',
              hint: 'Ideal para tendencias y cambios históricos.'
            },
            {
              id: 12,
              left: 'Viñetas (•)',
              right: 'Organizar y jerarquizar la información',
              hint: 'Presentan puntos de forma clara y ordenada.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 13,
              left: 'Comillas irónicas ("")',
              right: 'Expresar distancia o escepticismo sobre un término',
              hint: 'El autor duda de la veracidad de esa palabra.'
            },
            {
              id: 14,
              left: 'Color rojo en un afiche',
              right: 'Apelar a emociones fuertes como urgencia o peligro',
              hint: 'El color tiene una función semiótica y emocional.'
            },
            {
              id: 15,
              left: 'Tabla comparativa',
              right: 'Mostrar diferencias y similitudes entre elementos',
              hint: 'Permite comparar datos de forma estructurada.'
            },
            {
              id: 16,
              left: 'Título en mayúsculas',
              right: 'Dar énfasis y urgencia al mensaje',
              hint: 'En texto, las mayúsculas equivalen a gritar.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 17,
              left: 'Uso del "Nosotros"',
              right: 'Generar inclusión y sentido de comunidad',
              hint: 'Involucra al lector como parte del mismo grupo.'
            },
            {
              id: 18,
              left: 'Uso de diminutivos',
              right: 'Generar cercanía afectiva o restar importancia',
              hint: 'Puede sonar cariñoso o menospreciar ("problemitas").'
            },
            {
              id: 19,
              left: 'Analogía',
              right: 'Explicar algo complejo usando algo cotidiano',
              hint: 'Compara dos situaciones distintas con una misma lógica.'
            },
            {
              id: 20,
              left: 'Pregunta directa al lector',
              right: 'Interpelar y exigir una toma de postura',
              hint: 'Se dirige específicamente a ti, rompiendo la cuarta pared.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 21,
              left: 'Enumeración de ejemplos',
              right: 'Acumular evidencia para convencer',
              hint: 'Lista varios casos para demostrar que no es un hecho aislado.'
            },
            {
              id: 22,
              left: 'Adjetivos valorativos',
              right: 'Demostrar la subjetividad y opinión del autor',
              hint: 'Palabras como "terrible", "espléndido", "nefasto".'
            },
            {
              id: 23,
              left: 'Eufemismos',
              right: 'Suavizar una realidad dura o tabú',
              hint: 'Llamar "daños colaterales" a víctimas civiles.'
            },
            {
              id: 24,
              left: 'Personificación',
              right: 'Dar atributos humanos a cosas inanimadas',
              hint: '"El viento aullaba".'
            }
          ]
        },
        {
          pairs: [
            {
              id: 25,
              left: 'Repetición (Anáfora)',
              right: 'Enfatizar una idea grabándola en la memoria',
              hint: 'Insistir repitiendo la misma palabra al inicio.'
            },
            {
              id: 26,
              left: 'Cita de un experto',
              right: 'Dar validación técnica y científica',
              hint: 'Apela a alguien con estudios formales en el área.'
            },
            {
              id: 27,
              left: 'Letra pequeña (asterisco)',
              right: 'Ocultar condiciones desfavorables',
              hint: 'Suele usarse en publicidad engañosa.'
            },
            {
              id: 28,
              left: 'Blanco y negro (imagen)',
              right: 'Transmitir nostalgia, seriedad o dramatismo',
              hint: 'Quita el color para darle un tono solemne o antiguo.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 29,
              left: 'Testimonio personal',
              right: 'Aportar un componente humano y vivencial',
              hint: 'Un relato en primera persona ("A mí me pasó...").'
            },
            {
              id: 30,
              left: 'Signos de exclamación',
              right: 'Transmitir sorpresa, enojo o entusiasmo',
              hint: 'Elevan el volumen visual de la frase.'
            },
            {
              id: 31,
              left: 'Contraste de colores',
              right: 'Resaltar la diferencia entre dos elementos',
              hint: 'Usar colores opuestos (ej. azul/naranja) para destacar.'
            },
            {
              id: 32,
              left: 'Uso de cifras exactas',
              right: 'Aparentar precisión matemática y objetividad innegable',
              hint: 'Decir "43,2%" en lugar de "muchos".'
            }
          ]
        },
        {
          pairs: [
            {
              id: 33,
              left: 'Infografía',
              right: 'Resumir visualmente datos complejos',
              hint: 'Combina texto corto, iconos y gráficos.'
            },
            {
              id: 34,
              left: 'Sarcasmo',
              right: 'Criticar de manera hiriente bajo un tono de humor',
              hint: 'Es una ironía pesada y burlesca.'
            },
            {
              id: 35,
              left: 'Elipsis (omisión)',
              right: 'Dejar que el lector deduzca la información',
              hint: 'Saltarse detalles para agilizar o crear misterio.'
            },
            {
              id: 36,
              left: 'Uso de imperativos',
              right: 'Incitar directamente a la acción',
              hint: 'Verbos como "¡Compra!", "¡Llama ya!", "Únete".'
            }
          ]
        },
        {
          pairs: [
            {
              id: 37,
              left: 'Lenguaje coloquial o jerga',
              right: 'Conectar con un público objetivo específico',
              hint: 'Usar palabras como "bacán" o "chabacano".'
            },
            {
              id: 38,
              left: 'Cambio de tipografía',
              right: 'Diferenciar voces o marcar un concepto especial',
              hint: 'Usar otra fuente visualmente distinta.'
            },
            {
              id: 39,
              left: 'Logotipo de marca',
              right: 'Establecer la identidad corporativa y confianza',
              hint: 'Sello visual de una empresa.'
            },
            {
              id: 40,
              left: 'Pregunta de alternativa cerrada',
              right: 'Forzar al lector a elegir entre opciones dadas',
              hint: '"¿Estás a favor del progreso o quieres estancarte?"'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'sec-3-19',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 19,
    level: 19,
    title: 'ProTip: Trampas Visuales',
    introduccion: 'Cómo leer gráficos sin ser engañado.',
    datos_claves: [ 'Revisa siempre qué miden los ejes (X e Y).' ],
    isProTip: true,
    guia_titulo: 'El Gráfico Engañoso',
    guia_contenido: 'Muchos textos usan gráficos para parecer científicos. Siempre revisa si el gráfico **realmente prueba** lo que dice el texto, o si solo muestra datos no relacionados. Presta especial atención al eje Y: si no parte de 0, una diferencia mínima puede parecer gigantesca visualmente.',
    svgContent: `
      <svg viewBox="0 0 300 200" style="background:#fff; border-radius:12px; padding:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); max-width: 100%;">
        <text x="150" y="25" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="bold" fill="#333">Ventas Anuales (Truco Visual)</text>
        <line x1="40" y1="160" x2="260" y2="160" stroke="#ccc" stroke-width="2"/>
        <line x1="40" y1="40" x2="40" y2="160" stroke="#ccc" stroke-width="2"/>
        
        <!-- Y Axis Labels starting at 90! -->
        <text x="35" y="160" text-anchor="end" font-family="Inter,sans-serif" font-size="10" fill="#666">90</text>
        <text x="35" y="100" text-anchor="end" font-family="Inter,sans-serif" font-size="10" fill="#666">95</text>
        <text x="35" y="50" text-anchor="end" font-family="Inter,sans-serif" font-size="10" fill="#666">100</text>
        
        <!-- Grid lines -->
        <line x1="40" y1="100" x2="260" y2="100" stroke="#eee" stroke-width="1" stroke-dasharray="4"/>
        <line x1="40" y1="50" x2="260" y2="50" stroke="#eee" stroke-width="1" stroke-dasharray="4"/>
        
        <!-- Bars -->
        <rect x="70" y="140" width="50" height="20" fill="#ef4444" rx="4"/>
        <text x="95" y="135" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#ef4444" font-weight="bold">92</text>
        <text x="95" y="175" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="#333">2022</text>
        
        <rect x="180" y="50" width="50" height="110" fill="#22c55e" rx="4"/>
        <text x="205" y="45" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#22c55e" font-weight="bold">100</text>
        <text x="205" y="175" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="#333">2023</text>
      </svg>
    `
  },
  {
    id: 'sec-3-20',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 20,
    level: 20,
    title: 'Práctica: Leyendo el Gráfico',
    introduccion: 'Determina si la conclusión sacada del gráfico es Verdadera o Falsa.',
    datos_claves: [ 'No asumas más de lo que el gráfico muestra.' ],
    isPractice: true,
    practiceType: 'true-false',
    practiceData: {
      items: [
        {
          statement: 'Gráfico: "Ventas de Helado suben en Enero". Conclusión: "Comer helado causa calor".',
          isTrue: false,
          feedback: 'Falso. Es una correlación, no causalidad (hace calor, por eso comen helado).',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Ventas de Helado (Verano)</text>
              <polyline points="20,100 60,80 100,50 140,40 180,20" fill="none" stroke="#ef4444" stroke-width="3" />
              <circle cx="180" cy="20" r="4" fill="#ef4444" />
              <text x="180" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#333">Enero</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "El 80% de accidentes ocurren cerca de casa". Conclusión: "La mayoría choca en su barrio".',
          isTrue: true,
          feedback: 'Verdadero. Es una deducción directa y literal del dato entregado.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Ubicación de Accidentes</text>
              <path d="M 100 25 A 40 40 0 1 1 65 80 L 100 65 Z" fill="#3b82f6" />
              <path d="M 65 80 A 40 40 0 0 1 100 25 L 100 65 Z" fill="#ef4444" />
              <text x="120" y="75" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#fff">80%</text>
              <text x="100" y="110" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Cerca de casa</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "El número de piratas en el mundo ha bajado, mientras que el calentamiento global subió". Conclusión: "La falta de piratas causa el cambio climático".',
          isTrue: false,
          feedback: 'Falso. Que dos líneas se muevan al mismo tiempo no significa que una cause la otra.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" font-weight="bold" fill="#333">Piratas vs Temp. Global</text>
              <polyline points="20,20 60,40 100,70 140,80 180,100" fill="none" stroke="#22c55e" stroke-width="2" /> <!-- Piratas bajando -->
              <polyline points="20,100 60,90 100,60 140,30 180,20" fill="none" stroke="#ef4444" stroke-width="2" /> <!-- Temp subiendo -->
              <text x="180" y="90" text-anchor="end" font-family="Inter,sans-serif" font-size="8" fill="#22c55e">Piratas</text>
              <text x="180" y="30" text-anchor="end" font-family="Inter,sans-serif" font-size="8" fill="#ef4444">Temperatura</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "El 60% de los pacientes prefirió el medicamento A sobre el B". Conclusión: "El medicamento A es más efectivo".',
          isTrue: false,
          feedback: 'Falso. Preferencia (sabor, color) no es lo mismo que efectividad médica.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Preferencia de Pacientes</text>
              <rect x="50" y="30" width="40" height="70" fill="#3b82f6" rx="2" />
              <rect x="110" y="50" width="40" height="50" fill="#cbd5e1" rx="2" />
              <text x="70" y="25" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#3b82f6" font-weight="bold">60%</text>
              <text x="70" y="115" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#333">A</text>
              <text x="130" y="115" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#333">B</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "La inversión en educación aumentó un 15% este año". Conclusión: "Se gastó más dinero en educación que el año pasado".',
          isTrue: true,
          feedback: 'Verdadero. Un aumento porcentual en inversión significa objetivamente un mayor gasto.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Inversión en Educación</text>
              <rect x="50" y="50" width="40" height="50" fill="#94a3b8" rx="2" />
              <rect x="110" y="30" width="40" height="70" fill="#22c55e" rx="2" />
              <path d="M 70 40 L 130 20 L 125 15 M 130 20 L 120 25" fill="none" stroke="#22c55e" stroke-width="2" />
              <text x="100" y="18" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#22c55e" font-weight="bold">+15%</text>
              <text x="70" y="115" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Año Ant.</text>
              <text x="130" y="115" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Año Act.</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "Las personas que duermen 8 horas tienen mejores salarios". Conclusión: "Si duermo 8 horas, mi jefe me subirá el sueldo mañana".',
          isTrue: false,
          feedback: 'Falso. Es una estadística general poblacional, no garantiza un resultado individual automático.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Sueño vs Salario</text>
              <circle cx="50" cy="80" r="3" fill="#cbd5e1" />
              <circle cx="70" cy="70" r="3" fill="#cbd5e1" />
              <circle cx="90" cy="60" r="3" fill="#94a3b8" />
              <circle cx="110" cy="50" r="3" fill="#94a3b8" />
              <circle cx="130" cy="40" r="3" fill="#3b82f6" />
              <circle cx="150" cy="30" r="3" fill="#3b82f6" />
              <line x1="30" y1="90" x2="170" y2="20" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2" />
              <text x="170" y="110" text-anchor="end" font-family="Inter,sans-serif" font-size="8" fill="#666">Horas de Sueño</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "Las temperaturas invernales han bajado 2°C promedio en la década". Conclusión: "El invierno es más frío ahora que hace diez años".',
          isTrue: true,
          feedback: 'Verdadero. La lectura promedio confirma exactamente esa aseveración.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Temperaturas de Invierno</text>
              <polyline points="30,30 60,40 90,50 120,60 150,80" fill="none" stroke="#3b82f6" stroke-width="3" />
              <text x="150" y="95" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#3b82f6" font-weight="bold">-2°C</text>
              <text x="30" y="110" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Hace 10 años</text>
              <text x="150" y="110" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Hoy</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "30% de los usuarios borró la aplicación el primer día". Conclusión: "La aplicación es mala".',
          isTrue: false,
          feedback: 'Falso. Puede ser que la app fuera para un uso de una sola vez, o que requiriera un pago. No puedes concluir su "calidad" solo con ese número.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Retención de App (Día 1)</text>
              <rect x="50" y="40" width="100" height="20" fill="#cbd5e1" rx="2" />
              <rect x="50" y="40" width="30" height="20" fill="#ef4444" rx="2" />
              <text x="65" y="54" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#fff" font-weight="bold">30%</text>
              <text x="100" y="80" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#666">App Borrada</text>
              <text x="100" y="100" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#ef4444">Motivo: ? (Desconocido)</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "El desempleo bajó del 10% al 8%". Conclusión: "La cantidad de desempleados disminuyó en ese periodo".',
          isTrue: false,
          feedback: 'Falso. La tasa de desempleo es desempleados ÷ fuerza laboral. Si la fuerza laboral también cambió (por ejemplo, personas que dejaron de buscar trabajo), el número real de desempleados podría no haber bajado aunque la tasa sí.',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Tasa de Desempleo</text>
              <path d="M 50 40 L 150 80" fill="none" stroke="#22c55e" stroke-width="4" />
              <circle cx="50" cy="40" r="5" fill="#22c55e" />
              <circle cx="150" cy="80" r="5" fill="#22c55e" />
              <text x="50" y="30" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#22c55e" font-weight="bold">10%</text>
              <text x="150" y="70" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#22c55e" font-weight="bold">8%</text>
            </svg>
          `
        },
        {
          statement: 'Gráfico: "El 90% de los estudiantes prefiere las clases online". (Gráfico basado en una encuesta a 10 estudiantes). Conclusión: "Casi todos los estudiantes del país prefieren clases online".',
          isTrue: false,
          feedback: 'Falso. La muestra (10 personas) es demasiado pequeña para generalizar al país entero (Generalización Apresurada).',
          svgContent: `
            <svg viewBox="0 0 200 120" style="width:100%; max-width:250px; background:#fff; border-radius:8px; padding:10px; margin: 0 auto; display: block; border: 1px solid #e2e8f0;">
              <text x="100" y="15" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="bold" fill="#333">Preferencia de Clases</text>
              <rect x="50" y="30" width="100" height="30" fill="#cbd5e1" rx="4" />
              <rect x="50" y="30" width="90" height="30" fill="#3b82f6" rx="4" />
              <text x="95" y="50" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#fff" font-weight="bold">90% Online</text>
              <text x="100" y="80" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#ef4444" font-weight="bold">N = 10 estudiantes</text>
              <text x="100" y="100" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" fill="#666">Muestra no representativa</text>
            </svg>
          `
        }
      ]
    }
  },
  {
    id: 'sec-3-21',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 21,
    level: 21,
    title: 'Práctica: Completa la Función',
    introduccion: 'Rellena los espacios sobre recursos retóricos y lingüísticos.',
    datos_claves: [ 'Recuerda la diferencia entre ironía y metáfora, y entre recursos lingüísticos y no lingüísticos.' ],
    isPractice: true,
    practiceType: 'fill-blanks',
    practiceData: {
      title: 'Completa la Función del Recurso',
      description: 'Selecciona la palabra correcta para completar cada oración sobre los recursos que usan los autores.',
      items: [
        {
          id: 1,
          textBefore: 'Cuando el autor dice lo contrario de lo que piensa para burlarse, usa la ',
          textAfter: ' como recurso retórico.',
          options: ['ironía', 'metáfora', 'comparación', 'hipérbole'],
          correctOption: 'ironía',
          hint: 'Afirmar algo queriendo decir lo opuesto.'
        },
        {
          id: 2,
          textBefore: 'Un autor que usa "su corazón era de piedra" está usando una ',
          textAfter: ', que compara dos cosas sin usar "como".',
          options: ['metáfora', 'ironía', 'pregunta retórica', 'cita'],
          correctOption: 'metáfora',
          hint: 'Identifica sin decir explícitamente la comparación.'
        },
        {
          id: 3,
          textBefore: 'Una ',
          textAfter: ' retórica no espera respuesta; su función es involucrar emocionalmente al lector.',
          options: ['pregunta', 'orden', 'definición', 'cita'],
          correctOption: 'pregunta',
          hint: '"¿Hasta cuándo aguantaremos?" es un ejemplo.'
        },
        {
          id: 4,
          textBefore: 'Un gráfico de barras en un artículo sirve para ',
          textAfter: ' visualmente una comparación de datos entre categorías.',
          options: ['representar', 'emocionar', 'ironizar', 'entretener'],
          correctOption: 'representar',
          hint: 'Las barras muestran diferencias de valor de forma gráfica.'
        },
        {
          id: 5,
          textBefore: 'Las negritas o cursivas en un texto sirven para ',
          textAfter: ' los conceptos más importantes para el lector.',
          options: ['destacar', 'traducir', 'eliminar', 'resumir'],
          correctOption: 'destacar',
          hint: 'Hacen que la vista se fije en esa parte del texto.'
        },
        {
          id: 6,
          textBefore: 'Una fotografía de personas sufriendo en un reportaje busca ',
          textAfter: ' al lector, apelando a su sensibilidad emocional.',
          options: ['conmover', 'informar estadísticamente', 'entretener', 'confundir'],
          correctOption: 'conmover',
          hint: 'Es un recurso visual que apela a las emociones, no a los datos.'
        },
        {
          id: 7,
          textBefore: 'Citar las palabras de un Premio Nobel al inicio de un texto busca otorgar ',
          textAfter: ' al argumento apoyándose en su prestigio.',
          options: ['autoridad', 'humor', 'ambigüedad', 'ritmo'],
          correctOption: 'autoridad',
          hint: 'Apoyarse en alguien reconocido para validar una idea.'
        },
        {
          id: 8,
          textBefore: 'Una exageración deliberada para dar énfasis, como "te lo he dicho mil veces", se llama ',
          textAfter: ' y su función es dramatizar lo que se dice.',
          options: ['hipérbole', 'eufemismo', 'metáfora', 'ironía'],
          correctOption: 'hipérbole',
          hint: 'Es una exageración tan grande que nadie la toma literalmente.'
        }
      ]
    }
  },
  {
    id: 'sec-3-22',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 22,
    level: 22,
    title: 'Práctica: Detección Veloz',
    introduccion: '¿Qué recurso se está usando?',
    datos_claves: [ 'Responde en menos de 5 segundos.' ],
    isPractice: true,
    practiceType: 'rapid',
    test: {
      id: 'test-3-22',
      seccionId: 'sec-3-22',
      contexto_base: null,
      preguntas: [
        {
          id: 32201,
          enunciado: '¿Para qué sirve citar a Einstein hablando de física?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Dar Autoridad', B: 'Dar Humor' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Es el experto máximo en la materia.',
          feedback_error: 'Es una cita de autoridad porque apela al prestigio de un experto.'
        },
        {
          id: 32202,
          enunciado: 'Usar cursivas en palabras extranjeras sirve para...',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Destacarlas', B: 'Traducirlas' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Las separa visualmente del texto normal.',
          feedback_error: 'Las cursivas destacan tipográficamente palabras no habituales o extranjeras.'
        },
        {
          id: 32203,
          enunciado: '¿Qué función cumple una pregunta retórica como "¿Acaso nadie se preocupa por el futuro?"?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Involucrar al lector', B: 'Pedir información' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! No espera una respuesta real, busca conmover.',
          feedback_error: 'Las preguntas retóricas no piden datos, involucran la emoción del lector.'
        },
        {
          id: 32204,
          enunciado: 'Un gráfico de torta con porcentajes sirve para...',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Mostrar partes de un total', B: 'Conmover al lector' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Divide un todo en porciones visuales.',
          feedback_error: 'Un gráfico circular visualiza la proporción de partes dentro de un 100%.'
        },
        {
          id: 32205,
          enunciado: '"Su voz era música para mis oídos." ¿Qué recurso usa el autor?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Metáfora', B: 'Ironía' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Compara la voz con música sin usar "como".',
          feedback_error: 'Es una metáfora: iguala dos términos para expresar agrado.'
        },
        {
          id: 32206,
          enunciado: 'Una foto en blanco y negro de un niño llorando en un artículo periodístico busca...',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Conmover emocionalmente', B: 'Demostrar datos estadísticos' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Recurso visual de apelación afectiva.',
          feedback_error: 'Las fotos tristes apelaran al sentimiento y la empatía del lector.'
        },
        {
          id: 32207,
          enunciado: 'El uso de negritas en palabras clave sirve para...',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Destacar información importante', B: 'Cambiar el idioma del texto' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Guía la atención del lector hacia lo esencial.',
          feedback_error: 'Las negritas resaltan los conceptos principales para el escaneo visual.'
        },
        {
          id: 32208,
          enunciado: '"¡Te lo he dicho un millón de veces!" es un ejemplo de...',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Hipérbole', B: 'Metáfora' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Una exageración deliberada para dar énfasis.',
          feedback_error: 'Una exageración evidente para intensificar el mensaje es una hipérbole.'
        }
      ]
    }
  },
  {
    id: 'sec-3-23',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 23,
    level: 23,
    title: 'Test: Evaluar Recursos',
    introduccion: 'Evalúa funciones de recursos y forma en la PAES.',
    datos_claves: [ 'Ningún recurso es casual, todo tiene un motivo.' ],
    test: {
      id: 'test-3-23',
      seccionId: 'sec-3-23',
      contexto_base: null,
      preguntas: [
        {
          id: 3231,
          enunciado: '¿Qué propósito cumple la inclusión de una fotografía en blanco y negro de niños descalzos en un artículo sobre la pobreza infantil?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ahorrar costos de impresión.',
            B: 'Apelar emocionalmente (conmover) al lector.',
            C: 'Demostrar estadísticamente el problema.',
            D: 'Fomentar la compra de zapatos.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Es un recurso visual que busca el "pathos" o emoción.',
          feedback_error: 'Una foto triste no entrega números ni vende zapatos, busca que sientas lástima o empatía.'
        },
        {
          id: 3232,
          enunciado: 'Un texto informativo utiliza abundantes comillas ("") al mencionar los nombres de supuestos "medicamentos milagrosos". La función de estas comillas es:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indicar que son palabras en otro idioma.',
            B: 'Citar textualmente al fabricante.',
            C: 'Expresar distancia, escepticismo o ironía del autor hacia la eficacia del producto.',
            D: 'Resaltar la importancia de comprarlos.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Las "comillas irónicas" muestran duda o distancia sobre el término.',
          feedback_error: 'Cuando alguien hace comillas con los dedos al hablar, suele significar que duda de la veracidad del término.'
        },
        {
          id: 3233,
          enunciado: 'Un ensayo argumentativo usa viñetas (•) para listar los tres argumentos principales en favor de su tesis. ¿Qué función cumplen estas viñetas?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Hacer el texto más colorido y atractivo.',
            B: 'Organizar y jerarquizar la información para facilitar su lectura.',
            C: 'Demostrar que el autor tiene muchos argumentos en su contra.',
            D: 'Separar el texto de las imágenes del documento.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Las listas con viñetas son un recurso tipográfico que organiza y facilita la lectura de la información.',
          feedback_error: 'Las viñetas tienen una función estructural y visual: presentan los puntos de forma clara y ordenada.'
        },
        {
          id: 3234,
          enunciado: 'En un artículo de economía se incluye un gráfico de líneas mostrando la evolución del PIB durante 20 años. ¿Cuál es la función principal de este gráfico?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Decorar el artículo para que sea más largo.',
            B: 'Visualizar de forma clara una tendencia o cambio a lo largo del tiempo.',
            C: 'Reemplazar completamente la explicación textual del autor.',
            D: 'Demostrar que el autor sabe manejar programas de computador.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Los gráficos de líneas son ideales para mostrar tendencias y cambios a lo largo de un período de tiempo.',
          feedback_error: 'La función de un gráfico de líneas es mostrar la evolución o tendencia de una variable en el tiempo de forma visual.'
        },
        {
          id: 3235,
          enunciado: 'Un autor describe la corrupción como "un cáncer que carcome las instituciones desde dentro". ¿Qué recurso usa y con qué propósito?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Ironía, para burlarse de las instituciones.',
            B: 'Hipérbole, para exagerar los problemas del país.',
            C: 'Metáfora, para dramatizar e impactar describiendo la gravedad del problema.',
            D: 'Pregunta retórica, para involucrar al lector en la solución.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Muy bien! La metáfora del "cáncer" dramatiza la idea de que la corrupción destruye internamente y sin detenerse.',
          feedback_error: 'Comparar la corrupción con una enfermedad grave (cáncer) es una metáfora que busca impactar emocionalmente.'
        },
        {
          id: 3236,
          enunciado: 'Un texto periodístico usa negritas exclusivamente en cifras y datos estadísticos. ¿Qué función cumplen en este contexto?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Indicar que esos datos son falsos o cuestionables.',
            B: 'Permitir al lector escanear el texto y ubicar los datos clave rápidamente.',
            C: 'Separar el texto del autor de las citas de otras fuentes.',
            D: 'Demostrar que el redactor dominó bien el procesador de texto.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Las negritas en datos permiten al lector escanear visualmente el texto y localizar la evidencia cuantitativa al instante.',
          feedback_error: 'Los elementos tipográficos como negritas y cursivas sirven para guiar la atención del lector hacia lo que el autor considera más relevante.'
        },
        {
          id: 3237,
          enunciado: 'Un político cierra su discurso diciendo: "¿Vamos a permitir que nuestros hijos hereden un país en ruinas?" ¿Qué recurso usa y por qué?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Metáfora, para comparar el país con un edificio destruido.',
            B: 'Pregunta retórica, para generar emoción y motivar a la acción sin esperar respuesta.',
            C: 'Ironía, para burlarse de quienes gobiernan actualmente.',
            D: 'Cita de autoridad, porque apela a la figura de los hijos.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! La pregunta retórica apela a la emoción (amor por los hijos y el país) para motivar a la acción política.',
          feedback_error: 'No espera que el público responda; su función es generar una reacción emocional de indignación o determinación.'
        },
        {
          id: 3238,
          enunciado: 'En un artículo de opinión, el autor abre con la cita: "El conocimiento es poder" (Francis Bacon). ¿Cuál es la función de este recurso?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Entretener al lector con datos históricos curiosos.',
            B: 'Dar autoridad y profundidad a su argumento apoyándose en un pensador reconocido.',
            C: 'Demostrar que el autor leyó muchos libros de historia.',
            D: 'Separar la introducción del cuerpo del artículo.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Abrir con una cita célebre es una estrategia retórica para dar peso y legitimidad al argumento que viene.',
          feedback_error: 'Citar a una autoridad respetada al inicio de un texto busca que el lector otorgue mayor credibilidad al punto de vista que se desarrollará.'
        }
      ]
    }
  },
  {
    id: 'sec-3-23b',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 23.5,
    level: 23.5,
    title: 'Forma',
    introduccion: 'Analiza los recursos estéticos y visuales utilizados en este breve artículo.',
    datos_claves: [ 'Observa las comillas, cursivas y metáforas.' ],
    test: {
      id: 'test-3-23b',
      seccionId: 'sec-3-23b',
      contexto_base: 'El nuevo teléfono "Inteligente" X-200 ha llegado al mercado prometiendo revolucionar nuestra existencia. Según la marca, este dispositivo curará nuestro aburrimiento crónico con su pantalla de 120 hercios y su procesador cuántico. Sin embargo, al probarlo durante una semana, la revolución se sintió más bien como un ligero tropiezo.\n\nLa batería es un vampiro sediento que devora la energía en cuestión de horas, dejándote desconectado a mitad del día. Resulta curioso que un aparato diseñado para conectarnos termine obligándonos a mirar la pared mientras esperamos que se cargue lentamente. ¿De qué sirve tener el procesador más rápido del mundo si el dispositivo pasa más tiempo enchufado a la pared que en tus manos?\n\nAdemás, la interfaz de usuario es tan intuitiva como un manual de física cuántica escrito en arameo antiguo. Las aplicaciones se congelan sin previo aviso, obligándote a reiniciar el equipo en los momentos más inoportunos. A un precio de lanzamiento que supera con creces un salario mínimo, el X-200 no es una inversión tecnológica de futuro; es, en realidad, un costoso experimento fallido en el que los consumidores somos tratados como simples conejillos de indias.',
      preguntas: [
        {
          id: 32331,
          enunciado: '¿Con qué propósito el emisor utiliza las comillas al escribir "Inteligente" en la primera oración?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Para citar el nombre comercial exacto registrado por la empresa.',
            B: 'Para destacar una palabra clave y hacerla más visible.',
            C: 'Para expresar ironía y dudar de que el teléfono realmente sea inteligente.',
            D: 'Para indicar que es un concepto extranjero.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Exacto! El resto del texto demuestra que el autor está muy decepcionado, por lo que el uso de comillas es claramente irónico.',
          feedback_error: 'Considerando que el autor dice que la experiencia fue "un ligero tropiezo", las comillas son para burlarse del adjetivo.'
        },
        {
          id: 32332,
          enunciado: '¿Qué función cumple la metáfora "es un vampiro sediento" en el texto?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Enfatizar, de forma hiperbólica y gráfica, lo rápido que el teléfono gasta la batería.',
            B: 'Educar al lector sobre mitología y folclore.',
            C: 'Alabar la capacidad del teléfono para procesar gráficos de videojuegos.',
            D: 'Ocultar una falla técnica del dispositivo.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! Es un recurso literario que ilustra un defecto tecnológico (alto consumo energético) con una imagen dramática y humorística.',
          feedback_error: 'Un vampiro "chupa sangre", al igual que el teléfono "chupa batería". Es una exageración visual para destacar el defecto.'
        },
        {
          id: 32333,
          enunciado: '¿Cuál es el propósito de la pregunta retórica "¿De qué sirve tener el procesador más rápido del mundo...?"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Demostrar los conocimientos técnicos del autor.',
            B: 'Hacer reflexionar al lector sobre la inutilidad de la potencia si la batería falla.',
            C: 'Preguntarle a la marca cómo se fabrica un procesador.',
            D: 'Promover la compra de procesadores más rápidos.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Cuestiona la lógica de la marca para evidenciar el gran defecto del teléfono.',
          feedback_error: 'Es una pregunta retórica; no espera respuesta literal, sino que busca evidenciar una contradicción.'
        },
        {
          id: 32334,
          enunciado: '¿Qué función cumple la comparación de la interfaz con un "manual de física cuántica escrito en arameo antiguo"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Criticar la falta de idiomas disponibles en el teléfono.',
            B: 'Informar que el teléfono fue fabricado en Medio Oriente.',
            C: 'Exagerar, de forma humorística, lo extremadamente difícil de entender que es.',
            D: 'Alabar la sofisticación y elegancia de los menús.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Excelente! Es una hipérbole (exageración) cómica para decir que es incomprensible.',
          feedback_error: 'Nadie lee arameo antiguo hoy en día. Compararlo con eso significa que es muy, muy difícil de usar.'
        },
        {
          id: 32335,
          enunciado: 'Al usar el término "conejillos de indias", ¿qué actitud del emisor se refuerza?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Su amor por la protección animal.',
            B: 'Su indignación por cómo la empresa trata y utiliza a los clientes.',
            C: 'Su apoyo incondicional a los avances científicos.',
            D: 'Su nostalgia por dispositivos más antiguos.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Sugiere que la empresa saca al mercado productos sin terminar para probarlos en la gente.',
          feedback_error: 'Los "conejillos de indias" se usan para experimentos. El autor siente que están experimentando con los usuarios que pagaron.'
        },
        {
          id: 32336,
          enunciado: '¿Qué función cumple la frase "la revolución se sintió más bien como un ligero tropiezo"?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Contrastar las grandes promesas de la marca con la decepcionante realidad del producto.',
            B: 'Relatar una caída física que sufrió el autor mientras usaba el teléfono.',
            C: 'Justificar el alto precio del dispositivo.',
            D: 'Agradecer a la marca por su innovación.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Opone la "revolución" (expectativa) al "ligero tropiezo" (realidad decepcionante).',
          feedback_error: 'Compara lo que prometió la marca (revolución) con lo que él realmente sintió (tropiezo).'
        }
      ]
    }
  },
  {
    id: 'sec-3-24',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 24,
    level: 24,
    title: 'Extrapolación',
    introduccion: 'Lleva la información del texto a situaciones completamente nuevas.',
    datos_claves: [
      'Extrapolar es aplicar la lógica del autor a otro contexto.',
      'Nunca uses tu opinión personal para extrapolar.'
    ],
    tags: [ 'subcapitulo:Extrapolación y Contextos' ],
    isProTip: true,
    guia_titulo: 'Extrapolación',
    guia_contenido: '<ul><li><strong>🚀 Nuevos Contextos:</strong> Si el autor defiende que "la libertad de expresión en la calle debe ser absoluta", ¿qué pensaría sobre censurar Twitter? Seguramente se opondría, aplicando su misma **regla o tesis** a un **nuevo contexto** (internet).</li></ul>'
  },
  {
    id: 'sec-3-25',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 25,
    level: 25,
    title: 'Práctica: Une la Analogía',
    introduccion: 'Empareja la tesis original con su equivalente en un nuevo contexto.',
    datos_claves: [ 'Busca el mismo principio moral o lógico en ambos casos. El contexto cambia, el principio no.' ],
    isPractice: true,
    practiceType: 'match-pairs',
    practiceData: {
      title: 'Tesis y Nuevos Contextos',
      description: 'Une cada tesis con la situación que aplica el mismo principio lógico en un contexto diferente.',
      rounds: [
        {
          pairs: [
            {
              id: 1,
              left: 'Prohibir monopolios en telefonía',
              right: 'Prohibir monopolios en supermercados',
              hint: 'El mismo principio económico contra la concentración de poder.'
            },
            {
              id: 2,
              left: 'Simbiosis biológica (dos seres se benefician mutuamente)',
              right: 'Alianza comercial donde ambas empresas ganan',
              hint: 'Beneficio mutuo: el mismo principio en biología y negocios.'
            },
            {
              id: 3,
              left: 'Protección infantil en TV (censura de contenido adulto)',
              right: 'Regulación de edad para juegos online violentos',
              hint: 'Proteger a los menores en cualquier pantalla.'
            },
            {
              id: 4,
              left: 'Minimalismo arquitectónico (menos adornos, más funcionalidad)',
              right: 'Diseño web limpio y sin elementos decorativos innecesarios',
              hint: 'La forma debe seguir a la función, en cualquier diseño.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 5,
              left: 'Cuarentena para controlar una pandemia',
              right: 'Cortafuegos informático para aislar un virus digital',
              hint: 'El mismo principio: aislar para contener el daño.'
            },
            {
              id: 6,
              left: 'Impuesto al tabaco para desincentivar el consumo dañino',
              right: 'Impuesto al azúcar para reducir el consumo de bebidas azucaradas',
              hint: 'Mismo mecanismo económico aplicado a otro producto nocivo.'
            },
            {
              id: 7,
              left: 'Código de conducta en una empresa para mantener el respeto',
              right: 'Reglamento de convivencia en una escuela',
              hint: 'Normas formales que regulan el comportamiento en comunidad.'
            },
            {
              id: 8,
              left: 'Principio de inocencia hasta que se demuestre la culpabilidad (en justicia penal)',
              right: 'Asumir que un producto ya en el mercado es seguro hasta que estudios lo contradigan',
              hint: 'El mismo principio de presunción positiva en distintos ámbitos.'
            }
          ]
        },
        {
          pairs: [
            {
              id: 9,
              left: 'Vacuna: exponer al organismo a una forma débil del virus para generar defensa',
              right: 'Simulacro de evacuación: exponer a la gente a una emergencia falsa para prepararse',
              hint: 'Prepararse para lo grande con una versión controlada de lo pequeño.'
            },
            {
              id: 10,
              left: 'Ley anti-discriminación en el trabajo',
              right: 'Protocolo contra el acoso en espacios públicos',
              hint: 'El mismo principio de igualdad y protección aplicado a otro espacio.'
            },
            {
              id: 11,
              left: 'Biodiversidad: muchas especies hace un ecosistema más resistente',
              right: 'Diversidad de proveedores hace a una empresa menos vulnerable',
              hint: 'La diversidad aumenta la resiliencia en cualquier sistema.'
            },
            {
              id: 12,
              left: 'Código fuente abierto (cualquiera puede ver y mejorar el software)',
              right: 'Investigación con resultados publicados (cualquiera puede verificar y replicar)',
              hint: 'El mismo principio de transparencia y mejora colectiva.'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'sec-3-26',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 26,
    level: 26,
    title: 'ProTip: La Regla de Oro',
    introduccion: 'El secreto para no equivocarse extrapolando.',
    datos_claves: [ 'Olvida tu opinión. Eres el autor.' ],
    isProTip: true,
    guia_titulo: 'Sé un Camaleón Lógico',
    guia_contenido: 'Para responder bien una extrapolación, tienes que "convertirte" en el autor. Si el autor odia los autos, odiará las motos. Da igual si a ti te encantan las motos. **Sigue su lógica, no la tuya**.'
  },
  {
    id: 'sec-3-27',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 27,
    level: 27,
    title: 'Práctica: ¿Lógico o Ilógico?',
    introduccion: 'Clasifica si la extrapolación es coherente con la postura del autor original.',
    datos_claves: [ 'Sigue la lógica del autor estrictamente. La coherencia no depende de si tú estás de acuerdo.' ],
    isPractice: true,
    practiceType: 'categorize',
    practiceData: {
      categories: [ 'Lógico', 'Ilógico' ],
      items: [
        {
          text: 'Autor pro-tecnología → Apoyaría usar tablets en preescolar.',
          category: 'Lógico'
        },
        {
          text: 'Autor vegano por ética → Compraría zapatos de cuero genuino.',
          category: 'Ilógico'
        },
        {
          text: 'Autor que cree que el Estado necesita más ingresos para financiar programas sociales → Exigiría eliminar todos los impuestos.',
          category: 'Ilógico'
        },
        {
          text: 'Autor feminista → Apoyaría la igualdad salarial en el deporte profesional.',
          category: 'Lógico'
        },
        {
          text: 'Autor que defiende la libertad de expresión total → Apoyaría censurar noticias falsas en redes sociales.',
          category: 'Ilógico'
        },
        {
          text: 'Autor que defiende el medio ambiente → Se opondría a construir una mina de carbón en un bosque nativo.',
          category: 'Lógico'
        },
        {
          text: 'Autor que cree en la autorregulación del mercado → Apoyaría que el gobierno fije los precios del pan.',
          category: 'Ilógico'
        },
        {
          text: 'Autor que defiende la privacidad digital → Rechazaría una app que rastrea la ubicación en todo momento.',
          category: 'Lógico'
        },
        {
          text: 'Autor pacifista que rechaza toda violencia → Apoyaría un programa de servicio militar obligatorio.',
          category: 'Ilógico'
        },
        {
          text: 'Autor que valora la educación pública de calidad → Apoyaría aumentar el presupuesto para escuelas municipales.',
          category: 'Lógico'
        }
      ]
    }
  },
  {
    id: 'sec-3-28',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 28,
    level: 28,
    title: 'Práctica: Extrapolación Veloz',
    introduccion: '¿Qué diría el autor en esta situación? Aplica su lógica sin usar la tuya.',
    datos_claves: [ 'Olvida tu opinión personal. Sigue la lógica del autor strictly.' ],
    isPractice: true,
    practiceType: 'rapid',
    test: {
      id: 'test-3-28',
      seccionId: 'sec-3-28',
      contexto_base: null,
      preguntas: [
        {
          id: 32801,
          enunciado: 'Si creo que toda medicina natural es estafa, ¿compraría homeopatía?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'No', B: 'Sí' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! La homeopatía es una alternativa natural, por lo que la rechazaría.',
          feedback_error: 'Como rechaza toda medicina natural, también rechazará la homeopatía.'
        },
        {
          id: 32802,
          enunciado: 'Si defiendo el derecho a portar armas, ¿apoyaría el uso de gas pimienta para autodefensa?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Sí', B: 'No' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Ambos son medios de autodefensa personal.',
          feedback_error: 'Apoyar instrumentos de autodefensa incluye también defensas no letales como el gas pimienta.'
        },
        {
          id: 32803,
          enunciado: 'Si el autor cree que el Estado no debe intervenir en la economía, ¿apoyaría subsidios al trigo?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'No', B: 'Sí' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Un subsidio es intervención estatal en el mercado.',
          feedback_error: 'Un subsidio contraviene su principio de cero intervención estatal.'
        },
        {
          id: 32804,
          enunciado: 'Si el autor es vegano por ética contra el sufrimiento animal, ¿usaría zapatos de cuero genuino?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'No', B: 'Sí' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! El cuero proviene de animales, contradice su principio.',
          feedback_error: 'Comprar cuero violaría su postura ética contra la explotación animal.'
        },
        {
          id: 32805,
          enunciado: 'Un autor defiende la libertad de expresión absoluta. ¿Se opondría a censurar un tweet polémico?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Sí', B: 'No' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Para él la libertad aplica a todo canal, incluso internet.',
          feedback_error: 'Al defender libertad absoluta, se opondrá a cualquier acto de censura digital.'
        },
        {
          id: 32806,
          enunciado: 'Un autor cree que la privacidad digital es un derecho inviolable. ¿Apoyaría cámaras de reconocimiento facial en el metro?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'No', B: 'Sí' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Las cámaras registran datos biométricos masivos sin permiso.',
          feedback_error: 'La vigilancia biométrica masiva atenta directamente contra el derecho a la privacidad.'
        },
        {
          id: 32807,
          enunciado: 'Si el autor es conservador y cree que los mercados se autorregulan, ¿apoyaría el control estatal de precios de arriendos?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'No', B: 'Sí' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Controlar precios es intervenir la autorregulación del mercado.',
          feedback_error: 'Fijar precios rompe el principio de libre oferta y demanda que defiende.'
        },
        {
          id: 32808,
          enunciado: 'Si el autor cree que los jóvenes deben trabajar desde los 16, ¿apoyaría el empleo part-time en enseñanza media?',
          tipo_alternativas: 'texto',
          alternativas: { A: 'Sí', B: 'No' },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Correcto! Es totalmente coherente con promover el trabajo temprano.',
          feedback_error: 'Es una aplicación directa de su postura a favor del empleo juvenil.'
        }
      ]
    }
  },
  {
    id: 'sec-3-29',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    order: 29,
    level: 29,
    title: 'Test: Nuevos Contextos',
    introduccion: 'Extrapolación oficial tipo PAES.',
    datos_claves: [ 'Respeta siempre la tesis original.' ],
    test: {
      id: 'test-3-29',
      seccionId: 'sec-3-29',
      contexto_base: null,
      preguntas: [
        {
          id: 3291,
          enunciado: 'Si un autor argumenta que "el Estado debe financiar absolutamente todo tipo de arte, sin censura ni filtro moral", ¿qué postura tomaría ante una obra de teatro sumamente ofensiva y grosera?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'La censuraría por proteger las buenas costumbres.',
            B: 'Exigiría que el Estado deje de financiar teatros.',
            C: 'Defendería su financiamiento, coherente con su idea de cero censura moral.',
            D: 'Demandaría al director.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Extrapolaste su principio ("sin filtro moral") a un caso límite y aplicaste su lógica.',
          feedback_error: 'El autor dijo "sin filtro moral". Esa es su regla inquebrantable, no importando cuán ofensiva sea.'
        },
        {
          id: 3292,
          enunciado: 'Un texto define el "efecto placebo" como la curación psicológica por fe en un tratamiento inútil. ¿Cuál caso aplica este concepto en un contexto no médico?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Un atleta corre más rápido porque cree que sus zapatos nuevos (que en realidad son normales) son "mágicos".',
            B: 'Un auto frena porque se le rompen los frenos.',
            C: 'Una planta crece porque le echan agua.',
            D: 'Un alumno reprueba porque no estudió.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Excelente! Has extrapolado la idea de "funciona por fe ciega, no por eficacia real" al contexto del deporte.',
          feedback_error: 'El placebo es creer que algo te ayuda, aunque sea falso, y obtener resultados por esa mera creencia.'
        },
        {
          id: 3293,
          enunciado: 'Un texto argumenta que "las redes sociales deberían tener moderación estricta para evitar la desinformación". ¿Qué postura adoptaría su autor frente a los mensajes falsos de WhatsApp?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Los aceptaría, ya que WhatsApp es privado y diferente.',
            B: 'Apoyaría alguna forma de regulación o verificación, ya que el principio anti-desinformación aplica igualmente.',
            C: 'Consideraría que el problema no es relevante en mensajería personal.',
            D: 'Propiciaría la eliminación total de WhatsApp.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Si su principio es combatir la desinformación, este aplica a cualquier plataforma, no solo a las "redes sociales" clásicas.',
          feedback_error: 'El principio del autor (combatir la desinformación) no distingue entre plataformas. Si es malo en Twitter, también lo es en WhatsApp.'
        },
        {
          id: 3294,
          enunciado: 'Un autor sostiene que "la educación tradicional basada en memorizar datos es obsoleta e ineficaz". ¿Qué opinaría de los exámenes de historia que solo piden recordar fechas y nombres?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Los apoyaría plenamente, ya que la historia requiere datos exactos.',
            B: 'Los consideraría un formato igualmente obsoleto e inadecuado.',
            C: 'Pensaría que son la excepción a la regla.',
            D: 'Recomendaría estudiar historia solo de forma numérica.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Su principio es general: memorizar datos es ineficaz en cualquier materia, incluyendo historia.',
          feedback_error: 'El autor no cree en la memorización de datos en ningún contexto. Aplicar eso a la historia es extrapolación directa.'
        },
        {
          id: 3295,
          enunciado: 'Un columnista defiende la idea de que "los impuestos altos ahogan la innovación de cualquier empresa y deberían eliminarse". ¿Qué postura adoptaría ante impuestos a las grandes corporaciones tecnológicas?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Apoyaría los impuestos para las grandes empresas, ya que solo defiende a las pequeñas.',
            B: 'Se opondría también a esos impuestos, aplicando su mismo principio de que los impuestos ahogan la innovación.',
            C: 'Sería neutral, pues el texto no menciona a las grandes corporaciones.',
            D: 'Apoyaría regulaciones especiales para multinacionales.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Su principio (impuestos = muerte para la innovación) es ideológico y no discrimina por tamaño de empresa.',
          feedback_error: 'No hay evidencia en el texto de que haga excepciones. Su lógica se aplica a todas las empresas innovadoras.'
        },
        {
          id: 3296,
          enunciado: 'Un ensayista argumenta que "el arte auténtico debe ser siempre incómodo, provocador y desafiante". ¿Estaría de acuerdo con exhibir en un museo público obras que muchos ciudadanos encuentran ofensivas?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'No, ya que un espacio público tiene otras reglas.',
            B: 'Sí, porque es precisamente esa incomodidad la que define el arte auténtico según su teoría.',
            C: 'Solo si la mayoría de los ciudadanos lo aprueba en un voto.',
            D: 'Solo si la obra tiene más de 50 años de antigüedad.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente extrapolación! Su definición de arte auténtico requiere que provoque; el espacio público no anula su principio.',
          feedback_error: 'Si el arte debe ser incómodo, no se puede excluir a los museos públicos del principio. Sería incoherente.'
        },
        {
          id: 3297,
          enunciado: 'Un texto argumenta que "el éxito en los negocios depende 80% de la mentalidad y 20% de las habilidades técnicas". El autor del texto, ¿contrataria a un candidato brillante técnicamente pero con actitud negativa?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Sí, porque las habilidades técnicas son irremplazables.',
            B: 'No, porque según su teoría la mentalidad es el factor dominante del éxito.',
            C: 'Solo si sus calificaciones académicas son perfectas.',
            D: 'Depende del cargo que vaya a ocupar.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Aplica perfectamente su teoría: si la mentalidad vale cuatro veces más, no contrataría a alguien con mala actitud sin importar sus skills.',
          feedback_error: 'Su teoría dice que la mentalidad es lo más importante (80%). Un candidato con mala actitud choca directamente con ese principio.'
        }
      ]
    }
  },
{
    id: 'ev-boss',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    level: 30,
    order: 30,
    tags: [ 'subcapitulo:Evaluación Final' ],
    isBoss: true,
    title: 'Desafío Final: Evaluar',
    introduccion: '¡El gran desafío final del Capítulo 3 y de Competencia Lectora! Demostrarás tu dominio absoluto juzgando información, evaluando propósitos, recursos y extrapolando contextos.',
    datos_claves: [
      'Este desafío consolida TODO lo aprendido sobre evaluar e interpretar.',
      'Lee considerando no solo "qué dice", sino "quién lo dice", "cómo lo dice" y "para qué lo dice".',
      'Las preguntas exigirán un juicio crítico sobre la calidad y pertinencia del texto.'
    ],
    test: {
      id: 'test-ev-boss',
      seccionId: 'ev-boss',
      contexto_base: 'TEXTO 1\n(Fragmento adaptado de un diario personal, octubre de 1918)\nDía 40 de confinamiento. Las calles de Filadelfia están mudas. Ya ni siquiera se escuchan las campanas de las iglesias anunciando a los muertos, pues el alcalde ha prohibido todo ruido que perturbe la poca paz que nos queda. Hemos sellado las ventanas con trapos húmedos, creyendo ingenuamente que el lienzo detendrá a este asesino invisible que nos roba el aire. Hoy vi al señor Higgins, el boticario, toser sangre en su pañuelo antes de caer de rodillas en la acera; nadie se acercó a ayudarlo. Qué frágil es nuestra pretendida civilización, qué inútil resulta nuestra arrogancia frente al poder de la naturaleza. Sin embargo, al volver la mirada hacia el alféizar de mi ventana, noté que el pequeño bulbo de narciso que planté en septiembre finalmente ha roto la tierra. Una pequeña y terca mota de verde abriéndose paso en medio del desastre.\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 2\nLa Revolución Verde del siglo XX salvó a millones del hambre gracias a los fertilizantes sintéticos ricos en nitrógeno. No obstante, el costo ambiental a largo plazo ha sido ignorado deliberadamente por la industria agrícola. Los informes satelitales recientes demuestran que el 40% del nitrógeno aplicado en los campos es arrastrado por las lluvias hacia los ríos, desembocando finalmente en los océanos. Allí, este exceso de nutrientes alimenta floraciones masivas de algas que, al descomponerse, consumen todo el oxígeno del agua, creando inmensas "zonas muertas" donde la vida marina colapsa.\nEl Dr. Arispe argumenta: "Si prohibimos los fertilizantes mañana mismo, los rendimientos de los cultivos caerán un 50% y los precios de los alimentos se duplicarán, afectando a los más pobres". Aunque esto es cierto, mantener el sistema actual significa destruir irreversiblemente el pilar principal de la biodiversidad oceánica. (Figura 1: Gráfico de líneas que muestra la correlación directa entre el aumento de ventas de fertilizantes sintéticos y el aumento en kilómetros cuadrados de zonas muertas oceánicas entre 1960 y 2020).\n\n--- DIVISION_TEXTOS ---\n\nTEXTO 3\nLa reciente decisión del municipio de instalar trescientas cámaras de reconocimiento facial en el centro cívico es un atropello disfrazado de progreso. Nos prometen calles más seguras, afirmando que el software detectará a los delincuentes en tiempo real. Pero, ¿quién vigila al que vigila? Los algoritmos de estas cámaras han demostrado tener un sesgo racial inaceptable, fallando un 30% más al identificar rostros de minorías étnicas, lo que resultará en arrestos injustificados y persecución selectiva. Además, entregar nuestra privacidad biométrica a una corporación privada a cambio de una falsa sensación de seguridad es el primer paso hacia una sociedad distópica de control absoluto. Como dijo Benjamin Franklin: "Quienes renuncian a su libertad esencial para obtener un poco de seguridad temporal, no merecen ni libertad ni seguridad". Y francamente, si no detenemos este proyecto hoy, mañana estas cámaras estarán dentro de nuestros hogares juzgando nuestras expresiones faciales.\n',
      preguntas: [
        // TEXTO 1 (Narrativo / Histórico)
        {
          id: 3031, texto_index: 0,
          enunciado: 'Teniendo en cuenta el contenido y las marcas textuales del TEXTO 1, ¿cuál es el tono predominante del emisor a lo largo del párrafo?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Frívolo y desinteresado.',
            B: 'Objetivo y científico.',
            C: 'Desolador, pero con un matiz final de esperanza.',
            D: 'Violento y vengativo.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Hay un tono oscuro ante la muerte ("asesino invisible", "desastre"), pero el hallazgo del brote verde añade un giro final de esperanza.',
          feedback_error: 'Nota cómo empieza (hablando de muertes y silencio) y cómo termina (hablando de una planta rompiendo la tierra).'
        },
        {
          id: 3032, texto_index: 0,
          enunciado: '¿Para qué utiliza el emisor el recurso de describir el suceso con el señor Higgins?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Para quejarse del deficiente sistema de salud de la ciudad.',
            B: 'Para ilustrar de forma concreta y dramática la gravedad de la pandemia y el aislamiento humano.',
            C: 'Para demostrar que los boticarios eran los más propensos a enfermarse.',
            D: 'Para dar a entender que él fue el culpable del contagio.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Las anécdotas individuales sirven para ilustrar un punto abstracto (el horror y abandono) de forma más vívida y empática.',
          feedback_error: 'Una anécdota personal dentro de un texto descriptivo suele usarse para ilustrar con un ejemplo visual la tesis principal (en este caso, la tragedia).'
        },
        {
          id: 3033, texto_index: 0,
          enunciado: '¿Qué simboliza el "narciso que ha roto la tierra" en relación con el contexto de la narración?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'La persistencia de la vida y un rayo de esperanza frente a la muerte masiva.',
            B: 'El triunfo de la agricultura sobre las enfermedades virales.',
            C: 'La indiferencia de la naturaleza ante el sufrimiento humano.',
            D: 'La próxima cura medicinal que inventará el boticario.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Excelente! En literatura, una flor emergiendo en un entorno de muerte suele ser una metáfora clásica de esperanza y resiliencia.',
          feedback_error: 'Piensa en el contraste: todo el texto habla de encierro y muerte, y de pronto aparece "una terca mota de verde".'
        },
        {
          id: 3034, texto_index: 0,
          enunciado: 'Al vincular el TEXTO 1 con su contexto de escritura (1918), ¿cómo se puede juzgar la frase "hemos sellado las ventanas con trapos húmedos, creyendo ingenuamente..."?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Como una prueba de que los ciudadanos querían asfixiarse.',
            B: 'Como una evidencia de la ignorancia de la época frente a un virus desconocido, que el propio autor ya reconoce como ineficaz.',
            C: 'Como una crítica política a los materiales de construcción de la época.',
            D: 'Como la causa real por la que moría la gente en Filadelfia.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El uso de la palabra "ingenuamente" indica que el autor ya reconoce, incluso mientras vive los hechos, la ineficacia de las medidas tomadas.',
          feedback_error: 'El autor dice que "ingenuamente" creían que eso los protegería. Está juzgando el conocimiento científico de la época.'
        },
        {
          id: 3035, texto_index: 0,
          enunciado: 'Si el autor del TEXTO 1 enfrentara una cuarentena estricta por un nuevo virus en la actualidad, es altamente probable que:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Desafíe a las autoridades y salga a protestar sin mascarilla.',
            B: 'Sienta un profundo temor inicial, pero busque consuelo o señales de resiliencia en su entorno.',
            C: 'Ignore la enfermedad al considerarla falsa.',
            D: 'Cierre las ventanas con trapos húmedos nuevamente.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Has extrapolado la psicología del narrador (reflexivo, asustado pero buscando esperanza en las pequeñas cosas) a un escenario moderno.',
          feedback_error: 'Extrapolación: El autor acata las reglas (está encerrado), reconoce el miedo, pero busca señales de esperanza (la flor).'
        },

        // TEXTO 2 (Informativo / Gráfico)
        {
          id: 3036, texto_index: 1,
          enunciado: '¿Cuál de las siguientes opciones expresa mejor la intención comunicativa del TEXTO 2?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Felicitar a la industria agrícola por la invención de fertilizantes sintéticos.',
            B: 'Informar sobre un problema ecológico grave causado por una práctica agrícola, sopesando su complejidad económica.',
            C: 'Exigir la prohibición inmediata y absoluta del nitrógeno a nivel mundial.',
            D: 'Demostrar que los océanos se están secando debido al uso de agua en la agricultura.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! El texto informa sobre las zonas muertas, pero también presenta el contraargumento económico (Dr. Arispe), mostrando un panorama complejo.',
          feedback_error: 'Revisa el segundo párrafo. El texto no exige la prohibición inmediata, de hecho, cita al Dr. Arispe explicando las desastrosas consecuencias económicas de prohibirlos hoy mismo.'
        },
        {
          id: 3037, texto_index: 1,
          enunciado: '¿Qué función cumple la mención del argumento del Dr. Arispe en el segundo párrafo?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Contradecir completamente todo lo dicho en el primer párrafo.',
            B: 'Dar un contraargumento económico que evidencia el dilema y la complejidad del problema.',
            C: 'Demostrar que las algas marinas son beneficiosas para los peces.',
            D: 'Criticar a los campesinos pobres por usar fertilizantes.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Al incluir la postura del Dr. Arispe, el autor eleva la calidad de su análisis al no ignorar la contraparte (las consecuencias económicas de prohibir el fertilizante).',
          feedback_error: 'El Dr. Arispe menciona los rendimientos y los precios de los alimentos. Esto plantea un problema difícil: si prohibimos el fertilizante salvamos el mar, pero causamos hambre.'
        },
        {
          id: 3038, texto_index: 1,
          enunciado: 'En relación con la información del texto, ¿qué propósito cumple la Figura 1 (Gráfico de líneas)?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Aportar evidencia visual de la correlación directa planteada entre el uso de fertilizantes y la muerte oceánica.',
            B: 'Mostrar el precio de los fertilizantes a lo largo del tiempo.',
            C: 'Desmentir al Dr. Arispe comprobando que la agricultura no produce comida.',
            D: 'Decorar el texto para hacerlo más ameno de leer.'
          },
          respuesta_correcta: 'A',
          feedback_acierto: '¡Muy bien! El gráfico sirve como respaldo (evidencia empírica) de la tesis central del autor expuesta en el primer párrafo.',
          feedback_error: 'Lee la descripción del gráfico: muestra la correlación entre las ventas de fertilizantes y el aumento de zonas muertas.'
        },
        {
          id: 3039, texto_index: 1,
          enunciado: 'Al evaluar la suficiencia de los datos del TEXTO 2 para su conclusión final, se puede afirmar que:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Son insuficientes, pues no cita la opinión de ningún político.',
            B: 'Son suficientes, ya que aporta datos satelitales (40%), causas químicas y un contraargumento reconocido y sopesado.',
            C: 'Son nulos, ya que el texto se basa puramente en suposiciones.',
            D: 'Son excesivos, dificultando la comprensión del lector común.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! La argumentación es sólida: da porcentajes, explica el mecanismo químico (consumo de oxígeno) e incluso responde a objeciones.',
          feedback_error: 'Considera los elementos que tiene: datos satelitales, explicación de cómo funciona la floración de algas y abordaje de contraargumentos.'
        },
        {
          id: 3040, texto_index: 1,
          enunciado: 'Si un estudiante quiere usar el TEXTO 2 para un ensayo sobre "La maldad inherente de las corporaciones", la información del texto resultaría:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Perfectamente adecuada, porque insulta directamente a los empresarios.',
            B: 'Parcialmente útil, pero insuficiente por sí sola, ya que el texto asume un tono más analítico que panfletario.',
            C: 'Completamente contradictoria, pues el texto apoya a las grandes empresas.',
            D: 'Ilegal, debido a los derechos de autor.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente! Aunque critica que la industria ignoró el problema, el texto reconoce (con Arispe) que el producto salvó a millones del hambre; no es un panfleto puramente anticapitalista.',
          feedback_error: 'El texto es crítico, pero reconoce que los fertilizantes "salvaron a millones del hambre". No es un texto extremista ni puramente panfletario.'
        },

        // TEXTO 3 (Ensayo de Opinión / Argumentativo)
        {
          id: 3041, texto_index: 2,
          enunciado: '¿Cuál es la tesis central defendida por el autor del TEXTO 3?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'El municipio tiene derecho a instalar cámaras para detener delincuentes.',
            B: 'El reconocimiento facial es inaceptable por sus sesgos raciales y por ser una amenaza a la libertad y privacidad.',
            C: 'El software de reconocimiento facial necesita una actualización tecnológica para no fallar.',
            D: 'Benjamin Franklin estaba en contra de las computadoras modernas.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Correcto! Toda la argumentación del texto (el sesgo racial, la corporación privada, la cita de Franklin) converge en rechazar rotundamente la instalación de estas cámaras.',
          feedback_error: '¿De qué trata de convencerte el autor? ¿Quiere mejorar las cámaras o quiere que se detenga el proyecto por ser un peligro?'
        },
        {
          id: 3042, texto_index: 2,
          enunciado: '¿Qué función cumple la cita de Benjamin Franklin en la argumentación del autor?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Demostrar que el autor ha leído libros de historia.',
            B: 'Respaldar su tesis apelando a un argumento de autoridad y a un principio democrático universal.',
            C: 'Explicar cómo funcionaba la seguridad en la época de Franklin.',
            D: 'Criticar indirectamente la política económica del municipio.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Muy bien! Utiliza una voz de autoridad histórica (Franklin) para validar su argumento ético/político de que la libertad no se debe transar por seguridad.',
          feedback_error: 'Citar a un personaje histórico famoso y respetado siempre tiene como objetivo validar y darle peso al propio argumento.'
        },
        {
          id: 3043, texto_index: 2,
          enunciado: 'Al final del texto, el autor afirma: "si no detenemos este proyecto hoy, mañana estas cámaras estarán dentro de nuestros hogares...". Al evaluar este argumento, se puede afirmar que:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Es una prueba científica comprobada por estudios universitarios.',
            B: 'Incurre en una falacia de "pendiente resbaladiza" (exagerando las consecuencias futuras sin pruebas).',
            C: 'Es el argumento más lógico y racional de todo el texto.',
            D: 'Es una metáfora inofensiva sobre la decoración del hogar.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Excelente ojo crítico! Afirmar que poner cámaras en la calle llevará irremediablemente a que te vigilen dentro de tu casa es una exageración no demostrada (Pendiente resbaladiza).',
          feedback_error: 'Poner cámaras en la calle no significa automáticamente que el gobierno pondrá cámaras dentro de tu sala de estar. El autor está exagerando drásticamente el resultado futuro.'
        },
        {
          id: 3044, texto_index: 2,
          enunciado: 'El argumento basado en "un sesgo racial inaceptable, fallando un 30% más..." se considera un argumento:',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Emocional, porque busca que el lector llore.',
            B: 'De autoridad, porque cita a un experto informático.',
            C: 'Lógico-estadístico, porque apela a datos cuantitativos para demostrar ineficacia.',
            D: 'Falaz, porque el racismo no existe en la tecnología.'
          },
          respuesta_correcta: 'C',
          feedback_acierto: '¡Correcto! Utiliza un porcentaje concreto (30%) de falla técnica para sustentar racionalmente por qué el sistema es injusto.',
          feedback_error: 'El uso de un porcentaje ("30% más") indica que el argumento se basa en cifras y estadística.'
        },
        {
          id: 3045, texto_index: 2,
          enunciado: 'Extrapolando la postura del autor del TEXTO 3, ¿qué opinaría sobre un proyecto de ley que obligue a los ciudadanos a entregar su ADN para crear una base de datos nacional contra el crimen?',
          tipo_alternativas: 'texto',
          alternativas: {
            A: 'Lo apoyaría fervientemente, ya que el ADN es más exacto que el rostro.',
            B: 'Lo rechazaría rotundamente, considerándolo una violación extrema a la privacidad y la libertad civil.',
            C: 'Se mantendría neutral, ya que el texto solo habla de cámaras, no de biología.',
            D: 'Pediría ser el primero en donar su ADN.'
          },
          respuesta_correcta: 'B',
          feedback_acierto: '¡Has completado el Desafío Final del Capítulo 3 y de Competencia Lectora! ¡Excelente capacidad de extrapolación! Si rechaza ceder el rostro, con mayor razón rechazará ceder su genética al Estado.',
          feedback_error: 'El principio ético del autor es: la privacidad y la libertad son intocables. Aplica ese mismo principio a la situación del ADN.'
        }
      ]
    }
  }
]
  }, {
    id: 'cap-mat1-1',
    materiaId: 'mat1',
    title: 'Números y Proporcionalidad',
    introduccion: 'Domina los conceptos básicos de conjuntos numéricos y razones.',
    order: 1,
    secciones: [
      { id: 'sec-mat1-1', capituloId: 'cap-mat1-1', materiaId: 'mat1', order: 1,
        title: 'Porcentajes en la Vida Diaria',
        introduccion: 'Aprende a calcular descuentos, aumentos e interés simple.',
        datos_claves: ['Un porcentaje es una fracción de 100', 'Descuento del X% multiplica por (1 - X/100)'] }
    ]
  }, {
    id: 'cap-mat2-1',
    materiaId: 'mat2',
    title: 'Álgebra Superior y Geometría M2',
    introduccion: 'Aprende sistemas de ecuaciones complejos, logaritmos y geometría analítica.',
    order: 1,
    secciones: [
      { id: 'sec-mat2-1', capituloId: 'cap-mat2-1', materiaId: 'mat2', order: 1,
        title: 'Logaritmos y Ecuaciones Exponenciales',
        introduccion: 'Domina las propiedades de los logaritmos y resolución de ecuaciones exponenciales.',
        datos_claves: ['log_b(a) = c equivale a b^c = a', 'Propiedades de multiplicación, división y potencias en logaritmos'] }
    ]
  }, {
    id: 'cap-historia-1',
    materiaId: 'historia',
    title: 'Historia de Chile y el Mundo',
    introduccion: 'Analiza los procesos históricos, políticos, económicos y sociales contemporáneos.',
    order: 1,
    secciones: [
      { id: 'sec-historia-1', capituloId: 'cap-historia-1', materiaId: 'historia', order: 1,
        title: 'El Ciclo del Salitre',
        introduccion: 'Comprende el impacto económico del salitre tras la Guerra del Pacífico y la Cuestión Social.',
        datos_claves: ['El salitre generó grandes ingresos al Estado', 'La Cuestión Social refiere a las precarias condiciones laborales'] }
    ]
  }, {
    id: 'cap-ciencias-1',
    materiaId: 'ciencias',
    title: 'Biología Celular y Ecosistemas',
    introduccion: 'Comprende las diferencias entre células procariontes y eucariontes, y sus organelos.',
    order: 1,
    secciones: [
      { id: 'sec-ciencias-1', capituloId: 'cap-ciencias-1', materiaId: 'ciencias', order: 1,
        title: 'Tipos de Células',
        introduccion: 'Aprende a distinguir las características clave de procariontes y eucariontes (animal y vegetal).',
        datos_claves: ['Las células procariontes no tienen núcleo definido', 'Las células eucariontes vegetales poseen pared celular y cloroplastos'] }
    ]
  }
];
