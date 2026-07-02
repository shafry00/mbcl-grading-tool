const IS_PROD = import.meta.env.PROD;

function extractJSON(text) {
  // Try as-is and with prefixed { (for assistant-prefill responses)
  const candidates = [text.trim(), '{' + text.trim()];
  for (const c of candidates) {
    try { return JSON.parse(c); } catch {}
    const md = c.match(/```(?:json)?\s*([\s\S]*?)```/s);
    if (md) { try { return JSON.parse(md[1].trim()); } catch {} }
  }
  // Find first { in original text
  const start = text.indexOf('{');
  if (start !== -1) {
    try { return JSON.parse(text.slice(start)); } catch {}
    const end = text.lastIndexOf('}');
    if (end > start) {
      try { return JSON.parse(text.slice(start, end + 1)); } catch {}
    }
  }
  return null;
}

function buildAssignmentPrompt(text, hasImages) {
  const context = hasImages
    ? 'Gambar terlampir adalah halaman submission asli — analisis visual DAN teks di bawah.'
    : 'Analisis teks submission di bawah.';

  return `IMPORTANT: Your entire response must be ONLY a valid JSON object. No explanation, no markdown, no text before or after the JSON.

Nilai submission assignment MBCL Cohort 1. ${context}

ATURAN: Skor HANYA dari bukti eksplisit di submission. Tidak ada bukti = skor 1. Jika bukan assignment MBCL = semua skor 1. Feedback wajib sebut elemen spesifik.

RUBRIK (skala 1-3):
identifikasi_masalah: 1=masalah umum/tidak ada 3R, 2=spesifik tapi 3R tidak dijelaskan, 3=spesifik + min 2 dari 3 kriteria 3R (Repetitive/Resource-heavy/Rule-based) dijelaskan
perbandingan_prompting: 1=hanya 1 cara/tidak ada perbandingan, 2=2 cara tapi tidak dianalisis, 3=chat biasa vs Skill/Project + perbedaan output konkret
claude_project: 1=tidak ada/generik, 2=ada 1 elemen saja, 3=System Prompt lengkap (peran+konteks bisnis+format output)
refleksi: 1=tidak ada/generik, 2=observasi ada tapi umum, 3=konkret sebutkan perbedaan output spesifik antar cara
artifact: 1=tidak ada/generik, 2=relevan tapi prompt tidak ada/sederhana, 3=relevan ke pekerjaan nyata peserta + prompt spesifik
mcp_bonus: 0=tidak ada/generik, 1=pilih MCP Connector + alasan spesifik ke pekerjaan

SUBMISSION:
${text}

Respond with ONLY this JSON (replace values, no other text):
{"criteria":{"identifikasi_masalah":{"score":0,"feedback":""},"perbandingan_prompting":{"score":0,"feedback":""},"claude_project":{"score":0,"feedback":""},"refleksi":{"score":0,"feedback":""},"artifact":{"score":0,"feedback":""},"mcp_bonus":{"score":0,"feedback":""}},"total_score":0,"level":"","feedback_peserta":"","catatan_ta":""}`;
}

