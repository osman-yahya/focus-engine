import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/**
 * @route   POST /api/admin/setup
 * @access  Public (excluded from auth middleware)
 * @desc    First-time setup — creates the initial superadmin account.
 *          Rejects if any admin already exists in the database.
 *
 * @body    { username: string, password: string }
 *
 * @returns {200} { success: true, adminId: string }
 * @returns {400} { error: "Admin already initialized" | "Missing username or password" }
 * @returns {500} { error: "Server error" }
 */
export async function POST(req: Request) {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json({ error: 'Admin already initialized' }, { status: 400 });
    }

    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: {
        username,
        passwordHash,
      },
    });

    return NextResponse.json({ success: true, adminId: admin.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
