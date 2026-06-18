<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AgentRuntime — "what is an agent", defined UP FRONT (top-down).
  Replaces the old end-of-part "Anatomy of an agent" recap: instead of
  assembling parts at the end, we draw the whole runtime first, then the
  following slides unpack each piece (tools, MCP, skills, the loop).

  The accurate, technical mental model we build, one beat at a time:
    an AGENT = the LLM we already know, wrapped so it can ACT
       · placed in a LOOP, pursuing a GOAL → it decides its own next step
       · wired to TOOLS  → each step can act on the real world (not just talk)
       · wired to MEMORY → it carries the state the model forgets between calls

  VISUAL: an "engine + attachments" diagram on a fixed px stage. An SVG layer
  (viewBox matched 1:1 to the stage px, AgentLoop-style) draws the connectors,
  the loop arc and the agent boundary; HTML nodes sit on top in fixed slots.

  PHYSICAL-PAGE RULE (4): every node + connector owns a fixed slot from the
  start; clicks only toggle opacity / lit-state — nothing inserts or reflows.
  Rule 8: lands on arrival with the title + the bare LLM core already showing.
  Rule 7: colours come from tokens — core/loop/memory = warm (the model),
  tools = cool (integration), goal/answer = good (the target/result).

  Beats (clicks: 4):
    c=0  the bare LLM core — "on its own it only reasons & emits text"
    c=1  + GOAL in + the LOOP arc + the agent boundary → it decides its next step
    c=2  + TOOLS docked → each step can act
    c=3  + MEMORY docked → carries state across calls
    c=4  + ANSWER out + payoff band → that's an agent
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

// per-beat opacity helpers (Rule 4 — fixed slots, fade only)
const op = (from) => (c.value >= from ? 1 : 0)
</script>

<template>
  <div class="ar">
    <div class="stage">
      <!-- ---- connector / boundary layer (1 svg unit = 1 px) ---- -->
      <svg class="wires" viewBox="0 0 780 300" preserveAspectRatio="none">
        <defs>
          <marker id="ar-head-good" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--good)" />
          </marker>
          <marker id="ar-head-warm" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--warm)" />
          </marker>
        </defs>

        <!-- agent boundary — appears when it becomes "an agent" (c1) -->
        <rect class="boundary" x="150" y="42" width="480" height="254" rx="20"
          :style="{ opacity: op(1) }" />

        <!-- GOAL → core (c1) -->
        <line x1="150" y1="124" x2="286" y2="124" class="wire good" marker-end="url(#ar-head-good)"
          :style="{ opacity: op(1) }" />

        <!-- LOOP arc over the core (c1) — the "decides its own next step" beat -->
        <path class="loop" d="M 300 72 Q 390 22 480 72" marker-end="url(#ar-head-warm)"
          :style="{ opacity: op(1) }" />

        <!-- core → tools (c2) -->
        <line x1="350" y1="176" x2="322" y2="220" class="wire cool" :style="{ opacity: op(2) }" />
        <!-- core → memory (c3) -->
        <line x1="430" y1="176" x2="458" y2="220" class="wire warm" :style="{ opacity: op(3) }" />

        <!-- core → answer (c4) -->
        <line x1="494" y1="124" x2="628" y2="124" class="wire good" marker-end="url(#ar-head-good)"
          :style="{ opacity: op(4) }" />
      </svg>

      <!-- ---- nodes ---- -->
      <!-- the model itself -->
      <div class="node core" :class="{ agent: c >= 1 }">
        <div class="n-ic">🧠</div>
        <div class="n-t">LLM</div>
        <div class="n-s">reason · decide · plan</div>
      </div>

      <!-- agent label, pinned to the boundary -->
      <div class="agent-tag" :style="{ opacity: op(1) }">AGENT</div>

      <!-- loop caption above the arc -->
      <div class="loop-cap" :style="{ opacity: op(1) }">picks its own next step</div>

      <!-- goal in -->
      <div class="node side goal" :style="{ opacity: op(1) }">
        <div class="s-lab">GOAL</div>
        <div class="s-val">When will order #7788 arrive?</div>
      </div>

      <!-- answer out -->
      <div class="node side answer" :style="{ opacity: op(4) }">
        <div class="s-lab good">ANSWER</div>
        <div class="s-val">Shipped — arriving Jun 20.</div>
      </div>

      <!-- docked: tools -->
      <div class="node dock tools" :style="{ opacity: op(2) }">
        <div class="d-ic">🔧</div>
        <div class="d-t">Tools</div>
        <div class="d-s">act on the real world</div>
      </div>

      <!-- docked: memory -->
      <div class="node dock memory" :style="{ opacity: op(3) }">
        <div class="d-ic">📒</div>
        <div class="d-t">Memory</div>
        <div class="d-s">carry state it forgets</div>
      </div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: op(4) }">
      <span class="b-lead">An agent is the LLM, wrapped to act:</span>
      a <strong>loop</strong> pursuing a <strong>goal</strong>, with <strong>tools</strong> and
      <strong>memory</strong>. Nothing new — the rest of this part unpacks each piece.
    </div>
  </div>
