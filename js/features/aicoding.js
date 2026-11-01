import { CODING_PROBLEMS, fmtCase } from "../data/coding_problems.js";
import { PROVIDERS, getPrefs, callAI, estimateTokens } from "../ai.js";
import { runTests, extractCode } from "../runner.js";
import { renderHTML, escapeHtml as esc } from "../dom.js";
import { get, set } from "../storage.js";

let state = null; // { problem, language, budget, used, messages, code, result, attempts }

export function render(root) {
  const prefs = getPrefs();
  const solved = get("aicode:solved", {});
  renderHTML(root, `
    <div class="kicker">Capgemini Exceller · Section 3</div>
    <h1>AI-Assisted Coding Round</h1>
    <p class="lead">Write a prompt, the model answers with code, and your code is run against the test cases right here in the browser. Visible tests show expected vs actual; hidden tests catch hard-coded answers. If the primary model fails, your backup model is used automatically.</p>
    <div class="card">
      <div class="grid cols-3" style="border:none">
        <div class="field" style="border:none;padding-right:12px"><label>Problem</label><select id="problemSelect"></select></div>
        <div class="field" style="border:none;padding-right:12px"><label>Language (auto-checked)</label><select id="langSelect"><option>Python</option><option>JavaScript</option></select></div>
        <div class="field" style="border:none"><label>Token budget</label><input type="number" id="budgetInput" value="${prefs.budget}" min="200" step="100"/></div>
      </div>
      <p class="muted" style="font-size:13px">Primary: <b>${esc(PROVIDERS[prefs.primaryProvider].label)}</b> (${esc(prefs.primaryModel)}). Backup: <b>${esc(PROVIDERS[prefs.backupProvider].label)}</b> (${esc(prefs.backupModel)}). Change in Settings. Java, C and C++ cannot be executed in a browser, so only Python and JavaScript are auto-checked.</p>
      <button class="btn" id="startBtn">Start round</button>
    </div>
    <div id="roundArea" style="margin-top:24px"></div>
  `);
  const sel = root.querySelector("#problemSelect");
  renderHTML(sel, CODING_PROBLEMS.map((p) => `<option value="${p.id}">${esc(p.title)} (${esc(p.difficulty)})${solved[p.id] ? " ✓" : ""}</option>`).join(""));
  root.querySelector("#startBtn").addEventListener("click", () => {
    state = {
      problem: CODING_PROBLEMS.find((p) => p.id === sel.value),
      language: root.querySelector("#langSelect").value,
      budget: Number(root.querySelector("#budgetInput").value) || 2000,
      used: 0, messages: [], code: "", result: null, attempts: 0, running: false, note: ""
    };
    paintRound(root);
  });
}

