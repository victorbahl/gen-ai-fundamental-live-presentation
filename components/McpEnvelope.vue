<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  McpEnvelope — "MCP is just an API with a standard envelope".
  Left  : a plain HTTP call you've shipped for years.
  Right : the SAME intent as an MCP tool call.
  A row of "same idea" connectors highlights that the shapes are siblings.

  PHYSICAL-PAGE RULE: both cards and all connector chips are always rendered
  in fixed slots. Clicks only fade in the connectors / right card — no reflow.
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
// reveal order: 0 = HTTP only, 1 = MCP card, 2 = connectors, 3 = takeaway
</script>

<template>
  <div class="mcp">
    <!-- LEFT: HTTP -->
    <div class="card">
      <div class="card-head http">HTTP API · what you ship today</div>
      <pre class="code"><span class="k">POST</span> /orders/4471/status
<span class="dim">Host:</span> api.acme.com
<span class="dim">Authorization:</span> Bearer •••
<span class="dim">Content-Type:</span> application/json

<span class="cmt"># response</span>
{ <span class="s">"status"</span>: <span class="s">"shipped"</span>,
  <span class="s">"eta"</span>: <span class="s">"2026-06-18"</span> }</pre>
    </div>

    <!-- middle connectors -->
    <div class="mid">
      <div class="conn" :style="{ opacity: c >= 2 ? 1 : 0 }"><span>endpoint</span>≈<span>tool name</span></div>
      <div class="conn" :style="{ opacity: c >= 2 ? 1 : 0 }"><span>body</span>≈<span>arguments</span></div>
      <div class="conn" :style="{ opacity: c >= 2 ? 1 : 0 }"><span>auth header</span>≈<span>transport</span></div>
      <div class="conn" :style="{ opacity: c >= 2 ? 1 : 0 }"><span>JSON resp</span>≈<span>JSON result</span></div>
    </div>

    <!-- RIGHT: MCP -->
    <div class="card" :style="{ opacity: c >= 1 ? 1 : 0 }">
      <div class="card-head mcp">MCP tool call · what the model speaks</div>
      <pre class="code"><span class="k">"method"</span>: <span class="s">"tools/call"</span>,
<span class="k">"params"</span>: {
  <span class="dim">"name":</span> <span class="s">"get_order_status"</span>,
  <span class="dim">"arguments":</span> { <span class="s">"id"</span>: <span class="s">"4471"</span> }
}

<span class="cmt"># result</span>
{ <span class="s">"status"</span>: <span class="s">"shipped"</span>,
  <span class="s">"eta"</span>: <span class="s">"2026-06-18"</span> }</pre>
    </div>
  </div>
</template>

<style scoped>
.mcp {
  display: grid;
  grid-template-columns: 1fr 150px 1fr;
  gap: 1rem; align-items: start; width: 100%;
}
.card {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  overflow: hidden; transition: opacity 0.4s ease; height: 300px;
}
.card-head {
  font-size: 0.74rem; font-weight: 600; letter-spacing: 0.03em;
  padding: 0.6rem 0.9rem; border-bottom: 1px solid var(--hair);
}
.card-head.http { color: var(--cool-bright); background: rgba(59,130,246,0.07); }
.card-head.mcp  { color: var(--warm-bright); background: rgba(232,121,74,0.07); }
.code {
  margin: 0; padding: 0.9rem 1rem;
  font-family: var(--mono); font-size: 0.72rem; line-height: 1.55;
  color: var(--ink-soft); white-space: pre-wrap;
}
.code .k { color: var(--cool-bright); font-weight: 700; }
.code .s { color: var(--good); }
.code .dim { color: var(--ink-faint); }
.code .cmt { color: var(--ink-faint); font-style: italic; }

.mid { display: flex; flex-direction: column; gap: 0.6rem; padding-top: 2.4rem; }
.conn {
  display: flex; flex-direction: column; align-items: center;
  font-family: var(--mono); font-size: 0.58rem; color: var(--ink-faint);
  line-height: 1.5; transition: opacity 0.4s ease;
}
.conn span { color: var(--ink-soft); }
</style>
