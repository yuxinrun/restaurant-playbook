'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AlignLeft, Check, Copy, Link2, Minus, Plus, Share2, X } from 'lucide-react';
import type { Article } from '@/lib/types';
import type { Heading } from '@/lib/content';
import { getFontScale, setFontScale } from '@/lib/client-store';
import { cn } from '@/lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { MarkdownBody } from './MarkdownBody';

interface ArticleReaderProps {
  article: Article;
  headings: Heading[];
}

const SCALES = [0.94, 1, 1.08, 1.16];

export function ArticleReader({ article, headings }: ArticleReaderProps) {
  const [scale, setScale] = useState(1);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const [tocOpen, setTocOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => { setScale(getFontScale()); }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop - 140;
      const total = el.offsetHeight - window.innerHeight + 220;
      const value = total > 0 ? ((window.scrollY - start) / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, value)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-110px 0px -72% 0px', threshold: 0 },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings, article.slug]);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2000);
  }

  async function copyLink() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制');
    } catch {
      const input = document.createElement('textarea');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('链接已复制');
    }
  }

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.summary, url });
        return;
      } catch {
        // 用户取消系统分享，不做任何提示
        return;
      }
    }
    await copyLink();
  }

  function changeScale(delta: number) {
    const next = Math.min(SCALES.length - 1, Math.max(0, SCALES.findIndex((s) => s === scale) + delta));
    const value = SCALES[next] ?? 1;
    setScale(value);
    setFontScale(value);
  }

  const toc = (
    <nav aria-label="文章目录">
      <p className="mb-3 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">
        <AlignLeft className="h-3.5 w-3.5" aria-hidden />本文目录
      </p>
      <ul className="space-y-0.5 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={() => setTocOpen(false)}
              className={cn(
                'block border-l-2 py-1.5 text-[12.5px] leading-snug transition-colors',
                h.level === 3 ? 'pl-6' : 'pl-3',
                activeId === h.id
                  ? '-ml-px border-accent font-medium text-accent-ink'
                  : '-ml-px border-transparent text-muted hover:text-ink',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent" aria-hidden>
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="wrap py-8 md:py-12">
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="mr-1 hidden text-[12px] text-muted sm:inline">正文字号</span>
              <button type="button" onClick={() => changeScale(-1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-line text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink" aria-label="缩小字号" disabled={scale === SCALES[0]}>
                <Minus className="h-3.5 w-3.5" aria-hidden />
              </button>
              <span className="num w-10 text-center text-[12.5px] text-muted">{Math.round(scale * 100)}%</span>
              <button type="button" onClick={() => changeScale(1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-line text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink" aria-label="放大字号" disabled={scale === SCALES[SCALES.length - 1]}>
                <Plus className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton slug={article.slug} title={article.title} variant="full" />
              <button type="button" onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink">
                <Copy className="h-3.5 w-3.5" aria-hidden /><span className="hidden sm:inline">复制链接</span>
              </button>
              <button type="button" onClick={share} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink">
                <Share2 className="h-3.5 w-3.5" aria-hidden /><span className="hidden sm:inline">分享</span>
              </button>
              <button type="button" onClick={() => setTocOpen((v) => !v)} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line px-3 py-2 text-[12.5px] text-ink-2 lg:hidden" aria-expanded={tocOpen}>
                {tocOpen ? <X className="h-3.5 w-3.5" aria-hidden /> : <AlignLeft className="h-3.5 w-3.5" aria-hidden />}目录
              </button>
            </div>
          </div>

          {tocOpen && <div className="mb-6 rounded-lg border border-line bg-surface p-4 lg:hidden">{toc}</div>}

          <div className="grid gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">{toc}</div>
            </aside>
            <div ref={bodyRef}>
              <div style={{ '--reader-size': `${16.5 * scale}px` } as CSSProperties}>
                <MarkdownBody body={article.body} />
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface-2/50 px-5 py-4">
                <div>
                  <p className="text-[13px] font-semibold text-ink">这篇文章算完了，然后呢？</p>
                  <p className="mt-1 text-[12.5px] text-muted">挑一条明天能做的，写进你的周复盘表。</p>
                </div>
                <div className="flex items-center gap-2">
                  <FavoriteButton slug={article.slug} title={article.title} variant="full" />
                  <button type="button" onClick={copyLink} className="btn-secondary text-[12.5px]"><Link2 className="h-3.5 w-3.5" aria-hidden />复制链接</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-8 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper shadow-lift">
          <Check className="h-4 w-4 text-olive-soft" aria-hidden />{toast}
        </div>
      )}
    </>
  );
}
