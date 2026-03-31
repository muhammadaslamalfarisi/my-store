// ============================================================
//  MING MART POS — Complete Enhanced Script v2.0
//  AdminLTE 2 + All Features
// ============================================================

const DB_PRODUK = "pos_produk";
const DB_ADMIN = "user_admin";
const DB_RIWAYAT = "pos_riwayat";
const DB_TEMA = "pos_tema";
const DB_KATEGORI = "pos_kategori";
const DB_DISKON = "pos_diskon";

// ============================================================
//  INIT DEFAULT DATA
// ============================================================
function initData() {
  if (!localStorage.getItem(DB_PRODUK)) {
    const defaultProduk = [
      {
        id: "P001",
        nama: "Kopi Susu",
        harga: 15000,
        stok: 50,
        kategori: "Minuman",
        satuan: "Cup",
      },
      {
        id: "P002",
        nama: "Roti Bakar",
        harga: 12000,
        stok: 30,
        kategori: "Makanan",
        satuan: "Pcs",
      },
      {
        id: "P003",
        nama: "Teh Manis",
        harga: 8000,
        stok: 100,
        kategori: "Minuman",
        satuan: "Cup",
      },
      {
        id: "P004",
        nama: "Mie Goreng",
        harga: 20000,
        stok: 25,
        kategori: "Makanan",
        satuan: "Porsi",
      },
      {
        id: "P005",
        nama: "Jus Alpukat",
        harga: 18000,
        stok: 15,
        kategori: "Minuman",
        satuan: "Cup",
      },
    ];
    localStorage.setItem(DB_PRODUK, JSON.stringify(defaultProduk));
  }
  if (!localStorage.getItem(DB_ADMIN)) {
    localStorage.setItem(
      DB_ADMIN,
      JSON.stringify({
        username: "admin",
        password: "admin123",
        foto: null,
        nama_lengkap: "Administrator",
      }),
    );
  }
  if (!localStorage.getItem(DB_KATEGORI)) {
    localStorage.setItem(
      DB_KATEGORI,
      JSON.stringify(["Makanan", "Minuman", "Snack", "Lainnya"]),
    );
  }
}
initData();

// ============================================================
//  TEMA (Light default, then Dark)
// ============================================================
function getTemaSaat() {
  return localStorage.getItem(DB_TEMA) || "light";
}

function terapkanTema(tema, simpan = true) {
  const html = document.documentElement;
  if (tema === "light") {
    html.setAttribute("data-tema", "light");
    html.classList.remove("dark-mode");
    html.classList.add("light-mode");
  } else {
    html.setAttribute("data-tema", "dark");
    html.classList.remove("light-mode");
    html.classList.add("dark-mode");
  }
  if (simpan) localStorage.setItem(DB_TEMA, tema);
  updateTombolTema(tema);
}

function updateTombolTema(tema) {
  const isDark = tema === "dark";
  document
    .querySelectorAll(".tema-toggle-btn, #themeToggleBtn")
    .forEach((btn) => {
      if (btn) {
        btn.innerHTML = isDark
          ? '<i class="fa fa-sun-o"></i>'
          : '<i class="fa fa-moon-o"></i>';
        btn.title = isDark ? "Beralih ke Tema Terang" : "Beralih ke Tema Gelap";
      }
    });
  document.querySelectorAll(".mobile-theme-text").forEach((el) => {
    if (el) el.textContent = isDark ? "Tema Terang" : "Tema Gelap";
  });
}

function toggleTema() {
  const tema = getTemaSaat();
  terapkanTema(tema === "light" ? "dark" : "light");
}

// Apply tema immediately
(function () {
  var t = localStorage.getItem(DB_TEMA) || "light";
  terapkanTema(t, false);
})();

// ============================================================
//  AUTH
// ============================================================
function cekLogin() {
  if (
    !window.location.href.includes("login.html") &&
    sessionStorage.getItem("isLoggedIn") !== "true"
  ) {
    window.location.href = "login.html";
  }
}
cekLogin();

function logout() {
  showConfirm(
    "Keluar dari sistem?",
    "Anda akan diarahkan ke halaman login.",
    () => {
      sessionStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    },
  );
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function showToast(msg, type = "success") {
  const icons = {
    success: "check",
    error: "times",
    info: "info",
    warning: "exclamation-triangle",
  };
  const colors = {
    success: "bg-green",
    error: "bg-red",
    info: "bg-aqua",
    warning: "bg-yellow",
  };

  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `callout callout-${type === "success" ? "success" : type === "error" ? "danger" : type === "warning" ? "warning" : "info"}`;
  toast.style.cssText =
    "min-width:280px;max-width:380px;padding:12px 16px;border-radius:4px;box-shadow:0 4px 15px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;animation:slideInRight 0.3s ease;font-size:13px;";
  toast.innerHTML = `<i class="fa fa-${icons[type]}"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ============================================================
//  CONFIRM DIALOG
// ============================================================
function showConfirm(title, msg, onConfirm) {
  let overlay = document.getElementById("confirmOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "confirmOverlay";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99998;display:none;align-items:center;justify-content:center;";
    overlay.innerHTML = `
      <div class="box box-danger" style="width:380px;margin:0;border-top:3px solid #dd4b39;">
        <div class="box-header with-border text-center">
          <i class="fa fa-warning fa-3x text-yellow" style="display:block;margin-bottom:10px;"></i>
          <h4 id="confirmTitle" class="box-title" style="font-size:16px;font-weight:700;"></h4>
        </div>
        <div class="box-body text-center">
          <p id="confirmMsg" style="color:#666;margin:0;"></p>
        </div>
        <div class="box-footer text-center" style="display:flex;gap:12px;justify-content:center;">
          <button id="confirmCancel" class="btn btn-default btn-sm"><i class="fa fa-times"></i> Batal</button>
          <button id="confirmOk" class="btn btn-danger btn-sm"><i class="fa fa-check"></i> Ya, Lanjutkan</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById("confirmCancel").onclick = () =>
      (overlay.style.display = "none");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
  }
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMsg").textContent = msg;
  document.getElementById("confirmOk").onclick = () => {
    overlay.style.display = "none";
    onConfirm();
  };
  overlay.style.display = "flex";
}

