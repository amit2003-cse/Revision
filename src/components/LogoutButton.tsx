"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium flex items-center gap-1.5 bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95 border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm"
      aria-label="Logout"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
