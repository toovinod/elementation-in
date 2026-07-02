"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

type NavLink = { href: string; label: string; badge?: string };

const groups: { title: string | null; links: NavLink[] }[] = [
  {
    title: null,
    links: [
      { href: "/", label: "Overview" },
      { href: "/playground", label: "Playground" },
      { href: "/docs/installation", label: "Install" },
      { href: "/docs/features", label: "Features" },
      { href: "/docs/prompt-output", label: "Output" },
      { href: "/docs/schema", label: "Schema", badge: "ECS 1.0" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/docs/mcp", label: "MCP" },
      { href: "/docs/rest-api", label: "API" },
      { href: "/docs/webhooks", label: "Webhooks" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/changelog", label: "Changelog" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function SiteSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="border-border sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r px-5 py-6 lg:flex">
      <BrandMark />

      <nav className="mt-9 flex flex-1 flex-col gap-7 overflow-y-auto pr-1">
        {groups.map((group, index) => (
          <div key={group.title ?? `group-${index}`}>
            {group.title ? (
              <p className="text-muted-foreground/70 mb-2 px-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em]">
                {group.title}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {group.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group/link relative flex items-center rounded-md py-1.5 pl-4 pr-2 text-sm transition-colors",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "bg-primary absolute left-0 size-1.5 rounded-full transition-all duration-300",
                          active
                            ? "scale-100 opacity-100"
                            : "scale-0 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-40",
                        )}
                      />
                      <span className="flex-1 transition-transform duration-200 group-hover/link:translate-x-0.5">
                        {link.label}
                      </span>
                      {link.badge ? (
                        <span className="bg-accent text-accent-foreground ml-2 rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider">
                          {link.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-border mt-6 space-y-4 border-t pt-5">
        <Button asChild size="sm" className="group w-full rounded-full">
          <Link href="/dashboard">
            Open dashboard
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
        <div className="text-muted-foreground flex items-center justify-between px-1 text-xs">
          <a
            href="https://github.com/elementation/elementation"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <GithubMark className="size-3.5" />
            GitHub
          </a>
          <span className="font-mono">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
