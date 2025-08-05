// File: _data/shortlinks.js
const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');

// AMBIL URL DARI VARIABEL LINGKUNGAN
const GOOGLE_SHEET_URL = process.env.SHORTLINKS_SHEET_URL;

module.exports = async function() {
  if (!GOOGLE_SHEET_URL) return {};
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvData = await response.text();
    const data = parse(csvData, { columns: true, skip_empty_lines: true });

    // Ubah array menjadi objek key-value untuk pencarian cepat
    const linkMap = {};
    data.forEach(item => {
      if (item.key && item.destination_url) {
        linkMap[item.key] = item.destination_url;
      }
    });
    return linkMap;
    
  } catch (err) {
    console.error("Error mengambil data Shortlinks:", err);
    return {};
  }
};
