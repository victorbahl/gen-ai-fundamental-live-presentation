---
layout: default
---

<!-- ============================================================
     PART 2 — How an LLM actually works
     ============================================================
     Opens with the LLMs part-opener hero (PartOpener.vue) — the spine
     bar with "LLMs" lit, reusing the roadmap copy. Part 2 order:
     opener → predictor → attention → stateless (stack + filmstrip) →
     context window (which closes the part and bridges into agents).
     The two retired slides ("the most important slide" remembers-nothing
     hero, and the "It has no memory" payoff statement) were CUT here per
     user — do not resurrect them.
     NB: this header comment sits AFTER the frontmatter on purpose — a
     comment BEFORE the first `---` renders as a stray blank slide. -->

<PartOpener
  bg="part-2.jpg"
  :active="2"
  accent="warm"
  num="02"
  headline="How the model actually works"
  sub="tokens · attention · stateless · the window · its limits" />

<!--
◀ **IN** · the history pointed to one idea — prediction. Now we open the model that does it.

🧭 **SPINE** · part 2 of AI → LLMs → Agents, and the most important part. Everything in part 3 (agents) is built on what we learn here.

**SET-UP** (part opener on screen)

- part two — LLMs
- we open the box and look at the one model inside
- the plan on screen: tokens → attention → stateless → the window → its limits
- four ideas, each its own slide; together they explain the whole machine
- this part has more detail than part 1 — on purpose; this is where the real understanding is
- by the end we will know exactly why the model can sound brilliant and still be wrong — which sets up agents

▶ **OUT** · let's start at the very beginning — what happens the moment we type a prompt → predictor.
-->


---
layout: default
clicks: 8
---

<!-- NEXT-TOKEN PREDICTOR — same pipeline, question prompt.
     The prompt is a QUESTION ("What's the best Salesforce acquisition?"); on
     arrival the grey field hugs the question with NO cursor; the caret appears
     only once the first token (MuleSoft) is generated; the first distribution
     is a CLOSE race (MuleSoft just ahead, Slack = Informatica, Tableau behind)
     so "ranked guess, not a fact" lands harder; the vector/weights captions are
     larger and sit lower; the weights caption names training vs inference.
     See NextTokenPredictor.vue. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">How an LLM generates text</div>
    <h2>How a prompt becomes a <span class="grad-warm">prediction</span></h2>
  </div>
  <NextTokenPredictor />
</div>

<!--
◀ **IN** · the opener said "let's open the box". This slide is the box: text in → prediction out, from start to end.

🧭 **SPINE** · this one slide holds the whole idea. Stateless, the limits, even agents — they all come from this single loop. If people remember one slide, it should be this one.

**SET-UP** (on arrival, before any click)

- on screen: a grey "prompt" field, the size of the question, no cursor — nothing has happened yet
- for us it is English; for the model it is not readable text → first it must cut it into pieces
- say: "a question — the way we all use a chat box"

[click] **① TOKENISE** — the field splits, in place, into small chips

- these are tokens, NOT words — they are pieces of words
- "What's" → What + 's · "Salesforce" → Sales + force · "acquisition" stays in one piece (it is common, so it has its own token)
- the model has a fixed list of ~100k pieces, and builds any text from them, like bricks
- simple rule: ~4 letters ≈ one token ≈ about ¾ of a word
- why pieces, not full words? a full-word list would be huge and still miss new words; word-pieces build ANY text — URLs, typos, code — from a small set
- and this is exactly what we pay for: "tokens in, tokens out" — a longer prompt costs more

[click] **② NUMBERS** — each token becomes a column of numbers (we call it a "vector")

- text becomes maths; for the model, this list of numbers IS the meaning of the token
- words with close meaning get close numbers (king/queen, Paris/London) — that is how it "feels" meaning
- the numbers here are just examples — real models use hundreds or thousands of numbers per token

[click] **③ WEIGHTS** — the numbers go into a much bigger grid of numbers = the weights ("billions of parameters")

