import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { ArticleCover } from '@/components/ui/ArticleCover';
import { siteTopics } from '@/lib/site-selection/data';
import type { SiteArticleMeta } from '@/lib/site-selection/types';
import { formatDate } from '@/lib/utils';

export function SiteArticleCard({ article, index = 1 }: { article: SiteArticleMeta; index?: number }) {
  const topic = siteTopics.find((t) => t.id === article.topic);
  return (
    <Link href={`/site-selection/guides/${article.slug}`} className="card-interactive group flex flex-col overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <ArticleCover tone={({ strategy: 'accent', tradeArea: 'olive', fieldwork: 'gold', rent: 'accent', negotiation: 'olive', lease: 'gold', decision: 'accent' } as Record<string, 'accent' | 'olive' | 'gold'>)[article.topic] ?? 'accent'} index={(index % 6) + 1} compact className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 rounded-md bg-paper/92 px-2 py-1 text-[10.5px] font-medium text-ink">{topic?.title ?? '选址实战'}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="num text-[11px] font-semibold text-accent">GUIDE {String(article.order).padStart(2, '0')}</span>
        <h3 className="mt-2 text-[16.5px] font-semibold leading-[1.4] tracking-[-0.02em] group-hover:text-accent-ink">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{article.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11.5px] text-muted">
          <span className="flex items-center gap-2"><span>{formatDate(article.updatedAt)}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" aria-hidden />{article.readingMinutes} 分钟</span></span>
          <ArrowUpRight className="h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
