import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "\u7b80\u5386\u5de5\u574a",
  description: "\u5728\u7ebf\u5236\u4f5c\u3001AI \u6da6\u8272\u5e76\u5bfc\u51fa\u4e13\u4e1a\u4e2d\u6587\u7b80\u5386\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-950">{children}</body>
    </html>
  );
}
