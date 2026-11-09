import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { SessionHeader } from "@/features/auth/SessionHeader";
import { messages } from "@/lib/copy/messages";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: messages["site.name"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <Suspense fallback={<SiteHeader />}>
          <SessionHeader />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
