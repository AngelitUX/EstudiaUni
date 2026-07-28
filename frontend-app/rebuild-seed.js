const fs = require('fs');

const header = [
  "import { Materia, Capitulo } from '../models/paes.models';",
  "",
  "export const MATERIAS: Materia[] = [",
  "  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },",
  "  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '🧮', order: 2, isActive: false },",
  "  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },",
  "  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🔬', order: 4, isActive: false },",
  "];",
  "",
  "export const CAPITULOS: Capitulo[] = [",
  "  // ── CAPÍTULO 1 ──",
  "  {",
  "    id: 'cap-1',",
  "    materiaId: 'comp-lectora',",
  "    title: 'Habilidad 1: Localizar',",
  "    introduccion: 'La habilidad de Localizar consiste en identificar y extraer información explícita de un texto. En la PAES, esta habilidad representa cerca del 30% de las preguntas. Aprenderás a rastrear datos exactos, distinguir causas de consecuencias, y reconocer paráfrasis.',",
  "    order: 1,",
  "    secciones: ["
].join('\n') + '\n';

const guia = [
  "      // ── NODO PRINCIPAL: GUÍA ──",
  "      {",
  "        id: 'sec-1-0-guia', capituloId: 'cap-1', materiaId: 'comp-lectora',",
  "        level: 1, order: 1, tags: ['subcapitulo:Introducción'],",
  "        isSlideGuide: true,",
  "        title: 'Textos Informativos vs Narrativos',",
  "        introduccion: 'Antes de comenzar a rastrear información, es fundamental distinguir los dos grandes tipos de textos que evaluarás en la PAES.',",
  "        guia_titulo: '¿Cómo diferenciarlos?',",
  "        guia_contenido: '<p><strong>Textos Informativos:</strong> Buscan transmitir datos, hechos y conocimientos objetivos. Ejemplos: noticias, artículos científicos, manuales y ensayos. Su lenguaje es claro, directo y estructurado.</p><p><strong>Textos Narrativos:</strong> Cuentan una historia, ya sea real o ficticia, a través de personajes en un tiempo y espacio determinados. Ejemplos: cuentos, novelas, mitos y fábulas. Su lenguaje suele ser más descriptivo y emotivo.</p><p>Al identificar el tipo de texto, sabrás de inmediato si debes enfocarte en hechos duros (informativos) o en acciones y motivaciones de personajes (narrativos). ¡Esta es la base visual de nuestras guías para facilitar tu estudio!</p>',",
  "        datos_claves: [",
  "          'Informativos: Transmiten datos y hechos objetivos (ej. noticias, manuales).',",
  "          'Narrativos: Cuentan historias de personajes en un tiempo y espacio (ej. cuentos, mitos).',",
  "          'Identificar el tipo de texto te ayuda a saber qué buscar: hechos vs motivaciones.',",
  "        ],",
  "        test: {",
  "          id: 'test-1-0-guia', seccionId: 'sec-1-0-guia',",
  "          contexto_base: 'Lee el resumen de arriba para responder.',",
  "          preguntas: [",
  "            { id: 99, enunciado: 'Según el texto, ¿cuál de los siguientes es un ejemplo de texto narrativo?', alternativas: { A: 'Un artículo científico.', B: 'Una noticia de periódico.', C: 'Un mito.', D: 'Un manual de instrucciones.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Los mitos cuentan historias con personajes y entran en la categoría narrativa.', feedback_error: 'Revisa la descripción de los Textos Narrativos en la guía. ¿Cuáles son los ejemplos que da?' }",
  "          ]",
  "        }",
  "      },"
].join('\n') + '\n';

const cap1Body = fs.readFileSync('C:/Users/IIfie/.gemini/antigravity-ide/brain/527103e7-5087-43fa-81f7-ddcfd2b004ea/scratch/chapter1-data.ts', 'utf8');

const mid = [
  "    ]",
  "  },",
  "",
  "  // ── CAPÍTULO 2 ──"
].join('\n') + '\n';

const cap2 = fs.readFileSync('cap2_content.txt', 'utf8');

let finalCode = header + guia + cap1Body + mid + cap2;
if (!finalCode.trim().endsWith('];')) {
    finalCode = finalCode.trim() + '\n];\n';
}

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', finalCode, 'utf8');
console.log('Successfully rebuilt seed-data.ts!');