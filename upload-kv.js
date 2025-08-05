// File: upload-kv.js
const fs = require('fs');
const path = require('path');

// Fungsi untuk menjalankan perintah shell
function runCommand(command) {
    const { execSync } = require('child_process');
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Gagal menjalankan perintah: ${command}`, error);
        process.exit(1);
    }
}

const jsonFilePath = path.join(__dirname, '_site', 'data', 'shortlinks.json');

if (!fs.existsSync(jsonFilePath)) {
    console.log('File shortlinks.json tidak ditemukan. Melewati.');
    process.exit(0);
}

const shortlinksData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Mengubah objek menjadi array untuk diunggah secara bulk
const bulkUploadData = Object.entries(shortlinksData).map(([key, value]) => ({
    key,
    value: String(value) // Pastikan value adalah string
}));

const bulkFilePath = path.join(__dirname, 'kv_shortlinks_upload.json');
fs.writeFileSync(bulkFilePath, JSON.stringify(bulkUploadData));

console.log('Mengunggah data ke KV...');
// Ganti NAMA_PROYEK dengan nama proyek Anda di Cloudflare
runCommand(`npx wrangler pages deployments create _site --project-name="2rb" --branch=main && npx wrangler kv:bulk put SHORTLINKS --path=${bulkFilePath} --project-name="2rb"`);

// Hapus file sementara
fs.unlinkSync(bulkFilePath);

console.log('Selesai!');
