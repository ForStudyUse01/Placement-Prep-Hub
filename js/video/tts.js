// Text-to-speech engines for the Video Explainer.
//  browser: the built-in voices (instant, quality depends on your OS/browser)
//  kokoro : neural voice (Kokoro-82M, Apache-2.0) that runs fully in your browser. ~90 MB model, downloaded once and cached.
//  gemini : Gemini speech model, uses your own Gemini key
// Engines kokoro and gemini return { samples: Float32Array, rate } per text so the player can
// play them with exact timing and mix them into recordings.
import { getKey } from "../ai.js";
import { sentences } from "./script.js";

export const ENGINES = [
  ["browser", "Browser voice (instant)"],
  ["kokoro", "Neural voice (in browser, ~90 MB once)"],
  ["gemini", "Gemini voice (uses your Gemini key)"]
];

export const KOKORO_VOICES = [
  ["af_heart", "Heart (US, female)"], ["af_bella", "Bella (US, female)"], ["af_nicole", "Nicole (US, female)"],
  ["am_michael", "Michael (US, male)"], ["am_fenrir", "Fenrir (US, male)"], ["bf_emma", "Emma (UK, female)"], ["bm_george", "George (UK, male)"]
];

export const GEMINI_VOICES = [["Kore", "Kore (firm)"], ["Puck", "Puck (upbeat)"], ["Charon", "Charon (informative)"], ["Zephyr", "Zephyr (bright)"], ["Aoede", "Aoede (breezy)"], ["Fenrir", "Fenrir (excitable)"], ["Leda", "Leda (youthful)"]];

// Rank the built-in voices so the most natural one is the default.
export function rankBrowserVoices(voices) {
  const score = (v) => {
    let s = 0;
    if (/natural|neural|online/i.test(v.name)) s += 100;
    if (/google/i.test(v.name)) s += 40;
    if (/aria|jenny|guy|ryan|sonia|libby|samantha|daniel|karen|moira|serena|zira/i.test(v.name)) s += 25;
    if (/^en-(US|GB|IN|AU)/i.test(v.lang)) s += 10;
    if (/^en/i.test(v.lang)) s += 5;
    if (/david|mark|hazel|desktop/i.test(v.name)) s -= 15;
    return s;
  };
  return [...voices].sort((a, b) => score(b) - score(a));
}

/* ---------------- Kokoro (neural, local) ---------------- */

let kokoro = null;
let kokoroLoading = null;

export function loadKokoro(onProgress) {
  if (kokoro) return Promise.resolve(kokoro);
  if (kokoroLoading) return kokoroLoading;
  kokoroLoading = (async () => {
    const mod = await import("https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js");
    const files = {};
    kokoro = await mod.KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
      dtype: "q8",
      device: "wasm",
      progress_callback: (p) => {
        if (p && p.file && typeof p.progress === "number") {
          files[p.file] = p.progress;
          const vals = Object.values(files);
          onProgress?.(Math.round(vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length)));
        }
      }
    });
    return kokoro;
  })().catch((e) => { kokoroLoading = null; throw new Error("Could not load the neural voice (" + e.message + "). It needs internet the first time."); });
  return kokoroLoading;
}

function concat(parts, rate, gapSec) {
  const gap = Math.floor(rate * gapSec);
  const total = parts.reduce((n, p) => n + p.length, 0) + gap * Math.max(0, parts.length - 1);
  const out = new Float32Array(total);
  let at = 0;
  parts.forEach((p, i) => { out.set(p, at); at += p.length + (i < parts.length - 1 ? gap : 0); });
  return out;
}

export async function synthKokoro(text, voice, onProgress) {
  const tts = await loadKokoro(onProgress);
  const parts = [];
  let rate = 24000;
  for (const s of sentences(text)) {
    const a = await tts.generate(s, { voice });
    parts.push(a.audio);
    rate = a.sampling_rate || rate;
  }
  return { samples: concat(parts, rate, 0.16), rate };
}

/* ---------------- Gemini speech ---------------- */

let geminiModel = null;

async function findGeminiTtsModel(key) {
  if (geminiModel) return geminiModel;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${key}`);
    const j = await res.json();
    const names = (j.models || []).filter((m) => /tts/i.test(m.name) && (m.supportedGenerationMethods || []).includes("generateContent")).map((m) => m.name.replace("models/", ""));
    names.sort((a, b) => Number(/flash/.test(b)) - Number(/flash/.test(a)) || b.localeCompare(a, undefined, { numeric: true }));
    if (names.length) { geminiModel = names[0]; return geminiModel; }
  } catch { /* fall through to the default */ }
  geminiModel = "gemini-2.5-flash-preview-tts";
  return geminiModel;
}

export async function synthGemini(text, voice) {
  const key = getKey("gemini");
  if (!key) throw new Error("Add a Gemini key in Settings to use the Gemini voice.");
  const model = await findGeminiTtsModel(key);
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Read this clearly and naturally, like a friendly teacher: ${text}` }] }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
    })
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Gemini voice: " + (j?.error?.message || "HTTP " + res.status));
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error("Gemini voice returned no audio.");
  const raw = atob(part.inlineData.data);
  const n = Math.floor(raw.length / 2);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let v = raw.charCodeAt(i * 2) | (raw.charCodeAt(i * 2 + 1) << 8);
    if (v >= 0x8000) v -= 0x10000;
    samples[i] = v / 32768;
  }
  const rate = Number((part.inlineData.mimeType || "").match(/rate=(\d+)/)?.[1]) || 24000;
  return { samples, rate };
}

/* ---------------- shared ---------------- */

const cache = new Map();

// Renders audio for every scene of a script. Returns an array of { samples, rate }.
export async function prepareClips(texts, engine, voice, onStatus) {
  const out = [];
  for (let i = 0; i < texts.length; i++) {
    onStatus?.(`Preparing voice ${i + 1} of ${texts.length}…`);
    const k = `${engine}|${voice}|${texts[i]}`;
    if (!cache.has(k)) {
      const p = engine === "kokoro"
        ? synthKokoro(texts[i], voice, (pct) => onStatus?.(`Downloading the neural voice model… ${pct}%`))
        : synthGemini(texts[i], voice);
      cache.set(k, p);
      p.catch(() => cache.delete(k));
    }
    out.push(await cache.get(k));
  }
  return out;
}
