"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const int = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % gitaQuotes.length);
    }, 8000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionEnd();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Dynamic tab title update
    if (isActive) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      document.title = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} - Pomodoro Flow`;
    } else {
      document.title = 'Pomodoro Flow - ReviseFlow';
    }
    
    return () => {
      document.title = 'ReviseFlow'; // Cleanup slightly
    };
  }, [timeLeft, isActive]);

  useEffect(() => {
    // Reset timer when modes or lengths change
    if (!isActive) {
      setTimeLeft(isWork ? workTime * 60 : breakTime * 60);
    }
  }, [workTime, breakTime, isWork]);

  const playTimerSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
      }
      
      // Happy professional "ding-ding"
      playBeep(ctx.currentTime, 880); // A5
      playBeep(ctx.currentTime + 0.2, 1108.73); // C#6
    } catch (e) {}
  };

  const handleSessionEnd = async () => {
    setIsActive(false);
    
    playTimerSound();
    toast.success(isWork ? "Focus complete! Take a breather." : "Break is over! Time to focus.", {
      icon: isWork ? '🎯' : '☕',
      duration: 5000,
    });
    
    // Save to database
    try {
      await fetch('/api/pomodoro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          durationMinutes: isWork ? workTime : breakTime,
          type: isWork ? 'WORK' : 'BREAK'
        }),
      });
    } catch (e) {
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
  };

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

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-14 text-center min-h-[85vh] justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="flex flex-col items-center w-full px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">Pomodoro Flow</h1>
        
        <div className="h-32 md:h-32 flex items-start justify-center relative w-full max-w-3xl mx-auto mt-2 mb-6">
          {gitaQuotes.map((quote, i) => (
            <div 
              key={i} 
              className={`absolute flex flex-col items-center justify-center gap-2 transition-all duration-1000 w-full ${i === quoteIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
            >
              <p className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400 text-center tracking-wide font-serif drop-shadow-sm leading-relaxed px-4">
                {quote.hindi}
              </p>
              <div className="flex flex-col items-end max-w-lg w-full px-4">
                <p className="text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 text-center italic text-balance w-full">
                  "{quote.english}"
                </p>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400/70 dark:text-neutral-500/80 mt-1.5">
                  — Bhagavad Gita, {quote.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <div className={`relative flex items-center justify-center w-80 h-80 rounded-full border-[8px] sm:border-[12px] transition-colors duration-700 ${isActive ? (isWork ? "border-neutral-900 dark:border-white shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]" : "border-neutral-400 dark:border-neutral-500") : "border-neutral-200 dark:border-neutral-800"}`}>
        <div className="text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums text-neutral-900 dark:text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4">
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
      
      <div className="flex items-center justify-center gap-4 mt-6 w-full">
        <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 px-6 py-3.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
          Completed Sessions Today: <span className="text-neutral-900 dark:text-white ml-2 text-base">{sessionCount}</span>
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
        <div className="flex flex-col gap-5 w-full max-w-sm mt-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300">
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
        </div>
      )}
    </main>
  );
}
