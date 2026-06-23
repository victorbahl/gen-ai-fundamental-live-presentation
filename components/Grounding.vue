<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  GROUNDING — "how do we make it accurate?". The answer to the limits beat and
  the on-ramp to Part 3 (tools).

  Mental model (validated with the user): a model's knowledge lives in exactly
  two places, so to make it accurate we can change EITHER — and BOTH are
  legitimate, they just solve different jobs:

    A · CHANGE THE WEIGHTS  (teach the model itself)
        · Re-train   — build/adapt the model on our data → deep domain skill at
                       scale. Costly + infrequent, but the right call for a
                       genuinely specialised base model.
        · Fine-tune  — keep training on our examples → locks in tone, format,
                       task behaviour. Great for HOW it responds; weak for facts
                       (can't cite, goes stale on every data change).

    B · CHANGE THE CONTEXT  (feed facts in at call time) — weights stay FROZEN
        · RAG        — retrieve our private docs / policies, paste them in.
        · Tools      — call a live API for fresh / structured / authoritative
                       data. ← this is what Part 3 builds.

  THE DISTINCTION (the non-provocative reframe, user 2026-06-18):
    weights teach SKILLS & BEHAVIOUR · context carries the FACTS.
  So for facts that CHANGE (our data, today's state — the limits we just named)
  the lever is context — not because weights are "wrong", but because volatile
  facts belong in context. Re-train / fine-tune keep their valid place.

  REWORKED 2026-06-18 (user: "remove 'don't change the model' — changing weights
  IS a solution; re-train & fine-tune make sense in certain cases; the slide is
  too one-sidedly about context; be less provocative — no 'wrong instinct'").
  Both paths now read as legitimate; verdicts say what each is FOR (use-case),
  not pass/fail.

  PHYSICAL-PAGE RULE (4): root + both columns + all four cards own fixed slots
  from the start; clicks only toggle opacity / lit-state — nothing reflows.
  Rule 8: lands on arrival with the root + both path headers already showing.

  Beats (clicks: 2):
    c=0  root + the two path headers (weights | context), cards dimmed
    c=1  Path A cards (weights) — teach the model itself
    c=2  Path B cards (context) — RAG + Tools (the lever for facts)
  (The payoff band was removed per user — the bridge to Part 3 is spoken.)
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
</script>

<template>
  <div class="gr">
    <!-- ROOT -->
    <div class="root">
      <span class="r-q">Two places its knowledge can live</span>
      <span class="r-hint">make it accurate on our facts</span>
    </div>

    <div class="forks">
      <!-- PATH A — change the weights -->
      <div class="path weights" :class="{ lit: c >= 1 }">
        <div class="p-head">
          <span class="p-n">A</span>
          <span class="p-t">Change the <strong>weights</strong></span>
          <span class="p-tag cool">teach the model itself</span>
        </div>
        <div class="opt" :style="{ opacity: c >= 1 ? 1 : 0.18 }">
          <div class="o-row">
            <div class="o-t">Re-train</div>
            <span class="use cool">for deep domain skill</span>
          </div>
          <div class="o-d">build the model on our data — powerful, costly, done rarely</div>
        </div>
        <div class="opt" :style="{ opacity: c >= 1 ? 1 : 0.18 }">
          <div class="o-row">
            <div class="o-t">Fine-tune</div>
            <span class="use cool">for tone &amp; behaviour</span>
          </div>
          <div class="o-d">keep training on our examples — shapes how it responds</div>
        </div>
      </div>

      <!-- PATH B — change the context -->
      <div class="path context" :class="{ lit: c >= 2 }">
        <div class="p-head">
          <span class="p-n warm">B</span>
          <span class="p-t">Change the <strong>context</strong></span>
          <span class="p-tag warm">feed facts in at call time · weights frozen</span>
        </div>
        <div class="opt" :style="{ opacity: c >= 2 ? 1 : 0.18 }">
          <div class="o-row">
            <div class="o-t">RAG</div>
            <span class="use warm">for our private docs</span>
          </div>
          <div class="o-d">retrieve our docs &amp; policies, paste them in <span class="dim">(static)</span></div>
        </div>
        <div class="opt hot" :style="{ opacity: c >= 2 ? 1 : 0.18 }">
          <div class="o-row">
            <div class="o-t">Tool calls</div>
            <span class="use warm">for live facts</span>
          </div>
          <div class="o-d">call a live API for fresh, authoritative data <span class="dim">(real-time)</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gr {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  width: 100%; max-width: 1000px; margin: 0 auto;
}

/* root */
.root {
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
  padding: 0.5rem 1.1rem; border-radius: 12px;
  background: var(--bg-panel); border: 1px solid var(--hair); box-shadow: var(--elev);
}
.r-q { font-family: var(--serif); font-weight: 600; font-size: 1.15rem; color: var(--ink); }
.r-q em { font-style: italic; color: var(--warm-bright); }
.r-hint { font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.04em; color: var(--ink-faint); }

/* two columns — both legitimate, equal weight */
.forks { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; width: 100%; }
.path {
  display: flex; flex-direction: column; gap: 0.55rem;
  padding: 0.9rem; border-radius: 14px;
  border: 1px solid var(--hair); background: var(--bg-soft);
  transition: border-color 0.45s ease, box-shadow 0.45s ease, background 0.45s ease;
}
.path.weights.lit { border-color: var(--cool); }
.path.context.lit { border-color: var(--warm); box-shadow: 0 0 22px rgba(var(--warm-rgb),0.14); }

.p-head { display: grid; grid-template-columns: auto 1fr; grid-row-gap: 0.15rem; align-items: center; column-gap: 0.6rem; }
.p-n {
  grid-row: span 2; width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 700; font-size: 1rem;
  color: var(--cool-bright); background: rgba(var(--cool-rgb),0.10); border: 1px solid rgba(var(--cool-rgb),0.3);
}
.p-n.warm { color: var(--warm-bright); background: rgba(var(--warm-rgb),0.14); border-color: rgba(var(--warm-rgb),0.4); }
.p-t { font-family: var(--serif); font-size: 1.05rem; color: var(--ink); }
.p-t strong { font-weight: 700; }
.p-tag { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.03em; }
.p-tag.cool { color: var(--cool-bright); }
.p-tag.warm { color: var(--warm-bright); }

/* option cards — title + use-case on one row, description below */
.opt {
  padding: 0.55rem 0.7rem 0.6rem; border-radius: 10px;
  background: var(--bg-panel); border: 1px solid var(--hair);
  transition: opacity 0.45s ease;
}
.opt.hot { border-color: var(--warm); background: rgba(var(--warm-rgb),0.06); }
.o-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.o-t { font-family: var(--sans); font-weight: 700; font-size: 0.92rem; color: var(--ink); }
.o-d { font-size: 0.76rem; color: var(--ink-soft); line-height: 1.35; margin-top: 0.18rem; }
.o-d em { font-style: italic; color: var(--ink); }
.o-d .dim { color: var(--ink-faint); }

/* use-case pill — neutral (what it's FOR), tinted to its column */
.use {
  font-family: var(--mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.02em;
  padding: 0.14rem 0.5rem; border-radius: 999px; white-space: nowrap;
}
.use.cool { color: var(--cool-bright); background: rgba(var(--cool-rgb),0.10); }
.use.warm { color: var(--warm-bright); background: rgba(var(--warm-rgb),0.14); }
</style>
