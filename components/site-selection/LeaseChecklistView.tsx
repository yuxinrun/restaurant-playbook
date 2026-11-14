'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Download, RotateCcw, ShieldAlert } from 'lucide-react';
import { leaseData } from '@/lib/site-selection/data';
import { SS_KEYS, useLocalState } from '@/lib/site-selection/store';
import { downloadCsv } from '@/lib/site-selection/export';
import type { LeaseCheckState } from '@/lib/site-selection/types';
import { cn } from '@/lib/utils';

const EMPTY: LeaseCheckState = { checked: {}, pending: {}, notes: {} };

export function LeaseChecklistView() {
  const [state, setState, reset] = useLocalState<LeaseCheckState>(SS_KEYS.leaseChecks, EMPTY);
  const allItems = useMemo(() => leaseData.groups.flatMap((g) => g.items), []);
  const done = allItems.filter((x) => state.checked[x.id]).length;
  const pending = allItems.filter((x) => state.pending[x.id]).length;

  const update = (id: string, key: 'checked' | 'pending', value: boolean) => setState((prev) => ({ ...prev, [key]: { ...prev[key], [id]: value } }));
  const setNote = (id: string, value: string) => setState((prev) => ({ ...prev, notes: { ...prev.notes, [id]: value } }));

  const exportCsv = () => downloadCsv('餐饮租赁合同检查清单', [
    ['分组', '检查项', '状态', '为什么重要', '怎么核实', '备注'],
    ...leaseData.groups.flatMap((g) => g.items.map((item) => [
      g.title, item.label,
      state.checked[item.id] ? '已确认' : state.pending[item.id] ? '待核实' : '未检查',
      item.why, item.verify, state.notes[item.id] ?? '',
    ])),
  ]);

  return (
    <div>
      <div className="card mb-5 flex flex-wrap items-start justify-between gap-4 border-gold/35 bg-gold-soft/35 p-5">
        <div className="flex max-w-[760px] items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          <p className="text-[12.8px] leading-relaxed text-ink-2">{leaseData.notice}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} className="btn-secondary text-[12.5px]"><Download className="h-3.5 w-3.5" aria-hidden />导出 CSV</button>
          <button type="button" onClick={reset} className="rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-muted hover:text-ink"><RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden />清空</button>
        </div>
      </div>

      <div className="card mb-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-2">
          <span>已确认 <strong className="num text-olive">{done}</strong> / {allItems.length} 项　待核实 <strong className="num text-accent">{pending}</strong> 项</span>
          <span className="text-[12px] text-muted">勾选状态保存在本机浏览器，不会上传</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${(done / allItems.length) * 100}%` }} />
        </div>
        {pending > 0 && <p className="mt-3 rounded-[9px] border border-accent/25 bg-accent-soft/30 px-3 py-2 text-[12.5px] text-accent-ink">还有 {pending} 项标记为待核实。带红项签约，等于把不确定性写进自己的成本里。</p>}
      </div>

      <div className="space-y-5">
        {leaseData.groups.map((group) => (
          <section key={group.title} className="card overflow-hidden">
            <h3 className="border-b border-line bg-surface-2/50 px-5 py-3 text-[15px] font-semibold">{group.title}</h3>
            <ul className="divide-y divide-line">
              {group.items.map((item) => (
                <li key={item.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <label className="flex cursor-pointer items-start gap-2.5 text-[14px] font-medium text-ink">
                      <input type="checkbox" className="mt-1 accent-[#5F8468]" checked={Boolean(state.checked[item.id])} onChange={(e) => update(item.id, 'checked', e.target.checked)} />
                      <span className={cn(state.checked[item.id] && 'text-muted line-through decoration-line-strong')}>{item.label}</span>
                    </label>
                    <button type="button" onClick={() => update(item.id, 'pending', !state.pending[item.id])} className={cn('shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors', state.pending[item.id] ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-muted hover:border-accent/40')}>
                      {state.pending[item.id] ? '待核实 ✓' : '标记待核实'}
                    </button>
                  </div>
                  <p className="mt-2 pl-6 text-[12.5px] leading-relaxed text-ink-2"><strong>为什么重要：</strong>{item.why}</p>
                  <p className="mt-1 pl-6 text-[12.5px] leading-relaxed text-muted"><strong>怎么核实：</strong>{item.verify}</p>
                  <input className="field-input ml-6 mt-2.5 !w-auto max-w-full text-[12.5px]" style={{ width: 'calc(100% - 1.5rem)' }} value={state.notes[item.id] ?? ''} onChange={(e) => setNote(item.id, e.target.value)} placeholder="写备注：谁答复的、日期、材料编号…" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-5 text-[12.5px] leading-relaxed text-muted">工具只做风险提示与检查辅助，不自动认定合同合法有效。签之前把清单带去和合同逐条对照，必要时请当地专业人士复核。配合 <Link href="/site-selection/guides/ss-16-lease-clauses" className="text-accent-ink hover:underline">《餐饮租赁合同中最容易忽略的 20 个问题》</Link> 一起用，会快很多。</p>
    </div>
  );
}
