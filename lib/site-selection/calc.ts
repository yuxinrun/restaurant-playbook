/**
 * 选址实验室计算内核：全部为纯函数，不依赖 DOM / React，可单独测试。
 *
 * 与主食客模块的分工：
 * - 房租承受力、保本营业额、投资回报直接复用 lib/calculators.ts 的 calcRent / calcBreakeven / calcRoi。
 * - 本文件只实现选址特有的模型：三种营业额估算、租期总成本、加权评分、候选铺位对比、先算再爱。
 *
 * 口径：每月按 30 个营业日；营业额为含税前的经营口径估算；所有结果都是「基于用户假设的推算」。
 */
import { calcRent, type CalcResult } from '@/lib/calculators';
import type { Candidate, ScoreState } from './types';

export const SS_DAYS = 30;
const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------ 营业额估算：三种模型 */

export interface TrafficModelInput {
  /** 单位时间（如每 15 分钟）经过的有效目标客群人数，按全天观察汇总 */
  effectiveTraffic: number;
  enterRate: number;   // 进店转化率 0–1
  buyRate: number;     // 成交转化率 0–1
  ticket: number;      // 客单价
  deliveryOrders: number; // 外卖日均订单，单独加总
  deliveryTicket: number;
}

/** 客流转化模型：有效目标客流 × 进店率 × 成交率 × 客单价。 */
export function forecastTrafficModel(i: TrafficModelInput): number {
  const dineIn = i.effectiveTraffic * i.enterRate * i.buyRate * i.ticket;
  const delivery = i.deliveryOrders * i.deliveryTicket;
  return round2(dineIn + delivery);
}

export interface SeatModelInput {
  seats: number; turns: number; occupancy: number; ticket: number; deliveryDaily: number;
}

/** 座位产能模型：座位数 × 可实现翻台 × 上座率 × 客单价。 */
export function forecastSeatModel(i: SeatModelInput): number {
  return round2(i.seats * i.turns * i.occupancy * i.ticket + i.deliveryDaily);
}

export interface CompetitorModelInput {
  competitorDailyOrders: number; share: number; ticket: number;
}

/** 竞品参照模型：可比门店日均订单 × 你可获得的份额 × 你的客单价。 */
export function forecastCompetitorModel(i: CompetitorModelInput): number {
  return round2(i.competitorDailyOrders * i.share * i.ticket);
}

export interface Scenarios { conservative: number; base: number; optimistic: number; monthlyBase: number }

/** 三情景：以基准估算的 75% / 100% / 125% 作为演示区间，实际应由用户按数据质量调整。 */
export function buildScenarios(baseDaily: number): Scenarios {
  return {
    conservative: round2(baseDaily * 0.75),
    base: round2(baseDaily),
    optimistic: round2(baseDaily * 1.25),
    monthlyBase: round2(baseDaily * SS_DAYS),
  };
}

/* ------------------------------------------------------------ 租赁期总成本 */

export interface LeaseInput {
  quote: number;        // 房东报价（月租）
  target: number;       // 目标租金
  exitPrice: number;    // 退出价
  years: number;
  depositMonths: number;
  freeMonths: number;   // 免租期
  escalation: number;   // 年递增率 0–1
  propertyFee: number;  // 物业费 / 月
  otherFee: number;     // 其他费用 / 月
}

export interface LeaseYear { year: number; monthlyRent: number; rent: number; fees: number; subtotal: number; cumulative: number }

export interface LeaseOutput {
  years: LeaseYear[];
  firstYear: number;
  total: number;
  avgMonthly: number;
  freeRentValue: number;
  escalationCost: number;
  deposit: number;
  scenarios: { name: string; monthlyRent: number; total: number }[];
}

