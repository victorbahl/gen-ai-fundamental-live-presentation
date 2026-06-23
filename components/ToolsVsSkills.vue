<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/*
  ToolsVsSkills — names the SKILL concept (the missing piece) by contrasting
  it with the TOOL we just saw. Sits AFTER tools + MCP (user's ordering): the
  room now knows what a tool is, so we can say what a skill is by difference.

  The accurate distinction (kept deliberately concrete):
    TOOL  = one atomic, callable ACTION. A function the model can request:
            name + typed input → result. (get_order_status(id) → JSON.)
            It's a verb the model invokes.
    SKILL = a packaged PLAYBOOK for a whole job. Instructions + the resources
            to do it (a SKILL.md of steps, plus scripts/templates/tools it may
            use), LOADED ON DEMAND when the task matches — so the agent does a
            multi-step job the RIGHT way without bloating every prompt.
            It's a procedure the agent follows.

  The one-liner that lands it: a tool is a single CALL; a skill is the
  KNOW-HOW for using many of them toward an outcome. Tools are what it CAN do;
  skills are HOW to do something well.

  PHYSICAL-PAGE RULE (4): both cards + the bridge band own fixed slots from the
  start; clicks only toggle opacity / lit-state — nothing reflows.
  Rule 8: lands with the title + the TOOL card already showing.
  Rule 7: tool = cool (the callable/integration side), skill = warm (the
  model-facing know-how).

  Beats (clicks: 3):
    c=0  TOOL card lit (recap of what we just built)
    c=1  SKILL card lit (the new idea)
    c=2  the "uses tools" link — a skill orchestrates several tool calls
    c=3  bridge band — tools = what it CAN do; skills = HOW to do it well
*/

const { $clicks } = useSlideContext()
const c = computed(() => $clicks.value)
const op = (from) => (c.value >= from ? 1 : 0)
</script>

<template>
  <div class="ts">
    <div class="cards">
      <!-- TOOL -->
      <div class="card tool" :class="{ lit: c >= 0 }">
        <div class="head">
          <span class="ic">🔧</span>
          <div class="ht">
            <div class="t">Tool</div>
            <div class="tag cool">one callable action</div>
          </div>
        </div>
        <div class="def">A single function the model can request — typed input, one result.</div>
        <div class="code">
          <div class="cl"><span class="fn">get_order_status</span>(<span class="arg">id</span>) <span class="ar">→</span> JSON</div>
          <div class="cl"><span class="fn">create_ticket</span>(<span class="arg">order, note</span>) <span class="ar">→</span> id</div>
          <div class="cl"><span class="fn">send_email</span>(<span class="arg">to, body</span>) <span class="ar">→</span> ok</div>
        </div>
        <div class="foot"><span class="lab cool">it's a verb</span> the model invokes — what it <strong>can</strong> do</div>
      </div>

      <!-- SKILL -->
      <div class="card skill" :class="{ lit: c >= 1 }" :style="{ opacity: c >= 1 ? 1 : 0.28 }">
        <div class="head">
          <span class="ic">📚</span>
          <div class="ht">
            <div class="t">Skill</div>
            <div class="tag warm">a packaged playbook</div>
          </div>
        </div>
        <div class="def">Instructions + resources for a whole job, <strong>loaded on demand</strong> when the task matches.</div>
        <div class="code skill-pkg">
          <div class="cl pkg-line"><span class="folder">📁 handle-a-refund/</span></div>
          <div class="cl ind"><span class="file">SKILL.md</span> <span class="cmt">— the steps, in order</span></div>
          <div class="cl ind"><span class="file">policy.md</span> <span class="cmt">— when refunds are allowed</span></div>
          <div class="cl ind"><span class="file">refund.py</span> <span class="cmt">— a script it can run</span></div>
        </div>
        <div class="foot"><span class="lab warm">it's a procedure</span> the agent follows — <strong>how</strong> to do it well</div>
      </div>
    </div>

    <!-- the link: a skill drives several tool calls -->
    <div class="link" :style="{ opacity: op(2) }">
      <span class="l-pill">A skill orchestrates <strong>several tool calls</strong> + know-how toward one outcome</span>
    </div>

    <!-- bridge band -->
    <div class="band" :style="{ opacity: op(3) }">
      <span class="b-lead">Tools are what an agent CAN do; skills are HOW to do something well.</span>
      Both are just context we hand the model — it still only decides; we still execute.
    </div>
  </div>
