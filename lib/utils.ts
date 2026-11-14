export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value: string): string {
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  return `${y}.${m}.${d}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeNumber(value: string | number, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(String(value).replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

export function highlightMatch(text: string, query: string): { before: string; hit: string; after: string } {
  if (!query) return { before: text, hit: '', after: '' };
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return { before: text, hit: '', after: '' };
  return {
    before: text.slice(0, i),
    hit: text.slice(i, i + query.length),
    after: text.slice(i + query.length),
  };
}

export function slugifyId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
}
