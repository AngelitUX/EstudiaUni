const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('M1-2024.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('M1-2024-text.txt', data.text);
    console.log('PDF text extracted. Number of pages:', data.numpages);
}).catch(console.error);
