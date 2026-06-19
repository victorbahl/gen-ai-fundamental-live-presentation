/**
 * Shared utilities for the live BATTLE (named, scored Kahoot-style quiz).
 * Reuses the AnyCable broadcaster + handle()/jsonResponse() from shared.mts.
 *
 * Three streams per battle group:
 *   battle:<groupId>:players  — a phone joined (host listens → builds the roster)
 *   battle:<groupId>:answers  — a phone answered (host listens → scores it)
 *   battle:<groupId>:state    — host pushes current state (phones listen → render)
 */
import * as v from "valibot";

export { broadcastTo, jsonResponse, handle } from "./shared.mts";

const nonEmpty = v.pipe(v.string(), v.minLength(1));

export const JoinSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(24)),
  sessionId: nonEmpty,
  groupId: nonEmpty,
});

export const AnswerSchema = v.object({
  sessionId: nonEmpty,
  name: v.optional(v.string(), ""),
  quizId: nonEmpty,
  answer: nonEmpty,
  groupId: nonEmpty,
});

export const StateSchema = v.object({
  groupId: nonEmpty,
  state: v.any(),
});

export function playersStream(groupId: string): string {
  return `battle:${groupId}:players`;
}

export function answersStream(groupId: string): string {
  return `battle:${groupId}:answers`;
}

export function stateStream(groupId: string): string {
  return `battle:${groupId}:state`;
}
