'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { SCORE_DIMENSIONS, siteDemo } from '@/lib/site-selection/data';
import { SS_KEYS, useLocalState } from '@/lib/site-selection/store';
import { downloadCsv } from '@/lib/site-selection/export';
import {
  buildScenarios, compareCandidates, forecastCompetitorModel, forecastSeatModel,
  forecastTrafficModel, calcWeightedScore,
} from '@/lib/site-selection/calc';
import type { Candidate, ScoreState } from '@/lib/site-selection/types';
import { percent, yuan } from '@/lib/format';
import { SsChartCard } from '../SsChartCard';
import { Fieldset, FormulaNote, Metric, NumField, SelectField, StorageNote, Toolbar } from './ToolCommon';

const VETOES = [
  { id: '产权或出租权未核实', label: '产权 / 出租授权未取得书面材料' },
  { id: '房屋用途或餐饮许可不确定', label: '房屋用途、经营许可条件未确认' },
  { id: '排烟消防条件不满足', label: '排烟、排污、消防或电力条件不达标' },
  { id: '重大欠费或债务未结清', label: '欠租、欠费、储值或设备权属有争议' },
];

const defaultScore = (): ScoreState => ({
  values: Object.fromEntries(SCORE_DIMENSIONS.map((id, i) => [id, siteDemo.scoreValues[i] ?? 6])),
  weights: Object.fromEntries(SCORE_DIMENSIONS.map((id) => [id, 1])),
  veto: {},
});

