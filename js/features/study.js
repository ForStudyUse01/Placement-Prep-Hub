import { TOPICS, CATEGORIES } from "../data/topics.js";
import { TOPIC_VIZ } from "../viz/index.js";
import { get, set } from "../storage.js";
import { renderHTML, escapeHtml as esc } from "../dom.js";
import { EXTRA } from "../data/topic_extra.js";

let activeCategory = "All";
let searchQuery = "";

export function render(root, param) {
  if (param && TOPICS.some((t) => t.id === param)) return openTopic(root, param);
  renderHTML(root, `
    <h1>Study Material</h1>
    <p class="lead">${TOPICS.length} topics across DSA fundamentals and Capgemini-style AI Literacy, each with a visual where it helps.</p>
    <div class="toolbar">
      <input type="text" id="studySearch" placeholder="Search topics, tags..." style="min-width:220px" />
      <div class="chip-filter" id="catFilter"></div>
    </div>
    <div class="grid cols-3" id="topicGrid"></div>
  `);
  const catFilter = root.querySelector("#catFilter");
  renderHTML(catFilter, ["All", ...CATEGORIES].map(
    (c) => `<span class="chip ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</span>`
  ).join(""));
  catFilter.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    render(root);
  });

  const search = root.querySelector("#studySearch");
  search.value = searchQuery;
  search.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    paintGrid(root);
  });

  paintGrid(root);
}

function paintGrid(root) {
  const grid = root.querySelector("#topicGrid");
  const done = get("study:done", {});
  const list = TOPICS.filter((t) => {
    if (activeCategory !== "All" && t.category !== activeCategory) return false;
    if (!searchQuery) return true;
    const hay = (t.title + " " + t.tags.join(" ") + " " + t.category).toLowerCase();
    return hay.includes(searchQuery);
  });
  if (!list.length) {
    renderHTML(grid, `<p class="muted">No topics match that filter.</p>`);
    return;
  }
  renderHTML(grid, list.map((t) => `
    <div class="card clickable" data-id="${t.id}">
      <div class="flex between">
        <span class="tag accent">${t.category}</span>
        ${done[t.id] ? '<span class="tag good">✓ done</span>' : ""}
      </div>
      <h2 style="margin-top:10px">${t.title}</h2>
      <div>${t.tags.map((tg) => `<span class="tag">${tg}</span>`).join("")}</div>
      <p class="muted" style="margin-top:10px;font-size:12px;">Difficulty: ${t.difficulty}</p>
    </div>
  `).join(""));

  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openTopic(root, card.dataset.id));
  });
}

function openTopic(root, id) {
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) return;
  const done = get("study:done", {});
  const x = EXTRA[topic.id];
  renderHTML(root, `
    <div class="breadcrumb"><a id="backBtn">← Study Material</a> / ${topic.category}</div>
    <h1>${topic.title}</h1>
    <div>${topic.tags.map((tg) => `<span class="tag">${tg}</span>`).join("")} <span class="tag">${topic.difficulty}</span></div>
    ${x ? `<p class="lead" style="margin-top:14px">${esc(x.why)}</p>` : ""}
    <div class="section" style="margin-top:20px"><div class="kicker">Concepts</div>
      <div class="card"><div class="topic-body">${topic.body}</div></div>
    </div>
    ${x ? `<div class="section" style="margin-top:32px"><div class="kicker">Worked example</div>
      <div class="card">
        <h2>${esc(x.example.title)}</h2>
        ${x.example.code ? `<pre id="exCode"></pre>` : ""}
        <ol class="topic-body" style="padding-left:20px;margin:10px 0">${x.example.walk.map((w) => `<li style="margin-bottom:4px">${esc(w)}</li>`).join("")}</ol>
        <div class="vout"><b>Result:</b> ${esc(x.example.result)}</div>
        <p class="muted" style="font-size:13px;margin:10px 0 0">The visualization below uses this same example. Step through it and match each step to the list above.</p>
      </div></div>` : ""}
    <div class="section" style="margin-top:32px"><div class="kicker">Visualise it</div><div id="vizHost"></div></div>
    ${x ? `<div class="section" style="margin-top:32px"><div class="grid cols-2">
      <div class="card"><div class="kicker">Common mistakes</div><ul class="topic-body" style="padding-left:18px;margin:0">${x.mistakes.map((m) => `<li style="margin-bottom:6px">${esc(m)}</li>`).join("")}</ul></div>
      <div class="card"><div class="kicker">How it shows up in exams</div><ul class="topic-body" style="padding-left:18px;margin:0">${x.exam.map((m) => `<li style="margin-bottom:6px">${esc(m)}</li>`).join("")}</ul></div>
    </div></div>
    <div class="section" style="margin-top:32px"><div class="kicker">Quick check</div><div class="card" id="quick">
      <p style="font-weight:600;white-space:pre-wrap;margin-top:0" id="qText"></p><div id="qOpts"></div><p class="topic-body" id="qExp" style="margin:8px 0 0"></p>
    </div></div>` : ""}
    <div class="flex gap" style="margin-top:24px">
      <button class="btn ${done[topic.id] ? "secondary" : "success"}" id="markDoneBtn">${done[topic.id] ? "✓ Marked done — undo" : "Mark as done"}</button>
    </div>
  `);
  root.querySelector("#backBtn").addEventListener("click", () => render(root));
  if (x) {
    if (x.example.code) root.querySelector("#exCode").textContent = x.example.code;
    root.querySelector("#qText").textContent = x.check.q;
    const opts = root.querySelector("#qOpts");
    x.check.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "option";
      b.textContent = o;
      b.addEventListener("click", () => {
        opts.querySelectorAll(".option").forEach((el, j) => { el.classList.add("disabled"); if (j === x.check.correct) el.classList.add("correct"); else if (j === i) el.classList.add("wrong"); });
        root.querySelector("#qExp").textContent = (i === x.check.correct ? "Correct. " : "Not quite. ") + x.check.explain;
      });
      opts.append(b);
    });
  }
  const vh = root.querySelector("#vizHost");
  (TOPIC_VIZ[topic.id] || []).forEach((w) => {
    const box = document.createElement("div");
    box.className = "vizbox";
    const k = document.createElement("div");
    k.className = "kicker";
    k.textContent = w.title;
    const body = document.createElement("div");
    box.append(k, body);
    vh.append(box);
    try { w.mount(body); } catch (e) { body.textContent = "Visualization failed: " + e.message; }
  });
  root.querySelector("#markDoneBtn").addEventListener("click", () => {
    const d = get("study:done", {});
    d[topic.id] = !d[topic.id];
    set("study:done", d);
    openTopic(root, topic.id);
  });
}
