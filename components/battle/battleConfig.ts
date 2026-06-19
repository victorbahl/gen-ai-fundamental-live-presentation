/**
 * Battle configuration — questions, answer key, and the shared singleton engine.
 *
 * The answer key (`correct`) lives HERE, in the deck bundle only. It is never
 * sent to phones (useBattle strips it before broadcasting). Edit the questions
 * below to change the battle.
 *
 * wsUrl/groupId: the WebSocket URL is the same public AnyCable URL the poll uses.
 * Use a DISTINCT groupId from the poll so the two never cross-talk, and bump it
 * (e.g. genai-battle-2) for a clean room when rehearsing.
 */
import { useBattle, type BattleQuestion } from "./useBattle";

export const BATTLE_WS_URL = "wss://vb-cable-4vsc.fly.dev/cable";
export const BATTLE_GROUP_ID = "genai-battle";

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
      groupId: BATTLE_GROUP_ID,
      questions: BATTLE_QUESTIONS,
    });
    _engine.connect();
  }
  return _engine;
}
