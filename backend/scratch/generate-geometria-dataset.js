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

// GUIDES FOR THE 10 STEPS OF GEOMETRY
const guides = {
  'sec-m1-3-1': { introduccion: 'El Teorema de Pitágoras relaciona los tres lados de un triángulo rectángulo.', datos_claves: ['Solo aplica en triángulos con un ángulo de $90^\\circ$.', 'Fórmula: $c^2 = a^2 + b^2$, donde $c$ es la hipotenusa (el lado más largo).', 'Tríos pitagóricos comunes: $(3,4,5)$, $(5,12,13)$, $(8,15,17)$ y sus múltiplos.'] },
  'sec-m1-3-2': { introduccion: 'El perímetro es el contorno de una figura 2D y el área es la superficie interior.', datos_claves: ['Cuadrado: Perímetro $= 4L$, Área $= L^2$', 'Rectángulo: Perímetro $= 2a + 2b$, Área $= a \\cdot b$', 'Círculo: Perímetro $= 2\\pi r$, Área $= \\pi r^2$', 'Triángulo: Área $= \\frac{b \\cdot h}{2}$'] },
  'sec-m1-3-3': { introduccion: 'Resolver problemas de perímetros y áreas requiere descomponer figuras compuestas o entender cómo cambian si alteramos sus lados.', datos_claves: ['Si duplicas el lado de un cuadrado, su área se cuadruplica ($k^2 = 4$).', 'Si compones figuras complejas, suma o resta las áreas de figuras conocidas.'] },
  'sec-m1-3-4': { introduccion: 'El área de superficie de cuerpos geométricos 3D es la suma de las áreas de todas sus caras exteriores.', datos_claves: ['Cubo: Tiene 6 caras cuadradas idénticas. Área Total $= 6L^2$', 'Paralelepípedo (caja): Área $= 2(ab + ac + bc)$', 'Cilindro: Área $= 2\\pi r^2$ (bases) $+ 2\\pi rh$ (manto).'] },
  'sec-m1-3-5': { introduccion: 'El volumen mide el espacio 3D que ocupa un cuerpo geométrico.', datos_claves: ['Prismas y Cilindros: Volumen $= \\text{Área Base} \\cdot \\text{altura}$', 'Cubo: $V = L^3$', 'Paralelepípedo: $V = a \\cdot b \\cdot c$', 'Cilindro: $V = \\pi r^2 h$'] },
  'sec-m1-3-6': { introduccion: 'A menudo los problemas 3D combinan área y volumen, o evalúan cómo cambia el volumen al alterar las dimensiones.', datos_claves: ['Si duplicas TODAS las aristas de un cubo, el volumen se multiplica por 8 ($2^3=8$).', 'Si conoces el volumen y la base, puedes despejar la altura ($h = V / A_{\\text{base}}$).'] },
  'sec-m1-3-7': { introduccion: 'El plano cartesiano nos permite ubicar puntos $(x,y)$ y operar con vectores $\\vec{v}$.', datos_claves: ['Un punto se denota $(x,y)$.', 'Un vector desplazamiento es $\\vec{v} = (v_x, v_y)$.', 'Si sumas un vector a un punto $P(x,y) + \\vec{v}(a,b)$, el nuevo punto es $(x+a, y+b)$.'] },
  'sec-m1-3-8': { introduccion: 'Las transformaciones isométricas mueven una figura en el plano sin cambiar su tamaño ni forma.', datos_claves: ['Traslación: Sumar un vector $\\vec{v}$ a todos los puntos.', 'Reflexión eje X: $(x,y) \\to (x,-y)$.', 'Reflexión eje Y: $(x,y) \\to (-x,y)$.', 'Rotación $90^\\circ$ antihorario respecto al origen: $(x,y) \\to (-y,x)$.'] },
  'sec-m1-3-9': { introduccion: 'Problemas que combinan rotaciones, reflexiones y traslaciones.', datos_claves: ['El orden importa. Trasladar y luego reflejar no es lo mismo que reflejar y luego trasladar.', 'Las figuras isométricas conservan ángulos y distancias (son congruentes).'] },
  'sec-m1-3-10': { introduccion: 'La semejanza de figuras ocurre cuando tienen la misma forma pero distinto tamaño (modelos a escala).', datos_claves: ['Criterios de triángulos: AA (dos ángulos iguales).', 'Razón de semejanza $k$: Proporción entre lados homólogos.', 'Relación de perímetros: $k$.', 'Relación de Áreas: $k^2$.', 'Relación de Volúmenes: $k^3$.'] }
};

