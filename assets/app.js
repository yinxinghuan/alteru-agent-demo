/* AlterU Agent — interactive demo
 *
 * Scripted scenarios that exercise each capability domain from the v2.2
 * design doc.  All chat content is deterministic; the only "live" parts
 * are the build-time-generated AlterU cover thumbnails (real wdabuliu
 * image API calls baked into /assets/covers/).
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

  const EMBLEM = "assets/emblem.svg";

  // ---------- Scenario library ---------------------------------------------

  const SCENARIOS = {
    welcome: {
      title: "Cold start",
      blurb: "First-time entry into the Agent. A welcome line and three suggestion chips — no forced configuration.",
      caps: ["Cold start", "Suggestion chips"],
      steps: [
        { type: "wait", ms: 500 },
        { type: "agent", text: "<strong>Hi.</strong> I'm AlterU Agent." },
        { type: "wait", ms: 700 },
        { type: "agent", text: "I can do three things for you today: start a new piece, look at how your work is doing, and shape the feed you see. Pick one — or just tell me what you want." },
        { type: "wait", ms: 600 },
        { type: "suggestions", items: [
          "Start a new piece",
          "How's my work doing?",
          "Adjust my feed",
        ]},
      ],
    },

    create: {
      title: "Creation hub",
      blurb: "A1 → A2 → A4. Natural-language kick-off, progress visible in chat, completion notification arrives without leaving the conversation.",
      caps: ["A1 kick-off", "A2 task list", "A4 completion"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Want to pick up where you left off, or start fresh?" },
        { type: "wait", ms: 800 },
        { type: "user", text: "make a piece about the decision at 3 AM" },
        { type: "wait", ms: 600 },
        { type: "agent", text: "Good prompt. Spinning it up — <strong>Late-Night Decision</strong>. Cover generating, first-screen video queued." },
        { type: "tasklist", id: "tl1", title: "In progress", tasks: [
          { id: "t1", title: "Late-Night Decision", cover: "late_night_decision", state: "generating", progress: 14, sub: "Cover · 14%" },
          { id: "t2", title: "Reading Log", cover: "reading_log", state: "ok", sub: "First-screen video ready" , cta: ["Preview", "Publish"] },
          { id: "t3", title: "Y", state: "fail", sub: "OSS upload timeout · attempt 1/3", cta: ["Retry", "Open", "Delete"] },
        ]},
        { type: "wait", ms: 1100 },
        { type: "progress", taskId: "t1", progress: 38, sub: "Cover · 38%" },
        { type: "wait", ms: 1100 },
        { type: "progress", taskId: "t1", progress: 71, sub: "Cover · 71%" },
        { type: "wait", ms: 900 },
        { type: "progress", taskId: "t1", progress: 100, sub: "Done", cover: "late_night_decision", state: "ok", cta: ["Preview", "Publish"] },
        { type: "wait", ms: 700 },
        { type: "system", text: "1 new" },
        { type: "agent", text: "<strong>Late-Night Decision</strong> is ready. Cover and first-screen video are queued for your eyes only until you publish.", cta: ["Preview", "Publish"] },
      ],
    },

    insight: {
      title: "Data lens",
      blurb: "B · ask in natural language, get a tool-use answer grounded in real platform stats.",
      caps: ["B data insight", "Tool use"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "What do you want to know?" },
        { type: "wait", ms: 700 },
        { type: "user", text: "how did Reading Log do yesterday?" },
        { type: "wait", ms: 1000 },
        { type: "agent", text: "<strong>Reading Log · yesterday</strong>. 1,247 plays, average dwell <strong>2:18</strong> — that's 34% above last Wednesday." },
        { type: "insight", stats: [
          { val: "1,247", lbl: "Plays", delta: "+34% w/w" },
          { val: "2:18", lbl: "Avg dwell", delta: "Top in your library" },
          { val: "71%", lbl: "Completion", delta: "+8 pp vs median" },
        ], bars: [22, 31, 26, 40, 35, 48, 52, 47, 55, 51, 49, 64] },
        { type: "wait", ms: 800 },
        { type: "agent", text: "Longest single session was <strong>11:02</strong> from @junning. They came back twice more in the next 24h — that's the kind of signal I'd weight high in your feed." },
      ],
    },

    tune: {
      title: "Feed tuning",
      blurb: "D2 · conversational adjustments to a feed that's already personalised. Agent acknowledges, explains, and writes the change into the long-term profile.",
      caps: ["D2 tune", "Profile transparency", "Why this"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Tell me what you want more or less of." },
        { type: "wait", ms: 700 },
        { type: "user", text: "less horror in my feed" },
        { type: "wait", ms: 900 },
        { type: "agent", text: "Noted. <em>Horror</em> weight in your profile is down to <strong>0.2</strong>. You won't see horror in the next 24h, and the preference is saved long-term unless you tell me otherwise." },
        { type: "suggestions", items: ["Undo", "Show my profile"] },
        { type: "wait", ms: 1200 },
        { type: "user", text: "why was it pushing so much horror?" },
        { type: "wait", ms: 900 },
        { type: "agent", text: "You watched three horror shorts to completion in early May. The model read that as a strong signal — single-session, no skips. I've discounted it now." },
        { type: "wait", ms: 700 },
        { type: "why-this", text: "Tap <strong>Why this?</strong> on any feed card to ask in context — opens the chat with that card pre-quoted." },
      ],
    },

    personalize: {
      title: "Before / after",
      blurb: "D1 · the same recommendation pool, ranked by Agent's user-profile signal. The UI doesn't change — only the order does.",
      caps: ["D1 profile", "Same pool, different rank"],
      steps: [
        { type: "wait", ms: 400 },
        { type: "agent", text: "Here's what your feed looked like before the profile kicked in. Global rule, everybody saw the same mix." },
        { type: "feed", tag: "generic", title: "Feed · v0 (global rule)", items: [
          { cover: "rainy_konbini", title: "Konbini at 2 AM", score: null },
          { cover: "reading_log",   title: "Reading Log",    score: null },
          { cover: "cafe_window",   title: "Coffee in Rain", score: null },
          { cover: "mirror_gaze",   title: "Mirror, Mirror", score: null },
        ]},
        { type: "wait", ms: 1100 },
        { type: "agent", text: "And here's what it looks like once the profile sees what you've been making and when you've been awake. Same pool — different rank." },
        { type: "feed", tag: "personal", title: "Feed · v1 (profile)", items: [
          { cover: "late_night_decision", title: "Late-Night Decision", score: "0.92" },
          { cover: "mirror_gaze",         title: "Mirror, Mirror",      score: "0.87" },
          { cover: "cafe_window",         title: "Coffee in Rain",      score: "0.79" },
          { cover: "last_subway",         title: "Last Train Home",     score: "0.74" },
        ]},
        { type: "wait", ms: 800 },
        { type: "agent", text: "You make moody narrative pieces, you're awake past 1 AM, and you finished two slow-paced titles this week. That's the signal — not a global rule." },
      ],
    },
  };

  // ---------- DOM helpers ---------------------------------------------------

  const $ = (sel) => document.querySelector(sel);
  const chat = $("#chat");
  const subEl = $("#appBarSub");
  const legendTitle = $("#legendTitle");
  const legendBody  = $("#legendBody");
  const legendCaps  = $("#legendCaps");
  const composerHint = $("#composerHint");

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
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
    });
  }

  function avatarNode() {
    return el("div", { class: "msg__avatar" }, [
      el("img", { src: EMBLEM, alt: "" }),
    ]);
  }

  function bubble(kind, html) {
    const b = el("div", { class: "msg__bubble", html });
    const row = el("div", { class: `msg msg--${kind}` });
    if (kind === "agent") row.appendChild(avatarNode());
    row.appendChild(b);
    return { row, bubble: b };
  }

  function typingBubble() {
    const dots = el("div", { class: "typing" }, [
      el("span"), el("span"), el("span"),
    ]);
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble" }, [dots]),
    ]);
    return row;
  }

  // ---------- Renderers per step type --------------------------------------

  function renderAgent(text, cta) {
    const { row, bubble: b } = bubble("agent", text);
    if (cta && cta.length) {
      const wrap = el("div", { class: "task__cta", style: "margin-top:10px" });
      cta.forEach((label, i) => {
        wrap.appendChild(el("button", {
          class: i === 0 ? "btn btn--primary" : "btn",
          type: "button",
        }, [label]));
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

  function renderSuggestions(items) {
    const wrap = el("div", { class: "suggestions" });
    items.forEach(label => {
      wrap.appendChild(el("button", {
        class: "chip chip--suggestion",
        type: "button",
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
    if (t.state === "fail") cover.textContent = "✕"; // simple glyph, not emoji
    else if (t.cover) cover.appendChild(el("img", { src: COVERS[t.cover], alt: "" }));

    const stateDot = el("span", {}, [t.sub || ""]);
    const stateLine = el("div", { class: "task__state" }, [stateDot]);

    const body = el("div", { class: "task__body" }, [
      el("div", { class: "task__title" }, [t.title]),
      stateLine,
    ]);

    if (t.state === "generating") {
      const bar = el("div", { class: "task__bar" }, [
        el("i", { style: `width:${t.progress || 0}%` }),
      ]);
      body.appendChild(bar);
    }

    if (t.cta && t.cta.length) {
      const cta = el("div", { class: "task__cta" });
      t.cta.forEach((label, i) => {
        const cls = i === 0 && t.state !== "fail" ? "btn btn--primary" :
                    label === "Delete" ? "btn btn--ghost" : "btn";
        cta.appendChild(el("button", { class: cls, type: "button" }, [label]));
      });
      body.appendChild(cta);
    }

    const node = el("div", {
      class: `task task--${t.state || "idle"}`,
      "data-task-id": t.id,
    }, [cover, body]);
    return node;
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
      cov.innerHTML = "";
      cov.appendChild(el("img", { src: COVERS[patch.cover], alt: "" }));
    }
    if (patch.cta) {
      // Remove old bar/cta, add new cta
      const oldBar = node.querySelector(".task__bar");
      if (oldBar) oldBar.remove();
      const oldCta = node.querySelector(".task__cta");
      if (oldCta) oldCta.remove();
      const cta = el("div", { class: "task__cta" });
      patch.cta.forEach((label, i) => {
        cta.appendChild(el("button", {
          class: i === 0 ? "btn btn--primary" : "btn",
          type: "button",
        }, [label]));
      });
      node.querySelector(".task__body").appendChild(cta);
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
      const bi = el("i", { style: `height:${ratio * 100}%; animation-delay:${i * 40}ms;` });
      bars.appendChild(bi);
    });
    const legend = el("div", { class: "bars__legend" }, [
      el("span", {}, ["Mon"]),
      el("span", {}, ["Yesterday ↗"]),
    ]);

    const card = el("div", { class: "insight" }, [
      el("div", { class: "insight__head" }, ["Reading Log · 12 days"]),
      stats,
      bars,
      legend,
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
      const tile = el("div", { class: "feed__tile" }, [
        el("img", { src: COVERS[it.cover], alt: it.title }),
        el("span", {}, [
          document.createTextNode(it.title),
          it.score ? el("em", {}, [it.score]) : null,
        ].filter(Boolean)),
      ]);
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

  function renderWhyThis(spec) {
    const card = el("div", { class: "why-this", html: spec.text });
    const row = el("div", { class: "msg msg--agent" }, [
      avatarNode(),
      el("div", { class: "msg__bubble", style: "padding:0; background:transparent" }, [card]),
    ]);
    chat.appendChild(row);
    return row;
  }

  // ---------- Scenario runner ----------------------------------------------

  let runToken = 0;
  let isRunning = false;

  function sleep(ms, token) {
    return new Promise(resolve => {
      const t = setTimeout(() => resolve(), ms);
      // Cancellation: tokens are checked between steps anyway.
      if (token != null) {
        // No-op; we check runToken in the runner loop.
      }
    });
  }

  async function runScenario(key) {
    runToken += 1;
    const myToken = runToken;
    isRunning = true;
    chat.innerHTML = "";
    composerHint.textContent = `Replaying: ${SCENARIOS[key].title}…`;

    const scenario = SCENARIOS[key];
    subEl.textContent = scenario.title;
    legendTitle.textContent = scenario.title;
    legendBody.textContent = scenario.blurb;
    legendCaps.innerHTML = "";
    scenario.caps.forEach(c => legendCaps.appendChild(el("li", { "data-cap": c }, [c])));

    for (const step of scenario.steps) {
      if (myToken !== runToken) return; // cancelled by user
      try {
        await runStep(step);
      } catch (e) {
        console.warn("step error", e);
      }
    }

    isRunning = false;
    if (myToken === runToken) {
      composerHint.textContent = "Pick another scenario above to replay";
    }
  }

  async function runStep(step) {
    switch (step.type) {
      case "wait":
        await sleep(step.ms);
        return;
      case "agent": {
        // Typing indicator first
        const t = typingBubble();
        chat.appendChild(t);
        scrollChatToBottom();
        await sleep(420 + Math.min(step.text.length * 6, 700));
        t.remove();
        renderAgent(step.text, step.cta);
        scrollChatToBottom();
        return;
      }
      case "user":
        renderUser(step.text);
        scrollChatToBottom();
        return;
      case "system":
        renderSystem(step.text);
        scrollChatToBottom();
        return;
      case "suggestions":
        renderSuggestions(step.items);
        scrollChatToBottom();
        return;
      case "tasklist":
        renderTaskList(step);
        scrollChatToBottom();
        return;
      case "progress":
        updateTaskProgress(step.taskId, step);
        return;
      case "insight":
        renderInsight(step);
        scrollChatToBottom();
        return;
      case "feed":
        renderFeed(step);
        scrollChatToBottom();
        return;
      case "why-this":
        renderWhyThis(step);
        scrollChatToBottom();
        return;
    }
  }

  // ---------- Wire up scenario chips ---------------------------------------

  document.querySelectorAll(".chip--scenario").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip--scenario").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const key = btn.dataset.scenario;
      runScenario(key);
    });
  });

  $("#restartBtn").addEventListener("click", () => {
    const active = document.querySelector(".chip--scenario.is-active");
    if (active) runScenario(active.dataset.scenario);
  });

  // ---------- Boot ----------------------------------------------------------

  runScenario("welcome");
})();
