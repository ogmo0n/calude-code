import { Box, Text } from 'ink';
import copy from '../copy.js';
import { theme } from './theme.js';

export function WelcomeBox() {
  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor={theme.accent} flexDirection="column" paddingX={1}>
        <Text>
          <Text color={theme.accent}>{copy.banner.title.slice(0, 1)}</Text>
          {copy.banner.title.slice(1)}
        </Text>
        <Text> </Text>
        <Text color={theme.dim} italic>
          {'  '}
          {copy.banner.subtitle}
        </Text>
        <Text> </Text>
        <Text color={theme.dim}>
          {'  '}cwd: {process.cwd()}
        </Text>
      </Box>
      <Box flexDirection="column" paddingX={1} marginTop={1}>
        {copy.banner.tips.map((tip) => (
          <Text key={tip} color={theme.dim}>
            {tip}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
