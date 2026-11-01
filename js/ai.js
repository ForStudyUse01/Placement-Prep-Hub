// Multi-provider AI client — runs entirely client-side.
// The user pastes their OWN free-tier API key(s); keys live only in this
// browser's localStorage and are sent straight to the provider, never to a
// third party. Works on static hosting (GitHub Pages) because there is no
// backend: every call is a direct fetch() from the browser to the provider.
import { get, set } from "./storage.js";

export const PROVIDERS = {
  groq: {
    label: "Groq (free tier, very fast)",
    keyHelp: "Get a free key at console.groq.com/keys",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
      "mixtral-8x7b-32768"
    ],
    endpoint: () => "https://api.groq.com/openai/v1/chat/completions",
    headers: (key) => ({ "Content-Type": "application/json", Authorization: `Bearer ${key}` }),
    body: (model, messages, maxTokens) => JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.4 }),
    parse: (json) => ({
      text: json.choices?.[0]?.message?.content ?? "",
      usage: {
        prompt: json.usage?.prompt_tokens ?? 0,
        completion: json.usage?.completion_tokens ?? 0,
        total: json.usage?.total_tokens ?? 0
      }
    })
  },
  xai: {
    label: "xAI Grok",
    keyHelp: "Get a key at console.x.ai",
    models: ["grok-3-mini", "grok-3", "grok-4"],
    endpoint: () => "https://api.x.ai/v1/chat/completions",
    headers: (key) => ({ "Content-Type": "application/json", Authorization: `Bearer ${key}` }),
    body: (model, messages, maxTokens) => JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.4 }),
    parse: (json) => ({
      text: json.choices?.[0]?.message?.content ?? "",
      usage: {
        prompt: json.usage?.prompt_tokens ?? 0,
        completion: json.usage?.completion_tokens ?? 0,
        total: json.usage?.total_tokens ?? 0
      }
    })
  },
  openrouter: {
    label: "OpenRouter (free-tagged models)",
    keyHelp: "Get a free key at openrouter.ai/keys — pick a model ending in :free",
    models: [
      "meta-llama/llama-3.1-8b-instruct:free",
      "google/gemma-2-9b-it:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen-2-7b-instruct:free"
    ],
    endpoint: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: (key) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": location.href,
      "X-Title": "Placement Prep Hub"
    }),
    body: (model, messages, maxTokens) => JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.4 }),
    parse: (json) => ({
      text: json.choices?.[0]?.message?.content ?? "",
      usage: {
        prompt: json.usage?.prompt_tokens ?? 0,
        completion: json.usage?.completion_tokens ?? 0,
        total: json.usage?.total_tokens ?? 0
      }
    })
  },
  gemini: {
    label: "Google Gemini (free tier)",
    keyHelp: "Get a free key at aistudio.google.com/apikey",
    models: ["gemini-flash-latest", "gemini-flash-lite-latest"],
    endpoint: (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    headers: () => ({ "Content-Type": "application/json" }),
    body: (model, messages, maxTokens) => {
      const sys = messages.find((m) => m.role === "system");
      const rest = messages.filter((m) => m.role !== "system");
      return JSON.stringify({
        systemInstruction: sys ? { parts: [{ text: sys.content }] } : undefined,
        contents: rest.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 }
      });
    },
    parse: (json) => ({
      text: json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "",
      usage: {
        prompt: json.usageMetadata?.promptTokenCount ?? 0,
        completion: json.usageMetadata?.candidatesTokenCount ?? 0,
        total: json.usageMetadata?.totalTokenCount ?? 0
      }
    })
  }
};

export function getKey(provider) {
  return get(`keys:${provider}`, "");
}
export function setKey(provider, key) {
  set(`keys:${provider}`, key);
}

export function getPrefs() {
  return get("ai:prefs", {
    primaryProvider: "groq",
    primaryModel: PROVIDERS.groq.models[0],
    backupProvider: "openrouter",
    backupModel: PROVIDERS.openrouter.models[0],
    budget: 4000
  });
}
export function setPrefs(p) {
  set("ai:prefs", p);
}

// Rough fallback token estimate when a provider gives no usage field (~4 chars/token).
export function estimateTokens(str) {
  return Math.ceil((str || "").length / 4);
}

