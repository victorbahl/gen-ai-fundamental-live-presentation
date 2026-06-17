<script setup>
import { computed, ref, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  Hallucination — "it predicts plausible, not true".
  Pays off the predictor + stateless beats: the model emits the most LIKELY
  continuation over FROZEN weights — it never looked anything up. So it can be
  fluent, confident, AND wrong.

  Two cards, same grammar as McpEnvelope (so it reads as part of the deck):
    LEFT  (warm)  — the model's fluent answer + a near-full CONFIDENCE gauge.
    RIGHT (cool)  — the ACTUAL record from the system of truth — it differs.
  A "≠" badge between them; a payoff band underneath.

  Running example: order status (a fresh number, #7788, so it doesn't imply the
  earlier #4471 "shipped" answers were themselves hallucinated).

  PHYSICAL-PAGE RULE (4): both cards, the mid badge and the band own fixed slots
  from the start; clicks only toggle opacity / highlight — nothing reflows.
  Rule 8: lands on arrival with the prompt + model card + gauge already showing.

  Beats (clicks: 2):
    c=0  prompt + model answer + confidence gauge (94%)
    c=1  actual record fades in + the ≠ mismatch badge
    c=2  payoff band — no lookup; plausible ≠ true
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)

// gauge fills once on mount so the "94% confident" lands on arrival (Rule 8)
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => { mounted.value = true }))
const CONF = 94
</script>

<template>
  <div class="hl">
    <!-- the user's question -->
    <div class="ask">
      <span class="ask-tag">prompt</span>
      <span class="ask-text">“Where’s my order #7788?”</span>
    </div>

    <div class="grid">
      <!-- LEFT: model output -->
      <div class="card warm">
        <div class="chip"><span class="ic">🤖</span> Model output</div>
        <div class="body">
          <div class="answer">“Shipped Monday — arriving Wednesday.”</div>
          <div class="gauge">
            <div class="gauge-track">
              <div class="gauge-fill" :style="{ width: (mounted ? CONF : 0) + '%' }" />
            </div>
            <div class="gauge-lbl">
              <span class="pct">{{ CONF }}%</span> confident
              <span class="wrong" :style="{ opacity: c >= 1 ? 1 : 0 }">— and wrong</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MIDDLE: mismatch -->
      <div class="mid">
        <div class="neq" :style="{ opacity: c >= 1 ? 1 : 0 }">
          <span class="neq-sign">≠</span>
          <span class="neq-sub">doesn’t match</span>
        </div>
      </div>

      <!-- RIGHT: actual record -->
      <div class="card cool" :style="{ opacity: c >= 1 ? 1 : 0 }">
        <div class="chip"><span class="ic">📦</span> Actual record · Order API</div>
        <div class="body">
          <pre class="record">{ <span class="key">"order"</span>: <span class="s">"7788"</span>,
  <span class="key">"status"</span>: <span class="bad">"payment_failed"</span>,
  <span class="key">"shipped"</span>: <span class="bad">false</span> }</pre>
          <div class="src">system of record · never queried</div>
        </div>
      </div>
    </div>

    <!-- payoff band -->
    <div class="band" :style="{ opacity: c >= 2 ? 1 : 0 }">
      <span class="b-lead">No lookup happened.</span>
      It predicted the most <em>plausible</em> tokens over frozen weights — so
      <strong>fluent ≠ correct</strong>, and <strong>confident ≠ true</strong>.
    </div>
  </div>
</template>

<style scoped>
.hl {
  display: flex; flex-direction: column; align-items: center; gap: 1.1rem;
  width: 100%; max-width: 980px; margin: 0 auto;
  --card-h: 210px;
}

/* the asked question */
.ask {
  display: inline-flex; align-items: baseline; gap: 0.6rem;
  padding: 0.4rem 0.9rem; border-radius: 10px;
  background: var(--bg-soft); border: 1px solid var(--hair);
}
.ask-tag {
  font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--ink-faint);
}
.ask-text { font-family: var(--mono); font-size: 0.95rem; color: var(--ink); }

/* two cards + middle badge */
.grid {
  display: grid; grid-template-columns: 1fr 120px 1fr;
  gap: 0.9rem; align-items: stretch; width: 100%;
}
.card {
  height: var(--card-h);
  background: var(--bg-panel); border: 1px solid var(--hair); border-radius: 14px;
  box-shadow: var(--elev); overflow: hidden; border-top-width: 3px;
  display: flex; flex-direction: column; transition: opacity 0.45s ease;
}
.card.warm { border-top-color: var(--warm); }
.card.cool { border-top-color: var(--cool); }

.chip {
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0 0.9rem; height: 2.3rem; font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.03em; border-bottom: 1px solid var(--hair);
}
.card.warm .chip { color: var(--warm-bright); background: rgba(252,192,3,0.12); }
.card.cool .chip { color: var(--cool-bright); background: rgba(1,118,211,0.07); }
.ic { font-size: 0.95rem; }

.body { flex: 1; padding: 0.9rem; display: flex; flex-direction: column; justify-content: center; gap: 0.9rem; }
.answer { font-family: var(--serif); font-size: 1.18rem; font-weight: 600; line-height: 1.25; color: var(--ink); }

/* confidence gauge — deliberately near-full + warm, the irony is the point */
.gauge { display: flex; flex-direction: column; gap: 0.35rem; }
.gauge-track {
  height: 12px; border-radius: 6px; overflow: hidden;
  background: var(--bg-soft); border: 1px solid var(--hair);
}
.gauge-fill {
  height: 100%; border-radius: 6px;
  background: linear-gradient(90deg, var(--warm), var(--warm-bright));
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.gauge-lbl { font-family: var(--mono); font-size: 0.74rem; color: var(--ink-soft); }
.gauge-lbl .pct { color: var(--warm-bright); font-weight: 700; }
.gauge-lbl .wrong { color: var(--bad); font-weight: 700; transition: opacity 0.4s ease; }

/* record */
.record { margin: 0; font-family: var(--mono); font-size: 0.82rem; line-height: 1.5; color: var(--ink-soft); }
.record .key { color: var(--cool-bright); }
.record .s { color: var(--ink); }
.record .bad { color: var(--bad); font-weight: 700; }
.src { font-family: var(--mono); font-size: 0.66rem; color: var(--ink-faint); letter-spacing: 0.02em; }

/* middle mismatch badge */
.mid { display: flex; align-items: center; justify-content: center; }
.neq {
  display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  transition: opacity 0.45s ease;
}
.neq-sign {
  font-family: var(--serif); font-size: 2.4rem; font-weight: 700; line-height: 1;
  color: var(--bad);
}
.neq-sub { font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.06em; color: var(--ink-faint); }

/* payoff band */
.band {
  width: 100%; text-align: center; font-size: 0.95rem; color: var(--ink-soft);
  line-height: 1.45; padding: 0.8rem 1.2rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.band .b-lead { color: var(--bad); font-weight: 700; }
.band strong { color: var(--ink); }
</style>
