import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { Calculator } from '@/components/tools/Calculator';
import { getArticleMetas } from '@/lib/content';
import { MENU_DISHES } from '@/lib/charts';
import { categories, tools } from '@/lib/data';
import { yuan } from '@/lib/format';

export const metadata: Metadata = {
  title: '菜单与产品 · 把菜单做成一台赚钱机器',
  description: '菜单工程四象限、单份毛利、菜品定价与 SKU 精简：用模拟菜单数据演示明星、现金牛、潜力与问题产品的识别与处理。',
};

const QUADRANTS = [
  { name: '明星产品', desc: '高销量 · 高单份毛利', action: '守住品质与供应，放在菜单显眼位置', tone: 'bg-olive-soft text-olive' },
  { name: '现金牛产品', desc: '高销量 · 低单份毛利', action: '查规格与出成率，或做组合搭售，别贸然涨价', tone: 'bg-gold-soft text-gold' },
  { name: '潜力产品', desc: '低销量 · 高单份毛利', action: '改名字、换图片、做店员推荐，给一次机会', tone: 'bg-surface-2 text-ink-2' },
  { name: '问题产品', desc: '低销量 · 低单份毛利', action: '先改后砍，专用原料多者优先下架', tone: 'bg-accent-soft text-accent-ink' },
];

export default function MenuPage() {
  const articles = getArticleMetas().filter((a) => ['product', 'finance', 'operations'].includes(a.category)).slice(0, 4);
  const pricingTool = tools.find((t) => t.slug === 'pricing');
  const topics = categories.find((c) => c.id === 'product')?.topics ?? [];
  const avgSold = 175;
  const avgMargin = 13;

  return (
    <>
      <PageHeader
        eyebrow="菜单与产品 / Menu Engineering"
        title="菜单不是菜品清单，是一台赚钱机器"
        description="菜品成本、定价、毛利、结构、爆品与出品标准化。菜单每加一道菜，采购、库存、后厨和培训就各多一份工作——所以这里也讲怎么减。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-gold">04</p>
            <p className="mt-1.5 text-[12.5px] text-muted">象限 · 一套菜单体检法</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="The Four Quadrants" title="把菜放进四个象限，再决定谁留下" description="横轴看销量，纵轴看单份毛利。注意是「单份毛利金额」不是毛利率：毛利率 70% 卖 9 元，不如毛利率 45% 卖 38 元更养店。" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUADRANTS.map((q, i) => (
              <div key={q.name} className="card p-5">
                <span className={`badge ${q.tone} !border-transparent`}>象限 0{i + 1}</span>
                <h3 className="mt-4 text-[18px] font-semibold">{q.name}</h3>
                <p className="mt-1 text-[12.5px] text-muted">{q.desc}</p>
                <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed text-ink-2">{q.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Case Data" title="一份模拟菜单，看清谁在替你交房租" description="以下为模拟菜单数据，不是任何真实门店经营数据。平均值：周销量 175 份、单份毛利 13 元。" />
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <ChartCard id="menu-engineering" />
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-surface-2/60 px-5 py-4">
                <h3 className="text-[17px] font-semibold">模拟菜品明细（演示数据）</h3>
                <p className="mt-1 text-[12px] text-muted">周毛利额 = 周销量 × 单份毛利，用它排序比毛利率靠谱。</p>
              </div>
              <div className="max-h-[420px] overflow-auto">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="sticky top-0 bg-surface-2 text-[11.5px] text-muted">
                    <tr><th className="px-4 py-2.5 font-medium">菜品</th><th className="px-2 py-2.5 text-right font-medium">周销量</th><th className="px-2 py-2.5 text-right font-medium">单份毛利</th><th className="px-4 py-2.5 text-right font-medium">周毛利额</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {MENU_DISHES.map((d) => (
                      <tr key={d.name} className="text-ink-2">
                        <td className="px-4 py-2.5"><span className="font-medium text-ink">{d.name}</span><span className="ml-2 text-[11px] text-muted">{d.quadrant}</span></td>
                        <td className="num px-2 py-2.5 text-right">{d.sold}</td>
                        <td className="num px-2 py-2.5 text-right">{yuan(d.margin, 2)}</td>
                        <td className="num px-4 py-2.5 text-right font-medium">{yuan(d.sold * d.margin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <ChartCard id="dish-ranking" />
            <div className="card p-5 md:p-6">
              <h3 className="text-[17px] font-semibold">一次菜单体检，照着做</h3>
              <ol className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-ink-2">
                {[
                  '导出近 4 周每道菜销量，剔除或标注活动期',
                  '逐菜做成本卡：净料用量 × 净料单价 + 包装 + 其他随单成本',
                  `算全店平均销量与平均单份毛利（本演示为 ${avgSold} 份 / ${avgMargin} 元）`,
                  '给每道菜标注专用原料数与平均出餐时间',
                  '明星守品质、现金牛查成本、潜力做推荐、问题设淘汰线',
                  '改版一次只动 3–5 道，改完复测营业额与出餐时间',
                ].map((s, i) => (
                  <li key={s} className="flex gap-3"><span className="num mt-0.5 shrink-0 text-[12px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>{s}</li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                {topics.map((t) => <span key={t} className="rounded-full border border-line bg-surface-2/70 px-2.5 py-1 text-[11.5px] text-ink-2">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {pricingTool && (
        <section className="section-space">
          <div className="wrap">
            <SectionHeading eyebrow="Pricing In Practice" title="现在就算：这道菜该卖多少钱" description="按目标毛利率倒推售价。倒推出来的只是成本底线，最终还要过一遍顾客价格带与竞品价格。" href="/tools/pricing" linkLabel="单独打开这个工具" />
            <Calculator tool={pricingTool} />
          </div>
        </section>
      )}

      <section className="section-space border-t border-line bg-surface-2/30">
        <div className="wrap">
          <SectionHeading eyebrow="Keep Reading" title="把菜单、损耗与毛利连起来看" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 2} />)}
          </div>
          <Link href="/tools/pricing" className="btn-primary mt-8">所有工具都能真算 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>
    </>
  );
}
