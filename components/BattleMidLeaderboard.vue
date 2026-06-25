<script setup lang="ts">
/**
 * Mid-game leaderboard — shown after Q6 as a halftime check-in.
 * Same tier-based podium as the final, but auto-revealed (no click gating)
 * and no spoiler guard (phones already see their score during play).
 * Does NOT trigger `b.final()` — the game continues after this slide.
 *
 * Slide usage:  <BattleMidLeaderboard /> with `clicks: 0`
 */
import { computed } from "vue";
import { battle } from "./battle/battleConfig";

const b = battle();

const board = computed(() => b.leaderboard());

const tiers = computed(() => {
  const order: number[] = [];
  const byScore = new Map<number, typeof board.value>();
  for (const p of board.value) {
    if (!byScore.has(p.score)) { byScore.set(p.score, []); order.push(p.score); }
    byScore.get(p.score)!.push(p);
  }
  return order.map((score, i) => ({ pos: i + 1, score, players: byScore.get(score)! }));
});

const MAX_REST = 21;

const first = computed(() => tiers.value[0]);
const second = computed(() => tiers.value[1]);
const third = computed(() => tiers.value[2]);

const slots = computed(() => [
  { key: "second" as const, pos: 2, tier: second.value },
  { key: "first" as const, pos: 1, tier: first.value },
  { key: "third" as const, pos: 3, tier: third.value },
]);

const restAll = computed(() =>
  tiers.value.slice(3).flatMap((t) => t.players.map((p) => ({ ...p, pos: t.pos }))));
const rest = computed(() => restAll.value.slice(0, MAX_REST));
const restMore = computed(() => Math.max(0, restAll.value.length - rest.value.length));

const topScore = computed(() => (board.value.length ? board.value[0].score : 0));
function isWinner(tier: any) { return !!tier && topScore.value > 0 && tier.score === topScore.value; }

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
</script>

<template>
  <div class="battle-stage lb mid">
    <div class="lb-kicker">⚔️ Halftime</div>
    <h2 class="lb-title">After 6 rounds — <span class="grad-warm">who's leading?</span></h2>

    <div class="podium">
      <div v-for="s in slots" :key="s.key"
           class="col in" :class="[`rank-${s.pos}`]">
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

    <div class="mid-cta">5 more rounds to go — anything can happen.</div>
  </div>
</template>

<style scoped>
.battle-stage.lb { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; padding: 32px 56px; }
.lb-kicker { font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
  color: var(--warm-bright); font-size: .85rem; }
.lb-title { font-size: 2rem; margin: 4px 0 14px; }

.podium { display: flex; align-items: flex-end; justify-content: center; gap: 20px;
  height: 250px; width: 100%; max-width: 720px; }
.col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  flex: 1; opacity: 0; transform: translateY(20px); transition: all .5s cubic-bezier(0.22, 1, 0.36, 1); }
.col.in { opacity: 1; transform: none; }
.col .crown { font-size: 1.3rem; line-height: 1; margin-bottom: 1px; }
.col .who { display: flex; flex-direction: column; align-items: center; margin-bottom: 6px; max-width: 100%; }
.col .medal { font-size: 1.3rem; line-height: 1; }
.col .names { display: flex; flex-direction: column; flex-wrap: wrap; align-items: center;
  align-content: center; justify-content: flex-end; gap: 0 10px; margin: 2px 0; max-width: 100%;
  max-height: 76px; }
.col .nm { font-weight: 800; font-size: .85rem; line-height: 1.25; max-width: 96px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; }
.col .sc { color: var(--warm-bright); font-weight: 800; font-size: .8rem; margin-top: 2px; }
.col .bar { width: 100%; border-radius: 10px 10px 0 0; display: grid; place-items: start center;
  padding-top: 8px; }
.col .rk { font-size: 1.4rem; font-weight: 900; color: rgba(255,255,255,.55); }
.rank-1 .bar { height: 100px; background: linear-gradient(180deg, var(--warm), rgba(var(--warm-rgb),.35)); }
.rank-1 .rk { color: #5a4500; }
.rank-2 .bar { height: 76px; background: linear-gradient(180deg, #cfd6e6, rgba(207,214,230,.3)); }
.rank-2 .rk { color: #3a4256; }
.rank-3 .bar { height: 56px; background: linear-gradient(180deg, #d99a5b, rgba(217,154,91,.3)); }
.rank-3 .rk { color: #5a3a18; }

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

.mid-cta { margin-top: auto; padding-top: 12px; font-size: 1rem; color: var(--ink-soft);
  font-weight: 600; font-style: italic; }
</style>
