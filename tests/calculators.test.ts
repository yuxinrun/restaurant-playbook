import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INPUTS, calcBreakeven, calcDelivery, calcPricing, calcRent, calcRoi, calcTurnover,
} from '../lib/calculators';

const close = (actual: number, expected: number, precision = 4) => {
  expect(Number(actual.toFixed(precision))).toBeCloseTo(expected, precision);
};

describe('calcRoi · 投资回报', () => {
  const r = calcRoi(DEFAULT_INPUTS.roi).raw;

  it('初始投资包含押金但不重复计租金', () => {
    expect(r.initialInvestment).toBe(120000 + 80000 + 0 + 30000 + 12000 * 3);
    expect(r.initialInvestment).toBe(266000);
  });

  it('按 30 天口径计算营业额与成本', () => {
    expect(r.monthlyRevenue).toBe(120000);
    expect(r.variableCost).toBe(48000);
    expect(r.fixedCost).toBe(49000);
    expect(r.monthlyProfit).toBe(23000);
  });

  it('保本营业额与回本周期符合公式', () => {
    close(r.breakevenRevenue, 49000 / 0.6, 2);
    close(r.payback, 266000 / 23000, 4);
  });

  it('营业额下降时利润下降更快', () => {
    const lower = calcRoi({ ...DEFAULT_INPUTS.roi, dailyRevenue: 2800 }).raw;
    expect(lower.monthlyProfit).toBe(1400);
    expect(lower.monthlyProfit / r.monthlyProfit).toBeLessThan(0.1);
  });

  it('变动成本率 ≥ 100% 时给出警告且不产生有限保本点', () => {
    const bad = calcRoi({ ...DEFAULT_INPUTS.roi, foodCostRate: 0.9, otherVariableRate: 0.15 });
    expect(bad.raw.breakevenRevenue).toBe(Infinity);
    expect(bad.warnings.length).toBeGreaterThan(0);
  });
});

describe('calcPricing · 菜品定价', () => {
  it('按目标毛利率倒推售价', () => {
    const r = calcPricing(DEFAULT_INPUTS.pricing).raw;
    expect(r.variableCost).toBe(14.5);
    close(r.price, 14.5 / 0.35, 4);
    close(r.grossProfit, 14.5 / 0.35 - 14.5, 4);
    close(r.actualMargin, 0.65, 6);
  });

  it('目标毛利率越界时不产生价格', () => {
    const r = calcPricing({ ...DEFAULT_INPUTS.pricing, targetMarginRate: 1 });
    expect(r.raw.price).toBe(Infinity);
    expect(r.warnings[0]).toContain('0%');
  });
});

describe('calcBreakeven · 盈亏平衡', () => {
  it('保本订单量与营业额', () => {
    const r = calcBreakeven(DEFAULT_INPUTS.breakeven).raw;
    expect(r.contributionPerOrder).toBe(27);
    close(r.breakevenOrders, 49000 / 27, 4);
    close(r.breakevenRevenue, (49000 / 27) * 45, 2);
    close(r.breakevenDailyOrders, 49000 / 27 / 30, 4);
  });

  it('单笔贡献利润为负时无法保本', () => {
    const r = calcBreakeven({ fixedCost: 49000, avgTicket: 18, variablePerOrder: 20, operatingDays: 30 });
    expect(r.raw.breakevenOrders).toBe(Infinity);
    expect(r.warnings[0]).toContain('≤ 0');
  });
});

describe('calcRent · 房租承受力', () => {
  it('倒推所需营业额与租金上限', () => {
    const r = calcRent(DEFAULT_INPUTS.rent).raw;
    expect(r.actualRate).toBeCloseTo(0.1, 6);
    expect(r.maxRent).toBe(12000);
    expect(r.requiredRevenue).toBe(120000);
    expect(r.buffer).toBe(10);
  });

  it('租金超出目标时给出超支金额', () => {
    const r = calcRent({ monthlyRent: 20000, expectedRevenue: 120000, targetRentRate: 0.1 }).raw;
    expect(r.gap).toBe(-8000);
    expect(r.revenueGap).toBe(80000);
    const metrics = calcRent({ monthlyRent: 20000, expectedRevenue: 120000, targetRentRate: 0.1 }).metrics;
    expect(metrics[0]?.tone).toBe('bad');
  });
});

describe('calcTurnover · 翻台率', () => {
  it('实际翻台与理论产能', () => {
    const r = calcTurnover(DEFAULT_INPUTS.turnover).raw;
    expect(r.turns).toBe(8);
    expect(r.theoreticalTurns).toBe(12);
    expect(r.capacity).toBe(144);
    close(r.utilization, 96 / 144, 4);
    expect(r.idleTables).toBe(48);
  });

  it('实际订单超过理论产能时提示核对口径', () => {
    const r = calcTurnover({ tables: 5, operatingHours: 10, avgDiningMinutes: 60, actualOrders: 200 });
    expect(r.warnings[0]).toContain('理论接待上限');
  });
});

describe('calcDelivery · 外卖贡献利润', () => {
  it('逐项扣减随单成本', () => {
    const r = calcDelivery(DEFAULT_INPUTS.delivery).raw;
    expect(r.netRevenue).toBe(33);
    expect(r.commission).toBeCloseTo(7.6, 6);
    expect(r.totalVariable).toBeCloseTo(28.1, 6);
    expect(r.contribution).toBeCloseTo(4.9, 6);
    close(r.maxCommission, 12.5 / 38, 4);
    close(r.breakevenPrice, 31.875, 4);
  });

  it('不亏钱的最低标价代入后贡献利润约为 0', () => {
    const base = DEFAULT_INPUTS.delivery;
    const breakevenPrice = calcDelivery(base).raw.breakevenPrice;
    const r = calcDelivery({ ...base, price: breakevenPrice, commissionRate: 0.2 }).raw;
    expect(Math.abs(r.contribution)).toBeLessThan(1e-9);
  });

  it('高佣金会给出负贡献利润', () => {
    const r = calcDelivery({ ...DEFAULT_INPUTS.delivery, commissionRate: 0.5 }).raw;
    expect(r.contribution).toBeLessThan(0);
  });
});
