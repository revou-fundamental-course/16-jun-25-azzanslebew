/**
 * @file script.js
 * @description Ini adalah pusat kendali untuk semua keajaiban di Kalkulator Geometri.
 * Mulai dari menampilkan panel yang tepat hingga menghitung rumus dan memunculkan notifikasi keren.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================================
    // BAGIAN 1: PERSIAPAN PANGGUNG & SELEKSI AKTOR
    // Di sini kita kumpulkan semua elemen penting dari halaman HTML.
    // ===================================================================================

    const ui = {
        preloader: document.getElementById('preloader'),
        yearSpan: document.getElementById('year'),
        shapeSelectionView: document.getElementById('shape-selection'),
        calculatorPanelContainer: document.getElementById('calculator-panel-container'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        shapeCards: document.querySelectorAll('.shape-card'),
        calculatorPanels: document.querySelectorAll('.calculator-panel'),
        backButtons: document.querySelectorAll('.back-btn'),
        calculateButtons: document.querySelectorAll('.calc-btn'),
        resetButtons: document.querySelectorAll('.reset-btn'),
        triangleChoiceButtons: document.querySelectorAll('.choice-btn[data-shape="segitiga"]'),
        triangleLuasInputs: document.getElementById('segitiga-luas-inputs'),
        triangleKelilingInputs: document.getElementById('segitiga-keliling-inputs'),
        toastContainer: document.getElementById('toast-container'),
    };

    // Mari kita mulai pertunjukannya!
    initializePage();
    setupEventListeners();

    // ===================================================================================
    // BAGIAN 2: MENGHUBUNGKAN AKSI PENGGUNA DENGAN FUNGSI
    // ===================================================================================

    function setupEventListeners() {
        ui.tabButtons.forEach(button => button.addEventListener('click', handleTabSwitch));
        ui.shapeCards.forEach(card => card.addEventListener('click', handleShapeSelection));
        ui.backButtons.forEach(button => button.addEventListener('click', showShapeSelectionView));
        ui.calculateButtons.forEach(button => button.addEventListener('click', handleCalculation));
        ui.resetButtons.forEach(button => button.addEventListener('click', handleReset));
        ui.triangleChoiceButtons.forEach(button => button.addEventListener('click', handleTriangleChoice));

        ui.calculatorPanels.forEach(panel => {
            const inputs = panel.querySelectorAll('input[type="number"]');
            inputs.forEach(input => input.addEventListener('input', () => validateInputs(panel)));
        });
    }

    // ===================================================================================
    // BAGIAN 3: SUTRADARA & PENANGANAN SKENARIO
    // ===================================================================================

    function initializePage() {
        AOS.init({ duration: 800, once: true });
        window.addEventListener('load', () => ui.preloader.classList.add('hidden'));
        ui.yearSpan.textContent = new Date().getFullYear();
    }

    function handleTabSwitch() {
        const tabTarget = this.dataset.tab;
        ui.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        ui.tabContents.forEach(content => content.classList.toggle('active', content.id === tabTarget));
    }

    function handleShapeSelection() {
        const shape = this.dataset.shape;
        const targetPanel = document.getElementById(`${shape}-calculator`);
        if (targetPanel) {
            ui.shapeSelectionView.style.display = 'none';
            ui.calculatorPanelContainer.style.display = 'block';
            ui.calculatorPanels.forEach(panel => panel.style.display = 'none');
            targetPanel.style.display = 'block';
            validateInputs(targetPanel);
        }
    }

    /**
     * Kembali ke menu utama dan membersihkan semua form.
     * Ini adalah perbaikan untuk bug #1.
     */
    function showShapeSelectionView() {
        ui.calculatorPanelContainer.style.display = 'none';
        ui.shapeSelectionView.style.display = 'block';

        // Trik jitu: "klik" semua tombol reset secara virtual.
        // Ini memastikan semua form bersih saat pengguna kembali ke menu.
        ui.resetButtons.forEach(button => button.click());
    }

    function handleTriangleChoice() {
        const choice = this.dataset.choice;
        const panel = this.closest('.calculator-panel');
        ui.triangleChoiceButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        ui.triangleLuasInputs.style.display = choice === 'luas' ? 'block' : 'none';
        ui.triangleKelilingInputs.style.display = choice === 'keliling' ? 'block' : 'none';
        validateInputs(panel);
    }

    function handleCalculation() {
        const shape = this.dataset.shape;
        const calculationMap = {
            'persegi': calculatePersegi,
            'persegi-panjang': calculatePersegiPanjang,
            'lingkaran': calculateLingkaran,
            'segitiga': calculateSegitiga,
            'kubus': calculateKubus,
            'balok': calculateBalok,
            'prisma-segitiga': calculatePrisma,
            'tabung': calculateTabung,
        };
        if (calculationMap[shape]) {
            calculationMap[shape]();
        }
    }

    function handleReset() {
        const panel = this.closest('.calculator-panel');
        if (panel) {
            panel.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
            const resultSection = panel.querySelector('.result-section');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
            validateInputs(panel);
        }
    }

    // ===================================================================================
    // BAGIAN 4: SISTEM NOTIFIKASI TOAST
    // ===================================================================================

    function showToast({ type = 'info', message, duration = 3000 }) {
        const toastInfo = {
            success: { icon: `<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`, className: 'success' },
            error: { icon: `<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`, className: 'error' },
            info: { icon: `<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>`, className: 'info' }
        };
        const info = toastInfo[type];
        const toast = document.createElement('div');
        toast.className = `toast ${info.className}`;
        toast.innerHTML = `<div class="toast-icon">${info.icon}</div> <div class="toast-message">${message}</div>`;
        ui.toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }

    // ===================================================================================
    // BAGIAN 5: LOGIKA INTI & PEMBANTU
    // ===================================================================================

    function getInputValue(id) { return parseFloat(document.getElementById(id).value); }
    function formatNumber(num) { return String(parseFloat(num.toFixed(2))); }

    function showResult(shape, content) {
        const resultPanel = document.getElementById(`${shape}-result`);
        resultPanel.querySelectorAll('p').forEach(p => p.innerHTML = '');
        for (const key in content) {
            const element = document.getElementById(`${shape}-${key}`);
            if (element) {
                element.innerHTML = content[key];
            }
        }
        resultPanel.style.display = 'block';
    }

    function validateInputs(panel) {
        const calcButton = panel.querySelector('.calc-btn');
        let isReady = false;
        if (panel.id === 'segitiga-calculator') {
            const activeChoice = panel.querySelector('.choice-btn.active').dataset.choice;
            const inputs = activeChoice === 'luas' ?
                Array.from(ui.triangleLuasInputs.querySelectorAll('input')) :
                Array.from(ui.triangleKelilingInputs.querySelectorAll('input'));
            isReady = inputs.every(input => input.value.trim() !== '');
        } else {
            const inputs = Array.from(panel.querySelectorAll('input[type="number"]'));
            isReady = inputs.every(input => input.value.trim() !== '');
        }
        calcButton.disabled = !isReady;
    }

    // --- Mesin Perhitungan untuk Setiap Bentuk ---

    function calculatePersegi() {
        const resultPanel = document.getElementById('persegi-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const sisi = getInputValue('persegi-sisi');
        if (isNaN(sisi) || sisi <= 0) return showToast({ type: 'error', message: 'Nilai sisi harus angka positif lebih dari 0.' });

        showResult('persegi', {
            summary: `Dengan sisi <code>${formatNumber(sisi)}</code> cm:`,
            luas: `Luas (L) = <code>${formatNumber(sisi * sisi)} cm²</code>`,
            keliling: `Keliling (K) = <code>${formatNumber(4 * sisi)} cm</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan persegi berhasil!' });
    }

    function calculatePersegiPanjang() {
        const resultPanel = document.getElementById('persegi-panjang-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const panjang = getInputValue('persegi-panjang-panjang');
        const lebar = getInputValue('persegi-panjang-lebar');
        if (isNaN(panjang) || isNaN(lebar) || panjang <= 0 || lebar <= 0) return showToast({ type: 'error', message: 'Panjang dan lebar harus lebih dari 0.' });

        showResult('persegi-panjang', {
            summary: `Dengan panjang <code>${formatNumber(panjang)}</code> cm & lebar <code>${formatNumber(lebar)}</code> cm:`,
            luas: `Luas (L) = <code>${formatNumber(panjang * lebar)} cm²</code>`,
            keliling: `Keliling (K) = <code>${formatNumber(2 * (panjang + lebar))} cm</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan persegi panjang berhasil!' });
    }

    function calculateLingkaran() {
        const resultPanel = document.getElementById('lingkaran-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const jariJari = getInputValue('lingkaran-jari-jari');
        if (isNaN(jariJari) || jariJari <= 0) return showToast({ type: 'error', message: 'Nilai jari-jari harus lebih dari 0.' });

        showResult('lingkaran', {
            summary: `Dengan jari-jari <code>${formatNumber(jariJari)}</code> cm:`,
            luas: `Luas (L) ≈ <code>${formatNumber(Math.PI * jariJari ** 2)} cm²</code>`,
            keliling: `Keliling (K) ≈ <code>${formatNumber(2 * Math.PI * jariJari)} cm</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan lingkaran berhasil!' });
    }

    function calculateSegitiga() {
        const resultPanel = document.getElementById('segitiga-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const activeChoice = document.querySelector('.choice-btn[data-shape="segitiga"].active').dataset.choice;

        if (activeChoice === 'luas') {
            const alas = getInputValue('segitiga-alas');
            const tinggi = getInputValue('segitiga-tinggi');
            if (isNaN(alas) || isNaN(tinggi) || alas <= 0 || tinggi <= 0) return showToast({ type: 'error', message: 'Alas dan Tinggi harus lebih dari 0.' });

            showResult('segitiga', {
                luas: `Luas (L) = <code>${formatNumber(0.5 * alas * tinggi)} cm²</code>`
            });
        } else {
            const sisi1 = getInputValue('segitiga-sisi1');
            const sisi2 = getInputValue('segitiga-sisi2');
            const sisi3 = getInputValue('segitiga-sisi3');
            if (isNaN(sisi1) || isNaN(sisi2) || isNaN(sisi3) || sisi1 <= 0 || sisi2 <= 0 || sisi3 <= 0) return showToast({ type: 'error', message: 'Semua sisi harus lebih dari 0.' });

            showResult('segitiga', {
                keliling: `Keliling (K) = <code>${formatNumber(sisi1 + sisi2 + sisi3)} cm</code>`
            });
        }
        showToast({ type: 'success', message: 'Perhitungan segitiga berhasil!' });
    }

    function calculateKubus() {
        const resultPanel = document.getElementById('kubus-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const sisi = getInputValue('kubus-sisi');
        if (isNaN(sisi) || sisi <= 0) return showToast({ type: 'error', message: 'Nilai sisi harus lebih dari 0.' });

        showResult('kubus', {
            summary: `Dengan sisi <code>${formatNumber(sisi)}</code> cm:`,
            volume: `Volume (V) = <code>${formatNumber(sisi ** 3)} cm³</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan kubus berhasil!' });
    }

    function calculateBalok() {
        const resultPanel = document.getElementById('balok-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const panjang = getInputValue('balok-panjang');
        const lebar = getInputValue('balok-lebar');
        const tinggi = getInputValue('balok-tinggi');
        if (isNaN(panjang) || isNaN(lebar) || isNaN(tinggi) || panjang <= 0 || lebar <= 0 || tinggi <= 0) return showToast({ type: 'error', message: 'Semua nilai harus lebih dari 0.' });

        showResult('balok', {
            summary: `Dengan panjang <code>${formatNumber(panjang)}</code> cm, lebar <code>${formatNumber(lebar)}</code> cm, & tinggi <code>${formatNumber(tinggi)}</code> cm:`,
            volume: `Volume (V) = <code>${formatNumber(panjang * lebar * tinggi)} cm³</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan balok berhasil!' });
    }

    function calculatePrisma() {
        const resultPanel = document.getElementById('prisma-segitiga-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const alasSegitiga = getInputValue('prisma-alas');
        const tinggiAlas = getInputValue('prisma-tinggi-alas');
        const tinggiPrisma = getInputValue('prisma-tinggi');
        if (isNaN(alasSegitiga) || isNaN(tinggiAlas) || isNaN(tinggiPrisma) || alasSegitiga <= 0 || tinggiAlas <= 0 || tinggiPrisma <= 0) return showToast({ type: 'error', message: 'Semua nilai prisma harus lebih dari 0.' });

        showResult('prisma-segitiga', {
            summary: `Dengan alas <code>${formatNumber(alasSegitiga)}</code> cm, tinggi alas <code>${formatNumber(tinggiAlas)}</code> cm, & tinggi prisma <code>${formatNumber(tinggiPrisma)}</code> cm:`,
            volume: `Volume (V) = <code>${formatNumber(0.5 * alasSegitiga * tinggiAlas * tinggiPrisma)} cm³</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan prisma berhasil!' });
    }

    function calculateTabung() {
        const resultPanel = document.getElementById('tabung-result');
        if (resultPanel) resultPanel.style.display = 'none';

        const jariJari = getInputValue('tabung-jari-jari');
        const tinggi = getInputValue('tabung-tinggi');
        if (isNaN(jariJari) || isNaN(tinggi) || jariJari <= 0 || tinggi <= 0) return showToast({ type: 'error', message: 'Jari-jari dan tinggi harus lebih dari 0.' });

        showResult('tabung', {
            summary: `Dengan jari-jari <code>${formatNumber(jariJari)}</code> cm & tinggi <code>${formatNumber(tinggi)}</code> cm:`,
            volume: `Volume (V) ≈ <code>${formatNumber(Math.PI * jariJari ** 2 * tinggi)} cm³</code>`
        });
        showToast({ type: 'success', message: 'Perhitungan tabung berhasil!' });
    }

});