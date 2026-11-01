import { stepper, cells, vars, bar, table, esc, renderHTML } from "./core.js";
import { ALGOS, draw as drawAlgo, GRAPH, TREE } from "../features/visualizer.js";

const $ = (host, s) => host.querySelector(s);

function picker(title, names, intro) {
  return {
    title,
    mount(host) {
      renderHTML(host, `${intro ? `<p class="muted" style="margin-top:0">${esc(intro)}</p>` : ""}<div class="vrow"><label>Choose</label><select>${names.map((n) => `<option>${esc(n)}</option>`).join("")}</select></div><div class="sub"></div>`);
      const sel = $(host, "select");
      const load = () => stepper($(host, ".sub"), ALGOS[sel.value](), (f) => drawAlgo(f));
      sel.addEventListener("change", load);
      load();
    }
  };
}

export const sortSearch = picker("Sorting and searching, step by step", ["Bubble sort", "Binary search"]);
export const traversals = picker("Tree traversals", ["Tree inorder", "Tree preorder", "Tree postorder", "Tree level-order"], "Same tree, four visiting orders. Watch where the root is visited.");
export const graphWalk = {
  title: "Representations and BFS / DFS",
  mount(host) {
    const names = Object.keys(GRAPH.adj);
    const matrix = names.map((a) => names.map((b) => (GRAPH.adj[a].includes(b) ? 1 : 0)));
    renderHTML(host, `<div class="grid cols-2" style="margin-bottom:14px"><div class="card"><label>Adjacency list</label><div class="vlog">${names.map((n) => `<div>${n}: ${GRAPH.adj[n].join(", ")}</div>`).join("")}</div></div><div class="card"><label>Adjacency matrix</label>${table(matrix.map((r, i) => [names[i], ...r]), { head: ["", ...names] })}</div></div><div class="sub"></div>`);
    const sub = $(host, ".sub");
    renderHTML(sub, `<div class="vrow"><label>Traversal</label><select><option>BFS (graph)</option><option>DFS (graph)</option></select></div><div class="inner"></div>`);
    const sel = $(sub, "select");
    const load = () => stepper($(sub, ".inner"), ALGOS[sel.value](), (f) => drawAlgo(f));
    sel.addEventListener("change", load);
    load();
  }
};

export const stackParens = {
  title: "Stack: matching parentheses",
  mount(host) { stepper(host, ALGOS["Stack: parentheses"](), (f) => drawAlgo(f)); }
};

/* ---------------- arrays ---------------- */
function gridOrder(mode, n) {
  const o = [];
  if (mode === "Row by row") for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) o.push([r, c]);
  else if (mode === "Column by column") for (let c = 0; c < n; c++) for (let r = 0; r < n; r++) o.push([r, c]);
  else {
    let t = 0, b = n - 1, l = 0, r = n - 1;
    while (t <= b && l <= r) {
      for (let c = l; c <= r; c++) o.push([t, c]);
      t++;
      for (let k = t; k <= b; k++) o.push([k, r]);
      r--;
      if (t <= b) { for (let c = r; c >= l; c--) o.push([b, c]); b--; }
      if (l <= r) { for (let k = b; k >= t; k--) o.push([k, l]); l++; }
    }
  }
  return o;
}
export const grid2d = {
  title: "2D array traversal orders",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Order</label><select><option>Row by row</option><option>Column by column</option><option>Spiral</option></select></div><div class="sub"></div>`);
    const sel = $(host, "select");
    const load = () => {
      const n = 4, ord = gridOrder(sel.value, n);
      const frames = ord.map((p, k) => ({ k, p, note: `Visit matrix[${p[0]}][${p[1]}]  (visit #${k + 1})` }));
      stepper($(host, ".sub"), frames, (f) => {
        const m = Array.from({ length: n }, () => Array(n).fill(""));
        ord.slice(0, f.k + 1).forEach(([r, c], i) => (m[r][c] = i + 1));
        return table(m, { cur: [f.p] });
      }, { speed: 450 });
    };
    sel.addEventListener("change", load);
    load();
  }
};

