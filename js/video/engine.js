// Canvas animation engine for Video Explainer scripts (see script.js).
// Draws 1280x720 frames, narrates with the browser's speech synthesis, shows captions,
// and can record the canvas to a WebM file.
import { estimateDuration, sentences } from "./script.js";

export const W = 1280;
export const H = 720;

export const THEMES = {
  Paper: { bg: "#f2eee4", ink: "#1f1c16", dim: "#6a604d", accent: "#b24a2c", accent2: "#3d6a4e", panel: "#faf7ef", border: "#d6cdb8", capBg: "rgba(31,28,22,0.82)", capInk: "#faf7ef", codeBg: "#1d1a14", codeInk: "#e8e0c9" },
  Midnight: { bg: "#12141c", ink: "#eceff7", dim: "#9aa3b8", accent: "#ff8a5c", accent2: "#6ee7b7", panel: "#1b1f2b", border: "#2c3242", capBg: "rgba(0,0,0,0.7)", capInk: "#ffffff", codeBg: "#0a0c12", codeInk: "#dfe6f5" }
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const SERIF = "'Newsreader', Georgia, serif";
const SANS = "'IBM Plex Sans', 'Segoe UI', sans-serif";
const MONO = "'IBM Plex Mono', Consolas, monospace";

function wrap(ctx, text, maxW) {
  const out = [];
  let cur = "";
  for (const w of String(text).split(/\s+/).filter(Boolean)) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}
function lines(ctx, arr, x, y, lh) { arr.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return arr.length * lh; }
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function heading(ctx, th, text, p) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = ease(p * 4);
  ctx.fillStyle = th.ink;
  ctx.font = `500 54px ${SERIF}`;
  ctx.textBaseline = "alphabetic";
  lines(ctx, wrap(ctx, text, 1120).slice(0, 2), 80, 110 + (1 - ease(p * 4)) * 20, 60);
  ctx.fillStyle = th.accent;
  ctx.fillRect(80, 132, 90 * ease(p * 3), 4);
  ctx.restore();
}

/* ---------------- scene painters ---------------- */

