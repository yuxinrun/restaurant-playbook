'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CircleAlert, ListChecks, RotateCcw, Target, Wrench } from 'lucide-react';
import type { RoadmapStage } from '@/lib/types';
import { ROADMAP_EVENT, getRoadmapProgress, resetRoadmapProgress, toggleRoadmapStage } from '@/lib/client-store';
import { cn } from '@/lib/utils';

interface RoadmapExplorerProps {
  stages: RoadmapStage[];
  articleTitles: Record<string, string>;
  toolTitles: Record<string, string>;
}

export function RoadmapExplorer({ stages, articleTitles, toolTitles }: RoadmapExplorerProps) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(getRoadmapProgress());
    sync();
    window.addEventListener(ROADMAP_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ROADMAP_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const stage = stages[active] ?? stages[0];
  if (!stage) return null;
  const isDone = done.includes(stage.id);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line sm:w-52" role="progressbar" aria-valuenow={done.length} aria-valuemin={0} aria-valuemax={stages.length}>
            <div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${(done.length / stages.length) * 100}%` }} />
          </div>
          <span className="num text-[13px] font-medium text-ink-2">已完成 {done.length} / {stages.length} 阶段</span>
        </div>
        {done.length > 0 && (
          <button type="button" onClick={() => { resetRoadmapProgress(); setDone([]); }} className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-accent">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />重置进度
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-3" role="tablist" aria-label="开店阶段">
        {stages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[13px] transition-all duration-200',
              active === i
                ? 'border-accent bg-accent text-white shadow-hair'
                : done.includes(s.id)
                  ? 'border-olive/40 bg-olive-soft text-olive hover:border-olive'
                  : 'border-line bg-surface text-ink-2 hover:border-line-strong',
            )}
          >
            <span className={cn('num text-[11px] font-semibold', active === i ? 'text-white/80' : 'text-muted')}>{String(s.order).padStart(2, '0')}</span>
            <span className="font-medium whitespace-nowrap">{s.title}</span>
            {done.includes(s.id) && active !== i && <Check className="h-3.5 w-3.5" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="card mt-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/50 px-5 py-4 md:px-7">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Phase {stage.order} · {stage.phase}</span>
            <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-ink md:text-[26px]">{stage.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => setDone(toggleRoadmapStage(stage.id))}
            className={cn(
              'inline-flex items-center gap-2 rounded-[10px] border px-4 py-2 text-[13px] font-medium transition-colors',
              isDone ? 'border-olive/40 bg-olive-soft text-olive' : 'border-line bg-surface text-ink-2 hover:border-accent/50 hover:text-accent-ink',
            )}
          >
            {isDone ? <Check className="h-4 w-4" aria-hidden /> : <Target className="h-4 w-4" aria-hidden />}
            {isDone ? '这一阶段已完成' : '标记这一阶段完成'}
          </button>
        </div>

        <div className="grid gap-7 p-5 md:grid-cols-2 md:p-7">
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ink"><Target className="h-4 w-4 text-accent" aria-hidden />学习目标</h4>
              <p className="text-[14.5px] leading-relaxed text-ink-2">{stage.goal}</p>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ink"><ListChecks className="h-4 w-4 text-olive" aria-hidden />核心任务</h4>
              <ul className="space-y-2 text-[14px] text-ink-2">
                {stage.tasks.map((t) => (
                  <li key={t} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[10px] border border-accent/20 bg-accent-soft/35 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-accent-ink"><CircleAlert className="h-4 w-4" aria-hidden />常见错误</h4>
              <ul className="space-y-1.5 text-[13.5px] text-ink-2">
                {stage.mistakes.map((m) => <li key={m}>· {m}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-[13px] font-semibold text-ink">推荐文章</h4>
              <div className="flex flex-col gap-1.5">
                {stage.articles.map((slug) => (
                  <Link key={slug} href={`/articles/${slug}`} className="group inline-flex items-start justify-between gap-3 rounded-[9px] border border-line bg-surface px-3 py-2 text-[13.5px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink">
                    <span>{articleTitles[slug] ?? slug}</span>
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ink"><Wrench className="h-4 w-4 text-gold" aria-hidden />实用工具</h4>
              <div className="flex flex-wrap gap-2">
                {stage.tools.map((slug) => (
                  <Link key={slug} href={`/tools/${slug}`} className="chip text-[12.5px]">{toolTitles[slug] ?? slug} <ArrowRight className="h-3 w-3" aria-hidden /></Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
