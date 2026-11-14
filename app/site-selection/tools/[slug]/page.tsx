import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Database, FileDown, Smartphone } from 'lucide-react';
import { ToolsClient } from '@/components/site-selection/tools/ToolsClient';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteToolBySlug, siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return siteTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = siteToolBySlug(slug);
  if (!tool) return { title: '工具未找到' };
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: pageUrl(`/site-selection/tools/${slug}`) },
  };
}

export default async function SiteToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = siteToolBySlug(slug);
  if (!tool) notFound();

  const index = siteTools.findIndex((t) => t.slug === slug);
  const prev = siteTools[index - 1];
  const next = siteTools[index + 1];
  const related = getSiteArticleMetas().filter((a) => a.tools.includes(slug)).slice(0, 4);

  return (
    <>
      <div className="border-b border-line bg-paper-soft/40">
        <div className="wrap py-9 md:py-12">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-muted" aria-label="面包屑">
            <Link href="/site-selection" className="hover:text-accent-ink">选址实验室</Link><span>/</span>
            <Link href="/site-selection/tools" className="hover:text-accent-ink">实战工具</Link><span>/</span>
            <span className="text-ink-2">{tool.name}</span>
          </nav>
          <p className="eyebrow mb-3"><span className="eyebrow-dot" />TOOL {String(index + 1).padStart(2, '0')} / {String(siteTools.length).padStart(2, '0')}</p>
          <h1 className="max-w-[860px] text-[clamp(28px,3.8vw,42px)] font-semibold leading-[1.2] tracking-[-0.035em]">{tool.name}</h1>
          <p className="mt-3 max-w-[720px] text-[15.5px] leading-relaxed text-ink-2">{tool.short}。{tool.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tool.outputs.map((o) => <span key={o} className="badge">{o}</span>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5"><Database className="h-3.5 w-3.5" aria-hidden />保存在本机 · <code className="num">{tool.storage}</code></span>
            <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" aria-hidden />{tool.mobile ? '适合现场手机使用' : '建议在电脑上填写'}</span>
            <span className="inline-flex items-center gap-1.5"><FileDown className="h-3.5 w-3.5" aria-hidden />支持导出 / 打印（以工具内按钮为准）</span>
          </div>
        </div>
      </div>

      <div className="section-space">
        <div className="wrap">
          <ToolsClient slug={slug} tool={tool} />
        </div>
      </div>

      <section className="section-space border-t border-line bg-paper-soft/40">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="text-[20px] font-semibold">这个工具在流程里的位置</h2>
            <p className="mt-2 max-w-[720px] text-[13.2px] leading-relaxed text-ink-2">工具输出的是「基于你输入数据的估算」，不是结论。把结果写进评估报告时，同时把没填的、没核实的、只听房东说过的部分列成待核实问题，签约前逐条关闭。</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/site-selection/roadmap" className="btn-secondary text-[12.5px]">看 16 步流程</Link>
              <Link href="/site-selection/charts" className="btn-secondary text-[12.5px]">看图表口径</Link>
              <Link href="/site-selection/reports" className="btn-secondary text-[12.5px]">生成评估报告</Link>
            </div>
          </div>
          <aside className="card p-5">
            <h3 className="text-[15px] font-semibold">配套阅读</h3>
            {related.length ? (
              <ul className="mt-3 space-y-2 text-[13px]">
                {related.map((a) => <li key={a.slug}><Link href={`/site-selection/guides/${a.slug}`} className="text-accent-ink hover:underline">{a.title}</Link></li>)}
              </ul>
            ) : (
              <p className="mt-3 text-[12.8px] leading-relaxed text-muted">这个工具的方法说明写在 <Link href="/site-selection/guides" className="text-accent-ink hover:underline">实战指南</Link> 中，也可查看页面底部的公式口径。</p>
            )}
          </aside>
        </div>
      </section>

      <div className="wrap flex flex-wrap items-center justify-between gap-3 pb-14">
        {prev ? (
          <Link href={`/site-selection/tools/${prev.slug}`} className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink"><ArrowLeft className="h-4 w-4" aria-hidden />{prev.name}</Link>
        ) : <Link href="/site-selection/tools" className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink"><ArrowLeft className="h-4 w-4" aria-hidden />全部工具</Link>}
        {next ? (
          <Link href={`/site-selection/tools/${next.slug}`} className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink">{next.name}<ArrowRight className="h-4 w-4" aria-hidden /></Link>
        ) : <Link href="/site-selection/reports" className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-accent-ink">生成评估报告<ArrowRight className="h-4 w-4" aria-hidden /></Link>}
      </div>
    </>
  );
}
