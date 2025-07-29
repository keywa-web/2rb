// ============================================================
// File: .eleventy.js
// ============================================================
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  const { slugify } = require("transliteration");
  eleventyConfig.addFilter("slugify", function(str) {
      if (!str) return;
      return slugify(str, {
          lowercase: true,
          separator: '-'
      });
  });

  return {
    // Konfigurasi direktori standar
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
