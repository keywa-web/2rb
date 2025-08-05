// ============================================================
// File: .eleventy.js (VERSI FINAL YANG LENGKAP & BENAR)
// ============================================================

// PENTING: Baris ini WAJIB ada di paling atas.
// Ia akan memuat semua variabel dari file .env agar bisa dibaca oleh
// skrip di folder _data (seperti process.env.LINKS_SHEET_URL)
require('dotenv').config();


module.exports = function(eleventyConfig) {

  // --- 1. Menyalin File Statis ---
  // Perintah untuk menyalin folder dan file yang tidak diproses oleh Eleventy
  // langsung ke folder output (_site).

  // Salin folder css
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  // Salin SEMUA file favicon
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");


  // --- 2. Fungsi Bantuan (Filter) ---
  // Membuat "slug" yang bersih untuk URL (misal: "Toko Saya" -> "toko-saya")
  // Anda mungkin perlu menjalankan: npm install transliteration
  const { slugify } = require("transliteration");
  eleventyConfig.addFilter("slugify", function(str) {
      if (!str) return; // Pengaman jika inputnya kosong
      return slugify(str, {
          lowercase: true,
          separator: '-'
      });
  });

  // --- 3. Konfigurasi Direktori ---
  // Memberitahu Eleventy di mana folder-folder penting berada.
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
