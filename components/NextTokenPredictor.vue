<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  NextTokenPredictor — "how a prompt becomes a prediction", end to end, then the
  LOOP. (This is the "D5 pipeline" design; earlier mesh/map/grid explorations
  were removed.) Built around the two things that make the mechanism legible:
    • TOKENISE — the prompt is visibly CUT into token chips (sub-word pieces,
      not whole words: Salesforce → "Sales"+"force").
    • NUMBERS  — each token becomes a COLUMN OF NUMBERS, with real values shown.
    • WEIGHTS  — those numbers flow through a grid of learned WEIGHTS, signed
      values printed in each cell, with a one-shot compute sweep.
    • PREDICT  — output is an EQUALIZER of bars (height = probability), UNSORTED
      so the warm winner sits in the MIDDLE (probability ≠ position).
    • LOOP     — the winning token is appended and we predict again: MuleSoft,
      then ",", then "obviously". The weight sweep replays each pass.
    • the prompt is clearly framed as an input field; a caret blinks throughout.

  ANIMATION: beat-driven (per click), eased, ONE-SHOT — no ambient loops.
  PHYSICAL-PAGE RULE: fixed canvas, fixed slots; the sentence reserves its full
  width up front (opacity reveals) so nothing reflows.
*/

const { $clicks } = useSlideContext()
const r = computed(() => $clicks.value)

// pipeline reveal beats
const bTokens  = computed(() => r.value >= 1)   // prompt → token chips
const bNumbers = computed(() => r.value >= 2)   // tokens → columns of numbers
const bWeights = computed(() => r.value >= 3)   // numbers → weight grid + sweep

// generation beats: r=4 → step 0 (MuleSoft), r=5 → "," , r=6 → "obviously"
const steps = [
  { token: 'MuleSoft',  cands: [['MuleSoft', 0.44], ['Slack', 0.24], ['Informatica', 0.24], ['Tableau', 0.08]] },
  { token: ',',         cands: [[',', 0.74], ['.', 0.15], ['and', 0.07], ['—', 0.04]] },
  { token: 'obviously', cands: [['obviously', 0.52], ['naturally', 0.27], ['clearly', 0.13], ['right?', 0.08]] },
]
const genStep = computed(() => Math.min(Math.max(r.value - 4, -1), steps.length - 1))
const predicting = computed(() => genStep.value >= 0)
const current = computed(() => steps[Math.max(genStep.value, 0)])
const bNote = computed(() => r.value >= 7)        // final "loop" payoff
const sweepKey = computed(() => predicting.value ? 'g' + genStep.value : 'w')

const prompt = 'The best Salesforce acquisition is'

const noSpace = new Set([',', '.', '!', '?', '…', ';', ':'])
const lead = (tok) => (noSpace.has(tok) ? '' : ' ')   // robust spacing before tokens

// deterministic pseudo-random (Math.random is unavailable in this env)
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }
const f1 = (v) => { const s = v.toFixed(1); return s === '-0.0' ? '0.0' : s }
const f2 = (v) => { const s = v.toFixed(2); return s === '-0.00' ? '0.00' : s }

// sub-word tokens of the prompt; `s` = a piece that continues the previous word
const tokens = [
  { t: 'The' }, { t: 'best' }, { t: 'Sales' }, { t: 'force', s: true },
  { t: 'acqui' }, { t: 'sition', s: true }, { t: 'is' },
]

// ---- TOKEN CHIP layout (centred row) --------------------------------
const CHIP_H = 34, CHIP_Y = 20, CHAR = 11, PAD = 18, GAP = 9
const chips = (() => {
  const total = tokens.reduce((s, k) => s + (k.t.length * CHAR + PAD), 0) + GAP * (tokens.length - 1)
  let x = (1100 - total) / 2
  return tokens.map((k) => {
    const w = k.t.length * CHAR + PAD
    const chip = { ...k, x, w, cx: x + w / 2 }
    x += w + GAP
    return chip
  })
})()

