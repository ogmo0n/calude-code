import { win32 } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildClaudeArgs, cmdQuote, isInteractive, launchClaude, resolveClaude, subcommandOf } from '../src/passthrough.js';

describe('isInteractive', () => {
  it('is true for a bare TTY launch', () => {
    expect(isInteractive([], true, true)).toBe(true);
  });
  it('is false without a TTY on either side', () => {
    expect(isInteractive([], false, true)).toBe(false);
    expect(isInteractive([], true, false)).toBe(false);
  });
  it.each([[['-p', 'x']], [['--print']], [['-v']], [['--version']], [['-h']], [['--help']], [['--output-format', 'json']], [['--output-format=json']]])(
    'is false for scripted flags %j',
    (args) => expect(isInteractive(args, true, true)).toBe(false),
  );
  it('is true for interactive flags and subcommands', () => {
    expect(isInteractive(['-c'], true, true)).toBe(true);
    expect(isInteractive(['--model', 'opus'], true, true)).toBe(true);
    expect(isInteractive(['doctor'], true, true)).toBe(true);
  });
});

describe('subcommandOf', () => {
  it('recognizes only a leading subcommand', () => {
    expect(subcommandOf(['update', '--x'])).toBe('update');
    expect(subcommandOf(['--model', 'update'])).toBeNull();
  });
});

describe('buildClaudeArgs', () => {
  it('appends the forwarded prompt', () => {
    expect(buildClaudeArgs(['--model', 'opus'], 'X')).toEqual(['--model', 'opus', 'X']);
  });
  it('passes args through untouched', () => {
    expect(buildClaudeArgs(['a b', "it's"])).toEqual(['a b', "it's"]);
  });
  it('never forwards with --resume or a subcommand', () => {
    expect(buildClaudeArgs(['-r'], 'X')).toEqual(['-r']);
    expect(buildClaudeArgs(['--resume'], 'X')).toEqual(['--resume']);
    expect(buildClaudeArgs(['mcp', 'list'], 'X')).toEqual(['mcp', 'list']);
  });
});

describe('resolveClaude', () => {
  it('prefers claude.exe over claude.cmd on Windows', () => {
    const exists = (p: string) => p === win32.join('B', 'claude.exe') || p === win32.join('A', 'claude.cmd');
    expect(resolveClaude('win32', ['A', 'B'], exists)).toEqual({ command: win32.join('B', 'claude.exe'), viaCmd: false });
  });
  it('falls back to claude.cmd via cmd.exe', () => {
    const exists = (p: string) => p === win32.join('A', 'claude.cmd');
    expect(resolveClaude('win32', ['A', 'B'], exists)).toEqual({ command: win32.join('A', 'claude.cmd'), viaCmd: true });
  });
  it('returns null when nothing is found', () => {
    expect(resolveClaude('win32', ['A'], () => false)).toBeNull();
  });
});

describe('cmdQuote', () => {
  it('wraps in quotes and doubles inner quotes so cmd metacharacters stay literal', () => {
    expect(cmdQuote('a "b" & c')).toBe('"a ""b"" & c"');
  });
});

describe('launchClaude', () => {
  it('resolves 1 when the command does not exist', async () => {
    expect(await launchClaude([], 'definitely-not-a-real-command-xyz')).toBe(1);
  });
  it('passes args with spaces and quotes intact', async () => {
    const code = await launchClaude(['-e', 'process.exit(process.argv[1] === "a \\"b\\" c" ? 3 : 4)', 'a "b" c'], process.execPath);
    expect(code).toBe(3);
  });
});

describe('canForward allowlist (final review)', () => {
  it.each([[['--resume=abc']], [['-c']], [['--continue']], [['--add-dir', '../x']], [['--debug', 'mcp', 'list']], [['--dangerously-skip-permissions']], [['--permission-mode', 'acceptEdits']]])(
    'refuses to forward with %j',
    (args) => expect(buildClaudeArgs(args, 'X')).toEqual(args),
  );
  it('forwards with no args, --model, or --verbose', () => {
    expect(buildClaudeArgs([], 'X')).toEqual(['X']);
    expect(buildClaudeArgs(['--model', 'opus', '--verbose'], 'X')).toEqual(['--model', 'opus', '--verbose', 'X']);
    expect(buildClaudeArgs(['--model=opus'], 'X')).toEqual(['--model=opus', 'X']);
  });
});

describe('cmdQuote trailing backslashes (final review)', () => {
  it('doubles backslashes before the closing quote', () => {
    expect(cmdQuote('C:\\foo\\')).toBe('"C:\\foo\\\\"');
  });
  it('doubles backslashes before an inner quote', () => {
    expect(cmdQuote('a\\"b')).toBe('"a\\\\""b"');
  });
});
