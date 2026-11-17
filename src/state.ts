import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import type { GagId } from './select.js';

export interface State {
  count: number;
  lastGag: GagId | null;
  lastHandoff: number | null;
}

export function defaultStatePath(): string {
  return join(homedir(), '.calude', 'state.json');
}

export function loadState(file: string): State {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    if (typeof raw?.count === 'number' && (raw.lastGag === null || typeof raw.lastGag === 'string')) {
      // Files from older versions have no lastHandoff.
      const lastHandoff = typeof raw.lastHandoff === 'number' ? raw.lastHandoff : null;
      return { count: raw.count, lastGag: raw.lastGag, lastHandoff };
    }
  } catch {
    // Missing or corrupt: start fresh.
  }
  return { count: 0, lastGag: null, lastHandoff: null };
}

export function saveState(file: string, state: State): void {
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(state));
  } catch {
    // Never let bookkeeping get between the user and claude.
  }
}
