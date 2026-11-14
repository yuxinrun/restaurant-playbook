'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, SearchX } from 'lucide-react';
import type { BrandCase } from '@/lib/types';
import { cn } from '@/lib/utils';

export function BrandGrid({ brands }: { brands: BrandCase[] }) {
  const [region, setRegion] = useState<'全部' | '国内' | '国外'>('全部');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => brands.filter((b) => {
    if (region !== '全部' && b.region !== region) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return [b.name, b.englishName ?? '', b.category, b.tagline, b.highlight, ...b.lessons].join(' ').toLowerCase().includes(q);
  }), [brands, region, query]);

  return (
    <div>
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {(['全部', '国内', '国外'] as const).map((r) => (
            <button key={r} type="button" onClick={() => setRegion(r)} className={cn('chip', region === r && 'chip-active')}>{r}</button>
          ))}
          <span className="ml-1 text-[12.5px] text-muted">共 {filtered.length} 个案例</span>
        </div>
        <label className="relative block w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜品牌 / 品类 / 方法"
            className="field-input !py-2 pl-9 text-[13px]"
            aria-label="筛选品牌案例"
          />
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Link key={b.slug} href={`/brands/${b.slug}`} className="card-interactive group flex flex-col p-5 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn('badge', b.region === '国内' ? 'badge-accent' : 'badge-olive')}>{b.region}</span>
                  <span className="badge">{b.category}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-line-strong transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.025em] group-hover:text-accent-ink">{b.name}</h3>
              {b.englishName && <p className="text-[11.5px] uppercase tracking-[0.1em] text-muted">{b.englishName}</p>}
              <p className="mt-3 text-[13.5px] font-medium leading-snug text-accent-ink">{b.tagline}</p>
              <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-muted">{b.highlight}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {b.lessons.map((l) => <span key={l} className="rounded-full border border-line bg-surface-2/60 px-2 py-0.5 text-[11px] text-ink-2">{l}</span>)}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center py-16 text-center">
          <SearchX className="h-8 w-8 text-line-strong" aria-hidden />
          <h3 className="mt-4 text-[18px] font-semibold">没找到这个品牌</h3>
          <p className="mt-2 text-[13.5px] text-muted">案例库持续补充，也可以试试品类或方法关键词。</p>
          <button type="button" onClick={() => { setRegion('全部'); setQuery(''); }} className="btn-secondary mt-6">清空筛选</button>
        </div>
      )}
    </div>
  );
}
