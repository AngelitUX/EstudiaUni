import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

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

// ─── Data for Matemática M1 - Números ───
const MATERIA_ID = 'mat1';

const CAPITULOS = [
  {
    id: 'cap-m1-numeros',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Números',
    introduccion: 'Este eje evalúa la comprensión y aplicación de los conjuntos numéricos. Dominarás las operaciones, el cálculo de porcentajes y las propiedades de potencias y raíces.',
    order: 1,
    secciones: [
      {
        id: 'sec-m1-num-1-1',
        title: '1. Operaciones Básicas con Enteros ($\\mathbb{Z}$)',
        introduccion: 'Repasaremos sumas, restas, multiplicaciones y divisiones con números enteros, además de la regla de los signos y prioridad de operaciones.',
        datos_claves: [
          'Regla de los signos: Signos iguales en multiplicación/división dan $(+)$, distintos dan $(-)$.',
          'Prioridad (PAPOMUDAS): Paréntesis, Potencias, Multiplicación/División (izq a der), Adición/Sustracción.'
        ],
        order: 1,
        test: {
          id: 'test-m1-num-1-1',
          contexto_base: '',
          preguntas: [
            { id: 1101, enunciado: 'Al resolver $5 - 3 \\cdot (2 - 5)$, ¿cuál es el resultado?', alternativas: { A: '$-4$', B: '$14$', C: '$-6$', D: '$4$' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Paso a paso: Paréntesis $(2 - 5) = -3$. Multiplicación $-3 \\cdot -3 = +9$. Suma: $5 + 9 = 14$.' },
            { id: 1102, enunciado: 'Calcula: $-8 + 12 \\div (-4) - (-2)$', alternativas: { A: '$-9$', B: '$-3$', C: '$-11$', D: '$-7$' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien hecho!', feedback_error: 'División primero: $12 \\div (-4) = -3$. Queda: $-8 - 3 - (-2) = -8 - 3 + 2 = -11 + 2 = -9$.' },
            { id: 1103, enunciado: 'El valor de $|-15| - |-5|$ es:', alternativas: { A: '$-20$', B: '$10$', C: '$-10$', D: '$20$' }, respuesta_correcta: 'B', feedback_acierto: '¡Valor absoluto comprendido!', feedback_error: '$|-15| = 15$ y $|-5| = 5$. Restamos: $15 - 5 = 10$.' },
            { id: 1104, enunciado: 'Si $x = -3$ y $y = -2$, ¿cuál es el valor de $x^2 - xy$?', alternativas: { A: '$3$', B: '$15$', C: '$6$', D: '$9$' }, respuesta_correcta: 'A', feedback_acierto: 'Evaluación correcta de variables.', feedback_error: 'Sustituyendo: $(-3)^2 - (-3)(-2) = 9 - (6) = 3$.' },
            { id: 1105, enunciado: '¿Cuál es el inverso aditivo de $-(-7)$?', alternativas: { A: '$7$', B: '$-7$', C: '$1/7$', D: '$-1/7$' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto!', feedback_error: '$-(-7) = 7$. El inverso aditivo de $7$ es $-7$.' },
            { id: 1106, enunciado: 'Calcula: $[(-5) + (-3)] \\cdot [(-2) - (-6)]$', alternativas: { A: '$-32$', B: '$32$', C: '$-16$', D: '$16$' }, respuesta_correcta: 'A', feedback_acierto: '¡Multiplicación de corchetes correcta!', feedback_error: 'Primer corchete: $-5 - 3 = -8$. Segundo corchete: $-2 + 6 = 4$. Producto: $-8 \\cdot 4 = -32$.' },
            { id: 1107, enunciado: 'Si $A = -4$ y $B = 5$, ¿cuánto es $2A - 3B$?', alternativas: { A: '$-23$', B: '$7$', C: '$-7$', D: '$23$' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien!', feedback_error: '$2(-4) - 3(5) = -8 - 15 = -23$.' },
            { id: 1108, enunciado: 'El sucesor par de $-6$ es:', alternativas: { A: '$-4$', B: '$-8$', C: '$-5$', D: '$-7$' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto!', feedback_error: 'En la recta numérica, el número par que le sigue (mayor que él) a $-6$ es $-4$.' },
            { id: 1109, enunciado: 'Al dividir un entero negativo por un entero positivo, el resultado es siempre:', alternativas: { A: 'Positivo', B: 'Negativo', C: 'Cero', D: 'Indeterminado' }, respuesta_correcta: 'B', feedback_acierto: '¡Regla de signos correcta!', feedback_error: 'Signos distintos en división ($- \\div +$) siempre da negativo ($-$).' },
            { id: 1110, enunciado: 'Calcula $1 - (2 - (3 - 4))$', alternativas: { A: '$-2$', B: '$0$', C: '$2$', D: '$-4$' }, respuesta_correcta: 'A', feedback_acierto: '¡Paréntesis anidados resueltos!', feedback_error: 'Desde adentro: $(3 - 4) = -1$. Luego $2 - (-1) = 2 + 1 = 3$. Finalmente $1 - 3 = -2$.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-1-2',
        title: '2. Operaciones con Racionales ($\\mathbb{Q}$) - Fracciones',
        introduccion: 'Profundizaremos en la suma, resta, multiplicación y división de fracciones, usando el mínimo común múltiplo (MCM).',
        datos_claves: [
          'Suma/Resta: Iguala denominadores usando el MCM.',
          'Multiplicación: Numerador con numerador y denominador con denominador.',
          'División: Multiplica por el inverso de la segunda fracción.'
        ],
        order: 2,
        test: {
          id: 'test-m1-num-1-2',
          contexto_base: '',
          preguntas: [
            { id: 1201, enunciado: 'Resuelve: $\\frac{3}{4} + \\frac{1}{6}$', alternativas: { A: '$\\frac{4}{10}$', B: '$\\frac{11}{12}$', C: '$\\frac{5}{12}$', D: '$\\frac{2}{5}$' }, respuesta_correcta: 'B', feedback_acierto: '¡MCM correcto!', feedback_error: 'El MCM entre $4$ y $6$ es $12$. Amplificamos: $\\frac{9}{12} + \\frac{2}{12} = \\frac{11}{12}$.' },
            { id: 1202, enunciado: 'Calcula: $\\frac{5}{8} \\cdot \\frac{4}{15}$', alternativas: { A: '$\\frac{1}{6}$', B: '$\\frac{3}{2}$', C: '$\\frac{2}{3}$', D: '$\\frac{1}{4}$' }, respuesta_correcta: 'A', feedback_acierto: '¡Simplificaste muy bien!', feedback_error: 'Simplifica antes de multiplicar: $5$ con $15$ queda $1/3$. $4$ con $8$ queda $1/2$. Resultado: $\\frac{1}{2} \\cdot \\frac{1}{3} = \\frac{1}{6}$.' },
            { id: 1203, enunciado: 'El resultado de $\\frac{2}{3} \\div \\frac{4}{9}$ es:', alternativas: { A: '$\\frac{8}{27}$', B: '$\\frac{3}{2}$', C: '$\\frac{2}{3}$', D: '$\\frac{27}{8}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Invertiste la fracción correctamente!', feedback_error: 'Invierte la segunda y multiplica: $\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{18}{12} = \\frac{3}{2}$.' },
            { id: 1204, enunciado: 'Calcula: $2 - \\frac{1}{3}$', alternativas: { A: '$\\frac{1}{3}$', B: '$\\frac{5}{3}$', C: '$1$', D: '$\\frac{2}{3}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien transformado el entero a fracción!', feedback_error: 'Transforma $2$ en $\\frac{6}{3}$. Luego $\\frac{6}{3} - \\frac{1}{3} = \\frac{5}{3}$.' },
            { id: 1205, enunciado: '¿Cuánto es $(\\frac{1}{2})^3$?', alternativas: { A: '$\\frac{1}{6}$', B: '$\\frac{3}{2}$', C: '$\\frac{1}{8}$', D: '$\\frac{1}{4}$' }, respuesta_correcta: 'C', feedback_acierto: '¡Potencia de fracción correcta!', feedback_error: 'Elevamos numerador y denominador: $\\frac{1^3}{2^3} = \\frac{1}{8}$.' },
            { id: 1206, enunciado: 'Resuelve: $\\frac{3}{5} + \\frac{1}{2} - \\frac{7}{10}$', alternativas: { A: '$\\frac{2}{5}$', B: '$\\frac{1}{10}$', C: '$\\frac{3}{10}$', D: '$\\frac{1}{5}$' }, respuesta_correcta: 'A', feedback_acierto: '¡Cálculo exacto con MCM!', feedback_error: 'MCM es $10$. $\\frac{6}{10} + \\frac{5}{10} - \\frac{7}{10} = \\frac{4}{10} = \\frac{2}{5}$.' },
            { id: 1207, enunciado: 'La mitad de $\\frac{4}{5}$ es:', alternativas: { A: '$\\frac{2}{5}$', B: '$\\frac{4}{10}$', C: 'Ambas A y B', D: 'Ninguna' }, respuesta_correcta: 'C', feedback_acierto: '¡Identificaste fracciones equivalentes!', feedback_error: 'La mitad se obtiene dividiendo entre $2$ (o multiplicando por $\\frac{1}{2}$). $\\frac{4}{5} \\cdot \\frac{1}{2} = \\frac{4}{10} = \\frac{2}{5}$.' },
            { id: 1208, enunciado: 'Al simplificar $\\frac{48}{72}$, la fracción irreductible es:', alternativas: { A: '$\\frac{4}{6}$', B: '$\\frac{2}{3}$', C: '$\\frac{12}{18}$', D: '$\\frac{6}{9}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Simplificación máxima lograda!', feedback_error: 'Dividimos por el MCD, que es $24$. $48 \\div 24 = 2$ y $72 \\div 24 = 3$.' },
            { id: 1209, enunciado: '¿Qué número falta para que sea cierta la igualdad $\\frac{2}{x} = \\frac{6}{15}$?', alternativas: { A: '$5$', B: '$10$', C: '$3$', D: '$15$' }, respuesta_correcta: 'A', feedback_acierto: '¡Proporción correcta!', feedback_error: 'Multiplicamos cruzado: $2 \\cdot 15 = 6 \\cdot x \\Rightarrow 30 = 6x \\Rightarrow x = 5$.' },
            { id: 1210, enunciado: 'Calcula: $(\\frac{2}{5} \\cdot \\frac{15}{4}) \\div \\frac{3}{2}$', alternativas: { A: '$\\frac{3}{2}$', B: '$\\frac{9}{4}$', C: '$1$', D: '$\\frac{2}{3}$' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente combinación de operaciones!', feedback_error: 'El paréntesis da $\\frac{30}{20} = \\frac{3}{2}$. Al dividir $\\frac{3}{2} \\div \\frac{3}{2}$ el resultado es $1$.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-1-3',
        title: '3. Operaciones con Racionales ($\\mathbb{Q}$) - Decimales',
        introduccion: 'Aprenderás a operar con números decimales finitos e infinitos (periódicos y semiperiódicos) y su transformación a fracción.',
        datos_claves: [
          'Decimal finito a fracción: Numerador sin coma, denominador un $1$ y tantos ceros como decimales.',
          'Decimal periódico a fracción: Numerador sin coma menos parte entera, denominador puro de $9$s.'
        ],
        order: 3,
        test: {
          id: 'test-m1-num-1-3',
          contexto_base: '',
          preguntas: [
            { id: 1301, enunciado: 'Convierte $0.75$ a fracción irreductible:', alternativas: { A: '$\\frac{3}{4}$', B: '$\\frac{75}{100}$', C: '$\\frac{5}{8}$', D: '$\\frac{4}{5}$' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien simplificado!', feedback_error: '$0.75 = \\frac{75}{100}$. Dividiendo por $25$, obtenemos $\\frac{3}{4}$.' },
            { id: 1302, enunciado: 'Transforma el periódico $0.\\overline{3}$ a fracción:', alternativas: { A: '$\\frac{1}{3}$', B: '$\\frac{3}{10}$', C: '$\\frac{33}{100}$', D: '$\\frac{1}{9}$' }, respuesta_correcta: 'A', feedback_acierto: '¡Regla de los nueves aplicada!', feedback_error: '$0.\\overline{3} = \\frac{3}{9}$. Simplificando por $3$, queda $\\frac{1}{3}$.' },
            { id: 1303, enunciado: 'Calcula $1.2 + 0.\\overline{5}$', alternativas: { A: '$1.75$', B: '$\\frac{77}{45}$', C: '$\\frac{15}{9}$', D: '$\\frac{79}{45}$' }, respuesta_correcta: 'D', feedback_acierto: '¡Gran trabajo sumando fracciones!', feedback_error: '$1.2 = \\frac{12}{10} = \\frac{6}{5}$. $0.\\overline{5} = \\frac{5}{9}$. Suma: $\\frac{6}{5} + \\frac{5}{9} = \\frac{54 + 25}{45} = \\frac{79}{45}$.' },
            { id: 1304, enunciado: '¿Cuánto es $0.04 \\cdot 0.2$?', alternativas: { A: '$0.8$', B: '$0.08$', C: '$0.008$', D: '$0.0008$' }, respuesta_correcta: 'C', feedback_acierto: '¡Ceros bien ubicados!', feedback_error: '$4 \\cdot 2 = 8$. Como hay $2$ decimales en el primero y $1$ en el segundo, el resultado tiene $3$ decimales: $0.008$.' },
            { id: 1305, enunciado: 'El resultado de $4.5 \\div 0.09$ es:', alternativas: { A: '$50$', B: '$5$', C: '$0.5$', D: '$500$' }, respuesta_correcta: 'A', feedback_acierto: '¡Corriste la coma perfectamente!', feedback_error: 'Multiplicamos ambos por $100$ para quitar decimales: $450 \\div 9 = 50$.' },
            { id: 1306, enunciado: 'Transforma el semiperiódico $0.1\\overline{6}$ a fracción irreductible:', alternativas: { A: '$\\frac{16}{99}$', B: '$\\frac{1}{6}$', C: '$\\frac{16}{90}$', D: '$\\frac{15}{99}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Regla del semiperiódico correcta!', feedback_error: '$\\frac{16 - 1}{90} = \\frac{15}{90}$. Simplificando por $15$, da $\\frac{1}{6}$.' },
            { id: 1307, enunciado: 'Al sumar $0.1 + 0.01 + 0.001$, se obtiene:', alternativas: { A: '$0.3$', B: '$0.111$', C: '$1.11$', D: '$0.003$' }, respuesta_correcta: 'B', feedback_acierto: '¡Alineación decimal correcta!', feedback_error: 'Se alinean las comas: $0.100 + 0.010 + 0.001 = 0.111$.' },
            { id: 1308, enunciado: '¿Qué decimal corresponde a la fracción $\\frac{7}{8}$?', alternativas: { A: '$0.875$', B: '$0.78$', C: '$0.85$', D: '$0.785$' }, respuesta_correcta: 'A', feedback_acierto: '¡División precisa!', feedback_error: '$7 \\div 8 = 0.875$.' },
            { id: 1309, enunciado: 'El valor de $2 - 0.25 \\cdot 4$ es:', alternativas: { A: '$7$', B: '$1$', C: '$1.75$', D: '$1.5$' }, respuesta_correcta: 'B', feedback_acierto: '¡Prioridad respetada!', feedback_error: 'Multiplicación primero: $0.25 \\cdot 4 = 1$. Luego $2 - 1 = 1$.' },
            { id: 1310, enunciado: 'La expresión $\\frac{1}{0.5}$ equivale a:', alternativas: { A: '$0.5$', B: '$5$', C: '$2$', D: '$10$' }, respuesta_correcta: 'C', feedback_acierto: '¡Inverso de un medio!', feedback_error: '$0.5$ es $\\frac{1}{2}$. La división $\\frac{1}{1/2}$ es multiplicar $1 \\cdot \\frac{2}{1} = 2$.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-1-4',
        title: '4. Orden y Comparación en $\\mathbb{Z}$ y $\\mathbb{Q}$',
        introduccion: 'Desarrollarás estrategias para ordenar fracciones y decimales en la recta numérica.',
        datos_claves: [
          'Para fracciones: Iguala denominadores o pásalas a decimal.',
          'En negativos: El número más alejado del cero es el MENOR.',
          'Entre dos racionales distintos, siempre existe otro racional (densidad).'
        ],
        order: 4,
        test: {
          id: 'test-m1-num-1-4',
          contexto_base: '',
          preguntas: [
            { id: 1401, enunciado: '¿Cuál de las siguientes fracciones es la MAYOR?', alternativas: { A: '$\\frac{3}{5}$', B: '$\\frac{2}{3}$', C: '$\\frac{5}{8}$', D: '$\\frac{7}{12}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente comparación!', feedback_error: 'En decimales: $A=0.6$, $B\\approx0.666$, $C=0.625$, $D\\approx0.583$. La mayor es $B$.' },
            { id: 1402, enunciado: 'Ordena de menor a mayor: $-0.5$, $-0.\\overline{5}$, $-0.05$', alternativas: { A: '$-0.05 < -0.5 < -0.\\overline{5}$', B: '$-0.\\overline{5} < -0.5 < -0.05$', C: '$-0.5 < -0.\\overline{5} < -0.05$', D: '$-0.\\overline{5} < -0.05 < -0.5$' }, respuesta_correcta: 'B', feedback_acierto: '¡Comprendes bien los negativos!', feedback_error: 'En negativos, el de mayor valor absoluto es el MENOR. $0.555... > 0.500 > 0.050$, así que con signo menos se invierte el orden.' },
            { id: 1403, enunciado: '¿Qué número racional se encuentra exactamente en la mitad entre $\\frac{1}{4}$ y $\\frac{1}{2}$?', alternativas: { A: '$\\frac{1}{3}$', B: '$\\frac{3}{8}$', C: '$\\frac{2}{6}$', D: '$\\frac{5}{8}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Promedio calculado correctamente!', feedback_error: 'Se suman y se divide por dos: $(\\frac{1}{4} + \\frac{2}{4}) / 2 = (\\frac{3}{4}) / 2 = \\frac{3}{8}$.' },
            { id: 1404, enunciado: 'Si $a = \\frac{4}{7}$ y $b = \\frac{5}{9}$, entonces es cierto que:', alternativas: { A: '$a > b$', B: '$a < b$', C: '$a = b$', D: 'No se pueden comparar' }, respuesta_correcta: 'A', feedback_acierto: '¡Multiplicación cruzada exitosa!', feedback_error: 'Multiplica cruzado: $4 \\cdot 9 = 36$ y $7 \\cdot 5 = 35$. Como $36 > 35$, entonces $a > b$.' },
            { id: 1405, enunciado: '¿Cuál de los siguientes es el menor entero?', alternativas: { A: '$-99$', B: '$-100$', C: '$0$', D: '$-1$' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien posicionado en la recta!', feedback_error: 'El número negativo con mayor magnitud numérica está más a la izquierda, por tanto es menor. $-100$ es el menor.' },
            { id: 1406, enunciado: 'Se tienen las variables $x = -2$, $y = -1.5$, $z = -5/2$. El orden decreciente es:', alternativas: { A: '$y > x > z$', B: '$z > x > y$', C: '$x > y > z$', D: '$y > z > x$' }, respuesta_correcta: 'A', feedback_acierto: '¡Perfecto el orden de mayor a menor!', feedback_error: '$z = -2.5$. Los valores son $-2$, $-1.5$, $-2.5$. En orden decreciente (mayor a menor): $-1.5 > -2 > -2.5$, o sea $y > x > z$.' },
            { id: 1407, enunciado: '¿Cuántos números enteros hay entre $-3.5$ y $2.1$?', alternativas: { A: '$4$', B: '$5$', C: '$6$', D: '$7$' }, respuesta_correcta: 'C', feedback_acierto: '¡Contaste con precisión!', feedback_error: 'Los enteros son: $-3, -2, -1, 0, 1, 2$. En total son $6$ números enteros.' },
            { id: 1408, enunciado: 'Si $0 < p < 1$, ¿cuál de las siguientes expresiones es la MENOR?', alternativas: { A: '$p$', B: '$p^2$', C: '$\\sqrt{p}$', D: '$1/p$' }, respuesta_correcta: 'B', feedback_acierto: '¡Propiedad clave de fracciones entre 0 y 1!', feedback_error: 'Para números entre $0$ y $1$ (ej. $1/2$), elevar al cuadrado da un número más pequeño ($1/4$).' },
            { id: 1409, enunciado: 'Ordena de mayor a menor: $A=1.1$, $B=1.\\overline{1}$, $C=1.11$', alternativas: { A: '$B > C > A$', B: '$C > B > A$', C: '$A > B > C$', D: '$B > A > C$' }, respuesta_correcta: 'A', feedback_acierto: '¡Ojo de águila con los decimales!', feedback_error: '$A = 1.100$, $B = 1.111...$, $C = 1.110$. Por lo tanto, $1.111... > 1.110 > 1.100$.' },
            { id: 1410, enunciado: 'La distancia en la recta numérica entre $-4$ y $7$ es:', alternativas: { A: '$3$', B: '$11$', C: '$-11$', D: '$-3$' }, respuesta_correcta: 'B', feedback_acierto: '¡La distancia siempre es positiva!', feedback_error: 'Distancia = $|7 - (-4)| = |7 + 4| = 11$.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-1-5',
        title: '5. Problemas de Planteo ($\\mathbb{Z}$ y $\\mathbb{Q}$)',
        introduccion: 'Llevaremos los números a situaciones reales. Analizaremos ganancias, deudas, repartos de tortas, litros de agua y medidas contextualizadas.',
        datos_claves: [
          'Traduce a lenguaje algebraico: "de" suele significar multiplicación (ej: 2/3 de 60).',
          'Suma de partes: Si tomas 1/4 y 1/2, verifica que no sobrepasen el entero (1).',
          'Saldos bancarios: Ingreso es positivo (+), cargo es negativo (-).'
        ],
        order: 5,
        test: {
          id: 'test-m1-num-1-5',
          contexto_base: '',
          preguntas: [
            { id: 1501, enunciado: 'Juan tiene una deuda de $\\$45.000$. Si paga $\\$18.000$ y luego recibe un cargo de $\\$5.000$, ¿cuál es su saldo actual?', alternativas: { A: '$-\\$32.000$', B: '$-\\$22.000$', C: '$\\$32.000$', D: '$-\\$58.000$' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto balance financiero!', feedback_error: '$-45.000 + 18.000 = -27.000$. Con el nuevo cargo de $5.000$: $-27.000 - 5.000 = -32.000$.' },
            { id: 1502, enunciado: 'Una torta se divide de modo que María come $\\frac{1}{4}$ y Pedro $\\frac{1}{3}$. ¿Qué fracción de la torta queda?', alternativas: { A: '$\\frac{5}{12}$', B: '$\\frac{7}{12}$', C: '$\\frac{1}{2}$', D: '$\\frac{2}{7}$' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien calculada la parte sobrante!', feedback_error: 'Comieron $\\frac{1}{4} + \\frac{1}{3} = \\frac{7}{12}$. Queda $1 - \\frac{7}{12} = \\frac{5}{12}$.' },
            { id: 1503, enunciado: 'Un ascensor está en el piso $-3$. Sube $8$ pisos, baja $2$ y vuelve a subir $5$. ¿En qué piso se detiene?', alternativas: { A: '$7$', B: '$8$', C: '$12$', D: '$5$' }, respuesta_correcta: 'B', feedback_acierto: '¡Trayecto perfecto!', feedback_error: 'Posición: $-3 + 8 - 2 + 5$. Paso a paso: $5 - 2 = 3$, $3 + 5 = 8$.' },
            { id: 1504, enunciado: 'Si los $\\frac{3}{5}$ de un tanque son $600$ litros, ¿cuál es la capacidad total del tanque?', alternativas: { A: '$1000$ L', B: '$800$ L', C: '$1200$ L', D: '$360$ L' }, respuesta_correcta: 'A', feedback_acierto: '¡Resolviste la incógnita genial!', feedback_error: 'Si $3$ partes son $600$, $1$ parte es $200$. El tanque tiene $5$ partes: $5 \\cdot 200 = 1000$ L.' },
            { id: 1505, enunciado: 'La temperatura a las 6 AM era de $-4^{\\circ}$C. A las 14 PM subió $12^{\\circ}$C y a las 22 PM bajó $5^{\\circ}$C. ¿Cuál fue la temperatura a las 22 PM?', alternativas: { A: '$3^{\\circ}$C', B: '$-13^{\\circ}$C', C: '$13^{\\circ}$C', D: '$8^{\\circ}$C' }, respuesta_correcta: 'A', feedback_acierto: '¡Sumas y restas térmicas exactas!', feedback_error: '$-4 + 12 = 8^{\\circ}$C. Luego, $8 - 5 = 3^{\\circ}$C.' },
            { id: 1506, enunciado: 'En una clase de $40$ estudiantes, $\\frac{2}{5}$ practican fútbol. Del resto, $\\frac{1}{2}$ practica básquetbol. ¿Cuántos no practican ninguno de estos deportes?', alternativas: { A: '$16$', B: '$12$', C: '$8$', D: '$24$' }, respuesta_correcta: 'B', feedback_acierto: '¡Fracciones de fracciones calculadas!', feedback_error: 'Fútbol: $\\frac{2}{5}$ de $40 = 16$. Resto: $40 - 16 = 24$. Básquetbol: $\\frac{1}{2}$ de $24 = 12$. Los que no practican nada: $24 - 12 = 12$.' },
            { id: 1507, enunciado: 'Un corredor avanza $2.5$ km diarios de lunes a viernes, y $4.2$ km el sábado. Si el domingo descansa, ¿cuánto corrió en la semana?', alternativas: { A: '$6.7$ km', B: '$14.2$ km', C: '$16.7$ km', D: '$15.5$ km' }, respuesta_correcta: 'C', feedback_acierto: '¡Operaciones aplicadas al contexto bien logradas!', feedback_error: 'Lunes a viernes ($5$ días): $5 \\cdot 2.5 = 12.5$ km. Sábado: $4.2$ km. Total = $12.5 + 4.2 = 16.7$ km.' },
            { id: 1508, enunciado: 'Se quiere envasar $15$ litros de miel en frascos de $\\frac{3}{4}$ de litro. ¿Cuántos frascos se necesitan?', alternativas: { A: '$20$', B: '$12$', C: '$25$', D: '$18$' }, respuesta_correcta: 'A', feedback_acierto: '¡Buena división de fracciones!', feedback_error: 'Dividimos: $15 \\div \\frac{3}{4} = 15 \\cdot \\frac{4}{3} = \\frac{60}{3} = 20$ frascos.' },
            { id: 1509, enunciado: 'Marta gastó $\\frac{1}{3}$ de su sueldo en arriendo y $\\frac{1}{4}$ en comida. Si le quedan $\\frac{5}{12}$ del sueldo, ¿es correcto este cálculo sobrante?', alternativas: { A: 'Sí, es correcto', B: 'No, sobra 1/12', C: 'No, sobra 7/12', D: 'Falta información' }, respuesta_correcta: 'A', feedback_acierto: '¡Verificaste el resto a la perfección!', feedback_error: 'Gastó: $\\frac{1}{3} + \\frac{1}{4} = \\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$. Le queda: $1 - \\frac{7}{12} = \\frac{5}{12}$. Es correcto.' },
            { id: 1510, enunciado: 'Una empresa registró las siguientes ganancias mensuales (en millones): $3, -2, 5, -1, 4$. ¿Cuál fue la ganancia promedio mensual?', alternativas: { A: '$1.8$', B: '$2.5$', C: '$3.0$', D: '$1.5$' }, respuesta_correcta: 'A', feedback_acierto: '¡Promedio con signos bien calculado!', feedback_error: 'Suma: $3 - 2 + 5 - 1 + 4 = 9$. Promedio: $9 \\div 5 \\text{ meses} = 1.8$ millones.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-2',
        title: '6. Porcentaje',
        introduccion: 'Aprenderás a calcular porcentajes de forma rápida, aplicarlos a descuentos, recargos y problemas de la vida cotidiana financiera básica.',
        datos_claves: [
          'Un porcentaje es una fracción de denominador 100. Ejemplo: $25\\% = \\frac{25}{100} = \\frac{1}{4}$.',
          'Un aumento del $20\\%$ equivale a multiplicar por $1.20$.',
          'Un descuento del $20\\%$ equivale a multiplicar por $0.80$.'
        ],
        order: 6,
        test: {
          id: 'test-m1-num-2',
          contexto_base: '',
          preguntas: [
            { id: 201, enunciado: '¿Cuál es el $15\\%$ de $400$?', alternativas: { A: '$45$', B: '$60$', C: '$75$', D: '$15$' }, respuesta_correcta: 'B', feedback_acierto: '¡Cálculo mental rápido!', feedback_error: 'El $10\\%$ de $400$ es $40$. El $5\\%$ es la mitad, $20$. Sumamos: $40 + 20 = 60$. O por fórmula: $\\frac{15}{100} \\cdot 400 = 60$.' },
            { id: 202, enunciado: 'Un pantalón cuesta $\\$25.000$, pero hoy tiene un descuento del $20\\%$. ¿Cuánto se debe pagar finalmente?', alternativas: { A: '$\\$20.000$', B: '$\\$5.000$', C: '$\\$22.000$', D: '$\\$15.000$' }, respuesta_correcta: 'A', feedback_acierto: '¡Aplicaste bien el descuento!', feedback_error: 'El $20\\%$ de $25.000$ es $5.000$. Precio final = $25.000 - 5.000 = 20.000$.' },
            { id: 203, enunciado: 'Si $45$ es el $30\\%$ de un número, ¿cuál es el número?', alternativas: { A: '$150$', B: '$135$', C: '$100$', D: '$90$' }, respuesta_correcta: 'A', feedback_acierto: '¡Usaste la regla de tres correctamente!', feedback_error: 'Planteamos: $30\\% \\rightarrow 45$. Queremos el $100\\% \\rightarrow x$. $x = \\frac{100 \\cdot 45}{30} = 150$.' },
            { id: 204, enunciado: 'El sueldo de Pedro aumenta de $\\$500.000$ a $\\$550.000$. ¿Qué porcentaje de aumento recibió?', alternativas: { A: '$5\\%$', B: '$10\\%$', C: '$15\\%$', D: '$50\\%$' }, respuesta_correcta: 'B', feedback_acierto: '¡Identificaste la variación porcentual!', feedback_error: 'El aumento es de $\\$50.000$. Relación respecto al original: $\\frac{50.000}{500.000} = \\frac{1}{10} = 0.1$, que es el $10\\%$.' },
            { id: 205, enunciado: 'En una clase de $40$ alumnos, el $60\\%$ son mujeres. ¿Cuántos hombres hay en la clase?', alternativas: { A: '$24$', B: '$16$', C: '$14$', D: '$20$' }, respuesta_correcta: 'B', feedback_acierto: '¡Lógica impecable!', feedback_error: 'Si el $60\\%$ son mujeres, el $40\\%$ son hombres. El $40\\%$ de $40$ es: $\\frac{40}{100} \\cdot 40 = 16$.' },
            { id: 206, enunciado: 'El precio de un producto incluye un $19\\%$ de IVA. Si el precio total a pagar es $\\$11.900$, ¿cuál era el precio neto (sin IVA)?', alternativas: { A: '$\\$9.639$', B: '$\\$10.000$', C: '$\\$11.000$', D: '$\\$8.500$' }, respuesta_correcta: 'B', feedback_acierto: '¡Cálculo de precio neto correcto!', feedback_error: 'Precio total = Precio Neto $\\cdot 1.19$. Entonces, Precio Neto = $11.900 / 1.19 = 10.000$.' },
            { id: 207, enunciado: 'Un artículo que cuesta $A$ se rebaja en un $25\\%$. ¿Qué expresión representa el nuevo precio?', alternativas: { A: '$0.25A$', B: '$0.75A$', C: '$A - 25$', D: '$A / 4$' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien traducido al lenguaje algebraico!', feedback_error: 'Rebajar un $25\\%$ significa que pagas el $75\\%$ del producto. El $75\\%$ en decimal es $0.75A$.' },
            { id: 208, enunciado: 'Si a $\\$20.000$ le aplico un $10\\%$ de descuento y luego al resultado le aplico otro $10\\%$ de descuento, el precio final es:', alternativas: { A: '$\\$16.000$', B: '$\\$18.000$', C: '$\\$16.200$', D: '$\\$15.000$' }, respuesta_correcta: 'C', feedback_acierto: '¡Cuidado con los descuentos sucesivos resuelto!', feedback_error: 'Primer desc: $10\\%$ de $20.000 = 2.000$. Queda en $18.000$. Segundo desc: $10\\%$ de $18.000 = 1.800$. Final: $18.000 - 1.800 = 16.200$.' },
            { id: 209, enunciado: 'A es el $50\\%$ de B, y B es el $20\\%$ de C. ¿Qué porcentaje de C es A?', alternativas: { A: '$10\\%$', B: '$70\\%$', C: '$30\\%$', D: '$15\\%$' }, respuesta_correcta: 'A', feedback_acierto: '¡Excelente combinación de porcentajes!', feedback_error: '$A = 0.5 \\cdot B$. $B = 0.2 \\cdot C$. Reemplazando B en A: $A = 0.5 \\cdot (0.2 \\cdot C) = 0.1 \\cdot C$. Es el $10\\%$.' },
            { id: 210, enunciado: 'Se invierten $\\$50.000$ a interés simple con una tasa del $2\\%$ mensual. ¿Cuál será el capital acumulado en 5 meses?', alternativas: { A: '$\\$51.000$', B: '$\\$55.000$', C: '$\\$60.000$', D: '$\\$52.000$' }, respuesta_correcta: 'B', feedback_acierto: '¡Fórmula de interés simple aplicada correctamente!', feedback_error: 'Interés mensual = $2\\%$ de $50.000 = 1.000$. En 5 meses son $5.000$ de interés. Total = $50.000 + 5.000 = 55.000$.' }
          ]
        }
      },
      {
        id: 'sec-m1-num-3',
        title: '7. Potencias y raíces enésimas',
        introduccion: 'Abordaremos las propiedades operativas de las potencias y cómo las raíces se relacionan directamente con potencias de exponente fraccionario.',
        datos_claves: [
          'Multiplicación de igual base: $a^n \\cdot a^m = a^{n+m}$.',
          'Potencia de una potencia: $(a^n)^m = a^{n \\cdot m}$.',
          'Raíz enésima: $\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$.'
        ],
        order: 7,
        test: {
          id: 'test-m1-num-3',
          contexto_base: '',
          preguntas: [
            { id: 301, enunciado: '¿Cuál es el valor de $2^3 \\cdot 2^4$?', alternativas: { A: '$4^7$', B: '$2^{12}$', C: '$2^7$', D: '$4^{12}$' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien sumados los exponentes!', feedback_error: 'Al multiplicar potencias de igual base, se mantiene la base (2) y se suman los exponentes ($3 + 4 = 7$).' },
            { id: 302, enunciado: 'El resultado de $(5^2)^3$ es:', alternativas: { A: '$5^5$', B: '$5^6$', C: '$25^5$', D: '$10^3$' }, respuesta_correcta: 'B', feedback_acierto: '¡Potencia de potencia lograda!', feedback_error: 'En una potencia elevada a otro exponente, los exponentes se multiplican: $2 \\cdot 3 = 6$. Resultado: $5^6$.' },
            { id: 303, enunciado: '¿A qué equivale la expresión: $\\sqrt{50}$?', alternativas: { A: '$25\\sqrt{2}$', B: '$5\\sqrt{2}$', C: '$2\\sqrt{5}$', D: '$10$' }, respuesta_correcta: 'B', feedback_acierto: '¡Descomposición perfecta!', feedback_error: 'Descomponemos $50$ en un cuadrado perfecto: $\\sqrt{25 \\cdot 2} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$.' },
            { id: 304, enunciado: '¿Qué valor tiene $3^{-2}$?', alternativas: { A: '$-6$', B: '$-9$', C: '$\\frac{1}{6}$', D: '$\\frac{1}{9}$' }, respuesta_correcta: 'D', feedback_acierto: '¡Exponente negativo comprendido!', feedback_error: 'Un exponente negativo indica el inverso multiplicativo: $3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$.' },
            { id: 305, enunciado: 'Al simplificar $\\frac{x^4 \\cdot x^3}{x^2}$, se obtiene:', alternativas: { A: '$x^5$', B: '$x^6$', C: '$x^9$', D: '$x^4$' }, respuesta_correcta: 'A', feedback_acierto: '¡Propiedades aplicadas paso a paso!', feedback_error: 'Numerador: se suman exponentes ($4+3=7 \\rightarrow x^7$). División: se restan exponentes ($7-2=5 \\rightarrow x^5$).' },
            { id: 306, enunciado: 'La raíz cúbica de $27$ ($\\sqrt[3]{27}$) es igual a:', alternativas: { A: '$9$', B: '$3$', C: '$81$', D: '$-3$' }, respuesta_correcta: 'B', feedback_acierto: '¡Cálculo exacto!', feedback_error: 'Buscamos un número que multiplicado por sí mismo $3$ veces dé $27$. Ese número es $3$ ($3 \\cdot 3 \\cdot 3 = 27$).' },
            { id: 307, enunciado: 'Si se multiplica $\\sqrt{2}$ por $\\sqrt{8}$, el resultado es:', alternativas: { A: '$\\sqrt{10}$', B: '$4$', C: '$16$', D: '$\\sqrt{6}$' }, respuesta_correcta: 'B', feedback_acierto: '¡Unificación de raíces lograda!', feedback_error: 'Se pueden multiplicar los radicandos: $\\sqrt{2 \\cdot 8} = \\sqrt{16} = 4$.' },
            { id: 308, enunciado: '¿Cómo se expresa la raíz cuadrada de $a^3$ en forma de potencia?', alternativas: { A: '$a^{\\frac{2}{3}}$', B: '$a^6$', C: '$a^{\\frac{3}{2}}$', D: '$a^{1.5}$' }, respuesta_correcta: 'C', feedback_acierto: '¡Cambio de formato correcto!', feedback_error: 'El exponente interior (3) es el numerador y el índice de la raíz (2, implícito) es el denominador: $a^{\\frac{3}{2}}$.' },
            { id: 309, enunciado: 'El resultado de evaluar $(-2)^3$ es:', alternativas: { A: '$-6$', B: '$8$', C: '$-8$', D: '$6$' }, respuesta_correcta: 'C', feedback_acierto: '¡Base negativa y exponente impar!', feedback_error: 'Multiplicamos: $(-2) \\cdot (-2) \\cdot (-2) = -8$.' },
            { id: 310, enunciado: 'La expresión $(2^5 + 2^5)$ es equivalente a:', alternativas: { A: '$4^5$', B: '$2^{10}$', C: '$4^{10}$', D: '$2^6$' }, respuesta_correcta: 'D', feedback_acierto: '¡Excelente truco algebraico!', feedback_error: 'Tener dos veces algo es multiplicarlo por $2$. Entonces: $2 \\cdot (2^5) = 2^1 \\cdot 2^5 = 2^{1+5} = 2^6$.' }
          ]
        }
      }
    ]
  }
];

async function seedFirestore() {
  console.log('🌱 Starting Matematica M1 - Numeros seed (Expanded Version)...');

  try {
    await db.collection('lp_materias').doc(MATERIA_ID).set({ isActive: true }, { merge: true });
    console.log(`✅ Materia activada: ${MATERIA_ID}`);

    const capitulosRef = db.collection('lp_capitulos');
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      for (const sec of secciones) {
        const { test, ...seccionData } = sec;
        
        const secWithIds = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id
        };
        
        await seccionesRef.doc(sec.id).set(secWithIds);
        console.log(`✅ Sección seeded: ${sec.id}`);

        const testsRef = db.collection('lp_tests');
        await testsRef.doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        console.log(`✅ Test seeded: ${test.id}`);
      }
    }

    console.log('🎉 Seed de M1-Números EXPANDIDO completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

seedFirestore();
