import { Metadata } from "next";
import Image from "next/image";
import { Brain, ArrowLeft, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Ultimate Guide to Spaced Repetition | ReviseFlow Blog",
  description: "Discover the science behind the Ebbinghaus Forgetting Curve and learn how Spaced Repetition can permanently lock information into your long-term memory.",
  keywords: ["Spaced Repetition", "Ebbinghaus Forgetting Curve", "Memory Hacks", "Active Recall", "Study Science", "Long Term Memory"],
  openGraph: {
    title: "The Science of Spaced Repetition",
    description: "Discover the science behind the Ebbinghaus Forgetting Curve and learn how Spaced Repetition works.",
    type: "article",
    url: "https://reviseflow.com/blog/spaced-repetition",
  }
};

export default function SpacedRepetitionArticle() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col gap-12 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <header className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-sm uppercase tracking-wider w-fit">
          <Brain className="w-4 h-4" /> Cognitive Science
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-neutral-900 dark:text-white leading-tight">
          The Ebbinghaus Forgetting Curve & Spaced Repetition
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">
          A deep dive into why we forget things and the scientifically proven method to forcefully cement information into your permanent logic.
        </p>
      </header>

      <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/50">
        <Image 
          src="/brain.png" 
          alt="Glowing brain representing spaced repetition memory" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <article className="prose prose-lg dark:prose-invert prose-neutral max-w-none">
        <h2>The Brutal Reality of Memory</h2>
        <p>
          In 1885, German psychologist Hermann Ebbinghaus discovered a harsh truth about human biology: <strong className="text-neutral-900 dark:text-white">our brains are fundamentally designed to forget.</strong> 
        </p>
        <p>
          He ran extreme studies on himself, memorizing nonsense syllables and tracking exactly how fast he forgot them. The results formed the famous <strong>Ebbinghaus Forgetting Curve</strong>. Within just 24 hours of originally learning something new, you will naturally forget up to <strong>70%</strong> of that information if you don't use it.
        </p>

        <h2>The Cure: Spaced Interruption</h2>
        <p>
          Ebbinghaus noted something fascinating. Every time he re-studied the material, the rate of forgetting drastically slowed down. Not only that, but if you review that information at specifically <em>spaced intervals</em>—right before your brain is about to forget it—you physically disrupt the curve.
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm my-8 grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <h3 className="m-0 font-bold text-lg">Day 1 Review</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">Resets the curve to 100%. Slows the immediate drop.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <h3 className="m-0 font-bold text-lg">Day 3 & 7</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">Memory gets stronger. The forgetting curve levels out.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="w-8 h-8 text-purple-500" />
            <h3 className="m-0 font-bold text-lg">Permanent Storage</h3>
            <p className="text-sm m-0 text-neutral-500 dark:text-neutral-400">After 5-6 spaced reviews, memory becomes permanent.</p>
          </div>
        </div>

        <h2>Building It Into Your Routine</h2>
        <p>
          It's nearly impossible to manage this scheduling on a piece of paper. If you have 200 topics to learn, figuring out what day 1, 3, 7, 16, and 30 lands on for each specific topic is a cognitive nightmare.
        </p>

        <h2>How ReviseFlow Solves This</h2>
        <p>
          ReviseFlow automates this entire scientific phenomenon. When you add a new topic, our engine schedules the first review for tomorrow (1 day interval). When you successfully review it, our algorithm pushes it to 2 days, then 4 days, 8 days, 16 days, and 32 days automatically. This effortlessly cements the topic into your deep memory with minimal repetitive effort on your end.
        </p>
      </article>
    </main>
  );
}
