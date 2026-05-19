const fs = require('fs');
const path = require('path');

function run() {
  console.log('🧹 [EstudiaUni] Iniciando corrección automática de formato e italics en Guías M2...');

  const guidePath = path.join(__dirname, '../src/guide-data-m2.json');
  if (!fs.existsSync(guidePath)) {
    console.error('❌ Error: No se encontró guide-data-m2.json');
    process.exit(1);
  }

  let content = fs.readFileSync(guidePath, 'utf8');

  // 1. Reemplazar formato de listas con salto de línea HTML (<br>• ) para forzar su renderizado correcto
  // Reemplaza "\n - *" o "\n - " por "<br>• **" o "<br>• "
  console.log('🔄 Corrigiendo saltos de línea de listas...');
  
  // Reemplazar "\n - *" por "<br>• **" (para bolds corregidos)
  content = content.replace(/\n\s*-\s*\*/g, '<br>• **');
  
  // Reemplazar los cierres correspondientes de las listas "*\n" o "* " o "*, "
  // Pero más seguro es hacer un reemplazo de los pares de asteriscos a negritas primero, y luego formatear las listas
  
  // Vamos a restaurar y aplicar una expresión regular muy precisa para convertir pares de asteriscos simples a dobles
  // Excluimos \mathbb{Q}^* (que tiene un asterisco solitario en LaTeX)
  console.log('🔄 Reemplazando asteriscos simples (*) por negritas (**)...');
  
  // Regex para encontrar pares de asteriscos que no sean dobles
  // Buscamos algo del tipo *palabra* pero asegurándonos que no empiece con **
  // Usamos una función de reemplazo para evitar falsos positivos
  let updatedContent = '';
  let i = 0;
  while (i < content.length) {
    if (content[i] === '*' && content[i+1] === '*') {
      // Es una negrita doble, mantenerla intacta
      updatedContent += '**';
      i += 2;
    } else if (content[i] === '*' && content[i-1] !== '\\' && content[i+1] !== '*') {
      // Es un asterisco simple
      // Verificamos si es Q^* (en LaTeX) para no dañarlo
      const beforeStr = content.substring(Math.max(0, i - 15), i);
      if (beforeStr.includes('\\mathbb{Q}^')) {
        // Es de LaTeX Q^*, lo dejamos intacto
        updatedContent += '*';
      } else {
        // Convertirlo a doble asterisco
        updatedContent += '**';
      }
      i++;
    } else {
      updatedContent += content[i];
      i++;
    }
  }
  
  content = updatedContent;

  // Ahora corregimos la estructura de las listas "\n - **" o "\n - "
  // Para que rendericen con saltos de línea HTML reales <br>
  content = content.replace(/\\n\s*-\s*\*\*/g, '<br>• **');
  content = content.replace(/\\n\s*-\s*/g, '<br>• ');

  // Guardar archivo guide-data-m2.json corregido
  fs.writeFileSync(guidePath, content, 'utf8');
  console.log('💾 Archivo guide-data-m2.json corregido y guardado con éxito.');

  // 2. Re-ejecutar apply-m2-guides.js para aplicar los cambios a los mocks locales
  console.log('🔄 Re-aplicando guías corregidas a capitulos-mock-local.json...');
  const applyGuides = require('./apply-m2-guides.js');
}

run();
