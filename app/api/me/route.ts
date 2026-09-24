import { NextResponse } from "next/server";
import { getCurrentUser, isAdminUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user, isAdmin: user ? isAdminUser(user) : false });
}