/** 独立的轻骨架组件：不要从 EChart.tsx 引入，否则会把 ECharts 拉进首屏包。 */
export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-surface-2/60" style={{ height }} aria-hidden>
      <div className="absolute inset-0 flex items-end gap-3 px-8 pb-10">
        {[42, 68, 52, 82, 60, 74, 48].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-line/70 animate-pulse"
            style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted">图表加载中…</span>
    </div>
  );
}
