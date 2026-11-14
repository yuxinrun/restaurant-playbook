import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Database, FileDown, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ToolsGrid } from '@/components/site-selection/ToolsGrid';
import { siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '8 个选址实战工具',
  description: '考察记录、客流计数、评分卡、租金谈判、营业额预测、多铺位对比、合同清单与最终评估报告。全部可输入自己的数据、实时更新、保存在本机并导出。',
  alternates: { canonical: pageUrl('/site-selection/tools') },
};

export default function SiteToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="WORKING TOOLS / 01–08"
        title="工具不是展示品，是真的要能算"
        description="每个工具都公开计算公式与口径，输入你自己的数字，图表与结论实时更新；数据保存在本机浏览器，可导出 CSV / JSON 或打印成 PDF。现场用手机，回店里用电脑接着填。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{siteTools.length}</p>
            <p className="mt-1 text-[13px] font-medium">个工具 · 全部可用</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">无账号、不上传、不联网取数。清理浏览器数据会清空本地记录，重要数据请导出留档。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <ToolsGrid />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="How They Work" title="三个约定，保证结果能复核" description="工具的目标不是给一个看起来很准的数字，而是把假设、口径和缺口摊开给你看。" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Calculator, title: '公式全部公开', body: '每个工具页底部列出所用公式、输出项与免责说明。估算模型是决策辅助，不是营业额承诺，也不构成投资、法律或财税建议。' },
              { icon: Database, title: '只存本机', body: 'localStorage 按工具分别存放；同一浏览器内跨页面、跨工具互通，评估报告自动汇总。换设备不会同步，可导出 JSON 迁移。' },
              { icon: FileDown, title: '能带走', body: '考察记录、合同清单与评估报告可导出 CSV（Excel 可打开）、JSON，或直接用浏览器打印 / 另存 PDF。' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-5">
                <Icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-3 text-[16px] font-semibold">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
          <div className="card mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="text-[15px] font-semibold">现场使用建议</h3>
                <p className="mt-1 text-[12.8px] leading-relaxed text-ink-2">手机底部快捷入口可直接打开考察记录、客流计数、租金计算与谈判话术。先开考察记录填地址与天气，再开客流计数，结束时把两处记录导出留档。</p>
              </div>
            </div>
            <Link href="/site-selection/fieldwork" className="btn-secondary text-[12.5px]">看六轮调查方法 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionHeading eyebrow="Do Not Rebuild" title="房租承受力、保本与回本，用主站计算器" description="选址模块不重复开发已有的经营计算器。房租承受上限在本模块由「租金承受力」逻辑复用，完整版保本、ROI 与现金流工具请回主站工具箱。" />
            <p className="max-w-[720px] text-[13px] leading-relaxed text-muted">这样同一套公式在两个频道里给出一致结果，避免你在选址阶段算一遍、开店阶段再算一遍却对不上。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className="btn-primary">打开主站工具箱 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/site-selection/reports" className="btn-secondary">生成选址评估报告</Link>
          </div>
        </div>
      </section>
    </>
  );
}
