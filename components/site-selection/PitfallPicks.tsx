import Link from 'next/link';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { sitePitfalls } from '@/lib/site-selection/data';

export function PitfallPicks() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {sitePitfalls.map((p, i) => (
        <details key={p.id} className="card group px-5 py-4 open:border-accent/35" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15px] font-semibold leading-snug text-ink marker:hidden">
            <span className="flex gap-2.5"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />{p.question}</span>
            <span className="num shrink-0 text-[11px] font-normal text-muted">{String(i + 1).padStart(2, '0')}</span>
          </summary>
          <p className="mt-3 border-t border-line pt-3 text-[13.2px] leading-relaxed text-ink-2">{p.answer}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-medium">
            <Link href={`/site-selection/guides/${p.article}`} className="inline-flex items-center gap-1 text-accent-ink hover:underline">读完整方法 <ArrowRight className="h-3 w-3" aria-hidden /></Link>
            <Link href={`/site-selection/tools/${p.tool}`} className="text-olive hover:underline">打开配套工具</Link>
          </div>
        </details>
      ))}
    </div>
  );
}
