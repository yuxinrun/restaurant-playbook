'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { FAVORITES_EVENT, isFavorite, toggleFavorite } from '@/lib/client-store';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  slug: string;
  title: string;
  variant?: 'icon' | 'full';
  className?: string;
}

export function FavoriteButton({ slug, title, variant = 'icon', className }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const sync = () => setActive(isFavorite(slug));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [slug]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const next = toggleFavorite(slug);
    setActive(next);
    setToast(next ? '已加入收藏' : '已取消收藏');
    window.setTimeout(() => setToast(''), 1600);
  }

  return (
    <span className={cn('relative z-10 inline-flex', className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={`${active ? '取消收藏' : '收藏'}《${title}》`}
        title={active ? '取消收藏' : '收藏文章'}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-[9px] border transition-all duration-200',
          variant === 'icon' ? 'h-8 w-8' : 'px-3.5 py-2 text-[13px] font-medium',
          active
            ? 'border-accent/40 bg-accent-soft text-accent-ink'
            : 'border-line bg-surface text-muted hover:border-accent/40 hover:text-accent-ink',
        )}
      >
        <Bookmark className={cn('h-4 w-4', active && 'fill-current')} aria-hidden />
        {variant === 'full' && <span>{active ? '已收藏' : '收藏'}</span>}
      </button>
      {toast && (
        <span role="status" className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-[11px] text-paper shadow-soft">
          {toast}
        </span>
      )}
    </span>
  );
}
