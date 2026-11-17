import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import { PromptBox } from '../ui/PromptBox.js';
import { theme } from '../ui/theme.js';
import type { GagProps } from './types.js';

const NEEDED = 3;

export function SpellingBee({ onDone }: GagProps) {
  const { intro, wrong, success } = copy.spellingBee;
  const [correct, setCorrect] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastWrong, setLastWrong] = useState(false);

  useEffect(() => {
    if (correct < NEEDED) return;
    const t = setTimeout(() => onDone(), 1500);
    return () => clearTimeout(t);
  }, [correct]);

  const submit = (text: string) => {
    if (text.trim().toLowerCase() === 'claude') {
      setCorrect((c) => c + 1);
      setLastWrong(false);
    } else {
      setMisses((m) => m + 1);
      setLastWrong(true);
    }
  };

  return (
    <Box flexDirection="column">
      <Text color={theme.accent} bold>
        🐝 SPELLING BEE
      </Text>
      <Text>{intro}</Text>
      <Text>
        {'✅'.repeat(correct)}
        {'⬜'.repeat(Math.max(NEEDED - correct, 0))}
      </Text>
      {lastWrong && <Text color="red">{wrong[(misses - 1) % wrong.length]}</Text>}
      {correct >= NEEDED ? <Text>{success}</Text> : <PromptBox onSubmit={submit} placeholder="claude" />}
    </Box>
  );
}
