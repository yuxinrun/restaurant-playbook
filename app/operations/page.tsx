import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleAlert, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { getArticleMetas } from '@/lib/content';
import { categories, pitfalls, tools } from '@/lib/data';

export const metadata: Metadata = {
  title: '经营管理 · 问题导向的门店实战手册',
  description: '出餐慢、员工流失、食材损耗、忙而不赚：按真实经营问题组织的门店运营知识，含 SOP、排班、损耗与瓶颈管理方法。',
};

const QUESTIONS = [
  { q: '为什么营业额增长了，利润反而下降？', slug: 'busy-but-broke', tag: '财务口径' },
  { q: '厨房出菜太慢怎么办？', slug: 'slow-kitchen', tag: '后厨效率' },
  { q: '员工总是流失、制度落不下去怎么办？', slug: 'small-team-rules', tag: '团队管理' },
  { q: '如何控制食材损耗？', slug: 'food-waste-control', tag: '库存采购' },
  { q: '为什么菜单越做越复杂？', slug: 'menu-profit-machine', tag: '菜单结构' },
  { q: '店里天天排队，怎么还是不赚钱？', slug: 'eight-metrics', tag: '指标复盘' },
];

const TOPICS = categories.find((c) => c.id === 'operations')?.topics ?? [];

export default function OperationsPage() {
  const articles = getArticleMetas();
  const opsArticles = articles.filter((a) => ['operations', 'finance', 'product'].includes(a.category)).slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="经营管理 / Operations"
        title="老板每天最忙的时候，通常是发现自己什么都没管好的时候"
        description="不按理论章节，按你今天真正烦的那个问题来。每个问题都给出原因、常见错误做法、可执行步骤和可核算的口径。"
        aside={
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-olive">08</p>
            <p className="mt-1.5 text-[12.5px] text-muted">个门店运营主题</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="What Is Wrong Today" title="你现在卡在哪一个问题？" description="挑一个点进去，别一次改十件事。改完记得只追一个指标。" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {QUESTIONS.map((item, i) => (
              <Link key={item.q} href={`/articles/${item.slug}`} className="card-interactive group flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="badge badge-olive">{item.tag}</span>
                  <span className="num text-[11px] text-muted">Q{i + 1}</span>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.02em] group-hover:text-accent-ink">{item.q}</h3>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[12.5px] font-medium text-accent-ink">读方法与步骤 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {TOPICS.map((t) => <span key={t} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2">{t}</span>)}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Measure, Then Fix" title="流程问题，先看数据再动手" description="人效与损耗是门店最容易被感觉误导的两组数字。下面均为演示数据，用于说明读图方式。" />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard id="staff-efficiency" />
            <ChartCard id="inventory" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { t: '先测，再改', d: '记录一个高峰时段的等待时间，找出真正卡住的那一环。' },
              { t: '一次只改一件事', d: '同时改菜单、排班和活动，指标一动就不知道归谁。' },
              { t: '把标准写下来', d: '标准只存在老板脑子里，员工就只能等指令。' },
            ].map((x, i) => (
              <div key={x.t} className="card p-5">
                <span className="num text-[11px] font-semibold text-accent">0{i + 1}</span>
                <h3 className="mt-2 text-[16px] font-semibold">{x.t}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading eyebrow="Deep Dives" title="把方法写成能执行的步骤" href="/articles" linkLabel="全部文章" />
            <div className="grid gap-4 sm:grid-cols-2">
              {opsArticles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 2} />)}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="card p-5 md:p-6">
              <CircleAlert className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[17px] font-semibold">运营里最常见的三个坑</h3>
              <div className="mt-3 grid gap-2">
                {pitfalls.filter((p) => ['people', 'purchase', 'menu'].includes(p.id)).map((p) => (
                  <Link key={p.id} href={`/pitfalls#${p.id}`} className="group flex items-start justify-between gap-2 rounded-[9px] border border-line px-3 py-2.5 text-[13px] transition-colors hover:border-accent/40">
                    <span><strong className="font-semibold">{p.title}</strong><span className="mt-0.5 block text-[11.5px] text-muted">{p.oneLiner}</span></span>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-5 md:p-6">
              <Wrench className="h-5 w-5 text-olive" aria-hidden />
              <h3 className="mt-3 text-[17px] font-semibold">拿数字说话</h3>
              <div className="mt-3 grid gap-2">
                {tools.filter((t) => ['turnover', 'breakeven', 'pricing'].includes(t.slug)).map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="chip justify-between"><span>{t.name}</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
