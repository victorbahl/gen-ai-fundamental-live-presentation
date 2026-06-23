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
  num="01"
  headline="A quick map of the field"
  sub="where GenAI fits · a short history" />

<!--
◀ **IN** · move one of three — AI, the big picture, before we open any model.

🧭 **SPINE** · part 1 of AI → LLMs → Agents. Goal: place GenAI on the map. Keep it short — this is the warm-up.

**SET-UP** (part opener on screen)

- part one — AI
- before we touch a single model, a quick map of the whole field
- seventy years of AI, in two minutes — just enough to place GenAI on it
- and to see how small the box we really care about is
- then in part 2 we zoom all the way in

▶ **OUT** · first, let's kill one common myth — that "AI" and "GenAI" are the same thing → small box.
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
  inset: 120px 236px 54px 236px;
  border-color: var(--warm); background: rgba(var(--warm-rgb),0.14);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.1rem;
}
.nbox.gen .nlabel { position: static; color: var(--warm-bright); font-size: 0.6rem; }
.gen-sub { font-family: var(--serif); font-weight: 600; font-size: 0.85rem; color: var(--ink); }
</style>

<!--
◀ **IN** · part one opens with a myth to kill: "AI" is not one thing.

**SET-UP** (title on screen, boxes hidden)

- people use "AI" and "GenAI" as if they were the same — they are not
- watch the boxes get smaller, from the whole field down to our topic

[click] **① Artificial Intelligence** — the big outer box

- the term is from 1956 (the Dartmouth workshop) — AI is ~70 years old, older than most of us
- definition: any machine doing a task that normally needs human intelligence — that is very wide
- it covers things that are NOT learning at all: rules, search, planning, robotics, computer vision
- the early branch was "symbolic AI": the machine SEARCHES or REASONS over many options, even if the pieces are hand-written rules
- famous examples: Deep Blue beating Kasparov at chess (1997), or a GPS finding the shortest route — pure search, zero learning, but still AI
- ★ key idea: most of this big box is hand-built logic + search, not a model that learned
- (note for later) Deep Blue is 1997 but it lives HERE, in symbolic AI — not in the machine-learning era on the next slide; it searched, it never learned

- (if asked "is a plain if/then really AI?") honest answer: usually no, and experts still argue about it. a fixed script (a form check, a thermostat) is just a PROGRAM. it earns the name "AI" when it SEARCHES, infers, or plans over many options — not from a single if/then. the boundary has always been fuzzy: there is even a saying, "AI is whatever computers can't do yet" — once it works, we rename it "just an algorithm". what is NOT fuzzy is the small gold box, generative AI.

- (if asked "what do SEARCH and INFER mean?") both = the machine finds an answer the programmer never wrote down:
- SEARCH = explore many options to find a good one. chess: from one position ~30 moves, then ~30 replies… billions of futures. Deep Blue scored millions per second and picked the best. nobody coded "if this move, play that" — it searched the tree. same for GPS: it explores a road network for the shortest route.
- INFER (reason) = chain known facts + rules into a NEW conclusion. medical rules: "fever + bacteria X → infection Y", "infection Y → antibiotic Z" → it concludes "give Z". nobody wrote "this patient → Z"; it followed the chain.
- the three modes, simplest to richest: (1) plain PROGRAM — the human wrote the answer (if/then); (2) symbolic AI — the human wrote the rules + goal, the machine SEARCHES / INFERS the answer; (3) ML & GenAI — the human writes neither, the machine LEARNS the patterns from data.
- fair caveat: search and infer are still 100% deterministic code — so "it's just algorithms" is fair too; "intelligence" here just labels behaviour that LOOKS like human problem-solving (trying options, reasoning), not anything magical.

[click] **② Machine Learning** — one slice inside AI