function buildFinalProjectPrompt(text, hasImages) {
  const context = hasImages
    ? 'Gambar terlampir adalah slide deck submission asli — analisis visual DAN teks di bawah. Nilai aspek prototype dari deskripsi/screenshot di deck.'
    : 'Analisis teks submission di bawah.';

  return `IMPORTANT: Your entire response must be ONLY a valid JSON object. No explanation, no markdown, no text before or after the JSON.

Nilai submission final project MBCL Cohort 1. ${context}

ATURAN: Skor HANYA dari bukti eksplisit di submission. Tidak ada bukti = skor 1. Jika bukan final project MBCL = semua skor 1.

PENTING — PROTOTYPE: Server sudah mencoba membuka link live dan hasilnya ada di pesan "HASIL PENGECEKAN LINK LIVE OLEH SERVER". BACA SELURUH ISI HALAMAN yang diberikan (bisa panjang) — jangan hanya baca bagian awal.
- Jika status LINK TIDAK BISA DIBUKA, atau tidak ada link sama sekali → prototype skor 1, feedback: "Link prototype belum bisa diakses, mohon dicek kembali."
- Jika status LINK BISA DIBUKA → nilai prototype dari keseluruhan isi halaman (judul, fitur, teks UI, alur) digabung deskripsi/screenshot di deck. Jangan beri skor 1 kalau link terbukti bisa dibuka.
- LARANGAN: jangan pernah menulis istilah teknis seperti "HTTP 200", "REACHABLE", "status code", atau "server" di feedback peserta. Tulis natural dan ramah, mis. "Prototype kamu bisa diakses dan menampilkan ...".

RUBRIK (skala 1-4):
prototype(35%): 1=tidak ada link ATAU link tidak bisa dibuka server, 2=link reachable tapi konten statis/tidak ada fungsi, 3=fungsi utama terlihat jalan+ada indikasi bug/keterbatasan, 4=link aktif+konten lengkap+mobile-friendly
relevansi_masalah(25%): 1=tidak ada/sangat umum, 2=nyata tapi tidak spesifik/tidak ada Sharpen ke Claude, 3=spesifik+observasi konkret, 4=spesifik+bukti nyata+hipotesis di-challenge ke Claude
kualitas_deck(20%): 1=tidak ada/tidak lengkap, 2=lengkap tapi alur tidak terhubung, 3=alur mengalir tapi Diverge/Converge kurang, 4=alur kuat: pain→constraint→opsi→pilihan+alasan→prototype→gap→iterasi
bukti_iterasi(10%): 1=tidak ada Diverge/Converge, 2=ada opsi tapi cara pilih tidak jelas, 3=Converge ada tapi alasan lemah/gap tidak ditindaklanjuti, 4=Diverge→Converge→Commit+gap direspons di Slide 6
refleksi(10%) [aspek Listen & Iterate, dinilai dari slide Listen Deeply + Iterate Fast — BUKAN slide berjudul "Refleksi"]: 1=tidak ada user testing maupun perubahan, 2=ada salah satu saja (feedback user ATAU 1 perubahan), 3=ada feedback user + 1 perubahan tapi kurang nyambung, 4=feedback user konkret (kebingungan 10 detik pertama) + 1 perubahan cepat yang langsung menjawabnya (before→after)

SUBMISSION:
${text}

Respond with ONLY this JSON (replace values, no other text):
{"criteria":{"prototype":{"score":0,"feedback":""},"relevansi_masalah":{"score":0,"feedback":""},"kualitas_deck":{"score":0,"feedback":""},"bukti_iterasi":{"score":0,"feedback":""},"refleksi":{"score":0,"feedback":""}},"skor_akhir":0,"level":"","rekomendasi_showcase":false,"feedback_peserta":"","catatan_ta":""}`;
}

const DEV_API_KEY = import.meta.env.VITE_OPENCODE_API_KEY || '';
const DEV_BASE_URL = 'https://opencode.ai/zen/v1/chat/completions';
const MODEL = import.meta.env.VITE_MODEL || 'big-pickle';

