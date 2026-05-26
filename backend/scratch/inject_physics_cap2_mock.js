const fs = require('fs');
const path = require('path');

// Rutas de archivos usando rutas absolutas para evitar cualquier confusión de CWD
const officialPath = 'c:\\Users\\Shila\\Documents\\Proy\\estudiauni.cl\\frontend-app\\src\\assets\\mocks\\capitulos-mock-local.json';
const mockPath = path.resolve(__dirname, 'fisica-cap2-mockup.json');

console.log('Cargando archivos...');
console.log('Mock path:', mockPath);
console.log('Official path:', officialPath);

// 1. Cargar archivo oficial
let officialContent;
try {
  officialContent = JSON.parse(fs.readFileSync(officialPath, 'utf8'));
} catch (e) {
  console.error('Error al leer el archivo oficial capitulos-mock-local.json:', e.message);
  process.exit(1);
}

// 2. Cargar el mockup de física generado (Capítulo 2)
let newPhysicsCapList;
try {
  newPhysicsCapList = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
} catch (e) {
  console.error('Error al leer el mockup de física de scratch:', e.message);
  process.exit(1);
}

const newPhysicsCap = newPhysicsCapList[0];
console.log('Capítulo nuevo a inyectar:', newPhysicsCap.id, '-', newPhysicsCap.title);

// 3. Reemplazar el capítulo de física viejo en la lista oficial
const originalIndex = officialContent.findIndex(c => c.id === newPhysicsCap.id);

if (originalIndex !== -1) {
  console.log('Se encontró el capítulo original en el índice:', originalIndex, '. Reemplazando...');
  officialContent[originalIndex] = newPhysicsCap;
} else {
  console.log('No se encontró el capítulo original. Agregándolo al final...');
  officialContent.push(newPhysicsCap);
}

// 4. Guardar los cambios en el archivo oficial
try {
  fs.writeFileSync(officialPath, JSON.stringify(officialContent, null, 2), 'utf8');
  console.log('🎉 ¡Inyección exitosa! Los placeholders del capítulo 2 de física (Mecánica) han sido reemplazados por las 90 preguntas reales en capitulos-mock-local.json');
} catch (e) {
  console.error('Error al escribir en capitulos-mock-local.json:', e.message);
  process.exit(1);
}
