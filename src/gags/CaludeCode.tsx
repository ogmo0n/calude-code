import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import type { Rewrite } from '../rewrite.js';
import { PromptBox } from '../ui/PromptBox.js';
import { Turn } from '../ui/Turn.js';
import { WelcomeBox } from '../ui/WelcomeBox.js';
import type { GagProps } from './types.js';

export function CaludeCode({ onDone }: GagProps) {
  const [request, setRequest] = useState<string | null>(null);
  const [result, setResult] = useState<{ rewrite: Rewrite | null } | null>(null);

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => onDone({ forwardPrompt: result.rewrite?.forwarded }), 1500);
    return () => clearTimeout(t);
  }, [result]);

  return (
    <Box flexDirection="column">
      <WelcomeBox />
      {request === null ? (
        <PromptBox onSubmit={setRequest} />
      ) : (
        <Turn request={request} onDone={(rewrite) => setResult({ rewrite })} />
      )}
      {result && <Text>{result.rewrite ? copy.handoffForwarded : copy.handoffPlain}</Text>}
    </Box>
  );
}
