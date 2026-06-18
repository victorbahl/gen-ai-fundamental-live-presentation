<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  ToolRoundtrip — "let the model ASK; our code does the work".
  Replaces the old 3-box flow slide with the round-trip across a TRUST
  BOUNDARY, shown with real artefacts — because the security/governance
  story is what this room cares about.

  The boundary is the spine of the slide: the MODEL lives on the left and
  only ever emits TEXT (a tool-call request); everything that actually
  touches a real system lives on OUR side of the dashed line. The model
  never holds a credential, never opens a socket — it requests, we execute.

  Flow (one round-trip):
    ① the model emits a tool_use request  → "call get_order_status(7788)"
    ② OUR code runs it against the real Order API (our auth, our governance)
    ③ the JSON result is folded back into the model's next payload → it answers

  PHYSICAL-PAGE RULE (4): the model card, the boundary, the two right-side
  cards and the payoff band own fixed slots from the start; the return arrow
  has a reserved slot too. Clicks only toggle opacity / lit-state — no reflow.
  Rule 8: lands with the title + the model's request already showing.
  Rule 7: model = warm (the AI), our side = cool (integration), result = good.

  Beats (clicks: 3):
    c=0  model card + its tool_use request (the ask)
    c=1  request crosses the boundary → OUR code runs the real API
    c=2  result returns, folded into the next payload (the model can now answer)
    c=3  payoff band — the model never touches our systems
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
const op = (from) => (c.value >= from ? 1 : 0)
</script>

<template>
  <div class="tr">
    <div class="stage">
      <!-- dashed trust boundary down the middle -->
      <div class="boundary" :class="{ lit: c >= 1 }">
        <span class="b-lab model-side">the model · text only</span>
        <span class="b-lab our-side">our side · executes</span>
      </div>

      <!-- LEFT: the model -->
      <div class="col left">
        <div class="card model">
          <div class="c-head"><span class="dot warm" />The model</div>
          <div class="c-sub">emits a request — it can't run anything</div>
          <div class="json">
            <div class="jl"><span class="k">"type"</span>: <span class="s">"tool_use"</span>,</div>
            <div class="jl"><span class="k">"name"</span>: <span class="s">"get_order_status"</span>,</div>
            <div class="jl"><span class="k">"input"</span>: { <span class="k">"id"</span>: <span class="s">"7788"</span> }</div>
          </div>
          <div class="tag warm">① just asks</div>
        </div>
      </div>

      <!-- arrows across the boundary -->
      <svg class="cross" viewBox="0 0 120 300" preserveAspectRatio="none">
        <defs>
          <marker id="tr-cool" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--cool)" />
          </marker>
          <marker id="tr-good" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--good)" />
          </marker>
        </defs>
        <!-- request → (c1) -->
        <line x1="6" y1="118" x2="112" y2="118" class="wire cool" marker-end="url(#tr-cool)"
          :style="{ opacity: op(1) }" />
        <!-- ← result (c2) -->
        <line x1="114" y1="182" x2="8" y2="182" class="wire good" marker-end="url(#tr-good)"
          :style="{ opacity: op(2) }" />
      </svg>

      <!-- RIGHT: our side (execute, then result) -->
      <div class="col right">
        <div class="card run" :style="{ opacity: op(1) }">
          <div class="c-head"><span class="dot cool" />Our code runs it</div>
          <div class="c-sub">our auth · our governance</div>
          <div class="json">
            <div class="jl"><span class="v">GET</span> api.acme.com/orders/<span class="s">7788</span></div>
            <div class="jl auth"><span class="dim">Authorization:</span> Bearer •••</div>
          </div>
          <div class="tag cool">② we execute</div>
        </div>

        <div class="card result" :style="{ opacity: op(2) }">
          <div class="c-head"><span class="dot good" />Result folded back in</div>
          <div class="c-sub">into the model's next payload → it answers</div>
          <div class="json">
            <div class="jl">{ <span class="k">"status"</span>: <span class="s">"shipped"</span>,</div>
            <div class="jl ind">  <span class="k">"eta"</span>: <span class="s">"2026-06-20"</span> }</div>
          </div>
          <div class="tag good">③ now it can answer</div>
        </div>
      </div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: op(3) }">
      <span class="b-lead">The model never touches our systems.</span>
      It only <strong>requests</strong>; our code holds the credentials and stays in control of execution.
    </div>
  </div>
</template>

<style scoped>
.tr { display: flex; flex-direction: column; align-items: center; gap: 0.9rem; width: 100%; }

.stage {
  position: relative; width: 880px; height: 330px;
  display: grid; grid-template-columns: 1fr 120px 1fr; align-items: center;
}

/* trust boundary */
.boundary {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 0;
  border-left: 2px dashed var(--hair); transform: translateX(-50%);
  transition: border-color 0.45s ease;
}
.boundary.lit { border-left-color: var(--cool); }
.b-lab {
  position: absolute; top: -1.3rem; white-space: nowrap;
  font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.04em; color: var(--ink-faint);
}
.b-lab.model-side { right: 0.6rem; }
.b-lab.our-side { left: 0.6rem; }

.col { display: flex; flex-direction: column; gap: 0.6rem; }
.left { grid-column: 1; }
.right { grid-column: 3; }

/* cards */
.card {
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); padding: 0.6rem 0.85rem; transition: opacity 0.5s ease;
}
.card.model { border-top: 3px solid var(--warm); }
.card.run { border-top: 3px solid var(--cool); }
.card.result { border-top: 3px solid var(--good); }

.c-head { display: flex; align-items: center; gap: 0.45rem; font-family: var(--serif); font-weight: 700; font-size: 0.96rem; color: var(--ink); }
.dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex: none; }
.dot.warm { background: var(--warm); }
.dot.cool { background: var(--cool); }
.dot.good { background: var(--good); }
.c-sub { font-size: 0.68rem; color: var(--ink-soft); margin-top: 0.1rem; }

.json {
  margin-top: 0.4rem; padding: 0.4rem 0.55rem; border-radius: 8px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  font-family: var(--mono); font-size: 0.68rem; line-height: 1.45; color: var(--ink-soft);
}
.jl { white-space: nowrap; }
.jl.ind { padding-left: 0; }
.jl.auth { color: var(--ink-faint); }
.k { color: var(--cool-bright); font-weight: 700; }
.s { color: var(--good); }
.v { color: var(--cool-bright); font-weight: 700; }
.dim { color: var(--ink-faint); }

.tag {
  display: inline-block; margin-top: 0.4rem;
  font-family: var(--mono); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.02em;
  padding: 0.16rem 0.55rem; border-radius: 999px;
}
.tag.warm { color: var(--warm-bright); background: rgba(252,192,3,0.14); }
.tag.cool { color: var(--cool-bright); background: rgba(1,118,211,0.10); }
.tag.good { color: var(--good); background: rgba(46,132,74,0.10); }

.cross { position: absolute; left: calc(50% - 60px); top: 0; width: 120px; height: 100%; pointer-events: none; }
.wire { stroke-width: 2.5; transition: opacity 0.5s ease; }
.wire.cool { stroke: var(--cool); }
.wire.good { stroke: var(--good); }

/* payoff band */
.band {
  width: 100%; max-width: 820px; text-align: center; font-size: 0.95rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.8rem 1.3rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.5s ease;
}
.band .b-lead { color: var(--cool-bright); font-weight: 700; }
.band strong { color: var(--ink); font-weight: 700; }
</style>
