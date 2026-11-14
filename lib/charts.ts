import type { EChartsOption } from 'echarts';

/** 与 app/globals.css 的设计 Token 保持一致（ECharts canvas 需要具体色值）。 */
export const PALETTE = {
  accent: '#C04A2B',
  accentSoft: '#E7A184',
  accentPale: '#F6DCCF',
  ink: '#221E18',
  ink2: '#4A4238',
  muted: '#8A7F6D',
  line: '#E7DFCF',
  olive: '#5F8468',
  oliveSoft: '#A9C6B0',
  gold: '#C08C30',
  goldSoft: '#E6CE96',
  slate: '#7C8FA6',
  paper: '#FAF7F1',
  white: '#FFFFFF',
} as const;

export const DEMO_LABEL = '演示数据 · 用于说明计算方法，不是行业平均值';

export interface ChartMeta {
  title: string;
  insight: string;
  source: string;
  height?: number;
}

export const CHART_META: Record<string, ChartMeta> = {
  'cost-structure': {
    title: '一张营业额，最后落在谁口袋里',
    insight: '食材只占一部分。人工与房租是刚性的，营业额一掉，利润会比收入跌得更快。',
    source: DEMO_LABEL,
  },
  'profit-flow': {
    title: '利润是「漏」出来的，不是「算」出来的',
    insight: '从营业额到经营利润，每一层都在漏钱。把每一层的口径固定下来，才知道该先堵哪一个口子。',
    source: DEMO_LABEL,
  },
  'budget-allocation': {
    title: '开店预算最容易漏掉的是「活下去的钱」',
    insight: '装修和设备一次性花完，流动资金却常被忘掉。没有 3–6 个月的缓冲，试错期就是生死期。',
    source: DEMO_LABEL,
  },
  breakeven: {
    title: '盈亏平衡：卖到多少才开始真正赚钱',
    insight: '收入线与总成本线的交点就是保本营业额。固定成本越高，这条线越往右移。',
    source: '参数由你输入 · 计算方法演示',
  },
  'menu-engineering': {
    title: '菜单工程：把菜放进四个象限',
    insight: '横轴看销量，纵轴看单份毛利。明星要守住，现金牛要控成本，潜力品要推，问题品该下就下。',
    source: '模拟菜单数据 · 非任何真实门店经营数据',
  },
  'revenue-trend': {
    title: '营业额、订单量与客单价要一起看',
    insight: '营业额涨了但订单量没涨，多半是提价或补贴；三个指标拆开，才知道增长从哪来。',
    source: DEMO_LABEL,
  },
  'metric-compare': {
    title: '指标对比：先看偏离，再找原因',
    insight: '把本店实际值与自己设定的目标线并排放，差值最大的那一项通常就是本月要处理的题目。',
    source: DEMO_LABEL + '；目标线为自设管理目标',
  },
  funnel: {
    title: '顾客漏斗：生意不好不一定卡在营销',
    insight: '曝光、进店、下单、复购，每一环都会掉人。不复盘就投流量，等于往漏桶里加水。',
    source: DEMO_LABEL,
  },
  'repeat-trend': {
    title: '复购率趋势：新客买热闹，老客买日子',
    insight: '一次开业活动能把曲线拉高，能不能留住取决于产品与服务是否稳定。',
    source: DEMO_LABEL,
  },
  'dish-ranking': {
    title: '销量排行不等于利润排行',
    insight: '卖得最多的菜，可能只是替你招呼客人；毛利额排在前面的菜，才在替你交房租。',
    source: '模拟菜单数据 · 非任何真实门店经营数据',
  },
  'channel-mix': {
    title: '外卖与堂食：营业额与贡献利润分开看',
    insight: '外卖营业额占比高，不代表贡献利润占比高；佣金、包装与补贴都要从这一单里出。',
    source: DEMO_LABEL,
  },
  'staff-efficiency': {
    title: '人效：排班表其实是财务表',
    insight: '同样的人工成本，落在高峰时段和低谷时段，产出的营业额完全不同。',
    source: DEMO_LABEL,
  },
  inventory: {
    title: '库存周转与损耗：钱躺在冰箱里也会坏',
    insight: '周转天数越长，占用资金越多、损耗越高；采购的「便宜」常常被损耗吃掉。',
    source: DEMO_LABEL,
  },
};

