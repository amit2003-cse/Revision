import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  let topics: { id: string; title: string; nextRevisionDate: string; revisionCount: number }[] = [];

  if (session?.user?.id) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const rawTopics = await prisma.topic.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        nextRevisionDate: { lte: today },
      },
      orderBy: { nextRevisionDate: "asc" },
      select: {
        id: true,
        title: true,
        nextRevisionDate: true,
        revisionCount: true,
      },
    });

    topics = rawTopics.map((t: { id: string; title: string; nextRevisionDate: Date; revisionCount: number }) => ({
      ...t,
      nextRevisionDate: t.nextRevisionDate.toISOString(),
    }));
  }

  return (
    <DashboardClient
      initialTopics={topics}
      isAuthenticated={!!session?.user}
    />
  );
}