export const circular = {
  title: "Circular array and modulo wrap",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Start index <input type="range" min="0" max="5" value="3" id="st"></label><label><input type="checkbox" id="bug"> Use the buggy modulo (n-1)</label></div><div class="sub"></div>`);
    const arr = ["A", "B", "C", "D", "E", "F"];
    const load = () => {
      const start = Number($(host, "#st").value), bug = $(host, "#bug").checked, n = arr.length, mod = bug ? n - 1 : n;
      const frames = Array.from({ length: 8 }, (_, i) => {
        const idx = (start + i) % mod;
        return { i, idx, note: `step ${i}: (${start} + ${i}) % ${mod} = ${idx}${bug && i === 7 ? "   Index 5 (F) was never visited: wrong modulo base." : ""}` };
      });
      stepper($(host, ".sub"), frames, (f) => {
        const seen = {};
        frames.slice(0, f.i + 1).forEach((g) => (seen[g.idx] = "done"));
        seen[f.idx] = "on";
        return cells(arr, { hi: seen, ptr: { [f.idx]: "idx" } });
      }, { speed: 600 });
    };
    host.querySelectorAll("input").forEach((e) => e.addEventListener("input", load));
    load();
  }
};

export const twoPointer = {
  title: "Two pointers: pair with a target sum",
  mount(host) {
    const a = [1, 3, 4, 6, 8, 11], t = 10, f = [];
    let l = 0, r = a.length - 1;
    while (l < r) {
      const s = a[l] + a[r];
      if (s === t) { f.push({ l, r, state: "done", note: `${a[l]} + ${a[r]} = ${s}. Found the pair for target ${t}.` }); break; }
      if (s > t) { f.push({ l, r, state: "bad", note: `${a[l]} + ${a[r]} = ${s} is too big, move right pointer left.` }); r--; }
      else { f.push({ l, r, state: "cmp", note: `${a[l]} + ${a[r]} = ${s} is too small, move left pointer right.` }); l++; }
    }
    stepper(host, f, (x) => cells(a, { hi: { [x.l]: x.state, [x.r]: x.state }, ptr: { [x.l]: "L", [x.r]: x.l === x.r ? "L,R" : "R" } }));
  }
};

export const slidingWindow = {
  title: "Sliding window: maximum sum of size k",
  mount(host) {
    const a = [2, 1, 5, 1, 3, 2], k = 3, f = [];
    let sum = a.slice(0, k).reduce((x, y) => x + y, 0), best = sum;
    f.push({ s: 0, sum, best, note: `First window sum = ${sum}` });
    for (let i = k; i < a.length; i++) {
      sum += a[i] - a[i - k];
      best = Math.max(best, sum);
      f.push({ s: i - k + 1, sum, best, note: `Add ${a[i]}, drop ${a[i - k]}: sum = ${sum}, best = ${best}. Only O(1) work per slide.` });
    }
    stepper(host, f, (x) => {
      const hi = {};
      for (let j = x.s; j < x.s + k; j++) hi[j] = "on";
      return cells(a, { hi, ptr: { [x.s]: "start", [x.s + k - 1]: "end" } }) + vars({ window_sum: x.sum, best: x.best });
    });
  }
};

export const palindrome = {
  title: "Palindrome check with two pointers",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Word</label><select><option>racecar</option><option>level</option><option>abca</option><option>noon</option></select></div><div class="sub"></div>`);
    const sel = $(host, "select");
    const load = () => {
      const s = [...sel.value], f = [];
      let l = 0, r = s.length - 1, ok = true;
      while (l < r) {
        const eq = s[l] === s[r];
        f.push({ l, r, eq, note: `${s[l]} vs ${s[r]}: ${eq ? "match" : "mismatch, not a palindrome"}` });
        if (!eq) { ok = false; break; }
        l++; r--;
      }
      if (ok) f.push({ l: -1, r: -1, eq: true, note: "All pairs matched: palindrome." });
      stepper($(host, ".sub"), f, (x) => cells(s, { hi: x.l < 0 ? Object.fromEntries(s.map((_, i) => [i, "done"])) : { [x.l]: x.eq ? "done" : "bad", [x.r]: x.eq ? "done" : "bad" }, ptr: x.l < 0 ? {} : { [x.l]: "L", [x.r]: "R" } }));
    };
    sel.addEventListener("change", load);
    load();
  }
};

export const anagram = {
  title: "Anagram check with a frequency map",
  mount(host) {
    const a = [..."listen"], b = [..."silent"], cnt = {}, f = [];
    f.push({ ph: 0, i: -1, cnt: { ...cnt }, note: "Start with an empty frequency map." });
    a.forEach((c, i) => { cnt[c] = (cnt[c] || 0) + 1; f.push({ ph: 1, i, cnt: { ...cnt }, note: `Reading "listen": count ${c} up.` }); });
    b.forEach((c, i) => { cnt[c] = (cnt[c] || 0) - 1; f.push({ ph: 2, i, cnt: { ...cnt }, note: `Reading "silent": count ${c} down.` }); });
    f.push({ ph: 3, i: -1, cnt: { ...cnt }, note: "Every count is 0, so the words are anagrams. O(n) time, O(1) alphabet space." });
    stepper(host, f, (x) => (x.ph === 1 ? cells(a, { hi: { [x.i]: "on" }, idx: false }) : x.ph === 2 ? cells(b, { hi: { [x.i]: "cmp" }, idx: false }) : "") + vars(x.cnt));
  }
};

