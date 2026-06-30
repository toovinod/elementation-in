import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Elementation - ${siteConfig.tagline}`,
    template: "%s · Elementation",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "AI coding",
    "developer tools",
    "UI feedback",
    "prompt engineering",
    "Cursor",
    "Claude Code",
    "Codex",
  ],
  openGraph: {
    type: "website",
    siteName: "Elementation",
    title: "Elementation",
    description: siteConfig.tagline,
    url: siteConfig.url,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
