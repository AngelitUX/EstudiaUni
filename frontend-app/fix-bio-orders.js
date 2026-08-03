/**
 * Corrige los números de order en los capítulos 1, 2 y 3 de Biología
 * para que el sort por order siempre produzca el orden correcto:
 * normales → práctica → tip PAES → jefe de rama → ... → jefe final
 */
const fs = require('fs');
const path = './src/assets/mocks/capitulos-mock-local.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// ────────────────────────────────────────────────────────────
// Reasignación de orders explícita por capítulo
// ────────────────────────────────────────────────────────────

// Mapa: { capId: { seccionId: newOrder } }
const orderMap = {

  // ── CAP 1 ──────────────────────────────────────────────
  'cap-cbio-1': {
    'sec-cbio-1-root':       0,
    // Subrama Organelos
    'sec-cbio-1-org-2':      1,
    'sec-cbio-1-org-3':      2,
    'sec-cbio-1-org-4':      3,
    'sec-cbio-1-org-5':      4,
    'prac-cbio-1-org':       5,   // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-1-org-tips':   6,   // Tip PAES
    'sec-cbio-1-org-jefe':   7,   // Jefe de Rama
    // Subrama Transporte
    'sec-cbio-1-trans-2':    8,
    'sec-cbio-1-trans-3':    9,
    'sec-cbio-1-trans-4':    10,
    'sec-cbio-1-trans-5':    11,
    'prac-cbio-1-trans':     12,  // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-1-trans-tips': 13,  // Tip PAES
    'sec-cbio-1-trans-jefe': 14,  // Jefe de Rama
    // Final
    'sec-cbio-1-jefe-final': 15
  },

  // ── CAP 2 ──────────────────────────────────────────────
  'cap-cbio-2': {
    'sec-cbio-2-root':       0,
    // Subrama Sistema Nervioso
    'sec-cbio-2-nerv-2':     1,
    'sec-cbio-2-nerv-3':     2,
    'sec-cbio-2-nerv-4':     3,
    'sec-cbio-2-nerv-5':     4,
    'prac-cbio-2-nerv':      5,   // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-2-nerv-tips':  6,   // Tip PAES (era undefined)
    'sec-cbio-2-nerv-jefe':  7,   // Jefe de Rama (era undefined)
    // Subrama Reproducción
    'sec-cbio-2-repr-2':     8,
    'sec-cbio-2-repr-3':     9,
    'sec-cbio-2-repr-4':     10,
    'sec-cbio-2-repr-5':     11,
    'prac-cbio-2-repr':      12,  // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-2-repr-tips':  13,  // Tip PAES (era undefined)
    'sec-cbio-2-repr-jefe':  14,  // Jefe de Rama (era undefined)
    // Final
    'sec-cbio-2-jefe-final': 15
  },

  // ── CAP 3 ──────────────────────────────────────────────
  'cap-cbio-3': {
    'sec-cbio-3-root':       0,
    // Subrama División Celular
    'sec-cbio-3-cell-1':     1,
    'sec-cbio-3-cell-2':     2,
    'sec-cbio-3-cell-3':     3,
    'prac-cbio-3-cell':      4,   // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-3-cell-tips':  5,   // Tip PAES
    'sec-cbio-3-cell-jefe':  6,   // Jefe de Rama
    // Subrama Evolución
    'sec-cbio-3-evo-1':      7,
    'sec-cbio-3-evo-2':      8,
    'sec-cbio-3-evo-3':      9,
    'prac-cbio-3-evo':       10,  // NUEVA PRÁCTICA — antes del tip
    'sec-cbio-3-evo-tips':   11,  // Tip PAES
    'sec-cbio-3-evo-jefe':   12,  // Jefe de Rama
    // Final
    'sec-cbio-3-jefe-final': 13
  }
};

// Aplicar
let fixed = 0;
data.forEach(function(cap) {
  const capOrders = orderMap[cap.id];
  if (!capOrders) return;

  cap.secciones.forEach(function(sec) {
    if (capOrders[sec.id] !== undefined) {
      sec.order = capOrders[sec.id];
      fixed++;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Corregidos ' + fixed + ' orders. JSON válido, total capítulos: ' + data.length);
