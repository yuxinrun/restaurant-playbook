/**
 * 外链核验：遍历内容数据中的全部 URL，写入 content/data/link-check.json，
 * 并回填 websites.json 的 linkStatus / statusNote。
 * 运行：npm run verify:links
 */
import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const root = process.cwd();
const dataDir = path.join(root, 'content', 'data');
const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';

const readJson = async (file) => JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));

const websites = await readJson('websites.json');
const books = await readJson('books.json');
const brands = await readJson('brands.json');
const sources = await readJson('sources.json');
const topics = await readJson('topics.json');
const articlesMeta = [];

const urls = new Set();
for (const w of websites) urls.add(w.url);
for (const b of books) { urls.add(b.officialUrl); urls.add(b.catalogUrl); }
for (const b of brands) for (const s of b.sources ?? []) if (s.url) urls.add(s.url);
for (const s of sources) if (s.url) urls.add(s.url);
for (const t of topics) for (const l of t.links ?? []) if (l.url) urls.add(l.url);
for (const a of articlesMeta) if (a.url) urls.add(a.url);

const uniqueUrls = [...urls];
console.log(`检查 ${uniqueUrls.length} 个外链…`);

async function check(url) {
  try {
    const { stdout } = await run('curl', [
      '-L', '-s', '-o', nullDevice, '-w', '%{http_code}',
      '--max-time', '12', '-A', 'Mozilla/5.0 (compatible; RestaurantPlaybookLinkChecker/1.0)', url,
    ], { timeout: 16000, windowsHide: true });
    const code = Number(stdout.trim().split(/\s+/).pop());
    return { status: Number.isFinite(code) && code > 0 ? code : 'ERR' };
  } catch {
    return { status: 'ERR' };
  }
}

const results = {};
const batchSize = 8;
for (let i = 0; i < uniqueUrls.length; i += batchSize) {
  const batch = uniqueUrls.slice(i, i + batchSize);
  const checked = await Promise.all(batch.map(check));
  batch.forEach((url, j) => { results[url] = checked[j]; });
  process.stdout.write(`  ${Math.min(i + batchSize, uniqueUrls.length)}/${uniqueUrls.length}\r`);
}

const ok = Object.values(results).filter((r) => typeof r.status === 'number' && r.status >= 200 && r.status < 400).length;
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const checkedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

await writeFile(
  path.join(dataDir, 'link-check.json'),
  `${JSON.stringify({ checkedAt, total: uniqueUrls.length, ok, results }, null, 2)}\n`,
  'utf8',
);

for (const w of websites) {
  const r = results[w.url];
  const s = r?.status;
  if (typeof s === 'number' && s >= 200 && s < 400) {
    w.linkStatus = 'verified';
    if (w.statusNote?.includes('自动检测未连通')) delete w.statusNote;
  } else if (s === 403 || s === 405 || s === 429) {
    w.linkStatus = 'partial';
    w.statusNote = '站点对自动访问返回 403，浏览器通常可正常打开；以最终访问结果为准。';
  } else {
    w.linkStatus = 'unverified';
    w.statusNote = '本机自动检测未连通（可能为网络环境限制）；请以浏览器实际访问为准。';
  }
}
await writeFile(path.join(dataDir, 'websites.json'), `${JSON.stringify(websites, null, 2)}\n`, 'utf8');

console.log(`\n完成：${ok}/${uniqueUrls.length} 直接连通，${checkedAt}`);
console.log('已更新 content/data/link-check.json 与 websites.json');
