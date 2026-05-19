const fs = require('fs');
const path = require('path');

// Helper for random integers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to shuffle alternatives so the correct answer is random
function shuffleAlternatives(q) {
  const correctText = q.alternativas[q.respuesta_correcta];
  const alts = [q.alternativas.A, q.alternativas.B, q.alternativas.C, q.alternativas.D];
  
  for (let i = alts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alts[i], alts[j]] = [alts[j], alts[i]];
  }
  
  q.alternativas = { A: alts[0], B: alts[1], C: alts[2], D: alts[3] };
  if (alts[0] === correctText) q.respuesta_correcta = 'A';
  else if (alts[1] === correctText) q.respuesta_correcta = 'B';
  else if (alts[2] === correctText) q.respuesta_correcta = 'C';
  else q.respuesta_correcta = 'D';
  
  return q;
}

// GUIDES FOR THE 9 STEPS OF DATOS Y PROBABILIDADES
const guides = {
  'sec-m1-4-1': { introduccion: 'Las tablas de frecuencia nos ayudan a organizar grandes cantidades de datos para entender cómo se distribuyen.', datos_claves: ['Frecuencia Absoluta ($f$): Cantidad de veces que se repite un dato.', 'Frecuencia Acumulada ($F$): Suma de las frecuencias absolutas hasta ese dato.', 'Frecuencia Relativa: $f / N$ (donde $N$ es el total de datos).'] },
  'sec-m1-4-2': { introduccion: 'Los gráficos nos permiten visualizar tendencias de forma rápida y directa.', datos_claves: ['Gráfico circular: Ideal para porcentajes.', 'Gráfico de barras: Para comparar categorías.', 'Histograma: Para datos agrupados en intervalos.'] },
  'sec-m1-4-3': { introduccion: 'El promedio (media aritmética) es el centro de masa de nuestros datos.', datos_claves: ['Fórmula: Sumar todos los datos y dividir por la cantidad total ($N$).', 'Si agregamos un dato mayor al promedio actual, el nuevo promedio sube.'] },
  'sec-m1-4-4': { introduccion: 'Al resolver problemas estadísticos, debes ser capaz de extraer información implícita de tablas o textos.', datos_claves: ['Lee cuidadosamente los ejes de los gráficos.', 'Asegúrate de no confundir frecuencia absoluta con el valor de la variable en sí.'] },
  'sec-m1-4-5': { introduccion: 'Las medidas de posición dividen los datos ordenados en partes iguales.', datos_claves: ['Cuartiles ($Q_1, Q_2, Q_3$): Dividen en 4 partes (25%, 50%, 75%).', 'Percentiles ($P_k$): Dividen en 100 partes.', 'El Cuartil 2 ($Q_2$) es exactamente igual a la Mediana y al Percentil 50 ($P_{50}$).'] },
  'sec-m1-4-6': { introduccion: 'El diagrama de cajón (Boxplot) es una representación visual de los cuartiles.', datos_claves: ['Los "bigotes" muestran el Mínimo y el Máximo.', 'La caja central contiene el 50% de los datos.', 'Los bordes de la caja son $Q_1$ y $Q_3$, y la línea interior es $Q_2$ (Mediana).'] },
  'sec-m1-4-7': { introduccion: 'Interpretar las medidas de posición te ayuda a entender en qué lugar relativo te encuentras respecto al resto.', datos_claves: ['Si tu puntaje está en el percentil 80, superaste al 80% de las personas y el 20% te superó a ti.'] },
  'sec-m1-4-8': { introduccion: 'La probabilidad mide la incerteza de que ocurra un evento.', datos_claves: ['Regla de Laplace: $P(E) = \\frac{\\text{Casos Favorables}}{\\text{Casos Totales}}$', 'La probabilidad siempre es un número entre 0 (imposible) y 1 (seguro).'] },
  'sec-m1-4-9': { introduccion: 'A veces queremos calcular la probabilidad de que ocurran varios eventos.', datos_claves: ['Regla Aditiva ("O"): Sumar probabilidades (si son mutuamente excluyentes).', 'Regla Multiplicativa ("Y"): Multiplicar probabilidades (si son independientes).'] }
};

