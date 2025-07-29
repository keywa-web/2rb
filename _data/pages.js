const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');
const { slugify } = require('transliteration');

const LINKS_SHEET_URL = process.env.LINKS_SHEET_URL;
const DATA_SHEET_URL = process.env.DATA_SHEET_URL;
async function getPairedColumnData() {
  const response = await fetch(DATA_SHEET_URL);
  const csvData = await response.text();
  const rawData = parse(csvData, { columns: false, skip_empty_lines: true });
  const groups = {};
  if (rawData.length < 1) return groups;
  const headerRow = rawData[0];
  const contentRows = rawData.slice(1);
  for (let i = 0; i < headerRow.length; i += 2) {
    const slugHeader = headerRow[i];
    if (!slugHeader || slugHeader.trim() === '') continue;
    const slugKey = slugify(slugHeader.trim(), { lowercase: true, separator: '-' });
    groups[slugKey] = { links: [] };
    contentRows.forEach(row => {
      const text = row[i];
      const url = row[i + 1];
      if (text && text.trim() !== '' && url && url.trim() !== '') {
        groups[slugKey].links.push({ text, url });
      }
    });
  }
  return groups;
}

module.exports = async function() {
  if (LINKS_SHEET_URL.includes('URL_CSV_') || DATA_SHEET_URL.includes('URL_CSV_')) {
    console.warn("Peringatan: URL sheet Links atau Data belum diatur di _data/pages.js");
    return [];
  }
  try {
    const [pairedData, mainLinksResponse] = await Promise.all([
      getPairedColumnData(),
      fetch(LINKS_SHEET_URL)
    ]);
    const mainLinksCsv = await mainLinksResponse.text();
    const mainLinks = parse(mainLinksCsv, { columns: true, skip_empty_lines: true })
      .filter(item => item.enabled === 'TRUE');
    const pagesToCreate = [];
    mainLinks.forEach(link => {
      if (link.url && link.url.startsWith('/')) {
        const slug = slugify(link.text, { lowercase: true, separator: '-' });
        if (pairedData[slug]) {
          pagesToCreate.push({
            title: link.text,
            slug: slug,
            links: pairedData[slug].links
          });
        }
      }
    });
    return pagesToCreate;
  } catch (err) {
    console.error("Error saat menggabungkan data untuk halaman dinamis:", err);
    return [];
  }
};
