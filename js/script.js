// Menunggu seluruh struktur DOM siap sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function () {

    // --- BAGIAN 1: INISIALISASI & SETUP AWAL ---

    // 1. Logika untuk Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });

    // 2. Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
        easing: 'ease-in-out',
    });

    // 3. Seleksi Elemen DOM
    const tabsContainer = document.querySelector('.tabs');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const shapeCards = document.querySelectorAll('.shape-card');
    const calculatorPanelContainer = document.getElementById('calculator-panel-container');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');
    const backButtons = document.querySelectorAll('.back-btn');
    const calcButtons = document.querySelectorAll('.calc-btn');
    const resetButtons = document.querySelectorAll('.reset-btn');


    // --- BAGIAN 2: VALIDASI INPUT UNTUK TOMBOL HITUNG ---

    function setupInputValidation(panel) {
        const inputs = panel.querySelectorAll('input[type="number"]');
        const calcButton = panel.querySelector('.calc-btn');

        if (!calcButton) return; // Keluar jika tidak ada tombol hitung

        const checkInputs = () => {
            let isEnabled = false;

            // Logika khusus untuk Segitiga karena punya 2 kemungkinan kalkulasi
            if (panel.id === 'segitiga-calculator') {
                const alas = panel.querySelector('#segitiga-alas').value;
                const tinggi = panel.querySelector('#segitiga-tinggi').value;
                const s1 = panel.querySelector('#segitiga-s1').value;
                const s2 = panel.querySelector('#segitiga-s2').value;
                const s3 = panel.querySelector('#segitiga-s3').value;

                const canCalcArea = alas.trim() !== '' && tinggi.trim() !== '';
                const canCalcPerimeter = s1.trim() !== '' && s2.trim() !== '' && s3.trim() !== '';

                isEnabled = canCalcArea || canCalcPerimeter;
            } else {
                // Logika umum untuk semua kalkulator lainnya
                // Tombol aktif jika SEMUA input di panel tersebut terisi
                isEnabled = Array.from(inputs).every(input => input.value.trim() !== '');
            }

            calcButton.disabled = !isEnabled;
        };

        // Tambahkan event listener 'input' ke setiap field
        inputs.forEach(input => {
            input.addEventListener('input', checkInputs);
        });

        // Jalankan pengecekan saat pertama kali untuk mengatur state awal tombol
        checkInputs();
    }

    // Terapkan fungsi validasi di atas ke setiap panel kalkulator
    calculatorPanels.forEach(panel => {
        setupInputValidation(panel);
    });
    

    // --- BAGIAN 3: EVENT LISTENERS (INTERAKSI PENGGUNA) ---

    // 1. Event Listener untuk Tombol Tab (Bangun Datar / Bangun Ruang)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
        });
    });

    // 2. Event Listener untuk Kartu Bentuk (Persegi, Lingkaran, dll.)
    shapeCards.forEach(card => {
        card.addEventListener('click', () => {
            const shape = card.dataset.shape;
            const calculatorPanel = document.getElementById(`${shape}-calculator`);
            tabsContainer.style.display = 'none';
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            calculatorPanels.forEach(panel => {
                panel.style.display = 'none';
            });
            calculatorPanelContainer.style.display = 'block';
            calculatorPanel.style.display = 'block';
        });
    });

    // 3. Event Listener untuk Tombol Kembali
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculatorPanels.forEach(panel => {
                panel.style.display = 'none';
            });
            calculatorPanelContainer.style.display = 'none';
            tabsContainer.style.display = 'flex';
            const activeTabButton = document.querySelector('.tab-btn.active');
            if (activeTabButton) {
                const activeTabId = activeTabButton.dataset.tab;
                const activeTabContent = document.getElementById(activeTabId);
                if (activeTabContent) {
                    activeTabContent.style.display = 'block';
                }
            } else {
                tabButtons[0].classList.add('active');
                document.getElementById('datar').classList.add('active');
                document.getElementById('datar').style.display = 'block';
            }
        });
    });

    // 4. Event Listener untuk Tombol Hitung
    calcButtons.forEach(button => {
        button.addEventListener('click', function () {
            const shape = this.dataset.shape;
            switch (shape) {
                case 'persegi': calculatePersegi(); break;
                case 'persegi-panjang': calculatePersegiPanjang(); break;
                case 'segitiga': calculateSegitiga(); break;
                case 'lingkaran': calculateLingkaran(); break;
                case 'kubus': calculateKubus(); break;
                case 'balok': calculateBalok(); break;
                case 'prisma-segitiga': calculatePrisma(); break;
                case 'tabung': calculateTabung(); break;
            }
        });
    });

    // 5. Event Listener untuk Tombol Reset
    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const shape = this.dataset.shape;
            const panel = document.getElementById(`${shape}-calculator`);
            if (panel) {
                panel.querySelectorAll('input').forEach(input => input.value = '');
                const resultSection = panel.querySelector('.result-section');
                if (resultSection) {
                    resultSection.style.display = 'none';
                }
                // [BARU] Panggil kembali validasi untuk menonaktifkan tombol hitung setelah reset
                setupInputValidation(panel); 
            }
        });
    });

    // --- BAGIAN 4: FUNGSI KALKULATOR ---

    // Fungsi helper untuk memformat angka (menghindari desimal panjang)
    function formatNumber(num) {
        // Menggunakan toFixed(2) untuk konsistensi 2 angka desimal, bisa diubah
        const fixedNum = parseFloat(num.toFixed(2));
        // Mengembalikan ke string untuk menghapus .00 jika tidak perlu
        return String(fixedNum);
    }

    function calculatePersegi() {
        const sisi = parseFloat(document.getElementById('persegi-sisi').value);
        if (isNaN(sisi) || sisi <= 0) { alert("Masukkan nilai sisi yang valid."); return; }
        document.getElementById('persegi-summary').innerHTML = `Sisi = <b>${formatNumber(sisi)}</b> cm`;
        document.getElementById('persegi-luas').innerHTML = `Luas = <b>${formatNumber(sisi * sisi)}</b> cm<sup>2</sup>`;
        document.getElementById('persegi-keliling').innerHTML = `Keliling = <b>${formatNumber(4 * sisi)}</b> cm`;
        document.getElementById('persegi-result').style.display = 'block';
    }

    function calculatePersegiPanjang() {
        const panjang = parseFloat(document.getElementById('pp-panjang').value);
        const lebar = parseFloat(document.getElementById('pp-lebar').value);
        if (isNaN(panjang) || isNaN(lebar) || panjang <= 0 || lebar <= 0) { alert("Masukkan nilai panjang dan lebar yang valid."); return; }
        document.getElementById('pp-summary').innerHTML = `Panjang = <b>${formatNumber(panjang)}</b> cm, Lebar = <b>${formatNumber(lebar)}</b> cm`;
        document.getElementById('pp-luas').innerHTML = `Luas = <b>${formatNumber(panjang * lebar)}</b> cm<sup>2</sup>`;
        document.getElementById('pp-keliling').innerHTML = `Keliling = <b>${formatNumber(2 * (panjang + lebar))}</b> cm`;
        document.getElementById('persegi-panjang-result').style.display = 'block';
    }

    function calculateSegitiga() {
        const alas = parseFloat(document.getElementById('segitiga-alas').value);
        const tinggi = parseFloat(document.getElementById('segitiga-tinggi').value);
        const s1 = parseFloat(document.getElementById('segitiga-s1').value);
        const s2 = parseFloat(document.getElementById('segitiga-s2').value);
        const s3 = parseFloat(document.getElementById('segitiga-s3').value);
        const luasP = document.getElementById('segitiga-luas');
        const kelilingP = document.getElementById('segitiga-keliling');
        luasP.innerHTML = ''; kelilingP.innerHTML = '';
        let calculated = false;

        if (!isNaN(alas) && alas > 0 && !isNaN(tinggi) && tinggi > 0) {
            luasP.innerHTML = `Luas = <b>${formatNumber(0.5 * alas * tinggi)}</b> cm<sup>2</sup>`;
            calculated = true;
        }
        if (!isNaN(s1) && s1 > 0 && !isNaN(s2) && s2 > 0 && !isNaN(s3) && s3 > 0) {
            kelilingP.innerHTML = `Keliling = <b>${formatNumber(s1 + s2 + s3)}</b> cm`;
            calculated = true;
        }
        if (!calculated) {
            alert('Input tidak cukup untuk melakukan perhitungan. Silakan lengkapi.');
            return;
        }
        document.getElementById('segitiga-result').style.display = 'block';
    }

    function calculateLingkaran() {
        const jari = parseFloat(document.getElementById('lingkaran-jari').value);
        if (isNaN(jari) || jari <= 0) { alert("Masukkan nilai jari-jari yang valid."); return; }
        document.getElementById('lingkaran-summary').innerHTML = `Jari-jari = <b>${formatNumber(jari)}</b> cm`;
        document.getElementById('lingkaran-luas').innerHTML = `Luas = <b>${formatNumber(Math.PI * jari * jari)}</b> cm<sup>2</sup>`;
        document.getElementById('lingkaran-keliling').innerHTML = `Keliling = <b>${formatNumber(2 * Math.PI * jari)}</b> cm`;
        document.getElementById('lingkaran-result').style.display = 'block';
    }

    function calculateKubus() {
        const sisi = parseFloat(document.getElementById('kubus-sisi').value);
        if (isNaN(sisi) || sisi <= 0) { alert("Masukkan nilai sisi yang valid."); return; }
        document.getElementById('kubus-summary').innerHTML = `Sisi = <b>${formatNumber(sisi)}</b> cm`;
        document.getElementById('kubus-volume').innerHTML = `Volume = <b>${formatNumber(Math.pow(sisi, 3))}</b> cm<sup>3</sup>`;
        document.getElementById('kubus-result').style.display = 'block';
    }

    function calculateBalok() {
        const p = parseFloat(document.getElementById('balok-panjang').value);
        const l = parseFloat(document.getElementById('balok-lebar').value);
        const t = parseFloat(document.getElementById('balok-tinggi').value);
        if (isNaN(p) || isNaN(l) || isNaN(t) || p <= 0 || l <= 0 || t <= 0) { alert("Masukkan nilai panjang, lebar, dan tinggi yang valid."); return; }
        document.getElementById('balok-summary').innerHTML = `p=<b>${formatNumber(p)}</b>, l=<b>${formatNumber(l)}</b>, t=<b>${formatNumber(t)}</b> cm`;
        document.getElementById('balok-volume').innerHTML = `Volume = <b>${formatNumber(p * l * t)}</b> cm<sup>3</sup>`;
        document.getElementById('balok-result').style.display = 'block';
    }

    function calculatePrisma() {
        const a = parseFloat(document.getElementById('prisma-alas').value);
        const ta = parseFloat(document.getElementById('prisma-tinggi-alas').value);
        const T = parseFloat(document.getElementById('prisma-tinggi').value);
        if (isNaN(a) || isNaN(ta) || isNaN(T) || a <= 0 || ta <= 0 || T <= 0) { alert("Masukkan semua nilai yang valid."); return; }
        document.getElementById('prisma-summary').innerHTML = `Alas Segitiga = <b>${formatNumber(a)}</b>, T.Alas = <b>${formatNumber(ta)}</b>, T.Prisma = <b>${formatNumber(T)}</b> cm`;
        document.getElementById('prisma-volume').innerHTML = `Volume = <b>${formatNumber(0.5 * a * ta * T)}</b> cm<sup>3</sup>`;
        document.getElementById('prisma-segitiga-result').style.display = 'block';
    }

    function calculateTabung() {
        const jari = parseFloat(document.getElementById('tabung-jari').value);
        const tinggi = parseFloat(document.getElementById('tabung-tinggi').value);
        if (isNaN(jari) || isNaN(tinggi) || jari <= 0 || tinggi <= 0) { alert("Masukkan nilai jari-jari dan tinggi yang valid."); return; }
        document.getElementById('tabung-summary').innerHTML = `Jari-jari = <b>${formatNumber(jari)}</b> cm, Tinggi = <b>${formatNumber(tinggi)}</b> cm`;
        document.getElementById('tabung-volume').innerHTML = `Volume = <b>${formatNumber(Math.PI * jari * jari * tinggi)}</b> cm<sup>3</sup>`;
        document.getElementById('tabung-result').style.display = 'block';
    }

    // --- BAGIAN 5: LAIN-LAIN ---

    // 1. Update Tahun di Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});