<!-- ============================================================
     PART II — Inside the reasoning machine
     ============================================================ -->

---
layout: default
---

<Hero bg="part-2.jpg" kicker="Part II · Inside the reasoning machine" size="sm">
  It predicts the next word.<br>That's <span class="grad-warm">it.</span>
</Hero>

<!--
Let's open the box. The thing everyone calls intelligence is, mechanically, a next-word predictor.
Watch.
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
clicks: 5
---

<!-- CONTEXT WINDOW -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What the model can see</div>
    <h2>The context window — one <span class="grad-warm">fixed</span> space for everything</h2>
  </div>
  <ContextWindow />
</div>

<!--
If it just predicts the next token from what it's seen — how much can it see? A fixed-size window.
And it's not just "how much" — it matters WHAT is in it.

SET-UP (before any click): the grid already shows a few BLUE cells — the system prompt. Make the
point up front: "Even before you type, the window isn't empty. The rules — the system prompt — are
sitting at the front, and they're pinned there for every single call." Point at the legend: each
content type has a colour and a live token count.

[click] Your first question goes in — GREEN, the current turn. Small, a few hundred tokens.
[click] The model answers, you reply — each turn is appended to history (GOLD). The window fills.
[click] More turns. History keeps stacking; watch the free (faint) space shrink.
[click] Full. The window can't simply grow — there's no room left for the next turn. So what happens?
[click] The app does something about it: it COMPRESSES the oldest turns into a short summary (the
striped cells) — or starts a fresh session. Room reopens, the system prompt stays pinned, and the
conversation continues. The model never sees the raw old turns again — only the summary.

Land it: the window is ONE fixed space that system + history + your question all share. It doesn't
silently forget — when it's full, YOU (or the framework) decide what to keep: summarise, or reset.
Bigger windows push the limit out; they never remove it. (Hold this — in Part IV we'll watch tools
and their results fill this same space far faster.)
-->

---
layout: default
---

<Hero bg="part-2b.jpg" kicker="The most important slide" size="sm">
  And between two calls,<br>it remembers <span class="grad-warm">nothing.</span>
</Hero>

<!--
One more property, and it's the big one. The window explains what it sees in a single call.
But across calls? Nothing carries over. Let me show you exactly what the API receives.
-->

---
layout: default
clicks: 3
---

<!-- STATELESS REPLAY · take 1 — re-stack → forward pass → answer returns -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The stateless truth</div>
    <h2>Every turn, you resend the <span class="grad-warm">entire</span> conversation</h2>
  </div>
  <StatelessReplayStack />
</div>

<!--
The mechanics, end to end. Right side is two parts: the POST body on top, the LLM underneath.
Turn one: the user asks. Watch the right — the request body is built (system + the question), the
resend sweep runs over the WHOLE body, it drops into the LLM, the model generates, and ONLY THEN
the answer travels back and appears on the LEFT. The answer is never sitting there in advance —
it's produced by the model and returned.
[click] Turn two. The previous answer is now back in the POST body as HISTORY — dimmed, because it
was sent before. The only NEW line is the fresh question (highlighted). Sweep, forward pass,
generate, answer returns. Token counter climbs.
[click] Turn three: same again. Everything prior is re-sent, dimmed; one new line. You pay for the
whole history each turn.
[click] Mental model: no session on the server. The client carries all state in the request body,
every call. You've built against stateless endpoints for years — same shape.
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
Turn one: the first envelope is sent — system + one question.
[click] Turn two: the second envelope re-contains everything from the first (dimmed = "sent before")
plus exactly one new line (highlighted). The replayed block just got bigger.
[click] Turn three: again — the grey replayed block grows, one new highlighted line, token bar climbs.
The picture says it: every call ships all of the last one, plus a little more. That repeated grey
block is what you pay for, every single turn.
-->


---
layout: default
---

<!-- PAYOFF — statement -->

<div class="statement">
  <div>
    <div class="big">It has no memory.<br>Every call <span class="grad-warm">starts from zero.</span></div>
    <div class="sub">Memory, history, "context" — that's <em>your</em> job, not the model's.</div>
  </div>
</div>

<!--
Let it land. The model is a pure function: text in, text out. No hidden state carried over.
Everything we build from here exists to feed the right things into that payload. This is the key
to the entire back half of the talk.
-->
