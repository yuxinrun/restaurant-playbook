import { Info } from 'lucide-react';
import { metrics } from '@/lib/data';
import { PALETTE } from '@/lib/charts';
import { Sparkline } from '@/components/ui/Sparkline';
import { SectionHeading } from '@/components/ui/SectionHeading';

const COLORS = [PALETTE.accent, PALETTE.gold, PALETTE.slate, PALETTE.olive];

export function MetricStrip() {
  return (
    <section className="section-space" aria-labelledby="metrics-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="今日经营观察 / Daily Numbers"
          title="8 个数字，比 80 条鸡汤管用"
          description="指标要看关系，不看单点。以下卡片全部为演示数据，用于说明计算口径与阅读方式，不是行业平均值。"
          href="/finance"
          linkLabel="去数据与财务频道"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {metrics.map((m, i) => (
            <div key={m.id} className="card-interactive group p-4 md:p-5" title={`公式：${m.formula}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12.5px] font-medium text-muted">{m.name}</p>
                <Info className="h-3.5 w-3.5 shrink-0 text-line-strong transition-colors group-hover:text-accent" aria-hidden />
              </div>
              <p className="num mt-3 text-[26px] font-semibold leading-none text-ink md:text-[32px]">
                {m.value}<span className="ml-1 text-[12px] font-medium text-muted md:text-[13px]">{m.unit}</span>
              </p>
              <Sparkline
                values={m.trend}
                color={COLORS[i % COLORS.length]}
                className="mt-4 h-8 w-full"
                label={`${m.name} ${m.trendLabel}`}
              />
              <p className="mt-2.5 line-clamp-2 min-h-[36px] text-[11.5px] leading-relaxed text-muted">{m.hint}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>演示数据声明：上述数值、走势与公式示例均用于讲解指标口径，不代表任何真实门店或行业统计。悬停卡片可查看计算口径；真实经营请代入自己的账单数据。</span>
        </p>
      </div>
    </section>
  );
}
