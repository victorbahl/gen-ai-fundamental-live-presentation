<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AgentContextWindow (Part 3 — Agents) — the SAME fixed-space grid as ContextWindow.vue,
  but seen through an AGENT loop. Two new content types appear, and they're the
  whole point of this slide:

    system    (cool/azure)       — the rules. Pinned.
    tool defs (cool-bright/blue) — the schemas of every tool the agent may call,
                                   carried on every call.
    goal      (good/green)       — the user's goal, set once.
    history   (warm/gold)        — the agent's own think/act steps, growing.
    tool data (warm-bright/amber)— the API responses folded back in. The big
                                   space-hog: every Observe dumps a blob of JSON.
    memory    (striped azure)    — a compact note kept OUTSIDE the window, then
                                   read back in when needed.
    free      (sunken)           — what's left.

  TEACHING ARC: an agent loop fills the window FAST, mostly with tool OUTPUT.
  When it's full the agent can't just forget — it OFFLOADS to external memory
  (write a compact note, drop the raw blobs, pull the note back when needed).
  That's exactly the "Memory" piece on the next slide.

  PHYSICAL-PAGE RULE (4): fixed CAP cells, fixed segment order; cells only change
  colour in place. Rule 8: lands showing system + tool defs already.
*/

const { $clicks } = useSlideContext()

const CAP = 60
const COLS = 20
const CELL_K = 2           // each cell ≈ 2k tokens (tool output is big)

// segment order is FIXED: system → defs → goal → history → toolData → memory → free
const beats = [
  { sys: 3, defs: 7, goal: 0, hist: 0,  data: 0,  mem: 0,
    caption: 'Before the agent runs one step, it already carries the system prompt AND the schema of every tool it may call — on every single call.' },
  { sys: 3, defs: 7, goal: 3, hist: 0,  data: 0,  mem: 0,
    caption: 'The user’s goal goes in: “when will order #7788 arrive?”. Set once — green.' },
  { sys: 3, defs: 7, goal: 3, hist: 4,  data: 14, mem: 0,
    caption: 'One loop: the agent thinks, calls get_order_status — and the API’s response, a big JSON blob, is folded straight into the window.' },
  { sys: 3, defs: 7, goal: 3, hist: 8,  data: 29, mem: 0,
    caption: 'Another loop. Each Observe dumps more data. It’s tool OUTPUT — not our prose — that fills an agent’s window, fast.',
    note: { text: 'Window almost full — after only a few loops', tone: 'warn' } },
  { sys: 3, defs: 7, goal: 3, hist: 6,  data: 8,  mem: 4,
    caption: 'So the agent offloads: it writes a compact note to EXTERNAL memory, drops the raw blobs, and pulls the note back only when it needs it.',
    note: { text: '↗ Offloaded to external memory — kept outside the window', tone: 'ok' } },
]

const turn = computed(() => Math.min($clicks.value, beats.length - 1))
const b = computed(() => beats[turn.value])

const used = computed(() =>
  b.value.sys + b.value.defs + b.value.goal + b.value.hist + b.value.data + b.value.mem)
const free = computed(() => Math.max(0, CAP - used.value))
const pct = computed(() => Math.round((used.value / CAP) * 100))

const COLORS = {
  system: 'var(--cool)',
  defs: 'var(--cool-bright)',
  goal: 'var(--good)',
  history: 'var(--warm)',
  data: 'var(--warm-bright)',
}
const MEM_STRIPE = 'repeating-linear-gradient(45deg, var(--cool) 0 3px, var(--bg-soft) 3px 7px)'

// fixed-order walk → per-cell state array
const cells = computed(() => {
  const arr = []
  const push = (state, n) => { for (let k = 0; k < n; k++) arr.push(state) }
  push('system', b.value.sys)
  push('defs', b.value.defs)
  push('goal', b.value.goal)
  push('history', b.value.hist)
  push('data', b.value.data)
  push('memory', b.value.mem)
  while (arr.length < CAP) arr.push('free')
  return arr.slice(0, CAP)
})

const cellStyle = (c) => {
  if (c === 'free') return {}
  if (c === 'memory') return { background: MEM_STRIPE, borderColor: 'var(--cool)' }
  return { background: COLORS[c], borderColor: COLORS[c] }
}

const gaugeColor = computed(() =>
  pct.value < 70 ? 'var(--cool)' : pct.value < 100 ? 'var(--warm-bright)' : 'var(--bad)'
)

const fmt = (cellCount) => {
  const k = cellCount * CELL_K
  return k === 0 ? '—' : `${k}k`
}
const legend = computed(() => [
  { key: 'system',  label: 'System',     color: COLORS.system,  n: b.value.sys },
  { key: 'defs',    label: 'Tool defs',  color: COLORS.defs,     n: b.value.defs },
  { key: 'goal',    label: 'Goal',       color: COLORS.goal,     n: b.value.goal },
  { key: 'history', label: 'History',    color: COLORS.history,  n: b.value.hist },
  { key: 'data',    label: 'Tool data',  color: COLORS.data,     n: b.value.data },
  { key: 'memory',  label: 'Ext. memory', stripe: true,         n: b.value.mem },
  { key: 'free',    label: 'Free',       color: 'var(--sunken-border)', n: free.value },
])
</script>

<template>
  <div class="cw">
    <div class="frame" :style="{ '--cols': COLS }">
      <div
        v-for="(c, i) in cells" :key="i"
        class="cell" :class="c"
        :style="cellStyle(c)"
      />
    </div>

    <div class="caption">{{ b.caption }}</div>

    <div class="meta">
      <div class="gauge">
        <div class="gauge-fill" :style="{ width: pct + '%', background: gaugeColor }" />
        <span class="gauge-txt">{{ fmt(used) }} / {{ fmt(CAP) }} · {{ pct }}% full</span>
      </div>
      <div class="status" :class="b.note ? b.note.tone : ''" :style="{ opacity: b.note ? 1 : 0 }">
        {{ b.note ? b.note.text : '' }}
      </div>
    </div>

    <div class="legend">
      <div v-for="item in legend" :key="item.key" class="leg" :class="{ off: item.n === 0 }">
        <span class="sw" :style="item.stripe ? { background: MEM_STRIPE } : { background: item.color }" />
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
  display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem 1.1rem;
  width: 660px;
}
.leg {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.76rem; color: var(--ink-soft);
  transition: opacity 0.3s ease;
}
.leg.off { opacity: 0.4; }
.sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; border: 1px solid var(--sunken-border); }
.lg-label { color: var(--ink); }
.lg-num { font-family: var(--mono); color: var(--ink-faint); font-size: 0.72rem; }
</style>
