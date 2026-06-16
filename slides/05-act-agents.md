<!-- ============================================================
     PART IV — Machines that act (agents + A2A)
     ============================================================ -->

---
layout: default
---

<Hero bg="part-4.jpg" kicker="Part IV · Machines that act">
  When the model<br><span class="grad-warm">drives.</span>
</Hero>

<!--
So far the model answers one turn at a time, and we orchestrate. The agentic shift is simple but
profound: we let the MODEL decide the next step, in a loop, until a goal is met.
-->

---
layout: default
clicks: 5
---

<!-- AGENT LOOP -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The agent loop</div>
    <h2>Think → Act → Observe → <span class="grad-warm">repeat</span></h2>
  </div>
  <AgentLoop />
</div>

<!--
An agent is mostly one idea: a loop.
[click] Think — given the goal and what it knows, decide the next step.
[click] Act — call a tool. That's MCP, exactly what we just saw.
[click] Observe — read the result back into context.
[click] Then loop: think again with the new information, act again. The model itself decides whether
it's done.
[click] When the goal is met, it exits and answers. No human stepping through each turn — the model
drives the orchestration.
-->

---
layout: default
---

<!-- ANATOMY OF AN AGENT — build-up, fixed stage -->

<div class="stage anat-stage">
  <div class="title-row" v-click>
    <div class="kicker">Nothing new — just assembled</div>
    <h2>Anatomy of an <span class="grad-warm">agent</span></h2>
  </div>

  <div class="parts">
    <div class="part" v-click="2">
      <div class="p-ic">🧠</div><div class="p-t">Reason</div><div class="p-d">the LLM</div>
    </div>
    <div class="pplus" v-click="3">+</div>
    <div class="part" v-click="3">
      <div class="p-ic">🔧</div><div class="p-t">Tools</div><div class="p-d">via MCP</div>
    </div>
    <div class="pplus" v-click="4">+</div>
    <div class="part" v-click="4">
      <div class="p-ic">📒</div><div class="p-t">Memory</div><div class="p-d">state you carry</div>
    </div>
    <div class="pplus" v-click="5">+</div>
    <div class="part" v-click="5">
      <div class="p-ic">🎯</div><div class="p-t">Goal</div><div class="p-d">+ the loop</div>
    </div>
  </div>

  <div class="stage-foot" v-click="6">
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
---

<!-- A2A — build-up, fixed stage -->

<div class="stage a2a-stage">
  <div class="title-row" v-click>
    <div class="kicker">When one agent isn't enough</div>
    <h2>Agents calling <span class="grad-warm">agents</span> — A2A</h2>
  </div>

  <div class="a2a">
    <div class="agent orchestrator" v-click="2">
      <div class="a-ic">🧭</div><div class="a-t">Orchestrator</div>
    </div>
    <div class="a2a-lines" v-click="3">
      <div class="ln" /><div class="ln" /><div class="ln" />
    </div>
    <div class="a2a-row">
      <div class="agent" v-click="3"><div class="a-ic">📦</div><div class="a-t">Orders agent</div></div>
      <div class="agent" v-click="3"><div class="a-ic">💳</div><div class="a-t">Billing agent</div></div>
      <div class="agent" v-click="3"><div class="a-ic">🚚</div><div class="a-t">Logistics agent</div></div>
    </div>
  </div>

  <div class="stage-foot" v-click="4">
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
