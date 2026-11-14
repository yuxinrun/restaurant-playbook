import Link from 'next/link';
import { ArrowRight, Building2, ChartNoAxesCombined, ClipboardList, Handshake, MapPinned, ScanEye, TriangleAlert } from 'lucide-react';
import { siteDemo } from '@/lib/site-selection/data';
import { yuan } from '@/lib/format';

const CAPABILITIES = [
  { label: '商圈分析', icon: MapPinned },
  { label: '客流调查', icon: ScanEye },
  { label: '铺位评估', icon: Building2 },
  { label: '营业额预测', icon: ChartNoAxesCombined },
  { label: '租金谈判', icon: Handshake },
  { label: '合同避坑', icon: ClipboardList },
];

export function Hero() {
  const shop = siteDemo.shop;
  return (
    <header className="relative overflow-hidden border-b border-line bg-paper-soft/45">
      <div className="wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
        <div>
          <p className="eyebrow mb-5"><span className="eyebrow-dot" />RESTAURANT SITE SELECTION LAB · 餐饮选址实验室</p>
          <h1 className="max-w-[690px] text-[clamp(34px,5vw,58px)] font-semibold leading-[1.15] tracking-[-0.045em] text-ink">
            选址选错了，<br />后面每天都在交学费。
          </h1>
          <p className="mt-5 max-w-[600px] text-[16.5px] leading-relaxed text-ink-2 md:text-[18px]">
            从商圈调查到房东谈判，从客流测算到合同签约，把一家店的位置研究明白再掏钱。
          </p>
          <p className="mt-4 max-w-[600px] border-l-2 border-accent/45 pl-4 text-[13.5px] leading-relaxed text-muted">
            不要因为房东说这里以前生意很好，就相信这里适合你。上一个老板可能只是替你验证了这里不赚钱。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/site-selection/roadmap" className="btn-primary">我要开始选址 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="#quick-evaluate" className="btn-secondary">我手上已经有一个铺位</Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CAPABILITIES.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-[9px] border border-line bg-surface/80 px-3 py-2.5 text-[12.8px] font-medium text-ink-2">
                <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />{label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-olive/10 blur-2xl lg:block" />
          <div className="relative rounded-[16px] border border-white/10 bg-ink p-6 text-white shadow-lift md:p-7">
            <div className="flex items-start justify-between gap-3 border-b border-white/12 pb-4">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/50">Shop analysis card</p>
                <h2 className="mt-1.5 text-[18px] font-semibold">商铺分析卡</h2>
              </div>
              <span className="rounded-full border border-gold/45 bg-gold/12 px-2.5 py-1 text-[10.5px] text-gold-soft">演示案例</span>
            </div>
            <p className="mt-4 text-[13px] text-white/70">{shop.name}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {shop.tags.map((t) => <span key={t} className="rounded-md bg-white/8 px-2 py-0.5 text-[10.5px] text-white/70">{t}</span>)}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
              {[
                ['商铺面积', `${shop.area} ㎡`],
                ['月租金', yuan(shop.monthlyRent)],
                ['预估月营业额', yuan(shop.estimatedMonthlyRevenue)],
                ['租售比', `${(shop.rentToSales * 100).toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] text-white/50">{k}</dt>
                  <dd className="num mt-0.5 text-[18px] font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-[10px] border border-white/12 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-white/65">选址评分</span>
                <span className="num text-[24px] font-semibold text-gold-soft">{shop.score}<span className="ml-1 text-[12px] font-normal text-white/45">/ 100</span></span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
                <div className="h-full rounded-full bg-gold" style={{ width: `${shop.score}%` }} />
              </div>
              <p className="mt-2 text-[11.5px] text-gold-soft">{shop.scoreLabel}</p>
            </div>
            <div className="mt-5">
              <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/70"><TriangleAlert className="h-3.5 w-3.5 text-gold-soft" aria-hidden />风险提示</p>
              <ul className="mt-2 space-y-1 text-[11.5px] leading-relaxed text-white/60">
                {shop.risks.map((r) => <li key={r}>· {r}</li>)}
              </ul>
            </div>
            <p className="mt-5 border-t border-white/12 pt-3 text-[10.5px] leading-relaxed text-white/40">{siteDemo.notice}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
