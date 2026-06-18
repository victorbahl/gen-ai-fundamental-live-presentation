<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  A2A — agent-to-agent, made TECHNICAL (rebuilt 2026-06-18, user direction).
  The old version was decorative emoji boxes with no mechanism. This mirrors
  the MCP pair on purpose: just as MCP is "discover the menu, then call a
  tool", A2A is "discover the agent, then delegate a task" — same shape, one
  level up. For an integration audience, A2A is service-to-service for agents.

  Two columns, like the MCP envelope/handshake:
    LEFT  — an ORCHESTRATOR agent that owns the goal and delegates.
    RIGHT — a specialist (the "Orders agent"), exposed over A2A.
  Between them, the standard exchange:
    ① DISCOVER  GET /.well-known/agent.json → the Agent Card (who it is, what
                skills it offers, where to reach it) — the A2A analogue of
                tools/list.
    ② DELEGATE  POST message/send → a Task ("get status for #7788"). The
                specialist runs its OWN loop (its own tools) and …
    ③ RETURN    … replies with a Task in state "completed" + the result.

  Accuracy notes (A2A spec shape, kept light): discovery is the Agent Card at
  /.well-known/agent.json; work is a Task object with a lifecycle state
  (submitted → working → completed). Same Bearer-over-HTTP envelope as MCP, so
  the same gateway policies apply — the payoff that ties the whole part shut.

  PHYSICAL-PAGE RULE (4): both agent cards + all three exchange rows + the
  payoff band own fixed slots from the start; clicks toggle opacity / lit only.
  Rule 8: lands with the title + both agents + step ① already showing.
  Rule 7: orchestrator = warm (drives), specialist = cool (a service), result = good.

  Beats (clicks: 3):
    c=0  both agents + ① DISCOVER (Agent Card) shown
    c=1  ② DELEGATE — a Task is sent
    c=2  ③ RETURN — Task completed + result
    c=3  payoff band — same HTTP envelope → same gateway policies
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
const op = (from) => (c.value >= from ? 1 : 0)

const steps = [
  {
    n: '1', dir: 'req', verb: 'GET', path: '/.well-known/agent.json',
    label: 'DISCOVER', purpose: 'fetch the Agent Card',
    res: '{ name, skills:["order-status"], url, auth }',
  },
  {
    n: '2', dir: 'req', verb: 'POST', path: 'message/send',
    label: 'DELEGATE', purpose: 'hand off a Task',
    res: '{ task: "status for #7788", id: "t-91" }',
  },
  {
    n: '3', dir: 'res', verb: 'Task', path: 'state: completed',
    label: 'RETURN', purpose: 'the specialist ran its own loop',
    res: '{ state: "completed", result: "shipped · Jun 20" }',
  },
]
</script>

<template>
  <div class="a2a">
    <!-- the two agents -->
    <div class="agents">
      <div class="agent orch">
        <div class="a-ic">🧭</div>
        <div class="a-meta">
          <div class="a-t">Orchestrator agent</div>
          <div class="a-s">owns the goal · delegates</div>
        </div>
      </div>
      <div class="vs">A2A</div>
      <div class="agent spec">
        <div class="a-ic">📦</div>
        <div class="a-meta">
          <div class="a-t">Orders agent</div>
          <div class="a-s">a specialist · its own tools &amp; loop</div>
        </div>
      </div>
    </div>

    <!-- the standard exchange (mirrors the MCP handshake rows) -->
    <div class="rail">
      <div
        v-for="(s, i) in steps"
        :key="s.n"
        class="row"
        :class="{ on: c >= i, res: s.dir === 'res' }"
        :style="{ opacity: c >= i ? 1 : 0.32 }"
      >
        <div class="num">{{ s.n }}</div>
        <div class="call">
          <div class="call-top">
            <span class="dir-lab" :class="s.dir === 'res' ? 'good' : 'cool'">{{ s.label }}</span>
            <span class="verb" :class="{ ret: s.dir === 'res' }">{{ s.verb }}</span>
            <span class="path">{{ s.path }}</span>
            <span class="auth" v-if="s.dir === 'req'">🔒 Bearer •••</span>
          </div>
          <div class="purpose">{{ s.purpose }}</div>
        </div>
        <div class="arrow">{{ s.dir === 'res' ? '←' : '→' }}</div>
        <div class="payload" :style="{ opacity: c >= i ? 1 : 0 }">{{ s.res }}</div>
      </div>
    </div>

    <!-- payoff band — ties A2A back to the gateway story -->
    <div class="band" :style="{ opacity: op(3) }">
      <span class="b-lead">Discover the agent, then delegate — same shape as MCP, one level up.</span>
      It's the same Bearer-over-HTTP envelope, so the gateway policies we run wrap it unchanged.
    </div>
  </div>
