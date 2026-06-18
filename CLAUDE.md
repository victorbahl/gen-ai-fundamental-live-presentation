# CLAUDE.md — working rules for this deck

This is a living rulebook for the **GenAI Fundamentals** Slidev deck.
Every rule the user gives is recorded here and must be respected on every slide.

## Project

- Slidev deck: "AI → LLMs → Agents" — a visual, interactive intro to Generative AI.
  Audience: technical MuleSoft Solution Engineers (API management, integration, AI gateway).
  Fil rouge: **AI → LLMs → Agents** (quick map of the field → how one model works → what we build
  that acts). ~45 min, English. Neutral/unbranded.
  Running example for demos: "order status across systems".
  SPINE HISTORY (user, 2026-06-17): the original "Compute → Reason → Act" four-part triad was
  retired. The two dead part-opener heroes ("Seventy years in one breath", "It predicts the next
  word. That's it.") were CUT — do not resurrect them. Tools/MCP + agents are now ONE part (Part 3
  "Agents"), not two. Within Part 2, STATELESS now comes BEFORE the context window (the no-memory
  truth motivates "so how much fits in one call?" → the window, which then closes Part 2 and bridges
  into agents).
- Entry point: `slides.md`. Custom components in `components/` (auto-imported).
- Global theme/tokens in `styles/index.css`.
- Run: `npm run dev` (the dev server must run outside the sandbox — it binds a port).

## Deck structure (3 parts)

Cover · Humility · Roadmap (AI · LLMs · Agents) ·
**1 — AI** (`02-reason-history.md`): PartOpener (AI, spine bar) / "GenAI is a small box" zoom (moved
here from `01-intro.md`) / Timeline / "Prediction→reasoning" claim ·
**2 — LLMs** (`03-reason-llm.md`): PartOpener (LLMs, spine bar) / NextTokenPredictor / AttentionFlip /
StatelessReplayStack / StatelessReplayFilmstrip / ContextWindow / "Prediction→reasoning" claim Hero /
Hallucination / Grounding (Hallucination + Grounding are the LAST two — they get honest about the
model's limits and bridge into Part 3's tools) ·
**3 — Agents** (`04-act-tools.md` + `05-act-agents.md`, ONE part): PartOpener (Agents, spine bar) /
Tools flow / McpEnvelope / McpHandshake / AgentLoop / AgentContextWindow / Anatomy of an agent / A2A ·
Close.

PART OPENERS (user, 2026-06-17): each of the three parts opens with a `PartOpener.vue` hero (NEW
component) showing a SPINE PROGRESS bar — the full "AI › LLMs › Agents" spine with the current part
lit (accent underline) and the others dimmed — over a background photo, then the part number + a
headline + a sub line of TAGS. The tags map to what that part actually contains (user, 2026-06-17):
Part 1 = "where GenAI fits · a short history · prediction at scale"; Part 2 = "tokens · attention ·
stateless · the context window"; Part 3 = "tools · MCP · the agent loop · A2A". Part 1 uses the
cool/azure accent (`accent="cool"`, `bg="part-1.jpg"`); Parts 2 & 3 use warm/gold (`bg="part-2.jpg"`,
`part-3.jpg`). Same placeholder/text-shadow rules as `Hero.vue` (Rules 2/3) and token-driven accents
(Rule 7).

CUT SLIDES (user, 2026-06-17) — do NOT resurrect: (a) Part-2 "the most important slide" remembers-
nothing hero (`part-2b.jpg`) and the "It has no memory" payoff statement; (b) Part-3 thematic opener
"A mind with no hands." (REPLACED by the Agents PartOpener) and the "When the model drives." in-part
pivot hero (`part-4.jpg`) — its tools→agents handoff is now folded into the AgentLoop speaker notes;
(c) the close hero line "From calculators to colleagues." (now "Less magic. More system."). The
`part-2b.jpg` and `part-4.jpg` placeholders are no longer referenced.

