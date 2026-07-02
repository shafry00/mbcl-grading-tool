# Panduan Penilaian Final Project
## Mini Bootcamp Claude Playbook for Non-Tech Professional — Cohort 1
### Untuk Teaching Assistant

---

## Gambaran Singkat

Final Project dikumpulkan dalam **1 file** berisi deck 6 slide beserta live link prototype (PDF, DOCX, PPT, atau PPTX). Struktur deck mengikuti NextGen Builders Framework: See Clearly (Slide 1) → Imagine Boldly (Slide 2–3) → Ship Bravely (Slide 4–6). Total aspek yang dinilai: **5 aspek berbobot**, skor akhir skala **0–100**.

Untuk sertifikat, skor Final Project digabung dengan Assignment:

> **Skor Sertifikat** = (Skor Assignment /100 × 40%) + (Skor Final Project × 60%)
> Grading Tool Web menghitung ini otomatis di dashboard dan CSV export.

---

## Langkah 1 — Terima dan Simpan Submission

- [ ] Peserta kirim file via WhatsApp grup atau form
- [ ] Download file final project
- [ ] Rename file menjadi `final-project.[ext]`
- [ ] Pindahkan ke folder `submissions/[nama-peserta]/`
  - Contoh: `submissions/rina-kusumawati/final-project.pptx`
- [ ] Pastikan nama folder: huruf kecil semua, pakai dash, tanpa spasi

---

## Langkah 2 — Baca Submission dan Cek Live Link

Baca seluruh file dan pastikan kamu memahami:

- **See Clearly (Slide 1)** — apakah pain spesifik dan ada bukti nyata (observasi/data), bukan sekadar asumsi? Apakah peserta menunjukkan proses Sharpen (challenge hipotesis ke Claude)?
- **Imagine Boldly (Slide 2–3)** — apakah ada constraint yang tajam? Apakah proses Diverge (beberapa opsi) dan Converge (pilih satu + alasan) terlihat jelas?
- **Ship Bravely (Slide 4–6)** — apakah tools benar-benar di-deploy? Apakah user testing menghasilkan gap yang konkret? Apakah Iterate Fast mengevaluasi ulang pain conviction?
- **Live link prototype** — catat URL-nya

Kemudian **akses live link** secara manual:
- [ ] Link bisa dibuka?
- [ ] Fungsi utama yang dideskripsikan peserta benar-benar berjalan?
- [ ] Mobile-friendly (coba dari HP atau gunakan mode mobile di browser)?

Catat hasil cek live link — ini memengaruhi aspek terbesar (bobot 35%).

---

## Langkah 3 — Nilai dengan Claude Skill

Ada tiga cara — pilih yang paling mudah diakses:

### Opsi A: Claude Project (claude.ai) — Rekomendasi
1. Login ke **akun Claude demo BelajarLagi** di claude.ai
2. Masuk ke Project kelompokmu: **MBCL Grading — Kelompok [X]**
3. Klik **+ New Chat** di dalam Project
4. Upload file deck, lalu ketik:

```
Nilai submission final project dari [Nama Peserta]
```

Claude akan menghasilkan tabel skor berbobot dan feedback. Setelah live link dicek dan skor divalidasi, ketik:

```
Buat dokumen feedback lengkap. TA: [nama kamu]. Live link: [url prototype].
```

> Belum punya akses? Hubungi koordinator TA untuk info login akun demo BelajarLagi.

### Opsi B: Grading Tool Web
Buka **http://43.157.235.194:3456** di browser → klik **+ Nilai Submission** → upload file → isi nama peserta → pilih Final Project → klik Nilai.

Skor otomatis tersimpan di dashboard. Setelah divalidasi, klik **✨ Generate Feedback** untuk buat dokumen feedback lengkap yang bisa didownload sebagai DOCX.

### Opsi C: opencode (via aplikasi desktop / terminal)
1. Buat folder kerja, misalnya `grading-mbcl/`
2. Masukkan file deck peserta ke dalam folder tersebut
3. Buka folder di terminal atau aplikasi desktop Claude/opencode
4. Jalankan sesi opencode di folder tersebut
5. Ketik prompt berikut:

```
Gunakan rubrik dari MBCL 1 Skill Grading — System Prompt.md yang ada di folder ini, lalu nilai file [nama-file-deck] sebagai submission final project dari [Nama Peserta]
```

Setelah live link dicek (Langkah 2) dan skor divalidasi, lanjutkan di sesi yang sama:

```
Update skor Prototype ke [X] karena live link sudah dicek — [hasil cek singkat]. Lalu buat dokumen feedback lengkap. TA: [nama kamu]. Live link: [url prototype].
```

> Pastikan file `MBCL 1 Skill Grading — System Prompt.md` ikut disimpan di folder yang sama agar opencode bisa membacanya sebagai konteks.

---

## Langkah 4 — Validasi Hasil Penilaian

Setelah skor dihasilkan, **baca ulang dan validasi** sebelum dikirim ke peserta.

Fokus validasi:
- Skor Prototype — **wajib sesuaikan dengan hasil cek live link manual** (Langkah 2)
- Skor per aspek lain — sesuai dengan isi deck yang kamu baca?
- Perhitungan skor akhir — pastikan formula benar
- Feedback untuk peserta — spesifik dan bukan generik?
- Rekomendasi showcase — masuk akal berdasarkan kualitas keseluruhan?

Jika ada skor yang perlu disesuaikan (Opsi B):

```
Live link sudah dicek — bisa dibuka, fungsi utama jalan, tapi belum mobile-friendly. Update skor Prototype ke 3 dan sesuaikan feedbacknya.
```

