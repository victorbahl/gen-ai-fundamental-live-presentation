<!-- ============================================================
     PART I — From Computing to Reasoning
     ============================================================ -->

---
layout: default
---

<Hero bg="part-1.jpg" kicker="Part I · From computing to reasoning">
  Seventy years<br>in <span class="grad-cool">one breath.</span>
</Hero>

<!--
Quick history — not for trivia, but so we can see the one shift that changed everything.
We go from machines we program with rules, to machines that learn, to machines that predict.
-->

---
layout: default
clicks: 4
---

<!-- TIMELINE — build-up on fixed axis. The first milestone (1950s) is on
     screen from arrival; clicks:4 drives the remaining 4 reveals inside
     <Timeline/> (it reads $clicks). -->

<div class="stage tl-stage">
  <div class="title-row">
    <div class="kicker cool">A very short history of AI</div>
    <h2>From hand-written rules → to learning → to prediction at scale</h2>
  </div>
  <Timeline />
</div>

<style>
/* Extra gap so the title clears the milestone cards that sit ABOVE the
   axis (even markers reach ~20px below the timeline's top edge). */
.tl-stage { gap: 4rem; justify-content: center; }
</style>

<!--
On screen already — the 50s: rules and logic, we hand-write every if/then. Brittle.
[click] 90s: machine learning — stop writing rules, learn patterns from data.
[click] 2012: deep learning — neural nets crack vision and speech.
[click] 2017: the hinge. The Transformer — "attention is all you need". Architecture behind every modern LLM.
[click] 2022: the ChatGPT moment. Nothing new in principle — but scale made it feel like a step change.
The pattern: we stopped telling machines the rules, and started letting them predict.
-->

---
layout: default
---

<!-- WHAT CHANGED — statement-ish, fixed stage -->

<div class="stage">
  <div class="big-claim">
    Prediction at scale started to look like <span class="grad-warm">reasoning.</span>
  </div>
  <div class="claim-sub" v-click>
    Train one model to predict the next word over the whole internet,
    and "predict the next word" quietly becomes "answer the question."
  </div>
</div>

<style>
.big-claim {
  font-family: var(--serif); font-weight: 600; font-size: 3rem; line-height: 1.1;
  text-align: center; max-width: 18ch; text-wrap: balance;
}
.claim-sub { color: var(--ink-soft); font-size: 1.1rem; max-width: 52ch; text-align: center; }
</style>

<!--
[click] Here's the whole magic trick in one line. Prediction at scale starts to look like reasoning.
[click] Train a model to predict the next word across the entire internet, and to get good at that
it has to absorb grammar, facts, style, even reasoning patterns. "Predict the next word" becomes
"answer the question." Which is exactly what we'll look at next.
-->
