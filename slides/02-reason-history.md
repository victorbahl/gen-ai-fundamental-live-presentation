---
layout: default
---

<!-- ============================================================
     PART 1 — A quick intro to AI
     ============================================================
     Opens with the AI part-opener hero (PartOpener.vue) — the spine bar
     with "AI" lit, reusing the roadmap copy. Then the "GenAI is a small
     box" zoom (moved here from 01-intro.md — it belongs in Part 1), the
     timeline (the one historical shift), and the bridge claim that hands
     off into Part 2.
     NB: the header comment sits AFTER this frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide. -->

<PartOpener
  bg="part-1.jpg"
  :active="1"
  accent="cool"
  num="01"
  headline="A quick map of the field"
  sub="where GenAI fits · a short history" />

<!--
Part one — AI. Before we touch a single model, a quick map of the whole field: seventy years of it,
in a couple of minutes, just so we can place GenAI on the map and see how small the box we actually
care about is. Then we zoom all the way in.
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
One myth to kill before the history.
[click] Everyone says "AI". AI is huge: seventy years of rules, search, planning, robotics, vision.
[click] Machine learning is one slice of that — systems that learn from data instead of hand-written rules.
[click] And generative AI — the LLMs and agents this whole talk is about — is a small box inside THAT.
When people say "AI" today, they almost always mean this little gold box.
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

