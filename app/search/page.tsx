import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchClient } from '@/components/search/SearchClient';
import { buildSearchIndex } from '@/lib/search-index.server';

export const metadata: Metadata = {
  title: '全站搜索 · 按经营问题找答案',
  description: '搜索文章、书籍、网站资源、品牌案例、经营工具与关键词标签，支持模糊匹配、分类筛选与标签筛选。',
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  const docs = buildSearchIndex();

  return (
    <>
      <PageHeader
        eyebrow="全站搜索 / Find It"
        title="你现在最想解决什么经营问题？"
        description="不用先学一套理论。输入一个词、一句问题，或者直接点热门搜索，我们把相关内容都翻出来。"
        aside={(
          <div className="card px-6 py-5">
            <p className="num text-[34px] font-semibold leading-none text-accent">{docs.length}</p>
            <p className="mt-1.5 text-[12.5px] text-muted">条内容可检索</p>
          </div>
        )}
      />
      <section className="section-space">
        <div className="wrap">
          <SearchClient docs={docs} />
        </div>
      </section>
    </>
  );
}
