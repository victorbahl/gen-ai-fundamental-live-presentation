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
clicks: 5
---

<!-- NEXT-TOKEN PREDICTOR -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">How an LLM generates text</div>
    <h2>One token at a time — pick, append, <span class="grad-warm">repeat</span></h2>
  </div>
  <NextTokenPredictor />
</div>

<!--
Prompt: "The smartest company Salesforce ever acquired is…". The context tokens flow left into the
network; billions of weights light up; out the right comes a probability over every possible next
token. (Wink at the room — MuleSoft wins; Slack and Informatica tie just behind.)
[click] "MuleSoft" wins at 44%. Commit it; the winning path lights up.
[click] Feed the whole sentence back in and predict again — a comma.
[click] Again: "obviously".
[click] Again: a full stop. The sentence is done.
[click] That's the entire engine: context in, predict the next token, append, feed it back, repeat.
Everything that feels like intelligence is this loop, run fast, at enormous scale.
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