// ============================================================
//  NAVBAR LOADER
// ============================================================
function muatNavbar(pageId) {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  fetch("navbar.html")
    .then((r) => r.text())
    .then((html) => {
      placeholder.innerHTML = html;

      const active = document.getElementById(pageId);
      if (active) {
        active.parentElement.classList.add("active");
      }

      const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};
      const nameEl = document.getElementById("displayAdminName");
      const avatarEl = document.getElementById("navUserAvatar");
      const fotoEl = document.getElementById("navUserFoto");

      if (nameEl) nameEl.textContent = acc.username || "Admin";
      if (avatarEl)
        avatarEl.textContent = (acc.username || "A")[0].toUpperCase();
      if (fotoEl && acc.foto) {
        fotoEl.src = acc.foto;
        fotoEl.style.display = "block";
        if (avatarEl) avatarEl.style.display = "none";
      }

      const tema = getTemaSaat();
      updateTombolTema(tema);
    })
    .catch((err) => console.warn("Navbar load failed:", err));
}

// ============================================================
//  KELOLA AKUN ADMIN (with photo upload)
// ============================================================
function bukaModalAkun() {
  const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};
  const modal = document.getElementById("modalAkun");
  if (!modal) return;

  document.getElementById("updateUsername").value = acc.username || "";
  document.getElementById("updateNamaLengkap").value = acc.nama_lengkap || "";
  document.getElementById("updatePassword").value = "";
  document.getElementById("updatePasswordKonfirm").value = "";

  const preview = document.getElementById("fotoPreview");
  if (preview && acc.foto) {
    preview.src = acc.foto;
    preview.style.display = "block";
  }

  modal.style.display = "flex";
}

function tutupModalAkun() {
  const modal = document.getElementById("modalAkun");
  if (modal) modal.style.display = "none";
}

function previewFoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast("Ukuran foto maksimal 2MB!", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById("fotoPreview");
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = "block";
    }
  };
  reader.readAsDataURL(file);
}

function simpanPerubahanAkun() {
  const userBaru = document.getElementById("updateUsername")?.value.trim();
  const namaLengkap = document
    .getElementById("updateNamaLengkap")
    ?.value.trim();
  const passBaru = document.getElementById("updatePassword")?.value.trim();
  const passKonfirm = document
    .getElementById("updatePasswordKonfirm")
    ?.value.trim();
  const fotoInput = document.getElementById("uploadFoto");

  if (!userBaru) {
    showToast("Username tidak boleh kosong!", "error");
    return;
  }
  if (passBaru && passBaru.length < 5) {
    showToast("Password minimal 5 karakter!", "warning");
    return;
  }
  if (passBaru && passBaru !== passKonfirm) {
    showToast("Konfirmasi password tidak cocok!", "error");
    return;
  }

  const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};

  function doSave(foto) {
    const updated = {
      username: userBaru,
      nama_lengkap: namaLengkap || userBaru,
      password: passBaru || acc.password,
      foto: foto || acc.foto || null,
    };
    localStorage.setItem(DB_ADMIN, JSON.stringify(updated));

    // Langsung perbarui navbar tanpa reload
    const nameEl = document.getElementById("displayAdminName");
    const avatarEl = document.getElementById("navUserAvatar");
    const fotoEl = document.getElementById("navUserFoto");
    if (nameEl) nameEl.textContent = updated.username;
    if (avatarEl) avatarEl.textContent = updated.username[0].toUpperCase();
    if (fotoEl && updated.foto) {
      fotoEl.src = updated.foto;
      fotoEl.style.display = "block";
      if (avatarEl) avatarEl.style.display = "none";
    }

    tutupModalAkun();
    showToast("Profil admin berhasil diperbarui!", "success");

    if (passBaru) {
      setTimeout(() => {
        showToast("Password diubah. Silakan login ulang.", "info");
        setTimeout(() => {
          sessionStorage.removeItem("isLoggedIn");
          window.location.href = "login.html";
        }, 1800);
      }, 500);
    }
  }

  if (fotoInput && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => doSave(e.target.result);
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    doSave(null);
  }
}

// ============================================================
//  PRODUK CRUD
// ============================================================
let editIdSekarang = null;

function getDaftarProduk() {
  return JSON.parse(localStorage.getItem(DB_PRODUK)) || [];
}
function simpanDaftarProduk(p) {
  localStorage.setItem(DB_PRODUK, JSON.stringify(p));
}

function renderTabelStok(keyword = "", filterKat = "") {
  const tbody = document.getElementById("bodyStok");
  if (!tbody) return;

  let produk = getDaftarProduk();
  if (keyword)
    produk = produk.filter((p) =>
      p.nama.toLowerCase().includes(keyword.toLowerCase()),
    );
  if (filterKat) produk = produk.filter((p) => p.kategori === filterKat);

  if (produk.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:40px;color:#999;">
      <i class="fa fa-inbox fa-2x" style="display:block;margin-bottom:8px;"></i>
      ${keyword ? "Tidak ada produk yang cocok" : "Belum ada produk"}</td></tr>`;
    return;
  }

  tbody.innerHTML = produk
    .map(
      (p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><span class="label label-primary">${p.id}</span></td>
      <td><strong>${p.nama}</strong></td>
      <td><span class="label label-info">${p.kategori || "-"}</span></td>
      <td class="text-right"><strong>Rp ${p.harga.toLocaleString("id-ID")}</strong></td>
      <td class="text-center">
        <span class="label ${p.stok <= 0 ? "label-danger" : p.stok <= 5 ? "label-warning" : "label-success"}">
          ${p.stok} ${p.satuan || "pcs"}
        </span>
      </td>
      <td class="text-center">
        <button class="btn btn-xs btn-warning" onclick="bukaModalEdit('${p.id}')"><i class="fa fa-pencil"></i></button>
        <button class="btn btn-xs btn-danger" onclick="hapusProdukConfirm('${p.id}','${p.nama.replace(/'/g, "\\'")}')"><i class="fa fa-trash"></i></button>
      </td>
    </tr>`,
    )
    .join("");
}

function tambahProdukBaru() {
  const nama = document.getElementById("newNama")?.value.trim();
  const harga = parseInt(document.getElementById("newHarga")?.value);
  const stok = parseInt(document.getElementById("newStok")?.value) || 0;
  const kat = document.getElementById("newKategori")?.value || "Lainnya";
  const sat = document.getElementById("newSatuan")?.value || "pcs";

  if (!nama) {
    showToast("Nama produk wajib diisi!", "error");
    return;
  }
  if (!harga || harga <= 0) {
    showToast("Harga harus lebih dari 0!", "error");
    return;
  }
  if (stok < 0) {
    showToast("Stok tidak boleh negatif!", "error");
    return;
  }

  const produk = getDaftarProduk();
  const idBaru = "P" + Math.floor(100 + Math.random() * 900);
  produk.push({ id: idBaru, nama, harga, stok, kategori: kat, satuan: sat });
  simpanDaftarProduk(produk);

  ["newNama", "newHarga", "newStok"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = id === "newStok" ? "0" : "";
  });
  renderTabelStok();
  updateProdukStat();
  showToast(`Produk "${nama}" berhasil ditambahkan!`, "success");
}

