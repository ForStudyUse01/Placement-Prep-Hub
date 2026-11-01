import { PROBLEMS, LANGS, FORMAT_HELP, buildProgram } from "../data/debug/index.js";
import { runDebugTests } from "../runner.js";
import { code as codeBlock } from "../viz/core.js";
import { renderHTML, escapeHtml as esc } from "../dom.js";
import { get, set } from "../storage.js";

const LEVELS = ["Easy", "Medium", "Hard"];
const TOPICS = [...new Set(PROBLEMS.map((p) => p.topic))];
const HINT = {
  logic: "The program compiles and runs, but a comparison, index, start value or formula is wrong.",
  missing: "A statement or step that the algorithm needs is missing or was replaced.",
  syntax: "The program does not compile or parse. Look for a missing or misplaced token."
};
const FMT_LINE = "First token is T, the number of test cases. Then each test case follows. Print one integer per test case.";

let filter = { topic: "All", level: "All", status: "All", q: "" };
let session = null;

export function render(root) {
  session = null;
  const solved = get("debug2:solved", {});
  const list = PROBLEMS.filter((p) => {
    if (filter.topic !== "All" && p.topic !== filter.topic) return false;
    if (filter.level !== "All" && p.level !== filter.level) return false;
    if (filter.status === "Solved" && !solved[p.id]) return false;
    if (filter.status === "Unsolved" && solved[p.id]) return false;
    if (filter.q && !(p.title + " " + p.topic).toLowerCase().includes(filter.q)) return false;
    return true;
  });
  const doneCount = PROBLEMS.filter((p) => solved[p.id]).length;

  renderHTML(root, `
    <div class="kicker">Debugging round</div>
    <h1>Debugging Arena</h1>
    <p class="lead">${PROBLEMS.length} data-structure and algorithm problems. Each starts as a program with a bug: missing logic, wrong logic or a syntax error. Choose a language, fix it, then run the test cases. ${doneCount} of ${PROBLEMS.length} solved.</p>
    <div class="toolbar">
      <input type="text" id="q" placeholder="Search title or topic" value="${esc(filter.q)}" style="min-width:220px"/>
      <select id="status">${["All", "Unsolved", "Solved"].map((s) => `<option ${s === filter.status ? "selected" : ""}>${s}</option>`).join("")}</select>
    </div>
    <div class="chip-filter" id="topics" style="margin-bottom:10px">${["All", ...TOPICS].map((t) => `<span class="chip ${t === filter.topic ? "active" : ""}" data-v="${esc(t)}">${esc(t)}</span>`).join("")}</div>
    <div class="chip-filter" id="levels" style="margin-bottom:18px">${["All", ...LEVELS].map((t) => `<span class="chip ${t === filter.level ? "active" : ""}" data-v="${esc(t)}">${esc(t)}</span>`).join("")}</div>
    <p class="muted" style="font-size:13px">${list.length} problem${list.length === 1 ? "" : "s"} shown</p>
    <div class="scroll-x" id="rows"></div>
  `);
  renderHTML(root.querySelector("#rows"), `<table style="width:100%;border-collapse:collapse;font-size:14px">${list.map((p) => `
    <tr class="row" data-id="${p.id}" style="cursor:pointer;border-top:1px solid var(--border)">
      <td style="padding:10px 12px 10px 0;font-family:var(--mono);font-size:12px;color:var(--text-mute);width:60px">${p.id.slice(1)}</td>
      <td style="padding:10px 12px 10px 0;font-family:var(--serif);font-size:18px">${esc(p.title)}</td>
      <td style="padding:10px 12px 10px 0"><span class="tag">${esc(p.topic)}</span></td>
      <td style="padding:10px 12px 10px 0"><span class="tag ${p.level === "Easy" ? "good" : p.level === "Hard" ? "danger" : "warn"}">${p.level}</span></td>
      <td style="padding:10px 0;text-align:right;color:var(--accent-2);font-weight:600">${solved[p.id] ? "Solved" : ""}</td>
    </tr>`).join("") || `<tr><td class="muted">No problems match.</td></tr>`}</table>`);

  root.querySelector("#q").addEventListener("input", (e) => { filter.q = e.target.value.toLowerCase(); render(root); root.querySelector("#q").focus(); });
  root.querySelector("#status").addEventListener("change", (e) => { filter.status = e.target.value; render(root); });
  root.querySelector("#topics").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) { filter.topic = c.dataset.v; render(root); } });
  root.querySelector("#levels").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) { filter.level = c.dataset.v; render(root); } });
  root.querySelectorAll(".row").forEach((r) => r.addEventListener("click", () => openProblem(root, r.dataset.id)));
}

function draftKey(id, lang) { return `debug2:draft:${id}:${lang}`; }

