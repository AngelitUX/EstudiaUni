const fs = require('fs');
let seedData = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
let cap2 = fs.readFileSync('cap2_content.txt', 'utf8');

const match = seedData.match(/\{[\s]*id:\s*'cap-interpretar'/);
if (match) {
    let insertIndex = match.index;
    let commentIndex = seedData.lastIndexOf('//', insertIndex);
    if (commentIndex !== -1 && (insertIndex - commentIndex) < 100) {
        insertIndex = commentIndex;
    }
    
    let finalCode = seedData.substring(0, insertIndex) + cap2;
    if (!finalCode.trim().endsWith('];')) {
         finalCode = finalCode.trim() + '\n];\n';
    }
    fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', finalCode, 'utf8');
    console.log('Successfully restored seed-data.ts using cap-interpretar id.');
} else {
    console.log('Could not find cap-interpretar in seed-data.ts');
}