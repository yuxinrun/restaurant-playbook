import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3, ExternalLink, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SiteArticleReader } from '@/components/site-selection/SiteArticleReader';
import { SiteArticleCard } from '@/components/site-selection/SiteArticleCard';
import {
  getSiteArticle, getSiteArticleMetas, getSiteHeadings, getSiteRelated,
} from '@/lib/site-selection/content';
import { siteToolBySlug, siteTopics } from '@/lib/site-selection/data';
import { formatDate } from '@/lib/utils';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getSiteArticleMetas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getSiteArticle(slug);
  if (!article) return { title: '文章未找到' };
  return {
    title: article.title,
    description: article.seoDescription,
    keywords: article.tags,
    openGraph: {
      type: 'article', title: article.title, description: article.seoDescription,
      publishedTime: article.publishedAt, modifiedTime: article.updatedAt, tags: article.tags,
    },
    alternates: { canonical: pageUrl(`/site-selection/guides/${slug}`) },
  };
}

export default async function SiteGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getSiteArticle(slug);
  if (!article) notFound();

  const headings = getSiteHeadings(article.body);
  const related = getSiteRelated(article, 3);
  const metas = getSiteArticleMetas();
  const index = metas.findIndex((a) => a.slug === slug);
  const prev = metas[index - 1];
  const next = metas[index + 1];
  const topic = siteTopics.find((t) => t.id === article.topic);
  const tools = article.tools.map((s) => siteToolBySlug(s)).filter((t) => t !== undefined);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: '开店不求人编辑部' },
    publisher: { '@type': 'Organization', name: '开店不求人 · 餐饮选址实验室' },
    inLanguage: 'zh-CN',
    keywords: article.tags.join(','),
    mainEntityOfPage: pageUrl(`/site-selection/guides/${slug}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-line bg-paper-soft/40">
        <div className="wrap py-9 md:py-12">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-muted" aria-label="面包屑">
            <Link href="/site-selection" className="hover:text-accent-ink">选址实验室</Link><span>/</span>
            <Link href="/site-selection/guides" className="hover:text-accent-ink">实战指南</Link><span>/</span>
            <Link href={`/site-selection/guides?topic=${article.topic}`} className="hover:text-accent-ink">{topic?.title ?? '选址实战'}</Link>
          </nav>
          <p className="eyebrow mb-3"><span className="eyebrow-dot" />GUIDE {String(article.order).padStart(2, '0')} · {topic?.english ?? 'Site selection'}</p>
          <h1 className="max-w-[900px] text-[clamp(30px,4.2vw,48px)] font-semibold leading-[1.18] tracking-[-0.04em]">{article.title}</h1>
          <p className="mt-4 max-w-[780px] text-[16px] leading-relaxed text-ink-2">{article.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {article.tags.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[12px] text-muted">
            <span>开店不求人编辑部</span>
            <span>发布 {formatDate(article.publishedAt)} · 更新 {formatDate(article.updatedAt)}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden />约 {article.readingMinutes} 分钟</span>
            <span>{headings.length} 个小节</span>
          </div>
        </div>
      </div>

      <SiteArticleReader title={article.title} body={article.body} headings={headings} />

      <section className="section-space border-t border-line bg-paper-soft/40">
        <div className="wrap">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-[17px] font-semibold"><Wrench className="h-4.5 w-4.5 text-accent" aria-hidden />配套工具，用自己的数字算一遍</h2>
              <p className="mt-2 text-[12.8px] leading-relaxed text-muted">文章里的示例数字用于说明方法，请用现场记录替换后再看结论。</p>
              {tools.length ? (
                <ul className="mt-4 space-y-2">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/site-selection/tools/${t.slug}`} className="flex items-center justify-between gap-3 rounded-[9px] border border-line bg-surface px-3.5 py-2.5 text-[13.5px] hover:border-accent/40 hover:text-accent-ink">
                        <span>{t.name}<span className="ml-2 text-[11.5px] text-muted">{t.short}</span></span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-[13px] text-muted">本文为方法综述，可从 <Link href="/site-selection/tools" className="text-accent-ink hover:underline">全部工具</Link> 中选择。</p>}
              <Link href="/site-selection/reports" className="mt-4 inline-flex items-center gap-1.5 text-[12.8px] font-medium text-accent-ink hover:underline">把结果写进评估报告 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
            </div>

            <div className="card p-5 md:p-6">
              <h2 className="text-[17px] font-semibold">资料来源与口径说明</h2>
              <p className="mt-2 text-[12.8px] leading-relaxed text-ink-2">文中公式、表格与话术为经营方法整理，示例数字与案例均为演示或模拟，不代表行业平均值。涉及许可、消防、租赁与财税事项，请以所在地现行法规、监管部门要求及当地专业人士意见为准。</p>
              {article.sources.length ? (
                <ul className="mt-4 space-y-2.5">
                  {article.sources.map((s) => (
                    <li key={s.label} className="text-[12.8px] leading-relaxed">
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent-ink hover:underline">{s.label}<ExternalLink className="h-3 w-3" aria-hidden /></a>
                      ) : <span className="font-medium text-ink">{s.label}</span>}
                      {s.note && <span className="ml-1 text-muted">— {s.note}</span>}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-[12.8px] text-muted">本文不依赖外部数据，方法口径已在正文中逐项说明。</p>}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <SectionHeading eyebrow="Keep Reading" title="接着读这三篇" href="/site-selection/guides" linkLabel="返回全部指南" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a, i) => <SiteArticleCard key={a.slug} article={a} index={i} />)}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
            {prev ? (
              <Link href={`/site-selection/guides/${prev.slug}`} className="inline-flex max-w-[46%] items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink"><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden /><span className="truncate">{prev.title}</span></Link>
            ) : <Link href="/site-selection/guides" className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink"><ArrowLeft className="h-4 w-4" aria-hidden />全部指南</Link>}
            {next ? (
              <Link href={`/site-selection/guides/${next.slug}`} className="inline-flex max-w-[46%] items-center justify-end gap-1.5 text-right text-[13px] text-ink-2 hover:text-accent-ink"><span className="truncate">{next.title}</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>
            ) : <Link href="/site-selection/reports" className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink">生成评估报告<ArrowRight className="h-4 w-4" aria-hidden /></Link>}
          </div>
        </div>
      </section>
    </>
  );
}
