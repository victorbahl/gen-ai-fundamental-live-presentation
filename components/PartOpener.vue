<script setup>
/*
  PartOpener — part-opener hero (Archetype A variant) shown at the start
  of each of the three parts: AI · LLMs · Agents.

  SIGNATURE — the fil rouge "AI › LLMs › Agents" rendered as a TOKEN
  STREAM: three token-chips on a HEAT RAMP (the cool→hot prediction
  spectrum the whole deck rides). Each part owns ONE hue, everywhere:
  AI = teal (cool), LLMs = gold (warm middle), Agents = coral (hot). The
  CURRENT part is fully lit (filled tint + glow + a blinking caret = "you
  are here, generating"); the others sit dim as outlined chips in their
  own hue. So each part has a stable identity AND position is obvious.

  RULES (same as Hero.vue):
   - Background is a PLACEHOLDER: a gradient shows until the user drops a
     real photo at public/img/<bg>. url() layers ON TOP of a gradient, so
     a missing file falls through to the gradient.
   - NO block/scrim/panel behind the text — text sits directly on the
     image, legible via text-shadow only (Rule 3).
   - Accents come from the tokens (teal/gold/coral), never baked-in hex
     (Rule 7).

  Usage:
    <PartOpener bg="part-1.jpg" :active="1" num="01"
      headline="A quick map of the field" sub="…and where GenAI fits" />
  (`accent` is derived from `active` — AI=cool, LLMs=gold, Agents=warm.)
*/
const props = defineProps({
  bg: { type: String, required: true },       // filename under public/img/
  active: { type: Number, required: true },    // 1 | 2 | 3 — which part is current
  num: { type: String, required: true },       // "01" | "02" | "03"
  headline: { type: String, required: true },  // big serif line (agenda main)
  sub: { type: String, default: '' },          // small line beneath (agenda sub)
})

// the heat ramp: each part's word + its home hue class (cool→gold→warm)
const spine = [
  { word: 'AI', hue: 'cool' },
  { word: 'LLMs', hue: 'gold' },
  { word: 'Agents', hue: 'warm' },
]
// the active part's home hue drives the "Part NN" eyebrow accent too
const activeHue = spine[props.active - 1]?.hue ?? 'warm'

// Prepend Vite's BASE_URL so images resolve under a deploy sub-path
// (GitHub Pages /repo/); dev base is "/", so this is a no-op locally.
const bgUrl = `${import.meta.env.BASE_URL}img/${props.bg}`
</script>

<template>
  <div
    class="part-opener"
    :class="[`ac-${activeHue}`]"
    :style="{ '--bg-url': `url('${bgUrl}')` }"
  >
    <!-- SPINE = TOKEN STREAM on a heat ramp — each part owns its hue,
         the current part is lit (filled + caret), others dim. -->
    <div class="spine">
      <span class="spos">pos {{ num }} / 03</span>
      <template v-for="(s, i) in spine" :key="s.word">
        <span class="sep" v-if="i > 0">›</span>
        <span class="tok" :class="[`hue-${s.hue}`, { on: i + 1 === active }]">
          {{ s.word }}
          <span v-if="i + 1 === active" class="caret">▍</span>
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

/* ---- spine = token stream (top) ---- */
.spine {
  position: absolute;
  top: 8%;
  left: 6%;
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
/* mono position read-out, like a stream cursor index */
.spine .spos {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #fff;
  opacity: 0.62;
  margin-right: 0.35rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
.spine .sep {
  color: #fff;
  opacity: 0.28;
  font-size: 1.05rem;
  font-family: var(--serif);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
/* a TOKEN-CHIP: mono text in a thin pill. Each chip owns one heat-ramp
   hue (set via .hue-cool/.hue-gold/.hue-warm → --chip). DIM by default
   (outline only); the active chip (.on) fills + glows + shows a caret. */
.spine .tok {
  position: relative;
  font-family: var(--mono);
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.01em;
  padding: 0.24rem 0.66rem;
  border-radius: 7px;
  color: #fff;
  border: 1px solid;
  border-color: color-mix(in srgb, var(--chip) 55%, transparent);
  opacity: 0.5;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
  transition: opacity 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}
.spine .tok.hue-cool { --chip: var(--cool); --chip-rgb: var(--cool-rgb); }
.spine .tok.hue-gold { --chip: var(--gold); --chip-rgb: var(--gold-rgb); }
.spine .tok.hue-warm { --chip: var(--warm); --chip-rgb: var(--warm-rgb); }
/* the current part — lit: filled tint in its own hue, full border + glow */
.spine .tok.on {
  opacity: 1;
  border-color: var(--chip);
  background: rgba(var(--chip-rgb), 0.26);
  box-shadow: 0 0 22px rgba(var(--chip-rgb), 0.4);
}
/* blinking caret on the active token — the deck's cursor (Rule 6: the one
   allowed loop, it signals "generating"). Inherits the chip's hue. */
.spine .caret {
  display: inline-block;
  margin-left: 0.06rem;
  color: var(--chip);
  font-weight: 400;
  transform: translateY(0.02em);
  animation: spine-blink 1.1s steps(1) infinite;
}
@keyframes spine-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .spine .caret { animation: none; }
}

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
  /* sits on a dark photo — use the BRIGHT accent (like .grad-warm on a hero),
     not the dark on-paper -bright shade. Hue follows the active part. */
  color: var(--warm);
  margin-bottom: 1rem;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
}
.ac-cool .po-num { color: var(--cool); }
.ac-gold .po-num { color: var(--gold); }

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
