/**
 * 选址实验室图表配置：12 类全部有实际分析含义，工具页传入用户自己的数据，缺省时明确使用演示数据。
 * 示意分布图（competition-map）不是真实地图，页面必须标注。
 */
import type { EChartsCoreOption } from 'echarts/core';
import { siteDemo } from './data';
import { calcLeaseCost, type LeaseInput, type Scenarios } from './calc';

const C = {
  accent: '#C04A2B', olive: '#5F8468', gold: '#C08C30', ink: '#221E18',
  ink2: '#4A4238', muted: '#6E6557', line: '#E7DFCF', soft: '#F6F0E7',
  blue: '#7E9AAF', oliveSoft: '#D8E5DA',
};

const axisLabel = { color: C.muted, fontSize: 11 };
const splitLine = { lineStyle: { color: C.line, type: 'dashed' as const } };
const tooltip = { backgroundColor: '#fff', borderColor: C.line, textStyle: { color: C.ink, fontSize: 12 } };
const legend = { textStyle: { color: C.ink2, fontSize: 11 }, top: 0 };
const grid = { left: 8, right: 14, top: 34, bottom: 24, containLabel: true };

export interface SiteChartData {
  labels?: string[];
  passers?: number[];
  target?: number[];
  weekday?: number[];
  weekend?: number[];
  audience?: { name: string; value: number }[];
  competition?: { name: string; distance: number; dailyOrders: number; price: number }[];
  dimensions?: string[];
  values?: number[];
  compareValues?: number[];
  items?: { name: string; value: number; value2?: number }[];
  scenarios?: Scenarios;
  breakeven?: number;
  rents?: number[];
  profits?: number[];
  years?: { year: number; subtotal: number; cumulative: number }[];
  leaseInput?: LeaseInput;
  risks?: { name: string; value: number }[];
}

const d = siteDemo;

export function trafficTimesOption(data: SiteChartData = {}): EChartsCoreOption {
  const labels = data.labels ?? d.trafficTimes.labels;
  const passers = data.passers ?? d.trafficTimes.passers;
  const target = data.target ?? d.trafficTimes.target;
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['经过人数', '有效目标客群'] }, grid,
    xAxis: { type: 'category', data: labels, axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '人 / 时段', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '经过人数', type: 'line', smooth: true, data: passers, symbolSize: 6, lineStyle: { width: 2, color: C.blue }, itemStyle: { color: C.blue }, areaStyle: { color: 'rgba(126,154,175,0.10)' } },
      { name: '有效目标客群', type: 'line', smooth: true, data: target, symbolSize: 6, lineStyle: { width: 2.6, color: C.accent }, itemStyle: { color: C.accent } },
    ],
  } as EChartsCoreOption;
}

export function trafficWeekdayOption(data: SiteChartData = {}): EChartsCoreOption {
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['工作日', '周末'] }, grid,
    xAxis: { type: 'category', data: data.labels ?? d.weekdayWeekend.labels, axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '人 / 时段', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '工作日', type: 'bar', barMaxWidth: 28, data: data.weekday ?? d.weekdayWeekend.weekday, itemStyle: { color: C.olive, borderRadius: [4, 4, 0, 0] } },
      { name: '周末', type: 'bar', barMaxWidth: 28, data: data.weekend ?? d.weekdayWeekend.weekend, itemStyle: { color: C.accent, borderRadius: [4, 4, 0, 0] } },
    ],
  } as EChartsCoreOption;
}

export function audiencePieOption(data: SiteChartData = {}): EChartsCoreOption {
  const list = data.audience ?? d.audience;
  return {
    tooltip: { ...tooltip, trigger: 'item', formatter: '{b}: {c}% ' }, legend: { ...legend, orient: 'vertical', right: 0, top: 'middle' },
    color: [C.accent, C.olive, C.gold, C.blue, C.oliveSoft],
    series: [{ type: 'pie', radius: ['42%', '68%'], center: ['36%', '54%'], data: list.map((x) => ({ name: x.name, value: x.value })), label: { fontSize: 11, color: C.ink2 }, itemStyle: { borderColor: '#fff', borderWidth: 2 } }],
  } as EChartsCoreOption;
}

