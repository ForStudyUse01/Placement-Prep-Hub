import { TOPICS } from "../data/topics.js";
import { EXTRA } from "../data/topic_extra.js";
import { PROVIDERS, getKey, callAI } from "../ai.js";
import { renderHTML, escapeHtml as esc } from "../dom.js";
import { get, set } from "../storage.js";
import { Player, THEMES } from "../video/engine.js";
import { buildMessages, parseScript, sanitize, offlineFromText, offlineFromTopic, toSrt, shorten, speakable } from "../video/script.js";
import { ENGINES, KOKORO_VOICES, GEMINI_VOICES, rankBrowserVoices, prepareClips } from "../video/tts.js";

let player = null;
let mode = "topic";
let keyHandler = null;
let idleTimer = null;

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "video";

function topicContext(topic) {
  const doc = new DOMParser().parseFromString(topic.body, "text/html");
  const body = doc.body.textContent.replace(/\s+/g, " ").trim();
  const x = EXTRA[topic.id];
  const ex = x ? ` Worked example: ${x.example.title}. ${x.example.walk.join(" ")} Result: ${x.example.result}. Common mistakes: ${x.mistakes.join("; ")}.` : "";
  return (`${topic.title}. ${x?.why || ""} ${body}${ex}`).slice(0, 4500);
}

async function loadPdfText(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Could not load the PDF reader (needs internet)."));
      document.head.append(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
    const page = await pdf.getPage(i);
    text += (await page.getTextContent()).items.map((it) => it.str).join(" ") + "\n";
  }
  return text;
}

export function unmount() {
  if (keyHandler) document.removeEventListener("keydown", keyHandler);
  keyHandler = null;
  clearTimeout(idleTimer);
  document.body.style.overflow = "";
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (player) player.destroy();
  player = null;
}

