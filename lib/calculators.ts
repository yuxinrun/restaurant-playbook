/**
 * 餐饮经营计算内核：全部为纯函数，不依赖 DOM / React，可单独测试。
 *
 * 统一口径：
 * - 毛利率 =（售价 − 单份变动成本）/ 售价，只扣食材、包装、佣金等随单发生的成本。
 * - 贡献利润 = 营业收入 − 全部变动成本，尚未扣除人工、房租等固定成本。
 * - 月经营利润 = 月营业额 − 变动成本 − 固定成本（未扣税、折旧、利息）。
 * - 涉及「30 天/月」的计算均按 30 个营业日，实际请改为自己的营业天数。
 */

export interface CalcMetric {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
  tone?: 'good' | 'warn' | 'bad' | 'neutral';
}

export interface CalcResult {
  metrics: CalcMetric[];
  raw: Record<string, number>;
  warnings: string[];
}

import { count, months, percent, wan, yuan } from './format';

const DAYS = 30;

function result(metrics: CalcMetric[], raw: Record<string, number>, warnings: string[] = []): CalcResult {
  return { metrics, raw, warnings };
}

/* ------------------------------------------------------------------ 1. 投资回报 */
export interface RoiInput {
  area: number;
  monthlyRent: number;
  fitout: number;
  equipment: number;
  transferFee: number;
  preOpening: number;
  depositMonths: number;
  dailyRevenue: number;
  foodCostRate: number;
  otherVariableRate: number;
  laborCost: number;
  otherFixedCost: number;
}

export function calcRoi(i: RoiInput): CalcResult {
  const rentDeposit = i.monthlyRent * i.depositMonths;
  const initialInvestment = i.fitout + i.equipment + i.transferFee + i.preOpening + rentDeposit;
  const monthlyRevenue = i.dailyRevenue * DAYS;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const variableCost = round2(monthlyRevenue * (i.foodCostRate + i.otherVariableRate));
  const fixedCost = round2(i.monthlyRent + i.laborCost + i.otherFixedCost);
  const monthlyCost = round2(variableCost + fixedCost);
  const monthlyProfit = round2(monthlyRevenue - monthlyCost);
  const contributionRate = 1 - i.foodCostRate - i.otherVariableRate;
  const breakevenRevenue = contributionRate > 0 ? fixedCost / contributionRate : Infinity;
  const payback = monthlyProfit > 0 ? initialInvestment / monthlyProfit : Infinity;
  const rentRate = monthlyRevenue > 0 ? i.monthlyRent / monthlyRevenue : Infinity;
  const efficiency = i.area > 0 ? monthlyRevenue / i.area : 0;
  const safetyMargin = monthlyRevenue > 0 ? (monthlyRevenue - breakevenRevenue) / monthlyRevenue : 0;

  const warnings: string[] = [];
  if (contributionRate <= 0) warnings.push('变动成本率已 ≥ 100%，卖得越多亏得越多，请先调整成本结构。');
  if (monthlyProfit <= 0) warnings.push('当前参数下月经营利润为负，谈不上回本；先回到盈亏平衡计算器调参数。');
  if (rentRate > 0.15) warnings.push('房租占营业额比重偏高，房租是刚性的，淡季会格外疼。');
  if (payback > 36 && Number.isFinite(payback)) warnings.push('回本周期超过 36 个月，租赁期内能否收回投资需要慎重评估。');

  return result(
    [
      { label: '初始投资', value: wan(initialInvestment), emphasis: true, hint: '含装修、设备、转让费、筹备费与房租押金' },
      { label: '月营业额', value: wan(monthlyRevenue), hint: `日营业额 × ${DAYS} 天` },
      { label: '月经营成本', value: wan(monthlyCost), hint: `变动成本 ${wan(variableCost)} + 固定成本 ${wan(fixedCost)}` },
      { label: '月经营利润', value: wan(monthlyProfit), emphasis: true, tone: monthlyProfit > 0 ? 'good' : 'bad', hint: '未扣税、折旧与利息' },
      { label: '预计回本周期', value: months(payback), emphasis: true },
      { label: '盈亏平衡营业额', value: wan(breakevenRevenue), hint: `边际贡献率 ${percent(contributionRate)}` },
      { label: '房租占营业额', value: Number.isFinite(rentRate) ? percent(rentRate) : '—' },
      { label: '月坪效', value: i.area > 0 ? yuan(efficiency) + '/㎡' : '—' },
      { label: '安全边际', value: Number.isFinite(safetyMargin) ? percent(safetyMargin) : '—', hint: '营业额离保本线还有多远' },
    ],
    {
      initialInvestment, monthlyRevenue, variableCost, fixedCost, monthlyCost,
      monthlyProfit, contributionRate, breakevenRevenue, payback, rentRate, efficiency, safetyMargin,
    },
    warnings,
  );
}

