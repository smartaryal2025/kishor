const fs = require('fs');
const https = require('https');
const path = require('path');

// Since this script is already inside the 'libs' folder, we save files right here
const libsDir = __dirname; 

const files = [
    { url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/umd/ffmpeg.js', name: 'ffmpeg.js' },
    { url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/umd/814.ffmpeg.js', name: '814.ffmpeg.js' },
    { url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/umd/index.js', name: 'index.js' }, 
    { url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js', name: 'ffmpeg-core.js' },
    { url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm', name: 'ffmpeg-core.wasm' }
];

files.forEach(file => {
    const dest = path.join(libsDir, file.name);
    https.get(file.url, (response) => {
        response.pipe(fs.createWriteStream(dest));
        response.on('end', () => console.log(`[SUCCESS] Downloaded: ${file.name}`));
    }).on('error', (err) => console.error(`[ERROR] downloading ${file.name}:`, err));
});