function paintRound(root) {
  const area = root.querySelector("#roundArea");
  const { problem, language, budget, used } = state;
  const sig = language === "Python" ? problem.py : problem.js;
  const pct = Math.min(100, Math.round((used / budget) * 100));
  renderHTML(area, `
    <div class="card">
      <h2>${esc(problem.title)} <span class="tag">${esc(problem.concept)}</span> <span class="tag warn">${esc(problem.difficulty)}</span></h2>
      <p>${esc(problem.statement)}</p>
      <p class="muted" style="font-size:13px"><b>Constraints:</b> ${esc(problem.constraints)}</p>
      <p style="font-size:13px"><b>Your code must define:</b> <code>${esc(sig)}</code></p>
      <label style="margin-top:12px">Visible test cases (${problem.hidden.length} more are hidden)</label>
      <table style="width:100%;font-size:13px"><tr style="text-align:left"><th>Call</th><th>Expected</th></tr>${problem.cases.map((c) => { const [call, exp] = fmtCase(problem, c, language); return `<tr><td style="padding:3px 8px 3px 0"><code>${esc(call)}</code></td><td><code>${esc(exp)}</code></td></tr>`; }).join("")}</table>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="flex between"><span class="muted" style="font-size:12px;font-family:var(--mono)">tokens used ${used} / ${budget} (${Math.max(0, budget - used)} left)${state.last ? ` · last call: ${state.last.prompt} in, ${state.last.completion + (state.last.reasoning || 0)} out` : ""}</span><span class="muted" style="font-size:12px;font-family:var(--mono)">attempts ${state.attempts}</span></div>
      <div class="progress-bar" style="margin:8px 0 14px"><div style="width:${pct}%;${pct >= 100 ? "background:var(--danger)" : ""}"></div></div>
      <div id="chatLog"></div>
      <div class="field" style="margin-top:12px"><label>Your prompt to the AI</label>
        <textarea id="promptInput" rows="4" placeholder="Example: Write ${esc(language)} code defining ${esc(sig.split("(")[0])} for this problem. Use a hash map, target O(n), handle empty input. Return only one code block."></textarea></div>
      <button class="btn" id="sendBtn" ${used >= budget || state.running ? "disabled" : ""}>Send to AI</button>
      <button class="btn secondary" id="resetBtn">New round</button>
      <span class="muted" id="aiStatus" style="margin-left:10px;font-size:13px">${esc(state.note)}</span>
    </div>
    <div class="card" style="margin-top:14px">
      <label>Code under test (filled from the AI's reply; edit it if you spot a bug)</label>
      <textarea id="codeBox" rows="12" spellcheck="false"></textarea>
      <div class="flex gap" style="margin-top:10px"><button class="btn success" id="runBtn" ${state.running ? "disabled" : ""}>${state.running ? "Running…" : "Run tests"}</button><span class="muted" style="font-size:12px">Runs in an isolated worker in your browser. ${language === "Python" ? "First Python run downloads the runtime (about 10 MB)." : ""}</span></div>
      <div id="verdict" style="margin-top:14px"></div>
    </div>
  `);
  area.querySelector("#codeBox").value = state.code;
  paintChat(area);
  paintVerdict(area);
  area.querySelector("#codeBox").addEventListener("input", (e) => (state.code = e.target.value));
  area.querySelector("#resetBtn").addEventListener("click", () => { state = null; render(root); });
  area.querySelector("#sendBtn").addEventListener("click", () => sendPrompt(root));
  area.querySelector("#runBtn").addEventListener("click", () => check(root));
}

function paintChat(area) {
  renderHTML(area.querySelector("#chatLog"), state.messages.map((m) => `
    <div class="card" style="margin-bottom:8px;background:${m.role === "user" ? "var(--panel-2)" : "var(--bg-soft)"}">
      <p class="muted" style="font-size:11px;margin:0 0 6px;font-family:var(--mono)">${m.role === "user" ? "You" : `AI · ${esc(m.meta || "")}`}</p>
      <pre style="white-space:pre-wrap;margin:0"></pre>
    </div>`).join("") || `<p class="muted">No messages yet. Be specific: language, approach, complexity, edge cases, and ask for one code block.</p>`);
  area.querySelectorAll("#chatLog pre").forEach((el, i) => (el.textContent = state.messages[i].content));
}

function paintVerdict(area) {
  const box = area.querySelector("#verdict");
  const r = state.result;
  if (!r) { renderHTML(box, `<p class="muted" style="margin:0">No result yet.</p>`); return; }
  if (r.error) { renderHTML(box, `<div class="vout" style="border-color:var(--danger)"></div>`); box.firstElementChild.textContent = r.error; return; }
  const ok = r.passed === r.total;
  renderHTML(box, `
    <div class="flex gap" style="margin-bottom:10px"><span class="tag ${ok ? "good" : "danger"}" style="font-size:12px;padding:4px 10px">${ok ? "Correct: all tests passed" : "Not correct yet"}</span><b>${r.passed} / ${r.total} passed</b></div>
    <table class="vtable" style="width:100%;text-align:left"><tr><th>Test</th><th>Expected</th><th>Got</th><th></th></tr>${r.rows.map((x, i) => {
      const p = state.problem;
      const [call, exp] = x.hidden ? [`Hidden test ${i - p.cases.length + 1}`, "hidden"] : fmtCase(p, { args: x.args, expected: x.expected }, state.language);
      let got = x.err ? x.err : x.got === undefined ? "" : x.got;
      if (!x.err && state.language === "Python") got = got.replace(/\bnull\b/g, "None").replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False");
      return `<tr><td style="text-align:left"><code>${esc(call)}</code></td><td style="text-align:left">${esc(exp)}</td><td style="text-align:left">${x.hidden && !x.pass ? "(wrong or error)" : x.hidden ? "hidden" : esc(got)}</td><td style="color:var(--${x.pass ? "accent-2" : "danger"});font-weight:600">${x.pass ? "PASS" : "FAIL"}</td></tr>`;
    }).join("")}</table>
    <p class="muted" style="font-size:13px;margin:10px 0 0">${ok ? "Before submitting in a real round, also check time complexity against the constraints." : "Read the failing case, then tell the AI the exact input, the expected output and what you got."}</p>`);
}