/* ------------------------------------------------------------------ 2. 菜品定价 */
export interface PricingInput {
  foodCost: number;
  packagingCost: number;
  otherVariableCost: number;
  targetMarginRate: number;
}

export function calcPricing(i: PricingInput): CalcResult {
  const variableCost = i.foodCost + i.packagingCost + i.otherVariableCost;
  const validTarget = i.targetMarginRate > 0 && i.targetMarginRate < 1;
  const price = validTarget ? variableCost / (1 - i.targetMarginRate) : Infinity;
  const grossProfit = price - variableCost;
  const actualMargin = price > 0 && Number.isFinite(price) ? grossProfit / price : 0;
  const costRate = price > 0 && Number.isFinite(price) ? variableCost / price : 0;
  const multiple = variableCost > 0 && Number.isFinite(price) ? price / variableCost : 0;

  const warnings: string[] = [];
  if (!validTarget) warnings.push('目标毛利率需在 0% 与 100% 之间，否则无法定价。');
  warnings.push('这里算的是「单份贡献毛利率」，不含人工、房租与平台固定费用，别拿它当净利率。');

  return result(
    [
      { label: '建议售价', value: yuan(price, 2), emphasis: true },
      { label: '单份变动成本', value: yuan(variableCost, 2), hint: '食材 + 包装 + 其他随单成本' },
      { label: '单份毛利', value: yuan(grossProfit, 2), emphasis: true, tone: 'good' },
      { label: '实际毛利率', value: percent(actualMargin), hint: '等于目标毛利率' },
      { label: '成本占售价', value: percent(costRate) },
      { label: '成本倍数', value: Number.isFinite(multiple) ? `${count(multiple, 2)} ×` : '—', hint: '售价 ÷ 单份变动成本' },
    ],
    { variableCost, price, grossProfit, actualMargin, costRate, multiple },
    warnings,
  );
}

/* ------------------------------------------------------------------ 3. 盈亏平衡 */
export interface BreakevenInput {
  fixedCost: number;
  avgTicket: number;
  variablePerOrder: number;
  operatingDays: number;
}

export function calcBreakeven(i: BreakevenInput): CalcResult {
  const contributionPerOrder = i.avgTicket - i.variablePerOrder;
  const contributionRate = i.avgTicket > 0 ? contributionPerOrder / i.avgTicket : 0;
  const breakevenOrders = contributionPerOrder > 0 ? i.fixedCost / contributionPerOrder : Infinity;
  const breakevenRevenue = Number.isFinite(breakevenOrders) ? breakevenOrders * i.avgTicket : Infinity;
  const breakevenDailyOrders = Number.isFinite(breakevenOrders) && i.operatingDays > 0 ? breakevenOrders / i.operatingDays : Infinity;
  const breakevenDailyRevenue = Number.isFinite(breakevenRevenue) && i.operatingDays > 0 ? breakevenRevenue / i.operatingDays : Infinity;

  const warnings: string[] = [];
  if (contributionPerOrder <= 0) warnings.push('单笔贡献利润 ≤ 0，每卖一单都在亏钱，先改定价或成本。');
  warnings.push('固定成本请填「每月」总额；变动成本请填「每单」金额，两者别混用。');

  return result(
    [
      { label: '保本订单量', value: Number.isFinite(breakevenOrders) ? `${yuan(breakevenOrders).replace(' 元', '')} 单/月` : '无法保本', emphasis: true },
      { label: '保本营业额', value: wan(breakevenRevenue), emphasis: true },
      { label: '保本日均订单', value: Number.isFinite(breakevenDailyOrders) ? `${count(breakevenDailyOrders, 1)} 单/天` : '无法保本' },
      { label: '保本日均营业额', value: yuan(breakevenDailyRevenue), hint: '按上方营业天数折算' },
      { label: '单笔贡献利润', value: yuan(contributionPerOrder, 2) },
      { label: '边际贡献率', value: percent(contributionRate) },
    ],
    { contributionPerOrder, contributionRate, breakevenOrders, breakevenRevenue, breakevenDailyOrders, breakevenDailyRevenue },
    warnings,
  );
}

