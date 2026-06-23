<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  PROPOSITION C — "The filmstrip of envelopes".
  Three request envelopes stand side by side — call 1, call 2, call 3.
  Each click reveals the NEXT envelope, and the redundancy is undeniable:
  every envelope re-contains ALL prior turns (tinted = "replayed, sent
  before") plus exactly ONE new line (highlighted) — the current question.
  The current answer is NOT in the body: it hasn't been produced when the
  call is sent. The repeated tinted block visibly grows left→right and a
  token bar under each envelope climbs.

  Unlike the take-1 stack (role + text cards), here each envelope shows the
  ACTUAL request JSON — a real Messages API payload: top-level `model` +
  `system`, then a `messages` array of {role, content}. Same truth, a more
  "real" view: you can see the prior turns literally re-listed in the array.

  PHYSICAL-PAGE RULE: all three envelopes + every line own fixed slots and
  are always rendered. Clicks only toggle opacity / "sent" state. Fixed-size
  canvas; nothing inserts or reflows.
*/

const { $clicks } = useSlideContext()

const model = 'claude-opus-4-8'
const system = 'You are a helpful order assistant.'
const script = [
  { u: 'Where is my order #4471?',        a: 'It shipped yesterday — arriving Thursday.' },
  { u: 'Can I still change the address?', a: 'Yes — until the depot tonight.' },
  { u: 'And last week’s order?',          a: 'Order #4392 was delivered Monday.' },
]

// arrival (c0): only call 1 sent. c1: call 2. c2: call 3. c3: takeaway.
const sentUpTo = computed(() => Math.min($clicks.value, script.length - 1)) // index of last sent call

// Build the three envelopes. Envelope k (0-based) carries system + the prior
// turns 0..k-1 as REPLAYED history (user + their answers, sent before) plus
// exactly ONE new line: the current question (turn k). The current ANSWER is
// NOT in the body — it hasn't been produced when this call is sent.
const envelopes = computed(() =>
  script.map((_, k) => {
    const messages = []
    for (let i = 0; i < k; i++) {
      messages.push({ role: 'user', text: script[i].u, kind: 'replay' })
      messages.push({ role: 'assistant', text: script[i].a, kind: 'replay' })
    }
    messages.push({ role: 'user', text: script[k].u, kind: 'new' })
    const tok = Math.round(
      (system.length + messages.reduce((n, m) => n + m.text.length, 0)) / 4
    ) + (messages.length + 1) * 3
    return { call: k + 1, messages, tok }
  })
)
const maxTok = computed(() => envelopes.value[envelopes.value.length - 1].tok)
</script>

<template>
  <div class="srC">
    <div class="strip">
      <div
        v-for="(env, k) in envelopes" :key="k"
        class="env" :class="{ sent: sentUpTo >= k }"
      >
        <div class="env-head">
          <span class="lbl">POST /v1/messages · call {{ env.call }}</span>
          <span class="state">{{ sentUpTo >= k ? 'sent' : '—' }}</span>
        </div>

        <!-- the actual request JSON the API receives this call -->
        <div class="env-body">
          <div class="json">
            <div class="jl">{</div>
            <div class="jl ind1"><span class="k">"model"</span>: <span class="s">"{{ model }}"</span>,</div>
            <div class="jl ind1"><span class="k">"system"</span>: <span class="s">"{{ system }}"</span>,</div>
            <div class="jl ind1"><span class="k">"messages"</span>: [</div>
            <div
              v-for="(m, i) in env.messages" :key="i"
              class="jl ind2 msg" :class="m.kind"
            >{<span class="k">"role"</span>: <span class="s" :class="m.role">"{{ m.role }}"</span>, <span class="k">"content"</span>: <span class="s">"{{ m.text }}"</span>}<span v-if="i < env.messages.length - 1">,</span></div>
            <div class="jl ind1">]</div>
            <div class="jl">}</div>
          </div>
        </div>

        <div class="env-foot">
          <div class="bar"><span :style="{ width: (env.tok / maxTok * 100) + '%' }" /></div>
          <span class="tok">{{ env.tok }} tok</span>
        </div>
      </div>
    </div>

    <div class="legend">
      <span class="key"><i class="sw replay" /> replayed — sent before</span>
      <span class="key"><i class="sw new" /> new this call</span>
    </div>
  </div>
</template>

<style scoped>
.srC {
  position: relative; width: 100%; font-family: var(--sans);
  display: flex; flex-direction: column; gap: 1rem; align-items: center;
}
.strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; width: 100%; align-items: start; }

.env {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  overflow: hidden; opacity: 0.32; filter: saturate(0.6);
  transition: opacity 0.45s ease, filter 0.45s ease, box-shadow 0.45s ease;
}
.env.sent { opacity: 1; filter: none; box-shadow: var(--elev); }

.env-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 0.8rem; border-bottom: 1px solid var(--hair);
  background: var(--bg-soft);
}
.lbl { font-family: var(--mono); font-size: 0.6rem; font-weight: 700; color: var(--ink-soft); letter-spacing: 0.02em; }
.state {
  font-family: var(--mono); font-size: 0.56rem; font-weight: 700; text-transform: uppercase;
  color: var(--ink-faint); letter-spacing: 0.06em;
}
.env.sent .state { color: var(--good); }

/* ---- the JSON body ---- */
.env-body { padding: 0.55rem 0.6rem; height: 308px; overflow: hidden; }
.json {
  font-family: var(--mono); font-size: 0.56rem; line-height: 1.45;
  color: var(--ink-faint);
}
.k { color: var(--ink-soft); }          /* JSON keys */
.s { color: var(--ink-faint); }         /* string values (frame = dim) */

/* one rendered line of the payload */
.jl { border-radius: 5px; word-break: break-word; }
.ind1 { padding-left: 0.85rem; }
.ind2 { padding-left: 1.7rem; }
/* a message object inside the array */
.msg { padding-top: 0.08rem; padding-bottom: 0.08rem; transition: background 0.45s ease; }
.msg.replay { color: var(--ink-faint); }
.msg.replay .k, .msg.replay .s { color: var(--ink-faint); }
.msg.new {
  background: rgba(var(--warm-rgb),0.12);
  box-shadow: inset 0 0 0 1px rgba(var(--warm-rgb),0.45);
}
.msg.new .s { color: var(--ink); font-weight: 500; }
.msg.new .k { color: var(--warm-bright); }
.msg.new .s.user { color: var(--cool-bright); }
.msg.new .s.assistant { color: var(--warm-bright); }

.env-foot { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.8rem; border-top: 1px solid var(--hair); }
.bar { flex: 1; height: 6px; border-radius: 3px; background: var(--bg-soft); overflow: hidden; }
.bar span { display: block; height: 100%; border-radius: 3px; background: var(--warm); transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }
.tok { font-family: var(--mono); font-size: 0.6rem; color: var(--warm-bright); }

.legend {
  display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.72rem; color: var(--ink-soft); min-height: 1.3rem;
}
.key { display: inline-flex; align-items: center; gap: 0.4rem; }
.sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.sw.replay { background: var(--bg-soft); border: 1px solid var(--hair); }
.sw.new { background: rgba(var(--warm-rgb),0.25); border: 1px solid rgba(var(--warm-rgb),0.55); }
</style>
