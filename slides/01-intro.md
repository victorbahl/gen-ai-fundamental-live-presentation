---
layout: default
---

<Hero bg="humility.jpg" kicker="Let's be humble" align="center" size="sm">
  The more I learn, <br>the more I realize <br>how much <span class="grad-warm">I don't know.</span>
</Hero>

<!--
A quick reset before we dive in. (Background — yes, that's Ygritte: "You know nothing, Jon Snow.")
It's easy to feel like we already know AI — we use it every day now. But this field rewrites itself
every few months, and the honest posture is humility. The more you learn here, the more you see how
much is still open. That's not discouraging — it's the fun part. Stay curious, stay a beginner.
-->

---
layout: default
clicks: 3
---

<!-- AGENDA / ROADMAP — the three moves of the talk, mapped onto the deck's
     fil rouge: Compute → Reason → Act. Fixed canvas; every slot reserved
     from the start; reveals toggle opacity only (no reflow).
     Title is on screen from arrival (no blank start); clicks add the cards. -->

<div class="stage roadmap-stage">
  <div class="title-row">
    <div class="kicker cool">Where we're going</div>
    <h2>Three moves: <span class="grad-cool">Compute</span> → <span class="grad-warm">Reason</span> → <span class="grad-warm">Act</span></h2>
  </div>

  <div class="roadmap">
    <div class="rm-item" v-click="1">
      <div class="rm-n">01</div>
      <div class="rm-word grad-cool">Compute</div>
      <div class="rm-main">A brief history of AI</div>
      <div class="rm-sub">…and where GenAI fits</div>
    </div>
    <div class="rm-arrow" v-click="2">→</div>
    <div class="rm-item" v-click="2">
      <div class="rm-n">02</div>
      <div class="rm-word grad-warm">Reason</div>
      <div class="rm-main">How an LLM actually works</div>
      <div class="rm-sub">tokens · attention · memory</div>
    </div>
    <div class="rm-arrow" v-click="3">→</div>
    <div class="rm-item" v-click="3">
      <div class="rm-n">03</div>
      <div class="rm-word grad-warm">Act</div>
      <div class="rm-main">From answers to actions</div>
      <div class="rm-sub">tools · MCP · agents</div>
    </div>
  </div>
</div>

<style>
.roadmap-stage { gap: 2.6rem; justify-content: center; }

.roadmap { display: flex; align-items: stretch; justify-content: center; gap: 0.75rem; }
.rm-item {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev);
  padding: 1.05rem 1.2rem; width: 218px; text-align: left;
  display: flex; flex-direction: column;
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.rm-n { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.2em; color: var(--ink-faint); }
.rm-word { font-family: var(--serif); font-weight: 700; font-size: 1.5rem; line-height: 1.1; margin-top: 0.1rem; }
.rm-main { font-size: 0.95rem; font-weight: 500; color: var(--ink); margin-top: 0.55rem; }
.rm-sub { font-family: var(--mono); font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.25rem; }
.rm-arrow {
  align-self: center; font-family: var(--serif); font-size: 1.7rem; color: var(--ink-faint);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>

<!--
Here's the shape of the next 45 minutes — three moves, and they're the spine of the whole talk:
Compute, Reason, Act. Machines that calculate, then reason, then act.
[click] One — Compute. A brief history of AI: just enough to place GenAI on the map.
[click] Two — Reason. We zoom into a single LLM — tokens, attention, and why it remembers nothing.
[click] Three — Act. We give the model hands: tools, MCP, agents. Most of our time lives in two and three.
-->

---
layout: default
clicks: 3
---

<!-- ONE SMALL BOX — zoom-in: GenAI is a small box inside AI.
     Fixed canvas; title is on screen from arrival; nested boxes reveal by opacity only. -->

<div class="stage boxes-stage">
  <div class="title-row">
    <div class="kicker">First, a myth to kill</div>
    <h2>GenAI is one small box inside <span class="grad-cool">AI</span></h2>
  </div>

  <div class="nest-canvas">
    <div class="nbox ai" v-click="1">
      <div class="nlabel">Artificial Intelligence</div>
      <div class="nhint">rules · search · planning · robotics · vision …</div>
    </div>
    <div class="nbox ml" v-click="2">
      <div class="nlabel">Machine Learning</div>
    </div>
    <div class="nbox gen" v-click="3">
      <div class="nlabel">Generative AI</div>
      <div class="gen-sub">LLMs · agents</div>
    </div>
  </div>
</div>

<style>
.boxes-stage { gap: 2.2rem; justify-content: center; }

.nest-canvas { position: relative; width: 640px; height: 256px; margin: 0 auto; }
.nbox {
  position: absolute; border: 1px solid var(--hair); border-radius: 16px;
  background: var(--bg-panel);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
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
  border-color: var(--warm); background: rgba(252,192,3,0.14);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.15rem;
}
.nbox.gen .nlabel { position: static; color: var(--warm-bright); }
.gen-sub { font-family: var(--serif); font-weight: 600; font-size: 1rem; color: var(--ink); }
</style>

<!--
Before we start, one myth to kill.
[click] Everyone says "AI". AI is huge: seventy years of rules, search, planning, robotics, vision.
[click] Machine learning is one slice of that — systems that learn from data instead of hand-written rules.
[click] And generative AI — the LLMs and agents this whole talk is about — is a small box inside THAT.
When people say "AI" today, they almost always mean this little terracotta box.
-->

<!-- ============================================================
     HUMILITY — beginner's mind (Ygritte: "You know nothing, Jon Snow")
     ============================================================ -->


