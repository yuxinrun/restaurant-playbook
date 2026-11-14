import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { ArticleCover } from '@/components/ui/ArticleCover';
import type { ArticleMeta } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface HeroProps {
  feature: ArticleMeta;
  counts: { articles: number; channels: number; tools: number; brands: number; books: number };
}

export function Hero({ feature, counts }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/5 blur-3xl" aria-hidden />
      <div className="wrap relative py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="eyebrow mb-6">
              <span className="eyebrow-dot" />
              ISSUE 01 · 2026 · 持续更新的餐饮经营杂志
            </p>
            <h1 className="text-[clamp(38px,5.4vw,68px)] font-semibold leading-[1.14] tracking-[-0.045em] text-ink">
              开一家店不难，<br />
              难的是<span className="relative whitespace-nowrap text-accent">一直赚钱<span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-accent/15" aria-hidden /></span>。
            </h1>
            <p className="mt-7 max-w-[580px] text-[16.5px] leading-[1.85] text-ink-2 md:text-[18px]">
              从选址、菜单、供应链，到营销、管理和利润，用真实经验帮你把餐饮店经营明白。
            </p>
            <div className="mt-5 border-l-[3px] border-accent/70 pl-4">
              <p className="font-serif text-[16px] italic leading-relaxed text-accent-ink md:text-[17.5px]">
                这里不卖开店暴富梦，只研究怎么少亏钱、多赚钱。
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/guide" className="btn-primary px-5 py-3 text-[14.5px]">
                <BookOpen className="h-4 w-4" aria-hidden />开店前，先看这份指南<ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/operations" className="btn-secondary px-5 py-3 text-[14.5px]">
                我已经开店了，帮我解决问题
              </Link>
            </div>
            <p className="mt-5 text-[12.5px] text-muted">不用一次读完 · 只挑今天能用的一条 · 需要时回来查</p>
          </div>

          <div className="animate-fade-up space-y-4" style={{ animationDelay: '100ms' }}>
            <div className="card-interactive group relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-5 py-3">
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />编辑推荐 · 本周必读
                </span>
                <span className="num text-[11px] text-muted">{formatDate(feature.updatedAt)}</span>
              </div>
              <Link href={`/articles/${feature.slug}`} className="block">
                <ArticleCover tone={feature.coverTone} index={4} className="h-44 w-full transition-transform duration-500 group-hover:scale-[1.03] md:h-48" />
                <div className="p-5 md:p-6">
                  <span className="badge badge-accent">{feature.editorsPick ?? '本周必读'}</span>
                  <h2 className="mt-3 text-[21px] font-semibold leading-[1.35] tracking-[-0.025em] text-ink transition-colors group-hover:text-accent-ink md:text-[24px]">
                    {feature.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{feature.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink">
                    读这一篇 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </div>

            <div className="rounded-lg border border-line bg-ink p-5 text-paper md:p-6">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-paper/55">这本杂志里有什么</p>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {[
                  { value: counts.articles, label: '篇实战文章' },
                  { value: counts.channels, label: '大知识频道' },
                  { value: counts.tools, label: '个真能算的工具' },
                  { value: counts.brands, label: '个品牌案例' },
                  { value: counts.books, label: '本经营书籍' },
                  { value: '100%', label: '标注来源' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="num text-[24px] font-semibold leading-none text-paper md:text-[27px]">{item.value}</p>
                    <p className="mt-1 text-[11.5px] text-paper/60">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/15 pt-4 text-[12px] leading-relaxed text-paper/60">
                所有演示数据都会标注，所有模拟案例都会说明。不把假数据包装成行业平均值。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
