import { Box, Text } from 'ink';
import copy from '../copy.js';
import { theme } from '../ui/theme.js';
import { useTimeline } from '../ui/useTimeline.js';
import type { GagProps } from './types.js';

const WIDTH = 30;

export function BackwardsInstall({ onDone }: GagProps) {
  const { title, steps, percents, outro } = copy.install;
  const step = useTimeline(percents.length + 1, 1000, () => onDone());
  const pct = percents[Math.min(step, percents.length - 1)];
  const filled = Math.round((Math.max(0, pct) / 100) * WIDTH);

  return (
    <Box flexDirection="column">
      <Text color={theme.accent}>{title}</Text>
      {steps.slice(0, Math.min(step + 1, steps.length)).map((s, i) => (
        <Text key={s} color={i < step ? theme.dim : theme.text}>
          {i < step ? '  ✓ ' : '  … '}
          {s}
        </Text>
      ))}
      <Text>
        {'  ['}
        <Text color={theme.accent}>{'█'.repeat(filled)}</Text>
        {'░'.repeat(WIDTH - filled)}
        {'] '}
        <Text color={pct < 0 ? 'red' : theme.text}>{pct}%</Text>
      </Text>
      {step >= percents.length && <Text color="red">{outro}</Text>}
    </Box>
  );
}
