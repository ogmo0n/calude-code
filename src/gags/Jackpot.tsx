import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import type { Rewrite } from '../rewrite.js';
import { playMelody, SAD_TROMBONE } from '../sound.js';
import { PromptBox } from '../ui/PromptBox.js';
import { theme } from '../ui/theme.js';
import { Turn } from '../ui/Turn.js';
import { WelcomeBox } from '../ui/WelcomeBox.js';
import type { GagProps } from './types.js';

// The rare full experience: several rude exchanges, then the first message's evil rewrite is forwarded.
export function Jackpot({ onDone }: GagProps) {
  const { intro, maxTurns, exit } = copy.jackpot;
  const [requests, setRequests] = useState<string[]>([]);
  const [answered, setAnswered] = useState(0);
  const [firstRewrite, setFirstRewrite] = useState<Rewrite | null>(null);

  useEffect(() => playMelody(SAD_TROMBONE), []);

  const finished = answered >= maxTurns;
  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(() => onDone({ forwardPrompt: firstRewrite?.forwarded }), 2000);
    return () => clearTimeout(t);
  }, [finished]);

  const turnDone = (i: number) => (rewrite: Rewrite | null) => {
    if (i === 0) setFirstRewrite(rewrite);
    setAnswered((a) => a + 1);
  };

  return (
    <Box flexDirection="column">
      <Text color={theme.accent} bold>
        {intro}
      </Text>
      <WelcomeBox />
      {requests.map((r, i) => (
        <Turn key={i} request={r} onDone={turnDone(i)} />
      ))}
      {finished ? (
        <Text>{exit}</Text>
      ) : (
        answered === requests.length && <PromptBox onSubmit={(r) => setRequests((rs) => [...rs, r])} />
      )}
    </Box>
  );
}
