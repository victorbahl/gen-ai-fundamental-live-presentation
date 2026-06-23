<script setup>
import { computed, ref, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AttentionFlip — the FT "same word, two meanings" idea, on a slide.
  One word ("pipeline") sits in two sentences. Self-attention is drawn as ARCS
  from the focus word to the neighbours that fix its meaning — different
  neighbours, different meaning:
    A) "The pipeline pumped oil for miles"  → a steel pipe   (cool/blue)
    B) "Our Q4 pipeline looks healthy"      → future deals   (warm/gold)

  REVEAL ORDER (what the user asked for):
   - ARRIVAL: BOTH full sentences are already on screen, with "pipeline"
     highlighted in each. Nothing else yet — just the two sentences.
   - then we BUILD the attention machinery on top, one sentence at a time.

  Beats (clicks: 3):
   0 (arrival) — both sentences + both highlighted "pipeline" chips.
   1 — build sentence A's attention: arcs draw to pumped/oil, those words light
       up cool, meaning "= a steel pipe" fades in.
   2 — build sentence B's attention: arcs to Q4/healthy light up warm, meaning
       "= future deals".
   3 — payoff line.

  PHYSICAL-PAGE RULE: every element owns a fixed slot in the SVG from the start;
  clicks only fade/draw/colour — nothing reflows.
*/

const { $clicks } = useSlideContext()
const r = computed(() => $clicks.value)

// base (both sentences) fades in once on mount — present from arrival, no click.
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => { mounted.value = true }))

// the attention machinery builds on top, click by click.
const buildA = computed(() => r.value >= 1)
const buildB = computed(() => r.value >= 2)
const showNote = computed(() => r.value >= 3)

/* ---- geometry ------------------------------------------------------- */
const VIEW_W = 1000, VIEW_H = 384
const CARD_X = 24, CARD_W = 952
const SENT_START = 64          // left padding for the sentence inside the card
const MEAN_X = 716             // divider between sentence and meaning zone
const FS = 28, GAP = 18, CHIP_PAD = 18
const A_BASE = 152, B_BASE = 324   // sentence baselines (cards: 40-196 / 212-368)

// rough per-glyph advance for Spectral at FS=28 (no measuring API in SVG).
// Spectral is a narrower serif than the old Fraunces, so these are tightened.
const charW = (c) => {
  if (c === ' ') return 7
  if ('iIlj.,\'’!|'.includes(c)) return 7
  if ('mwMW'.includes(c)) return 23
  if ('Q@'.includes(c)) return 20
  return 14
}
const textW = (t) => [...t].reduce((s, c) => s + charW(c), 0)

function layout(words, baseY) {
  let x = SENT_START
  return words.map((w) => {
    const tw = textW(w.t)
    const width = w.key ? tw + CHIP_PAD * 2 : tw
    const o = { ...w, x, w: width, tw, cx: x + width / 2, baseY }
    x += width + GAP
    return o
  })
}
// arcs from the focus word to each cue word, rising above the line
function arcsFor(placed) {
  const key = placed.find((w) => w.key)
  const topY = key.baseY - 34
  return placed.filter((w) => w.cue).map((w, i) => {
    const x1 = key.cx, x2 = w.cx, mx = (x1 + x2) / 2
    const lift = 46 + Math.abs(x2 - x1) * 0.07
    return { d: `M ${x1} ${topY} Q ${mx} ${topY - lift} ${x2} ${topY}`, x2, topY, i }
  })
}

const rowA = layout([
  { t: 'The' }, { t: 'pipeline', key: true }, { t: 'pumped', cue: true },
  { t: 'oil', cue: true }, { t: 'for' }, { t: 'miles' },
], A_BASE)
const rowB = layout([
  { t: 'Our' }, { t: 'Q4', cue: true }, { t: 'pipeline', key: true },
  { t: 'looks' }, { t: 'healthy', cue: true },
], B_BASE)

const arcsA = arcsFor(rowA)
const arcsB = arcsFor(rowB)
const keyA = rowA.find((w) => w.key)
const keyB = rowB.find((w) => w.key)
</script>

