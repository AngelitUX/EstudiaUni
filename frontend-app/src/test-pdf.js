const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('src/pruebasDemre/M2-2024-SOLUCION.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('src/pruebasDemre/M2-2024-SOLUCION.txt', data.text);
    console.log('Saved to M2-2024-SOLUCION.txt');
});
