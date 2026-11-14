import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { ChartCard } from '@/components/charts/ChartCard';
import { BreakevenExplorer } from '@/components/charts/BreakevenExplorer';
import { RevenueTrendExplorer } from '@/components/charts/RevenueTrendExplorer';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ChartShowcase() {
  return (
    <section className="section-space border-y border-line bg-paper-soft/40">
      <div className="wrap">
        <SectionHeading
          eyebrow="经营知识图表 / Data, But Useful"
          title="每张图都得帮你回答一个经营问题"
          description="图表不是装饰。下面每张图都标了口径、单位和数据性质；没有可靠来源的地方，我们老老实实写「演示数据」。"
          href="/finance"
          linkLabel="看更多财务方法"
        />

        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard id="cost-structure" />
            <ChartCard id="profit-flow" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <BreakevenExplorer />
            <aside className="card flex flex-col justify-between bg-surface-2/60 p-5 md:p-6">
              <div>
                <span className="badge badge-gold"><Lightbulb className="h-3 w-3" aria-hidden />读图提示</span>
                <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.02em]">为什么收入线和成本线非得相交？</h3>
                <p className="mt-3 text-[14px] leading-[1.85] text-ink-2">
                  固定成本是一条水平线：不管今天卖 10 单还是 100 单，房租都得付。变动成本随营业额上升，所以总成本线有斜率。两条线交点之前，你在给房东和员工打工；交点之后，才是给自己挣。
                </p>
                <p className="mt-3 text-[14px] leading-[1.85] text-ink-2">
                  把滑块里的固定成本调高，交点会立刻往右移——这就是「装修超支」在第二年才来找你算账的原因。
                </p>
              </div>
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[12px] text-muted">口径：月固定成本 ÷（1 − 变动成本率）。未扣税、折旧与利息。</p>
                <Link href="/tools/breakeven" className="link-underline mt-3 text-[13px]">用计算器算自己的店 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
              </div>
            </aside>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard id="menu-engineering" />
            <ChartCard id="channel-mix" />
          </div>

          <RevenueTrendExplorer />

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 md:px-6">
            <p className="text-[13.5px] text-ink-2">
              <span className="font-semibold text-ink">还有更多图：</span>经营漏斗、复购趋势、菜品排行、人效、库存周转、预算分配……都放在各频道里，每张都带解释。
            </p>
            <Link href="/finance" className="btn-secondary shrink-0 text-[13px]">去数据与财务频道 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
