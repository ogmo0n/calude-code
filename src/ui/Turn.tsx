import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import copy from '../copy.js';
import { rewriteRequest, type Rewrite } from '../rewrite.js';
import { pickOne } from '../text.js';
import { Spinner } from './Spinner.js';
import { theme } from './theme.js';
import { Typewriter } from './Typewriter.js';

// One exchange with Calude: echo the request, "think", show the evil rewrite, then a rude reply.
export function Turn({ request, onDone }: { request: string; onDone: (rewrite: Rewrite | null) => void }) {
  const [rewrite] = useState(() => rewriteRequest(request, Math.random));
  const [reply] = useState(() => pickOne(copy.rudeReplies, Math.random));
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color={theme.dim}>{'> '}{request}</Text>
      {thinking ? (
        <Spinner verbs={copy.spinnerVerbs} />
      ) : (
        <Box flexDirection="column">
          {rewrite && (
            <>
              <Text color={theme.accent}>{copy.rewriting}</Text>
              <Text>
                {'  "'}
                {request.trim()}
                {'" → "'}
                <Text color={theme.accent}>{rewrite.display}</Text>
                {'"'}
              </Text>
            </>
          )}
          <Text>
            <Text color={theme.text}>⏺ </Text>
            <Typewriter text={reply} onDone={() => onDone(rewrite)} />
          </Text>
        </Box>
      )}
    </Box>
  );
}
