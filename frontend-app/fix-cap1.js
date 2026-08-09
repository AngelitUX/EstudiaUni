const fs = require('fs');

let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// Extract sec-1-0-guia from current seed
const sec10guiaStart = seed.indexOf("id: 'sec-1-0-guia'");
const sec10guiaObjStart = seed.lastIndexOf('{', sec10guiaStart);
let braces = 0;
let sec10guiaEnd = -1;
for (let i = sec10guiaObjStart; i < seed.length; i++) {
    if (seed[i] === '{') braces++;
    if (seed[i] === '}') {
        braces--;
        if (braces === 0) {
            sec10guiaEnd = i;
            break;
        }
    }
}
const sec10guiaStr = seed.substring(sec10guiaObjStart, sec10guiaEnd + 1);

let cap1Data = fs.readFileSync('C:/Users/IIfie/.gemini/antigravity-ide/brain/527103e7-5087-43fa-81f7-ddcfd2b004ea/scratch/chapter1-data.ts', 'utf8');

// The new secciones for cap-1 will be sec10guiaStr + "," + cap1Data
const newCap1Secciones = "[\n      " + sec10guiaStr + ",\n" + cap1Data + "\n    ]";

// Replace cap-1 secciones in seed
const cap1Start = seed.indexOf("id: 'cap-1'");
const secStart = seed.indexOf("secciones: [", cap1Start);
// Find the end of the array
braces = 0;
let secEnd = -1;
const arrStart = seed.indexOf("[", secStart);
for (let i = arrStart; i < seed.length; i++) {
    if (seed[i] === '[') braces++;
    if (seed[i] === ']') {
        braces--;
        if (braces === 0) {
            secEnd = i;
            break;
        }
    }
}

seed = seed.substring(0, secStart) + "secciones: " + newCap1Secciones + seed.substring(secEnd + 1);

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('Chapter 1 fixed');
