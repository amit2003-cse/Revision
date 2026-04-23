import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_SESSION_TYPES = ["WORK", "BREAK"] as const;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { durationMinutes, type } = body;

    if (!durationMinutes || typeof durationMinutes !== "number" || durationMinutes < 1 || durationMinutes > 120) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    if (!type || !VALID_SESSION_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid session type. Must be WORK or BREAK" }, { status: 400 });
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