/** 整段租期总占用成本：租金 + 全部附加费 + 押金 − 免租期减免，逐年按递增率累加。 */
export function calcLeaseCost(i: LeaseInput): LeaseOutput {
  const years = Math.max(1, Math.min(20, Math.round(i.years)));
  const feesMonthly = i.propertyFee + i.otherFee;
  const deposit = round2(i.quote * i.depositMonths);
  const yearsData: LeaseYear[] = [];
  let cumulative = 0;
  let escalationCost = 0;

  for (let y = 1; y <= years; y += 1) {
    const monthlyRent = round2(i.quote * Math.pow(1 + i.escalation, y - 1));
    const freeMonths = y === 1 ? Math.min(i.freeMonths, 12) : 0;
    const rent = round2(monthlyRent * (12 - freeMonths));
    const fees = round2(feesMonthly * 12);
    const subtotal = round2(rent + fees);
    cumulative = round2(cumulative + subtotal + (y === 1 ? deposit : 0));
    escalationCost = round2(escalationCost + (monthlyRent - i.quote) * 12);
    yearsData.push({ year: y, monthlyRent, rent, fees, subtotal, cumulative });
  }

  const total = cumulative;
  const scenarios = [
    { name: '房东报价', monthlyRent: i.quote },
    { name: '目标租金', monthlyRent: i.target },
    { name: '退出价', monthlyRent: i.exitPrice },
  ].map((s) => ({ ...s, total: round2(calcLeaseCostRaw({ ...i, quote: s.monthlyRent }).total) }));

  return {
    years: yearsData,
    firstYear: yearsData[0]?.subtotal ?? 0,
    total,
    avgMonthly: round2(total / (years * 12)),
    freeRentValue: round2(i.quote * Math.min(i.freeMonths, 12)),
    escalationCost,
    deposit,
    scenarios,
  };
}

/** 内部用：只取总成本，避免递归构造 scenarios。 */
function calcLeaseCostRaw(i: LeaseInput): { total: number } {
  const years = Math.max(1, Math.min(20, Math.round(i.years)));
  let total = i.quote * i.depositMonths;
  for (let y = 1; y <= years; y += 1) {
    const monthly = i.quote * Math.pow(1 + i.escalation, y - 1);
    const free = y === 1 ? Math.min(i.freeMonths, 12) : 0;
    total += monthly * (12 - free) + (i.propertyFee + i.otherFee) * 12;
  }
  return { total };
}

/* ------------------------------------------------------------ 加权评分与一票否决 */

export interface ScoreOutput {
  total: number; max: number; counted: number; dimensions: { id: string; value: number; weight: number; weighted: number }[];
  vetoes: string[]; weak: string[];
}

export function calcWeightedScore(state: ScoreState, dimensionIds: string[]): ScoreOutput {
  const dimensions = dimensionIds.map((id) => {
    const value = Math.max(0, Math.min(10, state.values[id] ?? 0));
    const weight = Math.max(0, state.weights[id] ?? 1);
    return { id, value, weight, weighted: value * weight };
  });
  const weightSum = dimensions.reduce((s, d) => s + d.weight, 0) || 1;
  const total = round2(dimensions.reduce((s, d) => s + d.weighted, 0) / weightSum);
  const vetoes = Object.entries(state.veto).filter(([, v]) => v).map(([k]) => k);
  const weak = dimensions.filter((d) => d.value <= 4).map((d) => d.id);
  return { total, max: 10, counted: dimensions.length, dimensions, vetoes, weak };
}

/* ------------------------------------------------------------ 候选铺位对比 */

export interface CandidateRow extends Candidate {
  monthlyRevenue: number;
  variableCost: number;
  fixedCost: number;
  monthlyProfit: number;
  breakevenRevenue: number;
  rentRate: number;
  payback: number;
  risk: string[];
}

