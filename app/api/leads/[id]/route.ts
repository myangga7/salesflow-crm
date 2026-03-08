import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    if (lead.assignedToId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("[LEAD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, company, status, source, notes } = body;

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    if (lead.assignedToId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        company,
        status,
        source,
        notes,
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("[LEAD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return new NextResponse("Lead not found", { status: 404 });
    }

    if (lead.assignedToId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.lead.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LEAD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
