---
layout: default
class: battle-slide
---

<!--
AI BATTLE — live, named, scored Kahoot-style competition.
Custom-built on the AnyCable + Netlify infra (components/battle/ + netlify/functions/battle-*).
NOT the poll addon: this one has names, hides the distribution, scores by speed, crowns a top 3.

Flow: this lobby → 5 question slides (1 click each: open → reveal) → podium (3 clicks).
Questions + answer key live in components/battle/battleConfig.ts (host-only, never sent to phones).

PRESENTER:
- Land here → players scan the QR and type a name; watch the chips fill in.
- Advance to Q1. Each question: arrive = answers open → click = REVEAL (which also closes scoring).
- After Q5, the podium reveals 3rd → 2nd → 1st by click. Phones show each player their final rank.
- Use a FRESH groupId (battleConfig.ts) per real run so scores start clean.
-->

<BattleLobby />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="0" />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="1" />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="2" />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="3" />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="4" />

---
layout: default
class: battle-slide
clicks: 3
---

<BattleLeaderboard />
