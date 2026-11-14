'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileDown, Printer, TriangleAlert } from 'lucide-react';
import { SS_KEYS, readLocal } from '@/lib/site-selection/store';
import { downloadCsv, downloadJson, timestamp } from '@/lib/site-selection/export';
import { calcWeightedScore, compareCandidates, quickEvaluate, type QuickEvalInput } from '@/lib/site-selection/calc';
import { SCORE_DIMENSIONS, leaseData, siteRoadmap } from '@/lib/site-selection/data';
import type { Candidate, LeaseCheckState, ScoreState, SiteVisit, TrafficSession } from '@/lib/site-selection/types';
import { percent, yuan } from '@/lib/format';
import { StorageNote, Toolbar } from './ToolCommon';

const DEFAULT_QUICK: QuickEvalInput = {
  name: '我的候选铺位', category: '社区正餐', area: 80, monthlyRent: 18000, transferFee: 0,
  ticket: 42, dailyOrders: 90, targetRentRate: 0.12, contributionRate: 0.6,
  otherFixedCost: 31000, initialInvestment: 260000, trafficVerified: false, complianceVerified: false,
};

interface ReportData {
  meta: (QuickEvalInput & { savedAt?: string }) | null;
  visits: SiteVisit[];
  traffic: TrafficSession[];
  score: ScoreState | null;
  plans: { id: string; name: string; total: number; input: Record<string, number> }[];
  forecast: Record<string, number> | null;
  candidates: Candidate[];
  lease: LeaseCheckState | null;
  roadmap: string[];
}

const EMPTY: ReportData = { meta: null, visits: [], traffic: [], score: null, plans: [], forecast: null, candidates: [], lease: null, roadmap: [] };

function readAll(): ReportData {
  return {
    meta: readLocal<(QuickEvalInput & { savedAt?: string }) | null>(SS_KEYS.reportMeta, null),
    visits: readLocal<SiteVisit[]>(SS_KEYS.visits, []),
    traffic: readLocal<TrafficSession[]>(SS_KEYS.traffic, []),
    score: readLocal<ScoreState | null>(SS_KEYS.scorecard, null),
    plans: readLocal<ReportData['plans']>(SS_KEYS.rentPlans, []),
    forecast: readLocal<Record<string, number> | null>(SS_KEYS.forecast, null),
    candidates: readLocal<Candidate[]>(SS_KEYS.candidates, []),
    lease: readLocal<LeaseCheckState | null>(SS_KEYS.leaseChecks, null),
    roadmap: readLocal<string[]>(SS_KEYS.roadmap, []),
  };
}

