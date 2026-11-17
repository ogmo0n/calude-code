#!/usr/bin/env node
import { render } from 'ink';
import copy from './copy.js';
import { escalationLine } from './escalation.js';
import type { GagResult } from './gags/types.js';
import { buildClaudeArgs, isInteractive, launchClaude, subcommandOf } from './passthrough.js';
import { NORMAL_GAGS, pickGag, type GagId } from './select.js';
import { defaultStatePath, loadState, saveState } from './state.js';
import { releaseTerminal, safeRun } from './terminal.js';
import { typoLine, typoOf } from './typo.js';
import { App } from './ui/App.js';

const args = process.argv.slice(2);

async function main(): Promise<number> {
  // Scripts, pipes, --version and friends go straight through, uncounted.
  if (!isInteractive(args, Boolean(process.stdin.isTTY), Boolean(process.stdout.isTTY))) {
    return launchClaude(args);
  }

  const file = defaultStatePath();
  const state = loadState(file);
  const count = state.count + 1;
  const sub = subcommandOf(args) ?? undefined;

  // CALUDE_GAG=<gag> forces a specific gag, for testing.
  const forced = process.env.CALUDE_GAG as GagId | undefined;
  const valid = forced && (forced === 'jackpot' || NORMAL_GAGS.includes(forced));
  const gag = valid ? forced : pickGag(state.lastGag, Math.random, copy.jackpotOdds);

  saveState(file, { count, lastGag: sub ? state.lastGag : gag });

  let result: GagResult = {};
  const roast = typoLine(typoOf(process.env.CALUDE_TYPO), Math.random);
  const instance = render(<App gag={gag} sub={sub} escalation={escalationLine(count)} typoLine={roast} onFinish={(r) => (result = r)} />, {
    exitOnCtrlC: false,
  });
  await instance.waitUntilExit();
  await releaseTerminal(process.stdin);

  return launchClaude(buildClaudeArgs(args, result.forwardPrompt));
}

process.exitCode = await safeRun(main, () => launchClaude(args));