/* ---------------- linked list ---------------- */
function llDraw(vals, next, ptrs) {
  const ptrMap = {};
  Object.entries(ptrs).forEach(([name, i]) => { if (i !== null && i !== undefined) ptrMap[i] = (ptrMap[i] ? ptrMap[i] + "," : "") + name; });
  return `<div class="vcells">${vals.map((v, i) => `<div class="vcol"><div class="vptr">${esc(ptrMap[i] || "")}</div><div class="vcell ${ptrMap[i] ? "on" : ""}">${esc(v)}</div><div class="vidx">${next[i] === null ? "next: null" : "next: " + vals[next[i]]}</div></div>`).join("")}</div>`;
}
export const llReverse = {
  title: "Reverse a linked list (prev / cur / next)",
  mount(host) {
    const vals = [1, 2, 3, 4], next = [1, 2, 3, null], f = [];
    let prev = null, cur = 0;
    f.push({ next: [...next], prev, cur, nxt: null, note: "prev = null, cur = head." });
    while (cur !== null) {
      const nxt = next[cur];
      f.push({ next: [...next], prev, cur, nxt, note: `Save next: nxt = ${nxt === null ? "null" : vals[nxt]} (before we overwrite cur.next).` });
      next[cur] = prev;
      f.push({ next: [...next], prev, cur, nxt, note: `Flip the arrow: ${vals[cur]}.next now points to ${prev === null ? "null" : vals[prev]}.` });
      prev = cur; cur = nxt;
      f.push({ next: [...next], prev, cur, nxt: null, note: "Advance: prev = cur, cur = nxt." });
    }
    f.push({ next: [...next], prev, cur: null, nxt: null, note: `Done. New head is ${vals[prev]}. If you skip saving nxt first, the rest of the list is lost.` });
    stepper(host, f, (x) => llDraw(vals, x.next, { prev: x.prev, cur: x.cur, nxt: x.nxt }));
  }
};
export const llCycle = {
  title: "Cycle detection with fast and slow pointers",
  mount(host) {
    const vals = [1, 2, 3, 4, 5, 6], next = [1, 2, 3, 4, 5, 2], f = [];
    let s = 0, q = 0;
    f.push({ s, q, note: "Both pointers start at the head. List: 1→2→3→4→5→6→back to 3." });
    for (let step = 0; step < 12; step++) {
      s = next[s]; q = next[next[q]];
      const met = s === q;
      f.push({ s, q, note: met ? `slow and fast meet at ${vals[s]}: a cycle exists.` : `slow moves 1, fast moves 2.` });
      if (met) break;
    }
    stepper(host, f, (x) => llDraw(vals, next, { slow: x.s, fast: x.q }), { speed: 800 });
  }
};

/* ---------------- stack / queue ---------------- */
function linear(kind) {
  return {
    title: kind === "stack" ? "Stack (LIFO): push, pop, peek" : "Queue (FIFO): enqueue, dequeue",
    mount(host) {
      const cap = 6, data = [];
      let msg = "Try it. Capacity is 6.";
      renderHTML(host, `<div class="vrow"><input type="text" id="v" value="7" style="width:70px"><button class="btn" id="a">${kind === "stack" ? "Push" : "Enqueue"}</button><button class="btn secondary" id="b">${kind === "stack" ? "Pop" : "Dequeue"}</button>${kind === "stack" ? `<button class="btn secondary" id="c">Peek</button>` : ""}</div><div class="stage"></div><p class="vnote"></p>`);
      const paint = () => {
        const hi = {}, ptr = {};
        if (data.length) {
          if (kind === "stack") { ptr[data.length - 1] = "top"; hi[data.length - 1] = "on"; }
          else { ptr[0] = "front"; ptr[data.length - 1] = data.length === 1 ? "front,rear" : "rear"; hi[0] = "cmp"; hi[data.length - 1] = "on"; }
        }
        renderHTML($(host, ".stage"), data.length ? cells(data, { hi, ptr }) : `<div class="muted">empty</div>`);
        $(host, ".vnote").textContent = msg;
      };
      $(host, "#a").addEventListener("click", () => { if (data.length >= cap) msg = kind === "stack" ? "Stack overflow: no room." : "Queue full."; else { data.push($(host, "#v").value || "?"); msg = `${kind === "stack" ? "Pushed" : "Enqueued"} ${data[data.length - 1]}.`; } paint(); });
      $(host, "#b").addEventListener("click", () => { if (!data.length) msg = kind === "stack" ? "Stack underflow: nothing to pop." : "Queue empty."; else { const v = kind === "stack" ? data.pop() : data.shift(); msg = `${kind === "stack" ? "Popped" : "Dequeued"} ${v}.`; } paint(); });
      $(host, "#c")?.addEventListener("click", () => { msg = data.length ? `Top is ${data[data.length - 1]} (not removed).` : "Nothing to peek."; paint(); });
      paint();
    }
  };
}
export const stackDemo = linear("stack");
export const queueDemo = linear("queue");

