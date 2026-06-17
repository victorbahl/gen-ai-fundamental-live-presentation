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
McpEnvelope / MCP Mermaid sequence · **IV** Part-opener / AgentLoop / AgentContextWindow /
Anatomy of an agent / A2A · Close.

Components: `Hero.vue` (Archetype A), `Timeline.vue`, `NextTokenPredictor.vue`,
`AttentionFlip.vue`, `ContextWindow.vue`, `AgentContextWindow.vue`, `StatelessReplay.vue`,
`McpEnvelope.vue`, `McpHandshake.vue`, `AgentLoop.vue`.

`McpEnvelope.vue` + `McpHandshake.vue` are the Part-III MCP pair. The envelope slide shows REST
(left) vs MCP server (right) as TWO HTTP requests with the SAME Bearer auth and JSON content type —
the only difference is the body (REST = intent in URL; MCP = a JSON-RPC `tools/call` object). Beat 3
drops the payoff band: "it's just HTTP, so our gateway policies (OAuth / rate-limit / audit / WAF)
wrap it unchanged." The handshake slide (replaced the old Mermaid sequence) shows the three standard
JSON-RPC calls every session makes — `initialize` → `tools/list` (discover the menu) → `tools/call` —
each a `POST /mcp` with the same Bearer, reinforcing the envelope. Both `clicks:3`.
ACCURACY (user, 2026-06-17): the MCP **consumer is our AI app — the MCP client inside the host —
NOT the model**. The model only decides which tool + args; our client speaks the protocol and makes
the HTTP calls. Envelope title is "A standard API any AI app can consume" (NOT "any model"); the
handshake rows stay as-is but the speaker notes attribute initialize/tools/list/tools/call to the
client, not the model. Built per the user's brief: MCP ≈ standard REST/HTTP, consistent bearer both
sides, "what you ship today" removed, simple-first then add detail.

`ContextWindow.vue` and `AgentContextWindow.vue` are a deliberate PAIR: the same fixed-space,
colour-coded grid shown twice. The lean Part-II one (system · history · current · summary · free)
teaches "the window is one fixed space different things share, and when it's full the APP acts —
it compresses the oldest turns into a summary (striped cells) or starts a fresh session; the system
prompt stays pinned." The Part-IV one reuses the identical mechanics and adds **tool defs** + **tool
data** (the runaway space-hog — tool OUTPUT, not your prose, is what fills an agent's window); when
full, the agent **offloads to external memory** (striped azure cells, kept OUTSIDE the window) —
motivating the "Memory" piece on the Anatomy slide that immediately follows. NB (user feedback
2026-06-17): do NOT frame this as money/"budget"/"rent" — it's about space and what fills it; and
do NOT show tokens just "falling out of the window" — show the real resolution (compress / new
session / offload). Segment order is FIXED (system → … → free) so cells only change colour in place
— never reflow (Rule 4). Token scale differs on purpose: 0.5k/cell in Part II, 2k/cell in Part IV
(agent tool output is big).

## Status (as of session end, 2026-06-17)

- **This session (2026-06-17, latest): reworked Part III MCP per user brief, then iterated.** Goal:
  make MCP accurate + beautiful, lean on "MCP ≈ standard REST/HTTP". Envelope title is now "A
  standard API any model can consume" (the accurate framing the user asked for — was "HTTP you
  already secure"). Whole Part III switched to the "we"/"our" voice (new Rule 9 — presenter is part
  of the team). Rebuilt `McpEnvelope.vue` from a
  loose ≈-connector list into a precise side-by-side of TWO HTTP requests with a fixed-geometry
  middle alignment column (badges line up to the header band / body band via shared CSS vars).
  Both sides now carry the SAME `Authorization: Bearer •••` (user ask). Removed the "what you ship
  today" label (now just `REST API` / `MCP server`). MCP body is real JSON-RPC 2.0
  (`jsonrpc`/`id`/`method:"tools/call"`/`params`). Beat 2 lights the shared envelope + dims-to-
  highlight the differing body; beat 3 = policy band (OAuth / rate-limit / audit / WAF) for the
  "it's HTTP → your gateway policies still apply" payoff. Added `McpHandshake.vue` REPLACING the
  old Mermaid sequence: three fixed-height rows `initialize → tools/list → tools/call`, each a
  `POST /mcp` with Bearer, response fades in per beat, first row active on arrival (Rule 8). Both
  slides `clicks:3`. Speaker notes rewritten. Build compiles clean. **NOT yet visually verified —
  user should refresh; check the envelope middle badges align to the card bands, the JSON-RPC body
  doesn't clip the right card, and the handshake rows don't overflow at real res.**
- **This session (2026-06-17, later): reworked `ContextWindow.vue` + added `AgentContextWindow.vue`,
  then iterated on user feedback.** The old Part-II window only showed QUANTITY (cells fill, oldest
  fall off). Rebuilt it to show COMPOSITION: a colour-coded grid (system=azure, history=gold,
  current=green, free=faint) with a live legend of per-segment token counts (0.5k/cell), a per-beat
  caption and gauge. **Feedback pass:** (1) dropped all money framing — title is now "one fixed space
  for everything" (was "fixed budget"), and "rent" removed from notes; (2) the "full" beat no longer
  just evicts tokens into the void — it shows the REAL resolution: the app COMPRESSES the oldest
  turns into a striped "summary" segment (or starts a fresh session). `clicks:5` (6 beats, arrival
  shows system prompt). `AgentContextWindow.vue` (Part IV, NEW slide between AgentLoop and Anatomy,
  `clicks:4`) mirrors the mechanics, adds tool defs + tool data (amber space-hog, 2k/cell), and on
  the full beat the agent OFFLOADS to external memory (striped azure, kept outside the window) —
  motivating the "Memory" piece next. Both use striped cells (45° gradient) for the compressed/
  offloaded segment. Speaker notes rewritten for both. Build compiles clean. **NOT yet visually
  verified — user should refresh; check the 640px grid + 7-item legend (agent) don't overflow and the
  striped cells read clearly.**
