import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import type { ArticleMeta } from '@/lib/types';
import { categoryName } from '@/lib/data';
import { formatDate, cn } from '@/lib/utils';
import { ArticleCover } from './ArticleCover';
import { FavoriteButton } from '@/components/articles/FavoriteButton';

interface ArticleCardProps {
  article: ArticleMeta;
  variant?: 'default' | 'feature' | 'compact';
  index?: number;
  className?: string;
  showCover?: boolean;
}

const toneIndex = (category: string) => ({ start: 1, product: 2, operations: 3, marketing: 4, finance: 5, cases: 6 })[category] ?? 1;

export function ArticleCard({ article, variant = 'default', index, className, showCover = true }: ArticleCardProps) {
  const coverIndex = index ?? toneIndex(article.category);
  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';

  return (
    <article className={cn(
      'card-interactive group relative flex overflow-hidden',
      isFeature ? 'flex-col md:flex-row' : 'flex-col',
      className,
    )}>
      {showCover && (
        <Link
          href={`/articles/${article.slug}`}
          className={cn('relative block shrink-0 overflow-hidden', isFeature ? 'h-52 md:h-auto md:w-[42%]' : isCompact ? 'h-32' : 'h-44')}
          tabIndex={-1}
          aria-hidden="true"
        >
          <ArticleCover
            tone={article.coverTone}
            index={coverIndex}
            compact={isCompact}
            className="h-full w-full transition-transform duration-500 ease-editorial group-hover:scale-[1.035]"
          />
        </Link>
      )}

      <div className={cn('flex min-w-0 flex-1 flex-col', isFeature ? 'p-6 md:p-8' : isCompact ? 'p-4' : 'p-5')}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="badge badge-accent">{categoryName(article.category)}</span>
          <FavoriteButton slug={article.slug} title={article.title} className="opacity-80 group-hover:opacity-100" />
        </div>

        <h3 className={cn(
          'font-semibold leading-[1.35] tracking-[-0.022em] text-ink transition-colors group-hover:text-accent-ink',
          isFeature ? 'text-[23px] md:text-[28px]' : isCompact ? 'text-[15px]' : 'text-[17.5px]',
        )}>
          <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {article.title}
          </Link>
        </h3>

        {!isCompact && (
          <p className={cn('mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted', isFeature && 'md:text-[14.5px] md:line-clamp-3')}>
            {article.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11.5px] text-muted">
          <span className="flex items-center gap-3">
            <span>{formatDate(article.updatedAt)}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" aria-hidden />{article.readingMinutes} 分钟</span>
          </span>
          <ArrowUpRight className="h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </div>
      </div>
    </article>
  );
}