EMPTY-SLIDE GOTCHA (user, 2026-06-17): a `src:`-included file whose FIRST line is an HTML `<!-- … -->`
comment (before the first `---` frontmatter) renders that comment as a STRAY BLANK slide. This had
produced 4 empties (then slides 5, 9, 16, 21). Fix applied to all includes: the header comment now
sits AFTER the first `---` frontmatter (the pattern `06-close.md` always used). Keep new include
files starting with `---`, never a leading comment.

Components: `Hero.vue` (Archetype A), `PartOpener.vue` (part-opener hero w/ spine bar),
`Timeline.vue`, `NextTokenPredictor.vue`, `AttentionFlip.vue`,
`ContextWindow.vue`, `AgentContextWindow.vue`, `StatelessReplay.vue`, `McpEnvelope.vue`,
`McpHandshake.vue`, `AgentLoop.vue`, `Hallucination.vue`, `Grounding.vue`.

`NextTokenPredictor.vue` — "how a prompt becomes a prediction", `clicks:8`, the D5 pipeline (prompt →
tokenise → numbers → weights → predict → loop). REWORKED (user, 2026-06-18): the old "The best
Salesforce acquisition is" statement version was REPLACED by the question version below (the old
component + its slide were DELETED — do not resurrect a second predictor slide; there is ONE).
Design decisions, all per user: (1) prompt is a QUESTION — "What's the best Salesforce acquisition ?"
(space before "?" telegraphs it's its OWN token); (2) "acquisition" stays ONE token (only
"What's"→What+'s and "Salesforce"→Sales+force split); (3) on arrival the grey input field hugs the
QUESTION TEXT (width = text length, not the chip row) and shows NO cursor; (4) the warm caret appears
ONLY after the first token (MuleSoft) is generated (gated on `predicting`), then rides the trailing
edge + blinks; (5) the FIRST distribution is a CLOSE race — MuleSoft .30 (just ahead), Slack .24 =
Informatica .24 (tied), Tableau .14 — so "ranked guess, not a fact" lands harder (later steps
unchanged); (6) the explanatory captions are larger (`.cap` 12px / `.cap.top` 13px, fill `--ink-soft`)
and two-line; (7) INFERENCE is named here (closes the long-standing TODO): the weights caption reads
"billions · learned once = training" / "one pass through them = inference", the two keywords in warm
`.kw`, and the WEIGHTS speaker-note beat spells out training vs inference + ties it to stateless/grounding.
LAYOUT: (a) the "tokens — sub-word pieces" caption is centred under the prompt row via computed
`PROMPT_MID` and sits at `y=92`; (b) the whole pipeline below the prompt row (numbers grid, weights,
prediction bars) is wrapped in `<g class="lower">` shifted `translateY(36px)` so it isn't crowded
against the tokens line (viewBox height bumped 400→436); (c) the "each token's meaning…" caption is
LEFT-aligned (`text-anchor="start"`) to `NUMCAP_X` = left edge of the first vector column; (d) long
numbers-grid column headers are truncated via `headLabel()` (>6 chars → 5+`…`) so "acquisition" doesn't
overlay "force"; (e) the numbers→weights arrow is DYNAMIC — centred in the gap between the numbers
grid's VISIBLE right edge (`numRightEdge`, grows as tokens generate) and the weights grid (`WX`), so it
repositions every step.

`Hallucination.vue` + `Grounding.vue` are the Part-2 closing PAIR (after the "Prediction→reasoning"
claim). HALLUCINATION (clicks:2): two cards — the model's fluent answer + a 94% confidence gauge
(left, warm) vs the actual Order-API record that DIFFERS (right, cool), a "≠" badge between, payoff
band "no lookup happened · fluent ≠ correct · confident ≠ true". Uses order #7788 (a FRESH number, so
it doesn't imply the earlier #4471 "shipped" answers were hallucinated). The teaching point: the model
emits the most PLAUSIBLE tokens over frozen weights — hallucination is what next-token prediction DOES,
not a patchable bug. GROUNDING (clicks:3): a decision diagram — "two places knowledge can live → change
one". Path A = change the WEIGHTS (re-train = too costly; fine-tune = STYLE/BEHAVIOUR not facts, can't
cite, goes stale — the misconception to kill). Path B = change the CONTEXT, weights frozen (RAG =
retrieve static docs; Tool calls = live authoritative API, lit warm as "what we build next"). Payoff
bridges into Part 3. HONEST CAVEAT baked in (user ask): grounding cuts hallucination on covered facts,
never to zero. GROUNDING MODEL validated with user 2026-06-17: knowledge = weights OR context; fix one.
Fine-tune≠facts and RAG-vs-tools-by-data-shape (static unstructured docs vs live structured API) are
the two accuracy nuances that must stay.

