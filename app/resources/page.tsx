import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink, Link2, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { books, linkCheck, sources, topics, websites } from '@/lib/data';
import type { Website } from '@/lib/types';

export const metadata: Metadata = {
  title: '书籍与资源 · 可查证的餐饮经营资料库',
  description: '国内外餐饮经营书籍原创读书笔记、20 个国内外行业网站导航、七大主题阅读路径与全站参考来源清单。',
};

const STATUS: Record<Website['linkStatus'], { label: string; cls: string }> = {
  verified: { label: '已核验', cls: 'badge-olive' },
  partial: { label: '自动访问受限', cls: 'badge-gold' },
  unverified: { label: '待人工确认', cls: 'badge' },
};

function statusOf(w: Website): Website['linkStatus'] {
  const checked = linkCheck.results[w.url];
  if (!checked) return w.linkStatus;
  const s = checked.status;
  if (typeof s === 'number' && s >= 200 && s < 400) return 'verified';
  if (s === 403 || s === 405 || s === 429) return 'partial';
  return 'unverified';
}

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="书籍与资源 / The Library"
        title="别只听我们说，去看原始资料"
        description="书籍只提供原创介绍与读书笔记；行业网站、协会与公开披露都给真实链接。不确定的书目不写、失效的链接会标记，不把搜索结果包装成事实。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-gold">{books.length}<span className="text-[16px] text-muted"> / {websites.length}</span></p>
            <p className="mt-1.5 text-[12.5px] text-muted">本书 / 个行业网站</p>
          </div>
        )}
      />

      <section className="section-space" id="books">
        <div className="wrap">
          <SectionHeading
            eyebrow="Books / 原创笔记"
            title="这些书，值得放在收银台旁边"
            description="每本都写清核心观点、适合什么阶段读、最值得借鉴的 3 个方法，以及适用条件。版权说明：本站只做介绍、原创笔记与短篇观点摘要，不转载原文、付费章节或未经授权的电子书。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => (
              <Link key={b.slug} href={`/books/${b.slug}`} className="card-interactive group flex overflow-hidden">
                <div className={`relative hidden w-20 shrink-0 sm:block ${b.coverTone === 'accent' ? 'bg-accent-soft' : b.coverTone === 'olive' ? 'bg-olive-soft' : 'bg-gold-soft'}`} aria-hidden>
                  <span className="absolute bottom-3 left-3 font-serif text-[38px] font-bold leading-none text-ink/10">{String(i + 1).padStart(2, '0')}</span>
                  <span className="absolute left-0 top-0 h-full w-1 bg-ink/10" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge">{b.region} · {b.year}</span>
                    <span className="text-[12px] text-gold">{'★'.repeat(b.rating)}</span>
                  </div>
                  <h3 className="mt-3 text-[16.5px] font-semibold leading-snug tracking-[-0.02em] group-hover:text-accent-ink">{b.title}</h3>
                  <p className="mt-1 text-[12px] text-muted">{b.author} · {b.publisher}</p>
                  <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted">{b.summary}</p>
                  <p className="mt-auto pt-4 text-[11.5px] text-accent-ink">适合：{b.stage}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40" id="websites">
        <div className="wrap">
          <SectionHeading
            eyebrow="Website Directory / 国内 + 国外"
            title="一个不装链接的收藏夹，没什么用"
            description="每条都写了类别、研究内容、推荐理由、适合谁读，以及链接核验状态。链接核验时间见页脚。"
          />
          <div className="grid gap-3 md:grid-cols-2">
            {websites.map((w) => {
              const status = statusOf(w);
              return (
                <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer" className="card-interactive group flex flex-col p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge">{w.region}</span>
                      <span className="badge badge-gold">{w.kind}</span>
                      <span className={`badge ${STATUS[status].cls}`}>{STATUS[status].label}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-line-strong transition-colors group-hover:text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-[17px] font-semibold group-hover:text-accent-ink">{w.name}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{w.focus}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{w.reason}</p>
                  <p className="mt-auto pt-4 text-[11.5px] text-muted">适合：{w.audience}</p>
                  {(w.statusNote || status !== 'verified') && (
                    <p className="mt-2 rounded-[8px] bg-surface-2/70 px-2.5 py-1.5 text-[11px] leading-snug text-muted">
                      {status === 'unverified' ? '本机自动检测未能连通，请以浏览器实际访问为准。' : w.statusNote ?? '自动访问受限，浏览器通常可正常打开。'}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space" id="topics">
        <div className="wrap">
          <SectionHeading
            eyebrow="国内主题阅读路径 / Reading Paths"
            title="国内书目只收录能核实出版信息的条目"
            description="与其编一串看起来很像样的书名，不如先把七个主题下可查证的公开资料整理好。以下路径以协会、媒体、平台与公开书目为主，具体书目核实后再补充。"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <div key={t.id} className="card flex flex-col p-5 md:p-6">
                <span className="num text-[11px] font-semibold text-accent">PATH 0{i + 1}</span>
                <h3 className="mt-2 text-[17px] font-semibold">{t.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{t.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {t.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-2 hover:text-accent-ink">
                        <Link2 className="h-3 w-3" aria-hidden />{l.label}<ExternalLink className="h-2.5 w-2.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto border-t border-line pt-4 text-[12px] leading-relaxed text-muted">{t.reading}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-line bg-surface-2/30" id="sources">
        <div className="wrap">
          <SectionHeading eyebrow="Sources / 全站参考来源" title="我们把来源摊开给你查" description="优先级：专业书籍与经典理论 → 行业媒体与研究机构 → 品牌公开资料 → 一线经验 → 学术研究与公开统计。" />
          <div className="card divide-y divide-line">
            {sources.map((s) => (
              <div key={s.label} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div>
                  <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
                    {s.url ? <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden /> : <BookOpen className="h-3.5 w-3.5 text-muted" aria-hidden />}
                    {s.label}
                  </p>
                  {s.note && <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{s.note}</p>}
                </div>
                {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-accent-ink hover:underline">访问 →</a>}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 md:px-6" id="links">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-olive" aria-hidden />
              <div>
                <p className="text-[13.5px] font-semibold">链接核验机制</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  运行 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px]">npm run verify:links</code> 会遍历数据文件中的全部外链并写入 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px]">link-check.json</code>。
                  站点对自动访问返回 403 的会标「自动访问受限」，本机无法连通的标「待人工确认」，绝不把没验证过的地址写成「官方已确认」。
                  最近一次核验：{linkCheck.checkedAt}（{linkCheck.ok}/{linkCheck.total} 直接连通）。
                </p>
              </div>
            </div>
            <Link href="/about" className="btn-secondary shrink-0 text-[12.5px]">内容规范说明 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
