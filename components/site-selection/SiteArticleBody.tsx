'use client';

import { Fragment, useMemo, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { SsChartCard } from './SsChartCard';
import { siteTools } from '@/lib/site-selection/data';
import { slugifyId } from '@/lib/utils';

function collectHeadingIds(body: string): Map<string, string> {
  const map = new Map<string, string>();
  let index = 0;
  for (const line of body.split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (match) {
      index += 1;
      map.set(match[2].replace(/[*_`]/g, ''), `sec-${index}`);
    }
  }
  return map;
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) return textOf((node as { props: { children?: ReactNode } }).props.children);
  return '';
}

type Block = { kind: 'markdown' | 'chart' | 'tool'; value: string };

/** 支持 [[sschart:图表ID]] 与 [[sstool:工具slug]] 两种模块内嵌标记。 */
function splitBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join('\n').trim();
    if (text) blocks.push({ kind: 'markdown', value: text });
    buffer = [];
  };
  for (const line of body.split('\n')) {
    const m = /^\[\[(sschart|sstool):([a-z0-9-]+)\]\]\s*$/.exec(line.trim());
    if (m) {
      flush();
      blocks.push({ kind: m[1] === 'sschart' ? 'chart' : 'tool', value: m[2] });
    } else buffer.push(line);
  }
  flush();
  return blocks;
}

function ToolInline({ slug }: { slug: string }) {
  const tool = siteTools.find((t) => t.slug === slug);
  if (!tool) return null;
  return (
    <div className="my-7 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-olive/30 bg-olive-soft/40 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-surface text-olive"><Calculator className="h-4.5 w-4.5" aria-hidden /></span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive">配套工具 · 可以真算</p>
          <p className="mt-0.5 text-[15px] font-semibold text-ink">{tool.name}</p>
        </div>
      </div>
      <Link href={`/site-selection/tools/${tool.slug}`} className="btn-secondary text-[12.5px]">打开工具 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
    </div>
  );
}

export function SiteArticleBody({ body }: { body: string }) {
  const blocks = useMemo(() => splitBlocks(body), [body]);
  const headingIds = useMemo(() => collectHeadingIds(body), [body]);
  const components = useMemo<Components>(() => ({
    h2: ({ children }) => <h2 id={headingIds.get(textOf(children)) ?? slugifyId(textOf(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={headingIds.get(textOf(children)) ?? slugifyId(textOf(children))}>{children}</h3>,
    a: ({ href, children }) => href?.startsWith('/')
      ? <Link href={href}>{children}</Link>
      : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  }), [headingIds]);

  return (
    <div className="prose-editorial">
      {blocks.map((block, i) => (
        <Fragment key={`${block.kind}-${i}`}>
          {block.kind === 'markdown' && <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{block.value}</ReactMarkdown>}
          {block.kind === 'chart' && <div className="my-8"><SsChartCard id={block.value} compact height={260} /></div>}
          {block.kind === 'tool' && <ToolInline slug={block.value} />}
        </Fragment>
      ))}
    </div>
  );
}