const font = 'var(--font-sans)';

const tooltipBase = {
  backgroundColor: PALETTE.white,
  borderColor: PALETTE.line,
  borderWidth: 1,
  padding: [10, 13],
  textStyle: { color: PALETTE.ink, fontSize: 12.5, fontFamily: font },
  extraCssText: 'border-radius:10px;box-shadow:0 12px 32px -18px rgba(66,48,24,.5);',
};

const axisLabel = { color: PALETTE.muted, fontSize: 11, fontFamily: font };
const axisLine = { show: true, lineStyle: { color: PALETTE.line } };
const splitLine = { show: true, lineStyle: { color: PALETTE.line, type: 'dashed' as const, opacity: 0.75 } };

const legendBase = {
  bottom: 0,
  icon: 'roundRect',
  itemWidth: 10,
  itemHeight: 10,
  itemGap: 16,
  textStyle: { color: PALETTE.ink2, fontSize: 11.5, fontFamily: font },
};

function yuanShort(v: number): string {
  return Math.abs(v) >= 10000 ? `${(v / 10000).toFixed(1)}万` : `${Math.round(v)}`;
}

export function costStructureOption(): EChartsOption {
  const data = [
    { name: '食材成本', value: 32, itemStyle: { color: PALETTE.accent } },
    { name: '人工成本', value: 24, itemStyle: { color: PALETTE.gold } },
    { name: '房租成本', value: 12, itemStyle: { color: PALETTE.slate } },
    { name: '水电燃气', value: 5, itemStyle: { color: PALETTE.accentSoft } },
    { name: '营销费用', value: 4, itemStyle: { color: PALETTE.oliveSoft } },
    { name: '其他费用', value: 8, itemStyle: { color: '#CFC3AE' } },
    { name: '经营利润', value: 15, itemStyle: { color: PALETTE.olive } },
  ];
  return {
    color: [PALETTE.accent, PALETTE.gold, PALETTE.slate, PALETTE.accentSoft, PALETTE.oliveSoft, '#CFC3AE', PALETTE.olive],
    tooltip: { ...tooltipBase, trigger: 'item', formatter: '{b}：<b>{c}%</b><br/>占月营业额（演示数据）' },
    legend: { ...legendBase, type: 'scroll', width: '92%' },
    series: [{
      type: 'pie',
      radius: ['46%', '70%'],
      center: ['50%', '44%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: PALETTE.white, borderWidth: 2, borderRadius: 4 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11.5, color: PALETTE.ink2, lineHeight: 16 },
      labelLine: { length: 8, length2: 8, lineStyle: { color: PALETTE.line } },
      data,
    }],
    graphic: [{
      type: 'text', left: 'center', top: '40%',
      style: { text: '100%\n月营业额', textAlign: 'center', fill: PALETTE.muted, fontSize: 12, lineHeight: 18 },
    }],
  } as EChartsOption;
}

export function profitFlowOption(): EChartsOption {
  const stages = ['营业额', '食材', '人工', '房租', '其他', '经营利润'];
  const values = [100, 32, 24, 12, 17, 15];
  const helper = [0, 68, 44, 32, 15, 0];
  return {
    tooltip: {
      ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        const p = (params as Array<{ dataIndex: number }>)[0];
        return p ? `${stages[p.dataIndex]}：<b>${values[p.dataIndex]}%</b> 营业额` : '';
      },
    },
    grid: { left: 8, right: 12, top: 24, bottom: 34, containLabel: true },
    xAxis: { type: 'category', data: stages, axisLabel, axisLine, axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine, axisLine: { show: false } },
    series: [
      { type: 'bar', stack: 'total', silent: true, itemStyle: { color: 'transparent' }, data: helper, barWidth: '46%' },
      {
        type: 'bar', stack: 'total', barWidth: '46%',
        label: { show: true, position: 'top', formatter: (p: { dataIndex: number }) => `${values[p.dataIndex]}%`, color: PALETTE.ink, fontSize: 11.5, fontWeight: 600 },
        data: values.map((v, i) => ({
          value: v,
          itemStyle: { color: i === 0 ? PALETTE.ink : i === values.length - 1 ? PALETTE.olive : PALETTE.accent, borderRadius: [4, 4, 0, 0], opacity: i === 0 || i === values.length - 1 ? 1 : 0.78 },
        })),
      },
    ],
  } as EChartsOption;
}

