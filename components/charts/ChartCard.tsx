'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Database } from 'lucide-react';
import { CHART_META, getChartOption } from '@/lib/charts';
import { ChartSkeleton } from './ChartSkeleton';
import { cn } from '@/lib/utils';

const EChart = dynamic(() => import('./EChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

interface ChartCardProps {
  id: string;
  fixedCost?: number;
  variableRate?: number;
  range?: 7 | 14 | 30;
  height?: number;
  compact?: boolean;
  className?: string;
  showInsight?: boolean;
}

export function ChartCard({
  id, fixedCost, variableRate, range, height, compact = false, className, showInsight = true,
}: ChartCardProps) {
  const meta = CHART_META[id];
  const option = useMemo(
    () => getChartOption(id, { fixedCost, variableRate, range }),
    [id, fixedCost, variableRate, range],
  );
  if (!meta) return null;

  return (
    <figure className={cn('card overflow-hidden', compact ? 'p-4' : 'p-5 md:p-6', className)}>
      <figcaption className={cn(compact ? 'mb-2' : 'mb-4')}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className={cn('font-semibold tracking-[-0.02em] text-ink', compact ? 'text-[15px]' : 'text-[17px] md:text-[19px]')}>
            {meta.title}
          </h3>
          <span className="badge shrink-0 text-[10.5px]">
            <Database className="h-3 w-3" aria-hidden />
            {meta.source.includes('模拟') ? '模拟数据' : '演示数据'}
          </span>
        </div>
        {showInsight && <p className="mt-2 text-[13px] leading-relaxed text-muted md:text-[13.5px]">{meta.insight}</p>}
      </figcaption>
      <EChart option={option} height={height ?? meta.height ?? (compact ? 250 : 330)} ariaLabel={meta.title} />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-3 text-[11px] text-muted">
        <span>{meta.source}</span>
        <span className="hidden sm:inline">·</span>
        <span>悬停 / 点击查看数值</span>
      </div>
    </figure>
  );
}

export default ChartCard;
