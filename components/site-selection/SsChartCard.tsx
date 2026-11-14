'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/charts/ChartSkeleton';
import { CHART_LABELS } from '@/lib/site-selection/data';
import { getSiteChartOption, type SiteChartData } from '@/lib/site-selection/charts';

const EChart = dynamic(() => import('@/components/charts/EChart'), {
  ssr: false,
  loading: () => <ChartSkeleton height={280} />,
});

interface Props {
  id: string;
  data?: SiteChartData;
  height?: number;
  title?: string;
  note?: string;
  compact?: boolean;
  live?: boolean;
}

export function SsChartCard({ id, data, height = 280, title, note, compact, live }: Props) {
  const meta = CHART_LABELS[id];
  const option = useMemo(() => getSiteChartOption(id, data), [id, data]);

  return (
    <figure className="card overflow-hidden">
      {!compact && (
        <figcaption className="border-b border-line px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{title ?? meta?.title ?? '选址数据图'}</p>
          <p className="mt-1 text-[14px] font-medium text-ink">{meta?.question ?? '这张图在回答什么？'}</p>
        </figcaption>
      )}
      <div className="px-3 pt-3">
        <EChart option={option} height={height} ariaLabel={title ?? meta?.title ?? '选址数据分析图'} />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3 text-[11.5px] text-muted">
        <span className={live ? 'badge badge-olive' : 'badge'}>{live ? '参数由你输入 · 实时更新' : '演示数据'}</span>
        <span>{note ?? meta?.note ?? '用于说明计算口径，不代表行业平均值'}</span>
      </div>
    </figure>
  );
}
