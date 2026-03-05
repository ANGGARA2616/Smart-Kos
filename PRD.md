# Product Requirements Document (PRD) - SmartKos

## 1. Daftar Aktor
Sistem SmartKos dirancang untuk melayani tiga profil pengguna utama, yaitu:
1. **Calon Penghuni**: Pengguna publik atau pengguna terdaftar yang sedang mencari hunian kos, melihat ketersediaan kamar, dan melakukan proses pengajuan sewa kamar.
2. **Penghuni (Aktif)**: Pengguna yang sudah menyewa dan menempati kamar yang ingin mengelola tagihan, mengakses informasi kontrak/fasilitas, dan melakukan pelaporan masalah.
3. **Admin / Pemilik Kos**: Pengelola atau pemilik properti yang mengelola operasional harian kos, memantau pendapatan, memperbarui ketersediaan kamar, dan mengatur data penghuni.

---

## 2. Daftar Fitur Utama per Aktor

### A. Calon Penghuni
*   **Eksplorasi & Pencarian Kamar (Search & Filter)**: Mencari kamar berdasarkan lokasi, kota, atau nama universitas. Dilengkapi dengan filter terperinci seperti rentang harga, lokasi, fasilitas (WiFi, Kulkas, Dapur), dan tipe kamar (Standard, Deluxe, Executive).
*   **Katalog & Detail Kamar**: Melihat foto kamar, harga bulanan, ketersediaan, daftar fasilitas unggulan, lokasi di peta, dan ulasan penghuni. Terdapat tombol pemesanan ("Pesan Sekarang").
*   **Pelacakan Progres Pengajuan**: Dasbor untuk memantau status aplikasi pengajuan kamar secara transparan dengan tahapan: *Diajukan -> Ditinjau -> Diskusi -> Disetujui*.
*   **Klaim Diskon / Promo**: Banner interaktif untuk mengklaim tawaran khusus, misalnya "Diskon Pelajar".

### B. Penghuni (Aktif)
*   **Dasbor Utama (Home)**: Tampilan ringkas (Widget) yang menampilkan status tagihan, status kamar, form lapor cepat, pengumuman, dan kontak darurat.
*   **Manajemen Tagihan & Pembayaran**: Menampilkan blok khusus untuk "Tagihan Bulan Ini" lengkap dengan info jatuh tempo, biaya ekstra (air & listrik), dan kemudahan melakukan pembayaran langsung via tombol "Bayar Sekarang".
*   **Informasi Detail Kamar**: Mengakses data kamar yang disewa (Nomor & Tipe Kamar), mengecek *password* WiFi kamar, melihat aset fasilitas kamar, serta melihat dokumen kontrak sewa digital.
*   **Pelaporan Masalah (Ticketing System)**: Modul untuk melaporkan kendala (contoh: pipa air bocor, AC mati) dengan dropdown kategori masalah, level prioritas perbaikan, dan deskripsi detail.
*   **Papan Pengumuman**: Wadah bagi penghuni untuk membaca informasi atau pembaruan terbaru dari pengelola kos (contoh: jadwal pengendalian hama, perbaikan gerbang, dan acara BBQ komunitas).
*   **Kontak Darurat**: Akses kontak cepat (Telepon/WhatsApp) untuk *hotline* Pos Keamanan dan Pengelola Kos.

### C. Admin / Pemilik Kos
*   **Dasbor Analitik Bisnis**: Meninjau matriks kesehatan bisnis seperti Total Pendapatan, Tingkat Hunian (Occupancy Rate), dan jumlah Permintaan Perbaikan yang masih tertunda/baru. Termasuk grafik analitik pendapatan 6 bulan terakhir.
*   **Manajemen Kamar**: Menambah, mengedit, menghapus data kamar, dan mengelola foto kamar (CRUD kamar).
*   **Manajemen Penghuni**: Memverifikasi pengajuan sewa kamar dan mengelola data KTP calon penghuni.
*   **Generator Tagihan**: Membuat tagihan bulanan secara otomatis dan mencatat histori pembayaran penyewa.
*   **Pembuat Pengumuman**: Mengirim informasi penting yang akan tampil di Dasbor Penghuni.
*   **Log Aktivitas Terbaru (Live Feed)**: Memantau notifikasi operasional *real-time* seperti penghuni baru yang ditambahkan, konfirmasi pembayaran sewa yang diterima, tiket laporan kerusakan masuk, dan penghuni yang melakukan proses kelua/checkout.
*   **Ringkasan Status Kamar**: Pemantauan visual terhadap ketersediaan kamar pada hari ini (berlabel progres warna seperti *Terisi*, *Kosong*, atau sedang *Perbaikan*).

### D. Sistem Global
*   **Autentikasi Terpusat**: Fitur Login dan Register untuk berbagai tipe pengguna (multi-aktor).
*   **Lupa Password**: Mekanisme untuk memulihkan kata sandi akun.
*   **Role-Based Access Control (RBAC)**: Pembatasan hak akses halaman dan data berdasarkan peran pengguna (Admin/Penghuni/Calon Penghuni) untuk keamanan aplikasi.

---

## 3. Alur Navigasi Halaman

### A. Navigasi Landing Page & Calon Penghuni (Penjelajahan)
*   **[Beranda Utama / Landing Page]**
    *   Menu Utama: Beranda, Lokasi, Kamar, Fasilitas, Tentang Kami, Daftar, Masuk
*   **[Area Eksplorasi (Setelah Masuk/Daftar bagi Calon Penghuni)]**
    *   **Temukan Kamarmu** (Mesin pencari, Peta interaktif, Rekomendasi Kamar)
    *   **Pengajuan Saya** (Daftar & progres status pemesanan kamar)
    *   **Bantuan** (Pusat FAQ & Dukungan)

### B. Navigasi Penghuni (Aktif)
*   **Dasbor**: Layar utama portal penghuni meliputi rekap tagihan, pengumuman, dll.
*   **Kamar Saya**: Mengelola kamar saat ini, riwayat kontrak, hingga instruksi spesifik kamar.
*   **Tagihan**: Melihat riwayat pelunasan masa lalu dan mengunduh struk/invoice bukti pembayaran.
*   **Lapor Kerusakan**: Membuka halaman pusat layanan (helpdesk) untuk melacak status laporan teknisi.
*   **Keluar**: Logout / Akhiri Sesi.

### C. Navigasi Admin / Pemilik Kos
*   **Dasbor**: Tampilan pusat pengawasan metrik bisnis (Total pendapatan, hunian, dsb).
*   **Manajemen Kamar**: Halaman untuk merubah status fisik kamar (tersedia/penuh/rusak), memperbarui harga, hingga foto aset fasilitas.
*   **Data Penghuni**: Halaman registrasi penghuni baru, riwayat KTP, info kontak, dan jejak pembayaran.
*   **Pembayaran**: Validasi transfer manual, pembuatan invois otomatis, serta denda keterlambatan.
*   **Laporan Keuangan**: Tabel cashflow pemasukan sewa vs operasional/pemeliharaan untuk pembukuan.
*   **Pengaturan**: Penyesuaian profil admin, identitas kos, nomor rekening, dan aturan properti kos (kost rules).
*   **Keluar**: Logout / Akhiri Sesi.
