import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shapes, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CaseLibrary } from '@/components/site-selection/CaseLibrary';
import { SceneMatrix } from '@/components/site-selection/SceneMatrix';
import { SsChartCard } from '@/components/site-selection/SsChartCard';
import { scenarioData, siteCaseData } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '选址案例库与场景品类矩阵',
  description: '连锁品牌选址逻辑研究、12 类明确标注的模拟失败案例，以及 13 类商圈场景与 12 类特殊品类的专门检查表。案例用来学调查方法，不是用来照搬答案。',
  alternates: { canonical: pageUrl('/site-selection/cases') },
};

export default function CasesPage() {
  return (
    <>
      <PageHeader
        eyebrow="CASES / LEARN FROM THE BILL"
        title="案例库：能学的是方法，不能抄的是答案"
        description="连锁品牌的选址逻辑建立在其品牌、供应链与资金实力之上；小店照搬位置，往往只承担了同样的租金，却没有同样的客流。这里把「值得借鉴」和「不适合照搬」分开写。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{siteCaseData.studies.length} + {siteCaseData.failures.length}</p>
            <p className="mt-1 text-[13px] font-medium">个品牌研究 / 类失败模式</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">失败案例均为模拟案例，不对应任何真实门店，也不是行业统计。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <CaseLibrary />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Different Streets, Different Math" title="场景与品类矩阵" description={`${scenarioData.scenes.length} 类商圈场景分别看客群、消费时间、价格带、竞争、租金与考察方法；${scenarioData.categories.length} 类特殊品类另附专门检查表与应避开的位置。`} />
          <SceneMatrix />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Risk, Not Destiny" title="风险集中在哪里" description="把风险按类型计数，比一句「感觉有点悬」有用。演示数据用于说明读图方式，请用自己清单里的待核实项替换。" />
            <SsChartCard id="risk-distribution" height={280} />
          </div>
          <div className="space-y-4">
            <div className="card flex items-start gap-3 border-accent/25 bg-accent-soft/30 p-5">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="text-[16px] font-semibold">读案例的正确姿势</h3>
                <p className="mt-2 text-[12.8px] leading-relaxed text-ink-2">先问「它当时掌握了什么数据、做了几轮调查、能承受多少试错成本」，再问「我有没有同样条件」。品牌案例常省略失败门店，只讲成功点位，这本身就是幸存者偏差。</p>
              </div>
            </div>
            <div className="card p-5">
              <Shapes className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">配套阅读与工具</h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li><Link href="/site-selection/guides/ss-18-half-year-close" className="text-accent-ink hover:underline">开了半年就关：12 类失败模式</Link></li>
                <li><Link href="/site-selection/guides/ss-03-community-mall-street" className="text-accent-ink hover:underline">社区、商场、写字楼、街边怎么选</Link></li>
                <li><Link href="/site-selection/guides/ss-02-category-trade-area" className="text-accent-ink hover:underline">品类决定位置，不是位置决定品类</Link></li>
                <li><Link href="/site-selection/tools/scorecard" className="text-accent-ink hover:underline">用自己的数据做评分卡</Link></li>
              </ul>
            </div>
            <Link href="/site-selection/reports" className="card-interactive flex items-center justify-between gap-3 p-4 text-[13px] font-medium">
              把结论落到评估报告 <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
