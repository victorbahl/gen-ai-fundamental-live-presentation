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
**II** Part-opener / NextTokenPredictor / AttentionFlip / ContextWindow / "remembers nothing" /
StatelessReplay (hero) / "no memory" payoff · **III** Part-opener / Tools flow /
McpEnvelope / MCP Mermaid sequence · **IV** Part-opener / AgentLoop / Anatomy of an agent /
A2A · Close.

Components: `Hero.vue` (Archetype A), `Timeline.vue`, `NextTokenPredictor.vue`,
`AttentionFlip.vue`, `ContextWindow.vue`, `StatelessReplay.vue`, `McpEnvelope.vue`,
`AgentLoop.vue`.

## Status (as of session end, 2026-06-16)

- All slides + components written; **production build compiles clean** (`slidev build`).
- **Part II reworked this session.** `NextTokenPredictor.vue` was rebuilt from scratch into the
  "pipeline" design (FT-inspired — see ig.ft.com/generative-ai): prompt shown as an input field →
  **tokenise** into sub-word chips → each token → a **column of numbers** → a **grid of weights**
  (real signed values printed in cells, one-shot compute sweep) → **equalizer bars** for the
  next-token distribution (unsorted, warm winner in the MIDDLE) → **loops** through "MuleSoft", ",",
  "obviously" (7 clicks; sweep replays each pass; blinking caret throughout). Several alternative
  explorations (mesh/map/grid/features/spectrum) were built to compare, then **deleted** once this
  design was chosen — do not resurrect them. Running prompt is now "The best Salesforce acquisition
  is" (shortened from the old 8-word version).
- New `AttentionFlip.vue` slide added (FT "bank" idea: same word, two sentences, attention arcs
  draw to the neighbours that fix its meaning). Marked optional in its speaker notes.
- **NOT yet visually verified** — the pipeline is wide (1100-unit viewBox); next session should
  confirm rendering (user refresh / screenshot) BEFORE claiming success, esp. the prompt line not
  overflowing, the numbers grid spacing, and the right-edge bars not clipping.
- Open / not done: visual QA pass; a planned "v2" polish of `NextTokenPredictor.vue`; PDF/PPTX
  export (needs `playwright-chromium`, whose browser download is sandbox-blocked — install to
  project `./.pw-browsers` with sandbox off); the timeline above/below-axis layout at real res.
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

7. **Never put `v-if` and `v-for` on the SAME element (Vue 3).** Vue 3 evaluates `v-if` BEFORE
   `v-for`, so the loop variable doesn't exist yet — `v-if="p.label"` throws
   `Cannot read properties of undefined`. This crash is invisible to `slidev build` (it compiles)
   but breaks the slide at runtime in the browser. Fix: precompute the filtered list in `<script>`
   (`const labelled = items.filter(p => p.label)`) and `v-for` over that.

8. **`Math.random()` / `Date.now()` are unavailable in some run contexts.** For decorative jitter
   (cell values, animation delays) use a deterministic pseudo-random seeded by index:
   `const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }`.
   Bonus: deterministic = stable across re-renders (no flicker).

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

6. **Animations: beat-driven, eased, one-shot — not ambient loops.** Motion should explain, like
   the FT explainer (ig.ft.com/generative-ai): each click triggers ONE eased, finite reveal — a
   line draws in (`stroke-dashoffset`), a point fades to its slot, a bar grows, a value appears.
   Use `cubic-bezier(0.22, 1, 0.36, 1)` ("settle into place") and stagger groups via
   `transition-delay`. AVOID infinite `animation: … infinite` ambient flow/pulse — it reads as
   decoration and distracts. (The blinking caret is the one allowed loop: it signals "generating".)
   To REPLAY a one-shot CSS animation on a later beat, bump a `:key` on the element so Vue remounts
   it (see the weight-sweep in `NextTokenPredictor.vue`). Still obeys Rule 4: things animate INTO
   their own reserved slot; nothing reflows.
