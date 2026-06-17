<script setup>
/*
  PartOpener — part-opener hero (Archetype A variant) shown at the start
  of each of the three parts: AI · LLMs · Agents.

  It reuses the roadmap/agenda copy and adds a SPINE PROGRESS bar at the
  top — the full "AI › LLMs › Agents" spine with the current part lit and
  the others dimmed — so the room is re-oriented on every part jump.

  RULES (same as Hero.vue):
   - Background is a PLACEHOLDER: a gradient shows until the user drops a
     real photo at public/img/<bg>. url() layers ON TOP of a gradient, so
     a missing file falls through to the gradient.
   - NO block/scrim/panel behind the text — text sits directly on the
     image, legible via text-shadow only (Rule 3).
   - Brand accents come from the tokens (cool = azure for AI, warm = gold
     for LLMs/Agents), never baked-in hex (Rule 7).

  Usage:
    <PartOpener bg="part-1.jpg" :active="1" accent="cool" num="01"
      headline="A quick map of the field" sub="…and where GenAI fits" />
*/
const props = defineProps({
  bg: { type: String, required: true },       // filename under public/img/
  active: { type: Number, required: true },    // 1 | 2 | 3 — which spine word is lit
  accent: { type: String, default: 'warm' },   // 'cool' | 'warm' — kicker + underline
  num: { type: String, required: true },       // "01" | "02" | "03"
  headline: { type: String, required: true },  // big serif line (agenda main)
  sub: { type: String, default: '' },          // small line beneath (agenda sub)
})

const spine = [
  { word: 'AI', accent: 'cool' },
  { word: 'LLMs', accent: 'warm' },
  { word: 'Agents', accent: 'warm' },
]

// Prepend Vite's BASE_URL so images resolve under a deploy sub-path
// (GitHub Pages /repo/); dev base is "/", so this is a no-op locally.
const bgUrl = `${import.meta.env.BASE_URL}img/${props.bg}`
</script>

<template>
  <div
    class="part-opener"
    :class="[`ac-${accent}`]"
    :style="{ '--bg-url': `url('${bgUrl}')` }"
  >
    <!-- SPINE PROGRESS — full spine, current part lit -->
    <div class="spine">
      <template v-for="(s, i) in spine" :key="s.word">
        <span class="sep" v-if="i > 0">›</span>
        <span
          class="sword"
          :class="[`ac-${s.accent}`, { on: i + 1 === active }]"
        >
          {{ s.word }}
          <span class="sbar" v-if="i + 1 === active" />
        </span>
      </template>
    </div>

    <!-- HEADLINE BLOCK — reuses the agenda copy -->
    <div class="po-inner">
      <div class="po-num">Part {{ num }}</div>
      <h1 class="po-headline">{{ headline }}</h1>
      <div v-if="sub" class="po-sub">{{ sub }}</div>
    </div>
  </div>
</template>

<style scoped>
.part-opener {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 6%;
  /* PLACEHOLDER: real photo (if present) layered over a gradient fallback */
  background-image:
    var(--bg-url),
    linear-gradient(135deg, #11151f 0%, #0b0d12 45%, #161118 100%);
  background-size: cover, cover;
  background-position: center, center;
}

/* ---- spine progress bar (top) ---- */
.spine {
  position: absolute;
  top: 8.5%;
  left: 6%;
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  font-family: var(--serif);
  font-weight: 600;
}
.spine .sep {
  color: #fff;
  opacity: 0.32;
  font-size: 1.5rem;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
}
.spine .sword {
  position: relative;
  color: #fff;
  opacity: 0.38;
  font-size: 1.7rem;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
  transition: opacity 0.4s ease;
}
.spine .sword.on { opacity: 1; }
/* accent underline beneath the active word */
.spine .sbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.42rem;
  height: 3px;
  border-radius: 2px;
  background: var(--warm);
}
.spine .sword.ac-cool .sbar { background: var(--cool); }

/* ---- headline block ---- */
.po-inner {
  max-width: 90%;
  animation: po-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.po-num {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 0.82rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--warm-bright);
  margin-bottom: 1rem;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
}
.ac-cool .po-num { color: var(--cool-bright); }

.po-headline {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 4rem;
  line-height: 1.03;
  letter-spacing: -0.02em;
  color: #fff;
  max-width: 17ch;
  text-wrap: balance;
  text-shadow: 0 2px 28px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.5);
}
.po-sub {
  margin-top: 1.4rem;
  font-family: var(--mono);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  color: #e7ebf2;
  max-width: 46ch;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
}

@keyframes po-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
