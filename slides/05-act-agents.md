---
layout: default
clicks: 3
---

<!-- ============================================================
     PART 3 (continued) — skills · the loop · context · A2A
     ============================================================
     Same part as 04-act-tools.md. ORDER (reworked 2026-06-18, user):
       Tools vs Skills (after tools+MCP) → the loop RUNNING (live trace)
       → agent context window → A2A (protocol-technical, Agent Cards).
     The old "Anatomy of an agent" recap slide was REMOVED — its job is
     done up front by AgentRuntime.vue ("what is an agent"). The dead
     "When the model drives." pivot hero stays CUT.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide.

     TOOLS vs SKILLS — names the skill concept, AFTER tools+MCP (user's
     ordering). Title on arrival; clicks reveal skill, link, bridge. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Two words people mix up</div>
    <h2>A tool is one <span class="grad-warm">action</span> — a skill is a <span class="grad-warm">playbook</span></h2>
  </div>
  <ToolsVsSkills />
</div>

<!--
Quick but important distinction, now that we know what a tool is. On the left, the tool — a single
callable action. get_order_status(id) returns JSON. It's a verb the model invokes; it's what the
agent CAN do.
[click] On the right, a skill. A skill isn't one call — it's a packaged PLAYBOOK for a whole job:
instructions plus the resources to do it well. "Handle a refund" ships as a SKILL.md of steps, the
policy that governs it, maybe a script — and the agent loads it ON DEMAND, only when the task
matches, so we don't bloat every prompt with everything.
[click] And a skill USES tools — it orchestrates several tool calls plus the know-how to sequence
them toward an outcome.
[click] So: tools are what an agent can do; skills are HOW to do something well. But notice — both
are just context we hand the model. It still only decides; we still execute. Same trust boundary.
-->

---
layout: default
clicks: 5
---

<!-- THE LOOP, RUNNING — live worked trace (rebuilt; replaces the static ring).
     Title on arrival; clicks accumulate the transcript turn by turn. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The agent loop</div>
    <h2>Think → Act → Observe, until the <span class="grad-warm">goal is met</span></h2>
  </div>
  <AgentLoop />
</div>

<!--
Now the loop — not as a diagram, but actually running. We've given the model a goal: "when will
order #7788 arrive?" Watch it work. Step one, it THINKS: I need the status first.
[click] It ACTS — calls get_order_status — and OBSERVES the result: shipped, but the ETA is null…
and there's a tracking number. Hold that thought.
[click] Step two, it THINKS again — and here's the whole point. WE did not script this. The model
chose its next move FROM what it just observed: no ETA, but a tracking number, so go follow it.
That self-directed next step is what makes it an agent.
[click] It ACTS on its own decision — get_tracking — and OBSERVES the ETA: June 20th.
[click] Step three: it has the ETA, the goal is met, so it STOPS and answers. The model decided when
it was done — no human stepping through the turns.
[click] That's the agentic loop: we orchestrated nothing between steps. Think, act, observe, repeat —
the model drives, and it knows when to quit. Now — what does running this loop do to the window?
-->

---
layout: default
clicks: 4
---

<!-- AGENT CONTEXT WINDOW — the loop fills the same fixed space, fast, with tool OUTPUT. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What the loop does to the window</div>
    <h2>Every loop pours back into the <span class="grad-warm">same window</span></h2>
  </div>
  <AgentContextWindow />
</div>

<!--
Callback to the context window from Part 2 — but now through the agent loop we just watched. Same
fixed space; watch how fast it fills.

SET-UP (before any click): the grid already shows BLUE — the system prompt PLUS the schema of every
tool the agent may call. "An agent carries its whole toolbox description on every single call, before
it does anything."

[click] The goal goes in — green, set once: the order question we just ran.
[click] First loop: it thinks, calls get_order_status, and the API's JSON response is folded straight back
into the window — the amber "tool data". Point out the scale jumped: each cell here is ~2k tokens.
[click] Another loop, another Observe, another blob of data. Make the key point: it's tool OUTPUT,
not your prose, that fills an agent's window — and it grows every single step. We're nearly full
after just a few loops.
[click] So the agent OFFLOADS. It writes a compact note to external memory (the striped blue cells —
kept OUTSIDE the window), drops the raw JSON blobs, and pulls the note back only when it needs it.
Room reopens; the loop continues without losing the thread.

Land it: this is the MEMORY piece from the runtime slide, made concrete. The model keeps no state
and the window fills in a few loops — so the agent has to decide what to summarise, what to offload,
and what to drop. That deciding IS memory.
-->

---
layout: default
clicks: 3
---

<!-- A2A — protocol-technical: Agent Card discovery + task delegation.
     Mirrors the MCP pair. Title on arrival; clicks walk discover → delegate → return. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">When one agent isn't enough</div>
    <h2>Agents calling <span class="grad-warm">agents</span> — A2A</h2>
  </div>
  <A2A />
</div>

<!--
Last piece. One agent is powerful; a team is more — an orchestrator that owns the goal, delegating to
specialists. A2A — agent-to-agent — is just the protocol for that, and notice it's the SAME shape as
MCP, one level up. On arrival: step one, DISCOVER. The orchestrator does a GET on the specialist's
/.well-known/agent.json and gets back its Agent Card — who it is, what skills it offers, where to
reach it. That's the A2A version of tools/list.
[click] Step two, DELEGATE: it POSTs a Task — "get status for order #7788". The specialist agent
then runs its OWN loop, with its own tools — exactly the loop we just watched.
[click] Step three, RETURN: the specialist replies with a Task in state "completed" and the result,
folded back to the orchestrator.
[click] Discover the agent, then delegate the task — same Bearer-over-HTTP envelope as MCP, so the
same gateway policies apply. If you run an integration platform, this is your world: discovery,
contracts, routing, governance — applied to a new kind of consumer.
-->
