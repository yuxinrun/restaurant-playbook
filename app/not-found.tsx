import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4"><span className="eyebrow-dot" />404 · 这桌客人没来</p>
      <h1 className="text-[clamp(34px,5vw,54px)] font-semibold tracking-[-0.04em]">这页还在后厨备着</h1>
      <p className="mt-4 max-w-[520px] text-[15.5px] text-muted">
        你找的内容可能换了地址，或者我们还没写。别急，先回首页看看今天能用上的那一条。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary"><ArrowLeft className="h-4 w-4" aria-hidden />回到首页</Link>
        <Link href="/search" className="btn-secondary">搜索全站内容</Link>
      </div>
    </div>
  );
}
