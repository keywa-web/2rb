// File: upload-kv.js
const fs = require('fs');
const { exec } = require('child_process');

const shortlinksData = JSON.parse(fs.readFileSync('./_site/data/shortlinks.json', 'utf8'));

// GANTI DENGAN NAMA KV NAMESPACE ANDA
const namespaceName = 'shortlink'; 

for (const key in shortlinksData) {
  const value = shortlinksData[key];
  const command = `npx wrangler kv:key put --namespace="${namespaceName}" "${key}" "${value}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error unggah KV untuk key '${key}':`, error);
      return;
    }
    console.log(`Berhasil mengunggah key: '${key}'`);
  });
}
