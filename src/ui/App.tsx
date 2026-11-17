import { Box, Text, useApp, useInput } from 'ink';
import { useRef, useState } from 'react';
import { GAGS } from '../gags/index.js';
import { SubcommandGag } from '../gags/SubcommandGag.js';
import type { GagResult } from '../gags/types.js';
import type { Subcommand } from '../passthrough.js';
import type { GagId } from '../select.js';
import { Handoff } from './Handoff.js';
import { theme } from './theme.js';

interface Props {
  gag: GagId;
  sub?: Subcommand;
  escalation?: string;
  onFinish: (r: GagResult) => void;
}

export function App({ gag, sub, escalation, onFinish }: Props) {
  const { exit } = useApp();
  const done = useRef(false);
  const [gagResult, setGagResult] = useState<GagResult | null>(null);

  const finish = (r: GagResult) => {
    if (done.current) return;
    done.current = true;
    onFinish(r);
    exit();
  };

  // Ctrl+C always skips straight to real claude (keeping whatever the gag already produced).
  useInput((input, key) => {
    if (key.ctrl && input === 'c') finish(gagResult ?? {});
  });

  const Gag = GAGS[gag];
  const gagDone = (r: GagResult = {}) => setGagResult((prev) => prev ?? r);

  return (
    <Box flexDirection="column">
      {sub ? <SubcommandGag sub={sub} onDone={gagDone} /> : <Gag onDone={gagDone} />}
      {gagResult && <Handoff onDone={() => finish(gagResult)} />}
      {escalation && (
        <Box marginTop={1}>
          <Text color={theme.accent}>{escalation}</Text>
        </Box>
      )}
    </Box>
  );
}
