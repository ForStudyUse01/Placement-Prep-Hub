// Executes candidate code against a problem's test cases, fully client-side.
// Python: Pyodide in a Web Worker. JavaScript: a throwaway Web Worker.
// Workers have no access to the page, its DOM, or localStorage (your API keys).
import { fnName } from "./data/coding_problems.js";

let pyWorker = null;
let pyReady = null;

function getPython() {
  if (!pyWorker) {
    pyWorker = new Worker("js/pyworker.js");
    pyReady = new Promise((resolve, reject) => {
      const onMsg = (e) => { if (e.data.type === "ready") { pyWorker.removeEventListener("message", onMsg); resolve(); } };
      pyWorker.addEventListener("message", onMsg);
      pyWorker.addEventListener("error", () => { pyWorker = null; reject(new Error("Could not load the Python runtime (needs internet on first run).")); });
    });
  }
  return pyReady;
}

function resetPython() {
  if (pyWorker) pyWorker.terminate();
  pyWorker = null;
  pyReady = null;
}

async function runPython(code, fn, cases, kind) {
  await Promise.race([getPython(), new Promise((_, rej) => setTimeout(() => rej(new Error("Python runtime took too long to load.")), 90000))]);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { resetPython(); reject(new Error("Timed out after 10s (infinite loop or too slow).")); }, 10000);
    const onMsg = (e) => {
      if (e.data.type === "ready") return;
      clearTimeout(timer);
      pyWorker.removeEventListener("message", onMsg);
      if (e.data.type === "error") reject(new Error(e.data.message.split("\n").filter(Boolean).slice(-2).join(" | ")));
      else resolve(JSON.parse(e.data.out));
    };
    pyWorker.addEventListener("message", onMsg);
    pyWorker.postMessage({ code, fn, cases, kind });
  });
}

function runJavaScript(code, fn, cases, kind) {
  return new Promise((resolve, reject) => {
    const src = `const __cases = ${JSON.stringify(cases)};
const __out = [];
try {
${code}
;
const __t = (typeof ${fn} !== "undefined") ? ${fn} : null;
for (const c of __cases) {
  if (!__t) { __out.push({ err: "Name '${fn}' not found. Define it with exactly that name." }); continue; }
  try {
    let r;
    if (${JSON.stringify(kind || "")} === "lru") {
      const o = new __t(c.args[0]); r = [];
      for (const op of c.args[1]) { if (op[0] === "put") o.put(op[1], op[2]); else r.push(o.get(op[1])); }
    } else r = __t(...c.args);
    __out.push({ got: JSON.stringify(r === undefined ? null : r) });
  } catch (e) { __out.push({ err: String(e) }); }
}
postMessage({ out: __out });
} catch (e) { postMessage({ fatal: String(e) }); }`;
    const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    const w = new Worker(url);
    const done = () => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); };
    const timer = setTimeout(() => { done(); reject(new Error("Timed out after 5s (infinite loop or too slow).")); }, 5000);
    w.onmessage = (e) => { done(); e.data.fatal ? reject(new Error(e.data.fatal)) : resolve(e.data.out); };
    w.onerror = (e) => { done(); reject(new Error(e.message || "Syntax error in your code.")); };
  });
}

const canon = (raw, cmp) => {
  try {
    const v = JSON.parse(raw);
    if (cmp === "sorted" && Array.isArray(v)) return JSON.stringify([...v].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    return JSON.stringify(v);
  } catch { return raw; }
};

export async function runTests({ lang, code, problem }) {
  const fn = fnName(lang === "Python" ? problem.py : problem.js);
  const all = [...problem.cases.map((c) => ({ ...c, hidden: false })), ...problem.hidden.map((c) => ({ ...c, hidden: true }))];
  const payload = all.map((c) => ({ args: c.args, expected: c.expected }));
  const raw = lang === "Python" ? await runPython(code, fn, payload, problem.kind) : await runJavaScript(code, fn, payload, problem.kind);
  const rows = all.map((c, i) => {
    const r = raw[i] || { err: "No result" };
    const pass = r.got !== undefined && canon(r.got, problem.cmp) === canon(JSON.stringify(c.expected), problem.cmp);
    return { hidden: c.hidden, args: c.args, expected: c.expected, got: r.got, err: r.err, pass };
  });
  return { rows, passed: rows.filter((r) => r.pass).length, total: rows.length };
}

// Pull the code block for the chosen language out of a model reply.
export function extractCode(text, lang) {
  const blocks = [...text.matchAll(/```([a-zA-Z+#]*)[ \t]*\r?\n([\s\S]*?)```/g)].map((m) => ({ tag: m[1].toLowerCase(), code: m[2].trim() }));
  if (!blocks.length) return text.includes("def ") || text.includes("function ") ? text.trim() : "";
  const tags = lang === "Python" ? ["python", "py"] : ["javascript", "js", "node"];
  const hit = blocks.find((b) => tags.includes(b.tag)) || blocks.sort((a, b) => b.code.length - a.code.length)[0];
  return hit.code;
}
