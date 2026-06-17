<script setup>
import { computed, ref, watch } from 'vue'
import { useSlideContext, onSlideEnter } from '@slidev/client'

/*
  PROPOSITION A — "re-stack → forward pass → answer returns".
  RIGHT side is two stacked parts, top to bottom:
    1. POST body  : the request the API actually receives THIS call —
                    system + completed prior turns + the CURRENT user line.
                    The current ANSWER is NOT here (it hasn't been produced).
    2. LLM        : a stateless function. The request flows DOWN into it,
                    it generates, and emits the answer.
  Then the answer travels back to the LEFT conversation (where the human
  finally sees it). So the order is: ask → resend everything → model runs →
  answer appears on the left. The answer is never pre-shown anywhere.

  Each call: the new user line lands in the POST body, a resend sweep runs
  over the WHOLE stack (all of it ships again), a forward pass drops into the
  LLM, it generates, and the answer pops on the left. The previous answer
  re-enters the POST body as HISTORY on the next call (assistant i at turn i+2).

  PHYSICAL-PAGE RULE: every bubble and every row owns a fixed slot and is
  always rendered. Clicks toggle opacity + replay one-shot animations keyed
  off a per-call `beat`. Nothing inserts, nothing reflows, panels never resize.
*/

const { $clicks } = useSlideContext()

const system = 'You are a helpful order assistant.'
const script = [
  { u: 'Where is my order #4471?',        a: 'It shipped yesterday — arriving Thursday.' },
  { u: 'Can I still change the address?', a: 'Yes — until it reaches the depot tonight.' },
  { u: 'And the order from last week?',   a: 'Order #4392 was delivered Monday, 14:20.' },
]

// arrival (c0) = turn 1 ; c1 = turn 2 ; c2 = turn 3 ; c3 = takeaway
const turn = computed(() => Math.min($clicks.value + 1, script.length))
const summary = computed(() => $clicks.value >= script.length)
const answer = computed(() => script[turn.value - 1].a)

// LEFT — the human conversation. The answer bubble reveals on the same turn
// as its question, but a CSS transition-delay makes it land only AFTER the
// model has "generated" it (it's never on screen in advance).
const bubbles = computed(() =>
  script.flatMap((x, i) => ([
    { role: 'user', text: x.u, at: i + 1, answer: false },
    { role: 'asst', text: x.a, at: i + 1, answer: true },
  ]))
)

// RIGHT — the POST body. assistant i only appears at turn i+2 (i.e. as HISTORY
// on the NEXT call) — never on the call that produced it.
const rows = computed(() => {
  const r = [{ role: 'system', text: system, at: 1, turnIdx: -1 }]
  script.forEach((x, i) => {
    r.push({ role: 'user', text: x.u, at: i + 1, turnIdx: i })
    r.push({ role: 'assistant', text: x.a, at: i + 2, turnIdx: i })
  })
  return r
})
const visible = computed(() => rows.value.filter(m => turn.value >= m.at))
// the one genuinely-new line this call = the current user message
const isNew = (m) => m.role === 'user' && m.turnIdx === turn.value - 1
const tokens = computed(() =>
  Math.round(visible.value.reduce((n, m) => n + m.text.length, 0) / 4) + visible.value.length * 3
)

// per-call beat replays the one-shot send / forward-pass / generate animations
const beat = ref(0)
const fire = () => { beat.value += 1 }
watch(turn, fire)
onSlideEnter(fire)

const roleColor = (r) =>
  r === 'user' ? 'var(--cool-bright)' : r === 'assistant' ? 'var(--warm-bright)' : 'var(--ink-faint)'
</script>

