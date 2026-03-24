import { NextResponse } from 'next/server';
import { meiliClient } from '@/lib/meilisearch';
import { rerank, SearchHit } from '@/lib/scoring';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ hits: [] });
    }

    const index = meiliClient.index('focus_engine_docs');
    // Fetch more candidates so the custom re-ranker has a larger pool to sort
    const searchRes = await index.search(q, {
      attributesToRetrieve: ['id', 'title', 'url', 'description', 'keywords'],
      limit: 100,
    });

    // Apply custom re-ranking and return top 50
    const reranked = rerank(searchRes.hits as SearchHit[], q).slice(0, 50);

    return NextResponse.json({ hits: reranked });
  } catch (err: any) {
    console.error(err);
    // If index doesn't exist yet (no crawled data), Meilisearch throws index_not_found. Return empty hits.
    if (err.code === 'index_not_found') {
      return NextResponse.json({ hits: [] });
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
