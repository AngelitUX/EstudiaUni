const fs = require('fs');
let data = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');
const cap2Match = data.match(/id: 'cap-interpretar'[\s\S]*/);
if(cap2Match) {
    const cap2 = cap2Match[0];
    const regex = /title:\s*'([^']+)'/g;
    let m;
    while((m = regex.exec(cap2)) !== null) {
        console.log(m[1]);
    }
}