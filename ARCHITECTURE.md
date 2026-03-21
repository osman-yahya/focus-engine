# FocusEngine Architecture

## Overview
FocusEngine is a modular, decentralized search engine system separated into a Next.js frontend web interface and independent Node.js backend crawler workers. This decoupled approach allows for infinite scalability, high availability, and easy expansion into heterogeneous storage and indexing paradigms.

## Core Components

### 1. Web Frontend (`/web`)
- **Framework**: Next.js 14 (App Router)
- **Role**: 
  - Exposes the search interface for users with rapid debounced auto-complete optimizations.
  - Exposes the Admin Dashboard for queue management and Crawler Selection.
  - Handles initial HTTP REST APIs to ingest requested crawl targets.
  - Dispatches new jobs to asynchronous worker queues (via BullMQ and Redis) matching the admin's globally active crawler preference.

### 2. Crawler Workers (`/crawler` & `/crawler_new`)
- **Framework**: Node.js, TypeScript, BullMQ, Cheerio
- **Role**:
  - Independent, daemonized processes that autonomously process queue jobs.
  - **Resilient design**: Equipped with robust `uncaughtException` and `unhandledRejection` guards to ensure processes *never terminate* from malformed HTML inputs or catastrophic external network timeouts. Continues gracefully to the next queue sector upon error.
- **Architectural Plurality**:
  - **Meilisearch Crawler** (`/crawler`): Listens to the `crawlQueue`. Downloads HTML, strips noise, parses keywords via natural language stop-words, and streams indices directly to a Meilisearch cluster for instant fuzzy searching.
  - **PostgreSQL Crawler** (`/crawler_new`): Listens to the `crawlQueue_postgres`. Indexes identical extracted metadata straight into a core relational PostgreSQL database. Eliminates secondary indexing service dependency for simpler infrastructure deployments.

## Indexing Data Structures & Algorithms

To ensure rapid and relevant search capability, FocusEngine applies a specific algorithmic pipeline to raw HTML before injecting the formulated records into the indexing engines.

### 1. Document Extraction Pipeline
When a crawler worker (`crawler` or `crawler_new`) fetches a URL, it executes the following DOM refinement:
1. Validates the `content-type` is strictly `text/html`.
2. Locates the document `<title>` or falls back to the leading `<h1>`.
3. Extracts meta descriptions (`<meta name="description">` or OGP `<meta property="og:description">`).
4. Strips all visual noise DOM nodes: `<script>`, `<style>`, `<noscript>`, `<iframe>`, `<link>`, `<meta>`, `<svg>`.
5. Condenses the entire `<body>` text into a single whitespace-trimmed string, limited to 5,000 characters to cap memory utilization.

### 2. Algorithmic Keyword Generation
If a target page completely lacks `<meta name="keywords">`, FocusEngine dynamically synthesizes them natively utilizing a **Frequency-based Stop-Word elimination algorithm**:
- Converts the 5,000-character text body into an array of lowercase word tokens.
- Drops any word explicitly shorter than 5 characters.
- Filters out common linguistic noise using a heavily predefined `Set` of English/JavaScript syntactic stop-words (e.g., "about", "against", "because", "through", "function", "document").
- Calculates keyword frequency mappings (`Record<string, number>`).
- Sorts strictly by occurrence density and extracts the top 10 most utilized thematic terms.

### 3. Meilisearch Index Payload (JSON Schema)
The original Meilisearch crawler maps the condensed page into the exact following schema payload format:
```json
{
  "id": "aHR0cHM6Ly9leGFtcGxlLmNvbQ",  // Primary Key: base64url encoded URL (Alphanumeric safe structure)
  "url": "https://example.com/",       // Original URI pointer
  "title": "Example Domain",           // Extracted Title
  "description": "This domain...",     // Extracted Meta Description
  "keywords": "domain, examples, ...", // Top 10 algorithm-derived thematic keywords
  "textContent": "This domain is...",  // Raw indexed block (up to 5k chars)
  "indexedAt": "2026-03-21T15:30:00Z"  // ISO-8601 UTC timestamp
}
```
*Note: The engine natively instructs the Meilisearch cluster to map its searchable attributes internally to `['title', 'description', 'keywords', 'textContent']` to prioritize fuzzy typing calculations across those specific parameters.*

## Core Data Structures (Prisma Schema)

The PostgreSQL database acts as the strict source of truth for configuration, relational crawling traversal, and static document ingestion.

### `CrawlJob` (Graph Nodes)
Manages the distributed traversal state of standard links. Implements a Self-Referencing relationship to natively construct acyclic crawl graphs.
```prisma
model CrawlJob {
  id          String     @id @default(uuid())
  url         String
  depth       Int        @default(0)
  status      String     @default("QUEUED") // QUEUED, PROCESSING, ACCOMPLISHED, ERROR
  errorLog    String?
  rootUrl     String?    // The distinct website domain tree entrypoint
  parentId    String?    // Reference to the parent job that discovered this URL
  parent      CrawlJob?  @relation("JobTree", fields: [parentId], references: [id])
  children    CrawlJob[] @relation("JobTree")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### `Document` (Node Payloads)
The static storage table utilized exclusively by the `crawler_new` instance to store scraped web payloads entirely on-premise without API search engines.
```prisma
model Document {
  id          String   @id // Uses base64url encoding of the URL as UUID
  url         String   @unique
  title       String
  description String
  keywords    String   // Generated natively from scraped body text without Stop-words
  textContent String   // Raw unparsed text chunk
  indexedAt   DateTime @default(now())
}
```

### `Setting` (Runtime Context)
Global atomic flags loaded dynamically by the Next.js runtime (e.g., controlling `crawlerSelection`).
```prisma
model Setting {
  id    String @id @default(uuid())
  key   String @unique
  value String
}
```

## Infrastructure Queuing Details

BullMQ orchestrates scalable concurrency limits bridging Next.js to the external workers.
- **Transport Layer**: Redis `maxRetriesPerRequest: null`.
- **`crawlQueue`**: Standard jobs bound for the Meilisearch indexer daemon.
- **`crawlQueue_postgres`**: Parallel channel explicitly bound for the Postgres ingestion daemon. Both queues are spawned dynamically natively out of the administrative `Setting` lookup during HTTP job creation.

## Operational Flow

1. **Admin Input**: Admin assigns a root URL to the engine via the dashboard and selects the active crawler type (e.g. Postgres vs Meilisearch).
2. **Settings Parsing**: Next.js reads active configurations dynamically from Postgres (`crawlerSelection`) and drops the target payload onto the specialized Redis stream (`crawlQueue` or `crawlQueue_postgres`).
3. **Async Processing**: The matching worker daemon detects the queued message, fetches the DOM securely via controlled abort-controllers, isolates keywords, strips scripts, and upserts the formulated `Document` entity to the destination datastore.
4. **Depth Traversal**: Child URLs found in the DOM are individually validated (ensuring same-domain compliance) and recursively dispatched to the tail of the exact same associated message queue as independent `CrawlJob` child nodes.
