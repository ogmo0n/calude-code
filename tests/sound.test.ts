import { describe, expect, it } from 'vitest';
import { melodyScript } from '../src/sound.js';

describe('melodyScript', () => {
  it('turns notes into beeps and rests', () => {
    const script = melodyScript([
      [440, 200],
      [0, 100],
    ]);
    expect(script).toContain('[console]::Beep(440,200)');
    expect(script).toContain('Start-Sleep -Milliseconds 100');
  });
});
