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

<!-- NEXT-TOKEN PREDICTOR — prompt → tokens → numbers → weights → predict → loop -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">How an LLM generates text</div>
    <h2>How a prompt becomes a <span class="grad-warm">prediction</span></h2>
  </div>
  <NextTokenPredictor />
</div>

<!--
This one slide is the whole mechanism end to end: how the text you type becomes the next word, then
the word after that. Eight beats — don't rush, each click is one idea. The caret keeps blinking to
signal "still generating".

SET-UP (before any click): on screen is just the input field labelled "prompt" — "The best
Salesforce acquisition is" — with a blinking cursor, exactly what a user types in a chat box. Say:
"Here's our prompt. To us it's five English words. The model can't read words at all — so step one,
it has to chop them up."

[click 1 — TOKENISE] The input field splits IN PLACE — same line, same position — into token chips.
KEY TEACHING POINT: these are *tokens*, not words. Tokens are sub-word fragments — notice "Salesforce"
splits into "Sales" + "force", and "acquisition" into "acqui" + "sition". Why: the model has a fixed
vocabulary of ~100k common fragments and builds anything from those Lego bricks, so it's never stumped
by a new or rare word. Rule of thumb for the room: ~4 characters per token, ~¾ of a word on average.
This is also exactly what you're billed on — "tokens in, tokens out".

[click 2 — NUMBERS] Each token drops into its own COLUMN OF NUMBERS. This is the step that makes
everything else possible: text becomes maths. Each token is turned into a fixed-length list of
numbers — a "vector" — and that vector IS the token's meaning to the model. The values on screen are
illustrative (real models use hundreds to thousands per token; I'm showing five). Intuition: each
slot captures some learned aspect of meaning, and tokens used in similar ways get similar-looking
columns. "This grid of numbers is the entire input, as the machine sees it."

[click 3 — WEIGHTS] Those input numbers flow into the model itself — and the model is nothing but
another, vastly bigger grid of numbers: the WEIGHTS. Point at the printed values. These are the
"billions of parameters" you hear about — for a frontier model, hundreds of billions to over a
trillion. Crucial contrast: the input numbers CHANGE every prompt, but these weights are FROZEN —
set once during training, then fixed. Training = showing the model the internet and nudging these
numbers until its guesses got good. "Running" it is just multiplying your input through this fixed
grid — that's the sweep crossing it once. No facts looked up; it's arithmetic over learned numbers.

[click 4 — PREDICT (token 1)] Out comes the answer: a probability for EVERY token in the vocabulary —
showing the top four as a bar chart, height = likelihood. MuleSoft wins at 44%, the tall warm bar.
Two deliberate things: (1) it's not a fact, it's a distribution — a ranked guess; (2) I did NOT sort
the bars tallest-first — the winner sits in the middle, because the model scores the whole vocabulary
at once and "highest probability" has nothing to do with position. It commits the winner — "MuleSoft"
joins the SAME token row, in warm = generated text, and a matching NEW number column slides into the
grid: the longer text is now the input.

[click 5 — LOOP (token 2)] Here's the engine. It takes the new, longer text — prompt + "MuleSoft" —
and feeds the WHOLE thing back through the SAME pipeline. Watch the weight grid sweep again: that's a
second forward pass; another number column appears. New distribution, new winner: a comma at 74%. It
appends the ",".

[click 6 — LOOP (token 3)] And again. Prompt + "MuleSoft" + "," goes back in, sweep replays, a column
is added, out comes "obviously" at 52%. Append. Make the point that nothing here is planned ahead —
each word is chosen only once the previous one exists; the "sentence" emerges one token at a time.

[click 7 — LOOP (token 4)] One more pass and the model decides it's done the thought: a period "."
wins at 63%. Append. The row now reads "…is MuleSoft, obviously." — every generated token sitting in
the same line as the original prompt, and one number column per token.

[click 8 — THE LOOP, named] Land it: prompt → tokens → numbers → weights → a probability → pick →
append → feed the whole thing back. "Everything that feels like intelligence is this loop, run fast
at enormous scale. Notice what's NOT here: no plan, and no memory — each pass starts cold from the
text in front of it. Hold that thought; it's the key to the whole back half of the talk."

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
  Prediction at scale started to look like <span class="grad-warm">reasoning.</span>
  <template #subtitle>
    Train one model to predict the next word over the whole internet,
    and "predict the next word" quietly becomes "answer the question."
  </template>
</Hero>

<!--
Here's the whole magic trick in one line, over a rocket at liftoff. Prediction at scale starts to
look like reasoning. Train a model to predict the next word across the entire internet, and to get
good at that it has to absorb grammar, facts, style, even reasoning patterns. "Predict the next word"
becomes "answer the question." That's the model at its best — and it's genuinely powerful. Next we
get honest about where it falls short, and start building the scaffolding around it.
-->

---
layout: default
clicks: 2
---

<!-- HALLUCINATION — the flip side of "predict the next token". The model
     emits the most PLAUSIBLE continuation over frozen weights; it never looked
     anything up. So it can be fluent, confident, AND wrong. Pays off the
     predictor ("a distribution, a ranked guess") + the frozen-weights beat.
     NB: header comment AFTER the frontmatter (a comment before the first `---`
     renders as a stray blank slide). -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The flip side of prediction</div>
    <h2>It predicts <span class="grad-warm">plausible</span> — not true</h2>
  </div>
  <Hallucination />
</div>

<!--
The catch, and it's the one that matters most when we build on this. On arrival: a question — "where's
my order #7788?" — and the model's answer, fluent and specific: "shipped Monday, arriving Wednesday,"
with a confidence gauge sitting at 94%. Ask the room to take the answer at face value for a second.
[click] Now the actual record from the Order API: status payment_failed, never shipped. The confident
answer was simply wrong — and notice the model was no less fluent for it.
[click] Why this happens is everything we just built: the model emitted the most PLAUSIBLE next tokens
over its frozen weights. It never queried a system — there was no lookup. So fluent isn't correct, and
confident isn't true. This is "hallucination," and it's not a bug we can patch out — it's what
next-token prediction DOES. Which raises the obvious question: how do we make it trustworthy on OUR
facts? That's the next slide.
-->

---
layout: default
clicks: 3
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
So how do we make it accurate on our facts? Frame it cleanly: a model's knowledge lives in exactly two
places, so to fix what it knows we change one of them. On arrival, the two paths are on screen.
[click] Path A — change the WEIGHTS, bake the knowledge in. Two ways. Re-train from scratch:
astronomically expensive, nobody does this to add facts. Fine-tune: much cheaper — but here's the
misconception to kill: fine-tuning teaches STYLE and BEHAVIOUR, not facts. It's unreliable for facts,
it can't cite a source, and it goes stale the moment our data changes. Wrong tool for "know our data."
[click] Path B — change the CONTEXT instead. Leave the weights frozen and hand the model the relevant
facts at call time, in the window. Two flavours. RAG: retrieve text from a knowledge base — great for
large, static, unstructured stuff like docs and policies. And tool calls: the model calls a live API
for fresh, authoritative, structured data — like an order's real status. That second one is exactly
what we build next.
[click] Land it: grounding is just putting the right facts in the window. For live data, that's a tool
call — and that's the whole next part. One honest caveat: grounding sharply cuts hallucination on the
facts we supply; it never drives it fully to zero, because the model can still misread what we give it.
-->