// ---- NUMBERS grid: one column per token, real values in cells --------
const NCOLS = tokens.length, NROWS = 5
const NCW = 44, NCH = 26, NY0 = 162
const nPitchX = 360 / NCOLS
const nColX = (c) => 40 + nPitchX * (c + 0.5)
const nCellY = (rr) => NY0 + rr * (NCH + 4)
const numCells = (() => {
  const a = []
  for (let c = 0; c < NCOLS; c++)
    for (let rr = 0; rr < NROWS; rr++) {
      const v = rnd(c * NROWS + rr + 7) * 1.8 - 0.9
      a.push({ c, r: rr, x: nColX(c) - NCW / 2, y: nCellY(rr), v, txt: f1(v) })
    }
  return a
})()
const nBottom = NY0 + NROWS * (NCH + 4) - 4

// ---- WEIGHTS grid: signed learned values printed in each cell --------
const WCOLS = 6, WROWS = 4, WCELL = 42, WGAP = 4, WX = 452, WY = 162
const wPitch = WCELL + WGAP
const wCells = (() => {
  const a = []
  for (let rr = 0; rr < WROWS; rr++)
    for (let c = 0; c < WCOLS; c++) {
      const v = rnd(rr * WCOLS + c + 31) * 1.98 - 0.99
      a.push({ x: WX + c * wPitch, y: WY + rr * wPitch, v, txt: f2(v) })
    }
  return a
})()
const wGridW = WCOLS * wPitch - WGAP
const wGridH = WROWS * wPitch - WGAP

// ---- PREDICTION: equalizer (unsorted; winner in the MIDDLE) ----------
const slotX = [800, 868, 936, 1004]
const slotOf = [1, 0, 3, 2]   // cand 0 (winner) → slot 1, a smaller bar to its left
const BASE = 332, MAXH = 150, BW = 52
</script>

