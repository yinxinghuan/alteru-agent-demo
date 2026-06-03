# AlterU Agent — Demo

Interactive sketch of the in-app conversational Agent described in the
**v2.2 design doc**: a creation hub, a data lens, a feed-personalisation
engine and a connection scout — all behind a single standard chat UI.

[**Live demo →**](https://yinxinghuan.github.io/alteru-agent-demo/)

## What's in it

Pick a scenario from the chip strip inside the phone — the chat replays
one capability domain at a time:

| Chip       | Capability domain      | What it shows                                                                     |
|------------|------------------------|-----------------------------------------------------------------------------------|
| Welcome    | Cold start             | First-time entry, welcome line, three suggestion chips. No forced setup.          |
| Create     | A1 / A2 / A4           | Natural-language kick-off, live task list with progress, completion notification. |
| Insight    | B · Data lens          | Tool-use answer grounded in real platform stats, with stat cards and bar chart.   |
| Tune       | D2 · Feed tuning       | Conversational adjustments to feed; profile transparency; "Why this?" entry.      |
| Compare    | D1 · Before / after    | Same recommendation pool, ranked by Agent's user-profile signal.                  |

## APIs exercised

| Surface                  | Endpoint                                    | When                  |
|--------------------------|---------------------------------------------|-----------------------|
| Task & feed thumbnails   | `aiservice.wdabuliu.com:8019/genl_image`    | Build time            |
| Brand assets             | `/Users/yin/AlterU_logo_concepts/`          | Build time            |

All 6 cover images in `assets/covers/` are real outputs of the platform
text-to-image API — see `scripts/gen_covers.py`.

The chat itself is scripted: every Agent line, task state, and feed
ranking is deterministic, which makes the demo self-contained and
shareable as a static page.

## Brand

Canonical AlterU v2:

- **Pink** `#F5B1C7` (curl mark, brand accents)
- **Purple-play** `#7700A1` (primary CTA)
- **Black** `#000000` (Dark surface)
- **Montserrat** (display) + **Inter** (body)
- Emblem: curl + star (pink U on dark surfaces)

## Run locally

```bash
python3 -m http.server 4173
open http://localhost:4173/
```

## Regenerate covers

```bash
~/miniconda3/bin/python3 scripts/gen_covers.py
```

Existing covers are skipped; delete `assets/covers/*.jpg` to refresh.

## Layout

```
index.html             — single page, phone frame + chat + scenario picker
assets/
  styles.css           — dark theme, brand tokens, phone chrome
  app.js               — scenario library + DOM renderer
  emblem.svg           — pink U + white star (dark-bg variant)
  watermark.svg        — alteru.svg (decorative)
  wordmark.svg         — full AlterU wordmark (unused on this page)
  loader.svg           — loading animation (unused on this page)
  covers/              — 6 AI-generated thumbnails (jpg)
scripts/
  gen_covers.py        — wdabuliu API client (txt2img + sips compress)
```

## Design doc

See `AlterU Agent v2.md` (kept outside this repo).