export function ScorecardTool() {
  const [state, setState, reset] = useLocalState<ScoreState>(SS_KEYS.scorecard, defaultScore());
  const [saved, setSaved] = useState(false);
  const result = useMemo(() => calcWeightedScore(state, SCORE_DIMENSIONS), [state]);

  const verdict = result.vetoes.length > 0 ? '存在一票否决项，不建议签约'
    : result.total >= 7.5 ? '可以进入谈判，同时继续核实未确认事项'
      : result.total >= 6 ? '继续调查，补齐低分项的数据'
        : '按当前评分建议放弃或换铺';

  const setValue = (id: string, key: 'values' | 'weights', n: number) => {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], [id]: n } }));
    setSaved(false);
  };

  const exportCsv = () => downloadCsv('商铺选址评分卡', [
    ['维度', '得分(0-10)', '权重', '加权分'],
    ...result.dimensions.map((d) => [d.id, d.value, d.weight, d.weighted]),
    ['加权总分', result.total, '', ''],
    ['一票否决', result.vetoes.join(' / ') || '无', '', ''],
    ['结论', verdict, '', ''],
  ]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
      <section className="card p-5 md:p-6">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />加权评分</p>
        <h2 className="text-[20px] font-semibold">十项打分，权重你自己定</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">不同品类该用不同权重：外卖厨房不必给门头可见度 3 分权重，正餐却可能要。评分不是投资成功概率。</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[440px] text-[12.5px]">
            <thead><tr className="border-b border-line text-left text-muted"><th className="py-2">评分维度</th><th className="w-[42%]">得分</th><th className="w-20">权重</th></tr></thead>
            <tbody>{SCORE_DIMENSIONS.map((id) => (
              <tr key={id} className="border-b border-line/70">
                <td className="py-2.5 pr-2 font-medium">{id}</td>
                <td><input type="range" min={0} max={10} step={1} value={state.values[id] ?? 0} onChange={(e) => setValue(id, 'values', Number(e.target.value))} className="w-full accent-[#C04A2B]" /><span className="num text-[11px] text-muted">{state.values[id] ?? 0} / 10</span></td>
                <td><input type="number" min={0} max={5} step={0.5} className="field-input !py-1 text-[12px]" value={state.weights[id] ?? 1} onChange={(e) => setValue(id, 'weights', Number(e.target.value))} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div className="mt-6 rounded-[10px] border border-accent/25 bg-accent-soft/30 p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-accent-ink"><ShieldAlert className="h-4 w-4" aria-hidden />一票否决项（不进平均分）</p>
          <div className="mt-3 space-y-2">{VETOES.map((v) => (
            <label key={v.id} className="flex items-start gap-2.5 text-[13px] text-ink-2">
              <input type="checkbox" className="mt-1 accent-[#C04A2B]" checked={Boolean(state.veto[v.id])} onChange={(e) => { setState((prev) => ({ ...prev, veto: { ...prev.veto, [v.id]: e.target.checked } })); setSaved(false); }} />
              {v.label}
            </label>
          ))}</div>
          <p className="mt-3 text-[11.8px] leading-relaxed text-muted">只要勾选任意一项，无论综合评分多高，都不能据此建议签约。请回到尽职调查补齐书面材料。</p>
        </div>

        <div className="mt-5"><Toolbar onSave={() => setSaved(true)} onCsv={exportCsv} onPrint={() => window.print()} onReset={reset} saved={saved} /></div>
        <div className="mt-3"><StorageNote text="评分与权重自动保存在本机。点击「保存到本机」可确认一次写入；导出 CSV 后可附进评估报告。" /></div>
      </section>

      <div className="space-y-5">
        <section className="card p-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="加权总分" value={`${result.total} / 10`} tone={result.vetoes.length ? 'bad' : result.total >= 7.5 ? 'good' : 'warn'} hint={`${result.counted} 项，已按权重归一`} />
            <Metric label="低分项" value={`${result.weak.length} 项`} hint={result.weak.join('、') || '无'} />
          </div>
          <div className={`mt-4 rounded-[10px] border p-4 text-[13.5px] font-medium ${result.vetoes.length ? 'border-accent/30 bg-accent-soft/40 text-accent-ink' : 'border-olive/30 bg-olive-soft/40 text-olive'}`}>{verdict}</div>
          {result.vetoes.length > 0 && <p className="mt-2 text-[12px] text-accent-ink">一票否决：{result.vetoes.join('、')}</p>}
          <p className="mt-3 text-[12px] leading-relaxed text-muted">输出建议分三档：继续调查 / 进入谈判 / 建议放弃。评分只帮你排序和找短板，不预测成功率。</p>
        </section>
        <SsChartCard id="score-radar" live compact height={320} data={{ dimensions: SCORE_DIMENSIONS, values: SCORE_DIMENSIONS.map((id) => state.values[id] ?? 0) }} note="来自你的实时打分" />
        <SsChartCard id="rent-compare" live compact height={260} title="分项得分柱状图" data={{ items: SCORE_DIMENSIONS.map((id) => ({ name: id, value: state.values[id] ?? 0 })) }} note="来自你的实时打分 · 单位：分（0–10）" />
        <FormulaNote lines={['加权总分 = Σ(单项得分 × 权重) ÷ Σ权重', '一票否决项独立判断，不参与平均']} note="综合评分高不等于可以签约；产权、合规与工程条件必须单独核实。" />
        <Link href="/site-selection/tools/decision-report" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-ink hover:underline">把评分带进最终评估报告 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 营业额预测器 */

interface ForecastInput {
  effectiveTraffic: number; enterRate: number; buyRate: number; ticket: number;
  deliveryOrders: number; deliveryTicket: number;
  seats: number; turns: number; occupancy: number;
  competitorDailyOrders: number; share: number;
  breakevenDaily: number;
}

const defaultForecast: ForecastInput = {
  effectiveTraffic: 900, enterRate: 8, buyRate: 85, ticket: 42,
  deliveryOrders: 30, deliveryTicket: 38,
  seats: 32, turns: 2.6, occupancy: 70,
  competitorDailyOrders: 200, share: 18,
  breakevenDaily: 3000,
};

export function RevenueForecastTool() {
  const [input, setInput] = useLocalState<ForecastInput>(SS_KEYS.forecast, defaultForecast);
  const [model, setModel] = useState<'traffic' | 'seat' | 'competitor'>('traffic');
  const [saved, setSaved] = useState(false);
  const set = (key: keyof ForecastInput, v: number) => { setInput((p) => ({ ...p, [key]: v })); setSaved(false); };

  const traffic = useMemo(() => forecastTrafficModel({ effectiveTraffic: input.effectiveTraffic, enterRate: input.enterRate / 100, buyRate: input.buyRate / 100, ticket: input.ticket, deliveryOrders: input.deliveryOrders, deliveryTicket: input.deliveryTicket }), [input]);
  const seat = useMemo(() => forecastSeatModel({ seats: input.seats, turns: input.turns, occupancy: input.occupancy / 100, ticket: input.ticket, deliveryDaily: input.deliveryOrders * input.deliveryTicket }), [input]);
  const competitor = useMemo(() => forecastCompetitorModel({ competitorDailyOrders: input.competitorDailyOrders, share: input.share / 100, ticket: input.ticket }), [input]);
  const base = model === 'traffic' ? traffic : model === 'seat' ? seat : competitor;
  const scenarios = useMemo(() => buildScenarios(base), [base]);
  const spread = Math.max(traffic, seat, competitor) - Math.min(traffic, seat, competitor);
  const gaps = [
    input.effectiveTraffic <= 0 ? '有效目标客流：需要六轮现场记录' : '',
    input.competitorDailyOrders <= 0 ? '竞品订单量：需要竞品调查或可复核线索' : '',
    input.seats <= 0 ? '座位数与可实现翻台：需要平面草图与竞品观察' : '',
    '外卖订单量：平台数据或骑手观察，不要用想象填',
    '客单价：用自己菜单价格带，不要套用品类平均值',
  ].filter(Boolean);

  const exportCsv = () => downloadCsv('铺位营业额预测', [
    ['模型', '日营业额（元）', '月营业额（元）', '关键假设'],
    ['客流转化模型', traffic, traffic * 30, `有效客流 ${input.effectiveTraffic} × 进店 ${input.enterRate}% × 成交 ${input.buyRate}% × 客单 ${input.ticket}`],
    ['座位产能模型', seat, seat * 30, `座位 ${input.seats} × 翻台 ${input.turns} × 上座 ${input.occupancy}% × 客单 ${input.ticket}`],
    ['竞品参照模型', competitor, competitor * 30, `竞品 ${input.competitorDailyOrders} 单 × 份额 ${input.share}% × 客单 ${input.ticket}`],
    ['情景', '保守', '基准', '乐观'],
    ['日营业额', scenarios.conservative, scenarios.base, scenarios.optimistic],
    ['待核实', ...gaps],
  ]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
      <section className="card p-5 md:p-6">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />三种模型交叉验证</p>
        <h2 className="text-[20px] font-semibold">给区间，不给一个漂亮数字</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">三套模型差距过大，说明数据还不够，回现场补，而不是挑一个自己喜欢的数。</p>

        <div className="mt-5 space-y-6">
          <Fieldset title="① 客流转化模型" hint="适用于能现场数到有效目标客群的街边 / 社区铺。">
            <NumField label="全天有效目标客流（人）" value={input.effectiveTraffic} onChange={(v) => set('effectiveTraffic', v)} min={0} />
            <NumField label="进店转化率（%）" value={input.enterRate} onChange={(v) => set('enterRate', v)} min={0} max={100} />
            <NumField label="成交转化率（%）" value={input.buyRate} onChange={(v) => set('buyRate', v)} min={0} max={100} />
            <NumField label="客单价（元）" value={input.ticket} onChange={(v) => set('ticket', v)} min={0} />
            <NumField label="外卖日均订单（单）" value={input.deliveryOrders} onChange={(v) => set('deliveryOrders', v)} min={0} />
            <NumField label="外卖客单价（元）" value={input.deliveryTicket} onChange={(v) => set('deliveryTicket', v)} min={0} />
          </Fieldset>

          <Fieldset title="② 座位产能模型" hint="适用于堂食为主、能看到竞品上座情况的铺位。">
            <NumField label="座位数" value={input.seats} onChange={(v) => set('seats', v)} min={0} />
            <NumField label="每日可实现翻台次数" value={input.turns} onChange={(v) => set('turns', v)} min={0} step={0.1} />
            <NumField label="平均上座率（%）" value={input.occupancy} onChange={(v) => set('occupancy', v)} min={0} max={100} />
          </Fieldset>

          <Fieldset title="③ 竞品参照模型" hint="适用于同街有可比门店，能估计其订单量的情况。">
            <NumField label="可比门店日均订单（单）" value={input.competitorDailyOrders} onChange={(v) => set('competitorDailyOrders', v)} min={0} />
            <NumField label="你可获得的份额（%）" value={input.share} onChange={(v) => set('share', v)} min={0} max={100} />
            <NumField label="保本日营业额（元）" value={input.breakevenDaily} onChange={(v) => set('breakevenDaily', v)} min={0} hint="可从主站盈亏平衡计算器得到" className="sm:col-span-2" />
          </Fieldset>
        </div>

        <div className="mt-5"><SelectField label="以哪套模型作为基准情景" value={model} onChange={(v) => setModel(v as typeof model)} options={[{ value: 'traffic', label: '① 客流转化模型' }, { value: 'seat', label: '② 座位产能模型' }, { value: 'competitor', label: '③ 竞品参照模型' }]} /></div>
        <div className="mt-5"><Toolbar onSave={() => setSaved(true)} onCsv={exportCsv} onPrint={() => window.print()} onReset={() => setInput(defaultForecast)} saved={saved} /></div>
        <div className="mt-3"><StorageNote /></div>
      </section>

      <div className="space-y-5">
        <section className="card p-5">
          <h3 className="text-[16px] font-semibold">三套模型结果</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="客流转化" value={yuan(traffic)} hint="元 / 天" />
            <Metric label="座位产能" value={yuan(seat)} hint="元 / 天" />
            <Metric label="竞品参照" value={yuan(competitor)} hint="元 / 天" />
          </div>
          <p className={`mt-3 rounded-[9px] px-3 py-2 text-[12.5px] ${spread / (base || 1) > 0.4 ? 'bg-accent-soft/50 text-accent-ink' : 'bg-olive-soft/50 text-olive'}`}>
            {spread / (base || 1) > 0.4 ? '三套模型差异超过 40%，先回现场补数据，别急着选一个。' : '三套模型量级接近，仍要用现场记录校验关键假设。'}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="保守 / 天" value={yuan(scenarios.conservative)} />
            <Metric label="基准 / 天" value={yuan(scenarios.base)} tone="good" />
            <Metric label="乐观 / 天" value={yuan(scenarios.optimistic)} />
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">基准月营业额约 <strong className="num text-ink">{yuan(scenarios.monthlyBase)}</strong>；保守情景{scenarios.conservative >= input.breakevenDaily ? '高于' : '低于'}你填的保本日营业额 {yuan(input.breakevenDaily)}。</p>
          <p className="mt-2 text-[12px] text-muted">按 30 个营业日估算；三情景系数为 0.75 / 1 / 1.25，可按数据质量自行调整。</p>
        </section>
        <SsChartCard id="revenue-scenarios" live compact height={260} data={{ scenarios, breakeven: input.breakevenDaily }} note="来自你的实时输入 · 保本线需自行核算" />
        <section className="card p-5">
          <h3 className="text-[16px] font-semibold">模型假设与数据缺口</h3>
          <ul className="mt-2 space-y-1.5 text-[12.8px] text-ink-2">{gaps.map((g) => <li key={g}>· {g}</li>)}</ul>
          <p className="mt-3 text-[11.8px] leading-relaxed text-muted">这些是估算模型，不是保证实现的营业额。误差主要来自：有效客流判定、进店转化假设、竞品订单量估计与工作日/周末差异。</p>
        </section>
        <FormulaNote lines={['堂食 = 有效目标客流 × 进店转化率 × 成交转化率 × 客单价', '座位 = 座位数 × 可实现翻台 × 上座率 × 客单价', '外卖 = 可服务订单量 × 订单成交率 × 外卖客单价']} />
        <Link href="/site-selection/tools/traffic-counter" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-ink hover:underline">先去现场点人数 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 铺位对比器 */

const defaultCandidate = (i: number): Candidate => ({
  id: `${Date.now()}-${i}`,
  name: siteDemo.candidates[i]?.name ?? `候选铺位 ${i + 1}`,
  area: 80 + i * 12, rent: siteDemo.candidates[i]?.rent ?? 18000, transferFee: 0,
  tradeArea: ['社区底商', '商场三层', '写字楼底商'][i] ?? '社区底商',
  dailyTraffic: 900 + i * 180, competition: 3 + i,
  dailyOrders: 90 + i * 8, ticket: 42, contributionRate: 0.6,
  otherFixedCost: 31000, initialInvestment: 260000, score: siteDemo.candidates[i]?.score ?? 60,
});

export function CompareTool() {
  const [list, setList] = useLocalState<Candidate[]>(SS_KEYS.candidates, [0, 1, 2].map(defaultCandidate));
  const [saved, setSaved] = useState(false);
  const rows = useMemo(() => compareCandidates(list), [list]);
  const update = (id: string, key: keyof Candidate, value: string | number) => { setList((prev) => prev.map((c) => c.id === id ? { ...c, [key]: value } : c)); setSaved(false); };

  const exportCsv = () => downloadCsv('候选铺位对比', [
    ['铺位', '面积㎡', '月租', '转让费', '商圈', '日均客流', '竞品数', '日订单', '客单价', '预估月营业额', '保本营业额', '月经营利润', '租金占比', '回本周期(月)', '风险'],
    ...rows.map((r) => [r.name, r.area, r.rent, r.transferFee, r.tradeArea, r.dailyTraffic, r.competition, r.dailyOrders, r.ticket, r.monthlyRevenue, r.breakevenRevenue, r.monthlyProfit, percent(r.rentRate), Number.isFinite(r.payback) ? r.payback.toFixed(1) : '无法回本', r.risk.join(' / ')]),
  ]);

  return (
    <div className="space-y-5">
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="eyebrow mb-2"><span className="eyebrow-dot" />3–5 个候选一起看</p><h2 className="text-[20px] font-semibold">把「感觉不错」换成一张表</h2></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={list.length >= 5} onClick={() => setList((prev) => [...prev, defaultCandidate(prev.length)])} className="btn-secondary text-[12.5px] disabled:opacity-40"><Plus className="h-3.5 w-3.5" aria-hidden />添加铺位</button>
            <button type="button" onClick={() => { setSaved(true); }} className="btn-secondary text-[12.5px]">{saved ? '已保存到本机' : '保存到本机'}</button>
            <button type="button" onClick={exportCsv} className="btn-secondary text-[12.5px]">导出 CSV</button>
          </div>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">单元格可直接编辑，结果实时更新。所有数字都是「基于你填的假设」的推算，不是评估结论。</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-[12.2px]">
            <thead><tr className="border-b border-line text-left text-muted"><th className="py-2 pr-2">指标</th>{list.map((c) => <th key={c.id} className="py-2 pr-2"><input className="field-input !py-1 text-[12px]" value={c.name} onChange={(e) => update(c.id, 'name', e.target.value)} />{list.length > 2 && <button type="button" onClick={() => setList((prev) => prev.filter((x) => x.id !== c.id))} className="mt-1 inline-flex items-center gap-1 text-[11px] font-normal text-muted hover:text-accent"><Trash2 className="h-3 w-3" aria-hidden />移除</button>}</th>)}</tr></thead>
            <tbody>
              {([
                ['面积（㎡）', 'area'], ['月租金（元）', 'rent'], ['转让费（元）', 'transferFee'],
                ['日均客流（人）', 'dailyTraffic'], ['竞品数（家）', 'competition'], ['预计日订单', 'dailyOrders'],
                ['客单价（元）', 'ticket'], ['边际贡献率（%）', 'contributionRate'],
                ['其他月固定成本', 'otherFixedCost'], ['初始投资（元）', 'initialInvestment'],
              ] as [string, keyof Candidate][]).map(([label, key]) => (
                <tr key={key} className="border-b border-line/70"><td className="py-2 pr-2 font-medium">{label}</td>{list.map((c) => (
                  <td key={c.id} className="py-1.5 pr-2"><input type="number" className="field-input !py-1 text-[12px]" value={key === 'contributionRate' ? Math.round((c.contributionRate as number) * 100) : (c[key] as number)} onChange={(e) => update(c.id, key, key === 'contributionRate' ? Number(e.target.value) / 100 : Number(e.target.value))} /></td>
                ))}</tr>
              ))}
              <tr className="border-b border-line/70 text-muted"><td className="py-2 pr-2">商圈类型</td>{list.map((c) => <td key={c.id} className="py-1.5 pr-2"><input className="field-input !py-1 text-[12px]" value={c.tradeArea} onChange={(e) => update(c.id, 'tradeArea', e.target.value)} /></td>)}</tr>
              <tr className="bg-surface-2/50"><td className="py-2 pr-2 font-semibold">预估月营业额</td>{rows.map((r) => <td key={r.id} className="num py-2 pr-2 font-semibold">{yuan(r.monthlyRevenue)}</td>)}</tr>
              <tr><td className="py-2 pr-2 font-semibold">保本营业额</td>{rows.map((r) => <td key={r.id} className="num py-2 pr-2">{yuan(r.breakevenRevenue)}</td>)}</tr>
              <tr className="bg-surface-2/50"><td className="py-2 pr-2 font-semibold">月经营利润</td>{rows.map((r) => <td key={r.id} className={`num py-2 pr-2 font-semibold ${r.monthlyProfit > 0 ? 'text-olive' : 'text-accent'}`}>{yuan(r.monthlyProfit)}</td>)}</tr>
              <tr><td className="py-2 pr-2 font-semibold">租金占比</td>{rows.map((r) => <td key={r.id} className="num py-2 pr-2">{percent(r.rentRate)}</td>)}</tr>
              <tr className="bg-surface-2/50"><td className="py-2 pr-2 font-semibold">回本周期</td>{rows.map((r) => <td key={r.id} className="num py-2 pr-2">{Number.isFinite(r.payback) ? `${r.payback.toFixed(1)} 个月` : '无法回本'}</td>)}</tr>
              <tr><td className="py-2 pr-2 align-top font-semibold">风险提示</td>{rows.map((r) => <td key={r.id} className="py-2 pr-2 align-top text-[11.5px] leading-relaxed text-accent-ink">{r.risk.length ? r.risk.map((x) => <div key={x}>· {x}</div>) : <span className="text-olive">· 当前假设下未见明显红旗</span>}</td>)}</tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4"><StorageNote /></div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <SsChartCard id="rent-compare" live compact height={270} title="候选铺位月租对比" data={{ items: rows.map((r) => ({ name: r.name, value: r.rent })) }} note="来自你的实时输入 · 仅月租，不含附加费" />
        <SsChartCard id="breakeven-compare" live compact height={270} title="保本线 vs 预估营业额" data={{ items: rows.map((r) => ({ name: r.name, value: r.breakevenRevenue, value2: r.monthlyRevenue })) }} note="来自你的实时输入 · 保本营业额 = 固定成本 ÷ 边际贡献率" />
      </div>
      <FormulaNote lines={['月营业额 = 日订单 × 客单价 × 30', '保本营业额 = 月固定成本 ÷ 边际贡献率', '回本周期 = 初始投入 ÷ 月经营利润']} note="月固定成本 = 月租 + 其他固定成本；初始投入请自行含装修、设备、押金与转让费。" />
      <Link href="/site-selection/tools/decision-report" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-ink hover:underline">把对比结果带进最终评估报告 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
    </div>
  );
}
