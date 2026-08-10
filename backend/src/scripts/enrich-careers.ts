import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.resolve(__dirname, '../../../frontend-app/public/Matricula_2025_WEB_15_07_2025.csv');
const JSON_PATH = path.resolve(__dirname, '../../../frontend-app/src/assets/universidades-carreras.json');
const OUT_PATH = path.resolve(__dirname, '../../../frontend-app/src/assets/universidades-carreras.enriched.json');

// The source CSV already has U+FFFD (�) baked in at every position where an accented
// character should be (confirmed at the byte level — not a decode issue on our side),
// and several place names were truncated right after the bad byte. Best-effort manual
// fix-ups for the ~20 distinct corrupted place names actually present in the file.
const KNOWN_FIXES: Array<[RegExp, string]> = [
  [/VI�A DEL MA?R?/gi, 'Viña del Mar'],
  [/PE�ALOLE?N?/gi, 'Peñalolén'],
  [/PE�AFLOR?/gi, 'Peñaflor'],
  [/CA�ETE/gi, 'Cañete'],
  [/CHA�ARAL/gi, 'Chañaral'],
  [/�U�OA/gi, 'Ñuñoa'],
  [/VICU�A MACKENNA/gi, 'Vicuña Mackenna'],
  [/VICU�A/gi, 'Vicuña'],
  [/�U�BLE/gi, 'Ñuble'],
  [/�UBLE/gi, 'Ñuble'],
  [/VALPARA�SO/gi, 'Valparaíso'],
  [/LOS R�OS/gi, 'Los Ríos'],
  [/BIOB�O/gi, 'Biobío'],
  [/LA ARAUCAN�A/gi, 'La Araucanía'],
  [/TARAPAC�/gi, 'Tarapacá'],
  [/AYS�N/gi, 'Aysén'],
  [/IBA�EZ/gi, 'Ibáñez'],
  [/IBA�/gi, 'Ibáñez'],
];

function fixKnownCorruption(s: string): string {
  let out = s;
  for (const [pattern, replacement] of KNOWN_FIXES) {
    out = out.replace(pattern, replacement);
  }
  // Anything left over is unrecoverable at the source — strip the marker rather
  // than show a broken glyph to users.
  return out.replace(/�/g, '');
}