function bukaModalEdit(id) {
  const p = getDaftarProduk().find((item) => item.id === id);
  if (!p) return;
  editIdSekarang = id;
  document.getElementById("editNama").value = p.nama;
  document.getElementById("editHarga").value = p.harga;
  document.getElementById("editStok").value = p.stok;
  document.getElementById("editKategori").value = p.kategori || "";
  document.getElementById("editSatuan").value = p.satuan || "pcs";
  document.getElementById("modalEdit").style.display = "flex";
}

function tutupModalEdit() {
  document.getElementById("modalEdit").style.display = "none";
  editIdSekarang = null;
}

function simpanPerubahan() {
  const nama = document.getElementById("editNama")?.value.trim();
  const harga = parseInt(document.getElementById("editHarga")?.value);
  const stok = parseInt(document.getElementById("editStok")?.value);
  const kat = document.getElementById("editKategori")?.value;
  const sat = document.getElementById("editSatuan")?.value;

  if (!nama) {
    showToast("Nama wajib diisi!", "error");
    return;
  }
  if (!harga || harga <= 0) {
    showToast("Harga harus lebih dari 0!", "error");
    return;
  }
  if (stok < 0) {
    showToast("Stok tidak boleh negatif!", "error");
    return;
  }

  const produk = getDaftarProduk();
  const idx = produk.findIndex((p) => p.id === editIdSekarang);
  if (idx !== -1) {
    produk[idx] = {
      ...produk[idx],
      nama,
      harga,
      stok,
      kategori: kat,
      satuan: sat,
    };
    simpanDaftarProduk(produk);
    tutupModalEdit();
    renderTabelStok();
    updateProdukStat();
    showToast("Produk berhasil diperbarui!", "success");
  }
}

function hapusProdukConfirm(id, nama) {
  showConfirm(
    "Hapus Produk?",
    `"${nama}" akan dihapus secara permanen.`,
    () => {
      let produk = getDaftarProduk().filter((p) => p.id !== id);
      simpanDaftarProduk(produk);
      renderTabelStok();
      updateProdukStat();
      showToast(`Produk "${nama}" dihapus.`, "info");
    },
  );
}

function updateProdukStat() {
  const produk = getDaftarProduk();
  const lowStock = produk.filter((p) => p.stok <= 5).length;
  const el = document.getElementById("produkStat");
  if (el) {
    el.innerHTML = `
      <span class="badge bg-blue">${produk.length} produk</span>
      ${lowStock > 0 ? `<span class="badge bg-red">${lowStock} stok rendah</span>` : `<span class="badge bg-green">Stok normal</span>`}`;
  }
}