- **This session (2026-06-17): killed the "blank first click" across the deck** (new Rule 8).
  Every build-up slide now lands with its title + first beat already on screen; clicks only add
  what follows. Edits: titles dropped their `v-click`; first reveal moved to `v-click="1"`; each
  slide's `clicks:` total dropped by one. `Timeline.vue` now gates milestones with `c >= i`
  (first milestone free, slide `clicks:5→4`); `AttentionFlip.vue` shows sentence A at `r >= 0`
  (`clicks:3→2`); `AgentLoop.vue` has "Think" active at `c === 0` — its dead first click is gone
  (`clicks:5→4`). Slides touched: roadmap + small-box (`4→3` each), timeline, "prediction→
  reasoning" claim (big line now static), tools flow (`5→4`), attention, agent loop, anatomy
  (`6→5`), A2A (`4→3`). Speaker notes updated to match (first `[click]` folded into the set-up
  line). Build still compiles clean. **NOT yet visually verified — user should refresh.**
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

4. **Dev-server hot-reload corrupts when files are deleted/renamed while it runs.** Vite caches a
   broken reference (e.g. to a deleted component) and 404s every importing slide. Fix: kill the
   server, `rm -rf node_modules/.vite`, relaunch, and hard-refresh the browser.

5. **Sandbox notes.** The dev server can't bind a port in-sandbox (`listen EPERM`) — run it with
   the sandbox disabled. `npm` cache hits EPERM too — use `--cache "$TMPDIR/npm-cache"`.
   `playwright-chromium`'s post-install browser download is blocked — set
   `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` to install the package, and install the browser separately
   into a writable path (`PLAYWRIGHT_BROWSERS_PATH=./.pw-browsers`) with sandbox off.

6. **Never put `v-if` and `v-for` on the SAME element (Vue 3).** Vue 3 evaluates `v-if` BEFORE
   `v-for`, so the loop variable doesn't exist yet — `v-if="p.label"` throws
   `Cannot read properties of undefined`. This crash is invisible to `slidev build` (it compiles)
   but breaks the slide at runtime in the browser. Fix: precompute the filtered list in `<script>`
   (`const labelled = items.filter(p => p.label)`) and `v-for` over that.

7. **`Math.random()` / `Date.now()` are unavailable in some run contexts.** For decorative jitter
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
   - The slide **lands with its first beat already visible** (title + first element) — see Rule 8.
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

7. **Brand palette = MuleSoft (NOT Anthropic).** The old terracotta `--warm` (`#d2592b`) read as
   Anthropic clay and was replaced with MuleSoft's own colours (pulled from `docs.mulesoft.com`):
   - **Cool accent** (`--cool` / `--cool-bright`) = MuleSoft azure `#00a2df` + cloud-blue `#0176d3`
     — the "API / integration" accent.
   - **Warm accent** (`--warm` / `--warm-bright`) = MuleSoft gold `#fcc003` + deep amber `#b26b00`
     — the "AI / model" accent.
   Always drive colour through these tokens in `styles/index.css` (day + `html.dark` night blocks).
   Do NOT bake hex/rgba accent literals into components — earlier glows hard-coded the terracotta
   `rgba(232,121,74,…)` and didn't follow the token; if you need an accent tint, use the gold
   `rgba(252,192,3,…)` / blue `rgba(1,118,211,…)` so it matches the brand.

8. **No blank first click — slides land with their first beat showing.** A slide must NEVER arrive
   empty and need a click just to reveal its title or first element. The title (and the first
   content beat) is on screen from arrival; clicks only add what comes *after* it. This overrides
   the old "slide often starts empty" idea. Concretely, when building a `v-click` build-up:
   - The title-row carries **no** `v-click` (it's always visible). Don't write `v-click` /
     `v-click="1"` on the title.
   - The first revealable element starts at **`v-click="1"`** (shown on the first click), and the
     `clicks:` total = number of reveals AFTER the first beat. (E.g. title + 3 cards → `clicks: 3`.)
   - For components that read `$clicks`, the first step must render at `$clicks === 0` (gate with
     `c >= i`, not `c > i`; map step 0 to click 0). Fixed this session in `Timeline.vue` (`c >= i`),
     `AttentionFlip.vue` (sentence A at `r >= 0`), and `AgentLoop.vue` ("Think" active at `c === 0`,
     removing its dead first click). NextTokenPredictor/ContextWindow/StatelessReplay/McpEnvelope
     already showed a meaningful first beat on arrival (prompt field / window frame / turn 1 / HTTP
     card) and were left as-is.

9. **Voice = "we", not "you".** The presenter is part of the team/audience, not lecturing them.
   On slides AND in speaker notes, say **"we"/"our"** (the systems we run, the APIs we ship) — never
   "you"/"your" addressed to the room. (Neutral "you" generic-impersonal is fine when unavoidable,
   but prefer "we".) Applies to all new/edited copy.
