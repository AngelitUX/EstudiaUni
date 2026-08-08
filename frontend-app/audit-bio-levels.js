const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/assets/mocks/capitulos-mock-local.json'));
const bioCaps = data.filter(c => c.materiaId === 'ciencias-biologia').slice(0, 3);
bioCaps.forEach(function(cap, ci) {
  console.log('\n=== CAP ' + (ci+1) + ': ' + cap.id + ' ===');
  cap.secciones.forEach(function(sec, si) {
    const flags = [];
    if (sec.isProTip) flags.push('PROTIP');
    if (sec.isPractice) flags.push('PRAC');
    const sub = (sec.tags || []).find(t => t.startsWith('subcapitulo'));
    console.log('  [' + si + '] level=' + sec.level + ' order=' + sec.order + ' sub=' + (sub||'none') + ' | ' + (flags.length ? '['+flags.join('|')+'] ' : '') + sec.id);
  });
});