const painters = {
  title(ctx, s, p, th) {
    ctx.fillStyle = th.accent;
    ctx.font = `500 22px ${MONO}`;
    ctx.globalAlpha = ease(p * 3);
    ctx.fillText("PLACEMENT PREP HUB  ·  VIDEO EXPLAINER", 80, 120);
    ctx.fillRect(80, 150, 160 * ease(p * 2), 5);
    ctx.globalAlpha = ease(p * 2.5);
    ctx.fillStyle = th.ink;
    ctx.font = `500 84px ${SERIF}`;
    lines(ctx, wrap(ctx, s.title, 1100).slice(0, 3), 80, 290 + (1 - ease(p * 2.5)) * 30, 92);
    ctx.globalAlpha = ease((p - 0.3) * 3);
    ctx.fillStyle = th.dim;
    ctx.font = `400 34px ${SANS}`;
    lines(ctx, wrap(ctx, s.subtitle || "", 1000).slice(0, 2), 80, 520, 44);
    ctx.globalAlpha = 1;
  },

  bullets(ctx, s, p, th) {
    heading(ctx, th, s.heading, p);
    const n = Math.max(1, s.bullets.length);
    ctx.font = `400 36px ${SANS}`;
    let y = 215;
    s.bullets.forEach((b, i) => {
      const start = 0.12 + (i / (n + 0.4)) * 0.8;
      const a = ease((p - start) * 6);
      if (a <= 0) return;
      const ls = wrap(ctx, b, 1020).slice(0, 2);
      const h = ls.length * 46;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate((1 - a) * 40, 0);
      const current = p - start < 0.22 && i === s.bullets.findLastIndex((_, k) => p >= 0.12 + (k / (n + 0.4)) * 0.8);
      if (current) { ctx.fillStyle = th.panel; rrect(ctx, 70, y - 38, 1140, h + 18, 14); ctx.fill(); ctx.strokeStyle = th.accent; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.fillStyle = th.accent;
      ctx.beginPath(); ctx.arc(100, y - 12, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = th.ink;
      ctx.font = `400 36px ${SANS}`;
      lines(ctx, ls, 135, y, 46);
      ctx.restore();
      y += h + 30;
    });
  },

  flow(ctx, s, p, th) {
    heading(ctx, th, s.heading, p);
    const n = Math.max(1, s.steps.length);
    const cols = n <= 3 ? n : 3;
    const rows = Math.ceil(n / cols);
    const gap = 70, bw = (1120 - (cols - 1) * gap) / cols, bh = rows > 1 ? 150 : 190;
    const y0 = rows > 1 ? 190 : 250;
    const active = Math.min(n - 1, Math.floor(p * n * 0.98));
    s.steps.forEach((st, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const x = 80 + c * (bw + gap), y = y0 + r * (bh + 60);
      const a = ease((p - (i / n) * 0.85) * 7);
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      const on = i === active;
      ctx.fillStyle = on ? th.accent : th.panel;
      rrect(ctx, x, y + (1 - a) * 20, bw, bh, 18);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = on ? th.accent : i < active ? th.accent2 : th.border;
      ctx.stroke();
      ctx.fillStyle = on ? "#fff" : th.accent;
      ctx.font = `600 26px ${MONO}`;
      ctx.fillText(String(i + 1).padStart(2, "0"), x + 22, y + 44 + (1 - a) * 20);
      ctx.fillStyle = on ? "#fff" : th.ink;
      ctx.font = `500 28px ${SANS}`;
      lines(ctx, wrap(ctx, st, bw - 44).slice(0, 3), x + 22, y + 88 + (1 - a) * 20, 36);
      if (c < cols - 1 && i + 1 < n && ease((p - ((i + 1) / n) * 0.85) * 7) > 0) {
        ctx.strokeStyle = th.dim; ctx.fillStyle = th.dim; ctx.lineWidth = 3;
        const ax = x + bw + 8, ay = y + bh / 2;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + gap - 24, ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax + gap - 14, ay); ctx.lineTo(ax + gap - 28, ay - 9); ctx.lineTo(ax + gap - 28, ay + 9); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    });
  },

  array(ctx, s, p, th) {
    heading(ctx, th, s.heading, p);
    const n = s.items.length;
    const cw = Math.min(110, Math.floor(1100 / n)), total = cw * n, x0 = (W - total) / 2, y = 320, ch = 92;
    const steps = s.steps.length ? s.steps : [{ hi: [], ptr: {}, label: "" }];
    const si = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.98));
    const st = steps[si];
    s.items.forEach((it, i) => {
      const a = ease((p * 6 - i * 0.25));
      if (a <= 0) return;
      const hot = st.hi.includes(i);
      ctx.save();
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = hot ? th.accent : th.panel;
      rrect(ctx, x0 + i * cw + 4, y, cw - 8, ch, 12);
      ctx.fill();
      ctx.lineWidth = hot ? 3 : 2;
      ctx.strokeStyle = hot ? th.accent : th.border;
      ctx.stroke();
      ctx.fillStyle = hot ? "#fff" : th.ink;
      ctx.font = `600 ${cw > 70 ? 36 : 26}px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(String(it).slice(0, 6), x0 + i * cw + cw / 2, y + ch / 2 + 12);
      ctx.fillStyle = th.dim;
      ctx.font = `400 20px ${MONO}`;
      ctx.fillText(String(i), x0 + i * cw + cw / 2, y + ch + 30);
      const pt = st.ptr[i];
      if (pt) {
        ctx.fillStyle = th.accent2;
        ctx.font = `600 26px ${MONO}`;
        ctx.fillText(pt, x0 + i * cw + cw / 2, y - 62);
        ctx.beginPath();
        ctx.moveTo(x0 + i * cw + cw / 2, y - 12); ctx.lineTo(x0 + i * cw + cw / 2 - 12, y - 36); ctx.lineTo(x0 + i * cw + cw / 2 + 12, y - 36);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    });
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = th.ink;
    ctx.font = `500 34px ${SANS}`;
    ctx.globalAlpha = ease(p * 5);
    lines(ctx, wrap(ctx, st.label || "", 1040).slice(0, 2), W / 2, 490, 44);
    ctx.restore();
  },

  code(ctx, s, p, th) {
    heading(ctx, th, s.heading, p);
    const n = s.lines.length;
    const lh = Math.min(34, Math.floor(340 / n)), fs = Math.max(18, lh - 8);
    const px = 80, py = 170, pw = 1120, ph = n * lh + 40;
    ctx.fillStyle = th.codeBg;
    rrect(ctx, px, py, pw, ph, 16);
    ctx.fill();
    const reveal = Math.ceil(n * clamp01(p / 0.55));
    const steps = s.steps || [];
    const si = steps.length ? Math.min(steps.length - 1, Math.floor(clamp01((p - 0.55) / 0.45) * steps.length)) : -1;
    const hot = si >= 0 && p > 0.55 ? steps[si].lines : [];
    ctx.font = `500 ${fs}px ${MONO}`;
    ctx.textBaseline = "alphabetic";
    s.lines.forEach((l, i) => {
      if (i >= reveal) return;
      const y = py + 28 + (i + 1) * lh - 8;
      if (hot.includes(i)) { ctx.fillStyle = "rgba(255,138,92,0.28)"; ctx.fillRect(px + 8, y - lh + 10, pw - 16, lh); }
      ctx.fillStyle = "rgba(223,230,245,0.35)";
      ctx.fillText(String(i + 1).padStart(2, " "), px + 20, y);
      ctx.fillStyle = th.codeInk;
      ctx.fillText(l, px + 70, y);
    });
    if (si >= 0 && p > 0.55 && steps[si].label) {
      ctx.fillStyle = th.ink;
      ctx.font = `500 32px ${SANS}`;
      lines(ctx, wrap(ctx, steps[si].label, 1100).slice(0, 2), 80, py + ph + 56, 42);
    }
  },

  compare(ctx, s, p, th) {
    heading(ctx, th, s.heading, p);
    [["left", 80, -1], ["right", 660, 1]].forEach(([k, x, dir], idx) => {
      const side = s[k];
      const a = ease(p * 3 - idx * 0.3);
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(dir * (1 - a) * 160, 0);
      ctx.fillStyle = th.panel;
      rrect(ctx, x, 190, 540, 340, 20);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = idx === 0 ? th.accent : th.accent2;
      ctx.stroke();
      ctx.fillStyle = idx === 0 ? th.accent : th.accent2;
      ctx.font = `600 34px ${SERIF}`;
      ctx.fillText(side.title, x + 30, 245);
      ctx.fillStyle = th.ink;
      ctx.font = `400 27px ${SANS}`;
      let y = 300;
      side.points.forEach((pt, i) => {
        if (p < 0.25 + i * 0.12) return;
        const ls = wrap(ctx, "•  " + pt, 480).slice(0, 3);
        y += lines(ctx, ls, x + 30, y, 36) + 14;
      });
      ctx.restore();
    });
  },

  callout(ctx, s, p, th) {
    ctx.fillStyle = th.accent;
    ctx.font = `600 220px ${SERIF}`;
    ctx.globalAlpha = 0.18 * ease(p * 3);
    ctx.fillText("“", 60, 300);
    ctx.globalAlpha = ease(p * 2.5);
    ctx.fillStyle = th.ink;
    ctx.font = `italic 500 62px ${SERIF}`;
    const ls = wrap(ctx, s.text, 1040).slice(0, 4);
    lines(ctx, ls, 120, 300 - (ls.length - 1) * 30 + (1 - ease(p * 2.5)) * 24, 76);
    ctx.fillStyle = th.accent;
    ctx.fillRect(120, 470, 140 * ease((p - 0.2) * 3), 5);
    ctx.globalAlpha = 1;
  }
};

/* ---------------- player ---------------- */

export class Player {
  constructor(canvas, hooks = {}) {
    this.canvas = canvas;
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d");
    this.hooks = hooks;
    this.script = null;
    this.theme = THEMES.Paper;
    this.idx = 0;
    this.t = 0;
    this.playing = false;
    this.rate = 1;
    this.speechOn = true;
    this.captions = true;
    this.voice = null;
    this.speaking = false;
    this.capIdx = 0;
    this.token = 0;
    this.dur = [];
    this.last = performance.now();
    this.recorder = null;
    this._tick = this._tick.bind(this);
    this.raf = requestAnimationFrame(this._tick);
  }

  load(script) {
    this.stopSpeech();
    this.script = script;
    this.idx = 0;
    this.t = 0;
    this.capIdx = 0;
    this.playing = false;
    this._durations();
    this._emit();
  }

  _durations() { this.dur = (this.script?.scenes || []).map((sc) => estimateDuration(sc) / this.rate); }
  setRate(r) { this.rate = r; this._durations(); }
  setTheme(name) { this.theme = THEMES[name] || THEMES.Paper; }
  get total() { return this.dur.reduce((a, b) => a + b, 0); }
  get elapsed() { return this.dur.slice(0, this.idx).reduce((a, b) => a + b, 0) + this.t; }

  play() {
    if (!this.script) return;
    if (this.idx >= this.dur.length - 1 && this.t >= this.dur[this.idx]) { this.idx = 0; this.t = 0; this.capIdx = 0; }
    this.playing = true;
    this.startSpeech(this.capIdx);
    this._emit();
  }
  pause() { this.playing = false; this.stopSpeech(); this._emit(); }
  toggle() { this.playing ? this.pause() : this.play(); }
  goto(i) {
    if (!this.script) return;
    this.idx = Math.max(0, Math.min(this.dur.length - 1, i));
    this.t = 0;
    this.capIdx = 0;
    this.stopSpeech();
    if (this.playing) this.startSpeech(0);
    this._emit();
  }
  next() { this.goto(this.idx + 1); }
  prev() { this.goto(this.t > 1.5 ? this.idx : this.idx - 1); }
  setSpeech(on) { this.speechOn = on; if (!on) this.stopSpeech(); else if (this.playing) this.startSpeech(this.capIdx); }

  stopSpeech() {
    this.token++;
    this.speaking = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  startSpeech(from = 0) {
    this.stopSpeech();
    if (!this.speechOn || !this.playing || !this.script || !("speechSynthesis" in window)) return;
    const sents = sentences(this.script.scenes[this.idx].narration);
    if (!sents.length) return;
    const token = this.token;
    this.speaking = true;
    const speakNext = (i) => {
      if (token !== this.token) return;
      if (i >= sents.length) { this.speaking = false; return; }
      const u = new SpeechSynthesisUtterance(sents[i]);
      u.rate = Math.max(0.5, Math.min(2, this.rate));
      if (this.voice) u.voice = this.voice;
      u.onstart = () => { if (token === this.token) this.capIdx = i; };
      u.onend = () => speakNext(i + 1);
      u.onerror = () => { if (token === this.token) this.speaking = false; };
      window.speechSynthesis.speak(u);
    };
    setTimeout(() => speakNext(Math.min(from, sents.length - 1)), 60);
  }

  _tick(now) {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (this.playing && this.script) {
      this.t += dt;
      const dur = this.dur[this.idx];
      if (this.t >= dur && (!this.speaking || this.t >= dur + 4)) {
        if (this.idx < this.dur.length - 1) {
          this.idx++;
          this.t = 0;
          this.capIdx = 0;
          this.startSpeech(0);
        } else {
          this.t = dur;
          this.playing = false;
          this.stopSpeech();
          this.hooks.onEnd?.();
        }
      }
      this._emit();
    }
    this.draw();
    this.raf = requestAnimationFrame(this._tick);
  }

  _emit() { this.hooks.onUpdate?.(this); }

  caption() {
    const sc = this.script?.scenes[this.idx];
    if (!sc) return "";
    const sents = sentences(sc.narration);
    if (!sents.length) return "";
    if (this.speechOn && this.speaking) return sents[Math.min(this.capIdx, sents.length - 1)];
    const frac = clamp01(this.t / Math.max(0.1, this.dur[this.idx]));
    return sents[Math.min(sents.length - 1, Math.floor(frac * sents.length))];
  }

  draw() {
    const ctx = this.ctx, th = this.theme;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = th.accent;
    ctx.globalAlpha = 0.07;
    ctx.beginPath(); ctx.arc(W - 40, 40, 260, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    if (!this.script) {
      ctx.fillStyle = th.dim;
      ctx.font = `400 34px ${SANS}`;
      ctx.textAlign = "center";
      ctx.fillText("Your video will appear here", W / 2, H / 2);
      ctx.textAlign = "left";
      return;
    }
    const sc = this.script.scenes[this.idx];
    const p = clamp01(this.t / (this.dur[this.idx] * 0.92));
    ctx.save();
    ctx.textAlign = "left";
    painters[sc.type](ctx, sc, p, th);
    ctx.restore();

    if (this.captions) {
      const cap = this.caption();
      if (cap) {
        ctx.save();
        ctx.font = `500 28px ${SANS}`;
        const ls = wrap(ctx, cap, 1080).slice(0, 3);
        const bh = ls.length * 38 + 28;
        ctx.fillStyle = th.capBg;
        rrect(ctx, 80, H - 40 - bh, 1120, bh, 14);
        ctx.fill();
        ctx.fillStyle = th.capInk;
        ctx.textAlign = "center";
        lines(ctx, ls, W / 2, H - 40 - bh + 38, 38);
        ctx.restore();
      }
    }
    ctx.fillStyle = th.accent;
    ctx.fillRect(0, H - 8, W * clamp01(this.elapsed / Math.max(1, this.total)), 8);
  }

  // Records the canvas (silent, with captions) to a WebM file in real time.
  record(onDone) {
    if (!this.script || this.recorder) return false;
    const stream = this.canvas.captureStream(30);
    const type = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
    if (!type) return false;
    const chunks = [];
    const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4_000_000 });
    const wasSpeech = this.speechOn;
    const wasCaps = this.captions;
    this.speechOn = false;
    this.captions = true;
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const prevEnd = this.hooks.onEnd;
    rec.onstop = () => {
      this.hooks.onEnd = prevEnd;
      this.recorder = null;
      this.speechOn = wasSpeech;
      this.captions = wasCaps;
      onDone(new Blob(chunks, { type }));
    };
    this.recorder = rec;
    this.idx = 0; this.t = 0; this.capIdx = 0; this.playing = false;
    rec.start(500);
    this.hooks.onEnd = () => { setTimeout(() => rec.state !== "inactive" && rec.stop(), 600); };
    this.play();
    return true;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.stopSpeech();
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
  }
}
