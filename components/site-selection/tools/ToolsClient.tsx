'use client';

import type { SiteToolDef } from '@/lib/site-selection/types';
import { FieldVisitTool, TrafficCounterTool } from './FieldTools';
import { CompareTool, RevenueForecastTool, ScorecardTool } from './AnalysisTools';
import { LeaseTool, RentNegotiationTool } from './LeaseTools';
import { ReportTool } from './ReportTool';
import { FormulaNote } from './ToolCommon';

export function ToolsClient({ slug, tool }: { slug: string; tool: SiteToolDef }) {
  let body;
  switch (slug) {
    case 'field-visit': body = <FieldVisitTool />; break;
    case 'traffic-counter': body = <TrafficCounterTool />; break;
    case 'scorecard': body = <ScorecardTool />; break;
    case 'rent-negotiation': body = <RentNegotiationTool />; break;
    case 'revenue-forecast': body = <RevenueForecastTool />; break;
    case 'compare': body = <CompareTool />; break;
    case 'lease-checklist': body = <LeaseTool />; break;
    case 'decision-report': body = <ReportTool />; break;
    default: body = <p className="card p-6 text-[13px] text-muted">工具不存在，请返回工具箱。</p>;
  }

  return (
    <>
      {body}
      {slug !== 'decision-report' && (
        <section className="mt-8">
          <FormulaNote lines={tool.formula} note={`${tool.name} · 输出：${tool.outputs.join(' / ')}。所有公式与口径公开，结果属于经营估算，不构成投资、法律或财税建议。`} />
        </section>
      )}
    </>
  );
}
