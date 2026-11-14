import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SsChartCard } from '@/components/site-selection/SsChartCard';
import { CHART_LABELS, siteTools } from '@/lib/site-selection/data';
import { SITE_CHART_IDS } from '@/lib/site-selection/charts';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '12 类选址数据图解',
  description: '客流时段、工作日与周末、目标客群占比、竞争分布、评分雷达、租金方案、租期成本、三情景营业额、租金利润敏感性与风险分布等 12 类 ECharts 图表的口径说明。',
  alternates: { canonical: pageUrl('/site-selection/charts') },
};

export default function ChartsPage() {
  return (
    <>
      <PageHeader
        eyebrow="DATA, BUT USEFUL / 12 CHARTS"
        title="每张图都要回答一个选址问题"
        description="图不是装饰。下面 12 类图表分别对应一个具体判断：什么时候有人、是不是目标客群、租金差多少、保守情景能不能过保本线、风险集中在哪里。工具里的图由你输入的数据驱动，这里的图用演示数据说明口径。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{SITE_CHART_IDS.length}</p>
            <p className="mt-1 text-[13px] font-medium">类图表 · 全部有口径说明</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">演示数据不是任何真实商圈统计，也不代表行业平均值；请用自己的现场记录替换。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead><tr className="border-b border-line bg-surface-2/50 text-[12px] text-muted">
                <th className="px-4 py-3 font-semibold">图表</th><th className="px-4 py-3 font-semibold">回答的问题</th><th className="px-4 py-3 font-semibold">口径提示</th>
              </tr></thead>
              <tbody>
                {SITE_CHART_IDS.map((id, i) => (
                  <tr key={id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3 font-medium text-ink"><span className="num mr-2 text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>{CHART_LABELS[id]?.title ?? id}</td>
                    <td className="px-4 py-3 leading-relaxed text-ink-2">{CHART_LABELS[id]?.question ?? '—'}</td>
                    <td className="px-4 py-3 leading-relaxed text-muted">{CHART_LABELS[id]?.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Read The Chart, Not The Color" title="12 张图，按判断顺序排好" description="先看客流与客群，再看竞争与评分，最后看租金、保本与现金支出。顺序和 16 步流程一致。" />
          <div className="grid gap-4 lg:grid-cols-2">
            {SITE_CHART_IDS.map((id) => <SsChartCard key={id} id={id} height={260} />)}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeading eyebrow="Live Data" title="工具里的图会随输入实时更新" description="演示图用于讲口径，真正要看的是你自己填出来的那张。以下工具都内置了实时图表。" />
            <div className="flex flex-wrap gap-2">
              {siteTools.filter((t) => ['traffic-counter', 'scorecard', 'rent-negotiation', 'revenue-forecast', 'compare', 'decision-report'].includes(t.slug)).map((t) => (
                <Link key={t.slug} href={`/site-selection/tools/${t.slug}`} className="chip text-[12.5px]">{t.name} <ArrowRight className="h-3 w-3" aria-hidden /></Link>
              ))}
            </div>
            <h3 className="mt-8 text-[18px] font-semibold">四个容易读错的口径</h3>
            <ul className="mt-3 space-y-2.5 text-[13.2px] leading-relaxed text-ink-2">
              <li>· <strong>经过人数不等于客流</strong>：折线图两条线要分开看，目标客群口径必须在计数前定义好。</li>
              <li>· <strong>月租不等于租赁成本</strong>：递增、押金、免租期、物业与改造费会改变整段租期总成本，趋势图可能交叉。</li>
              <li>· <strong>评分不是成功率</strong>：雷达图暴露短板，但产权、合规、工程条件属于一票否决，不参与平均。</li>
              <li>· <strong>三情景不是三种预测</strong>：是同一组假设下的区间，用来检查「保守情景能不能活」，不是给乐观情景找理由。</li>
            </ul>
          </div>
          <aside className="card h-fit p-5">
            <BarChart3 className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="mt-3 text-[16px] font-semibold">图表与公式一起看</h3>
            <p className="mt-2 text-[12.8px] leading-relaxed text-ink-2">每个工具页底部都列出计算公式与输出项。图表只负责把计算结果画出来，假设是否合理要回到输入数据本身。</p>
            <div className="mt-4 flex flex-col gap-2 text-[13px]">
              <Link href="/site-selection/tools" className="text-accent-ink hover:underline">打开全部工具 →</Link>
              <Link href="/site-selection/fieldwork" className="text-accent-ink hover:underline">看六轮调查与记录口径 →</Link>
              <Link href="/site-selection/guides/ss-09-estimate-revenue" className="text-accent-ink hover:underline">读营业额预测三模型 →</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
