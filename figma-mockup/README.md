# Smart-Kos · Figma Mockup

9 halaman HTML mockup untuk smart-kos, siap di-import ke Figma sebagai design awal.

**Style**: Modern Minimalist · Navy Blue (`#0F172A`) · Accent Blue (`#2563EB`)
**Width**: 1440px (desktop)
**Font**: Inter (Google Fonts)

---

## 📁 Struktur File

```
figma-mockup/
├── index.html               ← navigator (buka di browser untuk preview semua)
├── styles.css               ← design system (warna, typography, komponen)
├── 01-landing.html          ← Landing page publik
├── 02-admin-dashboard.html  ← Dashboard pemilik kos
├── 03-admin-kamar.html      ← Kelola kamar (grid view)
├── 04-admin-penghuni.html   ← Tabel penghuni + filter
├── 05-admin-keluhan.html    ← Keluhan list + detail panel
├── 06-penghuni-dashboard.html ← Dashboard penghuni
├── 07-penghuni-lapor.html   ← Form lapor kerusakan
├── 08-penghuni-perpanjang.html ← Perpanjang sewa + bayar
└── 09-penghuni-profil.html  ← Profil + dokumen
```

---

## 🚀 Cara Import ke Figma

### Opsi 1 — Plugin `html.to.design` (paling mudah, recommended)

1. Buka Figma → File baru
2. Menu **Plugins** → **Find more plugins** → cari **"html.to.design"** → install
3. Run plugin: menu **Plugins** → **html.to.design**
4. Di plugin window:
   - Pilih **"Upload local file"**
   - Upload file `.html` dari folder ini (mulai dari `01-landing.html` misalnya)
   - Pastikan upload **`styles.css` juga** kalau diminta, atau plugin akan baca dari `<link>` tag otomatis
5. Plugin akan generate frame Figma dengan layer lengkap & editable

**Tip**: import satu file dulu, cek hasilnya, baru lanjut yang lain.

### Opsi 2 — Plugin `Figma to HTML, CSS, React & more!` (Builder.io)

Beberapa plugin lain yang bisa dicoba kalau html.to.design tidak cocok:
- **Anima** — convert HTML → Figma
- **Magic Import** — paste URL atau HTML

### Opsi 3 — Manual (kalau plugin tidak available)

1. Buka file HTML di browser (Chrome/Edge)
2. Screenshot full-page (Chrome: DevTools → ⋮ → "Capture full-size screenshot")
3. Drag screenshot ke Figma sebagai image reference
4. Recreate layer-nya di Figma berdasarkan screenshot

---

## 🎨 Design Tokens

Semua token ada di `styles.css` sebagai CSS variables. Highlights:

| Token | Value | Pakai untuk |
|---|---|---|
| `--primary` | `#0F172A` | Tombol primary, brand, text utama |
| `--accent` | `#2563EB` | Link, focus, highlight |
| `--bg` | `#FFFFFF` | Surface utama |
| `--bg-subtle` | `#F8FAFC` | Background section |
| `--border` | `#E2E8F0` | Garis pemisah |
| `--text` | `#0F172A` | Body text |
| `--text-muted` | `#475569` | Subtitle, helper text |
| Radius | 6 / 10 / 14 / 20px | Tombol → card → panel |
| Spacing | 4/8/12/16/24/32px | 4px base scale |

Saat recreate di Figma, set ini sebagai **Color Variables** dan **Effect Variables** biar konsisten.

---

## 📋 Catatan Design

- **Sidebar admin** vs **sidebar penghuni** punya menu berbeda — perhatikan saat di-import
- Halaman admin pakai **sidebar + topbar** layout standard SaaS
- Landing page pakai **container 1200px** dengan section padding 96-120px
- Semua emoji icon di mockup adalah **placeholder** — ganti dengan icon set proper di Figma (saran: Lucide, Heroicons, atau Phosphor)
- Foto / gambar pakai placeholder gradient — ganti dengan foto asli kamar/penghuni saat di Figma

---

## 🔄 Iterasi & Update

Kalau ada perubahan style/copy:

1. Edit file HTML/CSS di sini → preview di browser
2. Re-import ke Figma via plugin (replace frame lama)
3. Atau update langsung di Figma — file HTML ini cuma starting point

---

## ⚠️ Yang TIDAK Termasuk di Mockup Ini

- ❌ Halaman login/register/forgot-password (saya skip karena bukan core flow)
- ❌ Modal/dialog (toast, confirm, dll) — bisa di-add di Figma
- ❌ Empty state, loading state, error state — bisa di-derive dari state utama
- ❌ Halaman admin: laporan detail, verifikasi, pengaturan
- ❌ Halaman penghuni: pesan/chat thread, riwayat tagihan detail
- ❌ Mobile responsive — semua mockup di 1440px desktop only

Kalau butuh ditambahkan, tinggal request.