export function budgetAllocationOption(): EChartsOption {
  const data = [
    { name: '装修', value: 28 }, { name: '房租押金', value: 18 }, { name: '设备', value: 18 },
    { name: '流动资金', value: 18 }, { name: '人员工资', value: 8 },
    { name: '首批原材料', value: 5 }, { name: '营销', value: 5 },
  ];
  return {
    tooltip: { ...tooltipBase, trigger: 'item', formatter: '{b}：<b>{c}%</b><br/>占初始投入（演示数据）' },
    legend: { ...legendBase, type: 'scroll', width: '92%' },
    series: [{
      type: 'pie', radius: ['44%', '68%'], center: ['50%', '44%'],
      itemStyle: { borderColor: PALETTE.white, borderWidth: 2, borderRadius: 4 },
      label: { formatter: '{b} {d}%', fontSize: 11.5, color: PALETTE.ink2 },
      labelLine: { length: 8, length2: 8, lineStyle: { color: PALETTE.line } },
      data,
      color: [PALETTE.accent, PALETTE.gold, PALETTE.slate, PALETTE.olive, PALETTE.accentSoft, PALETTE.goldSoft, PALETTE.oliveSoft],
    }],
  } as EChartsOption;
}

export function breakevenOption(fixedCost: number, variableRate: number, maxRevenue?: number): EChartsOption {
  const rate = Math.min(0.95, Math.max(0, variableRate));
  const contribution = 1 - rate;
  const be = contribution > 0 ? fixedCost / contribution : Infinity;
  const max = Math.max(maxRevenue ?? 0, Number.isFinite(be) ? be * 1.65 : fixedCost * 3, 10000);
  const step = max / 10;
  const xs = Array.from({ length: 11 }, (_, i) => Math.round(i * step));
  return {
    tooltip: {
      ...tooltipBase, trigger: 'axis',
      formatter: (params: unknown) => {
        const arr = params as Array<{ seriesName: string; value: number; axisValue: string; color: string }>;
        const head = `月营业额 ${yuanShort(Number(arr[0]?.axisValue ?? 0))} 元<br/>`;
        return head + arr.map((p) => `${p.seriesName}：<b>${yuanShort(Number(p.value))} 元</b>`).join('<br/>');
      },
    },
    legend: { ...legendBase, data: ['营业收入', '固定成本', '变动成本', '总成本'] },
    grid: { left: 8, right: 16, top: 22, bottom: 38, containLabel: true },
    xAxis: {
      type: 'category', data: xs.map(String), name: '月营业额（元）', nameLocation: 'middle', nameGap: 28,
      nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
      axisLabel: { ...axisLabel, formatter: (v: string) => yuanShort(Number(v)) },
      axisLine, axisTick: { show: false },
    },
    yAxis: {
      type: 'value', name: '金额（元）', nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
      axisLabel: { ...axisLabel, formatter: (v: number) => yuanShort(v) }, splitLine, axisLine: { show: false },
    },
    series: [
      {
        name: '营业收入', type: 'line', data: xs, smooth: false, symbol: 'none',
        lineStyle: { width: 2.5, color: PALETTE.olive }, itemStyle: { color: PALETTE.olive },
        markLine: Number.isFinite(be) ? {
          silent: true, symbol: 'none',
          lineStyle: { color: PALETTE.accent, type: 'dashed', width: 1.5 },
          label: { formatter: `保本 ${yuanShort(be)}`, color: PALETTE.accent, fontSize: 11, position: 'insideEndTop' },
          data: [{ xAxis: Math.min(10, Math.round(be / step)) }],
        } : undefined,
      },
      { name: '固定成本', type: 'line', data: xs.map(() => fixedCost), symbol: 'none', lineStyle: { width: 1.8, color: PALETTE.slate, type: 'dashed' }, itemStyle: { color: PALETTE.slate } },
      { name: '变动成本', type: 'line', data: xs.map((x) => Math.round(x * rate)), symbol: 'none', lineStyle: { width: 1.8, color: PALETTE.gold }, itemStyle: { color: PALETTE.gold } },
      { name: '总成本', type: 'line', data: xs.map((x) => Math.round(fixedCost + x * rate)), symbol: 'none', lineStyle: { width: 2.5, color: PALETTE.accent }, itemStyle: { color: PALETTE.accent }, areaStyle: { color: 'rgba(192,74,43,0.05)' } },
    ],
  } as EChartsOption;
}

