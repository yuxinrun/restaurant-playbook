/**
 * 内容仓储层：页面只依赖这个接口，不直接依赖文件。
 *
 * 第一阶段：LocalContentRepository（Markdown + JSON，构建期静态生成）。
 * 后续接 Supabase / PostgreSQL：实现同一个 ContentRepository 接口，
 * 把 `contentRepository` 换成数据库实现即可，页面代码无需改动。
 * 写入接口契约见 docs/CONTENT_MODEL.md；只读 API 见 /api/content/[collection]。
 */
import {
  books, brands, categories, metrics, pitfalls, roadmap, sources, tools, websites,
} from '@/lib/data';
import { getArticleMetas, getAllArticles, getArticle } from '@/lib/content';
import type {
  Article, ArticleMeta, Book, BrandCase, Category, Metric, Pitfall,
  RoadmapStage, SourceRef, ToolDef, Website,
} from '@/lib/types';

export type CollectionName =
  | 'articles' | 'categories' | 'books' | 'websites' | 'brands'
  | 'tools' | 'pitfalls' | 'roadmap' | 'metrics' | 'sources';

export const COLLECTION_NAMES: CollectionName[] = [
  'articles', 'categories', 'books', 'websites', 'brands',
  'tools', 'pitfalls', 'roadmap', 'metrics', 'sources',
];

export interface ContentRepository {
  list<K extends CollectionName>(collection: K): Promise<RepositoryRow<K>[]>;
  get<K extends CollectionName>(collection: K, id: string): Promise<RepositoryRow<K> | null>;
}

export interface RepositoryRowMap {
  articles: ArticleMeta;
  categories: Category;
  books: Book;
  websites: Website;
  brands: BrandCase;
  tools: ToolDef;
  pitfalls: Pitfall;
  roadmap: RoadmapStage;
  metrics: Metric;
  sources: SourceRef;
}

export type RepositoryRow<K extends CollectionName> = K extends keyof RepositoryRowMap
  ? RepositoryRowMap[K]
  : never;

const collections: { [K in CollectionName]: RepositoryRow<K>[] } = {
  articles: getArticleMetas() as never,
  categories: categories as never,
  books: books as never,
  websites: websites as never,
  brands: brands as never,
  tools: tools as never,
  pitfalls: pitfalls as never,
  roadmap: roadmap as never,
  metrics: metrics as never,
  sources: sources as never,
};

const idOf = (row: unknown): string => {
  const r = row as Record<string, unknown>;
  return String(r.slug ?? r.id ?? r.name ?? r.label ?? '');
};

class LocalContentRepository implements ContentRepository {
  async list<K extends CollectionName>(collection: K): Promise<RepositoryRow<K>[]> {
    return (collections[collection] ?? []) as RepositoryRow<K>[];
  }

  async get<K extends CollectionName>(collection: K, id: string): Promise<RepositoryRow<K> | null> {
    const rows = (collections[collection] ?? []) as RepositoryRow<K>[];
    return rows.find((row) => idOf(row) === id) ?? null;
  }

  /** 文章正文按需读取，列表接口不携带正文，避免传输放大。 */
  async getArticleBody(slug: string): Promise<Article | null> {
    return getArticle(slug) ?? null;
  }

  async allArticleBodies(): Promise<Article[]> {
    return getAllArticles();
  }
}

export const contentRepository = new LocalContentRepository();
