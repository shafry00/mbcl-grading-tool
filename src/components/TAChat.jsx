import React, { useState, useRef, useEffect } from 'react';

const IS_PROD = import.meta.env.PROD;

const SYSTEM_PROMPT = `Kamu adalah TA Assistant untuk "Mini Bootcamp Claude Playbook for Non-Tech Professional" (MBCL) Cohort 1 oleh BelajarLagi.

Tugasmu: bantu Teaching Assistant (TA) menjawab pertanyaan dari peserta bootcamp dengan akurat, ramah, dan sesuai kurikulum MBCL.

## Konteks Bootcamp

MBCL adalah bootcamp 8 sesi (Day 1–7 + Day 0 pre-study) yang mengajarkan non-tech professional menggunakan Claude AI untuk pekerjaan nyata. Tools utama: Claude.ai (chat, Skills, Projects), Claude Code, Vibe Coding.

Jadwal:
- Day 0: Pre-Study (Webinar: Claude from Zero)
- Day 1 (Senin 15 Juni): Builder Mindset, Claude Chat, Skills & Projects
- Day 2 (Rabu 17 Juni): Claude Cowork, Code Preparation & Basic Terms
- Day 3 (Senin 22 Juni): Claude Code Exploration
- Day 4 (Rabu 24 Juni): Vibe Coding & Claude Design Exploration
- Day 5 (Jumat 26 Juni): Vibe Coding in Action, Ship & Reflection
- Day 6 (Senin 29 Juni): Asistensi — Technical Troubleshooting
- Day 7 (Jumat 3 Juli): Demo & Final Showcase + Graduation

## Assignment

Peserta mengumpulkan 1 file (PDF/DOCX/PPT). Dinilai 5 aspek skala 1–3, skor maks 15 poin, dikonversi ke /100.

Rubrik:
- Identifikasi masalah (1–3): apakah masalah spesifik + memenuhi min 2 kriteria 3R (Repetitive, Resource-heavy, Rule-based)?
- Perbandingan prompting (1–3): apakah membandingkan Claude Chat biasa vs Skill/Project dengan perbedaan output nyata?
- Claude Project (1–3): apakah System Prompt punya peran + konteks bisnis + format output yang spesifik?
- Refleksi (1–3): apakah konkret menyebut perbedaan output spesifik antar cara?
- Artifact (1–3): apakah relevan ke pekerjaan nyata + prompt spesifik?
- MCP Bonus (0–1): opsional, pilih MCP Connector + alasan spesifik ke pekerjaan

Skor Assignment /100 = (Raw / 15) × 100
Level: ≥12 = Baik, 8–11 = Cukup, <8 = Perlu Bimbingan

## Final Project

Peserta mengumpulkan deck 6 slide + live link prototype. Dinilai 5 aspek berbobot, skor akhir 0–100.

Framework slide: NextGen Builders Framework
- Slide 1 (See Clearly): identifikasi pain spesifik + bukti nyata + proses Sharpen ke Claude
- Slide 2–3 (Imagine Boldly): constraint, Diverge (beberapa opsi), Converge (pilih + alasan)
- Slide 4–6 (Ship Bravely): deploy prototype, user testing → gap, Iterate Fast (evaluasi pain)

Rubrik (skala 1–4):
- Prototype berfungsi (35%): 1=tidak ada link, 2=ada tapi tidak fungsi, 3=fungsi tapi ada bug, 4=link aktif + fungsi lancar + mobile-friendly
- Relevansi masalah (25%): 1=sangat umum, 2=nyata tapi tidak spesifik, 3=spesifik + observasi konkret, 4=spesifik + bukti nyata + hipotesis di-challenge ke Claude
- Kualitas deck (20%): 1=tidak lengkap, 2=lengkap tapi alur terputus, 3=alur mengalir tapi Diverge/Converge kurang, 4=alur kuat pain→opsi→pilihan→prototype→gap→iterasi
- Bukti iterasi (10%): 1=tidak ada, 2=ada opsi tapi cara pilih tidak jelas, 3=Converge ada tapi alasan lemah, 4=Diverge→Converge→Commit+gap direspons
- Listen & Iterate (10%): dinilai dari Listen Deeply + Iterate Fast (bukan slide "Refleksi"). 1=tidak ada testing/perubahan, 2=salah satu saja, 3=ada feedback+perubahan tapi kurang nyambung, 4=feedback konkret + perubahan cepat yang menjawabnya

Skor Sertifikat = (Skor Assignment /100 × 40%) + (Skor Final Project × 60%)
Rekomendasi Showcase: skor final ≥ 85

## Cara Jawab

- Bahasa Indonesia, seperti pesan WhatsApp — singkat, langsung ke inti, tidak bertele-tele
- Maksimal 3-5 kalimat per jawaban. Kalau bisa 1-2 kalimat, lebih baik.
- Tidak perlu pembuka, tidak perlu penutup — langsung jawabannya
- Jika ada beberapa poin, tulis per baris tanpa bullet formal, cukup enter-enter
- Jika pertanyaan soal rubrik, sebut angkanya langsung
- Jika tidak yakin atau terlalu kompleks, sarankan tanya Instructor Assistant Juni
- Jangan mengarang informasi yang tidak ada di konteks
- PENTING: Jangan gunakan formatting markdown seperti **bold**, *italic*, atau ## heading. Plain text saja.`;