const LIST_URLS = {
  groq: (k) => ["https://api.groq.com/openai/v1/models", { Authorization: `Bearer ${k}` }],
  xai: (k) => ["https://api.x.ai/v1/models", { Authorization: `Bearer ${k}` }],
  openrouter: (k) => ["https://openrouter.ai/api/v1/models", { Authorization: `Bearer ${k}` }],
  gemini: (k) => [`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${k}`, {}]
};
const SKIP = /whisper|tts|guard|embed|orpheus|image|audio|vision-preview|moderation|live|imagen|veo|robotics|computer-use/i;

export function getModels(pid) {
  const saved = get(`models:${pid}`, null);
  return saved && saved.length ? saved : PROVIDERS[pid].models;
}

// Asks the provider which models this key can actually use.
export async function fetchModels(pid) {
  const key = getKey(pid);
  if (!key) throw new Error("Save an API key first.");
  const [url, headers] = LIST_URLS[pid](key);
  const res = await fetch(url, { headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `HTTP ${res.status}`);
  let ids;
  if (pid === "gemini") {
    ids = (json.models || []).filter((m) => (m.supportedGenerationMethods || []).includes("generateContent")).map((m) => m.name.replace("models/", ""));
  } else if (pid === "openrouter") {
    ids = (json.data || []).filter((m) => m.id.endsWith(":free")).map((m) => m.id);
  } else {
    ids = (json.data || []).map((m) => m.id);
  }
  ids = ids.filter((id) => !SKIP.test(id));
  if (pid === "gemini") ids.sort((a, b) => Number(/flash/.test(b)) - Number(/flash/.test(a)) || b.localeCompare(a, undefined, { numeric: true }));
  if (!ids.length) throw new Error("No usable models returned for this key.");
  set(`models:${pid}`, ids);
  return ids;
}

const GONE = /does not exist|no longer|not found|deprecated|decommission|do not have access|unsupported model/i;

async function callOne(providerKey, model, messages, maxTokens, retried = false) {
  try {
    return await callOneRaw(providerKey, model, messages, maxTokens);
  } catch (err) {
    if (retried || !GONE.test(err.message)) throw err;
    const ids = await fetchModels(providerKey).catch(() => null);
    const alt = ids?.find((id) => id !== model);
    if (!alt) throw err;
    const prefs = getPrefs();
    if (prefs.primaryProvider === providerKey && prefs.primaryModel === model) setPrefs({ ...prefs, primaryModel: alt });
    if (prefs.backupProvider === providerKey && prefs.backupModel === model) setPrefs({ ...getPrefs(), backupModel: alt });
    const out = await callOne(providerKey, alt, messages, maxTokens, true);
    out.autoSwitched = `${model} → ${alt}`;
    return out;
  }
}

async function callOneRaw(providerKey, model, messages, maxTokens) {
  const provider = PROVIDERS[providerKey];
  if (!provider) throw new Error(`Unknown provider: ${providerKey}`);
  const key = getKey(providerKey);
  if (!key) throw new Error(`No API key set for ${provider.label}. Add one in Settings.`);

  const url = provider.endpoint(model, key);
  const res = await fetch(url, {
    method: "POST",
    headers: provider.headers(key),
    body: provider.body(model, messages, maxTokens)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(`${provider.label}: ${msg}`);
  }
  const parsed = provider.parse(json);
  if (!parsed.usage.total) {
    const estIn = estimateTokens(messages.map((m) => m.content).join("\n"));
    const estOut = estimateTokens(parsed.text);
    parsed.usage = { prompt: estIn, completion: estOut, total: estIn + estOut, estimated: true };
  }
  parsed.provider = providerKey;
  parsed.model = model;
  return parsed;
}

/**
 * Calls the primary provider/model; on any failure (bad key, rate limit,
 * network) automatically retries once against the backup provider/model.
 */
export async function callAI({ messages, maxTokens = 600, prefs = null }) {
  const p = prefs || getPrefs();
  try {
    return await callOne(p.primaryProvider, p.primaryModel, messages, maxTokens);
  } catch (primaryErr) {
    try {
      const result = await callOne(p.backupProvider, p.backupModel, messages, maxTokens);
      result.usedBackup = true;
      result.primaryError = primaryErr.message;
      return result;
    } catch (backupErr) {
      const err = new Error(
        `Primary (${p.primaryProvider}) failed: ${primaryErr.message}. Backup (${p.backupProvider}) failed: ${backupErr.message}`
      );
      err.primaryError = primaryErr;
      err.backupError = backupErr;
      throw err;
    }
  }
}
