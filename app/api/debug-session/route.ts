import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  console.log("=== DEBUG SESSION ===");
  console.log("Session:", JSON.stringify(session, null, 2));

  return NextResponse.json({
    session: session,
    user: session?.user,
    userId: session?.user?.id,
  });
}
