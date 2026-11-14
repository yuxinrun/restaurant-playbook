import { NextResponse, type NextRequest } from 'next/server';
import { COLLECTION_NAMES, contentRepository, type CollectionName } from '@/lib/cms/repository';

interface RouteContext { params: Promise<{ collection: string }> }

/**
 * 只读内容接口：为后续数据库 / 后台 / AI 检索预留统一读取入口。
 * GET /api/content/articles             → 文章元数据列表
 * GET /api/content/books?id=slug        → 单条记录
 * GET /api/content/tools?limit=3        → 限量返回
 * 第一阶段不开放写操作；写入契约见 docs/CONTENT_MODEL.md。
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { collection } = await context.params;
  if (!COLLECTION_NAMES.includes(collection as CollectionName)) {
    return NextResponse.json(
      { error: 'Unknown collection', available: COLLECTION_NAMES },
      { status: 404 },
    );
  }

  const name = collection as CollectionName;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const limitRaw = Number(searchParams.get('limit'));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : null;

  if (id) {
    const row = await contentRepository.get(name, id);
    return row
      ? NextResponse.json({ collection: name, data: row }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } })
      : NextResponse.json({ error: 'Not found', collection: name, id }, { status: 404 });
  }

  const rows = await contentRepository.list(name);
  const data = limit ? rows.slice(0, limit) : rows;
  return NextResponse.json(
    { collection: name, count: data.length, total: rows.length, data },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } },
  );
}