- the input changes with every prompt; the weights do NOT change — they are frozen
- TRAINING = setting these weights, one time (months, very big computers) · INFERENCE = one pass through them (the sweep, milliseconds)
- from here, everything is inference — the weights never change again
- ★ keep this in mind: this is WHY the model has no memory, and WHY later we help it by changing the INPUT, not the weights

[click] **④ PREDICT (token 1)** — it gives a score to EVERY token in the list; we show the top 4 as bars

- ★ the key moment — it is a close race: MuleSoft .30 · Slack .24 = Informatica .24 · Tableau .14
- this is not a fact, it is a ranked guess over ~100k options; change the question a little and Slack can win
- there is a setting called "temperature": low = it always takes the top bar, high = it takes more risks
- it picks the top one → "MuleSoft" is added (in warm colour); the cursor now appears and blinks = it is generating

[click] **⑤ LOOP (token 2)** — take prompt + "MuleSoft", and send the WHOLE text back through the SAME pipeline

- a second pass; a new score list, this time a clear winner: "," at .74 → add it

[click] **⑥ LOOP (token 3)** — again → "obviously" at .52

- nothing is planned in advance — it chooses each token only after the one before exists (no outline, no draft)

[click] **⑦ LOOP (token 4)** — "." wins at .63, the model decides it is finished → "…acquisition? MuleSoft, obviously."

- and how does it decide to STOP? not by choosing "nothing" — there is a special "end" token (EOS, "End Of Sequence") in the list, scored every pass; when the thought is complete it becomes the top bar and we halt
- (if asked: "cut off in the middle" is different — that is a length limit or a stop word, not the model choosing to stop)

[click] **⑧ THE LOOP, with a name**

- prompt → tokens → numbers → weights → score → pick → add → send back
- everything that looks like intelligence is this loop, at very large scale; every pass = one inference over the same frozen weights
- back to that first close race: no plan, no memory — each pass starts fresh, only from the text it can see

▶ **OUT** · I just sent the whole prompt back in one block — but HOW does it know which words go with which? That is **attention** → next slide.
-->




---
layout: default
clicks: 3
---

<!-- ATTENTION BEAT — same word, two meanings (FT "bank" idea, reworked to "pipeline").
     BOTH sentences + the highlighted "pipeline" are on screen from arrival; clicks
     build the attention machinery on top (arcs A → arcs B → payoff). -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Why it understands context</div>
    <h2>Same word, two meanings — set by its <span class="grad-warm">neighbours</span></h2>
  </div>
  <AttentionFlip />
</div>

<!--
◀ **IN** · in the predictor I sent the whole prompt back in one block. Here is HOW the model links the words — attention.

🧭 **SPINE** · "attention" is the word from the 2017 Transformer on the timeline. This slide is what it means, in one picture.

**SET-UP** (both sentences on screen, same word highlighted)

- everyone names "attention", few explain it — so let's make it simple
- on screen: the SAME word "pipeline" in two sentences
- "The pipeline pumped oil for miles" / "Our Q4 pipeline looks healthy"
- ask the room: same word — but we already read it two different ways. how?

[click] **① Sentence one** — arcs draw from "pipeline" to "pumped" and "oil"

- the model looks at the neighbour words → here "pipeline" means a steel pipe

[click] **② Sentence two** — arcs draw from "pipeline" to "Q4" and "healthy"

- same word, but now the neighbours say → future sales deals
- same letters, opposite meaning — and "pipeline" is a word we all use every day

[click] **③ The idea** — the model reads the WHOLE sentence at once and lets the neighbours fix the meaning

- ★ each word "pays attention" to the others; that is the whole trick in the name
- reading all words together (not one by one) is what the Transformer unlocked — and why it beat the old models
- the old models read left-to-right, one word at a time, and forgot the start of long sentences; attention sees everything at once, so distance does not matter
- it is also why long prompts cost more: every token looks at every other token, so the work grows fast with length

▶ **OUT** · so it reads a prompt well. But what does it keep AFTER it answers? The surprising truth → stateless.
-->


---
layout: default
clicks: 6
---

