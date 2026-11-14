import { Hero } from '@/components/home/Hero';
import { MetricStrip } from '@/components/home/MetricStrip';
import { ChannelGrid } from '@/components/home/ChannelGrid';
import { EditorsPicks } from '@/components/home/EditorsPicks';
import { ChartShowcase } from '@/components/home/ChartShowcase';
import { ProblemFinder, PitfallTeaser, ToolTeaser, ResourceTeaser, ClosingNote } from '@/components/home/Discovery';
import { RoadmapExplorer } from '@/components/guide/RoadmapExplorer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getArticleMetas } from '@/lib/content';
import { books, brands, categories, picks, roadmap, tools } from '@/lib/data';

export default function HomePage() {
  const articles = getArticleMetas();
  const feature = articles.find((a) => a.slug === picks.mustRead) ?? articles[0];
  const articleTitles = Object.fromEntries(articles.map((a) => [a.slug, a.title]));
  const toolTitles = Object.fromEntries(tools.map((t) => [t.slug, t.name]));

  if (!feature) return null;

  return (
    <>
      <Hero
        feature={feature}
        counts={{ articles: articles.length, channels: categories.length, tools: tools.length, brands: brands.length, books: books.length }}
      />
      <MetricStrip />

      <section className="section-space border-y border-line">
        <div className="wrap">
          <SectionHeading
            eyebrow="从零开店路线图 / The Roadmap"
            title="12 个阶段，按顺序来，别跳步"
            description="每个阶段都写清了学习目标、核心任务、常见错误、推荐文章和实用工具。点开一个阶段看看，进度会存在你自己的浏览器里。"
            href="/guide"
            linkLabel="进入完整开店指南"
          />
          <RoadmapExplorer stages={roadmap} articleTitles={articleTitles} toolTitles={toolTitles} />
        </div>
      </section>

      <ChannelGrid />
      <EditorsPicks />
      <ChartShowcase />
      <ProblemFinder />
      <PitfallTeaser />
      <ToolTeaser />
      <ResourceTeaser />
      <ClosingNote />
    </>
  );
}
