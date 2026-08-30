#!/usr/bin/env node
/**
 * Convierte backend/.env en el YAML que espera `gcloud run deploy --env-vars-file`.
 *
 * Por que hace falta un archivo y no `--set-env-vars`:
 * FIREBASE_PRIVATE_KEY es una clave PEM multilinea. Pasarla por linea de
 * comandos en Windows es una fuente inagotable de errores de comillas y saltos
 * de linea, y basta un caracter mal escapado para que Firebase Admin falle en
 * produccion con un mensaje poco claro. Un YAML lo resuelve limpiamente.
 *
 * SEGURIDAD: el archivo que genera CONTIENE LOS SECRETOS EN CLARO. Esta en
 * .gitignore y el script de despliegue lo borra en cuanto termina. No lo
 * commitees, no lo compartas, no lo dejes tirado.
 *
 * Uso:  node scripts-deploy/generar-env-yaml.js <ruta-.env> <ruta-salida.yaml>
 */

const fs = require('fs');
const path = require('path');

const [, , rutaEnv, rutaSalida] = process.argv;

if (!rutaEnv || !rutaSalida) {
  console.error('Uso: node generar-env-yaml.js <.env> <salida.yaml>');
  process.exit(1);
}
if (!fs.existsSync(rutaEnv)) {
  console.error(`No existe el archivo: ${path.resolve(rutaEnv)}`);
  process.exit(1);
}

// Variables que NO deben viajar al servidor.
const EXCLUIR = new Set([
  'PORT',                 // lo inyecta Cloud Run; fijarlo a 3000 romperia el arranque
  'OPENAI_API_KEY',       // declarada pero sin uso: el proveedor real es Gemini
  'WEBPAY_ENVIRONMENT',   // pasarela anterior a Flow, ningun archivo la lee
  'WEBPAY_COMMERCE_CODE',
  'WEBPAY_API_KEY',
  'WEBPAY_BASE_URL',
]);

// Se usa el MISMO parser que el backend (dotenv, via @nestjs/config) en vez de
// uno hecho a mano. No es un detalle menor: FIREBASE_PRIVATE_KEY se guarda en
// el .env como una sola linea con "\n" LITERALES (barra + n), y dotenv los
// convierte en saltos de linea reales al leer. Un parser propio que copiara el
// texto tal cual dejaria la clave PEM en una sola linea y Firebase Admin la
// rechazaria en produccion. Usando dotenv, el servidor y este script
// interpretan el archivo exactamente igual por construccion.
const vars = require('dotenv').parse(fs.readFileSync(rutaEnv));

const incluidas = [];
const vacias = [];
const excluidas = [];

let yaml = '# Generado por generar-env-yaml.js — CONTIENE SECRETOS, no commitear.\n';

for (const [k, v] of Object.entries(vars)) {
  if (EXCLUIR.has(k)) { excluidas.push(k); continue; }
  if (!v) { vacias.push(k); continue; }

  // Los saltos de linea reales de la clave PEM se guardan como \n literal
  // dentro de una cadena YAML entre comillas dobles; Node los recibe tal cual
  // los tenia el .env. Se escapan tambien las comillas y las barras invertidas.
  const escapado = v
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n');

  yaml += `${k}: "${escapado}"\n`;
  incluidas.push(k);
}

fs.writeFileSync(rutaSalida, yaml, { mode: 0o600 });

// Nunca se imprimen los valores, solo los nombres.
console.log(`Generado: ${rutaSalida}`);
console.log(`  incluidas (${incluidas.length}): ${incluidas.join(', ')}`);
if (vacias.length) console.log(`  omitidas por estar vacias: ${vacias.join(', ')}`);
if (excluidas.length) console.log(`  omitidas a proposito: ${excluidas.join(', ')}`);

// `gcloud run deploy --env-vars-file` REEMPLAZA todas las variables del servicio,
// no las fusiona: cualquier variable que no este aqui DESAPARECE del Cloud Run en
// funcionamiento. Si falta una que la produccion necesita, Foco / los pagos /
// Firebase Admin se rompen despues del deploy sin ningun error en el propio deploy.
const ESPERADAS_EN_PRODUCCION = [
  'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY',
  'GEMINI_API_KEY', 'FRONTEND_APP_URL',
  'FLOW_ENVIRONMENT', 'FLOW_API_KEY', 'FLOW_SECRET_KEY',
  'FLOW_PLAN_ID_MONTHLY', 'FLOW_PLAN_ID_YEARLY', 'BACKEND_PUBLIC_URL',
  'TURNSTILE_SECRET_KEY',
];
const faltantes = ESPERADAS_EN_PRODUCCION.filter((k) => !incluidas.includes(k));
if (faltantes.length) {
  console.log('');
  console.log('  ⚠️  ATENCION: estas variables se esperan en produccion y NO estan en el .env:');
  console.log(`      ${faltantes.join(', ')}`);
  console.log('      El deploy REEMPLAZA todas las variables del servicio; si el Cloud Run');
  console.log('      actual las tenia, se van a PERDER. Revisa las que tiene hoy con:');
  console.log('      gcloud run services describe estudiauni-api --region southamerica-west1 \\');
  console.log('        --format="value(spec.template.spec.containers[0].env)"');
}