export interface MenuDish {
  name: string;
  sold: number;
  margin: number;
  quadrant: string;
}

export const MENU_DISHES: MenuDish[] = [
  { name: '招牌牛肉面', sold: 320, margin: 21, quadrant: '明星产品' },
  { name: '秘制卤蛋', sold: 285, margin: 5.5, quadrant: '现金牛产品' },
  { name: '酸辣粉', sold: 260, margin: 17, quadrant: '明星产品' },
  { name: '冰镇酸梅汤', sold: 240, margin: 12, quadrant: '明星产品' },
  { name: '炸鸡块', sold: 210, margin: 9, quadrant: '现金牛产品' },
  { name: '时令小菜', sold: 195, margin: 6, quadrant: '现金牛产品' },
  { name: '手工水饺', sold: 130, margin: 19, quadrant: '潜力产品' },
  { name: '菌菇汤', sold: 110, margin: 16, quadrant: '潜力产品' },
  { name: '红烧牛腩饭', sold: 85, margin: 23, quadrant: '潜力产品' },
  { name: '凉拌三丝', sold: 72, margin: 8, quadrant: '问题产品' },
  { name: '海鲜炒饭', sold: 45, margin: 11, quadrant: '问题产品' },
  { name: '季节限定甜品', sold: 28, margin: 7, quadrant: '问题产品' },
];

export function menuEngineeringOption(): EChartsOption {
  const avgSold = 175;
  const avgMargin = 13;
  const groups = [
    { name: '明星产品', color: PALETTE.olive, dishes: MENU_DISHES.filter((d) => d.quadrant === '明星产品') },
    { name: '现金牛产品', color: PALETTE.gold, dishes: MENU_DISHES.filter((d) => d.quadrant === '现金牛产品') },
    { name: '潜力产品', color: PALETTE.slate, dishes: MENU_DISHES.filter((d) => d.quadrant === '潜力产品') },
    { name: '问题产品', color: PALETTE.accent, dishes: MENU_DISHES.filter((d) => d.quadrant === '问题产品') },
  ];
  return {
    tooltip: {
      ...tooltipBase, trigger: 'item',
      formatter: (p: unknown) => {
        const d = (p as { data: { name: string; value: number[]; quadrant: string } }).data;
        return `<b>${d.name}</b><br/>周销量：${d.value[0]} 份<br/>单份毛利：${d.value[1]} 元<br/>分类：${d.quadrant}`;
      },
    },
    legend: { ...legendBase, data: groups.map((g) => g.name) },
    grid: { left: 8, right: 20, top: 22, bottom: 40, containLabel: true },
    xAxis: {
      type: 'value', name: '周销量（份）', nameLocation: 'middle', nameGap: 27,
      nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
      min: 0, max: 360, axisLabel, axisLine, splitLine,
    },
    yAxis: {
      type: 'value', name: '单份毛利（元）', nameTextStyle: { color: PALETTE.muted, fontSize: 11 },
      min: 0, max: 28, axisLabel, axisLine, splitLine,
    },
    series: groups.map((g) => ({
      name: g.name, type: 'scatter', symbolSize: 15,
      itemStyle: { color: g.color, opacity: 0.85, borderColor: PALETTE.white, borderWidth: 1.5 },
      label: { show: true, position: 'right', formatter: (p: { data: { name: string } }) => p.data.name, fontSize: 10.5, color: PALETTE.ink2 },
      data: g.dishes.map((d) => ({ name: d.name, value: [d.sold, d.margin], quadrant: d.quadrant })),
      markLine: g.name === '明星产品' ? {
        silent: true, symbol: 'none', lineStyle: { color: PALETTE.muted, type: 'dashed', width: 1 },
        label: { show: false }, data: [{ xAxis: avgSold }, { yAxis: avgMargin }],
      } : undefined,
      markArea: g.name === '明星产品' ? {
        silent: true, itemStyle: { color: 'rgba(95,132,104,0.05)' },
        data: [[{ xAxis: avgSold, yAxis: avgMargin }, { xAxis: 360, yAxis: 28 }]],
      } : undefined,
    })) as EChartsOption['series'],
  } as EChartsOption;
}

