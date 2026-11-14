import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, KeyRound, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeaseChecklistView } from '@/components/site-selection/LeaseChecklistView';
import { leaseData } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '租赁合同与签约交接检查清单',
  description: '22 项签约前逐条核查清单，可勾选、写备注、标记待核实并导出 CSV；附交房留档、表底数与开业倒排。工具只做风险提示，不认定合同合法有效。',
  alternates: { canonical: pageUrl('/site-selection/lease') },
};

const HANDOVER = [
  '钥匙、门禁、卷帘门遥控器、消防通道钥匙逐件清点并签收',
  '水、电、燃气表底数拍照，记录日期与读数，双方签字',
  '现有设备、装修、遗留物列清单，注明归属与可否拆除',
  '房屋现状全景与细节照片留档，重点拍已有破损与渗漏',
  '物业、消防、排烟、排污的联系人与书面条件归档',
  '确认租金起算日、免租期起止日与装修期是否重叠',
  '招牌、外摆、排烟管走向的审批要求书面确认后再施工',
  '开业倒排：证照办理、装修、设备进场、试营业、开业各留缓冲',
];

export default function LeasePage() {
  const total = leaseData.groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <PageHeader
        eyebrow="LEASE / READ BEFORE YOU SIGN"
        title="合同与交接：把口头承诺变成书面条款"
        description="签约前最贵的不是律师费，是没看清楚的那一两条。下面 22 项按出租主体、工程条件、租金条款与退出责任分组，逐条勾选、写备注、把不确定的标成待核实。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{total}</p>
            <p className="mt-1 text-[13px] font-medium">项检查 · {leaseData.groups.length} 组</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">勾选与备注保存在本机浏览器，可导出 CSV 带去和房东、物业逐条对照。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <LeaseChecklistView />
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeading eyebrow="After Signing" title="交房与开业衔接：别在最后一公里丢钱" description="钥匙到手不等于可以开工。表底数、设备归属、照片留档、审批条件、租金起算日，任何一项没确认，都会在结算时变成争议。" />
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {HANDOVER.map((x, i) => (
                <li key={x} className="card flex gap-3 p-4 text-[13px] leading-relaxed text-ink-2">
                  <span className="num shrink-0 font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>{x}
                </li>
              ))}
            </ul>
          </div>
          <aside className="space-y-4">
            <div className="card border-gold/35 bg-gold-soft/35 p-5">
              <TriangleAlert className="h-5 w-5 text-gold" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">这份清单不是法律意见</h3>
              <p className="mt-2 text-[12.8px] leading-relaxed text-ink-2">各地商业租赁、餐饮许可、消防与环保要求不同，且会调整。涉及出租权、用途、解约责任与许可条件，请以所在地现行法规、监管部门要求及当地专业人士意见为准。</p>
            </div>
            <div className="card p-5">
              <KeyRound className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">配套入口</h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li><Link href="/site-selection/guides/ss-16-lease-clauses" className="text-accent-ink hover:underline">合同中最容易忽略的 20 个问题</Link></li>
                <li><Link href="/site-selection/guides/ss-17-exhaust-system" className="text-accent-ink hover:underline">排烟、电力、燃气：工程条件核查</Link></li>
                <li><Link href="/site-selection/tools/lease-checklist" className="text-accent-ink hover:underline">在工具页单独打开检查清单</Link></li>
                <li><Link href="/site-selection/reports" className="text-accent-ink hover:underline">把待核实项写进评估报告</Link></li>
              </ul>
            </div>
            <Link href="/site-selection/tools/decision-report" className="card-interactive flex items-center justify-between gap-3 p-4 text-[13px] font-medium">
              <span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-accent" aria-hidden />生成最终签约决策报告</span>
              <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
