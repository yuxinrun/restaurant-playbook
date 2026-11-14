/**
 * 构建 GitHub Pages 用的纯静态站点（输出到 out/）。
 *
 * GitHub Pages 只提供静态文件，无法运行 Route Handler；构建期间把 app/api
 * 临时移到仓库内的备份目录，构建结束（无论成功或失败）立即还原。
 * 服务端部署（npm run build / npm start）仍保留完整的只读内容 API。
 *
 * 地址默认从 GITHUB_REPOSITORY 推导，也可通过环境变量覆盖（自定义域名时
 * 显式设置 NEXT_PUBLIC_SITE_URL 与 NEXT_PUBLIC_BASE_PATH=""）。
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const [owner = 'yuxinrun', name = 'restaurant-playbook'] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const defaultSiteUrl = `https://${(owner || 'yuxinrun').toLowerCase()}.github.io/${name}`;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : `/${name}`;

const apiDir = path.join(root, 'app', 'api');
const backupDir = path.join(root, '.pages-api-backup');

// 上一次构建异常中断时，先恢复现场。
if (!fs.existsSync(apiDir) && fs.existsSync(backupDir)) fs.renameSync(backupDir, apiDir);

const hadApi = fs.existsSync(apiDir);
if (hadApi) {
  fs.rmSync(backupDir, { recursive: true, force: true });
  fs.renameSync(apiDir, backupDir);
}

let status = 1;
try {
  const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
  const result = spawnSync(process.execPath, [nextBin, 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      GITHUB_PAGES: 'true',
      NEXT_PUBLIC_SITE_URL: siteUrl,
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_TRAILING_SLASH: 'true',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  status = result.status ?? 1;

  if (status === 0) {
    fs.writeFileSync(path.join(root, 'out', '.nojekyll'), '');
    console.log(`\n静态站点已生成：out/  站点地址：${siteUrl}/`);
  }
} finally {
  if (hadApi) {
    fs.rmSync(apiDir, { recursive: true, force: true });
    fs.renameSync(backupDir, apiDir);
  }
}

process.exit(status);
