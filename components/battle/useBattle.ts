/**
 * Live BATTLE engine (Kahoot-style), host-side.
 *
 * The DECK is the authority: it holds the answer key + per-player scores, and
 * is the only place that knows who's right. Phones (public/battle.html) only
 * ever receive: the question (text + options, NO correct flag), live "answered"
 * counts, and their OWN rank/score. The answer distribution is never exposed.
 *
 * Transport reuses the AnyCable infra already wired for the poll addon:
 *   - listen:    battle:<group>:players , battle:<group>:answers   (createCable.streamFrom)
 *   - broadcast: battle:<group>:state                              (battle-state function)
 *
 * Phases: lobby → question → reveal → (next question…) → final
 * Scoring: deliberately SIMPLE + bulletproof — correct = POINTS (fixed), wrong = 0.
 * No timer, no speed bonus, no cross-device clock dependency.
 *
 * SYNC RELIABILITY: state is pushed immediately on every change AND re-broadcast
 * on a heartbeat (every HEARTBEAT_MS). The heartbeat means a phone that missed a
 * single broadcast (signal blip, backgrounded tab, late join, reconnect) catches
 * up within ~2s instead of being stuck until the next change — and the steady
 * traffic keeps the Netlify function warm, killing cold-start lag.
 */
import { reactive, readonly } from "vue";
import { createCable } from "@anycable/web";

export interface BattleOption { label: string; text: string }
export interface BattleQuestion {
  quizId: string;
  question: string;
  options: BattleOption[];
  correct: string;      // option label — host-only, never sent to phones
}
export interface Player {
  sessionId: string;
  name: string;
  score: number;
  lastDelta: number;    // points won on the most recent question (POINTS or 0)
  answeredQuiz: string | null;
  correctLast: boolean;
}

const POINTS = 10;            // points for a correct answer (fixed — no speed bonus)
const HEARTBEAT_MS = 2000;    // re-broadcast current state this often (resync safety net)

type Phase = "lobby" | "question" | "reveal" | "final";

