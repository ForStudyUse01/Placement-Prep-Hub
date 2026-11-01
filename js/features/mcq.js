import { COMPANIES, MCQ_BANK } from "../data/companies_mcq.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { get, set } from "../storage.js";

let session = null; // { company, questions, index, answers:[], startedAt }
let timerId = null;

export function render(root) {
  stopTimer();
  session = null;
  const scores = get("mcq:scores", {});
  renderHTML(root, `
    <h1>Company-Specific MCQ Tests</h1>
    <p class="lead">Pick a company. Each test is timed (45s/question) and scored instantly with explanations.</p>
    <div class="grid cols-3" id="companyGrid"></div>
  `);
  const grid = root.querySelector("#companyGrid");
  renderHTML(grid, COMPANIES.map((c) => {
    const n = MCQ_BANK[c]?.length || 0;
    const best = scores[c]?.best;
    return `<div class="card clickable" data-company="${escapeHtml(c)}">
      <h2>${escapeHtml(c)}</h2>
      <p class="muted">${n} questions</p>
      ${best !== undefined ? `<span class="tag good">Best: ${best}/${n}</span>` : `<span class="tag">Not attempted</span>`}
      <div style="margin-top:12px"><span class="btn secondary">Start test →</span></div>
    </div>`;
  }).join(""));
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => startTest(root, card.dataset.company));
  });
}

function startTest(root, company) {
  const questions = MCQ_BANK[company] || [];
  session = { company, questions, index: 0, answers: new Array(questions.length).fill(null), secondsLeft: 45 };
  paintQuestion(root);
  startTimer(root);
}

function startTimer(root) {
  stopTimer();
  timerId = setInterval(() => {
    session.secondsLeft -= 1;
    const el = document.getElementById("mcqTimer");
    if (el) el.textContent = `${session.secondsLeft}s`;
    if (session.secondsLeft <= 0) {
      goNext(root);
    }
  }, 1000);
}
function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function paintQuestion(root) {
  const { questions, index, company } = session;
  const q = questions[index];
  const pct = Math.round((index / questions.length) * 100);
  renderHTML(root, `
    <div class="breadcrumb"><a id="quitBtn">← Quit test</a> / ${escapeHtml(company)}</div>
    <div class="flex between" style="margin-bottom:8px">
      <h2 style="margin:0">Question ${index + 1} of ${questions.length}</h2>
      <span class="timer" id="mcqTimer">${session.secondsLeft}s</span>
    </div>
    <div class="progress-bar" style="margin-bottom:16px"><div style="width:${pct}%"></div></div>
    <div class="card">
      <p style="font-size:16px;font-weight:600">${escapeHtml(q.q)}</p>
      <div id="optionsWrap"></div>
    </div>
  `);
  const wrap = root.querySelector("#optionsWrap");
  renderHTML(wrap, q.options.map((opt, i) => `<button class="option" data-i="${i}">${escapeHtml(opt)}</button>`).join(""));
  wrap.querySelectorAll(".option").forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(root, Number(btn.dataset.i)));
  });
  root.querySelector("#quitBtn").addEventListener("click", () => { stopTimer(); render(root); });
}

function selectAnswer(root, choice) {
  stopTimer();
  const { questions, index } = session;
  session.answers[index] = choice;
  const q = questions[index];
  const wrap = root.querySelector("#optionsWrap");
  wrap.querySelectorAll(".option").forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === q.correct) btn.classList.add("correct");
    else if (i === choice) btn.classList.add("wrong");
  });
  const explainDiv = document.createElement("div");
  explainDiv.className = "card";
  explainDiv.style.marginTop = "12px";
  explainDiv.style.background = "var(--panel-2)";
  renderHTML(explainDiv, `<p style="margin:0"><b>${choice === q.correct ? "✅ Correct." : "❌ Incorrect."}</b> ${escapeHtml(q.explain)}</p>
    <button class="btn" id="nextBtn" style="margin-top:12px">${index + 1 < questions.length ? "Next question →" : "Finish test"}</button>`);
  root.querySelector(".card").after(explainDiv);
  explainDiv.querySelector("#nextBtn").addEventListener("click", () => goNext(root));
}

function goNext(root) {
  stopTimer();
  if (session.answers[session.index] === null) session.answers[session.index] = -1;
  if (session.index + 1 < session.questions.length) {
    session.index += 1;
    session.secondsLeft = 45;
    paintQuestion(root);
    startTimer(root);
  } else {
    finishTest(root);
  }
}

function finishTest(root) {
  stopTimer();
  const { questions, answers, company } = session;
  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);
  const scores = get("mcq:scores", {});
  const prevBest = scores[company]?.best || 0;
  scores[company] = { best: Math.max(prevBest, correctCount), last: correctCount, total: questions.length };
  set("mcq:scores", scores);

  renderHTML(root, `
    <h1>Test complete — ${escapeHtml(company)}</h1>
    <div class="card">
      <div class="grid cols-3">
        <div class="stat"><span class="num">${correctCount}/${questions.length}</span><span class="lbl">Score</span></div>
        <div class="stat"><span class="num">${Math.round((correctCount / questions.length) * 100)}%</span><span class="lbl">Accuracy</span></div>
        <div class="stat"><span class="num">${scores[company].best}</span><span class="lbl">Best ever</span></div>
      </div>
    </div>
    <h2 style="margin-top:20px">Review</h2>
    <div id="reviewList"></div>
    <div class="flex gap" style="margin-top:16px">
      <button class="btn" id="retakeBtn">Retake test</button>
      <button class="btn secondary" id="backBtn">Back to companies</button>
    </div>
  `);
  const reviewList = root.querySelector("#reviewList");
  renderHTML(reviewList, questions.map((q, i) => {
    const a = answers[i];
    const ok = a === q.correct;
    return `<div class="card" style="margin-bottom:10px">
      <p style="font-weight:600">${i + 1}. ${escapeHtml(q.q)}</p>
      <p class="${ok ? "muted" : ""}">Your answer: <b>${a === -1 ? "(skipped)" : escapeHtml(q.options[a] ?? "—")}</b> ${ok ? "✅" : "❌"} ${!ok ? `— correct: <b>${escapeHtml(q.options[q.correct])}</b>` : ""}</p>
      <p class="muted" style="font-size:13px">${escapeHtml(q.explain)}</p>
    </div>`;
  }).join(""));
  root.querySelector("#retakeBtn").addEventListener("click", () => startTest(root, company));
  root.querySelector("#backBtn").addEventListener("click", () => render(root));
}
