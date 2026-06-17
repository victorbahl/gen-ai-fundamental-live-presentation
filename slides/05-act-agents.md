---
layout: default
clicks: 4
---

<!-- ============================================================
     PART 3 (continued) — agents + A2A
     ============================================================
     Same part as 04-act-tools.md (agent loop / context window / anatomy
     / A2A). The "When the model drives." pivot hero was REMOVED per user;
     the tools → agents handoff is folded into the agent-loop notes below.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide.

     AGENT LOOP — Think is active on arrival (no dead first click);
     clicks walk Act → Observe → loop → done. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The agent loop</div>
    <h2>Think → Act → Observe → <span class="grad-warm">repeat</span></h2>
  </div>
  <AgentLoop />
</div>

<!--
We've given the model hands — tools, MCP. So far, though, it answers one turn at a time and WE
orchestrate every step. The agentic shift is simple but profound: we hand it the wheel — let the
MODEL decide the next step, in a loop, until a goal is met.
An agent is mostly one idea: that loop. On screen already: the three nodes, with THINK active —
given the goal and what it knows, the model decides the next step.
[click] Act — call a tool. That's MCP, exactly what we just saw.
[click] Observe — read the result back into context.
[click] Then loop: think again with the new information, act again. The model itself decides whether
it's done.
[click] When the goal is met, it exits and answers. No human stepping through each turn — the model
drives the orchestration.
-->

---
layout: default
clicks: 4
---

<!-- AGENT CONTEXT WINDOW — the loop fills the same fixed budget, fast, with tool OUTPUT. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What the loop does to the window</div>
    <h2>Every loop pours back into the <span class="grad-warm">same window</span></h2>
  </div>
  <AgentContextWindow />
</div>

<!--
Callback to the context window from Part 2 — but now through the agent loop. Same fixed space; watch
how fast it fills.

SET-UP (before any click): the grid already shows BLUE — the system prompt PLUS the schema of every
tool the agent may call. "An agent carries its whole toolbox description on every single call, before
it does anything."

[click] The goal goes in — green, set once: "sort out order #4471".
[click] First loop: it thinks, calls get_order, and the API's JSON response is folded straight back
into the window — the amber "tool data". Point out the scale jumped: each cell here is ~2k tokens.
[click] Another loop, another Observe, another blob of data. Make the key point: it's tool OUTPUT,
not your prose, that fills an agent's window — and it grows every single step. We're nearly full
after just a few loops.
[click] So the agent OFFLOADS. It writes a compact note to external memory (the striped blue cells —
kept OUTSIDE the window), drops the raw JSON blobs, and pulls the note back only when it needs it.
Room reopens; the loop continues without losing the thread.

Land it: this is WHY an agent needs MEMORY. The model keeps no state and the window fills in a few
loops — so the agent has to decide what to summarise, what to offload, and what to drop. That deciding
IS the memory piece — which is exactly the next slide.
-->

---
layout: default
clicks: 5
---

<!-- ANATOMY OF AN AGENT — build-up, fixed stage.
     Title is on screen from arrival; clicks assemble the parts. -->

<div class="stage anat-stage">
  <div class="title-row">
    <div class="kicker">Nothing new — just assembled</div>
    <h2>Anatomy of an <span class="grad-warm">agent</span></h2>
  </div>

  <div class="parts">
    <div class="part" v-click="1">
      <div class="p-ic">🧠</div><div class="p-t">Reason</div><div class="p-d">the LLM</div>
    </div>
    <div class="pplus" v-click="2">+</div>
    <div class="part" v-click="2">
      <div class="p-ic">🔧</div><div class="p-t">Tools</div><div class="p-d">via MCP</div>
    </div>
    <div class="pplus" v-click="3">+</div>
    <div class="part" v-click="3">
      <div class="p-ic">📒</div><div class="p-t">Memory</div><div class="p-d">state you carry</div>
    </div>
    <div class="pplus" v-click="4">+</div>
    <div class="part" v-click="4">
      <div class="p-ic">🎯</div><div class="p-t">Goal</div><div class="p-d">+ the loop</div>
    </div>
  </div>

  <div class="stage-foot" v-click="5">
    Every piece is something we already built in this talk.
  </div>
</div>

<style>
.anat-stage { gap: 2rem; }
.parts { display: flex; align-items: center; justify-content: center; gap: 1rem; }
.part {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  padding: 1.1rem 1.3rem; width: 150px; text-align: center;
}
.p-ic { font-size: 1.5rem; }
.p-t { font-family: var(--serif); font-weight: 600; font-size: 1.1rem; margin-top: 0.2rem; }
.p-d { font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.15rem; }
.pplus { font-size: 1.5rem; color: var(--ink-faint); }
</style>

<!--
Let's de-mystify "agent". It's an assembly of parts you now know.
[click] Reason — the LLM.
[click] Tools — via MCP.
[click] Memory — the state you carry between calls, because the model won't.
[click] A goal, plus the loop from the last slide.
[click] That's it. Nothing here is new. An agent is these four things wired together.
-->

---
layout: default
clicks: 3
---

<!-- A2A — build-up, fixed stage.
     Title is on screen from arrival; clicks add orchestrator → workers → foot. -->

<div class="stage a2a-stage">
  <div class="title-row">
    <div class="kicker">When one agent isn't enough</div>
    <h2>Agents calling <span class="grad-warm">agents</span> — A2A</h2>
  </div>

  <div class="a2a">
    <div class="agent orchestrator" v-click="1">
      <div class="a-ic">🧭</div><div class="a-t">Orchestrator</div>
    </div>
    <div class="a2a-lines" v-click="2">
      <div class="ln" /><div class="ln" /><div class="ln" />
    </div>
    <div class="a2a-row">
      <div class="agent" v-click="2"><div class="a-ic">📦</div><div class="a-t">Orders agent</div></div>
      <div class="agent" v-click="2"><div class="a-ic">💳</div><div class="a-t">Billing agent</div></div>
      <div class="agent" v-click="2"><div class="a-ic">🚚</div><div class="a-t">Logistics agent</div></div>
    </div>
  </div>

  <div class="stage-foot" v-click="3">
    A2A is service-to-service — for agents. Specialised workers, one coordinator, a shared protocol.
  </div>
</div>

<style>
.a2a-stage { gap: 1.6rem; }
.a2a { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
.agent {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  padding: 0.8rem 1rem; width: 150px; text-align: center;
}
.agent.orchestrator { border-color: var(--warm); }
.a-ic { font-size: 1.4rem; }
.a-t { font-family: var(--serif); font-weight: 600; font-size: 0.95rem; margin-top: 0.15rem; }
.a2a-lines { display: flex; gap: 5.5rem; height: 26px; }
.a2a-lines .ln { width: 2px; background: var(--hair); }
.a2a-row { display: flex; gap: 1rem; }
</style>

<!--
Last piece. One agent is powerful; a team is more.
[click] An orchestrator agent owns the goal.
[click] It delegates to specialists — an orders agent, a billing agent, a logistics agent — each with
its own tools and scope.
[click] A2A — agent-to-agent — is just the protocol for that delegation. Service-to-service, for agents.
If you run an integration platform, this is your world: composition, routing, contracts — applied to a
new kind of consumer.
-->
