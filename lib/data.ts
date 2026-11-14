import categoriesJson from '@/content/data/categories.json';
import roadmapJson from '@/content/data/roadmap.json';
import metricsJson from '@/content/data/metrics.json';
import booksJson from '@/content/data/books.json';
import websitesJson from '@/content/data/websites.json';
import brandsJson from '@/content/data/brands.json';
import pitfallsJson from '@/content/data/pitfalls.json';
import toolsJson from '@/content/data/tools.json';
import sourcesJson from '@/content/data/sources.json';
import problemsJson from '@/content/data/problems.json';
import picksJson from '@/content/data/picks.json';
import topicsJson from '@/content/data/topics.json';
import linkCheckJson from '@/content/data/link-check.json';
import type {
  Book, BrandCase, Category, LinkCheckReport, Metric, Pitfall, RoadmapStage,
  SourceRef, ToolDef, Website,
} from './types';

export const categories = categoriesJson as Category[];
export const roadmap = roadmapJson as RoadmapStage[];
export const metrics = metricsJson as Metric[];
export const books = booksJson as Book[];
export const websites = websitesJson as Website[];
export const brands = brandsJson as BrandCase[];
export const pitfalls = pitfallsJson as Pitfall[];
export const tools = toolsJson as ToolDef[];
export const sources = sourcesJson as SourceRef[];
export const problems = problemsJson as { question: string; query: string; category: string }[];
export const topics = topicsJson as {
  id: string;
  title: string;
  description: string;
  links: { label: string; url: string }[];
  reading: string;
}[];
export const picks = picksJson as {
  mustRead: string;
  topTen: string[];
  recentCases: string[];
  toolPicks: string[];
  overseas: string[];
};
export const linkCheck = linkCheckJson as LinkCheckReport;

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
);

export function categoryName(id: string): string {
  return categoryMap[id]?.name ?? id;
}

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBrand(slug: string): BrandCase | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getPitfall(id: string): Pitfall | undefined {
  return pitfalls.find((p) => p.id === id);
}