<!-- STATELESS REPLAY · take 1 — re-stack → forward pass → answer returns -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The stateless truth</div>
    <h2>Every turn, we resend the <span class="grad-warm">entire</span> conversation</h2>
  </div>
  <StatelessReplayStack />
</div>

<!--
◀ **IN** · attention shows it reads a prompt well. Now the big surprise: between two calls, it keeps NOTHING.

🧭 **SPINE** · this is the hinge of the whole talk. "No memory" is why we resend everything, why the window matters, and why agents need external memory in part 3.

**SET-UP** (only the LEFT side on screen)

- let's build one conversation, step by step
- on arrival: the human asks "Where is my order?" — nothing on the right yet

[click] **① The request (POST body)** appears

- this is what our API really receives: the system prompt + the question
- the "resend" sweep runs over the whole thing

[click] **② Into the LLM** — a stateless function — which starts to generate

- "stateless" = it keeps no memory of before; it only sees what is in this request

[click] **③ The answer comes back** — and only NOW it appears, on the left

- ★ the answer was never sitting there in advance — the model made it and returned it. turn one done.

[click] **④ Turn two** — now as one full cycle

- the previous answer is back inside the request, as HISTORY — shown dimmed, because we sent it before
- the only NEW line is the fresh question (highlighted)
- sweep, pass, generate, answer returns — the token counter goes up
- the "memory" we feel in ChatGPT is a trick: the app re-sends the whole chat each time; the model itself starts fresh every call

[click] **⑤ Turn three** — same again

- everything before is re-sent (dimmed); one new line added
- ★ we pay for the WHOLE history on every single turn — a long chat keeps getting slower and more expensive

[click] **⑥ The mental model**

- there is no session on the server — the model remembers nothing
- the client carries ALL the state in the request body, every call
- good news for us: we have built on stateless endpoints for years — exact same shape
- and it is great for scaling: any server can handle any request, because nothing is stored between calls

▶ **OUT** · same truth, but let me show it a second way so the waste is impossible to miss → filmstrip.
-->


---
layout: default
clicks: 3
---

<!-- STATELESS REPLAY · take 2 — filmstrip of envelopes (same idea, seen at a glance) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Seen another way</div>
    <h2>Each call re-contains <span class="grad-warm">all</span> of the last one</h2>
  </div>
  <StatelessReplayFilmstrip />
</div>

<!--
◀ **IN** · same truth as before, but now all turns side by side, so the repeat is impossible to miss.

**SET-UP** (first envelope on screen)

- three request envelopes, next to each other
- turn one: the first envelope is sent — system prompt + one question
- note: the answer is NOT in the body yet, because the model has not made it

[click] **① Turn two** — the second envelope contains ALL of the first

- the earlier question AND its answer come back, dimmed (sent before)
- plus exactly one new line, highlighted: the fresh question
- the grey "replayed" block just got bigger

[click] **② Turn three** — again

- the grey block grows once more, one new highlighted line, the token bar climbs

[click] **③ The takeaway** — every call ships everything from the last call, plus a little more

- ★ the picture says it all: no memory on the model side; the request carries the whole past, every time
- this is exactly a stateless REST API where the client must send full state every time — many of us have built this

▶ **OUT** · so the request grows every turn — which raises one hard question: how much can fit in ONE call? → the context window.
-->



---
layout: default
clicks: 5
---

<!-- CONTEXT WINDOW — closes Part 2 and bridges into agents.
     Follows the stateless cluster: we resend everything every call,
     so how much fits in ONE call? A fixed window — and when it's full,
     the app compresses or offloads. (The AgentContextWindow slide in
     Part 3 reuses these exact mechanics with tool output.) -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">What fits in one call</div>
    <h2>The context window — one <span class="grad-warm">fixed</span> space for everything</h2>
  </div>
  <ContextWindow />
</div>

<!--
◀ **IN** · we resend the whole conversation every call — so how big can that get? there is a hard limit.

🧭 **SPINE** · last idea of part 2, and the bridge into agents. We meet this same window again in part 3 — but an agent fills it far faster.

**SET-UP** (a few BLUE cells already on screen)

