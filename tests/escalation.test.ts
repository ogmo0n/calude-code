import { describe, expect, it } from 'vitest';
import { escalationLine } from '../src/escalation.js';

describe('escalationLine', () => {
  it('shows a line only at exact thresholds', () => {
    expect(escalationLine(1)).toBe('First time? Cute.');
    expect(escalationLine(2)).toBeUndefined();
    expect(escalationLine(25)).toBe("Typo #25. I've notified Anthropic.");
  });
});
