// Verifies the C, C++ and Java solutions of the Debugging Arena with real compilers.
// Requires gcc, g++ and a JDK (javac + java) on PATH. Any that are missing are skipped.
// Usage: node tools/verify-debug-native.mjs [d001 d002 ...]   (no args = all problems)
// For every problem: the FIXED program must pass every test, and the BUGGED program must
// fail to compile or fail at least one test.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PROBLEMS, buildProgram } from "../js/data/debug/index.js";

const has = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8" }); return !r.error && r.status === 0; };
const TOOLS = {
  c: has("gcc", ["--version"]),
  cpp: has("g++", ["--version"]),
  java: has("javac", ["-version"]) && has("java", ["-version"])
};
const only = process.argv.slice(2);
const suffix = process.platform === "win32" ? ".exe" : "";
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dbgn-"));

function compile(lang, program, dir) {
  if (lang === "java") {
    fs.writeFileSync(path.join(dir, "Main.java"), program);
    const r = spawnSync("javac", ["Main.java"], { cwd: dir, encoding: "utf8", timeout: 60000 });
    return r.status === 0 ? { cmd: "java", args: ["-cp", dir, "Main"] } : { error: (r.stderr || "").split("\n").slice(0, 3).join(" | ") };
  }
  const src = path.join(dir, lang === "c" ? "m.c" : "m.cpp");
  const bin = path.join(dir, "prog" + suffix);
  fs.writeFileSync(src, program);
  const args = lang === "c" ? ["-O1", "-o", bin, src] : ["-O1", "-std=c++17", "-o", bin, src];
  const r = spawnSync(lang === "c" ? "gcc" : "g++", args, { encoding: "utf8", timeout: 60000 });
  return r.status === 0 ? { cmd: bin, args: [] } : { error: (r.stderr || "").split("\n").filter((l) => /error/.test(l)).slice(0, 2).join(" | ") || "compile failed" };
}

function runBinary(b, stdin) {
  const r = spawnSync(b.cmd, b.args, { input: stdin, encoding: "utf8", timeout: 10000 });
  if (r.status !== 0) return { error: "runtime error or timeout" };
  return { lines: r.stdout.trim().split("\n").map((s) => s.trim()) };
}

const problems = PROBLEMS.filter((p) => !only.length || only.includes(p.id));
const failures = [];
let checked = 0;
for (const lang of ["c", "cpp", "java"]) {
  if (!TOOLS[lang]) { console.log(`skipping ${lang}: compiler not found on PATH`); continue; }
  for (const p of problems) {
    checked++;
    const dir = fs.mkdtempSync(path.join(tmp, lang + "-"));
    const all = [...p.cases, ...p.hidden];
    const stdin = `${all.length}\n${all.join("\n")}\n`;
    const fixed = compile(lang, buildProgram(p, lang, "fixed"), dir);
    if (fixed.error) { failures.push(`${p.id}/${lang}: FIXED does not compile: ${fixed.error}`); continue; }
    const out = runBinary(fixed, stdin);
    if (out.error) failures.push(`${p.id}/${lang}: FIXED ${out.error}`);
    else if (JSON.stringify(out.lines) !== JSON.stringify(p.expected)) failures.push(`${p.id}/${lang}: FIXED wrong output ${JSON.stringify(out.lines)} expected ${JSON.stringify(p.expected)}`);
    const bdir = fs.mkdtempSync(path.join(tmp, lang + "b-"));
    const bug = compile(lang, buildProgram(p, lang, "bug"), bdir);
    if (bug.error) { if (p.bug.type !== "syntax") failures.push(`${p.id}/${lang}: logic bug fails to COMPILE: ${bug.error}`); continue; }
    if (p.bug.type === "syntax") { failures.push(`${p.id}/${lang}: syntax bug still compiles`); continue; }
    const bout = runBinary(bug, stdin);
    if (!bout.error && JSON.stringify(bout.lines) === JSON.stringify(p.expected)) failures.push(`${p.id}/${lang}: BUG DOES NOT FAIL any test`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${checked} language checks run, ${failures.length} problem(s) found`);
failures.forEach((f) => console.log(" -", f));
process.exit(failures.length ? 1 : 0);
