const fs = require('fs');

let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// The new sec-2-0-guia
const sec2Guia = {
      id: 'sec-2-0-guia',
      capituloId: 'cap-interpretar',
      materiaId: 'comp-lectora',
      level: 1,
      order: 1,
      tags: ['subcapitulo:Introducción'],
      isSlideGuide: true,
      title: '¡Bienvenido a Interpretar!',
      introduccion: '¡Felicidades por llegar al segundo nivel! Aquí daremos un salto mental: dejaremos de buscar lo que está escrito literalmente para empezar a descubrir lo que el autor quiso decir entre líneas.',
      guia_titulo: 'El siguiente gran paso',
      guia_contenido: '<p>Has dominado el arte de "Localizar" información explícita. Ahora, en <strong>Interpretar</strong>, el desafío cambia. Ya no se trata solo de usar una lupa para encontrar datos, sino de actuar como un detective para conectar pistas y deducir el significado oculto.</p><p>¿Por qué es vital esta habilidad? Porque en la PAES representa cerca del <strong>35% de las preguntas</strong> y es lo que realmente separa los puntajes promedio de los puntajes más altos.</p><p>En este nivel entrenarás tu cerebro para leer más allá de las palabras. Trabajarás con inferencias, descubrirás el sentido de palabras en contextos complejos y aprenderás a captar la intención profunda de los textos informativos y narrativos. ¡Prepárate para llevar tu comprensión lectora al siguiente nivel!</p>',
      datos_claves: [
        'Interpretar exige deducir información implícita a partir de pistas explícitas.',
        'Es la habilidad que diferencia los puntajes más altos en la prueba.',
        'Se trata de entender el "por qué" y el "para qué" detrás de las palabras.'
      ],
      test: { id: 'test-2-0-guia', contexto_base: null, preguntas: [] }
    };

// Read new-nodes.ts
let newNodesFile = fs.readFileSync('C:/Users/IIfie/.gemini/antigravity-ide/brain/527103e7-5087-43fa-81f7-ddcfd2b004ea/scratch/new-nodes.ts', 'utf8');
let newNodesStr = newNodesFile.replace('export const NEW_NODES = ', '').replace(/\s*$/, '');

// Add 9 more questions to sec-2-prac-1
// We find "id: 2001," and we inject after it ends.
// Wait, an easier way is to just generate them.
const extraQs = \
            ,
            {
              id: 20011, enunciado: '¿Qué sentimiento predomina en Juan?', tipo_alternativas: 'texto',
              alternativas: { A: 'Enojo.', B: 'Ansiedad.', C: 'Tristeza.', D: 'Felicidad.' },
              respuesta_correcta: 'B', feedback_acierto: 'Correcto.', feedback_error: 'Revisa la primera línea.'
            },
            {
              id: 20012, enunciado: '¿Para qué usaría Juan su maletín de cuero?', tipo_alternativas: 'texto',
              alternativas: { A: 'Para ir al colegio.', B: 'Para el trabajo.', C: 'Para hacer deporte.', D: 'Para viajar por un mes.' },
              respuesta_correcta: 'B', feedback_acierto: 'Un maletín de cuero es típico de un oficinista.', feedback_error: 'Es un maletín.'
            },
            {
              id: 20013, enunciado: '¿A qué hora del día crees que ocurre la escena?', tipo_alternativas: 'texto',
              alternativas: { A: 'Madrugada.', B: 'Mediodía exacto.', C: 'Mañana u hora punta.', D: 'Medianoche.' },
              respuesta_correcta: 'C', feedback_acierto: 'El apuro con maletín suele ser hora punta.', feedback_error: 'Piensa en la rutina laboral.'
            },
            {
              id: 20014, enunciado: '¿Qué habría pasado si no corría?', tipo_alternativas: 'texto',
              alternativas: { A: 'Habría tomado un avión.', B: 'Habría perdido el tren.', C: 'Lo habrían asaltado.', D: 'Se habría caído.' },
              respuesta_correcta: 'B', feedback_acierto: 'Las puertas ya se estaban cerrando.', feedback_error: 'Las puertas estaban cerrando.'
            },
            {
              id: 20015, enunciado: '¿De qué material era el maletín?', tipo_alternativas: 'texto',
              alternativas: { A: 'Tela.', B: 'Plástico.', C: 'Cuero.', D: 'Metal.' },
              respuesta_correcta: 'C', feedback_acierto: 'Información explícita.', feedback_error: 'Revisa el texto.'
            },
            {
              id: 20016, enunciado: '¿Hacia dónde corrió?', tipo_alternativas: 'texto',
              alternativas: { A: 'Hacia el andén.', B: 'Hacia la salida.', C: 'Hacia su casa.', D: 'Hacia la calle.' },
              respuesta_correcta: 'A', feedback_acierto: 'Información explícita.', feedback_error: 'Revisa el texto.'
            },
            {
              id: 20017, enunciado: '¿Qué miró Juan?', tipo_alternativas: 'texto',
              alternativas: { A: 'Su teléfono.', B: 'Su reloj.', C: 'El cielo.', D: 'Sus zapatos.' },
              respuesta_correcta: 'B', feedback_acierto: 'Información explícita.', feedback_error: 'Revisa el texto.'
            },
            {
              id: 20018, enunciado: '¿Qué estaban haciendo las puertas?', tipo_alternativas: 'texto',
              alternativas: { A: 'Abriéndose.', B: 'Cerrándose.', C: 'Rompiéndose.', D: 'Pintándose.' },
              respuesta_correcta: 'B', feedback_acierto: 'Información explícita.', feedback_error: 'Revisa el texto.'
            },
            {
              id: 20019, enunciado: '¿Quién es el personaje principal?', tipo_alternativas: 'texto',
              alternativas: { A: 'Pedro.', B: 'Juan.', C: 'Diego.', D: 'El maquinista.' },
              respuesta_correcta: 'B', feedback_acierto: 'Información explícita.', feedback_error: 'Revisa el texto.'
            }
\;

newNodesStr = newNodesStr.replace('feedback_error: \\'Incorrecto. Busca las pistas textuales ("andén", "reloj").\\'\\n            }', 'feedback_error: \\'Incorrecto. Busca las pistas textuales ("andén", "reloj").\\'\\n            }' + extraQs);


// Replace cap-interpretar secciones
const cap2Start = seed.indexOf("id: 'cap-interpretar'");
const sec2Start = seed.indexOf("secciones: [", cap2Start);
let braces = 0;
let sec2End = -1;
const arr2Start = seed.indexOf("[", sec2Start);
for (let i = arr2Start; i < seed.length; i++) {
    if (seed[i] === '[') braces++;
    if (seed[i] === ']') {
        braces--;
        if (braces === 0) {
            sec2End = i;
            break;
        }
    }
}

const newCap2Secciones = "[\n      " + sec2Guia + ",\n" + newNodesStr + "\n    ]";

seed = seed.substring(0, sec2Start) + "secciones: " + newCap2Secciones + seed.substring(sec2End + 1);

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('Chapter 2 fixed');
