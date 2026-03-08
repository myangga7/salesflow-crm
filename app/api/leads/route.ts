import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, company, status, source, notes } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        status: status || "NEW",
        source,
        notes,
        assignedToId: session.user.id,
        tags: [],
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("[LEADS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      where: { assignedToId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("[LEADS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
