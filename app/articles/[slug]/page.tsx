import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, ExternalLink, FileText, Wrench } from 'lucide-react';
import { ArticleCover } from '@/components/ui/ArticleCover';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ArticleReader } from '@/components/articles/ArticleReader';
import { FavoriteButton } from '@/components/articles/FavoriteButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { extractHeadings, getArticle, getArticleMetas, getRelatedArticles } from '@/lib/content';
import { books, categoryName, tools } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getArticleMetas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: '文章未找到' };
  return {
    title: article.title,
    description: article.seoDescription,
    keywords: article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags,
    },
    alternates: { canonical: pageUrl(`/articles/${article.slug}`) },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.body);
  const related = getRelatedArticles(article, 3);
  const relatedBooks = books.filter((b) => article.relatedBooks.includes(b.slug));
  const relatedTools = tools.filter((t) => article.relatedTools.includes(t.slug));
  const toneIndex = ({ start: 1, product: 2, operations: 3, marketing: 4, finance: 5, cases: 6 })[article.category] ?? 1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: article.author },
    publisher: { '@type': 'Organization', name: '开店不求人' },
    inLanguage: 'zh-CN',
    keywords: article.tags.join(', '),
    mainEntityOfPage: pageUrl(`/articles/${article.slug}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-line bg-paper-soft/40">
        <div className="wrap py-8 md:py-10">
          <nav aria-label="面包屑" className="mb-6 flex items-center gap-2 text-[12px] text-muted">
            <Link href="/" className="hover:text-accent-ink">首页</Link><span>/</span>
            <Link href="/articles" className="hover:text-accent-ink">全部文章</Link><span>/</span>
            <Link href={`/articles?category=${article.category}`} className="hover:text-accent-ink">{categoryName(article.category)}</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-accent">{categoryName(article.category)}</span>
            {article.editorsPick && <span className="badge badge-gold">{article.editorsPick}</span>}
            {article.tags.slice(0, 3).map((t) => <span key={t} className="badge"># {t}</span>)}
          </div>
          <h1 className="mt-5 max-w-[900px] text-[clamp(30px,4.4vw,50px)] font-semibold leading-[1.2] tracking-[-0.04em]">
            {article.title}
          </h1>
          <p className="mt-4 max-w-[760px] text-[17px] leading-relaxed text-ink-2 md:text-[18.5px]">{article.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted">
            <span>{article.author}</span>
            <span>发布于 {formatDate(article.publishedAt)}</span>
            <span>更新于 {formatDate(article.updatedAt)}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden />约 {article.readingMinutes} 分钟</span>
            <FavoriteButton slug={article.slug} title={article.title} variant="full" />
          </div>
        </div>
      </div>

      <div className="wrap py-8 md:py-10">
        <div className="relative overflow-hidden rounded-lg border border-line">
          <ArticleCover tone={article.coverTone} index={toneIndex} className="h-[190px] w-full md:h-[260px]" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/55 to-transparent px-5 pb-4 pt-12 md:px-8 md:pb-6">
            <p className="max-w-[720px] text-[14px] leading-relaxed text-white/95 md:text-[15.5px]">{article.summary}</p>
          </div>
        </div>
      </div>

      <ArticleReader article={article} headings={headings} />

      <section className="section-space border-t border-line bg-paper-soft/40">
        <div className="wrap max-w-[1040px]">
          <div className="grid gap-6 md:grid-cols-2">
            {relatedTools.length > 0 && (
              <div className="card p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-[17px] font-semibold"><Wrench className="h-4 w-4 text-olive" aria-hidden />配套工具</h2>
                <p className="mt-1.5 text-[12.5px] text-muted">读完就去算自己的数字，公式与口径都公开。</p>
                <div className="mt-4 grid gap-2">
                  {relatedTools.map((t) => (
                    <Link key={t.slug} href={`/tools/${t.slug}`} className="group flex items-center justify-between gap-2 rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] transition-colors hover:border-accent/40">
                      <span><strong className="font-medium">{t.name}</strong><span className="ml-2 text-[11.5px] text-muted">{t.short}</span></span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedBooks.length > 0 && (
              <div className="card p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-[17px] font-semibold"><BookOpen className="h-4 w-4 text-gold" aria-hidden />推荐书籍</h2>
                <p className="mt-1.5 text-[12.5px] text-muted">只提供原创笔记与观点摘要，不转载原文或付费内容。</p>
                <div className="mt-4 grid gap-2">
                  {relatedBooks.map((b) => (
                    <Link key={b.slug} href={`/books/${b.slug}`} className="group flex items-center justify-between gap-2 rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] transition-colors hover:border-accent/40">
                      <span><strong className="font-medium">{b.title}</strong><span className="ml-2 text-[11.5px] text-muted">{b.author}</span></span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card mt-6 p-5 md:p-6">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold"><FileText className="h-4 w-4 text-accent" aria-hidden />参考资料与来源说明</h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
              本文的方法分析、公式与案例均为本站原创整理；文中演示数据与模拟情景已明确标注，不能当作行业统计或真实门店经营数据。
            </p>
            <ul className="mt-4 divide-y divide-line">
              {article.sources.map((s) => (
                <li key={s.label} className="flex flex-wrap items-start justify-between gap-2 py-3">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{s.label}{s.year && <span className="ml-2 text-[11.5px] text-muted">（{s.year}）</span>}</p>
                    {s.note && <p className="mt-1 text-[12px] leading-relaxed text-muted">{s.note}</p>}
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-[12px] text-accent-ink hover:underline">
                      打开原文 <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Keep Reading" title="接着读这几篇" description="同一套口径，换个经营问题继续用。" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 3} />)}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/articles" className="btn-secondary"><ArrowLeft className="h-4 w-4" aria-hidden />返回全部文章</Link>
            <Link href="/tools" className="btn-primary">去工具箱算一笔 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
