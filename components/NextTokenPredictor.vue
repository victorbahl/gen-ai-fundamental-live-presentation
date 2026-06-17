<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  NextTokenPredictor — "how a prompt becomes a prediction", end to end, then the
  LOOP. (This is the "D5 pipeline" design; earlier mesh/map/grid explorations
  were removed.) Built around the two things that make the mechanism legible:
    • TOKENISE — the prompt is an INPUT FIELD that SPLITS IN PLACE into token
      chips (sub-word pieces: Salesforce → "Sales"+"force"). The same row then
      grows to the right as tokens are generated — prompt and output share ONE
      line; there is no separate prompt line.
    • NUMBERS  — each token becomes a COLUMN OF NUMBERS, with real values shown.
      The grid GROWS BY ONE COLUMN each time a token is generated (the whole,
      ever-longer text is fed back in) — existing columns never move.
    • WEIGHTS  — those numbers flow through a grid of learned WEIGHTS, signed
      values printed in each cell, with a one-shot compute sweep.
    • PREDICT  — output is an EQUALIZER of bars (height = probability), UNSORTED
      so the warm winner sits in the MIDDLE (probability ≠ position).
    • LOOP     — the winning token is appended and we predict again: MuleSoft,
      ",", "obviously", ".". The weight sweep replays each pass.
    • a caret rides the trailing edge of the text and blinks until generation ends.

  ANIMATION: beat-driven (per click), eased, ONE-SHOT — no ambient loops.
  PHYSICAL-PAGE RULE: fixed canvas, fixed slots; every chip (prompt AND every
  generated token) owns its slot from the start (opacity reveals) so nothing reflows.
*/

const { $clicks } = useSlideContext()
const r = computed(() => $clicks.value)

// pipeline reveal beats
const bTokens  = computed(() => r.value >= 1)   // prompt field → token chips
const bNumbers = computed(() => r.value >= 2)   // tokens → columns of numbers
const bWeights = computed(() => r.value >= 3)   // numbers → weight grid + sweep

// generation beats: r=4 → step 0 (MuleSoft) … r=7 → step 3 (".")
const steps = [
  { token: 'MuleSoft',  cands: [['MuleSoft', 0.44], ['Slack', 0.38], ['Informatica', 0.38], ['Tableau', 0.18]] },
  { token: ',',         cands: [[',', 0.74], ['.', 0.15], ['and', 0.07], ['—', 0.04]] },
  { token: 'obviously', cands: [['obviously', 0.52], ['naturally', 0.27], ['clearly', 0.13], ['right?', 0.08]] },
  { token: '.',         cands: [['.', 0.63], ['too', 0.18], ['really', 0.12], ['!', 0.07]] },
]
const genStep = computed(() => Math.min(Math.max(r.value - 4, -1), steps.length - 1))
const predicting = computed(() => genStep.value >= 0)
const current = computed(() => steps[Math.max(genStep.value, 0)])
const bNote = computed(() => r.value >= 4 + steps.length)   // final "loop" payoff (r>=8)
const sweepKey = computed(() => predicting.value ? 'g' + genStep.value : 'w')

const prompt = 'The best Salesforce acquisition is'
const showBox = computed(() => r.value < 1)   // input field shown until the split

// deterministic pseudo-random (Math.random is unavailable in this env)
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }
const f1 = (v) => { const s = v.toFixed(1); return s === '-0.0' ? '0.0' : s }
const f2 = (v) => { const s = v.toFixed(2); return s === '-0.00' ? '0.00' : s }

// ---- TEXT ROW: prompt tokens + generated tokens share ONE row -------
const promptTokens = ['The', 'best', 'Sales', 'force', 'acqui', 'sition', 'is']
const CHIP_H = 34, CHIP_Y = 24, CHAR = 11, PAD = 18, GAP = 9, LEFT = 150
const chips = (() => {
  const labels = [...promptTokens, ...steps.map((s) => s.token)]
  let x = LEFT
  return labels.map((t, i) => {
    const w = t.length * CHAR + PAD
    const c = { t, x, w, cx: x + w / 2, gen: i >= promptTokens.length, gi: i - promptTokens.length }
    x += w + GAP
    return c
  })
})()
const PROMPT_END = chips[promptTokens.length - 1].x + chips[promptTokens.length - 1].w  // right edge of "is"
const pbX = LEFT - 6, pbW = PROMPT_END - LEFT + 12   // input-field rect spans the prompt chips
const chipOn = (c) => (c.gen ? genStep.value >= c.gi : bTokens.value)
const chipDelay = (c, i) => (!c.gen && bTokens.value ? i * 60 : 0) + 'ms'
// caret rides the trailing edge of the visible text
const caretX = computed(() => {
  const g = genStep.value
  if (g < 0) return PROMPT_END + 6
  const c = chips[promptTokens.length + g]
  return c.x + c.w + 6
})

