import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @route   GET /api/admin/crawler/queue
 * @access  Admin (JWT required)
 * @desc    Returns the most recent 100 CrawlJob entries ordered by creation date.
 *
 * @returns {200} { jobs: Array<{ id, url, depth, status, errorLog, createdAt }> }
 * @returns {500} { error: string }
 */
export async function GET() {
  try {
    const jobs = await prisma.crawlJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent 100 for simplicity
    });

    return NextResponse.json({ jobs });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/admin/crawler/queue?id={jobId}
 * @access  Admin (JWT required)
 * @desc    Deletes a single CrawlJob by its ID.
 *
 * @query   {string} id - The CrawlJob UUID to delete
 *
 * @returns {200} { success: true }
 * @returns {400} { error: "Missing ID" }
 * @returns {500} { error: string }
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.crawlJob.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
