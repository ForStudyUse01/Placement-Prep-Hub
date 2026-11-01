import { AI_TOPICS, AI_ROWS } from "../data/ailiteracy.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set } from "../storage.js";

let t = null; // active test
let timer = null;

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

export function render(root) {
  clearInterval(timer);
  t = null;
  const hist = get("ailit:history", []);
  renderHTML(root, `
    <div class="kicker">Capgemini Exceller · Section 1</div>
    <h1>AI Literacy Test</h1>
    <p class="lead">${AI_ROWS.length} multiple-choice questions on generative AI, LLMs, prompting, RAG, agentic AI, responsible AI, evaluation and AI in software development. Reported format: about 20 questions, roughly a minute each, no negative marking. Reasoning, not model-building.</p>
    <div class="card">
      <div class="grid cols-3" style="border:none">
        <div class="field" style="padding:0 12px 0 0;border:none"><label>Mode</label>
          <select id="mode"><option value="mock">Mock test: 20 mixed questions, 20 min</option><option value="full">Full bank: all ${AI_ROWS.length} questions</option><option value="topic">Single topic practice</option></select></div>
        <div class="field" style="padding:0 12px;border:none"><label>Topic (topic mode)</label>
          <select id="topic">${AI_TOPICS.map((x) => `<option>${escapeHtml(x)}</option>`).join("")}</select></div>
        <div style="border:none;padding-top:20px"><button class="btn" id="start">Begin test</button></div>
      </div>
    </div>
    <div class="section"><h2>Previous attempts</h2>
      ${hist.length ? `<table style="width:100%;font-size:14px"><tr style="text-align:left"><th>Date</th><th>Mode</th><th>Score</th></tr>${hist.slice(-8).reverse().map((h) => `<tr><td style="padding:5px 0">${escapeHtml(h.date)}</td><td>${escapeHtml(h.mode)}</td><td>${h.score}/${h.total}</td></tr>`).join("")}</table>` : `<p class="muted">None yet.</p>`}
    </div>
  `);
  root.querySelector("#start").addEventListener("click", () => {
    const mode = root.querySelector("#mode").value;
    const topic = root.querySelector("#topic").value;
    let pool = AI_ROWS;
    if (mode === "topic") pool = AI_ROWS.filter((r) => r[0] === topic);
    pool = shuffle(pool);
    if (mode === "mock") pool = pool.slice(0, 20);
    const qs = pool.map(([tp, q, opts, c, ex]) => {
      const order = shuffle(opts.map((o, i) => i));
      return { tp, q, opts: order.map((i) => opts[i]), correct: order.indexOf(c), ex };
    });
    t = { mode, qs, i: 0, ans: new Array(qs.length).fill(null), flag: new Set(), left: qs.length * 60 };
    paint(root);
    timer = setInterval(() => {
      t.left -= 1;
      const el = document.getElementById("ailTimer");
      if (el) el.textContent = fmt(t.left);
      if (t.left <= 0) finish(root);
    }, 1000);
  });
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function paint(root) {
  const q = t.qs[t.i];
  renderHTML(root, `
    <div class="flex between"><div class="kicker" style="margin:0">${escapeHtml(q.tp)}</div><span class="timer" id="ailTimer">${fmt(t.left)}</span></div>
    <h2 style="margin-top:14px">Question ${t.i + 1} of ${t.qs.length}</h2>
    <p style="font-size:18px;font-family:var(--serif);max-width:70ch">${escapeHtml(q.q)}</p>
    <div id="opts" style="max-width:70ch"></div>
    <div class="flex gap" style="margin-top:16px">
      <button class="btn secondary" id="prev" ${t.i === 0 ? "disabled" : ""}>Previous</button>
      <button class="btn secondary" id="flag">${t.flag.has(t.i) ? "Unflag" : "Flag for review"}</button>
      ${t.i < t.qs.length - 1 ? `<button class="btn" id="next">Next</button>` : `<button class="btn success" id="submit">Submit test</button>`}
    </div>
    <div class="section"><label>Navigator</label><div class="flex wrap" style="gap:6px" id="nav"></div></div>
  `);
  renderHTML(root.querySelector("#opts"), q.opts.map((o, i) => `<button class="option" data-i="${i}" style="${t.ans[t.i] === i ? "border-color:var(--accent);background:var(--panel-2)" : ""}"><b style="font-family:var(--mono);margin-right:10px">${"ABCD"[i]}</b>${escapeHtml(o)}</button>`).join(""));
  renderHTML(root.querySelector("#nav"), t.qs.map((_, i) => {
    const st = i === t.i ? "background:var(--text);color:var(--bg)" : t.flag.has(i) ? "border-color:var(--warn);color:var(--warn)" : t.ans[i] !== null ? "border-color:var(--accent);color:var(--accent)" : "";
    return `<button class="btn secondary" data-n="${i}" style="padding:4px 9px;font-family:var(--mono);${st}">${i + 1}</button>`;
  }).join(""));
  root.querySelectorAll(".option").forEach((b) => b.addEventListener("click", () => { t.ans[t.i] = Number(b.dataset.i); paint(root); }));
  root.querySelectorAll("#nav [data-n]").forEach((b) => b.addEventListener("click", () => { t.i = Number(b.dataset.n); paint(root); }));
  root.querySelector("#prev").addEventListener("click", () => { t.i--; paint(root); });
  root.querySelector("#flag").addEventListener("click", () => { t.flag.has(t.i) ? t.flag.delete(t.i) : t.flag.add(t.i); paint(root); });
  root.querySelector("#next")?.addEventListener("click", () => { t.i++; paint(root); });
  root.querySelector("#submit")?.addEventListener("click", () => {
    const blank = t.ans.filter((a) => a === null).length;
    if (blank && !confirm(`${blank} unanswered. Submit anyway?`)) return;
    finish(root);
  });
}

function finish(root) {
  clearInterval(timer);
  const score = t.qs.reduce((n, q, i) => n + (t.ans[i] === q.correct ? 1 : 0), 0);
  const byTopic = {};
  t.qs.forEach((q, i) => {
    byTopic[q.tp] = byTopic[q.tp] || [0, 0];
    byTopic[q.tp][1]++;
    if (t.ans[i] === q.correct) byTopic[q.tp][0]++;
  });
  const hist = get("ailit:history", []);
  hist.push({ date: new Date().toLocaleDateString(), mode: t.mode, score, total: t.qs.length });
  set("ailit:history", hist);
  renderHTML(root, `
    <div class="kicker">Result</div>
    <h1>${score} / ${t.qs.length}</h1>
    <p class="lead">${Math.round((score / t.qs.length) * 100)}% accuracy. Weak topics are the ones with the lowest ratio below.</p>
    <div class="grid cols-4">${Object.entries(byTopic).map(([k, [a, b]]) => `<div class="card"><div class="stat"><span class="num">${a}/${b}</span><span class="lbl">${escapeHtml(k)}</span></div></div>`).join("")}</div>
    <div class="section"><h2>Review</h2><div id="rev"></div></div>
    <div class="flex gap" style="margin-top:20px"><button class="btn" id="again">New test</button></div>
  `);
  renderHTML(root.querySelector("#rev"), t.qs.map((q, i) => {
    const ok = t.ans[i] === q.correct;
    return `<div class="card" style="margin-bottom:-1px"><span class="tag ${ok ? "good" : "danger"}">${ok ? "correct" : t.ans[i] === null ? "skipped" : "wrong"}</span><span class="tag">${escapeHtml(q.tp)}</span>
      <p style="margin:8px 0 4px"><b>${i + 1}. ${escapeHtml(q.q)}</b></p>
      <p class="muted" style="margin:0;font-size:14px">${ok ? "" : `Your answer: ${t.ans[i] === null ? "none" : escapeHtml(q.opts[t.ans[i]])}. `}Correct: <b>${escapeHtml(q.opts[q.correct])}</b>. ${escapeHtml(q.ex)}</p></div>`;
  }).join(""));
  root.querySelector("#again").addEventListener("click", () => render(root));
}
