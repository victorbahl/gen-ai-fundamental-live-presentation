# CLAUDE.md — working rules for this deck

Living rulebook for the **GenAI Fundamentals** Slidev deck. Every rule the user gives is recorded
here and must be respected on every slide. (Per-session history lives in git; this file keeps only
durable facts + current open items — so prefer the *current* statement of a fact over its history.)

## Project

- Slidev deck **"AI → LLMs → Agents"** — a visual, interactive intro to Generative AI.
  Audience: technical MuleSoft Solution Engineers (API management, integration, AI gateway).
  Fil rouge: **AI → LLMs → Agents** (map the field → how one model works → what we build that acts).
  ~45 min, English, neutral/unbranded. Running example: "order status across systems".
- Entry point `slides.md`; custom components in `components/` (auto-imported); theme/tokens in
  `styles/index.css`.
- **RUN LOCALLY — slides only, by design.** `npm run dev` (Slidev, localhost:3030) is the ONLY local
  workflow; it binds a port → run OUTSIDE the sandbox. It serves SLIDES; the Battle's serverless
  functions 404 locally. There is NO local-functions path (the old `netlify dev`/`npm run dev:netlify`
  + `netlify-cli` devDep + `.env*` were removed). To test the Battle, deploy (see Lesson 9).
- **DEPLOY — Netlify, auto-deploys on every push to `main`** (GitHub-linked, branch `main`). Config in
  `netlify.toml`: `npm run build` → publish `dist/`, functions in `netlify/functions/`, served at site
  ROOT (no sub-path base). Manual: `npx netlify deploy --build` (draft) / `--prod`. Live:
  `vb-gen-ai.netlify.app`. Prod env vars (`ANYCABLE_BROADCAST_URL`, `ANYCABLE_BROADCAST_KEY`) live
  ONLY in the Netlify dashboard. (Pages was dropped — it can't run the Battle's functions.)
