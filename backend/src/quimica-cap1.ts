export const cap1 = {
  id: 'cap-qui-1',
  materiaId: 'ciencias-quimica',
  title: 'Estructura Atómica y Clasificación de la Materia',
  introduccion: 'Explora desde qué está hecha la materia hasta cómo se estructuran los átomos. Este capítulo es la base de toda la química.',
  order: 1,
  imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988588/quimica/cap1/cap1_new.webp',
  secciones: [
    {
      id: 'sec-qui-1-1',
      title: '1. Sustancias Puras: Elementos y Compuestos',
      introduccion: `Aprenderás a clasificar la materia en sustancias puras y mezclas, diferenciando entre elementos indivisibles y compuestos químicos.`,
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La química es el estudio de la materia y sus transformaciones. Toda la materia del universo se clasifica principalmente en **sustancias puras** y **mezclas**.

Una **sustancia pura** tiene una composición química fija, definida y propiedades constantes (como punto de ebullición y densidad). Se dividen en:

**1. Elementos:**
Sustancias formadas por un único tipo de átomos. No pueden descomponerse en sustancias más simples mediante reacciones químicas ordinarias. En la naturaleza, algunos elementos existen como átomos aislados (ej. Helio, $He$) y otros como moléculas diatómicas (ej. Oxígeno, $O_2$).

**2. Compuestos:**
Están formados por la unión química de dos o más elementos diferentes en **proporciones numéricas fijas y constantes** (Ley de Proust). 
Por ejemplo, el agua ($H_2O$) siempre tiene 2 átomos de H por 1 de O. Si la proporción cambia a $H_2O_2$, ya no es agua, sino peróxido de hidrógeno (agua oxigenada).
A diferencia de los elementos, los compuestos **sí pueden descomponerse** en sustancias más simples, pero única y exclusivamente mediante **métodos químicos** (como la electrólisis o la pirólisis).

**Propiedades emergentes:**
Una característica vital de los compuestos es que **pierden por completo las propiedades originales de sus elementos formadores**. 
Ejemplo clásico: El Sodio ($Na$) es un metal altamente reactivo y explosivo en agua. El Cloro ($Cl_2$) es un gas venenoso verde. Al unirse químicamente forman Cloruro de Sodio ($NaCl$), que es la sal de mesa común, inofensiva y esencial para la vida.\n\n---\n\n**Problema Práctico:** Tienes tres recipientes. El recipiente A contiene agua destilada ($H_2O$). El recipiente B contiene una lámina de cobre ($Cu$). El recipiente C contiene agua mezclada con sal disuelta.<br>
*Pregunta:* ¿Cómo clasificamos cada uno estrictamente según la química y por qué?<br><br>
**Análisis y Solución:**<br>
1. **Recipiente A ($H_2O$):** Está formado por dos elementos químicos distintos unidos en proporción fija. Por lo tanto, es un **Compuesto** (Sustancia pura).<br>
2. **Recipiente B ($Cu$):** Formado por un único tipo de átomo (Cobre). Es un **Elemento** (Sustancia pura).<br>
3. **Recipiente C (Agua + Sal):** Dos compuestos conviven en el mismo espacio sin nuevos enlaces. Por ende, es una **Mezcla**.`,
      order: 1,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988589/quimica/cap1/sec-1-1.jpg',
      datos_claves: [
        'Los elementos están formados por un solo tipo de átomos (ej. O2, Fe, S8).',
        'Los compuestos se pueden descomponer en elementos SOLO mediante métodos químicos.',
        'En un compuesto, la proporción de elementos es constante y definida (Ley de Proust).',
        'Las propiedades de un compuesto son completamente distintas a las de sus elementos originarios.'
      ],
      test: {
        id: 'test-qui-1-1',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Para dominar la química, primero debes ser capaz de identificar los componentes básicos de la materia.',
        preguntas: [
          {
            id: 'q-1-1-1',
            enunciado: 'Observa la siguiente tabla que describe las características de 4 materiales distintos. ¿Cuál de ellos corresponde a las características clásicas de un **compuesto químico**?',
            formula_latex: '\\begin{array}{|c|c|c|}\\hline \\text{Material} & \\text{¿Composición Fija?} & \\text{¿Separable por método físico?} \\\\ \\hline W & \\text{Sí} & \\text{No} \\\\ X & \\text{No} & \\text{Sí} \\\\ Y & \\text{Sí} & \\text{Sí} \\\\ Z & \\text{No} & \\text{No} \\\\ \\hline \\end{array}',
            alternativas: { A: 'Material W', B: 'Material X', C: 'Material Y', D: 'Material Z' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Correcto! Los compuestos tienen composición fija y no se pueden separar por métodos físicos (solo químicos).',
            feedback_error: 'Recuerda que un compuesto es una sustancia pura (composición fija) y sus enlaces químicos no se pueden romper con métodos físicos (como filtración o ebullición).'
          },
          {
            id: 'q-1-1-2',
            enunciado: 'Se hace reaccionar completamente $10\\text{ g}$ de Hidrógeno ($H_2$) gaseoso con $80\\text{ g}$ de Oxígeno ($O_2$) gaseoso, obteniendo $90\\text{ g}$ de agua líquida ($H_2O$). Respecto a las propiedades químicas de la sustancia obtenida, es correcto afirmar que:',
            alternativas: { A: 'El agua es un gas inflamable porque el Hidrógeno original lo es.', B: 'El agua mantiene las propiedades del Oxígeno que la formó.', C: 'Las propiedades del agua son completamente distintas e independientes de las propiedades del Hidrógeno y Oxígeno puros.', D: 'El agua es una mezcla líquida de gases en proporción 1:8.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Un principio fundamental de los compuestos es que sus propiedades son completamente nuevas y distintas a las de sus elementos reactantes.',
            feedback_error: 'Un compuesto NUNCA mantiene las propiedades de los elementos que lo forman. Piensa en la sal (NaCl) que no es venenosa ni explosiva como el Cloro o el Sodio puros.'
          },
          {
            id: 'q-1-1-3',
            enunciado: 'La ecuación química general para la electrólisis del agua se representa como:',
            formula_latex: '2H_2O_{(l)} \\xrightarrow{\\text{energía eléctrica}} 2H_{2(g)} + O_{2(g)}',
            alternativas: { A: 'Demuestra que el agua es una mezcla que se separa con electricidad.', B: 'Demuestra que el agua es un compuesto químico que puede descomponerse en sus elementos mediante un proceso químico.', C: 'Demuestra que el Hidrógeno y el Oxígeno son compuestos.', D: 'Representa un simple cambio de estado (ebullición).' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! La electrólisis rompe enlaces químicos, lo que prueba que el agua es un compuesto y se descompone en elementos más simples.',
            feedback_error: 'Al usar energía eléctrica para romper la molécula de $H_2O$ en $H_2$ y $O_2$, se está efectuando una ruptura de enlaces químicos, comprobando que el agua es un compuesto.'
          },
          {
            id: 'q-1-1-4',
            enunciado: 'La alotropía es la propiedad de algunos elementos químicos de presentarse bajo estructuras moleculares diferentes. Un ejemplo son los alótropos del Oxígeno: el gas vital $O_2$ y el Ozono protector $O_3$. ¿Cómo se clasifican ambas sustancias químicas?',
            alternativas: { A: 'El $O_2$ es elemento y el $O_3$ es compuesto.', B: 'Ambas son mezclas homogéneas.', C: 'Ambas son elementos químicos.', D: 'El $O_2$ es compuesto diatómico y el $O_3$ es compuesto triatómico.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Como ambas sustancias están formadas **exclusivamente** por átomos del elemento Oxígeno, ambas son elementos.',
            feedback_error: 'Para que sea un compuesto, debe tener al menos dos TIPOS distintos de elementos. Aquí solo hay un tipo de átomo (Oxígeno), así que ambas formas son elementales.'
          },
          {
            id: 'q-1-1-5',
            enunciado: 'La Ley de las Proporciones Definidas (Proust) establece que un compuesto químico siempre contiene los mismos elementos en la misma proporción de masa. El peróxido de hidrógeno ($H_2O_2$) y el agua ($H_2O$) demuestran que:',
            alternativas: { A: 'Son el mismo compuesto porque tienen los mismos elementos.', B: 'Son mezclas de hidrógeno y oxígeno en distintas proporciones.', C: 'Al cambiar la proporción atómica (añadir un oxígeno más), se forma un compuesto totalmente distinto.', D: 'El hidrógeno puede variar su masa dentro de un mismo compuesto.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Si cambias la proporción de los elementos, cambias de compuesto. El $H_2O$ se bebe, el $H_2O_2$ te quema.',
            feedback_error: 'Las proporciones definen la identidad de un compuesto. Si las alteras, creas una sustancia químicamente distinta.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-2',
      title: '2. Mezclas Homogéneas y Heterogéneas',
      introduccion: `Descubrirás cómo diferenciar mezclas homogéneas y heterogéneas, prestando especial atención al efecto óptico de los coloides.`,
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Cuando dos o más sustancias se combinan **sin formar enlaces químicos**, obtenemos una **mezcla**. A diferencia de los compuestos, en las mezclas las sustancias mantienen su identidad química original y sus proporciones pueden variar (puedes preparar un café muy cargado o uno suave, sigue siendo café).

**Clasificación de las Mezclas según su uniformidad visual y el tamaño de sus partículas:**

**1. Disoluciones (Mezclas Homogéneas):**
- Presentan **una sola fase visible**.
- El tamaño de las partículas del soluto es extremadamente pequeño (menor a $1\\text{ nm}$, es decir, iones o moléculas pequeñas).
- Al ser tan pequeñas, no sedimentan jamás y la luz pasa a través de ellas sin desviarse (NO hay Efecto Tyndall).
- Ejemplos: Agua salada, aire, bronce (aleación de cobre y estaño).

**2. Coloides:**
- Parecen homogéneos a simple vista, pero sus partículas (fase dispersa) son más grandes que en una disolución (entre $1$ y $1000\\text{ nm}$).
- Debido a su tamaño, las partículas **dispersan los rayos de luz**, haciendo visible el haz de luz al atravesar el medio. Esto se llama **Efecto Tyndall**.
- Tampoco decantan (no se van al fondo).
- Ejemplos: Niebla, leche, gelatina, humo.

**3. Suspensiones:**
- Son mezclas claramente **heterogéneas** (dos o más fases visibles).
- Las partículas son macizas (mayores a $1000\\text{ nm}$).
- Debido a su gran peso, la gravedad hace que las partículas **sedimenten o decanten** al dejarse en reposo. Por esto los medicamentos en suspensión dicen "Agítese antes de usar".
- Ejemplos: Jugos naturales con pulpa, antibióticos infantiles en polvo, agua con tierra.\n\n---\n\n**Problema Práctico:** Preparas dos vasos. El Vaso 1 tiene agua con azúcar totalmente transparente. El Vaso 2 tiene leche. Al iluminar con láser, el rayo atraviesa invisible el Vaso 1, pero se hace un rayo brillante visible en el Vaso 2.<br><br>
**Análisis y Solución (Efecto Tyndall):**<br>
- **Vaso 1:** Partículas microscópicas no chocan con la luz. Líquido transparente. Es una **Disolución (Mezcla Homogénea)**.<br>
- **Vaso 2:** La luz rebota y se hace visible. Las partículas son más grandes aunque el líquido parezca homogéneo. Es un **Coloide**.`,
      order: 2,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988590/quimica/cap1/sec-1-2.png',
      datos_claves: [
        'Disolución: Partículas invisibles (<1nm). No sedimentan. No dispersan luz.',
        'Coloide: Partículas medianas (1-1000nm). No sedimentan. Dispersan luz (Efecto Tyndall).',
        'Suspensión: Partículas grandes (>1000nm). Sedimentan con el tiempo. Forman fases visibles.',
        'Aleaciones (bronce, acero, latón): Son disoluciones sólidas.'
      ],
      test: {
        id: 'test-qui-1-2',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Distinguir entre tipos de mezclas es vital. El tamaño de la partícula es el factor definitorio.',
        preguntas: [
          {
            id: 'q-1-2-1',
            enunciado: 'Un analista de laboratorio recibe tres mezclas (A, B y C) y realiza pruebas ópticas y de reposo. Registra sus resultados en la siguiente tabla:',
            formula_latex: '\\begin{array}{|c|c|c|}\\hline \\text{Mezcla} & \\text{¿Presenta Efecto Tyndall?} & \\text{¿Sedimenta al reposar?} \\\\ \\hline A & \\text{Sí} & \\text{No} \\\\ B & \\text{No} & \\text{No} \\\\ C & \\text{Sí} & \\text{Sí} \\\\ \\hline \\end{array}',
            alternativas: { A: 'A es suspensión, B es disolución, C es coloide.', B: 'A es disolución, B es coloide, C es suspensión.', C: 'A es coloide, B es disolución, C es suspensión.', D: 'A es coloide, B es suspensión, C es disolución.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! A es coloide (dispersa luz pero no sedimenta), B es disolución (ni dispersa ni sedimenta) y C es suspensión (sedimenta).',
            feedback_error: 'Revisa las propiedades. Las suspensiones son las únicas que sedimentan (C). Las disoluciones son totalmente transparentes a la luz (B). Los coloides dispersan luz pero no caen al fondo (A).'
          },
          {
            id: 'q-1-2-2',
            enunciado: 'Si preparamos una mezcla de agua pura con sacarosa (azúcar) en polvo y agitamos vigorosamente hasta que el sólido desaparezca por completo y el líquido se vea totalmente cristalino. Desde el punto de vista molecular, el tamaño de las partículas de soluto es aproximadamente:',
            alternativas: { A: 'Menor a $1\\text{ nm}$', B: 'Entre $1\\text{ y }1000\\text{ nm}$', C: 'Mayor a $1000\\text{ nm}$', D: 'Mayor a $10\\text{ cm}$' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Muy bien! Se formó una disolución verdadera, cuyas partículas son tan minúsculas que no pueden verse ni dispersan la luz.',
            feedback_error: 'Si se ve cristalino y homogéneo, es una disolución (mezcla homogénea). El tamaño de partículas en las disoluciones es microscópico, típicamente menor a 1 nanómetro.'
          },
          {
            id: 'q-1-2-3',
            enunciado: 'Una aleación como el latón se elabora fundiendo cobre y zinc. Al enfriarse, se observa un material metálico brillante y uniforme. El latón debe clasificarse formalmente como:',
            alternativas: { A: 'Un compuesto químico metálico.', B: 'Una disolución sólida.', C: 'Un coloide metálico.', D: 'Una emulsión homogénea.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Las aleaciones no son compuestos, ya que no hay enlaces químicos fijos entre los metales, sino una mezcla homogénea (disolución) en fase sólida.',
            feedback_error: 'Los metales en una aleación no reaccionan químicamente en proporciones definidas; se mezclan físicamente. Como se ven uniformes, son disoluciones sólidas.'
          },
          {
            id: 'q-1-2-4',
            enunciado: 'En la madrugada, cuando un automóvil enciende sus focos en una carretera con niebla gruesa, el haz de luz se vuelve completamente visible, trazando un cono iluminado. Este fenómeno óptico demuestra que la niebla es:',
            alternativas: { A: 'Un compuesto gaseoso que reacciona con los fotones.', B: 'Una disolución de gases que desvía la luz.', C: 'Una suspensión que sedimenta el agua líquida.', D: 'Un coloide (aerosol líquido) que exhibe el Efecto Tyndall.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Correcto! Las gotitas de agua suspendidas en el aire tienen el tamaño justo (1-1000 nm) para rebotar la luz, típico de un coloide.',
            feedback_error: 'Ese es el ejemplo perfecto del Efecto Tyndall, propiedad exclusiva de los sistemas coloidales, donde las partículas dispersan la luz.'
          },
          {
            id: 'q-1-2-5',
            enunciado: '¿Por qué las etiquetas de muchos jugos envasados o jarabes médicos indican expresamente "Agitar bien antes de consumir"?',
            alternativas: { A: 'Porque son coloides y requieren energía cinética para activar el efecto Tyndall.', B: 'Porque son disoluciones que necesitan calentamiento por fricción.', C: 'Porque son suspensiones y sus fases se separan por la gravedad durante el reposo.', D: 'Para romper los enlaces químicos del compuesto.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente deducción! Las partículas grandes de las suspensiones decantan al fondo. Al agitar, se vuelven a distribuir temporalmente.',
            feedback_error: 'La palabra clave es "sedimentación". Solo las suspensiones sufren la caída de sus partículas por gravedad, separándose en fases.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-3',
      title: '3. Separación de Mezclas: Métodos de Tamaño (Filtración y Tamizado)',
      introduccion: `Entenderás los principales métodos físicos utilizados en laboratorio e industria para separar mezclas en sus componentes originales.`,
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Los métodos de separación física permiten deshacer las mezclas aislando sus componentes sin romper enlaces ni provocar reacciones. Todo método físico explota una **diferencia en las propiedades físicas** de los componentes.

Los dos métodos más directos se basan en la **Diferencia de Tamaño de Partícula**:

**1. Tamizado:**
- **Tipo de mezcla:** Heterogénea de **Sólido-Sólido**.
- **Fundamento:** Diferencia considerable en el tamaño de las partículas sólidas.
- **Funcionamiento:** Se utiliza una malla, cedazo o tamiz. Las partículas con un diámetro menor al de los "poros" de la malla pasan a través, mientras que las partículas sólidas gruesas quedan retenidas.
- **Uso clásico:** Separar arena fina de rocas, o harina de impurezas al cocinar.

**2. Filtración:**
- **Tipo de mezcla:** Heterogénea de **Sólido insoluble-Líquido** (o gas).
- **Fundamento:** Diferencia de estado físico y tamaño (solubilidad nula).
- **Funcionamiento:** Se hace pasar la mezcla a través de un material poroso fino (como papel de filtro, algodón o filtros de carbón). El fluido (líquido o gas) atraviesa los poros minúsculos recogiéndose como **filtrado**, mientras que el sólido insoluble queda atrapado en el papel, llamándose **residuo**.
- **Importante:** Jamás intentes filtrar una disolución (como agua salada). En una disolución los iones están tan separados y son tan minúsculos que pasarán sin problemas a través del papel junto con el agua.\n\n---\n\n**Problema Práctico:** Un anillo de oro macizo y arena fina caen en un frasco de agua salada. ¿Cómo recuperar los tres puros?<br><br>
**Estrategia:**<br>
1. **Recuperar el Anillo (Sólido enorme):** **Tamizado**. La malla retiene el anillo y deja pasar lo demás.<br>
2. **Recuperar la Arena (Sólido insoluble):** **Filtración**. El papel retiene la arena y deja pasar el agua salada.<br>
3. **Recuperar el Agua (Líquido con sólido disuelto):** **Destilación Simple**. Calentamos, el agua pura hierve, se evapora y se condensa. La sal sólida queda en el fondo.`,
      order: 3,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988591/quimica/cap1/sec-1-3.avif',
      datos_claves: [
        'Propiedad clave de ambos: Tamaño de partícula.',
        'Tamizado = Solo para sólidos de distintos diámetros.',
        'Filtración = Sólido insoluble que "flota" o sedimenta en un líquido.',
        'Ningún método físico cambia la identidad química de las sustancias tratadas.'
      ],
      test: {
        id: 'test-qui-1-3',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Dominar qué método usar según el estado y tamaño de las sustancias es clave en preguntas aplicadas.',
        preguntas: [
          {
            id: 'q-1-3-1',
            enunciado: 'Un operario de minería requiere separar fragmentos de roca de $5\\text{ mm}$ de diámetro de un polvo de mineral aurífero cuyo diámetro es de $0.1\\text{ mm}$. El método más rápido y la propiedad aprovechada son, respectivamente:',
            alternativas: { A: 'Filtración y solubilidad.', B: 'Tamizado y tamaño de partícula.', C: 'Decantación y densidad.', D: 'Tamizado y reactividad química.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Al ser dos sólidos secos de distinto diámetro, se usa una malla (tamiz) que deje pasar solo al polvo.',
            feedback_error: 'Tienes dos sustancias SÓLIDAS. La filtración requiere un líquido. La propiedad clave que los diferencia aquí es el tamaño geométrico de sus trozos.'
          },
          {
            id: 'q-1-3-2',
            enunciado: 'En el laboratorio de química, un estudiante mezcla $10\\text{ g}$ de carbonato de calcio ($CaCO_3$, un polvo blanco **insoluble**) con $100\\text{ mL}$ de agua destilada, obteniendo una mezcla turbia. Para recuperar el polvo seco, decide pasar la mezcla por un embudo con papel de filtro fino. ¿Qué obtendrá en el papel (residuo) y qué pasará al vaso (filtrado)?',
            alternativas: { A: 'Residuo: Agua / Filtrado: Polvo.', B: 'Residuo: Nada / Filtrado: Mezcla turbia.', C: 'Residuo: Iones de Calcio / Filtrado: Agua con carbonato.', D: 'Residuo: Carbonato de calcio sólido / Filtrado: Agua destilada.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Muy bien! Como es insoluble, el polvo no puede atravesar los poros microscópicos del papel, pero las moléculas de agua sí.',
            feedback_error: 'Al ser insoluble, las partículas del polvo son más grandes que los poros del papel. El polvo queda retenido (residuo) y el agua limpia pasa.'
          },
          {
            id: 'q-1-3-3',
            enunciado: 'Se te entrega un matraz con una disolución azul intensa de Sulfato de Cobre disuelto completamente en agua. Si montas un aparato de filtración con el papel de poro más fino disponible y viertes la disolución, el resultado esperado será:',
            alternativas: { A: 'El papel de filtro se romperá por acción química.', B: 'El sulfato de cobre quedará azul en el papel y el agua caerá transparente.', C: 'Toda la disolución azul pasará a través del papel sin sufrir separación alguna.', D: 'Se separarán en cobre sólido en el papel y ácido sulfúrico en el líquido.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! Las disoluciones son mezclas a nivel iónico (tamaño < 1nm). Los iones atraviesan cualquier papel de filtro estándar con el agua.',
            feedback_error: '¡Trampa clásica! Las **mezclas homogéneas (disoluciones)** no se pueden separar por filtración. Sus partículas disueltas son demasiado pequeñas.'
          },
          {
            id: 'q-1-3-4',
            enunciado: 'El mecanismo de acción de la mascarilla N95 contra virus ambientales respiratorios, reteniendo gotas de saliva que contienen el patógeno mientras deja pasar las moléculas de aire ($O_2, N_2$), es un claro ejemplo cotidiano de:',
            alternativas: { A: 'Destilación fraccionada.', B: 'Decantación.', C: 'Filtración por tamaño.', D: 'Cromatografía de gases.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! La mascarilla actúa como un medio poroso que retiene partículas en aerosol (líquidas/sólidas) basadas en su diámetro geométrico.',
            feedback_error: 'Un material con orificios que deja pasar un fluido (aire) pero atrapa partículas (gotas de saliva) está ejerciendo filtración.'
          },
          {
            id: 'q-1-3-5',
            enunciado: 'En la purificación de agua de un río para consumo humano, el primer paso implica hacerla pasar a través de rejillas de acero con aberturas de $5\\text{ cm}$ para retirar botellas, ramas y plásticos. Desde un punto de vista estricto, este proceso de desbaste es conceptualmente idéntico a:',
            alternativas: { A: 'Una decantación de sólidos suspendidos.', B: 'Un tamizado a escala macroscópica.', C: 'Una filtración mecánica gruesa.', D: 'Una condensación de sólidos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Cuando se usa una malla o barrera para retener sólidos gruesos arrastrados por un fluido (agua), es un proceso de filtración.',
            feedback_error: 'Aunque sean rejillas gigantes de acero, el fluido empuja el líquido y la barrera retiene el sólido. Esto es el principio fundamental de la filtración.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-4',
      title: '4. Separación de Mezclas: Métodos Físico-Químicos (Decantación y Destilación)',
      introduccion: `Analizarás los cambios de estado (fusión, ebullición) como transformaciones físicas donde la estructura molecular permanece intacta.`,
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Cuando las partículas son del mismo tamaño o los componentes están completamente disueltos (disoluciones), la filtración no sirve. Debemos recurrir a métodos que explotan otras propiedades intensivas: la **Densidad** y el **Punto de Ebullición**.

**1. Decantación:**
- **Fundamento:** Diferencia de **Densidad** ($d = m/v$).
- **Uso 1:** Separar líquidos **inmiscibles** (que no se mezclan, como agua y aceite). Al dejarlos en reposo en un "Embudo de Decantación", el líquido de mayor densidad se ubica en el fondo. Se abre una llave para drenar solo el líquido pesado.
- **Uso 2:** Separar sólidos pesados (suspensiones) de un líquido. Se deja decantar (sedimentar) por gravedad y luego se vierte con cuidado el líquido superior.

**2. Destilación Simple y Fraccionada:**
- **Fundamento:** Diferencia en el **Punto de Ebullición** (temperatura a la cual la presión de vapor iguala a la presión atmosférica).
- **Uso:** Separar líquidos que **sí se mezclan** (miscibles) o aislar un disolvente purificado a partir de una solución salina.
- **Mecanismo:** La mezcla se calienta en un matraz. La sustancia con el **punto de ebullición más bajo** se vaporiza primero. Este vapor viaja hacia un condensador o tubo refrigerante, donde se enfría mediante agua helada que circula por fuera. El gas vuelve al estado líquido (**condensación**) y gotea puro en un recipiente colector.
- **Nota PAES:** Durante la destilación ocurren **dos cambios de estado consecutivos**: Evaporación y Condensación.\n\n---\n\n**Problema Práctico:** En destilación calientas tres líquidos: Octano ($125^\\circ\\text{C}$), Hexano ($68^\\circ\\text{C}$) y Heptano ($98^\\circ\\text{C}$). ¿En qué orden se evaporarán y recogerán?<br><br>
**Solución:**<br>
La destilación fraccionada separa por volatilidad. **Menor Punto de Ebullición = hierve primero.**<br>
El orden correcto de recolección al ir subiendo la temperatura desde $20^\\circ\\text{C}$ será: **Hexano $\\rightarrow$ Heptano $\\rightarrow$ Octano**.`,
      order: 4,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988592/quimica/cap1/sec-1-4.avif',
      datos_claves: [
        'Decantación: Diferencia de densidades. Útil en líquidos inmiscibles.',
        'Destilación: Diferencia de puntos de ebullición.',
        'El componente que destila (hierve) primero es el más VOLÁTIL (el de menor punto de ebullición).',
        'El petróleo se separa en gasolina, diésel y asfalto mediante Destilación Fraccionada.'
      ],
      test: {
        id: 'test-qui-1-4',
        materiaId: 'ciencias-quimica',
        contexto_base: 'El análisis de datos en tablas es fundamental en ciencias. Revisa cuidadosamente los valores termodinámicos.',
        preguntas: [
          {
            id: 'q-1-4-1',
            enunciado: 'Se tienen dos líquidos $A$ y $B$, que son completamente inmiscibles entre sí. Se introducen en un embudo de decantación. Conociendo que la densidad de $A$ es $1.3\\text{ g/mL}$ y la densidad de $B$ es $0.8\\text{ g/mL}$, ¿cuál será el orden correcto en el embudo y qué líquido saldrá primero al abrir la llave inferior?',
            alternativas: { A: 'B queda abajo y sale primero, A queda arriba flotando.', B: 'A queda abajo y sale primero, B queda arriba flotando.', C: 'Ambos salen mezclados homogéneamente.', D: 'No saldrá ninguno porque $A$ se solidificará.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! El de mayor densidad (A con $1.3$) "pesa" más y se va al fondo. Al estar en contacto con la llave inferior, drenará primero.',
            feedback_error: 'Mayor densidad = se va al fondo. El fondo está pegado a la llave de paso del embudo. Calcula cuál número es mayor.'
          },
          {
            id: 'q-1-4-2',
            enunciado: 'Observa la siguiente tabla de puntos de ebullición de diferentes alcoholes disueltos entre sí:',
            formula_latex: '\\begin{array}{|c|c|}\\hline \\text{Sustancia} & \\text{Punto de Ebullición (}^{\\circ}\\text{C)} \\\\ \\hline \\text{Metanol} & 64.7 \\\\ \\text{Etanol} & 78.4 \\\\ \\text{Propanol} & 97.2 \\\\ \\text{Butanol} & 117.7 \\\\ \\hline \\end{array}',
            alternativas: { A: 'El butanol será el primer destilado en recuperarse.', B: 'El etanol será recuperado antes que el metanol.', C: 'El metanol se evaporará y condensará primero.', D: 'Se requiere una centrifugación para separarlos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! El metanol tiene el punto de ebullición más bajo ($64.7^{\circ}\text{C}$), por lo que será el primero en vaporizarse al calentar la mezcla.',
            feedback_error: 'En una destilación, el primero en hervir es siempre el que requiere menos temperatura (el valor más bajo en la tabla).'
          },
          {
            id: 'q-1-4-3',
            enunciado: 'Para asegurar la condensación del vapor durante una destilación, el tubo refrigerante está envuelto por una camisa externa de vidrio por donde circula:',
            alternativas: { A: 'Aceite hirviendo para mantener la temperatura.', B: 'Agua fría para absorber el calor del vapor y licuarlo.', C: 'Gases nobles a alta presión.', D: 'El mismo vapor que está saliendo del matraz.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! El choque térmico del vapor caliente con el tubo enfriado por agua provoca que el gas pase a estado líquido inmediatamente.',
            feedback_error: 'El objetivo de esa parte del equipo es CONDENSAR (pasar de gas a líquido). Para ello se debe retirar el calor enfriando las paredes con agua constante.'
          },
          {
            id: 'q-1-4-4',
            enunciado: 'Ocurre un derrame de petróleo en el océano. A los pocos días, los equipos de limpieza notan que el petróleo flota sobre la superficie del agua del mar formado extensas manchas negras. De esta observación directa se infiere científicamente que:',
            alternativas: { A: 'El petróleo es miscible en agua y tiene un punto de ebullición altísimo.', B: 'El petróleo es inmiscible y su densidad es MENOR que la densidad del agua de mar.', C: 'El petróleo es inmiscible y su densidad es MAYOR que la densidad del agua de mar.', D: 'El agua de mar sufrió una decantación fraccionada.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Como no se disuelve, es inmiscible. Y como flota en la superficie, lógicamente es menos denso que el agua.',
            feedback_error: 'Si estuviese disuelto, no verías la mancha separada (sería miscible). Si fuera más denso que el agua, se hundiría hasta el fondo marino.'
          },
          {
            id: 'q-1-4-5',
            enunciado: 'Un naufrago en una isla desierta necesita agua dulce para beber. Solo dispone de agua de mar, una olla con tapa metálica, una taza y fuego. Decide hervir el agua salada en la olla, colocar la tapa metálica inclinada hacia la taza y recoger las gotas que escurren de la tapa. Científicamente, está improvisando:',
            alternativas: { A: 'Una filtración térmica por osmosis inversa.', B: 'Una destilación simple que aprovecha la evaporación del agua pura y su condensación en la tapa fría.', C: 'Una decantación de las sales marinas precipitadas.', D: 'Una cristalización del sodio y cloro atmosférico.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Hierve el agua, atrapa el vapor en la tapa, y este se condensa cayendo líquido puro en la taza.',
            feedback_error: 'Al hervir, el agua pasa a gas (dejando la sal atrás). Al chocar con la tapa, el gas se enfría y pasa a líquido. Evaporación + Condensación = Destilación.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-5',
      title: '5. Los Primeros Modelos Atómicos (Dalton y Thomson)',
      introduccion: `Explorarás el descubrimiento de la primera partícula subatómica: el electrón negativo, a través de los tubos de rayos catódicos.`,
      guia_titulo: '📖 Teoría y Análisis Histórico',
      guia_contenido: `Durante milenios, el átomo (del griego *a-tomos*: "sin división") fue un concepto puramente filosófico atribuido a Demócrito y Leucipo. Sin embargo, con el nacimiento de la ciencia empírica, comenzaron a formularse modelos basados en experimentos reales.

**1. John Dalton (1808) - Modelo de la Esfera Maciza:**
En pleno inicio de la revolución industrial, Dalton propuso la primera teoría atómica científica. 
- **Postulados centrales:** La materia está formada por esferas diminutas, sólidas, duras, indivisibles e indestructibles. 
- **Identidad elemental:** Todos los átomos del elemento oxígeno son esferas rojas idénticas; todos los de hidrógeno son esferas blancas idénticas.
- **Reacciones químicas:** Una reacción es simplemente el reordenamiento de estas esferas intactas para formar compuestos (proporciones fijas).

**2. J.J. Thomson (1897) - El "Budín de Pasas":**
Casi un siglo después, la tecnología permitió generar vacío en tubos de vidrio. Al aplicar electricidad, Thomson descubrió un rayo misterioso, los **Rayos Catódicos**.
Al acercar imanes y placas eléctricas al tubo, observó que el rayo era atraído por la placa positiva (+). Thomson concluyó genialmente que ese rayo estaba formado por partículas con **carga eléctrica negativa** y extremadamente livianas. Así descubrió la primera partícula subatómica: el **Electrón** ($e^-$).

- **El quiebre teórico:** ¡El átomo ya no era indivisible! Dalton estaba equivocado. El átomo escondía electrones en su interior.
- **El Modelo propuesto:** Como en general la materia es neutra, Thomson asumió que debía existir una gran masa positiva para contrarrestar. Imaginó el átomo como una gran "esfera de pudín o budín" de masa y carga positiva continua, con las pequeñas "pasas" negativas (los electrones) incrustadas estáticamente en su interior, cancelando las cargas.\n\n---\n\n**Problema Práctico:** Imagina el experimento de Thomson, pero colocas un polo **SUR (magnético)** que atrae cargas positivas cerca del rayo catódico. ¿Hacia dónde se mueve el rayo y qué prueba esto?<br><br>
**Análisis Físico:**<br>
El rayo catódico está compuesto por **electrones** que tienen carga eléctrica **NEGATIVA**. Como cargas opuestas se atraen y cargas iguales se repelen, el polo Sur (que atrae a las positivas) **repelerá** al rayo luminoso, desviándolo lejos del imán. Esto probó por primera vez que la materia contenía partículas negativas en su interior.`,
      order: 5,
      
      datos_claves: [
        'Dalton: Átomo como bola de billar sólida. Explicó la formación de compuestos.',
        'Tubo de Rayos Catódicos: Experimento crucial que delató la existencia del electrón.',
        'Thomson (Budín de Pasas): Esfera positiva masiva con electrones negativos estáticos incrustados.',
        'El descubrimiento de Thomson es el nacimiento de la "era subatómica" y eléctrica del átomo.'
      ],
      test: {
        id: 'test-qui-1-5',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Es fundamental conectar el experimento realizado con la partícula descubierta y el modelo propuesto.',
        preguntas: [
          {
            id: 'q-1-5-1',
            enunciado: 'En el histórico experimento de los Tubos de Rayos Catódicos, J.J. Thomson observó que el haz luminoso desviaba su trayectoria cuando se le acercaba una placa metálica cargada positivamente. ¿Cuál fue la deducción directa de este comportamiento electromagnético?',
            alternativas: { A: 'Que el núcleo del átomo concentraba gran carga positiva masiva.', B: 'Que los átomos son esferas macizas que rebotan magnéticamente.', C: 'Que los rayos estaban constituidos por un torrente de partículas de carga eléctrica negativa.', D: 'Que la luz tiene masa.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! En física, cargas opuestas se atraen. Si la placa (+) atrajo al rayo, el rayo debía tener carga negativa (-).',
            feedback_error: 'La ley de Coulomb dicta que cargas de distinto signo se atraen. Si el rayo se acercó a lo positivo, forzosamente debía ser negativo.'
          },
          {
            id: 'q-1-5-2',
            enunciado: 'Una de las premisas fundamentales que debió cumplir el Modelo Atómico de Thomson (Budín de Pasas) para tener coherencia con las leyes físicas del mundo cotidiano fue:',
            alternativas: { A: 'Asegurar que los electrones orbitaran a altas velocidades para no caer a la masa positiva.', B: 'Establecer que la cantidad de carga positiva de la esfera anulara exactamente la suma de las cargas negativas de los electrones incrustados.', C: 'Demostrar que el átomo estaba mayoritariamente hueco y vacío.', D: 'Explicar por qué los electrones emitían fotones de luz al saltar.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Thomson sabía que tocar una mesa no da la corriente, por lo tanto la materia es neutra. La masa (+) debía equilibrar a los electrones (-).',
            feedback_error: 'Las opciones A, C y D corresponden a los modelos atómicos posteriores (Rutherford y Bohr). Thomson imaginaba los electrones quietos (estáticos).'
          },
          {
            id: 'q-1-5-3',
            enunciado: 'Según la clásica teoría atómica propuesta por John Dalton a inicios del siglo XIX, si lográramos cortar un trozo de hierro puro indefinidamente, llegaríamos a la partícula más pequeña posible, la cual se caracterizaría por:',
            alternativas: { A: 'Tener electrones y protones en un núcleo diminuto.', B: 'Ser una esfera maciza, indestructible e imposible de dividir en nada más pequeño.', C: 'Convertirse en energía según la ecuación de Einstein.', D: 'Ser una esfera sólida solo de electrones negativos.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Esa era la visión más cruda de Dalton, similar a pequeñas balas de plomo o canicas impenetrables.',
            feedback_error: 'Para Dalton, el átomo era el final del camino: indivisible y macizo. No sabía nada sobre protones ni electrones.'
          },
          {
            id: 'q-1-5-4',
            enunciado: '¿Cuál es la relación principal entre los aportes de Demócrito en la antigua Grecia y el modelo de Dalton del siglo XIX?',
            alternativas: { A: 'Dalton experimentó empíricamente con los tubos de rayos catódicos que Demócrito había descrito.', B: 'Ambos consideraban que la materia es discontinua, y que existe un límite en su divisibilidad física al que llamaron átomo.', C: 'Demócrito descubrió matemáticamente la masa del átomo y Dalton la comprobó.', D: 'Eran fervientes opositores, ya que Dalton creía que la materia era un fluido continuo.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Dalton tomó la idea filosófica de Demócrito ("a-tomos", sin división) y le dio soporte científico basado en las masas de las reacciones químicas.',
            feedback_error: 'Ambos compartían el concepto de "límite indivisible". Demócrito fue filosofía, Dalton lo probó pesando reactantes y productos.'
          },
          {
            id: 'q-1-5-5',
            enunciado: 'Si analizamos el modelo de J.J. Thomson desde la perspectiva de la química actual, el principal acierto y el principal error del modelo fueron, respectivamente:',
            alternativas: { A: 'Acierto: Descubrir el neutrón / Error: Ignorar el electrón.', B: 'Acierto: Establecer la divisibilidad y el electrón / Error: Suponer que la carga positiva era una masa sólida continua y estática.', C: 'Acierto: Plantear un núcleo / Error: Decir que los electrones giraban.', D: 'Acierto: Ley de Proporciones Múltiples / Error: Modelo de budín.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Acertó descubriendo el electrón, pero erró completamente al pensar que la parte positiva era una gelatina gigante, en lugar de un núcleo microscópico.',
            feedback_error: 'Su aporte invaluable fue el electrón y romper la idea de que el átomo era indivisible. Falló al no concebir la idea de un núcleo rodeado de vacío.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-6',
      title: '6. La Revolución Cuántica (Rutherford y Bohr)',
      introduccion: `Comprenderás cómo los protones, neutrones y electrones se organizan matemáticamente y las órbitas de energía postuladas por Bohr.`,
      guia_titulo: '📖 Teoría y Modelo Cuántico',
      guia_contenido: `El modelo estático de Thomson no duró mucho. En 1911, Ernest Rutherford diseñó un experimento espectacular que cambiaría para siempre la física y la química.

**1. Ernest Rutherford - El Modelo Planetario y el Vacío:**
Bombardeó una finísima lámina de oro con un cañón que disparaba partículas "Alfa" ($\alpha^{2+}$), que son densas y de carga fuertemente positiva. 
- **La Sorpresa:** El 99.9% de las partículas Alfa atravesaron la lámina en línea recta (como si no hubiera nada). Algunas pocas se desviaron levemente, y un minúsculo porcentaje rebotó directamente hacia atrás (Rutherford dijo: *"Fue como disparar una bala de cañón a un papel y que rebotara hacia ti"*).
- **El Nuevo Modelo:** Si las balas de carga positiva pasaban de largo, significa que **el átomo es casi completamente espacio vacío**. Si rebotaban brutalmente al centro, significa que allí reside toda la masa y carga positiva del átomo, concentrada en un **Núcleo** microscópico y ultra denso. 
- Rutherford postuló que los electrones de Thomson giraban a altísimas velocidades lejos del núcleo (como planetas alrededor del sol).

**2. Niels Bohr (1913) - Órbitas Cuantizadas:**
El modelo de Rutherford rompía las leyes del electromagnetismo clásico: un electrón girando libremente debía irradiar su energía, perder velocidad y colapsar inevitablemente estrellándose contra el núcleo.
Bohr introdujo los revolucionarios conceptos cuánticos de Max Planck:
- Los electrones giran sin colapsar porque solo pueden moverse en **órbitas o niveles de energía estacionarios y discretos** ($n=1, n=2, n=3...$). Como si fuesen peldaños de una escalera, no se puede estar "entre" niveles.
- **Absorción:** Si un electrón absorbe energía térmica o eléctrica, pega un "salto cuántico" a una órbita superior alejada del núcleo (Estado excitado, inestable).
- **Emisión:** Rápidamente, el electrón cae de vuelta a su órbita original más baja (Estado fundamental). Al caer de mayor a menor energía, **la diferencia de energía se libera en forma de luz visible (fotón)**. ¡Este principio explica las luces de neón y los fuegos artificiales!\n\n---\n\n**Problema Práctico:** Un electrón en un átomo de Hidrógeno orbita en $n=1$. Se le dispara un láser, salta a $n=3$, y luego vuelve a caer a $n=1$.<br><br>
**Desglose del Fenómeno:**<br>
- **Salto $1 \\rightarrow 3$:** El electrón **ABSORBE** la energía del láser para vencer la atracción del núcleo y alejarse.<br>
- **Caída $3 \\rightarrow 1$:** Para volver a su estado fundamental de baja energía, debe deshacerse del exceso. Lo hace **EMITIENDO** un fotón de luz. Así se explican los colores de los fuegos artificiales y el espectro atómico.`,
      order: 6,
      
      datos_claves: [
        'Experimento Lámina de Oro (Rutherford) = Demostró el núcleo y el enorme espacio vacío del átomo.',
        'Bohr resolvió la paradoja de la inestabilidad de Rutherford mediante los Niveles Cuantizados (n).',
        'Salto hacia nivel superior (ej. n=1 a n=3): Absorbe energía.',
        'Caída a nivel inferior (ej. n=3 a n=1): Emite energía (luz, fotón, radiación electromagnética).'
      ],
      test: {
        id: 'test-qui-1-6',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La arquitectura moderna del átomo está definida por el núcleo compacto y el comportamiento cuántico de los electrones.',
        preguntas: [
          {
            id: 'q-1-6-1',
            enunciado: 'Durante el experimento de Rutherford, se observó que aproximadamente 1 de cada 20.000 partículas alfa ($+$) que incidían sobre la lámina de oro rebotaban violentamente hacia atrás. ¿A qué conclusión obligó este resultado numérico y físico?',
            alternativas: { A: 'A que los electrones eran inusualmente densos y magnéticos.', B: 'A que la carga positiva del átomo estaba diluida en forma de gelatina.', C: 'A que la carga positiva y el 99.9% de la masa del átomo estaban concentradas en un centro minúsculo (el núcleo) que repelió fuertemente a la partícula alfa.', D: 'A que la lámina de oro era una aleación y no un elemento puro.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Positivo con positivo se repelen (fuerza de Coulomb). El rebote violento demostró que al centro había una tremenda concentración de masa y carga positiva (el núcleo).',
            feedback_error: 'Si rebotan, chocaron contra algo extremadamente duro y del mismo signo (+). Ese rebote fue la evidencia directa del núcleo atómico.'
          },
          {
            id: 'q-1-6-2',
            enunciado: 'Una de las mayores innovaciones matemáticas de Bohr para justificar la estabilidad del electrón y evitar que este colapsara contra el núcleo atraído electrostáticamente, fue postular que:',
            alternativas: { A: 'El núcleo cambiaba su carga a negativa periódicamente.', B: 'Los electrones estaban incrustados fijamente en masa inerte.', C: 'La repulsión neutrónica empujaba a los electrones hacia afuera en órbitas aleatorias.', D: 'Los electrones poseían ciertos niveles de energía estacionarios y permitidos, en los cuales podían girar indefinidamente sin emitir radiación de frenado.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Exacto! El concepto de "cuantización de la energía". Al obligar a la naturaleza a seguir carriles fijos o escalones, salvó al átomo del colapso.',
            feedback_error: 'La gran solución de Bohr fue aplicar la mecánica cuántica incipiente: órbitas "cuantizadas" o "estacionarias" donde las leyes clásicas del electromagnetismo no generaban pérdida de energía.'
          },
          {
            id: 'q-1-6-3',
            enunciado: 'Un científico excita átomos de hidrógeno gaseoso usando chispas eléctricas de alto voltaje. En notación de Bohr, observa la transición de un electrón desde la órbita $n=5$ cayendo de golpe a la órbita $n=2$. En el instante de la caída, el átomo:',
            alternativas: { A: 'Absorbe tres niveles de fotones térmicos.', B: 'Emite una onda de energía electromagnética cuantizada (fotón).', C: 'Pierde tres electrones, formando el ión Tritio.', D: 'Destruye su núcleo por conservación de energía gravitatoria.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente interpretación cuántica! El salto de mayor nivel (5) a menor nivel (2) libera el exceso energético como luz.',
            feedback_error: 'Recuerda: Subir de escalón = absorber energía. Bajar de escalón = liberar (emitir) energía en forma de luz radiante.'
          },
          {
            id: 'q-1-6-4',
            enunciado: 'Considera la siguiente tabla que describe el comportamiento espectral de un átomo imaginario en base a los postulados de Bohr:',
            formula_latex: '\\begin{array}{|c|c|}\\hline \\text{Transición (Salto)} & \\text{Efecto Energético} \\\\ \\hline n=1 \\rightarrow n=3 & X \\\\ n=4 \\rightarrow n=2 & Y \\\\ \\hline \\end{array}',
            alternativas: { A: 'X = Absorción de fotón, Y = Emisión de fotón', B: 'X = Emisión de calor, Y = Absorción de luz ultravioleta', C: 'X = Emisión de luz roja, Y = Absorción de luz azul', D: 'Ambos procesos representan emisión debido a la conservación de energía' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Perfecto! De 1 a 3 (sube), debe ganar energía (absorbe). De 4 a 2 (baja), debe botar energía (emite).',
            feedback_error: 'Analiza el cambio: pasar de un nivel bajo (1) a uno alto (3) es como subir un cerro, requieres meterle energía al sistema. Bajar libera esa energía.'
          },
          {
            id: 'q-1-6-5',
            enunciado: 'Al observar los hermosos colores emitidos por la pirotecnia y los fuegos artificiales, un estudiante con conocimientos de química moderna puede justificar el fenómeno afirmando que:',
            alternativas: { A: 'Los protones de la pólvora se están evaporando al contacto con el aire atmosférico.', B: 'El calor de la explosión excita a los electrones, y cuando estos retornan simultáneamente a su estado basal, emiten la energía en forma de fotones de distintos colores.', C: 'La pólvora contiene pigmentos artificiales inorgánicos que al romperse coloidalmente dispersan la luz (efecto Tyndall) en colores.', D: 'La pólvora negra y las sales metálicas se destilan fraccionadamente en el aire.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Maravillosa aplicación! Todos los colores de las luces de neón o pirotecnia son espectros de emisión debido a electrones "cayendo" en el modelo de Bohr.',
            feedback_error: 'La emisión de luz (fotones) es consecuencia directa del regreso de los electrones desde sus estados cuánticos excitados (alta energía provista por el fuego) hacia sus órbitas más estables.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-1-7',
      title: '7. Partículas Subatómicas: Cálculos y Notación Nuclear',
      introduccion: `Aprenderás a calcular la composición exacta del núcleo y los electrones en átomos neutros e iones mediante los números Z y A.`,
      guia_titulo: '📖 Teoría y Cálculo de Iones',
      guia_contenido: `El átomo moderno queda definido por tres partículas fundamentales, ubicadas estructuralmente gracias a los trabajos de Rutherford y el descubrimiento del **neutrón** por Chadwick (1932).

**1. Las Partículas Fundamentales:**
- **Protones ($p^+$):** Tienen carga eléctrica $+1$ y gran masa relativa ($1\\text{ u}$). Viven encerrados fuertemente en el núcleo.
- **Neutrones ($n^0$):** Tienen carga $0$ (neutros) y una masa casi idéntica a la del protón ($1\\text{ u}$). Son el "cemento" del núcleo, evitando que los protones se repelan mutuamente.
- **Electrones ($e^-$):** Tienen carga eléctrica $-1$ y una masa despreciable ($1/1836$ veces la masa del protón). Giran en la inmensidad del vacío atómico en los niveles cuantizados de Bohr.

**2. El Documento de Identidad del Átomo:**
- **Número Atómico ($Z$):** Es sagrado e inmutable. Representa el **Número de Protones ($p^+$)**. Define de qué elemento estamos hablando. (Si $Z=1$, siempre será Hidrógeno. Si $Z=6$, siempre será Carbono).
- **Número Másico ($A$):** Es la masa pesada del átomo, que lógicamente está concentrada íntegramente en el núcleo. $A = \\text{Protones} + \\text{Neutrones}$. 
- En notación nuclear estándar o isotópica, el elemento se escribe con una gran letra ($X$), el número de masa va arriba a la izquierda y el atómico abajo a la izquierda: 
  $^{A}_{Z}\\text{X}$

**3. Conceptos Claves para Cálculos PAES:**
- **Neutrones:** Se obtienen por simple resta aritmética de la masa menos los protones: $n^0 = A - Z$.
- **Átomos Neutros:** Las cargas deben estar equilibradas a cero, por lo tanto: $\\text{Electrones } = \\text{ Protones } (e^- = Z)$.
- **Iones:** Si el átomo pierde o gana electrones, adquiere carga. 
  *Catión ($+$):* Perdió electrones (ej. $Ca^{+2}$, tiene 2 e- menos que su Z).
  *Anión ($-$):* Ganó electrones (ej. $Cl^{-1}$, tiene 1 e- más que su Z).
  *Aviso fundamental:* **¡En los iones NUNCA, jamás, cambia el núcleo (los protones)!** Las reacciones químicas solo negocian y permutan electrones de valencia.

**4. Isótopos e Isóbaros:**
- **Isótopos:** (Iso = igual, topo = lugar en la tabla periódica). Tienen **igual $Z$** (son el mismo elemento), pero **distinto $A$** porque difieren en el número de neutrones. (Ej. Carbono-12 vs Carbono-14 radiactivo).
- **Isóbaros:** Tienen **distinta $Z$** (elementos diferentes) pero coinciden astronómicamente en el **mismo $A$** (pesan lo mismo en el núcleo).\n\n---\n\n**Problema Práctico:** Tienes la especie química: $\\mathbf{^{27}_{13}Al^{+3}}$. Determina sus partículas subatómicas exactas.<br><br>
**Cálculo:**<br>
1. **$Z = 13$ (abajo):** Hay **13 Protones**. Es el documento de identidad del Aluminio.<br>
2. **$A = 27$ (arriba):** Masa total del núcleo. Neutrones = $A - Z = 27 - 13 =$ **14 Neutrones**.<br>
3. **Carga $+3$:** Significa que perdió electrones negativos (quedó más positivo). Electrones originales = 13. Electrones actuales = $13 - 3 =$ **10 Electrones**.`,
      order: 7,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783988593/quimica/cap1/sec-1-7.jpg',
      datos_claves: [
        'Z = p+',
        'A = p+ + n°',
        'Neutrones = A - Z',
        'Átomo Neutro: e- = p+',
        'Iones: Afectan estrictamente a los e-. Catión (+, perdió electrones). Anión (-, ganó electrones).',
        'IsóTopos: igual proTón (mismo elemento, distinta masa).'
      ],
      test: {
        id: 'test-qui-1-7',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Es momento de poner en práctica las matemáticas atómicas y la simbología internacional. Todo se reduce a sumar y restar p, n, e.',
        preguntas: [
          {
            id: 'q-1-7-1',
            enunciado: 'Un científico descubre una muestra que contiene el isótopo más común del Sodio y lo anota en su cuaderno de laboratorio utilizando la notación química formal:',
            formula_latex: '^{23}_{11}\\text{Na}',
            alternativas: { A: 'El núcleo de este átomo contiene 11 protones y 23 neutrones.', B: 'El átomo en estado fundamental posee 11 electrones orbitando un núcleo de masa 34.', C: 'La estructura de este átomo consiste en 11 protones, 11 electrones y 12 neutrones.', D: 'Este isótopo es un catión porque su masa supera el doble de su número atómico.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Z=11 (abajo) indica 11 protones y 11 electrones (por ser neutro). A=23 (arriba). Neutrones = A - Z = 23 - 11 = 12.',
            feedback_error: 'Aplica el formulario de decodificación: El número inferior (Z) son los protones y electrones. El número superior (A) es la masa (protones + neutrones). Por ende, los neutrones son siempre el de arriba menos el de abajo.'
          },
          {
            id: 'q-1-7-2',
            enunciado: 'El Flúor (F) es el elemento más electronegativo, lo que significa que "roba" fácilmente un electrón al reaccionar. Sabiendo que el átomo neutro de Flúor posee $Z=9$ y $A=19$, determina el inventario completo de partículas subatómicas para el **anión fluoruro ($F^{-1}$)**:',
            alternativas: { A: '9 protones, 8 electrones, 10 neutrones.', B: '9 protones, 10 electrones, 10 neutrones.', C: '8 protones, 9 electrones, 19 neutrones.', D: '10 protones, 9 electrones, 9 neutrones.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Impecable! Los protones se mantienen intocables (9). Los neutrones son 19-9=10. Y como tiene carga $-1$, sumó 1 electrón extra a los 9 originales, quedando en 10 e-.',
            feedback_error: '¡Cuidado con la trampa química! La carga negativa significa que GANÓ electrones, no que los perdió. Y el núcleo (protones) jamás cambia. Debes tener 9 protones y sumar 1 a la cantidad de electrones normales.'
          },
          {
            id: 'q-1-7-3',
            enunciado: 'Una prestigiosa revista científica publica la siguiente tabla comparando tres especies atómicas distintas. Analiza rigurosamente los datos y concluye su identidad química:',
            formula_latex: '\\begin{array}{|c|c|c|c|}\\hline \\text{Especie} & \\text{Protones (}p^+\\text{)} & \\text{Neutrones (}n^0\\text{)} & \\text{Electrones (}e^-\\text{)} \\\\ \\hline X & 17 & 18 & 17 \\\\ Y & 17 & 20 & 18 \\\\ Z & 18 & 22 & 18 \\\\ \\hline \\end{array}',
            alternativas: { A: 'X e Y son iones del mismo elemento.', B: 'X e Y son isótopos del elemento de número atómico 17, siendo Y un anión de carga -1.', C: 'Y y Z son el mismo elemento porque tienen igual cantidad de electrones (18).', D: 'Las tres especies corresponden a átomos neutros de distintos elementos de la tabla.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Análisis perfecto y de alto nivel! Como X e Y tienen 17 protones, son cloro (isótopos por tener distinto neutrón). La especie Y tiene 17p+ pero 18e-, es decir, tiene un electrón extra, por lo que es un ión negativo (anión).',
            feedback_error: 'El documento de identidad es EXCLUSIVAMENTE el Protón. Si X e Y tienen 17 protones, son el mismo elemento. Luego, compara los protones con los electrones en la especie Y. ¿Tiene más negativos que positivos? Entonces es un anión.'
          },
          {
            id: 'q-1-7-4',
            enunciado: '¿Cuál de las siguientes igualdades matemáticas define a dos elementos que son clasificados formalmente como Isóbaros?',
            alternativas: { A: '$Z_1 = Z_2$', B: '$Z_1 + n_1 = Z_2 + n_2$', C: '$n_1 = n_2$', D: '$Z_1 - e_1 = Z_2 - e_2$' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Los isóbaros deben tener la misma masa total ($A$). Como la masa es Protones + Neutrones ($Z + n$), la suma debe ser igual para ambos.',
            feedback_error: 'Isóbaros significa "igual peso o igual masa nuclear". El número de masa $A$ se calcula sumando el número atómico (Z) con los neutrones (n). Si $A_1 = A_2$, entonces $Z_1+n_1 = Z_2+n_2$.'
          },
          {
            id: 'q-1-7-5',
            enunciado: 'Evalúa la veracidad de la siguiente frase química: *"Cuando el Calcio metálico (Z=20) se oxida formando el polvo blanco de Óxido de Calcio, el ión de calcio resultante ha modificado drásticamente su número atómico en comparación con el metal original, lo que explica el drástico cambio de color y reactividad"*. Esta afirmación es científicamente:',
            alternativas: { A: 'Verdadera, porque los cambios químicos alteran los núcleos transformando los metales.', B: 'Verdadera, porque el número atómico Z de los cationes cambia según su estado de oxidación.', C: 'Falsa, ya que las reacciones químicas solo involucran ganancias o pérdidas de masa neutrónica estabilizadora.', D: 'Falsa, porque las reacciones químicas son exclusivamente intercambios, ganancias o pérdidas de electrones; los núcleos y el número atómico (Z) jamás se alteran en reacciones químicas ordinarias.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Excelente! Regla de oro de la química: Los núcleos son sagrados. Toda la química, toda la vida, los colores, explosiones y venenos, dependen exclusivamente de la danza de los ligeros electrones.',
            feedback_error: 'Las reacciones químicas ordinarias operan en los niveles externos del modelo de Bohr, interactuando los electrones. Para alterar un núcleo o un protón, requerimos una reacción nuclear de fisión, no una simple oxidación del calcio.'
          }
        ]
      }
    }
  ]
};
