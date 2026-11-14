import { cn } from '@/lib/utils';

type Tone = 'accent' | 'olive' | 'gold';

const TONES: Record<Tone, { bg: string; shape: string; soft: string; ink: string }> = {
  accent: { bg: '#F7E5DC', shape: '#C04A2B', soft: '#E8BBA6', ink: '#8F371E' },
  olive: { bg: '#E5EFE6', shape: '#5F8468', soft: '#B7D0BC', ink: '#3E6249' },
  gold: { bg: '#F7EDD8', shape: '#C08C30', soft: '#E3C98F', ink: '#8A631F' },
};

interface ArticleCoverProps {
  tone?: Tone;
  index?: number;
  label?: string;
  className?: string;
  compact?: boolean;
}

/** 本站生成的抽象几何封面，不依赖外部图片，也不使用任何第三方品牌素材。 */
export function ArticleCover({ tone = 'accent', index = 1, label = '开店不求人', className, compact = false }: ArticleCoverProps) {
  const c = TONES[tone];
  const variant = index % 4;
  const num = String(index).padStart(2, '0');

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundColor: c.bg }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g opacity="0.28" stroke={c.ink} strokeWidth="0.7" fill="none">
          <path d="M0 60h400M0 120h400M0 180h400M100 0v240M200 0v240M300 0v240" />
        </g>
        {variant === 0 && (
          <>
            <circle cx="292" cy="126" r="96" fill={c.soft} opacity="0.75" />
            <circle cx="292" cy="126" r="62" fill="none" stroke={c.shape} strokeWidth="2" />
            <circle cx="292" cy="126" r="28" fill={c.shape} opacity="0.85" />
          </>
        )}
        {variant === 1 && (
          <>
            <path d="M210 240 Q300 60 400 130 L400 240 Z" fill={c.soft} opacity="0.8" />
            <path d="M250 240 Q320 110 400 175" fill="none" stroke={c.shape} strokeWidth="2.4" />
            <circle cx="310" cy="92" r="34" fill={c.shape} opacity="0.8" />
          </>
        )}
        {variant === 2 && (
          <>
            <rect x="238" y="40" width="122" height="122" rx="14" fill={c.soft} opacity="0.8" transform="rotate(12 299 101)" />
            <rect x="262" y="66" width="74" height="74" rx="8" fill="none" stroke={c.shape} strokeWidth="2" transform="rotate(12 299 103)" />
            <path d="M200 214h200" stroke={c.shape} strokeWidth="2.4" />
          </>
        )}
        {variant === 3 && (
          <>
            <path d="M212 196a88 88 0 0 1 176 0Z" fill={c.soft} opacity="0.85" />
            <path d="M236 196a64 64 0 0 1 128 0Z" fill="none" stroke={c.shape} strokeWidth="2.2" />
            <circle cx="300" cy="66" r="20" fill={c.shape} opacity="0.8" />
          </>
        )}
        <text x="24" y="196" fontSize="116" fontWeight="700" fill={c.ink} opacity="0.13" fontFamily="Georgia, serif" letterSpacing="-8">{num}</text>
      </svg>
      {!compact && (
        <>
          <span className="absolute left-5 top-4 rounded-full border border-white/70 bg-white/65 px-2.5 py-0.5 text-[10.5px] font-semibold tracking-[0.12em] text-ink-2 backdrop-blur-sm">
            {label}
          </span>
          <span className="absolute bottom-4 left-5 text-[11px] font-medium tracking-[0.16em]" style={{ color: c.ink }}>
            RESTAURANT PLAYBOOK
          </span>
        </>
      )}
    </div>
  );
}
