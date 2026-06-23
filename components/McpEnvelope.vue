<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  McpEnvelope — "MCP is a standard API any AI app can consume".
  NB: the consumer is our APP (the MCP client in the host), not the model —
  the model only decides which tool; our client makes the HTTP call.
  Left  : a plain REST call we've shipped for years.
  Right : the SAME request our app sends to an MCP server — same host shape,
          same Bearer auth, same JSON over HTTP. Only the BODY differs (JSON-RPC).
  A policy band drives the payoff: because it's HTTP, the gateway
  policies we run (OAuth / rate-limit / log) wrap it unchanged.

  PHYSICAL-PAGE RULE (Rule 4): both cards, the middle band and the policy
  strip own fixed slots from the start. Cards are equal fixed height; the
  middle badges align to the header band / body band via shared CSS vars.
  Clicks only toggle opacity + highlight — nothing inserts or reflows.

  Beats (Rule 8 — first beat on arrival):
    c=0  title + LEFT (REST) card
    c=1  RIGHT (MCP) card fades in
    c=2  "same envelope / different body" highlight + Bearer row lights up
    c=3  policy band — it's HTTP, so our policies still apply
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
</script>

<template>
  <div class="mcp">
    <div class="grid">
      <!-- LEFT: REST -->
      <div class="card cool">
        <div class="chip">REST API</div>
        <div class="hdr">
          <div class="ln"><span class="k">GET</span> /orders/4471/status</div>
          <div class="ln" :class="{ pair: c >= 2 }"><span class="dim">Host:</span> api.acme.com</div>
          <div class="ln auth" :class="{ same: c >= 2 }"><span class="dim">Authorization:</span> Bearer •••</div>
          <div class="ln" :class="{ pair: c >= 2 }"><span class="dim">Accept:</span> application/json</div>
        </div>
        <div class="bsep" />
        <div class="body" :class="{ differ: c >= 2 }"><pre><span class="cmt"># no body — intent is in the URL</span>

<span class="cmt"># 200 OK</span>
{ <span class="s">"status"</span>: <span class="s">"shipped"</span>,
  <span class="s">"eta"</span>: <span class="s">"2026-06-18"</span> }</pre></div>
      </div>

      <!-- MIDDLE: alignment badges -->
      <div class="mid">
        <div class="spacer" />
        <div class="hdr-badge">
          <div class="badge cool" :style="{ opacity: c >= 2 ? 1 : 0 }">
            <span class="b-eq">≡</span> same HTTP envelope
            <span class="b-sub">host · 🔒 Bearer · JSON</span>
          </div>
        </div>
        <div class="body-badge">
          <div class="badge warm" :style="{ opacity: c >= 2 ? 1 : 0 }">
            <span class="b-eq">≠</span> only the body
            <span class="b-sub">JSON-RPC vs. URL</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: MCP -->
      <div class="card warm" :style="{ opacity: c >= 1 ? 1 : 0 }">
        <div class="chip">MCP server</div>
        <div class="hdr">
          <div class="ln"><span class="k">POST</span> /mcp</div>
          <div class="ln" :class="{ pair: c >= 2 }"><span class="dim">Host:</span> tools.acme.com</div>
          <div class="ln auth" :class="{ same: c >= 2 }"><span class="dim">Authorization:</span> Bearer •••</div>
          <div class="ln" :class="{ pair: c >= 2 }"><span class="dim">Content-Type:</span> application/json</div>
        </div>
        <div class="bsep" />
        <div class="body" :class="{ differ: c >= 2 }"><pre>{ <span class="k">"jsonrpc"</span>: <span class="s">"2.0"</span>, <span class="k">"id"</span>: 7,
  <span class="k">"method"</span>: <span class="s">"tools/call"</span>,
  <span class="k">"params"</span>: { <span class="dim">"name"</span>: <span class="s">"get_order_status"</span>,
    <span class="dim">"arguments"</span>: { <span class="s">"id"</span>: <span class="s">"4471"</span> } } }</pre></div>
      </div>
    </div>

    <!-- POLICY BAND -->
    <div class="policy" :style="{ opacity: c >= 3 ? 1 : 0 }">
      <span class="p-lead">It's just HTTP — so the gateway policies we run today wrap it unchanged:</span>
      <span class="pills">
        <span class="pill">OAuth</span>
        <span class="pill">Rate limit</span>
        <span class="pill">Log</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.mcp {
  display: flex; flex-direction: column; gap: 1.2rem;
  width: 100%; max-width: 980px; margin: 0 auto;
  /* shared geometry so middle badges align to the card bands */
  --chip-h: 2.3rem;
  --row-h: 1.74rem;
  --hdr-pad: 0.5rem;
  --hdr-h: calc(var(--hdr-pad) * 2 + var(--row-h) * 4);
  --card-h: 322px;
}
.grid {
  display: grid; grid-template-columns: 1fr 168px 1fr;
  gap: 0.9rem; align-items: start;
}

