// Writes `calude` launchers into ~/.local/bin so the command works in any shell.
import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const binDir = join(homedir(), '.local', 'bin');
mkdirSync(binDir, { recursive: true });

const cli = join(root, 'dist', 'cli.js');
const shPath = cli.replace(/\\/g, '/');

const sh = join(binDir, 'calude');
writeFileSync(sh, `#!/bin/sh\nexec node "${shPath}" "$@"\n`);
chmodSync(sh, 0o755);
console.log(`Wrote ${sh}`);

if (process.platform === 'win32') {
  const cmd = join(binDir, 'calude.cmd');
  writeFileSync(cmd, `@node "${cli}" %*\r\n`);
  console.log(`Wrote ${cmd}`);
}

const onPath = (process.env.PATH ?? '').split(delimiter).some((d) => resolve(d) === resolve(binDir));
if (!onPath) console.log(`\nHeads up: ${binDir} is not on your PATH. Add it so \`calude\` can be found.`);
