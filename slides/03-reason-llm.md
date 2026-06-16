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
clicks: 7
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
the word after that. Seven beats — don't rush, each click is one idea. The caret keeps blinking to
signal "still generating".

SET-UP (before any click): on screen is just the input field labelled "prompt" — "The best
Salesforce acquisition is" — with a blinking cursor, exactly what a user types in a chat box. Say:
"Here's our prompt. To us it's five English words. The model can't read words at all — so step one,
it has to chop them up."

[click 1 — TOKENISE] The prompt snaps apart into chips. KEY TEACHING POINT: these are *tokens*, not
words. Tokens are sub-word fragments — notice "Salesforce" splits into "Sales" + "force", and
"acquisition" into "acqui" + "sition" (the dashed chips are continuation pieces). Why: the model has
a fixed vocabulary of ~100k common fragments and builds anything from those Lego bricks, so it's
never stumped by a new or rare word. Rule of thumb for the room: ~4 characters per token, ~¾ of a
word on average. This is also exactly what you're billed on — "tokens in, tokens out".

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
appears after the prompt up top, in warm = generated text.

[click 5 — LOOP (token 2)] Here's the engine. It takes the new, longer text — prompt + "MuleSoft" —
and feeds the WHOLE thing back through the SAME pipeline. Watch the weight grid sweep again: that's a
second forward pass. New distribution, new winner: a comma at 74%. It appends the ",".

[click 6 — LOOP (token 3)] And again. Prompt + "MuleSoft" + "," goes back in, sweep replays, out comes
"obviously" at 52%. Append. Make the point that nothing here is planned ahead — each word is chosen
only once the previous one exists; the "sentence" emerges one token at a time.

[click 7 — THE LOOP, named] Land it: prompt → tokens → numbers → weights → a probability → pick →
append → feed the whole thing back. "Everything that feels like intelligence is this loop, run fast
at enormous scale. Notice what's NOT here: no plan, and no memory — each pass starts cold from the
text in front of it. Hold that thought; it's the key to the whole back half of the talk."
-->

---
layout: default
clicks: 3
---

<!-- ATTENTION BEAT — same word, two meanings (FT "bank" idea) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Why it understands context</div>
    <h2>Same word, two meanings — set by its <span class="grad-warm">neighbours</span></h2>
  </div>
  <AttentionFlip />
</div>

<!--
The piece everyone names but few explain: ATTENTION. Borrowed from the FT — one word, two sentences.
[click] "We sat on the river bank at dawn" — attention arcs draw from "bank" to "river"/"dawn" → river bank.
[click] "She went to the bank to deposit cash" — arcs now draw to "deposit"/"cash" → money bank.
[click] Same word; the model reads the WHOLE sentence at once and lets the neighbours fix the meaning.
That simultaneous, whole-sentence reading is what the transformer unlocked — and why it beat the old
word-by-word models. (Keep this beat only if you want one attention slide; otherwise it's optional.)
-->

---
layout: default
clicks: 6
---

<!-- CONTEXT WINDOW -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What the model can see</div>
    <h2>The context window — a <span class="grad-warm">fixed</span> amount of attention</h2>
  </div>
  <ContextWindow />
</div>

<!--
If it just predicts the next token from what it's seen — how much can it see? A fixed-size window.
[click] First message — a little fills up.
[click] [click] The conversation grows; the window fills.
[click] Getting full — notice the colour shift. We're near capacity.
[click] [click] Over the limit. The window can't grow, so the OLDEST tokens fall out of view.
The model literally stops being able to see the start of the conversation. That "forgetting"
isn't a bug — it's the window. Bigger windows help, but the limit never disappears.
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

<!-- STATELESS REPLAY (hero interactive) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The stateless truth</div>
    <h2>Every turn, you resend the <span class="grad-warm">entire</span> conversation</h2>
  </div>
  <StatelessReplay />
</div>

<!--
Left: what the human sees. Right: what the model actually receives on the API call.
Turn one: a question, a payload. Looks like a session.
[click] Turn two — watch the right panel. It didn't "remember" turn one; we resent it. The whole
thing — Q1, A1, and Q2 — in one payload.
[click] Turn three: same again. Re-sent top to bottom, every call. Watch the token counter climb —
you pay for the whole history each turn.
[click] Mental model for this room: no session on the server. The client carries all state in the
request body, every call. You've built against stateless endpoints for years — same shape.
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
