<script setup>
import { computed, ref, watch } from 'vue'
import { useSlideContext, onSlideEnter } from '@slidev/client'

/*
  ContextWindow — the model can only "see" a fixed-size window. As the
  conversation grows, tokens fill it; once full, the OLDEST tokens fall off.

  PHYSICAL-PAGE RULE: the window frame is a fixed-size grid of cells that
  always exists. Clicks change which cells are filled and the fill colour;
  the frame never resizes and nothing reflows. Dropped cells fade out.
*/

const { $clicks } = useSlideContext()

const CAP = 60                // window capacity in "cells" (each ≈ a chunk of tokens)
const COLS = 20
const adds = [8, 10, 14, 12, 20, 16] // chunk added per turn

// cumulative tokens after each turn
const totals = computed(() => {
  const t = []
  let sum = 0
  adds.forEach(a => { sum += a; t.push(sum) })
  return t
})

const turn = computed(() => Math.min($clicks.value, adds.length))
const used = computed(() => (turn.value === 0 ? 0 : totals.value[turn.value - 1]))
const overflow = computed(() => Math.max(0, used.value - CAP))
const visible = computed(() => Math.min(used.value, CAP))
const pct = computed(() => Math.round((visible.value / CAP) * 100))

// state per cell index 0..CAP-1: 'empty' | 'filled' | 'dropping'
const cells = computed(() => {
  const arr = []
  for (let i = 0; i < CAP; i++) {
    if (i < visible.value) arr.push('filled')
    else arr.push('empty')
  }
  return arr
})

const fillColor = computed(() =>
  pct.value < 70 ? 'var(--good)' : pct.value < 100 ? 'var(--warm-bright)' : 'var(--bad)'
)

const flash = ref(0)
watch(turn, () => flash.value++)
onSlideEnter(() => flash.value++)
</script>

<template>
  <div class="cw">
    <!-- fixed window frame -->
    <div class="frame" :style="{ '--cols': COLS }">
      <div
        v-for="(c, i) in cells" :key="i"
        class="cell" :class="c"
        :style="c === 'filled' ? { background: fillColor, borderColor: fillColor } : {}"
      />
    </div>

    <!-- readouts (fixed slots) -->
    <div class="meta">
      <div class="gauge">
        <div class="gauge-fill" :style="{ width: pct + '%', background: fillColor }" />
        <span class="gauge-txt">{{ visible }} / {{ CAP }} · {{ pct }}% full</span>
      </div>
      <div class="overflow" :style="{ opacity: overflow > 0 ? 1 : 0 }">
        ⟵ {{ overflow }} oldest tokens pushed out of the window
      </div>
    </div>
  </div>
</template>

<style scoped>
.cw { display: flex; flex-direction: column; align-items: center; gap: 1.4rem; width: 100%; }

.frame {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 6px;
  width: 620px;
  padding: 14px;
  background: var(--bg-soft);
  border: 1px solid var(--hair);
  border-radius: 14px;
}
.cell {
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid #1c212c;
  background: #11151d;
  transition: background 0.4s ease, border-color 0.4s ease, opacity 0.4s ease;
}
.cell.empty { opacity: 0.55; }

.meta { width: 620px; display: flex; flex-direction: column; gap: 0.7rem; }
.gauge {
  position: relative; height: 26px; border-radius: 8px;
  background: var(--bg-panel); border: 1px solid var(--hair); overflow: hidden;
}
.gauge-fill { height: 100%; transition: width 0.5s ease, background 0.4s ease; opacity: 0.35; }
.gauge-txt {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 0.72rem; color: var(--ink);
}
.overflow {
  font-size: 0.9rem; color: var(--bad); text-align: center;
  transition: opacity 0.4s ease; height: 1.2rem;
}
</style>
