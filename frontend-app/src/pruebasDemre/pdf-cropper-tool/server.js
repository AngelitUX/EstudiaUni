const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
// Aumentar el límite para que soporten imágenes base64 grandes
app.use(bodyParser.json({ limit: '50mb' }));

// Rutas a los directorios del proyecto
const IMAGES_DIR = path.resolve(__dirname, '../../assets/images/M1-2024-IMAGENES');

// Crear directorio de imágenes si no existe
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Servir frontend de la herramienta
app.use(express.static(path.join(__dirname, 'public')));
// Servir el PDF desde la carpeta superior
app.use('/pdf', express.static(path.resolve(__dirname, '..')));

app.get('/api/pdfs', (req, res) => {
  const pdfsDir = path.resolve(__dirname, '..');
  fs.readdir(pdfsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el directorio' });
    
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    const options = pdfFiles.map(file => {
      const baseName = file.replace(/\.pdf$/i, '');
      const dirName = `${baseName}-IMAGENES`;
      
      // Mapeo inteligente para los JSON que ya existen, o inferencia para los nuevos
      let jsonName = `${baseName.toLowerCase()}-preguntas-db.json`;
      if (baseName === 'M1-2024') jsonName = 'm1-preguntas-db.json';
      if (baseName === 'M1-INVIERNO-2024') jsonName = 'm1-invierno-preguntas-db.json';
      
      return {
        file,
        name: baseName.replace(/-/g, ' '),
        dirName,
        jsonName
      };
    });
    
    res.json(options);
  });
});

app.post('/api/save-crop', (req, res) => {
  const { questionNumber, imageBase64, directoryName = 'M1-2024-IMAGENES', jsonName = 'm1-preguntas-db.json' } = req.body;
  
  const JSON_FILE = path.resolve(__dirname, '..', jsonName);
  const JSON_ASSET_FILE = path.resolve(__dirname, '../../assets', jsonName);
  
  if (!questionNumber || !imageBase64) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Rutas a los directorios del proyecto basadas en el nombre del directorio
  const dynamicImagesDir = path.resolve(__dirname, '../../assets/images', directoryName);
  
  // Crear directorio de imágenes si no existe
  if (!fs.existsSync(dynamicImagesDir)) {
    fs.mkdirSync(dynamicImagesDir, { recursive: true });
  }

  // 1. Guardar la imagen
  const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");
  const imageFileName = `${questionNumber}.png`;
  const imagePath = path.join(dynamicImagesDir, imageFileName);
  
  fs.writeFileSync(imagePath, base64Data, 'base64');
  console.log(`Guardada imagen: ${imagePath}`);

  res.json({ success: true, message: `Imagen ${questionNumber} guardada exitosamente.` });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 HERRAMIENTA DE RECORTES LISTA (MODO SOLO-IMÁGENES)`);
  console.log(`Abre en tu navegador: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
