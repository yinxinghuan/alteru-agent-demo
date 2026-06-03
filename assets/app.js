/* AlterU Agent — interactive demo
 *
 * Two layers:
 *  1. Canonical scenarios — pick a chip up top, it clears the chat and
 *     replays a scripted demo of one capability domain.
 *  2. Free-form interaction — type in the composer (or tap a suggestion
 *     chip / task CTA / "Why this" card) and the chat continues from
 *     wherever you are.  A small keyword classifier picks the response.
 *
 * Build-time real wdabuliu txt2img API generated /assets/covers/*.jpg.
 */

(() => {
  "use strict";

  const COVERS = {
    late_night_decision: "assets/covers/late_night_decision.jpg",
    reading_log:         "assets/covers/reading_log.jpg",
    mirror_gaze:         "assets/covers/mirror_gaze.jpg",
    last_subway:         "assets/covers/last_subway.jpg",
    rainy_konbini:       "assets/covers/rainy_konbini.jpg",
    cafe_window:         "assets/covers/cafe_window.jpg",
  };
  const COVER_NAMES = Object.keys(COVERS);
  const EMBLEM = "assets/emblem.svg";

  // =========================================================================
  // Canonical scenarios (chip-driven replay)
  // =========================================================================

  const SCENARIOS = {
    welcome: {
      title: "Cold start",
      blurb: "First-time entry. Welcome line + three concrete prompts. The composer below is live — type whatever you want.",
      caps: ["Cold start", "Suggestion chips", "Free input"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "<strong>Hi.</strong> I'm AlterU Agent." },
        { type: "wait", ms: 600 },
        { type: "agent", text: "Three things I can do right now: start a new piece, look at how your work is doing, and shape the feed you see. Tap one to try, or just tell me what you're after." },
        { type: "wait", ms: 500 },
        { type: "suggestions", items: [
          "Make a piece about a rainy alley at 2 AM",
          "How did Reading Log do yesterday?",
          "Less horror in my feed",
          "Open my feed",
        ]},
      ],
    },

    create: {
      title: "Creation hub",
      blurb: "A1 → A2 → A4. Natural-language kick-off, a live task list, completion notification. Tap any CTA — Preview, Publish, Retry, Delete — they all work.",
      caps: ["A1 kick-off", "A2 task list", "A4 completion", "Live CTAs"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Pick up where you left off, or start fresh?" },
        { type: "wait", ms: 700 },
        { type: "user", text: "make a piece about the decision at 3 AM" },
        { type: "wait", ms: 500 },
        { type: "agent", text: "Good prompt. Spinning it up — <strong>Late-Night Decision</strong>. Cover generating, first-screen video queued." },
        { type: "tasklist", id: "tl-canon", title: "In progress", tasks: [
          { id: "t-late", title: "Late-Night Decision", cover: "late_night_decision", state: "generating", progress: 14, sub: "Cover · 14%" },
          { id: "t-read", title: "Reading Log", cover: "reading_log", state: "ok", sub: "First-screen video ready", cta: ["Preview", "Publish"] },
          { id: "t-fail", title: "Y", state: "fail", sub: "OSS upload timeout · attempt 1/3", cta: ["Retry", "Open", "Delete"] },
        ]},
        { type: "wait", ms: 1100 },
        { type: "progress", taskId: "t-late", progress: 38, sub: "Cover · 38%" },
        { type: "wait", ms: 1100 },
        { type: "progress", taskId: "t-late", progress: 71, sub: "Cover · 71%" },
        { type: "wait", ms: 900 },
        { type: "progress", taskId: "t-late", progress: 100, sub: "Done", cover: "late_night_decision", state: "ok", cta: ["Preview", "Publish"] },
        { type: "wait", ms: 700 },
        { type: "system", text: "1 new" },
        { type: "agent", text: "<strong>Late-Night Decision</strong> is ready. Cover and first-screen video are queued for your eyes only until you publish.", cta: ["Preview", "Publish"], ctaTaskId: "t-late" },
      ],
    },

    insight: {
      title: "Data lens",
      blurb: "B · ask in natural language, get a tool-use answer grounded in real platform stats. Try a follow-up: ask 'who came back' or 'what was the best moment'.",
      caps: ["B insight", "Tool use", "Follow-up Q&A"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "What do you want to know?" },
        { type: "wait", ms: 700 },
        { type: "user", text: "how did Reading Log do yesterday?" },
        { type: "wait", ms: 900 },
        { type: "agent", text: "<strong>Reading Log · yesterday</strong>. 1,247 plays, average dwell <strong>2:18</strong> — 34% above last Wednesday." },
        { type: "insight", stats: [
          { val: "1,247", lbl: "Plays", delta: "+34% w/w" },
          { val: "2:18",  lbl: "Avg dwell", delta: "Top in your library" },
          { val: "71%",   lbl: "Completion", delta: "+8 pp vs median" },
        ], bars: [22, 31, 26, 40, 35, 48, 52, 47, 55, 51, 49, 64] },
        { type: "wait", ms: 800 },
        { type: "agent", text: "Longest single session was <strong>11:02</strong> from @junning. They came back twice in the next 24h — high-confidence signal for your feed." },
      ],
    },

    tune: {
      title: "Feed tuning",
      blurb: "D2 · conversational adjustments to a feed that's already personalised. Agent acknowledges, explains, and writes the change into the long-term profile. Tap the Why-this card to dig into it.",
      caps: ["D2 tune", "Profile transparency", "Why this"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Tell me what you want more or less of." },
        { type: "wait", ms: 600 },
        { type: "user", text: "less horror in my feed" },
        { type: "wait", ms: 900 },
        { type: "agent", text: "Noted. <em>Horror</em> weight in your profile is down to <strong>0.2</strong>. You won't see it in the next 24h, and the preference is saved long-term unless you tell me otherwise." },
        { type: "suggestions", items: ["Undo", "Show my profile"] },
        { type: "wait", ms: 1100 },
        { type: "why-card", text: "<strong>Why this?</strong> — tap any feed card to ask in context." },
      ],
    },

    personalize: {
      title: "Before / after",
      blurb: "D1 · the same recommendation pool, ranked by Agent's user-profile signal. The UI doesn't change — only the order does.",
      caps: ["D1 profile", "Same pool, different rank"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Your feed before the profile kicked in. Global rule, everybody saw the same mix." },
        { type: "feed", tag: "generic", title: "Feed · v0 (global rule)", items: [
          { cover: "rainy_konbini", title: "Konbini at 2 AM", score: null },
          { cover: "reading_log",   title: "Reading Log",    score: null },
          { cover: "cafe_window",   title: "Coffee in Rain", score: null },
          { cover: "mirror_gaze",   title: "Mirror, Mirror", score: null },
        ]},
        { type: "wait", ms: 1100 },
        { type: "agent", text: "Once the profile sees what you've been making and when you've been awake — same pool, new rank." },
        { type: "feed", tag: "personal", title: "Feed · v1 (profile)", items: [
          { cover: "late_night_decision", title: "Late-Night Decision", score: "0.92" },
          { cover: "mirror_gaze",         title: "Mirror, Mirror",      score: "0.87" },
          { cover: "cafe_window",         title: "Coffee in Rain",      score: "0.79" },
          { cover: "last_subway",         title: "Last Train Home",     score: "0.74" },
        ]},
        { type: "wait", ms: 800 },
        { type: "agent", text: "You make moody narrative pieces, you're awake past 1 AM, you finished two slow-paced titles this week. That's the signal — not a global rule." },
      ],
    },
  };

  // =========================================================================
  // DOM helpers
  // =========================================================================

  const $ = (s) => document.querySelector(s);
  const chat = $("#chat");
  const subEl = $("#appBarSub");
  const legendTitle = $("#legendTitle");
  const legendBody  = $("#legendBody");
  const legendCaps  = $("#legendCaps");
  const composerInput = $("#composerInput");
  const composerSend  = $("#composerSend");

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  function scrollChatToBottom() {
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function avatarNode() {
    return el("div", { class: "msg__avatar" }, [el("img", { src: EMBLEM, alt: "" })]);
  }

  function bubble(kind, html) {
    const b = el("div", { class: "msg__bubble", html });
    const row = el("div", { class: `msg msg--${kind}` });
    if (kind === "agent") row.appendChild(avatarNode());
    row.appendChild(b);
    return { row, bubble: b };
  }

  function typingBubble() {
    const dots = el("div", { class: "typing" }, [el("span"), el("span"), el("span")]);
    return el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [dots]),
    ]);
  }

  // =========================================================================
  // Renderers (one per step type)
  // =========================================================================

  function renderAgent(text, opts = {}) {
    const { row, bubble: b } = bubble("agent", text);
    if (opts.cta && opts.cta.length) {
      const wrap = el("div", { class: "task__cta", style: "margin-top:10px" });
      opts.cta.forEach((label, i) => {
        const btn = el("button", {
          class: i === 0 ? "btn btn--primary" : "btn",
          type: "button",
        }, [label]);
        bindAgentCtaBtn(btn, label, opts.ctaTaskId);
        wrap.appendChild(btn);
      });
      b.appendChild(wrap);
    }
    chat.appendChild(row);
    return row;
  }
  function renderUser(text) {
    const { row } = bubble("user", text);
    chat.appendChild(row);
    return row;
  }
  function renderSystem(text) {
    const { row } = bubble("system", text);
    chat.appendChild(row);
    return row;
  }
  // Suggestion chip labels that bypass the classifier and trigger a
  // specific bridge action directly (so the chip behaves as a CTA, not as
  // typed text).  Anything else is echoed as the user's message.
  const SUGGESTION_ACTIONS = {
    "Open my feed":            () => openFeedView("late_night_decision", "Late-Night Decision", "by you"),
    "Push to feed":            () => openFeedView("late_night_decision", "Late-Night Decision", "by you"),
    "Less from this author":   () => runMini([{ type: "agent", text: "Noted. Author weight dropped — you'll see them less for the next 7 days." }]),
    "Same vibe, more please":  () => runMini([{ type: "agent", text: "Locked in. I'll bias your feed toward this mood for the next session." }]),
    "Show my profile":         () => runMini([{ type: "agent", text: "Your consumption profile, short version: <em>moody narrative</em>, <em>late-night peak (12-2am)</em>, <em>slow pacing preferred</em>, <em>horror down to 0.2</em>. Long version takes a whole screen — coming in v2." }]),
    "Undo":                    () => runMini([{ type: "agent", text: "Undone. Profile is back to where it was." }]),
    "Not yet":                 () => runMini([{ type: "agent", text: "OK, I'll hold off." }]),
  };

  function renderSuggestions(items) {
    const wrap = el("div", { class: "suggestions" });
    items.forEach(label => {
      wrap.appendChild(el("button", {
        class: "chip chip--suggestion",
        type: "button",
        onclick: () => {
          const action = SUGGESTION_ACTIONS[label];
          if (action) {
            renderUser(label);
            scrollChatToBottom();
            setTimeout(action, 420);
          } else {
            submitUserText(label);
          }
        },
      }, [label]));
    });
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble", style: "background:transparent;padding:0" }, [wrap]),
    ]);
    chat.appendChild(row);
    return row;
  }

  function taskNode(t) {
    const cover = el("div", { class: "task__cover" + (t.state === "fail" ? " task__cover--fail" : (t.state === "generating" ? " task__cover--loading" : "")) });
    if (t.state === "fail") cover.textContent = "✕";
    else if (t.cover) cover.appendChild(el("img", { src: COVERS[t.cover], alt: "" }));

    const sub = el("span", {}, [t.sub || ""]);
    const stateLine = el("div", { class: "task__state" }, [sub]);
    const body = el("div", { class: "task__body" }, [
      el("div", { class: "task__title" }, [t.title]),
      stateLine,
    ]);
    if (t.state === "generating") {
      body.appendChild(el("div", { class: "task__bar" }, [
        el("i", { style: `width:${t.progress || 0}%` }),
      ]));
    }
    if (t.cta && t.cta.length) {
      body.appendChild(buildTaskCta(t.cta, t.id));
    }
    return el("div", {
      class: `task task--${t.state || "idle"}`,
      "data-task-id": t.id,
      "data-task-title": t.title,
      "data-task-cover": t.cover || "",
    }, [cover, body]);
  }

  function buildTaskCta(labels, taskId) {
    const cta = el("div", { class: "task__cta" });
    labels.forEach((label, i) => {
      const cls = label === "Retry" ? "btn btn--primary" :
                  label === "Publish" ? "btn btn--primary" :
                  label === "Delete" ? "btn btn--ghost" :
                  i === 0 ? "btn btn--primary" : "btn";
      const btn = el("button", { class: cls, type: "button" }, [label]);
      btn.addEventListener("click", () => handleTaskCta(taskId, label, btn));
      cta.appendChild(btn);
    });
    return cta;
  }

  function renderTaskList(spec) {
    const head = el("div", { class: "task-list__head" }, [spec.title || "In progress"]);
    const list = el("div", { class: "task-list", "data-tl-id": spec.id }, [head]);
    spec.tasks.forEach(t => list.appendChild(taskNode(t)));
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [list]),
    ]);
    chat.appendChild(row);
    return row;
  }

  function updateTaskProgress(taskId, patch) {
    const node = chat.querySelector(`.task[data-task-id="${taskId}"]`);
    if (!node) return;
    if (patch.progress != null) {
      const bar = node.querySelector(".task__bar > i");
      if (bar) bar.style.width = `${patch.progress}%`;
    }
    if (patch.sub != null) {
      const sub = node.querySelector(".task__state > span");
      if (sub) sub.textContent = patch.sub;
    }
    if (patch.state) {
      node.className = `task task--${patch.state}`;
    }
    if (patch.cover) {
      const cov = node.querySelector(".task__cover");
      cov.classList.remove("task__cover--loading", "task__cover--fail");
      cov.textContent = "";
      cov.appendChild(el("img", { src: COVERS[patch.cover], alt: "" }));
      node.setAttribute("data-task-cover", patch.cover);
    }
    if (patch.cta) {
      const oldBar = node.querySelector(".task__bar");
      if (oldBar) oldBar.remove();
      const oldCta = node.querySelector(".task__cta");
      if (oldCta) oldCta.remove();
      node.querySelector(".task__body").appendChild(buildTaskCta(patch.cta, taskId));
    }
  }

  function renderInsight(spec) {
    const stats = el("div", { class: "insight__stat" });
    spec.stats.forEach(s => {
      stats.appendChild(el("div", {}, [
        el("div", { class: "val" }, [s.val]),
        el("div", { class: "lbl" }, [s.lbl]),
        s.delta ? el("div", { class: "delta" }, [s.delta]) : null,
      ]));
    });
    const bars = el("div", { class: "bars" });
    const max = Math.max(...spec.bars);
    spec.bars.forEach((v, i) => {
      const ratio = Math.max(0.05, v / max);
      bars.appendChild(el("i", { style: `height:${ratio * 100}%; animation-delay:${i * 40}ms;` }));
    });
    const card = el("div", { class: "insight" }, [
      el("div", { class: "insight__head" }, [spec.head || "Reading Log · 12 days"]),
      stats,
      bars,
      el("div", { class: "bars__legend" }, [
        el("span", {}, ["Mon"]),
        el("span", {}, ["Yesterday ↗"]),
      ]),
    ]);
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [card]),
    ]);
    chat.appendChild(row);
    return row;
  }

  function renderFeed(spec) {
    const grid = el("div", { class: "feed__grid" });
    spec.items.forEach(it => {
      const tile = el("div", { class: "feed__tile", "data-cover": it.cover, "data-title": it.title }, [
        el("img", { src: COVERS[it.cover], alt: it.title }),
        el("span", {}, [
          document.createTextNode(it.title),
          it.score ? el("em", {}, [it.score]) : null,
        ].filter(Boolean)),
      ]);
      tile.addEventListener("click", () => openFeedView(it.cover, it.title, "by you"));
      grid.appendChild(tile);
    });
    const tagClass = spec.tag === "personal" ? "feed__tag feed__tag--personal" : "feed__tag feed__tag--generic";
    const head = el("div", { class: "feed__head" }, [
      el("span", {}, [spec.title]),
      el("span", { class: tagClass }, [spec.tag === "personal" ? "Profile" : "Global rule"]),
    ]);
    const feed = el("div", { class: "feed" }, [head, grid]);
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [feed]),
    ]);
    chat.appendChild(row);
    return row;
  }

  function renderWhyCard(text) {
    const card = el("div", { class: "why-this", html: text });
    card.style.cursor = "pointer";
    card.addEventListener("click", () => submitUserText("Why this?"));
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble", style: "padding:0; background:transparent" }, [card]),
    ]);
    chat.appendChild(row);
    return row;
  }

  // =========================================================================
  // Scenario runner (chip-driven canonical replay)
  // =========================================================================

  let runToken = 0;

  async function runScenario(key) {
    runToken += 1;
    const myToken = runToken;
    chat.innerHTML = "";
    closeLightbox();
    closeFeedView();
    awaitingCreateTopic = false;

    const scenario = SCENARIOS[key];
    subEl.textContent = scenario.title;
    legendTitle.textContent = scenario.title;
    legendBody.textContent = scenario.blurb;
    legendCaps.innerHTML = "";
    scenario.caps.forEach(c => legendCaps.appendChild(el("li", { "data-cap": c }, [c])));
    if (typeof updateTourLabel === "function") updateTourLabel();

    for (const step of scenario.steps) {
      if (myToken !== runToken) return;
      try { await runStep(step); } catch (e) { console.warn("step error", e); }
    }
  }

  async function runMini(steps) {
    runToken += 1;
    const myToken = runToken;
    for (const step of steps) {
      if (myToken !== runToken) return;
      try { await runStep(step); } catch (e) { console.warn(e); }
    }
  }

  async function runStep(step) {
    switch (step.type) {
      case "wait":  return sleep(step.ms);
      case "agent": {
        const t = typingBubble();
        chat.appendChild(t);
        scrollChatToBottom();
        await sleep(360 + Math.min(step.text.length * 5, 600));
        t.remove();
        renderAgent(step.text, step);
        scrollChatToBottom();
        return;
      }
      case "user":         renderUser(step.text);       scrollChatToBottom(); return;
      case "system":       renderSystem(step.text);     scrollChatToBottom(); return;
      case "suggestions":  renderSuggestions(step.items); scrollChatToBottom(); return;
      case "tasklist":     renderTaskList(step);        scrollChatToBottom(); return;
      case "progress":     updateTaskProgress(step.taskId, step); return;
      case "insight":      renderInsight(step);         scrollChatToBottom(); return;
      case "feed":         renderFeed(step);            scrollChatToBottom(); return;
      case "why-card":     renderWhyCard(step.text);    scrollChatToBottom(); return;
    }
  }

  // =========================================================================
  // Free-form input: classify + respond
  // =========================================================================

  const RX = {
    create:  /\b(start|new|make|create|begin|piece|build|做|新作品|游戏)\b/i,
    insight: /\b(how|stats|data|perform|reading|doing|yesterday|chart|number|表现|昨天|数据)\b/i,
    tune:    /\b(less|more|horror|noisy|tune|adjust|feed|recommend|权重|少看|多看)\b/i,
    why:     /\b(why|为什么|怎么)\b/i,
  };

  function classify(text) {
    const t = text.toLowerCase();
    if (RX.create.test(t))  return "create";
    if (RX.insight.test(t)) return "insight";
    if (RX.tune.test(t))    return "tune";
    if (RX.why.test(t))     return "why";
    return "deflect";
  }

  function extractTopic(text) {
    const m = text.match(/(?:about|on|for|关于)\s+([^\.\?\!,;]+)/i);
    if (m) {
      const words = m[1].trim().split(/\s+/).slice(0, 6).join(" ");
      return titleCase(words);
    }
    // Fallback: pull last noun-ish chunk
    const m2 = text.match(/(?:make|start|new|create|做|开)\s+(?:a\s+)?(?:piece\s+|game\s+)?([^\.\?\!,;]+)/i);
    if (m2) return titleCase(m2[1].trim().split(/\s+/).slice(0, 6).join(" "));
    return "Untitled piece";
  }
  function titleCase(s) {
    return s.replace(/\b\w/g, c => c.toUpperCase());
  }

  function randomCover() {
    return COVER_NAMES[Math.floor(Math.random() * COVER_NAMES.length)];
  }

  function uid() { return "t-" + Math.random().toString(36).slice(2, 8); }

  // True when Agent just asked "What's it about?" and is waiting for the
  // next user message to be the topic (v2.2 A1 "留 chat 内补全" path).
  let awaitingCreateTopic = false;

  async function startCreateTask(title) {
    const tid = uid();
    const cover = randomCover();
    await runMini([
      { type: "agent", text: `Good prompt. Spinning up <strong>${escapeHtml(title)}</strong>. Cover generating.` },
      { type: "tasklist", id: "tl-" + tid, title: "In progress", tasks: [
        { id: tid, title: title, state: "generating", progress: 12, sub: "Cover · 12%" },
      ]},
      { type: "wait", ms: 900 },
      { type: "progress", taskId: tid, progress: 48, sub: "Cover · 48%" },
      { type: "wait", ms: 900 },
      { type: "progress", taskId: tid, progress: 88, sub: "Cover · 88%" },
      { type: "wait", ms: 700 },
      { type: "progress", taskId: tid, progress: 100, sub: "Done", cover: cover, state: "ok", cta: ["Preview", "Publish"] },
      { type: "wait", ms: 500 },
      { type: "agent", text: `<strong>${escapeHtml(title)}</strong> is ready. Cover and first-screen video are queued for your eyes only until you publish.`, cta: ["Preview", "Publish"], ctaTaskId: tid },
    ]);
  }

  function hasSpecificTopic(text) {
    // Considered "specific" if user gave us a topic via "about X" / a
    // descriptive noun phrase, or just a content sentence (>= 3 words and
    // not just a bare create verb).
    if (/(?:about|on|关于)\s+\S+/i.test(text)) return true;
    const stripped = text.replace(/\b(start|new|make|create|begin|piece|build|做|新作品|游戏|a|an|the|some|something|please)\b/gi, "").trim();
    return stripped.split(/\s+/).filter(Boolean).length >= 1;
  }

  async function respondTo(text) {
    // Continuation: Agent asked "What's it about?" last turn; this message
    // is the topic.
    if (awaitingCreateTopic) {
      awaitingCreateTopic = false;
      const title = titleCase(text.replace(/[\.\?\!]+$/, "").trim().split(/\s+/).slice(0, 7).join(" "));
      return startCreateTask(title || "Untitled");
    }

    const intent = classify(text);
    if (intent === "create") {
      if (!hasSpecificTopic(text)) {
        awaitingCreateTopic = true;
        await runMini([
          { type: "agent", text: "What's it about? Give me a sentence — a mood, a scene, an opening line." },
        ]);
        return;
      }
      return startCreateTask(extractTopic(text));
    }
    if (intent === "insight") {
      // Determine which piece they asked about
      const piece = /reading/i.test(text) ? "Reading Log" :
                    /late.?night|decision/i.test(text) ? "Late-Night Decision" :
                    /mirror/i.test(text) ? "Mirror, Mirror" :
                    "your top piece";
      await runMini([
        { type: "agent", text: `<strong>${piece} · yesterday</strong>. 1,247 plays, average dwell <strong>2:18</strong> — 34% above last Wednesday.` },
        { type: "insight", head: `${piece} · 12 days`, stats: [
          { val: "1,247", lbl: "Plays", delta: "+34% w/w" },
          { val: "2:18",  lbl: "Avg dwell", delta: "Top in your library" },
          { val: "71%",   lbl: "Completion", delta: "+8 pp vs median" },
        ], bars: [22, 31, 26, 40, 35, 48, 52, 47, 55, 51, 49, 64] },
        { type: "wait", ms: 700 },
        { type: "agent", text: "Longest single session was <strong>11:02</strong> from @junning. Returned twice in 24h — high-confidence signal." },
      ]);
      return;
    }
    if (intent === "tune") {
      // Find what they want less/more of
      const lessMatch = text.match(/less\s+(\S+)|少看\s*(\S+)|少推\s*(\S+)/i);
      const moreMatch = text.match(/more\s+(\S+)|多看\s*(\S+)|多推\s*(\S+)/i);
      const topic = (lessMatch && (lessMatch[1] || lessMatch[2] || lessMatch[3])) ||
                    (moreMatch && (moreMatch[1] || moreMatch[2] || moreMatch[3])) ||
                    "that";
      const direction = lessMatch ? "down" : moreMatch ? "up" : "down";
      const value = direction === "up" ? "0.7" : "0.2";
      await runMini([
        { type: "agent", text: `Noted. <em>${escapeHtml(topic)}</em> weight in your profile is ${direction === "up" ? "up to" : "down to"} <strong>${value}</strong>. Saved long-term unless you tell me otherwise.` },
        { type: "suggestions", items: ["Undo", "Show my profile"] },
        { type: "wait", ms: 600 },
        { type: "why-card", text: "<strong>Why this?</strong> — tap any feed card to ask in context." },
      ]);
      return;
    }
    if (intent === "why") {
      await runMini([
        { type: "agent", text: "You watched three horror shorts to completion in early May — single-session, no skips. The model read that as strong signal. I've discounted it now." },
      ]);
      return;
    }
    // Deflect
    await runMini([
      { type: "agent", text: "I can kick off a new piece, look at how your work is doing, or shape your feed. Want one of those — or just describe what you have in mind?" },
      { type: "suggestions", items: ["Start a new piece", "How's my work doing?", "Adjust my feed"] },
    ]);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // =========================================================================
  // Composer wiring
  // =========================================================================

  function submitUserText(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    renderUser(trimmed);
    scrollChatToBottom();
    setTimeout(() => respondTo(trimmed), 480);
  }

  composerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = composerInput.value;
      composerInput.value = "";
      composerSend.disabled = true;
      submitUserText(text);
    }
  });
  composerInput.addEventListener("input", () => {
    composerSend.disabled = !composerInput.value.trim();
  });
  composerSend.addEventListener("click", () => {
    const text = composerInput.value;
    composerInput.value = "";
    composerSend.disabled = true;
    submitUserText(text);
  });

  // =========================================================================
  // Task CTA handlers
  // =========================================================================

  async function handleTaskCta(taskId, label, btn) {
    const node = chat.querySelector(`.task[data-task-id="${taskId}"]`);
    if (!node) return;
    const title = node.getAttribute("data-task-title") || "this piece";
    const cover = node.getAttribute("data-task-cover");

    if (label === "Preview") {
      openLightbox(cover, title);
      return;
    }
    if (label === "Publish") {
      node.classList.add("task--published");
      const sub = node.querySelector(".task__state > span");
      if (sub) sub.textContent = "Published · 2s ago";
      const cta = node.querySelector(".task__cta");
      if (cta) cta.remove();
      await sleep(280);
      // Run agent reply + render embedded "Now in Works" mini-card
      runToken += 1;
      const myToken = runToken;
      const t = typingBubble();
      chat.appendChild(t);
      scrollChatToBottom();
      await sleep(700);
      if (myToken !== runToken) return;
      t.remove();
      renderAgent(`<strong>${escapeHtml(title)}</strong> is live in your Works. Want me to drop it into the feed pool?`);
      renderWorksCard(cover || "late_night_decision", title);
      scrollChatToBottom();
      await sleep(300);
      renderSuggestions(["Push to feed", "Draft a caption", "Not yet"]);
      scrollChatToBottom();
      return;
    }
    if (label === "Retry") {
      // Cycle fail → generating → ok
      node.className = "task task--generating";
      const cov = node.querySelector(".task__cover");
      cov.classList.add("task__cover--loading");
      cov.classList.remove("task__cover--fail");
      cov.textContent = "";
      const sub = node.querySelector(".task__state > span");
      if (sub) sub.textContent = "Retrying · 12%";
      const oldCta = node.querySelector(".task__cta");
      if (oldCta) oldCta.remove();
      const body = node.querySelector(".task__body");
      const bar = el("div", { class: "task__bar" }, [el("i", { style: "width:12%" })]);
      body.appendChild(bar);
      await sleep(800);
      bar.firstChild.style.width = "55%";
      if (sub) sub.textContent = "Retrying · 55%";
      await sleep(900);
      bar.firstChild.style.width = "100%";
      if (sub) sub.textContent = "Done";
      const newCover = randomCover();
      node.setAttribute("data-task-cover", newCover);
      cov.classList.remove("task__cover--loading");
      cov.appendChild(el("img", { src: COVERS[newCover], alt: "" }));
      node.className = "task task--ok";
      bar.remove();
      body.appendChild(buildTaskCta(["Preview", "Publish"], taskId));
      runMini([{ type: "agent", text: "Retry worked. Cover is in." }]);
      return;
    }
    if (label === "Delete") {
      node.style.transition = "opacity .25s, transform .25s";
      node.style.opacity = "0";
      node.style.transform = "translateX(-20px)";
      await sleep(260);
      node.remove();
      return;
    }
    if (label === "Open") {
      openLightbox(cover || "rainy_konbini", title + " · detail");
      return;
    }
  }

  function bindAgentCtaBtn(btn, label, taskId) {
    btn.addEventListener("click", () => {
      if (taskId) handleTaskCta(taskId, label, btn);
      else if (label === "Draft a caption") {
        submitUserText("Draft a caption");
      } else if (label === "Not yet") {
        runMini([{ type: "agent", text: "OK, I'll hold off." }]);
      } else if (label === "Undo") {
        runMini([{ type: "agent", text: "Undone. Profile is back to where it was." }]);
      } else if (label === "Show my profile") {
        runMini([{ type: "agent", text: "Your consumption profile, short version: <em>moody narrative</em>, <em>late-night peak (12-2am)</em>, <em>slow pacing preferred</em>, <em>horror down to 0.2</em>. Long version takes a whole screen — coming in v2." }]);
      } else if (label === "Push to feed" || label === "Open my feed") {
        openFeedView("late_night_decision", "Late-Night Decision", "by you");
      } else if (label === "Less from this author") {
        runMini([{ type: "agent", text: "Noted. Author weight dropped — you'll see them less for the next 7 days unless you tell me otherwise." }]);
      } else if (label === "Same vibe, more please") {
        runMini([{ type: "agent", text: "Locked in. I'll bias your feed toward this mood for the next session." }]);
      }
    });
  }

  // =========================================================================
  // Lightbox (cover preview)
  // =========================================================================

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCap = $("#lightboxCap");
  const lightboxClose = $("#lightboxClose");

  function openLightbox(coverKey, title) {
    if (!coverKey) return;
    lightboxImg.src = COVERS[coverKey] || "";
    lightboxCap.textContent = title || "";
    lightbox.classList.add("is-open");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // =========================================================================
  // Feed view (faux AlterU Home / default screen — bridges Agent ↔ feed)
  // =========================================================================

  const feedView    = $("#feedView");
  const feedCover   = $("#feedCover");
  const feedTitle   = $("#feedTitle");
  const feedAuthor  = $("#feedAuthor");
  const feedBack    = $("#feedBack");
  const feedWhy     = $("#feedWhy");
  const feedNext    = $("#feedNext");

  // Pool of items the faux feed cycles through (Next button)
  const FEED_POOL = [
    { cover: "late_night_decision", title: "Late-Night Decision", author: "by you", score: "0.92", reason: "you're up past 1 AM and you make moody narrative pieces yourself" },
    { cover: "mirror_gaze",         title: "Mirror, Mirror",      author: "by Ava",  score: "0.87", reason: "themes overlap with your last two pieces" },
    { cover: "cafe_window",         title: "Coffee in Rain",      author: "by Ren",  score: "0.79", reason: "you finished two slow-paced titles this week" },
    { cover: "last_subway",         title: "Last Train Home",     author: "by Jin",  score: "0.74", reason: "Jin's last piece pulled an 11-min dwell from you" },
    { cover: "rainy_konbini",       title: "Konbini at 2 AM",     author: "by Sam",  score: "0.62", reason: "midnight ambient — your peak hours" },
    { cover: "reading_log",         title: "Reading Log",         author: "by you",  score: "0.55", reason: "your own work — you usually rewatch on day 2" },
  ];
  let feedCursor = 0;

  function openFeedView(coverKey, title, author) {
    // Find the pool item matching coverKey if present; else use given fields
    const idx = FEED_POOL.findIndex(it => it.cover === coverKey);
    if (idx >= 0) feedCursor = idx;
    const item = FEED_POOL[feedCursor];
    feedCover.src = COVERS[item.cover];
    feedTitle.textContent = title || item.title;
    feedAuthor.textContent = (author || item.author) + " · 6m";
    feedView.classList.add("is-open");
    feedView.setAttribute("aria-hidden", "false");
  }
  function closeFeedView() {
    feedView.classList.remove("is-open");
    feedView.setAttribute("aria-hidden", "true");
  }
  function feedAdvance() {
    feedCursor = (feedCursor + 1) % FEED_POOL.length;
    const item = FEED_POOL[feedCursor];
    feedCover.src = COVERS[item.cover];
    feedTitle.textContent = item.title;
    feedAuthor.textContent = item.author + " · 6m";
  }
  feedBack.addEventListener("click", closeFeedView);
  feedNext.addEventListener("click", feedAdvance);
  feedWhy.addEventListener("click", () => {
    const item = FEED_POOL[feedCursor];
    closeFeedView();
    setTimeout(() => {
      renderUser("Why this one?");
      scrollChatToBottom();
      setTimeout(() => {
        runMini([
          { type: "agent", text: `<strong>${escapeHtml(item.title)}</strong> ranked <strong>${item.score}</strong> in your profile because ${item.reason}. Want me to drop the weight on this one author, or this whole vibe?` },
          { type: "suggestions", items: ["Less from this author", "Same vibe, more please", "Show my profile"] },
        ]);
      }, 480);
    }, 280);
  });

  // =========================================================================
  // Works mini card (rendered after Publish — bridges Agent → Works module)
  // =========================================================================

  function renderWorksCard(newCover, newTitle) {
    const grid = el("div", { class: "works-card__grid" });
    // Fill 3 tiles: new + two existing works
    const existing = ["reading_log", "mirror_gaze"];
    const tiles = [
      { cover: newCover, title: newTitle, isNew: true },
      { cover: existing[0], title: "Reading Log" },
      { cover: existing[1], title: "Mirror, Mirror" },
    ];
    tiles.forEach(t => {
      const tile = el("div", { class: "works-card__tile" + (t.isNew ? " works-card__tile--new" : "") }, [
        el("img", { src: COVERS[t.cover], alt: t.title }),
      ]);
      tile.addEventListener("click", () => openFeedView(t.cover, t.title));
      grid.appendChild(tile);
    });
    const card = el("div", { class: "works-card" }, [
      el("div", { class: "works-card__head" }, [
        document.createTextNode("Now in your Works"),
        el("em", {}, ["3"]),
      ]),
      grid,
    ]);
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [card]),
    ]);
    chat.appendChild(row);
    return row;
  }

  // =========================================================================
  // Tour control (external "Next chapter" stepper)
  // =========================================================================

  const SCENARIO_ORDER = ["welcome", "create", "insight", "tune", "personalize"];
  const SCENARIO_TITLES = {
    welcome:     "Cold start",
    create:      "Creation hub",
    insight:     "Data lens",
    tune:        "Feed tuning",
    personalize: "Before / after",
  };
  const tourBackBtn = $("#tourBack");
  const tourNextBtn = $("#tourNext");
  const tourUpcoming = $("#tourUpcoming");

  function currentScenarioKey() {
    const active = document.querySelector(".chip--scenario.is-active");
    return active ? active.dataset.scenario : "welcome";
  }
  function updateTourLabel() {
    const cur = currentScenarioKey();
    const idx = SCENARIO_ORDER.indexOf(cur);
    const nextKey = SCENARIO_ORDER[(idx + 1) % SCENARIO_ORDER.length];
    tourUpcoming.textContent = SCENARIO_TITLES[nextKey];
  }
  function tourStep(direction) {
    const cur = currentScenarioKey();
    const idx = SCENARIO_ORDER.indexOf(cur);
    const next = direction === "back"
      ? (idx - 1 + SCENARIO_ORDER.length) % SCENARIO_ORDER.length
      : (idx + 1) % SCENARIO_ORDER.length;
    const key = SCENARIO_ORDER[next];
    document.querySelectorAll(".chip--scenario").forEach(b => {
      b.classList.toggle("is-active", b.dataset.scenario === key);
    });
    runScenario(key);
    updateTourLabel();
  }
  tourBackBtn.addEventListener("click", () => tourStep("back"));
  tourNextBtn.addEventListener("click", () => tourStep("next"));

  // =========================================================================
  // Scenario chips
  // =========================================================================

  document.querySelectorAll(".chip--scenario").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip--scenario").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      runScenario(btn.dataset.scenario);
    });
  });

  $("#restartBtn").addEventListener("click", () => {
    const active = document.querySelector(".chip--scenario.is-active");
    if (active) runScenario(active.dataset.scenario);
  });

  // Boot
  runScenario("welcome");
})();