// ---- NUMBERS grid: one column per token; GROWS as tokens generate ----
const NCOLS = chips.length, NROWS = 5
const NX0 = 24, NAREA_W = 384, NCW = 28, NCH = 24, NY0 = 160
const nPitchX = NAREA_W / NCOLS
const nColX = (c) => NX0 + nPitchX * (c + 0.5)
const nCellY = (rr) => NY0 + rr * (NCH + 4)
const colOn = (c) => (c <= promptTokens.length - 1 ? bNumbers.value : genStep.value >= c - promptTokens.length)
const numCells = (() => {
  const a = []
  for (let c = 0; c < NCOLS; c++)
    for (let rr = 0; rr < NROWS; rr++) {
      const v = rnd(c * NROWS + rr + 7) * 1.8 - 0.9
      a.push({ c, r: rr, x: nColX(c) - NCW / 2, y: nCellY(rr), v, txt: f1(v) })
    }
  return a
})()
const numDelay = (cell) => (colOn(cell.c) ? (cell.c <= promptTokens.length - 1 ? cell.c * 28 + cell.r * 16 : cell.r * 45) : 0) + 'ms'
const nBottom = NY0 + NROWS * (NCH + 4) - 4

// ---- WEIGHTS grid: signed learned values printed in each cell --------
const WCOLS = 6, WROWS = 4, WCELL = 36, WGAP = 4, WX = 470, WY = 160
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
    <svg class="net" viewBox="0 0 1100 400">
      <!-- ============ TEXT ROW : the prompt input field, then tokens ===== -->
      <!-- the prompt is an input field; click 1 SPLITS it in place into chips -->
      <g class="promptbox" :class="{ on: showBox }">
        <text class="ptag" :x="pbX + 4" :y="CHIP_Y - 8">prompt</text>
        <rect :x="pbX" :y="CHIP_Y" :width="pbW" :height="CHIP_H" rx="9" />
        <text class="ptext" :x="LEFT + 6" :y="CHIP_Y + 23">{{ prompt }}<tspan class="boxcaret blink"> ▌</tspan></text>
      </g>

      <g class="chips">
        <g v-for="(c, i) in chips" :key="'ch' + i"
           class="chip" :class="{ on: chipOn(c), gen: c.gen }"
           :style="{ transitionDelay: chipDelay(c, i) }">
          <rect :x="c.x" :y="CHIP_Y" :width="c.w" :height="CHIP_H" rx="8" />
          <text :x="c.cx" :y="CHIP_Y + 23" text-anchor="middle">{{ c.t }}</text>
        </g>
        <text v-if="!showBox" class="caret" :class="{ blink: !bNote }"
          :x="caretX" :y="CHIP_Y + 23">▌</text>
      </g>
      <text class="cap top" x="405" y="78" text-anchor="middle" :class="{ on: bTokens }">
        tokens — sub-word pieces of text, not always whole words
      </text>

      <!-- ============ NUMBERS : each token → a column of numbers ====== -->
      <text class="panel-h" x="214" y="118" text-anchor="middle" :class="{ on: bNumbers }">each token → numbers</text>
      <g class="numgrid">
        <text v-for="(c, i) in chips" :key="'nh' + i"
          class="ntok" :class="{ on: colOn(i), genh: c.gen }" :x="nColX(i)" y="148" text-anchor="middle">{{ c.t }}</text>
        <g v-for="(c, i) in numCells" :key="'nc' + i"
           class="ncellg" :class="{ on: colOn(c.c) }"
           :style="{ transitionDelay: numDelay(c) }">
          <rect class="ncell" :x="c.x" :y="c.y" :width="NCW" :height="NCH" rx="3"
            :style="{ opacity: 0.12 + Math.abs(c.v) / 0.9 * 0.4 }" />
          <text class="nval" :x="c.x + NCW / 2" :y="c.y + NCH / 2 + 3.5" text-anchor="middle">{{ c.txt }}</text>
        </g>
      </g>
      <text class="cap" x="214" :y="nBottom + 22" text-anchor="middle" :class="{ on: bNumbers }">
        each token's meaning, written as a vector
      </text>

      <!-- numbers → weights -->
      <g class="flow" :class="{ on: bWeights }">
        <line x1="412" y1="236" x2="460" y2="236" />
        <path d="M 462 236 l -10 -5 v 10 z" class="head" />
      </g>

      <!-- ============ WEIGHTS : the learned model ===================== -->
      <text class="panel-h" :x="WX + wGridW / 2" y="118" text-anchor="middle" :class="{ on: bWeights }">the model's weights</text>
      <g class="weights">
        <g v-for="(c, i) in wCells" :key="'w' + i"
           class="wcellg" :class="{ on: bWeights }"
           :style="{ transitionDelay: (bWeights ? rnd(i + 2) * 240 : 0) + 'ms' }">
          <rect class="wcell" :x="c.x" :y="c.y" :width="WCELL" :height="WCELL" rx="3"
            :style="{ opacity: 0.1 + Math.abs(c.v) / 0.99 * 0.34 }" />
          <text class="wval" :x="c.x + WCELL / 2" :y="c.y + WCELL / 2 + 3.5" text-anchor="middle">{{ c.txt }}</text>
        </g>
        <!-- one-shot compute sweep; remounts (replays) on each prediction -->
        <g v-if="bWeights" :key="sweepKey" :clip-path="'url(#wclip)'">
          <rect class="sweep" :x="WX" :y="WY" width="40" :height="wGridH" />
        </g>
        <clipPath id="wclip"><rect :x="WX" :y="WY" :width="wGridW" :height="wGridH" rx="3" /></clipPath>
      </g>
      <text class="cap" :x="WX + wGridW / 2" :y="WY + wGridH + 22" text-anchor="middle" :class="{ on: bWeights }">
        billions of these · learned once, then frozen
      </text>

      <!-- weights → prediction -->
      <g class="flow" :class="{ on: predicting }">
        <line x1="712" y1="236" x2="760" y2="236" />
        <path d="M 762 236 l -10 -5 v 10 z" class="head" />
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
      Append the winning token, feed the <em>whole</em> text back in, predict again — the input grows by one token each pass. One token at a time.
    </div>
  </div>
