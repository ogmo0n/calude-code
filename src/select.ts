import { pickOne, type Rng } from './text.js';

export type GagId = 'disco' | 'shutdown' | 'spellingBee' | 'caludeCode' | 'install' | 'didYouMean' | 'jackpot';

export const NORMAL_GAGS: readonly GagId[] = ['disco', 'shutdown', 'spellingBee', 'caludeCode', 'install', 'didYouMean'];

export function pickGag(lastGag: GagId | null, rng: Rng, jackpotOdds: number): GagId {
  if (rng() < jackpotOdds) return 'jackpot';
  return pickOne(NORMAL_GAGS.filter((g) => g !== lastGag), rng);
}