function demoSeries(days: number, seed: number): number[] {
  return Array.from({ length: days }, (_, i) => {
    const weekend = (i + seed) % 7 === 5 || (i + seed) % 7 === 6 ? 1.22 : 1;
    const wave = 1 + 0.14 * Math.sin((i + seed) / 3.1);
    return Math.round(3800 * weekend * wave + ((i * 37 + seed * 13) % 9) * 42);
  });
}

export function revenueTrendOption(range: 7 | 14 | 30): EChartsOption {
  const revenue = demoSeries(range, range);
  const orders = revenue.map((r, i) => Math.round(r / (42 + ((i * 7) % 6))));
  const ticket = revenue.map((r, i) => +(r / (orders[i] || 1)).toFixed(1));
  const labels = Array.from({ length: range }, (_, i) => `D${i + 1}`);
  return {
    tooltip: { ...tooltipBase, trigger: 'axis' },
    legend: { ...legendBase, data: ['日营业额', '日订单量', '客单价'] },
    grid: { left: 8, right: 8, top: 22, bottom: 40, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: labels, axisLabel: { ...axisLabel, interval: range === 30 ? 4 : range === 14 ? 1 : 0 }, axisLine, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '营业额（元）', nameTextStyle: { color: PALETTE.muted, fontSize: 10.5 }, axisLabel: { ...axisLabel, formatter: (v: number) => yuanShort(v) }, splitLine, axisLine: { show: false } },
      { type: 'value', name: '单 / 元', nameTextStyle: { color: PALETTE.muted, fontSize: 10.5 }, axisLabel, splitLine: { show: false }, axisLine: { show: false } },
    ],
    series: [
      { name: '日营业额', type: 'line', smooth: true, symbol: 'none', data: revenue, lineStyle: { width: 2.5, color: PALETTE.accent }, areaStyle: { color: 'rgba(192,74,43,0.08)' }, itemStyle: { color: PALETTE.accent } },
      { name: '日订单量', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'none', data: orders, lineStyle: { width: 2, color: PALETTE.olive }, itemStyle: { color: PALETTE.olive } },
      { name: '客单价', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'none', data: ticket, lineStyle: { width: 2, color: PALETTE.gold, type: 'dashed' }, itemStyle: { color: PALETTE.gold } },
    ],
  } as EChartsOption;
}

export function metricCompareOption(): EChartsOption {
  const items = ['食材成本率', '人工成本率', '房租成本率', '毛利率'];
  return {
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: unknown) => `${v}%` },
    legend: { ...legendBase, data: ['本店演示值', '自设目标线'] },
    grid: { left: 8, right: 12, top: 22, bottom: 36, containLabel: true },
    xAxis: { type: 'category', data: items, axisLabel: { ...axisLabel, interval: 0 }, axisLine, axisTick: { show: false } },
    yAxis: { type: 'value', max: 90, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine, axisLine: { show: false } },
    series: [
      { name: '本店演示值', type: 'bar', barWidth: 22, data: [36, 27, 14, 62], itemStyle: { color: PALETTE.accent, borderRadius: [4, 4, 0, 0] } },
      { name: '自设目标线', type: 'bar', barWidth: 22, data: [32, 24, 10, 66], itemStyle: { color: PALETTE.oliveSoft, borderRadius: [4, 4, 0, 0] } },
    ],
  } as EChartsOption;
}

