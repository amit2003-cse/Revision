import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/LogoutButton";
import Script from "next/script";

import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviseFlow - Master Your Learning",
  description: "Boost your productivity and learning with ReviseFlow. Incorporate Pomodoro timers, spaced repetition, and effective study techniques into your routine.",
  keywords: ["Pomodoro", "Spaced Repetition", "Study Timer", "Revision", "Productivity", "Learning", "Focus"],
  openGraph: {
    title: "ReviseFlow - Master Your Learning",
    description: "Boost your productivity and learning with ReviseFlow. Incorporate Pomodoro timers, spaced repetition, and effective study techniques into your routine.",
    url: "https://reviseflow.com",
    siteName: "ReviseFlow",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  let isAdmin = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });
    if (user?.role === "ADMIN") {
      isAdmin = true;
    }
  }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-B4C9N3X4HW" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-B4C9N3X4HW');
        `}
      </Script>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar isAdmin={isAdmin} hasSession={!!session?.user} />
          {children}
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '9999px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
