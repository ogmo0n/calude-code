import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadState, saveState } from '../src/state.js';

const fresh = { count: 0, lastGag: null };
const tmp = () => mkdtempSync(join(tmpdir(), 'calude-'));

describe('loadState', () => {
  it('returns fresh state for a missing file', () => {
    expect(loadState(join(tmp(), 'nope.json'))).toEqual(fresh);
  });
  it('returns fresh state for invalid JSON', () => {
    const f = join(tmp(), 's.json');
    writeFileSync(f, 'not json');
    expect(loadState(f)).toEqual(fresh);
  });
  it('returns fresh state for a wrong-shaped file', () => {
    const f = join(tmp(), 's.json');
    writeFileSync(f, '{"count":"x"}');
    expect(loadState(f)).toEqual(fresh);
  });
  it('round-trips through saveState, creating missing directories', () => {
    const f = join(tmp(), 'deep', 'er', 's.json');
    saveState(f, { count: 4, lastGag: 'disco' });
    expect(loadState(f)).toEqual({ count: 4, lastGag: 'disco' });
  });
});