`McpEnvelope.vue` + `McpHandshake.vue` are the Part-3 (Agents) MCP pair. The envelope slide shows REST
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
colour-coded grid shown twice. The lean Part-2 (LLMs) one (system · history · current · summary ·
free) teaches "the window is one fixed space different things share, and when it's full the APP acts —
it compresses the oldest turns into a summary (striped cells) or starts a fresh session; the system
prompt stays pinned." It now sits LAST in Part 2 (right after the stateless cluster), so the running
order is "no memory → we resend everything → so how much fits in one call? → the window." The Part-3
(Agents) one reuses the identical mechanics and adds **tool defs** + **tool data** (the runaway
space-hog — tool OUTPUT, not your prose, is what fills an agent's window); when full, the agent
**offloads to external memory** (striped azure cells, kept OUTSIDE the window) — motivating the
"Memory" piece on the Anatomy slide that immediately follows. NB (user feedback
2026-06-17): do NOT frame this as money/"budget"/"rent" — it's about space and what fills it; and
do NOT show tokens just "falling out of the window" — show the real resolution (compress / new
session / offload). Segment order is FIXED (system → … → free) so cells only change colour in place
— never reflow (Rule 4). Token scale differs on purpose: 0.5k/cell in the Part-2 (LLMs) window,
2k/cell in the Part-3 (Agents) one (agent tool output is big).

## Status (as of session end, 2026-06-18)

- **This session (2026-06-18, STATELESS PAIR POLISH — newest): per user, two small reworks.**
  (1) `StatelessReplayStack.vue` — shrank the LLM box (`.llm` height 110px→78px, tighter padding/gap)
  and dropped its subtitle: the head label is now just **"LLM"** (was "LLM · stateless function").
  (2) `StatelessReplayFilmstrip.vue` ("Seen another way") — kept the 3-envelope structure / sent-state
  / token bars / replay-vs-new legend, but each POST now renders the **actual request JSON** instead of
  role+text cards: a real Messages API payload — top-level `model: "claude-opus-4-8"` + `system`, then a
  `messages: [ … ]` array of `{role, content}` objects. Prior turns are dimmed (`.msg.replay`); the one
  new line per call is the warm-highlighted `{role:"user", …}` object (`.msg.new`). Token count now
  includes the system string. This makes it visibly "more real" / different from the take-1 stack.
  JSON is div-per-line (`.jl` + `.ind1`/`.ind2` indent classes), NOT a `<pre>` with inter-span newlines
  (those render stray blank lines). Build compiles clean (`slidev build`, 551 modules). **NOT yet
  visually verified — user should refresh; check the JSON doesn't overflow the 308px envelope body at
  call 3 (longest payload) and the new-line highlight reads clearly.**
- **This session (2026-06-17, ACCURACY/CONSISTENCY PASS): fixed wrong info + inconsistencies.**
  Full read-through of every slide + component for accuracy/consistency, then fixes (all per user
  "fix everything"): (1) `NextTokenPredictor.vue` step-0 distribution summed to 138% (impossible) —
  retuned to MuleSoft .44 / Slack .21 / Informatica .16 / Tableau .09 (clear winner, sums ≤ 1).
  (2) `Timeline.vue` 1950s was mislabelled "Expert systems" (those are 70s–80s) → "Symbolic AI".
  (3) "Prediction at scale → reasoning" claim Hero — its forward-ref ("look at next") used to dangle
  toward Agents. CORRECTION (user, 2026-06-17): user wants it KEPT at the END of Part 2
  (`03-reason-llm.md`, after ContextWindow) — it closes the LLM mechanism and bridges into Part 3.
  (I briefly moved it to end of Part 1, then reverted per user preference.) Its note now reads
  "next we get honest about where it falls short" — bridging into the planned hallucination/grounding
  beats + the Agents scaffolding. Do NOT move it back to Part 1. (4) Close (`06-close.md`) called back to an
  "opening question — can a machine think?" that the cover no longer asks → rewrote to call back the
  "less magic, more system" promise. (5) `McpHandshake.vue` footer "any model talks to any tool" →
  "any AI app" (matches the MCP-consumer-is-the-app accuracy rule). (6) Unified tool name `get_order`
  → `get_order_status` (was split across `05-act-agents.md` + `AgentContextWindow.vue`). (7) Roadmap
  LLMs sub-line `tokens · attention · memory` → `· stateless` (the part teaches NO memory). (8) Rule-9
  "we" voice: fixed on-slide "you" leaks in `ContextWindow.vue` (2 captions), `AgentContextWindow.vue`
  (1 caption), `06-close.md` subtitle. (9) Stale "(Part IV)" comment in `AgentContextWindow.vue` →
  "(Part 3 — Agents)". Build compiles clean (`slidev build`, 533 modules).
  Then (same session, user "do everything"): BUILT the two missing essentials as new slides at the
  END of Part 2 (after the claim Hero, before the Agents opener) — `Hallucination.vue` (clicks:2) and
  `Grounding.vue` (clicks:3), both auto-imported, both following Rule 4/8 + brand tokens; see Components
  section for their design + the validated grounding model. Part-2 opener tag updated to "…the window ·
  its limits". Prompt-injection was DEFERRED by the user — not built. Build compiles clean (545 modules).
  **NOT yet visually verified — user should refresh; confirm the Hallucination cards + confidence gauge
  read clearly, the Grounding two-path diagram doesn't clip the option cards / verdict pills at real
  res, and the new Part-2 closing flow (claim → hallucination → grounding → Agents opener) lands.**
- **This session (2026-06-17, OPENER CLEANUP): empties, box move, tags, more cuts.**
  Follow-up to the PART OPENERS pass, all per user: (1) Killed the 4 STRAY BLANK slides (5, 9, 16,
  21) — each `src:` include began with a header comment BEFORE its first `---`, which Slidev renders
  as an empty slide; moved every header comment AFTER the frontmatter. (2) Moved the "GenAI is a
  small box" zoom OUT of `01-intro.md` and INTO Part 1 (`02-reason-history.md`), right after the AI
  opener — it's a Part-1 idea. (3) Rewrote the three opener sub-lines as TAGS matching each part's
  real contents (see Deck structure). (4) REMOVED the "When the model drives." pivot hero (`05`,
  `part-4.jpg`) — folded its tools→agents handoff into the AgentLoop notes. (5) Changed the close
  hero from "From calculators to colleagues." to "Less magic. More system." (kicker → "AI · LLMs ·
  Agents", notes updated). Build compiles clean (`slidev build`, 534 modules). **NOT yet visually
  verified — user should refresh; confirm the 4 empties are gone, the box reads in Part 1, and the
  opener tag lines don't clip.**
- **This session (2026-06-17, PART OPENERS): added 3 part-opener heroes; cut 2 slides.**
  Per user: (1) NEW `PartOpener.vue` — a part-opener hero with a SPINE PROGRESS bar ("AI › LLMs ›
  Agents", current part lit + accent underline, others dimmed) over a bg photo, then the part number
  + the agenda's main/sub line (reused from the roadmap). One opens each part: Part 1 (`02`,
  `bg="part-1.jpg"`, cool accent, "A quick map of the field"), Part 2 (`03`, `part-2.jpg`, warm,
  "How the model actually works"), Part 3 (`04`, `part-3.jpg`, warm, "From answers to actions").
  (2) CUT the "the most important slide" remembers-nothing `Hero` (was `part-2b.jpg` — now
  unreferenced) and the "It has no memory" payoff `statement` slide, both in Part 2. (3) REPLACED
  the Part-3 thematic opener "A mind with no hands." with the Agents PartOpener (its
  no-hands/needs-hands beat folded into the opener's speaker notes). Speaker notes written for all
  three openers. Build compiles clean (`slidev build`). **NOT yet visually verified — user should
  refresh; supply real `part-1/2/3.jpg` photos and check the spine bar + headline don't clip and the
  active-word underline reads clearly over the image.**
- **This session (2026-06-17, FLOW REWORK): retired the Compute→Reason→Act spine.**
  Big-picture restructure only (no component internals touched). (1) New spine **AI → LLMs →
  Agents** — relabelled the cover `info`, the roadmap cards/title (`01-intro.md`), and all spine
  notes. (2) CUT both dead part-opener heroes: "Seventy years in one breath" (`02`) and "It predicts
  the next word. That's it." (`03`) — the Timeline and NextTokenPredictor own their own titles now.
  (3) Collapsed old Part III (tools/MCP) + Part IV (agents) into ONE **Part 3 — Agents**: only
  `04-act-tools.md` carries the part-opener hero ("A mind with no hands"); the "When the model
  drives" hero in `05` is now an IN-PART pivot (kicker "Same part · now the model drives"), not
  "Part IV". (4) Moved STATELESS before the context window inside Part 2: predictor → attention →
  "remembers nothing" hero → StatelessStack → Filmstrip → no-memory payoff → ContextWindow (now
  LAST, closing Part 2 and bridging to agents). Fixed the resulting forward-references in notes (the
  "remembers nothing" hero no longer points at the window; the window opener now bridges from "we
  resend everything → how much fits in one call?"; "Callback to Part II" → "from Part 2"). Aligned
  the stateless stack title to "we resend" (Rule 9). Build compiles clean (`slidev build`). **NOT
  yet visually verified — user should refresh and click through the new Part-2 order.**
- **This session (2026-06-17, newest): reworked the two "stateless truth" slides per user.**
  `StatelessReplayStack.vue` now builds TURN ONE up by clicks instead of running it as a timed
  cascade on arrival: c0 = LEFT only (the human's first question; right side blank), c1 = + POST
  body (system + question, sweep), c2 = + LLM (forward pass · generating…), c3 = + answer returns
  to the left (turn 1 done). Turns 2 and 3 stay as ONE full animated cycle each (c4, c5); takeaway
  at c6. Slide `clicks: 3 → 6`. Added a `.stepped` class (true only on turn 1) that kills the timed
  CSS animations and drives the LLM "generating…"→answer purely off click gates (`showLLM`/`showAns`)
  with a clean fade handoff (think fades out, answer fades in 0.25s later — fixes the user's "answer
  overlays generating" complaint). For the later animated turns the cascade timing was retightened
  (think fades by ~1.95s, ansIn at 2.0s) so the answer no longer overlaps "generating…".
  `StatelessReplayFilmstrip.vue`: per the user, the CURRENT turn's ANSWER is no longer in the POST
  body (it hasn't been produced when the call is sent) — each envelope is now system + prior turns
  (user+answer, replayed/dimmed) + ONE new line = the current question only. Removed the "↗ … you
  pay to resend it all" legend line (and its `summary`/`.grow` dead code). Speaker notes for both
  slides rewritten to match (and to "we" voice). Build compiles clean. **NOT yet visually verified —
  user should refresh; check turn-1 steps land cleanly and no answer/generating overlap.**
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
- **DONE (user, 2026-06-18): the INFERENCE notion is now named.** It lives in `NextTokenPredictor.vue`
  at the WEIGHTS beat: the caption under the weights grid reads "billions · learned once = training" /
  "one pass through them = inference" (the two keywords highlighted warm via `.kw`), and the WEIGHTS
  speaker note spells out training vs inference and ties it to the stateless truth + grounding (we change
  the *context* fed to inference, not the weights). Was: "TODO — deck never names inference."
- The 7 hero backgrounds are gradient placeholders; drop real photos at `public/img/cover.jpg`,
  `part-1.jpg`, `part-2.jpg`, `part-2b.jpg`, `part-3.jpg`, `part-4.jpg`, `close.jpg`.
- The on-slide photo-placeholder corner tags were removed (user, 2026-06-17). `Hero.vue` no longer
  renders a `.photo-tag`, and the `--photo-tag-display` flag is gone from `styles/index.css`.

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
