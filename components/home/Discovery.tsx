import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Bike, BookOpen, Building2, CircleAlert,
  ExternalLink, Scale, Tag, TrendingUp, Utensils, Wrench,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { books, pitfalls, problems, tools, websites } from '@/lib/data';

const TOOL_ICONS: Record<string, typeof TrendingUp> = {
  'trending-up': TrendingUp, tag: Tag, scale: Scale, building: Building2, utensils: Utensils, bike: Bike,
};

const BOOK_TONES: Record<string, string> = {
  accent: 'bg-accent-soft',
  olive: 'bg-olive-soft',
  gold: 'bg-gold-soft',
};

export function ProblemFinder() {
  return (
    <section className="section-space">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-xl border border-line bg-ink px-6 py-10 text-paper md:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-[320px] w-[320px] rounded-full border-[42px] border-white/5" aria-hidden />
          <div className="relative">
            <p className="eyebrow mb-3 !text-paper/55"><span className="eyebrow-dot !bg-accent" />Start With A Question</p>
            <h2 className="max-w-[720px] text-[clamp(26px,3.4vw,38px)] font-semibold leading-tight tracking-[-0.03em]">
              你现在最想解决什么经营问题？
            </h2>
            <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-paper/65">不用先学一套理论。挑一个正在烦你的问题，我们从那里开始。</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((p) => (
                <Link
                  key={p.question}
                  href={`/search?q=${encodeURIComponent(p.query)}`}
                  className="group flex items-start justify-between gap-3 rounded-[10px] border border-white/12 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-[2px] hover:border-accent/60 hover:bg-white/[0.08]"
                >
                  <div>
                    <span className="text-[11px] font-medium text-[#E7A184]">{p.category}</span>
                    <p className="mt-1.5 text-[14.5px] leading-snug text-paper">{p.question}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-paper/40 transition-all group-hover:text-[#E7A184]" aria-hidden />
                </Link>
              ))}
            </div>
            <Link href="/search" className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#E7A184] hover:underline">
              或者自己搜一个问题 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PitfallTeaser() {
  return (
    <section className="section-space border-y border-line bg-paper-soft/40">
      <div className="wrap">
        <SectionHeading
          eyebrow="老板，这个坑你最好别踩 / Pitfalls"
          title="有些学费，别人替你交过了"
          description="选址、装修、采购、合伙、人员、菜单、营销、财务、加盟、扩张、用工、口碑——十二个主题，每个都写明坑在哪、损失怎么算、正确做法是什么。"
          href="/pitfalls"
          linkLabel="看全部 12 类坑"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {pitfalls.slice(0, 5).map((p, i) => (
            <Link key={p.id} href={`/pitfalls#${p.id}`} className="card-interactive group flex flex-col p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="num text-[11px] font-semibold text-accent">PITFALL {String(i + 1).padStart(2, '0')}</span>
                <CircleAlert className="h-4 w-4 text-line-strong transition-colors group-hover:text-accent" aria-hidden />
              </div>
              <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-1.5 text-[12px] text-muted">{p.subtitle}</p>
              <p className="mt-auto pt-5 text-[12.5px] leading-relaxed text-ink-2">「{p.oneLiner}」</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToolTeaser() {
  return (
    <section className="section-space">
      <div className="wrap">
        <SectionHeading
          eyebrow="实用工具箱 / Working Tools"
          title="六个计算器，都能真算"
          description="输入自己的数字，立刻看结果；每条公式和口径都写在页面上，算错了你能自己查出来。"
          href="/tools"
          linkLabel="打开工具箱"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const Icon = TOOL_ICONS[t.icon] ?? Wrench;
            return (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card-interactive group flex flex-col p-5 md:p-6">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-accent-soft text-accent-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-line-strong transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                </div>
                <h3 className="mt-5 text-[17.5px] font-semibold tracking-[-0.02em]">{t.name}</h3>
                <p className="mt-1.5 text-[13px] text-accent-ink">{t.short}</p>
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted">{t.description}</p>
                <p className="mt-auto pt-4 text-[11.5px] text-muted">输出 {t.outputs.length} 项结果 · 公式公开</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ResourceTeaser() {
  return (
    <section className="section-space border-y border-line bg-paper-soft/40">
      <div className="wrap">
        <SectionHeading
          eyebrow="书籍与资源 / The Library"
          title="别只听我们说，去看原始资料"
          description="书籍只做原创笔记与观点摘要；行业网站、协会与上市公司披露都给了真实链接，并标注核验状态。"
          href="/resources"
          linkLabel="进入资源库"
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-3">
            {books.slice(0, 3).map((b, i) => (
              <Link key={b.slug} href={`/books/${b.slug}`} className="card-interactive group flex flex-col overflow-hidden">
                <div className={`relative h-32 ${BOOK_TONES[b.coverTone] ?? BOOK_TONES.accent}`} aria-hidden>
                  <span className="absolute bottom-3 left-4 font-serif text-[46px] font-bold leading-none text-ink/10">{i + 1}</span>
                  <span className="absolute right-3 top-3 rounded-full border border-line bg-surface/80 px-2 py-0.5 text-[10.5px] text-ink-2">{b.region}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[15px] font-semibold leading-snug group-hover:text-accent-ink">{b.title}</h3>
                  <p className="mt-1 text-[12px] text-muted">{b.author}</p>
                  <p className="mt-2.5 line-clamp-2 text-[12px] leading-relaxed text-ink-2">{b.summary}</p>
                  <span className="mt-auto pt-3 text-[11.5px] text-accent-ink">推荐指数 {'★'.repeat(b.rating)}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="card p-5 md:p-6">
            <h3 className="flex items-center gap-2 text-[16px] font-semibold"><BookOpen className="h-4 w-4 text-olive" aria-hidden />行业网站导航</h3>
            <p className="mt-1.5 text-[12.5px] text-muted">国内 + 国外，按类别整理，链接状态会定期复核。</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {websites.slice(0, 6).map((w) => (
                <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-2 rounded-[9px] border border-line px-3 py-2.5 text-[13px] text-ink-2 transition-colors hover:border-accent/40 hover:text-accent-ink">
                  <span className="truncate">{w.name}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted" aria-hidden />
                </a>
              ))}
            </div>
            <Link href="/resources#websites" className="link-underline mt-5 text-[12.5px]">看全部 {websites.length} 个网站与资料来源 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingNote() {
  return (
    <section className="section-space">
      <div className="wrap text-center">
        <span className="quote-mark" aria-hidden>“</span>
        <blockquote className="mx-auto -mt-6 max-w-[760px] font-serif text-[clamp(22px,3vw,32px)] leading-[1.6] tracking-[-0.02em] text-ink">
          开店前觉得自己是老板，开店后发现自己是厨师、采购、保洁、客服和财务。
          <span className="mt-3 block text-[clamp(17px,2vw,21px)] text-accent-ink">所以更该把方法写下来，让店离了谁都能转。</span>
        </blockquote>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/guide" className="btn-primary">从开店路线图开始 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/tools" className="btn-secondary">先算一笔账</Link>
        </div>
      </div>
    </section>
  );
}
