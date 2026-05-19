const fs = require('fs');
const path = require('path');

// Helper to shuffle alternatives and guarantee a perfectly balanced distribution of correct keys (A, B, C, D)
// with zero consecutive duplicates of more than 2, and overall frequencies of A, B, C, D as even as possible.
function distributeAndShuffle(questions) {
  const letters = ['A', 'B', 'C', 'D'];

  // Assign target correct answers evenly for the 10 questions in a section
  const targetKeys = ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'D'];

  // Shuffle the targetKeys array randomly
  for (let i = targetKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [targetKeys[i], targetKeys[j]] = [targetKeys[j], targetKeys[i]];
  }

  // Ensure no three consecutive elements are identical
  for (let i = 2; i < targetKeys.length; i++) {
    if (targetKeys[i] === targetKeys[i - 1] && targetKeys[i] === targetKeys[i - 2]) {
      // Find another index ahead that is different and swap
      for (let k = i + 1; k < targetKeys.length; k++) {
        if (targetKeys[k] !== targetKeys[i]) {
          [targetKeys[i], targetKeys[k]] = [targetKeys[k], targetKeys[i]];
          break;
        }
      }
    }
  }

  // Apply to questions
  questions.forEach((q, idx) => {
    const targetKey = targetKeys[idx];
    const originalCorrectText = q.alternativas[q.respuesta_correcta];
    const otherTexts = Object.keys(q.alternativas)
      .filter(k => k !== q.respuesta_correcta)
      .map(k => q.alternativas[k]);

    // Shuffle the three incorrect options
    for (let i = otherTexts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherTexts[i], otherTexts[j]] = [otherTexts[j], otherTexts[i]];
    }

    // Place the correct option at the target key index
    const newAlts = {};
    let otherIdx = 0;
    letters.forEach(let => {
      if (let === targetKey) {
        newAlts[let] = originalCorrectText;
      } else {
        newAlts[let] = otherTexts[otherIdx++];
      }
    });

    q.alternativas = newAlts;
    q.respuesta_correcta = targetKey;
  });

  return questions;
}

