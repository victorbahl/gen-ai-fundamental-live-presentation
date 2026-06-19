<script setup lang="ts">
/**
 * One battle question, on screen. The host drives phases by CLICK:
 *   c0  question + options visible, answers OPEN, live "answered" counter
 *   c1  LOCK answers (no more scoring)
 *   c2  REVEAL the correct option + who scored
 * Players answer on their phones; we never show the per-option distribution —
 * only how many have locked in. The correct answer is revealed on the last click.
 * No timer: scoring is fixed-points (correct = POINTS, wrong = 0).
 *
 * Slide usage:  <BattleQuestion :index="0" /> with `clicks: 2`
 */
import { computed, watch } from "vue";
import { useSlideContext, onSlideEnter } from "@slidev/client";
import { battle, BATTLE_QUESTIONS } from "./battle/battleConfig";

const props = defineProps<{ index: number }>();
const b = battle();
const { $clicks } = useSlideContext();
const c = computed(() => $clicks.value);

const q = computed(() => BATTLE_QUESTIONS[props.index]);
const answered = computed(() => b.state.answeredCount);
const total = computed(() => b.players().length);

// Phase follows clicks. Driven off the click count, but only committed once this
// slide is actually entered (onSlideEnter) — Slidev pre-renders adjacent slides,
// so binding to onMounted could push a phase for a slide that isn't on screen yet.
function syncPhase() {
  if (c.value <= 0) b.startQuestion(props.index);
  else if (c.value === 1) b.lock();
  else b.reveal();
}
onSlideEnter(syncPhase);
watch(c, syncPhase);

const revealed = computed(() => c.value >= 2);
// How many got it right this round (we don't name them — just the count).
const scoredCount = computed(() => b.players().filter((p) => p.lastDelta > 0).length);
</script>

<template>
  <div class="battle-stage q">
    <div class="bq-head">
      <div class="bq-num">Q{{ index + 1 }} / {{ BATTLE_QUESTIONS.length }}</div>
      <div class="bq-meta">
        <span class="bq-answered">{{ answered }}<span class="of">/{{ total }}</span> locked in</span>
        <span class="bq-status" :class="{ open: c === 0, locked: c >= 1 }">
          {{ c === 0 ? 'OPEN' : 'LOCKED' }}
        </span>
      </div>
    </div>

    <h2 class="bq-q">{{ q.question }}</h2>

    <div class="bq-opts">
      <div v-for="o in q.options" :key="o.label" class="bq-opt"
           :class="{ correct: revealed && o.label === q.correct, dim: revealed && o.label !== q.correct }">
        <span class="lab">{{ o.label }}</span>
        <span class="txt">{{ o.text }}</span>
        <span v-if="revealed && o.label === q.correct" class="tick">✓</span>
      </div>
    </div>

    <transition name="fade">
      <div v-if="revealed" class="bq-reveal">
        <span class="lead">Scored this round:</span>
        <span v-if="scoredCount" class="mv"><b>{{ scoredCount }}</b>
          player{{ scoredCount === 1 ? '' : 's' }} got it ✓</span>
        <span v-else class="none">nobody got it 😅</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.battle-stage.q { position: absolute; inset: 0; display: flex; flex-direction: column;
  padding: 44px 64px; }
.bq-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.bq-num { font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--warm-bright); }
.bq-meta { display: flex; gap: 18px; align-items: center; }
.bq-answered { color: var(--ink-soft); font-weight: 700; font-size: 1.1rem; }
.bq-answered .of { color: var(--ink-faint); font-weight: 600; }
.bq-status { font-weight: 900; font-size: 1rem; letter-spacing: .12em; text-align: right; }
.bq-status.open { color: var(--cool-bright); }
.bq-status.locked { color: var(--ink-faint); }

.bq-q { font-size: 2.3rem; line-height: 1.15; margin: 10px 0 26px; }
.bq-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bq-opt { display: flex; align-items: center; gap: 16px; background: var(--bg-panel);
  border: 2px solid var(--hair); border-radius: 16px; padding: 18px 20px;
  font-size: 1.3rem; box-shadow: var(--elev); transition: all .3s cubic-bezier(0.22, 1, 0.36, 1); }
.bq-opt .lab { width: 38px; height: 38px; flex: none; border-radius: 10px; background: var(--cool);
  color: #001722; font-weight: 900; display: grid; place-items: center; }
.bq-opt .txt { flex: 1; }
.bq-opt .tick { color: var(--good); font-weight: 900; font-size: 1.6rem; }
.bq-opt.correct { border-color: var(--good); background: rgba(46,132,74,.14); }
.bq-opt.correct .lab { background: var(--good); }
.bq-opt.dim { opacity: .4; }

.bq-reveal { margin-top: 24px; font-size: 1.2rem; }
.bq-reveal .lead { color: var(--ink-soft); margin-right: 10px; }
.bq-reveal .mv b { color: var(--warm-bright); }
.bq-reveal .none { color: var(--ink-soft); }

.fade-enter-active { transition: opacity .4s ease; }
.fade-enter-from { opacity: 0; }
</style>
