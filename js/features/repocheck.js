import { REPOS as BASE_REPOS } from "../data/repos.js";
import { REPO_3 } from "../data/repos3.js";

const REPOS = [...BASE_REPOS, REPO_3];
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set } from "../storage.js";

let activeRepo = null;
let activeCat = "All";
let index = 0;

export function render(root) {
  if (!activeRepo) return paintPicker(root);
  paintQuestion(root);
}

function paintPicker(root) {
  const progress = get("repo:progress", {});
  renderHTML(root, `
    <h1>GitHub Repo Improvement Test</h1>
    <p class="lead">Three real, low-quality open-source repos (found via GitHub search, not yours). For each of 100 questions: read the finding, write what you'd improve, then reveal the model answer and self-grade. Click the repo link to read the real code first.</p>
    <div class="grid cols-2" id="repoGrid"></div>
  `);
  renderHTML(root.querySelector("#repoGrid"), REPOS.map((r) => {
    const done = Object.keys(progress[r.id] || {}).length;
    return `<div class="card">
      <h2>${escapeHtml(r.name)}</h2>
      <p class="muted">${escapeHtml(r.summary)}</p>
      <p style="font-size:12px"><b>Stack:</b> ${escapeHtml(r.stack)}</p>
      <p style="font-size:12px"><b>Files:</b> ${r.files.map(escapeHtml).join(", ")}</p>
      <p><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">View repo on GitHub ↗</a></p>
      <span class="tag good">${done}/${r.rows.length} answered</span>
      <div style="margin-top:12px"><button class="btn start" data-id="${r.id}">Start audit →</button></div>
    </div>`;
  }).join(""));
  root.querySelectorAll(".start").forEach((b) => b.addEventListener("click", () => {
    activeRepo = REPOS.find((r) => r.id === b.dataset.id);
    activeCat = "All";
    index = 0;
    render(root);
  }));
}

function filtered() {
  return activeRepo.rows.filter((r) => activeCat === "All" || r[0] === activeCat);
}

function paintQuestion(root) {
  const cats = ["All", ...new Set(activeRepo.rows.map((r) => r[0]))];
  const list = filtered();
  if (index >= list.length) index = list.length - 1;
  if (index < 0) index = 0;
  const [cat, finding, question, answer] = list[index];
  const key = activeRepo.rows.indexOf(list[index]);
  const progress = get("repo:progress", {});
  const saved = (progress[activeRepo.id] || {})[key];

  renderHTML(root, `
    <div class="breadcrumb"><a id="backBtn">← Repos</a> / ${escapeHtml(activeRepo.name)}</div>
    <div class="chip-filter" id="catFilter" style="margin-bottom:14px"></div>
    <div class="flex between"><h2 style="margin:0">Question ${index + 1} of ${list.length}</h2><span class="tag accent">${escapeHtml(cat)}</span></div>
    <div class="progress-bar" style="margin:10px 0"><div style="width:${Math.round(((index + 1) / list.length) * 100)}%"></div></div>
    <div class="card">
      <p class="muted" style="font-size:13px"><b>Finding in the code:</b> ${escapeHtml(finding)}</p>
      <p style="font-size:16px;font-weight:600">${escapeHtml(question)}</p>
      <textarea id="myAnswer" rows="4" placeholder="Your improvement / what is lacking..."></textarea>
      <div class="flex gap" style="margin-top:10px">
        <button class="btn" id="revealBtn">Reveal model answer</button>
      </div>
      <div id="answerWrap"></div>
    </div>
    <div class="flex gap" style="margin-top:14px">
      <button class="btn secondary" id="prevBtn" ${index === 0 ? "disabled" : ""}>← Prev</button>
      <button class="btn secondary" id="nextBtn" ${index >= list.length - 1 ? "disabled" : ""}>Next →</button>
    </div>
  `);
  root.querySelector("#myAnswer").value = saved?.mine || "";

  const filter = root.querySelector("#catFilter");
  renderHTML(filter, cats.map((c) => `<span class="chip ${c === activeCat ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</span>`).join(""));
  filter.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCat = chip.dataset.cat;
    index = 0;
    render(root);
  });

  root.querySelector("#backBtn").addEventListener("click", () => { activeRepo = null; render(root); });
  root.querySelector("#prevBtn").addEventListener("click", () => { index -= 1; render(root); });
  root.querySelector("#nextBtn").addEventListener("click", () => { index += 1; render(root); });

  const showAnswer = () => {
    const wrap = root.querySelector("#answerWrap");
    renderHTML(wrap, `<div class="card" style="margin-top:12px;background:var(--panel-2)"><p style="margin:0"><b>Model answer:</b> ${escapeHtml(answer)}</p></div>`);
  };
  root.querySelector("#revealBtn").addEventListener("click", () => {
    const p = get("repo:progress", {});
    p[activeRepo.id] = p[activeRepo.id] || {};
    p[activeRepo.id][key] = { mine: root.querySelector("#myAnswer").value };
    set("repo:progress", p);
    showAnswer();
  });
  if (saved) showAnswer();
}
