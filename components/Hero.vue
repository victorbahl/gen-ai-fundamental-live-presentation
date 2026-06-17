<script setup>
/*
  Hero — Archetype A (big question/title over a background photo).
  RULES:
   - Background is a PLACEHOLDER: a gradient shows until the user drops a
     real photo at public/img/<bg>. The CSS layers url() ON TOP of a
     gradient, so a missing file simply falls through to the gradient.
   - NO block/scrim/panel behind the text — text sits directly on the
     image and stays legible via text-shadow only.
  Usage:
    <Hero bg="cover.jpg" kicker="GenAI · from first principles">
      Can a machine actually <span class="grad-warm">think?</span>
    </Hero>
*/
const props = defineProps({
  bg: { type: String, required: true },      // filename under public/img/
  kicker: { type: String, default: '' },
  align: { type: String, default: 'left' },  // 'left' | 'center'
  size: { type: String, default: 'lg' },     // 'lg' | 'sm'
})

// Prepend Vite's BASE_URL (trailing-slash) so images resolve under a
// deploy sub-path (e.g. GitHub Pages /repo/). Dev base is "/", so this
// is a no-op locally.
const bgUrl = `${import.meta.env.BASE_URL}img/${props.bg}`
</script>

<template>
  <div
    class="hero"
    :class="[`al-${align}`]"
    :style="{ '--bg-url': `url('${bgUrl}')` }"
  >
    <div class="hero-inner">
      <div v-if="kicker" class="kicker">{{ kicker }}</div>
      <h1 class="display" :class="{ sm: size === 'sm' }"><slot /></h1>
      <div v-if="$slots.subtitle" class="subtitle"><slot name="subtitle" /></div>
    </div>
  </div>
</template>

<style scoped>
.hero {
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
.al-center { align-items: center; text-align: center; }

.hero-inner { max-width: 90%; }

/* text sits DIRECTLY on the image — legibility via shadow only, no block */
.hero .kicker { margin-bottom: 1rem; text-shadow: 0 2px 14px rgba(0,0,0,0.6); }
.hero .display {
  color: #fff;
  text-shadow: 0 2px 28px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5);
  max-width: 18ch;
}
.al-center .display { max-width: 22ch; margin-inline: auto; }
.hero .subtitle {
  margin-top: 1.4rem;
  font-size: 1.05rem;
  color: #e7ebf2;
  font-weight: 400;
  max-width: 46ch;
  text-shadow: 0 1px 10px rgba(0,0,0,0.7);
}
.al-center .subtitle { margin-inline: auto; }
</style>
