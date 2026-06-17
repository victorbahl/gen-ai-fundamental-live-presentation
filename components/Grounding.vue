<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  Grounding — "how do we make it accurate?". The answer to the hallucination
  beat, and the on-ramp to Part 3 (tools).

  Mental model (validated with the user): a model's knowledge lives in exactly
  two places, so to fix what it knows we change ONE of them:

    A · CHANGE THE WEIGHTS  (bake it in) — the hard way
        · Re-train      — astronomically costly; nobody does this for grounding
        · Fine-tune     — cheaper, but it's for STYLE / BEHAVIOUR, not facts:
                          unreliable for facts, can't cite, goes stale on every
                          data change. (Common misconception to correct.)

    B · CHANGE THE CONTEXT  (feed facts in at call time) — weights stay FROZEN
        · RAG           — retrieve text from a knowledge base (docs, policies):
                          large, static, unstructured.
        · Tools         — call a live API for fresh / structured / authoritative
                          data (e.g. order status). ← this is what Part 3 builds.

  Honest footnote: grounding REDUCES hallucination on covered topics; it doesn't
  eliminate it (the model can still misread supplied context).

  PHYSICAL-PAGE RULE (4): root + both columns + all four cards own fixed slots
  from the start; clicks only toggle opacity / lit-state — nothing reflows.
  Rule 8: lands on arrival with the root + both path headers already showing.

  Beats (clicks: 3):
    c=0  root + the two path headers (weights | context), cards dimmed
    c=1  Path A cards (weights) — the costly / wrong-for-facts way
    c=2  Path B cards (context) — RAG + Tools, lit warm (the practical way)
    c=3  payoff band — bridges into Part 3 (tools)
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
</script>

<template>
  <div class="gr">
    <!-- ROOT -->
    <div class="root">
      <span class="r-q">Make it know <em>our</em> facts</span>
      <span class="r-hint">two places knowledge can live → change one</span>
    </div>

    <div class="forks">
      <!-- PATH A — change the weights -->
      <div class="path weights" :class="{ lit: c >= 1 }">
        <div class="p-head">
          <span class="p-n">A</span>
          <span class="p-t">Change the <strong>weights</strong></span>
          <span class="p-tag cool">bake it in · the hard way</span>
        </div>
        <div class="opt" :style="{ opacity: c >= 1 ? 1 : 0.18 }">
          <div class="o-t">Re-train</div>
          <div class="o-d">from scratch — astronomically costly</div>
          <span class="verdict no">✗ not for this</span>
        </div>
        <div class="opt" :style="{ opacity: c >= 1 ? 1 : 0.18 }">
          <div class="o-t">Fine-tune</div>
          <div class="o-d">cheaper — but teaches <em>style</em>, not facts; can’t cite, goes stale</div>
          <span class="verdict meh">△ behaviour, not facts</span>
        </div>
      </div>

      <!-- PATH B — change the context -->
      <div class="path context" :class="{ lit: c >= 2 }">
        <div class="p-head">
          <span class="p-n warm">B</span>
          <span class="p-t">Change the <strong>context</strong></span>
          <span class="p-tag warm">feed facts in at call time · weights stay frozen</span>
        </div>
        <div class="opt" :style="{ opacity: c >= 2 ? 1 : 0.18 }">
          <div class="o-t">RAG</div>
          <div class="o-d">retrieve text from a knowledge base — docs, policies <span class="dim">(static)</span></div>
          <span class="verdict yes">✓ grounded</span>
        </div>
        <div class="opt hot" :style="{ opacity: c >= 2 ? 1 : 0.18 }">
          <div class="o-t">Tool calls</div>
          <div class="o-d">call a live API for fresh, authoritative data <span class="dim">(order status)</span></div>
          <span class="verdict yes">✓ grounded · live</span>
        </div>
      </div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: c >= 3 ? 1 : 0 }">
      <span class="b-lead">Grounding = put the right facts in the window.</span>
      For live data that’s a <strong>tool call</strong> — which is exactly the next part.
      <span class="b-foot">(It cuts hallucination on covered facts — never to zero.)</span>
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

/* two columns */
.forks { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; width: 100%; }
.path {
  display: flex; flex-direction: column; gap: 0.55rem;
  padding: 0.9rem; border-radius: 14px;
  border: 1px solid var(--hair); background: var(--bg-soft);
  transition: border-color 0.45s ease, box-shadow 0.45s ease, background 0.45s ease;
}
.path.weights.lit { border-color: var(--cool); }
.path.context.lit { border-color: var(--warm); box-shadow: 0 0 26px rgba(252,192,3,0.16); }

.p-head { display: grid; grid-template-columns: auto 1fr; grid-row-gap: 0.15rem; align-items: center; column-gap: 0.6rem; }
.p-n {
  grid-row: span 2; width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 700; font-size: 1rem;
  color: var(--cool-bright); background: rgba(1,118,211,0.10); border: 1px solid rgba(1,118,211,0.3);
}
.p-n.warm { color: var(--warm-bright); background: rgba(252,192,3,0.14); border-color: rgba(252,192,3,0.4); }
.p-t { font-family: var(--serif); font-size: 1.05rem; color: var(--ink); }
.p-t strong { font-weight: 700; }
.p-tag { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.03em; }
.p-tag.cool { color: var(--cool-bright); }
.p-tag.warm { color: var(--warm-bright); }

/* option cards */
.opt {
  position: relative; padding: 0.55rem 0.7rem; border-radius: 10px;
  background: var(--bg-panel); border: 1px solid var(--hair);
  transition: opacity 0.45s ease;
}
.opt.hot { border-color: var(--warm); background: rgba(252,192,3,0.06); }
.o-t { font-family: var(--sans); font-weight: 700; font-size: 0.9rem; color: var(--ink); }
.o-d { font-size: 0.76rem; color: var(--ink-soft); line-height: 1.35; margin-top: 0.1rem; padding-right: 5.5rem; }
.o-d em { font-style: italic; color: var(--ink); }
.o-d .dim { color: var(--ink-faint); }

.verdict {
  position: absolute; top: 0.55rem; right: 0.7rem;
  font-family: var(--mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.02em;
  padding: 0.12rem 0.45rem; border-radius: 999px; white-space: nowrap;
}
.verdict.no  { color: var(--bad); background: rgba(186,5,23,0.10); }
.verdict.meh { color: var(--ink-soft); background: var(--sunken); }
.verdict.yes { color: var(--good); background: rgba(46,132,74,0.12); }

/* payoff band */
.band {
  width: 100%; text-align: center; font-size: 0.92rem; color: var(--ink-soft);
  line-height: 1.45; padding: 0.7rem 1.2rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band strong { color: var(--ink); }
.band .b-foot { display: block; margin-top: 0.2rem; font-size: 0.72rem; color: var(--ink-faint); }
</style>
