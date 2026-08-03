const fs = require('fs');
const path = './src/assets/mocks/capitulos-mock-local.json';

let data = JSON.parse(fs.readFileSync(path, 'utf8'));

// We have 13 physics practice levels. We will convert them to match-pairs, categorize, and fill-blanks.
// We will assign them sequentially.

const practices = [
  // 1: Práctica: Detective Óptico -> Categorize (Reflection vs Refraction)
  {
    type: 'categorize',
    data: {
      title: "Clasificador: Óptica",
      description: "Clasifica los fenómenos ópticos en Reflexión o Refracción.",
      categories: [{ id: 'refle', label: 'Reflexión' }, { id: 'refra', label: 'Refracción' }],
      items: [
        { id: 1, text: 'Espejo plano', category: 'refle', hint: 'La luz rebota.' },
        { id: 2, text: 'Lente convergente', category: 'refra', hint: 'La luz atraviesa y se desvía.' },
        { id: 3, text: 'Lápiz quebrado en vaso de agua', category: 'refra', hint: 'Cambio de medio.' },
        { id: 4, text: 'Ver tu rostro en el lago', category: 'refle', hint: 'La superficie del agua actúa como espejo.' }
      ]
    }
  },
  // 2: Práctica: Reconstrucción de un Ejercicio -> Fill Blanks (Ondas)
  {
    type: 'fill-blanks',
    data: {
      title: "Completar: Propiedades de las Ondas",
      description: "Completa el texto arrastrando los conceptos clave de ondas.",
      text: "Una onda mecánica necesita un [medio] material para propagarse, a diferencia de las ondas [electromagnéticas] que pueden viajar en el [vacío]. La distancia entre dos crestas consecutivas se llama [longitud] de onda.",
      words: [
        { id: 'w1', text: 'medio', isDistractor: false },
        { id: 'w2', text: 'electromagnéticas', isDistractor: false },
        { id: 'w3', text: 'vacío', isDistractor: false },
        { id: 'w4', text: 'longitud', isDistractor: false },
        { id: 'w5', text: 'amplitud', isDistractor: true },
        { id: 'w6', text: 'sonoras', isDistractor: true }
      ]
    }
  },
  // 3: Práctica: Relacionar Representaciones -> Match Pairs (Espejos)
  {
    type: 'match-pairs',
    data: {
      title: "Pares: Tipos de Espejos y Lentes",
      description: "Conecta cada elemento óptico con su característica principal.",
      pairs: [
        { id: 1, left: 'Espejo Cóncavo', right: 'Puede formar imágenes reales', hint: 'Concentra la luz.' },
        { id: 2, left: 'Espejo Convexo', right: 'Siempre forma imágenes virtuales y menores', hint: 'Diverge la luz, campo visual amplio.' },
        { id: 3, left: 'Lente Convergente', right: 'Centro más grueso que los bordes', hint: 'Lupa.' },
        { id: 4, left: 'Lente Divergente', right: 'Bordes más gruesos que el centro', hint: 'Separa los rayos de luz.' }
      ]
    }
  },
  // 4: Práctica: Reconstrucción de Cinemática -> Categorize (Scalar vs Vector)
  {
    type: 'categorize',
    data: {
      title: "Clasificador: Magnitudes",
      description: "Clasifica las magnitudes físicas en Escalares o Vectoriales.",
      categories: [{ id: 'esc', label: 'Escalar' }, { id: 'vec', label: 'Vectorial' }],
      items: [
        { id: 1, text: 'Rapidez', category: 'esc', hint: 'Solo magnitud.' },
        { id: 2, text: 'Velocidad', category: 'vec', hint: 'Magnitud y dirección.' },
        { id: 3, text: 'Tiempo', category: 'esc', hint: 'No tiene dirección.' },
        { id: 4, text: 'Desplazamiento', category: 'vec', hint: 'Vector que une inicio y fin.' }
      ]
    }
  },
  // 5: Práctica: Detective de Gráficos -> Fill Blanks (Gráficos Cinemáticos)
  {
    type: 'fill-blanks',
    data: {
      title: "Completar: Análisis de Gráficos",
      description: "Rellena los espacios sobre gráficos de movimiento.",
      text: "En un gráfico de posición vs tiempo, la pendiente representa la [velocidad]. Si la línea es una curva, indica que hay [aceleración]. En un gráfico de velocidad vs tiempo, el [área] bajo la curva representa el [desplazamiento].",
      words: [
        { id: 'w1', text: 'velocidad', isDistractor: false },
        { id: 'w2', text: 'aceleración', isDistractor: false },
        { id: 'w3', text: 'área', isDistractor: false },
        { id: 'w4', text: 'desplazamiento', isDistractor: false },
        { id: 'w5', text: 'fuerza', isDistractor: true },
        { id: 'w6', text: 'trayectoria', isDistractor: true }
      ]
    }
  },
  // 6: Práctica: Conexiones Dinámicas -> Match Pairs (Leyes de Newton)
  {
    type: 'match-pairs',
    data: {
      title: "Pares: Leyes de Newton",
      description: "Asocia cada ley de Newton con su enunciado.",
      pairs: [
        { id: 1, left: 'Primera Ley', right: 'Ley de Inercia', hint: 'Un cuerpo mantiene su estado de movimiento.' },
        { id: 2, left: 'Segunda Ley', right: 'Fuerza es masa por aceleración', hint: 'F = m * a.' },
        { id: 3, left: 'Tercera Ley', right: 'Acción y Reacción', hint: 'Fuerzas en pares.' },
        { id: 4, left: 'Fuerza de Roce', right: 'Se opone al movimiento', hint: 'Depende de la normal y coeficiente.' }
      ]
    }
  },
  // 7: Práctica: Investigador de Impactos -> Categorize (Tipos de Choque)
  {
    type: 'categorize',
    data: {
      title: "Clasificador: Choques",
      description: "Clasifica los siguientes eventos según el tipo de choque.",
      categories: [{ id: 'elas', label: 'Elástico' }, { id: 'inel', label: 'Inelástico' }],
      items: [
        { id: 1, text: 'Bolas de billar rebotando', category: 'elas', hint: 'Se conserva la energía cinética.' },
        { id: 2, text: 'Dos autos que chocan y se deforman', category: 'inel', hint: 'Se pierde energía cinética.' },
        { id: 3, text: 'Arcilla que se estrella y queda pegada', category: 'inel', hint: 'Choque perfectamente inelástico.' },
        { id: 4, text: 'Choque ideal de partículas de gas', category: 'elas', hint: 'Colisión sin pérdida de energía.' }
      ]
    }
  },
  // 8: Investigador Térmico -> Fill Blanks (Termodinámica)
  {
    type: 'fill-blanks',
    data: {
      title: "Completar: Calor y Temperatura",
      description: "Rellena los conceptos termodinámicos faltantes.",
      text: "El [calor] es la energía en tránsito debido a una diferencia de [temperatura]. Existen tres formas de transferencia: [conducción] en sólidos, convección en fluidos y [radiación] en el vacío.",
      words: [
        { id: 'w1', text: 'calor', isDistractor: false },
        { id: 'w2', text: 'temperatura', isDistractor: false },
        { id: 'w3', text: 'conducción', isDistractor: false },
        { id: 'w4', text: 'radiación', isDistractor: false },
        { id: 'w5', text: 'trabajo', isDistractor: true },
        { id: 'w6', text: 'fricción', isDistractor: true }
      ]
    }
  },
  // 9: Laboratorio de Ecuaciones -> Match Pairs (Fórmulas Térmicas)
  {
    type: 'match-pairs',
    data: {
      title: "Pares: Ecuaciones Térmicas",
      description: "Asocia cada ecuación con su descripción.",
      pairs: [
        { id: 1, left: 'Q = m * c * ΔT', right: 'Calor Sensible', hint: 'Cambio de temperatura.' },
        { id: 2, left: 'Q = m * L', right: 'Calor Latente', hint: 'Cambio de fase.' },
        { id: 3, left: 'C = Q / ΔT', right: 'Capacidad Calorífica', hint: 'Depende de la masa total del cuerpo.' },
        { id: 4, left: 'T(K) = T(°C) + 273', right: 'Conversión a Kelvin', hint: 'Temperatura absoluta.' }
      ]
    }
  },
  // 10: Laboratorio Sismológico -> Categorize (Ondas Sísmicas)
  {
    type: 'categorize',
    data: {
      title: "Clasificador: Ondas Sísmicas",
      description: "Clasifica las ondas sísmicas según su tipo de propagación.",
      categories: [{ id: 'p', label: 'Ondas P' }, { id: 's', label: 'Ondas S' }],
      items: [
        { id: 1, text: 'Son ondas longitudinales', category: 'p', hint: 'El medio se comprime y expande.' },
        { id: 2, text: 'Son ondas transversales', category: 's', hint: 'Movimiento perpendicular.' },
        { id: 3, text: 'Viajan a mayor velocidad', category: 'p', hint: 'Llegan primero al sismógrafo.' },
        { id: 4, text: 'Solo viajan por sólidos', category: 's', hint: 'No atraviesan el núcleo externo.' }
      ]
    }
  },
  // 11: Práctica: Detective Tectónico -> Match Pairs (Capas de la Tierra)
  {
    type: 'match-pairs',
    data: {
      title: "Pares: Tierra y Placas",
      description: "Asocia cada término geológico.",
      pairs: [
        { id: 1, left: 'Litosfera', right: 'Capa rígida externa', hint: 'Corteza y manto superior.' },
        { id: 2, left: 'Astenosfera', right: 'Capa viscosa del manto', hint: 'Donde flotan las placas.' },
        { id: 3, left: 'Límite Convergente', right: 'Choque de placas', hint: 'Formación de montañas o subducción.' },
        { id: 4, left: 'Límite Divergente', right: 'Separación de placas', hint: 'Creación de nuevo fondo oceánico.' }
      ]
    }
  },
  // 12: Práctica: Detective Electromagnético -> Fill Blanks (Electricidad)
  {
    type: 'fill-blanks',
    data: {
      title: "Completar: Cargas y Fuerza",
      description: "Completa el texto de electrostática.",
      text: "Cargas del mismo signo se [repelen] y de signos contrarios se [atraen]. La fuerza eléctrica entre dos cargas es directamente proporcional al producto de las cargas e [inversamente] proporcional al [cuadrado] de la distancia.",
      words: [
        { id: 'w1', text: 'repelen', isDistractor: false },
        { id: 'w2', text: 'atraen', isDistractor: false },
        { id: 'w3', text: 'inversamente', isDistractor: false },
        { id: 'w4', text: 'cuadrado', isDistractor: false },
        { id: 'w5', text: 'directamente', isDistractor: true },
        { id: 'w6', text: 'cubo', isDistractor: true }
      ]
    }
  },
  // 13: Práctica: Laboratorio de Circuitos -> Categorize (Circuitos)
  {
    type: 'categorize',
    data: {
      title: "Clasificador: Circuitos",
      description: "Clasifica las propiedades entre circuitos en Serie y en Paralelo.",
      categories: [{ id: 'ser', label: 'Serie' }, { id: 'par', label: 'Paralelo' }],
      items: [
        { id: 1, text: 'Corriente constante en todos los elementos', category: 'ser', hint: 'Un solo camino.' },
        { id: 2, text: 'Voltaje igual en cada rama', category: 'par', hint: 'Caminos independientes.' },
        { id: 3, text: 'La resistencia equivalente es la suma simple', category: 'ser', hint: 'R = R1 + R2.' },
        { id: 4, text: 'Si una bombilla se funde, las demás siguen encendidas', category: 'par', hint: 'No corta el circuito principal.' }
      ]
    }
  }
];

let practiceIdx = 0;

data.forEach(cap => {
  if (cap.materiaId === 'ciencias-fisica') {
    cap.secciones.forEach(sec => {
      if (sec.isPractice) {
        let replacement = practices[practiceIdx % practices.length];
        
        // Remove gameData and set practiceData and practiceType
        delete sec.gameData;
        
        sec.practiceType = replacement.type;
        sec.practiceData = replacement.data;
        
        practiceIdx++;
      }
    });
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully replaced all physics practices with correct methodologies.');
