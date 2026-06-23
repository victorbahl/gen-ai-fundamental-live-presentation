<script setup lang="ts">
/**
 * Battle finale — the top-3 podium + runners-up. Reveals by click:
 *   c0  runners-up visible, podium empty
 *   c1  3rd-place column   c2  2nd-place column   c3  1st-place column
 *
 * SPOILER GUARD: the engine only pushes standings to phones once the host has
 * revealed 1st place (c>=3). Before that phones see "results coming up".
 *
 * TIES (ex-aequo) — the podium is organised by SCORE TIER, not by array slot:
 * EVERY player sharing the top score sits TOGETHER in the middle column
 * (position 1), the next distinct score fills the left column (position 2), the
 * third fills the right (position 3). So players tied for 1st all stand in the
 * centre — never split into stair-stepped columns. Positions are dense (1,2,3,…
 * by distinct score), so the runners-up continue 4,5,6… with no gaps.
 *
 * ALL WINNERS SHOWN: a podium column lists EVERY tied name (no "+N more" on the
 * podium). When a tier has many names they WRAP into multiple sub-columns above
 * the bar (CSS flex column-wrap), so they all fit without growing into the title.
 * Only the runners-up grid (rank 4+) is capped to fit the slide (tail → "+N more").
 *
 * Slide usage:  <BattleLeaderboard /> with `clicks: 3`
 */
import { computed, watch } from "vue";
import { useSlideContext, onSlideEnter } from "@slidev/client";
import { battle } from "./battle/battleConfig";

const b = battle();
const { $clicks } = useSlideContext();
const c = computed(() => $clicks.value);

// Push `final`, but only let phones SEE standings once 1st is revealed (c>=3).
function syncFinal() { b.final(c.value >= 3); }
onSlideEnter(syncFinal);
watch(c, syncFinal);

const board = computed(() => b.leaderboard()); // players, desc by score

// Group into PODIUM TIERS by distinct score (dense ranking). Players sharing a
// score share a position and a column — ties are grouped, never split.
const tiers = computed(() => {
  const order: number[] = [];
  const byScore = new Map<number, typeof board.value>();
  for (const p of board.value) {
    if (!byScore.has(p.score)) { byScore.set(p.score, []); order.push(p.score); }
    byScore.get(p.score)!.push(p);
  }
  return order.map((score, i) => ({ pos: i + 1, score, players: byScore.get(score)! }));
});

const MAX_REST = 21;         // runners-up chips shown; tail → a "+N more" chip

const first = computed(() => tiers.value[0]);   // middle column
const second = computed(() => tiers.value[1]);   // left column
const third = computed(() => tiers.value[2]);    // right column

// Left→right physical order is 2nd · 1st · 3rd, so the winner sits in the middle.
const slots = computed(() => [
  { key: "second" as const, pos: 2, tier: second.value },
  { key: "first" as const, pos: 1, tier: first.value },
  { key: "third" as const, pos: 3, tier: third.value },
]);

// Runners-up = every tier below the top 3, flattened with their (dense) position.
const restAll = computed(() =>
  tiers.value.slice(3).flatMap((t) => t.players.map((p) => ({ ...p, pos: t.pos }))));
const rest = computed(() => restAll.value.slice(0, MAX_REST));
const restMore = computed(() => Math.max(0, restAll.value.length - rest.value.length));

// Crown the whole top tier (>0 guard: no crown on an empty/all-zero board).
const topScore = computed(() => (board.value.length ? board.value[0].score : 0));
function isWinner(tier: any) { return !!tier && topScore.value > 0 && tier.score === topScore.value; }

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Reveal order is by physical slot (3rd first), independent of who's there.
function shown(key: "first" | "second" | "third") {
  if (key === "third") return c.value >= 1;
  if (key === "second") return c.value >= 2;
  if (key === "first") return c.value >= 3;
  return false;
}
</script>

