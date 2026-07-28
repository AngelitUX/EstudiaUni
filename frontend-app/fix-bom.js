const fs = require('fs');
let data = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
if (data.charCodeAt(0) === 65533 || data.charCodeAt(0) === 0xFEFF || data.startsWith('')) {
    data = data.substring(1);
    fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', data, 'utf8');
    console.log('Fixed BOM');
} else {
    console.log('No bad BOM found, first char code is: ', data.charCodeAt(0));
}