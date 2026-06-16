<script setup>
import { computed, ref, watch } from 'vue'
import { useSlideContext, onSlideEnter } from '@slidev/client'

/*
  StatelessReplay — hero demo for "an LLM is stateless".
  Left  : the conversation a human sees, growing one exchange per click.
  Right : the payload the API ACTUALLY receives on the CURRENT call —
          the entire transcript, re-sent from scratch every time.

  PHYSICAL-PAGE RULE: every bubble and every payload row owns a FIXED slot
  and is always rendered. Clicks only toggle opacity — nothing is inserted,
  nothing reflows, nothing moves. The panels never change size.
*/

const { $clicks } = useSlideContext()

// running example: "order status across systems"
const script = [
  { u: 'Where is my order #4471?',
    a: 'It shipped yesterday — arriving Thursday.' },
  { u: 'Can I still change the delivery address?',
    a: 'Yes, until it reaches the depot tonight.' },
  { u: 'And the order I placed last week?',
    a: 'Order #4392 was delivered Monday at 14:20.' },
]

// clicks 0..2  ->  turn 1..3 (demo starts showing turn 1)
const turn = computed(() => Math.min($clicks.value + 1, script.length))

// ----- LEFT: chat bubbles, fixed slots -----
// 2 bubbles per exchange; exchange i is visible once turn >= i+1
const bubbles = computed(() =>
  script.flatMap((x, i) => ([
    { role: 'user', text: x.u, showAt: i + 1 },
    { role: 'asst', text: x.a, showAt: i + 1 },
  ]))
)

// ----- RIGHT: payload rows, fixed slots -----
// On call N the payload = system + completed prior exchanges + current user msg.
//   system        : turn >= 1
//   user i        : turn >= i
//   assistant i   : turn >= i+1   (only once that exchange is complete/in history)
const rows = computed(() => {
  const r = [{ role: 'system', text: 'You are a helpful order assistant.', showAt: 1 }]
  script.forEach((x, i) => {
    r.push({ role: 'user', text: x.u, showAt: i + 1 })
    r.push({ role: 'assistant', text: x.a, showAt: i + 2 })
  })
  return r
})

const visibleRows = computed(() => rows.value.filter(r => turn.value >= r.showAt))
const tokens = computed(() =>
  Math.round(visibleRows.value.reduce((n, m) => n + m.text.length, 0) / 4)
  + visibleRows.value.length * 3
)

// flash the payload panel on every new call
const flash = ref(false)
const triggerFlash = () => { flash.value = false; requestAnimationFrame(() => { flash.value = true }) }
watch(turn, triggerFlash)
onSlideEnter(triggerFlash)

const roleColor = (r) =>
  r === 'user' ? 'var(--cool-bright)' : r === 'assistant' ? 'var(--warm-bright)' : 'var(--ink-faint)'
</script>

<template>
  <div class="sr">
    <!-- LEFT: the conversation as the human sees it -->
    <div class="sr-col">
      <div class="sr-head"><span class="dot" /> The conversation</div>
      <div class="chat">
        <div
          v-for="(b, i) in bubbles" :key="i"
          class="bubble" :class="b.role"
          :style="{ opacity: turn >= b.showAt ? 1 : 0 }"
        >{{ b.text }}</div>
      </div>
      <div class="sr-foot"><span>Turn {{ turn }} of {{ script.length }}</span></div>
    </div>

    <!-- arrow -->
    <div class="sr-arrow">
      <div class="arrow-line" />
      <div class="arrow-label">every call →</div>
    </div>

    <!-- RIGHT: what the model actually receives THIS call -->
    <div class="sr-col">
      <div class="sr-head warm"><span class="dot warm" /> What the model receives — this call</div>
      <div class="payload" :class="{ flash }">
        <div
          v-for="(m, i) in rows" :key="i"
          class="msg" :style="{ opacity: turn >= m.showAt ? 1 : 0 }"
        >
          <span class="role" :style="{ color: roleColor(m.role) }">{{ m.role }}</span>
          <span class="text">{{ m.text }}</span>
        </div>
      </div>
      <div class="sr-foot">
        <span class="resend">⟳ full transcript re-sent</span>
        <span class="tok">{{ tokens }} tokens</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr {
  display: grid;
  grid-template-columns: 1fr auto 1.15fr;
  gap: 1.2rem;
  align-items: start;
  width: 100%;
  font-family: var(--sans);
}
.sr-col { display: flex; flex-direction: column; min-width: 0; }

.sr-head {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
  color: var(--cool-bright); margin-bottom: 0.6rem; height: 1.2rem;
}
.sr-head.warm { color: var(--warm-bright); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cool); }
.dot.warm { background: var(--warm); }

/* fixed-height panels so nothing ever resizes as turns reveal */
.chat, .payload {
  height: 270px;
  border-radius: 14px;
  padding: 0.9rem;
  overflow: hidden;
}
.chat {
  background: var(--bg-panel); border: 1px solid var(--hair);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.bubble {
  max-width: 85%;
  padding: 0.45rem 0.7rem;
  border-radius: 12px;
  font-size: 0.8rem;
  line-height: 1.3;
  transition: opacity 0.35s ease;
}
.bubble.user { align-self: flex-end; background: var(--bubble-user-bg); color: var(--bubble-user-ink); border-bottom-right-radius: 4px; }
.bubble.asst { align-self: flex-start; background: var(--bubble-asst-bg); color: var(--bubble-asst-ink); border-bottom-left-radius: 4px; }

.sr-foot {
  display: flex; justify-content: space-between; gap: 0.6rem;
  margin-top: 0.5rem; font-size: 0.72rem; color: var(--ink-faint); height: 1.1rem;
}
.resend { color: var(--warm-bright); font-weight: 600; }
.tok {
  font-family: var(--mono); color: var(--ink-soft);
  background: var(--bg-soft); padding: 1px 7px; border-radius: 6px;
}

.sr-arrow {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.4rem; height: 270px; margin-top: 1.8rem;
}
.arrow-line { width: 46px; height: 2px; background: var(--hair); position: relative; }
.arrow-line::after {
  content: ''; position: absolute; right: -1px; top: -4px;
  border-left: 8px solid var(--ink-faint); border-top: 5px solid transparent; border-bottom: 5px solid transparent;
}
.arrow-label { font-size: 0.62rem; color: var(--ink-faint); letter-spacing: 0.06em; }

.payload {
  background: var(--bg-soft); border: 1px solid var(--hair);
  display: flex; flex-direction: column; gap: 0.4rem;
}
.payload.flash { animation: flash 0.7s ease; }
@keyframes flash {
  0%   { border-color: var(--warm); box-shadow: 0 0 0 0 rgba(232,121,74,0); }
  35%  { border-color: var(--warm-bright); box-shadow: 0 0 28px 2px rgba(232,121,74,0.30); }
  100% { border-color: var(--hair); box-shadow: none; }
}
.msg {
  display: flex; gap: 0.6rem; align-items: baseline;
  font-size: 0.74rem; line-height: 1.25;
  padding-bottom: 0.3rem; border-bottom: 1px dashed var(--hair);
  transition: opacity 0.35s ease;
}
.msg:last-child { border-bottom: none; }
.role {
  font-family: var(--mono); font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; min-width: 62px; letter-spacing: 0.03em;
}
.text { color: var(--ink-soft); }
</style>
