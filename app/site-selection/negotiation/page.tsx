import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, MessageSquareText, Scale } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NegotiationLibrary, ScenarioLibrary } from '@/components/site-selection/NegotiationLibrary';
import { SsChartCard } from '@/components/site-selection/SsChartCard';
import { negotiation } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '房东谈判话术库与场景拆解',
  description: '谈判前的证据准备、16 个阶段 × 3 种风格的可复制话术，以及 7 个完整场景的背景、开场、追问、让步底线与退出信号。好租金不是求出来的，是算出来、谈出来的。',
  alternates: { canonical: pageUrl('/site-selection/negotiation') },
};

const PREP = [
  { n: '01', title: '查同街租金', body: '至少问到三条可比信息：同街或同层近半年成交租金、当前空置时长、周边商铺转租价格。来源写进记录，别只记一个数字。' },
  { n: '02', title: '算出自己的上限', body: '用营业额预测倒推可承受租金，再定三个价：报价、目标价、退出价。退出价是「超过就不谈」的数字，不是希望谈到的数字。' },
  { n: '03', title: '准备一个真实备选', body: '手里有第二个能签的铺位，才谈得动条件。没有备选时的强硬，通常只是情绪。' },
  { n: '04', title: '列出可交换条件', body: '免租期、递增基数与幅度、押金、租期、续租优先权、招牌与外摆、装修期、退出条款。价格谈不动时换条件，别只盯月租。' },
  { n: '05', title: '把口头承诺写成附件', body: '所有谈成的内容必须落到合同或补充协议。任何「到时候好说」都不算谈成。' },
];

export default function NegotiationPage() {
  return (
    <>
      <PageHeader
        eyebrow="NEGOTIATION / TALK WITH EVIDENCE"
        title="谈判话术库：把最难开口的部分写下来"
        description="谈判不是靠气势，是靠同街租金、自己的退出价与备选铺位。这里把每一句该怎么说、什么时候说、对方拒绝后怎么接、什么信号出现该走，全部拆成了可以直接复制的中文话术。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{negotiation.stages.length} × 3</p>
            <p className="mt-1 text-[13px] font-medium">个阶段 · 三种表达风格</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">另有 {negotiation.scenarios.length} 个完整场景，含开场、追问、让步与退出信号。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Before You Open Your Mouth" title="进门前先做完这五件事" description="没有证据的还价，在房东听来只是「想便宜点」。准备越具体，越不需要靠态度撑场面。" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {PREP.map((p) => (
              <div key={p.n} className="card flex flex-col p-4">
                <span className="num text-[12px] font-semibold text-accent">{p.n}</span>
                <h3 className="mt-2 text-[15px] font-semibold">{p.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <SsChartCard id="rent-compare" height={250} />
            <SsChartCard id="lease-trend" height={250} />
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Line By Line" title="按阶段查话术，点一下就能复制" description="稳健型用于第一次接触，直接型适用于已有可比数据，退让型用于需要交换条件的场合。每句都标了适用场景与可能结果。" />
          <NegotiationLibrary />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Seven Full Scenarios" title="完整场景拆解：从第一句到退出信号" description="场景按真实谈判顺序组织：背景、对方诉求、错误谈法、推荐策略、开场、追问、拒绝应对、可让步条件、必须守住的底线、何时该走。" />
          <ScenarioLibrary />
        </div>
      </section>

      <section className="section-space border-t border-line bg-ink text-white">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Know your walk-away price</p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">先把整段租期的钱算清，再开口还价</h2>
            <p className="mt-3 max-w-[640px] text-[13.5px] leading-relaxed text-white/65">月租低 2000 元，如果换来递增更快、免租期归零、押金翻倍，整段租期可能反而更贵。用计算器比较方案，把结论带进谈判。</p>
            <div className="mt-4 flex flex-wrap gap-4 text-[12.5px] text-white/75">
              <Link href="/site-selection/guides/ss-12-negotiate-20k-to-16k" className="inline-flex items-center gap-1.5 hover:text-white"><MessageSquareText className="h-4 w-4" aria-hidden />案例：2 万谈到 1.6 万</Link>
              <Link href="/site-selection/guides/ss-13-free-rent-period" className="inline-flex items-center gap-1.5 hover:text-white"><Scale className="h-4 w-4" aria-hidden />免租期怎么谈才值钱</Link>
            </div>
          </div>
          <Link href="/site-selection/tools/rent-negotiation" className="btn-primary"><Calculator className="h-4 w-4" aria-hidden />打开租金谈判计算器 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>
    </>
  );
}
