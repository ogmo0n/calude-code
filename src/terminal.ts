interface Stdin {
  isTTY?: boolean;
  setRawMode?: (mode: boolean) => unknown;
  pause: () => unknown;
}

// Ink's effect cleanups (raw mode off, melody kill) can run a tick after waitUntilExit resolves.
// Wait for them, then hand claude a clean, cooked-mode terminal that Node is no longer reading.
export async function releaseTerminal(stdin: Stdin): Promise<void> {
  await new Promise((r) => setImmediate(r));
  if (stdin.isTTY) stdin.setRawMode?.(false);
  stdin.pause();
}

// If anything in the joke blows up, still get the user to real claude.
export async function safeRun<T>(main: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await main();
  } catch {
    return fallback();
  }
}
