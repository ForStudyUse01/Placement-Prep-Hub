// Tiny localStorage wrapper. Everything here stays in the user's browser —
// nothing is sent anywhere except the AI calls the user explicitly triggers.
const NS = "pph:"; // placement-prep-hub

export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function remove(key) {
  try { localStorage.removeItem(NS + key); } catch { /* noop */ }
}

// ---- token ledger: every real AI call is recorded once, in ai.js ----
let sessionTokens = 0; // resets on page load

export function recordUsage(entry) {
  const total = Number(entry.total) || 0;
  sessionTokens += total;
  set("tokens:total", get("tokens:total", 0) + total);
  const log = get("tokens:log", []);
  log.push({ ...entry, t: Date.now() });
  set("tokens:log", log.slice(-100));
  window.dispatchEvent(new Event("tokens-changed"));
}

export const getTokens = () => get("tokens:total", 0);
export const getSessionTokens = () => sessionTokens;
export const getUsageLog = () => get("tokens:log", []);

export function resetTokens() {
  sessionTokens = 0;
  set("tokens:total", 0);
  set("tokens:log", []);
  window.dispatchEvent(new Event("tokens-changed"));
}
