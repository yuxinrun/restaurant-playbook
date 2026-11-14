import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteNav } from '@/components/site-selection/SiteNav';
import { pageUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: { default: '餐饮选址实验室 · 开店不求人', template: '%s | 餐饮选址实验室' },
  description: '从商圈调查、客流统计、营业额预测到租金谈判与合同审查，用 16 步流程、20 篇实战文章和 8 个可保存的选址工具，把铺位研究明白再掏钱。',
  alternates: { canonical: pageUrl('/site-selection') },
};

export default function SiteSelectionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
      <div className="h-14 md:hidden" aria-hidden />
    </>
  );
}