<template>
  <div class="ntp">
    <!-- the prompt is framed as an input field; generated tokens trail after
         it; a caret rides the trailing edge and blinks until generation ends. -->
    <div class="promptline">
      <span class="plabel">prompt</span><span class="pbox">{{ prompt }}</span><span
        v-if="genStep < 0" class="caret" :class="{ blink: !bNote }">▌</span><template
        v-for="(s, i) in steps" :key="i"><span
          class="gen" :class="{ on: genStep >= i }">{{ lead(s.token) }}{{ s.token }}</span><span
          v-if="genStep === i" class="caret" :class="{ blink: !bNote }">▌</span></template>
    </div>

    <svg class="net" viewBox="0 0 1100 400">
      <!-- ============ TOKENISE : cut the prompt into pieces =========== -->
      <g class="chips">
        <g v-for="(c, i) in chips" :key="'ch' + i"
           class="chip" :class="{ on: bTokens, sub: c.s }"
           :style="{ transitionDelay: (bTokens ? i * 70 : 0) + 'ms' }">
          <rect :x="c.x" :y="CHIP_Y" :width="c.w" :height="CHIP_H" rx="8" />
          <text :x="c.cx" :y="CHIP_Y + 23" text-anchor="middle">{{ c.t }}</text>
        </g>
      </g>
      <text class="cap top" x="550" y="78" text-anchor="middle" :class="{ on: bTokens }">
        tokens — sub-word pieces of text, not always whole words
      </text>

      <!-- ============ NUMBERS : each token → a column of numbers ====== -->
      <text class="panel-h" x="220" y="118" text-anchor="middle" :class="{ on: bNumbers }">each token → numbers</text>
      <g class="numgrid">
        <text v-for="(c, i) in chips" :key="'nh' + i"
          class="ntok" :class="{ on: bNumbers }" :x="nColX(i)" y="148" text-anchor="middle">{{ c.t }}</text>
        <g v-for="(c, i) in numCells" :key="'nc' + i"
           class="ncellg" :class="{ on: bNumbers }"
           :style="{ transitionDelay: (bNumbers ? (c.c * 45 + c.r * 18) : 0) + 'ms' }">
          <rect class="ncell" :x="c.x" :y="c.y" :width="NCW" :height="NCH" rx="3"
            :style="{ opacity: 0.12 + Math.abs(c.v) / 0.9 * 0.4 }" />
          <text class="nval" :x="c.x + NCW / 2" :y="c.y + NCH / 2 + 4" text-anchor="middle">{{ c.txt }}</text>
        </g>
      </g>
      <text class="cap" x="220" :y="nBottom + 24" text-anchor="middle" :class="{ on: bNumbers }">
        each token's meaning, written as a vector
      </text>

      <!-- numbers → weights -->
      <g class="flow" :class="{ on: bWeights }">
        <line x1="406" y1="240" x2="444" y2="240" />
        <path d="M 446 240 l -10 -5 v 10 z" class="head" />
      </g>

      <!-- ============ WEIGHTS : the learned model ===================== -->
      <text class="panel-h" :x="WX + wGridW / 2" y="118" text-anchor="middle" :class="{ on: bWeights }">the model's weights</text>
      <g class="weights">
        <g v-for="(c, i) in wCells" :key="'w' + i"
           class="wcellg" :class="{ on: bWeights }"
           :style="{ transitionDelay: (bWeights ? rnd(i + 2) * 240 : 0) + 'ms' }">
          <rect class="wcell" :x="c.x" :y="c.y" :width="WCELL" :height="WCELL" rx="3"
            :style="{ opacity: 0.1 + Math.abs(c.v) / 0.99 * 0.34 }" />
          <text class="wval" :x="c.x + WCELL / 2" :y="c.y + WCELL / 2 + 4" text-anchor="middle">{{ c.txt }}</text>
        </g>
        <!-- one-shot compute sweep; remounts (replays) on each prediction -->
        <g v-if="bWeights" :key="sweepKey" :clip-path="'url(#wclip)'">
          <rect class="sweep" :x="WX" :y="WY" width="40" :height="wGridH" />
        </g>
        <clipPath id="wclip"><rect :x="WX" :y="WY" :width="wGridW" :height="wGridH" rx="3" /></clipPath>
      </g>
      <text class="cap" :x="WX + wGridW / 2" :y="WY + wGridH + 24" text-anchor="middle" :class="{ on: bWeights }">
        billions of these · learned once, then frozen
      </text>

      <!-- weights → prediction -->
      <g class="flow" :class="{ on: predicting }">
        <line x1="730" y1="240" x2="766" y2="240" />
        <path d="M 768 240 l -10 -5 v 10 z" class="head" />
      </g>

      <!-- ============ PREDICT : equalizer bars ======================== -->
      <text class="panel-h" x="902" y="118" text-anchor="middle" :class="{ on: predicting }">next-token probability</text>
      <line class="baseline" :class="{ on: predicting }" x1="770" :y1="BASE" x2="1036" :y2="BASE" />
      <g class="cands">
        <g v-for="(c, i) in current.cands" :key="'bar' + i" class="cand" :class="{ win: i === 0 }">
          <rect class="bar" :x="slotX[slotOf[i]] - BW / 2"
            :y="predicting ? BASE - c[1] * MAXH : BASE" :width="BW"
            :height="predicting ? c[1] * MAXH : 0" rx="4" />
          <text class="bpct" :class="{ on: predicting }"
            :x="slotX[slotOf[i]]" :y="BASE - (predicting ? c[1] * MAXH : 0) - 8" text-anchor="middle">{{ Math.round(c[1] * 100) }}%</text>
          <text class="btok" :class="{ on: predicting }"
            :x="slotX[slotOf[i]]" :y="BASE + 20" text-anchor="middle">{{ c[0] }}</text>
        </g>
      </g>
    </svg>

    <div class="done-note" :class="{ on: bNote }">
      Append the winning token, feed the <em>whole</em> text back in, predict again — comma, “obviously”, on and on. One token at a time.
    </div>
  </div>
</template>

<style scoped>
.ntp { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.7rem; width: 100%; }

