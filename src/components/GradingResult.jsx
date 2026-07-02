import React, { useState } from 'react';
import { ASSIGNMENT_RUBRIC, FINAL_PROJECT_RUBRIC, calcAssignmentTotal, calcFinalScore, getAssignmentLevel, getFinalLevel } from '../lib/rubrics.js';
import FeedbackGenerator from './FeedbackGenerator.jsx';

const LEVEL_CONFIG = {
  'Luar Biasa': { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-white' },
  'Baik': { bg: 'bg-bl-blue', border: 'border-bl-blue-dark', text: 'text-white' },
  'Cukup': { bg: 'bg-amber-400', border: 'border-amber-500', text: 'text-white' },
  'Perlu Bimbingan': { bg: 'bg-bl-red', border: 'border-bl-red-dark', text: 'text-white' },
};

const PIP_COLOR = {
  // scale 3
  3: { filled: 'bg-emerald-400', empty: 'bg-gray-200' },
  2: { filled: 'bg-amber-400', empty: 'bg-gray-200' },
  1: { filled: 'bg-bl-red', empty: 'bg-gray-200' },
  // scale 4
  4: { filled: 'bg-emerald-400', empty: 'bg-gray-200' },
};

function ScorePip({ score, max }) {
  const color = PIP_COLOR[score] || { filled: 'bg-bl-blue', empty: 'bg-gray-200' };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${i < score ? color.filled : color.empty}`}
        />
      ))}
    </div>
  );
}

function CriterionRow({ criterion, score, feedback, maxScore, onScoreChange, onFeedbackChange, editable }) {
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(feedback);
  const descriptions = criterion.descriptions || {};

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-bold text-sm text-gray-900">{criterion.label}</div>
          {score > 0 && descriptions[score] && (
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">{descriptions[score]}</div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <ScorePip score={score} max={maxScore} />
          {editable ? (
            <select
              value={score}
              onChange={(e) => onScoreChange(Number(e.target.value))}
              className="text-sm border-2 border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-bl-blue font-bold text-gray-900"
            >
              {Array.from({ length: maxScore + 1 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? '—' : i}</option>
              ))}
            </select>
          ) : (
            <span className="text-sm font-black text-gray-700 w-8 text-right">
              {score}/{maxScore}
            </span>
          )}
        </div>
      </div>

      {feedback && !editingFeedback && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed border border-gray-100">
          {feedback}
          {editable && (
            <button onClick={() => setEditingFeedback(true)} className="ml-2 text-bl-blue hover:underline font-medium">
              edit
            </button>
          )}
        </div>
      )}
      {editingFeedback && (
        <div className="space-y-2">
          <textarea
            value={localFeedback}
            onChange={(e) => setLocalFeedback(e.target.value)}
            rows={3}
            className="w-full text-xs border-2 border-bl-blue rounded-xl p-3 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { onFeedbackChange(localFeedback); setEditingFeedback(false); }}
              className="text-xs bg-bl-blue text-white px-3 py-1.5 rounded-lg font-bold"
            >
              Simpan
            </button>
            <button
              onClick={() => setEditingFeedback(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GradingResult({ session, onUpdate, onBack, onDelete }) {
  const [editable, setEditable] = useState(false);
  const [showFeedbackGen, setShowFeedbackGen] = useState(false);
  const [criteria, setCriteria] = useState(session.criteria || {});
  const [feedbackPeserta, setFeedbackPeserta] = useState(session.feedbackPeserta || '');
  const [catatanTA, setCatatanTA] = useState(session.catatanTA || '');

  const isAssignment = session.type === 'assignment';
  const rubric = isAssignment ? ASSIGNMENT_RUBRIC : FINAL_PROJECT_RUBRIC;
  const levelCfg = LEVEL_CONFIG[session.level] || { bg: 'bg-gray-400', border: 'border-gray-500', text: 'text-white' };

  function updateCriterionScore(id, score) {
    setCriteria((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), score } }));
  }

  function updateCriterionFeedback(id, feedback) {
    setCriteria((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), feedback } }));
  }

  function recalcAndSave() {
    let totalScore, level, rekomendasiShowcase;
    if (isAssignment) {
      totalScore = calcAssignmentTotal(criteria);
      level = getAssignmentLevel(totalScore).label;
    } else {
      totalScore = calcFinalScore(criteria);
      level = getFinalLevel(totalScore).label;
      rekomendasiShowcase = totalScore >= 85;
    }
    onUpdate({ criteria, totalScore, level, rekomendasiShowcase, feedbackPeserta, catatanTA, edited: true });
    setEditable(false);
  }

  return (
    <div className="space-y-5">
      {/* Top nav */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-bl-blue hover:border-bl-blue hover:bg-bl-blue-light transition-colors text-lg shrink-0"
        >
          ←
        </button>
        <div className="flex gap-1.5 flex-wrap">
          {!editable ? (
            <button
              onClick={() => setEditable(true)}
              className="text-xs sm:text-sm px-3 py-1.5 border-2 border-bl-blue text-bl-blue rounded-xl hover:bg-bl-blue-light transition-colors font-bold"
            >
              ✏ Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => { setCriteria(session.criteria); setEditable(false); }}
                className="text-xs sm:text-sm px-3 py-1.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Batal
              </button>
              <button
                onClick={recalcAndSave}
                className="text-xs sm:text-sm px-3 py-1.5 bg-bl-blue text-white rounded-xl hover:bg-bl-blue-dark transition-colors font-bold shadow-sm"
              >
                Simpan
              </button>
            </>
          )}
          {!isAssignment && !editable && (
            <button
              onClick={() => setShowFeedbackGen(true)}
              className="text-xs sm:text-sm px-3 py-1.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-black shadow-sm"
            >
              ✨ <span className="hidden sm:inline">Generate </span>Feedback
            </button>
          )}
          <button
            onClick={() => { if (confirm('Hapus penilaian ini?')) onDelete(); }}
            className="text-xs sm:text-sm px-3 py-1.5 text-bl-red hover:bg-bl-red-light border-2 border-transparent hover:border-bl-red-mid rounded-xl transition-colors font-bold"
          >
            Hapus
          </button>
        </div>
      </div>

      {/* Score hero card */}
      <div className={`rounded-3xl p-6 ${levelCfg.bg} ${levelCfg.text}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-black">{session.peserta}</div>
            <div className="text-sm opacity-80 mt-1 font-medium">
              {isAssignment ? 'Assignment' : 'Final Project'} ·{' '}
              {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            {session.edited && (
              <div className="text-xs opacity-60 mt-0.5">diedit manual</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-5xl font-black leading-none">{session.totalScore}</div>
            <div className="text-sm opacity-70 font-bold mt-1">/ 100</div>
            <div className="text-sm font-bold mt-2 opacity-90">{session.level}</div>
            {session.rekomendasiShowcase && (
              <div className="text-xs mt-1 opacity-80">🌟 Kandidat Showcase</div>
            )}
          </div>
        </div>
      </div>

      {/* Criteria */}
      {isAssignment ? (
        <div className="space-y-4">
          {rubric.sections.map((section) => (
            <div key={section.id}>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                {section.title}
              </div>
              <div className="space-y-2">
                {section.criteria.map((c) => (
                  <CriterionRow
                    key={c.id}
                    criterion={c}
                    score={criteria[c.id]?.score || 0}
                    feedback={criteria[c.id]?.feedback || ''}
                    maxScore={3}
                    onScoreChange={(s) => updateCriterionScore(c.id, s)}
                    onFeedbackChange={(f) => updateCriterionFeedback(c.id, f)}
                    editable={editable}
                  />
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Bonus</div>
            <CriterionRow
              criterion={rubric.bonus}
              score={criteria[rubric.bonus.id]?.score || 0}
              feedback={criteria[rubric.bonus.id]?.feedback || ''}
              maxScore={1}
              onScoreChange={(s) => updateCriterionScore(rubric.bonus.id, s)}
              onFeedbackChange={(f) => updateCriterionFeedback(rubric.bonus.id, f)}
              editable={editable}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Aspek Penilaian</div>
          {rubric.criteria.map((c) => (
            <div key={c.id} className="relative">
              <CriterionRow
                criterion={c}
                score={criteria[c.id]?.score || 0}
                feedback={criteria[c.id]?.feedback || ''}
                maxScore={4}
                onScoreChange={(s) => updateCriterionScore(c.id, s)}
                onFeedbackChange={(f) => updateCriterionFeedback(c.id, f)}
                editable={editable}
              />
              <span className="absolute top-4 right-14 text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-100">
                {c.weight}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback blocks */}
      <div className="space-y-3">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-bl-blue inline-block" />
            Feedback untuk Peserta
          </div>
          {editable ? (
            <textarea
              value={feedbackPeserta}
              onChange={(e) => setFeedbackPeserta(e.target.value)}
              rows={4}
              className="w-full text-sm border-2 border-bl-blue rounded-xl p-3 focus:outline-none"
            />
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">{feedbackPeserta || '—'}</p>
          )}
        </div>

        {(catatanTA || editable) && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
            <div className="text-sm font-black text-amber-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-amber-400 inline-block" />
              Catatan Internal TA
            </div>
            {editable ? (
              <textarea
                value={catatanTA}
                onChange={(e) => setCatatanTA(e.target.value)}
                rows={2}
                placeholder="Catatan internal (tidak dikirim ke peserta)"
                className="w-full text-sm border-2 border-amber-300 rounded-xl p-3 focus:outline-none bg-white"
              />
            ) : (
              <p className="text-sm text-amber-700 leading-relaxed">{catatanTA}</p>
            )}
          </div>
        )}

        {!isAssignment && (
          <div className="bg-bl-blue-light border border-bl-blue-mid rounded-2xl p-4 text-sm text-bl-blue font-medium">
            <span className="font-black">Reminder:</span> Cek live link prototype secara manual. Bobot aspek Prototype 35% — sesuaikan skor jika perlu.
          </div>
        )}
      </div>

      {showFeedbackGen && (
        <FeedbackGenerator
          session={session}
          onClose={() => setShowFeedbackGen(false)}
        />
      )}
    </div>
  );
}
