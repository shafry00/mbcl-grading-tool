# Panduan Penilaian Assignment
## Mini Bootcamp Claude Playbook for Non-Tech Professional — Cohort 1
### Untuk Teaching Assistant

---

## Gambaran Singkat

Assignment dikumpulkan dalam **1 file** (PDF, DOCX, PPT, atau PPTX). Mencakup dua bagian: identifikasi masalah dan eksplorasi Claude. Total aspek yang dinilai: **5 aspek**, masing-masing berskala 1–3. Skor maksimal: **15 poin**.

Untuk sertifikat, skor assignment dikonversi ke skala 0–100 lalu digabung dengan Final Project:

> **Skor Assignment /100** = (Skor Raw / 15) × 100
> **Skor Sertifikat** = (Skor Assignment /100 × 40%) + (Skor Final Project × 60%)

---

## Langkah 1 — Terima dan Simpan Submission

- [ ] Peserta kirim file via WhatsApp grup atau form
- [ ] Download file assignment
- [ ] Rename file menjadi `assignment.[ext]`
- [ ] Pindahkan ke folder `submissions/[nama-peserta]/`
  - Contoh: `submissions/rina-kusumawati/assignment.pdf`
- [ ] Pastikan nama folder: huruf kecil semua, pakai dash, tanpa spasi

---

## Langkah 2 — Baca Submission

Baca seluruh isi file sebelum mulai menilai. Perhatikan:

- Apakah masalah yang dipilih **spesifik dan memenuhi kriteria 3R**?
- Apakah ada **perbandingan nyata** antara Claude Chat biasa vs pakai Skill?
- Apakah **Claude Project** punya System Prompt yang spesifik?
- Apakah **Artifact** yang dibuat relevan untuk pekerjaan peserta?
- Bagaimana kualitas **refleksi** — konkret atau generik?

---

## Langkah 3 — Nilai dengan Claude Skill

Ada tiga cara — pilih yang paling mudah diakses:

### Opsi A: Claude Project (claude.ai) — Rekomendasi
1. Login ke **akun Claude demo BelajarLagi** di claude.ai
2. Masuk ke Project kelompokmu: **MBCL Grading — Kelompok [X]**
3. Klik **+ New Chat** di dalam Project
4. Upload file submission, lalu ketik:

```
Nilai submission assignment dari [Nama Peserta]
```

Claude akan langsung menghasilkan tabel skor dan feedback.

> Belum punya akses? Hubungi koordinator TA untuk info login akun demo BelajarLagi.

### Opsi B: Grading Tool Web
Buka **http://43.157.235.194:3456** di browser → klik **+ Nilai Submission** → upload file → isi nama peserta → pilih Assignment → klik Nilai.

Skor otomatis tersimpan di dashboard dan bisa di-export ke CSV.

### Opsi C: opencode (via aplikasi desktop / terminal)
1. Buat folder kerja, misalnya `grading-mbcl/`
2. Masukkan file submission peserta ke dalam folder tersebut
3. Buka folder di terminal atau aplikasi desktop Claude/opencode
4. Jalankan sesi opencode di folder tersebut
5. Ketik prompt berikut:

```
Gunakan rubrik dari MBCL 1 Skill Grading — System Prompt.md yang ada di folder ini, lalu nilai file [nama-file-submission] sebagai submission assignment dari [Nama Peserta]
```

> Pastikan file `MBCL 1 Skill Grading — System Prompt.md` ikut disimpan di folder yang sama agar opencode bisa membacanya sebagai konteks.

---

## Langkah 4 — Validasi Hasil Penilaian

Setelah skor dihasilkan, **baca ulang dan validasi** sebelum dikirim ke peserta.

Fokus validasi:
- Skor per aspek — apakah sesuai dengan isi submission yang kamu baca?
- Feedback untuk peserta — apakah spesifik ke konten submission, bukan generik?

Jika ada skor yang tidak tepat, minta Claude merevisi (Opsi B) atau edit manual di dashboard (Opsi A):