export const nextGreater = {
  title: "Next greater element with a monotonic stack",
  mount(host) {
    const a = [4, 5, 2, 10, 8], res = Array(a.length).fill(-1), st = [], f = [];
    f.push({ i: -1, st: [], res: [...res], note: "Stack holds indices still waiting for a bigger value." });
    for (let i = 0; i < a.length; i++) {
      while (st.length && a[st[st.length - 1]] < a[i]) {
        const j = st.pop(); res[j] = a[i];
        f.push({ i, st: [...st], res: [...res], note: `${a[i]} is bigger than ${a[j]}: answer for index ${j} is ${a[i]}.` });
      }
      st.push(i);
      f.push({ i, st: [...st], res: [...res], note: `Push index ${i} (${a[i]}).` });
    }
    stepper(host, f, (x) => `<label>Array</label>${cells(a, { ptr: { [x.i]: "i" }, hi: { [x.i]: "cmp" } })}<label style="margin-top:8px">Stack (values)</label>${x.st.length ? cells(x.st.map((j) => a[j]), { idx: false, hi: { [x.st.length - 1]: "on" }, ptr: { [x.st.length - 1]: "top" } }) : `<div class="muted">empty</div>`}<label style="margin-top:8px">Result</label>${cells(x.res, {})}`);
  }
};

/* ---------------- trees ---------------- */
export const treeHeight = {
  title: "Height of a binary tree, bottom-up",
  mount(host) {
    const h = {}, seen = [], f = [{ seen: [], cur: null, note: "height(node) = 1 + max(height(left), height(right)); empty = 0." }];
    const walk = (n) => {
      const kids = TREE.kids[n];
      kids.forEach(walk);
      const hl = kids[0] === undefined ? 0 : h[kids[0]], hr = kids[1] === undefined ? 0 : h[kids[1]];
      h[n] = 1 + Math.max(hl, hr);
      seen.push(n);
      f.push({ seen: [...seen], cur: n, note: `height(${n}) = 1 + max(${hl}, ${hr}) = ${h[n]}` });
    };
    walk(8);
    stepper(host, f, (x) => drawAlgo({ kind: "tree", seen: x.seen, cur: x.cur }), { speed: 900 });
  }
};

