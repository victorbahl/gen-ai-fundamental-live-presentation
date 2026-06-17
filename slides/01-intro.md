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
     fil rouge: AI → LLMs → Agents. Fixed canvas; every slot reserved
     from the start; reveals toggle opacity only (no reflow).
     Title is on screen from arrival (no blank start); clicks add the cards. -->

<div class="stage roadmap-stage">
  <div class="title-row">
    <div class="kicker cool">Where we're going</div>
    <h2>Three moves: <span class="grad-cool">AI</span> → <span class="grad-warm">LLMs</span> → <span class="grad-warm">Agents</span></h2>
  </div>

  <div class="roadmap">
    <div class="rm-item" v-click="1">
      <div class="rm-n">01</div>
      <div class="rm-word grad-cool">AI</div>
      <div class="rm-main">A quick map of the field</div>
      <div class="rm-sub">…and where GenAI fits</div>
    </div>
    <div class="rm-arrow" v-click="2">→</div>
    <div class="rm-item" v-click="2">
      <div class="rm-n">02</div>
      <div class="rm-word grad-warm">LLMs</div>
      <div class="rm-main">How the model actually works</div>
      <div class="rm-sub">tokens · attention · memory</div>
    </div>
    <div class="rm-arrow" v-click="3">→</div>
    <div class="rm-item" v-click="3">
      <div class="rm-n">03</div>
      <div class="rm-word grad-warm">Agents</div>
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
AI, LLMs, Agents.
[click] One — AI. A quick map of the field: just enough to place GenAI on it.
[click] Two — LLMs. We zoom into a single model — tokens, attention, and why it remembers nothing.
[click] Three — Agents. We give the model hands: tools, MCP, agents. Most of our time lives in two and three.
-->
