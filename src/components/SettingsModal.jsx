import React, { useState } from 'react';

const MODELS = [
  { value: 'nvidia/llama-3.2-90b-vision-instruct', label: 'Llama 3.2 90B Vision ✦ — bisa baca gambar (Rekomendasi)' },
  { value: 'microsoft/phi-3.5-vision-instruct', label: 'Phi-3.5 Vision — bisa baca gambar' },
  { value: 'moonshotai/kimi-k2', label: 'Kimi K2 — teks saja' },
  { value: 'zhipuai/glm-4-9b', label: 'GLM-4-9B — teks saja' },
  { value: 'meta/llama-3.3-70b-instruct', label: 'Llama 3.3 70B — teks saja' },
];

export default function SettingsModal({ settings, onSave, onClose }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'nvidia/llama-3.2-90b-vision-instruct');
  const [customModel, setCustomModel] = useState('');
  const [showCustom, setShowCustom] = useState(!MODELS.find((m) => m.value === settings.model));
  const [showKey, setShowKey] = useState(false);

  function handleSave() {
    const finalModel = showCustom ? customModel.trim() : model;
    if (!apiKey.trim()) return alert('API Key wajib diisi');
    if (!finalModel) return alert('Model wajib dipilih');
    onSave({ apiKey: apiKey.trim(), model: finalModel });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-6 rounded-sm bg-bl-red inline-block" />
            <span className="w-2 h-6 rounded-sm bg-bl-blue inline-block" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Pengaturan</h2>
            <p className="text-xs text-gray-500">NVIDIA API &amp; model AI</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* API Key */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">NVIDIA API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="nvapi-..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-bl-blue transition-colors font-mono"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                {showKey ? 'hide' : 'show'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Tersimpan di browser lokal.</p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">Model AI</label>
            {!showCustom ? (
              <div className="space-y-2">
                {MODELS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setModel(m.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                      model === m.value
                        ? 'border-bl-blue bg-bl-blue-light text-bl-blue font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustom(true)}
                  className="text-xs text-bl-blue hover:underline font-bold mt-1"
                >
                  Masukkan model ID manual →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="cth: moonshotai/kimi-k2"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-bl-blue font-mono transition-colors"
                />
                <button
                  onClick={() => setShowCustom(false)}
                  className="text-xs text-bl-blue hover:underline font-bold"
                >
                  ← Pilih dari daftar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          {settings.apiKey && (
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 text-sm bg-bl-blue text-white rounded-xl hover:bg-bl-blue-dark transition-colors font-black shadow-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
