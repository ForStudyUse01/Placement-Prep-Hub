import { callAI, estimateTokens, getPrefs, PROVIDERS } from "../ai.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { addTokens } from "../storage.js";

export function render(root) {
  const prefs = getPrefs();
  renderHTML(root, `
    <h1>️ Prompt Improvement Lab</h1>
    <p class="lead">Paste a prompt you'd actually send an AI coding assistant. The model critiques it, shows real token usage from the API response, and rewrites it tighter — exactly the "prompt engineering for coding" skill Capgemini's AI-assisted round rewards.</p>
    <div class="card">
      <div class="field">
        <label>Your prompt</label>
        <textarea id="promptBox" rows="7" placeholder="e.g. hey can u please write me some code that like takes a list of numbers and if its possible can you find the two numbers that when u add them together equal a target number, thanks so much i really appreciate it, in python if thats ok"></textarea>
      </div>
      <p class="muted" style="font-size:12px">Local estimate before sending: <b id="localEstimate">0</b> tokens (~4 chars/token). Using <b>${escapeHtml(PROVIDERS[prefs.primaryProvider].label)}</b> as primary.</p>
      <button class="btn" id="analyzeBtn">Analyze &amp; improve</button>
      <span class="muted" id="status" style="margin-left:10px;font-size:12px"></span>
    </div>
    <div id="resultArea" style="margin-top:18px"></div>
  `);

  const promptBox = root.querySelector("#promptBox");
  const localEstimate = root.querySelector("#localEstimate");
  const updateEstimate = () => (localEstimate.textContent = estimateTokens(promptBox.value));
  promptBox.addEventListener("input", updateEstimate);
  updateEstimate();

  root.querySelector("#analyzeBtn").addEventListener("click", () => analyze(root));
}

async function analyze(root) {
  const promptBox = root.querySelector("#promptBox");
  const text = promptBox.value.trim();
  if (!text) return;
  const status = root.querySelector("#status");
  const btn = root.querySelector("#analyzeBtn");
  btn.disabled = true;
  status.textContent = "Calling model…";

  const sys = `You are a prompt-engineering coach for a student practicing AI-assisted coding rounds.
Given the user's prompt, respond in EXACTLY this structure, nothing else:

ISSUES:
- (bullet list of concrete problems: vagueness, missing constraints, filler words/politeness that cost tokens, missing language/format spec, missing edge cases)

REWRITE:
(a single tightened version of the prompt — same intent, fewer tokens, clearer structure: role/context/task/constraints)

Keep the whole reply under 180 words.`;

  try {
    const result = await callAI({ messages: [{ role: "system", content: sys }, { role: "user", content: text }], maxTokens: 400 });
    addTokens(result.usage.total);
    import("../app.js").then((m) => m.refreshTokenPill?.());

    const { issues, rewrite } = splitResponse(result.text);
    const originalTokens = estimateTokens(text);
    const rewriteTokens = estimateTokens(rewrite || "");
    const savedPct = rewriteTokens && originalTokens ? Math.max(0, Math.round((1 - rewriteTokens / originalTokens) * 100)) : 0;

    renderHTML(root.querySelector("#resultArea"), `
      <div class="grid cols-3">
        <div class="card"><div class="stat"><span class="num">${result.usage.prompt}</span><span class="lbl">Prompt tokens (actual, from API)</span></div></div>
        <div class="card"><div class="stat"><span class="num">${result.usage.completion}</span><span class="lbl">Completion tokens for this critique</span></div></div>
        <div class="card"><div class="stat"><span class="num">${savedPct}%</span><span class="lbl">Estimated savings if you use the rewrite</span></div></div>
      </div>
      <div class="card" style="margin-top:14px">
        <h2>Where you're losing tokens</h2>
        <div class="topic-body">${issues}</div>
      </div>
      <div class="card" style="margin-top:14px">
        <h2>Tightened rewrite (~${rewriteTokens} tokens vs ~${originalTokens} original)</h2>
        <pre>${escapeHtml(rewrite)}</pre>
        <button class="btn secondary" id="useRewriteBtn">Use this rewrite</button>
      </div>
      <p class="muted" style="font-size:11px;margin-top:8px">Model: ${escapeHtml(result.provider)}/${escapeHtml(result.model)}${result.usage.estimated ? " · token counts estimated (provider gave no usage field)" : " · token counts are the real numbers returned by the API"}</p>
    `);
    root.querySelector("#useRewriteBtn")?.addEventListener("click", () => {
      promptBox.value = rewrite;
      promptBox.dispatchEvent(new Event("input"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    status.textContent = result.usedBackup ? "Primary failed — used backup model." : "Done.";
  } catch (err) {
    status.textContent = `Failed: ${err.message}`;
  }
  btn.disabled = false;
}

function splitResponse(text) {
  const issuesMatch = text.match(/ISSUES:([\s\S]*?)REWRITE:/i);
  const rewriteMatch = text.match(/REWRITE:([\s\S]*)/i);
  const issuesRaw = issuesMatch ? issuesMatch[1].trim() : text;
  const rewrite = rewriteMatch ? rewriteMatch[1].trim() : "";
  const issuesHtml = "<ul>" + issuesRaw.split("\n").map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean)
    .map((l) => `<li>${escapeForDisplay(l)}</li>`).join("") + "</ul>";
  return { issues: issuesHtml, rewrite };
}
function escapeForDisplay(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
