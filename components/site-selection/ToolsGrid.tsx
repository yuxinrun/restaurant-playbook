import Link from 'next/link';
import { ArrowRight, ClipboardList, Columns3, FileCheck2, Handshake, Radar, ReceiptText, ScanLine, TrendingUp } from 'lucide-react';
import { siteTools } from '@/lib/site-selection/data';

const ICONS: Record<string, typeof Radar> = {
  clipboard: ClipboardList, counter: ScanLine, radar: Radar, handshake: Handshake,
  trend: TrendingUp, columns: Columns3, 'file-check': FileCheck2, report: ReceiptText,
};

export function ToolsGrid({ compact }: { compact?: boolean }) {
  const list = compact ? siteTools.slice(0, 6) : siteTools;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((tool, i) => {
        const Icon = ICONS[tool.icon] ?? Radar;
        return (
          <Link key={tool.slug} href={`/site-selection/tools/${tool.slug}`} className="card-interactive group flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-accent-soft text-accent-ink"><Icon className="h-5 w-5" aria-hidden /></span>
              <span className="num text-[11px] text-muted">TOOL {String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-4 text-[17.5px] font-semibold tracking-[-0.02em] group-hover:text-accent-ink">{tool.name}</h3>
            <p className="mt-1 text-[12.5px] font-medium text-accent-ink">{tool.short}</p>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{tool.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {tool.outputs.slice(0, 3).map((o) => <span key={o} className="badge">{o}</span>)}
              {tool.outputs.length > 3 && <span className="badge">+{tool.outputs.length - 3}</span>}
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3 text-[12.5px] font-medium text-accent-ink">打开工具 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden /></span>
          </Link>
        );
      })}
    </div>
  );
}