/* prompt framed as an input field; generated text trails after it (warm) */
.promptline { font-family: var(--serif); font-size: 1.7rem; line-height: 1.3; text-align: center; min-height: 2.3rem; white-space: nowrap; }
.plabel { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ink-faint); vertical-align: 0.35em; margin-right: 0.55rem; }
.pbox { border: 1px solid var(--hair); border-radius: 9px; padding: 0.06em 0.45em; color: var(--ink); background: var(--bg-soft); }
.gen { color: var(--warm-bright); opacity: 0; transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
.gen.on { opacity: 1; }
.caret { color: var(--warm); font-weight: 400; }
.caret.blink { animation: blink 1.06s ease-in-out infinite; }
@keyframes blink { 0%, 38% { opacity: 1; } 50%, 62% { opacity: 0; } 100% { opacity: 1; } }

.net { width: 100%; max-width: 920px; height: auto; overflow: visible; --ease: cubic-bezier(0.22, 1, 0.36, 1); }

/* token chips */
.chip { opacity: 0; transform: translateY(8px) scale(0.9); transform-box: fill-box; transform-origin: center;
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease); }
.chip.on { opacity: 1; transform: translateY(0) scale(1); }
.chip rect { fill: var(--bg-panel); stroke: var(--cool); stroke-width: 1.3; }
.chip.sub rect { stroke: var(--cool-bright); stroke-dasharray: 4 3; }
.chip text { font-family: var(--mono); font-size: 15px; fill: var(--ink); }

.cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; fill: var(--ink-faint);
  opacity: 0; transition: opacity 0.5s ease; }
.cap.on { opacity: 1; }
.cap.top { font-size: 11px; }
.panel-h { font-family: var(--mono); font-size: 12px; fill: var(--ink-soft); opacity: 0; transition: opacity 0.5s ease; }
.panel-h.on { opacity: 1; }

/* numbers grid */
.ntok { font-family: var(--mono); font-size: 11px; fill: var(--cool-bright); opacity: 0; transition: opacity 0.45s ease; }
.ntok.on { opacity: 1; }
.ncellg { opacity: 0; transition: opacity 0.4s var(--ease); }
.ncellg.on { opacity: 1; }
.ncell { fill: var(--cool); }
.nval { font-family: var(--mono); font-size: 10px; fill: var(--ink); }

/* weights grid */
.wcellg { opacity: 0; transition: opacity 0.45s var(--ease); }
.wcellg.on { opacity: 1; }
.wcell { fill: var(--ink); }
.wval { font-family: var(--mono); font-size: 11px; fill: var(--ink); }
.sweep { fill: var(--warm); opacity: 0.3; animation: sweep 1.2s var(--ease) forwards; }
@keyframes sweep {
  from { transform: translateX(0); opacity: 0; }
  12% { opacity: 0.4; }
  to { transform: translateX(232px); opacity: 0; }
}

/* flow arrows */
.flow { opacity: 0; transition: opacity 0.45s ease; }
.flow.on { opacity: 0.8; }
.flow line { stroke: var(--warm); stroke-width: 1.6; }
.flow .head { fill: var(--warm); }

/* equalizer bars */
.baseline { stroke: var(--hair); stroke-width: 1.5; opacity: 0; transition: opacity 0.4s ease; }
.baseline.on { opacity: 1; }
.bar { fill: var(--cool); transition: y 0.55s var(--ease), height 0.55s var(--ease); }
.cand.win .bar { fill: var(--warm); }
.bpct { font-family: var(--mono); font-size: 12px; fill: var(--ink-soft); opacity: 0; transition: opacity 0.4s ease 0.3s, y 0.55s var(--ease); }
.bpct.on { opacity: 1; }
.cand.win .bpct { fill: var(--warm-bright); font-weight: 700; }
.btok { font-family: var(--mono); font-size: 12px; fill: var(--ink-soft); opacity: 0; transition: opacity 0.4s ease 0.2s; }
.btok.on { opacity: 1; }
.cand.win .btok { fill: var(--warm-bright); font-weight: 700; }

.done-note { font-size: 1rem; color: var(--ink-soft); max-width: 72ch; text-align: center;
  opacity: 0; transition: opacity 0.5s var(--ease); }
.done-note.on { opacity: 1; }
</style>
