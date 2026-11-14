'use client';

import { useState } from 'react';
import { scenarioData } from '@/lib/site-selection/data';
import { cn } from '@/lib/utils';

export function SceneMatrix() {
  const [tab, setTab] = useState<'scenes' | 'categories'>('scenes');
  const [active, setActive] = useState(0);
  const list = tab === 'scenes' ? scenarioData.scenes : scenarioData.categories;
  const item = list[active];

  const fields: [string, string][] = tab === 'scenes'
    ? [
      ['客群', (item as (typeof scenarioData.scenes)[number]).audience],
      ['消费时间', (item as (typeof scenarioData.scenes)[number]).time],
      ['客单价特征', (item as (typeof scenarioData.scenes)[number]).price],
      ['竞争特点', (item as (typeof scenarioData.scenes)[number]).competition],
      ['租金特征', (item as (typeof scenarioData.scenes)[number]).rent],
      ['适合品类', (item as (typeof scenarioData.scenes)[number]).suitable],
      ['主要风险', (item as (typeof scenarioData.scenes)[number]).risk],
      ['考察方法', (item as (typeof scenarioData.scenes)[number]).method],
    ]
    : [
      ['选址优先级', (item as (typeof scenarioData.categories)[number]).priority],
      ['专门检查表', (item as (typeof scenarioData.categories)[number]).checklist.join(' / ')],
      ['应避开', (item as (typeof scenarioData.categories)[number]).avoid],
    ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-[10px] border border-line bg-surface p-1">
          {([['scenes', '13 类场景'], ['categories', '12 类品类']] as const).map(([key, label]) => (
            <button key={key} type="button" onClick={() => { setTab(key); setActive(0); }} className={cn('rounded-[8px] px-3.5 py-1.5 text-[12.5px] font-medium transition-colors', tab === key ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink')}>{label}</button>
          ))}
        </div>
        <p className="max-w-[560px] text-[11.8px] leading-relaxed text-muted">{scenarioData.notice}</p>
      </div>
      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {list.map((x, i) => (
          <button key={x.id} type="button" onClick={() => setActive(i)} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors', active === i ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-2 hover:border-accent/40')}>{x.name}</button>
        ))}
      </div>
      <div className="card p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{tab === 'scenes' ? 'SCENE' : 'CATEGORY'} {String(active + 1).padStart(2, '0')}</p>
        <h3 className="mt-1 text-[21px] font-semibold">{item.name}</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k} className="rounded-[9px] border border-line bg-surface-2/40 px-4 py-3">
              <dt className="text-[11.5px] font-semibold text-muted">{k}</dt>
              <dd className="mt-1 text-[13.2px] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
