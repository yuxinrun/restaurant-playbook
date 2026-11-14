import { books, brands, categories, pitfalls, tools, websites, categoryName } from '@/lib/data';
import { getArticleMetas } from '@/lib/content';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteTools } from '@/lib/site-selection/data';
import type { SearchDoc } from '@/lib/types';

/** 仅在服务端调用：把分散的内容集合汇总成一份可序列化的搜索索引。 */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const a of getArticleMetas()) {
    docs.push({
      id: `article:${a.slug}`,
      type: 'article',
      title: a.title,
      subtitle: `${categoryName(a.category)} · ${a.subtitle}`,
      description: a.summary,
      url: `/articles/${a.slug}`,
      category: a.category,
      tags: a.tags,
      keywords: [a.title, a.subtitle, a.summary, ...a.tags].join(' '),
      badge: categoryName(a.category),
    });
  }

  for (const a of getSiteArticleMetas()) {
    docs.push({
      id: `site-article:${a.slug}`,
      type: 'article',
      title: a.title,
      subtitle: `选址实验室 · ${a.subtitle}`,
      description: a.summary,
      url: `/site-selection/guides/${a.slug}`,
      category: 'start',
      tags: ['选址实验室', ...a.tags],
      keywords: [a.title, a.subtitle, a.summary, ...a.tags].join(' '),
      badge: '选址实验室',
    });
  }

  for (const t of siteTools) {
    docs.push({
      id: `site-tool:${t.slug}`,
      type: 'tool',
      title: t.name,
      subtitle: `选址实验室 · ${t.short}`,
      description: t.description,
      url: `/site-selection/tools/${t.slug}`,
      tags: ['选址实验室', '选址工具'],
      keywords: [t.name, t.short, t.description, ...t.outputs, ...t.formula].join(' '),
      badge: '选址工具',
    });
  }

  for (const b of books) {
    docs.push({
      id: `book:${b.slug}`,
      type: 'book',
      title: b.title,
      subtitle: `${b.author} · ${b.year} · ${b.region}`,
      description: b.summary,
      url: `/books/${b.slug}`,
      tags: b.tags,
      keywords: [b.title, b.originalTitle ?? '', b.author, b.publisher, b.summary, ...b.keyIdeas, ...b.tags].join(' '),
      badge: '书籍',
    });
  }

  for (const w of websites) {
    docs.push({
      id: `website:${w.id}`,
      type: 'website',
      title: w.name,
      subtitle: `${w.region} · ${w.kind}`,
      description: `${w.focus} ${w.reason}`,
      url: w.url,
      tags: [w.kind, w.region],
      keywords: [w.name, w.kind, w.focus, w.reason, w.audience].join(' '),
      badge: '网站资源',
    });
  }

  for (const b of brands) {
    docs.push({
      id: `brand:${b.slug}`,
      type: 'brand',
      title: b.name,
      subtitle: `${b.region} · ${b.category} · ${b.tagline}`,
      description: b.highlight,
      url: `/brands/${b.slug}`,
      category: 'cases',
      tags: [b.region, b.category, ...b.lessons],
      keywords: [b.name, b.englishName ?? '', b.category, b.tagline, b.highlight, ...b.lessons].join(' '),
      badge: '品牌案例',
    });
  }

  for (const t of tools) {
    docs.push({
      id: `tool:${t.slug}`,
      type: 'tool',
      title: t.name,
      subtitle: t.short,
      description: t.description,
      url: `/tools/${t.slug}`,
      tags: ['工具', '计算器'],
      keywords: [t.name, t.short, t.description, ...t.outputs, ...t.formula].join(' '),
      badge: '经营工具',
    });
  }

  for (const p of pitfalls) {
    docs.push({
      id: `pitfall:${p.id}`,
      type: 'pitfall',
      title: p.title,
      subtitle: p.subtitle,
      description: `${p.where} ${p.oneLiner}`,
      url: `/pitfalls#${p.id}`,
      tags: ['避坑', p.title.replace('坑', '')],
      keywords: [p.title, p.subtitle, p.where, p.why, p.loss, p.oneLiner].join(' '),
      badge: '避坑指南',
    });
  }

  docs.push({
    id: 'site-selection:channel',
    type: 'tag',
    title: '餐饮选址实验室',
    subtitle: '独立频道 · 从找铺到签约',
    description: '16 步路线图、20 篇实战指南、8 个可保存的选址工具与 12 类数据图表。',
    url: '/site-selection',
    tags: ['选址', '选址实验室'],
    keywords: '选址 实验室 找铺 客流 租金 谈判 合同 评估报告',
    badge: '频道',
  });

  const tagSet = new Map<string, string[]>();
  for (const d of docs) {
    for (const tag of d.tags) {
      const list = tagSet.get(tag) ?? [];
      if (list.length < 3) list.push(d.title);
      tagSet.set(tag, list);
    }
  }
  for (const [tag, examples] of tagSet) {
    docs.push({
      id: `tag:${tag}`,
      type: 'tag',
      title: `# ${tag}`,
      subtitle: '关键词标签',
      description: `相关内容：${examples.join('、')}`,
      url: `/search?q=${encodeURIComponent(tag)}`,
      tags: [tag],
      keywords: [tag, ...examples].join(' '),
      badge: '标签',
    });
  }

  for (const c of categories) {
    docs.push({
      id: `category:${c.id}`,
      type: 'tag',
      title: c.name,
      subtitle: '知识频道',
      description: c.description,
      url: c.href,
      tags: [c.name],
      keywords: [c.name, c.subtitle, ...c.topics].join(' '),
      badge: '频道',
    });
  }

  return docs;
}
