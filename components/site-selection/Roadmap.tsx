'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CircleAlert, ClipboardList, Database, ListChecks, RotateCcw, Target, Wrench } from 'lucide-react';
import { siteRoadmap, siteTools } from '@/lib/site-selection/data';
import { SS_KEYS, useLocalState } from '@/lib/site-selection/store';
import { cn } from '@/lib/utils';

const toolTitles = Object.fromEntries(siteTools.map((t) => [t.slug, t.name]));

export function Roadmap({ articleTitles = {} }: { articleTitles?: Record<string, string> }) {
  const [active, setActive] = useState(0);
  const [done, setDone, resetDone] = useLocalState<string[]>(SS_KEYS.roadmap, []);
  const stage = siteRoadmap[active] ?? siteRoadmap[0];
  const isDone = done.includes(stage.id);

  const toggle = () => setDone((prev) => prev.includes(stage.id) ? prev.filter((s) => s !== stage.id) : [...prev, stage.id]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line sm:w-52" role="progressbar" aria-valuenow={done.length} aria-valuemin={0} aria-valuemax={siteRoadmap.length}>
            <div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${(done.length / siteRoadmap.length) * 100}%` }} />
          </div>
          <span className="num text-[13px] font-medium text-ink-2">已完成 {done.length} / {siteRoadmap.length} 步</span>
        </div>
        {done.length > 0 && (
          <button type="button" onClick={resetDone} className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-accent"><RotateCcw className="h-3.5 w-3.5" aria-hidden />重置进度</button>
        )}
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-3" role="tablist" aria-label="选址流程步骤">
        {siteRoadmap.map((s, i) => (
          <button key={s.id} type="button" role="tab" aria-selected={active === i} onClick={() => setActive(i)}
            className={cn('flex shrink-0 items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[13px] transition-all',
              active === i ? 'border-accent bg-accent text-white shadow-hair'
                : done.includes(s.id) ? 'border-olive/40 bg-olive-soft text-olive hover:border-olive'
                  : 'border-line bg-surface text-ink-2 hover:border-line-strong')}>
            <span className={cn('num text-[11px] font-semibold', active === i ? 'text-white/80' : 'text-muted')}>{String(s.order).padStart(2, '0')}</span>
            <span className="whitespace-nowrap font-medium">{s.title}</span>
            {done.includes(s.id) && active !== i && <Check className="h-3.5 w-3.5" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="card mt-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/50 px-5 py-4 md:px-7">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">STEP {stage.order} · {stage.phase}</span>
            <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.025em] md:text-[26px]">{stage.title}</h3>
          </div>
          <button type="button" onClick={toggle} className={cn('inline-flex items-center gap-2 rounded-[10px] border px-4 py-2 text-[13px] font-medium transition-colors',
            isDone ? 'border-olive/40 bg-olive-soft text-olive' : 'border-line bg-surface text-ink-2 hover:border-accent/50 hover:text-accent-ink')}>
            {isDone ? <Check className="h-4 w-4" aria-hidden /> : <Target className="h-4 w-4" aria-hidden />}
            {isDone ? '这一步已完成' : '标记这一步完成'}
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2 md:p-7">
          <div className="space-y-5">
            <div>
              <h4 className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold"><Target className="h-4 w-4 text-accent" aria-hidden />这一步的目标</h4>
              <p className="text-[14px] leading-relaxed text-ink-2">{stage.goal}</p>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><ListChecks className="h-4 w-4 text-olive" aria-hidden />具体任务</h4>
              <ul className="space-y-1.5 text-[13.5px] text-ink-2">{stage.tasks.map((t) => <li key={t} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />{t}</li>)}</ul>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><Wrench className="h-4 w-4 text-gold" aria-hidden />操作方法</h4>
              <ul className="space-y-1.5 text-[13.5px] text-ink-2">{stage.method.map((m) => <li key={m} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{m}</li>)}</ul>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><Database className="h-4 w-4 text-blue-400" aria-hidden />需要准备的数据</h4>
              <div className="flex flex-wrap gap-1.5">{stage.data.map((x) => <span key={x} className="badge">{x}</span>)}</div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[10px] border border-accent/20 bg-accent-soft/35 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-accent-ink"><CircleAlert className="h-4 w-4" aria-hidden />常见错误</h4>
              <ul className="space-y-1 text-[13px] text-ink-2">{stage.mistakes.map((m) => <li key={m}>· {m}</li>)}</ul>
            </div>
            <div className="rounded-[10px] border border-olive/25 bg-olive-soft/35 p-4">
              <h4 className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-olive"><Check className="h-4 w-4" aria-hidden />通过标准</h4>
              <p className="text-[13.5px] leading-relaxed text-ink-2">{stage.pass}</p>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><ClipboardList className="h-4 w-4 text-gold" aria-hidden />需要准备的工具</h4>
              <div className="flex flex-wrap gap-2">{stage.tools.map((slug) => <Link key={slug} href={`/site-selection/tools/${slug}`} className="chip text-[12.5px]">{toolTitles[slug] ?? slug} <ArrowRight className="h-3 w-3" aria-hidden /></Link>)}</div>
            </div>
            <div>
              <h4 className="mb-2 text-[13px] font-semibold">配套阅读</h4>
              <div className="flex flex-col gap-1.5">{stage.articles.map((slug) => <Link key={slug} href={`/site-selection/guides/${slug}`} className="group inline-flex items-start justify-between gap-3 rounded-[9px] border border-line bg-surface px-3 py-2 text-[13.5px] text-ink-2 hover:border-accent/40 hover:text-accent-ink"><span>{articleTitles[slug] ?? slug}</span><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden /></Link>)}</div>
            </div>
            <p className="rounded-[9px] bg-surface-2 px-3 py-2.5 text-[12.5px] text-ink-2"><strong>下一步：</strong>{stage.next}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" disabled={active === 0} onClick={() => setActive((v) => Math.max(0, v - 1))} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden />上一步</button>
        <span className="num text-[12px] text-muted">{stage.order} / {siteRoadmap.length}</span>
        <button type="button" disabled={active === siteRoadmap.length - 1} onClick={() => setActive((v) => Math.min(siteRoadmap.length - 1, v + 1))} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">下一步 <ArrowRight className="h-4 w-4" aria-hidden /></button>
      </div>
    </div>
  );
}
