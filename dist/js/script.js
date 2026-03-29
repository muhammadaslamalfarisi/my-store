// ============================================================
//  MING MART POS — Core Script
// ============================================================

const DB_PRODUK   = 'pos_produk';
const DB_ADMIN    = 'user_admin';
const DB_RIWAYAT  = 'pos_riwayat';

// --- Init default data ---
function initData() {
  if (!localStorage.getItem(DB_PRODUK)) {
    const defaultProduk = [
      { id: 'P001', nama: 'Kopi Susu',      harga: 15000, stok: 50 },
      { id: 'P002', nama: 'Roti Bakar',     harga: 12000, stok: 30 },
      { id: 'P003', nama: 'Teh Manis',      harga: 8000,  stok: 100 },
      { id: 'P004', nama: 'Mie Goreng',     harga: 20000, stok: 25 },
      { id: 'P005', nama: 'Jus Alpukat',    harga: 18000, stok: 15 },
    ];
    localStorage.setItem(DB_PRODUK, JSON.stringify(defaultProduk));
  }
  if (!localStorage.getItem(DB_ADMIN)) {
    localStorage.setItem(DB_ADMIN, JSON.stringify({ username: 'admin', password: 'admin123' }));
  }
}
initData();

// --- Auth ---
function cekLogin() {
  if (!window.location.href.includes('login.html') && sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}
cekLogin();

function logout() {
  showConfirm('Keluar dari sistem?', 'Anda akan diarahkan ke halaman login.', () => {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  });
}

// --- Toast Notification ---
function showToast(msg, type = 'success') {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// --- Custom Confirm Dialog ---
function showConfirm(title, msg, onConfirm) {
  let overlay = document.getElementById('confirmOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirmOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:380px">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>
          <div id="confirmTitle" style="font-size:1.1rem;font-weight:700;color:var(--text-heading);margin-bottom:8px"></div>
          <div id="confirmMsg" style="font-size:0.875rem;color:var(--text-secondary)"></div>
        </div>
        <div class="modal-footer">
          <button id="confirmCancel" class="btn btn-ghost btn-full">Batal</button>
          <button id="confirmOk" class="btn btn-danger btn-full">Ya, Lanjutkan</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('confirmCancel').onclick = () => { overlay.classList.remove('active'); };
    overlay.addEventListener('click', (e) => { if(e.target===overlay) overlay.classList.remove('active'); });
  }
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmOk').onclick = () => { overlay.classList.remove('active'); onConfirm(); };
  overlay.classList.add('active');
}

// --- Navbar Loader ---
function muatNavbar(pageId) {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  fetch('navbar.html')
    .then(r => r.text())
    .then(html => {
      placeholder.innerHTML = html;

      // Set active page
      const active = document.getElementById(pageId);
      if (active) active.classList.add('active');

      // Set admin name
      const acc = JSON.parse(localStorage.getItem(DB_ADMIN));
      const nameEl = document.getElementById('displayAdminName');
      if (nameEl && acc) nameEl.textContent = acc.username;

      // Avatar initial
      const avatarEl = document.getElementById('navUserAvatar');
      if (avatarEl && acc) avatarEl.textContent = acc.username[0].toUpperCase();
    })
    .catch(err => console.warn('Navbar load failed:', err));
}

// --- Hamburger Menu ---
function toggleMenu() {
  const navLinks   = document.getElementById('navLinks');
  const menuToggle = document.querySelector('.menu-toggle');
  if (navLinks)   navLinks.classList.toggle('open');
  if (menuToggle) menuToggle.classList.toggle('open');
}

// --- Kelola Akun Admin ---
function bukaModalAkun() {
  const acc   = JSON.parse(localStorage.getItem(DB_ADMIN));
  const modal = document.getElementById('modalAkun');
  if (!modal) return;

  document.getElementById('updateUsername').value = acc ? acc.username : '';
  document.getElementById('updatePassword').value = '';
  modal.classList.add('active');
}

function tutupModalAkun() {
  const modal = document.getElementById('modalAkun');
  if (modal) modal.classList.remove('active');
}

function simpanPerubahanAkun() {
  const userBaru = document.getElementById('updateUsername').value.trim();
  const passBaru = document.getElementById('updatePassword').value.trim();

  if (!userBaru) { showToast('Username tidak boleh kosong!', 'error'); return; }
  if (!passBaru) { showToast('Password tidak boleh kosong!', 'error'); return; }
  if (passBaru.length < 5) { showToast('Password minimal 5 karakter!', 'warning'); return; }

  localStorage.setItem(DB_ADMIN, JSON.stringify({ username: userBaru, password: passBaru }));
  tutupModalAkun();
  showToast('Akun berhasil diperbarui! Silakan login ulang.', 'success');
  setTimeout(() => {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  }, 1800);
}

// ============================================================
//  HALAMAN PRODUK (CRUD)
// ============================================================
let editIdSekarang = null;

function getDaftarProduk() {
  return JSON.parse(localStorage.getItem(DB_PRODUK)) || [];
}

function simpanDaftarProduk(produk) {
  localStorage.setItem(DB_PRODUK, JSON.stringify(produk));
}

function renderTabelStok(keyword = '') {
  const tbody = document.getElementById('bodyStok');
  if (!tbody) return;

  let produk = getDaftarProduk();
  if (keyword) {
    produk = produk.filter(p => p.nama.toLowerCase().includes(keyword.toLowerCase()));
  }

  if (produk.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:40px;color:var(--text-muted);">
      ${keyword ? '🔍 Tidak ada produk yang cocok' : '📦 Belum ada produk'}
    </td></tr>`;
    return;
  }

  tbody.innerHTML = produk.map(p => `
    <tr>
      <td><span class="badge badge-primary font-mono" style="font-size:0.7rem">${p.id}</span></td>
      <td><span style="font-weight:600;color:var(--text-heading)">${p.nama}</span></td>
      <td><span class="font-mono" style="color:var(--accent)">Rp ${p.harga.toLocaleString('id-ID')}</span></td>
      <td class="text-center">
        <span class="badge ${p.stok <= 5 ? 'badge-danger' : p.stok <= 15 ? 'badge-warning' : 'badge-success'}">
          ${p.stok} unit
        </span>
      </td>
      <td class="text-center">
        <div style="display:inline-flex;gap:8px">
          <button class="btn-icon-edit" onclick="bukaModalEdit('${p.id}')">✎ Edit</button>
          <button class="btn-icon-delete" onclick="hapusProdukConfirm('${p.id}', '${p.nama.replace(/'/g,"\\'")}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function tambahProdukBaru() {
  const nama  = document.getElementById('newNama').value.trim();
  const harga = parseInt(document.getElementById('newHarga').value);
  const stok  = parseInt(document.getElementById('newStok').value) || 0;

  if (!nama)       { showToast('Nama produk wajib diisi!', 'error'); return; }
  if (!harga || harga <= 0) { showToast('Harga harus lebih dari 0!', 'error'); return; }
  if (stok < 0)   { showToast('Stok tidak boleh negatif!', 'error'); return; }

  const produk = getDaftarProduk();
  const idBaru = 'P' + Math.floor(100 + Math.random() * 900);
  produk.push({ id: idBaru, nama, harga, stok });
  simpanDaftarProduk(produk);

  document.getElementById('newNama').value  = '';
  document.getElementById('newHarga').value = '';
  document.getElementById('newStok').value  = '0';

  renderTabelStok();
  showToast(`Produk "${nama}" berhasil ditambahkan!`, 'success');
}

function bukaModalEdit(id) {
  const produk = getDaftarProduk();
  const p = produk.find(item => item.id === id);
  if (!p) return;

  editIdSekarang = id;
  document.getElementById('editNama').value  = p.nama;
  document.getElementById('editHarga').value = p.harga;
  document.getElementById('editStok').value  = p.stok;

  const modal = document.getElementById('modalEdit');
  if (modal) modal.classList.add('active');
}

function tutupModalEdit() {
  const modal = document.getElementById('modalEdit');
  if (modal) modal.classList.remove('active');
  editIdSekarang = null;
}

function simpanPerubahan() {
  const nama  = document.getElementById('editNama').value.trim();
  const harga = parseInt(document.getElementById('editHarga').value);
  const stok  = parseInt(document.getElementById('editStok').value);

  if (!nama)        { showToast('Nama produk wajib diisi!', 'error'); return; }
  if (!harga || harga <= 0) { showToast('Harga harus lebih dari 0!', 'error'); return; }
  if (stok < 0)     { showToast('Stok tidak boleh negatif!', 'error'); return; }

  const produk = getDaftarProduk();
  const idx = produk.findIndex(p => p.id === editIdSekarang);
  if (idx !== -1) {
    produk[idx] = { ...produk[idx], nama, harga, stok };
    simpanDaftarProduk(produk);
    tutupModalEdit();
    renderTabelStok();
    showToast('Produk berhasil diperbarui!', 'success');
  }
}

function hapusProdukConfirm(id, nama) {
  showConfirm('Hapus Produk?', `"${nama}" akan dihapus secara permanen.`, () => {
    let produk = getDaftarProduk();
    produk = produk.filter(p => p.id !== id);
    simpanDaftarProduk(produk);
    renderTabelStok();
    showToast(`Produk "${nama}" dihapus.`, 'info');
  });
}

// ============================================================
//  HALAMAN KASIR
// ============================================================
let keranjang = [];

function renderProdukKasir() {
  const select = document.getElementById('pilihProduk');
  if (!select) return;

  const produk = getDaftarProduk();
  select.innerHTML = '<option value="">-- Pilih Produk --</option>';
  produk.filter(p => p.stok > 0).forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nama} — Rp ${p.harga.toLocaleString('id-ID')} (Stok: ${p.stok})</option>`;
  });
}

function updateHargaOtomatis() {
  const id  = document.getElementById('pilihProduk').value;
  const el  = document.getElementById('hargaProduk');
  const produk = getDaftarProduk();
  const p   = produk.find(item => item.id === id);
  if (el) el.value = p ? p.harga : '';
}

function tambahKeKeranjang() {
  const id  = document.getElementById('pilihProduk').value;
  const qty = parseInt(document.getElementById('jumlahProduk').value);
  const produk = getDaftarProduk();
  const p   = produk.find(item => item.id === id);

  if (!p)   { showToast('Pilih produk terlebih dahulu!', 'warning'); return; }
  if (!qty || qty <= 0) { showToast('Jumlah harus lebih dari 0!', 'warning'); return; }
  if (qty > p.stok) { showToast(`Stok tidak cukup! Tersedia: ${p.stok}`, 'error'); return; }

  const existing = keranjang.find(item => item.id === id);
  if (existing) {
    if ((existing.qty + qty) > p.stok) { showToast(`Stok tidak cukup! Tersedia: ${p.stok}`, 'error'); return; }
    existing.qty += qty;
    existing.subtotal = existing.harga * existing.qty;
  } else {
    keranjang.push({ id: p.id, nama: p.nama, harga: p.harga, qty, subtotal: p.harga * qty });
  }

  renderKeranjang();
  document.getElementById('jumlahProduk').value = '1';
  showToast(`${p.nama} x${qty} ditambahkan`, 'success');
}

function renderKeranjang() {
  const tbody      = document.getElementById('tabelKeranjang');
  const totalDisplay = document.getElementById('totalHarga');
  const cartCountEl  = document.getElementById('cartCount');
  if (!tbody) return;

  if (keranjang.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p style="color:var(--text-muted);font-size:0.875rem">Keranjang masih kosong</p>
      </div>
    </td></tr>`;
    if (totalDisplay) totalDisplay.textContent = 'Rp 0';
    if (cartCountEl) cartCountEl.textContent = '0';
    return;
  }

  let total = 0;
  tbody.innerHTML = keranjang.map((item, idx) => {
    total += item.subtotal;
    return `<tr>
      <td><span style="font-weight:600">${item.nama}</span></td>
      <td class="text-center">
        <div style="display:inline-flex;align-items:center;gap:6px">
          <button onclick="ubahQtyKeranjang(${idx},-1)" style="width:24px;height:24px;border-radius:6px;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-secondary);cursor:pointer;font-size:14px;display:inline-flex;align-items:center;justify-content:center">−</button>
          <span class="font-mono" style="min-width:24px;text-align:center;font-weight:600">${item.qty}</span>
          <button onclick="ubahQtyKeranjang(${idx},1)" style="width:24px;height:24px;border-radius:6px;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-secondary);cursor:pointer;font-size:14px;display:inline-flex;align-items:center;justify-content:center">+</button>
        </div>
      </td>
      <td class="font-mono" style="color:var(--accent)">Rp ${item.subtotal.toLocaleString('id-ID')}</td>
      <td class="text-center">
        <button onclick="hapusKeranjang(${idx})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:4px 8px;border-radius:6px;transition:0.2s" onmouseover="this.style.background='var(--danger-bg)'" onmouseout="this.style.background='none'">✕</button>
      </td>
    </tr>`;
  }).join('');

  if (totalDisplay) totalDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  if (cartCountEl) cartCountEl.textContent = keranjang.reduce((s, i) => s + i.qty, 0);
}

function ubahQtyKeranjang(idx, delta) {
  const item = keranjang[idx];
  const produk = getDaftarProduk();
  const p = produk.find(pp => pp.id === item.id);
  const newQty = item.qty + delta;

  if (newQty <= 0) { hapusKeranjang(idx); return; }
  if (p && newQty > p.stok) { showToast(`Stok maksimum: ${p.stok}`, 'warning'); return; }

  keranjang[idx].qty      = newQty;
  keranjang[idx].subtotal = item.harga * newQty;
  renderKeranjang();
}

function hapusKeranjang(idx) {
  keranjang.splice(idx, 1);
  renderKeranjang();
}

function bersihkanKeranjang() {
  if (keranjang.length === 0) return;
  showConfirm('Bersihkan Keranjang?', 'Semua item akan dihapus dari keranjang.', () => {
    keranjang = [];
    renderKeranjang();
    showToast('Keranjang dikosongkan', 'info');
  });
}

async function prosesBayar() {
  if (keranjang.length === 0) { showToast('Keranjang masih kosong!', 'warning'); return; }

  const total = keranjang.reduce((s, i) => s + i.subtotal, 0);
  showConfirm('Konfirmasi Pembayaran', `Total: Rp ${total.toLocaleString('id-ID')} — Proses pembayaran?`, async () => {
    // Potong stok
    const produk = getDaftarProduk();
    keranjang.forEach(item => {
      const p = produk.find(pp => pp.id === item.id);
      if (p) p.stok -= item.qty;
    });
    simpanDaftarProduk(produk);

    // Simpan riwayat
    const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
    riwayat.unshift({
      id: 'TRX-' + Date.now(),
      waktu: new Date().toLocaleString('id-ID'),
      items: [...keranjang],
      total
    });
    localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));

    // Cetak struk
    if (window.jspdf) await cetakStrukPDF(total);

    showToast('Pembayaran berhasil! Stok telah diperbarui.', 'success');
    keranjang = [];
    renderKeranjang();
    renderProdukKasir();
  });
}

