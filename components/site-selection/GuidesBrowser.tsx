'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { SiteArticleCard } from './SiteArticleCard';
import { siteTopics, siteTools } from '@/lib/site-selection/data';
import type { SiteArticleMeta } from '@/lib/site-selection/types';
import { cn } from '@/lib/utils';

/**
 * URL 参数只在这个极小的子组件里读取：静态导出时 Suspense 仅让这一小块退化，
 * 文章列表与筛选器本身仍然会完整预渲染成 HTML。
 */
function TopicFromUrl({ onChange }: { onChange: (value: string) => void }) {
  const params = useSearchParams();
  const topic = params.get('topic') ?? 'all';
  useEffect(() => { onChange(topic); }, [topic, onChange]);
  return null;
}

export function GuidesBrowser({ articles }: { articles: SiteArticleMeta[] }) {
  const [topic, setTopic] = useState('all');
  const current = siteTopics.find((t) => t.id === topic);

  const countFor = (id: string) => {
    const def = siteTopics.find((t) => t.id === id);
    return articles.filter((a) => a.topic === id || def?.articles.includes(a.slug)).length;
  };
  const shown = topic === 'all'
    ? articles
    : articles.filter((a) => a.topic === topic || current?.articles.includes(a.slug));

  return (
    <>
      <Suspense fallback={null}><TopicFromUrl onChange={setTopic} /></Suspense>

      <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-2" aria-label="按主题筛选">
        <Link href="/site-selection/guides" className={cn('shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors', topic === 'all' ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-2 hover:border-accent/40')}>
          全部 <span className="num ml-1 opacity-70">{articles.length}</span>
        </Link>
        {siteTopics.map((t) => (
          <Link key={t.id} href={`/site-selection/guides?topic=${t.id}`} className={cn('shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors', topic === t.id ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-2 hover:border-accent/40')}>
            <span className="num mr-1.5 opacity-60">{String(t.order).padStart(2, '0')}</span>{t.title} <span className="num ml-1 opacity-70">{countFor(t.id)}</span>
          </Link>
        ))}
      </div>

      {current && (
        <div className="card mb-6 p-5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">TOPIC {String(current.order).padStart(2, '0')} · {current.english}</p>
          <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em]">{current.title}</h2>
          <p className="mt-2 max-w-[820px] text-[13.5px] leading-relaxed text-ink-2">{current.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {current.points.map((p) => <span key={p} className="badge">{p}</span>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-[12.5px]">
            <span className="mr-1 text-muted">配套工具：</span>
            {current.tools.map((slug) => {
              const tool = siteTools.find((t) => t.slug === slug);
              return <Link key={slug} href={`/site-selection/tools/${slug}`} className="chip inline-flex items-center gap-1">{tool?.name ?? slug}<ArrowRight className="h-3 w-3" aria-hidden /></Link>;
            })}
          </div>
        </div>
      )}

      <p className="mb-4 text-[12.5px] text-muted">显示 {shown.length} 篇 · 按 16 步流程顺序排列</p>
      {shown.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => <SiteArticleCard key={a.slug} article={a} index={i} />)}
        </div>
      ) : (
        <p className="card p-6 text-[13px] text-muted">这个主题的文章还在整理中。可先看 <Link href="/site-selection/roadmap" className="text-accent-ink hover:underline">16 步路线图</Link> 与上方配套工具。</p>
      )}
    </>
  );
}
