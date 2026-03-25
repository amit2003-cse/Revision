"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Calendar, Brain, Clock, Trash2, CheckCircle2, Circle, Power, Edit2, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

type TopicHistory = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  nextRevisionDate: string;
  revisionCount: number;
  isActive: boolean;
};

export function HistoryClient({ initialTopics }: { initialTopics: TopicHistory[] }) {
  const [topics, setTopics] = useState(initialTopics);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && t.isActive) || 
                           (filterStatus === 'paused' && !t.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [topics, searchTerm, filterStatus]);

  const toggleExpand = (id: string) => {
    if (editingTopicId === id) return; // Prevent collapse while editing inside
    setExpandedId(prev => prev === id ? null : id);
  };

  const startEdit = (topic: TopicHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedId !== topic.id) {
      setExpandedId(topic.id);
    }
    setEditingTopicId(topic.id);
    setEditTitle(topic.title);
  };

  const saveEdit = async (id: string, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim() })
      });
      if (!res.ok) throw new Error();
      setTopics(prev => prev.map(t => t.id === id ? { ...t, title: editTitle.trim() } : t));
      toast.success("Topic updated!");
      setEditingTopicId(null);
    } catch {
      toast.error("Failed to update topic.");
    }
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTopicId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this topic?")) return;
    try {
      const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTopics(prev => prev.filter(t => t.id !== id));
      toast.success("Topic permanently deleted.");
    } catch {
      toast.error("Failed to delete topic.");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      if (!res.ok) throw new Error();
      setTopics(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentActive } : t));
      toast.success(currentActive ? "Revisions paused for this topic." : "Revisions resumed!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const groupedTopics = useMemo(() => {
    return filteredTopics.reduce((acc, topic) => {
      const date = new Date(topic.createdAt).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(topic);
      return acc;
    }, {} as Record<string, TopicHistory[]>);
  }, [filteredTopics]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric'
    });
  };

  const getTimeline = (topic: TopicHistory) => {
    const baseDate = new Date(topic.createdAt);
    let currentBase = new Date(baseDate);
    const intervals = [1, 2, 4, 8, 16, 32];
    
    return intervals.map((gap, index) => {
      currentBase.setDate(currentBase.getDate() + gap);
      const isPast = index < topic.revisionCount;
      const isNext = index === topic.revisionCount;
      const displayDate = isNext ? new Date(topic.nextRevisionDate) : new Date(currentBase);

      return {
        revNumber: index + 1,
        dateString: displayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        isPast,
        isNext
      };
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-8 md:gap-12 relative min-h-[85vh]">
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-blue-500/10 dark:bg-blue-800/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <header className="flex flex-col items-start gap-4">
        <div className="inline-flex items-center justify-center p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-sm">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Your Study Timeline
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-base md:text-lg mt-2">
            Track your cognitive patterns, upcoming schedules, and knowledge retention.
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full md:w-auto">
          {(['all', 'active', 'paused'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === status ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      {Object.keys(groupedTopics).length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-950/50">
           <Brain className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4" />
           <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
             {searchTerm || filterStatus !== 'all' ? 'No Matching Topics' : 'No History Yet'}
           </h3>
           <p className="text-neutral-500 dark:text-neutral-400">
             {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Start learning and adding topics to see your timeline build.'}
           </p>
           {(searchTerm || filterStatus !== 'all') && (
             <button 
               onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}
               className="mt-4 text-sm font-bold text-blue-500 hover:underline"
             >
               Clear all filters
             </button>
           )}
         </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(groupedTopics).map(([date, dayTopics]) => (
            <div key={date} className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h2 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-500 flex items-center gap-2 sticky top-16 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md py-3 shadow-sm rounded-lg px-2 -mx-2">
                <Calendar className="w-3.5 h-3.5" /> {date}
              </h2>
              
              <div className="flex flex-col gap-3">
                {dayTopics.map((topic) => (
                  <div 
                    key={topic.id}
                    className={`flex flex-col bg-white dark:bg-neutral-900 border ${topic.isActive ? 'border-neutral-200 dark:border-neutral-800' : 'border-dashed border-neutral-300 dark:border-neutral-700 opacity-70'} rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${expandedId === topic.id ? 'ring-2 ring-neutral-300 dark:ring-neutral-700 shadow-md' : ''}`}
                  >
                    <div 
                      className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                      onClick={() => toggleExpand(topic.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          {editingTopicId === topic.id ? (
                            <form 
                              onSubmit={(e) => saveEdit(topic.id, e)} 
                              onClick={(e) => e.stopPropagation()} 
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full max-w-md"
                            >
                              <input 
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1 w-full border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                              />
                              <div className="flex items-center gap-1">
                                <button type="submit" className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors shadow-sm">Save</button>
                                <button type="button" onClick={cancelEdit} className="text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors border border-neutral-200 dark:border-neutral-700">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <h3 className={`text-lg font-bold break-words pr-2 ${!topic.isActive ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'}`}>
                              {topic.title}
                            </h3>
                          )}
                          {!topic.isActive && <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-neutral-500 shrink-0">Paused</span>}
                        </div>
                        <div className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5"/> Reps: {topic.revisionCount}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">Added: {formatDate(topic.createdAt)}</span>
                        </div>
                      </div>
                      <button className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-transform duration-300 ${expandedId === topic.id ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      </button>
                    </div>

                    <div className={`grid transition-all duration-300 ease-in-out ${expandedId === topic.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="p-6 flex flex-col md:flex-row gap-8">
                          
                          {/* Timeline Section */}
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-200 mb-4 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500"/> Projected Spaced Repetition Array
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                              {getTimeline(topic).map((step) => (
                                <div key={step.revNumber} className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border transition-all
                                  ${step.isPast ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400' : 
                                  step.isNext ? (topic.isActive ? 'bg-blue-500 text-white border-blue-600 shadow-md transform scale-105' : 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500') : 
                                  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400'}
                                `}>
                                  {step.isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mb-1" /> : step.isNext ? <Clock className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${topic.isActive ? 'animate-pulse' : ''}`} /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5 mb-1 opacity-50" />}
                                  <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider opacity-80">R{step.revNumber}</span>
                                  <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{step.dateString}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Controls Section */}
                          <div className="w-full md:w-48 shrink-0 flex flex-col gap-3">
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-200 mb-1">Manage</h4>
                            <button 
                              onClick={() => handleToggleActive(topic.id, topic.isActive)}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${topic.isActive ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50 dark:hover:bg-orange-900/40' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50 dark:hover:bg-green-900/40'}`}
                            >
                              <Power className="w-4 h-4" /> 
                              {topic.isActive ? 'Pause Revisions' : 'Resume Revisions'}
                            </button>
                            <button 
                              onClick={(e) => startEdit(topic, e)}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-900/40 ${editingTopicId === topic.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={editingTopicId === topic.id}
                            >
                              <Edit2 className="w-4 h-4" /> {editingTopicId === topic.id ? 'Editing...' : 'Edit Topic'}
                            </button>
                            <button 
                              onClick={() => handleDelete(topic.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 dark:text-red-400 dark:bg-red-900/10 dark:hover:bg-red-900/30 dark:border-red-900/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Topic
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
