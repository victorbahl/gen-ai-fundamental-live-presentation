---
layout: default
---

<!-- ============================================================
     PART 3 — Agents: from answers to actions
     ============================================================
     Final part of the AI → LLMs → Agents spine. It spans the agent
     runtime / tools / MCP (this file) AND skills / the loop / context /
     key takeaways (05-act-agents.md) — ONE part. This file carries the
     part-opener hero (PartOpener.vue, spine bar with "Agents" lit).

     ORDER (reworked 2026-06-18, user): TOP-DOWN now. Define "what is an
     agent" UP FRONT (AgentRuntime.vue) — the old end-of-part "Anatomy"
     recap was folded into it — then unpack each piece: tools, MCP, then
     skills + the running loop in 05. The dead thematic openers
     ("A mind with no hands.", "When the model drives.") stay CUT.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide. -->

<PartOpener
  bg="part-3.jpg"
  :active="3"
  num="03"
  headline="From answers to actions"
  sub="what an agent is · tools · MCP · skills · the loop" />

<!--
◀ **IN** · part 2 left us a brilliant reasoner that does ONE thing — emit text. Part 3 gives it hands.

🧭 **SPINE** · the last move of AI → LLMs → Agents, and where most of OUR work lives. We build everything here on the model from part 2.

**SET-UP** (part opener on screen)

- part three — Agents
- notice what the model still cannot do: anything. it cannot read our database, check an order, send an email — it only writes text
- this part gives it hands, and then hands it the wheel
- we go top-down: first WHAT an agent is (nothing exotic), then each piece — tools, MCP, skills, the loop
- plan on screen: what an agent is · tools · MCP · skills · the loop
- "agent" is the most hyped and most confusing word in AI right now — by the end of this part it will feel simple, even boring
- everything here connects to our day job: tools are APIs, MCP is HTTP, governance is our gateway — same world, new caller

▶ **OUT** · let's kill the mystery first — what IS an agent, exactly? → the runtime.
-->


---
layout: default
clicks: 6
---

<!-- WHAT IS AN AGENT — the runtime, defined up front (replaces the old
     end-of-part "Anatomy" recap). Built OUTSIDE-IN: the AGENT/code box lands
     first, then we fill it — LLM → memory → tools → goal → loop → result. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Start with the whole picture</div>
    <h2>A piece of <span class="grad-warm">code</span>, with a model at its heart</h2>
  </div>
  <AgentRuntime />
</div>

<!--
◀ **IN** · before any detail, let's de-mystify the word "agent" — it is simpler than the hype.

🧭 **SPINE** · the WHOLE picture, up front. Every later slide (tools, MCP, skills, loop) just zooms into one piece of this diagram. No example here on purpose — we run the full loop live later.

**SET-UP** (empty AGENT box on screen — the dashed boundary, nothing inside yet)

- an agent is NOT a new kind of model — it is, first, a PIECE OF CODE
- that dashed box IS the agent: code we write. now let's fill it with the few things that matter

[click] **① + LLM** — the engine at its heart

- at the centre we drop in the exact same LLM from part 2 — on its own, it only reasons and writes text

[click] **② + MEMORY** — a place to remember

- it holds the state the model itself forgets between calls (remember: stateless, part 2)

[click] **③ + TOOLS** — a way to act

- now it can really act on the world, not only talk

[click] **④ + GOAL** — something to aim at

- we hand the code a goal: the job to get done

[click] **⑤ + the LOOP** — it picks its own next step

- the model runs in a loop: instead of answering once, it decides its OWN next step, again and again, until the goal is met
- ★ "loop" is the key word — answering once is a chatbot; deciding the next step and repeating is an agent

[click] **⑥ + RESULT** — the job, done

- ★ nothing here is new or magic — same engine from part 2; "agent" is the CAR we build around it — wheel, fuel, memory
- so two agents on the same model can behave very differently: same engine, different goal, tools, memory
- concrete example we all know: Claude Code IS exactly this — an LLM, plus tools (edit files, run commands, search), plus memory, looping toward a goal
- and Claude or ChatGPT the PRODUCTS are not the bare model either — they are real apps wrapped around a model (system prompt, history, safety, and now tools too)
- the line that makes it an AGENT is the autonomous LOOP: a plain chat answers once with a human in the loop; an agent picks its own next step until done

▶ **OUT** · let's open piece one — how does the model actually "act"? It asks; code does the work → tools.
-->


---
layout: default
clicks: 2
---

<!-- TOOLS — the round-trip across the trust boundary, with real artefacts.
     Replaces the old 3-box flow. Title on arrival; clicks walk the round-trip. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The idea behind tools</div>
    <h2>Let the model <span class="grad-warm">ask</span> — our code does the work</h2>
  </div>
  <ToolRoundtrip />
