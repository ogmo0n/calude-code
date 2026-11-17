// Writes a launcher for every typo Calude answers to (calude, cluade, ...) into ~/.local/bin.
// Run after `npm run build`: the list of names comes from dist/typo.js.
import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPOS } from '../dist/typo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const binDir = join(homedir(), '.local', 'bin');
mkdirSync(binDir, { recursive: true });

const cli = join(root, 'dist', 'cli.js');
const shPath = cli.replace(/\\/g, '/');

for (const name of TYPOS) {
  // Each launcher tells Calude which typo you made, so it can roast the right one.
  const sh = join(binDir, name);
  writeFileSync(sh, `#!/bin/sh\nCALUDE_TYPO=${name} exec node "${shPath}" "$@"\n`);
  chmodSync(sh, 0o755);
  console.log(`Wrote ${sh}`);

  if (process.platform === 'win32') {
    const cmd = join(binDir, `${name}.cmd`);
    writeFileSync(cmd, `@setlocal\r\n@set "CALUDE_TYPO=${name}"\r\n@node "${cli}" %*\r\n`);
    console.log(`Wrote ${cmd}`);
  }
}

const onPath = (process.env.PATH ?? '').split(delimiter).some((d) => resolve(d) === resolve(binDir));
if (!onPath) console.log(`\nHeads up: ${binDir} is not on your PATH. Add it so ${TYPOS.join(' and ')} can be found.`);
