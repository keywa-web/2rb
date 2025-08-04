// File: functions/image-proxy/[[path]].js

export async function onRequest(context) {
  // context.request berisi informasi permintaan yang masuk
  const url = new URL(context.request.url);

  // Ambil URL gambar asli dari query parameter `?url=`
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Harap sediakan parameter URL. Contoh: ?url=https://example.com/image.jpg', { status: 400 });
  }

  try {
    // Cek apakah URL gambar valid
    new URL(imageUrl);
  } catch (e) {
    return new Response('URL gambar tidak valid.', { status: 400 });
  }

  // Buat kunci cache yang unik berdasarkan URL gambar
  const cacheKey = new Request(imageUrl, context.request);
  const cache = caches.default;

  // Cek apakah gambar sudah ada di cache Cloudflare
  let response = await cache.match(cacheKey);

  if (!response) {
    // Jika tidak ada di cache, ambil gambar dari sumber aslinya
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Beberapa situs memblokir permintaan tanpa User-Agent, jadi kita menyamarkannya
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Pastikan pengambilan berhasil sebelum di-cache
    if (!imageResponse.ok) {
        return new Response('Gagal mengambil gambar dari sumber asli.', { status: imageResponse.status });
    }

    // Buat response baru yang bisa di-cache
    response = new Response(imageResponse.body, imageResponse);
    
    // Atur header agar browser dan Cloudflare menyimpan cache
    response.headers.set('Cache-Control', 'public, max-age=604800'); // Cache selama 7 hari
    response.headers.set('CDN-Cache-Control', 'public, max-age=2592000'); // Cache di CDN selama 30 hari

    // Simpan response ke cache untuk permintaan berikutnya
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
}
