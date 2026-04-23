"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import toast from "react-hot-toast";

import { GITA_QUOTES } from "@/lib/constants";

export default function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Persist session count in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro_sessions_today");
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedDate = new Date(parsed.date).toDateString();
      const today = new Date().toDateString();
      if (savedDate === today) {
        setSessionCount(parsed.count);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pomodoro_sessions_today",
      JSON.stringify({ count: sessionCount, date: new Date().toISOString() })
    );
  }, [sessionCount]);

  useEffect(() => {
    const int = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % GITA_QUOTES.length);
    }, 8000);
    return () => clearInterval(int);
  }, []);

  const totalTime = isWork ? workTime * 60 : breakTime * 60;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  // SVG progress ring
  const radius = 120;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const playTimerSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
      };

      playBeep(ctx.currentTime, 880);
      playBeep(ctx.currentTime + 0.2, 1108.73);
    } catch {
      // Audio context not available
    }
  }, []);

  // Use ref for handleSessionEnd to avoid stale closures in timer effect
  const handleSessionEndRef = useRef<() => void>(() => {});

  const handleSessionEnd = useCallback(async () => {
    setIsActive(false);
    playTimerSound();

    toast.success(isWork ? "Focus complete! Take a breather." : "Break is over! Time to focus.", {
      icon: isWork ? "🎯" : "☕",
      duration: 5000,
    });

    // Save to database
    try {
      await fetch("/api/pomodoro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes: isWork ? workTime : breakTime,
          type: isWork ? "WORK" : "BREAK",
        }),
      });
    } catch {
      console.error("Failed to save pomodoro session");
    }

    if (isWork) {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % 4 === 0) {
        setIsWork(false);
        setTimeLeft(longBreakTime * 60);
      } else {
        setIsWork(false);
        setTimeLeft(breakTime * 60);
      }
    } else {
      setIsWork(true);
      setTimeLeft(workTime * 60);
    }
  }, [isWork, workTime, breakTime, longBreakTime, sessionCount, playTimerSound]);

  handleSessionEndRef.current = handleSessionEnd;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionEndRef.current();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      document.title = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} - Pomodoro Flow`;
    } else {
      document.title = "Pomodoro Flow - ReviseFlow";
    }

    return () => {
      document.title = "ReviseFlow";
    };
  }, [timeLeft, isActive]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(isWork ? workTime * 60 : breakTime * 60);
    }
  }, [workTime, breakTime, isWork, isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isWork ? workTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const todayFocusMinutes = sessionCount * workTime;

  return (
    <main className="max-w-6xl mx-auto px-4 pt-4 pb-8 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
        {/* Left Column: Quotes */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <div className="w-full max-w-xl h-48 sm:h-40 flex items-center justify-center lg:justify-start relative">
            {GITA_QUOTES.map((quote, i) => (
              <div
                key={i}
                className={`absolute flex flex-col items-center lg:items-start justify-center gap-4 transition-all duration-1000 w-full ${i === quoteIndex ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}
              >
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 tracking-wide font-serif drop-shadow-sm leading-relaxed">
                  {quote.hindi}
                </p>
                <div className="flex flex-col items-center lg:items-end w-full">
                  <p className="text-sm md:text-base lg:text-lg font-medium text-neutral-500 dark:text-neutral-400 italic text-balance w-full leading-relaxed">
                    &quot;{quote.english}&quot;
                  </p>
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-neutral-400/70 dark:text-neutral-500/80 mt-2">
                    — Bhagavad Gita, {quote.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timer & Controls */}
        <div className="flex flex-col items-center gap-6 lg:gap-8 order-1 lg:order-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Pomodoro Flow
          </h1>

          <div className="flex bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-full p-1.5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            <button
              className={`px-8 py-2.5 rounded-full font-semibold transition-all duration-300 ${isWork ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm scale-100" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 scale-95"}`}
              onClick={() => { setIsWork(true); setIsActive(false); setTimeLeft(workTime * 60); }}
            >
              Focus
            </button>
            <button
              className={`px-8 py-2.5 rounded-full font-semibold transition-all duration-300 ${!isWork ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm scale-100" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 scale-95"}`}
              onClick={() => { setIsWork(false); setIsActive(false); setTimeLeft(breakTime * 60); }}
            >
              Break
            </button>
          </div>

          {/* Timer Circle with SVG Progress Ring */}
          <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
              {/* Background circle */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-neutral-200 dark:text-neutral-800"
              />
              {/* Progress circle */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-linear ${isActive ? (isWork ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500") : "text-neutral-300 dark:text-neutral-700"}`}
              />
            </svg>
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter tabular-nums text-neutral-900 dark:text-white z-10">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${isActive ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700" : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:-translate-y-1"}`}
              aria-label={isActive ? "Pause" : "Play"}
            >
              {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md"
              aria-label="Reset"
            >
              <RotateCcw className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 px-6 py-3.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
              Sessions: <span className="text-neutral-900 dark:text-white ml-2 text-base">{sessionCount}</span>
            </div>
            <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 px-6 py-3.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
              Focus today: <span className="text-neutral-900 dark:text-white ml-2 text-base">{todayFocusMinutes}m</span>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3.5 rounded-2xl transition-all duration-300 border backdrop-blur-sm active:scale-95 ${showSettings ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md" : "bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm hover:shadow-md"}`}
              aria-label="Settings"
            >
              <Settings className={`w-5 h-5 transition-transform duration-500 ${showSettings ? "rotate-90" : "rotate-0"}`} />
            </button>
          </div>

          {showSettings && (
            <div className="flex flex-col gap-5 w-full max-w-sm bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-neutral-700 dark:text-neutral-200">Focus Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={workTime}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(120, Number(e.target.value) || 1));
                      setWorkTime(val);
                    }}
                    className="w-16 h-10 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all shadow-inner"
                  />
                  <span className="text-xs text-neutral-400 font-medium w-6">min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-neutral-700 dark:text-neutral-200">Short Break</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={breakTime}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(60, Number(e.target.value) || 1));
                      setBreakTime(val);
                    }}
                    className="w-16 h-10 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all shadow-inner"
                  />
                  <span className="text-xs text-neutral-400 font-medium w-6">min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-tight text-neutral-700 dark:text-neutral-200">Long Break</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakTime}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(60, Number(e.target.value) || 1));
                      setLongBreakTime(val);
                    }}
                    className="w-16 h-10 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all shadow-inner"
                  />
                  <span className="text-xs text-neutral-400 font-medium w-6">min</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center">
                Long break triggers every 4 focus sessions
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
