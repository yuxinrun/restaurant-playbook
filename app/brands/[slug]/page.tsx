import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Info, Lightbulb, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { getArticleMetas } from '@/lib/content';
import { brands, getBrand } from '@/lib/data';
import type { BrandCase } from '@/lib/types';
import { pageUrl } from '@/lib/site';

interface PageProps { params: Promise<{ slug: string }> }

const SECTIONS: Array<{ key: keyof BrandCase['sections']; label: string }> = [
  { key: 'intro', label: '品牌简介' },
  { key: 'positioning', label: '品类与定位' },
  { key: 'audience', label: '目标客群' },
  { key: 'product', label: '核心产品' },
  { key: 'menuPricing', label: '菜单和定价特点' },
  { key: 'businessModel', label: '商业模式' },
  { key: 'operations', label: '门店运营特色' },
  { key: 'marketing', label: '营销方式' },
  { key: 'costControl', label: '成本控制方法' },
  { key: 'learn', label: '值得学习的经验' },
  { key: 'dontCopy', label: '不适合直接照搬的地方' },
  { key: 'sourcesNote', label: '参考来源说明' },
];

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: '品牌案例未找到' };
  return {
    title: `${brand.name} 案例分析 · ${brand.tagline}`,
    description: `${brand.name}（${brand.category}）的经营模式拆解：定位、产品、菜单定价、运营、营销、成本控制，以及哪些方法不适合普通餐饮店照搬。`,
    alternates: { canonical: pageUrl(`/brands/${brand.slug}`) },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const relatedArticles = getArticleMetas().filter((a) => a.category === 'cases' || a.tags.includes('品牌案例')).slice(0, 3);
  const others = brands.filter((b) => b.slug !== brand.slug && b.region === brand.region).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`品牌案例 / ${brand.region} · ${brand.category}`}
        title={brand.name}
        description={brand.tagline}
        aside={(
          <div className="card px-6 py-5">
            <p className="text-[11.5px] uppercase tracking-[0.14em] text-muted">Origin</p>
            <p className="mt-1 text-[16px] font-semibold text-ink">{brand.origin}</p>
            <p className="mt-3 text-[11.5px] uppercase tracking-[0.14em] text-muted">Case No.</p>
            <p className="num mt-1 text-[20px] font-semibold text-accent">{String(brands.findIndex((b) => b.slug === brand.slug) + 1).padStart(2, '0')}</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="rounded-lg border border-accent/25 bg-accent-soft/35 p-5 md:p-6">
                <p className="eyebrow mb-2 !text-accent-ink"><span className="eyebrow-dot" />一句话看点</p>
                <p className="text-[17px] font-medium leading-relaxed text-ink md:text-[19px]">{brand.highlight}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {brand.lessons.map((l) => <span key={l} className="badge badge-accent">{l}</span>)}
                </div>
              </div>

              <div className="mt-6 space-y-0">
                {SECTIONS.map((s, i) => (
                  <section key={s.key} id={`case-${i + 1}`} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[160px_1fr] sm:gap-6">
                    <div>
                      <span className="num text-[11px] font-semibold text-accent">{String(i + 1).padStart(2, '0')} / 12</span>
                      <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.02em]">{s.label}</h2>
                    </div>
                    <p className="text-[14.5px] leading-[1.9] text-ink-2">{brand.sections[s.key]}</p>
                  </section>
                ))}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="card p-5 md:p-6">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold"><Lightbulb className="h-4 w-4 text-olive" aria-hidden />普通小店先学这个</h3>
                <p className="mt-2.5 text-[13px] leading-[1.85] text-ink-2">{brand.sections.learn}</p>
                <Link href="/tools" className="link-underline mt-4 text-[12.5px]">用工具验证一下 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
              </div>

              <div className="rounded-lg border border-accent/25 bg-surface p-5 md:p-6">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-accent-ink"><ShieldAlert className="h-4 w-4" aria-hidden />别急着照搬</h3>
                <p className="mt-2.5 text-[13px] leading-[1.85] text-ink-2">{brand.sections.dontCopy}</p>
              </div>

              <div className="card p-5 md:p-6">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold"><Info className="h-4 w-4 text-gold" aria-hidden />数据口径</h3>
                <p className="mt-2.5 text-[12.5px] leading-[1.85] text-muted">{brand.dataNote}</p>
              </div>

              <div className="card p-5 md:p-6">
                <h3 className="text-[15px] font-semibold">参考来源</h3>
                <ul className="mt-3 space-y-2">
                  {brand.sources.map((s) => (
                    <li key={s.label}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-2 rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink">
                          <span>{s.label}</span><ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                        </a>
                      ) : <p className="text-[12.5px] text-ink-2">· {s.label}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-space border-t border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="More Cases" title="同地区还可以对比这几个" href="/brands" linkLabel="返回案例库" />
          <div className="grid gap-3 sm:grid-cols-3">
            {others.map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="card-interactive group p-5">
                <span className="badge">{b.category}</span>
                <h3 className="mt-3 text-[17px] font-semibold group-hover:text-accent-ink">{b.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-[12.5px] text-muted">{b.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Method Over Story" title="把案例变成自己的动作" description="看别人的故事很爽，回去算自己的账才有用。" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 6} />)}
          </div>
          <Link href="/brands" className="btn-secondary mt-8"><ArrowLeft className="h-4 w-4" aria-hidden />返回全部案例</Link>
        </div>
      </section>
    </>
  );
}
