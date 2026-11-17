import { Text } from 'ink';
import { render } from 'ink-testing-library';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import copy from '../src/copy.js';
import type { GagProps } from '../src/gags/types.js';
import { Handoff } from '../src/ui/Handoff.js';

vi.mock('../src/gags/index.js', () => {
  const Instant = ({ onDone }: GagProps) => {
    useEffect(() => onDone({ forwardPrompt: 'P' }), []);
    return <Text>instant gag</Text>;
  };
  return { GAGS: new Proxy({}, { get: () => Instant }) };
});

const { App } = await import('../src/ui/App.js');
const tick = (ms = 50) => new Promise((r) => setTimeout(r, ms));

describe('Handoff', () => {
  it('opens with the first stalling line', async () => {
    const { lastFrame, unmount } = render(<Handoff batch={1} onDone={() => {}} />);
    await tick();
    expect(lastFrame()).toContain(copy.handoff.batches[1].steps[0]);
    unmount();
  });
});

describe('App handoff', () => {
  it('runs the handoff after the gag instead of finishing immediately', async () => {
    const onFinish = vi.fn();
    const { lastFrame, unmount } = render(<App gag="disco" handoff={1} onFinish={onFinish} />);
    await tick(100);
    expect(lastFrame()).toContain(copy.handoff.batches[1].steps[0]);
    expect(onFinish).not.toHaveBeenCalled();
    unmount();
  });

  it('Ctrl+C during the handoff still finishes, keeping the gag result', async () => {
    const onFinish = vi.fn();
    const { stdin, unmount } = render(<App gag="disco" onFinish={onFinish} />);
    await tick(100);
    stdin.write('\x03');
    await tick();
    expect(onFinish).toHaveBeenCalledWith({ forwardPrompt: 'P' });
    unmount();
  });
});

describe('Handoff batch finals', () => {
  it('a batch can replace the shared final line with its own', async () => {
    vi.useFakeTimers();
    const batch = copy.handoff.batches.findIndex((b) => 'final' in b);
    const { lastFrame, unmount } = render(<Handoff batch={batch} onDone={() => {}} />);
    for (let i = 0; i < 300; i++) await vi.advanceTimersByTimeAsync(250);
    const own = (copy.handoff.batches[batch] as { final: string }).final;
    expect(lastFrame()).toContain(own);
    expect(lastFrame()).not.toContain(copy.handoff.final);
    unmount();
    vi.useRealTimers();
  });
});