/* ------------------------------------------------------------------ 4. 房租承受力 */
export interface RentInput {
  monthlyRent: number;
  expectedRevenue: number;
  targetRentRate: number;
}

export function calcRent(i: RentInput): CalcResult {
  const actualRate = i.expectedRevenue > 0 ? i.monthlyRent / i.expectedRevenue : Infinity;
  const maxRent = i.expectedRevenue * i.targetRentRate;
  const requiredRevenue = i.targetRentRate > 0 ? i.monthlyRent / i.targetRentRate : Infinity;
  const gap = maxRent - i.monthlyRent;
  const revenueGap = requiredRevenue - i.expectedRevenue;
  const buffer = i.targetRentRate > 0 ? 1 / i.targetRentRate : 0;

  const verdict = !Number.isFinite(actualRate) ? 'bad'
    : actualRate <= i.targetRentRate ? 'good'
      : actualRate <= i.targetRentRate * 1.5 ? 'warn' : 'bad';

  return result(
    [
      { label: '当前房租占比', value: Number.isFinite(actualRate) ? percent(actualRate) : '—', emphasis: true, tone: verdict === 'good' ? 'good' : verdict === 'warn' ? 'warn' : 'bad' },
      { label: '你的目标占比', value: percent(i.targetRentRate), hint: '由你自己填写，不是行业标准' },
      { label: '这个营业额能承受的月租上限', value: yuan(maxRent) },
      { label: '现有租金需要达到的月营业额', value: wan(requiredRevenue), emphasis: true },
      { label: '租金余额 / 超支', value: yuan(gap), tone: gap >= 0 ? 'good' : 'bad' },
      { label: '营业额缺口', value: yuan(revenueGap), hint: '还差多少营业额才把房租摊薄到目标' },
      { label: '每多 1 元月租', value: `需多 ${yuan(buffer)} 营业额`, hint: '按目标占比倒推' },
    ],
    { actualRate, maxRent, requiredRevenue, gap, revenueGap, buffer },
    ['目标占比是你的经营选择，不是任何机构发布的行业平均值；不同品类、城市与商圈差异很大。'],
  );
}

/* ------------------------------------------------------------------ 5. 翻台率 */
export interface TurnoverInput {
  tables: number;
  operatingHours: number;
  avgDiningMinutes: number;
  actualOrders: number;
}

export function calcTurnover(i: TurnoverInput): CalcResult {
  const turns = i.tables > 0 ? i.actualOrders / i.tables : 0;
  const theoreticalTurns = i.avgDiningMinutes > 0 ? (i.operatingHours * 60) / i.avgDiningMinutes : 0;
  const capacity = i.tables * theoreticalTurns;
  const utilization = capacity > 0 ? i.actualOrders / capacity : 0;
  const idleTables = Math.max(0, capacity - i.actualOrders);
  const avgInterval = turns > 0 && i.operatingHours > 0 ? (i.operatingHours / turns) * 60 : 0;

  const warnings: string[] = [];
  if (utilization > 1) warnings.push('实际订单量超过理论接待上限：可能用餐时长估高了，或存在拼桌 / 外卖订单，请核对口径。');
  warnings.push('这里按「每桌每轮产生 1 单」的桌数口径计算；若你的门店按客位数统计，请统一口径后再比。');

  return result(
    [
      { label: '实际翻台率', value: `${count(turns, 2)} 次/天`, emphasis: true },
      { label: '理论最大翻台', value: `${count(theoreticalTurns, 2)} 次/天`, hint: '营业时长 ÷ 平均用餐时长' },
      { label: '桌位产能利用率', value: percent(utilization), emphasis: true, tone: utilization > 0.85 ? 'good' : utilization > 0.6 ? 'warn' : 'bad' },
      { label: '理论可接待订单', value: `${count(capacity)} 单/天` },
      { label: '空转桌次', value: `${count(idleTables)} 桌次/天` },
      { label: '平均每桌间隔', value: `${count(avgInterval, 0)} 分钟` },
    ],
    { turns, theoreticalTurns, capacity, utilization, idleTables, avgInterval },
    warnings,
  );
}

