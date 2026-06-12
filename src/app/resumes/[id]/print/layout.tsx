import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u5bfc\u51fa PDF | \u7b80\u5386\u5de5\u574a",
};

export default function PrintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