</template>

<style scoped>
.ts { display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 1000px; margin: 0 auto; }

.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.3rem; width: 100%; }
.card {
  display: flex; flex-direction: column; gap: 0.6rem; min-height: 264px;
  padding: 1.1rem 1.15rem; border-radius: 16px;
  background: var(--bg-panel); border: 1px solid var(--hair); border-top: 3px solid var(--hair);
  box-shadow: var(--elev);
  transition: opacity 0.45s ease, border-top-color 0.45s ease, box-shadow 0.45s ease;
}
.card.tool.lit { border-top-color: var(--cool); }
.card.skill.lit { border-top-color: var(--warm); box-shadow: 0 0 26px rgba(var(--warm-rgb),0.14); }

.head { display: flex; align-items: center; gap: 0.7rem; }
.ic {
  display: flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 12px; font-size: 1.45rem; flex: none;
}
.card.tool .ic { background: rgba(var(--cool-rgb),0.08); border: 1px solid rgba(var(--cool-rgb),0.22); }
.card.skill .ic { background: rgba(var(--warm-rgb),0.12); border: 1px solid rgba(var(--warm-rgb),0.28); }
.t { font-family: var(--serif); font-weight: 700; font-size: 1.3rem; color: var(--ink); line-height: 1.1; }
.tag { font-family: var(--mono); font-size: 0.64rem; font-weight: 600; letter-spacing: 0.02em; margin-top: 0.1rem; }
.tag.cool { color: var(--cool-bright); }
.tag.warm { color: var(--warm-bright); }

.def { font-size: 0.88rem; color: var(--ink-soft); line-height: 1.45; }
.def strong { color: var(--ink); font-weight: 700; }

.code {
  padding: 0.6rem 0.7rem; border-radius: 10px; flex: 1;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  font-family: var(--mono); font-size: 0.72rem; line-height: 1.7; color: var(--ink-soft);
}
.cl { white-space: nowrap; }
.cl.ind { padding-left: 0.9rem; }
.fn { color: var(--cool-bright); font-weight: 700; }
.arg { color: var(--ink-faint); }
.ar { color: var(--ink-faint); }
.folder { color: var(--warm-bright); font-weight: 700; }
.file { color: var(--ink); font-weight: 600; }
.cmt { color: var(--ink-faint); font-style: italic; }

.foot { font-size: 0.78rem; color: var(--ink-soft); line-height: 1.35; }
.foot strong { color: var(--ink); font-weight: 700; }
.lab { font-family: var(--mono); font-size: 0.66rem; font-weight: 700; }
.lab.cool { color: var(--cool-bright); }
.lab.warm { color: var(--warm-bright); }

/* link pill between the two ideas */
.link { transition: opacity 0.45s ease; }
.l-pill {
  font-size: 0.84rem; color: var(--ink-soft);
  padding: 0.4rem 1rem; border-radius: 999px;
  background: var(--bg-panel); border: 1px solid var(--hair); box-shadow: var(--elev);
}
.l-pill strong { color: var(--ink); font-weight: 700; }

/* bridge band */
.band {
  width: 100%; text-align: center; font-size: 0.94rem; color: var(--ink-soft);
  line-height: 1.5; padding: 0.75rem 1.3rem; border-radius: 12px;
  background: var(--sunken); border: 1px solid var(--sunken-border);
  transition: opacity 0.45s ease;
}
.band .b-lead { color: var(--warm-bright); font-weight: 700; }
.band strong { color: var(--ink); font-weight: 700; }
</style>