function eksporProdukExcel() {
  const produk = getDaftarProduk();
  if (!produk.length || typeof XLSX === "undefined") {
    showToast("Tidak ada data untuk diekspor", "warning");
    return;
  }
  const data = [
    ["No", "ID", "Nama Produk", "Kategori", "Harga Jual", "Stok", "Satuan"],
    ...produk.map((p, i) => [
      i + 1,
      p.id,
      p.nama,
      p.kategori || "-",
      p.harga,
      p.stok,
      p.satuan || "pcs",
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [
    { wch: 5 },
    { wch: 8 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 8 },
    { wch: 8 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produk");
  XLSX.writeFile(
    wb,
    `DataProduk_MingMart_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.xlsx`,
  );
  showToast("Data produk berhasil diekspor!", "success");
}

// ============================================================
//  KASIR
// ============================================================
let keranjang = [];
let daftarProduk = [];
let totalBelanjaGlobal = 0;
let diskonGlobal = 0;

function renderProdukKasir() {
  const select = document.getElementById("pilihProduk");
  if (!select) return;
  daftarProduk = getDaftarProduk();
  select.innerHTML = '<option value="">-- Pilih Produk --</option>';
  daftarProduk
    .filter((p) => p.stok > 0)
    .forEach((p) => {
      select.innerHTML += `<option value="${p.id}">${p.nama} — Rp ${p.harga.toLocaleString("id-ID")} (Stok: ${p.stok})</option>`;
    });
}

function updateHargaOtomatis() {
  const id = document.getElementById("pilihProduk")?.value;
  const el = document.getElementById("hargaProduk");
  daftarProduk = getDaftarProduk();
  const p = daftarProduk.find((item) => item.id === id);
  if (el) el.value = p ? p.harga : "";
}

function tambahKeKeranjang() {
  const id = document.getElementById("pilihProduk")?.value;
  const qty = parseInt(document.getElementById("jumlahProduk")?.value);
  daftarProduk = getDaftarProduk();
  const p = daftarProduk.find((item) => item.id === id);

  if (!p) {
    showToast("Pilih produk terlebih dahulu!", "warning");
    return;
  }
  if (!qty || qty <= 0) {
    showToast("Jumlah harus lebih dari 0!", "warning");
    return;
  }
  if (qty > p.stok) {
    showToast(`Stok tidak cukup! Tersedia: ${p.stok}`, "error");
    return;
  }

  const existing = keranjang.find((item) => item.id === id);
  if (existing) {
    if (existing.qty + qty > p.stok) {
      showToast(`Stok tidak cukup! Tersedia: ${p.stok}`, "error");
      return;
    }
    existing.qty += qty;
    existing.subtotal = existing.harga * existing.qty;
  } else {
    keranjang.push({
      id: p.id,
      nama: p.nama,
      harga: p.harga,
      qty,
      subtotal: p.harga * qty,
    });
  }

  renderKeranjang();
  document.getElementById("jumlahProduk").value = "1";
  showToast(`${p.nama} x${qty} ditambahkan`, "success");
}

function renderKeranjang() {
  const tbody = document.getElementById("tabelKeranjang");
  if (!tbody) return;

  if (keranjang.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:30px;color:#999;">
      <i class="fa fa-shopping-cart fa-2x" style="display:block;margin-bottom:8px;"></i>
      Keranjang masih kosong</td></tr>`;
    atusTotalKeranjang(0);
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = keranjang
    .map((item, idx) => {
      subtotal += item.subtotal;
      return `<tr>
      <td><strong>${item.nama}</strong></td>
      <td class="text-center">
        <div class="input-group input-group-sm" style="width:100px;margin:auto;">
          <span class="input-group-btn"><button class="btn btn-xs btn-default" onclick="ubahQtyKeranjang(${idx},-1)">−</button></span>
          <input type="text" class="form-control text-center" value="${item.qty}" readonly style="width:40px;">
          <span class="input-group-btn"><button class="btn btn-xs btn-default" onclick="ubahQtyKeranjang(${idx},1)">+</button></span>
        </div>
      </td>
      <td class="text-right">Rp ${item.harga.toLocaleString("id-ID")}</td>
      <td class="text-right"><strong>Rp ${item.subtotal.toLocaleString("id-ID")}</strong></td>
      <td class="text-center"><button class="btn btn-xs btn-danger" onclick="hapusKeranjang(${idx})"><i class="fa fa-times"></i></button></td>
    </tr>`;
    })
    .join("");

  atusTotalKeranjang(subtotal);
}

function atusTotalKeranjang(subtotal) {
  const diskon = diskonGlobal || 0;
  const total = Math.max(0, subtotal - diskon);
  totalBelanjaGlobal = total;

  const countTotal = keranjang.reduce((s, i) => s + i.qty, 0);
  const el = (id) => document.getElementById(id);

  if (el("subtotalHarga"))
    el("subtotalHarga").textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
  if (el("diskonHarga"))
    el("diskonHarga").textContent = `- Rp ${diskon.toLocaleString("id-ID")}`;
  if (el("totalHarga"))
    el("totalHarga").textContent = `Rp ${total.toLocaleString("id-ID")}`;
  if (el("totalHargaSide"))
    el("totalHargaSide").textContent = `Rp ${total.toLocaleString("id-ID")}`;
  if (el("cartCount")) el("cartCount").textContent = countTotal;
  if (el("cartBadge")) el("cartBadge").textContent = `${countTotal} item`;
}

function ubahQtyKeranjang(idx, delta) {
  const item = keranjang[idx];
  daftarProduk = getDaftarProduk();
  const p = daftarProduk.find((pp) => pp.id === item.id);
  const newQty = item.qty + delta;
  if (newQty <= 0) {
    hapusKeranjang(idx);
    return;
  }
  if (p && newQty > p.stok) {
    showToast(`Stok maksimum: ${p.stok}`, "warning");
    return;
  }
  keranjang[idx].qty = newQty;
  keranjang[idx].subtotal = item.harga * newQty;
  renderKeranjang();
}

function hapusKeranjang(idx) {
  keranjang.splice(idx, 1);
  renderKeranjang();
}

function bersihkanKeranjang() {
  if (!keranjang.length) return;
  showConfirm("Bersihkan Keranjang?", "Semua item akan dihapus.", () => {
    keranjang = [];
    diskonGlobal = 0;
    renderKeranjang();
    showToast("Keranjang dikosongkan", "info");
  });
}

function terapkanDiskon() {
  const val = parseInt(document.getElementById("inputDiskon")?.value) || 0;
  const subtotal = keranjang.reduce((s, i) => s + i.subtotal, 0);
  if (val < 0 || val > subtotal) {
    showToast("Diskon tidak valid!", "error");
    return;
  }
  diskonGlobal = val;
  renderKeranjang();
  showToast(`Diskon Rp ${val.toLocaleString("id-ID")} diterapkan`, "success");
}

function prosesBayar() {
  if (!keranjang.length) {
    showToast("Keranjang masih kosong!", "warning");
    return;
  }
  totalBelanjaGlobal = Math.max(
    0,
    keranjang.reduce((s, i) => s + i.subtotal, 0) - diskonGlobal,
  );

  const modal = document.getElementById("modalBayar");
  if (modal) {
    modal.style.display = "flex";
    const nominalInput = document.getElementById("nominalBayar");
    const modalTotal = document.getElementById("modalTotalTagihan");
    if (nominalInput) {
      nominalInput.value = "";
      nominalInput.readOnly = false;
    }
    if (modalTotal)
      modalTotal.textContent = `Rp ${totalBelanjaGlobal.toLocaleString("id-ID")}`;
    document.getElementById("metodeBayar").value = "Cash";
    const groupUang = document.getElementById("groupUangBayar");
    if (groupUang) groupUang.style.opacity = "1";
    hitungKembalian();
    if (nominalInput) nominalInput.focus();
  }
}

function hitungKembalian() {
  const nominalEl = document.getElementById("nominalBayar");
  const textEl = document.getElementById("textKembalian");
  if (!nominalEl || !textEl) return;
  const bayar = parseInt(nominalEl.value) || 0;
  const kembali = bayar - totalBelanjaGlobal;
  textEl.textContent = `Rp ${kembali.toLocaleString("id-ID")}`;
  textEl.style.color = kembali < 0 ? "#dd4b39" : "#00a65a";
}

function toggleInputUang() {
  const metode = document.getElementById("metodeBayar")?.value;
  const groupInput = document.getElementById("groupUangBayar");
  const nominalInput = document.getElementById("nominalBayar");
  if (!nominalInput) return;
  if (metode === "QRIS" || metode === "Hutang" || metode === "Transfer") {
    nominalInput.value = totalBelanjaGlobal;
    if (groupInput) groupInput.style.opacity = "0.5";
    nominalInput.readOnly = true;
  } else {
    if (groupInput) groupInput.style.opacity = "1";
    nominalInput.readOnly = false;
    nominalInput.value = "";
    nominalInput.focus();
  }
  hitungKembalian();
}

function tutupModalBayar() {
  const modal = document.getElementById("modalBayar");
  if (modal) modal.style.display = "none";
}

async function konfirmasiProsesCetak() {
  const nominalEl = document.getElementById("nominalBayar");
  const nominal = parseFloat(nominalEl?.value) || 0;
  const total = totalBelanjaGlobal;
  const metode = document.getElementById("metodeBayar")?.value || "Cash";
  const namaPembeli =
    document.getElementById("namaPembeli")?.value?.trim() || "Umum";

  if (nominal < total && metode !== "Hutang") {
    showToast("Uang pembayaran kurang!", "error");
    return;
  }

  tutupModalBayar();

  // Simpan riwayat
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const trxId = "TRX-" + Date.now();
  riwayat.unshift({
    id: trxId,
    waktu: new Date().toLocaleString("id-ID"),
    items: [...keranjang],
    total,
    diskon: diskonGlobal,
    metode,
    pembeli: namaPembeli,
  });
  localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));

  // Potong stok
  daftarProduk = getDaftarProduk();
  keranjang.forEach((item) => {
    const p = daftarProduk.find((pp) => pp.id === item.id);
    if (p) p.stok = Math.max(0, p.stok - item.qty);
  });
  simpanDaftarProduk(daftarProduk);

  const snapshotKeranjang = [...keranjang];
  const snapshotDiskon = diskonGlobal;

  showToast("Transaksi berhasil! Stok diperbarui.", "success");
  keranjang = [];
  diskonGlobal = 0;
  if (document.getElementById("inputDiskon"))
    document.getElementById("inputDiskon").value = "";
  renderKeranjang();
  renderProdukKasir();
  if (document.getElementById("namaPembeli"))
    document.getElementById("namaPembeli").value = "";

  // Pilih metode cetak
  const pilihanCetak = await tampilPilihanCetak();
  if (!pilihanCetak) return;

  if (pilihanCetak === "pdf") {
    await cetakStrukPDF(
      total,
      metode,
      nominal,
      "simpan",
      namaPembeli,
      snapshotKeranjang,
      snapshotDiskon,
    );
  } else if (pilihanCetak === "print") {
    await cetakStrukPDF(
      total,
      metode,
      nominal,
      "cetak",
      namaPembeli,
      snapshotKeranjang,
      snapshotDiskon,
    );
  } else if (pilihanCetak === "bluetooth") {
    await cetakStrukBluetooth(
      total,
      metode,
      nominal,
      namaPembeli,
      snapshotKeranjang,
      snapshotDiskon,
    );
  } else if (pilihanCetak === "usb") {
    await cetakStrukUSB(
      total,
      metode,
      nominal,
      namaPembeli,
      snapshotKeranjang,
      snapshotDiskon,
    );
  }
}

function tampilPilihanCetak() {
  return new Promise((resolve) => {
    let modal = document.getElementById("modalPilihanCetak");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalPilihanCetak";
      modal.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:none;align-items:center;justify-content:center;";
      modal.innerHTML = `
        <div class="box box-primary" style="width:420px;margin:0;">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-print"></i> Pilih Metode Cetak Struk</h3>
          </div>
          <div class="box-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
              <button id="btnCetakPDF" class="btn btn-app" style="background:#f39c12;color:#fff;border:none;height:80px;">
                <i class="fa fa-file-pdf-o"></i> Simpan PDF
              </button>
              <button id="btnCetakPrint" class="btn btn-app" style="background:#3c8dbc;color:#fff;border:none;height:80px;">
                <i class="fa fa-print"></i> Cetak USB/LAN
              </button>
              <button id="btnCetakBT" class="btn btn-app" style="background:#00a65a;color:#fff;border:none;height:80px;">
                <i class="fa fa-bluetooth"></i> Bluetooth
              </button>
              <button id="btnCetakSkip" class="btn btn-app" style="background:#d2d6de;color:#333;border:none;height:80px;">
                <i class="fa fa-times"></i> Lewati
              </button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";
    const hide = (val) => {
      modal.style.display = "none";
      resolve(val);
    };
    document.getElementById("btnCetakPDF").onclick = () => hide("pdf");
    document.getElementById("btnCetakPrint").onclick = () => hide("print");
    document.getElementById("btnCetakBT").onclick = () => hide("bluetooth");
    document.getElementById("btnCetakSkip").onclick = () => hide(null);
  });
}

// ============================================================
//  CETAK STRUK PDF
// ============================================================
function getJsPDF() {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  if (window.jsPDF) return window.jsPDF;
  return null;
}

function tunggaLibrary(nama, getter, maxMs = 8000) {
  return new Promise((resolve, reject) => {
    const mulai = Date.now();
    const cek = () => {
      const val = getter();
      if (val) {
        resolve(val);
        return;
      }
      if (Date.now() - mulai > maxMs) {
        reject(new Error(`Library ${nama} tidak tersedia`));
        return;
      }
      setTimeout(cek, 150);
    };
    cek();
  });
}

function buatDataStruk(total, metode, bayar, namaPembeli, itemList, diskon) {
  const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};
  const kembali = bayar - total;
  const now = new Date();
  const tglWaktu = now.toLocaleString("id-ID");
  return {
    acc,
    kembali,
    tglWaktu,
    itemList,
    total,
    metode,
    bayar,
    namaPembeli,
    diskon,
  };
}

async function cetakStrukPDF(
  total,
  metode,
  bayar,
  aksi,
  namaPembeli,
  itemSnapshot,
  diskon = 0,
) {
  const itemList = itemSnapshot || keranjang;
  try {
    showToast("Menyiapkan struk PDF...", "info");
    let JsPDF;
    try {
      JsPDF = await tunggaLibrary("jsPDF", getJsPDF, 8000);
    } catch (e) {
      showToast("Library PDF gagal dimuat!", "error");
      return;
    }

    const { acc, kembali, tglWaktu } = buatDataStruk(
      total,
      metode,
      bayar,
      namaPembeli,
      itemList,
      diskon,
    );
    const doc = new JsPDF({ unit: "mm", format: [80, 200] });

    // Logo
    try {
      const logoImg = new Image();
      logoImg.src = "assets/images/logo-toko.png";
      await new Promise((res, rej) => {
        logoImg.onload = res;
        logoImg.onerror = rej;
        setTimeout(rej, 2000);
      });
      doc.addImage(logoImg, "PNG", 30, 5, 20, 20);
    } catch (e) {
      /* skip */
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MING MART", 40, 30, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Dusun Batu Menjangkong, Desa Anyar", 40, 35, { align: "center" });
    doc.text("Kec. Bayan, Kab. Lombok Utara", 40, 39, { align: "center" });
    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, 43, 75, 43);

    let y = 48;
    [
      ["Pembeli", namaPembeli],
      ["Tanggal", tglWaktu],
      ["Pembayaran", metode],
      ["Kasir", acc.username || "admin"],
    ].forEach(([lbl, val]) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(lbl, 5, y);
      doc.text(String(val), 75, y, { align: "right" });
      y += 5;
    });

    doc.line(5, y + 1, 75, y + 1);
    y += 7;

    itemList.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(item.nama, 5, y);
      doc.text(`Rp ${item.subtotal.toLocaleString("id-ID")}`, 75, y, {
        align: "right",
      });
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`${item.qty} x Rp ${item.harga.toLocaleString("id-ID")}`, 5, y);
      y += 6;
    });

    doc.line(5, y - 2, 75, y - 2);
    y += 4;

    if (diskon > 0) {
      doc.setFontSize(8);
      doc.text("Subtotal", 5, y);
      doc.text(`Rp ${(total + diskon).toLocaleString("id-ID")}`, 75, y, {
        align: "right",
      });
      y += 5;
      doc.text("Diskon", 5, y);
      doc.text(`- Rp ${diskon.toLocaleString("id-ID")}`, 75, y, {
        align: "right",
      });
      y += 5;
      doc.line(5, y - 1, 75, y - 1);
      y += 2;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL", 5, y);
    doc.text(`Rp ${total.toLocaleString("id-ID")}`, 75, y, { align: "right" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text("Bayar", 5, y);
    doc.text(`Rp ${bayar.toLocaleString("id-ID")}`, 75, y, { align: "right" });
    y += 5;
    doc.text("Kembali", 5, y);
    doc.text(`Rp ${kembali.toLocaleString("id-ID")}`, 75, y, {
      align: "right",
    });
    y += 14;
    doc.setFontSize(9);
    doc.text("Terima kasih sudah berbelanja!", 40, y, { align: "center" });
    y += 5;
    doc.setFontSize(7);
    doc.text("* Simpan struk ini sebagai bukti pembelian *", 40, y, {
      align: "center",
    });

    if (aksi === "simpan") {
      doc.save(`Struk-MingMart-${Date.now()}.pdf`);
    } else {
      const blobUrl = doc.output("bloburl");
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      };
    }
    showToast("Struk berhasil dibuat!", "success");
  } catch (e) {
    console.error("Gagal cetak:", e);
    showToast("Gagal membuat struk: " + e.message, "error");
  }
}

