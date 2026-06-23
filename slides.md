---
theme: default
title: 'GenAI Fundamentals — AI → LLMs → Agents'
info: |
  AI → LLMs → Agents — a visual, interactive intro to Generative AI
  for integration-minded engineers.
class: text-left
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  provider: none
---

<!-- ============================================================
     COVER — Archetype A
     ============================================================
     NOTE: slides.md is now a thin table of contents. Each section
     lives in its own file under slides/ and is pulled in via `src:`
     so multiple people/agents can edit different parts in parallel
     without touching the same file. Edit section content THERE,
     not here. Keep this file to the cover + the include list. -->

<Hero bg="cover.jpg" kicker="Hackathon AI · SE French Team" :logos="['mulesoft.svg', 'informatica.svg']" presenter="Victor BAHL" presenter-title="Solution Engineer" presenter-photo="victor-bahl.jpg">
  The GenAI refresher<br>you <span class="grad-warm">didn't ask for</span>
  <template #subtitle>
    ...but might enjoy anyway 😊<br>
    From the history of AI... to autonomous agents.
  </template>
</Hero>

<!--
◀ **IN** · the very start — welcome the room, set the tone, make one promise.

**SET-UP** (cover on screen)

- welcome — this is a refresher, light and visual, ~45 minutes
- quick about me: name, role (Solution Engineer), why this topic — keep it to 20 seconds
- one promise: by the end, this "AI revolution" should feel less like magic, more like a system we could build ourselves
- three moves, and they are the spine of the whole talk: **AI → LLMs → Agents**
- AI = a quick map of the field · LLMs = how one model really works · Agents = what we build on top that can act
- the title is a small joke — "the refresher you didn't ask for"; I will come back to it at the very end
- set expectations: stop me with questions; there is also a small live quiz to wake us up
- note for this room: we are technical, integration people — so I will use API and integration words we already know

▶ **OUT** · before we start, one honest word about this field — how fast it moves, and why we should stay humble → next slide.
-->


---
src: ./slides/01-intro.md
---

---
src: ./slides/battle.md
---

---
src: ./slides/02-reason-history.md
---

---
src: ./slides/03-reason-llm.md
---

---
src: ./slides/04-act-tools.md
---

---
src: ./slides/05-act-agents.md
---

---
src: ./slides/06-close.md
---
