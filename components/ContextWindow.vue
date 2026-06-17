<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  ContextWindow (LEAN) — the window isn't just "how much" — it's WHAT is in it.
  A fixed grid of cells, colour-coded by content TYPE. Everything the model can
  see at once shares one fixed space:

    system  (cool/azure)   — the rules. Present BEFORE you type, pinned.
    history (warm/gold)    — the conversation, growing one turn at a time.
    current (good/green)   — the live message this turn.
    summary (striped gold) — old turns COMPRESSED, once the window fills.
    free    (sunken)       — what's left for the model to generate into.

  THE KEY BEAT: when the window fills, tokens don't just "fall off". The app
  does something about it — it compresses the oldest turns into a short summary
  (or starts a fresh session). The grid recedes; the conversation continues.

  PHYSICAL-PAGE RULE (Rule 4): the grid is a FIXED CAP cells that always exist,
  laid out in a FIXED order (system → summary → history → current → free), so a
  given cell only ever CHANGES COLOUR in place — nothing moves, nothing reflows.
  Rule 8: lands on arrival already showing the system prompt.
*/

const { $clicks } = useSlideContext()

const CAP = 60              // window capacity in cells
const COLS = 20             // 3 rows of 20
const CELL_K = 0.5          // each cell ≈ 0.5k tokens (teaching scale)

// segment order is FIXED: system → summary → history → current → free.
const beats = [
  { sys: 3, sum: 0, hist: 0,  cur: 0,
    caption: 'Before we type a word, the window already holds the system prompt — the rules, pinned to the front of every call.' },
  { sys: 3, sum: 0, hist: 0,  cur: 3,
    caption: 'Our first question goes in — the live turn, a few hundred tokens.' },
  { sys: 3, sum: 0, hist: 14, cur: 3,
    caption: 'The model answers and we reply. Each turn is appended to the history — the window fills.' },
  { sys: 3, sum: 0, hist: 34, cur: 3,
    caption: 'More turns. History keeps stacking up; the free space shrinks.' },
  { sys: 3, sum: 0, hist: 54, cur: 3,
    caption: 'Full. The window can’t simply grow — there’s no more room for the next turn.',
    note: { text: 'Window full — it can’t grow', tone: 'warn' } },
  { sys: 3, sum: 6, hist: 12, cur: 3,
    caption: 'So the app compresses the oldest turns into a short summary — or starts a fresh session. Room reopens, and the conversation continues.',
    note: { text: '↺ Oldest turns compressed into a summary', tone: 'ok' } },
]

const turn = computed(() => Math.min($clicks.value, beats.length - 1))
const b = computed(() => beats[turn.value])

const used = computed(() => b.value.sys + b.value.sum + b.value.hist + b.value.cur)
const free = computed(() => Math.max(0, CAP - used.value))
const pct = computed(() => Math.round((used.value / CAP) * 100))

// fixed-order walk → a per-cell state array (length CAP)
const cells = computed(() => {
  const arr = []
  const push = (state, n) => { for (let k = 0; k < n; k++) arr.push(state) }
  push('system', b.value.sys)
  push('summary', b.value.sum)
  push('history', b.value.hist)
  push('current', b.value.cur)
  while (arr.length < CAP) arr.push('free')
  return arr.slice(0, CAP)
})

const COLORS = {
  system: 'var(--cool)',
  history: 'var(--warm)',
  current: 'var(--good)',
}
const STRIPE = 'repeating-linear-gradient(45deg, var(--warm) 0 3px, var(--bg-soft) 3px 7px)'

const cellStyle = (c) => {
  if (c === 'free') return {}
  if (c === 'summary') return { background: STRIPE, borderColor: 'var(--warm)' }
  return { background: COLORS[c], borderColor: COLORS[c] }
}

// gauge: blue = comfortable, amber = filling, red = full
const gaugeColor = computed(() =>
  pct.value < 70 ? 'var(--cool)' : pct.value < 100 ? 'var(--warm-bright)' : 'var(--bad)'
)

const fmt = (cellCount) => {
  const k = cellCount * CELL_K
  return k === 0 ? '—' : `${k}k`
}
const legend = computed(() => [
  { key: 'system',  label: 'System prompt', color: COLORS.system,  n: b.value.sys },
  { key: 'history', label: 'History',        color: COLORS.history, n: b.value.hist },
  { key: 'current', label: 'Current turn',   color: COLORS.current, n: b.value.cur },
  { key: 'summary', label: 'Summary',        stripe: true,          n: b.value.sum },
  { key: 'free',    label: 'Free',           color: 'var(--sunken-border)', n: free.value },
])
</script>

<template>
  <div class="cw">
    <!-- fixed window frame -->
    <div class="frame" :style="{ '--cols': COLS }">
      <div
        v-for="(c, i) in cells" :key="i"
        class="cell" :class="c"
        :style="cellStyle(c)"
      />
    </div>

    <!-- per-beat caption (fixed slot) -->
    <div class="caption">{{ b.caption }}</div>

    <!-- readouts -->
    <div class="meta">
      <div class="gauge">
        <div class="gauge-fill" :style="{ width: pct + '%', background: gaugeColor }" />
        <span class="gauge-txt">{{ fmt(used) }} / {{ fmt(CAP) }} · {{ pct }}% full</span>
      </div>
      <div class="status" :class="b.note ? b.note.tone : ''" :style="{ opacity: b.note ? 1 : 0 }">
        {{ b.note ? b.note.text : '' }}
      </div>
    </div>

    <!-- legend with live token counts -->
    <div class="legend">
      <div v-for="item in legend" :key="item.key" class="leg" :class="{ off: item.n === 0 }">
        <span class="sw" :style="item.stripe ? { background: STRIPE } : { background: item.color }" />
        <span class="lg-label">{{ item.label }}</span>
        <span class="lg-num">{{ fmt(item.n) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cw { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; width: 100%; }

.frame {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 6px;
  width: 640px;
  padding: 14px;
  background: var(--bg-soft);
  border: 1px solid var(--hair);
  border-radius: 14px;
}
.cell {
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid var(--sunken-border);
  background: var(--sunken);
  transition: background 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.45s ease;
}
.cell.free { opacity: 0.5; }

.caption {
  height: 2.6rem;
  max-width: 60ch;
  text-align: center;
  font-size: 0.92rem;
  line-height: 1.3;
  color: var(--ink-soft);
}

.meta { width: 640px; display: flex; flex-direction: column; gap: 0.5rem; }
.gauge {
  position: relative; height: 26px; border-radius: 8px;
  background: var(--bg-panel); border: 1px solid var(--hair); overflow: hidden;
}
.gauge-fill {
  height: 100%; opacity: 0.45;
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease;
}
.gauge-txt {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 0.72rem; color: var(--ink);
}
.status {
  font-size: 0.85rem; text-align: center; height: 1.1rem; font-weight: 500;
  transition: opacity 0.4s ease; color: var(--ink-soft);
}
.status.warn { color: var(--bad); }
.status.ok { color: var(--cool-bright); }

.legend {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem 1.3rem;
  width: 640px;
}
.leg {
  display: flex; align-items: center; gap: 0.45rem;
  font-size: 0.76rem; color: var(--ink-soft);
  transition: opacity 0.3s ease;
}
.leg.off { opacity: 0.4; }
.sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; border: 1px solid var(--sunken-border); }
.lg-label { color: var(--ink); }
.lg-num { font-family: var(--mono); color: var(--ink-faint); font-size: 0.72rem; }
</style>
