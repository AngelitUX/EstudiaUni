const fs = require('fs');
const path = require('path');

// -------------------------------------------------------------
// DEFINICIÓN DE LA TEORÍA Y LAS PREGUNTAS DEL CAPÍTULO 3 DE FÍSICA (ENERGÍA - TIERRA)
// -------------------------------------------------------------

const capEnergiaTierra = {
  id: 'cap-fisica-3-energia-tierra',
  materiaId: 'ciencias-fisica',
  title: 'Eje Temático: Energía - Tierra',
  introduccion: 'Explora la dinámica interna de nuestro planeta, desde la tectónica de placas que sacude continentes hasta la estructura de la geosfera, el ciclo de las rocas y los fenómenos sísmicos y volcánicos.',
  order: 3,
  secciones: []
};

const dataSeccionesTeoria = [
  {
    id: 'sec-fis-3-1',
    title: '1. Deriva continental y tectónica de placas',
    introduccion: 'La Deriva Continental, propuesta por Alfred Wegener en 1912, postuló que los continentes estuvieron unidos en un supercontinente llamado Pangea. Hoy, la Tectónica de Placas explica que la Litosfera terrestre se divide en placas rígidas que se mueven sobre la Astenosfera debido a la convección del manto.',
    datos_claves: [
      '**Evidencias de Wegener**: Geográficas (coincidencia de costas), Paleontológicas (fósiles idénticos como **Mesosaurus** en océanos distintos), Litológicas (cadenas montañosas coincidentes) y Paleoclimáticas (glaciaciones simultáneas en zonas tropicales).',
      '**Límites Divergentes**: Las placas se separan. Se crea corteza oceánica nueva en las dorsales mesooceánicas o valles de rift (ej. Rift de África Oriental).',
      '**Límites Convergentes**: Las placas chocan. Subducción (placa oceánica densa desciende bajo otra placa, formando fosas y volcanes, como Nazca bajo la Sudamericana) o Colisión Continental (forma cordilleras como el Himalaya).',
      '**Límites Transformantes**: Las placas se deslizan lateralmente. No se crea ni se destruye corteza, pero provocan gran sismicidad por fricción (ej. Falla de San Andrés).'
    ]
  },
  {
    id: 'sec-fis-3-2',
    title: '2. Tectónica de placas y sus consecuencias',
    introduccion: 'La liberación repentina de energía acumulada en las fallas geológicas da origen a los sismos. Estos eventos se propagan mediante ondas elásticas que nos revelan el comportamiento dinámico terrestre. Además, la tectónica regula la actividad volcánica y la generación de tsunamis.',
    datos_claves: [
      '**Hipocentro vs Epicentro**: El hipocentro (o foco) es el punto interno de la corteza donde se origina la ruptura sísmica. El epicenter es la proyección vertical en la superficie terrestre.',
      '**Ondas de Cuerpo**: Ondas P (Primarias, longitudinales, compresionales, las más rápidas, viajan por sólidos y líquidos) y Ondas S (Secundarias, transversales, de corte, más lentas, solo viajan por sólidos).',
      '**Ondas Superficiales**: Ondas Rayleigh (movimiento elíptico vertical) y Ondas Love (movimiento lateral horizontal). Son las más lentas pero provocan los daños estructurales.',
      '**Magnitud vs Intensidad**: La Magnitud (escala Richter o Magnitud de Momento $M_w$) mide la energía liberada y es un valor único. La Intensidad (escala de Mercalli Modificada) mide de forma subjetiva el daño y la percepción humana en un punto específico.'
    ]
  },
  {
    id: 'sec-fis-3-3',
    title: '3. Geosfera y tectónica de placas',
    introduccion: 'La estructura profunda de la Tierra se estudia bajo dos enfoques: el composicional o químico (según la composición de las rocas) y el mecánico o dinámico (según el comportamiento físico de las capas). Además, la litosfera se renueva mediante el continuo ciclo de las rocas.',
    datos_claves: [
      '**Modelo Estático o Químico**: Divide la Tierra en **Corteza** (oceánica basáltica densa y continental granítica liviana), **Manto** (silicatos densos) y **Núcleo** (metálico, principalmente hierro y níquel).',
      '**Modelo Dinámico o Mecánico**: Divide en **Litosfera** (rígida y quebradiza, fragmentada en placas), **Astenosfera** (plástica, parcialmente fundida, donde hay convección), **Mesosfera** (manto inferior sólido y denso) y **Endosfera** (núcleo externo líquido que genera el campo geomagnético, y núcleo interno sólido).',
      '**Ciclo de las Rocas**: **Ígneas** (enfriamiento de magma, ej. granito o basalto), **Sedimentarias** (erosión, sedimentación y cementación, ej. arenisca, contienen fósiles) y **Metamórficas** (alteradas por altas presiones y temperaturas sin fundirse, ej. mármol).',
      '**Suelo**: Capa superficial dinámica de la corteza, estructurada en horizontes (O orgánico, A suelo fértil, B subsuelo y C roca madre desintegrada).'
    ]
  }
];

const poolPreguntas = [];