function openProblem(root, id) {
  const p = PROBLEMS.find((x) => x.id === id);
  if (!p) return;
  const lang = get("debug2:lang", "py");
  session = { p, lang, code: "", running: false, result: null, revealed: false, hint: false };
  session.code = get(draftKey(id, lang), null) ?? buildProgram(p, lang, "bug");
  paint(root);
}

function paint(root) {
  const { p, lang } = session;
  const idx = PROBLEMS.indexOf(p);
  const solved = get("debug2:solved", {});
  renderHTML(root, `
    <div class="breadcrumb"><a id="back">← All problems</a> / ${esc(p.topic)}</div>
    <div class="flex between wrap" style="gap:12px"><h1 style="margin:0">${esc(p.title)}</h1><span class="muted" style="font-family:var(--mono);font-size:12px">${p.id.slice(1)} / ${PROBLEMS.length}${solved[p.id] ? " · solved" : ""}</span></div>
    <div style="margin:8px 0 16px"><span class="tag">${esc(p.topic)}</span><span class="tag ${p.level === "Easy" ? "good" : p.level === "Hard" ? "danger" : "warn"}">${p.level}</span></div>

    <div class="card">
      <div class="kicker">Problem</div>
      <p style="margin:0 0 12px">${esc(p.statement)}</p>
      <p class="muted" style="margin:0 0 4px;font-size:14px"><b>Input per test case:</b> ${esc(FORMAT_HELP[p.kind])}. ${esc(FMT_LINE)}</p>
      <label style="margin-top:12px">Examples</label>
      <table class="vtable" style="width:100%;text-align:left"><tr><th style="text-align:left">Input tokens</th><th style="text-align:left">Expected output</th></tr>${p.cases.map((c, i) => `<tr><td style="text-align:left"><code>${esc(c)}</code></td><td style="text-align:left"><code>${esc(p.expected[i])}</code></td></tr>`).join("")}</table>
      <p class="muted" style="font-size:12px;margin:8px 0 0">${p.hidden.length} more tests are hidden. Your fix must pass them too.</p>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="flex between wrap" style="gap:10px;margin-bottom:10px">
        <div class="vrow" style="margin:0"><label style="margin:0">Language</label><select id="lang">${LANGS.map(([k, n]) => `<option value="${k}" ${k === lang ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <span class="muted" style="font-size:12px">${lang === "py" || lang === "js" ? "Runs in your browser." : "Compiled on the free Wandbox online compiler (internet needed)."}</span>
      </div>
      <textarea id="editor" rows="22" spellcheck="false" style="tab-size:4"></textarea>
      <div class="flex gap wrap" style="margin-top:10px">
        <button class="btn success" id="run" ${session.running ? "disabled" : ""}>${session.running ? "Running…" : "Run test cases"}</button>
        <button class="btn secondary" id="reset">Reset to buggy code</button>
        <button class="btn secondary" id="hint">${session.hint ? "Hide hint" : "Show hint"}</button>
        <button class="btn secondary" id="reveal">${session.revealed ? "Hide answer" : "Reveal optimised answer"}</button>
      </div>
      <p class="muted" id="hintText" style="margin:10px 0 0;font-size:14px;${session.hint ? "" : "display:none"}"><b>Hint:</b> this is a <b>${esc(p.bug.type)}</b> bug. ${esc(HINT[p.bug.type])}</p>
      <div id="verdict" style="margin-top:14px"></div>
    </div>

    <div id="answer" style="margin-top:14px"></div>

    <div class="flex gap" style="margin-top:18px">
      <button class="btn secondary" id="prev" ${idx === 0 ? "disabled" : ""}>Previous problem</button>
      <button class="btn secondary" id="next" ${idx === PROBLEMS.length - 1 ? "disabled" : ""}>Next problem</button>
    </div>
  `);

  const editor = root.querySelector("#editor");
  editor.value = session.code;
  editor.addEventListener("input", () => { session.code = editor.value; set(draftKey(p.id, session.lang), session.code); });
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = editor.selectionStart;
      editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = s + 4;
      session.code = editor.value;
      set(draftKey(p.id, session.lang), session.code);
    }
  });

  root.querySelector("#back").addEventListener("click", () => render(root));
  root.querySelector("#lang").addEventListener("change", (e) => {
    session.lang = e.target.value;
    set("debug2:lang", session.lang);
    session.code = get(draftKey(p.id, session.lang), null) ?? buildProgram(p, session.lang, "bug");
    session.result = null;
    paint(root);
  });
  root.querySelector("#reset").addEventListener("click", () => {
    session.code = buildProgram(p, session.lang, "bug");
    set(draftKey(p.id, session.lang), null);
    session.result = null;
    paint(root);
  });
  root.querySelector("#hint").addEventListener("click", () => { session.hint = !session.hint; paint(root); });
  root.querySelector("#reveal").addEventListener("click", () => { session.revealed = !session.revealed; paint(root); });
  root.querySelector("#run").addEventListener("click", () => run(root));
  root.querySelector("#prev").addEventListener("click", () => openProblem(root, PROBLEMS[idx - 1].id));
  root.querySelector("#next").addEventListener("click", () => openProblem(root, PROBLEMS[idx + 1].id));

  paintVerdict(root);
  paintAnswer(root);
}

function paintVerdict(root) {
  const box = root.querySelector("#verdict");
  const r = session.result;
  if (session.running) { renderHTML(box, `<p class="muted" style="margin:0">Running all tests…</p>`); return; }
  if (!r) { renderHTML(box, `<p class="muted" style="margin:0">Fix the bug, then press Run test cases.</p>`); return; }
  if (r.error) {
    renderHTML(box, `<div class="flex gap" style="margin-bottom:8px"><span class="tag danger" style="font-size:12px;padding:4px 10px">${r.compile ? "Does not compile" : "Error"}</span></div><div class="vout" style="border-color:var(--danger)"></div>`);
    box.querySelector(".vout").textContent = r.error;
    return;
  }
  const ok = r.passed === r.total;
  const p = session.p;
  renderHTML(box, `
    <div class="flex gap" style="margin-bottom:10px"><span class="tag ${ok ? "good" : "danger"}" style="font-size:12px;padding:4px 10px">${ok ? "Correct. The bug is fixed." : "Wrong answer: not fixed yet"}</span><b>${r.passed} / ${r.total} tests passed</b></div>
    <table class="vtable" style="width:100%;text-align:left"><tr><th style="text-align:left">Test</th><th style="text-align:left">Input</th><th style="text-align:left">Expected</th><th style="text-align:left">Your output</th><th></th></tr>${r.rows.map((x, i) => `<tr>
      <td style="text-align:left">${x.hidden ? `Hidden ${i - p.cases.length + 1}` : i + 1}</td>
      <td style="text-align:left">${x.hidden ? "hidden" : `<code>${esc(x.input)}</code>`}</td>
      <td style="text-align:left">${x.hidden ? "hidden" : `<code>${esc(x.expected)}</code>`}</td>
      <td style="text-align:left">${x.hidden && !x.pass ? "(wrong)" : x.hidden ? "hidden" : `<code>${esc(x.got)}</code>`}</td>
      <td style="color:var(--${x.pass ? "accent-2" : "danger"});font-weight:600">${x.pass ? "PASS" : "FAIL"}</td></tr>`).join("")}</table>
    ${r.warning ? `<p class="muted" style="font-size:12px;margin:8px 0 0">Note: ${esc(r.warning)}</p>` : ""}
    <p class="muted" style="font-size:13px;margin:10px 0 0">${ok ? "Next: say in one sentence what the bug was, then check the time complexity." : "Read the first failing test by hand with a dry run, then compare with the expected value."}</p>`);
}

function paintAnswer(root) {
  const box = root.querySelector("#answer");
  if (!session.revealed) { renderHTML(box, ""); return; }
  const { p, lang } = session;
  const fixed = buildProgram(p, lang, "fixed").split("\n");
  const buggy = new Set(buildProgram(p, lang, "bug").split("\n"));
  const changed = fixed.map((l, i) => (buggy.has(l) ? -1 : i)).filter((i) => i >= 0);
  renderHTML(box, `<div class="card"><div class="kicker">Reference answer (${esc(LANGS.find(([k]) => k === lang)[1])})</div>
    <p style="margin:0 0 8px"><b>What was wrong:</b> ${esc(p.bug.note)}</p>
    <p class="muted" style="font-size:13px;margin:0 0 8px">Highlighted lines are the ones that differ from the buggy version.</p>
    ${codeBlock(fixed, changed)}
    <button class="btn secondary" id="useAnswer">Copy answer into the editor</button></div>`);
  root.querySelector("#useAnswer").addEventListener("click", () => {
    session.code = fixed.join("\n");
    set(draftKey(p.id, lang), session.code);
    root.querySelector("#editor").value = session.code;
  });
}

async function run(root) {
  const { p, lang } = session;
  session.running = true;
  session.result = null;
  root.querySelector("#run").disabled = true;
  root.querySelector("#run").textContent = "Running…";
  paintVerdict(root);
  const attempts = get("debug2:attempts", {});
  attempts[p.id] = (attempts[p.id] || 0) + 1;
  set("debug2:attempts", attempts);
  try {
    session.result = await runDebugTests(p, lang, session.code);
    if (session.result.rows && session.result.passed === session.result.total) {
      const s = get("debug2:solved", {});
      s[p.id] = { lang, attempts: attempts[p.id] };
      set("debug2:solved", s);
    }
  } catch (err) {
    session.result = { error: err.message };
  }
  session.running = false;
  const r = root.querySelector("#run");
  if (r) { r.disabled = false; r.textContent = "Run test cases"; }
  paintVerdict(root);
}
