import { ExternalLink } from 'lucide-react';
import { siteCaseData } from '@/lib/site-selection/data';

export function CaseLibrary() {
  return (
    <div>
      <div className="card mb-7 border-gold/35 bg-gold-soft/35 p-5 text-[12.8px] leading-relaxed text-ink-2">{siteCaseData.notice}</div>

      <h3 className="section-title mb-5">研究方法：连锁品牌的选址逻辑</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {siteCaseData.studies.map((c, i) => (
          <article key={c.id} className="card flex flex-col p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="num text-[11px] font-semibold text-accent">CASE {String(i + 1).padStart(2, '0')} · {c.region}</p>
                <h4 className="mt-1 text-[19px] font-semibold">{c.brand}</h4>
              </div>
              <span className="text-[10.5px] text-muted">整理于 {c.date}</span>
            </div>
            <dl className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-ink-2">
              {[
                ['选址逻辑', c.logic], ['目标客群', c.audience], ['位置特征', c.location], ['经营模型', c.model],
                ['值得借鉴', c.learn], ['小店怎么用', c.smallShop], ['不适合照搬', c.notCopy],
              ].map(([k, v]) => <div key={k}><dt className="inline font-semibold text-ink">{k}：</dt><dd className="inline">{v}</dd></div>)}
            </dl>
            <div className="mt-auto border-t border-line pt-3 text-[11.8px]">
              <p className="font-semibold text-muted">资料来源</p>
              <ul className="mt-1 space-y-1">
                {c.sources.map((s) => (
                  <li key={s.label}>
                    {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent-ink hover:underline">{s.label} <ExternalLink className="h-3 w-3" aria-hidden /></a> : <span className="text-ink-2">{s.label}</span>}
                    <span className="ml-1 text-muted">— {s.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <h3 className="section-title mb-2 mt-12">失败案例库：12 种交过的学费</h3>
      <p className="mb-5 text-[13px] text-muted">以下均为<strong>模拟案例</strong>，用于说明调查方法，不对应任何真实门店，也不是行业统计。</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {siteCaseData.failures.map((f) => (
          <details key={f.id} className="card group px-5 py-4 open:border-accent/35">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-2 text-[14.5px] font-semibold leading-snug marker:hidden">
              <span>{f.title}</span><span className="num shrink-0 text-[11px] font-normal text-muted">{f.id.toUpperCase()}</span>
            </summary>
            <div className="mt-3 space-y-2 border-t border-line pt-3 text-[12.5px] leading-relaxed text-ink-2">
              <p><strong>类型：</strong><span className="badge">{f.type}</span></p>
              <p><strong>失败原因：</strong>{f.reason}</p>
              <p><strong>早期信号：</strong>{f.signal}</p>
              <p><strong>损失来源：</strong>{f.loss}</p>
              <p><strong>正确调查方式：</strong>{f.investigation}</p>
              <p className="rounded-[8px] bg-olive-soft/45 px-3 py-2 text-olive"><strong>预防动作：</strong>{f.prevention}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
