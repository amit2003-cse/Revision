import Image from "next/image";
import { Brain, Clock, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 md:py-24 flex flex-col gap-24 relative overflow-hidden">
      
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Hero Section */}
      <header className="text-center flex flex-col items-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center justify-center p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-6 shadow-sm">
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-300 dark:to-neutral-600 bg-clip-text text-transparent">
          The Science of Learning
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed text-balance">
          ReviseFlow is not just a to-do list. It is a scientifically engineered engine built upon two fundamental breakthroughs in human cognitive psychology.
        </p>
      </header>

      {/* Section 1: Spaced Repetition */}
      <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-sm uppercase tracking-wider w-fit">
            <Brain className="w-4 h-4" /> Spaced Repetition
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            The Ebbinghaus Forgetting Curve
          </h2>
          <div className="space-y-4 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <p>
              In 1885, German psychologist Hermann Ebbinghaus discovered a harsh truth: <strong className="text-neutral-900 dark:text-white">our brains are designed to forget.</strong> Within just 24 hours of learning something new, you will naturally forget up to <strong>70%</strong> of it.
            </p>
            <p>
              However, he also discovered the cure. If you review that information at specifically spaced intervals—right before your brain is about to forget it—you physically disrupt the forgetting curve. 
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm mt-4">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-neutral-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                How ReviseFlow uses this:
              </h3>
              <p className="text-base text-neutral-500 dark:text-neutral-400">
                When you add a topic, our engine schedules it for tomorrow (1 day). When you review it, it pushes it to 2 days, then 4, 8, 16, and 32 days. This gradually cements the topic into your permanent long-term memory with minimal effort.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
          <div className="relative aspect-square max-w-[500px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/50 group">
            <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10" />
            <Image 
              src="/brain.png" 
              alt="Glowing mathematical brain representing spaced repetition" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Pomodoro Technique */}
      <section className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-500 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold text-sm uppercase tracking-wider w-fit">
            <Clock className="w-4 h-4" /> The Pomodoro Technique
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Managing Cognitive Overload
          </h2>
          <div className="space-y-4 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <p>
              Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique uses a timer to break work into hyper-focused intervals (typically 25 minutes), separated by short resting breaks (5 minutes).
            </p>
            <p>
              Biologically, the human brain cannot maintain absolute intense focus for hours. Forcing it leads to <strong>burnout, severe cognitive fatigue, and zero retention.</strong> Short breaks allow the brain to unconsciously consolidate information and restore neurotransmitter balance.
            </p>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm mt-4">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-neutral-900 dark:text-white">
                <Zap className="w-5 h-5 text-red-500" />
                How ReviseFlow uses this:
              </h3>
              <p className="text-base text-neutral-500 dark:text-neutral-400">
                Our built-in adjustable timer enforces these scientific boundaries. It forces you to focus deeply without distractions, and strictly demands that you rest, ensuring you can study effectively for 3x longer without burning out.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full animate-in fade-in slide-in-from-left-8 duration-700 delay-500 fill-mode-both">
          <div className="relative aspect-square max-w-[500px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/50 group">
            <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10" />
            <Image 
              src="/tomato.png" 
              alt="Glowing high tech pomodoro timer representing focus" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

    </main>
  );
}
