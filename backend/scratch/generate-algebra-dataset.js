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

// GUIDES FOR THE 19 STEPS
const guides = {
  'sec-m1-2-1': { introduccion: 'Los productos notables son reglas de multiplicación de polinomios que nos permiten encontrar el resultado de forma directa.', datos_claves: ['Cuadrado de binomio: $(a \\pm b)^2 = a^2 \\pm 2ab + b^2$', 'Suma por diferencia: $(a+b)(a-b) = a^2 - b^2$', 'Binomio con término común: $(x+a)(x+b) = x^2 + (a+b)x + ab$'] },
  'sec-m1-2-2': { introduccion: 'La factorización es el proceso inverso de los productos notables; consiste en expresar una suma o resta como un producto.', datos_claves: ['Factor común: $ax + ay = a(x+y)$', 'Diferencia de cuadrados: $x^2 - y^2 = (x+y)(x-y)$', 'Trinomios: $x^2 + px + q$ buscamos dos números que sumen $p$ y multipliquen $q$.'] },
  'sec-m1-2-3': { introduccion: 'Al operar con expresiones algebraicas (fracciones o sumas), aplicamos las reglas de factorización para simplificar términos.', datos_claves: ['Solo puedes simplificar factores que multiplican a todo el numerador y denominador.', 'Para sumar o restar fracciones algebraicas, necesitas un Mínimo Común Múltiplo (m.c.m).'] },
  'sec-m1-2-4': { introduccion: 'Los problemas algebraicos requieren traducir el lenguaje cotidiano a lenguaje matemático.', datos_claves: ['"El doble de": $2x$', '"El cuadrado de la suma": $(x+y)^2$', '"La suma de los cuadrados": $x^2 + y^2$'] },
  'sec-m1-2-5': { introduccion: 'Dos variables pueden relacionarse de forma directamente proporcional (cociente constante) o inversamente proporcional (producto constante).', datos_claves: ['Directa: Si una sube, la otra sube. $y/x = k$', 'Inversa: Si una sube, la otra baja. $x \\cdot y = k$'] },
  'sec-m1-2-6': { introduccion: 'En problemas de proporcionalidad, identificar si la relación es directa o inversa es el primer paso crítico.', datos_claves: ['Velocidad y tiempo: Inversa.', 'Cantidad comprada y costo total: Directa.', 'Obreros y días de trabajo: Inversa.'] },
  'sec-m1-2-7': { introduccion: 'Una ecuación lineal busca encontrar el valor de la incógnita $x$ que equilibre la igualdad.', datos_claves: ['Agrupa las $x$ a un lado y los números al otro.', 'Si un término suma, pasa restando.', 'Si multiplica, pasa dividiendo (con su signo).'] },
  'sec-m1-2-8': { introduccion: 'La clave para resolver problemas de ecuaciones es definir correctamente quién es tu "x".', datos_claves: ['Define $x$ como la cantidad más pequeña o la que te preguntan.', 'Lee bien si piden el valor de $x$ o alguna operación con $x$ al final.'] },
  'sec-m1-2-9': { introduccion: 'Las inecuaciones son desigualdades. Se resuelven igual que las ecuaciones, pero con una regla de oro.', datos_claves: ['Regla de Oro: Si multiplicas o divides por un número NEGATIVO, el signo de la desigualdad se INVIERTE (ej: $<$ pasa a $>$).', 'El resultado es un intervalo, no un solo número.'] },
  'sec-m1-2-10': { introduccion: 'En problemas de inecuaciones, palabras como "al menos" o "a lo más" definen el signo.', datos_claves: ['"Al menos 5": $\\ge 5$', '"A lo más 10": $\\le 10$', '"Mayor que": $>$'] },
  'sec-m1-2-11': { introduccion: 'Un sistema de ecuaciones 2x2 busca el punto $(x,y)$ donde dos rectas se intersectan.', datos_claves: ['Métodos: Reducción (sumar ecuaciones), Sustitución o Igualación.', 'Si llegas a $0 = 0$, hay infinitas soluciones. Si llegas a $0 = 5$, no hay solución.'] },
  'sec-m1-2-12': { introduccion: 'Traduce los problemas a dos ecuaciones con dos incógnitas.', datos_claves: ['Ej: "La suma de dos números es 10": $x + y = 10$', '"La diferencia es 4": $x - y = 4$'] },
  'sec-m1-2-13': { introduccion: 'La función lineal pasa por el origen $f(x) = mx$. La función afín no pasa por el origen $f(x) = mx + n$.', datos_claves: ['$m$: Pendiente (inclinación).', '$n$: Coeficiente de posición (corte en el eje Y).'] },
  'sec-m1-2-14': { introduccion: 'Podemos modelar una función afín a partir de una tabla de valores o dos puntos.', datos_claves: ['Pendiente $m = \\frac{y_2 - y_1}{x_2 - x_1}$', 'Corte en Y: Punto donde $x = 0$.'] },
  'sec-m1-2-15': { introduccion: 'Las funciones modelan cobros fijos y variables.', datos_claves: ['Cargo fijo: es la "n".', 'Cobro por minuto/unidad: es la "m".', 'Costo total = $mx + n$.'] },
  'sec-m1-2-16': { introduccion: 'Una ecuación de 2do grado ($ax^2 + bx + c = 0$) puede tener hasta dos soluciones reales.', datos_claves: ['Fórmula general: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', 'Discriminante $\\Delta = b^2 - 4ac$. Si $\\Delta > 0$ hay 2 sol. reales.'] },
  'sec-m1-2-17': { introduccion: 'El gráfico de una función cuadrática es una parábola.', datos_claves: ['Si $a > 0$, abre hacia arriba ∪.', 'Si $a < 0$, abre hacia abajo ∩.', 'Corta al eje Y en $(0, c)$.'] },
  'sec-m1-2-18': { introduccion: 'El vértice es el punto máximo o mínimo de la parábola.', datos_claves: ['Coordenada x del vértice: $x = -\\frac{b}{2a}$', 'Eje de simetría: recta vertical $x = -\\frac{b}{2a}$'] },
  'sec-m1-2-19': { introduccion: 'Muchos problemas físicos (lanzamiento de proyectiles) se modelan con parábolas.', datos_claves: ['Altura máxima: es la coordenada Y del vértice.', 'Tiempo para llegar al suelo: resolver $f(t) = 0$.'] }
};

