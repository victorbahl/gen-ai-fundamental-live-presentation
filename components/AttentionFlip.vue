<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AttentionFlip — the FT "same word, two meanings" idea, on a slide.
  One word ("bank") sits in two sentences. Self-attention is shown as ARCS
  drawn from "bank" to the words that fix its meaning — different neighbours,
  different meaning. The arcs DRAW IN on each click (eased, one-shot), the
  way the FT scrollytelling reveals them — no ambient loops.

  Beats:
   1. show sentence A ("by the river") — attention arcs draw to river/water
      → meaning tag fades in: "river bank"
   2. show sentence B ("deposit / cash") — arcs draw to deposit/cash
      → meaning tag: "money bank"
   3. payoff line.

  PHYSICAL-PAGE RULE: both sentences own fixed slots from the start; clicks
  only fade/draw — nothing reflows.
*/

const { $clicks } = useSlideContext()
const r = computed(() => $clicks.value)
const showA = computed(() => r.value >= 1)
const showB = computed(() => r.value >= 2)
const showNote = computed(() => r.value >= 3)

// Each sentence is a row of word slots at fixed x positions. `key` marks the
// focus word ("bank"); `cue` marks the words attention links it to.
const rowA = [
  { t: 'We', x: 70 }, { t: 'sat', x: 130 }, { t: 'on', x: 196 },
  { t: 'the', x: 244 }, { t: 'river', x: 308, cue: true }, { t: 'bank', x: 392, key: true },
  { t: 'at', x: 470 }, { t: 'dawn', x: 516, cue: true },
]
const rowB = [
  { t: 'She', x: 70 }, { t: 'went', x: 132 }, { t: 'to', x: 200 },
  { t: 'the', x: 244 }, { t: 'bank', x: 308, key: true }, { t: 'to', x: 378 },
  { t: 'deposit', x: 422, cue: true }, { t: 'cash', x: 520, cue: true },
]

// build attention arcs from the key word to each cue word in a row
const arcs = (row, baseY) => {
  const key = row.find(w => w.key)
  return row.filter(w => w.cue).map((w, i) => {
    const x1 = key.x + 14, x2 = w.x + 8
    const mx = (x1 + x2) / 2, lift = 46 + Math.abs(x2 - x1) * 0.10
    return { d: `M ${x1} ${baseY} Q ${mx} ${baseY - lift} ${x2} ${baseY}`, i }
  })
}
const arcsA = arcs(rowA, 96)
const arcsB = arcs(rowB, 226)
</script>

<template>
  <div class="af">
    <svg class="stagebox" viewBox="0 0 620 290">
      <!-- ===== Sentence A : river bank ===== -->
      <g class="row" :class="{ on: showA }">
        <path v-for="(a, i) in arcsA" :key="'aa' + i" class="arc"
          :class="{ on: showA }" :d="a.d"
          :style="{ transitionDelay: (showA ? 200 + i * 220 : 0) + 'ms' }" />
        <text v-for="(w, i) in rowA" :key="'wa' + i"
          class="w" :class="{ key: w.key, cue: w.cue }" :x="w.x" y="118">{{ w.t }}</text>
        <text class="meaning" :class="{ on: showA }" x="556" y="118">= river bank 🌊</text>
      </g>

      <!-- ===== Sentence B : money bank ===== -->
      <g class="row" :class="{ on: showB }">
        <path v-for="(a, i) in arcsB" :key="'ab' + i" class="arc warm"
          :class="{ on: showB }" :d="a.d"
          :style="{ transitionDelay: (showB ? 200 + i * 220 : 0) + 'ms' }" />
        <text v-for="(w, i) in rowB" :key="'wb' + i"
          class="w" :class="{ key: w.key, cue: w.cue, warm: w.key || w.cue }" :x="w.x" y="248">{{ w.t }}</text>
        <text class="meaning warm" :class="{ on: showB }" x="556" y="248">= money bank 💳</text>
      </g>
    </svg>

    <div class="note" :class="{ on: showNote }">
      Same word. The model reads the <strong>whole sentence at once</strong> and lets the surrounding
      words decide what “bank” means. That’s <span class="grad-warm">attention</span>.
    </div>
  </div>
</template>

<style scoped>
.af { display: flex; flex-direction: column; align-items: center; gap: 1.4rem; width: 100%; }
.stagebox { width: 100%; max-width: 720px; height: auto; overflow: visible; }

.row { opacity: 0; transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.row.on { opacity: 1; }

.w { font-family: var(--serif); font-size: 24px; fill: var(--ink); text-anchor: start; }
.w.cue { fill: var(--cool-bright); }
.w.cue.warm { fill: var(--warm-bright); }
.w.key { fill: #fff; font-weight: 700; }
.w.key.warm { fill: #fff; }

/* attention arcs: stroke-dash draw-in, eased, one-shot */
.arc {
  fill: none; stroke: var(--cool); stroke-width: 2; opacity: 0;
  stroke-dasharray: 320; stroke-dashoffset: 320;
  transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}
.arc.on { opacity: 0.85; stroke-dashoffset: 0; }
.arc.warm { stroke: var(--warm); }

.meaning {
  font-family: var(--mono); font-size: 13px; fill: var(--cool-bright);
  text-anchor: start; opacity: 0; transition: opacity 0.5s ease 0.9s;
}
.meaning.warm { fill: var(--warm-bright); }
.meaning.on { opacity: 1; }

.note {
  font-size: 1.15rem; color: var(--ink-soft); max-width: 60ch; text-align: center;
  opacity: 0; transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.note.on { opacity: 1; }
</style>
