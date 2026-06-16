<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  NextTokenPredictor — "an LLM just predicts the next token".
  Shown as a real forward pass: context tokens (left) flow through hidden
  layers of a neural net (middle) into a probability distribution over the
  candidate next tokens (right). Each click commits the top token and the
  network predicts again.

  PHYSICAL-PAGE RULE: every node, edge and output row owns a fixed slot.
  Clicks only change opacity / bar widths / node glow — nothing reflows.
*/

const { $clicks } = useSlideContext()

const prompt = 'The smartest company Salesforce ever acquired is'
// each step: the committed token + candidate next-tokens with probabilities.
// (All four candidates are real Salesforce acquisitions — MuleSoft wins.)
const steps = [
  { token: 'MuleSoft',   cands: [['MuleSoft', 0.44], ['Slack', 0.24], ['Informatica', 0.24], ['Tableau', 0.08]] },
  { token: ',',          cands: [[',', 0.74], ['.', 0.15], ['and', 0.07], ['—', 0.04]] },
  { token: 'obviously',  cands: [['obviously', 0.52], ['naturally', 0.27], ['clearly', 0.13], ['right?', 0.08]] },
  { token: '.',          cands: [['.', 0.81], ['!', 0.12], ['…', 0.05], ['?', 0.02]] },
]

const noSpace = new Set([',', '.', '!', '?', '…', ';', ':'])
const lead = (tok) => (noSpace.has(tok) ? '' : ' ')

const revealed = computed(() => Math.min($clicks.value, steps.length))
const current = computed(() => steps[Math.min(revealed.value, steps.length - 1)])
const done = computed(() => revealed.value >= steps.length)        // all tokens generated
const showNote = computed(() => $clicks.value >= steps.length + 1) // final beat

// ---- neural-network geometry (fixed slots) ---------------------------
const inputLabels = ['…', 'ever', 'acquired', 'is']
const NET = (() => {
  const W = 980, H = 300
  const layerX = [90, 248, 406, 540]            // input · hidden · hidden · output
  const counts = [4, 5, 5, 4]
  const span = [[64, 236], [50, 250], [50, 250], [78, 246]]
  const ys = (n, [a, b]) => n === 1 ? [(a + b) / 2]
    : Array.from({ length: n }, (_, i) => a + i * (b - a) / (n - 1))
  const layers = counts.map((n, i) => ys(n, span[i]).map(y => ({ x: layerX[i], y })))
  const edges = []
  for (let l = 0; l < layers.length - 1; l++)
    layers[l].forEach((a, ai) => layers[l + 1].forEach((b, bi) =>
      edges.push({
        x1: a.x, y1: a.y, x2: b.x, y2: b.y, layer: l, bi,
        delay: (l * 0.5 + ((ai + bi) % 5) * 0.12).toFixed(2),
      })))
  return { W, H, layers, edges }
})()
</script>

