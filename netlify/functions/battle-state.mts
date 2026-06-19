import { broadcastTo, jsonResponse, handle, StateSchema, stateStream } from "./battle-shared.mts";

// The host (deck) pushes the current battle state to every phone: which phase
// we're in (lobby / question / locked / leaderboard), the active question
// (text + options only — NEVER the correct answer), and each player's own
// rank/score. Phones render from this; they never see the answer distribution.
export default handle(StateSchema, async ({ groupId, state }) => {
  try {
    await broadcastTo(stateStream(groupId), state);
  } catch (err) {
    console.error("[battle-state] broadcast failed:", err);
    return jsonResponse({ error: "Broadcast failed" }, 502);
  }
  return jsonResponse({ ok: true });
});
