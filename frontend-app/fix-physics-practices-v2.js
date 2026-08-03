/**
 * Reemplaza todos los niveles de práctica de física con versiones completas:
 * - Al menos 5 ítems/preguntas por nivel
 * - Metodologías variadas (categorize, match-pairs, fill-blanks)
 * - Contenido relevante a la materia de cada capítulo
 *
 * FillBlanks requiere: { title, description, items: [{ id, textBefore, textAfter, options, correctOption, hint }] }
 * MatchPairs requiere: { title, description, pairs: [{ id, left, right, hint }] }
 * Categorize requiere: { title, description, categories: [{id, label}], items: [{id, text, category, hint}] }
 */
const fs = require('fs');
const path = './src/assets/mocks/capitulos-mock-local.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// ============================================================
// DEFINICIÓN COMPLETA DE LAS 13 PRÁCTICAS DE FÍSICA
// ============================================================
const physicsPractices = {

  // ─────────────────────────────────────────────
  // CAP 1: ONDAS, SONIDO Y LUZ
  // ─────────────────────────────────────────────

  'sec-cfis-luz-7': {
    practiceType: 'categorize',
    practiceData: {
      title: '🔦 Detective Óptico: Reflexión vs Refracción',
      description: 'Clasifica cada fenómeno o enunciado según si corresponde a Reflexión o Refracción de la luz.',
      categories: [
        { id: 'refle', label: '🪞 Reflexión' },
        { id: 'refra', label: '💧 Refracción' }
      ],
      items: [
        { id: 1,  text: 'Espejo plano que forma una imagen virtual',              category: 'refle', hint: 'La luz rebota sobre la superficie sin atravesarla.' },
        { id: 2,  text: 'Lente convergente que enfoca rayos paralelos en un punto', category: 'refra', hint: 'La luz cambia de dirección al atravesar el vidrio.' },
        { id: 3,  text: 'Lápiz que parece quebrado dentro de un vaso de agua',    category: 'refra', hint: 'La luz pasa de un medio a otro más denso y se desvía.' },
        { id: 4,  text: 'Tu imagen en la superficie de un lago en calma',          category: 'refle', hint: 'La superficie actúa como espejo.' },
        { id: 5,  text: 'Arcoíris: la luz blanca se descompone al pasar por gotas', category: 'refra', hint: 'Cada color refracta a distinto ángulo.' },
        { id: 6,  text: 'Ángulo de incidencia igual al ángulo de reflexión',       category: 'refle', hint: 'Esta es la Ley de la Reflexión.' },
        { id: 7,  text: 'Fibra óptica que conduce la luz por reflexión interna total', category: 'refle', hint: 'La luz no sale, rebota dentro de la fibra.' }
      ]
    }
  },

  'sec-cfis-ondas-7': {
    practiceType: 'fill-blanks',
    practiceData: {
      title: '🌊 Completar: Propiedades de las Ondas',
      description: 'Selecciona la palabra correcta para completar cada afirmación sobre ondas.',
      items: [
        {
          id: 1,
          textBefore: 'La distancia entre dos crestas consecutivas de una onda se llama',
          textAfter: 'de onda.',
          options: ['longitud', 'amplitud', 'frecuencia', 'período'],
          correctOption: 'longitud',
          hint: 'Se mide en metros y se simboliza con la letra griega λ (lambda).'
        },
        {
          id: 2,
          textBefore: 'El número de oscilaciones completas que ocurren por segundo es la',
          textAfter: 'de la onda, medida en Hertz.',
          options: ['frecuencia', 'amplitud', 'longitud', 'velocidad'],
          correctOption: 'frecuencia',
          hint: 'A mayor frecuencia, mayor energía. Se simboliza con f.'
        },
        {
          id: 3,
          textBefore: 'Las ondas mecánicas, como el sonido, necesitan un',
          textAfter: 'material para poder propagarse.',
          options: ['medio', 'vacío', 'campo', 'espejo'],
          correctOption: 'medio',
          hint: 'A diferencia de las ondas electromagnéticas, no viajan en el vacío.'
        },
        {
          id: 4,
          textBefore: 'La amplitud de una onda está relacionada con la',
          textAfter: 'que transporta: a mayor amplitud, mayor energía.',
          options: ['energía', 'frecuencia', 'longitud', 'velocidad'],
          correctOption: 'energía',
          hint: 'Un terremoto de mayor magnitud tiene ondas de mayor amplitud.'
        },
        {
          id: 5,
          textBefore: 'En una onda transversal, el movimiento de las partículas es',
          textAfter: 'a la dirección de propagación.',
          options: ['perpendicular', 'paralelo', 'opuesto', 'igual'],
          correctOption: 'perpendicular',
          hint: 'Piensa en una cuerda agitada: las partículas suben/bajan mientras la onda va de lado.'
        },
        {
          id: 6,
          textBefore: 'La fórmula que relaciona velocidad, frecuencia y longitud de onda es',
          textAfter: ',  donde v es la velocidad de propagación.',
          options: ['v = f · λ', 'v = f / λ', 'v = f + λ', 'v = λ / f'],
          correctOption: 'v = f · λ',
          hint: 'La velocidad es el producto de la frecuencia por la longitud de onda.'
        }
      ]
    }
  },

  'sec-cfis-sonido-7': {
    practiceType: 'match-pairs',
    practiceData: {
      title: '🔊 Pares: Propiedades del Sonido y la Luz',
      description: 'Conecta cada concepto con su definición o característica correcta.',
      pairs: [
        { id: 1, left: 'Tono (Pitch)',          right: 'Determinado por la frecuencia de la onda sonora',   hint: 'Un sonido agudo tiene alta frecuencia.' },
        { id: 2, left: 'Volumen (Intensidad)',   right: 'Determinado por la amplitud de la onda',            hint: 'Un sonido fuerte tiene gran amplitud.' },
        { id: 3, left: 'Velocidad del sonido',  right: 'Aprox. 340 m/s en el aire a 20°C',                  hint: 'Viaja más rápido en sólidos y líquidos que en gases.' },
        { id: 4, left: 'Velocidad de la luz',   right: 'Aprox. 300.000 km/s en el vacío',                   hint: 'Es la velocidad máxima en el universo (c).' },
        { id: 5, left: 'Efecto Doppler',        right: 'Cambio de frecuencia percibida según el movimiento relativo', hint: 'El sonido de una ambulancia que se acerca parece más agudo.' },
        { id: 6, left: 'Ultrasonido',           right: 'Frecuencias superiores a 20.000 Hz, inaudibles para humanos', hint: 'Se usa en ecografías médicas.' }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // CAP 2: MECÁNICA (CINEMÁTICA Y DINÁMICA)
  // ─────────────────────────────────────────────

  'prac-cine-1': {
    practiceType: 'categorize',
    practiceData: {
      title: '📐 Clasificador: Magnitudes Escalares y Vectoriales',
      description: 'Clasifica cada magnitud física según sea escalar (solo número) o vectorial (número + dirección).',
      categories: [
        { id: 'esc', label: '🔢 Escalar' },
        { id: 'vec', label: '➡️ Vectorial' }
      ],
      items: [
        { id: 1,  text: 'Rapidez (50 km/h)',                                        category: 'esc', hint: 'Solo indica cuán rápido, sin dirección.' },
        { id: 2,  text: 'Velocidad (50 km/h hacia el norte)',                        category: 'vec', hint: 'Tiene módulo y dirección.' },
        { id: 3,  text: 'Masa (70 kg)',                                              category: 'esc', hint: 'No apunta a ningún lado.' },
        { id: 4,  text: 'Fuerza (100 N hacia abajo)',                                category: 'vec', hint: 'F = m·a es vectorial.' },
        { id: 5,  text: 'Temperatura (25 °C)',                                       category: 'esc', hint: 'No tiene dirección espacial.' },
        { id: 6,  text: 'Desplazamiento (3 m al este)',                              category: 'vec', hint: 'Diferente a la distancia: incluye dirección.' },
        { id: 7,  text: 'Distancia recorrida (500 m)',                               category: 'esc', hint: 'Es la longitud total del camino, sin dirección.' },
        { id: 8,  text: 'Aceleración (9.8 m/s² hacia abajo)',                       category: 'vec', hint: 'Cambio de velocidad por unidad de tiempo.' }
      ]
    }
  },

  'prac-cine-2': {
    practiceType: 'fill-blanks',
    practiceData: {
      title: '📈 Completar: Gráficos de Movimiento',
      description: 'Selecciona la palabra correcta que describe cada aspecto de los gráficos cinemáticos.',
      items: [
        {
          id: 1,
          textBefore: 'En un gráfico Posición vs Tiempo (x-t), la pendiente de la recta representa la',
          textAfter: 'del objeto.',
          options: ['velocidad', 'aceleración', 'fuerza', 'distancia'],
          correctOption: 'velocidad',
          hint: 'Pendiente = Δx/Δt = velocidad media.'
        },
        {
          id: 2,
          textBefore: 'Si en un gráfico x-t la recta es horizontal, el objeto se encuentra en estado de',
          textAfter: '.',
          options: ['reposo', 'aceleración', 'caída libre', 'movimiento circular'],
          correctOption: 'reposo',
          hint: 'Posición constante significa que no hay cambio de posición → reposo.'
        },
        {
          id: 3,
          textBefore: 'En un gráfico Velocidad vs Tiempo (v-t), el área bajo la curva representa el',
          textAfter: 'del objeto.',
          options: ['desplazamiento', 'fuerza', 'tiempo', 'trabajo'],
          correctOption: 'desplazamiento',
          hint: 'Área = v · Δt = desplazamiento.'
        },
        {
          id: 4,
          textBefore: 'En un gráfico v-t, la pendiente de la recta representa la',
          textAfter: 'del objeto.',
          options: ['aceleración', 'velocidad', 'posición', 'energía'],
          correctOption: 'aceleración',
          hint: 'Pendiente = Δv/Δt = aceleración.'
        },
        {
          id: 5,
          textBefore: 'Un objeto en Movimiento Rectilíneo Uniformemente Acelerado (MRUA) aparece en el gráfico x-t como una',
          textAfter: ',  no como una recta.',
          options: ['parábola', 'recta', 'hipérbola', 'circunferencia'],
          correctOption: 'parábola',
          hint: 'La posición varía con el cuadrado del tiempo: x = x₀ + v₀t + ½at².'
        },
        {
          id: 6,
          textBefore: 'En caída libre, la aceleración de un objeto es aproximadamente',
          textAfter: 'hacia el centro de la Tierra (en la superficie).',
          options: ['9.8 m/s²', '10 km/h', '340 m/s', '6.67 N/kg'],
          correctOption: '9.8 m/s²',
          hint: 'g ≈ 9.8 m/s² es la aceleración gravitacional estándar.'
        }
      ]
    }
  },

  'prac-dina-1': {
    practiceType: 'match-pairs',
    practiceData: {
      title: '⚙️ Pares: Leyes de Newton y Conceptos de Dinámica',
      description: 'Conecta cada enunciado con la Ley o concepto de dinámica que corresponde.',
      pairs: [
        { id: 1, left: '1ª Ley de Newton (Inercia)',      right: 'Un cuerpo en reposo o MRU permanece así si la ΣF = 0', hint: 'La inercia es la resistencia al cambio de movimiento.' },
        { id: 2, left: '2ª Ley de Newton (F = m·a)',      right: 'La aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa', hint: 'F neta = m × a.' },
        { id: 3, left: '3ª Ley de Newton (Acción-Reacción)', right: 'Si A ejerce fuerza sobre B, B ejerce fuerza igual y opuesta sobre A', hint: 'Las fuerzas de acción y reacción actúan sobre cuerpos distintos.' },
        { id: 4, left: 'Fuerza de Roce Estático',         right: 'Se opone al inicio del movimiento y puede ser mayor que la cinética', hint: 'Es la que hay que vencer para que el objeto empiece a moverse.' },
        { id: 5, left: 'Fuerza Normal',                   right: 'Perpendicular a la superficie de contacto, reacción al peso',   hint: 'En un plano horizontal sin aceleración, N = mg.' },
        { id: 6, left: 'Diagrama de Cuerpo Libre',        right: 'Representación de todas las fuerzas que actúan sobre un cuerpo', hint: 'Es el punto de partida para aplicar la 2ª Ley de Newton.' }
      ]
    }
  },

  'prac-dina-2': {
    practiceType: 'categorize',
    practiceData: {
      title: '💥 Clasificador: Tipos de Choques',
      description: 'Clasifica cada descripción según corresponda a un choque Elástico o Inelástico.',
      categories: [
        { id: 'elas', label: '⚡ Elástico' },
        { id: 'inel', label: '💢 Inelástico' }
      ],
      items: [
        { id: 1,  text: 'Bolas de billar que rebotan sin deformarse',               category: 'elas', hint: 'Se conserva tanto el momento lineal como la energía cinética.' },
        { id: 2,  text: 'Dos autos que chocan y quedan pegados entre sí',           category: 'inel', hint: 'Choque perfectamente inelástico: máxima pérdida de Ec.' },
        { id: 3,  text: 'Colisión ideal entre partículas de gas',                   category: 'elas', hint: 'En el modelo de gas ideal se asumen choques elásticos.' },
        { id: 4,  text: 'Una pelota de arcilla que se aplasta al golpear el suelo', category: 'inel', hint: 'La deformación permanente consume energía cinética.' },
        { id: 5,  text: 'Una pelota de goma que rebota devolviendo casi toda la energía', category: 'elas', hint: 'No hay deformación permanente.' },
        { id: 6,  text: 'Un proyectil que se incrusta en un bloque de madera',      category: 'inel', hint: 'La energía se convierte en calor y deformación.' },
        { id: 7,  text: 'Choque de electrones a altísimas energías (relativista)',  category: 'elas', hint: 'Las partículas elementales se conservan sin pérdida de Ec.' }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // CAP 3: TERMODINÁMICA Y CIENCIAS DE LA TIERRA
  // ─────────────────────────────────────────────

  'prac-termo-1': {
    practiceType: 'fill-blanks',
    practiceData: {
      title: '🌡️ Completar: Calor y Transferencia de Energía',
      description: 'Selecciona la opción correcta para completar cada concepto de termodinámica.',
      items: [
        {
          id: 1,
          textBefore: 'El calor es energía en',
          textAfter: 'que fluye por diferencia de temperatura de un cuerpo a otro.',
          options: ['tránsito', 'almacenamiento', 'reposo', 'compresión'],
          correctOption: 'tránsito',
          hint: 'El calor no se "tiene", se "transfiere". La temperatura sí es una propiedad del cuerpo.'
        },
        {
          id: 2,
          textBefore: 'La transferencia de calor por contacto directo entre sólidos se llama',
          textAfter: '.',
          options: ['conducción', 'convección', 'radiación', 'evaporación'],
          correctOption: 'conducción',
          hint: 'Los metales son buenos conductores. La madera es mala conductora (aislante).'
        },
        {
          id: 3,
          textBefore: 'El movimiento de masas de fluido (líquido o gas) calientes que ascienden es la',
          textAfter: ',  y explica los vientos y las corrientes oceánicas.',
          options: ['convección', 'conducción', 'radiación', 'condensación'],
          correctOption: 'convección',
          hint: 'El fluido caliente es menos denso y sube; el frío baja.'
        },
        {
          id: 4,
          textBefore: 'El calor del Sol llega a la Tierra principalmente mediante',
          textAfter: ',  ya que no hay materia en el espacio.',
          options: ['radiación', 'conducción', 'convección', 'inducción'],
          correctOption: 'radiación',
          hint: 'La radiación no necesita medio material. Viaja como ondas electromagnéticas.'
        },
        {
          id: 5,
          textBefore: 'La fórmula del calor sensible (cambio de temperatura sin cambio de fase) es',
          textAfter: ',  donde c es el calor específico.',
          options: ['Q = m · c · ΔT', 'Q = m · L', 'Q = P · t', 'Q = F · d'],
          correctOption: 'Q = m · c · ΔT',
          hint: 'Q depende de la masa, el material (c) y el cambio de temperatura.'
        },
        {
          id: 6,
          textBefore: 'Durante un cambio de fase (ej: agua hirviendo), la temperatura',
          textAfter: 'aunque se sigue absorbiendo calor (calor latente).',
          options: ['permanece constante', 'sube continuamente', 'baja', 'oscila'],
          correctOption: 'permanece constante',
          hint: 'El calor se usa para romper enlaces intermoleculares, no en aumentar la temperatura.'
        }
      ]
    }
  },

  'prac-termo-2': {
    practiceType: 'match-pairs',
    practiceData: {
      title: '🔥 Pares: Ecuaciones y Conceptos Térmicos',
      description: 'Asocia cada ecuación o concepto con su descripción correcta.',
      pairs: [
        { id: 1, left: 'Q = m · c · ΔT',          right: 'Calor Sensible: calcula el calor para cambiar temperatura',  hint: 'c es el calor específico del material.' },
        { id: 2, left: 'Q = m · L',                 right: 'Calor Latente: calor absorbido/cedido en un cambio de fase',  hint: 'L es el calor latente de fusión o vaporización.' },
        { id: 3, left: 'T(K) = T(°C) + 273',       right: 'Conversión de Celsius a Kelvin (temperatura absoluta)',       hint: 'El cero absoluto (0 K) es -273.15 °C.' },
        { id: 4, left: 'Calor específico del agua', right: '4186 J/(kg·°C): el más alto entre los líquidos comunes',     hint: 'Por eso los océanos regulan el clima terrestre.' },
        { id: 5, left: '1ª Ley de la Termodinámica', right: 'La energía interna de un sistema cambia por calor y trabajo: ΔU = Q − W', hint: 'Principio de conservación de la energía para sistemas térmicos.' },
        { id: 6, left: '2ª Ley de la Termodinámica', right: 'El calor fluye espontáneamente del cuerpo más caliente al más frío', hint: 'Nunca ocurre a la inversa de forma espontánea.' }
      ]
    }
  },

  'prac-tierra-1': {
    practiceType: 'categorize',
    practiceData: {
      title: '🌍 Clasificador: Ondas Sísmicas P y S',
      description: 'Clasifica cada característica según pertenezca a las Ondas P (Primarias) o a las Ondas S (Secundarias).',
      categories: [
        { id: 'p', label: '〰️ Ondas P' },
        { id: 's', label: '🌊 Ondas S' }
      ],
      items: [
        { id: 1,  text: 'Son ondas longitudinales (compresión y rarefacción)',          category: 'p', hint: 'Las partículas se mueven en la misma dirección que la onda.' },
        { id: 2,  text: 'Son ondas transversales (cizallamiento)',                      category: 's', hint: 'Las partículas se mueven perpendicularmente a la dirección de la onda.' },
        { id: 3,  text: 'Llegan primero al sismógrafo tras un terremoto',               category: 'p', hint: 'Las Primarias son más rápidas: ~6-8 km/s en la corteza.' },
        { id: 4,  text: 'No pueden viajar a través del núcleo externo líquido de la Tierra', category: 's', hint: 'Las ondas transversales no se propagan en fluidos.' },
        { id: 5,  text: 'Pueden viajar a través de sólidos, líquidos y gases',         category: 'p', hint: 'Por eso atraviesan todo el interior terrestre.' },
        { id: 6,  text: 'Son más destructivas para los edificios en superficie',        category: 's', hint: 'Su movimiento lateral sacude las estructuras con más violencia.' },
        { id: 7,  text: 'Producen un sonido grave (boom) al llegar a la superficie',  category: 'p', hint: 'Son una forma de onda sonora propagándose en la roca.' }
      ]
    }
  },

  'prac-tierra-2': {
    practiceType: 'match-pairs',
    practiceData: {
      title: '🏔️ Pares: Tectónica de Placas y Capas de la Tierra',
      description: 'Conecta cada término geológico con su descripción correcta.',
      pairs: [
        { id: 1, left: 'Litosfera',          right: 'Capa rígida externa: corteza + manto superior frío',           hint: 'Está fragmentada en placas tectónicas.' },
        { id: 2, left: 'Astenosfera',        right: 'Capa viscosa y caliente del manto sobre la que flotan las placas', hint: 'Permite el movimiento lento de las placas.' },
        { id: 3, left: 'Límite Divergente',  right: 'Placas que se separan: crea nuevo fondo oceánico',              hint: 'Ej: Dorsal del Atlántico Medio.' },
        { id: 4, left: 'Límite Convergente', right: 'Placas que chocan: subducción o formación de montañas',         hint: 'Ej: El Anillo de Fuego del Pacífico genera muchos sismos.' },
        { id: 5, left: 'Límite Transformante', right: 'Placas que deslizan horizontalmente una contra otra',        hint: 'Ej: Falla de San Andrés en California.' },
        { id: 6, left: 'Escala de Richter',  right: 'Mide la energía liberada por un sismo en escala logarítmica',   hint: 'Cada punto de diferencia equivale a 32 veces más energía.' }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // CAP 4: ELECTRICIDAD Y MAGNETISMO
  // ─────────────────────────────────────────────

  'sec-elec-prac-A': {
    practiceType: 'fill-blanks',
    practiceData: {
      title: '⚡ Completar: Electricidad y Fuerza de Coulomb',
      description: 'Completa cada afirmación fundamental sobre electrostática y circuitos.',
      items: [
        {
          id: 1,
          textBefore: 'Cargas eléctricas del mismo signo se',
          textAfter: 'entre sí.',
          options: ['repelen', 'atraen', 'anulan', 'neutralizan'],
          correctOption: 'repelen',
          hint: '+ y + se repelen; − y − se repelen. + y − se atraen.'
        },
        {
          id: 2,
          textBefore: 'La fuerza de Coulomb entre dos cargas es inversamente proporcional al',
          textAfter: 'de la distancia entre ellas.',
          options: ['cuadrado', 'cubo', 'doble', 'raíz'],
          correctOption: 'cuadrado',
          hint: 'F = k·q₁·q₂/r². Si la distancia se duplica, la fuerza se divide por 4.'
        },
        {
          id: 3,
          textBefore: 'La diferencia de potencial eléctrico se mide en',
          textAfter: 'y representa la energía por unidad de carga.',
          options: ['Voltios (V)', 'Amperios (A)', 'Ohmios (Ω)', 'Vatios (W)'],
          correctOption: 'Voltios (V)',
          hint: 'El voltaje es la "presión" que impulsa a los electrones por el circuito.'
        },
        {
          id: 4,
          textBefore: 'Según la Ley de Ohm, la corriente I que circula por un conductor es',
          textAfter: 'proporcional al voltaje V e inversamente proporcional a la resistencia R.',
          options: ['directamente', 'inversamente', 'exponencialmente', 'cuadráticamente'],
          correctOption: 'directamente',
          hint: 'I = V/R. Si aumentas el voltaje con la misma R, la corriente sube.'
        },
        {
          id: 5,
          textBefore: 'En un circuito serie, la resistencia equivalente es la',
          textAfter: 'de todas las resistencias individuales.',
          options: ['suma', 'resta', 'inversa de la suma', 'raíz cuadrada'],
          correctOption: 'suma',
          hint: 'R_total = R₁ + R₂ + R₃ + ... Cada resistor "suma" obstáculos.'
        },
        {
          id: 6,
          textBefore: 'La potencia eléctrica disipada por una resistencia se calcula como',
          textAfter: ',  donde V es el voltaje e I la corriente.',
          options: ['P = V · I', 'P = V + I', 'P = V / I', 'P = I / V'],
          correctOption: 'P = V · I',
          hint: 'También puede escribirse como P = I²R o P = V²/R.'
        }
      ]
    }
  },

  'sec-elec-prac-B': {
    practiceType: 'categorize',
    practiceData: {
      title: '🔌 Clasificador: Circuitos en Serie vs Paralelo',
      description: 'Clasifica cada característica según corresponda a un circuito en Serie o en Paralelo.',
      categories: [
        { id: 'ser', label: '➡️ Serie' },
        { id: 'par', label: '⚡ Paralelo' }
      ],
      items: [
        { id: 1,  text: 'La misma corriente circula por todos los elementos',                category: 'ser', hint: 'Solo hay un camino para los electrones.' },
        { id: 2,  text: 'El voltaje es el mismo en cada rama',                              category: 'par', hint: 'Cada rama "ve" la misma diferencia de potencial.' },
        { id: 3,  text: 'Si un componente se apaga, se corta TODO el circuito',            category: 'ser', hint: 'Como los viejos adornos de navidad: si uno fallaba, todos se apagaban.' },
        { id: 4,  text: 'Si un componente se apaga, los demás continúan funcionando',      category: 'par', hint: 'Así funciona el cableado eléctrico de los hogares.' },
        { id: 5,  text: 'La resistencia equivalente es MAYOR que la de cualquier resistor individual', category: 'ser', hint: 'R_eq = R₁+R₂+... siempre suma.' },
        { id: 6,  text: 'La resistencia equivalente es MENOR que la de cualquier resistor individual', category: 'par', hint: '1/R_eq = 1/R₁+1/R₂+... Más caminos = menos resistencia total.' },
        { id: 7,  text: 'Los electrodomésticos de una casa están conectados así',           category: 'par', hint: 'Cada aparato funciona a 220V independientemente de los demás.' }
      ]
    }
  }
};

// ============================================================
// APLICAR LAS PRÁCTICAS AL JSON
// ============================================================
let replaced = 0;
data.forEach(function(cap) {
  if (cap.materiaId === 'ciencias-fisica') {
    cap.secciones.forEach(function(sec) {
      if (sec.isPractice) {
        const newData = physicsPractices[sec.id];
        if (newData) {
          // Eliminar datos viejos
          delete sec.gameData;
          delete sec.practiceData;
          // Asignar nuevos datos
          sec.practiceType = newData.practiceType;
          sec.practiceData = newData.practiceData;
          replaced++;
          console.log('✓ Actualizado: ' + sec.id + ' (' + sec.practiceType + ', ' + (newData.practiceData.items || newData.practiceData.pairs).length + ' ítems)');
        } else {
          console.log('⚠ Sin datos definidos para: ' + sec.id + ' - se mantiene como estaba.');
        }
      }
    });
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Completado. ' + replaced + '/13 prácticas actualizadas.');
