import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { ArticleBrowser } from '@/components/articles/ArticleBrowser';
import { getArticleMetas } from '@/lib/content';

export const metadata: Metadata = {
  title: '全部文章 · 按经营问题读',
  description: '开店预算、选址、菜单工程、成本结构、员工管理、损耗控制、外卖利润与品牌案例：全部实战文章，支持按频道与标签筛选。',
};

export default function ArticlesPage() {
  const articles = getArticleMetas();
  const totalMinutes = articles.reduce((sum, a) => sum + a.readingMinutes, 0);

  return (
    <>
      <PageHeader
        eyebrow="全部文章 / The Archive"
        title="按问题读，不按章节背"
        description="每一篇都从真实经营问题出发，写清原因、错误做法、可执行步骤、模拟案例、公式与来源。读一篇，去店里改一件事。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-accent">{articles.length}</p>
            <p className="mt-1.5 text-[12.5px] text-muted">篇实战文章 · 约 {totalMinutes} 分钟</p>
          </div>
        )}
      />
      <section className="section-space">
        <div className="wrap">
          <ArticleBrowser articles={articles} />
        </div>
      </section>
    </>
  );
}
