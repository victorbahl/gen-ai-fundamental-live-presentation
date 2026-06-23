<script setup lang="ts">
/**
 * PREVIEW-ONLY clone of BattleLeaderboard, fed STATIC data via props so we can
 * eyeball edge cases (ties, 30 players) without running a live battle.
 *
 * Logic + styles are COPIED VERBATIM from BattleLeaderboard.vue (full real size),
 * so what shows here is exactly what the room sees. Only the data source changes
 * (a `players` prop instead of the live engine) and it renders fully-revealed.
 * Throwaway demo aid — delete with its slide once reviewed.
 */
import { computed } from "vue";

const props = defineProps<{
  players: { name: string; score: number }[];
}>();

const board = computed(() =>
  [...props.players].map((p, i) => ({ ...p, sessionId: "s" + i }))
    .sort((a, b) => b.score - a.score));

// Group into PODIUM TIERS by distinct score (dense ranking).
const tiers = computed(() => {
  const order: number[] = [];
  const byScore = new Map<number, typeof board.value>();
  for (const p of board.value) {
    if (!byScore.has(p.score)) { byScore.set(p.score, []); order.push(p.score); }
    byScore.get(p.score)!.push(p);
  }
  return order.map((score, i) => ({ pos: i + 1, score, players: byScore.get(score)! }));
});

const MAX_PODIUM_NAMES = 3;
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
function names(tier: any) { return tier ? tier.players.slice(0, MAX_PODIUM_NAMES) : []; }
function nameMore(tier: any) { return tier ? Math.max(0, tier.players.length - MAX_PODIUM_NAMES) : 0; }
</script>

<template>
  <div class="battle-stage lb">
    <div class="lb-kicker">🏆 Final standings</div>
    <h2 class="lb-title">The <span class="grad-warm">winners</span></h2>

    <div class="podium">
      <div v-for="s in slots" :key="s.key" class="col" :class="[`rank-${s.pos}`, 'in']">
        <template v-if="s.tier">
          <div class="crown" v-if="isWinner(s.tier)">👑</div>
          <div class="who">
            <span class="medal">{{ MEDALS[s.pos] }}</span>
            <div class="names">
              <span v-for="p in names(s.tier)" :key="p.sessionId" class="nm">{{ p.name }}</span>
              <span v-if="nameMore(s.tier)" class="more">+{{ nameMore(s.tier) }} more</span>
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

.podium { display: flex; align-items: flex-end; justify-content: center; gap: 20px;
  height: 250px; width: 100%; max-width: 720px; }
.col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  flex: 1; opacity: 0; transform: translateY(20px); transition: all .5s cubic-bezier(0.22, 1, 0.36, 1); }
.col.in { opacity: 1; transform: none; }
.col .crown { font-size: 1.5rem; line-height: 1; margin-bottom: 2px; }
.col .who { display: flex; flex-direction: column; align-items: center; margin-bottom: 8px; max-width: 100%; }
.col .medal { font-size: 1.45rem; line-height: 1; }
.col .names { display: flex; flex-direction: column; align-items: center; gap: 0; margin: 2px 0; max-width: 100%; }
.col .nm { font-weight: 800; font-size: .95rem; line-height: 1.2; max-width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col .more { font-size: .72rem; color: var(--ink-soft); font-weight: 700; }
.col .sc { color: var(--warm-bright); font-weight: 800; font-size: .85rem; }
.col .bar { width: 100%; border-radius: 10px 10px 0 0; display: grid; place-items: start center;
  padding-top: 8px; }
.col .rk { font-size: 1.4rem; font-weight: 900; color: rgba(255,255,255,.55); }
.rank-1 .bar { height: 116px; background: linear-gradient(180deg, var(--warm), rgba(252,192,3,.35)); }
.rank-1 .rk { color: #5a4500; }
.rank-2 .bar { height: 88px; background: linear-gradient(180deg, #cfd6e6, rgba(207,214,230,.3)); }
.rank-2 .rk { color: #3a4256; }
.rank-3 .bar { height: 64px; background: linear-gradient(180deg, #d99a5b, rgba(217,154,91,.3)); }
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
</style>
