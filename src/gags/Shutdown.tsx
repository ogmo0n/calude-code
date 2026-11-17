import { Box, Text } from 'ink';
import { useEffect } from 'react';
import copy from '../copy.js';
import { playMelody, SHUTDOWN_BEEPS } from '../sound.js';
import { fill } from '../text.js';
import { useTimeline } from '../ui/useTimeline.js';
import type { GagProps } from './types.js';

const FROM = 10;
const WIDTH = 50;
const pad = (s: string) => ` ${s}`.padEnd(WIDTH);

// Drawn in the terminal only. Nothing here touches the real machine.
export function Shutdown({ onDone }: GagProps) {
  useEffect(() => playMelody(SHUTDOWN_BEEPS), []);
  const step = useTimeline(FROM + 3, 400, () => onDone());
  const n = Math.max(FROM - step, 1);

  const lines = ['', fill(copy.shutdown.countdown, { n }), '', step >= FROM / 2 ? copy.shutdown.saving : '', ''];

  return (
    <Box flexDirection="column">
      {lines.map((l, i) => (
        <Text key={i} backgroundColor="blue" color="white">
          {pad(l)}
        </Text>
      ))}
      {step >= FROM && <Text bold>{copy.shutdown.outro}</Text>}
    </Box>
  );
}
