import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SiteSidebar } from "@/components/site-sidebar";
import { Button } from "@/components/ui/button";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border bg-background/85 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md lg:hidden">
        <BrandMark />
        <Button asChild size="sm" className="rounded-full px-4">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </header>
      <div className="mx-auto flex w-full max-w-[1280px]">
        <SiteSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