export function useBattle(opts: {
  wsUrl: string;
  groupId: string;
  questions: BattleQuestion[];
}) {
  const state = reactive({
    phase: "lobby" as Phase,
    qIndex: -1,
    players: new Map<string, Player>(),
    answeredCount: 0,
    connected: false,
    finalRevealed: false,   // in `final`, has the host revealed the podium yet?
  });

  const answer = opts.questions; // alias for brevity
  let cable: ReturnType<typeof createCable> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  // ---- connect & listen ---------------------------------------------------
  function connect() {
    if (cable) return;
    cable = createCable(opts.wsUrl, { protocol: "actioncable-v1-ext-json" });

    const players = cable.streamFrom(`battle:${opts.groupId}:players`);
    players.on("message", (m: any) => {
      if (!m?.sessionId || !m?.name) return;
      const ex = state.players.get(m.sessionId);
      if (ex) { ex.name = m.name; }
      else {
        state.players.set(m.sessionId, {
          sessionId: m.sessionId, name: m.name, score: 0,
          lastDelta: 0, answeredQuiz: null, correctLast: false,
        });
      }
      pushState();
    });

    const answers = cable.streamFrom(`battle:${opts.groupId}:answers`);
    answers.on("message", (m: any) => handleAnswer(m));

    state.connected = true;

    // Heartbeat: re-broadcast the current state on an interval so phones that
    // missed a one-shot push self-heal, late joiners/reconnects sync, and the
    // serverless function stays warm. Idempotent — phones just re-render the
    // same state. Guarded so we never stack intervals on re-connect.
    if (!heartbeat) heartbeat = setInterval(() => { pushState(); }, HEARTBEAT_MS);
  }

  function disconnect() {
    if (heartbeat) { clearInterval(heartbeat); heartbeat = null; }
    try { cable?.disconnect(); } catch { /* ignore */ }
    cable = null;
    state.connected = false;
  }

  // ---- scoring ------------------------------------------------------------
  function currentQ(): BattleQuestion | null {
    return state.qIndex >= 0 && state.qIndex < answer.length ? answer[state.qIndex] : null;
  }

  function handleAnswer(m: any) {
    const q = currentQ();
    if (!q || state.phase !== "question") return;             // only score during the open window
    if (!m?.sessionId || !m?.quizId || !m?.answer) return;
    if (m.quizId !== q.quizId) return;

    // Register late-joiners who answered before the host saw their join.
    let p = state.players.get(m.sessionId);
    if (!p) {
      p = { sessionId: m.sessionId, name: m.name || "Player", score: 0,
            lastDelta: 0, answeredQuiz: null, correctLast: false };
      state.players.set(m.sessionId, p);
    }
    if (p.answeredQuiz === q.quizId) return;                   // one answer per question

    p.answeredQuiz = q.quizId;
    const correct = String(m.answer) === String(q.correct);
    p.correctLast = correct;
    p.lastDelta = correct ? POINTS : 0;                        // fixed points, no speed bonus
    p.score += p.lastDelta;
    state.answeredCount += 1;
    pushState();
  }

  // ---- leaderboard --------------------------------------------------------
  function leaderboard(): Player[] {
    return [...state.players.values()].sort((a, b) => b.score - a.score);
  }
  function ranked() {
    const lb = leaderboard();
    const ranks = new Map<string, number>();
    lb.forEach((p, i) => ranks.set(p.sessionId, i + 1));
    return { lb, ranks };
  }

  // ---- broadcast state to phones -----------------------------------------
  // What each phone receives. Critically: the question carries text + options
  // ONLY (no `correct`), and we attach the per-player roster with score+rank so
  // a phone can find itself. We never send the answer distribution.
  async function pushState() {
    const q = currentQ();
    const { lb, ranks } = ranked();
    const roster = lb.map((p) => ({
      sessionId: p.sessionId, name: p.name, score: p.score, rank: ranks.get(p.sessionId),
    }));
    const payload: any = {
      phase: state.phase,
      playerCount: state.players.size,
      answeredCount: state.answeredCount,
      players: roster,
    };
    if (q && state.phase === "question") {
      payload.question = {
        quizId: q.quizId,
        question: q.question,
        options: q.options.map((o) => ({ label: o.label, text: o.text })),
      };
    }
    if (state.phase === "final") {
      payload.revealed = state.finalRevealed;
      if (state.finalRevealed) {
        // host has revealed the podium on screen → phones may show standings.
        payload.leaderboard = roster.slice(0, 10);
      } else {
        // SPOILER GUARD: before the on-screen reveal, send NO standings and
        // STRIP ranks from the roster, so no phone can learn it won (or its
        // final position) before the audience sees it on the big screen.
        payload.players = roster.map((p) => ({
          sessionId: p.sessionId, name: p.name, score: p.score,
        }));
      }
    }
    try {
      await fetch("/.netlify/functions/battle-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: opts.groupId, state: payload }),
      });
    } catch (e) {
      // best-effort; the deck UI is still correct from local state
      console.warn("[battle] pushState failed", e);
    }
  }

  // ---- host controls (driven by the slide) --------------------------------
  function toLobby() { state.phase = "lobby"; pushState(); }

  function startQuestion(index: number) {
    state.qIndex = index;
    state.phase = "question";
    state.answeredCount = 0;
    // reset per-question marks
    for (const p of state.players.values()) { p.answeredQuiz = null; p.lastDelta = 0; p.correctLast = false; }
    pushState();
  }
  function reveal() { state.phase = "reveal"; pushState(); }
  // `final(revealed)` — revealed=false on arrival (phones held on a teaser, no
  // ranks), flips to true once the host reveals 1st place on screen (c>=3).
  function final(revealed = false) { state.phase = "final"; state.finalRevealed = revealed; pushState(); }

  return {
    state: readonly(state),
    connect,
    disconnect,
    connected: () => state.connected,
    players: () => [...state.players.values()],
    leaderboard,
    currentQ,
    // controls
    toLobby, startQuestion, reveal, final,
  };
}
