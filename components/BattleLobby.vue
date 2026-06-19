<script setup lang="ts">
/**
 * Battle lobby — shown on screen while players join from their phones.
 * Builds the join URL (battle.html + wsUrl + groupId) into a QR, shows a live
 * player count and the names lighting up as people join. No clicks needed; it's
 * live. Presenter advances to the first question on the next slide.
 */
import { computed } from "vue";
import { onSlideEnter } from "@slidev/client";
import SlideQuizQR from "../node_modules/slidev-addon-slide-quiz/components/SlideQuizQR.vue";
import { battle, BATTLE_WS_URL, battleGroupId } from "./battle/battleConfig";

const b = battle();

// Same brand lockup as the cover (slides.md): kicker + the two logos, so the
// battle opener reads as part of the same talk. Logos resolve under the Vite
// base, and sit in a white pill so they stay legible in BOTH light + dark theme.
const base = import.meta.env.BASE_URL;
const logos = ["mulesoft.svg", "informatica.svg"].map((f) => `${base}img/${f}`);
// onSlideEnter (not onMounted): Slidev keeps slides mounted, so onMounted fires
// once — possibly during pre-render of an adjacent slide. We want the phase set
// every time the host actually lands here (incl. navigating back).
onSlideEnter(() => { b.toLobby(); });

const joinUrl = computed(() => {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const u = new URL(`${base}/battle.html`);
  u.searchParams.set("wsUrl", BATTLE_WS_URL);
  u.searchParams.set("groupId", battleGroupId());
  return u.toString();
});

const players = computed(() => b.state.players ? [...b.players()] : []);
const count = computed(() => players.value.length);
</script>

<template>
  <div class="battle-stage">
    <div class="bl-logos">
      <img v-for="(src, i) in logos" :key="i" :src="src" alt="" class="bl-logo" />
    </div>
    <div class="bl-left">
      <div class="bl-kicker">⚔️ AI Battle · Hackathon AI · SE French Team</div>
      <h2 class="bl-title">Scan. Name yourself. <span class="grad-warm">Play.</span></h2>
      <div class="bl-qr">
        <SlideQuizQR :url="joinUrl" :size="230" />
        <div class="bl-qrcap">scan to join</div>
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
  </div>
</template>

<style scoped>
.battle-stage { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr;
  gap: 40px; padding: 56px 64px; align-items: start; }

/* Brand lockup — mirrors the cover's top-right logos, in a light pill so the
   dark-on-transparent marks read on both the light and dark canvas. */
.bl-logos { position: absolute; top: 26px; right: 32px; display: flex; align-items: center;
  gap: 18px; background: #fff; padding: 8px 16px; border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,.18); }
.bl-logo { height: 24px; width: auto; }

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
  padding: 6px 12px; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,162,223,.22);
  max-width: 11rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bl-empty { color: var(--ink-faint); font-style: italic; }

.pop-enter-active { transition: all .35s cubic-bezier(0.22, 1, 0.36, 1); }
.pop-enter-from { opacity: 0; transform: scale(.6) translateY(8px); }
</style>