export function ReportTool() {
  const [data, setData] = useState<ReportData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setData(readAll()); setLoaded(true); }, []);

  const quick = useMemo(() => quickEvaluate(data.meta ?? { ...DEFAULT_QUICK, name: '（未填写基础信息）' }), [data.meta]);
  const score = useMemo(() => data.score ? calcWeightedScore(data.score, SCORE_DIMENSIONS) : null, [data.score]);
  const rows = useMemo(() => compareCandidates(data.candidates), [data.candidates]);
  const leaseItems = useMemo(() => leaseData.groups.flatMap((g) => g.items), []);
  const pendingLease = leaseItems.filter((x) => data.lease?.pending[x.id]).length;
  const checkedLease = leaseItems.filter((x) => data.lease?.checked[x.id]).length;
  const trafficPassers = data.traffic.reduce((n, s) => n + s.passers, 0);
  const trafficTarget = data.traffic.reduce((n, s) => n + s.target, 0);

  const advice = useMemo(() => {
    if (score?.vetoes.length) return { tone: 'bad' as const, text: '不建议签约：存在一票否决项', detail: score.vetoes.join('、') };
    if (pendingLease > 0) return { tone: 'warn' as const, text: '继续调查，暂不建议进入签约', detail: `合同清单还有 ${pendingLease} 项标记为待核实。` };
    if (data.visits.length < 6 || data.traffic.length < 6) return { tone: 'warn' as const, text: '继续调查：现场样本不足', detail: `目前保存 ${data.visits.length} 条考察记录、${data.traffic.length} 轮客流计数；建议覆盖六轮。` };
    if (quick.monthlyProfit <= 0) return { tone: 'bad' as const, text: '建议放弃或重谈条件', detail: '按当前经营假设，月经营利润不为正。' };
    if ((score?.total ?? 0) >= 7.5) return { tone: 'good' as const, text: '可以进入谈判，签约前再核一次书面材料', detail: '评分与现金流均过线；仍需在合同中逐条落实。' };
    return { tone: 'warn' as const, text: '继续调查或调整商务条件', detail: '综合评分不高，可用更保守的租金与免租期方案重算。' };
  }, [score, pendingLease, data.visits.length, data.traffic.length, quick.monthlyProfit]);

  const missing = [
    !data.meta && '基础信息（首页「先算再爱」或工具页保存）',
    data.visits.length < 6 && '六轮实地考察记录',
    data.traffic.length < 6 && '六轮客流统计',
    !data.score && '选址评分卡',
    data.plans.length === 0 && '租金谈判方案',
    !data.forecast && '营业额预测',
    data.candidates.length === 0 && '候选铺位对比',
    !data.lease && '合同检查清单',
  ].filter(Boolean) as string[];

  const exportJson = () => downloadJson('餐饮店铺选址评估报告.json', { generatedAt: timestamp(), ...data, advice });
  const exportCsv = () => downloadCsv('餐饮店铺选址评估报告', [
    ['章节', '项目', '内容'],
    ['基础信息', '铺位', data.meta?.name ?? '未填写'], ['基础信息', '品类', data.meta?.category ?? '未填写'],
    ['基础信息', '面积㎡', data.meta?.area ?? ''], ['基础信息', '月租', data.meta?.monthlyRent ?? ''],
    ['商圈与客流', '考察记录数', data.visits.length], ['商圈与客流', '客流轮次', data.traffic.length],
    ['商圈与客流', '累计经过人数', trafficPassers], ['商圈与客流', '累计目标客群', trafficTarget],
    ['评分', '加权总分', score?.total ?? '未填写'], ['评分', '一票否决', score?.vetoes.join(' / ') || '无'],
    ['营业额预测', '预估月营业额', quick.monthlyRevenue], ['营业额预测', '保本营业额', quick.breakevenRevenue],
    ['投资测算', '月经营利润', quick.monthlyProfit], ['租金谈判', '已保存方案数', data.plans.length],
    ['合同风险', '已确认项', checkedLease], ['合同风险', '待核实项', pendingLease],
    ['路线图', '已完成步骤', `${data.roadmap.length} / ${siteRoadmap.length}`],
    ['待核实问题', '缺口', missing.join(' / ') || '无'],
    ['最终建议', advice.text, advice.detail],
  ]);

  return (
    <div className="space-y-5">
      <div className="card flex flex-wrap items-start justify-between gap-4 no-print">
        <div><p className="eyebrow mb-2"><span className="eyebrow-dot" />整合本机数据</p><h2 className="text-[20px] font-semibold">《餐饮店铺选址评估报告》</h2>
          <p className="mt-2 max-w-[680px] text-[12.5px] leading-relaxed text-muted">自动汇总你在首页评估、考察记录、客流统计、评分卡、租金方案、预测、对比与合同清单里保存的数据。没有填的部分会明确列为待核实，不会替你编。</p></div>
        <div className="flex flex-col items-start gap-2"><span className="text-[11.5px] text-muted">生成时间：{loaded ? timestamp() : '读取中…'}</span><Toolbar onCsv={exportCsv} onPrint={() => window.print()} /><button type="button" onClick={exportJson} className="btn-secondary text-[12.5px]"><FileDown className="h-3.5 w-3.5" aria-hidden />导出完整 JSON</button></div>
      </div>

      <div className="card flex items-start gap-3 no-print"><Printer className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden /><p className="text-[12.5px] leading-relaxed text-muted">「打印 / 存 PDF」会隐藏导航与按钮，只保留下方报告正文；在打印对话框里选择「另存为 PDF」即可。CSV 可直接用 Excel 打开，JSON 便于后续迁移到数据库。</p></div>

      <div className="ss-report card p-5 md:p-7">
        <header className="border-b border-line pb-5">
          <p className="eyebrow"><span className="eyebrow-dot" />RESTAURANT SITE SELECTION LAB</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">餐饮店铺选址评估报告</h1>
          <p className="mt-2 text-[12.5px] text-muted">生成时间 {loaded ? timestamp() : '—'} · 数据来源：本机浏览器保存的选址工具记录 · 全部为基于用户输入的经营口径估算</p>
        </header>

        <div className="mt-5 space-y-7">
          <section><h2 className="text-[17px] font-semibold">一、基础信息</h2>
            <dl className="mt-3 grid gap-2 sm:grid-cols-3 text-[13px]">
              {[['铺位名称', data.meta?.name ?? '未填写'], ['经营品类', data.meta?.category ?? '未填写'], ['面积', data.meta ? `${data.meta.area} ㎡` : '未填写'], ['月租金', data.meta ? yuan(data.meta.monthlyRent) : '未填写'], ['转让费', data.meta ? yuan(data.meta.transferFee) : '未填写'], ['初始投资', data.meta ? yuan(data.meta.initialInvestment) : '未填写']].map(([k, v]) => <div key={k} className="rounded-[9px] border border-line bg-surface-2/40 px-3 py-2"><dt className="text-[11.5px] text-muted">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>)}
            </dl>
          </section>

          <section><h2 className="text-[17px] font-semibold">二、商圈分析与客流调查</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">已保存 <strong className="num">{data.visits.length}</strong> 条实地考察记录、<strong className="num">{data.traffic.length}</strong> 轮客流计数。累计经过 <strong className="num">{trafficPassers}</strong> 人，其中目标客群 <strong className="num">{trafficTarget}</strong> 人（{trafficPassers > 0 ? percent(trafficTarget / trafficPassers) : '—'}）。</p>
            {data.visits.length > 0 ? <ul className="mt-2 space-y-1 text-[12.5px] text-ink-2">{data.visits.slice(-6).map((v) => <li key={v.id}>· {v.date} {v.slot}｜{v.tradeArea}｜经过 {v.passers} / 目标 {v.target}｜天气 {v.weather}</li>)}</ul> : <p className="mt-2 text-[12.5px] text-muted">还没有考察记录。请用实地考察记录器补齐。</p>}
          </section>

          <section><h2 className="text-[17px] font-semibold">三、竞争分析与铺位条件</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{data.visits.length ? `最近一次记录的周边竞品：${data.visits[data.visits.length - 1].competitors || '未填写'}；门头宽度 ${data.visits[data.visits.length - 1].frontage} m；${data.visits[data.visits.length - 1].blocked ? '门头存在遮挡' : '门头未见遮挡'}。` : '尚未记录竞品与铺位条件。'}</p>
            <p className="mt-1 text-[12px] text-muted">提示：竞品菜单、价格带与高峰进店人数需在竞品调查表中单独归档。</p>
          </section>

          <section><h2 className="text-[17px] font-semibold">四、租金与投资测算</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[['预估月营业额', yuan(quick.monthlyRevenue)], ['保本营业额', yuan(quick.breakevenRevenue)], ['月经营利润', yuan(quick.monthlyProfit)], ['租金承受上限', yuan(quick.rentCheck.raw.maxRent)], ['当前租金占比', percent((data.meta?.monthlyRent ?? 0) / (quick.monthlyRevenue || 1))], ['已保存租金方案', `${data.plans.length} 个`]].map(([k, v]) => <div key={k} className="rounded-[9px] border border-line bg-surface-2/40 px-3 py-2"><p className="text-[11.5px] text-muted">{k}</p><p className="num mt-0.5 font-semibold">{v}</p></div>)}
            </div>
            {data.plans.length > 0 && <p className="mt-2 text-[12.5px] text-ink-2">最近方案：{data.plans[data.plans.length - 1].name}，整段租期总成本 {yuan(data.plans[data.plans.length - 1].total)}。</p>}
          </section>

          <section><h2 className="text-[17px] font-semibold">五、营业额预测与候选铺位</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{data.forecast ? `已保存预测参数（有效目标客流 ${data.forecast.effectiveTraffic ?? '—'} 人、客单价 ${data.forecast.ticket ?? '—'} 元、竞品日均订单 ${data.forecast.competitorDailyOrders ?? '—'} 单）。详细三情景请查看营业额预测器。` : '尚未保存营业额预测参数。'}</p>
            {rows.length > 0 && <ul className="mt-2 space-y-1 text-[12.5px] text-ink-2">{rows.map((r) => <li key={r.id}>· {r.name}：预估月营业额 {yuan(r.monthlyRevenue)}，保本线 {yuan(r.breakevenRevenue)}，月经营利润 {yuan(r.monthlyProfit)}</li>)}</ul>}
          </section>

          <section><h2 className="text-[17px] font-semibold">六、谈判记录与合同风险</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">合同检查清单已确认 <strong className="num">{checkedLease}</strong> / {leaseItems.length} 项，待核实 <strong className="num">{pendingLease}</strong> 项；选址路线图已完成 <strong className="num">{data.roadmap.length}</strong> / {siteRoadmap.length} 步。</p>
            <p className="mt-1 text-[12px] text-muted">谈判中的口头承诺必须落到合同附件；租金递增基数、免租期与租金起算日要逐条核对。</p>
          </section>

          <section><h2 className="text-[17px] font-semibold">七、待核实问题</h2>
            {missing.length ? <ul className="mt-2 space-y-1 text-[12.8px] text-ink-2">{missing.map((m) => <li key={m}>· {m}</li>)}</ul> : <p className="mt-2 text-[12.8px] text-olive">各工具均已填写，仍建议现场复核关键假设的数据来源与日期。</p>}
          </section>

          <section className={`rounded-[10px] border p-5 ${advice.tone === 'good' ? 'border-olive/35 bg-olive-soft/40' : advice.tone === 'bad' ? 'border-accent/35 bg-accent-soft/40' : 'border-gold/35 bg-gold-soft/40'}`}>
            <h2 className="flex items-center gap-2 text-[17px] font-semibold"><TriangleAlert className="h-4.5 w-4.5" aria-hidden />八、最终建议</h2>
            <p className="mt-2 text-[16px] font-semibold">{advice.text}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{advice.detail}</p>
            <p className="mt-3 text-[11.8px] leading-relaxed text-muted">评分不是投资成功概率。存在产权、合规或工程条件障碍时，不能因综合评分高而建议签约。本报告为经营口径估算，不构成投资、法律、财税或食品安全建议；涉及许可与合规事项请以所在地现行法规及监管部门要求为准。</p>
          </section>
        </div>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-3 no-print">
        <StorageNote />
        <Link href="/site-selection/tools" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-ink hover:underline">返回全部工具补齐数据 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
      </div>
    </div>
  );
}
