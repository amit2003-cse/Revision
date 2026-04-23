import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.topic.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const topic = await prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    // Update title
    if (typeof body.title === "string") {
      const sanitizedTitle = body.title.trim().slice(0, 200);
      if (!sanitizedTitle) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }
      const updatedTopic = await prisma.topic.update({
        where: { id },
        data: { title: sanitizedTitle },
      });
      return NextResponse.json(updatedTopic);
    }

    // Toggle active status
    if (typeof body.isActive === "boolean") {
      const updatedTopic = await prisma.topic.update({
        where: { id },
        data: { isActive: body.isActive },
      });
      return NextResponse.json(updatedTopic);
    }

    // Default action: Mark revision done (spaced repetition logic)
    const intervals = [1, 2, 4, 8, 16, 32]; // Days
    const nextInterval = intervals[Math.min(topic.revisionCount, intervals.length - 1)];

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);

    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        revisionCount: { increment: 1 },
        nextRevisionDate: nextDate,
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
