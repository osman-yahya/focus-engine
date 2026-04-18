import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @route   POST /api/admin/crawler/bulk-delete
 * @access  Admin (JWT required)
 * @desc    Deletes multiple CrawlJobs by their IDs in a single batch operation.
 *
 * @body    { ids: string[] } — Array of CrawlJob UUIDs to delete
 *
 * @returns {200} { success: true, deleted: number }
 * @returns {400} { success: false, error: "No IDs provided" }
 * @returns {500} { success: false, error: string }
 */
export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }
    await prisma.crawlJob.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
