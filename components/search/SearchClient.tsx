'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Clock3, ExternalLink, RotateCcw, Search, SearchX, X } from 'lucide-react';
import type { ContentType, SearchDoc } from '@/lib/types';
import { TYPE_LABELS, TYPE_ORDER, searchDocs, groupByType, type SearchFilters } from '@/lib/search';
import { categories, problems } from '@/lib/data';
import { clearRecentSearches, getRecentSearches, pushRecentSearch } from '@/lib/client-store';
import { cn, highlightMatch } from '@/lib/utils';
import { browserPath } from '@/lib/site';

interface SearchClientProps {
  docs: SearchDoc[];
}

const ALL_TYPES: Array<ContentType | 'all'> = ['all', ...TYPE_ORDER];

function queryUrl(q: string): string {
  const path = browserPath('/search');
  return q.trim() ? `${path}?q=${encodeURIComponent(q.trim())}` : path;
}

/** 查询参数只在这里读取：静态导出时搜索界面本身仍会完整预渲染。 */
function QueryFromUrl({ onChange }: { onChange: (value: string) => void }) {
  const value = useSearchParams().get('q') ?? '';
  useEffect(() => { onChange(value); }, [value, onChange]);
  return null;
}

export function SearchClient({ docs }: SearchClientProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all', category: 'all', tag: 'all' });
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const urlSynced = useRef(false);
  const applyQuery = useCallback((value: string) => setQuery(value), []);

  useEffect(() => { setRecent(getRecentSearches()); }, []);

  useEffect(() => {
    // 首次渲染保留 URL 上的查询词，等 QueryFromUrl 同步后再改写地址。
    if (!urlSynced.current) { urlSynced.current = true; return; }
    window.history.replaceState(null, '', queryUrl(query));
  }, [query]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of docs) for (const t of d.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([t]) => t);
  }, [docs]);

  const results = useMemo(() => searchDocs(docs, query, filters), [docs, query, filters]);
  const groups = useMemo(() => groupByType(results), [results]);
  const counts = useMemo(() => Object.fromEntries(TYPE_ORDER.map((t) => [t, results.filter((d) => d.type === t).length])) as Record<ContentType, number>, [results]);

  function search(q: string) {
    setQuery(q);
    pushRecentSearch(q);
    setRecent(getRecentSearches());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearFilters() {
    setFilters({ type: 'all', category: 'all', tag: 'all' });
  }

  return (
    <div>
      <Suspense fallback={null}><QueryFromUrl onChange={applyQuery} /></Suspense>
      <div className="card mb-6 p-4 md:p-6">
        <form onSubmit={(e) => { e.preventDefault(); search(query); }} className="flex items-center gap-3 border-b border-line pb-4">
          <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、书籍、网站、品牌、工具、标签…"
            className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70 md:text-[18px]"
            aria-label="全站搜索"
            autoFocus
          />
          {query && <button type="button" onClick={() => { setQuery(''); window.history.replaceState(null, '', queryUrl('')); }} className="rounded-md p-1 text-muted hover:bg-surface-2" aria-label="清空搜索词"><X className="h-4 w-4" aria-hidden /></button>}
          <button type="submit" className="btn-primary shrink-0 px-4 py-2 text-[13px]">搜索</button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] text-muted">内容类型</span>
          {ALL_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setFilters((f) => ({ ...f, type: t }))} className={cn('chip !py-1 text-[12px]', filters.type === t && 'chip-active')}>
              {t === 'all' ? '全部' : TYPE_LABELS[t]}
              {t !== 'all' && <span className="opacity-70">{counts[t] ?? 0}</span>}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="mr-1 text-[12px] text-muted">频道筛选</span>
          <button type="button" onClick={() => setFilters((f) => ({ ...f, category: 'all' }))} className={cn('chip !py-1 text-[12px]', filters.category === 'all' && 'chip-active')}>不限</button>
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => setFilters((f) => ({ ...f, category: c.id }))} className={cn('chip !py-1 text-[12px]', filters.category === c.id && 'chip-active')}>{c.name}</button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="mr-1 text-[12px] text-muted">标签筛选</span>
          <button type="button" onClick={() => setFilters((f) => ({ ...f, tag: 'all' }))} className={cn('chip !py-1 text-[12px]', filters.tag === 'all' && 'chip-active')}>不限</button>
          {tags.map((t) => (
            <button key={t} type="button" onClick={() => setFilters((f) => ({ ...f, tag: t }))} className={cn('chip !py-1 text-[12px]', filters.tag === t && 'chip-active')}># {t}</button>
          ))}
        </div>
      </div>

      {!query.trim() && (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="card p-5 md:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold"><Clock3 className="h-4 w-4 text-accent" aria-hidden />最近搜索</h2>
            {recent.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recent.map((q) => <button key={q} type="button" onClick={() => search(q)} className="chip text-[12.5px]">{q}</button>)}
                <button type="button" onClick={() => { clearRecentSearches(); setRecent([]); }} className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-accent"><RotateCcw className="h-3 w-3" aria-hidden />清空</button>
              </div>
            ) : <p className="text-[13px] text-muted">还没有搜索记录。记录只保存在你自己的浏览器里。</p>}
          </div>
          <div className="card p-5 md:p-6">
            <h2 className="mb-3 text-[15px] font-semibold">热门搜索 · 大家都在问</h2>
            <div className="flex flex-wrap gap-2">
              {problems.map((p) => (
                <button key={p.question} type="button" onClick={() => search(p.query)} className="chip text-[12.5px]">{p.question}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-muted">
        <p>
          {query.trim() ? <>关于「<strong className="text-ink">{query.trim()}</strong>」找到 <strong className="num text-accent-ink">{results.length}</strong> 条结果</> : <>全站共 <strong className="num text-accent-ink">{docs.length}</strong> 条可检索内容</>}
        </p>
        {(filters.type !== 'all' || filters.category !== 'all' || filters.tag !== 'all') && (
          <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-[12.5px] hover:text-accent"><RotateCcw className="h-3 w-3" aria-hidden />清空筛选</button>
        )}
      </div>

      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.type} aria-labelledby={`group-${group.type}`}>
              <h2 id={`group-${group.type}`} className="mb-3 border-b border-line pb-2 text-[14px] font-semibold text-ink">
                {TYPE_LABELS[group.type]} <span className="num ml-1 text-[12px] font-normal text-muted">{group.docs.length}</span>
              </h2>
              <div className="grid gap-2 md:grid-cols-2">
                {group.docs.map((doc) => {
                  const hit = highlightMatch(doc.title, query.trim().split(/\s+/)[0] ?? '');
                  const external = doc.url.startsWith('http');
                  const content = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-accent-ink">
                          {hit.hit ? <>{hit.before}<mark className="bg-accent-soft text-accent-ink">{hit.hit}</mark>{hit.after}</> : doc.title}
                        </h3>
                        {external ? <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden /> : <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-line-strong transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />}
                      </div>
                      <p className="mt-1 text-[12px] text-muted">{doc.subtitle}</p>
                      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink-2">{doc.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="badge badge-accent">{doc.badge}</span>
                        {doc.tags.slice(0, 2).map((t) => <span key={t} className="text-[11px] text-muted"># {t}</span>)}
                      </div>
                    </>
                  );
                  return external ? (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="card-interactive group block p-4 md:p-5">{content}</a>
                  ) : (
                    <Link key={doc.id} href={doc.url} onClick={() => pushRecentSearch(query)} className="card-interactive group block p-4 md:p-5">{content}</Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center py-16 text-center">
          <SearchX className="h-8 w-8 text-line-strong" aria-hidden />
          <h3 className="mt-4 text-[18px] font-semibold">没找到相关内容</h3>
          <p className="mt-2 max-w-[480px] text-[13.5px] leading-relaxed text-muted">换个更短的词试试（例如「选址」「毛利」「菜单」），或清空筛选条件。内容库在持续更新。</p>
          <button type="button" onClick={() => { setQuery(''); clearFilters(); }} className="btn-secondary mt-6">清空条件</button>
        </div>
      )}

      <div className="mt-10 rounded-lg border border-line bg-surface-2/50 px-5 py-4 text-[12.5px] leading-relaxed text-muted">
        搜索范围：文章、书籍、网站资源、品牌案例、经营工具、避坑指南与关键词标签。支持模糊匹配、分类与标签筛选；最近搜索保存在本地浏览器，不上传服务器。
        <button type="button" onClick={() => router.push('/articles')} className="ml-1 text-accent-ink hover:underline">也可以直接浏览全部文章 →</button>
      </div>
    </div>
  );
}