// ============================================================
//  CETAK BLUETOOTH (Web Bluetooth API)
// ============================================================
async function cetakStrukBluetooth(
  total,
  metode,
  bayar,
  namaPembeli,
  itemList,
  diskon = 0,
) {
  if (!navigator.bluetooth) {
    showToast(
      "Browser tidak mendukung Bluetooth. Gunakan Chrome/Edge.",
      "error",
    );
    return;
  }

  try {
    showToast("Menghubungkan printer Bluetooth...", "info");
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
      optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(
      "000018f0-0000-1000-8000-00805f9b34fb",
    );
    const char = await service.getCharacteristic(
      "00002af1-0000-1000-8000-00805f9b34fb",
    );

    const teks = buatTeksStruk(
      total,
      metode,
      bayar,
      namaPembeli,
      itemList,
      diskon,
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(teks);

    // Kirim dalam chunks 20 bytes
    const chunkSize = 20;
    for (let i = 0; i < data.length; i += chunkSize) {
      await char.writeValue(data.slice(i, i + chunkSize));
    }

    device.gatt.disconnect();
    showToast("Struk berhasil dicetak via Bluetooth!", "success");
  } catch (e) {
    if (e.name === "NotFoundError") {
      showToast("Tidak ada printer Bluetooth yang dipilih.", "warning");
    } else {
      showToast("Gagal cetak Bluetooth: " + e.message, "error");
    }
  }
}

// ============================================================
//  CETAK USB / Serial (Web Serial API)
// ============================================================
async function cetakStrukUSB(
  total,
  metode,
  bayar,
  namaPembeli,
  itemList,
  diskon = 0,
) {
  if (!navigator.serial) {
    // Fallback: gunakan window.print dengan layout struk
    cetakStrukPrint(total, metode, bayar, namaPembeli, itemList, diskon);
    return;
  }

  try {
    showToast("Menghubungkan printer USB/Serial...", "info");
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const teks = buatTeksStruk(
      total,
      metode,
      bayar,
      namaPembeli,
      itemList,
      diskon,
    );
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(teks));
    writer.releaseLock();
    await port.close();

    showToast("Struk berhasil dicetak via USB!", "success");
  } catch (e) {
    if (e.name === "NotFoundError") {
      showToast("Tidak ada port USB yang dipilih.", "warning");
    } else {
      console.warn("Serial API error:", e);
      // Fallback ke print dialog
      cetakStrukPrint(total, metode, bayar, namaPembeli, itemList, diskon);
    }
  }
}