// ==========================================
// PREGUNTAS SECCIÓN 1 (1 a 20)
// ==========================================
poolPreguntas.push(
  {
    id: 'q-fis-3-1-1',
    enunciado: 'Alfred Wegener basó su hipótesis de la Deriva Continental en múltiples disciplinas científicas. ¿Cuál de las siguientes opciones describe una evidencia paleontológica directa utilizada por Wegener?',
    alternativas: {
      A: 'La forma complementaria entre las costas de América del Sur y África.',
      B: 'El hallazgo de fósiles idénticos del reptil terrestre **Mesosaurus** en rocas de las costas de Sudamérica y África, separados por un vasto océano.',
      C: 'La presencia de depósitos de carbón en regiones árticas actuales.',
      D: 'El descubrimiento de dorsales oceánicas mediante el mapeo por sonar.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! El hallazgo de fósiles de pequeños reptiles de agua dulce y terrestres (como **Mesosaurus** o **Cynognathus**) en continentes separados hoy en día por el Océano Atlántico fue una prueba irrefutable de que dichos continentes estuvieron unidos físicamente, ya que estos animales no podían nadar distancias oceánicas.',
    feedback_error: 'Recuerda que lo "paleontológico" hace referencia a restos fósiles de seres vivos. La complementariedad de costas es una evidencia puramente geográfica, y el sonar es una tecnología muy posterior a la época de Wegener.'
  },
  {
    id: 'q-fis-3-1-2',
    enunciado: '¿Por qué la comunidad geológica de principios del siglo XX rechazó inicialmente de forma casi unánime la hipótesis de la Deriva Continental propuesta por Alfred Wegener?',
    alternativas: {
      A: 'Porque Wegener carecía de evidencias fósiles que apoyaran sus ideas.',
      B: 'Porque no pudo proponer un mecanismo físico viable y físicamente verosímil que explicara cómo masas continentales masivas lograban moverse a través del denso fondo oceánico.',
      C: 'Porque la teoría geocéntrica de la época impedía considerar movimientos continentales.',
      D: 'Porque las mediciones por satélite de su época demostraban que los continentes estaban inmóviles.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Aunque las evidencias de Wegener eran abrumadoras, él sugirió que las fuerzas de las mareas lunares y la fuerza centrífuga de la rotación terrestre arrastraban los continentes. Los físicos demostraron que estas fuerzas eran millones de veces más débiles de lo necesario, dejando la teoría sin un motor dinámico hasta el descubrimiento de la convección del manto.',
    feedback_error: 'La comunidad científica no dudaba de las evidencias de Wegener, sino de su explicación de "cómo" se movían. Proponer que la Luna o la rotación de la Tierra empujaba continentes de granito era mecánicamente imposible.'
  },
  {
    id: 'q-fis-3-1-3',
    enunciado: '¿Cuál de las siguientes observaciones paleoclimáticas sirvió como pilar fundamental para sostener que los continentes actuales formaban el supercontinente Pangea en el pasado?',
    alternativas: {
      A: 'La existencia de desiertos áridos en el centro de América del Norte.',
      B: 'El descubrimiento de restos glaciares antiguos y estrías de fricción por hielo de una misma época en zonas hoy tropicales de la India, África central, Australia y Sudamérica.',
      C: 'El registro de temperaturas globales constantes durante el Jurásico.',
      D: 'La medición de las corrientes marinas profundas alrededor de la Antártida.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Wegener identificó que continentes que hoy están en latitudes cálidas o ecuatoriales muestran depósitos glaciares (tillitas) de la misma edad geológica. Si unimos los continentes cerca del Polo Sur, esta glaciación encaja perfectamente en una sola gran capa de hielo continental.',
    feedback_error: 'Lo paleoclimático estudia los climas del pasado. Encontrar evidencias de glaciación masiva en la India o África central solo tiene sentido si en el pasado esos trozos de tierra estaban situados en latitudes polares.'
  },
  {
    id: 'q-fis-3-1-4',
    enunciado: 'Durante la década de 1960, Harry Hess propuso la teoría de la **expansión del fondo oceánico**. ¿En qué estructura geológica submarina se genera activamente la nueva corteza oceánica del planeta?',
    alternativas: {
      A: 'En las fosas oceánicas abisales por subducción.',
      B: 'En las llanuras abisales por sedimentación continua.',
      C: 'En los ejes centrales de las dorsales mesooceánicas.',
      D: 'En los bordes de placas transformantes de gran fricción.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! Las dorsales oceánicas son cordilleras submarinas volcánicas en límites divergentes. En su centro (rift), el magma asciende constantemente desde el manto superior, se enfría al entrar en contacto con el agua marina y forma nueva litosfera oceánica basáltica que empuja la corteza previa a los lados.',
    feedback_error: 'La corteza oceánica no se crea en las fosas (allí se destruye por subducción) ni en fallas laterales. Se genera por vulcanismo en las fisuras centrales de las cordilleras submarinas (dorsales).'
  },
  {
    id: 'q-fis-3-1-5',
    enunciado: '¿Cuál es la evidencia física que demuestra que la corteza oceánica se expande de forma simétrica a partir del eje de una dorsal mesooceánica?',
    alternativas: {
      A: 'La densidad del agua oceánica es simétrica en todo el planeta.',
      B: 'El patrón simétrico de bandas de magnetismo alternadas (normal e invertido) registrado en los minerales de hierro de las rocas a ambos lados del eje de la dorsal.',
      C: 'El grosor uniforme de la sal marina a lo largo de las plataformas.',
      D: 'La ausencia completa de terremotos en el centro de las dorsales.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! A medida que el basalto fundido se enfría en la dorsal, sus minerales magnéticos se alinean con el campo magnético de la Tierra de ese momento. Como el campo magnético terrestre se invierte periódicamente, el fondo oceánico actúa como una cinta grabadora gigante que muestra bandas magnéticas simétricas de polaridad normal e invertida a ambos lados.',
    feedback_error: 'Este descubrimiento (hipótesis de Vine-Matthews-Morley) confirmó la expansión del fondo. Las rocas registran la polaridad magnética histórica de la Tierra en franjas paralelas y simétricas al centro volcánico.'
  },
  {
    id: 'q-fis-3-1-6',
    enunciado: 'Físicamente, ¿qué compone exactamente una placa tectónica o litosférica de nuestro planeta?',
    alternativas: {
      A: 'Únicamente la corteza continental u oceánica superficial.',
      B: 'Toda la Geosfera, desde la corteza hasta el núcleo interno.',
      C: 'La corteza terrestre junto con la porción más externa, sólida y rígida del manto superior (litosfera residual).',
      D: 'La porción viscosa del manto superior denominada astenosfera.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Una placa tectónica no es solo la corteza. Es un bloque rígido compuesto por la corteza y el manto superior litosférico. Esta capa unificada se conoce como **litosfera** y flota/desliza sobre la astenosfera plástica subyacente.',
    feedback_error: 'No confundas corteza con placa tectónica. La placa es más gruesa y rígida, abarcando la corteza completa y la fracción superior sólida del manto. Esta combinación se llama litosfera.'
  },
  {
    id: 'q-fis-3-1-7',
    enunciado: 'En los límites de placas del tipo **divergente**, ¿cuál de los siguientes fenómenos geológicos es el más característico?',
    alternativas: {
      A: 'La destrucción masiva de corteza continental por colisión.',
      B: 'La formación de fosas marinas profundas por subducción de sedimentos.',
      C: 'La creación de nueva corteza oceánica mediante vulcanismo de fisura y la formación de rifts.',
      D: 'El deslizamiento puramente horizontal sin ningún tipo de sismicidad asociada.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien! Los límites divergentes (zonas de tensión) separan placas. Esto abre grietas que permiten el ascenso de magma, creando nueva litosfera oceánica. Si ocurre en continentes, genera valles de rift que eventualmente pueden inundarse y formar nuevos mares.',
    feedback_error: 'Divergir significa separar. Al separarse las placas, el espacio abierto es rellenado por material fundido del manto, creando corteza nueva. No hay destrucción aquí.'
  },
  {
    id: 'q-fis-3-1-8',
    enunciado: 'Cuando una placa tectónica de tipo oceánica colisiona frontalmente contra una placa continental, ¿por qué se produce el fenómeno de la **subducción**?',
    alternativas: {
      A: 'Porque la placa continental es más delgada y densa, hundiéndose bajo la oceánica.',
      B: 'Porque la placa oceánica es compuesta principalmente de basalto, lo que la hace físicamente más densa y fría que la placa continental (granítica), forzándola a hundirse en el manto.',
      C: 'Porque la gravedad de la Luna atrae preferencialmente el fondo marino.',
      D: 'Porque la placa continental viaja a una velocidad diez veces superior.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La subducción está determinada por la densidad. La corteza oceánica basáltica es más densa ($3,0 \\text{ g/cm}^3$) que la corteza continental granítica ($2,7 \\text{ g/cm}^3$). Al chocar, la placa oceánica es arrastrada por la gravedad hacia el manto terrestre por debajo de la continental.',
    feedback_error: 'La física de la subducción depende estrictamente de la flotabilidad y densidad. La placa oceánica (basáltica) es más pesada por unidad de volumen que la continental (granítica), por lo que siempre se sumerge.'
  },
  {
    id: 'q-fis-3-1-9',
    enunciado: '¿Qué consecuencia geológica de gran escala se genera cuando colisionan de forma convergente dos placas de carácter estrictamente continental (sin subducción activa)?',
    alternativas: {
      A: 'La formación de una dorsal oceánica gigante en medio del continente.',
      B: 'La deformación de la corteza, acumulación de sedimentos y la formación de grandes cordilleras montañosas por plegamiento (obducción/colisión continental, ej. el Himalaya).',
      C: 'La apertura de un nuevo océano interior sin sismos.',
      D: 'El hundimiento de ambos continentes hacia el núcleo terrestre.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Puesto que las masas continentales tienen densidades bajas y similares, ninguna de las dos logra subducir en el denso manto superior. En su lugar, chocan frontalmente plegando, fallando e hiper-engrosando la corteza, lo que levanta inmensas cordilleras como los Himalayas en el choque de India con Eurasia.',
    feedback_error: 'Al chocar dos masas continentes de igual densidad flotante, ninguna se hunde. La corteza simplemente se arruga y eleva de forma masiva hacia arriba, creando cordilleras gigantescas.'
  },
  {
    id: 'q-fis-3-1-10',
    enunciado: 'La Falla de San Andreas en California es un ejemplo clásico de un límite de placas de carácter **transformante**. ¿Cuál es el comportamiento dinámico de las placas en este tipo de límite?',
    alternativas: {
      A: 'Se desplazan en sentidos opuestos alejándose de forma perpendicular.',
      B: 'Se mueven en igual sentido a diferentes alturas verticales.',
      C: 'Se deslizan de forma lateral y horizontal de manera paralela una con respecto a la otra, acumulando gran esfuerzo por fricción sólida sin actividad volcánica.',
      D: 'Una placa se hunde bajo la otra de forma oblicua constante.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En los límites transformantes o transcurrentes, las placas se deslizan horizontalmente en sentidos contrarios o con distintas velocidades. Al rozar continuamente sus bordes rocosos irregulares, se traban acumulando energía elástica que se libera súbitamente en forma de potentes sismos terrestres, sin vulcanismo debido a la ausencia de subducción o divergencia.',
    feedback_error: 'En un límite transformante no hay separación (divergencia) ni choque frontal (convergencia). Hay fricción lateral pura, por lo que no se funde roca para crear volcanes, pero sí hay terremotos severos.'
  },
  {
    id: 'q-fis-3-1-11',
    enunciado: 'El **Cinturón de Fuego del Pacífico** concentra más del $75\\%$ de los volcanes activos del mundo y la gran mayoría de los megaterremotos. Dinámicamente, ¿a qué se debe esta impresionante actividad geológica?',
    alternativas: {
      A: 'A que el Océano Pacífico contiene el agua más pesada y fría del planeta.',
      B: 'A la presencia masiva de límites convergentes por subducción alrededor de casi todo el perímetro de la Placa del Pacífico.',
      C: 'A que es la única región del planeta en contacto directo con el núcleo externo.',
      D: 'A la tracción gravitacional ejercida por el ecuador terrestre.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! El Cinturón de Fuego coincide con los bordes de la placa del Pacífico y adyacentes (Nazca, Cocos, Juan de Fuca, Filipinas) que están subduciendo continuamente bajo placas continentales o arcos de islas. Esta subducción masiva funde roca que alimenta miles de volcanes y genera gigantescas fallas de empuje sísmico.',
    feedback_error: 'La intensa sismicidad y vulcanismo del Pacífico se debe a la tectónica de placas. Es una herradura gigante de zonas de colisión y subducción donde la litosfera oceánica se destruye hundiéndose bajo los continentes.'
  },
  {
    id: 'q-fis-3-1-12',
    enunciado: '¿Cuál es el motor físico interno de nuestro planeta que impulsa de forma continua el desplazamiento de las placas tectónicas sobre la superficie terrestre?',
    alternativas: {
      A: 'La fricción magnética del núcleo interno sólido.',
      B: 'Las corrientes de convección térmica en el manto terrestre (astenosfera) impulsadas por el calor interno de la Tierra, combinadas con la fuerza de arrastre y el hundimiento por gravedad de las placas subducidas (*slab pull*).',
      C: 'Las ondas de marea marina profunda en las cuencas abisales.',
      D: 'Los vientos alisios que empujan las cordilleras continentales.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Perfecto! El calor interno de la Tierra (proveniente de la desintegración radiactiva y el calor primordial) calienta el manto inferior, haciéndolo menos denso para que ascienda. Al enfriarse arriba, vuelve a bajar. Este movimiento circular de convección, sumado a que la placa fría que subduce es muy pesada y tira del resto de la placa hacia abajo por gravedad (*slab pull*), es el motor de la tectónica.',
    feedback_error: 'La litosfera se mueve por la dinámica interna del planeta. La roca caliente del manto asciende y la fría desciende en celdas de convección térmica, actuando como una cinta transportadora de las placas.'
  },
  {
    id: 'q-fis-3-1-13',
    enunciado: 'Al observar un mapa del Océano Atlántico, Wegener notó que los contornos de las plataformas continentales de América del Sur y África parecen encajar geométricamente como piezas de un rompecabezas. ¿Cómo se clasifica formalmente este tipo de evidencia?',
    alternativas: {
      A: 'Evidencia Litológica.',
      B: 'Evidencia Paleoclimática.',
      C: 'Evidencia Geográfica.',
      D: 'Evidencia Geodésica.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! La coincidencia morfológica o geométrica de los bordes continentales (especialmente si se analiza el borde de la plataforma continental a unos $900 \\text{ m}$ de profundidad en lugar de la línea de costa actual) es una evidencia de tipo geográfica.',
    feedback_error: 'La complementariedad de las líneas de costa o límites continentales es un argumento puramente geométrico y espacial, lo cual corresponde a la geografía.'
  },
  {
    id: 'q-fis-3-1-14',
    enunciado: 'Si analizamos rocas y cadenas montañosas en el este de Estados Unidos (los Apalaches) y en las islas Británicas y Escandinavia, notamos que poseen exactamente la misma edad geológica, estructura y composición mineral. ¿Qué evidencia de la deriva continental representa esto?',
    alternativas: {
      A: 'Evidencia Geográfica.',
      B: 'Evidencia Litológica y Geológica.',
      C: 'Evidencia Paleontológica.',
      D: 'Evidencia Hidrográfica.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La concordancia de estructuras geológicas, tipos de rocas (litología) y cinturones montañosos truncados que continúan al otro lado del océano es una evidencia geológica/litológica directa de que en el pasado formaban una sola cordillera continua antes de abrirse el Atlántico.',
    feedback_error: 'Las rocas y montañas representan la estructura del suelo (geología y litología). No contienen seres vivos extintos (paleontología) ni son formas costeras (geografía).'
  },
  {
    id: 'q-fis-3-1-15',
    enunciado: 'Si medimos la edad geológica de los sedimentos y del basalto del fondo oceánico a medida que nos alejamos de una dorsal mesooceánica en dirección a un continente, ¿qué patrón físico se observa de manera constante?',
    alternativas: {
      A: 'La edad de las rocas es constante en todo el lecho marino.',
      B: 'Las rocas son más antiguas en el eje de la dorsal y se vuelven progresivamente más jóvenes cerca de los continentes.',
      C: 'Las rocas son extremadamente jóvenes en el eje de la dorsal y su edad aumenta de forma lineal y simétrica a medida que nos alejamos del eje hacia las costas continentales.',
      D: 'El fondo marino central posee las rocas más viejas de todo el planeta Tierra.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Dado que en la dorsal se está creando corteza de forma continua en el presente, las rocas del centro son recién nacidas ($0 \\text{ años}$). A medida que el lecho se expande lateralmente, las rocas viejas se alejan simétricamente. De hecho, el fondo marino nunca supera los $180$ millones de años porque termina subduciendo y fundiéndose en el manto.',
    feedback_error: 'El centro de la dorsal es un volcán activo permanente. Por ende, la roca de allí es la más joven de todas. A medida que viajas hacia los lados de la cordillera, vas encontrando rocas creadas hace millones de años en el pasado.'
  },
  {
    id: 'q-fis-3-1-16',
    enunciado: 'Chile se encuentra en una de las regiones más sísmicas del mundo debido al contacto entre la Placa de Nazca y la Placa Sudamericana. ¿Qué tipo de límite geológico existe entre estas dos placas y cómo interactúan?',
    alternativas: {
      A: 'Límite divergente; la Placa Sudamericana se aleja de la de Nazca mar adentro.',
      B: 'Límite convergente por subducción; la Placa de Nazca (oceánica y más densa) se introduce bajo la Placa Sudamericana (continental y más liviana).',
      C: 'Límite transformante; ambas se deslizan lateralmente sin chocar.',
      D: 'Límite de punto caliente estático en la cordillera.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La Placa de Nazca y la Placa Sudamericana convergen a una tasa aproximada de $6,5 \\text{ cm}$ al año. Al ser de naturaleza oceánica, la de Nazca subduce bajo el margen continental chileno, acumulando inmensos esfuerzos mecánicos que originan terremotos gigantes (como Valdivia 1960 o Maule 2010) y vulcanismo andino.',
    feedback_error: 'En el margen chileno hay un choque frontal de placas. La placa oceánica de Nazca se hunde activamente por debajo del territorio chileno continental, lo que define una subducción clásica.'
  },
  {
    id: 'q-fis-3-1-17',
    enunciado: 'Las islas de Hawái se formaron en medio de la Placa del Pacífico, muy lejos de cualquier límite de placas activo. ¿Qué modelo geológico explica la formación de esta cadena lineal de islas volcánicas?',
    alternativas: {
      A: 'Una falla transformante continental sumergida.',
      B: 'La colisión de microplacas oceánicas locales.',
      C: 'Un Punto Caliente (*Hot Spot*), provocado por una pluma térmica de magma estacionaria en el manto profundo sobre la cual la placa tectónica se desplaza lentamente en el tiempo.',
      D: 'La acumulación de sedimentos marinos empujados por el viento.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Soberbio! Los puntos calientes son columnas estables de material caliente que ascienden desde el límite manto-núcleo. Al fundir la corteza de la placa que pasa por encima, crean un volcán. A medida que la placa tectónica se mueve, el volcán activo se apaga y se aleja, iniciándose un nuevo volcán. Esto crea una hilera ordenada de islas donde la más alejada es la más antigua.',
    feedback_error: 'Hawái es un ejemplo de vulcanismo de intraplaca. Se origina por un chorro térmico fijo en el manto (punto caliente) que perfora la placa móvil a medida que esta transita por encima.'
  },
  {
    id: 'q-fis-3-1-18',
    enunciado: 'El Gran Valle del Rift en el este de África está fracturando el continente africano en dos bloques. ¿Qué fase del ciclo de supercontinentes representa esta estructura geológica activa?',
    alternativas: {
      A: 'La fase final de colisión continental.',
      B: 'La formación de una zona de subducción profunda.',
      C: 'La etapa inicial de un límite divergente continental, donde la corteza terrestre se estira, adelgaza y fractura, iniciando la separación que creará un nuevo océano.',
      D: 'El cese completo de la tectónica de placas en el hemisferio sur.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! El Rift Africano es un límite divergente naciente en la corteza continental. Las fuerzas tensionales separan el continente, provocando fallas y hundimientos de terreno (valles de rift). Con el tiempo, este valle descenderá por debajo del nivel del mar, se inundará (formando un mar estrecho como el Mar Rojo) y finalmente dará origen a un océano con dorsal propia.',
    feedback_error: 'Un rift es una fractura por estiramiento. Es la fase inicial de separación planetaria. Si las placas continúan alejándose, el valle se convertirá en un océano futuro.'
  },
  {
    id: 'q-fis-3-1-19',
    enunciado: '¿A qué orden de magnitud de velocidad promedio anual se desplazan las placas tectónicas sobre la astenosfera terrestre?',
    alternativas: {
      A: 'Unos pocos centímetros por año (similar a la velocidad de crecimiento de las uñas humanas).',
      B: 'Varios kilómetros por hora, comparable con un peatón caminando.',
      C: 'Cientos de metros por día durante las mareas altas.',
      D: 'Las placas no se mueven de forma constante, solo se desplazan en el instante exacto de los terremotos.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Correcto! El movimiento tectónico es sumamente lento y continuo, promediando velocidades de $1 \\text{ a } 10 \\text{ centímetros al año}$. Es por esto que los cambios en el relieve planetario toman millones de años en hacerse notorios a escala humana.',
    feedback_error: 'Aunque asociamos la tectónica con terremotos repentinos, las placas se deslizan de forma continua a paso extremadamente lento, del orden de centímetros anuales.'
  },
  {
    id: 'q-fis-3-1-20',
    enunciado: 'Wegener postuló que en el pasado geológico existió una única y gigantesca masa de tierra emergida rodeada por un océano global llamado Panthalassa. ¿Qué nombre otorgó Wegener a este supercontinente?',
    alternativas: {
      A: 'Gondwana.',
      B: 'Laurasia.',
      C: 'Pangea.',
      D: 'Rodinia.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Wegener acuñó el término **Pangea**, que en griego clásico significa "toda la Tierra" ($pan$ = todo, $gea$ = Tierra). Con el tiempo, Pangea se fragmentó en Gondwana (sur) y Laurasia (norte), dividiéndose progresivamente hasta dar forma a la distribución continental que conocemos hoy.',
    feedback_error: 'El supercontinente global descrito por Wegener en 1912 se llama Pangea. Gondwana y Laurasia son fragmentaciones menores posteriores.'
  }
);

// ==========================================
// PREGUNTAS SECCIÓN 2 (21 a 40)
// ==========================================
poolPreguntas.push(
  {
    id: 'q-fis-3-2-1',
    enunciado: 'Al producirse la ruptura de una falla geológica que origina un terremoto, ¿cómo se denominan y diferencian los puntos espaciales conocidos como **hipocentro** y **epicentro**?',
    alternativas: {
      A: 'El epicentro es la zona interna profunda donde se inicia el sismo; el hipocentro es el punto marino donde nace un tsunami.',
      B: 'El hipocentro (o foco) es el punto exacto en el interior de la Tierra donde se inicia la liberación de energía elástica; el epicentro es la proyección geométrica vertical de dicho punto en la superficie terrestre.',
      C: 'Son sinónimos absolutos que denotan el punto de mayor destrucción estructural.',
      D: 'El hipocentro mide la intensidad física y el epicentro mide la magnitud matemática.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Perfecto! El hipocentro es subterráneo (punto de origen tridimensional de la ruptura de la roca). El epicentro es bidimensional y se sitúa en la superficie de la Tierra (la coordenada geográfica), siendo usualmente el lugar que experimenta las ondas sísmicas con mayor energía inicial.',
    feedback_error: 'Recuerda el prefijo griego: **hipo** significa abajo o debajo (foco interno) y **epi** significa sobre o encima (proyección superficial).'
  },
  {
    id: 'q-fis-3-2-2',
    enunciado: 'Las **ondas P (Primarias)** son las primeras en ser registradas por los sismógrafos tras un sismo. ¿Cuáles son las propiedades mecánicas que caracterizan a estas ondas de cuerpo?',
    alternativas: {
      A: 'Son ondas transversales que solo se propagan a través de medios sólidos rígidos.',
      B: 'Son ondas longitudinales y compresionales, donde las partículas del medio oscilan en la misma dirección de propagación de la onda, y pueden viajar tanto por medios sólidos como líquidos.',
      C: 'Son ondas superficiales de gran amplitud que provocan movimientos elípticos en el suelo.',
      D: 'Son ondas que se propagan exclusivamente por la ionosfera terrestre.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Las ondas P funcionan igual que las ondas de sonido: comprimen y expanden el medio en su dirección de avance. Al ser compresionales, se propagan por cualquier estado físico de la materia. Son las ondas sísmicas más veloces en la corteza ($\\approx 5-8 \\text{ km/s}$).',
    feedback_error: 'Asocia las ondas P con ondas mecánicas compresionales y longitudinales (como el sonido). Al ser elásticas y de presión, logran cruzar fluidos líquidos (como el núcleo externo) y sólidos.'
  },
  {
    id: 'q-fis-3-2-3',
    enunciado: 'Las **ondas S (Secundarias)** poseen características de propagación particulares que permitieron a los geofísicos deducir la naturaleza del interior de la Tierra. ¿Cuál es su comportamiento físico clave?',
    alternativas: {
      A: 'Son las más rápidas de todas y cruzan fluidos sin desviarse.',
      B: 'Son ondas transversales de corte, donde el medio oscila perpendicularmente a la dirección de propagación, y poseen la limitación física de propagarse únicamente en medios sólidos, extinguiéndose en líquidos.',
      C: 'Se mueven exclusivamente en el agua oceánica provocando tsunamis abisales.',
      D: 'Su velocidad es idéntica a la rapidez de la luz en el vacío.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! Las ondas S deforman lateralmente el medio (cizalle). Como los líquidos no tienen rigidez elástica de corte (no se oponen a ser cizallados, fluyen), las ondas S no pueden transmitirse en ellos. Al notar que las ondas S no cruzaban el núcleo externo de la Tierra, se comprobó experimentalmente que este es estrictamente líquido.',
    feedback_error: 'Las ondas S son de cizalle transversales. Piensa en sacudir una cuerda. Para propagar este movimiento requieres enlaces rígidos entre moléculas. Como los líquidos no resisten deformaciones de corte, las ondas S se detienen por completo al chocar con una capa líquida.'
  },
  {
    id: 'q-fis-3-2-4',
    enunciado: 'Las ondas sísmicas superficiales son las principales responsables de las catástrofes estructurales urbanas. ¿Cuál es la diferencia de movimiento del suelo provocada por las **ondas Rayleigh** y las **ondas Love**?',
    alternativas: {
      A: 'Las Rayleigh provocan un movimiento helicoidal ascendente y las Love oscilaciones sónicas aéreas.',
      B: 'Las Rayleigh mueven el suelo de forma elíptica en un plano vertical (similar a las olas del mar); las Love provocan un desplazamiento puramente horizontal y perpendicular a la propagación (cizalle lateral en superficie).',
      C: 'Las Rayleigh viajan por el mar y las Love por la arena de playa.',
      D: 'No hay diferencias de movimiento, ambas sacuden el suelo en todas las direcciones simétricas.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Las ondas sísmicas de superficie se ramifican al llegar las ondas internas a la superficie. Las ondas Rayleigh producen un balanceo vertical elíptico retrógrado. Las ondas Love sacuden la tierra lateralmente en zigzag horizontal, movimiento que cizalla y destruye los cimientos de los edificios.',
    feedback_error: 'Visualiza el suelo. Las Rayleigh causan ondas tipo oleaje marino (subir y bajar en elipse). Las Love son movimientos horizontales de lado a lado que retuercen estructuras terrestres.'
  },
  {
    id: 'q-fis-3-2-5',
    enunciado: 'Un sismólogo analiza un sismograma y nota que el intervalo de tiempo transcurrido entre la llegada de las primeras ondas P y las primeras ondas S (intervalo $t_S - t_P$) es de $40 \\text{ segundos}$. Si en otra estación sismológica dicho intervalo es de $15 \\text{ segundos}$, ¿qué se puede afirmar sobre la distancia de ambas estaciones al epicentro del sismo?',
    alternativas: {
      A: 'La primera estación está más cerca del epicentro que la segunda.',
      B: 'Ambas estaciones se encuentran exactamente a la misma distancia del epicentro.',
      C: 'La primera estación se sitúa más alejada del epicentro que la segunda, porque las ondas P y S se van separando progresivamente a medida que viajan debido a sus diferencias de velocidad.',
      D: 'La distancia es inversamente proporcional a la masa de las estaciones.'
    },
    // Continuaremos inyectando el resto de las preguntas con total rigurosidad
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Como las ondas P viajan mucho más rápido que las ondas S, a medida que recorren más distancia terrestre, la delantera de la onda P respecto a la S se va ensanchando continuamente. Una diferencia de tiempo mayor ($40 \\text{ s}$ vs $15 \\text{ s}$) indica inequívocamente que el sismo ocurrió más lejos de la primera estación sismológica.',
    feedback_error: 'Piensa en una carrera entre un auto veloz (onda P) y uno más lento (onda S). A medida que avanza la carrera y recorren más kilómetros, la distancia física y temporal entre ellos se hace más grande.'
  },
  {
    id: 'q-fis-3-2-6',
    enunciado: 'Para localizar geográficamente de forma precisa el epicentro de un terremoto en la superficie terrestre, ¿cuál es el número mínimo de estaciones sismológicas independientes que se requieren y qué método geométrico se emplea?',
    alternativas: {
      A: 'Una estación mediante la medición directa de la dirección del primer sacudón.',
      B: 'Dos estaciones cruzando sus mediciones de amplitud máxima.',
      C: 'Al menos tres estaciones sismológicas, utilizando el método de triangulación o intersección de las circunferencias de radio igual a la distancia epicentral calculada para cada estación.',
      D: 'Cinco estaciones midiendo únicamente la escala subjetiva de Mercalli.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Cada estación determina su distancia al epicentro a partir de la diferencia de tiempo P-S, lo que permite dibujar una circunferencia de radio conocido alrededor de la estación. Una circunferencia sola da infinitos puntos; dos circunferencias se cortan en dos puntos posibles; y la tercera circunferencia intersecta exactamente en el único punto común: el epicentro (triangulación).',
    feedback_error: 'Con una sola estación sabes a qué distancia ocurrió el sismo, pero no en qué dirección (es una circunferencia). Con dos estaciones tienes dos posibles intersecciones. Requieres una tercera para descartar el punto incorrecto y definir el epicentro.'
  },
  {
    id: 'q-fis-3-2-7',
    enunciado: 'La escala de Magnitud de Momento ($M_w$) y la escala Richter son de carácter logarítmico. Si un terremoto A posee una magnitud de $8,0$ y un sismo B posee una magnitud de $6,0$, ¿cuánta energía sísmica adicional liberó aproximadamente el sismo A en comparación con el sismo B?',
    alternativas: {
      A: '2 veces más energía.',
      B: '20 veces más energía.',
      C: '100 veces más energía.',
      D: 'Aproximadamente 1000 veces más energía.'
    },
    respuesta_correcta: 'D',
    feedback_acierto: '¡Soberbio! En las escalas sismológicas de magnitud, cada paso entero en la escala (por ejemplo, de 6,0 a 7,0) representa multiplicar la energía liberada por un factor de aproximadamente $31,6$ o $32$ veces. Para dos unidades de diferencia (de 6,0 a 8,0), la energía adicional liberada es $31,6^2 \\approx 1000$ veces superior.',
    feedback_error: '¡Cuidado! La magnitud sísmica no es lineal ni logarítmica de base 10 para la energía (aunque sí para la amplitud de onda). Un aumento de 1 grado de magnitud multiplica la energía liberada por $31,6$ veces. Un aumento de 2 grados multiplica por $31,6 \\times 31,6 \\approx 1000$ veces.'
  },
  {
    id: 'q-fis-3-2-8',
    enunciado: 'La **Escala de Mercalli Modificada** mide la **Intensidad** de un terremoto. ¿Cuál de las siguientes afirmaciones describe correctamente esta escala?',
    alternativas: {
      A: 'Mide la cantidad matemática de energía mecánica liberada en el foco sísmico.',
      B: 'Es una escala subjetiva y cualitativa expresada en números romanos del I al XII, que evalúa los efectos perceptibles del sismo en las personas y el nivel de daño causado en las estructuras en una localidad específica.',
      C: 'Es una escala científica objetiva que mide la aceleración máxima del suelo en metros por segundo al cuadrado.',
      D: 'Es un valor único y global para cada terremoto determinado por satélites.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La intensidad Mercalli no mide la potencia física del sismo en sí, sino sus efectos observados en el entorno. Un terremoto de gran magnitud en medio del desierto tendrá intensidad Mercalli muy baja (I o II) por no causar daños, mientras que un sismo moderado bajo una ciudad mal construida puede alcanzar intensidades Mercalli devastadoras (IX o X).',
    feedback_error: 'La intensidad de Mercalli depende del daño local. Es cualitativa, usa números romanos (ej. Grado VIII) y varía según el lugar de observación, el suelo y la calidad de la edificación.'
  },
  {
    id: 'q-fis-3-2-9',
    enunciado: 'Un terremoto de magnitud $7,5$ sacude dos ciudades. En la ciudad X, cimentada sobre roca sólida basáltica, los daños son menores y la gente apenas se asustó. En la ciudad Y, cimentada sobre rellenos arenosos sueltos y húmedos, colapsaron varios edificios y el suelo se comportó como lodo líquido. ¿A qué fenómeno físico se debe esta diferencia de intensidad?',
    alternativas: {
      A: 'A que la magnitud en la ciudad Y fue el doble que en la ciudad X.',
      B: 'Al fenómeno de **amplificación sísmica y licuefacción de suelos**, donde los suelos blandos y saturados de agua pierden cohesión ante la vibración y magnifican la amplitud de las ondas sísmicas.',
      C: 'A que las ondas S solo lograron viajar hacia la ciudad Y.',
      D: 'A la diferencia de presión atmosférica entre ambas urbes.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Los suelos rocosos transmiten la energía sísmica rápidamente sin deformarse mucho. En cambio, los suelos no consolidados, arenosos o con agua (pantanos, rellenos) sufren amplificación sísmica y licuefacción: el agua de los poros sube por la sacudida, separando los granos de arena, haciendo que el suelo pierda capacidad de soportar carga y se comporte como un fluido denso.',
    feedback_error: 'El tipo de suelo bajo los cimientos de una construcción determina dramáticamente la sacudida. Los suelos blandos y húmedos amplifican la onda sísmica y sufren licuefacción, desmoronándose bajo las estructuras.'
  },
  {
    id: 'q-fis-3-2-10',
    enunciado: '¿Cuál es la causa física primaria de la generación de destructores **tsunamis** o maremotos en el océano a partir de eventos sísmicos?',
    alternativas: {
      A: 'El choque sónico de la atmósfera sobre el nivel del mar.',
      B: 'Una fractura puramente lateral en una falla transformante en medio de una isla arenosa.',
      C: 'Un terremoto submarino de gran magnitud (usualmente convergente de subducción) que provoca un desplazamiento vertical repentino del lecho marino, empujando y desplazando verticalmente la columna de agua oceánica superior.',
      D: 'La atracción gravitacional extrema ocurrida durante los eclipses lunares.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! Para generar un tsunami, se necesita deformar mecánicamente el lecho del océano verticalmente (subida o bajada abrupta de un bloque de roca en una falla de subducción). Esto perturba instantáneamente el nivel del mar, creando una onda de gravedad masiva que se propaga por toda la cuenca oceánica.',
    feedback_error: 'Un terremoto que solo desplace el lecho marino de forma horizontal (como una falla transformante) no alterará verticalmente la columna de agua, por lo que no generará un tsunami. Requieres un levantamiento o hundimiento vertical súbito del fondo oceánico.'
  },
  {
    id: 'q-fis-3-2-11',
    enunciado: '¿Cómo cambia el comportamiento físico de una ola de tsunami a medida que viaja desde el océano profundo (alta mar) hacia la costa poco profunda?',
    alternativas: {
      A: 'Su velocidad aumenta enormemente y la altura de la ola se reduce a cero.',
      B: 'Su velocidad disminuye progresivamente debido a la fricción con el fondo marino poco profundo, lo que provoca que las ondas de agua se compriman horizontalmente y la altura de la ola aumente de forma espectacular por conservación de energía.',
      C: 'La ola se desvía y retrocede al hemisferio contrario.',
      D: 'La temperatura del agua de la ola sube hasta el punto de ebullición.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! En el océano profundo, un tsunami viaja a velocidades de un avión jet ($\\approx 800 \\text{ km/h}$) pero su altura es imperceptible ($< 1 \\text{ metro}$). Al acercarse a la costa, la profundidad disminuye, la base de la ola se frena y la parte trasera de la ola se amontona sobre la delantera, elevando una pared de agua gigante y destructiva.',
    feedback_error: 'En agua profunda el tsunami es veloz y bajo. Al llegar a aguas llanas costeras, la ola se frena por rozamiento con el fondo, y por conservación de la masa y energía, el agua se apila verticalmente elevando la ola a gran altura.'
  },
  {
    id: 'q-fis-3-2-12',
    enunciado: 'El vulcanismo está íntimamente ligado a la tectónica de placas. ¿Por qué se genera magma y actividad volcánica en una zona de **subducción**?',
    alternativas: {
      A: 'Porque el choque directo genera fricción mecánica extrema que derrite toda la corteza de golpe.',
      B: 'Porque la placa oceánica arrastra agua marina y minerales hidratados hacia el manto caliente. Al liberarse este vapor de agua, disminuye el punto de fusión de las rocas del manto superior, permitiendo que se fundan y formen magma ascendente.',
      C: 'Porque la placa continental arrastra el aire frío del exterior que oxigena el manto.',
      D: 'Únicamente debido a la presión hidrostática del océano sobre las rocas.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! Este es uno de los conceptos termodinámicos más hermosos de la geología: el fundido por flujo. La adición de agua (un fundente) rompe los enlaces químicos en las rocas calientes del manto superior de la placa continental, reduciendo su punto de fusión en varios cientos de grados. Esto genera magma que asciende por flotabilidad creando arcos volcánicos (como la Cordillera de los Andes).',
    feedback_error: 'El calor de fricción no es suficiente para crear vulcanismo masivo de arco. Lo que derrite el manto es el agua marina arrastrada por la placa oceánica al sumergirse, la cual actúa como fundente químico reduciendo el punto de fusión de la roca del manto superior.'
  },
  {
    id: 'q-fis-3-2-13',
    enunciado: 'Un volcán presenta erupciones sumamente violentas y explosivas, expulsando grandes columnas de ceniza y piroclastos. ¿Cuáles son las propiedades físicas del magma que originan esta explosividad?',
    alternativas: {
      A: 'Baja viscosidad y nulo contenido de gases disueltos.',
      B: 'Alta viscosidad (magma rico en sílice, espeso y lento) y un elevado contenido de gases disueltos que quedan atrapados acumulando inmensas presiones hasta romper de forma violenta el tapón volcánico.',
      C: 'Una temperatura extremadamente baja cercana al punto de congelación.',
      D: 'La presencia de metales magnéticos que interactúan con el aire.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Los magmas ricos en sílice (félsicos/ácidos) son muy viscosos y fluyen con dificultad. Los gases volcánicos (vapor de agua, $CO_2$) no pueden escapar fácilmente de este magma espeso. Al ascender, los gases se expanden pero al estar atrapados, acumulan una enorme presión elástica que estalla de forma destructiva pulverizando la roca.',
    feedback_error: 'La explosividad volcánica depende del espesor (viscosidad) y el gas del magma. Si es fluido (poca sílice), los gases escapan suavemente (erupción efusiva como Hawái). Si es espeso (mucha sílice), los gases quedan atrapados como en una botella de champaña agitada, explotando al liberarse.'
  },
  {
    id: 'q-fis-3-2-14',
    enunciado: '¿Qué es una **laguna sísmica** (seismic gap) y por qué representa una variable crucial en la gestión de riesgos naturales?',
    alternativas: {
      A: 'Un lago termal formado sobre un cráter volcánico inactivo.',
      B: 'Una zona costera inundada permanentemente por marejadas menores.',
      C: 'Un segmento geográfico de una falla geológica activa que no ha experimentado terremotos significativos durante un período de tiempo prolongado en comparación con las zonas circundantes, indicando que está acumulando energía elástica de tensión y posee alta probabilidad de generar un gran sismo en el futuro.',
      D: 'El periodo de calma absoluta que ocurre exactamente durante la noche posterior a un terremoto.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! En bordes de placas activos, la deformación de la corteza avanza de forma constante. Si un sector de la falla no ha liberado tensión rompiéndose mediante terremotos en décadas o siglos, significa que la falla está bloqueada y sometida a inmensos esfuerzos elásticos acumulados, elevando la amenaza sísmica local (ej. la laguna sísmica del norte de Chile o la de San Ramón).',
    feedback_error: 'Asocia "laguna" con un vacío o brecha temporal en el registro sísmico. Es un tramo de falla trabada donde hace mucho tiempo no tiembla, acumulando energía elástica de forma peligrosa.'
  },
  {
    id: 'q-fis-3-2-15',
    enunciado: '¿Es posible que un sismo de magnitud $5,0$ cause daños estructurales catastróficos equivalentes a una intensidad Mercalli de IX?',
    alternativas: {
      A: 'No, la magnitud limita matemáticamente la intensidad Mercalli al mismo valor exacto.',
      B: 'Sí, puede ocurrir si el hipocentro es extremadamente superficial, se ubica directamente debajo de una zona urbana muy poblada con edificaciones precarias y sin normas de diseño antisísmico, apoyadas en suelos de arcilla blanda.',
      C: 'Sí, pero solo si el sismo ocurre durante el invierno por congelación de las ondas.',
      D: 'No, un sismo de magnitud 5 es físicamente incapaz de derribar estructuras en cualquier circunstancia.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La intensidad mide daños reales. Aunque un sismo de magnitud $5,0$ libera una energía moderada, si ocurre a muy poca profundidad ($< 5 \\text{ km}$) directamente bajo una zona densamente poblada con construcciones de mala calidad (como adobe o albañilería sin refuerzo) sobre suelos blandos, la sacudida concentrada local puede causar estragos severos.',
    feedback_error: 'La magnitud mide la energía liberada en el origen, pero el daño en superficie (intensidad) depende de la cercanía al foco, la calidad de las construcciones y el tipo de suelo. Con mala infraestructura y cercanía extrema, sismos moderados pueden ser destructivos.'
  },
  {
    id: 'q-fis-3-2-16',
    enunciado: '¿Qué tipo de energía renovable aprovecha de forma directa las consecuencias térmicas de la tectónica de placas y la proximidad geológica a cámaras de magma subterráneas?',
    alternativas: {
      A: 'Energía Solar Fotovoltaica.',
      B: 'Energía Mareomotriz profunda.',
      C: 'Energía Geotérmica.',
      D: 'Energía Eólica costera.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! La energía geotérmica aprovecha el calor interno de la Tierra. En zonas tectónicas activas (como límites convergentes o rifts), las cámaras magmáticas están cerca de la superficie, calentando reservorios de agua subterránea. Esta agua o vapor a alta presión se extrae mediante pozos para mover turbinas eléctricas.',
    feedback_error: 'El prefijo **geo** significa Tierra y **termo** calor. La energía del calor terrestre vinculada a zonas volcánicas y tectónicas activas se conoce como energía geotérmica.'
  },
  {
    id: 'q-fis-3-2-17',
    enunciado: 'Las ondas sísmicas de cuerpo viajan por el interior terrestre curvando continuamente su trayectoria. ¿Cuál es la causa física de esta refracción constante de las ondas en la Geosfera?',
    alternativas: {
      A: 'A que la Tierra es completamente plana en su interior.',
      B: 'A que las ondas sísmicas rebotan en los depósitos de metales líquidos de la corteza.',
      C: 'A que la densidad, elasticidad y rigidez de los materiales terrestres aumentan gradualmente con la profundidad, provocando un incremento progresivo de la velocidad de las ondas y la curvatura de sus trayectorias hacia la superficie.',
      D: 'Al efecto Doppler provocado por la rotación del núcleo.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Soberbio! Al igual que la luz se curva al cruzar medios de diferente densidad óptica (refracción), las ondas sísmicas refractan al cambiar las propiedades elásticas de las rocas. En la Geosfera, la presión hace que las rocas profundas sean más densas y rígidas, acelerando las ondas y curvando sus trayectos en líneas arqueadas.',
    feedback_error: 'Las ondas mecánicas cambian de velocidad al pasar por medios con distintas densidades y rigideces elásticas. En la Tierra profunda, las rocas están más compactadas y rígidas, provocando que las ondas se refracten y curven de forma continua.'
  },
  {
    id: 'q-fis-3-2-18',
    enunciado: '¿Cómo ayudó el análisis de la **zona de sombra** de las ondas S a determinar el radio del núcleo terrestre?',
    alternativas: {
      A: 'Las ondas S se amplificaban al cruzar la Tierra, demostrando que el centro es un gran amplificador elástico.',
      B: 'El sismólogo Richard Dixon Oldham y posteriormente Harold Jeffreys notaron que las ondas S desaparecían por completo en sismógrafos situados a más de $103^\\circ$ de distancia angular desde el epicentro del sismo, revelando que chocaban contra un gigantesco obstáculo central de carácter líquido (el núcleo externo) que las extinguía por completo.',
      C: 'Las ondas S se convertían en ondas electromagnéticas luminosas al cruzar el manto.',
      D: 'El núcleo absorbía calor de las ondas acelerándolas al infinito.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Dado que las ondas S no pueden viajar por líquidos, el gigantesco núcleo externo líquido proyecta una "sombra sísmica" de ondas S en el lado opuesto de la Tierra. El tamaño geométrico de esta zona de sombra permitió a los geofísicos calcular con precisión matemática que el núcleo externo comienza a unos $2900 \\text{ km}$ de profundidad.',
    feedback_error: 'Las ondas S son incapaces de propagarse en líquidos. Al notar que ningún sismógrafo del planeta registraba ondas S directas al otro lado de la Tierra frente a un sismo, se dedujo que chocaban contra una enorme masa líquida central, definiendo el núcleo de la Tierra.'
  },
  {
    id: 'q-fis-3-2-19',
    enunciado: '¿Cuál es la diferencia fundamental entre los términos de prevención civil denominados **Peligro Sísmico (Amenaza)** y **Riesgo Sísmico**?',
    alternativas: {
      A: 'Son sinónimos absolutos que denotan la probabilidad de colapso.',
      B: 'El Peligro Sísmico es la probabilidad natural de que ocurra un sismo de cierta magnitud en una zona en un tiempo dado (fenómeno natural incontrolable); el Riesgo Sísmico evalúa la probabilidad de pérdidas humanas y económicas, combinando el peligro con la vulnerabilidad estructural y social expuesta.',
      C: 'El peligro lo miden los geólogos y el riesgo es un invento de las aseguradoras.',
      D: 'El peligro ocurre en el hipocentro y el riesgo en el epicentro.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Perfecto! La amenaza o peligro es puramente natural (ej. Chile tiene un peligro sísmico altísimo por subducción). El riesgo depende de cómo nos preparamos: $\\text{Riesgo} = \\text{Peligro} \\times \\text{Exposición} \\times \\text{Vulnerabilidad}$. Si diseñamos excelentes edificios sismorresistentes, reducimos nuestra vulnerabilidad y, por ende, reducimos el riesgo sísmico de catástrofe.',
    feedback_error: 'Distingue entre el fenómeno natural inevitable (amenaza/peligro de que tiemble) y los daños o pérdidas probables (riesgo, determinado por qué tan preparadas y seguras son nuestras casas ante ese temblor).'
  },
  {
    id: 'q-fis-3-2-20',
    enunciado: 'Un sismograma muestra que el primer movimiento registrado de una onda P es una oscilación abrupta hacia arriba de la aguja. ¿Qué tipo de esfuerzo mecánico inicial en la falla geológica revela esta polaridad del primer arribo sísmica?',
    alternativas: {
      A: 'Un esfuerzo de tensión o extensión pura (descompresión).',
      B: 'Un esfuerzo de compresión en la dirección de la estación sismológica.',
      C: 'Un deslizamiento lateral puramente transformante sin deformación.',
      D: 'La detonación de un volcán de aire caliente.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio nivel de geofísica! El primer movimiento (arribo) de la onda P en el sismógrafo muestra si la roca en el foco fue empujada hacia la estación (movimiento inicial compresional, sacudida vertical hacia arriba) o alejada de ella (movimiento tensional/dilatacional, sacudida inicial hacia abajo). Esto permite deducir el mecanismo focal de la falla.',
    feedback_error: 'La dirección del primer movimiento de la onda P nos dice si el material rocoso sufrió compresión inicial (empujón vertical del suelo hacia arriba) o extensión inicial (tirón del suelo hacia abajo) en esa dirección geográfica.'
  }
);

// ==========================================
// PREGUNTAS SECCIÓN 3 (41 a 60)
// ==========================================
poolPreguntas.push(
  {
    id: 'q-fis-3-3-1',
    enunciado: 'El modelo composicional o químico de la Geosfera clasifica las capas de la Tierra según la naturaleza de sus rocas y elementos químicos. ¿Cuáles son estas capas ordenadas desde la superficie hacia el interior?',
    alternativas: {
      A: 'Litosfera, Astenosfera y Endosfera.',
      B: 'Corteza, Manto y Núcleo.',
      C: 'Corteza, Astenosfera y Núcleo Externo.',
      D: 'Suelo, Sedimento y Roca Madre.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! El modelo composicional/estático analiza los compuestos químicos. Se estructura en: 1) **Corteza** (capa fina rica en silicatos de aluminio), 2) **Manto** (capa masiva rica en silicatos de hierro y magnesio) y 3) **Núcleo** (esfera metálica central superdensa de hierro y níquel).',
    feedback_error: 'El modelo composicional separa las capas por la química de sus materiales de roca. Este modelo define de forma clásica únicamente tres capas: Corteza, Manto y Núcleo.'
  },
  {
    id: 'q-fis-3-3-2',
    enunciado: 'Al comparar la **corteza continental** con la **corteza oceánica**, ¿cuáles son las diferencias físicas de grosor y densidad que se presentan de manera rigurosa?',
    alternativas: {
      A: 'La corteza continental es más fina y densa que la oceánica.',
      B: 'Ambas corteza poseen el mismo grosor pero la oceánica flota más alto.',
      C: 'La corteza continental es más gruesa ($\\approx 30-70 \\text{ km}$) y menos densa ($\\approx 2,7 \\text{ g/cm}^3$, de tipo granítico); la corteza oceánica es más delgada ($\\approx 5-10 \\text{ km}$) pero más densa ($\\approx 3,0 \\text{ g/cm}^3$, de tipo basáltico).',
      D: 'La corteza oceánica es exclusivamente gaseosa debido a la evaporación profunda.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! La corteza oceánica es más delgada porque se crea y destruye rápido en las dorsales y fosas. Al ser de basalto denso, se asienta más abajo en el manto. La corteza continental es vieja, gruesa, está compuesta de rocas graníticas más ligeras y "flota" más arriba inercialmente en el manto viscoso.',
    feedback_error: 'Recuerda las rocas dominantes: los continentes son granito ligero (baja densidad, flotan alto y son gruesos). El fondo del mar es basalto denso y compacto (alta densidad, se asientan abajo y son delgados).'
  },
  {
    id: 'q-fis-3-3-3',
    enunciado: 'El modelo mecánico o dinámico de la Geosfera clasifica las capas de la Tierra según su comportamiento físico y rigidez mecánica ante esfuerzos mecánicos. ¿Cuáles son estas capas desde el exterior al interior?',
    alternativas: {
      A: 'Corteza, Manto y Núcleo.',
      B: 'Litosfera, Astenosfera, Mesosfera y Endosfera (dividida en núcleo externo e interno).',
      C: 'Litosfera, Manto y Núcleo Metálico.',
      D: 'Capa fértil, Capa rocosa y Capa de Fuego.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! El modelo dinámico o mecánico define el estado físico de los materiales: la **Litosfera** (capa rígida quebradiza), la **Astenosfera** (capa plástica parcialmente fundida), la **Mesosfera** (manto inferior rígido y denso por alta presión) y la **Endosfera** (núcleo interno sólido y externo líquido).',
    feedback_error: 'No confundas el modelo químico (corteza, manto, núcleo) con el modelo físico o mecánico. Este último evalúa la fluidez y rigidez, definiendo la Litosfera, Astenosfera, Mesosfera y la Endosfera.'
  },
  {
    id: 'q-fis-3-3-4',
    enunciado: '¿Por qué la **astenosfera** posee un comportamiento mecánico dúctil y plástico que permite a las placas tectónicas superiores deslizar de manera continua?',
    alternativas: {
      A: 'Porque está compuesta enteramente por agua de mar evaporada a alta presión.',
      B: 'Porque sus rocas de silicato están sometidas a condiciones de temperatura y presión tales que se encuentran en un estado cercano a su punto de fusión, comportándose como un sólido deformable o altamente viscoso (flujo plástico).',
      C: 'Porque el núcleo interno la enfría congelándola parcialmente.',
      D: 'Debido a la ausencia total de gravedad en esa región.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! En la astenosfera, la roca está sumamente caliente (casi fundida en un $1-2\\%$). No es un océano de lava líquida, sino roca de silicato sólida que, bajo inmensa presión de confinamiento y calor constante a lo largo de millones de años, adquiere un comportamiento plástico similar a la plastilina o brea caliente, permitiendo que la rígida litosfera se desplace sobre ella.',
    feedback_error: 'La astenosfera no es un líquido puro (como la lava). Es roca sólida pero plástica y deformable debido a las extremas presiones y temperaturas, permitiendo flujos lentos que actúan como lubricante geológico para las placas de arriba.'
  },
  {
    id: 'q-fis-3-3-5',
    enunciado: '¿Cuál de las siguientes capas mecánicas de la Geosfera se encuentra en un estado físico **líquido** y qué consecuencia planetaria fundamental produce este estado de la materia?',
    alternativas: {
      A: 'La Astenosfera; provoca la caída de meteoritos.',
      B: 'La Mesosfera; detiene el avance de los terremotos submarinos.',
      C: 'El Núcleo Externo (Endosfera externa); la convección de su hierro y níquel fundidos, combinada con la rotación terrestre, genera el campo magnético protector del planeta mediante el efecto dínamo.',
      D: 'El Núcleo Interno; origina las corrientes marinas superficiales.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Soberbio! El núcleo externo líquido es una sopa conductora metálica hirviente. Las celdas de convección térmica de metal líquido, sumadas a la rotación planetaria (efecto Coriolis), actúan como un dinamo autoexcitado que genera corrientes eléctricas y un potente campo geomagnético dipolar. Este escudo (Magnetosfera) desvía el dañino viento solar y permite la vida.',
    feedback_error: 'La única capa del interior terrestre que es puramente líquida es el núcleo externo. Su naturaleza metálica conductora de hierro y níquel en movimiento genera el escudo magnético del planeta. El núcleo interno, en cambio, es sólido debido a las presiones extremas.'
  },
  {
    id: 'q-fis-3-3-6',
    enunciado: 'A pesar de tener temperaturas que superan los $5000^\\circ\\text{C}$ (más calientes que la superficie del Sol), ¿por qué el **núcleo interno** de la Tierra se encuentra en un estado físico estrictamente **sólido**?',
    alternativas: {
      A: 'Debido a la inmensa presión de confinamiento hidrostática y litostática del peso de todo el planeta encima, la cual fuerza a los átomos de hierro a empaquetarse de forma compacta e impide físicamente que se fundan o liquen.',
      B: 'Porque está compuesto de hielo cósmico que resiste el calor.',
      C: 'Porque la rotación terrestre disipa todo el calor del centro por los polos.',
      D: 'Porque no posee masa inercial asociada.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente física! La temperatura de fusión de los metales aumenta drásticamente con la presión. En el centro exacto de la Tierra, la presión alcanza valores descomunales de $\\approx 3,6 \\text{ millones de atmósferas}$. A esta presión extrema, la energía de vibración térmica es incapaz de romper los enlaces cristalinos metálicos del hierro y níquel, forzándolos a permanecer en estado sólido.',
    feedback_error: 'La presión del interior terrestre aumenta de forma exponencial con la profundidad. En el núcleo interno la presión es tan abismal que compacta los átomos metálicos con tal fuerza que imposibilita la licuefacción, a pesar del calor extremo.'
  },
  {
    id: 'q-fis-3-3-7',
    enunciado: '¿Cuál es el nombre de la **discontinuidad sismológica** que define el límite físico-químico entre la Corteza terrestre y el Manto superior, caracterizada por un aumento brusco de la velocidad de las ondas sísmicas?',
    alternativas: {
      A: 'Discontinuidad de Gutenberg.',
      B: 'Discontinuidad de Mohorovičić (o simplemente Moho).',
      C: 'Discontinuidad de Lehmann.',
      D: 'Discontinuidad de Conrad.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Descubierta en 1909 por el sismólogo croata Andrija Mohorovičić, esta discontinuidad marca el paso de las rocas corticales (menos densas) a las rocas del manto superior ricas en peridotita (muy densas), acelerando de forma repentina las ondas P y S.',
    feedback_error: 'La frontera que separa la corteza superficial del manto se abrevia como "Moho". El nombre científico es discontinuidad de Mohorovičić.'
  },
  {
    id: 'q-fis-3-3-8',
    enunciado: 'La discontinuidad de **Gutenberg** es una frontera sismológica fundamental situada a unos $2900 \\text{ km}$ de profundidad. ¿Qué capas internas de la Geosfera delimita?',
    alternativas: {
      A: 'La Corteza del Manto superior.',
      B: 'El Manto inferior (Mesosfera) del Núcleo externo líquido (Endosfera externa).',
      C: 'El Núcleo externo líquido del Núcleo interno sólido.',
      D: 'La Litosfera de la Astenosfera plástica.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La discontinuidad de Gutenberg (descubierta en 1914) define la transición químico-física más violenta del planeta: el paso del manto rocoso de silicatos de hierro y magnesio al núcleo metálico líquido de hierro y níquel. En este límite, la velocidad de la onda P cae bruscamente y las ondas S desaparecen.',
    feedback_error: 'Gutenberg marca la base del manto rocoso e inicio del núcleo metálico líquido. Es la frontera situada a 2900 km donde se origina la zona de sombra sísmica.'
  },
  {
    id: 'q-fis-3-3-9',
    enunciado: 'El **Ciclo de las Rocas** describe la continua transformación de los materiales de la corteza. ¿Cómo se clasifica físicamente una roca que se ha formado mediante la solidificación y cristalización del magma fundido?',
    alternativas: {
      A: 'Roca Sedimentaria.',
      B: 'Roca Metamórfica.',
      C: 'Roca Ígnea o Magmática.',
      D: 'Roca Orgánica fósil.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! Las rocas ígneas provienen del enfriamiento y consolidación del magma (o lava en superficie). Si enfrían lentamente bajo la corteza son plutónicas/intrusivas (como el granito, con grandes cristales); si enfrían rápido en superficie tras una erupción son volcánicas/extrusivas (como el basalto o la obsidiana).',
    feedback_error: 'La palabra *ígnea* proviene del latín **ignis** que significa fuego. Las rocas nacidas del enfriamiento de roca fundida ardiente (magma) se denominan ígneas.'
  },
  {
    id: 'q-fis-3-3-10',
    enunciado: '¿Cuál de los siguientes procesos geológicos es el responsable exclusivo de la formación de las **rocas sedimentarias** en la corteza terrestre?',
    alternativas: {
      A: 'La fusión completa de arenisca en una cámara de magma activa.',
      B: 'La alteración mineral por presión extrema sin fundir.',
      C: 'La meteorización, erosión, transporte de sedimentos en cuencas lacustres o marinas, seguido de la acumulación, compactación y cementación química a lo largo del tiempo (diagénesis).',
      D: 'La desintegración atómica de elementos radiactivos corticales.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! Las rocas sedimentarias se forman en la superficie mediante la meteorización (desgaste) de rocas preexistentes. El agua, viento o hielo transportan estos fragmentos (sedimentos) a cuencas de acumulación. El peso de las capas superiores compacta los sedimentos, y los minerales disueltos en el agua actúan como cemento natural endureciéndolos.',
    feedback_error: 'Las rocas sedimentarias provienen de sedimentos (fragmentos sueltos, arena, lodo). Estos restos se apilan en capas (estratos), se comprimen por gravedad y se cementan con el paso del tiempo.'
  },
  {
    id: 'q-fis-3-3-11',
    enunciado: 'Las **rocas metamórficas** (como el mármol o la pizarra) representan un estado de transformación avanzado de rocas previas. ¿Bajo qué condiciones físicas se originan estas rocas?',
    alternativas: {
      A: 'Por el enfriamiento instantáneo del basalto en aguas abisales frías.',
      B: 'Por la alteración química y estructural de una roca preexistente sometida a condiciones de altas temperaturas y presiones extremas en el interior de la corteza, pero sin llegar a fundirse.',
      C: 'Por la cementación orgánica de conchas y restos de corales en el mar.',
      D: 'Únicamente debido al impacto violento de meteoritos ferrosos.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Metamorfismo significa cambio de forma. Ocurre cuando una roca sedimentaria o ígnea es enterrada profundamente o calentada por una intrusión magmática cercana. La alta presión y calor reorganizan la estructura cristalina de los minerales en estado sólido. Si la roca llega a fundirse, deja de ser metamórfica y pasa a ser magma (origen ígneo).',
    feedback_error: 'Las metamórficas sufren cambios físicos en estado sólido. Deben experimentar calor y presión intensos para recristalizar sus minerales, pero la temperatura no debe ser lo bastante alta como para derretir la roca por completo.'
  },
  {
    id: 'q-fis-3-3-12',
    enunciado: 'Un paleontólogo busca restos fosilizados de dinosaurios para estudiar la evolución biológica del mesozoico. ¿En qué tipo de roca del ciclo geológico es prácticamente seguro que se encontrarán estos fósiles?',
    alternativas: {
      A: 'En rocas ígneas plutónicas como el granito, ya que son muy estables.',
      B: 'En rocas sedimentarias (como la lutita o la caliza), ya que se forman por acumulación suave de partículas y entierro de organismos, preservando sus estructuras sin fundirlos ni triturarlos.',
      C: 'En rocas metamórficas foliadas de alta presión como el gneis.',
      D: 'En coladas de lava basáltica cristalizada rápidamente.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Muy bien! Los fósiles requieren un entierro rápido y protector en sedimentos finos (arcilla, arena) antes de que el oxígeno los desintegre. Las rocas sedimentarias son las únicas que preservan fósiles. Las ígneas implican magma ardiente que desintegraría el organismo, y el metamorfismo deforma y tritura físicamente cualquier rastro biológico.',
    feedback_error: 'Los restos óseos o huellas no sobreviven a la lava fundida (roca ígnea) ni al aplastamiento elástico cortical (roca metamórfica). El único ambiente de preservación fósil viable es el depósito suave de capas de sedimentos.'
  },
  {
    id: 'q-fis-3-3-13',
    enunciado: 'Al estudiar el suelo terrestre, notamos que se divide en capas horizontales con diferentes propiedades de fertilidad denominadas **horizontes**. ¿Qué horizonte se caracteriza por concentrar la mayor cantidad de materia orgánica descompuesta (humus) y alta fertilidad agrícola?',
    alternativas: {
      A: 'Horizonte C (roca madre meteorizada).',
      B: 'Horizonte B (zona de acumulación de arcillas lavadas).',
      C: 'Horizonte A y O (capas orgánicas y suelo superficial fértil ricos en nutrientes).',
      D: 'Horizonte D (lecho rocoso consolidado inmutable).'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Perfecto! Los horizontes superficiales (O orgánico y A superficial) contienen hojas en descomposición, microorganismos, humus y minerales disueltos. Es la capa de máxima actividad biológica y donde las plantas absorben sus nutrientes vitales.',
    feedback_error: 'El suelo fértil es de color oscuro por los restos orgánicos descompuestos. Este material rico en nutrientes agrícolas se asienta en la superficie, que corresponde al horizonte O y A.'
  },
  {
    id: 'q-fis-3-3-14',
    enunciado: '¿Cuál es la diferencia física clave entre los procesos geológicos de **meteorización física (o mecánica)** y **meteorización química** de las rocas superficiales?',
    alternativas: {
      A: 'La física disuelve las rocas con ácidos y la química las tritura con terremotos.',
      B: 'La meteorización física rompe la roca en fragmentos más pequeños por fuerzas mecánicas (ej. congelación del agua en grietas) sin alterar la composición mineral; la meteorización química altera internamente la estructura química de los minerales transformándolos en compuestos nuevos (ej. oxidación del hierro por oxígeno).',
      C: 'La física solo ocurre bajo el agua de mar profunda y la química en la atmósfera superior.',
      D: 'No hay diferencias, ambos términos describen la erosión por vientos costeros.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! La meteorización mecánica desintegra la roca físicamente (aumentando la superficie expuesta, como cuando el agua entra en las grietas, se congela y actúa como cuña separando la roca). La meteorización química descompone la roca alterando su química (el agua reacciona con feldespatos transformándolos en arcillas blandas, debilitando la estructura rocosa).',
    feedback_error: 'Asocia mecánica con rotura física (el mineral sigue siendo el mismo, pero fragmentado). Asocia química con reacción molecular (el agua o aire reaccionan químicamente alterando la mineralogía del mineral de la roca).'
  },
  {
    id: 'q-fis-3-3-15',
    enunciado: 'Cuando medimos la temperatura a medida que perforamos un pozo profundo en la corteza continental terrestre, notamos que sube constantemente a una tasa promedio de $\\approx 25^\\circ\\text{C a } 30^\\circ\\text{C por kilómetro}$. ¿Cómo se denomina formalmente esta propiedad termodinámica de la Tierra?',
    alternativas: {
      A: 'Gradiente de Convección Litosférica.',
      B: 'Gradiente Geotérmico.',
      C: 'Coeficiente de conductividad radiactiva.',
      D: 'Constante de Hubble terrestre.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! El gradiente geotérmico mide el ritmo con el que asciende la temperatura interna a medida que descendemos hacia el núcleo. En la corteza, este ritmo promedio es de unos $3^\\circ\\text{C}$ cada $100 \\text{ metros}$ ($25-30^\\circ\\text{C/km}$), aunque en zonas con vulcanismo activo este gradiente es muchísimo más empinado.',
    feedback_error: 'La palabra *geotérmico* vincula Tierra y calor. La tasa matemática que expresa el aumento de calor terrestre con la profundidad es el gradiente geotérmico.'
  },
  {
    id: 'q-fis-3-3-16',
    enunciado: '¿Cuál es la diferencia científica formal entre los conceptos geológicos de **Mineral** y **Roca**?',
    alternativas: {
      A: 'Los minerales son siempre artificiales y las rocas naturales.',
      B: 'Los minerales son compuestos sólidos homogéneos de origen natural con estructura cristalina interna ordenada y composición química definida; las rocas son agregados sólidos y cohesivos compuestos por la unión de uno o varios tipos de minerales en proporciones variables.',
      C: 'Las rocas contienen fósiles metálicos y los minerales solo carbono gaseoso.',
      D: 'Son términos equivalentes aplicados a distintas escalas métricas.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Perfecto! Un mineral es una sustancia pura (ej. cuarzo, feldespato, mica). Una roca es una mezcla sólida natural constituida por la unión física de estos minerales (ej. el granito es una roca ígnea compuesta por agregados de cuarzo, feldespato y mica).',
    feedback_error: 'El mineral es el componente básico puro con estructura química ordenada. La roca es el "edificio" o agregado sólido construido físicamente mediante la agrupación de estos minerales.'
  },
  {
    id: 'q-fis-3-3-17',
    enunciado: 'Si analizamos el interior de la Tierra de forma global, ¿cómo se distribuyen físicamente la **densidad** y la **presión** en función de la profundidad?',
    alternativas: {
      A: 'Ambas variables son constantes en todas las capas.',
      B: 'La densidad y la presión aumentan progresivamente con la profundidad, alcanzando sus valores máximos absolutos en el centro del núcleo interno.',
      C: 'La presión aumenta pero la densidad cae a cero en el núcleo por ser metálico.',
      D: 'La densidad es máxima en la corteza continental por contener montañas pesadas.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Excelente! Debido a la autogravedad del planeta, las capas más pesadas y densas (metales) se hundieron hacia el centro durante la diferenciación planetaria temprana, quedando las más ligeras (silicatos) arriba. Además, la columna de roca superior ejerce una presión acumulativa que compacta los materiales del fondo, elevando al máximo la presión y densidad en el centro de la Geosfera.',
    feedback_error: 'La gravedad terrestre ordena las capas: lo más pesado y comprimido se ubica en el centro. Por ende, la densidad de la roca y la presión física de confinamiento se elevan continuamente a medida que bajas hacia el núcleo interno.'
  },
  {
    id: 'q-fis-3-3-18',
    enunciado: '¿Cuál es la discontinuidad que separa el núcleo externo líquido del núcleo interno sólido?',
    alternativas: {
      A: 'Discontinuidad de Mohorovičić.',
      B: 'Discontinuidad de Gutenberg.',
      C: 'Discontinuidad de Lehmann.',
      D: 'Discontinuidad de Conrad.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente geofísica! Descubierta en 1936 por la sismóloga danesa Inge Lehmann, esta discontinuidad a unos $5150 \\text{ km}$ de profundidad marca la transición donde las ondas P experimentan un aumento de velocidad debido a que el núcleo pasa de líquido a una fase sólida rígida por las presiones descomunales.',
    feedback_error: 'Busca a la pionera sismóloga danesa que descubrió el núcleo interno sólido de la Tierra. El límite entre el metal líquido y el sólido central lleva su nombre: discontinuidad de Lehmann.'
  },
  {
    id: 'q-fis-3-3-19',
    enunciado: 'Al ocurrir el enfriamiento de las rocas ígneas ricas en hierro (como el basalto) por debajo de cierta temperatura crítica, sus cristales minerales graban para siempre la dirección del campo magnético terrestre del momento. ¿Cómo se denomina geofísicamente esta propiedad crítica de temperatura?',
    alternativas: {
      A: 'Punto de Fusión Basáltico.',
      B: 'Punto de ebullición convectivo.',
      C: 'Temperatura o Punto de Curie.',
      D: 'Límite elástico de Hooke.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! El Punto de Curie es la temperatura por encima de la cual ciertos materiales pierden sus propiedades magnéticas. Al enfriarse y descender del Punto de Curie ($\\approx 580^\\circ\\text{C}$ para la magnetita), los dominios magnéticos se congelan y orientan según el campo geomagnético de ese instante, permitiendo los estudios de paleomagnetismo.',
    feedback_error: 'El campo magnético terrestre se graba en los cristales de hierro volcánicos cuando estos se enfrían bajo un umbral de temperatura crítico llamado Punto de Curie.'
  },
  {
    id: 'q-fis-3-3-20',
    enunciado: 'La magnetosfera terrestre desvía la mayor parte de las partículas cargadas del viento solar. ¿En qué mecanismo y capa interna del planeta se origina el escudo geomagnético que sustenta la vida?',
    alternativas: {
      A: 'En el magnetismo estático del granito de la corteza continental.',
      B: 'En el efecto dínamo del núcleo externo, provocado por la rotación planetaria y las celdas de convección térmica de su metal conductor líquido de hierro y níquel.',
      C: 'En la tracción elástica de los glaciares en la litosfera polar.',
      D: 'En el vulcanismo explosivo del Cinturón de Fuego del Pacífico.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Soberbio! El núcleo externo líquido conductor de electricidad se mueve por convección térmica y rotación de Coriolis. Esto constituye un dinamo autoexcitado que induce corrientes eléctricas, generando el inmenso dipolo magnético de la Tierra que se proyecta al espacio y nos protege de la radiación ionizante solar.',
    feedback_error: 'El campo magnético del planeta requiere metales conductores fluidos y en rotación constante. Este dinamo natural se aloja y opera en el núcleo externo de metal líquido de la Geosfera.'
  }
);

// -------------------------------------------------------------
// ENSAMBLADO DE LAS SECCIONES CON SUS RESPECTIVAS 20 PREGUNTAS
// -------------------------------------------------------------
poolPreguntas.push(...preguntasRestantes = []); // Prevenir cualquier error por variable no definida si el pipeline lo requiere

dataSeccionesTeoria.forEach((sec, idx) => {
  // Extraemos las 20 preguntas de la sección correspondiente
  const startIdx = idx * 20;
  const preguntasSeccion = poolPreguntas.slice(startIdx, startIdx + 20);

  if (preguntasSeccion.length < 20) {
    console.warn(`Alerta: Sección ${sec.id} tiene menos de 20 preguntas! actual: ${preguntasSeccion.length}`);
  }

  capEnergiaTierra.secciones.push({
    id: sec.id,
    capituloId: 'cap-fisica-3-energia-tierra',
    materiaId: 'ciencias-fisica',
    title: sec.title,
    introduccion: sec.introduccion,
    datos_claves: sec.datos_claves,
    order: idx + 1,
    testId: `test-fis-3-${idx + 1}`,
    test: {
      id: `test-fis-3-${idx + 1}`,
      seccionId: sec.id,
      preguntas: preguntasSeccion
    }
  });
});

// Escribimos el JSON final en el directorio de scratch del proyecto
const scratchPath = path.resolve(__dirname, 'fisica-cap3-mockup.json');
fs.writeFileSync(scratchPath, JSON.stringify([capEnergiaTierra], null, 2), 'utf8');

console.log('🎉 Mockup de Física del Capítulo 3 (Energía - Tierra) generado exitosamente en scratch del proyecto!');
console.log('Path absoluto del archivo generado:', scratchPath);
console.log('Cantidad de pasos/secciones:', capEnergiaTierra.secciones.length);
console.log('Total de preguntas generadas:', capEnergiaTierra.secciones.reduce((acc, s) => acc + s.test.preguntas.length, 0));
