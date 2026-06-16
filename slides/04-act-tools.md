<!-- ============================================================
     PART III — Giving it hands (tools / MCP)
     ============================================================ -->

---
layout: default
---

<Hero bg="part-3.jpg" kicker="Part III · Giving it hands">
  A mind with<br><span class="grad-warm">no hands.</span>
</Hero>

<!--
So we have a brilliant reasoner that sees a window of text and forgets everything between calls.
Notice what it still can't do: anything. It can't read your database, check an order, send an email.
It only emits text. To be useful, it needs hands.
-->

---
layout: default
---

<!-- TOOLS — build-up on fixed stage -->

<div class="stage tools-stage">
  <div class="title-row" v-click>
    <div class="kicker">The idea behind tools</div>
    <h2>Let the model <span class="grad-warm">ask</span> — your code does the work</h2>
  </div>

  <div class="flow">
    <div class="fnode" v-click="2">
      <div class="fn-t">1 · Model asks</div>
      <div class="fn-d">"call get_order_status(4471)"</div>
    </div>
    <div class="farrow" v-click="3">→</div>
    <div class="fnode" v-click="3">
      <div class="fn-t">2 · Your code runs</div>
      <div class="fn-d">hits the real Order API</div>
    </div>
    <div class="farrow" v-click="4">→</div>
    <div class="fnode" v-click="4">
      <div class="fn-t">3 · Result goes back</div>
      <div class="fn-d">folded into the next payload</div>
    </div>
  </div>

  <div class="stage-foot" v-click="5">
    The model never touches your systems. It only <strong>requests</strong>; you stay in control of execution.
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
The mechanism is simple and it puts you in control.
[click] You hand the model a menu of tools it's allowed to ask for.
[click] It doesn't run anything — it emits a request: "please call get_order_status with 4471".
[click] YOUR code receives that, calls the real API — with your auth, your governance.
[click] The result is fed back into the model's next payload, and now it can answer.
[click] Key point for this audience: the model never touches your systems directly. It requests;
you execute. That's a security and governance story, not just a feature.
-->

---
layout: default
clicks: 3
---

<!-- MCP ENVELOPE -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What MCP actually is</div>
    <h2>An API with a <span class="grad-warm">standard envelope</span></h2>
  </div>
  <McpEnvelope />
  <div class="mcp-foot" v-click="3">
    MCP just standardises how a model discovers and calls tools — so any model talks to any tool,
    without a custom integration each time.
  </div>
</div>

<style>
.mcp-foot {
  text-align: center; color: var(--ink-soft); font-size: 0.95rem;
  max-width: 64ch; margin: 0 auto;
}
</style>

<!--
MCP — Model Context Protocol — sounds like a new world. It isn't.
On the left, an HTTP call you've shipped a thousand times. On the right, the same intent as an
MCP tool call.
[click] Look at the MCP side: a method, a tool name, JSON arguments, a JSON result.
[click] They line up one-to-one. Endpoint ≈ tool name. Body ≈ arguments. Header ≈ transport.
JSON response ≈ JSON result.
[click] All MCP adds is a standard envelope for discovery and calling — so any model can talk to any
tool without a bespoke integration each time. It's not that different from an HTTP API with a few
agreed constraints. You already know this.
-->

---
layout: default
---

<!-- MCP SEQUENCE — Mermaid (static diagram, no build-up needed) -->

<div class="stage seq-stage">
  <div class="title-row">
    <div class="kicker">MCP in motion</div>
    <h2>It reads like any integration flow</h2>
  </div>

```mermaid {scale: 0.74}
sequenceDiagram
  autonumber
  actor U as User
  participant M as Model
  participant S as MCP Server
  participant API as Order API
  U->>M: "Where is order 4471?"
  M->>S: tools/call get_order_status
  S->>API: GET /orders/4471/status
  API-->>S: { shipped, eta }
  S-->>M: result (folded into context)
  M-->>U: "It shipped — arriving Thursday."
```

</div>

<style>
.seq-stage { gap: 1.2rem; justify-content: center; }
.seq-stage :deep(.mermaid) { display: flex; justify-content: center; }
</style>

<!--
End to end. User asks. The model decides it needs a tool and emits an MCP call. The MCP server
translates that into a real call against your Order API. The result comes back, gets folded into the
context — remember, into the payload — and the model phrases the human answer.
Squint and this is a System API behind a Process API. The model is just one more consumer in the flow.
-->