</template>

<style scoped>
.ntp { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.7rem; width: 100%; }

.net { width: 100%; max-width: 980px; height: auto; overflow: visible; --ease: cubic-bezier(0.22, 1, 0.36, 1); }

/* prompt input field (shown until the split) */
.promptbox { opacity: 0; transition: opacity 0.4s var(--ease); }
.promptbox.on { opacity: 1; }
.promptbox rect { fill: var(--bg-soft); stroke: var(--hair); stroke-width: 1.3; }
.ptag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; fill: var(--ink-faint); }
.ptext { font-family: var(--mono); font-size: 16px; fill: var(--ink); }
.boxcaret { fill: var(--warm); }

/* token chips — prompt (cool) and generated (warm) share one row */
.chip { opacity: 0; transform: translateY(8px) scale(0.9); transform-box: fill-box; transform-origin: center;
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease); }
.chip.on { opacity: 1; transform: translateY(0) scale(1); }
.chip rect { fill: var(--bg-panel); stroke: var(--cool); stroke-width: 1.3; }
.chip text { font-family: var(--mono); font-size: 15px; fill: var(--ink); }
.chip.gen rect { stroke: var(--warm); }
.chip.gen text { fill: var(--warm-bright); }

.caret { font-family: var(--mono); font-size: 17px; fill: var(--warm); }
.blink { animation: blink 1.06s ease-in-out infinite; }
@keyframes blink { 0%, 38% { opacity: 1; } 50%, 62% { opacity: 0; } 100% { opacity: 1; } }

.cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; fill: var(--ink-faint);
  opacity: 0; transition: opacity 0.5s ease; }
.cap.on { opacity: 1; }
.cap.top { font-size: 11px; }
.panel-h { font-family: var(--mono); font-size: 12px; fill: var(--ink-soft); opacity: 0; transition: opacity 0.5s ease; }
.panel-h.on { opacity: 1; }

/* numbers grid */
.ntok { font-family: var(--mono); font-size: 9px; fill: var(--cool-bright); opacity: 0; transition: opacity 0.45s ease; }
.ntok.on { opacity: 1; }
.ntok.genh { fill: var(--warm-bright); }
.ncellg { opacity: 0; transition: opacity 0.4s var(--ease); }
.ncellg.on { opacity: 1; }
.ncell { fill: var(--cool); }
.nval { font-family: var(--mono); font-size: 9px; fill: var(--ink); }

/* weights grid */
.wcellg { opacity: 0; transition: opacity 0.45s var(--ease); }
.wcellg.on { opacity: 1; }
.wcell { fill: var(--ink); }
.wval { font-family: var(--mono); font-size: 10px; fill: var(--ink); }
.sweep { fill: var(--warm); opacity: 0.3; animation: sweep 1.2s var(--ease) forwards; }
@keyframes sweep {
  from { transform: translateX(0); opacity: 0; }
  12% { opacity: 0.4; }
  to { transform: translateX(196px); opacity: 0; }
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
