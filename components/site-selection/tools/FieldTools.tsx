'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Camera, CirclePlus, Play, Square, Trash2 } from 'lucide-react';
import { SS_KEYS, useLocalState } from '@/lib/site-selection/store';
import { downloadCsv } from '@/lib/site-selection/export';
import { hourlyFromMinutes, trafficRate } from '@/lib/site-selection/calc';
import { fieldworkData } from '@/lib/site-selection/data';
import type { SiteVisit, TrafficSession } from '@/lib/site-selection/types';
import { SsChartCard } from '../SsChartCard';
import { AreaField, Fieldset, FormulaNote, Metric, NumField, SelectField, StorageNote, TextField, Toolbar } from './ToolCommon';

function emptyVisit(name = '', address = ''): SiteVisit {
  return {
    id: '', name, address, date: new Date().toISOString().slice(0, 10), weather: '晴',
    slot: '工作日午餐', tradeArea: '社区底商', area: 80, floor: '一楼', frontage: 4,
    corner: false, blocked: false, parking: '一般', transit: '', competitors: '',
    passers: 0, target: 0, crowd: '', photo: '', note: '',
  };
}

async function compressPhoto(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const max = 720;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.62));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const SLOTS = fieldworkData.rounds.map((r) => `${r.label.replace(/第.轮 · /, '')}（${r.time}）`);

