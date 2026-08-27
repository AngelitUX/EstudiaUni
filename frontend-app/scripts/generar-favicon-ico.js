#!/usr/bin/env node
/**
 * Genera public/favicon.ico a partir de los PNG del logo que ya existen.
 *
 * Por que existe este script: el favicon.ico que habia era una conversion mala
 * — un BMP de 4 bits con la paleta VGA de 16 colores de Windows, 76% gris, sin
 * el morado de marca ni siquiera presente en su paleta. Como el .ico es el
 * primero que declara index.html y el que los navegadores prefieren por
 * costumbre, la pestana mostraba ese icono gris en vez de la "E" morada,
 * aunque los PNG (16, 32 y 48) si estaban correctos.
 *
 * Un .ico puede EMBEBER PNG tal cual desde Windows Vista; lo soportan todos los
 * navegadores actuales. Asi que en vez de re-cuantizar a BMP indexado (que es
 * justo lo que estropeo el original), este script mete los PNG buenos sin
 * tocarles un byte: el icono resultante conserva los colores exactos.
 *
 * Uso:  node scripts/generar-favicon-ico.js
 */

const fs = require('fs');
const path = require('path');

const raizPublic = path.join(__dirname, '..', 'public');
const fuentes = [
  { archivo: 'favicon-16x16.png', lado: 16 },
  { archivo: 'favicon-32x32.png', lado: 32 },
  { archivo: 'favicon-48x48.png', lado: 48 },
];
const salida = path.join(raizPublic, 'favicon.ico');

const imagenes = [];
for (const f of fuentes) {
  const ruta = path.join(raizPublic, f.archivo);
  if (!fs.existsSync(ruta)) { console.error(`Falta ${f.archivo}`); process.exit(1); }
  const datos = fs.readFileSync(ruta);
  // Comprobar la firma PNG antes de empaquetar nada.
  if (datos.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    console.error(`${f.archivo} no es un PNG valido`);
    process.exit(1);
  }
  // Leer el tamano real de la cabecera IHDR y no fiarse del nombre del archivo.
  const ancho = datos.readUInt32BE(16);
  const alto = datos.readUInt32BE(20);
  if (ancho !== f.lado || alto !== f.lado) {
    console.error(`${f.archivo} dice ser ${f.lado}x${f.lado} pero mide ${ancho}x${alto}`);
    process.exit(1);
  }
  imagenes.push({ ...f, datos, ancho, alto });
}

const CABECERA = 6;
const ENTRADA = 16;
let offset = CABECERA + ENTRADA * imagenes.length;

const cabecera = Buffer.alloc(CABECERA);
cabecera.writeUInt16LE(0, 0);                 // reservado
cabecera.writeUInt16LE(1, 2);                 // tipo 1 = icono
cabecera.writeUInt16LE(imagenes.length, 4);   // cuantas imagenes

const entradas = [];
for (const img of imagenes) {
  const e = Buffer.alloc(ENTRADA);
  e.writeUInt8(img.ancho === 256 ? 0 : img.ancho, 0);   // 0 significa 256
  e.writeUInt8(img.alto === 256 ? 0 : img.alto, 1);
  e.writeUInt8(0, 2);                       // colores de la paleta (0 = sin paleta)
  e.writeUInt8(0, 3);                       // reservado
  e.writeUInt16LE(1, 4);                    // planos
  e.writeUInt16LE(32, 6);                   // bits por pixel
  e.writeUInt32LE(img.datos.length, 8);     // tamano de la imagen
  e.writeUInt32LE(offset, 12);              // donde empieza
  offset += img.datos.length;
  entradas.push(e);
}

fs.writeFileSync(salida, Buffer.concat([cabecera, ...entradas, ...imagenes.map((i) => i.datos)]));

console.log(`Generado ${path.relative(process.cwd(), salida)}`);
for (const img of imagenes) console.log(`  ${img.ancho}x${img.alto}  ${img.datos.length} bytes (PNG embebido)`);
console.log(`  total: ${fs.statSync(salida).size} bytes`);
