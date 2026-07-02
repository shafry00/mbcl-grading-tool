import React, { useState, useRef } from 'react';
import { parseFile } from '../lib/parseFile.js';
import { gradeSubmission } from '../lib/api.js';
import { calcAssignmentTotal, calcFinalScore, getAssignmentLevel, getFinalLevel } from '../lib/rubrics.js';

export default function NewGrading({ onSave, onCancel, initialType = 'assignment' }) {
  const [peserta, setPeserta] = useState('');
  const [type, setType] = useState(initialType);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const fileRef = useRef();

  async function handleGrade() {
    if (!peserta.trim()) return setError('Nama peserta wajib diisi');
    if (!file) return setError('Upload file submission terlebih dahulu');

    setError('');
    setStatus('parsing');

    let text, images;
    try {
      ({ text, images } = await parseFile(file));
    } catch (e) {
      setStatus('error');
      return setError('Gagal baca file: ' + e.message);
    }

    if (text.length < 20 && images.length === 0) {
      setStatus('error');
      return setError('File tidak berisi konten yang bisa dibaca. Pastikan file tidak kosong.');
    }

    setStatus('grading');

    let result;
    try {
      result = await gradeSubmission({
        text: text.slice(0, 10000),
        images,
        type,
      });
    } catch (e) {
      setStatus('error');
      return setError('Grading gagal: ' + e.message);
    }

    const criteria = result.criteria || {};
    let totalScore, level, rekomendasiShowcase;

    if (type === 'assignment') {
      totalScore = calcAssignmentTotal(criteria);
      level = getAssignmentLevel(totalScore).label;
    } else {
      // Hitung deterministik dari kriteria (konsisten dgn mode edit), bukan aritmetika model
      totalScore = calcFinalScore(criteria);
      level = getFinalLevel(totalScore).label;
      rekomendasiShowcase = totalScore >= 85;
    }

    onSave({
      peserta: peserta.trim(),
      type,
      fileName: file.name,
      criteria,
      totalScore,
      level,
      rekomendasiShowcase,
      feedbackPeserta: result.feedback_peserta || '',
      catatanTA: result.catatan_ta || '',
      edited: false,
    });
  }

  const isLoading = status === 'parsing' || status === 'grading';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-bl-blue hover:border-bl-blue hover:bg-bl-blue-light transition-colors text-lg"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900">Nilai Submission Baru</h1>
          <p className="text-sm text-gray-500">AI baca teks + screenshot, hasilkan skor &amp; feedback</p>
        </div>
      </div>

      {/* Nama */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nama Peserta</label>
          <input
            type="text"
            value={peserta}
            onChange={(e) => setPeserta(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGrade()}
            placeholder="cth: Rina Kusumawati"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-bl-blue transition-colors font-medium placeholder-gray-400"
          />
        </div>

        {/* Type selector */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tipe Submission</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'assignment',
                label: 'Assignment',
                sub: 'Day 1–3 · Skala 1–3 · Maks 15 poin',
                icon: '📝',
                activeClass: 'border-bl-blue bg-bl-blue-light',
                labelClass: 'text-bl-blue',
              },
              {
                id: 'final',
                label: 'Final Project',
                sub: 'Berbobot · Skor 0–100',
                icon: '🚀',
                activeClass: 'border-bl-red bg-bl-red-light',
                labelClass: 'text-bl-red',
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-colors ${
                  type === t.id ? t.activeClass : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className={`font-bold text-sm ${type === t.id ? t.labelClass : 'text-gray-900'}`}>
                  {t.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">File Submission</label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(e) => { setFile(e.target.files[0]); setError(''); }}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              file
                ? 'border-bl-blue bg-bl-blue-light'
                : 'border-gray-300 hover:border-bl-blue hover:bg-bl-blue-light'
            }`}
          >
            {file ? (
              <div>
                <div className="text-3xl mb-2">📄</div>
                <div className="font-bold text-bl-blue text-sm">{file.name}</div>
                <div className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB · Klik untuk ganti</div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">⬆️</div>
                <div className="text-sm font-bold text-gray-700">Klik untuk upload file</div>
                <div className="text-xs text-gray-500 mt-1">PDF · DOCX · TXT — termasuk screenshot di dalamnya</div>
              </div>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-bl-red-light border border-bl-red-mid rounded-xl p-4 text-sm text-bl-red font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGrade}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-bl-red text-white hover:bg-bl-red-dark shadow-md hover:shadow-lg'
          }`}
        >
          {status === 'parsing' && '⏳ Membaca file & render halaman...'}
          {status === 'grading' && '🤖 AI sedang menganalisis...'}
          {(status === 'idle' || status === 'error') && '▶ Mulai Penilaian'}
        </button>
      </div>
    </div>
  );
}
