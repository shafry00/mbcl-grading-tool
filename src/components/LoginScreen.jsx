import React, { useState } from 'react';

const INSTRUCTOR_PASSWORD = 'REDACTED';

const ROLES = [
  { id: 'kelompok-1', label: 'Kelompok 1', icon: '1️⃣', color: 'blue' },
  { id: 'kelompok-2', label: 'Kelompok 2', icon: '2️⃣', color: 'red' },
  { id: 'kelompok-3', label: 'Kelompok 3', icon: '3️⃣', color: 'blue' },
  { id: 'kelompok-4', label: 'Kelompok 4', icon: '4️⃣', color: 'red' },
  { id: 'kelompok-5', label: 'Kelompok 5', icon: '5️⃣', color: 'blue' },
  { id: 'kelompok-6', label: 'Kelompok 6', icon: '6️⃣', color: 'red' },
  { id: 'kelompok-7', label: 'Kelompok 7', icon: '7️⃣', color: 'blue' },
  { id: 'kelompok-8', label: 'Kelompok 8', icon: '8️⃣', color: 'red' },
];

export default function LoginScreen({ onLogin }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleGroupLogin(roleId) {
    onLogin(roleId);
  }

  function handleInstructorSubmit() {
    if (password === INSTRUCTOR_PASSWORD) {
      onLogin('instruktur-assistant');
    } else {
      setError('Password salah');
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <img
            src="https://cdn.prod.website-files.com/5eb6815bc8e0bd376c3cae22/67ca9cd52f1dd0136f0c24af_ai%20belajarlagi.png"
            alt="Belajarlagi"
            className="h-8 w-auto object-contain"
          />
          <div className="font-bold text-gray-900 text-sm leading-tight">Grading Tool</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900">Masuk sebagai siapa?</h1>
            <p className="text-gray-500 mt-2">Pilih kelompok kamu atau login sebagai instruktur</p>
          </div>

          {/* Group grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => handleGroupLogin(role.id)}
                className={`rounded-2xl p-5 text-center font-black text-lg transition-all shadow-card hover:shadow-card-hover hover:-translate-y-0.5 ${
                  role.color === 'blue'
                    ? 'bg-bl-blue-light text-bl-blue border-2 border-bl-blue-mid hover:bg-bl-blue hover:text-white hover:border-bl-blue'
                    : 'bg-bl-red-light text-bl-red border-2 border-bl-red-mid hover:bg-bl-red hover:text-white hover:border-bl-red'
                }`}
              >
                <div className="text-2xl mb-1">{role.icon}</div>
                <div className="text-sm">{role.label}</div>
              </button>
            ))}
          </div>

          {/* Instructor button */}
          <button
            onClick={() => { setShowPasswordModal(true); setError(''); setPassword(''); }}
            className="w-full py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors font-bold text-sm flex items-center justify-center gap-2"
          >
            🔒 Masuk sebagai Instruktur Assistant
          </button>
        </div>
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">🔒</div>
                <div>
                  <div className="font-black text-gray-900">Instruktur</div>
                  <div className="text-xs text-gray-500">Masukkan password untuk melanjutkan</div>
                </div>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleInstructorSubmit()}
                placeholder="Password..."
                autoFocus
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors font-medium ${
                  error ? 'border-bl-red bg-bl-red-light' : 'border-gray-200 focus:border-bl-blue'
                }`}
              />
              {error && <p className="text-xs text-bl-red font-bold mt-2">{error}</p>}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleInstructorSubmit}
                className="flex-1 py-3 bg-bl-blue text-white rounded-xl text-sm font-black hover:bg-bl-blue-dark transition-colors shadow-sm"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
