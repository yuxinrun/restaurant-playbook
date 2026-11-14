# 开店不求人 · Restaurant Playbook

> 少讲大道理，多讲真经验；少交学费，多赚利润。

一个面向餐饮创业者、老板、店长与从业者的**实战型经营知识网站**：持续更新的杂志式首页、19 篇完整实战长文、6 大知识频道、20 个品牌案例、11 本书籍笔记、20 个行业网站导航、7 条主题阅读路径、12 类避坑指南、13 类 ECharts 图表、6 个可实时计算的经营工具，以及全站搜索、收藏、分享、阅读进度与字号调节。

**这里不卖开店暴富梦，只研究怎么少亏钱、多赚钱。**

线上站点：<https://yuxinrun.github.io/restaurant-playbook/>（推送 `main` 自动部署）

---

## 快速开始

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。Node.js ≥ 20（推荐 22）。

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` / `npm start` | 生产构建 / 启动（含只读内容 API） |
| `npm run build:pages` | 生成 GitHub Pages 静态站点到 `out/` |
| `npm run typecheck` | TypeScript 严格类型检查 |
| `npm test` | 计算内核单元测试（16 个用例） |
| `npm run verify:links` | 批量核验外链，写回 `link-check.json` 与网站状态 |

## 技术栈

- **Next.js 15 App Router + React 19 + TypeScript（strict）**：页面默认静态生成，交互区域拆成客户端组件
- **Tailwind CSS 3**：设计 Token 统一定义在 `app/globals.css` 的 CSS 变量中，`tailwind.config.ts` 用 `rgb(var(--token) / <alpha-value>)` 映射，支持透明度
- **Apache ECharts 5**：`echarts/core` 按需注册图表类型，由 `next/dynamic` + `ssr: false` 懒加载；轻量骨架 `ChartSkeleton` 独立拆分，图表库不进入首屏包
- **内容**：Markdown（`gray-matter` 解析 front matter，`react-markdown` + `remark-gfm` 渲染）+ 结构化 JSON；页面通过 `lib/cms/repository.ts` 仓储层访问，不直接依赖文件
- **正文嵌入**：文章里用 `[[chart:图表ID]]` 插图、`[[tool:工具slug]]` 插计算器，由 `MarkdownBody` 解析
- **搜索**：本地全文索引（服务端构建 `lib/search-index.server.ts`，客户端模糊匹配 / 分类 / 标签筛选 / 高亮）
- **交互**：`localStorage` 保存收藏、最近搜索、开店路线图进度与正文字号；无账号、无埋点、不上传个人信息
- **UI**：Lucide Icons + 自建设计系统组件（`components/ui/`），不引入重量级组件库；封面为本站生成的抽象 SVG，不依赖外部图片或字体
- **SEO**：逐页 Metadata / Open Graph / canonical、`sitemap.xml`、`robots.txt`、WebSite 与 Article JSON-LD；所有绝对地址由 `lib/site.ts` 统一生成，兼容子路径部署

## 内容地图

19 篇文章按经营问题组织，都能独立读完并用上一件事。

| 频道 | 文章 |
| --- | --- |
| 开店之前 | [30㎡ 开店预算](content/articles/budget-30sqm.md) · [选址最容易犯的 5 个错误](content/articles/site-selection-mistakes.md) · [商圈值不值得开店](content/articles/trade-area-check.md) |
| 产品与菜单 | [菜单不是菜品清单，而是一台赚钱机器](content/articles/menu-profit-machine.md) |
| 门店运营 | [食材损耗控制](content/articles/food-waste-control.md) · [小团队管理制度](content/articles/small-team-rules.md) · [厨房出菜太慢怎么办](content/articles/slow-kitchen.md) · [排班表其实是财务表](content/articles/labor-scheduling.md) · [净料率、账期与供应商](content/articles/supplier-and-purchasing.md) |
| 营销增长 | [开业第一个月，钱该花在哪儿](content/articles/first-month-marketing.md) · [复购率上不去](content/articles/repeat-purchase.md) · [评分掉了，差评该怎么救](content/articles/reviews-and-reputation.md) |
| 财务与数据 | [看着生意不错，最后还是倒闭](content/articles/busy-but-broke.md) · [必须搞懂的 8 个经营指标](content/articles/eight-metrics.md) · [毛利率 80% 为什么还是没钱](content/articles/gross-margin-trap.md) · [外卖单笔贡献利润](content/articles/delivery-profit.md) · [13 周现金流表](content/articles/cashflow-13-weeks.md) |
| 品牌案例 | [从麦当劳和 Chipotle 学什么](content/articles/mcdonalds-chipotle.md) · [第二家店什么时候开才不是赌](content/articles/second-store-checklist.md) |

配套内容：20 个品牌统一 12 节结构拆解、11 本书原创笔记、20 个行业网站导航、7 条主题阅读路径、12 类避坑指南、12 阶段开店路线图、10 个热门经营问题与 6 个计算器。

## 餐饮选址实验室（独立频道）

入口 `/site-selection/`，主站顶栏有「选址实验室」入口。定位是**选址决策与谈判工具平台**，不是普通文章栏目：复用主站的 `PageHeader` / `SectionHeading` / `ArticleCover` / `EChart`、设计 Token、Markdown 内容结构与 `lib/calculators.ts` 的租金承受力逻辑，不重建网站，也不重复开发已有计算器。

| 路由 | 内容 |
| --- | --- |
| `/site-selection/` | 独立首页：16 步路线图、快速评估、避坑精选、16 主题、工具与演示图表 |
| `/roadmap` | 16 步流程，每步含目标 / 任务 / 方法 / 数据 / 工具 / 常见错误 / 通过标准，进度可勾选保存 |
| `/guides` · `/guides/<slug>` | 20 篇深度文章，支持主题筛选、目录、字号、复制与打印 |
| `/fieldwork` | 六轮调查排期、15 项铺位细节、12 个记录字段与四个客流口径 |
| `/negotiation` | 16 阶段 × 3 种风格话术 + 7 个完整场景，一键复制 |
| `/lease` | 22 项合同检查，可勾选、备注、标待核实、导出 CSV，附交房与开业倒排 |
| `/cases` | 品牌选址研究、12 类模拟失败案例、13 类场景与 12 类品类矩阵 |
| `/tools` · `/tools/<slug>` | 8 个实战工具，公式公开、输入实时更新、图表随数据变化 |
| `/charts` | 12 类 ECharts 图表的口径说明与演示 |
| `/reports` | 汇总本机数据生成《餐饮店铺选址评估报告》，支持打印 / PDF、CSV、JSON |

**内容结构**：`content/site-selection/*.json` 存放主题、路线图、工具元数据、话术、案例、合同清单、现场方法、场景矩阵与演示数据；`content/site-selection/articles/*.md` 是 20 篇正文。文章 front matter 用 `title, subtitle, summary, topic, order, tags, readingMinutes, publishedAt, updatedAt, charts, tools, sources, seoDescription`；`topic` 取 `topics.json` 中的 id。正文可插入 `[[sschart:图表ID]]`（ID 见 `lib/site-selection/charts.ts` 的 `SITE_CHART_IDS`）与 `[[sstool:工具slug]]`，与渲染器 `SiteArticleBody` 对应。

**数据与计算**：`lib/site-selection/calc.ts` 是不依赖 DOM 的纯函数内核；`store.ts` 用 `localStorage`（键集中在 `SS_KEYS`）保存路线图进度、考察记录、客流、评分、租金方案、预测、候选铺位与合同核查，第一阶段无账号、不上传；`export.ts` 提供 CSV / JSON 下载、话术复制与打印。`reports` 页自动汇总这些数据，缺失项明确列为待核实，不替用户补数字。清理浏览器数据会清空记录，重要数据请导出留档。

**静态导出兼容**：`/guides?topic=` 的参数读取被隔离在 `GuidesBrowser` 内部的 Suspense 子组件中，文章列表正文仍会完整预渲染；`sitemap.ts` 与 `lib/search-index.server.ts` 已收录该频道的页面、文章与工具。

## 新增一篇文章

1. 在 `content/articles/` 新建 `<slug>.md`，front matter 字段：`title, subtitle, summary, category, tags, author, publishedAt, updatedAt, readingMinutes, featured, cover, coverTone, chart, relatedTools, relatedBooks, sources, seoDescription`。
2. `category` 取 `start | product | operations | marketing | finance | cases`；`relatedTools` / `relatedBooks` 用 `content/data/` 里已有的 slug。
3. 正文用 `##` / `###` 分节（自动进入目录），可插入 `[[chart:cost-structure]]` 或 `[[tool:breakeven]]`；图表 ID 见 `lib/charts.ts`，工具 slug 见 `content/data/tools.json`。
4. 站内链接写绝对路径（如 `/articles/eight-metrics`），渲染时交给 `next/link`，子路径部署自动加前缀。
5. 需要首页露出时，把 slug 加进 `content/data/picks.json`；需要挂到开店路线图时，加进 `content/data/roadmap.json` 对应阶段的 `articles`。
6. 跑 `npm run typecheck && npm test && npm run build`；改了外链再跑 `npm run verify:links`。

完整的实体字段、仓储接口契约与未来后台写入接口见 [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md)。

## 设计方向

参考 `yuxin.run/live-better` 的**暖纸色 / 深墨色 / 克制强调色**编辑式设计语言，色彩数值、排版比例与组件形态均为本站独立定义。

| Token | 值 | 用途 |
| --- | --- | --- |
| `--paper` | `#FAF7F1` | 页面底色（温暖米白） |
| `--surface` / `--surface-2` | `#FFFFFF` / `#F6F0E7` | 卡片与淡暖灰 |
| `--ink` / `--ink-2` / `--muted` | `#221E18` / `#4A4238` / `#6E6557` | 文字层级 |
| `--accent` | `#C04A2B` | 番茄红，强调与关键数字 |
| `--olive` / `--gold` | `#5F8468` / `#C08C30` | 辅助色、正向与提示 |
| `--line` | `#E7DFCF` | 分割线 |

- 内容宽度 1200px，正文 16.5px / 1.78，标题 `clamp()` 响应式，章节间距 64–96px
- 卡片 12px 圆角、1px 细线、极轻阴影；悬停只做 3px 位移与描边变化
- 系统中文无衬线字体栈（PingFang SC / Microsoft YaHei / Noto Sans SC），数字使用等宽数字
- 桌面端双栏 / 三栏杂志式布局，移动端单栏；图表容器随 `ResizeObserver` 自适应
- 尊重 `prefers-reduced-motion`，动效可关闭；文章可调节正文字号

## 目录结构

```
.github/workflows/deploy-pages.yml   GitHub Actions 自动构建并部署 GitHub Pages
app/                    页面与路由（首页、6 频道、文章、品牌、书籍、工具、避坑、搜索、收藏、关于）
app/site-selection/     餐饮选址实验室独立频道（首页、路线图、指南、现场、谈判、合同、案例、工具、图表、报告）
app/api/content/        只读内容 API（仅服务端部署可用）
components/
  ui/                   设计系统基础组件（卡片、封面、章节标题、页头、迷你趋势图）
  layout/               顶栏、移动菜单、搜索面板、页脚
  home/                 首页各区块
  charts/               ECharts 封装、图表卡片、交互式盈亏平衡 / 趋势图
  articles/             文章卡片、阅读器、Markdown 渲染、收藏按钮、列表筛选
  tools/                数据驱动的实时计算器
  site-selection/       选址模块组件、文章阅读器与 8 个工具（tools/ 子目录）
  brands/ search/ favorites/ guide/   对应交互组件
content/
  articles/*.md         19 篇实战长文（front matter + 正文）
  data/*.json           分类、指标、路线图、书籍、网站、品牌、避坑、工具、来源、精选、主题路径、热门问题、链接报告
  site-selection/       选址模块 10 份 JSON 数据 + articles/ 下 20 篇实战长文
lib/                    类型、仓储层、内容读取、搜索、计算内核、图表配置、站点 URL、本地状态
lib/site-selection/     选址模块类型、数据、文章仓储、纯函数计算、本地持久化、导出、图表配置
docs/CONTENT_MODEL.md   数据模型、后台写入接口契约、SEO 说明
scripts/
  build-pages.mjs       GitHub Pages 静态构建（设置 export / basePath / trailingSlash）
  verify-links.mjs      外链核验脚本
tests/                  计算器单元测试（vitest）
```

## 内容标注规则

- **演示数据**：所有图表、指标卡与计算器初始值，都标注「演示数据 · 不是行业平均值」。
- **模拟情景**：文章与避坑库的案例明确写「模拟情景 / 演示计算」，不冒充真实门店数据。
- **真实资料**：书籍、作者、网址、机构与品牌公开渠道都标注来源；品牌营收 / 门店数等具体数值一律引导到年报或交易所公告，本站不引用未经核实的数字。
- **国外经验**：写明适用条件，不直接套用美国 / 英国的用工、租金、小费与费率环境。
- **合规**：食品安全、消防、劳动、税务与经营许可一律提示以所在地现行法规与监管部门意见为准。

外链由 `npm run verify:links` 批量核验，结果写入 `content/data/link-check.json`；403（反爬）标为「自动访问受限」，本机未连通标为「待人工确认」，绝不把未验证地址写成已确认。

## 部署

### GitHub Pages（自动部署，已配置）

`.github/workflows/deploy-pages.yml` 在推送 `main` 或手动触发时依次执行 `npm ci` → `npm run typecheck` → `npm test` → `npm run build:pages`，再把 `out/` 发布到 GitHub Pages。

首次启用只需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**（工作流中的 `actions/configure-pages` 会尝试自动启用；权限不足时手动设置一次即可）。随后推送 `main`，或在 **Actions → Deploy to GitHub Pages → Run workflow** 手动运行。本站地址为 <https://yuxinrun.github.io/restaurant-playbook/>。

`npm run build:pages` 由 `scripts/build-pages.mjs` 驱动：按 `GITHUB_REPOSITORY` 推导站点地址，启用 `output: 'export'`、`basePath` 与 `trailingSlash`，并生成 `out/.nojekyll`。可用环境变量覆盖：

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `GITHUB_REPOSITORY` | `yuxinrun/restaurant-playbook` | 推导站点地址与子路径 |
| `NEXT_PUBLIC_SITE_URL` | `https://<owner>.github.io/<repo>` | canonical、Open Graph、sitemap、JSON-LD |
| `NEXT_PUBLIC_BASE_PATH` | `/<repo>` | 子路径前缀；绑定自定义域名时设为空 |
| `NEXT_PUBLIC_TRAILING_SLASH` | `true` | 目录式 URL（`/about/`） |

> GitHub Pages 是纯静态托管，不能运行 Route Handler。静态构建期间 `app/api` 会被临时移出并在结束后还原（源码与服务端部署不受影响），因此 `/api/content/*` 只在 Node / Vercel 等服务端部署中可用。本地预览 `out/` 时需把目录挂载到同名子路径，链接才会带上 `/<repo>` 前缀。

### Vercel / Node 服务

1. 设置环境变量 `NEXT_PUBLIC_SITE_URL=https://你的域名`（未设置时默认 `http://localhost:3000`）。
2. 构建命令 `npm run build`，用 `npm start` 启动或交由平台自动识别。
3. 部署后访问 `/sitemap.xml`、`/robots.txt` 确认域名正确。
4. 内容更新只需编辑 `content/` 下的 Markdown / JSON 并重新部署；接数据库 / 后台的方案见 `docs/CONTENT_MODEL.md`。

## 验证

```bash
npm run typecheck   # 通过
npm test            # 16/16 通过
npm run build       # 服务端模式构建（含动态只读 API）
npm run build:pages # 76 个静态页面输出到 out/（GitHub Pages 模式）
```

生产服务主要路由、`/sitemap.xml`、`/robots.txt`、404 与只读 API 均已做过 HTTP 冒烟检查。

> 本项目不依赖外部图片、不加载外部字体、不需要数据库或密钥即可完整运行。
