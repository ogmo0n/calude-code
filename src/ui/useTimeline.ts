import { useEffect, useState } from 'react';

// Advances a step counter every `ms` until `steps` is reached, then calls onEnd once.
export function useTimeline(steps: number, ms: number, onEnd?: () => void): number {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps) {
      onEnd?.();
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [step]);
  return step;
}
