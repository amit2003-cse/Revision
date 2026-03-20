import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  let topics: any[] = [];
  
  if (session?.user?.id) {
    // Fetch topics due today or earlier
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    topics = await prisma.topic.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        nextRevisionDate: {
          lte: today,
        },
      },
      orderBy: {
        nextRevisionDate: 'asc',
      },
      select: {
        id: true,
        title: true,
        nextRevisionDate: true,
        revisionCount: true
      }
    });
  }

  return <DashboardClient initialTopics={topics} isAuthenticated={!!session?.user} />;
}
