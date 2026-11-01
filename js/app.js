import { renderHTML } from "./dom.js";
import { get, set, getTokens } from "./storage.js";
import { getKey } from "./ai.js";

const ROUTES = [
  { hash: "#/dashboard", icon: "01", label: "Dashboard", mod: () => import("./features/dashboard.js") },
  { hash: "#/study", icon: "02", label: "Study Material", mod: () => import("./features/study.js") },
  { hash: "#/visualizer", icon: "03", label: "Visualizer", mod: () => import("./features/visualizer.js") },
  { hash: "#/ailiteracy", icon: "04", label: "AI Literacy Test", mod: () => import("./features/ailiteracy.js") },
  { hash: "#/mcq", icon: "05", label: "Company MCQ Tests", mod: () => import("./features/mcq.js") },
  { hash: "#/debug", icon: "06", label: "Debugging Arena", mod: () => import("./features/debug.js") },
  { hash: "#/aicoding", icon: "07", label: "AI-Assisted Coding", mod: () => import("./features/aicoding.js") },
  { hash: "#/promptlab", icon: "08", label: "Prompt Lab", mod: () => import("./features/promptlab.js") },
  { hash: "#/repocheck", icon: "09", label: "GitHub Repo Audit", mod: () => import("./features/repocheck.js") },
  { hash: "#/capgemini", icon: "10", label: "Capgemini 2026", mod: () => import("./features/capgemini.js") },
  { hash: "#/settings", icon: "11", label: "Settings / API Keys", mod: () => import("./features/settings.js") }
];

const nav = document.getElementById("nav");
const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const themeToggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const globalTokenPill = document.getElementById("globalTokenPill");
const providerBadge = document.getElementById("providerBadge");

function paintNav() {
  renderHTML(nav, ROUTES.map((r) => `<a href="${r.hash}" data-hash="${r.hash}"><span class="nav-icon">${r.icon}</span>${r.label}</a>`).join(""));
}

function updateActiveNav(hash) {
  nav.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.dataset.hash === hash));
}

function updateTokenPill() {
  globalTokenPill.textContent = `${getTokens().toLocaleString()} tok used`;
}
export function refreshTokenPill() { updateTokenPill(); }

function updateProviderBadge() {
  const anyKey = ["groq", "xai", "gemini", "openrouter"].some((p) => getKey(p));
  providerBadge.textContent = anyKey ? "AI key ready" : "No AI key set";
  providerBadge.style.color = anyKey ? "var(--accent-2)" : "var(--text-mute)";
}
export function refreshProviderBadge() { updateProviderBadge(); }

async function router() {
  let hash = location.hash || "#/dashboard";
  let route = ROUTES.find((r) => r.hash === hash);
  if (!route) { hash = "#/dashboard"; route = ROUTES[0]; }
  updateActiveNav(hash);
  pageTitle.textContent = route.label;
  sidebar.classList.remove("open");
  content.replaceChildren();
  content.focus();
  const mod = await route.mod();
  mod.render(content);
}

function initTheme() {
  const theme = get("theme", "light");
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Switch to light" : "Switch to dark";
}
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  set("theme", next);
  themeToggle.textContent = next === "dark" ? "Switch to light" : "Switch to dark";
});

menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));

window.addEventListener("hashchange", router);
window.addEventListener("storage", () => { updateTokenPill(); updateProviderBadge(); });

paintNav();
initTheme();
updateTokenPill();
updateProviderBadge();
router();
