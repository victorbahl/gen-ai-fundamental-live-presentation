# CLAUDE.md — working rules for this deck

This is a living rulebook for the **GenAI Fundamentals** Slidev deck.
Every rule the user gives is recorded here and must be respected on every slide.

## Project

- Slidev deck: "Compute → Reason → Act" — a visual, interactive intro to Generative AI.
  Audience: technical MuleSoft Solution Engineers (API management, integration, AI gateway).
  Fil rouge: Compute → Reason → Act (history → LLM → agents). ~45 min, English. Neutral/unbranded.
  Running example for demos: "order status across systems".
- Entry point: `slides.md`. Custom components in `components/` (auto-imported).
- Global theme/tokens in `styles/index.css`.
- Run: `npm run dev` (the dev server must run outside the sandbox — it binds a port).

## Deck structure (20 slides)

Cover · Roadmap · **I** Part-opener / Timeline / "Prediction→reasoning" ·
**II** Part-opener / NextTokenPredictor / ContextWindow / "remembers nothing" /
StatelessReplay (hero) / "no memory" payoff · **III** Part-opener / Tools flow /
McpEnvelope / MCP Mermaid sequence · **IV** Part-opener / AgentLoop / Anatomy of an agent /
A2A · Close.

Components: `Hero.vue` (Archetype A), `Timeline.vue`, `NextTokenPredictor.vue`,
`ContextWindow.vue`, `StatelessReplay.vue`, `McpEnvelope.vue`, `AgentLoop.vue`.

## Status (as of session end, 2026-06-16)

- All slides + components written; **production build compiles clean** (`slidev build`).
- **Just fixed 3 rendering bugs** (see Lessons #1–3). **NOT yet visually verified** — next
  session should confirm rendering (screenshot or user refresh) BEFORE claiming success.
- Open / not done: visual QA pass; PDF/PPTX export (needs `playwright-chromium`, whose
  browser download is sandbox-blocked — install to project `./.pw-browsers` with sandbox off);
  polish pass (pacing, spacing, the timeline above/below-axis layout at real resolution).
- The 7 hero backgrounds are gradient placeholders; drop real photos at `public/img/cover.jpg`,
  `part-1.jpg`, `part-2.jpg`, `part-2b.jpg`, `part-3.jpg`, `part-4.jpg`, `close.jpg`.
- Before presenting: set `--photo-tag-display: none` in `styles/index.css` to hide photo tags.

## Engineering lessons (do NOT repeat these)

1. **Never use `layout: none` for themed slides.** Slidev's `none` layout is bare
   `<div><slot/></div>` with NO `.slidev-layout` class. Our theme (bg, text colour, fonts) is
   scoped to `.slidev-layout`, so `none` slides render UNSTYLED. Use `layout: default` (it adds
   `.slidev-layout`). Full-bleed stages still work: make them `position:absolute; inset:0` so
   they ignore the layout's `px-14 py-10` padding. `.slidev-page` is `position:relative`, so
   absolute `inset:0` children fill the slide correctly.

2. **Keep shared CSS global, not in per-slide `<style>`.** Structural classes used by many
   slides (`.stage`, `.demo-stage`, `.demo-head`, `.title-row`, `.spine/.step`…) belong in
   `styles/index.css`. A per-slide `<style>` block is scoped to THAT slide only; copying a deck
   then dropping the block silently un-styles every other slide that used those classes.

3. **A component that reads `$clicks` needs the slide to declare `clicks: N`.** Slidev sets the
   click total from markdown `v-click` directives OR a frontmatter `clicks:` override
   (`useClicks.ts` → `clicksTotalOverrides`). If a component (e.g. `Timeline.vue`) drives its own
   reveals off `$clicks` but the slide has no `v-click` and no `clicks:`, the total is too low and
   only the first step shows. Always set `clicks:` to the component's step count.

4. **A clean `slidev build` / HTTP 200 does NOT mean it renders correctly.** Build only proves it
   compiles; layout/CSS/click bugs pass the build. Verify rendering visually (screenshot the
   running deck, or have the user refresh) before claiming a fix works. Do not report success off
   build status alone.

5. **Dev-server hot-reload corrupts when files are deleted/renamed while it runs.** Vite caches a
   broken reference (e.g. to a deleted component) and 404s every importing slide. Fix: kill the
   server, `rm -rf node_modules/.vite`, relaunch, and hard-refresh the browser.

6. **Sandbox notes.** The dev server can't bind a port in-sandbox (`listen EPERM`) — run it with
   the sandbox disabled. `npm` cache hits EPERM too — use `--cache "$TMPDIR/npm-cache"`.
   `playwright-chromium`'s post-install browser download is blocked — set
   `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` to install the package, and install the browser separately
   into a writable path (`PLAYWRIGHT_BROWSERS_PATH=./.pw-browsers`) with sandbox off.

## Rules (newest at the bottom)

1. **Language.** The user writes/comments in French. **All deliverables stay in English** —
   slides, speaker notes, code, comments, and this file.

2. **Background photos = placeholders.** Never bake in a chosen photo. Hero/section slides
   show a neutral **placeholder** background; the user drops their own photo later.
   - Convention: each hero references a file under `public/img/` (e.g. `cover.jpg`,
     `part-2.jpg`). If the file is absent, a tasteful gradient placeholder shows. Drop the
     file at that path and the photo appears automatically — no code change needed.
   - A faint corner tag names the expected filename so the user knows where each photo goes.

3. **No background block behind text.** Text on a photo/hero must sit **directly** on the
   image — no scrim, veil, or panel behind the text. Use **`text-shadow`** for legibility.

4. **Build-up slides must not move.** Think of a **physical page**: each click adds something
   *on top*, and the addition **never displaces** existing elements. Concretely:
   - Every element owns a **fixed slot** from the start (fixed-size canvas, CSS grid or
     absolute positioning). Reveals only toggle **opacity** — never insert/reflow.
   - **Nothing overflows the slide edges**, at any click step.
   - The slide **often starts empty** (or near-empty) and fills in.
   - Avoid `layout: center` for build-ups (it re-centers as content appears).

5. **No on-slide "API analogy" callout.** Drop the 🔌 emoji/badge linking concepts to APIs —
   it adds nothing on the slide. (Brief API parallels may stay in *speaker notes* only.)
