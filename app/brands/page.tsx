import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BrandGrid } from '@/components/brands/BrandGrid';
import { brands } from '@/lib/data';

export const metadata: Metadata = {
  title: '餐饮品牌案例库 · 20 个国内外品牌拆解',
  description: '海底捞、西贝、太二、老乡鸡、乡村基、蜜雪冰城、瑞幸、喜茶、费大厨、巴奴，以及麦当劳、星巴克、Chipotle、Shake Shack 等 20 个品牌的统一结构案例分析。',
};

const STRUCTURE = [
  '品牌简介', '品类与定位', '目标客群', '核心产品', '菜单和定价特点', '商业模式',
  '门店运营特色', '营销方式', '成本控制方法', '值得学习的经验', '不适合直接照搬的地方', '参考来源',
];

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="品牌案例 / Case Library"
        title="不只讲成功故事，更关心哪些方法你真能抄"
        description="20 个国内外品牌，统一 12 节结构。重点不是「它多厉害」，而是它为什么成立、哪些方法普通小店能用、哪些一照搬就翻车。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-olive">{brands.length}</p>
            <p className="mt-1.5 text-[12.5px] text-muted">个案例 · 国内 10 / 国外 10</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <BrandGrid brands={brands} />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading
            eyebrow="One Structure, All Cases"
            title="每个案例都回答同样 12 个问题"
            description="统一结构才能横向比较。特别留意「不适合直接照搬的地方」——大品牌的表象，往往是规模的结果而不是原因。"
          />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {STRUCTURE.map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-[9px] border border-line bg-surface px-4 py-3">
                <span className="num text-[12px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[13.5px] text-ink-2">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-accent/25 bg-accent-soft/35 p-5 text-[13px] leading-relaxed text-ink-2 md:p-6">
            <strong className="font-semibold text-accent-ink">关于数据的说明：</strong>本站不引用未经核实的营收、门店数量与市场份额。品牌财务、门店数等数据如需引用，请查品牌年报、招股书或交易所公告，并注明年份与口径（案例页底部给了可查证的官方入口）。案例中的分析是本站观点，与品牌官方表述区分。
          </div>
        </div>
      </section>
    </>
  );
}