function bstSvg(root, path = [], found = null) {
  const pos = new Map();
  let k = 0;
  const lay = (n, d) => { if (!n) return; lay(n.l, d + 1); pos.set(n, [30 + k * 38, 28 + d * 52]); k++; lay(n.r, d + 1); };
  lay(root, 0);
  const w = Math.max(300, k * 38 + 40), edges = [], nodes = [];
  const walk = (n) => {
    if (!n) return;
    const [x, y] = pos.get(n);
    [n.l, n.r].forEach((c) => { if (c) { const [cx, cy] = pos.get(c); edges.push(`<line class="edge" x1="${x}" y1="${y}" x2="${cx}" y2="${cy}"/>`); walk(c); } });
    const col = found === n.v ? "var(--accent-2)" : path.includes(n.v) ? "var(--warn)" : "var(--accent)";
    nodes.push(`<circle cx="${x}" cy="${y}" r="17" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff">${n.v}</text>`);
  };
  walk(root);
  const depth = Math.max(...[...pos.values()].map((p) => p[1]), 28);
  return `<svg class="svgviz" viewBox="0 0 ${w} ${depth + 30}">${edges.join("")}${nodes.join("")}</svg>`;
}
export const bstDemo = {
  title: "Binary search tree: insert and search",
  mount(host) {
    let root = null;
    const ins = (n, v, path) => { path.push(n ? n.v : v); if (!n) return { v, l: null, r: null }; if (v < n.v) n.l = ins(n.l, v, path); else if (v > n.v) n.r = ins(n.r, v, path); return n; };
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => (root = ins(root, v, [])));
    renderHTML(host, `<div class="vrow"><input type="text" id="v" value="45" style="width:70px"><button class="btn" id="i">Insert</button><button class="btn secondary" id="s">Search</button><button class="btn secondary" id="r">Reset</button></div><div class="stage"></div><p class="vnote"></p>`);
    const paint = (path = [], found = null, msg = "Insert or search a number. The highlighted path shows each comparison.") => {
      renderHTML($(host, ".stage"), bstSvg(root, path, found));
      $(host, ".vnote").textContent = msg;
    };
    $(host, "#i").addEventListener("click", () => {
      const v = Number($(host, "#v").value);
      if (Number.isNaN(v)) return;
      const path = [];
      root = ins(root, v, path);
      path.pop();
      paint(path, v, `Inserted ${v}. Compared with ${path.join(" → ") || "nothing"}: smaller goes left, bigger goes right. Average O(log n).`);
    });
    $(host, "#s").addEventListener("click", () => {
      const v = Number($(host, "#v").value), path = [];
      let n = root;
      while (n) { path.push(n.v); if (n.v === v) break; n = v < n.v ? n.l : n.r; }
      paint(path, n ? v : null, n ? `Found ${v} after ${path.length} comparison(s).` : `${v} not found. Path: ${path.join(" → ")}.`);
    });
    $(host, "#r").addEventListener("click", () => { root = null;[50, 30, 70, 20, 40, 60, 80].forEach((v) => (root = ins(root, v, []))); paint(); });
    paint();
  }
};

