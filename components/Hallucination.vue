<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  THE LIMITS — "it sounds certain, and can't know our facts".
  Pays off the predictor + stateless beats and the "…but it only guesses" hero.

  REBUILT 2026-06-18 (user): the old order-status demo (#7788 vs the Order API
  record, ≠ badge, confidence gauge) was REMOVED — the user didn't want it. The
  slide is now generic: the THREE structural limits as the centrepiece, each one
  a card.

  TRIMMED 2026-06-19 (user): "too much text — the slide is a support, not the
  script". Each card is now just an ICON + TITLE + a one-word consequence pill;
  the explanatory sentences (.d) moved to the speaker notes. The root-cause band
  ("One cause … we feed it the facts") was REMOVED — it added no new info on the
  slide; the bridge into grounding is said ORALLY (see the slide notes).

  Three blind-spots (generic — NOT tied to the order example):
    🔒 Only public knowledge — never saw OUR data        → blind to our data
    🧊 Frozen in the past     — fixed at a training cutoff → no fresh data
    🎲 Guesses, never checks  — fills gaps with tokens     → hallucination

  PHYSICAL-PAGE RULE (4): the three cards own fixed slots from the start; clicks
  only toggle opacity / lit-state — nothing reflows.
  Rule 8: lands on arrival with the title + the first card already showing.

  Beats (clicks: 2):
    c=0  card 1 (only public) lit; cards 2/3 reserved, hidden
    c=1  card 2 (frozen) lit
    c=2  card 3 (guesses) lit
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

const limits = [
  { ic: '🔒', t: 'Only public knowledge', so: 'blind to our data' },
  { ic: '🧊', t: 'Frozen in the past', so: 'no fresh data' },
  { ic: '🎲', t: 'Guesses — never checks', so: 'hallucination' },
]
</script>

<template>
  <div class="lim">
    <!-- three structural limits -->
    <div class="cards">
      <div
        v-for="(l, i) in limits"
        :key="i"
        class="card"
        :class="{ lit: c >= i }"
      >
        <div class="badge">{{ l.ic }}</div>
        <div class="t">{{ l.t }}</div>
        <div class="so"><span class="arr">→</span> {{ l.so }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lim {
  display: flex; flex-direction: column; align-items: center; gap: 1.4rem;
  width: 100%; max-width: 1000px; margin: 0 auto;
}

/* three limit cards */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; width: 100%; }
.card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.8rem;
  min-height: 200px;
  padding: 1.4rem 1.2rem 1.2rem;
  border-radius: 16px;
  background: var(--bg-panel);
  border: 1px solid var(--hair); border-top: 3px solid var(--hair);
  box-shadow: var(--elev);
  opacity: 0.28;
  transition: opacity 0.45s ease, border-top-color 0.45s ease, box-shadow 0.45s ease;
}
.card.lit {
  opacity: 1;
  border-top-color: var(--warm);
  box-shadow: 0 0 26px rgba(252,192,3,0.14);
}

.badge {
  display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 12px; font-size: 1.5rem;
  background: rgba(252,192,3,0.12); border: 1px solid rgba(252,192,3,0.28);
}
.t { font-family: var(--serif); font-weight: 700; font-size: 1.24rem; color: var(--ink); line-height: 1.25; }

/* the "so..." consequence pill, pinned to the bottom */
.so {
  margin-top: auto;
  font-family: var(--mono); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.01em;
  color: var(--bad);
  padding: 0.3rem 0.6rem; border-radius: 999px;
  background: rgba(186,5,23,0.09); border: 1px solid rgba(186,5,23,0.16);
}
.so .arr { opacity: 0.7; margin-right: 0.15rem; }
</style>
