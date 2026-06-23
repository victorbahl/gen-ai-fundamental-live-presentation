---
layout: default
clicks: 3
---

<!-- ============================================================
     PART 3 (continued) — skills · the loop · context · key takeaways
     ============================================================
     Same part as 04-act-tools.md. ORDER (reworked 2026-06-22, user):
       Tools vs Skills (after tools+MCP) → the loop RUNNING (live trace)
       → agent context window → KEY TAKEAWAYS (5-point whole-deck recap).
     The old "Anatomy of an agent" recap slide was REMOVED — its job is
     done up front by AgentRuntime.vue ("what is an agent"). The dead
     "When the model drives." pivot hero stays CUT. A2A was REMOVED
     2026-06-22 (user: "too much") — do NOT resurrect it.
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
◀ **IN** · we know a tool = one action. People mix it up with "skill", so let's separate them.

**SET-UP** (the tool card on the left)

- a quick but important distinction, now that we know what a tool is
- **① Tool** — a single callable action: get_order_status(id) returns JSON
- a verb the model invokes; it is what the agent CAN do

[click] **② Skill** — a packaged PLAYBOOK for a whole job

- not one call — instructions plus the resources to do the job well
- "handle a refund" ships as a SKILL.md of steps + the policy + maybe a script
- the agent loads it ON DEMAND, only when the task matches — so we do not bloat every prompt with everything

[click] **③ A skill USES tools**

- it orchestrates several tool calls, plus the know-how to put them in the right order toward an outcome

[click] **④ The split** — tools = what an agent CAN do · skills = HOW to do it well

- ★ but both are just CONTEXT we hand the model — same trust boundary: it still only decides, we still execute
- simple analogy: a tool is one kitchen tool (a knife); a skill is the recipe that says which tools to use, in what order
- "loaded on demand" matters for the window from part 2: we do not pay tokens for skills we are not using right now
- skills are how teams package and share expertise — write the refund playbook once, every agent follows it the same way

▶ **OUT** · enough pieces — let's start the engine and watch the loop actually run → the loop.
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
◀ **IN** · we have all the pieces. Now we put them together and watch one real agent run, live.

🧭 **SPINE** · this is the payoff of the whole "agents" idea: the model picks its own next step. Everything before this slide was setup for this moment.

**SET-UP** (goal + step ① THINK on screen)

- the loop — not a diagram, but actually running
- the goal we gave it: "when will order #7788 arrive?"
- step one, it THINKS: I need the status first

[click] **① ACT + OBSERVE** — it calls get_order_status

- result: shipped, but the ETA is empty (null)… and there is a tracking number
- hold that thought

[click] **② THINK again** — the whole point of the talk

- ★ WE did not script this. the model chose its next move FROM what it just saw: "no ETA, but a tracking number → follow it"
- that self-chosen next step is what makes it an agent (not a chatbot)

[click] **③ ACT + OBSERVE** — it acts on its own decision: get_tracking

- and observes the ETA: June 25th

[click] **④ DONE** — it has the ETA, the goal is met, so it STOPS and answers

- the model decided when it was finished — no human stepping through the turns

[click] **⑤ The agentic loop** — we orchestrated nothing between steps

- think → act → observe → repeat; the model drives, and it knows when to quit
- the contrast: a chatbot answers once; an agent keeps going until the job is done — same model, different control flow
- nobody wrote "if no ETA, check tracking" — the model reasoned it from the data; that flexibility is the power AND the risk
- it is also where agents go wrong: a bad observation leads to a bad next step — so good tools and clear results matter a lot

▶ **OUT** · every one of those observations went somewhere — back into the window. What does that do to it? → the agent window.
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
◀ **IN** · every observation in that loop went back into the window from part 2 — now watch it fill, fast.

🧭 **SPINE** · this closes the circle: the "memory" box from the runtime slide, made concrete. Same window as part 2, but an agent fills it far faster.

**SET-UP** (BLUE cells already on screen)

- callback to the context window from part 2 — but now through the agent loop we just watched
- on arrival, blue = the system prompt PLUS the schema of every tool the agent may call
- ★ an agent carries its whole toolbox description on EVERY call, before it does anything

[click] **① The goal goes in** — green, set once

- the order question we just ran

[click] **② First loop** — it thinks, calls get_order_status

- the API's JSON answer is folded straight back into the window — the amber "tool data"
- note the scale jumped: each cell here is ~2k tokens (tool output is big)

[click] **③ Another loop, another blob of data**

- ★ the key point: it is tool OUTPUT, not our text, that fills an agent's window — and it grows every step
- nearly full after just a few loops

[click] **④ The agent OFFLOADS** — it writes a short note to external memory (striped blue, OUTSIDE the window)

- drops the raw JSON blobs, pulls the note back only when needed
- room reopens; the loop continues without losing the thread
- ★ this is the "memory" box from the runtime slide, made concrete — the model keeps no state, so the agent must DECIDE what to keep, summarise, or offload; that deciding IS its memory
- practical lesson: tools that return huge JSON can fill the window fast — so we design tools to return only what matters

▶ **OUT** · that is all five pieces of an agent, running. Let's zoom back out to the whole talk → five takeaways.
-->


---
layout: default
clicks: 4
---

<!-- KEY TAKEAWAYS — the whole-deck recap (replaced A2A 2026-06-22, user).
     Five durable mental models spanning AI → LLMs → Agents; ALL rows the
     SAME colour (cool/blue) — the old warm/cool split was dropped (user
     2026-06-23). Title on arrival with row 1 lit; clicks light rows 2–5.
     See KeyTakeaways.vue. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">To remember</div>
    <h2>Five things worth <span class="grad-cool">keeping</span></h2>
  </div>
  <KeyTakeaways />
</div>

<!--
◀ **IN** · we have done the whole arc. Let's compress it into five things worth keeping.

🧭 **SPINE** · this IS the spine, one last time: rows 1–3 = what the model IS (AI/LLMs), rows 4–5 = how WE put it to work (Agents). If they forget everything else, these five lines remain.

**SET-UP** (row ① lit, rows 2–5 dim)

- the whole talk in five lines
- **① an LLM is a stateless text function** — text in, text out, no memory between calls
- everything else is scaffolding we build around that

[click] **② it predicts, it cannot check**

- a frozen, public model guessing the next token
- so when we need OUR facts, or fresh facts, we FEED them in as context

[click] **③ an agent = code + an LLM, looping toward a goal**

- a piece of code with an LLM at its heart, memory and tools wired in
- given a goal, it loops and picks its own next step until the job is done — nothing exotic

[click] **④ the model only asks — the APP executes**

- the model emits a request; the app holds the credentials and makes the call
- the model never touches our systems — that is the governance story

[click] **⑤ MCP is a standardized HTTP API**

- three standard calls — initialize, tools/list, tools/call — over the same host, auth, and JSON
- ★ the punchline of the whole deck: new capability, sitting on plumbing we already own
- if someone took a phone call and missed everything, read them these five lines — that is the talk
- tie it back to the opener: this "revolution" is now a SYSTEM we could design — prediction + a loop + our own APIs
- reassuring message for an integration team: AI is not replacing our world; it is a new, well-behaved consumer OF our world

▶ **OUT** · so the only thing left is to use it. Enough slides → close.
-->

