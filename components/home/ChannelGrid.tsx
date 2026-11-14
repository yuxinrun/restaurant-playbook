import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/lib/data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

const TONE: Record<string, { badge: string; number: string; hover: string }> = {
  accent: { badge: 'badge-accent', number: 'text-accent/15', hover: 'group-hover:border-accent/40' },
  olive: { badge: 'badge-olive', number: 'text-olive/20', hover: 'group-hover:border-olive/50' },
  gold: { badge: 'badge-gold', number: 'text-gold/20', hover: 'group-hover:border-gold/50' },
};

export function ChannelGrid() {
  return (
    <section className="section-space border-y border-line bg-paper-soft/40">
      <div className="wrap">
        <SectionHeading
          eyebrow="核心知识频道 / The Sections"
          title="六个频道，把开店这件事拆开讲"
          description="按经营问题组织的知识地图。想清楚再开店，比签完合同再想清楚便宜得多。"
          href="/articles"
          linkLabel="浏览全部文章"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const tone = TONE[c.tone] ?? TONE.accent;
            return (
              <Link
                key={c.id}
                href={c.href}
                className={cn('card-interactive group relative flex min-h-[236px] flex-col overflow-hidden p-5 md:p-6', tone.hover)}
              >
                <span className={cn('num pointer-events-none absolute -right-2 -top-6 text-[110px] font-bold leading-none', tone.number)} aria-hidden>
                  {c.index}
                </span>
                <div className="relative">
                  <span className={cn('badge', tone.badge)}>{c.subtitle}</span>
                  <h3 className="mt-4 text-[21px] font-semibold tracking-[-0.025em] text-ink md:text-[23px]">{c.name}</h3>
                  <p className="mt-2.5 max-w-[330px] text-[13.5px] leading-relaxed text-muted">{c.description}</p>
                </div>
                <div className="relative mt-auto pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {c.topics.slice(0, 4).map((t) => <span key={t} className="rounded-full border border-line bg-surface-2/70 px-2 py-0.5 text-[11px] text-ink-2">{t}</span>)}
                    {c.topics.length > 4 && <span className="px-1 py-0.5 text-[11px] text-muted">+{c.topics.length - 4}</span>}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-ink">
                    进入频道 <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
