const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');

const GOOGLE_SHEET_URL = process.env.LINKS_SHEET_URL;
module.exports = async function() {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes('URL_CSV_')) {
    console.warn("Peringatan: URL untuk sheet 'Links' belum diatur di _data/links.js");
    return [];
  }
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvData = await response.text();
    return parse(csvData, { columns: true, skip_empty_lines: true })
      .filter(item => item.enabled === 'TRUE');
  } catch (err) {
    console.error("Error mengambil data Links:", err);
    return [];
  }
};
