'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchDialog } from './SearchDialog';

const NAV = [
  { label: '首页', href: '/' },
  { label: '选址实验室', href: '/site-selection' },
  { label: '开店指南', href: '/guide' },
  { label: '经营管理', href: '/operations' },
  { label: '菜单与产品', href: '/menu' },
  { label: '营销增长', href: '/marketing' },
  { label: '数据与财务', href: '/finance' },
  { label: '品牌案例', href: '/brands' },
  { label: '书籍与资源', href: '/resources' },
  { label: '实用工具', href: '/tools' },
];

const MORE = [
  { label: '避坑指南', href: '/pitfalls' },
  { label: '全部文章', href: '/articles' },
  { label: '我的收藏', href: '/favorites' },
  { label: '关于本站', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
      if (((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[110] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-ink">跳到正文</a>
      <header className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        stuck ? 'border-line bg-paper/92 shadow-hair backdrop-blur-xl' : 'border-transparent bg-paper/72 backdrop-blur-md',
      )}>
        <div className="wrap-wide flex h-[66px] items-center gap-3">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="开店不求人 · 首页">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-accent text-[17px] font-bold text-white shadow-hair transition-transform duration-300 group-hover:-rotate-6">
              开
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[16px] font-bold tracking-[-0.02em] text-ink">开店不求人</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">Restaurant Playbook</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="主导航">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-2.5 py-2 text-[12.8px] font-medium transition-colors duration-200 whitespace-nowrap xl:px-3',
                  isActive(item.href) ? 'bg-surface text-ink shadow-hair' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-line bg-surface px-2.5 text-[12.5px] text-muted transition-all hover:border-accent/40 hover:text-accent-ink md:px-3"
              aria-label="打开全站搜索"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden md:inline">搜索</span>
              <kbd className="hidden rounded border border-line bg-surface-2 px-1 text-[10px] md:inline">/</kbd>
            </button>
            <Link href="/favorites" className="hidden h-9 w-9 place-items-center rounded-[10px] border border-line bg-surface text-muted transition-colors hover:text-accent-ink sm:grid" aria-label="我的收藏">
              <Bookmark className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-surface text-ink lg:hidden"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4.5 w-4.5" aria-hidden /> : <Menu className="h-4.5 w-4.5" aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line bg-surface/98 backdrop-blur-xl lg:hidden">
            <nav className="wrap grid grid-cols-2 gap-1 py-4" aria-label="移动端导航">
              {[...NAV, ...MORE].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[9px] px-3 py-2.5 text-[14px] transition-colors',
                    isActive(item.href) ? 'bg-accent-soft font-semibold text-accent-ink' : 'text-ink-2 hover:bg-surface-2',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
