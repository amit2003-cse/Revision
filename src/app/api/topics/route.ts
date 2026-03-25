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

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingTopic = await prisma.topic.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfDay,
        },
      },
      orderBy: {
        createdAt: 'asc', // append to the first one created today
      },
    });

    if (existingTopic) {
      const updatedTopic = await prisma.topic.update({
        where: { id: existingTopic.id },
        data: {
          title: `${existingTopic.title} • ${title}`,
          notes: notes ? `${existingTopic.notes}\n${notes}` : existingTopic.notes,
        },
      });
      return NextResponse.json(updatedTopic, { status: 200 });
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1); // Tomorrow default spaced repetition

    const topic = await prisma.topic.create({
      data: {
        title,
        notes: notes || "",
        userId: session.user.id,
        nextRevisionDate: nextDate,
        revisionCount: 0,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating topic:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's start and end date for filtering
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const topics = await prisma.topic.findMany({
      where: {
        userId: session.user.id,
        nextRevisionDate: {
          lte: today, // Fetch topics due today or before today
        },
      },
      orderBy: {
        nextRevisionDate: 'asc',
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