function cetakStrukPrint(
  total,
  metode,
  bayar,
  namaPembeli,
  itemList,
  diskon = 0,
) {
  const teks = buatTeksStrukHTML(
    total,
    metode,
    bayar,
    namaPembeli,
    itemList,
    diskon,
  );
  const win = window.open("", "_blank", "width=320,height=600");
  win.document.write(teks);
  win.document.close();
  win.onload = () => {
    win.print();
  };
}

function buatTeksStruk(total, metode, bayar, namaPembeli, itemList, diskon) {
  const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};
  const kembali = bayar - total;
  const now = new Date().toLocaleString("id-ID");
  const garis = "--------------------------------\n";
  const center = (str) => {
    const pad = Math.floor((32 - str.length) / 2);
    return " ".repeat(Math.max(0, pad)) + str + "\n";
  };

  let teks = "\x1B\x40"; // ESC @ reset printer
  teks += center("MING MART");
  teks += center("Desa Anyar, Lombok Utara");
  teks += garis;
  teks += `Pembeli : ${namaPembeli}\n`;
  teks += `Tanggal : ${now}\n`;
  teks += `Kasir   : ${acc.username || "admin"}\n`;
  teks += `Metode  : ${metode}\n`;
  teks += garis;

  itemList.forEach((item) => {
    const nama = item.nama.substring(0, 18);
    const sub = `Rp ${item.subtotal.toLocaleString("id-ID")}`;
    teks += `${nama.padEnd(20)}${sub.padStart(12)}\n`;
    teks += `  ${item.qty} x Rp ${item.harga.toLocaleString("id-ID")}\n`;
  });

  teks += garis;
  if (diskon > 0) {
    teks += `Subtotal  : Rp ${(total + diskon).toLocaleString("id-ID")}\n`;
    teks += `Diskon    : Rp ${diskon.toLocaleString("id-ID")}\n`;
  }
  teks += "\x1B\x21\x08"; // bold
  teks += `TOTAL     : Rp ${total.toLocaleString("id-ID")}\n`;
  teks += "\x1B\x21\x00"; // normal
  teks += `Bayar     : Rp ${bayar.toLocaleString("id-ID")}\n`;
  teks += `Kembali   : Rp ${kembali.toLocaleString("id-ID")}\n`;
  teks += garis;
  teks += center("Terima kasih sudah berbelanja!");
  teks += "\n\n\n"; // line feed
  teks += "\x1D\x56\x41"; // cut paper
  return teks;
}

