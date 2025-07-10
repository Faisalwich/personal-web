// 1. Mendapatkan elemen tombol dan body
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;

// 2. Fungsi untuk mengubah ikon tombol
const updateIcon = () => {
  if (body.classList.contains("light-mode")) {
    themeToggleButton.textContent = "🌙"; // Tampilkan bulan di mode terang
  } else {
    themeToggleButton.textContent = "☀️"; // Tampilkan matahari di mode gelap
  }
};

// 3. Menerapkan tema yang tersimpan saat halaman dimuat
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
}
updateIcon(); // Perbarui ikon saat halaman pertama kali dibuka

// 4. Menambahkan event listener saat tombol diklik
themeToggleButton.addEventListener("click", () => {
  // Toggle class 'light-mode' pada body
  body.classList.toggle("light-mode");

  // Simpan pilihan tema ke localStorage
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.removeItem("theme"); // Hapus jika kembali ke default (gelap)
  }

  updateIcon(); // Perbarui ikon setiap kali tombol diklik
});

// --- GANTI KODE HAMBURGER LAMA ANDA DENGAN YANG INI ---
const hamburger = document.getElementById("hamburger-menu");
const navLinksContainer = document.getElementById("nav-links");
const allLinksInNav = document.querySelectorAll("#nav-links a"); // Memilih semua link di dalam menu

// Fungsi untuk membuka/menutup menu
hamburger.addEventListener("click", () => {
  navLinksContainer.classList.toggle("active");
});

// Fungsi untuk menutup menu ketika salah satu link diklik
allLinksInNav.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("active");
  });
});
// --- TAMBAHKAN KODE BARU UNTUK EFEK MENGETIK DI SINI ---
const typingEffectElement = document.getElementById("typing-effect");
if (typingEffectElement) {
  // Cek apakah elemen ada di halaman ini
  const words = ["Mahasiswa Sistem Informasi", "Web Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 100 : 200;

    if (isDeleting) {
      typingEffectElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEffectElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(type, typingSpeed);
  };

  // Panggil fungsi setelah halaman dimuat
  document.addEventListener("DOMContentLoaded", type);
}

// --- Kode untuk Menampilkan Jurnal ---

// Fungsi ini akan berjalan setelah seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const jurnalContainer = document.getElementById('jurnal-container');
    
    // Pastikan kita berada di halaman yang memiliki kontainer jurnal
    if (jurnalContainer) {
        // GANTI NAMA FILE DI BAWAH INI
        const namaFileJurnal = '2025-07-10-tulisan-pertamaku.md'; 

        // Ambil file jurnal dari server
        fetch(`/_jurnal/${namaFileJurnal}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal memuat file jurnal.');
                }
                return response.text();
            })
            .then(markdownText => {
                // Memisahkan front matter (metadata) dan isi markdown
                const parts = markdownText.split('---');
                const frontMatterText = parts[1];
                const markdownBody = parts[2];

                // Mengolah front matter untuk mendapatkan judul dan tanggal
                const frontMatter = {};
                frontMatterText.split('\n').forEach(line => {
                    if (line.trim()) {
                        const [key, ...value] = line.split(':');
                        frontMatter[key.trim()] = value.join(':').trim();
                    }
                });

                // Mengubah isi markdown menjadi HTML
                const contentHtml = marked.parse(markdownBody);

                // Membuat format tanggal yang lebih ramah
                const tanggal = new Date(frontMatter.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // Menyiapkan HTML lengkap untuk ditampilkan
                const postHtml = `
                    <article class="jurnal-post">
                        <h3>${frontMatter.title}</h3>
                        <p class="post-meta">Dipublikasikan pada ${tanggal}</p>
                        <div class="post-content">
                            ${contentHtml}
                        </div>
                    </article>
                `;
                
                // Menampilkan hasilnya ke dalam kontainer
                jurnalContainer.innerHTML = postHtml;
            })
            .catch(error => {
                console.error(error);
                jurnalContainer.innerHTML = `<p>Gagal memuat tulisan. Silakan coba lagi nanti.</p>`;
            });
    }
});
