import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categories, linkCheck } from '@/lib/data';

const GUIDE_LINKS = [
  { label: '开店路线图', href: '/guide' },
  { label: '避坑指南', href: '/pitfalls' },
  { label: '全部文章', href: '/articles' },
  { label: '我的收藏', href: '/favorites' },
  { label: '全站搜索', href: '/search' },
];

const TOOL_LINKS = [
  { label: '投资回报计算器', href: '/tools/roi' },
  { label: '菜品定价计算器', href: '/tools/pricing' },
  { label: '盈亏平衡计算器', href: '/tools/breakeven' },
  { label: '外卖利润计算器', href: '/tools/delivery' },
  { label: '全部工具', href: '/tools' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-soft/50">
      <div className="wrap py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="开店不求人首页">
              <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-accent text-[17px] font-bold text-white">开</span>
              <span className="text-[16px] font-bold tracking-[-0.02em]">开店不求人</span>
            </Link>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed text-muted">
              少讲大道理，多讲真经验；少交学费，多赚利润。一本持续更新的餐饮经营杂志，也是一个能上手算账的知识库。
            </p>
            <p className="mt-5 font-serif text-[15px] italic text-accent-ink">「不卖开店暴富梦，只研究怎么少亏钱、多赚钱。」</p>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">知识频道</h3>
            <ul className="space-y-2 text-[13.5px]">
              {categories.map((c) => (
                <li key={c.id}><Link href={c.href} className="text-ink-2 transition-colors hover:text-accent-ink">{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">从问题出发</h3>
            <ul className="space-y-2 text-[13.5px]">
              {GUIDE_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-ink-2 transition-colors hover:text-accent-ink">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">算一算再决定</h3>
            <ul className="space-y-2 text-[13.5px]">
              {TOOL_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-ink-2 transition-colors hover:text-accent-ink">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[12px] text-muted md:flex-row md:items-start md:justify-between">
          <div className="max-w-[740px] space-y-1.5">
            <p>本站内容为公开资料的原创整理与方法分析。所有未标注来源的数字均为演示数据或模拟案例，不是行业平均值，也不构成投资、法律、财税或食品安全建议。</p>
            <p>涉及食品安全、消防、劳动、税务与经营许可事项，请以所在地现行法规及监管部门要求为准。国外经验请结合本地市场条件判断。</p>
            <p className="inline-flex items-center gap-1">外链核验：<span className="font-medium text-ink-2">{linkCheck.checkedAt}</span> · <Link href="/about#links" className="inline-flex items-center gap-0.5 hover:text-accent-ink">查看说明<ArrowUpRight className="h-3 w-3" aria-hidden /></Link></p>
          </div>
          <p className="shrink-0 text-[11.5px] md:text-right">© {new Date().getFullYear()} 开店不求人<br />Restaurant Playbook</p>
        </div>
      </div>
    </footer>
  );
}
