import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test koneksi dengan query sederhana
    const result = await prisma.$queryRaw`SELECT 1 as connected`;

    return NextResponse.json({
      success: true,
      message: "Database connected!",
      result: result,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
