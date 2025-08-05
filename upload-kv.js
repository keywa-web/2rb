// File: upload-kv.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process'); // Gunakan execSync agar lebih mudah dibaca lognya

// Nama binding yang Anda atur di Dasbor Cloudflare (Settings > Functions > KV namespace bindings)
// Ini adalah NAMA VARIABEL, bukan nama databasenya.
const BINDING_NAME = 'SHORTLINKS'; 

// Path ke file JSON yang dihasilkan oleh Eleventy
const jsonFilePath = path.join(__dirname, '_site', 'data', 'shortlinks.json');

if (!fs.existsSync(jsonFilePath)) {
  console.log(`File data shortlinks tidak ditemukan di ${jsonFilePath}. Melewati unggah KV.`);
  process.exit(0);
}

try {
  const shortlinksData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  console.log('Membaca data shortlinks... memulai unggah ke KV.');

  for (const key in shortlinksData) {
    const value = shortlinksData[key];
    
    // Perintah Wrangler yang benar untuk Pages
    const command = `npx wrangler pages functions kv:key put --binding="${BINDING_NAME}" --key="${key}" --value="${value}" --project-name="2rb"`;
    
    console.log(`Menjalankan: ${command}`);
    execSync(command, { stdio: 'inherit' });
  }

  console.log('Proses unggah KV selesai.');

} catch (error) {
  console.error('Gagal memproses atau mengunggah data KV:', error);
  process.exit(1);
}
