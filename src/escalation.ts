import copy from './copy.js';
import { fill } from './text.js';

export function escalationLine(count: number): string | undefined {
  const tier = copy.escalation.find((t) => t.at === count);
  return tier && fill(tier.line, { count });
}
