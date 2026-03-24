# FocusEngine Ranking Evaluation Guide

This document describes how to manually evaluate and audit the quality of FocusEngine's custom re-ranking system.

---

## How Ranking Works

MeiliSearch retrieves up to 100 candidate documents (typo tolerance, full-text retrieval). A custom scoring function in `web/lib/scoring.ts` then re-orders those candidates before the top 50 are returned to the user.

### Scoring Signals

| Signal | Field | Weight / Effect |
|---|---|---|
| Term match count | `title` | ×5.0 |
| Term match count | `keywords` | ×3.0 |
| Term match count | `description` | ×2.0 |
| Exact phrase match | `title` | +3.0 bonus |
| Exact phrase match | `description` | +1.5 bonus |
| URL path depth | `url` | −0.3 per segment, max −2.0 |
| Term coverage ratio | all fields | ×0.5–1.0 multiplier |

### Final Score Formula

```
rawScore         = Σ(fieldWeightedTermMatches) + exactMatchBonuses
depthPenalty     = min(urlPathDepth × 0.3, 2.0)
coverageMultiplier = 0.5 + 0.5 × (matchedTerms / totalQueryTerms)

finalScore = (rawScore − depthPenalty) × coverageMultiplier
```

---

## How to Run a Manual Evaluation

### Prerequisites

1. Start the stack: `docker compose up`
2. Crawl at least one domain at depth 2 via the Admin panel
3. Wait for crawl jobs to reach `ACCOMPLISHED` status

### Test Procedure

For each query in the test cases below:

1. Open `http://localhost:3000`
2. Type the query into the search box
3. Note the top 3 results (title + URL)
4. Compare against the expected outcome

---

## Test Cases

### 1. Exact title match should rank first

**Query:** the exact title of a page you crawled (e.g. `"About Us"`)

**Expected:**
- The page whose `<title>` contains the exact phrase appears as result #1
- Pages that only mention it in body text appear lower

**Pass criteria:** result #1 URL matches the page with that exact title.

---

### 2. Root domain page outranks deep subpages

**Query:** the domain name you crawled (e.g. `"example"`)

**Expected:**
- `https://example.com/` or `https://example.com/about` appears above `https://example.com/blog/2023/post/title`
- Shorter URL paths rank higher when relevance is equal

**Pass criteria:** result #1 or #2 has URL depth ≤ 1 (root or one segment).

---

### 3. Title match outranks body-only match

**Query:** a word that appears in the title of one page and only in the body text of another

**Expected:**
- The page with the word in its `<title>` ranks above the page that only contains it in body text

**Pass criteria:** the title-matching page appears before the body-only-matching page.

---

### 4. Multi-term query: coverage matters

**Query:** two or three terms that span across different pages (e.g. `"open source privacy search"`)

**Expected:**
- A page matching all three terms ranks above a page matching only one
- The term coverage multiplier should penalize partial matches

**Pass criteria:** pages matching 3/3 query terms appear before pages matching 1/3.

---

### 5. Keyword field boost

**Query:** a word that was extracted as a top keyword for one page but only appears in body text of another

**Expected:**
- The page where the word is a top extracted keyword ranks higher

**Pass criteria:** the keyword-boosted page appears in the top 3.

---

## Common Failure Patterns

| Symptom | Likely Cause | How to Investigate |
|---|---|---|
| Deep subpages outranking root | URL depth penalty not applied | Check `urlDepth()` in `scoring.ts`; verify URL is well-formed |
| Body-only match beating title match | Title weight too low or title field empty | Inspect `hit.title` in API response; check crawl output |
| Partial query match ranks above full match | Coverage multiplier not working | Log `matchedTerms / terms.length` for both hits |
| All results score 0 | Query tokenizes to empty terms | Check for non-ASCII queries; `tokenize()` strips on `\W+` |
| MeiliSearch returns 0 hits | Index not populated or wrong index name | Confirm `focus_engine_docs` index exists in MeiliSearch dashboard |

---

## Adding New Test Cases

When you crawl a new domain, add a test case here:

```
### N. <short description>

**Query:** "<your query>"

**Expected:**
- <what should rank first and why>

**Pass criteria:** <objective, checkable condition>
```

Keep test cases reproducible: they should pass any time the same content is indexed.

---

## Tuning the Weights

If results are unsatisfactory, adjust constants in [web/lib/scoring.ts](../web/lib/scoring.ts):

- Increase `FIELD_WEIGHTS.title` to further boost title matches
- Increase `EXACT_MATCH_BONUS.title` to strongly surface exact-phrase hits
- Decrease `DEPTH_PENALTY_PER_SEGMENT` if deep pages with high relevance are unfairly penalized
- Change the coverage multiplier floor (`0.5`) to be more or less aggressive about partial matches

After any weight change, re-run all test cases in this document to confirm no regressions.
