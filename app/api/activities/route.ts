import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET /api/activities - Ambil semua activities user
export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = { userId: user.id };
    if (leadId) {
      where.leadId = leadId;
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("[ACTIVITIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/activities - Buat activity baru
export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, title, description, leadId, dueDate } = body;

    if (!type || !title || !leadId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Cek apakah lead ada dan milik user
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.assignedToId !== user.id) {
      return new NextResponse("Lead not found or unauthorized", {
        status: 404,
      });
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        leadId,
        userId: user.id,
      },
      include: {
        lead: {
          select: {
            name: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("[ACTIVITIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
