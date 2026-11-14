/** @type {import('next').NextConfig} */

// GITHUB_PAGES=true 时切换为纯静态导出；本地开发与 Node / Vercel 部署保持默认行为。
const isPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  ...(isPages && {
    output: 'export',
    basePath,
    trailingSlash: true,
  }),
};

export default nextConfig;
