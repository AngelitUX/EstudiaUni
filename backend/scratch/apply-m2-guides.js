const fs = require('fs');
const path = require('path');

function run() {
  console.log('🚀 [EstudiaUni] Iniciando inyección de Guías de Estudio de Matemática M2...');

  const srcDir = path.join(__dirname, '../src');
  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  
  const guideDataPath = path.join(srcDir, 'guide-data-m2.json');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(guideDataPath) || !fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontraron las guías de estudio de M2 o el archivo capitulos-mock-local.json.');
    process.exit(1);
  }

  const guideData = JSON.parse(fs.readFileSync(guideDataPath, 'utf8'));
  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));

  let updatedChaptersCount = 0;
  let updatedSectionsCount = 0;

  for (const [capId, capData] of Object.entries(guideData)) {
    const capTarget = capitulos.find(c => c.id === capId);
    
    if (capTarget) {
      capTarget.introduccion = capData.introduccion;
      updatedChaptersCount++;
      console.log(`📂 Capítulo actualizado: ${capTarget.title} (${capId})`);

      capTarget.secciones.forEach(sec => {
        const secGuide = capData.secciones[sec.id];
        if (secGuide) {
          sec.introduccion = secGuide.introduccion;
          sec.datos_claves = secGuide.datos_claves || [];
          updatedSectionsCount++;
        } else {
          console.warn(`  ⚠️ Sin guías para la sección: ${sec.id}`);
        }
      });
    } else {
      console.warn(`⚠️ Capítulo no encontrado en el mock local: ${capId}`);
    }
  }

  fs.writeFileSync(capitulosPath, JSON.stringify(capitulos, null, 2), 'utf8');

  console.log(`\n🎉 [EstudiaUni] ¡Guías de M2 inyectadas con éxito de forma local!`);
  console.log(`   ➜ Capítulos actualizados: ${updatedChaptersCount}`);
  console.log(`   ➜ Secciones actualizadas: ${updatedSectionsCount}`);
}

run();
