export const cap2 = {
  id: 'cap-qui-2',
  materiaId: 'ciencias-quimica',
  title: 'Química Orgánica: Fundamentos',
  introduccion: 'Descubre la química del carbono, las cadenas que forma y la nomenclatura de los compuestos de la vida. Esta es la base química de la biología.',
  order: 2,
  imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081773/quimica/cap2/cap2_new.jpg',
  secciones: [
    {
      id: 'sec-qui-2-1',
      title: '1. Tetravalencia e Hibridación del Carbono',
      introduccion: 'La química orgánica estudia los compuestos formados por Carbono (con excepciones como CO2).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `La química orgánica estudia los compuestos formados por Carbono (con excepciones como CO2). El átomo de Carbono tiene 6 electrones; en su capa de valencia posee 4 electrones libres para enlazar. A esta capacidad única de formar exactamente **4 enlaces covalentes** simultáneos se le llama **Tetravalencia**.

Para formar enlaces en distintas geometrías, los orbitales del carbono se mezclan en un proceso llamado **Hibridación**:
- **Hibridación sp3:** Forma 4 enlaces simples. Su forma geométrica es un **Tetraedro** (como una pirámide triangular), con ángulos de 109.5°.
- **Hibridación sp2:** Forma 1 doble enlace y 2 simples. Su forma es **Trigonal Plana**, con ángulos de 120°.
- **Hibridación sp:** Forma 1 triple enlace y 1 simple (o 2 dobles). Su forma es **Lineal**, con ángulo de 180°.

---
**Problema Práctico:** Observa la molécula del gas eteno ($CH_2=CH_2$). ¿Cuál es la hibridación y la geometría de cada átomo de carbono en esta molécula?<br><br>
**Análisis y Solución:**<br>
1. Identificamos los enlaces alrededor de uno de los carbonos: está unido a dos hidrógenos por enlaces simples, y al otro carbono por un enlace doble.<br>
2. Según la teoría, cuando un carbono forma **1 enlace doble y 2 enlaces simples**, ha utilizado un orbital $s$ y dos orbitales $p$, mezclándolos para formar la hibridación **$sp^2$**.<br>
3. La geometría asociada a la hibridación $sp^2$ es siempre **Trigonal Plana** con ángulos de 120°.<br>
**Respuesta:** Ambos átomos de carbono presentan hibridación **$sp^2$** y geometría trigonal plana.`,
      order: 1,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081782/quimica/cap2/sec-2-1.webp',
      datos_claves: [
        'El Carbono es tetravalente: SIEMPRE debe estar rodeado exactamente por 4 enlaces.',
        'Hibridación sp3: 4 simples (Tetraédrica, 109.5°).',
        'Hibridación sp2: 1 doble, 2 simples (Trigonal plana, 120°).',
        'Hibridación sp: 1 triple y 1 simple o 2 dobles (Lineal, 180°).'
      ],
      test: {
        id: 'test-qui-2-1',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La versatilidad del carbono para hibridarse es lo que permite la existencia de millones de moléculas orgánicas.',
        preguntas: [
          {
            id: 'q-2-1-1',
            enunciado: 'Un átomo de carbono que forma cuatro enlaces simples con cuatro átomos de hidrógeno (Metano, CH4) presenta hibridación:',
            alternativas: { A: 'sp', B: 'sp2', C: 'sp3', D: 'sp4' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Cuatro enlaces simples siempre corresponden a una hibridación sp3.',
            feedback_error: 'Recuerda: 4 enlaces simples = sp3; 1 enlace doble = sp2; 1 enlace triple = sp.'
          },
          {
            id: 'q-2-1-2',
            enunciado: 'La geometría molecular asociada a la hibridación sp2 del carbono es:',
            alternativas: { A: 'Lineal', B: 'Plana trigonal', C: 'Tetraédrica', D: 'Octaédrica' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! En la hibridación sp2 (un enlace doble y dos simples), los enlaces se alejan lo máximo posible en un plano, formando 120°.',
            feedback_error: 'Piensa en 3 zonas de densidad electrónica (1 enlace doble y 2 simples). La figura que las aleja más es un triángulo equilátero plano.'
          },
          {
            id: 'q-2-1-3',
            enunciado: '¿Cuál es la característica fundamental que define la propiedad de la tetravalencia del carbono?',
            alternativas: { A: 'Que posee 4 protones en su núcleo.', B: 'Que forma exactamente 4 enlaces iónicos.', C: 'Que su número atómico es 4.', D: 'Que tiene la capacidad de compartir 4 electrones de valencia formando 4 enlaces covalentes.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Exacto! Tetra (cuatro) y valencia (electrones de enlace). El carbono siempre forma 4 enlaces.',
            feedback_error: 'La tetravalencia se refiere a su capacidad de enlace (electrones externos), no a su núcleo ni a enlaces iónicos.'
          },
          {
            id: 'q-2-1-4',
            enunciado: 'En la molécula de etino (acetileno), los carbonos están unidos por un enlace triple (H-C≡C-H). ¿Cuál es la hibridación y el ángulo de enlace de los carbonos?',
            alternativas: { A: 'sp3 y 109.5°', B: 'sp2 y 120°', C: 'sp y 180°', D: 'sp y 90°' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! El enlace triple requiere hibridación sp, la cual tiene una geometría lineal (180°).',
            feedback_error: 'Un enlace triple significa que solo quedan 2 zonas de electrones (el enlace triple y el simple hacia el H). Para alejarlas al máximo, se alinean a 180° (sp).'
          },
          {
            id: 'q-2-1-5',
            enunciado: 'Un alumno dibuja una estructura donde un carbono tiene 5 enlaces a su alrededor. Según las propiedades del carbono, esto es:',
            alternativas: { A: 'Posible en condiciones de alta presión.', B: 'Correcto si se trata de un ion.', C: 'Imposible, viola la tetravalencia.', D: 'Correcto en los alcanos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Una regla de oro: el carbono JAMÁS puede tener más (ni menos) de 4 enlaces.',
            feedback_error: 'El carbono no tiene orbitales d para expandir su octeto. Siempre, absolutamente siempre, debe tener 4 enlaces.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-2',
      title: '2. Tipos de Enlaces: Sigma y Pi',
      introduccion: 'En los compuestos orgánicos, los átomos se unen mediante enlaces covalentes (compartiendo pares de electrones).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En los compuestos orgánicos, los átomos se unen mediante enlaces covalentes (compartiendo pares de electrones). Dependiendo de cómo se solapan u orbitan estos electrones, clasificamos los enlaces en dos tipos: **Sigma ($\\sigma$)** y **Pi ($\\pi$)**.

**1. Enlace Sigma ($\\sigma$):**
- Es el enlace covalente **más fuerte y estable**.
- Se forma por el solapamiento frontal de los orbitales atómicos.
- El primer enlace que se forma entre dos átomos SIEMPRE es un enlace sigma. Esto incluye a **todos los enlaces simples**.

**2. Enlace Pi ($\\pi$):**
- Es un enlace **más débil** que el sigma.
- Se forma por el solapamiento lateral de los orbitales $p$ que no se hibridaron.
- Aparecen únicamente cuando hay enlaces dobles o triples.

**Resumen clave de las combinaciones:**
- **Enlace Simple (-):** 1 enlace $\\sigma$
- **Enlace Doble (=):** 1 enlace $\\sigma$ + 1 enlace $\\pi$
- **Enlace Triple ($\\equiv$):** 1 enlace $\\sigma$ + 2 enlaces $\\pi$

---
**Problema Práctico:** Analiza la molécula de Etino (Acetileno), cuya fórmula estructural es $H-C\\equiv C-H$. ¿Cuántos enlaces sigma ($\\sigma$) y pi ($\\pi$) tiene en total la molécula?<br><br>
**Análisis y Solución:**<br>
1. Revisamos los enlaces $C-H$: Hay 2 enlaces simples. Cada enlace simple es un enlace $\\sigma$. (Llevamos 2 $\\sigma$).<br>
2. Revisamos el enlace $C\\equiv C$: Es un triple enlace entre los carbonos. Según el resumen, un triple enlace se compone siempre de **1 enlace $\\sigma$ y 2 enlaces $\\pi$**.<br>
3. Sumamos: $(2 \\times \\sigma) + (1 \\times \\sigma) = 3 \\sigma$. Y tenemos $2 \\pi$.<br>
**Respuesta:** La molécula tiene en total **3 enlaces sigma ($\\sigma$) y 2 enlaces pi ($\\pi$)**.`,
      order: 2,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081782/quimica/cap2/sec-2-2.png',
      datos_claves: [
        'Todo enlace simple es Sigma (σ). Es frontal y muy fuerte.',
        'Un enlace doble tiene 1 Sigma (σ) y 1 Pi (π).',
        'Un enlace triple tiene 1 Sigma (σ) y 2 Pi (π).',
        'Los enlaces Pi (π) restringen la rotación de la molécula, dándole rigidez.'
      ],
      test: {
        id: 'test-qui-2-2',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La fuerza y reactividad de una molécula orgánica depende de cuántos enlaces sigma y pi posea.',
        preguntas: [
          {
            id: 'q-2-2-1',
            enunciado: '¿Cuántos enlaces sigma y pi hay respectivamente en un enlace doble carbono-carbono (C=C)?',
            alternativas: { A: '2 sigma y 0 pi.', B: '1 sigma y 1 pi.', C: '0 sigma y 2 pi.', D: '1 sigma y 2 pi.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! El primer enlace siempre es sigma frontal, y el segundo es pi lateral.',
            feedback_error: 'Un enlace doble no puede tener dos sigmas, ya que no hay espacio para dos superposiciones frontales. El primero es sigma y el adicional es pi.'
          },
          {
            id: 'q-2-2-2',
            enunciado: 'De los dos tipos de enlace, ¿cuál es el más fuerte y por qué?',
            alternativas: { A: 'El enlace pi, porque es paralelo.', B: 'El enlace pi, porque restringe la rotación.', C: 'El enlace sigma, porque su superposición es frontal y directa.', D: 'Ambos tienen exactamente la misma fuerza.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! La superposición frontal del enlace sigma es mucho más íntima y fuerte que la lateral del pi.',
            feedback_error: 'El enlace pi es débil porque sus orbitales solo se tocan por los lados. El enlace sigma penetra directamente.'
          },
          {
            id: 'q-2-2-3',
            enunciado: 'En la molécula de Nitrógeno (N≡N), que posee un enlace triple, encontraremos:',
            alternativas: { A: '3 enlaces sigma.', B: '3 enlaces pi.', C: '2 enlaces sigma y 1 pi.', D: '1 enlace sigma y 2 enlaces pi.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Exacto! Todo enlace entre dos átomos comienza con un sigma. Los demás que se añadan siempre serán pi.',
            feedback_error: 'Aplica la regla: enlace simple (1σ), doble (1σ, 1π), triple (1σ, 2π).'
          },
          {
            id: 'q-2-2-4',
            enunciado: '¿Qué propiedad particular le otorga el enlace pi a una molécula que contiene enlaces dobles?',
            alternativas: { A: 'Permite la rotación libre de los carbonos en 360 grados.', B: 'Impide la rotación, fijando la molécula en una posición rígida.', C: 'La hace inmune al ataque de otras sustancias químicas.', D: 'La vuelve inodora e incolora.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Como la superposición del pi es lateral (como dos puentes paralelos), si intentas girar un carbono, romperías el enlace.',
            feedback_error: 'El enlace sigma permite rotar (como dos ruedas unidas por un eje central). El enlace pi traba esa rotación, generando moléculas rígidas.'
          },
          {
            id: 'q-2-2-5',
            enunciado: 'Si una molécula solo presenta hibridación sp3 en todos sus carbonos (puros alcanos), podemos afirmar con certeza que:',
            alternativas: { A: 'Posee abundantes enlaces pi.', B: 'Su geometría general es plana.', C: 'Solamente posee enlaces sigma en su estructura.', D: 'Es extremadamente reactiva.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! La hibridación sp3 implica exclusivamente la formación de 4 enlaces simples (puros sigmas).',
            feedback_error: 'Alcano (sp3) = puros enlaces simples = sin dobles ni triples = cero enlaces pi.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-3',
      title: '3. Modelos de Representación (Fórmulas)',
      introduccion: 'Dado que las moléculas orgánicas pueden ser gigantescas, escribirlas dibujando cada átomo es ineficiente.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Dado que las moléculas orgánicas pueden ser gigantescas, escribirlas dibujando cada átomo es ineficiente. Por ello usamos **fórmulas de representación** progresivamente más resumidas:

**1. Fórmula Molecular:** Solo indica la cantidad total de cada átomo. Ej: $C_4H_{10}$ (Butano). No nos dice CÓMO están unidos.

**2. Fórmula Estructural Expandida (Desarrollada):** Dibuja todos los enlaces (los "palitos") conectando a todos los C y H. Es muy gráfica pero ocupa mucho espacio.

**3. Fórmula Condensada (Semidesarrollada):** Muestra cómo se agrupan los átomos a lo largo de la cadena de carbonos, omitiendo los enlaces C-H. Ej: $CH_3-CH_2-CH_2-CH_3$.

**4. Fórmula Esqueletal (Zig-zag / Topológica):** Es la más usada en nivel universitario y pruebas estandarizadas.
- Consiste solo en líneas en zig-zag.
- Cada vértice y cada extremo de una línea representa un átomo de Carbono.
- ¡Los Hidrógenos no se dibujan! Se asume mentalmente que cada Carbono tiene los Hidrógenos necesarios para completar sus 4 enlaces.

---
**Problema Práctico:** Tienes una figura esqueletal (zig-zag) con forma de una letra "W" y quieres saber cuál es su fórmula molecular. ¿Cómo lo haces?<br><br>
**Análisis y Solución:**<br>
1. **Contar carbonos:** La letra "W" tiene 2 extremos y 3 vértices interiores. Total = 5 puntos = 5 Carbonos. Es decir, $C_5$.<br>
2. **Contar hidrógenos ocultos:** Aplicamos la tetravalencia (cada Carbono debe tener 4 enlaces).<br>
   - Los 2 extremos están unidos a 1 carbono, así que cada uno necesita 3 H ($CH_3$). Llevamos $6 H$.<br>
   - Los 3 vértices interiores están unidos a 2 carbonos, así que cada uno necesita 2 H ($CH_2$). Son 3 vértices $\\times 2 = 6 H$.<br>
3. **Sumar:** $6 H$ (extremos) + $6 H$ (interiores) = 12 Hidrógenos.<br>
**Respuesta:** La fórmula molecular es **$C_5H_{12}$** (Pentano normal).`,
      order: 3,
      imageUrl: '',
      datos_claves: [
        'Molecular: Solo totales (ej: C2H6).',
        'Expandida: Todos los palitos y letras.',
        'Condensada: Agrupa carbonos con hidrógenos (CH3-CH3).',
        'Esqueletal (zig-zag): Vértices y extremos son Carbonos; se omiten los Hidrógenos.'
      ],
      test: {
        id: 'test-qui-2-3',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Comprender la fórmula topológica es vital, ya que es el lenguaje oficial de la química orgánica moderna.',
        preguntas: [
          {
            id: 'q-2-3-1',
            enunciado: 'En la fórmula topológica (de zig-zag), ¿qué representa cada vértice o intersección entre dos líneas?',
            alternativas: { A: 'Un átomo de oxígeno.', B: 'Un enlace pi.', C: 'Un átomo de hidrógeno.', D: 'Un átomo de carbono.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Correcto! En este modelo, el "esqueleto" se dibuja asumiendo que cada quiebre o punta es un carbono.',
            feedback_error: 'Los hidrógenos unidos a carbono ni siquiera se dibujan. Los vértices son siempre Carbonos.'
          },
          {
            id: 'q-2-3-2',
            enunciado: 'Si observas una línea simple (un solo segmento de recta) en notación topológica, ¿cuál es la fórmula molecular correspondiente?',
            alternativas: { A: 'CH4', B: 'C2H6', C: 'C3H8', D: 'C2H4' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! Una línea recta tiene 2 extremos. Son 2 carbonos. A cada uno le faltan 3 enlaces para completar la tetravalencia, o sea, 3 hidrógenos cada uno: CH3-CH3 (C2H6).',
            feedback_error: 'Una línea tiene dos puntas, por lo tanto hay 2 carbonos. Rellena con hidrógenos mentalmente para llegar a 4 enlaces por carbono.'
          },
          {
            id: 'q-2-3-3',
            enunciado: 'La fórmula CH3-CH2-CH2-CH3 (butano) corresponde al modelo de representación:',
            alternativas: { A: 'Topológica.', B: 'Molecular (global).', C: 'Condensada.', D: 'Estructural expandida.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Es condensada porque agrupa los H, pero sigue escribiendo las letras "C".',
            feedback_error: 'No es expandida porque no dibuja los enlaces C-H explícitamente hacia arriba y abajo. Y no es global porque no dice simplemente C4H10.'
          },
          {
            id: 'q-2-3-4',
            enunciado: 'En una fórmula topológica, hay un átomo de carbono (un vértice) del cual salen 3 líneas. ¿Cuántos átomos de hidrógeno se asume implícitamente que están unidos a ese carbono?',
            alternativas: { A: 'Ninguno.', B: '1', C: '2', D: '3' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! El carbono DEBE tener 4 enlaces. Si vemos 3 líneas dibujadas, la que falta (4 - 3 = 1) es un Hidrógeno.',
            feedback_error: 'Recuerda la tetravalencia: siempre son 4. Si ves 3 enlaces, falta 1 para llegar a 4.'
          },
          {
            id: 'q-2-3-5',
            enunciado: '¿Por qué en las fórmulas topológicas sí es obligatorio escribir el símbolo del elemento (ej. O, N) cuando es distinto al Carbono, pero el Carbono se omite?',
            alternativas: { A: 'Porque los otros elementos son más pesados.', B: 'Porque el carbono es radiactivo.', C: 'Porque es una convención para simplificar el esqueleto que está formado mayoritariamente por Carbono.', D: 'No es obligatorio escribirlos, también se pueden omitir.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! Al ser "química del carbono", se asume que el 90% de la molécula es carbono. Solo se explicitan las rarezas.',
            feedback_error: 'Es pura convención para ahorrar tiempo. El carbono es la regla, así que se asume; los heteroátomos (O, N, S, etc.) son excepciones que sí deben dibujarse.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-4',
      title: '4. Hidrocarburos Alifáticos: Alcanos',
      introduccion: 'Los hidrocarburos son compuestos orgánicos formados exclusivamente por Carbono (C) e Hidrógeno (H).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Los hidrocarburos son compuestos orgánicos formados exclusivamente por Carbono (C) e Hidrógeno (H).
Los **Alcanos** son hidrocarburos **saturados**. Esto significa que todos sus enlaces carbono-carbono son **enlaces simples**. Al solo tener simples, sus átomos están "saturados" con la máxima cantidad posible de hidrógenos.

**Propiedades de los Alcanos:**
- Todos sus carbonos tienen hibridación **$sp^3$** (tetraédrica).
- Son muy poco reactivos (de ahí su nombre histórico, "parafinas"), pero sí combustionan excelentemente bien.
- Fórmula general (para cadenas lineales): **$C_n H_{2n+2}$**.

**Nomenclatura básica (Prefijos de número de Carbonos):**
- 1 C = **Met**ano
- 2 C = **Et**ano
- 3 C = **Prop**ano
- 4 C = **But**ano
- 5 C = **Pent**ano (y desde aquí, Hex, Hept, Oct, etc.).
- La terminación para esta familia siempre es **-ANO**.

---
**Problema Práctico:** Un gas utilizado para acampar (gas licuado) es un alcano lineal puro. Sometido a análisis, se descubre que su cadena posee 4 átomos de carbono. Utilizando la fórmula general, ¿cuál es su fórmula molecular y cómo se llama?<br><br>
**Análisis y Solución:**<br>
1. **Identificar prefijo:** Sabemos que tiene 4 átomos de carbono. El prefijo para 4 carbonos es **But-**.<br>
2. **Identificar sufijo:** Como es un alcano, la terminación debe ser **-ano**. Por ende, se llama **Butano**.<br>
3. **Aplicar fórmula general:** La fórmula de un alcano es $C_n H_{2n+2}$. Como $n = 4$, sustituimos:<br>
   $H = 2(4) + 2 = 8 + 2 = 10$.<br>
**Respuesta:** El gas es el **Butano** y su fórmula molecular es **$C_4H_{10}$**.`,
      order: 4,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081783/quimica/cap2/sec-2-4.jpg',
      datos_claves: [
        'Alcanos = Hidrocarburos Saturados (solo enlaces simples C-C).',
        'Fórmula general (alcanos lineales): C_n H_(2n+2).',
        'Hibridación exclusiva: Todos los carbonos son sp3.',
        'Prefijos memorables: 1=Met, 2=Et, 3=Prop, 4=But. Sufijo: -ano.'
      ],
      test: {
        id: 'test-qui-2-4',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Los alcanos son el esqueleto básico sobre el cual se construyen todas las demás moléculas.',
        preguntas: [
          {
            id: 'q-2-4-1',
            enunciado: '¿Cuál es el nombre IUPAC del alcano que posee 3 átomos de carbono en su cadena?',
            alternativas: { A: 'Metano.', B: 'Etano.', C: 'Propano.', D: 'Butano.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! El prefijo para 3 es "prop" + el sufijo "ano".',
            feedback_error: 'Recuerda los 4 jinetes iniciales: Met=1, Et=2, Prop=3, But=4.'
          },
          {
            id: 'q-2-4-2',
            enunciado: 'Un hidrocarburo lineal saturado (alcano) contiene 10 átomos de carbono. Aplicando la fórmula general, ¿cuántos átomos de hidrógeno posee en total?',
            alternativas: { A: '10', B: '20', C: '22', D: '24' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! La fórmula es CnH2n+2. (10 x 2) + 2 = 22.',
            feedback_error: 'Usa la fórmula matemática de los alcanos: CnH2n+2. Multiplica los carbonos por 2 y súmale 2.'
          },
          {
            id: 'q-2-4-3',
            enunciado: 'El término "saturado" aplicado a los alcanos significa que:',
            alternativas: { A: 'Son insolubles en agua.', B: 'Poseen la máxima cantidad posible de átomos de hidrógeno debido a la ausencia de enlaces dobles o triples.', C: 'Han alcanzado su punto máximo de ebullición.', D: 'Tienen una cantidad equivalente de protones y neutrones.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! No hay enlaces pi "robando" capacidad de enlace, todo el espacio sobrante del carbono se usa para capturar hidrógenos.',
            feedback_error: 'Saturado se refiere a estar "lleno" de algo. En este caso, lleno de hidrógenos al no tener dobles enlaces.'
          },
          {
            id: 'q-2-4-4',
            enunciado: 'Si analizas el gas contenido en un balón de cocina, te darás cuenta que en su mayoría es C4H10. Su nombre correcto es:',
            alternativas: { A: 'Metano.', B: 'Butano.', C: 'Pentano.', D: 'Hexano.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! El prefijo "But" indica 4 carbonos.',
            feedback_error: 'Observa la fórmula (C4). El prefijo para 4 carbonos es But.'
          },
          {
            id: 'q-2-4-5',
            enunciado: 'Químicamente, el metano (CH4) se diferencia de los otros alcanos porque:',
            alternativas: { A: 'Es el único que tiene enlaces dobles.', B: 'Es el único que es sólido a temperatura ambiente.', C: 'Es el alcano más simple, formado por un solo átomo de carbono.', D: 'No reacciona con el oxígeno (no se quema).' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! El Metano es el inicio de la familia (n=1).',
            feedback_error: 'El metano es gas (gas natural) y altamente combustible. Su particularidad es ser el hidrocarburo más pequeño (1 Carbono).'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-5',
      title: '5. Hidrocarburos Alifáticos: Alquenos y Alquinos',
      introduccion: 'Los Alquenos y Alquinos son hidrocarburos insaturados, ya que no poseen el número máximo de hidrógenos posible.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Los **Alquenos** y **Alquinos** son hidrocarburos **insaturados**, ya que no poseen el número máximo de hidrógenos posible. Esto se debe a la presencia de enlaces múltiples entre sus átomos de carbono.

**1. Alquenos (Olefinas):**
- Poseen al menos un **enlace doble** ($C=C$).
- Terminación: **-ENO**.
- Los carbonos del doble enlace tienen hibridación **$sp^2$**.
- Fórmula general (con 1 doble enlace): **$C_n H_{2n}$**.

**2. Alquinos:**
- Poseen al menos un **enlace triple** ($C\\equiv C$).
- Terminación: **-INO**.
- Los carbonos del triple enlace tienen hibridación **$sp$**.
- Fórmula general (con 1 triple enlace): **$C_n H_{2n-2}$**.

Al existir insaturaciones, se debe **numerar la cadena** para indicar dónde está el enlace múltiple, empezando por el extremo más cercano a este.

---
**Problema Práctico:** Analicemos la molécula $CH_3-CH_2-CH=CH-CH_3$. ¿Cómo se llama este compuesto según las reglas de insaturación?<br><br>
**Análisis y Solución:**<br>
1. **Cadena principal:** Es una cadena lineal continua de 5 carbonos. Prefijo: **Pent-**.<br>
2. **Insaturación:** Identificamos un doble enlace ($=$. Esto significa que pertenece a la familia de los alquenos. Sufijo: **-eno**.
3. **Numeración:** Debemos elegir el extremo más cercano al doble enlace. 
   - Si contamos de izquierda a derecha, el doble enlace inicia en el Carbono 3.
   - Si contamos de derecha a izquierda, el doble enlace inicia en el Carbono 2.
   La regla dicta escoger el número menor, así que es el Carbono 2.<br>
**Respuesta:** El nombre de la molécula es **2-penteno** (o pent-2-eno en la nueva IUPAC).`,
      order: 5,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081784/quimica/cap2/sec-2-5.webp',
      datos_claves: [
        'Alquenos = insaturados con enlace DOBLE. Terminación -eno.',
        'Alquinos = insaturados con enlace TRIPLE. Terminación -ino.',
        'Los alquenos (1 doble) siguen la fórmula C_n H_2n.',
        'Los alquinos (1 triple) siguen la fórmula C_n H_2n-2.'
      ],
      test: {
        id: 'test-qui-2-5',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Los enlaces múltiples restan hidrógenos a la fórmula pero le añaden mucha reactividad a la molécula.',
        preguntas: [
          {
            id: 'q-2-5-1',
            enunciado: '¿Cuál es la fórmula molecular de un alqueno lineal que posee 5 átomos de carbono y un solo doble enlace (Penteno)?',
            alternativas: { A: 'C5H12', B: 'C5H10', C: 'C5H8', D: 'C5H6' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! La fórmula de los alquenos es CnH2n. (5 x 2) = 10.',
            feedback_error: 'Recuerda las fórmulas: Alcanos (+2), Alquenos (x2 exacto), Alquinos (-2).'
          },
          {
            id: 'q-2-5-2',
            enunciado: 'El gas Acetileno se utiliza en los sopletes de soldadura porque al quemarse alcanza temperaturas de 3000°C. Su nombre IUPAC es Etino (2 carbonos). ¿Qué tipo de enlace hay entre sus carbonos?',
            alternativas: { A: 'Un enlace iónico.', B: 'Un enlace simple.', C: 'Un enlace doble.', D: 'Un enlace triple.' },
            respuesta_correcta: 'D',
            feedback_acierto: '¡Muy bien! La terminación "-ino" siempre indica la presencia de un enlace triple (C≡C).',
            feedback_error: 'Presta atención a la terminación del nombre (Et-ino). Las terminaciones te delatan el tipo de enlace.'
          },
          {
            id: 'q-2-5-3',
            enunciado: 'Se dice que las grasas poli-insaturadas son más saludables. En química, el término "insaturado" hace referencia a la existencia de:',
            alternativas: { A: 'Presencia de oxígeno en la cadena.', B: 'Exceso de átomos de hidrógeno.', C: 'Presencia de enlaces dobles o triples entre átomos de carbono.', D: 'Ausencia total de enlaces sigma.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! Las cadenas insaturadas sacrifican hidrógenos para formar enlaces múltiples (generalmente dobles en aceites).',
            feedback_error: 'Insaturado significa que no está "lleno" de hidrógenos, y la única forma de que eso pase, respetando la tetravalencia, es generando dobles o triples enlaces.'
          },
          {
            id: 'q-2-5-4',
            enunciado: 'Para el alqueno "Buteno" (4 carbonos), es necesario indicar la posición del doble enlace (Ej: 1-Buteno o 2-Buteno). ¿Por qué NO se hace esto con el Propeno (3 carbonos)?',
            alternativas: { A: 'Porque el Propeno no tiene dobles enlaces.', B: 'Porque el Propeno es un anillo cerrado.', C: 'Porque en una cadena de 3 carbonos, no importa dónde pongas el doble enlace, siempre estará en la posición 1 al girar la molécula.', D: 'Porque IUPAC prohibe numerar moléculas de menos de 4 carbonos.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! En 3 carbonos, los dos enlaces posibles son los extremos. Girando la molécula de derecha a izquierda, son exactamente lo mismo.',
            feedback_error: 'Prueba a dibujar el propeno (C=C-C y C-C=C). Al darle la vuelta, verás que es la misma molécula.'
          },
          {
            id: 'q-2-5-5',
            enunciado: 'Una molécula C8H14 corresponde a un hidrocarburo lineal con un solo enlace múltiple. Podemos deducir que es un:',
            alternativas: { A: 'Alcano.', B: 'Alqueno.', C: 'Alquino.', D: 'Aromático.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Si aplicas n=8, el doble es 16. Pero tiene 14 hidrógenos (2n - 2). Esa es la fórmula matemática de los Alquinos.',
            feedback_error: 'Verifica la relación matemática. n=8. Si fuera alcano, (8x2)+2 = 18. Si fuera alqueno (8x2) = 16. Si fuera alquino (8x2)-2 = 14.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-6',
      title: '6. Nomenclatura de Alcanos Ramificados',
      introduccion: 'En la realidad, la mayoría de los alcanos no son lineales, sino que tienen "ramas" de carbono saliéndoles por los costados.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En la realidad, la mayoría de los alcanos no son lineales, sino que tienen "ramas" de carbono saliéndoles por los costados. Para nombrar estos **Alcanos Ramificados**, usamos las reglas de la **IUPAC**:

**Pasos fundamentales IUPAC:**
1. **Encontrar la cadena principal:** Busca la secuencia CONTINUA más larga de átomos de carbono. Esta dictará el nombre base (ej. heptano si son 7).
2. **Identificar los sustituyentes (radicales):** Todo lo que quede colgando fuera de la cadena principal es una rama. Se nombran con los mismos prefijos, pero terminan en **-il** o **-ilo** (ej. $CH_3$ es metil, $CH_2-CH_3$ es etil).
3. **Numerar la cadena:** Empieza a contar desde el extremo que esté **más cerca del primer sustituyente** para darles a las ramas los números más bajos posibles (localizadores).
4. **Escribir el nombre:** Ordena los sustituyentes alfabéticamente (ej. etil antes que metil), indica su número de posición con un guión, y finaliza pegando el nombre de la cadena principal.

---
**Problema Práctico:** En una molécula, encuentras la cadena más larga y tiene 6 carbonos. En el carbono 2 de esa cadena hay un grupo $CH_3$ y en el carbono 4 hay un grupo $CH_2-CH_3$. ¿Cuál es el nombre IUPAC completo?<br><br>
**Análisis y Solución:**<br>
1. **Cadena base:** 6 carbonos, por lo tanto, el final del nombre es **hexano**.<br>
2. **Ramas identificadas:** Hay un $CH_3$ (prefijo 1 C = **metil**) en la posición 2. Hay un $CH_2-CH_3$ (prefijo 2 C = **etil**) en la posición 4.<br>
3. **Orden alfabético:** Primero va la "E" de etil, luego la "M" de metil.<br>
4. **Armar:** 4-etil, seguido de 2-metil, seguido de hexano.<br>
**Respuesta:** El compuesto se nombra **4-etil-2-metilhexano**. (Notar que los números se separan de las letras con guiones).`,
      order: 6,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081785/quimica/cap2/sec-2-6.jpg',
      datos_claves: [
        'Regla de oro 1: Busca SIEMPRE la cadena continua más larga.',
        'Regla de oro 2: Numera para dar los números más BAJOS a las ramas.',
        'Ramas comunes: Metil (1 carbono), Etil (2 carbonos), Propil (3 carbonos).',
        'Las ramas se enlistan en estricto orden alfabético antes de la cadena principal.'
      ],
      test: {
        id: 'test-qui-2-6',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Nombrar moléculas orgánicas requiere aplicar estrictamente las reglas IUPAC en orden.',
        preguntas: [
          {
            id: 'q-2-6-1',
            enunciado: 'En la nomenclatura IUPAC, ¿qué terminación se utiliza para nombrar a un sustituyente (una ramificación que cuelga de la cadena principal)?',
            alternativas: { A: '-ano', B: '-eno', C: '-il', D: '-oico' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! Los radicales derivados de alcanos adoptan la terminación "-il" (metil, etil, propil).',
            feedback_error: 'La terminación -ano es para la cadena base. Los que quedan "colgando" como ramas terminan en -il.'
          },
          {
            id: 'q-2-6-2',
            enunciado: 'Tienes una molécula cuya cadena más larga y horizontal tiene 5 carbonos. En el carbono número 2 (empezando por la izquierda) cuelga un grupo CH3, y en el carbono 4 cuelga otro CH3. El nombre correcto es:',
            alternativas: { A: '2,4-metilpentano', B: '2,4-dimetilpentano', C: 'Dimetil-2,4-pentano', D: '2,4-dietilpentano' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Se ubican las posiciones (2,4), como hay dos metiles se usa el prefijo "di" (dimetil), y la base es pentano.',
            feedback_error: 'Si tienes dos ramas idénticas (dos metiles), es obligatorio añadir el prefijo multiplicador "di", quedando como dimetil.'
          },
          {
            id: 'q-2-6-3',
            enunciado: 'Al armar el nombre final de una molécula altamente ramificada, si contiene sustituyentes "Metil" y "Etil", ¿cuál se escribe primero y por qué?',
            alternativas: { A: 'El Metil, porque es más pequeño (1 carbono).', B: 'El Etil, por orden alfabético.', C: 'Cualquiera, IUPAC permite ambos.', D: 'El que esté colgado del número más bajo.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! IUPAC dictamina que los sustituyentes se listan por estricto orden alfabético: Etil (E) va antes que Metil (M).',
            feedback_error: 'El tamaño o la posición no importan en la estructura final del nombre. La regla de armado final es el orden alfabético de la primera letra.'
          },
          {
            id: 'q-2-6-4',
            enunciado: '¿Cuál es el criterio principal para decidir desde qué extremo (izquierda o derecha) se comienza a numerar la cadena principal en un alcano ramificado?',
            alternativas: { A: 'Siempre se debe empezar desde la izquierda por convención de lectura.', B: 'Desde el extremo que esté más cerca a una ramificación, para que tengan los números menores.', C: 'Desde el extremo que contenga al carbono más grande.', D: 'Se puede empezar de cualquier lado, da el mismo resultado.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Excelente! La "regla de los localizadores más bajos" obliga a numerar dando preferencia a que las ramas tengan números bajos.',
            feedback_error: 'En IUPAC queremos mantener los números lo más bajo posible. Si una rama está a la derecha, empezamos a contar desde la derecha.'
          },
          {
            id: 'q-2-6-5',
            enunciado: '¿Puede la cadena principal estar en forma de "L" (doblar en una esquina) en lugar de ser la línea recta horizontal trazada en el papel?',
            alternativas: { A: 'No, siempre debe ser horizontal y continua.', B: 'Sí, la cadena principal es el camino continuo más largo, sin importar su dibujo en el papel.', C: 'Solo si las ramas son muy cortas.', D: 'No, porque viola la hibridación sp3.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! En el mundo tridimensional, no hay "arriba" ni "abajo". El papel es un engaño; debes buscar el camino más largo aunque doble.',
            feedback_error: 'Muchos estudiantes se equivocan eligiendo la horizontal. Debes seguir el trazo del lápiz continuo que cuente más carbonos, sin importar si dobla esquinas.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-7',
      title: '7. Grupos Funcionales: Alcoholes y Éteres',
      introduccion: 'Más allá del carbono y el hidrógeno, las moléculas orgánicas pueden incorporar átomos como el Oxígeno (O).',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `Más allá del carbono y el hidrógeno, las moléculas orgánicas pueden incorporar átomos como el Oxígeno (O). Estos forman agrupaciones específicas llamadas **Grupos Funcionales**, que le dan propiedades químicas únicas a la molécula. Hoy veremos dos que contienen oxígeno con enlaces simples:

**1. Alcoholes:**
- **Identificador:** Un grupo Hidroxilo (**-OH**) unido directamente a un carbono de la cadena (el carbono debe ser $sp^3$).
- **Terminación:** Se añade **-OL** al nombre de la cadena principal (ej. metanol, etanol).
- **Propiedad:** Gracias al grupo -OH, pueden formar puentes de hidrógeno, lo que los hace solubles en agua (si la cadena de carbonos es corta) y eleva sus puntos de ebullición.

**2. Éteres:**
- **Identificador:** Un átomo de Oxígeno "atrapado" o puenteando a dos cadenas de carbonos (estructura **R-O-R'**).
- **Nomenclatura común:** Se nombran las dos ramas conectadas al oxígeno alfabéticamente y se añade la palabra **éter**. (Ej. etil metil éter).
- **Propiedad:** Al no tener el H directamente unido al O, **no forman** puentes de hidrógeno entre sí, por lo que son muy volátiles.

---
**Problema Práctico:** Tienes dos líquidos incoloros. Uno es $CH_3-CH_2-OH$ (Etanol) y el otro es $CH_3-O-CH_3$ (Dimetil éter). Aunque ambos tienen la misma fórmula molecular ($C_2H_6O$), uno hierve a 78°C y el otro a -24°C. ¿Quién es quién y por qué?<br><br>
**Análisis y Solución:**<br>
1. **Estructura Etanol:** Tiene un grupo **-OH** (Alcohol). Esto significa que puede formar puentes de hidrógeno fuertes entre sus moléculas, necesitando mucho calor para hervir.<br>
2. **Estructura Dimetil éter:** Tiene el **O** en medio (R-O-R). No tiene hidrógeno unido al oxígeno, por lo que sus fuerzas intermoleculares son débiles dipolo-dipolo.<br>
**Respuesta:** El líquido que hierve a **78°C es el Etanol**, gracias a los fuertes puentes de hidrógeno que forma su grupo hidroxilo. El Dimetil éter hierve a los gélidos -24°C porque es un éter y no forma esos puentes.`,
      order: 7,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081786/quimica/cap2/sec-2-7.jpg',
      datos_claves: [
        'Alcoholes: Contienen el grupo Hidroxilo (-OH). Terminación: -ol.',
        'Los alcoholes tienen altos puntos de ebullición debido a los puentes de hidrógeno.',
        'Éteres: Oxígeno en el medio de la cadena (R-O-R\').',
        'Etanol (alcohol) y Dimetil éter (éter) son isómeros, pero con propiedades drásticamente opuestas.'
      ],
      test: {
        id: 'test-qui-2-7',
        materiaId: 'ciencias-quimica',
        contexto_base: 'La incorporación del oxígeno cambia totalmente la "personalidad" (propiedades) de la molécula.',
        preguntas: [
          {
            id: 'q-2-7-1',
            enunciado: 'El grupo funcional característico que distingue a un alcohol de otros compuestos orgánicos es el grupo:',
            alternativas: { A: 'Carboxilo (-COOH).', B: 'Carbonilo (C=O).', C: 'Hidroxilo (-OH).', D: 'Amino (-NH2).' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Correcto! El grupo hidroxilo es la firma inconfundible de cualquier alcohol.',
            feedback_error: 'Los alcoholes se definen por tener un átomo de Oxígeno unido directamente a un Hidrógeno, colgado de la cadena (el grupo OH).'
          },
          {
            id: 'q-2-7-2',
            enunciado: 'La estructura CH3-O-CH3 (un átomo de oxígeno en medio de dos grupos metilo) corresponde químicamente a un:',
            alternativas: { A: 'Alcohol.', B: 'Éter.', C: 'Éster.', D: 'Aldehído.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Muy bien! Esa estructura R-O-R es el grupo funcional éter. Específicamente, dimetil éter.',
            feedback_error: 'Cuando el oxígeno corta la cadena de carbonos actuando como un puente en el medio, se trata de un Éter.'
          },
          {
            id: 'q-2-7-3',
            enunciado: '¿Por qué el etanol (CH3-CH2-OH) es totalmente soluble en agua y el etano (CH3-CH3) no lo es, a pesar de tener un tamaño similar?',
            alternativas: { A: 'Porque el etanol es más denso que el agua.', B: 'Porque el etanol es de origen natural.', C: 'Porque el grupo -OH del etanol forma puentes de hidrógeno con el agua (es polar).', D: 'Porque el etanol entra en ebullición al tocar el agua.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Exacto! "Lo similar disuelve a lo similar". El agua es altamente polar por sus puentes de hidrógeno, y el etanol posee un grupo similar (-OH) para mezclarse con ella.',
            feedback_error: 'Los alcanos puros (etano) son apolares (no se mezclan con agua). El grupo OH aporta la polaridad necesaria para ser compatible con el agua.'
          },
          {
            id: 'q-2-7-4',
            enunciado: 'Según la nomenclatura IUPAC, el alcohol derivado del propano (3 carbonos) que posee su grupo -OH en el carbono número 1 se llama:',
            alternativas: { A: 'Propanona.', B: 'Propanoato.', C: '1-propanol.', D: 'Propanal.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Terminación "-ol" y se indica la posición (1) del grupo hidroxilo.',
            feedback_error: 'La terminación de un alcohol es "-ol". Además, debe especificarse en qué carbono está dicho grupo.'
          },
          {
            id: 'q-2-7-5',
            enunciado: 'Una gran diferencia física entre alcoholes y éteres de masa molar similar es que:',
            alternativas: { A: 'Los éteres tienen puntos de ebullición mucho más altos que los alcoholes.', B: 'Los alcoholes tienen puntos de ebullición más altos porque pueden formar puentes de hidrógeno entre sus moléculas.', C: 'Los éteres son siempre sólidos y los alcoholes gases.', D: 'No hay diferencias en sus propiedades físicas.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Los puentes de hidrógeno del OH actúan como un pegamento fuerte, costando más energía (calor) para evaporarlos.',
            feedback_error: 'El éter carece de -OH, por lo que no puede formar puentes de hidrógeno consigo mismo. Son muy volátiles y de baja ebullición.'
          }
        ]
      }
    },
    {
      id: 'sec-qui-2-8',
      title: '8. Grupos Funcionales: Carbonilos y Ácidos Carboxílicos',
      introduccion: 'En esta sección conoceremos los grupos funcionales que incluyen un doble enlace entre Carbono y Oxígeno ($C=O$), conocido como Grupo Carbonilo.',
      guia_titulo: '📖 Teoría y Ejercicio Resuelto',
      guia_contenido: `En esta sección conoceremos los grupos funcionales que incluyen un **doble enlace entre Carbono y Oxígeno ($C=O$)**, conocido como **Grupo Carbonilo**.

**1. Aldehídos:**
- **Identificador:** El carbonilo ($C=O$) se ubica **en un extremo** de la cadena. Es decir, el C está siempre unido a un H terminal.
- **Terminación:** Se usa el sufijo **-AL**. (Ej. Metanal, Propanal).

**2. Cetonas:**
- **Identificador:** El carbonilo ($C=O$) se ubica **en medio** de la cadena (flanqueado por otros carbonos).
- **Terminación:** Se usa el sufijo **-ONA**. (Ej. Propanona o acetona).

**3. Ácidos Carboxílicos:**
- **Identificador:** Es un carbonilo ($C=O$) y un hidroxilo (-OH) unidos **al mismo carbono** terminal. Grupo **-COOH** (Carboxilo).
- **Terminación:** Son los reyes de la prioridad. Se antepone la palabra **Ácido** y se usa el sufijo **-OICO**.
- **Propiedad:** Son ácidos orgánicos débiles (ej. ácido acético en el vinagre).

---
**Problema Práctico:** Al oxidar fuertemente el vino (cuyo componente es el etanol de 2 carbonos), este se vuelve avinagrado. Científicamente, el etanol se transformó en un ácido carboxílico de 2 carbonos. ¿Cuál es su fórmula estructural y su nombre oficial IUPAC?<br><br>
**Análisis y Solución:**<br>
1. Sabemos que el producto sigue teniendo 2 carbonos (prefijo **Et-**).<br>
2. Sabemos que pertenece a la familia de los ácidos carboxílicos, por lo que debe llevar el grupo **-COOH** en el extremo.<br>
3. Para nombrar: Se inicia con la palabra "Ácido", se toma la raíz de 2 carbonos (etano) y se añade el sufijo "-oico".<br>
4. La estructura es un carbono con el grupo ácido ($COOH$) unido a un metil ($CH_3$) para completar los 2 carbonos.<br>
**Respuesta:** Su nombre IUPAC es **Ácido etanoico** (comúnmente llamado ácido acético) y su fórmula condensada es **$CH_3-COOH$**.`,
      order: 8,
      imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1784081786/quimica/cap2/sec-2-8.png',
      datos_claves: [
        'El carbonilo (C=O) es el corazón de aldehídos, cetonas y ácidos.',
        'Aldehído (-al): El C=O está siempre al extremo de la cadena.',
        'Cetona (-ona): El C=O está en el interior de la cadena.',
        'Ácido Carboxílico (-oico): Es un C=O y un -OH en el mismo carbono terminal.'
      ],
      test: {
        id: 'test-qui-2-8',
        materiaId: 'ciencias-quimica',
        contexto_base: 'Distinguir la posición del doble enlace con el oxígeno (C=O) es clave para identificar la familia química.',
        preguntas: [
          {
            id: 'q-2-8-1',
            enunciado: '¿Cuál es la diferencia estructural principal entre un aldehído y una cetona?',
            alternativas: { A: 'El aldehído tiene enlaces dobles carbono-carbono, la cetona no.', B: 'En el aldehído el grupo carbonilo (C=O) está al extremo de la cadena, en la cetona está en medio.', C: 'La cetona tiene un grupo -OH adicional.', D: 'El aldehído no posee oxígeno.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! Si el C=O está en la orilla (terminal) es aldehído (-al). Si tiene carbonos a ambos lados, es cetona (-ona).',
            feedback_error: 'Ambos tienen el mismo grupo funcional (Carbonilo C=O). La única diferencia es su posición (terminal vs intermedio).'
          },
          {
            id: 'q-2-8-2',
            enunciado: 'En la nomenclatura IUPAC, cuando en una molécula existe un grupo Ácido Carboxílico (-COOH), ¿qué ocurre con la numeración de la cadena principal?',
            alternativas: { A: 'Se numera desde el extremo opuesto para dejar al ácido al final.', B: 'El ácido no afecta la numeración, se sigue la regla de las ramas.', C: 'El carbono del grupo ácido (-COOH) toma siempre la posición número 1 y se le da prioridad absoluta sobre el resto de grupos funcionales.', D: 'La molécula no se puede numerar.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Muy bien! Es el grupo más prioritario en la jerarquía química. Él manda en la molécula.',
            feedback_error: 'El grupo ácido es el "jefe supremo" de IUPAC. Ante su presencia, él absorbe la prioridad 1 y el resto de ramas o grupos pasan a ser secundarios.'
          },
          {
            id: 'q-2-8-3',
            enunciado: 'Un perfume huele intensamente a manzana verde. Este compuesto orgánico volátil que brinda el olor frutal muy probablemente pertenece a la familia de los:',
            alternativas: { A: 'Alcanos pesados.', B: 'Ésteres.', C: 'Ácidos carboxílicos.', D: 'Alcoholes secundarios.' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Exacto! Los ésteres (-COOR) son ampliamente conocidos en la industria alimentaria y cosmética por sus intensos aromas frutales.',
            feedback_error: 'Los ácidos suelen oler mal (a vinagre o rancio). Los hidrocarburos huelen a gasolina. Los ésteres son los que otorgan los olores dulces de las frutas y flores.'
          },
          {
            id: 'q-2-8-4',
            enunciado: 'La cetona más pequeña posible (propanona, que se vende comercialmente como acetona) tiene:',
            alternativas: { A: '1 átomo de carbono.', B: '2 átomos de carbono.', C: '3 átomos de carbono.', D: '4 átomos de carbono.' },
            respuesta_correcta: 'C',
            feedback_acierto: '¡Excelente! Como la cetona exige que el C=O esté al medio, requiere un mínimo de 3 carbonos (C-C(=O)-C). No puede existir una cetona de 1 o 2 carbonos.',
            feedback_error: 'Para que el C=O esté rodeado de carbonos, necesita al menos uno a la izquierda y otro a la derecha. Eso hace un total de 3 carbonos mínimo.'
          },
          {
            id: 'q-2-8-5',
            enunciado: 'El nombre químico oficial del vinagre es Ácido Etanoico. Basándote en ese nombre, ¿cuántos átomos de carbono tiene en total su molécula?',
            alternativas: { A: '1', B: '2', C: '3', D: '4' },
            respuesta_correcta: 'B',
            feedback_acierto: '¡Correcto! El prefijo "Et" significa 2 carbonos. Uno es de la cadena y el otro pertenece al mismo grupo funcional -COOH.',
            feedback_error: 'Fíjate en el prefijo "Et", que en las convenciones orgánicas (met, et, prop, but) hace referencia al número 2.'
          }
        ]
      }
    }
  ]
};
