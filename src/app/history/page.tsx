import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HistoryClient } from "@/components/HistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const topics = await prisma.topic.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      nextRevisionDate: true,
      revisionCount: true,
      isActive: true,
    },
  });

  // Safely serialize dates for the client boundary
  const serializableTopics = topics.map((t: any) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    nextRevisionDate: t.nextRevisionDate.toISOString(),
  }));

  return <HistoryClient initialTopics={serializableTopics} />;
}
