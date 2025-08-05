// File: functions/admin/update-kv.js

// Fungsi ini akan mengambil data shortlink dari CSV dan mengisi KV
async function updateShortlinksKV(context) {
  const { SHORTLINKS } = context.env;
  const GOOGLE_SHEET_URL = context.env.SHORTLINKS_SHEET_URL;

  if (!SHORTLINKS || !GOOGLE_SHEET_URL) {
    return new Response("Variabel lingkungan belum diatur.", { status: 500 });
  }

  try {
    console.log("Mengambil data dari Google Sheet...");
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvData = await response.text();
    
    // Kita perlu parser CSV di sini. Kita akan gunakan parser sederhana.
    // Untuk CSV yang lebih kompleks, library akan lebih baik.
    const rows = csvData.trim().split('\n').slice(1); // Abaikan header
    
    let operations = [];
    rows.forEach(row => {
      const [key, destination_url] = row.split(',');
      if (key && destination_url) {
        // Menambahkan operasi 'put' ke dalam array
        operations.push(SHORTLINKS.put(key.trim(), destination_url.trim()));
      }
    });

    // Menjalankan semua operasi 'put' secara bersamaan
    await Promise.all(operations);
    
    console.log(`Berhasil memperbarui ${operations.length} shortlink.`);
    return new Response(`Berhasil memperbarui ${operations.length} shortlink.`);
    
  } catch (error) {
    console.error("Gagal memperbarui KV:", error);
    return new Response("Gagal memperbarui KV: " + error.message, { status: 500 });
  }
}

export async function onRequestGet(context) {
  // Amankan endpoint ini dengan query parameter rahasia
  const url = new URL(context.request.url);
  const secret = url.searchParams.get('secret');

  // GANTI 'SECRET_KEY_ANDA' DENGAN KATA SANDI ACAK YANG PANJANG
  const MY_SECRET = context.env.UPDATE_SECRET;

  if (secret === MY_SECRET) {
    // Jika rahasia benar, jalankan fungsi update
    return await updateShortlinksKV(context);
  } else {
    // Jika salah, tolak akses
    return new Response("Akses ditolak.", { status: 403 });
  }
}
