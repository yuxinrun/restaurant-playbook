import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, aside, className }: PageHeaderProps) {
  return (
    <header className={cn('relative border-b border-line bg-paper-soft/40', className)}>
      <div className="wrap py-12 md:py-16">
        <p className="eyebrow mb-4"><span className="eyebrow-dot" />{eyebrow}</p>
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="max-w-[860px] text-[clamp(32px,4.6vw,54px)] font-semibold leading-[1.18] tracking-[-0.04em] text-ink">
              {title}
            </h1>
            <p className="mt-5 max-w-[720px] text-[16px] leading-relaxed text-ink-2 md:text-[17px]">{description}</p>
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
