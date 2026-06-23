<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AgentRuntime — "what is an agent", defined UP FRONT (top-down), as the
  WHOLE PICTURE with NO worked example (user 2026-06-23). We build it
  OUTSIDE-IN (user 2026-06-23): the AGENT box (= code) first, then fill it.

  Reveal order (user 2026-06-23): AGENT/code box → LLM → memory → tools →
  goal → the loop arc over the model ("picks its own next step") → the
  result out on the right. The GOAL + RESULT pills are GENERIC (label +
  a plain phrase, no order #7788) — the running, worked trace is AgentLoop.

  The mental model, outside-in:
    an AGENT = a PIECE OF CODE (the dashed box) with, at its heart —
       · an LLM     → the engine that reasons (the model from part 2)
       · a MEMORY   → holds the state the model forgets between calls
       · TOOLS      → so each step can act on the real world, not just talk
       · a GOAL     → the job to get done
       · run in a LOOP → it decides its own next step, until the goal is met
       → a RESULT comes out.

  VISUAL: an "engine + attachments" diagram on a fixed px stage. An SVG layer
  (viewBox 1:1 to the stage px, AgentLoop-style) draws the connectors, the
  loop arc and the agent boundary (= the code); HTML nodes sit on top in
  fixed slots. GOAL feeds in on the left, RESULT exits on the right; the
  LLM/tools/memory cluster is centred inside the boundary.

  PHYSICAL-PAGE RULE (4): every node + connector owns a fixed slot from the
  start; clicks only toggle opacity — nothing inserts or reflows. Rule 8:
  lands on arrival with the title + the empty AGENT box already showing.
  Rule 7: colours from tokens — core/loop/memory warm, tools cool, goal/
  result good.

  Beats (clicks: 6):
    c=0  the empty AGENT box — "an agent is, first, a piece of code"
    c=1  + LLM core            → the engine at its heart
    c=2  + MEMORY docked
    c=3  + TOOLS docked
    c=4  + GOAL in
    c=5  + LOOP arc over the model → "picks its own next step"
    c=6  + RESULT out + payoff band
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
      <svg class="wires" viewBox="0 0 780 310" preserveAspectRatio="none">
        <defs>
          <marker id="ar-head-good" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--good)" />
          </marker>
          <marker id="ar-head-warm" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--warm)" />
          </marker>
        </defs>

        <!-- agent boundary — the code that IS the agent; on screen from arrival (c0).
             Centred in the 780px stage: x=198 w=384 → spans 198–582, midpoint 390. -->
        <rect class="boundary" x="198" y="40" width="384" height="262" rx="20"
          :style="{ opacity: op(0) }" />

        <!-- core → memory (c2) -->
        <line x1="420" y1="196" x2="458" y2="206" class="wire warm" :style="{ opacity: op(2) }" />
        <!-- core → tools (c3) -->
        <line x1="360" y1="196" x2="322" y2="206" class="wire cool" :style="{ opacity: op(3) }" />

        <!-- GOAL → core (c4) -->
        <line x1="140" y1="147" x2="282" y2="147" class="wire good" marker-end="url(#ar-head-good)"
          :style="{ opacity: op(4) }" />

        <!-- LOOP arc over the core (c5) — the "decides its own next step" beat -->
        <path class="loop" d="M 315 98 Q 390 44 465 98" marker-end="url(#ar-head-warm)"
          :style="{ opacity: op(5) }" />

        <!-- core → result (c6) -->
        <line x1="494" y1="147" x2="632" y2="147" class="wire good" marker-end="url(#ar-head-good)"
          :style="{ opacity: op(6) }" />
      </svg>

      <!-- ---- nodes ---- -->
      <!-- agent label, pinned above the boundary — on screen from arrival -->
      <div class="agent-tag" :style="{ opacity: op(0) }">AGENT · code</div>

      <!-- the model itself — the engine at the heart (c1) -->
      <div class="node core" :class="{ agent: c >= 1 }" :style="{ opacity: op(1) }">
        <div class="n-ic">🧠</div>
        <div class="n-t">LLM</div>
        <div class="n-s">reason · decide · plan</div>
      </div>

      <!-- loop caption above the arc (c5) -->
      <div class="loop-cap" :style="{ opacity: op(5) }">picks its own next step</div>

      <!-- goal in — generic (no worked example) (c4) -->
      <div class="node side goal" :style="{ opacity: op(4) }">
        <div class="s-lab">GOAL</div>
        <div class="s-val">the job to get done</div>
      </div>

      <!-- result out — generic (c6) -->
      <div class="node side result" :style="{ opacity: op(6) }">
        <div class="s-lab good">RESULT</div>
        <div class="s-val">the job, done</div>
      </div>

      <!-- docked: memory (c2) -->
      <div class="node dock memory" :style="{ opacity: op(2) }">
        <div class="d-ic">📒</div>
        <div class="d-t">Memory</div>
        <div class="d-s">carry state it forgets</div>
      </div>

      <!-- docked: tools (c3) -->
      <div class="node dock tools" :style="{ opacity: op(3) }">
        <div class="d-ic">🔧</div>
        <div class="d-t">Tools</div>
        <div class="d-s">act on the real world</div>
      </div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: op(6) }">
      <span class="b-lead">An agent is a piece of code:</span>
      an <strong>LLM</strong> at its heart, wired to <strong>tools</strong> and
      <strong>memory</strong>, looping toward a <strong>goal</strong>.
    </div>
  </div>
</template>

<style scoped>
.ar { display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; }

.stage { position: relative; width: 780px; height: 310px; }
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
  left: 290px; top: 98px; width: 200px; height: 98px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--bg-panel); border: 1px solid var(--hair); border-top: 3px solid var(--warm);
  border-radius: 16px; box-shadow: var(--elev); text-align: center;
}
.core.agent { box-shadow: 0 0 28px rgba(252,192,3,0.16); }
.n-ic { font-size: 1.6rem; line-height: 1; }
.n-t { font-family: var(--serif); font-weight: 700; font-size: 1.2rem; margin-top: 0.15rem; }
.n-s { font-family: var(--mono); font-size: 0.62rem; color: var(--ink-faint); margin-top: 0.2rem; }

.agent-tag {
  position: absolute; left: 202px; top: 20px;
  font-family: var(--mono); font-weight: 700; font-size: 0.66rem; letter-spacing: 0.18em;
  color: var(--ink-faint); transition: opacity 0.5s ease;
}
.loop-cap {
  position: absolute; left: 290px; top: 50px; width: 200px; text-align: center;
  font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.02em;
  color: var(--warm-bright); transition: opacity 0.5s ease;
}

/* side pills (goal in / result out) */
.side {
  top: 121px; width: 130px; padding: 0.55rem 0.7rem;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 12px;
  box-shadow: var(--elev);
}
.goal { left: 8px; border-left: 3px solid var(--good); }
.result { left: 642px; border-left: 3px solid var(--good); }
.s-lab { font-family: var(--mono); font-weight: 700; font-size: 0.58rem; letter-spacing: 0.12em; color: var(--ink-faint); }
.s-lab.good { color: var(--good); }
.s-val { font-size: 0.82rem; color: var(--ink); line-height: 1.25; margin-top: 0.2rem; }

/* docked cards (memory / tools) */
.dock {
  top: 206px; width: 132px; height: 84px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); text-align: center;
}
.tools { left: 252px; border-top: 3px solid var(--cool); }
.memory { left: 396px; border-top: 3px solid var(--warm); }
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