async function check(root) {
  if (!state.code.trim()) { state.result = { error: "No code to test. Ask the AI for code first, or paste your own." }; paintRound(root); return; }
  state.running = true;
  state.result = null;
  state.attempts += 1;
  paintRound(root);
  try {
    state.result = await runTests({ lang: state.language, code: state.code, problem: state.problem });
    if (state.result.passed === state.result.total) {
      const s = get("aicode:solved", {});
      s[state.problem.id] = { lang: state.language, tokens: state.used, attempts: state.attempts };
      set("aicode:solved", s);
    }
  } catch (err) {
    state.result = { error: err.message };
  }
  state.running = false;
  paintRound(root);
}

async function sendPrompt(root) {
  const area = root.querySelector("#roundArea");
  const input = area.querySelector("#promptInput");
  const text = input.value.trim();
  if (!text) return;
  area.querySelector("#sendBtn").disabled = true;
  area.querySelector("#aiStatus").textContent = "Calling model…";
  state.messages.push({ role: "user", content: text });
  paintChat(area);

  const { problem, language } = state;
  const sig = language === "Python" ? problem.py : problem.js;
  const sys = `You are an AI pair-programming assistant in a campus coding round.
Problem: ${problem.title}. ${problem.statement}
Constraints: ${problem.constraints}
Language: ${language}. The solution MUST define exactly: ${sig}
Example tests: ${problem.cases.map((c) => fmtCase(problem, c, language).join(" -> ")).join("; ")}.
Reply with ONE fenced code block in ${language}, then at most 3 sentences on the approach and time/space complexity.`;

  const history = [{ role: "system", content: sys }, ...state.messages.map((m) => ({ role: m.role, content: m.content }))];
  const remaining = state.budget - state.used;
  const rawPrompt = estimateTokens(history.map((m) => m.content).join(" "));
  const estPrompt = Math.ceil(rawPrompt * (state.ratio || 1));
  if (remaining < estPrompt + 60) {
    state.messages.pop();
    state.note = `Budget too low for another call: about ${estPrompt} tokens are needed just to send the conversation so far, ${Math.max(0, remaining)} left. Start a new round or raise the budget.`;
    paintRound(root);
    return;
  }
  try {
    const result = await callAI({ messages: history, maxTokens: Math.max(120, Math.min(900, remaining - estPrompt)), feature: "coding-round" });
    state.used += result.usage.total;
    state.last = result.usage;
    if (!result.usage.estimated && rawPrompt) state.ratio = result.usage.prompt / rawPrompt;
    state.messages.push({ role: "assistant", content: result.text, meta: `${result.provider}/${result.model} · prompt ${result.usage.prompt} + reply ${result.usage.completion + (result.usage.reasoning || 0)} = ${result.usage.total} tokens${result.usage.estimated ? " (estimated)" : ""}${result.autoSwitched ? ` (auto-switched ${result.autoSwitched})` : ""}${result.usedBackup ? " (backup used)" : ""}` });
    state.note = result.usedBackup ? `Primary failed (${result.primaryError}). Backup used.` : "Reply received. Running tests…";
    const code = extractCode(result.text, language);
    if (code) { state.code = code; paintRound(root); await check(root); return; }
    state.note = "The reply had no code block. Ask for one code block.";
  } catch (err) {
    state.messages.push({ role: "assistant", content: `Error: ${err.message}`, meta: "error" });
    state.note = "Both models failed. Check keys in Settings.";
  }
  paintRound(root);
}
