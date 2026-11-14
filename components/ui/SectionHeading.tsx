import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow, title, description, href, linkLabel = '查看全部', align = 'left', className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 md:mb-10', align === 'center' && 'text-center', className)}>
      {eyebrow && <p className="eyebrow mb-3"><span className="eyebrow-dot" />{eyebrow}</p>}
      <div className={cn('flex flex-wrap items-end justify-between gap-4', align === 'center' && 'justify-center')}>
        <h2 className="section-title max-w-[760px]">{title}</h2>
        {href && (
          <Link href={href} className="link-underline shrink-0 text-[14px]">
            {linkLabel}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>
      {description && <p className={cn('section-lede', align === 'center' && 'mx-auto')}>{description}</p>}
    </div>
  );
}
