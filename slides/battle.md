---
layout: default
class: battle-slide
---

<!--
AI BATTLE — live, named, scored Kahoot-style competition.
Custom-built on the AnyCable + Netlify infra (components/battle/ + netlify/functions/battle-*).
NOT the poll addon: this one has names, hides the distribution, scores by speed, crowns a top 3.

Flow: lobby → Q1–Q6 → HALFTIME leaderboard → Q7–Q11 → final podium (3 clicks).
Questions + answer key live in components/battle/battleConfig.ts (host-only, never sent to phones).
Q1 is a light Game-of-Thrones icebreaker; Q2–Q11 cover the deck concepts.

PRESENTER:
- Land here → players scan the QR and type a name; watch the chips fill in.
- Use the "Skip battle" button (bottom-right) to jump past the battle entirely if time is short.
- Advance to Q1. Each question: arrive = answers open → click = REVEAL (which also closes scoring).
- After Q6, the halftime leaderboard shows automatically (no clicks) — let the room react, then advance.
- After Q11, the final podium reveals 3rd → 2nd → 1st by click. Phones show each player their final rank.
- Use a FRESH groupId (battleConfig.ts) per real run so scores start clean.
-->

<BattleLobby />

---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="0" />

<!--
Q1 — pure icebreaker, no AI. Just warm the room up.
- ✅ **B — Ygritte.** The wildling who keeps telling Jon "You know nothing, Jon Snow."
- A Daenerys, C Arya — real GoT characters, wrong line.
- D Lila Dorato — not in the show… she's our boss. (Anyone who picked her, well played.)
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="1" />

<!--
Q2 — the Transformer (2017, "Attention Is All You Need"). Bridges to the AttentionFlip slide.
- ✅ **A — it weighs every word against all the others at once.** That is "self-attention": the model looks at the whole sentence in parallel and decides which words matter for each word. Older RNNs read one word at a time and forgot long-range links.
- B — true of machine learning in general, but that shift (rules → learning from data) is decades older. Not what the Transformer added.
- C — wrong: GPU training existed before 2017.
- D — wrong: the Transformer is an architecture, not "more memorised facts." Bigger fact-recall comes from scale, not from this design.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="2" />

<!--
Q3 — word meaning = embeddings. Bridges to the NextTokenPredictor ("each token's meaning is a list of numbers").
- ✅ **D — a mathematical vector in a high-dimensional space, where similar concepts sit close together.** Every token becomes a long list of numbers (an embedding). "King" and "queen" land near each other; "banana" lands far away. Distance = similarity of meaning. This is how the model does math on language.
- A — wrong: it is not a pointer to one other word; meaning is spread across hundreds of numbers.
- B — wrong: the model does not store the sentences; it learned patterns from them, then threw the text away.
- C — wrong: there is no built-in dictionary; nothing is looked up.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="3" />

<!--
Q4 — temperature. Pure oral nugget (temperature is in the predictor notes, not on a slide).
- ✅ **A — almost identical each time, always taking the likeliest token.** Temperature controls how much randomness we add when picking the next token. Near zero = always pick the top-ranked token = same answer every time (deterministic, "boring but stable"). High = more variety, more creative, less predictable.
- B — the trap: low temperature does NOT make it "more accurate" or "switch off guessing." It still predicts; it just always picks its own favourite guess. A confident wrong answer is still wrong.
- C — wrong: low temperature is less repetitive across runs, not more.
- D — wrong: temperature is about which token it picks, not speed.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="4" />

<!--
Q5 — RAG. Bridges to the Grounding slide (Path B = change the context, not the weights).
- ✅ **C — fetch the passages relevant to the question into the prompt.** That is RAG: for each question we retrieve only the few relevant chunks and put them in the context. The model stays frozen; we feed it the right facts at the right moment. Best fit for a large, slowly-changing doc set.
- A — fine-tuning is for tone and behaviour, not facts: it can't cite a source, and it goes stale the moment the docs change.
- B — a bigger model still won't know OUR private docs; size doesn't add our data.
- D — pasting every document each time blows past the context window and costs a fortune. Retrieve the relevant slice, don't dump everything.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="5" />

