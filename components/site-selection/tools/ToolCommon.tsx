'use client';

import type { ReactNode } from 'react';
import { Download, Printer, RotateCcw, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseField { label: string; hint?: string; className?: string }

export function NumField({ label, value, onChange, min, max, step = 1, hint, className }: BaseField & { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className={cn('block', className)}>
      <span className="field-label">{label}</span>
      <input type="number" className="field-input" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <span className="mt-1 block text-[11px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}

export function TextField({ label, value, onChange, placeholder, hint, className }: BaseField & { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="field-label">{label}</span>
      <input type="text" className="field-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-[11px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}

export function AreaField({ label, value, onChange, placeholder, className }: BaseField & { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="field-label">{label}</span>
      <textarea className="field-input min-h-[78px] resize-y" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, className }: BaseField & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className={cn('block', className)}>
      <span className="field-label">{label}</span>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Fieldset({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-5 first:border-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{title}</p>
      {hint && <p className="-mt-2 mb-3 text-[11.8px] leading-relaxed text-muted">{hint}</p>}
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function Metric({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'good' | 'warn' | 'bad' }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface-2/45 px-4 py-3">
      <p className="text-[11.5px] text-muted">{label}</p>
      <p className={cn('num mt-1 text-[19px] font-semibold', tone === 'good' ? 'text-olive' : tone === 'bad' ? 'text-accent' : tone === 'warn' ? 'text-gold' : 'text-ink')}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-muted">{hint}</p>}
    </div>
  );
}

export function Toolbar({ onCsv, onPrint, onSave, onReset, saved }: { onCsv?: () => void; onPrint?: () => void; onSave?: () => void; onReset?: () => void; saved?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 no-print">
      {onSave && <button type="button" onClick={onSave} className="btn-secondary text-[12.5px]"><Save className="h-3.5 w-3.5" aria-hidden />{saved ? '已保存到本机' : '保存到本机'}</button>}
      {onCsv && <button type="button" onClick={onCsv} className="btn-secondary text-[12.5px]"><Download className="h-3.5 w-3.5" aria-hidden />导出 CSV（Excel 可打开）</button>}
      {onPrint && <button type="button" onClick={onPrint} className="btn-secondary text-[12.5px]"><Printer className="h-3.5 w-3.5" aria-hidden />打印 / 存 PDF</button>}
      {onReset && <button type="button" onClick={onReset} className="rounded-[9px] border border-line bg-surface px-3 py-2 text-[12.5px] text-muted hover:text-ink"><RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden />重置</button>}
    </div>
  );
}

export function FormulaNote({ lines, note }: { lines: string[]; note?: string }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface-2/50 p-4">
      <p className="text-[12px] font-semibold">公式与口径</p>
      <ul className="mt-2 space-y-1 font-mono text-[11.8px] leading-relaxed text-accent-ink">{lines.map((l) => <li key={l}>{l}</li>)}</ul>
      {note && <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

export function StorageNote({ text }: { text?: string }) {
  return <p className="text-[11.5px] leading-relaxed text-muted">{text ?? '数据只保存在你当前浏览器的 localStorage，不上传、不跨设备同步；清浏览器数据会丢失，重要记录请自行导出。'}</p>;
}
