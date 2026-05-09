# Panduan Cetak Bluetooth - Ming Mart POS

## Persyaratan Sistem

### Hardware:

- **Printer Thermal 80mm** dengan dukungan Bluetooth
- Printer yang kompatibel dengan protokol ESC/POS
- Device yang menerima sinyal Bluetooth (Android/Windows/Mac/Linux)

### Browser:

- **Google Chrome** (recommended)
- **Microsoft Edge**
- **Opera**
- ⚠️ Safari dan Firefox belum fully support Web Bluetooth API

### Koneksi:

- Printer sudah di-pair dengan device sebelumnya
- Printer dalam kondisi ON dan siap

## Cara Menggunakan

### Step 1: Selesaikan Transaksi

1. Tambahkan produk ke keranjang
2. Masukkan nama pembeli (optional)
3. Pilih metode pembayaran
4. Masukkan nominal pembayaran
5. Klik tombol "Konfirmasi Bayar"

### Step 2: Pilih Metode Cetak

Setelah transaksi berhasil, muncul dialog "Pilih Metode Cetak" dengan opsi:

- **📄 Simpan PDF** → Simpan struk ke file PDF
- **🖨️ Cetak Printer** → Cetak ke printer USB/Network
- **📱 Bluetooth** → Cetak ke printer Bluetooth
- **👁️ Lihat Struk** → Preview struk sebelum print
- **❌ Lewati** → Lewati pencetakan

### Step 3: Preview Struk (Recommended)

1. Klik tombol **"Lihat Struk"**
2. Lihat preview bagaimana struk akan tampil di printer
3. Periksa format, tata letak, dan data

### Step 4: Cetak Bluetooth

1. Klik tombol **"Bluetooth"**
2. Browser akan meminta izin akses Bluetooth
3. Pilih printer dari daftar yang tersedia
4. Tunggu pesan "Cetak Bluetooth berhasil!"
5. Printer akan otomatis memotong kertas

## Format Struk

Struk akan dicetak dengan format:

```
=====================================
          MING MART
Dusun Batu Menjangkong, Desa Anyar
  Kec. Bayan, Kab. Lombok Utara
=====================================
Pembeli.....................Nama Pembeli
Tanggal.....................DD/MM/YYYY HH:MM
Metode.....................Nama Metode
Kasir...........................Username
=====================================

[NAMA PRODUK]
[Qty] x Rp [Harga]........Rp [Subtotal]

[NAMA PRODUK 2]
[Qty] x Rp [Harga]........Rp [Subtotal]

=====================================
[DISKON - jika ada]
TOTAL              Rp [TOTAL AKHIR]
Bayar              Rp [NOMINAL BAYAR]
Kembali            Rp [KEMBALIAN]

Terima kasih telah berbelanja
      di MING MART!

* Simpan struk ini sebagai bukti pembelian *
=====================================
```

## Troubleshooting

### ❌ "Browser tidak support Bluetooth"

**Solusi:**

- Gunakan Chrome/Edge/Opera (bukan Safari/Firefox)
- Pastikan browser terbaru
- Enable Bluetooth di device

### ❌ "Mencari printer Bluetooth..." (stuck)

**Solusi:**

- Pastikan printer sudah di-pair dengan device
- Restart printer Bluetooth
- Restart aplikasi POS
- Pastikan Bluetooth device ON

### ❌ "Printer tidak kompatibel"

**Solusi:**

- Printer harus support ESC/POS protocol
- Printer harus support Bluetooth Serial (SPP)
- Update firmware printer jika tersedia
- Hubungi vendor printer untuk kompatibilitas

### ❌ Cetak terputus/gagal di tengah jalan

**Solusi:**

- Dekatkan device dengan printer
- Kurangi interference dari device lain
- Cek koneksi Bluetooth signal strength
- Coba lagi (sometimes flaky dengan BLE)

### ⚠️ Kertas tidak terpotong otomatis

**Solusi:**

- Beberapa printer memerlukan setting di control panel
- Konfigurasi auto-cut di menu printer
- Manual potong atau ubah setting printer

## Tips & Trik

✅ **Selalu preview** sebelum cetak production
✅ **Simpan juga PDF** untuk backup digital
✅ **Test Bluetooth** saat setup awal
✅ **Jaga printer tetap dekat** untuk signal lebih baik
✅ **Update browser** untuk better compatibility
✅ **Clear cache** jika ada issue aneh
✅ **Check kertas printer** sebelum transaksi besar

## Format Dukungan Printer

Printer yang tested & compatible:

- Xprinter XP-58II
- Xprinter XP-58IV
- EPSON TM-P20
- Star Micronics SM-L200
- Zebra MZ Series
- Dan printer thermal lain dengan support ESC/POS

## Support

Jika menemukan masalah:

1. Check error message di browser console (F12)
2. Lihat toast notification untuk detail
3. Coba preview terlebih dahulu
4. Screenshot error dan hubungi support

---

**Last Updated:** May 9, 2026  
**Version:** 1.0
