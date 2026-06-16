<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AgentLoop — the agentic core: think → act → observe → repeat → done.
  The model keeps looping (calling tools, reading results) until the goal
  is met, then exits.

  PHYSICAL-PAGE RULE: the three loop nodes, the circular arrows, and the
  "done" exit are all rendered from the start in fixed positions. Clicks
  only change which node is "active" (highlight) and fade in the arrows /
  exit. Nothing moves or resizes.
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
// 0 nodes appear, 1 think active, 2 act, 3 observe, 4 loop arrows, 5 done/exit
const active = computed(() => {
  if (c.value <= 1) return 0     // think
  if (c.value === 2) return 1    // act
  if (c.value === 3) return 2    // observe
  return -1                      // loop running / done
})
const looping = computed(() => c.value >= 4)
const done = computed(() => c.value >= 5)
</script>

<template>
  <div class="al">
    <div class="ring" :class="{ spin: looping && !done }">
      <!-- nodes at fixed positions -->
      <div class="node think"   :class="{ on: active === 0, lit: looping }">
        <div class="n-ic">🧠</div><div class="n-t">Think</div>
        <div class="n-s">plan the next step</div>
      </div>
      <div class="node act"     :class="{ on: active === 1, lit: looping }">
        <div class="n-ic">🔧</div><div class="n-t">Act</div>
        <div class="n-s">call a tool (MCP)</div>
      </div>
      <div class="node observe" :class="{ on: active === 2, lit: looping }">
        <div class="n-ic">👁️</div><div class="n-t">Observe</div>
        <div class="n-s">read the result</div>
      </div>

      <!-- circular arrows -->
      <svg class="arrows" viewBox="0 0 320 320" :style="{ opacity: looping ? 1 : 0.25 }">
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--cool)" />
          </marker>
        </defs>
        <path d="M 210 70 A 110 110 0 0 1 210 250" fill="none" stroke="var(--cool)" stroke-width="2.5" marker-end="url(#ah)" opacity="0.8"/>
        <path d="M 188 268 A 110 110 0 0 1 70 188"  fill="none" stroke="var(--cool)" stroke-width="2.5" marker-end="url(#ah)" opacity="0.8"/>
        <path d="M 60 150 A 110 110 0 0 1 150 52"   fill="none" stroke="var(--cool)" stroke-width="2.5" marker-end="url(#ah)" opacity="0.8"/>
      </svg>

      <div class="center">repeat until<br><strong>goal met</strong></div>
    </div>

    <!-- exit to done (fixed slot) -->
    <div class="exit" :style="{ opacity: done ? 1 : 0 }">
      <div class="exit-arrow">→</div>
      <div class="done-pill">✓ Done — return answer</div>
    </div>
  </div>
</template>

<style scoped>
.al { display: flex; align-items: center; justify-content: center; gap: 2.5rem; width: 100%; }

.ring { position: relative; width: 320px; height: 320px; }
.arrows { position: absolute; inset: 0; width: 100%; height: 100%; transition: opacity 0.4s ease; }

.node {
  position: absolute; width: 120px; text-align: center;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  padding: 0.7rem 0.5rem; transition: all 0.35s ease;
}
.node.think   { top: 0;    left: 100px; }
.node.act     { bottom: 6px; right: 0; }
.node.observe { bottom: 6px; left: 0; }
.node.lit { border-color: var(--cool); }
.node.on {
  border-color: var(--warm); box-shadow: 0 0 24px rgba(232,121,74,0.35);
  transform: scale(1.06);
}
.n-ic { font-size: 1.3rem; }
.n-t { font-family: var(--serif); font-weight: 600; font-size: 1.05rem; margin-top: 0.1rem; }
.n-s { font-size: 0.66rem; color: var(--ink-faint); margin-top: 0.1rem; }

.center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  text-align: center; font-size: 0.8rem; color: var(--ink-soft); line-height: 1.4;
}
.center strong { color: var(--cool-bright); }

.exit { display: flex; align-items: center; gap: 0.8rem; transition: opacity 0.4s ease; }
.exit-arrow { font-size: 1.6rem; color: var(--good); }
.done-pill {
  background: rgba(52,211,153,0.12); border: 1px solid var(--good);
  color: var(--good); font-weight: 600; padding: 0.6rem 1rem; border-radius: 12px;
  white-space: nowrap;
}
</style>
