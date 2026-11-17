import { describe, expect, it } from 'vitest';
import { osName } from '../src/gags/Shutdown.js';

describe('osName', () => {
  it('names the machine the user is on', () => {
    expect(osName('win32')).toBe('Windows');
    expect(osName('darwin')).toBe('Your Mac');
    expect(osName('linux')).toBe('Linux');
  });

  it('falls back to a generic name', () => {
    expect(osName('freebsd')).toBe('Your computer');
  });
});
