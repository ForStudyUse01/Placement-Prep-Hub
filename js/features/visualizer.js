import { renderHTML, escapeHtml } from "../dom.js";

// Each algorithm builds an array of frames: { kind:"bars"|"graph", ... , note }
export const GRAPH = {
  nodes: { A: [60, 50], B: [180, 30], C: [300, 60], D: [100, 150], E: [220, 160], F: [340, 150] },
  adj: { A: ["B", "D"], B: ["A", "C", "E"], C: ["B", "F"], D: ["A", "E"], E: ["B", "D", "F"], F: ["C", "E"] }
};
export const TREE = {
  nodes: { 8: [200, 30], 4: [110, 90], 12: [290, 90], 2: [65, 150], 6: [155, 150], 10: [245, 150], 14: [335, 150] },
  kids: { 8: [4, 12], 4: [2, 6], 12: [10, 14], 2: [], 6: [], 10: [], 14: [] }
};

function bubbleFrames() {
  const a = [7, 3, 9, 1, 6, 2, 8, 4];
  const f = [{ kind: "bars", arr: [...a], hi: {}, note: "Unsorted array. Compare neighbours, swap if left > right." }];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      f.push({ kind: "bars", arr: [...a], hi: { [j]: "cmp", [j + 1]: "cmp" }, note: `Compare ${a[j]} and ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        f.push({ kind: "bars", arr: [...a], hi: { [j]: "swap", [j + 1]: "swap" }, note: "Swapped" });
      }
    }
  }
  f.push({ kind: "bars", arr: [...a], hi: Object.fromEntries(a.map((_, i) => [i, "done"])), note: "Sorted. Time O(n²), space O(1)." });
  return f;
}
function binaryFrames() {
  const a = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const t = 23;
  let lo = 0, hi = a.length - 1;
  const f = [{ kind: "bars", arr: a, hi: {}, note: `Search ${t} in a sorted array.` }];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const h = {};
    for (let i = lo; i <= hi; i++) h[i] = "range";
    h[mid] = "cmp";
    f.push({ kind: "bars", arr: a, hi: h, note: `lo=${lo}, hi=${hi}, mid=${mid} → ${a[mid]}` });
    if (a[mid] === t) { f.push({ kind: "bars", arr: a, hi: { [mid]: "done" }, note: `Found ${t} at index ${mid}. O(log n).` }); return f; }
    if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
  }
  return f;
}
function graphFrames(mode) {
  const visited = new Set(), order = [];
  const frames = [];
  const snap = (cur, struct, note) => frames.push({ kind: "graph", cur, visited: [...visited], struct: [...struct], label: mode === "bfs" ? "Queue" : "Stack", note });
  const struct = ["A"];
  visited.add("A");
  snap(null, struct, `Start at A. Mark visited when added to the ${mode === "bfs" ? "queue" : "stack"}.`);
  while (struct.length) {
    const cur = mode === "bfs" ? struct.shift() : struct.pop();
    order.push(cur);
    snap(cur, struct, `Process ${cur}`);
    for (const n of GRAPH.adj[cur]) {
      if (!visited.has(n)) { visited.add(n); struct.push(n); snap(cur, struct, `Discover ${n} from ${cur}`); }
    }
  }
  snap(null, [], `Order: ${order.join(" → ")}`);
  return frames;
}
function treeFrames(kind) {
  const order = [];
  const walk = (n) => {
    if (n === undefined) return;
    const [l, r] = TREE.kids[n];
    if (kind === "pre") order.push(n);
    walk(l);
    if (kind === "in") order.push(n);
    walk(r);
    if (kind === "post") order.push(n);
  };
  if (kind === "level") {
    const q = [8];
    while (q.length) { const n = q.shift(); order.push(n); q.push(...TREE.kids[n]); }
  } else walk(8);
  const frames = [{ kind: "tree", seen: [], cur: null, note: `${kind}-order traversal of the tree` }];
  order.forEach((n, i) => frames.push({ kind: "tree", seen: order.slice(0, i), cur: n, note: `Visit ${n}  (sequence so far: ${order.slice(0, i + 1).join(", ")})` }));
  frames.push({ kind: "tree", seen: order, cur: null, note: `Final: ${order.join(", ")}` });
  return frames;
}
function stackFrames() {
  const s = "{[()]}(";
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const st = [];
  const f = [{ kind: "stack", str: s, idx: -1, st: [], note: "Valid parentheses: push openers, pop on closers." }];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (pairs[c]) { const top = st.pop(); f.push({ kind: "stack", str: s, idx: i, st: [...st], note: top === pairs[c] ? `${c} matches ${top}, popped` : `${c} mismatch → invalid` }); }
    else { st.push(c); f.push({ kind: "stack", str: s, idx: i, st: [...st], note: `Push ${c}` }); }
  }
  f.push({ kind: "stack", str: s, idx: s.length, st: [...st], note: st.length ? "Stack not empty → invalid (unclosed '(')" : "Valid" });
  return f;
}

export const ALGOS = {
  "Bubble sort": bubbleFrames, "Binary search": binaryFrames,
  "BFS (graph)": () => graphFrames("bfs"), "DFS (graph)": () => graphFrames("dfs"),
  "Tree inorder": () => treeFrames("in"), "Tree preorder": () => treeFrames("pre"),
  "Tree postorder": () => treeFrames("post"), "Tree level-order": () => treeFrames("level"),
  "Stack: parentheses": stackFrames
};

const COLORS = { cmp: "var(--warn)", swap: "var(--danger)", done: "var(--accent-2)", range: "var(--accent)" };

export function draw(fr) {
  if (fr.kind === "bars") {
    const w = 44, max = Math.max(...fr.arr);
    return `<svg class="svgviz" viewBox="0 0 ${fr.arr.length * w + 20} 200">${fr.arr.map((v, i) => {
      const h = (v / max) * 150, c = COLORS[fr.hi[i]] || "var(--text-mute)";
      return `<rect x="${10 + i * w}" y="${170 - h}" width="${w - 6}" height="${h}" rx="4" fill="${c}"/><text x="${10 + i * w + (w - 6) / 2}" y="190" text-anchor="middle">${v}</text>`;
    }).join("")}</svg>`;
  }
  if (fr.kind === "graph") {
    const edges = [];
    for (const [a, ns] of Object.entries(GRAPH.adj)) for (const b of ns) if (a < b) edges.push(`<line class="edge" x1="${GRAPH.nodes[a][0]}" y1="${GRAPH.nodes[a][1]}" x2="${GRAPH.nodes[b][0]}" y2="${GRAPH.nodes[b][1]}"/>`);
    const nodes = Object.entries(GRAPH.nodes).map(([k, [x, y]]) => {
      const c = k === fr.cur ? "var(--warn)" : fr.visited.includes(k) ? "var(--accent-2)" : "var(--accent)";
      return `<circle cx="${x}" cy="${y}" r="20" fill="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff">${k}</text>`;
    });
    return `<svg class="svgviz" viewBox="0 0 400 200">${edges.join("")}${nodes.join("")}<text x="10" y="195">${fr.label}: [${fr.struct.join(", ")}]</text></svg>`;
  }
  if (fr.kind === "tree") {
    const lines = [];
    for (const [p, ks] of Object.entries(TREE.kids)) for (const k of ks) lines.push(`<line class="edge" x1="${TREE.nodes[p][0]}" y1="${TREE.nodes[p][1]}" x2="${TREE.nodes[k][0]}" y2="${TREE.nodes[k][1]}"/>`);
    const nodes = Object.entries(TREE.nodes).map(([k, [x, y]]) => {
      const n = Number(k), c = n === fr.cur ? "var(--warn)" : fr.seen.includes(n) ? "var(--accent-2)" : "var(--accent)";
      return `<circle cx="${x}" cy="${y}" r="20" fill="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff">${k}</text>`;
    });
    return `<svg class="svgviz" viewBox="0 0 400 190">${lines.join("")}${nodes.join("")}</svg>`;
  }
  const chars = [...fr.str].map((c, i) => `<text x="${20 + i * 26}" y="30" font-size="20" fill="${i === fr.idx ? "var(--warn)" : "var(--text)"}">${escapeHtml(c)}</text>`).join("");
  const boxes = fr.st.map((c, i) => `<rect x="150" y="${190 - (i + 1) * 28}" width="80" height="24" rx="5" fill="var(--accent)"/><text x="190" y="${190 - (i + 1) * 28 + 17}" text-anchor="middle" fill="#fff">${escapeHtml(c)}</text>`).join("");
  return `<svg class="svgviz" viewBox="0 0 400 200">${chars}${boxes}<line x1="140" y1="194" x2="240" y2="194" stroke="var(--border)"/></svg>`;
}

let timer = null;

export function render(root) {
  clearInterval(timer);
  renderHTML(root, `
    <h1>Algorithm Visualizer</h1>
    <p class="lead">Step through sorting, searching, graph and tree algorithms. Pick one, press Play or Step.</p>
    <div class="toolbar">
      <select id="algo">${Object.keys(ALGOS).map((k) => `<option>${k}</option>`).join("")}</select>
      <button class="btn" id="play">▶ Play</button>
      <button class="btn secondary" id="step">Step</button>
      <button class="btn secondary" id="reset">Reset</button>
      <label style="margin:0">Speed <input type="range" id="speed" min="150" max="1200" value="600"/></label>
    </div>
    <div class="card"><div id="stage"></div><p id="note" style="margin-top:10px;font-weight:600"></p><p class="muted" id="count" style="font-size:12px"></p></div>
  `);
  let frames = [], i = 0;
  const stage = root.querySelector("#stage"), note = root.querySelector("#note"), count = root.querySelector("#count"), playBtn = root.querySelector("#play");
  const show = () => {
    renderHTML(stage, draw(frames[i]));
    note.textContent = frames[i].note;
    count.textContent = `Step ${i + 1} / ${frames.length}`;
  };
  const stop = () => { clearInterval(timer); timer = null; playBtn.textContent = "▶ Play"; };
  const load = () => { stop(); frames = ALGOS[root.querySelector("#algo").value](); i = 0; show(); };
  const next = () => { if (i < frames.length - 1) { i++; show(); return true; } stop(); return false; };
  const start = () => { timer = setInterval(next, Number(root.querySelector("#speed").value)); playBtn.textContent = "⏸ Pause"; };

  root.querySelector("#algo").addEventListener("change", load);
  root.querySelector("#reset").addEventListener("click", load);
  root.querySelector("#step").addEventListener("click", () => { stop(); next(); });
  playBtn.addEventListener("click", () => { if (timer) return stop(); if (i >= frames.length - 1) i = 0; start(); });
  root.querySelector("#speed").addEventListener("change", () => { if (timer) { stop(); start(); } });
  load();
}
