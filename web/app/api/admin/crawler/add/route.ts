import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crawlQueue } from '@/lib/queue';

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

    // Add to BullMQ Queue
    await crawlQueue.add('crawl', {
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
