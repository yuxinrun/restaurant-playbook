const cny = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 });
const cny2 = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function yuan(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return `${decimals === 2 ? cny2.format(value) : cny.format(Math.round(value))} 元`;
}

export function wan(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `${cny2.format(value / 10000)} 万元`;
}

export function percent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function count(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(decimals);
}

export function months(value: number): string {
  if (!Number.isFinite(value)) return '无法回本';
  if (value > 600) return '超过 50 年';
  return `${value.toFixed(1)} 个月`;
}
