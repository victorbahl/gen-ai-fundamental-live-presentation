---
layout: quiz
quizId: llm-limits
question: Which of these is NOT a real limitation of a base LLM?
titleText: Pop quiz!
options:
  - { label: A, text: It can't fetch our live order data }
  - { label: B, text: Its knowledge is frozen at training time }
  - { label: C, text: It can run out of electricity mid-sentence, correct: true }
  - { label: D, text: It guesses confidently — it never checks }
---

<!--
QUIZ — sample live-audience check (slidev-addon-slide-quiz).
Placed at the end of Part 2 (after Hallucination/Grounding) as a "did the limits land?"
beat that bridges into Part 3 (Agents = giving the model hands to go and check).

Presenter flow:
- Land on this slide → a QR code appears. The room scans it and votes on their phones.
- Live bar chart fills in on the NEXT slide (layout: quiz-results, same quizId).
- The "trick": A, B, D are the three real limits we just named on the Hallucination slide
  (private data / frozen / guesses-never-checks). C is the joke non-answer (the correct pick).
- Tie-back: the fix for A, B, D is the SAME — feed it the facts + give it tools. That's Part 3.

NOTE: this only goes live once the deck is deployed (Netlify) with a real AnyCable wsUrl set
in slides.md. Locally it falls back to the shared demo server.
-->

---
layout: quiz-results
quizId: llm-limits
question: Which of these is NOT a real limitation of a base LLM?
options:
  - { label: A, text: It can't fetch our live order data }
  - { label: B, text: Its knowledge is frozen at training time }
  - { label: C, text: It can run out of electricity mid-sentence, correct: true }
  - { label: D, text: It guesses confidently — it never checks }
---

<!--
Results reveal. A, B, D are the genuine limits (private/frozen/guesses); C is the gag answer.
Land the bridge: every real limit here is fixed the same way — don't change the model, change
what it can reach. Grounding (facts in context) + tools (go and check) → that's Part 3, Agents.
-->
