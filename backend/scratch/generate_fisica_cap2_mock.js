const fs = require('fs');
const path = require('path');

// -------------------------------------------------------------
// DEFINICIÓN DE LA TEORÍA Y LAS PREGUNTAS DEL CAPÍTULO 2 DE FÍSICA (MECÁNICA)
// -------------------------------------------------------------

const capMecanica = {
  id: 'cap-fisica-2-mecanica',
  materiaId: 'ciencias-fisica',
  title: 'Eje Temático: Mecánica',
  introduccion: 'Adéntrate en el estudio del movimiento y las fuerzas que lo gobiernan. Analizaremos desde la cinemática lineal de Galileo hasta las leyes dinámicas de Newton, la naturaleza de las fuerzas cotidianas y los modelos del origen y evolución del universo.',
  order: 2,
  secciones: []
};

// -------------------------------------------------------------
// DEFINICIÓN DE DATOS CONCEPTUALES DE LAS 9 SECCIONES DE MECÁNICA
// -------------------------------------------------------------
const dataSeccionesTeoria = [
  {
    id: 'sec-fis-2-1',
    title: '1. Descripción del movimiento',
    introduccion: 'La cinemática es la rama de la física que describe el movimiento de los cuerpos sin atender a las causas que lo producen. Es crucial comprender la diferencia entre magnitudes vectoriales (como desplazamiento y velocidad) y escalares (como distancia y rapidez).',
    datos_claves: [
      '**Posición y Trayectoria**: La posición es la ubicación espacial respecto a un sistema de referencia. La trayectoria es la línea continua o camino geométrico que describe el cuerpo.',
      '**Distancia ($d$) vs Desplazamiento ($\\vec{\\Delta x}$)**: La distancia es una magnitud escalar (longitud total de la trayectoria). El desplazamiento es una magnitud vectorial que une en línea recta la posición inicial y final ($\\vec{\\Delta x} = \\vec{x}_f - \\vec{x}_i$).',
      '**Rapidez media ($v_m$)**: Escalar. Es la distancia recorrida dividida entre el tiempo empleado ($v_m = d / \\Delta t$).',
      '**Velocidad media ($\\vec{v}_m$)**: Vectorial. Es el desplazamiento dividido entre el tiempo empleado ($\\vec{v}_m = \\vec{\\Delta x} / \\Delta t$). Apunta siempre en la misma dirección que el desplazamiento.'
    ]
  },
  {
    id: 'sec-fis-2-2',
    title: '2. Relatividad de Galileo',
    introduccion: 'El movimiento es un concepto esencialmente relativo: no existe el reposo absoluto. La descripción física del movimiento depende del observador y de su sistema de referencia.',
    datos_claves: [
      '**Sistema de Referencia Inercial (SRI)**: Aquel que se encuentra en reposo absoluto o se mueve a velocidad constante (MRU). En ellos se cumplen rigurosamente las leyes de Newton.',
      '**Principio de relatividad**: Las leyes físicas mecánicas son idénticas en todos los sistemas de referencia inerciales.',
      '**Adición de velocidades de Galileo**: Si un tren viaja a rapidez $v_1$ respecto al suelo, y una persona camina a rapidez $v_2$ respecto al tren en el mismo sentido, la rapidez de la persona respecto al suelo es $v = v_1 + v_2$. Si camina en sentido contrario, es $v = v_1 - v_2$.'
    ]
  },
  {
    id: 'sec-fis-2-3',
    title: '3. Movimiento rectilíneo uniforme',
    introduccion: 'El Movimiento Rectilíneo Uniforme (MRU) es el movimiento más simple en línea recta, caracterizado por una rapidez y una velocidad constantes en el tiempo. El cuerpo recorre distancias idénticas en intervalos de tiempo iguales.',
    datos_claves: [
      '**Velocidad constante**: Implica que la aceleración es nula ($\\vec{a} = 0$) y la trayectoria es estrictamente rectilínea.',
      '**Ecuación de itinerario**: Determina la posición en el tiempo: $x(t) = x_0 + v \\cdot t$, donde $x_0$ es la posición inicial y $v$ es la velocidad.',
      '**Gráfico Posición vs Tiempo ($x/t$)**: Es una línea recta oblicua. La **pendiente** de la recta representa numéricamente la velocidad del móvil.',
      '**Gráfico Velocidad vs Tiempo ($v/t$)**: Es una recta horizontal. El **área bajo la curva** representa el desplazamiento del cuerpo.'
    ]
  },
  {
    id: 'sec-fis-2-4',
    title: '4. Movimiento rectilíneo uniformemente acelerado',
    introduccion: 'El Movimiento Rectilíneo Uniformemente Acelerado (MRUA) se produce cuando un cuerpo viaja en trayectoria recta variando su velocidad de manera uniforme, lo que significa que posee una aceleración constante en el tiempo.',
    datos_claves: [
      '**Aceleración constante ($a$)**: Variación de velocidad por unidad de tiempo ($a = \\Delta v / \\Delta t$). Si $a$ y $v$ tienen el mismo signo, el móvil acelera; si difieren, frena.',
      '**Ecuaciones cinemáticas**: Velocidad final: $v_f = v_i + a \\cdot t$; Posición: $x_t = x_0 + v_i \\cdot t + \\frac{1}{2}a \\cdot t^2$; Relación sin tiempo: $v_f^2 = v_i^2 + 2a\\Delta x$.',
      '**Gráficos**: En $v/t$, la pendiente es la aceleración y el área es el desplazamiento. En $x/t$, el gráfico es una parábola.',
      '**Caída libre y Lanzamiento vertical**: Casos particulares de MRUA donde la aceleración es la gravedad terrestre ($g \\approx 10 \\text{ m/s}^2$ dirigida hacia el centro de la Tierra). En el vacío, todos los cuerpos caen con idéntica aceleración.'
    ]
  },
  {
    id: 'sec-fis-2-5',
    title: '5. Leyes de Newton y diagrama de cuerpo libre',
    introduccion: 'Sir Isaac Newton unificó la física al formular las tres leyes dinámicas que explican cómo las fuerzas cambian el estado de movimiento de los objetos masivos.',
    datos_claves: [
      '**Fuerza ($\\vec{F}$)**: Magnitud vectorial que mide la interacción entre dos cuerpos (en Newtons, $\\text{N}$). Puede provocar deformaciones o cambios de velocidad.',
      '**1ª Ley (Inercia)**: Todo cuerpo permanece en reposo o MRU a menos que una fuerza neta externa actúe sobre él.',
      '**2ª Ley (Dinámica)**: La aceleración es directamente proporcional a la fuerza neta e inversamente proporcional a la masa del cuerpo ($\\vec{F}_{neta} = m \\cdot \\vec{a}$).',
      '**3ª Ley (Acción y Reacción)**: Si el cuerpo A aplica una fuerza sobre B, B aplica una fuerza de igual magnitud, misma dirección pero sentido opuesto sobre A. **Nunca se anulan porque actúan en cuerpos distintos**.',
      '**Diagrama de Cuerpo Libre (DCL)**: Representación esquemática aislada de un cuerpo donde se dibujan vectorialmente todas las fuerzas externas aplicadas sobre él.'
    ]
  },
  {
    id: 'sec-fis-2-6',
    title: '6. Fuerzas: peso, elástica, tensión y normal',
    introduccion: 'En nuestra vida cotidiana interactuamos con fuerzas de diferente naturaleza física que actúan por contacto o a distancia.',
    datos_claves: [
      '**Fuerza de Gravedad o Peso ($\\vec{P}$)**: Fuerza de atracción gravitacional que ejerce la Tierra sobre la masa ($P = m \\cdot g$). Siempre apunta verticalmente hacia abajo.',
      '**Fuerza Normal ($\\vec{N}$)**: Fuerza de soporte de contacto ejercida por una superficie sólida sobre un objeto. Siempre es perpendicular a la superficie.',
      '**Tensión ($\\vec{T}$)**: Fuerza transmitida a través de cuerdas, cables o alambres inextensibles.',
      '**Fuerza Elástica ($\\vec{F}_e$)**: Fuerza de restauración que ejercen los resortes deformados. Se rige por la **Ley de Hooke**: $F_e = -k \\cdot \\Delta x$, donde $k$ es la constante elástica del resorte y $\\Delta x$ la elongación.'
    ]
  },
  {
    id: 'sec-fis-2-7',
    title: '7. Fuerza de roce y resistencia del aire',
    introduccion: 'La fuerza de roce es una fuerza de resistencia al deslizamiento que actúa de forma paralela a la superficie de contacto y se opone al movimiento relativo de los cuerpos.',
    datos_claves: [
      '**Roce Estático ($f_e$)**: Fuerza que impide el inicio del deslizamiento. Es variable y tiene un valor máximo límite ($f_{e,max} = \\mu_e \\cdot N$).',
      '**Roce Cinético ($f_c$)**: Fuerza constante que actúa cuando ya existe deslizamiento activo ($f_c = \\mu_c \\cdot N$). Siempre se cumple que $\\mu_e > \\mu_c$.',
      '**Independencia del área**: La fuerza de roce depende de la naturaleza de los materiales (coeficiente $\\mu$) y de la normal ($N$), pero es independiente del área aparente de contacto.',
      '**Velocidad Terminal**: En una caída real en la atmósfera, la resistencia del aire aumenta al acelerar el cuerpo hasta igualar a la gravedad. En ese instante, la fuerza neta es cero y el cuerpo cae a rapidez constante (velocidad terminal).'
    ]
  },
  {
    id: 'sec-fis-2-8',
    title: '8. Modelos cosmológicos clásicos',
    introduccion: 'El entendimiento de la bóveda celeste y de la posición de la Tierra en el universo ha evolucionado a lo largo de la historia de la ciencia clásica.',
    datos_claves: [
      '**Modelo Geocéntrico (Aristóteles/Ptolomeo)**: La Tierra es el centro inmóvil del universo, y los astros giran a su alrededor en esferas concéntricas complejas (epiciclos).',
      '**Modelo Heliocéntrico (Copérnico/Galileo)**: El Sol es el centro del sistema planetario y la Tierra gira a su alrededor como un planeta más. Galileo demostró esto al descubrir las lunas de Júpiter y las fases de Venus.',
      '**1ª Ley de Kepler**: Los planetas giran alrededor del Sol describiendo órbitas elípticas, con el Sol situado en uno de los focos.',
      '**2ª Ley de Kepler**: El vector de posición Sol-planeta barre áreas iguales en tiempos iguales (los planetas viajan más rápido en el perihelio y más lento en el afelio).'
    ]
  },
  {
    id: 'sec-fis-2-9',
    title: '9. Origen y evolución del universo',
    introduccion: 'La cosmología moderna describe el universo como una entidad dinámica en constante evolución y expansión desde un estado inicial de altísima temperatura y densidad.',
    datos_claves: [
      '**Expansión del Universo**: Edwin Hubble descubrió que la luz de las galaxias lejanas sufre un corrimiento al rojo proporcional a su distancia, demostrando que las galaxias se alejan entre sí.',
      '**Ley de Hubble**: La velocidad de alejamiento ($v$) de una galaxia es directamente proporcional a su distancia ($d$) respecto a nosotros: $v = H_0 \\cdot d$, donde $H_0$ es la constante de Hubble.',
      '**Teoría del Big Bang**: Hipótesis del origen del universo a partir de una gran expansión inicial hace aproximadamente $13.800$ millones de años.',
      '**Evidencias Claves**: El corrimiento al rojo de las galaxias, la abundancia cósmica de elementos ligeros (Hidrógeno y Helio) y la Radiación Cósmica de Fondo de Microondas (CMB).'
    ]
  }
];

// -------------------------------------------------------------
// POOL MASIVO DE 90 PREGUNTAS (10 POR SECCIÓN)
// -------------------------------------------------------------
const poolPreguntasMecanica = [];

