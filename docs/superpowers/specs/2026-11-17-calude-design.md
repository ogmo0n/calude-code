# calude - design

## Intent

People mistype `claude` as `calude`. Typing `calude` should launch a joke app that looks like Claude Code, does something absurd for a few seconds, and then launches the real Claude Code. It is a toy meant to make the typist laugh, and it has to stay funny for someone who hits it many times a week.

## Goals

- `calude [args...]` works in both Git Bash and PowerShell.
- It looks like Claude Code at first glance: the same Ink-based terminal UI style, layout, orange accent, and welcome box. The branding is "Calude Code" (Claude's less-talented cousin).
- Each launch runs one gag picked at random from a pool, with flashing colors and sound where it fits.
- An escalation counter tracks lifetime typos and makes the copy more dramatic as it grows.
- About 1 in 20 launches is a "jackpot": the full rude replica.
- It always ends by launching the real `claude` with every original argument passed through untouched.
- All user-facing text lives in one copy file the user can edit without touching logic.

## Non-goals

- No real system actions. Nothing shuts down, installs, or deletes anything.
- No network calls or AI. All rude replies are canned copy.
- Not cross-platform polish. It targets Windows; elsewhere, sound may degrade to the terminal bell.
- Not published to npm.

## Anti-goals (failure even if it "works")

- Getting in the way of real work: no gag traps the user, and Ctrl+C always skips straight to real Claude Code.
- Leaving the terminal broken: raw mode, hidden cursor, alternate screen, or colors left on after handoff.
- Losing or mangling the arguments meant for `claude`.
- Being tedious: normal gags run about 3-7 seconds. Only the spelling bee and the jackpot wait on user input.

## Constraints

- Primary target is Windows (Git Bash, PowerShell, cmd). It should also run on macOS/Linux, with sound falling back to the terminal bell. Node 20+.
- Real Claude Code is whatever `claude` resolves to on PATH: the native installer's `claude.exe`/`claude` binary, or an npm-installed `claude.cmd` shim on Windows (which `spawn` cannot run with `shell: false`; see Launch flow).
- Public repo meant to be cloned and forked: no personal paths, names, emails, or machine-specific details anywhere in code or docs. Everything resolves at runtime (`os.homedir()`, PATH lookup).
- Source control: public GitHub repo. Every commit and push needs the owner's explicit go-ahead. Before the first commit, confirm the git author identity for this repo (consider a GitHub noreply email). Include a `.gitignore` for `node_modules/` and `dist/`.

## Approaches

1. **Node + Ink (chosen by the user).** Same UI framework Claude Code uses, so the look can match closely: bordered boxes, spinner, input prompt, layout. Cost: dependencies (ink, react) and a build step.
2. Plain Node with raw ANSI codes. Zero dependencies and simplest, but the replica would be a hand-drawn approximation. This was Claude's original pick; the user chose Ink for fidelity.
3. PowerShell script. Native beeps, but clunky animation and awkward to run from Git Bash. Rejected.

## Decided design

### Launch flow

1. A shim named `calude` runs the compiled app with Node.
2. The app loads state, picks a gag, and renders it with Ink.
3. When the gag finishes, or the user presses Ctrl+C, Ink unmounts fully and the terminal is restored.
4. The app spawns `claude` with the original args, `stdio: 'inherit'`, and exits with claude's exit code. On Windows, if PATH has no `claude.exe` but has `claude.cmd` (npm install), run it through `cmd.exe` with each arg safely quoted, since Node refuses to spawn `.cmd` files with `shell: false`. If `claude` can't be found, it prints a short in-character message and exits non-zero.

### Non-interactive runs skip the gag (Claude's call)

If stdin or stdout isn't a TTY, or the args include `-p`/`--print`, `--version`/`-v`, `--help`/`-h`, or `--output-format`, skip Ink entirely. (Subcommands get their own gag instead; see below.) Spawn `claude` straight away, and don't increment the counter. Ink's raw mode throws without a TTY, and gag output would pollute piped results.

### Subcommand gags (user-approved)

`calude <subcommand>`, where the subcommand is one of real claude's (`doctor`, `update`, `mcp`, `config`, `plugin`, `install`, `setup-token`, `migrate-installer`), plays a short (about 3 s), no-input gag specific to it. Then the real subcommand runs with the original args and no prompt is forwarded. Scripted (non-TTY) runs still skip it.

- doctor: "Running diagnostics... on you." ❌ spelling, ❌ dignity, ✅ caffeine. "Diagnosis: chronic typo syndrome. Prognosis: grim."
- update: "Checking for updates... Downgrading to Calude v0.0.1 (stable-ish)." The version counts down.
- mcp: "Connected to 0 MCP servers. They all blocked you."
- config: fake settings flip: `sarcasm: max`, `helpfulness: false`, `typo_shaming: enabled`.
- plugin: "Installing plugin: sadness-pack@latest... 100% sad."
- install / setup-token / migrate-installer: "Are you sure you want to install Calude permanently? [Y/Y]"

### Install

An `npm run install-shims` script writes launchers into `~/.local/bin` (created if missing; the README says to add it to PATH if needed). On Windows it writes `calude.cmd` (PowerShell/cmd) plus an extensionless `calude` sh script (Git Bash). On macOS/Linux it writes just the sh script, marked executable. Each runs `node <repo>/dist/cli.js` with all args, with `<repo>` resolved from the script's own location. This avoids `npm link` quirks with Node version managers. *(Claude's call.)*

