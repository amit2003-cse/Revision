import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Timer, ShieldCheck, type LucideIcon } from "lucide-react";

type UserWithCounts = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  _count: { topics: number; pomodoros: number };
};

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (currentUser?.role !== "ADMIN") {
    return (
      <main className="min-h-[85vh] flex items-center justify-center p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 dark:bg-red-900/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <div className="text-center p-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-[2rem] border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">Access Denied</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">You must be an admin to view this page.</p>
        </div>
      </main>
    );
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { topics: true, pomodoros: true },
      },
    },
    orderBy: {
      topics: {
        _count: "desc",
      },
    },
  });

  const typedUsers = users as UserWithCounts[];
  const totalTopics = typedUsers.reduce((sum: number, u: UserWithCounts) => sum + u._count.topics, 0);
  const totalPomodoros = typedUsers.reduce((sum: number, u: UserWithCounts) => sum + u._count.pomodoros, 0);
  const adminCount = typedUsers.filter((u: UserWithCounts) => u.role === "ADMIN").length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Total Topics", value: totalTopics, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Pomodoro Sessions", value: totalPomodoros, icon: Timer, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Admins", value: adminCount, icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 relative min-h-[85vh]">
      <div className="absolute top-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-neutral-200/40 dark:bg-neutral-800/20 blur-[100px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />

      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent mb-3">
          Admin Dashboard
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium text-base md:text-lg">
          Platform overview and user statistics
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 p-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
            </div>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight">{stat.value}</span>
            <span className="text-[10px] md:text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* Users Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Manage Users</h2>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          {typedUsers.length} total
        </span>
      </div>

      {/* Desktop View: Table */}
      <section className="hidden md:block bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200/60 dark:border-neutral-800/60 text-sm">
                <th className="px-6 py-5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">User</th>
                <th className="px-6 py-5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Email</th>
                <th className="px-6 py-5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Role</th>
                <th className="px-6 py-5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Topics</th>
                <th className="px-6 py-5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Sessions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {typedUsers.map((user: UserWithCounts) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900 dark:text-white">{user.name || "Anonymous"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-500 dark:text-neutral-400 text-sm truncate max-w-[200px]">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] rounded-md font-black uppercase tracking-wider ${user.role === "ADMIN" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-700 dark:text-neutral-300">{user._count.topics}</td>
                  <td className="px-6 py-4 font-bold text-neutral-700 dark:text-neutral-300">{user._count.pomodoros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile View: Cards */}
      <section className="md:hidden flex flex-col gap-4">
        {typedUsers.map((user: UserWithCounts) => (
          <div 
            key={user.id}
            className="p-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">{user.name || "Anonymous"}</div>
                <div className="text-xs text-neutral-500 truncate max-w-[180px]">{user.email}</div>
              </div>
              <span className={`px-2.5 py-1 text-[10px] rounded-md font-black uppercase tracking-wider ${user.role === "ADMIN" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}>
                {user.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Topics</span>
                <span className="font-bold text-neutral-900 dark:text-white">{user._count.topics}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Sessions</span>
                <span className="font-bold text-neutral-900 dark:text-white">{user._count.pomodoros}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
