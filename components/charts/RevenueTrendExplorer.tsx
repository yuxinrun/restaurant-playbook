'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { revenueTrendOption } from '@/lib/charts';
import { ChartSkeleton } from './ChartSkeleton';
import { cn } from '@/lib/utils';

const EChart = dynamic(() => import('./EChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height={300} />,
});

const RANGES = [7, 14, 30] as const;

export function RevenueTrendExplorer() {
  const [range, setRange] = useState<7 | 14 | 30>(14);
  const option = useMemo(() => revenueTrendOption(range), [range]);

  return (
    <div className="card p-5 md:p-6">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-semibold text-ink">每日营业额趋势</h3>
          <p className="mt-1 text-[13px] text-muted">营业额涨了，要拆开看是订单多了还是客单价高了。</p>
        </div>
        <div className="inline-flex rounded-[10px] border border-line bg-surface-2 p-1" role="group" aria-label="时间范围">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-[7px] px-3 py-1 text-[12.5px] font-medium transition-colors',
                range === r ? 'bg-surface text-ink shadow-hair' : 'text-muted hover:text-ink',
              )}
              aria-pressed={range === r}
            >
              近 {r} 天
            </button>
          ))}
        </div>
      </div>
      <EChart option={option} height={300} ariaLabel="每日营业额趋势图" />
      <p className="mt-2 border-t border-line pt-3 text-[11.5px] text-muted">演示数据 · 用于说明指标关系，不是行业平均值</p>
    </div>
  );
}
