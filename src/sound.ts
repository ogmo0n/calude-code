import { spawn } from 'node:child_process';

export type Note = [freqHz: number, ms: number];

// Freq 0 is a rest.
export function melodyScript(notes: Note[]): string {
  return notes.map(([f, ms]) => (f > 0 ? `[console]::Beep(${f},${ms})` : `Start-Sleep -Milliseconds ${ms}`)).join(';');
}

// Plays in the background. Windows gets real beep tones; everything else gets the terminal bell.
export function playMelody(notes: Note[]): () => void {
  if (process.platform !== 'win32') {
    process.stdout.write('\x07');
    return () => {};
  }
  try {
    const child = spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', melodyScript(notes)], {
      stdio: 'ignore',
      windowsHide: true,
    });
    child.on('error', () => process.stdout.write('\x07'));
    return () => {
      if (child.exitCode === null && !child.killed) child.kill();
    };
  } catch {
    process.stdout.write('\x07');
    return () => {};
  }
}

const [C5, D5, E5, G5, A5, C6] = [523, 587, 659, 784, 880, 1047];
const beat = (f: number, ms = 140): Note => [f, ms];

// An original, deeply annoying bouncy tune.
export const DISCO: Note[] = [
  ...[G5, E5, G5, E5, C6, A5, G5, 0].map((f) => beat(f)),
  ...[E5, D5, E5, G5, A5, G5, E5, 0].map((f) => beat(f)),
  ...[G5, E5, G5, E5, C6, A5, G5, 0].map((f) => beat(f)),
  ...[A5, G5, E5, D5, C5, D5, C5, 0].map((f) => beat(f)),
];

// Ten ominous beeps, roughly one per countdown tick.
export const SHUTDOWN_BEEPS: Note[] = Array.from({ length: 10 }, () => [[880, 120] as Note, [0, 280] as Note]).flat();

export const SAD_TROMBONE: Note[] = [
  [392, 400],
  [370, 400],
  [349, 400],
  [330, 1000],
];
