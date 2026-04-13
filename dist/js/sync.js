// ============================================================
//  MING MART — Firebase Real-Time Sync v1.0
//  Sinkronisasi data antar admin secara real-time
// ============================================================

// ── KONFIGURASI FIREBASE ────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAlozhSPgfEVeISY2ME3y-3duP64bBEtn0",
  databaseURL:
    "https://ming-mart-default-rtdb.asia-southeast1.firebasedatabase.app",
  authDomain: "ming-mart.firebaseapp.com",
  projectId: "ming-mart",
  storageBucket: "ming-mart.firebasestorage.app",
  messagingSenderId: "45725758136",
  appId: "1:45725758136:web:ae46b1207d2c01a29e384d",
  measurementId: "G-Y07DY6BK39",
};

// Kunci data yang akan disinkronkan antar admin
const SYNC_KEYS = [
  "pos_produk",
  "pos_riwayat",
  "pos_kategori",
  "pos_hutang",
  "pos_pengeluaran",
  "pos_admins",
];

// ── STATUS SYNC ─────────────────────────────────────────────
let syncEnabled = false;
let syncPaused = false;
let firebaseDB = null;
let syncListeners = {};

// ── INIT ────────────────────────────────────────────────────
function initSync() {
  if (typeof firebase === "undefined") {
    console.warn("[Sync] Firebase SDK belum dimuat.");
    showSyncBadge("offline");
    return;
  }

  // Cek apakah API Key masih bawaan (untuk keamanan)
  if (FIREBASE_CONFIG.apiKey.startsWith("GANTI_")) {
    showSyncBadge("unconfigured");
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    firebaseDB = firebase.database();
    syncEnabled = true;
    showSyncBadge("connecting");

    firebaseDB.ref(".info/connected").on("value", (snap) => {
      if (snap.val() === true) {
        showSyncBadge("online");
        bootstrapFirebaseData();
      } else {
        showSyncBadge("offline");
      }
    });

    SYNC_KEYS.forEach((key) => attachListener(key));
    console.log("[Sync] Firebase Sync aktif!");
  } catch (err) {
    console.error("[Sync] Gagal init Firebase:", err);
    showSyncBadge("error");
  }
}

async function bootstrapFirebaseData() {
  for (const key of SYNC_KEYS) {
    const snap = await firebaseDB.ref("store/" + key).once("value");
    if (!snap.exists()) {
      const localData = localStorage.getItem(key);
      if (localData) {
        await firebaseDB.ref("store/" + key).set(JSON.parse(localData));
      }
    }
  }
}

function attachListener(key) {
  if (syncListeners[key]) {
    firebaseDB.ref("store/" + key).off("value", syncListeners[key]);
  }
  syncListeners[key] = firebaseDB.ref("store/" + key).on("value", (snap) => {
    if (syncPaused) return;
    if (!snap.exists()) return;
    const remoteData = JSON.stringify(snap.val());
    const localData = localStorage.getItem(key);
    if (remoteData !== localData) {
      localStorage.setItem(key, remoteData);
      refreshPageUI(key);
      console.log(`[Sync] Data "${key}" diperbarui dari cloud.`);
    }
  });
}

async function pushToFirebase(key, data) {
  if (!syncEnabled || !firebaseDB) return;
  syncPaused = true;
  try {
    await firebaseDB
      .ref("store/" + key)
      .set(typeof data === "string" ? JSON.parse(data) : data);
  } catch (err) {
    console.error("[Sync] Gagal push:", key, err);
  } finally {
    syncPaused = false;
  }
}

const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
  _origSetItem(key, value);
  if (SYNC_KEYS.includes(key)) {
    pushToFirebase(key, value);
    showSyncBadge("syncing");
    setTimeout(() => showSyncBadge(syncEnabled ? "online" : "offline"), 1200);
  }
};

function showSyncBadge(status) {
  let badge = document.getElementById("syncStatusBadge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "syncStatusBadge";
    badge.style.cssText = `
      position:fixed; bottom:16px; right:16px; z-index:9999;
      display:flex; align-items:center; gap:6px;
      padding:6px 12px; border-radius:20px; font-size:12px;
      font-weight:600; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.15);
      transition:all .3s ease; user-select:none;
    `;
    document.body.appendChild(badge);
  }
  const states = {
    online: {
      bg: "#198754",
      text: "#fff",
      icon: "bi-cloud-check-fill",
      label: "Tersinkron",
    },
    syncing: {
      bg: "#0d6efd",
      text: "#fff",
      icon: "bi-cloud-arrow-up-fill",
      label: "Menyinkron...",
    },
    offline: {
      bg: "#6c757d",
      text: "#fff",
      icon: "bi-cloud-slash-fill",
      label: "Offline",
    },
    connecting: {
      bg: "#fd7e14",
      text: "#fff",
      icon: "bi-cloud-fill",
      label: "Menghubungkan...",
    },
    unconfigured: {
      bg: "#dc3545",
      text: "#fff",
      icon: "bi-cloud-x-fill",
      label: "Sync Belum Setup",
    },
    error: {
      bg: "#dc3545",
      text: "#fff",
      icon: "bi-exclamation-triangle-fill",
      label: "Error Sync",
    },
  };
  const s = states[status] || states.offline;
  badge.style.background = s.bg;
  badge.style.color = s.text;
  badge.innerHTML = `<i class="bi ${s.icon}"></i> ${s.label}`;
}

function refreshPageUI(key) {
  try {
    switch (key) {
      case "pos_produk":
        if (typeof renderProdukTable === "function") renderProdukTable();
        if (typeof renderProdukKasir === "function") renderProdukKasir("");
        break;
      case "pos_riwayat":
        if (typeof renderTabelRiwayat === "function") renderTabelRiwayat();
        break;
      case "pos_hutang":
        if (typeof renderTabelHutang === "function") renderTabelHutang();
        break;
      case "pos_pengeluaran":
        if (typeof renderTabelPengeluaran === "function")
          renderTabelPengeluaran();
        break;
    }
  } catch (e) {
    // Diabaikan jika fungsi render tidak ada di halaman ini
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSync);
} else {
  initSync();
}
