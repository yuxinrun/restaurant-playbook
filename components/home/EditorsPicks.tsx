import Link from 'next/link';
import { ArrowUpRight, BookMarked, Calculator, Globe2, Sparkles } from 'lucide-react';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { books, picks, tools } from '@/lib/data';
import { getArticlesBySlugs, getRecentArticles } from '@/lib/content';

export function EditorsPicks() {
  const mustRead = getArticlesBySlugs([picks.mustRead])[0];
  const topTen = getArticlesBySlugs(picks.topTen);
  const recent = getArticlesBySlugs(picks.recentCases);
  const picksTools = tools.filter((t) => picks.toolPicks.includes(t.slug));
  const overseas = getArticlesBySlugs(picks.overseas);
  const latest = getRecentArticles(3);

  return (
    <section className="section-space">
      <div className="wrap">
        <SectionHeading
          eyebrow="编辑精选 / Editor's Picks"
          title="这周先读这几篇，其他的以后再说"
          description="编辑部按「能不能明天就用上」挑内容。看到这里就想全做完，通常一条也做不成。"
          href="/articles"
          linkLabel="全部文章"
        />

        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
          <div className="space-y-8">
            {mustRead && <ArticleCard article={mustRead} variant="feature" index={4} />}

            <div className="card p-5 md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow mb-1.5"><span className="eyebrow-dot" />Start Here</p>
                  <h3 className="text-[20px] font-semibold tracking-[-0.025em] md:text-[23px]">老板必学的 10 个知识</h3>
                </div>
                <span className="num text-[36px] font-semibold leading-none text-accent/15">10</span>
              </div>
              <ol className="grid gap-x-6 sm:grid-cols-2">
                {topTen.map((a, i) => (
                  <li key={a.slug} className="border-b border-line last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                    <Link href={`/articles/${a.slug}`} className="group flex items-start gap-3 py-3">
                      <span className="num mt-0.5 w-6 shrink-0 text-[12.5px] font-semibold text-accent/70">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[14px] leading-relaxed text-ink-2 transition-colors group-hover:text-accent-ink">{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[12px] text-muted">建议一次只读一篇，读完去店里改一件事。</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-5 md:p-6">
              <h3 className="mb-1 flex items-center gap-2 text-[17px] font-semibold"><Sparkles className="h-4 w-4 text-accent" aria-hidden />最近更新的内容</h3>
              <p className="mb-4 text-[12.5px] text-muted">新写的几篇，都从「明天能改哪一件事」出发。</p>
              <div className="space-y-3">
                {[...recent, ...latest.filter((a) => !picks.recentCases.includes(a.slug))].slice(0, 3).map((a) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="group flex items-start justify-between gap-3 rounded-[9px] border border-line bg-surface-2/40 p-3 transition-colors hover:border-accent/40">
                    <span className="text-[13.5px] leading-snug text-ink-2 group-hover:text-accent-ink">{a.title}</span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  </Link>
                ))}
              </div>
              <Link href="/brands" className="link-underline mt-4 text-[12.5px]">去看 20 个品牌案例 <ArrowUpRight className="h-3 w-3" aria-hidden /></Link>
            </div>

            <div className="card p-5 md:p-6">
              <h3 className="mb-1 flex items-center gap-2 text-[17px] font-semibold"><Calculator className="h-4 w-4 text-olive" aria-hidden />值得收藏的餐饮工具</h3>
              <p className="mb-4 text-[12.5px] text-muted">都能算，不是静态展示。公式与口径全部公开。</p>
              <div className="grid gap-2">
                {picksTools.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="group flex items-center justify-between gap-3 rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] transition-colors hover:border-olive/50 hover:bg-olive-soft/40">
                    <span className="text-ink-2 group-hover:text-ink">{t.name}</span>
                    <span className="shrink-0 text-[11.5px] text-muted">{t.short}</span>
                  </Link>
                ))}
              </div>
              <Link href="/tools" className="link-underline mt-4 text-[12.5px]">打开全部 6 个工具 <ArrowUpRight className="h-3 w-3" aria-hidden /></Link>
            </div>

            <div className="card p-5 md:p-6">
              <h3 className="mb-1 flex items-center gap-2 text-[17px] font-semibold"><Globe2 className="h-4 w-4 text-gold" aria-hidden />国外餐饮经营经验</h3>
              <p className="mb-4 text-[12.5px] text-muted">先问它解决什么问题，再问国内小店能不能用。</p>
              <div className="space-y-2.5">
                {overseas.map((a) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="block text-[13.5px] leading-snug text-ink-2 hover:text-accent-ink">· {a.title}</Link>
                ))}
                <Link href={`/books/${books[0]?.slug ?? ''}`} className="flex items-center gap-1.5 pt-1 text-[13px] text-accent-ink hover:underline">
                  <BookMarked className="h-3.5 w-3.5" aria-hidden />从原版书里补方法
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
