<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  AgentLoop — the loop, RUNNING. (Rebuilt 2026-06-18, user direction.)
  The old static think→act→observe ring was abstract & decorative. This is a
  LIVE WORKED TRACE: the same loop, but actually executed on a concrete goal,
  accumulating like a real agent transcript until the goal is met.

  Example (chosen so the agentic decision is visible):
    GOAL  "When will order #7788 arrive?"
    ① THINK  I need the order's status first
      ACT   → get_order_status(7788)
      OBS   ← shipped — but no ETA, and a tracking number
    ② THINK  shipped, no ETA — but I have a tracking number, so go get it
      ACT   → get_tracking("1Z…")
      OBS   ← arriving 2026-06-20
    ③ THINK  I have the ETA — goal met
      DONE  "Order #7788 shipped via UPS — arriving Jun 20."

  THE POINT: step ② is NOT scripted by us. The model CHOSE it from what it
  OBSERVED in step ① (status had no ETA, but did carry a tracking number).
  That self-directed next-step IS what makes it an agent — we orchestrate
  nothing between turns.

  Each step is one turn of the SAME think→act→observe loop (legend, right).

  PHYSICAL-PAGE RULE (4): the goal header, all three step blocks, the DONE
  pill and the loop legend own fixed slots from the start (hidden rows keep
  their height — opacity only, no reflow). Rule 8: lands with the goal + the
  first THINK already showing. Rule 7: think=warm, act=cool, observe=good.

  Beats (clicks: 5):
    c=0  goal + step ① THINK
    c=1  step ① ACT → OBS (the first tool round-trip)
    c=2  step ② THINK — chosen FROM the observation (causal link lit)
    c=3  step ② ACT → OBS (the second, self-directed call)
    c=4  step ③ goal-met + DONE answer
    c=5  payoff band — the model drove every step
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
const op = (from) => (c.value >= from ? 1 : 0)
</script>

<template>
  <div class="al">
    <div class="trace">
      <!-- GOAL header -->
      <div class="goal">
        <span class="g-lab">GOAL</span>
        <span class="g-val">When will order #7788 arrive?</span>
        <span class="g-run">agent run ▷</span>
      </div>

      <!-- STEP ① -->
      <div class="step">
        <div class="badge" :style="{ opacity: op(0) }">①</div>
        <div class="lines">
          <div class="ln think" :style="{ opacity: op(0) }">
            <span class="lab warm">THINK</span>
            <span class="txt">I need the order's current status.</span>
          </div>
          <div class="ln act" :style="{ opacity: op(1) }">
            <span class="lab cool">ACT</span>
            <span class="txt"><span class="ar">→</span> <span class="fn">get_order_status</span>(<span class="s">7788</span>)</span>
          </div>
          <div class="ln obs" :style="{ opacity: op(1) }">
            <span class="lab good">OBS</span>
            <span class="txt"><span class="ar">←</span> { <span class="k">status</span>: <span class="s">"shipped"</span>, <span class="k">eta</span>: <span class="nul">null</span>, <span class="k">tracking</span>: <span class="s">"1Z…"</span> }</span>
          </div>
        </div>
      </div>

      <!-- STEP ② -->
      <div class="step">
        <div class="badge" :style="{ opacity: op(2) }">②</div>
        <div class="lines">
          <div class="ln think decided" :class="{ lit: c >= 2 }" :style="{ opacity: op(2) }">
            <span class="lab warm">THINK</span>
            <span class="txt">No ETA — but there's a tracking number. I'll follow it.</span>
          </div>
          <div class="from-line" :style="{ opacity: op(2) }">
            <span class="from">↑ chosen from what it just saw</span>
          </div>
          <div class="ln act" :style="{ opacity: op(3) }">
            <span class="lab cool">ACT</span>
            <span class="txt"><span class="ar">→</span> <span class="fn">get_tracking</span>(<span class="s">"1Z…"</span>)</span>
          </div>
          <div class="ln obs" :style="{ opacity: op(3) }">
            <span class="lab good">OBS</span>
            <span class="txt"><span class="ar">←</span> { <span class="k">state</span>: <span class="s">"in transit"</span>, <span class="k">eta</span>: <span class="s">"2026-06-20"</span> }</span>
          </div>
        </div>
      </div>

      <!-- STEP ③ — goal met → done -->
      <div class="step last">
        <div class="badge done" :style="{ opacity: op(4) }">③</div>
        <div class="lines">
          <div class="ln think" :style="{ opacity: op(4) }">
            <span class="lab warm">THINK</span>
            <span class="txt">I have the ETA — the goal is met. Stop.</span>
          </div>
          <div class="ln done-ln" :style="{ opacity: op(4) }">
            <span class="done-pill">✓ Order #7788 — shipped, arriving Jun 20</span>
          </div>
        </div>
      </div>
    </div>

    <!-- loop legend (right) -->
    <div class="legend">
      <div class="lg-title">one loop</div>
      <div class="lg-step warm" :class="{ on: c >= 0 }"><span class="d" />Think</div>
      <div class="lg-arrow">↓</div>
      <div class="lg-step cool" :class="{ on: c >= 1 }"><span class="d" />Act</div>
      <div class="lg-arrow">↓</div>
      <div class="lg-step good" :class="{ on: c >= 1 }"><span class="d" />Observe</div>
      <div class="lg-loop" :style="{ opacity: op(2) }">↻ repeat until<br><strong>goal met</strong></div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: op(5) }">
      <span class="b-lead">We orchestrated nothing between steps.</span>
      The model chose step ② from what it observed in step ① — and decided when it was done.
      <strong>That</strong> is the agentic loop.
    </div>
  </div>
