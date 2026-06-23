# SmartKos

**SmartKos** adalah aplikasi web manajemen kos (rumah indekos) yang menyatukan proses pencarian kamar, pemesanan, pembayaran, verifikasi, hingga pengelolaan penghuni dan keluhan fasilitas dalam satu sistem. Aplikasi ini menggantikan pencatatan manual berbasis buku/spreadsheet dengan alur digital yang dapat diakses calon penghuni, penghuni, dan admin pengelola.

> Dibangun dengan Next.js 16 (App Router) + PostgreSQL (Prisma) + Supabase Storage.

---

## ✨ Fitur Utama

Aplikasi memiliki tiga aktor: **Calon Penghuni**, **Penghuni**, dan **Admin**.

### Publik / Landing Page
- Halaman utama dinamis (judul hero, foto slider, deskripsi, alamat, kontak, peta Google Maps) yang kontennya diatur dari panel admin.
- Katalog kamar yang masih kosong beserta harga dan fasilitas.
- Bagian fasilitas unggulan, lokasi, testimoni, dan FAQ.

### Calon Penghuni
- Registrasi & login akun.
- Melihat katalog kamar kosong.
- Memesan kamar: memilih durasi sewa, melihat instruksi pembayaran (transfer bank / QRIS), dan mengunggah bukti transfer.
- Memantau status pesanan (menunggu verifikasi / disetujui / ditolak) dari dashboard.

### Penghuni (calon penghuni yang pesanannya disetujui)
- Melihat informasi kamar dan masa sewa (tanggal masuk & tanggal berakhir).
- Mengajukan perpanjangan sewa (sisa hari yang belum habis tidak hangus).
- Melaporkan kerusakan/keluhan fasilitas beserta foto kendala.
- Mengelola profil (ubah nama, nomor HP) dan mengganti password.

### Admin
- **Dasbor**: ringkasan okupansi kamar, keluhan terbaru, pembayaran/pemesanan terbaru, dan denah status kamar.
- **Manajemen Kamar**: tambah, ubah, dan hapus kamar (nomor, tipe, harga, fasilitas, status, foto).
- **Data Penghuni**: melihat, menambah penghuni secara manual, dan menghapus penghuni.
- **Verifikasi Pembayaran**: menyetujui atau menolak pesanan; persetujuan otomatis menghitung tanggal berakhir sewa, mengubah status kamar menjadi terisi, dan mengaktifkan akun penghuni.
- **Keluhan Fasilitas**: memperbarui status tiket keluhan (Open → Proses → Selesai).
- **Laporan Keuangan**: total pendapatan bulan ini & keseluruhan, perbandingan dengan bulan sebelumnya, serta riwayat transaksi yang disetujui.
- **Pengaturan**: mengatur profil kost, konten landing page, foto hero, info rekening pembayaran, QRIS, dan logo.
- Notifikasi email otomatis ke admin (via Resend) setiap ada pesanan & bukti pembayaran baru.

---

## 🧱 Teknologi

| Kategori | Teknologi |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| Bahasa | TypeScript 5, React 19 |
| Database | PostgreSQL + [Prisma ORM 7](https://www.prisma.io) (adapter `@prisma/adapter-pg`) |
| Penyimpanan File | [Supabase Storage](https://supabase.com) (bucket `uploads`) |
| Autentikasi | JWT (`jose`) via cookie `HttpOnly` + `bcryptjs` |
| Email | [Resend](https://resend.com) |
| UI | Tailwind CSS 4, `lucide-react`, Material Symbols, `sonner` (toast) |

---

## 📋 Prasyarat

- **Node.js** 18 atau lebih baru + npm
- **Database PostgreSQL** (lokal atau hosting seperti Supabase/Neon)
- Akun **Supabase** (untuk penyimpanan file) dengan bucket publik bernama `uploads`
- API key **Resend** (opsional — hanya untuk notifikasi email; aplikasi tetap jalan tanpa ini)

---

## 🚀 Instalasi & Menjalankan

```bash
# 1. Install dependencies (otomatis menjalankan `prisma generate`)
npm install

# 2. Siapkan environment variables (lihat bagian di bawah)
#    Buat file .env di root proyek

# 3. Sinkronkan skema ke database PostgreSQL
npx prisma db push

# 4. (Opsional) Isi data contoh 3 kamar
npx prisma db seed

# 5. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Skrip yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Build produksi (menjalankan `prisma generate` lebih dulu) |
| `npm start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan ESLint |

---

## 🔐 Environment Variables

Buat file `.env` di root proyek dengan variabel berikut. **Jangan pernah commit file `.env`** (sudah masuk `.gitignore`).

| Variabel | Wajib | Keterangan |
|----------|:-----:|------------|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL |
| `JWT_SECRET` | ✅ | Kunci rahasia untuk menandatangani sesi JWT |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key Supabase (untuk upload file) |
| `RESEND_API_KEY` | ⬜ | API key Resend untuk notifikasi email |
| `ADMIN_EMAIL` | ⬜ | Email penerima notifikasi (bisa banyak, dipisah koma) |

> Tanpa `RESEND_API_KEY`, fitur lain tetap berfungsi — hanya notifikasi email yang dilewati.

---

## 👤 Membuat Akun Admin

Registrasi default membuat akun sebagai **calon penghuni** (`role = USER`). Untuk membuat admin pertama, ubah `role` salah satu user menjadi `ADMIN` langsung di database — cara termudah lewat Prisma Studio:

```bash
npx prisma studio
```

Buka tabel **User**, pilih akun yang diinginkan, lalu ubah kolom `role` menjadi `ADMIN`. Setelah login ulang, akun tersebut akan diarahkan ke panel admin (`/admin`).

---

## 📁 Struktur Proyek

```
smart-kos/
├── app/                      # Routing & halaman (Next.js App Router)
│   ├── (auth)/               # Login & registrasi
│   ├── admin/                # Panel admin (kamar, penghuni, verifikasi,
│   │                         #   keluhan, laporan, pengaturan)
│   ├── dashboard/            # Dashboard penghuni (pesan, perpanjang,
│   │                         #   lapor-kerusakan, profil)
│   ├── actions.ts            # Server action global (logout)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page publik
├── components/               # Komponen React (ui, admin, dashboard, layout)
├── lib/                      # Utilitas inti
│   ├── auth.ts               # Sesi JWT
│   ├── prisma.ts             # Prisma client
│   ├── email.ts              # Notifikasi email (Resend)
│   └── supabase-storage.ts   # Upload file ke Supabase
├── prisma/
│   ├── schema.prisma         # Skema database
│   └── seed.ts               # Data contoh
└── public/                   # Aset statis & manual pengguna (PDF)
```

### Model Data

`User`, `Kamar`, `Booking`, `Transaksi`, `Tiket`, dan `KostProfile` — lihat detail lengkap di [`prisma/schema.prisma`](prisma/schema.prisma).

---
