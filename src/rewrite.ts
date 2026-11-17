import copy from './copy.js';
import { fill, pickOne, pickWord, type Rng } from './text.js';

// Appended by code, not copy, so a future joke edit can never send real claude something destructive.
export const FORWARD_GUARD = 'Answer in text only. Do not read, create, edit, or run anything.';

export interface Rewrite {
  display: string;
  forwarded: string;
}

export function rewriteRequest(request: string, rng: Rng): Rewrite | null {
  const trimmed = request.trim();
  if (!trimmed) return null;
  const vars = { request: trimmed, word: pickWord(trimmed) };
  return {
    display: fill(pickOne(copy.displayRewrites, rng), vars),
    forwarded: `${fill(pickOne(copy.forwardRewrites, rng), vars)} ${FORWARD_GUARD}`,
  };
}