export function competitionMapOption(data: SiteChartData = {}): EChartsCoreOption {
  const list = data.competition ?? d.competition;
  return {
    tooltip: { ...tooltip, trigger: 'item', formatter: (p: { data: { name?: string; value?: number[] } }) => `${p.data?.name ?? ''}<br/>距离 ${p.data?.value?.[0] ?? ''} m · 日均约 ${p.data?.value?.[1] ?? ''} 单` },
    grid,
    xAxis: { type: 'value', name: '与候选铺步行距离（m）', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    yAxis: { type: 'value', name: '估计日均订单', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [{ type: 'scatter', data: list.map((x) => ({ name: x.name, value: [x.distance, x.dailyOrders, x.price], symbolSize: Math.max(12, x.price / 2) })), itemStyle: { color: C.accent, opacity: 0.72 }, label: { show: true, formatter: '{b}', position: 'top', fontSize: 10, color: C.ink2 } }],
  } as EChartsCoreOption;
}

export function scoreRadarOption(data: SiteChartData = {}): EChartsCoreOption {
  const dims = data.dimensions ?? d.scoreDimensions;
  const values = data.values ?? d.scoreValues;
  const compare = data.compareValues;
  return {
    tooltip: { ...tooltip, trigger: 'item' },
    legend: compare ? { ...legend, data: ['当前铺位', '对比铺位'] } : undefined,
    radar: { indicator: dims.map((name) => ({ name, max: 10 })), radius: '66%', center: ['50%', '54%'], axisName: { color: C.ink2, fontSize: 10.5 }, splitLine: { lineStyle: { color: C.line } }, splitArea: { areaStyle: { color: ['#fff', C.soft] } }, axisLine: { lineStyle: { color: C.line } } },
    series: [{ type: 'radar', data: [
      { name: '当前铺位', value: values, itemStyle: { color: C.accent }, areaStyle: { color: 'rgba(192,74,43,0.16)' }, lineStyle: { width: 2 } },
      ...(compare ? [{ name: '对比铺位', value: compare, itemStyle: { color: C.olive }, areaStyle: { color: 'rgba(95,132,104,0.12)' }, lineStyle: { width: 2 } }] : []),
    ] }],
  } as EChartsCoreOption;
}

export function rentCompareOption(data: SiteChartData = {}): EChartsCoreOption {
  const items = data.items ?? d.candidates.map((x) => ({ name: x.name, value: x.rent }));
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, grid,
    xAxis: { type: 'category', data: items.map((x) => x.name), axisLabel: { ...axisLabel, interval: 0, rotate: items.length > 3 ? 16 : 0 }, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元 / 月', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [{ type: 'bar', barMaxWidth: 44, data: items.map((x) => x.value), itemStyle: { color: C.gold, borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', fontSize: 10.5, color: C.ink2 } }],
  } as EChartsCoreOption;
}

export function leaseTrendOption(data: SiteChartData = {}): EChartsCoreOption {
  const input = data.leaseInput;
  if (!input) {
    const years = data.years ?? [1, 2, 3, 4, 5].map((year) => ({ year, subtotal: 0, cumulative: 0 }));
    return {
      tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['累计支出'] }, grid,
      xAxis: { type: 'category', data: years.map((x) => `第 ${x.year} 年`), axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
      yAxis: { type: 'value', name: '元', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
      series: [{ name: '累计支出', type: 'line', smooth: true, data: years.map((x) => x.cumulative), lineStyle: { width: 2.5, color: C.accent }, itemStyle: { color: C.accent } }],
    } as EChartsCoreOption;
  }
  const plans = calcLeaseCost(input).scenarios;
  const years = Array.from({ length: Math.max(1, Math.round(input.years)) }, (_, i) => i + 1);
  const seriesOf = (monthly: number) => years.map((y) => {
    let total = monthly * input.depositMonths;
    for (let k = 1; k <= y; k += 1) {
      total += monthly * Math.pow(1 + input.escalation, k - 1) * (12 - (k === 1 ? Math.min(input.freeMonths, 12) : 0));
      total += (input.propertyFee + input.otherFee) * 12;
    }
    return Math.round(total);
  });
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: plans.map((p) => p.name) }, grid,
    xAxis: { type: 'category', data: years.map((y) => `第 ${y} 年`), axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '累计元', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: plans.map((p, i) => ({ name: p.name, type: 'line', smooth: true, data: seriesOf(p.monthlyRent), lineStyle: { width: 2.5, color: [C.accent, C.olive, C.blue][i] }, itemStyle: { color: [C.accent, C.olive, C.blue][i] } })),
  } as EChartsCoreOption;
}

export function revenueScenariosOption(data: SiteChartData = {}): EChartsCoreOption {
  const s = data.scenarios ?? { conservative: 2700, base: 3600, optimistic: 4500, monthlyBase: 108000 };
  const be = data.breakeven ?? 3200;
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['日营业额', '保本日营业额'] }, grid,
    xAxis: { type: 'category', data: ['保守', '基准', '乐观'], axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元 / 天', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '日营业额', type: 'bar', barMaxWidth: 46, data: [s.conservative, s.base, s.optimistic], itemStyle: { color: C.olive, borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', fontSize: 10.5, color: C.ink2 } },
      { name: '保本日营业额', type: 'line', data: [be, be, be], lineStyle: { width: 2, color: C.accent, type: 'dashed' }, itemStyle: { color: C.accent }, symbol: 'none' },
    ],
  } as EChartsCoreOption;
}

