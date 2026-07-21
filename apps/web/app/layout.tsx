import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StreamiX",
    template: "%s • StreamiX",
  },
  description:
    "Distributed media processing platform built with Go, Redis Streams, FFmpeg, PostgreSQL, S3 and Kubernetes.",
  keywords: [
    "Go",
    "FFmpeg",
    "Redis Streams",
    "Video Processing",
    "Media Pipeline",
    "Kubernetes",
    "Distributed Systems",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}