async function cetakStrukPDF(total) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: [80, 160] });
    const acc = JSON.parse(localStorage.getItem(DB_ADMIN));

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MING MART', 40, 12, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. Contoh No.1, Kota Anda', 40, 18, { align: 'center' });
    doc.line(5, 22, 75, 22);

    doc.setFontSize(8);
    doc.text(`Waktu   : ${new Date().toLocaleString('id-ID')}`, 5, 28);
    doc.text(`Kasir   : ${acc ? acc.username : 'Admin'}`, 5, 33);
    doc.line(5, 37, 75, 37);

    let y = 43;
    keranjang.forEach(item => {
      doc.text(`${item.nama}`, 5, y);
      doc.text(`${item.qty} x Rp ${item.harga.toLocaleString('id-ID')}`, 5, y + 4);
      doc.text(`Rp ${item.subtotal.toLocaleString('id-ID')}`, 75, y + 4, { align: 'right' });
      y += 10;
    });

    doc.line(5, y, 75, y); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 5, y);
    doc.text(`Rp ${total.toLocaleString('id-ID')}`, 75, y, { align: 'right' });

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Terima kasih telah berbelanja!', 40, y, { align: 'center' });
    doc.text('*Simpan struk ini sebagai bukti pembelian*', 40, y + 4, { align: 'center' });

    doc.save(`Struk-${Date.now()}.pdf`);
  } catch(e) {
    console.warn('PDF generation failed:', e);
  }
}