export function FieldVisitTool() {
  const [visits, setVisits] = useLocalState<SiteVisit[]>(SS_KEYS.visits, []);
  const [draft, setDraft] = useState<SiteVisit>(emptyVisit());
  const [saved, setSaved] = useState(false);
  const [focusName, setFocusName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SiteVisit>(key: K, value: SiteVisit[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const names = useMemo(() => [...new Set(visits.map((v) => v.name).filter(Boolean))], [visits]);
  const compared = focusName ? visits.filter((v) => v.name === focusName) : [];

  const save = () => {
    if (!draft.name.trim()) { window.alert('先给这个铺位起个名字，方便同一铺位多次考察放在一起比较。'); return; }
    const record = { ...draft, id: draft.id || `${Date.now()}` };
    setVisits((prev) => draft.id ? prev.map((v) => v.id === draft.id ? record : v) : [...prev, record]);
    setFocusName(record.name);
    setDraft(emptyVisit(record.name, record.address));
    setSaved(true);
  };

  const exportCsv = () => downloadCsv('商铺实地考察记录', [
    ['铺位', '地址', '日期', '天气', '时段', '商圈类型', '面积㎡', '楼层', '门头宽m', '转角', '有遮挡', '停车', '公交地铁', '周边竞品', '经过人数', '目标客群人数', '人群特征', '照片', '备注'],
    ...visits.map((v) => [v.name, v.address, v.date, v.weather, v.slot, v.tradeArea, v.area, v.floor, v.frontage, v.corner ? '是' : '否', v.blocked ? '是' : '否', v.parking, v.transit, v.competitors, v.passers, v.target, v.crowd, v.photo ? '已存本机' : '', v.note]),
  ]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="eyebrow mb-2"><span className="eyebrow-dot" />现场记录</p><h2 className="text-[20px] font-semibold">到现场就填，别回店再回忆</h2></div>
          <span className="badge badge-olive">已存 {visits.length} 条</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{fieldworkData.notice}</p>

        <div className="mt-5 space-y-6">
          <Fieldset title="基础信息" hint="同一个铺位多次考察时，保持「铺位名称」一致，就能自动放在一起对比。">
            <TextField label="铺位名称" value={draft.name} onChange={(v) => set('name', v)} placeholder="例：城东社区沿街 A 铺" />
            <TextField label="地址或商圈" value={draft.address} onChange={(v) => set('address', v)} placeholder="街道 / 商圈 / 门牌" />
            <TextField label="日期" value={draft.date} onChange={(v) => set('date', v)} />
            <SelectField label="天气" value={draft.weather} onChange={(v) => set('weather', v)} options={['晴', '阴', '小雨', '大雨', '高温', '低温', '大风'].map((x) => ({ value: x, label: x }))} />
            <SelectField label="考察时段" value={draft.slot} onChange={(v) => set('slot', v)} options={SLOTS.map((x) => ({ value: x, label: x }))} className="sm:col-span-2" />
            <SelectField label="商圈类型" value={draft.tradeArea} onChange={(v) => set('tradeArea', v)} options={['社区底商', '商业街', '商场', '写字楼', '学校周边', '地铁口', '景区', '夜市', '新区', '老城区', '园区', '其他'].map((x) => ({ value: x, label: x }))} />
          </Fieldset>

          <Fieldset title="铺位条件">
            <NumField label="铺位面积（㎡）" value={draft.area} onChange={(v) => set('area', v)} min={0} />
            <TextField label="楼层" value={draft.floor} onChange={(v) => set('floor', v)} />
            <NumField label="门头宽度（m）" value={draft.frontage} onChange={(v) => set('frontage', v)} min={0} step={0.1} />
            <SelectField label="停车条件" value={draft.parking} onChange={(v) => set('parking', v)} options={['好', '一般', '差', '不允许'].map((x) => ({ value: x, label: x }))} />
            <label className="flex items-center gap-2 text-[13px] text-ink-2"><input type="checkbox" className="accent-[#C04A2B]" checked={draft.corner} onChange={(e) => set('corner', e.target.checked)} />转角铺位</label>
            <label className="flex items-center gap-2 text-[13px] text-ink-2"><input type="checkbox" className="accent-[#C04A2B]" checked={draft.blocked} onChange={(e) => set('blocked', e.target.checked)} />门头有遮挡</label>
            <TextField label="公交与地铁" value={draft.transit} onChange={(v) => set('transit', v)} placeholder="线路 / 出口 / 步行分钟" />
            <TextField label="周边竞品" value={draft.competitors} onChange={(v) => set('competitors', v)} placeholder="同类门店名称与距离" />
          </Fieldset>

          <Fieldset title="客流与人群" hint="观察不到进店人数时不要硬填；经过人数不等于目标客群。">
            <NumField label="经过人数" value={draft.passers} onChange={(v) => set('passers', v)} min={0} />
            <NumField label="有效目标客群人数" value={draft.target} onChange={(v) => set('target', v)} min={0} />
            <TextField label="人群特征" value={draft.crowd} onChange={(v) => set('crowd', v)} placeholder="上班族 / 家庭 / 学生…" className="sm:col-span-2" />
            <AreaField label="现场备注" value={draft.note} onChange={(v) => set('note', v)} placeholder="周边活动、异常情况、房东说法、待核实事项…" className="sm:col-span-2" />
          </Fieldset>

          <div className="rounded-[10px] border border-line bg-surface-2/45 p-4">
            <p className="text-[12px] font-semibold">现场照片</p>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="mt-2 block w-full text-[12px] text-muted" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) set('photo', await compressPhoto(file));
            }} />
            {draft.photo && <img src={draft.photo} alt="本次考察的现场照片" className="mt-3 max-h-40 rounded-[9px] border border-line object-cover" />}
            <p className="mt-2 flex items-center gap-1.5 text-[11.5px] leading-relaxed text-muted"><Camera className="h-3.5 w-3.5" aria-hidden />照片压缩后存在本机浏览器；请控制数量，重要照片另外存到相册。</p>
          </div>
        </div>

        <div className="mt-5"><Toolbar onSave={save} onCsv={exportCsv} onPrint={() => window.print()} onReset={() => setDraft(emptyVisit())} saved={saved} /></div>
        <div className="mt-3"><StorageNote /></div>
      </section>

      <div className="space-y-5">
        <section className="card p-5">
          <h3 className="text-[16px] font-semibold">同一铺位的多次考察对比</h3>
          <SelectField label="选择铺位" value={focusName} onChange={setFocusName} options={[{ value: '', label: names.length ? '选择一个铺位' : '还没有记录，先保存一条' }, ...names.map((n) => ({ value: n, label: n }))]} />
          {compared.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[440px] text-[12.5px]">
                <thead><tr className="border-b border-line text-left text-muted"><th className="py-2">时段</th><th>天气</th><th>经过</th><th>目标客群</th><th>占比</th><th></th></tr></thead>
                <tbody>{compared.map((v) => <tr key={v.id} className="border-b border-line/70"><td className="py-2">{v.slot}</td><td>{v.weather}</td><td className="num">{v.passers}</td><td className="num">{v.target}</td><td className="num">{trafficRate(v.target, v.passers)}%</td><td><button type="button" onClick={() => setDraft(v)} className="text-[11.5px] text-accent-ink hover:underline">编辑</button></td></tr>)}</tbody>
              </table>
              <p className="mt-3 text-[11.8px] leading-relaxed text-muted">差异大就继续加轮次，别急着平均。六轮方案见 <Link href="/site-selection/fieldwork" className="text-accent-ink hover:underline">现场方法</Link>。</p>
            </div>
          ) : <p className="mt-4 text-[12.5px] text-muted">保存记录后，这里会把同一铺位的不同时段排在一起。</p>}
        </section>

        <section className="card p-5">
          <h3 className="text-[16px] font-semibold">15 项现场检查</h3>
          <ul className="mt-3 space-y-2">{fieldworkData.details.map((d2) => <li key={d2.id} className="border-b border-line/70 pb-2 text-[12.5px] last:border-0"><strong className="font-medium">{d2.label}</strong><p className="mt-0.5 text-muted">{d2.check}</p></li>)}</ul>
        </section>
        {visits.length > 0 && <SsChartCard id="traffic-times" compact live height={240} data={{ labels: visits.slice(-8).map((v) => v.slot.slice(0, 4)), passers: visits.slice(-8).map((v) => v.passers), target: visits.slice(-8).map((v) => v.target) }} note="来自你保存的考察记录 · 时段顺序按保存顺序" />}
        <button type="button" onClick={() => { setVisits([]); setFocusName(''); }} className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-accent"><Trash2 className="h-3.5 w-3.5" aria-hidden />清空全部考察记录</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 客流统计器 */

const emptySession = (): TrafficSession => ({ id: '', name: '', startedAt: 0, endedAt: 0, passers: 0, target: 0, competitorIn: 0, ownIn: 0, buckets: [] });

export function TrafficCounterTool() {
  const [sessions, setSessions] = useLocalState<TrafficSession[]>(SS_KEYS.traffic, []);
  const [current, setCurrent] = useState<TrafficSession>(emptySession());
  const [saved, setSaved] = useState(false);
  const running = current.startedAt > 0 && current.endedAt === 0;

  const tap = (key: 'passers' | 'target' | 'competitorIn' | 'ownIn') => {
    setSaved(false);
    setCurrent((prev) => {
      const now = Date.now();
      const start = prev.startedAt || now;
      const index = Math.max(0, Math.floor((now - start) / (15 * 60 * 1000)));
      const buckets = [...prev.buckets];
      while (buckets.length <= index) buckets.push({ label: `${buckets.length * 15}–${(buckets.length + 1) * 15} 分`, passers: 0, target: 0 });
      const b = buckets[index];
      const deltaP = key === 'passers' ? 1 : 0;
      const deltaT = key === 'target' ? 1 : 0;
      buckets[index] = { ...b, passers: b.passers + deltaP, target: b.target + deltaT };
      return { ...prev, startedAt: start, [key]: prev[key] + 1, buckets };
    });
  };

  const stop = () => setCurrent((prev) => ({ ...prev, endedAt: Date.now() }));

  const saveSession = () => {
    if (!current.startedAt) { window.alert('先点一次计数，本轮就自动开始计时。'); return; }
    const record = { ...current, id: `${Date.now()}`, name: current.name || `${new Date(current.startedAt).toLocaleDateString('zh-CN')} 现场计数`, endedAt: current.endedAt || Date.now() };
    setSessions((prev) => [...prev, record]);
    setCurrent(emptySession());
    setSaved(true);
  };

  const elapsedMin = current.startedAt ? Math.max(1, ((current.endedAt || Date.now()) - current.startedAt) / 60000) : 0;
  const hourly = hourlyFromMinutes(current.passers, elapsedMin);
  const weekday = sessions.filter((s) => { const day = new Date(s.startedAt).getDay(); return day >= 1 && day <= 5; });
  const weekend = sessions.filter((s) => { const day = new Date(s.startedAt).getDay(); return day === 0 || day === 6; });
  const sum = (list: TrafficSession[], key: keyof TrafficSession) => list.reduce((n, s) => n + (typeof s[key] === 'number' ? s[key] as number : 0), 0);

  const exportCsv = () => downloadCsv('客流统计记录', [
    ['轮次名称', '开始时间', '结束时间', '观察分钟', '经过人数', '目标客群', '竞品进店', '本店进店', '目标客群占比%'],
    ...sessions.map((s) => [s.name, new Date(s.startedAt).toLocaleString('zh-CN'), new Date(s.endedAt).toLocaleString('zh-CN'), Math.round((s.endedAt - s.startedAt) / 60000), s.passers, s.target, s.competitorIn, s.ownIn, trafficRate(s.target, s.passers)]),
    ['15 分钟分桶'],
    ...sessions.flatMap((s) => s.buckets.map((b) => [s.name, b.label, '', '', b.passers, b.target])),
  ]);

  const buttons = [
    { key: 'passers' as const, label: '经过人数 +1', tone: 'bg-ink text-white' },
    { key: 'target' as const, label: '目标客群 +1', tone: 'bg-accent text-white' },
    { key: 'competitorIn' as const, label: '竞品进店 +1', tone: 'bg-gold text-white' },
    { key: 'ownIn' as const, label: '本店进店 +1', tone: 'bg-olive text-white' },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
      <section className="card p-5 md:p-6">
        <p className="eyebrow mb-2"><span className="eyebrow-dot" />手机优先 · 现场点按</p>
        <h2 className="text-[20px] font-semibold">点一下，记一个数</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">观察不到进店人数就只记经过人数，不强制填写。每 15 分钟自动分桶，开始与结束时间自动记录。</p>

        <div className="mt-4"><TextField label="本轮名称（可留空）" value={current.name} onChange={(v) => setCurrent((p) => ({ ...p, name: v }))} placeholder="例：周三午餐 · A 铺门前" /></div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {buttons.map(({ key, label, tone }) => (
            <button key={key} type="button" onClick={() => tap(key)} className={`rounded-[12px] px-3 py-5 text-[14px] font-semibold shadow-hair transition-transform active:scale-[0.97] ${tone}`}>
              <CirclePlus className="mx-auto mb-1.5 h-5 w-5" aria-hidden />{label}
              <span className="num mt-1 block text-[22px] leading-none">{current[key]}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] ${running ? 'bg-olive-soft text-olive' : 'bg-surface-2 text-muted'}`}>
            {running ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Square className="h-3.5 w-3.5" aria-hidden />}
            {current.startedAt ? `${new Date(current.startedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} 起 · ${Math.round(elapsedMin)} 分钟${current.endedAt ? ' · 已结束' : ' · 进行中'}` : '点第一次计数即开始计时'}
          </span>
          {running && <button type="button" onClick={stop} className="btn-secondary text-[12.5px]">结束本轮</button>}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="目标客群占比" value={`${trafficRate(current.target, current.passers)}%`} hint="目标客群 ÷ 经过人数" />
          <Metric label="折算每小时客流" value={`${hourly} 人`} hint="按实际观察分钟折算" />
          <Metric label="15 分钟分桶" value={`${current.buckets.length} 段`} hint="每满 15 分钟自动新起一段" />
          <Metric label="已保存轮次" value={`${sessions.length} 轮`} hint="建议覆盖六轮" />
        </div>

        <div className="mt-5"><Toolbar onSave={saveSession} onCsv={exportCsv} onPrint={() => window.print()} onReset={() => setCurrent(emptySession())} saved={saved} /></div>
        <div className="mt-3"><StorageNote /></div>
      </section>

      <div className="space-y-5">
        <SsChartCard id="traffic-times" live height={250} compact title="本轮 15 分钟客流" data={{ labels: current.buckets.map((b) => b.label.replace(' 分', '')), passers: current.buckets.map((b) => b.passers), target: current.buckets.map((b) => b.target) }} note="来自你本轮点按的真实计数" />
        <SsChartCard id="traffic-weekday" live compact height={250} title="已保存轮次：工作日 vs 周末" data={{ labels: ['经过', '目标客群', '竞品进店', '本店进店'], weekday: [sum(weekday, 'passers'), sum(weekday, 'target'), sum(weekday, 'competitorIn'), sum(weekday, 'ownIn')], weekend: [sum(weekend, 'passers'), sum(weekend, 'target'), sum(weekend, 'competitorIn'), sum(weekend, 'ownIn')] }} note="来自你保存的计数轮次；样本不足时不要下结论" />
        <SsChartCard id="audience-pie" live compact height={250} title="目标客群占比" data={{ audience: [{ name: '目标客群', value: trafficRate(sum(sessions, 'target'), sum(sessions, 'passers')) }, { name: '其他经过人群', value: Math.max(0, 100 - trafficRate(sum(sessions, 'target'), sum(sessions, 'passers'))) }] }} note="来自你保存的计数轮次" />
        <FormulaNote lines={['目标客群占比 = 目标客群人数 ÷ 经过人数 × 100%', '每小时客流 = 观察人数 × 60 ÷ 实际观察分钟数', '有效目标客群 = 经过人数中符合你品类/客单/时段画像的人']} note="不要把经过人数直接当成潜在顾客；一次观察不能代表一周。样本量与天气、周边活动都要记录。" />
        {sessions.length > 0 && <button type="button" onClick={() => setSessions([])} className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-accent"><Trash2 className="h-3.5 w-3.5" aria-hidden />清空已保存轮次</button>}
      </div>
    </div>
  );
}
