'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SS_KEYS, useLocalState } from '@/lib/site-selection/store';
import { downloadCsv } from '@/lib/site-selection/export';
import { calcLeaseCost, type LeaseInput } from '@/lib/site-selection/calc';
import { yuan, percent } from '@/lib/format';
import { LeaseChecklistView } from '../LeaseChecklistView';
import { SsChartCard } from '../SsChartCard';
import { Fieldset, FormulaNote, Metric, NumField, StorageNote, Toolbar } from './ToolCommon';

const DEFAULT: LeaseInput = {
  quote: 20000, target: 17000, exitPrice: 16000, years: 3, depositMonths: 2,
  freeMonths: 2, escalation: 0.03, propertyFee: 1800, otherFee: 600,
};

interface Plan { id: string; name: string; input: LeaseInput; total: number; savedAt: string }

export function RentNegotiationTool() {
  const [input, setInput] = useState<LeaseInput>(DEFAULT);
  const [assume, setAssume] = useState({ monthlyRevenue: 108000, contributionRate: 0.6, otherFixedCost: 31000 });
  const [plans, setPlans] = useLocalState<Plan[]>(SS_KEYS.rentPlans, []);
  const [saved, setSaved] = useState(false);
  const result = useMemo(() => calcLeaseCost(input), [input]);
  const set = (key: keyof LeaseInput, v: number) => { setInput((p) => ({ ...p, [key]: v })); setSaved(false); };

  const rentPoints = useMemo(() => {
    const step = 2000;
    return Array.from({ length: 7 }, (_, i) => Math.max(0, input.quote - 3 * step + i * step));
  }, [input.quote]);
  const profits = rentPoints.map((rent) => Math.round(assume.monthlyRevenue * assume.contributionRate - rent - assume.otherFixedCost));

  const savePlan = () => {
    const plan: Plan = { id: `${Date.now()}`, name: `方案 ${plans.length + 1} · 月租 ${yuan(input.quote)}`, input, total: result.total, savedAt: new Date().toISOString() };
    setPlans((prev) => [...prev, plan]);
    setSaved(true);
  };

  const exportCsv = () => downloadCsv('租金谈判方案测算', [
    ['项目', '数值', '说明'],
    ['房东报价（月租）', input.quote, ''], ['目标租金', input.target, ''], ['退出价', input.exitPrice, ''],
    ['租期（年）', input.years, ''], ['押金（月）', input.depositMonths, ''], ['免租期（月）', input.freeMonths, ''],
    ['年递增率', percent(input.escalation), ''], ['物业费/月', input.propertyFee, ''], ['其他费用/月', input.otherFee, ''],
    ['首年总占用成本', result.firstYear, ''], ['整段租期总成本', result.total, ''], ['平均月成本', result.avgMonthly, ''],
    ['免租期价值', result.freeRentValue, ''], ['递增累计影响', result.escalationCost, ''],
    ['年度', '月租', '当年租金', '附加费', '当年合计', '累计'],
    ...result.years.map((y) => [y.year, y.monthlyRent, y.rent, y.fees, y.subtotal, y.cumulative]),
    ['方案对比', '月租', '整段总成本'],
    ...result.scenarios.map((s) => [s.name, s.monthlyRent, s.total]),
  ]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <section className="card p-5 md:p-6">
          <p className="eyebrow mb-2"><span className="eyebrow-dot" />整段租期，一次算清</p>
          <h2 className="text-[20px] font-semibold">不只比月租，比总占用成本</h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">固定租金、抽成之外的物业费、递增、押金与免租期全进模型。所有比例由你自己填，本站不给「全国通用合理比例」。</p>
          <div className="mt-5 space-y-6">
            <Fieldset title="报价与三档价格">
              <NumField label="房东报价（元/月）" value={input.quote} onChange={(v) => set('quote', v)} min={0} />
              <NumField label="目标租金（元/月）" value={input.target} onChange={(v) => set('target', v)} min={0} />
              <NumField label="退出价（元/月）" value={input.exitPrice} onChange={(v) => set('exitPrice', v)} min={0} hint="超过这个价就去看别的铺" />
            </Fieldset>
            <Fieldset title="租期与附加条件">
              <NumField label="租期（年）" value={input.years} onChange={(v) => set('years', v)} min={1} max={20} />
              <NumField label="押金（月）" value={input.depositMonths} onChange={(v) => set('depositMonths', v)} min={0} max={12} />
              <NumField label="免租装修期（月）" value={input.freeMonths} onChange={(v) => set('freeMonths', v)} min={0} max={12} />
              <NumField label="年租金递增（%）" value={Math.round(input.escalation * 1000) / 10} onChange={(v) => set('escalation', v / 100)} min={0} max={30} step={0.5} />
              <NumField label="物业费 / 推广费（元/月）" value={input.propertyFee} onChange={(v) => set('propertyFee', v)} min={0} />
              <NumField label="其他费用（元/月）" value={input.otherFee} onChange={(v) => set('otherFee', v)} min={0} hint="空调加时、垃圾清运、管理费等" />
            </Fieldset>
            <Fieldset title="经营假设（用于利润敏感性）">
              <NumField label="预估月营业额（元）" value={assume.monthlyRevenue} onChange={(v) => setAssume((p) => ({ ...p, monthlyRevenue: v }))} min={0} />
              <NumField label="边际贡献率（%）" value={Math.round(assume.contributionRate * 100)} onChange={(v) => setAssume((p) => ({ ...p, contributionRate: v / 100 }))} min={1} max={99} />
              <NumField label="其他月固定成本（元）" value={assume.otherFixedCost} onChange={(v) => setAssume((p) => ({ ...p, otherFixedCost: v }))} min={0} />
            </Fieldset>
          </div>
          <div className="mt-5"><Toolbar onSave={savePlan} onCsv={exportCsv} onPrint={() => window.print()} onReset={() => setInput(DEFAULT)} saved={saved} /></div>
          <div className="mt-3"><StorageNote text="方案保存在本机；谈判前把「目标价 / 可接受价 / 退出价」抄进准备表，别到了现场再心算。" /></div>
        </section>

        <div className="space-y-5">
          <section className="card p-5">
            <h3 className="text-[16px] font-semibold">整段租期的钱</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric label="首年总占用成本" value={yuan(result.firstYear)} hint="含押金、扣免租期" />
              <Metric label="整段租期总成本" value={yuan(result.total)} tone="warn" hint={`${input.years} 年 · 含全部附加费`} />
              <Metric label="平均月成本" value={yuan(result.avgMonthly)} hint="总成本 ÷ 租期月数" />
              <Metric label="免租期价值" value={yuan(result.freeRentValue)} tone="good" hint="按报价月租折算" />
              <Metric label="递增累计影响" value={yuan(result.escalationCost)} tone="bad" hint="相比首年不递增多付的租金" />
              <Metric label="押金占用" value={yuan(result.deposit)} hint="退还条件要写进合同" />
            </div>
          </section>
          <section className="card overflow-hidden">
            <h3 className="border-b border-line px-5 py-3 text-[15px] font-semibold">三种报价，差多少钱</h3>
            <table className="w-full text-[12.5px]"><thead><tr className="border-b border-line text-left text-muted"><th className="px-5 py-2">方案</th><th className="py-2">月租</th><th className="py-2">整段总成本</th></tr></thead>
              <tbody>{result.scenarios.map((s, i) => <tr key={s.name} className="border-b border-line/70 last:border-0"><td className="px-5 py-2.5 font-medium">{s.name}</td><td className="num py-2.5">{yuan(s.monthlyRent)}</td><td className={`num py-2.5 font-semibold ${i === 0 ? 'text-accent' : 'text-olive'}`}>{yuan(s.total)}</td></tr>)}</tbody></table>
            <p className="border-t border-line bg-surface-2/50 px-5 py-3 text-[11.8px] text-muted">报价与退出价之间，整段租期差 <strong className="num text-ink">{yuan(result.scenarios[0].total - result.scenarios[2].total)}</strong>。谈判时把这笔钱说清，比反复说「便宜点」有用。</p>
          </section>
          <section className="card overflow-hidden">
            <h3 className="border-b border-line px-5 py-3 text-[15px] font-semibold">逐年现金支出</h3>
            <div className="overflow-x-auto"><table className="w-full min-w-[440px] text-[12.5px]"><thead><tr className="border-b border-line text-left text-muted"><th className="px-5 py-2">年度</th><th>月租</th><th>当年租金</th><th>附加费</th><th>当年合计</th><th>累计</th></tr></thead>
              <tbody>{result.years.map((y) => <tr key={y.year} className="border-b border-line/70 last:border-0"><td className="px-5 py-2">第 {y.year} 年</td><td className="num">{yuan(y.monthlyRent)}</td><td className="num">{yuan(y.rent)}</td><td className="num">{yuan(y.fees)}</td><td className="num font-medium">{yuan(y.subtotal)}</td><td className="num text-accent-ink">{yuan(y.cumulative)}</td></tr>)}</tbody></table></div>
          </section>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SsChartCard id="lease-trend" live compact height={270} title="三种报价的累计成本趋势" data={{ leaseInput: input }} note="来自你的实时输入 · 含押金、附加费与免租期" />
        <SsChartCard id="cash-outflow" live compact height={270} title="租赁期现金支出" data={{ years: result.years }} note="来自你的实时输入 · 首年含押金" />
        <SsChartCard id="rent-profit" live compact height={270} title="租金变化对利润的影响" data={{ rents: rentPoints, profits }} note="来自你的经营假设 · 其他条件不变" />
        <FormulaNote lines={['首年成本 = 月租 × (12 − 免租月数) + 附加费 × 12 + 押金', '第 n 年月租 = 首年月租 × (1 + 递增率)^(n−1)', '月经营利润 = 月营业额 × 边际贡献率 − 月租 − 其他固定成本']} note="递增基数、上限与附加费必须写进合同，否则这里算得再细也没有约束力。" />
      </div>

      {plans.length > 0 && (
        <section className="card p-5">
          <h3 className="text-[16px] font-semibold">已保存的谈判方案</h3>
          <ul className="mt-3 space-y-2">{plans.map((p) => <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[9px] border border-line px-3 py-2 text-[12.5px]"><span>{p.name} · {p.input.years} 年 · 免租 {p.input.freeMonths} 月</span><span className="num font-medium">{yuan(p.total)}</span></li>)}</ul>
          <Link href="/site-selection/reports" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-ink hover:underline">把方案带进评估报告 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        </section>
      )}
    </div>
  );
}

export function LeaseTool() {
  return (
    <div className="space-y-5">
      <div className="card p-5">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />签约前逐项核查</p>
        <h2 className="text-[20px] font-semibold">22 项检查，一项都别靠印象</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">按签约流程分组：主体与权属 → 用途与许可 → 租金与费用 → 租期与退出。可勾选、备注、标记待核实，并导出 CSV 带去和合同逐条对照。</p>
      </div>
      <LeaseChecklistView />
      <div className="grid gap-5 lg:grid-cols-2">
        <SsChartCard id="risk-distribution" compact height={260} title="选址风险分布" note="演示数据 · 请用自己的核查结果替换" />
        <FormulaNote lines={['待核实项不计入「已确认」', '一票否决项须有书面依据', '口头承诺必须落进合同附件']} note="工具只做风险提示与检查辅助，不自动认定合同合法有效；各地要求以当地监管部门规定为准。" />
      </div>
    </div>
  );
}
