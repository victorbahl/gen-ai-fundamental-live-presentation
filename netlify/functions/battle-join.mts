import { broadcastTo, jsonResponse, handle, JoinSchema, playersStream } from "./battle-shared.mts";

// A phone joins the battle with a name. Broadcast to the players stream so the
// host (the deck) can add them to the roster.
export default handle(JoinSchema, async ({ name, sessionId, groupId }) => {
  try {
    await broadcastTo(playersStream(groupId), { name, sessionId });
  } catch (err) {
    console.error("[battle-join] broadcast failed:", err);
    return jsonResponse({ error: "Broadcast failed" }, 502);
  }
  return jsonResponse({ ok: true });
});