- **OLD LIVE QUIZ — REMOVED, do NOT resurrect.** The `slidev-addon-slide-quiz` POLL (anonymous
  aggregate bar-chart) was the wrong tool (Lesson 10). The Battle is the one and only audience
  interaction. (The PACKAGE stays installed — `BattleLobby.vue` reuses its `SlideQuizQR.vue` for the
  QR — but it's no longer registered as a Slidev addon.)
- **SPINE HISTORY.** The original "Compute → Reason → Act" triad was retired for **AI → LLMs →
  Agents**. Do NOT resurrect the two dead part-opener heroes ("Seventy years in one breath", "It
  predicts the next word. That's it."). Tools/MCP + agents are ONE part (Part 3 "Agents").

## Live Battle (the one audience interaction)

A named, scored, Kahoot-style competition; the deck OPENER (`slides/battle.md`, included right after
`01-intro.md`). Reuses the AnyCable + Netlify infra.

- **Authority model.** The DECK is the scoring authority — it holds the answer key + scores and is
  the only place that knows who's right. Phones (`public/battle.html`) get only the question
  (text+options, **NO `correct`**) + live "answered" counts. This "no `correct` in the broadcast"
  invariant is load-bearing.
- **Phones never show rank during play** (header shows running score only; reveal says "look up —
  standings come at the end"). Rank appears ONLY on the final podium. SPOILER GUARD: the leaderboard
  slide calls `b.final(c>=3)`, so the engine sends ranks to phones only once 1st place is revealed
  on screen; before that phones get a rank-less roster + "results coming up" teaser.
- **Scoring** is deliberately simple + bulletproof: correct = **10 pts fixed** (`POINTS`), wrong = 0.
  No timer, no speed bonus, no countdown, no cross-device clock.
- **Sync reliability.** State is pushed on change AND re-broadcast on a 2s **heartbeat**
  (`HEARTBEAT_MS`, started in `connect()`, cleared in `disconnect()`) — a phone that missed a one-shot
  broadcast self-heals within ~2s, and steady traffic keeps the function warm. Receivers are
  signature-guarded so heartbeats don't flicker/interrupt input (Lesson 12).
- **Slide-phase side-effects run from `onSlideEnter`, NOT `onMounted`** (Lesson 13) — all three battle
  slides.
- **Room/`groupId` is URL-authoritative.** `?groupId=<id>` in the deck URL wins; if absent we MINT a
  fresh `room-xxxx` (cached in-memory, side-effect-free) and the LOBBY writes it back via vue-router
  `router.replace` (NOT raw `history.replaceState` — Slidev spreads the query onto every nav and would
  drop a raw write). So the room is visible/shareable and survives a deck reload. SSR-safe; falls back
  to `genai-battle` at build time.
- **Reload roster self-heal.** The deck holds the roster only IN MEMORY, so a deck reload empties it;
  phones re-POST their join whenever they receive a state where they're joined but ABSENT from the
  roster (debounced ≤1/3s), repopulating the lobby within a heartbeat. Caveat: a mid-game deck reload
  resets scores to 0 (no persistence) — acceptable degraded behaviour.
- **INFRA — AnyCable PUBLIC MODE REQUIRED.** The Fly app (`vb-cable-4vsc.fly.dev`) MUST have a BLANK
  Application secret (public-streams app: deck + phones connect tokenless). A non-blank app secret makes
  the WS handshake return `unauthorized`/"Auth Failed" → deck shows 0 players + phones stuck "waiting"
  (broadcasts still 200 — they use the separate Broadcast key, which stays set + matches
  `ANYCABLE_BROADCAST_KEY`). RPC URL/key stay empty. (Lesson 11.)
- **THEME.** Battle slides are NORMAL themed slides (read standard tokens, follow day/night toggle).
  Only `.battle-slide { padding: 0 }` remains, for full-bleed.

**Pieces:**
- `components/battle/useBattle.ts` — engine: listen players/answers, score, push state.
- `battleConfig.ts` — questions + answer key + shared singleton `battle()`; `BATTLE_WS_URL`;
  `battleGroupId()` (the URL-authoritative room above).
- `BattleLobby.vue` — QR + live names ("Scan. Name yourself. Play."); reflects room into deck URL on
  slide-enter; player grid holds ~40 names without scroll (compact chips, ellipsis, multi-column wrap).
- `BattleQuestion.vue` (`clicks:1`) — open→reveal in ONE click (no lock phase; the head shows
  "N/total answered"; reveal shows a COUNT of correct players "N players got it ✓", not names).
- `BattleLeaderboard.vue` (`clicks:3`) — podium reveals 3rd→2nd→1st col. A 👑 crown sits on EVERY
  top-score player (`isWinner()`), guarded against an empty/all-zero podium. **Ex-aequo by SCORE
  TIERS, not array slots:** a `tiers` computed groups players by DISTINCT score (dense positions
  1,2,3…); all players sharing a score sit TOGETHER in ONE column — top tier = middle (gold), 2nd =
  left (silver), 3rd = right (bronze). Tied names STACK vertically and wrap into sub-columns
  (`.names` flex-column + `flex-wrap` + capped `max-height`) — EVERY winner shown, NO "+N more" in the
  top 3. Bar heights 100/76/56 (podium box 250px, names max-height 76px) so a big tie's column+crown
  can't grow into the title. RUNNERS-UP (pos 4+) are the only capped part: a wrapping grid of
  `pos·name·score` chips (`MAX_REST=21`) with a "+N more" tail chip. (Re-test layout edge cases by
  recreating a throwaway `BattleLeaderboardPreview.vue` + `_preview-leaderboard.md` with static data:
  top tie, 30 distinct, 4-way #1 tie, 8-way #1 tie; delete after.)
- `public/battle.html` — the PHONE: self-contained dark page (NOT Slidev — own CSS vars). Carries the
  brand lockup at top (the logos/Hackathon/SE-French bits go on the PHONE, not the slide):
  MuleSoft+Informatica logos (`/img/*.svg`, copied into `dist/img/`) directly on the dark page (no
  pill; forced pure white via `filter: brightness(0) invert(1)` so the navy MuleSoft mark shows) +
  "⚔️ AI Battle" + "Hackathon AI · SE French Team". Incoming state never re-renders the join form
  (a render-signature guard skips no-op heartbeats — protects a half-typed name + focus).
- `netlify/functions/battle-{shared,join,answer,state}.mts` — 3 streams: players/answers/state.

## Deck structure (3 parts)

Cover · Humility · Roadmap · **AI Battle** (opener icebreaker) ·
- **1 — AI** (`02-reason-history.md`): PartOpener / "GenAI is a small box" zoom / Timeline /
  "Prediction→reasoning" claim.
- **2 — LLMs** (`03-reason-llm.md`): PartOpener / NextTokenPredictor / AttentionFlip /
  StatelessReplayStack / StatelessReplayFilmstrip / ContextWindow / "…reasoning…" claim Hero / "But…"
  turn Hero (`but-limits.jpg`) / Hallucination ("the limits") / Grounding. (Closing run: celebrate →
  deflate → name the limits → show the fix → bridge into Part 3's tools.) STATELESS comes BEFORE the
  context window (no-memory truth motivates "so how much fits in one call?" → the window → agents).
- **3 — Agents** (`04-act-tools.md` + `05-act-agents.md`, ONE part, TOP-DOWN): PartOpener /
  AgentRuntime ("what is an agent" — UP FRONT) / ToolRoundtrip / McpEnvelope / McpHandshake /
  ToolsVsSkills / AgentLoop / AgentContextWindow / KeyTakeaways · Close (hackathon CTA).

**PART OPENERS** — each part opens with a `PartOpener.vue` hero showing the SPINE as a TOKEN STREAM
(full "AI › LLMs › Agents" as mono token-chips on the heat ramp — current part lit with a blinking
caret, others dim in their own hue; `pos NN / 03` read-out leads it — see Rule 7 SIGNATURE) over a bg
photo, then the part number + headline + a sub-line of TAGS: Part 1 = "where GenAI fits · a short
history"; Part 2 = "tokens · attention · stateless · the window · its limits"; Part 3 = "what an agent
is · tools · MCP · skills · the loop". Each part's HUE is derived from `active` (no `accent` prop):
Part 1 = teal, Part 2 = gold, Part 3 = coral; `bg="part-1/2/3.jpg"`. Same placeholder/text-shadow
rules as `Hero.vue` (Rules 2/3) and token-driven accents (Rule 7).

**A2A was REMOVED** — `A2A.vue` stays on disk but is UNREFERENCED; do NOT re-add the slide.

**CUT SLIDES — do NOT resurrect:** (a) Part-2 "the most important slide" remembers-nothing hero
(`part-2b.jpg`) + "It has no memory" payoff; (b) Part-3 "A mind with no hands." opener (now the Agents
PartOpener) + "When the model drives." pivot hero (`part-4.jpg`); (c) close line "From calculators to
colleagues." (now "Less magic. More system."); (d) end-of-part "Anatomy of an agent" recap (its job is
done up front by `AgentRuntime`); (e) Part-1 alternates `FieldMapV2.vue` + `TimelineV2.vue` (kept the
ORIGINAL "small box" zoom + `Timeline.vue`); (f) a SECOND NextTokenPredictor (there is ONE); (g) the
predictor's deleted mesh/map/grid/features/spectrum explorations. `part-2b.jpg`/`part-4.jpg` are
unreferenced.

## Components

`Hero.vue`, `PartOpener.vue`, `Timeline.vue`, `NextTokenPredictor.vue`, `AttentionFlip.vue`,
`ContextWindow.vue`, `AgentContextWindow.vue`, `StatelessReplay.vue`, `McpEnvelope.vue`,
`McpHandshake.vue`, `AgentRuntime.vue`, `ToolRoundtrip.vue`, `ToolsVsSkills.vue`, `AgentLoop.vue`,
`KeyTakeaways.vue`, `Hallucination.vue`, `Grounding.vue`. (`A2A.vue` on disk but unreferenced.)

### Part 1 (AI)
- **"Small box" zoom** (inline in `02-reason-history.md`) — nested AI ⊃ ML ⊃ GenAI boxes; the gold
  `.nbox.gen` reads visibly smaller (inset `120px 236px 54px 236px` ≈168×82px, `.nlabel` 0.6rem,
  `.gen-sub` 0.85rem).
- **`Timeline.vue`** (`clicks:4`) — milestones gated `c >= i` (first free). 1950s = "Symbolic AI"
  (NOT "Expert systems", which are 70s–80s).

### Part 2 (LLMs)
- **`NextTokenPredictor.vue`** (`clicks:8`) — "how a prompt becomes a prediction"; the D5 pipeline
  (prompt → tokenise → numbers → weights → predict → loop; FT-inspired, ig.ft.com/generative-ai). Key
  design: prompt is a QUESTION "What's the best Salesforce acquisition ?" (space before "?" = its own
  token); "acquisition" stays ONE token (only "What's"→What+'s, "Salesforce"→Sales+force split); on
  arrival the grey input hugs the question text, no cursor; the warm blinking caret appears only after
  the first token (gated on `predicting`) and rides the trailing edge; the FIRST distribution is a
  CLOSE race (MuleSoft .30, Slack .24 = Informatica .24 tied, Tableau .14) so "ranked guess, not a
  fact" lands. INFERENCE is named here (weights caption "billions · learned once = training" / "one
  pass through them = inference"; the WEIGHTS note ties training-vs-inference to stateless/grounding —
  we change the *context* fed to inference, not the weights). Layout: tokens caption centred via
  `PROMPT_MID` (y=92); pipeline in `<g class="lower">` shifted translateY(36) (viewBox h=436);
  numbers caption left-aligned to `NUMCAP_X`; long headers truncated via `headLabel()`; the
  numbers→weights arrow is DYNAMIC (centred between growing `numRightEdge` and weights grid `WX`).
- **`AttentionFlip.vue`** (`clicks:2`) — FT "bank" idea: same word, two sentences, attention arcs draw
  to the neighbours that fix its meaning. Sentence A at `r >= 0`. Optional (see its notes).
- **`StatelessReplay*`** — the "stateless truth" pair. STACK (`clicks:6`) builds TURN ONE by clicks
  (c0 question only → c1 +POST body → c2 +LLM "generating…" → c3 +answer; turns 2 & 3 are one animated
  cycle each; takeaway c6). A `.stepped` class (turn 1) kills timed CSS animation and drives
  generating→answer off click gates (`showLLM`/`showAns`). LLM box label is just "LLM". FILMSTRIP
  ("Seen another way") renders the ACTUAL request JSON — top-level `model:"claude-opus-4-8"` +
  `system`, then `messages:[…]` of `{role,content}`; prior turns dimmed (`.msg.replay`), the one new
  line warm-highlighted (`.msg.new`); token count includes the system string; the current turn's
  ANSWER is NOT in the POST body. JSON is div-per-line (`.jl` + `.ind1`/`.ind2`), NOT a `<pre>`.
- **`ContextWindow.vue`** (`clicks:5`) — see PAIR note below.
- **`Hallucination.vue`** (`clicks:3`) — "THE LIMITS", GENERIC (no order demo). Title "It sounds
  certain — and can't know OUR facts". Three structural-limit CARDS converging on one root cause: c0
  🔒 "Only public knowledge" lit (others dimmed 0.28); c1 🧊 "Frozen in the past"; c2 🎲 "Guesses —
  never checks" (= hallucination); c3 root-cause band ("a frozen, public model that can only predict
  text — it can't go and check. So we don't change the model. We feed it the facts."). Each card has a
  red consequence pill (blind to our data / no fresh data / hallucination). TEACHING POINT: the three
  are FACES of one root cause; "can only predict text, can't check" is the bridge into grounding.
- **`Grounding.vue`** (`clicks:2`) — decision diagram, "two places its knowledge can live — change
  ONE". Even-handed (changing weights IS a real option; non-provocative). **Weights teach SKILLS &
  BEHAVIOUR; context carries the FACTS** — both paths legitimate, different jobs. Path A (WEIGHTS):
  Re-train = "for deep domain skill"; Fine-tune = "for tone & behaviour". Path B (CONTEXT, weights
  frozen): RAG = static docs ("for our private docs"); Tool calls = live authoritative API ("for live
  facts", lit warm as "what we build next"). Per-card pills are NEUTRAL use-case labels tinted to their
  column, NOT pass/fail. Columns are visually EQUAL; context LANDS as the lever for facts-that-change
  ORALLY (no payoff band). Nuance to keep: RAG-vs-tools by data shape (static unstructured docs vs live
  structured API). HONEST CAVEAT: grounding cuts hallucination on covered facts, never to zero.

### Part 3 (Agents)
- **`AgentRuntime.vue`** (`clicks:6`) — "WHAT IS AN AGENT", defined UP FRONT as the WHOLE PICTURE,
  NO worked example (AgentLoop does the running trace). Built OUTSIDE-IN: the empty AGENT/code box
  lands first, then we FILL it. Reveal order: box (c0) → LLM (c1) → memory (c2) → tools (c3) → goal
  (c4) → loop arc over the model w/ "picks its own next step" (c5) → result out on the right (c6, +
  payoff band). GOAL + RESULT pills are GENERIC ("the job to get done" / "the job, done"). FRAMING:
  an agent is **a PIECE OF CODE with, at its heart, an LLM + Memory + Tools, run in a LOOP toward a
  GOAL** — NOT a new kind of model. Dashed boundary labelled "AGENT · code" (just "code", NOT "our
  code" — definition framing only; ToolRoundtrip/MCP still say "our code/auth/gateway" per Rule 9).
  Headline "A piece of CODE, with a model at its heart". Payoff band: "An agent is a piece of code: an
  LLM at its heart, wired to tools and memory, looping toward a goal." Diagram on a fixed 780×310px
  stage, boundary h=262 so docked tools/memory cards sit fully INSIDE the box; SVG wire layer 1:1 to
  px, HTML nodes on top (Rule 4). Layout: boundary x=168 w=384 h=262; core left=260 top=98; memory
  dock left=366, tools dock left=222 (both top=206 h=84, inside); GOAL pill left=8, RESULT pill
  left=564 (both outside). Colours: core/loop/memory warm, tools cool, goal/result good. ORAL framing
  in notes: Claude Code IS an agent by this definition; Claude/ChatGPT the PRODUCTS are apps wrapped
  around a model; the line that makes it AGENTIC is the autonomous loop (chat = answer once; agent =
  picks its own next step until done).
- **`ToolRoundtrip.vue`** (`clicks:3`) — TOOLS, request→execute→return across a TRUST BOUNDARY. Dashed
  centre line splits "the model · text only" (left, warm) from "our side · executes" (right, cool);
  real artefacts (`tool_use` JSON request → our `POST tools.acme.com/mcp · tools/call →
  get_order_status` with Bearer → `{status,eta}` result). The "our code runs it" card shows a COMPACT
  MCP call (not a plain GET, not the full JSON-RPC body — foreshadows MCP without pre-empting
  `McpEnvelope`). c0 model's request; c1 crosses boundary, our code runs it; c2 result folded back;
  c3 payoff ("the model never touches our systems — it requests, we execute"). Stage 300px, col gap
  0.5rem so the payoff band clears the two stacked right-column cards.
- **`McpEnvelope.vue` + `McpHandshake.vue`** — the MCP pair, both `clicks:3`. ENVELOPE: REST (left)
  vs MCP server (right) as TWO HTTP requests with the SAME Bearer auth + JSON content type — only the
  body differs (REST = intent in URL; MCP = a JSON-RPC 2.0 `tools/call` object with
  `jsonrpc`/`id`/`method`/`params`). Title "A standard API any AI app can consume". Beat 2 lights the
  shared envelope + highlights the differing body; beat 3 = policy band (OAuth / Rate limit / Log) —
  "it's just HTTP, so our gateway policies wrap it unchanged." HANDSHAKE: title "Three standard calls";
  three fixed-height rows `initialize → tools/list → tools/call`, each a `POST /mcp` with Bearer,
  response fades in per beat, first row active on arrival. ACCURACY: the MCP **consumer is our AI app —
  the MCP client inside the host — NOT the model**. The model only decides which tool + args; our
  client speaks the protocol and makes the HTTP calls. Notes attribute the three calls to the client.
- **`ToolsVsSkills.vue`** (`clicks:3`) — names the SKILL concept, AFTER tools+MCP. TOOL = one callable
  action (cool — `get_order_status(id)→JSON`, "a verb the model invokes, what it CAN do"); SKILL = a
  packaged playbook (warm — a `handle-a-refund/` folder with `SKILL.md` + policy + script, "loaded on
  demand", "a procedure the agent follows, HOW to do it well"). c0 tool; c1 skill; c2 link pill ("a
  skill orchestrates several tool calls"); c3 bridge ("tools=CAN, skills=HOW; both are just context —
  it still only decides, we still execute").
- **`AgentLoop.vue`** (`clicks:5`) — a LIVE WORKED TRACE, not a static ring. The loop ACTUALLY RUNS on
  "When will order #7788 arrive?", accumulating like a transcript: ① THINK→ACT `get_order_status(7788)`
  →OBS `{status:"shipped", eta:null, tracking:"1Z…"}`; ② THINK (THE KEY beat — the model CHOOSES its
  next step FROM the observation: "no ETA but a tracking number, follow it", with a "↑ chosen from what
  it just saw" note on its OWN reserved `.from-line` UNDER the THINK text, indented 3.8rem, opacity-
  gated, NOT absolute-positioned)→ACT `get_tracking`→OBS ETA; ③ goal met → DONE. Right-side legend
  shows the one think→act→observe loop. THE POINT (payoff band + notes): we orchestrated nothing
  between steps — the model picked step ② itself and decided when to stop. c0 goal+① THINK; c1 ① ACT+
  OBS; c2 ② THINK (causal link lit); c3 ② ACT+OBS; c4 ③ done; c5 payoff.
- **`AgentContextWindow.vue`** (`clicks:4`) — see PAIR note below.
- **`KeyTakeaways.vue`** (`clicks:4`) — the WHOLE-DECK RECAP, last content slot before the close CTA.
  Five numbered rows spanning AI → LLMs → Agents, each a durable mental model + one-line gloss: ① LLM =
  a stateless text function (text in → text out, no memory); ② it predicts, it can't check (frozen
  public model → feed it facts as context); ③ **agent = code + an LLM, looping toward a goal** (formula
  style; sub: "with memory and tools wired in, it picks its own next step until done"); ④ the model
  asks, **the APP executes** (NOT "we" — Rule 9 exception); ⑤ MCP is a standardized HTTP API (sub names
  initialize, tools/list, tools/call — same host/auth/JSON). COLOUR: ALL five rows the SAME colour
  (the COOL accent — now teal) — do NOT reintroduce per-row accents or the per-row TAG chips. Fixed-slot list, all five
  present from start at opacity 0.34; row 1 lit on arrival, clicks light rows 2–5 (no reflow). Gloss
  sits TIGHT under its head (`margin-top:0.04rem`). Title "Five things worth keeping" (accent
  "keeping"), kicker "To remember". PRESERVE the framings: LLM = stateless text→text; MCP = standardized
  HTTP API; agent = code + LLM + loop.

### Context-window PAIR (`ContextWindow.vue` + `AgentContextWindow.vue`)
Same fixed-space, colour-coded grid shown twice. The lean Part-2 one (system · history · current ·
summary · free) teaches "the window is one fixed space different things share, and when it's full the
APP acts — it compresses the oldest turns into a summary (striped cells) or starts a fresh session;
the system prompt stays pinned." It sits LAST in Part 2. The Part-3 one reuses the mechanics and adds
**tool defs** + **tool data** (the runaway space-hog — tool OUTPUT, not your prose, fills an agent's
window); when full, the agent **offloads to external memory** (striped cool/teal cells, kept OUTSIDE the
window) — making concrete the "Memory" piece from `AgentRuntime`; goal-beat caption uses the loop's
"#7788" example. NB: do NOT frame as money/"budget"/"rent" — it's about space and what fills it; do
NOT show tokens just "falling out" — show the real resolution (compress / new session / offload).
Segment order is FIXED (system → … → free) so cells only change colour in place, never reflow (Rule 4).
Token scale differs on purpose: 0.5k/cell (Part-2), 2k/cell (Part-3). Both use striped cells (45°
gradient) for the compressed/offloaded segment.

## Open / current state

- **Build compiles clean** (`slidev build`).
- **Battle — live sync VERIFIED end-to-end against prod** (heartbeat resync + fixed-point scoring +
  `onSlideEnter` timing; public-streams AnyCable; no-`correct`-in-payload invariant). Verify the full
  pub/sub loop with standalone Node scripts (`/tmp/anycable-test.mjs`, `/tmp/battle-flow.mjs`).
  Follow-ups (not blockers): (1) opener questions still test concepts taught later — improve to be
  fair as an icebreaker; (2) may add more quiz rounds at the END later; (3) visual QA the Battle in
  BOTH light and dark (built dark-only originally — check QR panel, option cards, podium rank numbers,
  brand logos, 40-player chip grid, accent legibility on the light canvas).
- **KNOWN MINOR (fix later):** at real canvas res (980×551), do a click-by-click pass on
  `ToolRoundtrip` / `AgentLoop` / `ToolsVsSkills` / `KeyTakeaways` to confirm no row/band overlap.
- **Photos.** Hero backgrounds are gradient placeholders until a real file is dropped at the path (no
  code change needed). REAL (present on disk): `cover.jpg`, `humility.jpg`, `part-1.jpg`, `part-2.jpg`,
  `part-3.jpg`, `prediction-at-scale.jpg` (rocket/liftoff), `but-limits.jpg`, `close.jpg`,
  `victor-bahl.jpg`. No hero is on a placeholder anymore. (`part-2b.jpg`/`part-4.jpg` exist but are
  unreferenced — cut slides.) `public/img/to-use/` is the untracked candidate-photo staging folder.
- **Open:** full visual QA pass; PDF/PPTX export (needs `playwright-chromium`; browser download
  sandbox-blocked — install to `./.pw-browsers` with sandbox off, see Lesson 5).

## Engineering lessons (do NOT repeat these)

1. **Never use `layout: none` for themed slides.** `none` is bare `<div><slot/></div>` with NO
   `.slidev-layout` class; our theme is scoped to it, so `none` slides render UNSTYLED. Use
   `layout: default`. Full-bleed stages still work: `position:absolute; inset:0` to ignore the
   layout's padding (`.slidev-page` is `position:relative`).
2. **Keep shared CSS global, not in per-slide `<style>`.** Structural classes used by many slides
   (`.stage`, `.demo-stage`, `.demo-head`, `.title-row`, `.spine/.step`…) belong in `styles/index.css`;
   a per-slide block is scoped to that slide and silently un-styles every other slide that used them.
3. **A component that reads `$clicks` needs the slide to declare `clicks: N`.** Otherwise only the
   first step shows. Set `clicks:` to the component's step count.
4. **Dev-server hot-reload corrupts on file delete/rename while running.** Fix: kill server,
   `rm -rf node_modules/.vite`, relaunch, hard-refresh.
5. **Sandbox notes.** Dev server can't bind a port in-sandbox (`listen EPERM`) — run sandbox-off.
   `npm` cache hits EPERM — use `--cache "$TMPDIR/npm-cache"`. `playwright-chromium`'s post-install
   download is blocked — `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` to install the package, then install the
   browser into a writable path (`PLAYWRIGHT_BROWSERS_PATH=./.pw-browsers`) sandbox-off.
6. **Never put `v-if` and `v-for` on the SAME element (Vue 3).** `v-if` evaluates BEFORE `v-for`, so
   the loop var doesn't exist yet — it throws (invisible to `slidev build`, breaks at runtime).
   Precompute the filtered list in `<script>` and `v-for` over that.
7. **`Math.random()` / `Date.now()` are unavailable in some run contexts.** For decorative jitter use a
   deterministic index seed: `const rnd = (i) => { const x = Math.sin(i*12.9898)*43758.5453; return x - Math.floor(x) }`.
8. **EMPTY-SLIDE GOTCHA.** A `src:`-included file whose FIRST line is an HTML `<!-- … -->` comment
   (before the first `---`) renders a STRAY BLANK slide. Start every include with `---`; put the header
   comment AFTER the first frontmatter (see `06-close.md`).
9. **No local functions — test the Battle by deploying.** `npm run dev` serves SLIDES only; the
   Battle's functions only run on the deployed Netlify site (prod env vars in the dashboard). Push to
   `main` → auto-deploy → exercise on `vb-gen-ai.netlify.app`. Don't re-add a local-functions path
   unless asked.
10. **Confirm the tool fits the need BEFORE building on it.** Anchoring on `slidev-addon-slide-quiz`
    (anonymous aggregate polling) before checking it could do names/scores/podium cost a from-scratch
    rebuild. When the user names a concrete product/behaviour, verify the candidate actually does THAT.
11. **Test BOTH halves of a pub/sub system — broadcast OK ≠ subscribe OK.** Broadcasts 200'd (signed
    with the Broadcast key) while every WebSocket subscribe was rejected (`unauthorized`) due to a
    non-blank AnyCable Application secret. Verify the FULL loop (subscribe→broadcast→RECEIVE) with a
    standalone Node script using the real client lib.
12. **One-shot broadcasts are fragile — add a heartbeat resync.** Re-broadcast current state on an
    interval (2s) so clients self-heal (missed msg, late join, reconnect, backgrounded tab) and
    functions stay warm. Make the receiver idempotent (signature-guard the render) so heartbeats don't
    flicker or interrupt input.
13. **Drive Slidev slide-phase side-effects from `onSlideEnter`, NOT `onMounted`.** Slidev keeps slides
    mounted + pre-renders neighbours, so `onMounted` fires once at an unpredictable time and never
    re-fires on back-navigation. Use `onSlideEnter` (+ `onSlideLeave` to undo).

## Rules (newest at the bottom)

1. **Language.** The user writes/comments in French. **All deliverables stay in English** — slides,
   speaker notes, code, comments, and this file.
2. **Background photos = placeholders.** Never bake in a chosen photo. Each hero references a file
   under `public/img/` (e.g. `cover.jpg`); if absent, a tasteful gradient placeholder shows; drop the
   file at that path and the photo appears — no code change. (The on-slide photo-placeholder corner
   tags were removed; `Hero.vue` no longer renders `.photo-tag`.)
3. **No background block behind text.** Text on a photo/hero sits DIRECTLY on the image — no scrim,
   veil, or panel. Use `text-shadow` for legibility.
4. **Build-up slides must not move.** Like a physical page: each click adds something on top and never
   displaces existing elements. Every element owns a fixed slot from the start (fixed-size canvas, CSS
   grid, or absolute positioning); reveals toggle only OPACITY — never insert/reflow. Nothing overflows
   the slide edges at any step. The slide lands with its first beat already visible (Rule 8). Avoid
   `layout: center` for build-ups.
5. **No on-slide "API analogy" callout.** Drop the 🔌 emoji/badge. (Brief API parallels may stay in
   speaker notes only.)
6. **Animations: beat-driven, eased, one-shot — not ambient loops.** Each click triggers ONE eased,
   finite reveal (line draws in via `stroke-dashoffset`, a point fades to its slot, a bar grows, a
   value appears). Use `cubic-bezier(0.22, 1, 0.36, 1)` and stagger via `transition-delay`. AVOID
   infinite ambient flow/pulse (the blinking "generating" caret is the one allowed loop). To REPLAY a
   one-shot animation on a later beat, bump a `:key` to remount. Still obeys Rule 4 — animate INTO a
   reserved slot; nothing reflows.
7. **"INFERENCE" design system — the prediction spectrum** (replaced the MuleSoft brand palette
   2026-06-23, user: "improve it globally … fresh, coherent, beautiful"; chosen via the
   `frontend-design` skill). The deck is rendered in the model's own grammar: a cool→hot token-
   probability spectrum. Drive ALL colour through `styles/index.css` tokens (day `:root` + `html.dark`
   blocks); do NOT bake hex/rgba accent literals into components.
   - **PALETTE — a heat ramp.** **Cool = pine-teal** (`--cool` `#0e8a86` / `--cool-bright` `#0b5e57`;
     night `#2dd4bf`/`#5eead4`) = the structured side: our systems / grid / committed. **Warm = coral**
     (`--warm` `#f26b5b` / `--warm-bright` `#c0422f`; night `#ff8473`/`#ffa99b`) = the model side: the
     predicted/live token. **Gold = the ramp MIDDLE** (`--gold` `#e0a32e` / `--gold-bright` `#9a6a06`;
     night `#f5c451`/`#ffd97a`) — SCOPED to the spine/part-openers (the LLMs part), NOT a general
     accent. Teal+coral are a true complementary pair so the cool/warm semantic split (our-systems vs
     the-model) still reads at a glance across Grounding / ToolRoundtrip / the context-window pair.
     `--good`/`--bad` stay green/red, kept distinct from coral.
   - **CANVAS.** Day = **warm ivory** `--bg #f7f5f0` (bright, paper-like — NOT the greige `#e7e9e4`
     it briefly was 2026-06-23, user: "depressing … beige"; and NOT cream). Night = **ink** `#0e1413`
     (faint teal-green undertone) — teal+coral glow like a heat-map, the dim-room mode.
   - **TYPE.** `--serif` = **Spectral** (display, literary; echoes "prediction spectrum") · `--sans` =
     **Hanken Grotesk** (body) · `--mono` = **IBM Plex Mono** (token chips / code / data / kickers).
     Replaced Fraunces+Inter+JetBrains. `AttentionFlip.vue`'s SVG `charW()` glyph-advance metrics were
     re-tuned for Spectral (narrower than Fraunces).
   - **SIGNATURE — the spine as a TOKEN STREAM + the caret as the deck's cursor.** `PartOpener.vue`
     renders AI›LLMs›Agents as mono token-CHIPS on the heat ramp: each part owns ONE hue everywhere
     (AI=teal, LLMs=gold, Agents=coral); the CURRENT part is lit (filled tint + glow + a BLINKING
     caret = "you are here, generating"), the others sit dim as outlined chips in their own hue (user:
     "either 3 different colours or one" → 3, encoding the spectrum). A `pos NN / 03` mono read-out
     leads the spine. The agenda (`01-intro.md`) matches via `.grad-cool/gold/warm` words + a heat-ramp
     `.rm-rail` per card (`margin-top:auto` pins all three rails to the card BOTTOM so they align even
     when text wraps). `PartOpener`'s `accent` prop was REMOVED (hue is derived from `active`).
   - **BLINKING CARET is RESERVED** for live "generating" moments only — the spine's active chip and
     the predictor's caret (Rule 6's one allowed loop). The global `.kicker` is mono + a NON-blinking
     bold `›` prefix (user: "the > should be bolder … everywhere"); do NOT add a blinking caret to it.
   - **Token TINTS use RGB-triple tokens:** `--cool-rgb`/`--warm-rgb`/`--gold-rgb` (synced day+night).
     Components write `rgba(var(--cool-rgb), 0.1)` etc. — NEVER bake the brand hex into an rgba. A
     palette swap then propagates to every tint/glow (this is what makes "try another palette" cheap).
   - The day `-bright` text shades are too dark on dark photos, so a rule lights `.hero .grad-warm /
     .grad-gold / .grad-cool` (and the `.part-opener` ones) as the BRIGHT `--warm`/`--gold`/`--cool`
     + text-shadow for accent words over hero images.
   - The PHONE (`public/battle.html`) is self-contained (its own `:root`, not Slidev tokens) — its
     palette mirrors the deck's NIGHT tokens (ink + teal + coral) and is kept in sync BY HAND. The
     MuleSoft/Informatica logo lockup on the phone is PRODUCT branding (Hackathon · SE French Team),
     separate from the deck theme — leave it.
8. **No blank first click — slides land with their first beat showing.** The title-row carries NO
   `v-click` (always visible). The first revealable element starts at `v-click="1"`, and `clicks:` =
   number of reveals AFTER the first beat (title + 3 cards → `clicks: 3`). For `$clicks` components, the
   first step renders at `$clicks === 0` (gate `c >= i`, not `c > i`).
9. **Voice = "we", not "you".** The presenter is part of the team/audience. Say "we"/"our" (the systems
   we run, the APIs we ship) — never "you"/"your" at the room. (Neutral generic "you" is fine when
   unavoidable.)
   - **EXCEPTION — the tool-execution actor is "the app", NOT "we".** In the model-asks / something-
     executes narrative, the executor is the AGENT/APP/our code: "the model asks, the app executes",
     "the app holds the credentials and makes the call", "our code runs it" — never "WE execute". "We"
     is for the team that BUILDS and RUNS the systems, not the runtime act of calling a tool.
10. **Speaker notes = a bullet-point teleprompter with a fil rouge.** Every slide's `<!-- … -->` note
    follows ONE fixed template (reference: the predictor slide "How a prompt becomes a prediction").
    - **B1 English.** International audience, non-native. Short simple sentences, common words, no
      idioms. (Slides keep their copy; this is about the NOTES.) Still all-English (Rule 1), "we" not
      "you" (Rule 9).
    - **Bullet points, not prose** — one point per line (Markdown `- `).
    - **Sync to clicks with the OFFICIAL marker:** a literal `[click]` line before each beat's bullets
      (Slidev highlights the matching block). Do NOT invent `[click 1 — X]` text. The first beat /
      SET-UP has no `[click]`. Beat count = the slide's `clicks:`.
    - **Fil rouge markers** (each on its own line): `◀ **IN** ·` bridges FROM the previous slide;
      `▶ **OUT** ·` bridges INTO the next — these MUST chain (a slide's OUT sets up the next slide's
      IN). Optional `🧭 **SPINE** ·` = why this slide matters in the whole arc. `★` inline = the one
      beat not to skip under time pressure.
    - **Be generous with oral-only value — IN THE FLOW.** Add facts NOT on the slide worth saying out
      loud (EOS/stopping, temperature, billing, analogies, likely audience questions) INSIDE the beat
      they belong to, as extra bullets — NOT in a separate "Say orally"/"Q&A" section. Mark
      ask-only items inline `(if asked: …)`.
    - **Structure, top to bottom:** `◀ IN` → optional `🧭 SPINE` → `**SET-UP**` → one `[click]` block
      per beat (`**① LABEL**` + bullets) → `▶ OUT`. No trailing oral-only block.
11. **Battle answers must not be tell-able by LENGTH.** In `battleConfig.ts` the `correct` option must
    NOT be the conspicuously longest/most-detailed/most-qualified one. Keep all four options roughly
    the same length and specificity; pad distractors when the right answer needs more words. (Insider
    in-jokes are fine — e.g. the GoT icebreaker's option D "Lila Dorato" is our boss, a deliberate plant.)
