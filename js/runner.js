// Executes candidate code against test cases, fully client-side where possible.
// Python: Pyodide in a Web Worker. JavaScript: a throwaway Web Worker. Workers have no access
// to the page, its DOM, or localStorage (your API keys).
// C, C++ and Java cannot run in a browser: they are compiled and run on the free Wandbox service.
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

const loadTimeout = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Python runtime took too long to load.")), 90000));

/* ---------------- function-style tests (AI-assisted coding round) ---------------- */

async function runPython(code, fn, cases, kind) {
  await Promise.race([getPython(), loadTimeout()]);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { resetPython(); reject(new Error("Timed out after 10s (infinite loop or too slow).")); }, 10000);
    const onMsg = (e) => {
      if (e.data.type === "ready" || e.data.type === "stdio") return;
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

/* ---------------- whole-program (stdin/stdout) runners for the Debugging Arena ---------------- */

async function runPythonProgram(code, stdin) {
  await Promise.race([getPython(), loadTimeout()]);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { resetPython(); reject(new Error("Timed out after 10s (infinite loop or too slow).")); }, 10000);
    const onMsg = (e) => {
      if (e.data.type !== "stdio") return;
      clearTimeout(timer);
      pyWorker.removeEventListener("message", onMsg);
      resolve({ stdout: e.data.out, error: e.data.err });
    };
    pyWorker.addEventListener("message", onMsg);
    pyWorker.postMessage({ mode: "stdio", code, stdin });
  });
}

function runJsProgram(code, stdin) {
  return new Promise((resolve, reject) => {
    const src = `const __IN = ${JSON.stringify(stdin)};
const __out = [];
const __console = { log: (...a) => __out.push(a.map(String).join(" ")) };
try {
(function (console, readAll) {
${code}
})(__console, () => __IN);
postMessage({ out: __out.join("\\n") });
} catch (e) { postMessage({ fatal: String(e) }); }`;
    const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    const w = new Worker(url);
    const done = () => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); };
    const timer = setTimeout(() => { done(); reject(new Error("Timed out after 5s (infinite loop or too slow).")); }, 5000);
    w.onmessage = (e) => { done(); resolve(e.data.fatal ? { stdout: "", error: e.data.fatal } : { stdout: e.data.out, error: null }); };
    w.onerror = (e) => { done(); resolve({ stdout: "", error: "SyntaxError: " + (e.message || "your code does not parse") }); };
  });
}

let compilerCache = null;
async function wandboxCompilers() {
  if (compilerCache) return compilerCache;
  const fallback = { c: "gcc-13.2.0-c", cpp: "gcc-13.2.0", java: "openjdk-jdk-22+36" };
  try {
    const res = await fetch("https://wandbox.org/api/list.json");
    const list = await res.json();
    const pick = (language, test) => list
      .filter((x) => x.language === language && test(x.name) && !/head|trunk|prerelease|nightly/i.test(x.name))
      .sort((a, b) => String(b.version || b.name).localeCompare(String(a.version || a.name), undefined, { numeric: true }))[0]?.name;
    compilerCache = {
      c: pick("C", (n) => /^gcc-.*-c$/.test(n)) || fallback.c,
      cpp: pick("C++", (n) => /^gcc-\d/.test(n) && !/-c$/.test(n)) || fallback.cpp,
      java: pick("Java", (n) => /^openjdk/.test(n)) || fallback.java
    };
  } catch {
    compilerCache = fallback;
  }
  return compilerCache;
}

async function runWandbox(lang, code, stdin) {
  const compiler = (await wandboxCompilers())[lang];
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 40000);
  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler, code, stdin, save: false }),
      signal: ctl.signal
    });
    const j = await res.json();
    const compileErr = (j.compiler_error || "").trim();
    const runErr = (j.program_error || "").trim();
    const out = j.program_output || "";
    if (compileErr && !out.trim()) return { stdout: "", error: "Compile error:\n" + compileErr.split("\n").slice(0, 12).join("\n"), compile: true };
    if (j.status && j.status !== "0" && !out.trim()) return { stdout: "", error: "Runtime error: " + (runErr || j.signal || "exit status " + j.status) };
    return { stdout: out, error: null };
  } catch (err) {
    throw new Error("Could not reach the online compiler (wandbox.org): " + (err.name === "AbortError" ? "timed out" : err.message) + ". Python and JavaScript run offline.");
  } finally {
    clearTimeout(timer);
  }
}

export async function runProgram(lang, code, stdin) {
  if (lang === "py") return runPythonProgram(code, stdin);
  if (lang === "js") return runJsProgram(code, stdin);
  return runWandbox(lang, code, stdin);
}

// Runs a Debugging Arena problem: every visible and hidden case in a single execution.
export async function runDebugTests(problem, lang, code) {
  const cases = [...problem.cases, ...problem.hidden];
  const stdin = cases.length + "\n" + cases.join("\n") + "\n";
  const r = await runProgram(lang, code, stdin);
  if (r.error && !r.stdout.trim()) return { error: r.error, compile: !!r.compile };
  const lines = r.stdout.split("\n").map((s) => s.trim());
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  const rows = cases.map((input, i) => ({
    hidden: i >= problem.cases.length,
    input,
    expected: problem.expected[i],
    got: lines[i] === undefined ? "(no output)" : lines[i],
    pass: lines[i] === problem.expected[i]
  }));
  return { rows, passed: rows.filter((x) => x.pass).length, total: rows.length, warning: r.error };
}
