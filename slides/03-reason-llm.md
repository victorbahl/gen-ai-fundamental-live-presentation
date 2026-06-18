---
layout: default
---

<!-- ============================================================
     PART 2 — How an LLM actually works
     ============================================================
     Opens with the LLMs part-opener hero (PartOpener.vue) — the spine
     bar with "LLMs" lit, reusing the roadmap copy. Part 2 order:
     opener → predictor → attention → stateless (stack + filmstrip) →
     context window (which closes the part and bridges into agents).
     The two retired slides ("the most important slide" remembers-nothing
     hero, and the "It has no memory" payoff statement) were CUT here per
     user — do not resurrect them.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide. -->

<PartOpener
  bg="part-2.jpg"
  :active="2"
  accent="warm"
  num="02"
  headline="How the model actually works"
  sub="tokens · attention · stateless · the window · its limits" />

<!--
Part two — LLMs. We just saw prediction at scale start to look like reasoning. Now we open the box
and look at the one model doing it: how a prompt becomes tokens, how attention fixes meaning from
context, and why — between two calls — it carries nothing over. This is the part that makes the
whole back half of the talk click.
-->

---
layout: default
clicks: 8
---

<!-- NEXT-TOKEN PREDICTOR — same pipeline, question prompt.
     The prompt is a QUESTION ("What's the best Salesforce acquisition?"); on
     arrival the grey field hugs the question with NO cursor; the caret appears
     only once the first token (MuleSoft) is generated; the first distribution
     is a CLOSE race (MuleSoft just ahead, Slack = Informatica, Tableau behind)
     so "ranked guess, not a fact" lands harder; the vector/weights captions are
     larger and sit lower; the weights caption names training vs inference.
     See NextTokenPredictor.vue. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">How an LLM generates text</div>
    <h2>How a prompt becomes a <span class="grad-warm">prediction</span></h2>
  </div>
  <NextTokenPredictor />
</div>

<!--
This one slide is the whole mechanism end to end: how the text we type becomes the next token, then the
one after that. The prompt is a QUESTION, the way people actually use a chat box. Eight beats, one idea
per click; the caret only starts blinking once the model is actually generating.

SET-UP (before any click): on screen is just the input field labelled "prompt" — "What's the best
Salesforce acquisition?" — sized to the question, no cursor. It's a plain typed question, nothing has
happened yet. Say: "Here's our prompt — a question. To us it's English. The model can't read words at
all — so step one, it chops them up."

[click 1 — TOKENISE] The field splits IN PLACE into token chips. KEY POINT: tokens, not words — sub-word
fragments. Notice "What's" → "What" + "'s" and "Salesforce" → "Sales" + "force", while "acquisition"
stays a single token (common enough to have its own entry). The model has a fixed vocabulary of ~100k
fragments and builds anything from those bricks. Rule of thumb: ~4 chars per token, ~¾ of a word.

[click 2 — NUMBERS] Each token drops into its own COLUMN OF NUMBERS — text becomes maths. Each token is
a fixed-length list of numbers (a "vector") and that vector IS its meaning to the model. Values shown
are illustrative (real models use hundreds to thousands per token).

