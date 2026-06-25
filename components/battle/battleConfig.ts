/**
 * Battle configuration — questions, answer key, and the shared singleton engine.
 *
 * The answer key (`correct`) lives HERE, in the deck bundle only. It is never
 * sent to phones (useBattle strips it before broadcasting). Edit the questions
 * below to change the battle.
 *
 * wsUrl: the public AnyCable URL the audience's phones connect to.
 *
 * groupId (the "room"): resolved at runtime by `battleGroupId()`. The URL is the
 * single source of truth:
 *   - `?groupId=<id>` present in the deck URL → that exact room.
 *   - absent → generate a FRESH random room AND write it into the URL (so it's
 *     visible + shareable, and survives a page RELOAD because the query string
 *     stays). The deck is the only place a room is minted; phones always read
 *     their room from the QR/URL, never generate one.
 * The lobby bakes whatever we resolve into the phone join URL, so phones always
 * land in the same room as the deck — no manual sync.
 */
import { useBattle, type BattleQuestion } from "./useBattle";

export const BATTLE_WS_URL = "wss://vb-cable-4vsc.fly.dev/cable";

// SSR placeholder (slidev build runs this in Node, where there's no window and
// nothing actually connects). The real room is resolved in the browser below.
const SSR_GROUP_ID = "genai-battle";

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
 *
 * URL is authoritative: a present `?groupId` wins; if absent we MINT one (cached
 * in-memory). The lobby is responsible for writing a freshly-minted id back into
 * the deck URL — and it does so THROUGH vue-router (see BattleLobby), not raw
 * history, so Slidev's per-navigation query-preservation keeps it across slides
 * and a reload resurfaces the same room. Resolution here is side-effect-free.
 */
export function battleGroupId(): string {
  if (_groupId) return _groupId;
  if (typeof window === "undefined") return SSR_GROUP_ID; // build/SSR

  const forced = new URLSearchParams(window.location.search).get("groupId");
  if (forced) { _groupId = forced; return _groupId; }

  _groupId = freshRoom(); // minted now; the lobby reflects it into the URL
  return _groupId;
}

export const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    // Light icebreaker opener — no tech, just to warm the room up.
    quizId: "b0",
    question:
      "“You know nothing, Jon Snow.” — who keeps telling Jon this?",
    options: [
      { label: "A", text: "Daenerys Targaryen" },
      { label: "B", text: "Ygritte" },
      { label: "C", text: "Arya Stark" },
      { label: "D", text: "Lila Dorato" },
    ],
    correct: "B",
  },
  {
    quizId: "b1",
    question:
      "The 2017 “Transformer” behind today's LLMs improved on earlier models mainly by…",
    options: [
      { label: "A", text: "weighing every word against all the others at once, instead of one at a time" },
      { label: "B", text: "learning patterns from data instead of from hand-written rules" },
      { label: "C", text: "being the first architecture that could train on GPUs" },
      { label: "D", text: "memorising far more facts inside its parameters" },
    ],
    correct: "A",
  },
  {
    quizId: "b2",
    question: "Inside an LLM, the “meaning” of a word is represented as…",
    options: [
      { label: "A", text: "a pointer to the single closest matching word in its built-in vocabulary" },
      { label: "B", text: "a stored list of every sentence it saw that word appear in during training" },
      { label: "C", text: "a plain-language definition looked up from a dictionary built into the model" },
      { label: "D", text: "a mathematical vector in a high-dimensional space, where similar concepts sit close together" },
    ],
    correct: "D",
  },
  {
    quizId: "b3",
    question: "Lowering an LLM's “temperature” toward zero makes its replies…",
    options: [
      { label: "A", text: "almost identical each time, always taking the likeliest token" },
      { label: "B", text: "more accurate, since guessing is switched off" },
      { label: "C", text: "more repetitive, reusing its own earlier sentences" },
      { label: "D", text: "faster, by skipping the unlikely options" },
    ],
    correct: "A",
  },
  {
    quizId: "b4",
    question:
      "To answer reliably from a large, slowly-changing set of internal docs, you should…",
    options: [
      { label: "A", text: "fine-tune the model so it absorbs the documents" },
      { label: "B", text: "pick a larger model that already covers the material" },
      { label: "C", text: "fetch the passages relevant to the question into the prompt" },
      { label: "D", text: "paste every document into the system prompt each time" },
    ],
    correct: "C",
  },
  {
    quizId: "b5",
    question:
      "A chat assistant appears to “remember” earlier messages because…",
    options: [
      { label: "A", text: "the app resends the full conversation history with every new request" },
      { label: "B", text: "the model stores your conversation in an internal session buffer" },
      { label: "C", text: "the model writes each exchange into its own long-term memory" },
      { label: "D", text: "an open connection streams state from the model between turns" },
    ],
    correct: "A",
  },
  {
    quizId: "b6",
    question:
      "The fundamental reason an LLM can “hallucinate” — even on a short, simple prompt — is that…",
    options: [
      { label: "A", text: "its training data contained factual errors it memorised" },
      { label: "B", text: "it predicts likely text but has no way to verify it" },
      { label: "C", text: "it forgets the start of the conversation as the output grows" },
      { label: "D", text: "its temperature setting was left too high" },
    ],
    correct: "B",
  },
  {
    quizId: "b7",
    question: "What most distinguishes an AI “agent” from a single chatbot reply?",
    options: [
      { label: "A", text: "it runs on a larger, purpose-built model" },
      { label: "B", text: "it was fine-tuned for this particular task" },
      { label: "C", text: "it keeps memory across sessions, unlike a chatbot" },
      { label: "D", text: "it pursues a goal through its own repeated steps" },
    ],
    correct: "D",
  },
  {
    quizId: "b8",
    question: "When an LLM “uses a tool” such as an API, what actually happens?",
    options: [
      { label: "A", text: "the model opens the connection and calls the API itself" },
      { label: "B", text: "the model asks for a call, our code runs it" },
      { label: "C", text: "the model is handed temporary credentials for the call" },
      { label: "D", text: "the tool was trained into the model's weights" },
    ],
    correct: "B",
  },
  {
    quizId: "b9",
    question: "The Model Context Protocol (MCP) is best described as…",
    options: [
      { label: "A", text: "a shared standard for discovering and calling tools" },
      { label: "B", text: "a new model architecture optimised for using tools" },
      { label: "C", text: "a faster transport replacing HTTP for AI traffic" },
      { label: "D", text: "a prompt format that picks which tool to call" },
    ],
    correct: "A",
  },
  {
    quizId: "b10",
    question: "When one agent hands a task to another agent, it usually begins by…",
    options: [
      { label: "A", text: "sharing its model weights so the other can copy it" },
      { label: "B", text: "forwarding the user's raw prompt and awaiting a reply" },
      { label: "C", text: "merging the two agents into one larger model" },
      { label: "D", text: "checking what the other agent offers, then assigning work" },
    ],
    correct: "D",
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
