import { describe, expect, it } from 'vitest';
import { NORMAL_GAGS, pickGag } from '../src/select.js';

describe('pickGag', () => {
  it('returns jackpot when the first roll is under the odds', () => {
    expect(pickGag(null, () => 0.01, 0.05)).toBe('jackpot');
  });

  it('never returns jackpot when the first roll is at or over the odds', () => {
    let calls = 0;
    const rng = () => (calls++ === 0 ? 0.05 : Math.random());
    expect(pickGag(null, rng, 0.05)).not.toBe('jackpot');
  });

  it('never repeats the previous normal gag', () => {
    for (const last of NORMAL_GAGS) {
      for (let i = 0; i < 200; i++) {
        expect(pickGag(last, Math.random, 0)).not.toBe(last);
      }
    }
  });

  it('can follow a jackpot with any normal gag', () => {
    expect(NORMAL_GAGS).toContain(pickGag('jackpot', () => 0.5, 0));
  });
});
