const fs = require('fs');

const bioPath = 'src/app/features/learning-path/materia-biologia-path.component.ts';
const fisPath = 'src/app/features/learning-path/materia-fisica-path.component.ts';

let newFisCode = fs.readFileSync(bioPath, 'utf8');

// Fix selector
newFisCode = newFisCode.replace("selector: 'app-materia-biologia-path'", "selector: 'app-materia-fisica-path'");

// Fix class name
newFisCode = newFisCode.replace("export class MateriaBiologiaPathComponent", "export class MateriaFisicaPathComponent");

// Fix matId inside the pathItems or where it's used
newFisCode = newFisCode.replace("let matId = 'biologia';", "let matId = 'fisica';");
newFisCode = newFisCode.replace("if (url.includes('ciencias-biologia')) matId = 'ciencias-biologia';", "if (url.includes('ciencias-fisica')) matId = 'ciencias-fisica';");

// Fix image
newFisCode = newFisCode.replace(
  /<img \[src\]="materiaId\(\)\.toLowerCase\(\)\.includes\('bio'\) \? 'assets\/img\/focoBiologia\.gif' : 'assets\/img\/gif\.gif'" alt="Foco" class="splash-mascot chapter-image-custom" \[class\.mascot-bio\]="materiaId\(\)\.toLowerCase\(\)\.includes\('bio'\)" \/>/g,
  '<img src="assets/img/focoFisica.gif" alt="Foco" class="splash-mascot chapter-image-custom" />'
);

// Fix mascot size
newFisCode = newFisCode.replace(
  '.splash-mascot { width: 180px; height: 180px; object-fit: contain; animation: mascotFloat 3.5s ease-in-out infinite; }',
  '.splash-mascot { width: 320px; height: 320px; position: absolute; object-fit: contain; animation: mascotFloat 3.5s ease-in-out infinite; }'
);

// Fix chapter-completed colors
newFisCode = newFisCode.replace(
  '.chapter-splash.chapter-completed { border: 2px solid #58cc02 !important; box-shadow: 0 16px 40px rgba(88,204,2,0.2), inset 0 2px 4px rgba(255,255,255,0.8) !important; background: linear-gradient(135deg, #f0ffeb 0%, #dcfce7 100%) !important; }',
  '.chapter-splash.chapter-completed { border: 2px solid #1e3a8a !important; box-shadow: 0 16px 40px rgba(30,58,138,0.2), inset 0 2px 4px rgba(255,255,255,0.8) !important; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important; }'
);
newFisCode = newFisCode.replace(
  '.chapter-splash.chapter-completed .splash-badge { background: #58cc02 !important; }',
  '.chapter-splash.chapter-completed .splash-badge { background: #1e3a8a !important; }'
);

// Replace getChapterConnections green color
newFisCode = newFisCode.replace(
  "return { d, color: isCompleted ? '#58cc02' : '#e5e5e5', dasharray: isCompleted ? 'none' : '8 8' };",
  "return { d, color: isCompleted ? '#1e3a8a' : '#e5e5e5', dasharray: isCompleted ? 'none' : '8 8' };"
);

// Replace getConnections color and getDash
newFisCode = newFisCode.replace(
  "return node?.status === 'completed' ? '#58cc02' : '#e5e5e5';",
  "return node?.status === 'completed' ? '#1e3a8a' : '#e5e5e5';"
);
newFisCode = newFisCode.replace(
  "return getColor(sourceOffset) === '#58cc02' ? 'none' : '8 8';",
  "return getColor(sourceOffset) === '#1e3a8a' ? 'none' : '8 8';"
);

fs.writeFileSync(fisPath, newFisCode, 'utf8');
console.log('Restored physics file perfectly from biology');
