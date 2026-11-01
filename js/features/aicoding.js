import { CODING_PROBLEMS } from "../data/coding_problems.js";
import { PROVIDERS, getPrefs, callAI } from "../ai.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set, addTokens } from "../storage.js";

let state = null; // { problem, provider, model, budget, used, messages:[], language }

export function render(root) {
  const prefs = getPrefs();
  renderHTML(root, `
    <h1>AI-Assisted Coding Round</h1>
    <p class="lead">Pick a problem, pick which free-tier model to use, set a token budget, then prompt the model like you would in a real round. Primary model fails or runs out of quota → it automatically falls back to your backup model.</p>
    <div class="card">
      <div class="grid cols-3">
        <div class="field">
          <label>Problem</label>
          <select id="problemSelect"></select>
        </div>
        <div class="field">
          <label>Language</label>
          <select id="langSelect">
            <option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option><option>C</option>
          </select>
        </div>
        <div class="field">
          <label>Token budget for this round</label>
          <input type="number" id="budgetInput" value="${prefs.budget}" min="200" step="100"/>
        </div>
      </div>
      <p class="muted" style="font-size:12px">Using primary: <b>${escapeHtml(PROVIDERS[prefs.primaryProvider].label)}</b> (${escapeHtml(prefs.primaryModel)}) · backup: <b>${escapeHtml(PROVIDERS[prefs.backupProvider].label)}</b> (${escapeHtml(prefs.backupModel)}). Change these in Settings.</p>
      <button class="btn" id="startBtn">Start round →</button>
    </div>
    <div id="roundArea" style="margin-top:20px"></div>
  `);

  const problemSelect = root.querySelector("#problemSelect");
  renderHTML(problemSelect, CODING_PROBLEMS.map((p) => `<option value="${p.id}">${escapeHtml(p.title)} — ${escapeHtml(p.difficulty)}</option>`).join(""));

  root.querySelector("#startBtn").addEventListener("click", () => {
    const problem = CODING_PROBLEMS.find((p) => p.id === problemSelect.value);
    const language = root.querySelector("#langSelect").value;
    const budget = Number(root.querySelector("#budgetInput").value) || 2000;
    state = { problem, language, budget, used: 0, messages: [] };
    paintRound(root);
  });
}

function paintRound(root) {
  const area = root.querySelector("#roundArea");
  const { problem, language, budget, used } = state;
  const pct = Math.min(100, Math.round((used / budget) * 100));
  renderHTML(area, `
    <div class="card">
      <h2>${escapeHtml(problem.title)} <span class="tag">${escapeHtml(problem.concept)}</span> <span class="tag warn">${escapeHtml(problem.difficulty)}</span></h2>
      <p>${escapeHtml(problem.statement)}</p>
      <p class="muted" style="font-size:13px"><b>Constraints:</b> ${escapeHtml(problem.constraints)}</p>
      <h2 style="font-size:14px;margin-top:12px">Test cases</h2>
      <table style="width:100%;font-size:13px;border-collapse:collapse">${problem.tests.map((t) => `<tr><td style="padding:3px 8px 3px 0"><code>${escapeHtml(t.input)}</code></td><td>→ <code>${escapeHtml(t.expected)}</code></td></tr>`).join("")}</table>
      <p class="muted" style="font-size:13px">Target language: <b>${escapeHtml(language)}</b></p>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="flex between">
        <span class="muted" style="font-size:12px">Token budget used: ${used} / ${budget}</span>
        <span class="muted" style="font-size:12px">${budget - used <= 0 ? "Budget exhausted" : `${budget - used} left`}</span>
      </div>
      <div class="progress-bar" style="margin:8px 0 14px"><div style="width:${pct}%;${pct>=100?'background:var(--danger)':''}"></div></div>
      <div id="chatLog"></div>
      <div class="field" style="margin-top:12px">
        <label>Your prompt to the AI</label>
        <textarea id="promptInput" rows="4" placeholder="e.g. Write an O(n) ${escapeHtml(language)} solution for this problem using a hash map, with input/output examples."></textarea>
      </div>
      <button class="btn" id="sendBtn" ${budget - used <= 0 ? "disabled" : ""}>Send to AI</button>
      <button class="btn secondary" id="resetBtn">New round</button>
      <span class="muted" id="aiStatus" style="margin-left:10px;font-size:12px"></span>
    </div>
  `);
  paintChatLog(area);
  area.querySelector("#resetBtn").addEventListener("click", () => { state = null; render(root); });
  area.querySelector("#sendBtn").addEventListener("click", () => sendPrompt(root));
}

function paintChatLog(area) {
  const log = area.querySelector("#chatLog");
  renderHTML(log, state.messages.map((m) => `
    <div class="card" style="margin-bottom:10px;background:${m.role === "user" ? "var(--panel-2)" : "var(--bg-soft)"}">
      <p class="muted" style="font-size:11px;margin:0 0 6px">${m.role === "user" ? "You" : `AI (${escapeHtml(m.meta || "")})`}</p>
      <pre style="white-space:pre-wrap">${escapeHtml(m.content)}</pre>
    </div>
  `).join("") || `<p class="muted">No messages yet — write your first prompt below. Be specific: language, approach, complexity target, and edge cases.</p>`);
}

async function sendPrompt(root) {
  const area = root.querySelector("#roundArea");
  const input = area.querySelector("#promptInput");
  const text = input.value.trim();
  if (!text) return;
  const statusEl = area.querySelector("#aiStatus");
  const sendBtn = area.querySelector("#sendBtn");
  sendBtn.disabled = true;
  statusEl.textContent = "Calling model…";

  state.messages.push({ role: "user", content: text });
  input.value = "";
  paintChatLog(area);

  const sys = `You are an AI pair-programming assistant helping a candidate practice for a campus placement AI-assisted coding round.
Problem: ${state.problem.title} — ${state.problem.statement}
Constraints: ${state.problem.constraints}
Sample tests (input → expected): ${state.problem.tests.map((t) => `${t.input} → ${t.expected}`).join("; ")}.
Target language: ${state.language}.
Give a correct, reasonably optimized solution with a one-paragraph explanation of the approach and its time/space complexity. Keep the whole reply under 300 words.`;

  try {
    const result = await callAI({
      messages: [{ role: "system", content: sys }, ...state.messages.map((m) => ({ role: m.role, content: m.content }))],
      maxTokens: 700
    });
    state.used += result.usage.total;
    addTokens(result.usage.total);
    import("../app.js").then((m) => m.refreshTokenPill?.());
    state.messages.push({
      role: "assistant",
      content: result.text,
      meta: `${result.provider}/${result.model}${result.autoSwitched ? " (auto-switched " + result.autoSwitched + ")" : ""}${result.usedBackup ? " — backup used" : ""}${result.usage.estimated ? ", ~estimated tokens" : ""}`
    });
    statusEl.textContent = result.usedBackup ? `Primary failed (${result.primaryError}) — used backup instead.` : "Done.";
  } catch (err) {
    state.messages.push({ role: "assistant", content: `Error: ${err.message}`, meta: "error" });
    statusEl.textContent = "Both primary and backup failed — check your API keys in Settings.";
  }
  sendBtn.disabled = state.used >= state.budget;
  paintRound(root);
}
