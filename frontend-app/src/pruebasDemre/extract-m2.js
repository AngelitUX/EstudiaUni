const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('M2-2024-SOLUCION.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('m2-sol-text.txt', data.text);
    console.log('Extracted');
}).catch(console.error);
