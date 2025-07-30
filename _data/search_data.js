const linksData = require('./links.js');
const pagesData = require('./pages.js');

module.exports = async function() {
  try {
    const mainLinks = await linksData();
    const pageGroups = await pagesData();

    let allLinks = [];

    mainLinks.forEach(link => {
      allLinks.push({
        title: link.text,
        url: link.url
      });
    });

    pageGroups.forEach(group => {
      group.links.forEach(link => {
        allLinks.push({
          title: `${link.text} (di ${group.title})`, // Tambahkan konteks grup
          url: link.url
        });
      });
    });
    
    const uniqueLinks = Array.from(new Set(allLinks.map(a => a.url)))
      .map(url => {
        return allLinks.find(a => a.url === url)
      });

    return uniqueLinks;

  } catch (err) {
    console.error("Error saat membuat data pencarian:", err);
    return [];
  }
};
