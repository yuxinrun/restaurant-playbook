import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { pageUrl, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '开店不求人 · 餐饮经营实战知识库',
    template: '%s | 开店不求人',
  },
  description: '从选址、菜单、供应链，到营销、管理和利润，用真实经验和可计算的工具，帮餐饮老板把店经营明白。少讲大道理，多讲真经验；少交学费，多赚利润。',
  keywords: ['餐饮经营', '开店指南', '菜单工程', '餐饮成本', '盈亏平衡', '餐饮创业', '门店管理', '品牌案例'],
  authors: [{ name: '开店不求人编辑部' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '开店不求人',
    title: '开一家店不难，难的是一直赚钱。',
    description: '实战型餐饮经营知识平台：开店路线图、菜单与财务方法、品牌案例、计算工具与可查证的资料来源。',
    url: pageUrl('/'),
  },
  twitter: { card: 'summary_large_image', title: '开店不求人', description: '不卖开店暴富梦，只研究怎么少亏钱、多赚钱。' },
  robots: { index: true, follow: true },
  alternates: { canonical: pageUrl('/') },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF7F1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '开店不求人',
    alternateName: 'Restaurant Playbook',
    url: pageUrl('/'),
    description: '餐饮经营实战知识库',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${pageUrl('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="zh-CN">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
