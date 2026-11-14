'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, Trash2 } from 'lucide-react';
import type { ArticleMeta } from '@/lib/types';
import { FAVORITES_EVENT, getFavorites } from '@/lib/client-store';
import { ArticleCard } from '@/components/ui/ArticleCard';

export function FavoritesClient({ articles }: { articles: ArticleMeta[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const sync = () => setIds(getFavorites());
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const saved = articles.filter((a) => ids.includes(a.slug));
  const suggestions = articles.filter((a) => !ids.includes(a.slug)).slice(0, 3);

  function clearAll() {
    if (!confirmClear) { setConfirmClear(true); return; }
    window.localStorage.removeItem('rp:favorites');
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    setIds([]);
    setConfirmClear(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-2/50 px-5 py-4">
        <p className="text-[13.5px] text-ink-2">
          已收藏 <strong className="num text-accent-ink">{saved.length}</strong> 篇文章。收藏保存在你自己的浏览器里，换设备不会同步——这是第一阶段的有意选择，不收集和上传任何个人信息。
        </p>
        {saved.length > 0 && (
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-muted transition-colors hover:border-accent/40 hover:text-accent-ink">
            <Trash2 className="h-3.5 w-3.5" aria-hidden />{confirmClear ? '再点一次确认清空' : '清空收藏'}
          </button>
        )}
      </div>

      {saved.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 1} />)}
        </div>
      ) : (
        <div className="card flex flex-col items-center py-16 text-center">
          <Bookmark className="h-8 w-8 text-line-strong" aria-hidden />
          <h2 className="mt-4 text-[19px] font-semibold">还没有收藏任何文章</h2>
          <p className="mt-2 max-w-[460px] text-[13.5px] leading-relaxed text-muted">在文章卡片或文章页点书签按钮，就会收进这里。适合存下「下次排班前要再看一遍」的那几篇。</p>
          <Link href="/articles" className="btn-primary mt-6">去挑几篇文章 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 border-b border-line pb-2 text-[16px] font-semibold">也许你会想收下这几篇</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 4} />)}
          </div>
        </section>
      )}
    </div>
  );
}
