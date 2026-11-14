import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ListChecks, ShieldCheck, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Roadmap } from '@/components/site-selection/Roadmap';
import { getSiteArticleMetas } from '@/lib/site-selection/content';
import { siteRoadmap, siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '16 步选址路线图',
  description: '从明确开店需求到签约交接，16 个步骤逐条写清目标、任务、操作方法与数据、配套工具、常见错误和通过标准。进度保存在你自己的浏览器里。',
  alternates: { canonical: pageUrl('/site-selection/roadmap') },
};

export default function SiteRoadmapPage() {
  const titles = Object.fromEntries(getSiteArticleMetas().map((a) => [a.slug, a.title]));
  const phases = [...new Set(siteRoadmap.map((s) => s.phase))];

  return (
    <>
      <PageHeader
        eyebrow="THE WORKFLOW / 01–16"
        title="十六步选址路线图"
        description="选址不是一个动作，是一条有先后顺序的链路。跳步不会省时间，只会把问题推到签完合同之后才暴露。每一步都配了通过标准：没过，就不要往下走。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{siteRoadmap.length}</p>
            <p className="mt-1 text-[13px] font-medium">个步骤 · {phases.length} 个阶段</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">完成状态保存在本机浏览器，换页面不会丢；换设备或清理浏览器数据会重置。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <Roadmap articleTitles={titles} />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Why The Order Matters" title="四个阶段，别把后面的事提前做" description="先看模型和商圈，再谈条件，最后才谈合同。顺序反了，你会先爱上铺子，再去找理由说服自己。" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, i) => {
              const steps = siteRoadmap.filter((s) => s.phase === phase);
              return (
                <div key={phase} className="card flex flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="num text-[12px] font-semibold text-accent">PHASE {String(i + 1).padStart(2, '0')}</span>
                    <span className="badge">{steps.length} 步</span>
                  </div>
                  <h3 className="mt-3 text-[17px] font-semibold">{phase}</h3>
                  <ul className="mt-3 space-y-1.5 text-[12.8px] leading-relaxed text-ink-2">
                    {steps.map((s) => <li key={s.id} className="flex gap-2"><span className="num shrink-0 text-muted">{String(s.order).padStart(2, '0')}</span>{s.title}</li>)}
                  </ul>
                  <p className="mt-auto border-t border-line pt-3 text-[12px] leading-relaxed text-muted"><strong className="text-ink">本阶段收尾：</strong>{steps[steps.length - 1]?.pass}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-5 lg:grid-cols-3">
          {[
            { icon: Target, title: '每一步只回答一个问题', body: '「这一步的证据齐了吗？」不是「这个铺子好不好」。把判断拆小，才不会被一次看铺的好感带跑。' },
            { icon: ListChecks, title: '数据先于结论', body: '客流、租金、工程条件、竞品价格带都要落到可复核的记录上。没有记录的数字，在谈判桌上等于没有。' },
            { icon: ShieldCheck, title: '通过标准是硬门槛', body: '产权、餐饮用途、排烟、电力、消防这类一票否决项，不能用「综合评分高」抵消，也不能靠房东口头承诺代替书面材料。' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-5">
              <Icon className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space border-t border-line bg-ink text-white">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Start with step 01</p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">先把账算清楚，再去看铺</h2>
            <p className="mt-3 max-w-[620px] text-[13.5px] leading-relaxed text-white/65">路线图里的每一步都有对应工具：{siteTools.length} 个工具全部能输入自己的数字、保存并导出。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/site-selection/tools" className="btn-primary">打开全部工具 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/site-selection/guides" className="rounded-[10px] border border-white/25 px-4 py-2.5 text-[13px] text-white/85 hover:bg-white/10">读 16 个主题</Link>
          </div>
        </div>
      </section>
    </>
  );
}
