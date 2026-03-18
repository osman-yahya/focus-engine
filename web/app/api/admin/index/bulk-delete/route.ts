import { NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'meili_master_key',
});

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }
    const index = meiliClient.index('focus_engine_docs');
    await index.deleteDocuments(ids);
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
