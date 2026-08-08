const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/assets/mocks/capitulos-mock-local.json'));
let i = 0;
data.forEach(function(c) {
  if (c.materiaId === 'ciencias-fisica') {
    c.secciones.forEach(function(s) {
      if (s.isPractice) {
        const d = s.practiceData;
        let count = 0;
        if (d) {
          if (d.pairs) count = d.pairs.length;
          else if (d.items) count = d.items.length;
          else if (d.words) count = d.words.length;
        } else if (s.gameData) {
          count = s.gameData.rounds ? s.gameData.rounds.length : 0;
        }
        const tag = s.practiceType === 'physics' ? 'GAME(old)' : s.practiceType;
        console.log(i + ' | ' + s.id + ' | ' + s.title + ' | type=' + tag + ' | count=' + count);
        i++;
      }
    });
  }
});
