# calude

You meant to type `claude`. You typed `calude` (or `cluade`). Now you meet **Calude Code**: Claude's less-talented, mean, and mildly evil cousin.

Every time you mistype it, Calude roasts your exact typo, plays a random gag that looks like Claude Code, then launches the real `claude` with everything you passed along.

## The gags

- **Disco mode:** rainbow strobing, dancing ASCII hamsters, and an original, deeply annoying chiptune.
- **Fake shutdown:** "Windows will shut down in 10..." (or "Your Mac", or "Linux", depending on your machine) with beeps. (It doesn't. It's drawn in the terminal.)
- **Spelling bee:** spell `claude` correctly three times to continue.
- **Calude Code:** a lookalike prompt. Type a request, get insulted, watch Calude "improve" your request, and then Calude forwards a different, pointless one to real Claude.
- **Backwards install:** downloading 47 GB of vibes, with a progress bar that goes backwards.
- **Did you mean claude? [Y/n]:** the Y keeps dodging.
- **Jackpot (about 1 in 20):** the full rude Calude experience, several turns long.
- **Subcommands:** `calude doctor`, `calude update`, `calude mcp`, `calude config`, `calude plugin`, and the install commands each get their own gag before the real command runs.

A typo counter in `~/.calude/state.json` makes things more dramatic at milestones.

## Install

Requires Node 20+ and [Claude Code](https://docs.claude.com/en/docs/claude-code).

```sh
git clone <this repo> calude
cd calude
npm install
npm run build
npm run install-shims
```

`install-shims` writes `calude` and `cluade` launchers (plus `.cmd` versions on Windows) into `~/.local/bin`. If that folder isn't on your PATH, add it.

Works best on Windows, where the music plays through system beep tones. On macOS and Linux you get the terminal bell instead.

## Make it yours

Every joke lives in [`src/copy.ts`](src/copy.ts): typo roasts, spinner verbs, rude replies, evil rewrites, milestone lines, and the jackpot odds. Edit it, then run `npm run build`.

Test a specific gag with `CALUDE_GAG`:

```sh
CALUDE_GAG=disco calude          # Git Bash / macOS / Linux
$env:CALUDE_GAG="disco"; calude  # PowerShell
```

Gag names: `disco`, `shutdown`, `spellingBee`, `caludeCode`, `install`, `didYouMean`, `jackpot`.

The wait before real Claude opens picks a random themed batch of excuses. Force one with `CALUDE_HANDOFF` (same syntax as `CALUDE_GAG`): `bathroom`, `gaming`, `coffee`, `meeting`, `updates`, `nap`, `nightmare`.

To answer to another typo, add it to `TYPOS` in [`src/typo.ts`](src/typo.ts) and give it roast lines under `typos` in `src/copy.ts`, then run `npm run build` and `npm run install-shims` again.

To reset the typo counter, delete `~/.calude/state.json`.

## Safety

- **Ctrl+C** skips any gag and goes straight to real Claude.
- **Scripted use is left alone:** piped input or output, `-p`/`--print`, `--version`, `--help`, and `--output-format` go straight to `claude` with no gag.
- **Forwarded prompts are text-only:** Calude never forwards your request as-is. It sends a prompt from the `forwardRewrites` list in `src/copy.ts`, which may quote what you typed (e.g. "write a haiku about '...'"), and the code always appends "Answer in text only. Do not read, create, edit, or run anything." That line is a request, not a lock, so keep the list harmless: real Claude Code runs in whatever folder you're in.
- **Prompts are forwarded only with no arguments, or just `--model`/`--verbose`:** anything else (`--resume`, `--continue`, permission flags like `--dangerously-skip-permissions`, `--add-dir`, subcommands) means the real command runs untouched, with no prompt.

## Uninstall

Delete `~/.local/bin/calude` and `~/.local/bin/cluade` (and their `.cmd` versions on Windows), the cloned folder, and `~/.calude/`.

## Development

```sh
npm test        # vitest
npm run build   # tsc → dist/
```

Not affiliated with Anthropic. Calude is a parody, and a bad one.