export function rentProfitOption(data: SiteChartData = {}): EChartsCoreOption {
  const rents = data.rents ?? [14000, 16000, 18000, 20000, 22000];
  const profits = data.profits ?? [15000, 13000, 11000, 9000, 7000];
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, grid,
    xAxis: { type: 'category', data: rents.map((r) => `${r / 1000}k`), name: '月租', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '月经营利润 / 元', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [{ name: '月经营利润', type: 'line', smooth: true, data: profits, lineStyle: { width: 2.6, color: C.accent }, itemStyle: { color: C.accent }, markLine: { silent: true, symbol: 'none', data: [{ yAxis: 0, label: { formatter: '盈亏线', fontSize: 10 } }], lineStyle: { color: C.gold, type: 'dashed' } } }],
  } as EChartsCoreOption;
}

export function breakevenCompareOption(data: SiteChartData = {}): EChartsCoreOption {
  const items = data.items ?? d.candidates.map((x) => ({ name: x.name, value: x.breakeven, value2: x.revenue }));
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['保本营业额', '预估营业额'] }, grid,
    xAxis: { type: 'category', data: items.map((x) => x.name), axisLabel: { ...axisLabel, interval: 0, rotate: items.length > 3 ? 16 : 0 }, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元 / 月', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '保本营业额', type: 'bar', barMaxWidth: 30, data: items.map((x) => x.value), itemStyle: { color: C.accent, borderRadius: [4, 4, 0, 0] } },
      { name: '预估营业额', type: 'bar', barMaxWidth: 30, data: items.map((x) => x.value2 ?? 0), itemStyle: { color: C.olive, borderRadius: [4, 4, 0, 0] } },
    ],
  } as EChartsCoreOption;
}

export function cashOutflowOption(data: SiteChartData = {}): EChartsCoreOption {
  const years = data.years ?? calcLeaseCost({ quote: 18000, target: 16000, exitPrice: 15000, years: 3, depositMonths: 2, freeMonths: 2, escalation: 0.03, propertyFee: 1800, otherFee: 600 }).years;
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, legend: { ...legend, data: ['当年支出', '累计支出'] }, grid,
    xAxis: { type: 'category', data: years.map((x) => `第 ${x.year} 年`), axisLabel, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '当年支出', type: 'bar', barMaxWidth: 36, data: years.map((x) => x.subtotal), itemStyle: { color: C.gold, borderRadius: [4, 4, 0, 0] } },
      { name: '累计支出', type: 'line', smooth: true, data: years.map((x) => x.cumulative), lineStyle: { width: 2.5, color: C.accent }, itemStyle: { color: C.accent } },
    ],
  } as EChartsCoreOption;
}

export function riskDistributionOption(data: SiteChartData = {}): EChartsCoreOption {
  const risks = data.risks ?? d.riskDistribution;
  return {
    tooltip: { ...tooltip, trigger: 'axis' }, grid: { ...grid, left: 8, right: 30 },
    xAxis: { type: 'value', name: '风险项数', nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    yAxis: { type: 'category', data: risks.map((x) => x.name), axisLabel: { ...axisLabel, color: C.ink2 }, axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false } },
    series: [{ type: 'bar', barMaxWidth: 20, data: risks.map((x) => x.value), itemStyle: { color: C.accent, borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', fontSize: 10.5, color: C.ink2 } }],
  } as EChartsCoreOption;
}

const BUILDERS: Record<string, (data: SiteChartData) => EChartsCoreOption> = {
  'traffic-times': trafficTimesOption,
  'traffic-weekday': trafficWeekdayOption,
  'audience-pie': audiencePieOption,
  'competition-map': competitionMapOption,
  'score-radar': scoreRadarOption,
  'rent-compare': rentCompareOption,
  'lease-trend': leaseTrendOption,
  'revenue-scenarios': revenueScenariosOption,
  'rent-profit': rentProfitOption,
  'breakeven-compare': breakevenCompareOption,
  'cash-outflow': cashOutflowOption,
  'risk-distribution': riskDistributionOption,
};

export const SITE_CHART_IDS = Object.keys(BUILDERS);

export function getSiteChartOption(id: string, data: SiteChartData = {}): EChartsCoreOption {
  return (BUILDERS[id] ?? trafficTimesOption)(data);
}
