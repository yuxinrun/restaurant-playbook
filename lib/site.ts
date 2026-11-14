/**
 * 站点 URL 配置：本地开发、独立域名部署、GitHub Pages 子路径部署共用一套规则。
 *
 * - NEXT_PUBLIC_SITE_URL：站点根地址（包含 basePath），用于 canonical / sitemap / JSON-LD
 * - NEXT_PUBLIC_BASE_PATH：子路径前缀，如 /restaurant-playbook
 * - NEXT_PUBLIC_TRAILING_SLASH：静态托管使用目录式 URL（/about/）
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

const useTrailingSlash = process.env.NEXT_PUBLIC_TRAILING_SLASH === 'true';

function normalizePage(path: string): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  if (clean === '/') return '/';
  return useTrailingSlash ? `${clean}/` : clean;
}

/** 页面绝对地址；siteUrl 已包含 basePath，不需要重复拼接。 */
export function pageUrl(path: string): string {
  return `${siteUrl}${normalizePage(path)}`;
}

/** 文件型地址，不加尾斜杠，例如 sitemap.xml。 */
export function fileUrl(path: string): string {
  return `${siteUrl}/${path.replace(/^\/+/, '')}`;
}

/** 浏览器 History API 使用的站内路径；Link / router 会自动处理 basePath，此处需要手动拼接。 */
export function browserPath(path: string): string {
  return `${basePath}${normalizePage(path)}`;
}
