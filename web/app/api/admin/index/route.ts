import { NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'meili_master_key',
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const index = meiliClient.index('focus_engine_docs');
    const documents = await index.getDocuments({ limit: 100 });
    return NextResponse.json({ success: true, documents: documents.results });
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
    const index = meiliClient.index('focus_engine_docs');
    await index.deleteDocument(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
