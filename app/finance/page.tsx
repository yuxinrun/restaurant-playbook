import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { BreakevenExplorer } from '@/components/charts/BreakevenExplorer';
import { RevenueTrendExplorer } from '@/components/charts/RevenueTrendExplorer';
import { getArticleMetas } from '@/lib/content';
import { metrics, tools } from '@/lib/data';

export const metadata: Metadata = {
  title: '数据与财务 · 把账算清楚再谈扩张',
  description: '成本结构、毛利率、贡献利润、现金流、盈亏平衡、翻台率、坪效与人效：口径统一，附可交互图表与全部计算公式。',
};

export default function FinancePage() {
  const articles = getArticleMetas().filter((a) => a.category === 'finance').slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="数据与财务 / Numbers"
        title="菜品毛利率很高，不代表你能赚钱，毕竟员工也要吃饭"
        description="毛利、贡献利润、经营利润和现金流是四件事。这一页把口径统一，再用图表和计算器把每一层的漏点摊开。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-gold">08</p>
            <p className="mt-1.5 text-[12.5px] text-muted">个核心经营指标</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="The Vocabulary" title="先把四个口径分开，开会才不会各说各话" description="下面这张表值得打印出来贴在办公室。本站不提供任何「行业平均值」，请用自己的账单数据建立基线。" />
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13.5px]">
              <thead className="bg-surface-2/70 text-[11.5px] uppercase tracking-wider text-muted">
                <tr><th className="px-5 py-3 font-medium">口径</th><th className="px-5 py-3 font-medium">公式</th><th className="px-5 py-3 font-medium">回答什么问题</th></tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-2">
                {[
                  ['毛利率', '(营业额 − 食材成本) ÷ 营业额', '菜品本身有没有定价空间'],
                  ['边际贡献率', '(营业额 − 全部变动成本) ÷ 营业额', '每多卖一元能留下多少'],
                  ['月经营利润', '营业额 − 变动成本 − 固定成本', '这家店这个月到底赚不赚'],
                  ['现金流', '按实际收付日期记录金额', '下个月货款和工资付不付得出'],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="px-5 py-3.5 font-semibold text-ink">{row[0]}</td>
                    <td className="px-5 py-3.5 font-mono text-[12.5px] text-accent-ink">{row[1]}</td>
                    <td className="px-5 py-3.5">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.slice(0, 4).map((m) => (
              <div key={m.id} className="card p-4">
                <p className="text-[12px] text-muted">{m.name} · 演示值</p>
                <p className="num mt-1 text-[26px] font-semibold text-ink">{m.value}<span className="ml-1 text-[12px] font-normal text-muted">{m.unit}</span></p>
                <p className="mt-1 font-mono text-[11px] text-muted">{m.formula}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Interactive Charts" title="收入线与总成本线，非得相交一次" description="拖动参数看保本线怎么移动；所有比例都由演示数据或你的输入驱动，公式与单位都写在图上。" />
          <div className="space-y-5">
            <BreakevenExplorer />
            <div className="grid gap-5 lg:grid-cols-2">
              <ChartCard id="cost-structure" />
              <ChartCard id="profit-flow" />
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <ChartCard id="metric-compare" />
              <ChartCard id="channel-mix" />
            </div>
            <RevenueTrendExplorer />
            <div className="grid gap-5 lg:grid-cols-2">
              <ChartCard id="budget-allocation" />
              <ChartCard id="funnel" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Six Calculators" title="拿自己的数字，重新算一遍" href="/tools" linkLabel="打开全部工具" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card-interactive group flex items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="text-[15.5px] font-semibold group-hover:text-accent-ink">{t.name}</h3>
                  <p className="mt-1.5 text-[12.5px] text-muted">{t.short}</p>
                  <p className="mt-3 text-[11px] text-muted">输出 {t.outputs.length} 项 · 公式公开</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-line-strong transition-all group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-line bg-surface-2/30">
        <div className="wrap">
          <SectionHeading eyebrow="Keep Reading" title="算完之后，读这几篇" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 5} />)}
          </div>
        </div>
      </section>
    </>
  );
}
