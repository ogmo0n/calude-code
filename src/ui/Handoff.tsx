import { Box, Text } from 'ink';
import copy from '../copy.js';
import { theme } from './theme.js';
import { useTimeline } from './useTimeline.js';

const WIDTH = 30;
const TICK_MS = 250;

// The painful wait between every gag and real claude: stalling excuses, then a bar stuck at 99%.
export function Handoff({ onDone }: { onDone: () => void }) {
  const { steps, msPerStep, stallLabel, stallMs, final } = copy.handoff;
  const stepTicks = Math.ceil(msPerStep / TICK_MS);
  const stallTicks = Math.ceil(stallMs / TICK_MS);
  const excuseTicks = steps.length * stepTicks;
  const tick = useTimeline(excuseTicks + stallTicks + 4, TICK_MS, onDone);

  const shown = Math.min(Math.floor(tick / stepTicks) + 1, steps.length);
  const stalling = tick >= excuseTicks;
  const pct = Math.min(99, Math.round((tick / excuseTicks) * 99));
  const filled = Math.round((pct / 100) * WIDTH);
  const finished = tick >= excuseTicks + stallTicks;

  return (
    <Box flexDirection="column" marginTop={1}>
      {steps.slice(0, shown).map((s, i) => (
        <Text key={i} color={i < shown - 1 ? theme.dim : theme.text}>
          {'  '}
          {s}
        </Text>
      ))}
      <Text>
        {'  '}
        {stallLabel}{' ['}
        <Text color={theme.accent}>{'█'.repeat(filled)}</Text>
        {'░'.repeat(WIDTH - filled)}
        {'] '}
        {pct}%{stalling && !finished ? '.'.repeat((tick % 3) + 1) : ''}
      </Text>
      {finished && <Text color={theme.accent}>{final}</Text>}
    </Box>
  );
}