const SUGGESTED_QUESTIONS = [
  'Bedanya Claude Chat biasa vs pakai Skill itu apa?',
  'Peserta nanya cara buat System Prompt yang baik untuk Claude Project, gimana jawabnya?',
  'Apa itu 3R dan kenapa penting untuk assignment?',
  'Live link prototype peserta 404, itu pengaruh ke skor berapa?',
  'Peserta minta penjelasan soal MCP Connector, jelasin dong',
  'Gimana cara hitung skor sertifikat dari assignment dan final project?',
  'Apa bedanya Diverge, Converge, dan Commit di framework NextGen Builders?',
  'Peserta belum pernah coding, bisa ikut Day 3 Claude Code?',
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 mt-0.5 ${
        isUser ? 'bg-bl-red text-white' : 'bg-bl-blue text-white'
      }`}>
        {isUser ? 'TA' : 'AI'}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-bl-red text-white rounded-tr-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-card'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-bl-blue flex items-center justify-center text-sm font-black text-white shrink-0">AI</div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-bl-blue/40 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function TAChat({ settings }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const endpoint = IS_PROD ? '/api/chat' : (
        import.meta.env.VITE_SUMOPOD_API_KEY
          ? 'https://ai.sumopod.com/v1/chat/completions'
          : 'https://integrate.api.nvidia.com/v1/chat/completions'
      );

      const apiKey = import.meta.env.VITE_SUMOPOD_API_KEY || import.meta.env.VITE_NVIDIA_API_KEY || settings?.apiKey || '';
      const model = IS_PROD ? 'mimo-v2.5-pro' : (settings?.model || 'mimo-v2.5-pro');

      const headers = IS_PROD
        ? { 'Content-Type': 'application/json' }
        : { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'user', content: SYSTEM_PROMPT + '\n\n---\n\nSekarang bantu TA menjawab pertanyaan berikut.' },
            { role: 'assistant', content: 'Siap! Aku TA Assistant MBCL. Tanyakan apa saja tentang kurikulum, rubrik penilaian, atau pertanyaan dari peserta.' },
            ...newMessages,
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let err; try { err = JSON.parse(raw); } catch { err = { error: raw }; }
        throw new Error(err.error || `Error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error('Tidak ada respons dari AI');

      const clean = reply.trim()
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^#{1,3}\s+/gm, '');
      setMessages([...newMessages, { role: 'assistant', content: clean }]);
    } catch (e) {
      setError(e.message);
      setMessages(newMessages);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {isEmpty && (
          <div className="text-center pt-8 pb-4">
            <div className="w-16 h-16 rounded-3xl bg-bl-blue flex items-center justify-center text-3xl mx-auto mb-4">💬</div>
            <h2 className="text-xl font-black text-gray-900">TA Assistant</h2>
            <p className="text-sm text-gray-500 mt-1 mb-8">Tanya apa saja — rubrik, kurikulum, cara jawab peserta</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto text-left px-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs text-left px-4 py-3 bg-white border border-gray-200 hover:border-bl-blue hover:text-bl-blue rounded-xl transition-colors font-medium leading-snug shadow-card"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div className="text-xs text-bl-red bg-bl-red-light border border-bl-red-mid rounded-xl px-4 py-3 font-medium">
            ⚠ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-3 sm:px-4 py-3">
        {!isEmpty && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-gray-600 mb-2 font-medium"
          >
            ↺ Clear chat
          </button>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tulis pertanyaan dari peserta atau tanya soal rubrik..."
            rows={2}
            className="flex-1 text-sm border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-bl-blue transition-colors resize-none leading-relaxed"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-bl-blue text-white flex items-center justify-center disabled:opacity-30 hover:bg-bl-blue-dark transition-colors shrink-0 text-lg"
          >
            ↑
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">Enter untuk kirim · Shift+Enter untuk baris baru</div>
      </div>
    </div>
  );
}
