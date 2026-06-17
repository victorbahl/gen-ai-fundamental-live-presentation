<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  McpHandshake — the three standard MCP calls, in order.
  Every MCP session is the same JSON-RPC-over-HTTP handshake:
    ① initialize  — agree protocol version + capabilities
    ② tools/list  — discover the menu of tools (the key one for this talk)
    ③ tools/call  — actually run one and read the result
  Each step is one POST /mcp with the SAME Bearer auth — reinforcing the
  envelope slide before it.

  PHYSICAL-PAGE RULE (Rule 4): all three rows live in fixed slots from the
  start (equal height, no reflow). On arrival the first row is "active" and
  the rest are dimmed; clicks advance which row is lit and reveal its
  response. Nothing inserts or moves.

  Beats (Rule 8 — first beat on arrival):
    c=0  step ① active, its request+response shown; ②③ dimmed
    c=1  step ② active + response (the tool menu)
    c=2  step ③ active + response (the order status)
    c=3  footer payoff
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

const steps = [
  {
    n: '1',
    method: 'initialize',
    purpose: 'agree version + capabilities',
    res: 'protocolVersion · serverInfo · capabilities',
  },
  {
    n: '2',
    method: 'tools/list',
    purpose: 'discover the menu',
    res: 'get_order_status · create_ticket · search_kb …',
  },
  {
    n: '3',
    method: 'tools/call',
    purpose: 'run one, read the result',
    res: '{ "status": "shipped", "eta": "2026-06-18" }',
  },
]
const isOn = (i) => c.value >= i
</script>

<template>
  <div class="hs">
    <div class="rail">
      <div
        v-for="(s, i) in steps"
        :key="s.method"
        class="row"
        :class="{ on: isOn(i), past: c > i }"
      >
        <div class="num">{{ s.n }}</div>

        <div class="req">
          <div class="verb-line">
            <span class="verb">POST</span> /mcp
            <span class="auth-tag">🔒 Bearer •••</span>
          </div>
          <div class="method">"method": <span class="m-val">"{{ s.method }}"</span></div>
          <div class="purpose">{{ s.purpose }}</div>
        </div>

        <div class="arrow">→</div>

        <div class="res" :style="{ opacity: isOn(i) ? 1 : 0 }">
          <div class="res-tag">result</div>
          <div class="res-val">{{ s.res }}</div>
        </div>
      </div>
    </div>

    <div class="foot" :style="{ opacity: c >= 3 ? 1 : 0 }">
      One session, three standard calls — <strong>discover</strong> then <strong>call</strong>.
      Same shape for every server, so any model talks to any tool.
    </div>
  </div>
</template>

<style scoped>
.hs {
  display: flex; flex-direction: column; gap: 1.3rem;
  width: 100%; max-width: 920px; margin: 0 auto;
}
.rail { display: flex; flex-direction: column; gap: 0.8rem; }

.row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 28px minmax(0, 1.05fr);
  align-items: center; gap: 0.8rem;
  height: 96px;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); padding: 0 1rem;
  opacity: 0.4; transition: opacity 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
}
.row.on { opacity: 1; border-color: var(--warm); box-shadow: 0 0 22px rgba(252,192,3,0.22); }
.row.past { opacity: 0.78; border-color: var(--hair); box-shadow: var(--elev); }

.num {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 700; font-size: 1.1rem;
  color: var(--warm-bright); background: rgba(252,192,3,0.14);
  border: 1px solid rgba(252,192,3,0.4);
}

.req { min-width: 0; }
.verb-line {
  font-family: var(--mono); font-size: 0.68rem; color: var(--ink-faint);
  display: flex; align-items: center; gap: 0.5rem;
}
.verb { color: var(--cool-bright); font-weight: 700; }
.auth-tag {
  font-size: 0.6rem; color: var(--cool-bright);
  background: rgba(1,118,211,0.10); border: 1px solid rgba(1,118,211,0.28);
  border-radius: 999px; padding: 0.05rem 0.45rem;
}
.method {
  font-family: var(--mono); font-size: 0.92rem; color: var(--ink); margin-top: 0.2rem;
}
.m-val { color: var(--warm-bright); font-weight: 700; }
.purpose { font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.15rem; }

.arrow { font-size: 1.3rem; color: var(--ink-faint); text-align: center; }

.res {
  min-width: 0; border-radius: 10px; padding: 0.5rem 0.7rem;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.res-tag {
  font-family: var(--mono); font-size: 0.56rem; font-style: italic;
  color: var(--ink-faint); margin-bottom: 0.15rem;
}
.res-val {
  font-family: var(--mono); font-size: 0.72rem; color: var(--good);
  line-height: 1.35; word-break: break-word;
}

.foot {
  text-align: center; color: var(--ink-soft); font-size: 0.92rem;
  max-width: 64ch; margin: 0 auto; transition: opacity 0.45s ease;
}
</style>
