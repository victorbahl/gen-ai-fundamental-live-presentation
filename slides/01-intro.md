---
layout: default
---

<!-- AGENDA — zoom-in: GenAI is one small box inside AI.
     Fixed canvas; starts empty; nested boxes + agenda reveal by opacity only. -->

<div class="stage agenda-stage">
  <div class="title-row" v-click="1">
    <div class="kicker cool">Where we're going</div>
    <h2>GenAI is one small box inside <span class="grad-cool">AI</span></h2>
  </div>

  <div class="nest-canvas">
    <div class="nbox ai" v-click="2">
      <div class="nlabel">Artificial Intelligence</div>
      <div class="nhint">rules · search · planning · robotics · vision …</div>
    </div>
    <div class="nbox ml" v-click="3">
      <div class="nlabel">Machine Learning</div>
    </div>
    <div class="nbox gen" v-click="4">
      <div class="nlabel">Generative AI</div>
      <div class="gen-sub">LLMs · agents</div>
    </div>
  </div>

  <div class="agenda-row" v-click="5">
    <div class="ar-item">
      <div class="ar-n">01</div>
      <div class="ar-main grad-cool">A brief history of AI</div>
      <div class="ar-sub">…and where GenAI fits</div>
    </div>
    <div class="ar-item">
      <div class="ar-n">02</div>
      <div class="ar-main grad-warm">Reason</div>
      <div class="ar-sub">how an LLM actually works</div>
    </div>
    <div class="ar-item">
      <div class="ar-n">03</div>
      <div class="ar-main grad-warm">Act</div>
      <div class="ar-sub">tools, MCP &amp; agents</div>
    </div>
  </div>
</div>

<style>
.agenda-stage { gap: 1.5rem; justify-content: center; }

.nest-canvas { position: relative; width: 640px; height: 256px; margin: 0 auto; }
.nbox {
  position: absolute; border: 1px solid var(--hair); border-radius: 16px;
  background: var(--bg-panel);
}
.nbox .nlabel {
  position: absolute; top: 10px; left: 16px;
  font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-faint);
}
.nbox.ai  { inset: 0; }
.nbox.ai .nhint {
  position: absolute; bottom: 9px; left: 16px;
  font-family: var(--mono); font-size: 0.62rem; color: var(--ink-faint); opacity: 0.7;
}
.nbox.ml  { inset: 42px 34px 34px 34px; background: var(--nest-mid); }
.nbox.gen {
  inset: 96px 196px 46px 196px;
  border-color: var(--warm); background: rgba(232,121,74,0.12);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.15rem;
}
.nbox.gen .nlabel { position: static; color: var(--warm-bright); }
.gen-sub { font-family: var(--serif); font-weight: 600; font-size: 1rem; color: var(--ink); }

.agenda-row { display: flex; gap: 1rem; justify-content: center; }
.ar-item {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 12px;
  padding: 0.7rem 0.9rem; width: 196px; text-align: left;
}
.ar-n { font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.2em; color: var(--ink-faint); }
.ar-main { font-family: var(--serif); font-weight: 600; font-size: 1.05rem; margin-top: 0.1rem; }
.ar-sub { font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.1rem; }
</style>

<!--
Here's the shape of the next 45 minutes — and the first myth to kill.
[click] Everyone says "AI". AI is huge: seventy years of rules, search, planning, robotics, vision.
[click] Machine learning is one slice of that — systems that learn from data instead of hand-written rules.
[click] And generative AI — the LLMs and agents this whole talk is about — is a small box inside THAT.
When people say "AI" today, they almost always mean this little terracotta box.
[click] So: three moves. One — a brief history, to place that box. Two — zoom into Reason: how an LLM
actually works. Three — zoom into Act: tools, MCP, agents. Most of our time is in two and three.
-->

<!-- ============================================================
     HUMILITY — beginner's mind (Ygritte: "You know nothing, Jon Snow")
     ============================================================ -->

---
layout: default
---

<Hero bg="humility.jpg" kicker="A quick dose of humility" align="center" size="sm">
  The more we know,<br>the <span class="grad-warm">less we know.</span>
  <template #subtitle>
    Every answer here opens three new questions. That's not a gap to close — it's the job.
    Hold your certainty loosely, and keep a beginner's mind.
  </template>
</Hero>

<!--
A quick reset before we dive in. (Background — yes, that's Ygritte: "You know nothing, Jon Snow.")
It's easy to feel like we already know AI — we use it every day now. But this field rewrites itself
every few months, and the honest posture is humility. The more you learn here, the more you see how
much is still open. That's not discouraging — it's the fun part. Stay curious, stay a beginner.
-->
