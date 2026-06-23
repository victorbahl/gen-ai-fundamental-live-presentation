<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  KeyTakeaways — the whole-deck recap, one slot before the hackathon CTA.
  Five lines that span the AI → LLMs → Agents arc, each a durable mental
  model the room should walk out with.

  The five, in deck order:
    1 LLM = a stateless text function   (next-token · stateless)
    2 it predicts, it can't check       (hallucination · grounding)
    3 agent = code + an LLM in a loop    (runtime · the loop)
    4 the model asks, the app executes   (tools · trust boundary)
    5 MCP = a standardized HTTP API      (MCP handshake)

  COLOUR (user 2026-06-23): ALL rows are the SAME colour — cool/blue.
  The old warm-vs-cool split read as an unexplained code, so it's gone.
  No per-row TAG chips either (user: "useless").

  PHYSICAL-PAGE RULE (4): all five rows own fixed slots from the start
  (the list height never changes); a click only lifts the next row from
  dimmed to lit — no insert, no reflow. Rule 8: lands with row 1 already
  lit. clicks: 4 (rows 2–5 light on c1–c4).
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

const items = [
  {
    head: 'An LLM is a stateless text function',
    gloss: 'Text in → text out. No memory between calls — every call starts fresh.',
  },
  {
    head: 'It predicts — it can’t check',
    gloss: 'A frozen, public model guessing the next token. So feed it the facts as context.',
  },
  {
    head: 'An agent = code + an LLM, looping toward a goal',
    gloss: 'With memory and tools wired in, it picks its own next step until done.',
  },
  {
    head: 'The model asks — the app executes',
    gloss: 'The model emits a request; the app holds the credentials and runs the call. The model never touches our systems.',
  },
  {
    head: 'MCP is a standardized HTTP API',
    gloss: 'Three standard calls — initialize, tools/list, tools/call — over the same host, auth, and JSON.',
  },
]
</script>

<template>
  <div class="kt">
    <ol class="rows">
      <li
        v-for="(it, i) in items"
        :key="i"
        class="row"
        :class="{ lit: c >= i }"
      >
        <div class="num">{{ String(i + 1).padStart(2, '0') }}</div>
        <div class="body">
          <div class="head">{{ it.head }}</div>
          <div class="gloss">{{ it.gloss }}</div>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.kt { width: 100%; max-width: 900px; margin: 0 auto; }

.rows {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 0.6rem;
}

.row {
  display: grid; grid-template-columns: 52px 1fr; align-items: center; gap: 0.9rem;
  padding: 0.6rem 1rem; border-radius: 13px;
  background: var(--bg-panel); border: 1px solid var(--hair);
  border-left: 3px solid var(--hair);
  box-shadow: var(--elev);
  opacity: 0.34;
  transition: opacity 0.5s ease, border-color 0.45s ease, box-shadow 0.45s ease;
}
.row.lit { opacity: 1; border-left-color: var(--cool); }

.num {
  font-family: var(--serif); font-weight: 700; font-size: 1.5rem;
  text-align: center; color: var(--ink-faint); line-height: 1;
  transition: color 0.45s ease;
}
.row.lit .num { color: var(--cool-bright); }

.body { min-width: 0; }
.head {
  font-family: var(--serif); font-weight: 700; font-size: 1.12rem; color: var(--ink);
  line-height: 1.2;
}
.gloss { font-size: 0.84rem; color: var(--ink-soft); line-height: 1.4; margin-top: 0.04rem; }
</style>
