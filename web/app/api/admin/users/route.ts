import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = "force-dynamic";

/**
 * @route   GET /api/admin/users
 * @access  Admin (JWT required)
 * @desc    Lists all admin users with id, username, role, and createdAt.
 *
 * @returns {200} { success: true, admins: Array<{ id, username, role, createdAt }> }
 * @returns {500} { success: false, error: string }
 */
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

/**
 * @route   POST /api/admin/users
 * @access  Admin (JWT required)
 * @desc    Creates a new admin user with a hashed password.
 *
 * @body    { username: string, password: string, role?: "SUPERADMIN" | "ADMIN" | "VIEWER" }
 *
 * @returns {200} { success: true, admin: { id, username, role } }
 * @returns {400} { success: false, error: "Username already exists" | "Username and password are required" }
 * @returns {500} { success: false, error: string }
 */
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

/**
 * @route   PATCH /api/admin/users
 * @access  Admin (JWT required)
 * @desc    Updates the role of an existing admin user.
 *
 * @body    { id: string, role: "SUPERADMIN" | "ADMIN" | "VIEWER" }
 *
 * @returns {200} { success: true, admin: { id, username, role } }
 * @returns {500} { success: false, error: string }
 */
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

/**
 * @route   DELETE /api/admin/users
 * @access  Admin (JWT required)
 * @desc    Deletes an admin user. Prevents deletion of the last remaining admin.
 *
 * @body    { id: string }
 *
 * @returns {200} { success: true }
 * @returns {400} { success: false, error: "Cannot delete the only admin" }
 * @returns {500} { success: false, error: string }
 */
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