function normalize(s: string): string {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\s*[-,]\s*PLAN COMUN.*$/i, '')
    .replace(/[.,''"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True if either normalized string contains the other (handles formal vs short institution names). */
function fuzzyContains(a: string, b: string): boolean {
  return a === b || a.includes(b) || b.includes(a);
}

interface CsvRow {
  institucion: string;
  region: string;
  comuna: string;
  sede: string;
  carrera: string;
  acreditacionInstitucion: string;
  acreditacionCarrera: string;
  modalidad: string;
  jornada: string;
  duracion: string;
  matriculaTotal: number;
  matriculaMujer: number;
  matriculaHombre: number;
  edadPromedio: number;
}

function parseCsv(): CsvRow[] {
  const buf = fs.readFileSync(CSV_PATH);
  const text = buf.toString('utf8'); // confirmed at byte level — file is UTF-8, not latin1
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(';');
    if (f.length < 45) continue;
    const matriculaTotal = parseInt(f[1], 10) || 0;
    if (matriculaTotal <= 0) continue; // skip careers with no active enrollment

    rows.push({
      institucion: fixKnownCorruption(f[13]),
      acreditacionInstitucion: f[14],
      region: fixKnownCorruption(f[15]),
      comuna: fixKnownCorruption(f[17]),
      sede: fixKnownCorruption(f[18]),
      carrera: fixKnownCorruption(f[19]),
      modalidad: f[29],
      jornada: f[30],
      duracion: f[32],
      acreditacionCarrera: f[35],
      matriculaTotal,
      matriculaMujer: parseInt(f[2], 10) || 0,
      matriculaHombre: parseInt(f[3], 10) || 0,
      edadPromedio: parseFloat((f[44] || '').replace(',', '.')) || 0,
    });
  }
  return rows;
}

function main() {
  console.log('Parsing CSV...');
  const csvRows = parseCsv();
  console.log(`Parsed ${csvRows.length} active-enrollment rows from CSV.`);

  // Index by normalized institution -> normalized career -> rows[]
  const index = new Map<string, Map<string, CsvRow[]>>();
  for (const row of csvRows) {
    const instKey = normalize(row.institucion);
    const careerKey = normalize(row.carrera);
    if (!index.has(instKey)) index.set(instKey, new Map());
    const byCareer = index.get(instKey)!;
    if (!byCareer.has(careerKey)) byCareer.set(careerKey, []);
    byCareer.get(careerKey)!.push(row);
  }

  const careers = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  console.log(`Loaded ${careers.length} careers from local JSON.`);

  let matched = 0;
  let unmatched = 0;

  for (const career of careers) {
    const instKey = normalize(career.universidad);
    const careerKey = normalize(career.nombre);

    let rows: CsvRow[] | undefined;
    let byCareer = index.get(instKey);

    // Fallback: institution name mismatch (e.g. "Universidad de Playa Ancha" vs the
    // CSV's formal "Universidad de Playa Ancha de Ciencias de la Educación").
    if (!byCareer) {
      for (const [k, v] of index.entries()) {
        if (fuzzyContains(k, instKey)) {
          byCareer = v;
          break;
        }
      }
    }

    if (byCareer) {
      rows = byCareer.get(careerKey);
      // Fallback: substring match if exact normalized name didn't hit
      if (!rows) {
        for (const [k, v] of byCareer.entries()) {
          if (fuzzyContains(k, careerKey)) {
            rows = v;
            break;
          }
        }
      }
    }

    if (!rows || rows.length === 0) {
      unmatched++;
      career.matriculaData = null;
      continue;
    }

    matched++;
    const totalMatricula = rows.reduce((s, r) => s + r.matriculaTotal, 0);
    const totalMujer = rows.reduce((s, r) => s + r.matriculaMujer, 0);
    const sedes = Array.from(new Set(rows.map((r) => r.sede))).filter(Boolean);
    const comunas = Array.from(new Set(rows.map((r) => r.comuna))).filter(Boolean);
    const modalidades = Array.from(new Set(rows.map((r) => r.modalidad))).filter(Boolean);
    const jornadas = Array.from(new Set(rows.map((r) => r.jornada))).filter(Boolean);
    const duracion = rows[0].duracion;
    const acreditada = rows.some((r) => (r.acreditacionCarrera || '').toUpperCase().includes('ACREDITADA') && !(r.acreditacionCarrera || '').toUpperCase().includes('NO ACREDITADA'));
    const edades = rows.filter((r) => r.edadPromedio > 0).map((r) => r.edadPromedio);
    const edadPromedio = edades.length ? Math.round((edades.reduce((s, e) => s + e, 0) / edades.length) * 10) / 10 : null;
    const pctMujeres = totalMatricula > 0 ? Math.round((totalMujer / totalMatricula) * 100) : null;

    career.matriculaData = {
      totalMatricula,
      pctMujeres,
      edadPromedio,
      sedes,
      comunas,
      modalidades,
      jornadas,
      duracionSemestres: duracion ? parseInt(duracion, 10) || null : null,
      acreditada,
      fuente: 'Matrícula 2025 (SIES/MINEDUC)',
    };

    // Build an enriched description: keep the original subject-matter sentence,
    // append real, verifiable facts instead of nothing (was previously identical
    // for every university offering the same-named career).
    const parts: string[] = [career.descripcion];
    const sedeText = sedes.length === 1 ? `en su sede de ${titleCase(sedes[0])}` : `en ${sedes.length} sedes (${comunas.slice(0, 3).map(titleCase).join(', ')})`;
    const modalidadText = modalidades.length ? modalidades.map((m) => m.toLowerCase()).join('/') : null;
    const jornadaText = jornadas.length ? jornadas.map((j) => j.toLowerCase()).join('/') : null;

    let factsSentence = `Se dicta ${sedeText}`;
    if (modalidadText) factsSentence += `, modalidad ${modalidadText}`;
    if (jornadaText) factsSentence += ` (jornada ${jornadaText})`;
    if (career.matriculaData.duracionSemestres) factsSentence += `, con una duración de ${career.matriculaData.duracionSemestres} semestres`;
    factsSentence += `. ${acreditada ? 'Programa acreditado' : 'Programa actualmente sin acreditación'}`;
    if (totalMatricula > 0) {
      factsSentence += `, con ${totalMatricula.toLocaleString('es-CL')} estudiantes matriculados`;
      if (pctMujeres !== null) factsSentence += ` (${pctMujeres}% mujeres)`;
    }
    if (edadPromedio) factsSentence += `. Edad promedio de los estudiantes: ${edadPromedio} años`;
    factsSentence += '.';

    parts.push(factsSentence);
    career.descripcionDetallada = parts.join(' ');
  }

  console.log(`Matched: ${matched} / ${careers.length} (${Math.round((matched / careers.length) * 100)}%)`);
  console.log(`Unmatched: ${unmatched}`);

  fs.writeFileSync(OUT_PATH, JSON.stringify(careers, null, 0));
  console.log(`Wrote enriched dataset to ${OUT_PATH}`);
}

function titleCase(s: string): string {
  // \w doesn't match accented letters (ñ, á, etc.), so split on plain spaces/hyphens
  // instead of relying on \b word-boundary detection to avoid mis-capitalizing
  // mid-word after those characters (e.g. "viña" -> "ViñA").
  return (s || '')
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

main();