export async function generateFeedbackDoc({ session, taName, liveLink }) {
  const c = session.criteria || {};
  const rows = [
    { label: 'Prototype berfungsi', id: 'prototype', weight: 35 },
    { label: 'Relevansi masalah', id: 'relevansi_masalah', weight: 25 },
    { label: 'Kualitas deck', id: 'kualitas_deck', weight: 20 },
    { label: 'Bukti iterasi', id: 'bukti_iterasi', weight: 10 },
    { label: 'Listen & Iterate', id: 'refleksi', weight: 10 },
  ];

  const tableRows = rows.map((r, i) => {
    const score = c[r.id]?.score || 0;
    const weighted = ((score * r.weight) / 4).toFixed(2);
    const fb = c[r.id]?.feedback || '(tidak ada feedback dari AI)';
    return `| ${i + 1} | ${r.label} | ${r.weight}% | ${score} | ${weighted} |
Feedback AI: ${fb}`;
  }).join('\n');

  const levelNote = session.totalScore >= 85
    ? 'Hasil Baik — kandidat showcase'
    : session.totalScore >= 70
    ? 'Hasil Baik'
    : session.totalScore >= 55
    ? 'Hasil Cukup — ada area yang perlu diperkuat'
    : 'Perlu Bimbingan';

  const prompt = `Kamu adalah Teaching Assistant untuk "Mini Bootcamp Claude Playbook for Non-Tech Professional" (MBCL Cohort 1) by BelajarLagi.

Tugas: Buat dokumen feedback final project lengkap untuk peserta bernama "${session.peserta}", ditulis oleh TA bernama "${taName}".

DATA PENILAIAN:
- Skor Akhir: ${session.totalScore}/100
- Tingkat: ${session.level} (${levelNote})
- Live Link: ${liveLink || 'tidak dicantumkan'}
- Rekomendasi Showcase: ${session.rekomendasiShowcase ? 'Ya' : 'Tidak'}

SKOR DAN FEEDBACK AI PER ASPEK:
${tableRows}

INSTRUKSI FORMAT:
Tulis dokumen mengikuti template ini persis (ganti semua placeholder [...]). Gunakan bahasa Indonesia yang hangat, personal, dan supportif. Feedback per aspek harus spesifik ke konten submission — bukan generik. JANGAN cantumkan istilah teknis seperti "HTTP 200", "status code", "REACHABLE", atau "server" — tulis natural (mis. "prototype bisa diakses").

---

# Feedback Final Project
**Final Project — Mini Bootcamp Claude Playbook for Non-Tech Professional, Cohort 1**

---

**Student :** ${session.peserta}
**Teaching Assistant :** ${taName}
**Link Final Project :** ${liveLink || '-'}

---

## A. Tabel Penilaian

| No | Aspek Penilaian | Bobot | Skor (1–4) | Skor Berbobot |
|---|---|---|---|---|
| 1 | Prototype berfungsi | 35% | [skor] | [berbobot] |
| 2 | Relevansi masalah | 25% | [skor] | [berbobot] |
| 3 | Kualitas deck | 20% | [skor] | [berbobot] |
| 4 | Bukti iterasi | 10% | [skor] | [berbobot] |
| 5 | Listen & Iterate | 10% | [skor] | [berbobot] |

**Skor Akhir** = (Skor Prototype × 35 + Skor Relevansi × 25 + Skor Deck × 20 + Skor Iterasi × 10 + Skor Listen&Iterate × 10) ÷ 4

| | |
|---|---|
| **Skor Akhir** | ${session.totalScore} / 100 |
| **Tingkat** | ${session.level} |
| **Rekomendasi Showcase Day 7** | ${session.rekomendasiShowcase ? 'Ya' : 'Tidak'} |

---

Hai Kak ${session.peserta}! Terima kasih banyak ya Kak, karena sudah meluangkan waktu dan energi untuk menyelesaikan Final Project ini di tengah kesibukan Kakak. Kami sangat mengapresiasi semangat dan konsistensi Kakak selama bootcamp ini. Keep up the good work!

Berikut feedback terkait pengerjaan final project yang telah dikumpulkan.

---

## B. Feedback Per Aspek

### 1. Prototype Berfungsi

> [Tulis 2-3 kalimat spesifik tentang kondisi live link — apakah bisa diakses, fungsi utama berjalan, mobile-friendly. Gunakan feedback AI sebagai referensi tapi tulis ulang dengan gaya TA]

### 2. Relevansi Masalah

> [Tulis 2-3 kalimat spesifik tentang seberapa nyata dan spesifik masalah yang dipilih peserta. Sebutkan detail konkret dari submission]

### 3. Kualitas Deck

> [Tulis 2-3 kalimat tentang kelengkapan dan alur 6 slide. Sebutkan apakah koneksi antar slide kuat atau ada yang terputus]

### 4. Bukti Iterasi

> [Tulis 2-3 kalimat tentang bukti proses Diverge-Converge dan respons terhadap user testing]

### 5. Listen & Iterate

> [Tulis 2-3 kalimat tentang user testing (Listen Deeply) dan 1 perubahan cepat yang dilakukan (Iterate Fast) — apakah perubahannya nyambung dengan feedback user]

---

## C. Ringkasan Feedback

| Bagian Feedback | Fokus |
|---|---|
| **Strength** | [1 kekuatan utama konkret] |
| **Improvement Area** | [1 area yang bisa diperkuat] |
| **Prototype & Relevansi** | [ringkasan kualitas tools dan ketepatan masalah] |
| **Deck & Iterasi** | [ringkasan kualitas deck dan bukti proses] |
| **Next Step** | [1 saran pengembangan tools ke depan yang spesifik] |

---

## D. Kesimpulan

[Pilih template yang sesuai dan isi placeholder, jangan cantumkan label "Template — Hasil Baik/Perlu Ditingkatkan":

Jika skor ≥ 70 (Baik/Luar Biasa):
"Overall Kak [Nama] sudah mengerjakan final project dengan sangat baik. Tools yang dibangun benar-benar menjawab masalah nyata dari pekerjaan Kakak, dan prosesnya terdokumentasi dengan jelas. Good job, Kak!

Semoga catatan-catatan yang ada bisa menambah insight dan bermanfaat ke depannya. Kalau ada pertanyaan atau ada yang perlu didiskusikan, jangan sungkan untuk chat aku ya Kak."

Jika skor < 70 (Cukup/Perlu Bimbingan):
"Kak [Nama] sudah berhasil menyelesaikan final project ini sampai tuntas — itu sendiri sudah merupakan pencapaian yang nyata. Semoga proses dan pembelajaran yang didapat selama bootcamp ini bisa terus berkembang dan bermanfaat ke depannya ya Kak.

Semoga catatan-catatan yang ada bisa membentuk pemahaman yang lebih komprehensif. Kalau ada pertanyaan atau ada yang perlu didiskusikan, jangan sungkan untuk chat aku ya Kak."]

---

*"Kesuksesan bukan diukur dari seberapa cepat, tapi bagaimana kamu merasakan tiap prosesnya." — Juni*

Warm Regards, ${taName}

---

PENTING: Kembalikan HANYA teks dokumen lengkap di atas (sudah diisi). Tidak ada penjelasan tambahan. Tidak ada markdown code block. Mulai langsung dari "# Feedback Final Project".`;

  const endpoint = IS_PROD ? '/api/grade' : DEV_BASE_URL;
  const headers = IS_PROD
    ? { 'Content-Type': 'application/json' }
    : { Authorization: `Bearer ${DEV_API_KEY}`, 'Content-Type': 'application/json' };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      // Model reasoning (big-pickle/deepseek) bisa pakai ribuan token sebelum output;
      // beri budget besar agar dokumen feedback tidak terpotong jadi kosong
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    let err; try { err = JSON.parse(raw); } catch { err = { error: raw }; }
    throw new Error(err.error || `API error ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Model tidak mengembalikan respons');
  return content.trim();
}

export async function gradeSubmission({ text, images = [], type }) {
  const hasImages = images.length > 0;
  const prompt = type === 'assignment'
    ? buildAssignmentPrompt(text, hasImages)
    : buildFinalProjectPrompt(text, hasImages);

  const messageContent = hasImages
    ? [
        ...images.map((img) => ({ type: 'image_url', image_url: { url: img } })),
        { type: 'text', text: prompt },
      ]
    : prompt;

  const endpoint = IS_PROD ? '/api/grade' : DEV_BASE_URL;

  const headers = IS_PROD
    ? { 'Content-Type': 'application/json' }
    : { Authorization: `Bearer ${DEV_API_KEY}`, 'Content-Type': 'application/json' };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'user', content: messageContent },
      ],
      temperature: 0.1,
      max_tokens: 6000,
      // Server akan fetch link live (CORS blokir di browser) untuk menilai prototype
      checkLinks: type === 'final',
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    let err; try { err = JSON.parse(raw); } catch { err = { error: raw }; }
    throw new Error(err.message || err.error || `API error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Model tidak mengembalikan respons');

  const parsed = extractJSON(content);
  if (!parsed) {
    throw new Error(
      'Model tidak mengembalikan JSON valid. Coba lagi atau ganti model.\n\nRaw: ' + content.slice(0, 300)
    );
  }

  return parsed;
}
