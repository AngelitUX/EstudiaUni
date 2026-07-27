const fs = require('fs');
const oldArr = require('./old_module.js');
const newArr = require('./new_module.js');

const merged = [];
let level = 1;
let order = 1;

function addNodes(ids) {
    let pushed = false;
    for (const id of ids) {
        let node = oldArr.find(n => n.id === id) || newArr.find(n => n.id === id);
        if (!node) console.log("MISSING:", id);
        node.level = level;
        node.order = order;
        node.capituloId = 'cap-interpretar';
        node.materiaId = 'comp-lectora';
        if (!node.datos_claves) node.datos_claves = [];
        if (!node.test) {
           node.test = { id: 'test-' + node.id, seccionId: node.id, contexto_base: null, preguntas: [] };
        } else {
           node.test.seccionId = node.id;
        }
        merged.push(node);
        pushed = true;
    }
    if (pushed) {
        level++;
        order++;
    }
}

addNodes(['sec-2-0-guia']);
addNodes(['sec-2-protip-1']);
addNodes(['sec-2-1-inf', 'sec-2-1-nar']);
addNodes(['sec-2-prac-1']);
addNodes(['sec-2-2-inf', 'sec-2-2-nar']);
addNodes(['sec-2-prac-2']);
addNodes(['sec-2-3-join']);
addNodes(['sec-2-protip-2']);
addNodes(['sec-2-4-inf', 'sec-2-4-nar']);
addNodes(['sec-2-prac-3']);
addNodes(['sec-2-5-join']);
addNodes(['sec-2-protip-3']);
addNodes(['sec-2-6-inf', 'sec-2-6-nar']);
addNodes(['sec-2-prac-4']);
addNodes(['sec-2-protip-4']);
addNodes(['sec-2-7-inf', 'sec-2-7-nar']);
addNodes(['sec-2-prac-5']);
addNodes(['sec-2-8-join']);
addNodes(['sec-2-protip-5']);
addNodes(['sec-2-9']); 
addNodes(['sec-2-prac-6']);
addNodes(['sec-2-10-join']);
addNodes(['sec-2-protip-6']);
addNodes(['sec-2-prac-7']);
addNodes(['sec-2-boss']);

let jsonStr = JSON.stringify(merged, null, 2);
let tsStr = jsonStr.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");

let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
const capStartStr = "    id: 'cap-interpretar',";
const startIndex = seedData.indexOf(capStartStr);
let arrayStart = seedData.indexOf('secciones: [', startIndex);

while(seedData[arrayStart] !== '[') {
  arrayStart++;
}

let bracketCount = 1;
let arrayEnd = arrayStart + 1;

while (bracketCount > 0 && arrayEnd < seedData.length) {
    if (seedData[arrayEnd] === '[') bracketCount++;
    if (seedData[arrayEnd] === ']') bracketCount--;
    arrayEnd++;
}

const before = seedData.substring(0, arrayStart);
const after = seedData.substring(arrayEnd);

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', before + tsStr + after);
console.log('Successfully wrote to seed-data.ts');
