import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Radar, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SsChartCard } from '@/components/site-selection/SsChartCard';
import { fieldworkData, siteTools } from '@/lib/site-selection/data';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '实地踩点与客流调查方法',
  description: '六轮现场观察排期、15 项铺位细节检查与 12 个必填记录字段。明确区分经过人数、目标客群、潜在顾客与进店人数，把「感觉人多」变成可复核的记录。',
  alternates: { canonical: pageUrl('/site-selection/fieldwork') },
};

export default function FieldworkPage() {
  return (
    <>
      <PageHeader
        eyebrow="FIELDWORK / SIX ROUNDS"
        title="现场调查方法：数出来的，才算数"
        description="一次看铺只能说明「那天那个时间有人」。要判断一个位置能不能支撑一门生意，至少覆盖工作日与周末的早、午、下午、晚六个时段，并把观察口径固定下来。"
        aside={
          <div className="card min-w-[220px] p-5">
            <p className="num text-[34px] font-semibold text-accent">{fieldworkData.rounds.length} / {fieldworkData.details.length}</p>
            <p className="mt-1 text-[13px] font-medium">轮调查 / 项铺位细节</p>
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">{fieldworkData.recordFields.length} 个必填记录字段，可直接用考察记录器逐项填写。</p>
          </div>
        }
      />

      <section className="section-space">
        <div className="wrap">
          <div className="card mb-7 flex items-start gap-3 border-gold/35 bg-gold-soft/35 p-5">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
            <p className="text-[13.2px] leading-relaxed text-ink-2">{fieldworkData.notice}</p>
          </div>

          <SectionHeading eyebrow="Round Schedule" title="六轮调查：最小可行排期" description="轮次不是形式，是为了抓到同一位置在不同时间的几副面孔。条件允许时，同一轮应重复两次以上以消除天气、活动与节假日干扰。" />
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead><tr className="border-b border-line bg-surface-2/50 text-[12px] text-muted">
                <th className="px-4 py-3 font-semibold">轮次</th><th className="px-4 py-3 font-semibold">建议时段</th><th className="px-4 py-3 font-semibold">看什么</th><th className="px-4 py-3 font-semibold">必须记录</th>
              </tr></thead>
              <tbody>
                {fieldworkData.rounds.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0 align-top">
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium text-ink">{r.label}</td>
                    <td className="num whitespace-nowrap px-4 py-3.5 text-accent-ink">{r.time}</td>
                    <td className="px-4 py-3.5 leading-relaxed text-ink-2">{r.focus}</td>
                    <td className="px-4 py-3.5 leading-relaxed text-muted">{r.record}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <SsChartCard id="traffic-times" height={240} />
            <SsChartCard id="traffic-weekday" height={240} />
            <SsChartCard id="audience-pie" height={240} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">以上为演示数据，用于说明口径与读图方式。工具里的同类图表由你自己现场记录的数字驱动，会随输入实时更新。</p>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="15 Details On Site" title="铺位细节：每一项都要有答案" description="看得见的写尺寸与照片，看不见的问物业并要书面答复。「应该可以」在签约后通常会变成一笔改造费。" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {fieldworkData.details.map((d, i) => (
              <div key={d.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14.5px] font-semibold leading-snug">{d.label}</h3>
                  <span className="num shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2"><strong>为什么：</strong>{d.why}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted"><strong>怎么查：</strong>{d.check}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading eyebrow="Record Template" title="记录表必填字段" description="字段固定，才能横向比较不同铺位、不同轮次。观察不到就留空并注明原因，不要凭印象补一个数字。" />
            <div className="card flex flex-wrap gap-2 p-5">
              {fieldworkData.recordFields.map((f) => <span key={f} className="badge">{f}</span>)}
            </div>
            <h3 className="mt-8 text-[18px] font-semibold">四个口径，千万别混着写</h3>
            <div className="prose-editorial mt-3 max-w-[760px]">
              <table>
                <thead><tr><th>口径</th><th>定义</th><th>常见误用</th></tr></thead>
                <tbody>
                  <tr><td>经过人数</td><td>观察点前方通过的总人数，分方向计数</td><td>直接当成潜在顾客</td></tr>
                  <tr><td>有效目标客群</td><td>事先按品类定义画像后，符合画像的人数</td><td>现场临时改定义，把不想数的人排除掉</td></tr>
                  <tr><td>潜在顾客</td><td>目标客群中在该时段有就餐需求、且能接触到门店的人</td><td>忽略赶路速度、道路隔离与开门方向</td></tr>
                  <tr><td>进店人数</td><td>实际进入门店的人数（可观察时）</td><td>用竞品进店人数当自己未来的转化率</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="text-[16px] font-semibold">带这两个工具去现场</h3>
              <div className="mt-3 space-y-2">
                {siteTools.filter((t) => ['field-visit', 'traffic-counter'].includes(t.slug)).map((t) => (
                  <Link key={t.slug} href={`/site-selection/tools/${t.slug}`} className="flex items-center justify-between gap-2 rounded-[9px] border border-line bg-surface-2/40 px-3 py-2.5 text-[13px] hover:border-accent/40">
                    <span>{t.slug === 'field-visit' ? <ClipboardList className="mr-2 inline h-4 w-4 text-accent" aria-hidden /> : <Radar className="mr-2 inline h-4 w-4 text-accent" aria-hidden />}{t.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-[16px] font-semibold">配套阅读</h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li><Link href="/site-selection/guides/ss-06-count-traffic" className="text-accent-ink hover:underline">如何数客流：六轮调查与样本量</Link></li>
                <li><Link href="/site-selection/guides/ss-07-passers-not-customers" className="text-accent-ink hover:underline">经过人数不等于进店人数</Link></li>
                <li><Link href="/site-selection/guides/ss-05-fifteen-details" className="text-accent-ink hover:underline">看铺必须记录的 15 个细节</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
