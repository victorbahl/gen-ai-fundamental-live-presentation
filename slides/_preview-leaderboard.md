---
layout: default
---

<!-- PREVIEW 1 — 5 players (small group, the most likely real turnout for a tie).
     Scores are multiples of 10, max 110 (11 questions × 10 pts flat). -->

<BattleLeaderboardPreview
  :players="[
    { name: 'Ana',  score: 90 },
    { name: 'Beto', score: 90 },
    { name: 'Cy',   score: 70 },
    { name: 'Dia',  score: 50 },
    { name: 'Eli',  score: 30 },
  ]"
/>

---
layout: default
---

<!-- PREVIEW 2 — 30 players, fairly DISTINCT ranking (clean podium, minor ties lower). -->

<BattleLeaderboardPreview
  :players="[
    { name: 'P01', score: 110 }, { name: 'P02', score: 100 }, { name: 'P03', score: 90 },
    { name: 'P04', score: 80 },  { name: 'P05', score: 80 },  { name: 'P06', score: 70 },
    { name: 'P07', score: 70 },  { name: 'P08', score: 70 },  { name: 'P09', score: 60 },
    { name: 'P10', score: 60 },  { name: 'P11', score: 60 },  { name: 'P12', score: 50 },
    { name: 'P13', score: 50 },  { name: 'P14', score: 50 },  { name: 'P15', score: 50 },
    { name: 'P16', score: 40 },  { name: 'P17', score: 40 },  { name: 'P18', score: 40 },
    { name: 'P19', score: 30 },  { name: 'P20', score: 30 },  { name: 'P21', score: 30 },
    { name: 'P22', score: 30 },  { name: 'P23', score: 20 },  { name: 'P24', score: 20 },
    { name: 'P25', score: 20 },  { name: 'P26', score: 10 },  { name: 'P27', score: 10 },
    { name: 'P28', score: 10 },  { name: 'P29', score: 0 },   { name: 'P30', score: 0 },
  ]"
/>

---
layout: default
---

<!-- PREVIEW 3 — 30 players, TOP-HEAVY TIE: four players ace it (110).
     This is the edge case — 4 tied for rank 1, but the podium only has 3 slots. -->

<BattleLeaderboardPreview
  :players="[
    { name: 'P01', score: 110 }, { name: 'P02', score: 110 }, { name: 'P03', score: 110 },
    { name: 'P04', score: 110 }, { name: 'P05', score: 100 }, { name: 'P06', score: 100 },
    { name: 'P07', score: 100 }, { name: 'P08', score: 90 },  { name: 'P09', score: 90 },
    { name: 'P10', score: 80 },  { name: 'P11', score: 80 },  { name: 'P12', score: 80 },
    { name: 'P13', score: 70 },  { name: 'P14', score: 70 },  { name: 'P15', score: 60 },
    { name: 'P16', score: 60 },  { name: 'P17', score: 50 },  { name: 'P18', score: 50 },
    { name: 'P19', score: 50 },  { name: 'P20', score: 40 },  { name: 'P21', score: 40 },
    { name: 'P22', score: 30 },  { name: 'P23', score: 30 },  { name: 'P24', score: 20 },
    { name: 'P25', score: 20 },  { name: 'P26', score: 20 },  { name: 'P27', score: 10 },
    { name: 'P28', score: 10 },  { name: 'P29', score: 0 },   { name: 'P30', score: 0 },
  ]"
/>

<!--
PREVIEW SLIDES — throwaway (3 slides). Static data so we can SEE the leaderboard
at full size for: (1) 5 players w/ a top tie, (2) 30 players distinct, (3) 30
players w/ a 4-way tie at #1. Remove these slides + the include in slides.md +
BattleLeaderboardPreview.vue once reviewed.
-->
