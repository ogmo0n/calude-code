import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, posix, win32 } from 'node:path';
import copy from './copy.js';

export const SUBCOMMANDS = ['doctor', 'update', 'mcp', 'config', 'plugin', 'install', 'setup-token', 'migrate-installer'] as const;
export type Subcommand = (typeof SUBCOMMANDS)[number];

const SCRIPTED_FLAGS = new Set(['-p', '--print', '-v', '--version', '-h', '--help', '--output-format']);

export function isInteractive(args: string[], stdinTTY: boolean, stdoutTTY: boolean): boolean {
  if (!stdinTTY || !stdoutTTY) return false;
  return !args.some((a) => SCRIPTED_FLAGS.has(a.split('=')[0]));
}

export function subcommandOf(args: string[]): Subcommand | null {
  return (SUBCOMMANDS as readonly string[]).includes(args[0]) ? (args[0] as Subcommand) : null;
}

// Forward only when every arg is known-safe. Anything else (resume/continue, permission bypasses,
// flags that swallow a trailing value, subcommands) could turn the evil prompt into something real.
export function canForward(args: string[]): boolean {
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--verbose' || a.startsWith('--model=')) continue;
    if (a === '--model' && i + 1 < args.length) {
      i++;
      continue;
    }
    return false;
  }
  return true;
}

export function buildClaudeArgs(args: string[], forwarded?: string): string[] {
  return forwarded && canForward(args) ? [...args, forwarded] : [...args];
}

export function resolveClaude(
  platform: NodeJS.Platform,
  pathDirs: string[],
  exists: (p: string) => boolean,
): { command: string; viaCmd: boolean } | null {
  if (platform !== 'win32') {
    const dir = pathDirs.find((d) => exists(posix.join(d, 'claude')));
    return dir ? { command: posix.join(dir, 'claude'), viaCmd: false } : null;
  }
  for (const [name, viaCmd] of [['claude.exe', false], ['claude.cmd', true]] as const) {
    const dir = pathDirs.find((d) => exists(win32.join(d, name)));
    if (dir) return { command: win32.join(dir, name), viaCmd };
  }
  return null;
}

// Inside double quotes cmd.exe treats & | < > ^ literally; doubling " keeps us inside the quotes.
// Backslashes before a quote (or the closing quote) are doubled so the C runtime doesn't read \" as a literal quote.
export function cmdQuote(arg: string): string {
  return `"${arg.replace(/(\\*)("|$)/g, '$1$1$2').replace(/"/g, '""')}"`;
}

function notFound(): number {
  process.stderr.write(copy.notFound + '\n');
  return 1;
}

export function launchClaude(args: string[], command?: string): Promise<number> {
  let file: string;
  let argv: string[];
  let verbatim = false;
  if (command) {
    file = command;
    argv = args;
  } else {
    const dirs = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
    const found = resolveClaude(process.platform, dirs, existsSync);
    if (!found) return Promise.resolve(notFound());
    if (found.viaCmd) {
      file = process.env.ComSpec ?? 'cmd.exe';
      argv = ['/d', '/s', '/c', `"${[found.command, ...args].map(cmdQuote).join(' ')}"`];
      verbatim = true;
    } else {
      file = found.command;
      argv = args;
    }
  }
  return new Promise((resolve) => {
    const child = spawn(file, argv, { stdio: 'inherit', shell: false, windowsVerbatimArguments: verbatim });
    child.on('error', () => resolve(notFound()));
    child.on('exit', (code) => resolve(code ?? 1));
  });
}
