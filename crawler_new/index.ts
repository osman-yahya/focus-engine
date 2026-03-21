import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in crawler_new:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection in crawler_new:', reason);
});
import { URL } from 'url';

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });

const CRAWL_QUEUE_NAME = 'crawlQueue_postgres';
const crawlQueue = new Queue(CRAWL_QUEUE_NAME, { connection: connection as any });

const worker = new Worker(CRAWL_QUEUE_NAME, async (job) => {
  const { jobId, url, depth } = job.data;
  
  try {
    await prisma.crawlJob.update({ where: { id: jobId }, data: { status: 'PROCESSING' } });

    // Fetch the webpage (timeout 10 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'FocusEngine-Bot/1.0' }, 
      signal: controller.signal as RequestInit["signal"]
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    // We only process HTML
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      throw new Error('Not an HTML page');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Info
    const title = $('title').text().trim() || $('h1').first().text().trim() || url;
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const keywordsMeta = $('meta[name="keywords"]').attr('content') || '';
    $('script, style, noscript, iframe, link, meta, svg').remove();
    const textContent = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000); 

    let keywords = keywordsMeta;
    if (!keywords && textContent) {
      const stopWords = new Set(["about", "above", "after", "again", "against", "all", "and", "any", "are", "because", "been", "before", "being", "below", "between", "both", "but", "could", "did", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "her", "here", "hers", "herself", "him", "himself", "his", "how", "into", "its", "itself", "just", "more", "most", "myself", "now", "off", "once", "only", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "too", "under", "until", "very", "was", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "you", "your", "yours", "yourself", "yourselves", "document", "function", "createelement", "appendchild", "window", "return", "const", "let", "var", "false", "true", "null", "undefined"]);
      const words = textContent.toLowerCase().split(/\W+/).filter(w => w.length > 4 && !stopWords.has(w));
      const counts: Record<string, number> = {};
      words.forEach(w => counts[w] = (counts[w] || 0) + 1);
      keywords = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 10).map(x => x[0]).join(', ');
    }

    // Prepare Document ID (Base64 URL encoding to use as Meilisearch ID)
    const documentId = Buffer.from(url).toString('base64url').replace(/[^a-zA-Z0-9-_]/g, '');

    const document = {
      id: documentId,
      url,
      title,
      description,
      keywords,
      textContent,
      indexedAt: new Date().toISOString()
    };

    // Save to PostgreSQL via Prisma
    await prisma.document.upsert({
      where: { url: document.url },
      update: {
        title: document.title,
        description: document.description,
        keywords: document.keywords,
        textContent: document.textContent,
        indexedAt: new Date(),
      },
      create: {
        id: document.id,
        url: document.url,
        title: document.title,
        description: document.description,
        keywords: document.keywords,
        textContent: document.textContent,
        indexedAt: new Date(),
      }
    });

    // Handle Depth Crawling
    if (depth > 0) {
      const baseUrl = new URL(url);
      const links = new Set<string>();
      
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
          try {
            const absoluteUrl = new URL(href, url);
            if (absoluteUrl.hostname === baseUrl.hostname && absoluteUrl.protocol.startsWith('http')) {
               links.add(absoluteUrl.href.split('#')[0]); // ignore fragments
            }
          } catch(e) {}
        }
      });
      
      // Spawn new jobs (Limit 20 to prevent runaway crawling)
      const uniqueLinks = Array.from(links).slice(0, 20);
      for (const link of uniqueLinks) {
        // Simple check to prevent immediate loops
        const exists = await prisma.crawlJob.findFirst({ where: { url: link } });
        if (!exists) {
          const newJob = await prisma.crawlJob.create({ 
            data: { 
              url: link, 
              depth: depth - 1, 
              status: 'QUEUED',
              parentId: jobId,
              rootUrl: job.data.rootUrl || url,
            }
          });
          await crawlQueue.add('crawl', { jobId: newJob.id, url: link, depth: depth - 1, rootUrl: job.data.rootUrl || url });
        }
      }
    }

    // Mark Accomplished
    await prisma.crawlJob.update({ where: { id: jobId }, data: { status: 'ACCOMPLISHED', errorLog: null } });

  } catch (error: any) {
    console.error(`Error crawling ${url}:`, error.message);
    await prisma.crawlJob.update({ where: { id: jobId }, data: { status: 'ERROR', errorLog: error.message } });
    throw error;
  }
}, { connection: connection as any, concurrency: 5 });

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
});

console.log("Crawler worker started and listening to 'crawlQueue'...");
