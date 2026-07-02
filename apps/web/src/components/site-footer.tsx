import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/playground", label: "Playground" },
      { href: "/docs/installation", label: "Install" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs/schema", label: "Capture Schema" },
      { href: "/docs/rest-api", label: "REST API" },
      { href: "/docs/source-mapping", label: "Source Mapping" },
      { href: "/colophon", label: "Colophon" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div className="space-y-4">
          <BrandMark />
          <p className="text-muted-foreground max-w-xs text-sm leading-6">
            Visual feedback that gives AI coding agents the exact UI context they need.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-display text-foreground mb-3 text-sm font-medium">{group.title}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row md:px-6">
          <span>© 2026 Elementation</span>
          <span className="font-mono text-xs">elementation.in</span>
        </div>
      </div>
    </footer>
  );
}
