import React, { useState } from 'react';

const SCORE_PILL = {
  4: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  3: 'bg-bl-blue-light text-bl-blue border border-bl-blue-mid',
  2: 'bg-amber-50 text-amber-700 border border-amber-200',
  1: 'bg-bl-red-light text-bl-red border border-bl-red-mid',
  0: 'bg-gray-100 text-gray-400 border border-gray-200',
};

const LEVEL_STYLE = {
  'Luar Biasa': { bg: 'bg-emerald-500', text: 'text-white' },
  'Baik': { bg: 'bg-bl-blue', text: 'text-white' },
  'Cukup': { bg: 'bg-amber-400', text: 'text-white' },
  'Perlu Bimbingan': { bg: 'bg-bl-red', text: 'text-white' },
};

function ScoreBreakdown({ session }) {
  const c = session.criteria || {};
  if (session.type === 'assignment') {
    const items = [
      { label: 'Identif.', id: 'identifikasi_masalah', max: 3 },
      { label: 'Prompting', id: 'perbandingan_prompting', max: 3 },
      { label: 'Project', id: 'claude_project', max: 3 },
      { label: 'Refleksi', id: 'refleksi', max: 3 },
      { label: 'Artifact', id: 'artifact', max: 3 },
    ];
    const bonus = c.mcp_bonus?.score || 0;
    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        {items.map((item) => {
          const score = c[item.id]?.score || 0;
          return (
            <span key={item.id} className={`text-xs px-2 py-1 rounded-lg font-semibold ${SCORE_PILL[score] || SCORE_PILL[0]}`}>
              {item.label}: {score}/{item.max}
            </span>
          );
        })}
        {bonus > 0 && (
          <span className="text-xs px-2 py-1 rounded-lg font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            +{bonus} MCP
          </span>
        )}
      </div>
    );
  } else {
    const items = [
      { label: 'Prototype', id: 'prototype' },
      { label: 'Masalah', id: 'relevansi_masalah' },
      { label: 'Deck', id: 'kualitas_deck' },
      { label: 'Iterasi', id: 'bukti_iterasi' },
      { label: 'Listen&Iterate', id: 'refleksi' },
    ];
    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        {items.map((item) => {
          const score = c[item.id]?.score || 0;
          return (
            <span key={item.id} className={`text-xs px-2 py-1 rounded-lg font-semibold ${SCORE_PILL[score] || SCORE_PILL[0]}`}>
              {item.label}: {score}/4
            </span>
          );
        })}
      </div>
    );
  }
}

