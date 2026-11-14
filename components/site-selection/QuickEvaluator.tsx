'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleAlert, Save, TriangleAlert } from 'lucide-react';
import { quickEvaluate, type QuickEvalInput } from '@/lib/site-selection/calc';
import { SS_KEYS, writeLocal } from '@/lib/site-selection/store';
import { months, percent, yuan } from '@/lib/format';

const DEFAULT: QuickEvalInput = {
  name: '我的候选铺位', category: '社区正餐', area: 80, monthlyRent: 18000,
  transferFee: 0, ticket: 42, dailyOrders: 90, targetRentRate: 0.12,
  contributionRate: 0.6, otherFixedCost: 31000, initialInvestment: 260000,
  trafficVerified: false, complianceVerified: false,
};

const CATEGORIES = ['社区正餐', '快餐 / 简餐', '茶饮 / 咖啡', '火锅 / 烧烤', '早餐 / 小吃', '外卖为主'];

export function QuickEvaluator() {
  const [input, setInput] = useState<QuickEvalInput>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const result = useMemo(() => quickEvaluate(input), [input]);

  const set = <K extends keyof QuickEvalInput>(key: K, value: QuickEvalInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
      <section className="card p-5 md:p-6">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />输入你手上的信息</p>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">先把已知数字填进来</h3>
        <p className="mt-1.5 text-[12.8px] leading-relaxed text-muted">初始值是演示参数。不知道的项目就留着，系统会告诉你还缺什么，而不是替你编一个看起来很准的结论。</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="field-label">商铺地址或商圈</span><input className="field-input" value={input.name} onChange={(e) => set('name', e.target.value)} placeholder="例：城东社区沿街" /></label>
          <label className="block"><span className="field-label">经营品类</span><select className="field-input" value={input.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="field-label">面积（㎡）</span><input type="number" min={0} className="field-input" value={input.area} onChange={(e) => set('area', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">月租金（元）</span><input type="number" min={0} className="field-input" value={input.monthlyRent} onChange={(e) => set('monthlyRent', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">转让费（元）</span><input type="number" min={0} className="field-input" value={input.transferFee} onChange={(e) => set('transferFee', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">预计客单价（元）</span><input type="number" min={0} className="field-input" value={input.ticket} onChange={(e) => set('ticket', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">预计日订单量（单）</span><input type="number" min={0} className="field-input" value={input.dailyOrders} onChange={(e) => set('dailyOrders', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">目标租金占比（%）</span><input type="number" min={1} max={60} className="field-input" value={Math.round(input.targetRentRate * 100)} onChange={(e) => set('targetRentRate', Number(e.target.value) / 100)} /></label>
          <label className="block"><span className="field-label">边际贡献率（%）</span><input type="number" min={1} max={99} className="field-input" value={Math.round(input.contributionRate * 100)} onChange={(e) => set('contributionRate', Number(e.target.value) / 100)} /></label>
          <label className="block"><span className="field-label">其他月固定成本（元）</span><input type="number" min={0} className="field-input" value={input.otherFixedCost} onChange={(e) => set('otherFixedCost', Number(e.target.value))} /></label>
          <label className="block"><span className="field-label">初始投资（元）</span><input type="number" min={0} className="field-input" value={input.initialInvestment} onChange={(e) => set('initialInvestment', Number(e.target.value))} /></label>
        </div>

        <div className="mt-4 space-y-2 rounded-[10px] border border-line bg-surface-2/50 p-3.5">
          <label className="flex items-start gap-2.5 text-[13px] text-ink-2"><input type="checkbox" className="mt-1 accent-[#C04A2B]" checked={input.trafficVerified} onChange={(e) => set('trafficVerified', e.target.checked)} /><span>我已完成六轮现场客流调查，订单量有数据支撑</span></label>
          <label className="flex items-start gap-2.5 text-[13px] text-ink-2"><input type="checkbox" className="mt-1 accent-[#C04A2B]" checked={input.complianceVerified} onChange={(e) => set('complianceVerified', e.target.checked)} /><span>排烟、消防、房屋用途与经营许可已取得书面依据</span></label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => { writeLocal(SS_KEYS.reportMeta, { ...input, savedAt: new Date().toISOString() }); setSaved(true); }} className="btn-secondary text-[12.5px]"><Save className="h-3.5 w-3.5" aria-hidden />{saved ? '已保存到本机' : '保存这次评估'}</button>
          <button type="button" onClick={() => { setInput(DEFAULT); setSaved(false); }} className="rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-muted hover:text-ink">恢复示例值</button>
        </div>
      </section>

      <section className="card p-5 md:p-6" aria-live="polite">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />初步测算 · 不是结论</p>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">先看这几笔账</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ['预估月营业额', yuan(result.monthlyRevenue), '客单价 × 日订单 × 30 天'],
            ['初步租金承受上限', yuan(result.rentCheck.raw.maxRent), `按你自己设定的 ${percent(input.targetRentRate)}`],
            ['盈亏平衡营业额', yuan(result.breakevenRevenue), '月固定成本 ÷ 边际贡献率'],
            ['月经营利润（估算）', yuan(result.monthlyProfit), '未扣税、折旧与利息'],
            ['初步回本周期', months(result.payback), '（初始投资 + 转让费）÷ 月经营利润'],
            ['当前租金占比', percent(input.monthlyRent / (result.monthlyRevenue || 1)), '与你的目标占比对照'],
          ].map(([label, value, hint]) => (
            <div key={label} className="rounded-[10px] border border-line bg-surface-2/45 px-4 py-3">
              <p className="text-[11.5px] text-muted">{label}</p>
              <p className="num mt-1 text-[19px] font-semibold text-ink">{value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">{hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[10px] border border-gold/35 bg-gold-soft/45 p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink"><TriangleAlert className="h-4 w-4 text-gold" aria-hidden />当前判断</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{result.verdict}</p>
        </div>

        {result.risks.length > 0 && (
          <div className="mt-4">
            <p className="text-[12.5px] font-semibold text-accent-ink">风险清单</p>
            <ul className="mt-1.5 space-y-1 text-[12.8px] text-ink-2">{result.risks.map((r) => <li key={r}>· {r}</li>)}</ul>
          </div>
        )}
        <div className="mt-4 rounded-[10px] border border-line bg-surface-2/40 p-4">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold"><CircleAlert className="h-4 w-4 text-olive" aria-hidden />还需要实地核实</p>
          <ul className="mt-1.5 space-y-1 text-[12.8px] text-ink-2">{result.gaps.map((g) => <li key={g}>· {g}</li>)}</ul>
          <p className="mt-2 text-[11.5px] leading-relaxed text-muted">数据不完整时，任何精确到个位的结论都是假装专业。以上是经营口径估算，不构成投资建议。</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/site-selection/tools/field-visit" className="btn-primary text-[12.5px]">去做现场记录 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          <Link href="/site-selection/tools/revenue-forecast" className="btn-secondary text-[12.5px]">打开完整预测器</Link>
          <Link href="/site-selection/reports" className="btn-secondary text-[12.5px]">生成评估报告</Link>
        </div>
      </section>
    </div>
  );
}
