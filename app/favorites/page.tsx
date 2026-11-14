import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { FavoritesClient } from '@/components/favorites/FavoritesClient';
import { getArticleMetas } from '@/lib/content';

export const metadata: Metadata = {
  title: '我的收藏 · 下次开店前再翻一遍',
  description: '查看本机收藏的餐饮经营实战文章。收藏保存在浏览器本地，不上传服务器。',
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <>
      <PageHeader
        eyebrow="我的收藏 / Bookmarks"
        title="收进这里的，都是打算真用的"
        description="收藏是本地的、安静的、不打扰的。没有账号，没有推送，也没有「猜你喜欢」。"
      />
      <section className="section-space">
        <div className="wrap">
          <FavoritesClient articles={getArticleMetas()} />
        </div>
      </section>
    </>
  );
}
