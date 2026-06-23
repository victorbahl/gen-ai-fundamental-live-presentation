---
layout: default
---

<Hero bg="humility.jpg" kicker="Let's be humble" align="center" size="sm">
  The more I learn, <br>the more I realize <br>how much <span class="grad-warm">I don't know.</span>
</Hero>

<!--
◀ **IN** · I promised a clear map — but first, an honest word about the field itself.

**SET-UP** (quote on screen)

- a quick reset before we start
- the background is a joke for the fans: a famous Game of Thrones line to Jon Snow — "You know nothing, Jon Snow" — that is all of us with AI
- (don't name WHO says it — the battle's first question asks exactly that; keep the answer for the quiz)
- it is easy to feel we already know AI — we use it every day now
- but the field changes every few months; the honest posture is to stay humble
- even the people who BUILD these models say the same — nobody fully understands them yet
- the more we learn here, the more we see how much is still open — and that is the fun part
- so: stay curious, stay a beginner — me included

▶ **OUT** · with that mindset, here is the map for the next 45 minutes → roadmap.
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
    <h2>Three moves</h2>
  </div>

  <div class="roadmap">
    <div class="rm-item" v-click="1">
      <div class="rm-n">01</div>
      <div class="rm-word grad-cool">AI</div>
      <div class="rm-main">A quick map of the field</div>
      <div class="rm-sub">…and where GenAI fits</div>
      <div class="rm-rail rail-cool"></div>
    </div>
    <div class="rm-arrow" v-click="2">→</div>
    <div class="rm-item" v-click="2">
      <div class="rm-n">02</div>
      <div class="rm-word grad-gold">LLMs</div>
      <div class="rm-main">How the model actually works</div>
      <div class="rm-sub">tokens · attention · stateless</div>
      <div class="rm-rail rail-gold"></div>
    </div>
    <div class="rm-arrow" v-click="3">→</div>
    <div class="rm-item" v-click="3">
      <div class="rm-n">03</div>
      <div class="rm-word grad-warm">Agents</div>
      <div class="rm-main">From answers to actions</div>
      <div class="rm-sub">tools · MCP · the loop</div>
      <div class="rm-rail rail-warm"></div>
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
/* the sub's margin-bottom is the guaranteed gap above the rail (works even
   on the tallest card, where the rail's auto margin collapses to 0). */
.rm-sub { font-family: var(--mono); font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.25rem; margin-bottom: 0.9rem; }
/* heat-ramp rail — a thin accent strip at the card foot in its part's hue
   (AI=teal → LLMs=gold → Agents=coral), so the cool→hot spectrum reads
   across the three cards. margin-top:auto pushes it to the card BOTTOM so
   all three rails align horizontally even when a card's text wraps. */
.rm-rail { height: 4px; border-radius: 2px; margin-top: auto; }
.rail-cool { background: var(--cool); }
.rail-gold { background: var(--gold); }
.rail-warm { background: var(--warm); }
.rm-arrow {
  align-self: center; font-family: var(--serif); font-size: 1.7rem; color: var(--ink-faint);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>

<!--
◀ **IN** · we agreed to stay humble — now here is the simple map to follow.

🧭 **SPINE** · this is the spine of the whole talk: **AI → LLMs → Agents**. Every later slide sits on one of these three. Plant it now; I will point back to it at each part.

**SET-UP** (title on screen, cards hidden)

- the shape of the next 45 minutes — three moves
- they build on each other: each part needs the one before

[click] **① AI** — a quick map of the field

- just enough history to place GenAI on the map and see how small its box is

[click] **② LLMs** — how one model really works

- we zoom into a single model: tokens, attention, and why it remembers nothing

[click] **③ Agents** — from answers to actions

- we give the model hands: tools, MCP, the loop
- most of our time lives in parts two and three — part 1 is short and light, we go slow where the value is
- and they build up: agents sit on top of everything in part 2, so part 2 is not optional

▶ **OUT** · let's start wide — part one, the big picture of AI → part opener.
-->