<template>
  <div class="srA">
    <!-- LEFT: what the human sees -->
    <div class="human">
      <div class="head"><span class="dot" /> What the human sees</div>
      <div class="chat">
        <div class="recv" :key="'r' + beat" />
        <div
          v-for="(b, i) in bubbles" :key="i"
          class="bubble" :class="[b.role, { ans: b.answer }]"
          :style="{ opacity: turn >= b.at ? 1 : 0 }"
        >{{ b.text }}</div>
      </div>
      <div class="foot"><span>Turn {{ turn }} of {{ script.length }}</span></div>
    </div>

    <!-- CONNECTOR: send out (top) / answer back (bottom) -->
    <div class="wire">
      <div class="send" :key="'s' + beat">SEND ⟶</div>
      <div class="wire-line" />
      <div class="back" :key="'b' + beat">⟵ answer</div>
    </div>

    <!-- RIGHT: POST body (top) → LLM (bottom) -->
    <div class="api">
      <div class="head warm">
        <span class="dot warm" /> POST /v1/messages — request body
        <span class="call">call {{ turn }}</span>
      </div>

      <!-- 1 · the request body, re-stacked & re-sent every call -->
      <div class="stack">
        <div class="sweep" :key="'w' + beat" />
        <div
          v-for="(m, i) in rows" :key="i"
          class="card" :class="[m.role, isNew(m) ? 'fresh' : 'replay']"
          :style="{ opacity: turn >= m.at ? 1 : 0 }"
        >
          <span class="role" :style="{ color: roleColor(m.role) }">{{ m.role }}</span>
          <span class="text">{{ m.text }}</span>
        </div>
      </div>
      <div class="post-foot">
        <span class="resend">⟳ entire transcript re-sent</span>
        <span class="tok">{{ tokens }} tokens</span>
      </div>

      <!-- forward pass into the model -->
      <div class="flow" :key="'f' + beat">
        <span class="flow-dot" />
        <span class="flow-lbl">forward pass ↓</span>
      </div>

      <!-- 2 · the model: a stateless function that generates the answer -->
      <div class="llm" :key="'l' + beat">
        <div class="llm-head">LLM · stateless function</div>
        <div class="llm-stage">
          <div class="llm-think">generating…</div>
          <div class="llm-ans">{{ answer }}</div>
        </div>
      </div>
    </div>

    <div class="note" :style="{ opacity: summary ? 1 : 0 }">
      No session on the server — the <strong>client</strong> carries all state, every call.
    </div>
  </div>
</template>

<style scoped>
.srA {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 116px 1.22fr;
  gap: 1rem; align-items: start; width: 100%;
  font-family: var(--sans);
  padding-bottom: 2.2rem;
}
.head {
  display: flex; align-items: center; gap: 0.5rem; height: 1.3rem;
  font-size: 0.76rem; font-weight: 600; letter-spacing: 0.03em;
  color: var(--cool-bright); margin-bottom: 0.5rem;
}
.head.warm { color: var(--warm-bright); }
.call { margin-left: auto; font-family: var(--mono); font-size: 0.62rem; color: var(--ink-faint); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cool); }
.dot.warm { background: var(--warm); }

/* ---- LEFT: human chat ---- */
.human { position: relative; }
.chat {
  position: relative;
  height: 354px; border-radius: 14px; padding: 0.9rem;
  background: var(--bg-panel); border: 1px solid var(--hair);
  display: flex; flex-direction: column; gap: 0.5rem; overflow: hidden;
}
/* warm ring that flashes when the generated answer arrives back on the left */
.recv {
  position: absolute; inset: 0; border-radius: 14px; pointer-events: none; z-index: 4;
  border: 2px solid transparent;
  animation: recvFlash 0.9s ease 1.95s both;
}
@keyframes recvFlash {
  0%   { border-color: transparent; box-shadow: 0 0 0 0 rgba(252,192,3,0); }
  40%  { border-color: var(--warm); box-shadow: inset 0 0 26px rgba(252,192,3,0.28); }
  100% { border-color: transparent; box-shadow: 0 0 0 0 rgba(252,192,3,0); }
}
.bubble {
  position: relative; z-index: 2;
  max-width: 88%; padding: 0.45rem 0.7rem; border-radius: 12px;
  font-size: 0.8rem; line-height: 1.3; transition: opacity 0.4s ease;
}
.bubble.ans { transition-delay: 1.95s; }
.bubble.user { align-self: flex-end; background: var(--bubble-user-bg); color: var(--bubble-user-ink); border-bottom-right-radius: 4px; }
.bubble.asst { align-self: flex-start; background: var(--bubble-asst-bg); color: var(--bubble-asst-ink); border-bottom-left-radius: 4px; }
.foot {
  display: flex; justify-content: flex-start; margin-top: 0.5rem;
  font-size: 0.72rem; color: var(--ink-faint); height: 1.1rem;
}

/* ---- CONNECTOR ---- */
.wire {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.55rem; height: 354px; margin-top: 1.8rem;
}
.send {
  font-family: var(--mono); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.06em;
  color: var(--warm-bright); padding: 0.3rem 0.55rem; border-radius: 8px;
  border: 1px solid var(--warm); background: rgba(252,192,3,0.10);
  animation: pulse 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both;
}
@keyframes pulse {
  0%   { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(252,192,3,0); }
  40%  { transform: scale(1.08); box-shadow: 0 0 22px 2px rgba(252,192,3,0.45); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(252,192,3,0); }
}
.wire-line { width: 2px; height: 40px; background: linear-gradient(var(--warm), transparent); }
.back {
  font-family: var(--mono); font-size: 0.62rem; font-weight: 600; letter-spacing: 0.04em;
  color: var(--ink-faint);
  animation: backIn 0.6s cubic-bezier(0.22,1,0.36,1) 1.7s both;
}
@keyframes backIn {
  0%   { opacity: 0; transform: translateX(8px); }
  100% { opacity: 1; transform: translateX(0); color: var(--warm-bright); }
}

