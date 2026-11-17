import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import copy from '../copy.js';
import { theme } from './theme.js';

interface Props {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export function PromptBox({ onSubmit, placeholder }: Props) {
  const [text, setText] = useState('');

  useInput((input, key) => {
    if (key.ctrl || key.meta || key.escape || key.tab || key.upArrow || key.downArrow) return;
    if (key.return) {
      onSubmit(text);
      setText('');
    } else if (key.backspace || key.delete) {
      setText((t) => t.slice(0, -1));
    } else if (input) {
      setText((t) => t + input);
    }
  });

  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor={theme.dim} paddingX={1}>
        <Text>
          {'> '}
          {text || <Text color={theme.dim}>{placeholder ?? ''}</Text>}
          <Text inverse> </Text>
        </Text>
      </Box>
      <Text color={theme.dim}>
        {'  '}
        {copy.banner.footer}
      </Text>
    </Box>
  );
}