<template>
  <div class="battle-stage lb">
    <div class="lb-kicker">🏆 Final standings</div>
    <h2 class="lb-title">The <span class="grad-warm">winners</span></h2>

    <div class="podium">
      <div v-for="s in slots" :key="s.key"
           class="col" :class="[`rank-${s.pos}`, { in: shown(s.key) }]">
        <template v-if="s.tier">
          <div class="crown" v-if="isWinner(s.tier)">👑</div>
          <div class="who">
            <span class="medal">{{ MEDALS[s.pos] }}</span>
            <div class="names" :class="{ multi: s.tier.players.length > 4 }">
              <span v-for="p in s.tier.players" :key="p.sessionId" class="nm">{{ p.name }}</span>
            </div>
            <span class="sc">{{ s.tier.score }} pts</span>
          </div>
          <div class="bar"><span class="rk">{{ s.pos }}</span></div>
        </template>
      </div>
    </div>

    <div class="rest" v-if="rest.length">
      <div v-for="p in rest" :key="p.sessionId" class="rrow">
        <span class="pos">{{ p.pos }}</span>
        <span class="pn">{{ p.name }}</span>
        <span class="ps">{{ p.score }}</span>
      </div>
      <div v-if="restMore" class="rrow more-row">+{{ restMore }} more</div>
    </div>
    <div v-else-if="board.length === 0" class="empty">No players joined the battle.</div>
  </div>
</template>

<style scoped>
.battle-stage.lb { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; padding: 32px 56px; }
.lb-kicker { font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
  color: var(--warm-bright); font-size: .85rem; }
.lb-title { font-size: 2rem; margin: 4px 0 14px; }

/* The podium reserves its full height so a tall winner column can't grow up
   into the title; columns are equal width and only differ by bar height. */
.podium { display: flex; align-items: flex-end; justify-content: center; gap: 20px;
  height: 250px; width: 100%; max-width: 720px; }
.col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  flex: 1; opacity: 0; transform: translateY(20px); transition: all .5s cubic-bezier(0.22, 1, 0.36, 1); }
.col.in { opacity: 1; transform: none; }
.col .crown { font-size: 1.3rem; line-height: 1; margin-bottom: 1px; }
.col .who { display: flex; flex-direction: column; align-items: center; margin-bottom: 6px; max-width: 100%; }
.col .medal { font-size: 1.3rem; line-height: 1; }
/* Names stack vertically; with many tied players they WRAP into extra sub-columns
   (column-wrap + a capped height) so EVERY winner shows without growing upward.
   Name width + sub-column gap are kept tight so two sub-columns can't bleed into
   the neighbouring podium column. max-height is tuned so even an 8-way tie's
   column (names + bar + medal + crown) stays inside the reserved podium box and
   never grows into the title. */
.col .names { display: flex; flex-direction: column; flex-wrap: wrap; align-items: center;
  align-content: center; justify-content: flex-end; gap: 0 10px; margin: 2px 0; max-width: 100%;
  max-height: 76px; }
.col .nm { font-weight: 800; font-size: .85rem; line-height: 1.25; max-width: 96px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; }
.col .sc { color: var(--warm-bright); font-weight: 800; font-size: .8rem; margin-top: 2px; }
.col .bar { width: 100%; border-radius: 10px 10px 0 0; display: grid; place-items: start center;
  padding-top: 8px; }
.col .rk { font-size: 1.4rem; font-weight: 900; color: rgba(255,255,255,.55); }
/* Heights/colours by POSITION, not slot — tied players in a column are equal. */
.rank-1 .bar { height: 100px; background: linear-gradient(180deg, var(--warm), rgba(252,192,3,.35)); }
.rank-1 .rk { color: #5a4500; }
.rank-2 .bar { height: 76px; background: linear-gradient(180deg, #cfd6e6, rgba(207,214,230,.3)); }
.rank-2 .rk { color: #3a4256; }
.rank-3 .bar { height: 56px; background: linear-gradient(180deg, #d99a5b, rgba(217,154,91,.3)); }
.rank-3 .rk { color: #5a3a18; }

/* Runners-up: a compact wrapping grid that fits the slide; never a clipped list. */
.rest { margin-top: 16px; width: 100%; max-width: 840px; display: flex; flex-wrap: wrap;
  gap: 6px; justify-content: center; align-content: flex-start; }
.rrow { display: flex; align-items: center; gap: 8px; background: var(--bg-panel);
  border: 1px solid var(--hair); border-radius: 8px; padding: 4px 10px; font-size: .8rem;
  box-shadow: var(--elev); }
.rrow .pos { font-weight: 800; color: var(--ink-soft); }
.rrow .pn { font-weight: 600; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rrow .ps { color: var(--warm-bright); font-weight: 700; }
.more-row { color: var(--ink-soft); font-weight: 700; font-style: italic; }
.empty { color: var(--ink-soft); margin-top: 40px; font-style: italic; }
</style>