// GENERATORS FOR THE 90 QUESTIONS
function generateQuestions() {
  const tests = [];
  
  for(let step = 1; step <= 9; step++) {
    for(let i = 1; i <= 10; i++) {
      let q = {
        id: parseInt(`4${step.toString().padStart(2, '0')}${i.toString().padStart(2, '0')}`),
        enunciado: "", alternativas: {}, respuesta_correcta: "A", feedback_acierto: "¡Correcto!", feedback_error: ""
      };
      
      // STEP 1: Tablas de frecuencia
      if (step === 1) {
        const total = randInt(20, 50);
        const f1 = randInt(5, 10), f2 = randInt(5, 10), f3 = total - f1 - f2;
        if (i % 3 === 0) q.enunciado = `En una encuesta a $${total}$ personas, $${f1}$ eligen el color rojo, $${f2}$ el azul y el resto verde. ¿Cuál es la frecuencia relativa de los que eligen verde?`;
        else if (i % 3 === 1) q.enunciado = `De un grupo de $${total}$ animales, $${f1}$ son gatos, $${f2}$ son perros y los demás son aves. ¿Qué frecuencia relativa representan las aves?`;
        else q.enunciado = `Una caja tiene $${total}$ pelotas: $${f1}$ rojas, $${f2}$ blancas y el resto negras. Determina la frecuencia relativa de sacar una negra.`;
        q.alternativas = { A: `$${f3}/${total}$`, B: `$${f1}/${total}$`, C: `$${f2}/${total}$`, D: `$${f3}$` };
        q.feedback_error = `Los restantes son $${total} - ${f1} - ${f2} = ${f3}$. La frecuencia relativa es $${f3}/${total}$.`;
      }
      // STEP 2: Gráficos
      else if (step === 2) {
        const porc1 = randInt(20, 40);
        const total = randInt(100, 300, 50);
        if (i % 3 === 0) q.enunciado = `En un gráfico circular de $${total}$ encuestados, el sector "Fútbol" abarca un $${porc1}\\%$. ¿Cuántas personas eligieron Fútbol?`;
        else if (i % 3 === 1) q.enunciado = `Un diagrama de torta muestra que el $${porc1}\\%$ de $${total}$ alumnos prefiere matemáticas. ¿A cuántos alumnos equivale?`;
        else q.enunciado = `De un total de $${total}$ ventas, el gráfico muestra que un $${porc1}\\%$ corresponde a tecnología. Calcula la cantidad exacta.`;
        q.alternativas = { A: `$${(porc1 * total)/100}$`, B: `$${porc1}$`, C: `$${((100-porc1) * total)/100}$`, D: `$${total / 2}$` };
        q.feedback_error = `El $${porc1}\\%$ de $${total}$ es: $${total} \\cdot \\frac{${porc1}}{100} = ${(porc1 * total)/100}$.`;
      }
      // STEP 3: Promedio
      else if (step === 3) {
        const n1 = randInt(4, 8), n2 = randInt(4, 8), n3 = randInt(4, 8), n4 = randInt(4, 8);
        const suma = n1 + n2 + n3 + n4;
        if (i % 3 === 0) q.enunciado = `Las notas de Juan son: $${n1}, ${n2}, ${n3}, ${n4}$. ¿Cuál es su promedio exacto?`;
        else if (i % 3 === 1) q.enunciado = `Las edades de 4 niños son $${n1}, ${n2}, ${n3}, ${n4}$. Calcula la edad media.`;
        else q.enunciado = `Los tiempos registrados en una carrera fueron $${n1}, ${n2}, ${n3}$ y $${n4}$ segundos. ¿Cuál es el tiempo medio?`;
        q.alternativas = { A: `$${suma/4}$`, B: `$${(suma+1)/4}$`, C: `$${suma/3}$`, D: `$${suma/5}$` };
        q.feedback_error = `Suma: $${n1} + ${n2} + ${n3} + ${n4} = ${suma}$. Dividido por 4: $${suma/4}$.`;
      }
      // STEP 4: Problemas Estadísticos
      else if (step === 4) {
        const promObj = randInt(50, 80);
        const extra = randInt(5, 15);
        if (i % 3 === 0) q.enunciado = `El promedio de dos notas es $${promObj}$. Si en la primera obtuve $${promObj - extra}$, ¿cuánto obtuve en la segunda?`;
        else if (i % 3 === 1) q.enunciado = `Para que la media de dos bolsas sea $${promObj}$ kg, sabiendo que una pesa $${promObj - extra}$ kg, ¿cuánto debe pesar la otra?`;
        else q.enunciado = `Dos amigos tienen en promedio $${promObj}$ puntos. Si uno sacó $${promObj - extra}$, ¿qué puntaje tiene el amigo?`;
        q.alternativas = { A: `$${promObj + extra}$`, B: `$${promObj}$`, C: `$${promObj - extra}$`, D: `$${promObj + extra*2}$` };
        q.feedback_error = `Suma requerida = $${promObj * 2}$. El segundo valor es $${promObj * 2} - ${promObj - extra} = ${promObj + extra}$.`;
      }
      // STEP 5: Cuartiles y percentiles
      else if (step === 5) {
        const start = randInt(2, 8);
        const data = [start, start+1, start+3, start+6, start+9];
        if (i % 3 === 0) q.enunciado = `Dado el conjunto ordenado: $\\{${data.join(', ')}\\}$, ¿cuál es el valor de la Mediana (o Cuartil 2)?`;
        else if (i % 3 === 1) q.enunciado = `Para los siguientes datos: $\\{${data.join(', ')}\\}$, encuentra el Percentil 50.`;
        else q.enunciado = `¿Qué valor ocupa la posición central en la muestra $\\{${data.join(', ')}\\}$?`;
        q.alternativas = { A: `$${data[2]}$`, B: `$${data[1]}$`, C: `$${data[3]}$`, D: `$${(data[2]+data[3])/2}$` };
        q.feedback_error = `Para cantidad impar (5 datos), la mediana es el dato 3. El valor es $${data[2]}$.`;
      }
      // STEP 6: Diagrama de cajón
      else if (step === 6) {
        const type = randInt(0, 2);
        if (type === 0) {
            q.enunciado = `En un diagrama de cajón (boxplot), ¿qué porcentaje de los datos se encuentra DENTRO de la caja central delimitada por $Q_1$ y $Q_3$?`;
            q.alternativas = { A: `$50\\%$`, B: `$25\\%$`, C: `$75\\%$`, D: `$100\\%$` };
            q.feedback_error = `La caja va del $25\\%$ al $75\\%$. Contiene el $50\\%$ central.`;
        } else if (type === 1) {
            q.enunciado = `En un diagrama de cajón, ¿qué porcentaje de los datos está ubicado desde el mínimo hasta la Mediana ($Q_2$)?`;
            q.alternativas = { A: `$50\\%$`, B: `$25\\%$`, C: `$75\\%$`, D: `$100\\%$` };
            q.feedback_error = `La mediana ($Q_2$) corta la muestra en la mitad exacta, agrupando al $50\\%$ de los datos por debajo.`;
        } else {
            q.enunciado = `¿Qué cantidad relativa de la muestra se ubica por encima del Tercer Cuartil ($Q_3$) en un diagrama de cajón?`;
            q.alternativas = { A: `$25\\%$`, B: `$50\\%$`, C: `$75\\%$`, D: `$100\\%$` };
            q.feedback_error = `El Tercer Cuartil acumula el $75\\%$. Por lo tanto, queda un $25\\%$ por encima de él hasta el máximo.`;
        }
      }
      // STEP 7: Problemas de posición
      else if (step === 7) {
        const p = randInt(60, 90);
        if (i % 3 === 0) q.enunciado = `En una evaluación, Pedro quedó en el percentil $${p}$. Esto significa exactamente que:`;
        else if (i % 3 === 1) q.enunciado = `Un bebé tiene su peso en el percentil $${p}$. La interpretación estadística correcta es que:`;
        else q.enunciado = `El sueldo de Ana se ubica en el percentil $${p}$ de la empresa. En otras palabras:`;
        q.alternativas = { A: `Su valor supera o iguala al $${p}\\%$ del grupo evaluado.`, B: `Respondió o alcanzó un $${p}\\%$ del máximo posible.`, C: `El $${p}\\%$ del grupo lo supera a él.`, D: `Pertenece al $${100-p}\\%$ más bajo.` };
        q.feedback_error = `Estar en el percentil $${p}$ significa que tu valor es mayor o igual al del $${p}\\%$ de la población.`;
      }
      // STEP 8: Probabilidad simple
      else if (step === 8) {
        if (i <= 5) {
          const isPar = i % 2 === 0;
          q.enunciado = isPar 
            ? `Al lanzar un dado normal de 6 caras, ¿cuál es la probabilidad de obtener un número par?`
            : `Si se lanza un dado tradicional de 6 lados, la probabilidad de que caiga un número impar es:`;
          q.alternativas = { A: `$3/6$ (o $1/2$)`, B: `$1/6$`, C: `$2/6$`, D: `$4/6$` };
          q.feedback_error = `Los casos favorables son 3. Casos totales: 6. Por Laplace, la probabilidad es $3/6 = 1/2$.`;
        } else {
          const azules = randInt(2, 5), rojas = randInt(3, 7);
          if (i % 2 === 0) q.enunciado = `En una urna hay $${azules}$ bolas azules y $${rojas}$ rojas. Si se extrae una al azar, ¿cuál es la probabilidad de que NO sea roja?`;
          else q.enunciado = `Una caja contiene $${azules}$ canicas azules y $${rojas}$ rojas. Determina la probabilidad de sacar una canica azul.`;
          q.alternativas = { A: `$${azules}/${azules+rojas}$`, B: `$${rojas}/${azules+rojas}$`, C: `$1/${azules+rojas}$`, D: `$${azules}/${rojas}$` };
          q.feedback_error = `Hay $${azules}$ azules de un total de $${azules+rojas}$. Probabilidad = $${azules}/${azules+rojas}$.`;
        }
      }
      // STEP 9: Regla aditiva y multiplicativa
      else if (step === 9) {
        if (i <= 5) {
          if (i % 2 === 0) q.enunciado = `Se lanzan dos monedas al aire. ¿Cuál es la probabilidad de obtener "Cara" en la primera moneda Y "Sello" en la segunda?`;
          else q.enunciado = `Calcula la probabilidad de que al tirar un dado salga par Y al lanzar una moneda salga Cara.`;
          q.alternativas = { A: `$1/4$`, B: `$1/2$`, C: `$3/4$`, D: `$1/3$` };
          q.feedback_error = `Son independientes. Probabilidades $1/2$ y $1/2$. Como es "Y", se multiplican: $1/2 \\cdot 1/2 = 1/4$.`;
        } else {
          if (i % 2 === 0) q.enunciado = `Al sacar una carta de un mazo inglés de 52, ¿cuál es la probabilidad de sacar un "As" O un "Rey"?`;
          else q.enunciado = `En un naipe de 52 cartas, determina la probabilidad de obtener un "2" O un "3" al sacar una sola carta.`;
          q.alternativas = { A: `$8/52$`, B: `$4/52$`, C: `$2/52$`, D: `$1/52$` };
          q.feedback_error = `Hay 4 de cada uno. Son mutuamente excluyentes. "O" indica suma: $4/52 + 4/52 = 8/52$.`;
        }
      }
      
      // Fix decimal format (, instead of .)
      const fixDec = (str) => typeof str === 'string' ? str.replace(/(\d)\.(\d)/g, '$1,$2') : str;
      q.enunciado = fixDec(q.enunciado);
      q.alternativas.A = fixDec(q.alternativas.A);
      q.alternativas.B = fixDec(q.alternativas.B);
      q.alternativas.C = fixDec(q.alternativas.C);
      q.alternativas.D = fixDec(q.alternativas.D);
      q.feedback_error = fixDec(q.feedback_error);
      q.feedback_acierto = fixDec(q.feedback_acierto);
      
      tests.push(shuffleAlternatives(q));
    }
  }
  return tests;
}

const allQuestions = generateQuestions();

// Read existing local mocks
const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

const capitulos = require(capitulosPath);
const capTarget = capitulos.find(c => c.id === 'cap-m1-4-datos');

if (capTarget) {
  console.log('✅ Injecting 90 questions into Probabilidad y Estadística...');
  
  capTarget.secciones.forEach((sec, idx) => {
    const step = idx + 1;
    if (typeof guides !== 'undefined' && guides[sec.id]) {
      sec.introduccion = guides[sec.id].introduccion;
      sec.datos_claves = guides[sec.id].datos_claves;
    }
    sec.test = {
      id: `test-m1-4-${step}`,
      seccionId: sec.id,
      preguntas: allQuestions.filter(q => q.id.toString().startsWith(`4${step.toString().padStart(2, '0')}`))
    };
  });
}

fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2));
console.log('🎉 Probabilidad y Estadística written to local mock!');
