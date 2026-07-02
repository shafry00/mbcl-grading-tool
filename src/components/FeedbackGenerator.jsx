import React, { useState } from 'react';
import { FINAL_PROJECT_RUBRIC } from '../lib/rubrics.js';
import { generateFeedbackDoc } from '../lib/api.js';
import { downloadMD, downloadDOCX } from '../lib/exportFeedback.js';

function calcWeightedScore(criteria) {
  return FINAL_PROJECT_RUBRIC.criteria.map((c) => {
    const score = criteria[c.id]?.score || 0;
    const weighted = ((score * c.weight) / 4).toFixed(2);
    return { ...c, score, weighted };
  });
}

export default function FeedbackGenerator({ session, onClose }) {
  const [taName, setTaName] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const rows = calcWeightedScore(session.criteria || {});
  const totalWeighted = rows.reduce((s, r) => s + parseFloat(r.weighted), 0).toFixed(2);

  async function handleGenerate() {
    if (!taName.trim()) return setError('Nama TA wajib diisi');
    setError('');
    setStatus('generating');
    try {
      const doc = await generateFeedbackDoc({
        session,
        taName: taName.trim(),
        liveLink: liveLink.trim(),
      });
      setResult(doc);
      setStatus('done');
    } catch (e) {
      setStatus('error');
      setError('Gagal generate: ' + e.message);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-black text-gray-900 text-lg">Generate Feedback Final Project</div>
            <div className="text-sm text-gray-500 mt-0.5">{session.peserta}</div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {status !== 'done' && (
            <>
              {/* Score preview */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tabel Penilaian</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-200">
                      <th className="text-left pb-2 font-bold">Aspek</th>
                      <th className="text-center pb-2 font-bold w-16">Bobot</th>
                      <th className="text-center pb-2 font-bold w-16">Skor</th>
                      <th className="text-right pb-2 font-bold w-20">Berbobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 text-gray-700 font-medium">{r.label}</td>
                        <td className="py-2 text-center text-gray-500">{r.weight}%</td>
                        <td className="py-2 text-center font-black text-bl-blue">{r.score}/4</td>
                        <td className="py-2 text-right text-gray-600">{r.weighted}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="pt-2 font-black text-gray-900">Skor Akhir</td>
                      <td className="pt-2 text-right font-black text-2xl text-bl-red">{session.totalScore}<span className="text-sm text-gray-400 font-normal">/100</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Nama Teaching Assistant</label>
                  <input
                    type="text"
                    value={taName}
                    onChange={(e) => setTaName(e.target.value)}
                    placeholder="cth: Rizky Pratama"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-bl-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Live Link Prototype</label>
                  <input
                    type="text"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="cth: https://..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-bl-blue transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-bl-red-light border border-bl-red-mid rounded-xl p-3 text-sm text-bl-red font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={status === 'generating'}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                  status === 'generating'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-bl-blue text-white hover:bg-bl-blue-dark shadow-md'
                }`}
              >
                {status === 'generating' ? '🤖 AI sedang menulis feedback...' : '✨ Generate Dokumen Feedback'}
              </button>
            </>
          )}

          {status === 'done' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-black text-emerald-600">✓ Feedback berhasil dibuat</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setStatus('idle'); setResult(''); }}
                    className="text-sm px-3 py-1.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`text-sm px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copied ? '✓ Tersalin!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => downloadMD(result, session.peserta)}
                    className="text-sm px-3 py-1.5 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    ↓ .MD
                  </button>
                  <button
                    onClick={async () => {
                      setDownloading(true);
                      await downloadDOCX(result, session.peserta);
                      setDownloading(false);
                    }}
                    disabled={downloading}
                    className={`text-sm px-3 py-1.5 rounded-xl font-black transition-colors ${
                      downloading ? 'bg-gray-200 text-gray-400' : 'bg-bl-blue text-white hover:bg-bl-blue-dark shadow-sm'
                    }`}
                  >
                    {downloading ? '⏳' : '↓ .DOCX'}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