export function funnelOption(): EChartsOption {
  return {
    tooltip: { ...tooltipBase, trigger: 'item', formatter: '{b}：<b>{c}</b> 人（演示数据）' },
    legend: { ...legendBase },
    series: [{
      type: 'funnel', left: '12%', right: '12%', top: 12, bottom: 34, minSize: '22%', maxSize: '100%',
      sort: 'descending', gap: 3,
      label: { show: true, position: 'inside', formatter: '{b}  {c}', color: PALETTE.white, fontSize: 11.5, fontWeight: 600 },
      itemStyle: { borderColor: PALETTE.white, borderWidth: 2 },
      data: [
        { value: 10000, name: '看到门店', itemStyle: { color: PALETTE.slate } },
        { value: 1800, name: '进店', itemStyle: { color: PALETTE.gold } },
        { value: 1200, name: '下单', itemStyle: { color: PALETTE.accentSoft } },
        { value: 420, name: '30 天内复购', itemStyle: { color: PALETTE.accent } },
        { value: 150, name: '成为会员', itemStyle: { color: PALETTE.olive } },
      ],
    }],
  } as EChartsOption;
}

export function repeatTrendOption(): EChartsOption {
  return {
    tooltip: { ...tooltipBase, trigger: 'axis', valueFormatter: (v: unknown) => `${v}%` },
    legend: { ...legendBase, data: ['30 天复购率', '会员复购率'] },
    grid: { left: 8, right: 14, top: 22, bottom: 36, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['第 1 月', '第 2 月', '第 3 月', '第 4 月', '第 5 月', '第 6 月'], axisLabel, axisLine, axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, max: 60, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine, axisLine: { show: false } },
    series: [
      { name: '30 天复购率', type: 'line', smooth: true, data: [31, 24, 27, 29, 33, 35], symbolSize: 7, lineStyle: { width: 2.5, color: PALETTE.accent }, itemStyle: { color: PALETTE.accent }, areaStyle: { color: 'rgba(192,74,43,0.07)' } },
      { name: '会员复购率', type: 'line', smooth: true, data: [42, 40, 44, 47, 48, 52], symbolSize: 7, lineStyle: { width: 2, color: PALETTE.olive }, itemStyle: { color: PALETTE.olive } },
    ],
  } as EChartsOption;
}

export function dishRankingOption(): EChartsOption {
  const names = ['招牌牛肉面', '酸辣粉', '冰镇酸梅汤', '秘制卤蛋', '炸鸡块', '时令小菜', '手工水饺', '菌菇汤'];
  return {
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { ...legendBase, data: ['周销售额', '周毛利额'] },
    grid: { left: 8, right: 26, top: 16, bottom: 32, containLabel: true },
    xAxis: { type: 'value', axisLabel: { ...axisLabel, formatter: (v: number) => yuanShort(v) }, splitLine, axisLine: { show: false } },
    yAxis: { type: 'category', data: [...names].reverse(), axisLabel, axisLine, axisTick: { show: false } },
    series: [
      { name: '周销售额', type: 'bar', data: [8960, 5980, 3840, 1710, 1890, 1170, 2080, 1210].reverse(), itemStyle: { color: PALETTE.accentSoft, borderRadius: [0, 4, 4, 0] }, barWidth: 9 },
      { name: '周毛利额', type: 'bar', data: [6720, 4420, 2880, 1570, 1890, 1170, 2470, 1760].reverse(), itemStyle: { color: PALETTE.olive, borderRadius: [0, 4, 4, 0] }, barWidth: 9 },
    ],
  } as EChartsOption;
}