/* ---------------- graphs ---------------- */
function dirSvg(nodes, edges, st) {
  const e = edges.map(([a, b]) => {
    const [x1, y1] = nodes[a], [x2, y2] = nodes[b], dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    return `<line x1="${x1 + (dx / d) * 20}" y1="${y1 + (dy / d) * 20}" x2="${x2 - (dx / d) * 22}" y2="${y2 - (dy / d) * 22}" stroke="var(--text-mute)" stroke-width="1.6" marker-end="url(#ar)"/>`;
  }).join("");
  const n = Object.entries(nodes).map(([k, [x, y]]) => {
    const c = st.rec.includes(k) ? "var(--warn)" : st.visited.includes(k) ? "var(--accent-2)" : "var(--accent)";
    return `<circle cx="${x}" cy="${y}" r="20" fill="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff">${k}</text>`;
  }).join("");
  return `<svg class="svgviz" viewBox="0 0 340 200"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="var(--text-mute)"/></marker></defs>${e}${n}</svg><div class="vvars"><span class="vvar">recursion stack = <b>[${st.rec.join(", ")}]</b></span><span class="vvar">visited = <b>[${st.visited.join(", ")}]</b></span></div>`;
}
export const cycleDemo = {
  title: "Cycle detection in a directed graph (visited + recursion stack)",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Graph</label><select><option value="1">With a cycle (D→B)</option><option value="0">Without a cycle</option></select></div><div class="sub"></div>`);
    const sel = $(host, "select");
    const nodes = { A: [50, 50], B: [150, 35], C: [260, 70], D: [160, 150], E: [50, 150] };
    const load = () => {
      const edges = [["A", "B"], ["B", "C"], ["C", "D"], ["A", "E"]];
      if (sel.value === "1") edges.push(["D", "B"]);
      const adj = {};
      Object.keys(nodes).forEach((k) => (adj[k] = []));
      edges.forEach(([a, b]) => adj[a].push(b));
      const visited = [], rec = [], f = [];
      let found = false;
      const dfs = (u) => {
        visited.push(u); rec.push(u);
        f.push({ visited: [...visited], rec: [...rec], note: `Enter ${u}: mark visited and push on the recursion stack.` });
        for (const v of adj[u]) {
          if (found) return;
          if (!visited.includes(v)) dfs(v);
          else if (rec.includes(v)) { found = true; f.push({ visited: [...visited], rec: [...rec], note: `${u}→${v}: ${v} is still on the recursion stack. Back edge, so a CYCLE exists.` }); return; }
          else f.push({ visited: [...visited], rec: [...rec], note: `${u}→${v}: visited earlier but already finished, not a cycle.` });
        }
        if (found) return;
        rec.pop();
        f.push({ visited: [...visited], rec: [...rec], note: `Leave ${u}: pop it from the recursion stack (forgetting this makes every graph look cyclic).` });
      };
      dfs("A");
      if (!found) f.push({ visited: [...visited], rec: [], note: "DFS finished with no back edge: no cycle." });
      stepper($(host, ".sub"), f, (x) => dirSvg(nodes, edges, x), { speed: 900 });
    };
    sel.addEventListener("change", load);
    load();
  }
};

export const gridBfs = {
  title: "BFS shortest path in a maze",
  mount(host) {
    const R = 6, walls = new Set(["1,1", "1,2", "1,3", "3,1", "3,2", "3,4", "4,2"]);
    const dist = Array.from({ length: R }, () => Array(R).fill(null)), prev = {}, q = [[0, 0]], f = [];
    dist[0][0] = 0;
    const snap = (cur, note) => f.push({ d: dist.map((r) => [...r]), cur, path: [], note });
    snap([0, 0], "Start at S with distance 0.");
    while (q.length) {
      const [r, c] = q.shift();
      for (const [dr, dc] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= R || nc >= R || walls.has(`${nr},${nc}`) || dist[nr][nc] !== null) continue;
        dist[nr][nc] = dist[r][c] + 1; prev[`${nr},${nc}`] = [r, c]; q.push([nr, nc]);
      }
      snap([r, c], `Expand (${r},${c}): neighbours get distance ${dist[r][c] + 1}. Level by level means the first time we reach a cell is the shortest way.`);
    }
    const path = [];
    let p = [R - 1, R - 1];
    while (p) { path.push(p); p = prev[`${p[0]},${p[1]}`]; }
    f.push({ d: dist.map((r) => [...r]), cur: null, path, note: `Shortest path to E has ${dist[R - 1][R - 1]} steps (green cells).` });
    stepper(host, f, (x) => table(x.d.map((row, r) => row.map((v, c) => (walls.has(`${r},${c}`) ? "#" : r === R - 1 && c === R - 1 && v === null ? "E" : v === null ? "" : v))), { cur: x.cur ? [x.cur] : [], win: x.path }), { speed: 500 });
  }
};

/* ---------------- dynamic programming ---------------- */
export const fibCount = {
  title: "Why memoization matters: counting calls",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>fib(n), n = <b id="nv">8</b> <input type="range" min="1" max="30" value="8" id="n"></label></div><div class="stage"></div>`);
    const calls = (n) => (n <= 1 ? 1 : calls(n - 1) + calls(n - 2) + 1);
    const naiveMemo = [1, 1];
    for (let i = 2; i <= 30; i++) naiveMemo[i] = naiveMemo[i - 1] + naiveMemo[i - 2] + 1;
    const paint = () => {
      const n = Number($(host, "#n").value);
      $(host, "#nv").textContent = n;
      const naive = naiveMemo[n], memo = 2 * n - 1 > 0 ? 2 * n - 1 : 1, tab = n + 1;
      const mx = Math.log10(naive + 1);
      renderHTML($(host, ".stage"), bar("plain recursion", (Math.log10(naive + 1) / mx) * 100, naive.toLocaleString(), "var(--danger)") + bar("memoization", (Math.log10(memo + 1) / mx) * 100, memo, "var(--accent-2)") + bar("tabulation", (Math.log10(tab + 1) / mx) * 100, tab, "var(--accent)") + `<p class="muted" style="font-size:12px">Bars use a log scale. Plain recursion is exponential, memoization and tabulation are linear.</p>`);
    };
    $(host, "#n").addEventListener("input", paint);
    paint();
  }
};
export const fibTable = {
  title: "Tabulation: filling dp[] bottom-up",
  mount(host) {
    const n = 9, dp = Array(n + 1).fill("?"), f = [];
    dp[0] = 0; dp[1] = 1;
    f.push({ dp: [...dp], i: 1, note: "Base cases: dp[0] = 0, dp[1] = 1." });
    for (let i = 2; i <= n; i++) { dp[i] = dp[i - 1] + dp[i - 2]; f.push({ dp: [...dp], i, note: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}` }); }
    stepper(host, f, (x) => cells(x.dp, { hi: { [x.i]: "cmp", [x.i - 1]: x.i > 1 ? "on" : "", [x.i - 2]: x.i > 1 ? "on" : "" }, ptr: { [x.i]: "now" } }));
  }
};

export const lcsDemo = {
  title: "Longest Common Subsequence, table fill",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Strings</label><select><option>abcde|ace</option><option>ABCD|ACBD</option><option>AGGTAB|GXTXAYB</option></select></div><div class="sub"></div>`);
    const sel = $(host, "select");
    const load = () => {
      const [A, B] = sel.value.split("|"), n = A.length, m = B.length;
      const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0)), f = [];
      const snap = (i, j, dep, note) => f.push({ dp: dp.map((r) => [...r]), i, j, dep, note });
      snap(0, 0, [], "First row and column are 0: an empty string has no common subsequence.");
      for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
        if (A[i - 1] === B[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; snap(i, j, [[i - 1, j - 1]], `${A[i - 1]} = ${B[j - 1]}: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`); }
        else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); snap(i, j, [[i - 1, j], [i, j - 1]], `${A[i - 1]} ≠ ${B[j - 1]}: dp[${i}][${j}] = max(up ${dp[i - 1][j]}, left ${dp[i][j - 1]}) = ${dp[i][j]}`); }
      }
      f.push({ dp: dp.map((r) => [...r]), i: n, j: m, dep: [], note: `LCS length = ${dp[n][m]}` });
      stepper($(host, ".sub"), f, (x) => table(x.dp.map((r, i) => [i === 0 ? "" : A[i - 1], ...r]), { head: ["", "", ...B], cur: [[x.i, x.j + 1]], dep: x.dep.map(([a, b]) => [a, b + 1]) }), { speed: 450 });
    };
    sel.addEventListener("change", load);
    load();
  }
};

