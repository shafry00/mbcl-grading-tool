function esc(v) {
  if (v == null) return '';
  const s = String(v);
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

export function exportCSV(sessions) {
  // Build per-peserta lookup for cert score
  const byPeserta = {};
  sessions.forEach((s) => {
    const key = s.peserta.trim().toLowerCase();
    if (!byPeserta[key]) byPeserta[key] = {};
    if (s.type === 'assignment') byPeserta[key].assignment = s.totalScore;
    if (s.type === 'final') byPeserta[key].final = s.totalScore;
  });

  const rows = [
    [
      'Nama Peserta', 'Tipe', 'Tanggal', 'Level', 'Skor Raw',
      'Skor Assignment /100', 'Skor Final Project /100', 'Skor Sertifikat /100',
      'Identifikasi Masalah', 'Perbandingan Prompting', 'Claude Project',
      'Refleksi', 'Artifact', 'MCP Bonus',
      'Prototype', 'Relevansi Masalah', 'Kualitas Deck', 'Bukti Iterasi', 'Listen & Iterate',
      'Rekomendasi Showcase', 'Feedback Peserta', 'Catatan TA',
    ],
  ];

  for (const s of sessions) {
    const c = s.criteria || {};
    const key = s.peserta.trim().toLowerCase();
    const p = byPeserta[key] || {};
    const a100 = p.assignment != null ? p.assignment : '';
    const fp100 = p.final != null ? p.final : '';
    const cert = (p.assignment != null && p.final != null)
      ? Math.round(a100 * 0.4 + fp100 * 0.6)
      : '';

    rows.push([
      s.peserta,
      s.type === 'assignment' ? 'Assignment' : 'Final Project',
      new Date(s.date).toLocaleDateString('id-ID'),
      s.level,
      `${s.totalScore}/100`,
      a100,
      fp100,
      cert,
      c.identifikasi_masalah?.score ?? '',
      c.perbandingan_prompting?.score ?? '',
      c.claude_project?.score ?? '',
      c.refleksi?.score ?? '',
      c.artifact?.score ?? '',
      c.mcp_bonus?.score ?? '',
      c.prototype?.score ?? '',
      c.relevansi_masalah?.score ?? '',
      c.kualitas_deck?.score ?? '',
      c.bukti_iterasi?.score ?? '',
      c.refleksi?.score ?? '',
      s.rekomendasiShowcase ? 'Ya' : '',
      s.feedbackPeserta ?? '',
      s.catatanTA ?? '',
    ]);
  }

  const csv = rows.map((r) => r.map(esc).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mbcl-grading-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
