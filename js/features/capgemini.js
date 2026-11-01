import { CHECKLIST, PATTERNS, WORKFLOW, REVISION_PLAN, FORMAT_NOTES, TECH_SYLLABUS, SOURCES, TIPS, STUDY_MAP, CHEATSHEETS } from "../data/capgemini.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set } from "../storage.js";

const TOTAL = Object.values(CHECKLIST).reduce((n, a) => n + a.length, 0);

export function render(root) {
  const done = get("capgemini:checklist", {});
  const count = Object.values(done).filter(Boolean).length;
  renderHTML(root, `
    <div class="kicker">Company guide</div>
    <h1>Capgemini 2026</h1>
    <p class="lead">Exceller assessment prep: the AI Literacy and Technical MCQ sections, pseudo-code tracing, the debugging round and the AI-assisted coding round. Python is allowed in debugging and coding.</p>
    <div class="grid cols-3">
      <a class="card clickable" href="#/ailiteracy"><div class="kicker">Section 1</div><h2>AI Literacy Test</h2><p class="muted">Timed MCQ mocks. Take the test, then review weak topics.</p></a>
      <a class="card clickable" href="#/debug"><div class="kicker">Section 2</div><h2>Debugging</h2><p class="muted">Practise the 20 patterns below in the Debugging Arena.</p></a>
      <a class="card clickable" href="#/aicoding"><div class="kicker">Section 3</div><h2>AI-Assisted Coding</h2><p class="muted">Token-budgeted round with test cases.</p></a>
    </div>

    <div class="section"><h2>Study material for this assessment</h2>
      <p class="muted" style="margin-top:0">Only what this assessment covers. Each link opens a full topic with a worked example and a visualization.</p>
      <div id="studyMap"></div>
      <h2 style="margin-top:28px">Technical MCQ revision sheets</h2>
      <div id="sheets"></div>
    </div>
    <div class="section"><h2>What the assessment looks like</h2><div class="card" id="fmt"></div></div>
    <div class="section"><h2>Technical syllabus</h2><div class="grid cols-3" id="syl"></div></div>
    <div class="section"><h2>Tips from the sources</h2><div class="card"><ul id="tips" style="margin:0;padding-left:18px"></ul></div></div>

    <h2 class="section" style="margin-top:44px">Preparation tracker</h2>
    <div class="card">
      <div class="flex between"><b id="cgCount">${count}/${TOTAL}</b><button class="btn secondary" id="cgReset">Reset checklist</button></div>
      <div class="progress-bar" style="margin:8px 0"><div id="cgBar" style="width:${Math.round((count / TOTAL) * 100)}%"></div></div>
      <div id="cgLists"></div>
    </div>

    <h2 class="section" style="margin-top:44px">Debugging workflow</h2>
    <div class="grid cols-4" id="workflow"></div>

    <h2 class="section" style="margin-top:44px">20 debugging patterns to practise</h2>
    <div class="card" id="patterns"></div>

    <h2 class="section" style="margin-top:44px">Final revision plan (night before)</h2>
    <div class="card scroll-x"><div id="plan"></div>
    <p class="muted" style="font-size:12px">Suggested schedule, not official Capgemini timings.</p></div>

    <div class="card" style="margin-top:24px"><b>Remember:</b> in AI-assisted coding, don't blindly accept the AI's first solution. Understand the approach, check the generated code, test edge cases, and confirm it meets the constraints.</div>
  `);

  renderHTML(root.querySelector("#studyMap"), Object.entries(STUDY_MAP).map(([sec, items]) => `<div class="card" style="margin-bottom:-1px"><div class="kicker">${escapeHtml(sec)}</div><div style="columns:2 320px;column-gap:28px">${items.map(([l, t]) => `<div style="break-inside:avoid;padding:3px 0"><a href="#/study/${t}">${escapeHtml(l)}</a></div>`).join("")}</div></div>`).join("") + `<p style="margin-top:12px"><a href="#/ailiteracy">Take the AI Literacy test</a> · <a href="#/debug">Practise debugging</a> · <a href="#/aicoding">AI-assisted coding round</a></p>`);
  renderHTML(root.querySelector("#sheets"), CHEATSHEETS.map(([t, pts]) => `<details class="card" style="margin-bottom:-1px"><summary style="cursor:pointer;font-family:var(--serif);font-size:19px">${escapeHtml(t)}</summary><ul class="topic-body" style="padding-left:18px;margin:10px 0 0">${pts.map((x) => `<li style="margin-bottom:6px">${escapeHtml(x)}</li>`).join("")}</ul></details>`).join(""));
  renderHTML(root.querySelector("#fmt"), FORMAT_NOTES.map(([k, v]) => `<p style="margin:0 0 12px"><b>${escapeHtml(k)}.</b> ${escapeHtml(v)}</p>`).join("") + `<p class="muted" style="font-size:13px;margin:0">Sources: ${SOURCES.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${escapeHtml(n)}</a>`).join(" · ")}</p>`);
  renderHTML(root.querySelector("#syl"), Object.entries(TECH_SYLLABUS).map(([k, v]) => `<div class="card"><h2 style="font-size:18px">${escapeHtml(k)}</h2>${v.map((x) => `<span class="tag">${escapeHtml(x)}</span>`).join("")}</div>`).join(""));
  renderHTML(root.querySelector("#tips"), TIPS.map((x) => `<li style="margin-bottom:6px">${escapeHtml(x)}</li>`).join(""));
  renderHTML(root.querySelector("#cgLists"), Object.entries(CHECKLIST).map(([section, items]) => `
    <h2 style="margin-top:16px">${escapeHtml(section)} <span class="muted" style="font-size:12px">(${items.length})</span></h2>
    ${items.map((it, i) => {
      const id = `${section}:${i}`;
      return `<label class="checklist-item" style="color:var(--text);font-size:13px;margin:0"><input type="checkbox" data-id="${escapeHtml(id)}" ${done[id] ? "checked" : ""}/> ${escapeHtml(it)}</label>`;
    }).join("")}
  `).join(""));

  renderHTML(root.querySelector("#workflow"), WORKFLOW.map(([t, d], i) => `<div class="card"><span class="tag accent">Step ${i + 1}</span><h2 style="margin-top:8px">${t}</h2><p class="muted">${d}</p></div>`).join(""));
  renderHTML(root.querySelector("#patterns"), PATTERNS.map((p, i) => `<span class="tag warn">${i + 1}. ${escapeHtml(p)}</span>`).join(""));
  renderHTML(root.querySelector("#plan"), `<table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="text-align:left"><th>Priority</th><th>Topics</th><th>Time</th></tr>` +
    REVISION_PLAN.map(([p, t, h]) => `<tr><td style="padding:6px 0">${p}</td><td>${escapeHtml(t)}</td><td>${h}</td></tr>`).join("") + `</table>`);

  root.querySelector("#cgLists").addEventListener("change", (e) => {
    const cb = e.target.closest("input[type=checkbox]");
    if (!cb) return;
    const d = get("capgemini:checklist", {});
    d[cb.dataset.id] = cb.checked;
    set("capgemini:checklist", d);
    const c = Object.values(d).filter(Boolean).length;
    root.querySelector("#cgCount").textContent = `${c}/${TOTAL}`;
    root.querySelector("#cgBar").style.width = `${Math.round((c / TOTAL) * 100)}%`;
  });
  root.querySelector("#cgReset").addEventListener("click", () => { set("capgemini:checklist", {}); render(root); });
}
