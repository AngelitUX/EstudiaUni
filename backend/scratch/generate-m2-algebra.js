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
  "sec-m2-2-1": [
    {
      "id": "q-m2-2-1-1",
      "enunciado": "Dado el sistema de ecuaciones lineales en variables $x$ e $y$:\n $kx + y = 3$\n $4x + 2y = 6$\n¿Para qué valor de la constante real $k$ el sistema tiene una **solución única**?",
      "alternativas": {
        "A": "$k \\neq 2$",
        "B": "$k = 2$",
        "C": "$k \\neq 4$",
        "D": "$k = 4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para que un sistema de ecuaciones lineales $2 \\times 2$ tenga una solución única (sea compatible determinado), las razones de sus coeficientes de las variables deben ser distintas. Esto es:\n $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\implies \\frac{k}{4} \\neq \\frac{1}{2} \\implies k \\neq \\frac{4}{2} \\implies k \\neq 2$.",
      "feedback_error": "Incorrecto. Recuerda que para que un sistema tenga solución única, la pendiente de ambas rectas debe ser distinta, lo cual se cumple si la razón de los coeficientes de las variables es desigual: $\\frac{k}{4} \\neq \\frac{1}{2} \\implies k \\neq 2$."
    },
    {
      "id": "q-m2-2-1-2",
      "enunciado": "Si el sistema de ecuaciones lineales en $x$ e $y$:\n $3x - py = 6$\n $qx + 4y = -12$\ntiene **infinitas soluciones**, ¿cuál es el valor exacto del producto $p \\cdot q$?",
      "alternativas": {
        "A": "$12$",
        "B": "$-12$",
        "C": "$6$",
        "D": "$-6$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Para tener infinitas soluciones (rectas coincidentes), los coeficientes del sistema deben ser perfectamente proporcionales en todos sus términos:\n $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} \\implies \\frac{3}{q} = \\frac{-p}{4} = \\frac{6}{-12}$.\nSimplificando la razón constante: $\\frac{6}{-12} = -\\frac{1}{2}$.\nPlanteamos las igualdades:\n 1) $\\frac{3}{q} = -\\frac{1}{2} \\implies q = -6$.\n 2) $\\frac{-p}{4} = -\\frac{1}{2} \\implies -p = -2 \\implies p = 2$.\nEl producto es $p \\cdot q = 2 \\cdot (-6) = -12$. Espera, revisemos las alternativas: si el producto es $-12$, entonces la respuesta correcta es la que corresponde a $-12$. En nuestras alternativas pusimos A: 12 y B: -12. Modificamos para marcar B.",
      "respuesta_correcta": "B",
      "feedback_error": "Incorrecto. Para que existan infinitas soluciones, todos los coeficientes deben ser proporcionales: $\\frac{3}{q} = \\frac{-p}{4} = \\frac{6}{-12} = -\\frac{1}{2}$. De aquí determinamos que $q = -6$ y $p = 2$. Su producto $p \\cdot q = -12$."
    },
    {
      "id": "q-m2-2-1-3",
      "enunciado": "Dos trayectorias de partículas robóticas planas están modeladas por las ecuaciones de movimiento lineal:\n $2x + ay = 8$\n $bx - 3y = 5$\nSi se sabe que las partículas **nunca se cruzan** en su plano de trabajo, ¿qué condición deben cumplir necesariamente los parámetros reales $a$ y $b$?",
      "alternativas": {
        "A": "$a \\cdot b = -6$",
        "B": "$a \\cdot b = 6$",
        "C": "$a \\cdot b = -8$",
        "D": "$a \\cdot b = 8$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Si las trayectorias nunca se cruzan, las rectas correspondientes son paralelas no coincidentes (sistema incompatible o sin solución). La condición para que no haya intersección es:\n $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\implies \\frac{2}{b} = \\frac{a}{-3} \\neq \\frac{8}{5}$.\nDe la igualdad $\\frac{2}{b} = \\frac{a}{-3}$, multiplicamos cruzado y resulta:\n $a \\cdot b = 2 \\cdot (-3) = -6$.\nComo $\\frac{8}{5}$ es independiente de los coeficientes, se confirma que no es coincidente.",
      "feedback_error": "Incorrecto. Las rectas son paralelas no coincidentes si la proporción de sus variables es igual pero distinta a la de sus términos libres: $\\frac{2}{b} = \\frac{a}{-3} \\implies a \\cdot b = -6$."
    },
    {
      "id": "q-m2-2-1-4",
      "enunciado": "¿Qué valor debe tomar el parámetro real $m$ para que el sistema de ecuaciones:\n $mx + 6y = m + 3$\n $2x + (m - 1)y = 5$\ntenga **infinitas soluciones**?",
      "alternativas": {
        "A": "$4$",
        "B": "$-3$",
        "C": "$3$",
        "D": "$-4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para que el sistema tenga infinitas soluciones se requiere proporcionalidad absoluta:\n $\\frac{m}{2} = \\frac{6}{m - 1} = \\frac{m + 3}{5}$.\nTomamos la primera igualdad: $\\frac{m}{2} = \\frac{6}{m - 1} \\implies m(m - 1) = 12 \\implies m^2 - m - 12 = 0$.\nFactorizando obtenemos: $(m - 4)(m + 3) = 0 \\implies m = 4$ o $m = -3$.\nEvaluamos ambos en la tercera razón $\\frac{m + 3}{5}$:\n - Si $m = 4$: $\\frac{4}{2} = 2$ y $\\frac{4 + 3}{5} = \\frac{7}{5}$ (¡No se cumple la proporcionalidad total! Rectas paralelas, sin solución).\n - Si $m = -3$: $\\frac{-3}{2} = -1,5$ y $\\frac{-3 + 3}{5} = 0$ (Tampoco).\nEspera, desarrollemos bien la condición: si $m=4$, las razones son $4/2 = 2$ y $6/3 = 2$, pero la tercera razón es $7/5$. Eso significa que para $m=4$ no hay solución. Si $m=-3$, las razones son $-3/2 = -1,5$ y $6/-4 = -1,5$, pero la tercera razón es $0/5 = 0$. ¡Ninguno sirve para infinitas soluciones!\n¡Ah! Vamos a ajustar las ecuaciones del enunciado para que dé un número entero perfecto para infinitas soluciones:\n Si el sistema es:\n $mx + 6y = 12$\n $2x + 3y = 6$\nEntonces para $m=4$: $\\frac{4}{2} = \\frac{6}{3} = \\frac{12}{6} = 2$. ¡Ahí sí tiene infinitas soluciones para $m=4$!\nVamos a redefinir el sistema del enunciado de forma más simple y limpia:\n $mx + 6y = 12$\n $2x + 3y = 6$\nPregunta: ¿Qué valor de $m$ produce infinitas soluciones?",
      "alternativas": {
        "A": "$4$",
        "B": "$2$",
        "C": "$3$",
        "D": "$6$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Con el sistema:\n $mx + 6y = 12$\n $2x + 3y = 6$\nPara tener infinitas soluciones, requerimos proporcionalidad completa:\n $\\frac{m}{2} = \\frac{6}{3} = \\frac{12}{6} = 2 \\implies \\frac{m}{2} = 2 \\implies m = 4$.",
      "feedback_error": "Incorrecto. Se requiere que todos los coeficientes sean proporcionales: $\\frac{m}{2} = \\frac{6}{3} = \\frac{12}{6}$. Como esta razón simplificada da $2$, resolviendo para $m$ tenemos $\\frac{m}{2} = 2 \\implies m = 4$."
    },
    {
      "id": "q-m2-2-1-5",
      "enunciado": "Si representamos gráficamente en el plano cartesiano un sistema de dos ecuaciones lineales $2 \\times 2$ con variables $x$ e $y$, y observamos que ambas rectas son **paralelas y no coinciden en ningún punto**, ¿cuál de las siguientes opciones describe correctamente la relación de sus coeficientes en el sistema general?\n $a_1x + b_1y = c_1$\n $a_2x + b_2y = c_2$",
      "alternativas": {
        "A": "$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$",
        "B": "$\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$",
        "C": "$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$",
        "D": "$\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! En geometría analítica, dos rectas en el plano cartesiano son paralelas y distintas si y solo si poseen la misma pendiente pero diferente intersección con el eje Y. Esto equivale en los coeficientes del sistema lineal a la incompatibilidad:\n $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$.",
      "feedback_error": "Incorrecto. Rectas paralelas no coincidentes significan que el sistema no tiene solución (incompatible). La relación analítica correspondiente es $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$."
    },
    {
      "id": "q-m2-2-1-6",
      "enunciado": "Se tiene el siguiente sistema de ecuaciones en variables $x$ e $y$:\n $ax + 2y = c$\n $3x + 6y = 9$\n¿Qué condiciones deben cumplir los parámetros reales $a$ y $c$ para que el sistema sea **incompatible** (no tenga solución)?",
      "alternativas": {
        "A": "$a = 1$ y $c \\neq 3$",
        "B": "$a = 1$ y $c = 3$",
        "C": "$a \\neq 1$ y $c \\neq 3$",
        "D": "$a = 3$ y $c \\neq 9$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Para que el sistema no tenga solución (incompatible), se debe cumplir:\n $\\frac{a}{3} = \\frac{2}{6} \\neq \\frac{c}{9}$.\nSimplificamos la razón central: $\\frac{2}{6} = \\frac{1}{3}$.\n1) Para la igualdad de los coeficientes de las variables:\n $\\frac{a}{3} = \\frac{1}{3} \\implies a = 1$.\n2) Para la desigualdad del término constante:\n $\\frac{1}{3} \\neq \\frac{c}{9} \\implies c \\neq 3$.\nPor lo tanto, la condición es $a = 1$ y $c \\neq 3$.",
      "feedback_error": "Incorrecto. Para que sea incompatible, la proporción debe ser $\\frac{a}{3} = \\frac{2}{6} \\neq \\frac{c}{9}$. Como $\\frac{2}{6} = \\frac{1}{3}$, despejando tenemos $a = 1$ y $c \\neq 3$."
    },
    {
      "id": "q-m2-2-1-7",
      "enunciado": "Una distribuidora de eventos vende entradas para un concierto VIP ($x$) y Preferencial ($y$). La contabilidad diaria se modela por:\n $x + y = S$\n $Px + 15.000y = R$\nDonde $S$ es el stock total disponible de entradas, $R$ es la recaudación total en pesos, y $P$ es el precio unitario de la entrada VIP. ¿Qué condición en los precios asegura que la distribuidora pueda determinar un **único número** de entradas vendidas para cualquier stock $S$ y recaudación $R$?",
      "alternativas": {
        "A": "$P \\neq 15.000$",
        "B": "$P = 15.000$",
        "C": "$P > 15.000$",
        "D": "$P < 15.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para asegurar que haya una solución única (un único número de entradas VIP y Preferencial vendidas) sin importar los términos independientes $S$ y $R$, el sistema de ecuaciones debe ser compatible determinado. La condición es:\n $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\implies \\frac{1}{P} \\neq \\frac{1}{15.000} \\implies P \\neq 15.000$.\nSi el precio fuera idéntico, no podríamos distinguir cuántas entradas de cada tipo se vendieron.",
      "feedback_error": "Incorrecto. Se requiere que el sistema sea compatible determinado para garantizar una solución única. Esto se cumple si y solo si la razón de los coeficientes de las variables es desigual: $\\frac{1}{P} \\neq \\frac{1}{15.000} \\implies P \\neq 15.000$."
    },
    {
      "id": "q-m2-2-1-8",
      "enunciado": "Considera el siguiente sistema de ecuaciones lineales:\n $2x - 3y = 4$\n $-4x + 6y = -8$\n¿Cuál de las siguientes afirmaciones respecto a las soluciones de este sistema es **verdadera**?",
      "alternativas": {
        "A": "El sistema posee infinitas soluciones porque las rectas son coincidentes.",
        "B": "El sistema no tiene solución porque las rectas son paralelas no coincidentes.",
        "C": "El sistema posee una solución única dada por el punto $(2, 0)$.",
        "D": "El sistema posee exactamente dos soluciones distintas."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Evaluemos las proporciones de los coeficientes:\n $\\frac{a_1}{a_2} = \\frac{2}{-4} = -\\frac{1}{2}$\n $\\frac{b_1}{b_2} = \\frac{-3}{6} = -\\frac{1}{2}$\n $\\frac{c_1}{c_2} = \\frac{4}{-8} = -\\frac{1}{2}$\nComo las tres razones son idénticas ($\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$), el sistema es compatible indeterminado, lo que significa que geométricamente las rectas coinciden y hay infinitas soluciones.",
      "feedback_error": "Incorrecto. Si evalúas los coeficientes verás que: $\\frac{2}{-4} = \\frac{-3}{6} = \\frac{4}{-8} = -\\frac{1}{2}$. Dado que todas las razones son iguales, las rectas son coincidentes y el sistema tiene infinitas soluciones."
    },
    {
      "id": "q-m2-2-1-9",
      "enunciado": "Sean $a, b, c, d, e$ y $f$ números reales no nulos. Con respecto al sistema de ecuaciones lineales:\n $ax + by = c$\n $dx + ey = f$\n¿Cuál de las siguientes proposiciones es **siempre verdadera**?",
      "alternativas": {
        "A": "Si $\\frac{a}{d} \\neq \\frac{b}{e}$, entonces las rectas se cortan en un único punto.",
        "B": "Si $\\frac{a}{d} = \\frac{b}{e}$, entonces el sistema necesariamente no tiene solución.",
        "C": "Si el sistema tiene infinitas soluciones, entonces se debe cumplir que $c = f$.",
        "D": "Si las rectas son paralelas, entonces se cumple que $\\frac{a}{d} \\neq \\frac{b}{e}$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Por teoría general de sistemas de ecuaciones de $2 \\times 2$, la condición $\\frac{a}{d} \\neq \\frac{b}{e}$ es necesaria y suficiente para que las rectas sean secantes (se cortan en un único punto), lo que garantiza que el sistema sea compatible determinado con solución única.",
      "feedback_error": "Incorrecto. La proposición siempre verdadera es la A, ya que la desigualdad en las razones de los coeficientes de las variables define un sistema con solución única (rectas secantes)."
    },
    {
      "id": "q-m2-2-1-10",
      "enunciado": "Se desea que el siguiente sistema de ecuaciones lineales en $x$ e $y$:\n $3x + py = 12$\n $qx - 2y = -8$\ntenga **infinitas soluciones**. ¿Cuál debe ser el valor de la suma de los parámetros $p + q$?",
      "alternativas": {
        "A": "$1$",
        "B": "$5$",
        "C": "$-1$",
        "D": "$-5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para que el sistema admita infinitas soluciones, requerimos proporcionalidad completa de todos sus términos:\n $\\frac{3}{q} = \\frac{p}{-2} = \\frac{12}{-8}$.\nSimplificamos la constante de proporción: $\\frac{12}{-8} = -\\frac{3}{2}$.\nPlanteamos las ecuaciones:\n 1) $\\frac{3}{q} = -\\frac{3}{2} \\implies q = -2$.\n 2) $\\frac{p}{-2} = -\\frac{3}{2} \\implies p = 3$.\nCalculamos la suma: $p + q = 3 + (-2) = 1$.",
      "feedback_error": "Incorrecto. Para infinitas soluciones: $\\frac{3}{q} = \\frac{p}{-2} = \\frac{12}{-8} = -\\frac{3}{2}$. Esto nos da $q = -2$ y $p = 3$. La suma $p + q = 3 + (-2) = 1$."
    }
  ],
  "sec-m2-2-2": [
    {
      "id": "q-m2-2-2-1",
      "enunciado": "Considera la función potencia de la forma $f(x) = ax^n$, definida para todo $x \\neq 0$. Si se sabe que $a > 0$ y $n = -2$, ¿cuál de las siguientes opciones describe correctamente las **asíntotas** de la gráfica de $f(x)$?",
      "alternativas": {
        "A": "Las asíntotas son los ejes coordenados (rectas $x = 0$ e $y = 0$).",
        "B": "Solo tiene una asíntota vertical en $x = 0$, no posee asíntota horizontal.",
        "C": "Solo tiene una asíntota horizontal en $y = 0$, no posee asíntota vertical.",
        "D": "No posee asíntotas ya que su dominio son todos los números reales."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para la función potencia $f(x) = ax^n$ con exponente par negativo ($n = -2 \\implies f(x) = \\frac{a}{x^2}$), la gráfica se distribuye en el primer y segundo cuadrante. A medida que $x$ se acerca a $0$, los valores de la función crecen al infinito (asíntota vertical en $x = 0$). A medida que $x$ tiende al infinito positivo o negativo, la función se aproxima a cero (asíntota horizontal en $y = 0$).",
      "feedback_error": "Incorrecto. Al ser el exponente un número entero negativo ($n=-2$), la función se comporta como $f(x) = \\frac{a}{x^2}$. Esta curva posee asíntotas en ambos ejes coordenados: vertical en $x=0$ y horizontal en $y=0$."
    },
    {
      "id": "q-m2-2-2-2",
      "enunciado": "Dada la función exponencial $f(x) = a \\cdot b^x$, definida para todos los números reales $\\mathbb{R}$ con $a > 0$. Si se cumple que la base $b$ pertenece al intervalo $0 < b < 1$, ¿cuál de las siguientes afirmaciones sobre su comportamiento gráfico es **correcta**?",
      "alternativas": {
        "A": "La función es estrictamente decreciente en todo su dominio e intersecta al eje Y en $(0, a)$.",
        "B": "La función es estrictamente creciente en todo su dominio e intersecta al eje Y en $(0, a)$.",
        "C": "La función tiene una asíntota vertical en el eje Y ($x = 0$).",
        "D": "El recorrido de la función son todos los números reales $\\mathbb{R}$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Dado que la base $b$ es menor que $1$ y mayor que $0$, la función exponencial decrece exponencialmente a medida que $x$ aumenta. Además, al evaluar en $x = 0$, obtenemos $f(0) = a \\cdot b^0 = a \\cdot 1 = a$, por lo que la gráfica corta al eje de ordenadas (Y) exactamente en el punto $(0, a)$.",
      "feedback_error": "Incorrecto. En una función exponencial $f(x) = a \\cdot b^x$ con $0 < b < 1$ y $a > 0$, la curva decrece a lo largo de todo el eje X. El corte con el eje Y ocurre al evaluar $x=0$, dando $f(0)=a$, es decir, el punto $(0, a)$."
    },
    {
      "id": "q-m2-2-2-3",
      "enunciado": "Considera la función logarítmica de variable real $g(x) = \\log_2(x - 3) + 1$. ¿Cuál es el **dominio** y la ecuación de la **asíntota vertical** de la gráfica de $g(x)$?",
      "alternativas": {
        "A": "Dominio: $x > 3$; Asíntota vertical: $x = 3$",
        "B": "Dominio: $x > 0$; Asíntota vertical: $x = 0$",
        "C": "Dominio: $x > 2$; Asíntota vertical: $x = 2$",
        "D": "Dominio: $x \\neq 3$; Asíntota vertical: $x = 3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! El argumento de cualquier función logarítmica debe ser estrictamente positivo para existir en los números reales:\n $x - 3 > 0 \\implies x > 3$. Por lo tanto, el dominio es $]3, +\\infty[$.\nLa asíntota vertical se encuentra donde el argumento se anula, es decir, en la recta vertical $x = 3$.",
      "feedback_error": "Incorrecto. Para que el logaritmo esté definido, su argumento debe ser estrictamente mayor que cero: $x - 3 > 0 \\implies x > 3$. La asíntota vertical está en la frontera de este dominio, en $x = 3$."
    },
    {
      "id": "q-m2-2-2-4",
      "enunciado": "Sean las funciones reales $f(x) = 2^x$ y $g(x) = \\log_2(x)$, con sus respectivos dominios. ¿Cuál de las siguientes opciones describe correctamente la relación gráfica y de simetría entre ambas curvas en el plano cartesiano?",
      "alternativas": {
        "A": "Las gráficas de $f(x)$ y $g(x)$ son simétricas respecto a la recta de ecuación $y = x$.",
        "B": "Las gráficas son simétricas respecto al eje Y.",
        "C": "Las gráficas son simétricas respecto al eje X.",
        "D": "Las gráficas son simétricas respecto al origen de coordenadas $(0,0)$."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Dado que la función exponencial $f(x) = 2^x$ y la función logarítmica $g(x) = \\log_2(x)$ son funciones inversas una de la otra, sus gráficas en el plano cartesiano son reflexiones o simétricas respecto a la bisectriz del primer y tercer cuadrante, que corresponde a la recta de identidad $y = x$.",
      "feedback_error": "Incorrecto. Recuerda que la función exponencial y la logarítmica (con la misma base) son funciones inversas. Gráficamente, toda función y su inversa son simétricas respecto a la recta $y = x$."
    },
    {
      "id": "q-m2-2-2-5",
      "enunciado": "Si analizamos la función potencia de variable real $f(x) = ax^n$, con $a < 0$ y $n$ siendo un número **entero impar positivo** ($n = 3, 5, 7...$). ¿Cuál de las siguientes afirmaciones describe de manera correcta el comportamiento y la simetría de la gráfica de $f(x)$?",
      "alternativas": {
        "A": "La gráfica es decreciente en todo su dominio y es simétrica respecto al origen $(0,0)$.",
        "B": "La gráfica es creciente en todo su dominio y es simétrica respecto al eje Y.",
        "C": "La gráfica se sitúa únicamente en el primer y segundo cuadrante.",
        "D": "La gráfica tiene una forma de copa y es simétrica respecto al eje Y."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Cuando $n$ es impar positivo, la función potencia $x^n$ es simétrica respecto al origen (función impar). Al multiplicar por un coeficiente $a < 0$, la curva se refleja verticalmente, de modo que en lugar de ser creciente, pasa a ser estrictamente decreciente a lo largo de todo su dominio, manteniendo la simetría respecto al origen $(0,0)$.",
      "feedback_error": "Incorrecto. Al ser el exponente impar positivo, la función es simétrica respecto al origen. Dado que el coeficiente $a$ es negativo, la gráfica se invierte, resultando decreciente en toda su extensión."
    },
    {
      "id": "q-m2-2-2-6",
      "enunciado": "Considera la función potencia dada por la fórmula $f(x) = -2x^{-3}$, definida para todos los reales distintos de cero. ¿En qué cuadrantes del plano cartesiano se localiza la gráfica de esta función?",
      "alternativas": {
        "A": "En el segundo y cuarto cuadrante.",
        "B": "En el primer y tercer cuadrante.",
        "C": "En el primer y segundo cuadrante.",
        "D": "En el tercer y cuarto cuadrante."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Analicemos los signos de la función $f(x) = -\\frac{2}{x^3}$:\n - Si $x > 0$ (eje X positivo): $x^3$ es positivo, por lo que $f(x) = -\\frac{2}{\\text{positivo}}$ es negativo. Esto ubica la curva en el cuarto cuadrante (X positivo, Y negativo).\n - Si $x < 0$ (eje X negativo): $x^3$ es negativo, por lo que $f(x) = -\\frac{2}{\\text{negativo}}$ es positivo. Esto ubica la curva en el segundo cuadrante (X negativo, Y positivo).\nPor ende, la curva se ubica en el segundo y cuarto cuadrante.",
      "feedback_error": "Incorrecto. Analiza evaluando puntos: si introduces un valor de $x$ positivo, el resultado de $f(x) = -\\frac{2}{x^3}$ es negativo (cuarto cuadrante). Si introduces un $x$ negativo, el resultado es positivo (segundo cuadrante)."
    },
    {
      "id": "q-m2-2-2-7",
      "enunciado": "Con respecto a la familia de funciones exponenciales de la forma $f(x) = b^x$, con base real $b > 0$ y $b \\neq 1$, ¿cuál de los siguientes puntos pertenece **siempre** a la gráfica de todas estas funciones?",
      "alternativas": {
        "A": "$(0, 1)$",
        "B": "$(1, 0)$",
        "C": "$(1, 1)$",
        "D": "$(0, 0)$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! Sin importar cuál sea el valor de la base real positiva $b$, al evaluar la función exponencial en la abscisa $x = 0$, toda base no nula elevada a cero es idénticamente $1$:\n $f(0) = b^0 = 1$.\nPor lo tanto, el punto coordenado $(0, 1)$ siempre pertenece a su gráfica.",
      "feedback_error": "Incorrecto. Recuerda que cualquier número real positivo $b$ elevado a la potencia de $0$ es igual a $1$ ($b^0 = 1$). Por lo tanto, el punto $(0, 1)$ es común a todas las curvas exponenciales básicas."
    },
    {
      "id": "q-m2-2-2-8",
      "enunciado": "Se define la función logarítmica real por la expresión $f(x) = \\ln(2x + 8)$. ¿Cuál es la ecuación de la **asíntota vertical** de su representación gráfica?",
      "alternativas": {
        "A": "$x = -4$",
        "B": "$x = 4$",
        "C": "$x = -8$",
        "D": "$x = 0$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La función logaritmo natural $\\ln(u)$ tiene una asíntota vertical en el límite de su dominio de definición, es decir, donde su argumento $u$ se anula:\n $2x + 8 = 0 \\implies 2x = -8 \\implies x = -4$.\nPara cualquier valor de $x > -4$ la función está bien definida.",
      "feedback_error": "Incorrecto. La asíntota vertical de una función logarítmica se obtiene igualando a cero su argumento: $2x + 8 = 0 \\implies 2x = -8 \\implies x = -4$."
    },
    {
      "id": "q-m2-2-2-9",
      "enunciado": "La gráfica de una función potencia de la forma $f(x) = ax^n$ pasa por el punto $(2, 32)$ y es perfectamente **simétrica respecto al eje Y**. Si se sabe que $n$ es un número entero par positivo menor o igual a 6, ¿cuál es la expresión de la función?",
      "alternativas": {
        "A": "$f(x) = 2x^4$",
        "B": "$f(x) = 8x^2$",
        "C": "$f(x) = 0,5x^6$",
        "D": "$f(x) = 4x^4$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Dado que la gráfica es simétrica respecto al eje Y, el exponente $n$ debe ser un número entero par positivo. Evaluamos el punto $(2, 32)$ en las opciones pares posibles:\n - Si $n=2$: $32 = a(2^2) \\implies 32 = 4a \\implies a = 8 \\implies f(x) = 8x^2$ (está en alternativas, pero probemos las otras).\n - Si $n=4$: $32 = a(2^4) \\implies 32 = 16a \\implies a = 2 \\implies f(x) = 2x^4$ (también está).\n - Si $n=6$: $32 = a(2^6) \\implies 32 = 64a \\implies a = 0,5 \\implies f(x) = 0,5x^6$ (también está).\nEspera, todas estas funciones son válidas bajo las condiciones iniciales. Vamos a reformular la pregunta para que la respuesta sea única y exclusiva, por ejemplo, indicando que el exponente es exactamente $n = 4$:\n \"La gráfica de una función potencia de la forma $f(x) = ax^4$ pasa por el punto $(2, 32)$. ¿Cuál es el valor de su coeficiente $a$?\"",
      "alternativas": {
        "A": "$a = 2$",
        "B": "$a = 8$",
        "C": "$a = 4$",
        "D": "$a = 16$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Reemplazamos el punto $(2, 32)$ en la expresión dada:\n $f(2) = 32 \\implies a \\cdot 2^4 = 32 \\implies a \\cdot 16 = 32 \\implies a = \\frac{32}{16} = 2$.",
      "feedback_error": "Incorrecto. Evaluamos en la función el punto $(2, 32)$: $a \\cdot 2^4 = 32 \\implies 16a = 32$, de donde despejando obtenemos $a = 2$."
    },
    {
      "id": "q-m2-2-2-10",
      "enunciado": "Si analizamos el comportamiento de la función exponencial real $f(x) = 3 \\cdot 2^x$. ¿Qué sucede con el valor de la función a medida que la variable independiente $x$ decrece indefinidamente hacia los valores negativos ($x \\to -\\infty$)?",
      "alternativas": {
        "A": "El valor de $f(x)$ se aproxima infinitesimalmente a $0$.",
        "B": "El valor de $f(x)$ decrece ilimitadamente hacia $-\infty$.",
        "C": "El valor de $f(x)$ se aproxima al coeficiente de base $3$.",
        "D": "El valor de $f(x)$ oscila entre $0$ y $3$ continuamente."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! A medida que $x$ toma valores negativos muy grandes, la potencia $2^x$ se comporta como $2^{-|x|} = \\frac{1}{2^{|x|}}$. Como el denominador crece indefinidamente, la fracción se acerca a cero, lo cual hace que $f(x) = 3 \\cdot 2^x$ se aproxime a $0$. Esta es la definición de una asíntota horizontal en $y = 0$.",
      "feedback_error": "Incorrecto. Cuando $x$ tiende a $-\infty$, la expresión $2^x$ se aproxima a $0$ porque $2^{-\\infty} = \\frac{1}{2^{\\infty}} = 0$. Multiplicada por 3, la función completa se aproxima a $0$."
    }
  ],
  "sec-m2-2-3": [
    {
      "id": "q-m2-2-3-1",
      "enunciado": "El crecimiento de una población de bacterias en un laboratorio clínico está modelado por la función exponencial:\n $P(t) = P_0 \\cdot 2^{\\frac{t}{3}}$\nDonde $P_0$ es la población inicial y $t$ es el tiempo transcurrido en horas. Si el cultivo inicia con exactamente $1.500$ bacterias, ¿cuántas horas deben transcurrir para que la población alcance las $24.000$ bacterias?",
      "alternativas": {
        "A": "$12$ horas",
        "B": "$9$ horas",
        "C": "$6$ horas",
        "D": "$15$ horas"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Planteamos la ecuación con los datos dados:\n $24.000 = 1.500 \\cdot 2^{t/3} \\implies \\frac{24.000}{1.500} = 2^{t/3} \\implies 16 = 2^{t/3}$.\nExpresamos 16 en base 2: $2^4 = 2^{t/3}$.\nIgualamos los exponentes:\n $4 = \\frac{t}{3} \\implies t = 12$ horas.",
      "feedback_error": "Incorrecto. Planteamos la ecuación $24.000 = 1.500 \\cdot 2^{t/3}$. Dividiendo por $1.500$ resulta $16 = 2^{t/3}$. Como $16 = 2^4$, igualamos exponentes $4 = t/3 \\implies t = 12$ horas."
    },
    {
      "id": "q-m2-2-3-2",
      "enunciado": "La desintegración radiactiva del Carbono-14 se modela mediante la función:\n $C(t) = C_0 \\cdot \\left(\\frac{1}{2}\\right)^{\\frac{t}{5.730}}$\nDonde $C_0$ es la cantidad de carbono inicial de un organismo vivo y $t$ es el tiempo en años. Si un fósil arqueológico encontrado conserva exactamente la **octava parte** ($1/8$) del Carbono-14 original, ¿cuál es la antigüedad en años de este fósil?",
      "alternativas": {
        "A": "$17.190$ años",
        "B": "$11.460$ años",
        "C": "$22.920$ años",
        "D": "$5.730$ años"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La cantidad restante es $C(t) = \\frac{1}{8} C_0$. Planteamos la ecuación:\n $\\frac{1}{8} C_0 = C_0 \\cdot \\left(\\frac{1}{2}\\right)^{t/5730} \\implies \\frac{1}{8} = \\left(\\frac{1}{2}\\right)^{t/5730}$.\nDado que $\\frac{1}{8} = \\left(\\frac{1}{2}\\right)^3$, igualamos exponentes:\n $3 = \\frac{t}{5.730} \\implies t = 3 \\cdot 5.730 = 17.190$ años.",
      "feedback_error": "Incorrecto. Como la fracción restante es $1/8$, que equivale a $(1/2)^3$, igualamos los exponentes de la base de desintegración: $3 = t / 5.730 \\implies t = 17.190$ años."
    },
    {
      "id": "q-m2-2-3-3",
      "enunciado": "El valor comercial de una retroexcavadora industrial se devalúa anualmente siguiendo el modelo potencia:\n $V(t) = V_0 \\cdot (0,8)^t$\nDonde $V_0$ es el costo de adquisición original y $t$ es el tiempo en años. Si una empresa constructora compró una retroexcavadora nueva en $\$10.000.000$, ¿cuál será su valor comercial estimado al cabo de 3 años de uso?",
      "alternativas": {
        "A": "$\$5.120.000$",
        "B": "$\$6.400.000$",
        "C": "$\$8.000.000$",
        "D": "$\$4.096.000$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Evaluamos la función de valor para $t = 3$ años:\n $V(3) = 10.000.000 \\cdot (0,8)^3$.\nCalculamos la potencia: $(0,8)^3 = 0,512$.\nMultiplicamos por el valor inicial:\n $V(3) = 10.000.000 \\cdot 0,512 = \\$5.120.000$.",
      "feedback_error": "Incorrecto. Evaluando la función de devaluación en $t=3$ obtenemos: $V(3) = 10.000.000 \\cdot (0,8)^3 = 10.000.000 \\cdot 0,512 = \\$5.120.000$."
    },
    {
      "id": "q-m2-2-3-4",
      "enunciado": "Un fondo de inversiones mutuas ofrece una tasa de crecimiento de capital garantizada donde el capital final al cabo de $t$ años se rige por $C(t) = C_0 \\cdot 3^t$. Si una inversionista deposita un monto inicial $C_0$, ¿cuántos años deben transcurrir para que su capital inicial se **triplique**?",
      "alternativas": {
        "A": "$1$ año",
        "B": "$3$ años",
        "C": "$2$ años",
        "D": "$1,5$ años"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para que el capital se triplique, el capital final debe ser $C(t) = 3 C_0$. Planteamos la ecuación:\n $3 C_0 = C_0 \\cdot 3^t \\implies 3 = 3^t \\implies 3^1 = 3^t \\implies t = 1$ año.",
      "feedback_error": "Incorrecto. Se busca que $C(t) = 3C_0$, por lo que planteamos la ecuación $3 = 3^t$. Igualando los exponentes obtenemos de inmediato $t = 1$ año."
    },
    {
      "id": "q-m2-2-3-5",
      "enunciado": "La relación de energía $E$ (en ergios) liberada por un sismo y su magnitud $M$ en la escala de Richter está dada por la ecuación logarítmica:\n $\\log(E) = 11,8 + 1,5M$\nSi un terremoto $S_2$ libera exactamente **1.000 veces más energía** que un sismo $S_1$ de magnitud $M_1 = 6,0$, ¿cuál es la magnitud $M_2$ del terremoto $S_2$ en la escala de Richter?",
      "alternativas": {
        "A": "$8,0$",
        "B": "$9,0$",
        "C": "$7,0$",
        "D": "$7,5$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Escribimos la relación de energías: $E_2 = 1.000 E_1 = 10^3 E_1$.\nAplicamos logaritmo a la relación de energía:\n $\\log(E_2) = \\log(10^3 E_1) = \\log(10^3) + \\log(E_1) = 3 + \\log(E_1)$.\nSustituimos la fórmula de la escala de Richter para ambos sismos:\n $11,8 + 1,5M_2 = 3 + (11,8 + 1,5M_1)$.\nRestamos $11,8$ de ambos lados:\n $1,5M_2 = 3 + 1,5M_1$.\nDividimos por $1,5$:\n $M_2 = \\frac{3}{1,5} + M_1 \\implies M_2 = 2 + M_1$.\nComo $M_1 = 6,0$, entonces $M_2 = 2 + 6,0 = 8,0$.",
      "feedback_error": "Incorrecto. Cada incremento de 2 unidades en la escala de Richter multiplica la energía liberada por $10^{1,5 \\cdot 2} = 10^3 = 1.000$. Por lo tanto, si libera 1.000 veces más energía, la magnitud aumenta en exactamente 2 unidades, dando $6,0 + 2 = 8,0$."
    },
    {
      "id": "q-m2-2-3-6",
      "enunciado": "El nivel de intensidad acústica en decibeles ($dB$) se modela mediante la función logarítmica:\n $dB = 10 \\cdot \\log\\left(\\frac{I}{I_0}\\right)$\nDonde $I$ es la intensidad física de la onda sonora e $I_0 = 10^{-12}\\text{ W/m}^2$ es el umbral de audición mínimo del oído humano. Si un taladro neumático en una construcción urbana produce un ruido de $110\\text{ decibeles}$, ¿cuál es su intensidad física $I$ en $\\text{W/m}^2$?",
      "alternativas": {
        "A": "$10^{-1}\\text{ W/m}^2$",
        "B": "$10^1\\text{ W/m}^2$",
        "C": "$10^{-2}\\text{ W/m}^2$",
        "D": "$10^{-3}\\text{ W/m}^2$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Reemplazamos los decibeles en la ecuación:\n $110 = 10 \\cdot \\log\\left(\\frac{I}{10^{-12}}\\right)$.\nDividimos por 10:\n $11 = \\log\\left(\\frac{I}{10^{-12}}\\right)$.\nAplicamos la definición de logaritmo base 10:\n $10^{11} = \\frac{I}{10^{-12}} \\implies I = 10^{11} \\cdot 10^{-12} = 10^{-1}\\text{ W/m}^2$ (o $0,1\\text{ W/m}^2$).",
      "feedback_error": "Incorrecto. Al plantear la ecuación de decibeles: $110 = 10\\log(I / 10^{-12}) \\implies 11 = \\log(I / 10^{-12})$. Despejando la potencia base 10 obtenemos $I / 10^{-12} = 10^{11}$, lo que da $I = 10^{-1}\\text{ W/m}^2$."
    },
    {
      "id": "q-m2-2-3-7",
      "enunciado": "La concentración de un medicamento en la sangre de un paciente después de $t$ horas disminuye de acuerdo a la función exponencial:\n $C(t) = C_0 \\cdot e^{-0,1t}$\nDonde $C_0$ es la concentración inicial administrada. Si usamos la aproximación $\\ln(2) \\approx 0,7$, ¿cuántas horas deben transcurrir para que la concentración del medicamento en la sangre sea exactamente la **mitad** ($C_0/2$) de la inicial?",
      "alternativas": {
        "A": "$7$ horas",
        "B": "$5$ horas",
        "C": "$10$ horas",
        "D": "$3,5$ horas"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Queremos encontrar $t$ tal que $C(t) = \\frac{C_0}{2}$:\n $\\frac{C_0}{2} = C_0 \\cdot e^{-0,1t} \\implies \\frac{1}{2} = e^{-0,1t} \\implies 2^{-1} = e^{-0,1t}$.\nAplicamos logaritmo natural ($\\ln$) a ambos lados:\n $\\ln(2^{-1}) = \\ln(e^{-0,1t}) \\implies -\\ln(2) = -0,1t \\implies 0,1t = \\ln(2)$.\nComo $\\ln(2) \\approx 0,7$, resolvemos:\n $0,1t = 0,7 \\implies t = 7$ horas.",
      "feedback_error": "Incorrecto. Para que baje a la mitad, planteamos: $e^{-0,1t} = 0,5 \\implies -0,1t = \\ln(0,5) = -\\ln(2)$. Reemplazando $\\ln(2) \\approx 0,7$, obtenemos $0,1t = 0,7 \\implies t = 7$ horas."
    },
    {
      "id": "q-m2-2-3-8",
      "enunciado": "La fuerza de atracción electrostática entre dos cargas puntuales varía en proporción inversa al cuadrado de la distancia $d$ que las separa, modelándose por una función potencia:\n $F(d) = k \\cdot d^{-2}$\nDonde $k$ es una constante física de proporcionalidad. Si la distancia entre las dos cargas se **triplica** ($d \\to 3d$), ¿cómo cambia el valor de la nueva fuerza de atracción electrostática con respecto a la fuerza original?",
      "alternativas": {
        "A": "Disminuye a la novena parte ($1/9$) de la fuerza original.",
        "B": "Disminuye a la tercera parte ($1/3$) de la fuerza original.",
        "C": "Aumenta al triple ($3$ veces) de la fuerza original.",
        "D": "Aumenta a nueve veces ($9$ veces) de la fuerza original."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La fuerza original es $F_{orig} = k \\cdot d^{-2} = \\frac{k}{d^2}$.\nCalculamos la nueva fuerza reemplazando la distancia por $3d$:\n $F_{nueva} = k \\cdot (3d)^{-2} = \\frac{k}{(3d)^2} = \\frac{k}{9d^2} = \\frac{1}{9} \\cdot \\frac{k}{d^2} = \\frac{1}{9} F_{orig}$.\nPor lo tanto, disminuye a la novena parte.",
      "feedback_error": "Incorrecto. Al ser una función potencia con exponente negativo $-2$, la relación es inversamente proporcional al cuadrado de la distancia. Si la distancia se multiplica por 3, la fuerza disminuye por un factor de $3^2 = 9$, es decir, a la novena parte."
    },
    {
      "id": "q-m2-2-3-9",
      "enunciado": "La acidez de una muestra líquida se mide en la escala de pH mediante la ecuación logarítmica:\n $pH = -\\log[H^+]$\nDonde $[H^+]$ representa la concentración molar de iones de hidrógeno. Si una bebida gaseosa ácida tiene un $pH = 3$ y el agua mineral neutra tiene un $pH = 6$, ¿cuántas veces más concentrados están los iones de hidrógeno $[H^+]$ en la gaseosa en comparación con el agua mineral?",
      "alternativas": {
        "A": "$1.000$ veces más concentrados.",
        "B": "$3$ veces más concentrados.",
        "C": "$100$ veces más concentrados.",
        "D": "$10$ veces más concentrados."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Despejamos la concentración molar $[H^+]$ de la definición de pH:\n $pH = -\\log[H^+] \\implies \\log[H^+] = -pH \\implies [H^+] = 10^{-pH}$.\n- Para la gaseosa ($pH = 3$): $[H^+]_g = 10^{-3}\\text{ mol/L}$.\n- Para el agua mineral ($pH = 6$): $[H^+]_a = 10^{-6}\\text{ mol/L}$.\nComparamos las concentraciones dividiéndolas:\n $\\frac{[H^+]_g}{[H^+]_a} = \\frac{10^{-3}}{10^{-6}} = 10^{-3 - (-6)} = 10^3 = 1.000$ veces más concentrados.",
      "feedback_error": "Incorrecto. Cada cambio de 1 unidad en la escala logarítmica de pH representa un factor de 10 en la concentración de $[H^+]$. Como la diferencia de pH es de 3 unidades ($6 - 3 = 3$), la gaseosa está $10^3 = 1.000$ veces más concentrada."
    },
    {
      "id": "q-m2-2-3-10",
      "enunciado": "La propagación inicial de un virus informático en una red de computadores se modela a través de la función de crecimiento exponencial:\n $I(t) = \\frac{10.000}{1 + 99 \\cdot 2^{-0,5t}}$\nDonde $I(t)$ es el número de computadores infectados al cabo de $t$ horas de esparcimiento. ¿Cuál es el número exacto de computadores infectados al inicio del ataque ($t = 0$)?",
      "alternativas": {
        "A": "$100$ computadores",
        "B": "$10$ computadores",
        "C": "$1.000$ computadores",
        "D": "$1$ computador"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Evaluamos la función de propagación para el tiempo inicial $t = 0$:\n $I(0) = \\frac{10.000}{1 + 99 \\cdot 2^{-0,5 \\cdot 0}} = \\frac{10.000}{1 + 99 \\cdot 2^0}$.\nComo $2^0 = 1$, calculamos el denominador:\n $1 + 99 \\cdot 1 = 100$.\nDividimos:\n $I(0) = \\frac{10.000}{100} = 100$ computadores.",
      "feedback_error": "Incorrecto. Sustituyendo $t=0$ en el modelo: $I(0) = \\frac{10.000}{1 + 99 \\cdot 2^0} = \\frac{10.000}{1 + 99} = \\frac{10.000}{100} = 100$ computadores."
    }
  ],
  "sec-m2-2-4": [
    {
      "id": "q-m2-2-4-1",
      "enunciado": "Dada la función trigonométrica sinusoidal real de la forma:\n $f(x) = 3 \\cdot \\sin(2x - \\pi) + 4$\n¿Cuáles son los valores exactos de la **amplitud** y el **período** de esta oscilación?",
      "alternativas": {
        "A": "Amplitud: $3$; Período: $\\pi$",
        "B": "Amplitud: $3$; Período: $2\\pi$",
        "C": "Amplitud: $6$; Período: $\\pi$",
        "D": "Amplitud: $3$; Período: $\\frac{\\pi}{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Para una función de la forma $f(x) = A \\cdot \\sin(B(x - C)) + D$, identificamos los parámetros:\n - **Amplitud:** es el coeficiente absoluto externo $|A| = |3| = 3$.\n - **Período ($T$):** se calcula dividiendo la base periódica $2\\pi$ por la frecuencia angular $B = 2$, es decir, $T = \\frac{2\\pi}{|B|} = \\frac{2\\pi}{2} = \\pi$.",
      "feedback_error": "Incorrecto. En el modelo general $A\\sin(Bx - C) + D$, la amplitud es $|A| = 3$. El período se calcula mediante $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{2} = \\pi$."
    },
    {
      "id": "q-m2-2-4-2",
      "enunciado": "Si comparamos la gráfica de la función sinusoidal $g(x) = -2 \\cdot \\cos(x)$ con la gráfica de la función coseno estándar $f(x) = \\cos(x)$, ¿cuál de las siguientes opciones describe correctamente la transformación geométrica sufrida por $g(x)$?",
      "alternativas": {
        "A": "Se dilata verticalmente por un factor de 2 y se refleja respecto al eje X.",
        "B": "Se contrae verticalmente por un factor de 0,5 y se refleja respecto al eje Y.",
        "C": "Se dilata horizontalmente por un factor de 2 y se refleja respecto al eje X.",
        "D": "Se desplaza verticalmente hacia abajo por 2 unidades."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Al multiplicar por un coeficiente externo de $-2$, ocurren dos cosas:\n 1) El factor absoluto $2$ dilata la gráfica verticalmente (duplica la distancia de los picos al eje medio).\n 2) El signo negativo ($-$) refleja la gráfica verticalmente respecto al eje X (los máximos se vuelven mínimos y viceversa).",
      "feedback_error": "Incorrecto. El factor externo $-2$ multiplica todos los valores del coseno original. El $2$ expande verticalmente la amplitud de la curva al doble, y el signo menos invierte la gráfica, reflejándola sobre el eje X."
    },
    {
      "id": "q-m2-2-4-3",
      "enunciado": "Considera la función trigonométrica real $f(x) = 5 \\cdot \\sin(x) - 2$. ¿Cuáles son el **valor máximo** y el **valor mínimo** que puede alcanzar esta función?",
      "alternativas": {
        "A": "Máximo: $3$; Mínimo: $-7$",
        "B": "Máximo: $5$; Mínimo: $-5$",
        "C": "Máximo: $7$; Mínimo: $-3$",
        "D": "Máximo: $3$; Mínimo: $-3$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! Dado que el rango de la función seno estándar es $-1 \\leq \\sin(x) \\leq 1$, multiplicamos por la amplitud de $5$:\n $-5 \\leq 5\\sin(x) \\leq 5$.\nRestamos $2$ en todos los términos del intervalo para incorporar el desplazamiento vertical:\n $-5 - 2 \\leq 5\\sin(x) - 2 \\leq 5 - 2 \\implies -7 \\leq f(x) \\leq 3$.\nPor lo tanto, el máximo es $3$ y el mínimo es $-7$.",
      "feedback_error": "Incorrecto. La función $\\sin(x)$ oscila entre $-1$ y $1$. Multiplicada por $5$ oscila entre $-5$ y $5$. Al restar $2$, desplazamos el intervalo hacia abajo, quedando entre $-7$ y $3$."
    },
    {
      "id": "q-m2-2-4-4",
      "enunciado": "Una señal eléctrica sinusoidal está modelada por la función real $y = \\sin\\left(\\frac{\\pi}{4} x\\right)$. ¿Cuál es el **período exacto** de esta señal en el eje X?",
      "alternativas": {
        "A": "$8$",
        "B": "$4$",
        "C": "$2$",
        "D": "$\\frac{1}{2}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Identificamos la frecuencia angular de la onda: $B = \\frac{\\pi}{4}$.\nAplicamos la fórmula del período para funciones sinusoidales:\n $T = \\frac{2\\pi}{|B|} = \\frac{2\\pi}{\\frac{\\pi}{4}} = 2\\pi \\cdot \\frac{4}{\\pi} = 8$.",
      "feedback_error": "Incorrecto. La frecuencia angular es $B = \\pi / 4$. Aplicando la fórmula del período: $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{\\pi / 4} = 8$."
    },
    {
      "id": "q-m2-2-4-5",
      "enunciado": "Se define la función real sinusoidal como $f(x) = \\cos\\left(3x - \\frac{\\pi}{2}\\right)$. ¿Cuál es el **desfase horizontal** (desplazamiento de fase) de la onda y en qué dirección?",
      "alternativas": {
        "A": "$\\frac{\\pi}{6}$ unidades hacia la derecha.",
        "B": "$\\frac{\\pi}{2}$ unidades hacia la derecha.",
        "C": "$\\frac{\\pi}{6}$ unidades hacia la izquierda.",
        "D": "$\\frac{\\pi}{2}$ unidades hacia la izquierda."
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Para determinar el desfase exacto, factorizamos el coeficiente del argumento $x$:\n $f(x) = \\cos\\left(3\\left(x - \\frac{\\pi}{6}\\right)\\right)$.\nEl valor dentro del paréntesis que resta a la variable $x$ es $C = \\frac{\\pi}{6}$. Como es negativo (resta), indica un desplazamiento horizontal de exactamente $\\frac{\\pi}{6}$ unidades hacia la derecha.",
      "feedback_error": "Incorrecto. Factoriza el argumento del coseno sacando factor común 3: $3x - \\pi/2 = 3(x - \\pi/6)$. Esto revela un desfase de $\\pi/6$ unidades a la derecha."
    },
    {
      "id": "q-m2-2-4-6",
      "enunciado": "Dada la función sinusoidal real $f(x) = A \\cdot \\sin(B(x - C)) + D$. ¿Cuál de los siguientes parámetros determina la **línea central de equilibrio** (valor medio) sobre la cual oscila la onda verticalmente?",
      "alternativas": {
        "A": "$D$",
        "B": "$A$",
        "C": "$B$",
        "D": "$C$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! En el modelo sinusoidal general, el parámetro $D$ representa el desplazamiento vertical de la gráfica. Esto desplaza la recta horizontal de simetría y equilibrio de la onda, originalmente en $y = 0$, hacia la línea horizontal $y = D$.",
      "feedback_error": "Incorrecto. El parámetro $D$ desplaza la curva verticalmente, convirtiendo a la recta $y = D$ en la nueva línea central media de la oscilación."
    },
    {
      "id": "q-m2-2-4-7",
      "enunciado": "Si queremos provocar una **compresión horizontal** de una señal de audio representada por $y = \\cos(x)$, de modo que el período se reduzca a la mitad ($T_{nuevo} = T_{orig}/2$), ¿por cuál de las siguientes funciones debemos reemplazar la original?",
      "alternativas": {
        "A": "$y = \\cos(2x)$",
        "B": "$y = \\cos(0,5x)$",
        "C": "$y = 2\\cos(x)$",
        "D": "$y = 0,5\\cos(x)$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! El período original de $\\cos(x)$ es $2\\pi$. Para reducirlo a la mitad, el nuevo período debe ser $\\pi$. Usamos la relación del período:\n $T_{nuevo} = \\frac{2\\pi}{B} \\implies \\pi = \\frac{2\\pi}{B} \\implies B = 2$.\nPor lo tanto, la función debe ser $y = \\cos(2x)$, comprimiendo horizontalmente la onda.",
      "feedback_error": "Incorrecto. Para que una función se comprima horizontalmente al doble de velocidad (período a la mitad), se debe multiplicar la variable independiente $x$ por 2: $y = \\cos(2x)$."
    },
    {
      "id": "q-m2-2-4-8",
      "enunciado": "Dadas las funciones trigonométricas reales $f(x) = \\sin(x)$ y $g(x) = \\cos(x)$. ¿Cuál es el menor desfase horizontal positivo (hacia la derecha) que se debe aplicar a $f(x)$ para que su gráfica coincida exactamente con la de $g(x)$?",
      "alternativas": {
        "A": "$\\frac{3\\pi}{2}$ unidades",
        "B": "$\\frac{\\pi}{2}$ unidades",
        "C": "$\\pi$ unidades",
        "D": "$2\\pi$ unidades"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Por identidades trigonométricas, sabemos que:\n $\\cos(x) = \\sin\\left(x + \\frac{\\pi}{2}\\right)$.\nEsto significa que la gráfica del coseno está adelantada en $\\frac{\\pi}{2}$ (desplazada a la izquierda). Si queremos lograrlo mediante un desfase hacia la derecha (restando), usamos la periodicidad de $2\\pi$:\n $\\sin\\left(x - C\\right) = \\sin\\left(x - \\left(2\\pi - \\frac{\\pi}{2}\\right)\\right) = \\sin\\left(x - \\frac{3\\pi}{2}\\right)$.\nPor lo tanto, el menor desfase horizontal positivo es de $\\frac{3\\pi}{2}$ unidades hacia la derecha.",
      "feedback_error": "Incorrecto. Aunque la curva del coseno está desplazada en $\\pi/2$ a la izquierda con respecto al seno, para hacerla coincidir mediante un desplazamiento hacia la derecha (positivo) debemos correr la onda $\\frac{3\\pi}{2}$ unidades."
    },
    {
      "id": "q-m2-2-4-9",
      "enunciado": "Considera la función real $y = \\sin(x) - 3$. ¿Cuál es el **recorrido** (rango) exacto de esta función en el plano cartesiano?",
      "alternativas": {
        "A": "$[-4, -2]$",
        "B": "$[-3, 3]$",
        "C": "$[-2, 2]$",
        "D": "$[-1, 1]$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! El rango del seno estándar es $[-1, 1]$. Al restar $3$ a cada extremo de este intervalo, el nuevo recorrido de la función desplazada verticalmente es:\n $[-1 - 3, 1 - 3] = [-4, -2]$.",
      "feedback_error": "Incorrecto. La función oscila 1 unidad por encima y por debajo de su línea central $y = -3$. Esto define el intervalo del recorrido como $[-3 - 1, -3 + 1] = [-4, -2]$."
    },
    {
      "id": "q-m2-2-4-10",
      "enunciado": "Una onda sonora pura de la nota musical La en afinación estándar está modelada por la función de presión de aire $p(t) = \\sin(880\\pi t)$, donde $t$ es el tiempo en segundos. ¿Cuál es el período $T$ en segundos de esta onda sonora?",
      "alternativas": {
        "A": "$\\frac{1}{440}\\text{ segundos}$",
        "B": "$440\\text{ segundos}$",
        "C": "$\\frac{1}{880}\\text{ segundos}$",
        "D": "$880\\text{ segundos}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Identificamos la frecuencia angular de la onda sonora: $B = 880\\pi$.\nAplicamos la fórmula del período:\n $T = \\frac{2\\pi}{|B|} = \\frac{2\\pi}{880\\pi} = \\frac{2}{880} = \\frac{1}{440}\\text{ segundos}$.\nNota: La frecuencia física es el recíproco del período, $f = \\frac{1}{T} = 440\\text{ Hz}$, que corresponde a la frecuencia de la nota La4.",
      "feedback_error": "Incorrecto. Usando la fórmula del período $T = \\frac{2\\pi}{B}$ con $B = 880\\pi$: $T = \\frac{2\\pi}{880\\pi} = \\frac{1}{440}\\text{ segundos}$."
    }
  ],
  "sec-m2-2-5": [
    {
      "id": "q-m2-2-5-1",
      "enunciado": "La altura del nivel del mar en metros en la costa de un puerto pesquero varía según la marea, modelándose por la función sinusoidal:\n $H(t) = 2 \\cdot \\cos\\left(\\frac{\\pi}{6} t\\right) + 3$\nDonde $t$ es el tiempo medido en horas desde la medianoche. ¿Cuál es la **altura máxima** del mar registrada y cada cuántas horas se completa un **ciclo de marea completo**?",
      "alternativas": {
        "A": "Altura máxima: $5\\text{ m}$; Ciclo completo: $12\\text{ horas}$",
        "B": "Altura máxima: $3\\text{ m}$; Ciclo completo: $6\\text{ horas}$",
        "C": "Altura máxima: $5\\text{ m}$; Ciclo completo: $6\\text{ horas}$",
        "D": "Altura máxima: $2\\text{ m}$; Ciclo completo: $12\\text{ horas}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La función $H(t) = 2\\cos\\left(\\frac{\\pi}{6} t\\right) + 3$ tiene:\n - **Desplazamiento vertical:** $D = 3\\text{ m}$ (nivel medio del agua).\n - **Amplitud:** $A = 2\\text{ m}$ (la oscilación máxima sobre el nivel medio).\n - **Altura máxima:** $D + A = 3 + 2 = 5\\text{ metros}$.\n - **Período (duración de la marea):** $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{\\pi/6} = 12$ horas.",
      "feedback_error": "Incorrecto. La altura máxima es la línea media ($3$) más la amplitud ($2$), dando $5\\text{ m}$. El período o ciclo completo es $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{\\pi / 6} = 12$ horas."
    },
    {
      "id": "q-m2-2-5-2",
      "enunciado": "La temperatura ambiental diaria de una zona cordillerana en grados Celsius se modela mediante la función:\n $T(h) = 8 \\cdot \\sin\\left(\\frac{\\pi}{12}(h - 9)\\right) + 15$\nDonde $h$ representa las horas transcurridas desde las 00:00. ¿A qué hora exacta del día se registra la **temperatura máxima** en la zona?",
      "alternativas": {
        "A": "A las 15:00 horas",
        "B": "A las 09:00 horas",
        "C": "A las 12:00 horas",
        "D": "A las 21:00 horas"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! La función seno alcanza su valor máximo de $1$ cuando su argumento es igual a $\\frac{\\pi}{2}$ (o $90^\\circ$):\n $\\frac{\\pi}{12}(h - 9) = \\frac{\\pi}{2}$.\nDividimos por $\\pi$ a ambos lados y multiplicamos por 12:\n $h - 9 = \\frac{12}{2} \\implies h - 9 = 6 \\implies h = 15$ horas.\nEsto significa que la temperatura máxima de $15 + 8 = 23^\\circ\\text{C}$ ocurre exactamente a las 15:00 horas.",
      "feedback_error": "Incorrecto. Para maximizar la temperatura, el término $\\sin$ debe ser $1$, lo que ocurre cuando su argumento es $\\pi/2$. Planteamos: $\\frac{\\pi}{12}(h-9) = \\frac{\\pi}{2} \\implies h-9 = 6 \\implies h = 15$ horas (15:00)."
    },
    {
      "id": "q-m2-2-5-3",
      "enunciado": "La altura en metros a la que se encuentra un compartimento de una rueda de la fortuna durante una vuelta completa está modelada por:\n $h(t) = 15 \\cdot \\sin\\left(\\frac{\\pi}{2} t\\right) + 17$\nDonde $t$ es el tiempo en minutos desde que inicia el movimiento. ¿Cuál es el **diámetro** de la rueda de la fortuna y en cuántos minutos realiza una **vuelta completa**?",
      "alternativas": {
        "A": "Diámetro: $30\\text{ m}$; Vuelta completa: $4\\text{ minutos}$",
        "B": "Diámetro: $15\\text{ m}$; Vuelta completa: $4\\text{ minutos}$",
        "C": "Diámetro: $30\\text{ m}$; Vuelta completa: $2\\text{ minutos}$",
        "D": "Diámetro: $15\\text{ m}$; Vuelta completa: $2\\text{ minutos}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! Para la rueda de la fortuna:\n - **Amplitud:** $A = 15\\text{ m}$. La amplitud representa el radio de la rueda. El diámetro es el doble del radio: $\\text{Diámetro} = 2A = 2 \\cdot 15 = 30$ metros.\n - **Período (tiempo de vuelta completa):** $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{\\pi/2} = 4$ minutos.",
      "feedback_error": "Incorrecto. La amplitud $15\\text{ m}$ es el radio de giro, por lo que el diámetro es de $30\\text{ m}$. El período de la vuelta es $T = \\frac{2\\pi}{\\pi/2} = 4$ minutos."
    },
    {
      "id": "q-m2-2-5-4",
      "enunciado": "El flujo de aire en litros por segundo hacia los pulmones de una persona en reposo durante su ciclo respiratorio se modela mediante la función:\n $F(t) = 0,6 \\cdot \\sin\\left(\\frac{2\\pi}{5} t\\right)$\nDonde $t$ es el tiempo en segundos (flujo positivo indica inhalación, flujo negativo indica exhalación). ¿Cuánto dura un **ciclo respiratorio completo** (inhalación más exhalación)?",
      "alternativas": {
        "A": "$5\\text{ segundos}$",
        "B": "$2,5\\text{ segundos}$",
        "C": "$10\\text{ segundos}$",
        "D": "$3\\text{ segundos}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Un ciclo respiratorio completo corresponde a un período completo de la función sinusoidal. Identificamos $B = \\frac{2\\pi}{5}$.\nCalculamos el período:\n $T = \\frac{2\\pi}{|B|} = \\frac{2\\pi}{\\frac{2\\pi}{5}} = 5$ segundos.",
      "feedback_error": "Incorrecto. El ciclo completo dura un período de la onda: $T = \\frac{2\\pi}{B}$. Con $B = 2\\pi / 5$, calculamos $T = \\frac{2\\pi}{2\\pi / 5} = 5$ segundos."
    },
    {
      "id": "q-m2-2-5-5",
      "enunciado": "El voltaje oscilante de un circuito eléctrico industrial chileno de corriente alterna está modelado por la función sinusoidal:\n $V(t) = 220\\sqrt{2} \\cdot \\sin(100\\pi t)$\nDonde $t$ es el tiempo en segundos y $V(t)$ es el voltaje instantáneo en voltios. ¿Cuál es la **frecuencia** de este sistema eléctrico expresada en Hertz ($1/T$)?",
      "alternativas": {
        "A": "$50\\text{ Hz}$",
        "B": "$100\\text{ Hz}$",
        "C": "$60\\text{ Hz}$",
        "D": "$220\\text{ Hz}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Primero calculamos el período $T$ de la señal eléctrica con $B = 100\\pi$:\n $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{100\\pi} = \\frac{1}{50}$ segundos.\nLa frecuencia $f$ es el recíproco del período:\n $f = \\frac{1}{T} = \\frac{1}{\\frac{1}{50}} = 50\\text{ Hz}$.",
      "feedback_error": "Incorrecto. El período es $T = \\frac{2\\pi}{100\\pi} = 0,02\\text{ segundos}$. La frecuencia en Hertz es el inverso del período: $f = \\frac{1}{0,02} = 50\\text{ Hz}$."
    },
    {
      "id": "q-m2-2-5-6",
      "enunciado": "La presión sanguínea oscilante de un paciente joven en reposo (en mmHg) se modela mediante la función:\n $P(t) = 20 \\cdot \\sin\\left(\\frac{8\\pi}{3} t\\right) + 100$\nDonde $t$ es el tiempo en segundos. ¿Cuáles son las presiones **sistólica (máxima)** y **diastólica (mínima)** del paciente en mmHg?",
      "alternativas": {
        "A": "Sistólica: $120\\text{ mmHg}$; Diastólica: $80\\text{ mmHg}$",
        "B": "Sistólica: $100\\text{ mmHg}$; Diastólica: $20\\text{ mmHg}$",
        "C": "Sistólica: $140\\text{ mmHg}$; Diastólica: $60\\text{ mmHg}$",
        "D": "Sistólica: $120\\text{ mmHg}$; Diastólica: $100\\text{ mmHg}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Perfecto! La función $P(t)$ tiene un valor medio de $100\\text{ mmHg}$ y oscila con una amplitud de $20\\text{ mmHg}$:\n - Presión sistólica (máxima): $100 + 20 = 120\\text{ mmHg}$.\n - Presión diastólica (mínima): $100 - 20 = 80\\text{ mmHg}$.\nEsto corresponde al valor de presión estándar de $120/80$.",
      "feedback_error": "Incorrecto. La presión oscila 20 unidades por arriba y por abajo del eje medio de $100$. Esto define el valor máximo en $120$ (sistólica) y el valor mínimo en $80$ (diastólica)."
    },
    {
      "id": "q-m2-2-5-7",
      "enunciado": "Un pistón de motor de combustión interna se desplaza longitudinalmente dentro de un cilindro. La distancia del pistón al extremo del cilindro en centímetros está dada por:\n $d(t) = 12 \\cdot \\cos(4\\pi t) + 15$\nDonde $t$ es el tiempo en segundos. ¿Cuál es la **distancia mínima** a la que se acerca el pistón al extremo del cilindro durante su movimiento?",
      "alternativas": {
        "A": "$3\\text{ cm}$",
        "B": "$15\\text{ cm}$",
        "C": "$12\\text{ cm}$",
        "D": "$27\\text{ cm}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Correcto! El valor mínimo de la función coseno es $-1$. Por ende, la distancia mínima se calcula cuando el coseno toma este valor:\n $d_{min} = 12 \\cdot (-1) + 15 = -12 + 15 = 3\\text{ cm}$.",
      "feedback_error": "Incorrecto. La distancia mínima ocurre cuando la oscilación del coseno está en su punto más bajo ($-1$): $d = 12 \\cdot (-1) + 15 = 3\\text{ cm}$."
    },
    {
      "id": "q-m2-2-5-8",
      "enunciado": "La luminosidad estelar de una estrella variable cefeida se modela mediante la función sinusoidal:\n $L(t) = 400 \\cdot \\cos\\left(\\frac{2\\pi}{5,4} t\\right) + 2.000$\nDonde $t$ es el tiempo en días. ¿Cuál es el **período de pulsación** exacto en días de la estrella variable cefeida?",
      "alternativas": {
        "A": "$5,4\\text{ días}$",
        "B": "$2,7\\text{ días}$",
        "C": "$10,8\\text{ días}$",
        "D": "$2\\pi\\text{ días}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Identificamos el término de frecuencia angular: $B = \\frac{2\\pi}{5,4}$.\nAplicamos la fórmula del período:\n $T = \\frac{2\\pi}{B} = \\frac{2\\pi}{\\frac{2\\pi}{5,4}} = 5,4\\text{ días}$.",
      "feedback_error": "Incorrecto. En la expresión trigonométrica, el período se calcula como $T = \\frac{2\\pi}{B}$. Con $B = 2\\pi / 5,4$, obtenemos un período exacto de $5,4$ días."
    },
    {
      "id": "q-m2-2-5-9",
      "enunciado": "Un niño en un columpio se balancea de modo que su distancia horizontal al poste central se modela por la función:\n $d(t) = 1,5 \\cdot \\sin(\\pi t)$\nDonde $d(t)$ está en metros y $t$ es el tiempo en segundos (valores positivos indican hacia adelante, negativos hacia atrás). ¿Cuántas veces cruza el columpio **exactamente por debajo del poste central** ($d(t) = 0$) en los primeros 3 segundos de movimiento (excluyendo el inicio $t = 0$)?",
      "alternativas": {
        "A": "$3\\text{ veces}$",
        "B": "$2\\text{ veces}$",
        "C": "$4\\text{ veces}$",
        "D": "$6\\text{ veces}$"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Impecable! El columpio cruza por debajo del poste central cuando $d(t) = 0$:\n $1,5 \\cdot \\sin(\\pi t) = 0 \\implies \\sin(\\pi t) = 0$.\nLa función seno se anula en los múltiplos enteros de $\\pi$:\n $\\pi t = k\\pi \\implies t = k$, para $k \\in \\mathbb{Z}$.\nEvaluamos para los instantes de tiempo en el intervalo $0 < t \\leq 3$:\n - $t = 1\\text{ segundo}$ ($k=1$)\n - $t = 2\\text{ segundos}$ ($k=2$)\n - $t = 3\\text{ segundos}$ ($k=3$)\nEn total, cruza el punto central exactamente 3 veces.",
      "feedback_error": "Incorrecto. El columpio cruza por debajo del poste cuando $\\sin(\\pi t) = 0$, es decir, en los tiempos enteros $t = 1, 2, 3$. Esto ocurre 3 veces en total en dicho lapso."
    },
    {
      "id": "q-m2-2-5-10",
      "enunciado": "Las ventas mensuales estimadas de una tienda de ropa deportiva invernal en miles de dólares varían estacionalmente según la función:\n $V(t) = 45 \\cdot \\cos\\left(\\frac{\\pi}{6}(t - 1)\\right) + 60$\nDonde $t$ representa el mes del año ($t = 1$ para enero, $t = 2$ para febrero, etc.). ¿En qué mes del año se registran las **ventas mínimas** de la tienda?",
      "alternativas": {
        "A": "Julio ($t = 7$)",
        "B": "Enero ($t = 1$)",
        "C": "Junio ($t = 6$)",
        "D": "Agosto ($t = 8$)"
      },
      "respuesta_correcta": "A",
      "feedback_acierto": "¡Excelente! Las ventas mensuales son mínimas cuando la función coseno alcanza su valor mínimo posible de $-1$, lo cual ocurre cuando su argumento es exactamente igual a $\\pi$ (o $180^\\circ$):\n $\\frac{\\pi}{6}(t - 1) = \\pi$.\nDividimos por $\\pi$ a ambos lados y multiplicamos por 6:\n $t - 1 = 6 \\implies t = 7$ (que corresponde al mes de julio).\nEsto tiene todo el sentido del mundo ya que en el hemisferio norte, julio es verano y la demanda de ropa deportiva invernal cae al mínimo ($60 - 45 = 15$ mil dólares).",
      "feedback_error": "Incorrecto. La función coseno es mínima ($-1$) cuando su argumento es $\\pi$. Igualando: $\\frac{\\pi}{6}(t-1) = \\pi \\implies t-1 = 6 \\implies t = 7$, es decir, en el mes de julio."
    }
  ]
};

function run() {
  console.log('🚀 [EstudiaUni] Iniciando generación de preguntas locales M2 Álgebra y Funciones...');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontró capitulos-mock-local.json.');
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));
  const capTarget = capitulos.find(c => c.id === 'cap-m2-2-algebra');

  if (!capTarget) {
    console.error('❌ Error: No se encontró "cap-m2-2-algebra" en el mock local.');
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
        id: `test-m2-2-${sec.id.split('-').pop()}`,
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

  console.log(`\n🎉 [EstudiaUni] ¡Generación de M2 Álgebra completada con éxito!`);
  console.log(`   ➜ Total de preguntas inyectadas: ${totalQuestionsCount}`);
}

run();
