import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @route   GET /api/admin/settings
 * @access  Admin (JWT required)
 * @desc    Retrieves all global settings as a key-value config object.
 *
 * @returns {200} { config: Record<string, string> }
 * @returns {500} { error: "Server error" }
 */
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const config = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    
    return NextResponse.json({ config });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * @route   POST /api/admin/settings
 * @access  Admin (JWT required)
 * @desc    Upserts global settings. Accepts any key-value pairs; each key is
 *          saved as a separate Setting row via Prisma upsert.
 *
 * @body    Record<string, string> — e.g. { projectName: "My Engine", crawlerSelection: "postgres" }
 *
 * @returns {200} { success: true }
 * @returns {500} { error: "Server error" }
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // UPSERT all settings
    for (const key of Object.keys(data)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(data[key]) },
        create: { key, value: String(data[key]) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
