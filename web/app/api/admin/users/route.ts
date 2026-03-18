import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, admins });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { username, passwordHash, role: role || 'ADMIN' },
    });
    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, role: admin.role } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, role } = await req.json();
    const admin = await prisma.admin.update({
      where: { id },
      data: { role },
    });
    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, role: admin.role } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const total = await prisma.admin.count();
    if (total <= 1) {
      return NextResponse.json({ success: false, error: 'Cannot delete the only admin' }, { status: 400 });
    }
    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
