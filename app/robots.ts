import type { MetadataRoute } from 'next';
import { fileUrl } from '@/lib/site';

// GitHub Pages 静态导出要求 metadata route 明确声明静态渲染。
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: fileUrl('/sitemap.xml'),
  };
}
