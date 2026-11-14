'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Bike, Building2, Info, RotateCcw, Scale,
  Tag, TrendingUp, Utensils, Wrench,
} from 'lucide-react';
import type { ToolDef } from '@/lib/types';
import {
  calcBreakeven, calcDelivery, calcPricing, calcRent, calcRoi, calcTurnover,
  type BreakevenInput, type CalcResult, type DeliveryInput, type PricingInput,
  type RentInput, type RoiInput, type TurnoverInput,
} from '@/lib/calculators';
import { cn } from '@/lib/utils';

const ICONS: Record<string, typeof TrendingUp> = {
  'trending-up': TrendingUp, tag: Tag, scale: Scale, building: Building2, utensils: Utensils, bike: Bike,
};

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon className={className} aria-hidden />;
}

function compute(slug: string, values: Record<string, number>): CalcResult {
  switch (slug) {
    case 'roi': return calcRoi(values as unknown as RoiInput);
    case 'pricing': return calcPricing(values as unknown as PricingInput);
    case 'breakeven': return calcBreakeven(values as unknown as BreakevenInput);
    case 'rent': return calcRent(values as unknown as RentInput);
    case 'turnover': return calcTurnover(values as unknown as TurnoverInput);
    case 'delivery': return calcDelivery(values as unknown as DeliveryInput);
    default: return { metrics: [], raw: {}, warnings: [] };
  }
}

interface CalculatorProps {
  tool: ToolDef;
}

export function Calculator({ tool }: CalculatorProps) {
  const defaults = useMemo(
    () => Object.fromEntries(tool.fields.map((f) => [f.key, String(f.default)])) as Record<string, string>,
    [tool],
  );
  const [values, setValues] = useState<Record<string, string>>(defaults);

  const numeric = useMemo(() => Object.fromEntries(
    tool.fields.map((f) => {
      const n = Number(values[f.key]);
      return [f.key, (Number.isFinite(n) ? n : 0) / (f.kind === 'percent' ? 100 : 1)];
    }),
  ) as Record<string, number>, [tool, values]);

  const result = useMemo(() => compute(tool.slug, numeric), [tool.slug, numeric]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof tool.fields>();
    for (const f of tool.fields) {
      const list = map.get(f.group) ?? [];
      list.push(f);
      map.set(f.group, list);
    }
    return [...map.entries()];
  }, [tool]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start">
      <section className="card p-5 md:p-7" aria-labelledby="calc-inputs">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow mb-2"><span className="eyebrow-dot" />输入参数</p>
            <h2 id="calc-inputs" className="text-[20px] font-semibold tracking-[-0.02em]">填自己的数字，结果立刻变</h2>
            <p className="mt-1.5 text-[13px] text-muted">初始值为演示参数，不代表任何行业标准。</p>
          </div>
          <button type="button" onClick={() => setValues(defaults)} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-muted transition-colors hover:border-accent/40 hover:text-accent-ink">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />恢复示例值
          </button>
        </div>

        <div className="space-y-7">
          {groups.map(([group, fields]) => (
            <fieldset key={group}>
              <legend className="mb-3 w-full border-b border-line pb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{group}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <label key={f.key} className="block">
                    <span className="field-label">{f.label}</span>
                    <span className="relative block">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        value={values[f.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="field-input pr-14"
                        aria-label={f.label}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted">{f.unit}</span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-muted">{f.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="calc-results">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-ink px-5 py-4 text-paper md:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/55">计算结果 · 实时更新</p>
            <h2 id="calc-results" className="mt-1 text-[19px] font-semibold">{tool.short}</h2>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-2">
            {result.metrics.map((m) => (
              <div key={m.label} className={cn('bg-surface px-5 py-4 md:px-6', m.emphasis && 'sm:col-span-2 bg-surface-2/60')}>
                <p className="text-[12px] text-muted">{m.label}</p>
                <p className={cn(
                  'num mt-1 font-semibold leading-tight',
                  m.emphasis ? 'text-[26px] md:text-[30px]' : 'text-[19px]',
                  m.tone === 'good' ? 'text-olive' : m.tone === 'bad' ? 'text-accent' : m.tone === 'warn' ? 'text-gold' : 'text-ink',
                )}>
                  {m.value}
                </p>
                {m.hint && <p className="mt-1 text-[11.5px] leading-snug text-muted">{m.hint}</p>}
              </div>
            ))}
          </div>
          {result.warnings.length > 0 && (
            <div className="border-t border-line bg-gold-soft/50 px-5 py-4 md:px-6">
              <p className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink"><Info className="h-3.5 w-3.5 text-gold" aria-hidden />口径与提醒</p>
              <ul className="space-y-1 text-[12px] leading-relaxed text-ink-2">
                {result.warnings.map((w) => <li key={w}>· {w}</li>)}
              </ul>
            </div>
          )}
        </div>

        <details className="card group p-5 md:p-6" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-ink">
            计算公式（公开口径）
            <span className="text-[12px] font-normal text-muted group-open:hidden">展开</span>
            <span className="hidden text-[12px] font-normal text-muted group-open:inline">收起</span>
          </summary>
          <ul className="mt-4 space-y-2">
            {tool.formula.map((f) => (
              <li key={f} className="rounded-[9px] border border-line bg-surface-2/60 px-3 py-2 font-mono text-[12px] leading-relaxed text-ink-2">{f}</li>
            ))}
          </ul>
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-[12.5px] font-semibold text-ink">使用口径与边界</p>
            <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-muted">
              {tool.caveats.map((c) => <li key={c}>· {c}</li>)}
            </ul>
          </div>
        </details>

        <div className="rounded-lg border border-line bg-paper-soft/60 px-5 py-4 text-[12.5px] leading-relaxed text-muted">
          所有结果都基于你填写的参数演算，属于<strong className="text-ink-2">经营口径</strong>，不构成投资、财税或法律建议。食品安全、消防、劳动与税务事项请以所在地现行法规为准。
          <Link href="/articles/eight-metrics" className="link-underline ml-1">看懂 8 个经营指标 <ArrowRight className="h-3 w-3" aria-hidden /></Link>
        </div>
      </section>
    </div>
  );
}