// -------------------------------------------------------------
// PREGUNTAS SECCIÓN 1: Descripción del movimiento (1 a 10)
// -------------------------------------------------------------
poolPreguntasMecanica.push(
  {
    id: 'q-fis-2-1-1',
    enunciado: 'Un ciclista viaja en una pista circular de radio $R = 10 \\text{ m}$. Si el ciclista recorre exactamente una vuelta completa y regresa al punto de partida en un tiempo de $20 \\text{ s}$, ¿cuáles son los valores correspondientes a su distancia recorrida ($d$) y a la magnitud de su desplazamiento ($\\Delta x$)? Considere $\\pi \\approx 3$.',
    alternativas: {
      A: '$d = 0 \\text{ m}$ y $\\Delta x = 60 \\text{ m}$',
      B: '$d = 60 \\text{ m}$ y $\\Delta x = 0 \\text{ m}$',
      C: '$d = 30 \\text{ m}$ y $\\Delta x = 20 \\text{ m}$',
      D: '$d = 60 \\text{ m}$ y $\\Delta x = 20 \\text{ m}$'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La distancia ($d$) es la longitud del trayecto real, que equivale al perímetro del círculo: $2\\pi R \\approx 2 \\times 3 \\times 10 = 60 \\text{ m}$. El desplazamiento ($\\Delta x$) es un vector que mide el cambio de posición en línea recta desde el punto inicial al final; como regresó exactamente al mismo punto inicial, su desplazamiento es nulo ($0 \\text{ m}$).',
    feedback_error: 'Distingue entre distancia (escalar, longitud recorrida) y desplazamiento (vector, cambio de posición neto). Si un móvil parte de una posición y tras dar vueltas regresa al mismo punto exacto, el desplazamiento neto es obligatoriamente cero.'
  },
  {
    id: 'q-fis-2-1-2',
    enunciado: 'Un atleta corre $80 \\text{ metros}$ en línea recta hacia el norte, se detiene y luego corre $60 \\text{ metros}$ hacia el este. ¿Cuál es el módulo del vector desplazamiento total realizado por el atleta?',
    alternativas: {
      A: '140 metros',
      B: '100 metros',
      C: '20 metros',
      D: '80 metros'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Las direcciones norte y este forman un ángulo recto ($90^\\circ$). El vector desplazamiento es la hipotenusa de un triángulo rectángulo cuyos catetos miden $80 \\text{ m}$ y $60 \\text{ m}$. Usando el teorema de Pitágoras: $\\Delta x = \\sqrt{80^2 + 60^2} = \\sqrt{6400 + 3600} = \\sqrt{10000} = 100 \\text{ metros}$.',
    feedback_error: 'Dibuja el trayecto. Al correr primero al norte y luego al este, has formado un ángulo de $90^\\circ$. El desplazamiento neto es la distancia directa del punto de partida al punto de llegada, la cual corresponde a la hipotenusa de un triángulo de lados 60 y 80.'
  },
  {
    id: 'q-fis-2-1-3',
    enunciado: '¿Cuál de las siguientes afirmaciones describe de manera físicamente correcta una magnitud vectorial en el contexto del movimiento de una partícula?',
    alternativas: {
      A: 'La distancia recorrida, ya que indica cuánta trayectoria espacial acumuló la partícula.',
      B: 'El tiempo transcurrido en realizar la trayectoria, que fluye en sentido del futuro.',
      C: 'La velocidad instantánea de la partícula, la cual posee módulo, dirección y sentido.',
      D: 'La rapidez media con la que viaja en un auto por una autopista.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien! Las magnitudes vectoriales requieren especificar un módulo (valor numérico y unidad de medida), una dirección (línea de acción espacial) y un sentido (orientación). La velocidad es vectorial. La distancia, el tiempo y la rapidez son magnitudes puramente escalares.',
    feedback_error: 'Recuerda que los vectores tienen tres partes: módulo, dirección y sentido. La rapidez y la distancia son escalares porque solo poseen valor numérico.'
  },
  {
    id: 'q-fis-2-1-4',
    enunciado: 'Un automóvil recorre una distancia de $180 \\text{ km}$ en un intervalo de tiempo de $2,5 \\text{ horas}$. ¿Cuál fue la rapidez media de este automóvil expresada en unidades del Sistema Internacional (m/s)?',
    alternativas: {
      A: '10 m/s',
      B: '20 m/s',
      C: '25 m/s',
      D: '72 m/s'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Primero, calculamos la rapidez en km/h: $v_m = 180 \\text{ km} / 2,5 \\text{ h} = 72 \\text{ km/h}$. Para convertir de km/h a m/s, dividimos por el factor constante de conversión de la física, que es $3,6$: $72 / 3,6 = 20 \\text{ m/s}$.',
    feedback_error: 'Ten cuidado con la conversión de unidades. Tras calcular la rapidez media en kilómetros por hora ($180/2,5 = 72 \\text{ km/h}$), debes transformarla a metros por segundo. Recuerda que para pasar de km/h a m/s se debe dividir entre el factor de conversión $3,6$.'
  },
  {
    id: 'q-fis-2-1-5',
    enunciado: 'Un tren subterráneo viaja por una vía recta hacia la izquierda con rapidez constante. Si el tren se desplaza un tramo horizontal de $120 \\text{ metros}$ en un tiempo de $6 \\text{ segundos}$, ¿cuál es su velocidad media considerando un eje coordenado horizontal $+x$ que apunta hacia la derecha?',
    alternativas: {
      A: '$+20 \\text{ m/s } \\hat{i}$',
      B: '$-20 \\text{ m/s } \\hat{i}$',
      C: '$+720 \\text{ m/s } \\hat{i}$',
      D: '$-720 \\text{ m/s } \\hat{i}$'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La magnitud de la velocidad es de $120 / 6 = 20 \\text{ m/s}$. Como la velocidad es una magnitud vectorial y el tren se mueve hacia la izquierda (sentido opuesto al eje coordenado positivo $+x$), su signo o sentido debe ser negativo, expresándose como $-20 \\text{ m/s } \\hat{i}$.',
    feedback_error: 'La velocidad media es vectorial. Puesto que el movimiento del tren ocurre en el sentido contrario al sentido definido como positivo del eje horizontal, el vector velocidad debe estar antecedido por el signo menos.'
  },
  {
    id: 'q-fis-2-1-6',
    enunciado: 'Un objeto en movimiento se desplaza desde una posición inicial $\\vec{x}_i = -5 \\text{ m } \\hat{i}$ hasta una posición final $\\vec{x}_f = +15 \\text{ m } \\hat{i}$. ¿Cuál es el vector desplazamiento total realizado por el objeto en este recorrido?',
    alternativas: {
      A: '$+10 \\text{ m } \\hat{i}$',
      B: '$-10 \\text{ m } \\hat{i}$',
      C: '$+20 \\text{ m } \\hat{i}$',
      D: '$-20 \\text{ m } \\hat{i}$'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! El desplazamiento es el vector final menos el inicial: $\\vec{\\Delta x} = \\vec{x}_f - \\vec{x}_i = (+15 \\text{ m } \\hat{i}) - (-5 \\text{ m } \\hat{i}) = 15 + 5 = +20 \\text{ m } \\hat{i}$.',
    feedback_error: 'Aplica la fórmula matemática del desplazamiento vectorial: $\\Delta x = x_f - x_i$. Asegúrate de respetar el signo menos de la posición inicial de partida: $(15) - (-5) = 15 + 5$.'
  },
  {
    id: 'q-fis-2-1-7',
    enunciado: 'Un peatón camina por un sendero sinuoso. Si recorre una distancia total de $3 \\text{ km}$ a una rapidez media constante de $6 \\text{ km/h}$, ¿cuántos minutos tarda en completar su trayecto?',
    alternativas: {
      A: '0,5 minutos',
      B: '18 minutos',
      C: '30 minutos',
      D: '120 minutos'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Usando $\\Delta t = d / v$, calculamos el tiempo en horas: $\\Delta t = 3 \\text{ km} / 6 \\text{ km/h} = 0,5 \\text{ horas}$. Como una hora tiene 60 minutos, el tiempo transcurrido es de $0,5 \\times 60 = 30 \\text{ minutos}$.',
    feedback_error: 'Usa la fórmula cinemática del movimiento. Divide la distancia de 3 km entre la rapidez de 6 km/h. Esto te dará el tiempo en horas. Luego, convierte el resultado a minutos multiplicando por 60.'
  },
  {
    id: 'q-fis-2-1-8',
    enunciado: 'Un automóvil de pruebas viaja en línea recta. Durante los primeros 10 segundos avanza con rapidez constante de $20 \\text{ m/s}$. Inmediatamente después, frena y viaja a $10 \\text{ m/s}$ constantes por los siguientes 20 segundos. ¿Cuál fue la rapidez media del móvil durante los 30 segundos totales del recorrido?',
    alternativas: {
      A: '13,3 m/s',
      B: '15,0 m/s',
      C: '16,7 m/s',
      D: '30,0 m/s'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! La rapidez media es la distancia total recorrida dividida entre el tiempo total. Calculamos la distancia del primer tramo: $d_1 = v_1 \\cdot t_1 = 20 \\times 10 = 200 \\text{ m}$. En el segundo tramo: $d_2 = v_2 \\cdot t_2 = 10 \\times 20 = 200 \\text{ m}$. La distancia total es $200 + 200 = 400 \\text{ m}$ en un tiempo de $30 \\text{ s}$. Rapidez media: $v_m = 400 / 30 \\approx 13,3 \\text{ m/s}$.',
    feedback_error: '¡Cuidado con el promedio aritmético simple! No puedes hacer $(20+10)/2 = 15$ porque el móvil viaja más tiempo a menor rapidez. Debes calcular la distancia total de los tramos y dividirla entre el tiempo total del viaje.'
  },
  {
    id: 'q-fis-2-1-9',
    enunciado: 'Al observar una hormiga caminando por el borde de una regla milimetrada recta, notamos que parte de la marca de $0 \\text{ cm}$, avanza hasta $10 \\text{ cm}$, luego retrocede hasta la marca de $6 \\text{ cm}$ y finalmente se detiene. ¿Cuál es la relación matemática correspondiente entre la distancia recorrida ($d$) y la magnitud del desplazamiento total ($\\Delta x$)?',
    alternativas: {
      A: '$d = \\Delta x$',
      B: '$d = 2 \\Delta x$',
      C: '$d = 1,5 \\Delta x$',
      D: '$d = 2,33 \\Delta x$'
    },
    respuesta_correcta: 'D',
    feedback_acierto: '¡Perfecto! La distancia recorrida ($d$) es todo el tramo que caminó la hormiga: avanza 10 cm y luego retrocede 4 cm (de la marca 10 a la 6), sumando $d = 10 + 4 = 14 \\text{ cm}$. El desplazamiento total ($\\Delta x$) es la línea recta final-inicial: $6 - 0 = 6 \\text{ cm}$. La relación $d / \\Delta x$ es $14 / 6 \\approx 2,33 \\implies d = 2,33 \\Delta x$.',
    feedback_error: 'Calcula la distancia recorrida sumando todos los trayectos acumulados ($10 \\text{ cm}$ ida y $4 \\text{ cm}$ vuelta, total $14 \\text{ cm}$). El desplazamiento mide la distancia desde el punto de inicio ($0$) al fin ($6$), lo que da $6 \\text{ cm}$. Divide ambos números para encontrar la proporción.'
  },
  {
    id: 'q-fis-2-1-10',
    enunciado: '¿Es posible que un móvil en movimiento describa una trayectoria en el espacio tal que la magnitud de su desplazamiento ($\\Delta x$) sea estrictamente mayor que la distancia recorrida ($d$)?',
    alternativas: {
      A: 'Sí, ocurre siempre que el movimiento sea curvilíneo acelerado.',
      B: 'Sí, ocurre en los movimientos verticales debido a la gravedad.',
      C: 'No, por definición la línea recta del desplazamiento es la distancia más corta posible entre dos puntos, por lo que siempre $d \\ge \\Delta x$.',
      D: 'No, excepto en los sistemas de referencia inerciales relativos.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En geometría y física, la distancia más corta que une dos puntos en el espacio es estrictamente la línea recta (módulo del desplazamiento). Cualquier otra trayectoria curvilínea o con retrocesos acumulará más distancia, por lo que la distancia recorrida siempre será mayor o igual al desplazamiento ($d \\ge \\Delta x$).',
    feedback_error: 'Piensa geométricamente. ¿Puede haber un camino real más corto para unir dos puntos que la recta directa que los conecta? La recta es el desplazamiento mínimo; por tanto, la distancia real acumulada es siempre igual o mayor.'
  }
);

// -------------------------------------------------------------
// PREGUNTAS SECCIÓN 2: Relatividad de Galileo (11 a 20)
// -------------------------------------------------------------
poolPreguntasMecanica.push(
  {
    id: 'q-fis-2-2-1',
    enunciado: 'Un pasajero camina con rapidez de $2 \\text{ m/s}$ por el pasillo central de un tren en el mismo sentido del movimiento de este. Si el tren viaja a rapidez constante de $25 \\text{ m/s}$ con respecto al suelo del andén de la estación, ¿cuál es la rapidez del pasajero medida por un observador de pie en el andén?',
    alternativas: {
      A: '2 m/s',
      B: '23 m/s',
      C: '25 m/s',
      D: '27 m/s'
    },
    respuesta_correcta: 'D',
    feedback_acierto: '¡Correcto! De acuerdo con las transformaciones de Galileo para la adición de velocidades, si dos movimientos ocurren en el mismo sentido, sus rapideces respecto al sistema externo en reposo se suman algebraicamente: $v = v_{\\text{tren}} + v_{\\text{pasajero}} = 25 + 2 = 27 \\text{ m/s}$.',
    feedback_error: 'Utiliza el principio de relatividad de Galileo. Si ambos móviles se desplazan en la misma dirección y sentido, sus rapideces vistas por alguien afuera se complementan sumándose.'
  },
  {
    id: 'q-fis-2-2-2',
    enunciado: 'Una persona se encuentra de pie sobre una cinta transportadora mecánica que avanza horizontalmente a rapidez constante de $1,5 \\text{ m/s}$ hacia la derecha respecto al suelo de un aeropuerto. Si otra persona camina sobre el suelo del aeropuerto a rapidez de $1,5 \\text{ m/s}$ hacia la derecha de forma paralela a la cinta, ¿cuál es la rapidez de la segunda persona respecto de la primera?',
    alternativas: {
      A: '0 m/s',
      B: '1,5 m/s',
      C: '3,0 m/s',
      D: 'No se puede saber sin conocer las masas.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! Ambos observadores se mueven en paralelo, en la misma dirección y sentido, con la misma rapidez de $1,5 \\text{ m/s}$ respecto al suelo. Por ende, la velocidad relativa entre ellos es nula ($1,5 - 1,5 = 0 \\text{ m/s}$); la primera persona percibe que la segunda está inmóvil a su lado.',
    feedback_error: 'Cuando dos cuerpos se desplazan a la misma velocidad exacta en igual dirección y sentido, la distancia entre ellos no varía con el tiempo. Relativamente, cada uno ve al otro en reposo.'
  },
  {
    id: 'q-fis-2-2-3',
    enunciado: '¿Cuál de las siguientes situaciones cotidianas describe de manera precisa el comportamiento de un **Sistema de Referencia Inercial (SRI)**?',
    alternativas: {
      A: 'Una montaña rusa que gira velozmente describiendo rizos y curvas cerradas.',
      B: 'Un vagón de tren que viaja por una vía rectilínea y lisa a rapidez constante.',
      C: 'Un automóvil frenando bruscamente para detenerse ante un semáforo en rojo.',
      D: 'Un ascensor que comienza a subir y acelera de forma repentina en un rascacielos.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Por definición de la física clásica, un sistema de referencia inercial (SRI) es aquel que no experimenta aceleración alguna, manteniéndose en reposo absoluto o moviéndose a velocidad lineal constante (MRU). El vagón de tren a rapidez constante es un SRI perfecto.',
    feedback_error: 'Los sistemas de referencia inerciales no deben tener aceleración. Cualquier sistema que frene, acelere, curve o rote (como montañas rusas, frenazos o ascensores que arrancan) es no inercial.'
  },
  {
    id: 'q-fis-2-2-4',
    enunciado: 'Un pasajero sentado dentro de un tren que viaja en movimiento rectilíneo uniforme (MRU) a $100 \\text{ km/h}$ deja caer una pequeña pelota de goma de forma vertical desde su mano. Sin considerar la resistencia del aire, ¿qué trayectoria observará el pasajero dentro del tren y qué trayectoria observará una persona estacionaria en el andén?',
    alternativas: {
      A: 'El pasajero verá una trayectoria vertical; el observador en el andén verá una parábola debido al movimiento horizontal acumulado.',
      B: 'Ambos verán una caída vertical pura porque la gravedad atrae hacia abajo.',
      C: 'El pasajero verá una parábola hacia atrás; el observador en el andén verá una caída vertical.',
      D: 'Ambos verán trayectorias parabólicas desfasadas.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! Para el pasajero dentro del tren (SRI), la pelota cae verticalmente porque comparte el movimiento horizontal inercial de $100 \\text{ km/h}$. Para el observador del andén, la pelota posee una velocidad horizontal inicial de $100 \\text{ km/h}$ y acelera verticalmente hacia abajo por la gravedad, describiendo una clásica parábola (lanzamiento horizontal).',
    feedback_error: 'Aplica la inercia de Galileo. La pelota dentro del tren ya posee los 100 km/h horizontales. Al soltarla, no se frena de golpe en el aire, sino que sigue avanzando de forma horizontal al mismo tiempo que cae.'
  },
  {
    id: 'q-fis-2-2-5',
    enunciado: 'Un barco de carga navega hacia el norte a rapidez de $8 \\text{ m/s}$ respecto al agua de un río en calma. Si la tripulación lanza una balsa salvavidas que se desplaza a $6 \\text{ m/s}$ hacia el este respecto al barco, ¿cuál es la rapidez de la balsa medida por un observador de pie en la orilla del río?',
    alternativas: {
      A: '2 m/s',
      B: '10 m/s',
      C: '14 m/s',
      D: '48 m/s'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Los vectores de velocidad del barco (norte) y de la balsa (este) son perpendiculares ($90^\\circ$). Para encontrar el vector velocidad resultante respecto al suelo firme (la orilla), sumamos vectorialmente mediante Pitágoras: $v = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = 10 \\text{ m/s}$.',
    feedback_error: 'Cuando las dos velocidades que se suman relativistamente son perpendiculares en el plano, debes sumarlas vectorialmente como catetos de un triángulo y calcular el módulo de la resultante con Pitágoras.'
  },
  {
    id: 'q-fis-2-2-6',
    enunciado: 'Una persona corre en sentido contrario sobre una cinta mecánica para ejercicios. Si la cinta avanza a rapidez de $4 \\text{ m/s}$ hacia atrás y la persona corre a rapidez de $4 \\text{ m/s}$ hacia adelante respecto a la cinta, ¿cuál es la rapidez de la persona respecto del suelo de la habitación?',
    alternativas: {
      A: '0 m/s',
      B: '4 m/s',
      C: '8 m/s',
      D: '16 m/s'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Perfecto! Las velocidades son opuestas y de igual magnitud: $v = v_{\\text{persona}} - v_{\\text{cinta}} = 4 - 4 = 0 \\text{ m/s}$. La persona corre pero permanece estática en el mismo lugar respecto a la habitación.',
    feedback_error: 'Cuando te mueves a la misma velocidad sobre un tapiz que corre en sentido contrario, tus esfuerzos horizontales se contrarrestan exactamente con el movimiento de la superficie, dejándote inmóvil en el espacio global.'
  },
  {
    id: 'q-fis-2-2-7',
    enunciado: 'Un río fluye hacia el sur con una rapidez constante de $3 \\text{ m/s}$. Un nadador cruza el río nadando perpendicularmente a la corriente hacia el este a rapidez de $4 \\text{ m/s}$ respecto al agua. ¿Cuál es el módulo de la velocidad del nadador respecto de un árbol firme situado en la orilla?',
    alternativas: {
      A: '1 m/s',
      B: '5 m/s',
      C: '7 m/s',
      D: '12 m/s'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Nuevamente las componentes son perpendiculares: la corriente al sur ($3 \\text{ m/s}$) y el nadador al este ($4 \\text{ m/s}$). El módulo resultante medido desde el árbol en la orilla es de $v = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 \\text{ m/s}$.',
    feedback_error: 'Suma vectorialmente los dos movimientos perpendiculares e independientes. Usa Pitágoras con lados 3 y 4.'
  },
  {
    id: 'q-fis-2-2-8',
    enunciado: 'Un camión viaja a rapidez de $80 \\text{ km/h}$ por una carretera recta. Un automóvil avanza por la misma pista a rapidez de $120 \\text{ km/h}$ en el mismo sentido que el camión, acercándose a él desde atrás. ¿A qué rapidez percibe el conductor del camión que se aproxima el automóvil?',
    alternativas: {
      A: '40 km/h',
      B: '80 km/h',
      C: '120 km/h',
      D: '200 km/h'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Correcto! En el movimiento relativo de persecución, la velocidad de acercamiento percibida por el móvil delantero es la resta de las velocidades absolutas: $v = 120 - 80 = 40 \\text{ km/h}$. El conductor ve venir el auto en su espejo retrovisor a $40 \\text{ km/h}$ constantes.',
    feedback_error: 'Dado que ambos se mueven en igual sentido, restas las velocidades para hallar la diferencia relativa entre ellos. De los 120 km/h del auto, 80 km/h sirven solo para igualar al camión, dejando 40 km/h de avance neto.'
  },
  {
    id: 'q-fis-2-2-9',
    enunciado: 'Dos automóviles viajan en sentido contrario por la misma autopista recta, uno al norte a $90 \\text{ km/h}$ y otro al sur a $80 \\text{ km/h}$. Al cruzarse, ¿con qué rapidez relativa se mueve un automóvil respecto del conductor del otro?',
    alternativas: {
      A: '10 km/h',
      B: '85 km/h',
      C: '170 km/h',
      D: '170 km/h'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Cuando dos móviles se desplazan en sentido opuesto (acercamiento o alejamiento frontal), la rapidez relativa es la suma de sus rapideces absolutas: $v = 90 + 80 = 170 \\text{ km/h}$. Es por esto que los choques frontales en carreteras son extremadamente destructivos.',
    feedback_error: 'Al ir en direcciones opuestas y sentidos opuestos, la rapidez aparente de cruce es la suma algebraica directa de ambas velocidades.'
  },
  {
    id: 'q-fis-2-2-10',
    enunciado: 'Si nos encontramos dentro de un laboratorio hermético sin ventanas al exterior y que viaja a bordo de una nave espacial en movimiento rectilíneo uniforme (MRU) absoluto en el espacio, ¿cuál de los siguientes experimentos nos permitirá descubrir a qué velocidad viaja la nave?',
    alternativas: {
      A: 'Medir el tiempo de caída libre de una esfera metálica pesada.',
      B: 'Analizar las oscilaciones periódicas de un péndulo simple calibrado.',
      C: 'Hacer rebotar un haz de luz en espejos para medir su rapidez.',
      D: 'Ninguno, de acuerdo con el Principio de Relatividad de Galileo, las leyes mecánicas son idénticas en reposo y en MRU, impidiendo conocer la velocidad uniforme mediante experimentos internos.'
    },
    respuesta_correcta: 'D',
    feedback_acierto: '¡Soberbio! El principio de relatividad de Galileo establece que no hay ningún experimento físico de carácter mecánico realizado íntegramente dentro de un sistema inercial que pueda revelarnos si el sistema se encuentra en reposo absoluto o viajando a velocidad uniforme (MRU). La velocidad es relativa.',
    feedback_error: 'Este es el concepto filosófico central de la relatividad clásica: el movimiento uniforme es indistinguible físicamente del reposo absoluto si no dispones de un punto de referencia externo para mirar.'
  }
);

// -------------------------------------------------------------
// PREGUNTAS SECCIÓN 3: MRU (21 a 30)
// -------------------------------------------------------------
poolPreguntasMecanica.push(
  {
    id: 'q-fis-2-3-1',
    enunciado: 'Un automóvil se desplaza con movimiento rectilíneo uniforme (MRU) por una carretera horizontal recta. Si el auto pasa por el kilómetro 40 ($x_0 = 40 \\text{ km}$) al iniciar el cronómetro ($t = 0$), y viaja a una velocidad constante de $80 \\text{ km/h}$, ¿cuál es su posición en el kilómetro de la carretera al cabo de $2 \\text{ horas}$?',
    alternativas: {
      A: '120 km',
      B: '160 km',
      C: '200 km',
      D: '240 km'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Usando la ecuación de itinerario del MRU: $x(t) = x_0 + v \\cdot t \\implies x(2) = 40 \\text{ km} + (80 \\text{ km/h} \\times 2 \\text{ h}) = 40 + 160 = 200 \\text{ km}$.',
    feedback_error: 'Usa la fórmula clásica de itinerario: $x = x_0 + v \\cdot t$. Multiplica la velocidad de 80 por el tiempo de 2 horas y suma la posición inicial de partida (40 km).'
  },
  {
    id: 'q-fis-2-3-2',
    enunciado: 'El gráfico de la posición en función del tiempo ($x/t$) para un cuerpo en movimiento rectilíneo es una línea recta inclinada que corta el eje vertical en $x = 10 \\text{ m}$ y pasa por el punto $t = 5 \\text{ s}$, $x = 30 \\text{ m}$. ¿Cuál es el módulo de la velocidad de este cuerpo?',
    alternativas: {
      A: '2 m/s',
      B: '4 m/s',
      C: '6 m/s',
      D: '8 m/s'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! En un gráfico $x/t$, la velocidad corresponde a la pendiente de la recta: $\\text{pendiente} = (x_f - x_i) / (t_f - t_i) = (30 - 10) / (5 - 0) = 20 / 5 = 4 \\text{ m/s}$.',
    feedback_error: 'La velocidad es la pendiente de la recta en la gráfica de posición-tiempo. Calcula la variación de la posición en el eje vertical ($30 - 10 = 20\\text{ m}$) dividida entre el tiempo transcurrido ($5\\text{ s}$).'
  },
  {
    id: 'q-fis-2-3-3',
    enunciado: 'Un tren en MRU viaja a $30 \\text{ m/s}$. ¿Qué distancia recorre en un intervalo de tiempo de $40 \\text{ segundos}$?',
    alternativas: {
      A: '1,2 metros',
      B: '120 metros',
      C: '1200 metros',
      D: '3000 metros'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! En MRU, la distancia es rapidez por tiempo: $d = v \\cdot t = 30 \\text{ m/s} \\times 40 \\text{ s} = 1200 \\text{ metros}$ (o $1,2 \\text{ km}$).',
    feedback_error: 'En MRU la distancia se obtiene directamente multiplicando la rapidez constante por el tiempo empleado. Multiplica 30 por 40.'
  },
  {
    id: 'q-fis-2-3-4',
    enunciado: 'El gráfico de velocidad en función del tiempo ($v/t$) de un móvil en MRU es una línea horizontal paralela al eje del tiempo en $v = 15 \\text{ m/s}$. ¿Qué magnitud física representa el área rectangular bajo esta línea en el intervalo de $t = 0$ a $t = 10 \\text{ s}$?',
    alternativas: {
      A: 'La aceleración constante del móvil, que es de $1,5 \\text{ m/s}^2$.',
      B: 'El desplazamiento del móvil en ese tiempo, el cual equivale a $150 \\text{ metros}$.',
      C: 'La posición inicial del móvil, que se sitúa a $15 \\text{ metros}$.',
      D: 'El tiempo total empleado para detenerse.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! En cualquier gráfico de velocidad contra tiempo ($v/t$), el área bajo la curva (o recta) en un intervalo representa exactamente el desplazamiento de la partícula. En este caso, el área del rectángulo es $\\text{base} \\times \\text{altura} = 10 \\text{ s} \\times 15 \\text{ m/s} = 150 \\text{ metros}$.',
    feedback_error: 'Recuerda que en una gráfica $v/t$, multiplicar el eje vertical (velocidad) por el eje horizontal (tiempo) nos da unidades de metros. El área encerrada representa el desplazamiento.'
  },
  {
    id: 'q-fis-2-3-5',
    enunciado: '¿Cuál de las siguientes condiciones dinámicas debe cumplirse obligatoriamente sobre un objeto para que este describa un MRU en el espacio?',
    alternativas: {
      A: 'La fuerza de gravedad debe ser la única fuerza aplicada sobre él.',
      B: 'La fuerza neta aplicada sobre el cuerpo debe ser estrictamente cero (equilibrio de fuerzas).',
      C: 'Debe aplicarse una fuerza neta constante en la misma dirección de la trayectoria.',
      D: 'El cuerpo no debe poseer masa inercial.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! De acuerdo con la Primera Ley de Newton (Inercia), para que un móvil viaje en línea recta a rapidez constante (MRU), su velocidad no debe variar en módulo ni en dirección. Por tanto, su aceleración debe ser cero, lo que implica por la Segunda Ley ($F_{neta} = ma$) que la fuerza neta externa debe ser estrictamente nula.',
    feedback_error: 'Si hay una fuerza neta distinta de cero sobre un cuerpo, este experimentará una aceleración, cambiando su rapidez o trayectoria. Por lo tanto, para mantener la velocidad constante el cuerpo debe estar en equilibrio dinámico.'
  },
  {
    id: 'q-fis-2-3-6',
    enunciado: 'Un tren de $100 \\text{ metros}$ de longitud viaja en MRU a rapidez constante de $20 \\text{ m/s}$. ¿Cuánto tiempo tarda en atravesar completamente un túnel recto de $300 \\text{ metros}$ de largo?',
    alternativas: {
      A: '5 segundos',
      B: '10 segundos',
      C: '15 segundos',
      D: '20 segundos'
    },
    respuesta_correcta: 'D',
    feedback_acierto: '¡Excelente! Para cruzar completamente el túnel, la parte delantera del tren debe recorrer no solo el largo del túnel ($300 \\text{ m}$), sino que la parte trasera también debe salir del mismo, lo que añade el largo del propio tren ($100 \\text{ m}$). La distancia total a recorrer es de $300 + 100 = 400 \\text{ m}$ a una rapidez de $20 \\text{ m/s}$. El tiempo es $\\Delta t = 400 / 20 = 20 \\text{ segundos}$.',
    feedback_error: 'Ten cuidado con objetos de gran envergadura física. La distancia a recorrer para cruzar un túnel en su totalidad es la suma geométrica de la longitud del túnel y la longitud del propio vehículo.'
  },
  {
    id: 'q-fis-2-3-7',
    enunciado: 'Dos personas corren en MRU en una pista recta al encuentro mutuo. El corredor A parte de $x = 0 \\text{ m}$ a rapidez de $4 \\text{ m/s}$ hacia la derecha. El corredor B parte simultáneamente de $x = 120 \\text{ m}$ a rapidez de $6 \\text{ m/s}$ hacia la izquierda. ¿En qué posición ($x$) de la pista se cruzarán?',
    alternativas: {
      A: '$x = 12 \\text{ m}$',
      B: '$x = 48 \\text{ m}$',
      C: '$x = 60 \\text{ m}$',
      D: '$x = 72 \\text{ m}$'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Perfecto! Planteando las ecuaciones de itinerario: $x_A(t) = 4t$ y $x_B(t) = 120 - 6t$ (signo menos porque va a la izquierda). Al cruzarse $x_A = x_B \\implies 4t = 120 - 6t \\implies 10t = 120 \\implies t = 12 \\text{ s}$. Evaluando el tiempo de encuentro en la posición de A: $x_A = 4 \\times 12 = 48 \\text{ metros}$.',
    feedback_error: 'Escribe las ecuaciones de itinerario de ambos corredores. Para el de la izquierda, la velocidad se resta. Iguala las posiciones para hallar el tiempo de encuentro y luego calcula la posición final.'
  },
  {
    id: 'q-fis-2-3-8',
    enunciado: 'Un gráfico $x/t$ muestra dos líneas rectas de móviles en MRU. La línea del móvil A tiene una pendiente de $30^\\circ$ respecto al eje temporal, mientras que la del móvil B tiene una pendiente de $60^\\circ$. ¿Cuál de los móviles viaja a mayor rapidez?',
    alternativas: {
      A: 'El móvil A, porque las pendientes pequeñas denotan recorridos de larga distancia.',
      B: 'El móvil B, porque a mayor pendiente de la recta $x/t$, mayor es la velocidad.',
      C: 'Ambos tienen la misma rapidez porque las gráficas son rectas simétricas.',
      D: 'No se puede determinar sin conocer el origen coordenado.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! En los gráficos de posición vs tiempo ($x/t$), la velocidad es la pendiente de la recta. Puesto que la pendiente de la recta del móvil B ($60^\\circ$) es mayor que la de A ($30^\\circ$), la rapidez del móvil B es superior (recorre más distancia en menor tiempo).',
    feedback_error: 'Asocia la pendiente visual con la rapidez. Una recta más empinada indica que la distancia cambia de forma muy rápida a medida que transcurre el tiempo.'
  },
  {
    id: 'q-fis-2-3-9',
    enunciado: 'Un haz de luz láser en el vacío ($v = 300.000 \\text{ km/s}$) tarda exactamente $8 \\text{ minutos y 20 segundos}$ en viajar en línea recta desde la superficie del Sol hasta la Tierra. ¿Cuál es la distancia aproximada entre el Sol y la Tierra en millones de kilómetros?',
    alternativas: {
      A: '15 millones de km',
      B: '150 millones de km',
      C: '1500 millones de km',
      D: '15.000 millones de km'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Convertimos el tiempo total a segundos: $8 \\text{ min } \\times 60 \\text{ s/min} + 20 \\text{ s} = 480 + 20 = 500 \\text{ segundos}$. Usando la relación del MRU: $d = v \\cdot t = (300.000 \\text{ km/s}) \\times 500 \\text{ s} = 150.000.000 \\text{ km} = 150 \\text{ millones de km}$.',
    feedback_error: 'Convierte el tiempo de minutos y segundos a segundos totales (500 segundos). Multiplica la rapidez de la luz por este tiempo y convierte la distancia final a millones de kilómetros.'
  },
  {
    id: 'q-fis-2-3-10',
    enunciado: 'Un móvil viaja con MRU. Si durante un intervalo de tiempo de $5 \\text{ segundos}$ su desplazamiento es de $+50 \\text{ m } \\hat{i}$, ¿cuál será su desplazamiento durante los siguientes $15 \\text{ segundos}$ de movimiento?',
    alternativas: {
      A: '$+50 \\text{ m } \\hat{i}$',
      B: '$+100 \\text{ m } \\hat{i}$',
      C: '$+150 \\text{ m } \\hat{i}$',
      D: '$+200 \\text{ m } \\hat{i}$'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Al ser un MRU, la velocidad es estrictamente constante. En el primer tramo la velocidad es de $50 \\text{ m} / 5 \\text{ s} = 10 \\text{ m/s } \\hat{i}$. En los siguientes $15 \\text{ segundos}$, manteniendo la misma velocidad de $10 \\text{ m/s}$, su desplazamiento será $\\vec{\\Delta x} = \\vec{v} \\cdot t = (10 \\text{ m/s } \\hat{i}) \\times 15 \\text{ s} = +150 \\text{ m } \\hat{i}$.',
    feedback_error: 'Dado que la velocidad es constante en MRU, las distancias recorridas son directamente proporcionales a los tiempos empleados. Si el tiempo se triplica (de 5 a 15 segundos), el desplazamiento también se triplicará.'
  }
);

// -------------------------------------------------------------
// PREGUNTAS SECCIÓN 4: MRUA (31 a 40)
// -------------------------------------------------------------
poolPreguntasMecanica.push(
  {
    id: 'q-fis-2-4-1',
    enunciado: 'Un automóvil parte del reposo ($v_i = 0$) en una carretera recta y acelera uniformemente a razón de $3 \\text{ m/s}^2$ durante $6 \\text{ segundos}$. ¿Cuál es la rapidez final alcanzada por el auto al término de este intervalo?',
    alternativas: {
      A: '9 m/s',
      B: '18 m/s',
      C: '36 m/s',
      D: '54 m/s'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Usando la ecuación de velocidad para el MRUA: $v_f = v_i + a \\cdot t \\implies v_f = 0 + (3 \\text{ m/s}^2 \\times 6 \\text{ s}) = 18 \\text{ m/s}$.',
    feedback_error: 'Aplica la fórmula básica de velocidad final en MRUA: $v_f = v_i + a \\cdot t$. Puesto que parte del reposo, solo debes multiplicar la aceleración constante por el tiempo.'
  },
  {
    id: 'q-fis-2-4-2',
    enunciado: 'Una piedra se suelta desde la terraza de un edificio de $45 \\text{ metros}$ de altura. Si despreciamos la resistencia del aire y consideramos la aceleración de gravedad como $g = 10 \\text{ m/s}^2$, ¿cuánto tiempo tardará la piedra en impactar contra el suelo?',
    alternativas: {
      A: '3 segundos',
      B: '4,5 segundos',
      C: '6 segundos',
      D: '9 segundos'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! En caída libre, la altura se rige por $h = \\frac{1}{2}g t^2$ si parte del reposo. Despejamos el tiempo: $t = \\sqrt{2h/g} = \\sqrt{2 \\times 45 / 10} = \\sqrt{90/10} = \\sqrt{9} = 3 \\text{ segundos}$.',
    feedback_error: 'Usa la fórmula de posición para caída libre desde el reposo: $h = \\frac{1}{2}g t^2$. Multiplica la altura por 2, divídela por 10 y extrae la raíz cuadrada del resultado para obtener el tiempo.'
  },
  {
    id: 'q-fis-2-4-3',
    enunciado: 'Un tren que viaja a rapidez de $30 \\text{ m/s}$ aplica los frenos de forma repentina experimentando una desaceleración uniforme de $-2 \\text{ m/s}^2$ hasta detenerse por completo. ¿Qué distancia recorre el tren durante la maniobra de frenado?',
    alternativas: {
      A: '15 metros',
      B: '60 metros',
      C: '225 metros',
      D: '450 metros'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Usando la ecuación independiente del tiempo: $v_f^2 = v_i^2 + 2a\\Delta x$. Como se detiene, $v_f = 0 \\implies 0 = 30^2 + 2(-2)\\Delta x \\implies 0 = 900 - 4\\Delta x \\implies 4\\Delta x = 900 \\implies \\Delta x = 225 \\text{ metros}$.',
    feedback_error: 'Utiliza la ecuación cinemática que no requiere el tiempo: $v_f^2 = v_i^2 + 2a\\Delta x$. Recuerda colocar la aceleración de frenado con signo negativo y despejar la distancia total.'
  },
  {
    id: 'q-fis-2-4-4',
    enunciado: 'Un proyectil es lanzado verticalmente hacia arriba desde el suelo con una rapidez inicial de $40 \\text{ m/s}$. Si despreciamos la fricción atmosférica y tomamos $g = 10 \\text{ m/s}^2$, ¿cuál es la altura máxima alcanzada por el proyectil respecto del suelo?',
    alternativas: {
      A: '40 metros',
      B: '80 metros',
      C: '160 metros',
      D: '320 metros'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! En el punto más alto del lanzamiento vertical, la velocidad instantánea es nula ($v_f = 0$). De la ecuación $v_f^2 = v_i^2 - 2gh_{\\text{max}}$, despejamos la altura: $h_{\\text{max}} = v_i^2 / 2g = 40^2 / (2 \\times 10) = 1600 / 20 = 80 \\text{ metros}$.',
    feedback_error: 'En el punto de altura máxima, la velocidad es momentáneamente cero. Usa la ecuación de Torricelli para lanzamientos verticales ($v_f^2 = v_i^2 - 2gh$) y despeja la altura máxima.'
  },
  {
    id: 'q-fis-2-4-5',
    enunciado: 'Un objeto de $5 \\text{ kg}$ de masa y otro objeto de $50 \\text{ kg}$ de masa se dejan caer simultáneamente y desde la misma altura en una cámara donde se ha realizado un vacío completo (despreciando la resistencia del aire). ¿Cuál de las siguientes afirmaciones describe de manera físicamente correcta el comportamiento de caída de ambos objetos?',
    alternativas: {
      A: 'El objeto de $50 \\text{ kg}$ caerá diez veces más rápido por tener mayor fuerza de gravedad.',
      B: 'El objeto de $5 \\text{ kg}$ caerá más rápido debido a que ofrece menor inercia al movimiento.',
      C: 'Ambos objetos tocarán el suelo exactamente al mismo tiempo y con idéntica velocidad por caer con la misma aceleración gravitatoria.',
      D: 'El objeto más liviano flotará momentáneamente por su menor peso relativo.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien! Este es el experimento mental de Galileo Galilei. En el vacío (sin aire), todos los cuerpos aceleran exactamente al mismo ritmo debido a la gravedad terrestre ($g$), independientemente de su masa. Si bien el objeto más pesado sufre mayor fuerza gravitacional (peso), también posee mayor inercia (oposición a acelerar) en idéntica proporción, cancelándose la masa en la cinemática de caída.',
    feedback_error: 'Aunque la Tierra atrae con más fuerza al objeto pesado, este también es más difícil de mover (mayor masa inercial). En el vacío, estas dos propiedades se equilibran y causan que todo caiga con la misma aceleración.'
  },
  {
    id: 'q-fis-2-4-6',
    enunciado: 'El gráfico de velocidad en función del tiempo ($v/t$) de un móvil en MRUA es una línea recta inclinada oblicua. Si a $t = 0$ la velocidad es $10 \\text{ m/s}$ y a $t = 5 \\text{ s}$ es $30 \\text{ m/s}$, ¿cuál es la aceleración del móvil?',
    alternativas: {
      A: '$2 \\text{ m/s}^2$',
      B: '$4 \\text{ m/s}^2$',
      C: '$6 \\text{ m/s}^2$',
      D: '$8 \\text{ m/s}^2$'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! En los gráficos $v/t$, la pendiente es la aceleración: $a = \\text{pendiente} = (v_f - v_i) / (t_f - t_i) = (30 - 10) / (5 - 0) = 20 / 5 = 4 \\text{ m/s}^2$.',
    feedback_error: 'Calcula la variación de velocidad en el eje vertical (30 - 10 = 20 m/s) dividida entre el tiempo que tomó el cambio (5 segundos).'
  },
  {
    id: 'q-fis-2-4-7',
    enunciado: '¿Qué distancia recorre en total el móvil del gráfico anterior (de $t=0$ a $t=5\\text{ s}$) con $v_i = 10 \\text{ m/s}$, $v_f = 30 \\text{ m/s}$ y $a = 4 \\text{ m/s}^2$?',
    alternativas: {
      A: '50 metros',
      B: '100 metros',
      C: '150 metros',
      D: '200 metros'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! En los gráficos $v/t$, el desplazamiento es el área bajo la curva. El área de este trapecio es $\\text{Área} = \\frac{v_i + v_f}{2} \\cdot t = \\frac{10 + 30}{2} \\cdot 5 = 20 \\times 5 = 100 \\text{ metros}$. También se puede usar la ecuación de posición: $x = 10 \\times 5 + 0,5 \\times 4 \\times 5^2 = 50 + 50 = 100 \\text{ m}$.',
    feedback_error: 'Calcula la distancia recorrida usando la ecuación de posición del MRUA: $d = v_i t + \\frac{1}{2}a t^2$. Sustituye $v_i=10$, $t=5$ y $a=4$ y realiza las operaciones algebraicas.'
  },
  {
    id: 'q-fis-2-4-8',
    enunciado: 'Un cuerpo que realiza un MRUA parte de la posición de origen $x = 0 \\text{ m}$ con velocidad inicial nula. Si en el primer segundo recorre una distancia $d$, ¿cuál será la distancia recorrida al cabo de los primeros $3 \\text{ segundos}$ en función de $d$?',
    alternativas: {
      A: '$3 d$',
      B: '$6 d$',
      C: '$9 d$',
      D: '$27 d$'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente deducción! De la ecuación de itinerario sin velocidad inicial: $x(t) = \\frac{1}{2} a t^2$. Esto nos muestra que la posición y distancia recorrida son proporcionales al cuadrado del tiempo ($x \\propto t^2$). Si el tiempo transcurrido se triplica ($3$ veces mayor), la distancia se multiplica por $3^2 = 9$. Por tanto, recorre $9d$.',
    feedback_error: 'En un movimiento acelerado desde el reposo, el espacio recorrido no aumenta linealmente, sino de forma cuadrática con el tiempo ($t^2$). Si el tiempo se multiplica por 3, la distancia se multiplicará por el cuadrado de 3.'
  },
  {
    id: 'q-fis-2-4-9',
    enunciado: 'Un automovilista viaja a rapidez de $20 \\text{ m/s}$. De pronto avista un obstáculo en la pista y le toma $0,5 \\text{ segundos}$ reaccionar y presionar los frenos (tiempo de reacción). A partir de que pisa el freno, el auto desacelera a $-5 \\text{ m/s}^2$ hasta detenerse. ¿Cuál es la distancia total de detención (distancia recorrida desde que vio el obstáculo hasta que se detuvo)?',
    alternativas: {
      A: '10 metros',
      B: '40 metros',
      C: '50 metros',
      D: '60 metros'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! El movimiento consta de dos fases: 1) Durante el tiempo de reacción ($0,5 \\text{ s}$), el auto sigue a velocidad constante de $20 \\text{ m/s}$ (MRU): $d_1 = v \\cdot t = 20 \\times 0,5 = 10 \\text{ m}$. 2) Al frenar experimenta un MRUA hasta detenerse: $d_2 = v_i^2 / 2|a| = 20^2 / (2 \\times 5) = 400 / 10 = 40 \\text{ m}$. Distancia total: $10 + 40 = 50 \\text{ metros}$.',
    feedback_error: 'Divide el problema en dos partes físicas. Primero calcula cuánto avanza el auto a velocidad constante antes de que el conductor reaccione. Luego calcula la distancia de frenado con la desaceleración dada.'
  },
  {
    id: 'q-fis-2-4-10',
    enunciado: 'Un objeto es lanzado verticalmente hacia arriba en el vacío. Si tarda $4 \\text{ segundos}$ en alcanzar su punto más alto (altura máxima), ¿con qué rapidez inicial fue lanzado? Considere $g = 10 \\text{ m/s}^2$.',
    alternativas: {
      A: '10 m/s',
      B: '20 m/s',
      C: '40 m/s',
      D: '80 m/s'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! En el punto más alto, la velocidad es $0$. Usando $v_f = v_i - gt \\implies 0 = v_i - 10 \\times 4 \\implies v_i = 40 \\text{ m/s}$.',
    feedback_error: 'La gravedad terrestre reduce la velocidad de los objetos lanzados hacia arriba a un ritmo constante de $10 \\text{ m/s}$ cada segundo. Si el móvil tardó 4 segundos en frenar totalmente, debió haber partido a 40 m/s.'
  }
);

// -------------------------------------------------------------
// PREGUNTAS SECCIÓN 5: Leyes de Newton y DCL (41 a 50)
// -------------------------------------------------------------
poolPreguntasMecanica.push(
  {
    id: 'q-fis-2-5-1',
    enunciado: 'De acuerdo con la Primera Ley de Newton (Inercia), si sobre un cuerpo rígido en movimiento no actúa ninguna fuerza neta externa, ¿cuál será el comportamiento de dicho cuerpo?',
    alternativas: {
      A: 'Disminuirá gradualmente su rapidez hasta detenerse por completo por inercia.',
      B: 'Describirá una trayectoria circular a rapidez constante.',
      C: 'Mantendrá de forma indefinida su velocidad constante en línea recta (MRU).',
      D: 'Aumentará su rapidez de forma exponencial en el espacio.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! La inercia es la propiedad de los cuerpos de resistirse a cambiar su estado de reposo o movimiento rectilíneo uniforme. Si la fuerza neta externa es nula, la aceleración es nula, por lo que el cuerpo conserva intacta su velocidad constante de forma indefinida.',
    feedback_error: 'La tendencia natural de la materia no es detenerse (eso ocurre en la Tierra debido a la fricción o roce que es una fuerza externa), sino conservar su estado de movimiento o reposo.'
  },
  {
    id: 'q-fis-2-5-2',
    enunciado: 'Se aplica una fuerza neta constante de $24 \\text{ Newtons}$ sobre un objeto de masa $6 \\text{ kg}$. ¿Cuál es la aceleración experimentada por el objeto de acuerdo con la Segunda Ley de Newton?',
    alternativas: {
      A: '$4 \\text{ m/s}^2$',
      B: '$18 \\text{ m/s}^2$',
      C: '$30 \\text{ m/s}^2$',
      D: '$144 \\text{ m/s}^2$'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Correcto! De la Segunda Ley de Newton: $F = m \\cdot a$. Despejamos la aceleración: $a = F / m = 24 \\text{ N} / 6 \\text{ kg} = 4 \\text{ m/s}^2$.',
    feedback_error: 'Aplica la fórmula fundamental $F = m \\cdot a$. Despeja la aceleración dividiendo la fuerza entre la masa del cuerpo.'
  },
  {
    id: 'q-fis-2-5-3',
    enunciado: 'Un martillo golpea un clavo metálico sobre una madera, ejerciendo una fuerza vertical hacia abajo de $500 \\text{ N}$. Según la Tercera Ley de Newton (Acción y Reacción), ¿cuál de las siguientes opciones describe correctamente la fuerza de reacción?',
    alternativas: {
      A: 'Una fuerza de $500 \\text{ N}$ ejercida por la madera sobre el clavo hacia arriba.',
      B: 'Una fuerza de $500 \\text{ N}$ ejercida por el clavo sobre el martillo hacia arriba.',
      C: 'Una fuerza de $250 \\text{ N}$ ejercida por el martillo sobre sí mismo hacia arriba.',
      D: 'La fuerza de reacción es cero, ya que el clavo se introduce en la madera.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Las fuerzas de acción y reacción actúan siempre en parejas, poseen idéntico módulo ($500 \\text{ N}$), misma dirección (vertical) pero sentidos opuestos, y se aplican en cuerpos mutuamente interactuantes distintos: si el martillo empuja al clavo hacia abajo (Acción), el clavo empuja al martillo hacia arriba (Reacción).',
    feedback_error: 'Las fuerzas de reacción son simétricas y se aplican en el cuerpo que ejerció la acción original. Si el martillo golpeó al clavo, el clavo devuelve la misma fuerza sobre el martillo.'
  },
  {
    id: 'q-fis-2-5-4',
    enunciado: 'Un bloque de $10 \\text{ kg}$ reposa sobre una mesa lisa horizontal sin fricción. Se le aplican dos fuerzas horizontales simultáneas en sentidos opuestos: una de $30 \\text{ N}$ hacia la derecha ($+x$) y otra de $10 \\text{ N}$ hacia la izquierda ($-x$). ¿Cuál es la magnitud de la aceleración resultante del bloque?',
    alternativas: {
      A: '$1 \\text{ m/s}^2$',
      B: '$2 \\text{ m/s}^2$',
      C: '$3 \\text{ m/s}^2$',
      D: '$4 \\text{ m/s}^2$'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Calculamos la fuerza neta sumando vectorialmente: $F_{neta} = 30 \\text{ N} - 10 \\text{ N} = 20 \\text{ N}$ hacia la derecha. Usando la Segunda Ley, la aceleración es $a = F_{neta} / m = 20 \\text{ N} / 10 \\text{ kg} = 2 \\text{ m/s}^2$.',
    feedback_error: 'Al actuar las fuerzas en sentidos opuestos en el mismo eje horizontal, debes restar sus magnitudes para encontrar la fuerza neta real resultante, y luego aplicar $a = F/m$.'
  },
  {
    id: 'q-fis-2-5-5',
    enunciado: '¿Por qué las fuerzas de Acción y Reacción enunciadas en la Tercera Ley de Newton nunca se cancelan ni se anulan entre sí, a pesar de tener igual módulo, misma dirección y sentidos opuestos?',
    alternativas: {
      A: 'Porque actúan en instantes de tiempo levemente desfasados.',
      B: 'Porque actúan sobre cuerpos físicos diferentes.',
      C: 'Porque son de distinta naturaleza física (una es gravitacional y la otra de contacto).',
      D: 'Sí se cancelan, provocando el reposo absoluto en el universo.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Para que dos fuerzas se cancelen u anulen entre sí, deben estar aplicadas sobre el mismo cuerpo (como empujar una caja de lados opuestos). Las fuerzas de acción y reacción se ejercen sobre cuerpos distintos (ej. el pie patea a la pelota y la pelota empuja al pie), por lo que cada una produce efectos de aceleración independientes en su respectivo objeto.',
    feedback_error: 'Esta es una de las preguntas conceptuales más típicas de las leyes de Newton. La anulación de fuerzas solo ocurre si actúan sobre un mismo cuerpo. Si actúan sobre cuerpos diferentes, no se restan.'
  },
  {
    id: 'q-fis-2-5-6',
    enunciado: 'Un ascensor de $500 \\text{ kg}$ de masa sube con una velocidad constante de $2 \\text{ m/s}$. ¿Cuál es el valor de la tensión del cable que sostiene el ascensor? Considere $g = 10 \\text{ m/s}^2$ y desprecie la fricción.',
    alternativas: {
      A: '0 N',
      B: '1000 N',
      C: '5000 N',
      D: '6000 N'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Puesto que el ascensor sube a velocidad constante (MRU), su aceleración es cero ($a = 0$). De acuerdo con la Segunda Ley de Newton, la fuerza neta sobre el ascensor es cero ($F_{neta} = T - P = 0 \\implies T = P$). Por ende, la tensión $T$ es igual al peso $P = m \\cdot g = 500 \\text{ kg} \\times 10 \\text{ m/s}^2 = 5000 \\text{ N}$.',
    feedback_error: '¡Atención a la velocidad constante! Indica que el ascensor está en equilibrio de fuerzas (aceleración cero). Por lo tanto, la tensión del cable debe compensar exactamente al peso del ascensor.'
  },
  {
    id: 'q-fis-2-5-7',
    enunciado: 'Si sobre un cuerpo se duplica la fuerza neta aplicada y al mismo tiempo se reduce su masa a la mitad, ¿cómo variará la aceleración experimentada por el cuerpo?',
    alternativas: {
      A: 'Permanece idéntica.',
      B: 'Aumenta al doble.',
      C: 'Aumenta al cuádruple.',
      D: 'Disminuye a la cuarta parte.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! De la Segunda Ley, la aceleración es $a = F/m$. Si la fuerza es $2F$ y la masa es $m/2$, la nueva aceleración es $a\' = (2F) / (m/2) = 4 (F/m) = 4a$. La aceleración aumenta al cuádruple.',
    feedback_error: 'Analiza la relación de proporcionalidad: la aceleración es directamente proporcional a la fuerza e inversamente proporcional a la masa. Reemplaza los factores de cambio ($2$ en el numerador y $1/2$ en el denominador).'
  },
  {
    id: 'q-fis-2-5-8',
    enunciado: 'Un automóvil choca de frente contra un insecto volador en la carretera. Al ocurrir el impacto, ¿cuál de los dos experimenta una fuerza de mayor magnitud debido al choque?',
    alternativas: {
      A: 'El insecto, porque su masa es insignificante.',
      B: 'El automóvil, porque posee mayor inercia y energía mecánica.',
      C: 'Ambos experimentan exactamente la misma magnitud de fuerza de impacto por Acción y Reacción.',
      D: 'Ninguno experimenta fuerza alguna por conservarse la masa.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Soberbio! De acuerdo con la Tercera Ley de Newton, la fuerza que el automóvil ejerce sobre el insecto es idéntica en magnitud y dirección a la fuerza que el insecto ejerce sobre el automóvil. La abismal diferencia en los efectos (el insecto muere desintegrado y el auto apenas sufre rasguños) se debe a que la misma fuerza aplicada sobre la diminuta masa del insecto le produce una aceleración destructiva gigante ($a = F/m$).',
    feedback_error: 'No confundas la fuerza con los daños físicos o la aceleración resultante. La fuerza de contacto es una sola interacción compartida que posee la misma magnitud sobre ambos cuerpos.'
  },
  {
    id: 'q-fis-2-5-9',
    enunciado: 'Al realizar el Diagrama de Cuerpo Libre (DCL) de un bloque que desliza hacia abajo por un plano inclinado rugoso sin cuerdas asociadas, ¿cuáles son las fuerzas externas que deben dibujarse sobre el bloque?',
    alternativas: {
      A: 'El peso, la fuerza normal y la fuerza de roce.',
      B: 'El peso, la fuerza normal, el roce y la fuerza de empuje del plano hacia abajo.',
      C: 'Únicamente el peso y la normal.',
      D: 'La fuerza de gravedad y la inercia del movimiento.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Correcto! En un bloque deslizante libre por una pendiente rugosa, las únicas interacciones externas son la atracción terrestre (Peso), la fuerza de soporte de la superficie perpendicular a ella (Normal) y la fricción sólida paralela a la superficie contraria al movimiento (Roce). No hay fuerzas ficticias como la inercia o el empuje del plano.',
    feedback_error: 'Identifica las interacciones reales con el entorno. La normal y el roce provienen del contacto con la superficie, mientras que el peso es la fuerza gravitacional del planeta. La inercia no es una fuerza externa.'
  }
);

// Omitimos la declaración repetitiva y la inyectamos mediante una carga de datos completa
const preguntasRestantes = [
  // SECCIÓN 5 (Preguntas 50)
  {
    id: 'q-fis-2-5-10',
    enunciado: 'Un niño tira de un trineo de $20 \\text{ kg}$ de masa sobre la nieve horizontal ejerciendo una fuerza constante de $30 \\text{ N}$. Si la aceleración medida del trineo es de $1 \\text{ m/s}^2$, ¿cuál es el valor de la fuerza de fricción que opone la nieve al movimiento?',
    alternativas: {
      A: '10 N',
      B: '20 N',
      C: '30 N',
      D: '50 N'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! Aplicando la Segunda Ley de Newton: $F_{neta} = F_{\\text{niño}} - f_r = m \\cdot a \\implies 30 - f_r = 20 \\times 1 \\implies 30 - f_r = 20 \\implies f_r = 10 \\text{ N}$.',
    feedback_error: 'Plantea la sumatoria de fuerzas. La fuerza del niño tira a favor y el roce tira en contra. La diferencia es la fuerza neta, que debe ser igual al producto de la masa por la aceleración ($20 \\times 1 = 20 \\text{ N}$).'
  },

  // SECCIÓN 6: Fuerzas: peso, elástica, tensión y normal (Preguntas 51 a 60)
  {
    id: 'q-fis-2-6-1',
    enunciado: 'Un astronauta posee una masa de $80 \\text{ kg}$ medida en laboratorios terrestres. Si viaja a la Luna, donde la aceleración de gravedad es de aproximadamente $1,6 \\text{ m/s}^2$, ¿cuáles serán los valores de su masa y su peso en la Luna?',
    alternativas: {
      A: 'Masa = 80 kg; Peso = 800 N',
      B: 'Masa = 80 kg; Peso = 128 N',
      C: 'Masa = 12,8 kg; Peso = 128 N',
      D: 'Masa = 80 kg; Peso = 80 N'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La masa es una propiedad intrínseca de la materia y no cambia con la ubicación en el universo (sigue siendo $80 \\text{ kg}$). El peso es la fuerza gravitatoria local y depende de la gravedad del astro: $P = m \\cdot g_{\\text{Luna}} = 80 \\text{ kg} \\times 1,6 \\text{ m/s}^2 = 128 \\text{ N}$.',
    feedback_error: 'Distingue masa (invariante, medida en kg) de peso (fuerza gravitatoria local, medida en Newtons). La masa se mantiene constante en la Luna, pero el peso disminuye debido a la menor gravedad local.'
  },
  {
    id: 'q-fis-2-6-2',
    enunciado: 'Se cuelga un objeto de $3 \\text{ kg}$ de masa del extremo de un resorte vertical. Si el resorte se deforma elásticamente estirándose $6 \\text{ cm}$, ¿cuál es el valor de la constante elástica ($k$) del resorte? Considere $g = 10 \\text{ m/s}^2$.',
    alternativas: {
      A: '5 N/m',
      B: '50 N/m',
      C: '500 N/m',
      D: '5000 N/m'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! En equilibrio, la fuerza elástica compensa al peso del bloque: $F_e = P \\implies k \\cdot \\Delta x = m \\cdot g$. Convertimos los centímetros a metros: $\\Delta x = 6 \\text{ cm} = 0,06 \\text{ m}$. Así, $k \\times 0,06 = 30 \\implies k = 30 / 0,06 = 500 \\text{ N/m}$.',
    feedback_error: 'Usa la Ley de Hooke en equilibrio: $k \\cdot \\Delta x = m \\cdot g$. Asegúrate de transformar la elongación de centímetros a metros antes de realizar la división para hallar la constante en N/m.'
  },
  {
    id: 'q-fis-2-6-3',
    enunciado: 'Un bloque reposa apoyado sobre un plano horizontal rugoso. Si ejercemos una fuerza sobre el bloque empujándolo directamente hacia abajo de forma vertical, ¿qué sucederá con el módulo de la fuerza Normal ejercida por el plano sobre el bloque?',
    alternativas: {
      A: 'Disminuirá, ya que el bloque está más comprimido contra el plano.',
      B: 'Permanecerá constante, puesto que la normal solo depende del peso del objeto.',
      C: 'Aumentará, porque la superficie debe responder con mayor fuerza de soporte para compensar el empuje.',
      D: 'Se reducirá a cero al colapsar mecánicamente.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En el eje vertical en reposo, las fuerzas hacia abajo (Peso + Empuje) deben equilibrarse con las fuerzas hacia arriba (Normal). Al añadir una fuerza vertical hacia abajo, la Normal debe aumentar en igual magnitud para evitar que el bloque rompa el plano y acelerar verticalmente.',
    feedback_error: 'La fuerza Normal no es siempre igual al peso. Es una fuerza de reacción elástica microscópica de las superficies de contacto que aumenta o disminuye para compensar todas las fuerzas aplicadas contra ella.'
  },
  {
    id: 'q-fis-2-6-4',
    enunciado: 'Se tienen dos resortes idénticos de constante elástica $k = 200 \\text{ N/m}$. Si se conectan en serie (uno detrás del otro) y de ellos se cuelga un peso de $20 \\text{ N}$, ¿cuál será la deformación total experimentada por el conjunto de resortes?',
    alternativas: {
      A: '5 cm',
      B: '10 cm',
      C: '20 cm',
      D: '40 cm'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! Al estar conectados en serie, la tensión se transmite por igual a ambos resortes. Cada uno de los resortes soporta la totalidad de la carga de $20 \\text{ N}$. La elongación de cada resorte es $\\Delta x = F/k = 20 / 200 = 0,1 \\text{ m} = 10 \\text{ cm}$. La deformación total del conjunto es la suma de ambas deformaciones: $10 \\text{ cm} + 10 \\text{ cm} = 20 \\text{ cm}$.',
    feedback_error: 'Cuando colocas dos resortes en serie, el conjunto es más elástico (blando). Cada uno soporta la fuerza completa y se estira de manera independiente. Calcula el estiramiento de uno y multiplícalo por dos.'
  },
  {
    id: 'q-fis-2-6-5',
    enunciado: 'Un resorte helicoidal ideal se estira una distancia de $4 \\text{ cm}$ cuando soporta una carga colgante de $8 \\text{ N}$. Si la carga se incrementa hasta $16 \\text{ N}$, ¿cuál será la elongación final del resorte si no se supera el límite elástico?',
    alternativas: {
      A: '2 cm',
      B: '4 cm',
      C: '8 cm',
      D: '16 cm'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien! Según la Ley de Hooke, la deformación elástica de un resorte es directamente proporcional a la fuerza aplicada ($F \\propto \\Delta x$). Si la fuerza aplicada se duplica (de 8 N a 16 N), la elongación del resorte también se duplicará, pasando de 4 cm a 8 cm.',
    feedback_error: 'Aplica la proporcionalidad lineal de la Ley de Hooke. El estiramiento es lineal respecto a la carga. Duplicar la fuerza resulta en el doble de estiramiento.'
  },
  {
    id: 'q-fis-2-6-6',
    enunciado: 'Un bloque de metal de $15 \\text{ kg}$ cuelga inmóvil del techo suspendido por un cable de acero. ¿Cuál es el módulo de la fuerza de tensión que soporta el cable? Considere $g = 10 \\text{ m/s}^2$.',
    alternativas: {
      A: '1,5 N',
      B: '15 N',
      C: '150 N',
      D: '1500 N'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! En equilibrio, la tensión vertical hacia arriba que ejerce el cable debe contrarrestar exactamente la fuerza del peso del bloque hacia abajo: $T = P = m \\cdot g = 15 \\text{ kg} \\times 10 \\text{ m/s}^2 = 150 \\text{ N}$.',
    feedback_error: 'Para un cuerpo suspendido en reposo, la tensión que soporta la cuerda es exactamente igual al peso del cuerpo colgado.'
  },
  {
    id: 'q-fis-2-6-7',
    enunciado: 'Se coloca una caja sobre el piso horizontal de un vagón de tren que está acelerando fuertemente hacia adelante. ¿Qué fuerza es la encargada de acelerar horizontalmente la caja y evitar que deslice hacia atrás en el vagón?',
    alternativas: {
      A: 'La fuerza Normal ejercida por el piso.',
      B: 'El peso de la caja que tira hacia abajo.',
      C: 'La fuerza de roce estático entre el piso y la caja.',
      D: 'La fuerza de tensión inercial del movimiento.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! La fuerza de roce estático actúa paralelamente al piso y es la única fuerza horizontal disponible que empuja a la caja hacia adelante, obligándola a acompañar el movimiento acelerado del tren. Si esta fuerza de roce supera su límite máximo, la caja comenzará a deslizar hacia atrás.',
    feedback_error: 'Piensa en qué fuerza sujeta tus zapatos al suelo de un bus cuando acelera. Es el roce horizontal entre las superficies.'
  },
  {
    id: 'q-fis-2-6-8',
    enunciado: 'Un bloque de madera se encuentra apoyado sobre una mesa plana. Si inclinamos lentamente la mesa elevando un extremo, ¿qué ocurre con el módulo de la fuerza Normal a medida que aumenta el ángulo de inclinación de la mesa?',
    alternativas: {
      A: 'Aumenta continuamente.',
      B: 'Permanece constante.',
      C: 'Disminuye de forma progresiva.',
      D: 'Aumenta primero y luego cae a cero de golpe.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En un plano inclinado con ángulo $\\theta$, la fuerza Normal contrarresta únicamente la componente perpendicular del peso ($N = m g \\cos\\theta$). A medida que el ángulo $\\theta$ aumenta, el valor de $\\cos\\theta$ disminuye de 1 hacia 0, reduciendo paulatinamente la fuerza Normal.',
    feedback_error: 'En un plano inclinado, a mayor inclinación, menos se apoya el cuerpo sobre el plano y más "cuelga" del peso, disminuyendo la compresión sobre la superficie y reduciendo la Normal.'
  },
  {
    id: 'q-fis-2-6-9',
    enunciado: 'Un dinamómetro es un instrumento calibrado que se utiliza para medir fuerzas en física. ¿En qué principio o ley física se fundamenta el diseño mecánico de un dinamómetro?',
    alternativas: {
      A: 'La Ley de Gravitación Universal de Newton.',
      B: 'La Ley de Hooke sobre deformaciones elásticas en resortes.',
      C: 'La Ley de conservación de energía mecánica.',
      D: 'El Principio de Pascal para fluidos hidráulicos.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Muy bien! Los dinamómetros tradicionales contienen un resorte helicoidal de constante conocida. Al aplicar una fuerza, el resorte se deforma linealmente de acuerdo con la Ley de Hooke ($F = k \\Delta x$), indicando la magnitud de la fuerza en una escala graduada.',
    feedback_error: 'Los dinamómetros miden fuerzas midiendo cuánto se estira un resorte interno en equilibrio elástico.'
  },
  {
    id: 'q-fis-2-6-10',
    enunciado: '¿Es posible que la fuerza Normal sobre un cuerpo sea horizontal?',
    alternativas: {
      A: 'No, por definición el peso va hacia abajo y la normal hacia arriba.',
      B: 'Sí, ocurre cuando presionamos un bloque de forma horizontal contra una pared vertical sólida.',
      C: 'Sí, pero únicamente si el coeficiente de roce es infinito.',
      D: 'No, excepto en los sistemas de referencia no inerciales acelerados.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La palabra "Normal" en matemáticas significa perpendicular. La fuerza normal es siempre perpendicular a la superficie de contacto. Si empujamos un libro de forma horizontal contra una pared vertical, la pared responde con una fuerza de soporte perpendicular a ella, es decir, de forma horizontal.',
    feedback_error: 'La dirección de la normal depende estrictamente de la orientación de la superficie. Si la superficie es una pared vertical, la normal ejercida es horizontal.'
  },

  // SECCIÓN 7: Roce y resistencia del aire (Preguntas 61 a 70)
  {
    id: 'q-fis-2-7-1',
    enunciado: 'Se coloca un pesado bloque de madera de $40 \\text{ N}$ de peso sobre un piso plano rugoso. Si los coeficientes de roce estático y cinético son $\\mu_e = 0,5$ y $\\mu_c = 0,3$, ¿cuál es el valor de la fuerza de roce estático que actúa sobre el bloque si se le aplica una fuerza horizontal de $15 \\text{ N}$ y este no logra moverse?',
    alternativas: {
      A: '12 N',
      B: '15 N',
      C: '20 N',
      D: '40 N'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La fuerza de roce estático es de carácter variable e inteligente: se opone al deslizamiento aumentando de forma idéntica a la fuerza aplicada para mantener el reposo. Si aplicamos $15 \\text{ N}$ y no se mueve, la fuerza de roce es de exactamente $15 \\text{ N}$ en sentido contrario (fuerza neta = 0). El valor de $20 \\text{ N}$ calculado como $\\mu_e \\cdot N = 0,5 \\times 40 = 20 \\text{ N}$ representa únicamente la fuerza de roce estático máxima límite, no la que actúa en este instante.',
    feedback_error: '¡Cuidado con la trampa del roce estático! La fórmula $\\mu_e \\cdot N$ calcula el roce máximo posible antes de deslizar. Si la fuerza que tira es menor a ese límite máximo ($15 \\text{ N} < 20 \\text{ N}$), el roce estático real es igual a la fuerza aplicada.'
  },
  {
    id: 'q-fis-2-7-2',
    enunciado: 'Un bloque de metal de $2 \\text{ kg}$ desliza sobre una mesa horizontal con velocidad constante bajo la acción de una fuerza horizontal tractora de $6 \\text{ N}$. ¿Cuál es el coeficiente de roce cinético ($\\mu_c$) entre el bloque y la mesa? Considere $g = 10 \\text{ m/s}^2$.',
    alternativas: {
      A: '0,1',
      B: '0,3',
      C: '0,5',
      D: '0,6'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Puesto que el bloque se desplaza a velocidad constante (MRU), la fuerza neta horizontal es cero. Así, la fuerza de roce cinético equilibra a la fuerza tractora: $f_c = F = 6 \\text{ N}$. Como el plano es horizontal, la Normal equivale al peso: $N = m \\cdot g = 20 \\text{ N}$. Usando la relación de roce: $\\mu_c = f_c / N = 6 / 20 = 0,3$.',
    feedback_error: 'Al ir a velocidad constante, el roce cinético es igual a la fuerza de empuje horizontal ($6\\text{ N}$). Calcula el peso del bloque ($20\\text{ N}$) que corresponde a la Normal en este plano y divide el roce entre la normal.'
  },
  {
    id: 'q-fis-2-7-3',
    enunciado: '¿Por qué es físicamente más difícil iniciar el movimiento de una heladera pesada apoyada en el piso que mantenerla deslizando una vez que ya se ha puesto en marcha?',
    alternativas: {
      A: 'Porque la masa de la heladera disminuye al entrar en movimiento por relatividad.',
      B: 'Porque el coeficiente de roce estático ($\\mu_e$) es siempre estrictamente mayor que el coeficiente de roce cinético ($\\mu_c$).',
      C: 'Porque la fuerza de gravedad ejerce menor tracción sobre objetos en movimiento.',
      D: 'Porque la resistencia del aire empuja a favor una vez en marcha.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! A nivel microscópico, las rugosidades de las superficies de contacto se acoplan y "sueldan" temporalmente cuando están en reposo. Una vez en movimiento, no da tiempo a que se acoplen de forma tan profunda, reduciendo la fricción. Físicamente, esto se modela debido a que el coeficiente de roce estático $\\mu_e$ es siempre superior al cinético $\\mu_c$.',
    feedback_error: 'Asocia el esfuerzo inicial con los coeficientes de fricción. Romper el reposo requiere vencer el roce estático máximo, que es superior al roce cinético que actúa una vez iniciado el deslizamiento.'
  },
  {
    id: 'q-fis-2-7-4',
    enunciado: 'Un bloque de ladrillo desliza sobre una mesa de madera apoyado en su cara de mayor área. Si se voltea el bloque apoyándolo sobre su cara de menor área (sin variar su masa), ¿qué ocurrirá con el módulo de la fuerza de roce cinético al deslizar?',
    alternativas: {
      A: 'Disminuirá notablemente por haber menos área de contacto.',
      B: 'Permanecerá prácticamente idéntico, ya que la fuerza de roce es independiente del área de contacto aparente.',
      C: 'Aumentará, porque la presión local es mucho mayor.',
      D: 'Se reducirá a la mitad por simetría geométrica.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! Una de las leyes fundamentales de la fricción sólida (Leyes de Amontons-Coulomb) establece que la fuerza de roce es directamente proporcional a la normal y a la naturaleza de los materiales, pero es independiente de la superficie o área de contacto geométrica aparente de los cuerpos.',
    feedback_error: 'La fuerza de roce no se ve alterada por el área de apoyo. Al disminuir el área, aumenta la presión de soporte en igual proporción, manteniéndose la fricción total constante.'
  },
  {
    id: 'q-fis-2-7-5',
    enunciado: 'Un paracaidista de $80 \\text{ kg}$ de masa se lanza desde un avión. Al abrir su paracaídas, acelera hacia abajo hasta alcanzar su velocidad terminal constante de caída. En ese tramo de velocidad terminal, ¿cuál es el módulo de la fuerza de resistencia del aire que experimenta el paracaidista? Considere $g = 10 \\text{ m/s}^2$.',
    alternativas: {
      A: '0 N',
      B: '80 N',
      C: '800 N',
      D: '8000 N'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Al alcanzar la velocidad terminal, la velocidad es estrictamente constante (aceleración cero). La fuerza neta es nula, lo que significa que la fuerza de resistencia del aire dirigida hacia arriba debe equilibrar exactamente al peso del paracaidista dirigido hacia abajo: $F_{\\text{aire}} = P = m \\cdot g = 80 \\text{ kg} \\times 10 \\text{ m/s}^2 = 800 \\text{ N}$.',
    feedback_error: 'La velocidad terminal implica rapidez constante (equilibrio). Para que un cuerpo deje de acelerar al caer en la atmósfera, la resistencia del aire debe igualar exactamente a la fuerza de gravedad.'
  },
  {
    id: 'q-fis-2-7-6',
    enunciado: 'Si empujamos un bloque sobre una alfombra rugosa con una fuerza de $50 \\text{ N}$ hacia el este y este desliza a velocidad constante, ¿cuál es el vector de la fuerza de roce que actúa sobre el bloque?',
    alternativas: {
      A: '$50 \\text{ N}$ hacia el oeste.',
      B: '$50 \\text{ N}$ hacia el este.',
      C: '$0 \\text{ N}$',
      D: '$25 \\text{ N}$ hacia el oeste.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Correcto! En velocidad constante, el roce equilibra al empuje y va en sentido contrario. Como empujamos al este con $50 \\text{ N}$, la fuerza de roce es de $50 \\text{ N}$ dirigida hacia el oeste.',
    feedback_error: 'La fuerza de roce cinético se opone siempre al sentido de movimiento del cuerpo. Si el móvil desliza hacia el este, el roce tira en sentido contrario con igual magnitud para mantener la velocidad constante.'
  },
  {
    id: 'q-fis-2-7-7',
    enunciado: '¿Cuál de los siguientes pares de materiales presentará el menor coeficiente de roce estático al ponerse en contacto?',
    alternativas: {
      A: 'Neumático de caucho sobre pavimento de asfalto seco.',
      B: 'Madera de pino rugosa sobre madera de roble.',
      C: 'Dos placas de metal altamente pulidas recubiertas con aceite lubricante.',
      D: 'Suela de zapato de cuero sobre piso de baldosa mojada.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Los metales pulidos con lubricación líquida tienen coeficientes de roce extremadamente bajos ($\\mu < 0,05$), facilitando el deslizamiento casi sin resistencia, principio que se usa en rodamientos industriales.',
    feedback_error: 'El lubricante líquido separa físicamente las rugosidades de las superficies sólidas, reduciendo drásticamente la fricción entre ellas.'
  },
  {
    id: 'q-fis-2-7-8',
    enunciado: 'Un bloque de $5 \\text{ kg}$ reposa en un plano inclinado de $30^\\circ$. Si el bloque no desliza, ¿cuál es la magnitud de la fuerza de roce estático que actúa en ese instante? Considere $g = 10 \\text{ m/s}^2$ y $\\operatorname{sen}(30^\\circ) = 0,5$.',
    alternativas: {
      A: '12,5 N',
      B: '25 N',
      C: '43,3 N',
      D: '50 N'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! En un plano inclinado en reposo, la fuerza de roce estático equilibra a la componente paralela del peso que tira hacia abajo: $f_e = P_x = m g \\operatorname{sen}\\theta = 5 \\text{ kg} \\times 10 \\text{ m/s}^2 \\times \\operatorname{sen}(30^\\circ) = 50 \\times 0,5 = 25 \\text{ Newtons}$.',
    feedback_error: 'El roce estático en un plano inclinado evita que el cuerpo deslice. Por ende, debe ser exactamente igual a la fuerza que intenta hacerlo caer por la cuesta, que es la componente paralela del peso ($mg\\operatorname{sen}\\theta$).'
  },
  {
    id: 'q-fis-2-7-9',
    enunciado: '¿Qué ocurre con la fuerza de resistencia que ejerce el aire sobre un automóvil a medida que este incrementa continuamente su rapidez de conducción?',
    alternativas: {
      A: 'Permanece constante.',
      B: 'Disminuye linealmente.',
      C: 'Aumenta, siendo proporcional a la rapidez o al cuadrado de la rapidez del móvil.',
      D: 'Se anula debido al perfil aerodinámico absoluto.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien! A diferencia del roce sólido (que es independiente de la rapidez), el roce de fluidos (resistencia del aire) aumenta fuertemente con la velocidad del objeto, siendo proporcional a $v$ para velocidades bajas, o a $v^2$ (roce turbulento) a velocidades medias y altas.',
    feedback_error: 'Los fluidos ofrecen mayor oposición a mayor rapidez de cruce. Por eso los autos de carreras gastan gran potencia solo en vencer la resistencia del viento.'
  },
  {
    id: 'q-fis-2-7-10',
    enunciado: 'Si lanzamos una pluma y una bola de acero pesada simultáneamente desde la misma altura dentro de una habitación llena de aire, la bola de acero llega mucho antes al suelo. ¿Por qué ocurre esto en presencia de aire?',
    alternativas: {
      A: 'Porque la pluma tiene menor masa y por tanto cae más lento por inercia.',
      B: 'Porque la resistencia del aire equilibra rápidamente el peso liviano de la pluma (alcanzando velocidad terminal casi instantáneamente), mientras que apenas afecta el peso de la bola de acero.',
      C: 'Porque la gravedad de la Tierra solo atrae metales conductores.',
      D: 'Porque la pluma absorbe calor que la hace flotar.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La pluma, al tener gran superficie y muy poca masa, experimenta una fuerza de resistencia del aire que iguala a su pequeño peso de inmediato, cayendo a velocidad terminal baja y constante. La bola de acero tiene un peso masivo comparado con su resistencia aerodinámica, por lo que continúa acelerando casi sin perturbación.',
    feedback_error: 'En presencia de aire, la resistencia atmosférica no se puede ignorar. Los cuerpos ligeros y de gran área sufren una resistencia que frena su caída de forma dramática.'
  },

  // SECCIÓN 8: Modelos cosmológicos clásicos (Preguntas 71 a 80)
  {
    id: 'q-fis-2-8-1',
    enunciado: 'El modelo geocéntrico del universo propuesto por Claudio Ptolomeo en la antigüedad requería el uso de órbitas circulares complejas llamadas **epiciclos** (círculos cuyos centros giraban a su vez en órbitas mayores llamadas deferentes). ¿Qué anomalía observada en el cielo intentaba explicar de forma desesperada este modelo?',
    alternativas: {
      A: 'Las fases ópticas de la Luna.',
      B: 'El movimiento retrógrado de planetas como Marte (que aparentan retroceder en el cielo).',
      C: 'Los eclipses de sol totales.',
      D: 'La precesión de los equinoccios terrestres.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Desde la Tierra, planetas como Marte muestran un movimiento errático: avanzan, parecen detenerse y retroceden temporalmente en la bóveda celeste. Para compatibilizar esta observación con la creencia geocéntrica de órbitas circulares perfectas, Ptolomeo inventó los epiciclos. El heliocentrismo lo explica de forma simple como un efecto óptico de adelantamiento entre órbitas planetarias.',
    feedback_error: 'El movimiento retrógrado de los planetas era el mayor quebradero de cabeza para la astronomía geocéntrica clásica, requiriendo inventar complejos círculos sobre círculos para explicarlo.'
  },
  {
    id: 'q-fis-2-8-2',
    enunciado: '¿Cuál de los siguientes descubrimientos realizados por Galileo Galilei con su telescopio sirvió como evidencia empírica directa para refutar el modelo geocéntrico y apoyar la teoría heliocéntrica de Copérnico?',
    alternativas: {
      A: 'El descubrimiento de los anillos de Saturno.',
      B: 'La observación de cráteres y montañas en la superficie de la Luna.',
      C: 'El descubrimiento de las lunas de Júpiter y las fases del planeta Venus.',
      D: 'La medición de la distancia de paralaje a las estrellas lejanas.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Al observar Venus, Galileo notó que presentaba un ciclo completo de fases (como la Luna), lo cual es matemáticamente imposible en el modelo geocéntrico de Ptolomeo, pero encaja perfecto si Venus orbita el Sol. Además, las cuatro lunas de Júpiter demostraron que no todos los cuerpos celestes giran en torno a la Tierra.',
    feedback_error: 'Busca las observaciones telescópicas de Galileo que probaron que había cuerpos girando en torno a otros astros (satélites de Júpiter) y órbitas solares directas (Venus).'
  },
  {
    id: 'q-fis-2-8-3',
    enunciado: 'La Primera Ley de Kepler revolucionó la astronomía clásica al romper con el dogma aristotélico de las órbitas celestes circulares perfectas. ¿Qué forma geométrica describe la órbita de los planetas según esta ley y dónde se sitúa el Sol?',
    alternativas: {
      A: 'Órbitas parabólicas con el Sol en el centro geométrico.',
      B: 'Órbitas elípticas con el Sol situado en uno de los focos de la elipse.',
      C: 'Órbitas circulares con el Sol desplazado del centro por un epiciclo.',
      D: 'Órbitas elípticas con la Tierra en un foco y el Sol en el otro.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La Primera Ley de Kepler establece de forma estricta que todos los planetas giran alrededor del Sol describiendo órbitas elípticas, situándose el Sol en uno de los dos focos de dicha elipse.',
    feedback_error: 'Kepler utilizó los precisos datos astronómicos de Tycho Brahe para descubrir que los planetas no describen círculos perfectos, sino elipses, con el Sol desplazado en un foco.'
  },
  {
    id: 'q-fis-2-8-4',
    enunciado: 'De acuerdo con la Segunda Ley de Kepler (Ley de las áreas), si el vector que une al Sol con un planeta barre áreas idénticas en intervalos de tiempo iguales, ¿en qué punto de su órbita el planeta viaja a su **máxima rapidez** de traslación?',
    alternativas: {
      A: 'En el Afelio (punto de la órbita más alejado del Sol).',
      B: 'En el Perihelio (punto de la órbita más cercano al Sol).',
      C: 'La rapidez es estrictamente constante en toda la elipse.',
      D: 'Únicamente durante los equinoccios planetarios.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Para barrer la misma área en el mismo tiempo cuando está cerca del Sol (Perihelio), el planeta debe recorrer un arco de elipse más largo, lo que le obliga a viajar a mayor rapidez. En el Afelio (lejos), la distancia Sol-planeta es grande, por lo que viaja más lento.',
    feedback_error: 'La velocidad de traslación planetaria no es uniforme. La atracción gravitatoria es más fuerte cuanto más cerca está del Sol (Perihelio), acelerándolo a su máxima velocidad en esa región.'
  },
  {
    id: 'q-fis-2-8-5',
    enunciado: 'La Tercera Ley de Kepler establece una relación matemática entre el período orbital ($T$) de un planeta (tiempo de una vuelta al Sol) y su distancia media al Sol ($a$). ¿Cuál es esta relación?',
    alternativas: {
      A: 'El período es proporcional a la distancia ($T \\propto a$).',
      B: 'El cuadrado del período es proporcional al cubo de la distancia ($T^2 \\propto a^3$).',
      C: 'El cubo del período es proporcional al cuadrado de la distancia ($T^3 \\propto a^2$).',
      D: 'El período es inversamente proporcional al cuadrado de la distancia ($T \\propto 1/a^2$).'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La Tercera Ley (Armónica) indica que $T^2 / a^3 = K$ (constante). Esto implica que los planetas más lejanos al Sol tardan mucho más tiempo en completar su órbita, no solo por recorrer más distancia, sino porque viajan a velocidades de traslación menores.',
    feedback_error: 'Recuerda los exponentes de la Ley Armónica de Kepler. El exponente 2 acompaña al período temporal ($T^2$) y el exponente 3 acompaña a la distancia espacial ($a^3$).'
  },
  {
    id: 'q-fis-2-8-6',
    enunciado: '¿Quién fue el científico de la antigua Grecia que propuso de forma pionera un modelo heliocéntrico del universo, muchos siglos antes de que Copérnico publicara su teoría en el Renacimiento?',
    alternativas: {
      A: 'Aristóteles.',
      B: 'Claudio Ptolomeo.',
      C: 'Aristarco de Samos.',
      D: 'Eratóstenes.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente cultura científica! Aristarco de Samos (siglo III a.C.) fue el primer astrónomo conocido en sugerir que la Tierra gira sobre su eje y orbita alrededor del Sol. Su modelo fue rechazado en su época por la enorme influencia de las ideas geocéntricas de Aristóteles.',
    feedback_error: 'El heliocentrismo tiene raíces muy antiguas en Grecia. Busca al astrónomo de Samos que postuló al Sol en el centro geométrico.'
  },
  {
    id: 'q-fis-2-8-7',
    enunciado: 'En el modelo Heliocéntrico de Nicolás Copérnico publicado en 1543, ¿qué forma tenían las órbitas de los planetas?',
    alternativas: {
      A: 'Eran elipses perfectas.',
      B: 'Eran órbitas circulares perfectas con epiciclos menores.',
      C: 'Eran trayectorias parabólicas sin fin.',
      D: 'Eran espirales continuas hacia el Sol.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! A pesar de desplazar el centro al Sol, Copérnico seguía creyendo en el dogma de la perfección celeste circular. Por ello, su modelo utilizaba órbitas circulares y requirió añadir algunos epiciclos para que los datos coincidieran, limitación que Kepler eliminó con las elipses.',
    feedback_error: 'Copérnico propuso que el Sol era el centro, pero no descubrió las órbitas elípticas; él seguía atado a las órbitas circulares clásicas.'
  },
  {
    id: 'q-fis-2-8-8',
    enunciado: 'Si un planeta $A$ está a una distancia media de $1 \\text{ UA}$ (Unidad Astronómica) del Sol y tiene un período de $1 \\text{ año}$, ¿cuánto tardará en orbitar el Sol un planeta $B$ situado a una distancia media de $4 \\text{ UA}$?',
    alternativas: {
      A: '2 años',
      B: '4 años',
      C: '8 años',
      D: '16 años'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Soberbio! Aplicando la Tercera Ley de Kepler: $T^2 \\propto a^3$. Si la distancia se multiplica por 4 ($a = 4 \\text{ UA}$), tenemos que $T^2 \\propto 4^3 = 64$. Extrayendo raíz cuadrada: $T = \\sqrt{64} = 8 \\text{ años}$.',
    feedback_error: 'Usa la relación $T^2 = a^3$. Eleva la distancia de 4 al cubo ($4 \\times 4 \\times 4 = 64$) y luego extrae la raíz cuadrada de ese resultado para obtener el período en años.'
  },
  {
    id: 'q-fis-2-8-9',
    enunciado: '¿Cuál de los siguientes filósofos griegos defendió de forma más influyente la inmovilidad de la Tierra y el modelo de esferas celestes perfectas que dominó la ciencia durante más de 1500 años?',
    alternativas: {
      A: 'Aristóteles',
      B: 'Aristarco',
      C: 'Demócrito',
      D: 'Sócrates'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Muy bien! Aristóteles (siglo IV a.C.) estableció la física geocéntrica y dividió el cosmos en el mundo sublunar (imperfecto y mutable) y supralunar (perfecto, esférico e inmutable). Sus ideas fueron dogma científico hasta la revolución científica.',
    feedback_error: 'El pensador más influyente cuya física geocéntrica fue adoptada por la Iglesia y la academia medieval fue Aristóteles.'
  },
  {
    id: 'q-fis-2-8-10',
    enunciado: '¿Qué ley de la física moderna fue formulada posteriormente por Isaac Newton para dar una explicación física dinámica a las tres leyes matemáticas observacionales de Kepler?',
    alternativas: {
      A: 'La Ley de conservación de energía.',
      B: 'La Ley de Gravitación Universal.',
      C: 'La Ley de electromagnetismo de Maxwell.',
      D: 'La Ley de la relatividad general.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Newton demostró que las órbitas elípticas y las constantes de Kepler son una consecuencia matemática directa de su Ley de Gravitación Universal ($F = G \\frac{Mm}{r^2}$), la cual unificó la gravedad terrestre con la celeste.',
    feedback_error: 'Kepler describió "cómo" se movían los planetas (matemáticas), pero fue Newton quien explicó "por qué" se movían así (fuerza de atracción gravitatoria).'
  },

  // SECCIÓN 9: Origen y evolución del universo (Preguntas 81 a 90)
  {
    id: 'q-fis-2-9-1',
    enunciado: 'Edwin Hubble analizó el espectro de luz de galaxias distantes y descubrió la Ley de Hubble. ¿Qué relación física describe esta ley fundamental de la cosmología moderna?',
    alternativas: {
      A: 'La masa de una galaxia es proporcional a su velocidad orbital.',
      B: 'La velocidad de alejamiento de una galaxia es directamente proporcional a su distancia de nosotros.',
      C: 'La temperatura de una estrella disminuye a medida que envejece.',
      D: 'La expansión del universo ocurre únicamente en los bordes de la galaxia.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La Ley de Hubble ($v = H_0 \\cdot d$) establece de forma rigurosa que cuanto más lejos se encuentra una galaxia de la Tierra, más rápido se aleja de nosotros. Esto demuestra de forma directa que el espacio mismo se está expandiendo de manera uniforme.',
    feedback_error: 'Hubble relacionó velocidad de recesión y distancia galáctica. Las galaxias lejanas se alejan a mayor velocidad que las cercanas.'
  },
  {
    id: 'q-fis-2-9-2',
    enunciado: '¿Cuál de las siguientes opciones describe una de las evidencias observacionales más sólidas que apoyan de manera inequívoca la Teoría del Big Bang sobre el origen del universo?',
    alternativas: {
      A: 'La presencia de agua líquida en planetas extrasolares.',
      B: 'La Radiación Cósmica de Fondo de Microondas (CMB) detectada de forma uniforme en todas las direcciones del cielo.',
      C: 'La rotación uniforme de la Vía Láctea.',
      D: 'La existencia de cráteres de impacto en asteroides.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La Radiación Cósmica de Fondo de Microondas (CMB) es el "eco térmico" o luz fósil remanente de la gran expansión inicial (Big Bang) ocurrida cuando el universo se enfrió lo suficiente para volverse transparente a la luz, hace unos 380.000 años.',
    feedback_error: 'El Big Bang predice que la energía térmica inicial del universo primitivo debe seguir vagando por el espacio en forma de radiación muy fría (microondas). Su descubrimiento en 1964 fue la prueba definitiva de la teoría.'
  },
  {
    id: 'q-fis-2-9-3',
    enunciado: 'Si una galaxia A se encuentra a una distancia de $100 \\text{ megapársecs}$ (Mpc) de la Tierra y se aleja a una velocidad de $7000 \\text{ km/s}$, ¿a qué velocidad aproximada de alejamiento se moverá una galaxia B situada a una distancia de $200 \\text{ megapársecs}$?',
    alternativas: {
      A: '$3500 \\text{ km/s}$',
      B: '$7000 \\text{ km/s}$',
      C: '$14.000 \\text{ km/s}$',
      D: '$28.000 \\text{ km/s}$'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! De acuerdo con la Ley de Hubble ($v = H_0 \\cdot d$), la velocidad de recesión es directamente proporcional a la distancia. Si la distancia de la galaxia B es el doble que la de A ($200 \\text{ Mpc}$ vs $100 \\text{ Mpc}$), su velocidad de alejamiento debe ser también el doble: $7000 \\text{ km/s} \\times 2 = 14.000 \\text{ km/s}$.',
    feedback_error: 'Aplica la proporcionalidad directa de la Ley de Hubble. Duplicar la distancia a la galaxia resulta en que se aleje al doble de rapidez.'
  },
  {
    id: 'q-fis-2-9-4',
    enunciado: 'Al estudiar la luz de galaxias lejanas, se observa que casi la totalidad de ellas presenta un desplazamiento al rojo (redshift) en su espectro. ¿Qué ocurriría físicamente si el universo se encontrara en un proceso de contracción o colapso gravitatorio hacia un punto?',
    alternativas: {
      A: 'La luz de las galaxias mostraría un corrimiento hacia frecuencias menores.',
      B: 'La luz de las galaxias mostraría un corrimiento al azul (blueshift), es decir, hacia frecuencias mayores.',
      C: 'La luz se volvería invisible debido a la gravedad extrema.',
      D: 'No habría alteración Doppler alguna.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Por efecto Doppler relativista, si las galaxias se estuvieran acercando unas a otras debido a una contracción del espacio, las ondas de luz se comprimirían en el trayecto, aumentando su frecuencia aparente percibida. En el espectro visible, esto se apreciaría como un corrimiento al azul (blueshift).',
    feedback_error: 'La contracción espacial acorta la longitud de onda. Acortar la onda equivale a elevar la frecuencia aparente (color azul).'
  },
  {
    id: 'q-fis-2-9-5',
    enunciado: '¿Cuál es la edad aproximada del universo estimada por la cosmología científica moderna basándose en datos del telescopio espacial Planck y la constante de Hubble?',
    alternativas: {
      A: '4.500 millones de años.',
      B: '13.800 millones de años.',
      C: '100.000 millones de años.',
      D: 'El universo es infinito en el tiempo y no tiene edad.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Muy bien! Los modelos cosmológicos estándar estiman la edad de nuestro universo en aproximadamente $13.800$ millones de años ($13,8 \\times 10^9$ años) desde la gran expansión inicial.',
    feedback_error: 'No confundas la edad de la Tierra e inicio del sistema solar (~4.500 millones de años) con la edad total del universo completo (~13.800 millones de años).'
  },
  {
    id: 'q-fis-2-9-6',
    enunciado: '¿Cuáles fueron los dos elementos químicos ligeros sintetizados de forma masiva en los primeros minutos del universo (nucleosíntesis primordial) cuya abundancia predicha coincide con las observaciones cósmicas actuales?',
    alternativas: {
      A: 'Carbono y Oxígeno.',
      B: 'Hierro y Níquel.',
      C: 'Hidrógeno y Helio.',
      D: 'Silicio y Uranio.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En los primeros instantes del Big Bang, la alta energía permitió la fusión nuclear de protones y neutrones primordiales, creando aproximadamente un 75% de Hidrógeno y un 25% de Helio (y trazas de Litio). Los elementos más pesados (como carbono, oxígeno y metales) se forjaron mucho después en el interior de las estrellas.',
    feedback_error: 'Los elementos químicos más abundantes y simples del cosmos (los dos primeros de la tabla periódica) son las evidencias nucleares del inicio caliente del universo.'
  },
  {
    id: 'q-fis-2-9-7',
    enunciado: '¿Cuál es el valor aproximado de la temperatura actual de la Radiación Cósmica de Fondo de Microondas (CMB) medida en el espacio profundo de nuestro universo en expansión?',
    alternativas: {
      A: '0 Kelvin (Cero Absoluto).',
      B: '2,7 Kelvin (aproximadamente $-270^\\circ\\text{C}$).',
      C: '273 Kelvin ($0^\\circ\\text{C}$).',
      D: '15 millones de Kelvin.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La intensa energía térmica inicial de la gran expansión se ha enfriado a lo largo de miles de millones de años debido a la continua expansión del espacio. Hoy en día vaga por el cosmos a una temperatura sumamente baja de aproximadamente $2,7 \\text{ K}$.',
    feedback_error: 'La radiación fósil se ha estirado tanto a longitudes de onda de microondas que equivale a un cuerpo negro térmico sumamente frío, apenas por encima del cero absoluto de temperatura.'
  },
  {
    id: 'q-fis-2-9-8',
    enunciado: '¿Qué componente misterioso de la cosmología moderna fue descubierto en 1998 al observar que las supernovas lejanas se alejan de nosotros de manera acelerada en el tiempo?',
    alternativas: {
      A: 'La Materia Oscura fría.',
      B: 'La Energía Oscura.',
      C: 'Los Agujeros Negros supermasivos.',
      D: 'Las Ondas de gravedad elásticas.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! El descubrimiento de la expansión acelerada del universo reveló la existencia de la Energía Oscura, una presión expansiva invisible y repulsiva que domina el cosmos a gran escala y acelera el distanciamiento de las galaxias.',
    feedback_error: 'La fuerza que acelera la expansión cósmica actuando en contra de la gravedad atractiva ordinaria de la materia es la energía oscura.'
  },
  {
    id: 'q-fis-2-9-9',
    enunciado: 'En la Ley de Hubble $v = H_0 \\cdot d$, ¿qué unidades de medida son las estándar empleadas en astronomía para expresar la distancia $d$ a las galaxias?',
    alternativas: {
      A: 'Años luz.',
      B: 'Kilómetros.',
      C: 'Megapársecs (Mpc).',
      D: 'Unidades Astronómicas (UA).'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! En cosmología extragaláctica, la distancia se expresa de manera habitual en Megapársecs (Mpc), donde $1 \\text{ Mpc} \\approx 3,26 \\text{ millones de años luz}$. La constante de Hubble se expresa en $(\\text{km/s}) / \\text{Mpc}$.',
    feedback_error: 'Las distancias espaciales a escalas de galaxias lejanas son tan inmensas que se emplean los pársecs multiplicados por un millón (prefijo Mega).'
  },
  {
    id: 'q-fis-2-9-10',
    enunciado: '¿Por qué la radiación cósmica de fondo de microondas (CMB) no pudo propagarse libremente por el universo antes de los 380.000 años de edad de este?',
    alternativas: {
      A: 'Porque el universo primitivo era un plasma ionizado denso y opaco donde los fotones chocaban constantemente con los electrones libres.',
      B: 'Porque no se habían formado los primeros fotones de luz.',
      C: 'Porque la fuerza de gravedad atraía la luz hacia los agujeros negros primordiales.',
      D: 'Porque las microondas viajaban a velocidad cero.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! En sus inicios, el universo era tan caliente que los átomos no podían unirse; era un plasma denso de electrones y protones libres que dispersaban continuamente la luz, haciéndolo opaco. A los 380.000 años, se enfrió lo suficiente para formar los primeros átomos neutros de hidrógeno (recombinación), permitiendo que la luz (CMB) viajara libre por primera vez (universo transparente).',
    feedback_error: 'El universo primitivo era una sopa de partículas calientes cargadas eléctricamente que impedían el libre tránsito de los haces de luz.'
  }
];

// -------------------------------------------------------------
// ENSAMBLADO DE LAS SECCIONES CON SUS RESPECTIVAS 10 PREGUNTAS
// -------------------------------------------------------------
poolPreguntasMecanica.push(...preguntasRestantes);

dataSeccionesTeoria.forEach((sec, idx) => {
  // Extraemos las 10 preguntas de la sección correspondiente
  const startIdx = idx * 10;
  const preguntasSeccion = poolPreguntasMecanica.slice(startIdx, startIdx + 10);

  // Verificamos que tenga 10 preguntas rigurosas
  if (preguntasSeccion.length < 10) {
    console.warn(`Alerta: Sección ${sec.id} tiene menos de 10 preguntas!`);
  }

  capMecanica.secciones.push({
    id: sec.id,
    capituloId: sec.capituloId,
    materiaId: sec.materiaId,
    title: sec.title,
    introduccion: sec.introduccion,
    datos_claves: sec.datos_claves,
    order: idx + 1,
    testId: `test-${sec.id}`,
    test: {
      id: `test-${sec.id}`,
      seccionId: sec.id,
      preguntas: preguntasSeccion
    }
  });
});

// Escribimos el JSON final en el directorio de scratch
const scratchPath = path.resolve(__dirname, 'fisica-cap2-mockup.json');
fs.writeFileSync(scratchPath, JSON.stringify([capMecanica], null, 2), 'utf8');

console.log('🎉 Mockup de Física del Capítulo 2 (Mecánica) generado exitosamente en scratch!');
console.log('Path absoluto del archivo generado:', scratchPath);
console.log('Cantidad de pasos/secciones:', capMecanica.secciones.length);
console.log('Total de preguntas generadas:', capMecanica.secciones.reduce((acc, s) => acc + s.test.preguntas.length, 0));
