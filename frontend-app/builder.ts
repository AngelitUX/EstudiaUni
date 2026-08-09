import * as fs from 'fs';
import { CAPITULOS } from './src/app/features/learning-path/data/seed-data';

const cap2 = CAPITULOS.find(c => c.id === 'cap-interpretar');
if (!cap2) process.exit(1);

const oldNodes = cap2.secciones;

// We will map them to strings
function serializeNode(node: any) {
  return JSON.stringify(node, null, 2);
}

// But JSON.stringify doesn't work perfectly for TS.
// Let's just string-replace the file.
