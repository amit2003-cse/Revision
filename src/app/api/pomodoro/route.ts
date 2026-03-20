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
    const { durationMinutes, type } = body;

    if (!durationMinutes || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pomodoro = await prisma.pomodoroSession.create({
      data: {
        durationMinutes,
        type,
        userId: session.user.id,
      },
    });

    return NextResponse.json(pomodoro, { status: 201 });
  } catch (error) {
    console.error("Error creating pomodoro session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
