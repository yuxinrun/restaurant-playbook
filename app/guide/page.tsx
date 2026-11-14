import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, Milestone, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { RoadmapExplorer } from '@/components/guide/RoadmapExplorer';
import { getArticleMetas, getArticlesBySlugs } from '@/lib/content';
import { roadmap, tools } from '@/lib/data';

export const metadata: Metadata = {
  title: '开店指南 · 12 个阶段从零开一家店',
  description: '按开店时间顺序组织的完整知识体系：想清楚再开店、市场与选址、品牌与产品、开业筹备、正式经营。含学习进度、推荐文章与实用工具。',
};

const PHASES = [
  { name: '第一阶段 · 想清楚再开店', range: '01–02', desc: '风险、资金与市场调研：先算最坏情况，再谈梦想。' },
  { name: '第二阶段 · 市场与选址', range: '03', desc: '商圈、客流、租金与合规条件，用评分表替代感觉。' },
  { name: '第三阶段 · 品牌与产品', range: '04–06', desc: '定位、菜单设计、成本测算，把菜单当财务工具。' },
  { name: '第四阶段 · 开业筹备', range: '07–09', desc: '装修动线、供应商与人员培训，试营业前把问题暴露完。' },
  { name: '第五阶段 · 正式经营', range: '10–12', desc: '试营业、开业营销、数据复盘与持续优化。' },
];

const CHECKLIST = [
  '写下资金上限，以及最多能接受连续亏损几个月',
  '候选铺位逐个确认排烟、电力、给排水与经营许可前置条件',
  '用保守日营业额算出保本营业额与安全边际',
  '为每道菜做一张成本卡，写清净料用量与净料单价',
  '预留 3–6 个月固定成本作为流动资金，并与装修预算分账',
  '开档、点单、出品、收档各写一页 SOP 卡片',
  '试营业限定菜单与接单量，每天复盘一条最疼的问题',
  '固定每周记录 8 个核心指标，口径不变',
];

export default function GuidePage() {
  const articles = getArticleMetas();
  const startArticles = articles.filter((a) => a.category === 'start' || ['budget-30sqm', 'gross-margin-trap'].includes(a.slug)).slice(0, 4);
  const articleTitles = Object.fromEntries(articles.map((a) => [a.slug, a.title]));
  const toolTitles = Object.fromEntries(tools.map((t) => [t.slug, t.name]));
  const related = getArticlesBySlugs(['budget-30sqm', 'site-selection-mistakes', 'trade-area-check', 'first-month-marketing']);

  return (
    <>
      <PageHeader
        eyebrow="开店指南 / Start Here"
        title="签字之前，先把钱、人、位置和品类想明白"
        description="按真实开店顺序组织的 5 个阶段、12 个步骤。每一步都写了学习目标、核心任务、常见错误、推荐文章和实用工具——顺序别反，反了通常要交学费。"
        aside={
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-accent">05 <span className="text-[15px] text-muted">/ 12</span></p>
            <p className="mt-1.5 text-[12.5px] text-muted">阶段 / 步骤 · 可记录学习进度</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Five Phases" title="五个阶段，按顺序来" description="找铺子之前先做市场调研，菜单定下来之前先算保本线。顺序错了，后面每一步都在为前一步补窟窿。" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {PHASES.map((p, i) => (
              <div key={p.name} className="card p-5">
                <div className="flex items-center justify-between">
                  <Milestone className="h-4 w-4 text-accent" aria-hidden />
                  <span className="num text-[11px] text-muted">STEP {p.range}</span>
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold leading-snug">{p.name}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{p.desc}</p>
                <span className="num mt-4 block text-[26px] font-semibold leading-none text-line-strong">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading
            eyebrow="从零开店路线图 / Interactive"
            title="点开一个阶段，看看这一步到底要做什么"
            description="进度保存在你自己的浏览器里，不上传、不注册。标记完成只是给自己看的，别为了凑满 12 格而跳过算账。"
          />
          <RoadmapExplorer stages={roadmap} articleTitles={articleTitles} toolTitles={toolTitles} />
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading eyebrow="Before You Sign" title="签字前自查清单" description="打印出来，逐条打勾。有一条打不了勾，就先别交定金。" />
            <div className="card divide-y divide-line">
              {CHECKLIST.map((item, i) => (
                <div key={item} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="num mt-0.5 w-6 shrink-0 text-[12px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[14px] leading-relaxed text-ink-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="card p-5 md:p-6">
              <ClipboardCheck className="h-5 w-5 text-olive" aria-hidden />
              <h3 className="mt-3 text-[17px] font-semibold">先算三笔账</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">初始投资、保本营业额、最坏情况能撑几个月。三笔都算完，再回头看效果图。</p>
              <div className="mt-4 grid gap-2">
                <Link href="/tools/roi" className="chip justify-between"><span>投资回报计算器</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                <Link href="/tools/breakeven" className="chip justify-between"><span>盈亏平衡计算器</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                <Link href="/tools/rent" className="chip justify-between"><span>房租承受能力计算器</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
              </div>
            </div>
            <div className="rounded-lg border border-accent/25 bg-accent-soft/40 p-5">
              <Wrench className="h-5 w-5 text-accent-ink" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">合规提醒</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">消防、食品安全、经营许可、劳动与税务事项，本站只提供经营方法，不替代法规。请以所在地现行规定与监管部门意见为准。</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-space border-t border-line bg-surface-2/30">
        <div className="wrap">
          <SectionHeading eyebrow="Recommended Reading" title="开店前先读这四篇" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(related.length ? related : startArticles).map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 1} />)}
          </div>
        </div>
      </section>
    </>
  );
}
