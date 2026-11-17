import { Box, Text } from 'ink';
import { useEffect } from 'react';
import copy from '../copy.js';
import { DISCO, playMelody } from '../sound.js';
import { RAINBOW } from '../ui/theme.js';
import { useTimeline } from '../ui/useTimeline.js';
import type { GagProps } from './types.js';

const FRAMES = [
  [' (\\_/) ', ' (^.^) ', '\\(   )/', '  " "  '],
  [' (\\_/) ', ' (^o^) ', ' (   )>', ' /" "\\ '],
];
const HAMSTERS = 5;
const STEP_MS = 340; // under 3 color changes a second
const STEPS = 18; // about 6 s

export function Disco({ onDone }: GagProps) {
  useEffect(() => playMelody(DISCO), []);
  const step = useTimeline(STEPS + 3, STEP_MS, () => onDone());
  const color = (i: number) => RAINBOW[(step + i) % RAINBOW.length];

  if (step >= STEPS) return <Text>{copy.disco.outro}</Text>;

  return (
    <Box flexDirection="column">
      <Text bold color={color(0)}>
        {copy.disco.title}
      </Text>
      <Text>{copy.disco.line}</Text>
      <Box marginTop={1}>
        {Array.from({ length: HAMSTERS }, (_, h) => (
          <Box key={h} flexDirection="column" marginRight={2}>
            {FRAMES[(step + h) % 2].map((line, l) => (
              <Text key={l} color={color(h + 1)}>
                {line}
              </Text>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