</template>

<style scoped>
.al {
  display: grid; grid-template-columns: 1fr 156px; gap: 1.4rem;
  width: 100%; max-width: 920px; margin: 0 auto;
  align-items: start;
}
.band { grid-column: 1 / -1; }

/* ---- the transcript ---- */
.trace {
  display: flex; flex-direction: column; gap: 0.55rem;
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 16px;
  box-shadow: var(--elev); padding: 1rem 1.1rem;
}

.goal {
  display: flex; align-items: center; gap: 0.6rem;
  padding-bottom: 0.6rem; border-bottom: 1px solid var(--hair);
}
.g-lab {
  font-family: var(--mono); font-weight: 700; font-size: 0.6rem; letter-spacing: 0.14em;
  color: var(--good); padding: 0.16rem 0.5rem; border-radius: 999px;
  background: rgba(46,132,74,0.10); border: 1px solid rgba(46,132,74,0.22);
}
.g-val { font-family: var(--serif); font-weight: 700; font-size: 1.1rem; color: var(--ink); flex: 1; }
.g-run { font-family: var(--mono); font-size: 0.62rem; color: var(--ink-faint); letter-spacing: 0.04em; }

.step { display: grid; grid-template-columns: 30px 1fr; gap: 0.5rem; align-items: start; }
.badge {
  width: 26px; height: 26px; border-radius: 50%; margin-top: 0.1rem;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 700; font-size: 0.92rem;
  color: var(--ink-soft); background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.badge.done { color: var(--good); background: rgba(46,132,74,0.10); border-color: rgba(46,132,74,0.3); }

.lines { display: flex; flex-direction: column; gap: 0.28rem; }
.ln {
  position: relative; display: flex; align-items: baseline; gap: 0.6rem;
  font-family: var(--mono); font-size: 0.78rem; line-height: 1.4;
  transition: opacity 0.45s ease;
}
.lab {
  flex: none; width: 3.2rem; font-weight: 700; font-size: 0.6rem; letter-spacing: 0.1em;
  padding: 0.1rem 0; text-align: center; border-radius: 5px;
}
.lab.warm { color: var(--warm-bright); background: rgba(252,192,3,0.12); }
.lab.cool { color: var(--cool-bright); background: rgba(1,118,211,0.10); }
.lab.good { color: var(--good); background: rgba(46,132,74,0.10); }
.txt { color: var(--ink); }
.ar { color: var(--ink-faint); font-weight: 700; }
.fn { color: var(--cool-bright); font-weight: 700; }
.k { color: var(--ink-soft); }
.s { color: var(--good); }
.nul { color: var(--bad); }

/* step ②'s think — the self-directed decision, gets a highlight + a "from" note */
.ln.decided { border-radius: 7px; padding: 0.15rem 0.4rem; margin: 0 -0.4rem; transition: opacity 0.45s ease, background 0.45s ease; }
.ln.decided.lit { background: rgba(252,192,3,0.08); box-shadow: inset 0 0 0 1px rgba(252,192,3,0.3); }
/* the "chosen from what it saw" note — its own reserved line under the THINK text
   (Rule 4: opacity-gated, indented to clear the 3.2rem label so it sits under the text) */
.from-line {
  padding-left: 3.8rem; margin-top: 0.05rem; height: 0.95rem;
  transition: opacity 0.45s ease;
}
.from {
  font-family: var(--mono); font-size: 0.58rem; font-style: italic; color: var(--warm-bright);
}

.done-ln { margin-top: 0.1rem; }
.done-pill {
  font-family: var(--sans); font-weight: 700; font-size: 0.84rem;
  color: var(--good); background: rgba(46,132,74,0.10); border: 1px solid var(--good);
  border-radius: 10px; padding: 0.35rem 0.8rem;
}

/* ---- loop legend ---- */
.legend {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  padding: 0.9rem 0.7rem; border-radius: 14px;
  background: var(--bg-soft); border: 1px solid var(--hair);
}
.lg-title { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.12em; color: var(--ink-faint); text-transform: uppercase; margin-bottom: 0.2rem; }
.lg-step {
  display: flex; align-items: center; gap: 0.4rem; width: 100%; justify-content: center;
  font-family: var(--sans); font-weight: 600; font-size: 0.82rem; color: var(--ink-soft);
  padding: 0.3rem 0.5rem; border-radius: 9px; border: 1px solid transparent;
  transition: all 0.4s ease; opacity: 0.5;
}
.lg-step .d { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.55; }
.lg-step.warm { color: var(--warm-bright); }
.lg-step.cool { color: var(--cool-bright); }
.lg-step.good { color: var(--good); }
.lg-step.on { opacity: 1; background: var(--bg-panel); border-color: var(--hair); box-shadow: var(--elev); }
.lg-step.on .d { opacity: 1; }
.lg-arrow { color: var(--ink-faint); font-size: 0.9rem; line-height: 0.6; }
.lg-loop {
  margin-top: 0.4rem; text-align: center; line-height: 1.3;
  font-family: var(--mono); font-size: 0.64rem; color: var(--warm-bright);
  transition: opacity 0.45s ease;
}
.lg-loop strong { color: var(--ink); }

/* payoff band */
.band {
  text-align: center; font-size: 0.94rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.75rem 1.3rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.5s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band strong { color: var(--ink); font-weight: 700; }
</style>
