import { describe, expect, it } from 'vitest';
import copy from '../src/copy.js';
import { typoLine, typoOf } from '../src/typo.js';

describe('typoOf', () => {
  it('reads the launcher name', () => {
    expect(typoOf('cluade')).toBe('cluade');
    expect(typoOf('calude')).toBe('calude');
  });

  it('defaults to calude when missing or unknown', () => {
    expect(typoOf(undefined)).toBe('calude');
    expect(typoOf('clade')).toBe('calude');
  });
});

describe('typoLine', () => {
  it('roasts the specific typo', () => {
    expect(copy.typos.cluade).toContain(typoLine('cluade', () => 0));
    expect(copy.typos.calude).toContain(typoLine('calude', () => 0.99));
  });
});
