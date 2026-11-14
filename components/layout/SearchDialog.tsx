'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock3, Search, X } from 'lucide-react';
import { clearRecentSearches, getRecentSearches, pushRecentSearch } from '@/lib/client-store';
import { problems } from '@/lib/data';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    setRecent(getRecentSearches());
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  function go(q: string) {
    const value = q.trim();
    if (!value) return;
    pushRecentSearch(value);
    setQuery('');
    onClose();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] md:pt-[14vh]" role="dialog" aria-modal="true" aria-label="全站搜索">
      <button type="button" className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-label="关闭搜索" />
      <div className="relative w-full max-w-[640px] animate-fade-up overflow-hidden rounded-xl border border-line bg-surface shadow-lift">
        <form
          onSubmit={(e) => { e.preventDefault(); go(query); }}
          className="flex items-center gap-3 border-b border-line px-5 py-4"
        >
          <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、书籍、工具、品牌案例…"
            className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70"
            aria-label="搜索关键词"
          />
          <button type="button" onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-ink" aria-label="关闭">
            <X className="h-4.5 w-4.5" aria-hidden />
          </button>
        </form>

        <div className="max-h-[58vh] overflow-y-auto px-5 py-5">
          {recent.length > 0 && (
            <section className="mb-6">
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">最近搜索</h3>
                <button type="button" onClick={() => { clearRecentSearches(); setRecent([]); }} className="text-[11.5px] text-muted hover:text-accent">清空</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((q) => (
                  <button key={q} type="button" onClick={() => go(q)} className="chip text-[12.5px]">
                    <Clock3 className="h-3 w-3" aria-hidden />{q}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">大家都在问</h3>
            <ul className="space-y-0.5">
              {problems.slice(0, 5).map((p) => (
                <li key={p.question}>
                  <button
                    type="button"
                    onClick={() => go(p.query)}
                    className="flex w-full items-center justify-between gap-3 rounded-[9px] px-3 py-2.5 text-left text-[14px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <span>{p.question}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-[12px] text-muted">
            <Link href="/search" onClick={onClose} className="hover:text-accent">进入完整搜索 →</Link>
            <Link href="/articles" onClick={onClose} className="hover:text-accent">全部文章</Link>
            <Link href="/tools" onClick={onClose} className="hover:text-accent">工具箱</Link>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line bg-surface-2/60 px-5 py-2.5 text-[11px] text-muted">
          <span>Enter 搜索 · Esc 关闭</span>
          <span>快捷键 / 或 ⌘K</span>
        </div>
      </div>
    </div>
  );
}
