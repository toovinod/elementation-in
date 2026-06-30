import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#fbfaf8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#2f6fed]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          asChild
          size="sm"
          className="rounded-full bg-[#2f6fed] px-4 text-white hover:bg-[#255fd7]"
        >
          <Link href="/dashboard">
            Dashboard <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
