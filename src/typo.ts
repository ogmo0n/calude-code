import copy from './copy.js';
import { pickOne, type Rng } from './text.js';

// Every misspelling Calude answers to. The launcher shims set CALUDE_TYPO to the name you typed.
export const TYPOS = ['calude', 'cluade'] as const;
export type Typo = (typeof TYPOS)[number];

export function typoOf(name: string | undefined): Typo {
  return TYPOS.find((t) => t === name) ?? 'calude';
}

export function typoLine(typo: Typo, rng: Rng): string {
  return pickOne(copy.typos[typo], rng);
}
