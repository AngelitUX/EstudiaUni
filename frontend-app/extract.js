const fs = require('fs');

let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
const capStartStr = "    id: 'cap-interpretar',";
const startIndex = seedData.indexOf(capStartStr);
const arrayStart = seedData.indexOf('secciones: [', startIndex) + 'secciones: ['.length;

let bracketCount = 1;
let arrayEnd = arrayStart;
while (bracketCount > 0 && arrayEnd < seedData.length) {
    if (seedData[arrayEnd] === '[') bracketCount++;
    if (seedData[arrayEnd] === ']') bracketCount--;
    arrayEnd++;
}

const oldArrayStr = seedData.substring(arrayStart, arrayEnd - 1);
fs.writeFileSync('old_array.ts', oldArrayStr);
console.log('Saved to old_array.ts');
