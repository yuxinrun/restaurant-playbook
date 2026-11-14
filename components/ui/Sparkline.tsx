import { PALETTE } from '@/lib/charts';

interface SparklineProps {
  values: number[];
  color?: string;
  className?: string;
  label?: string;
}

export function Sparkline({ values, color = PALETTE.accent, className, label = '趋势' }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 26 - ((v - min) / span) * 20;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = `M ${points.join(' L ')}`;
  const area = `${line} L 100,30 L 0,30 Z`;
  const id = `spark-${color.replace('#', '')}-${values.length}-${Math.round(max * 100)}`;

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy={points[points.length - 1]?.split(',')[1] ?? '15'} r="1.6" fill={color} />
    </svg>
  );
}
