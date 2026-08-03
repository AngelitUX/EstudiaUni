/**
 * Asigna el campo `level` correcto a las 6 prácticas nuevas de biología.
 * El tree layout ordena por `level`. Sin level, quedan al final (level=1000).
 *
 * Estructura de cada subrama:
 *   nivel normal 5 (level=5) → PRÁCTICA (level=5.5) → Tip (level=6) → Jefe (level=8) → Final (level=9/11)
 */
const fs = require('fs');
const path = './src/assets/mocks/capitulos-mock-local.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Mapa: seccionId → level correcto
const levelMap = {
  // Cap 1: organelos (entre level 5 y level 6)
  'prac-cbio-1-org':   5.5,
  // Cap 1: transporte (entre level 5 y level 6)
  'prac-cbio-1-trans': 5.5,
  // Cap 2: sistema nervioso (entre level 5 y level 6)
  'prac-cbio-2-nerv':  5.5,
  // Cap 2: reproducción (entre level 5 y level 6)
  'prac-cbio-2-repr':  5.5,
  // Cap 3: división celular (entre level 4 y level 5)
  'prac-cbio-3-cell':  4.5,
  // Cap 3: evolución (entre level 4 y level 5)
  'prac-cbio-3-evo':   4.5
};

let fixed = 0;
data.forEach(function(cap) {
  cap.secciones.forEach(function(sec) {
    if (levelMap[sec.id] !== undefined) {
      sec.level = levelMap[sec.id];
      console.log('✓ ' + sec.id + ' → level=' + sec.level);
      fixed++;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Corregidos ' + fixed + '/6 nodos. JSON válido.');
