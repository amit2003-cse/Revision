import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Fetch user role based on session email
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
        _count: 'desc'
      }
    }
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 relative min-h-[85vh]">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neutral-200/40 dark:bg-neutral-800/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent mb-3">Admin Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg">Platform overview and user statistics</p>
      </header>

      <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200/60 dark:border-neutral-800/60 text-sm">
                <th className="px-6 py-5 font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-5 font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-5 font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-5 font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Topics</th>
                <th className="px-6 py-5 font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">Pomodoros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {users.map((user: { id: string; name: string | null; email: string | null; role: string; _count: { topics: number; pomodoros: number } }) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name || "Anonymous"}</td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user._count.topics}</td>
                  <td className="px-6 py-4">{user._count.pomodoros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
