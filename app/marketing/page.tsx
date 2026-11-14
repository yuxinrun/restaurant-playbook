import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { getArticleMetas } from '@/lib/content';
import { categories, pitfalls, tools } from '@/lib/data';

export const metadata: Metadata = {
  title: '营销增长 · 先修产品，再买流量',
  description: '开业营销、私域、短视频、点评与外卖运营、会员与复购：按漏斗拆开看，别用折扣把热闹买回来又送走。',
};

const TOPICS = categories.find((c) => c.id === 'marketing')?.topics ?? [];

const STEPS = [
  { name: '看到门店', desc: '门头、本地内容、社区合作。先让附近的人知道你在。', metric: '曝光 / 进店率' },
  { name: '进店下单', desc: '菜单可读性、价格带、首单门槛。别让顾客在点单台做阅读理解。', metric: '进店转化率' },
  { name: '第一次满意', desc: '出品稳定、出餐时间、现场补救。这段决定有没有第二次。', metric: '退菜 / 差评关键词' },
  { name: '30 天复购', desc: '具体回访场景 + 经同意的可触达渠道，而不是全场通用券。', metric: '30 天复购率' },
  { name: '长期习惯', desc: '权益少而实在，信息克制，把「路过」变成「习惯」。', metric: '会员复购 / 贡献利润' },
];

export default function MarketingPage() {
  const articles = getArticleMetas().filter((a) => ['marketing', 'cases', 'finance'].includes(a.category)).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="营销增长 / Growth"
        title="生意不好，不一定是营销不够，可能是你的菜真的不好吃"
        description="先修产品，再买流量。这一页按顾客漏斗组织：从被看见、进店、满意、复购到长期习惯，每一步都写清该看什么指标。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-accent">30<span className="text-[16px]"> 天</span></p>
            <p className="mt-1.5 text-[12.5px] text-muted">复购率的观察窗口</p>
          </div>
        )}
      />

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="The Funnel" title="往漏桶里加水，加得越快越累" description="曝光、进店、下单、复购，每一环都会掉人。不复盘就投流量，等于把预算倒进下水道。" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.name} className="card p-5">
                <span className="num text-[11px] font-semibold text-accent">0{i + 1} / 05</span>
                <h3 className="mt-3 text-[16.5px] font-semibold">{s.name}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{s.desc}</p>
                <p className="mt-4 border-t border-line pt-3 text-[11.5px] text-olive">看：{s.metric}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {TOPICS.map((t) => <span key={t} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2">{t}</span>)}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Read The Chart" title="热闹和习惯，是两条不同的曲线" description="一次开业活动能把曲线拉高，能不能留住取决于产品与服务是否稳定。以下均为演示数据。" />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard id="funnel" />
            <ChartCard id="repeat-trend" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { t: '30 天复购率', f: '首访后 30 天内再次消费人数 ÷ 同期首访人数', d: '按首访月份分组，别让新客稀释了老客的真相。' },
              { t: '单客获取成本', f: '活动与渠道总支出 ÷ 新增首访顾客数', d: '要拿复购来补，否则首访本身就是亏的。' },
              { t: '单笔贡献利润', f: '实收 − 食材 − 包装 − 佣金 − 补贴 − 随单营销', d: '活动越猛越要算，标价不是收入。' },
            ].map((x) => (
              <div key={x.t} className="card p-5">
                <h3 className="text-[15.5px] font-semibold">{x.t}</h3>
                <p className="mt-2 rounded-[8px] bg-surface-2/80 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-accent-ink">{x.f}</p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading eyebrow="Budget & Practice" title="开业第一个月，钱该花在哪儿" href="/articles/first-month-marketing" linkLabel="读完整文章" />
            <div className="card overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-surface-2/70 text-[11.5px] uppercase tracking-wider text-muted">
                  <tr><th className="px-4 py-3 font-medium">预算项</th><th className="px-4 py-3 font-medium">目的</th><th className="px-4 py-3 text-right font-medium">演示占比</th><th className="px-4 py-3 font-medium">止损线</th></tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-2">
                  {[
                    ['产品与流程验证', '试营业小范围测出品与动线', '20%', '出餐时长 / 退菜数超线即停投放'],
                    ['可触达渠道', '经同意的会员基础与物料', '20%', '只记录必要信息，权益说清楚'],
                    ['内容与被看见', '门头、菜单牌、本地内容', '25%', '按渠道记录到店归因'],
                    ['补贴与折扣', '降低首次尝试门槛', '35%', '单笔贡献利润为负即降档'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td className="px-4 py-3 font-medium text-ink">{row[0]}</td>
                      <td className="px-4 py-3">{row[1]}</td>
                      <td className="num px-4 py-3 text-right text-accent-ink">{row[2]}</td>
                      <td className="px-4 py-3 text-[12.5px] text-muted">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-line bg-surface-2/40 px-4 py-3 text-[11.5px] text-muted">占比为演示分配，不是行业建议值；请按自己的现金流与客单价调整。</p>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="card p-5 md:p-6">
              <CircleAlert className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[17px] font-semibold">营销坑：热闹散场特别快</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">用折扣买来的顾客，通常只记得折扣。先看补贴后的单笔贡献利润，再决定活动力度。</p>
              <Link href="/pitfalls#marketing" className="link-underline mt-4 text-[13px]">看完整避坑清单 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
            </div>
            <div className="card p-5 md:p-6">
              <h3 className="text-[16px] font-semibold">相关工具</h3>
              <div className="mt-3 grid gap-2">
                {tools.filter((t) => ['delivery', 'breakeven'].includes(t.slug)).map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="chip justify-between"><span>{t.name}</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                ))}
                {pitfalls.filter((p) => p.id === 'finance').map((p) => (
                  <Link key={p.id} href={`/pitfalls#${p.id}`} className="chip justify-between"><span>{p.title}</span><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-space border-t border-line bg-surface-2/30">
        <div className="wrap">
          <SectionHeading eyebrow="Keep Reading" title="把增长拆成可以复盘的动作" href="/articles" linkLabel="全部文章" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a, i) => <ArticleCard key={a.slug} article={a} index={i + 3} />)}
          </div>
        </div>
      </section>
    </>
  );
}
