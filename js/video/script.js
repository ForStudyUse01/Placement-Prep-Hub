// Video Explainer: script format, AI prompt, validation, offline generators, subtitles.
// A script is { title, scenes:[ { type, narration, ...fields } ] }. Scene types:
//   title    { title, subtitle }
//   bullets  { heading, bullets[] }
//   flow     { heading, steps[] }
//   array    { heading, items[], steps:[{hi[], ptr{index:label}, label}] }
//   code     { heading, language, lines[], steps:[{lines[], label}] }
//   compare  { heading, left:{title,points[]}, right:{title,points[]} }
//   callout  { text }
export const SCENE_TYPES = ["title", "bullets", "flow", "array", "code", "compare", "callout"];

import { PART1 } from "../data/video_scripts1.js";
import { PART2 } from "../data/video_scripts2.js";
import { PART3 } from "../data/video_scripts3.js";

const CURATED = { ...PART1, ...PART2, ...PART3 };

const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean);
// Whole sentences up to about n words, never cut mid-sentence and never ending in an ellipsis.
const wholeSentences = (t, n) => { let out = []; let c = 0; for (const s of sentences(t)) { const w = words(s).length; if (out.length && c + w > n) break; out.push(s); c += w; } return out.join(" "); };
export const shorten = (s, n) => { const w = words(s); return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ") + "…"; };
export const sentences = (t) => (String(t || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map((s) => s.trim()).filter(Boolean);

const SCHEMA = `{
  "title": "short video title",
  "scenes": [
    {"type":"title","title":"...","subtitle":"...","narration":"..."},
    {"type":"bullets","heading":"...","bullets":["max 12 words each"],"narration":"..."},
    {"type":"flow","heading":"...","steps":["short step","short step"],"narration":"..."},
    {"type":"array","heading":"...","items":["3","8","1"],"steps":[{"hi":[0],"ptr":{"0":"i"},"label":"what happens"}],"narration":"..."},
    {"type":"code","heading":"...","language":"python","lines":["def f(x):","    return x"],"steps":[{"lines":[0],"label":"what this line does"}],"narration":"..."},
    {"type":"compare","heading":"...","left":{"title":"A","points":["..."]},"right":{"title":"B","points":["..."]},"narration":"..."},
    {"type":"callout","text":"one memorable takeaway","narration":"..."}
  ]
}`;

// A short, high-quality example shown to the model so it copies the depth and style.
const EXAMPLE = `{"title":"Two Pointers","scenes":[
{"type":"title","title":"Two Pointers","subtitle":"Arrays and strings","narration":"Checking every pair in an array is slow. Two pointers can find the answer in one pass, and it works whenever the data is sorted."},
{"type":"array","heading":"Pair that sums to 10","items":["1","3","4","6","8","11"],"steps":[{"hi":[0,5],"ptr":{"0":"L","5":"R"},"label":"1 + 11 = 12, too big"},{"hi":[0,4],"ptr":{"0":"L","4":"R"},"label":"Move R left: 1 + 8 = 9, too small"},{"hi":[2,3],"ptr":{"2":"L","3":"R"},"label":"4 + 6 = 10. Found!"}],"narration":"Put one pointer at each end. One plus eleven is twelve, which is too big, so move the right pointer in. One plus eight is nine, too small, so move the left pointer. Eventually four plus six makes ten."},
{"type":"compare","heading":"Why it is fast","left":{"title":"Brute force","points":["Check every pair","O(n squared)"]},"right":{"title":"Two pointers","points":["Each pointer moves one way","O(n)"]},"narration":"Brute force checks every pair, so the work grows with n squared. With two pointers each one only moves forward, so there are at most n moves in total. That is linear time."},
{"type":"callout","text":"Sorted data plus a target: think two pointers.","narration":"To remember: when the data is sorted and you need a pair or a palindrome check, reach for two pointers."}]}`;

export function buildMessages({ topic, prompt, doc, context, scenes, level }) {
  const system = `You are an expert teacher and scriptwriter. You write scripts for short animated explainer videos for students preparing for campus placement tests. Quality bar: a script a good teacher would be proud of, never a generic overview.
Return ONLY one JSON object, no markdown fence, no commentary, matching this shape:
${SCHEMA}
Rules:
- Exactly ${scenes} scenes. The first is type "title" (a hook: why this matters). The last is type "callout" (one memorable takeaway).
- Structure: hook, core idea, ONE concrete worked example with real numbers or real code traced step by step, a common mistake or comparison, then the takeaway.
- Audience level: ${level}. Plain spoken language, like a friendly teacher talking to one student.
- Each "narration" is 30 to 60 words of complete sentences, written to be read aloud. No symbols, no code, no bullet fragments. Narration must EXPLAIN the scene, not just read the on-screen text. Never end a sentence with "...".
- Be concrete: use specific numbers, names and values. Never write vague filler such as "it is important to understand" or "there are many ways".
- Use at least 3 different scene types. Pick the type that shows the idea best: "array" for algorithm steps on data (6 to 8 items, 3 to 6 steps, every step has a clear label with the actual values), "code" for short code (max 12 lines, steps explain each line with the actual values), "flow" for processes (3 to 6 short steps), "compare" for two things or a mistake versus the fix, "bullets" for 3 to 4 key points.
- Array "steps" are animation frames: hi = highlighted indexes, ptr = pointer labels by index. Code "steps" use zero-based line numbers.
- On-screen text stays short (bullets max 12 words, labels max 14 words). Everything must be factually correct. Never invent facts.
Here is an example of the expected quality and format (a different topic):
${EXAMPLE}`;
  const parts = [];
  if (topic) parts.push(`Topic: ${topic}`);
  if (prompt) parts.push(`Instructions: ${prompt}`);
  if (context) parts.push(`Reference material (use it as the source of truth):\n${context}`);
  if (doc) parts.push(`Document to explain:\n${doc}`);
  return [{ role: "system", content: system }, { role: "user", content: parts.join("\n\n") || "Explain a useful placement-prep topic." }];
}

export function parseScript(text) {
  let s = String(text || "").trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1];
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("The model did not return JSON. Try again or use the offline mode.");
  let raw;
  try { raw = JSON.parse(s.slice(a, b + 1)); } catch { throw new Error("The model returned broken JSON. Try again, or lower the scene count."); }
  return sanitize(raw);
}

const arr = (v, n, f = String) => (Array.isArray(v) ? v : []).slice(0, n).map(f);

export function sanitize(raw, fallbackTitle = "Explainer") {
  const title = String(raw?.title || fallbackTitle);
  const out = [];
  for (const sc of (Array.isArray(raw?.scenes) ? raw.scenes : []).slice(0, 14)) {
    let type = SCENE_TYPES.includes(sc?.type) ? sc.type : "bullets";
    const s = { type, narration: String(sc?.narration || "").trim() };
    if (type === "title") { s.title = String(sc.title || title); s.subtitle = String(sc.subtitle || ""); }
    else if (type === "callout") { s.text = String(sc.text || s.narration || ""); }
    else s.heading = String(sc.heading || "");
    if (type === "bullets") s.bullets = arr(sc.bullets, 6);
    if (type === "flow") s.steps = arr(sc.steps, 6);
    if (type === "array") {
      s.items = arr(sc.items, 12);
      s.steps = arr(sc.steps, 10, (st) => ({
        hi: arr(st?.hi, 12, Number).filter((i) => i >= 0 && i < s.items.length),
        ptr: Object.fromEntries(Object.entries(st?.ptr || {}).filter(([k]) => Number(k) >= 0 && Number(k) < s.items.length).map(([k, v]) => [k, String(v).slice(0, 8)])),
        label: String(st?.label || "")
      }));
      if (!s.items.length) { s.type = "bullets"; s.bullets = sentences(s.narration).slice(0, 4).map((x) => shorten(x, 12)); delete s.items; delete s.steps; }
    }
    if (type === "code") {
      s.language = String(sc.language || "");
      s.lines = arr(sc.lines, 14);
      s.steps = arr(sc.steps, 10, (st) => ({ lines: arr(st?.lines, 6, Number).filter((i) => i >= 0 && i < s.lines.length), label: String(st?.label || "") }));
      if (!s.lines.length) { s.type = "bullets"; s.bullets = sentences(s.narration).slice(0, 4).map((x) => shorten(x, 12)); delete s.lines; delete s.steps; }
    }
    if (type === "compare") {
      const side = (o) => ({ title: String(o?.title || ""), points: arr(o?.points, 4) });
      s.left = side(sc.left);
      s.right = side(sc.right);
    }
    if (!s.narration) {
      s.narration = s.type === "title" ? `Let's learn about ${s.title}.` : s.heading || s.text || (s.bullets || s.steps || []).map((x) => (typeof x === "string" ? x : x.label || "")).join(". ");
    }
    out.push(s);
  }
  if (!out.length) throw new Error("The script had no scenes.");
  if (out[0].type !== "title") out.unshift({ type: "title", title, subtitle: "", narration: `Let's learn about ${title}.` });
  return { title, scenes: out };
}

// Make narration friendlier for speech engines: spell out Big-O and symbols.
export function speakable(t) {
  return String(t)
    .replace(/O\(1\)/g, "O of one")
    .replace(/O\(n\s*log\s*n\)/gi, "O of n log n")
    .replace(/O\(log\s*n\)/gi, "O of log n")
    .replace(/O\(n\^?2\)|O\(n²\)/g, "O of n squared")
    .replace(/O\(2\^n\)|O\(2ⁿ\)/g, "O of two to the n")
    .replace(/O\(n\)/g, "O of n")
    .replace(/==/g, " equals ").replace(/!=/g, " is not equal to ").replace(/<=/g, " is at most ").replace(/>=/g, " is at least ")
    .replace(/->|→/g, " to ")
    .replace(/\bvs\.?\b/gi, "versus").replace(/\be\.g\./gi, "for example").replace(/\bi\.e\./gi, "that is")
    .replace(/[`*_#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Seconds the on-screen animation needs, independent of the voice.
export function animDuration(sc) {
  return sc.type === "title" ? 3 : sc.type === "callout" ? 4 : sc.type === "bullets" ? (sc.bullets?.length || 1) * 1.1 + 1
    : sc.type === "flow" ? (sc.steps?.length || 1) * 1.4 + 1 : sc.type === "array" ? Math.max(1, sc.steps?.length || 1) * 1.7 + 1
    : sc.type === "code" ? (sc.lines?.length || 1) * 0.35 + Math.max(1, sc.steps?.length || 1) * 1.4 + 1 : 5;
}

// Seconds a scene needs at speaking rate 1 (estimated speech vs animation, whichever is longer).
export function estimateDuration(sc) {
  const speak = words(speakable(sc.narration)).length / 2.6 + 0.8;
  return Math.max(3, speak, animDuration(sc));
}

/* ---------------- quality check ---------------- */

// Returns a list of problems that make a script feel low quality.
export function qualityIssues(script) {
  const issues = [];
  const sc = script?.scenes || [];
  if (sc.length < 4) issues.push("Only " + sc.length + " scenes");
  const types = new Set(sc.map((s) => s.type));
  if (sc.length >= 5 && types.size < 3) issues.push("Not enough variety of scene types");
  sc.forEach((s, i) => {
    const n = i + 1;
    const wc = words(s.narration).length;
    if (wc < 14 && s.type !== "callout") issues.push(`Scene ${n}: narration too short (${wc} words)`);
    if (/…|\.\.\./.test(s.narration)) issues.push(`Scene ${n}: narration is cut off`);
    if (s.type === "array" && (s.steps || []).length < 2) issues.push(`Scene ${n}: array needs 2 or more steps`);
    if (s.type === "code" && (s.steps || []).length < 2) issues.push(`Scene ${n}: code needs 2 or more steps`);
    if (s.type === "bullets" && (s.bullets || []).some((b) => /…$/.test(b))) issues.push(`Scene ${n}: bullet text is cut off`);
    if (s.type === "flow" && (s.steps || []).length < 3) issues.push(`Scene ${n}: flow needs 3 or more steps`);
  });
  return issues;
}

// Prompt used to repair or polish an existing script with the AI.
export function buildPolishMessages(script, issues, level = "beginner") {
  const system = `You are an expert teacher and scriptwriter. You improve scripts for animated explainer videos for campus placement students.
Return ONLY one JSON object in the same shape as the input script, no markdown, no commentary. Keep the same number of scenes and the same scene order.
Rules:
- Rewrite every "narration" as 30 to 60 words of complete, spoken sentences that EXPLAIN the scene with specific values. No cut off sentences, no symbols.
- Make labels, bullets and steps concrete and short. Fix anything factually wrong.
- Keep array indexes, pointers and code line numbers valid. Do not change code lines unless wrong.
- Audience level: ${level}.${issues.length ? "\nKnown problems to fix: " + issues.join("; ") + "." : ""}`;
  return [{ role: "system", content: system }, { role: "user", content: JSON.stringify(script) }];
}

/* ---------------- offline generators (no AI key needed) ---------------- */

export function offlineFromText(title, text, count = 6) {
  const sents = sentences(text).filter((s) => words(s).length >= 4);
  const scenes = [{ type: "title", title: shorten(title, 10), subtitle: "Animated explainer", narration: `Here are the main ideas of ${shorten(title, 10).replace(/…$/, "")}.` }];
  const body = Math.max(1, count - 2);
  const per = Math.max(2, Math.ceil(sents.length / body));
  for (let i = 0; i < body && i * per < sents.length; i++) {
    const chunk = sents.slice(i * per, i * per + Math.min(per, 4));
    scenes.push({ type: "bullets", heading: i === 0 ? "The big picture" : `Key idea ${i + 1}`, bullets: chunk.map((s) => shorten(s, 12)), narration: chunk.join(" ") });
  }
  scenes.push({ type: "callout", text: wholeSentences(sents[sents.length - 1] || title, 18), narration: `To remember: ${wholeSentences(sents[sents.length - 1] || title, 40)}` });
  return sanitize({ title, scenes });
}

// Hand-written lesson for a study topic id, or null.
export function curatedScript(id, count) {
  const lesson = CURATED[id];
  if (!lesson) return null;
  let scenes = lesson.scenes.slice();
  if (count && count < scenes.length) {
    // drop middle scenes (keep the hook and the takeaway), least visual first
    const rank = { bullets: 0, compare: 1, flow: 2, code: 3, array: 3 };
    while (scenes.length > Math.max(3, count)) {
      let idx = -1, best = 99;
      for (let i = 1; i < scenes.length - 1; i++) { const r = rank[scenes[i].type] ?? 1; if (r < best) { best = r; idx = i; } }
      scenes.splice(idx, 1);
    }
  }
  return sanitize({ title: lesson.title, scenes });
}

export const hasCurated = (id) => !!CURATED[id];

export function offlineFromTopic(topic, extra, count = 7) {
  const doc = new DOMParser().parseFromString(topic.body, "text/html");
  const lis = [...doc.querySelectorAll("li")].map((l) => l.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
  const paras = [...doc.querySelectorAll("p")].map((p) => p.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
  const cleanTitle = topic.title.split(/[:—]/)[0].trim();
  const scenes = [{ type: "title", title: cleanTitle, subtitle: topic.category, narration: extra?.why || paras[0] || `This video explains ${cleanTitle}.` }];
  const ideas = (lis.length ? lis : sentences(paras.join(" "))).slice(0, 4);
  if (ideas.length) scenes.push({ type: "bullets", heading: "Key ideas", bullets: ideas.map((s) => shorten(s, 12)), narration: "Here are the key ideas. " + ideas.map((s) => wholeSentences(s, 30).replace(/[.!?]+$/, "")).join(". ") + "." });
  const ex = extra?.example;
  if (ex) {
    if (ex.code) {
      const lines = ex.code.split("\n").slice(0, 12);
      scenes.push({ type: "code", heading: shorten(ex.title, 8), language: "", lines, steps: ex.walk.slice(0, 6).map((w, i) => ({ lines: [Math.min(i, lines.length - 1)], label: shorten(w, 14) })), narration: "Let's walk through an example. " + ex.walk.slice(0, 3).map((w) => wholeSentences(w, 28)).join(" ") });
    }
    scenes.push({ type: "flow", heading: ex.code ? "Step by step" : shorten(ex.title, 8), steps: ex.walk.slice(0, 6).map((w) => shorten(w, 9)), narration: ex.walk.slice(0, 5).map((w) => wholeSentences(w, 30)).join(" ") });
  }
  if (extra?.mistakes?.length && extra?.exam?.length) scenes.push({ type: "compare", heading: "Avoid mistakes, score marks", left: { title: "Common mistakes", points: extra.mistakes.slice(0, 3).map((x) => shorten(x, 12)) }, right: { title: "In exams", points: extra.exam.slice(0, 3).map((x) => shorten(x, 12)) }, narration: "Watch out for these common mistakes. " + extra.mistakes.slice(0, 2).map((x) => wholeSentences(x, 30)).join(" ") + " In exams, " + wholeSentences(extra.exam[0], 30) });
  scenes.push({ type: "callout", text: wholeSentences(ex?.result || extra?.why || cleanTitle, 20), narration: `Remember this: ${wholeSentences(ex?.result || extra?.why || cleanTitle, 40)}` });
  // trim middle scenes to the requested count
  while (scenes.length > count && scenes.length > 3) scenes.splice(scenes.length - 2, 1);
  return sanitize({ title: cleanTitle, scenes });
}

/* ---------------- subtitles ---------------- */

const stamp = (sec) => { const ms = Math.round(sec * 1000); const p = (n, l = 2) => String(n).padStart(l, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };

export function toSrt(script, rate = 1) {
  let t = 0, n = 1, out = "";
  for (const sc of script.scenes) {
    const dur = estimateDuration(sc) / rate;
    const sents = sentences(sc.narration);
    const total = sents.reduce((a, s) => a + words(s).length, 0) || 1;
    let at = t;
    for (const s of sents) {
      const d = (words(s).length / total) * dur;
      out += `${n++}\n${stamp(at)} --> ${stamp(at + d)}\n${s}\n\n`;
      at += d;
    }
    t += dur;
  }
  return out;
}
