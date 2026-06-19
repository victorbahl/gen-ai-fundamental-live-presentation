/**
 * Battle configuration — questions, answer key, and the shared singleton engine.
 *
 * The answer key (`correct`) lives HERE, in the deck bundle only. It is never
 * sent to phones (useBattle strips it before broadcasting). Edit the questions
 * below to change the battle.
 *
 * wsUrl: the public AnyCable URL the audience's phones connect to.
 *
 * groupId (the "room"): resolved at runtime by `battleGroupId()`:
 *   - `?groupId=<id>` in the deck URL  → that exact room (share the link to rejoin it).
 *   - otherwise                        → a FRESH random room, generated once and kept
 *     stable for this browser session, so every rehearsal/run starts clean automatically
 *     and never collides with a previous run's scores.
 * The lobby bakes whatever we resolve into the phone join URL, so phones always
 * land in the same room as the deck — no manual sync.
 */
import { useBattle, type BattleQuestion } from "./useBattle";

export const BATTLE_WS_URL = "wss://vb-cable-4vsc.fly.dev/cable";

// SSR placeholder (slidev build runs this in Node, where there's no window and
// nothing actually connects). The real room is resolved in the browser below.
const SSR_GROUP_ID = "genai-battle";
const ROOM_KEY = "battle-room-id";

let _groupId: string | null = null;

function freshRoom(): string {
  // Browser-only (guarded by the caller). crypto.randomUUID needs a secure
  // context — Netlify is HTTPS, localhost counts too. Fall back defensively.
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return "room-" + crypto.randomUUID().slice(0, 8);
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const a = new Uint32Array(2);
      crypto.getRandomValues(a);
      return "room-" + a[0].toString(36) + a[1].toString(36);
    }
  } catch { /* fall through */ }
  return SSR_GROUP_ID;
}

/**
 * The active battle room. Cached after first resolution so the deck and the QR
 * always agree, and slide navigation never switches rooms mid-game.
 */
export function battleGroupId(): string {
  if (_groupId) return _groupId;
  if (typeof window === "undefined") return SSR_GROUP_ID; // build/SSR

  const forced = new URLSearchParams(window.location.search).get("groupId");
  if (forced) { _groupId = forced; return _groupId; }

  try {
    const stored = sessionStorage.getItem(ROOM_KEY);
    if (stored) { _groupId = stored; return _groupId; }
  } catch { /* private mode — fall through to a non-persisted room */ }

  const room = freshRoom();
  try { sessionStorage.setItem(ROOM_KEY, room); } catch { /* ignore */ }
  _groupId = room;
  return _groupId;
}

export const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    quizId: "b1",
    question: "What does an LLM actually produce at each step?",
    seconds: 20,
    options: [
      { label: "A", text: "The single true answer" },
      { label: "B", text: "A ranked guess for the next token" },
      { label: "C", text: "A database lookup" },
      { label: "D", text: "A compiled program" },
    ],
    correct: "B",
  },
  {
    quizId: "b2",
    question: "Why can't a base model tell you our live order status?",
    seconds: 20,
    options: [
      { label: "A", text: "It's too slow" },
      { label: "B", text: "Its knowledge is frozen & private data isn't in it" },
      { label: "C", text: "It forgot" },
      { label: "D", text: "It needs more GPUs" },
    ],
    correct: "B",
  },
  {
    quizId: "b3",
    question: "In the agent loop, who decides the next step?",
    seconds: 20,
    options: [
      { label: "A", text: "We hard-code every step" },
      { label: "B", text: "The model, from what it just observed" },
      { label: "C", text: "A random scheduler" },
      { label: "D", text: "The end user, each turn" },
    ],
    correct: "B",
  },
  {
    quizId: "b4",
    question: "What does MCP standardize?",
    seconds: 20,
    options: [
      { label: "A", text: "A new model architecture" },
      { label: "B", text: "How an AI app discovers & calls tools over HTTP" },
      { label: "C", text: "A faster GPU protocol" },
      { label: "D", text: "A prompt-writing style" },
    ],
    correct: "B",
  },
  {
    quizId: "b5",
    question: "Grounding fixes hallucination by changing…",
    seconds: 20,
    options: [
      { label: "A", text: "The model's weights, every time" },
      { label: "B", text: "The context we feed it (facts/tools)" },
      { label: "C", text: "The temperature to 0" },
      { label: "D", text: "Nothing — it's unavoidable" },
    ],
    correct: "B",
  },
];

// ---- shared singleton ----------------------------------------------------
// All battle slides import this so they drive ONE engine + one WebSocket.
let _engine: ReturnType<typeof useBattle> | null = null;

export function battle() {
  if (!_engine) {
    _engine = useBattle({
      wsUrl: BATTLE_WS_URL,
      groupId: battleGroupId(),
      questions: BATTLE_QUESTIONS,
    });
    _engine.connect();
  }
  return _engine;
}
