import { NextResponse } from 'next/server';
import { meiliClient } from '@/lib/meilisearch';
import { rerank, SearchHit } from '@/lib/scoring';

/**
 * @route   GET /api/search
 * @access  Public
 * @desc    Search the FocusEngine index using Meilisearch with custom re-ranking.
 *
 * @query   {string} q - The search query string (required)
 *
 * @returns {200} { hits: Array<{ id, title, url, description }> }
 *          Returns up to 50 re-ranked results. Empty array if no query or no matches.
 * @returns {500} { error: "Search failed" }
 *          Returned on unexpected server errors (excludes index_not_found which returns empty hits).
 */
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
