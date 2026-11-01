import { PROVIDERS, getKey, setKey, getPrefs, setPrefs, getModels, fetchModels } from "../ai.js";
import { renderHTML, escapeHtml } from "../dom.js";
import { getTokens, getSessionTokens, getUsageLog, resetTokens } from "../storage.js";

export function render(root) {
  const prefs = getPrefs();
  renderHTML(root, `
    <h1>️ Settings — AI Providers & API Keys</h1>
    <p class="lead">Everything here stays in <b>this browser's localStorage</b>. Keys are sent only directly from your browser to the provider you pick — never to any third party, and never committed if you push this site to GitHub.</p>

    <h2>1. Add your free-tier API key(s)</h2>
    <div class="grid cols-3" id="keyCards"></div>

    <h2 style="margin-top:24px">2. Choose primary &amp; backup model</h2>
    <div class="card">
      <div class="grid cols-2">
        <div>
          <div class="field">
            <label>Primary provider</label>
            <select id="primaryProvider"></select>
          </div>
          <div class="field">
            <label>Primary model</label>
            <select id="primaryModel"></select>
          </div>
        </div>
        <div>
          <div class="field">
            <label>Backup provider (used automatically if primary fails)</label>
            <select id="backupProvider"></select>
          </div>
          <div class="field">
            <label>Backup model</label>
            <select id="backupModel"></select>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Token budget per AI-assisted coding / prompt lab session</label>
        <input type="number" id="budgetInput" value="${prefs.budget}" min="200" step="100" style="width:160px"/>
      </div>
      <button class="btn" id="savePrefsBtn">Save preferences</button>
      <span class="muted" id="saveMsg" style="margin-left:10px"></span>
    </div>

    <h2 style="margin-top:24px">3. Usage</h2>
    <div class="card">
      <div class="grid cols-2" style="border:none"><div class="stat"><span class="num">${getSessionTokens().toLocaleString()}</span><span class="lbl">Tokens this visit</span></div><div class="stat"><span class="num">${getTokens().toLocaleString()}</span><span class="lbl">Tokens all-time (this browser)</span></div></div>
      <div class="scroll-x" style="margin-top:14px"><table class="vtable" style="width:100%"><tr><th>When</th><th>Feature</th><th>Model</th><th>In</th><th>Out</th><th>Total</th></tr>${getUsageLog().slice(-10).reverse().map((e) => `<tr><td>${new Date(e.t).toLocaleTimeString()}</td><td>${escapeHtml(e.feature)}</td><td>${escapeHtml(e.model)}${e.estimated ? " (est.)" : ""}</td><td>${e.prompt}</td><td>${e.completion}</td><td>${e.total}</td></tr>`).join("") || `<tr><td colspan="6" class="muted">No AI calls yet.</td></tr>`}</table></div>
      <button class="btn secondary" id="resetTokensBtn" style="margin-top:10px">Reset token counter</button>
    </div>
  `);

  const keyCards = root.querySelector("#keyCards");
  renderHTML(keyCards, Object.entries(PROVIDERS).map(([pid, p]) => `
    <div class="card">
      <h2>${escapeHtml(p.label)}</h2>
      <p class="muted" style="font-size:12px">${escapeHtml(p.keyHelp)}</p>
      <div class="field">
        <label>API key</label>
        <input type="password" class="keyInput" data-provider="${pid}" value="${escapeHtml(getKey(pid))}" placeholder="paste key here"/>
      </div>
      <button class="btn secondary saveKeyBtn" data-provider="${pid}">Save key</button>
      <button class="btn secondary loadModelsBtn" data-provider="${pid}">Load my models</button>
      <span class="muted saveKeyMsg" data-provider="${pid}" style="margin-left:8px;font-size:12px"></span>
    </div>
  `).join(""));

  keyCards.querySelectorAll(".saveKeyBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pid = btn.dataset.provider;
      const input = keyCards.querySelector(`.keyInput[data-provider="${pid}"]`);
      setKey(pid, input.value.trim());
      const msg = keyCards.querySelector(`.saveKeyMsg[data-provider="${pid}"]`);
      msg.textContent = "Saved ✓";
      setTimeout(() => (msg.textContent = ""), 2000);
      import("../app.js").then((m) => m.refreshProviderBadge?.());
    });
  });

  keyCards.querySelectorAll(".loadModelsBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.provider;
      const msg = keyCards.querySelector(`.saveKeyMsg[data-provider="${pid}"]`);
      setKey(pid, keyCards.querySelector(`.keyInput[data-provider="${pid}"]`).value.trim());
      msg.textContent = "Loading…";
      try {
        const ids = await fetchModels(pid);
        msg.textContent = `${ids.length} models loaded`;
        const prefs = getPrefs();
        if (prefs.primaryProvider === pid && !ids.includes(prefs.primaryModel)) prefs.primaryModel = ids[0];
        if (prefs.backupProvider === pid && !ids.includes(prefs.backupModel)) prefs.backupModel = ids[0];
        setPrefs(prefs);
        setTimeout(() => render(root), 800);
      } catch (e) {
        msg.textContent = `Failed: ${e.message}`;
      }
    });
  });

  const primaryProvider = root.querySelector("#primaryProvider");
  const primaryModel = root.querySelector("#primaryModel");
  const backupProvider = root.querySelector("#backupProvider");
  const backupModel = root.querySelector("#backupModel");

  function fillProviderSelect(sel, selected) {
    renderHTML(sel, Object.entries(PROVIDERS).map(([pid, p]) => `<option value="${pid}" ${pid === selected ? "selected" : ""}>${escapeHtml(p.label)}</option>`).join(""));
  }
  function fillModelSelect(sel, providerId, selected) {
    const models = getModels(providerId);
    renderHTML(sel, models.map((m) => `<option value="${escapeHtml(m)}" ${m === selected ? "selected" : ""}>${escapeHtml(m)}</option>`).join(""));
  }

  fillProviderSelect(primaryProvider, prefs.primaryProvider);
  fillModelSelect(primaryModel, prefs.primaryProvider, prefs.primaryModel);
  fillProviderSelect(backupProvider, prefs.backupProvider);
  fillModelSelect(backupModel, prefs.backupProvider, prefs.backupModel);

  primaryProvider.addEventListener("change", () => fillModelSelect(primaryModel, primaryProvider.value));
  backupProvider.addEventListener("change", () => fillModelSelect(backupModel, backupProvider.value));

  root.querySelector("#savePrefsBtn").addEventListener("click", () => {
    setPrefs({
      primaryProvider: primaryProvider.value,
      primaryModel: primaryModel.value,
      backupProvider: backupProvider.value,
      backupModel: backupModel.value,
      budget: Number(root.querySelector("#budgetInput").value) || 4000
    });
    const msg = root.querySelector("#saveMsg");
    msg.textContent = "Saved ✓";
    setTimeout(() => (msg.textContent = ""), 2000);
  });

  root.querySelector("#resetTokensBtn").addEventListener("click", () => {
    resetTokens();
    render(root);
  });
}
