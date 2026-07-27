const fs = require('fs');

let oldStr = fs.readFileSync('old_array.ts', 'utf8');
fs.writeFileSync('old_module.js', 'module.exports = [\n' + oldStr + '\n];');

let newNodesStr = fs.readFileSync('C:/Users/IIfie/.gemini/antigravity-ide/brain/527103e7-5087-43fa-81f7-ddcfd2b004ea/scratch/new-nodes.ts', 'utf8');
let lines = newNodesStr.split('\n');
lines.shift(); // remove export const NEW_NODES
lines.pop(); // remove last line 
lines.pop(); // remove second to last 
fs.writeFileSync('new_module.js', 'module.exports = [\n' + lines.join('\n') + '\n];');
