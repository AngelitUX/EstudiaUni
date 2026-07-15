export const cap4 = {
  id: 'cap-qui-4',
  materiaId: 'ciencias-quimica',
  title: 'Soluciones Químicas y Concentración',
  introduccion: 'Aprende a analizar las mezclas homogéneas y domina las fórmulas matemáticas (físicas y químicas) para expresar exactamente cuán concentrada está una disolución.',
  order: 4,
  imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081775/quimica/cap4/cap4_new.jpg',
  secciones: [
    {
      id: 'sec-qui-4-1',
      title: '1. Soluto, Solvente y Disolución',
      introduccion: 'Una Solución (o Disolución) es una mezcla homogénea (se ve como una sola fase) de dos o más sustancias.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Una **Solución (o Disolución)** es una mezcla homogénea (se ve como una sola fase) de dos o más sustancias. En química, siempre identificamos dos componentes clave:

**1. El Soluto:**
- Es la sustancia que se disuelve.
- Generalmente se encuentra en **menor cantidad**.
- Puede ser sólido (sal), líquido (alcohol) o gas (CO2 en las bebidas).

**2. El Solvente (o Disolvente):**
- Es el medio en el que se disuelve el soluto.
- Generalmente se encuentra en **mayor cantidad**.
- El **agua** es conocida como el disolvente universal debido a su capacidad para disolver sustancias polares e iónicas.

La regla de oro de las soluciones es: **"Lo semejante disuelve a lo semejante"**. Las sustancias polares (como la sal) se disuelven en solventes polares (como el agua). Las sustancias apolares (como el aceite o la pintura al óleo) se disuelven en solventes apolares (como el aguarrás o hexano).

---
**Problema Práctico:** Al preparar un café con azúcar, mezclas 250 mL de agua caliente con 2 cucharadas de café puro y 3 cucharadas de azúcar. Identifica quiénes actúan como solutos, quién como solvente y por qué no podrías endulzar el café usando aceite en lugar de azúcar.<br><br>
**Análisis y Solución:**<br>
1. **Identificar Solvente:** El agua está en abrumadora mayoría (250 mL), por lo tanto es el solvente.<br>
2. **Identificar Solutos:** El café y el azúcar están en menor proporción y se disuelven en el agua. Ambos son solutos.<br>
3. **¿Por qué no aceite?:** El agua es un solvente polar. El aceite es una sustancia apolar. Según la regla "lo semejante disuelve a lo semejante", el agua y el aceite se repelen, por lo que el aceite no se disolvería, formando una mezcla heterogénea (dos capas separadas).<br>
**Respuesta:** Solvente: Agua. Solutos: Café y Azúcar. El aceite no sirve porque es apolar y el agua polar, siendo inmiscibles.`,
      order: 1,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081795/quimica/cap4/sec-4-1.jpg',
      datos_claves: [
        'Solución = Mezcla Homogénea (una sola fase visible).',
        'Soluto: Sustancia disuelta (menor cantidad).',
        'Solvente: Medio disolvente (mayor cantidad).',
        'Regla de solubilidad: "Lo semejante disuelve a lo semejante" (Polares con Polares).'
      ],
      test: {
        id: 'test-qui-4-1',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Identificar quién es el soluto y quién el solvente es vital para cualquier cálculo de concentración.',
        preguntas: [
          {
            id: 'q-4-1-1',
            enunciado: 'En una copa de pisco sour, se mezclan 30 mL de jugo de limón, 20 mL de goma (azúcar líquida) y 90 mL de pisco (alcohol). ¿Cuál componente actúa como el solvente principal de esta mezcla?',
            alternativas: { A: 'El jugo de limón.', B: 'La goma.', C: 'El pisco.', D: 'No hay solvente porque todos son líquidos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! El pisco está en mucha mayor proporción (90 mL), por ende es el solvente que recibe al resto de ingredientes.',
            feedback_error: 'El solvente es, por definición universal, aquel que se encuentra en mayor cantidad.'
          },
          {
            id: 'q-4-1-2',
            enunciado: '¿Cuál es la masa total de una disolución si disuelves cuidadosamente 15 gramos de azúcar en 250 gramos de agua?',
            alternativas: { A: '250 gramos.', B: '265 gramos.', C: '235 gramos.', D: 'Depende de la temperatura.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Masa soluto + Masa solvente = 15g + 250g = 265g. La masa es siempre aditiva.',
            feedback_error: 'Recuerda que la masa total de la solución es la suma exacta de todos sus componentes (Ley de Lavoisier).'
          },
          {
            id: 'q-4-1-3',
            enunciado: '¿Por qué al intentar lavar grasa de motor de tus manos con agua pura no logras limpiarlas, pero al usar gasolina o un disolvente orgánico sí funciona?',
            alternativas: { A: 'Porque la gasolina es más caliente que el agua.', B: 'Porque la grasa es una sustancia polar que rechaza a los solventes orgánicos.', C: 'Porque la grasa es apolar y "lo similar disuelve a lo similar" (gasolina apolar).', D: 'Porque el agua pura disuelve los huesos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! La grasa (apolar) ignora al agua (polar) pero se deshace felizmente en un solvente apolar como la gasolina o aguarrás.',
            feedback_error: 'El principio básico de disolución es polaridad. Polar disuelve polar. Apolar disuelve apolar.'
          },
          {
            id: 'q-4-1-4',
            enunciado: 'Una aleación de bronce está compuesta por 88% Cobre y 12% Estaño. Podemos clasificar esta aleación como:',
            alternativas: { A: 'Una disolución sólida donde el Estaño es el solvente.', B: 'Una mezcla heterogénea sólido-sólido.', C: 'Una disolución sólida donde el Cobre es el solvente.', D: 'Un compuesto químico puro (CuSn).' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Las aleaciones son mezclas homogéneas sólidas. Como hay mucho más Cobre, este actúa de solvente.',
            feedback_error: 'Es una mezcla homogénea (disolución), y el solvente siempre es el que está en mayor porcentaje (Cobre).'
          },
          {
            id: 'q-4-1-5',
            enunciado: 'Respecto a los volúmenes, si mezclas 50 mL de alcohol con 50 mL de agua, el volumen final es ligeramente menor a 100 mL (aprox 96 mL). Esto demuestra que:',
            alternativas: { A: 'Parte de la masa se destruyó.', B: 'El volumen no siempre es estrictamente aditivo debido al acomodo de las moléculas en los espacios vacíos.', C: 'Hubo una fuga en el matraz.', D: 'El alcohol se evaporó instantáneamente.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! A diferencia de la masa, los volúmenes pueden "empaquetarse" mejor al mezclarse, reduciendo el espacio total ocupado.',
            feedback_error: 'La masa JAMÁS cambia. El volumen sí, porque las moléculas pequeñas de agua se meten entre los huecos de las moléculas grandes de alcohol, ocupando menos espacio total.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-2',
      title: '2. Factores que afectan la Solubilidad',
      introduccion: 'La solubilidad es la cantidad máxima de soluto que puede disolverse en una cantidad dada de solvente.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La **solubilidad** es la cantidad máxima de soluto que puede disolverse en una cantidad dada de solvente. Sin embargo, este valor no es fijo y depende de varios factores externos:

**1. Temperatura:**
- **Para solutos sólidos (ej. sal, azúcar en agua):** Al aumentar la temperatura, **aumenta** la solubilidad. El calor hace que las moléculas del agua se muevan más rápido, abriendo espacio y disolviendo el sólido más rápido y en mayor cantidad.
- **Para solutos gaseosos (ej. CO2 en bebidas):** Al aumentar la temperatura, **disminuye** la solubilidad. El calor le da a las moléculas de gas la energía necesaria para "escapar" del líquido.

**2. Presión:**
- La presión casi **no afecta** la solubilidad de sólidos ni líquidos.
- **Para solutos gaseosos:** Al aumentar la presión sobre el líquido, **aumenta** enormemente la solubilidad del gas. (Ley de Henry).

**3. Agitación y Superficie de Contacto:**
- Revolver o triturar el soluto no cambia la cantidad *máxima* que se puede disolver, pero sí hace que se disuelva mucho más **rápido**.

---
**Problema Práctico:** Estás en una fábrica de bebidas gaseosas y necesitas asegurar que la bebida retenga la mayor cantidad posible del gas efervescente ($CO_2$) antes de ser embotellada. ¿Qué condiciones de temperatura y presión le aplicarías a los tanques de mezcla?<br><br>
**Análisis y Solución:**<br>
1. **Condición de Temperatura:** El soluto es un gas. Los gases escapan del líquido si hace calor. Por lo tanto, necesitamos que la temperatura sea lo más **baja (fría)** posible para "congelar" el movimiento y retener el gas disuelto.<br>
2. **Condición de Presión:** Para disolver un gas en un líquido, debes empujarlo hacia adentro. A **mayor presión**, mayor gas se disuelve en la mezcla.<br>
**Respuesta:** Debes mantener los tanques a **baja temperatura (muy fríos) y alta presión**. (Por eso las bebidas efervescentes hacen "psss" al abrirlas, liberando la presión alta).`,
      order: 2,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081796/quimica/cap4/sec-4-2.jpg',
      datos_claves: [
        'Sólidos en líquidos: Más calor = Más solubilidad (se disuelven mejor).',
        'Gases en líquidos: Más calor = Menos solubilidad (el gas se escapa).',
        'Presión: Solo afecta a los gases. Alta presión = Alta solubilidad gaseosa.',
        'Triturar o agitar solo acelera la disolución, no aumenta la solubilidad máxima.'
      ],
      test: {
        id: 'test-qui-4-2',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La temperatura tiene efectos totalmente opuestos dependiendo de si el soluto es sólido o gas.',
        preguntas: [
          {
            id: 'q-4-2-1',
            enunciado: 'Un biólogo nota que los peces mueren asfixiados en lagunas donde el agua se ha calentado demasiado por el sol de verano (contaminación térmica). La explicación química es:',
            alternativas: { A: 'El sol evapora a los peces.', B: 'Al aumentar la temperatura, la solubilidad del oxígeno (gas) en el agua disminuye, escapando a la atmósfera.', C: 'Al aumentar la temperatura, el oxígeno disuelto se convierte en hidrógeno.', D: 'El calor solidifica el oxígeno en el fondo.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Los gases odian el calor. Si el agua se calienta, el O2 se escapa y los peces se quedan sin aire.',
            feedback_error: 'Recuerda que para solutos gaseosos (como el oxígeno respirable), si calientas el líquido, el gas se va (baja la solubilidad).'
          },
          {
            id: 'q-4-2-2',
            enunciado: 'En la fábrica de bebidas carbonatadas, para lograr que la mayor cantidad posible de gas carbónico (CO2) se disuelva en el agua azucarada, el proceso debe hacerse:',
            alternativas: { A: 'A alta presión y baja temperatura.', B: 'A baja presión y alta temperatura.', C: 'A alta presión y alta temperatura.', D: 'Al vacío absoluto.' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Excelente! La alta presión empuja el gas hacia el líquido, y el frío ayuda a que se mantenga atrapado (no se escape).',
            feedback_error: 'Para retener un gas necesitas dos cosas: empujarlo con presión (alta presión) y evitar que tenga energía para escapar (baja temperatura).'
          },
          {
            id: 'q-4-2-3',
            enunciado: 'Si tienes un cubo de azúcar y la misma cantidad de azúcar pero en polvo. Al echarlos en agua a temperatura ambiente, ¿qué ocurrirá?',
            alternativas: { A: 'El azúcar en polvo se disolverá más rápido porque tiene mayor área de contacto (superficie) con el solvente.', B: 'El cubo de azúcar se disolverá más rápido porque es más denso.', C: 'Ambos se disolverán exactamente a la misma velocidad.', D: 'El polvo podrá disolver mayor cantidad de gramos totales que el cubo.' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Correcto! Moler el soluto aumenta el área de choque para las moléculas de agua, acelerando la cinética de disolución (pero no aumenta el límite de gramos).',
            feedback_error: 'Moler un sólido expone todas sus caras interiores al ataque del agua, haciéndolo extremadamente rápido.'
          },
          {
            id: 'q-4-2-4',
            enunciado: 'Si revisas un gráfico clásico de Solubilidad (Gramos disueltos vs Temperatura) para varias sales (solutos sólidos), observarás que en la gran mayoría de las curvas:',
            alternativas: { A: 'La curva desciende a medida que aumenta la temperatura.', B: 'La curva es una línea horizontal perfecta.', C: 'La curva asciende a medida que aumenta la temperatura.', D: 'Las curvas se vuelven negativas.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Para sólidos, calor es igual a más solubilidad. Las curvas siempre van hacia arriba.',
            feedback_error: 'Para sustancias sólidas, calentar el agua permite disolver muchos más gramos, por lo que el gráfico debe ir hacia arriba (positivo).'
          },
          {
            id: 'q-4-2-5',
            enunciado: 'Al abrir violentamente una lata de bebida recién agitada, el gas sale de golpe con espuma. ¿Qué factor de solubilidad acaba de alterarse bruscamente?',
            alternativas: { A: 'Aumentó la temperatura.', B: 'Disminuyó la presión sobre el líquido.', C: 'Aumentó el área de contacto.', D: 'Cambió la naturaleza del solvente.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Al abrirla, la presión dentro de la lata se iguala a la presión atmosférica (baja drásticamente), obligando al gas excedente a escapar rápido.',
            feedback_error: 'La lata sellada está a mucha presión. Al abrirla, liberas esa presión de golpe, lo que hace que la solubilidad caiga a cero para el gas en exceso.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-3',
      title: '3. Soluciones Saturadas, Insaturadas y Sobresaturadas',
      introduccion: 'Las soluciones se clasifican según cuánta cantidad de soluto tienen respecto a la cantidad máxima que el solvente puede aceptar (su límite de solubilidad).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Las soluciones se clasifican según cuánta cantidad de soluto tienen respecto a la cantidad máxima que el solvente puede aceptar (su límite de solubilidad).

**1. Solución Insaturada:**
Contiene **menos** soluto del que puede disolver a esa temperatura. Si agregas una cucharada extra de sal, se disolverá fácilmente y desaparecerá.

**2. Solución Saturada:**
Contiene **exactamente el máximo** posible de soluto que el solvente puede disolver. Está en perfecto equilibrio. Si agregas un solo granito de sal extra, este NO se disolverá y caerá al fondo (precipitará).

**3. Solución Sobresaturada:**
Contiene **más soluto del límite máximo**. ¡Es una trampa química! Se logra calentando el solvente, disolviendo mucho soluto, y enfriándolo muy lentamente sin perturbarlo. Es un estado sumamente **inestable**. Si agitas el vaso o le echas un pequeño "cristal semilla", todo el exceso de soluto se cristalizará y precipitará de golpe al fondo.

---
**Problema Práctico:** A 20°C, la solubilidad máxima de la sal en 100 mL de agua es de 36 gramos. Un estudiante tiene 3 vasos (A, B y C) con 100 mL de agua cada uno a 20°C. Al vaso A le agrega 20g de sal, al vaso B le agrega 36g, y al vaso C le agrega 50g. Describe qué pasará visualmente en cada vaso y clasifica el tipo de solución resultante.<br><br>
**Análisis y Solución:**<br>
1. **Vaso A (20g):** Está por debajo del límite (36g). Toda la sal se disolverá. Es una solución **Insaturada**.<br>
2. **Vaso B (36g):** Está exactamente en el límite (36g). Toda la sal se disolverá, pero no cabe absolutamente nada más. Es una solución **Saturada**.<br>
3. **Vaso C (50g):** Supera el límite de los 36g. Como el agua a 20°C solo puede aceptar 36g, los restantes $14\\text{ g} (50 - 36)$ no podrán disolverse de ninguna manera y caerán al fondo como un sólido visible.<br>
**Respuesta:** Vaso A: Insaturada (todo disuelto). Vaso B: Saturada (todo disuelto, pero al límite). Vaso C: Quedará como Saturada pero con 14 gramos de sólido precipitado en el fondo.`,
      order: 3,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081796/quimica/cap4/sec-4-3.jpg',
      datos_claves: [
        'Insaturada: Aún puede disolver más soluto sin problemas.',
        'Saturada: Llegó al tope máximo. El exceso extra caerá al fondo.',
        'Sobresaturada: Tiene soluto en exceso "engañado" por la temperatura. Muy inestable.',
        'El límite máximo de solubilidad es específico para cada sustancia y depende de la temperatura.'
      ],
      test: {
        id: 'test-qui-4-3',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Es como una maleta (solvente). Insaturada: medio vacía. Saturada: repleta. Sobresaturada: metiste ropa a la fuerza sentándote encima y si abres el cierre explota.',
        preguntas: [
          {
            id: 'q-4-3-1',
            enunciado: 'Si la solubilidad de la sal (NaCl) en agua a 20°C es de 36 g por cada 100 mL, y tú preparas un vaso disolviendo solo 10 g en 100 mL de agua, la solución resultante se clasifica como:',
            alternativas: { A: 'Sobresaturada.', B: 'Saturada con precipitado.', C: 'Insaturada.', D: 'Concentrada.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! 10g es mucho menor que el límite de 36g, así que la solución aún tiene capacidad de recibir 26g más.',
            feedback_error: 'Compara el número: agregaste 10g, y el límite son 36g. Todavía le cabe mucho soluto.'
          },
          {
            id: 'q-4-3-2',
            enunciado: 'Observas un vaso de precipitado con una disolución transparente, pero notas que en el fondo hay un cúmulo de polvo blanco sin disolver. Si la temperatura es constante, la porción líquida de esta mezcla obligatoriamente está:',
            alternativas: { A: 'Sobresaturada.', B: 'Insaturada.', C: 'Saturada.', D: 'Evaporada.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Si hay soluto sobrando en el fondo, significa que el líquido "se llenó" y rebotó el exceso. La parte líquida está al 100% de su capacidad (saturada).',
            feedback_error: 'La presencia de un exceso en el fondo (precipitado) es la prueba máxima de que la disolución ya no admite más (está saturada).'
          },
          {
            id: 'q-4-3-3',
            enunciado: 'Para fabricar "cristales caseros" de azúcar, calientas agua, agregas toneladas de azúcar hasta saturar, y la dejas enfriar en reposo. Al enfriarse sin formar cristales todavía, el líquido queda en estado:',
            alternativas: { A: 'Insaturado.', B: 'Saturado.', C: 'Sobresaturado.', D: 'Diluido.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! Al enfriar el agua redujiste su "capacidad", pero el azúcar aún está atrapada ahí. Está sobre el límite (sobresaturada).',
            feedback_error: 'Este es el método clásico para forzar a una solución a aceptar más soluto del permitido en frío.'
          },
          {
            id: 'q-4-3-4',
            enunciado: 'Si tienes una solución sobresaturada muy estable y le dejas caer un grano de arena o un pequeño cristal del mismo soluto (semilla de cristalización), ocurrirá que:',
            alternativas: { A: 'El cristal se disolverá instantáneamente.', B: 'La solución se calentará hasta hervir.', C: 'El soluto extra precipitará bruscamente formando una gran masa de cristales sólidos.', D: 'No ocurrirá nada.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Ese es el punto débil de las soluciones sobresaturadas. Una perturbación rompe el equilibrio y el exceso se materializa al instante.',
            feedback_error: 'Al estar en un equilibrio falso e inestable, cualquier golpe físico rompe la tensión y expulsa el exceso de soluto en forma sólida.'
          },
          {
            id: 'q-4-3-5',
            enunciado: 'Un gráfico de solubilidad muestra una curva. Si las coordenadas de tu mezcla caen exactamente SOBRE la línea de la curva, significa que:',
            alternativas: { A: 'Es insaturada.', B: 'Es saturada.', C: 'Es sobresaturada.', D: 'Hubo un error de cálculo.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! La línea gráfica representa matemáticamente el límite exacto (saturación). Debajo de la línea es insaturada, por encima es sobresaturada.',
            feedback_error: 'La curva marca la frontera. Todo punto ubicado sobre la raya es el límite exacto de saturación.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-4',
      title: '4. Concentraciones Físicas: Porcentaje masa-masa (%m/m)',
      introduccion: 'Para medir la concentración de una mezcla, usamos cálculos matemáticos.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Para medir la concentración de una mezcla, usamos cálculos matemáticos. Las unidades Físicas son las más sencillas, ya que solo usan porcentajes. La primera es el **Porcentaje Masa-Masa (% m/m)**.

**Definición:** Indica cuántos gramos de soluto hay por cada 100 gramos de solución (¡la mezcla completa!).

**La fórmula fundamental es:**
$\\%\\, m/m = \\frac{\\text{masa del soluto (g)}}{\\text{masa de la solución (g)}} \\times 100$

¡Cuidado con la trampa más común!
La **masa de la solución** es la suma de todo. 
$\\text{Masa de la solución} = \\text{Masa del Soluto} + \\text{Masa del Solvente}$.

Si te dicen que se disuelven 10g de sal en 90g de agua, la solución no pesa 90g, ¡pesa 100g!

---
**Problema Práctico:** Preparas una sopa añadiendo $30\\text{ g}$ de condimentos sólidos en una olla que contiene $270\\text{ g}$ de agua caliente. ¿Cuál es el porcentaje masa-masa (% m/m) del condimento en la sopa?<br><br>
**Análisis y Solución:**<br>
1. **Identificar datos:**
   - Masa del soluto (condimentos) = $30\\text{ g}$
   - Masa del solvente (agua) = $270\\text{ g}$<br>
2. **Evitar la trampa (Calcular la masa de la solución):**
   Masa solución = $30\\text{ g}$ (soluto) + $270\\text{ g}$ (solvente) = **$300\\text{ g}$ en total**.<br>
3. **Aplicar fórmula:**
   $\\%\\, m/m = (30 / 300) \\times 100$<br>
   $\\%\\, m/m = 0.1 \\times 100$<br>
   $\\%\\, m/m = 10\\%$.<br>
**Respuesta:** La concentración es del **10% m/m**. Esto significa que en cada 100 gramos de esa sopa, hay 10 gramos de condimento.`,
      order: 4,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081797/quimica/cap4/sec-4-4.jpg',
      datos_claves: [
        '% m/m mide los gramos de soluto por cada 100 gramos de mezcla total.',
        'Masa Solución = Masa Soluto + Masa Solvente. NUNCA dividas solo por el solvente.',
        'Se usa cuando mezclas dos sólidos, o un sólido con un líquido.',
        'Una concentración de 5% m/m significa 5g de soluto en 95g de agua (Total = 100g).'
      ],
      test: {
        id: 'test-qui-4-4',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Lee atentamente si el ejercicio te da la masa del "agua" o de la "solución". Ahí está la trampa.',
        preguntas: [
          {
            id: 'q-4-4-1',
            enunciado: 'Se disuelven 20 gramos de azúcar en 80 gramos de agua. ¿Cuál es la concentración de la disolución expresada en %m/m?',
            alternativas: { A: '25% m/m', B: '20% m/m', C: '80% m/m', D: '100% m/m' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Primero sumas para el total: 20 + 80 = 100g. Luego %m/m = (20/100)*100 = 20%.',
            feedback_error: '¡Cuidado con la trampa! No dividas 20/80. El denominador es la suma total: masa soluto + masa agua.'
          },
          {
            id: 'q-4-4-2',
            enunciado: 'Si tienes un frasco de jarabe que dice "Concentración: 15% m/m". Esto significa que por cada 100 gramos de jarabe hay:',
            alternativas: { A: '15 gramos de medicamento y 100 gramos de agua.', B: '15 gramos de medicamento y 85 gramos de agua (excipientes).', C: '85 gramos de medicamento y 15 gramos de agua.', D: '15 gramos de agua y 115 gramos totales.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! El porcentaje indica el soluto directo. 15g son soluto, y el resto (100 - 15 = 85g) tiene que ser obligatoriamente el agua/solvente.',
            feedback_error: 'El 15% significa 15 gramos de soluto dentro de 100 gramos TOTALES. Por diferencia (100-15), sabes el agua.'
          },
          {
            id: 'q-4-4-3',
            enunciado: 'Para preparar exactamente 200 gramos de una disolución de suero fisiológico al 5% m/m, ¿cuántos gramos de sal pura debes pesar?',
            alternativas: { A: '5 gramos.', B: '10 gramos.', C: '20 gramos.', D: '50 gramos.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Si en 100g de suero hay 5g de sal, en 200g de suero (el doble) habrá 10g de sal.',
            feedback_error: 'Plantea una regla de tres simple: si el 5% son 5 gramos en 100 gramos totales. ¿Cuántos gramos serán para un total de 200 gramos?'
          },
          {
            id: 'q-4-4-4',
            enunciado: '¿Cuál es la principal ventaja de utilizar la concentración % masa-masa en la industria farmacéutica en lugar de unidades de volumen?',
            alternativas: { A: 'Es más barato pesar que usar jeringas.', B: 'El volumen de los líquidos se dilata con el calor, cambiando la concentración, pero la masa es constante a cualquier temperatura.', C: 'Porque las cremas no tienen volumen.', D: 'No existe ninguna ventaja.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Los fluidos cambian de tamaño si hace calor o frío. Pesar gramos te asegura una dosis idéntica en la Antártida y en el Sahara.',
            feedback_error: 'Los volúmenes (litros, mililitros) son afectados por la dilatación térmica. La masa en gramos nunca cambia.'
          },
          {
            id: 'q-4-4-5',
            enunciado: 'Un alumno mezcla 40 g de soluto con 160 g de solvente. Su compañero dice que la concentración es 25% m/m. ¿Es correcta la afirmación del compañero?',
            alternativas: { A: 'Sí, porque 40 / 160 = 0.25 (25%).', B: 'No, porque la masa de la disolución es 200 g. El cálculo correcto es 40/200, dando 20% m/m.', C: 'No, la concentración real es 40%.', D: 'Sí, pero solo a 25°C.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! El compañero cayó en la trampa típica y dividió por el solvente. Tú sumaste 40+160=200 para el total. 40/200 = 0.2 o 20%.',
            feedback_error: 'El compañero cometió el error clásico: no sumó. El denominador correcto es 40 + 160 = 200g.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-5',
      title: '5. Concentraciones Físicas: %m/v y %v/v',
      introduccion: 'Existen otros dos porcentajes físicos muy comunes, especialmente cuando trabajamos con líquidos de laboratorio: el % m/v y el % v/v.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Existen otros dos porcentajes físicos muy comunes, especialmente cuando trabajamos con líquidos de laboratorio: el **% m/v** y el **% v/v**.

**1. Porcentaje Masa-Volumen (% m/v):**
- Indica cuántos gramos de soluto sólido hay en 100 mililitros (mL) de solución.
- Fórmula: $\\%\\, m/v = \\frac{\\text{masa del soluto (g)}}{\\text{volumen de la solución (mL)}} \\times 100$
- Muy usado en medicina (ej. suero fisiológico al 0.9% m/v).

**2. Porcentaje Volumen-Volumen (% v/v):**
- Indica cuántos mililitros (mL) de soluto líquido hay en 100 mililitros (mL) de solución.
- Fórmula: $\\%\\, v/v = \\frac{\\text{volumen del soluto (mL)}}{\\text{volumen de la solución (mL)}} \\times 100$
- Muy usado en bebidas alcohólicas (ej. Cerveza al 5% vol significa 5 mL de alcohol puro por cada 100 mL de cerveza).

---
**Problema Práctico:** Quieres preparar alcohol desinfectante al 70% v/v usando alcohol puro ($100\\%$). Tomas $350\\text{ mL}$ de alcohol puro y le agregas agua destilada hasta que el volumen total de la botella alcance exactamente los $500\\text{ mL}$. Demuestra matemáticamente que lograste la concentración deseada del 70%.<br><br>
**Análisis y Solución:**<br>
1. **Identificar datos:**
   - Volumen de soluto (alcohol puro) = $350\\text{ mL}$.
   - Volumen de la solución (botella completa final) = $500\\text{ mL}$. (Atención: No te piden el solvente por separado, ya te dan el total de la solución).<br>
2. **Aplicar fórmula de % v/v:**
   $\\%\\, v/v = (350\\text{ mL} / 500\\text{ mL}) \\times 100$<br>
3. **Cálculo:**
   $\\%\\, v/v = 0.7 \\times 100 = 70\\%$.<br>
**Respuesta:** Matemáticamente comprobado. Al disolver 350 mL de soluto líquido en un volumen final de 500 mL, la concentración resultante es exactamente el **70% v/v** requerido para desinfectar.`,
      order: 5,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081798/quimica/cap4/sec-4-5.png',
      datos_claves: [
        '% m/v = Gramos de soluto sólido por 100 mL de mezcla líquida.',
        '% v/v = Mililitros de soluto líquido por 100 mL de mezcla líquida.',
        'El volumen de la solución asume la mezcla completa (usualmente la capacidad del matraz).',
        'Si mezclas líquidos (ej. agua y alcohol), siempre usas % v/v.'
      ],
      test: {
        id: 'test-qui-4-5',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Lee las unidades en los problemas (g o mL) para saber si usar %m/m, %m/v o %v/v.',
        preguntas: [
          {
            id: 'q-4-5-1',
            enunciado: 'Un médico receta preparar una solución inyectable mezclando 2 gramos de medicamento y agregando agua destilada HASTA completar exactamente 100 mL de solución final. La concentración de esto es:',
            alternativas: { A: '2% v/v', B: '2% m/v', C: '2% m/m', D: '98% m/v' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Tienes 2 gramos (masa) metidos en 100 mL de volumen final. Es % Masa/Volumen.',
            feedback_error: 'Fíjate en las unidades: mezclaste Gramos de polvo con Mililitros de líquido. Es Masa/Volumen.'
          },
          {
            id: 'q-4-5-2',
            enunciado: 'Una botella de vino de 750 mL indica en su etiqueta "12° de Alcohol". Esto equivale a 12% v/v. ¿Cuántos mL de alcohol PURO hay en total dentro de esa botella entera?',
            alternativas: { A: '12 mL', B: '120 mL', C: '90 mL', D: '75 mL' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Si en 100mL de vino hay 12mL de alcohol. En 750mL habrá: (12 x 750) / 100 = 90 mL de alcohol para emborracharse.',
            feedback_error: 'Usa regla de 3: 12 mL de alcohol -> 100 mL de vino. ¿X mL de alcohol -> 750 mL de vino?'
          },
          {
            id: 'q-4-5-3',
            enunciado: 'Si viertes 40 mL de jugo concentrado y le agregas 160 mL de agua, asumiendo volúmenes completamente aditivos, ¿cuál es el % v/v del jugo en la mezcla?',
            alternativas: { A: '25% v/v', B: '40% v/v', C: '20% v/v', D: '80% v/v' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Volumen total = 40 + 160 = 200 mL. %v/v = (40 / 200) * 100 = 20%.',
            feedback_error: '¡Cuidado con la trampa! Debes sumar el volumen del soluto y del agua (40+160=200) para tener el volumen final. Luego divide 40/200.'
          },
          {
            id: 'q-4-5-4',
            enunciado: 'Para preparar una disolución al 10% m/v, un estudiante pesa 10 g de azúcar y le agrega 100 mL de agua. El profesor le dice que está mal preparado. ¿Por qué?',
            alternativas: { A: 'Porque 10 gramos no pesan nada.', B: 'Porque al disolver el sólido, el volumen final subirá un poco más de 100 mL, alterando la concentración. Debió enrasar hasta la marca de 100 mL.', C: 'Porque el agua destilada tiene que estar hirviendo.', D: 'El profesor se equivocó, está perfecto.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! En los laboratorios reales, se echa el polvo en el matraz y LUEGO se rellena con agua hasta alcanzar la marca de los 100 mL exactos de mezcla.',
            feedback_error: 'El volumen del denominador es el de la disolución completa. Si pones 100mL de agua y le echas un ladrillo de azúcar de 10g, el líquido va a subir, y el volumen final ya no será 100.'
          },
          {
            id: 'q-4-5-5',
            enunciado: '¿Cuál de estas concentraciones podría cambiar (aunque sea mínimamente) si mides la muestra dentro de un congelador a -10°C versus medirla en el desierto a 45°C?',
            alternativas: { A: 'Porcentaje %m/m', B: 'Porcentaje %m/v', C: 'Fracción Molar', D: 'Ninguna' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! El %m/v tiene el "Volumen" en la división. Y los líquidos se expanden con el calor, cambiando el denominador.',
            feedback_error: 'El calor dilata a los líquidos (cambia el volumen). Por ende, cualquier concentración que use la letra "v" (volumen) variará con el clima.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-6',
      title: '6. Concentración Química: Molaridad (M)',
      introduccion: 'En las unidades químicas, en lugar de pesar el soluto en gramos, usamos el Mol.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En las unidades químicas, en lugar de pesar el soluto en gramos, usamos el Mol. La unidad rey de los laboratorios químicos en todo el mundo es la **Molaridad (M)** (con M mayúscula).

**Definición de Molaridad (M):**
Indica la cantidad de **moles de soluto** disueltos en exactamente **1 Litro (L)** de solución.

**La fórmula fundamental es:**
$M = \\frac{n\\text{ (moles de soluto)}}{V\\text{ (volumen en Litros)}}$

**Pasos para problemas de Molaridad:**
1. El problema casi siempre te dará el soluto en gramos. ¡Debes convertirlo a moles! Usa $n = m / MM$.
2. El problema suele dar el volumen en mililitros (mL). ¡Debes convertirlo a Litros dividiendo por 1000!
3. Divide los moles hallados entre los Litros de la solución.

---
**Problema Práctico:** Se disuelven $20\\text{ g}$ de Hidróxido de Sodio ($NaOH$) en suficiente agua hasta formar un frasco de $500\\text{ mL}$ de solución. ¿Cuál es la Molaridad (M) de la solución? (Masa Molar del $NaOH = 40\\text{ g/mol}$).<br><br>
**Análisis y Solución:**<br>
1. **Paso 1: Convertir gramos a moles.**
   $n = \\text{masa} / MM$
   $n = 20\\text{ g} / 40\\text{ g/mol} = 0.5\\text{ moles de } NaOH$.<br>
2. **Paso 2: Convertir mL a Litros.**
   $500\\text{ mL} / 1000 = 0.5\\text{ Litros}$.<br>
3. **Paso 3: Calcular Molaridad.**
   $M = 0.5\\text{ moles} / 0.5\\text{ L}$
   $M = 1\\text{ Molar (1 M)}$.<br>
**Respuesta:** La concentración química de la solución es **1 M** (1 mol/L). Esto indica que hay exactamente un mol de sosa cáustica disuelto por cada litro de esa botella.`,
      order: 6,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081799/quimica/cap4/sec-4-6.gif',
      datos_claves: [
        'Molaridad (M) = Moles de soluto / Volumen en Litros de la solución entera.',
        'El soluto se cuenta en moles, NO en gramos. Siempre pasa los gramos a moles.',
        'El volumen DEBE estar en Litros. Si te lo dan en mL, divide por 1000.',
        'Una solución 2 M (2 Molar) contiene 2 moles de soluto en cada Litro de líquido.'
      ],
      test: {
        id: 'test-qui-4-6',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Memoriza la fórmula: M = n / V. Y recuerda siempre transformar a Litros.',
        preguntas: [
          {
            id: 'q-4-6-1',
            enunciado: 'Se disuelven 2 moles de sal en agua hasta obtener exactamente 500 mL de disolución final. ¿Cuál es su Molaridad?',
            alternativas: { A: '2 M', B: '4 M', C: '0.004 M', D: '1 M' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! 500 mL = 0.5 Litros. M = 2 moles / 0.5 L = 4 Molar.',
            feedback_error: '¡Peligro! Debes pasar 500 mL a Litros (dividiendo por 1000) lo que da 0.5 L. Luego divide 2 / 0.5.'
          },
          {
            id: 'q-4-6-2',
            enunciado: 'Si un envase de Ácido Clorhídrico comercial etiqueta una concentración de "12 M", significa que:',
            alternativas: { A: 'Hay 12 gramos del ácido en 1 Litro.', B: 'Hay 12 moles del ácido por cada 100 mL.', C: 'Hay 12 moles del ácido disueltos por cada 1 Litro de solución total.', D: 'Hay 12 Litros de agua.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Molaridad (M) se lee textualmente como "Moles por Litro".',
            feedback_error: 'La "M" mayúscula significa Molaridad, y su definición es moles de soluto por cada 1 Litro de mezcla entera.'
          },
          {
            id: 'q-4-6-3',
            enunciado: 'Tienes un problema que dice: "Se disuelven 20 gramos de NaOH (MM = 40 g/mol) hasta formar 250 mL de solución". ¿Cuál es el primer cálculo que debes realizar para hallar la Molaridad?',
            alternativas: { A: 'Dividir 20 gramos entre 250 mL.', B: 'Convertir los 20 gramos de NaOH a moles, dividiendo 20/40 (0.5 moles).', C: 'Multiplicar 20 por 250.', D: 'Pasar los 250 mL a gramos.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! La Molaridad no soporta gramos. Siempre debes convertir la masa a moles en el paso 1 usando la Masa Molar.',
            feedback_error: 'La fórmula de Molaridad exige moles (n) en el numerador. No puedes meter gramos (masa) directamente en la ecuación.'
          },
          {
            id: 'q-4-6-4',
            enunciado: 'Continuando con el problema anterior: si tenías 0.5 moles de NaOH, en un volumen de 250 mL. ¿Cuál es el resultado final de la Molaridad?',
            alternativas: { A: '0.5 M', B: '1.25 M', C: '2 M', D: '0.002 M' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! 250 mL = 0.25 L. M = 0.5 moles / 0.25 L = 2 Molar.',
            feedback_error: 'Pasa los 250 mL a Litros (0.25 L). Y luego divide: 0.5 moles / 0.25 L = 2.'
          },
          {
            id: 'q-4-6-5',
            enunciado: '¿Por qué la Molaridad es una unidad de concentración dependiente de la temperatura ambiente?',
            alternativas: { A: 'Porque el soluto evapora.', B: 'Porque la temperatura altera la masa molar de los átomos.', C: 'Porque el denominador es un Volumen (Litros), y los volúmenes de líquido se dilatan o contraen con los cambios de temperatura.', D: 'No es dependiente, es perfectamente constante.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Cualquier fórmula química que incluya la letra "V" sufrirá alteraciones micrométricas si llevas el matraz del frío al calor.',
            feedback_error: 'Al usar Litros (unidades de volumen) debajo en la fracción, la dilatación térmica de los líquidos alterará el resultado real.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-7',
      title: '7. Molalidad (m) y Fracción Molar (X)',
      introduccion: 'Además de la Molaridad, hay dos unidades químicas más avanzadas pero vitales, que no dependen del volumen de la mezcla (y por lo tanto, no se alteran cuando hace calor y el líquido se expande).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Además de la Molaridad, hay dos unidades químicas más avanzadas pero vitales, que no dependen del volumen de la mezcla (y por lo tanto, no se alteran cuando hace calor y el líquido se expande).

**1. Molalidad (m minúscula):**
- Mide los **moles de soluto** disueltos por cada **1 Kilogramo (kg) de SOLVENTE PURO**.
- Fórmula: $m = \\frac{\\text{moles de soluto}}{\\text{Masa de Solvente (en Kg)}}$
- *Cuidado:* Es la única unidad en química que se divide entre el solvente solo, y no entre la solución total.

**2. Fracción Molar (X):**
- Es una proporción matemática entre 0 y 1.
- Representa qué fracción de todas las moléculas en el vaso pertenecen al soluto.
- Fórmula: $X_\\text{soluto} = \\frac{\\text{moles de soluto}}{\\text{moles de soluto} + \\text{moles de solvente}}$
- La suma de todas las fracciones molares de una mezcla siempre da 1 exacto.

---
**Problema Práctico:** Disuelves 2 moles de sal en exactamente $500\\text{ g}$ de agua pura. ¿Cuál es la Molalidad (m) de tu mezcla y por qué un químico preferiría usar la molalidad en lugar de la Molaridad si este vaso va a ser calentado en un horno?<br><br>
**Análisis y Solución:**<br>
1. **Identificar datos:**
   - Moles de soluto = 2 moles.
   - Masa de solvente (agua) = $500\\text{ g}$. Hay que pasarlo a Kg. $500 / 1000 = 0.5\\text{ Kg}$.<br>
2. **Calcular Molalidad (m):**
   $m = 2\\text{ moles} / 0.5\\text{ Kg} = 4\\text{ m}$ (4 molal).<br>
3. **El problema térmico:** La Molaridad usa "Volumen en Litros". Con el calor del horno, el agua se expandirá (ocupará más volumen). Si el volumen aumenta, la Molaridad cambia, falseando el dato. La masa en kilogramos (peso) NO cambia con la temperatura.<br>
**Respuesta:** La molalidad es de **4 m**. Se prefiere usar la molalidad porque **no se ve afectada por los cambios de temperatura**, ya que se basa en masas y no en volúmenes que se expanden.`,
      order: 7,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081800/quimica/cap4/sec-4-7.webp',
      datos_claves: [
        'Molalidad (m) usa Moles sobre Kilogramos de SOLVENTE. Es inmune a cambios de temperatura.',
        '¡Atención! La molalidad se divide solo por el solvente (agua), NO por la solución total.',
        'Fracción Molar (X) no tiene unidades, es un decimal. Todos los \'X\' suman 1.',
        'X_soluto compara los moles del soluto frente al total de moles de todo el sistema.'
      ],
      test: {
        id: 'test-qui-4-7',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Recuerda: Molaridad = Litros de Solución. Molalidad = Kilos de Solvente.',
        preguntas: [
          {
            id: 'q-4-7-1',
            enunciado: 'En la fórmula matemática de la Molalidad (m), el denominador corresponde a:',
            alternativas: { A: 'Volumen total en Litros.', B: 'Masa de la solución total en kg.', C: 'Masa única y exclusiva del solvente en Kilogramos.', D: 'Moles de agua.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Es la única excepción de la química. Solo va el peso del solvente abajo.',
            feedback_error: 'A diferencia de todas las demás que usan el TOTAL abajo, la Molalidad solo divide por los Kilogramos del solvente puro.'
          },
          {
            id: 'q-4-7-2',
            enunciado: 'Si disuelves 0.5 moles de sal en exactamente 1000 gramos (1 kg) de agua. La concentración de esta solución es:',
            alternativas: { A: '0.5 Molar.', B: '0.5 molal.', C: '1 molal.', D: '500 molal.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Moles / kg solvente = 0.5 / 1 = 0.5 molal (m minúscula).',
            feedback_error: 'Los 1000g de agua equivalen a 1 kg. Al dividir 0.5 moles en 1 kg, el resultado es 0.5 m.'
          },
          {
            id: 'q-4-7-3',
            enunciado: 'Si tienes una mezcla homogénea con una Fracción Molar del Soluto igual a 0.2, ¿cuál será obligatoriamente la Fracción Molar del Solvente?',
            alternativas: { A: '0.2', B: '0.8', C: '1.2', D: '1.0' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Las fracciones molares de las partes siempre deben sumar 1 (como un 100%). Si una es 0.2, la otra debe ser 0.8.',
            feedback_error: 'Piensa en las fracciones molares como los trozos de una pizza. Todos juntos deben formar 1 pizza entera (la suma siempre da 1).'
          },
          {
            id: 'q-4-7-4',
            enunciado: 'La gran ventaja técnica en un laboratorio para preferir calcular la molalidad en lugar de la Molaridad es que:',
            alternativas: { A: 'No sufre variaciones si se calienta la muestra porque no depende del volumen térmico.', B: 'Es mucho más rápido de calcular.', C: 'No requiere conocer los gramos iniciales de las sustancias.', D: 'Usa litros, que son más fáciles de medir con jeringas.' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Excelente! Todo lo que se pesa en balanza (masa, kg) es constante en el universo, aislando el cálculo de los errores por dilatación de líquidos.',
            feedback_error: 'Al usar Kilogramos de agua (masa) en lugar de Litros de agua (volumen), la temperatura no puede estropear tu número.'
          },
          {
            id: 'q-4-7-5',
            enunciado: 'Una mezcla contiene 2 moles del compuesto A y 3 moles del compuesto B. La fracción molar del compuesto A (Xa) será:',
            alternativas: { A: '2', B: '3', C: '0.4', D: '0.6' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Moles propios = 2. Moles Totales (2+3) = 5. Fracción = 2 / 5 = 0.4.',
            feedback_error: 'Divide los moles de A (2) por los moles totales de todos los involucrados (2+3=5). 2 dividido en 5 es 0.4.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-4-8',
      title: '8. Dilución de Soluciones',
      introduccion: 'La Dilución es el proceso de añadir más solvente (generalmente agua) a una solución concentrada para disminuir su concentración.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La **Dilución** es el proceso de añadir más solvente (generalmente agua) a una solución concentrada para disminuir su concentración. Es como cuando tienes un jugo en polvo que te quedó muy dulce y le echas más agua para "arreglarlo".

**El principio sagrado de la dilución:**
Al echar más agua, el volumen aumenta y la concentración disminuye, **PERO la cantidad de soluto (moles) se mantiene constante**. No sacaste ni metiste soluto, solo agua.

**La Ecuación Mágica:**
$C_1 \\times V_1 = C_2 \\times V_2$
Donde:
- **$C_1$** y **$V_1$**: Concentración y Volumen iniciales (muy concentrado, menos volumen).
- **$C_2$** y **$V_2$**: Concentración y Volumen finales (menos concentrado, más volumen).
*(Nota: Puedes usar cualquier unidad de concentración y volumen, siempre y cuando sea la misma a ambos lados).* 

---
**Problema Práctico:** En el laboratorio tienes una botella de ácido fuerte muy concentrado a 12 M. Necesitas usarlo, pero las normas exigen que la concentración máxima sea de 3 M para que sea seguro. Tienes que preparar 1000 mL de esta solución segura. ¿Cuántos mililitros del ácido fuerte inicial debes sacar de la botella para prepararlo?<br><br>
**Análisis y Solución:**<br>
1. **Identificar datos:**
   - Solución inicial (1): $C_1 = 12\\text{ M}$, $V_1 = ?$
   - Solución final (2): $C_2 = 3\\text{ M}$, $V_2 = 1000\\text{ mL}$<br>
2. **Aplicar ecuación de dilución:**
   $C_1 \\times V_1 = C_2 \\times V_2$
   $12 \\times V_1 = 3 \\times 1000$<br>
3. **Despejar $V_1$:**
   $12 \\times V_1 = 3000$
   $V_1 = 3000 / 12 = 250\\text{ mL}$.<br>
**Respuesta:** Debes extraer **250 mL** del ácido concentrado original. (Luego le agregarás 750 mL de agua pura para completar los 1000 mL y diluirlo a una concentración segura de 3 M).`,
      order: 8,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081801/quimica/cap4/sec-4-8.png',
      datos_claves: [
        'Al diluir, se agrega agua: el volumen sube, la concentración baja, el soluto no cambia.',
        'Fórmula de oro: C1 x V1 = C2 x V2 (Concentración 1 x Volumen 1 = C2 x V2).',
        'V2 (Volumen final) es la suma del V1 original más toda el agua extra que agregaste.',
        'Puedes usar mL o Litros, y %m/m o Molaridad, mientras seas consistente en ambos lados.'
      ],
      test: {
        id: 'test-qui-4-8',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Es el proceso de laboratorio más común: partir de una botella química madre "fuerte" y preparar pociones más "suaves" para experimentos seguros.',
        preguntas: [
          {
            id: 'q-4-8-1',
            enunciado: 'Al realizar el proceso de dilución agregando agua pura a una solución, ¿qué magnitud física/química se mantiene matemáticamente constante?',
            alternativas: { A: 'El volumen de la solución.', B: 'La concentración de la solución.', C: 'El color oscuro de la solución.', D: 'La cantidad de moles o masa del soluto disuelto en el interior.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Correcto! Si echaste 5g de azúcar, y luego agregas litros de agua extra, los 5g originales siguen estando ahí adentro, inalterados.',
            feedback_error: 'Lo único que agregaste fue solvente (agua). El soluto que estaba en el fondo, los moles originales, no desaparecieron ni aumentaron.'
          },
          {
            id: 'q-4-8-2',
            enunciado: 'Tienes 100 mL de una solución ácida de 2 Molar de concentración. Le agregas de golpe otros 100 mL de agua pura. La nueva concentración resultante (Molaridad) será:',
            alternativas: { A: '4 M', B: '2 M', C: '1 M', D: '0 M' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Duplicaste el volumen (de 100 a 200mL). Como el soluto está flotando en el doble de agua, la concentración se diluye a la mitad (1 M).',
            feedback_error: 'Aplica C1V1 = C2V2. (2M x 100mL = C2 x 200mL). Despeja C2, y te dará 1M.'
          },
          {
            id: 'q-4-8-3',
            enunciado: 'De un frasco madre sacaste 50 mL de lejía al 10% (C1=10%, V1=50mL). Quieres diluirla hasta tener una lejía de limpieza suave al 2% (C2=2%). ¿Hasta qué volumen final (V2) debes rellenar con agua?',
            alternativas: { A: '250 mL', B: '500 mL', C: '100 mL', D: '50 mL' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Excelente cálculo! C1V1 = C2V2. (10 * 50 = 2 * V2) -> 500 = 2*V2 -> V2 = 250 mL.',
            feedback_error: 'C1(10) * V1(50) = 500. Ahora divide eso por C2(2) para obtener el Volumen Final. 500/2 = 250.'
          },
          {
            id: 'q-4-8-4',
            enunciado: 'Del ejercicio anterior (donde el volumen inicial era 50 mL y el volumen final calculado era 250 mL). ¿Cuánta agua pura UVO QUE SER AGREGADA en la pileta?',
            alternativas: { A: '250 mL de agua agregada.', B: '200 mL de agua agregada.', C: '50 mL de agua agregada.', D: '300 mL de agua agregada.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Tenías 50mL en tu vaso. La meta final eran 250mL. Rellenaste con 200mL de agua de la llave.',
            feedback_error: 'El V2 es el volumen "total". Para saber el agua extra añadida, resta el Final menos el Inicial (250 - 50).'
          },
          {
            id: 'q-4-8-5',
            enunciado: 'Un error típico de estudiantes es usar la fórmula de dilución C1V1=C2V2 para mezclar dos sustancias distintas (ej: reaccionar ácido clorhídrico con soda cáustica). ¿Por qué esto es incorrecto?',
            alternativas: { A: 'Porque la fórmula es falsa.', B: 'Porque C1V1=C2V2 solo asume que los moles son constantes, lo cual es válido únicamente al echar agua (diluir) a una MISMA sustancia, no al reaccionar químicos que destruirán esos moles.', C: 'Porque se necesita usar grados Celsius.', D: 'El estudiante tiene razón, se puede usar para todo.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! C1V1 = Moles. La fórmula sirve porque al echar agua los moles quedan estáticos. En una reacción química los reactivos se aniquilan, violando el principio de la fórmula.',
            feedback_error: 'La dilución no es una reacción química. Es simplemente aguar el caldo. La fórmula solo es válida si lo que echas es solvente puro.'
          }
        ]
      }
    }
  ]
};
