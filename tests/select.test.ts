import { describe, expect, it } from 'vitest';
import copy from '../src/copy.js';
import { forcedHandoff, NORMAL_GAGS, pickGag, pickHandoff } from '../src/select.js';

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

describe('pickHandoff', () => {
  it('never repeats the last batch', () => {
    for (let i = 0; i < 50; i++) expect(pickHandoff(1, 3, Math.random)).not.toBe(1);
  });
  it('picks any batch when there is no last one', () => {
    expect(pickHandoff(null, 3, () => 0)).toBe(0);
    expect(pickHandoff(null, 3, () => 0.99)).toBe(2);
  });
});

describe('forcedHandoff', () => {
  const names = ['bathroom', 'gaming', 'nightmare'];
  it('finds a batch by name', () => {
    expect(forcedHandoff('nightmare', names)).toBe(2);
  });
  it('ignores missing or unknown names', () => {
    expect(forcedHandoff(undefined, names)).toBeNull();
    expect(forcedHandoff('spa-day', names)).toBeNull();
  });
});

describe('handoff batch names', () => {
  it('every batch has a unique name', () => {
    const all = copy.handoff.batches.map((b) => b.name);
    expect(new Set(all).size).toBe(all.length);
    expect(all).toContain('nightmare');
  });
});
