"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Check, BookOpen, Clock, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

type Topic = {
  id: string;
  title: string;
  nextRevisionDate: Date;
  revisionCount: number;
};

const gitaQuotes = [
  {
    hindi: "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं।",
    english: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
    source: "2.47"
  },
  {
    hindi: "मनुष्य को चाहिए कि वह अपने मन से अपना उद्धार करे और खुद को कभी नीचे न गिराए।",
    english: "Elevate yourself through the power of your mind, and do not degrade yourself.",
    source: "6.5"
  },
  {
    hindi: "हे धनंजय! सफलता या विफलता की आसक्ति को त्यागकर समभाव से अपना कर्म करो।",
    english: "Perform your duty equipoised, abandoning all attachment to success or failure.",
    source: "2.48"
  },
  {
    hindi: "जो श्रद्धायुक्त है और जिसने अपनी इंद्रियों को वश में कर लिया है, वही सच्चा ज्ञान प्राप्त करता है।",
    english: "A faithful man who is dedicated to knowledge and subdues his senses achieves such knowledge.",
    source: "4.39"
  }
];

export function DashboardClient({ initialTopics, isAuthenticated }: { initialTopics: Topic[], isAuthenticated: boolean }) {
  const [topics, setTopics] = useState(initialTopics);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Quote rotation
    const int = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % gitaQuotes.length);
    }, 8000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    // Sync logic after login
    if (isAuthenticated) {
      const pendingTopic = localStorage.getItem("pending_revision_topic");
      if (pendingTopic) {
        setIsAdding(true);
        fetch("/api/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: pendingTopic }),
        }).then(res => {
          if (res.ok) {
            toast.success("Saved your entry from before login!");
            setTopics(prev => [
              ...prev, 
              // Optimistically add to UI if needed, though they aren't due today anyway
            ]);
          }
        }).finally(() => {
          localStorage.removeItem("pending_revision_topic");
          setIsAdding(false);
        });
      }
    }
  }, [isAuthenticated]);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    
    if (!isAuthenticated) {
      localStorage.setItem("pending_revision_topic", newTopic.trim());
      signIn("google", { callbackUrl: '/' });
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTopic }),
      });
      
      if (!res.ok) throw new Error("Failed to add topic");
      
      toast.success("Topic added to your queue!");
      setNewTopic("");
    } catch (e) {
      toast.error("Failed to add topic");
    } finally {
      setIsAdding(false);
    }
  };

  const handleMarkDone = async (id: string, title: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/topics/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      
      // Remove from UI optimistically
      setTopics(topics.filter(t => t.id !== id));
      toast.success(`Nailed it! ${title} reviewed.`, { icon: '🧠' });
    } catch (e) {
      toast.error("Failed to mark done");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-8 sm:gap-16">
      <header className="flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          ReviseFlow
        </h1>
        
        <div className="min-h-[160px] sm:min-h-[128px] flex items-center justify-center relative w-full max-w-3xl mt-2 px-2 sm:px-4">
          {gitaQuotes.map((quote, i) => (
            <div 
              key={i} 
              className={`absolute flex flex-col items-center justify-center gap-2 transition-all duration-1000 w-full ${i === quoteIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
            >
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400 text-center tracking-wide font-serif drop-shadow-sm leading-tight">
                {quote.hindi}
              </p>
              <div className="flex flex-col items-center sm:items-end max-w-2xl w-full">
                <p className="text-xs sm:text-sm md:text-base font-medium text-neutral-500 dark:text-neutral-400 text-center italic text-balance w-full leading-relaxed">
                  "{quote.english}"
                </p>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400/80 dark:text-neutral-600 mt-2 sm:pr-6 md:pr-10">
                  — Bhagavad Gita, {quote.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150px] bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] rounded-full -z-10 pointer-events-none" />
        <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            What did you study today?
          </h2>
          <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. React Hooks, Cellular Respiration..."
              className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-5 py-3.5 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-800 placeholder:text-neutral-400 transition-all font-medium"
              required
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3.5 rounded-2xl text-base sm:text-lg font-bold hover:scale-105 active:scale-95 transition-all whitespace-nowrap shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              {isAdding ? "Adding..." : (isAuthenticated ? "Add Topic" : "Add & Login")}
            </button>
          </form>
        </section>
      </div>

      {isAuthenticated && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Revisions</h2>
            <span className="text-sm font-medium px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300">
              {topics.length} due
            </span>
          </div>
          
          {topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <div className="w-20 h-20 bg-white dark:bg-neutral-950 shadow-sm rounded-full flex items-center justify-center mb-6 text-4xl transform hover:scale-110 transition-transform cursor-default">
                🎉
              </div>
              <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-balance">
                No revisions due today. Enjoy your guilt-free free time or hit the Pomodoro timer for deep work!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold break-words break-all sm:break-normal max-w-[200px] sm:max-w-none pr-2">{topic.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      Revision #{topic.revisionCount}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkDone(topic.id, topic.title)}
                    disabled={loadingId === topic.id}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-all disabled:opacity-50 group-hover:scale-105 active:scale-95"
                    aria-label="Mark as done"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
