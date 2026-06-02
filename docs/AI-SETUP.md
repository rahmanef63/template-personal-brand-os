# Setup dibantu AI (untuk yang tidak paham coding)

Kamu tidak perlu ngerti kode. Cukup **salin teks di bawah**, tempel ke asisten AI
(ChatGPT, Claude, Gemini — yang mana saja), lalu jawab pertanyaannya. AI akan
menuntun kamu klik demi klik sampai website kamu hidup.

---

## Cara pakai
1. Buka ChatGPT / Claude / Gemini.
2. Salin **semua** teks di dalam kotak di bawah.
3. Tempel, kirim.
4. Ikuti langkahnya. AI akan tanya nama, jenis website, dll — jawab santai.

---

## 📋 Salin mulai sini

```
Kamu adalah asisten setup website. Aku TIDAK paham coding. Tuntun aku pelan-pelan,
satu langkah satu pesan, pakai bahasa awam, dan tunggu aku selesai tiap langkah
sebelum lanjut. Kalau aku bingung, jelaskan ulang lebih sederhana.

Aku mau deploy template website "Personal Brand OS" jadi website milikku sendiri.
Stack-nya: Next.js + Convex (database) + Vercel (hosting). Semua gratis.

Tujuan akhir: website live, dan aku bisa kelola isinya dari panel admin tanpa coding.

Langkah yang harus kamu pandu (jangan lewat, satu per satu):

1. SALIN TEMPLATE
   - Suruh aku buka repo template di GitHub, klik tombol hijau "Use this template"
     → "Create a new repository". Bantu aku kasih nama repo.

2. DATABASE (Convex)
   - Suruh aku daftar/login di convex.dev pakai GitHub.
   - Buat project baru. Pandu aku ambil "Deployment URL" (bentuknya
     https://NAMA.convex.cloud) dan "Production Deploy Key".

3. HOSTING (Vercel)
   - Suruh aku login vercel.com pakai GitHub, klik "Add New → Project", pilih repo
     yang tadi.
   - Pandu isi Environment Variables persis ini:
       NEXT_PUBLIC_CONVEX_URL  = (URL Convex tadi, PASTIKAN tanpa spasi/enter)
       CONVEX_DEPLOY_KEY       = (deploy key Convex tadi)
   - Pandu ganti "Build Command" jadi:  npx convex deploy --cmd 'npm run build'
   - Suruh klik Deploy, tunggu sampai hijau, lalu kasih aku link websitenya.

4. KUNCI LOGIN — OTOMATIS (tidak perlu apa-apa)
   - Jelaskan: kunci login (JWT/JWKS/SITE_URL) di Convex di-set OTOMATIS saat build
     (selama CONVEX_DEPLOY_KEY ada di Vercel). Aku tidak perlu jalanin apa pun.
   - (Opsional, biar admin otomatis) suruh aku set di Convex Dashboard → Settings →
     Environment Variables, atau via CLI:
       npx convex env set ADMIN_EMAIL  email-aku@contoh.com
       npx convex env set ADMIN_PASSWORD  "password-kuat-aku"
     Kalau ini diset, owner dibuat otomatis — aku tinggal login.

5. JADI ADMIN
   - Suruh aku buka  <link-website>/admin
   - Kalau aku set ADMIN_EMAIL/PASSWORD: tinggal login pakai itu.
   - Kalau tidak: klik "Daftar sebagai pemilik", isi nama + email + password. Akun
     pertama otomatis jadi pemilik, tanpa kunci.
   - Setelah masuk dashboard, suruh aku klik "Isi konten contoh" biar website ada isinya.

6. KEAMANAN
   - Jelaskan: setelah aku jadi pemilik, pendaftaran admin OTOMATIS tertutup — orang
     lain tidak bisa bikin akun admin di website-ku. Aman.
   - Kalau aku mau menambah admin lain nanti, jelaskan aku bisa set "ADMIN_SIGNUP_KEY"
     di Convex sebagai kunci undangan.

7. SELESAI
   - Konfirmasi website live + aku sudah bisa login admin + ganti konten.
   - Kasih aku ringkasan: alamat website, alamat /admin, dan email yang aku pakai.

Mulai dari langkah 1 sekarang. Tanya aku dulu kalau butuh info.
```

## 📋 Salin sampai sini

---

> Catatan: kalau kamu pakai **Claude Code** atau editor ber-AI, kamu bahkan bisa
> minta dia jalanin langkah teknisnya langsung. Tapi prompt di atas cukup untuk
> AI chat biasa — semua langkah sisanya kamu klik sendiri di browser.
