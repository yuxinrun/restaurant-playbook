'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { CHART_META, breakevenOption } from '@/lib/charts';
import { ChartSkeleton } from './ChartSkeleton';
import { yuan } from '@/lib/format';

const EChart = dynamic(() => import('./EChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height={340} />,
});

export function BreakevenExplorer() {
  const [fixedCost, setFixedCost] = useState(49000);
  const [variableRate, setVariableRate] = useState(40);
  const [revenue, setRevenue] = useState(100000);

  const be = useMemo(() => fixedCost / (1 - variableRate / 100), [fixedCost, variableRate]);
  const option = useMemo(
    () => breakevenOption(fixedCost, variableRate / 100, revenue),
    [fixedCost, variableRate, revenue],
  );
  const profit = revenue - fixedCost - revenue * (variableRate / 100);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line bg-surface-2/50 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[17px] font-semibold text-ink">盈亏平衡分析 · 可调参数</h3>
            <p className="mt-1 text-[13px] text-muted">拖动滑块，看看固定成本怎么把保本线往右推。</p>
          </div>
          <span className="badge badge-accent">参数由你输入 · 演示计算</span>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[260px_1fr] md:p-6">
        <div className="space-y-5">
          <label className="block">
            <span className="flex justify-between text-[13px] font-medium text-ink-2">
              <span>月固定成本</span><span className="num text-accent-ink">{yuan(fixedCost)}</span>
            </span>
            <input
              type="range" min={10000} max={120000} step={1000} value={fixedCost}
              onChange={(e) => setFixedCost(Number(e.target.value))}
              className="mt-2 w-full accent-[rgb(var(--accent))]"
              aria-label="月固定成本"
            />
            <span className="text-[11px] text-muted">房租 + 人工 + 其他不随单变化的成本</span>
          </label>

          <label className="block">
            <span className="flex justify-between text-[13px] font-medium text-ink-2">
              <span>变动成本率</span><span className="num text-accent-ink">{variableRate}%</span>
            </span>
            <input
              type="range" min={10} max={80} step={1} value={variableRate}
              onChange={(e) => setVariableRate(Number(e.target.value))}
              className="mt-2 w-full accent-[rgb(var(--accent))]"
              aria-label="变动成本率"
            />
            <span className="text-[11px] text-muted">食材 + 包装 + 佣金等随单成本</span>
          </label>

          <label className="block">
            <span className="flex justify-between text-[13px] font-medium text-ink-2">
              <span>预计月营业额</span><span className="num text-accent-ink">{yuan(revenue)}</span>
            </span>
            <input
              type="range" min={20000} max={240000} step={2000} value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="mt-2 w-full accent-[rgb(var(--accent))]"
              aria-label="预计月营业额"
            />
          </label>

          <div className="rounded-[10px] border border-line bg-paper p-4">
            <p className="text-[12px] text-muted">按当前参数</p>
            <p className="num mt-1 text-[24px] font-semibold text-ink">{yuan(be)}</p>
            <p className="text-[12px] text-muted">保本营业额 / 月</p>
            <div className="mt-3 border-t border-line pt-3 text-[12.5px]">
              <span className={profit >= 0 ? 'text-olive' : 'text-accent'}>
                当前营业额下月经营利润约 {yuan(profit)}
              </span>
              <p className="mt-1 text-muted">未扣税、折旧与利息</p>
            </div>
          </div>
        </div>

        <div>
          <EChart option={option} height={340} ariaLabel={CHART_META.breakeven.title} />
          <p className="mt-1 text-[11.5px] text-muted">
            {CHART_META.breakeven.source} · 公式：保本营业额 = 固定成本 ÷（1 − 变动成本率）
          </p>
        </div>
      </div>
    </div>
  );
}
