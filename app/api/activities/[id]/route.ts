import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/activities/[id] - Ambil detail activity
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    if (!activity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    if (activity.userId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("[ACTIVITY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH /api/activities/[id] - Update activity
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, title, description, dueDate, completed } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Cek apakah activity ada dan milik user
    const existingActivity = await prisma.activity.findUnique({
      where: { id: params.id },
    });

    if (!existingActivity || existingActivity.userId !== user.id) {
      return new NextResponse("Activity not found or unauthorized", {
        status: 404,
      });
    }

    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: {
        type,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("[ACTIVITY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/activities/[id] - Hapus activity
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Cek apakah activity ada dan milik user
    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
    });

    if (!activity || activity.userId !== user.id) {
      return new NextResponse("Activity not found or unauthorized", {
        status: 404,
      });
    }

    await prisma.activity.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ACTIVITY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
