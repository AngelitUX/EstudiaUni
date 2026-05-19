import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

// 8 pasos (secciones) de Números con 10 preguntas complejas cada uno (Total: 80 preguntas)
const TESTS_DATA = [
  {
    id: "test-m1-1-1",
    seccionId: "sec-m1-1-1",
    contexto_base: "",
    preguntas: [
      {
        id: 10101,
        enunciado:
          "¿Cuál es el resultado de evaluar la expresión: $-5 - [-3 \\cdot (4 - |-7|)] - (-8) \\div 2$?",
        alternativas: { A: "$10$", B: "$-6$", C: "$-18$", D: "$-10$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Excelente! Aplicaste de forma impecable el valor absoluto, los signos y la jerarquía PAPOMUDAS.",
        feedback_error:
          "Paso a paso: \n1. Valor absoluto: $|-7| = 7$. \n2. Paréntesis: $(4 - 7) = -3$. \n3. Corchetes: $[-3 \\cdot (-3)] = +9$. \n4. División: $(-8) \\div 2 = -4$. \n5. Reemplazando todo: $-5 - [9] - (-4) = -5 - 9 + 4 = -10$.",
      },
      {
        id: 10102,
        enunciado:
          "Si $a$ es un número entero par negativo y $b$ es un entero impar negativo, ¿cuál de las siguientes expresiones es siempre un número **entero positivo par**?",
        alternativas: {
          A: "$a^2 - b$",
          B: "$a \\cdot b$",
          C: "$a + b$",
          D: "$3a \\cdot b^2$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! El producto de dos números negativos es positivo, y el producto de cualquier entero por un par siempre es par.",
        feedback_error:
          "Análisis: \n- $a$ es par negativo, ej: $-2$. $b$ es impar negativo, ej: $-3$. \n- $a \\cdot b = (-2) \\cdot (-3) = 6$ (positivo y par). \n- En general, $a = 2k$ y $b = 2m+1$. Su producto es $a \\cdot b = 2k(2m+1) = 2[k(2m+1)]$, lo cual tiene un factor $2$ y es siempre par. Como ambos son negativos, su producto es positivo.",
      },
      {
        id: 10103,
        enunciado:
          "Sea $x$ un número entero tal que $-15 < 2x - 3 \\leq 5$. ¿Cuántos valores enteros distintos puede tomar la variable $x$?",
        alternativas: { A: "$10$", B: "Infinitos", C: "$9$", D: "$11$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Espectacular! Resolviste la inecuación doble y contaste correctamente los enteros permitidos.",
        feedback_error:
          "Paso a paso: \n1. Sumamos $3$ a todos los lados: $-15 + 3 < 2x \\leq 5 + 3 \\implies -12 < 2x \\leq 8$. \n2. Dividimos por $2$: $-6 < x \\leq 4$. \n3. Los valores enteros que cumplen esto son: $-5, -4, -3, -2, -1, 0, 1, 2, 3, 4$. \n4. Contando estos elementos obtenemos exactamente $10$ valores enteros.",
      },
      {
        id: 10104,
        enunciado:
          "Determina el antecesor del sucesor par de $-9$ en la recta numérica.",
        alternativas: { A: "$-9$", B: "$-7$", C: "$-8$", D: "$-10$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Correcto! Comprendes de manera exacta las definiciones de antecesor y sucesor en números negativos.",
        feedback_error:
          "Paso a paso: \n1. El sucesor par de $-9$ es el número par inmediatamente mayor que él, el cual es $-8$. \n2. El antecesor de $-8$ es el número entero inmediatamente menor (a su izquierda), el cual es $-9$.",
      },
      {
        id: 10105,
        enunciado:
          "Si $A = -2$, $B = -3$ y $C = 4$, ¿cuál es el valor de la expresión $A^3 - B^2 \\cdot C$?",
        alternativas: { A: "$-44$", B: "$28$", C: "$44$", D: "$-28$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Bien hecho! Tuviste excelente cuidado con los signos al elevar bases negativas a potencias impares y pares.",
        feedback_error:
          "Paso a paso: \n1. Evaluamos las potencias: $A^3 = (-2)^3 = -8$. $B^2 = (-3)^2 = 9$. \n2. Sustituimos: $-8 - (9 \\cdot 4)$. \n3. Multiplicamos primero: $9 \\cdot 4 = 36$. \n4. Restamos: $-8 - 36 = -44$.",
      },
      {
        id: 10106,
        enunciado:
          "La suma de tres números enteros consecutivos es $-18$. ¿Cuál es el producto del menor y el mayor de estos tres números?",
        alternativas: { A: "$-35$", B: "$30$", C: "$35$", D: "$42$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente planteamiento algebraico y operatoria de enteros!",
        feedback_error:
          "Paso a paso: \n1. Definimos los números como $x-1$, $x$, y $x+1$. \n2. Sumamos: $(x-1) + x + (x+1) = -18 \\implies 3x = -18 \\implies x = -6$. \n3. Los tres números consecutivos son $-7$, $-6$, y $-5$. \n4. El menor es $-7$ y el mayor es $-5$. \n5. Su producto es $-7 \\cdot -5 = 35$.",
      },
      {
        id: 10107,
        enunciado:
          "¿Cuál es el resultado final de la siguiente operación combinada: $-48 \\div [6 \\cdot (-2) - (-4)] + 3 \\cdot (-2)$?",
        alternativas: { A: "$0$", B: "$-6$", C: "$12$", D: "$-12$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Excelente! Priorizaste correctamente el corchete antes de dividir.",
        feedback_error:
          "Paso a paso: \n1. Dentro del corchete: $6 \\cdot (-2) = -12$. \n2. Corchete simplificado: $-12 - (-4) = -12 + 4 = -8$. \n3. División: $-48 \\div (-8) = 6$. \n4. Multiplicación a la derecha: $3 \\cdot (-2) = -6$. \n5. Operación final: $6 + (-6) = 0$.",
      },
      {
        id: 10108,
        enunciado:
          "Definimos la operación binaria $\\otimes$ en los enteros como: $a \\otimes b = a^2 - ab - b^2$. ¿Cuál es el valor de $-3 \\otimes (-2)$?",
        alternativas: { A: "$-11$", B: "$7$", C: "$11$", D: "$-1$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Buenísimo! Reemplazaste y operaste con precisión respetando los signos negativos.",
        feedback_error:
          "Paso a paso: \n1. Reemplazamos $a = -3$ y $b = -2$: \n$(-3)^2 - (-3)(-2) - (-2)^2$ \n2. Evaluamos potencias: $(-3)^2 = 9$. $(-2)^2 = 4$. \n3. Evaluamos producto central: $-(-3 \\cdot -2) = -(6) = -6$. \n4. Juntamos: $9 - 6 - 4 = 3 - 4 = -1$.",
      },
      {
        id: 10109,
        enunciado:
          "Si $x$ es el inverso aditivo de $-8$ e $y$ es el opuesto del sucesor de $-5$, ¿cuánto vale la resta $x - y$?",
        alternativas: { A: "$2$", B: "$12$", C: "$4$", D: "$-4$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Correcto! Comprendes a la perfección el inverso aditivo y el opuesto en los enteros.",
        feedback_error:
          "Paso a paso: \n1. Inverso aditivo de $-8$ es $8$, por lo tanto $x = 8$. \n2. El sucesor de $-5$ es $-4$. Su opuesto es $4$, por lo tanto $y = 4$. \n3. Evaluamos la resta: $x - y = 8 - 4 = 4$.",
      },
      {
        id: 10110,
        enunciado:
          "Cuatro alumnos evalúan la expresión $p - q \\cdot r$. El ganador es quien obtiene el menor valor. Si los valores asignados son $p = -12$, $q = -3$, y $r = -5$, ¿cuál es el resultado que determina al ganador?",
        alternativas: { A: "$-3$", B: "$27$", C: "$-27$", D: "$3$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Recordaste que la multiplicación va antes que la resta, evitando caer en la trampa del orden visual.",
        feedback_error:
          "Paso a paso: \n1. Expresión: $p - q \\cdot r \\implies -12 - (-3) \\cdot (-5)$. \n2. Primero multiplicamos: $-3 \\cdot -5 = +15$ (o bien $q \\cdot r = -3 \\cdot -5 = 15$). \n3. Sustituimos en la resta: $-12 - 15 = -27$.",
      },
    ],
  },
  {
    id: "test-m1-1-2",
    seccionId: "sec-m1-1-2",
    contexto_base: "",
    preguntas: [
      {
        id: 10201,
        enunciado:
          "Calcula el resultado exacto de la expresión: $\\frac{2}{3} - \\frac{3}{4} \\div (\\frac{1}{2} + \\frac{1}{3})$",
        alternativas: {
          A: "$\\frac{7}{30}$",
          B: "$\\frac{3}{10}$",
          C: "$\\frac{-7}{30}$",
          D: "$\\frac{-3}{10}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Espectacular! Resolviste la suma del paréntesis con MCM y luego aplicaste la división antes de la resta.",
        feedback_error:
          "Paso a paso: \n1. Paréntesis: $\\frac{1}{2} + \\frac{1}{3} = rac{3+2}{6} = \\frac{5}{6}$. \n2. División: $\\frac{3}{4} \\div \\frac{5}{6} = \\frac{3}{4} \\cdot \\frac{6}{5} = \\frac{18}{20} = \\frac{9}{10}$. \n3. Resta: $\\frac{2}{3} - \\frac{9}{10} = \\frac{20 - 27}{30} = \\frac{-7}{30}$.",
      },
      {
        id: 10202,
        enunciado:
          "Transforma el número decimal semiperiódico $1,4\\overline{6}$ a su fracción irreductible.",
        alternativas: {
          A: "$\\frac{73}{50}$",
          B: "$\\frac{146}{90}$",
          C: "$\\frac{22}{15}$",
          D: "$\\frac{11}{15}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Extraordinario! Dominas perfectamente la transformación de decimales semiperiódicos a fracción.",
        feedback_error:
          "Paso a paso: \n1. Numerador: Escribimos el número completo sin coma y le restamos la parte no periódica: $146 - 14 = 132$. \n2. Denominador: Ponemos tantos nueves como cifras periódicas (un 9) y tantos ceros como cifras anteperiódicas (un 0): $90$. \n3. Fracción obtenida: $\\frac{132}{90}$. \n4. Simplificando por 6: $\\frac{132 \\div 6}{90 \\div 6} = \\frac{22}{15}$.",
      },
      {
        id: 10203,
        enunciado:
          "Ordena de menor a mayor los siguientes números racionales: $x = \\frac{7}{12}$, $y = 0,58$, y $z = \\frac{11}{18}$.",
        alternativas: {
          A: "$y < x < z$",
          B: "$x < y < z$",
          C: "$x < z < y$",
          D: "$y < z < x$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Estupendo! Convertiste todo a una misma base decimal o comparaste mediante igualación de denominadores.",
        feedback_error:
          "Paso a paso: \n1. Expresamos en decimales aproximados: \n- $x = \\frac{7}{12} \\approx 0,5833...$ \n- $y = 0,58 = 0,5800$ \n- $z = \\frac{11}{18} \\approx 0,6111...$ \n2. Comparando: $0,5800 < 0,5833... < 0,6111...$ \n3. Por lo tanto: $y < x < z$.",
      },
      {
        id: 10204,
        enunciado:
          "¿Cuál de las siguientes relaciones de orden es CORRECTA respecto a los decimales periódicos $A = 0,\\overline{72}$ y $B = 0,7\\overline{2}$?",
        alternativas: {
          A: "$A + B = 1,45$",
          B: "$A < B$",
          C: "$A = B$",
          D: "$A > B$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Al expandir las cifras decimales, comparaste dígito por dígito a partir de las milésimas.",
        feedback_error:
          "Paso a paso: \n1. Expandimos decimales para comparar: \n- $A = 0,727272...$ \n- $B = 0,722222...$ \n2. Primer decimal: Ambos tienen $7$. \n3. Segundo decimal: Ambos tienen $2$. \n4. Tercer decimal (milésimas): $A$ tiene $7$, mientras que $B$ tiene $2$. \n5. Como $7 > 2$, entonces $A > B$.",
      },
      {
        id: 10205,
        enunciado:
          "Determina el valor de la expresión: $(\\frac{2}{3})^{-2} - (\\frac{3}{2})^2$",
        alternativas: {
          A: "$\\frac{9}{4}$",
          B: "$\\frac{81}{16}$",
          C: "$0$",
          D: "$1$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Comprendes que elevar a un exponente negativo equivale a invertir la base.",
        feedback_error:
          "Paso a paso: \n1. Invertimos la base para el exponente negativo: $(\\frac{2}{3})^{-2} = (\\frac{3}{2})^2$. \n2. Evaluamos: $(\\frac{3}{2})^2 = \\frac{9}{4}$. \n3. Restamos: $\\frac{9}{4} - \\frac{9}{4} = 0$.",
      },
      {
        id: 10206,
        enunciado:
          "¿Cuál es el resultado de dividir $\\frac{5}{6}$ por el inverso multiplicativo de $\\frac{3}{10}$?",
        alternativas: {
          A: "$\\frac{4}{1}$",
          B: "$\\frac{25}{9}$",
          C: "$\\frac{9}{25}$",
          D: "$\\frac{1}{4}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Muy bien pensado! Identificaste correctamente el inverso multiplicativo antes de hacer la división.",
        feedback_error:
          "Paso a paso: \n1. El inverso multiplicativo de $\\frac{3}{10}$ es $\\frac{10}{3}$. \n2. Dividimos: $\\frac{5}{6} \\div \\frac{10}{3}$. \n3. Multiplicamos por la fracción invertida: $\\frac{5}{6} \\cdot \\frac{3}{10} = \\frac{15}{60}$. \n4. Simplificando por 15: $\\frac{15 \\div 15}{60 \\div 15} = \\frac{1}{4}$.",
      },
      {
        id: 10207,
        enunciado:
          "Un termómetro industrial registra una variación de temperatura de $0,35^{\\circ}\\text{C}$, y posteriormente otra de $\\frac{3}{8}^{\\circ}\\text{C}$. ¿Cuál es la variación total expresada en fracción?",
        alternativas: {
          A: "$\\frac{3}{80}$",
          B: "$\\frac{38}{100}$",
          C: "$\\frac{29}{40}$",
          D: "$\\frac{7}{20}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Correcto! Sumaste las variaciones tras convertir el decimal finito a fracción.",
        feedback_error:
          "Paso a paso: \n1. Transformamos $0,35$ a fracción: $\\frac{35}{100} = \\frac{7}{20}$. \n2. Planteamos la suma: $\\frac{7}{20} + \\frac{3}{8}$. \n3. El MCM entre $20$ y $8$ es $40$. \n4. Amplificamos: $\\frac{14}{40} + \\frac{15}{40} = \\frac{29}{40}$.",
      },
      {
        id: 10208,
        enunciado:
          "Al simplificar la expresión compleja: $\\frac{0,\\overline{5}}{0,2\\overline{7}}$ se obtiene:",
        alternativas: {
          A: "$2$",
          B: "$\\frac{1}{2}$",
          C: "$\\frac{5}{27}$",
          D: "$1,8$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Excelente! Convertir ambos decimales infinitos a fracción te facilitó la operatoria.",
        feedback_error:
          "Paso a paso: \n1. Numerador: $0,\\overline{5} = \\frac{5}{9}$. \n2. Denominador: $0,2\\overline{7} = \\frac{27-2}{90} = \\frac{25}{90} = \\frac{5}{18}$. \n3. Dividimos: $\\frac{5}{9} \\div \\frac{5}{18} = \\frac{5}{9} \\cdot \\frac{18}{5} = \\frac{18}{9} = 2$.",
      },
      {
        id: 10209,
        enunciado:
          "¿Cuál de las siguientes fracciones se encuentra estrictamente en el intervalo $]\\frac{2}{5}, \\frac{1}{2}[$?",
        alternativas: {
          A: "$\\frac{2}{3}$",
          B: "$\\frac{9}{20}$",
          C: "$\\frac{3}{10}$",
          D: "$\\frac{11}{20}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Buscaste un común denominador (20) para comparar los extremos de forma inequívoca.",
        feedback_error:
          "Paso a paso: \n1. Convertimos los extremos a denominador 20: \n- $\\frac{2}{5} = \\frac{8}{20} = 0,4$ \n- $\\frac{1}{2} = \\frac{10}{20} = 0,5$ \n2. El intervalo buscado es $]\\frac{8}{20}, \\frac{10}{20}[$. \n3. La fracción $\\frac{9}{20}$ (que equivale a $0,45$) calza perfectamente en medio.",
      },
      {
        id: 10210,
        enunciado:
          "Si $a = \\frac{1}{3}$ y $b = 0,25$, calcula la razón de su suma frente a su diferencia: $\\frac{a + b}{a - b}$",
        alternativas: {
          A: "$\\frac{1}{7}$",
          B: "$\\frac{7}{12}$",
          C: "$7$",
          D: "$-7$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Gran logro! Operaste sumas y restas de fracciones complejas y resolviste la división de forma ordenada.",
        feedback_error:
          "Paso a paso: \n1. Convertimos $b = 0,25 = \\frac{1}{4}$. \n2. Suma (numerador): $\\frac{1}{3} + \\frac{1}{4} = \\frac{4 + 3}{12} = \\frac{7}{12}$. \n3. Resta (denominador): $\\frac{1}{3} - \\frac{1}{4} = \\frac{4 - 3}{12} = \\frac{1}{12}$. \n4. División: $\\frac{7}{12} \\div \\frac{1}{12} = \\frac{7}{12} \\cdot \\frac{12}{1} = 7$.",
      },
    ],
  },
  {
    id: "test-m1-1-3",
    seccionId: "sec-m1-1-3",
    contexto_base: "",
    preguntas: [
      {
        id: 10301,
        enunciado:
          "Un estanque de agua se llena completamente con un grifo A en $4$ horas y se vacía completamente con un desagüe B en $6$ horas. Si el estanque está inicialmente vacío y se abren ambos conductos de forma simultánea, ¿qué fracción del estanque se habrá llenado al cabo de $2$ horas?",
        alternativas: {
          A: "$\\frac{1}{12}$",
          B: "$\\frac{2}{3}$",
          C: "$\\frac{1}{6}$",
          D: "$\\frac{1}{2}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Espectacular! Comprendes cómo sumar ritmos de trabajo opuestos (llenado + vaciado) usando fracciones.",
        feedback_error:
          "Paso a paso: \n1. Ritmo de llenado de A: $\\frac{1}{4}$ del estanque por hora. \n2. Ritmo de vaciado de B: $-\\frac{1}{6}$ del estanque por hora. \n3. Ritmo conjunto: $\\frac{1}{4} - \\frac{1}{6} = \\frac{3 - 2}{12} = \\frac{1}{12}$ del estanque por hora. \n4. En 2 horas se llenará: $2 \\cdot \\frac{1}{12} = \\frac{2}{12} = \\frac{1}{6}$ del estanque.",
      },
      {
        id: 10302,
        enunciado:
          "Un comerciante compra $120$ artículos a \\$1.500 cada uno. Vende la tercera parte a \\$2.000 la unidad, las tres quintas partes del total a \\$2.500 la unidad, y el resto a \\$1.200 cada uno. ¿Cuál fue su ganancia o pérdida neta total?",
        alternativas: {
          A: "Ganancia de \\$120.000",
          B: "Ganancia de \\$89.600",
          C: "Ganancia de \\$69.600",
          D: "Pérdida de \\$10,400",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Excelente cálculo! Desglosaste la venta en partes utilizando fracciones y restaste la inversión inicial con precisión.",
        feedback_error:
          "Paso a paso: \n1. Costo inicial: $120 \\cdot 1.500 = 180.000$. \n2. Venta 1 (1/3 de 120 = 40 art.): $40 \\cdot 2.000 = 80.000$. \n3. Venta 2 (3/5 de 120 = 72 art.): $72 \\cdot 2.500 = 180.000$. \n4. Resto (120 - 40 - 72 = 8 art.): $8 \\cdot 1.200 = 9.600$. \n5. Venta total: $80.000 + 180.000 + 9.600 = 269.600$. \n6. Margen neto: $269.600 - 180.000 = 89.600$ (ganancia).",
      },
      {
        id: 10303,
        enunciado:
          "Un deportista corre $4\\text{ km}$ el primer día. Cada día siguiente corre exactamente la mitad de la distancia recorrida el día anterior. ¿Cuántos kilómetros en total habrá recorrido al cabo de $5$ días?",
        alternativas: {
          A: "$7,875\\text{ km}$",
          B: "$7,75\\text{ km}$",
          C: "$7,5\\text{ km}$",
          D: "$8\\text{ km}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Fantástico! Evaluaste la secuencia geométrica diaria y realizaste la suma de racionales decimales a la perfección.",
        feedback_error:
          "Paso a paso: \n- Día 1: $4\\text{ km}$ \n- Día 2: $2\\text{ km}$ \n- Día 3: $1\\text{ km}$ \n- Día 4: $0,5\\text{ km}$ \n- Día 5: $0,25\\text{ km}$ \nSuma total: $4 + 2 + 1 + 0,5 + 0,25 = 7,75\\text{ km}$.",
      },
      {
        id: 10304,
        enunciado:
          "Un submarino desciende a una velocidad constante de $\\frac{3}{4}$ de metro por segundo. Si parte desde el nivel del mar y desciende ininterrumpidamente durante $2$ minutos y medio, ¿a qué profundidad se encuentra?",
        alternativas: {
          A: "$1,875\\text{ metros bajo el nivel del mar}$",
          B: "$95\\text{ metros bajo el nivel del mar}$",
          C: "$180,5\\text{ metros bajo el nivel del mar}$",
          D: "$112,5\\text{ metros bajo el nivel del mar}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Increíble! Convertiste el tiempo a segundos y multiplicaste la tasa de velocidad racional correctamente.",
        feedback_error:
          "Paso a paso: \n1. Convertimos $2.5$ minutos a segundos: $2.5 \\cdot 60 = 150\\text{ segundos}$. \n2. Distancia de descenso: $150 \\cdot \\frac{3}{4} = \\frac{450}{4} = 112,5\\text{ metros}$. \n3. Se encuentra a $112,5$ metros bajo el nivel del mar.",
      },
      {
        id: 10305,
        enunciado:
          "De un estanque lleno de combustible se consume la mitad de su capacidad. Luego, se consume la tercera parte del combustible restante. Si aún quedan $80\\text{ litros}$ en el estanque, ¿cuál es su capacidad total?",
        alternativas: {
          A: "$160\\text{ litros}$",
          B: "$240\\text{ litros}$",
          C: "$480\\text{ litros}$",
          D: "$320\\text{ litros}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Comprendiste que la segunda fracción se aplicaba al remanente, no al total inicial.",
        feedback_error:
          "Paso a paso: \n1. Se consume la mitad, queda: $\\frac{1}{2}$. \n2. Se consume $\\frac{1}{3}$ de lo restante: $\\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$. \n3. Consumo acumulado: $\\frac{1}{2} + \\frac{1}{6} = \\frac{3+1}{6} = \\frac{4}{6} = \\frac{2}{3}$. \n4. Fracción que queda en el estanque: $1 - \\frac{2}{3} = \\frac{1}{3}$. \n5. Si $\\frac{1}{3}$ de la capacidad equivale a $80\\text{ litros}$, la capacidad total es $80 \\cdot 3 = 240\\text{ litros}$.",
      },
      {
        id: 10306,
        enunciado:
          "Un listón de madera de $2.4\\text{ metros}$ de largo se corta en 3 partes. La primera mide $\\frac{1}{3}$ del total, la segunda mide la mitad de lo restante, y la tercera es lo que queda. ¿Cuánto mide la tercera parte?",
        alternativas: {
          A: "$1.2\\text{ metros}$",
          B: "$0.8\\text{ metros}$",
          C: "$0.6\\text{ metros}$",
          D: "$1.0\\text{ metros}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Maravilloso! Seguiste la secuencia de cortes calculando la parte de madera restante en cada paso.",
        feedback_error:
          "Paso a paso: \n1. Parte 1: $\\frac{1}{3} \\cdot 2.4 = 0.8\\text{ metros}$. \n2. Resto tras primer corte: $2.4 - 0.8 = 1.6\\text{ metros}$. \n3. Parte 2: La mitad de $1.6 = 0.8\\text{ metros}$. \n4. Parte 3: Lo que queda es $1.6 - 0.8 = 0.8\\text{ metros}$.",
      },
      {
        id: 10307,
        enunciado:
          "Una cuenta bancaria tiene un saldo inicial de $-\\$15.000$. Se realiza un depósito correspondiente a las tres quintas partes de \\$80.000, y luego se cobra una comisión equivalente a un tercio del nuevo saldo. ¿Cuál es el saldo final de la cuenta?",
        alternativas: {
          A: "$\\$22.000$",
          B: "$\\$33.000$",
          C: "$-\\$11.000$",
          D: "$\\$16.500$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Muy bien! Hiciste las sumas y restas de saldo bancario respetando los signos a la perfección.",
        feedback_error:
          "Paso a paso: \n1. Depósito: $\\frac{3}{5} \\cdot 80.000 = 3 \\cdot 16.000 = 48.000$. \n2. Nuevo saldo: $-15.000 + 48.000 = 33.000$. \n3. Comisión cobrada: $\\frac{1}{3} \\cdot 33.000 = 11.000$. \n4. Saldo final: $33.000 - 11.000 = 22.000$.",
      },
      {
        id: 10308,
        enunciado:
          "En una caja de herramientas, $\\frac{3}{8}$ del total son destornilladores y $\\frac{2}{5}$ del resto son llaves. Las $15$ herramientas sobrantes son alicates. ¿Cuántas herramientas hay en la caja en total?",
        alternativas: { A: "$40$", B: "$56$", C: "$32$", D: "$48$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Genial! Planteaste la ecuación con fracciones y la resolviste de manera muy elegante.",
        feedback_error:
          "Paso a paso: \n1. Destornilladores: $\\frac{3}{8}$ del total. \n2. Resto: $1 - \\frac{3}{8} = \\frac{5}{8}$ del total. \n3. Llaves: $\\frac{2}{5}$ de $\\frac{5}{8} = \\frac{2}{8} = \\frac{1}{4}$ del total. \n4. Total asignado: $\\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}$ del total. \n5. Alicates (sobra): $1 - \\frac{5}{8} = \\frac{3}{8}$ del total. \n6. Como $\\frac{3}{8}$ del total equivale a $15$ herramientas, el total es $\\frac{15 \\cdot 8}{3} = 40$ herramientas.",
      },
      {
        id: 10309,
        enunciado:
          "Se disuelven exactamente $45\\text{ gramos}$ de sal en $255\\text{ gramos}$ de agua pura. ¿Qué fracción del peso total de la solución obtenida corresponde a la sal?",
        alternativas: {
          A: "$\\frac{3}{17}$",
          B: "$\\frac{1}{6}$",
          C: "$\\frac{3}{20}$",
          D: "$\\frac{9}{51}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Bien! Sumaste el soluto y el solvente para obtener el peso de la disolución antes de simplificar.",
        feedback_error:
          "Paso a paso: \n1. Peso total de la mezcla: $45\\text{ g (sal)} + 255\\text{ g (agua)} = 300\\text{ gramos}$. \n2. Fracción de sal: $\\frac{45}{300}$. \n3. Simplificamos dividiendo por 15: $\\frac{45 \\div 15}{300 \\div 15} = \\frac{3}{20}$.",
      },
      {
        id: 10310,
        enunciado:
          "Un terreno rectangular mide $15\\frac{1}{2}\\text{ metros}$ de largo por $8\\frac{2}{5}\\text{ metros}$ de ancho. Si se quiere rodear el perímetro con exactamente $3$ vueltas completas de alambre, ¿cuántos metros se necesitan?",
        alternativas: {
          A: "$47.8\\text{ metros}$",
          B: "$71.7\\text{ metros}$",
          C: "$150\\text{ metros}$",
          D: "$143.4\\text{ metros}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Excelente! Calculaste el perímetro del rectángulo y lo multiplicaste por el número de corridas.",
        feedback_error:
          "Paso a paso: \n1. Medidas en decimal: Largo = $15.5\\text{ m}$, Ancho = $8.4\\text{ m}$. \n2. Perímetro: $2 \\cdot (15.5 + 8.4) = 2 \\cdot 23.9 = 47.8\\text{ metros}$. \n3. Alambre total para 3 corridas: $47.8 \\cdot 3 = 143.4\\text{ metros}$.",
      },
    ],
  },
  {
    id: "test-m1-1-4",
    seccionId: "sec-m1-1-4",
    contexto_base: "",
    preguntas: [
      {
        id: 10401,
        enunciado: "¿Cuánto equivale exactamente el $0.8\\%$ de $1.250$?",
        alternativas: { A: "$100$", B: "$8$", C: "$10$", D: "$1$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Operaste con los decimales en porcentajes pequeños sin confundir la posición de la coma.",
        feedback_error:
          "Paso a paso: \n1. Planteamiento: $\\frac{0.8}{100} \\cdot 1250$. \n2. Calculamos: $0.008 \\cdot 1250$. \n3. $8 \\cdot 1250 = 10000$. Como corremos la coma 3 espacios: $10$.",
      },
      {
        id: 10402,
        enunciado:
          "Si el 40% del 15% de un número real es igual a $12$, ¿cuál es el 50% de dicho número?",
        alternativas: { A: "$100$", B: "$200$", C: "$150$", D: "$50$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Fabuloso! Resolviste la concatenación de porcentajes para hallar el número y luego calculaste su mitad.",
        feedback_error:
          "Paso a paso: \n1. Planteamos: $0,40 \\cdot 0.15 \\cdot X = 12$. \n2. Multiplicamos decimales: $0.06 \\cdot X = 12$. \n3. Despejamos $X = \\frac{12}{0.06} = 200$. \n4. Calculamos el 50% de 200: $200 \\cdot 0,50 = 100$.",
      },
      {
        id: 10403,
        enunciado:
          "Si el precio de un artículo se incrementa en un 25%, ¿en qué porcentaje debe disminuir el nuevo precio para volver a su valor original?",
        alternativas: { A: "20%", B: "16%", C: "25%", D: "15%" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Brillante! Esta es una clásica pregunta de la PAES. Comprendiste que la base de cálculo cambia tras el aumento.",
        feedback_error:
          "Paso a paso: \n1. Suponemos un valor inicial de \\$100. \n2. Con el aumento del 25%, el nuevo precio es \\$125. \n3. Para volver a \\$100, debemos descontar \\$25. \n4. Calculamos la tasa respecto a la nueva base (125): $\\frac{25}{125} = \\frac{1}{5} = 0.20 = 20\\%$.",
      },
      {
        id: 10404,
        enunciado:
          "Un número real $x$ es el 125% de otro número $y$. ¿Qué porcentaje del número $x$ representa el número $y$?",
        alternativas: { A: "80%", B: "90%", C: "75%", D: "120%" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Bien! Invertiste la relación fraccionaria y la pasaste a porcentaje de manera correcta.",
        feedback_error:
          "Paso a paso: \n1. Expresamos la relación: $x = 1.25 y = \\frac{5}{4} y$. \n2. Despejamos $y$ en función de $x$: $y = \\frac{4}{5} x = 0.80 x$. \n3. Esto significa que $y$ es el 80% de $x$.",
      },
      {
        id: 10405,
        enunciado:
          "Si el $p$% de $q$ es $40$, ¿cuánto equivale matemáticamente el $2p$% de $3q$?",
        alternativas: { A: "$80$", B: "$240$", C: "$120$", D: "$480$" },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Extrajiste la constante de la ecuación de porcentajes de manera muy inteligente.",
        feedback_error:
          "Paso a paso: \n1. Sabemos que: $\\frac{p}{100} \\cdot q = 40 \\implies \\frac{pq}{100} = 40$. \n2. Queremos calcular: $\\frac{2p}{100} \\cdot 3q$. \n3. Reordenamos: $2 \\cdot 3 \\cdot \\left(\\frac{pq}{100}\\right) = 6 \\cdot \\left(\\frac{pq}{100}\\right)$. \n4. Sustituimos el valor conocido: $6 \\cdot 40 = 240$.",
      },
      {
        id: 10406,
        enunciado:
          "Tres descuentos sucesivos del 10%, 20% y 50% aplicados al precio de un bien equivalen a un único descuento de:",
        alternativas: { A: "64%", B: "80%", C: "36%", D: "70%" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Excelente! Multiplicaste los factores remanentes para obtener lo que se paga finalmente.",
        feedback_error:
          "Paso a paso: \n1. Factor tras desc. 10%: $0.9$. \n2. Factor tras desc. 20%: $0.8$. \n3. Factor tras desc. 50%: $0,5$. \n4. Multiplicador final acumulado: $0.9 \\cdot 0.8 \\cdot 0,5 = 0.72 \\cdot 0,5 = 0.36$. \n5. Esto significa que se paga el 36% del precio original. \n6. El descuento único equivalente es: $100\\% - 36\\% = 64\\%$.",
      },
      {
        id: 10407,
        enunciado:
          "Si el área de una figura cuadrada disminuye en un 36%, ¿en qué porcentaje disminuyó la medida de su lado?",
        alternativas: { A: "20%", B: "6%", C: "18%", D: "30%" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Impresionante! Usaste la raíz cuadrada sobre el factor de área para hallar la variación de longitud.",
        feedback_error:
          "Paso a paso: \n1. Si el área disminuye un 36%, la nueva área es el 64% de la original: $A_f = 0.64 A_i$. \n2. Como el área de un cuadrado es $L^2$, el nuevo lado es: $L_f = \\sqrt{0.64} L_i = 0.80 L_i$. \n3. Un lado de $0.80$ veces el original representa un descuento del 20%.",
      },
      {
        id: 10408,
        enunciado:
          "En un liceo, el 60% de los estudiantes practica algún deporte. De ellos, el 30% juega fútbol. Si sabemos que $72$ estudiantes juegan fútbol, ¿cuántos estudiantes tiene el liceo en total?",
        alternativas: { A: "$360$", B: "$400$", C: "$480$", D: "$300$" },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Excelente resolución! Modelaste el problema con porcentajes sucesivos e incógnitas de forma impecable.",
        feedback_error:
          "Paso a paso: \n1. Sea $X$ el total de estudiantes. \n2. Estudiantes de fútbol: $X \\cdot 0.60 \\cdot 0.30 = 72$. \n3. $0.18 \\cdot X = 72$. \n4. $X = \\frac{72}{0.18} = 400$ estudiantes.",
      },
      {
        id: 10409,
        enunciado:
          "El 250% de la tercera parte de un número real es igual a $50$. ¿Cuál es el valor de dicho número?",
        alternativas: { A: "$45$", B: "$120$", C: "$60$", D: "$75$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Bien hecho! Expresaste el porcentaje como decimal o fracción y despejaste la ecuación limpiamente.",
        feedback_error:
          "Paso a paso: \n1. Ecuación: $2.5 \\cdot \\left(\\frac{X}{3}\\right) = 50$. \n2. Multiplicamos por 3: $2.5 X = 150$. \n3. Despejamos: $X = \\frac{150}{2.5} = 60$.",
      },
      {
        id: 10410,
        enunciado:
          "Un vendedor recibe comisión del 8% sobre los primeros \\$500.000 de venta del mes, y un 12% sobre todo excedente a dicho monto. Si sus ventas totales acumuladas fueron de \\$1.200.000, ¿cuál fue su comisión total?",
        alternativas: {
          A: "$\\$96.000$",
          B: "$\\$104.000$",
          C: "$\\$144.000$",
          D: "$\\$124.000$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Muy bien calculado! Separaste el monto de ventas por tramos de cobro correctamente.",
        feedback_error:
          "Paso a paso: \n1. Tramo 1 (hasta \\$500.000): $500.000 \\cdot 0.08 = 40.000$. \n2. Tramo 2 (exceso: \\$1.200.000 - \\$500.000 = \\$700.000): $700.000 \\cdot 0.12 = 84.000$. \n3. Comisión acumulada: $40.000 + 84.000 = 124.000$.",
      },
    ],
  },
  {
    id: "test-m1-1-5",
    seccionId: "sec-m1-1-5",
    contexto_base: "",
    preguntas: [
      {
        id: 10501,
        enunciado:
          "Un capital de \\$200.000 se deposita en una institución a interés compuesto con una tasa del 10% anual. ¿Cuánto es el interés neto acumulado al cabo de $3$ años?",
        alternativas: {
          A: "$\\$66.200$",
          B: "$\\$72.000$",
          C: "$\\$60.000$",
          D: "$\\$266.200$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Excelente! Distinguiste entre capital final y el interés acumulado neto generado por el interés compuesto.",
        feedback_error:
          "Paso a paso: \n1. Capital Final: $200.000 \\cdot (1 + 0.10)^3 = 200.000 \\cdot (1.1)^3$. \n2. $200.000 \\cdot 1.331 = 266.200$. \n3. Interés acumulado: Capital Final - Capital Inicial = $266.200 - 200.000 = 66.200$.",
      },
      {
        id: 10502,
        enunciado:
          "Don José desea invertir \\$1.000.000 por 2 años. El banco A le ofrece interés simple del 6% anual, y el banco B le ofrece interés compuesto del 5% anual. ¿Cuál de las dos opciones le reporta mayor ganancia y por qué diferencia?",
        alternativas: {
          A: "Banco B le reporta \\$2.500 más que Banco A.",
          B: "Banco A le reporta \\$17,500 más que Banco B.",
          C: "Ambas opciones son idénticas.",
          D: "Banco A le reporta \\$20.000 más que Banco B.",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Espectacular! Calculaste y contrastaste las fórmulas de interés simple y compuesto a dos años.",
        feedback_error:
          "Paso a paso: \n1. Banco A (Simple): Ganancia = $1.000.000 \\cdot 0.06 \\cdot 2 = 120.000$. \n2. Banco B (Compuesto): Cap. Final = $1.000.000 \\cdot (1.05)^2 = 1.102.500 \\implies$ Ganancia = $102.500$. \n3. Diferencia: $120.000 - 102.500 = 17,500$ a favor del Banco A.",
      },
      {
        id: 10503,
        enunciado:
          "Se mezcla exactamente $1\\text{ litro}$ de solución de alcohol al 40% de pureza con $3\\text{ litros}$ de solución de alcohol al 20%. ¿Cuál es la concentración final de alcohol de la mezcla en porcentaje?",
        alternativas: { A: "25%", B: "20%", C: "30%", D: "$27,5\\%$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Correcto! Sumaste el volumen neto de soluto puro y lo dividiste por el volumen total de la mezcla.",
        feedback_error:
          "Paso a paso: \n1. Alcohol en el frasco 1: $1 \\cdot 0,40 = 0,4\\text{ litros}$. \n2. Alcohol en el frasco 2: $3 \\cdot 0.20 = 0.6\\text{ litros}$. \n3. Alcohol total: $0,4 + 0.6 = 1.0\\text{ litros}$. \n4. Volumen total de la mezcla: $1 + 3 = 4\\text{ litros}$. \n5. Porcentaje final: $\\frac{1}{4} = 0,25 = 25\\%$.",
      },
      {
        id: 10504,
        enunciado:
          "Un comerciante sube el precio de un artículo en un 20%. Al mes siguiente, debido a la caída de ventas, decide hacer un descuento del 20% sobre el precio modificado. Si el precio de venta final es de \\$48.000, ¿cuál era el precio original?",
        alternativas: {
          A: "$\\$60.000$",
          B: "$\\$48.000$",
          C: "$\\$52.000$",
          D: "$\\$50.000$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Espectacular! Resolviste la variación porcentual inversa de forma matemática precisa.",
        feedback_error:
          "Paso a paso: \n1. Sea $X$ el precio original. \n2. Con recargo y descuento: $X \\cdot 1.20 \\cdot 0.80 = 48.000$. \n3. Multiplicamos decimales: $0.96 X = 48.000$. \n4. Despejamos: $X = \\frac{48.000}{0.96} = 50.000$.",
      },
      {
        id: 10505,
        enunciado:
          "Un inversionista coloca dos tercios de su capital a interés simple con tasa de 1% mensual, y el tercio restante a un 2% mensual. Si al cabo de un mes el interés total recibido fue de \\$80.000, ¿cuál era su capital inicial?",
        alternativas: {
          A: "$\\$8.000.000$",
          B: "$\\$6.000.000$",
          C: "$\\$4.800.000$",
          D: "$\\$12.000.000$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Increíble! Supiste plantear y solucionar una ecuación de primer grado con fracciones y porcentajes.",
        feedback_error:
          "Paso a paso: \n1. Sea $C$ el capital inicial. \n2. Interés tramo 1: $\\frac{2}{3}C \\cdot 0.01 = \\frac{0.02}{3} C$. \n3. Interés tramo 2: $\\frac{1}{3}C \\cdot 0.02 = \\frac{0.02}{3} C$. \n4. Sumamos intereses: $\\frac{0.04}{3} C = 80.000$. \n5. Despejamos $C$: $0.04 C = 240.000 \\implies C = \\frac{240.000}{0.04} = 6.000.000$.",
      },
      {
        id: 10506,
        enunciado:
          "Debido a la inflación, el costo de la vida aumenta un 4% en el primer semestre y luego un 5% sobre el nuevo valor en el segundo semestre. ¿Cuál es la inflación acumulada del año?",
        alternativas: { A: "9%", B: "$10.2\\%$", C: "$9.5\\%$", D: "$9.2\\%$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Evitaste la trampa de sumar linealmente los porcentajes y utilizaste multiplicación de factores.",
        feedback_error:
          "Paso a paso: \n1. Factor de aumento semestre 1: $1.04$. \n2. Factor de aumento semestre 2: $1.05$. \n3. Factor combinado anual: $1.04 \\cdot 1.05 = 1.092$. \n4. La inflación acumulada es: $1.092 - 1 = 0.092 = 9.2\\%$.",
      },
      {
        id: 10507,
        enunciado:
          "Un artículo tecnológico se devalúa un 10% anual de forma compuesta. Si hoy cuesta \\$500.000, ¿cuál será su valor estimado al cabo de $2$ años?",
        alternativas: {
          A: "$\\$400.000$",
          B: "$\\$380.000$",
          C: "$\\$450.000$",
          D: "$\\$405.000$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Excelente! Comprendiste que la devaluación actúa disminuyendo el valor de forma iterada.",
        feedback_error:
          "Paso a paso: \n1. Valor tras 1 año: $500.000 \\cdot 0.90 = 450.000$. \n2. Valor tras 2 años: $450.000 \\cdot 0.90 = 405.000$. \n(O de forma directa: $500.000 \\cdot 0.90^2 = 500.000 \\cdot 0.81 = 405.000$).",
      },
      {
        id: 10508,
        enunciado:
          "Si se depositan \\$1.500.000 a interés compuesto trimestral con tasa de 2% por trimestre, ¿cuál es el capital final acumulado al cabo de $6$ meses (2 trimestres)?",
        alternativas: {
          A: "$\\$1.530.000$",
          B: "$\\$1.560.000$",
          C: "$\\$1.591.200$",
          D: "$\\$1.560.600$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Muy bien! Contaste los períodos de capitalización trimestral de forma exacta.",
        feedback_error:
          "Paso a paso: \n1. 6 meses equivalen a exactamente 2 trimestres. \n2. Capital final: $1.500.000 \\cdot (1 + 0.02)^2 = 1.500.000 \\cdot (1.02)^2$. \n3. $1.500.000 \\cdot 1.0404 = 1.560.600$.",
      },
      {
        id: 10509,
        enunciado:
          "En una multitienda, el precio neto de una prenda es de \\$10.000. Si se le aplica un recargo del 10% por despacho a domicilio y luego sobre ese subtotal se le suma el 19% de IVA, ¿cuánto es el valor final a cancelar?",
        alternativas: {
          A: "$\\$13.090$",
          B: "$\\$12.900$",
          C: "$\\$12.090$",
          D: "$\\$13.000$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Impecable! Aplicaste los factores de recargo en cascada de forma lógica y ordenada.",
        feedback_error:
          "Paso a paso: \n1. Precio neto: \\$10.000. \n2. Con recargo por despacho (10%): $10.000 \\cdot 1.10 = 11.000$. \n3. Con IVA (19% sobre la base de 11.000): $11.000 \\cdot 1.19 = 13.090$.",
      },
      {
        id: 10510,
        enunciado:
          "Un estanque de acuicultura contiene inicialmente $800$ ejemplares. Si la población crece de manera sostenida un 15% mensual, ¿cuántos ejemplares tendrá el estanque al cabo de $2$ meses?",
        alternativas: { A: "$920$", B: "$1.040$", C: "$1.058$", D: "$1.120$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Correcto! Sumaste las variaciones exponenciales mes a mes sin cometer errores.",
        feedback_error:
          "Paso a paso: \n1. Población mes 1: $800 \\cdot 1.15 = 920$. \n2. Población mes 2: $920 \\cdot 1.15 = 1058$. \n(O directo: $800 \\cdot 1.15^2 = 800 \\cdot 1.3225 = 1058$).",
      },
    ],
  },
  {
    id: "test-m1-1-6",
    seccionId: "sec-m1-1-6",
    contexto_base: "",
    preguntas: [
      {
        id: 10601,
        enunciado:
          "Simplifica la siguiente expresión a su mínima expresión numérica: $\\frac{6^4 \\cdot 2^{-3}}{3^5 \\cdot 4^{-2}}$",
        alternativas: {
          A: "$\\frac{32}{3}$",
          B: "$\\frac{16}{3}$",
          C: "$\\frac{8}{3}$",
          D: "$96$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Excelente! Descompusiste las bases compuestas en factores primos para operar los exponentes.",
        feedback_error:
          "Paso a paso: \n1. Descomponemos: $6^4 = (2 \\cdot 3)^4 = 2^4 \\cdot 3^4$. $4^{-2} = (2^2)^{-2} = 2^{-4}$. \n2. Sustituimos: $\\frac{2^4 \\cdot 3^4 \\cdot 2^{-3}}{3^5 \\cdot 2^{-4}}$. \n3. Numerador: $2^{4 + (-3)} \\cdot 3^4 = 2^1 \\cdot 3^4$. \n4. División de bases iguales: $2^{1 - (-4)} \\cdot 3^{4 - 5} = 2^5 \\cdot 3^{-1}$. \n5. Resultado: $32 \\cdot \\frac{1}{3} = \\frac{32}{3}$.",
      },
      {
        id: 10602,
        enunciado:
          "¿Cuál es el valor real que se obtiene de la expresión: $\\frac{4^5 + 4^5 + 4^5 + 4^5}{2^8}$?",
        alternativas: { A: "$4$", B: "$16$", C: "$8$", D: "$2$" },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Brillante! Redujiste la suma del numerador a una multiplicación y pasaste todo a base 2.",
        feedback_error:
          "Paso a paso: \n1. Sumar cuatro veces la misma potencia es multiplicarla por 4: $4 \\cdot 4^5 = 4^6$. \n2. Expresamos en base 2: $4^6 = (2^2)^6 = 2^{12}$. \n3. Dividimos: $\\frac{2^{12}}{2^8} = 2^{12 - 8} = 2^4 = 16$.",
      },
      {
        id: 10603,
        enunciado:
          "Expresa en notación científica la suma de las cantidades: $3.2 \\cdot 10^5$ y $4.8 \\cdot 10^4$.",
        alternativas: {
          A: "$8.0 \\cdot 10^5$",
          B: "$8.0 \\cdot 10^9$",
          C: "$3.68 \\cdot 10^4$",
          D: "$3.68 \\cdot 10^5$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Impecable! Equiparaste los exponentes de base 10 antes de sumar los números decimales.",
        feedback_error:
          "Paso a paso: \n1. Expresamos el segundo término con exponente 5: $4.8 \\cdot 10^4 = 0,48 \\cdot 10^5$. \n2. Sumamos coeficientes: $(3.2 + 0,48) \\cdot 10^5$. \n3. Resultado final: $3.68 \\cdot 10^5$.",
      },
      {
        id: 10604,
        enunciado:
          "Determina el valor simplificado del producto de potencias: $(\\frac{2}{5})^{-3} \\cdot (\\frac{25}{8})^{-2}$",
        alternativas: {
          A: "$\\frac{4}{5}$",
          B: "$\\frac{1}{2}$",
          C: "$\\frac{5}{8}$",
          D: "$\\frac{8}{5}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Aplicaste de forma brillante las leyes de potencias con bases racionales inversas.",
        feedback_error:
          "Paso a paso: \n1. Invertimos bases por exponente negativo: $(\\frac{5}{2})^3 \\cdot (\\frac{8}{25})^2$. \n2. Descomponemos en factores: $\\frac{5^3}{2^3} \\cdot \\frac{(2^3)^2}{(5^2)^2} = \\frac{5^3}{2^3} \\cdot \\frac{2^6}{5^4}$. \n3. Simplificamos términos de base común: $2^{6-3} \\cdot 5^{3-4} = 2^3 \\cdot 5^{-1} = 8 \\cdot \\frac{1}{5} = \\frac{8}{5}$.",
      },
      {
        id: 10605,
        enunciado:
          "Si se sabe que $3^x = 5$, ¿cuál es el valor numérico exacto de $9^{x + 1}$?",
        alternativas: { A: "$45$", B: "$34$", C: "$150$", D: "$225$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Estupendo! Descompusiste el exponente y aplicaste potencia de una potencia en base 3.",
        feedback_error:
          "Paso a paso: \n1. Expresamos la base 9 en términos de 3: $9 = 3^2$. \n2. Planteamos: $(3^2)^{x+1} = 3^{2(x+1)} = 3^{2x} \\cdot 3^2 = (3^x)^2 \\cdot 9$. \n3. Reemplazamos $3^x = 5$: $(5)^2 \\cdot 9 = 25 \\cdot 9 = 225$.",
      },
      {
        id: 10606,
        enunciado:
          "Si definimos $a = 2 \\cdot 10^{-3}$ y $b = 5 \\cdot 10^{-4}$, ¿cuánto es el valor exacto de la división $\\frac{a}{b}$?",
        alternativas: { A: "$0,4$", B: "$2.5$", C: "$4$", D: "$40$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Correcto! Operaste la división de decimales y aplicaste la resta de exponentes negativos correctamente.",
        feedback_error:
          "Paso a paso: \n1. Dividimos: $\\frac{2 \\cdot 10^{-3}}{5 \\cdot 10^{-4}}$. \n2. Coeficientes: $\\frac{2}{5} = 0,4$. \n3. Potencias de 10: $10^{-3 - (-4)} = 10^{-3 + 4} = 10^1$. \n4. Multiplicamos resultados: $0,4 \\cdot 10 = 4$.",
      },
      {
        id: 10607,
        enunciado: "¿Cuál es la mitad exacta del número $2^{100}$?",
        alternativas: {
          A: "$1^{50}$",
          B: "$2^{50}$",
          C: "$2^{99}$",
          D: "$1^{100}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Recordaste que dividir por 2 es restarle 1 al exponente de base 2.",
        feedback_error:
          "Paso a paso: \n1. La mitad de un número es dividirlo por 2: $\\frac{2^{100}}{2}$. \n2. Esto es división de potencias de igual base con exponente 1 implícito: $\\frac{2^{100}}{2^1}$. \n3. Restamos exponentes: $2^{100 - 1} = 2^{99}$.",
      },
      {
        id: 10608,
        enunciado:
          "Simplifica a su mínima expresión el monomio: $\\frac{(a^2 b^{-3})^{-2}}{a^{-4} b^5}$",
        alternativas: {
          A: "$b$",
          B: "$a^8 b$",
          C: "$a^{-8} b^{-1}$",
          D: "$b^{11}$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Genial! Aplicaste los exponentes negativos y simplificaste los términos semejantes correctamente.",
        feedback_error:
          "Paso a paso: \n1. Numerador: $(a^2 b^{-3})^{-2} = a^{2 \\cdot (-2)} b^{-3 \\cdot (-2)} = a^{-4} b^6$. \n2. Reemplazamos en la fracción: $\\frac{a^{-4} b^6}{a^{-4} b^5}$. \n3. Los términos $a^{-4}$ se cancelan. \n4. Restamos exponentes de $b$: $b^{6-5} = b^1 = b$.",
      },
      {
        id: 10609,
        enunciado:
          "Si $2^a = X$ y $3^a = y$, ¿cómo se expresa el término $72^a$ en función de $X$ e $y$?",
        alternativas: {
          A: "$X^2 y^3$",
          B: "$X^3 y^2$",
          C: "$3X \\cdot 2y$",
          D: "$X^3 + y^2$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Maravilloso! Factorizaste 72 en factores primos de base 2 y 3.",
        feedback_error:
          "Paso a paso: \n1. Factorizamos 72: $72 = 8 \\cdot 9 = 2^3 \\cdot 3^2$. \n2. Expresamos el exponente: $72^a = (2^3 \\cdot 3^2)^a$. \n3. Distribuyendo: $(2^a)^3 \\cdot (3^a)^2$. \n4. Sustituimos valores: $X^3 y^2$.",
      },
      {
        id: 10610,
        enunciado:
          "¿Cuál es el valor exacto de la expresión aritmética: $\\frac{(-1)^{2026} + (-1)^{2025} - (-1)^0}{(-2)^2}$?",
        alternativas: { A: "$-0.75$", B: "$-0,25$", C: "$0.75$", D: "$0,25$" },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Identificaste que bases negativas a exponentes pares dan resultado positivo, e impar dan negativo.",
        feedback_error:
          "Paso a paso: \n1. Numerador: \n- $(-1)^{2026} = 1$ (exponente par). \n- $(-1)^{2025} = -1$ (exponente impar). \n- $(-1)^0 = 1$ (todo número distinto de cero elevado a 0 es 1). \n2. Evaluando numerador: $1 + (-1) - 1 = -1$. \n3. Denominador: $(-2)^2 = 4$. \n4. Expresión final: $\\frac{-1}{4} = -0,25$.",
      },
    ],
  },
  {
    id: "test-m1-1-7",
    seccionId: "sec-m1-1-7",
    contexto_base: "",
    preguntas: [
      {
        id: 10701,
        enunciado:
          "Simplifica al máximo la suma y resta de raíces: $\\sqrt{75} - \\sqrt{27} + \\sqrt{12}$",
        alternativas: {
          A: "$10\\sqrt{3}$",
          B: "$4\\sqrt{3}$",
          C: "$\\sqrt{60}$",
          D: "$2\\sqrt{3}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Brillante! Descompusiste cada raíz en busca del factor primo común $\\sqrt{3}$ antes de operar.",
        feedback_error:
          "Paso a paso: \n1. Descomposición: \n- $\\sqrt{75} = \\sqrt{25 \\cdot 3} = 5\\sqrt{3}$. \n- $\\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}$. \n- $\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$. \n2. Sustituimos: $5\\sqrt{3} - 3\\sqrt{3} + 2\\sqrt{3}$. \n3. Sumamos coeficientes: $(5 - 3 + 2)\\sqrt{3} = 4\\sqrt{3}$.",
      },
      {
        id: 10702,
        enunciado:
          "Calcula el resultado final de la siguiente multiplicación de raíces reales: $\\sqrt{2} \\cdot (\\sqrt{8} - \\sqrt{18})$",
        alternativas: { A: "$-2$", B: "$\\sqrt{2}$", C: "$2$", D: "$-4$" },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Estupendo! Aplicaste propiedad distributiva y simplificaste las raíces de manera sobresaliente.",
        feedback_error:
          "Paso a paso: \n1. Distribuimos el factor exterior: $(\\sqrt{2} \\cdot \\sqrt{8}) - (\\sqrt{2} \\cdot \\sqrt{18})$. \n2. Multiplicamos radicandos: $\\sqrt{16} - \\sqrt{36}$. \n3. Calculamos las raíces exactas: $4 - 6 = -2$.",
      },
      {
        id: 10703,
        enunciado:
          "Expresa en forma de potencia de base 3 la siguiente expresión irracional: $\\sqrt[3]{9 \\cdot \\sqrt{3}}$",
        alternativas: {
          A: "$3^{\\frac{2}{3}}$",
          B: "$3^{\\frac{5}{6}}$",
          C: "$3^{\\frac{7}{6}}$",
          D: "$3^{\\frac{3}{2}}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Fabuloso! Utilizaste las reglas de exponentes fraccionarios y sumaste exponentes fraccionarios sin problemas.",
        feedback_error:
          "Paso a paso: \n1. Reescribimos el radicando interno en base 3: $9 \\cdot \\sqrt{3} = 3^2 \\cdot 3^{1/2}$. \n2. Sumamos exponentes de igual base: $2 + 1/2 = 5/2 \\implies 3^{5/2}$. \n3. Aplicamos la raíz cúbica como exponente fraccionario: $(3^{5/2})^{1/3}$. \n4. Multiplicamos exponentes: $3^{5/6}$.",
      },
      {
        id: 10704,
        enunciado:
          "¿Cuál de las siguientes igualdades es CORRECTA respecto a las propiedades de los números reales?",
        alternativas: {
          A: "$\\sqrt{4} + \\sqrt{9} = \\sqrt{13}$",
          B: "$\\sqrt{18} = 3\\sqrt{2}$",
          C: "$\\sqrt[3]{8} = 4$",
          D: "$\\sqrt{2} + \\sqrt{3} = \\sqrt{5}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Excelente discernimiento! Recordaste que las raíces NO se pueden sumar directamente y descompusiste $\\sqrt{18}$ correctamente.",
        feedback_error:
          "Análisis: \n- $\\sqrt{18} = \\sqrt{9 \\cdot 2} = 3\\sqrt{2}$. (Correcto). \n- $\\sqrt{4} + \\sqrt{9} = 2 + 3 = 5$, lo cual es distinto de $\\sqrt{13}$. \n- $\\sqrt{2} + \\sqrt{3}$ no se puede sumar, es distinto de $\\sqrt{5}$. \n- $\\sqrt[3]{8} = 2$, no 4.",
      },
      {
        id: 10705,
        enunciado:
          "Determina el valor numérico de la división de raíces: $\\frac{\\sqrt{128}}{\\sqrt{8}}$",
        alternativas: { A: "$8$", B: "$16$", C: "$2$", D: "$4$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Muy bien! Unificaste el cociente bajo una sola raíz utilizando la propiedad de división de raíces.",
        feedback_error:
          "Paso a paso: \n1. Propiedad: $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$. \n2. Dividimos: $\\sqrt{\\frac{128}{8}} = \\sqrt{16}$. \n3. Evaluamos la raíz exacta: $4$.",
      },
      {
        id: 10706,
        enunciado:
          "Si $x = \\sqrt{3}$ y $y = \\sqrt{27}$, ¿cuál es el valor exacto de evaluar $(x + y)^2$?",
        alternativas: { A: "$36$", B: "$12$", C: "$30$", D: "$48$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Sumaste las raíces semejantes antes de elevar al cuadrado para facilitar la operatoria.",
        feedback_error:
          "Paso a paso: \n1. Simplificamos $y$: $y = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}$. \n2. Sumamos: $x + y = 1\\sqrt{3} + 3\\sqrt{3} = 4\\sqrt{3}$. \n3. Elevamos al cuadrado: $(4\\sqrt{3})^2 = 4^2 \\cdot (\\sqrt{3})^2 = 16 \\cdot 3 = 48$.",
      },
      {
        id: 10707,
        enunciado:
          "¿Cuál es el valor exacto de la expresión irracional: $\\sqrt{2^{20} + 2^{20} + 2^{20} + 2^{20}}$?",
        alternativas: {
          A: "$2^{11}$",
          B: "$2^5$",
          C: "$2^{10}$",
          D: "$2^{22}$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Espectacular! Transformaste la suma del radicando en una multiplicación para resolver la raíz.",
        feedback_error:
          "Paso a paso: \n1. Sumar cuatro veces $2^{20}$ es multiplicarlo por 4: $4 \\cdot 2^{20}$. \n2. Pasamos a base 2: $2^2 \\cdot 2^{20} = 2^{22}$. \n3. Evaluamos la raíz cuadrada: $\\sqrt{2^{22}} = 2^{22/2} = 2^{11}$.",
      },
      {
        id: 10708,
        enunciado:
          "Si aproximamos $\\sqrt{3} \\approx 1.73$ y $\\sqrt{5} \\approx 2.24$, ¿cuál es la mejor aproximación para el valor de $\\sqrt{60}$?",
        alternativas: { A: "$6.85$", B: "$7.12$", C: "$7,75$", D: "$8.25$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Gran trabajo! Descompusiste $\\sqrt{60}$ en factores conocidos y multiplicaste las aproximaciones.",
        feedback_error:
          "Paso a paso: \n1. Descomponemos: $\\sqrt{60} = \\sqrt{4 \\cdot 3 \\cdot 5} = 2 \\cdot \\sqrt{3} \\cdot \\sqrt{5}$. \n2. Reemplazamos: $2 \\cdot 1.73 \\cdot 2.24$. \n3. Evaluamos: $3.46 \\cdot 2.24 \\approx 7,75$.",
      },
      {
        id: 10709,
        enunciado:
          "Simplifica la siguiente expresión mediante racionalización: $\\frac{6}{\\sqrt{3}}$",
        alternativas: {
          A: "$3\\sqrt{2}$",
          B: "$2\\sqrt{3}$",
          C: "$2$",
          D: "$6\\sqrt{3}$",
        },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Multiplicaste el numerador y el denominador por $\\sqrt{3}$ para eliminar el irracional del denominador.",
        feedback_error:
          "Paso a paso: \n1. Multiplicamos por $\\frac{\\sqrt{3}}{\\sqrt{3}}$: $\\frac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}}$. \n2. Simplificamos denominador: $\\frac{6\\sqrt{3}}{3}$. \n3. Dividimos coeficientes: $2\\sqrt{3}$.",
      },
      {
        id: 10710,
        enunciado:
          "Calcula la raíz cúbica de la raíz cuadrada de $64$: $\\sqrt[3]{\\sqrt{64}}$",
        alternativas: { A: "$1.5$", B: "$8$", C: "$4$", D: "$2$" },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Excelente! Resolviste la raíz anidada de dentro hacia afuera de forma impecable.",
        feedback_error:
          "Paso a paso: \n1. Primero calculamos la raíz interior: $\\sqrt{64} = 8$. \n2. Luego evaluamos la raíz exterior: $\\sqrt[3]{8} = 2$.",
      },
    ],
  },
  {
    id: "test-m1-1-8",
    seccionId: "sec-m1-1-8",
    contexto_base: "",
    preguntas: [
      {
        id: 10801,
        enunciado:
          "Una bacteria se reproduce duplicando su población cada exactamente $20\\text{ minutos}$. Si inicialmente hay $50\\text{ bacterias}$ en un cultivo de laboratorio, ¿cuántas bacterias habrá al cabo de $2\\text{ horas}$?",
        alternativas: { A: "$1.600$", B: "$6.400$", C: "$3.200$", D: "$300$" },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Calculaste correctamente la cantidad de intervalos de 20 minutos que hay en 2 horas y aplicaste la potencia de base 2.",
        feedback_error:
          "Paso a paso: \n1. Tiempo total: 2 horas = 120 minutos. \n2. Cantidad de intervalos de duplicación: $120 \\div 20 = 6$ ciclos. \n3. Población final: $50 \\cdot 2^6 = 50 \\cdot 64 = 3200$ bacterias.",
      },
      {
        id: 10802,
        enunciado:
          "La intensidad de la luz disminuye exactamente a la mitad por cada centímetro de espesor de un tipo de vidrio tintado. Si la intensidad inicial de la luz al entrar es de $I_0$, ¿cuál de las siguientes expresiones representa la intensidad de luz remanente tras atravesar $5\\text{ cm}$ de espesor?",
        alternativas: {
          A: "$\\frac{I_0}{10}$",
          B: "$\\frac{I_0}{16}$",
          C: "$\\frac{I_0}{32}$",
          D: "$I_0 \\cdot (\\frac{1}{2})^{-5}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Fabuloso! Modelaste el problema con decaimiento exponencial usando la potencia $(\\frac{1}{2})^5$.",
        feedback_error:
          "Paso a paso: \n1. Descenso por cada centímetro: $\\frac{1}{2}$ de la intensidad previa. \n2. Tras 5 cm, se reduce en: $(\\frac{1}{2})^5 = \\frac{1}{32}$ veces la intensidad inicial. \n3. Expresión: $I_0 \\cdot \\frac{1}{32} = \\frac{I_0}{32}$.",
      },
      {
        id: 10803,
        enunciado:
          "El volumen de un cuerpo cúbico es de $128\\text{ cm}^3$. ¿Cuál es la medida del área de superficie total de todas las caras del cubo?",
        alternativas: {
          A: "$96\\sqrt[3]{4}\\text{ cm}^2$",
          B: "$64\\sqrt[3]{4}\\text{ cm}^2$",
          C: "$96\\sqrt{2}\\text{ cm}^2$",
          D: "$48\\sqrt[3]{2}\\text{ cm}^2$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Espectacular! Relacionaste el volumen con el lado usando raíz cúbica, y luego calculaste el área de las 6 caras.",
        feedback_error:
          "Paso a paso: \n1. Volumen de cubo: $a^3 = 128 \\implies a = \\sqrt[3]{128} = \\sqrt[3]{64 \\cdot 2} = 4\\sqrt[3]{2}\\text{ cm}$. \n2. Área de una sola cara cuadrada: $a^2 = (4\\sqrt[3]{2})^2 = 16\\sqrt[3]{4}\\text{ cm}^2$. \n3. Área de las 6 caras del cubo: $6 a^2 = 6 \\cdot 16\\sqrt[3]{4} = 96\\sqrt[3]{4}\\text{ cm}^2$.",
      },
      {
        id: 10804,
        enunciado:
          "La velocidad de caída libre de un objeto en el vacío está regida por la fórmula $v = \\sqrt{2gh}$, donde $g \\approx 10\\text{ m/s}^2$ representa la aceleración de gravedad y $h$ la altura de caída. Si se suelta una piedra desde una altura de $45\\text{ metros}$, ¿con qué velocidad chocará contra el suelo?",
        alternativas: {
          A: "$30\\text{ m/s}$",
          B: "$900\\text{ m/s}$",
          C: "$15\\sqrt{2}\\text{ m/s}$",
          D: "$20\\text{ m/s}$",
        },
        respuesta_correcta: "A",
        feedback_acierto:
          "¡Espectacular! Evaluaste las variables en la función irracional y resolviste la raíz cuadrada perfectamente.",
        feedback_error:
          "Paso a paso: \n1. Reemplazamos valores en la fórmula: $v = \\sqrt{2 \\cdot 10 \\cdot 45}$. \n2. Multiplicamos radicando: $v = \\sqrt{900}$. \n3. Resolvemos la raíz: $v = 30\\text{ m/s}$.",
      },
      {
        id: 10805,
        enunciado:
          "El período de oscilación de un péndulo simple está modelado por la fórmula: $T = 2\\pi \\sqrt{\\frac{L}{g}}$. Si la longitud $L$ del péndulo se cuadruplica, ¿qué ocurre con su período $T$?",
        alternativas: {
          A: "El período se cuadruplica.",
          B: "El período disminuye a la mitad.",
          C: "El período se mantiene constante.",
          D: "El período se duplica.",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Identificaste que multiplicar la longitud por 4 dentro de la raíz equivale a multiplicar el período por $\\sqrt{4} = 2$.",
        feedback_error:
          "Paso a paso: \n1. Sustituimos $L$ por $4L$: $T' = 2\\pi \\sqrt{\\frac{4L}{g}}$. \n2. Separamos la constante multiplicativa de la raíz: $T' = 2\\pi \\cdot \\sqrt{4} \\cdot \\sqrt{\\frac{L}{g}}$. \n3. Como $\\sqrt{4} = 2$, entonces $T' = 2 \\cdot \\left(2\\pi \\sqrt{\\frac{L}{g}}\\right) = 2T$. \n4. Por ende, el período se duplica.",
      },
      {
        id: 10806,
        enunciado:
          "Una sustancia radiactiva experimental se reduce a la tercera parte de su masa cada exactamente $5\\text{ años}$. Si al iniciar un estudio se registran $81\\text{ gramos}$ de dicha sustancia, ¿cuántos gramos quedarán tras $15\\text{ años}$ de decaimiento?",
        alternativas: {
          A: "$9\\text{ gramos}$",
          B: "$27\\text{ gramos}$",
          C: "$3\\text{ gramos}$",
          D: "$1\\text{ gramo}$",
        },
        respuesta_correcta: "C",
        feedback_acierto:
          "¡Excelente! Calculaste la cantidad de ciclos de decaimiento y aplicaste la potencia de base racional.",
        feedback_error:
          "Paso a paso: \n1. Número de ciclos: $15 \\div 5 = 3$ ciclos. \n2. Masa remanente: $81 \\cdot (\\frac{1}{3})^3 = 81 \\cdot \\frac{1}{27} = 3\\text{ gramos}$.",
      },
      {
        id: 10807,
        enunciado:
          "Un terreno de forma cuadrada posee una superficie total de $180\\text{ m}^2$. Si se quiere rodear por completo con una cerca de alambre de una corrida, ¿cuál es el largo total de la cerca expresado de forma simplificada?",
        alternativas: {
          A: "$48\\text{ metros}$",
          B: "$12\\sqrt{15}\\text{ metros}$",
          C: "$6\\sqrt{5}\\text{ metros}$",
          D: "$24\\sqrt{5}\\text{ metros}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Correcto! Obtuviste el lado del terreno con la raíz cuadrada del área, y luego multiplicaste por 4 para hallar el perímetro.",
        feedback_error:
          "Paso a paso: \n1. Lado del cuadrado: $L = \\sqrt{180}\\text{ metros}$. \n2. Simplificamos la raíz: $\\sqrt{180} = \\sqrt{36 \\cdot 5} = 6\\sqrt{5}\\text{ metros}$. \n3. Perímetro (largo de la cerca): $4 \\cdot L = 4 \\cdot (6\\sqrt{5}) = 24\\sqrt{5}\\text{ metros}$.",
      },
      {
        id: 10808,
        enunciado:
          "Una plaga de insectos triplica su población cada $4\\text{ días}$. Si al cabo de $12\\text{ días}$ se contabilizan exactamente $270\\text{ insectos}$, ¿cuál era la población inicial de la plaga?",
        alternativas: {
          A: "$15\\text{ insectos}$",
          B: "$90\\text{ insectos}$",
          C: "$30\\text{ insectos}$",
          D: "$10\\text{ insectos}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Muy bien! Planteaste la ecuación exponencial inversa despejando la población inicial con éxito.",
        feedback_error:
          "Paso a paso: \n1. Intervalos de tiempo: $12 \\div 4 = 3$ ciclos. \n2. Ecuación: $P_0 \\cdot 3^3 = 270$. \n3. $27 P_0 = 270 \\implies P_0 = 10$ insectos.",
      },
      {
        id: 10809,
        enunciado:
          "El área de una zona circular es de $12\\pi\\text{ cm}^2$. ¿Cuánto mide la longitud de la circunferencia (su perímetro)?",
        alternativas: {
          A: "$12\\pi\\text{ cm}$",
          B: "$2\\sqrt{3}\\pi\\text{ cm}$",
          C: "$24\\pi\\text{ cm}$",
          D: "$4\\sqrt{3}\\pi\\text{ cm}$",
        },
        respuesta_correcta: "D",
        feedback_acierto:
          "¡Espectacular! Resolviste la relación de fórmulas del círculo usando la raíz del radio.",
        feedback_error:
          "Paso a paso: \n1. Área del círculo: $\\pi r^2 = 12\\pi \\implies r^2 = 12$. \n2. Radio: $r = \\sqrt{12} = 2\\sqrt{3}\\text{ cm}$. \n3. Perímetro del círculo: $2\\pi r = 2\\pi \\cdot 2\\sqrt{3} = 4\\sqrt{3}\\pi\\text{ cm}$.",
      },
      {
        id: 10810,
        enunciado:
          "La masa de un cultivo celular se duplica de manera regular cada día. Si en el día $10$ se alcanza una masa de $M$ gramos, ¿en qué día la masa era de exactamente la cuarta parte de $M$?",
        alternativas: { A: "Día 6", B: "Día 8", C: "Día 7", D: "Día 9" },
        respuesta_correcta: "B",
        feedback_acierto:
          "¡Correcto! Analizaste el crecimiento exponencial en reversa restando días de duplicación.",
        feedback_error:
          "Paso a paso: \n1. En el día 10 la masa es $M$. \n2. Como se duplica cada día, el día anterior (día 9) la masa era la mitad: $\\frac{M}{2}$. \n3. El día anterior a ese (día 8) la masa era la mitad de la mitad: $\\frac{M}{4}$. \n4. Por lo tanto, la cuarta parte de la masa se obtuvo en el Día 8.",
      },
    ],
  },
];

async function injectRealTests() {
  console.log(
    "🌱 Starting Matematica M1 - Real Tests Seeding (80 Questions)...",
  );

  try {
    const testsRef = db.collection("lp_tests");

    for (const test of TESTS_DATA) {
      await testsRef.doc(test.id).set(test);
      console.log(
        `✅ Test inyectado con éxito: ${test.id} (${test.preguntas.length} preguntas)`,
      );
    }

    console.log(
      "🎉 Inyección masiva de 80 preguntas de Matemáticas M1 - Números COMPLETADA!",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inyectando los tests:", error);
    process.exit(1);
  }
}

injectRealTests();