export const knapsackDemo = {
  title: "0/1 Knapsack, table fill",
  mount(host) {
    const w = [1, 3, 4, 5], v = [1, 4, 5, 7], cap = 7, n = w.length;
    const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0)), f = [];
    const snap = (i, c, dep, note) => f.push({ dp: dp.map((r) => [...r]), i, c, dep, note });
    snap(0, 0, [], `Items (weight, value): ${w.map((x, i) => `(${x},${v[i]})`).join(" ")}. Capacity ${cap}. Row i = using the first i items.`);
    for (let i = 1; i <= n; i++) for (let c = 0; c <= cap; c++) {
      dp[i][c] = dp[i - 1][c];
      let note = `item ${i} (w=${w[i - 1]}): skip, dp = ${dp[i][c]}`, dep = [[i - 1, c]];
      if (w[i - 1] <= c) {
        const take = dp[i - 1][c - w[i - 1]] + v[i - 1];
        if (take > dp[i][c]) { dp[i][c] = take; dep = [[i - 1, c - w[i - 1]]]; note = `item ${i}: take it, ${dp[i - 1][c - w[i - 1]]} + ${v[i - 1]} = ${take} beats skipping`; }
        else note = `item ${i}: take = ${take}, skip = ${dp[i - 1][c]}, keep the better`;
      }
      snap(i, c, dep, `capacity ${c}: ${note}`);
    }
    snap(n, cap, [], `Best value = ${dp[n][cap]}`);
    stepper(host, f, (x) => table(x.dp.map((r, i) => [i, ...r]), { head: ["item", ...Array.from({ length: cap + 1 }, (_, c) => c)], cur: [[x.i, x.c + 1]], dep: x.dep.map(([a, b]) => [a, b + 1]) }), { speed: 350 });
  }
};

