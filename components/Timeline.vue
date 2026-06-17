<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  Timeline — "70 years in one breath": rules → ML → deep learning →
  Transformers (2017) → the ChatGPT moment (2022).

  PHYSICAL-PAGE RULE: the full horizontal axis and all milestone slots are
  rendered from the start at fixed positions. Clicks only fade each
  milestone in and advance the progress line. Nothing shifts.
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

const items = [
  { year: '1950s', title: 'Rules & logic', desc: 'Symbolic AI — hand-written if/then', tone: 'cool' },
  { year: '1990s', title: 'Machine learning', desc: 'Learn patterns from data, not rules', tone: 'cool' },
  { year: '2012', title: 'Deep learning', desc: 'Neural nets crack vision & speech', tone: 'cool' },
  { year: '2017', title: 'Transformers', desc: '"Attention is all you need"', tone: 'warm' },
  { year: '2022', title: 'The ChatGPT moment', desc: 'Prediction at scale goes mainstream', tone: 'warm' },
]

// progress line width tracks how many milestones are revealed.
// The FIRST milestone is visible on arrival (c=0), so revealed count = c + 1.
const progress = computed(() => {
  const n = Math.min(c.value + 1, items.length)
  if (n <= 1) return 0
  return ((n - 1) / (items.length - 1)) * 100
})
</script>

<template>
  <div class="tl">
    <div class="axis">
      <div class="axis-base" />
      <div class="axis-prog" :style="{ width: progress + '%' }" />
      <div class="marks">
        <div
          v-for="(it, i) in items" :key="i"
          class="mark" :class="[it.tone, { on: c >= i }]"
        >
          <div class="dot" />
          <div class="card">
            <div class="year">{{ it.year }}</div>
            <div class="title">{{ it.title }}</div>
            <div class="desc">{{ it.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tl { width: 100%; padding: 0 2%; }
.axis { position: relative; height: 220px; }

.axis-base {
  position: absolute; top: 110px; left: 0; right: 0; height: 2px;
  background: var(--hair);
}
.axis-prog {
  position: absolute; top: 110px; left: 0; height: 2px;
  background: linear-gradient(90deg, var(--cool), var(--warm));
  transition: width 0.5s ease;
}

.marks {
  position: absolute; inset: 0;
  display: grid; grid-template-columns: repeat(5, 1fr);
}
.mark {
  position: relative; display: flex; flex-direction: column; align-items: center;
  opacity: 0; transition: opacity 0.4s ease;
}
.mark.on { opacity: 1; }

.dot {
  position: absolute; top: 102px; width: 18px; height: 18px; border-radius: 50%;
  background: var(--bg); border: 3px solid var(--cool); z-index: 2;
}
.mark.warm .dot { border-color: var(--warm); }

.card {
  position: absolute; top: 134px; width: 84%;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 12px;
  padding: 0.6rem 0.7rem; text-align: center;
}
/* alternate cards above/below the axis so they never collide */
.mark:nth-child(even) .card { top: auto; bottom: 134px; }
.mark:nth-child(even) .dot { top: 102px; }

.year { font-family: var(--mono); font-size: 0.66rem; color: var(--ink-faint); letter-spacing: 0.1em; }
.mark.warm .year { color: var(--warm-bright); }
.title { font-family: var(--serif); font-weight: 600; font-size: 0.98rem; margin: 0.15rem 0; }
.desc { font-size: 0.68rem; color: var(--ink-soft); line-height: 1.3; }
</style>
