'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, MessageSquareText, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: '概览', href: '/site-selection' },
  { label: '选址路线图', href: '/site-selection/roadmap' },
  { label: '实战指南', href: '/site-selection/guides' },
  { label: '现场方法', href: '/site-selection/fieldwork' },
  { label: '谈判话术', href: '/site-selection/negotiation' },
  { label: '合同与交接', href: '/site-selection/lease' },
  { label: '案例库', href: '/site-selection/cases' },
  { label: '实战工具', href: '/site-selection/tools' },
  { label: '数据图解', href: '/site-selection/charts' },
  { label: '评估报告', href: '/site-selection/reports' },
];

const MOBILE = [
  { label: '考察记录', href: '/site-selection/tools/field-visit', icon: ClipboardList },
  { label: '客流计数', href: '/site-selection/tools/traffic-counter', icon: Radar },
  { label: '租金计算', href: '/site-selection/tools/rent-negotiation', icon: Radar },
  { label: '谈判话术', href: '/site-selection/negotiation', icon: MessageSquareText },
];

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/site-selection' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <div className="border-b border-line bg-ink text-white">
        <div className="wrap-wide flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5">
          <Link href="/site-selection" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-accent text-[12px]">址</span>
            <span className="text-[13.5px]">餐饮选址实验室</span>
            <span className="hidden text-[9.5px] font-medium uppercase tracking-[0.16em] text-white/55 sm:inline">Site Selection Lab</span>
          </Link>
          <span className="hidden text-[11px] text-white/45 lg:inline">好位置不是看出来的，是调查出来的</span>
          <Link href="/guide" className="ml-auto text-[11.5px] text-white/65 transition-colors hover:text-white">← 返回开店指南</Link>
        </div>
      </div>
      <nav className="sticky top-[66px] z-40 border-b border-line bg-paper/95 backdrop-blur-xl" aria-label="选址实验室导航">
        <div className="no-scrollbar wrap-wide flex gap-1 overflow-x-auto py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors',
                isActive(item.href) ? 'bg-accent text-white' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-line bg-surface/97 backdrop-blur-xl md:hidden" aria-label="看铺现场快捷入口">
        {MOBILE.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 py-2 text-[10.5px] text-ink-2">
            <Icon className="h-4 w-4 text-accent" aria-hidden />{label}
          </Link>
        ))}
      </div>
    </>
  );
}
