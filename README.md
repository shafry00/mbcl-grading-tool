# MBCL Grading Tool

AI-assisted grading tool built for **Mini Bootcamp Claude Playbook for Non-Tech Professional (MBCL) Cohort 1** by BelajarLagi. Dipakai oleh Teaching Assistant untuk menilai submission Assignment dan Final Project peserta secara konsisten dan cepat.

> ⚠️ **Baca bagian [Peringatan](#%EF%B8%8F-peringatan-penting) sebelum menggunakan repo ini.**

---

## Fitur

- **Parse submission otomatis** — upload PDF, DOCX, atau PPTX, teks diekstrak otomatis
- **AI grading** — rubrik dinilai oleh LLM berdasarkan bukti eksplisit di submission
- **Fallback provider** — primary: OpenCode Zen (Big Pickle), fallback: NVIDIA NIM (Kimi K2.6)
- **Dashboard rekap** — lihat semua sesi grading, filter per tipe, hitung skor sertifikasi gabungan
- **Generate feedback** — feedback per aspek otomatis diformat siap kirim ke peserta
- **Export DOCX** — feedback diekspor ke file .docx dengan template

---

## Tech Stack

| Layer | Library |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Express (Node 22) |
| PDF parsing | pdfjs-dist |
| DOCX export | docx, mammoth |
| AI | OpenCode Zen API / NVIDIA NIM API |
| Deploy | Docker + docker-compose |

---

## Struktur Rubrik

### Assignment (skala 1–3 per aspek)

| Aspek | Bobot |
|---|---|
| Identifikasi Masalah (3R Framework) | kriteria utama |
| Perbandingan Prompting | kriteria utama |
| Claude Project (System Prompt) | kriteria utama |
| Refleksi | kriteria utama |
| Artifact | kriteria utama |
| Bonus: MCP Connector | +1 bonus |

**Formula:** `min(100, round((raw + bonus) / 15 × 100))`

### Final Project (skala 1–4, berbobot)

| Aspek | Bobot |
|---|---|
| Prototype Berfungsi | 35% |
| Relevansi Masalah | 25% |
| Kualitas Deck | 20% |
| Bukti Iterasi (Diverge→Converge→Commit) | 10% |
| Listen & Iterate | 10% |

**Formula:** `round((P×35 + R×25 + D×20 + I×10 + L×10) / 4)`

### Skor Sertifikasi Gabungan

```
Skor Sertifikasi = Assignment × 40% + Final Project × 60%
```

---

## Cara Jalankan Lokal (Dev)

```bash
# Clone repo
git clone https://github.com/shafry00/mbcl-grading-tool.git
cd mbcl-grading-tool

# Install dependencies
npm install

# Buat file .env.local
cp .env.local.example .env.local
# Edit .env.local — isi VITE_OPENCODE_API_KEY atau ganti provider

# Jalankan dev server
npm run dev
```

> Dev mode: frontend memanggil AI API langsung dari browser (via `VITE_OPENCODE_API_KEY`).

---

## Cara Deploy dengan Docker

```bash
# Buat file .env.docker
cp .env.docker.example .env.docker
# Edit .env.docker — isi API key yang sesuai

# Build dan jalankan
docker compose up -d --build

# Tool berjalan di port 3456
# http://localhost:3456
```

> Prod mode: semua request AI melewati Express server (`server.js`) — API key tidak terekspos ke browser.

---

## Cara Adaptasi untuk Bootcamp Lain

Bagian yang perlu diubah jika ingin menggunakan untuk bootcamp lain:

| File | Yang perlu diubah |
|---|---|
| `src/lib/rubrics.js` | Definisi rubrik, aspek, bobot, dan level kelulusan |
| `src/lib/api.js` | System prompt untuk AI grader + template feedback peserta |
| `src/components/LoginScreen.jsx` | Password login (saat ini hardcoded — ganti ke env var) |
| `src/components/SettingsModal.jsx` | Konfigurasi provider AI dan model |
| `public/docs/` | Dokumen panduan yang ditampilkan di modal panduan |

---

## ⚠️ Peringatan Penting

**Repo ini adalah referensi, bukan template siap pakai.**

Ada beberapa hal yang perlu diperhatikan sebelum menggunakan:

1. **Konfigurasi VPS dan Docker spesifik untuk deployment BelajarLagi** — port, environment, dan setup server di repo ini disesuaikan dengan infrastruktur spesifik. Jangan di-deploy langsung tanpa menyesuaikan konfigurasi.

2. **API provider spesifik** — tool ini menggunakan OpenCode Zen (Big Pickle) sebagai primary dan NVIDIA NIM (Kimi K2.6) sebagai fallback. Kamu perlu akun dan API key sendiri, atau ganti provider di `server.js` dan `src/lib/api.js`.

3. **Rubrik sangat spesifik ke MBCL Cohort 1** — aspek, deskriptor, bobot, dan prompt AI semuanya dikalibrasi untuk kurikulum MBCL. Untuk bootcamp lain, rubrik perlu ditulis ulang dari awal.

4. **Login tidak production-grade** — sistem login saat ini menggunakan password sederhana yang cocok untuk internal tool, bukan untuk produk publik.

5. **Data peserta tidak disimpan di server** — semua sesi grading disimpan di `localStorage` browser. Tidak ada database. Cocok untuk penggunaan TA per sesi, tapi tidak untuk multi-user atau persistensi jangka panjang.

**Gunakan repo ini sebagai referensi arsitektur dan pendekatan, lalu bangun tool baru yang sesuai kebutuhan spesifik bootcamp atau program kamu.**

---

## Lisensi

Repo ini bersifat privat dan untuk keperluan internal BelajarLagi. Jangan didistribusikan tanpa izin.