function buatTeksStrukHTML(
  total,
  metode,
  bayar,
  namaPembeli,
  itemList,
  diskon,
) {
  const acc = JSON.parse(localStorage.getItem(DB_ADMIN)) || {};
  const kembali = bayar - total;
  const now = new Date().toLocaleString("id-ID");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body { font-family: monospace; font-size: 11px; width: 280px; margin: 0 auto; padding: 10px; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .line { border-top: 1px dashed #000; margin: 4px 0; }
    .row { display: flex; justify-content: space-between; }
    @media print { @page { margin: 0; } }
  </style>
  </head><body>
  <div class="center bold" style="font-size:14px;">MING MART</div>
  <div class="center">Desa Anyar, Lombok Utara</div>
  <div class="line"></div>
  <div class="row"><span>Pembeli</span><span>${namaPembeli}</span></div>
  <div class="row"><span>Tanggal</span><span>${now}</span></div>
  <div class="row"><span>Kasir</span><span>${acc.username || "admin"}</span></div>
  <div class="row"><span>Metode</span><span>${metode}</span></div>
  <div class="line"></div>
  ${itemList
    .map(
      (i) => `
    <div class="row bold"><span>${i.nama}</span><span>Rp ${i.subtotal.toLocaleString("id-ID")}</span></div>
    <div style="padding-left:10px;color:#555;">${i.qty} x Rp ${i.harga.toLocaleString("id-ID")}</div>
  `,
    )
    .join("")}
  <div class="line"></div>
  ${
    diskon > 0
      ? `<div class="row"><span>Subtotal</span><span>Rp ${(total + diskon).toLocaleString("id-ID")}</span></div>
  <div class="row"><span>Diskon</span><span>- Rp ${diskon.toLocaleString("id-ID")}</span></div>`
      : ""
  }
  <div class="row bold" style="font-size:13px;margin-top:4px;"><span>TOTAL</span><span>Rp ${total.toLocaleString("id-ID")}</span></div>
  <div class="row"><span>Bayar</span><span>Rp ${bayar.toLocaleString("id-ID")}</span></div>
  <div class="row"><span>Kembali</span><span>Rp ${kembali.toLocaleString("id-ID")}</span></div>
  <div class="line"></div>
  <div class="center">Terima kasih sudah berbelanja!</div>
  <div class="center">* Simpan struk ini sebagai bukti *</div>
  </body></html>`;
}

function eksporExcel() {
  const table = document.querySelector("#tabelKeranjang");
  if (!keranjang.length || typeof XLSX === "undefined") {
    showToast("Tidak ada data untuk diekspor", "warning");
    return;
  }
  const data = [
    ["Nama Produk", "Harga Satuan", "Qty", "Subtotal"],
    ...keranjang.map((i) => [i.nama, i.harga, i.qty, i.subtotal]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Keranjang");
  XLSX.writeFile(wb, `Keranjang_MingMart_${Date.now()}.xlsx`);
  showToast("Keranjang diekspor!", "success");
}

// ============================================================
//  LAPORAN
// ============================================================
function renderDashboard() {
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const tbody = document.getElementById("bodyRiwayat");
  if (!tbody) return;

  let totalOmzet = 0,
    totalTerjual = 0;
  const dataProduk = {};
  const dataHarian = {};

  if (!riwayat.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:40px;">
      <i class="fa fa-bar-chart fa-3x text-muted" style="display:block;margin-bottom:10px;"></i>
      Belum ada transaksi</td></tr>`;
    ["totalOmzet", "totalTerjual", "totalTransaksi", "totalHutang"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el)
          el.textContent = id.includes("Omzet")
            ? "Rp 0"
            : id.includes("Hutang")
              ? "Rp 0"
              : "0";
      },
    );
    renderGrafik({});
    return;
  }

  let totalHutang = 0;
  tbody.innerHTML = riwayat
    .map((t) => {
      totalOmzet += t.total;
      if (t.metode === "Hutang") totalHutang += t.total;
      t.items.forEach((item) => {
        totalTerjual += item.qty;
        dataProduk[item.nama] = (dataProduk[item.nama] || 0) + item.qty;
      });
      // Harian
      const tgl = t.waktu?.split(",")[0] || "?";
      dataHarian[tgl] = (dataHarian[tgl] || 0) + t.total;

      return `<tr>
      <td style="font-size:12px;">${t.waktu}</td>
      <td><span class="label label-primary">${t.id}</span></td>
      <td>${t.pembeli || "-"}</td>
      <td><span class="label label-${t.metode === "Hutang" ? "danger" : t.metode === "QRIS" ? "warning" : "success"}">${t.metode}</span></td>
      <td class="text-right"><strong>Rp ${t.total.toLocaleString("id-ID")}</strong></td>
      <td class="text-center">
        <button class="btn btn-xs btn-info" onclick="lihatDetailTransaksi('${t.id}')"><i class="fa fa-eye"></i></button>
        <button class="btn btn-xs btn-warning" onclick="bukaEditLaporan('${t.id}',${t.total})"><i class="fa fa-pencil"></i></button>
        <button class="btn btn-xs btn-danger" onclick="hapusSatuRiwayat('${t.id}')"><i class="fa fa-trash"></i></button>
        <button class="btn btn-xs btn-default" onclick="cetakUlangStruk('${t.id}')"><i class="fa fa-print"></i></button>
      </td>
    </tr>`;
    })
    .join("");

  const el = (id) => document.getElementById(id);
  if (el("totalOmzet"))
    el("totalOmzet").textContent = `Rp ${totalOmzet.toLocaleString("id-ID")}`;
  if (el("totalTerjual"))
    el("totalTerjual").textContent = `${totalTerjual} Item`;
  if (el("totalTransaksi"))
    el("totalTransaksi").textContent = `${riwayat.length}`;
  if (el("totalHutang"))
    el("totalHutang").textContent = `Rp ${totalHutang.toLocaleString("id-ID")}`;
  renderGrafik(dataProduk);
}

