import { NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';
import { prisma } from '@/lib/prisma';

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'meili_master_key',
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'crawlerSelection' } });
    const isPostgres = setting?.value === 'postgres';

    if (isPostgres) {
      const documents = await prisma.document.findMany({ take: 100, orderBy: { indexedAt: 'desc' } });
      return NextResponse.json({ success: true, documents });
    } else {
      const index = meiliClient.index('focus_engine_docs');
      const documents = await index.getDocuments({ limit: 100 });
      return NextResponse.json({ success: true, documents: documents.results });
    }
  } catch (error: any) {
    if (error.code === 'index_not_found') {
      return NextResponse.json({ success: true, documents: [] });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    const setting = await prisma.setting.findUnique({ where: { key: 'crawlerSelection' } });
    if (setting?.value === 'postgres') {
      await prisma.document.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }
    
    const index = meiliClient.index('focus_engine_docs');
    await index.deleteDocument(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
