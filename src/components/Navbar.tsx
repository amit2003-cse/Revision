"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LogoutButton } from "./LogoutButton";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Clock, Info, Timer, Shield, LogIn } from "lucide-react";

interface NavbarProps {
  isAdmin: boolean;
  hasSession: boolean;
}

export function Navbar({ isAdmin, hasSession }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/history", label: "History", icon: <Clock className="w-4 h-4" /> },
    { href: "/blog", label: "Blog", icon: <Info className="w-4 h-4" /> },
    { href: "/pomodoro", label: "Timer", icon: <Timer className="w-4 h-4" />, highlight: true },
  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-white dark:text-neutral-900 font-black text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">ReviseFlow</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {isAdmin && (
              <Link href="/admin" className={`text-sm font-bold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2 ${pathname === '/admin' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'}`}>
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-sm font-medium transition-all relative ${link.highlight ? (isActive ? 'bg-red-600 text-white px-4 py-2 rounded-full shadow-md' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20') : (isActive ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white')}`}
                >
                  {link.label}
                  {!link.highlight && isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full animate-in fade-in duration-500" />
                  )}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-800">
              <ThemeToggle />
              {hasSession ? (
                <LogoutButton />
              ) : (
                <button 
                  onClick={() => signIn("google")}
                  className="text-sm font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={toggleMenu}
              className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${isOpen ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'}`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden absolute top-[65px] left-0 right-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 flex flex-col gap-2">
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${pathname === '/admin' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300'}`}
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${link.highlight ? (isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400') : (isActive ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900')}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            {hasSession ? (
              <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <LogoutButton />
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button 
                  onClick={() => signIn("google")}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content shift from fixed nav */}
      <div className="h-16" />
    </>
  );
}
