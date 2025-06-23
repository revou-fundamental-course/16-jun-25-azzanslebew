document.addEventListener('DOMContentLoaded', function () {
    // --- Bagian Fungsionalitas Umum ---
    const tabsContainer = document.querySelector('.tabs');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const shapeCards = document.querySelectorAll('.shape-card');
    const calculatorPanelContainer = document.getElementById('calculator-panel-container');
    const calculatorPanels = document.querySelectorAll('.calculator-panel');
    const backButtons = document.querySelectorAll('.back-btn');
    const calcButtons = document.querySelectorAll('.calc-btn');
    const resetButtons = document.querySelectorAll('.reset-btn');

    // Fungsi untuk handle Tab
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset semua tab buttons dan content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none'; // Tambahkan ini
            });

            // Aktifkan tab yang dipilih
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add('active');
            targetTab.style.display = 'block'; // Tambahkan ini
        });
    });

    // Fungsi untuk menampilkan panel kalkulator
    shapeCards.forEach(card => {
        card.addEventListener('click', () => {
            const shape = card.dataset.shape;
            const calculatorPanel = document.getElementById(`${shape}-calculator`);

            // Sembunyikan semua tab content dan tabs
            tabsContainer.style.display = 'none';
            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            // Sembunyikan semua panel kalkulator dulu
            calculatorPanels.forEach(panel => {
                panel.style.display = 'none';
            });

            // Tampilkan panel kalkulator yang dipilih
            calculatorPanelContainer.style.display = 'block';
            calculatorPanel.style.display = 'block';
        });
    });

    // Fungsi untuk tombol kembali (FIXED)
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Sembunyikan SEMUA panel kalkulator
            calculatorPanels.forEach(panel => {
                panel.style.display = 'none';
            });

            // Sembunyikan container panel kalkulator
            calculatorPanelContainer.style.display = 'none';

            // Tampilkan kembali tabs
            tabsContainer.style.display = 'flex';

            // Cari tab yang aktif dan tampilkan
            const activeTabButton = document.querySelector('.tab-btn.active');
            if (activeTabButton) {
                const activeTabId = activeTabButton.dataset.tab;
                const activeTabContent = document.getElementById(activeTabId);
                if (activeTabContent) {
                    activeTabContent.style.display = 'block';
                }
            } else {
                // Fallback ke tab pertama
                tabButtons[0].classList.add('active');
                document.getElementById('datar').classList.add('active');
                document.getElementById('datar').style.display = 'block';
            }
        });
    });

    // Fungsi untuk tombol hitung
    calcButtons.forEach(button => {
        button.addEventListener('click', function () {
            const shape = this.dataset.shape;
            switch (shape) {
                case 'persegi': calculatePersegi(); break;
                case 'persegi-panjang': calculatePersegiPanjang(); break;
                case 'segitiga': calculateSegitiga(); break;
                case 'lingkaran': calculateLingkaran(); break;
                case 'jajar-genjang': calculateJajarGenjang(); break;
                case 'kubus': calculateKubus(); break;
                case 'balok': calculateBalok(); break;
                case 'prisma-segitiga': calculatePrisma(); break;
                case 'limas': calculateLimas(); break;
                case 'tabung': calculateTabung(); break;
            }
        });
    });

    // Fungsi untuk Tombol Reset
    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const shape = this.dataset.shape;
            const panel = document.getElementById(`${shape}-calculator`);
            // Reset semua input di dalam panel
            panel.querySelectorAll('input').forEach(input => input.value = '');
            // Sembunyikan bagian hasil
            const resultSection = panel.querySelector('.result-section');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
        });
    });

    // Fungsi helper untuk membersihkan desimal
    function formatNumber(num) {
        return parseFloat(num.toFixed(10)); // Menghindari error presisi JS
    }

    // --- Bagian Logika Kalkulator ---

    function calculatePersegi() {
        const sisi = parseFloat(document.getElementById('persegi-sisi').value);
        if (isNaN(sisi) || sisi <= 0) { alert("Masukkan nilai sisi yang valid."); return; }
        document.getElementById('persegi-summary').innerHTML = `Sisi = ${formatNumber(sisi)} cm`;
        document.getElementById('persegi-luas').innerHTML = `Luas = ${formatNumber(sisi * sisi)} cm<sup>2</sup>`;
        document.getElementById('persegi-keliling').innerHTML = `Keliling = ${formatNumber(4 * sisi)} cm`;
        document.getElementById('persegi-result').style.display = 'block';
    }

    function calculatePersegiPanjang() {
        const panjang = parseFloat(document.getElementById('pp-panjang').value);
        const lebar = parseFloat(document.getElementById('pp-lebar').value);
        if (isNaN(panjang) || isNaN(lebar) || panjang <= 0 || lebar <= 0) { alert("Masukkan nilai panjang dan lebar yang valid."); return; }
        document.getElementById('pp-summary').innerHTML = `Panjang = ${formatNumber(panjang)} cm, Lebar = ${formatNumber(lebar)} cm`;
        document.getElementById('pp-luas').innerHTML = `Luas = ${formatNumber(panjang * lebar)} cm<sup>2</sup>`;
        document.getElementById('pp-keliling').innerHTML = `Keliling = ${formatNumber(2 * (panjang + lebar))} cm`;
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
            luasP.innerHTML = `Luas = ${formatNumber(0.5 * alas * tinggi)} cm<sup>2</sup>`;
            calculated = true;
        }
        if (!isNaN(s1) && s1 > 0 && !isNaN(s2) && s2 > 0 && !isNaN(s3) && s3 > 0) {
            kelilingP.innerHTML = `Keliling = ${formatNumber(s1 + s2 + s3)} cm`;
            calculated = true;
        }
        if (!calculated) { alert('Masukkan nilai yang valid untuk menghitung luas atau keliling.'); return; }
        document.getElementById('segitiga-result').style.display = 'block';
    }

    function calculateLingkaran() {
        const jari = parseFloat(document.getElementById('lingkaran-jari').value);
        if (isNaN(jari) || jari <= 0) { alert("Masukkan nilai jari-jari yang valid."); return; }
        document.getElementById('lingkaran-summary').innerHTML = `Jari-jari = ${formatNumber(jari)} cm`;
        document.getElementById('lingkaran-luas').innerHTML = `Luas = ${formatNumber(Math.PI * jari * jari)} cm<sup>2</sup>`;
        document.getElementById('lingkaran-keliling').innerHTML = `Keliling = ${formatNumber(2 * Math.PI * jari)} cm`;
        document.getElementById('lingkaran-result').style.display = 'block';
    }

    function calculateKubus() {
        const sisi = parseFloat(document.getElementById('kubus-sisi').value);
        if (isNaN(sisi) || sisi <= 0) { alert("Masukkan nilai sisi yang valid."); return; }
        document.getElementById('kubus-summary').innerHTML = `Sisi = ${formatNumber(sisi)} cm`;
        document.getElementById('kubus-volume').innerHTML = `Volume = ${formatNumber(Math.pow(sisi, 3))} cm<sup>3</sup>`;
        document.getElementById('kubus-result').style.display = 'block';
    }

    function calculateBalok() {
        const p = parseFloat(document.getElementById('balok-panjang').value);
        const l = parseFloat(document.getElementById('balok-lebar').value);
        const t = parseFloat(document.getElementById('balok-tinggi').value);
        if (isNaN(p) || isNaN(l) || isNaN(t) || p <= 0 || l <= 0 || t <= 0) { alert("Masukkan nilai panjang, lebar, dan tinggi yang valid."); return; }
        document.getElementById('balok-summary').innerHTML = `p = ${formatNumber(p)} cm, l = ${formatNumber(l)} cm, t = ${formatNumber(t)} cm`;
        document.getElementById('balok-volume').innerHTML = `Volume = ${formatNumber(p * l * t)} cm<sup>3</sup>`;
        document.getElementById('balok-result').style.display = 'block';
    }

    function calculatePrisma() {
        const a = parseFloat(document.getElementById('prisma-alas').value);
        const ta = parseFloat(document.getElementById('prisma-tinggi-alas').value);
        const T = parseFloat(document.getElementById('prisma-tinggi').value);
        if (isNaN(a) || isNaN(ta) || isNaN(T) || a <= 0 || ta <= 0 || T <= 0) { alert("Masukkan semua nilai yang valid."); return; }
        document.getElementById('prisma-summary').innerHTML = `Alas Segitiga = ${formatNumber(a)} cm, Tinggi Alas = ${formatNumber(ta)} cm, Tinggi Prisma = ${formatNumber(T)} cm`;
        document.getElementById('prisma-volume').innerHTML = `Volume = ${formatNumber(0.5 * a * ta * T)} cm<sup>3</sup>`;
        document.getElementById('prisma-segitiga-result').style.display = 'block';
    }

    function calculateTabung() {
        const jari = parseFloat(document.getElementById('tabung-jari').value);
        const tinggi = parseFloat(document.getElementById('tabung-tinggi').value);
        if (isNaN(jari) || isNaN(tinggi) || jari <= 0 || tinggi <= 0) { alert("Masukkan nilai jari-jari dan tinggi yang valid."); return; }
        document.getElementById('tabung-summary').innerHTML = `Jari-jari = ${formatNumber(jari)} cm, Tinggi = ${formatNumber(tinggi)} cm`;
        document.getElementById('tabung-volume').innerHTML = `Volume = ${formatNumber(Math.PI * jari * jari * tinggi)} cm<sup>3</sup>`;
        document.getElementById('tabung-result').style.display = 'block';
    }

    // --- Footer Year ---
    document.getElementById('year').textContent = new Date().getFullYear();
});