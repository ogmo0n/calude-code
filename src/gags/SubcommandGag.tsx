import { Box, Text } from 'ink';
import copy from '../copy.js';
import type { Subcommand } from '../passthrough.js';
import { theme } from '../ui/theme.js';
import { useTimeline } from '../ui/useTimeline.js';
import type { GagProps } from './types.js';

const VERSIONS = ['2.0.0', '1.4.2', '0.9.9', '0.3.1', '0.0.1'];

function keyOf(sub: Subcommand): keyof typeof copy.subcommands {
  return sub === 'install' || sub === 'setup-token' || sub === 'migrate-installer' ? 'installish' : sub;
}

export function SubcommandGag({ sub, onDone }: GagProps & { sub: Subcommand }) {
  const { title, lines } = copy.subcommands[keyOf(sub)];
  const versions = sub === 'update' ? VERSIONS : [];
  const total = versions.length + lines.length + 1;
  const step = useTimeline(total, 3000 / total, () => onDone());
  const versionStep = Math.min(step, versions.length - 1);
  const shownLines = Math.max(0, step - versions.length);

  return (
    <Box flexDirection="column">
      <Text color={theme.accent}>{title}</Text>
      {versions.length > 0 && <Text color={theme.dim}>  v{versions[versionStep]}</Text>}
      {lines.slice(0, shownLines).map((l) => (
        <Text key={l}>  {l}</Text>
      ))}
    </Box>
  );
}
