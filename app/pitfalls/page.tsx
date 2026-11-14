import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleAlert, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { pitfalls } from '@/lib/data';

export const metadata: Metadata = {
  title: '老板，这个坑你最好别踩 · 12 类经营避坑指南',
  description: '选址、装修、采购、合伙、人员、菜单、营销、财务、加盟、扩张、用工、口碑：每类坑都写清坑在哪、为什么容易犯、模拟情景、损失估算与正确做法。',
};

export default function PitfallsPage() {
  return (
    <>
      <PageHeader
        eyebrow="避坑指南 / Pitfalls"
        title="老板，这个坑你最好别踩"
        description="有些学费，别人替你交过了。十二类最常见的经营坑，每篇都写清坑在哪、老板为什么容易犯、可能造成什么损失、正确怎么处理，以及一句能记住的总结。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-accent">{pitfalls.length}</p>
            <p className="mt-1.5 text-[12.5px] text-muted">类坑 · 全部标注模拟情景</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <div className="card mb-10 p-5 md:p-6">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">按主题跳到</p>
            <div className="flex flex-wrap gap-2">
              {pitfalls.map((p, i) => (
                <a key={p.id} href={`#${p.id}`} className="chip">
                  <span className="num text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>{p.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {pitfalls.map((p, i) => (
              <article key={p.id} id={p.id} className="card scroll-mt-24 overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface-2/50 px-5 py-5 md:px-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="num text-[11px] font-semibold tracking-[0.14em] text-accent">PITFALL {String(i + 1).padStart(2, '0')}</span>
                      <span className="badge badge-gold">{p.scenarioType}</span>
                    </div>
                    <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] md:text-[29px]">{p.title}</h2>
                    <p className="mt-1.5 text-[15px] text-muted">{p.subtitle}</p>
                  </div>
                  <CircleAlert className="h-6 w-6 shrink-0 text-accent/50" aria-hidden />
                </div>

                <div className="grid gap-7 p-5 md:grid-cols-2 md:p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">坑在哪里</h3>
                      <p className="mt-2 text-[14.5px] leading-[1.9] text-ink-2">{p.where}</p>
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">老板为什么容易犯</h3>
                      <p className="mt-2 text-[14.5px] leading-[1.9] text-ink-2">{p.why}</p>
                    </div>
                    <div className="rounded-[10px] border border-accent/20 bg-accent-soft/35 p-4">
                      <h3 className="text-[13px] font-semibold text-accent-ink">{p.scenarioType} · 可能造成的损失</h3>
                      <p className="mt-2 text-[13.5px] leading-[1.85] text-ink-2">{p.scenario}</p>
                      <p className="mt-3 border-t border-accent/20 pt-3 text-[13px] leading-relaxed text-ink-2"><strong>损失估算：</strong>{p.loss}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[10px] border border-olive/25 bg-olive-soft/35 p-4">
                      <h3 className="flex items-center gap-2 text-[14px] font-semibold text-olive"><ShieldCheck className="h-4 w-4" aria-hidden />正确处理方法</h3>
                      <ol className="mt-3 space-y-2.5">
                        {p.fix.map((f, j) => (
                          <li key={f} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
                            <span className="num mt-0.5 shrink-0 text-[11px] font-semibold text-olive">{String(j + 1).padStart(2, '0')}</span>{f}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <blockquote className="border-l-[3px] border-accent pl-4">
                      <p className="font-serif text-[18px] leading-relaxed text-ink">「{p.oneLiner}」</p>
                      <footer className="mt-2 text-[12px] text-muted">老板一句话总结</footer>
                    </blockquote>

                    {p.relatedArticle && (
                      <Link href={`/articles/${p.relatedArticle}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-ink hover:underline">
                        读相关实战文章 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-line bg-surface p-5 text-[12.5px] leading-relaxed text-muted md:p-6">
            本页情景均为<strong className="text-ink-2">模拟情景</strong>，损失估算为公式演示，不是真实案例、行业统计或任何门店的经营结果。涉及加盟、合伙、用工、食品安全与财税的具体事项，请咨询本地专业人士并以所在地现行法规为准。
          </div>
        </div>
      </section>
    </>
  );
}
