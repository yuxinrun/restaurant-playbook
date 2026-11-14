import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator as CalculatorIcon, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ToolIcon } from '@/components/tools/Calculator';
import { tools } from '@/lib/data';

export const metadata: Metadata = {
  title: '实用工具箱 · 6 个真能算的餐饮计算器',
  description: '投资回报、菜品定价、盈亏平衡、房租承受力、翻台率、外卖利润：六个实时计算器，公式与计算口径全部公开。',
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="实用工具箱 / Working Tools"
        title="能算的，就别靠感觉"
        description="六个计算器，输入自己的数字立刻看结果。每条公式、每个口径都写在页面上；算错了你能自己查出来，这才叫工具。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-olive">{tools.length}</p>
            <p className="mt-1.5 text-[12.5px] text-muted">个实时计算器 · 公式公开</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((t, i) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card-interactive group flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-accent-soft text-accent-ink"><ToolIcon name={t.icon} className="h-5 w-5" /></span>
                  <span className="num text-[11px] text-muted">TOOL 0{i + 1}</span>
                </div>
                <h2 className="mt-5 text-[19px] font-semibold tracking-[-0.025em] group-hover:text-accent-ink">{t.name}</h2>
                <p className="mt-1.5 text-[13px] font-medium text-accent-ink">{t.short}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{t.description}</p>
                <p className="mt-auto pt-5 text-[12px] leading-relaxed text-ink-2">{t.explainer}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {t.outputs.slice(0, 3).map((o) => <span key={o} className="badge">{o}</span>)}
                  {t.outputs.length > 3 && <span className="badge">+{t.outputs.length - 3}</span>}
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink">打开计算器 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="How We Calculate" title="三个口径，先分清楚再算" description="财务结论最怕口径混用。本站所有工具都把公式和边界写在结果旁边。" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: '毛利率', d: '只扣食材等随单成本，回答「菜品有没有定价空间」。', f: '(售价 − 食材成本) ÷ 售价' },
              { t: '贡献利润', d: '扣完全部随单成本，回答「这一单有没有往固定成本的坑里填土」。', f: '实收 − 全部变动成本' },
              { t: '经营利润', d: '再扣人工、房租等固定成本，回答「这个月赚不赚」。未扣税、折旧与利息。', f: '贡献利润 − 固定成本' },
            ].map((x, i) => (
              <div key={x.t} className="card p-5 md:p-6">
                <span className="num text-[11px] font-semibold text-accent">0{i + 1}</span>
                <h3 className="mt-2 text-[18px] font-semibold">{x.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{x.d}</p>
                <p className="mt-4 rounded-[9px] bg-surface-2/80 px-3 py-2 font-mono text-[12px] text-accent-ink">{x.f}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-line bg-surface px-5 py-4 text-[12.5px] leading-relaxed text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>所有初始值都是演示参数，不是行业标准。计算结果属于经营口径，不构成投资、财税或法律建议；涉及食品安全、消防、劳动与税务事项，请以所在地现行法规为准。</span>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap text-center">
          <CalculatorIcon className="mx-auto h-8 w-8 text-accent" aria-hidden />
          <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em]">算完之后，去文章里看怎么用</h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14px] leading-relaxed text-muted">数字只告诉你哪里不对，文章才告诉你该改什么。工具与文章是配套的。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/articles/eight-metrics" className="btn-primary">读懂 8 个经营指标 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/finance" className="btn-secondary">去数据与财务频道</Link>
          </div>
        </div>
      </section>
    </>
  );
}
