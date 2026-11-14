'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';
import type { ArticleMeta, CategoryId } from '@/lib/types';
import { categories } from '@/lib/data';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { cn } from '@/lib/utils';

interface ArticleBrowserProps {
  articles: ArticleMeta[];
}

function validCategory(value: string | null): CategoryId | 'all' {
  return categories.some((c) => c.id === value) ? (value as CategoryId) : 'all';
}

/** 只把查询参数读取放进 Suspense：静态导出时不影响文章列表正文的预渲染。 */
function CategoryFromUrl({ onChange }: { onChange: (value: string | null) => void }) {
  const value = useSearchParams().get('category');
  useEffect(() => { onChange(value); }, [value, onChange]);
  return null;
}

export function ArticleBrowser({ articles }: ArticleBrowserProps) {
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<'newest' | 'shortest'>('newest');
  const applyCategory = useCallback((value: string | null) => setCategory(validCategory(value)), []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16);
  }, [articles]);

  const filtered = useMemo(() => {
    const list = articles
      .filter((a) => category === 'all' || a.category === category)
      .filter((a) => tag === 'all' || a.tags.includes(tag));
    return list.sort((a, b) => sort === 'shortest'
      ? a.readingMinutes - b.readingMinutes
      : b.updatedAt.localeCompare(a.updatedAt));
  }, [articles, category, tag, sort]);

  const clear = () => { setCategory('all'); setTag('all'); };

  return (
    <>
      <Suspense fallback={null}><CategoryFromUrl onChange={applyCategory} /></Suspense>
      <div>
        <div className="card mb-6 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setCategory('all')} className={cn('chip', category === 'all' && 'chip-active')}>全部频道</button>
            {categories.map((c) => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)} className={cn('chip', category === c.id && 'chip-active')}>{c.name}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <span className="mr-1 text-[12px] text-muted">热门标签</span>
            <button type="button" onClick={() => setTag('all')} className={cn('chip !py-1 text-[12px]', tag === 'all' && 'chip-active')}>不限</button>
            {tags.map(([t, n]) => (
              <button key={t} type="button" onClick={() => setTag(t)} className={cn('chip !py-1 text-[12px]', tag === t && 'chip-active')}>{t} <span className="opacity-60">{n}</span></button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[12.5px] text-muted">
            <span>共 <strong className="num text-ink">{filtered.length}</strong> 篇文章</span>
            <div className="flex items-center gap-2">
              <span>排序</span>
              <button type="button" onClick={() => setSort('newest')} className={cn('rounded-md px-2 py-1', sort === 'newest' ? 'bg-surface-2 font-medium text-ink' : 'hover:text-ink')}>最近更新</button>
              <button type="button" onClick={() => setSort('shortest')} className={cn('rounded-md px-2 py-1', sort === 'shortest' ? 'bg-surface-2 font-medium text-ink' : 'hover:text-ink')}>阅读时长</button>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 1} />)}
          </div>
        ) : (
          <div className="card flex flex-col items-center py-16 text-center">
            <SearchX className="h-8 w-8 text-line-strong" aria-hidden />
            <h3 className="mt-4 text-[18px] font-semibold">这个组合下暂时没有文章</h3>
            <p className="mt-2 text-[13.5px] text-muted">换个频道或标签试试，内容库还在持续更新。</p>
            <button type="button" onClick={clear} className="btn-secondary mt-6">清空筛选</button>
          </div>
        )}
      </div>
    </>
  );
}
