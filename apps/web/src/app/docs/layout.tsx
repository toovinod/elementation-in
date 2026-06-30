import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf8]">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-12 px-4 py-10 md:px-6 lg:py-14">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 max-w-3xl flex-1">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
