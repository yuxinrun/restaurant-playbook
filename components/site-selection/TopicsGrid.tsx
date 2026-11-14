import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteTopics } from '@/lib/site-selection/data';
import { getSiteArticleMetas } from '@/lib/site-selection/content';

export function TopicsGrid() {
  const metas = getSiteArticleMetas();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {siteTopics.map((t) => {
        const count = metas.filter((a) => a.topic === t.id || t.articles.includes(a.slug)).length;
        return (
          <Link key={t.id} href={`/site-selection/guides?topic=${t.id}`} className="card-interactive group flex flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="num text-[12px] font-semibold text-accent">{String(t.order).padStart(2, '0')}</span>
              <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted">{count} 篇</span>
            </div>
            <h3 className="mt-3 text-[16.5px] font-semibold leading-snug tracking-[-0.02em] group-hover:text-accent-ink">{t.title}</h3>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-muted">{t.english}</p>
            <p className="mt-3 text-[12.8px] leading-relaxed text-ink-2">{t.summary}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {t.points.slice(0, 2).map((p) => <span key={p} className="badge">{p}</span>)}
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-accent-ink">看这个主题 <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden /></span>
          </Link>
        );
      })}
    </div>
  );
}
