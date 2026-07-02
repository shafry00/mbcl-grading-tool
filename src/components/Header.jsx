import React, { useState } from 'react';
import { exportCSV } from '../lib/export.js';
import PanduanModal from './PanduanModal.jsx';

export default function Header({ view, sessions, onDashboard, onNewGrading, onChat }) {
  const [showPanduan, setShowPanduan] = useState(false);

  return (
    <>
      <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <button onClick={onDashboard} className="flex items-center gap-2 group shrink-0">
            <img
              src="https://cdn.prod.website-files.com/5eb6815bc8e0bd376c3cae22/67ca9cd52f1dd0136f0c24af_ai%20belajarlagi.png"
              alt="Belajarlagi"
              className="h-7 w-auto object-contain"
            />
            <div className="font-bold text-gray-900 text-sm group-hover:text-bl-blue transition-colors hidden sm:block">
              Grading Tool
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onChat}
              title="TA Chat"
              className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                view === 'chat'
                  ? 'bg-bl-blue text-white'
                  : 'text-gray-500 hover:text-bl-blue hover:bg-bl-blue-light'
              }`}
            >
              <span>💬</span>
              <span className="hidden sm:inline">TA Chat</span>
            </button>
            <button
              onClick={() => setShowPanduan(true)}
              title="Panduan"
              className="text-sm text-gray-500 hover:text-bl-blue px-2.5 py-1.5 rounded-lg hover:bg-bl-blue-light transition-colors font-medium"
            >
              <span className="hidden sm:inline">Panduan</span>
              <span className="sm:hidden">📖</span>
            </button>
            {sessions.length > 0 && (
              <button
                onClick={() => exportCSV(sessions)}
                title="Export CSV"
                className="text-sm text-gray-500 hover:text-bl-blue px-2.5 py-1.5 rounded-lg hover:bg-bl-blue-light transition-colors font-medium"
              >
                <span className="hidden sm:inline">↓ CSV</span>
                <span className="sm:hidden">↓</span>
              </button>
            )}
            {view !== 'new-grading' && (
              <button
                onClick={onNewGrading}
                className="text-sm bg-bl-red text-white px-3 py-1.5 rounded-xl hover:bg-bl-red-dark transition-colors font-bold shadow-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">+ Nilai Submission</span>
                <span className="sm:hidden">+ Nilai</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showPanduan && <PanduanModal onClose={() => setShowPanduan(false)} />}
    </>
  );
}
