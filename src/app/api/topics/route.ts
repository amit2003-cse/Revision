import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, notes } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const sanitizedTitle = title.trim().slice(0, 200);
    const sanitizedNotes = notes ? String(notes).trim().slice(0, 2000) : "";

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1); // First revision tomorrow

    const topic = await prisma.topic.create({
      data: {
        title: sanitizedTitle,
        notes: sanitizedNotes,
        userId: session.user.id,
        nextRevisionDate: nextDate,
        revisionCount: 0,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const topics = await prisma.topic.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        nextRevisionDate: {
          lte: today,
        },
      },
      orderBy: {
        nextRevisionDate: "asc",
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
