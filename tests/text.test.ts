import { describe, expect, it } from 'vitest';
import { fill, pickOne, pickWord } from '../src/text.js';

describe('fill', () => {
  it('replaces known placeholders', () => {
    expect(fill('Typo #{count}', { count: 7 })).toBe('Typo #7');
  });
  it('leaves unknown placeholders alone', () => {
    expect(fill('{x}', {})).toBe('{x}');
  });
});

describe('pickOne', () => {
  it('maps rng 0.99 to the last item and 0 to the first', () => {
    expect(pickOne(['a', 'b', 'c'], () => 0.99)).toBe('c');
    expect(pickOne(['a', 'b', 'c'], () => 0)).toBe('a');
  });
});

describe('pickWord', () => {
  it('picks the longest non-stopword', () => {
    expect(pickWord('fix the login bug')).toBe('login');
  });
  it('falls back to "nothing" for empty or stopword-only input', () => {
    expect(pickWord('')).toBe('nothing');
    expect(pickWord('a to')).toBe('nothing');
  });
});