function renderGrafik(dataProduk) {
  const canvas = document.getElementById("chartPenjualan");
  if (!canvas || typeof Chart === "undefined") return;
  if (window.myChart) window.myChart.destroy();

  const labels = Object.keys(dataProduk);
  const values = Object.values(dataProduk);
  if (!labels.length) return;

  const palette = [
    "#3c8dbc",
    "#00c0ef",
    "#00a65a",
    "#f39c12",
    "#dd4b39",
    "#605ca8",
    "#39CCCC",
  ];
  const colors = labels.map((_, i) => palette[i % palette.length]);

  window.myChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Unit Terjual",
          data: values,
          backgroundColor: colors.map((c) => c + "88"),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          callbacks: { label: (ctx) => ` ${ctx.parsed.y} unit` },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

function lihatDetailTransaksi(id) {
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const t = riwayat.find((r) => r.id === id);
  if (!t) return;

  const modal = document.getElementById("modalDetailTransaksi");
  if (!modal) return;

  document.getElementById("detailTransId").textContent = t.id;
  document.getElementById("detailTransWaktu").textContent = t.waktu;
  document.getElementById("detailTransPembeli").textContent = t.pembeli || "-";
  document.getElementById("detailTransMetode").textContent = t.metode;
  document.getElementById("detailTransTotal").textContent =
    `Rp ${t.total.toLocaleString("id-ID")}`;

  const tbody = document.getElementById("detailTransItems");
  tbody.innerHTML = t.items
    .map(
      (i) =>
        `<tr><td>${i.nama}</td><td class="text-center">${i.qty}</td>
     <td class="text-right">Rp ${i.harga.toLocaleString("id-ID")}</td>
     <td class="text-right">Rp ${i.subtotal.toLocaleString("id-ID")}</td></tr>`,
    )
    .join("");

  modal.style.display = "flex";
}

function tutupDetailTransaksi() {
  document.getElementById("modalDetailTransaksi").style.display = "none";
}

function cetakUlangStruk(id) {
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const t = riwayat.find((r) => r.id === id);
  if (!t) return;
  cetakStrukPDF(
    t.total,
    t.metode,
    t.total,
    "cetak",
    t.pembeli || "Umum",
    t.items,
    t.diskon || 0,
  );
}

function bukaEditLaporan(id, nominal) {
  document.getElementById("editTransId").value = id;
  document.getElementById("editTotalNominal").value = nominal;
  document.getElementById("modalEditLaporan").style.display = "flex";
}

function tutupEditLaporan() {
  document.getElementById("modalEditLaporan").style.display = "none";
}

function simpanEditLaporan() {
  const id = document.getElementById("editTransId").value;
  const total = parseInt(document.getElementById("editTotalNominal").value);
  if (!total || total <= 0) {
    showToast("Total harus lebih dari 0!", "error");
    return;
  }

  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const idx = riwayat.findIndex((t) => t.id === id);
  if (idx !== -1) {
    riwayat[idx].total = total;
    localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));
    tutupEditLaporan();
    renderDashboard();
    showToast("Transaksi berhasil diperbarui!", "success");
  }
}

function hapusSatuRiwayat(id) {
  showConfirm(
    "Hapus Transaksi?",
    "Data transaksi ini akan dihapus permanen.",
    () => {
      let riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
      riwayat = riwayat.filter((t) => t.id !== id);
      localStorage.setItem(DB_RIWAYAT, JSON.stringify(riwayat));
      renderDashboard();
      showToast("Transaksi dihapus.", "info");
    },
  );
}

function resetLaporan() {
  showConfirm(
    "Reset Semua Data?",
    "Semua riwayat transaksi akan dihapus secara permanen!",
    () => {
      localStorage.removeItem(DB_RIWAYAT);
      renderDashboard();
      showToast("Semua riwayat telah dihapus.", "warning");
    },
  );
}

// ============================================================
//  EKSPOR LAPORAN EXCEL (all types)
// ============================================================
function eksporLaporanExcel(tipe = "transaksi") {
  if (typeof XLSX === "undefined") {
    showToast("Library Excel tidak tersedia", "error");
    return;
  }
  const riwayat = JSON.parse(localStorage.getItem(DB_RIWAYAT)) || [];
  const produk = getDaftarProduk();

  const wb = XLSX.utils.book_new();

  if (tipe === "transaksi" || tipe === "semua") {
    const data = [
      ["ID Transaksi", "Waktu", "Pembeli", "Metode", "Total", "Diskon"],
      ...riwayat.map((t) => [
        t.id,
        t.waktu,
        t.pembeli || "-",
        t.metode,
        t.total,
        t.diskon || 0,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [
      { wch: 20 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");
  }

  if (tipe === "produk" || tipe === "semua") {
    const data = [
      ["ID", "Nama", "Kategori", "Harga", "Stok", "Satuan"],
      ...produk.map((p) => [
        p.id,
        p.nama,
        p.kategori || "-",
        p.harga,
        p.stok,
        p.satuan || "pcs",
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws2, "Data Produk");
  }

  if (tipe === "penjualan" || tipe === "semua") {
    const penjualan = {};
    riwayat.forEach((t) => {
      t.items.forEach((item) => {
        if (!penjualan[item.nama])
          penjualan[item.nama] = { nama: item.nama, qty: 0, omzet: 0 };
        penjualan[item.nama].qty += item.qty;
        penjualan[item.nama].omzet += item.subtotal;
      });
    });
    const data = [
      ["Nama Produk", "Total Qty Terjual", "Total Omzet"],
      ...Object.values(penjualan).map((p) => [p.nama, p.qty, p.omzet]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws3, "Rekap Penjualan");
  }

  if (tipe === "hutang" || tipe === "semua") {
    const hutang = riwayat.filter((t) => t.metode === "Hutang");
    const data = [
      ["ID Transaksi", "Waktu", "Pembeli", "Total Hutang"],
      ...hutang.map((t) => [t.id, t.waktu, t.pembeli || "-", t.total]),
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws4, "Daftar Hutang");
  }

  if (tipe === "detail" || tipe === "semua") {
    const rows = [
      [
        "ID Transaksi",
        "Waktu",
        "Pembeli",
        "Produk",
        "Qty",
        "Harga",
        "Subtotal",
        "Metode",
      ],
    ];
    riwayat.forEach((t) => {
      t.items.forEach((item) => {
        rows.push([
          t.id,
          t.waktu,
          t.pembeli || "-",
          item.nama,
          item.qty,
          item.harga,
          item.subtotal,
          t.metode,
        ]);
      });
    });
    const ws5 = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws5, "Detail Item Transaksi");
  }

  const nama = `LaporanMingMart_${tipe}_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.xlsx`;
  XLSX.writeFile(wb, nama);
  showToast("Laporan Excel berhasil diekspor!", "success");
}
