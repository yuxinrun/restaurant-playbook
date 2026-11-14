import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Article, ArticleMeta, CategoryId, SourceRef } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

let articleCache: Article[] | null = null;

function readArticles(): Article[] {
  if (articleCache) return articleCache;
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    return {
      slug,
      title: String(data.title ?? slug),
      subtitle: String(data.subtitle ?? ''),
      summary: String(data.summary ?? ''),
      category: String(data.category ?? 'operations') as CategoryId,
      tags: (data.tags ?? []) as string[],
      author: String(data.author ?? '开店不求人编辑部'),
      publishedAt: String(data.publishedAt ?? '2026-01-01'),
      updatedAt: String(data.updatedAt ?? data.publishedAt ?? '2026-01-01'),
      readingMinutes: Number(data.readingMinutes ?? 8),
      featured: Boolean(data.featured ?? false),
      editorsPick: data.editorsPick ? String(data.editorsPick) : undefined,
      cover: String(data.cover ?? 'generated'),
      coverTone: (data.coverTone ?? 'accent') as Article['coverTone'],
      chart: data.chart ? String(data.chart) : undefined,
      relatedTools: (data.relatedTools ?? []) as string[],
      relatedBooks: (data.relatedBooks ?? []) as string[],
      sources: (data.sources ?? []) as SourceRef[],
      seoDescription: String(data.seoDescription ?? data.summary ?? ''),
      body: content.trim(),
    } satisfies Article;
  });

  articleCache = articles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return articleCache;
}

export function getAllArticles(): Article[] {
  return readArticles();
}

export function getArticleMetas(): ArticleMeta[] {
  return readArticles().map(({ body: _body, ...meta }) => meta);
}

export function getArticle(slug: string): Article | undefined {
  return readArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategoryId): ArticleMeta[] {
  return getArticleMetas().filter((a) => a.category === category);
}

export function getFeaturedArticles(limit = 6): ArticleMeta[] {
  return getArticleMetas().filter((a) => a.featured).slice(0, limit);
}

export function getRecentArticles(limit = 8): ArticleMeta[] {
  return getArticleMetas().slice(0, limit);
}

export function getArticlesBySlugs(slugs: string[]): ArticleMeta[] {
  const map = new Map(getArticleMetas().map((a) => [a.slug, a]));
  return slugs.map((s) => map.get(s)).filter((a): a is ArticleMeta => Boolean(a));
}

export function getRelatedArticles(article: Article, limit = 3): ArticleMeta[] {
  const all = getArticleMetas().filter((a) => a.slug !== article.slug);
  return all
    .map((a) => ({
      article: a,
      score: (a.category === article.category ? 3 : 0)
        + a.tags.filter((t) => article.tags.includes(t)).length * 2,
    }))
    .sort((x, y) => y.score - x.score || y.article.updatedAt.localeCompare(x.article.updatedAt))
    .slice(0, limit)
    .map((x) => x.article);
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  let index = 0;
  for (const line of body.split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (match) {
      index += 1;
      headings.push({
        id: `sec-${index}`,
        text: match[2].replace(/[*_`]/g, ''),
        level: match[1].length as 2 | 3,
      });
    }
  }
  return headings;
}
