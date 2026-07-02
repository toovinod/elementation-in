import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      <body className={`${inter.variable} ${newsreader.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
