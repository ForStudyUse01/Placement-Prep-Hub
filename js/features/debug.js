import { LANGS, DEBUG_BANK } from "../data/debugging.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set } from "../storage.js";

let activeLang = "All";

export function render(root) {
  renderHTML(root, `
    <h1>Debugging Arena</h1>
    <p class="lead">${DEBUG_BANK.length} bugged snippets across Python, Java, C, C++ and JavaScript — the same patterns Capgemini-style debugging rounds use. Read the code, decide what's wrong, then reveal to check yourself.</p>
    <div class="chip-filter" id="langFilter" style="margin-bottom:16px"></div>
    <div class="grid cols-3" id="bugGrid"></div>
  `);
  const filter = root.querySelector("#langFilter");
  renderHTML(filter, ["All", ...LANGS].map((l) => `<span class="chip ${l === activeLang ? "active" : ""}" data-lang="${l}">${l}</span>`).join(""));
  filter.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeLang = chip.dataset.lang;
    render(root);
  });
  paintGrid(root);
}

function paintGrid(root) {
  const grid = root.querySelector("#bugGrid");
  const solved = get("debug:solved", {});
  const list = DEBUG_BANK.filter((b) => activeLang === "All" || b.lang === activeLang);
  renderHTML(grid, list.map((b) => `
    <div class="card clickable" data-id="${b.id}">
      <div class="flex between">
        <span class="tag accent">${escapeHtml(b.lang)}</span>
        ${solved[b.id] ? '<span class="tag good">✓ reviewed</span>' : ""}
      </div>
      <h2 style="margin-top:10px">${escapeHtml(b.title)}</h2>
      <span class="tag warn">${escapeHtml(b.pattern)}</span>
      <p class="muted" style="margin-top:8px;font-size:12px">${escapeHtml(b.difficulty)}</p>
    </div>
  `).join(""));
  grid.querySelectorAll(".card").forEach((card) => card.addEventListener("click", () => openBug(root, card.dataset.id)));
}

function openBug(root, id) {
  const bug = DEBUG_BANK.find((b) => b.id === id);
  if (!bug) return;
  renderHTML(root, `
    <div class="breadcrumb"><a id="backBtn">← Debugging Arena</a> / ${escapeHtml(bug.lang)}</div>
    <h1>${escapeHtml(bug.title)}</h1>
    <div><span class="tag accent">${escapeHtml(bug.lang)}</span> <span class="tag warn">${escapeHtml(bug.pattern)}</span> <span class="tag">${escapeHtml(bug.difficulty)}</span></div>
    <h2 style="margin-top:16px">Buggy code</h2>
    <pre id="buggyCode"></pre>
    <p class="muted" style="font-size:12px">Spot the bug first — think it through before revealing. (Live in-browser execution is intentionally not wired up: it would need a sandboxed iframe to run arbitrary code safely, out of scope for a static GitHub Pages site.)</p>
    <div class="flex gap" style="margin-top:10px">
      <button class="btn" id="revealBtn">Reveal the bug</button>
    </div>
    <div id="revealWrap"></div>
  `);
  root.querySelector("#buggyCode").textContent = bug.buggy;
  root.querySelector("#backBtn").addEventListener("click", () => render(root));

  root.querySelector("#revealBtn").addEventListener("click", () => {
    const d = get("debug:solved", {});
    d[bug.id] = true;
    set("debug:solved", d);
    const wrap = root.querySelector("#revealWrap");
    renderHTML(wrap, `
      <div class="card" style="margin-top:12px;background:var(--panel-2)">
        <h2>Why it's broken</h2>
        <p>${escapeHtml(bug.bugExplain)}</p>
      </div>
      <h2 style="margin-top:16px">Fixed code</h2>
      <pre id="fixedCode"></pre>
    `);
    wrap.querySelector("#fixedCode").textContent = bug.fixed;
    root.querySelector("#revealBtn").remove();
  });
}
