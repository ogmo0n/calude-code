export type Rng = () => number;

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export function pickOne<T>(list: readonly T[], rng: Rng): T {
  return list[Math.min(Math.floor(rng() * list.length), list.length - 1)];
}

const STOPWORDS = new Set(['the', 'a', 'an', 'my', 'to', 'and', 'for', 'with', 'please', 'fix', 'make', 'add']);

export function pickWord(request: string): string {
  const words = request
    .toLowerCase()
    .split(/[^a-z0-9_-]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return words.reduce((best, w) => (w.length > best.length ? w : best), '') || 'nothing';
}
