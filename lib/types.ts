/** 全站统一内容模型。第一阶段由本地 Markdown / JSON 提供，字段与数据库表一一对应。 */

export type CategoryId = 'start' | 'product' | 'operations' | 'marketing' | 'finance' | 'cases';

export type ContentType = 'article' | 'book' | 'website' | 'brand' | 'tool' | 'pitfall' | 'tag';

export interface SourceRef {
  label: string;
  url?: string;
  note?: string;
  year?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  subtitle: string;
  description: string;
  href: string;
  topics: string[];
  tone: 'accent' | 'olive' | 'gold';
  index: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category: CategoryId;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  featured: boolean;
  editorsPick?: string;
  cover: string;
  coverTone: 'accent' | 'olive' | 'gold';
  chart?: string;
  relatedTools: string[];
  relatedBooks: string[];
  sources: SourceRef[];
  seoDescription: string;
  body: string;
}

export type ArticleMeta = Omit<Article, 'body'>;

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  phase: string;
  goal: string;
  tasks: string[];
  mistakes: string[];
  articles: string[];
  tools: string[];
}

export interface Metric {
  id: string;
  name: string;
  value: string;
  unit: string;
  hint: string;
  trend: number[];
  trendLabel: string;
  formula: string;
}

export interface Book {
  slug: string;
  title: string;
  originalTitle?: string;
  author: string;
  region: '国内' | '国外';
  publisher: string;
  year: string;
  isbn?: string;
  coverTone: 'accent' | 'olive' | 'gold';
  summary: string;
  keyIdeas: string[];
  threeMethods: string[];
  stage: string;
  rating: number;
  tags: string[];
  officialUrl: string;
  officialLabel: string;
  catalogUrl: string;
  note?: string;
}

export interface Website {
  id: string;
  name: string;
  region: string;
  kind: string;
  focus: string;
  reason: string;
  url: string;
  audience: string;
  linkStatus: 'verified' | 'partial' | 'unverified';
  statusNote?: string;
}

export interface BrandCase {
  slug: string;
  name: string;
  englishName?: string;
  region: '国内' | '国外';
  category: string;
  origin: string;
  tagline: string;
  highlight: string;
  lessons: string[];
  sections: {
    intro: string;
    positioning: string;
    audience: string;
    product: string;
    menuPricing: string;
    businessModel: string;
    operations: string;
    marketing: string;
    costControl: string;
    learn: string;
    dontCopy: string;
    sourcesNote: string;
  };
  sources: SourceRef[];
  dataNote: string;
}

export interface Pitfall {
  id: string;
  title: string;
  subtitle: string;
  where: string;
  why: string;
  scenario: string;
  scenarioType: '模拟情景' | '公开报道整理';
  loss: string;
  fix: string[];
  oneLiner: string;
  relatedArticle?: string;
}

export interface ToolField {
  key: string;
  label: string;
  unit: string;
  default: number;
  min: number;
  max: number;
  step: number;
  kind: 'number' | 'percent';
  group: string;
  hint: string;
}

export interface ToolDef {
  slug: string;
  name: string;
  short: string;
  description: string;
  explainer: string;
  icon: string;
  outputs: string[];
  formula: string[];
  caveats: string[];
  fields: ToolField[];
}

export interface SearchDoc {
  id: string;
  type: ContentType;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  category?: string;
  tags: string[];
  keywords: string;
  badge: string;
}

export interface LinkCheckReport {
  checkedAt: string;
  total: number;
  ok: number;
  results: Record<string, { status: number | string; finalUrl?: string }>;
}
