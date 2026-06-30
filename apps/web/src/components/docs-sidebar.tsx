"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-7 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
            {section.title}
          </div>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block border-l px-3 py-1.5 transition-colors",
                      active
                        ? "border-[#ef4857] font-medium text-neutral-950"
                        : "border-transparent text-neutral-400 hover:text-neutral-950",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