export function compareCandidates(list: Candidate[]): CandidateRow[] {
  return list.map((c) => {
    const monthlyRevenue = round2(c.dailyOrders * c.ticket * SS_DAYS);
    const contributionRate = Math.max(0.01, Math.min(0.99, c.contributionRate));
    const variableCost = round2(monthlyRevenue * (1 - contributionRate));
    const fixedCost = round2(c.rent + c.otherFixedCost);
    const monthlyProfit = round2(monthlyRevenue - variableCost - fixedCost);
    const breakevenRevenue = round2(fixedCost / contributionRate);
    const rentRate = monthlyRevenue > 0 ? c.rent / monthlyRevenue : Infinity;
    const payback = monthlyProfit > 0 ? c.initialInvestment / monthlyProfit : Infinity;
    const risk: string[] = [];
    if (monthlyProfit <= 0) risk.push('当前假设下月经营利润为负');
    if (monthlyRevenue < breakevenRevenue) risk.push('预估营业额低于保本线');
    if (rentRate > 0.2) risk.push('租金占营业额偏高');
    if (c.dailyTraffic < c.dailyOrders * 20) risk.push('客流样本不足以支撑订单假设');
    if (c.competition >= 5) risk.push('同品类竞争密集');
    return { ...c, monthlyRevenue, variableCost, fixedCost, monthlyProfit, breakevenRevenue, rentRate, payback, risk };
  });
}

/* ------------------------------------------------------------ 一个铺位，先算再爱 */

export interface QuickEvalInput {
  name: string; category: string; area: number; monthlyRent: number;
  transferFee: number; ticket: number; dailyOrders: number;
  targetRentRate: number; contributionRate: number; otherFixedCost: number;
  initialInvestment: number; trafficVerified: boolean; complianceVerified: boolean;
}

export interface QuickEvalOutput {
  monthlyRevenue: number; rentCheck: CalcResult;
  breakevenRevenue: number; monthlyProfit: number; payback: number;
  risks: string[]; gaps: string[]; verdict: string;
}

export function quickEvaluate(i: QuickEvalInput): QuickEvalOutput {
  const monthlyRevenue = round2(i.ticket * i.dailyOrders * SS_DAYS);
  const rentCheck = calcRent({ monthlyRent: i.monthlyRent, expectedRevenue: monthlyRevenue, targetRentRate: i.targetRentRate });
  const contributionRate = Math.max(0.01, Math.min(0.99, i.contributionRate));
  const fixedCost = round2(i.monthlyRent + i.otherFixedCost);
  const breakevenRevenue = round2(fixedCost / contributionRate);
  const monthlyProfit = round2(monthlyRevenue * contributionRate - fixedCost);
  const payback = monthlyProfit > 0 ? (i.initialInvestment + i.transferFee) / monthlyProfit : Infinity;

  const risks: string[] = [];
  const gaps: string[] = [];
  if (monthlyRevenue < breakevenRevenue) risks.push('按当前假设，预估营业额低于保本线');
  if (monthlyProfit <= 0) risks.push('按当前假设，月经营利润为负');
  if (i.monthlyRent / (monthlyRevenue || 1) > i.targetRentRate) risks.push('租金占比超过你自己设定的目标');
  if (i.transferFee > 0) risks.push('转让费需核实设备归属、原租约与欠费');
  if (!i.trafficVerified) { gaps.push('客流数据：至少完成六轮现场调查'); risks.push('订单量尚未由现场数据验证'); }
  if (!i.complianceVerified) { gaps.push('合规条件：排烟、消防、房屋用途与许可'); risks.push('存在未核实的一票否决项'); }
  gaps.push('竞争门店：菜单、价格带与高峰进店人数');
  gaps.push('合同条件：递增、物业与附加费、免租期、解约条款');
  gaps.push('投资明细：装修、设备、押金与筹备费');

  const verdict = gaps.length > 3 || monthlyRevenue < breakevenRevenue
    ? '信息不完整，不建议现在得出结论；先补齐现场与合规调查'
    : monthlyProfit > 0 ? '可以继续调查，并把未确认事项带到谈判桌' : '按当前假设不成立，建议调整条件或放弃';

  return { monthlyRevenue, rentCheck, breakevenRevenue, monthlyProfit, payback, risks, gaps, verdict };
}

/* ------------------------------------------------------------ 现场客流统计 */

export function trafficRate(target: number, passers: number): number {
  return passers > 0 ? round2((target / passers) * 100) : 0;
}

export function hourlyFromMinutes(countInWindow: number, minutes: number): number {
  return minutes > 0 ? round2(countInWindow * 60 / minutes) : 0;
}