</template>

<style scoped>
.ar { display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; }

.stage { position: relative; width: 780px; height: 300px; }
.wires { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

/* boundary + wires */
.boundary {
  fill: none; stroke: var(--ink-faint); stroke-width: 1.5;
  stroke-dasharray: 5 6; opacity: 0; transition: opacity 0.5s ease;
}
.wire { stroke-width: 2.5; fill: none; transition: opacity 0.5s ease; }
.wire.good { stroke: var(--good); }
.wire.cool { stroke: var(--cool); }
.wire.warm { stroke: var(--warm); }
.loop {
  fill: none; stroke: var(--warm); stroke-width: 2.5;
  transition: opacity 0.5s ease;
}

/* ---- nodes (fixed slots) ---- */
.node { position: absolute; transition: opacity 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease; }

/* the LLM core */
.core {
  left: 290px; top: 72px; width: 200px; height: 104px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--bg-panel); border: 1px solid var(--hair); border-top: 3px solid var(--warm);
  border-radius: 16px; box-shadow: var(--elev); text-align: center;
}
.core.agent { box-shadow: 0 0 28px rgba(252,192,3,0.16); }
.n-ic { font-size: 1.6rem; line-height: 1; }
.n-t { font-family: var(--serif); font-weight: 700; font-size: 1.2rem; margin-top: 0.15rem; }
.n-s { font-family: var(--mono); font-size: 0.62rem; color: var(--ink-faint); margin-top: 0.2rem; }

.agent-tag {
  position: absolute; left: 164px; top: 24px;
  font-family: var(--mono); font-weight: 700; font-size: 0.66rem; letter-spacing: 0.22em;
  color: var(--ink-faint); transition: opacity 0.5s ease;
}
.loop-cap {
  position: absolute; left: 290px; top: 4px; width: 200px; text-align: center;
  font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.02em;
  color: var(--warm-bright); transition: opacity 0.5s ease;
}

/* side pills (goal in / answer out) */
.side {
  top: 94px; width: 142px; padding: 0.55rem 0.7rem;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 12px;
  box-shadow: var(--elev);
}
.goal { left: 8px; border-left: 3px solid var(--good); }
.answer { left: 630px; border-left: 3px solid var(--good); }
.s-lab { font-family: var(--mono); font-weight: 700; font-size: 0.58rem; letter-spacing: 0.12em; color: var(--ink-faint); }
.s-lab.good { color: var(--good); }
.s-val { font-size: 0.82rem; color: var(--ink); line-height: 1.25; margin-top: 0.2rem; }

/* docked cards (tools / memory) */
.dock {
  top: 220px; width: 132px; height: 78px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); text-align: center;
}
.tools { left: 256px; border-top: 3px solid var(--cool); }
.memory { left: 392px; border-top: 3px solid var(--warm); }
.d-ic { font-size: 1.25rem; line-height: 1; }
.d-t { font-family: var(--serif); font-weight: 600; font-size: 0.98rem; margin-top: 0.1rem; }
.d-s { font-size: 0.64rem; color: var(--ink-soft); margin-top: 0.12rem; }

/* payoff band */
.band {
  width: 100%; max-width: 820px; text-align: center; font-size: 0.95rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.8rem 1.3rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.5s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band strong { color: var(--ink); font-weight: 700; }
</style>
