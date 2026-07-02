import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '50mb' }));

// Serve built frontend
app.use(express.static(path.join(__dirname, 'dist')));

// ── API config helpers ────────────────────────────────────────────────────────

function allProviders() {
  const providers = [];
  const opencodeKey = process.env.OPENCODE_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  // Primary: OpenCode Zen — Big Pickle
  if (opencodeKey) providers.push({ apiKey: opencodeKey, baseUrl: 'https://opencode.ai/zen/v1/chat/completions', model: 'big-pickle', name: 'OpenCode/BigPickle', timeout: 120000 });
  // Fallback: NVIDIA NIM — Kimi K2.6
  if (nvidiaKey) providers.push({ apiKey: nvidiaKey, baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions', model: 'moonshotai/kimi-k2.6', name: 'NVIDIA/Kimi-K2.6', timeout: 120000 });
  return providers;
}

async function callWithFallback(providers, body) {
  let lastErr;
  for (const p of providers) {
    try {
      const model = p.model || body.model;
      const r = await fetch(p.baseUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${p.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: AbortSignal.timeout(p.timeout),
      });
      const raw = await r.text();
      let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
      if (!r.ok) { lastErr = new Error(data.error?.message || data.error || `HTTP ${r.status}`); continue; }
      // Beberapa reasoning model (big-pickle/deepseek) bisa habiskan token di reasoning
      // dan balikan content kosong (finish_reason=length). Anggap gagal → fallback provider lain.
      const content = data.choices?.[0]?.message?.content;
      if (!content || !content.trim()) {
        const fr = data.choices?.[0]?.finish_reason || 'unknown';
        console.error(`[${p.name}] empty content (finish=${fr}) — trying next provider`);
        lastErr = new Error(`${p.name} mengembalikan respons kosong (finish=${fr})`);
        continue;
      }
      return data;
    } catch (e) {
      console.error(`[${p.name}] failed: ${e.message} — trying next provider`);
      lastErr = e;
    }
  }
  throw lastErr || new Error('All providers failed');
}

// ── Live-link checker (server-side; browser blocked by CORS) ───────────────────

function extractUrls(text) {
  const re = /https?:\/\/[^\s"'<>)\]}]+/gi;
  const raw = (text.match(re) || []).map(u => u.replace(/[.,;:]+$/, ''));
  const skip = /belajarlagi|founderplus|youtube\.com|youtu\.be|google\.com|docs\.google|drive\.google|canva\.com|notion\.so|github\.com\/[^/]+$|figma\.com/i;
  return [...new Set(raw)].filter(u => !skip.test(u)).slice(0, 3);
}

async function fetchPageText(url) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MBCL-Grader/1.0)', 'Accept-Language': 'id,en;q=0.9' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const raw = await r.text();
    const txt = raw
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\s{2,}/g, ' ').trim();
    return { url, ok: r.ok, status: r.status, len: txt.length, text: txt.slice(0, 9000) };
  } catch (e) {
    return { url, ok: false, status: 0, error: e.name === 'TimeoutError' ? 'timeout' : e.message };
  }
}

async function buildLinkReport(messages) {
  const allText = messages.map(m =>
    typeof m.content === 'string'
      ? m.content
      : Array.isArray(m.content) ? m.content.filter(c => c.type === 'text').map(c => c.text).join(' ') : ''
  ).join('\n');
  const urls = extractUrls(allText);
  if (!urls.length) return 'Tidak ada link live yang ditemukan di submission.';
  const results = await Promise.all(urls.map(fetchPageText));
  return results.map(r =>
    r.ok
      ? `URL: ${r.url}\nSTATUS: LINK BISA DIBUKA — server berhasil membaca isi halaman.\nISI HALAMAN (seluruh teks yang terlihat):\n${r.text}`
      : `URL: ${r.url}\nSTATUS: LINK TIDAK BISA DIBUKA.`
  ).join('\n\n---\n\n');
}

// ── Grading proxy ─────────────────────────────────────────────────────────────

