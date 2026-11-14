import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, Table2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GuidesBrowser } from '@/components/site-selection/GuidesBrowser';
import { PitfallPicks } from '@/components/site-selection/PitfallPicks';
import { TopicsGrid } from '@/components/site-selection/TopicsGrid';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteTopics } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '选址实战指南：16 主题 · 20 篇深度文章',
  description: '从品类策略、商圈调查、客流统计、营业额预测、租金谈判到合同与交接，按 16 个主题组织的选址实战指南。每篇都有表格、公式、清单、话术与配套工具。',
  alternates: { canonical: pageUrl('/site-selection/guides') },
};

export default function GuidesPage() {
  const articles = getSiteArticleMetas();
  return (
    <>
      <PageHeader
        eyebrow="KNOWLEDGE BASE / 16 TOPICS"
        title="实战指南：不是目录，是能照着做的表格"
        description="每篇文章按同一个结构写：先给结论，再给方法、公式、可复制的话术或检查表，最后列常见错误与通过标准。文中嵌入的图表与工具可以直接打开，把自己的数字填进去。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{articles.length} / {siteTopics.length}</p>
            <p className="mt-1 text-[13px] font-medium">篇文章 · 个主题</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">所有演示数据与模拟案例均已标注；结论需要用你现场记录的数字替换后才成立。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <GuidesBrowser articles={articles} />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Before You Trust The Landlord" title="七句最常见、也最容易信的话" description="先给结论，再给方法。每一条都连着一篇完整文章和一个能真算的工具。" href="/site-selection/fieldwork" linkLabel="看现场调查方法" />
          <PitfallPicks />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Browse By Topic" title="按主题进入知识库" description="主题与 16 步流程一一对应，点开可看到该主题的方法要点、文章与配套工具。" href="/site-selection/roadmap" linkLabel="打开完整路线图" />
          <TopicsGrid />
        </div>
      </section>

      <section className="section-space border-t border-line bg-ink text-white">
        <div className="wrap">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">How to use these guides</p>
          <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">读完之后，一定要落到一张自己填过的表上</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { icon: Table2, title: '表格与清单', body: '文中的表格可以直接抄进考察记录，检查表可勾选、写备注、导出 CSV。' },
              { icon: Calculator, title: '公式与工具', body: '每个计算都写明口径，配套工具实时更新结果并给出数据缺口，不给看似精准的结论。' },
              { icon: BookOpen, title: '阅读体验', body: '支持目录跳转、字号调整、复制链接与打印 / 另存 PDF，手机上也能带去现场看。' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-white/15 p-5">
                <Icon className="h-5 w-5 text-white/70" aria-hidden />
                <h3 className="mt-3 text-[16px] font-semibold">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/site-selection/tools" className="btn-primary">打开 8 个实战工具 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/site-selection/reports" className="rounded-[10px] border border-white/25 px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/10">生成评估报告</Link>
          </div>
        </div>
      </section>
    </>
  );
}
