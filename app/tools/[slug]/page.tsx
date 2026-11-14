import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Calculator, ToolIcon } from '@/components/tools/Calculator';
import { getArticleMetas } from '@/lib/content';
import { tools, getTool } from '@/lib/data';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: '工具未找到' };
  return {
    title: `${tool.name} · 在线计算`,
    description: `${tool.description} 公式与计算口径全部公开，结果实时计算。`,
    alternates: { canonical: pageUrl(`/tools/${tool.slug}`) },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const others = tools.filter((t) => t.slug !== tool.slug).slice(0, 3);
  const articles = getArticleMetas().filter((a) => a.relatedTools.includes(tool.slug)).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="实用工具 / Calculator"
        title={tool.name}
        description={tool.description}
        aside={(
          <div className="card flex items-center gap-3 px-6 py-5">
            <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-accent-soft text-accent-ink"><ToolIcon name={tool.icon} className="h-5 w-5" /></span>
            <div><p className="text-[12px] text-muted">实时计算</p><p className="text-[14px] font-semibold">{tool.outputs.length} 项结果</p></div>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-2/50 px-5 py-4">
            <p className="text-[13.5px] text-ink-2"><strong className="font-semibold text-ink">这个工具解决什么：</strong>{tool.explainer}</p>
            <Link href="/tools" className="inline-flex items-center gap-1 text-[12.5px] text-accent-ink hover:underline"><ArrowLeft className="h-3.5 w-3.5" aria-hidden />全部工具</Link>
          </div>
          <Calculator tool={tool} />
        </div>
      </section>

      <section className="section-space border-t border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Read Next" title="算出来的数字，怎么用？" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 2} />)}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Other Tools" title="顺便把这几笔账也算一下" />
          <div className="grid gap-3 sm:grid-cols-3">
            {others.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card-interactive group flex items-center justify-between gap-3 p-5">
                <div><h3 className="text-[15px] font-semibold group-hover:text-accent-ink">{t.name}</h3><p className="mt-1 text-[12px] text-muted">{t.short}</p></div>
                <ArrowRight className="h-4 w-4 shrink-0 text-line-strong transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
