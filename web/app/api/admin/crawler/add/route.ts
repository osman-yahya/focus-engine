import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crawlQueueMeili, crawlQueuePostgres } from '@/lib/queue';

/**
 * @route   POST /api/admin/crawler/add
 * @access  Admin (JWT required)
 * @desc    Creates a CrawlJob in the database and dispatches it to the appropriate
 *          BullMQ queue based on the active crawlerSelection setting.
 *
 * @body    { url: string, depth?: number }
 *
 * @returns {200} { success: true, jobId: string }
 * @returns {400} { error: "URL is required" }
 * @returns {500} { error: string }
 */
export async function POST(req: Request) {
  try {
    const { url, depth } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Insert into DB
    const crawlJob = await prisma.crawlJob.create({
      data: {
        url,
        depth: depth || 1,
        status: 'QUEUED',
      },
    });

    const setting = await prisma.setting.findUnique({ where: { key: 'crawlerSelection' } });
    const crawlerSelection = setting?.value || 'meilisearch';
    const targetQueue = crawlerSelection === 'postgres' ? crawlQueuePostgres : crawlQueueMeili;

    // Add to BullMQ Queue
    await targetQueue.add('crawl', {
      jobId: crawlJob.id,
      url,
      depth: crawlJob.depth,
    });

    return NextResponse.json({ success: true, jobId: crawlJob.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
