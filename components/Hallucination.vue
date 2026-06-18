<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  THE LIMITS — "it sounds certain, and can't know our facts".
  Pays off the predictor + stateless beats and the "…but it only guesses" hero.

  REBUILT 2026-06-18 (user): the old order-status demo (#7788 vs the Order API
  record, ≠ badge, confidence gauge) was REMOVED — the user didn't want it. The
  slide is now generic: the THREE structural limits as the centrepiece, each one
  a card, converging on ONE root cause that bridges into grounding.

  Three blind-spots (generic — NOT tied to the order example):
    🔒 Only public knowledge — learned the public internet; never saw OUR data.
    🧊 Frozen in the past     — weights fixed at a cutoff; no fresh / live state.
    🎲 Guesses, never checks  — fills any gap with plausible tokens = hallucination.

  Root cause band: one cause behind all three — a frozen, public model that can
  only predict text, it can't go and look. So don't change the model; feed it the
  facts. (→ the can't-act / grounding bridge into Part 3.)

  PHYSICAL-PAGE RULE (4): the three cards + the root band own fixed slots from the
  start; clicks only toggle opacity / lit-state — nothing reflows.
  Rule 8: lands on arrival with the title + the first card already showing.

  Beats (clicks: 3):
    c=0  card 1 (only public) lit; cards 2/3 + band reserved, hidden
    c=1  card 2 (frozen) lit
    c=2  card 3 (guesses) lit
    c=3  root-cause band — one cause → feed it the facts
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

const limits = [
  {
    ic: '🔒',
    t: 'Only public knowledge',
    d: 'It learned from the public internet. It never saw our systems, our docs, our customers.',
    so: 'blind to our data',
  },
  {
    ic: '🧊',
    t: 'Frozen in the past',
    d: 'Its weights were fixed at a training cutoff. Nothing since exists for it — no today, no live state.',
    so: 'no fresh data',
  },
  {
    ic: '🎲',
    t: 'Guesses — never checks',
    d: 'When it doesn’t know, it answers anyway: the most plausible-sounding tokens. Fluent ≠ true.',
    so: 'hallucination',
  },
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
        <div class="d">{{ l.d }}</div>
        <div class="so"><span class="arr">→</span> {{ l.so }}</div>
      </div>
    </div>

    <!-- root-cause band — bridges into grounding -->
    <div class="band" :style="{ opacity: c >= 3 ? 1 : 0 }">
      <span class="b-lead">One cause behind all three:</span>
      a frozen, public model that can only <em>predict text</em> — it can’t go and check.
      So we don’t change the model. <strong>We feed it the facts.</strong>
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
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
  min-height: 232px;
  padding: 1.2rem 1.1rem 1rem;
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
.t { font-family: var(--serif); font-weight: 700; font-size: 1.18rem; color: var(--ink); line-height: 1.2; }
.d { font-size: 0.86rem; color: var(--ink-soft); line-height: 1.45; flex: 1; }

/* the "so..." consequence pill, pinned to the bottom */
.so {
  font-family: var(--mono); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.01em;
  color: var(--bad);
  padding: 0.3rem 0.6rem; border-radius: 999px;
  background: rgba(186,5,23,0.09); border: 1px solid rgba(186,5,23,0.16);
}
.so .arr { opacity: 0.7; margin-right: 0.15rem; }

/* root-cause band */
.band {
  width: 100%; text-align: center; font-size: 1rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.9rem 1.4rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band em { font-style: italic; color: var(--ink); }
.band strong { color: var(--ink); font-weight: 700; }
</style>
