const fs = require('fs');
const path = require('path');

// Helper to shuffle alternatives and guarantee a perfectly balanced distribution of correct keys (A, B, C, D)
// with zero consecutive duplicates of more than 2, and overall frequencies of A, B, C, D as even as possible.
function distributeAndShuffle(questions) {
  const letters = ['A', 'B', 'C', 'D'];

  // Assign target correct answers evenly for the 10 questions in a section
  // targetCounts: A: 3, B: 3, C: 2, D: 2 (or similar, shuffled)
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
  "sec-m2-1-1": [
    {
      "id": "q-m2-1-1-1",
      "enunciado": "Si aproximamos el número de Euler $e \\approx 2,718281...$ a la milésima por redondeo, ¿cuál es el valor obtenido y el signo del error absoluto asociado a esta aproximación?",
      "alternativas": {
        "A": "$2,718$ y el error absoluto es siempre una cantidad positiva.",
        "B": "$2,719$ y el error absoluto es siempre una cantidad positiva.",
        "C": "$2,718$ y el error absoluto puede ser negativo.",
        "D": "$2,719$ y el error absoluto puede ser negativo."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Al redondear a la milésima, miramos la diezmilésima ($2$). Como $2 < 5$, aproximamos por defecto, obteniendo $2,718$. Además, el error absoluto se define como $|\\text{Valor Real} - \\text{Valor Aproximado}|$, por lo que siempre es un valor positivo por definición de valor absoluto.",
      "feedback_error": "Incorrecto. Recuerda que al redondear a la milésima miramos el dígito de la diezmilésima (que es $2$). Como es menor que $5$, se mantiene el $8$. El error absoluto es $|\\text{Real} - \\text{Aprox}|$, por ende, siempre es estrictamente mayor o igual a cero."
    },
    {
      "id": "q-m2-1-1-2",
      "enunciado": "¿Cuál es la aproximación por exceso a la centésima de la expresión irrealizable $\\pi^2$ si tomamos su valor real aproximado de $9,86960...$?",
      "alternativas": {
        "A": "$9,87$",
        "B": "$9,86$",
        "C": "$9,90$",
        "D": "$9,88$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! En la aproximación por exceso a la centésima, no importa el valor del dígito de la milésima; simplemente aumentamos el dígito de la centésima ($6$) en una unidad. Así, $9,869...$ aproximado por exceso a la centésima es $9,87$.",
      "feedback_error": "Incorrecto. Recuerda que al aproximar por exceso, aumentamos el dígito del orden solicitado en una unidad, sin importar el valor de la cifra siguiente. La centésima de $9,869...$ es $6$, por lo que sumamos 1 centésima, dando $9,87$."
    },
    {
      "id": "q-m2-1-1-3",
      "enunciado": "Sean $r$ un número racional distinto de cero e $i$ un número irracional. Con respecto a las operaciones en los números reales, ¿cuál de las siguientes afirmaciones es siempre verdadera?",
      "alternativas": {
        "A": "$r + i$ es siempre un número irracional.",
        "B": "$r \\cdot i$ puede ser un número racional.",
        "C": "$\\frac{i}{r}$ es siempre un número racional.",
        "D": "$i^2$ es siempre un número racional."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La suma de un número racional y un número irracional siempre da como resultado un número irracional ($r + i \\in \\mathbb{I}$). Si no fuera así, podríamos despejar $i$ como resta de racionales, lo cual contradice la irracionalidad de $i$.",
      "feedback_error": "Incorrecto. Analicemos: si $r \\neq 0$, $r \\cdot i$ es siempre irracional (por lo que B es falsa). El cuadrado de un irracional como $\\pi^2$ sigue siendo irracional (por lo que D es falsa). La suma de un racional y un irracional siempre es irracional."
    },
    {
      "id": "q-m2-1-1-4",
      "enunciado": "Si aproximamos la raíz de diez $\\sqrt{10} \\approx 3,1622...$ a la décima por defecto, ¿cuál es el valor exacto del error absoluto de esta aproximación en términos matemáticos?",
      "alternativas": {
        "A": "$\\sqrt{10} - 3,1$",
        "B": "$3,1 - \\sqrt{10}$",
        "C": "$3,2 - \\sqrt{10}$",
        "D": "$\\sqrt{10} - 3,2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Aproximar por defecto a la décima significa simplemente cortar el número, obteniendo $3,1$. Dado que $\\sqrt{10} > 3,1$, el error absoluto es $|\\sqrt{10} - 3,1| = \\sqrt{10} - 3,1$.",
      "feedback_error": "Incorrecto. Aproximar a la décima por defecto nos da $3,1$. Como $\\sqrt{10} \\approx 3,1622...$, vemos que $\\sqrt{10} > 3,1$. El error absoluto es $|\\text{Real} - \\text{Aprox}| = \\sqrt{10} - 3,1$."
    },
    {
      "id": "q-m2-1-1-5",
      "enunciado": "Al simplificar la expresión algebraica con raíces reales $\\sqrt{50} - \\sqrt{18} + \\sqrt{8}$, ¿cuál es el número irracional resultante?",
      "alternativas": {
        "A": "$4\\sqrt{2}$",
        "B": "$2\\sqrt{2}$",
        "C": "$3\\sqrt{2}$",
        "D": "$6\\sqrt{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Descomponemos cada raíz en factores primos con cuadrados perfectos:\n - $\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$\n - $\\sqrt{18} = \\sqrt{9 \\cdot 2} = 3\\sqrt{2}$\n - $\\sqrt{8} = \\sqrt{4 \\cdot 2} = 2\\sqrt{2}$\nSumamos y restamos sus coeficientes: $5\\sqrt{2} - 3\\sqrt{2} + 2\\sqrt{2} = 4\\sqrt{2}$.",
      "feedback_error": "Incorrecto. Recuerda descomponer los radicandos en multiplicaciones por cuadrados perfectos: $\\sqrt{50} = 5\\sqrt{2}$, $\\sqrt{18} = 3\\sqrt{2}$, y $\\sqrt{8} = 2\\sqrt{2}$. Operando esto obtenemos $5\\sqrt{2} - 3\\sqrt{2} + 2\\sqrt{2} = 4\\sqrt{2}$."
    },
    {
      "id": "q-m2-1-1-6",
      "enunciado": "¿Cuál de las siguientes afirmaciones con respecto a los números reales es FALSA?",
      "alternativas": {
        "A": "La suma de dos números irracionales es siempre otro número irracional.",
        "B": "El producto de dos números racionales es siempre un número racional.",
        "C": "No todos los números irracionales son números trascendentes.",
        "D": "El conjunto de los números reales es el conjunto de todos los números decimales."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La afirmación A es falsa porque, por ejemplo, si sumamos los irracionales $\\sqrt{2}$ y $-\\sqrt{2}$, el resultado es $0$, que es un número racional. Por ende, la suma de dos irracionales no siempre es irracional.",
      "feedback_error": "Incorrecto. La afirmación falsa es la A. Por ejemplo, si sumas $\\sqrt{3}$ y $-\\sqrt{3}$ (ambos irracionales), el resultado es $0$, que es racional. Las demás afirmaciones son verdaderas."
    },
    {
      "id": "q-m2-1-1-7",
      "enunciado": "Si ordenamos de menor a mayor los siguientes números reales: $a = 3\\sqrt{2}$, $b = 2\\sqrt{5}$ y $c = 4$, ¿cuál es el orden correcto?",
      "alternativas": {
        "A": "$c < a < b$",
        "B": "$a < c < b$",
        "C": "$c < b < a$",
        "D": "$b < a < c$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Una estrategia muy útil para comparar raíces es elevarlas al cuadrado:\n - $a^2 = (3\\sqrt{2})^2 = 9 \\cdot 2 = 18$\n - $b^2 = (2\\sqrt{5})^2 = 4 \\cdot 5 = 20$\n - $c^2 = 4^2 = 16$\nComo $16 < 18 < 20$, entonces $c < a < b$.",
      "feedback_error": "Incorrecto. Te sugerimos elevar todos los valores al cuadrado para compararlos fácilmente: $c^2 = 16$, $a^2 = 18$, y $b^2 = 20$. Dado que $16 < 18 < 20$, el orden correcto es $c < a < b$."
    },
    {
      "id": "q-m2-1-1-8",
      "enunciado": "Al desarrollar el binomio irracional $(2 - \\sqrt{3})^2$, ¿qué valor real exacto se obtiene?",
      "alternativas": {
        "A": "$7 - 4\\sqrt{3}$",
        "B": "$7 - 2\\sqrt{3}$",
        "C": "$1 - 4\\sqrt{3}$",
        "D": "$7 + 4\\sqrt{3}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Aplicamos el producto notable del cuadrado de binomio: $(a - b)^2 = a^2 - 2ab + b^2$:\n $(2 - \\sqrt{3})^2 = 2^2 - 2 \\cdot 2 \\cdot \\sqrt{3} + (\\sqrt{3})^2 = 4 - 4\\sqrt{3} + 3 = 7 - 4\\sqrt{3}$.",
      "feedback_error": "Incorrecto. Recuerda aplicar el cuadrado del binomio: $(a-b)^2 = a^2 - 2ab + b^2$. Así, $(2-\\sqrt{3})^2 = 4 - 4\\sqrt{3} + 3 = 7 - 4\\sqrt{3}$."
    },
    {
      "id": "q-m2-1-1-9",
      "enunciado": "Si aproximamos la fracción de número racional $\\frac{13}{7}$ a la centésima por exceso, ¿cuál es el error absoluto de esta aproximación?",
      "alternativas": {
        "A": "$1,86 - \\frac{13}{7}$",
        "B": "$\\frac{13}{7} - 1,85$",
        "C": "$1,85 - \\frac{13}{7}$",
        "D": "$\\frac{13}{7} - 1,86$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! El desarrollo decimal de $\\frac{13}{7}$ es $1,857142...$ centésima es $5$. Aproximar por exceso a la centésima da $1,86$. Como la aproximación por exceso es mayor que el valor real, el error absoluto es $|\\text{Real} - \\text{Aprox}| = 1,86 - \\frac{13}{7}$.",
      "feedback_error": "Incorrecto. Calculamos $\\frac{13}{7} \\approx 1,8571...$. A la centésima por exceso es $1,86$. Al ser mayor la aproximación que la fracción original, el error absoluto es $1,86 - \\frac{13}{7}$."
    },
    {
      "id": "q-m2-1-1-10",
      "enunciado": "Al racionalizar la expresión $\\frac{10}{\\sqrt{7} - \\sqrt{2}}$, ¿cuál es el resultado simplificado?",
      "alternativas": {
        "A": "$2(\\sqrt{7} + \\sqrt{2})$",
        "B": "$2(\\sqrt{7} - \\sqrt{2})$",
        "C": "$5(\\sqrt{7} + \\sqrt{2})$",
        "D": "$10(\\sqrt{7} + \\sqrt{2})$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Multiplicamos numerador y denominador por el conjugado del denominador, que es $(\\sqrt{7} + \\sqrt{2})$:\n $\\frac{10(\\sqrt{7} + \\sqrt{2})}{(\\sqrt{7} - \\sqrt{2})(\\sqrt{7} + \\sqrt{2})} = \\frac{10(\\sqrt{7} + \\sqrt{2})}{7 - 2} = \\frac{10(\\sqrt{7} + \\sqrt{2})}{5} = 2(\\sqrt{7} + \\sqrt{2})$.",
      "feedback_error": "Incorrecto. Multiplica numerador y denominador por el binomio conjugado $(\\sqrt{7} + \\sqrt{2})$. El denominador se transforma en $7 - 2 = 5$. Dividiendo $10$ en $5$ obtenemos $2(\\sqrt{7} + \\sqrt{2})$."
    }
  ],
  "sec-m2-1-2": [
    {
      "id": "q-m2-1-2-1",
      "enunciado": "El tiempo de caída de un objeto en segundos está dado por la fórmula $t = \\sqrt{\\frac{2h}{g}}$. Si un objeto cae desde un edificio de altura $h = 49\\text{ m}$ y la gravedad es $g = 9,8\\text{ m/s}^2$, ¿cuánto tiempo tarda exactamente en tocar el suelo, y a qué conjunto numérico pertenece?",
      "alternativas": {
        "A": "$\\sqrt{10}$ segundos; pertenece a los irracionales ($\\mathbb{I}$).",
        "B": "$10$ segundos; pertenece a los racionales ($\\mathbb{Q}$).",
        "C": "$\\sqrt{5}$ segundos; pertenece a los irracionales ($\\mathbb{I}$).",
        "D": "$3,16$ segundos; pertenece a los racionales ($\\mathbb{Q}$)."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Reemplazamos los valores:\n $t = \\sqrt{\\frac{2 \\cdot 49}{9,8}} = \\sqrt{\\frac{98}{9,8}} = \\sqrt{10}$ segundos. Dado que $10$ no es un cuadrado perfecto, $\\sqrt{10}$ es un número irracional.",
      "feedback_error": "Incorrecto. Sustituyendo los datos: $t = \\sqrt{\\frac{98}{9,8}} = \\sqrt{10}$. Como $\\sqrt{10}$ no se puede expresar como fracción exacta, es un número irracional."
    },
    {
      "id": "q-m2-1-2-2",
      "enunciado": "La diagonal de una plaza de juegos rectangular mide metros. Si el ancho de la plaza mide $\\sqrt{12}\\text{ m}$ y el largo mide $\\sqrt{13}\\text{ m}$, ¿cuál es el valor exacto de la diagonal de la plaza de juegos?",
      "alternativas": {
        "A": "$5\\text{ m}$",
        "B": "$\\sqrt{5}\\text{ m}$",
        "C": "$25\\text{ m}$",
        "D": "$\\sqrt{156}\\text{ m}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por el Teorema de Pitágoras, la diagonal $d$ cumple $d^2 = a^2 + l^2$. Reemplazando:\n $d^2 = (\\sqrt{12})^2 + (\\sqrt{13})^2 = 12 + 13 = 25$.\nPor lo tanto, $d = \\sqrt{25} = 5$ metros.",
      "feedback_error": "Incorrecto. Usa el teorema de Pitágoras: $d^2 = (\\sqrt{12})^2 + (\\sqrt{13})^2 = 12 + 13 = 25$. La raíz de $25$ nos da la diagonal exacta de $5\\text{ m}$."
    },
    {
      "id": "q-m2-1-2-3",
      "enunciado": "Se desea diseñar un cable conductor eléctrico cilíndrico cuya área transversal sea exactamente $\\sqrt{7} \\pi \\text{ mm}^2$. Si aproximamos el valor de $\\sqrt{7} \\approx 2,6457...$ a la centésima por redondeo, ¿qué valor decimal aproximado de área en $\\text{mm}^2$ se obtiene si usamos $\\pi \\approx 3,14$?",
      "alternativas": {
        "A": "$8,321\\text{ mm}^2$",
        "B": "$8,305\\text{ mm}^2$",
        "C": "$8,290\\text{ mm}^2$",
        "D": "$8,352\\text{ mm}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Primero redondeamos $\\sqrt{7}$ a la centésima: el dígito de la milésima es $5$, por lo que aproximamos por exceso, resultando $2,65$. Luego, multiplicamos por $\\pi \\approx 3,14$:\n $2,65 \\cdot 3,14 = 8,321\\text{ mm}^2$.",
      "feedback_error": "Incorrecto. Primero redondea $\\sqrt{7} \\approx 2,6457...$ a la centésima, lo que da $2,65$. Luego multiplica $2,65 \\cdot 3,14$, obteniendo $8,321\\text{ mm}^2$."
    },
    {
      "id": "q-m2-1-2-4",
      "enunciado": "Un tren bala viaja con una velocidad constante de $20\\sqrt{3}\\text{ m/s}$ por una vía rectilínea. ¿Qué distancia total habrá recorrido al cabo de un tiempo de $5\\sqrt{12}\\text{ segundos}$?",
      "alternativas": {
        "A": "$600\\text{ metros}$",
        "B": "$300\\text{ metros}$",
        "C": "$200\\sqrt{3}\\text{ metros}$",
        "D": "$100\\sqrt{36}\\text{ metros}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La distancia es el producto de velocidad por tiempo:\n $d = (20\\sqrt{3}) \\cdot (5\\sqrt{12}) = 100\\sqrt{36} = 100 \\cdot 6 = 600$ metros.",
      "feedback_error": "Incorrecto. Aplica $d = v \\cdot t$. Multiplicando los coeficientes y las raíces: $20 \\cdot 5 = 100$ y $\\sqrt{3} \\cdot \\sqrt{12} = \\sqrt{36} = 6$. Esto da $100 \\cdot 6 = 600$ metros."
    },
    {
      "id": "q-m2-1-2-5",
      "enunciado": "Dos muestras químicas tienen volúmenes en litros medidos como $V_1 = 3 + \\sqrt{2}$ y $V_2 = 5 - 2\\sqrt{2}$. Si se vierten juntas en un contenedor, ¿cuál es el volumen total de la mezcla?",
      "alternativas": {
        "A": "$8 - \\sqrt{2}$ litros",
        "B": "$8 - 3\\sqrt{2}$ litros",
        "C": "$8 + \\sqrt{2}$ litros",
        "D": "$8\\sqrt{2}$ litros"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Sumamos ambos volúmenes juntando términos racionales con racionales, e irracionales con irracionales:\n $V_t = (3 + \\sqrt{2}) + (5 - 2\\sqrt{2}) = (3 + 5) + (\\sqrt{2} - 2\\sqrt{2}) = 8 - \\sqrt{2}$ litros.",
      "feedback_error": "Incorrecto. Debes sumar las partes semejantes: $3 + 5 = 8$ y $\\sqrt{2} - 2\\sqrt{2} = -\\sqrt{2}$, lo que resulta en $8 - \\sqrt{2}$ litros."
    },
    {
      "id": "q-m2-1-2-6",
      "enunciado": "Para techar una sala de estar de forma cuadrada, se necesita conocer su área. Si la medida del lado de la sala es $\\sqrt{7} + \\sqrt{3}$ metros, ¿cuál es la superficie exacta del techo?",
      "alternativas": {
        "A": "$10 + 2\\sqrt{21}\\text{ m}^2$",
        "B": "$10\\text{ m}^2$",
        "C": "$10 + \\sqrt{21}\\text{ m}^2$",
        "D": "$58\\text{ m}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! El área de un cuadrado de lado $L$ es $L^2$. Calculamos:\n $(\\sqrt{7} + \\sqrt{3})^2 = (\\sqrt{7})^2 + 2\\sqrt{7}\\sqrt{3} + (\\sqrt{3})^2 = 7 + 2\\sqrt{21} + 3 = 10 + 2\\sqrt{21}\\text{ m}^2$.",
      "feedback_error": "Incorrecto. El área es el cuadrado del lado: $(\\sqrt{7} + \\sqrt{3})^2$. Desarrollando el cuadrado de binomio obtenemos $7 + 2\\sqrt{21} + 3 = 10 + 2\\sqrt{21}\\text{ m}^2$."
    },
    {
      "id": "q-m2-1-2-7",
      "enunciado": "La concentración de un compuesto medicinal después de $t$ horas está modelada por $C(t) = \\sqrt{125} - t\\sqrt{5}$ gramos por litro. ¿Al cabo de cuántas horas la concentración del compuesto será exactamente cero?",
      "alternativas": {
        "A": "$5$ horas",
        "B": "$25$ horas",
        "C": "$\\sqrt{5}$ horas",
        "D": "$10$ horas"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Igualamos la ecuación a cero: $\\sqrt{125} - t\\sqrt{5} = 0 \\implies t\\sqrt{5} = \\sqrt{125}$.\nComo $\\sqrt{125} = \\sqrt{25 \\cdot 5} = 5\\sqrt{5}$, entonces:\n $t\\sqrt{5} = 5\\sqrt{5} \\implies t = 5$ horas.",
      "feedback_error": "Incorrecto. Igualando a cero: $t\\sqrt{5} = \\sqrt{125}$. Dado que $\\sqrt{125} = 5\\sqrt{5}$, dividiendo por $\\sqrt{5}$ nos da $t = 5$ horas."
    },
    {
      "id": "q-m2-1-2-8",
      "enunciado": "Dos resistencias eléctricas conectadas en paralelo tienen una resistencia equivalente dada por la fórmula $R_{eq} = \\frac{R_1 \\cdot R_2}{R_1 + R_2}$. Si $R_1 = 4$ ohms y $R_2 = \\sqrt{2}$ ohms, ¿cuál es el valor racionalizado de $R_{eq}$?",
      "alternativas": {
        "A": "$\\frac{8\\sqrt{2} - 4}{7}$ ohms",
        "B": "$\\frac{8\\sqrt{2} - 2}{7}$ ohms",
        "C": "$\\frac{8\\sqrt{2} - 4}{14}$ ohms",
        "D": "$2\\sqrt{2} - 4$ ohms"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos:\n $R_{eq} = \\frac{4\\sqrt{2}}{4 + \\sqrt{2}}$\nMultiplicamos por el conjugado $(4 - \\sqrt{2})$:\n $\\frac{4\\sqrt{2}(4 - \\sqrt{2})}{(4 + \\sqrt{2})(4 - \\sqrt{2})} = \\frac{16\\sqrt{2} - 4 \\cdot 2}{16 - 2} = \\frac{16\\sqrt{2} - 8}{14} = \\frac{8\\sqrt{2} - 4}{7}$ ohms.",
      "feedback_error": "Incorrecto. Sustituye y multiplica por el conjugado del denominador $(4-\\sqrt{2})$. La expresión se reduce a $\\frac{16\\sqrt{2}-8}{14}$, que simplificada por 2 da $\\frac{8\\sqrt{2}-4}{7}$ ohms."
    },
    {
      "id": "q-m2-1-2-9",
      "enunciado": "El período de un péndulo está modelado por $T = 2\\pi \\sqrt{\\frac{L}{g}}$. Si un péndulo tiene largo $L = 5\\text{ m}$, aceleración de gravedad $g = 10\\text{ m/s}^2$ y tomamos $\\pi \\approx 3,14$, ¿cuál es el período aproximado a la décima por exceso?",
      "alternativas": {
        "A": "$4,5\\text{ segundos}$",
        "B": "$4,4\\text{ segundos}$",
        "C": "$4,44\\text{ segundos}$",
        "D": "$4,6\\text{ segundos}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Reemplazamos los valores:\n $T = 2 \\cdot 3,14 \\cdot \\sqrt{\\frac{5}{10}} = 6,28 \\cdot \\sqrt{0,5}$.\nComo $\\sqrt{0,5} \\approx 0,7071$, multiplicamos:\n $T \\approx 6,28 \\cdot 0,7071 \\approx 4,4405$ segundos. Al aproximar a la décima por exceso, el $4$ aumenta a $5$, resultando $4,5$ segundos.",
      "feedback_error": "Incorrecto. Calculamos el valor: $T = 6,28 \\cdot \\sqrt{0,5} \\approx 4,4405$ segundos. Al aproximar por exceso a la décima, incrementamos la cifra décima en 1, lo que resulta en $4,5$ segundos."
    },
    {
      "id": "q-m2-1-2-10",
      "enunciado": "Un terreno triangular equilátero tiene un lado de medida $\\sqrt{6}$ metros. ¿Cuál es el valor exacto de la altura del terreno?",
      "alternativas": {
        "A": "$\\frac{3\\sqrt{2}}{2}$ metros",
        "B": "$\\frac{\\sqrt{18}}{2}$ metros",
        "C": "$3\\sqrt{2}$ metros",
        "D": "$\\frac{\\sqrt{6}}{2}$ metros"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La fórmula para la altura de un triángulo equilátero de lado $a$ es $h = \\frac{a\\sqrt{3}}{2}$. Reemplazando $a = \\sqrt{6}$:\n $h = \\frac{\\sqrt{6}\\sqrt{3}}{2} = \\frac{\\sqrt{18}}{2} = \\frac{3\\sqrt{2}}{2}$ metros.",
      "feedback_error": "Incorrecto. Recuerda que la altura en un triángulo equilátero es $h = \\frac{\\text{lado} \\cdot \\sqrt{3}}{2}$. Así, $h = \\frac{\\sqrt{6} \\cdot \\sqrt{3}}{2} = \\frac{\\sqrt{18}}{2} = \\frac{3\\sqrt{2}}{2}$ metros."
    }
  ],
  "sec-m2-1-3": [
    {
      "id": "q-m2-1-3-1",
      "enunciado": "Un trabajador en Chile percibe un sueldo imponible mensual de $\$1.200.000$. Si cotiza en una AFP que cobra una comisión del $1,15\\%$ sobre la renta imponible, ¿cuánto dinero total le descuentan mensualmente por concepto de previsión (cotización obligatoria más comisión)?",
      "alternativas": {
        "A": "$\$133.800$",
        "B": "$\$120.000$",
        "C": "$\$13.800$",
        "D": "$\$135.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! El porcentaje total previsional descontado es el $10\\%$ obligatorio más el $1,15\\%$ de comisión, es decir, el $11,15\\%$ de su remuneración imponible:\n $\\text{Descuento total} = \\$1.200.000 \\cdot 0,1115 = \\$133.800$.",
      "feedback_error": "Incorrecto. Se debe calcular el $10\\%$ obligatorio ($\\$120.000$) y el $1,15\\%$ de comisión ($\\$13.800$) sobre los $\$1.200.000$. Sumando ambos montos nos da $\$133.800$."
    },
    {
      "id": "q-m2-1-3-2",
      "enunciado": "Una trabajadora tiene un sueldo bruto imponible de $\$3.500.000$. Si el tope imponible para pensiones de ese año está fijado en $\$3.200.000$, ¿cuál es el monto exacto mensual que se destinará a su cuenta de capitalización individual (10% obligatorio)?",
      "alternativas": {
        "A": "$\$320.000$",
        "B": "$\$350.000$",
        "C": "$\$300.000$",
        "D": "$\$32.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Como el sueldo imponible supera el tope de cotización previsional de $\$3.200.000$, los porcentajes legales se calculan sobre dicho tope y no sobre el sueldo real bruto. Por lo tanto, el 10% obligatorio es $\$3.200.000 \\cdot 0,10 = \\$320.000$.",
      "feedback_error": "Incorrecto. Cuando el sueldo bruto supera el tope imponible previsional, las cotizaciones se calculan exclusivamente sobre el tope imponible. Así, el $10\\%$ de $\$3.200.000$ es $\$320.000$."
    },
    {
      "id": "q-m2-1-3-3",
      "enunciado": "Un afiliado de 45 años tiene $\$20.000.000$ acumulados en el Fondo A de su AFP. Si dicho fondo tiene una rentabilidad anual real del $6\\%$ compuesto durante 3 años consecutivos, ¿cuál será el saldo final acumulado al cabo de ese tiempo?",
      "alternativas": {
        "A": "$\$23.820.320$",
        "B": "$\$23.600.000$",
        "C": "$\$21.800.000$",
        "D": "$\$24.200.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Aplicamos la fórmula de capitalización compuesta:\n $C_f = C_i \\cdot (1 + r)^t = 20.000.000 \\cdot (1,06)^3 = 20.000.000 \\cdot 1,191016 = \\$23.820.320$.",
      "feedback_error": "Incorrecto. Se debe aplicar la fórmula de interés compuesto: $C_f = 20.000.000 \\cdot (1,06)^3$. Como $(1,06)^3 = 1,191016$, al multiplicar por $20.000.000$ da $\$23.820.320$."
    },
    {
      "id": "q-m2-1-3-4",
      "enunciado": "Si una persona decide realizar un Ahorro Previsional Voluntario (APV) mensual de $\$100.000$ bajo el Régimen A (donde el Estado otorga un subsidio anual del $15\\%$ de lo ahorrado), ¿cuánto subsidio recibirá del Estado al cabo de un año si mantiene su ahorro de forma constante?",
      "alternativas": {
        "A": "$\$180.000$",
        "B": "$\$15.000$",
        "C": "$\$120.000$",
        "D": "$\$200.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! En un año, la persona ahorra: $\$100.000 \\cdot 12 = \\$1.200.000$ anuales. El Estado le bonifica el $15\\%$ de este total:\n $\\text{Subsidio} = \\$1.200.000 \\cdot 0,15 = \\$180.000$.",
      "feedback_error": "Incorrecto. Primero calcula el ahorro total en 12 meses: $\$1.200.000$. El subsidio estatal es el $15\\%$ de ese monto anual, lo que equivale a $\$180.000$."
    },
    {
      "id": "q-m2-1-3-5",
      "enunciado": "Un trabajador evalúa cambiarse de administradora previsional. La AFP Actual le cobra una comisión del $1,44\\%$ sobre su renta imponible mensual de $\$1.500.000$, mientras que la AFP Nueva le ofrece cobrar un $0,58\\%$. ¿Cuánto dinero mensual se ahorraría el trabajador al cambiarse a la AFP Nueva?",
      "alternativas": {
        "A": "$\$12.900$",
        "B": "$\$21.600$",
        "C": "$\$8.700$",
        "D": "$\$15.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Restamos las tasas de comisión para ver la diferencia:\n $1,44\\% - 0,58\\% = 0,86\\%$ mensual.\nCalculamos ese porcentaje sobre el sueldo imponible:\n $\\text{Ahorro} = \\$1.500.000 \\cdot 0,0086 = \\$12.900$ mensuales.",
      "feedback_error": "Incorrecto. La diferencia de comisión es de $0,86\\%$ ($1,44 - 0,58$). Al calcular el $0,86\\%$ sobre la renta imponible de $\$1.500.000$ obtenemos un ahorro mensual de $\$12.900$."
    },
    {
      "id": "q-m2-1-3-6",
      "enunciado": "Al jubilarse, un cotizante tiene acumulado en su cuenta de capitalización previsional $\$120.000.000$. Si opta por la modalidad de Retiro Programado y su expectativa de vida previsional calculada es de $200$ meses, ¿cuál será el monto base de su pensión en el primer mes (asumiendo rentabilidad cero en ese mes inicial)?",
      "alternativas": {
        "A": "$\$600.000$",
        "B": "$\$400.000$",
        "C": "$\$500.000$",
        "D": "$\$300.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La pensión mensual base en un retiro programado se calcula dividiendo el saldo total previsional entre el número de meses de expectativa de vida previsional calculada:\n $\\text{Pensión inicial} = \\frac{\\$120.000.000}{200} = \\$600.000$.",
      "feedback_error": "Incorrecto. Se debe dividir el saldo acumulado previsional por los meses de expectativa de vida: $\\frac{120.000.000}{200} = 600.000$ pesos."
    },
    {
      "id": "q-m2-1-3-7",
      "enunciado": "Un afiliado ingresa al Fondo E cotizando un saldo único inicial de $\$10.000.000$. Si la rentabilidad real promedio anual del Fondo E durante los últimos 2 años fue del $3\\%$ compuesto, ¿cuál es la ganancia por rentabilidad obtenida por el afiliado?",
      "alternativas": {
        "A": "$\$609.000$",
        "B": "$\$600.000$",
        "C": "$\$10.609.000$",
        "D": "$\$300.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Primero calculamos el capital final con interés compuesto:\n $C_f = 10.000.000 \\cdot (1,03)^2 = 10.000.000 \\cdot 1,0609 = \\$10.609.000$.\nLa ganancia neta es la diferencia entre capital final e inicial: $\$10.609.000 - \\$10.000.000 = \\$609.000$.",
      "feedback_error": "Incorrecto. Aplicamos $C_f = 10.000.000 \\cdot (1,03)^2 = 10.609.000$. Al restar el monto invertido inicial, la ganancia neta por rentabilidad compuesta es $\$609.000$."
    },
    {
      "id": "q-m2-1-3-8",
      "enunciado": "Un trabajador cotiza el $10\\%$ obligatorio más el $1\\%$ de comisión previsional en una AFP. Si su sueldo bruto imponible es $\$1.000.000$ y adicionalmente se le descuenta el $7\\%$ para el sistema de salud (Fonasa/Isapre), ¿qué porcentaje total de su sueldo imponible se destina a estas dos obligaciones legales?",
      "alternativas": {
        "A": "18%",
        "B": "17%",
        "C": "11%",
        "D": "8%"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Sumamos todos los porcentajes descontados obligatoriamente:\n - AFP Obligatorio: $10\\%$\n - Comisión AFP: $1\\%$\n - Salud Obligatorio: $7\\%$\nTotal = $10\\% + 1\\% + 7\\% = 18\\%$ de su remuneración imponible.",
      "feedback_error": "Incorrecto. Suma las cotizaciones previsionales (AFP obligatoria de $10\\%$ más comisión de $1\\%$) y la cotización obligatoria de salud de $7\\%$, lo que totaliza un $18\\%$."
    },
    {
      "id": "q-m2-1-3-9",
      "enunciado": "Si una persona joven cotiza $\$150.000$ mensuales durante un año entero en su AFP. ¿Cuánto saldo neto acumulará en su cuenta si el fondo no renta nada pero la AFP le cobra mensualmente una comisión del $1\\%$ calculado sobre su aporte mensual?",
      "alternativas": {
        "A": "$\$1.782.000$",
        "B": "$\$1.800.000$",
        "C": "$\$1.650.000$",
        "D": "$\$1.798.500$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Cada mes, el aporte es de $\$150.000$. Pero el aporte neto que ingresa a su capitalización es descontado por la comisión (1% de su aporte), es decir:\n $\\text{Aporte neto mensual} = \\$150.000 \\cdot 0,99 = \\$148.500$.\nAl cabo de un año (12 meses), el capital acumulado será: $\$148.500 \\cdot 12 = \\$1.782.000$.",
      "feedback_error": "Incorrecto. Cada mes se descuenta la comisión del $1\\%$ sobre su cotización, ingresando de forma neta $\$148.500$. En 12 meses el ahorro acumulado será de $\$148.500 \\cdot 12 = \$1.782.000$."
    },
    {
      "id": "q-m2-1-3-10",
      "enunciado": "La rentabilidad real del Fondo C el año pasado fue del $-4\\%$. Si un cotizante tenía $\$50.000.000$ a principios de año, ¿cuánto dinero total perdió por concepto de rentabilidad negativa al cabo de ese año?",
      "alternativas": {
        "A": "$\$2.000.000$",
        "B": "$\$48.000.000$",
        "C": "$\$4.000.000$",
        "D": "$\$500.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! La rentabilidad de $-4\\%$ implica una pérdida del $4\\%$ sobre el capital inicial:\n $\\text{Pérdida} = \\$50.000.000 \\cdot 0,04 = \\$2.000.000$.",
      "feedback_error": "Incorrecto. Calcula el $4\\%$ sobre los $\$50.000.000$, lo cual equivale a $\$2.000.000$ de pérdida por rentabilidad negativa."
    }
  ],
  "sec-m2-1-4": [
    {
      "id": "q-m2-1-4-1",
      "enunciado": "Un cliente solicita un crédito de consumo de $\$5.000.000$ en un banco. La entidad le aprueba el crédito en 36 cuotas fijas mensuales de $\$195.000$. ¿Cuál es el Costo Total del Crédito (CTC) y el porcentaje de sobrecosto pagado con respecto al préstamo original?",
      "alternativas": {
        "A": "$\$7.020.000$ y un sobrecosto del $40,4\\%$.",
        "B": "$\$7.020.000$ y un sobrecosto del $20,4\\%$.",
        "C": "$\$6.800.000$ y un sobrecosto del $36\\%$.",
        "D": "$\$5.000.000$ y un sobrecosto del $0\\%$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos el CTC:\n $CTC = 36 \\cdot \\$195.000 = \\$7.020.000$.\nEl sobrecosto pagado es: $\$7.020.000 - \\$5.000.000 = \\$2.020.000$.\nEn porcentaje sobre el monto original: $\\frac{2.020.000}{5.000.000} \\cdot 100 = 40,4\\%$.",
      "feedback_error": "Incorrecto. El CTC es cuotas por valor cuota: $36 \\cdot 195.000 = 7.020.000$ pesos. El sobrecosto porcentual se calcula sobre los $\$5.000.000$, lo que equivale al $40,4\\%$."
    },
    {
      "id": "q-m2-1-4-2",
      "enunciado": "Si dos bancos ofrecen un crédito de consumo de $\$2.000.000$ bajo diferentes condiciones:\n - Banco A: ofrece cuota mensual fija de $\$105.000$ a 24 meses.\n - Banco B: ofrece cuota mensual fija de $\$200.000$ a 12 meses.\n¿Cuál banco tiene el menor Costo Total del Crédito (CTC) y cuál es la diferencia monetaria entre ambos CTC?",
      "alternativas": {
        "A": "Banco B tiene menor CTC, y la diferencia es de $\$120.000$.",
        "B": "Banco A tiene menor CTC, y la diferencia es de $\$120.000$.",
        "C": "Banco B tiene menor CTC, y la diferencia es de $\$200.000$.",
        "D": "Ambos bancos tienen el mismo CTC."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Calculamos los dos CTC:\n - $CTC_A = 24 \\cdot \\$105.000 = \\$2.520.000$\n - $CTC_B = 12 \\cdot \\$200.000 = \\$2.400.000$\nEl Banco B tiene un menor CTC. La diferencia es de $\$2.520.000 - \\$2.400.000 = \\$120.000$.",
      "feedback_error": "Incorrecto. Comparamos los CTC: Banco A es $24 \\cdot 105.000 = 2.520.000$. Banco B es $12 \\cdot 200.000 = 2.400.000$. El de menor CTC es Banco B, ahorrando $\$120.000$."
    },
    {
      "id": "q-m2-1-4-3",
      "enunciado": "Una persona solicita un crédito hipotecario por $3.000$ UF a 20 años plazo. Si la cuota mensual calculada del crédito es fija de $18$ UF mensuales (incluyendo seguros obligatorios), ¿cuántas UF pagará el cliente en total por sobre el monto solicitado al final del plazo?",
      "alternativas": {
        "A": "$1.320$ UF",
        "B": "$4.320$ UF",
        "C": "$3.000$ UF",
        "D": "$1.800$ UF"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! El plazo de 20 años equivale a $20 \\cdot 12 = 240$ meses. El Costo Total del Crédito en UF es:\n $CTC = 240 \\cdot 18\\text{ UF} = 4.320\\text{ UF}$.\nEl sobrecosto en UF es la diferencia con el préstamo original: $4.320\\text{ UF} - 3.000\\text{ UF} = 1.320\\text{ UF}$.",
      "feedback_error": "Incorrecto. 20 años equivalen a 240 meses de pago. El CTC en UF es $240 \\cdot 18 = 4.320\\text{ UF}$. Al restar las $3.000$ UF solicitadas originalmente, el sobrecosto es de $1.320$ UF."
    },
    {
      "id": "q-m2-1-4-4",
      "enunciado": "En un crédito de consumo de $\$1.000.000$ a 12 meses, la primera cuota mensual a pagar es de $\$95.000$. Si la tasa de interés mensual aplicada es del $1,2\\%$, ¿qué monto de la primera cuota se destina a pagar el interés y cuánto se destina a amortizar la deuda real?",
      "alternativas": {
        "A": "$\$12.000$ a interés y $\$83.000$ a amortización.",
        "B": "$\$12.000$ a amortización y $\$83.000$ a interés.",
        "C": "$\$9.500$ a interés y $\$85.500$ a amortización.",
        "D": "$\$1.200$ a interés y $\$93.800$ a amortización."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! En la primera cuota, el interés cobrado es sobre el capital total inicial prestado:\n $\\text{Interés} = \\$1.000.000 \\cdot 0,012 = \\$12.000$.\nEl resto de la cuota se destina a la amortización de la deuda:\n $\\text{Amortización} = \\text{Cuota} - \\text{Interés} = \\$95.000 - \\$12.000 = \\$83.000$.",
      "feedback_error": "Incorrecto. El interés de la primera cuota se calcula sobre la deuda original completa: $1,2\\%$ de $\$1.000.000$ es $\$12.000$. Restando este interés de la cuota de $\$95.000$ nos da $\$83.000$ para amortización."
    },
    {
      "id": "q-m2-1-4-5",
      "enunciado": "Un cliente realiza una compra con su tarjeta de crédito de $\$300.000$ en 3 cuotas sin interés, pero con una comisión única de mantención de tarjeta de $\$3.500$ por mes. ¿Cuál es el Costo Total real de esta transacción al cabo de los 3 meses?",
      "alternativas": {
        "A": "$\$310.500$",
        "B": "$\$300.000$",
        "C": "$\$303.500$",
        "D": "$\$307.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Aunque las cuotas no tengan interés, se debe pagar la mantención de $\$3.500$ en cada uno de los 3 meses:\n $\\text{Costo Total} = \\$300.000 + 3 \\cdot \\$3.500 = \\$310.500$.",
      "feedback_error": "Incorrecto. Se deben sumar las comisiones por los 3 meses al costo inicial: $\$300.000 + 3 \\cdot \\$3.500 = \$310.500$."
    },
    {
      "id": "q-m2-1-4-6",
      "enunciado": "Si una persona contrata un crédito de consumo y se le indica que la Carga Anual Equivalente (CAE) es del $18\\%$. ¿Cuál es la interpretación matemática correcta de este indicador?",
      "alternativas": {
        "A": "Que el costo total del crédito anualizado, sumando tasa de interés, comisiones y seguros, equivale a un cobro del $18\\%$ sobre la deuda inicial.",
        "B": "Que la tasa de interés neta cobrada por el banco es del $18\\%$ mensual.",
        "C": "Que al final del año terminará devolviendo un $18\\%$ más del capital prestado en total.",
        "D": "Que la comisión previsional obligatoria del crédito es de $18\\%$ anual."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La Carga Anual Equivalente (CAE) consolida en un solo porcentaje todos los gastos, intereses, comisiones y seguros obligatorios del crédito expresados de forma anualizada sobre el saldo insoluto.",
      "feedback_error": "Incorrecto. La CAE no representa solo la tasa de interés nominal, sino el costo consolidado de seguros, comisiones y gastos del crédito anualizados."
    },
    {
      "id": "q-m2-1-4-7",
      "enunciado": "Un estudiante universitario solicita un crédito de consumo de $\$1.500.000$ para comprar un computador portátil, pagadero en un solo pago al final de un año con una tasa de interés del $12\\%$ anual compuesto. ¿Cuál es el Costo Total del Crédito al final de ese año?",
      "alternativas": {
        "A": "$\$1.680.000$",
        "B": "$\$1.500.000$",
        "C": "$\$1.620.000$",
        "D": "$\$1.800.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Como se paga en una sola cuota al cabo de un año con $12\\%$ de interés compuesto anual, el costo final será el capital inicial más el $12\\%$ de interés:\n $CTC = \\$1.500.000 \\cdot 1,12 = \\$1.680.000$.",
      "feedback_error": "Incorrecto. Se calcula el $12\\%$ de $\$1.500.000$, que equivale a $\$180.000$ en intereses. Sumando esto al monto original obtenemos $\$1.680.000$."
    },
    {
      "id": "q-m2-1-4-8",
      "enunciado": "Un banco ofrece un crédito de consumo con tasa variable y otro banco ofrece el mismo crédito con tasa fija. Si la economía entra en un período de alta inflación y alza general de tasas por parte del Banco Central, ¿cuál de las opciones mantendrá inalterable su valor cuota para el cliente?",
      "alternativas": {
        "A": "El crédito con tasa fija.",
        "B": "El crédito con tasa variable.",
        "C": "Ambos créditos mantendrán sus cuotas inalteradas.",
        "D": "Ambos créditos aumentarán sus cuotas."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! En los créditos con tasa fija, el contrato establece una tasa que permanece constante durante todo el período del crédito, por lo que las cuotas no se ven afectadas por las fluctuaciones macroeconómicas de las tasas del mercado.",
      "feedback_error": "Incorrecto. Los créditos con tasa fija protegen al deudor de las variaciones económicas, garantizando que el valor cuota no cambie."
    },
    {
      "id": "q-m2-1-4-9",
      "enunciado": "Si una persona solicita un crédito hipotecario de $2.000$ UF y debe contratar un seguro de desgravamen obligatorio mensual de $0,15$ UF y un seguro de incendio mensual de $0,25$ UF, ¿cuántas UF pagará en seguros durante los 25 años del crédito?",
      "alternativas": {
        "A": "$120$ UF",
        "B": "$12$ UF",
        "C": "$240$ UF",
        "D": "$400$ UF"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos el costo mensual de seguros sumando ambos seguros obligatorios: $0,15 + 0,25 = 0,40\\text{ UF}$ mensuales.\nEn 25 años hay: $25 \\cdot 12 = 300$ meses previsionalmente.\nTotal de seguros = $300 \\cdot 0,40 = 120\\text{ UF}$.",
      "feedback_error": "Incorrecto. Suma el costo mensual de seguros ($0,4\\text{ UF}$) y multiplícalo por el número de meses en 25 años ($300$ meses), resultando en $120\\text{ UF}$."
    },
    {
      "id": "q-m2-1-4-10",
      "enunciado": "Una casa comercial ofrece un avance en efectivo de $\$500.000$ en 12 cuotas fijas de $\$55.000$. Si el cliente puede conseguir un crédito de consumo en un banco por el mismo monto en 12 cuotas de $\$50.000$, ¿cuánto dinero total ahorraría al elegir la opción del banco?",
      "alternativas": {
        "A": "$\$60.000$",
        "B": "$\$5.000$",
        "C": "$\$50.000$",
        "D": "$\$120.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Calculamos la diferencia del valor de cuota mensual: $\$55.000 - \\$50.000 = \\$5.000$.\nMultiplicamos este ahorro mensual por los 12 meses de duración del crédito:\n $\\text{Ahorro total} = \\$5.000 \\cdot 12 = \\$60.000$.",
      "feedback_error": "Incorrecto. La diferencia de cuota mensual es $\$5.000$. En 12 cuotas, el ahorro total es de $\$5.000 \\cdot 12 = \$60.000$."
    }
  ],
  "sec-m2-1-5": [
    {
      "id": "q-m2-1-5-1",
      "enunciado": "Al simplificar la expresión algebraica de logaritmos notables $\\log_2(64) - \\log_3(27) + \\log_5\\left(\\frac{1}{25}\\right)$, ¿cuál es el valor entero que se obtiene?",
      "alternativas": {
        "A": "$1$",
        "B": "$5$",
        "C": "$3$",
        "D": "$-1$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos individualmente cada logaritmo:\n - $\\log_2(64) = 6$ (porque $2^6 = 64$)\n - $\\log_3(27) = 3$ (porque $3^3 = 27$)\n - $\\log_5(1/25) = -2$ (porque $5^{-2} = 1/25$)\nReemplazando: $6 - 3 + (-2) = 3 - 2 = 1$.",
      "feedback_error": "Incorrecto. Recuerda que $\\log_2(64) = 6$, $\\log_3(27) = 3$, y $\\log_5(1/25) = -2$. Sumando y restando obtenemos $6 - 3 - 2 = 1$."
    },
    {
      "id": "q-m2-1-5-2",
      "enunciado": "Utilizando la propiedad de cambio de base y propiedades de los logaritmos, ¿cuál es el resultado simplificado de la expresión $\\log_4(9) \\cdot \\log_3(8)$?",
      "alternativas": {
        "A": "$3$",
        "B": "$4$",
        "C": "$6$",
        "D": "$2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Aplicamos propiedades de logaritmos:\n $\\log_4(9) = \\log_{2^2}(3^2) = \\frac{2}{2} \\log_2(3) = \\log_2(3)$.\n $\\log_3(8) = \\log_3(2^3) = 3 \\log_3(2)$.\nMultiplicamos ambas expresiones:\n $\\log_2(3) \\cdot 3 \\log_3(2) = 3 \\cdot (\\log_2(3) \\cdot \\log_3(2)) = 3 \\cdot 1 = 3$.",
      "feedback_error": "Incorrecto. Ten en cuenta que $\\log_4(9) = \\log_2(3)$ y $\\log_3(8) = 3\\log_3(2)$. Al multiplicarlos, como $\\log_2(3) \\cdot \\log_3(2) = 1$, la expresión da $3$."
    },
    {
      "id": "q-m2-1-5-3",
      "enunciado": "Si queremos reducir a una sola potencia la expresión algebraica $\\frac{2^5 \\cdot 4^{-2} \\cdot \\sqrt{8}}{16^{-1}}$, ¿qué potencia de base 2 resulta?",
      "alternativas": {
        "A": "$2^{6,5}$",
        "B": "$2^6$",
        "C": "$2^{5,5}$",
        "D": "$2^7$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Escribimos todos los factores en base 2:\n - $2^5$\n - $4^{-2} = (2^2)^{-2} = 2^{-4}$\n - $\\sqrt{8} = \\sqrt{2^3} = 2^{3/2} = 2^{1,5}$\n - $16^{-1} = (2^4)^{-1} = 2^{-4}$\nOperamos:\n $\\frac{2^5 \\cdot 2^{-4} \\cdot 2^{1,5}}{2^{-4}} = \\frac{2^{2,5}}{2^{-4}} = 2^{2,5 - (-4)} = 2^{6,5}$.",
      "feedback_error": "Incorrecto. Pasa todos los términos a base 2: $4^{-2} = 2^{-4}$, $\\sqrt{8} = 2^{1,5}$, y $16^{-1} = 2^{-4}$. La expresión queda $\\frac{2^5 \\cdot 2^{-4} \\cdot 2^{1,5}}{2^{-4}} = 2^{6,5}$."
    },
    {
      "id": "q-m2-1-5-4",
      "enunciado": "Si sabemos que $\\log(2) = x$ y $\\log(3) = y$, ¿cuál es el valor de $\\log(72)$ en términos de las variables $x$ e $y$?",
      "alternativas": {
        "A": "$3x + 2y$",
        "B": "$2x + 3y$",
        "C": "$x^3 + y^2$",
        "D": "$6x + 2y$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Descomponemos el número $72$ en factores primos: $72 = 8 \\cdot 9 = 2^3 \\cdot 3^2$.\nAplicamos propiedades del logaritmo:\n $\\log(72) = \\log(2^3 \\cdot 3^2) = \\log(2^3) + \\log(3^2) = 3\\log(2) + 2\\log(3) = 3x + 2y$.",
      "feedback_error": "Incorrecto. Descompón $72$ como $2^3 \\cdot 3^2$. Por propiedad del logaritmo de un producto y potencia, esto es $3\\log(2) + 2\\log(3) = 3x + 2y$."
    },
    {
      "id": "q-m2-1-5-5",
      "enunciado": "¿Cuál es el conjunto solución exacto para la ecuación logarítmica de término $\\log_2(x - 3) + \\log_2(x) = 2$?",
      "alternativas": {
        "A": "$x = 4$",
        "B": "$x = -1$",
        "C": "$x = 4$ y $x = -1$",
        "D": "$x = 5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por propiedad de la suma de logaritmos:\n $\\log_2((x - 3)x) = 2 \\implies x(x - 3) = 2^2 \\implies x^2 - 3x - 4 = 0$.\nFactorizando obtenemos: $(x - 4)(x + 1) = 0 \\implies x = 4$ o $x = -1$.\nPero el argumento del logaritmo debe ser positivo ($x > 3$), por lo que $x = -1$ se descarta. La única solución válida es $x = 4$.",
      "feedback_error": "Incorrecto. Aplicamos propiedades de logaritmos para unificar el producto: $x(x-3) = 2^2 \\implies x^2-3x-4 = 0$. Las raíces son $4$ y $-1$, pero como el argumento de los logaritmos originales debe ser estrictamente positivo ($x > 3$), la única solución es $4$."
    },
    {
      "id": "q-m2-1-5-6",
      "enunciado": "Al simplificar la expresión con raíces sucesivas $\\sqrt{2\\sqrt{2\\sqrt{2}}}$, ¿qué potencia de base 2 se obtiene?",
      "alternativas": {
        "A": "$2^{7/8}$",
        "B": "$2^{3/4}$",
        "C": "$2^{1/2}$",
        "D": "$2^{5/8}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Convertimos de adentro hacia afuera a potencias fraccionarias:\n - La raíz interna: $\\sqrt{2} = 2^{1/2}$\n - Multiplicada por 2: $2 \\cdot 2^{1/2} = 2^{3/2}$\n - Bajo la segunda raíz: $\\sqrt{2^{3/2}} = (2^{3/2})^{1/2} = 2^{3/4}$\n - Multiplicada por 2: $2 \\cdot 2^{3/4} = 2^{7/4}$\n - Bajo la raíz externa: $\\sqrt{2^{7/4}} = (2^{7/4})^{1/2} = 2^{7/8}$.",
      "feedback_error": "Incorrecto. Se calcula como potencia fraccionaria. La raíz anidada equivale a $\\sqrt{2 \\cdot \\sqrt{2 \\cdot 2^{0,5}}} = \\sqrt{2 \\cdot 2^{0,75}} = 2^{0,875} = 2^{7/8}$."
    },
    {
      "id": "q-m2-1-5-7",
      "enunciado": "Si aplicamos la propiedad del logaritmo de una raíz en base $b$, ¿cuál es el valor exacto de la expresión $\\log_b\\left(\\sqrt[3]{b^5}\\right)$?",
      "alternativas": {
        "A": "$\\frac{5}{3}$",
        "B": "$\\frac{3}{5}$",
        "C": "$15$",
        "D": "$5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Escribimos la raíz como una potencia de exponente fraccionario:\n $\\sqrt[3]{b^5} = b^{5/3}$.\nPor propiedad del logaritmo de una potencia:\n $\\log_b(b^{5/3}) = \\frac{5}{3} \\log_b(b) = \\frac{5}{3} \\cdot 1 = \\frac{5}{3}$.",
      "feedback_error": "Incorrecto. Transforma la raíz en exponente fraccionario: $\\sqrt[3]{b^5} = b^{5/3}$. Así, $\\log_b(b^{5/3})$ es simplemente $\\frac{5}{3}$."
    },
    {
      "id": "q-m2-1-5-8",
      "enunciado": "Si un logaritmo cumple que $\\log_b(81) = \\frac{4}{3}$, ¿cuál es el valor numérico de su base $b$?",
      "alternativas": {
        "A": "$27$",
        "B": "$9$",
        "C": "$3$",
        "D": "$81$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por definición de logaritmo: $\\log_b(81) = 4/3 \\iff b^{4/3} = 81$.\nElevamos ambos lados a la potencia $3/4$ para despejar $b$:\n $b = (81)^{3/4} = (3^4)^{3/4} = 3^3 = 27$.",
      "feedback_error": "Incorrecto. Aplica la definición de logaritmo: $b^{4/3} = 81$. Al resolver para $b$ elevando a $3/4$ en ambos lados obtenemos: $b = (3^4)^{3/4} = 3^3 = 27$."
    },
    {
      "id": "q-m2-1-5-9",
      "enunciado": "¿Cuál es la relación de orden correcta entre las siguientes raíces reales: $p = \\sqrt{2}$, $q = \\sqrt[3]{3}$ y $r = \\sqrt[6]{6}$?",
      "alternativas": {
        "A": "$r < p < q$",
        "B": "$p < q < r$",
        "C": "$q < p < r$",
        "D": "$r < q < p$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para comparar raíces de distintos índices, las igualamos al mínimo común índice, que es $6$:\n - $p = \\sqrt{2} = \\sqrt[6]{2^3} = \\sqrt[6]{8}$\n - $q = \\sqrt[3]{3} = \\sqrt[6]{3^2} = \\sqrt[6]{9}$\n - $r = \\sqrt[6]{6}$\nComparando los radicandos: $6 < 8 < 9$. Por lo tanto, $r < p < q$.",
      "feedback_error": "Incorrecto. Homogeniza los índices de las raíces buscando el mínimo común índice ($6$): $p = \\sqrt[6]{8}$, $q = \\sqrt[6]{9}$, y $r = \\sqrt[6]{6}$. Ordenándolas de menor a mayor da $r < p < q$."
    },
    {
      "id": "q-m2-1-5-10",
      "enunciado": "Si evaluamos la ecuación exponencial $5^{2x - 1} = 125$, ¿cuál es el valor exacto de la incógnita $x$?",
      "alternativas": {
        "A": "$2$",
        "B": "$3$",
        "C": "$1,5$",
        "D": "$1$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Expresamos el miembro derecho en base $5$: $125 = 5^3$.\nIgualamos los exponentes:\n $2x - 1 = 3 \\implies 2x = 4 \\implies x = 2$.",
      "feedback_error": "Incorrecto. Expresa $125$ como $5^3$ para tener bases iguales: $5^{2x-1} = 5^3$. Igualando los exponentes resulta $2x-1=3$, de donde $x=2$."
    }
  ],
  "sec-m2-1-6": [
    {
      "id": "q-m2-1-6-1",
      "enunciado": "La energía $E$ (en ergios) liberada por un sismo y su magnitud $M$ en la escala de Richter están relacionadas por la ecuación $\\log(E) = 11,8 + 1,5M$. Si un terremoto de gran intensidad libera $10^{23,8}\\text{ ergios}$ de energía, ¿cuál fue su magnitud exacta registrada en la escala de Richter?",
      "alternativas": {
        "A": "$8,0$",
        "B": "$9,0$",
        "C": "$7,5$",
        "D": "$8,5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Reemplazamos $E = 10^{23,8}$ en la fórmula:\n $\\log(10^{23,8}) = 11,8 + 1,5M \\implies 23,8 = 11,8 + 1,5M$\nRestando $11,8$ a ambos lados:\n $12 = 1,5M \\implies M = \\frac{12}{1,5} = 8,0$.",
      "feedback_error": "Incorrecto. Al aplicar el logaritmo decimal a $10^{23,8}$ obtenemos $23,8$. La ecuación queda: $23,8 = 11,8 + 1,5M \\implies 12 = 1,5M \\implies M = 8,0$."
    },
    {
      "id": "q-m2-1-6-2",
      "enunciado": "El pH de una disolución se define como $pH = -\\log[H^+]$, donde $[H^+]$ es la concentración de iones de hidrógeno en moles por litro. Si una solución química de laboratorio posee una concentración $[H^+] = 2 \\cdot 10^{-5}\\text{ mol/L}$, ¿cuál es su pH si consideramos $\\log(2) \\approx 0,3$?",
      "alternativas": {
        "A": "$4,7$",
        "B": "$5,3$",
        "C": "$5,7$",
        "D": "$4,3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Calculamos el pH aplicando propiedades de logaritmos:\n $pH = -\\log(2 \\cdot 10^{-5}) = -(\\log(2) + \\log(10^{-5}))$\n $pH = -(0,3 - 5) = -(-4,7) = 4,7$.",
      "feedback_error": "Incorrecto. Se aplica la propiedad de logaritmo de un producto: $-\\log(2 \\cdot 10^{-5}) = -(\\log(2) + \\log(10^{-5})) = -(0,3 - 5) = 4,7$."
    },
    {
      "id": "q-m2-1-6-3",
      "enunciado": "La intensidad del sonido en decibeles está modelada por $dB = 10 \\cdot \\log\\left(\\frac{I}{I_0}\\right)$, donde $I$ es la intensidad física e $I_0 = 10^{-12}\\text{ W/m}^2$ es el umbral de audición humana. Si un concierto alcanza una intensidad sonora de $I = 10^{-2}\\text{ W/m}^2$, ¿cuál es el nivel de decibeles medido en el lugar?",
      "alternativas": {
        "A": "$100\\text{ decibeles}$",
        "B": "$120\\text{ decibeles}$",
        "C": "$80\\text{ decibeles}$",
        "D": "$90\\text{ decibeles}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Reemplazamos los valores:\n $dB = 10 \\cdot \\log\\left(\\frac{10^{-2}}{10^{-12}}\\right) = 10 \\cdot \\log(10^{-2 - (-12)}) = 10 \\cdot \\log(10^{10})$.\nComo $\\log(10^{10}) = 10$, multiplicamos: $10 \\cdot 10 = 100$ decibeles.",
      "feedback_error": "Incorrecto. Al dividir las potencias: $\\frac{10^{-2}}{10^{-12}} = 10^{10}$. El logaritmo de $10^{10}$ es $10$. Multiplicando por el factor externo 10 nos da $100\\text{ decibeles}$."
    },
    {
      "id": "q-m2-1-6-4",
      "enunciado": "Si la magnitud de un terremoto en la escala de Richter aumenta de un sismo de magnitud $M_1 = 5,0$ a otro de magnitud $M_2 = 7,0$. ¿Cuántas veces más energía libera el sismo de magnitud $7,0$ con respecto al de magnitud $5,0$ en términos de potencias?",
      "alternativas": {
        "A": "$10^3$ veces más de energía.",
        "B": "$100$ veces más de energía.",
        "C": "$10^{1,5}$ veces más de energía.",
        "D": "$10^2$ veces más de energía."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La relación de energía $E$ es $\\log(E) = 11,8 + 1,5M \\implies E = 10^{11,8 + 1,5M}$.\nComparando la energía de ambos sismos:\n $\\frac{E_2}{E_1} = \\frac{10^{11,8 + 1,5 \\cdot 7}}{10^{11,8 + 1,5 \\cdot 5}} = 10^{1,5(7 - 5)} = 10^{1,5 \\cdot 2} = 10^3$ veces.",
      "feedback_error": "Incorrecto. La energía aumenta exponencialmente en base 10 con exponente $1,5 \\cdot \\Delta M$. Como la diferencia de magnitud es $\\Delta M = 2$, el aumento es $10^{1,5 \\cdot 2} = 10^3$ veces."
    },
    {
      "id": "q-m2-1-6-5",
      "enunciado": "El desgaste de una maquinaria industrial en base a las horas de uso $h$ está dado por la fórmula $D(h) = 5 \\cdot \\log_2(h) - 10$ unidades de desgaste. ¿Cuántas horas de uso deben transcurrir para que el desgaste acumulado sea exactamente de $10$ unidades?",
      "alternativas": {
        "A": "$16$ horas",
        "B": "$4$ horas",
        "C": "$8$ horas",
        "D": "$32$ horas"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Planteamos la ecuación: $5 \\cdot \\log_2(h) - 10 = 10$.\nSumamos $10$: $5 \\cdot \\log_2(h) = 20$.\nDividimos por $5$: $\\log_2(h) = 4$.\nPor definición de logaritmo: $h = 2^4 = 16$ horas.",
      "feedback_error": "Incorrecto. Planteando la ecuación: $5\\log_2(h) - 10 = 10 \\implies 5\\log_2(h) = 20 \\implies \\log_2(h) = 4$. Despejando obtenemos $h = 2^4 = 16$ horas."
    },
    {
      "id": "q-m2-1-6-6",
      "enunciado": "La población de una colonia de bacterias después de $t$ horas crece exponencialmente siguiendo la fórmula $P(t) = 1.000 \\cdot 3^{2t}$. Si queremos despejar el tiempo $t$ que tarda en alcanzar una población de $P$ bacterias, ¿cuál es la expresión logarítmica correcta?",
      "alternativas": {
        "A": "$t = \\frac{\\log_3(P) - 3}{2}$",
        "B": "$t = \\frac{\\log_3\\left(\\frac{P}{1.000}\\right)}{2}$",
        "C": "$t = 2 \\cdot \\log_3\\left(\\frac{P}{1.000}\\right)$",
        "D": "$t = \\frac{\\log_3\\left(\\frac{1.000}{P}\\right)}{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Despejamos:\n $P = 1.000 \\cdot 3^{2t} \\implies \\frac{P}{1.000} = 3^{2t}$.\nAplicamos logaritmo en base 3 a ambos lados:\n $\\log_3\\left(\\frac{P}{1.000}\\right) = 2t \\implies t = \\frac{\\log_3\\left(\\frac{P}{1.000}\\right)}{2}$.\nPor propiedad del cociente de logaritmos: $\\log_3\\left(\\frac{P}{1.000}\\right) = \\log_3(P) - \\log_3(1.000) = \\log_3(P) - 3$.\nPor lo tanto, $t = \\frac{\\log_3(P) - 3}{2}$.",
      "feedback_error": "Incorrecto. Al despejar la potencia de base 3 resulta: $3^{2t} = \\frac{P}{1.000}$. Aplicando logaritmo base 3 y resolviendo para $t$ obtenemos la expresión de la opción A."
    },
    {
      "id": "q-m2-1-6-7",
      "enunciado": "La concentración de un contaminante químico en un lago después de $d$ días disminuye según $C(d) = C_0 \\cdot 10^{-0,2d}$. Si la concentración inicial era de $C_0 = 100\\text{ ppm}$, ¿cuántos días tardará en disminuir a exactamente $1\\text{ ppm}$?",
      "alternativas": {
        "A": "$10$ días",
        "B": "$5$ días",
        "C": "$20$ días",
        "D": "$2$ días"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Planteamos la ecuación:\n $1 = 100 \\cdot 10^{-0,2d} \\implies \\frac{1}{100} = 10^{-0,2d} \\implies 10^{-2} = 10^{-0,2d}$.\nIgualamos los exponentes:\n $-2 = -0,2d \\implies d = \\frac{-2}{-0,2} = 10$ días.",
      "feedback_error": "Incorrecto. Planteamos la igualdad: $1 = 100 \\cdot 10^{-0,2d} \\implies 10^{-2} = 10^{-0,2d}$. Al igualar exponentes resulta $-2 = -0,2d$, de donde $d = 10$ días."
    },
    {
      "id": "q-m2-1-6-8",
      "enunciado": "El brillo aparente de una estrella se mide con su magnitud aparente $m$. Si dos estrellas tienen brillos físicos $B_1$ y $B_2$ relacionados por $m_1 - m_2 = -2,5 \\cdot \\log\\left(\\frac{B_1}{B_2}\right)$. Si la estrella 1 brilla $100$ veces más que la estrella 2, ¿cuál es la diferencia de magnitud $m_1 - m_2$?",
      "alternativas": {
        "A": "$-5,0$",
        "B": "$-2,5$",
        "C": "$-10,0$",
        "D": "$5,0$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Reemplazamos la proporción del brillo físico $\\frac{B_1}{B_2} = 100$:\n $m_1 - m_2 = -2,5 \\cdot \\log(100) = -2,5 \\cdot 2 = -5,0$.",
      "feedback_error": "Incorrecto. Sustituyendo el cociente de brillos $\\frac{B_1}{B_2} = 100$, como el logaritmo de 100 es 2, multiplicamos $-2,5 \\cdot 2 = -5,0$."
    },
    {
      "id": "q-m2-1-6-9",
      "enunciado": "La devaluación anual del valor comercial de una flota de vehículos está modelada por $V(t) = V_0 \\cdot (0,5)^t$, donde $t$ es el tiempo en años. Si un camión costó inicialmente $\$40.000.000$, ¿cuántos años deben transcurrir para que su valor se devalúe a $\$5.000.000$?",
      "alternativas": {
        "A": "$3$ años",
        "B": "$4$ años",
        "C": "$5$ años",
        "D": "$2$ años"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Planteamos la ecuación:\n $5.000.000 = 40.000.000 \\cdot (0,5)^t \\implies \\frac{5.000.000}{40.000.000} = (0,5)^t$.\nSimplificando la fracción:\n $\\frac{1}{8} = (0,5)^t \\implies \\left(\\frac{1}{2}\\right)^3 = \\left(\\frac{1}{2}\\right)^t \\implies t = 3$ años.",
      "feedback_error": "Incorrecto. Sustituyendo e igualando la ecuación: $5.000.000 = 40.000.000 \\cdot (0,5)^t$. Al simplificar nos queda $(0,5)^t = \\frac{1}{8}$, de donde $t = 3$ años."
    },
    {
      "id": "q-m2-1-6-10",
      "enunciado": "La escala de pH de un líquido de piscina indica un pH de $8$. Si se le agrega un químico que hace que la concentración de iones $[H^+]$ se multiplique por $100$, ¿cuál es el nuevo pH de la piscina?",
      "alternativas": {
        "A": "$6$",
        "B": "$10$",
        "C": "$8,2$",
        "D": "$7,8$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! El pH inicial es $8 = -\\log[H^+]_i \\implies [H^+]_i = 10^{-8}$.\nSi la concentración se multiplica por $100$, la nueva concentración es:\n $[H^+]_n = 100 \\cdot 10^{-8} = 10^{-6}$.\nCalculamos el nuevo pH:\n $pH_n = -\\log(10^{-6}) = 6$.",
      "feedback_error": "Incorrecto. Recuerda que un incremento en la concentración de $[H^+]$ por un factor de $10^2$ (ácido) implica restar 2 unidades en la escala logarítmica del pH, resultando en un pH de $6$."
    }
  ]
};

function run() {
  console.log('🚀 [EstudiaUni] Iniciando generación de preguntas locales M2 Números...');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontró capitulos-mock-local.json.');
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const capTarget = capitulos.find(c => c.id === 'cap-m2-1-numeros');

  if (!capTarget) {
    console.error('❌ Error: No se encontró "cap-m2-1-numeros" en el mock local.');
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
        id: `test-m2-1-${sec.id.split('-').pop()}`,
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

  console.log(`\n🎉 [EstudiaUni] ¡Generación de M2 Números completada con éxito!`);
  console.log(`   ➜ Total de preguntas inyectadas: ${totalQuestionsCount}`);
}

run();
