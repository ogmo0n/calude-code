import { pickOne, type Rng } from './text.js';

export type GagId = 'disco' | 'shutdown' | 'spellingBee' | 'caludeCode' | 'install' | 'didYouMean' | 'jackpot';

export const NORMAL_GAGS: readonly GagId[] = ['disco', 'shutdown', 'spellingBee', 'caludeCode', 'install', 'didYouMean'];

export function pickGag(lastGag: GagId | null, rng: Rng, jackpotOdds: number): GagId {
  if (rng() < jackpotOdds) return 'jackpot';
  return pickOne(NORMAL_GAGS.filter((g) => g !== lastGag), rng);
}

// Index of the next handoff batch, never the same as last time.
export function pickHandoff(last: number | null, total: number, rng: Rng): number {
  const options = [...Array(total).keys()].filter((i) => i !== last);
  return pickOne(options.length ? options : [0], rng);
}

// CALUDE_HANDOFF=<name> forces a specific batch, for testing.
export function forcedHandoff(name: string | undefined, names: readonly string[]): number | null {
  const i = name ? names.indexOf(name) : -1;
  return i >= 0 ? i : null;
}
