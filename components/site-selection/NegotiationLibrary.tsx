'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, MessageSquareText, ShieldAlert } from 'lucide-react';
import { negotiation } from '@/lib/site-selection/data';
import { copyText } from '@/lib/site-selection/export';
import { cn } from '@/lib/utils';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) { setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
      }}
      className={cn('inline-flex shrink-0 items-center gap-1 rounded-[8px] border px-2.5 py-1.5 text-[11.5px] transition-colors',
        copied ? 'border-olive/40 bg-olive-soft text-olive' : 'border-line bg-surface text-muted hover:border-accent/40 hover:text-accent-ink')}
    >
      {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}{copied ? '已复制' : '复制话术'}
    </button>
  );
}

export function NegotiationLibrary() {
  const phases = useMemo(() => [...new Set(negotiation.stages.map((s) => s.phase))], []);
  const [phase, setPhase] = useState('全部');
  const stages = phase === '全部' ? negotiation.stages : negotiation.stages.filter((s) => s.phase === phase);

  return (
    <div>
      <div className="card mb-6 flex items-start gap-3 border-gold/35 bg-gold-soft/35 p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
        <p className="text-[13.2px] leading-relaxed text-ink-2">{negotiation.principle}</p>
      </div>

      <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-2">
        {['全部', ...phases].map((p) => (
          <button key={p} type="button" onClick={() => setPhase(p)} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors', phase === p ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-2 hover:border-accent/40')}>{p}</button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {stages.map((stage) => (
          <section key={stage.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent">{stage.phase}</p>
                <h3 className="mt-1 text-[17px] font-semibold">{stage.title}</h3>
              </div>
              <MessageSquareText className="h-4.5 w-4.5 shrink-0 text-muted" aria-hidden />
            </div>
            <div className="mt-3 space-y-3">
              {stage.lines.map((line) => (
                <div key={line.label} className="rounded-[10px] border border-line bg-surface-2/45 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="badge badge-accent">{line.label}</span>
                    <CopyButton text={line.text} />
                  </div>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">「{line.text}」</p>
                  <p className="mt-2 text-[11.8px] leading-relaxed text-muted"><strong>适用：</strong>{line.when}　<strong>可能结果：</strong>{line.effect}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const SCENE_FIELDS: { key: keyof (typeof negotiation.scenarios)[number]; label: string }[] = [
  { key: 'background', label: '场景背景' },
  { key: 'intent', label: '对方真实诉求' },
  { key: 'wrong', label: '错误谈法' },
  { key: 'strategy', label: '推荐策略' },
  { key: 'opener', label: '第一句怎么说' },
  { key: 'followup', label: '第二句怎么接' },
  { key: 'refusal', label: '对方拒绝怎么办' },
  { key: 'concessions', label: '可以让步的条件' },
  { key: 'bottomLine', label: '必须守住的底线' },
  { key: 'exitSignal', label: '退出谈判的信号' },
];

export function ScenarioLibrary() {
  const [active, setActive] = useState(0);
  const s = negotiation.scenarios[active] ?? negotiation.scenarios[0];
  return (
    <div>
      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {negotiation.scenarios.map((x, i) => (
          <button key={x.id} type="button" onClick={() => setActive(i)} className={cn('shrink-0 rounded-[10px] border px-3 py-2 text-[12.5px] font-medium transition-colors', active === i ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-2 hover:border-accent/40')}>场景 {x.id} · {x.title}</button>
        ))}
      </div>
      <div className="card p-5 md:p-7">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />SCENARIO {s.id}</p>
        <h3 className="text-[22px] font-semibold tracking-[-0.025em]">{s.title}</h3>
        <dl className="mt-5 grid gap-3 md:grid-cols-2">
          {SCENE_FIELDS.map(({ key, label }) => (
            <div key={key} className={cn('rounded-[10px] border p-4', key === 'opener' || key === 'followup' ? 'border-olive/30 bg-olive-soft/35 md:col-span-2' : key === 'bottomLine' || key === 'exitSignal' ? 'border-accent/25 bg-accent-soft/30' : 'border-line bg-surface-2/35')}>
              <dt className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                {label}
                {(key === 'opener' || key === 'followup' || key === 'refusal') && <CopyButton text={String(s[key])} />}
              </dt>
              <dd className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{String(s[key])}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
