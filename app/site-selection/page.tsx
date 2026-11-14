import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileCheck2, MessageSquareText, Shapes } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Hero } from '@/components/site-selection/Hero';
import { Roadmap } from '@/components/site-selection/Roadmap';
import { QuickEvaluator } from '@/components/site-selection/QuickEvaluator';
import { TopicsGrid } from '@/components/site-selection/TopicsGrid';
import { PitfallPicks } from '@/components/site-selection/PitfallPicks';
import { ToolsGrid } from '@/components/site-selection/ToolsGrid';
import { SsChartCard } from '@/components/site-selection/SsChartCard';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteRoadmap, siteTools, negotiation, siteCaseData, siteTopics } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '餐饮选址实验室 · 从找铺到签约的实战系统',
  description: '选址选错了，后面每天都在交学费。16 步选址流程、20 篇深度文章、8 个可保存的实战工具与 12 类数据图表，帮你把位置研究明白再掏钱。',
  alternates: { canonical: pageUrl('/site-selection') },
};

export default function SiteSelectionHome() {
  const titles = Object.fromEntries(getSiteArticleMetas().map((a) => [a.slug, a.title]));
  return (
    <>
      <Hero />

      <section className="border-b border-line bg-surface/60">
        <div className="wrap grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['16', '步选址流程', '每步都有通过标准'],
            [String(getSiteArticleMetas().length), '篇深度文章', '表格、话术、案例、清单'],
            [String(siteTools.length), '个实战工具', '能算、能存、能导出'],
            ['12', '类数据图表', '用你自己的数据更新'],
          ].map(([n, label, hint]) => (
            <div key={label} className="flex items-baseline gap-3">
              <span className="num text-[30px] font-semibold text-accent">{n}</span>
              <span><span className="block text-[13.5px] font-medium text-ink">{label}</span><span className="block text-[11.5px] text-muted">{hint}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="The Workflow / 01–16" title="十六步，按顺序来，别跳步" description="从明确开店需求到签约交接，每步都写清目标、任务、操作方法、所需数据、工具、常见错误、通过标准与下一步。进度存在你自己的浏览器里。" href="/site-selection/roadmap" linkLabel="打开完整路线图" />
          <Roadmap articleTitles={titles} />
        </div>
      </section>

      <section id="quick-evaluate" className="section-space scroll-mt-36 border-y border-line bg-paper-soft/45">
        <div className="wrap">
          <SectionHeading eyebrow="One Shop, Do The Math First" title="一个铺位，先算再爱" description="你可以喜欢这个铺位，但不要让它知道你已经爱上它。先把已知数字填进来，看看还缺什么，再决定要不要花六轮时间去调查。" />
          <QuickEvaluator />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Before You Trust The Landlord" title="选址避坑精选" description="七句老板最常听到、也最容易信的话。先给结论，再给方法，别等签完合同才想起来验证。" href="/site-selection/guides" linkLabel="看全部实战指南" />
          <PitfallPicks />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/35">
        <div className="wrap">
          <SectionHeading eyebrow="16 Topics / Knowledge Base" title="选址这件事，拆成 16 个主题" description="从品类策略、商圈调查到合同与交接，每个主题都有可执行的表格、检查表与文章，不是一堆目录标题。" href="/site-selection/guides" linkLabel="进入知识库" />
          <TopicsGrid />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Working Tools" title="工具不是展示品，是真的要能算" description="八个工具都能输入自己的数字、实时更新结果、保存到本机并导出。现场用手机，回店里用电脑。" href="/site-selection/tools" linkLabel={`打开全部 ${siteTools.length} 个工具`} />
          <ToolsGrid compact />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/35">
        <div className="wrap">
          <SectionHeading eyebrow="Data, But Useful" title="每张图都要回答一个选址问题" description="工具里的图表由你输入的数据驱动；下面三张为演示数据，用于说明口径与读图方式，不是任何真实商圈统计。" href="/site-selection/charts" linkLabel="看全部 12 类图表" />
          <div className="grid gap-4 lg:grid-cols-3">
            <SsChartCard id="traffic-times" height={250} />
            <SsChartCard id="score-radar" height={250} />
            <SsChartCard id="lease-trend" height={250} />
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Negotiation, Cases & Lease" title="把最难开口的部分，写成能复制的话" description="谈判不是靠气势，是靠同街租金、自己的退出价与备选铺位。案例库说明哪些能学、哪些不能照搬。" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: MessageSquareText, title: '房东谈判话术库', desc: `${negotiation.stages.length} 个阶段 × 3 种风格，${negotiation.scenarios.length} 个完整场景拆解，话术一键复制。`, href: '/site-selection/negotiation', link: '去看话术库', n: `${negotiation.stages.length} 阶段` },
              { icon: Shapes, title: '选址案例库', desc: `${siteCaseData.studies.length} 个连锁品牌选址研究 + ${siteCaseData.failures.length} 类失败模式，明确标注模拟案例与资料来源。`, href: '/site-selection/cases', link: '去看案例库', n: `${siteCaseData.failures.length} 类坑` },
              { icon: FileCheck2, title: '合同与交接清单', desc: '22 项签约前检查，可勾选、备注、标记待核实并导出；含交房、表底与开业倒排。', href: '/site-selection/lease', link: '打开检查清单', n: '22 项' },
            ].map(({ icon: Icon, title, desc, href, link, n }) => (
              <Link key={href} href={href} className="card-interactive group flex flex-col p-6">
                <div className="flex items-start justify-between"><Icon className="h-5 w-5 text-accent" aria-hidden /><span className="badge">{n}</span></div>
                <h3 className="mt-5 text-[19px] font-semibold group-hover:text-accent-ink">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{desc}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.8px] font-medium text-accent-ink">{link} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-line bg-ink text-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Before you sign</p>
            <h2 className="mt-2 max-w-[640px] text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[32px]">好位置不是看出来的，是调查出来的；<br />好租金不是求出来的，是算出来、谈出来的。</h2>
            <p className="mt-3 max-w-[600px] text-[13.5px] leading-relaxed text-white/65">{siteTopics.length} 个主题、{siteRoadmap.length} 个步骤、{getSiteArticleMetas().length} 篇文章，最终都要落到一份你自己填过的评估报告上。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/site-selection/roadmap" className="btn-primary">从第一步开始 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/site-selection/reports" className="rounded-[10px] border border-white/25 px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/10">生成评估报告</Link>
            <Link href="/guide" className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[12.5px] text-white/60 hover:text-white"><BookOpen className="h-3.5 w-3.5" aria-hidden />回开店指南</Link>
          </div>
        </div>
      </section>
    </>
  );
}