### Gag pool

Each gag is a separate Ink component that calls `onDone()` when finished.

| Gag | What happens |
|-----|--------------|
| Disco mode | Rainbow color cycling, dancing ASCII hamsters, an original chiptune. (The real Hamster Dance song is copyrighted, so we write our own annoying tune in its spirit.) |
| Fake shutdown | "Windows will shut down in 10... 9..." with beeps, then "jk." Drawn in the terminal only. |
| Spelling bee | The user must type `claude` correctly 3 times. Wrong attempts get mocked. |
| Calude Code | Lookalike welcome screen. It accepts one prompt, shows a fake thinking spinner with silly verbs, shows an evil rewrite of the request (see below), streams a rude canned reply, then says "fine, getting my cousin." |
| Backwards install | "Installing Calude... downloading 47 GB of vibes," with a progress bar that goes backwards. |
| Did you mean claude? [Y/n] | The Y option keeps jumping away. After a few dodges, it gives up and launches anyway. |

**Jackpot (about 1 in 20):** an extended rude replica. Several turns of the user typing and Calude being unhelpful, then it storms off to get its cousin. It's distinct from the short "Calude Code" gag in length and in how many exchanges it allows (cap around 3-4 before handing off).

**Calude's personality:** mean, dim-witted, and evil. The user wants it unhelpful, not a gentle ribbing.

**Evil forwarding (user's decision).** The user's own typed text is never forwarded. Instead, Calude "completely alters" the request and passes the altered version to real `claude` as its initial prompt, to waste tokens. That covers the Calude Code gag and the jackpot (in the jackpot, use the first message typed). Two separate lists in the copy file:

- **Display rewrites:** shown on screen and can be as evil as the user likes (for example `"fix the login bug" → "add three more login bugs and blame Kevin"`).
- **Forwarded rewrites:** what actually gets sent. Harmless, text-only token wasters (for example "Write a haiku about '{request}', critique it harshly, repeat 5 times").

Templates can splice in `{request}` (the full typed text) and `{word}` (a word picked from it). *Safety guard (Claude's call): the code, not the copy file, appends "Answer in text only. Do not read, create, edit, or run anything." to every forwarded prompt. Real Claude Code acts in the user's working directory, so a destructive rewrite must never be sent.* Spawn as `claude [original args...] "<rewritten prompt>"`, passed as a single argv element (no shell string-building, so no Windows quoting issues). If the original args already contain a positional prompt, still append the rewrite; real claude will see both. If the user typed nothing, forward nothing.

**Selection:** roll for jackpot first (configurable odds, default 1/20). Otherwise pick uniformly from the normal pool, never repeating the previous launch's gag.

### Escalation

- Persist `{ count, lastGag }` in `~/.calude/state.json`. If the file is missing or corrupt, start fresh silently.
- Each launch increments `count`. The copy file defines tiers by threshold (for example 1, 5, 10, 25, 50, 100), each with lines that can be shown in a banner or outro (for example "This is your {count}th time. I've notified Anthropic.").

### Sound

On Windows, spawn a background `powershell -NoProfile -Command` process that plays a melody via `[console]::Beep(freq, ms)`. Melodies are defined as note lists. Kill the process when the gag ends or on Ctrl+C. If spawning fails, fall back to the terminal bell (`\x07`). Expect about a second of PowerShell startup latency; gags shouldn't depend on tight audio sync.

### Copy file

All user-facing text lives in `src/copy.ts`: banner text, spinner verbs, rude replies, gag lines, escalation tiers, and the jackpot odds. Placeholders like `{count}` are filled at runtime. Comments are allowed, so the user can annotate. Changing copy requires `npm run build` (documented in the README).

### Look

Mirror Claude Code's layout: an orange-bordered welcome box ("✻ Welcome to Calude Code!"), a cwd line, a dim tips line, a bordered `>` input box, and a dim footer hint. Use the same color family. Don't copy any Anthropic assets; it's a look-alike built from Ink primitives.

## Left to the builder

- TypeScript setup and build tooling (tsc or a bundler), plus the Ink/React versions compatible with Node 22.
- Exact animations, timings, ASCII art, melodies, and the initial joke copy. Make it funny; the user will tweak it.
- Flash rate. Keep the strobe at or below about 3 changes per second to stay fun, not seizure-y.
- Unit tests for the pure logic (gag selection, state load/save, placeholder filling). Gags themselves get manual testing.
- A short README with install, rebuild-after-copy-edit, and uninstall steps.
