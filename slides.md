---
theme: default
title: 'GenAI, from first principles'
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
addons:
  - slidev-addon-slide-quiz
# Live audience quiz (slidev-addon-slide-quiz, powered by AnyCable).
# wsUrl is PUBLIC (the audience's browser connects to it) — safe to commit.
# The Broadcast URL + Broadcast key are SECRETS — set them as Netlify env vars
# (ANYCABLE_BROADCAST_URL / ANYCABLE_BROADCAST_KEY), NEVER in this file. See netlify.toml.
slideQuiz:
  wsUrl: wss://vb-cable-4vsc.fly.dev/cable
  quizGroupId: genai-fundamentals
  quizUrl: /quiz.html
  titleText: Pop quiz!
---

<!-- ============================================================
     COVER — Archetype A
     ============================================================
     NOTE: slides.md is now a thin table of contents. Each section
     lives in its own file under slides/ and is pulled in via `src:`
     so multiple people/agents can edit different parts in parallel
     without touching the same file. Edit section content THERE,
     not here. Keep this file to the cover + the include list. -->

<Hero bg="cover.jpg" kicker="Hackathon AI · SE French Team" :logos="['mulesoft.svg', 'informatica.svg']">
  The GenAI refresher<br>you <span class="grad-warm">didn't ask for</span>
  <template #subtitle>
    ...but might enjoy anyway 😊
    
    From the history of AI... to autonomous agents.
  </template>
</Hero>

<!--
Welcome. One promise for the next 45 minutes: by the end, this "AI revolution" should feel
less like magic and more like a system you could have designed.

Three moves: AI, then LLMs, then Agents. First a quick map of the field, then how a single
model actually works, then what we build on top of it that can act. The title on screen is
the hook; I'll come back to it at the very end.
-->

---
src: ./slides/01-intro.md
---

---
src: ./slides/02-reason-history.md
---

---
src: ./slides/03-reason-llm.md
---

---
src: ./slides/quiz-llm-limits.md
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
