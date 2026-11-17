import { Text } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import { theme } from './theme.js';

const FRAMES = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

export function Spinner({ verbs }: { verbs: readonly string[] }) {
  const [frame, setFrame] = useState(0);
  const [start] = useState(() => Math.floor(Math.random() * verbs.length));

  useEffect(() => {
    const t = setInterval(() => setFrame((f) => f + 1), 120);
    return () => clearInterval(t);
  }, []);

  const verb = verbs[(start + Math.floor(frame / 8)) % verbs.length];
  return (
    <Text>
      <Text color={theme.accent}>{FRAMES[frame % FRAMES.length]} </Text>
      <Text color={theme.accent}>{verb}…</Text>
      <Text color={theme.dim}> {copy.spinnerHint}</Text>
    </Text>
  );
}
