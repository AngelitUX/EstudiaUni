const fs = require('fs');
const files = [
  'm1-invierno-preguntas-db.json',
  '../assets/m1-invierno-preguntas-db.json'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let data = fs.readFileSync(f, 'utf8');
    let json = JSON.parse(data);
    json.forEach(q => {
      if (q.imageUrl && (q.imageUrl.includes('C:\\') || q.imageUrl.includes('C:'))) {
        // Find the image number/name like "1.png"
        const parts = q.imageUrl.split(/[\\/]/);
        const fileName = parts.pop();
        // Since we know it's M1-INVIERNO, we can force the correct dir name,
        // or just take the previous element in parts if it is the dir name.
        let dirName = 'M1-INVIERNO-2024-IMAGENES';
        for(let p of parts) {
            if(p.includes('-IMAGENES')) {
                dirName = p;
                break;
            }
        }
        q.imageUrl = 'assets/images/' + dirName + '/' + fileName;
      }
    });
    fs.writeFileSync(f, JSON.stringify(json, null, 2));
    console.log('Fixed', f);
  }
});