---

## Rubrik Penilaian Final Project

**Skala per aspek: 1–4**

| Aspek | Bobot | Skor 1 | Skor 2 | Skor 3 | Skor 4 |
|---|---|---|---|---|---|
| **Prototype berfungsi** | 35% | Link tidak bisa dibuka | Bisa dibuka tapi tidak berfungsi | Fungsi utama berjalan tapi ada bug signifikan | Link aktif, fungsi utama berjalan lancar, mobile-friendly |
| **Relevansi masalah** | 25% | Masalah terlalu umum atau dibuat-buat, tidak ada bukti | Masalah nyata tapi tidak spesifik, tidak ada proses Sharpen | Masalah spesifik dari pekerjaan sehari-hari, ada observasi | Masalah spesifik + ada bukti nyata (data/kutipan) + hipotesis sudah di-challenge ke Claude |
| **Kualitas deck** | 20% | Slide tidak lengkap atau tidak mengikuti struktur See Clearly → Imagine Boldly → Ship Bravely | Lengkap tapi alur antar pilar tidak terhubung | Alur mengalir tapi proses Diverge/Converge atau Listen Deeply kurang terdokumentasi | Alur kuat: pain conviction → constraint → opsi solusi → pilihan dengan alasan → prototype → gap dari user testing → iterasi terhubung jelas |
| **Bukti iterasi** | 10% | Tidak ada proses Diverge/Converge — langsung ke satu solusi tanpa eksplorasi | Ada beberapa opsi tapi tidak jelas bagaimana dipilih | Converge terlihat tapi alasan pemilihan lemah, atau gap dari Listen Deeply tidak ditindaklanjuti | Diverge → Converge → Commit jelas: 5 opsi → pilih 1 dengan alasan kuat → commit ke feature list |
| **Listen & Iterate** | 10% | Tidak ada user testing (Listen Deeply) maupun perubahan (Iterate Fast) | Ada salah satu saja — feedback user ATAU 1 perubahan — tanpa kaitan jelas | Ada feedback user + 1 perubahan, tapi perubahan kurang nyambung ke feedback spesifik | Feedback user konkret (kebingungan 10 detik pertama) + 1 perubahan cepat yang langsung menjawabnya (idealnya ada before→after) |

### Formula Skor Akhir

```
Skor Akhir = (Skor Prototype × 35) + (Skor Relevansi × 25) +
             (Skor Deck × 20) + (Skor Iterasi × 10) + (Skor Listen & Iterate × 10)
             ÷ 4
```

### Interpretasi Skor Akhir

| Skor | Tingkat | Tindak Lanjut |
|---|---|---|
| 85–100 | **Luar Biasa** | Kandidat showcase |
| 70–84 | **Baik** | Selesaikan dengan baik |
| 55–69 | **Cukup** | Ada area yang perlu diperkuat |
| < 55 | **Perlu Bimbingan** | Prioritas asistensi |

---

## Langkah 5 — Tulis Feedback untuk Peserta

Gunakan **MBCL 1 Template Feedback Final Project** sebagai panduan format.

Struktur feedback yang disarankan:
1. **Apresiasi** — akui proses yang sudah dijalani peserta selama bootcamp
2. **Strength** — 1 kekuatan utama yang konkret dari submission
3. **Improvement** — 1 area yang bisa dikembangkan, dengan saran spesifik
4. **Next step** — 1 ide pengembangan tools ke depannya yang realistis
5. **Penutup** — kalimat penutup yang hangat

> **Hindari:** kalimat generik, feedback yang tidak merujuk ke konten submission spesifik peserta, atau kritik tanpa saran konstruktif.

---

## Langkah 6 — Seleksi Showcase

Untuk peserta dengan skor ≥ 85, pertimbangkan rekomendasi showcase berdasarkan:

- **Prototype paling fungsional** — tools yang benar-benar bisa dipakai, bukan demo
- **Pain conviction paling kuat** — masalah yang spesifik dan terdokumentasi dengan bukti
- **Proses iterasi paling jujur** — peserta yang menunjukkan Diverge/Converge dan merespons gap dari user testing

Catat rekomendasi di file hasil penilaian (`hasil-penilaian/[nama-peserta]-fp.md`).

---

## Langkah 7 — Simpan dan Kirim

- [ ] Pastikan hasil penilaian tersimpan di `hasil-penilaian/[nama-peserta]-fp.md`
- [ ] Kirim feedback ke peserta via WhatsApp atau channel yang disepakati
- [ ] Untuk peserta dengan tingkat **Perlu Bimbingan**: catat untuk prioritas asistensi
- [ ] Catat kandidat showcase untuk dibahas bersama tim

---

## Catatan Penting

**Live link adalah aspek terbesar (35%):** Jangan nilai hanya dari deskripsi peserta. Selalu cek sendiri.

**Jika live link tidak bisa diakses:** Cek dulu — mungkin link salah ketik atau butuh akses khusus. Jika setelah dicek manual benar-benar tidak bisa diakses → skor 1 untuk aspek Prototype.

**Validasi AI:** AI bisa salah membaca konteks. TA tetap punya keputusan akhir — skor bisa diedit manual kapanpun.

**Konsistensi:** Gunakan rubrik yang sama untuk semua peserta.

---

*Dokumen ini disiapkan untuk tim Teaching Assistant — Mini Bootcamp Claude Playbook for Non-Tech Professional, Cohort 1 by BelajarLagi*
*Kontak: info@belajarlagi.id*