</template>

<style scoped>
.a2a {
  display: flex; flex-direction: column; gap: 1rem;
  width: 100%; max-width: 940px; margin: 0 auto;
}

/* the two agents */
.agents { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; }
.agent {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.7rem 0.9rem; border-radius: 14px;
  background: var(--bg-panel); border: 1px solid var(--hair); box-shadow: var(--elev);
}
.agent.orch { border-left: 3px solid var(--warm); }
.agent.spec { border-left: 3px solid var(--cool); }
.a-ic { font-size: 1.5rem; line-height: 1; }
.a-t { font-family: var(--serif); font-weight: 700; font-size: 1rem; color: var(--ink); }
.a-s { font-size: 0.7rem; color: var(--ink-soft); margin-top: 0.1rem; }
.vs {
  font-family: var(--mono); font-weight: 700; font-size: 0.66rem; letter-spacing: 0.14em;
  color: var(--ink-faint);
}

/* exchange rows */
.rail { display: flex; flex-direction: column; gap: 0.55rem; }
.row {
  display: grid; grid-template-columns: 34px minmax(0, 1fr) 24px minmax(0, 1.05fr);
  align-items: center; gap: 0.7rem; height: 62px;
  padding: 0 0.85rem; border-radius: 12px;
  background: var(--bg-panel); border: 1px solid var(--hair); box-shadow: var(--elev);
  transition: opacity 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
}
.row.on { border-color: var(--warm); box-shadow: 0 0 18px rgba(252,192,3,0.16); }
.row.res.on { border-color: var(--good); box-shadow: 0 0 18px rgba(46,132,74,0.14); }

.num {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 700; font-size: 0.95rem;
  color: var(--warm-bright); background: rgba(252,192,3,0.14); border: 1px solid rgba(252,192,3,0.4);
}
.row.res .num { color: var(--good); background: rgba(46,132,74,0.10); border-color: rgba(46,132,74,0.3); }

.call { min-width: 0; }
.call-top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: nowrap; }
.dir-lab {
  font-family: var(--mono); font-weight: 700; font-size: 0.58rem; letter-spacing: 0.08em;
  padding: 0.1rem 0.4rem; border-radius: 5px;
}
.dir-lab.cool { color: var(--cool-bright); background: rgba(1,118,211,0.10); }
.dir-lab.good { color: var(--good); background: rgba(46,132,74,0.10); }
.verb { font-family: var(--mono); font-weight: 700; font-size: 0.74rem; color: var(--cool-bright); }
.verb.ret { color: var(--good); }
.path { font-family: var(--mono); font-size: 0.74rem; color: var(--ink); }
.auth {
  font-family: var(--mono); font-size: 0.56rem; color: var(--cool-bright);
  background: rgba(1,118,211,0.10); border: 1px solid rgba(1,118,211,0.28);
  border-radius: 999px; padding: 0.04rem 0.4rem; margin-left: auto;
}
.purpose { font-size: 0.68rem; color: var(--ink-soft); margin-top: 0.1rem; }

.arrow { text-align: center; font-size: 1.15rem; color: var(--ink-faint); }
.payload {
  min-width: 0; font-family: var(--mono); font-size: 0.68rem; color: var(--good);
  line-height: 1.3; word-break: break-word; transition: opacity 0.45s ease;
}

/* payoff band */
.band {
  text-align: center; font-size: 0.92rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.7rem 1.2rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.5s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band strong { color: var(--ink); font-weight: 700; }
</style>
