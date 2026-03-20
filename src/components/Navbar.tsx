"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LogoutButton } from "./LogoutButton";
import { Menu, X, Home, Clock, Info, Timer, Shield } from "lucide-react";

interface NavbarProps {
  isAdmin: boolean;
  hasSession: boolean;
}

export function Navbar({ isAdmin, hasSession }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/history", label: "History", icon: <Clock className="w-4 h-4" /> },
    { href: "/about", label: "The Science", icon: <Info className="w-4 h-4" /> },
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
          <div className="hidden md:flex items-center gap-6">
            {isAdmin && (
              <Link href="/admin" className="text-sm font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${link.highlight ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-800">
              <ThemeToggle />
              {hasSession && <LogoutButton />}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 flex flex-col gap-2">
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${link.highlight ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {hasSession && (
              <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <LogoutButton />
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
