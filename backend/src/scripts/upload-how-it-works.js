const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Try credentials pair 1
cloudinary.config({ 
  cloud_name: 'dqm3syhwr', 
  api_key: '789892469862936', 
  api_secret: '5Euf0hFX69tQFM3rqhp3HgnCNsk' 
});

const videos = [
  { file: 'C:\\Users\\lucas\\Desktop\\Programacion Proyecto\\1Ruta.mp4', id: '1_ruta', docId: '1_como_funciona' },
  { file: 'C:\\Users\\lucas\\Desktop\\Programacion Proyecto\\2Ensayos.mp4', id: '2_ensayos', docId: '2_como_funciona' },
  { file: 'C:\\Users\\lucas\\Desktop\\Programacion Proyecto\\3Consulta.mp4', id: '3_consulta', docId: '3_como_funciona' }
];

async function main() {
  console.log('Starting Cloudinary video uploads...');
  const results = [];
  for (const item of videos) {
    if (!fs.existsSync(item.file)) {
      console.error(`File not found: ${item.file}`);
      continue;
    }
    console.log(`Uploading ${path.basename(item.file)} to Cloudinary...`);
    try {
      const result = await cloudinary.uploader.upload(item.file, {
        resource_type: 'video',
        folder: 'decoraciones/como_funciona',
        public_id: item.id,
        overwrite: true
      });
      console.log(`Uploaded ${item.id} secure_url:`, result.secure_url);

      const gifUrl = result.secure_url.replace('/video/upload/', '/video/upload/f_gif,fl_animated/').replace(/\.mp4$/, '.gif');
      console.log(`GIF URL for ${item.id}:`, gifUrl);

      results.push({
        docId: item.docId,
        mp4Url: result.secure_url,
        gifUrl: gifUrl
      });
    } catch (err) {
      console.error(`Error uploading ${item.id}:`, err);
    }
  }
  console.log('=== FINAL RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
