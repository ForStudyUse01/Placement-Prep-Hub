import { TOPICS } from "../data/topics.js";
import { EXTRA } from "../data/topic_extra.js";
import { PROVIDERS, getKey, callAI } from "../ai.js";
import { renderHTML, escapeHtml as esc } from "../dom.js";
import { get, set } from "../storage.js";
import { Player, THEMES } from "../video/engine.js";
import { buildMessages, parseScript, sanitize, offlineFromText, offlineFromTopic, toSrt, shorten } from "../video/script.js";

let player = null;
let mode = "topic";

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
  if (player) player.destroy();
  player = null;
}

export function render(root) {
  if (player) player.destroy();
  player = null;
  const hasKey = Object.keys(PROVIDERS).some((p) => getKey(p));
  let script = null;

  renderHTML(root, `
    <div class="kicker">New</div>
    <h1>Video Explainer</h1>
    <p class="lead">Turn a topic, a prompt or a document into an animated, narrated explainer video. Pick a source, press Generate, then play it, edit the script, or record a video file.</p>

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
          <div class="field" style="border:none"><label>Writer</label><select id="engine"><option value="ai" ${hasKey ? "" : "disabled"}>AI (your key)</option><option value="offline" ${hasKey ? "" : "selected"}>Offline (no AI)</option></select></div>
        </div>
        <button class="btn" id="gen">Generate video</button>
        <p class="muted" id="status" style="margin:10px 0 0;font-size:13px">${hasKey ? "AI key found. Offline mode works without one." : "No AI key set. Offline mode builds videos from the text you give it, or from a site topic. Add a key in Settings for full AI scripts."}</p>
      </div>

      <div id="stage">
        <canvas id="cv" style="width:100%;height:auto;border:1px solid var(--border);background:var(--panel);display:block"></canvas>
        <div class="vctl" style="margin-top:10px">
          <button class="btn secondary" id="prev">Prev</button>
          <button class="btn" id="play">Play</button>
          <button class="btn secondary" id="next">Next</button>
          <span class="muted" id="time" style="font-family:var(--mono);font-size:12px">0:00 / 0:00</span>
        </div>
        <div class="vrow" style="margin-top:6px">
          <label style="margin:0"><input type="checkbox" id="voiceOn" checked/> Voice</label>
          <label style="margin:0"><input type="checkbox" id="capsOn" checked/> Captions</label>
          <select id="voice" style="max-width:210px"></select>
          <select id="speed"><option value="0.85">0.85x</option><option value="1" selected>1x</option><option value="1.15">1.15x</option><option value="1.3">1.3x</option></select>
        </div>
        <div class="vctl">
          <button class="btn secondary" id="rec">Record video (WebM)</button>
          <button class="btn secondary" id="srt">Subtitles (.srt)</button>
          <button class="btn secondary" id="json">Script (.json)</button>
        </div>
        <p class="muted" id="recNote" style="font-size:12px;margin:0">Recording runs in real time, so it takes as long as the video. The file is silent with burned-in captions; use a screen recorder if you want the voice in the file.</p>
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
      playBtn.textContent = p.playing ? "Pause" : "Play";
      $("#time").textContent = `${fmt(p.elapsed)} / ${fmt(p.total)}`;
      root.querySelectorAll("#chips .chip").forEach((c, i) => c.classList.toggle("active", i === p.idx));
    }
  });
  player.setTheme($("#theme").value);
  playBtn.addEventListener("click", () => player.toggle());
  $("#prev").addEventListener("click", () => player.prev());
  $("#next").addEventListener("click", () => player.next());
  $("#theme").addEventListener("change", (e) => player.setTheme(e.target.value));
  $("#voiceOn").addEventListener("change", (e) => player.setSpeech(e.target.checked));
  $("#capsOn").addEventListener("change", (e) => { player.captions = e.target.checked; });
  $("#speed").addEventListener("change", (e) => { player.setRate(Number(e.target.value)); player._emit(); });

  /* ---- voices ---- */
  const fillVoices = () => {
    if (!("speechSynthesis" in window)) { $("#voice").style.display = "none"; return; }
    const all = window.speechSynthesis.getVoices();
    const en = all.filter((v) => /^en/i.test(v.lang));
    const list = en.length ? en : all;
    const saved = get("video:voice", "");
    renderHTML($("#voice"), list.map((v) => `<option value="${esc(v.name)}" ${v.name === saved ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join(""));
    player.voice = list.find((v) => v.name === ($("#voice").value || saved)) || list[0] || null;
  };
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = fillVoices;
  fillVoices();
  $("#voice").addEventListener("change", (e) => {
    set("video:voice", e.target.value);
    player.voice = window.speechSynthesis.getVoices().find((v) => v.name === e.target.value) || null;
  });

  /* ---- script handling ---- */
  const setScript = (s) => {
    script = s;
    player.load(s);
    player.setRate(Number($("#speed").value));
    $("#scriptJson").value = JSON.stringify(s, null, 2);
    renderHTML($("#chips"), s.scenes.map((sc, i) => `<span class="chip" data-i="${i}">${i + 1}. ${esc(sc.type)}</span>`).join(""));
    root.querySelectorAll("#chips .chip").forEach((c) => c.addEventListener("click", () => player.goto(Number(c.dataset.i))));
    player._emit();
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
  $("#rec").addEventListener("click", () => {
    if (!script) return status("Generate a video first.", true);
    const btn = $("#rec");
    btn.disabled = true;
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