- the shift: instead of US writing the rules, we show the machine examples and it finds the patterns
- example: to detect spam, we do not list bad words by hand — we give it 100,000 emails marked "spam / not spam" and it learns
- it needs DATA to learn from — no data, no machine learning
- this is most of the "AI" running in business today: fraud detection, product recommendations (Netflix, Amazon), credit scoring, demand forecasting
- still not generative: these models CLASSIFY or PREDICT a number/label — they do not create new text or images

[click] **③ Generative AI** — a small box inside ML

- "generative" = it CREATES new content: text, images, code, audio — not just a yes/no or a score
- the examples everyone knows: ChatGPT and Claude (text), Midjourney / DALL·E (images), GitHub Copilot (code)
- LLMs and agents — this whole talk — live only in this small gold box
- ★ the point: when people say "AI" today, they almost always mean only this small box
- so "we use AI" has been true for decades; what is NEW since ~2022 is this generative part finally working well

▶ **OUT** · so how did we get from the big box to this small one? a very short history → timeline.
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
◀ **IN** · we placed GenAI in its small box — now, how we got there, in five steps.

🧭 **SPINE** · one story across the whole timeline: we slowly stopped WRITING the rules and let machines LEARN and PREDICT them.

**SET-UP** (first milestone on screen — 1950s)

- on screen already — the 1950s–80s: symbolic AI, "rules & logic"
- we hand-write every if/then; the machine only follows our rules
- the big idea of that era: "expert systems" — capture an expert's rules in code (e.g. MYCIN, 1970s, suggested antibiotics from rules)
- it worked in narrow cases, but it was brittle: thousands of rules, and it broke on anything we did not foresee
- and it could not LEARN — a human had to add every new rule by hand
- this caused the "AI winters" — hype, then funding dried up when the rules hit their limit

[click] **② 1990s — Machine Learning**

- the shift: stop writing rules, let the machine learn patterns from data
- real landmark of the era: machines learning to READ handwritten zip codes and bank cheques (neural nets, deployed by postal services and banks in the 90s) — learned from examples, not rules
- this era gave us spam filters, recommendation engines, fraud detection — much of it still runs today
- the catch: it needed humans to choose the useful features (e.g. "count these words") — the machine learned, but we still pointed at what mattered
- (careful — common confusion) 1997 Deep Blue beating Kasparov happened in this decade, but it was NOT machine learning: pure search, zero learning — it belongs in the outer AI box. the chess/Go landmark that DID learn is AlphaGo, 2016.

[click] **③ 2012 — Deep Learning** (the first big jump)

- the trigger event: AlexNet wins the ImageNet image contest by a HUGE margin, using a deep neural network on GPUs
- "deep" = many layers; the network now learns the features ITSELF — no more hand-picking
- suddenly machines could SEE and HEAR: this is the tech behind photo tagging, Siri/Alexa, self-driving vision
- why now and not before? three things lined up: big data (the internet), big compute (GPUs), better methods

[click] **④ 2017 — the Transformer** (the hinge of the whole talk)

- one Google paper, "Attention Is All You Need" — arguably the most important AI paper of the decade
- before it, models read text word-by-word and forgot the start of long sentences; the Transformer reads it ALL at once
- ★ this is the architecture behind every modern LLM — the "T" in GPT literally means Transformer
- remember the word "attention" — it is the next slide in part 2, and the reason these models finally understood context

[click] **⑤ 2022 — the ChatGPT moment**

- ChatGPT launched Nov 2022 and hit 100 million users in ~2 months — the fastest-growing app in history at the time
- ★ nothing new in principle here — same Transformer idea as 2017, just much bigger and trained on far more text
- so the "revolution" is less a NEW idea, more an old idea finally big enough to work — 2017 → 2022 is only 5 years of scaling
- this is the moment AI left the lab and landed on everyone's phone — which is why we are all in this room today

▶ **OUT** · the pattern across the whole line — from "tell the machine the rules" to "let it predict them". That ends the map; now we open the box and meet the model itself → part two.
-->

