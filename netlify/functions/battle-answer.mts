import { broadcastTo, jsonResponse, handle, AnswerSchema, answersStream } from "./battle-shared.mts";

// A phone submits an answer. We relay it to the answers stream; the host (deck)
// holds the answer key and does all scoring — the phone never learns whether it
// was right, and no distribution is exposed. Scoring is fixed-points (no timer),
// so no timestamp is needed.
export default handle(AnswerSchema, async ({ sessionId, name, quizId, answer, groupId }) => {
  try {
    await broadcastTo(answersStream(groupId), {
      sessionId,
      name,
      quizId,
      answer,
    });
  } catch (err) {
    console.error("[battle-answer] broadcast failed:", err);
    return jsonResponse({ error: "Broadcast failed" }, 502);
  }
  return jsonResponse({ ok: true });
});
