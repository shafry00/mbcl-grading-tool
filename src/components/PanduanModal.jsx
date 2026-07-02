import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';

// Custom renderer: bake copy button into HTML string — no DOM manipulation needed
const renderer = {
  code({ text, lang }) {
    const escaped = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const langAttr = lang ? ` class="language-${lang}"` : '';
    return `<div class="code-block" style="position:relative;margin:1.25em 0"><pre style="margin:0"><code${langAttr}>${escaped}</code></pre><button class="copy-trigger" style="position:absolute;top:8px;right:8px;background:#2563EB;color:#fff;border:none;border-radius:6px;padding:4px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.4">Copy</button></div>`;
  }
};

marked.use({ breaks: true, gfm: true, renderer });

const TABS = [
  { id: 'assignment', label: 'Assignment', file: '/docs/panduan-assignment.md' },
  { id: 'final', label: 'Final Project', file: '/docs/panduan-final-project.md' },
];

function copyText(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(resolve).catch(() => execCopy(text) ? resolve() : reject());
    } else {
      execCopy(text) ? resolve() : reject();
    }
  });
}

function execCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, 99999);
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  return ok;
}

export default function PanduanModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('assignment');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const contentRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2000);
  }, []);

  // Load markdown per tab
  useEffect(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    if (content[activeTab]) return;
    setLoading(true);
    fetch(tab.file)
      .then((r) => r.text())
      .then((text) => {
        setContent((prev) => ({ ...prev, [activeTab]: marked.parse(text) }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  // Event delegation — one listener on container, handles all copy buttons
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = (e) => {
      if (!e.target.classList.contains('copy-trigger')) return;
      const code = e.target.previousElementSibling?.querySelector('code');
      if (!code) return;
      copyText(code.textContent.trim()).then(showToast).catch(showToast);
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [showToast]);

  function downloadSkill() {
    const a = document.createElement('a');
    a.href = '/docs/skill-grading.md';
    a.download = 'MBCL 1 Skill Grading — System Prompt.md';
    a.click();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      {toast && (
        <div style={{ position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'#10B981', color:'#fff', padding:'8px 22px', borderRadius:'999px', fontWeight:700, fontSize:'14px', boxShadow:'0 4px 16px rgba(0,0,0,0.18)', pointerEvents:'none', whiteSpace:'nowrap' }}>
          ✓ Tersalin!
        </div>
      )}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <div className="font-black text-gray-900 text-lg">Panduan Penilaian</div>
            <div className="text-sm text-gray-500 mt-0.5">MBCL Cohort 1 — Untuk Teaching Assistant</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadSkill}
              className="text-sm px-4 py-2 bg-bl-blue text-white rounded-xl font-bold hover:bg-bl-blue-dark transition-colors shadow-sm"
            >
              ↓ Download Skill
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-gray-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-t-xl text-sm font-bold transition-colors border-b-2 -mb-px ${
                activeTab === t.id
                  ? 'border-bl-blue text-bl-blue bg-bl-blue-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium">Memuat panduan...</div>
          ) : (
            <div
              ref={contentRef}
              className="prose prose-sm max-w-none
                prose-headings:font-black prose-h1:text-xl prose-h2:text-base prose-h3:text-sm
                prose-h1:text-gray-900 prose-h2:text-bl-blue prose-h3:text-gray-700
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-li:text-gray-600 prose-li:leading-relaxed
                prose-table:text-xs prose-thead:bg-bl-blue-light
                prose-th:text-bl-blue prose-th:font-bold prose-th:px-3 prose-th:py-2
                prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-200
                prose-blockquote:border-l-bl-blue prose-blockquote:text-gray-600 prose-blockquote:bg-bl-blue-light prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-bl-red prose-code:font-mono prose-code:text-xs
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-4
                prose-strong:text-gray-900 prose-hr:border-gray-200"
              dangerouslySetInnerHTML={{ __html: content[activeTab] || '' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