/* ---- RIGHT: POST body + LLM ---- */
.api { display: flex; flex-direction: column; min-width: 0; }
.stack {
  position: relative; height: 212px; border-radius: 14px 14px 0 0; padding: 0.6rem;
  background: var(--bg-soft); border: 1px solid var(--hair); border-bottom: none;
  display: flex; flex-direction: column; gap: 0.32rem; overflow: hidden;
}
.sweep { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.sweep::after {
  content: ''; position: absolute; left: 0; right: 0; height: 36%; top: -38%;
  background: linear-gradient(180deg, transparent, rgba(252,192,3,0.24), transparent);
  animation: sweepDown 0.75s cubic-bezier(0.22,1,0.36,1) 0.25s both;
}
@keyframes sweepDown { 0% { top: -38%; } 100% { top: 102%; } }

.card {
  display: flex; gap: 0.55rem; align-items: baseline;
  border: 1px solid var(--hair); border-radius: 8px;
  padding: 0.3rem 0.5rem; font-size: 0.7rem; line-height: 1.22;
  transition: opacity 0.4s ease;
}
.card.replay { background: var(--bg-panel); }
.card.replay .text { color: var(--ink-faint); }     /* dimmed = already sent before */
.card.system { border-style: dashed; }
.card.fresh {                                        /* the single new line this call */
  background: rgba(1,118,211,0.08); border-color: rgba(1,118,211,0.45);
}
.card.fresh .text { color: var(--ink); font-weight: 500; }
.role {
  font-family: var(--mono); font-size: 0.55rem; font-weight: 700;
  text-transform: uppercase; min-width: 56px; letter-spacing: 0.03em;
}
.text { color: var(--ink-soft); }

.post-foot {
  display: flex; justify-content: space-between; align-items: center; gap: 0.6rem;
  padding: 0.32rem 0.6rem; font-size: 0.66rem; height: 1.5rem;
  background: var(--bg-soft); border: 1px solid var(--hair); border-top: 1px dashed var(--hair);
  border-radius: 0 0 14px 14px;
}
.resend { color: var(--warm-bright); font-weight: 600; }
.tok {
  font-family: var(--mono); color: var(--ink-soft);
  background: var(--bg-panel); border: 1px solid var(--hair); padding: 1px 7px; border-radius: 6px;
}

.flow {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  height: 32px; position: relative;
}
.flow-lbl { font-family: var(--mono); font-size: 0.6rem; color: var(--ink-faint); letter-spacing: 0.04em; }
.flow-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--warm);
  animation: drop 0.5s cubic-bezier(0.5,0,0.5,1) 0.85s both;
}
@keyframes drop {
  0%   { opacity: 0; transform: translateY(-12px); }
  30%  { opacity: 1; }
  100% { opacity: 1; transform: translateY(10px); }
}

.llm {
  border-radius: 14px; padding: 0.55rem 0.7rem; height: 110px;
  background: var(--bg-panel); border: 1px solid var(--hair);
  display: flex; flex-direction: column; gap: 0.4rem;
  animation: llmGlow 1.4s ease 0.85s both;
}
@keyframes llmGlow {
  0%   { border-color: var(--hair); box-shadow: none; }
  45%  { border-color: var(--warm); box-shadow: 0 0 24px rgba(252,192,3,0.30); }
  100% { border-color: var(--hair); box-shadow: none; }
}
.llm-head {
  font-family: var(--mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--warm-bright);
}
.llm-stage { position: relative; flex: 1; display: flex; align-items: center; }
.llm-think {
  font-family: var(--mono); font-size: 0.74rem; color: var(--ink-faint);
  animation: thinkInOut 1.55s ease 0.7s both;
}
@keyframes thinkInOut {
  0%   { opacity: 0; }
  18%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
.llm-ans {
  position: absolute; inset: 0; display: flex; align-items: center;
  font-size: 0.82rem; line-height: 1.3; color: var(--warm-bright); font-weight: 600;
  animation: ansIn 0.5s cubic-bezier(0.22,1,0.36,1) 1.55s both;
}
@keyframes ansIn {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

.note {
  position: absolute; left: 0; right: 0; bottom: 0; text-align: center;
  font-size: 0.86rem; color: var(--ink-soft); transition: opacity 0.4s ease;
}
.note strong { color: var(--warm-bright); }
</style>