export function render(root) {
  unmount();
  const hasKey = Object.keys(PROVIDERS).some((p) => getKey(p));
  const hasGemini = !!getKey("gemini");
  let script = null;
  let clipsKey = null;

  renderHTML(root, `
    <div class="kicker">New</div>
    <h1>Video Explainer</h1>
    <p class="lead">Turn a topic, a prompt or a document into an animated, narrated explainer video. Pick a source, press Generate, then play it, go fullscreen, edit the script, or record a video file.</p>

    <div class="vl-grid">
      <div class="card" id="create">
        <div class="chip-filter" id="modes" style="margin-bottom:14px">
          <span class="chip" data-m="topic">Topic</span><span class="chip" data-m="prompt">Prompt</span><span class="chip" data-m="doc">Document</span>
        </div>

        <div id="pTopic">
          <div class="field"><label>Study topic from this site</label>
            <select id="siteTopic"><option value="">Type my own topic below</option>${TOPICS.map((t) => `<option value="${t.id}">${esc(t.title.split(/[:—]/)[0].trim())}</option>`).join("")}</select></div>
          <div class="field"><label>Or your own topic</label><input type="text" id="customTopic" placeholder="e.g. How a HashMap handles collisions" style="width:100%"/></div>
        </div>
        <div id="pPrompt" style="display:none"><div class="field"><label>Your prompt</label>
          <textarea id="promptText" rows="5" style="font-family:var(--sans)" placeholder="Explain binary search to a beginner using the array 2 5 8 12 16 23 and target 23."></textarea></div></div>
        <div id="pDoc" style="display:none">
          <div class="field"><label>Upload .txt, .md or .pdf</label><input type="file" id="docFile" accept=".txt,.md,.pdf,text/plain,application/pdf"/></div>
          <div class="field"><label>Or paste the text</label><textarea id="docText" rows="6" style="font-family:var(--sans)" placeholder="Paste notes, a chapter or an article"></textarea></div>
        </div>
        <div class="field" id="extraWrap"><label>Extra instructions (optional)</label><input type="text" id="extraText" placeholder="e.g. focus on exam tricks, keep it simple" style="width:100%"/></div>

        <div class="grid cols-2" style="border:none;margin-bottom:10px">
          <div class="field" style="border:none;padding-right:8px"><label>Scenes</label><select id="scenes"><option>5</option><option selected>7</option><option>9</option><option>11</option></select></div>
          <div class="field" style="border:none"><label>Level</label><select id="level"><option>Beginner</option><option selected>Exam revision</option><option>Advanced</option></select></div>
          <div class="field" style="border:none;padding-right:8px"><label>Look</label><select id="theme">${Object.keys(THEMES).map((t) => `<option>${t}</option>`).join("")}</select></div>
          <div class="field" style="border:none"><label>Script writer</label><select id="engine"><option value="ai" ${hasKey ? "" : "disabled"}>AI (your key)</option><option value="offline" ${hasKey ? "" : "selected"}>Offline (no AI)</option></select></div>
        </div>
        <button class="btn" id="gen">Generate video</button>
        <p class="muted" id="status" style="margin:10px 0 0;font-size:13px">${hasKey ? "AI key found. Offline mode works without one." : "No AI key set. Offline mode builds videos from the text you give it, or from a site topic. Add a key in Settings for full AI scripts."}</p>
      </div>

      <div id="stage">
        <div id="player">
          <canvas id="cv" style="width:100%;height:auto;border:1px solid var(--border);background:var(--panel);display:block;cursor:pointer"></canvas>
          <div class="vctl" id="pctl">
            <button class="btn secondary" id="prev">Prev</button>
            <button class="btn" id="play">Play</button>
            <button class="btn secondary" id="next">Next</button>
            <span class="vtime" id="time">0:00 / 0:00</span>
            <span style="flex:1"></span>
            <button class="btn secondary" id="capsBtn">Captions: on</button>
            <button class="btn secondary" id="voiceBtn">Voice: on</button>
            <button class="btn secondary" id="fs">Fullscreen</button>
          </div>
        </div>

        <div class="vrow" style="margin-top:12px">
          <select id="vengine" title="Voice engine">${ENGINES.map(([k, n]) => `<option value="${k}" ${k === "gemini" && !hasGemini ? "disabled" : ""}>${esc(n)}</option>`).join("")}</select>
          <select id="voice" style="max-width:230px" title="Voice"></select>
          <select id="speed" title="Speed"><option value="0.85">0.85x</option><option value="1" selected>1x</option><option value="1.15">1.15x</option><option value="1.3">1.3x</option></select>
        </div>
        <p class="muted" id="voiceStatus" style="font-size:13px;margin:0 0 8px">Tip: for the most natural sound pick the Neural or Gemini voice. Keys: F fullscreen, Space play, arrows scenes, C captions, M voice.</p>
        <div class="vctl">
          <button class="btn secondary" id="rec">Record video (WebM)</button>
          <button class="btn secondary" id="srt">Subtitles (.srt)</button>
          <button class="btn secondary" id="json">Script (.json)</button>
        </div>
        <p class="muted" id="recNote" style="font-size:12px;margin:0">Recording runs in real time, so it takes as long as the video. With the Neural or Gemini voice the file includes the voice. With the browser voice the file is silent with burned-in captions.</p>
        <div class="chip-filter" id="chips" style="margin-top:12px"></div>
      </div>
    </div>

    <div class="section"><h2>Script</h2>
      <p class="muted" style="margin-top:0;font-size:14px">Edit the JSON to change any scene, then press Apply. Scene types: title, bullets, flow, array, code, compare, callout.</p>
      <textarea id="scriptJson" rows="14" spellcheck="false"></textarea>
      <div class="flex gap" style="margin-top:10px"><button class="btn secondary" id="apply">Apply changes</button><button class="btn secondary" id="save">Save to library</button></div>
    </div>
    <div class="section"><h2>Library</h2><div id="lib"></div></div>
  `);

  const $ = (s) => root.querySelector(s);
  const status = (msg, bad) => { const el = $("#status"); el.textContent = msg; el.style.color = bad ? "var(--danger)" : ""; };
  const voiceStatus = (msg, bad) => { const el = $("#voiceStatus"); if (!el) return; el.textContent = msg; el.style.color = bad ? "var(--danger)" : ""; };

  /* ---- mode switching ---- */
  const setMode = (m) => {
    mode = m;
    root.querySelectorAll("#modes .chip").forEach((c) => c.classList.toggle("active", c.dataset.m === m));
    $("#pTopic").style.display = m === "topic" ? "" : "none";
    $("#pPrompt").style.display = m === "prompt" ? "" : "none";
    $("#pDoc").style.display = m === "doc" ? "" : "none";
    $("#extraWrap").style.display = m === "prompt" ? "none" : "";
  };
  root.querySelectorAll("#modes .chip").forEach((c) => c.addEventListener("click", () => setMode(c.dataset.m)));
  setMode(mode);

  /* ---- player ---- */
  const playBtn = $("#play");
  player = new Player($("#cv"), {
    onUpdate: (p) => {
      const t = $("#time");
      if (!t) return;
      playBtn.textContent = p.playing ? "Pause" : "Play";
      t.textContent = `${fmt(p.elapsed)} / ${fmt(p.total)}`;
      root.querySelectorAll("#chips .chip").forEach((c, i) => c.classList.toggle("active", i === p.idx));
    }
  });
  player.setTheme($("#theme").value);

  /* ---- voices ---- */
  const savedEngine = get("video:vengine", "browser");
  $("#vengine").value = savedEngine === "gemini" && !hasGemini ? "browser" : savedEngine;
  let browserVoices = [];
  const fillVoices = () => {
    const eng = $("#vengine").value;
    const sel = $("#voice");
    const saved = get(`video:voice:${eng}`, "");
    let opts = [];
    if (eng === "browser") {
      browserVoices = "speechSynthesis" in window ? rankBrowserVoices(window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang))) : [];
      if (!browserVoices.length && "speechSynthesis" in window) browserVoices = rankBrowserVoices(window.speechSynthesis.getVoices());
      opts = browserVoices.map((v, i) => [v.name, `${i === 0 ? "★ " : ""}${v.name} (${v.lang})`]);
    } else opts = eng === "kokoro" ? KOKORO_VOICES : GEMINI_VOICES;
    renderHTML(sel, opts.map(([v, n]) => `<option value="${esc(v)}" ${v === saved ? "selected" : ""}>${esc(n)}</option>`).join(""));
    if (eng === "browser") player.voice = browserVoices.find((v) => v.name === sel.value) || browserVoices[0] || null;
  };
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = fillVoices;
  fillVoices();

  const ensureVoice = async () => {
    const eng = $("#vengine").value;
    if (!script) return true;
    if (eng === "browser") { if (player.clipsReady) { player.setClips(null); clipsKey = null; } return true; }
    const key = `${eng}|${$("#voice").value}|${script.scenes.map((s) => s.narration).join("|")}`;
    if (clipsKey === key && player.clipsReady) return true;
    try {
      voiceStatus("Preparing voice…");
      const raw = await prepareClips(script.scenes.map((s) => speakable(s.narration)), eng, $("#voice").value, voiceStatus);
      player.setClips(raw);
      clipsKey = key;
      voiceStatus("Voice ready.");
      return true;
    } catch (e) {
      voiceStatus(`${e.message} Switching to the browser voice.`, true);
      $("#vengine").value = "browser";
      fillVoices();
      player.setClips(null);
      clipsKey = null;
      return false;
    }
  };

  $("#vengine").addEventListener("change", () => {
    set("video:vengine", $("#vengine").value);
    fillVoices();
    player.pause();
    player.setClips(null);
    clipsKey = null;
    const e = $("#vengine").value;
    voiceStatus(e === "kokoro" ? "Neural voice selected. Best quality but slower: the model (~90 MB) downloads once, and each scene takes a while to render. It starts as soon as a video is generated." : e === "gemini" ? "Gemini voice selected. Audio is generated with your key when you press Play." : "Browser voice selected.");
  });
  $("#voice").addEventListener("change", (e) => {
    const eng = $("#vengine").value;
    set(`video:voice:${eng}`, e.target.value);
    if (eng === "browser") player.voice = browserVoices.find((v) => v.name === e.target.value) || null;
    else { player.pause(); player.setClips(null); clipsKey = null; }
  });

  /* ---- transport ---- */
  const togglePlay = async () => {
    if (!script) return status("Generate a video first.", true);
    if (!player.playing) {
      playBtn.disabled = true;
      await ensureVoice();
      playBtn.disabled = false;
    }
    player.toggle();
  };
  playBtn.addEventListener("click", togglePlay);
  $("#cv").addEventListener("click", togglePlay);
  $("#prev").addEventListener("click", () => player.prev());
  $("#next").addEventListener("click", () => player.next());
  $("#theme").addEventListener("change", (e) => player.setTheme(e.target.value));
  $("#speed").addEventListener("change", (e) => { player.setRate(Number(e.target.value)); player._emit(); });

  const capsBtn = $("#capsBtn"), voiceBtn = $("#voiceBtn");
  const toggleCaps = () => { player.captions = !player.captions; capsBtn.textContent = `Captions: ${player.captions ? "on" : "off"}`; };
  const toggleVoice = () => { player.setSpeech(!player.speechOn); voiceBtn.textContent = `Voice: ${player.speechOn ? "on" : "off"}`; };
  capsBtn.addEventListener("click", toggleCaps);
  voiceBtn.addEventListener("click", toggleVoice);

  /* ---- fullscreen ---- */
  const box = $("#player");
  const isFs = () => document.fullscreenElement === box || box.classList.contains("pseudo-fs");
  const wake = () => {
    box.classList.remove("idle");
    clearTimeout(idleTimer);
    if (isFs()) idleTimer = setTimeout(() => box.classList.add("idle"), 2500);
  };
  const syncFs = () => {
    const fsBtn = $("#fs");
    if (!fsBtn) return;
    fsBtn.textContent = isFs() ? "Exit fullscreen" : "Fullscreen";
    document.body.style.overflow = box.classList.contains("pseudo-fs") ? "hidden" : "";
    wake();
  };
  // Uses the browser's real fullscreen; falls back to filling the window where that is blocked (e.g. embedded browsers).
  let userExited = false;
  const toggleFs = async () => {
    userExited = false;
    if (document.fullscreenElement) { userExited = true; await document.exitFullscreen().catch(() => {}); return; }
    if (box.classList.contains("pseudo-fs")) { box.classList.remove("pseudo-fs"); syncFs(); return; }
    const enterPseudo = () => {
      if (document.fullscreenElement !== box && !box.classList.contains("pseudo-fs") && !userExited) { box.classList.add("pseudo-fs"); syncFs(); }
    };
    try {
      if (!box.requestFullscreen) throw new Error("unsupported");
      const p = box.requestFullscreen();
      if (p && p.catch) p.catch(enterPseudo);
      // Some embedded browsers never answer the request: do not wait for it.
      setTimeout(enterPseudo, 700);
    } catch {
      enterPseudo();
    }
  };
  $("#fs").addEventListener("click", toggleFs);
  $("#cv").addEventListener("dblclick", toggleFs);
  box.addEventListener("mousemove", wake);
  document.addEventListener("fullscreenchange", syncFs);
  keyHandler = (e) => {
    if (!player || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape" && box.classList.contains("pseudo-fs")) { box.classList.remove("pseudo-fs"); syncFs(); return; }
    const tag = (e.target.tagName || "").toLowerCase();
    if (["input", "textarea", "select", "button"].includes(tag)) return;
    const k = e.key.toLowerCase();
    if (e.code === "Space") { e.preventDefault(); togglePlay(); }
    else if (k === "f") toggleFs();
    else if (e.key === "ArrowRight") player.next();
    else if (e.key === "ArrowLeft") player.prev();
    else if (k === "c") toggleCaps();
    else if (k === "m") toggleVoice();
  };
  document.addEventListener("keydown", keyHandler);

  /* ---- script handling ---- */
  const setScript = (s) => {
    script = s;
    clipsKey = null;
    player.load(s);
    player.setRate(Number($("#speed").value));
    $("#scriptJson").value = JSON.stringify(s, null, 2);
    renderHTML($("#chips"), s.scenes.map((sc, i) => `<span class="chip" data-i="${i}">${i + 1}. ${esc(sc.type)}</span>`).join(""));
    root.querySelectorAll("#chips .chip").forEach((c) => c.addEventListener("click", () => player.goto(Number(c.dataset.i))));
    player._emit();
    if ($("#vengine").value !== "browser") ensureVoice();
  };

  $("#apply").addEventListener("click", () => {
    try { setScript(sanitize(JSON.parse($("#scriptJson").value))); status("Script applied."); }
    catch (e) { status("Could not apply: " + e.message, true); }
  });

  const paintLibrary = () => {
    const lib = get("video:library", []);
    renderHTML($("#lib"), lib.length ? lib.map((it) => `<div class="card" style="margin-bottom:-1px"><div class="flex between wrap" style="gap:10px"><div><b>${esc(it.title)}</b> <span class="muted" style="font-size:12px">${it.script.scenes.length} scenes · ${new Date(it.ts).toLocaleDateString()}</span></div><div class="flex gap"><button class="btn secondary" data-load="${it.id}">Load</button><button class="btn secondary" data-del="${it.id}">Delete</button></div></div></div>`).join("") : `<p class="muted">Nothing saved yet.</p>`);
    root.querySelectorAll("[data-load]").forEach((b) => b.addEventListener("click", () => { const it = get("video:library", []).find((x) => x.id === b.dataset.load); if (it) { setScript(it.script); status(`Loaded "${it.title}".`); } }));
    root.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => { set("video:library", get("video:library", []).filter((x) => x.id !== b.dataset.del)); paintLibrary(); }));
  };
  paintLibrary();
  $("#save").addEventListener("click", () => {
    if (!script) return status("Generate a video first.", true);
    const lib = get("video:library", []);
    lib.unshift({ id: String(Date.now()), title: script.title, script, ts: Date.now() });
    set("video:library", lib.slice(0, 20));
    paintLibrary();
    status("Saved to the library in this browser.");
  });

  /* ---- downloads ---- */
  $("#srt").addEventListener("click", () => script ? download(new Blob([toSrt(script, player.rate)], { type: "text/plain" }), slug(script.title) + ".srt") : status("Generate a video first.", true));
  $("#json").addEventListener("click", () => script ? download(new Blob([JSON.stringify(script, null, 2)], { type: "application/json" }), slug(script.title) + ".json") : status("Generate a video first.", true));
  $("#rec").addEventListener("click", async () => {
    if (!script) return status("Generate a video first.", true);
    const btn = $("#rec");
    btn.disabled = true;
    btn.textContent = "Preparing…";
    await ensureVoice();
    btn.textContent = "Recording…";
    const ok = player.record((blob) => {
      download(blob, slug(script.title) + ".webm");
      btn.disabled = false;
      btn.textContent = "Record video (WebM)";
      status("Video saved.");
    });
    if (!ok) { btn.disabled = false; btn.textContent = "Record video (WebM)"; status("This browser cannot record video. Try Chrome or Edge.", true); }
  });

  /* ---- document upload ---- */
  $("#docFile").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    status("Reading " + f.name + "…");
    try {
      const text = /\.pdf$/i.test(f.name) ? await loadPdfText(f) : await f.text();
      $("#docText").value = text.slice(0, 12000);
      status(`Loaded ${Math.min(text.length, 12000).toLocaleString()} characters from ${f.name}.`);
    } catch (err) { status(err.message, true); }
  });

  /* ---- generate ---- */
  $("#gen").addEventListener("click", async () => {
    const count = Number($("#scenes").value);
    const level = $("#level").value;
    const engine = $("#engine").value;
    const siteTopic = mode === "topic" ? TOPICS.find((t) => t.id === $("#siteTopic").value) : null;
    let title = "", prompt = "", doc = "", context = "";
    if (mode === "topic") {
      title = siteTopic ? siteTopic.title.split(/[:—]/)[0].trim() : $("#customTopic").value.trim();
      prompt = $("#extraText").value.trim();
      if (siteTopic) context = topicContext(siteTopic);
    } else if (mode === "prompt") {
      prompt = $("#promptText").value.trim();
      title = shorten(prompt, 8);
    } else {
      doc = $("#docText").value.trim().slice(0, 9000);
      prompt = $("#extraText").value.trim();
      const first = doc.split("\n")[0].trim();
      title = first && first.split(/\s+/).length <= 9 ? first : "Document explainer";
    }
    if (!title && !prompt && !doc) return status("Choose a topic, write a prompt, or add a document first.", true);

    const btn = $("#gen");
    btn.disabled = true;
    try {
      if (engine === "ai") {
        status("Asking the model to write the script…");
        try {
          const r = await callAI({ messages: buildMessages({ topic: title, prompt, doc, context, scenes: count, level }), maxTokens: 4000, feature: "video-lab" });
          setScript(parseScript(r.text));
          status(`Script written by ${r.provider}/${r.model} (${r.usage.total} tokens). Press Play.`);
        } catch (err) {
          status(`AI script failed (${err.message}). Built an offline version instead.`, true);
          setScript(siteTopic ? offlineFromTopic(siteTopic, EXTRA[siteTopic.id], count) : offlineFromText(title || "Explainer", doc || prompt || title, count));
        }
      } else {
        status("Building the video offline…");
        setScript(siteTopic ? offlineFromTopic(siteTopic, EXTRA[siteTopic.id], count) : offlineFromText(title || "Explainer", doc || prompt || title, count));
        status("Offline video built. Press Play.");
      }
    } catch (err) {
      status(err.message, true);
    }
    btn.disabled = false;
  });
}