/* ------------------------------------------------------------------ 6. 外卖利润 */
export interface DeliveryInput {
  price: number;
  foodCost: number;
  commissionRate: number;
  packagingCost: number;
  deliveryCost: number;
  discount: number;
  marketingCost: number;
}

export function calcDelivery(i: DeliveryInput): CalcResult {
  const netRevenue = i.price - i.discount;
  const commission = i.price * i.commissionRate;
  const totalVariable = i.foodCost + commission + i.packagingCost + i.deliveryCost + i.marketingCost;
  const contribution = netRevenue - totalVariable;
  const contributionRate = i.price > 0 ? contribution / i.price : 0;
  const maxCommission = i.price > 0
    ? (netRevenue - i.foodCost - i.packagingCost - i.deliveryCost - i.marketingCost) / i.price
    : 0;
  const breakevenPrice = 1 - i.commissionRate > 0
    ? (i.foodCost + i.packagingCost + i.deliveryCost + i.discount + i.marketingCost) / (1 - i.commissionRate)
    : Infinity;

  return result(
    [
      { label: '单笔实收', value: yuan(netRevenue, 2), hint: '标价 − 商家承担的优惠补贴' },
      { label: '单笔总变动成本', value: yuan(totalVariable, 2) },
      { label: '平台佣金', value: yuan(commission, 2), hint: `按标价 × ${percent(i.commissionRate, 0)} 估算` },
      { label: '单笔贡献利润', value: yuan(contribution, 2), emphasis: true, tone: contribution > 0 ? 'good' : 'bad' },
      { label: '贡献利润率', value: percent(contributionRate), emphasis: true },
      { label: '佣金盈亏上限', value: percent(Math.max(0, maxCommission)), hint: '超过这个佣金率，这单就不赚钱' },
      { label: '不亏钱的最低标价', value: yuan(breakevenPrice, 2) },
    ],
    { netRevenue, commission, totalVariable, contribution, contributionRate, maxCommission, breakevenPrice },
    [
      '贡献利润未扣除人工、房租、水电与管理费用，不等于净利润。',
      '各平台佣金计费基数不同（标价 / 实付 / 配送费口径），请按后台账单修改输入。',
    ],
  );
}

export const DEFAULT_INPUTS = {
  roi: { area: 30, monthlyRent: 12000, fitout: 120000, equipment: 80000, transferFee: 0, preOpening: 30000, depositMonths: 3, dailyRevenue: 4000, foodCostRate: 0.35, otherVariableRate: 0.05, laborCost: 28000, otherFixedCost: 9000 } satisfies RoiInput,
  pricing: { foodCost: 12, packagingCost: 1.5, otherVariableCost: 1, targetMarginRate: 0.65 } satisfies PricingInput,
  breakeven: { fixedCost: 49000, avgTicket: 45, variablePerOrder: 18, operatingDays: 30 } satisfies BreakevenInput,
  rent: { monthlyRent: 12000, expectedRevenue: 120000, targetRentRate: 0.1 } satisfies RentInput,
  turnover: { tables: 12, operatingHours: 11, avgDiningMinutes: 55, actualOrders: 96 } satisfies TurnoverInput,
  delivery: { price: 38, foodCost: 13, commissionRate: 0.2, packagingCost: 2.5, deliveryCost: 3, discount: 5, marketingCost: 2 } satisfies DeliveryInput,
};
