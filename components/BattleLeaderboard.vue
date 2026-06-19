<script setup lang="ts">
/**
 * Battle finale — the top-3 podium + runners-up. Reveals by click:
 *   c0  full standings (4th+) visible, podium empty
 *   c1  3rd-slot   c2  2nd-slot   c3  1st-slot   (dramatic bottom-up reveal)
 *
 * SPOILER GUARD: the engine only pushes the standings to phones once the host
 * has revealed 1st place (c>=3). Before that phones see "results coming up —
 * look at the screen", so nobody learns they won on their phone first.
 *
 * EX-AEQUO: medals, bar heights and the crown are driven by COMPETITION RANK
 * (equal scores share a rank: 1,1,3…), not array position — so tied players are
 * shown as true equals (same height, same medal, both crowned if they're top).
 *
 * Slide usage:  <BattleLeaderboard /> with `clicks: 3`
 */
import { computed, watch } from "vue";
import { useSlideContext, onSlideEnter } from "@slidev/client";
import { battle } from "./battle/battleConfig";

const b = battle();
const { $clicks } = useSlideContext();
const c = computed(() => $clicks.value);

// Push `final`, but only let phones SEE the standings once 1st is revealed
// (c>=3). onSlideEnter + watch so it re-asserts on every (re)entry and click.
function syncFinal() { b.final(c.value >= 3); }
onSlideEnter(syncFinal);
watch(c, syncFinal);

const board = computed(() => b.leaderboard());

// Competition ranking: equal scores share a rank (1,1,3…). This is what makes
// ex-aequo correct — two players on the same score get the same rank, medal and
// podium height instead of an arbitrary 1st/2nd split.
const ranked = computed(() => {
  let prevScore: number | null = null;
  let prevRank = 0;
  return board.value.map((p, i) => {
    const rank = prevScore !== null && p.score === prevScore ? prevRank : i + 1;
    prevScore = p.score; prevRank = rank;
    return { ...p, rank };
  });
});
const top3 = computed(() => ranked.value.slice(0, 3));
const rest = computed(() => ranked.value.slice(3, 8));

// Crown every player sharing the top score (>0 guard: no winner on an all-zero
// or empty board, so no crown floats over an empty podium).
const topScore = computed(() => (board.value.length ? board.value[0].score : 0));
function isWinner(p: any) { return !!p && topScore.value > 0 && p.score === topScore.value; }

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
function medal(p: any) { return p ? (MEDALS[p.rank] || "") : ""; }

// Reveal order is by physical podium SLOT (3rd slot first), independent of rank.
function shown(slot: "first" | "second" | "third") {
  if (slot === "third") return c.value >= 1;
  if (slot === "second") return c.value >= 2;
  if (slot === "first") return c.value >= 3;
  return false;
}
// The three physical columns, arranged 2nd · 1st · 3rd visually.
const first = computed(() => top3.value[0]);
const second = computed(() => top3.value[1]);
const third = computed(() => top3.value[2]);
</script>

<template>
  <div class="battle-stage lb">
    <div class="lb-kicker">🏆 Final standings</div>
    <h2 class="lb-title">The <span class="grad-warm">winners</span></h2>

    <div class="podium">
      <!-- left slot (runner-up) -->
      <div class="col" :class="[`rank-${Math.min(second?.rank || 2, 3)}`, { in: shown('second') }]">
        <div class="crown" v-if="isWinner(second)">👑</div>
        <div class="who" v-if="second"><span class="medal">{{ medal(second) }}</span>
          <span class="nm">{{ second.name }}</span><span class="sc">{{ second.score }}</span></div>
        <div class="bar"><span class="rk">{{ second?.rank }}</span></div>
      </div>
      <!-- middle slot (winner) -->
      <div class="col" :class="[`rank-${Math.min(first?.rank || 1, 3)}`, { in: shown('first') }]">
        <div class="crown" v-if="isWinner(first)">👑</div>
        <div class="who" v-if="first"><span class="medal">{{ medal(first) }}</span>
          <span class="nm">{{ first.name }}</span><span class="sc">{{ first.score }}</span></div>
        <div class="bar"><span class="rk">{{ first?.rank }}</span></div>
      </div>
      <!-- right slot (third) -->
      <div class="col" :class="[`rank-${Math.min(third?.rank || 3, 3)}`, { in: shown('third') }]">
        <div class="crown" v-if="isWinner(third)">👑</div>
        <div class="who" v-if="third"><span class="medal">{{ medal(third) }}</span>
          <span class="nm">{{ third.name }}</span><span class="sc">{{ third.score }}</span></div>
        <div class="bar"><span class="rk">{{ third?.rank }}</span></div>
      </div>
    </div>

    <div class="rest" v-if="rest.length">
      <div v-for="p in rest" :key="p.sessionId" class="rrow">
        <span class="pos">{{ p.rank }}</span>
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
.lb-title { font-size: 2.4rem; margin: 6px 0 20px; }

/* The podium reserves the full column height (tallest bar + name block + crown)
   so the winner's column can never grow UPWARD into the title. */
.podium { display: flex; align-items: flex-end; justify-content: center; gap: 22px;
  height: 320px; width: 100%; max-width: 760px; }
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
/* Heights/colours by RANK, not slot — so ex-aequo players are visually equal. */
.rank-1 .bar { height: 180px; background: linear-gradient(180deg, var(--warm), rgba(252,192,3,.35)); }
.rank-1 .rk { color: #5a4500; }
.rank-2 .bar { height: 135px; background: linear-gradient(180deg, #cfd6e6, rgba(207,214,230,.3)); }
.rank-2 .rk { color: #3a4256; }
.rank-3 .bar { height: 100px; background: linear-gradient(180deg, #d99a5b, rgba(217,154,91,.3)); }
.rank-3 .rk { color: #5a3a18; }
.crown { font-size: 2rem; margin-bottom: 2px; line-height: 1; }

.rest { margin-top: 26px; width: 100%; max-width: 560px; display: grid; gap: 8px; }
.rrow { display: flex; align-items: center; gap: 14px; background: var(--bg-panel);
  border: 1px solid var(--hair); border-radius: 10px; padding: 9px 16px; box-shadow: var(--elev); }
.rrow .pos { width: 26px; font-weight: 800; color: var(--ink-soft); }
.rrow .pn { flex: 1; font-weight: 600; }
.rrow .ps { color: var(--warm-bright); font-weight: 700; }
.empty { color: var(--ink-soft); margin-top: 40px; font-style: italic; }
</style>
