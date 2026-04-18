import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * @route   POST /api/admin/login
 * @access  Public (excluded from auth middleware)
 * @desc    Authenticates an admin user and sets an httpOnly JWT cookie.
 *
 * @body    { username: string, password: string }
 *
 * @returns {200} { success: true } + Sets 'adminToken' cookie (httpOnly, 24h expiry)
 * @returns {400} { error: "Missing credentials" }
 * @returns {401} { error: "Invalid credentials" }
 * @returns {500} { error: "Server error" }
 */
export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ sub: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
