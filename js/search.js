// File: js/search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const mainLinksContainer = document.querySelector('.links-container'); // Kontainer link utama

    if (!searchInput || !resultsContainer || !mainLinksContainer) {
        return; // Keluar jika elemen penting tidak ditemukan
    }

    let fuse;

    // Ambil data pencarian dari file JSON
    fetch('/search-data.json')
        .then(response => response.json())
        .then(data => {
            // Konfigurasi Fuse.js untuk pencarian "fuzzy"
            const options = {
                keys: ['title'], // Cari di dalam field 'title'
                includeScore: true,
                threshold: 0.4 // Atur seberapa "longgar" pencariannya (0.0 = sempurna, 1.0 = apa saja)
            };
            fuse = new Fuse(data, options);
        })
        .catch(error => console.error('Gagal memuat data pencarian:', error));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;

        if (query.length < 2) {
            // Jika query terlalu pendek, kosongkan hasil dan tampilkan link utama
            resultsContainer.innerHTML = '';
            mainLinksContainer.style.display = 'flex';
            return;
        }

        if (!fuse) return;

        const results = fuse.search(query);
        
        // Sembunyikan link utama dan kosongkan hasil
        mainLinksContainer.style.display = 'none';
        resultsContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(({ item }) => {
                // Buat elemen link untuk setiap hasil
                const linkElement = document.createElement('a');
                linkElement.href = item.url;
                linkElement.className = 'link-button'; // Gunakan style yang sama
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';

                const textSpan = document.createElement('span');
                textSpan.className = 'link-text';
                textSpan.textContent = item.title;

                linkElement.appendChild(textSpan);
                resultsContainer.appendChild(linkElement);
            });
        } else {
            // Tampilkan pesan jika tidak ada hasil
            resultsContainer.innerHTML = '<p class="no-results">Tidak ada hasil ditemukan.</p>';
        }
    });
});
