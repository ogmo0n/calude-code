import { describe, expect, it, vi } from 'vitest';
import { releaseTerminal, safeRun } from '../src/terminal.js';

describe('releaseTerminal', () => {
  it('turns off raw mode and pauses stdin after a tick', async () => {
    const stdin = { isTTY: true, setRawMode: vi.fn(), pause: vi.fn() };
    await releaseTerminal(stdin);
    expect(stdin.setRawMode).toHaveBeenCalledWith(false);
    expect(stdin.pause).toHaveBeenCalled();
  });
  it('skips raw mode when stdin is not a TTY', async () => {
    const stdin = { isTTY: false, setRawMode: vi.fn(), pause: vi.fn() };
    await releaseTerminal(stdin);
    expect(stdin.setRawMode).not.toHaveBeenCalled();
  });
});

describe('safeRun', () => {
  it('falls back when the main path throws', async () => {
    const fallback = vi.fn(async () => 7);
    expect(await safeRun(async () => { throw new Error('boom'); }, fallback)).toBe(7);
    expect(fallback).toHaveBeenCalled();
  });
  it('returns the main result when it succeeds', async () => {
    expect(await safeRun(async () => 0, async () => 7)).toBe(0);
  });
});