<!--
Q6 — the stateless truth. Bridges to the StatelessReplay slides.
- ✅ **A — the app resends the full conversation history with every new request.** The model has no memory. The "memory" of a chat is an illusion: the app stores the history and resends all of it on every turn. No history in the prompt = no memory.
- B — wrong: there is no "session buffer" inside the model; weights are frozen, inference is stateless.
- C — wrong: the model never writes to any long-term memory of its own.
- D — wrong: there is no persistent connection streaming state between turns; each call is independent.
-->


---
layout: default
class: battle-slide
---

<BattleMidLeaderboard />

<!--
HALFTIME — intermediate standings after 6 rounds.
Let the room react, tease the second half. No clicks needed.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="6" />

<!--
Q7 — hallucination. Bridges to the Hallucination slide ("guesses — never checks").
- ✅ **B — it predicts likely text but has no way to verify it.** This is the ROOT cause. The model only predicts the next likely token; it has no step where it verifies anything against the real world. So it can produce something that sounds perfect and is simply wrong — confidently. The question says "even on a short, simple prompt" — that rules out context-overflow explanations.
- A — sometimes true (bad training data repeats), but that's a specific case, not the fundamental reason. It hallucinates even on things that were never in its data.
- C — wrong: forgetting the start of the conversation (context overflow) is a separate issue, and the question explicitly says "even on a short, simple prompt".
- D — wrong: temperature affects variety, not factual accuracy; hallucination happens at any temperature.
- THE BRIDGE: because it can't check, we don't fix the model — we give it a way to check: grounding (RAG) and tools.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="7" />

<!--
Q8 — what makes an agent. Bridges to the AgentRuntime slide ("a model in a loop toward a goal").
- ✅ **D — it pursues a goal through its own repeated steps.** A chatbot answers once; a human drives the next move. An agent runs a loop: think → act → observe → decide the next step itself, until the goal is met. The autonomous loop is the line between chat and agent.
- A — wrong: an agent usually uses the SAME model as the chatbot; bigger model ≠ agent.
- B — wrong: fine-tuning is not what makes it agentic.
- C — the trap: cross-session memory is nice-to-have, but it's not the defining trait. An agent is defined by the goal-seeking loop, not by long-term memory.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="8" />

<!--
Q9 — tool use = the trust boundary. Bridges to the ToolRoundtrip slide ("the model asks, we execute").
- ✅ **B — the model asks for a call, our code runs it.** The model only outputs text: a request that says "call get_order_status with id 7788." Our code reads that, makes the real API call, and feeds the result back. The model never touches our systems.
- A — wrong, and this is the key safety point: the model does NOT open connections or call anything itself. It can't.
- C — wrong: we don't hand the model credentials; the auth lives on OUR side of the boundary, in our code/gateway.
- D — wrong: tools are not baked into the weights; they're described to the model at request time, and can change anytime.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="9" />

<!--
Q10 — MCP. Bridges to the McpEnvelope / McpHandshake slides ("a standard API any AI app can consume").
- ✅ **A — a shared standard for discovering and calling tools.** MCP is just an open protocol: a common way for any AI app to list the tools a server offers and then call them. Over plain HTTP, same auth, same JSON — only the body shape is standardised.
- B — wrong: MCP is not a model or an architecture; the model is untouched.
- C — wrong: it does NOT replace HTTP; it rides on top of HTTP, so all our gateway policies still apply.
- D — wrong: MCP doesn't pick the tool — the model decides which tool; MCP is how that call is described and transported.
-->


---
layout: default
class: battle-slide
clicks: 1
---

<BattleQuestion :index="10" />

<!--
Q11 — agent-to-agent handoff. (No dedicated slide — A2A was cut; this is oral only.)
- ✅ **D — checking what the other agent offers, then assigning work.** Before delegating, an agent discovers the other's capabilities (what tasks it can do), then hands over a scoped task — much like discovering tools before calling them.
- A — wrong: agents don't copy each other's weights; they don't share models.
- B — partly plausible but too naive: it's not just forwarding the raw prompt; it scopes a task to the other's advertised skills.
- C — wrong: they stay separate agents; nothing merges into one bigger model.
-->


---
layout: default
class: battle-slide
clicks: 3
---

<BattleLeaderboard />