// GENERATORS FOR THE 100 QUESTIONS
function generateQuestions() {
  const tests = [];
  
  for(let step = 1; step <= 10; step++) {
    for(let i = 1; i <= 10; i++) {
      let q = {
        id: parseInt(`3${step.toString().padStart(2, '0')}${i.toString().padStart(2, '0')}`),
        enunciado: "", alternativas: {}, respuesta_correcta: "A", feedback_acierto: "¡Correcto!", feedback_error: ""
      };
      
      // STEP 1: Pitágoras
      if (step === 1) {
        if (i <= 5) {
          const baseTriplets = [[3,4,5], [5,12,13], [8,15,17]];
          const triplet = baseTriplets[randInt(0, 2)];
          const multiplier = randInt(1, 4);
          const a = triplet[0] * multiplier, b = triplet[1] * multiplier, c = triplet[2] * multiplier;
          if (i % 2 === 0) q.enunciado = `En un triángulo rectángulo, los catetos miden $${a}$ y $${b}$ cm. ¿Cuánto mide la hipotenusa?`;
          else q.enunciado = `Un terreno triangular tiene un ángulo recto. Si sus dos lados menores miden $${a}$ m y $${b}$ m, ¿cuál es la longitud del lado mayor?`;
          q.alternativas = { A: `$${c}$`, B: `$${c+2}$`, C: `$${c-2}$`, D: `$${a+b}$` };
          q.feedback_error = `Pitágoras: $c^2 = a^2 + b^2$. Así, $c^2 = ${a}^2 + ${b}^2 = ${c*c}$, la hipotenusa es $${c}$.`;
        } else {
          const a = 6, c = 10, b = 8;
          const mult = randInt(1, 3);
          const leg = a*mult, hyp = c*mult, other = b*mult;
          if (i % 2 === 0) q.enunciado = `La hipotenusa de un triángulo rectángulo mide $${hyp}$ m y un cateto mide $${leg}$ m. ¿Cuánto mide el otro cateto?`;
          else q.enunciado = `Una escalera de $${hyp}$ m se apoya en una pared. Si la base está a $${leg}$ m de la pared, ¿qué altura alcanza?`;
          q.alternativas = { A: `$${other}$ m`, B: `$${other+2}$ m`, C: `$${leg+other}$ m`, D: `$${other/2}$ m` };
          q.feedback_error = `$c^2 = a^2 + b^2 \\implies ${hyp}^2 = ${leg}^2 + b^2 \\implies ${hyp*hyp} = ${leg*leg} + b^2 \\implies b = ${other}$.`;
        }
      }
      // STEP 2: Perímetro y áreas 2D
      else if (step === 2) {
        if (i <= 3) {
          const l = randInt(3, 9);
          if (i === 1) q.enunciado = `¿Cuál es el área de un cuadrado cuyo perímetro es $${l*4}$ cm?`;
          else if (i === 2) q.enunciado = `Si la suma de los lados de un cuadrado es $${l*4}$ cm, calcula su área.`;
          else q.enunciado = `Un marco cuadrado requiere $${l*4}$ cm de madera. ¿Cuál es el área interior?`;
          q.alternativas = { A: `$${l*l}$ cm$^2$`, B: `$${l*2}$ cm$^2$`, C: `$${l*l*2}$ cm$^2$`, D: `$${l}$ cm$^2$` };
          q.feedback_error = `Lado = $${l*4}/4 = ${l}$ cm. Área = $${l}^2 = ${l*l}$ cm$^2$.`;
        } else if (i <= 7) {
          const r = randInt(2, 6);
          if (i % 2 === 0) q.enunciado = `El área de un círculo es $${r*r}\\pi$. ¿Cuál es la medida de su radio?`;
          else q.enunciado = `Se sabe que un disco tiene una superficie de $${r*r}\\pi$. Determina el valor de su radio.`;
          q.alternativas = { A: `$${r}$`, B: `$${r*2}$`, C: `$${r*r}$`, D: `$${r/2}$` };
          q.feedback_error = `Fórmula $A = \\pi r^2$. Si $A = ${r*r}\\pi$, entonces $r^2 = ${r*r}$, luego $r=${r}$.`;
        } else {
          const b = randInt(4, 10, 2), h = randInt(3, 9);
          if (i % 2 === 0) q.enunciado = `Calcula el área de un triángulo de base $${b}$ y altura $${h}$.`;
          else q.enunciado = `Un banderín triangular tiene una base de $${b}$ cm y una altura de $${h}$ cm. ¿Cuánta tela se necesita?`;
          q.alternativas = { A: `$${(b*h)/2}$`, B: `$${b*h}$`, C: `$${b+h}$`, D: `$${(b*h)/4}$` };
          q.feedback_error = `Área = $\\frac{base \\cdot altura}{2} = \\frac{${b} \\cdot ${h}}{2} = ${(b*h)/2}$.`;
        }
      }
      // STEP 3: Problemas 2D
      else if (step === 3) {
        const factorL = randInt(2, 5);
        if (i % 3 === 0) q.enunciado = `Si el largo de un rectángulo se multiplica por $${factorL}$ y su ancho se mantiene constante, ¿qué ocurre con su área original $A$?`;
        else if (i % 3 === 1) q.enunciado = `Al agrandar un rectángulo de modo que su longitud sea $${factorL}$ veces la original sin alterar el ancho, ¿cómo cambia el área $A$?`;
        else q.enunciado = `Imagina un rectángulo de área $A$. Si decides estirar su largo por un factor de $${factorL}$, el nuevo área será:`;
        q.alternativas = { A: `Aumenta a $${factorL}A$`, B: `Aumenta a $${factorL*2}A$`, C: `Se mantiene en $A$`, D: `Sube a $${factorL*factorL}A$` };
        q.feedback_error = `Nuevo Área = $(${factorL} \\cdot largo) \\cdot ancho = ${factorL} \\cdot (largo \\cdot ancho) = ${factorL}A$.`;
      }
      // STEP 4: Superficie 3D
      else if (step === 4) {
        const arista = randInt(2, 6);
        if (i % 3 === 0) q.enunciado = `Calcula el área total de la superficie de un cubo de arista $${arista}$ cm.`;
        else if (i % 3 === 1) q.enunciado = `¿Cuánta cartulina se requiere para forrar un cubo perfecto de lado $${arista}$ cm?`;
        else q.enunciado = `La medida de la arista de un dado cúbico es $${arista}$ cm. ¿Cuál es su área superficial total?`;
        q.alternativas = { A: `$${6 * arista * arista}$ cm$^2$`, B: `$${arista * arista * arista}$ cm$^2$`, C: `$${4 * arista * arista}$ cm$^2$`, D: `$${12 * arista}$ cm$^2$` };
        q.feedback_error = `El cubo tiene 6 caras. Área cara = $${arista}^2 = ${arista*arista}$. Área Total = $6 \\cdot ${arista*arista} = ${6 * arista * arista}$ cm$^2$.`;
      }
      // STEP 5: Volumen 3D
      else if (step === 5) {
        const l = randInt(2, 4), w = randInt(3, 5), h = randInt(4, 7);
        if (i % 3 === 0) q.enunciado = `Determina el volumen de un prisma rectangular que mide $${l}$ m de largo, $${w}$ m de ancho y $${h}$ m de alto.`;
        else if (i % 3 === 1) q.enunciado = `Una piscina tiene forma de paralelepípedo. Sus medidas son $${l}$ m, $${w}$ m y $${h}$ m de profundidad. ¿Cuál es su capacidad en $m^3$?`;
        else q.enunciado = `Calcula el espacio interno de un contenedor cuyas dimensiones son $${l} \\times ${w} \\times ${h}$ metros.`;
        q.alternativas = { A: `$${l*w*h}$ m$^3$`, B: `$${l+w+h}$ m$^3$`, C: `$${2*(l*w + l*h + w*h)}$ m$^3$`, D: `$${(l*w*h)/2}$ m$^3$` };
        q.feedback_error = `Volumen = $largo \\cdot ancho \\cdot alto = ${l} \\cdot ${w} \\cdot ${h} = ${l*w*h}$.`;
      }
      // STEP 6: Problemas 3D
      else if (step === 6) {
        const a = randInt(2, 6);
        const v = a*a*a;
        if (i % 3 === 0) q.enunciado = `El volumen de un estanque cúbico es $${v}$ m$^3$. ¿Cuánto mide su arista?`;
        else if (i % 3 === 1) q.enunciado = `Si una caja perfectamente cúbica tiene una capacidad de $${v}$ cm$^3$, ¿cuál es la medida de sus lados?`;
        else q.enunciado = `Se sabe que un cubo de hielo gigante ocupa $${v}$ m$^3$. Determina su profundidad.`;
        q.alternativas = { A: `$${a}$`, B: `$${a*a}$`, C: `$${a*3}$`, D: `$${a*2}$` };
        q.feedback_error = `El volumen es $V = a^3$. Si $a^3 = ${v}$, calculando raíz cúbica obtenemos $a = ${a}$.`;
      }
      // STEP 7: Plano y vectores
      else if (step === 7) {
        const px = randInt(1, 5), py = randInt(-4, 4);
        const vx = randInt(-3, 3), vy = randInt(1, 6);
        if (i % 3 === 0) q.enunciado = `Si al punto $P(${px}, ${py})$ se le aplica el vector de traslación $\\vec{v} = (${vx}, ${vy})$, ¿cuál es el nuevo punto $P'$?`;
        else if (i % 3 === 1) q.enunciado = `Un objeto en la coordenada $(${px}, ${py})$ se desplaza según el vector $(${vx}, ${vy})$. ¿Dónde queda ubicado?`;
        else q.enunciado = `Calcula la imagen del punto $(${px}, ${py})$ después de trasladarlo con $\\vec{v} = (${vx}, ${vy})$.`;
        q.alternativas = { A: `$(${px+vx}, ${py+vy})$`, B: `$(${px-vx}, ${py-vy})$`, C: `$(${px*vx}, ${py*vy})$`, D: `$(${px+vy}, ${py+vx})$` };
        q.feedback_error = `Suma coordenada a coordenada: $P' = (${px} + ${vx}, ${py} + ${vy}) = (${px+vx}, ${py+vy})$.`;
      }
      // STEP 8: Isometrías básicas
      else if (step === 8) {
        const x = randInt(2, 7), y = randInt(3, 8);
        if (i % 3 === 0) q.enunciado = `¿Cuál es la imagen del punto $A(${x}, ${y})$ tras una reflexión respecto al eje X?`;
        else if (i % 3 === 1) q.enunciado = `Aplica una simetría axial respecto al eje de las abscisas (eje X) al punto $(${x}, ${y})$. ¿Qué punto obtienes?`;
        else q.enunciado = `Si doblas el plano cartesiano por el eje X, ¿sobre qué punto caerá la coordenada $(${x}, ${y})$?`;
        q.alternativas = { A: `$(${x}, -${y})$`, B: `$(-${x}, ${y})$`, C: `$(-${x}, -${y})$`, D: `$(${y}, ${x})$` };
        q.feedback_error = `En reflexión eje X: $(x, y) \\to (x, -y)$. Resulta $(${x}, -${y})$.`;
      }
      // STEP 9: Problemas Isométricos
      else if (step === 9) {
        const x = randInt(-5, -2), y = randInt(2, 6);
        if (i % 3 === 0) q.enunciado = `Un punto $B(${x}, ${y})$ es rotado $90^\\circ$ en sentido antihorario respecto al origen. ¿Cuáles son sus nuevas coordenadas?`;
        else if (i % 3 === 1) q.enunciado = `Aplica una rotación de $90^\\circ$ positiva al punto $(${x}, ${y})$ con centro en el origen.`;
        else q.enunciado = `Gira el punto $(${x}, ${y})$ en torno al origen por $90$ grados en sentido contrario al reloj.`;
        q.alternativas = { A: `$(-${y}, ${x})$`, B: `$(${y}, ${x})$`, C: `$(${y}, -${x})$`, D: `$(-${x}, -${y})$` };
        q.feedback_error = `Rotación $90^\\circ$: $(x, y) \\to (-y, x)$. Resulta $y=${y} \\to -${y}$ y $x = ${x}$.`;
      }
      // STEP 10: Semejanza
      else if (step === 10) {
        const l1 = randInt(2, 5), k = randInt(2, 5);
        if (i % 3 === 0) q.enunciado = `Dos triángulos son semejantes con razón $k=${k}$. Si el área del menor es $${l1}$, ¿cuál es el área del mayor?`;
        else if (i % 3 === 1) q.enunciado = `Las figuras A y B son semejantes. La razón es $${k}:1$. Si A tiene área $${l1}$, ¿qué área tiene B?`;
        else q.enunciado = `Sabiendo que dos polígonos tienen sus lados en razón de $1:${k}$ y el primero tiene área $${l1}$, determina el área del segundo.`;
        q.alternativas = { A: `$${l1 * (k*k)}$`, B: `$${l1 * k}$`, C: `$${l1 + k}$`, D: `$${l1 * (k*k*k)}$` };
        q.feedback_error = `La relación entre áreas es $k^2$. $Área = ${l1} \\cdot ${k}^2 = ${l1 * k * k}$.`;
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
const capTarget = capitulos.find(c => c.id === 'cap-m1-3-geometria');

if (capTarget) {
  console.log('✅ Injecting 100 questions into Geometría...');
  
  capTarget.secciones.forEach((sec, idx) => {
    const step = idx + 1;
    if (typeof guides !== 'undefined' && guides[sec.id]) {
      sec.introduccion = guides[sec.id].introduccion;
      sec.datos_claves = guides[sec.id].datos_claves;
    }
    sec.test = {
      id: `test-m1-3-${step}`,
      seccionId: sec.id,
      preguntas: allQuestions.filter(q => q.id.toString().startsWith(`3${step.toString().padStart(2, '0')}`))
    };
  });
}

fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2));
console.log('🎉 Geometría written to local mock!');
