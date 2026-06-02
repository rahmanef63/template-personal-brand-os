# Panduan Pengguna — Personal Brand OS

Website "headless" yang kamu **miliki sepenuhnya**. Semua isi (tulisan, portfolio,
layanan, halaman) kamu kelola sendiri dari panel admin — tanpa sentuh kode.

Stack: Next.js 16 + Convex (database) + Vercel (hosting). Semua punya paket gratis.

---

## 1. Yang kamu butuhkan (semua gratis)

1. Akun **GitHub** — github.com
2. Akun **Vercel** — vercel.com (login pakai GitHub)
3. Akun **Convex** — convex.dev (login pakai GitHub)

Tidak perlu bisa coding.

---

## 2. Deploy (sekali setup, ±15 menit)

### a. Ambil kode
- Buka repo template di GitHub → klik **Use this template** → **Create a new
  repository**. Sekarang kamu punya salinan sendiri.

### b. Buat database Convex
1. Di convex.dev → **Create Project** → kasih nama (misal `website-saya`).
2. Convex kasih kamu **Deploy Key** (production). Simpan.
3. Convex juga kasih URL deployment, bentuknya `https://NAMA.convex.cloud`.

### c. Hubungkan ke Vercel
1. Di vercel.com → **Add New → Project** → pilih repo GitHub kamu.
2. Di **Environment Variables**, isi:
   | Nama | Nilai |
   |------|-------|
   | `NEXT_PUBLIC_CONVEX_URL` | `https://NAMA.convex.cloud` (dari Convex) |
   | `CONVEX_DEPLOY_KEY` | deploy key production dari Convex |
3. **Build Command** ganti jadi: `npx convex deploy --cmd 'npm run build'`
   (ini otomatis push database + build web sekaligus).
4. Klik **Deploy**. Tunggu sampai hijau.

> ⚠️ Pastikan `NEXT_PUBLIC_CONVEX_URL` **tidak ada spasi / enter** di ujungnya.
> URL yang kotor (ada `\n`) bikin homepage gagal load.

### d. Kunci pendaftaran admin (PENTING — keamanan)
Di Convex Dashboard → project kamu → **Settings → Environment Variables**, tambah:

| Nama | Nilai |
|------|-------|
| `ADMIN_SIGNUP_KEY` | kata sandi rahasia bebas (misal `kunci-rahasia-saya-2026`) |

Ini kunci yang harus dimasukkan saat **bikin akun admin pertama**. Tanpa kunci ini,
**tidak ada** orang asing yang bisa daftar jadi admin. (Lihat bagian Keamanan.)

### e. Isi data contoh (sekali saja)
Di komputer (atau Convex Dashboard → Functions), jalankan:
```
npx convex run seed:run
```
Ini ngisi contoh tulisan, portfolio, layanan, dan halaman depan biar website tidak kosong.

### f. Buat akun admin kamu
1. Buka `https://websitemu.vercel.app/admin`
2. Klik **"Belum punya akun? Daftar"**
3. Isi: Nama, **Setup key** (= `ADMIN_SIGNUP_KEY` yang kamu set tadi), Email, Password.
4. Selesai → masuk dashboard.

Selesai. Website live, kamu admin-nya.

---

## 3. Pakai panel admin

- `/admin` → dashboard. Kelola:
  - **Halaman depan** (landing sections)
  - **Blog** (tulisan)
  - **Portfolio**, **Layanan**, **Resources**
  - **Leads / komentar / subscriber**
- Upload gambar langsung (disimpan di Convex storage).
- **Dark / Light mode**: tombol di kanan atas navbar publik.

Semua perubahan langsung tersimpan di database kamu — tidak perlu deploy ulang.

---

## 4. Keamanan & akses admin (baca ini)

**Q: Kalau website ku publish, apa orang iseng bisa bikin akun admin sendiri?**
Tidak. Pendaftaran admin **dikunci server-side** oleh `ADMIN_SIGNUP_KEY`. Form daftar
minta "Setup key"; kalau salah → ditolak (`Pendaftaran admin ditutup`). Kunci itu
cuma ada di environment Convex kamu (privat) — pengunjung tidak pernah lihat.

**Q: Jadi alurnya gimana kalau aku mau kasih website ini ke orang lain?**
Dua model:

1. **Mereka clone sendiri** (paling aman & mandiri):
   Tiap orang pakai Convex + Vercel sendiri. Database terpisah total. Mereka set
   `ADMIN_SIGNUP_KEY` sendiri, daftar admin sendiri. Kamu tidak pegang apa-apa.

2. **Kamu yang onboard** (model "kasih pass sementara"):
   `ADMIN_SIGNUP_KEY` itu **berfungsi sebagai password sementara / token undangan**.
   - Kamu generate kunci, kasih ke user.
   - User buka `/admin` → Daftar → masukkan kunci → bikin akun + password sendiri.
   - Setelah itu, kalau mau, kamu/dia **ganti atau hapus** `ADMIN_SIGNUP_KEY` di
     Convex → pendaftaran tertutup, admin yang sudah ada tetap bisa login.
   Jadi kunci = "minta clone, dikasih pass sementara, dia set password sendiri" —
   persis seperti yang kamu mau, tanpa server tambahan.

**Reset / ganti password admin:**
- Mau tambah admin lagi → set ulang `ADMIN_SIGNUP_KEY`, daftar dengan kunci itu.
- Lupa password & belum ada email-reset → hapus user lewat Convex Dashboard
  (tabel `users` + `authAccounts`), lalu daftar ulang pakai setup key.
- (Opsional lanjutan: pasang email-reset Resend agar ada "lupa password" otomatis.)

**Catatan:** versi ini "siapa punya kunci = admin penuh". Belum ada peran/role
bertingkat (editor vs owner). Cukup untuk 1–beberapa admin tepercaya.

---

## 5. Update ke versi baru

Frontend tidak menyimpan data — semua data ada di Convex. Jadi update aman:
- Update lewat paket `rahman-shared` (komponen/util) ATAU re-clone template terbaru.
- Data Convex kamu tetap utuh; tidak ada migrasi kecuali ada perubahan skema.

---

## 6. Backup & restore

Lihat `_templates/BACKUP-RESTORE.md`. Intinya: ekspor data Convex sebagai snapshot
terstruktur (bukan CSV mentah) supaya bisa di-restore utuh.

---

## Ringkas variabel env

| Variabel | Di mana | Fungsi |
|----------|---------|--------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | alamat database (publik, aman) |
| `CONVEX_DEPLOY_KEY` | Vercel | deploy fungsi ke Convex prod saat build |
| `ADMIN_SIGNUP_KEY` | **Convex** (server-side) | kunci daftar admin — JANGAN bocor |
| `JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL` | Convex | tanda tangan login (auth) |
