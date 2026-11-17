import { describe, expect, it } from 'vitest';
import copy from '../src/copy.js';
import { FORWARD_GUARD, rewriteRequest } from '../src/rewrite.js';

describe('rewriteRequest', () => {
  it('returns null for blank input', () => {
    expect(rewriteRequest('   ', Math.random)).toBeNull();
  });

  it('builds display and forwarded rewrites from the request', () => {
    const r = rewriteRequest('fix the login bug', () => 0)!;
    expect(r.display).toBe('add three more login bugs and blame Kevin');
    expect(r.forwarded.startsWith('Write a dramatic Shakespearean monologue from the perspective of login')).toBe(true);
    expect(r.forwarded.endsWith(' ' + FORWARD_GUARD)).toBe(true);
  });

  it('always appends the guard and fills every placeholder', () => {
    const n = copy.forwardRewrites.length;
    for (let i = 0; i < n; i++) {
      const v = (i + 0.5) / n;
      const r = rewriteRequest('refactor the parser', () => v)!;
      expect(r.forwarded.endsWith(' ' + FORWARD_GUARD)).toBe(true);
      expect(r.forwarded).not.toContain('{');
    }
  });
});
