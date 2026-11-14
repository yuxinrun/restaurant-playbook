import type { ContentType, SearchDoc } from './types';

export const TYPE_LABELS: Record<ContentType, string> = {
  article: '文章',
  book: '书籍',
  website: '网站资源',
  brand: '品牌案例',
  tool: '经营工具',
  pitfall: '避坑指南',
  tag: '标签',
};

export const TYPE_ORDER: ContentType[] = ['article', 'pitfall', 'tool', 'brand', 'book', 'website', 'tag'];

export interface SearchFilters {
  type: ContentType | 'all';
  category: string;
  tag: string;
}

export const EMPTY_FILTERS: SearchFilters = { type: 'all', category: 'all', tag: 'all' };

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '');
}

/** 中文场景下的模糊匹配：连续包含 + 顺序子序列（容忍中间插入字符）。 */
function fuzzyHit(haystack: string, needle: string): boolean {
  const h = normalize(haystack);
  const n = normalize(needle);
  if (!n) return true;
  if (h.includes(n)) return true;
  let i = 0;
  for (const ch of h) {
    if (ch === n[i]) i += 1;
    if (i >= n.length) return true;
  }
  return false;
}

export function scoreDoc(doc: SearchDoc, terms: string[]): number {
  if (terms.length === 0) return 1;
  let total = 0;
  for (const term of terms) {
    const t = normalize(term);
    if (!t) continue;
    if (normalize(doc.title).includes(t)) total += 100;
    else if (normalize(doc.subtitle).includes(t)) total += 45;
    else if (doc.tags.some((tag) => normalize(tag).includes(t))) total += 35;
    else if (normalize(doc.description).includes(t)) total += 22;
    else if (fuzzyHit(doc.keywords, t)) total += 12;
    else return 0;
    if (normalize(doc.title) === t) total += 30;
  }
  return total;
}

export function searchDocs(
  docs: SearchDoc[],
  query: string,
  filters: SearchFilters = EMPTY_FILTERS,
): SearchDoc[] {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  return docs
    .filter((doc) => filters.type === 'all' || doc.type === filters.type)
    .filter((doc) => filters.category === 'all' || doc.category === filters.category)
    .filter((doc) => filters.tag === 'all' || doc.tags.includes(filters.tag))
    .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || TYPE_ORDER.indexOf(a.doc.type) - TYPE_ORDER.indexOf(b.doc.type))
    .map((x) => x.doc);
}

export function groupByType(docs: SearchDoc[]): Array<{ type: ContentType; docs: SearchDoc[] }> {
  return TYPE_ORDER
    .map((type) => ({ type, docs: docs.filter((d) => d.type === type) }))
    .filter((g) => g.docs.length > 0);
}
