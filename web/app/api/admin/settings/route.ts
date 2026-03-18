import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
