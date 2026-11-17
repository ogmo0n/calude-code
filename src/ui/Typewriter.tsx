import { Text } from 'ink';
import { useEffect, useState } from 'react';

// Streams text a character at a time, like a model "typing", then calls onDone once.
export function Typewriter({ text, onDone, msPerChar = 30 }: { text: string; onDone?: () => void; msPerChar?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setShown((n) => n + 1), msPerChar);
    return () => clearTimeout(t);
  }, [shown]);
  return <Text>{text.slice(0, shown)}</Text>;
}
