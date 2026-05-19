const fs = require('fs');
const path = require('path');

const files = [
  'frontend-app/src/app/features/learning-path/capitulo-detail.component.ts',
  'frontend-app/src/app/features/learning-path/learning-path.component.ts',
  'frontend-app/src/app/features/learning-path/materia-path.component.ts',
  'frontend-app/src/app/features/learning-path/seccion-detail.component.ts',
  'frontend-app/src/app/features/learning-path/seccion-test.component.ts',
  'frontend-app/src/app/features/learning-path/services/paes-content.service.ts',
  'frontend-app/src/styles.css'
];

const basePath = 'C:/Users/Shila/Documents/Proy/estudiauni.cl';
let output = '';

files.forEach(f => {
  const fullPath = path.join(basePath, f);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  output += `\n=========================================\n`;
  output += `File: ${f}\n`;
  output += `=========================================\n`;
  
  let inConflict = false;
  let startLine = 0;
  
  lines.forEach((line, idx) => {
    if (line.includes('<<<<<<<')) {
      inConflict = true;
      startLine = idx + 1;
    }
    if (line.includes('>>>>>>>')) {
      if (inConflict) {
        output += `Conflict found around lines ${startLine} to ${idx + 1}:\n`;
        const startPrint = Math.max(0, startLine - 4);
        const endPrint = Math.min(lines.length - 1, idx + 3);
        for (let i = startPrint; i <= endPrint; i++) {
          const prefix = (i + 1 >= startLine && i + 1 <= idx + 1) ? '>> ' : '   ';
          output += `${prefix}${i + 1}: ${lines[i].replace('\r', '')}\n`;
        }
        inConflict = false;
      }
    }
  });
});

fs.writeFileSync(path.join(basePath, 'backend/scratch/conflict-report.txt'), output, 'utf8');
console.log('Conflict report generated at backend/scratch/conflict-report.txt');
