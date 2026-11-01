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

export function addTokens(n) {
  const total = get("tokens:total", 0) + (Number(n) || 0);
  set("tokens:total", total);
  return total;
}

export function getTokens() {
  return get("tokens:total", 0);
}