[click 3 — WEIGHTS] Those numbers flow into the model — itself just a vastly bigger grid of numbers: the
WEIGHTS. The "billions of parameters." Input numbers change every prompt; the weights are FROZEN, set
once in TRAINING. Now name the two halves of an LLM's life, the caption under the grid spells it out:
fixing those billions of weights, once, is TRAINING; running one forward pass through them to produce
output — the sweep crossing the grid once — is INFERENCE. Everything from here on (every token we
generate, every API call we'll make later) is inference: the weights never change again. Hold "one pass
= inference" — it's why the model is stateless and why we ground it by changing the INPUT, not the weights.

[click 4 — PREDICT (token 1)] Out comes a probability for EVERY token in the vocabulary — top four as
bars. Here's the teaching beat: it's a CLOSE race. MuleSoft is only just ahead at 30%, Slack and
Informatica are tied at 24%, Tableau trails at 14%. This is the point — it's NOT a fact, it's a
distribution, a near-tie ranked guess. Ask a slightly different question and Slack could win. It commits
the top one — "MuleSoft" joins the row in warm, and NOW the caret appears and starts blinking: the model
is generating. A matching number column slides into the grid.

[click 5 — LOOP (token 2)] The engine: take the longer text — prompt + "MuleSoft" — and feed the WHOLE
thing back through the SAME pipeline. Sweep replays (a second forward pass), a column appears. New
distribution, clearer winner this time: a comma at 74%. Append.

[click 6 — LOOP (token 3)] Again. Sweep, new column, "obviously" at 52%. Nothing is planned ahead — each
token is chosen only once the previous one exists.

[click 7 — LOOP (token 4)] One more pass — a period wins at 63%, the model decides it's done. The row
reads "…acquisition? MuleSoft, obviously."

[click 8 — THE LOOP, named] Land it: prompt → tokens → numbers → weights → a probability → pick → append
→ feed it all back. Everything that feels like intelligence is this loop at scale — and every pass is one
INFERENCE over the same frozen weights. And notice that first near-tie: there's no plan and no memory —
each pass starts cold from the text in front of it.

(Aside, when useful) Tokens are also exactly what we're billed on — "tokens in, tokens out".

HOW DOES IT STOP? (likely question) There's no "nothing" with a probability — stopping is just
another ordinary token winning the distribution. The vocabulary includes a special END-OF-SEQUENCE
token (EOS = End Of Sequence; written <eos> / <|endoftext|>, or for chat models an end-of-turn marker
like <|eot_id|> / <|im_end|>). It sits in the vocab right next to "the" and "MuleSoft", and the model
scores it on every pass. When the model has finished the thought, that EOS token is the tallest bar —
it wins, we halt. So it's not the ABSENCE of a token; it's the PRESENCE of a learned "I'm done" token
(real text in training ended, and those endings were marked with it). Footnote if pressed: the runtime
can also force a stop independently of the model — a max_tokens cap (the "cut off mid-sentence" case)
or a user-supplied stop sequence. "Finished naturally" = model emitted EOS; "cut off" = a limit hit
first.
-->

---
layout: default
clicks: 3
---

<!-- ATTENTION BEAT — same word, two meanings (FT "bank" idea, reworked to "pipeline").
     BOTH sentences + the highlighted "pipeline" are on screen from arrival; clicks
     build the attention machinery on top (arcs A → arcs B → payoff). -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Why it understands context</div>
    <h2>Same word, two meanings — set by its <span class="grad-warm">neighbours</span></h2>
  </div>
  <AttentionFlip />
</div>

<!--
The piece everyone names but few explain: ATTENTION. Borrowed from the FT — one word, two sentences.
On screen already, BOTH sentences, same highlighted word: "The pipeline pumped oil for miles" and
"Our Q4 pipeline looks healthy". Ask the room: same five letters — but you already read them two
different ways. How? Watch what each sentence leans on.
[click] Sentence one builds: attention arcs draw from "pipeline" to "pumped"/"oil" → here it means a
steel pipe.
[click] Sentence two builds: arcs draw to "Q4"/"healthy" → here it means future deals. Same letters,
opposite meaning — and "pipeline" is a word this room lives in every day.
[click] The model reads the WHOLE sentence at once and lets the neighbours fix the meaning.
That simultaneous, whole-sentence reading is what the transformer unlocked — and why it beat the old
word-by-word models. (Keep this beat only if you want one attention slide; otherwise it's optional.)
-->

---
layout: default
clicks: 6
---

<!-- STATELESS REPLAY · take 1 — re-stack → forward pass → answer returns -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The stateless truth</div>
    <h2>Every turn, we resend the <span class="grad-warm">entire</span> conversation</h2>
  </div>
  <StatelessReplayStack />
</div>

<!--
The mechanics, end to end. We build turn one up piece by piece. On arrival there's just the LEFT
side: the human asks "Where is my order?" — nothing on the right yet.
[click] The POST body appears: the request our API actually receives — system + the question — and
the resend sweep runs over the whole thing.
[click] It drops into the LLM — a stateless function — which starts generating.
[click] And only NOW the answer comes back: it lands on the left. The answer was never sitting there
in advance — the model produced it and returned it. Turn one complete.
[click] Turn two, now as one full cycle. The previous answer is back in the POST body as HISTORY —
dimmed, because it was sent before. The only NEW line is the fresh question (highlighted). Sweep,
forward pass, generate, answer returns. Token counter climbs.
[click] Turn three: same again. Everything prior is re-sent, dimmed; one new line. We pay for the
whole history each turn.
[click] Mental model: no session on the server. The client carries all state in the request body,
every call. We've built against stateless endpoints for years — same shape.
-->

---
layout: default
clicks: 3
---

<!-- STATELESS REPLAY · take 2 — filmstrip of envelopes (same idea, seen at a glance) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Seen another way</div>
    <h2>Each call re-contains <span class="grad-warm">all</span> of the last one</h2>
  </div>
  <StatelessReplayFilmstrip />
</div>

<!--
Same truth, shown all at once so the redundancy is undeniable. Three request envelopes side by side.
Turn one: the first envelope is sent — system + one question. Note the body stops there: the answer
isn't in it, because the model hasn't produced it yet.
[click] Turn two: the second envelope re-contains everything from the first — the prior question AND
its answer, now dimmed because they were sent before — plus exactly one new line (highlighted): the
fresh question. The replayed block just got bigger.
[click] Turn three: again — the grey replayed block grows, one new highlighted line, token bar climbs.
The picture says it: every call ships all of the last one, plus a little more.
-->


---
layout: default
clicks: 5
---

<!-- CONTEXT WINDOW — closes Part 2 and bridges into agents.
     Follows the stateless cluster: we resend everything every call,
     so how much fits in ONE call? A fixed window — and when it's full,
     the app compresses or offloads. (The AgentContextWindow slide in
     Part 3 reuses these exact mechanics with tool output.) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What fits in one call</div>
    <h2>The context window — one <span class="grad-warm">fixed</span> space for everything</h2>
  </div>
  <ContextWindow />
</div>

<!--
We just saw it: no memory, so we resend the whole conversation every single call. Which raises the
question — how big can that payload get? There's a hard limit: the context window. One fixed-size
space. And it's not just "how much" — it matters WHAT is in it.

SET-UP (before any click): the grid already shows a few BLUE cells — the system prompt. Make the
point up front: "Even before we type, the window isn't empty. The rules — the system prompt — are
sitting at the front, and they're pinned there for every single call." Point at the legend: each
content type has a colour and a live token count.

[click] Our first question goes in — GREEN, the current turn. Small, a few hundred tokens.
[click] The model answers, we reply — each turn is appended to history (GOLD). The window fills.
[click] More turns. History keeps stacking; watch the free (faint) space shrink.
[click] Full. The window can't simply grow — there's no room left for the next turn. So what happens?
[click] The app does something about it: it COMPRESSES the oldest turns into a short summary (the
striped cells) — or starts a fresh session. Room reopens, the system prompt stays pinned, and the
conversation continues. The model never sees the raw old turns again — only the summary.

Land it: the window is ONE fixed space that system + history + our question all share. It doesn't
silently forget — when it's full, WE (or the framework) decide what to keep: summarise, or reset.
Bigger windows push the limit out; they never remove it. (Hold this — in the next part we'll watch
an agent's tools and their results fill this same space far faster.)
-->

---
layout: default
---

<!-- WHAT CHANGED — Archetype A claim over the rocket-launch photo.
     Closes Part 2: having seen the mechanism end to end (tokens → attention →
     stateless → window), we name the payoff — and bridge into Part 3, where
     we get honest about the limits and start building around the model. -->

<Hero bg="prediction-at-scale.jpg" kicker="What changed" align="center" size="sm">
  Prediction at scale started to look like <span class="grad-warm">reasoning…</span>
</Hero>

<!--
Here's the whole magic trick in one line, over a rocket at liftoff. Prediction at scale starts to
look like reasoning. Train a model to predict the next word across the entire internet, and to get
good at that it has to absorb grammar, facts, style, even reasoning patterns. "Predict the next word"
quietly becomes "answer the question." That's the model at its best — and it's genuinely powerful.
Let the ellipsis hang — because there's a "but" coming.
-->

---
layout: default
---

<!-- THE "BUT" — the turn. Pairs with the "…reasoning…" hero just before (its
     ellipsis hangs; this one answers it). One sentence, no subtitle. Deflates
     the hype and sets up the limits slide that follows. Over a heavier/darker
     photo than the rocket (the mood shifts from liftoff to "look closer"). -->

<Hero bg="but-limits.jpg" kicker="…but look closer" align="center" size="sm">
  But it only ever <span class="grad-warm">guesses</span> — over what it saw months ago.
</Hero>

<!--
The turn. The ellipsis from the last slide hangs; this is the "but." For all that power, strip it
back to the mechanism and it never stopped doing one thing: guessing the next token — and guessing
over a snapshot of the public internet, frozen months before we ever typed. It can sound like it
reasons; it cannot know anything we didn't put in front of it. Hold that — the next slide makes it
concrete, three ways at once.
-->

---
layout: default
clicks: 3
---

<!-- THE LIMITS — the flip side of "predict the next token", made GENERIC (no
     order-status demo). Three structural limits as cards — only public · frozen
     in the past · guesses, never checks — converging on ONE root cause that
     bridges into grounding. Pays off the predictor + the frozen-weights beat and
     the "…but it only guesses" hero just before. See Hallucination.vue.
     NB: header comment AFTER the frontmatter (a comment before the first `---`
     renders as a stray blank slide). -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The flip side of prediction</div>
    <h2>It sounds certain — and can’t know <span class="grad-warm">our</span> facts</h2>
  </div>
  <Hallucination />
</div>

<!--
Now we get honest, three ways at once. Everything that makes the model powerful comes from the same
mechanism — and that mechanism has three structural blind spots. On arrival the first is up.
First: it knows only PUBLIC knowledge. It learned from the public internet; it has never seen our
systems, our docs, our customers. Blind to our data by construction.
[click] Second: it's FROZEN in the past. The weights were fixed at a training cutoff — nothing since
exists for it. No "today," no live state, no order that changed this morning.
[click] Third — the one people name: it GUESSES, it never checks. When it doesn't know, it doesn't stop;
it emits the most plausible-sounding tokens anyway. That's hallucination, and it's not a bug we patch
out — it's what next-token prediction DOES.
[click] Here's the thread: these aren't three problems, they're one. A frozen, public model that can
only predict text — it can't go and look anything up. So the fix is never "change the model." It's "feed
it the facts." That's the next slide.
-->

---
layout: default
clicks: 2
---

<!-- GROUNDING — the answer to hallucination + the on-ramp to tools (Part 3).
     Two places knowledge can live → change one: the WEIGHTS (re-train / fine-
     tune — costly, and fine-tune is for behaviour not facts) or the CONTEXT
     (feed facts in at call time — RAG for static docs, tool calls for live
     data). The live-data branch bridges straight into Part 3. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Make it accurate</div>
    <h2>Grounding — put the right <span class="grad-warm">facts</span> in front of it</h2>
  </div>
  <Grounding />
</div>

<!--
We just named the root cause: a frozen, public model. So to make it accurate we change what it knows —
and its knowledge lives in exactly two places. Both are legitimate; they just solve different jobs. On
arrival, the two paths are on screen.
[click] Path A — change the WEIGHTS, teach the model itself. Re-train: build or adapt the model on our
data. It's costly and infrequent, but it's the right call when we genuinely need a specialised model with
deep domain skill. Fine-tune: cheaper — keep training on our examples to lock in tone, format, the way it
does a task. It's excellent for HOW the model responds; it's weak for FACTS, because it can't cite a
source and it goes stale the moment our data changes. So weights are the lever for skills and behaviour.
[click] Path B — change the CONTEXT. Leave the weights frozen and hand the model the relevant facts at
call time, in the window. RAG: retrieve our private docs and policies and paste them in — great for
large, static, unstructured knowledge. Tool calls: the model asks our code to call a live API for fresh,
authoritative data. This is the lever for facts — especially facts that change.
Land it (spoken, no beat): weights teach skills, context carries the facts. For the limits we just saw —
our data, today's state — the facts change, so the lever is context. And for live data that's a tool
call: the whole next part. One honest caveat: grounding sharply cuts hallucination on the facts we
supply; it never drives it fully to zero, because the model can still misread what we give it.
-->
