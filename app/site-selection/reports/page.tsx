import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ReportTool } from '@/components/site-selection/tools/ReportTool';
import { siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '最终签约决策评估报告',
  description: '自动汇总本机保存的考察记录、客流计数、评分卡、租金方案、营业额预测、候选对比与合同核查，生成可打印 / 另存 PDF、导出 CSV 与 JSON 的选址评估报告。',
  alternates: { canonical: pageUrl('/site-selection/reports') },
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="BEFORE YOU SIGN / THE REPORT"
        title="把调查、算账和谈判合成一份报告"
        description="页面自动读取你在这台设备上保存的全部选址数据，生成八个章节的《餐饮店铺选址评估报告》：基础信息、商圈与客流、竞争与铺位、租金与投资、预测与对比、谈判与合同风险、待核实问题、最终建议。没填的部分会明确列为缺口，不会替你编。"
      />

      <div className="section-space">
        <div className="wrap">
          <ReportTool />
        </div>
      </div>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Close The Gaps" title="报告写不满？按这八步回去补" description="报告里的「待核实问题」是可执行清单。每一项都对应一个工具，按顺序补齐后再回来重新生成。" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {siteTools.map((t, i) => (
              <Link key={t.slug} href={`/site-selection/tools/${t.slug}`} className="card-interactive group flex flex-col p-4">
                <span className="num text-[11px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-[14.5px] font-semibold leading-snug group-hover:text-accent-ink">{t.name}</h3>
                <p className="mt-1.5 text-[12.3px] leading-relaxed text-muted">{t.short}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[12px] text-accent-ink">去填写 <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-5 md:grid-cols-2">
          <div className="card p-5">
            <FileText className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="mt-3 text-[16px] font-semibold">三种带走方式</h3>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-2">
              <li>· <strong>打印 / 另存 PDF</strong>：自动隐藏导航与按钮，只保留报告正文；打印对话框里选「另存为 PDF」。</li>
              <li>· <strong>CSV</strong>：章节 / 项目 / 内容三列，Excel 可直接打开，适合发给合伙人逐条批注。</li>
              <li>· <strong>JSON</strong>：包含全部原始记录与建议，便于以后迁移到账号或数据库。</li>
            </ul>
          </div>
          <div className="card border-gold/35 bg-gold-soft/35 p-5">
            <ShieldAlert className="h-5 w-5 text-gold" aria-hidden />
            <h3 className="mt-3 text-[16px] font-semibold">报告不能替代现场与专业意见</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">结论只基于你已填的数据；评分不是投资成功概率。存在产权、合规或工程条件障碍时，不能因综合评分高而建议签约。涉及许可、消防、租赁与财税事项，请以所在地现行法规、监管部门要求及当地专业人士意见为准。</p>
            <Link href="/site-selection/roadmap" className="mt-4 inline-flex items-center gap-1.5 text-[12.8px] font-medium text-accent-ink hover:underline">回到 16 步流程复核 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