</div>

<!--
◀ **IN** · the runtime showed a "tools" box. Here is what really happens inside it — and it puts US in control.

🧭 **SPINE** · the security heart of the talk. "The model asks, we execute" comes back in the key takeaways — plant it strongly here.

**SET-UP** (model's request on the left)

- the first piece: tools — simple mechanism, and we stay in control
- we give the model a menu of tools it is allowed to ask for
- it does the only thing it can — it writes TEXT: a structured request, "call get_order_status with id 7788"
- ★ note the dashed line: the model lives on the LEFT and never crosses it

[click] **① The request crosses to OUR side** — and our code makes the real call

- here, a tools/call to an MCP server (more on MCP next) — with our auth, our rules
- ★ the model never holds the credential, never touches the system

[click] **② The JSON result is folded back** into the model's next request — and only now it can answer

- the point this room cares about: the model only ASKS; our code holds the keys and runs the call
- that is a security and governance story, not just a feature
- think of the model as a very smart intern with no login: it writes the request, but WE press the button
- this is why agents are safe to deploy: every action goes through our code, our auth, our limits — nothing runs that we did not allow
- and the model only sees the tools we list — so we control its powers by what we put on the menu

▶ **OUT** · I just said "MCP server" — so what is MCP? Good news: something we already know → MCP.
-->


---
layout: default
clicks: 3
---

<!-- MCP ENVELOPE — same HTTP, same auth, only the body differs -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What MCP actually is</div>
    <h2>A standard API <span class="grad-warm">any AI app can consume</span></h2>
  </div>
  <McpEnvelope />
</div>

<!--
◀ **IN** · we said "MCP server" — so let me show that MCP is not a new world; it is HTTP we already ship.

🧭 **SPINE** · the punchline of the whole deck lands here: new AI capability, on plumbing we already own.

**SET-UP** (REST call on the left)

- MCP = Model Context Protocol = the STANDARD way to expose a tool, so ANY AI app can use it, with no custom integration
- who "consumes" it? not the model — the model only writes text to pick a tool; our app (the MCP client) makes the call
- on the left: a REST call we have shipped a thousand times

[click] **① The MCP request** appears on the right

- the same request our app sends to an MCP server
- same method over HTTP, same Host, same Bearer token in the same Authorization header — a normal HTTPS POST

[click] **② Line them up** — the whole HTTP envelope is identical

- same host, same auth, same JSON content type
- ★ the ONLY difference is the body: REST puts intent in the URL; MCP carries a small JSON-RPC object (jsonrpc, id, method, params)
- that is the entire difference

[click] **③ Why this room cares** — because it is just HTTP, every policy we run today wraps it unchanged

- OAuth, rate limiting, logging — all still apply
- MCP does not bypass our gateway; it sits behind it like any other API
- the message to leadership: adopting MCP does NOT mean a new security stack — our existing API gateway already governs it
- before MCP, every AI-to-tool link was custom glue; MCP is the "USB-C" — one standard plug, any tool, any AI app
- (if asked: "JSON-RPC" is just a tiny rule for the body — name the method, pass the params, that is all)

▶ **OUT** · same envelope, yes — but what calls happen in an MCP conversation? Always the same three → the handshake.
-->


---
layout: default
clicks: 3
---

<!-- MCP HANDSHAKE — the three standard calls (initialize → list → call) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">MCP in motion</div>
    <h2>Three <span class="grad-warm">standard calls</span></h2>
  </div>
  <McpHandshake />
</div>

<!--
◀ **IN** · same HTTP envelope — now the three calls that fill it, every MCP session.

**SET-UP** (initialize row active on arrival)

- every MCP session is the same three calls — and our MCP client makes them, not the model
- the model only decides; the client speaks the protocol
- **① initialize** — client and server agree on a protocol version and exchange capabilities
- a normal POST /mcp with our Bearer token

[click] **② tools/list** — the one that matters most

- the server returns its MENU: the tools it offers, with names and JSON schemas
- the client fetches it and hands it to the model — so the model "discovers" what it can do, with no custom code
- ★ new tool on the server? it just shows up here — no redeploy of the model

[click] **③ tools/call** — the model picks one, the client makes the call

- the server runs it against the real Order API; the result comes back as JSON, folded into the model's context

[click] **④ Discover, then call** — same shape for every server

- that is the whole point: any AI app can talk to any tool
- squint and it is a System API behind a Process API — our app is just one more governed consumer
- this is exactly the integration story we know: discover an API, then call it — MCP just makes "discover" automatic for AI apps
- in practice initialize + tools/list happen once at the start; tools/call repeats many times during the loop we are about to watch

▶ **OUT** · so the model can call ONE action. But a real job needs several, in order — that is a skill → tools vs skills.
-->

