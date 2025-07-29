const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');

const GOOGLE_SHEET_URL = process.env.SETTINGS_SHEET_URL;

module.exports = async function() {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes('URL_CSV_')) {
    console.warn("Peringatan: URL untuk sheet 'Settings' belum diatur di _data/settings.js");
    return {};
  }
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvData = await response.text();
    const data = parse(csvData, { columns: true, skip_empty_lines: true });
    const settings = {};
    data.forEach(item => {
      if (item.key) settings[item.key] = item.value;
    });
    return settings;
  } catch (err) {
    console.error("Error mengambil data Settings:", err);
    return {};
  }
};
