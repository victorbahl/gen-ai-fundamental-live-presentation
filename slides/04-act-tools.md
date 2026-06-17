---
layout: default
---

<!-- ============================================================
     PART 3 — Agents: from answers to actions
     ============================================================
     This is the final part of the new AI → LLMs → Agents spine. It
     spans tools + MCP (this file) AND the agent loop / anatomy / A2A
     (05-act-agents.md) — they're ONE part now, not two. This file
     carries the part-opener hero (PartOpener.vue, spine bar with
     "Agents" lit). The old thematic openers — "A mind with no hands."
     (here) and "When the model drives." (05) — were REPLACED/REMOVED
     per user; do not resurrect them.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide. -->

<PartOpener
  bg="part-3.jpg"
  :active="3"
  accent="warm"
  num="03"
  headline="From answers to actions"
  sub="tools · MCP · the agent loop · A2A" />

<!--
Part three — Agents. So far we have a brilliant reasoner that sees a window of text and forgets
everything between calls. Notice what it still can't do: anything. It can't read our database, check
an order, send an email — it only emits text. This part is about giving it hands and then handing it
the wheel: tools, MCP, and the agent loop. This is where most of our work actually lives.
-->

---
layout: default
clicks: 4
---

<!-- TOOLS — build-up on fixed stage. Title is on screen from arrival; clicks add the flow. -->

<div class="stage tools-stage">
  <div class="title-row">
    <div class="kicker">The idea behind tools</div>
    <h2>Let the model <span class="grad-warm">ask</span> — our code does the work</h2>
  </div>

  <div class="flow">
    <div class="fnode" v-click="1">
      <div class="fn-t">1 · Model asks</div>
      <div class="fn-d">"call get_order_status(4471)"</div>
    </div>
    <div class="farrow" v-click="2">→</div>
    <div class="fnode" v-click="2">
      <div class="fn-t">2 · Our code runs</div>
      <div class="fn-d">hits the real Order API</div>
    </div>
    <div class="farrow" v-click="3">→</div>
    <div class="fnode" v-click="3">
      <div class="fn-t">3 · Result goes back</div>
      <div class="fn-d">folded into the next payload</div>
    </div>
  </div>

  <div class="stage-foot" v-click="4">
    The model never touches our systems. It only <strong>requests</strong>; we stay in control of execution.
  </div>
</div>

<style>
.tools-stage { gap: 2rem; }
.flow { display: flex; align-items: stretch; justify-content: center; gap: 1rem; }
.fnode {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  padding: 1.1rem 1.2rem; width: 230px;
}
.fn-t { font-family: var(--serif); font-weight: 600; font-size: 1.05rem; }
.fn-d { font-family: var(--mono); font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.4rem; }
.farrow { display: flex; align-items: center; font-size: 1.6rem; color: var(--ink-faint); }
</style>

<!--
The mechanism is simple and it puts us in control. We hand the model a menu of tools it's
allowed to ask for.
[click] It doesn't run anything — it emits a request: "please call get_order_status with 4471".
[click] OUR code receives that, calls the real API — with our auth, our governance.
[click] The result is fed back into the model's next payload, and now it can answer.
[click] Key point for this audience: the model never touches our systems directly. It requests;
we execute. That's a security and governance story, not just a feature.
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
MCP — Model Context Protocol — sounds like a new world. It isn't. It's a standard way to expose an
API so ANY AI app can consume it. And note who "consumes" it: not the model — the model only emits
text deciding which tool it wants. It's our app — the MCP client inside the host — that actually
makes the call. On the left, a REST call we've shipped a thousand times.
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
