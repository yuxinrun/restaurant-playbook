'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, FunnelChart, LineChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts';
import {
  GraphicComponent, GridComponent, LegendComponent, MarkAreaComponent,
  MarkLineComponent, MarkPointComponent, RadarComponent, TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart, FunnelChart, RadarChart,
  GridComponent, TooltipComponent, LegendComponent, GraphicComponent, RadarComponent,
  MarkLineComponent, MarkAreaComponent, MarkPointComponent,
  CanvasRenderer,
]);

interface EChartProps {
  option: EChartsCoreOption;
  height?: number;
  ariaLabel?: string;
}

/** 只在这里引入 ECharts，按需注册图表类型，并由 ChartCard 动态加载，避免影响首屏。 */
export default function EChart({ option, height = 320, ariaLabel = '餐饮经营数据图表' }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = instance;
    const observer = new ResizeObserver(() => instance.resize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      instance.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div
      ref={containerRef}
      className="w-full animate-fade-in"
      style={{ height, minHeight: 220 }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
