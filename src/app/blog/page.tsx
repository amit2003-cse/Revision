import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Science | ReviseFlow",
  description: "Read our deeply researched articles on the science of learning, spaced repetition, the Pomodoro technique, and extreme productivity.",
  keywords: ["Learning Science", "Study Blog", "Productivity Blog", "Pomodoro", "Spaced Repetition"],
};

export default function BlogIndexPage() {
  const articles = [
    {
      title: "The Ebbinghaus Forgetting Curve & Spaced Repetition",
      description: "A deep dive into why we naturally forget things and the scientifically proven method to forcefully cement information into your permanent long-term memory.",
      slug: "spaced-repetition",
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      tag: "Cognitive Science",
      tagColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    },
    {
      title: "The Pomodoro Technique: Mastering Cognitive Overload",
      description: "A definitive guide to using timed intervals to destroy procrastination, maintain absolute focus, and learn faster without burning out.",
      slug: "pomodoro",
      icon: <Clock className="w-6 h-6 text-red-500" />,
      tag: "Productivity",
      tagColor: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 md:py-24 flex flex-col gap-16 relative overflow-hidden min-h-screen">
      
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Hero Section */}
      <header className="text-center flex flex-col items-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center justify-center p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-6 shadow-sm">
          <BookOpen className="w-8 h-8 text-neutral-900 dark:text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-300 dark:to-neutral-600 bg-clip-text text-transparent">
          The Science of Learning
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed text-balance">
          Read our in-depth research on mastering cognition, effectively managing your study time, and learning faster using science.
        </p>
      </header>

      {/* Article Grid */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
        {articles.map((article) => (
          <Link 
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group flex flex-col p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {article.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${article.tagColor}`}>
                {article.tag}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h2>
            
            <p className="text-neutral-500 dark:text-neutral-400 flex-1 leading-relaxed mb-8">
              {article.description}
            </p>

            <div className="flex items-center text-sm font-bold text-neutral-900 dark:text-white mt-auto">
              Read Article
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
