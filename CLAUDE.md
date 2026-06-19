# CLAUDE.md — working rules for this deck

This is a living rulebook for the **GenAI Fundamentals** Slidev deck.
Every rule the user gives is recorded here and must be respected on every slide.
(Session-by-session history lives in git; this file keeps only durable facts + current open items.)

## Project

- Slidev deck: "AI → LLMs → Agents" — a visual, interactive intro to Generative AI.
  Audience: technical MuleSoft Solution Engineers (API management, integration, AI gateway).
  Fil rouge: **AI → LLMs → Agents** (quick map of the field → how one model works → what we build
  that acts). ~45 min, English. Neutral/unbranded. Running example: "order status across systems".
- Entry point: `slides.md`. Custom components in `components/` (auto-imported).
- Global theme/tokens in `styles/index.css`.
- RUN LOCALLY (slides only — by design):
  - `npm run dev` — Slidev (localhost:3030). This is the ONLY local workflow. It serves the SLIDES;
    the live Battle's serverless functions 404 locally, so phones can't relay answers. That's fine —
    we edit + preview slides locally and test the Battle end-to-end on the DEPLOYED site (below).
    Binds a port → run OUTSIDE the sandbox.
  - NO local-functions workflow anymore (the old `npm run dev:netlify` / `netlify dev` path + the
    `netlify-cli` devDep + `.env`/`.env.example` were removed 2026-06-19, per user: "keep locally only
    the slides; to test the quiz, push so Netlify does the job"). To test the Battle: push to `main`,
    Netlify auto-deploys, the functions run there. Local secrets are gone; prod secrets live ONLY in
    the Netlify dashboard env vars (see DEPLOY).
- DEPLOY: **Netlify**, **auto-deploys on every push to `main`** (site is GitHub-linked: provider
  github, allowed_branches [main]). Replaced GitHub Pages 2026-06-18 (`.github/workflows/deploy.yml`
  removed). Config in `netlify.toml`: `npm run build` → publish `dist/`, functions in
  `netlify/functions/`, served at site ROOT (no `--base /repo/` sub-path). Manual deploy still works:
  `npx netlify deploy --build` (draft) / `--prod`. Live site: `vb-gen-ai.netlify.app`. Pages was
  dropped because the live Battle needs serverless functions, which Pages can't run. Prod env vars
  (`ANYCABLE_BROADCAST_URL` + `ANYCABLE_BROADCAST_KEY`) live ONLY in the Netlify dashboard.
- OLD LIVE QUIZ — REMOVED (2026-06-19). The `slidev-addon-slide-quiz` POLL (anonymous, aggregate
  bar-chart; `layout: quiz`/`quiz-results`) was the wrong tool (Engineering lesson 10) and is gone:
  deleted `slides/quiz-llm-limits.md`, `public/quiz.html`, `netlify/functions/quiz-answer.mts` +
  `quiz-sync.mts`, the poll-only schemas in `shared.mts`, and the `addons:`/`slideQuiz:` frontmatter
  in `slides.md`. Do NOT resurrect it — the Battle is the one and only audience interaction.
  (The `slidev-addon-slide-quiz` PACKAGE stays installed: `BattleLobby.vue` reuses its `SlideQuizQR.vue`
  for the QR. It's just no longer registered as a Slidev addon.)
- LIVE BATTLE (custom-built — the one audience interaction): a named, scored, Kahoot-style competition.
  Now the deck OPENER — `slides/battle.md` is included right after `01-intro.md` (humility + agenda),
  per user: "start with a quiz; we might add more at the end later." (Questions still cover later
  concepts — flagged to improve later; not a blocker.) Architecture: the DECK is the scoring authority
  — it holds the answer key + scores and is the only place that knows who's right; phones
  (`public/battle.html`) only get the question (text+options, NO `correct`), live "answered" counts,
  and their OWN rank. Reuses the AnyCable + Netlify infra. Pieces: `components/battle/useBattle.ts`
  (engine: listen players/answers, score, push state). SCORING is deliberately SIMPLE + bulletproof
  (user: "simplify, no timer"): correct = 1000 pts FIXED, wrong = 0 — no speed bonus, no countdown, no
  cross-device clock (`POINTS` const; the old BASE+SPEED+timestamp model + `seconds`/`questionStartedAt`
  were removed 2026-06-19). SYNC RELIABILITY: state is pushed immediately on change AND re-broadcast on
  a 2s HEARTBEAT (`HEARTBEAT_MS`, started in `connect()`, cleared in `disconnect()`). The heartbeat is
  the key fix for "move slide → phone didn't update": a phone that missed a one-shot broadcast (signal
  blip, backgrounded tab, late join, reconnect) self-heals within ~2s, AND the steady traffic keeps the
  Netlify function warm (kills cold-start lag). All three battle slides drive their phase via
  **`onSlideEnter`, NOT `onMounted`** — Slidev keeps slides mounted + pre-renders neighbours, so
  `onMounted` fired at the wrong time and broke back-navigation (revisiting the podium never re-pushed
  `final`). `battleConfig.ts` (questions + answer key + shared singleton `battle()`; `BATTLE_WS_URL`
  here, and `battleGroupId()` — the ROOM: `?groupId=<id>` in the deck URL forces a fixed shareable room,
  else a FRESH random room generated once + kept stable for the browser session via sessionStorage, so
  every run starts clean and never collides with old scores; SSR-safe, falls back to `genai-battle` at
  build time). `BattleLobby.vue` (QR + live names; copy is "Scan. Name yourself. Play."),
  `BattleQuestion.vue` (clicks:2 — open→lock→reveal, shows OPEN/LOCKED not a timer; reuses the addon's
  `SlideQuizQR.vue`), `BattleLeaderboard.vue` (clicks:3 — podium reveals 3rd→2nd→1st). PHONE
  (`public/battle.html`): incoming state never re-renders the join form (the heartbeat was wiping a
  half-typed name + stealing focus); a render-SIGNATURE guard skips no-op heartbeats (no flicker, never
  interrupts a tap). Functions: `netlify/functions/battle-{shared,join,answer,state}.mts` (3 streams:
  players/answers/state). THEME: Battle slides are NORMAL themed slides — they read the standard tokens
  and follow Slidev's day/night toggle (the old forced-dark `.battle-slide` override was removed
  2026-06-19); only `.battle-slide { padding: 0 }` remains, for full-bleed.
  INFRA — AnyCable PUBLIC MODE REQUIRED: the Fly app (`vb-cable-4vsc.fly.dev`) MUST have a BLANK
  Application secret (plus.anycable.io → the cable → clear "Application secret"). It's a public-streams
  app: deck + phones connect with NO token. A non-blank app secret makes the WS handshake return
  `{"type":"disconnect","reason":"unauthorized"}` / close "Auth Failed" → deck shows 0 players + phones
  stuck "waiting for the host" (broadcasts still 200 because they use the separate Broadcast key, which
  STAYS set + matches `ANYCABLE_BROADCAST_KEY`). This bit us 2026-06-19. RPC URL/key stay empty.
  Scoring + sync + the "no `correct` in the broadcast payload" invariant were verified end-to-end
  against PROD (Node subscribe→broadcast→receive + full join/answer/state flow; `/tmp/anycable-test.mjs`,
  `/tmp/battle-flow.mjs`).
- SPINE HISTORY: the original "Compute → Reason → Act" triad was retired for **AI → LLMs → Agents**.
  Do NOT resurrect the two dead part-opener heroes ("Seventy years in one breath", "It predicts the
  next word. That's it."). Tools/MCP + agents are ONE part (Part 3 "Agents").

## Deck structure (3 parts)

Cover · Humility · Roadmap (AI · LLMs · Agents) · **AI Battle** (opener icebreaker — `slides/battle.md`,
included right after `01-intro.md`; see LIVE BATTLE above) ·
**1 — AI** (`02-reason-history.md`): PartOpener / "GenAI is a small box" zoom / Timeline /
"Prediction→reasoning" claim ·
**2 — LLMs** (`03-reason-llm.md`): PartOpener / NextTokenPredictor / AttentionFlip /
StatelessReplayStack / StatelessReplayFilmstrip / ContextWindow / "…reasoning…" claim Hero /
"But…" turn Hero (`but-limits.jpg`) / Hallucination ("the limits") / Grounding (closing run:
celebrate → deflate → name the limits → show the fix → bridge into Part 3's tools) ·
**3 — Agents** (`04-act-tools.md` + `05-act-agents.md`, ONE part, TOP-DOWN order): PartOpener /
AgentRuntime ("what is an agent" — UP FRONT) / ToolRoundtrip (tools) / McpEnvelope / McpHandshake /
ToolsVsSkills (skills — after tools+MCP) / AgentLoop (live worked trace) / AgentContextWindow /
A2A (protocol-technical, Agent Cards) · Close (hackathon CTA).
Within Part 2, STATELESS comes BEFORE the context window (no-memory truth motivates "so how much
fits in one call?" → the window → bridges into agents).

PART OPENERS: each part opens with a `PartOpener.vue` hero showing a SPINE PROGRESS bar — the full
"AI › LLMs › Agents" spine with the current part lit (accent underline), others dimmed — over a bg
photo, then the part number + headline + a sub-line of TAGS mapping to that part's contents:
Part 1 = "where GenAI fits · a short history · prediction at scale"; Part 2 = "tokens · attention ·
stateless · the context window"; Part 3 = "tools · MCP · the agent loop · A2A". Part 1 = cool/azure
(`accent="cool"`, `bg="part-1.jpg"`); Parts 2 & 3 = warm/gold (`part-2.jpg`, `part-3.jpg`). Same
placeholder/text-shadow rules as `Hero.vue` (Rules 2/3) and token-driven accents (Rule 7).

CUT SLIDES — do NOT resurrect: (a) Part-2 "the most important slide" remembers-nothing hero
(`part-2b.jpg`) + the "It has no memory" payoff statement; (b) Part-3 thematic opener "A mind with
no hands." (now the Agents PartOpener) + the "When the model drives." pivot hero (`part-4.jpg`,
folded into AgentLoop notes); (c) the close line "From calculators to colleagues." (now "Less magic.
More system."); (d) the end-of-part "Anatomy of an agent" recap slide (its job is done up front by
`AgentRuntime`); (e) Part-1 alternates `FieldMapV2.vue` (4-ring nested map) + `TimelineV2.vue`
(3-era/hinge timeline) — user kept the ORIGINAL "small box" zoom + `Timeline.vue` on both;
(f) a SECOND NextTokenPredictor (there is ONE); (g) the predictor's deleted mesh/map/grid/features/
spectrum explorations. `part-2b.jpg`/`part-4.jpg` placeholders are no longer referenced.

## Components

`Hero.vue` (Archetype A), `PartOpener.vue` (part-opener hero w/ spine bar), `Timeline.vue`,
`NextTokenPredictor.vue`, `AttentionFlip.vue`, `ContextWindow.vue`, `AgentContextWindow.vue`,
`StatelessReplay.vue`, `McpEnvelope.vue`, `McpHandshake.vue`, `AgentRuntime.vue`, `ToolRoundtrip.vue`,
`ToolsVsSkills.vue`, `AgentLoop.vue`, `A2A.vue`, `Hallucination.vue`, `Grounding.vue`.

### Part 1 (AI)
- **"Small box" zoom** (inline in `02-reason-history.md`): nested AI ⊃ ML ⊃ GenAI boxes. The gold
  `.nbox.gen` was shrunk to read visibly smaller inside ML/AI — inset `120px 236px 54px 236px`
  (≈168×82px), `.nlabel` 0.6rem, `.gen-sub` 0.85rem.
- **`Timeline.vue`**: milestones gated `c >= i` (first free), `clicks:4`. 1950s = "Symbolic AI"
  (NOT "Expert systems", which are 70s–80s).

### Part 2 (LLMs)
- **`NextTokenPredictor.vue`** (`clicks:8`) — "how a prompt becomes a prediction", the D5 pipeline
  (prompt → tokenise → numbers → weights → predict → loop; FT-inspired, see ig.ft.com/generative-ai).
  Design (all per user): (1) prompt is a QUESTION "What's the best Salesforce acquisition ?" (space
  before "?" telegraphs it's its OWN token); (2) "acquisition" stays ONE token (only "What's"→What+'s
  and "Salesforce"→Sales+force split); (3) on arrival the grey input field hugs the QUESTION TEXT
  (width = text length) and shows NO cursor; (4) the warm caret appears ONLY after the first token
  (MuleSoft) is generated (gated on `predicting`), then rides the trailing edge + blinks; (5) the
  FIRST distribution is a CLOSE race — MuleSoft .30, Slack .24 = Informatica .24 (tied), Tableau .14
  — so "ranked guess, not a fact" lands harder; (6) captions are larger (`.cap` 12px / `.cap.top`
  13px, fill `--ink-soft`), two-line; (7) INFERENCE is named here — weights caption reads "billions ·
  learned once = training" / "one pass through them = inference" (keywords warm `.kw`), and the WEIGHTS
  speaker note spells out training vs inference + ties it to stateless/grounding (we change the
  *context* fed to inference, not the weights).
  LAYOUT: (a) "tokens — sub-word pieces" caption centred under the prompt row via `PROMPT_MID`, `y=92`;
  (b) the pipeline below the prompt row is wrapped in `<g class="lower">` shifted `translateY(36px)`
  (viewBox height 436); (c) "each token's meaning…" caption LEFT-aligned to `NUMCAP_X`; (d) long
  column headers truncated via `headLabel()` (>6 chars → 5+`…`); (e) the numbers→weights arrow is
  DYNAMIC — centred between `numRightEdge` (grows as tokens generate) and the weights grid `WX`.
- **`AttentionFlip.vue`** (`clicks:2`) — FT "bank" idea: same word, two sentences, attention arcs draw
  to the neighbours that fix its meaning. Sentence A shows at `r >= 0`. Optional (see its notes).
- **`StatelessReplay*`** — the "stateless truth" pair. STACK builds TURN ONE up by clicks (c0 LEFT
  question only → c1 +POST body → c2 +LLM "generating…" → c3 +answer returns; turns 2 & 3 are one
  animated cycle each; takeaway c6; `clicks:6`). A `.stepped` class (turn 1 only) kills timed CSS
  animations and drives "generating…"→answer off click gates (`showLLM`/`showAns`) with a clean fade
  handoff. The LLM box head label is just **"LLM"**. FILMSTRIP ("Seen another way"): each POST renders
  the ACTUAL request JSON — top-level `model:"claude-opus-4-8"` + `system`, then a `messages:[…]` array
  of `{role,content}`. Prior turns dimmed (`.msg.replay`); the one new line/call is the warm-highlighted
  `{role:"user",…}` (`.msg.new`). Token count includes the system string. The current turn's ANSWER is
  NOT in the POST body (not produced when the call is sent). JSON is div-per-line (`.jl` + `.ind1`/`.ind2`),
  NOT a `<pre>` (those render stray blank lines).
- **`ContextWindow.vue`** (`clicks:5`) — see PAIR note below.
- **`Hallucination.vue`** (`clicks:3`) — "THE LIMITS", GENERIC (no order demo — user disliked the
  #7788/confidence-gauge version). Title "It sounds certain — and can't know OUR facts". Three
  structural-limit CARDS converging on one root cause: c0 card 1 🔒 "Only public knowledge" lit (others
  dimmed at opacity 0.28); c1 card 2 🧊 "Frozen in the past"; c2 card 3 🎲 "Guesses — never checks"
  (= hallucination); c3 root-cause band "One cause behind all three: a frozen, public model that can
  only predict text — it can't go and check. So we don't change the model. We feed it the facts." Each
  card has a bottom red consequence pill (blind to our data / no fresh data / hallucination). Lit cards
  get warm border-top + glow. TEACHING POINT: only-public-data, no-fresh-data, hallucination are three
  FACES of one root cause; "can only predict text, can't check" is the can't-act bridge into grounding.
- **`Grounding.vue`** (`clicks:2`) — decision diagram, "two places its knowledge can live — change ONE".
  Even-handed (per user — changing weights IS a real option; be non-provocative). **Weights teach SKILLS
  & BEHAVIOUR; context carries the FACTS** — BOTH paths legitimate, solve different jobs.
  Path A = change the WEIGHTS: Re-train = "for deep domain skill" (powerful, costly, rare); Fine-tune =
  "for tone & behaviour" (shapes HOW it responds; weak for facts only because it can't cite + goes stale).
  Path B = change the CONTEXT, weights frozen: RAG = retrieve static docs ("for our private docs");
  Tool calls = live authoritative API ("for live facts", lit warm as "what we build next"). Per-card
  pills are NEUTRAL use-case labels tinted to their column (cool/warm), NOT pass/fail ✗/△/✓. The two
  columns are visually EQUAL. Context still LANDS as the lever for facts-that-change (the tools bridge),
  said ORALLY (the payoff band was removed). GROUNDING MODEL (validated): knowledge = weights OR context;
  fix one. RAG-vs-tools-by-data-shape (static unstructured docs vs live structured API) is the accuracy
  nuance that must stay. HONEST CAVEAT: grounding cuts hallucination on covered facts, never to zero.

### Part 3 (Agents)
- **`AgentRuntime.vue`** (`clicks:4`) — "WHAT IS AN AGENT", defined UP FRONT. Engine+attachments diagram
  on a fixed 780×300px stage (SVG wire layer 1:1 to px, AgentLoop-style; HTML nodes on top, Rule 4).
  c0 bare LLM core ("on its own it only reasons"); c1 +GOAL in +LOOP arc +dashed AGENT boundary ("decides
  its own next step"); c2 +TOOLS docked; c3 +MEMORY docked; c4 +ANSWER out +payoff band ("an agent is the
  LLM, wrapped to act: a loop + goal + tools + memory — nothing new"). Colours (Rule 7): core/loop/memory
  warm, tools cool, goal/answer good. Example matches the loop: "When will order #7788 arrive?" → "Shipped
  — arriving Jun 20."
- **`ToolRoundtrip.vue`** (`clicks:3`) — TOOLS, request→execute→return round-trip across a TRUST BOUNDARY.
  A dashed centre line splits "the model · text only" (left, warm) from "our side · executes" (right, cool);
  real artefacts (a `tool_use` JSON request → our `GET …/orders/7788` with Bearer → the `{status,eta}`
  result). c0 model's request; c1 crosses boundary, our code runs it; c2 result folded back; c3 payoff
  ("the model never touches our systems — it requests, we execute").
- **`McpEnvelope.vue` + `McpHandshake.vue`** — the MCP pair, both `clicks:3`. ENVELOPE: REST (left) vs MCP
  server (right) as TWO HTTP requests with the SAME Bearer auth + JSON content type — only the body differs
  (REST = intent in URL; MCP = a JSON-RPC 2.0 `tools/call` object with `jsonrpc`/`id`/`method`/`params`).
  Title "A standard API any AI app can consume". Beat 2 lights the shared envelope + highlights the
  differing body; beat 3 = policy band (OAuth / rate-limit / audit / WAF) — "it's just HTTP, so our gateway
  policies wrap it unchanged." HANDSHAKE (replaced the old Mermaid sequence): three fixed-height rows
  `initialize → tools/list → tools/call`, each a `POST /mcp` with Bearer, response fades in per beat,
  first row active on arrival. ACCURACY: the MCP **consumer is our AI app — the MCP client inside the host
  — NOT the model**. The model only decides which tool + args; our client speaks the protocol and makes the
  HTTP calls. Notes attribute initialize/tools/list/tools/call to the client, not the model.
- **`ToolsVsSkills.vue`** (`clicks:3`) — names the SKILL concept, placed AFTER tools+MCP. Two cards: TOOL =
  one callable action (cool — `get_order_status(id)→JSON`, "a verb the model invokes, what it CAN do");
  SKILL = a packaged playbook (warm — a `handle-a-refund/` folder with `SKILL.md` + policy + script,
  "loaded on demand", "a procedure the agent follows, HOW to do it well"). c0 tool; c1 skill; c2 link pill
  ("a skill orchestrates several tool calls"); c3 bridge ("tools=CAN, skills=HOW; both are just context —
  it still only decides, we still execute").
- **`AgentLoop.vue`** (`clicks:5`) — a LIVE WORKED TRACE, not a static ring. The loop ACTUALLY RUNS on
  "When will order #7788 arrive?", accumulating like a transcript: ① THINK→ACT `get_order_status(7788)`→OBS
  `{status:"shipped", eta:null, tracking:"1Z…"}`; ② THINK (the KEY beat — the model CHOOSES its next step
  FROM the observation: "no ETA but a tracking number, follow it", highlighted "↑ chosen from what it just
  saw")→ACT `get_tracking`→OBS ETA; ③ goal met → DONE. Right-side legend shows the one think→act→observe
  loop. THE POINT (payoff band + notes): we orchestrated nothing between steps — the model picked step ②
  itself and decided when to stop; THAT is the agentic loop. c0 goal+① THINK; c1 ① ACT+OBS; c2 ② THINK
  (causal link lit); c3 ② ACT+OBS; c4 ③ done; c5 payoff.
- **`AgentContextWindow.vue`** (`clicks:4`) — see PAIR note below.
- **`A2A.vue`** (`clicks:3`) — protocol-technical, a deliberate MIRROR of the MCP pair ("discover the
  agent, then delegate a task" = MCP's "discover the menu, then call"). Two agents (Orchestrator warm /
  Orders specialist cool) + three exchange rows like the handshake: ① DISCOVER `GET /.well-known/agent.json`
  → the Agent Card {name, skills, url}; ② DELEGATE `POST message/send` → a Task; ③ RETURN a
  `Task {state:"completed", result}`. c0–c2 walk the rows; c3 payoff ("same Bearer-over-HTTP envelope as
  MCP → same gateway policies"). A2A spec shape light but accurate (Agent Card at /.well-known/agent.json;
  Task lifecycle submitted→working→completed).

### Context-window PAIR (`ContextWindow.vue` + `AgentContextWindow.vue`)
Same fixed-space, colour-coded grid shown twice. The lean Part-2 one (system · history · current ·
summary · free) teaches "the window is one fixed space different things share, and when it's full the
APP acts — it compresses the oldest turns into a summary (striped cells) or starts a fresh session;
the system prompt stays pinned." It sits LAST in Part 2 ("no memory → we resend everything → so how
much fits in one call? → the window"). The Part-3 one reuses the mechanics and adds **tool defs** +
**tool data** (the runaway space-hog — tool OUTPUT, not your prose, fills an agent's window); when
full, the agent **offloads to external memory** (striped azure cells, kept OUTSIDE the window) —
making concrete the "Memory" piece from `AgentRuntime`. Its goal-beat caption uses the loop's example
("when will order #7788 arrive?"). NB: do NOT frame as money/"budget"/"rent" — it's about space and
what fills it; do NOT show tokens just "falling out" — show the real resolution (compress / new
session / offload). Segment order is FIXED (system → … → free) so cells only change colour in place,
never reflow (Rule 4). Token scale differs on purpose: 0.5k/cell (Part-2), 2k/cell (Part-3, agent
tool output is big). Both use striped cells (45° gradient) for the compressed/offloaded segment.

## Open / current state

- **Build compiles clean** (`slidev build`, verified 2026-06-19 after the quiz→battle rework).
- **BATTLE — live sync VERIFIED end-to-end against prod 2026-06-19** (heartbeat resync + fixed-point
  scoring + onSlideEnter timing; public-streams AnyCable). Follow-ups (user-flagged, not blockers):
  (1) the opener questions still test concepts taught later in the deck — improve them to be fair as an
  icebreaker; (2) may add MORE quiz rounds at the END later; (3) the Battle is theme-aware — do a visual
  QA pass in BOTH light and dark (built dark-only originally; check QR panel, option cards, podium rank
  numbers, accent legibility on the light canvas). Functions only run on the deployed site (lesson 9).
- **KNOWN MINOR (fix later, do NOT block):** `ToolRoundtrip`'s right-hand column (two stacked cards)
  sits a touch tall — its lower card slightly kisses the payoff band at real canvas res (980×551);
  stage height was mid-adjustment (currently 330px). Do a click-by-click pass on
  `AgentLoop`/`A2A`/`ToolsVsSkills` at real res to confirm no row/band overlap.
- **Photos.** Hero backgrounds are gradient placeholders until a real file is dropped at the path
  (no code change needed). REAL: `but-limits.jpg` (dark foggy forest path, "can't see ahead"). Still
  placeholders: `cover.jpg`, `part-1/2/3.jpg`, `prediction-at-scale.jpg` (wants rocket/liftoff),
  `close.jpg`. `public/img/to-use/` is the untracked candidate-photo staging folder. The on-slide
  photo-placeholder corner tags were removed (`Hero.vue` no longer renders `.photo-tag`;
  `--photo-tag-display` is gone).
- **Open:** full visual QA pass; PDF/PPTX export (needs `playwright-chromium`, browser download
  sandbox-blocked — install to `./.pw-browsers` with sandbox off, see Engineering lesson 5).

## Engineering lessons (do NOT repeat these)

1. **Never use `layout: none` for themed slides.** Slidev's `none` layout is bare
   `<div><slot/></div>` with NO `.slidev-layout` class. Our theme (bg, text colour, fonts) is
   scoped to `.slidev-layout`, so `none` slides render UNSTYLED. Use `layout: default`. Full-bleed
   stages still work: make them `position:absolute; inset:0` so they ignore the layout's `px-14 py-10`
   padding. `.slidev-page` is `position:relative`, so absolute `inset:0` children fill the slide.

2. **Keep shared CSS global, not in per-slide `<style>`.** Structural classes used by many slides
   (`.stage`, `.demo-stage`, `.demo-head`, `.title-row`, `.spine/.step`…) belong in `styles/index.css`.
   A per-slide `<style>` block is scoped to THAT slide only; dropping it silently un-styles every
   other slide that used those classes.

3. **A component that reads `$clicks` needs the slide to declare `clicks: N`.** Slidev sets the click
   total from markdown `v-click` directives OR a frontmatter `clicks:` override. If a component drives
   its own reveals off `$clicks` but the slide has no `v-click` and no `clicks:`, only the first step
   shows. Always set `clicks:` to the component's step count.

4. **Dev-server hot-reload corrupts when files are deleted/renamed while it runs.** Vite caches a
   broken reference and 404s every importing slide. Fix: kill the server, `rm -rf node_modules/.vite`,
   relaunch, hard-refresh the browser.

5. **Sandbox notes.** The dev server can't bind a port in-sandbox (`listen EPERM`) — run with the
   sandbox disabled. `npm` cache hits EPERM too — use `--cache "$TMPDIR/npm-cache"`.
   `playwright-chromium`'s post-install browser download is blocked — set
   `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` to install the package, then install the browser separately
   into a writable path (`PLAYWRIGHT_BROWSERS_PATH=./.pw-browsers`) with sandbox off.

6. **Never put `v-if` and `v-for` on the SAME element (Vue 3).** Vue 3 evaluates `v-if` BEFORE
   `v-for`, so the loop variable doesn't exist yet — `v-if="p.label"` throws. This crash is invisible
   to `slidev build` but breaks the slide at runtime. Fix: precompute the filtered list in `<script>`
   (`const labelled = items.filter(p => p.label)`) and `v-for` over that.

7. **`Math.random()` / `Date.now()` are unavailable in some run contexts.** For decorative jitter use
   a deterministic pseudo-random seeded by index:
   `const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }`.
   Bonus: deterministic = stable across re-renders (no flicker).

8. **EMPTY-SLIDE GOTCHA.** A `src:`-included file whose FIRST line is an HTML `<!-- … -->` comment
   (before the first `---` frontmatter) renders that comment as a STRAY BLANK slide. Keep every
   include file starting with `---`; put the header comment AFTER the first frontmatter (the pattern
   `06-close.md` uses).

9. **No local functions — test the Battle by deploying.** The local-functions workflow (`netlify dev`
   / `npm run dev:netlify` / local `.env`) was removed 2026-06-19. `npm run dev` serves SLIDES only;
   the Battle's serverless functions only run on the DEPLOYED Netlify site (prod env vars
   `ANYCABLE_BROADCAST_URL`/`ANYCABLE_BROADCAST_KEY` live in the dashboard). So to test the Battle
   end-to-end: push to `main` → Netlify auto-deploys → exercise it on `vb-gen-ai.netlify.app`. Don't
   re-add a local-functions path unless the user asks.

10. **CONFIRM THE TOOL FITS THE NEED BEFORE BUILDING ON IT.** User asked for Kahoot/Menti (named,
    scored, hidden-answer battle) from the START; I anchored on `slidev-addon-slide-quiz` and even
    migrated hosting before discovering it's ANONYMOUS aggregate polling (can't do names/scores/podium).
    Cost: wasted migration churn + a from-scratch battle rebuild. Lesson: when the user names a concrete
    product/behaviour, verify the candidate library actually does THAT (read its model) before wiring or
    re-architecting around it.

11. **TEST BOTH HALVES OF A PUB/SUB SYSTEM — broadcast OK ≠ subscribe OK.** The battle's HTTP
    broadcast functions returned `{"ok":true}` (they sign with the Broadcast key), so it LOOKED wired —
    but the WebSocket SUBSCRIBE side was never tested and the server rejected every client connection
    (`"unauthorized"` / "Auth Failed") because the AnyCable app had a non-blank Application secret
    (it must be PUBLIC mode — blank app secret — for tokenless deck/phone clients). Symptom: deck 0
    players + phones stuck "waiting". Lesson: for any pub/sub, verify the FULL loop
    (subscribe→broadcast→RECEIVE), not just that the publish endpoint 200s. A standalone Node script
    using the real client lib (`/tmp/anycable-test.mjs`, `/tmp/battle-flow.mjs`) nails this in seconds.

12. **One-shot broadcasts are fragile — add a heartbeat resync.** State pushed only on change means
    any single missed/late message strands a client until the NEXT change. Re-broadcasting current
    state on an interval (battle uses 2s) makes clients self-heal (missed msg, late join, reconnect,
    backgrounded tab) AND keeps serverless functions warm (no cold-start lag). Make the receiver
    idempotent (signature-guard the render) so heartbeats don't flicker or interrupt input.

13. **Drive Slidev slide-phase side-effects from `onSlideEnter`, NOT `onMounted`.** Slidev keeps slides
    mounted and pre-renders neighbours, so `onMounted` fires once at an unpredictable time and never
    re-fires on back-navigation. Anything that must happen "when the host lands on THIS slide" (e.g.
    pushing a game phase to phones) belongs in `onSlideEnter` (+ `onSlideLeave` to undo).

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
   Anthropic clay and was replaced with MuleSoft's own colours (from `docs.mulesoft.com`):
   - **Cool accent** (`--cool` / `--cool-bright`) = MuleSoft azure `#00a2df` + cloud-blue `#0176d3`
     — the "API / integration" accent.
   - **Warm accent** (`--warm` / `--warm-bright`) = MuleSoft gold `#fcc003` + deep amber `#b26b00`
     — the "AI / model" accent.
   Always drive colour through these tokens in `styles/index.css` (day + `html.dark` night blocks).
   Do NOT bake hex/rgba accent literals into components — if you need an accent tint, use the gold
   `rgba(252,192,3,…)` / blue `rgba(1,118,211,…)` so it matches the brand.
   NB: the day-theme `--warm-bright` (#b26b00) is illegible on dark photos, so a `styles/index.css`
   rule lights `.hero .grad-warm` / `.part-opener .grad-warm` as bright gold `--warm` + text-shadow
   (and `.grad-cool` likewise) for accent words over hero images.

8. **No blank first click — slides land with their first beat showing.** A slide must NEVER arrive
   empty and need a click just to reveal its title or first element. The title (and first content
   beat) is on screen from arrival; clicks only add what comes *after* it. Concretely:
   - The title-row carries **no** `v-click` (always visible).
   - The first revealable element starts at **`v-click="1"`**, and the `clicks:` total = number of
     reveals AFTER the first beat. (Title + 3 cards → `clicks: 3`.)
   - For components that read `$clicks`, the first step must render at `$clicks === 0` (gate with
     `c >= i`, not `c > i`).

9. **Voice = "we", not "you".** The presenter is part of the team/audience, not lecturing them.
   On slides AND in speaker notes, say **"we"/"our"** (the systems we run, the APIs we ship) — never
   "you"/"your" addressed to the room. (Neutral generic-impersonal "you" is fine when unavoidable,
   but prefer "we".) Applies to all new/edited copy.