export function channelMixOption(): EChartsOption {
  return {
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { ...legendBase, data: ['营业额', '贡献利润'] },
    grid: { left: 8, right: 12, top: 22, bottom: 36, containLabel: true },
    xAxis: { type: 'category', data: ['堂食', '外卖', '自提 / 外带'], axisLabel, axisLine, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元/月', nameTextStyle: { color: PALETTE.muted, fontSize: 11 }, axisLabel: { ...axisLabel, formatter: (v: number) => yuanShort(v) }, splitLine, axisLine: { show: false } },
    series: [
      { name: '营业额', type: 'bar', barWidth: 26, data: [78000, 52000, 12000], itemStyle: { color: PALETTE.slate, borderRadius: [4, 4, 0, 0] } },
      { name: '贡献利润', type: 'bar', barWidth: 26, data: [41000, 9800, 6100], itemStyle: { color: PALETTE.accent, borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', fontSize: 10.5, color: PALETTE.ink2 } },
    ],
  } as EChartsOption;
}

export function staffEfficiencyOption(): EChartsOption {
  return {
    tooltip: { ...tooltipBase, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 8, right: 12, top: 22, bottom: 36, containLabel: true },
    xAxis: { type: 'category', data: ['早班', '午市', '下午茶', '晚市', '夜宵'], axisLabel, axisLine, axisTick: { show: false } },
    yAxis: { type: 'value', name: '元 / 人 / 小时', nameTextStyle: { color: PALETTE.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
    series: [{
      type: 'bar', barWidth: '46%',
      data: [86, 312, 74, 286, 132].map((v, i) => ({ value: v, itemStyle: { color: i === 1 || i === 3 ? PALETTE.accent : PALETTE.goldSoft, borderRadius: [4, 4, 0, 0] } })),
      label: { show: true, position: 'top', fontSize: 11, color: PALETTE.ink2 },
    }],
  } as EChartsOption;
}

export function inventoryOption(): EChartsOption {
  return {
    tooltip: { ...tooltipBase, trigger: 'axis' },
    legend: { ...legendBase, data: ['周转天数', '损耗率'] },
    grid: { left: 8, right: 8, top: 22, bottom: 36, containLabel: true },
    xAxis: { type: 'category', data: ['叶菜', '鲜肉', '水产', '冻品', '调料', '饮品'], axisLabel, axisLine, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '天', nameTextStyle: { color: PALETTE.muted, fontSize: 11 }, axisLabel, splitLine, axisLine: { show: false } },
      { type: 'value', name: '损耗率', nameTextStyle: { color: PALETTE.muted, fontSize: 11 }, axisLabel: { ...axisLabel, formatter: '{value}%' }, splitLine: { show: false }, axisLine: { show: false } },
    ],
    series: [
      { name: '周转天数', type: 'bar', barWidth: 22, data: [1.8, 2.6, 1.4, 12, 22, 15], itemStyle: { color: PALETTE.oliveSoft, borderRadius: [4, 4, 0, 0] } },
      { name: '损耗率', type: 'line', yAxisIndex: 1, smooth: true, data: [8.4, 4.2, 9.1, 1.6, 0.8, 1.2], symbolSize: 7, lineStyle: { width: 2.5, color: PALETTE.accent }, itemStyle: { color: PALETTE.accent } },
    ],
  } as EChartsOption;
}

export type ChartId = keyof typeof CHART_META;

export function getChartOption(id: string, params?: { fixedCost?: number; variableRate?: number; range?: 7 | 14 | 30 }): EChartsOption {
  switch (id) {
    case 'cost-structure': return costStructureOption();
    case 'profit-flow': return profitFlowOption();
    case 'budget-allocation': return budgetAllocationOption();
    case 'breakeven': return breakevenOption(params?.fixedCost ?? 49000, params?.variableRate ?? 0.4);
    case 'menu-engineering': return menuEngineeringOption();
    case 'revenue-trend': return revenueTrendOption(params?.range ?? 14);
    case 'metric-compare': return metricCompareOption();
    case 'funnel': return funnelOption();
    case 'repeat-trend': return repeatTrendOption();
    case 'dish-ranking': return dishRankingOption();
    case 'channel-mix': return channelMixOption();
    case 'staff-efficiency': return staffEfficiencyOption();
    case 'inventory': return inventoryOption();
    default: return {};
  }
}
