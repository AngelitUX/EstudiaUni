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
  "sec-m2-3-1": [
    {
      "id": "q-m2-3-1-1",
      "enunciado": "Un triángulo $ABC$ tiene un área de exactamente $12\\text{ cm}^2$. Si se le aplica una homotecia con centro en el origen $O$ y razón de homotecia $k = 3$, ¿cuál es el área del triángulo homólogo resultante $A'B'C'$?",
      "alternativas": {
        "A": "$108\\text{ cm}^2$",
        "B": "$36\\text{ cm}^2$",
        "C": "$48\\text{ cm}^2$",
        "D": "$144\\text{ cm}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por propiedades de las transformaciones homólogas, cuando aplicamos una homotecia de razón $k$ a una figura plana, su área se multiplica por el cuadrado de la razón de homotecia ($k^2$).\n $\\text{Área}' = k^2 \\cdot \\text{Área} = 3^2 \\cdot 12\\text{ cm}^2 = 9 \\cdot 12\\text{ cm}^2 = 108\\text{ cm}^2$.",
      "feedback_error": "Incorrecto. Recuerda que bajo una homotecia de razón $k$, las dimensiones lineales se multiplican por $|k|$, pero el área se multiplica por el cuadrado de la razón ($k^2$). Así, el área resultante es $3^2 \\cdot 12 = 9 \\cdot 12 = 108\\text{ cm}^2$."
    },
    {
      "id": "q-m2-3-1-2",
      "enunciado": "Un rectángulo de perímetro $24\\text{ cm}$ se somete a una homotecia inversa con centro $O$ y razón de homotecia $k = -0,5$. ¿Cuál es el perímetro del rectángulo imagen obtenido?",
      "alternativas": {
        "A": "$12\\text{ cm}$",
        "B": "$-12\\text{ cm}$",
        "C": "$6\\text{ cm}$",
        "D": "$48\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! El perímetro es una medida lineal unidimensional. Bajo una homotecia de razón $k$ (sea directa o inversa), cualquier longitud o perímetro se multiplica por el valor absoluto de la razón de homotecia ($|k|$):\n $\\text{Perímetro}' = |k| \\cdot \\text{Perímetro} = |-0,5| \\cdot 24\\text{ cm} = 0,5 \\cdot 24\\text{ cm} = 12\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que el perímetro es una longitud, por lo que se multiplica por el valor absoluto de la razón de homotecia $|k|$. Como $|-0,5| = 0,5$, el nuevo perímetro es $0,5 \\cdot 24 = 12\\text{ cm}$."
    },
    {
      "id": "q-m2-3-1-3",
      "enunciado": "Si a un cuadrilátero $ABCD$ se le aplica una homotecia con centro $O$ y razón de homotecia $k$. Si la distancia desde el centro $O$ al vértice original $A$ es $OA = 8\\text{ cm}$ y al vértice homólogo es $OA' = 20\\text{ cm}$. Si se sabe que la homotecia es directa, ¿cuál es el valor exacto de la razón $k$?",
      "alternativas": {
        "A": "$2,5$",
        "B": "$0,4$",
        "C": "$1,5$",
        "D": "$12$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! En una homotecia, la distancia desde el centro $O$ al punto imagen es directamente proporcional a la distancia desde el centro al punto original, donde la constante de proporcionalidad es el valor absoluto de la razón de homotecia ($|k|$):\n $OA' = |k| \\cdot OA \\implies 20 = |k| \\cdot 8 \\implies |k| = \\frac{20}{8} = 2,5$.\nDado que se especifica que la homotecia es directa ($k > 0$), entonces $k = 2,5$.",
      "feedback_error": "Incorrecto. La razón de homotecia se define como el cociente entre la distancia del punto homólogo al centro y la distancia del punto original al centro: $k = \\frac{OA'}{OA}$. En este caso, $k = \\frac{20}{8} = 2,5$."
    },
    {
      "id": "q-m2-3-1-4",
      "enunciado": "Un hexágono regular se somete a una homotecia con centro $O$ y razón de homotecia $k = -2$. ¿Cuál es la razón exacta entre el área de la figura imagen y la del hexágono original?",
      "alternativas": {
        "A": "$4$",
        "B": "$-4$",
        "C": "$2$",
        "D": "$-2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La razón entre las áreas de dos figuras homólogas bajo una homotecia de razón $k$ es igual al cuadrado de dicha razón ($k^2$):\n $\\frac{\\text{Área}'}{\\text{Área}} = k^2 = (-2)^2 = 4$.\nEsto significa que la figura imagen tiene un área que es exactamente 4 veces mayor que la original, a pesar de estar invertida.",
      "feedback_error": "Incorrecto. Recuerda que la razón entre áreas corresponde a la razón de homotecia elevada al cuadrado ($k^2$). Elevando la razón al cuadrado obtenemos $(-2)^2 = 4$."
    },
    {
      "id": "q-m2-3-1-5",
      "enunciado": "Al aplicar una homotecia con centro $O$ a un cuadrado de área $16\\text{ cm}^2$, se obtiene un cuadrado homólogo de área $144\\text{ cm}^2$. Si la homotecia es de tipo **inversa**, ¿cuál es el valor real de la razón de homotecia $k$?",
      "alternativas": {
        "A": "$-3$",
        "B": "$3$",
        "C": "$-9$",
        "D": "$9$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Primero calculamos la razón de las áreas:\n $\\frac{\\text{Área}'}{\\text{Área}} = k^2 \\implies \\frac{144}{16} = k^2 \\implies 9 = k^2$.\nPara hallar $k$, aplicamos raíz cuadrada: $|k| = 3 \\implies k = 3$ o $k = -3$.\nDado que el enunciado especifica que la homotecia es **inversa** (lo que implica que la razón $k$ debe ser estrictamente negativa), concluimos que $k = -3$.",
      "feedback_error": "Incorrecto. La relación entre áreas es $k^2 = \\frac{144}{16} = 9$, lo que nos da $|k| = 3$. Como se especifica que es una homotecia inversa, la razón debe ser negativa, es decir, $k = -3$."
    },
    {
      "id": "q-m2-3-1-6",
      "enunciado": "Un segmento $AB$ de longitud $5\\text{ cm}$ se somete a una homotecia con centro $O$ y razón de homotecia $k = 1,5$ transformándose en el segmento homólogo $A'B'$. ¿Cuál es la longitud exacta de $A'B'$?",
      "alternativas": {
        "A": "$7,5\\text{ cm}$",
        "B": "$6,5\\text{ cm}$",
        "C": "$5,0\\text{ cm}$",
        "D": "$3,3\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La longitud de un segmento homólogo se calcula multiplicando la longitud del segmento original por el valor absoluto de la razón de homotecia:\n $A'B' = |k| \\cdot AB = 1,5 \\cdot 5\\text{ cm} = 7,5\\text{ cm}$.",
      "feedback_error": "Incorrecto. Para calcular la nueva longitud del segmento, multiplicamos la longitud original por la razón de homotecia: $5 \\cdot 1,5 = 7,5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-1-7",
      "enunciado": "Un triángulo equilátero posee un perímetro total de $18\\text{ cm}$. Si se le aplica una homotecia con razón de homotecia $k = 0,25$, ¿cuál es el perímetro del triángulo equilátero homólogo resultante?",
      "alternativas": {
        "A": "$4,5\\text{ cm}$",
        "B": "$9,0\\text{ cm}$",
        "C": "$1,125\\text{ cm}$",
        "D": "$72\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El perímetro es una dimensión lineal, por lo tanto, el nuevo perímetro se multiplica simplemente por el factor de escala absoluto $|k|$:\n $\\text{Perímetro}' = |k| \\cdot \\text{Perímetro} = 0,25 \\cdot 18\\text{ cm} = \\frac{1}{4} \\cdot 18\\text{ cm} = 4,5\\text{ cm}$.",
      "feedback_error": "Incorrecto. Multiplicamos el perímetro de la figura original por la razón de homotecia para obtener el nuevo perímetro lineal: $18 \\cdot 0,25 = 4,5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-1-8",
      "enunciado": "Sea $O$ el centro de una homotecia. Si $A'$ es el punto homólogo de $A$, con una distancia al centro $OA = 15\\text{ cm}$. Si la razón de homotecia es $k = -\\frac{3}{5}$, ¿cuál es la longitud exacta de la distancia $OA'$?",
      "alternativas": {
        "A": "$9\\text{ cm}$",
        "B": "$-9\\text{ cm}$",
        "C": "$25\\text{ cm}$",
        "D": "$15\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Las distancias geométricas son siempre positivas. Aplicando la definición de homotecia:\n $OA' = |k| \\cdot OA = \\left|-\\frac{3}{5}\\right| \\cdot 15\\text{ cm} = \\frac{3}{5} \\cdot 15\\text{ cm} = 3 \\cdot 3 = 9\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que la distancia es siempre un valor positivo, por lo que multiplicamos por el valor absoluto de la razón de homotecia: $OA' = |k| \\cdot OA = \\frac{3}{5} \\cdot 15 = 9\\text{ cm}$."
    },
    {
      "id": "q-m2-3-1-9",
      "enunciado": "Si un polígono cualquiera con área $A_1$ y perímetro $P_1$ se transforma en un polígono homólogo con área $A_2$ y perímetro $P_2$ mediante una homotecia de razón $k$. ¿Cuál de las siguientes relaciones de proporcionalidad es **siempre verdadera**?",
      "alternativas": {
        "A": "$\\frac{A_2}{A_1} = \\left(\\frac{P_2}{P_1}\\right)^2$",
        "B": "$\\frac{A_2}{A_1} = \\frac{P_2}{P_1}$",
        "C": "$\\frac{A_2}{A_1} = k \\cdot \\frac{P_2}{P_1}$",
        "D": "$\\frac{A_2}{A_1} = \\sqrt{\\frac{P_2}{P_1}}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Analicemos el comportamiento de los cocientes:\n 1) La razón entre perímetros es: $\\frac{P_2}{P_1} = |k|$.\n 2) La razón entre áreas es: $\\frac{A_2}{A_1} = k^2$.\nElevando al cuadrado la razón de los perímetros obtenemos:\n $\\left(\\frac{P_2}{P_1}\\right)^2 = |k|^2 = k^2 = \\frac{A_2}{A_1}$.\nPor lo tanto, la relación es siempre verdadera sin importar el polígono ni el signo de $k$.",
      "feedback_error": "Incorrecto. Recuerda que la proporción lineal es $\\frac{P_2}{P_1} = |k|$ y la superficial es $\\frac{A_2}{A_1} = k^2$. Al elevar al cuadrado el cociente de perímetros obtenemos directamente el cociente de áreas: $\\frac{A_2}{A_1} = \\left(\\frac{P_2}{P_1}\\right)^2$."
    },
    {
      "id": "q-m2-3-1-10",
      "enunciado": "Un triángulo rectángulo posee catetos de longitudes $6\\text{ cm}$ y $8\\text{ cm}$. Si se somete a una homotecia de razón $k = -\\frac{1}{2}$, ¿cuál es el área del triángulo homólogo resultante?",
      "alternativas": {
        "A": "$6\\text{ cm}^2$",
        "B": "$12\\text{ cm}^2$",
        "C": "$24\\text{ cm}^2$",
        "D": "$48\\text{ cm}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Primero calculamos el área del triángulo rectángulo original:\n $\\text{Área}_{orig} = \\frac{\\text{Base} \\cdot \\text{Altura}}{2} = \\frac{6 \\cdot 8}{2} = 24\\text{ cm}^2$.\nBajo una homotecia de razón $k = -1/2$, el área de la figura imagen se multiplica por $k^2$:\n $\\text{Área}' = k^2 \\cdot \\text{Área}_{orig} = \\left(-\\frac{1}{2}\\right)^2 \\cdot 24 = \\frac{1}{4} \\cdot 24 = 6\\text{ cm}^2$.",
      "feedback_error": "Incorrecto. Primero determinamos el área del triángulo original: $\\frac{6 \\cdot 8}{2} = 24\\text{ cm}^2$. Luego, aplicamos el cuadrado de la razón de homotecia: $k^2 = (-1/2)^2 = 1/4$. El área del homólogo es $24 \\cdot 1/4 = 6\\text{ cm}^2$."
    }
  ],
  "sec-m2-3-2": [
    {
      "id": "q-m2-3-2-1",
      "enunciado": "En un triángulo rectángulo, el cateto opuesto a un ángulo agudo $\\alpha$ mide exactamente $12\\text{ cm}$ y la hipotenusa mide $13\\text{ cm}$. ¿Cuál es el valor exacto de la razón trigonométrica $\\cos(\\alpha)$?",
      "alternativas": {
        "A": "$\\frac{5}{13}$",
        "B": "$\\frac{12}{13}$",
        "C": "$\\frac{5}{12}$",
        "D": "$\\frac{13}{5}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero necesitamos hallar el cateto adyacente a $\\alpha$ mediante el Teorema de Pitágoras:\n $a^2 + b^2 = c^2 \\implies x^2 + 12^2 = 13^2 \\implies x^2 + 144 = 169$.\nDespejamos:\n $x^2 = 169 - 144 = 25 \\implies x = 5\\text{ cm}$ (Cateto adyacente).\nAhora aplicamos la definición de coseno:\n $\\cos(\\alpha) = \\frac{\\text{Cateto Adyacente}}{\\text{Hipotenusa}} = \\frac{5}{13}$.",
      "feedback_error": "Incorrecto. Primero aplica Pitágoras para hallar el cateto adyacente: $\\sqrt{13^2 - 12^2} = 5$. La definición de coseno es Cateto Adyacente / Hipotenusa, por lo que resulta $5/13$."
    },
    {
      "id": "q-m2-3-2-2",
      "enunciado": "¿Cuál es el valor exacto de la siguiente expresión trigonométrica?\n $\\sin^2(45^{\\circ}) + \\cos(60^{\\circ}) - \\tan(45^{\\circ})$",
      "alternativas": {
        "A": "$0$",
        "B": "$1$",
        "C": "$\\frac{1}{2}$",
        "D": "$-\\frac{1}{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Reemplazamos los valores trigonométricos de los ángulos notables:\n 1) $\\sin(45^{\\circ}) = \\frac{\\sqrt{2}}{2} \\implies \\sin^2(45^{\\circ}) = \\left(\\frac{\\sqrt{2}}{2}\\right)^2 = \\frac{2}{4} = \\frac{1}{2}$.\n 2) $\\cos(60^{\\circ}) = \\frac{1}{2}$.\n 3) $\\tan(45^{\\circ}) = 1$.\nSustituimos e igualamos:\n $\\frac{1}{2} + \\frac{1}{2} - 1 = 1 - 1 = 0$.",
      "feedback_error": "Incorrecto. Sustituye los valores notables: $\\sin^2(45^{\\circ}) = 1/2$, $\\cos(60^{\\circ}) = 1/2$ y $\\tan(45^{\\circ}) = 1$. Sumando obtenemos $1/2 + 1/2 - 1 = 0$."
    },
    {
      "id": "q-m2-3-2-3",
      "enunciado": "En un triángulo rectángulo, la tangente de uno de sus ángulos agudos es $\\tan(\\theta) = \\frac{3}{4}$. Si el cateto adyacente al ángulo $\\theta$ mide exactamente $12\\text{ cm}$, ¿cuál es la longitud de la **hipotenusa** de este triángulo?",
      "alternativas": {
        "A": "$15\\text{ cm}$",
        "B": "$9\\text{ cm}$",
        "C": "$20\\text{ cm}$",
        "D": "$16\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Planteamos la definición de tangente:\n $\\tan(\\theta) = \\frac{\\text{Cateto Opuesto}}{\\text{Cateto Adyacente}} \\implies \\frac{3}{4} = \\frac{\\text{Cateto Opuesto}}{12}$.\nMultiplicamos cruzado:\n $\\text{Cateto Opuesto} = \\frac{3 \\cdot 12}{4} = 9\\text{ cm}$.\nAhora calculamos la hipotenusa usando el Teorema de Pitágoras con los catetos de $9\\text{ cm}$ y $12\\text{ cm}$:\n $\\text{Hipotenusa} = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$.",
      "feedback_error": "Incorrecto. De la tangente despejamos el cateto opuesto: $\\frac{3}{4} = \\frac{co}{12} \\implies co = 9$. Con catetos $9$ y $12$, por Pitágoras la hipotenusa es $\\sqrt{9^2 + 12^2} = 15\\text{ cm}$."
    },
    {
      "id": "q-m2-3-2-4",
      "enunciado": "Dado un ángulo agudo $\\alpha$ tal que $\\sin(\\alpha) = 0,6$. ¿Cuál es el valor exacto de la razón trigonométrica $\\tan(\\alpha)$?",
      "alternativas": {
        "A": "$0,75$ (o $\\frac{3}{4}$)",
        "B": "$0,8$ (o $\\frac{4}{5}$)",
        "C": "$1,33$ (o $\\frac{4}{3}$)",
        "D": "$0,6$ (o $\\frac{3}{5}$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Expresamos el seno como fracción: $\\sin(\\alpha) = 0,6 = \\frac{6}{10} = \\frac{3}{5}$.\nEsto modela un triángulo rectángulo con Cateto Opuesto $= 3$ e Hipotenusa $= 5$.\nPor trío pitagórico ($3, 4, 5$), el Cateto Adyacente debe ser $4$. O bien, por identidad fundamental:\n $\\cos^2(\\alpha) = 1 - \\sin^2(\\alpha) = 1 - 0,36 = 0,64 \\implies \\cos(\\alpha) = 0,8 = \\frac{4}{5}$.\nCalculamos la tangente:\n $\\tan(\\alpha) = \\frac{\\sin(\\alpha)}{\\cos(\\alpha)} = \\frac{0,6}{0,8} = 0,75$ (o $\\frac{3}{4}$).",
      "feedback_error": "Incorrecto. Si $\\sin(\\alpha) = 0,6 = 3/5$, por Pitágoras $\\cos(\\alpha) = 4/5 = 0,8$. Dividiendo obtenemos $\\tan(\\alpha) = \\frac{3/5}{4/5} = 3/4 = 0,75$."
    },
    {
      "id": "q-m2-3-2-5",
      "enunciado": "Si en un triángulo rectángulo la hipotenusa mide exactamente $10\\text{ cm}$ y uno de los ángulos agudos es de $30^{\\circ}$, ¿cuál es la longitud del cateto opuesto a dicho ángulo?",
      "alternativas": {
        "A": "$5\\text{ cm}$",
        "B": "$5\\sqrt{3}\\text{ cm}$",
        "C": "$5\\sqrt{2}\\text{ cm}$",
        "D": "$10\\sqrt{3}\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Aplicamos la definición de la razón seno para el ángulo de $30^{\\circ}$:\n $\\sin(30^{\\circ}) = \\frac{\\text{Cateto Opuesto}}{\\text{Hipotenusa}} \\implies \\frac{1}{2} = \\frac{\\text{Cateto Opuesto}}{10}$.\nDespejamos multiplicando por 10:\n $\\text{Cateto Opuesto} = 10 \\cdot \\frac{1}{2} = 5\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que $\\sin(30^{\\circ}) = 1/2$. Como $\\sin(30^{\\circ}) = co / 10$, multiplicamos por $10$ para obtener $co = 5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-2-6",
      "enunciado": "Simplifica la siguiente expresión trigonométrica para cualquier ángulo agudo $\\theta$:\n $\\frac{\\sin(\\theta)}{\\cos(\\theta)} \\cdot \\cos^2(\\theta) + \\sin^2(\\theta) - 1$",
      "alternativas": {
        "A": "$\\sin(\\theta) \\cdot \\cos(\\theta) - \\cos^2(\\theta)$",
        "B": "$0$",
        "C": "$\\sin(\\theta) \\cdot \\cos(\\theta)$",
        "D": "$1$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Procedemos a simplificar la expresión término a término:\n 1) Simplificamos la primera parte: $\\frac{\\sin(\\theta)}{\\cos(\\theta)} \\cdot \\cos^2(\\theta) = \\sin(\\theta) \\cdot \\cos(\\theta)$.\n 2) Por la identidad fundamental, sabemos que $\\sin^2(\\theta) - 1 = -\\cos^2(\\theta)$.\nUniendo ambos resultados, la expresión simplificada queda como:\n $\\sin(\\theta) \\cdot \\cos(\\theta) - \\cos^2(\\theta)$.",
      "feedback_error": "Incorrecto. Primero cancela los términos en la fracción obteniendo $\\sin(\\theta)\\cos(\\theta)$. Luego, utilizando la identidad fundamental $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$, sustituye $\\sin^2(\\theta) - 1 = -\\cos^2(\\theta)$."
    },
    {
      "id": "q-m2-3-2-7",
      "enunciado": "En un triángulo rectángulo $ABC$ recto en $C$, se sabe que la razón de sus lados es $\\cos(A) = \\frac{5}{13}$. ¿Cuál es el valor de la razón trigonométrica $\\sin(B)$?",
      "alternativas": {
        "A": "$\\frac{5}{13}$",
        "B": "$\\frac{12}{13}$",
        "C": "$\\frac{12}{5}$",
        "D": "$\\frac{13}{5}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! En cualquier triángulo rectángulo recto en $C$, los ángulos agudos $A$ y $B$ son complementarios ($A + B = 90^{\\circ}$). Por co-funciones trigonométricas, el seno de un ángulo es igual al coseno de su complemento:\n $\\sin(B) = \\cos(90^{\\circ} - B) = \\cos(A) = \\frac{5}{13}$.",
      "feedback_error": "Incorrecto. Dado que $A$ y $B$ son ángulos complementarios en un triángulo rectángulo recto, se cumple la identidad de co-funciones: $\\sin(B) = \\cos(A) = 5/13$."
    },
    {
      "id": "q-m2-3-2-8",
      "enunciado": "Determina el valor exacto de la siguiente expresión numérica con ángulos notables:\n $\\tan(60^{\\circ}) \\cdot \\sin(60^{\\circ}) + \\cos(30^{\\circ})$",
      "alternativas": {
        "A": "$2\\sqrt{3}$",
        "B": "$\\sqrt{3}$",
        "C": "$\\frac{\\sqrt{3}}{2}$",
        "D": "$2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Reemplazamos los valores notables exactos:\n 1) $\\tan(60^{\\circ}) = \\sqrt{3}$.\n 2) $\\sin(60^{\\circ}) = \\frac{\\sqrt{3}}{2}$.\n 3) $\\cos(30^{\\circ}) = \\frac{\\sqrt{3}}{2}$.\nSustituimos en la ecuación:\n $\\sqrt{3} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{3}}{2} = \\frac{3}{2} + \\frac{\\sqrt{3}}{2} = \\frac{3 + \\sqrt{3}}{2}$.\nEspera, desarrollemos bien el enunciado matemático para que dé una de las opciones propuestas de forma perfecta. Si planteamos:\n $\\tan(60^{\\circ}) \\cdot \\cos(30^{\\circ}) + \\sin(30^{\\circ})$:\n $\\sqrt{3} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{1}{2} = \\frac{3}{2} + \\frac{1}{2} = 2$.\n¡Ahí da un entero perfecto! Modificamos el enunciado a esta versión para que dé la alternativa A (que es 2). Modificamos los distractores.",
      "enunciado": "Determina el valor exacto de la siguiente expresión numérica con ángulos notables:\n $\\tan(60^{\\circ}) \\cdot \\cos(30^{\\circ}) + \\sin(30^{\\circ})$",
      "alternativas": {
        "A": "$2$",
        "B": "$\\sqrt{3}$",
        "C": "$1$",
        "D": "$4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Evaluamos la expresión:\n $\\tan(60^{\\circ}) \\cdot \\cos(30^{\\circ}) + \\sin(30^{\\circ}) = \\sqrt{3} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{1}{2} = \\frac{3}{2} + \\frac{1}{2} = \\frac{4}{2} = 2$.",
      "feedback_error": "Incorrecto. Reemplaza los valores notables: $\\tan(60^{\\circ}) = \\sqrt{3}$, $\\cos(30^{\\circ}) = \\sqrt{3}/2$ y $\\sin(30^{\\circ}) = 1/2$. Operando nos queda $\\sqrt{3} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{1}{2} = \\frac{3}{2} + \\frac{1}{2} = 2$."
    },
    {
      "id": "q-m2-3-2-9",
      "enunciado": "En un triángulo rectángulo, la longitud de uno de sus catetos es exactamente la mitad de la longitud de la hipotenusa. ¿Cuánto mide el menor de sus ángulos agudos?",
      "alternativas": {
        "A": "$30^{\\circ}$",
        "B": "$45^{\\circ}$",
        "C": "$60^{\\circ}$",
        "D": "$15^{\\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Si un cateto $a$ es la mitad de la hipotenusa $c$ ($a = \\frac{c}{2}$), entonces la razón del seno del ángulo opuesto a ese cateto es:\n $\\sin(\\theta) = \\frac{a}{c} = \\frac{c/2}{c} = \\frac{1}{2}$.\nEl ángulo agudo cuyo seno es exactamente $\\frac{1}{2}$ es el ángulo notable de $30^{\\circ}$. Como es menor que su complemento ($60^{\\circ}$), este es efectivamente el menor ángulo agudo.",
      "feedback_error": "Incorrecto. Recuerda que si un cateto es la mitad de la hipotenusa, la razón del seno opuesto es $1/2$. Esto corresponde al ángulo de $30^{\circ}$."
    },
    {
      "id": "q-m2-3-2-10",
      "enunciado": "Si en un triángulo rectángulo el seno de uno de sus ángulos agudos $\\beta$ es igual a $\\frac{\\sqrt{3}}{2}$, ¿cuál es el valor exacto de la razón trigonométrica $\\cos(\\beta)$?",
      "alternativas": {
        "A": "$\\frac{1}{2}$",
        "B": "$\\frac{\\sqrt{2}}{2}$",
        "C": "$\\frac{\\sqrt{3}}{3}$",
        "D": "$\\sqrt{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Si $\\sin(\\beta) = \\frac{\\sqrt{3}}{2}$, dado que $\\beta$ es agudo, este corresponde a un ángulo de $60^{\circ}$.\nPor lo tanto, calculamos $\\cos(\\beta) = \\cos(60^{\\circ}) = \\frac{1}{2}$.\nO bien, utilizando la identidad fundamental:\n $\\cos^2(\\beta) = 1 - \\sin^2(\\beta) = 1 - \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = 1 - \\frac{3}{4} = \\frac{1}{4} \\implies \\cos(\\beta) = \\frac{1}{2}$.",
      "feedback_error": "Incorrecto. Si el seno es $\\sqrt{3}/2$, el ángulo agudo es $60^{\circ}$. El coseno de $60^{\circ}$ es $1/2$."
    }
  ],
  "sec-m2-3-3": [
    {
      "id": "q-m2-3-3-1",
      "enunciado": "Un topógrafo mide un ángulo de elevación de $30^{\\circ}$ hacia la cima de un edificio desde un punto en el suelo plano ubicado a $60\\text{ m}$ de su base horizontal. Utilizando la aproximación $\\sqrt{3} \\approx 1,73$, ¿cuál es la altura aproximada del edificio?",
      "alternativas": {
        "A": "$34,6\\text{ m}$",
        "B": "$30\\text{ m}$",
        "C": "$45\\text{ m}$",
        "D": "$51,9\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Modelamos un triángulo rectángulo donde:\n - Ángulo $\\theta = 30^{\\circ}$.\n - Cateto Adyacente $= 60\\text{ m}$ (distancia al edificio).\n - Cateto Opuesto $= h$ (altura del edificio).\nUsamos la razón tangente:\n $\\tan(30^{\\circ}) = \\frac{h}{60} \\implies \\frac{\\sqrt{3}}{3} = \\frac{h}{60} \\implies h = \\frac{60\\sqrt{3}}{3} = 20\\sqrt{3}\\text{ m}$.\nAplicando la aproximación $\\sqrt{3} \\approx 1,73$:\n $h \\approx 20 \\cdot 1,73 = 34,6\\text{ metros}$.",
      "feedback_error": "Incorrecto. Usa la tangente de $30^{\\circ}$ para relacionar la altura y la distancia horizontal: $\\tan(30^{\\circ}) = h / 60$. Despejando resulta $h = 20\\sqrt{3}$. Al aproximar nos queda $20 \\cdot 1,73 = 34,6\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-2",
      "enunciado": "Una escalera de $10\\text{ m}$ de longitud se apoya sobre una pared vertical. Si la escalera forma un ángulo de $60^{\\circ}$ con el suelo horizontal, ¿a qué altura sobre la pared se encuentra apoyado su extremo superior?",
      "alternativas": {
        "A": "$5\\sqrt{3}\\text{ m}$",
        "B": "$5\\text{ m}$",
        "C": "$10\\sqrt{3}\\text{ m}$",
        "D": "$5\\sqrt{2}\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Dibujamos el triángulo rectángulo:\n - Hipotenusa $= 10\\text{ m}$ (longitud de la escalera).\n - Ángulo con el suelo $= 60^{\\circ}$.\n - Cateto Opuesto $= h$ (altura de apoyo en la pared).\nUsamos la función seno:\n $\\sin(60^{\\circ}) = \\frac{h}{10} \\implies \\frac{\\sqrt{3}}{2} = \\frac{h}{10}$.\nMultiplicamos por 10:\n $h = 10 \\cdot \\frac{\\sqrt{3}}{2} = 5\\sqrt{3}\\text{ metros}$.",
      "feedback_error": "Incorrecto. La escalera es la hipotenusa y buscamos el cateto opuesto al ángulo de $60^{\circ}$ con el suelo. Usando el seno: $\\sin(60^{\\circ}) = h / 10 \\implies h = 10 \\cdot (\\sqrt{3}/2) = 5\\sqrt{3}\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-3",
      "enunciado": "Desde la plataforma superior de un faro costero de $80\\text{ m}$ de altura sobre el nivel del mar, un guardia observa un barco pesquero con un ángulo de depresión de $45^{\circ}$. ¿A qué distancia horizontal de la base del faro se encuentra el barco?",
      "alternativas": {
        "A": "$80\\text{ m}$",
        "B": "$40\\sqrt{2}\\text{ m}$",
        "C": "$80\\sqrt{3}\\text{ m}$",
        "D": "$160\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El ángulo de depresión de $45^{\circ}$ es congruente con el ángulo de elevación desde el barco hacia la cima del faro por alternos internos entre paralelas. Esto forma un triángulo rectángulo de ángulos agudos $45^{\circ}$ y $45^{\circ}$ (isósceles rectángulo). En este tipo de triángulo, ambos catetos miden lo mismo. Por lo tanto, la distancia horizontal es igual a la altura del faro: $80\\text{ m}$.",
      "feedback_error": "Incorrecto. Un ángulo de elevación/depresión de $45^{\circ}$ forma un triángulo rectángulo isósceles, lo que significa que la distancia horizontal de la base al barco es idéntica a la altura del faro ($80\\text{ m}$)."
    },
    {
      "id": "q-m2-3-3-4",
      "enunciado": "Un poste de luz vertical proyecta una sombra de exactamente $6\\text{ m}$ de longitud sobre el suelo plano horizontal cuando el ángulo de elevación solar con respecto al horizonte es de $60^{\circ}$. ¿Cuál es la altura del poste?",
      "alternativas": {
        "A": "$6\\sqrt{3}\\text{ m}$",
        "B": "$3\\sqrt{3}\\text{ m}$",
        "C": "$6\\text{ m}$",
        "D": "$12\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El poste forma un cateto opuesto de altura $h$ y la sombra es el cateto adyacente de $6\\text{ m}$:\n $\\tan(60^{\\circ}) = \\frac{h}{6} \\implies \\sqrt{3} = \\frac{h}{6} \\implies h = 6\\sqrt{3}\\text{ metros}$.",
      "feedback_error": "Incorrecto. Para calcular la altura mediante la sombra y el ángulo solar, aplicamos la tangente: $\\tan(60^{\\circ}) = h / 6$. Como $\\tan(60^{\\circ}) = \\sqrt{3}$, multiplicando por 6 resulta $h = 6\\sqrt{3}\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-5",
      "enunciado": "Un teleférico turístico asciende por la ladera de un cerro con un ángulo de elevación constante de $30^{\circ}$. Si el cable tensor del teleférico mide exactamente $1.200\\text{ m}$ de longitud desde la estación de salida hasta la cima, ¿cuál es el desnivel vertical (altura) ganado?",
      "alternativas": {
        "A": "$600\\text{ m}$",
        "B": "$400\\sqrt{3}\\text{ m}$",
        "C": "$600\\sqrt{3}\\text{ m}$",
        "D": "$300\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Modelamos con un triángulo rectángulo donde el cable es la hipotenusa de $1.200\\text{ m}$ y el desnivel es el cateto opuesto al ángulo de $30^{\circ}$:\n $\\sin(30^{\\circ}) = \\frac{h}{1.200} \\implies \\frac{1}{2} = \\frac{h}{1.200} \\implies h = 1.200 \\cdot \\frac{1}{2} = 600\\text{ m}$.",
      "feedback_error": "Incorrecto. La longitud del cable representa la hipotenusa de $1.200\\text{ m}$. Relacionando la altura opuesta al ángulo de $30^{\circ}$ con el seno obtenemos: $h = 1.200 \\cdot \\sin(30^{\\circ}) = 600\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-6",
      "enunciado": "Un avión de pasajeros vuela a una altitud constante de $5.000\\text{ m}$ sobre el suelo. El piloto divisa el cabezal de la pista de aterrizaje con un ángulo de depresión de $30^{\circ}$. ¿A qué distancia en línea recta se encuentra el avión de la pista de aterrizaje?",
      "alternativas": {
        "A": "$10.000\\text{ m}$",
        "B": "$5.000\\sqrt{3}\\text{ m}$",
        "C": "$10.000\\sqrt{3}\\text{ m}$",
        "D": "$2.500\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La distancia en línea recta representa la hipotenusa $d$ del triángulo rectángulo. La altitud de $5.000\\text{ m}$ es el cateto opuesto al ángulo de elevación equivalente de $30^{\circ}$:\n $\\sin(30^{\\circ}) = \\frac{5.000}{d} \\implies \\frac{1}{2} = \\frac{5.000}{d} \\implies d = 5.000 \\cdot 2 = 10.000\\text{ metros}$.",
      "feedback_error": "Incorrecto. Se solicita la distancia en línea recta (hipotenusa). Usamos el seno para el ángulo de $30^{\circ}$: $\\sin(30^{\\circ}) = \\frac{5.000}{d} \\implies \\frac{1}{2} = \\frac{5.000}{d}$, de donde $d = 10.000\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-7",
      "enunciado": "Una ingeniera de $1,70\\text{ m}$ de estatura observa la punta de una antena de telecomunicaciones con un ángulo de elevación de $45^{\circ}$. Si se encuentra parada a una distancia horizontal de $15\\text{ m}$ de la base de la antena, ¿cuál es la altura total de la antena?",
      "alternativas": {
        "A": "$16,70\\text{ m}$",
        "B": "$15,00\\text{ m}$",
        "C": "$13,30\\text{ m}$",
        "D": "$18,40\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Dibujamos el triángulo rectángulo desde la altura de los ojos de la ingeniera:\n - Cateto adyacente $= 15\\text{ m}$.\n - Ángulo $= 45^{\\circ}$.\n - Cateto opuesto $= y$ (porción superior de la antena desde los ojos).\nComo el ángulo es $45^{\circ}$, el triángulo es isósceles, de modo que $y = 15\\text{ m}$.\nPara hallar la altura total $H$, sumamos la estatura de la ingeniera:\n $H = y + \\text{estatura} = 15\\text{ m} + 1,70\\text{ m} = 16,70\\text{ metros}$.",
      "feedback_error": "Incorrecto. A partir del ángulo de $45^{\circ}$, la porción vertical sobre la altura de la ingeniera mide lo mismo que la distancia horizontal ($15\\text{ m}$). Sumando su altura de $1,70\\text{ m}$ obtenemos $16,70\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-8",
      "enunciado": "Un cable tensor sujeta una torre de transmisión de $20\\text{ m}$ de altura. Si el cable está anclado firmemente al suelo horizontal formando un ángulo de $30^{\circ}$ con la línea vertical de la torre, ¿cuál es la longitud total del cable tensor?",
      "alternativas": {
        "A": "$40\\text{ m}$",
        "B": "$20\\sqrt{3}\\text{ m}$",
        "C": "$40\\sqrt{3}\\text{ m}$",
        "D": "$\\frac{40\\sqrt{3}}{3}\\text{ m}$"
      },
      "respuesta_correcta": "D",
      "feedback_acierto": "¡Excelente! Cuidado: el ángulo de $30^{\circ}$ es **con la vertical de la torre** (el ángulo superior del triángulo rectángulo, no el del suelo). Esto significa que:\n - Cateto Adyacente al ángulo $= 20\\text{ m}$ (la torre).\n - Hipotenusa $= L$ (el cable).\nUsamos la razón coseno:\n $\\cos(30^{\\circ}) = \\frac{20}{L} \\implies \\frac{\\sqrt{3}}{2} = \\frac{20}{L}$.\nMultiplicamos cruzado:\n $L\\sqrt{3} = 40 \\implies L = \\frac{40}{\\sqrt{3}} = \\frac{40\\sqrt{3}}{3}\\text{ metros}$.",
      "feedback_error": "Incorrecto. Observa que el ángulo se forma con la vertical de la torre. Por ende, la torre es el cateto adyacente al ángulo de $30^{\circ}$. Planteamos $\\cos(30^{\\circ}) = 20 / L \\implies \\frac{\\sqrt{3}}{2} = \\frac{20}{L} \\implies L = \\frac{40\\sqrt{3}}{3}\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-9",
      "enunciado": "Desde un bote anclado en el mar se observa el borde de un acantilado de $100\\text{ m}$ de altura con un ángulo de elevación de $60^{\circ}$. ¿A qué distancia aproximada de la pared vertical del acantilado se encuentra el bote?",
      "alternativas": {
        "A": "$\\frac{100\\sqrt{3}}{3}\\text{ m}$",
        "B": "$100\\sqrt{3}\\text{ m}$",
        "C": "$50\\text{ m}$",
        "D": "$50\\sqrt{3}\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La altura del acantilado es el cateto opuesto ($100\\text{ m}$) y la distancia horizontal es el cateto adyacente ($x$) al ángulo de $60^{\circ}$:\n $\\tan(60^{\\circ}) = \\frac{100}{x} \\implies \\sqrt{3} = \\frac{100}{x} \\implies x = \\frac{100}{\\sqrt{3}} = \\frac{100\\sqrt{3}}{3}\\text{ metros}$.",
      "feedback_error": "Incorrecto. Aplicando la definición de tangente: $\\tan(60^{\\circ}) = 100 / x \\implies \\sqrt{3} = 100 / x$. Despejando y racionalizando obtenemos $x = \\frac{100\\sqrt{3}}{3}\\text{ m}$."
    },
    {
      "id": "q-m2-3-3-10",
      "enunciado": "Una rampa de acceso para silla de ruedas debe salvar un desnivel vertical de exactamente $0,9\\text{ m}$ de altura. Si por normativa legal el ángulo de inclinación máximo con la horizontal es de $6^{\circ}$, ¿cuál debe ser la longitud mínima de la rampa en metros utilizando la aproximación $\\sin(6^{\circ}) \\approx 0,10$?",
      "alternativas": {
        "A": "$9\\text{ m}$",
        "B": "$15\\text{ m}$",
        "C": "$6\\text{ m}$",
        "D": "$10\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! La longitud de la rampa representa la hipotenusa $L$ del triángulo rectángulo. El desnivel es el cateto opuesto de $0,9\\text{ m}$:\n $\\sin(6^{\circ}) = \\frac{0,9}{L}$.\nReemplazamos con la aproximación dada:\n $0,10 = \\frac{0,9}{L} \\implies L = \\frac{0,9}{0,10} = 9\\text{ metros}$.",
      "feedback_error": "Incorrecto. La rampa es la hipotenusa y el desnivel es el cateto opuesto. Planteando el seno: $\\sin(6^{\circ}) = 0,9 / L$. Al aproximar $\\sin(6^{\circ}) \\approx 0,1$, tenemos $0,1 = 0,9 / L \\implies L = 9\\text{ m}$."
    }
  ],
  "sec-m2-3-4": [
    {
      "id": "q-m2-3-4-1",
      "enunciado": "En una circunferencia de centro $O$, un ángulo inscrito $\\alpha$ subtiende un arco de medida angular $80^{\circ}$. ¿Cuál es la medida en grados del ángulo del centro que subtiende el mismo arco?",
      "alternativas": {
        "A": "$80^{\circ}$",
        "B": "$40^{\circ}$",
        "C": "$160^{\circ}$",
        "D": "$120^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por propiedades fundamentales de los ángulos en la circunferencia, la medida de un ángulo del centro es exactamente igual a la medida del arco de circunferencia que subtiende. Como el arco subtendido mide $80^{\circ}$, el ángulo del centro mide exactamente $80^{\circ}$.",
      "feedback_error": "Incorrecto. Recuerda que el ángulo del centro mide exactamente lo mismo que el arco subtendido, es decir, $80^{\circ}$."
    },
    {
      "id": "q-m2-3-4-2",
      "enunciado": "En una circunferencia, un ángulo inscrito $\\theta$ y un ángulo del centro $\\alpha$ subtienden el mismo arco. Si la suma de las medidas de ambos ángulos es $\\alpha + \\theta = 120^{\circ}$, ¿cuál es la medida del ángulo inscrito $\\theta$?",
      "alternativas": {
        "A": "$40^{\circ}$",
        "B": "$80^{\circ}$",
        "C": "$60^{\circ}$",
        "D": "$30^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por teorema, un ángulo inscrito mide la mitad del ángulo del centro que subtiende el mismo arco:\n $\\alpha = 2\\theta$.\nSustituimos en la ecuación dada:\n $2\\theta + \\theta = 120^{\circ} \\implies 3\\theta = 120^{\circ} \\implies \\theta = 40^{\circ}$.",
      "feedback_error": "Incorrecto. Como el ángulo del centro mide el doble que el inscrito, planteamos: $2\\theta + \\theta = 120^{\circ} \\implies 3\\theta = 120^{\circ}$, de donde $\\theta = 40^{\circ}$."
    },
    {
      "id": "q-m2-3-4-3",
      "enunciado": "Un ángulo interior $\\alpha$ en una circunferencia tiene su vértice dentro de la circunferencia y subtiende dos arcos opuestos por el vértice cuyas medidas angulares son $70^{\circ}$ y $110^{\circ}$. ¿Cuál es la medida en grados de este ángulo interior?",
      "alternativas": {
        "A": "$90^{\circ}$",
        "B": "$40^{\circ}$",
        "C": "$180^{\circ}$",
        "D": "$140^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La medida de un ángulo interior en la circunferencia corresponde a la semisuma (promedio) de las medidas de los arcos subtendidos por el ángulo y sus prolongaciones:\n $\\alpha = \\frac{\\text{Arco}_1 + \\text{Arco}_2}{2} = \\frac{70^{\circ} + 110^{\circ}}{2} = \\frac{180^{\circ}}{2} = 90^{\circ}$.",
      "feedback_error": "Incorrecto. El ángulo interior se calcula como la semisuma de los dos arcos que subtienden él y su opuesto por el vértice: $\\frac{70^{\circ} + 110^{\circ}}{2} = 90^{\circ}$."
    },
    {
      "id": "q-m2-3-4-4",
      "enunciado": "Dos cuerdas $AB$ y $CD$ de una circunferencia se cortan perpendicularmente en un punto interior $P$. Si el arco de circunferencia $AC$ mide exactamente $60^{\circ}$, ¿cuánto mide el arco opuesto $BD$?",
      "alternativas": {
        "A": "$120^{\circ}$",
        "B": "$60^{\circ}$",
        "C": "$90^{\circ}$",
        "D": "$180^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Como las cuerdas se cortan perpendicularmente, el ángulo interior formado por ellas mide $90^{\circ}$.\nAplicamos el teorema del ángulo interior:\n $\\text{Ángulo} = \\frac{\\text{Arco}(AC) + \\text{Arco}(BD)}{2} \\implies 90^{\circ} = \\frac{60^{\circ} + \\text{Arco}(BD)}{2}$.\nMultiplicamos por 2:\n $180^{\circ} = 60^{\circ} + \\text{Arco}(BD) \\implies \\text{Arco}(BD) = 120^{\circ}$.",
      "feedback_error": "Incorrecto. El ángulo interior mide $90^{\circ}$ debido a la perpendicularidad. Planteamos $90^{\circ} = \\frac{60^{\circ} + x}{2} \\implies 180^{\circ} = 60^{\circ} + x$, de donde el arco opuesto mide $120^{\circ}$."
    },
    {
      "id": "q-m2-3-4-5",
      "enunciado": "Desde un punto exterior $P$ a una circunferencia se trazan dos rectas secantes que intersectan a la circunferencia, determinando un arco mayor de $130^{\circ}$ y un arco menor de $50^{\circ}$ entre ellas. ¿Cuál es la medida del ángulo exterior formado en el punto $P$?",
      "alternativas": {
        "A": "$40^{\circ}$",
        "B": "$90^{\circ}$",
        "C": "$80^{\circ}$",
        "D": "$45^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Por el teorema del ángulo exterior en una circunferencia, la medida del ángulo exterior es igual a la semidiferencia de los arcos subtendidos entre sus lados:\n $\\theta_{ext} = \\frac{\\text{Arco Mayor} - \\text{Arco Menor}}{2} = \\frac{130^{\circ} - 50^{\circ}}{2} = \\frac{80^{\circ}}{2} = 40^{\circ}$.",
      "feedback_error": "Incorrecto. Un ángulo exterior se determina calculando la semidiferencia de sus arcos interceptados: $\\frac{130^{\circ} - 50^{\circ}}{2} = 40^{\circ}$."
    },
    {
      "id": "q-m2-3-4-6",
      "enunciado": "Un ángulo inscrito en una circunferencia subtiende un arco determinado por un diámetro. ¿Cuál es la medida exacta de este ángulo inscrito?",
      "alternativas": {
        "A": "$90^{\circ}$",
        "B": "$180^{\circ}$",
        "C": "$45^{\circ}$",
        "D": "Depende del radio de la circunferencia."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Un diámetro divide a la circunferencia en dos arcos iguales de $180^{\circ}$ cada uno (semicircunferencia). Como el ángulo inscrito mide exactamente la mitad del arco que subtiende:\n $\\theta = \\frac{180^{\circ}}{2} = 90^{\circ}$.\nEste es un corolario clave de la geometría euclidiana: todo ángulo inscrito en una semicircunferencia es recto.",
      "feedback_error": "Incorrecto. Todo diámetro subtiende un arco de $180^{\circ}$. El ángulo inscrito que subtiende dicho diámetro mide la mitad, es decir, siempre $90^{\circ}$."
    },
    {
      "id": "q-m2-3-4-7",
      "enunciado": "En la circunferencia de centro $O$, las cuerdas $AB$ y $AC$ son congruentes y forman un ángulo inscrito $\\angle BAC = 50^{\circ}$. ¿Cuál es la medida en grados del arco menor $BC$?",
      "alternativas": {
        "A": "$100^{\circ}$",
        "B": "$50^{\circ}$",
        "C": "$130^{\circ}$",
        "D": "$200^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El ángulo $\\angle BAC$ es un ángulo inscrito que subtiende el arco $BC$. Por teorema, la medida del arco subtendido es el doble de la medida del ángulo inscrito homólogo:\n $\\text{Arco}(BC) = 2 \\cdot \\angle BAC = 2 \\cdot 50^{\circ} = 100^{\circ}$.",
      "feedback_error": "Incorrecto. El ángulo inscrito $\\angle BAC$ mide la mitad del arco que subtiende. Por lo tanto, el arco $BC$ mide el doble del ángulo inscrito: $2 \\cdot 50^{\circ} = 100^{\circ}$."
    },
    {
      "id": "q-m2-3-4-8",
      "enunciado": "Sea $AB$ un diámetro de una circunferencia y $C$ un punto cualquiera sobre ella. Si la medida del ángulo inscrito $\\angle CAB$ es $35^{\circ}$, ¿cuál es la medida del ángulo $\\angle CBA$?",
      "alternativas": {
        "A": "$55^{\circ}$",
        "B": "$35^{\circ}$",
        "C": "$45^{\circ}$",
        "D": "$90^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Como $AB$ es un diámetro, el ángulo inscrito $\\angle ACB$ subtiende una semicircunferencia y, por ende, mide exactamente $90^{\circ}$.\nEl triángulo $ABC$ es, entonces, un triángulo rectángulo en $C$.\nLa suma de los ángulos agudos en un triángulo rectángulo es $90^{\circ}$:\n $\\angle CBA = 90^{\circ} - 35^{\circ} = 55^{\circ}$.",
      "feedback_error": "Incorrecto. Al subtiende el diámetro $AB$, el ángulo en $C$ es de $90^{\circ}$. En el triángulo rectángulo, los ángulos agudos suman $90^{\circ}$, por lo que $\\angle CBA = 90^{\circ} - 35^{\circ} = 55^{\circ}$."
    },
    {
      "id": "q-m2-3-4-9",
      "enunciado": "En una circunferencia se inscribe el cuadrilátero $ABCD$. Si la medida del ángulo interior opuesto $\\angle DAB$ es de $115^{\circ}$, ¿cuál es la medida en grados del ángulo opuesto $\\angle BCD$?",
      "alternativas": {
        "A": "$65^{\circ}$",
        "B": "$115^{\circ}$",
        "C": "$75^{\circ}$",
        "D": "$90^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Una propiedad fundamental de los cuadriláteros cíclicos (inscritos en una circunferencia) es que sus ángulos interiores opuestos son suplementarios, es decir, suman siempre $180^{\circ}$:\n $\\angle DAB + \\angle BCD = 180^{\circ} \\implies 115^{\circ} + \\angle BCD = 180^{\circ} \\implies \\angle BCD = 65^{\circ}$.",
      "feedback_error": "Incorrecto. En cualquier cuadrilátero inscrito en una circunferencia, los ángulos opuestos suman $180^{\circ}$. De este modo, $\\angle BCD = 180^{\circ} - 115^{\circ} = 65^{\circ}$."
    },
    {
      "id": "q-m2-3-4-10",
      "enunciado": "Un arco menor $AB$ de una circunferencia mide exactamente $70^{\circ}$. Si se traza una recta tangente a la circunferencia en el punto $A$ y una cuerda $AB$, ¿cuánto mide el ángulo semi-inscrito formado entre la recta tangente y la cuerda?",
      "alternativas": {
        "A": "$35^{\circ}$",
        "B": "$70^{\circ}$",
        "C": "$140^{\circ}$",
        "D": "$55^{\circ}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Un ángulo semi-inscrito está formado por una recta tangente y una cuerda que concurren en el punto de tangencia. Su medida es exactamente la mitad de la medida del arco de circunferencia interceptado entre sus lados:\n $\\theta_{semi} = \\frac{\\text{Arco}(AB)}{2} = \\frac{70^{\circ}}{2} = 35^{\circ}$.",
      "feedback_error": "Incorrecto. Un ángulo semi-inscrito se comporta igual que un ángulo inscrito, midiendo la mitad del arco que intercepta: $\\frac{70^{\circ}}{2} = 35^{\circ}$."
    }
  ],
  "sec-m2-3-5": [
    {
      "id": "q-m2-3-5-1",
      "enunciado": "Dos cuerdas de una circunferencia, $AB$ y $CD$, se intersectan en un punto interior $P$. Si se sabe que $PA = 6\\text{ cm}$, $PB = 4\\text{ cm}$ y $PC = 3\\text{ cm}$, ¿cuál es la longitud del segmento $PD$?",
      "alternativas": {
        "A": "$8\\text{ cm}$",
        "B": "$2\\text{ cm}$",
        "C": "$4,5\\text{ cm}$",
        "D": "$5\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por el Teorema de las Cuerdas en la circunferencia, cuando dos cuerdas se intersectan en el interior, los productos de los segmentos en que queda dividida cada cuerda son iguales:\n $PA \\cdot PB = PC \\cdot PD$.\nReemplazamos con los datos del enunciado:\n $6 \\cdot 4 = 3 \\cdot PD \\implies 24 = 3 \\cdot PD \\implies PD = \\frac{24}{3} = 8\\text{ cm}$.",
      "feedback_error": "Incorrecto. Según el teorema de las cuerdas, se cumple que $PA \\cdot PB = PC \\cdot PD$. Sustituyendo valores: $6 \\cdot 4 = 3 \\cdot PD \\implies PD = 8\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-2",
      "enunciado": "Desde un punto exterior $P$ a una circunferencia se trazan dos secantes $PAB$ y $PCD$. Si los segmentos exteriores miden $PA = 4\\text{ cm}$ y $PC = 3\\text{ cm}$, y el segmento secante total $PB$ mide $9\\text{ cm}$, ¿cuál es la longitud del segmento secante total $PD$?",
      "alternativas": {
        "A": "$12\\text{ cm}$",
        "B": "$6,75\\text{ cm}$",
        "C": "$8\\text{ cm}$",
        "D": "$10\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por el Teorema de las Secantes, cuando dos rectas secantes parten de un mismo punto exterior $P$, el producto del segmento exterior por el segmento total de una de ellas es igual al de la otra:\n $PA \\cdot PB = PC \\cdot PD$.\nSustituimos los valores conocidos:\n $4 \\cdot 9 = 3 \\cdot PD \\implies 36 = 3 \\cdot PD \\implies PD = \\frac{36}{3} = 12\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda el teorema de las secantes: $\\text{exterior} \\cdot \\text{total} = \\text{exterior} \\cdot \\text{total} \\implies PA \\cdot PB = PC \\cdot PD$. Operando obtenemos $4 \\cdot 9 = 3 \\cdot PD \\implies PD = 12\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-3",
      "enunciado": "Desde un punto exterior $P$ se trazan una recta tangente en el punto $T$ y una secante $PAB$. Si la longitud del segmento tangente es $PT = 6\\text{ cm}$ y el segmento exterior de la secante mide $PA = 4\\text{ cm}$, ¿cuál es la longitud total del segmento secante $PB$?",
      "alternativas": {
        "A": "$9\\text{ cm}$",
        "B": "$5\\text{ cm}$",
        "C": "$8\\text{ cm}$",
        "D": "$12\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por el Teorema de la Tangente y la Secante, se cumple que el cuadrado de la longitud del segmento tangente es igual al producto de la parte exterior de la secante por su longitud total:\n $PT^2 = PA \\cdot PB$.\nSustituimos los valores conocidos:\n $6^2 = 4 \\cdot PB \\implies 36 = 4 \\cdot PB \\implies PB = \\frac{36}{4} = 9\\text{ cm}$.",
      "feedback_error": "Incorrecto. Por teorema de la tangente y la secante: $PT^2 = PA \\cdot PB$. Sustituyendo valores obtenemos $6^2 = 4 \\cdot PB \\implies 36 = 4 \\cdot PB \\implies PB = 9\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-4",
      "enunciado": "En una circunferencia de centro $O$, dos cuerdas se intersectan en un punto interior $P$. La primera cuerda queda dividida en segmentos de $4\\text{ cm}$ y $8\\text{ cm}$. Si la segunda cuerda tiene una longitud total de $12\\text{ cm}$, ¿cuáles son las longitudes de los dos segmentos en los que queda dividida la segunda cuerda?",
      "alternativas": {
        "A": "$4\\text{ cm}$ y $8\\text{ cm}$",
        "B": "$3\\text{ cm}$ y $9\\text{ cm}$",
        "C": "$2\\text{ cm}$ y $10\\text{ cm}$",
        "D": "$6\\text{ cm}$ y $6\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Llamamos $x$ e $y$ a los segmentos de la segunda cuerda, de modo que:\n 1) $x + y = 12 \\implies y = 12 - x$.\n 2) Por teorema de las cuerdas: $x \\cdot y = 4 \\cdot 8 = 32$.\nSustituimos la primera ecuación en la segunda:\n $x(12 - x) = 32 \\implies 12x - x^2 = 32 \\implies x^2 - 12x + 32 = 0$.\nFactorizando la ecuación cuadrática:\n $(x - 8)(x - 4) = 0 \\implies x = 8$ o $x = 4$.\nPor lo tanto, los dos segmentos miden $4\\text{ cm}$ y $8\\text{ cm}$.",
      "feedback_error": "Incorrecto. Planteamos el sistema $x + y = 12$ y $x \\cdot y = 32$. Resolviendo la ecuación de segundo grado resultante, las longitudes de los segmentos son $4\\text{ cm}$ y $8\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-5",
      "enunciado": "Desde un punto exterior $P$ a una circunferencia se traza una tangente $PT$ y una secante $PAB$. Si $PT = 8\\text{ cm}$ y la cuerda interna mide $AB = 12\\text{ cm}$, ¿cuál es la longitud del segmento exterior de la secante $PA$?",
      "alternativas": {
        "A": "$4\\text{ cm}$",
        "B": "$16\\text{ cm}$",
        "C": "$2\\text{ cm}$",
        "D": "$6\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Definimos el segmento total como $PB = PA + AB = PA + 12$.\nAplicamos el Teorema de la Tangente y la Secante:\n $PT^2 = PA \\cdot PB \\implies 8^2 = PA \\cdot (PA + 12) \\implies 64 = PA^2 + 12PA$.\nObtenemos una ecuación cuadrática:\n $PA^2 + 12PA - 64 = 0$.\nFactorizamos buscando números que multiplicados den $-64$ y sumados $12$:\n $(PA + 16)(PA - 4) = 0$.\nComo las distancias deben ser positivas, elegimos $PA = 4\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que el segmento total es $PA + 12$. Planteando $PT^2 = PA(PA + 12)$, obtenemos la ecuación $PA^2 + 12PA - 64 = 0$. Resolviendo para la solución positiva resulta $PA = 4\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-6",
      "enunciado": "Dos cuerdas $AB$ y $CD$ se cortan en un punto interior $P$. Si los segmentos de la primera cuerda miden $PA = x$ y $PB = x + 2$, y los segmentos de la segunda cuerda miden $PC = 3\\text{ cm}$ y $PD = 8\\text{ cm}$. ¿Cuál es el valor real positivo del parámetro $x$?",
      "alternativas": {
        "A": "$4$",
        "B": "$2$",
        "C": "$6$",
        "D": "$3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por Teorema de las Cuerdas:\n $PA \\cdot PB = PC \\cdot PD \\implies x(x + 2) = 3 \\cdot 8 \\implies x^2 + 2x = 24$.\nEscribimos la ecuación de segundo grado:\n $x^2 + 2x - 24 = 0$.\nFactorizando:\n $(x + 6)(x - 4) = 0$.\nTomamos la raíz positiva, lo cual da $x = 4$.",
      "feedback_error": "Incorrecto. Planteamos la ecuación del teorema de las cuerdas: $x(x + 2) = 24 \\implies x^2 + 2x - 24 = 0$. Factorizando como $(x + 6)(x - 4) = 0$, obtenemos la solución positiva $x = 4$."
    },
    {
      "id": "q-m2-3-5-7",
      "enunciado": "En una circunferencia se traza una cuerda $AB$ que mide exactamente $10\\text{ cm}$. Si se traza un diámetro perpendicular a ella, este la intersecta en el punto $M$. ¿Cuánto mide la porción de segmento $AM$?",
      "alternativas": {
        "A": "$5\\text{ cm}$",
        "B": "$2,5\\text{ cm}$",
        "C": "$10\\text{ cm}$",
        "D": "Depende del radio de la circunferencia."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Un teorema geométrico fundamental de la circunferencia establece que todo diámetro o radio que sea perpendicular a una cuerda actúa como simetral de esta, es decir, la biseca dividiéndola en dos segmentos perfectamente congruentes. Por lo tanto:\n $AM = MB = \\frac{AB}{2} = \\frac{10\\text{ cm}}{2} = 5\\text{ cm}$.",
      "feedback_error": "Incorrecto. Cualquier diámetro que intersecte perpendicularmente a una cuerda la divide exactamente a la mitad. Por lo tanto, $AM = 10 / 2 = 5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-8",
      "enunciado": "Desde un punto exterior $P$ a una circunferencia se traza una recta secante que pasa exactamente por el centro $O$. Si la distancia desde $P$ al punto más cercano de la circunferencia es de $4\\text{ cm}$ y el radio de la circunferencia mide $6\\text{ cm}$, ¿cuál es la longitud de la tangente $PT$ trazada desde $P$?",
      "alternativas": {
        "A": "$8\\text{ cm}$",
        "B": "$4\\sqrt{10}\\text{ cm}$",
        "C": "$4\\text{ cm}$",
        "D": "$16\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La secante que pasa por el centro determina los puntos $A$ (más cercano) y $B$ (más lejano):\n - Segmento exterior: $PA = 4\\text{ cm}$.\n - Diámetro de la circunferencia: $2r = 2 \\cdot 6 = 12\\text{ cm}$.\n - Segmento secante total: $PB = PA + 2r = 4 + 12 = 16\\text{ cm}$.\nAplicamos el Teorema de la Tangente y la Secante:\n $PT^2 = PA \\cdot PB \\implies PT^2 = 4 \\cdot 16 = 64 \\implies PT = \\sqrt{64} = 8\\text{ cm}$.",
      "feedback_error": "Incorrecto. El segmento secante total es la distancia externa más el diámetro: $4 + 12 = 16\\text{ cm}$. Por teorema de la tangente: $PT^2 = 4 \\cdot 16 = 64 \\implies PT = 8\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-9",
      "enunciado": "Dos cuerdas $AB$ y $CD$ se intersectan en un punto interior $P$. Si la cuerda $AB$ mide $14\\text{ cm}$ y el punto $P$ la divide en la razón $PA:PB = 3:4$, y además se sabe que $PC = 6\\text{ cm}$, ¿cuál es la longitud del segmento $PD$?",
      "alternativas": {
        "A": "$8\\text{ cm}$",
        "B": "$6\\text{ cm}$",
        "C": "$4,5\\text{ cm}$",
        "D": "$12\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero determinamos los segmentos $PA$ y $PB$ usando su suma y proporción:\n $PA = 3x$ y $PB = 4x$.\n Como $AB = PA + PB = 14 \\implies 3x + 4x = 14 \\implies 7x = 14 \\implies x = 2$.\n Por lo tanto: $PA = 6\\text{ cm}$ y $PB = 8\\text{ cm}$.\nAplicamos el Teorema de las Cuerdas:\n $PA \\cdot PB = PC \\cdot PD \\implies 6 \\cdot 8 = 6 \\cdot PD \\implies 48 = 6 \\cdot PD \\implies PD = 8\\text{ cm}$.",
      "feedback_error": "Incorrecto. Primero determinamos las longitudes de los segmentos de la cuerda dividiendo 14 en proporción $3:4$, lo que da $6\\text{ cm}$ y $8\\text{ cm}$. Usando el teorema de las cuerdas: $6 \\cdot 8 = 6 \\cdot PD \\implies PD = 8\\text{ cm}$."
    },
    {
      "id": "q-m2-3-5-10",
      "enunciado": "Un punto exterior $P$ se encuentra a una distancia de exactamente $13\\text{ cm}$ del centro $O$ de una circunferencia de radio $5\\text{ cm}$. ¿Cuál es la longitud del segmento de recta tangente $PT$ trazado desde $P$ hasta la circunferencia?",
      "alternativas": {
        "A": "$12\\text{ cm}$",
        "B": "$18\\text{ cm}$",
        "C": "$8\\text{ cm}$",
        "D": "$\\sqrt{194}\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El radio dibujado hasta el punto de tangencia $T$ es perpendicular a la recta tangente $PT$. Esto forma un triángulo rectángulo $PTO$ donde:\n - La hipotenusa es la distancia al centro: $PO = 13\\text{ cm}$.\n - Un cateto es el radio: $OT = 5\\text{ cm}$.\n - El otro cateto es el segmento tangente: $PT$.\nAplicamos el Teorema de Pitágoras:\n $PT^2 + OT^2 = PO^2 \\implies PT^2 + 5^2 = 13^2 \\implies PT^2 + 25 = 169$.\n $PT^2 = 169 - 25 = 144 \\implies PT = 12\\text{ cm}$.",
      "feedback_error": "Incorrecto. Se forma un triángulo rectángulo entre el radio (cateto de $5$), la tangente (cateto buscado) y la distancia al centro (hipotenusa de $13$). Por Pitágoras: $PT = \\sqrt{13^2 - 5^2} = 12\\text{ cm}$."
    }
  ],
  "sec-m2-3-6": [
    {
      "id": "q-m2-3-6-1",
      "enunciado": "Una recta es tangente a una circunferencia de centro $O$ en el punto $T$. Si la distancia desde el centro $O$ a un punto exterior $P$ ubicado sobre la recta tangente es de $17\\text{ cm}$ y el radio de la circunferencia mide $8\\text{ cm}$, ¿cuál es la longitud del segmento tangente $PT$?",
      "alternativas": {
        "A": "$15\\text{ cm}$",
        "B": "$9\\text{ cm}$",
        "C": "$25\\text{ cm}$",
        "D": "$\\sqrt{353}\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El radio $OT$ y la tangente $PT$ son perpendiculares en el punto de tangencia $T$. Esto forma el triángulo rectángulo $OTP$ con hipotenusa $OP = 17\\text{ cm}$:\n $PT^2 + OT^2 = OP^2 \\implies PT^2 + 8^2 = 17^2 \\implies PT^2 + 64 = 289$.\n $PT^2 = 289 - 64 = 225 \\implies PT = 15\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que la tangente y el radio son perpendiculares en el punto de contacto. Por Pitágoras: $PT^2 + 8^2 = 17^2 \\implies PT^2 = 225 \\implies PT = 15\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-2",
      "enunciado": "Dos circunferencias concéntricas poseen radios de $5\\text{ cm}$ y $13\\text{ cm}$. Se traza una cuerda en la circunferencia mayor de modo que es perfectamente tangente a la circunferencia menor. ¿Cuál es la longitud exacta de esta cuerda?",
      "alternativas": {
        "A": "$24\\text{ cm}$",
        "B": "$12\\text{ cm}$",
        "C": "$18\\text{ cm}$",
        "D": "$20\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Sea $C$ la cuerda tangente a la circunferencia menor de radio $r = 5\\text{ cm}$ en el punto de contacto $T$. El radio $r$ es perpendicular a la cuerda, dividiéndola en dos segmentos congruentes de longitud $x$.\nUniendo el centro con el extremo de la cuerda obtenemos un triángulo rectángulo con hipotenusa igual al radio mayor $R = 13\\text{ cm}$:\n $x^2 + r^2 = R^2 \\implies x^2 + 5^2 = 13^2 \\implies x^2 + 25 = 169 \\implies x^2 = 144 \\implies x = 12\\text{ cm}$.\nLa longitud total de la cuerda es el doble de $x$:\n $\\text{Cuerda} = 2x = 2 \\cdot 12\\text{ cm} = 24\\text{ cm}$.",
      "feedback_error": "Incorrecto. Pitágoras nos da la mitad de la cuerda: $\\sqrt{13^2 - 5^2} = 12\\text{ cm}$. La longitud total de la cuerda es el doble de esta medida, es decir, $24\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-3",
      "enunciado": "Una cuerda de una circunferencia mide exactamente $16\\text{ cm}$ y se encuentra a una distancia perpendicular de $6\\text{ cm}$ del centro. ¿Cuál es el **diámetro** de esta circunferencia en centímetros?",
      "alternativas": {
        "A": "$20\\text{ cm}$",
        "B": "$10\\text{ cm}$",
        "C": "$12\\text{ cm}$",
        "D": "$16\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La distancia desde el centro a la cuerda divide a esta perpendicularmente en dos mitades congruentes de $8\\text{ cm}$ cada una.\nSe forma un triángulo rectángulo con catetos de $6\\text{ cm}$ (distancia) y $8\\text{ cm}$ (mitad de la cuerda). La hipotenusa de este triángulo es el radio $r$:\n $r = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$.\nEl diámetro es el doble del radio:\n $D = 2r = 2 \\cdot 10 = 20\\text{ cm}$.",
      "feedback_error": "Incorrecto. Primero calculamos el radio usando Pitágoras con la distancia ($6$) y la mitad de la cuerda ($8$): $r = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. El diámetro es el doble de este radio, es decir, $20\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-4",
      "enunciado": "En una circunferencia de centro $O$ y radio $r = 10\\text{ cm}$, se traza una cuerda $AB$ a una distancia perpendicular de exactamente $8\\text{ cm}$ del centro. ¿Cuál es la longitud total de la cuerda $AB$?",
      "alternativas": {
        "A": "$12\\text{ cm}$",
        "B": "$6\\text{ cm}$",
        "C": "$16\\text{ cm}$",
        "D": "$10\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La distancia del centro de $8\\text{ cm}$ divide a la cuerda a la mitad en un punto $M$, formando un triángulo rectángulo con la hipotenusa $r = 10\\text{ cm}$:\n $AM^2 + 8^2 = 10^2 \\implies AM^2 + 64 = 100 \\implies AM^2 = 36 \\implies AM = 6\\text{ cm}$.\nLa longitud total de la cuerda $AB$ es el doble del segmento $AM$:\n $AB = 2 \\cdot AM = 2 \\cdot 6\\text{ cm} = 12\\text{ cm}$.",
      "feedback_error": "Incorrecto. Por teorema de Pitágoras, la mitad de la cuerda mide $\\sqrt{10^2 - 8^2} = 6\\text{ cm}$. La longitud de la cuerda completa $AB$ es de $12\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-5",
      "enunciado": "Desde un punto exterior $P$ se trazan dos tangentes $PA$ y $PB$ a una circunferencia. Si el ángulo formado por las dos tangentes en $P$ es de $60^{\circ}$ y el radio de la circunferencia mide $6\\text{ cm}$, ¿cuál es la longitud del segmento tangente $PA$ en centímetros?",
      "alternativas": {
        "A": "$6\\sqrt{3}\\text{ cm}$",
        "B": "$6\\text{ cm}$",
        "C": "$2\\sqrt{3}\\text{ cm}$",
        "D": "$12\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El segmento $OP$ que une el centro con el punto exterior biseca al ángulo $\\angle APB$, de modo que el ángulo $\\angle APO$ mide $30^{\circ}$.\nEl radio $OA = 6\\text{ cm}$ es perpendicular a la tangente $PA$. Esto forma el triángulo rectángulo $OAP$ recto en $A$:\n $\\tan(30^{\\circ}) = \\frac{OA}{PA} \\implies \\frac{\\sqrt{3}}{3} = \\frac{6}{PA} \\implies PA = \\frac{18}{\\sqrt{3}} = 6\\sqrt{3}\\text{ cm}$.",
      "feedback_error": "Incorrecto. El segmento que une el centro con $P$ divide el ángulo a la mitad ($30^{\circ}$). Con el radio de $6$, planteamos $\\tan(30^{\\circ}) = 6 / PA \\implies PA = 6\\sqrt{3}\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-6",
      "enunciado": "Un arco ornamental de un puente peatonal tiene forma de arco circular. La luz del arco (distancia entre bases) mide $24\\text{ m}$ y la flecha del arco (altura máxima en el centro) es de $8\\text{ m}$. ¿Cuál es el **radio** de la circunferencia que define el arco del puente?",
      "alternativas": {
        "A": "$13\\text{ m}$",
        "B": "$10\\text{ m}$",
        "C": "$15\\text{ m}$",
        "D": "$12,5\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Imaginemos el círculo completo de radio $R$:\n - La luz del puente actúa como una cuerda horizontal de longitud $24\\text{ m}$. La mitad mide $12\\text{ m}$.\n - La flecha del arco mide $8\\text{ m}$.\n - La distancia desde el centro del círculo hasta la cuerda es $R - 8$ metros.\nAplicamos el Teorema de Pitágoras:\n $12^2 + (R - 8)^2 = R^2 \\implies 144 + R^2 - 16R + 64 = R^2$.\nSimplificamos cancelando $R^2$:\n $208 - 16R = 0 \\implies 16R = 208 \\implies R = \\frac{208}{16} = 13\\text{ metros}$.",
      "feedback_error": "Incorrecto. Se forma un triángulo de catetos $12$ (mitad de la luz) y $R - 8$ (distancia al centro), con hipotenusa $R$. Resolviendo $12^2 + (R - 8)^2 = R^2$ obtenemos $R = 13\\text{ m}$."
    },
    {
      "id": "q-m2-3-6-7",
      "enunciado": "En una circunferencia se inscribe un triángulo rectángulo cuyos catetos miden $12\\text{ cm}$ y $16\\text{ cm}$. ¿Cuál es la longitud del **radio** de esta circunferencia?",
      "alternativas": {
        "A": "$10\\text{ cm}$",
        "B": "$20\\text{ cm}$",
        "C": "$5\\text{ cm}$",
        "D": "$8\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Todo triángulo rectángulo inscrito en una circunferencia tiene su hipotenusa coincidiendo exactamente con un diámetro de la circunferencia.\nCalculamos primero la hipotenusa $c$ usando el Teorema de Pitágoras:\n $c = \\sqrt{12^2 + 16^2} = \\sqrt{144 + 256} = \\sqrt{400} = 20\\text{ cm}$.\nComo la hipotenusa es el diámetro, el radio mide la mitad:\n $r = \\frac{20}{2} = 10\\text{ cm}$.",
      "feedback_error": "Incorrecto. Recuerda que la hipotenusa de un triángulo rectángulo inscrito es igual al diámetro. Por Pitágoras la hipotenusa es $20\\text{ cm}$, por lo tanto, el radio mide la mitad: $10\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-8",
      "enunciado": "Se tiene un cuadrado de lado $8\\text{ cm}$ circunscrito exteriormente a una circunferencia de radio $r$. ¿Cuál es el valor del radio $r$ de la circunferencia?",
      "alternativas": {
        "A": "$4\\text{ cm}$",
        "B": "$8\\text{ cm}$",
        "C": "$2\\text{ cm}$",
        "D": "$4\\sqrt{2}\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Cuando un cuadrado está circunscrito a una circunferencia, el diámetro de la circunferencia es exactamente igual a la longitud del lado del cuadrado:\n $2r = L \\implies 2r = 8\\text{ cm} \\implies r = 4\\text{ cm}$.",
      "feedback_error": "Incorrecto. En una circunferencia inscrita en un cuadrado (cuadrado circunscrito), el diámetro es igual al lado del cuadrado. Por tanto, el radio es la mitad del lado: $4\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-9",
      "enunciado": "En una circunferencia de radio $10\\text{ cm}$, se traza una cuerda $AB$ cuya distancia perpendicular al centro es de exactamente $5\\text{ cm}$. ¿Cuál es la longitud exacta de la cuerda $AB$ en centímetros?",
      "alternativas": {
        "A": "$10\\sqrt{3}\\text{ cm}$",
        "B": "$5\\sqrt{3}\\text{ cm}$",
        "C": "$10\\text{ cm}$",
        "D": "$5\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La distancia divide a la cuerda a la mitad en $M$. Formamos el triángulo rectángulo con hipotenusa $r = 10\\text{ cm}$ y cateto de distancia de $5\\text{ cm}$:\n $AM^2 + 5^2 = 10^2 \\implies AM^2 + 25 = 100 \\implies AM^2 = 75 \\implies AM = \\sqrt{75} = 5\\sqrt{3}\\text{ cm}$.\nLa longitud total de la cuerda es el doble de la mitad:\n $AB = 2 \\cdot AM = 2 \\cdot 5\\sqrt{3}\\text{ cm} = 10\\sqrt{3}\\text{ cm}$.",
      "feedback_error": "Incorrecto. Por teorema de Pitágoras, la mitad de la cuerda mide $\\sqrt{10^2 - 5^2} = \\sqrt{75} = 5\\sqrt{3}$. La cuerda completa mide el doble: $10\\sqrt{3}\\text{ cm}$."
    },
    {
      "id": "q-m2-3-6-10",
      "enunciado": "Un canal de regadío con sección transversal circular tiene un diámetro de $2\\text{ m}$. Si el agua en su interior alcanza una profundidad máxima de exactamente $0,4\\text{ m}$ en el centro del canal, ¿cuál es el ancho horizontal de la superficie libre del agua?",
      "alternativas": {
        "A": "$1,6\\text{ m}$",
        "B": "$0,8\\text{ m}$",
        "C": "$1,2\\text{ m}$",
        "D": "$1,5\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La sección transversal es un círculo de radio $R = 1\\text{ m}$:\n - La superficie del agua actúa como una cuerda horizontal de longitud $2x$.\n - La profundidad máxima (flecha) es $0,4\\text{ m}$.\n - La distancia desde el centro del círculo hasta la cuerda del agua es: $R - 0,4 = 1 - 0,4 = 0,6\\text{ m}$.\nAplicamos el Teorema de Pitágoras para hallar la mitad del ancho $x$:\n $x^2 + 0,6^2 = 1^2 \\implies x^2 + 0,36 = 1 \\implies x^2 = 0,64 \\implies x = 0,8\\text{ m}$.\nEl ancho total de la superficie del agua es $2x = 2 \\cdot 0,8 = 1,6\\text{ metros}$.",
      "feedback_error": "Incorrecto. Con radio de 1 y profundidad de 0,4, la distancia vertical al centro es 0,6. Por Pitágoras, la mitad del ancho es $\\sqrt{1^2 - 0,6^2} = 0,8\\text{ m}$. El ancho total es $1,6\\text{ m}$."
    }
  ],
  "sec-m2-3-7": [
    {
      "id": "q-m2-3-7-1",
      "enunciado": "Una esfera de madera posee un radio de exactamente $3\\text{ cm}$. ¿Cuál es su **volumen** exacto expresado en términos del parámetro $\\pi$?",
      "alternativas": {
        "A": "$36\\pi\\text{ cm}^3$",
        "B": "$12\\pi\\text{ cm}^3$",
        "C": "$108\\pi\\text{ cm}^3$",
        "D": "$27\\pi\\text{ cm}^3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Aplicamos la fórmula del volumen de una esfera:\n $V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (3)^3 = \\frac{4}{3}\\pi \\cdot 27 = 4\\pi \\cdot 9 = 36\\pi\\text{ cm}^3$.",
      "feedback_error": "Incorrecto. Recuerda la fórmula del volumen: $V = \\frac{4}{3}\\pi r^3$. Reemplazando $r = 3$ nos queda $\\frac{4}{3}\\pi (27) = 36\\pi\\text{ cm}^3$."
    },
    {
      "id": "q-m2-3-7-2",
      "enunciado": "Si se sabe que el área de la superficie externa de una esfera es de exactamente $100\\pi\\text{ cm}^2$, ¿cuál es el radio de esta esfera?",
      "alternativas": {
        "A": "$5\\text{ cm}$",
        "B": "$10\\text{ cm}$",
        "C": "$25\\text{ cm}$",
        "D": "$5\\pi\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Aplicamos la fórmula del área de la superficie de una esfera:\n $A = 4\\pi r^2 \\implies 100\\pi = 4\\pi r^2$.\nDividimos por $\\pi$ a ambos lados y despejamos:\n $100 = 4r^2 \\implies r^2 = 25 \\implies r = 5\\text{ cm}$.",
      "feedback_error": "Incorrecto. El área de superficie es $A = 4\\pi r^2$. Igualando a $100\\pi$ nos queda $4r^2 = 100 \\implies r^2 = 25$, lo que da un radio de $5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-7-3",
      "enunciado": "Una pelota inflable posee un **diámetro** exterior de exactamente $20\\text{ cm}$. ¿Cuál es el **área de su superficie** externa expresada en términos del parámetro $\\pi$?",
      "alternativas": {
        "A": "$400\\pi\\text{ cm}^2$",
        "B": "$1.600\\pi\\text{ cm}^2$",
        "C": "$100\\pi\\text{ cm}^2$",
        "D": "$200\\pi\\text{ cm}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Mucho cuidado: el enunciado indica que el **diámetro** es de $20\\text{ cm}$, por lo tanto, el radio de la esfera es la mitad:\n $r = \\frac{20}{2} = 10\\text{ cm}$.\nAhora aplicamos la fórmula del área de superficie:\n $A = 4\\pi r^2 = 4\\pi (10)^2 = 4\\pi \\cdot 100 = 400\\pi\\text{ cm}^2$.",
      "feedback_error": "Incorrecto. Recuerda que el radio es la mitad del diámetro ($r = 10\\text{ cm}$). Aplicando la fórmula del área: $A = 4\\pi (10)^2 = 400\\pi\\text{ cm}^2$."
    },
    {
      "id": "q-m2-3-7-4",
      "enunciado": "Si el radio de una esfera se duplica de manera exacta ($r \\to 2r$), ¿por qué factor se multiplica su **volumen** original?",
      "alternativas": {
        "A": "$8$ veces",
        "B": "$4$ veces",
        "C": "$2$ veces",
        "D": "$16$ veces"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El volumen de una esfera es proporcional al cubo de su radio ($V \\propto r^3$).\nSi el radio se duplica, el nuevo volumen es:\n $V_{nuevo} = \\frac{4}{3}\\pi (2r)^3 = \\frac{4}{3}\\pi \\cdot 8r^3 = 8 \\cdot \\left(\\frac{4}{3}\\pi r^3\\right) = 8 \\cdot V_{orig}$.\nPor lo tanto, el volumen se multiplica por un factor de $8$.",
      "feedback_error": "Incorrecto. Dado que el volumen depende del cubo del radio, si este se duplica, el volumen se multiplica por un factor de $2^3 = 8$."
    },
    {
      "id": "q-m2-3-7-5",
      "enunciado": "Se funden tres esferas de plomo cuyos radios son de $3\\text{ cm}$, $4\\text{ cm}$ y $r\\text{ cm}$ para fabricar una única esfera grande de radio $6\\text{ cm}$. Asumiendo que no hay ninguna pérdida de material durante la fundición, ¿cuál es el valor exacto del radio $r$?",
      "alternativas": {
        "A": "$5\\text{ cm}$",
        "B": "$4,5\\text{ cm}$",
        "C": "$2\\text{ cm}$",
        "D": "$3,5\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La suma de los volúmenes de las tres esferas pequeñas debe ser exactamente igual al volumen de la esfera grande resultante:\n $V_1 + V_2 + V_3 = V_{total} \\implies \\frac{4}{3}\\pi(3)^3 + \\frac{4}{3}\\pi(4)^3 + \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi(6)^3$.\nDividimos todos los términos por la constante común $\\frac{4}{3}\\pi$:\n $3^3 + 4^3 + r^3 = 6^3 \\implies 27 + 64 + r^3 = 216$.\n Sumamos y despejamos:\n $91 + r^3 = 216 \\implies r^3 = 216 - 91 \\implies r^3 = 125 \\implies r = \\sqrt[3]{125} = 5\\text{ cm}$.",
      "feedback_error": "Incorrecto. Planteamos la conservación de volumen simplificando la constante $\\frac{4}{3}\\pi$, lo que da $3^3 + 4^3 + r^3 = 6^3 \\implies 91 + r^3 = 216 \\implies r^3 = 125$, de donde $r = 5\\text{ cm}$."
    },
    {
      "id": "q-m2-3-7-6",
      "enunciado": "Una esfera de metal posee un volumen de exactamente $288\\pi\\text{ cm}^3$. ¿Cuál es el **área de la superficie** externa de esta esfera en términos del parámetro $\\pi$?",
      "alternativas": {
        "A": "$144\\pi\\text{ cm}^2$",
        "B": "$36\\pi\\text{ cm}^2$",
        "C": "$72\\pi\\text{ cm}^2$",
        "D": "$100\\pi\\text{ cm}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero hallamos el radio $r$ de la esfera a partir de su volumen:\n $V = \\frac{4}{3}\\pi r^3 \\implies 288\\pi = \\frac{4}{3}\\pi r^3$.\nDividimos por $\\pi$ y multiplicamos por $\\frac{3}{4}$:\n $r^3 = 288 \\cdot \\frac{3}{4} = 72 \\cdot 3 = 216 \\implies r = \\sqrt[3]{216} = 6\\text{ cm}$.\nAhora calculamos el área de superficie con el radio hallado:\n $A = 4\\pi r^2 = 4\\pi (6)^2 = 4\\pi \\cdot 36 = 144\\pi\\text{ cm}^2$.",
      "feedback_error": "Incorrecto. Primero calculamos el radio igualando el volumen: $288 = \\frac{4}{3}r^3 \\implies r^3 = 216 \\implies r = 6\\text{ cm}$. Luego, calculamos el área de superficie: $A = 4\\pi (6)^2 = 144\\pi\\text{ cm}^2$."
    },
    {
      "id": "q-m2-3-7-7",
      "enunciado": "Si el radio de una esfera se reduce a la mitad de su tamaño original ($r \\to \\frac{1}{2} r$), ¿por qué factor disminuye el **área de su superficie**?",
      "alternativas": {
        "A": "Disminuye a la cuarta parte ($1/4$).",
        "B": "Disminuye a la mitad ($1/2$).",
        "C": "Disminuye a la octava parte ($1/8$).",
        "D": "Disminuye a la decimosexta parte ($1/16$)."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! El área de superficie de una esfera es directamente proporcional al cuadrado de su radio ($A \\propto r^2$).\nSi el radio se reduce a la mitad, la nueva área de superficie es:\n $A_{nueva} = 4\\pi \\left(\\frac{1}{2} r\right)^2 = 4\\pi \\cdot \\frac{1}{4} r^2 = \\frac{1}{4} \\cdot (4\\pi r^2) = \\frac{1}{4} A_{orig}$.\nPor lo tanto, el área disminuye a la cuarta parte.",
      "feedback_error": "Incorrecto. Al depender el área de superficie del cuadrado de la dimensión del radio, si el radio se reduce a la mitad ($1/2$), el área disminuye por un factor de $(1/2)^2 = 1/4$."
    },
    {
      "id": "q-m2-3-7-8",
      "enunciado": "Un estanque cilíndrico de agua posee el mismo radio $r$ y una altura $h$ igual al diámetro de una esfera de agua. ¿Cuál es la razón exacta entre el volumen de la esfera y el volumen del cilindro?",
      "alternativas": {
        "A": "$\\frac{2}{3}$",
        "B": "$\\frac{4}{3}$",
        "C": "$\\frac{1}{2}$",
        "D": "$\\frac{3}{4}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Escribimos los volúmenes de ambos cuerpos geométricos:\n - Esfera: $V_{esfera} = \\frac{4}{3}\\pi r^3$.\n - Cilindro: como su altura es igual al diámetro ($h = 2r$), su volumen es:\n $V_{cilindro} = \\pi r^2 h = \\pi r^2 (2r) = 2\\pi r^3$.\nCalculamos la razón entre el volumen de la esfera y el del cilindro:\n $\\frac{V_{esfera}}{V_{cilindro}} = \\frac{\\frac{4}{3}\\pi r^3}{2\\pi r^3} = \\frac{\\frac{4}{3}}{2} = \\frac{4}{6} = \\frac{2}{3}$.",
      "feedback_error": "Incorrecto. El volumen de la esfera es $\\frac{4}{3}\\pi r^3$ y el del cilindro con $h = 2r$ es $2\\pi r^3$. Dividiendo ambos volúmenes obtenemos la proporción $\\frac{4/3}{2} = 2/3$."
    },
    {
      "id": "q-m2-3-7-9",
      "enunciado": "¿Cuál es el volumen exacto de una esfera inscrita perfectamente dentro de un cubo de lado $6\\text{ cm}$?",
      "alternativas": {
        "A": "$36\\pi\\text{ cm}^3$",
        "B": "$288\\pi\\text{ cm}^3$",
        "C": "$72\\pi\\text{ cm}^3$",
        "D": "$18\\pi\\text{ cm}^3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Cuando una esfera está inscrita en un cubo, el diámetro de la esfera es igual al lado del cubo:\n $2r = L \\implies 2r = 6\\text{ cm} \\implies r = 3\\text{ cm}$.\nCalculamos su volumen:\n $V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (3)^3 = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$.",
      "feedback_error": "Incorrecto. En una esfera inscrita en un cubo de lado 6, el radio de la esfera mide exactamente la mitad del lado ($3\\text{ cm}$). Su volumen es $V = \\frac{4}{3}\\pi (3)^3 = 36\\pi\\text{ cm}^3$."
    },
    {
      "id": "q-m2-3-7-10",
      "enunciado": "El área de un círculo máximo de una esfera es de exactamente $16\\pi\\text{ cm}^2$. ¿Cuál es el **volumen** de dicha esfera?",
      "alternativas": {
        "A": "$\\frac{256\\pi}{3}\\text{ cm}^3$",
        "B": "$64\\pi\\text{ cm}^3$",
        "C": "$\\frac{64\\pi}{3}\\text{ cm}^3$",
        "D": "$256\\pi\\text{ cm}^3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El círculo máximo de una esfera tiene el mismo radio $r$ que la esfera. Planteamos su área:\n $A_{circ} = \\pi r^2 \\implies 16\\pi = \\pi r^2 \\implies r^2 = 16 \\implies r = 4\\text{ cm}$.\nCalculamos el volumen de la esfera con $r = 4$:\n $V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (4)^3 = \\frac{4}{3}\\pi \\cdot 64 = \\frac{256\\pi}{3}\\text{ cm}^3$.",
      "feedback_error": "Incorrecto. El radio de la esfera se obtiene del círculo máximo: $r = 4\\text{ cm}$. Luego, aplicando la fórmula del volumen de la esfera resulta $V = \\frac{4}{3}\\pi (4)^3 = \\frac{256\\pi}{3}\\text{ cm}^3$."
    }
  ],
  "sec-m2-3-8": [
    {
      "id": "q-m2-3-8-1",
      "enunciado": "Dadas las rectas de ecuaciones en el plano cartesiano:\n $L_1: y = 3x - 4$\n $L_2: y = kx + 7$\n¿Para qué valor de la constante real $k$ las rectas $L_1$ y $L_2$ son **paralelas**?",
      "alternativas": {
        "A": "$3$",
        "B": "$-\\frac{1}{3}$",
        "C": "$-3$",
        "D": "$\\frac{1}{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Dos rectas no verticales son paralelas si y solo si poseen la misma pendiente ($m_1 = m_2$). Identificamos las pendientes:\n - Pendiente de $L_1$: $m_1 = 3$.\n - Pendiente de $L_2$: $m_2 = k$.\nIgualamos las pendientes:\n $k = 3$. Como los coeficientes de posición son distintos ($-4 \\neq 7$), las rectas son paralelas no coincidentes.",
      "feedback_error": "Incorrecto. Recuerda que para que dos rectas sean paralelas en el plano cartesiano, sus pendientes deben ser exactamente iguales: $m_1 = m_2 \\implies k = 3$."
    },
    {
      "id": "q-m2-3-8-2",
      "enunciado": "Se tienen las rectas $L_1: 2x - 3y = 6$ y $L_2: 3x + ky = 9$. ¿Qué valor numérico debe tomar el parámetro real $k$ para que ambas rectas sean **perpendiculares**?",
      "alternativas": {
        "A": "$2$",
        "B": "$-2$",
        "C": "$4,5$",
        "D": "$-4,5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Despejamos el formato principal de la recta ($y = mx + n$) para identificar las pendientes:\n - Para $L_1$: $2x - 3y = 6 \\implies 3y = 2x - 6 \\implies y = \\frac{2}{3}x - 2 \\implies m_1 = \\frac{2}{3}$.\n - Para $L_2$: $3x + ky = 9 \\implies ky = -3x + 9 \\implies y = -\\frac{3}{k}x + \\frac{9}{k} \\implies m_2 = -\\frac{3}{k}$.\nDos rectas son perpendiculares si el producto de sus pendientes es igual a $-1$:\n $m_1 \\cdot m_2 = -1 \\implies \\frac{2}{3} \\cdot \\left(-\\frac{3}{k}\\right) = -1 \\implies -\\frac{6}{3k} = -1 \\implies -\\frac{2}{k} = -1 \\implies k = 2$.",
      "feedback_error": "Incorrecto. Despejando las pendientes obtenemos $m_1 = 2/3$ y $m_2 = -3/k$. Para que sean perpendiculares, su producto debe ser $-1$: $\\frac{2}{3} \\cdot \\left(-\\frac{3}{k}\\right) = -1 \\implies -2/k = -1 \\implies k = 2$."
    },
    {
      "id": "q-m2-3-8-3",
      "enunciado": "¿Cuál es la pendiente exacta de la recta que pasa a través de los puntos coordenados $A(2, 5)$ y $B(6, -3)$ en el plano cartesiano?",
      "alternativas": {
        "A": "$-2$",
        "B": "$-\\frac{1}{2}$",
        "C": "$2$",
        "D": "$\\frac{1}{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La fórmula de la pendiente de una recta que pasa por dos puntos $(x_1, y_1)$ y $(x_2, y_2)$ es:\n $m = \\frac{y_2 - y_1}{x_2 - x_1}$.\nReemplazamos con los datos del enunciado:\n $m = \\frac{-3 - 5}{6 - 2} = \\frac{-8}{4} = -2$.",
      "feedback_error": "Incorrecto. La pendiente se calcula mediante $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Sustituyendo los puntos obtenemos: $\\frac{-3 - 5}{6 - 2} = \\frac{-8}{4} = -2$."
    },
    {
      "id": "q-m2-3-8-4",
      "enunciado": "Una recta $L_1$ está definida por su ecuación general $4x + 2y - 8 = 0$. ¿Cuál de las siguientes rectas en el plano es **paralela** a $L_1$ y pasa exactamente por el origen de coordenadas $(0,0)$?",
      "alternativas": {
        "A": "$y = -2x$",
        "B": "$y = 2x$",
        "C": "$y = -0,5x$",
        "D": "$y = 0,5x$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Primero obtenemos la ecuación principal de $L_1$ despejando $y$:\n $2y = -4x + 8 \\implies y = -2x + 4$.\nLa pendiente de la recta $L_1$ es $m = -2$.\nCualquier recta paralela debe poseer la misma pendiente ($m_{par} = -2$).\nAdemás, si pasa por el origen $(0,0)$, su coeficiente de posición debe ser $n = 0$.\nPor lo tanto, la ecuación principal es $y = -2x$.",
      "feedback_error": "Incorrecto. Despejando $L_1$ queda $y = -2x + 4$, con pendiente $-2$. Una paralela por el origen debe poseer la misma pendiente y coeficiente de posición nulo, resultando en $y = -2x$."
    },
    {
      "id": "q-m2-3-8-5",
      "enunciado": "Dos rectas en el plano cartesiano $L_1$ y $L_2$ están representadas por las ecuaciones $y = -0,5x + 3$ y $y = 2x - 2$ respectivamente. ¿Cuáles son las coordenadas del **punto de intersección** entre ambas?",
      "alternativas": {
        "A": "$(2, 2)$",
        "B": "$(2, 1)$",
        "C": "$(1, 2)$",
        "D": "$(0, 3)$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para hallar el punto de intersección, resolvemos el sistema igualando ambas expresiones de $y$:\n $-0,5x + 3 = 2x - 2$.\nSumamos $0,5x$ y $2$ a ambos lados:\n $3 + 2 = 2x + 0,5x \\implies 5 = 2,5x \\implies x = \\frac{5}{2,5} = 2$.\nSustituimos $x = 2$ en cualquiera de las ecuaciones originales para obtener $y$:\n $y = 2(2) - 2 = 4 - 2 = 2$.\nPor lo tanto, el punto único de intersección es $(2, 2)$.",
      "feedback_error": "Incorrecto. Resolvemos el sistema igualando las ecuaciones: $-0,5x + 3 = 2x - 2 \\implies 5 = 2,5x \\implies x = 2$. Evaluando este valor resulta $y = 2$. El punto de intersección es $(2, 2)$."
    },
    {
      "id": "q-m2-3-8-6",
      "enunciado": "Si la recta $L_1: ax + 3y = 8$ es perpendicular a la recta $L_2: 2x - 4y = 5$. ¿Cuál es el valor del parámetro real $a$?",
      "alternativas": {
        "A": "$6$",
        "B": "$-6$",
        "C": "$1,5$",
        "D": "$-1,5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Despejamos para hallar las pendientes de ambas rectas:\n - Para $L_1$: $3y = -ax + 8 \\implies y = -\\frac{a}{3}x + \\frac{8}{3} \\implies m_1 = -\\frac{a}{3}$.\n - Para $L_2$: $-4y = -2x + 5 \\implies y = \\frac{1}{2}x - \\frac{5}{4} \\implies m_2 = \\frac{1}{2}$.\nDado que son perpendiculares, multiplicamos sus pendientes e igualamos a $-1$:\n $m_1 \\cdot m_2 = -1 \\implies \\left(-\\frac{a}{3}\\right) \\cdot \\frac{1}{2} = -1 \\implies -\\frac{a}{6} = -1 \\implies a = 6$.",
      "feedback_error": "Incorrecto. De las rectas obtenemos $m_1 = -a/3$ y $m_2 = 1/2$. Como son perpendiculares, planteamos $(-a/3) \\cdot (1/2) = -1 \\implies -a/6 = -1 \\implies a = 6$."
    },
    {
      "id": "q-m2-3-8-7",
      "enunciado": "¿Cuál es la ecuación general de la recta que posee pendiente $m = -2$ y corta al eje de las ordenadas en el punto $(0, 5)$?",
      "alternativas": {
        "A": "$2x + y - 5 = 0$",
        "B": "$2x - y + 5 = 0$",
        "C": "$x + 2y - 10 = 0$",
        "D": "$2x + y + 5 = 0$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! A partir de la pendiente $m = -2$ y el punto de corte con el eje Y $(0, 5)$, el coeficiente de posición es $n = 5$.\nEscribimos la ecuación principal:\n $y = mx + n \\implies y = -2x + 5$.\nPara transformarla a su forma general ($Ax + By + C = 0$), trasladamos todos los términos al miembro izquierdo:\n $2x + y - 5 = 0$.",
      "feedback_error": "Incorrecto. La ecuación en forma principal es $y = -2x + 5$. Transponiendo todos los términos a un lado para la forma general obtenemos $2x + y - 5 = 0$."
    },
    {
      "id": "q-m2-3-8-8",
      "enunciado": "Las ecuaciones asociadas a dos rectas en el plano cartesiano son:\n $L_1: y = 2x - 3$\n $L_2: 4x - 2y = 6$\n¿Cuál es la relación de posición relativa exacta entre ambas rectas?",
      "alternativas": {
        "A": "Las rectas son coincidentes (son la misma recta).",
        "B": "Las rectas son paralelas no coincidentes.",
        "C": "Las rectas son secantes perpendiculares.",
        "D": "Las rectas son secantes no perpendiculares."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Escribimos ambas ecuaciones en formato principal para compararlas:\n - Para $L_1$: $y = 2x - 3 \\implies m_1 = 2, n_1 = -3$.\n - Para $L_2$: $-2y = -4x + 6 \\implies y = 2x - 3 \\implies m_2 = 2, n_2 = -3$.\nDado que poseen idénticas pendientes ($m_1 = m_2 = 2$) e idénticos coeficientes de posición ($n_1 = n_2 = -3$), las rectas son exactamente coincidentes.",
      "feedback_error": "Incorrecto. Despejando $L_2$ nos queda $y = 2x - 3$, que es exactamente la misma ecuación que $L_1$. Por lo tanto, representan la misma recta (son coincidentes)."
    },
    {
      "id": "q-m2-3-8-9",
      "enunciado": "Una recta $L$ pasa a través del punto coordenado $P(3, 4)$ y es perfectamente **paralela al eje X** (horizontal). ¿Cuál es la ecuación de la recta $L$?",
      "alternativas": {
        "A": "$y = 4$",
        "B": "$x = 3$",
        "C": "$y = 3$",
        "D": "$x = 4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Cualquier recta paralela al eje X (horizontal) posee una pendiente nula ($m = 0$). Su ecuación tiene la forma constante:\n $y = c$, para algún valor constante real $c$.\nDado que la recta debe pasar por el punto $P(3, 4)$, la coordenada $y$ debe ser idénticamente 4 para todo valor de $x$.\nPor lo tanto, la ecuación de la recta es $y = 4$.",
      "feedback_error": "Incorrecto. Una recta paralela al eje X es horizontal y se define por su coordenada $y$ constante. Al pasar por $(3, 4)$, su ecuación es $y = 4$."
    },
    {
      "id": "q-m2-3-8-10",
      "enunciado": "¿Cuál es el valor exacto de la pendiente de cualquier recta que sea perpendicular a la recta de ecuación general $x - 3y + 9 = 0$?",
      "alternativas": {
        "A": "$-3$",
        "B": "$\\frac{1}{3}$",
        "C": "$3$",
        "D": "$-\\frac{1}{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero despejamos $y$ de la ecuación general dada para hallar su pendiente original $m_1$:\n $x - 3y + 9 = 0 \\implies 3y = x + 9 \\implies y = \\frac{1}{3}x + 3 \\implies m_1 = \\frac{1}{3}$.\nPor definición de perpendicularidad, el producto de las pendientes de ambas rectas debe ser $-1$:\n $m_1 \\cdot m_{perp} = -1 \\implies \\frac{1}{3} \\cdot m_{perp} = -1 \\implies m_{perp} = -3$.",
      "feedback_error": "Incorrecto. La pendiente de la recta dada es $m_1 = 1/3$. Como la recta buscada es perpendicular, su pendiente es el recíproco negativo: $m_{perp} = -\\frac{1}{m_1} = -3$."
    }
  ]
};

function run() {
  console.log('🚀 [EstudiaUni] Iniciando generación de preguntas locales M2 Geometría...');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontró capitulos-mock-local.json.');
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const capTarget = capitulos.find(c => c.id === 'cap-m2-3-geometria');

  if (!capTarget) {
    console.error('❌ Error: No se encontró "cap-m2-3-geometria" en el mock local.');
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
        id: `test-m2-3-${sec.id.split('-').pop()}`,
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

  console.log(`\n🎉 [EstudiaUni] ¡Generación de M2 Geometría completada con éxito!`);
  console.log(`   ➜ Total de preguntas inyectadas: ${totalQuestionsCount}`);
}

run();
