const fs = require('fs');

let seed = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

// The nodes that need fixing start from id: 'sec-2-protip-1' up to 'sec-2-boss'
// Let's find cap-interpretar
const cap2Start = seed.indexOf("id: 'cap-interpretar'");
const sec2Start = seed.indexOf("secciones: [", cap2Start);
let braces = 0;
let sec2End = -1;
const arr2Start = seed.indexOf("[", sec2Start);
for (let i = arr2Start; i < seed.length; i++) {
    if (seed[i] === '[') braces++;
    if (seed[i] === ']') {
        braces--;
        if (braces === 0) {
            sec2End = i;
            break;
        }
    }
}

let cap2Str = seed.substring(arr2Start, sec2End + 1);

// Add missing properties
cap2Str = cap2Str.replace(/id:\s*'sec-2-(protip|prac|boss)[^']*',/g, function(match) {
    return match + " capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 2,";
});

seed = seed.substring(0, arr2Start) + cap2Str + seed.substring(sec2End + 1);

fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', seed);
console.log('Chapter 2 properties fixed');
