import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Database, Link2, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { linkCheck, sources, websites } from '@/lib/data';

export const metadata: Metadata = {
  title: '关于本站 · 内容规范与资料来源说明',
  description: '开店不求人的内容规范、资料来源优先级、演示数据与模拟案例标注规则、链接核验机制、技术架构与免责声明。',
};

const RULES = [
  '真实资料必须标注来源；引用品牌财务、门店数与营收时注明年份与原始披露入口。',
  '没有可靠来源的数字一律标为「演示数据」，模拟案例明确写「模拟情景」，不把假数据包装成行业平均值。',
  '不编造书籍、作者、网站、研究报告与品牌数据；无法核实出版信息的国内书目不强行收录，改以可查证的主题资料路径呈现。',
  '观点分析与原始资料分开写：本站的分析是分析，品牌与机构的表述归它们自己。',
  '不转载第三方付费文章、整本书或未经授权的电子书；书籍只做原创介绍与短篇观点摘要。',
  '国外经验说明适用条件：用工、小费、租金、平台费率与监管环境不同，不能简单照搬。',
  '涉及食品安全、消防、劳动、税务与经营许可，一律提示以所在地现行法规与监管部门意见为准。',
];

const PRIORITY = [
  ['01', '专业书籍与行业经典理论', '提供可复用的框架与计算口径，不直接给「标准比例」。'],
  ['02', '专业行业媒体与研究机构', '了解品类变化与经营实践，注意媒体口径与年份。'],
  ['03', '知名餐饮品牌公开资料', '年报、招股书、交易所公告优先于二手转述。'],
  ['04', '餐饮经营者访谈与一线经验', '用于提出问题和验证可操作性，不当作统计数据。'],
  ['05', '学术研究、行业报告与公开统计', '引用时写清统计范围、年份和发布机构。'],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="关于本站 / About"
        title="这是一个想帮老板少踩坑的网站，不是技术展示柜"
        description="我们把「不确定的内容不伪装成事实」写进流程里。下面这些内容规范，比多一个漂亮的动效重要得多。"
      />

      <section className="section-space">
        <div className="wrap grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="card p-6 md:p-8">
            <p className="eyebrow mb-3"><span className="eyebrow-dot" />What This Is</p>
            <h2 className="text-[24px] font-semibold tracking-[-0.03em]">少讲大道理，多讲真经验</h2>
            <p className="mt-4 text-[15px] leading-[1.95] text-ink-2">
              「开店不求人」是一本持续更新的餐饮经营杂志，也是一个能上手算账的知识库。它回答一个很具体的问题：如果我明天准备开一家餐饮店，今天应该学什么、怎么做、怎样避免亏钱。
            </p>
            <p className="mt-4 text-[15px] leading-[1.95] text-ink-2">
              文章从真实经营问题出发，写完原因、常见错误做法、解决方案、执行步骤、案例、公式与避坑提醒；所有计算器都能真算，公式和口径公开；图表都配一句解释和数据性质标识。
            </p>
            <p className="mt-4 font-serif text-[17px] italic leading-relaxed text-accent-ink">「房租不会因为你有梦想就便宜一点。」</p>
          </div>
          <div className="space-y-4">
            <div className="card p-5 md:p-6">
              <BookOpen className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">面向谁</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">准备开店的创业者、经营困难的老板、品牌创始人、店长与职业经理人、行业投资人，以及认真想学餐饮经营的人。</p>
            </div>
            <div className="card p-5 md:p-6">
              <Database className="h-5 w-5 text-olive" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">数据怎么标</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">演示数据、模拟情景、观点分析、真实资料四类内容分开标注。图表底部都注明数据性质与单位。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40">
        <div className="wrap">
          <SectionHeading eyebrow="Editorial Rules" title="内容规范：先把诚实写进流程" description="这些规则适用于每一篇文章、每一个案例和每一张图表。" />
          <div className="card divide-y divide-line">
            {RULES.map((r, i) => (
              <div key={r} className="flex gap-4 px-5 py-4 md:px-7">
                <span className="num mt-0.5 shrink-0 text-[12px] font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[14px] leading-[1.85] text-ink-2">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap">
          <SectionHeading eyebrow="Source Priority" title="资料从哪来，按什么顺序信" description="越靠前越适合建立方法框架，越靠后越需要核对口径与年份。" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PRIORITY.map(([n, t, d]) => (
              <div key={n} className="card p-5">
                <span className="num text-[11px] font-semibold text-accent">{n}</span>
                <h3 className="mt-2 text-[16px] font-semibold">{t}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{d}</p>
              </div>
            ))}
            <div className="card flex flex-col justify-between bg-ink p-5 text-paper">
              <p className="text-[13px] leading-relaxed text-paper/75">全站参考来源全部摊开放置，包含协会、监管机构、交易所披露、学术机构与行业媒体。</p>
              <Link href="/resources#sources" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#E7A184] hover:underline">查看 {sources.length} 条来源 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-line bg-paper-soft/40" id="links">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading eyebrow="Link Checking" title="链接是真是假，我们标出来" description="资源导航里的每个地址都来自公开可检索的官方入口；脚本逐一访问并写入报告。" />
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead className="bg-surface-2/70 text-[11.5px] uppercase tracking-wider text-muted">
                  <tr><th className="px-4 py-3 font-medium">状态</th><th className="px-4 py-3 font-medium">含义</th><th className="px-4 py-3 font-medium">页面呈现</th></tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-2">
                  <tr><td className="px-4 py-3 font-medium text-olive">已核验</td><td className="px-4 py-3">自动访问返回 2xx / 3xx</td><td className="px-4 py-3">正常展示</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gold">自动访问受限</td><td className="px-4 py-3">站点对脚本返回 403 等反爬响应</td><td className="px-4 py-3">标注「浏览器通常可正常打开」</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-accent">待人工确认</td><td className="px-4 py-3">本机网络未连通或返回错误</td><td className="px-4 py-3">标注「请以浏览器实际访问为准」</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
              最近一次核验：<strong className="text-ink-2">{linkCheck.checkedAt}</strong>，共检查 {linkCheck.total} 个地址，{linkCheck.ok} 个直接连通。重新检查请运行 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px]">npm run verify:links</code>。收录 {websites.length} 个行业网站，另有书籍、品牌与来源链接同样在检测范围内。
            </p>
          </div>
          <aside className="space-y-4">
            <div className="card p-5 md:p-6">
              <ShieldCheck className="h-5 w-5 text-olive" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">免责声明</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">本站内容为公开资料的原创整理与方法分析，不构成投资、法律、财税、医疗或食品安全建议。所有演示数据与模拟情景不对应任何真实门店。经营决策请结合自身情况并咨询本地专业人士。</p>
            </div>
            <div className="card p-5 md:p-6">
              <Link2 className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-3 text-[16px] font-semibold">面向 AI 的可读数据接口</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                内容不是硬编码在页面里：文章为 Markdown + front matter，书籍、品牌、工具、路线图等为结构化 JSON，统一经仓储层读取。只读接口 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px]">/api/content/articles</code> 可供后续 AI 检索或数据库后台接入。
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">该接口需要服务端运行时，在 Node / Vercel 部署下可用；本站的 GitHub Pages 版本为纯静态快照，不提供动态接口。</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">本站第一阶段不提供 AI 自动问答，也不让模型编造经营数据；AI 相关能力只在有可核验数据时接入。</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-space">
        <div className="wrap text-center">
          <h2 className="text-[26px] font-semibold tracking-[-0.03em]">读到这里，去挑一件明天能做的事</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-relaxed text-muted">看到这里就想全做完，通常一条也做不成。挑一条，做到下周三，再回来挑第二条。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/guide" className="btn-primary">从开店路线图开始 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/articles" className="btn-secondary">浏览全部文章</Link>
          </div>
        </div>
      </section>
    </>
  );
}
