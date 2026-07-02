import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import NewGrading from './components/NewGrading.jsx';
import GradingResult from './components/GradingResult.jsx';
import TAChat from './components/TAChat.jsx';
import PanduanModal from './components/PanduanModal.jsx';
import StudentPrep from './components/StudentPrep.jsx';

const SESSIONS_KEY = 'mbcl-sessions-v1';

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || []; }
  catch { return []; }
}

const MENU = [
  {
    id: 'assignment',
    icon: '📝',
    label: 'Penilaian Submission',
    desc: 'Nilai assignment peserta — identifikasi masalah, prompting, project, refleksi, artifact',
    color: 'border-bl-blue',
    badge: 'bg-bl-blue-light text-bl-blue',
    badgeLabel: 'Assignment',
  },
  {
    id: 'final',
    icon: '🚀',
    label: 'Penilaian Final Project',
    desc: 'Nilai final project — prototype, relevansi masalah, deck, iterasi, refleksi',
    color: 'border-bl-red',
    badge: 'bg-bl-red-light text-bl-red',
    badgeLabel: 'Final Project',
  },
  {
    id: 'chat',
    icon: '💬',
    label: 'TA Chat',
    desc: 'Tanya soal kurikulum, rubrik, atau cara jawab pertanyaan peserta ke AI assistant',
    color: 'border-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700',
    badgeLabel: 'AI Assistant',
  },
  {
    id: 'panduan',
    icon: '📖',
    label: 'Panduan Penilaian',
    desc: 'Panduan lengkap rubrik assignment dan final project untuk Teaching Assistant',
    color: 'border-amber-400',
    badge: 'bg-amber-50 text-amber-700',
    badgeLabel: 'Panduan TA',
  },
  {
    id: 'student-prep',
    icon: '✅',
    label: 'Student Preparation',
    desc: 'Ceklis akun per student — Claude, GitHub, Vercel, Canva untuk 9 kelompok',
    color: 'border-violet-400',
    badge: 'bg-violet-50 text-violet-700',
    badgeLabel: 'Kelompok 1–9',
  },
  {
    id: 'dashboard',
    icon: '📊',
    label: 'Semua Penilaian',
    desc: 'Lihat rekap semua sesi grading, filter per tipe, dan hitung skor sertifikasi',
    color: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-600',
    badgeLabel: 'Dashboard',
  },
];

function HomeMenu({ onSelect }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <div className="text-xs font-black text-bl-red uppercase tracking-widest mb-1">MBCL Cohort 1</div>
        <h1 className="text-2xl font-black text-gray-900">Grading Tool</h1>
        <p className="text-sm text-gray-500 mt-1">Teaching Assistant Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`text-left bg-white rounded-2xl border-2 ${item.color} p-5 hover:shadow-md transition-all group active:scale-[0.98]`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.badgeLabel}</span>
            </div>
            <div className="font-black text-gray-900 text-base leading-snug mb-1 group-hover:text-gray-700">
              {item.label}
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
          </button>
        ))}
      </div>

    </main>
  );
}

export default function App() {
  const [view, setView] = useState('home');
  const [gradingType, setGradingType] = useState('assignment');
  const [sessions, setSessions] = useState(() => loadSessions());
  const [currentSession, setCurrentSession] = useState(null);
  const [showPanduan, setShowPanduan] = useState(false);

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  function handleMenuSelect(id) {
    if (id === 'assignment') { setGradingType('assignment'); setView('new-grading'); }
    else if (id === 'final') { setGradingType('final'); setView('new-grading'); }
    else if (id === 'chat') { setView('chat'); }
    else if (id === 'panduan') { setShowPanduan(true); }
    else if (id === 'student-prep') { setView('student-prep'); }
    else if (id === 'dashboard') { setView('dashboard'); }
  }

  function saveSession(sessionData) {
    const session = { id: Date.now().toString(), date: new Date().toISOString(), ...sessionData };
    setSessions((prev) => [session, ...prev]);
    setCurrentSession(session);
    setView('result');
  }

  function updateSession(id, updates) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    setCurrentSession((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
  }

  function deleteSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setView('dashboard');
    setCurrentSession(null);
  }

  function openSession(session) {
    setCurrentSession(session);
    setView('result');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        view={view}
        sessions={sessions}
        onDashboard={() => setView('home')}
        onNewGrading={() => setView('new-grading')}
        onChat={() => setView('chat')}
      />

      {showPanduan && <PanduanModal onClose={() => setShowPanduan(false)} />}

      {view === 'chat' ? (
        <TAChat />
      ) : (
        <>
          {view === 'home' && <HomeMenu onSelect={handleMenuSelect} />}

          {view !== 'home' && (
            <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
              {view === 'dashboard' && (
                <Dashboard
                  sessions={sessions}
                  onNewGrading={() => setView('new-grading')}
                  onOpenSession={openSession}
                  onDeleteSession={deleteSession}
                />
              )}
              {view === 'new-grading' && (
                <NewGrading
                  initialType={gradingType}
                  onSave={saveSession}
                  onCancel={() => setView('home')}
                />
              )}
              {view === 'student-prep' && <StudentPrep />}
              {view === 'result' && currentSession && (
                <GradingResult
                  session={currentSession}
                  onUpdate={(updates) => updateSession(currentSession.id, updates)}
                  onBack={() => setView('dashboard')}
                  onDelete={() => deleteSession(currentSession.id)}
                />
              )}
            </main>
          )}
        </>
      )}
    </div>
  );
}
