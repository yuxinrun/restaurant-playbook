import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { SourceRef } from '@/lib/types';
import { extractHeadings, type Heading } from '@/lib/content';
import type { SiteArticle, SiteArticleMeta } from './types';

const DIR = path.join(process.cwd(), 'content', 'site-selection', 'articles');
let cache: SiteArticle[] | null = null;

function readAll(): SiteArticle[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return [];
  const list = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
    const slug = file.replace(/\.md$/, '');
    return {
      slug,
      title: String(data.title ?? slug),
      subtitle: String(data.subtitle ?? ''),
      summary: String(data.summary ?? ''),
      topic: String(data.topic ?? 'strategy'),
      order: Number(data.order ?? 99),
      tags: (data.tags ?? []) as string[],
      readingMinutes: Number(data.readingMinutes ?? 9),
      publishedAt: String(data.publishedAt ?? '2026-11-14'),
      updatedAt: String(data.updatedAt ?? data.publishedAt ?? '2026-11-14'),
      charts: (data.charts ?? []) as string[],
      tools: (data.tools ?? []) as string[],
      sources: (data.sources ?? []) as SourceRef[],
      seoDescription: String(data.seoDescription ?? data.summary ?? ''),
      body: content.trim(),
    } satisfies SiteArticle;
  });
  cache = list.sort((a, b) => a.order - b.order);
  return cache;
}

export function getSiteArticles(): SiteArticle[] { return readAll(); }

export function getSiteArticleMetas(): SiteArticleMeta[] {
  return readAll().map(({ body: _body, ...meta }) => meta);
}

export function getSiteArticle(slug: string): SiteArticle | undefined {
  return readAll().find((a) => a.slug === slug);
}

export function getSiteArticlesByTopic(topic: string): SiteArticleMeta[] {
  return getSiteArticleMetas().filter((a) => a.topic === topic);
}

export function getSiteHeadings(body: string): Heading[] { return extractHeadings(body); }

export function getSiteRelated(article: SiteArticle, limit = 3): SiteArticleMeta[] {
  return getSiteArticleMetas()
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, score: (a.topic === article.topic ? 3 : 0) + a.tags.filter((t) => article.tags.includes(t)).length * 2 }))
    .sort((x, y) => y.score - x.score || x.a.order - y.a.order)
    .slice(0, limit)
    .map((x) => x.a);
}
