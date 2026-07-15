export const cap3 = {
  id: 'cap-qui-3',
  materiaId: 'ciencias-quimica',
  title: 'Reacciones Químicas y Estequiometría',
  introduccion: 'Domina cómo ocurren los cambios químicos y aprende a calcular exactamente las proporciones de reactivos y productos usando las matemáticas de la química.',
  order: 3,
  imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081774/quimica/cap3/cap3_new.avif',
  secciones: [
    {
      id: 'sec-qui-3-1',
      title: '1. Cambios Físicos vs Cambios Químicos',
      introduccion: 'La química estudia las transformaciones de la materia.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La química estudia las transformaciones de la materia. Estas pueden ser de dos tipos: físicas o químicas.

**1. Cambios Físicos:**
- No alteran la composición interna ni la identidad química de la sustancia.
- Generalmente son reversibles.
- Ejemplos clásicos: los cambios de estado (hervir agua, derretir hielo), romper un vidrio, disolver sal en agua o cortar papel.

**2. Cambios Químicos (Reacciones Químicas):**
- Ocurre una reorganización de los átomos: se rompen enlaces en los reactantes y se forman enlaces nuevos para crear **productos diferentes**.
- Se altera la identidad química (las sustancias cambian sus propiedades).
- Evidencias visuales de que ocurrió un cambio químico: liberación de gas (burbujas), formación de un sólido (precipitado), cambio brusco de color, o liberación/absorción de calor o luz (combustión).

---
**Problema Práctico:** Tienes dos procesos: A) Dejar un clavo de hierro a la intemperie hasta que se pone rojizo. B) Fundir hierro en un alto horno a 1500°C. Identifica si son cambios físicos o químicos y justifica tu respuesta.<br><br>
**Análisis y Solución:**<br>
1. **Proceso A (Oxidación):** El clavo de hierro ($Fe$) reacciona con el oxígeno ($O_2$) del aire formando óxido de hierro ($Fe_2O_3$). Las propiedades de la capa rojiza son distintas a las del metal original y no se puede revertir fácilmente. Es una reacción química.<br>
2. **Proceso B (Fundición):** El hierro pasa de estado sólido a líquido debido al intenso calor. Sus átomos simplemente se mueven más rápido y se separan, pero sigue siendo puramente hierro ($Fe$).<br>
**Respuesta:** El proceso A es un **cambio químico** (oxidación), y el proceso B es un **cambio físico** (cambio de estado de sólido a líquido).`,
      order: 1,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081787/quimica/cap3/sec-3-1.jpg',
      datos_claves: [
        'Cambio físico: La sustancia sigue siendo la misma. (Ej. Agua líquida a vapor).',
        'Cambio químico: Se crean sustancias nuevas rompiendo y formando enlaces.',
        'Evidencias químicas: burbujeo inesperado, cambio de color, precipitado, luz/calor.',
        'Disolver sal o azúcar es considerado un cambio físico (se recuperan evaporando el agua).'
      ],
      test: {
        id: 'test-qui-3-1',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Distinguir entre un cambio físico y químico es el primer paso para analizar un fenómeno natural.',
        preguntas: [
          {
            id: 'q-3-1-1',
            enunciado: 'De los siguientes fenómenos de la vida cotidiana, ¿cuál corresponde a un cambio exclusivamente químico?',
            alternativas: { A: 'El derretimiento de un helado al sol.', B: 'La evaporación del alcohol de una herida.', C: 'La oxidación de una bicicleta dejada bajo la lluvia.', D: 'La disolución de sal en un plato de sopa.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! El hierro de la bicicleta reacciona con el oxígeno y el agua formando óxido de hierro (sustancia nueva).',
            feedback_error: 'Derretir, evaporar y disolver no crean moléculas nuevas, solo las separan o cambian de estado (cambios físicos).'
          },
          {
            id: 'q-3-1-2',
            enunciado: 'A nivel microscópico, la característica fundamental que define a toda reacción química es:',
            alternativas: { A: 'El aumento de la temperatura del recipiente.', B: 'La ruptura de enlaces existentes y la formación de enlaces nuevos.', C: 'La pérdida irreversible de electrones.', D: 'El cambio de color de las sustancias involucradas.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Los átomos son como legos que se desarman (rompen enlaces) y se vuelven a armar de forma distinta (nuevos enlaces).',
            feedback_error: 'Aunque haya cambios de color o calor, la verdadera definición química de una reacción es el reordenamiento de los átomos al romper y crear enlaces.'
          },
          {
            id: 'q-3-1-3',
            enunciado: 'La fotosíntesis es el proceso mediante el cual las plantas toman CO2 y Agua para transformarlos en Glucosa y Oxígeno. Este proceso se clasifica como:',
            alternativas: { A: 'Cambio físico reversible.', B: 'Proceso de destilación biológica.', C: 'Cambio de estado de agregación.', D: 'Cambio químico.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Exacto! Sustancias simples se transforman en sustancias complejas totalmente diferentes, rompiendo y formando enlaces.',
            feedback_error: 'Se están creando moléculas nuevas (glucosa) a partir de sustancias iniciales distintas (CO2 y agua).'
          },
          {
            id: 'q-3-1-4',
            enunciado: 'Un alumno mezcla dos líquidos transparentes y observa que inmediatamente se forma un polvo blanco sólido que cae al fondo del tubo (precipitado). Esto es una fuerte evidencia de:',
            alternativas: { A: 'Un cambio físico.', B: 'Una reacción química.', C: 'Una disolución.', D: 'Un cambio de fase por frío.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! La aparición repentina de un precipitado sólido a partir de líquidos es evidencia clara de que se sintetizó una molécula nueva insoluble.',
            feedback_error: 'La formación de sólidos insolubles, gases, cambios bruscos de temperatura o color son las clásicas "pistas" visuales de un cambio químico.'
          },
          {
            id: 'q-3-1-5',
            enunciado: 'Cuando dejas un vaso con agua en el refrigerador hasta que se hace hielo, ha ocurrido:',
            alternativas: { A: 'Un cambio físico, porque las moléculas de H2O solo perdieron movimiento y se ordenaron.', B: 'Un cambio químico, porque el hielo sólido tiene propiedades distintas al agua líquida.', C: 'Una reacción de neutralización.', D: 'Un proceso de cristalización química.' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Excelente! El agua sigue siendo H2O, solo que sus moléculas ahora vibran en su sitio en lugar de fluir libremente.',
            feedback_error: 'Los cambios de estado (hielo a agua a vapor) NUNCA alteran la fórmula de la sustancia. Son físicos.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-2',
      title: '2. Ley de Lavoisier (Conservación de la Masa)',
      introduccion: 'Antoine Lavoisier, conocido como el padre de la química moderna, estableció a finales del siglo XVIII la Ley de Conservación de la Masa.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Antoine Lavoisier, conocido como el padre de la química moderna, estableció a finales del siglo XVIII la **Ley de Conservación de la Masa**.

**Postulado Central:**
"En un sistema cerrado, la masa total de los reactantes es exactamente igual a la masa total de los productos."
O de forma más poética: *"La materia no se crea ni se destruye, solo se transforma."*

Esto significa que si inicias una reacción con 100 gramos de reactantes, al finalizar **debes** tener exactamente 100 gramos de productos. Los átomos simplemente se han reorganizado en moléculas distintas, pero ningún átomo ha desaparecido ni ha aparecido de la nada.

**Importancia Práctica:**
Esta ley es el fundamento matemático de toda la química. Sin ella, sería imposible predecir qué cantidad de producto obtendremos al mezclar ciertas sustancias, lo que nos obliga a **balancear** las ecuaciones químicas.

---
**Problema Práctico:** En un recipiente sellado al vacío, se hacen reaccionar $12\\text{ g}$ de Carbono ($C$) con cierta cantidad desconocida de gas Oxígeno ($O_2$). Tras encender una chispa, todo reacciona perfectamente y se obtienen $44\\text{ g}$ de Dióxido de Carbono ($CO_2$) sin que sobre nada. ¿Cuántos gramos de oxígeno reaccionaron?<br><br>
**Análisis y Solución:**<br>
1. **Reacción:** $C + O_2 \\rightarrow CO_2$<br>
2. **Aplicar la Ley de Lavoisier:** La masa total de los reactantes (C y O2) debe igualar a la masa total de los productos (CO2).<br>
3. **Ecuación matemática:** Masa del C + Masa del O2 = Masa del CO2.<br>
   $12\\text{ g} + x\\text{ g} = 44\\text{ g}$<br>
4. **Despejar:** $x = 44 - 12 = 32\\text{ g}$.<br>
**Respuesta:** Reaccionaron exactamente **$32\\text{ g}$ de Oxígeno** para cumplir con la ley de conservación de la masa.`,
      order: 2,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081788/quimica/cap3/sec-3-2.webp',
      datos_claves: [
        'La masa total de los reactantes es igual a la masa total de los productos.',
        'Ningún átomo desaparece ni se crea de la nada durante una reacción.',
        'La Ley de Lavoisier es la razón por la que debemos balancear las ecuaciones químicas.',
        'Se aplica de forma estricta en sistemas cerrados (donde no escapan gases).'
      ],
      test: {
        id: 'test-qui-3-2',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La estequiometría entera se basa en esta ley de conservación de la materia.',
        preguntas: [
          {
            id: 'q-3-2-1',
            enunciado: 'Si en un recipiente cerrado reaccionan completamente 50 gramos de la sustancia A con 30 gramos de la sustancia B, ¿cuál será la masa total de los productos formados?',
            alternativas: { A: '20 gramos.', B: '80 gramos.', C: '50 gramos.', D: 'Es imposible saberlo sin conocer la fórmula química.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Por ley de Lavoisier, la masa se suma: 50 + 30 = 80g.',
            feedback_error: 'La masa se conserva siempre. Solo debes sumar la masa inicial de los reactivos para conocer la masa final de los productos.'
          },
          {
            id: 'q-3-2-2',
            enunciado: 'Al quemar un trozo de madera de 2 kg al aire libre, solo quedan cenizas que pesan 100 gramos. ¿Se violó la Ley de Conservación de la Masa?',
            alternativas: { A: 'Sí, porque el fuego destruyó 1.9 kg de materia.', B: 'No, porque la madera no cumple esta ley al ser orgánica.', C: 'No, porque los 1.9 kg restantes escaparon en forma de gases (CO2 y vapor de agua) a la atmósfera.', D: 'Sí, porque la balanza no estaba calibrada para reacciones al aire libre.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Si atraparas todos los gases producidos por la chimenea y los pesaras junto con las cenizas, sumarían exactamente la madera inicial más el oxígeno consumido.',
            feedback_error: 'La materia NUNCA se destruye. En los sistemas abiertos, la masa que "desaparece" se convirtió en gases invisibles que volaron al aire.'
          },
          {
            id: 'q-3-2-3',
            enunciado: 'En la formación de agua, reaccionan 4 gramos de gas Hidrógeno con 32 gramos de gas Oxígeno para formar Agua líquida. ¿Cuántos gramos de agua se obtienen?',
            alternativas: { A: '28 gramos.', B: '32 gramos.', C: '36 gramos.', D: '4 gramos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! 4g + 32g = 36g de agua. La matemática es así de simple con la ley de conservación.',
            feedback_error: 'Solo debes sumar las masas de los reactantes involucrados en la reacción.'
          },
          {
            id: 'q-3-2-4',
            enunciado: '¿Cuál de las siguientes frases resume mejor el descubrimiento de Lavoisier sobre los átomos en una reacción química?',
            alternativas: { A: 'Los átomos pueden mutar de un elemento a otro.', B: 'En una reacción, el número de átomos de cada elemento se mantiene constante de principio a fin.', C: 'Los átomos pesados se desintegran dejando solo átomos ligeros.', D: 'Los enlaces se rompen y los átomos sobrantes se aniquilan.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Si empiezas con 10 átomos de carbono, terminarás obligatoriamente con 10 átomos de carbono, reordenados en nuevas moléculas.',
            feedback_error: 'La masa se conserva porque los átomos son como piezas de lego indestructibles; solo los cambias de lugar.'
          },
          {
            id: 'q-3-2-5',
            enunciado: 'En una reacción química real: Reactivo X + Reactivo Y -> Producto Z + Energía. Se tienen inicialmente 10g de X y 5g de Y. Al finalizar queda 1g del reactivo X sin reaccionar. ¿Cuántos gramos del Producto Z se formaron?',
            alternativas: { A: '15 gramos.', B: '14 gramos.', C: '16 gramos.', D: '4 gramos.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente cálculo! Reaccionaron 9g de X y 5g de Y. La suma de los que efectivamente reaccionaron (9+5) da los 14g del producto Z.',
            feedback_error: 'Cuidado, un gramo de X no participó. Por ende, solo reaccionaron 9g de X junto a los 5g de Y. 9 + 5 = 14 gramos.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-3',
      title: '3. Balanceo de Ecuaciones por Tanteo',
      introduccion: 'Para que una ecuación química respete la Ley de Lavoisier, debe estar balanceada.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Para que una ecuación química respete la Ley de Lavoisier, debe estar **balanceada**. Es decir, debe haber la misma cantidad de átomos de cada elemento a ambos lados de la flecha.

**Reglas del Balanceo por Tanteo (Ensayo y Error):**
1. **Solo puedes cambiar los Coeficientes Estequiométricos:** Estos son los números grandes que van *delante* de la molécula (ej. **2**$H_2O$). Actúan como multiplicadores de toda la molécula.
2. **Jamás puedes cambiar los subíndices:** Son los números pequeños abajo de las letras (ej. el "2" en $O_2$). Si lo cambias, estás alterando la identidad de la sustancia.
3. **El orden recomendado:** Balancea primero los metales, luego los no metales, luego el Hidrógeno y deja el Oxígeno para el final.

---
**Problema Práctico:** Balancea por tanteo la reacción de combustión del gas propano ($C_3H_8$) con oxígeno ($O_2$) para producir dióxido de carbono ($CO_2$) y agua ($H_2O$). 
Ecuación inicial: $C_3H_8 + O_2 \\rightarrow CO_2 + H_2O$<br><br>
**Análisis y Solución:**<br>
1. **Balancear Carbono (C):** En los reactantes hay 3 (en $C_3H_8$). En los productos hay 1 (en $CO_2$). Ponemos un **3** delante del $CO_2$.<br>
   $C_3H_8 + O_2 \\rightarrow \\mathbf{3}CO_2 + H_2O$<br>
2. **Balancear Hidrógeno (H):** En los reactantes hay 8. En los productos hay 2 (en $H_2O$). Ponemos un **4** delante del agua ($4 \\times 2 = 8$).<br>
   $C_3H_8 + O_2 \\rightarrow 3CO_2 + \\mathbf{4}H_2O$<br>
3. **Balancear Oxígeno (O) al final:** En los productos hay $(3 \\times 2) = 6$ del $CO_2$, más $(4 \\times 1) = 4$ del $H_2O$. Total = 10 oxígenos. En los reactantes tenemos $O_2$, así que ponemos un **5** delante ($5 \\times 2 = 10$).<br>
   $C_3H_8 + \\mathbf{5}O_2 \\rightarrow 3CO_2 + 4H_2O$<br>
**Respuesta:** La ecuación balanceada es **$1 C_3H_8 + 5 O_2 \\rightarrow 3 CO_2 + 4 H_2O$**.`,
      order: 3,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081789/quimica/cap3/sec-3-3.jpg',
      datos_claves: [
        'Solo se pueden modificar los números grandes (coeficientes). ¡Nunca los subíndices!',
        'El coeficiente multiplica a todos los átomos de la molécula (ej. 3 H2O = 6 H y 3 O).',
        'Orden sugerido: 1° Metales, 2° No metales, 3° Hidrógeno, 4° Oxígeno.',
        'Si un coeficiente no está escrito, matemáticamente es un 1.'
      ],
      test: {
        id: 'test-qui-3-3',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Balancear ecuaciones es una prueba de matemáticas simples pero de paciencia y orden.',
        preguntas: [
          {
            id: 'q-3-3-1',
            enunciado: 'En la ecuación de formación del amoníaco: N2 + H2 -> NH3, ¿Cuáles son los coeficientes correctos para balancearla?',
            alternativas: { A: '1, 2, 2', B: '1, 3, 2', C: '2, 3, 1', D: '1, 1, 1' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! N2 + 3 H2 -> 2 NH3. Así tienes 2 nitrógenos y 6 hidrógenos a ambos lados.',
            feedback_error: 'Pon un 2 frente a NH3 para balancear el N2. Eso te dará 6 hidrógenos. Para arreglar eso, pon un 3 frente al H2.'
          },
          {
            id: 'q-3-3-2',
            enunciado: 'Al observar la fórmula "3 H2O", podemos afirmar que en total hay:',
            alternativas: { A: '2 átomos de hidrógeno y 1 de oxígeno.', B: '6 átomos de hidrógeno y 1 de oxígeno.', C: '6 átomos de hidrógeno y 3 de oxígeno.', D: '3 átomos de hidrógeno y 3 de oxígeno.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! El coeficiente 3 multiplica a todo. (3x2)=6 H, y (3x1)=3 O.',
            feedback_error: 'El coeficiente grande multiplica a todos los subíndices de la molécula que le sigue.'
          },
          {
            id: 'q-3-3-3',
            enunciado: 'Un alumno intenta balancear "H2 + O2 -> H2O" escribiendo "H2 + O2 -> H2O2". ¿Por qué esto es químicamente incorrecto?',
            alternativas: { A: 'Porque H2O2 no es matemáticamente posible.', B: 'Porque modificó un subíndice (creando peróxido de hidrógeno en vez de agua), alterando la reacción.', C: 'Porque violó la conservación de la masa.', D: 'Es correcto, la ecuación ahora está balanceada.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! NUNCA se pueden cambiar los subíndices. Convertir H2O en H2O2 cambia el agua por agua oxigenada.',
            feedback_error: 'Los subíndices definen a la sustancia. Si los cambias, cambias de producto. Debía usar coeficientes: 2 H2 + O2 -> 2 H2O.'
          },
          {
            id: 'q-3-3-4',
            enunciado: '¿Cuál es el primer paso recomendado por el método de tanteo para balancear: Fe + O2 -> Fe2O3?',
            alternativas: { A: 'Colocar un 2 frente al O2.', B: 'Balancear primero los oxígenos.', C: 'Balancear primero el metal (Hierro), colocando un 2 frente al Fe.', D: 'Colocar un 3 frente al Hierro.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Bien! Siempre es mejor empezar equilibrando los metales (Fe). 2 Fe + O2 -> Fe2O3 (y luego ajustar oxígenos con fracciones o multiplicando todo por 2).',
            feedback_error: 'El método recomienda siempre atacar primero a los metales (Fe), dejando los oxígenos para el final.'
          },
          {
            id: 'q-3-3-5',
            enunciado: 'Balancea la combustión del metano: CH4 + O2 -> CO2 + H2O. ¿Cuál es la suma total de los coeficientes estequiométricos mínimos enteros?',
            alternativas: { A: '4', B: '5', C: '6', D: '7' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Ecuación balanceada: 1 CH4 + 2 O2 -> 1 CO2 + 2 H2O. Suma = 1 + 2 + 1 + 2 = 6.',
            feedback_error: 'Balancea paso a paso: Carbono ya está (1 y 1). Hidrógenos: hay 4 a la izq y 2 a la der (pon un 2 al H2O). Oxígenos: hay 4 a la der (2 del CO2 + 2 del H2O), pon un 2 al O2. Queda: 1 + 2 -> 1 + 2 (suma 6).'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-4',
      title: '4. El Concepto del Mol y el Número de Avogadro',
      introduccion: 'En química, las cantidades de átomos o moléculas son tan absurdamente inmensas que es imposible contarlas por unidades.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En química, las cantidades de átomos o moléculas son tan absurdamente inmensas que es imposible contarlas por unidades. Por eso, usamos una "docena" gigante llamada **Mol**.

**El Mol:**
Es la unidad fundamental en química para medir la cantidad de sustancia. 
Un mol equivale siempre al **Número de Avogadro ($N_A$)**, que es $6.022 \\times 10^{23}$ partículas (átomos, moléculas, iones, etc.).
- 1 docena de huevos = 12 huevos.
- 1 mol de átomos = $6.022 \\times 10^{23}$ átomos.
- 1 mol de moléculas de agua = $6.022 \\times 10^{23}$ moléculas de agua.

El Número de Avogadro es el "puente" mágico que conecta el mundo microscópico (medido en u.m.a) con el mundo macroscópico (medido en gramos). Gracias a él, el peso de un solo átomo en u.m.a. es exactamente igual al peso de un mol entero de esos átomos en gramos.

---
**Problema Práctico:** Tienes exactamente 2 moles de monedas de 100 pesos. Si pudieras repartirlas equitativamente entre los 8.000 millones ($8 \\times 10^9$) de habitantes del planeta Tierra, ¿es cierto o falso que cada habitante sería multimillonario? Justifica matemáticamente.<br><br>
**Análisis y Solución:**<br>
1. **Calcular total de monedas:** 2 moles = $2 \\times (6.022 \\times 10^{23}) \\approx 12.04 \\times 10^{23}$ monedas.<br>
2. **Dinero total:** Cada moneda vale 100 pesos ($10^2$). Dinero total $\\approx 12.04 \\times 10^{25}$ pesos.<br>
3. **Repartir:** Dividimos el dinero entre la población: $(12.04 \\times 10^{25}) / (8 \\times 10^9) = 1.5 \\times 10^{16}$ pesos por persona.<br>
4. **Conclusión:** $1.5 \\times 10^{16}$ son $15.000.000.000.000.000$ de pesos (15 mil billones).
**Respuesta:** Es **cierto**. Cada habitante sería absurdamente multimillonario. El concepto del mol involucra cantidades inimaginablemente grandes que solo aplican en la vida real a partículas microscópicas.`,
      order: 4,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081790/quimica/cap3/sec-3-4.jpg',
      datos_claves: [
        '1 Mol equivale a una cantidad fija: 6.022 x 10^23 partículas (Número de Avogadro).',
        'El mol actúa como puente traductor entre el mundo atómico y el de laboratorio.',
        'Los coeficientes de una ecuación balanceada se leen en moles (ej. 2H2 + O2 -> 2H2O son 2 moles de H2).',
        'Un mol es un número, no una masa. 1 mol de plomo pesa mucho más que 1 mol de plumas.'
      ],
      test: {
        id: 'test-qui-3-4',
        materiaId: 'ciencias-quimica',
        contexto_base: 'El mol es simplemente una unidad de conteo extrema para lidiar con el tamaño ínfimo de los átomos.',
        preguntas: [
          {
            id: 'q-3-4-1',
            enunciado: '¿Cuántas moléculas individuales de H2O hay en exactamente 1 mol de agua?',
            alternativas: { A: 'Mil millones.', B: '18.', C: '6.022 × 10^23.', D: 'Depende de la temperatura del agua.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! 1 mol siempre representa la cantidad de Avogadro (6.022 x 10^23).',
            feedback_error: 'La palabra "Mol" significa siempre "6.022 × 10^23 entidades", sin importar de qué sustancia se trate.'
          },
          {
            id: 'q-3-4-2',
            enunciado: 'Si tienes medio mol (0.5 moles) de átomos de Sodio, ¿cuántos átomos tienes aproximadamente?',
            alternativas: { A: '3.011 × 10^23', B: '6.022 × 10^23', C: '1.204 × 10^24', D: 'Ninguna de las anteriores' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Muy bien! Si un mol es ~6x10^23, medio mol es la mitad: ~3x10^23.',
            feedback_error: 'Simplemente divide el Número de Avogadro por la mitad (0.5).'
          },
          {
            id: 'q-3-4-3',
            enunciado: 'En 1 mol de gas Dióxido de Carbono (CO2), ¿cuántos moles de átomos de oxígeno hay en total?',
            alternativas: { A: '1 mol de átomos de oxígeno.', B: '2 moles de átomos de oxígeno.', C: '3 moles de átomos de oxígeno.', D: '6.022 × 10^23 átomos de oxígeno.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Como cada molécula de CO2 tiene 2 oxígenos (subíndice 2), en 1 mol de moléculas habrá 2 moles de átomos de oxígeno.',
            feedback_error: 'Fíjate en el subíndice. Por cada 1 molécula entera (1 mol), tienes 2 átomos de oxígeno integrados (2 moles).'
          },
          {
            id: 'q-3-4-4',
            enunciado: 'El número de Avogadro se define como la cantidad exacta de átomos que existen en:',
            alternativas: { A: '1 gramo de hidrógeno.', B: '100 gramos de agua.', C: '12 gramos del isótopo carbono-12.', D: '1 kilogramo de oxígeno.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Científicamente, 1 mol se estandarizó como el número de átomos que hay en exactamente 12 gramos puros de Carbono-12.',
            feedback_error: 'Es una definición histórica: se usó el isótopo más estable del carbono (el C-12) para calibrar la balanza mundial.'
          },
          {
            id: 'q-3-4-5',
            enunciado: '¿Por qué los químicos inventaron y utilizan el concepto de Mol?',
            alternativas: { A: 'Para complicar los cálculos matemáticos.', B: 'Porque permite conectar la cantidad de átomos (microscópico) con la masa medible en gramos en una balanza (macroscópico).', C: 'Para medir el volumen de los gases a alta presión.', D: 'Para contar el número de electrones de valencia.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! El mol es el puente mágico que permite "pesar" átomos masivamente en un laboratorio real.',
            feedback_error: 'No se puede pesar 1 átomo. Pero sí se puede pesar 1 mol de átomos en una balanza común.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-5',
      title: '5. Masa Molar: Cálculos Fundamentales',
      introduccion: 'La Masa Molar (MM) es la masa que pesa exactamente 1 Mol de una sustancia.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La **Masa Molar (MM)** es la masa que pesa exactamente **1 Mol** de una sustancia. Se mide en gramos por mol ($g/mol$).

**¿Cómo se calcula?**
Es sorprendentemente fácil. Solo debes mirar la Tabla Periódica, buscar la "Masa Atómica" de cada elemento, multiplicarla por la cantidad de veces que aparece en la fórmula, y sumar todo. 
Ejemplo del Oxígeno ($O_2$): La masa de un O es $16$. Como hay dos, la Masa Molar del $O_2 = 16 \\times 2 = 32\\text{ g/mol}$.

**Fórmula Clave:**
Para pasar de gramos a moles (o viceversa), utilizamos el "triángulo de la estequiometría":
$n = \\frac{m}{MM}$
Donde:
- **$n$**: Número de moles.
- **$m$**: Masa en gramos (pesada en la balanza).
- **$MM$**: Masa Molar en $g/mol$ (calculada de la tabla).

---
**Problema Práctico:** Tienes en el laboratorio un vaso que contiene $90\\text{ g}$ de agua líquida ($H_2O$). ¿Cuántos moles de moléculas de agua hay dentro del vaso? (Masas atómicas: $H=1$, $O=16$).<br><br>
**Análisis y Solución:**<br>
1. **Calcular la Masa Molar (MM) del $H_2O$:**<br>
   - Hidrógeno: 2 átomos $\\times 1\\text{ g/mol} = 2\\text{ g/mol}$<br>
   - Oxígeno: 1 átomo $\\times 16\\text{ g/mol} = 16\\text{ g/mol}$<br>
   - MM total = $2 + 16 = 18\\text{ g/mol}$. Esto significa que 1 mol de agua pesa 18 gramos.<br>
2. **Calcular los moles (n):** Usamos la fórmula $n = m / MM$.<br>
   - $n = 90\\text{ g} / 18\\text{ g/mol}$<br>
   - $n = 5\\text{ moles}$<br>
**Respuesta:** En 90 gramos de agua hay exactamente **5 moles** de moléculas de agua (es decir, $5 \\times 6.022 \\times 10^{23}$ moléculas).`,
      order: 5,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081791/quimica/cap3/sec-3-5.png',
      datos_claves: [
        'Masa Molar (g/mol): Se calcula sumando las masas atómicas de la Tabla Periódica.',
        'Fórmula vital: Moles (n) = Masa en gramos (m) / Masa Molar (MM).',
        'Si tienes gramos y necesitas moles, DIVIDES por la Masa Molar.',
        'Si tienes moles y necesitas gramos, MULTIPLICAS por la Masa Molar.'
      ],
      test: {
        id: 'test-qui-3-5',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Para hacer cálculos estequiométricos, TODOS los datos en gramos deben convertirse primero a moles.',
        preguntas: [
          {
            id: 'q-3-5-1',
            enunciado: 'Calcula la Masa Molar del Dióxido de Carbono (CO2), sabiendo que el C=12 g/mol y el O=16 g/mol.',
            alternativas: { A: '28 g/mol', B: '32 g/mol', C: '44 g/mol', D: '56 g/mol' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! C (12) + O2 (16x2 = 32). Total = 44 g/mol.',
            feedback_error: 'Suma las partes: Tienes 1 carbono (12) y 2 oxígenos (16 x 2 = 32). 12 + 32 = 44.'
          },
          {
            id: 'q-3-5-2',
            enunciado: 'Si tienes 36 gramos de agua (H2O), y sabes que su masa molar es 18 g/mol. ¿Cuántos moles de agua tienes en total?',
            alternativas: { A: '1 mol', B: '2 moles', C: '3 moles', D: '0.5 moles' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Aplicando la fórmula: n = m / MM -> n = 36 / 18 = 2 moles.',
            feedback_error: 'Usa la fórmula: moles = (masa en gramos) / (masa molar). Divide 36 entre 18.'
          },
          {
            id: 'q-3-5-3',
            enunciado: 'Un experimento requiere que uses 0.5 moles de Glucosa (C6H12O6). Si la Masa Molar de la glucosa es 180 g/mol, ¿cuántos gramos debes pesar en la balanza?',
            alternativas: { A: '180 g', B: '360 g', C: '90 g', D: '45 g' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! Si despejas la masa: m = n x MM -> m = 0.5 x 180 = 90 gramos.',
            feedback_error: 'Si 1 mol pesa 180 gramos, medio mol (0.5) pesará la mitad.'
          },
          {
            id: 'q-3-5-4',
            enunciado: 'El gas Amoníaco tiene la fórmula NH3 (N=14, H=1). ¿Cuál es la masa contenida en exactamente 3 moles de amoníaco?',
            alternativas: { A: '17 gramos', B: '34 gramos', C: '51 gramos', D: '68 gramos' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! MM del NH3 = 14 + 3 = 17 g/mol. Si tienes 3 moles: 3 x 17 = 51 gramos.',
            feedback_error: 'Primero saca la masa de 1 mol (14 + 3 = 17). Luego multiplícalo por los 3 moles solicitados.'
          },
          {
            id: 'q-3-5-5',
            enunciado: 'A un paciente se le inyectan 5.85 gramos de Sal (NaCl). Si la Masa Molar del NaCl es 58.5 g/mol, se le inyectaron:',
            alternativas: { A: '1 mol', B: '0.1 moles', C: '0.01 moles', D: '10 moles' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! n = 5.85 / 58.5 = 0.1 moles.',
            feedback_error: 'Realiza la división: n = 5.85 g / 58.5 g/mol. Cuidado con los decimales.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-6',
      title: '6. Estequiometría: Mol-Mol y Masa-Masa',
      introduccion: 'La Estequiometría es la matemática de la química.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La **Estequiometría** es la matemática de la química. Nos permite calcular, usando la receta de cocina (la ecuación balanceada), cuántos reactantes necesitamos para cocinar cierta cantidad de producto.

**El paso a paso (El Método Universal):**
1. **Asegúrate de que la ecuación esté BALANCEADA.** (Si no, todo estará mal).
2. Los números grandes (coeficientes) te dicen la relación en **moles** (¡jamás en gramos!). 
   Ej: $N_2 + 3H_2 \\rightarrow 2NH_3$ significa que por cada 1 mol de $N_2$, necesito 3 moles de $H_2$ para generar 2 moles de $NH_3$.
3. Si el problema te da gramos, **convierte los gramos a moles** (usando $n = m/MM$).
4. Usa una **regla de tres simple** con los coeficientes de la ecuación para hallar los moles de la sustancia que te piden.
5. Si el problema te pide la respuesta en gramos, convierte los moles encontrados a gramos multiplicando por su propia $MM$.

---
**Problema Práctico:** Dada la reacción ya balanceada de síntesis de amoníaco: $N_2 + 3H_2 \\rightarrow 2NH_3$. Si deseas producir exactamente 10 moles de amoníaco ($NH_3$), ¿cuántos gramos de gas Hidrógeno ($H_2$) vas a necesitar? (Masa atómica H = 1).<br><br>
**Análisis y Solución:**<br>
1. **Relación Molar (del balanceo):** La ecuación dice que 3 moles de $H_2$ producen 2 moles de $NH_3$.<br>
2. **Regla de Tres (Mol-Mol):**
   $3\\text{ moles } H_2 \\longrightarrow 2\\text{ moles } NH_3$<br>
   $x\\text{ moles } H_2 \\longrightarrow 10\\text{ moles } NH_3$<br>
   Despejando: $x = (3 \\times 10) / 2 = 15\\text{ moles de } H_2$.<br>
3. **Convertir Moles a Gramos:** Necesitamos 15 moles de $H_2$. La Masa Molar del $H_2$ es $2 \\times 1 = 2\\text{ g/mol}$.<br>
   Masa = Moles $\\times$ Masa Molar = $15 \\times 2 = 30\\text{ g}$.<br>
**Respuesta:** Necesitarás hacer reaccionar **30 gramos de Hidrógeno gaseoso**.`,
      order: 6,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081793/quimica/cap3/sec-3-6.jpg',
      datos_claves: [
        'La ecuación química SIEMPRE se lee en moles (volúmenes o moléculas), jamás en gramos.',
        'Para hacer la Regla de 3, todos tus datos iniciales deben estar convertidos a moles.',
        'El método puente es: Gramos A -> Moles A -> Moles B -> Gramos B.',
        'Revisa siempre si la ecuación te la entregan balanceada o debes balancearla tú primero.'
      ],
      test: {
        id: 'test-qui-3-6',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Dominar la regla de tres usando los coeficientes es la habilidad reina de la prueba de ciencias.',
        preguntas: [
          {
            id: 'q-3-6-1',
            enunciado: 'En la ecuación balanceada N2 + 3 H2 -> 2 NH3, ¿Cuántos moles de amoníaco (NH3) se formarán si se consumen exactamente 6 moles de gas Hidrógeno (H2)?',
            alternativas: { A: '2 moles', B: '3 moles', C: '4 moles', D: '6 moles' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! La receta dice que 3 H2 dan 2 NH3. Si tienes el doble de reactivo (6), tendrás el doble de producto (4).',
            feedback_error: 'Usa regla de 3: Si 3 H2 -> 2 NH3, entonces 6 H2 -> X NH3. X = (6x2)/3 = 4 moles.'
          },
          {
            id: 'q-3-6-2',
            enunciado: '¿Por qué no podemos usar directamente los coeficientes de la ecuación química balanceada para hacer una regla de 3 con datos en gramos?',
            alternativas: { A: 'Porque los coeficientes estequiométricos representan número de moléculas (moles), no masas, y cada sustancia pesa distinto.', B: 'Porque la ley de conservación de la masa lo prohíbe.', C: 'Porque las balanzas miden volumen, no gramos.', D: 'Sí se puede, siempre dan el mismo resultado.' },
            respuesta_correcta: 'A',
            feedback_acierto: '¡Muy bien! Un mol de H2 pesa 2g y un mol de O2 pesa 32g. Los coeficientes dicen cuántos "paquetes" hay, pero no cuánto pesan.',
            feedback_error: 'Los coeficientes indican "cantidades de partículas". Como un átomo de plomo es mucho más gordo que uno de hidrógeno, no se puede hacer matemática directa con los gramos.'
          },
          {
            id: 'q-3-6-3',
            enunciado: 'En la reacción CH4 + 2 O2 -> CO2 + 2 H2O. Tienes 16g de Metano (CH4), que resulta ser exactamente 1 mol. Según la ecuación, ¿Cuántos moles de O2 necesitas para quemarlo completo?',
            alternativas: { A: '1 mol', B: '2 moles', C: '3 moles', D: '4 moles' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! El coeficiente del O2 en la ecuación es 2. Por cada 1 CH4 necesitas 2 O2.',
            feedback_error: 'Mira la ecuación balanceada. Por cada 1 CH4, el número grande frente al O2 es un 2. Por ende, necesitas 2 moles de oxígeno.'
          },
          {
            id: 'q-3-6-4',
            enunciado: 'Al producir 5 moles de CO2, según la ecuación 2 CO + O2 -> 2 CO2, ¿cuántos moles del reactivo monóxido de carbono (CO) se consumieron?',
            alternativas: { A: '2.5 moles', B: '5 moles', C: '10 moles', D: '2 moles' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! La relación CO : CO2 es 2 a 2 (es decir, relación 1:1). Si produces 5, necesitas consumir 5.',
            feedback_error: 'La proporción de los coeficientes entre el CO y el CO2 es de 2 a 2. Es decir, son iguales. Si se formaron 5, tuviste que usar 5.'
          },
          {
            id: 'q-3-6-5',
            enunciado: 'Si el primer paso de un problema masa-masa es pasar los gramos iniciales a moles, ¿cuál es el paso final indispensable?',
            alternativas: { A: 'Adivinar los gramos.', B: 'Dejar el resultado final en moles porque es más elegante.', C: 'Transformar los moles obtenidos del producto de vuelta a gramos multiplicando por su masa molar.', D: 'Dividir los moles por el número de Avogadro.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! En la vida real nadie te pide "3 moles de paracetamol", te piden 500mg. Siempre hay que devolver el dato a masa.',
            feedback_error: 'El objetivo de la reacción masa-masa es entregar la respuesta en masa. El paso 3 siempre es: masa = moles calculados x Masa Molar.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-3-7',
      title: '7. Reactivo Limitante y Reactivo en Exceso',
      introduccion: 'En el mundo real, los químicos raramente mezclan los reactantes en las cantidades exactas que pide la ecuación.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En el mundo real, los químicos raramente mezclan los reactantes en las cantidades exactas que pide la ecuación. Siempre sobra de uno y falta del otro.

- **Reactivo Limitante (RL):** Es el ingrediente que **se agota primero**. Controla y *limita* la reacción. Cuando se acaba, la reacción se detiene, sin importar cuánto quede de los demás. ¡Todos los cálculos de productos se deben hacer usando solo este reactivo!
- **Reactivo en Exceso (RE):** Es el ingrediente que **sobra** al final de la reacción porque no tuvo con quién reaccionar.

**Analogía clásica del Hot-Dog:**
La ecuación para hacer un hot-dog es: 1 Pan + 1 Salchicha $\\rightarrow$ 1 Hot-dog.
Si vas al supermercado y compras 10 Panes y 8 Salchichas, ¿cuántos Hot-dogs puedes armar?
Solo puedes armar 8. Las Salchichas son tu **Reactivo Limitante** (se acaban primero). Sobrarán 2 Panes (tu **Reactivo en Exceso**).

---
**Problema Práctico:** Para la reacción $2H_2 + O_2 \\rightarrow 2H_2O$. En un recipiente encierras 10 moles de gas $H_2$ y 6 moles de gas $O_2$ y aplicas una chispa. ¿Cuál es el Reactivo Limitante, cuántos moles de agua se forman y cuántos moles de reactivo en exceso sobran?<br><br>
**Análisis y Solución:**<br>
1. **Buscar el Reactivo Limitante:** Dividimos los moles que tenemos por el coeficiente de la ecuación de cada uno.
   - Para $H_2$: $10 / 2 = 5$
   - Para $O_2$: $6 / 1 = 6$
   El número menor es 5, que corresponde al $H_2$. **El Reactivo Limitante es el $H_2$**.<br>
2. **Calcular producto ($H_2O$):** Usamos SOLO el limitante ($H_2$) para la regla de 3. 
   Ecuación: $2\\text{ moles } H_2 \\rightarrow 2\\text{ moles } H_2O$. 
   Si usamos 10 moles de $H_2$, produciremos **10 moles de agua**.<br>
3. **Calcular el Exceso ($O_2$ que sobra):** Ecuación dice que 2 moles de $H_2$ consumen 1 mol de $O_2$ (mitad). Así que 10 moles de $H_2$ consumieron 5 moles de $O_2$. 
   Teníamos 6 moles de $O_2$ iniciales. $6 - 5 = $ **1 mol de $O_2$ sobrante**.<br>
**Respuesta:** El Limitante es $H_2$. Se formarán 10 moles de agua y sobrará 1 mol de $O_2$.`,
      order: 7,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081794/quimica/cap3/sec-3-7.jpg',
      datos_claves: [
        'El Reactivo Limitante se consume totalmente y dicta cuánta cantidad de producto se forma.',
        'El Reactivo en Exceso sobra intacto en el recipiente al terminar la reacción.',
        'Para hallar el Limitante: Divide los moles que tienes entre el coeficiente de la ecuación. El menor gana.',
        '¡NUNCA uses el Reactivo en Exceso para predecir cuánto producto obtendrás!'
      ],
      test: {
        id: 'test-qui-3-7',
        materiaId: 'ciencias-quimica',
        contexto_base: 'En las industrias farmacéuticas o químicas, el reactivo más caro siempre se pone como limitante para no desperdiciarlo.',
        preguntas: [
          {
            id: 'q-3-7-1',
            enunciado: '¿Cuál es la función principal del reactivo limitante en un cálculo estequiométrico?',
            alternativas: { A: 'Acelerar la velocidad de la reacción.', B: 'Determinar la cantidad máxima de producto que se puede formar.', C: 'Actuar como reactivo en exceso para asegurar la pureza.', D: 'Absorber el calor de la reacción.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Como es el primero en agotarse, él "corta" la producción. No puedes generar más producto que el que el limitante te permite.',
            feedback_error: 'Piensa en los sándwiches: la cantidad de queso (que se agota) determina exactamente cuántos sándwiches lograrás hacer.'
          },
          {
            id: 'q-3-7-2',
            enunciado: 'En la reacción 2 H2 + O2 -> 2 H2O, se introducen a un reactor cerrado 2 moles de H2 y 2 moles de O2. ¿Quién es el reactivo limitante?',
            alternativas: { A: 'El O2.', B: 'El H2.', C: 'Ninguno, ambos se consumen completamente.', D: 'El H2O.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! (2 moles H2 / 2 coeficiente) = 1. (2 moles O2 / 1 coeficiente) = 2. El número menor es 1, por lo que el H2 se agota primero.',
            feedback_error: 'Aplica el método: divide la cantidad que tienes por lo que pide la receta (coeficiente). H2 -> 2/2 = 1. O2 -> 2/1 = 2. El número menor gana.'
          },
          {
            id: 'q-3-7-3',
            enunciado: 'En el mismo escenario anterior (mezclas 2 moles de H2 y 2 moles de O2), cuando la reacción termine y se detenga, ¿Qué habrá en el interior del reactor cerrado?',
            alternativas: { A: 'Solo moléculas de H2O.', B: 'Moléculas de H2O y el O2 que sobró (exceso).', C: 'Moléculas de H2O y el H2 que sobró (exceso).', D: 'Solo reactivos, porque no hubo chispa.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! El H2 se gastó por completo formando el agua (H2O). Pero te sobró 1 mol de O2 (reactivo en exceso) que quedará flotando ahí adentro sin hacer nada.',
            feedback_error: 'Al finalizar una reacción con exceso, el recipiente contendrá a los productos fabricados MÁS todo el reactivo en exceso que sobró.'
          },
          {
            id: 'q-3-7-4',
            enunciado: '¿Es posible que en un experimento no exista ni reactivo limitante ni reactivo en exceso?',
            alternativas: { A: 'No, siempre tiene que haber uno que sobre.', B: 'Sí, cuando se mezclan al azar siempre ocurre eso.', C: 'Sí, si los reactivos se introducen exactamente en las proporciones estequiométricas dictadas por la ecuación.', D: 'Solo ocurre en cambios físicos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Si pones 4 panes y 2 quesos perfectos, harás 2 sándwiches y no te sobrará absolutamente nada. Ambos se acaban al mismo tiempo.',
            feedback_error: 'Es matemáticamente posible (se llaman cantidades estequiométricas), aunque es raro que pase al azar, requiere medición perfecta previa.'
          },
          {
            id: 'q-3-7-5',
            enunciado: 'Si detectaste que el Aluminio es tu Reactivo Limitante para producir Sulfato de Aluminio. ¿Qué valor debes usar para la regla de 3 que calcula cuánto producto obtendrás?',
            alternativas: { A: 'Los moles iniciales del ácido (Reactivo en exceso).', B: 'Los moles iniciales del Aluminio (Reactivo limitante).', C: 'La suma de ambos reactivos.', D: 'El coeficiente del producto.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Regla de oro: TODOS los cálculos de productos se hacen única y exclusivamente basándose en el reactivo limitante, porque el otro sobra y engaña los números.',
            feedback_error: 'El exceso siempre "engaña". Si usas sus moles, la matemática creerá que reaccionaron todos (falso) y te dará un resultado exagerado de producto.'
          }
        ]
      }
    }
  ]
};