<template>
  <div class="af">
    <svg class="stagebox" :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`">
      <!-- ============ SENTENCE A — a steel pipe (cool) ============ -->
      <g class="row cool">
        <!-- BASE: card + full sentence + highlighted "pipeline" (on arrival) -->
        <g class="base" :class="{ on: mounted }">
          <rect class="card" :x="CARD_X" y="40" :width="CARD_W" height="156" rx="18" />
          <rect class="stripe" :x="CARD_X" y="40" width="6" height="156" />
          <template v-for="(w, i) in rowA" :key="'wa' + i">
            <rect v-if="w.key" class="chip" :x="w.x" :y="w.baseY - 29" :width="w.w" height="40" rx="11" />
            <text class="w" :class="{ key: w.key, cue: w.cue, lit: buildA }"
              :x="w.key ? w.cx : w.x" :y="w.baseY"
              :text-anchor="w.key ? 'middle' : 'start'">{{ w.t }}</text>
          </template>
        </g>

        <!-- BUILD: attention arcs, cue underlines, meaning (click 1) -->
        <path v-for="a in arcsA" :key="'pa' + a.i" class="arc"
          :class="{ on: buildA }" :d="a.d"
          :style="{ transitionDelay: (buildA ? 80 + a.i * 220 : 0) + 'ms' }" />
        <circle v-for="a in arcsA" :key="'da' + a.i" class="dot" :class="{ on: buildA }"
          :cx="a.x2" :cy="a.topY" r="3.5"
          :style="{ transitionDelay: (buildA ? 180 + a.i * 220 : 0) + 'ms' }" />
        <circle class="dot" :class="{ on: buildA }" :cx="keyA.cx" :cy="keyA.baseY - 34" r="3.5" />
        <rect v-for="w in rowA.filter(x => x.cue)" :key="'ua' + w.x" class="cueline"
          :class="{ on: buildA }" :x="w.x" :y="w.baseY + 6" :width="w.tw" height="2.5" />
        <line class="divider" :class="{ on: buildA }"
          :x1="MEAN_X" :y1="A_BASE - 40" :x2="MEAN_X" :y2="A_BASE + 8" />
        <text class="mlabel" :class="{ on: buildA }" :x="MEAN_X + 24" :y="A_BASE - 22">MEANS</text>
        <text class="meaning" :class="{ on: buildA }" :x="MEAN_X + 24" :y="A_BASE">a steel pipe 🛢️</text>
      </g>

      <!-- ============ SENTENCE B — future deals (warm) ============ -->
      <g class="row warm">
        <!-- BASE -->
        <g class="base" :class="{ on: mounted }">
          <rect class="card" :x="CARD_X" y="212" :width="CARD_W" height="156" rx="18" />
          <rect class="stripe" :x="CARD_X" y="212" width="6" height="156" />
          <template v-for="(w, i) in rowB" :key="'wb' + i">
            <rect v-if="w.key" class="chip" :x="w.x" :y="w.baseY - 29" :width="w.w" height="40" rx="11" />
            <text class="w" :class="{ key: w.key, cue: w.cue, lit: buildB }"
              :x="w.key ? w.cx : w.x" :y="w.baseY"
              :text-anchor="w.key ? 'middle' : 'start'">{{ w.t }}</text>
          </template>
        </g>

        <!-- BUILD (click 2) -->
        <path v-for="a in arcsB" :key="'pb' + a.i" class="arc"
          :class="{ on: buildB }" :d="a.d"
          :style="{ transitionDelay: (buildB ? 80 + a.i * 220 : 0) + 'ms' }" />
        <circle v-for="a in arcsB" :key="'db' + a.i" class="dot" :class="{ on: buildB }"
          :cx="a.x2" :cy="a.topY" r="3.5"
          :style="{ transitionDelay: (buildB ? 180 + a.i * 220 : 0) + 'ms' }" />
        <circle class="dot" :class="{ on: buildB }" :cx="keyB.cx" :cy="keyB.baseY - 34" r="3.5" />
        <rect v-for="w in rowB.filter(x => x.cue)" :key="'ub' + w.x" class="cueline"
          :class="{ on: buildB }" :x="w.x" :y="w.baseY + 6" :width="w.tw" height="2.5" />
        <line class="divider" :class="{ on: buildB }"
          :x1="MEAN_X" :y1="B_BASE - 40" :x2="MEAN_X" :y2="B_BASE + 8" />
        <text class="mlabel" :class="{ on: buildB }" :x="MEAN_X + 24" :y="B_BASE - 22">MEANS</text>
        <text class="meaning" :class="{ on: buildB }" :x="MEAN_X + 24" :y="B_BASE">future deals 📈</text>
      </g>
    </svg>

    <div class="note" :class="{ on: showNote }">
      Same letters. The model reads the <strong>whole sentence at once</strong> and lets the
      surrounding words decide what “pipeline” means. That’s <span class="grad-warm">attention</span>.
    </div>
  </div>
</template>

<style scoped>
.af { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%; }
.stagebox { width: 100%; max-width: 980px; height: auto; overflow: visible; }

/* BASE (both sentences) fades in once on mount, then stays */
.base { opacity: 0; transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1); }
.base.on { opacity: 1; }

/* cards + accent stripe */
.card { fill: var(--bg-panel); stroke: var(--hair); stroke-width: 1; }
.stripe { rx: 3px; }
.cool .stripe { fill: var(--cool); }
.warm .stripe { fill: var(--warm); }

.divider { stroke: var(--hair); stroke-width: 1.5; opacity: 0; transition: opacity 0.4s ease; }
.divider.on { opacity: 1; }

/* words: plain ink until their sentence's attention builds, then cue words light up */
.w { font-family: var(--serif); font-size: 28px; fill: var(--ink); transition: fill 0.4s ease 0.25s; }
.cool .w.cue.lit { fill: var(--cool-bright); font-weight: 600; }
.warm .w.cue.lit { fill: var(--warm-bright); font-weight: 600; }

/* focus CHIP — highlighted pill, bright accent text (visible from arrival) */
.chip { stroke-width: 1.5; }
.cool .chip { fill: rgba(var(--cool-rgb), 0.12); stroke: var(--cool); filter: drop-shadow(0 2px 8px rgba(var(--cool-rgb), 0.22)); }
.warm .chip { fill: rgba(var(--warm-rgb), 0.16); stroke: var(--warm); filter: drop-shadow(0 2px 8px rgba(var(--warm-rgb), 0.28)); }
.w.key { font-weight: 700; }
.cool .w.key { fill: var(--cool-bright); }
.warm .w.key { fill: var(--warm-bright); }

/* cue underline draws in with the arcs */
.cueline { rx: 1px; opacity: 0; transform-box: fill-box; transform-origin: left center; transform: scaleX(0);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, opacity 0.3s ease 0.3s; }
.cueline.on { opacity: 1; transform: scaleX(1); }
.cool .cueline { fill: var(--cool); }
.warm .cueline { fill: var(--warm); }

/* attention arcs: stroke-dash draw-in, eased, one-shot */
.arc { fill: none; stroke-width: 2.5; opacity: 0;
  stroke-dasharray: 520; stroke-dashoffset: 520;
  transition: stroke-dashoffset 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease; }
.arc.on { opacity: 0.9; stroke-dashoffset: 0; }
.cool .arc { stroke: var(--cool); }
.warm .arc { stroke: var(--warm); }

.dot { opacity: 0; transition: opacity 0.3s ease; }
.dot.on { opacity: 1; }
.cool .dot { fill: var(--cool); }
.warm .dot { fill: var(--warm); }

/* meaning zone */
.mlabel { font-family: var(--mono); font-size: 12px; letter-spacing: 0.18em; fill: var(--ink-faint);
  opacity: 0; transition: opacity 0.4s ease; }
.mlabel.on { opacity: 1; }
.meaning { font-family: var(--sans); font-size: 24px; font-weight: 700;
  opacity: 0; transition: opacity 0.5s ease 0.4s; }
.meaning.on { opacity: 1; }
.cool .meaning { fill: var(--cool-bright); }
.warm .meaning { fill: var(--warm-bright); }

.note { font-size: 1.15rem; color: var(--ink-soft); max-width: 62ch; text-align: center;
  opacity: 0; transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.note.on { opacity: 1; }
</style>
