<script setup lang="ts">
/**
 * Battle finale — the top-3 podium + runners-up. On mount it sets the engine to
 * `final`, which pushes every phone its own final rank/score. Reveals by click:
 *   c0  full standings (4th+) visible, podium empty
 *   c1  🥉 third   c2  🥈 second   c3  🥇 first   (dramatic bottom-up reveal)
 *
 * Slide usage:  <BattleLeaderboard /> with `clicks: 3`
 */
import { computed } from "vue";
import { useSlideContext, onSlideEnter } from "@slidev/client";
import { battle } from "./battle/battleConfig";

const b = battle();
const { $clicks } = useSlideContext();
const c = computed(() => $clicks.value);

// onSlideEnter (not onMounted): re-assert the final phase every time the host
// lands here, so phones get the podium even on back-and-forth navigation.
onSlideEnter(() => { b.final(); });

const board = computed(() => b.leaderboard());
const top3 = computed(() => board.value.slice(0, 3));
const rest = computed(() => board.value.slice(3, 8));

// Podium reveal order: 3rd at c>=1, 2nd at c>=2, 1st at c>=3.
function shown(rank: number) {
  if (rank === 3) return c.value >= 1;
  if (rank === 2) return c.value >= 2;
  if (rank === 1) return c.value >= 3;
  return false;
}
// Map array order → place objects for the 3 columns (2nd, 1st, 3rd visually).
const first = computed(() => top3.value[0]);
const second = computed(() => top3.value[1]);
const third = computed(() => top3.value[2]);
</script>

<template>
  <div class="battle-stage lb">
    <div class="lb-kicker">🏆 Final standings</div>
    <h2 class="lb-title">The <span class="grad-warm">winners</span></h2>

    <div class="podium">
      <!-- 2nd -->
      <div class="col second" :class="{ in: shown(2) }">
        <div class="who" v-if="second"><span class="medal">🥈</span>
          <span class="nm">{{ second.name }}</span><span class="sc">{{ second.score }}</span></div>
        <div class="bar"><span class="rk">2</span></div>
      </div>
      <!-- 1st -->
      <div class="col first" :class="{ in: shown(1) }">
        <div class="crown">👑</div>
        <div class="who" v-if="first"><span class="medal">🥇</span>
          <span class="nm">{{ first.name }}</span><span class="sc">{{ first.score }}</span></div>
        <div class="bar"><span class="rk">1</span></div>
      </div>
      <!-- 3rd -->
      <div class="col third" :class="{ in: shown(3) }">
        <div class="who" v-if="third"><span class="medal">🥉</span>
          <span class="nm">{{ third.name }}</span><span class="sc">{{ third.score }}</span></div>
        <div class="bar"><span class="rk">3</span></div>
      </div>
    </div>

    <div class="rest" v-if="rest.length">
      <div v-for="(p, i) in rest" :key="p.sessionId" class="rrow">
        <span class="pos">{{ i + 4 }}</span>
        <span class="pn">{{ p.name }}</span>
        <span class="ps">{{ p.score }}</span>
      </div>
    </div>
    <div v-else-if="board.length === 0" class="empty">No players joined the battle.</div>
  </div>
</template>

<style scoped>
.battle-stage.lb { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; padding: 40px 64px; }
.lb-kicker { font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
  color: var(--warm-bright); font-size: .9rem; }
.lb-title { font-size: 2.4rem; margin: 6px 0 28px; }

.podium { display: flex; align-items: flex-end; justify-content: center; gap: 22px;
  height: 300px; width: 100%; max-width: 760px; }
.col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  flex: 1; opacity: 0; transform: translateY(24px); transition: all .5s cubic-bezier(0.22, 1, 0.36, 1); }
.col.in { opacity: 1; transform: none; }
.col .who { display: flex; flex-direction: column; align-items: center; margin-bottom: 10px; }
.col .medal { font-size: 1.8rem; }
.col .nm { font-weight: 800; font-size: 1.25rem; }
.col .sc { color: var(--warm-bright); font-weight: 800; }
.col .bar { width: 100%; border-radius: 12px 12px 0 0; display: grid; place-items: start center;
  padding-top: 10px; }
.col .rk { font-size: 1.6rem; font-weight: 900; color: rgba(255,255,255,.55); }
.first .bar { height: 220px; background: linear-gradient(180deg, var(--warm), rgba(252,192,3,.35)); }
.first .rk { color: #5a4500; }
.second .bar { height: 160px; background: linear-gradient(180deg, #cfd6e6, rgba(207,214,230,.3)); }
.second .rk { color: #3a4256; }
.third .bar { height: 120px; background: linear-gradient(180deg, #d99a5b, rgba(217,154,91,.3)); }
.third .rk { color: #5a3a18; }
.crown { font-size: 2rem; margin-bottom: 2px; }

.rest { margin-top: 26px; width: 100%; max-width: 560px; display: grid; gap: 8px; }
.rrow { display: flex; align-items: center; gap: 14px; background: var(--bg-panel);
  border: 1px solid var(--hair); border-radius: 10px; padding: 9px 16px; box-shadow: var(--elev); }
.rrow .pos { width: 26px; font-weight: 800; color: var(--ink-soft); }
.rrow .pn { flex: 1; font-weight: 600; }
.rrow .ps { color: var(--warm-bright); font-weight: 700; }
.empty { color: var(--ink-soft); margin-top: 40px; font-style: italic; }
</style>
