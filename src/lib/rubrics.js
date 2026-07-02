export const ASSIGNMENT_RUBRIC = {
  id: 'assignment',
  title: 'Assignment MBCL Cohort 1',
  subtitle: 'Gabungan Day 1–3 · Skala 1–3 · Skor akhir 0–100',
  sections: [
    {
      id: 'bagian1',
      title: 'Bagian 1 — Identifikasi Masalah',
      criteria: [
        {
          id: 'identifikasi_masalah',
          label: 'Identifikasi Masalah',
          descriptions: {
            1: 'Masalah terlalu umum atau tidak memenuhi kriteria 3R',
            2: 'Masalah spesifik tapi kriteria 3R tidak dijelaskan',
            3: 'Masalah spesifik, memenuhi minimal 2 dari 3 kriteria 3R dengan penjelasan jelas',
          },
        },
      ],
    },
    {
      id: 'bagian2',
      title: 'Bagian 2 — Eksplorasi Claude',
      criteria: [
        {
          id: 'perbandingan_prompting',
          label: 'Perbandingan Prompting',
          descriptions: {
            1: 'Hanya satu cara dicoba, atau tidak ada perbedaan yang dicatat',
            2: 'Dua cara dicoba tapi perbedaan tidak dianalisis',
            3: 'Chat biasa vs Skill/Project keduanya dicoba, ada perbedaan nyata yang dijelaskan',
          },
        },
        {
          id: 'claude_project',
          label: 'Claude Project',
          descriptions: {
            1: 'System Prompt generik — tidak ada peran, konteks, atau format spesifik',
            2: 'Ada salah satu dari tiga elemen (peran/konteks/format)',
            3: 'Mencakup peran Claude, konteks bisnis spesifik, dan format output yang diinginkan',
          },
        },
        {
          id: 'refleksi',
          label: 'Refleksi',
          descriptions: {
            1: '"Claude sangat membantu" tanpa detail',
            2: 'Ada observasi tapi masih umum',
            3: 'Konkret — menyebut perbedaan output spesifik yang dirasakan antar cara',
          },
        },
        {
          id: 'artifact',
          label: 'Artifact',
          descriptions: {
            1: 'Contoh generik yang bisa dipakai siapapun',
            2: 'Relevan tapi prompt tidak ditampilkan atau terlalu sederhana',
            3: 'Relevan untuk pekerjaan nyata, prompt spesifik ke konteks peserta',
          },
        },
      ],
    },
  ],
  bonus: {
    id: 'mcp_bonus',
    label: 'Bonus: MCP Connector',
    descriptions: {
      0: 'Tidak ada atau alasan tidak spesifik ke pekerjaan',
      1: 'Ada MCP Connector dengan alasan spesifik ke konteks pekerjaan peserta',
    },
  },
  levels: [
    { min: 75, max: 100, label: 'Baik', color: 'green' },
    { min: 50, max: 74, label: 'Cukup', color: 'yellow' },
    { min: 0, max: 49, label: 'Perlu Bimbingan', color: 'red' },
  ],
};

export const FINAL_PROJECT_RUBRIC = {
  id: 'final',
  title: 'Final Project MBCL Cohort 1',
  subtitle: 'Skala 1–4 per aspek · Skor akhir 0–100',
  criteria: [
    {
      id: 'prototype',
      label: 'Prototype Berfungsi',
      weight: 35,
      descriptions: {
        1: 'Link tidak bisa dibuka',
        2: 'Bisa dibuka tapi tidak berfungsi',
        3: 'Fungsi utama berjalan tapi ada bug signifikan',
        4: 'Link aktif, fungsi utama berjalan lancar, mobile-friendly',
      },
    },
    {
      id: 'relevansi_masalah',
      label: 'Relevansi Masalah',
      weight: 25,
      descriptions: {
        1: 'Masalah terlalu umum, tidak ada bukti nyata',
        2: 'Masalah nyata tapi tidak spesifik, tidak ada proses Sharpen ke Claude',
        3: 'Masalah spesifik dari pekerjaan sehari-hari, ada observasi',
        4: 'Masalah spesifik + bukti nyata (data/kutipan) + hipotesis di-challenge ke Claude',
      },
    },
    {
      id: 'kualitas_deck',
      label: 'Kualitas Deck',
      weight: 20,
      descriptions: {
        1: 'Slide tidak lengkap atau tidak mengikuti struktur See Clearly → Imagine Boldly → Ship Bravely',
        2: 'Lengkap tapi alur antar pilar tidak terhubung',
        3: 'Alur mengalir tapi Diverge/Converge atau Listen Deeply kurang terdokumentasi',
        4: 'Alur kuat: pain conviction → constraint → opsi → pilihan → prototype → gap → iterasi',
      },
    },
    {
      id: 'bukti_iterasi',
      label: 'Bukti Iterasi',
      weight: 10,
      descriptions: {
        1: 'Langsung ke satu solusi tanpa Diverge/Converge',
        2: 'Ada beberapa opsi tapi cara memilih tidak jelas',
        3: 'Converge terlihat tapi alasan lemah, gap dari testing tidak ditindaklanjuti',
        4: 'Diverge → Converge → Commit jelas, gap dari user testing diidentifikasi dan direspons',
      },
    },
    {
      id: 'refleksi',
      label: 'Listen & Iterate',
      weight: 10,
      descriptions: {
        1: 'Tidak ada user testing (Listen Deeply) maupun perubahan (Iterate Fast)',
        2: 'Ada salah satu saja — feedback user ATAU 1 perubahan — tanpa kaitan jelas',
        3: 'Ada feedback user + 1 perubahan, tapi perubahan kurang nyambung ke feedback',
        4: 'Feedback user konkret (kebingungan 10 detik pertama) + 1 perubahan cepat yang langsung menjawabnya (idealnya before→after)',
      },
    },
  ],
  levels: [
    { min: 85, max: 100, label: 'Luar Biasa', color: 'green', note: 'Kandidat showcase' },
    { min: 70, max: 84, label: 'Baik', color: 'blue', note: '' },
    { min: 55, max: 69, label: 'Cukup', color: 'yellow', note: '' },
    { min: 0, max: 54, label: 'Perlu Bimbingan', color: 'red', note: 'Prioritas asistensi' },
  ],
};

export function calcAssignmentTotal(criteria) {
  const main = ['identifikasi_masalah', 'perbandingan_prompting', 'claude_project', 'refleksi', 'artifact']
    .reduce((sum, id) => sum + (criteria[id]?.score || 0), 0);
  const bonus = criteria.mcp_bonus?.score || 0;
  // Skala resmi: (raw 5 aspek /15) × 100. Bonus MCP (+1) ditambah di atas, total di-cap 100.
  return Math.min(100, Math.round(((main + bonus) / 15) * 100));
}

export function calcFinalScore(criteria) {
  const weighted = FINAL_PROJECT_RUBRIC.criteria.reduce((sum, c) => {
    return sum + (criteria[c.id]?.score || 0) * c.weight;
  }, 0);
  return Math.round(weighted / 4);
}

export function getAssignmentLevel(total) {
  return ASSIGNMENT_RUBRIC.levels.find(l => total >= l.min && total <= l.max)
    || ASSIGNMENT_RUBRIC.levels[ASSIGNMENT_RUBRIC.levels.length - 1];
}

export function getFinalLevel(score) {
  return FINAL_PROJECT_RUBRIC.levels.find(l => score >= l.min && score <= l.max)
    || FINAL_PROJECT_RUBRIC.levels[FINAL_PROJECT_RUBRIC.levels.length - 1];
}
