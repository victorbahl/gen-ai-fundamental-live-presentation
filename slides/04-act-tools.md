---
layout: default
---

<!-- ============================================================
     PART 3 — Agents: from answers to actions
     ============================================================
     Final part of the AI → LLMs → Agents spine. It spans the agent
     runtime / tools / MCP (this file) AND skills / the loop / context /
     A2A (05-act-agents.md) — ONE part. This file carries the part-opener
     hero (PartOpener.vue, spine bar with "Agents" lit).

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
  accent="warm"
  num="03"
  headline="From answers to actions"
  sub="what an agent is · tools · MCP · skills · the loop · A2A" />

<!--
Part three — Agents. So far we have a brilliant reasoner that sees a window of text and forgets
everything between calls. Notice what it still can't do: anything. It can't read our database, check
an order, send an email — it only emits text. This part gives it hands and then hands it the wheel.
And we'll do it top-down: first I'll show you exactly what an agent IS — it's nothing exotic — then
we'll unpack each piece: tools, MCP, skills, and the loop actually running. This is where most of
our work lives.
-->

---
layout: default
clicks: 4
---

<!-- WHAT IS AN AGENT — the runtime, defined up front (replaces the old
     end-of-part "Anatomy" recap). Title on arrival; clicks dock each piece. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Start with the whole picture</div>
    <h2>An agent is the <span class="grad-warm">LLM</span> — wrapped so it can act</h2>
  </div>
  <AgentRuntime />
</div>

<!--
Before any detail, let's de-mystify the word "agent". It is NOT a new kind of model. It's the exact
LLM we just spent Part 2 on — on its own it only reasons and emits text.
[click] We make it an agent by wrapping it: we give it a GOAL and put it in a LOOP, so instead of
answering once, it decides its OWN next step, over and over, until the goal is met.
[click] We wire it to TOOLS — so each step can actually act on the real world, not just talk.
[click] And we give it MEMORY — somewhere to carry the state the model itself forgets between calls.
[click] That's the whole thing: an LLM, a loop with a goal, tools, and memory. Nothing here is new —
the rest of this part is just unpacking each piece. Let's start with tools.
-->

---
layout: default
clicks: 3
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
The first piece: tools. The mechanism is simple, and it puts US in control. We hand the model a menu
of tools it's allowed to ask for. On screen, it does the only thing it can — it emits TEXT: a
structured request, "call get_order_status with id 7788". Notice the dashed line: the model lives on
the left and never crosses it.
[click] That request crosses to OUR side. Our code runs the real Order API call — with our auth, our
governance. The model never holds the credential.
[click] The JSON result is folded back into the model's next payload — and only now can it answer.
[click] The point this room cares about: the model never touches our systems. It requests; we
execute. That's a security and governance story, not just a feature.
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
We just saw OUR code call a tool. MCP — Model Context Protocol — is simply the STANDARD way to expose
that tool so ANY AI app can consume it, with zero bespoke integration. It sounds like a new world; it
isn't. And note who "consumes" it: not the model — the model only emits text deciding which tool it
wants. It's our app — the MCP client inside the host — that actually makes the call. On the left, a
REST call we've shipped a thousand times.
[click] On the right, the same request our app sends to an MCP server. Same method over HTTP, same
Host, same Bearer token in the same Authorization header. It's a normal HTTPS POST.
[click] Line them up: the whole HTTP envelope is identical — host, auth, JSON content type. The
ONLY thing that differs is the body. REST puts intent in the URL; MCP carries a small JSON-RPC
object — jsonrpc, an id, a method, params. That's the entire difference.
[click] And here's the part this room cares about: because it's just HTTP, every policy we run
today wraps it unchanged — OAuth, rate limiting, audit logging, WAF. MCP doesn't bypass our
gateway; it sits behind it like any other API.
-->

---
layout: default
clicks: 3
---

<!-- MCP HANDSHAKE — the three standard calls (initialize → list → call) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">MCP in motion</div>
    <h2>Three <span class="grad-warm">standard calls</span> — every time</h2>
  </div>
  <McpHandshake />
</div>

<!--
Every MCP session is the same three calls — and to be precise, it's our MCP client (inside the
host app) making them, not the model. The model only decides; the client speaks the protocol.
First, initialize: the client and the server agree on a protocol version and exchange capabilities.
A normal POST /mcp with our Bearer token.
[click] Then tools/list — this is the one that matters. The server returns its MENU: the tools it
offers, their names and JSON schemas. The client fetches it and hands it to the model, so the model
"discovers" what it can do — with zero bespoke integration. New tool on the server? It just shows up here.
[click] Finally tools/call — the model picks one, the client issues the call, the server runs it
against the real Order API, and the result comes back as JSON, folded into the model's context.
[click] Discover, then call — same shape for every server. That's the whole point: any AI app can
talk to any tool. Squint and it's a System API behind a Process API; our app is just one more
governed consumer in the flow.
-->