/* ---------------- heap / greedy / big-o ---------------- */
export const heapDemo = {
  title: "Min-heap: insert and extract",
  mount(host) {
    const h = [3, 9, 5, 12, 10, 8];
    renderHTML(host, `<div class="vrow"><input type="text" id="v" value="2" style="width:70px"><button class="btn" id="i">Insert</button><button class="btn secondary" id="e">Extract min</button></div><div class="stage"></div><p class="vnote"></p>`);
    const svg = () => {
      const pts = h.map((_, i) => { const d = Math.floor(Math.log2(i + 1)), idx = i + 1 - 2 ** d, per = 2 ** d; return [(330 * (idx + 0.5)) / per + 10, 26 + d * 50]; });
      const e = h.map((_, i) => (i ? `<line class="edge" x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[(i - 1) >> 1][0]}" y2="${pts[(i - 1) >> 1][1]}"/>` : "")).join("");
      const n = h.map((v, i) => `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="16" fill="${i === 0 ? "var(--accent-2)" : "var(--accent)"}"/><text x="${pts[i][0]}" y="${pts[i][1] + 4}" text-anchor="middle" fill="#fff">${v}</text>`).join("");
      return `<svg class="svgviz" viewBox="0 0 350 ${26 + Math.max(1, Math.floor(Math.log2(h.length || 1)) + 1) * 50}">${e}${n}</svg>`;
    };
    const paint = (msg) => { renderHTML($(host, ".stage"), svg() + cells(h, { ptr: { 0: "min" } })); $(host, ".vnote").textContent = msg || "Parent is always ≤ its children, so the smallest value sits at index 0."; };
    $(host, "#i").addEventListener("click", () => {
      const v = Number($(host, "#v").value); if (Number.isNaN(v)) return;
      h.push(v); let i = h.length - 1, s = 0;
      while (i > 0 && h[(i - 1) >> 1] > h[i]) { [h[(i - 1) >> 1], h[i]] = [h[i], h[(i - 1) >> 1]]; i = (i - 1) >> 1; s++; }
      paint(`Inserted ${v} at the end, then bubbled up ${s} time(s). O(log n).`);
    });
    $(host, "#e").addEventListener("click", () => {
      if (!h.length) return paint("Heap is empty.");
      const top = h[0], last = h.pop();
      if (h.length) { h[0] = last; let i = 0, s = 0; for (;;) { let m = i; const l = 2 * i + 1, r = l + 1; if (l < h.length && h[l] < h[m]) m = l; if (r < h.length && h[r] < h[m]) m = r; if (m === i) break; [h[i], h[m]] = [h[m], h[i]]; i = m; s++; } paint(`Removed min ${top}, moved last item to the root and sifted down ${s} time(s). O(log n).`); } else paint(`Removed ${top}. Heap is now empty.`);
    });
    paint();
  }
};

export const greedyIntervals = {
  title: "Greedy: pick the most non-overlapping intervals",
  mount(host) {
    const iv = [[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]].sort((a, b) => a[1] - b[1]);
    const f = []; const status = iv.map(() => "");
    let last = -1;
    f.push({ st: [...status], cur: -1, note: "Sort by end time. Greedy rule: always take the interval that finishes first and fits." });
    iv.forEach(([s, e], i) => {
      if (s >= last) { status[i] = "pick"; last = e; f.push({ st: [...status], cur: i, note: `[${s},${e}] starts at or after ${last === e ? "the last end" : last}: PICK. Last end is now ${e}.` }); }
      else { status[i] = "skip"; f.push({ st: [...status], cur: i, note: `[${s},${e}] overlaps (starts before ${last}): skip.` }); }
    });
    f.push({ st: [...status], cur: -1, note: `Picked ${status.filter((x) => x === "pick").length} intervals. Taking the earliest finish leaves the most room.` });
    stepper(host, f, (x) => iv.map(([s, e], i) => `<div style="display:flex;align-items:center;margin:3px 0"><span class="vidx" style="width:56px">[${s},${e}]</span><div style="flex:1;position:relative;height:14px;background:var(--border)"><div style="position:absolute;left:${(s / 16) * 100}%;width:${((e - s) / 16) * 100}%;height:100%;background:${x.st[i] === "pick" ? "var(--accent-2)" : x.st[i] === "skip" ? "var(--danger)" : "var(--text-mute)"};outline:${x.cur === i ? "2px solid var(--warn)" : "none"}"></div></div></div>`).join(""), { speed: 800 });
  }
};

export const bigO = {
  title: "How operation counts grow with n",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>n = <b id="nv">10</b> <input type="range" min="1" max="30" value="10" id="n" style="width:260px"></label></div><div class="stage"></div>`);
    const paint = () => {
      const n = Number($(host, "#n").value);
      $(host, "#nv").textContent = n;
      const rows = [["O(1)", 1, "var(--accent-2)"], ["O(log n)", Math.log2(n), "var(--accent)"], ["O(n)", n, "var(--accent)"], ["O(n log n)", n * Math.log2(Math.max(n, 1)), "var(--warn)"], ["O(n²)", n * n, "var(--danger)"], ["O(2ⁿ)", 2 ** n, "var(--danger)"]];
      const mx = Math.log10(2 ** 30 + 1);
      renderHTML($(host, ".stage"), rows.map(([l, v, c]) => bar(l, (Math.log10(v + 1) / mx) * 100, Math.round(v).toLocaleString(), c)).join("") + `<p class="muted" style="font-size:12px">Log-scaled bars. At n = 30, O(n²) is 900 operations but O(2ⁿ) is over a billion.</p>`);
    };
    $(host, "#n").addEventListener("input", paint);
    paint();
  }
};