// GENERATORS FOR THE 190 QUESTIONS
function generateQuestions() {
  const tests = [];
  
  for(let step = 1; step <= 19; step++) {
    for(let i = 1; i <= 10; i++) {
      let q = {
        id: parseInt(`2${step.toString().padStart(2, '0')}${i.toString().padStart(2, '0')}`),
        enunciado: "", alternativas: {}, respuesta_correcta: "A", feedback_acierto: "¡Correcto!", feedback_error: ""
      };
      
      // STEP 1: Productos Notables
      if (step === 1) {
        const a = randInt(2, 9), b = randInt(2, 9);
        if (i === 1) {
          q.enunciado = `Desarrolla el siguiente producto notable: $(x + ${a})(x + ${b})$`;
        } else if (i === 2) {
          q.enunciado = `Calcula el resultado algebraico al multiplicar los binomios: $(x + ${a})(x + ${b})$`;
        } else if (i === 3) {
          q.enunciado = `¿Cuál es el desarrollo correcto de la expresión $(x + ${a})(x + ${b})$?`;
        }
        if (i <= 3) {
          q.alternativas = { A: `$x^2 + ${a+b}x + ${a*b}$`, B: `$x^2 + ${a*b}x + ${a+b}$`, C: `$x^2 + ${a+b}x + ${a+b}$`, D: `$x^2 + ${a}x + ${b}$` };
          q.feedback_error = `El producto es $x^2 + (a+b)x + ab$. Suma: ${a}+${b}=${a+b}. Multiplicación: ${a}\\cdot${b}=${a*b}$.`;
        } else if (i <= 6) {
          if (i === 4) q.enunciado = `Desarrolla el cuadrado de binomio: $(x + ${a})^2$`;
          else if (i === 5) q.enunciado = `¿Cuál es la expresión equivalente a desarrollar $(x + ${a})^2$?`;
          else q.enunciado = `Calcula algebraicamente: $(x + ${a})^2$`;
          q.alternativas = { A: `$x^2 + ${2*a}x + ${a*a}$`, B: `$x^2 + ${a}x + ${a*a}$`, C: `$x^2 + ${a*a}$`, D: `$x^2 + ${2*a}x + ${2*a}$` };
          q.feedback_error = `Fórmula: $x^2 + 2ax + a^2$. Resulta $x^2 + 2(${a})x + ${a}^2 = x^2 + ${2*a}x + ${a*a}$.`;
        } else {
          if (i === 7) q.enunciado = `Desarrolla la suma por diferencia: $(x + ${a})(x - ${a})$`;
          else if (i === 8) q.enunciado = `Aplica la regla de suma por diferencia en: $(x + ${a})(x - ${a})$`;
          else if (i === 9) q.enunciado = `Calcula el producto de los conjugados: $(x + ${a})(x - ${a})$`;
          else q.enunciado = `Expande la expresión $(x + ${a})(x - ${a})$ y reduce términos semejantes.`;
          q.alternativas = { A: `$x^2 - ${a*a}$`, B: `$x^2 + ${a*a}$`, C: `$x^2 - ${2*a}x - ${a*a}$`, D: `$x^2 - ${2*a}$` };
          q.feedback_error = `Suma por diferencia: $(x+a)(x-a) = x^2 - a^2$. Resulta $x^2 - ${a}^2 = x^2 - ${a*a}$.`;
        }
      }
      // STEP 2: Factorizaciones
      else if (step === 2) {
        const p = randInt(2, 6), q_val = randInt(3, 8);
        if (i <= 4) {
          if (i === 1) q.enunciado = `Factoriza la siguiente expresión: $x^2 - ${p*p}$`;
          else if (i === 2) q.enunciado = `Encuentra la factorización correcta para la diferencia: $x^2 - ${p*p}$`;
          else if (i === 3) q.enunciado = `¿Cómo se expresa como producto la expresión $x^2 - ${p*p}$?`;
          else q.enunciado = `Al factorizar completamente $x^2 - ${p*p}$, obtenemos:`;
          
          q.alternativas = { A: `$(x - ${p})(x + ${p})$`, B: `$(x - ${p})^2$`, C: `$(x + ${p})^2$`, D: `$(x - ${p*p})(x + 1)$` };
          q.feedback_error = `Es una diferencia de cuadrados: $a^2 - b^2 = (a-b)(a+b)$. Aquí $b=${p}$.`;
        } else {
          const sum = p + q_val, prod = p * q_val;
          if (i === 5) q.enunciado = `Factoriza el trinomio: $x^2 + ${sum}x + ${prod}$`;
          else if (i === 6) q.enunciado = `Expresa como producto de dos binomios el trinomio $x^2 + ${sum}x + ${prod}$`;
          else if (i === 7) q.enunciado = `¿Cuál es la factorización de $x^2 + ${sum}x + ${prod}$?`;
          else if (i === 8) q.enunciado = `La forma factorizada de la expresión cuadrática $x^2 + ${sum}x + ${prod}$ es:`;
          else if (i === 9) q.enunciado = `Encuentra los factores algebraicos de $x^2 + ${sum}x + ${prod}$.`;
          else q.enunciado = `Determina los dos binomios que al multiplicarse resultan en $x^2 + ${sum}x + ${prod}$.`;
          q.alternativas = { A: `$(x + ${p})(x + ${q_val})$`, B: `$(x + ${prod})(x + 1)$`, C: `$(x + ${sum})(x + ${prod})$`, D: `$(x - ${p})(x - ${q_val})$` };
          q.feedback_error = `Buscamos dos números que sumen ${sum} y multipliquen ${prod}. Esos son ${p} y ${q_val}.`;
        }
      }
      // STEP 3: Operatoria
      else if (step === 3) {
        const a = randInt(2, 6);
        if (i % 3 === 0) q.enunciado = `Simplifica la siguiente fracción algebraica: $\\frac{x^2 - ${a*a}}{x - ${a}}$ (asumiendo $x \\neq ${a}$)`;
        else if (i % 3 === 1) q.enunciado = `Reduce la expresión $\\frac{x^2 - ${a*a}}{x - ${a}}$ a su forma más simple.`;
        else q.enunciado = `Al simplificar la fracción $\\frac{x^2 - ${a*a}}{x - ${a}}$, ¿qué se obtiene?`;
        q.alternativas = { A: `$x + ${a}$`, B: `$x - ${a}$`, C: `$x^2 - ${a}$`, D: `$1$` };
        q.feedback_error = `Factoriza el numerador: $(x-${a})(x+${a})$. Se simplifica el denominador $x-${a}$, quedando $x+${a}$.`;
      }
      // STEP 4: Problemas Algebraicos
      else if (step === 4) {
        const m = randInt(3, 8);
        if (i % 3 === 0) q.enunciado = `El doble de un número $x$ más su triple es igual a ${m * 5}. ¿Cuál es la ecuación correcta?`;
        else if (i % 3 === 1) q.enunciado = `Si sumamos dos veces un número $x$ con tres veces el mismo número, obtenemos ${m * 5}. ¿Qué expresión lo representa?`;
        else q.enunciado = `La suma entre el doble y el triple de una incógnita $x$ da como resultado ${m * 5}.`;
        q.alternativas = { A: `$2x + 3x = ${m*5}$`, B: `$x^2 + x^3 = ${m*5}$`, C: `$2x + 3 = ${m*5}$`, D: `$x + 3x = ${m*5}$` };
        q.feedback_error = `"El doble" es $2x$, "el triple" es $3x$. Suma: $2x+3x = ${m*5}$.`;
      }
      // STEP 5: Proporción
      else if (step === 5) {
        const k = randInt(2, 6);
        if (i % 3 === 0) q.enunciado = `Las variables $x$ e $y$ son directamente proporcionales. Si cuando $x=2$, $y=${2*k}$, ¿cuál es el valor de $y$ cuando $x=5$?`;
        else if (i % 3 === 1) q.enunciado = `En una proporción directa, a $x=2$ le corresponde $y=${2*k}$. Determina $y$ para $x=5$.`;
        else q.enunciado = `Si $x$ crece proporcionalmente con $y$, y sabemos que $y(${2})=${2*k}$, ¿cuánto vale $y(5)$?`;
        q.alternativas = { A: `$${5*k}$`, B: `$${5*k + 2}$`, C: `$${2*k}$`, D: `$10$` };
        q.feedback_error = `Constante $k = y/x = ${2*k}/2 = ${k}$. Luego $y = ${k} \\cdot 5 = ${5*k}$.`;
      }
      // STEP 6: Problemas de proporción
      else if (step === 6) {
        const obreros = randInt(4, 10);
        const dias = randInt(12, 24);
        if (i % 3 === 0) q.enunciado = `Un equipo de ${obreros} obreros de manera conjunta demora ${dias} días en pintar un colegio. Si se duplica la cantidad de obreros trabajando al mismo ritmo, ¿cuántos días demorarán?`;
        else if (i % 3 === 1) q.enunciado = `Para construir un muro, ${obreros} albañiles tardan ${dias} días. ¿Cuánto tiempo tomará si se contrata al doble de trabajadores?`;
        else q.enunciado = `${obreros} máquinas tardan ${dias} horas en producir las piezas. ¿Qué tiempo tomarían ${obreros*2} máquinas?`;
        q.alternativas = { A: `$${dias/2}$ días/horas`, B: `$${dias*2}$ días/horas`, C: `$${dias}$ días/horas`, D: `$${dias/4}$ días/horas` };
        q.feedback_error = `Proporción INVERSA: más obreros $\\implies$ MENOS tiempo. Al doble de obreros, se reduce a la mitad: ${dias/2}.`;
      }
      // STEP 7: Ecuaciones lineales
      else if (step === 7) {
        const x = randInt(2, 9);
        const a = randInt(2, 5);
        const b = randInt(1, 10);
        const c = a*x + b;
        if (i % 3 === 0) q.enunciado = `Resuelve la ecuación: $${a}x + ${b} = ${c}$`;
        else if (i % 3 === 1) q.enunciado = `Encuentra el valor de $x$ que satisface: $${a}x + ${b} = ${c}$`;
        else q.enunciado = `Determina la incógnita en la igualdad: $${a}x + ${b} = ${c}$`;
        q.alternativas = { A: `$x = ${x}$`, B: `$x = ${x+1}$`, C: `$x = ${x-1}$`, D: `$x = -${x}$` };
        q.feedback_error = `$${a}x = ${c} - ${b} \\implies ${a}x = ${a*x} \\implies x = ${x}$.`;
      }
      // STEP 8: Problemas ecuaciones
      else if (step === 8) {
        const x = randInt(10, 30);
        if (i % 3 === 0) q.enunciado = `La suma de tres números enteros consecutivos es ${x + (x+1) + (x+2)}. ¿Cuál es el número menor?`;
        else if (i % 3 === 1) q.enunciado = `Tres hermanos tienen edades consecutivas que suman ${x*3 + 3}. ¿Qué edad tiene el hermano menor?`;
        else q.enunciado = `La suma de los precios de tres libros consecutivos en una serie asciende a ${x*3 + 3} mil pesos. El más barato cuesta:`;
        q.alternativas = { A: `$${x}$`, B: `$${x+1}$`, C: `$${x+2}$`, D: `$${x-1}$` };
        q.feedback_error = `$x + (x+1) + (x+2) = ${3*x+3} \\implies 3x + 3 = ${3*x+3} \\implies 3x = ${3*x} \\implies x = ${x}$.`;
      }
      // STEP 9: Inecuaciones
      else if (step === 9) {
        const limite = randInt(4, 10);
        if (i % 3 === 0) q.enunciado = `Resuelve la inecuación: $-3x < -${3*limite}$`;
        else if (i % 3 === 1) q.enunciado = `Encuentra el intervalo solución para: $-3x < -${3*limite}$`;
        else q.enunciado = `¿Qué valores satisfacen la desigualdad $-3x < -${3*limite}$?`;
        q.alternativas = { A: `$x > ${limite}$`, B: `$x < ${limite}$`, C: `$x \\ge ${limite}$`, D: `$x \\le ${limite}$` };
        q.feedback_error = `Al dividir por el negativo (-3), el signo de desigualdad cambia: $x > ${limite}$.`;
      }
      // STEP 10: Problemas inecuaciones
      else if (step === 10) {
        const limite = randInt(10, 20);
        if (i % 3 === 0) q.enunciado = `Un ascensor soporta máximo $400$ kg. Si cada caja pesa $${limite}$ kg, ¿cuál es la inecuación para $c$ cajas sin exceder el límite?`;
        else if (i % 3 === 1) q.enunciado = `Tengo $400$ litros de agua. Si cada cubeta se lleva $${limite}$ litros, la inecuación que representa no pasarme del total de $c$ cubetas es:`;
        else q.enunciado = `El presupuesto es $400$ mil. Si un producto cuesta $${limite}$ mil, la inecuación para no endeudarme con $c$ productos es:`;
        q.alternativas = { A: `$${limite}c \\le 400$`, B: `$${limite}c < 400$`, C: `$${limite}c \\ge 400$`, D: `$c \\le 400 - ${limite}$` };
        q.feedback_error = `El total no puede exceder $400$, es decir, "menor o igual a $400$": $${limite}c \\le 400$.`;
      }
      // STEP 11: Sistemas 2x2
      else if (step === 11) {
        const x = randInt(2, 6), y = randInt(1, 5);
        if (i % 3 === 0) q.enunciado = `Resuelve el sistema: \n $x + y = ${x+y}$ \n $x - y = ${x-y}$`;
        else if (i % 3 === 1) q.enunciado = `¿Cuál es el punto de intersección $(x,y)$ de estas dos rectas?\n $x + y = ${x+y}$ \n $x - y = ${x-y}$`;
        else q.enunciado = `Encuentra $x$ e $y$ en el sistema:\n $x + y = ${x+y}$ \n $x - y = ${x-y}$`;
        q.alternativas = { A: `$x = ${x}, y = ${y}$`, B: `$x = ${y}, y = ${x}$`, C: `$x = ${x+1}, y = ${y-1}$`, D: `$x = ${x}, y = -${y}$` };
        q.feedback_error = `Por reducción (sumando): $2x = ${2*x} \\implies x = ${x}$. Reemplazando: $y = ${y}$.`;
      }
      // STEP 12: Problemas sistemas
      else if (step === 12) {
        const a = randInt(10, 20), p = randInt(5, 15);
        if (i % 3 === 0) q.enunciado = `Hay cerdos (4 patas) y gallinas (2 patas). Si suman ${a+p} animales y ${a*4 + p*2} patas, ¿cuántos cerdos hay?`;
        else if (i % 3 === 1) q.enunciado = `En un garaje hay autos (4 ruedas) y motos (2 ruedas). Si hay ${a+p} vehículos y ${a*4 + p*2} ruedas, determina la cantidad de autos.`;
        else q.enunciado = `Se vendieron entradas VIP ($4) y Normales ($2). Hubo ${a+p} asistentes y se recaudaron $${a*4 + p*2}. ¿Cuántas entradas VIP se vendieron?`;
        q.alternativas = { A: `$${a}$`, B: `$${p}$`, C: `$${a+2}$`, D: `$${p-2}$` };
        q.feedback_error = `$V + N = ${a+p}$ y $4V + 2N = ${a*4 + p*2}$. Al despejar da $V = ${a}$.`;
      }
      // STEP 13: Concepto función
      else if (step === 13) {
        const m = randInt(2, 5), n = randInt(10, 50);
        if (i % 3 === 0) q.enunciado = `Dada la función afín $f(x) = ${m}x + ${n}$, ¿cuál es el valor de $f(2)$?`;
        else if (i % 3 === 1) q.enunciado = `Evalúa la función lineal $y = ${m}x + ${n}$ cuando $x=2$.`;
        else q.enunciado = `Si $g(x) = ${m}x + ${n}$, calcula la imagen del valor 2.`;
        q.alternativas = { A: `$${m*2 + n}$`, B: `$${m*2}$`, C: `$${n}$`, D: `$${m + n}$` };
        q.feedback_error = `Evaluando: $f(2) = ${m}(2) + ${n} = ${m*2} + ${n} = ${m*2+n}$.`;
      }
      // STEP 14: Gráficos
      else if (step === 14) {
        const n = randInt(2, 8);
        if (i % 3 === 0) q.enunciado = `¿En qué punto la recta de ecuación $y = 3x - ${n}$ corta al eje Y?`;
        else if (i % 3 === 1) q.enunciado = `Indica el intercepto (corte) con el eje de las ordenadas de $f(x) = 3x - ${n}$.`;
        else q.enunciado = `En un plano cartesiano, la recta $y = 3x - ${n}$ atraviesa el eje vertical en la coordenada:`;
        q.alternativas = { A: `$(0, -${n})$`, B: `$(0, ${n})$`, C: `$(-${n}, 0)$`, D: `$(3, -${n})$` };
        q.feedback_error = `El corte ocurre cuando $x=0$. Evaluando $y = 3(0) - ${n} = -${n}$. El punto es $(0, -${n})$.`;
      }
      // STEP 15: Problemas función
      else if (step === 15) {
        const n = randInt(2000, 5000, 1000), m = randInt(100, 300, 50);
        if (i % 3 === 0) q.enunciado = `Un plan cobra $${n}$ fijos más $${m}$ por minuto extra. ¿Qué función modela el costo por $x$ minutos?`;
        else if (i % 3 === 1) q.enunciado = `Una panadería tiene un gasto base de $${n}$ e insumos de $${m}$ por pan. Modela el gasto de $x$ panes.`;
        else q.enunciado = `El taxímetro empieza en $${n}$ y suma $${m}$ por kilómetro $x$. La función correcta es:`;
        q.alternativas = { A: `$C(x) = ${m}x + ${n}$`, B: `$C(x) = ${n}x + ${m}$`, C: `$C(x) = ${m+n}x$`, D: `$C(x) = ${m}x$` };
        q.feedback_error = `El valor fijo es $${n}$ y el variable es $${m}x$. La forma es $y = mx + n \\implies C(x) = ${m}x + ${n}$.`;
      }
      // STEP 16: Ecuación 2do grado
      else if (step === 16) {
        const x1 = randInt(1, 4), x2 = randInt(5, 9);
        if (i % 3 === 0) q.enunciado = `¿Cuáles son las soluciones de la ecuación $(x - ${x1})(x - ${x2}) = 0$?`;
        else if (i % 3 === 1) q.enunciado = `Calcula las raíces de la ecuación cuadrática expresada como $(x - ${x1})(x - ${x2}) = 0$.`;
        else q.enunciado = `Si sabemos que $(x - ${x1})(x - ${x2}) = 0$, los valores que satisfacen la igualdad son:`;
        q.alternativas = { A: `$x_1 = ${x1}, x_2 = ${x2}$`, B: `$x_1 = -${x1}, x_2 = -${x2}$`, C: `$x_1 = ${x1*x2}, x_2 = 0$`, D: `$x_1 = 1, x_2 = ${x1+x2}$` };
        q.feedback_error = `Igualando a cero cada paréntesis: $x = ${x1}$ y $x = ${x2}$.`;
      }
      // STEP 17: Gráficos cuadrática
      else if (step === 17) {
        const a = randInt(-4, -2);
        if (i % 3 === 0) q.enunciado = `La parábola $f(x) = ${a}x^2 + 4x + 5$ abre sus ramas hacia:`;
        else if (i % 3 === 1) q.enunciado = `Identifica la concavidad de la función cuadrática $f(x) = ${a}x^2 + 4x + 5$:`;
        else q.enunciado = `El gráfico de la función $y = ${a}x^2 + 4x + 5$ presenta una curva que se dirige hacia:`;
        q.alternativas = { A: `Abajo, porque $a < 0$`, B: `Arriba, porque $c > 0$`, C: `Arriba, porque $b > 0$`, D: `Abajo, porque $c > 0$` };
        q.feedback_error = `El coeficiente '$a$' de $x^2$ dicta la dirección. Como $a = ${a}$ es negativo, la parábola es cóncava hacia abajo.`;
      }
      // STEP 18: Vértice
      else if (step === 18) {
        const b = randInt(4, 12, 2);
        if (i % 3 === 0) q.enunciado = `Calcula la coordenada $x$ del vértice de la parábola $f(x) = x^2 - ${b}x + 10$.`;
        else if (i % 3 === 1) q.enunciado = `Encuentra el eje de simetría (coordenada x del vértice) de $f(x) = x^2 - ${b}x + 10$.`;
        else q.enunciado = `El punto mínimo de la función $y = x^2 - ${b}x + 10$ ocurre cuando $x$ es igual a:`;
        q.alternativas = { A: `$${b/2}$`, B: `$${-b/2}$`, C: `$${b}$`, D: `$${b*2}$` };
        q.feedback_error = `Fórmula: $x = -b / (2a) = -(-${b}) / 2(1) = ${b/2}$.`;
      }
      // STEP 19: Problemas cuadrática
      else if (step === 19) {
        const t = randInt(3, 8);
        if (i % 3 === 0) q.enunciado = `Un cohete sigue la trayectoria $h(t) = -t^2 + ${t}t$, donde $h$ es altura en metros y $t$ tiempo en segundos. ¿En qué segundo el cohete toca el suelo ($h=0$)?`;
        else if (i % 3 === 1) q.enunciado = `Una piedra arrojada describe la curva $h(t) = -t^2 + ${t}t$. ¿En qué instante $t$ vuelve a caer al suelo?`;
        else q.enunciado = `El modelo cuadrático de una pelota es $h(t) = -t^2 + ${t}t$. Calcula el tiempo en el que su altura se hace cero.`;
        q.alternativas = { A: `$t = ${t}$`, B: `$t = ${t/2}$`, C: `$t = ${t*2}$`, D: `$t = 0$` };
        q.feedback_error = `Factorizando: $-t(t - ${t}) = 0$. Soluciones $t=0$ y $t=${t}$. Cae en $t=${t}$.`;
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
const capTarget = capitulos.find(c => c.id === 'cap-m1-2-algebra');

if (capTarget) {
  console.log('✅ Injecting 190 questions into Álgebra...');
  
  capTarget.secciones.forEach((sec, idx) => {
    const step = idx + 1;
    if (typeof guides !== 'undefined' && guides[sec.id]) {
      sec.introduccion = guides[sec.id].introduccion;
      sec.datos_claves = guides[sec.id].datos_claves;
    }
    sec.test = {
      id: `test-m1-2-${step}`,
      seccionId: sec.id,
      preguntas: allQuestions.filter(q => q.id.toString().startsWith(`2${step.toString().padStart(2, '0')}`))
    };
  });
}

fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2));
console.log('🎉 Álgebra written to local mock!');
