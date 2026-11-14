'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AlignLeft, Check, Copy, Link2, Minus, Plus, Printer, X } from 'lucide-react';
import type { Heading } from '@/lib/content';
import { cn } from '@/lib/utils';
import { SiteArticleBody } from './SiteArticleBody';

const SCALES = [0.94, 1, 1.08, 1.16];

interface Props { title: string; body: string; headings: Heading[] }

export function SiteArticleReader({ title, body, headings }: Props) {
  const [scale, setScale] = useState(1);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const [tocOpen, setTocOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop - 150;
      const total = el.offsetHeight - window.innerHeight + 220;
      setProgress(Math.min(100, Math.max(0, total > 0 ? ((window.scrollY - start) / total) * 100 : 0)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveId(visible[0].target.id);
    }, { rootMargin: '-120px 0px -70% 0px', threshold: 0 });
    for (const h of headings) { const el = document.getElementById(h.id); if (el) observer.observe(el); }
    return () => observer.disconnect();
  }, [headings]);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(''), 2000);
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); showToast('链接已复制'); }
    catch { showToast('复制失败，请手动复制地址栏'); }
  }

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-transparent">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} role="progressbar" aria-label="阅读进度" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} />
      </div>

      <div className="wrap grid gap-9 py-9 md:py-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-2 no-print">
            <button type="button" onClick={() => setTocOpen(true)} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-ink-2 lg:hidden"><AlignLeft className="h-4 w-4" aria-hidden />目录</button>
            <div className="inline-flex items-center gap-1 rounded-[9px] border border-line bg-surface px-2 py-1">
              <Minus className="h-3.5 w-3.5 text-muted" aria-hidden />
              {SCALES.map((s) => (
                <button key={s} type="button" onClick={() => setScale(s)} aria-label={`字号 ${s}`} className={cn('rounded px-1.5 py-0.5 text-[11.5px]', scale === s ? 'bg-accent text-white' : 'text-muted hover:text-ink')}>{s === 1 ? 'A' : s < 1 ? 'A−' : 'A+'}</button>
              ))}
              <Plus className="h-3.5 w-3.5 text-muted" aria-hidden />
            </div>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-ink-2 hover:text-accent-ink"><Link2 className="h-3.5 w-3.5" aria-hidden />复制链接</button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-ink-2 hover:text-accent-ink"><Printer className="h-3.5 w-3.5" aria-hidden />打印 / 存 PDF</button>
          </div>

          <div ref={bodyRef} style={{ '--reader-size': `${16.5 * scale}px` } as CSSProperties}>
            <SiteArticleBody body={body} />
          </div>
        </div>

        <aside className="hidden lg:block" aria-label="本文目录">
          <div className="sticky top-[150px]">
            <p className="eyebrow mb-3"><span className="eyebrow-dot" />本文目录</p>
            <nav className="space-y-1 border-l border-line">
              {headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className={cn(
                  'block border-l-2 py-1 text-[12.3px] leading-snug transition-colors',
                  h.level === 3 ? 'pl-6 text-muted' : 'pl-3',
                  activeId === h.id ? 'border-accent font-medium text-accent-ink' : 'border-transparent text-ink-2 hover:text-ink',
                )}>{h.text}</a>
              ))}
            </nav>
            <p className="mt-5 rounded-[9px] bg-surface-2 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted">所有演示数据与模拟情景均已标注；请用自己现场记录的数字替换。</p>
          </div>
        </aside>
      </div>

      {tocOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden no-print" role="dialog" aria-modal="true" aria-label="文章目录">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setTocOpen(false)} aria-label="关闭目录" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t-[16px] bg-surface p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-[17px] font-semibold">{title}</h2><button type="button" onClick={() => setTocOpen(false)} aria-label="关闭"><X className="h-5 w-5" /></button></div>
            <nav className="space-y-1">
              {headings.map((h) => <a key={h.id} href={`#${h.id}`} onClick={() => setTocOpen(false)} className={cn('block rounded-md px-3 py-2 text-[13.5px]', h.level === 3 ? 'pl-6 text-muted' : 'text-ink-2')}>{h.text}</a>)}
            </nav>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-20 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] text-white shadow-soft md:bottom-8"><Check className="h-3.5 w-3.5" aria-hidden />{toast}<Copy className="sr-only" aria-hidden /></div>}
    </>
  );
}