- there is a hard limit on the request size: the context window
- one fixed space — and it matters not only HOW MUCH fits, but WHAT is in it
- ★ point up front: even before we type, the window is not empty — the rules (the system prompt, blue) sit at the front and stay there for every call
- legend: each type of content has a colour and a live token count

[click] **① Our first question goes in** — GREEN, the current turn

- small, just a few hundred tokens

[click] **② The conversation grows** — each turn is added to history (GOLD)

- the window starts to fill

[click] **③ More turns** — history keeps stacking

- watch the free (faint) space get smaller

[click] **④ Full** — there is no room left for the next turn

- the window cannot just grow; the limit is fixed. so what happens?

[click] **⑤ The app acts** — it COMPRESSES the oldest turns into a short summary (striped cells)

- or it starts a fresh session
- room reopens, the system prompt stays pinned, the conversation continues
- ★ the model never sees the old raw turns again — only the summary
- so it does not silently forget — WE, or the framework, decide what to keep; this same choice becomes "memory" for agents in part 3
- for scale: early models held a few thousand tokens; modern ones hold hundreds of thousands — a whole book — but it is still a fixed wall, and a fuller window is slower and costs more

▶ **OUT** · that is the model, fully open: it predicts well, but forgets, and fits in a fixed window. Time to be honest about what that means it CANNOT do → "looks like reasoning…".
-->


---
layout: default
---

<!-- WHAT CHANGED — Archetype A claim over the rocket-launch photo.
     Closes Part 2: having seen the mechanism end to end (tokens → attention →
     stateless → window), we name the payoff — and bridge into Part 3, where
     we get honest about the limits and start building around the model. -->

<Hero bg="prediction-at-scale.jpg" kicker="What changed" align="center" size="sm">
  Prediction at scale started to look like <span class="grad-warm">reasoning…</span>
</Hero>

<!--
◀ **IN** · we have seen the full mechanism. Now the payoff line — what all that prediction adds up to.

**SET-UP** (one line over the rocket photo)

- the whole magic trick in one sentence: prediction at scale starts to look like reasoning
- train a model to predict the next word across the entire internet
- to get good at that, it must absorb grammar, facts, style — even patterns of reasoning
- so "predict the next word" quietly becomes "answer the question"
- this is the honest reason it feels intelligent: reasoning is just a very useful pattern for predicting good text
- ★ this is the model at its best, and it is genuinely powerful — keep the tone positive, pause, let the "…" hang (we praise first, THEN get critical)

▶ **OUT** · …but there is a "but". Strip away the magic and one hard limit remains → "but look closer".
-->


---
layout: default
---

<!-- THE "BUT" — the turn. Pairs with the "…reasoning…" hero just before (its
     ellipsis hangs; this one answers it). One sentence, no subtitle. Deflates
     the hype and sets up the limits slide that follows. Over a heavier/darker
     photo than the rocket (the mood shifts from liftoff to "look closer"). -->

<Hero bg="but-limits.jpg" kicker="…but look closer" align="center" size="sm">
  But it only ever <span class="grad-warm">guesses</span> — over what it saw months ago.
</Hero>

<!--
◀ **IN** · the "…" from the last slide hangs in the air. This is the "but" that answers it.

**SET-UP** (one line over the darker photo)

- for all that power, strip it back to the mechanism: it never stopped doing ONE thing — guessing the next token
- and it guesses over a snapshot of the public internet, frozen months before we typed
- ★ it can sound like it reasons, but it cannot KNOW anything we did not put in front of it
- the mood shifts here — from liftoff to "look closer"; slow down
- "frozen months ago" is real: ask about last week and it cannot know — that was not in the training data
- this is not a flaw to fix; it is just what the mechanism IS — which is why the fix later is to feed it facts, not to blame the model

▶ **OUT** · let me make that concrete — three blind spots, all from the same cause → the limits.
-->


---
layout: default
clicks: 2
---

