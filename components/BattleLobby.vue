<script setup lang="ts">
/**
 * Battle lobby — shown on screen while players join from their phones.
 * Builds the join URL (battle.html + wsUrl + groupId) into a QR, shows a live
 * player count and the names lighting up as people join. No clicks needed; it's
 * live. Presenter advances to the first question on the next slide.
 */
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNav, onSlideEnter } from "@slidev/client";
import SlideQuizQR from "../node_modules/slidev-addon-slide-quiz/components/SlideQuizQR.vue";
import { battle, BATTLE_WS_URL, BATTLE_QUESTIONS, battleGroupId } from "./battle/battleConfig";

const b = battle();
const route = useRoute();
const router = useRouter();

// Reflect the resolved room into the deck URL (so it's visible/shareable and
// survives a reload). Done THROUGH vue-router — Slidev spreads the current query
// onto every slide navigation, so writing it here keeps `?groupId=` across all
// later slides; a raw history.replaceState would be dropped on the next advance.
function syncGroupIdToUrl() {
  const gid = battleGroupId();
  if (route.query.groupId === gid) return;          // already there (forced or written)
  router.replace({ query: { ...route.query, groupId: gid } }).catch(() => {});
}

// onSlideEnter (not onMounted): Slidev keeps slides mounted, so onMounted fires
// once — possibly during pre-render of an adjacent slide. We want the phase set
// every time the host actually lands here (incl. navigating back).
onSlideEnter(() => { syncGroupIdToUrl(); b.toLobby(); });

const joinUrl = computed(() => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const u = new URL(`${base}/battle.html`);
  u.searchParams.set("wsUrl", BATTLE_WS_URL);
  u.searchParams.set("groupId", battleGroupId());
  return u.toString();
});

const players = computed(() => b.state.players ? [...b.players()] : []);
const count = computed(() => players.value.length);

const { currentSlideNo, go } = useNav();
// The battle occupies: lobby (1) + questions (BATTLE_QUESTIONS.length) + mid-leaderboard (1) + final leaderboard (1).
// Skip target = current slide + all battle slides.
const totalBattleSlides = 1 + BATTLE_QUESTIONS.length + 1 + 1;
function skipBattle() { go(currentSlideNo.value + totalBattleSlides); }
</script>

<template>
  <div class="battle-stage">
    <div class="bl-left">
      <div class="bl-kicker">⚔️ AI Battle</div>
      <h2 class="bl-title">Scan. Name yourself. <span class="grad-warm">Play.</span></h2>
      <div class="bl-qr">
        <SlideQuizQR :url="joinUrl" :size="230" />
        <div class="bl-qrcap">scan to join</div>
        <div class="bl-rules">No speed bonus · Answer is final</div>
      </div>
    </div>

    <div class="bl-right">
      <div class="bl-count"><span class="n">{{ count }}</span> player{{ count === 1 ? '' : 's' }} in</div>
      <div class="bl-grid">
        <transition-group name="pop">
          <div v-for="p in players" :key="p.sessionId" class="bl-chip">{{ p.name }}</div>
        </transition-group>
        <div v-if="count === 0" class="bl-empty">Waiting for the first challenger…</div>
      </div>
    </div>

    <div class="bl-room">room: {{ battleGroupId() }}</div>
    <button class="bl-skip" @click="skipBattle">Skip battle ›</button>
  </div>
</template>

<style scoped>
.battle-stage { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr;
  gap: 40px; padding: 56px 64px; align-items: start; }
.bl-kicker { font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
  color: var(--warm-bright); font-size: .9rem; }
.bl-title { font-size: 2.6rem; line-height: 1.08; margin: 10px 0 22px; }
.bl-qr { display: inline-flex; flex-direction: column; align-items: center; gap: 8px;
  background: var(--bg-panel); border: 1px solid var(--hair);
  padding: 18px; border-radius: 18px; box-shadow: var(--elev); }
.bl-qrcap { color: var(--ink-soft); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; }

.bl-right { align-self: stretch; display: flex; flex-direction: column; padding-top: 8px; }
.bl-count { font-size: 1.25rem; margin-bottom: 16px; color: var(--ink-soft); }
.bl-count .n { font-size: 2rem; font-weight: 900; color: var(--warm-bright); }
/* Sized to hold ~40 names without scrolling: compact chips, multi-column wrap.
   Names truncate with an ellipsis so one long name can't blow out a row. */
.bl-grid { display: flex; flex-wrap: wrap; gap: 8px; align-content: flex-start; overflow: hidden;
  max-height: 64vh; }
.bl-chip { background: var(--cool); color: #001722; font-weight: 700; font-size: .9rem;
  padding: 6px 12px; border-radius: 999px; box-shadow: 0 4px 12px rgba(var(--cool-rgb),.22);
  max-width: 11rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bl-empty { color: var(--ink-faint); font-style: italic; }

.bl-rules { font-size: .75rem; color: var(--ink-faint); margin-top: 4px; }

.bl-room { position: absolute; bottom: 24px; left: 32px; font-family: var(--mono);
  font-size: .7rem; color: var(--ink-faint); opacity: .5; }

.bl-skip { position: absolute; bottom: 24px; right: 32px; background: none; border: 1px solid var(--hair);
  color: var(--ink-soft); font-size: .78rem; font-weight: 600; padding: 6px 14px; border-radius: 8px;
  cursor: pointer; opacity: .6; transition: opacity .2s; }
.bl-skip:hover { opacity: 1; }

.pop-enter-active { transition: all .35s cubic-bezier(0.22, 1, 0.36, 1); }
.pop-enter-from { opacity: 0; transform: scale(.6) translateY(8px); }
</style>