function eksporExcel() {
  const table = document.querySelector('table');
  if (!table || typeof XLSX === 'undefined') { showToast('Tidak bisa ekspor saat ini', 'error'); return; }
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, 'DaftarBelanja_' + Date.now() + '.xlsx');
  showToast('Daftar belanja diekspor ke Excel!', 'success');
}

// ============================================================
//  HALAMAN LAPORAN
// ============================================================
function renderDashboard() {
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const tbody   = document.getElementById('bodyRiwayat');
  let totalOmzet = 0, totalTerjual = 0;
  const dataProduk = {};

  if (!tbody) return;

  if (riwayat.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">
      <div class="empty-state">
        <span class="empty-state-icon">📊</span>
        <p class="empty-state-text">Belum ada transaksi</p>
      </div>
    </td></tr>`;
    updateStatEl('totalOmzet', 'Rp 0');
    updateStatEl('totalTerjual', '0 Item');
    updateStatEl('totalTransaksi', '0 Transaksi');
    renderGrafik({});
    return;
  }

  tbody.innerHTML = riwayat.map(t => {
    totalOmzet += t.total;
    t.items.forEach(item => {
      totalTerjual += item.qty;
      dataProduk[item.nama] = (dataProduk[item.nama] || 0) + item.qty;
    });
    return `<tr>
      <td style="font-size:0.8rem;color:var(--text-secondary)">${t.waktu}</td>
      <td><span class="font-mono badge badge-primary" style="font-size:0.7rem">${t.id}</span></td>
      <td><span class="font-mono" style="font-weight:700;color:var(--accent)">Rp ${t.total.toLocaleString('id-ID')}</span></td>
      <td class="text-center">
        <div style="display:inline-flex;gap:8px">
          <button class="btn-icon-edit" onclick="bukaEditLaporan('${t.id}', ${t.total})">✎</button>
          <button class="btn-icon-delete" onclick="hapusSatuRiwayat('${t.id}')">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updateStatEl('totalOmzet', `Rp ${totalOmzet.toLocaleString('id-ID')}`);
  updateStatEl('totalTerjual', `${totalTerjual} Item`);
  updateStatEl('totalTransaksi', `${riwayat.length} Transaksi`);
  renderGrafik(dataProduk);
}

function updateStatEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderGrafik(dataProduk) {
  const canvas = document.getElementById('chartPenjualan');
  if (!canvas || typeof Chart === 'undefined') return;

  if (window.myChart) window.myChart.destroy();

  const labels = Object.keys(dataProduk);
  const values = Object.values(dataProduk);
  const colors = labels.map((_, i) => {
    const palette = ['#6366f1','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6','#14b8a6'];
    return palette[i % palette.length];
  });

  window.myChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Unit Terjual',
        data: values,
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e2238',
          borderColor: 'rgba(99,102,241,0.3)',
          borderWidth: 1,
          titleColor: '#e2e8f8',
          bodyColor: '#8892b0',
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} unit terjual`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8892b0', font: { family: 'Plus Jakarta Sans', size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8892b0', font: { family: 'JetBrains Mono', size: 11 }, stepSize: 1 },
          beginAtZero: true
        }
      }
    }
  });
}

function bukaEditLaporan(id, nominal) {
  document.getElementById('editTransId').value    = id;
  document.getElementById('editTotalNominal').value = nominal;
  const modal = document.getElementById('modalEditLaporan');
  if (modal) modal.classList.add('active');
}

function tutupEditLaporan() {
  const modal = document.getElementById('modalEditLaporan');
  if (modal) modal.classList.remove('active');
}

function simpanEditLaporan() {
  const id    = document.getElementById('editTransId').value;
  const total = parseInt(document.getElementById('editTotalNominal').value);

  if (!total || total <= 0) { showToast('Total harus lebih dari 0!', 'error'); return; }

  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const idx = riwayat.findIndex(t => t.id === id);
  if (idx !== -1) {
    riwayat[idx].total = total;
    localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));
    tutupEditLaporan();
    renderDashboard();
    showToast('Transaksi berhasil diperbarui!', 'success');
  }
}

function hapusSatuRiwayat(id) {
  showConfirm('Hapus Transaksi?', 'Data transaksi ini akan dihapus permanen.', () => {
    let riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
    riwayat = riwayat.filter(t => t.id !== id);
    localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));
    renderDashboard();
    showToast('Transaksi dihapus.', 'info');
  });
}

function resetLaporan() {
  showConfirm('Reset Semua Data?', 'Semua riwayat transaksi akan dihapus secara permanen!', () => {
    localStorage.removeItem(DB_RIWAYAT);
    renderDashboard();
    showToast('Semua riwayat telah dihapus.', 'warning');
  });
}