```
Skor Artifact sepertinya terlalu tinggi — promptnya generik. Turunkan ke 2 dan sesuaikan feedbacknya.
```

---

## Rubrik Penilaian Assignment

**Skala: 1 = Perlu Bimbingan · 2 = Cukup · 3 = Baik**

### Bagian 1 — Identifikasi Masalah

| Aspek | Skor 1 | Skor 2 | Skor 3 |
|---|---|---|---|
| **Identifikasi masalah** | Masalah terlalu umum atau tidak memenuhi kriteria 3R | Masalah spesifik tapi kriteria 3R tidak dijelaskan | Masalah spesifik, memenuhi minimal 2 dari 3 kriteria 3R dengan penjelasan yang jelas |

**Skor Bagian 1:** __ / 3

### Bagian 2 — Eksplorasi Claude

| Aspek | Skor 1 | Skor 2 | Skor 3 |
|---|---|---|---|
| **Perbandingan prompting** | Hanya satu cara dicoba, atau tidak ada perbedaan yang dicatat | Dua cara dicoba tapi perbedaan tidak dianalisis | Chat biasa vs Skill keduanya dicoba, ada perbedaan nyata yang dijelaskan |
| **Claude Project** | System Prompt generik — tidak ada peran, konteks, atau format spesifik | Ada salah satu dari tiga elemen | Mencakup peran Claude, konteks bisnis spesifik, dan format output yang diinginkan |
| **Refleksi** | "Claude sangat membantu" tanpa detail | Ada observasi tapi masih umum | Konkret — menyebut perbedaan output spesifik yang dirasakan antar cara |
| **Artifact** | Contoh generik yang bisa dipakai siapapun | Relevan tapi prompt tidak ditampilkan atau terlalu sederhana | Relevan untuk pekerjaan nyata, prompt terlihat spesifik ke konteks peserta |

**Skor Bagian 2:** __ / 12

**Bonus:** MCP Connector — alasan spesifik ke pekerjaan peserta (+1 maks)

---

## Interpretasi Skor Akhir

| Total Skor | Persentase | Tingkat |
|---|---|---|
| 12–15 | > 75% | **Baik** |
| 8–11 | 50–75% | **Cukup** |
| < 8 | < 50% | **Perlu Bimbingan** |

---

## Langkah 5 — Tulis Feedback untuk Peserta

Feedback yang dikirim ke peserta: **3–4 kalimat**, bahasa supportif, spesifik ke konten submission.

Struktur yang disarankan:
1. **Apresiasi** — akui usaha peserta
2. **Strength** — 1 hal terkuat yang konkret dari submissionnya
3. **Improvement** — 1 area yang bisa ditingkatkan, dengan saran spesifik
4. **Penutup** — semangat/dorongan

> **Hindari:** kalimat generik seperti "sudah bagus", "terus semangat", atau feedback yang bisa berlaku untuk siapapun.

---

## Langkah 6 — Simpan dan Kirim

- [ ] Pastikan hasil penilaian tersimpan di `hasil-penilaian/[nama-peserta]-assignment.md`
- [ ] Kirim feedback ke peserta via WhatsApp atau channel yang disepakati
- [ ] Untuk peserta dengan tingkat **Perlu Bimbingan**: catat untuk prioritas asistensi

---

## Catatan Penting

**Konsistensi:** Gunakan rubrik yang sama untuk semua peserta — jangan sesuaikan standar berdasarkan latar belakang atau effort peserta.

**MCP adalah bonus:** Jangan kurangi skor jika tidak dikerjakan — itu opsional.

**Validasi AI:** AI bisa salah membaca konteks. TA tetap punya keputusan akhir — skor bisa diedit manual kapanpun.

---

*Dokumen ini disiapkan untuk tim Teaching Assistant — Mini Bootcamp Claude Playbook for Non-Tech Professional, Cohort 1 by BelajarLagi*
*Kontak: info@belajarlagi.id*
