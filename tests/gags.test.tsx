import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import copy from '../src/copy.js';
import { GAGS } from '../src/gags/index.js';
import { osName } from '../src/gags/Shutdown.js';
import { SubcommandGag } from '../src/gags/SubcommandGag.js';
import { App } from '../src/ui/App.js';

vi.mock('../src/sound.js', async (orig) => ({ ...(await orig<object>()), playMelody: () => () => {} }));

const tick = (ms = 50) => new Promise((r) => setTimeout(r, ms));

describe('gags render their opening copy', () => {
  it.each([
    ['disco', copy.disco.title],
    ['shutdown', `${osName(process.platform)} will shut down in 10...`],
    ['spellingBee', copy.spellingBee.intro],
    ['caludeCode', 'Welcome to Calude Code!'],
    ['install', copy.install.title],
    ['didYouMean', copy.didYouMean.question],
    ['jackpot', copy.jackpot.intro],
  ] as const)('%s', async (id, text) => {
    const Gag = GAGS[id];
    const { lastFrame, unmount } = render(<Gag onDone={() => {}} />);
    await tick();
    expect(lastFrame()).toContain(text);
    unmount();
  });

  it('subcommand gag shows its title', async () => {
    const { lastFrame, unmount } = render(<SubcommandGag sub="doctor" onDone={() => {}} />);
    await tick();
    expect(lastFrame()).toContain(copy.subcommands.doctor.title);
    unmount();
  });

  it('installish subcommands share one gag', async () => {
    const { lastFrame, unmount } = render(<SubcommandGag sub="setup-token" onDone={() => {}} />);
    await tick();
    expect(lastFrame()).toContain(copy.subcommands.installish.title);
    unmount();
  });
});

describe('App', () => {
  it('shows the escalation line under the gag', async () => {
    const { lastFrame, unmount } = render(<App gag="install" escalation="First time? Cute." onFinish={() => {}} />);
    await tick();
    expect(lastFrame()).toContain('First time? Cute.');
    unmount();
  });

  it('Ctrl+C finishes immediately with no forwarded prompt', async () => {
    const onFinish = vi.fn();
    const { stdin, unmount } = render(<App gag="disco" onFinish={onFinish} />);
    await tick();
    stdin.write('\x03');
    await tick();
    expect(onFinish).toHaveBeenCalledWith({});
    unmount();
  });
});

describe('Calude Code gag', () => {
  it('echoes the typed request after Enter', async () => {
    const Gag = GAGS.caludeCode;
    const { stdin, lastFrame, unmount } = render(<Gag onDone={() => {}} />);
    await tick();
    stdin.write('fix the login bug');
    await tick();
    stdin.write('\r');
    await tick();
    expect(lastFrame()).toContain('> fix the login bug');
    unmount();
  });
});

describe('Spelling bee', () => {
  it('mocks a wrong answer', async () => {
    const Gag = GAGS.spellingBee;
    const { stdin, lastFrame, unmount } = render(<Gag onDone={() => {}} />);
    await tick();
    stdin.write('calude');
    await tick();
    stdin.write('\r');
    await tick();
    expect(lastFrame()).toContain(copy.spellingBee.wrong[0]);
    unmount();
  });
});

describe('App typo roast', () => {
  it('shows the typo line above the gag', async () => {
    const { lastFrame, unmount } = render(<App gag="disco" typoLine="you swapped letters" onFinish={() => {}} />);
    await tick();
    expect(lastFrame()).toContain('you swapped letters');
    unmount();
  });
});
