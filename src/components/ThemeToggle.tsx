"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center p-2 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center p-2 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="w-5 h-5 text-neutral-400 hover:text-neutral-100" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-600 hover:text-neutral-900" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
