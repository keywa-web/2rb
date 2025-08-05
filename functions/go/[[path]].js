// File: functions/go/[[path]].js

// Impor data shortlink yang sudah dibangun oleh Eleventy
import shortlinks from "../../_site/data/shortlinks.json";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get('to');

  if (!key) {
    // Jika tidak ada parameter 'to', arahkan ke halaman utama
    return Response.redirect(url.origin, 302);
  }

  // Cari URL tujuan di dalam data shortlink
  const destinationUrl = shortlinks[key];

  if (destinationUrl) {
    // Jika ditemukan, lakukan redirect permanen (301)
    console.log(`Redirecting '${key}' to '${destinationUrl}'`);
    return Response.redirect(destinationUrl, 301);
  } else {
    // Jika tidak ditemukan, arahkan ke halaman 404 atau halaman utama
    console.warn(`Shortlink key '${key}' not found.`);
    return Response.redirect(url.origin, 302);
  }
}
