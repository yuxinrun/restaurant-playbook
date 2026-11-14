# 内容数据模型与后台接口预留

第一阶段采用**本地数据驱动**：Markdown（文章正文）+ JSON（结构化实体）。页面不直接读文件，统一通过仓储层访问，后续替换为 Supabase / PostgreSQL 时无需改动页面代码。

## 1. 实体与存储位置

| 实体 | 对应数据表 | 第一阶段文件 | 主键 |
| --- | --- | --- | --- |
| 文章 Articles | `articles` | `content/articles/*.md`（YAML front matter + Markdown 正文） | `slug`（文件名） |
| 分类 Categories | `categories` | `content/data/categories.json` | `id` |
| 标签 Tags | `tags` | 从文章 / 书籍 / 案例的 `tags` 字段聚合 | `name` |
| 书籍 Books | `books` | `content/data/books.json` | `slug` |
| 网站资源 Websites | `websites` | `content/data/websites.json` | `id` |
| 品牌案例 Brands | `brands` | `content/data/brands.json` | `slug` |
| 工具 Tools | `tools` | `content/data/tools.json` | `slug` |
| 图表配置 Charts | `charts` | `lib/charts.ts`（`CHART_META` + option 工厂） | `id` |
| 信息来源 Sources | `sources` | `content/data/sources.json` + 每篇文章的 `sources` + 每个案例的 `sources` | `label` |
| 路线图 / 指标 / 避坑 / 编辑精选 | `roadmap` / `metrics` / `pitfalls` / `picks` | `content/data/*.json` | `id` / `slug` |
| 链接核验 | `link_checks` | `content/data/link-check.json` | `url` |

## 2. 文章 front matter 字段

```yaml
title, subtitle, summary, seoDescription   # 标题、摘要与 SEO
category                                   # start | product | operations | marketing | finance | cases
tags: []                                    # 标签
author, publishedAt, updatedAt, readingMinutes
featured, editorsPick                       # 首页推荐位
cover, coverTone                            # 封面（本站生成的几何封面，不使用外部图片）
chart                                       # 文章主图（与 CHART_META.id 对应）
relatedTools: [], relatedBooks: []           # 关联工具 / 书籍 slug
sources: [{ label, url, note, year }]       # 参考来源
```

正文为 GitHub Flavored Markdown，支持表格、列表、引用与代码块。额外支持两种独立成行的嵌入标记：

- `[[chart:menu-engineering]]` → 插入带标题、解释、演示数据标识的 ECharts 图表卡片
- `[[tool:pricing]]` → 插入对应计算器的入口卡片

> 后续接 MDX：文章正文交给 MDX 渲染，`[[chart:*]]` 可平滑替换为 `<Chart id="..." />`；front matter 字段保持不变。

## 3. 仓储层

`lib/cms/repository.ts` 定义接口：

```ts
interface ContentRepository {
  list<K extends CollectionName>(collection: K): Promise<RepositoryRow<K>[]>;
  get<K extends CollectionName>(collection: K, id: string): Promise<RepositoryRow<K> | null>;
  getArticleBody(slug: string): Promise<Article | null>;
  allArticleBodies(): Promise<Article[]>;
}
```

`LocalContentRepository` 为当前实现。替换为数据库时：新建一个实现同样接口的类（例如 `SupabaseContentRepository`），把导出的 `contentRepository` 换掉即可。列表接口刻意**不携带文章正文**，避免传输放大；正文按需从 `getArticleBody` 获取。

## 4. 只读 API

```
GET /api/content/:collection                 列表
GET /api/content/:collection?id=:slug       单条
GET /api/content/:collection?limit=3        限量
```

`:collection` 取值：`articles | categories | books | websites | brands | tools | pitfalls | roadmap | metrics | sources`。

返回示例：

```json
{ "collection": "tools", "count": 6, "total": 6, "data": [ { "slug": "roi", "...": "..." } ] }
```

第一阶段**不开放写操作**，避免出现没有任何权限控制的后台接口。

> 该接口由 Next.js Route Handler 提供，需要 Node 运行时，适用于 `npm run build` / `npm start`、Vercel 等服务端部署。GitHub Pages 是纯静态托管，`npm run build:pages` 构建期间会临时移出 `app/api` 目录（构建结束自动还原），静态站点不包含 `/api/content/*`。

## 5. 后台写入契约（第二阶段）

接入数据库与鉴权后，建议新增以下接口（均需管理员会话 + CSRF 防护 + Zod 校验）：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/admin/articles` | 新增文章（draft） |
| `PATCH` | `/api/admin/articles/:slug` | 编辑文章 / 改发布状态 |
| `DELETE` | `/api/admin/articles/:slug` | 删除文章（建议软删除） |
| `GET/PATCH` | `/api/admin/categories` | 分类管理 |
| `GET/PATCH` | `/api/admin/books` | 书籍资源管理 |
| `GET/PATCH` | `/api/admin/websites` | 网站导航管理与链接状态 |
| `GET/PATCH` | `/api/admin/brands` | 品牌案例管理 |
| `GET/PATCH` | `/api/admin/home` | 首页推荐内容（mustRead / topTen / toolPicks 等） |

文章表建议字段：`slug, title, subtitle, summary, body_mdx, category_id, tags[], author, published_at, updated_at, reading_minutes, status(draft|published|archived), seo_title, seo_description, cover, sources(jsonb), related_tools[], related_books[]`。

写入时保留 `updated_at` 自动更新，并对 `sources` 做 URL 校验；发布前跑一次 `npm run verify:links`。

## 6. 内容质量规则

- 真实资料标注来源，数据注明年份与统计口径。
- 演示数据、模拟情景、观点分析、原始资料四类内容分开标注。
- 不编造书名、作者、网址、报告与品牌经营数据；无法核实的条目不收录，改以主题资料路径呈现。
- 不转载付费内容；书籍只做原创介绍与短篇观点摘要。
- 食品安全、消防、劳动、税务等事项一律提示以所在地现行法规为准。

## 7. SEO 与输出

- 静态生成：`generateStaticParams` 覆盖文章、书籍、品牌、工具详情页。
- 每页 `generateMetadata`（title / description / Open Graph / canonical）。
- `app/sitemap.ts`、`app/robots.ts` 输出站点地图与抓取规则。
- 首页输出 `WebSite` + `SearchAction` JSON-LD，文章页输出 `Article` JSON-LD。
- 部署前设置 `NEXT_PUBLIC_SITE_URL`，否则 canonical / sitemap 使用 `http://localhost:3000`；URL 统一由 `lib/site.ts` 生成。
- GitHub Pages 子路径部署还需 `NEXT_PUBLIC_BASE_PATH` 与 `NEXT_PUBLIC_TRAILING_SLASH=true`，由 `npm run build:pages` 自动设置。
