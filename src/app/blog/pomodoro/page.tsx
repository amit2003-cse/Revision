import { Metadata } from "next";
import Image from "next/image";
import { Clock, Zap, Target, Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Ultimate Guide to the Pomodoro Technique | ReviseFlow Blog",
  description: "Learn how the Pomodoro Technique can double your productivity, reduce cognitive fatigue, and help you master time management for effective studying.",
  keywords: ["Pomodoro Technique", "Time Management", "Study Hacks", "Productivity", "Focus", "Burnout Prevention", "Cognitive Fatigue"],
  openGraph: {
    title: "Mastering the Pomodoro Technique",
    description: "Learn how the Pomodoro Technique can double your productivity and reduce cognitive fatigue.",
    type: "article",
    url: "https://reviseflow.com/blog/pomodoro",
  }
};

export default function PomodoroArticle() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col gap-12 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <header className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold text-sm uppercase tracking-wider w-fit">
          <Clock className="w-4 h-4" /> Productivity Strategy
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-neutral-900 dark:text-white leading-tight">
          The Pomodoro Technique: Mastering Cognitive Overload
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">
          A definitive guide to using timed intervals to destroy procrastination, maintain focus, and learn faster.
        </p>
      </header>

      <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/50">
        <Image 
          src="/tomato.png" 
          alt="High tech pomodoro timer representing focus" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <article className="prose prose-lg dark:prose-invert prose-neutral max-w-none">
        <h2>The Core Problem: Cognitive Fatigue</h2>
        <p>
          Before we talk about the solution, we need to understand the problem. The human brain is an incredibly powerful engine, but it runs on a limited supply of neurotransmitters and energy resources. Forcing it to maintain absolute intense focus for hours on end without rest leads to <strong>burnout, severe cognitive fatigue, and practically zero information retention.</strong>
        </p>

        <h2>What is the Pomodoro Technique?</h2>
        <p>
          Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique uses a simple timer to break work into hyper-focused intervals (typically 25 minutes in length), separated by short resting breaks (usually 5 minutes). After four consecutive work intervals, you take a longer break (15-30 minutes).
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm my-8 grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-2">
            <Target className="w-8 h-8 text-red-500" />
            <h3 className="m-0 font-bold text-lg">1. Focus (25m)</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">Work intensely on a single task. Zero distractions.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h3 className="m-0 font-bold text-lg">2. Rest (5m)</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">Step away entirely. Let the brain subconsciously process.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <h3 className="m-0 font-bold text-lg">3. Repeat</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">Build momentum. 4 cycles = long 20m break.</p>
          </div>
        </div>

        <h2>Why Does It Work? The Science</h2>
        <p>
          The technique physically enforces biological boundaries. It demands deep, undistracted focus while also strictly demanding that you rest. This rhythm leverages the brain's natural alertness cycles (ultradian rhythms). The short breaks allow your brain to unconsciously consolidate the new information, clear out metabolic waste, and restore neurotransmitter balance so you can tackle the next session at 100% capacity.
        </p>

        <h2>How ReviseFlow Implements Pomodoro</h2>
        <p>
          In ReviseFlow, we have built-in a highly optimized timer specifically tuned for studying. By alternating between focused revision sessions and structured rests, ReviseFlow ensures that you can study effectively for three times longer without ever reaching the point of burnout.
        </p>
      </article>
    </main>
  );
}
