import { renderHTML, escapeHtml } from "../dom.js";
export const esc = escapeHtml;
export { renderHTML };

// Generic frame player: frames[] + draw(frame, index) -> html string.
export function stepper(host, frames, draw, { speed = 700 } = {}) {
  renderHTML(host, `<div class="vctl"><button class="btn secondary v-prev">Prev</button><button class="btn v-play">Play</button><button class="btn secondary v-next">Step</button><button class="btn secondary v-reset">Reset</button><span class="muted v-count" style="font-family:var(--mono);font-size:12px"></span></div><div class="vstage"></div><p class="vnote"></p>`);
  const stage = host.querySelector(".vstage"), note = host.querySelector(".vnote"), count = host.querySelector(".v-count"), play = host.querySelector(".v-play");
  let i = 0, timer = null;
  const show = () => {
    renderHTML(stage, draw(frames[i], i));
    note.textContent = frames[i].note || "";
    count.textContent = `${i + 1} / ${frames.length}`;
  };
  const stop = () => { clearInterval(timer); timer = null; play.textContent = "Play"; };
  host.querySelector(".v-prev").addEventListener("click", () => { stop(); if (i > 0) { i--; show(); } });
  host.querySelector(".v-next").addEventListener("click", () => { stop(); if (i < frames.length - 1) { i++; show(); } });
  host.querySelector(".v-reset").addEventListener("click", () => { stop(); i = 0; show(); });
  play.addEventListener("click", () => {
    if (timer) return stop();
    if (i >= frames.length - 1) i = 0;
    show();
    timer = setInterval(() => {
      if (!host.isConnected) return stop();
      if (i < frames.length - 1) { i++; show(); } else stop();
    }, speed);
    play.textContent = "Pause";
  });
  show();
}

// Row of boxed values. hi: {index: cls}, ptr: {index: label}, idx: show indices
export function cells(arr, { hi = {}, ptr = {}, idx = true, neg = false } = {}) {
  return `<div class="vcells">${arr.map((v, i) => `<div class="vcol"><div class="vptr">${esc(ptr[i] ?? "")}</div><div class="vcell ${hi[i] || ""}">${esc(v)}</div>${idx ? `<div class="vidx">${i}${neg ? ` / ${i - arr.length}` : ""}</div>` : ""}</div>`).join("")}</div>`;
}

export function code(lines, active = []) {
  return `<pre class="vcode">${lines.map((l, i) => `<div class="${active.includes(i) ? "hl" : ""}">${esc(l) || " "}</div>`).join("")}</pre>`;
}

export function vars(obj) {
  return `<div class="vvars">${Object.entries(obj).map(([k, v]) => `<span class="vvar">${esc(k)} = <b>${esc(v)}</b></span>`).join("")}</div>`;
}

// Program-trace player: steps = [{line, vars, out, note, extra}]
export function trace(host, lines, steps, opts) {
  stepper(host, steps, (f) => code(lines, [f.line]) + vars(f.vars || {}) + (f.extra || "") + (f.out ? `<div class="vout">${esc(f.out)}</div>` : ""), opts);
}

export function bar(label, pct, val, color) {
  return `<div class="vbar"><span class="lbl">${esc(label)}</span><span class="trk"><div class="fil" style="width:${Math.max(0, Math.min(100, pct))}%;${color ? `background:${color}` : ""}"></div></span><span class="val">${esc(val)}</span></div>`;
}

export function table(rows, { cur = [], dep = [], win = [], head = null } = {}) {
  const key = (r, c) => `${r},${c}`;
  const cs = new Set(cur.map((p) => key(...p))), ds = new Set(dep.map((p) => key(...p))), ws = new Set(win.map((p) => key(...p)));
  return `<table class="vtable">${head ? `<tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>` : ""}${rows.map((row, r) => `<tr>${row.map((v, c) => `<td class="${cs.has(key(r, c)) ? "cur" : ds.has(key(r, c)) ? "dep" : ws.has(key(r, c)) ? "win" : ""}">${esc(v ?? "")}</td>`).join("")}</tr>`).join("")}</table>`;
}

export function flow(steps, activeIdx) {
  return `<div class="vflow">${steps.map((s, i) => `<div class="vstep ${i === activeIdx ? "on" : i < activeIdx ? "done" : ""}">${esc(s)}</div>`).join("")}</div>`;
}

// Mini DOM helper for interactive widgets
export function ui(host, html) { renderHTML(host, html); return host; }
