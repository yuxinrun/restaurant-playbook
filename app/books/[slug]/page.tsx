import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Info, Star } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { books, getBook } from '@/lib/data';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: '书籍未找到' };
  return {
    title: `${book.title} · 原创读书笔记`,
    description: `${book.title}（${book.author}）核心观点、适合阅读阶段、最值得借鉴的 3 个方法与适用条件。本站只提供原创笔记与观点摘要。`,
    alternates: { canonical: pageUrl(`/books/${book.slug}`) },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const others = books.filter((b) => b.slug !== book.slug && b.region === book.region).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`书籍资源 / ${book.region} · ${book.year}`}
        title={book.title}
        description={book.originalTitle && book.originalTitle !== book.title ? book.originalTitle : book.stage}
        aside={(
          <div className="card px-6 py-5">
            <p className="text-[11.5px] uppercase tracking-[0.14em] text-muted">推荐阅读指数</p>
            <p className="mt-1 flex items-center gap-1 text-[20px] text-gold"><Star className="h-4 w-4 fill-current" aria-hidden />{'★'.repeat(book.rating)}<span className="text-[13px] text-muted">/ 5</span></p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className={`relative flex h-[340px] flex-col justify-between overflow-hidden rounded-lg border border-line p-6 ${book.coverTone === 'accent' ? 'bg-accent-soft' : book.coverTone === 'olive' ? 'bg-olive-soft' : 'bg-gold-soft'}`}>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ink/55">Restaurant Playbook / Book Notes</span>
              <div>
                <p className="font-serif text-[28px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink">{book.title}</p>
                <div className="mt-3 h-[2px] w-12 bg-accent" />
                <p className="mt-3 text-[13px] text-ink-2">{book.author}</p>
              </div>
              <p className="text-[11px] text-ink/55">原创笔记 · 非书籍封面</p>
              <span className="num pointer-events-none absolute -right-4 top-16 text-[170px] font-bold leading-none text-ink/[0.05]">{books.findIndex((b) => b.slug === book.slug) + 1}</span>
            </div>
            <dl className="card mt-4 divide-y divide-line px-5 text-[12.5px]">
              {[
                ['作者', book.author], ['出版信息', book.publisher], ['年份', book.year], ['地区', book.region], ['适合阶段', book.stage],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-2.5"><dt className="shrink-0 text-muted">{k}</dt><dd className="text-right text-ink-2">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 grid gap-2">
              <a href={book.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-between text-[13px]">{book.officialLabel} <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
              <a href={book.catalogUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary justify-between text-[13px]">公开书目检索 <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 md:p-8">
              <p className="eyebrow mb-3"><span className="eyebrow-dot" />内容简介 · 本站原创撰写</p>
              <p className="text-[17px] leading-[1.9] text-ink-2">{book.summary}</p>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em]">核心观点</h2>
              <div className="mt-4 space-y-3">
                {book.keyIdeas.map((idea, i) => (
                  <div key={idea} className="flex gap-3 rounded-[10px] border border-line bg-surface-2/50 px-4 py-3">
                    <span className="num mt-0.5 text-[12px] font-semibold text-accent">0{i + 1}</span>
                    <p className="text-[14.5px] leading-relaxed text-ink-2">{idea}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em]">最值得借鉴的 3 个方法</h2>
              <p className="mt-1.5 text-[13px] text-muted">本站把书里的思路转写成小店可执行的动作，不是原文摘录。</p>
              <ol className="mt-5 space-y-4">
                {book.threeMethods.map((m, i) => (
                  <li key={m} className="flex gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                    <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-ink">{i + 1}</span>
                    <p className="text-[15px] leading-[1.85] text-ink-2">{m}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-accent/25 bg-accent-soft/35 p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-semibold text-accent-ink"><Info className="h-4 w-4" aria-hidden />适用条件与版权说明</h2>
              <p className="mt-2.5 text-[13.5px] leading-[1.9] text-ink-2">{book.note}</p>
              <p className="mt-2.5 text-[13.5px] leading-[1.9] text-ink-2">本站只提供书籍介绍、原创读书笔记和短篇观点摘要，不转载整本书、付费章节或未经授权的电子书。请通过出版社官方页面或正规渠道购买正版。</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {book.tags.map((t) => <span key={t} className="chip"># {t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-line bg-surface-2/30">
        <div className="wrap">
          <SectionHeading eyebrow="More Books" title="同在这个书架上的还有" href="/resources#books" linkLabel="返回书籍资源" />
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((b) => (
              <Link key={b.slug} href={`/books/${b.slug}`} className="card-interactive group p-5">
                <span className="badge">{b.region} · {b.year}</span>
                <h3 className="mt-3 text-[17px] font-semibold group-hover:text-accent-ink">{b.title}</h3>
                <p className="mt-1 text-[12px] text-muted">{b.author}</p>
                <p className="mt-3 line-clamp-2 text-[12.5px] text-muted">{b.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources#books" className="btn-secondary"><ArrowLeft className="h-4 w-4" aria-hidden />返回资源库</Link>
            <Link href="/articles" className="btn-primary"><BookOpen className="h-4 w-4" aria-hidden />读实战文章 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
