/**
 * Custom re-ranking layer for FocusEngine search results.
 *
 * MeiliSearch handles retrieval (typo tolerance, fast lookup).
 * This module re-orders the returned hits using explicit, auditable signals.
 */

export type SearchHit = {
  id: string;
  title: string;
  url: string;
  description: string;
  keywords: string;
};

// Field weights for term match counting
const FIELD_WEIGHTS = {
  title: 5.0,
  keywords: 3.0,
  description: 2.0,
} as const;

// Bonus scores for exact phrase match
const EXACT_MATCH_BONUS = {
  title: 3.0,
  description: 1.5,
} as const;

// URL depth penalty per path segment (capped at MAX_DEPTH_PENALTY)
const DEPTH_PENALTY_PER_SEGMENT = 0.3;
const MAX_DEPTH_PENALTY = 2.0;

/**
 * Tokenize a string into lowercase terms, splitting on whitespace and punctuation.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\W]+/)
    .filter((t) => t.length > 0);
}

/**
 * Count how many query terms appear in the target text (case-insensitive).
 * Each distinct term is counted once regardless of how many times it appears.
 */
function countTermMatches(terms: string[], target: string): number {
  const lower = target.toLowerCase();
  return terms.filter((term) => lower.includes(term)).length;
}

/**
 * Compute the number of path segments in a URL.
 * e.g. https://example.com/foo/bar => 2
 *      https://example.com/ => 0
 */
function urlDepth(url: string): number {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').filter((seg) => seg.length > 0).length;
  } catch {
    return 0;
  }
}

/**
 * Score a single search hit against the query string.
 * Higher score = more relevant.
 */
export function scoreResult(hit: SearchHit, query: string): number {
  if (!query.trim()) return 0;

  const terms = tokenize(query);
  if (terms.length === 0) return 0;

  // --- Field-weighted term match score ---
  let rawScore = 0;
  rawScore += countTermMatches(terms, hit.title) * FIELD_WEIGHTS.title;
  rawScore += countTermMatches(terms, hit.keywords) * FIELD_WEIGHTS.keywords;
  rawScore += countTermMatches(terms, hit.description) * FIELD_WEIGHTS.description;

  // --- Exact phrase match bonuses ---
  const lowerQuery = query.toLowerCase().trim();
  if (hit.title.toLowerCase().includes(lowerQuery)) {
    rawScore += EXACT_MATCH_BONUS.title;
  }
  if (hit.description.toLowerCase().includes(lowerQuery)) {
    rawScore += EXACT_MATCH_BONUS.description;
  }

  // --- URL depth penalty ---
  const depthPenalty = Math.min(urlDepth(hit.url) * DEPTH_PENALTY_PER_SEGMENT, MAX_DEPTH_PENALTY);

  // --- Term coverage multiplier ---
  // Ratio of distinct query terms that appear in ANY field (0.5 – 1.0)
  const allText = `${hit.title} ${hit.keywords} ${hit.description}`.toLowerCase();
  const matchedTerms = terms.filter((t) => allText.includes(t)).length;
  const coverageMultiplier = 0.5 + 0.5 * (matchedTerms / terms.length);

  const finalScore = (rawScore - depthPenalty) * coverageMultiplier;
  return finalScore;
}

/**
 * Re-rank an array of MeiliSearch hits using the custom scoring function.
 * Returns a new array sorted by descending score.
 */
export function rerank(hits: SearchHit[], query: string): SearchHit[] {
  return hits
    .map((hit) => ({ hit, score: scoreResult(hit, query) }))
    .sort((a, b) => b.score - a.score)
    .map(({ hit }) => hit);
}