<!-- THE LIMITS — the flip side of "predict the next token", made GENERIC (no
     order-status demo). Three structural limits as cards — only public · frozen
     in the past · guesses, never checks. Pays off the predictor + the
     frozen-weights beat and the "…but it only guesses" hero just before. The
     slide is a SUPPORT (icon + title + one-word consequence per card); the
     explanation lives in the notes below. See Hallucination.vue.
     NB: header comment AFTER the frontmatter (a comment before the first `---`
     renders as a stray blank slide). -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">The flip side of prediction</div>
    <h2>It sounds certain — and can’t know <span class="grad-warm">our</span> facts</h2>
  </div>
  <Hallucination />
</div>

<!--
◀ **IN** · "it only guesses, over old public data" — here is what that costs us, three ways at once.

🧭 **SPINE** · these three limits are the PROBLEM. The next slide (grounding) is the FIX, and the fix opens the door to part 3 (tools).

**SET-UP** (card 1 lit, cards 2–3 dim)

- everything powerful about the model comes from one mechanism — and that mechanism has three blind spots
- **① Only public knowledge** — it learned from the public internet
- it has never seen our systems, our docs, our customers — blind to our data by design

[click] **② Frozen in the past**

- the weights were fixed at a training cutoff date
- nothing after that exists for it — no "today", no live state, no order that changed this morning

[click] **③ Guesses, never checks** (the famous one)

- when it does not know, it does not stop — it still produces the most likely-sounding words
- fluent is NOT the same as true — this is "hallucination"
- ★ it is not a bug we can patch out; it is exactly what next-token prediction DOES
- it is not "lying" — it has no idea it is wrong; for it, a true fact and a smooth guess look the same, and it sounds equally sure both times
- concrete example: ask for our internal order status and it will happily invent a plausible date — because it has never seen our data

▶ **OUT** · these are not three problems — they are ONE: a frozen, public model that can only predict, so it cannot go and check. So we don't change the model — we feed it the facts → grounding.
-->


---
layout: default
clicks: 2
---

<!-- GROUNDING — the answer to hallucination + the on-ramp to tools (Part 3).
     Two places knowledge can live → change one: the WEIGHTS (re-train / fine-
     tune — costly, and fine-tune is for behaviour not facts) or the CONTEXT
     (feed facts in at call time — RAG for static docs, tool calls for live
     data). The live-data branch bridges straight into Part 3. -->

<div class="demo-stage">
  <div class="demo-head">
    <div class="kicker">Make it accurate</div>
    <h2>Grounding — put the right <span class="grad-warm">facts</span> in front of it</h2>
  </div>
  <Grounding />
</div>

<!--
◀ **IN** · the root cause is a frozen, public model. So to fix accuracy, we change what it KNOWS.

🧭 **SPINE** · this is the fix for the three limits — and Path B (context → tools) is the on-ramp to all of part 3.

**SET-UP** (both paths on screen)

- its knowledge lives in exactly TWO places — so we change one of them
- both paths are valid; they just solve different jobs

[click] **① Path A — change the WEIGHTS** (teach the model itself)

- **Re-train**: build or adapt the model on our data — costly, rare; right when we truly need deep domain skill
- **Fine-tune**: cheaper — keep training on examples to fix tone, format, the way it does a task
- great for HOW it responds; weak for FACTS — it cannot cite a source, and it goes stale when our data changes
- so: weights are the lever for SKILLS and BEHAVIOUR

[click] **② Path B — change the CONTEXT** (weights stay frozen)

- hand the model the right facts at call time, inside the window
- **RAG**: fetch our private docs/policies and paste them in — best for large, static text (a policy PDF)
- **Tool calls**: the model asks our code to call a live API for fresh, authoritative data (today's order status)
- ★ this is the lever for FACTS — especially facts that change
- simple rule to remember: need a new SKILL → train the weights; need new FACTS → change the context. most business problems are facts, so most of the time the answer is context, not training
- honest caveat: grounding strongly REDUCES hallucination on the facts we give it — never to zero, because the model can still misread what we hand it

▶ **OUT** · "weights teach skills, context carries facts." Our limits are about facts that change → the lever is a tool call. That is the whole of part three → agents.
-->