<template>
  <div class="ntp">
    <!-- the sentence builds token by token; the caret sits right after the
         last word written (only the trailing-edge caret is rendered). -->
    <div class="sentence"><span class="seed">{{ prompt }}</span><span
        v-if="revealed === 0" class="caret" :class="{ blink: !done }">▌</span><template
        v-for="(s, i) in steps" :key="i"><span
          class="tok" :class="{ on: revealed > i }">{{ lead(s.token) }}{{ s.token }}</span><span
          v-if="revealed === i + 1" class="caret" :class="{ blink: !done }">▌</span></template></div>

    <!-- the forward pass -->
    <svg class="net" :class="{ done }" :viewBox="`0 0 ${NET.W} ${NET.H}`">
      <!-- weighted connections; the live signal flows left → right -->
      <g class="edges">
        <line v-for="(e, i) in NET.edges" :key="i"
          :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
          class="edge" :class="{ win: e.layer === 2 && e.bi === 0 }"
          :style="{ animationDelay: e.delay + 's' }" />
      </g>

      <!-- input layer: the context tokens -->
      <g>
        <text v-for="(n, i) in NET.layers[0]" :key="'il' + i"
          class="cap-in" :x="n.x - 18" :y="n.y + 4" text-anchor="end">{{ inputLabels[i] }}</text>
        <circle v-for="(n, i) in NET.layers[0]" :key="'in' + i"
          class="node in" :cx="n.x" :cy="n.y" r="5.5" />
      </g>

      <!-- hidden layers -->
      <circle v-for="(n, i) in NET.layers[1]" :key="'h1' + i" class="node hid"
        :cx="n.x" :cy="n.y" r="6" :style="{ animationDelay: (i * 0.18) + 's' }" />
      <circle v-for="(n, i) in NET.layers[2]" :key="'h2' + i" class="node hid"
        :cx="n.x" :cy="n.y" r="6" :style="{ animationDelay: (0.4 + i * 0.18) + 's' }" />

      <!-- output layer: the next-token probability distribution -->
      <g v-for="(c, i) in current.cands" :key="'o' + i"
         class="out-row" :transform="`translate(0 ${NET.layers[3][i].y})`">
        <line class="oconn" :class="{ win: i === 0 }" x1="548" y1="0" x2="636" y2="0" />
        <circle class="onode" :class="{ win: i === 0 }" cx="540" cy="0"
          :r="6 + c[1] * 9" :style="{ opacity: 0.35 + c[1] * 0.65 }" />
        <text class="otok" :class="{ win: i === 0 }" x="644" y="-9">{{ c[0] }}</text>
        <rect class="track" x="644" y="-2" width="266" height="8" rx="4" />
        <rect class="fill" :class="{ win: i === 0 }" x="644" y="-2"
          :width="c[1] * 266" height="8" rx="4" />
        <text class="opct" :class="{ win: i === 0 }" x="918" y="5">{{ Math.round(c[1] * 100) }}%</text>
      </g>

      <!-- region captions -->
      <text class="caption" x="90" y="290" text-anchor="middle">context</text>
      <text class="caption" x="327" y="290" text-anchor="middle">neural network · simplified</text>
      <text class="caption" x="785" y="290" text-anchor="middle">next-token probabilities</text>
    </svg>

    <div class="done-note" :class="{ on: showNote }">
      Pick the top token, append it, feed the whole sentence back in, predict again. That's the loop.
    </div>
  </div>
</template>

<style scoped>
.ntp {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
  width: 100%;
}
.sentence {
  font-family: var(--serif); font-size: 2rem; line-height: 1.3;
  text-align: center; min-height: 2.6rem;
}
.seed { color: var(--ink); }
.tok { color: var(--warm-bright); opacity: 0; transition: opacity 0.3s ease; }
.tok.on { opacity: 1; }
.caret { color: var(--warm); font-weight: 400; }
.caret.blink { animation: blink 1.06s ease-in-out infinite; }
@keyframes blink {
  0%, 38% { opacity: 1; }
  50%, 62% { opacity: 0; }
  100% { opacity: 1; }
}

/* ---- the network ---------------------------------------------------- */
.net { width: 100%; max-width: 720px; height: auto; overflow: visible; }

.edge {
  stroke: var(--hair); stroke-width: 1; fill: none;
  stroke-dasharray: 5 210;
  animation: flow 2.6s linear infinite;
}
@keyframes flow { from { stroke-dashoffset: 215; } to { stroke-dashoffset: 0; } }
.edge.win { stroke: var(--warm); stroke-width: 1.5; }

.node { stroke-width: 1.4; }
.node.in { fill: var(--cool); stroke: var(--cool-bright); }
.cap-in { fill: var(--ink-soft); font-family: var(--mono); font-size: 12px; }
.node.hid {
  fill: var(--bg-panel); stroke: var(--ink-faint);
  animation: hidpulse 2.6s ease-in-out infinite;
}
@keyframes hidpulse {
  0%, 100% { stroke: var(--ink-faint); }
  50% { stroke: var(--warm); }
}

.oconn { stroke: var(--hair); stroke-width: 1; }
.oconn.win { stroke: var(--warm); stroke-width: 1.5; }
.onode { fill: var(--warm); }
.onode.win { fill: var(--warm-bright); }
.otok { font-family: var(--mono); font-size: 13px; fill: var(--ink-soft); }
.otok.win { fill: var(--warm-bright); font-weight: 700; }
.track { fill: var(--bg-soft); }
.fill { fill: var(--ink-faint); transition: width 0.5s ease; }
.fill.win { fill: var(--warm); }
.opct { font-family: var(--mono); font-size: 12px; fill: var(--ink-soft); }
.opct.win { fill: var(--warm-bright); }

.caption {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
  text-transform: uppercase; fill: var(--ink-faint);
}

.out-row { transition: opacity 0.3s ease; }
.net.done .out-row { opacity: 0.3; }

.done-note {
  font-size: 1rem; color: var(--ink-soft); max-width: 60ch; text-align: center;
  opacity: 0; transition: opacity 0.4s ease;
}
.done-note.on { opacity: 1; }
</style>