app.post('/api/grade', async (req, res) => {
  const providers = allProviders();
  if (!providers.length) return res.status(500).json({ error: 'No API key configured' });
  const { messages, temperature, max_tokens, model, checkLinks } = req.body;
  try {
    let msgs = messages;
    if (checkLinks) {
      const report = await buildLinkReport(messages);
      msgs = [...messages, { role: 'user', content: `HASIL PENGECEKAN LINK LIVE OLEH SERVER (gunakan untuk menilai aspek prototype):\n\n${report}` }];
    }
    const data = await callWithFallback(providers, { messages: msgs, temperature, max_tokens, model });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── Chat endpoint with agentic tool loop ──────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const providers = allProviders();
  if (!providers.length) return res.status(500).json({ error: 'No API key configured' });

  const { temperature, max_tokens } = req.body;
  let messages = [...req.body.messages];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'web_search',
        description: 'Cari informasi di internet. Gunakan saat tidak tahu jawabannya dari konteks yang ada — berita terbaru, fakta, dll.',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string', description: 'Query pencarian' } },
          required: ['query'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'web_fetch',
        description: 'Ambil konten dari URL spesifik. Gunakan setelah web_search untuk membaca isi halaman.',
        parameters: {
          type: 'object',
          properties: { url: { type: 'string', description: 'URL yang ingin difetch' } },
          required: ['url'],
        },
      },
    },
  ];

  async function callModel(msgs) {
    let lastErr;
    for (const p of providers) {
      // Pass tools to providers that return structured tool_calls (OpenCode Zen + NVIDIA NIM)
      const supportsTools = p.baseUrl.includes('opencode.ai') || p.baseUrl.includes('nvidia');
      const body = supportsTools
        ? { messages: msgs, temperature, max_tokens, tools, tool_choice: 'auto' }
        : { messages: msgs, temperature, max_tokens };
      try {
        const model = p.model;
        const r = await fetch(p.baseUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${p.apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, model }),
          signal: AbortSignal.timeout(p.timeout),
        });
        const raw = await r.text();
        let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
        if (!r.ok) { lastErr = new Error(data.error?.message || data.error || `HTTP ${r.status}`); continue; }
        return data;
      } catch (e) {
        console.error(`[${p.name}] chat failed: ${e.message} — trying next`);
        lastErr = e;
      }
    }
    throw lastErr || new Error('All providers failed');
  }

  async function fetchAndStrip(url) {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MBCL-TA-Bot/1.0)', 'Accept-Language': 'id,en;q=0.9' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.text())
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\s{2,}/g, ' ').trim().slice(0, 4000);
  }

  async function executeTool(name, args) {
    if (name === 'web_search') {
      const q = args.query;
      const results = [];

      // 1. Tavily — best results if key configured
      const tavilyKey = process.env.TAVILY_API_KEY;
      if (tavilyKey) {
        try {
          const tr = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: tavilyKey, query: q, search_depth: 'basic', max_results: 5 }),
            signal: AbortSignal.timeout(10000),
          });
          if (tr.ok) {
            const td = await tr.json();
            (td.results || []).slice(0, 5).forEach((r, i) => {
              results.push(`${i + 1}. ${r.title}\n   URL: ${r.url}\n   ${(r.content || '').slice(0, 200)}`);
            });
            if (td.answer) results.unshift(`[Ringkasan Tavily] ${td.answer}`);
          }
        } catch {}
      }

      // 2. DDG Instant Answer — facts / Wikipedia
      if (results.length < 3) {
        try {
          const ddg = await (await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`,
            { signal: AbortSignal.timeout(8000) }
          )).json();
          if (ddg.AbstractText) results.push(`[Ringkasan] ${ddg.AbstractText}\nSumber: ${ddg.AbstractURL}`);
          if (ddg.Answer) results.push(`[Jawaban Instan] ${ddg.Answer}`);
          (ddg.RelatedTopics || []).slice(0, 2).forEach(r => {
            if (r.Text && r.FirstURL) results.push(`- ${r.Text}\n  URL: ${r.FirstURL}`);
          });
        } catch {}
      }

      // 3. Google News RSS — berita terbaru
      try {
        const rssText = await (await fetch(
          `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=id&gl=ID&ceid=ID:id`,
          { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MBCL-TA-Bot/1.0)' }, signal: AbortSignal.timeout(8000) }
        )).text();
        const itemRe = /<item>([\s\S]*?)<\/item>/gi;
        let m, newsCount = 0;
        while ((m = itemRe.exec(rssText)) !== null && newsCount < 5) {
          const item = m[1];
          const title = (item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          const link = (item.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '').trim();
          const desc = (item.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || '')
            .replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().slice(0, 150);
          if (title && link) { results.push(`[Berita] ${title}\n  URL: ${link}${desc ? '\n  ' + desc : ''}`); newsCount++; }
        }
      } catch {}

      return results.length
        ? `Hasil pencarian untuk "${q}":\n\n${results.join('\n\n')}`
        : `Tidak ada hasil untuk: ${q}.`;
    }

    if (name === 'web_fetch') {
      try { return await fetchAndStrip(args.url); } catch (e) { return `Gagal fetch: ${e.message}`; }
    }

    return 'Tool tidak dikenali';
  }

  try {
    let iterations = 0;
    while (iterations < 5) {
      iterations++;
      const data = await callModel(messages);
      const choice = data.choices?.[0];
      if (!choice) throw new Error('Tidak ada respons dari model');
      const msg = choice.message;
      messages.push(msg);

      if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
        for (const tc of msg.tool_calls) {
          let args; try { args = JSON.parse(tc.function.arguments); } catch { args = {}; }
          const result = await executeTool(tc.function.name, args);
          messages.push({ role: 'tool', tool_call_id: tc.id, content: result });
        }
        continue;
      }
      return res.json(data);
    }
    res.status(500).json({ error: 'Tool loop exceeded max iterations' });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => console.log(`MBCL Grading Tool running on port ${PORT}`));
