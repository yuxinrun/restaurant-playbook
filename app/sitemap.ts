import type { MetadataRoute } from 'next';
import { getArticleMetas } from '@/lib/content';
import { books, brands, categories, tools } from '@/lib/data';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

// GitHub Pages 静态导出要求 metadata route 明确声明静态渲染。
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    '/', '/guide', '/operations', '/menu', '/marketing', '/finance', '/brands',
    '/resources', '/tools', '/articles', '/pitfalls', '/search', '/favorites', '/about',
    '/site-selection', '/site-selection/roadmap', '/site-selection/guides',
    '/site-selection/fieldwork', '/site-selection/negotiation', '/site-selection/lease',
    '/site-selection/cases', '/site-selection/tools', '/site-selection/charts',
    '/site-selection/reports',
  ];

  return [
    ...staticPaths.map((path) => ({ url: pageUrl(path), lastModified: now, changeFrequency: 'weekly' as const, priority: path === '/' ? 1 : 0.7 })),
    ...getArticleMetas().map((a) => ({ url: pageUrl(`/articles/${a.slug}`), lastModified: new Date(a.updatedAt), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...getSiteArticleMetas().map((a) => ({ url: pageUrl(`/site-selection/guides/${a.slug}`), lastModified: new Date(a.updatedAt), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...siteTools.map((t) => ({ url: pageUrl(`/site-selection/tools/${t.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...books.map((b) => ({ url: pageUrl(`/books/${b.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...brands.map((b) => ({ url: pageUrl(`/brands/${b.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...tools.map((t) => ({ url: pageUrl(`/tools/${t.slug}`), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...categories.map((c) => ({ url: pageUrl(c.href), lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
