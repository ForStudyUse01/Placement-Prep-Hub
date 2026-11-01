import { TOPICS } from "../data/topics.js";
import { COMPANIES } from "../data/companies_mcq.js";
import { DEBUG_BANK } from "../data/debugging.js";
import { get, getTokens } from "../storage.js";
import { getKey } from "../ai.js";
import { renderHTML } from "../dom.js";

const SECTIONS = [
  ["#/study", "Study material", "DSA fundamentals and AI concepts, with diagrams."],
  ["#/visualizer", "Visualizer", "Step through sorting, search, graph and tree algorithms."],
  ["#/ailiteracy", "AI Literacy test", "Timed MCQs for the Capgemini first section."],
  ["#/mcq", "Company tests", "Capgemini, TCS, Infosys, Wipro, Accenture, Cognizant."],
  ["#/debug", "Debugging arena", "Find the bug in Python, Java, C, C++ and JavaScript."],
  ["#/aicoding", "AI-assisted coding", "Solve problems with a model, inside a token budget."],
  ["#/promptlab", "Prompt lab", "See real token usage and tighten your prompts."],
  ["#/repocheck", "Repo audit", "Review three weak open-source repos, 100 questions each."],
  ["#/capgemini", "Capgemini 2026", "Format, syllabus, tracker and revision plan."]
];

export function render(root) {
  const studyDone = Object.values(get("study:done", {})).filter(Boolean).length;
  const debugSolved = Object.values(get("debug:solved", {})).filter(Boolean).length;
  const mcqAttempted = Object.keys(get("mcq:scores", {})).length;
  const hasKey = ["groq", "xai", "gemini", "openrouter"].some((p) => getKey(p));

  renderHTML(root, `
    <div class="kicker">Campus placement workbook</div>
    <h1>Prepare in the order the exam asks.</h1>
    <p class="lead">Study, test, debug, then code with an AI assistant. Everything runs in your browser; nothing is uploaded.</p>

    <div class="grid cols-4">
      <div class="card"><div class="stat"><span class="num">${studyDone}<small style="font-size:16px;color:var(--text-mute)">/${TOPICS.length}</small></span><span class="lbl">Topics read</span></div></div>
      <div class="card"><div class="stat"><span class="num">${mcqAttempted}<small style="font-size:16px;color:var(--text-mute)">/${COMPANIES.length}</small></span><span class="lbl">Company tests</span></div></div>
      <div class="card"><div class="stat"><span class="num">${debugSolved}<small style="font-size:16px;color:var(--text-mute)">/${DEBUG_BANK.length}</small></span><span class="lbl">Bugs reviewed</span></div></div>
      <div class="card"><div class="stat"><span class="num">${getTokens().toLocaleString()}</span><span class="lbl">AI tokens used</span></div></div>
    </div>

    <div class="section"><h2>Sections</h2>
      <div class="grid cols-3">${SECTIONS.map(([h, t, d], i) => `<a class="card clickable" href="${h}"><div class="kicker" style="color:var(--text-mute)">${String(i + 1).padStart(2, "0")}</div><h2>${t}</h2><p class="muted" style="margin:0;font-size:14px">${d}</p></a>`).join("")}</div>
    </div>
    <p class="footer-note">${hasKey ? "AI key found in this browser." : "No AI key yet. Add one in Settings to enable the coding round and prompt lab."}</p>
  `);
}