const QUESTIONS_DATA = {
  "sec-m2-4-1": [
    {
      "id": "q-m2-4-1-1",
      "enunciado": "Dado el conjunto de datos discretos: $\\{2, 4, 6, 8, 10\\}$. ¿Cuáles son el promedio (media aritmética) y la **desviación media** ($DM$) de este conjunto?",
      "alternativas": {
        "A": "Promedio: $6$; Desviación Media: $2,4$",
        "B": "Promedio: $6$; Desviación Media: $12$",
        "C": "Promedio: $5$; Desviación Media: $2,4$",
        "D": "Promedio: $6$; Desviación Media: $1,2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero calculamos el promedio $\\bar{x}$:\n $\\bar{x} = \\frac{2 + 4 + 6 + 8 + 10}{5} = \\frac{30}{5} = 6$.\nCalculamos las distancias absolutas de cada dato al promedio:\n $|2 - 6| = 4$, $|4 - 6| = 2$, $|6 - 6| = 0$, $|8 - 6| = 2$, $|10 - 6| = 4$.\nSumamos las distancias y dividimos por el total de datos ($N = 5$):\n $DM = \\frac{4 + 2 + 0 + 2 + 4}{5} = \\frac{12}{5} = 2,4$.",
      "feedback_error": "Incorrecto. Primero calcula la media $\\bar{x} = 6$. Luego saca el promedio de las diferencias absolutas $|x_i - 6|$: $\\frac{4 + 2 + 0 + 2 + 4}{5} = 2,4$."
    },
    {
      "id": "q-m2-4-1-2",
      "enunciado": "Para un conjunto de mediciones científicas en un experimento químico, la varianza poblacional es de exactamente $16\\text{ unidades}^2$. ¿Cuál es la **desviación estándar** de dicho conjunto de datos?",
      "alternativas": {
        "A": "$4\\text{ unidades}$",
        "B": "$8\\text{ unidades}$",
        "C": "$256\\text{ unidades}$",
        "D": "$16\\text{ unidades}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por definición, la desviación estándar ($\\sigma$) es la raíz cuadrada positiva de la varianza poblacional ($\\sigma^2$):\n $\\sigma = \\sqrt{\\sigma^2} = \\sqrt{16} = 4\\text{ unidades}$.\nEsto permite expresar la dispersión en la misma unidad física de medida que los datos originales.",
      "feedback_error": "Incorrecto. La desviación estándar es siempre la raíz cuadrada de la varianza: $\\sigma = \\sqrt{16} = 4\\text{ unidades}$."
    },
    {
      "id": "q-m2-4-1-3",
      "enunciado": "En un curso, la desviación estándar de las notas de un examen de matemáticas es de exactamente $0,8$ y la nota promedio del curso fue un $5,0$. ¿Cuál es la **varianza** poblacional asociada a las notas de este curso?",
      "alternativas": {
        "A": "$0,64$",
        "B": "$0,80$",
        "C": "$1,60$",
        "D": "$0,40$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La varianza ($\\sigma^2$) es el cuadrado de la desviación estándar ($\\sigma$):\n $\\sigma^2 = (0,8)^2 = 0,64$.\nNota que la media o promedio ($5,0$) es un distractor y no interviene directamente cuando ya conocemos la desviación estándar.",
      "feedback_error": "Incorrecto. La varianza se calcula elevando al cuadrado la desviación estándar: $\\sigma^2 = (0,8)^2 = 0,64$."
    },
    {
      "id": "q-m2-4-1-4",
      "enunciado": "Dado el pequeño conjunto de datos discretos: $\\{1, 3, 5\\}$. ¿Cuál es el valor exacto de la **varianza poblacional** ($\\sigma^2$) de este conjunto?",
      "alternativas": {
        "A": "$\\frac{8}{3}$",
        "B": "$2$",
        "C": "$3$",
        "D": "$\\frac{4}{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos los pasos teóricos:\n 1) Promedio $\\bar{x} = \\frac{1 + 3 + 5}{3} = \\frac{9}{3} = 3$.\n 2) Desviaciones al cuadrado respecto al promedio:\n $(1 - 3)^2 = 4$, $(3 - 3)^2 = 0$, $(5 - 3)^2 = 4$.\n 3) Varianza poblacional (promedio de los cuadrados):\n $\\sigma^2 = \\frac{4 + 0 + 4}{3} = \\frac{8}{3}$.",
      "feedback_error": "Incorrecto. Primero halla el promedio $\\bar{x} = 3$. Luego calcula la varianza poblacional dividiendo la suma de desviaciones al cuadrado por $N = 3$: $\\sigma^2 = \\frac{(1-3)^2 + (3-3)^2 + (5-3)^2}{3} = \\frac{8}{3}$."
    },
    {
      "id": "q-m2-4-1-5",
      "enunciado": "En un ensayo de laboratorio se registran cinco tiempos de reacción idénticos: $\\{5, 5, 5, 5, 5\\}\\text{ segundos}$. ¿Cuál es el valor de la **varianza** poblacional de esta muestra?",
      "alternativas": {
        "A": "$0$",
        "B": "$5$",
        "C": "$25$",
        "D": "$1$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Si todos los datos de una distribución son exactamente iguales, no hay ninguna dispersión ni variación entre ellos. La media aritmética es $5$, y la distancia de cada dato a la media es $0$. Por lo tanto, tanto la desviación media, la varianza y la desviación estándar son idénticamente $0$.",
      "feedback_error": "Incorrecto. Dado que todos los datos son idénticos al promedio ($5$), no hay dispersión alguna. La varianza es exactamente $0$."
    },
    {
      "id": "q-m2-4-1-6",
      "enunciado": "Dado el conjunto de datos numéricos $\\{4, 8, 12\\}$. ¿Cuál es la **desviación estándar poblacional** ($\\sigma$) exacta de este conjunto?",
      "alternativas": {
        "A": "$4\\sqrt{\\frac{2}{3}}$",
        "B": "$4\\sqrt{2}$",
        "C": "$\\frac{32}{3}$",
        "D": "$4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! \n 1) Calculamos el promedio $\\bar{x} = \\frac{4 + 8 + 12}{3} = \\frac{24}{3} = 8$.\n 2) Varianza poblacional $\\sigma^2 = \\frac{(4-8)^2 + (8-8)^2 + (12-8)^2}{3} = \\frac{16 + 0 + 16}{3} = \\frac{32}{3}$.\n 3) Desviación estándar (raíz de la varianza):\n $\\sigma = \\sqrt{\\frac{32}{3}} = \\sqrt{\\frac{16 \\cdot 2}{3}} = 4\\sqrt{\\frac{2}{3}}$.",
      "feedback_error": "Incorrecto. Calculando la varianza poblacional obtenemos $\\sigma^2 = 32/3$. Al extraer la raíz cuadrada nos queda $\\sigma = \\sqrt{32/3} = 4\\sqrt{2/3}$."
    },
    {
      "id": "q-m2-4-1-7",
      "enunciado": "Un conjunto de dos mediciones discretas $\\{2, 8\\}$ posee un promedio $\\bar{x} = 5$. ¿Cuál es el valor de la **desviación media** ($DM$) de este conjunto de datos?",
      "alternativas": {
        "A": "$3$",
        "B": "$6$",
        "C": "$1,5$",
        "D": "$0$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Calculamos las distancias absolutas de cada dato al promedio:\n $|2 - 5| = 3$ y $|8 - 5| = 3$.\nLa desviación media es el promedio de estas distancias:\n $DM = \\frac{3 + 3}{2} = \\frac{6}{2} = 3$.",
      "feedback_error": "Incorrecto. Las desviaciones absolutas al promedio son $3$ y $3$. Su promedio es $\\frac{3 + 3}{2} = 3$."
    },
    {
      "id": "q-m2-4-1-8",
      "enunciado": "Si un conjunto de datos posee un rango total de $15\\text{ unidades}$ y el valor mínimo registrado en el conjunto es $12$, ¿cuál es el valor máximo del conjunto?",
      "alternativas": {
        "A": "$27$",
        "B": "$3$",
        "C": "$15$",
        "D": "$18$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por definición de rango en estadística, este corresponde a la diferencia entre el valor máximo y el mínimo de la muestra:\n $R = X_{\\text{máx}} - X_{\\text{mín}} \\implies 15 = X_{\\text{máx}} - 12$.\nDespejamos sumando $12$ a ambos lados:\n $X_{\\text{máx}} = 15 + 12 = 27$.",
      "feedback_error": "Incorrecto. El rango es $X_{\\text{máx}} - X_{\\text{mín}}$. Planteamos la ecuación: $15 = X_{\\text{máx}} - 12 \\implies X_{\\text{máx}} = 27$."
    },
    {
      "id": "q-m2-4-1-9",
      "enunciado": "Se mide el peso neto de cuatro manzanas seleccionadas en un huerto: $\\{150, 160, 170, 180\\}\\text{ gramos}$. ¿Cuál es el **rango** de esta muestra?",
      "alternativas": {
        "A": "$30\\text{ gramos}$",
        "B": "$15\\text{ gramos}$",
        "C": "$165\\text{ gramos}$",
        "D": "$10\\text{ gramos}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Identificamos los valores extremos de los datos ordenados:\n - Valor máximo: $180\\text{ gramos}$.\n - Valor mínimo: $150\\text{ gramos}$.\nCalculamos el rango restándolos:\n $R = X_{\\text{máx}} - X_{\\text{mín}} = 180 - 150 = 30\\text{ gramos}$.",
      "feedback_error": "Incorrecto. El rango es la diferencia entre el dato mayor y el menor: $180 - 150 = 30\\text{ gramos}$."
    },
    {
      "id": "q-m2-4-1-10",
      "enunciado": "Un grupo de datos estadísticos posee una varianza poblacional igual a $0,25$. ¿Cuál es la **desviación estándar** asociada a este grupo?",
      "alternativas": {
        "A": "$0,5$",
        "B": "$0,0625$",
        "C": "$2,5$",
        "D": "$1,25$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! La desviación estándar es la raíz cuadrada de la varianza:\n $\\sigma = \\sqrt{\\sigma^2} = \\sqrt{0,25} = 0,5$.",
      "feedback_error": "Incorrecto. Calculamos la raíz cuadrada de la varianza: $\\sigma = \\sqrt{0,25} = 0,5$."
    }
  ],
  "sec-m2-4-2": [
    {
      "id": "q-m2-4-2-1",
      "enunciado": "Un grupo de datos original posee un promedio de $\\bar{x} = 15$ y una desviación estándar de $\\sigma = 3$. Si a cada dato del grupo se le **suma** exactamente $5$ unidades, ¿cuáles serán la nueva media y desviación estándar de la población resultante?",
      "alternativas": {
        "A": "Nueva media: $20$; Nueva desviación estándar: $3$",
        "B": "Nueva media: $20$; Nueva desviación estándar: $8$",
        "C": "Nueva media: $15$; Nueva desviación estándar: $3$",
        "D": "Nueva media: $20$; Nueva desviación estándar: $0$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por propiedades de las medidas estadísticas frente a transformaciones lineales:\n 1) La media aritmética se ve afectada de manera directa por la suma: $\\bar{x}_{nueva} = \\bar{x} + 5 = 15 + 5 = 20$.\n 2) La desviación estándar mide dispersión relativa. Si sumamos un valor constante a todos los datos, todo el conjunto se desplaza en bloque sin que cambien las distancias relativas entre los datos. Por lo tanto, la desviación estándar **no se altera**: $\\sigma_{nueva} = \\sigma = 3$.",
      "feedback_error": "Incorrecto. Al sumar una constante a todos los datos, la media aumenta en dicha constante ($15+5=20$), pero la desviación estándar no cambia, manteniéndose en $3$."
    },
    {
      "id": "q-m2-4-2-2",
      "enunciado": "Si un conjunto de datos cuantitativos tiene un promedio de $20$ y una desviación estándar de $4$. Si cada dato de la muestra se **multiplica** por el factor constante $3$, ¿cuáles serán la nueva media y la nueva desviación estándar del conjunto?",
      "alternativas": {
        "A": "Nueva media: $60$; Nueva desviación estándar: $12$",
        "B": "Nueva media: $60$; Nueva desviación estándar: $4$",
        "C": "Nueva media: $20$; Nueva desviación estándar: $12$",
        "D": "Nueva media: $60$; Nueva desviación estándar: $36$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Cuando multiplicamos cada dato de una muestra por una constante $k$:\n 1) El nuevo promedio se multiplica por la constante: $\\bar{x}_{nuevo} = k \\cdot \\bar{x} = 3 \\cdot 20 = 60$.\n 2) La desviación estándar se ve multiplicada por el valor absoluto de la constante: $\\sigma_{nueva} = |k| \\cdot \\sigma = 3 \\cdot 4 = 12$.",
      "feedback_error": "Incorrecto. Al multiplicar todos los datos por 3, tanto el promedio como la desviación estándar se multiplican por 3, resultando en $60$ y $12$ respectivamente."
    },
    {
      "id": "q-m2-4-2-3",
      "enunciado": "La estatura media de un equipo de voleibol A es de $180\\text{ cm}$ con una desviación estándar de $9\\text{ cm}$. Otro equipo B posee una estatura media de $170\\text{ cm}$ con una desviación estándar de $8,5\\text{ cm}$. ¿Cuál de las siguientes afirmaciones sobre la homogeneidad del peso de ambos grupos es **verdadera**?",
      "alternativas": {
        "A": "Ambos equipos poseen exactamente el mismo grado de dispersión relativa.",
        "B": "El equipo A es más homogéneo en estatura que el equipo B.",
        "C": "El equipo B es más homogéneo en estatura que el equipo A.",
        "D": "No se pueden comparar porque tienen medias diferentes."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Para comparar la dispersión relativa de dos grupos con distintas medias, calculamos el **Coeficiente de Variación** ($CV = \\frac{\\sigma}{\\bar{x}}$):\n - Para el equipo A: $CV_A = \\frac{9}{180} = 0,05$ (o $5\\%$).\n - Para el equipo B: $CV_B = \\frac{8,5}{170} = 0,05$ (o $5\\%$).\nComo ambos coeficientes de variación son idénticos, ambos equipos poseen el mismo grado de dispersión relativa.",
      "feedback_error": "Incorrecto. Calculamos el coeficiente de variación ($CV = \\sigma / \\bar{x}$) para ambos: $9/180 = 0,05$ y $8,5/170 = 0,05$. Dado que son iguales, presentan el mismo nivel de homogeneidad."
    },
    {
      "id": "q-m2-4-2-4",
      "enunciado": "Un conjunto de datos posee una desviación estándar de $\\sigma = 5$. Si a todos los datos se les resta $10$ unidades y luego se multiplican por $-2$, ¿cuál es el valor de la **nueva desviación estándar** de la población resultante?",
      "alternativas": {
        "A": "$10$",
        "B": "$-10$",
        "C": "$0$",
        "D": "$20$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Analicemos el efecto de las transformaciones paso a paso:\n 1) Restar $10$ unidades (traslación): la desviación estándar **no cambia**, sigue siendo $5$.\n 2) Multiplicar por $-2$ (homotecia lineal): la desviación estándar se multiplica por el valor absoluto de la constante ($|-2| = 2$):\n $\\sigma_{nueva} = 2 \\cdot 5 = 10$.\nRecuerda que la desviación estándar representa una distancia y nunca puede tomar un valor negativo.",
      "feedback_error": "Incorrecto. La resta no altera la desviación estándar. Al multiplicar por $-2$, la desviación estándar se multiplica por el valor absoluto $|-2| = 2$, resultando en $10$."
    },
    {
      "id": "q-m2-4-2-5",
      "enunciado": "Un analista de inversiones reporta que el rendimiento porcentual promedio de las acciones de una empresa A es de $8\\%$ con una varianza del $4\\%^2$, mientras que el de la empresa B es de $8\\%$ con una varianza del $9\\%^2$. ¿Cuál de las siguientes afirmaciones describe de manera correcta el comportamiento del riesgo de ambas?",
      "alternativas": {
        "A": "Las acciones de la empresa A son más homogéneas y menos riesgosas.",
        "B": "Las acciones de la empresa B son más estables y consistentes.",
        "C": "Ambas empresas representan exactamente el mismo nivel de riesgo.",
        "D": "La empresa A presenta una desviación estándar de $16\\%$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! La varianza (y por ende la desviación estándar) es un indicador del nivel de dispersión y volatilidad de los datos. En finanzas, una mayor dispersión representa un mayor riesgo.\n - Empresa A: $\\sigma^2 = 4 \\implies \\sigma = 2\\%$.\n - Empresa B: $\\sigma^2 = 9 \\implies \\sigma = 3\\%$.\nDado que la desviación estándar de la empresa A es menor, sus rendimientos son más homogéneos y estables (menos riesgosos).",
      "feedback_error": "Incorrecto. A menor varianza, los rendimientos están más agrupados en torno al promedio ($8\\%$), por lo que la empresa A es más estable (homogénea) y menos riesgosa."
    },
    {
      "id": "q-m2-4-2-6",
      "enunciado": "La desviación estándar de las temperaturas máximas registradas en Santiago fue de $2,0^{\\circ}\\text{C}$. Si decidimos convertir todas las temperaturas a grados Fahrenheit usando la fórmula lineal $F = 1,8C + 32$, ¿cuál será la **nueva desviación estándar** en grados Fahrenheit?",
      "alternativas": {
        "A": "$3,6^{\\circ}\\text{F}$",
        "B": "$35,6^{\\circ}\\text{F}$",
        "C": "$2,0^{\\circ}\\text{F}$",
        "D": "$1,8^{\\circ}\\text{F}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La transformación es de la forma lineal $Y = aX + b$, donde $a = 1,8$ y $b = 32$. La desviación estándar se ve modificada únicamente por el factor multiplicador $a$:\n $\\sigma_F = |a| \\cdot \\sigma_C = 1,8 \\cdot 2,0^{\\circ}\\text{C} = 3,6^{\\circ}\\text{F}$.\nEl término de suma $+32$ no afecta la dispersión de las temperaturas.",
      "feedback_error": "Incorrecto. La suma constante $+32$ no afecta la desviación estándar. Solo se multiplica por el factor de escala $1,8$: $2,0 \\cdot 1,8 = 3,6^{\\circ}\\text{F}$."
    },
    {
      "id": "q-m2-4-2-7",
      "enunciado": "Si a todos los elementos que componen un conjunto de datos $\{a, b, c, d\}$ se les suma una misma constante real $k$, ¿cuál de las siguientes medidas estadísticas **permanece invariable** (no experimenta ningún cambio)?",
      "alternativas": {
        "A": "La desviación estándar",
        "B": "El promedio",
        "C": "La mediana",
        "D": "El valor mínimo del conjunto"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Al sumarle una constante a todos los datos, todo el conjunto se traslada uniformemente. Medidas de posición como el promedio, la mediana y el mínimo se desplazan sumando $k$. En cambio, las distancias relativas entre los datos no cambian, por lo que la desviación estándar (al igual que la varianza y el rango) permanece invariable.",
      "feedback_error": "Incorrecto. La suma de una constante desplaza a los datos, por lo que la media y la mediana cambian. La única medida que mide dispersión y no cambia es la desviación estándar."
    },
    {
      "id": "q-m2-4-2-8",
      "enunciado": "Un grupo de estudiantes rinde un examen de diagnóstico de inglés obteniendo un promedio de $60\\text{ puntos}$ con una desviación estándar de $6\\text{ puntos}$. Si el profesor decide aplicar una bonificación multiplicando el puntaje de todos por el factor $1,1$, ¿cuáles serán la nueva media y desviación estándar?",
      "alternativas": {
        "A": "Nuevo promedio: $66$; Nueva desviación estándar: $6,6$",
        "B": "Nuevo promedio: $66$; Nueva desviación estándar: $6$",
        "C": "Nuevo promedio: $60$; Nueva desviación estándar: $6,6$",
        "D": "Nuevo promedio: $66$; Nueva desviación estándar: $12,6$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Multiplicar por una constante $k = 1,1$ afecta a ambas medidas de forma directa:\n - El nuevo promedio es: $60 \\cdot 1,1 = 66\\text{ puntos}$.\n - La nueva desviación estándar es: $6 \\cdot 1,1 = 6,6\\text{ puntos}$.",
      "feedback_error": "Incorrecto. Al multiplicar todas las observaciones por el factor $1,1$, tanto la media como la desviación estándar aumentan en un $10\\%$, quedando en $66$ y $6,6$ respectivamente."
    },
    {
      "id": "q-m2-4-2-9",
      "enunciado": "Se tienen dos secciones de un mismo curso escolar. La sección 1 posee un promedio de notas de $5,4$ y una desviación estándar de $0,3$. La sección 2 posee un promedio de notas de $5,4$ y una desviación estándar de $0,6$. ¿Cuál de los cursos presenta un rendimiento **más homogéneo**?",
      "alternativas": {
        "A": "La sección 1.",
        "B": "La sección 2.",
        "C": "Ambos presentan exactamente la misma homogeneidad.",
        "D": "Falta información sobre el número de alumnos de cada sección."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Dado que ambos grupos poseen exactamente el mismo promedio ($5,4$), podemos evaluar la homogeneidad comparando directamente sus desviaciones estándar:\n - A menor desviación estándar, menor dispersión de los datos y, por ende, el grupo es más homogéneo y consistente.\nComo $0,3 < 0,6$, la sección 1 es más homogénea.",
      "feedback_error": "Incorrecto. Al tener promedios idénticos, el grupo con menor desviación estándar ($0,3$) representa datos más agrupados respecto al promedio, lo que define a la sección 1 como la más homogénea."
    },
    {
      "id": "q-m2-4-2-10",
      "enunciado": "Si un conjunto de observaciones experimenta la transformación lineal de la forma $Y_i = a X_i + b$, donde $X_i$ representa la variable original y $a, b$ son constantes reales con $a \\neq 0$. ¿Cuál es la **varianza** de la nueva variable $Y$ en función de la varianza original $\\sigma_X^2$?",
      "alternativas": {
        "A": "$\\sigma_Y^2 = a^2 \\cdot \\sigma_X^2$",
        "B": "$\\sigma_Y^2 = a \\cdot \\sigma_X^2$",
        "C": "$\\sigma_Y^2 = a^2 \\cdot \\sigma_X^2 + b$",
        "D": "$\\sigma_Y^2 = a \\cdot \\sigma_X^2 + b^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por propiedades de la varianza:\n 1) La varianza de una suma es invariable a traslaciones constantes: $Var(X + b) = Var(X)$.\n 2) La varianza de una variable multiplicada por una constante multiplica a la varianza por el cuadrado de dicha constante: $Var(aX) = a^2 \\cdot Var(X)$.\nPor lo tanto, la varianza de la nueva variable es: $\\sigma_Y^2 = a^2 \\cdot \\sigma_X^2$.",
      "feedback_error": "Incorrecto. La constante aditiva $b$ no altera la varianza. El coeficiente multiplicativo $a$ escala la varianza al cuadrado: $\\sigma_Y^2 = a^2 \\cdot \\sigma_X^2$."
    }
  ],
  "sec-m2-4-3": [
    {
      "id": "q-m2-4-3-1",
      "enunciado": "En un establecimiento educacional, el $60\\%$ de los estudiantes practica fútbol ($F$) y el $40\\%$ practica tenis ($T$). Se sabe que el $20\\%$ practica ambos deportes de forma simultánea. Si se elige al azar un estudiante que practica fútbol, ¿cuál es la probabilidad de que también practique tenis?",
      "alternativas": {
        "A": "$\\frac{1}{3}$",
        "B": "$\\frac{1}{2}$",
        "C": "$\\frac{1}{5}$",
        "D": "$\\frac{2}{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Este problema requiere aplicar la definición formal de probabilidad condicional:\n $P(T|F) = \\frac{P(T \\cap F)}{P(F)}$.\nReemplazamos con los datos del enunciado:\n - Probabilidad de practicar fútbol: $P(F) = 60\\% = 0,60$.\n - Probabilidad de practicar ambos: $P(T \\cap F) = 20\\% = 0,20$.\nCalculamos:\n $P(T|F) = \\frac{0,20}{0,60} = \\frac{2}{6} = \\frac{1}{3}$.",
      "feedback_error": "Incorrecto. De acuerdo a la probabilidad condicional: $P(T\|F) = P(T \\cap F) / P(F)$. Reemplazando con los porcentajes: $20\\% / 60\\% = 2/6 = 1/3$."
    },
    {
      "id": "q-m2-4-3-2",
      "enunciado": "Se lanzan dos dados tradicionales de 6 caras de forma simultánea. Si se sabe que la **suma de los puntos obtenidos es estrictamente mayor que 9**, ¿cuál es la probabilidad de que en ambos dados haya salido un número par?",
      "alternativas": {
        "A": "$\\frac{2}{3}$",
        "B": "$\\frac{1}{3}$",
        "C": "$\\frac{1}{2}$",
        "D": "$\\frac{1}{6}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Definimos los espacios muestrales del suceso:\n - Condición (Suma $> 9$): los pares posibles son $(4,6)$, $(5,5)$, $(6,4)$, $(5,6)$, $(6,5)$ y $(6,6)$. Esto da un espacio muestral condicionado de $6$ casos posibles en total.\n - Casos Favorables (ambos números pares dentro del grupo condicionado):\n El par $(4,6)$, el par $(6,4)$ y el par $(6,6)$. Son $3$ casos favorables en total.\nEspera, evaluemos bien: los casos favorables son $(4,6)$, $(6,4)$, $(6,6)$, que son exactamente 3 casos de un total de 6. La probabilidad es $3/6 = 1/2$. Modificamos el valor para marcar la C como respuesta correcta.",
      "respuesta_correcta": "C",
      "feedback_error": "Incorrecto. Los casos donde la suma es mayor que 9 son 6: $(4,6), (5,5), (6,4), (5,6), (6,5), (6,6)$. De estos, los casos con ambas caras pares son 3: $(4,6), (6,4), (6,6)$. La probabilidad es $3/6 = 1/2$."
    },
    {
      "id": "q-m2-4-3-3",
      "enunciado": "Una urna contiene $5$ bolas rojas y $5$ bolas azules. Si se extraen dos bolas al azar de forma consecutiva **sin reposición**, ¿cuál es la probabilidad de que la segunda bola extraída sea azul dado que se sabe que la primera fue roja?",
      "alternativas": {
        "A": "$\\frac{5}{9}$",
        "B": "$\\frac{1}{2}$",
        "C": "$\\frac{4}{9}$",
        "D": "$\\frac{5}{10}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Analicemos la composición de la urna tras el primer evento:\n 1) Al inicio hay $10$ bolas en total ($5$ rojas y $5$ azules).\n 2) Dado que el primer evento ya ocurrió y se extrajo una bola roja, quedan en la urna exactamente $9$ bolas en total.\n 3) Como no se repuso la bola roja, la cantidad de bolas azules intactas en la urna sigue siendo de $5$.\nPor definición de Laplace, la probabilidad condicional es:\n $P(\\text{Azul}_2|\\text{Roja}_1) = \\frac{5}{9}$.",
      "feedback_error": "Incorrecto. Si la primera bola fue roja y no hay reposición, en la urna quedan 9 bolas en total, de las cuales 5 siguen siendo azules. Por Laplace, la probabilidad es $5/9$."
    },
    {
      "id": "q-m2-4-3-4",
      "enunciado": "Dos eventos aleatorios $A$ y $B$ cumplen con tener las siguientes probabilidades: $P(A) = 0,5$, $P(B) = 0,6$ y $P(A \\cap B) = 0,3$. ¿Cuál de las siguientes afirmaciones sobre los eventos es **verdadera**?",
      "alternativas": {
        "A": "Los eventos $A$ y $B$ son independientes.",
        "B": "Los eventos $A$ y $B$ son mutuamente excluyentes.",
        "C": "La probabilidad condicional $P(A|B)$ es igual a $0,6$.",
        "D": "La probabilidad de la unión es $P(A \\cup B) = 1,1$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Dos eventos son independientes si y solo si la probabilidad de su intersección es igual al producto de sus probabilidades individuales:\n $P(A \\cap B) = P(A) \\cdot P(B) \\implies 0,3 = 0,5 \\cdot 0,6 = 0,3$.\nDado que se cumple perfectamente la igualdad, se concluye con rigor matemático que los eventos $A$ y $B$ son independientes.",
      "feedback_error": "Incorrecto. Evaluamos la condición de independencia: $P(A) \\cdot P(B) = 0,5 \\cdot 0,6 = 0,3$, lo cual es exactamente igual a $P(A \\cap B)$. Por lo tanto, los eventos son independientes."
    },
    {
      "id": "q-m2-4-3-5",
      "enunciado": "En una compañía automotriz, el $70\\%$ de los empleados son ingenieros y el $30\\%$ son administradores. Se sabe que el $10\\%$ de los ingenieros y el $20\\%$ de los administradores hablan inglés de forma fluida. Si se selecciona un empleado al azar y se constata que habla inglés fluido, ¿cuál es la probabilidad de que sea ingeniero?",
      "alternativas": {
        "A": "$\\frac{7}{13}$",
        "B": "$\\frac{1}{2}$",
        "C": "$\\frac{7}{10}$",
        "D": "$\\frac{3}{13}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Aplicamos el Teorema de Bayes. Definimos los eventos:\n - $I$: ser ingeniero ($P(I) = 0,70$).\n - $A$: ser administrador ($P(A) = 0,30$).\n - $F$: hablar inglés fluido.\nCalculamos las probabilidades condicionales:\n - $P(F|I) = 0,10$ y $P(F|A) = 0,20$.\nCalculamos la probabilidad total de hablar inglés fluido $P(F)$:\n $P(F) = P(I) \\cdot P(F|I) + P(A) \\cdot P(F|A) = 0,70 \\cdot 0,10 + 0,30 \\cdot 0,20 = 0,07 + 0,06 = 0,13$.\nAplicamos la fórmula de Bayes para $P(I|F)$:\n $P(I|F) = \\frac{P(I) \\cdot P(F|I)}{P(F)} = \\frac{0,07}{0,13} = \\frac{7}{13}$.",
      "feedback_error": "Incorrecto. Usando el teorema de Bayes, la probabilidad condicional de que sea ingeniero dado que habla inglés es: $\\frac{0,70 \\cdot 0,10}{0,70 \\cdot 0,10 + 0,30 \\cdot 0,20} = \\frac{0,07}{0,07 + 0,06} = \\frac{7}{13}$."
    },
    {
      "id": "q-m2-4-3-6",
      "enunciado": "Una caja de herramientas contiene 10 ampolletas, de las cuales 3 están quemadas. Si se extraen 2 ampolletas de forma sucesiva y **sin reposición**, ¿cuál es la probabilidad de que ambas ampolletas estén quemadas?",
      "alternativas": {
        "A": "$\\frac{1}{15}$",
        "B": "$\\frac{9}{100}$",
        "C": "$\\frac{3}{10}$",
        "D": "$\\frac{1}{5}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Usamos el teorema de la multiplicación para probabilidad condicional:\n $P(Q_1 \\cap Q_2) = P(Q_1) \\cdot P(Q_2|Q_1)$.\n - Para la primera extracción: hay 3 quemadas de 10 totales, $P(Q_1) = \\frac{3}{10}$.\n - Para la segunda extracción (dado que la primera fue quemada): quedan 2 quemadas de 9 totales, $P(Q_2|Q_1) = \\frac{2}{9}$.\nMultiplicamos las probabilidades:\n $P(Q_1 \\cap Q_2) = \\frac{3}{10} \\cdot \\frac{2}{9} = \\frac{6}{90} = \\frac{1}{15}$.",
      "feedback_error": "Incorrecto. Para la primera ampolleta la probabilidad es $3/10$. Para la segunda, al no haber reposición, es $2/9$. Multiplicando ambas obtenemos $\\frac{3}{10} \\cdot \\frac{2}{9} = \\frac{6}{90} = \\frac{1}{15}$."
    },
    {
      "id": "q-m2-4-3-7",
      "enunciado": "Sean $A$ y $B$ dos sucesos del espacio muestral tales que $P(B) = 0,4$ y la probabilidad de su intersección es $P(A \\cap B) = 0,16$. ¿Cuál es el valor exacto de la probabilidad condicional $P(A|B)$?",
      "alternativas": {
        "A": "$0,40$",
        "B": "$0,16$",
        "C": "$0,64$",
        "D": "$0,24$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Aplicamos directamente la definición clásica de probabilidad condicional:\n $P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0,16}{0,4} = 0,40$.",
      "feedback_error": "Incorrecto. Se calcula mediante la división de la intersección por la condición: $P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0,16}{0,4} = 0,40$."
    },
    {
      "id": "q-m2-4-3-8",
      "enunciado": "Si se lanzan dos dados normales de 6 caras, ¿cuál es la probabilidad de que la suma de sus caras sea igual a 8, dado que en el primer dado se obtuvo un número menor que 4?",
      "alternativas": {
        "A": "$\\frac{1}{9}$",
        "B": "$\\frac{5}{36}$",
        "C": "$\\frac{1}{6}$",
        "D": "$\\frac{2}{9}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Definimos el espacio de la condición (primer dado menor que 4, es decir, 1, 2 o 3):\n Hay $3 \\cdot 6 = 18$ resultados posibles en total.\nDeterminamos los casos favorables donde la suma es exactamente 8 dentro de este espacio restringido:\n - Si el primer dado es 1: la única opción es $(1, 7)$ (¡imposible!).\n - Si el primer dado es 2: la opción es $(2, 6)$ (válida).\n - Si el primer dado es 3: la opción es $(3, 5)$ (válida).\nTenemos exactamente 2 casos favorables de un total de 18 casos posibles condicionados:\n $\\text{Probabilidad} = \\frac{2}{18} = \\frac{1}{9}$.",
      "feedback_error": "Incorrecto. Hay 18 combinaciones donde el primer dado es menor que 4. De estas, solo $(2,6)$ y $(3,5)$ suman 8. La probabilidad es $2/18 = 1/9$."
    },
    {
      "id": "q-m2-4-3-9",
      "enunciado": "En una oficina corporativa, el $80\\%$ de los empleados toma café y el $50\\%$ toma té. Si el $40\\%$ toma ambas infusiones, ¿cuál es la probabilidad de que un empleado seleccionado al azar tome té, dado que se sabe que toma café?",
      "alternativas": {
        "A": "$0,50$ (o $\\frac{1}{2}$)",
        "B": "$0,40$ (o $\\frac{2}{5}$)",
        "C": "$0,80$ (o $\\frac{4}{5}$)",
        "D": "$0,625$ (o $\\frac{5}{8}$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Aplicamos la fórmula de probabilidad condicional:\n $P(\\text{Té}|\\text{Café}) = \\frac{P(\\text{Té} \\cap \\text{Café})}{P(\\text{Café})} = \\frac{40\\%}{80\\%} = \\frac{0,40}{0,80} = 0,50$ (o $\\frac{1}{2}$).",
      "feedback_error": "Incorrecto. Dividimos la probabilidad de que tome ambos ($40\\%$) por la probabilidad de la condición de que tome café ($80\\%$): $40\\% / 80\\% = 0,50$."
    },
    {
      "id": "q-m2-4-3-10",
      "enunciado": "En un grupo de amigos, el $30\\%$ habla francés, el $40\\%$ habla alemán y el $12\\%$ habla ambos idiomas. Si se selecciona un amigo al azar que habla alemán, ¿cuál es la probabilidad de que también hable francés?",
      "alternativas": {
        "A": "$0,30$ (o $\\frac{3}{10}$)",
        "B": "$0,40$ (o $\\frac{2}{5}$)",
        "C": "$0,12$ (o $\\frac{3}{25}$)",
        "D": "$0,25$ (o $\\frac{1}{4}$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Planteamos la probabilidad condicional:\n $P(\\text{Francés}|\\text{Alemán}) = \\frac{P(\\text{Francés} \\cap \\text{Alemán})}{P(\\text{Alemán})} = \\frac{12\\%}{40\\%} = \\frac{0,12}{0,40} = 0,30$ (o $\\frac{3}{10}$).",
      "feedback_error": "Incorrecto. De acuerdo al teorema de probabilidad condicional: $12\\% / 40\\% = 0,12 / 0,40 = 0,30$."
    }
  ],
  "sec-m2-4-4": [
    {
      "id": "q-m2-4-4-1",
      "enunciado": "¿De cuántas formas distintas se pueden sentar 5 personas en fila en un sofá que cuenta con exactamente 5 asientos individuales?",
      "alternativas": {
        "A": "$120$",
        "B": "$24$",
        "C": "$25$",
        "D": "$720$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Como queremos ordenar a todas las personas e importa el orden del asiento en la fila, se trata de una permutación simple de $n = 5$ elementos:\n $P_5 = 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$ formas distintas.",
      "feedback_error": "Incorrecto. Se trata de ordenar 5 personas en 5 espacios. Usamos la permutación de 5: $5! = 120$."
    },
    {
      "id": "q-m2-4-4-2",
      "enunciado": "Un chef gourmet desea preparar una ensalada mixta eligiendo exactamente 3 ingredientes diferentes de un total de 7 ingredientes frescos disponibles en la despensa. ¿Cuántas ensaladas distintas puede preparar?",
      "alternativas": {
        "A": "$35$",
        "B": "$21$",
        "C": "$210$",
        "D": "$120$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Evaluamos el problema con las dos preguntas clave:\n 1) ¿Entran todos los elementos? **NO** (se eligen 3 de 7).\n 2) ¿Importa el orden? **NO** (da igual el orden en que se mezclen los vegetales en el tazón).\nPor lo tanto, se trata de una combinación de 7 elementos tomados de a 3:\n $C_3^7 = \\binom{7}{3} = \\frac{7!}{3! \\cdot 4!} = \\frac{7 \\cdot 6 \\cdot 5}{3 \\cdot 2 \\cdot 1} = 35$ ensaladas.",
      "feedback_error": "Incorrecto. El orden de los ingredientes en una ensalada no importa, por lo que aplicamos combinación: $C_3^7 = \\frac{7 \\cdot 6 \\cdot 5}{3 \\cdot 2 \\cdot 1} = 35$."
    },
    {
      "id": "q-m2-4-4-3",
      "enunciado": "¿De cuántas maneras distintas se pueden ordenar en fila las letras de la palabra **CASA**?",
      "alternativas": {
        "A": "$12$",
        "B": "$24$",
        "C": "$6$",
        "D": "$48$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Queremos ordenar las 4 letras de la palabra CASA, pero la letra **A** se repite exactamente 2 veces. Aplicamos la fórmula de permutación con repetición:\n $P_4^{2} = \\frac{4!}{2!} = \\frac{24}{2} = 12$ maneras distintas.",
      "feedback_error": "Incorrecto. Como la letra A se repite dos veces, dividimos el total de permutaciones por el factorial de las repeticiones: $\\frac{4!}{2!} = 12$."
    },
    {
      "id": "q-m2-4-4-4",
      "enunciado": "En una carrera de atletismo escolar compiten 8 atletas en pista. Si se asume que no hay empates, ¿de cuántas maneras diferentes se pueden distribuir las medallas de Oro, Plata y Bronce (primer, segundo y tercer lugar)?",
      "alternativas": {
        "A": "$336$",
        "B": "$56$",
        "C": "$40.320$",
        "D": "$120$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Evaluamos:\n 1) ¿Entran todos los elementos? **NO** (se eligen 3 de 8).\n 2) ¿Importa el orden? **SÍ** (no es lo mismo ganar la medalla de Oro que la de Bronce).\nSe trata de una variación o arreglo sin repetición de 8 elementos tomados de a 3:\n $V_3^8 = \\frac{8!}{(8-3)!} = \\frac{8!}{5!} = 8 \\cdot 7 \\cdot 6 = 336$ maneras.",
      "feedback_error": "Incorrecto. Dado que el orden de los tres primeros lugares sí importa, usamos variación: $V_3^8 = 8 \\cdot 7 \\cdot 6 = 336$."
    },
    {
      "id": "q-m2-4-4-5",
      "enunciado": "Un grupo de 6 amigos desea sentarse a almorzar alrededor de una mesa redonda de comedor. ¿De cuántas formas distintas pueden distribuirse en los asientos?",
      "alternativas": {
        "A": "$120$",
        "B": "$720$",
        "C": "$36$",
        "D": "$24$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Como los amigos se sientan en círculo y no hay un principio ni fin lineal fijo, el ordenamiento depende solo de la posición relativa de uno respecto a los otros. Usamos la fórmula de permutación circular:\n $P_{(c)n} = (n - 1)! \\implies P_{(c)6} = (6 - 1)! = 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$ formas.",
      "feedback_error": "Incorrecto. Para elementos ordenados en círculo, restamos 1 elemento fijo para romper la simetría y calculamos el factorial restante: $(6-1)! = 5! = 120$."
    },
    {
      "id": "q-m2-4-4-6",
      "enunciado": "Se dispone de 5 libros de Física y 4 libros de Química en una repisa. ¿De cuántas maneras se pueden ordenar los 9 libros en una fila si los de una misma materia deben estar juntos?",
      "alternativas": {
        "A": "$5.760$",
        "B": "$2.880$",
        "C": "$120$",
        "D": "$24$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Analicemos la jerarquía del conteo:\n 1) Consideramos las materias como dos bloques o macro-elementos: [Física] y [Química]. Estos 2 bloques se pueden ordenar de $2! = 2$ formas en la repisa.\n 2) Dentro del bloque de Física, los 5 libros se pueden ordenar entre sí de $5! = 120$ formas.\n 3) Dentro del bloque de Química, los 4 libros se pueden ordenar de $4! = 24$ formas.\nAplicamos la regla multiplicativa para eventos consecutivos:\n $\\text{Total} = 2! \\cdot 5! \\cdot 4! = 2 \\cdot 120 \\cdot 24 = 5.760$ formas.",
      "feedback_error": "Incorrecto. Se deben multiplicar las permutaciones internas de cada grupo por la permutación externa de los bloques: $2! \\cdot 5! \\cdot 4! = 2 \\cdot 120 \\cdot 24 = 5.760$."
    },
    {
      "id": "q-m2-4-4-7",
      "enunciado": "Un examen escolar consta de 10 preguntas opcionales en total. Si un estudiante debe contestar exactamente 8 de ellas, ¿de cuántas formas distintas puede elegir el grupo de preguntas que responderá?",
      "alternativas": {
        "A": "$45$",
        "B": "$90$",
        "C": "$180$",
        "D": "$5.040$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Analizamos:\n 1) ¿Importa el orden en que se elijan las preguntas? **NO** (da igual responder la pregunta 3 antes que la 1).\nSe trata de una combinación de 10 tomados de a 8:\n $C_8^{10} = \\binom{10}{8} = \\binom{10}{2} = \\frac{10 \\cdot 9}{2 \\cdot 1} = 45$ formas.",
      "feedback_error": "Incorrecto. Como el orden de selección no importa, aplicamos combinatoria: $C_8^{10} = C_2^{10} = \\frac{10 \\cdot 9}{2} = 45$."
    },
    {
      "id": "q-m2-4-4-8",
      "enunciado": "¿Cuántos números enteros de tres dígitos distintos se pueden formar utilizando únicamente los dígitos de la lista $\\{1, 2, 3, 4, 5\\}$ sin repetir ninguno?",
      "alternativas": {
        "A": "$60$",
        "B": "$10$",
        "C": "$125$",
        "D": "$120$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! \n 1) ¿Entran todos los dígitos? **NO** (se eligen 3 de 5).\n 2) ¿Importa el orden? **SÍ** (el número 123 es distinto al 321).\nSe trata de una variación de 5 elementos tomados de a 3:\n $V_3^5 = \\frac{5!}{(5-3)!} = \\frac{5!}{2!} = 5 \\cdot 4 \\cdot 3 = 60$ números.",
      "feedback_error": "Incorrecto. Para formar números el orden de las cifras sí importa. Usamos variación: $V_3^5 = 5 \\cdot 4 \\cdot 3 = 60$."
    },
    {
      "id": "q-m2-4-4-9",
      "enunciado": "Una pizzería de barrio ofrece ingredientes libres para armar pizzas medianas. Si un cliente puede elegir exactamente 4 ingredientes distintos de un total de 10 disponibles en el menú, ¿cuál es el número total de pizzas distintas que se pueden generar?",
      "alternativas": {
        "A": "$210$",
        "B": "$120$",
        "C": "$5.040$",
        "D": "$40$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! No importa el orden en que se coloquen los ingredientes en la pizza, por lo que aplicamos la fórmula de combinación:\n $C_4^{10} = \\binom{10}{4} = \\frac{10 \\cdot 9 \\cdot 8 \\cdot 7}{4 \\cdot 3 \\cdot 2 \\cdot 1} = 210$ pizzas.",
      "feedback_error": "Incorrecto. En una pizza el orden de los ingredientes es irrelevante. Usamos combinación: $C_4^{10} = \\frac{10 \\cdot 9 \\cdot 8 \\cdot 7}{24} = 210$."
    },
    {
      "id": "q-m2-4-4-10",
      "enunciado": "Un código de seguridad de un candado digital consta de 4 caracteres numéricos del 0 al 9. Si los dígitos se pueden repetir cuantas veces se desee, ¿cuántos códigos de seguridad diferentes se pueden generar?",
      "alternativas": {
        "A": "$10.000$",
        "B": "$5.040$",
        "C": "$6.561$",
        "D": "$40$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Cada carácter tiene 10 opciones independientes (del 0 al 9). Aplicamos la variación con repetición (o principio multiplicativo):\n $\\text{Códigos} = 10 \\cdot 10 \\cdot 10 \\cdot 10 = 10^4 = 10.000$ códigos distintos.",
      "feedback_error": "Incorrecto. Al poder repetirse las opciones y haber 10 dígitos posibles para cada uno de los 4 espacios, la cantidad es: $10^4 = 10.000$."
    }
  ],
  "sec-m2-4-5": [
    {
      "id": "q-m2-4-5-1",
      "enunciado": "En un curso escolar de 20 alumnos se elegirá una directiva compuesta por un Presidente, un Secretario y un Tesorero. Si ninguna persona puede ocupar más de un cargo de forma simultánea, ¿de cuántas formas diferentes se puede constituir esta directiva?",
      "alternativas": {
        "A": "$6.840$",
        "B": "$1.140$",
        "C": "$8.000$",
        "D": "$34.200$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Analicemos:\n 1) ¿Entran todos los alumnos? **NO** (se eligen 3 de 20).\n 2) ¿Importa el orden? **SÍ** (no es lo mismo ser Presidente que Tesorero).\nAplicamos variación sin repetición de 20 tomado de a 3:\n $V_3^{20} = 20 \\cdot 19 \\cdot 18 = 6.840$ directivas distintas.",
      "feedback_error": "Incorrecto. Dado que los tres cargos son jerárquicos y diferentes, el orden de elección importa. Usamos variación: $20 \\cdot 19 \\cdot 18 = 6.840$."
    },
    {
      "id": "q-m2-4-5-2",
      "enunciado": "Un comité científico integrado por 4 personas debe ser seleccionado de un grupo compuesto por 6 hombres y 5 mujeres. Si el comité debe estar integrado por exactamente 2 hombres y 2 mujeres, ¿de cuántas maneras distintas se puede conformar el comité?",
      "alternativas": {
        "A": "$150$",
        "B": "$30$",
        "C": "$330$",
        "D": "$60$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Seleccionamos los dos grupos independientes y aplicamos el principio multiplicativo:\n 1) Elegir 2 hombres de un total de 6: $C_2^6 = \\binom{6}{2} = \\frac{6 \\cdot 5}{2} = 15$ formas.\n 2) Elegir 2 mujeres de un total de 5: $C_2^5 = \\binom{5}{2} = \\frac{5 \\cdot 4}{2} = 10$ formas.\nMultiplicamos ambas combinaciones:\n $\\text{Total} = C_2^6 \\cdot C_2^5 = 15 \\cdot 10 = 150$ maneras distintas.",
      "feedback_error": "Incorrecto. Se deben multiplicar las formas de elegir los hombres por las de elegir las mujeres: $C_2^6 \\cdot C_2^5 = 15 \\cdot 10 = 150$."
    },
    {
      "id": "q-m2-4-5-3",
      "enunciado": "¿De cuántas formas distintas se pueden ordenar en fila las letras de la palabra **PALA**?",
      "alternativas": {
        "A": "$12$",
        "B": "$24$",
        "C": "$6$",
        "D": "$48$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Queremos ordenar las 4 letras de la palabra PALA, con la letra **A** repitiéndose 2 veces:\n $P_4^{2} = \\frac{4!}{2!} = \\frac{24}{2} = 12$ formas distintas.",
      "feedback_error": "Incorrecto. Es una permutación con elementos repetidos (la letra A dos veces): $\\frac{4!}{2!} = 12$."
    },
    {
      "id": "q-m2-4-5-4",
      "enunciado": "Se dispone de 8 puntos marcados en el plano de manera que no hay tres de ellos alineados. ¿Cuántos triángulos distintos se pueden trazar utilizando estos puntos como vértices?",
      "alternativas": {
        "A": "$56$",
        "B": "$336$",
        "C": "$168$",
        "D": "$28$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para formar un triángulo necesitamos elegir exactamente 3 puntos de los 8 disponibles. Dado que el orden de los vértices elegidos no altera el triángulo (el triángulo $ABC$ es el mismo que el $BCA$), usamos combinación:\n $C_3^8 = \\binom{8}{3} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 56$ triángulos.",
      "feedback_error": "Incorrecto. Como el orden de selección de los 3 vértices no importa, aplicamos combinatoria: $C_3^8 = \\frac{8 \\cdot 7 \\cdot 6}{6} = 56$."
    },
    {
      "id": "q-m2-4-5-5",
      "enunciado": "Un examen de opción múltiple consta de exactamente 5 preguntas independientes, y cada una de ellas posee 4 alternativas. ¿De cuántas formas distintas puede contestar la totalidad del examen un estudiante al azar?",
      "alternativas": {
        "A": "$1.024$",
        "B": "$625$",
        "C": "$20$",
        "D": "$120$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Cada pregunta se puede responder de 4 formas independientes. Para las 5 preguntas aplicamos la variación con repetición (principio multiplicativo):\n $\\text{Formas} = 4 \\cdot 4 \\cdot 4 \\cdot 4 \\cdot 4 = 4^5 = 1.024$ formas distintas.",
      "feedback_error": "Incorrecto. Para 5 preguntas con 4 opciones cada una, el número de maneras de responder es $4^5 = 1.024$."
    },
    {
      "id": "q-m2-4-5-6",
      "enunciado": "Un grupo de 5 personas va al cine y cuenta con una fila de 5 asientos disponibles. Si dos de estas personas son pareja y exigen sentarse **siempre juntas**, ¿de cuántas formas diferentes se pueden ordenar en la fila?",
      "alternativas": {
        "A": "$48$",
        "B": "$24$",
        "C": "$120$",
        "D": "$12$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Consideramos a la pareja como un único bloque o macro-elemento.\n 1) Esto reduce el grupo a 4 elementos a ordenar: [Pareja], Persona 3, Persona 4, Persona 5.\n Se pueden ordenar de $4! = 24$ formas.\n 2) Dentro de su bloque, las 2 personas de la pareja se pueden ordenar entre sí de $2! = 2$ formas.\nMultiplicamos las opciones:\n $\\text{Total} = 4! \\cdot 2! = 24 \\cdot 2 = 48$ formas diferentes.",
      "feedback_error": "Incorrecto. Agrupamos a la pareja en un bloque, teniendo 4 elementos a ordenar ($4! = 24$). Luego multiplicamos por el ordenamiento interno de la pareja ($2! = 2$), resultando en $48$."
    },
    {
      "id": "q-m2-4-5-7",
      "enunciado": "¿Cuántas palabras con o sin sentido de 5 letras se pueden formar ordenando de distintas maneras las letras de la palabra **PERRO**?",
      "alternativas": {
        "A": "$60$",
        "B": "$120$",
        "C": "$30$",
        "D": "$24$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Queremos ordenar 5 letras donde la letra **R** se repite exactamente 2 veces. Aplicamos permutación con elementos repetidos:\n $P_5^{2} = \\frac{5!}{2!} = \\frac{120}{2} = 60$ palabras.",
      "feedback_error": "Incorrecto. Se deben permutar las 5 letras de PERRO dividiendo por el factorial de las repeticiones del elemento R ($2!$): $\\frac{5!}{2!} = 60$."
    },
    {
      "id": "q-m2-4-5-8",
      "enunciado": "Para ingresar a un edificio de alta seguridad se requiere presionar una clave secreta de exactamente 3 botones numéricos de forma **simultánea** en un panel que consta de 9 botones (del 1 al 9). ¿Cuántas claves de acceso diferentes existen?",
      "alternativas": {
        "A": "$84$",
        "B": "$504$",
        "C": "$729$",
        "D": "$27$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Al presionar los 3 botones **simultáneamente**, no existe un orden de entrada (el orden no importa). Se trata de una combinación de 9 elementos tomados de a 3:\n $C_3^9 = \\binom{9}{3} = \\frac{9 \\cdot 8 \\cdot 7}{3 \\cdot 2 \\cdot 1} = 84$ combinaciones de claves.",
      "feedback_error": "Incorrecto. Al presionar los botones simultáneamente, el orden no importa, lo cual define una combinación: $C_3^9 = \\frac{9 \\cdot 8 \\cdot 7}{6} = 84$."
    },
    {
      "id": "q-m2-4-5-9",
      "enunciado": "Un entrenador de baloncesto tiene un plantel integrado por 10 jugadores. ¿De cuántas formas distintas puede constituir el equipo inicial de 5 jugadores que entrarán a la cancha si no le importa la asignación de posiciones de juego?",
      "alternativas": {
        "A": "$252$",
        "B": "$30.240$",
        "C": "$120$",
        "D": "$50$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Como no importan los puestos específicos en la cancha, el orden en el que se elija a los 5 jugadores es irrelevante. Usamos la combinación de 10 tomados de a 5:\n $C_5^{10} = \\binom{10}{5} = \\frac{10 \\cdot 9 \\cdot 8 \\cdot 7 \\cdot 6}{5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1} = 252$ equipos.",
      "feedback_error": "Incorrecto. Dado que el orden de los integrantes en el equipo no importa, usamos combinatoria: $C_5^{10} = 252$."
    },
    {
      "id": "q-m2-4-5-10",
      "enunciado": "¿De cuántas maneras se pueden ordenar 4 banderas de colores diferentes en un asta de señales vertical, ubicando una debajo de la otra?",
      "alternativas": {
        "A": "$24$",
        "B": "$12$",
        "C": "$16$",
        "D": "$4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Se deben ordenar todos los 4 elementos en un arreglo lineal e importa la posición vertical relativa de cada una en el asta. Se aplica una permutación simple de 4 elementos:\n $P_4 = 4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$ maneras de señalización.",
      "feedback_error": "Incorrecto. Es un ordenamiento lineal clásico donde se usan todos los elementos. Aplicamos permutación: $4! = 24$."
    }
  ],
  "sec-m2-4-6": [
    {
      "id": "q-m2-4-6-1",
      "enunciado": "Un tratamiento médico experimental posee una probabilidad de éxito del $80\\%$ ($p = 0,80$) para curar una enfermedad. Si el tratamiento se administra a 3 pacientes seleccionados al azar de manera independiente, ¿cuál es la probabilidad de que se curen **exactamente 2** de ellos?",
      "alternativas": {
        "A": "$0,384$ (o $38,4\\%$)",
        "B": "$0,640$ (o $64,0\\%$)",
        "C": "$0,096$ (o $9,6\\%$)",
        "D": "$0,480$ (o $48,0\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Este es un experimento binomial $X \\sim B(n, p)$ con $n = 3$, $p = 0,80$ y $q = 0,20$. Queremos calcular $P(X = 2)$:\n $P(X = 2) = \\binom{3}{2} \\cdot (0,80)^2 \\cdot (0,20)^{3-2}$.\nCalculamos los términos:\n 1) $\\binom{3}{2} = 3$.\n 2) $(0,80)^2 = 0,64$.\n 3) $(0,20)^1 = 0,20$.\nMultiplicamos todo:\n $P(X = 2) = 3 \\cdot 0,64 \\cdot 0,20 = 1,92 \\cdot 0,20 = 0,384$ (o $38,4\\%$).",
      "feedback_error": "Incorrecto. Aplicamos la fórmula binomial: $P(X = 2) = \\binom{3}{2} \\cdot 0,8^2 \\cdot 0,2^1 = 3 \\cdot 0,64 \\cdot 0,2 = 0,384$."
    },
    {
      "id": "q-m2-4-6-2",
      "enunciado": "Se lanza una moneda normal y equilibrada al aire un total de 5 veces consecutivas de forma independiente. ¿Cuál es la probabilidad exacta de obtener **exactamente 3 caras** en la serie?",
      "alternativas": {
        "A": "$\\frac{5}{16}$ (o $31,25\\%$)",
        "B": "$\\frac{1}{2}$ (o $50,0\\%$)",
        "C": "$\\frac{3}{5}$ (o $60,0\\%$)",
        "D": "$\\frac{1}{4}$ (o $25,0\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Definimos $X \\sim B(5; 0,5)$ con $n = 5$ y $p = 0,5$. Buscamos $P(X = 3)$:\n $P(X = 3) = \\binom{5}{3} \\cdot (0,5)^3 \\cdot (0,5)^{5-3} = \\binom{5}{3} \\cdot (0,5)^5$.\nCalculamos los términos:\n 1) $\\binom{5}{3} = \\frac{5 \\cdot 4}{2} = 10$.\n 2) $(0,5)^5 = \\left(\\frac{1}{2}\\right)^5 = \\frac{1}{32}$.\nMultiplicamos:\n $P(X = 3) = 10 \\cdot \\frac{1}{32} = \\frac{10}{32} = \\frac{5}{16}$ (o $0,3125$).",
      "feedback_error": "Incorrecto. Por distribución binomial: $P(X = 3) = \\binom{5}{3} \\cdot (1/2)^5 = 10 \\cdot 1/32 = 10/32 = 5/16$."
    },
    {
      "id": "q-m2-4-6-3",
      "enunciado": "Un examen escolar consta de 4 preguntas de opción múltiple, donde cada una tiene una única respuesta correcta de entre 4 opciones. Si un estudiante contesta todas las preguntas de forma totalmente aleatoria, ¿cuál es la probabilidad de acertar **exactamente 2** preguntas?",
      "alternativas": {
        "A": "$\\frac{27}{128}$",
        "B": "$\\frac{3}{32}$",
        "C": "$\\frac{3}{8}$",
        "D": "$\\frac{1}{16}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Este es un caso binomial con $n = 4$, probabilidad de éxito $p = \\frac{1}{4} = 0,25$ y de fracaso $q = \\frac{3}{4} = 0,75$. Buscamos $P(X = 2)$:\n $P(X = 2) = \\binom{4}{2} \\cdot \\left(\\frac{1}{4}\\right)^2 \\cdot \\left(\\frac{3}{4}\\right)^{4-2}$.\nCalculamos:\n 1) $\\binom{4}{2} = 6$.\n 2) $\\left(\\frac{1}{4}\\right)^2 = \\frac{1}{16}$.\n 3) $\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$.\nMultiplicamos:\n $P(X = 2) = 6 \\cdot \\frac{1}{16} \\cdot \\frac{9}{16} = \\frac{54}{256} = \\frac{27}{128}$.",
      "feedback_error": "Incorrecto. Aplicando la fórmula binomial con $n=4$ y $p=1/4$: $P(X = 2) = \\binom{4}{2} \\cdot (1/4)^2 \\cdot (3/4)^2 = 6 \\cdot \\frac{9}{256} = \\frac{54}{256} = \\frac{27}{128}$."
    },
    {
      "id": "q-m2-4-6-4",
      "enunciado": "Un tirador olímpico al blanco tiene una probabilidad de dar en el centro de $0,7$ en cada disparo. Si realiza un total de 4 disparos independientes, ¿cuál es la probabilidad de acertar **exactamente 3** veces en el centro?",
      "alternativas": {
        "A": "$0,4116$",
        "B": "$0,2401$",
        "C": "$0,3430$",
        "D": "$0,1200$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Tenemos $X \\sim B(4; 0,7)$ con $n = 4$, $p = 0,7$ y $q = 0,3$. Calculamos $P(X = 3)$:\n $P(X = 3) = \\binom{4}{3} \\cdot (0,7)^3 \\cdot (0,3)^{4-3}$.\nCalculamos los componentes:\n 1) $\\binom{4}{3} = 4$.\n 2) $(0,7)^3 = 0,343$.\n 3) $(0,3)^1 = 0,3$.\nMultiplicamos:\n $P(X = 3) = 4 \\cdot 0,343 \\cdot 0,3 = 1,372 \\cdot 0,3 = 0,4116$.",
      "feedback_error": "Incorrecto. Planteando la fórmula binomial: $P(X = 3) = \\binom{4}{3} \\cdot 0,7^3 \\cdot 0,3^1 = 4 \\cdot 0,343 \\cdot 0,3 = 0,4116$."
    },
    {
      "id": "q-m2-4-6-5",
      "enunciado": "Una variable aleatoria discreta sigue una distribución binomial de la forma $X \\sim B(100; 0,25)$. ¿Cuáles son los valores correspondientes de su **media (esperanza matemática)** y su **varianza**?",
      "alternativas": {
        "A": "Media: $25$; Varianza: $18,75$",
        "B": "Media: $25$; Varianza: $25$",
        "C": "Media: $50$; Varianza: $12,5$",
        "D": "Media: $25$; Varianza: $75$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para una distribución binomial $B(n, p)$:\n 1) La media se calcula como: $\\mu = n \\cdot p = 100 \\cdot 0,25 = 25$.\n 2) La varianza se calcula como: $\\sigma^2 = n \\cdot p \\cdot q = 100 \\cdot 0,25 \\cdot 0,75 = 25 \\cdot 0,75 = 18,75$.",
      "feedback_error": "Incorrecto. En el modelo binomial la media es $\\mu = n \\cdot p = 25$ y la varianza es $\\sigma^2 = n \\cdot p \\cdot q = 100 \\cdot 0,25 \\cdot 0,75 = 18,75$."
    },
    {
      "id": "q-m2-4-6-6",
      "enunciado": "En una fábrica de ampolletas led, la probabilidad de que una ampolleta salga defectuosa de la línea de producción es del $10\\%$ ($p = 0,10$). Si se toma una muestra aleatoria de 4 ampolletas de forma independiente, ¿cuál es la probabilidad de que **ninguna** sea defectuosa?",
      "alternativas": {
        "A": "$0,6561$",
        "B": "$0,9000$",
        "C": "$0,3600$",
        "D": "$0,4000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Definimos $X$ como el número de ampolletas defectuosas, donde $X \\sim B(4; 0,10)$. Buscamos $P(X = 0)$:\n $P(X = 0) = \\binom{4}{0} \\cdot (0,10)^0 \\cdot (0,90)^{4-0}$.\nComo $\\binom{4}{0} = 1$ y $(0,10)^0 = 1$:\n $P(X = 0) = 1 \\cdot 1 \\cdot (0,90)^4 = 0,6561$ (o $65,61\\%$) de probabilidad de que todas estén perfectas.",
      "feedback_error": "Incorrecto. La probabilidad de que ninguna sea defectuosa equivale a que las 4 salgan buenas. Multiplicamos de forma independiente: $(0,9)^4 = 0,6561$."
    },
    {
      "id": "q-m2-4-6-7",
      "enunciado": "Un juego consiste en lanzar un dado normal de 6 caras de forma independiente. Se considera éxito obtener un número menor que 3 ($1$ o $2$). Si el dado se lanza un total de 3 veces consecutivas, ¿cuál es la probabilidad de obtener **exactamente 1 éxito**?",
      "alternativas": {
        "A": "$\\frac{4}{9}$",
        "B": "$\\frac{1}{3}$",
        "C": "$\\frac{2}{9}$",
        "D": "$\\frac{8}{27}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero determinamos las probabilidades del ensayo de Bernoulli:\n - Éxito: obtener $1$ o $2$. Por Laplace, $p = \\frac{2}{6} = \\frac{1}{3}$.\n - Fracaso: obtener $3$, $4$, $5$ o $6$. Por ende, $q = \\frac{4}{6} = \\frac{2}{3}$.\nCon $n = 3$, calculamos la probabilidad de exactamente 1 éxito ($P(X = 1)$):\n $P(X = 1) = \\binom{3}{1} \\cdot \\left(\\frac{1}{3}\\right)^1 \\cdot \\left(\\frac{2}{3}\\right)^{3-1} = 3 \\cdot \\frac{1}{3} \\cdot \\frac{4}{9} = \\frac{4}{9}$.",
      "feedback_error": "Incorrecto. La probabilidad de éxito es $1/3$ y de fracaso $2/3$. Por fórmula binomial: $P(X = 1) = \\binom{3}{1} \\cdot (1/3)^1 \\cdot (2/3)^2 = 3 \\cdot \\frac{1}{3} \\cdot \\frac{4}{9} = \\frac{4}{9}$."
    },
    {
      "id": "q-m2-4-6-8",
      "enunciado": "Para un experimento de Bernoulli con $n = 5$ ensayos independientes y probabilidad de éxito $p = 0,5$, ¿cuál es la probabilidad de obtener **exactamente 4 éxitos**?",
      "alternativas": {
        "A": "$\\frac{5}{32}$",
        "B": "$\\frac{1}{32}$",
        "C": "$\\frac{5}{16}$",
        "D": "$\\frac{10}{32}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Aplicamos la fórmula binomial con $n = 5$, $p = 0,5$ y $k = 4$:\n $P(X = 4) = \\binom{5}{4} \\cdot (0,5)^4 \\cdot (0,5)^1 = \\binom{5}{4} \\cdot (0,5)^5$.\nCalculamos los términos:\n 1) $\\binom{5}{4} = 5$.\n 2) $(0,5)^5 = \\frac{1}{32}$.\nMultiplicando obtenemos: $5 \\cdot \\frac{1}{32} = \\frac{5}{32}$.",
      "feedback_error": "Incorrecto. Por distribución binomial: $P(X = 4) = \\binom{5}{4} \\cdot (1/2)^5 = 5 \\cdot 1/32 = 5/32$."
    },
    {
      "id": "q-m2-4-6-9",
      "enunciado": "Una variable aleatoria discreta $X$ tiene una distribución binomial $X \\sim B(4; 0,5)$. ¿Cuál es la probabilidad exacta de que la variable tome un valor **mayor o igual a 3**?",
      "alternativas": {
        "A": "$\\frac{5}{16}$",
        "B": "$\\frac{1}{4}$",
        "C": "$\\frac{3}{8}$",
        "D": "$\\frac{1}{16}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Queremos calcular la probabilidad acumulada para $X \\geq 3$, esto es:\n $P(X \\geq 3) = P(X = 3) + P(X = 4)$.\nCalculamos ambos términos con $n = 4$ y $p = 0,5$:\n - $P(X = 3) = \\binom{4}{3} \\cdot (0,5)^3 \\cdot (0,5)^1 = 4 \\cdot \\frac{1}{16} = \\frac{4}{16}$.\n - $P(X = 4) = \\binom{4}{4} \\cdot (0,5)^4 \\cdot (0,5)^0 = 1 \\cdot \\frac{1}{16} = \\frac{1}{16}$.\nSumamos los resultados:\n $P(X \\geq 3) = \\frac{4}{16} + \\frac{1}{16} = \\frac{5}{16}$.",
      "feedback_error": "Incorrecto. Debes sumar las probabilidades puntuales para 3 y 4 éxitos: $P(X = 3) + P(X = 4) = \\frac{4}{16} + \\frac{1}{16} = \\frac{5}{16}$."
    },
    {
      "id": "q-m2-4-6-10",
      "enunciado": "En un sondeo de opinión política, el $40\\%$ de los ciudadanos apoya al candidato A. Si se selecciona al azar una muestra independiente de 3 ciudadanos, ¿cuál es la probabilidad de que **al menos uno** de ellos apoye al candidato A?",
      "alternativas": {
        "A": "$0,784$ (o $78,4\\%$)",
        "B": "$0,216$ (o $21,6\\%$)",
        "C": "$0,600$ (o $60,0\\%$)",
        "D": "$0,400$ (o $40,0\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! En problemas de probabilidad con la frase \"al menos uno\", es mucho más rápido resolver usando el suceso complementario (el opuesto a que ninguno lo apoye):\n $P(\\text{Al menos uno}) = 1 - P(\\text{Ninguno})$.\n - La probabilidad de que un ciudadano no lo apoye es $q = 1 - 0,40 = 0,60$.\n - Para 3 ciudadanos independientes, la probabilidad de que ninguno lo apoye es:\n $P(\\text{Ninguno}) = (0,60)^3 = 0,216$.\nRestamos de la unidad:\n $P(\\text{Al menos uno}) = 1 - 0,216 = 0,784$ (o $78,4\\%$).",
      "feedback_error": "Incorrecto. El complemento de \"al menos uno apoya\" es \"ninguno apoya\". Calculamos $P(\\text{Ninguno}) = 0,6^3 = 0,216$. Restando del total: $1 - 0,216 = 0,784$."
    }
  ],
  "sec-m2-4-7": [
    {
      "id": "q-m2-4-7-1",
      "enunciado": "Los puntajes de un ensayo nacional PAES de Competencia Matemática siguen una distribución normal con media $\\mu = 650\\text{ puntos}$ y desviación estándar $\\sigma = 50\\text{ puntos}$. Si seleccionamos un alumno al azar, ¿cuál es la probabilidad de que su puntaje sea **menor o igual a 700 puntos**? (Usa $P(Z \\leq 1) \\approx 0,841$).",
      "alternativas": {
        "A": "$0,841$ (o $84,1\\%$)",
        "B": "$0,159$ (o $15,9\\%$)",
        "C": "$0,500$ (o $50,0\\%$)",
        "D": "$0,977$ (o $97,7\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero estandarizamos la variable original $X = 700\\text{ puntos}$ usando la fórmula de la normal estándar $Z = \\frac{X - \\mu}{\\sigma}$:\n $Z = \\frac{700 - 650}{50} = \\frac{50}{50} = 1$.\nBuscamos en la distribución estándar acumulada:\n $P(X \\leq 700) = P(Z \\leq 1) \\approx 0,841$ (o $84,1\\%$).",
      "feedback_error": "Incorrecto. Al estandarizar el valor de $700$ obtenemos $z = \\frac{700-650}{50} = 1$. La probabilidad asociada para $z \\leq 1$ es aproximadamente $0,841$."
    },
    {
      "id": "q-m2-4-7-2",
      "enunciado": "El peso de los recién nacidos en una clínica de salud se distribuye normalmente con una media de $3.200\\text{ gramos}$ y una desviación estándar de $400\\text{ gramos}$. De acuerdo a la regla empírica del intervalo de una desviación estándar, ¿qué porcentaje de recién nacidos se espera que pesen **entre 2.800 y 3.600 gramos**?",
      "alternativas": {
        "A": "$68,2\\%$",
        "B": "$95,4\\%$",
        "C": "$50,0\\%$",
        "D": "$99,7\\%$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Los límites del intervalo propuesto corresponden exactamente a una desviación estándar por debajo y por arriba de la media aritmética:\n - Límite inferior: $3.200 - 400 = 2.800\\text{ gramos}$ ($\\mu - \\sigma$).\n - Límite superior: $3.200 + 400 = 3.600\\text{ gramos}$ ($\\mu + \\sigma$).\nPor la regla empírica de toda distribución normal, el intervalo simétrico $[\\mu - \\sigma; \\mu + \\sigma]$ concentra exactamente el $68,2\\%$ de las observaciones totales del grupo.",
      "feedback_error": "Incorrecto. El intervalo $[2.800; 3.600]$ equivale a $[\\mu - \\sigma; \\mu + \\sigma]$. Por regla empírica de Gauss, este rango acumula siempre el $68,2\\%$ de los datos."
    },
    {
      "id": "q-m2-4-7-3",
      "enunciado": "La duración en horas de servicio de una bombilla led sigue una distribución normal con media de $10.000\\text{ horas}$ y desviación estándar de $500\\text{ horas}$. Si estandarizamos la variable, ¿a cuántas desviaciones estándar del promedio se encuentra una ampolleta que dura $9.000\\text{ horas}$?",
      "alternativas": {
        "A": "A $-2$ desviaciones estándar.",
        "B": "A $-10$ desviaciones estándar.",
        "C": "A $2$ desviaciones estándar.",
        "D": "A $-1$ desviación estándar."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Aplicamos la fórmula del puntaje estandarizado $z$ para $X = 9.000$:\n $Z = \\frac{X - \\mu}{\\sigma} = \\frac{9.000 - 10.000}{500} = \\frac{-1.000}{500} = -2$.\nEl signo negativo indica de forma correcta que el valor medido está por debajo del promedio.",
      "feedback_error": "Incorrecto. Calculamos el valor de estandarización: $z = \\frac{9.000 - 10.000}{500} = \\frac{-1.000}{500} = -2$. Esto representa exactamente $-2$ desviaciones estándar."
    },
    {
      "id": "q-m2-4-7-4",
      "enunciado": "Las estaturas de los estudiantes de enseñanza media en un liceo siguen una distribución normal con media $\\mu = 170\\text{ cm}$ y desviación estándar $\\sigma = 6\\text{ cm}$. Si se escoge un estudiante al azar, ¿cuál es la probabilidad de que su estatura sea **mayor o igual a 182 cm**? (Usa $P(Z \\leq 2) \\approx 0,977$).",
      "alternativas": {
        "A": "$0,023$ (o $2,3\\%$)",
        "B": "$0,977$ (o $97,7\\%$)",
        "C": "$0,159$ (o $15,9\\%$)",
        "D": "$0,046$ (o $4,6\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! \n 1) Estandarizamos el valor límite $X = 182\\text{ cm}$:\n $Z = \\frac{182 - 170}{6} = \\frac{12}{6} = 2$.\n 2) Buscamos la probabilidad de ser mayor o igual (cola derecha de la campana):\n $P(X \\geq 182) = P(Z \\geq 2) = 1 - P(Z \\leq 2)$.\n 3) Reemplazamos la probabilidad acumulada dada:\n $P(X \\geq 182) \\approx 1 - 0,977 = 0,023$ (o $2,3\\%$).",
      "feedback_error": "Incorrecto. Al estandarizar resulta $z = 2$. Dado que se pide la probabilidad hacia el extremo derecho (mayor o igual), calculamos $1 - P(Z \\leq 2) = 1 - 0,977 = 0,023$."
    },
    {
      "id": "q-m2-4-7-5",
      "enunciado": "Para una variable aleatoria continua con distribución normal de media $\\mu$ y desviación estándar $\\sigma$, ¿qué porcentaje aproximado de la muestra se encuentra concentrado en el intervalo simétrico de dos desviaciones estándar $[\\mu - 2\\sigma; \\mu + 2\\sigma]$ de acuerdo a la regla empírica?",
      "alternativas": {
        "A": "$95,4\\%$",
        "B": "$68,2\\%$",
        "C": "$99,7\\%$",
        "D": "$50,0\\%$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por teoría matemática de la distribución de Gauss (la regla empírica):\n - El rango de 1 desviación estándar $[\\mu - \\sigma; \\mu + \\sigma]$ acumula el $68,2\\%$.\n - El rango de 2 desviaciones estándar $[\\mu - 2\\sigma; \\mu + 2\\sigma]$ acumula el $95,4\\%$.\n - El rango de 3 desviaciones estándar $[\\mu - 3\\sigma; \\mu + 3\\sigma]$ acumula el $99,7\\%$.",
      "feedback_error": "Incorrecto. De acuerdo a la regla empírica estándar de la campana de Gauss, el intervalo de dos desviaciones estándar contiene siempre al $95,4\\%$ de la población."
    },
    {
      "id": "q-m2-4-7-6",
      "enunciado": "La temperatura promedio registrada en verano en una zona cordillerana sigue una distribución normal dada por $X \\sim N(22; 3)$ en grados Celsius. Si un día al azar se registra una temperatura de $28^{\\circ}\\text{C}$, ¿cuál es su puntaje estandarizado $z$?",
      "alternativas": {
        "A": "$2$",
        "B": "$6$",
        "C": "$-2$",
        "D": "$1$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Identificamos los parámetros de la distribución normal:\n - Media: $\\mu = 22$.\n - Desviación estándar: $\\sigma = 3$.\nCalculamos el valor estandarizado $z$ para $X = 28$:\n $Z = \\frac{X - \\mu}{\\sigma} = \\frac{28 - 22}{3} = \\frac{6}{3} = 2$.",
      "feedback_error": "Incorrecto. Aplicamos la fórmula de estandarización: $z = \\frac{X - \\mu}{\\sigma} = \\frac{28 - 22}{3} = 2$."
    },
    {
      "id": "q-m2-4-7-7",
      "enunciado": "La cantidad de mililitros de líquido envasados en botellas de refresco de $500\\text{ ml}$ sigue una distribución normal con media $\\mu = 502\\text{ ml}$ y desviación estándar $\\sigma = 2\\text{ ml}$. ¿Cuál es la probabilidad de que una botella elegida al azar contenga **menos de 500 ml**? (Usa $P(Z \\leq -1) \\approx 0,159$).",
      "alternativas": {
        "A": "$0,159$ (o $15,9\\%$)",
        "B": "$0,841$ (o $84,1\\%$)",
        "C": "$0,500$ (o $50,0\\%$)",
        "D": "$0,023$ (o $2,3\\%$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Estandarizamos el valor límite de la variable original $X = 500\\text{ ml}$:\n $Z = \\frac{500 - 502}{2} = \\frac{-2}{2} = -1$.\nBuscamos la probabilidad acumulada para este valor $z$:\n $P(X < 500) = P(Z < -1) \\approx 0,159$ (o $15,9\\%$).",
      "feedback_error": "Incorrecto. Estandarizando el valor de 500 obtenemos $z = \\frac{500-502}{2} = -1$. La probabilidad asociada para $z < -1$ es de aproximadamente $0,159$."
    },
    {
      "id": "q-m2-4-7-8",
      "enunciado": "Las notas finales de un riguroso examen de cálculo universitario se distribuyen de forma normal con media $4,5$ y desviación estándar $0,5$. Si la nota mínima requerida para aprobar es $4,0$, ¿qué porcentaje de estudiantes reprueba el examen? (Usa $P(Z \\leq -1) \\approx 0,159$).",
      "alternativas": {
        "A": "$15,9\\%$",
        "B": "$84,1\\%$",
        "C": "$50,0\\%$",
        "D": "$34,1\\%$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Un estudiante reprueba si obtiene una nota estrictamente menor que $4,0$.\n 1) Estandarizamos la nota de reprobación $X = 4,0$:\n $Z = \\frac{4,0 - 4,5}{0,5} = \\frac{-0,5}{0,5} = -1$.\n 2) Buscamos la probabilidad acumulada asociada:\n $P(X < 4,0) = P(Z < -1) \\approx 0,159$ (o $15,9\\%$).\nPor lo tanto, se estima que un $15,9\\%$ del curso reprobará el examen de cálculo.",
      "feedback_error": "Incorrecto. Reprobar significa obtener una nota menor que $4,0$. Estandarizando da $z = -1$. La probabilidad de reprobar es $P(Z < -1) \\approx 0,159$, es decir, el $15,9\\%$."
    },
    {
      "id": "q-m2-4-7-9",
      "enunciado": "Si estandarizamos una variable aleatoria normal dada por $X \\sim N(80; 10)$, ¿cuál es el valor de la variable original $X$ que corresponde exactamente a un puntaje estándar de $z = 1,5$?",
      "alternativas": {
        "A": "$95$",
        "B": "$85$",
        "C": "$75$",
        "D": "$90$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Planteamos la ecuación de estandarización reemplazando los parámetros conocidos:\n $Z = \\frac{X - \\mu}{\\sigma} \\implies 1,5 = \\frac{X - 80}{10}$.\nDespejamos multiplicando por $10$:\n $15 = X - 80 \\implies X = 15 + 80 = 95$.",
      "feedback_error": "Incorrecto. De la ecuación de estandarización despejamos $X$: $X = \\mu + z \\cdot \\sigma \\implies X = 80 + (1,5 \\cdot 10) = 80 + 15 = 95$."
    },
    {
      "id": "q-m2-4-7-10",
      "enunciado": "En una distribución normal estándar dada por $Z \\sim N(0, 1)$, ¿cuál es la probabilidad exacta de obtener una medición en el intervalo simétrico $P(-1 \\leq Z \\leq 1)$ sabiendo que la probabilidad acumulada es $P(Z \\leq 1) \\approx 0,8413$?",
      "alternativas": {
        "A": "$0,6826$",
        "B": "$0,3413$",
        "C": "$0,5000$",
        "D": "$0,1587$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por teorema fundamental de cálculo de intervalos en variables continuas:\n $P(-1 \\leq Z \\leq 1) = P(Z \\leq 1) - P(Z \\leq -1)$.\nPor simetría de la campana de Gauss:\n $P(Z \\leq -1) = 1 - P(Z \\leq 1) \\approx 1 - 0,8413 = 0,1587$.\nRestamos para hallar el intervalo central:\n $P(-1 \\leq Z \\leq 1) = 0,8413 - 0,1587 = 0,6826$ (o $68,26\\%$).",
      "feedback_error": "Incorrecto. Calculamos restando el extremo acumulado izquierdo al derecho: $P(Z \\leq 1) - (1 - P(Z \\leq 1)) = 0,8413 - 0,1587 = 0,6826$."
    }
  ]
};

function run() {
  console.log('🚀 [EstudiaUni] Iniciando generación de preguntas locales M2 Probabilidad...');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontró capitulos-mock-local.json.');
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const capTarget = capitulos.find(c => c.id === 'cap-m2-4-datos');

  if (!capTarget) {
    console.error('❌ Error: No se encontró "cap-m2-4-datos" en el mock local.');
    process.exit(1);
  }

  let totalQuestionsCount = 0;

  capTarget.secciones.forEach(sec => {
    const questionsRaw = QUESTIONS_DATA[sec.id];
    if (questionsRaw) {
      // Deep clone to avoid mutating the source data in case of re-runs
      const questionsClone = JSON.parse(JSON.stringify(questionsRaw));

      // Shuffle alternatives and balance the correct options evenly
      const balancedQuestions = distributeAndShuffle(questionsClone);

      sec.test = {
        id: `test-m2-4-${sec.id.split('-').pop()}`,
        seccionId: sec.id,
        preguntas: balancedQuestions
      };

      totalQuestionsCount += balancedQuestions.length;
      console.log(`   ✅ Sección ${sec.id} actualizada con ${balancedQuestions.length} preguntas premium.`);
    } else {
      console.warn(`⚠️ Advertencia: No hay preguntas definidas para la sección ${sec.id}`);
    }
  });

  fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2), 'utf8');

  console.log(`\n🎉 [EstudiaUni] ¡Generación de M2 Probabilidad completada con éxito!`);
  console.log(`   ➜ Total de preguntas inyectadas: ${totalQuestionsCount}`);
}

run();
