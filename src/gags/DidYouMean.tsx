import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import { theme } from '../ui/theme.js';
import type { GagProps } from './types.js';

const IDLE_MS = 6000;

export function DidYouMean({ onDone }: GagProps) {
  const { question, dodges, giveUp } = copy.didYouMean;
  const [presses, setPresses] = useState(0);
  const [offset, setOffset] = useState(1);
  const [gaveUp, setGaveUp] = useState(false);

  useInput((input, key) => {
    if (gaveUp || (key.ctrl && input === 'c')) return;
    setPresses((p) => p + 1);
    setOffset(1 + Math.floor(Math.random() * 30));
  });

  useEffect(() => {
    if (presses >= dodges.length) setGaveUp(true);
  }, [presses]);

  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), IDLE_MS);
    return () => clearTimeout(t);
  }, [presses]);

  useEffect(() => {
    if (!gaveUp) return;
    const t = setTimeout(() => onDone(), 1500);
    return () => clearTimeout(t);
  }, [gaveUp]);

  return (
    <Box flexDirection="column">
      <Text>
        {question}
        {' '.repeat(offset)}
        <Text color={theme.accent} bold>
          [Y/n]
        </Text>
      </Text>
      {presses > 0 && !gaveUp && <Text color={theme.dim}>{dodges[presses - 1]}</Text>}
      {gaveUp && <Text>{giveUp}</Text>}
    </Box>
  );
}