function SessionCard({ session, onClick, onDelete }) {
  const level = LEVEL_STYLE[session.level] || { bg: 'bg-gray-400', text: 'text-white' };
  const isAssignment = session.type === 'assignment';
  const borderColor = isAssignment ? 'border-l-bl-blue' : 'border-l-bl-red';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-gray-100 border-l-4 ${borderColor} group cursor-pointer`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-base group-hover:text-bl-blue transition-colors">
                {session.peserta}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${level.bg} ${level.text}`}>
                {session.level}
              </span>
              {session.rekomendasiShowcase && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500 text-white">
                  🌟 Showcase
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <span className={`font-semibold ${isAssignment ? 'text-bl-blue' : 'text-bl-red'}`}>
                {isAssignment ? 'Assignment' : 'Final Project'}
              </span>
              <span>·</span>
              <span>{new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className={`text-2xl font-black ${isAssignment ? 'text-bl-blue' : 'text-bl-red'}`}>
                {session.totalScore}
              </div>
              <div className="text-xs text-gray-400 font-medium">/ 100</div>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Hapus penilaian ${session.peserta}?`)) onDelete(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-bl-red transition-all w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bl-red-light text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <ScoreBreakdown session={session} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  const colors = {
    blue: 'bg-bl-blue text-white',
    red: 'bg-bl-red text-white',
    'blue-light': 'bg-bl-blue-light text-bl-blue border border-bl-blue-mid',
    'red-light': 'bg-bl-red-light text-bl-red border border-bl-red-mid',
    green: 'bg-emerald-500 text-white',
  };
  return (
    <div className={`rounded-2xl p-3 sm:p-5 ${colors[color] || 'bg-white border border-gray-200'}`}>
      <div className="text-2xl sm:text-3xl font-black">{value}</div>
      <div className="text-xs sm:text-sm font-semibold mt-1 opacity-90 leading-snug">{label}</div>
      {sub && <div className="text-xs mt-0.5 opacity-70 hidden sm:block">{sub}</div>}
    </div>
  );
}

function calcCertScore(assignment100, final100) {
  return Math.round(assignment100 * 0.4 + final100 * 0.6);
}

function CertificateTable({ sessions }) {
  // Group by peserta name (case-insensitive trim)
  const byPeserta = {};
  sessions.forEach((s) => {
    const key = s.peserta.trim().toLowerCase();
    if (!byPeserta[key]) byPeserta[key] = { name: s.peserta, assignment: null, final: null };
    if (s.type === 'assignment') byPeserta[key].assignment = s;
    if (s.type === 'final') byPeserta[key].final = s;
  });

  const rows = Object.values(byPeserta).filter((p) => p.assignment && p.final);
  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full bg-emerald-500 inline-block" />
        <span className="font-black text-gray-900 text-sm">Skor Sertifikat</span>
        <span className="text-xs text-gray-400 ml-1">Assignment 40% + Final Project 60%</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 font-bold uppercase tracking-wide">
              <th className="text-left px-5 py-3">Peserta</th>
              <th className="text-center px-3 py-3">Assignment<br/><span className="font-normal normal-case tracking-normal">/100</span></th>
              <th className="text-center px-3 py-3">Final Project<br/><span className="font-normal normal-case tracking-normal">/100</span></th>
              <th className="text-center px-4 py-3 text-emerald-700">Skor Sertifikat<br/><span className="font-normal normal-case tracking-normal">/100</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.sort((a, b) => {
              const sa = calcCertScore(a.assignment.totalScore, a.final.totalScore);
              const sb = calcCertScore(b.assignment.totalScore, b.final.totalScore);
              return sb - sa;
            }).map((p) => {
              const a100 = p.assignment.totalScore;
              const cert = calcCertScore(a100, p.final.totalScore);
              const certColor = cert >= 85 ? 'text-emerald-600' : cert >= 70 ? 'text-bl-blue' : cert >= 55 ? 'text-amber-600' : 'text-bl-red';
              return (
                <tr key={p.name} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-3 py-3 text-center font-bold text-bl-blue">{a100}</td>
                  <td className="px-3 py-3 text-center font-bold text-bl-red">{p.final.totalScore}</td>
                  <td className={`px-4 py-3 text-center font-black text-lg ${certColor}`}>{cert}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ sessions, onNewGrading, onOpenSession, onDeleteSession }) {
  const [filter, setFilter] = useState('all');

  const assignments = sessions.filter((s) => s.type === 'assignment');
  const finals = sessions.filter((s) => s.type === 'final');
  const needsAttention = sessions.filter((s) => s.level === 'Perlu Bimbingan');
  const showcaseCandidates = finals.filter((s) => s.rekomendasiShowcase);
  const filtered = filter === 'all' ? sessions : filter === 'assignment' ? assignments : finals;

  if (sessions.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 rounded-3xl bg-bl-blue-light flex items-center justify-center text-4xl mx-auto mb-6">
          📋
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Belum ada penilaian</h2>
        <p className="text-gray-500 mb-8">Upload submission pertama untuk mulai</p>
        <button
          onClick={onNewGrading}
          className="bg-bl-red text-white px-8 py-4 rounded-2xl hover:bg-bl-red-dark transition-colors font-bold text-base shadow-md"
        >
          + Nilai Submission Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Submission" value={sessions.length} color="blue" />
        <StatCard label="Assignment" value={assignments.length} color="blue-light" />
        <StatCard label="Final Project" value={finals.length} color="red-light" />
        <StatCard
          label="Perlu Bimbingan"
          value={needsAttention.length}
          sub={needsAttention.length > 0 ? 'Prioritas asistensi' : 'Semua aman'}
          color={needsAttention.length > 0 ? 'red' : 'green'}
        />
      </div>

      {showcaseCandidates.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="font-bold text-base mb-1">🌟 Kandidat Showcase Day 7</div>
          <div className="text-sm opacity-90">{showcaseCandidates.map((s) => s.peserta).join(' · ')}</div>
        </div>
      )}

      <CertificateTable sessions={sessions} />

      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'assignment', label: 'Assignment' },
              { id: 'final', label: 'Final Project' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === f.id
                    ? 'bg-bl-blue text-white shadow-sm'
                    : 'bg-white text-gray-500 hover:bg-bl-blue-light hover:text-bl-blue border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium shrink-0">{filtered.length} peserta</span>
        </div>

        <div className="space-y-3">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onClick={() => onOpenSession(s)}
              onDelete={onDeleteSession}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