/* ---- cards ---- */
.card {
  height: var(--card-h);
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); overflow: hidden;
  display: flex; flex-direction: column;
  border-top-width: 3px;
  transition: opacity 0.45s ease;
}
.card.cool { border-top-color: var(--cool); }
.card.warm { border-top-color: var(--warm); }

.chip {
  height: var(--chip-h); display: flex; align-items: center;
  padding: 0 0.9rem; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.04em; border-bottom: 1px solid var(--hair);
}
.card.cool .chip { color: var(--cool-bright); background: rgba(1,118,211,0.07); }
.card.warm .chip { color: var(--warm-bright); background: rgba(252,192,3,0.12); }

.hdr { padding: var(--hdr-pad) 0.9rem; }
.ln {
  height: var(--row-h); display: flex; align-items: center;
  font-family: var(--mono); font-size: 0.72rem; color: var(--ink-soft);
  border-radius: 6px; padding: 0 0.35rem; margin: 0 -0.35rem;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}
.ln.pair.pair { background: rgba(1,118,211,0.06); }
.ln.auth.same {
  background: rgba(1,118,211,0.12);
  box-shadow: inset 0 0 0 1px var(--cool);
  color: var(--ink);
}

.bsep { height: 1px; background: var(--hair); margin: 0.25rem 0.9rem; }
.body {
  flex: 1; padding: 0.4rem 0.9rem; border-radius: 8px;
  margin: 0 0.4rem 0.4rem; transition: background 0.4s ease;
}
.body.differ { background: rgba(252,192,3,0.07); }
.body pre {
  margin: 0; font-family: var(--mono); font-size: 0.70rem; line-height: 1.5;
  color: var(--ink-soft); white-space: pre-wrap;
}
.k { color: var(--cool-bright); font-weight: 700; }
.s { color: var(--good); }
.dim { color: var(--ink-faint); }
.cmt { color: var(--ink-faint); font-style: italic; }

/* ---- middle alignment column ---- */
.mid { height: var(--card-h); display: flex; flex-direction: column; }
.mid .spacer { height: var(--chip-h); }
.mid .hdr-badge { height: var(--hdr-h); display: flex; align-items: center; justify-content: center; }
.mid .body-badge { flex: 1; display: flex; align-items: center; justify-content: center; }
.badge {
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
  text-align: center; font-size: 0.66rem; font-weight: 600; line-height: 1.2;
  padding: 0.45rem 0.6rem; border-radius: 10px; transition: opacity 0.45s ease;
}
.badge.cool { color: var(--cool-bright); background: rgba(1,118,211,0.08); border: 1px solid rgba(1,118,211,0.25); }
.badge.warm { color: var(--warm-bright); background: rgba(252,192,3,0.10); border: 1px solid rgba(252,192,3,0.30); }
.b-eq { font-size: 1rem; font-weight: 700; }
.b-sub { font-family: var(--mono); font-size: 0.56rem; font-weight: 500; color: var(--ink-faint); letter-spacing: 0.01em; }

/* ---- policy band ---- */
.policy {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap;
  gap: 0.7rem 1rem; transition: opacity 0.45s ease;
  padding: 0.7rem 1rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
}
.p-lead { font-size: 0.82rem; color: var(--ink-soft); }
.pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.pill {
  font-family: var(--mono); font-size: 0.68rem; font-weight: 600;
  color: var(--cool-bright); background: rgba(1,118,211,0.10);
  border: 1px solid rgba(1,118,211,0.30); border-radius: 999px;
  padding: 0.22rem 0.7rem;
}
</style>
